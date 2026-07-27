import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PACKS, packById, allQuestions, factSource, factText, factVoice, isSourceUrl,
  sourceLabel, sourceList, voiceTitle,
} from '../js/pack.js';

/** Lähde on merkkijono tai lista merkkijonoja; verkko-osoite vain http(s). */
function checkSources(source, where) {
  if (source === undefined) return 0;
  const list = Array.isArray(source) ? source : [source];
  assert.ok(list.length > 0, `${where}: tyhjä lähdelista`);
  for (const item of list) {
    assert.equal(typeof item, 'string', `${where}: lähteen pitää olla merkkijono`);
    assert.ok(item.trim().length >= 4, `${where}: liian lyhyt lähde`);
    if (/^\w+:\/\//.test(item.trim())) {
      assert.ok(isSourceUrl(item), `${where}: vain http- ja https-osoitteet kelpaavat`);
    }
  }
  return list.length;
}
import { buildBoard, findMoves, posKey, cityDistances, pointAlong } from '../js/rules.js';
import { isOnLand } from '../js/mapart.js';
import { tokenPileTemplate } from '../js/tokens.js';
import {
  Game, mulberry32, questionLevel, FLIGHT_PRICE, START_MONEY, STAR_PRIZE, STRANDED_AID,
  DUEL_BYPASS_SHOES, DUEL_PRIZE, FIFTY_FIFTY_PRICE, HARD_BONUS, HINT_PRICE,
  QUIZ_SECONDS, SEA_FARE, HINT_EVERY_TURNS,
} from '../js/game.js';
import {
  chooseDuelAnswer, chooseMove, chooseQuizAnswer, chooseTravel,
  wantsDuelBypass, wantsDuelRelief, wantsFiftyFifty, wantsHint,
} from '../js/ai.js';

const AFRICA = packById('africa');
const board = buildBoard(AFRICA.cities, AFRICA.edges);

/** Kahden pelaajan peli testejä varten (Afrikan laudalla). */
function newGame(seed = 5) {
  return new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    seed,
  });
}

// --- jokaista pakettia koskevat eheystestit --------------------------------

// Laudat, joiden kahden äänen sisältö on kirjoitettu valmiiksi: näiltä
// vaaditaan täysi määrä saapumismerkintöjä ja aarrevihje jokaiselle
// aarrekaupungille. Kun laudan sisältö valmistuu, lisää sen tunnus tähän —
// muutos on julkaisuportti, ei muotoseikka (docs/tyolista-opukselle.md,
// paketit 4 ja 5).
const VOICES_DONE = new Set(['maailma', 'africa', 'suomi', 'istanbul']);

