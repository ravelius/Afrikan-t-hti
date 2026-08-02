import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  PACKS, packById, allQuestions, factSource, factText, factVoice, isSourceUrl,
  sourceLabel, sourceList, voiceTitle,
} from '../js/pack.js';
import { arvoksi, hasSketch } from '../js/packs/africa-puzzles.js';

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
  XP_NEW_CITY, XP_NEW_BOARD, XP_HARD_ANSWER, XP_STAR,
  TURN_HOURS, RECORD_DAYS, XP_RECORD, timeOfDayName,
  FORM_WEIGHTS, PHOTO_CHOICES, XP_EXPLORE, XP_PUZZLE, EXPLORE_REWARD,
} from '../js/game.js';
import {
  articleUrl, BAD_IMAGE, fetchImage, fetchSummary, parseArticle, parseSummary,
  pickImage, summaryUrl,
} from '../js/wiki.js';
import {
  chooseDuelAnswer, chooseMove, chooseQuizAnswer, chooseTravel,
  wantsDuelBypass, wantsDuelRelief, wantsFiftyFifty, wantsHint,
} from '../js/ai.js';

const AFRICA = packById('africa');
const board = buildBoard(AFRICA.cities, AFRICA.edges);

/**
 * Kahden pelaajan peli testejä varten (Afrikan laudalla). Pulmat
 * merkitään nähdyiksi, jotta actionQuiz avaa tietovisan eikä pulmaa —
 * pulmien omat testit käyttävät puzzleGame-apuria.
 */
function newGame(seed = 5) {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    seed,
  });
  for (const p of AFRICA.puzzles ?? []) game.puzzlesSeen.add(`africa:${p.city}`);
  return game;
}

// Sisällön määrätavoitteet nostetaan lauta kerrallaan sitä mukaa kun sisältö
// on kirjoitettu (docs/tyolista-opukselle.md, paketti 5). Valmiilla laudalla
// jokaisella aarrekaupungilla on vähintään viisi omaa kysymystä, joista
// ainakin yksi on helppo (taso 1) ja yksi vaikea (taso 3), ja yleispakassa on
// vähintään 15 kysymystä. Kesken olevilla laudoilla pätevät vanhat minimit.
// Kaikki nykyiset kymmenen lautaa ovat valmiit; uusi lauta lisätään tähän
// vasta kun sen sisältö täyttää paketin 5 määrätavoitteet.
const SISALTO_VALMIS = new Set([
  'maailma', 'africa', 'europe', 'suomi', 'istanbul',
  'asia', 'oceania', 'northamerica', 'southamerica', 'middleeast',
]);
const MIN_CITY_QUESTIONS = (packId) => (SISALTO_VALMIS.has(packId) ? 5 : 2);
const MIN_GENERAL_QUESTIONS = (packId) => (SISALTO_VALMIS.has(packId) ? 15 : 10);

// Laudat, joilta on siivottu kysymykset, joiden oikea vastaus lukee saman
// laudan kartalla kaupunkinimenä. Laajennetaan lauta kerrallaan.
const VASTAUS_EI_KARTALLA = new Set(['africa']);

// --- jokaista pakettia koskevat eheystestit --------------------------------

// Laudat, joiden kahden äänen sisältö on kirjoitettu valmiiksi: näiltä
// vaaditaan täysi määrä saapumismerkintöjä ja aarrevihje jokaiselle
// aarrekaupungille. Kun laudan sisältö valmistuu, lisää sen tunnus tähän —
// muutos on julkaisuportti, ei muotoseikka (docs/tyolista-opukselle.md,
// paketit 4 ja 5).
const VOICES_DONE = new Set([
  'maailma', 'africa', 'europe', 'suomi', 'istanbul',
  'asia', 'oceania', 'northamerica', 'southamerica', 'middleeast',
]);

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
    const minCity = MIN_CITY_QUESTIONS(pack.id);
    for (const id of cityIds) {
      const omat = pack.questions[id] ?? [];
      assert.ok(omat.length >= minCity, `kaupungilta ${id} puuttuu kysymyksiä (${omat.length}/${minCity})`);
      if (!SISALTO_VALMIS.has(pack.id)) continue;
      const omatLevels = omat.map(questionLevel);
      assert.ok(omatLevels.includes(1), `kaupungilta ${id} puuttuu helppo kysymys`);
      assert.ok(omatLevels.includes(3), `kaupungilta ${id} puuttuu vaikea kysymys`);
    }
    assert.ok(
      pack.questions.general.length >= MIN_GENERAL_QUESTIONS(pack.id),
      `yleispakassa on liian vähän kysymyksiä (${pack.questions.general.length})`,
    );

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

    // Vastaus ei saa lukea kartalla: oikea vaihtoehto ei saa olla saman
    // laudan TOISEN kaupungin nimi (oma nimi on sallittu — kysymys kysytään
    // siinä kaupungissa, jossa pelaaja jo seisoo). Tarkistettu lauta
    // kerrallaan; laajenna settiä kun laudan kysymykset on käyty läpi
    // (docs/tyolista-opukselle.md, Myöhemmäksi sovitut).
    if (VASTAUS_EI_KARTALLA.has(pack.id)) {
      const cityByName = new Map(pack.cities.map((c) => [c.name.toLowerCase(), c.id]));
      for (const [key, qs] of Object.entries(pack.questions)) {
        for (const q of qs) {
          // Väittämillä (claims) ei ole vaihtoehtoja, joten kartalta ei
          // voi lukea niiden vastausta.
          if (!Array.isArray(q.options)) continue;
          const answer = q.options[q.correct];
          const labelId = cityByName.get(answer.toLowerCase());
          assert.ok(
            !labelId || labelId === key,
            `kysymyksen "${q.q}" vastaus "${answer}" lukee kartalla (${labelId})`,
          );
        }
      }
    }
  });

  test(`${pack.id}: jokaisella kaupungilla on tiesitkö-tietoja`, () => {
    for (const city of pack.cities) {
      const facts = pack.placeFacts[city.id];
      assert.ok(Array.isArray(facts) && facts.length >= 2, `${city.id}: liian vähän tietoja`);
      const texts = facts.map(factText);
      for (const fact of facts) {
        assert.ok(factText(fact).trim().length > 20, `${city.id}: liian lyhyt tieto`);
        checkSources(typeof fact === 'string' ? undefined : fact.source, `tieto ${city.id}`);
        // Katso kuva -linkki: wiki-kenttä on artikkelin otsikko.
        if (typeof fact === 'object' && fact.wiki !== undefined) {
          assert.ok(typeof fact.wiki === 'string' && fact.wiki.trim().length >= 3,
            `${city.id}: wiki-kenttä ei ole kelvollinen otsikko`);
        }
      }
      assert.equal(new Set(texts).size, texts.length, `${city.id}: sama tieto kahdesti`);

      // Valmiilla laudalla tietoruudussa vuorottelee kaksi ääntä, joten
      // jokaisella kaupungilla on sekä isoisän merkintä että nuoren havainto.
      if (!SISALTO_VALMIS.has(pack.id)) continue;
      const voices = facts.map(factVoice);
      assert.ok(voices.includes('isoisa'), `${city.id}: isoisän merkintä puuttuu`);
      assert.ok(voices.includes('nuori'), `${city.id}: nuoren havainto puuttuu`);
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
    /** Pisteen etäisyys janasta a–b. */
    const segDist = (p, a, b) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const pit = dx * dx + dy * dy;
      const t = pit === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / pit));
      return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
    };
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

    // Maamerkit ovat tarkoituksella lähellä kaupunkiaan (ne vihjaavat
    // pulmista), joten niille pätee löysempi etäisyys kuin merikoristeille.
    // Ne eivät silti saa peittää kaupunkia, sen nimeä eivätkä reittiä.
    for (const mark of decor.landmarks ?? []) {
      const nimi = `maamerkki ${mark.kind}`;
      assert.ok(
        mark.x > 40 && mark.x < 960 && mark.y > 40 && mark.y < 960,
        `${nimi} on kartan reunan ulkopuolella`,
      );
      assert.ok(cityDist(mark) >= 34, `${nimi} peittää kaupungin`);
      // Piirros on noin 70 x 46 yksikköä; nimikilpi ei saa jäädä sen alle.
      for (const c of pack.cities) {
        const nx = c.x + (c.lx ?? 0);
        const ny = c.y + (c.ly ?? 0);
        assert.ok(
          Math.abs(nx - mark.x) > 40 || Math.abs(ny - mark.y) > 26,
          `${nimi} peittää nimen ${c.name}`,
        );
      }
      for (const e of packBoard.edges) {
        const a = pack.cities.find((c) => c.id === e.a);
        const b = pack.cities.find((c) => c.id === e.b);
        if (!a || !b) continue;
        assert.ok(
          segDist(mark, a, b) >= 18,
          `${nimi} osuu reitille ${a.name}–${b.name}`,
        );
      }
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
        // Maailmankartan lento vie aina laudan aloituskaupunkiin, jotta
        // laskeutumispaikka on kartalla keltaisella (omistajan päätös).
        if (pack.id === 'maailma') {
          const kohde = target.cities.find((c) => c.id === link.city);
          assert.ok(
            kohde.start,
            `${city.id}: maailman portin kohde ${link.city} ei ole aloituskaupunki laudalla ${link.pack}`,
          );
        }
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

  // Karthago on neljän askelen päässä: sinne pääsee myös viitosella ja kuutosella.
  for (const die of [4, 5, 6]) {
    assert.ok(findMoves(board, start, die, { mode: 'land' }).has('c:karthago'), `heitto ${die}`);
  }
  assert.ok(!findMoves(board, start, 3, { mode: 'land' }).has('c:karthago'));
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
  const pos = { type: 'edge', edge: 'tanger|karthago', idx: 2 };
  const moves = findMoves(board, pos, 2, { mode: 'land' });
  const keys = [...moves.keys()].sort();
  assert.deepEqual(keys, ['c:karthago', 'c:tanger']);
  assert.ok(!moves.has(posKey(pos)), 'lähtöruutuun ei jäädä');
  // Kahdella askeleella molempiin päihin: kumpikaan ei vaadi peruutusta.
  assert.equal(moves.get('c:karthago').path.length, 2);
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
  game.player.pos = { type: 'edge', edge: 'tanger|karthago', idx: 2, from: 'tanger' };
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
  if (game.phase === 'event') {
    game.closeEvent();
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
    // Pulmakaupungin tarjous ilman laattaa: botti jatkaa matkaa.
    if (game.tokenHere()) game.actionQuiz({ form: 'quiz' });
    else game.actionSkipQuiz();
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
  assert.ok(win.actionQuiz({ form: 'quiz' }).ok);
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
  lose.actionQuiz({ form: 'quiz' });
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
    game.actionQuiz({ form: 'quiz' });
    assert.equal(levelByText.get(game.quiz.question), 1, `"${game.quiz.question}" ei ole helppo`);
    game.quiz = null;
  }
});

