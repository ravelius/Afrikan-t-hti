// Pelin tila ja säännöt: vuorot, laattojen kääntäminen ja voittoehdot.

import { CITIES, EDGES, AIR_ROUTES, TOKEN_CITIES, FLIGHT_PRICE } from './board.js';
import { buildBoard, findMoves, posKey, hasAnyMove, reachableCities } from './rules.js';
import { TOKEN_TYPES, createTokenPile } from './tokens.js';

export const START_MONEY = 300;
export const TOKEN_PRICE = 100;
export const LUCK_LIMIT = 4; // nopalla 4–6 laatta kääntyy ilmaiseksi
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
    this.phase = 'action'; // 'action' | 'move' | 'over'
    this.die = null;
    this.luckDie = null;
    this.moves = null;
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
      return { roll: false, buy: false, luck: false, fly: [] };
    }
    const p = this.player;
    const tokenCity = this.tokenHere();
    return {
      roll: true,
      buy: !!tokenCity && p.money >= TOKEN_PRICE,
      luck: !!tokenCity,
      fly: this.airportDestinations(),
    };
  }

  // --- vuoron kulku -------------------------------------------------------

  beginTurn() {
    if (this.phase === 'over') return;
    const p = this.player;
    this.die = null;
    this.luckDie = null;
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
    this.die = this.rollDie();
    this.moves = findMoves(this.board, p.pos, this.die, p.money);
    this.say(p.id, `${p.name} heitti ${this.die}.`);
    if (this.moves.size === 0) {
      this.say(p.id, `${p.name} ei pysty liikkumaan ja jää paikalleen.`);
      this.endTurn();
      return { ok: true, moved: false };
    }
    this.phase = 'move';
    return { ok: true, moved: false, die: this.die };
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

  /** Kokeilee onnea: 4–6 kääntää laatan ilmaiseksi. */
  actionLuck() {
    if (this.phase !== 'action') return { ok: false, error: 'Väärä vaihe' };
    const p = this.player;
    const city = this.tokenHere();
    if (!city) return { ok: false, error: 'Täällä ei ole laattaa' };
    this.luckDie = this.rollDie();
    if (this.luckDie >= LUCK_LIMIT) {
      this.say(p.id, `${p.name} kokeili onneaan ja heitti ${this.luckDie} — laatta kääntyy!`);
      this.revealToken(city.id);
    } else {
      this.say(p.id, `${p.name} kokeili onneaan mutta heitti vain ${this.luckDie}.`);
    }
    if (this.phase !== 'over') this.endTurn();
    return { ok: true, die: this.luckDie };
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