for (const pack of PACKS) {
  const packBoard = buildBoard(pack.cities, pack.edges);
  const startCities = pack.cities.filter((c) => c.start);
  const home = startCities[0].id;

  test(`${pack.id}: lauta rakentuu ja on yhtenäinen`, () => {
    assert.ok(startCities.length >= 2, 'aloituskaupunkeja pitää olla ainakin kaksi');
    for (const city of pack.cities) {
      assert.ok(packBoard.adj.get(city.id).length > 0, `${city.id} on irrallaan`);
    }
    const dist = cityDistances(packBoard, home);
    for (const city of pack.cities) {
      assert.ok(dist.has(city.id), `${city.id} ei ole saavutettavissa kaupungista ${home}`);
    }
  });

  test(`${pack.id}: laattoja on yhtä monta kuin laattakaupunkeja`, () => {
    const pile = tokenPileTemplate(pack.tokens.counts);
    const tokenCities = pack.cities.filter((c) => !c.start);
    assert.equal(pile.length, tokenCities.length);
    assert.equal(pack.tokens.counts.star, 1);
    assert.ok(pack.tokens.counts.horseshoe >= 1);
    for (const type of Object.keys(pack.tokens.counts)) {
      assert.ok(pack.tokens.types[type], `laattatyyppiä ${type} ei ole määritelty`);
    }
  });

  test(`${pack.id}: kysymyspankki on ehjä`, () => {
    const cityIds = pack.cities.filter((c) => !c.start).map((c) => c.id);
    for (const id of cityIds) {
      assert.ok(pack.questions[id]?.length >= 2, `kaupungilta ${id} puuttuu kysymyksiä`);
    }
    assert.ok(pack.questions.general.length >= 10);

    for (const q of allQuestions(pack)) {
      assert.ok(q.q.trim().length > 0, 'tyhjä kysymys');
      assert.equal(q.options.length, 4, `kysymyksellä "${q.q}" ei ole neljää vaihtoehtoa`);
      assert.equal(new Set(q.options).size, 4, `kysymyksessä "${q.q}" on kaksi samaa vaihtoehtoa`);
      assert.ok(
        Number.isInteger(q.correct) && q.correct >= 0 && q.correct < 4,
        `kysymyksen "${q.q}" oikea vastaus on virheellinen`,
      );
      assert.ok(q.fact && q.fact.length > 0, `kysymykseltä "${q.q}" puuttuu selitys`);
      assert.ok(q.hint && q.hint.length > 0, `kysymykseltä "${q.q}" puuttuu vihje`);
      const oikea = q.options[q.correct].toLowerCase();
      assert.ok(
        !q.hint.toLowerCase().includes(oikea),
        `kysymyksen "${q.q}" vihje paljastaa vastauksen`,
      );
      checkSources(q.source, `kysymys "${q.q}"`);
    }

    for (const duel of pack.duels ?? []) {
      checkSources(duel.source, `kaksintaistelu "${duel.q}"`);
    }

    const texts = allQuestions(pack).map((q) => q.q);
    assert.equal(new Set(texts).size, texts.length, 'sama kysymys esiintyy kahdesti');

    // Vaikeustasot: taso on 1–3, ja helppoja ja vaikeita on riittävästi,
    // jotta lapsipelaajan taso ja vaikean kysymyksen bonus toimivat.
    const levels = allQuestions(pack).map(questionLevel);
    assert.ok(levels.every((l) => [1, 2, 3].includes(l)), 'virheellinen vaikeustaso');
    assert.ok(levels.filter((l) => l === 1).length >= 10, 'liian vähän helppoja kysymyksiä');
    assert.ok(levels.filter((l) => l === 3).length >= 10, 'liian vähän vaikeita kysymyksiä');
  });

  test(`${pack.id}: jokaisella kaupungilla on tiesitkö-tietoja`, () => {
    for (const city of pack.cities) {
      const facts = pack.placeFacts[city.id];
      assert.ok(Array.isArray(facts) && facts.length >= 2, `${city.id}: liian vähän tietoja`);
      const texts = facts.map(factText);
      for (const fact of facts) {
        assert.ok(factText(fact).trim().length > 20, `${city.id}: liian lyhyt tieto`);
        checkSources(typeof fact === 'string' ? undefined : fact.source, `tieto ${city.id}`);
      }
      assert.equal(new Set(texts).size, texts.length, `${city.id}: sama tieto kahdesti`);
    }
    const extra = Object.keys(pack.placeFacts).filter((id) => !pack.cities.some((c) => c.id === id));
    assert.deepEqual(extra, [], 'tietoja kaupungeille joita ei ole laudalla');
  });

  test(`${pack.id}: merireitit kulkevat veden päällä`, () => {
    const HARBOUR = 55; // satamaan johtava pätkä saa kulkea maalla
    for (const edge of packBoard.edges) {
      if (edge.type !== 'sea') continue;
      const a = packBoard.cityById.get(edge.a);
      const b = packBoard.cityById.get(edge.b);
      for (let t = 0.02; t <= 0.98; t += 0.02) {
        const { x, y } = pointAlong(edge.poly, t);
        if (Math.hypot(x - a.x, y - a.y) < HARBOUR) continue;
        if (Math.hypot(x - b.x, y - b.y) < HARBOUR) continue;
        assert.ok(!isOnLand([x, y], pack.map), `${edge.id} kulkee maalla kohdassa t=${t.toFixed(2)}`);
      }
    }
  });

  test(`${pack.id}: kartan reunaan yltävä manner jatkuu reunan yli`, () => {
    // Jos ääriviiva pysähtyy tarkalleen kehykseen, maa näyttää katkeavan
    // mereen suorana viivana. Reunaan yltävän ääriviivan pitää siksi jatkua
    // selvästi kehyksen yli — häivytyksen hoitaa kartan vinjetti.
    const OVER = 10; // kuinka kauas kehyksen yli pisteen pitää yltää
    for (const outline of pack.map.outlines) {
      const xs = outline.map(([x]) => x);
      const ys = outline.map(([, y]) => y);
      const reaches = (vals, edge, sign) => vals.some((v) => sign * (v - edge) >= -2);
      const crosses = (vals, edge, sign) => vals.some((v) => sign * (v - edge) > OVER);
      for (const [vals, edge, sign, side] of [
        [xs, 0, -1, 'vasen'], [xs, pack.map.width, 1, 'oikea'],
        [ys, 0, -1, 'ylä'], [ys, pack.map.height, 1, 'ala'],
      ]) {
        if (!reaches(vals, edge, sign)) continue;
        assert.ok(crosses(vals, edge, sign), `ääriviiva pysähtyy ${side}reunaan`);
      }
    }
  });

  test(`${pack.id}: kaupungit ovat mantereella ja riittävän erillään`, () => {
    const islands = new Set(pack.islands ?? []);
    for (const city of pack.cities) {
      if (islands.has(city.id)) continue; // saaret ovat oma ääriviivansa tai rannikon tuntumassa
      assert.ok(isOnLand([city.x, city.y], pack.map), `${city.name} on meressä`);
    }

    const min = pack.minCityDistance;
    for (let i = 0; i < pack.cities.length; i++) {
      for (let j = i + 1; j < pack.cities.length; j++) {
        const a = pack.cities[i];
        const b = pack.cities[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        assert.ok(d >= min, `${a.name} ja ${b.name} ovat liian lähekkäin (${Math.round(d)})`);
      }
    }
  });

  test(`${pack.id}: lentokentät ja aloituskaupungit ovat kunnossa`, () => {
    const byId = packBoard.cityById;
    for (const route of pack.airRoutes) {
      assert.ok(byId.get(route.a)?.airport, `${route.a} ei ole lentokenttä`);
      assert.ok(byId.get(route.b)?.airport, `${route.b} ei ole lentokenttä`);
    }
    for (const city of startCities) {
      assert.ok(city.airport, `aloituskaupungissa ${city.id} ei ole lentokenttää`);
    }
  });

  test(`${pack.id}: saapumismerkinnät on kirjoitettu`, () => {
    const notes = pack.texts.diaries;
    assert.ok(Array.isArray(notes) && notes.length > 0, 'texts.diaries puuttuu');
    assert.equal(new Set(notes).size, notes.length, 'sama merkintä kahdesti');
    for (const note of notes) {
      assert.equal(typeof note, 'string');
      assert.ok(note.length >= 30, `merkintä on liian lyhyt: "${note}"`);
    }
    if (VOICES_DONE.has(pack.id)) {
      assert.ok(notes.length >= 4, 'saapumismerkintöjä tarvitaan vähintään neljä');
    }
  });

  // Isoisän taitettu sivu vihjaa laudan pääaarteesta. Vihje ei saa paljastaa
  // kaupunkia eikä osoittaa kaupunkiin, jota laudalla ei ole. Täysi kattavuus
  // vaaditaan laudoilta, joiden sisältö on kirjoitettu (VOICES_DONE).
  test(`${pack.id}: aarrevihjeet eivät paljasta kaupunkia`, () => {
    const hints = pack.texts.starHints;
    assert.ok(hints && typeof hints === 'object', 'texts.starHints puuttuu');
    const extra = Object.keys(hints).filter((id) => !pack.cities.some((c) => c.id === id));
    assert.deepEqual(extra, [], 'vihje osoittaa tuntemattomaan kaupunkiin');

    for (const city of pack.cities) {
      const hint = hints[city.id];
      if (!hint) continue;
      assert.ok(hint.length >= 40, `${city.id}: vihje on liian lyhyt`);
      // Nimen jokainen kunnollinen sana tarkistetaan erikseen sanarajoilla:
      // lyhyt alkuosa (esim. "Al Kufra") osuisi muuten keskelle muita sanoja.
      for (const word of city.name.split(/[ ()]+/).filter((w) => w.length >= 4)) {
        assert.ok(
          !new RegExp(`\\b${word}`, 'i').test(hint),
          `${city.id}: vihje nimeää kaupungin ("${word}")`,
        );
      }
    }

    if (!VOICES_DONE.has(pack.id)) return;
    for (const city of pack.cities.filter((c) => !c.start)) {
      assert.ok(hints[city.id], `vihje puuttuu kaupungilta ${city.id}`);
    }
  });

  test(`${pack.id}: rosvon kaksintaistelupakka on ehjä`, () => {
    assert.ok(pack.duels.length >= 4, 'liian vähän kaksintaistelukysymyksiä');
    for (const q of pack.duels) {
      assert.equal(q.options.length, 8, `"${q.q}": tarvitaan 8 vaihtoehtoa`);
      assert.equal(new Set(q.options).size, 8, `"${q.q}": kaksi samaa vaihtoehtoa`);
      assert.ok(
        Number.isInteger(q.correct) && q.correct >= 0 && q.correct < 8,
        `"${q.q}": oikea vastaus on virheellinen`,
      );
      assert.ok(q.fact && q.fact.length > 0, `"${q.q}": selitys puuttuu`);
    }
  });

  test(`${pack.id}: kaupunkien nimet eivät mene päällekkäin`, () => {
    // Karkea arvio nimikyltin laatikosta samalla kaavalla kuin piirrossa.
    // Ei pikselintarkka, mutta nappaa aidot ruuhkat (nimi nimen päällä).
    const labelRect = (c) => {
      const perChar = c.start ? 11 : 8.6;
      const w = c.name.length * perChar;
      const anchor = c.la ?? 'middle';
      const lx = c.x + (c.lx ?? 0);
      const ly = c.y + (c.ly ?? -(c.start ? 28 : 19));
      const x0 = anchor === 'start' ? lx : anchor === 'end' ? lx - w : lx - w / 2;
      return { x0, x1: x0 + w, y0: ly - 14, y1: ly + 4 };
    };
    const overlap = (r, s, slack) =>
      r.x0 < s.x1 - slack && s.x0 < r.x1 - slack && r.y0 < s.y1 - slack && s.y0 < r.y1 - slack;

    const rects = pack.cities.map((c) => ({ city: c, rect: labelRect(c) }));
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        assert.ok(
          !overlap(rects[i].rect, rects[j].rect, 3),
          `nimet ${rects[i].city.name} ja ${rects[j].city.name} menevät päällekkäin`,
        );
      }
      // Nimi ei saa peittää toisen kaupungin palloa eikä sen laattaa.
      for (const other of pack.cities) {
        if (other.id === rects[i].city.id) continue;
        const spots = [{ x: other.x, y: other.y, r: other.start ? 21 : 13 }];
        // Laatta on vain aarrekaupungeissa.
        if (!other.start) spots.push({ x: other.x + 22, y: other.y + 18, r: 17 });
        for (const spot of spots) {
          const r = rects[i].rect;
          const nx = Math.max(r.x0, Math.min(spot.x, r.x1));
          const ny = Math.max(r.y0, Math.min(spot.y, r.y1));
          assert.ok(
            Math.hypot(spot.x - nx, spot.y - ny) >= spot.r - 4,
            `nimi ${rects[i].city.name} peittää kaupungin ${other.name}`,
          );
        }
      }
    }
  });

  test(`${pack.id}: koristeet ovat vedessä ja irti pelialueesta`, () => {
    const { decor } = pack;
    const cityDist = (p) =>
      Math.min(...pack.cities.map((c) => Math.hypot(c.x - p.x, c.y - p.y)));

    assert.ok(!isOnLand([decor.compass.x, decor.compass.y], pack.map), 'kompassi on maalla');
    assert.ok(
      cityDist(decor.compass) >= decor.compass.r + 20,
      'kompassi on liian lähellä kaupunkia',
    );
    if (decor.ship) {
      assert.ok(!isOnLand([decor.ship.x, decor.ship.y], pack.map), 'laiva on maalla');
      assert.ok(cityDist(decor.ship) >= 65, 'laiva on liian lähellä kaupunkia');
    }
    if (decor.serpent) {
      assert.ok(!isOnLand([decor.serpent.x, decor.serpent.y], pack.map), 'merikäärme on maalla');
      assert.ok(cityDist(decor.serpent) >= 70, 'merikäärme on liian lähellä kaupunkia');
    }

    // Otsikko selitteineen ei saa peittää kaupunkeja eikä reittejä.
    const title = decor.mapLabelPos;
    const titleHalf = Math.max(115, decor.mapLabel.length * 12.5);
    const inTitle = (x, y) =>
      x > title.x - titleHalf && x < title.x + titleHalf && y > title.y - 36 && y < title.y + 62;
    for (const c of pack.cities) {
      assert.ok(!inTitle(c.x, c.y), `otsikko peittää kaupungin ${c.name}`);
    }
    for (const e of packBoard.edges) {
      for (const [x, y] of e.poly) {
        assert.ok(!inTitle(x, y), `otsikko peittää reitin ${e.id}`);
      }
    }
  });

  test(`${pack.id}: porttien linkit ovat vastavuoroisia`, () => {
    // Portista pitää päästä myös takaisin: kohdekaupungista on linkki
    // lähtölaudalle, jottei vaeltaja jää loukkuun vieraalle laudalle.
    for (const city of pack.cities) {
      for (const link of city.links ?? []) {
        const target = PACKS.find((p) => p.id === link.pack)
          ?.cities.find((c) => c.id === link.city);
        if (!target) continue; // linkkien kohteet tarkistetaan omassa testissään
        assert.ok(
          (target.links ?? []).some((back) => back.pack === pack.id),
          `${pack.id}:${city.id} → ${link.pack}:${link.city} ilman paluulinkkiä`,
        );
      }
    }
  });

  test(`${pack.id}: porttikaupunkien linkit osoittavat oikeisiin paikkoihin`, () => {
    for (const city of pack.cities) {
      for (const link of city.links ?? []) {
        const target = PACKS.find((p) => p.id === link.pack);
        assert.ok(target, `${city.id}: tuntematon lauta ${link.pack}`);
        assert.ok(
          target.cities.some((c) => c.id === link.city),
          `${city.id}: linkin kohdetta ${link.city} ei ole laudalla ${link.pack}`,
        );
        assert.ok(link.label, `${city.id}: linkiltä puuttuu nimi`);
      }
    }
  });

  test(`${pack.id}: bottien peli päättyy voittoon`, () => {
    const game = new Game({
      players: [
        { name: 'Botti 1', color: '#f00', start: startCities[0].id, isBot: true },
        { name: 'Botti 2', color: '#00f', start: startCities[1].id, isBot: true },
        { name: 'Botti 3', color: '#0f0', start: startCities[0].id, isBot: true },
      ],
      pack,
      rng: mulberry32(2024),
    });

    let steps = 0;
    while (game.phase !== 'over' && steps < 8000) {
      playBotStep(game);
      steps++;
    }

    assert.equal(game.phase, 'over');
    assert.ok(game.winner);
    assert.ok(game.starFound);
  });
}