test('kysymys liittyy paikkaan: omat kysymykset ennen yleispakkaa', () => {
  const game = newGame(7);
  const omat = new Set(AFRICA.questions.timbuktu.map((q) => q.q));
  const normaalit = AFRICA.questions.timbuktu.filter((q) => questionLevel(q) !== 3).length;
  // Kaikki kaupungin normaalitason kysymykset tulevat ennen yhtäkään
  // yleispakan kysymystä — Egyptin pääkaupunkia ei kysytä Namibissa.
  for (let i = 0; i < normaalit; i++) {
    const q = game.pickQuestion('timbuktu');
    assert.ok(omat.has(q.q), `yleispakan kysymys "${q.q}" tuli ennen paikan omia`);
  }
  // Kun omat on kysytty, yleispakka jatkaa tuoreilla kysymyksillä.
  const seuraava = game.pickQuestion('timbuktu');
  assert.ok(!omat.has(seuraava.q), 'käytetty kysymys toistui ennen yleispakkaa');
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
  assert.ok(game.actionQuiz({ form: 'quiz' }).ok);
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
  game.actionTravel('stay', { form: 'quiz' });
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
  game.actionTravel('stay', { form: 'quiz' });
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
  game.actionTravel('stay', { form: 'quiz' });
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
  game.actionTravel('stay', { form: 'quiz' });
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
  toinen.actionTravel('stay', { form: 'quiz' });
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

  // Tanger on porttikaupunki: Gibraltarin yli Eurooppaan tai maailmankartalle.
  p.pos = { type: 'city', city: 'tanger' };
  assert.deepEqual(game.gatewayOptions().map((l) => l.pack), ['europe', 'maailma']);

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
  assert.equal(game.arrivalFact?.packId, 'middleeast', 'saapuminen kirjaa havainnon laudalle');
  assert.equal(game.arrivalFact?.cityId, 'kairo', 'havainto kertoo saapumiskaupungista');
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

  // Laatattomaan kaupunkiin saapuminen ei avaa korttia itsestään, mutta
  // Tutki paikka odottaa alavalikossa.
  assert.equal(game.phase, 'action', 'saapuminen ei avaa korttia laatattomassa kaupungissa');
  assert.ok(game.travelModes().includes('stay'), 'Tutki paikka on alavalikossa');

  // Suomesta pois pääsee tavallisesta portista (manner ei ole maalauta).
  const takaisin = game.gatewayOptions();
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
  game.actionTravel('stay', { form: 'quiz' });
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
  // Portit ovat käytössä myös kilpapelissä: Tangerista lennetään Espanjaan
  // tai takaisin maailmankartalle.
  assert.deepEqual(actions.gateways.map((l) => l.pack), ['europe', 'maailma']);
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
  game.actionTravel('stay', { form: 'quiz' });

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
  game.actionTravel('stay', { form: 'quiz' });
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
  game.actionTravel('stay', { form: 'quiz' });

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
  game.actionTravel('stay', { form: 'quiz' });
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
  game.actionTravel('stay', { form: 'quiz' });
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

  game.actionTravel('stay', { form: 'quiz' });
  const eka = game.quiz.question;
  game.answerQuiz((game.quiz.correct + 1) % 4);
  game.closeQuiz();
  assert.equal(game.current, 1, 'vuoro siirtyy väärästä vastauksesta');
  assert.ok(game.tokens.has('kano'), 'aarre pysyy piilossa');

  // Takaisin ensimmäiselle pelaajalle: uusi kysymys samasta kaupungista.
  game.endTurn();
  assert.equal(game.current, 0);
  game.actionTravel('stay', { form: 'quiz' });
  assert.notEqual(game.quiz.question, eka);
  game.answerQuiz(game.quiz.correct);
  assert.equal(game.revealed.get('kano'), 'ruby');
});

test('vuoro etenee: matkustustapa, noppa, siirto ja vasta sitten tietovisa', () => {
  const game = newGame(31);
  // Pelaaja on askeleen päässä Karthagosta, joten aarrekaupunki on varmasti tarjolla.
  game.player.pos = { type: 'edge', edge: 'tanger|karthago', idx: 3 };
  assert.equal(game.phase, 'action');
  assert.deepEqual(game.travelModes(), ['land'], 'reitillä matka jatkuu maitse');

  // Ilman matkustustavan valintaa nopan heitto ei onnistu.
  assert.equal(game.actionRoll().ok, false);

  game.actionTravel('land');
  assert.equal(game.phase, 'roll');
  const roll = game.actionRoll();
  assert.ok(roll.die >= 1 && roll.die <= 6);
  assert.equal(game.phase, 'move');

  // Aarrekaupunkiin saapuminen ei enää pysäytä vuoroa tarjousvaiheeseen:
  // mikään ikkuna ei aukea, vaan laatta tutkitaan seuraavalla vuorolla
  // alarivin Tutki-napista (omistajan ohje).
  const target = game.moveOptions().find((o) => o.hasToken);
  assert.ok(target, 'jonkin kohteen pitäisi olla aarrekaupunki');
  game.actionMove(target.key);
  assert.equal(game.phase, 'action');
  assert.equal(game.current, 1, 'vuoro vaihtui heti saapumisen jälkeen');
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

  // Sisämaan kaupungissa ilman aarretta ja tutkittavaa maitse on ainoa
  // tapa: vuoro alkaa heitosta.
  game.player.pos = { type: 'city', city: 'murzuk' };
  game.tokens.delete('murzuk');
  game.explored.add('africa:murzuk');
  game.phase = 'action';
  game.beginTurn();
  assert.equal(game.phase, 'roll');
  assert.equal(game.travelMode, 'land');
  assert.ok(game.autoTravel);
  assert.equal(game.actionCancelTravel().ok, false, 'peruutettavaa ei ole');

  // Kesken reittiä matka jatkuu samalla tavalla ilman kysymistä.
  game.player.pos = { type: 'edge', edge: 'tanger|karthago', idx: 1 };
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
  game.actionTravel('stay', { form: 'quiz' });
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

test('saapumishavainto seuraa matkaajaa kaupungista kaupunkiin', () => {
  const game = new Game({
    players: [{ name: 'Yksin', color: '#f00', start: null }],
    pack: packById('maailma'),
    rng: mulberry32(7),
  });
  game.actionPickStart('kairo', 0); // portti Afrikan laudalle
  assert.equal(game.arrivalFact?.packId, 'africa', 'laudalle astuminen kirjaa havainnon');
  assert.equal(game.arrivalFact?.cityId, 'kairo');

  // Jokaisella Afrikan kaupungilla on havaintoja, ja isoisän ääni
  // löytyy tekstien joukosta luentaa varten ainakin osasta.
  const facts = packById('africa').placeFacts;
  for (const city of packById('africa').cities) {
    assert.ok((facts[city.id] ?? []).length > 0, `${city.id} ilman havaintoja`);
  }

  // Havainto ei tyhjene liikkeelle lähdettäessä: matkalla kortti pitää
  // edellisen kaupungin tekstin, kunnes uusi saapuminen korvaa sen.
  game.phase = 'move';
  game.moves = new Map([['x', { pos: { type: 'edge', edge: Object.keys(game.board.edgeById?.entries?.() ?? {})[0] ?? 'e', at: 1 }, path: [] }]]);
  assert.equal(game.arrivalFact?.cityId, 'kairo', 'havainto säilyy nopanheittojen yli');
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
  // Lauta, jonka vihjeet ovat vielä kirjoittamatta: tietoruutu ei saa kaatua.
  // Tyhjä starHints tehdään tässä käsin, jotta testi ei riipu siitä, minkä
  // laudan sisältö on kirjoitettu (kaista B täydentää lautoja yksi kerrallaan).
  const base = packById('europe');
  const game = new Game({
    players: [{ name: 'Yksin', color: '#f00', start: 'lissabon' }],
    pack: { ...base, texts: { ...base.texts, starHints: {} } },
    rng: mulberry32(3),
  });
  game.turnCount = HINT_EVERY_TURNS;
  assert.equal(game.starHint(), null);
});

// --- kokemuspisteet, tietoprosentti ja passi (paketti 6) --------------------

test('kokemuspisteitä kertyy uusista paikoista, ei uudelleen käynneistä', () => {
  const game = new Game({
    players: [{ name: 'Yksin', color: '#f00', start: null }],
    pack: packById('maailma'),
    rng: mulberry32(31),
  });
  const p = game.player;
  assert.equal(p.xp, 0, 'lähtöruudussa ei vielä pisteitä');

  // Lähtöpisteen valinta vie Afrikan laudalle: uusi lauta + uusi kaupunki.
  game.actionPickStart('kairo', 0);
  assert.equal(p.packId, 'africa');
  assert.equal(p.xp, XP_NEW_BOARD + XP_NEW_CITY);
  assert.ok(game.world.visited.has('kairo'));

  // Sama kaupunki uudelleen ei tuota mitään.
  const ennen = p.xp;
  assert.equal(game.visitCity(p), 0);
  assert.equal(p.xp, ennen);

  // Uusi kaupunki samalla laudalla: vain kaupungin pisteet.
  p.pos = { type: 'city', city: 'tripoli' };
  assert.equal(game.visitCity(p), XP_NEW_CITY);
  assert.equal(p.xp, ennen + XP_NEW_CITY);

  // Reitin varrella ei olla missään kaupungissa.
  p.pos = { type: 'edge', edge: 'tanger|karthago', idx: 2 };
  assert.equal(game.visitCity(p), 0);
});

test('vaikea kysymys ja laudan pääaarre antavat kokemuspisteitä', () => {
  const game = newGame(44);
  const p = game.player;
  p.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'emerald');
  const ennen = p.xp;

  game.actionTravel('stay', { form: 'quiz' });
  game.quiz.hard = true; // pakotetaan vaikeaksi ilman erillistä pakkaa
  game.answerQuiz(game.quiz.correct);
  assert.equal(p.xp, ennen + XP_HARD_ANSWER);

  // Tähti tuo laudan suurimmat pisteet. Ensimmäisenä päivänä löytynyt aarre
  // rikkoo myös isoisän ennätyksen, joten mukaan tulee ennätysbonus.
  const xpEnnenTahtea = p.xp;
  game.tokens.set('gao', 'star');
  p.pos = { type: 'city', city: 'gao' };
  game.revealToken('gao');
  assert.ok(game.dayCount() <= RECORD_DAYS);
  assert.equal(p.xp, xpEnnenTahtea + XP_STAR + XP_RECORD);
});

test('tietoprosentti laskee tietovisat ja kaksintaistelut yhteen', () => {
  const game = newGame(52);
  const p = game.player;
  assert.equal(game.knowledgePercent(p), null, 'ennen kysymyksiä ei ole prosenttia');

  game.countAnswer(p, true);
  assert.equal(game.knowledgePercent(p), 100);
  game.countAnswer(p, false);
  assert.equal(game.knowledgePercent(p), 50);
  game.countAnswer(p, true);
  game.countAnswer(p, true);
  assert.equal(p.quizAsked, 4);
  assert.equal(p.quizCorrect, 3);
  assert.equal(game.knowledgePercent(p), 75);
});

test('vastatut kysymykset kirjautuvat myös oikeista pelitilanteista', () => {
  const game = newGame(61);
  const p = game.player;
  p.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'emerald');

  game.actionTravel('stay', { form: 'quiz' });
  const vaara = (game.quiz.correct + 1) % game.quiz.options.length;
  game.answerQuiz(vaara);
  assert.equal(p.quizAsked, 1);
  assert.equal(p.quizCorrect, 0);
  game.closeQuiz();

  // Umpeen valunut tiimalasi on myös kysymys, johon vastattiin väärin.
  // Vuoro ehti vaihtua, joten palataan saman pelaajan vuoroon.
  game.current = 0;
  game.phase = 'action';
  game.beginTurn();
  assert.ok(game.actionTravel('stay', { form: 'quiz' }).ok);
  assert.ok(game.timeoutQuiz().ok);
  assert.equal(p.quizAsked, 2);
  assert.equal(p.quizCorrect, 0);
});

