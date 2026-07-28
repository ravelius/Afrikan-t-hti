// Pelin tila ja säännöt: vuorot, laattojen kääntäminen ja voittoehdot.

import { FLIGHT_PRICE, buildBoard, findMoves, posKey, reachableCities } from './rules.js';
import { createTokenPile } from './tokens.js';
import { packById, sourceList } from './pack.js';

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
export const HINT_EVERY_TURNS = 4; // näin harvoin isoisän vihje aarteesta

// Aika on pelin vastustaja, ei sen tuomari: ajan loppuminen ei päätä peliä
// koskaan. Vuoro on kuusi tuntia, joten neljä vuoroa on yksi matkapäivä.
export const TURN_HOURS = 6;
export const RECORD_DAYS = 80; // isoisän ennätys
export const XP_RECORD = 200; // bonus, jos aarre löytyy ennätyksen sisällä

// Pysähdyksen muoto arvotaan painotetusti, jottei joka kaupungissa ole sama
// neljän vaihtoehdon tietovisa. Painot ovat vakioina, koska oikeat arvot
// varmistuvat vasta pelitestissä. Jos laudalla ei ole väittämiä tai
// tapahtumia, niiden paino siirtyy monivalinnalle — peli toimii jokaisella
// laudalla ilman uutta sisältöä.
export const FORM_WEIGHTS = { quiz: 60, claim: 15, map: 10, event: 15 };
export const MAP_CHOICES = 4; // karttakysymyksen ehdokaskaupungit

/** Vuorokaudenajan nimi tunnista. Kierto: aamu, keskipäivä, ilta, yö. */
export function timeOfDayName(hour) {
  if (hour < 6) return 'aamu';
  if (hour < 12) return 'keskipäivä';
  if (hour < 18) return 'ilta';
  return 'yö';
}