// --- pelimekaniikan testit (Afrikan laudalla) ------------------------------

test('kaupunkiin pääsee ilman tasalukua, reitille vain täydellä heitolla', () => {
  const start = { type: 'city', city: 'tanger' };
  for (let die = 1; die <= 6; die++) {
    const moves = findMoves(board, start, die, { mode: 'land' });
    assert.ok(moves.size > 0);
    for (const [, move] of moves) {
      assert.ok(move.path.length <= die, `siirto käytti yli ${die} askelta`);
      if (move.pos.type === 'edge') {
        assert.equal(move.path.length, die, 'reitin varrelle pysähdytään vasta heiton loputtua');
      }
    }
  }

  // Tripoli on neljän askelen päässä: sinne pääsee myös viitosella ja kuutosella.
  for (const die of [4, 5, 6]) {
    assert.ok(findMoves(board, start, die, { mode: 'land' }).has('c:tripoli'), `heitto ${die}`);
  }
  assert.ok(!findMoves(board, start, 3, { mode: 'land' }).has('c:tripoli'));
});

test('matkustustapa rajaa käytettävät reitit', () => {
  const start = { type: 'city', city: 'tanger' };
  const land = findMoves(board, start, 3, { mode: 'land' });
  const sea = findMoves(board, start, 3, { mode: 'sea' });

  // Maitse ei päädytä laivareitille eikä päinvastoin.
  const onSeaRoute = (move) =>
    move.pos.type === 'edge' && board.edgeById.get(move.pos.edge).type === 'sea';
  assert.ok([...land.values()].every((m) => !onSeaRoute(m)));
  assert.ok(sea.size > 0, 'Tangerista lähtee laivareitti');
  assert.ok([...sea.values()].every((m) => m.pos.type === 'city' || onSeaRoute(m)));
  assert.ok(sea.has('c:dakar'), 'kolmella askeleella pääsee Dakariin laivalla');
  assert.ok(!land.has('c:dakar'));
});

test('kesken reitin ei saa kääntyä takaisin', () => {
  const pos = { type: 'edge', edge: 'tanger|tripoli', idx: 2 };
  const moves = findMoves(board, pos, 2, { mode: 'land' });
  const keys = [...moves.keys()].sort();
  assert.deepEqual(keys, ['c:tanger', 'c:tripoli']);
  assert.ok(!moves.has(posKey(pos)), 'lähtöruutuun ei jäädä');
  // Kahdella askeleella molempiin päihin: kumpikaan ei vaadi peruutusta.
  assert.equal(moves.get('c:tripoli').path.length, 2);
});

// Käyttöliittymän "Jalan"-nappi tekee molemmat askeleet yhdellä painalluksella
// ja reitin varrella noppa pyörähtää itsestään. Kumpikin nojaa siihen, että
// moottorissa nämä kaksi kutsua saa ketjuttaa peräkkäin.
test('maavalinnan ja nopanheiton saa ketjuttaa yhdellä painalluksella', () => {
  const game = newGame(9);
  const chosen = game.actionTravel('land');
  assert.ok(chosen.ok);
  assert.equal(game.phase, 'roll');
  assert.equal(game.autoTravel, false, 'Tangerissa on muitakin tapoja');

  const rolled = game.actionRoll();
  assert.ok(rolled.ok);
  assert.ok(rolled.die >= 1 && rolled.die <= 6);
  assert.equal(game.phase, 'move');
});

test('kesken reittiä matkustustapa lukittuu ja valitaan automaattisesti', () => {
  const game = newGame(11);
  game.player.pos = { type: 'edge', edge: 'tanger|tripoli', idx: 2, from: 'tanger' };
  assert.deepEqual(game.travelModes(), ['land'], 'reitin varrella ei ole valinnanvaraa');

  game.beginTurn();
  assert.equal(game.autoTravel, true);
  assert.equal(game.travelMode, 'land');
  assert.equal(game.phase, 'roll', 'matkustustapa on jo valittu puolesta');
  assert.equal(game.actionCancelTravel().ok, false, 'automaattivalintaa ei peruta');
});