test('kokemuspisteet, laskurit ja käydyt kaupungit säilyvät tallennuksessa', () => {
  const game = new Game({
    players: [{ name: 'Yksin', color: '#f00', start: null }],
    pack: packById('maailma'),
    rng: mulberry32(77),
  });
  game.actionPickStart('kairo', 0);
  game.countAnswer(game.player, true);
  game.countAnswer(game.player, false);

  const data = JSON.parse(JSON.stringify(game.toJSON()));
  const restored = Game.fromJSON(data);

  assert.equal(restored.player.xp, game.player.xp);
  assert.equal(restored.player.quizAsked, 2);
  assert.equal(restored.player.quizCorrect, 1);
  assert.equal(restored.knowledgePercent(), 50);
  assert.deepEqual([...restored.world.visited], [...game.world.visited]);
  // Palautetussa pelissä sama kaupunki ei tuota pisteitä uudelleen.
  assert.equal(restored.visitCity(restored.player), 0);
});

test('vanha tallennus ilman käyntitietoja ei jaa pisteitä uudelleen', () => {
  const game = newGame(88);
  game.tokens.delete('timbuktu');
  game.revealed.set('timbuktu', 'emerald');
  const data = JSON.parse(JSON.stringify(game.toJSON()));
  delete data.worlds.africa.visited;

  const restored = Game.fromJSON(data);
  assert.ok(restored.world.visited.has('timbuktu'), 'käännetty laatta kertoo käynnistä');
  restored.player.pos = { type: 'city', city: 'timbuktu' };
  assert.equal(restored.visitCity(restored.player), 0);
});

// --- paketti 9: aikamittari ja isoisän ennätys -----------------------------

test('vuoro on kuusi tuntia ja neljä vuoroa on yksi matkapäivä', () => {
  const game = newGame(101);
  assert.equal(TURN_HOURS, 6);
  assert.equal(game.turnCount, 1);
  assert.equal(game.dayCount(), 1);
  assert.equal(game.timeOfDay(), 'aamu');

  const paivat = [];
  for (let i = 0; i < 8; i++) {
    game.turnCount = i + 1;
    paivat.push([game.dayCount(), game.timeOfDay()]);
  }
  assert.deepEqual(paivat, [
    [1, 'aamu'], [1, 'keskipäivä'], [1, 'ilta'], [1, 'yö'],
    [2, 'aamu'], [2, 'keskipäivä'], [2, 'ilta'], [2, 'yö'],
  ]);

  game.turnCount = 53; // 52 vuoroa = 13 vuorokautta
  assert.equal(game.dayCount(), 14);
  assert.equal(game.clockLabel(), 'Päivä 14, aamu');
});

test('vuorokaudenajan nimi seuraa tuntia eikä vuoron pituutta', () => {
  assert.equal(timeOfDayName(0), 'aamu');
  assert.equal(timeOfDayName(5), 'aamu');
  assert.equal(timeOfDayName(6), 'keskipäivä');
  assert.equal(timeOfDayName(12), 'ilta');
  assert.equal(timeOfDayName(23), 'yö');
});

test('isoisän aikataulurivi nousee kerran, kun matkapäivä ohittaa sen', () => {
  const game = newGame(102);
  const eka = game.pack.texts.schedule[0];
  assert.ok(eka.day > 1, 'ensimmäinen merkintä on vasta ensimmäisen päivän jälkeen');

  // Juuri ennen merkinnän päivää rivi ei vielä nouse.
  game.turnCount = Math.floor(((eka.day - 1) * 24) / TURN_HOURS);
  game.updateSchedule();
  assert.equal(game.scheduleNote, null);

  game.turnCount = Math.floor(((eka.day - 1) * 24) / TURN_HOURS) + 1;
  assert.equal(game.dayCount(), eka.day);
  game.updateSchedule();
  assert.equal(game.scheduleNote.text, eka.text);
  assert.equal(game.scheduleNote.day, eka.day);

  // Sama rivi ei tule toista kertaa.
  game.updateSchedule();
  assert.notEqual(game.scheduleNote?.day, eka.day);
});

test('ohitetut aikataulurivit nousevat yksi kerrallaan', () => {
  const game = newGame(103);
  const [eka, toka] = game.pack.texts.schedule;
  game.turnCount = Math.floor((toka.day * 24) / TURN_HOURS);
  game.updateSchedule();
  assert.equal(game.scheduleNote.day, eka.day, 'vanhin ohitettu rivi ensin');
  game.updateSchedule();
  assert.equal(game.scheduleNote.day, toka.day);
});

test('ennätys rikkoutuu ennen päivää 80 ja tuo kunniamerkinnän', () => {
  const game = newGame(104);
  const p = game.player;
  const ennen = p.xp;
  game.turnCount = 40; // päivä 10
  assert.ok(game.dayCount() < RECORD_DAYS);

  const mark = game.noteRecord(p);
  assert.equal(mark.day, game.dayCount());
  assert.equal(mark.label, `${RECORD_DAYS} päivää rikottu`);
  assert.equal(p.xp - ennen, XP_RECORD);
  assert.equal(game.recordMark.packId, game.pack.id);

  // Merkintä tehdään vain kerran.
  assert.equal(game.noteRecord(p), null);
});

test('ennätyksen ylitys ei päätä peliä eikä vie mitään', () => {
  const game = newGame(105);
  const p = game.player;
  const ennen = p.xp;
  game.turnCount = 4 * (RECORD_DAYS + 10);
  assert.ok(game.dayCount() > RECORD_DAYS);

  assert.equal(game.noteRecord(p), null, 'kunniamerkintää ei tule');
  assert.equal(game.recordMark, null);
  assert.equal(p.xp, ennen, 'hitaampi matka ei menetä pisteitä');
  assert.notEqual(game.phase, 'over', 'aika ei koskaan päätä peliä');
  assert.match(game.log[0].text, /ei nähnyt tätä kaikkea/);
});

test('aika ja aikataulu säilyvät tallennuksessa', () => {
  const game = newGame(106);
  game.turnCount = 40;
  game.updateSchedule();
  game.noteRecord(game.player);
  const nahdyt = [...game.scheduleShown];
  assert.ok(nahdyt.length > 0);

  const restored = Game.fromJSON(JSON.parse(JSON.stringify(game.toJSON())));
  assert.equal(restored.turnCount, 40);
  assert.equal(restored.dayCount(), game.dayCount());
  assert.deepEqual([...restored.scheduleShown], nahdyt);
  assert.equal(restored.recordNoted, true);
  assert.deepEqual(restored.recordMark, game.recordMark);

  // Jo nähty rivi ei nouse uudelleen tallennuksesta jatkettaessa.
  restored.updateSchedule();
  assert.ok(!nahdyt.includes(`${restored.pack.id}:${restored.scheduleNote?.day}`));
});

test('vanha tallennus ilman aikaa jatkuu päivästä 1', () => {
  const game = newGame(107);
  const data = JSON.parse(JSON.stringify(game.toJSON()));
  delete data.turnCount;
  delete data.scheduleShown;
  delete data.scheduleNote;
  delete data.recordNoted;
  delete data.recordMark;

  const restored = Game.fromJSON(data);
  assert.equal(restored.dayCount(), 1);
  assert.equal(restored.timeOfDay(), 'aamu');
  assert.equal(restored.scheduleShown.size, 0);
  assert.equal(restored.recordNoted, false);
  assert.equal(restored.recordMark, null);
});

test('Afrikan aikataulu on nouseva ja ulottuu ennätyksen yli', () => {
  const schedule = packById('africa').texts.schedule;
  assert.ok(Array.isArray(schedule) && schedule.length >= 8);
  for (let i = 1; i < schedule.length; i++) {
    assert.ok(schedule[i].day > schedule[i - 1].day, 'päivät nousevat');
  }
  assert.ok(schedule.some((r) => r.day === RECORD_DAYS), 'ennätyspäivällä on oma rivi');
  assert.ok(
    schedule.some((r) => r.day > RECORD_DAYS),
    'matka jatkuu ennätyksen jälkeenkin',
  );
  for (const rivi of schedule) {
    assert.equal(typeof rivi.text, 'string');
    assert.ok(rivi.text.length > 40, `liian lyhyt merkintä päivälle ${rivi.day}`);
  }
});

// --- paketti 10: kysymysten vaihtelu ---------------------------------------

test('pysähdyksen muoto arvotaan painojen mukaan', () => {
  const game = newGame(301);
  // Valokuvamuoto on painoissa vain, kun kuvia on ladattu.
  game.setPhotoPool(['tripoli', 'kairo']);
  const lukumaarat = { quiz: 0, claim: 0, photo: 0, event: 0 };
  for (let i = 0; i < 6000; i++) {
    game.lastForm = null; // ilman toistoestoa painot näkyvät sellaisinaan
    lukumaarat[game.pickForm('timbuktu')]++;
  }
  const osuus = (k) => (lukumaarat[k] / 6000) * 100;
  const summa = Object.values(FORM_WEIGHTS).reduce((a, b) => a + b, 0);
  for (const [muoto, paino] of Object.entries(FORM_WEIGHTS)) {
    const odotus = (paino / summa) * 100;
    assert.ok(
      Math.abs(osuus(muoto) - odotus) < 3,
      `${muoto}: ${osuus(muoto).toFixed(1)} % kun odotus on ${odotus.toFixed(1)} %`,
    );
  }
});

test('sama erikoismuoto ei toistu kahdesti peräkkäin', () => {
  const game = newGame(302);
  game.setPhotoPool(['tripoli', 'kairo']);
  for (const muoto of ['claim', 'photo', 'event']) {
    game.lastForm = muoto;
    assert.equal(game.formWeights('timbuktu')[muoto], 0, `${muoto} sai painon heti perään`);
  }
  // Monivalinta saa toistua: se on peruspysähdys eikä erikoismuoto.
  game.lastForm = 'quiz';
  assert.ok(game.formWeights('timbuktu').quiz > 0);
});

test('lauta ilman väittämiä ja tapahtumia toimii silti', () => {
  const game = newGame(303);
  const pack = game.pack;
  const claims = pack.questions.claims;
  const events = pack.events;
  try {
    delete pack.questions.claims;
    delete pack.events;
    game.setPhotoPool(['tripoli']);
    const painot = game.formWeights('timbuktu');
    assert.equal(painot.claim, 0);
    assert.equal(painot.event, 0);
    assert.ok(painot.photo > 0, 'valokuvakysymys toimii ilman kirjoitettua sisältöä');
    assert.equal(
      Object.values(painot).reduce((a, b) => a + b, 0),
      Object.values(FORM_WEIGHTS).reduce((a, b) => a + b, 0),
      'puuttuvien muotojen paino siirtyy monivalinnalle',
    );
  } finally {
    pack.questions.claims = claims;
    pack.events = events;
  }
});