// Kokemuspisteet kertyvät matkasta, eivät onnesta: uusista paikoista,
// uusista laudoista ja vaikeista kysymyksistä.
export const XP_NEW_CITY = 10;
export const XP_NEW_BOARD = 50;
export const XP_HARD_ANSWER = 25;
export const XP_STAR = 100;
export const XP_PUZZLE = 25; // isoisän luonnoskirjan pulma ratkaistu

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

    // Ilman aloituskaupunkia (start: null) lähtöpiste valitaan kartalta
    // pelin alussa; nappula odottaa sitä ensimmäisessä aloituskaupungissa.
    const firstStart = pack.cities.find((c) => c.start);
    this.players = players.map((p, i) => ({
      id: i,
      name: p.name,
      color: p.color,
      isBot: !!p.isBot,
      start: p.start ?? null,
      packId: pack.id,
      // 'easy' = helpot kysymykset (esim. lapsipelaajalle), 'normal' = tavalliset
      quizLevel: p.quizLevel === 'easy' ? 'easy' : 'normal',
      money: START_MONEY,
      pos: { type: 'city', city: p.start ?? firstStart.id },
      hasStar: false,
      horseshoes: 0,
      finds: [], // löydetyt laatat tyyppeinä
      xp: 0,
      // Tietoprosentin laskurit: mukana sekä tietovisat että kaksintaistelut.
      quizAsked: 0,
      quizCorrect: 0,
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
    this.diaryNote = null;
    // Pysähdyksen muoto: sama erikoismuoto ei toistu kahdesti peräkkäin.
    this.lastForm = null;
    this.eventCard = null;
    // Pulmat avautuvat kerran pelissä: avaimena 'pakka:kaupunki'.
    this.puzzlesSeen = new Set();
    this.puzzlePrevPhase = null;
    // Isoisän aikataulu: näytetty rivi ja jo nähtyjen avaimet.
    this.scheduleNote = null;
    this.scheduleShown = new Set();
    this.recordNoted = false;
    this.recordMark = null;
    this.usedQuestions = new Set();
    this.lastPath = null;
    this.winner = null;
    this.turnCount = 1;
    this.log = [];
    this.events = []; // näytölle animoitavat tapahtumat
    // Avaus on pelkkää kerrontaa: sääntöasiat ovat Säännöt-dialogissa eivätkä
    // lokirivejä. Laudan intro-teksti jää pakkoihin muuta käyttöä varten.
    // Vaellus alkaa lähtöpisteen valinnalla, jos sitä ei ole annettu valmiiksi.
    // Matkaaja seisoo Lontoossa (laudan ensimmäisessä aloituskaupungissa)
    // lentolippu kädessään; ensimmäinen kohde valitaan kartalta ilmaiseksi.
    if (this.roaming && this.players.some((p) => !p.start)) {
      this.phase = 'pickstart';
    } else {
      this.beginTurn();
    }
  }

  /**
   * Lähtöpisteen valinta pelin alussa. Valinta on ilmainen: pelaaja voi jäädä
   * valittuun kaupunkiin maailmankartalle tai astua sen portin läpi suoraan
   * toiselle laudalle (linkIndex osoittaa kaupungin links-listaan).
   */
  actionPickStart(cityId, linkIndex = null) {
    if (this.phase !== 'pickstart') return { ok: false, error: 'Lähtöpiste on jo valittu' };
    const city = this.board.cityById.get(cityId);
    if (!city) return { ok: false, error: 'Tuntematon kaupunki' };
    const p = this.player;
    const link = linkIndex === null ? null : (city.links ?? [])[linkIndex];
    if (linkIndex !== null && !link) return { ok: false, error: 'Täältä ei ole tuota porttia' };

    if (link) {
      const target = packById(link.pack);
      this.enterWorld(target);
      p.packId = target.id;
      p.pos = { type: 'city', city: link.city };
      p.start = link.city;
      this.setDiary(target);
      this.say(p.id, `${p.name} aloittaa matkansa: ${link.label}.`);
    } else {
      p.pos = { type: 'city', city: city.id };
      p.start = city.id;
      this.setDiary(this.pack);
      this.say(p.id, `${p.name} aloittaa matkansa kaupungista ${city.name}.`);
    }
    this.visitCity(p);
    this.phase = 'action';
    this.beginTurn();
    return { ok: true };
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
      visited: new Set(), // kaupungit, joissa on jo käyty (kokemuspisteitä varten)
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
      countryGates: this.countryGateOptions(),
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
    // Maakohtaisille laudoille ei lennetä rahalla, vaan portti avataan
    // tiedolla pääkaupungissa (countryGateOptions).
    return city.links
      .map((link, index) => ({ ...link, index }))
      .filter((link) => packById(link.pack).scope !== 'country');
  }

  /**
   * Tietoportit: mantereen pääkaupungista pääsee maan omalle laudalle
   * vastaamalla vaikeaan kysymykseen oikein. Portti on ilmainen — se
   * avataan tiedolla, ei rahalla. Väärästä vastauksesta vuoro päättyy.
   */
  countryGateOptions() {
    if (this.phase !== 'action') return [];
    const city = this.cityOf();
    if (!city || !city.links) return [];
    return city.links
      .map((link, index) => ({ ...link, index }))
      .filter((link) => packById(link.pack).scope === 'country');
  }

  /** Avaa tietoportin kysymyksen. Kysymys on aina vaikea (taso 3). */
  actionGateQuiz(index) {
    if (this.phase !== 'action') return { ok: false, error: 'Väärä vaihe' };
    const gate = this.countryGateOptions()[index];
    if (!gate) return { ok: false, error: 'Täällä ei ole tietoporttia' };
    const city = this.cityOf();

    const question = this.pickQuestion(city.id, 'hard');
    const order = this.shuffledOrder(question.options.length);
    this.quiz = {
      cityId: city.id,
      hard: false,
      gate: { pack: gate.pack, city: gate.city, label: gate.label },
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

  /** Onko kaupungista lentoja toiselle laudalle? Kartta merkitsee ne. */
  isGateway(city) {
    return !!(city && city.links && city.links.length);
  }

  /**
   * Kokemuspisteet kertyvät matkasta: uusi kaupunki, uusi lauta, oikea
   * vastaus vaikeaan kysymykseen ja laudan pääaarre. Rahalla niitä ei saa.
   */
  awardXp(player, amount) {
    player.xp = (player.xp ?? 0) + amount;
    return amount;
  }

  /**
   * Merkitsee kaupungin käydyksi ja palkitsee ensikäynnistä. Laudan
   * ensimmäinen kaupunki on myös uusi lauta. Kutsu on turvallista toistaa:
   * jo käyty kaupunki ei tuota pisteitä uudelleen.
   */
  visitCity(player = this.player) {
    if (player.pos.type !== 'city') return 0;
    const world = this.worldOf(player);
    if (!world || world.visited.has(player.pos.city)) return 0;

    let gained = 0;
    if (world.visited.size === 0) {
      gained += this.awardXp(player, XP_NEW_BOARD);
      this.say(player.id, `${player.name} astui uudelle laudalle: ${world.pack.boardLabel} (+${XP_NEW_BOARD} kp).`);
    }
    world.visited.add(player.pos.city);
    gained += this.awardXp(player, XP_NEW_CITY);
    return gained;
  }

  /**
   * Kirjaa vastatun kysymyksen tietoprosenttia varten. Mukaan lasketaan
   * tietovisat, tietoportit, kaksintaistelut ja umpeen valuneet tiimalasit —
   * kaikki, missä pelaajalta kysyttiin jotain.
   */
  countAnswer(player, right) {
    player.quizAsked = (player.quizAsked ?? 0) + 1;
    if (right) player.quizCorrect = (player.quizCorrect ?? 0) + 1;
  }

  /** Tietoprosentti kokonaislukuna; null, jos mitään ei ole vielä kysytty. */
  knowledgePercent(player = this.player) {
    if (!player.quizAsked) return null;
    return Math.round((player.quizCorrect / player.quizAsked) * 100);
  }

  // --- aika ---------------------------------------------------------------

  /** Kuluneet tunnit matkan alusta. Ensimmäinen vuoro on hetki nolla. */
  elapsedHours() {
    return (this.turnCount - 1) * TURN_HOURS;
  }

  /** Matkapäivä ykkösestä alkaen. */
  dayCount() {
    return Math.floor(this.elapsedHours() / 24) + 1;
  }

  /** Vuorokaudenaika: aamu, keskipäivä, ilta tai yö. */
  timeOfDay() {
    return timeOfDayName(this.elapsedHours() % 24);
  }

  /** Päiväkirjan päivämäärä yläpalkkiin: "Päivä 14, ilta". */
  clockLabel() {
    return `Päivä ${this.dayCount()}, ${this.timeOfDay()}`;
  }

  /**
   * Isoisän aikataulu: kun matkapäivä ohittaa merkinnän päivän, rivi nousee
   * tietoruutuun. Merkintä näytetään kerran, ja näytetyt jäävät talteen, jotta
   * tallennuksesta jatkava ei näe samaa riviä uudelleen.
   */
  updateSchedule() {
    this.scheduleNote = null;
    const rivit = this.pack.texts.schedule;
    if (!Array.isArray(rivit)) return;
    const day = this.dayCount();
    for (const rivi of rivit) {
      const key = `${this.pack.id}:${rivi.day}`;
      if (rivi.day > day || this.scheduleShown.has(key)) continue;
      this.scheduleShown.add(key);
      this.scheduleNote = { packId: this.pack.id, day: rivi.day, text: rivi.text };
      return; // yksi rivi kerrallaan, vaikka useampi päivä olisi ohitettu
    }
  }

  /**
   * Isoisän ennätys aarteen löytyessä. Ennätys on tavoite eikä tuomio: ajan
   * loppuminen ei päätä peliä koskaan eikä hitaampi matka menetä mitään.
   * Palauttaa merkinnän, jonka käyttöliittymä voi leimata passiin.
   */
  noteRecord(player = this.player) {
    if (this.recordNoted) return null;
    this.recordNoted = true;
    const day = this.dayCount();
    if (day <= RECORD_DAYS) {
      this.awardXp(player, XP_RECORD);
      this.say(player.id, `Päivä ${day}. Isoisän ennätys oli ${RECORD_DAYS} päivää — se on nyt rikottu.`);
      this.recordMark = { packId: this.pack.id, day, label: `${RECORD_DAYS} päivää rikottu` };
      return this.recordMark;
    }
    this.say(player.id, `Päivä ${day}. Isoisä olisi ollut jo kotona — mutta hän ei nähnyt tätä kaikkea.`);
    return null;
  }

  /** Kaupunki, johon laudan pääaarre on kätketty — löytynyt tai ei. */
  starCityOf(world = this.world) {
    if (world.starCity) return world.starCity;
    for (const [cityId, type] of world.tokens) {
      if (type === 'star') return cityId;
    }
    return null;
  }

  /**
   * Isoisän päiväkirjan taitettu sivu: vihje laudan pääaarteesta. Vihje
   * viittaa suuntaan tai alueeseen muttei nimeä kaupunkia, ja se nousee
   * tietoruutuun harvakseltaan — joka HINT_EVERY_TURNS vuoro. Kun aarre on
   * löytynyt, sivua ei enää tarvita.
   */
  starHint() {
    const world = this.world;
    if (!world || world.starFound) return null;
    if (this.turnCount % HINT_EVERY_TURNS !== 0) return null;
    const cityId = this.starCityOf(world);
    return this.pack.texts.starHints?.[cityId] ?? null;
  }

  /**
   * Herra Foggin päiväkirjamerkintä kirjataan laudalle saavuttaessa. Merkintä
   * näkyy tietoruudussa, kunnes matkaaja liikkuu saapumiskaupungista.
   */
  setDiary(pack) {
    const notes = pack.texts.diaries ?? (pack.texts.diary ? [pack.texts.diary] : []);
    if (!notes.length) return;
    // Merkintä arvotaan pelin omalla satunnaisluvulla, jotta sama peli
    // toistuu tallennuksesta samanlaisena.
    this.diaryNote = {
      packId: pack.id,
      pos: posKey(this.player.pos),
      text: notes[Math.floor(this.rng() * notes.length)],
    };
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
    this.visitCity(p);
    this.setDiary(pack);
    this.lastPath = null;
    this.say(p.id, `${p.name} lensi ${FLIGHT_PRICE} punnalla: ${link.label}.`);
    this.emit('flight', link.label, { icon: '🧭', sub: `−${FLIGHT_PRICE} puntaa` });
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

    // Vaelluksessa kotiin ei tarvitse ehtiä, joten tavoitteita ovat aina laatat.
    const racingHome = !this.roaming && (p.hasStar || (this.starFound && p.horseshoes > 0));
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
    this.updateSchedule();
    this.beginTurn();
  }

  /** Valitsee matkustustavan. Maksu peritään vasta kun siirto tehdään. */
  actionTravel(mode, opts = {}) {
    if (this.phase !== 'action') return { ok: false, error: 'Väärä vaihe' };
    if (!this.travelModes().includes(mode)) {
      return { ok: false, error: 'Tuo matkustustapa ei ole nyt käytettävissä' };
    }
    if (mode === 'stay') return this.actionQuiz(opts);

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
    this.diaryNote = null; // liikkeelle lähtö sulkee päiväkirjan
    this.lastPath = move.path;
    this.pendingFare = 0;

    const city = this.cityOf();
    if (city) this.visitCity(p);
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
   * Käytettävissä olevat muodot painoineen. Muoto putoaa pois, jos laudalla
   * ei ole sen sisältöä tai jos se oli edellinen erikoismuoto — sama
   * erikoismuoto ei toistu kahdesti peräkkäin.
   */
  formWeights(cityId) {
    const painot = { ...FORM_WEIGHTS };
    if (!(this.pack.questions?.claims ?? []).length) painot.claim = 0;
    if (!(this.pack.events ?? []).length) painot.event = 0;
    // Karttakysymys tarvitsee tarpeeksi kaupunkeja ehdokkaiksi.
    if (this.board.cities.length < MAP_CHOICES + 1) painot.map = 0;
    if (this.lastForm && this.lastForm !== 'quiz') painot[this.lastForm] = 0;
    // Kaupungin omissa kysymyksissä voi olla vaikeita, joita ei ole vielä
    // kysytty; monivalinta on aina mahdollinen, joten se kerää loput.
    const siirtyy = FORM_WEIGHTS.claim - painot.claim
      + FORM_WEIGHTS.event - painot.event
      + FORM_WEIGHTS.map - painot.map;
    painot.quiz += siirtyy;
    return painot;
  }

  /** Arpoo pysähdyksen muodon painotetusti pelin omalla satunnaisluvulla. */
  pickForm(cityId) {
    const painot = this.formWeights(cityId);
    const summa = Object.values(painot).reduce((a, b) => a + b, 0);
    let osuma = this.rng() * summa;
    for (const [muoto, paino] of Object.entries(painot)) {
      osuma -= paino;
      if (osuma < 0) return muoto;
    }
    return 'quiz';
  }

  /**
   * Avaa pysähdyksen: monivalinta, isoisän väittämä, karttakysymys tai
   * tapahtumakortti. Oikea vastaus kääntää laatan ilmaiseksi.
   * `hard: true` arpoo vaikean kysymyksen, josta oikein vastattaessa saa
   * laatan lisäksi HARD_BONUS puntaa — vaikea kysymys on aina monivalinta,
   * koska panos on suurempi.
   */
  actionQuiz({ hard = false, form = null } = {}) {
    if (this.phase !== 'offer' && this.phase !== 'action') {
      return { ok: false, error: 'Väärä vaihe' };
    }
    const city = this.tokenHere();
    if (!city) return { ok: false, error: 'Täällä ei ole laattaa' };
    if (hard && !this.hardAvailable(city.id)) {
      return { ok: false, error: 'Täällä ei ole vaikeita kysymyksiä' };
    }

    const muoto = hard ? 'quiz' : (form ?? this.pickForm(city.id));
    this.lastForm = muoto;
    if (muoto === 'claim') return this.openClaim(city);
    if (muoto === 'map') return this.openMapQuestion(city);
    if (muoto === 'event') return this.openEvent(city);

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

  /**
   * Isoisän väittämä: päiväkirjamerkintä, jonka pelaaja arvioi todeksi tai
   * taruksi. Kaksi nappia neljän sijaan. Väittämä on sama quiz-olio kuin
   * monivalinta, joten vastaaminen, aikakatkaisu ja sulkeminen toimivat
   * ennallaan — vain vaihtoehtoja on kaksi ja `kind` kertoo muodon.
   */
  openClaim(city) {
    const pool = this.pack.questions.claims ?? [];
    const fresh = pool.filter((c) => !this.usedQuestions.has(c.q));
    const deck = fresh.length ? fresh : pool;
    const claim = deck[Math.floor(this.rng() * deck.length)];
    this.usedQuestions.add(claim.q);

    this.quiz = {
      kind: 'claim',
      cityId: city.id,
      hard: false,
      question: claim.q,
      fact: claim.fact,
      source: sourceList(claim.source),
      options: ['Totta', 'Tarua'],
      correct: claim.correct ? 0 : 1,
      hint: null,
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

  /**
   * Karttakysymys: "Näytä kartalta: missä on X?" Ehdokkaat korostuvat
   * laudalla ja vastaus annetaan napauttamalla. Kysymys johdetaan laudan
   * omasta kaupunkidatasta, joten se toimii jokaisella laudalla ilman
   * erillistä sisältöpankkia.
   */
  openMapQuestion(city) {
    // Ehdokkaiksi kelpaavat kaikki paitsi kaupunki, jossa nyt seistään:
    // sen sijainti on pelaajalle jo näkyvissä nappulan alla.
    const pool = this.board.cities.filter((c) => c.id !== city.id);
    const order = this.shuffledOrder(pool.length).slice(0, MAP_CHOICES);
    const ehdokkaat = order.map((i) => pool[i]);
    const kohde = ehdokkaat[Math.floor(this.rng() * ehdokkaat.length)];

    const naapurit = [...(this.board.adj.get(kohde.id) ?? [])]
      .map((eid) => this.board.edgeById.get(eid))
      .map((e) => (e.a === kohde.id ? e.b : e.a))
      .map((id) => this.board.cityById.get(id)?.name)
      .filter(Boolean);

    this.quiz = {
      kind: 'map',
      cityId: city.id,
      hard: false,
      question: `Näytä kartalta: missä on ${kohde.name}?`,
      fact: naapurit.length
        ? `${kohde.name} on laudalla tässä. Sieltä pääsee suoraan kaupunkeihin ${naapurit.join(', ')}.`
        : `${kohde.name} on laudalla tässä.`,
      source: [],
      options: ehdokkaat.map((c) => c.name),
      mapCities: ehdokkaat.map((c) => c.id),
      correct: ehdokkaat.indexOf(kohde),
      hint: null,
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

  /**
   * Tapahtumakortti: kysymyksen sijaan tapahtuu jotain. Vaikutus on aina
   * pieni ja reilu — tapahtuma ei vie aarretta eikä isoa summaa, ja
   * laatta jää kääntämättä, joten kaupunkiin voi palata.
   */
  openEvent(city) {
    const pool = this.pack.events ?? [];
    const fresh = pool.filter((e) => !this.usedQuestions.has(e.text));
    const deck = fresh.length ? fresh : pool;
    const kortti = deck[Math.floor(this.rng() * deck.length)];
    this.usedQuestions.add(kortti.text);

    this.eventCard = { cityId: city.id, text: kortti.text, effect: kortti.effect, done: null };
    this.phase = 'event';
    return { ok: true, event: this.eventCard };
  }

  /** Toteuttaa tapahtuman vaikutuksen ja päättää vuoron. */
  closeEvent() {
    if (this.phase !== 'event' || !this.eventCard) {
      return { ok: false, error: 'Ei avointa tapahtumaa' };
    }
    const p = this.player;
    const { effect } = this.eventCard;
    this.eventCard = null;
    this.phase = 'action';

    if (effect?.kind === 'raha') {
      // Kukkaro ei mene miinukselle: tapahtuma ei saa jättää matkaajaa
      // velkaan, koska sillä ei ole pelissä mitään merkitystä.
      const muutos = Math.max(effect.amount, -p.money);
      p.money += muutos;
      this.say(p.id, muutos >= 0
        ? `${p.name} sai ${muutos} puntaa.`
        : `${p.name} menetti ${-muutos} puntaa.`);
    } else if (effect?.kind === 'kyyti') {
      const kohde = this.rideTarget(p);
      if (kohde) {
        p.pos = { type: 'city', city: kohde.id };
        this.lastPath = null;
        this.visitCity(p);
        this.say(p.id, `${p.name} sai ilmaisen kyydin kaupunkiin ${kohde.name}.`);
      }
    }

    this.endTurn();
    // Viive vie yhden ylimääräisen vuoron: matkaaja jää paikalleen ja
    // matkapäivä kuluu silti.
    if (effect?.kind === 'viive') {
      this.say(p.id, `${p.name} jäi paikalleen yhdeksi vuoroksi.`);
      this.endTurn();
    }
    return { ok: true };
  }

  /** Naapurikaupunki ilmaista kyytiä varten; null jos naapureita ei ole. */
  rideTarget(player) {
    if (player.pos.type !== 'city') return null;
    const naapurit = [...(this.board.adj.get(player.pos.city) ?? [])]
      .map((eid) => this.board.edgeById.get(eid))
      .map((e) => (e.a === player.pos.city ? e.b : e.a))
      .map((id) => this.board.cityById.get(id))
      .filter(Boolean);
    if (!naapurit.length) return null;
    return naapurit[Math.floor(this.rng() * naapurit.length)];
  }

  /**
   * Isoisän luonnoskirjan pulma, jos sellainen odottaa nykyisessä
   * kaupungissa. Pulma ei ole sidottu laattaan eikä tutkimiseen, jotta myös
   * aloituskaupungin pulma aukeaa — siksi laukaisin on pelkkä saapuminen.
   * Palauttaa null, jos pulmaa ei ole tai se on jo nähty tässä pelissä.
   */
  pendingPuzzle(player = this.player) {
    if (player.pos.type !== 'city') return null;
    const puzzle = (this.pack.puzzles ?? []).find((p) => p.city === player.pos.city);
    if (!puzzle) return null;
    return this.puzzlesSeen.has(`${this.pack.id}:${puzzle.city}`) ? null : puzzle;
  }

  /**
   * Avaa pulman. Pulma on monivalinta kuten muutkin, joten vastaaminen ja
   * tuloksen näyttö toimivat ennallaan — vain palkinto ja sulkeminen
   * poikkeavat: pulma ei käännä laattaa eikä päätä vuoroa.
   */
  openPuzzle() {
    const puzzle = this.pendingPuzzle();
    if (!puzzle) return { ok: false, error: 'Ei avointa pulmaa' };

    this.puzzlesSeen.add(`${this.pack.id}:${puzzle.city}`);
    this.puzzlePrevPhase = this.phase;
    const order = this.shuffledOrder(puzzle.options.length);
    this.quiz = {
      kind: 'puzzle',
      cityId: puzzle.city,
      puzzleId: puzzle.id,
      sketchData: puzzle.sketch ?? null,
      title: puzzle.title,
      hard: false,
      question: puzzle.q,
      fact: puzzle.fact,
      source: sourceList(puzzle.source),
      options: order.map((i) => puzzle.options[i]),
      correct: order.indexOf(puzzle.correct),
      hint: null,
      hintShown: false,
      hidden: [],
      chosen: null,
      right: null,
      timedOut: false,
      seconds: null,
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
    this.countAnswer(p, this.quiz.right);

    // Pulma: oikeasta kokemuspisteitä, väärästä ei rangaistusta. Pulma ei
    // käännä laattaa eikä koskaan estä etenemistä — oikea ratkaisu vain
    // näytetään.
    if (this.quiz.kind === 'puzzle') {
      if (this.quiz.right) {
        this.awardXp(p, XP_PUZZLE);
        this.say(p.id, `${p.name} ratkaisi isoisän pulman (+${XP_PUZZLE} kp).`);
      } else {
        this.say(p.id, `${p.name} ei ratkaissut isoisän pulmaa — isoisä olisi ollut armollinen.`);
      }
      return { ok: true, right: this.quiz.right };
    }

    // Tietoportti: oikea vastaus avaa portin, laattoja ei käännetä.
    if (this.quiz.gate) {
      if (this.quiz.right) {
        // Tietoportin kysymys on aina vaikea, joten siitä saa samat
        // kokemuspisteet kuin muustakin oikein vastatusta vaikeasta.
        this.awardXp(p, XP_HARD_ANSWER);
        this.say(p.id, `★ ${p.name} vastasi oikein — portti aukeaa: ${this.quiz.gate.label}! (+${XP_HARD_ANSWER} kp)`);
      } else {
        const oikea = this.quiz.options[this.quiz.correct];
        this.say(p.id, `${p.name} vastasi väärin — portti ei auennut. Oikea vastaus oli "${oikea}".`);
      }
      return { ok: true, right: this.quiz.right };
    }

    if (this.quiz.right) {
      this.say(p.id, `${p.name} vastasi oikein kaupungissa ${city.name} ja saa kääntää laatan.`);
      // Vaikean kysymyksen palkkio maksetaan ennen laatan kääntöä,
      // joten ryöstäjä vie senkin.
      if (this.quiz.hard) {
        p.money += HARD_BONUS;
        this.awardXp(p, XP_HARD_ANSWER);
        this.say(p.id, `Vaikeasta kysymyksestä ${p.name} saa ${HARD_BONUS} punnan palkkion ja ${XP_HARD_ANSWER} kokemuspistettä.`);
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
    this.countAnswer(p, false);
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
    // Väittämässä on kaksi vaihtoehtoa ja karttakysymyksessä vastataan
    // kartalta — kummassakaan puolikkaan poistamisessa ei ole järkeä.
    if (quiz.options.length < 4) return { ok: false, error: 'Tähän ei voi käyttää 50:50:tä' };
    if (quiz.kind === 'puzzle') return { ok: false, error: 'Pulma ratkaistaan itse' };

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
    // Pulma keskeytti saapumisen, joten vuoro jatkuu siitä mihin jäätiin.
    if (this.quiz.kind === 'puzzle') {
      this.quiz = null;
      if (this.phase !== 'over') this.phase = this.puzzlePrevPhase ?? 'action';
      this.puzzlePrevPhase = null;
      return { ok: true, puzzle: true };
    }
    const gate = this.quiz.right ? this.quiz.gate : null;
    this.quiz = null;
    if (this.phase === 'over') return { ok: true };
    // Voitettu tietoportti: siirtyminen maan laudalle on ilmainen.
    if (gate) {
      const p = this.player;
      const pack = packById(gate.pack);
      this.enterWorld(pack);
      p.packId = pack.id;
      p.pos = { type: 'city', city: gate.city };
      this.visitCity(p);
      this.setDiary(pack);
      this.lastPath = null;
      this.say(p.id, `${p.name} astui portista: ${gate.label}.`);
      this.emit('flight', gate.label, { icon: '★', sub: 'Tieto avasi portin' });
      this.phase = 'action';
      this.endTurn();
      return { ok: true, gated: true };
    }
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
    this.countAnswer(p, duel.right);
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
    this.countAnswer(p, false);
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
   * Arpoo kysymyksen. Kaupungin omat kysymykset ovat aina etusijalla ja
   * yleispakka on vasta varapakka: kysymyksen kuuluu liittyä siihen
   * paikkaan, jossa pelaaja seisoo, eikä Egyptin pääkaupunkia kysytä
   * Namibin autiomaassa.
   *
   * Vaikeustaso rajaa pakkaa: 'easy' suosii helppoja, 'normal' jättää
   * vaikeat pois ja 'hard' poimii vaikeita. Järjestys on vaikeustaso
   * ensin, sitten tuoreus, sitten paikallisuus — näin tietoportin vaikea
   * kysymys pysyy vaikeana, vaikka paikan omat olisi jo kysytty.
   */
  pickQuestion(cityId, difficulty = 'normal') {
    const own = this.pack.questions[cityId] ?? [];
    const general = this.pack.questions.general;
    const steps = {
      easy: [[1], [1, 2]],
      normal: [[1, 2]],
      hard: [[3], [2, 3]],
    }[difficulty] ?? [[1, 2]];

    for (const levels of steps) {
      for (const onlyFresh of [true, false]) {
        for (const source of [own, general]) {
          let deck = source.filter((q) => levels.includes(questionLevel(q)));
          if (onlyFresh) deck = deck.filter((q) => !this.usedQuestions.has(q.q));
          if (!deck.length) continue;
          const question = deck[Math.floor(this.rng() * deck.length)];
          this.usedQuestions.add(question.q);
          return question;
        }
      }
    }
    // Varmistus: jos mikään porras ei osunut, kelpaa mikä tahansa kysymys.
    const pool = [...own, ...general];
    const question = pool[Math.floor(this.rng() * pool.length)];
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
    this.visitCity(p);
    this.diaryNote = null;
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
        this.awardXp(p, XP_STAR);
        this.noteRecord(p);
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
        this.emit('treasure', 'Tyhjä laatta', { token: type, sub: 'Isoisän merkintä oli vanhentunut' });
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
          visited: [...w.visited],
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
      diaryNote: this.diaryNote,
      lastForm: this.lastForm,
      eventCard: this.eventCard,
      puzzlesSeen: [...this.puzzlesSeen],
      scheduleNote: this.scheduleNote,
      scheduleShown: [...this.scheduleShown],
      recordNoted: this.recordNoted,
      recordMark: this.recordMark,
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
        visited: data.visited,
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
        // Vanhoissa tallennuksissa käyntejä ei kirjattu: jo käännetyt laatat
        // kertovat, missä on käyty, joten kokemuspisteet eivät kerry uudelleen.
        visited: new Set(w.visited ?? (w.revealed ?? []).map(([city]) => city)),
        starFound: !!w.starFound,
        starCity: w.starCity ?? null,
      });
    }
    game.players = data.players.map((p) => ({
      packId: rootPack.id,
      xp: 0,
      quizAsked: 0,
      quizCorrect: 0,
      ...p,
    }));
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
    game.diaryNote = data.diaryNote ?? null;
    game.lastForm = data.lastForm ?? null;
    game.eventCard = data.eventCard ?? null;
    game.puzzlesSeen = new Set(data.puzzlesSeen ?? []);
    // Vanha tallennus ei tunne aikaa: se jatkuu päivästä 1 eikä ole nähnyt
    // yhtään isoisän aikataulurivistä.
    game.scheduleNote = data.scheduleNote ?? null;
    game.scheduleShown = new Set(data.scheduleShown ?? []);
    game.recordNoted = !!data.recordNoted;
    game.recordMark = data.recordMark ?? null;
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
  /**
   * Tarjottavat päätepisteet. Kaikki `this.moves`-siirrot ovat yhä laillisia,
   * mutta kartalla ehdotetaan vain kaupunkeja: reitin varren pisteet ovat
   * pelaajalle merkityksettömiä valintoja ja täyttivät kartan renkailla.
   * Jos jollakin lähtösuunnalla ei ole kaupunkia nopan päässä, siltä
   * suunnalta tarjotaan pisin piste, jottei suunta katoa kokonaan.
   */
  moveOptions() {
    if (this.phase !== 'move' || !this.moves) return [];
    const kaikki = [...this.moves.entries()].map(([key, m]) => ({
      key,
      pos: m.pos,
      suunta: m.path && m.path.length ? posKey(m.path[0]) : key,
      city: m.pos.type === 'city' ? this.board.cityById.get(m.pos.city) : null,
      hasToken: m.pos.type === 'city' && this.tokens.has(m.pos.city),
    }));

    const suunnat = new Map();
    for (const opt of kaikki) {
      const lista = suunnat.get(opt.suunta) ?? [];
      lista.push(opt);
      suunnat.set(opt.suunta, lista);
    }

    const tarjottavat = [];
    for (const lista of suunnat.values()) {
      const kaupungit = lista.filter((opt) => opt.city);
      tarjottavat.push(...(kaupungit.length ? kaupungit : lista));
    }
    return tarjottavat;
  }
}

export { posKey };