test('saarelta pääsee vain laivalla ja vain jos rahat riittävät', () => {
  const game = newGame();
  game.player.pos = { type: 'city', city: 'sansibar' };
  game.player.money = SEA_FARE;
  assert.ok(game.travelModes().includes('sea'));
  assert.ok(!game.travelModes().includes('land'), 'Sansibarista ei lähde maareittiä');

  game.player.money = 0;
  assert.ok(!game.travelModes().includes('sea'), 'ilman rahaa laivaan ei pääse');
  assert.equal(findMoves(board, game.player.pos, 3, { mode: 'land' }).size, 0);
});

test('jumiin jäänyt saa avustuksen vuoron alussa', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    rng: mulberry32(7),
  });
  const p = game.players[0];
  p.money = 0;
  p.pos = { type: 'city', city: 'sansibar' };
  game.beginTurn();
  assert.equal(p.money, STRANDED_AID);
});

test('laattojen vaikutukset: jalokivi, ryöstäjä ja tähti', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    rng: mulberry32(3),
  });
  const p = game.player;
  p.pos = { type: 'city', city: 'timbuktu' };

  game.tokens.set('timbuktu', 'ruby');
  game.revealToken('timbuktu');
  assert.equal(p.money, START_MONEY + 1000);

  game.tokens.set('timbuktu', 'robber');
  game.revealToken('timbuktu');
  assert.equal(p.money, START_MONEY + 1000, 'rosvo ei vie rahoja ennen kaksintaistelua');
  assert.ok(game.duelArmed, 'rosvo virittää kaksintaistelun');
  game.duelArmed = false;

  game.tokens.set('timbuktu', 'star');
  game.revealToken('timbuktu');
  assert.ok(p.hasStar);
  assert.ok(game.starFound);
});

test('tähti kotiin voittaa, hevosenkenkä voi ehtiä ensin', () => {
  const makeGame = () =>
    new Game({
      players: [
        { name: 'A', color: '#f00', start: 'tanger' },
        { name: 'B', color: '#00f', start: 'kairo' },
      ],
      rng: mulberry32(11),
    });

  const g1 = makeGame();
  g1.player.hasStar = true;
  g1.starFound = true;
  g1.player.pos = { type: 'city', city: 'tanger' };
  assert.ok(g1.checkWin());
  assert.equal(g1.winner.name, 'A');
  assert.equal(g1.phase, 'over');

  // Ilman tähteä hevosenkenkä ei riitä ennen kuin tähti on löytynyt.
  const g2 = makeGame();
  g2.player.horseshoes = 1;
  g2.player.pos = { type: 'city', city: 'tanger' };
  assert.equal(g2.checkWin(), false);
  g2.starFound = true;
  assert.ok(g2.checkWin());
});

/** Yksi botin askel nykyisessä vaiheessa. */
function playBotStep(game) {
  if (game.phase === 'duel') {
    if (game.duel.chosen !== null) game.closeDuel();
    else if (wantsDuelBypass(game)) game.actionDuelBypass();
    else if (wantsDuelRelief(game)) game.actionDuelRelief();
    else game.answerDuel(chooseDuelAnswer(game));
    return;
  }
  if (game.phase === 'move') {
    const key = chooseMove(game);
    if (key) game.actionMove(key);
    else game.endTurn();
  } else if (game.phase === 'quiz') {
    if (game.quiz.chosen !== null) game.closeQuiz();
    else if (wantsHint(game)) game.actionHint();
    else if (wantsFiftyFifty(game)) game.actionFiftyFifty();
    else game.answerQuiz(chooseQuizAnswer(game));
  } else if (game.phase === 'offer') {
    game.actionQuiz();
  } else if (game.phase === 'roll') {
    game.actionRoll();
  } else {
    const travel = chooseTravel(game);
    if (travel.type === 'fly') game.actionFly(travel.destination);
    else game.actionTravel(travel.type);
  }
}

test('oikea vastaus kääntää laatan, väärä ei', () => {
  const makeGame = () => {
    const game = new Game({
      players: [
        { name: 'A', color: '#f00', start: 'tanger' },
        { name: 'B', color: '#00f', start: 'kairo' },
      ],
      rng: mulberry32(42),
    });
    game.player.pos = { type: 'city', city: 'timbuktu' };
    game.tokens.set('timbuktu', 'ruby');
    return game;
  };

  const win = makeGame();
  win.phase = 'offer';
  assert.ok(win.actionQuiz().ok);
  assert.equal(win.phase, 'quiz');
  assert.equal(win.quiz.options.length, 4);
  const rahaEnnen = win.player.money;
  win.answerQuiz(win.quiz.correct);
  assert.equal(win.revealed.get('timbuktu'), 'ruby');
  assert.equal(win.players[0].money, rahaEnnen + 1000);
  win.closeQuiz();
  assert.equal(win.phase, 'action');
  assert.equal(win.current, 1, 'vuoro siirtyy vastauksen jälkeen');

  const lose = makeGame();
  lose.phase = 'offer';
  lose.actionQuiz();
  const vaara = (lose.quiz.correct + 1) % 4;
  lose.answerQuiz(vaara);
  assert.equal(lose.quiz.right, false);
  assert.ok(lose.tokens.has('timbuktu'), 'laatta jää kääntämättä');
  lose.closeQuiz();
  assert.equal(lose.current, 1);
});

test('helppojen kysymysten pelaaja saa tason 1 kysymyksen', () => {
  const game = new Game({
    players: [
      { name: 'Lapsi', color: '#f00', start: 'tanger', quizLevel: 'easy' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    rng: mulberry32(17),
  });
  const levelByText = new Map(allQuestions(AFRICA).map((q) => [q.q, questionLevel(q)]));
  game.player.pos = { type: 'city', city: 'tripoli' };
  game.tokens.set('tripoli', 'topaz');
  for (let i = 0; i < 5; i++) {
    game.phase = 'offer';
    game.actionQuiz();
    assert.equal(levelByText.get(game.quiz.question), 1, `"${game.quiz.question}" ei ole helppo`);
    game.quiz = null;
  }
});

test('vaikea kysymys antaa bonuksen oikeasta vastauksesta', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    rng: mulberry32(23),
  });
  const levelByText = new Map(allQuestions(AFRICA).map((q) => [q.q, questionLevel(q)]));
  game.player.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'topaz');

  assert.ok(game.hardAvailable('timbuktu'));
  game.phase = 'offer';
  const tulos = game.actionQuiz({ hard: true });
  assert.ok(tulos.ok);
  assert.ok(game.quiz.hard);
  assert.equal(levelByText.get(game.quiz.question), 3, 'kysymyksen pitää olla vaikea');

  game.answerQuiz(game.quiz.correct);
  assert.equal(game.player.money, START_MONEY + HARD_BONUS + 300, 'bonus ja topaasin arvo');
  assert.equal(game.revealed.get('timbuktu'), 'topaz');
});

test('väärä vastaus vaikeaan kysymykseen ei anna bonusta', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    rng: mulberry32(29),
  });
  game.player.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'topaz');
  game.phase = 'offer';
  game.actionQuiz({ hard: true });
  game.answerQuiz((game.quiz.correct + 1) % 4);
  assert.equal(game.player.money, START_MONEY);
  assert.ok(game.tokens.has('timbuktu'), 'laatta jää kääntämättä');
});