test('vaikea kysymys ja tietoportti ovat aina monivalinta', () => {
  const game = newGame(304);
  game.player.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'emerald');
  assert.ok(game.actionQuiz({ hard: true }).ok);
  assert.equal(game.quiz.kind, undefined, 'vaikea kysymys ei ole erikoismuoto');
  assert.equal(game.quiz.options.length, 4);
});

test('isoisän väittämä on kaksivaihtoehtoinen eikä salli apukeinoja', () => {
  const game = newGame(305);
  game.player.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'emerald');
  assert.ok(game.actionQuiz({ form: 'claim' }).ok);
  const quiz = game.quiz;
  assert.equal(quiz.kind, 'claim');
  assert.deepEqual(quiz.options, ['Pitää yhä paikkansa', 'Ei enää pidä']);
  assert.ok(typeof quiz.place === 'string' && quiz.place.length >= 3, 'väittämällä on paikka');
  assert.equal(game.actionFiftyFifty().ok, false, '50:50 ei kuulu väittämään');
  assert.equal(game.actionHint().ok, false, 'väittämässä ei ole vihjettä');

  // Oikea vastaus kääntää laatan kuten monivalinnassakin.
  game.answerQuiz(quiz.correct);
  assert.equal(quiz.right, true);
  assert.ok(quiz.found, 'oikea vastaus kääntää laatan');
});

test('valokuvakysymys: kuvan paikka arvataan laudan nimistä', () => {
  for (const seed of [301, 302, 303, 304, 305]) {
    const game = newGame(seed);
    game.player.pos = { type: 'city', city: 'timbuktu' };
    game.tokens.set('timbuktu', 'emerald');
    game.setPhotoPool(['tripoli', 'kairo', 'sansibar']);
    assert.ok(game.actionQuiz({ form: 'photo' }).ok);
    const quiz = game.quiz;
    assert.equal(quiz.kind, 'photo');
    assert.ok(['tripoli', 'kairo', 'sansibar'].includes(quiz.photoCity), 'kohde tulee kuvalistasta');
    assert.ok(quiz.photoWiki, 'kuvalle on artikkelin otsikko');
    assert.equal(quiz.options.length, PHOTO_CHOICES);
    assert.equal(new Set(quiz.options).size, PHOTO_CHOICES, 'vaihtoehdot ovat eri nimiä');
    const kohde = game.board.cityById.get(quiz.photoCity);
    assert.equal(quiz.options[quiz.correct], kohde.name, 'oikea vaihtoehto on kuvan paikka');
    assert.ok(quiz.frame.includes('valokuvaaja'), 'kehys kertoo kysyjän');

    // Väärä vastaus ei käännä laattaa.
    game.answerQuiz((quiz.correct + 1) % PHOTO_CHOICES);
    assert.equal(quiz.right, false);
    assert.ok(!quiz.found);
  }
});

test('valokuvakysymys ei toista samaa kuvaa ja putoaa pois ilman kuvia', () => {
  const game = newGame(306);
  game.player.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'emerald');

  // Ilman ladattuja kuvia muoto ei saa painoa ja pakotettunakin se
  // putoaa tavalliseen monivalintaan.
  assert.equal(game.formWeights('timbuktu').photo, 0);
  assert.ok(game.actionQuiz({ form: 'photo' }).ok);
  assert.equal(game.quiz.kind, undefined, 'ilman kuvia avautuu monivalinta');

  // Yhden kuvan lista: sama kuva ei tule kahdesti.
  const toinen = newGame(307);
  toinen.player.pos = { type: 'city', city: 'timbuktu' };
  toinen.tokens.set('timbuktu', 'emerald');
  toinen.setPhotoPool(['tripoli']);
  assert.ok(toinen.actionQuiz({ form: 'photo' }).ok);
  assert.equal(toinen.quiz.photoCity, 'tripoli');
  assert.equal(toinen.photoTargets().length, 0, 'kysytty kuva ei ole enää tarjolla');
});

/** Yksin pelattava Afrikan peli: vuorolaskuri kasvaa joka vuorolla. */
function soloGame(seed) {
  return new Game({
    players: [{ name: 'Yksin', color: '#f00', start: 'tanger' }],
    seed,
  });
}

test('tapahtumakortti vie vuoron eikä käännä laattaa', () => {
  const game = soloGame(307);
  game.player.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'emerald');
  const vuoroEnnen = game.turnCount;
  assert.ok(game.actionQuiz({ form: 'event' }).ok);
  assert.equal(game.phase, 'event');
  game.eventCard.effect = { kind: 'viive' };
  game.closeEvent();
  assert.equal(game.phase, 'action');
  assert.ok(game.tokens.has('timbuktu'), 'laatta jää kääntämättä');
  assert.equal(game.turnCount - vuoroEnnen, 2, 'viive vie ylimääräisen vuoron');
});

test('tapahtuma ei jätä matkaajaa velkaan', () => {
  const game = soloGame(308);
  game.player.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'emerald');
  game.player.money = 20;
  game.actionQuiz({ form: 'event' });
  game.eventCard.effect = { kind: 'raha', amount: -60 };
  game.closeEvent();
  assert.equal(game.player.money, 0);
});

test('kyyti siirtää naapurikaupunkiin ilmaiseksi', () => {
  const game = soloGame(309);
  game.player.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'emerald');
  const rahaEnnen = game.player.money;
  game.actionQuiz({ form: 'event' });
  game.eventCard.effect = { kind: 'kyyti' };
  game.closeEvent();
  assert.notEqual(game.player.pos.city, 'timbuktu');
  assert.equal(game.player.money, rahaEnnen, 'kyyti on ilmainen');
});

test('Afrikan tapahtumakortit ovat ehjiä ja reiluja', () => {
  const events = packById('africa').events;
  assert.ok(Array.isArray(events) && events.length >= 8, 'tapahtumia on liian vähän');
  for (const e of events) {
    assert.equal(typeof e.text, 'string');
    assert.ok(e.text.length >= 100, `liian lyhyt tapahtuma: ${e.text}`);
    assert.ok(['viive', 'raha', 'kyyti'].includes(e.effect?.kind), `tuntematon vaikutus: ${e.effect?.kind}`);
    if (e.effect.kind === 'raha') {
      assert.ok(Number.isInteger(e.effect.amount) && e.effect.amount !== 0);
      // Tapahtuma ei saa koskaan viedä isoa summaa.
      assert.ok(e.effect.amount >= -60 && e.effect.amount <= 120, `liian iso vaikutus: ${e.effect.amount}`);
    }
  }
  const tekstit = events.map((e) => e.text);
  assert.equal(new Set(tekstit).size, tekstit.length, 'sama tapahtuma kahdesti');
});

test('Afrikan väittämät ovat ehjiä ja tasapainossa', () => {
  const claims = packById('africa').questions.claims;
  assert.ok(Array.isArray(claims) && claims.length >= 12, 'väittämiä on liian vähän');
  const tosia = claims.filter((c) => c.correct === true).length;
  const taruja = claims.filter((c) => c.correct === false).length;
  assert.equal(tosia + taruja, claims.length, 'correct pitää olla boolean');
  // Noin puolet totta: muuten pelaaja oppii vastaamaan aina samaa.
  assert.ok(Math.abs(tosia - taruja) <= 2, `epätasapaino: ${tosia} tosi / ${taruja} tarua`);
  for (const c of claims) {
    assert.ok(c.q && c.q.length >= 80, `liian lyhyt väittämä: ${c.q}`);
    assert.ok(c.fact && c.fact.length >= 60, `liian lyhyt selitys: ${c.q}`);
    // Paikka näytetään otsikossa, ettei merkintää lue väärään maisemaan.
    assert.ok(typeof c.place === 'string' && c.place.length >= 3, `väittämältä puuttuu paikka: ${c.q}`);
    checkSources(c.source, `väittämä "${c.q}"`);
  }
  const tekstit = claims.map((c) => c.q);
  assert.equal(new Set(tekstit).size, tekstit.length, 'sama väittämä kahdesti');
});

test('väittämät eivät ole mukana monivalintojen eheystarkistuksessa', () => {
  const pack = packById('africa');
  const kaikki = allQuestions(pack);
  assert.ok(kaikki.length > 0);
  assert.ok(kaikki.every((q) => Array.isArray(q.options)), 'väittämä vuoti monivalintoihin');
  assert.ok(!kaikki.some((q) => q.key === 'claims'));
});

// --- paketti 11: "Lue lisää" -----------------------------------------------

test('Afrikan kaupungeilla on tarkistettu wiki-otsikko', () => {
  const cities = packById('africa').cities;
  const wikit = cities.filter((c) => c.wiki);
  assert.ok(wikit.length >= 25, `wiki-kenttiä vain ${wikit.length}/${cities.length}`);
  for (const c of cities) {
    if (c.wiki === undefined) continue;
    assert.equal(typeof c.wiki, 'string', `${c.id}: wiki ei ole merkkijono`);
    assert.ok(c.wiki.trim().length > 1, `${c.id}: tyhjä wiki-otsikko`);
  }
});

test('kaikkien lautojen wiki-kentät ovat merkkijonoja jos ne ovat olemassa', () => {
  for (const pack of PACKS) {
    for (const c of pack.cities) {
      if (c.wiki === undefined) continue;
      assert.equal(typeof c.wiki, 'string', `${pack.id}/${c.id}`);
    }
  }
});

test('summaryUrl koodaa otsikon', () => {
  assert.equal(
    summaryUrl('fi', 'Kimberley (Etelä-Afrikka)'),
    'https://fi.wikipedia.org/api/rest_v1/page/summary/Kimberley%20(Etel%C3%A4-Afrikka)',
  );
});

test('parseSummary hylkää kelvottomat vastaukset', () => {
  assert.equal(parseSummary(null, 'fi'), null);
  assert.equal(parseSummary({ type: 'disambiguation', extract: 'Gao voi tarkoittaa' }, 'fi'), null);
  assert.equal(parseSummary({ extract: '   ' }, 'fi'), null);
  assert.equal(parseSummary({ title: 'X' }, 'fi'), null, 'ilman tiivistelmää ei kelpaa');
});

test('parseSummary poimii tekstin, kuvan ja artikkelin osoitteen', () => {
  const s = parseSummary({
    title: 'Timbuktu',
    extract: 'Timbuktu on kaupunki Malissa.',
    thumbnail: { source: 'https://kuva.example/timbuktu.jpg' },
    content_urls: { desktop: { page: 'https://fi.wikipedia.org/wiki/Timbuktu' } },
  }, 'fi');
  assert.equal(s.lang, 'fi');
  assert.equal(s.title, 'Timbuktu');
  assert.equal(s.image, 'https://kuva.example/timbuktu.jpg');
  assert.equal(s.url, 'https://fi.wikipedia.org/wiki/Timbuktu');
});

