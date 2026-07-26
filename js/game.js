// Pelin tila ja säännöt: vuorot, laattojen kääntäminen ja voittoehdot.

import { FLIGHT_PRICE, buildBoard, findMoves, posKey, reachableCities } from './rules.js';
import { createTokenPile } from './tokens.js';
import { PACKS, packById, sourceList } from './pack.js';

export const START_MONEY = 300;
export const SEA_FARE = 100; // laivamatkan hinta vuorolta
export const FIFTY_FIFTY_PRICE = 80; // kahden väärän vaihtoehdon piilotus
export const HINT_PRICE = 40; // sanallinen vihje kysymykseen
export const QUIZ_SECONDS = 45; // vastausaika tiimalasin verran
export const STRANDED_AID = 100; // kotisääntö: jumiin jäänyt saa pankilta 100
export const HARD_BONUS = 100; // palkkio vaikeasta kysymyksestä oikein vastattaessa
export const STAR_PRIZE = 2000; // tähden arvo vaellustilassa, jossa peli ei pääty
export const DUEL_PRIZE = 200; // rosvon saalis, jos kaksintaistelun voittaa suoraan
export const DUEL_BYPASS_SHOES = 3; // näin monella hevosenkengällä rosvon voi ohittaa

// Kysymyksen vaikeustaso: 1 = helppo, 2 = perus (oletus), 3 = vaikea.
export function questionLevel(question) {
  return question.level ?? 2;
}
export { FLIGHT_PRICE };