test('tasovalinta laskeutuu pehmeästi, jos tason kysymyksiä ei ole', () => {
  // Oma minilauta: kysymyksiä on vain oletustasolla 2.
  const pack = {
    ...AFRICA,
    questions: {
      timbuktu: [
        { q: 'T1?', options: ['a', 'b', 'c', 'd'], correct: 0, fact: 'f', hint: 'h' },
      ],
      general: [
        { q: 'G1?', options: ['a', 'b', 'c', 'd'], correct: 0, fact: 'f', hint: 'h' },
      ],
    },
  };
  const game = new Game({
    players: [
      { name: 'Lapsi', color: '#f00', start: 'tanger', quizLevel: 'easy' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    pack,
    rng: mulberry32(31),
  });
  game.player.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'topaz');

  // Helppoja ei ole, joten pelaaja saa tason 2 kysymyksen virheen sijaan.
  game.phase = 'offer';
  assert.ok(game.actionQuiz().ok);
  assert.ok(['T1?', 'G1?'].includes(game.quiz.question));
  game.quiz = null;

  // Vaikeita ei ole, joten vaikeaa kysymystä ei tarjota.
  assert.equal(game.hardAvailable('timbuktu'), false);
  game.phase = 'offer';
  assert.equal(game.actionQuiz({ hard: true }).ok, false);
});

test('rosvon kaksintaistelu: suora voitto tuo saaliin', () => {
  const game = newGame(61);
  const p = game.player;
  p.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'robber');

  // Rosvo paljastuu tietovisan kautta ja kaksintaistelu alkaa kysymyksen sulkeuduttua.
  game.actionTravel('stay');
  game.answerQuiz(game.quiz.correct);
  const closed = game.closeQuiz();
  assert.ok(closed.duel, 'kaksintaistelu alkaa');
  assert.equal(game.phase, 'duel');
  assert.equal(game.duel.options.length, 8);

  const rahaEnnen = p.money;
  game.answerDuel(game.duel.correct);
  assert.ok(game.duel.right);
  assert.equal(p.money, rahaEnnen + DUEL_PRIZE, 'suora voitto tuo rosvon saaliin');
  game.closeDuel();
  assert.equal(game.current, 1, 'vuoro vaihtuu');
});

test('rosvon kaksintaistelu: helpotus vie puolet ja piilottaa vaihtoehtoja', () => {
  const game = newGame(62);
  const p = game.player;
  p.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'robber');
  game.actionTravel('stay');
  game.answerQuiz(game.quiz.correct);
  game.closeQuiz();

  p.money = 400;
  game.actionDuelRelief();
  assert.equal(p.money, 200, 'rosvo vei puolet');
  assert.equal(game.duel.hidden.length, 4, 'puolet vaihtoehdoista poistui');
  assert.ok(!game.duel.hidden.includes(game.duel.correct));

  game.actionDuelRelief();
  assert.equal(p.money, 100, 'toinen helpotus vie taas puolet');
  assert.equal(game.duel.hidden.length, 6, 'jäljellä kaksi vaihtoehtoa');

  assert.equal(game.actionDuelRelief().ok, false, 'kolmatta helpotusta ei ole');

  // Voitto helpotusten jälkeen ei tuo saalista, mutta loput säilyvät.
  game.answerDuel(game.duel.correct);
  assert.equal(p.money, 100);
});

test('rosvon kaksintaistelu: väärä vastaus vie kaikki rahat', () => {
  const game = newGame(63);
  const p = game.player;
  p.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'robber');
  game.actionTravel('stay');
  game.answerQuiz(game.quiz.correct);
  game.closeQuiz();

  const vaara = (game.duel.correct + 1) % 8;
  game.answerDuel(vaara);
  assert.equal(game.duel.right, false);
  assert.equal(p.money, 0, 'rosvo vei kaikki');

  game.closeDuel();
  assert.equal(game.current, 1);
});

test('rosvon voi ohittaa kolmella hevosenkengällä', () => {
  const game = newGame(64);
  const p = game.player;
  p.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'robber');
  p.horseshoes = DUEL_BYPASS_SHOES;
  game.actionTravel('stay');
  game.answerQuiz(game.quiz.correct);
  game.closeQuiz();

  const rahaEnnen = p.money;
  assert.ok(game.actionDuelBypass().ok);
  assert.equal(p.horseshoes, 0, 'kengät kuluvat');
  assert.equal(p.money, rahaEnnen, 'rahat säilyvät');
  assert.equal(game.duel, null);
  assert.equal(game.current, 1, 'vuoro vaihtuu');

  // Ilman kenkiä ohitus ei onnistu.
  const toinen = newGame(65);
  toinen.player.pos = { type: 'city', city: 'timbuktu' };
  toinen.tokens.set('timbuktu', 'robber');
  toinen.actionTravel('stay');
  toinen.answerQuiz(toinen.quiz.correct);
  toinen.closeQuiz();
  assert.equal(toinen.actionDuelBypass().ok, false);
});

test('portit yhdistävät kaikki laudat toisiinsa', () => {
  // Porttikaupungit ovat ainoa tapa siirtyä laudalta toiselle, joten yhdenkään
  // laudan ei saa jäädä saarekkeeksi kun uusia lautoja lisätään.
  const linked = new Map(PACKS.map((p) => [p.id, new Set()]));
  for (const pack of PACKS) {
    for (const city of pack.cities) {
      for (const link of city.links ?? []) {
        linked.get(pack.id).add(link.pack);
        linked.get(link.pack).add(pack.id);
      }
    }
  }

  const seen = new Set([PACKS[0].id]);
  const queue = [PACKS[0].id];
  while (queue.length) {
    for (const next of linked.get(queue.pop())) {
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push(next);
    }
  }
  assert.deepEqual(
    PACKS.map((p) => p.id).filter((id) => !seen.has(id)),
    [],
    'laudalle ei pääse porttikaupunkien kautta',
  );
});

test('vaellus: yksin pelattaessa peli ei pääty ja tähti on arvokas löytö', () => {
  const game = new Game({
    players: [{ name: 'Yksin', color: '#f00', start: 'tanger' }],
    rng: mulberry32(41),
  });
  assert.ok(game.roaming, 'yksinpeli on vaellus');

  const p = game.player;
  p.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'star');
  const rahaEnnen = p.money;
  game.revealToken('timbuktu');
  assert.ok(p.hasStar);
  assert.equal(p.money, rahaEnnen + STAR_PRIZE, 'tähti on rahanarvoinen löytö');

  // Kotiin palaaminen ei päätä peliä.
  p.pos = { type: 'city', city: 'tanger' };
  assert.equal(game.checkWin(), false);
  assert.equal(game.winner, null);
});

test('vaellus: porttikaupungista siirrytään toiselle laudalle ja takaisin', () => {
  const game = new Game({
    players: [{ name: 'Yksin', color: '#f00', start: 'tanger' }],
    rng: mulberry32(43),
  });
  const p = game.player;

  // Tavallisesta kaupungista ei lähde pitkää lentoa.
  p.pos = { type: 'city', city: 'tripoli' };
  game.phase = 'action';
  assert.deepEqual(game.gatewayOptions(), []);

  // Tanger on porttikaupunki: Gibraltarin yli Eurooppaan.
  p.pos = { type: 'city', city: 'tanger' };
  assert.deepEqual(game.gatewayOptions().map((l) => l.pack), ['europe']);

  // Kairosta pääsee Lähi-idän laudalle.
  p.pos = { type: 'city', city: 'kairo' };
  game.phase = 'action';
  const options = game.gatewayOptions();
  assert.equal(options.length, 2, 'Lähi-itään ja Maailma-laudalle');
  assert.equal(options[0].pack, 'middleeast');

  const afrikanLaatat = game.tokens.size;
  const rahaEnnen = p.money;
  assert.ok(game.actionGateway(0).ok);
  assert.equal(p.money, rahaEnnen - FLIGHT_PRICE, 'pitkä lento maksaa lennon hinnan');
  assert.equal(p.packId, 'middleeast');
  assert.equal(game.diaryNote?.packId, 'middleeast', 'saapuminen kirjaa päiväkirjamerkinnän');
  assert.equal(p.pos.city, 'kairo');
  assert.equal(game.pack.id, 'middleeast', 'aktiivinen lauta seuraa pelaajaa');
  assert.ok(game.tokens.size > 0, 'uudella laudalla on omat laatat');

  // Ilman lipun hintaa portti ei aukea.
  game.phase = 'action';
  p.money = 10;
  assert.deepEqual(game.gatewayOptions(), []);
  p.money = 1000;

  // Lähi-idän Istanbulista laskeudutaan kaupunkilaudalle.
  game.phase = 'action';
  p.pos = { type: 'city', city: 'istanbul' };
  const cityLink = game.gatewayOptions().find((l) => l.pack === 'istanbul');
  assert.ok(cityLink, 'Istanbulista pääsee kaupunkilaudalle');
  game.actionGateway(cityLink.index);
  assert.equal(p.packId, 'istanbul');
  assert.equal(p.pos.city, 'lentoasema');

  // Ja samaa reittiä takaisin; Afrikan laudan tila on tallessa.
  game.phase = 'action';
  game.actionGateway(0);
  assert.equal(p.packId, 'middleeast');
  game.phase = 'action';
  p.pos = { type: 'city', city: 'kairo' };
  p.money = 1000;
  game.actionGateway(0);
  assert.equal(p.packId, 'africa');
  assert.equal(game.tokens.size, afrikanLaatat, 'Afrikan laatat säilyivät');
});