/** Tekaistu fetch: palauttaa kielikohtaisen vastauksen ilman verkkoa. */
function fakeFetch(vastaukset) {
  return async (url) => {
    const lang = url.slice(8, 10);
    const v = vastaukset[lang];
    if (v === 'virhe') throw new Error('ei yhteyttä');
    if (!v) return { ok: false, status: 404, json: async () => ({}) };
    return { ok: true, json: async () => v };
  };
}

test('articleUrl pyytää koko artikkelin pelkkänä tekstinä oikealta kieleltä', () => {
  const url = articleUrl('fi', 'Kap Palmas');
  assert.ok(url.startsWith('https://fi.wikipedia.org/w/api.php?'));
  assert.ok(url.includes('explaintext=1'), 'pelkkä teksti on pakollinen');
  assert.ok(url.includes('titles=Kap+Palmas'));
  assert.ok(url.includes('origin=*'), 'CORS-avaus puuttuu');
});

test('parseArticle poimii artikkelin ja hylkää puuttuvan sivun', () => {
  const data = { query: { pages: { 123: { extract: 'Kappale.\n\n== Historia ==\nLisää tekstiä.' } } } };
  assert.ok(parseArticle(data).startsWith('Kappale.'));
  assert.equal(parseArticle({ query: { pages: { '-1': { missing: '' } } } }), null);
  assert.equal(parseArticle(null), null);
  assert.equal(parseArticle({}), null);
});

test('pickImage ohittaa montaasit, symbolit ja svg:t', () => {
  const items = [
    { type: 'image', title: 'File:Addis Abeba montage.jpg', srcset: [{ src: '//x/montage.jpg' }] },
    { type: 'image', title: 'File:Flag of Ethiopia.svg', srcset: [{ src: '//x/flag.svg' }] },
    { type: 'video', title: 'File:Video.webm', srcset: [{ src: '//x/video.jpg' }] },
    { type: 'image', title: 'File:Meskel Square.jpg', srcset: [{ src: '//x/small.jpg' }, { src: '//x/big.jpg' }] },
  ];
  assert.equal(pickImage(items), 'https://x/big.jpg');
  assert.equal(pickImage([]), null);
  assert.equal(pickImage(null), null);
});

test('fetchImage vaihtaa montaasin oikeaan valokuvaan', async () => {
  assert.ok(BAD_IMAGE.test('Addis_Ababa_montage_2.png'));
  const summary = { lang: 'fi', title: 'Addis Abeba', image: 'https://x/Addis_montage.jpg' };
  const image = await fetchImage(summary, {
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({ items: [{ type: 'image', title: 'File:Katunäkymä.jpg', srcset: [{ src: '//x/katu.jpg' }] }] }),
    }),
  });
  assert.equal(image, 'https://x/katu.jpg');
  // Tavallinen valokuva kelpaa sellaisenaan ilman uutta hakua.
  const suora = await fetchImage(
    { lang: 'fi', title: 'X', image: 'https://x/tori.jpg' },
    { fetchImpl: async () => { throw new Error('ei saa kutsua'); } },
  );
  assert.equal(suora, 'https://x/tori.jpg');
  // Ilman verkkoa montaasi jää varakuvaksi.
  const vara = await fetchImage(summary, { fetchImpl: async () => { throw new Error('offline'); } });
  assert.equal(vara, summary.image);
});

test('fetchSummary suosii suomea ja kelpuuttaa pitkän tiivistelmän', async () => {
  const s = await fetchSummary('Timbuktu', {
    fetchImpl: fakeFetch({ fi: { title: 'Timbuktu', extract: 'a'.repeat(250) } }),
  });
  assert.equal(s.lang, 'fi');
  assert.equal(s.extract.length, 250);
});

test('lyhyt suomenkielinen tiivistelmä väistyy englannin tieltä', async () => {
  const s = await fetchSummary('Gao', {
    fetchImpl: fakeFetch({
      fi: { title: 'Gao', extract: 'Lyhyt tynkä.' },
      en: { title: 'Gao', extract: 'b'.repeat(400) },
    }),
  });
  assert.equal(s.lang, 'en');
});

test('lyhyt tynkä kelpaa, jos parempaa ei ole', async () => {
  const s = await fetchSummary('Gao', {
    fetchImpl: fakeFetch({ fi: { title: 'Gao', extract: 'Lyhyt tynkä.' } }),
  });
  assert.equal(s.lang, 'fi', 'lyhyt on parempi kuin ei mitään');
});

test('puuttuva suomenkielinen artikkeli kaatuu englantiin', async () => {
  const s = await fetchSummary('Ras Hafun', {
    fetchImpl: fakeFetch({ en: { title: 'Ras Hafun', extract: 'c'.repeat(300) } }),
  });
  assert.equal(s.lang, 'en');
});

test('verkkovirhe ei kaada peliä vaan palauttaa null', async () => {
  const s = await fetchSummary('Timbuktu', { fetchImpl: fakeFetch({ fi: 'virhe', en: 'virhe' }) });
  assert.equal(s, null);
});

test('täsmennyssivu ei kelpaa kummallakaan kielellä', async () => {
  const s = await fetchSummary('Tripoli', {
    fetchImpl: fakeFetch({
      fi: { type: 'disambiguation', extract: 'Tripoli voi tarkoittaa' },
      en: { type: 'disambiguation', extract: 'Tripoli may refer to' },
    }),
  });
  assert.equal(s, null);
});

test('fetchSummary ei kutsu verkkoa ilman otsikkoa', async () => {
  let kutsuja = 0;
  const s = await fetchSummary('', { fetchImpl: async () => { kutsuja++; return { ok: false }; } });
  assert.equal(s, null);
  assert.equal(kutsuja, 0);
});

// --- paketti 12: isoisän luonnoskirjan pulmat -------------------------------

test('Afrikan pulmadata on ehjä', () => {
  const puzzles = packById('africa').puzzles ?? [];
  assert.equal(puzzles.length, 5, 'Afrikalla pitää olla viisi pulmaa');
  const cityIds = new Set(packById('africa').cities.map((c) => c.id));
  const nahdyt = new Set();
  for (const p of puzzles) {
    assert.ok(p.id && typeof p.id === 'string', 'pulmalta puuttuu id');
    assert.ok(!nahdyt.has(p.id), `sama pulma-id kahdesti: ${p.id}`);
    nahdyt.add(p.id);
    assert.ok(cityIds.has(p.city), `pulman ${p.id} kaupunki ${p.city} ei ole laudalla`);
    assert.ok(hasSketch(p.id), `pulmalta ${p.id} puuttuu piirros`);
    assert.ok(p.title && p.title.length > 2, `pulmalta ${p.id} puuttuu otsikko`);
    assert.ok(p.q && p.q.length > 20, `pulman ${p.id} kysymys on liian lyhyt`);
    assert.equal(p.options.length, 4, `pulmalla ${p.id} ei ole neljää vaihtoehtoa`);
    assert.equal(new Set(p.options).size, 4, `pulmalla ${p.id} on kaksi samaa vaihtoehtoa`);
    assert.ok(
      Number.isInteger(p.correct) && p.correct >= 0 && p.correct < 4,
      `pulman ${p.id} oikea vastaus on virheellinen`,
    );
    assert.ok(p.fact && p.fact.length > 40, `pulmalta ${p.id} puuttuu selitys`);
    checkSources(p.source, `pulma "${p.id}"`);
  }
  // Yksi kaupunki, yksi pulma: muuten toinen jäisi ikuisesti avaamatta.
  const kaupungit = puzzles.map((p) => p.city);
  assert.equal(new Set(kaupungit).size, kaupungit.length, 'kahdella pulmalla sama kaupunki');
});

/** Peli, jossa matkaaja seisoo annetussa kaupungissa. */
function puzzleGame(seed, city) {
  const game = new Game({
    players: [{ name: 'Yksin', color: '#f00', start: 'tanger' }],
    seed,
  });
  game.player.pos = { type: 'city', city };
  return game;
}

test('laatatonta kaupunkia voi tutkia kerran: kokemuspisteet, ei laattaa', () => {
  const game = new Game({
    players: [{ name: 'Yksin', color: '#f00', start: 'tanger' }],
    seed: 411,
  });
  const p = game.player;
  assert.ok(!game.tokens.has('tanger'), 'lähtökaupungissa ei ole laattaa');
  assert.ok(game.canExplore(game.board.cityById.get('tanger')));

  game.phase = 'offer';
  assert.ok(game.actionQuiz().ok);
  assert.equal(game.quiz.explore, true);
  assert.ok(game.quiz.frame, 'tutkimisellakin on kysyjä');

  const xpEnnen = p.xp ?? 0;
  const rahaEnnen = p.money;
  game.answerQuiz(game.quiz.correct);
  assert.equal((p.xp ?? 0) - xpEnnen, XP_EXPLORE, 'oikeasta saa kokemuspisteitä');
  assert.equal(p.money - rahaEnnen, EXPLORE_REWARD, 'oikeasta saa löytöpalkkion');
  assert.ok(!game.quiz.found, 'laattaa ei käänny');
  game.closeQuiz();

  // Sama kaupunki uudelleen: tutkittu, joten tarjousta ei tule.
  p.pos = { type: 'city', city: 'tanger' };
  assert.equal(game.offerQuiz(), false, 'tutkittu kaupunki ei tarjoa uudelleen');
});

test('pulma odottaa pulmakaupungissa ja avautuu kerran pelissä', () => {
  const puzzle = packById('africa').puzzles[0];
  const game = puzzleGame(401, puzzle.city);

  assert.ok(game.pendingPuzzle(), 'pulman pitäisi odottaa');
  assert.ok(game.openPuzzle().ok);
  assert.equal(game.quiz.kind, 'puzzle');
  assert.equal(game.quiz.options.length, 4);
  assert.equal(game.quiz.seconds, null, 'pulmassa ei ole kelloa');

  game.answerQuiz(game.quiz.correct);
  game.closeQuiz();

  // Sama kaupunki uudelleen: pulma ei enää aukea.
  assert.equal(game.pendingPuzzle(), null, 'pulma avautui toisen kerran');
  assert.equal(game.openPuzzle().ok, false);
});

test('pulmakaupungin ulkopuolella ei ole pulmaa', () => {
  const pulmakaupungit = new Set(packById('africa').puzzles.map((p) => p.city));
  const muu = packById('africa').cities.find((c) => !pulmakaupungit.has(c.id));
  const game = puzzleGame(402, muu.id);
  assert.equal(game.pendingPuzzle(), null);
});

test('pulma aukeaa Tutki paikka -napista, ei itsestään: aloitus Kairoon', () => {
  const game = new Game({
    players: [{ name: 'Yksin', color: '#f00', start: null }],
    pack: packById('maailma'),
    seed: 403,
  });
  const kairo = game.pack.cities.find((c) => c.id === 'kairo');
  const idx = kairo.links.findIndex((l) => l.pack === 'africa');
  assert.ok(idx >= 0, 'maailman Kairosta pitäisi olla portti Afrikkaan');

  const tulos = game.actionPickStart('kairo', idx);
  assert.ok(tulos.ok);
  assert.equal(game.pack.id, 'africa');
  // Mikään ei saa hypätä ruudulle heti laskeuduttua — Tutki paikka odottaa
  // alavalikossa, ja pulma aukeaa vasta siitä.
  assert.equal(game.quiz, null, 'pulma ei saa avautua itsestään');
  assert.equal(game.phase, 'action', 'saapuminen ei avaa korttia');
  assert.ok(game.travelModes().includes('stay'), 'Tutki paikka on alavalikossa');
  assert.ok(game.actionQuiz().ok);
  assert.equal(game.quiz?.kind, 'puzzle', 'Tutki paikka avaa pulman');
  assert.equal(game.quiz.cityId, 'kairo');

  // Pulman jälkeen palataan tarjoukseen eikä pulma aukea uudelleen.
  game.answerQuiz(game.quiz.correct);
  game.closeQuiz();
  assert.notEqual(game.phase, 'quiz');
  assert.equal(game.pendingPuzzle(), null);
});

