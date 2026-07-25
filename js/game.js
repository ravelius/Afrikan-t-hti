// Pelin tila ja säännöt: vuorot, laattojen kääntäminen ja voittoehdot.

import { CITIES, EDGES, AIR_ROUTES, TOKEN_CITIES, FLIGHT_PRICE } from './board.js';
import { buildBoard, findMoves, posKey, hasAnyMove, reachableCities } from './rules.js';
import { TOKEN_TYPES, createTokenPile } from './tokens.js';
import { QUESTIONS } from './questions.js';

export const START_MONEY = 300;
export const TOKEN_PRICE = 100;
export const STRANDED_AID = 100; // kotisääntö: jumiin jäänyt saa pankilta 100
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
   * @param {{players: Array<{name, color, isBot, start}>, rng?: () => number}} opts
   */
  constructor({ players, rng = Math.random }) {
    if (players.length < 2 || players.length > 4) {
      throw new Error('Pelaajia pitää olla 2–4');
    }
    this.rng = rng;
    this.board = buildBoard(CITIES, EDGES);
    this.airRoutes = AIR_ROUTES;

    this.players = players.map((p, i) => ({
      id: i,
      name: p.name,
      color: p.color,
      isBot: !!p.isBot,
      start: p.start,
      money: START_MONEY,
      pos: { type: 'city', city: p.start },
      hasStar: false,
      horseshoes: 0,
      finds: [], // löydetyt laatat tyyppeinä
    }));

    const pile = createTokenPile(this.rng);
    if (pile.length !== TOKEN_CITIES.length) {
      throw new Error(`Laattoja ${pile.length}, kaupunkeja ${TOKEN_CITIES.length}`);
    }
    this.tokens = new Map(TOKEN_CITIES.map((city, i) => [city, pile[i]]));
    this.revealed = new Map(); // kaupunki -> laattatyyppi

    this.current = 0;
    this.phase = 'action'; // 'action' | 'move' | 'quiz' | 'over'
    this.die = null;
    this.moves = null;
    this.quiz = null;
    this.usedQuestions = new Set();
    this.lastPath = null;
    this.starFound = false;
    this.starCity = null;
    this.winner = null;
    this.turnCount = 1;
    this.log = [];
    this.say(null, 'Peli alkaa! Etsikää Afrikan tähti ja palatkaa Tangeriin tai Kairoon.');
    this.beginTurn();
  }

  // --- apurit -------------------------------------------------------------

  get player() {
    return this.players[this.current];
  }

  say(playerId, text) {
    this.log.unshift({ playerId, text, turn: this.turnCount });
    if (this.log.length > 200) this.log.pop();
  }

  rollDie() {
    return 1 + Math.floor(this.rng() * 6);
  }

  cityOf(player = this.player) {
    return player.pos.type === 'city' ? this.board.cityById.get(player.pos.city) : null;
  }

  tokenHere(player = this.player) {
    const city = this.cityOf(player);
    return city && this.tokens.has(city.id) ? city : null;
  }

  routeName(edgeIdValue) {
    const e = this.board.edgeById.get(edgeIdValue);
    const a = this.board.cityById.get(e.a).name;
    const b = this.board.cityById.get(e.b).name;
    return `${a}–${b}`;
  }

  airportDestinations(player = this.player) {
    const city = this.cityOf(player);
    if (!city || !city.airport || player.money < FLIGHT_PRICE) return [];
    return this.airRoutes
      .filter((r) => r.a === city.id || r.b === city.id)
      .map((r) => (r.a === city.id ? r.b : r.a));
  }

  /** Mitä nykyinen pelaaja voi tehdä juuri nyt. */
  availableActions() {
    if (this.phase !== 'action') {
      return { roll: false, buy: false, quiz: false, fly: [] };
    }
    const p = this.player;
    const tokenCity = this.tokenHere();
    return {
      roll: true,
      buy: !!tokenCity && p.money >= TOKEN_PRICE,
      quiz: !!tokenCity,
      fly: this.airportDestinations(),
    };
  }

  // --- vuoron kulku -------------------------------------------------------

  beginTurn() {
    if (this.phase === 'over') return;
    const p = this.player;
    this.die = null;
    this.moves = null;
    this.lastPath = null;

    // Hevosenkenkä tai tähti kotikaupungissa ratkaisee pelin heti vuoron alussa.
    if (this.checkWin()) return;

    if (this.needsAid(p)) {
      p.money += STRANDED_AID;
      this.say(p.id, `${p.name} on jumissa ilman rahaa ja saa pankilta ${STRANDED_AID} puntaa.`);
    }
  }

  /**
   * Kotisääntö: pelaaja saa pankilta rahaa, jos hän ei pysty liikkumaan lainkaan
   * tai jos rahat ovat lopussa eikä yhteenkään tavoitteeseen pääse ilman laivalippua.
   */
  needsAid(p) {
    if (!hasAnyMove(this.board, p.pos, p.money)) return true;
    if (p.money > 0) return false;

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

  /** Heittää nopan ja laskee mahdolliset päätepisteet. */
  actionRoll() {
    if (this.phase !== 'action') return { ok: false, error: 'Väärä vaihe' };
    const p = this.player;
    const die = this.rollDie();
    this.die = die;
    this.moves = findMoves(this.board, p.pos, die, p.money);
    this.say(p.id, `${p.name} heitti ${die}.`);
    if (this.moves.size === 0) {
      this.say(p.id, `${p.name} ei pysty liikkumaan ja jää paikalleen.`);
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
    p.money -= move.cost;
    p.pos = move.pos;
    this.lastPath = move.path;

    const city = this.cityOf();
    const fare = move.cost ? ` (laivamatka ${move.cost} puntaa)` : '';
    const where = city
      ? `kaupunkiin ${city.name}`
      : `reitille ${this.routeName(move.pos.edge)}`;
    this.say(p.id, `${p.name} siirtyi ${where}${fare}.`);

    this.moves = null;
    this.die = null;
    if (this.checkWin()) return { ok: true, win: true };
    this.endTurn();
    return { ok: true };
  }

  /** Ostaa laatan 100 punnalla. */
  actionBuy() {
    if (this.phase !== 'action') return { ok: false, error: 'Väärä vaihe' };
    const p = this.player;
    const city = this.tokenHere();
    if (!city) return { ok: false, error: 'Täällä ei ole laattaa' };
    if (p.money < TOKEN_PRICE) return { ok: false, error: 'Rahat eivät riitä' };
    p.money -= TOKEN_PRICE;
    this.say(p.id, `${p.name} maksoi ${TOKEN_PRICE} puntaa ja käänsi laatan.`);
    this.revealToken(city.id);
    if (this.phase !== 'over') this.endTurn();
    return { ok: true };
  }

  /** Avaa tietovisakysymyksen: oikea vastaus kääntää laatan ilmaiseksi. */
  actionQuiz() {
    if (this.phase !== 'action') return { ok: false, error: 'Väärä vaihe' };
    const city = this.tokenHere();
    if (!city) return { ok: false, error: 'Täällä ei ole laattaa' };

    const question = this.pickQuestion(city.id);
    const order = this.shuffledOrder(question.options.length);
    this.quiz = {
      cityId: city.id,
      question: question.q,
      fact: question.fact,
      options: order.map((i) => question.options[i]),
      correct: order.indexOf(question.correct),
      chosen: null,
      right: null,
    };
    this.phase = 'quiz';
    return { ok: true, quiz: this.quiz };
  }

  /** Vastaa kysymykseen. Tulos jää näkyviin kunnes closeQuiz() kutsutaan. */
  answerQuiz(index) {
    if (this.phase !== 'quiz' || !this.quiz || this.quiz.chosen !== null) {
      return { ok: false, error: 'Ei avointa kysymystä' };
    }
    const p = this.player;
    const city = this.board.cityById.get(this.quiz.cityId);
    this.quiz.chosen = index;
    this.quiz.right = index === this.quiz.correct;

    if (this.quiz.right) {
      this.say(p.id, `${p.name} vastasi oikein kaupungissa ${city.name} ja saa kääntää laatan.`);
      this.quiz.found = this.revealToken(this.quiz.cityId);
    } else {
      const oikea = this.quiz.options[this.quiz.correct];
      this.say(p.id, `${p.name} vastasi väärin — oikea vastaus oli "${oikea}".`);
    }
    return { ok: true, right: this.quiz.right };
  }

  /** Sulkee kysymyksen ja päättää vuoron. */
  closeQuiz() {
    if (!this.quiz) return { ok: false, error: 'Ei avointa kysymystä' };
    this.quiz = null;
    if (this.phase === 'over') return { ok: true };
    this.phase = 'action';
    this.endTurn();
    return { ok: true };
  }

  /** Kysymys kaupungille: ensin omat, sitten varapakka, lopuksi kierrätys. */
  pickQuestion(cityId) {
    const pools = [QUESTIONS[cityId] ?? [], QUESTIONS.general];
    for (const pool of pools) {
      const fresh = pool.filter((q) => !this.usedQuestions.has(q.q));
      if (fresh.length) {
        const question = fresh[Math.floor(this.rng() * fresh.length)];
        this.usedQuestions.add(question.q);
        return question;
      }
    }
    const all = [...(QUESTIONS[cityId] ?? []), ...QUESTIONS.general];
    return all[Math.floor(this.rng() * all.length)];
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
    const p = this.player;
    if (!this.airportDestinations().includes(destination)) {
      return { ok: false, error: 'Sinne ei ole lentoa' };
    }
    p.money -= FLIGHT_PRICE;
    p.pos = { type: 'city', city: destination };
    this.lastPath = null;
    const city = this.board.cityById.get(destination);
    this.say(p.id, `${p.name} lensi ${FLIGHT_PRICE} punnalla kaupunkiin ${city.name}.`);
    if (this.checkWin()) return { ok: true, win: true };
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
    const token = TOKEN_TYPES[type];
    p.finds.push(type);
    const city = this.board.cityById.get(cityId);

    switch (type) {
      case 'star':
        p.hasStar = true;
        this.starFound = true;
        this.starCity = cityId;
        this.say(p.id, `★ ${p.name} löysi AFRIKAN TÄHDEN kaupungista ${city.name}!`);
        this.say(null, 'Nyt on kiire kotiin — myös hevosenkengän haltija voi voittaa pelin.');
        break;
      case 'horseshoe':
        p.horseshoes++;
        this.say(p.id, `Ω ${p.name} löysi hevosenkengän kaupungista ${city.name}.`);
        break;
      case 'robber':
        this.say(p.id, `☠ Ryöstäjä yllätti pelaajan ${p.name} ja vei ${p.money} puntaa!`);
        p.money = 0;
        break;
      case 'empty':
        this.say(p.id, `${p.name} käänsi tyhjän laatan kaupungissa ${city.name}.`);
        break;
      default:
        p.money += token.value;
        this.say(p.id, `${token.symbol} ${p.name} löysi jalokiven ${token.name} (${token.value} puntaa).`);
    }

    this.checkWin();
    return type;
  }

  /** Voitto: tähden tai hevosenkengän kanssa aloituskaupunkiin sen jälkeen kun tähti on löytynyt. */
  checkWin() {
    if (this.winner) return true;
    if (!this.starFound) return false;
    const p = this.player;
    const city = this.cityOf();
    if (!city || !city.start) return false;
    if (!p.hasStar && p.horseshoes === 0) return false;

    this.winner = p;
    this.phase = 'over';
    const reason = p.hasStar
      ? 'toi Afrikan tähden turvallisesti kotiin'
      : 'ehti hevosenkengän kanssa kotiin ensimmäisenä';
    this.say(p.id, `🏆 ${p.name} ${reason} kaupungissa ${city.name} ja voitti pelin!`);
    return true;
  }

  /** Siirtolista UI:lle: avain, sijainti, hinta ja kaupungin tiedot. */
  moveOptions() {
    if (this.phase !== 'move' || !this.moves) return [];
    return [...this.moves.entries()].map(([key, m]) => ({
      key,
      pos: m.pos,
      cost: m.cost,
      city: m.pos.type === 'city' ? this.board.cityById.get(m.pos.city) : null,
      hasToken: m.pos.type === 'city' && this.tokens.has(m.pos.city),
    }));
  }
}

export { posKey };