test('vaellus: lähtöpiste valitaan maailmankartalta ja portti vie mantereelle', () => {
  const game = new Game({
    players: [{ name: 'Yksin', color: '#f00', start: null }],
    pack: packById('maailma'),
    rng: mulberry32(53),
  });
  assert.equal(game.phase, 'pickstart');
  assert.ok(game.roaming);
  assert.equal(game.actionTravel('land').ok, false, 'ennen valintaa ei matkusteta');

  // Kairon portista astutaan suoraan Afrikan laudalle — ilmaiseksi.
  const rahaEnnen = game.player.money;
  assert.ok(game.actionPickStart('kairo', 0).ok);
  assert.equal(game.player.money, rahaEnnen, 'lähtöpisteen valinta on ilmainen');
  assert.equal(game.player.packId, 'africa');
  assert.deepEqual(game.player.pos, { type: 'city', city: 'kairo' });
  assert.equal(game.player.start, 'kairo');
  assert.notEqual(game.phase, 'pickstart');

  // Maailmankartalle voi myös jäädä.
  const stay = new Game({
    players: [{ name: 'Yksin', color: '#f00', start: null }],
    pack: packById('maailma'),
    rng: mulberry32(54),
  });
  assert.ok(stay.actionPickStart('sydney').ok);
  assert.equal(stay.player.packId, 'maailma');
  assert.equal(stay.player.pos.city, 'sydney');
  assert.equal(stay.actionPickStart('lontoo').ok, false, 'lähtöpiste valitaan vain kerran');
});

test('vaellus: valitsematon lähtöpiste tallentuu ja palautuu', () => {
  const game = new Game({
    players: [{ name: 'Yksin', color: '#f00', start: null }],
    pack: packById('maailma'),
    seed: 888,
  });
  const restored = Game.fromJSON(JSON.parse(JSON.stringify(game.toJSON())));
  assert.ok(restored);
  assert.equal(restored.phase, 'pickstart');
  assert.ok(restored.actionPickStart('rio', 0).ok);
  assert.equal(restored.player.packId, 'southamerica');
});

test('tietoportti: vaikea kysymys avaa maan laudan ilmaiseksi', () => {
  const game = new Game({
    players: [{ name: 'Yksin', color: '#f00', start: null }],
    pack: packById('maailma'),
    rng: mulberry32(71),
  });
  game.actionPickStart('lontoo', 0); // Euroopan laudalle
  const p = game.player;
  p.pos = { type: 'city', city: 'helsinki' };
  game.phase = 'action';

  // Suomen lauta ei ole rahalla ostettava portti vaan tietoportti.
  assert.deepEqual(game.gatewayOptions().map((l) => l.pack), [], 'ei maksullista porttia Suomeen');
  const gates = game.countryGateOptions();
  assert.equal(gates.length, 1);
  assert.equal(gates[0].pack, 'suomi');

  // Oikea vastaus avaa portin: siirtyminen on ilmainen eikä laattoja käänny.
  const rahaEnnen = p.money;
  const laattojaEnnen = game.tokens.size;
  assert.ok(game.actionGateQuiz(gates[0].index).ok);
  assert.ok(game.quiz.gate, 'kysymys on porttikysymys');
  game.answerQuiz(game.quiz.correct);
  assert.equal(game.tokens.size, laattojaEnnen, 'laatta ei käänny porttikysymyksestä');
  const closed = game.closeQuiz();
  assert.ok(closed.gated);
  assert.equal(p.packId, 'suomi');
  assert.deepEqual(p.pos, { type: 'city', city: 'helsinki' });
  assert.equal(p.money, rahaEnnen, 'portti on ilmainen');

  // Väärä vastaus: portti ei aukea ja vuoro päättyy (yksinpelissä sama pelaaja).
  const toinen = new Game({
    players: [{ name: 'Yksin', color: '#f00', start: null }],
    pack: packById('maailma'),
    rng: mulberry32(72),
  });
  toinen.actionPickStart('lontoo', 0);
  toinen.player.pos = { type: 'city', city: 'helsinki' };
  toinen.phase = 'action';
  toinen.actionGateQuiz(0);
  toinen.answerQuiz((toinen.quiz.correct + 1) % 4);
  toinen.closeQuiz();
  assert.equal(toinen.player.packId, 'europe', 'väärällä vastauksella jäädään laudalle');

  // Suomesta pois pääsee tavallisesta portista (manner ei ole maalauta).
  const takaisin = game.gatewayOptions();
  assert.equal(game.phase, 'action');
  assert.deepEqual(takaisin.map((l) => l.pack), ['europe']);
});

test('vaellus: monen laudan peli tallentuu ja palautuu', () => {
  const game = new Game({
    players: [{ name: 'Yksin', color: '#f00', start: 'kairo' }],
    seed: 777,
  });
  game.phase = 'action';
  game.player.money = 1000;
  game.actionGateway(0); // Lähi-itään
  const data = JSON.parse(JSON.stringify(game.toJSON()));
  const restored = Game.fromJSON(data);

  assert.ok(restored);
  assert.ok(restored.roaming);
  assert.equal(restored.player.packId, 'middleeast');
  assert.equal(restored.worlds.size, game.worlds.size);
  assert.equal(restored.tokens.size, game.tokens.size);
  assert.equal(restored.rng(), game.rng(), 'arvonnat jatkuvat samasta kohdasta');
});

test('kilpapelin voittaja voi jatkaa vaellusta', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    rng: mulberry32(47),
  });
  game.player.hasStar = true;
  game.starFound = true;
  game.player.pos = { type: 'city', city: 'tanger' };
  assert.ok(game.checkWin());
  assert.equal(game.phase, 'over');

  assert.ok(game.continueRoaming().ok);
  assert.ok(game.roaming);
  assert.equal(game.winner, null);
  assert.notEqual(game.phase, 'over');

  // Portit aukeavat myös jatketussa pelissä.
  game.current = 1;
  game.phase = 'action';
  assert.equal(game.gatewayOptions().length, 2, 'Kairossa oleva pääsee porteista');
});

test('sama kysymys ei toistu ennen kuin pakka on käyty läpi', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    rng: mulberry32(9),
  });
  const nahdyt = new Set();
  for (let i = 0; i < AFRICA.questions.timbuktu.length; i++) {
    const kysymys = game.pickQuestion('timbuktu');
    assert.ok(!nahdyt.has(kysymys.q), 'kysymys toistui liian aikaisin');
    nahdyt.add(kysymys.q);
  }
});