test('jalan saapuminen pulmakaupunkiin tarjoaa tutkimista ja Tutki avaa pulman', () => {
  const puzzle = packById('africa').puzzles[0];
  const game = puzzleGame(404, puzzle.city);
  // Siirretään pelaaja pois ja takaisin actionMove-polkua pitkin:
  // rakennetaan siirto käsin samaan kaupunkiin viereisestä kaupungista.
  const naapuri = game.board.adj.get(puzzle.city)[0];
  game.player.pos = { type: 'city', city: naapuri.to ?? naapuri };
  game.phase = 'move';
  game.travelMode = 'land';
  game.pendingFare = 0;
  game.moves = new Map([[puzzle.city, { pos: { type: 'city', city: puzzle.city }, path: [] }]]);
  const tulos = game.actionMove(puzzle.city);
  assert.ok(tulos.ok);
  assert.equal(game.quiz, null, 'pulma ei saa avautua itsestään');
  assert.notEqual(game.phase, 'quiz', 'saapuminen ei avaa mitään itsestään');
  assert.ok(game.travelModes().includes('stay'), 'Tutki paikka on alavalikossa');
  assert.ok(game.actionQuiz().ok);
  assert.equal(game.quiz?.kind, 'puzzle', 'Tutki paikka avaa pulman');
});

test('oikea pulma tuo kokemuspisteet, väärä ei rankaise', () => {
  const puzzle = packById('africa').puzzles[0];

  const oikein = puzzleGame(403, puzzle.city);
  const xpEnnen = oikein.player.xp ?? 0;
  const rahaEnnen = oikein.player.money;
  oikein.openPuzzle();
  oikein.answerQuiz(oikein.quiz.correct);
  assert.equal(oikein.quiz.right, true);
  assert.equal((oikein.player.xp ?? 0) - xpEnnen, XP_PUZZLE);
  assert.equal(oikein.player.money, rahaEnnen, 'pulma ei liikuta rahaa');

  const vaarin = puzzleGame(404, puzzle.city);
  const xp2 = vaarin.player.xp ?? 0;
  const raha2 = vaarin.player.money;
  vaarin.openPuzzle();
  vaarin.answerQuiz((vaarin.quiz.correct + 1) % 4);
  assert.equal(vaarin.quiz.right, false);
  assert.equal(vaarin.player.xp ?? 0, xp2, 'väärästä ei saa kokemuspisteitä');
  assert.equal(vaarin.player.money, raha2, 'väärästä ei rangaista rahalla');
  // Oikea ratkaisu on silti näkyvissä.
  assert.ok(vaarin.quiz.options[vaarin.quiz.correct]);
  assert.ok(vaarin.quiz.fact);
});

test('pulma ei käännä laattaa eikä päätä vuoroa', () => {
  const puzzle = packById('africa').puzzles.find((p) => p.city !== 'kairo');
  const game = puzzleGame(405, puzzle.city);
  game.tokens.set(puzzle.city, 'emerald');
  game.phase = 'action';
  const vuoroEnnen = game.turnCount;

  game.openPuzzle();
  game.answerQuiz(game.quiz.correct);
  game.closeQuiz();

  assert.ok(game.tokens.has(puzzle.city), 'pulma käänsi laatan');
  assert.equal(game.turnCount, vuoroEnnen, 'pulma päätti vuoron');
  assert.equal(game.phase, 'action', 'vuoro jatkuu siitä mihin jäätiin');
});

test('pulmassa on apukeinot: vihje ja 50:50', () => {
  const puzzle = packById('africa').puzzles[0];
  const game = puzzleGame(406, puzzle.city);
  game.openPuzzle();
  assert.ok(game.quiz.hint, 'pulmalla on vihjeteksti');
  assert.ok(game.quiz.selite, 'pulmalla on piirroksen selite');
  assert.equal(game.actionHint().ok, true, 'vihjeen voi ostaa');
  assert.equal(game.actionFiftyFifty().ok, true, '50:50 toimii pulmassa');
  assert.equal(game.quiz.hidden.length, 2, 'kaksi väärää piiloon');
  assert.ok(!game.quiz.hidden.includes(game.quiz.correct), 'oikea vaihtoehto jää näkyviin');
});

test('jokaisella pulmalla ja variantilla on vihje ja selite', () => {
  for (const p of packById('africa').puzzles) {
    assert.ok(typeof p.selite === 'string' && p.selite.length > 20, `${p.id}: selite puuttuu`);
    assert.ok(typeof p.hint === 'string' && p.hint.length > 10, `${p.id}: vihje puuttuu`);
    if (!p.generate) continue;
    // Kaikilla arvotuilla varianteilla on oma tai peritty vihje.
    for (let i = 0; i < 30; i++) {
      const arvottu = p.generate(mulberry32(1000 + i));
      const hint = arvottu?.hint ?? p.hint;
      assert.ok(typeof hint === 'string' && hint.length > 10, `${p.id}: variantin vihje puuttuu`);
    }
  }
});

test('nähdyt pulmat säilyvät tallennuksessa', () => {
  const puzzle = packById('africa').puzzles[0];
  const game = puzzleGame(407, puzzle.city);
  game.openPuzzle();
  game.answerQuiz(game.quiz.correct);
  game.closeQuiz();

  const kopio = Game.fromJSON(JSON.parse(JSON.stringify(game.toJSON())));
  kopio.player.pos = { type: 'city', city: puzzle.city };
  assert.equal(kopio.pendingPuzzle(), null, 'pulma unohtui tallennuksessa');
});

test('vanha tallenne ilman pulmatietoa jatkuu', () => {
  const game = puzzleGame(408, 'tanger');
  const data = JSON.parse(JSON.stringify(game.toJSON()));
  delete data.puzzlesSeen;
  const kopio = Game.fromJSON(data);
  assert.ok(kopio.puzzlesSeen instanceof Set);
  assert.equal(kopio.puzzlesSeen.size, 0);
});

test('vesileilipulmassa vain merkitty vastaus tuottaa neljä mittaa', () => {
  // Sarjat luetaan pulman vaihtoehdoista sanasta sanaan, jotta testi kaatuu,
  // jos joku muokkaa tekstiä muuttamatta logiikkaa (tai päinvastoin).
  const puzzle = packById('africa').puzzles.find((p) => p.id === 'vesileilit');
  const KOOT = { kolmonen: 3, viitonen: 5 };

  /** Suorittaa yhden sarjan ja palauttaa leilien sisällöt. */
  const aja = (teksti) => {
    const tila = { kolmonen: 0, viitonen: 0 };
    for (const askel of teksti.toLowerCase().split(',').map((s) => s.trim())) {
      const tayta = askel.match(/^täytä (kolmonen|viitonen)$/);
      const tyhjenna = askel.match(/^tyhjennä (kolmonen|viitonen)$/);
      const kaadaTayteen = askel.match(/^kaada (?:siitä )?(kolmonen|viitonen) täyteen$/);
      const kaada = askel.match(/^kaada (?:se |kolmonen |viitonen |(?:kolmosen|viitosen) loput )?(kolmoseen|viitoseen)$/);

      if (tayta) {
        tila[tayta[1]] = KOOT[tayta[1]];
      } else if (tyhjenna) {
        tila[tyhjenna[1]] = 0;
      } else if (kaadaTayteen) {
        const kohde = kaadaTayteen[1];
        const lahde = kohde === 'kolmonen' ? 'viitonen' : 'kolmonen';
        const maara = Math.min(tila[lahde], KOOT[kohde] - tila[kohde]);
        tila[lahde] -= maara;
        tila[kohde] += maara;
      } else if (kaada) {
        const kohde = kaada[1] === 'kolmoseen' ? 'kolmonen' : 'viitonen';
        const lahde = kohde === 'kolmonen' ? 'viitonen' : 'kolmonen';
        const maara = Math.min(tila[lahde], KOOT[kohde] - tila[kohde]);
        tila[lahde] -= maara;
        tila[kohde] += maara;
      } else {
        assert.fail(`tunnistamaton askel: "${askel}"`);
      }
    }
    return tila;
  };

  puzzle.options.forEach((teksti, i) => {
    const { kolmonen, viitonen } = aja(teksti);
    const nelja = kolmonen === 4 || viitonen === 4;
    if (i === puzzle.correct) {
      assert.ok(nelja, `merkitty oikea vastaus ei tuota neljää: ${kolmonen}/${viitonen}`);
    } else {
      assert.ok(!nelja, `väärä vaihtoehto ${i} tuottaakin neljä mittaa`);
    }
  });
});

test('kultapunnuspulmassa vain merkitty vastaus tasapainottaa vaa%an', () => {
  const puzzle = packById('africa').puzzles.find((p) => p.id === 'punnukset');
  const { kulta, vasen, oikea } = puzzle.sketch;
  const vaje = (kulta + vasen) - oikea.reduce((a, b) => a + b, 0);
  puzzle.options.forEach((teksti, i) => {
    const tasapaino = Number(teksti) === vaje;
    if (i === puzzle.correct) assert.ok(tasapaino, `merkitty vastaus ${teksti} ei tasapainota (tarvitaan ${vaje})`);
    else assert.ok(!tasapaino, `väärä vaihtoehto ${teksti} tasapainottaakin vaa'an`);
  });
});

// --- paketti 13: pulmien variointi -----------------------------------------

/** Sama siemenrng kuin pelissä, jotta testit vastaavat todellista arvontaa. */
function seedRng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

test('arvonta on siemenellä deterministinen', () => {
  for (const p of packById('africa').puzzles) {
    const a = p.generate(seedRng(42));
    const b = p.generate(seedRng(42));
    assert.deepEqual(a, b, `${p.id}: sama siemen antoi eri pulman`);
  }
});

test('arvonta tuottaa aina neljä uniikkia vaihtoehtoa ja kelvollisen indeksin', () => {
  for (const p of packById('africa').puzzles) {
    for (let seed = 1; seed <= 100; seed++) {
      const r = p.generate(seedRng(seed));
      assert.equal(r.options.length, 4, `${p.id} siemen ${seed}: väärä määrä vaihtoehtoja`);
      assert.equal(new Set(r.options).size, 4, `${p.id} siemen ${seed}: kaksi samaa vaihtoehtoa`);
      assert.ok(
        Number.isInteger(r.correct) && r.correct >= 0 && r.correct < 4,
        `${p.id} siemen ${seed}: correct-indeksi ${r.correct}`,
      );
      assert.ok(r.options.every((o) => typeof o === 'string' && o.length > 0));
    }
  }
});