/** Siemenellinen satunnaisgeneraattori, jotta pelin voi toistaa testeissä. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Game {
  /**
   * @param {{players: Array<{name, color, isBot, start}>, pack?: object, roaming?: boolean, rng?: () => number}} opts
   *   pack = aloituslauta; oletuksena Afrikka.
   *   roaming = vaellustila: ei voittoehtoa, ja porttikaupungeista pääsee
   *   toisille laudoille. Yksin pelattaessa vaellus on aina päällä.
   */
  constructor({ players, pack = packById('africa'), roaming, seed = Math.floor(Math.random() * 2 ** 32), rng }) {
    if (players.length < 1 || players.length > 4) {
      throw new Error('Pelaajia pitää olla 1–4');
    }
    // Arvonnat tulevat siemenestä ja niiden määrä lasketaan, jotta tallennettu
    // peli voidaan palauttaa täsmälleen samaan tilanteeseen.
    this.seed = seed;
    this.rngCalls = 0;
    const source = rng ?? mulberry32(seed);
    this.rng = () => {
      this.rngCalls++;
      return source();
    };
    this.roaming = roaming ?? players.length === 1;
    this.rootPackId = pack.id;
    // Jokainen lauta on oma maailmansa: laatat ja löydöt säilyvät, vaikka
    // pelaaja käy välillä toisella laudalla.
    this.worlds = new Map();
    this.enterWorld(pack);

    this.players = players.map((p, i) => ({
      id: i,
      name: p.name,
      color: p.color,
      isBot: !!p.isBot,
      start: p.start,
      packId: pack.id,
      // 'easy' = helpot kysymykset (esim. lapsipelaajalle), 'normal' = tavalliset
      quizLevel: p.quizLevel === 'easy' ? 'easy' : 'normal',
      money: START_MONEY,
      pos: { type: 'city', city: p.start },
      hasStar: false,
      horseshoes: 0,
      finds: [], // löydetyt laatat tyyppeinä
    }));

    this.current = 0;
    // 'action' = valitse matkustustapa, 'roll' = heitä noppa, 'move' = valitse
    // kohde, 'offer' = kokeile tietovisaa, 'quiz' = kysymys auki
    this.phase = 'action';
    this.travelMode = null;
    this.autoTravel = false;
    this.pendingFare = 0;
    this.die = null;
    this.moves = null;
    this.quiz = null;
    this.duel = null;
    this.duelArmed = false;
    this.usedQuestions = new Set();
    this.lastPath = null;
    this.winner = null;
    this.turnCount = 1;
    this.log = [];
    this.events = []; // näytölle animoitavat tapahtumat
    this.say(null, pack.texts.intro);
    if (this.roaming) {
      this.say(null, 'Vaellus: peli ei pääty — kerää löytöjä ja jatka porttikaupungeista uusille laudoille.');
    }
    this.beginTurn();
  }

  /** Luo laudan tilan, kun sille saavutaan ensimmäistä kertaa. */
  enterWorld(pack) {
    if (this.worlds.has(pack.id)) return this.worlds.get(pack.id);
    const tokenCities = pack.cities.filter((c) => !c.start).map((c) => c.id);
    const pile = createTokenPile(pack.tokens.counts, this.rng);
    if (pile.length !== tokenCities.length) {
      throw new Error(`Laattoja ${pile.length}, kaupunkeja ${tokenCities.length}`);
    }
    const world = {
      pack,
      board: buildBoard(pack.cities, pack.edges),
      tokens: new Map(tokenCities.map((city, i) => [city, pile[i]])),
      revealed: new Map(), // kaupunki -> laattatyyppi
      starFound: false,
      starCity: null,
    };
    this.worlds.set(pack.id, world);
    return world;
  }

  // --- apurit -------------------------------------------------------------

  get player() {
    return this.players[this.current];
  }

  /** Pelaajan lauta ja sen tila. */
  worldOf(player = this.player) {
    return this.worlds.get(player.packId);
  }

  // Vuorossa olevan pelaajan lauta: muu koodi (säännöt, piirto, botit) näkee
  // pelin aina yhden laudan pelinä näiden läpi.
  get world() {
    return this.worldOf();
  }

  get pack() {
    return this.world.pack;
  }

  get board() {
    return this.world.board;
  }

  get tokens() {
    return this.world.tokens;
  }

  get revealed() {
    return this.world.revealed;
  }

  get tokenTypes() {
    return this.pack.tokens.types;
  }

  get airRoutes() {
    return this.pack.airRoutes;
  }

  get starFound() {
    return this.world.starFound;
  }

  set starFound(value) {
    this.world.starFound = value;
  }

  /** Lisää tapahtuman, jonka käyttöliittymä näyttää hetkeksi kartan päällä. */
  emit(kind, text, extra = {}) {
    this.events.push({ kind, text, ...extra });
  }

  /** Poimii kertyneet tapahtumat ja tyhjentää jonon. */
  takeEvents() {
    const events = this.events;
    this.events = [];
    return events;
  }

  say(playerId, text) {
    this.log.unshift({ playerId, text, turn: this.turnCount });
    if (this.log.length > 200) this.log.pop();
  }

  rollDie() {
    return 1 + Math.floor(this.rng() * 6);
  }

  cityOf(player = this.player) {
    const board = this.worldOf(player).board;
    return player.pos.type === 'city' ? board.cityById.get(player.pos.city) : null;
  }

  tokenHere(player = this.player) {
    const city = this.cityOf(player);
    return city && this.worldOf(player).tokens.has(city.id) ? city : null;
  }

  routeName(edgeIdValue, board = this.board) {
    const e = board.edgeById.get(edgeIdValue);
    const a = board.cityById.get(e.a).name;
    const b = board.cityById.get(e.b).name;
    return `${a}–${b}`;
  }

  airportDestinations(player = this.player) {
    const city = this.cityOf(player);
    if (!city || !city.airport || player.money < FLIGHT_PRICE) return [];
    return this.airRoutes
      .filter((r) => r.a === city.id || r.b === city.id)
      .map((r) => (r.a === city.id ? r.b : r.a));
  }

  /**
   * Käytettävissä olevat matkustustavat vuoron alussa.
   *   land = maitse, sea = laivalla (100 p), fly = lentäen (300 p),
   *   stay = jää paikalleen ja kokeile kaupungin kysymystä
   * Kesken reittiä matka jatkuu samalla tavalla kuin se alkoi.
   */
  travelModes(player = this.player) {
    if (this.phase !== 'action') return [];
    if (player.pos.type === 'edge') {
      return [this.board.edgeById.get(player.pos.edge).type];
    }
    const city = this.cityOf(player);
    const edges = this.board.adj.get(city.id).map((id) => this.board.edgeById.get(id));
    const modes = [];
    if (edges.some((e) => e.type === 'land')) modes.push('land');
    if (edges.some((e) => e.type === 'sea') && player.money >= SEA_FARE) modes.push('sea');
    if (this.airportDestinations(player).length) modes.push('fly');
    if (this.tokens.has(city.id)) modes.push('stay');
    return modes;
  }

  /** Mitä nykyinen pelaaja voi tehdä juuri nyt. */
  availableActions() {
    return {
      travel: this.travelModes(),
      roll: this.phase === 'roll',
      quiz: this.phase === 'offer',
      fly: this.phase === 'action' ? this.airportDestinations() : [],
      gateways: this.gatewayOptions(),
    };
  }

  /**
   * Porttikaupungit: muutamasta kaupungista lähtee pitkä lento toiselle
   * laudalle (esim. Kairo on sekä Afrikan että Lähi-idän laudalla). Lento
   * maksaa saman kuin muutkin lennot ja vie koko vuoron, ja karttanäkymä
   * vaihtuu perille saavuttaessa.
   */
  gatewayOptions() {
    if (this.phase !== 'action') return [];
    const city = this.cityOf();
    if (!city || !city.links) return [];
    if (this.player.money < FLIGHT_PRICE) return [];
    return city.links.map((link, index) => ({ ...link, index }));
  }

  /** Onko kaupungista lentoja toiselle laudalle? Kartta merkitsee ne. */
  isGateway(city) {
    return !!(city && city.links && city.links.length);
  }

  /** Lentää porttikaupungista toiselle laudalle. Vie koko vuoron. */
  actionGateway(index) {
    const link = this.gatewayOptions()[index];
    if (!link) return { ok: false, error: 'Täältä ei ole lentoa toiselle laudalle' };
    const p = this.player;
    const pack = packById(link.pack);
    p.money -= FLIGHT_PRICE;
    this.enterWorld(pack);
    p.packId = pack.id;
    p.pos = { type: 'city', city: link.city };
    this.lastPath = null;
    this.say(p.id, `${p.name} lensi ${FLIGHT_PRICE} punnalla: ${link.label}.`);
    this.emit('flight', link.label, { icon: '🧭', sub: `−${FLIGHT_PRICE} puntaa` });
    this.endTurn();
    return { ok: true };
  }

  /**
   * Maailmankartan lennot: vaelluksessa miltä tahansa lentokentältä voi
   * lentää toisen laudan aloituskentälle lennon hinnalla.
   */
  worldDestinations() {
    if (!this.roaming || this.phase !== 'action') return [];
    const city = this.cityOf();
    if (!city || !city.airport || this.player.money < FLIGHT_PRICE) return [];
    return PACKS.filter((p) => p.id !== this.pack.id).map((p) => ({
      pack: p.id,
      label: p.boardLabel,
      city: p.cities.find((c) => c.start).id,
    }));
  }

  /** Lentää maailmankartalla toiselle laudalle. Vie koko vuoron. */
  actionWorldFlight(packId) {
    const dest = this.worldDestinations().find((d) => d.pack === packId);
    if (!dest) return { ok: false, error: 'Sinne ei ole lentoa täältä' };
    const p = this.player;
    const pack = packById(dest.pack);
    p.money -= FLIGHT_PRICE;
    this.enterWorld(pack);
    p.packId = pack.id;
    p.pos = { type: 'city', city: dest.city };
    this.lastPath = null;
    this.say(p.id, `${p.name} lensi ${FLIGHT_PRICE} punnalla laudalle ${pack.boardLabel}.`);
    this.emit('flight', `Lento: ${pack.boardLabel}`, { icon: '🌍', sub: `−${FLIGHT_PRICE} puntaa` });
    this.endTurn();
    return { ok: true };
  }

  /** Voittoruudusta voi jatkaa vaellusta: peli ei enää pääty. */
  continueRoaming() {
    if (this.phase !== 'over' || !this.winner) return { ok: false, error: 'Peli on kesken' };
    this.roaming = true;
    this.winner = null;
    this.phase = 'action';
    this.say(null, 'Retki jatkuu! Peli ei enää pääty — kerätkää löytöjä ja tutkikaa maailmaa porttikaupunkien kautta.');
    this.endTurn();
    return { ok: true };
  }

  // --- vuoron kulku -------------------------------------------------------

  beginTurn() {
    if (this.phase === 'over') return;
    const p = this.player;
    this.die = null;
    this.moves = null;
    this.lastPath = null;
    this.travelMode = null;
    this.pendingFare = 0;
    this.autoTravel = false;

    // Hevosenkenkä tai tähti kotikaupungissa ratkaisee pelin heti vuoron alussa.
    if (this.checkWin()) return;

    if (this.needsAid(p)) {
      p.money += STRANDED_AID;
      this.say(p.id, `${p.name} on jumissa ilman rahaa ja saa pankilta ${STRANDED_AID} puntaa.`);
      this.emit('aid', `${p.name} sai pankilta ${STRANDED_AID} puntaa`, { icon: '💰' });
    }

    // Kun vaihtoehtoja ei ole — esimerkiksi sisämaan kaupungissa tai kesken
    // reittiä — matkustustapa valitaan valmiiksi ja vuoro alkaa suoraan
    // nopanheitosta. Turhaa napinpainallusta ei tarvita.
    const modes = this.travelModes(p);
    this.autoTravel = modes.length === 1 && modes[0] !== 'stay';
    if (this.autoTravel) this.actionTravel(modes[0]);
  }

  /**
   * Kotisääntö: pelaaja saa pankilta rahaa, jos hän ei pysty liikkumaan lainkaan
   * tai jos yhteenkään tavoitteeseen ei pääse niillä rahoilla jotka hänellä on.
   *
   * Ratkaisevaa on riittävätkö rahat, ei se ovatko ne aivan lopussa: 20 punnan
   * kanssa laivalipun takana oleva tavoite on yhtä lailla saavuttamattomissa
   * kuin tyhjin taskuin.
   */
  needsAid(p) {
    // Ilman yhtään matkustustapaa pelaaja ei pääse mihinkään.
    const canTravel = this.travelModes(p).some((m) => m !== 'stay');
    if (!canTravel) return true;

    const racingHome = p.hasStar || (this.starFound && p.horseshoes > 0);
    const goals = racingHome
      ? new Set(this.players.map((pl) => pl.start))
      : new Set(this.tokens.keys());
    if (goals.size === 0) return false;

    const reachable = reachableCities(this.board, p.pos, p.money);
    for (const goal of goals) {
      if (reachable.has(goal)) return false;
    }
    return true;
  }

  endTurn() {
    if (this.phase === 'over') return;
    this.phase = 'action';
    this.current = (this.current + 1) % this.players.length;
    if (this.current === 0) this.turnCount++;
    this.beginTurn();
  }

  /** Valitsee matkustustavan. Maksu peritään vasta kun siirto tehdään. */
  actionTravel(mode) {
    if (this.phase !== 'action') return { ok: false, error: 'Väärä vaihe' };
    if (!this.travelModes().includes(mode)) {
      return { ok: false, error: 'Tuo matkustustapa ei ole nyt käytettävissä' };
    }
    if (mode === 'stay') return this.actionQuiz();

    const p = this.player;
    this.travelMode = mode;
    // Laivalippu maksetaan kun matka lähtee satamasta; merellä jatketaan ilmaiseksi.
    this.pendingFare = mode === 'sea' && p.pos.type === 'city' ? SEA_FARE : 0;
    this.phase = 'roll';
    return { ok: true, mode };
  }

  /** Palaa matkustustavan valintaan ennen nopanheittoa. */
  actionCancelTravel() {
    if (this.phase !== 'roll') return { ok: false, error: 'Väärä vaihe' };
    if (this.autoTravel) return { ok: false, error: 'Muita matkustustapoja ei ole' };
    this.travelMode = null;
    this.pendingFare = 0;
    this.phase = 'action';
    return { ok: true };
  }

  /** Heittää nopan ja laskee mahdolliset päätepisteet valitulla tavalla. */
  actionRoll() {
    if (this.phase !== 'roll') return { ok: false, error: 'Valitse ensin matkustustapa' };
    const p = this.player;
    const die = this.rollDie();
    this.die = die;
    this.moves = findMoves(this.board, p.pos, die, { mode: this.travelMode });
    this.say(p.id, `${p.name} heitti ${die}.`);
    if (this.moves.size === 0) {
      this.say(p.id, `${p.name} ei pysty liikkumaan ja jää paikalleen.`);
      this.emit('stuck', `${p.name} ei pysty liikkumaan`, { icon: '⛔' });
      this.endTurn();
      return { ok: true, moved: false, die };
    }
    this.phase = 'move';
    return { ok: true, moved: false, die };
  }

  /** Siirtää pelaajan valittuun päätepisteeseen. */
  actionMove(key) {
    if (this.phase !== 'move') return { ok: false, error: 'Heitä ensin noppa' };
    const move = this.moves.get(key);
    if (!move) return { ok: false, error: 'Tuo ei ole laillinen siirto' };

    const p = this.player;
    const fare = this.pendingFare;
    p.money -= fare;
    p.pos = move.pos;
    this.lastPath = move.path;
    this.pendingFare = 0;

    const city = this.cityOf();
    const fareText = fare ? ` (laivamatka ${fare} puntaa)` : '';
    const where = city
      ? `kaupunkiin ${city.name}`
      : `reitille ${this.routeName(move.pos.edge)}`;
    this.say(p.id, `${p.name} siirtyi ${where}${fareText}.`);
    if (fare) this.emit('fare', `Laivamatka −${fare} puntaa`, { icon: '⚓' });

    this.moves = null;
    this.die = null;
    if (this.checkWin()) return { ok: true, win: true };
    if (this.offerQuiz()) return { ok: true, offer: true };
    this.endTurn();
    return { ok: true };
  }

  /** Aarrekaupunkiin saapunut saa kokeilla kysymystä ennen vuoron vaihtumista. */
  offerQuiz() {
    const city = this.cityOf();
    if (!city || !this.tokens.has(city.id)) return false;
    this.phase = 'offer';
    return true;
  }

  /** Ohittaa tietovisan ja päättää vuoron. */
  actionSkipQuiz() {
    if (this.phase !== 'offer') return { ok: false, error: 'Väärä vaihe' };
    this.endTurn();
    return { ok: true };
  }

  /**
   * Avaa tietovisakysymyksen: oikea vastaus kääntää laatan ilmaiseksi.
   * `hard: true` arpoo vaikean kysymyksen, josta oikein vastattaessa saa
   * laatan lisäksi HARD_BONUS puntaa.
   */
  actionQuiz({ hard = false } = {}) {
    if (this.phase !== 'offer' && this.phase !== 'action') {
      return { ok: false, error: 'Väärä vaihe' };
    }
    const city = this.tokenHere();
    if (!city) return { ok: false, error: 'Täällä ei ole laattaa' };
    if (hard && !this.hardAvailable(city.id)) {
      return { ok: false, error: 'Täällä ei ole vaikeita kysymyksiä' };
    }

    const difficulty = hard ? 'hard' : this.player.quizLevel;
    const question = this.pickQuestion(city.id, difficulty);
    const order = this.shuffledOrder(question.options.length);
    this.quiz = {
      cityId: city.id,
      hard,
      question: question.q,
      fact: question.fact,
      source: sourceList(question.source),
      options: order.map((i) => question.options[i]),
      correct: order.indexOf(question.correct),
      hint: question.hint ?? null,
      hintShown: false,
      hidden: [],
      chosen: null,
      right: null,
      timedOut: false,
      seconds: QUIZ_SECONDS,
    };
    this.phase = 'quiz';
    return { ok: true, quiz: this.quiz };
  }

  /** Vastaa kysymykseen. Tulos jää näkyviin kunnes closeQuiz() kutsutaan. */
  answerQuiz(index) {
    if (this.phase !== 'quiz' || !this.quiz || this.quiz.chosen !== null) {
      return { ok: false, error: 'Ei avointa kysymystä' };
    }
    if (this.quiz.hidden.includes(index)) {
      return { ok: false, error: 'Tuo vaihtoehto on poistettu' };
    }
    const p = this.player;
    const city = this.board.cityById.get(this.quiz.cityId);
    this.quiz.chosen = index;
    this.quiz.right = index === this.quiz.correct;

    if (this.quiz.right) {
      this.say(p.id, `${p.name} vastasi oikein kaupungissa ${city.name} ja saa kääntää laatan.`);
      // Vaikean kysymyksen palkkio maksetaan ennen laatan kääntöä,
      // joten ryöstäjä vie senkin.
      if (this.quiz.hard) {
        p.money += HARD_BONUS;
        this.say(p.id, `Vaikeasta kysymyksestä ${p.name} saa ${HARD_BONUS} punnan palkkion.`);
      }
      this.quiz.found = this.revealToken(this.quiz.cityId);
    } else {
      const oikea = this.quiz.options[this.quiz.correct];
      this.say(p.id, `${p.name} vastasi väärin — oikea vastaus oli "${oikea}".`);
    }
    return { ok: true, right: this.quiz.right };
  }

  /** Ostaa sanallisen vihjeen 40 punnalla. */
  actionHint() {
    if (this.phase !== 'quiz' || !this.quiz) return { ok: false, error: 'Ei avointa kysymystä' };
    const quiz = this.quiz;
    if (quiz.chosen !== null) return { ok: false, error: 'Kysymykseen on jo vastattu' };
    if (quiz.hintShown) return { ok: false, error: 'Vihje on jo ostettu' };
    if (!quiz.hint) return { ok: false, error: 'Tähän kysymykseen ei ole vihjettä' };

    const p = this.player;
    if (p.money < HINT_PRICE) return { ok: false, error: 'Rahat eivät riitä' };
    p.money -= HINT_PRICE;
    quiz.hintShown = true;
    this.say(p.id, `${p.name} osti vihjeen ${HINT_PRICE} punnalla.`);
    return { ok: true, hint: quiz.hint };
  }

  /** Aika loppui: vastaus katsotaan vääräksi ja vuoro päättyy. */
  timeoutQuiz() {
    if (this.phase !== 'quiz' || !this.quiz) return { ok: false, error: 'Ei avointa kysymystä' };
    const quiz = this.quiz;
    if (quiz.chosen !== null) return { ok: false, error: 'Kysymykseen on jo vastattu' };

    const p = this.player;
    const city = this.board.cityById.get(quiz.cityId);
    quiz.chosen = -1;
    quiz.right = false;
    quiz.timedOut = true;
    quiz.seconds = 0;
    const oikea = quiz.options[quiz.correct];
    this.say(p.id, `${p.name} ei ehtinyt vastata kaupungissa ${city.name} — oikea vastaus oli "${oikea}".`);
    return { ok: true, right: false, timedOut: true };
  }

  /** Piilottaa 80 punnalla kaksi väärää vaihtoehtoa. */
  actionFiftyFifty() {
    if (this.phase !== 'quiz' || !this.quiz) return { ok: false, error: 'Ei avointa kysymystä' };
    const quiz = this.quiz;
    if (quiz.chosen !== null) return { ok: false, error: 'Kysymykseen on jo vastattu' };
    if (quiz.hidden.length) return { ok: false, error: '50:50 on jo käytetty' };

    const p = this.player;
    if (p.money < FIFTY_FIFTY_PRICE) return { ok: false, error: 'Rahat eivät riitä' };
    p.money -= FIFTY_FIFTY_PRICE;

    const wrong = quiz.options.map((_, i) => i).filter((i) => i !== quiz.correct);
    for (let i = wrong.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [wrong[i], wrong[j]] = [wrong[j], wrong[i]];
    }
    quiz.hidden = wrong.slice(0, 2).sort((a, b) => a - b);
    this.say(p.id, `${p.name} maksoi ${FIFTY_FIFTY_PRICE} puntaa ja poisti kaksi väärää vaihtoehtoa.`);
    return { ok: true, hidden: quiz.hidden };
  }

  /** Sulkee kysymyksen ja päättää vuoron — tai aloittaa rosvon kaksintaistelun. */
  closeQuiz() {
    if (!this.quiz) return { ok: false, error: 'Ei avointa kysymystä' };
    this.quiz = null;
    if (this.phase === 'over') return { ok: true };
    if (this.duelArmed) {
      this.duelArmed = false;
      this.beginDuel();
      return { ok: true, duel: true };
    }
    this.phase = 'action';
    this.endTurn();
    return { ok: true };
  }

  // --- rosvon kaksintaistelu ----------------------------------------------

  /**
   * Rosvo esittää kiperän kysymyksen, jossa on kahdeksan vaihtoehtoa.
   * Suora oikea vastaus tuo rosvon saaliin (DUEL_PRIZE). Helpotus poistaa
   * puolet jäljellä olevista vääristä vaihtoehdoista, mutta rosvo vie siitä
   * puolet rahoista. Väärä vastaus tai aikakatkaisu vie kaikki rahat.
   * Kolmella hevosenkengällä rosvon voi ohittaa kokonaan.
   */
  beginDuel() {
    const pool = this.pack.duels ?? [];
    const fresh = pool.filter((q) => !this.usedQuestions.has(q.q));
    const deck = fresh.length ? fresh : pool;
    const question = deck[Math.floor(this.rng() * deck.length)];
    this.usedQuestions.add(question.q);
    const order = this.shuffledOrder(question.options.length);
    this.duel = {
      question: question.q,
      fact: question.fact,
      source: sourceList(question.source),
      options: order.map((i) => question.options[i]),
      correct: order.indexOf(question.correct),
      hidden: [],
      reliefs: 0,
      taken: 0,
      chosen: null,
      right: null,
      timedOut: false,
      seconds: QUIZ_SECONDS,
    };
    this.phase = 'duel';
    return { ok: true, duel: this.duel };
  }

  /** Helpotus: rosvo vie puolet rahoista ja puolet vääristä vaihtoehdoista poistuu. */
  actionDuelRelief() {
    const duel = this.duel;
    if (this.phase !== 'duel' || !duel) return { ok: false, error: 'Ei kaksintaistelua' };
    if (duel.chosen !== null) return { ok: false, error: 'Kysymykseen on jo vastattu' };
    if (duel.reliefs >= 2) return { ok: false, error: 'Helpotukset on käytetty' };

    const p = this.player;
    const toll = Math.floor(p.money / 2);
    p.money -= toll;
    duel.taken += toll;
    duel.reliefs++;

    const wrong = duel.options
      .map((_, i) => i)
      .filter((i) => i !== duel.correct && !duel.hidden.includes(i));
    for (let i = wrong.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [wrong[i], wrong[j]] = [wrong[j], wrong[i]];
    }
    const removeCount = duel.reliefs === 1 ? 4 : 2;
    duel.hidden = [...duel.hidden, ...wrong.slice(0, removeCount)].sort((a, b) => a - b);
    this.say(p.id, `${p.name} pyysi rosvolta helpotusta — rosvo vei ${toll} puntaa.`);
    return { ok: true, toll, hidden: duel.hidden };
  }

  /** Kolme hevosenkenkää heitetään rosvolle, ja tämä päästää kulkijan ohi. */
  actionDuelBypass() {
    const duel = this.duel;
    if (this.phase !== 'duel' || !duel) return { ok: false, error: 'Ei kaksintaistelua' };
    if (duel.chosen !== null) return { ok: false, error: 'Kysymykseen on jo vastattu' };
    const p = this.player;
    if (p.horseshoes < DUEL_BYPASS_SHOES) {
      return { ok: false, error: `Ohitus vaatii ${DUEL_BYPASS_SHOES} hevosenkenkää` };
    }
    p.horseshoes -= DUEL_BYPASS_SHOES;
    this.say(p.id, `Ω ${p.name} heitti rosvolle ${DUEL_BYPASS_SHOES} hevosenkenkää ja pääsi ohi.`);
    this.emit('aid', 'Rosvo päästi ohi', { icon: 'Ω', sub: `−${DUEL_BYPASS_SHOES} hevosenkenkää` });
    this.duel = null;
    this.phase = 'action';
    this.endTurn();
    return { ok: true, bypassed: true };
  }

  /** Vastaa rosvon kysymykseen. */
  answerDuel(index) {
    const duel = this.duel;
    if (this.phase !== 'duel' || !duel || duel.chosen !== null) {
      return { ok: false, error: 'Ei avointa kaksintaistelua' };
    }
    if (duel.hidden.includes(index)) return { ok: false, error: 'Tuo vaihtoehto on poistettu' };

    const p = this.player;
    duel.chosen = index;
    duel.right = index === duel.correct;
    if (duel.right) {
      if (duel.reliefs === 0) {
        p.money += DUEL_PRIZE;
        duel.prize = DUEL_PRIZE;
        this.say(p.id, `${p.name} voitti rosvon suoralla vastauksella ja vei saaliin: ${DUEL_PRIZE} puntaa!`);
      } else {
        this.say(p.id, `${p.name} voitti rosvon — loput rahat säilyvät.`);
      }
    } else {
      const loss = p.money;
      p.money = 0;
      duel.taken += loss;
      const oikea = duel.options[duel.correct];
      this.say(p.id, `☠ ${p.name} hävisi rosvolle ${loss} puntaa — oikea vastaus oli "${oikea}".`);
    }
    return { ok: true, right: duel.right };
  }

  /** Aika loppui: rosvo vie kaikki rahat. */
  timeoutDuel() {
    const duel = this.duel;
    if (this.phase !== 'duel' || !duel || duel.chosen !== null) {
      return { ok: false, error: 'Ei avointa kaksintaistelua' };
    }
    const p = this.player;
    duel.chosen = -1;
    duel.right = false;
    duel.timedOut = true;
    duel.seconds = 0;
    const loss = p.money;
    p.money = 0;
    duel.taken += loss;
    this.say(p.id, `☠ ${p.name} ei ehtinyt vastata rosvolle ja menetti ${loss} puntaa.`);
    return { ok: true, right: false, timedOut: true };
  }

  /** Sulkee kaksintaistelun ja päättää vuoron. */
  closeDuel() {
    if (!this.duel) return { ok: false, error: 'Ei kaksintaistelua' };
    this.duel = null;
    if (this.phase === 'over') return { ok: true };
    this.phase = 'action';
    this.endTurn();
    return { ok: true };
  }

  /** Onko kaupungin pakassa vaikeita kysymyksiä? */
  hardAvailable(cityId) {
    const pool = [...(this.pack.questions[cityId] ?? []), ...this.pack.questions.general];
    return pool.some((q) => questionLevel(q) === 3);
  }

  /**
   * Arpoo kysymyksen: kaupungin omat ja yleiset kysymykset ovat samassa pakassa,
   * ja arvonta osuu vain vielä kysymättömiin. Kun pakka on tyhjä, kaikki
   * kysymykset palaavat mukaan.
   *
   * Vaikeustaso rajaa pakkaa: 'easy' suosii helppoja, 'normal' jättää vaikeat
   * pois ja 'hard' poimii vaikeita. Jos sopivan tasoisia ei ole, pakka
   * lavenee portaittain, jotta kysymys löytyy aina.
   */
  pickQuestion(cityId, difficulty = 'normal') {
    const pool = [...(this.pack.questions[cityId] ?? []), ...this.pack.questions.general];
    const steps = {
      easy: [[1], [1, 2]],
      normal: [[1, 2]],
      hard: [[3], [2, 3]],
    }[difficulty] ?? [[1, 2]];

    let deck = pool;
    for (const levels of steps) {
      const fit = pool.filter((q) => levels.includes(questionLevel(q)));
      if (fit.length) {
        deck = fit;
        break;
      }
    }
    const fresh = deck.filter((q) => !this.usedQuestions.has(q.q));
    const usable = fresh.length ? fresh : deck;
    const question = usable[Math.floor(this.rng() * usable.length)];
    this.usedQuestions.add(question.q);
    return question;
  }

  /** Sekoitettu indeksijärjestys vastausvaihtoehdoille. */
  shuffledOrder(count) {
    const order = [...Array(count).keys()];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }

  /** Lentää toiseen lentokenttäkaupunkiin. Vie koko vuoron. */
  actionFly(destination) {
    if (this.phase !== 'action') return { ok: false, error: 'Väärä vaihe' };
    this.travelMode = 'fly';
    const p = this.player;
    if (!this.airportDestinations().includes(destination)) {
      return { ok: false, error: 'Sinne ei ole lentoa' };
    }
    p.money -= FLIGHT_PRICE;
    p.pos = { type: 'city', city: destination };
    this.lastPath = null;
    const city = this.board.cityById.get(destination);
    this.say(p.id, `${p.name} lensi ${FLIGHT_PRICE} punnalla kaupunkiin ${city.name}.`);
    this.emit('flight', `Lento kaupunkiin ${city.name}`, { icon: '✈', sub: `−${FLIGHT_PRICE} puntaa` });
    if (this.checkWin()) return { ok: true, win: true };
    if (this.offerQuiz()) return { ok: true, offer: true };
    this.endTurn();
    return { ok: true };
  }

  // --- laatat ja voitto ---------------------------------------------------

  revealToken(cityId) {
    const type = this.tokens.get(cityId);
    if (!type) return null;
    this.tokens.delete(cityId);
    this.revealed.set(cityId, type);

    const p = this.player;
    const token = this.tokenTypes[type];
    p.finds.push(type);
    const city = this.board.cityById.get(cityId);

    switch (type) {
      case 'star':
        p.hasStar = true;
        this.world.starFound = true;
        this.world.starCity = cityId;
        if (this.roaming) {
          p.money += STAR_PRIZE;
          this.say(p.id, `★ ${p.name} löysi aarteen ${token.name} kaupungista ${city.name} — arvo ${STAR_PRIZE} puntaa!`);
          this.emit('treasure', this.pack.texts.starToast, { token: type, sub: `+${STAR_PRIZE} puntaa` });
        } else {
          this.say(p.id, this.pack.texts.starFound(p.name, city.name));
          this.say(null, this.pack.texts.starChase);
          this.emit('treasure', this.pack.texts.starToast, {
            token: type,
            sub: `${p.name} löysi tähden — nyt kiire kotiin!`,
          });
        }
        break;
      case 'horseshoe':
        p.horseshoes++;
        this.say(p.id, `Ω ${p.name} löysi hevosenkengän kaupungista ${city.name}.`);
        this.emit('treasure', 'Hevosenkenkä', {
          token: type,
          sub: 'Voi voittaa pelin, jos tähti löytyy',
        });
        break;
      case 'robber':
        this.say(p.id, `☠ Ryöstäjä yllätti pelaajan ${p.name} — edessä on kaksintaistelu!`);
        this.emit('robber', 'Ryöstäjä!', {
          token: type,
          sub: `${p.name} joutuu rosvon kaksintaisteluun`,
        });
        this.duelArmed = true;
        break;
      case 'empty':
        this.say(p.id, `${p.name} käänsi tyhjän laatan kaupungissa ${city.name}.`);
        this.emit('treasure', 'Tyhjä laatta', { token: type, sub: 'Ei aarretta täällä' });
        break;
      default:
        p.money += token.value;
        this.say(p.id, `${token.symbol} ${p.name} löysi jalokiven ${token.name} (${token.value} puntaa).`);
        this.emit('treasure', token.name, { token: type, sub: `+${token.value} puntaa` });
    }

    this.checkWin();
    return type;
  }

  /** Voitto: tähden tai hevosenkengän kanssa aloituskaupunkiin sen jälkeen kun tähti on löytynyt. */
  checkWin() {
    if (this.roaming) return false;
    if (this.winner) return true;
    if (!this.starFound) return false;
    const p = this.player;
    const city = this.cityOf();
    if (!city || !city.start) return false;
    if (!p.hasStar && p.horseshoes === 0) return false;

    this.winner = p;
    this.phase = 'over';
    const reason = p.hasStar
      ? this.pack.texts.winStar
      : 'ehti hevosenkengän kanssa kotiin ensimmäisenä';
    this.say(p.id, `🏆 ${p.name} ${reason} kaupungissa ${city.name} ja voitti pelin!`);
    return true;
  }

  // --- tallennus ----------------------------------------------------------

  /** Pelin tila tavallisena oliona (localStorage / JSON). */
  toJSON() {
    return {
      version: 1,
      packId: this.rootPackId,
      roaming: this.roaming,
      seed: this.seed,
      rngCalls: this.rngCalls,
      players: this.players.map((p) => ({ ...p })),
      worlds: Object.fromEntries(
        [...this.worlds].map(([id, w]) => [id, {
          tokens: [...w.tokens.entries()],
          revealed: [...w.revealed.entries()],
          starFound: w.starFound,
          starCity: w.starCity,
        }]),
      ),
      usedQuestions: [...this.usedQuestions],
      current: this.current,
      phase: this.phase,
      travelMode: this.travelMode,
      autoTravel: this.autoTravel,
      pendingFare: this.pendingFare,
      die: this.die,
      quiz: this.quiz,
      duel: this.duel,
      duelArmed: this.duelArmed,
      winnerId: this.winner ? this.winner.id : null,
      turnCount: this.turnCount,
      log: this.log,
    };
  }

  /** Palauttaa tallennetun pelin. Palauttaa null, jos tallennus on kelvoton. */
  static fromJSON(data) {
    if (!data || data.version !== 1 || !Array.isArray(data.players)) return null;

    const game = Object.create(Game.prototype);
    game.seed = data.seed;
    game.rngCalls = 0;
    const source = mulberry32(data.seed);
    // Kelataan arvonnat samaan kohtaan kuin tallennushetkellä.
    for (let i = 0; i < data.rngCalls; i++) source();
    game.rngCalls = data.rngCalls;
    game.rng = () => {
      game.rngCalls++;
      return source();
    };

    // Vanhoissa tallennuksissa ei ole packId:tä eikä maailmoja — ne ovat
    // yhden laudan Afrikka-pelejä.
    const rootPack = packById(data.packId ?? 'africa');
    game.rootPackId = rootPack.id;
    game.roaming = !!data.roaming;
    game.worlds = new Map();
    const worldsData = data.worlds ?? {
      [rootPack.id]: {
        tokens: data.tokens,
        revealed: data.revealed,
        starFound: !!data.starFound,
        starCity: data.starCity ?? null,
      },
    };
    for (const [id, w] of Object.entries(worldsData)) {
      const pack = packById(id);
      game.worlds.set(pack.id, {
        pack,
        board: buildBoard(pack.cities, pack.edges),
        tokens: new Map(w.tokens ?? []),
        revealed: new Map(w.revealed ?? []),
        starFound: !!w.starFound,
        starCity: w.starCity ?? null,
      });
    }
    game.players = data.players.map((p) => ({ packId: rootPack.id, ...p }));
    game.usedQuestions = new Set(data.usedQuestions ?? []);
    game.current = data.current;
    game.phase = data.phase;
    game.travelMode = data.travelMode ?? null;
    game.autoTravel = !!data.autoTravel;
    game.pendingFare = data.pendingFare ?? 0;
    game.die = data.die ?? null;
    game.quiz = data.quiz ?? null;
    game.duel = data.duel ?? null;
    game.duelArmed = !!data.duelArmed;
    game.lastPath = null;
    game.winner = data.winnerId === null ? null : game.players[data.winnerId] ?? null;
    game.turnCount = data.turnCount ?? 1;
    game.log = data.log ?? [];
    game.events = [];
    game.moves = null;

    // Kesken jäänyt siirtovalinta lasketaan uudelleen nopan silmäluvusta.
    if (game.phase === 'move' && game.die) {
      const p = game.players[game.current];
      game.moves = findMoves(game.board, p.pos, game.die, { mode: game.travelMode ?? 'land' });
      if (game.moves.size === 0) game.phase = 'action';
    }
    return game;
  }

  /** Siirtolista UI:lle: avain, sijainti, hinta ja kaupungin tiedot. */
  moveOptions() {
    if (this.phase !== 'move' || !this.moves) return [];
    return [...this.moves.entries()].map(([key, m]) => ({
      key,
      pos: m.pos,
      city: m.pos.type === 'city' ? this.board.cityById.get(m.pos.city) : null,
      hasToken: m.pos.type === 'city' && this.tokens.has(m.pos.city),
    }));
  }
}

export { posKey };