test('peli tallentuu ja palautuu samaan tilanteeseen', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo', isBot: true },
    ],
    seed: 1234,
  });
  game.players[0].pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'emerald');
  game.actionTravel('stay');
  game.answerQuiz(game.quiz.correct);
  game.closeQuiz();
  game.actionTravel('land');
  game.actionRoll();

  const data = JSON.parse(JSON.stringify(game.toJSON()));
  const restored = Game.fromJSON(data);

  assert.ok(restored);
  assert.equal(restored.pack.id, game.pack.id);
  assert.equal(restored.phase, game.phase);
  assert.equal(restored.travelMode, game.travelMode);
  assert.equal(restored.die, game.die);
  assert.equal(restored.current, game.current);
  assert.equal(restored.tokens.size, game.tokens.size);
  assert.equal(restored.revealed.get('timbuktu'), 'emerald');
  assert.equal(restored.players[0].money, game.players[0].money);
  assert.deepEqual(restored.players[1].pos, game.players[1].pos);
  assert.equal(restored.usedQuestions.size, game.usedQuestions.size);
  assert.deepEqual([...restored.moves.keys()].sort(), [...game.moves.keys()].sort());
  // Arvonnat jatkuvat samasta kohdasta.
  assert.equal(restored.rng(), game.rng());
});

test('kelvoton tallennus hylätään', () => {
  assert.equal(Game.fromJSON(null), null);
  assert.equal(Game.fromJSON({ version: 99 }), null);
  assert.equal(Game.fromJSON({ version: 1 }), null);
});

test('aarretta ei voi ostaa rahalla', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    seed: 8,
  });
  assert.equal(typeof game.actionBuy, 'undefined');
  const actions = game.availableActions();
  assert.deepEqual(
    Object.keys(actions).sort(),
    ['countryGates', 'fly', 'gateways', 'quiz', 'roll', 'travel'],
  );
  assert.ok(actions.travel.includes('land'));
  // Portit ovat käytössä myös kilpapelissä: Tangerista lennetään Espanjaan.
  assert.deepEqual(actions.gateways.map((l) => l.pack), ['europe']);
});

test('50:50 poistaa kaksi väärää vaihtoehtoa ja maksaa 80', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    seed: 77,
  });
  game.player.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'topaz');
  game.actionTravel('stay');

  const rahaEnnen = game.player.money;
  const tulos = game.actionFiftyFifty();
  assert.ok(tulos.ok);
  assert.equal(game.player.money, rahaEnnen - FIFTY_FIFTY_PRICE);
  assert.equal(game.quiz.hidden.length, 2);
  assert.ok(!game.quiz.hidden.includes(game.quiz.correct), 'oikea vastaus ei saa piiloutua');

  // Toista vihjettä ei saa, eikä piilotettua voi valita.
  assert.equal(game.actionFiftyFifty().ok, false);
  assert.equal(game.answerQuiz(game.quiz.hidden[0]).ok, false);

  // Oikea vastaus toimii yhä.
  game.answerQuiz(game.quiz.correct);
  assert.ok(game.quiz.right);
  assert.equal(game.revealed.get('timbuktu'), 'topaz');
});

test('50:50 ei onnistu ilman rahaa', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    seed: 21,
  });
  game.player.pos = { type: 'city', city: 'gao' };
  game.player.money = 20;
  game.actionTravel('stay');
  const tulos = game.actionFiftyFifty();
  assert.equal(tulos.ok, false);
  assert.equal(game.quiz.hidden.length, 0);
});

test('vihje maksaa 40 puntaa ja näkyy vain kerran ostettuna', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    seed: 404,
  });
  game.player.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'topaz');
  game.actionTravel('stay');

  assert.equal(game.quiz.hintShown, false);
  const rahaEnnen = game.player.money;
  const tulos = game.actionHint();
  assert.ok(tulos.ok);
  assert.equal(game.player.money, rahaEnnen - HINT_PRICE);
  assert.equal(game.quiz.hintShown, true);
  assert.equal(typeof game.quiz.hint, 'string');

  // Toista kertaa ei veloiteta.
  assert.equal(game.actionHint().ok, false);
  assert.equal(game.player.money, rahaEnnen - HINT_PRICE);

  // Vihje ei kerro vastausta suoraan, ja 50:50 toimii yhä sen päälle.
  assert.ok(game.actionFiftyFifty().ok);
  assert.equal(game.quiz.hidden.length, 2);
});

test('vihjettä ei saa ilman rahaa', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    seed: 405,
  });
  game.player.pos = { type: 'city', city: 'gao' };
  game.player.money = 10;
  game.actionTravel('stay');
  assert.equal(game.actionHint().ok, false);
  assert.equal(game.quiz.hintShown, false);
});

test('aikarajan loppuminen lasketaan vääräksi vastaukseksi', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    seed: 406,
  });
  game.player.pos = { type: 'city', city: 'kano' };
  game.tokens.set('kano', 'ruby');
  game.actionTravel('stay');
  assert.equal(game.quiz.seconds, QUIZ_SECONDS);

  const tulos = game.timeoutQuiz();
  assert.ok(tulos.ok);
  assert.equal(game.quiz.right, false);
  assert.equal(game.quiz.timedOut, true);
  assert.equal(game.quiz.chosen, -1);
  assert.ok(game.tokens.has('kano'), 'laatta pysyy kääntämättä');

  // Umpeutuneeseen kysymykseen ei voi enää vastata.
  assert.equal(game.answerQuiz(game.quiz.correct).ok, false);
  assert.equal(game.timeoutQuiz().ok, false);

  game.closeQuiz();
  assert.equal(game.current, 1, 'vuoro vaihtuu');
});

test('väärä vastaus päättää vuoron ja seuraavalla vuorolla saa uuden kysymyksen', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    seed: 99,
  });
  game.player.pos = { type: 'city', city: 'kano' };
  game.tokens.set('kano', 'ruby');

  game.actionTravel('stay');
  const eka = game.quiz.question;
  game.answerQuiz((game.quiz.correct + 1) % 4);
  game.closeQuiz();
  assert.equal(game.current, 1, 'vuoro siirtyy väärästä vastauksesta');
  assert.ok(game.tokens.has('kano'), 'aarre pysyy piilossa');

  // Takaisin ensimmäiselle pelaajalle: uusi kysymys samasta kaupungista.
  game.endTurn();
  assert.equal(game.current, 0);
  game.actionTravel('stay');
  assert.notEqual(game.quiz.question, eka);
  game.answerQuiz(game.quiz.correct);
  assert.equal(game.revealed.get('kano'), 'ruby');
});

test('vuoro etenee: matkustustapa, noppa, siirto ja vasta sitten tietovisa', () => {
  const game = newGame(31);
  // Pelaaja on askeleen päässä Tripolista, joten aarrekaupunki on varmasti tarjolla.
  game.player.pos = { type: 'edge', edge: 'tanger|tripoli', idx: 3 };
  assert.equal(game.phase, 'action');
  assert.deepEqual(game.travelModes(), ['land'], 'reitillä matka jatkuu maitse');

  // Ilman matkustustavan valintaa nopan heitto ei onnistu.
  assert.equal(game.actionRoll().ok, false);

  game.actionTravel('land');
  assert.equal(game.phase, 'roll');
  const roll = game.actionRoll();
  assert.ok(roll.die >= 1 && roll.die <= 6);
  assert.equal(game.phase, 'move');

  // Valitaan aarrekaupunki, jolloin tietovisa tarjotaan ennen vuoron vaihtoa.
  const target = game.moveOptions().find((o) => o.hasToken);
  assert.ok(target, 'jonkin kohteen pitäisi olla aarrekaupunki');
  game.actionMove(target.key);
  assert.equal(game.phase, 'offer');
  assert.equal(game.current, 0, 'vuoro ei ole vielä vaihtunut');

  game.actionSkipQuiz();
  assert.equal(game.current, 1, 'ohittaminen päättää vuoron');
});