test('variointi todella varioi', () => {
  for (const p of packById('africa').puzzles) {
    const nahdyt = new Set();
    for (let seed = 1; seed <= 10; seed++) {
      const r = p.generate(seedRng(seed));
      nahdyt.add(JSON.stringify([r.sketch, r.options[r.correct]]));
    }
    assert.ok(nahdyt.size >= 2, `${p.id}: kymmenellä siemenellä vain ${nahdyt.size} erilaista`);
  }
});

test('hieroglyfiluvut pysyvät piirtorajoissa ja vastaus on oikein', () => {
  const p = packById('africa').puzzles.find((x) => x.id === 'hieroglyfit');
  for (let seed = 1; seed <= 100; seed++) {
    const { sketch, options, correct } = p.generate(seedRng(seed));
    const rivit = [...sketch.esimerkit, sketch.kysytty];
    for (const r of rivit) {
      assert.equal(r.length, 3);
      for (const n of r) {
        assert.ok(Number.isInteger(n) && n >= 0 && n <= 3, `siemen ${seed}: numero ${n} rajojen ulkoa`);
      }
    }
    // Oikea vastaus on kysytyn rivin lukuarvo.
    assert.equal(
      options[correct], String(arvoksi(sketch.kysytty)),
      `siemen ${seed}: oikea vastaus ei vastaa piirrosta`,
    );
    // Kysytty luku ei saa olla sama kuin mikään esimerkki.
    for (const e of sketch.esimerkit) {
      assert.notEqual(arvoksi(e), arvoksi(sketch.kysytty), `siemen ${seed}: kysytty on esimerkki`);
    }
  }
});

test('vaaka on tasapainossa vain oikealla vastauksella', () => {
  const p = packById('africa').puzzles.find((x) => x.id === 'punnukset');
  for (let seed = 1; seed <= 100; seed++) {
    const { sketch, options, correct } = p.generate(seedRng(seed));
    const vasenPuoli = sketch.kulta + sketch.vasen;
    const oikeaPuoli = sketch.oikea[0] + sketch.oikea[1];
    // Täsmälleen yksi vaihtoehto tasapainottaa vaa'an.
    const osuvat = options.filter((o) => oikeaPuoli + Number(o) === vasenPuoli);
    assert.equal(osuvat.length, 1, `siemen ${seed}: ${osuvat.length} vaihtoehtoa tasapainottaa`);
    assert.equal(options[correct], osuvat[0], `siemen ${seed}: väärä vaihtoehto merkitty oikeaksi`);
  }
});

/**
 * Simuloi leilipulman toimintosarjan. Palauttaa suurimman mitan, joka
 * jompaankumpaan leiliin jää — sarja on oikein, jos tavoite löytyy.
 */
function ajaLeilit(sarja) {
  let a = 0; // 3 mittaa
  let b = 0; // 5 mittaa
  const nahdyt = [];
  for (const askel of sarja.split(',').map((s) => s.trim().toLowerCase())) {
    if (askel === 'täytä 3') a = 3;
    else if (askel === 'täytä 5') b = 5;
    else if (askel === 'tyhjennä 3') a = 0;
    else if (askel === 'tyhjennä 5' || askel === 'kaada 5 pois') b = 0;
    else if (askel === 'kaada 5:een' || askel === 'kaada loput viitoseen'
      || askel === 'kaada 3 viitoseen' || askel === 'kaada 5 täyteen') {
      const siirto = Math.min(a, 5 - b);
      a -= siirto; b += siirto;
    } else if (askel === 'kaada 3 täyteen' || askel === 'kaada loput 3:een') {
      const siirto = Math.min(b, 3 - a);
      b -= siirto; a += siirto;
    } else {
      throw new Error(`tuntematon askel: "${askel}"`);
    }
    nahdyt.push([a, b]);
  }
  return { a, b, nahdyt };
}

test('leilipulman oikea sarja tuottaa tavoitteen eivätkä väärät', () => {
  const p = packById('africa').puzzles.find((x) => x.id === 'vesileilit');
  const testatut = new Set();
  for (let seed = 1; seed <= 60; seed++) {
    const { sketch, options, correct } = p.generate(seedRng(seed));
    if (testatut.has(sketch.tavoite)) continue;
    testatut.add(sketch.tavoite);

    const oikea = ajaLeilit(options[correct]);
    assert.ok(
      oikea.a === sketch.tavoite || oikea.b === sketch.tavoite,
      `tavoite ${sketch.tavoite}: oikea sarja päätyi (${oikea.a},${oikea.b})`,
    );
    for (const [i, o] of options.entries()) {
      if (i === correct) continue;
      const v = ajaLeilit(o);
      assert.ok(
        v.a !== sketch.tavoite && v.b !== sketch.tavoite,
        `tavoite ${sketch.tavoite}: väärä sarja "${o}" tuottikin tavoitteen`,
      );
    }
  }
  assert.ok(testatut.size >= 2, 'leilipulmasta löytyi vain yksi tavoite');
});

test('kuunvaiheiden sarja jatkuu oikein', () => {
  const p = packById('africa').puzzles.find((x) => x.id === 'kuunvaiheet');
  for (let seed = 1; seed <= 100; seed++) {
    const { sketch, options, correct } = p.generate(seedRng(seed));
    assert.equal(sketch.sarja.length, 3);
    for (const k of sketch.sarja) {
      assert.ok(k.v >= 0 && k.v <= 1, `siemen ${seed}: valaistus ${k.v} rajojen ulkoa`);
    }
    // Sarja etenee aina eteenpäin kuun kierrossa, joten piirretyn sarjan ja
    // oikean vastauksen on löydyttävä KUUT-taulukosta peräkkäisinä.
    const nimet = [
      'uusikuu', 'kasvava sirppi', 'ensimmäinen neljännes', 'kasvava kupera kuu',
      'täysikuu', 'vähenevä kupera kuu', 'viimeinen neljännes', 'vähenevä sirppi',
    ];
    const vaiheet = [
      { v: 0, peilaa: false }, { v: 0.18, peilaa: false }, { v: 0.5, peilaa: false },
      { v: 0.82, peilaa: false }, { v: 1, peilaa: false }, { v: 0.82, peilaa: true },
      { v: 0.5, peilaa: true }, { v: 0.18, peilaa: true },
    ];
    const alku = vaiheet.findIndex(
      (x, i) => [0, 1, 2].every((j) => {
        const odotus = vaiheet[(i + j) % 8];
        return sketch.sarja[j].v === odotus.v && sketch.sarja[j].peilaa === odotus.peilaa;
      }),
    );
    assert.ok(alku >= 0, `siemen ${seed}: sarja ei vastaa kuun kiertoa`);
    assert.equal(
      options[correct], nimet[(alku + 3) % 8],
      `siemen ${seed}: vastaus ei jatka sarjaa`,
    );
  }
});

// --- paketti 14: lentorepliikit --------------------------------------------

test('lentorepliikit ovat ehjiä ja kohdistuvat laudan kaupunkeihin', () => {
  for (const pack of PACKS) {
    const rivit = pack.texts?.flightLines;
    if (!rivit) continue;
    const idt = new Set(pack.cities.map((c) => c.id));
    for (const [cityId, lista] of Object.entries(rivit)) {
      assert.ok(idt.has(cityId), `${pack.id}: flightLines viittaa kaupunkiin ${cityId}, jota ei ole laudalla`);
      assert.ok(Array.isArray(lista) && lista.length > 0, `${pack.id}/${cityId}: tyhjä rivilista`);
      for (const rivi of lista) {
        assert.equal(typeof rivi, 'string');
        assert.ok(rivi.length > 20, `${pack.id}/${cityId}: liian lyhyt rivi "${rivi}"`);
      }
    }
    // Sama rivi ei saa esiintyä kahdesti koko laudalla.
    const kaikki = [
      ...Object.values(rivit).flat(),
      ...(pack.texts.flightDefault ?? []),
      ...(pack.texts.flightFirst ?? []),
    ];
    assert.equal(new Set(kaikki).size, kaikki.length, `${pack.id}: sama lentorepliikki kahdesti`);
  }
});

test('ensimmäinen lento hehkuttaa aina matkakirjaa', () => {
  const rivit = packById('maailma').texts.flightFirst;
  // Avausrepliikki on lukittu yhteen riviin, koska sille on tuotettu
  // lukuääni — tekstin ja puheen on pysyttävä samana.
  assert.ok(Array.isArray(rivit) && rivit.length === 1, 'avausrepliikkejä pitää olla täsmälleen yksi');
  for (const rivi of rivit) {
    assert.ok(rivi.length > 20, `liian lyhyt rivi "${rivi}"`);
    assert.ok(/kirja|sivu/i.test(rivi), `rivi ei puhu matkakirjasta: "${rivi}"`);
  }
  // Arvonta poimii aina flightFirst-pakasta, kun se on olemassa.
  const game = new Game({ players: [{ name: 'A', color: '#f00' }], pack: packById('maailma'), seed: 9 });
  for (let i = 0; i < 5; i++) {
    assert.ok(rivit.includes(game.firstFlightLine('tanger')));
  }
});

test('jokaiselle lentokohteelle löytyy repliikki', () => {
  for (const pack of PACKS) {
    if (!pack.texts?.flightLines) continue;
    const game = new Game({ players: [{ name: 'A', color: '#f00' }], pack, seed: 1 });
    // Lentokentät ovat lennon kohteita; niille pitää löytyä rivi omista tai
    // yleisistä. Yleisrivit riittävät, mutta jonkin on löydyttävä.
    for (const city of pack.cities.filter((c) => c.airport)) {
      assert.ok(
        game.flightLine(city.id),
        `${pack.id}: kaupungille ${city.id} ei löydy lentorepliikkiä`,
      );
    }
  }
});

test('lentorepliikin arvonta on siemenellä deterministinen', () => {
  const uusi = (seed) => new Game({
    players: [{ name: 'A', color: '#f00' }], pack: packById('maailma'), seed,
  });
  const a = uusi(77).flightLine('kairo');
  const b = uusi(77).flightLine('kairo');
  assert.equal(a, b, 'sama siemen antoi eri repliikin');
  assert.ok(packById('maailma').texts.flightLines.kairo.includes(a));

  // Eri siemenet tuottavat vaihtelua.
  const nahdyt = new Set();
  for (let seed = 1; seed <= 20; seed++) nahdyt.add(uusi(seed).flightLine('kairo'));
  assert.ok(nahdyt.size >= 2, 'arvonta ei varioi');
});

test('tuntematon kohde saa yleisrivin', () => {
  const game = new Game({
    players: [{ name: 'A', color: '#f00' }], pack: packById('maailma'), seed: 3,
  });
  const rivi = game.flightLine('ei-tallaista-kaupunkia');
  assert.ok(packById('maailma').texts.flightDefault.includes(rivi));
});

test('lauta ilman lentorepliikkejä ei kaadu', () => {
  const pack = packById('suomi');
  const game = new Game({ players: [{ name: 'A', color: '#f00' }], pack, seed: 5 });
  if (!pack.texts?.flightLines && !pack.texts?.flightDefault) {
    assert.equal(game.flightLine('helsinki'), null);
  }
});

// --- paketti 15: faktakorjaukset eivät saa palautua ------------------------
//
// Lentorepliikit kirjoitettiin uusiksi tunnelatausta varten (paketti 15).
// Nämä neljä faktaa korjattiin verkkotarkistuksen jälkeen paketissa 14, ja
// juuri sisällön uudelleenkirjoitus on se hetki, jossa ne voisivat livahtaa
// takaisin. Testi vartioi väitettä, ei sanamuotoa.

/** Kaikki laudan lentorepliikit yhtenä pötkönä pienaakkosin. */
function flightText(packId) {
  const pack = packById(packId);
  return [
    ...Object.values(pack.texts?.flightLines ?? {}).flat(),
    ...(pack.texts?.flightDefault ?? []),
  ].join(' \n ').toLowerCase();
}

test('Kapkaupungin rivi ei väitä valtamerten kohtaavan siellä', () => {
  const teksti = flightText('maailma');
  // Atlantin ja Intian valtameren raja on Agulhasniemellä, reilut 150 km
  // kaakkoon, eikä näkyvää värirajaa ole — se on turistitarina.
  const kaksiValtamerta = /(kaksi valtamerta|kaksi merta)[^.]*kohtaa|atlantti[^.]*intian valtameri[^.]*kohtaa/;
  assert.ok(!kaksiValtamerta.test(teksti), 'rivi väittää valtamerten kohtaavan Kapkaupungin kohdalla');
  assert.ok(
    !/vesi vaihtaa väriä|väriraja/.test(teksti),
    'rivi väittää veden vaihtavan väriä valtamerten rajalla',
  );
});

test('Mumbain silta kaartaa eikä ole suora', () => {
  const rivit = packById('maailma').texts.flightLines.mumbai.join(' ').toLowerCase();
  if (rivit.includes('silta') || rivit.includes('sea link')) {
    assert.ok(!/silta suorana|suorana valkoisena|suora silta/.test(rivit),
      'Bandra–Worli Sea Link on kaartuva vinoköysisilta, ei suora');
  }
});

test('isoisän Atlantin ylitys ei ole yhtätoista päivää', () => {
  const teksti = flightText('maailma');
  // 1870-luvun tyypillinen höyrylaivaylitys oli 8–9 vuorokautta.
  assert.ok(
    !/yhdessätoista päivässä|yksitoista päivää|11 päivä/.test(teksti),
    'Atlantin ylitys 1870-luvulla kesti tyypillisesti 8–9 vrk, ei yhtätoista',
  );
});

test('Fuji näkyy lounaassa eikä lännessä', () => {
  const rivit = packById('maailma').texts.flightLines.tokio.join(' ').toLowerCase();
  if (/kartio|fuji|lumihuippu/.test(rivit)) {
    assert.ok(!/lännessä kohoaa|lännessä siintää/.test(rivit),
      'Fuji on Tokiosta lounaaseen (suuntima n. 249°), ei länteen');
  }
});

test('päiväkirja aukeaa napauttamalla ja kutistuu kartan napautuksesta', () => {
  // Toteutus on kolmessa paikassa: napautus kortissa, kutistus kartalla
  // ja tyyli. Jos yksikin katoaa, merkintä jää joko auki kartan päälle
  // tai takaisin viiden rivin vierityslaatikoksi.
  const ui = readFileSync(new URL('../js/ui.js', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
  assert.match(ui, /factTekstiRivi\?\.addEventListener\('click'/,
    'päiväkirjan napautus puuttuu');
  assert.match(ui, /mapPane\.addEventListener\('click', \(\) => this\.kutistaPaivakirja\(\)\)/,
    'kartan napautus ei kutista päiväkirjaa');
  // Uusi merkintä alkaa aina pienestä ikkunasta: avain vaihdetaan vain
  // uusiFactKey-metodissa, joka kutistaa kortin samalla.
  assert.equal((ui.match(/this\.factKey = key;/g) ?? []).length, 1,
    'factKey asetetaan uusiFactKeyn ohi, jolloin kortti jäisi auki');
  assert.match(css, /\.fact-card\.laajennettu[\s\S]{0,200}max-height/,
    'laajennetun kortin korkeusrajaa ei ole');
  // Katto on oltava: ilman sitä pitkä merkintä peittäisi koko kartan,
  // eikä pelaaja näkisi mihin napauttaa kutistaakseen sen.
  const katto = css.match(/body\[data-mode\] \.fact-card\.laajennettu \{[^}]*\}/)?.[0] ?? '';
  assert.match(katto, /max-height: 7\d(vh|dvh)/, `katto puuttuu: ${katto}`);
});

test('kartta ulottuu ruudun alareunaan asti', () => {
  // iPhonella alakehys varasi turva-alueen verran tilaa, ja kartta
  // loppui 85 pistettä ennen ruudun alareunaa (mitattu omistajan
  // kuvakaappauksesta). Kartta jatkuu nyt kotipalkin alle; kelluvat
  // kortit pysyvät turva-alueen yläpuolella omilla säännöillään.
  const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
  const stage = css.match(/body\[data-mode\] \.stage \{[^}]*padding-bottom[^}]*\}/)?.[0] ?? '';
  assert.ok(stage, 'stagen alareunan sääntöä ei löytynyt');
  assert.doesNotMatch(stage, /safe-area-inset-bottom/,
    `kartan alle varataan taas turva-alue: ${stage}`);
  // Myöskään kelluvat kortit eivät varaa turva-aluetta. Kehittäjätilan
  // mittarivi paljasti asennetusta sovelluksesta, että selain saa
  // käyttöönsä 812 pistettä 874:n ruudulla: kotipalkin kaista jää
  // kokonaan sovelluksen alueen ulkopuolelle, joten varaus oli saman
  // tilan laskemista kahdesti. Kiinteä rako jää silti aina.
  const rail = css.match(/body\[data-mode\] \.rail \{\s*bottom:[^}]*\}/)?.[0] ?? '';
  assert.ok(rail, 'kelluvien korttien alareunan sääntöä ei löytynyt');
  assert.doesNotMatch(rail, /safe-area-inset-bottom/,
    `kortit varaavat taas turva-alueen: ${rail}`);
  assert.match(rail, /calc\(var\(--gap\)/,
    'korttien ja alareunan väliin pitää jäädä rako');
});

test('toimintonappien alta ei vaalenneta karttaa', () => {
  // Lähikuvassa korttien alle piirrettiin pehmeä pergamenttivalo, jotta
  // teksti erottuu kartalta. Nappien kohdalla se haalisti alalaidan,
  // jossa on eniten katsottavaa (omistajan havainto). Napeilla on oma
  // levynsä ja tekstillä sama vaalea varjo kuin kartan nimissä.
  const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
  assert.doesNotMatch(css, /body\.manner-zoom \.turn-card::before/,
    'nappien alle piirretään taas vaalennus');
  // Päiväkirjakortti pitää omansa: pitkä leipäteksti ei olisi luettavaa
  // pelkän varjon turvin.
  assert.match(css, /body\.manner-zoom \.fact-card::before/,
    'päiväkirjan taustavalo katosi');
});

test('päiväkirjan vinjetti ei haalista kartan alalaitaa', () => {
  // Alalaidassa on eniten kaupunkeja ja nimiä, ja kelluvat napit
  // istuvat juuri sen päällä: siellä vaalea vinjetti näytti
  // haalistumalta eikä filmiltä (omistajan toive). Muut reunat
  // säilyvät, joten peite häivytetään pois vain alhaalta.
  const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
  // Rivin alkuun ankkuroitu: zoomauksen aikainen sammutussääntö
  // (body.kiikari-paalla .map-pane::after) osuisi muuten ensin.
  const vinjetti = css.match(/^\.map-pane::after \{[^}]*\}/m)?.[0] ?? '';
  assert.ok(vinjetti, 'vinjetin sääntöä ei löytynyt');
  // Reunaliu'ut eivät piirrä alalaitaan mitään. Soikio piirtäisi, ja
  // sen peittäminen maskilla näytti oikealta Chromiumissa mutta jätti
  // alalaidan vaaleaksi iPhonella.
  assert.doesNotMatch(vinjetti, /radial-gradient/,
    'soikea vinjetti haalistaisi taas alalaidan');
  assert.doesNotMatch(vinjetti, /to top/,
    'alhaalta ylös nouseva liuku osuisi juuri alalaitaan');
  for (const suunta of ['to bottom', 'to right', 'to left']) {
    assert.ok(vinjetti.includes(suunta), `reunaliuku puuttuu: ${suunta}`);
  }
});

test('kehittäjän siirto vie kaupunkiin kuluttamatta peliä', () => {
  // Omistajan toive: sisältöä pitää päästä katsomaan ilman pelaamista.
  // Oikotie ei siksi saa syödä rahaa, päiviä eikä vuoroja — muuten sillä
  // ei voisi selata kaupunkeja peräkkäin.
  const game = newGame();
  const pelaaja = game.player;
  const rahaEnnen = pelaaja.money;
  const vuoroEnnen = game.current;
  const paivaEnnen = game.turnCount;

  const tulos = game.actionKehittajaSiirto('kumasi');
  assert.equal(tulos.ok, true);
  assert.deepEqual(pelaaja.pos, { type: 'city', city: 'kumasi' });
  assert.equal(pelaaja.money, rahaEnnen, 'oikotie ei saa maksaa');
  assert.equal(game.current, vuoroEnnen, 'vuoro ei saa vaihtua');
  assert.equal(game.turnCount, paivaEnnen, 'päivä ei saa kulua');
  assert.equal(game.phase, 'action', 'kaupungissa pitää voida heti toimia');
  assert.equal(game.die, null, 'vanha noppa ei saa jäädä voimaan');
  // Saapumishavainto ohjaa päiväkirjakortin: ilman sitä kortti näyttäisi
  // edellisen kaupungin tekstiä.
  assert.equal(game.arrivalFact?.cityId, 'kumasi');

  // Peräkkäiset hypyt toimivat.
  game.actionKehittajaSiirto('tanger');
  assert.equal(pelaaja.pos.city, 'tanger');
  assert.equal(game.actionKehittajaSiirto('ei-olemassa').ok, false);
});

test('kehittäjätila on salasanan takana ja pois päältä oletuksena', () => {
  const main = readFileSync(new URL('../js/main.js', import.meta.url), 'utf8');
  const ui = readFileSync(new URL('../js/ui.js', import.meta.url), 'utf8');
  // Salasana on kevyt lukko: se estää vahingossa avaamisen. Jos tarkistus
  // katoaa, tila aukeaa yhdellä napautuksella kenen tahansa käsissä.
  assert.match(main, /KEHITTAJA_SALASANA = '5545'/, 'salasana puuttuu');
  assert.match(main, /kehittajaSalasana\.value\.trim\(\) !== KEHITTAJA_SALASANA/,
    'salasanaa ei tarkisteta');
  // Oletus on pois päältä: tila kytkeytyy vain, kun se on nimenomaan
  // tallennettu — puuttuva arvo ei saa tarkoittaa päällä.
  assert.match(ui, /localStorage\.getItem\(KEHITTAJA_AVAIN\) === '1'/,
    'kehittäjätilan oletus ei ole pois päältä');
});