test('laivalippu maksetaan kerran vuorossa ja vain satamasta lähdettäessä', () => {
  const game = newGame(77);
  const p = game.player;
  p.money = 300;
  game.actionTravel('sea');
  assert.equal(game.pendingFare, SEA_FARE);

  game.actionRoll();
  const mid = game.moveOptions().find((o) => o.pos.type === 'edge');
  const target = mid ?? game.moveOptions()[0];
  game.actionMove(target.key);
  assert.equal(p.money, 300 - SEA_FARE);

  // Merellä jatkaminen on ilmaista.
  if (p.pos.type === 'edge') {
    game.current = 0;
    game.phase = 'action';
    assert.deepEqual(game.travelModes(), ['sea']);
    game.actionTravel('sea');
    assert.equal(game.pendingFare, 0);
  }
});

test('matkustustavan valinnan voi perua ennen heittoa', () => {
  const game = newGame(12);
  game.actionTravel('land');
  assert.equal(game.phase, 'roll');
  game.actionCancelTravel();
  assert.equal(game.phase, 'action');
  assert.equal(game.travelMode, null);
});

test('matkustustapa valitaan automaattisesti kun vaihtoehtoja ei ole', () => {
  const game = newGame(51);

  // Sisämaan kaupungissa ilman aarretta maitse on ainoa tapa: vuoro alkaa heitosta.
  game.player.pos = { type: 'city', city: 'murzuk' };
  game.tokens.delete('murzuk');
  game.phase = 'action';
  game.beginTurn();
  assert.equal(game.phase, 'roll');
  assert.equal(game.travelMode, 'land');
  assert.ok(game.autoTravel);
  assert.equal(game.actionCancelTravel().ok, false, 'peruutettavaa ei ole');

  // Kesken reittiä matka jatkuu samalla tavalla ilman kysymistä.
  game.player.pos = { type: 'edge', edge: 'tanger|tripoli', idx: 1 };
  game.phase = 'action';
  game.beginTurn();
  assert.equal(game.phase, 'roll');
  assert.ok(game.autoTravel);

  // Aarrekaupungissa valinta on aito: liikkua tai jäädä vastaamaan.
  game.player.pos = { type: 'city', city: 'gao' };
  game.tokens.set('gao', 'topaz');
  game.phase = 'action';
  game.beginTurn();
  assert.equal(game.phase, 'action');
  assert.equal(game.autoTravel, false);
  assert.deepEqual(game.travelModes().sort(), ['land', 'stay']);

  // Aloituskaupungissa on satama ja lentokenttä, joten valinta kysytään.
  const alku = newGame(52);
  assert.equal(alku.phase, 'action');
  assert.equal(alku.autoTravel, false);
});

test('lähdekentän apurit tulkitsevat lähteet oikein', () => {
  assert.deepEqual(sourceList(undefined), []);
  assert.deepEqual(sourceList(''), []);
  assert.deepEqual(sourceList('Kirja, s. 12'), ['Kirja, s. 12']);
  assert.deepEqual(sourceList(['a', '', 'b']), ['a', 'b']);

  assert.ok(isSourceUrl('https://www.example.org/sivu'));
  assert.ok(!isSourceUrl('Kirja, s. 12'));
  assert.ok(!isSourceUrl('ftp://example.org'));

  // Verkko-osoitteesta näytetään palvelimen nimi, muu teksti sellaisenaan.
  assert.equal(sourceLabel('https://www.example.org/pitka/polku'), 'example.org');
  assert.equal(sourceLabel('Kirja, s. 12'), 'Kirja, s. 12');
});

test('tieto voi olla merkkijono tai teksti lähteineen', () => {
  assert.equal(factText('Pelkkä teksti.'), 'Pelkkä teksti.');
  assert.deepEqual(factSource('Pelkkä teksti.'), []);

  const withSource = { text: 'Teksti lähteellä.', source: 'https://example.org/x' };
  assert.equal(factText(withSource), 'Teksti lähteellä.');
  assert.deepEqual(factSource(withSource), ['https://example.org/x']);
});

test('kysymyksen lähde kulkeutuu tietovisaan ja kaksintaisteluun', () => {
  const pack = packById('africa');
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    pack,
    seed: 909,
  });

  // Lähteetön kysymys antaa tyhjän listan, ei undefinedia.
  game.player.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'topaz');
  game.phase = 'action';
  game.actionTravel('stay');
  assert.ok(Array.isArray(game.quiz.source));
});

// --- kaksi ääntä (paketti 4) -----------------------------------------------

test('merkitsemätön tieto on nuoren herran havainto, merkitty isoisän', () => {
  assert.equal(factVoice('Pelkkä merkkijono on vanhaa sisältöä.'), 'nuori');
  assert.equal(factVoice({ text: 'Ilman merkintää.' }), 'nuori');
  assert.equal(factVoice({ text: 'Merkitty.', voice: 'isoisa' }), 'isoisa');
  // Tuntematon ääni ei saa kaataa piirtoa vaan putoaa nuoreen.
  assert.equal(factVoice({ text: 'Outo.', voice: 'kapteeni' }), 'nuori');

  assert.match(voiceTitle('isoisa'), /Isoisän päiväkirjasta/);
  assert.match(voiceTitle('nuori'), /Nuoren herran havainto/);
  assert.equal(voiceTitle(undefined), voiceTitle('nuori'));
});

test('saapumismerkintä arvotaan listasta pelin omalla arvonnalla', () => {
  const seen = new Set();
  for (let seed = 1; seed <= 40; seed++) {
    const game = new Game({
      players: [{ name: 'Yksin', color: '#f00', start: null }],
      pack: packById('maailma'),
      rng: mulberry32(seed),
    });
    game.actionPickStart('kairo', 0); // portti Afrikan laudalle
    assert.equal(game.diaryNote.packId, 'africa');
    assert.ok(packById('africa').texts.diaries.includes(game.diaryNote.text));
    seen.add(game.diaryNote.text);
  }
  assert.ok(seen.size >= 2, 'sama merkintä joka pelissä — arvonta ei toimi');

  // Sama siemen antaa saman merkinnän, jotta tallennus toistuu oikein.
  const toista = () => {
    const g = new Game({
      players: [{ name: 'Yksin', color: '#f00', start: null }],
      pack: packById('maailma'),
      rng: mulberry32(7),
    });
    g.actionPickStart('kairo', 0);
    return g.diaryNote.text;
  };
  assert.equal(toista(), toista());
});

test('isoisän vihje osoittaa tähtikaupunkiin ja vaikenee kun aarre on löytynyt', () => {
  const game = new Game({
    players: [{ name: 'Yksin', color: '#f00', start: 'tanger' }],
    pack: packById('africa'),
    rng: mulberry32(21),
  });

  const starCity = game.starCityOf();
  assert.ok(starCity, 'tähtikaupunkia ei löytynyt');
  assert.equal(game.tokens.get(starCity), 'star');

  // Vihje nousee esiin vain joka HINT_EVERY_TURNS vuoro.
  game.turnCount = HINT_EVERY_TURNS;
  assert.equal(game.starHint(), packById('africa').texts.starHints[starCity]);
  game.turnCount = HINT_EVERY_TURNS + 1;
  assert.equal(game.starHint(), null, 'vihje näkyy liian usein');

  // Löytynyt aarre sulkee taitetun sivun.
  game.turnCount = HINT_EVERY_TURNS * 2;
  assert.ok(game.starHint());
  game.world.starFound = true;
  assert.equal(game.starHint(), null, 'vihje jatkuu vaikka aarre on löytynyt');
});

test('vihjeetön lauta ei kaada tietoruutua', () => {
  const game = new Game({
    players: [{ name: 'Yksin', color: '#f00', start: 'lissabon' }],
    pack: packById('europe'), // vihjeet vielä kirjoittamatta
    rng: mulberry32(3),
  });
  game.turnCount = HINT_EVERY_TURNS;
  assert.equal(game.starHint(), null);
});
