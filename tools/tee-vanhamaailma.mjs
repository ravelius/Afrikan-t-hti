/*
 * Kokoaa vanhan maailman pakettitiedoston js/packs/vanhamaailma.js.
 *
 *   NE_LAND=ne_10m_land.geojson node tools/tee-vanhamaailma.mjs
 *
 * Tämä on yhdistämisen viimeinen vaihe: aiemmat työkalut laskivat
 * projektion, rannikot, kaupungit, reitit ja nimien paikat — tämä
 * kirjoittaa niistä paketin, jonka peli osaa piirtää.
 *
 * --- mitä EI kopioida ---
 *
 * Paketti TUO sisällön neljästä vanhasta paketista eikä monista sitä.
 * Kysymykset, tiedot, pulmat ja kaksintaistelut ovat satoja kilotavuja,
 * ja kopio vanhenisi heti: korjaus vanhaan kysymykseen ei näkyisi
 * yhdistetyllä kartalla. Tuonnilla sisältö pysyy yhdessä paikassa ja
 * korjaukset kulkevat automaattisesti molempiin.
 *
 * Generoituna kirjoitetaan vain se, mitä ei voi tuoda: geometria.
 * Rannikot, kaupunkien x/y ja nimien paikat ovat uuden projektion
 * tulosta eivätkä ole olemassa missään vanhassa paketissa.
 *
 * --- mikä jää tekemättä ---
 *
 * Peli osaa piirtää tämän laudan ja siinä voi liikkua, mutta neljän
 * aarteen logiikkaa (yksi per maanosa) EI ole: token-järjestelmässä on
 * yksi tähti. Sama koskee Lontooseen palaamista ja kahdeksankymmenen
 * päivän rajaa. Ne ovat pelilogiikkaa, eivät karttaa, ja odottavat
 * omaa pakettiaan.
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { miller, sovita, rannikot, kaupungit, reitit, lahdepaketit } from './vanha-maailma.mjs';
import { sijoita } from './nimien-paikat.mjs';
import { vesiruudukko, meripolku } from './merireitit.mjs';
import { isOnLand } from '../js/mapart.js';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const LAUDAT = ['europe', 'africa', 'middleeast', 'asia'];

/** Numero lyhyeksi: 1234.0 -> 1234, 1234.5 -> 1234.5 */
const luku = (n) => Number(n.toFixed(1));

const geo = JSON.parse(readFileSync(process.env.NE_LAND ?? 'ne_10m_land.geojson', 'utf8'));
// Lähdepaketit suoraan, EI js/pack.js:n rekisteriä: rekisteri lataa myös
// vanhamaailma.js:n, joka on tämän työkalun oma tuotos. Jos se on rikki
// tai puuttuu, työkalu ei käynnistyisi korjaamaan sitä.
const PACKS = await lahdepaketit();

const { kaupungit: kaup } = await kaupungit();
const tiet = await reitit();

/*
 * Laudan leveys yksikköinä.
 *
 * 4000 oli liian ahdas: Istanbul ja Izmir jäivät 55 yksikön päähän, kun
 * peli vaatii 60 (minCityDistance). Ensimmäinen yritys pudotti liian
 * lähekkäiset pois, mutta se olisi vienyt 18 kaupunkia sisältöineen —
 * Prahan, Budapestin, Mekan, Riikan ja muut. Se on liian kova hinta.
 *
 * Kartta on vektori, joten isompi koordinaatisto ei maksa mitään: se
 * vain levittää kaupungit kauemmas toisistaan. 6000 antaa Istanbulin ja
 * Izmirin väliin reilusti yli vaaditun. Omistajan linjaus tukee tätä: mittasuhteet
 * pidetään realistisina, koska zoomi hoitaa koon.
 */
const LEVEYS = 7200;

const lonit = kaup.map((c) => c.lon);
const latit = kaup.map((c) => c.lat);
// Kaupunkien sijainnit annetaan pakollisina: saari, jolla on kaupunki,
// säilyy vaikka olisi kuinka pieni. Ilman tätä St. Helena, Sansibar ja
// Sisilia jäivät ilman maata allaan.
const viivat = rannikot(geo, {
  lon0: Math.min(...lonit) - 12, lon1: Math.max(...lonit) + 12,
  lat0: Math.min(...latit) - 10, lat1: Math.max(...latit) + 10,
}, { pakolliset: kaup.map((c) => [c.lon, c.lat]) });
const { muunna, korkeus } = sovita([...viivat, kaup.map((c) => miller.eteen(c.lon, c.lat))], { leveys: LEVEYS });

// --- kaupungit ----------------------------------------------------------------
//
// Kaupungin muut tiedot (wiki, ambienssi, lentokenttä) tulevat siitä
// paketista, josta kaupunki on peräisin. Vain paikka on uusi.

const lahdeKaupunki = new Map();
for (const id of LAUDAT) {
  for (const c of PACKS.find((p) => p.id === id).cities) {
    if (!lahdeKaupunki.has(c.id)) lahdeKaupunki.set(c.id, c);
  }
}

const ALKUKARTTA = { outlines: viivat.map((v) => v.map(muunna)) };

/*
 * Rannikkokaupunki osuu helposti muutaman yksikön verran veden puolelle:
 * satama ON rannalla, ja tarkka rannikkoviiva kulkee sen läpi. Peli
 * kuitenkin vaatii kaupungin olevan maalla — muuten laatta näyttää
 * kelluvan. Siirretään lähimpään maakohtaan, korkeintaan sen verran
 * ettei kaupunki karkaa paikaltaan.
 */
function maalle([x, y]) {
  if (isOnLand([x, y], ALKUKARTTA)) return [x, y];
  for (let sade = 4; sade <= 40; sade += 4) {
    for (let a = 0; a < 24; a++) {
      const kulma = (a / 24) * Math.PI * 2;
      const nx = x + Math.cos(kulma) * sade;
      const ny = y + Math.sin(kulma) * sade;
      if (isOnLand([nx, ny], ALKUKARTTA)) return [nx, ny];
    }
  }
  return [x, y];
}

let siirretty = 0;
const kaikkiPisteet = kaup.map((c) => {
  const alkuperainen = muunna(miller.eteen(c.lon, c.lat));
  const [x, y] = maalle(alkuperainen);
  if (x !== alkuperainen[0] || y !== alkuperainen[1]) siirretty += 1;
  return { ...c, x: luku(x), y: luku(y) };
});

/*
 * Liian lähekkäiset kaupungit.
 *
 * Vanhoilla laudoilla mittakaavat olivat eri, joten Istanbul (Euroopan
 * laudalta) ja Izmir (Lähi-idän laudalta) mahtuivat kumpikin omilleen.
 * Yhteisellä kartalla ne ovat 55 yksikön päässä toisistaan, ja peli
 * vaatii MIN_ETAISYYS-verran — muuten laattoja ei voi napauttaa erikseen.
 *
 * Ratkaisu on pudottaa myöhempi pois eikä siirtää: siirtäminen veisi
 * kaupungin väärään paikkaan kartalla, ja se on pahempi virhe
 * opetuspelissä kuin yksi kaupunki vähemmän.
 */
const MIN_ETAISYYS = 60;
const pisteet = [];
const pudotetut = [];
for (const c of kaikkiPisteet) {
  const liianLahella = pisteet.find(
    (o) => Math.hypot(o.x - c.x, o.y - c.y) < MIN_ETAISYYS,
  );
  if (liianLahella) { pudotetut.push([c.nimi, liianLahella.nimi]); continue; }
  pisteet.push(c);
}

// Nimien paikat samalla hakualgoritmilla kuin esikatselussa.
const janat = [];
const paikkaKartta = new Map(pisteet.map((c) => [c.id, c]));
for (const t of tiet) {
  const a = paikkaKartta.get(t.a);
  const b = paikkaKartta.get(t.b);
  if (!a || !b) continue;
  const kohdat = [a, ...(t.via ?? []).map((p) => {
    const [x, y] = muunna(miller.eteen(p[0], p[1]));
    return { x, y };
  }), b];
  for (let i = 1; i < kohdat.length; i++) janat.push([kohdat[i - 1], kohdat[i]]);
}

const { avaaSelain } = await import('./mittaa-selaimessa.mjs');
const { sivu, sulje } = await avaaSelain();
const mitat = await sivu.evaluate((nimet) => {
  const kangas = document.createElement('canvas').getContext('2d');
  const ulos = {};
  for (const [id, nimi] of Object.entries(nimet)) {
    kangas.font = '600 18px "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif';
    ulos[id] = kangas.measureText(nimi).width + 0.04 * 18 * nimi.length;
  }
  return ulos;
}, Object.fromEntries(pisteet.map((c) => [c.id, c.nimi])));
await sulje();
const { paikat: nimiPaikat, pulmat } = sijoita(pisteet, new Map(Object.entries(mitat)), janat);

/*
 * Aloituskaupungit peritään vanhoilta laudoilta.
 *
 * Omistajan tavoite on, että matka alkaa ja päättyy Lontoossa. Sitä ei
 * voi toteuttaa vielä täällä: nykyinen moottori antaa jokaisen pelaajan
 * VALITA aloituskaupungin, ja yhden vaihtoehdon lista tekisi
 * moninpelistä mahdottoman (rules.test.mjs vaatii vähintään kaksi).
 *
 * Lontoo-lähtö kuuluu samaan pakettiin kuin kahdeksankymmenen päivän
 * raja ja neljä aarretta — se on pelilogiikkaa, ei karttaa. Siihen asti
 * lauta on pelattavissa nykyisillä säännöillä.
 */
/*
 * Kaupungit, joihin maailmankartalta laskeudutaan. Lista on sama kuin
 * maailma.js:n porteissa, ja se koskee vain vanhan maailman aluetta —
 * New York, Rio, Sydney ja Los Angeles vievät yhä omille laudoilleen.
 */
const MAAILMAN_PORTIT = new Set([
  'lontoo', 'kairo', 'mumbai', 'peking', 'tokio', 'singapore',
  'moskova', 'ateena', 'kapkaupunki', 'tanger',
]);

const cities = pisteet.map((c) => {
  const lahde = lahdeKaupunki.get(c.id) ?? {};
  const p = nimiPaikat.get(c.id);
  const rivi = {
    id: c.id,
    name: c.nimi,
    ...(lahde.wiki ? { wiki: lahde.wiki } : {}),
    ...(lahde.ambience ? { ambience: lahde.ambience } : {}),
    x: c.x,
    y: c.y,
    ...(lahde.start ? { start: true } : {}),
    // Portit maailmankartalle. Linkin pitää olla vastavuoroinen: jos
    // maailmankartalta pääsee tänne, tästä pitää päästä takaisin. Testi
    // vartioi sitä, ja ilman paluulinkkiä pelaaja jäisi laudalle.
    ...(MAAILMAN_PORTIT.has(c.id)
      ? { links: [{ pack: 'maailma', city: c.id, label: 'Maailmankartta' }] } : {}),
    ...(lahde.airport || lahde.start ? { airport: true } : {}),
    la: p.la,
    lx: p.lx,
    ly: p.ly,
  };
  return rivi;
});

// --- reitit --------------------------------------------------------------------

/*
 * Merireitit lasketaan uudelleen veden kautta. Vanhat välipisteet on
 * mitoitettu pelkistetylle rannikolle, ja tarkalla rannikolla samat
 * suorat oikaisevat maan yli: ensimmäisessä ajossa 50 merireittiä
 * 54:stä kulki maalla. Tukholmasta ei pääse suoraan Helsinkiin.
 */
const ruudukko = vesiruudukko(ALKUKARTTA, LEVEYS, korkeus, isOnLand);
const paikkaId = new Map(pisteet.map((c) => [c.id, c]));
let reititetty = 0;
let epaonnistui = 0;

const edges = tiet.map((t) => {
  const perus = {
    a: t.a,
    b: t.b,
    ...(t.tyyppi && t.tyyppi !== 'land' ? { type: t.tyyppi } : {}),
    steps: t.askeleet ?? 3,
  };
  if (t.tyyppi !== 'sea') {
    // Maareitit menevät suoraan kuten ennenkin; vanhat välipisteet
    // projisoidaan mukaan jos niitä on.
    if (!t.via?.length) return perus;
    return {
      ...perus,
      via: t.via.map((p) => {
        const [x, y] = muunna(miller.eteen(p[0], p[1]));
        return [Math.round(x), Math.round(y)];
      }),
    };
  }
  const a = paikkaId.get(t.a);
  const b = paikkaId.get(t.b);
  if (!a || !b) return perus;
  const polku = meripolku(ruudukko, a, b, isOnLand, ALKUKARTTA);
  if (polku === null) { epaonnistui += 1; return perus; }
  if (!polku.length) return perus;
  reititetty += 1;
  return { ...perus, via: polku };
});

// --- saaret --------------------------------------------------------------------
//
// Saari on kaupunki, johon pääsee vain laivalla. Se ei ole erikseen
// merkittävä tieto: sen näkee reiteistä.
const islands = pisteet
  .filter((c) => {
    const omat = edges.filter((e) => e.a === c.id || e.b === c.id);
    return omat.length > 0 && omat.every((e) => e.type === 'sea');
  })
  .map((c) => c.id);

/*
 * Laattamäärä. Peli vaatii tarkalleen yhtä monta laattaa kuin on
 * kaupunkeja, joissa laatta on — eli kaikkia paitsi aloituskaupunkeja.
 * Suhteet on otettu Euroopan laudalta ja skaalattu; tähtiä on yksi.
 *
 * HUOM: neljän aarteen logiikka (yksi per maanosa) puuttuu yhä. Tässä
 * on yksi tähti kuten muillakin laudoilla.
 */
const laattaKaupunkeja = cities.filter((c) => !c.start).length;
const OSUUDET = { horseshoe: 0.05, robber: 0.08, ruby: 0.13, emerald: 0.16, topaz: 0.21 };
const counts = { star: 1 };
let jaljella = laattaKaupunkeja - 1;
for (const [laji, osuus] of Object.entries(OSUUDET)) {
  counts[laji] = Math.round(laattaKaupunkeja * osuus);
  jaljella -= counts[laji];
}
// Loput tyhjiä. Omistajan linjaus on, että osa tyhjistä muuttuu
// varusteiksi myöhemmin — siihen asti ne ovat tyhjiä kuten ennenkin.
counts.empty = jaljella;

// --- tiedosto ------------------------------------------------------------------

const pisteLista = (pts, sisennys = '    ') => {
  const rivit = [];
  for (let i = 0; i < pts.length; i += 6) {
    rivit.push(sisennys + pts.slice(i, i + 6)
      .map(([x, y]) => `[${luku(x)}, ${luku(y)}]`).join(', ') + ',');
  }
  return rivit.join('\n');
};

const outlines = ALKUKARTTA.outlines;

const teksti = `// Vanha maailma: Eurooppa, Afrikka, Lähi-itä ja Aasia yhtenä karttana.
//
// TÄMÄ TIEDOSTO ON KONEEN KIRJOITTAMA. Älä muokkaa käsin —
// aja \`node tools/tee-vanhamaailma.mjs\` uudelleen.
//
// Koordinaatisto on ${LEVEYS} x ${korkeus} yksikköä Millerin
// lieriöprojektiossa. Miller valittiin, koska alue ulottuu
// Kapkaupungista (-34°) Tromssaan (+70°): kartioprojektio ei kata
// kumpaakin pallonpuoliskoa, yksinkertainen lieriö venyttäisi
// Skandinavian levälleen ja Mercator paisuttaisi Lapin mahdottomaksi.
//
// Rannikot ovat Natural Earthin 10m-aineistoa (public domain),
// karsittuna Ramer-Douglas-Peuckerilla niin että niemet ja lahdet
// säilyvät. Kaupunkien paikat on käännetty vanhojen lautojen
// koordinaateista takaisin leveys- ja pituusasteiksi ja projisoitu
// uudelleen; nimien paikat on laskettu törmäyshaulla.
//
// SISÄLTÖÄ EI KOPIOIDA. Kysymykset, tiedot, pulmat ja kaksintaistelut
// tuodaan neljästä vanhasta paketista, jotta korjaus vanhaan
// kysymykseen näkyy myös täällä eikä sisältö pääse eriytymään.

import { EUROPE } from './europe.js';
import { AFRICA } from './africa.js';
import { MIDDLE_EAST } from './middleeast.js';
import { ASIA } from './asia.js';
import { themedTokenTypes } from '../tokens.js';

const LAHTEET = [EUROPE, AFRICA, MIDDLE_EAST, ASIA];

/*
 * Yhdistää neljän paketin kysymyskorit lajeittain.
 *
 * Kaksoiskappaleet karsitaan kysymystekstin perusteella KAIKKIEN lajien
 * yli, ei lajin sisällä. Porttikaupunkien (Istanbul, Kairo, Teheran)
 * kysymyksiä on kahdella laudalla, ja lisäksi sama kysymys voi olla
 * yhden laudan yleiskorissa ja toisen kaupunkikorissa — niin kävi
 * Iranin viralliselle kielelle, joka oli sekä generalissa että
 * teheranissa. Sama kysymys kahdesti tarkoittaisi, että pelaaja voi
 * saada sen kaksi kertaa peräkkäin.
 *
 * Kaupunkikori voittaa yleiskorin: kysymys on arvokkaampi siellä, missä
 * se liittyy paikkaan jossa ollaan.
 */
function yhdistaKysymykset() {
  const ulos = {};
  const nahdyt = new Set();
  const lisaa = (laji, lista) => {
    const kori = (ulos[laji] ??= []);
    for (const kysymys of lista) {
      const avain = kysymys.q ?? kysymys.text ?? JSON.stringify(kysymys);
      if (nahdyt.has(avain)) continue;
      nahdyt.add(avain);
      kori.push(kysymys);
    }
  };
  // Kaupunkikorit ensin, yleiskori vasta perään.
  for (const pack of LAHTEET) {
    for (const [laji, lista] of Object.entries(pack.questions ?? {})) {
      if (laji === 'general') continue;
      lisaa(laji, lista);
    }
  }
  for (const pack of LAHTEET) lisaa('general', pack.questions?.general ?? []);
  return ulos;
}

/** Poistaa kaksoiskappaleet kysymystekstin perusteella. */
function yksilolliset(lista) {
  const nahdyt = new Set();
  return lista.filter((x) => {
    const avain = x.q ?? x.text ?? JSON.stringify(x);
    if (nahdyt.has(avain)) return false;
    nahdyt.add(avain);
    return true;
  });
}

/** Yhdistää paikkakohtaiset tiedot; kaupunkitunnus on avain. */
function yhdistaTiedot(kentta) {
  return Object.assign({}, ...LAHTEET.map((p) => p[kentta] ?? {}));
}

const OUTLINES = [
${outlines.map((v) => `  [\n${pisteLista(v)}\n  ],`).join('\n')}
];

const CITIES = [
${cities.map((c) => `  ${JSON.stringify(c)},`).join('\n')}
];

const EDGES = [
${edges.map((e) => `  ${JSON.stringify(e)},`).join('\n')}
];

export const VANHA_MAAILMA = {
  id: 'vanhamaailma',
  name: 'Vanha maailma',
  boardLabel: 'Vanha maailma',
  tagline: 'Yksi matka Lontoosta Lontooseen — aarre jokaisesta maanosasta '
    + 'alle kahdeksassakymmenessä päivässä.',
  ariaLabel: 'Vanhan maailman aarrekartta',

  map: { width: ${LEVEYS}, height: ${korkeus}, outlines: OUTLINES },
  cities: CITIES,
  edges: EDGES,
  airRoutes: LAHTEET.flatMap((p) => p.airRoutes ?? []),
  islands: ${JSON.stringify(islands)},
  minCityDistance: 60,

  tokens: {
    types: themedTokenTypes({}),
    // Laattamäärä on suhteutettu kaupunkien määrään (${cities.length}).
    // HUOM: neljän aarteen logiikkaa ei vielä ole — tässä on yksi tähti
    // kuten muillakin laudoilla. Se odottaa omaa pakettiaan.
    counts: ${JSON.stringify(counts)},
  },

  questions: yhdistaKysymykset(),
  placeFacts: yhdistaTiedot('placeFacts'),
  duels: yksilolliset(LAHTEET.flatMap((p) => p.duels ?? [])),
  puzzles: yksilolliset(LAHTEET.flatMap((p) => p.puzzles ?? [])),
  texts: EUROPE.texts,

  decor: {
    mapLabel: 'VANHA MAAILMA',
    mapLabelPos: { x: 520, y: 220 },
    compass: { x: 420, y: ${Math.round(korkeus * 0.82)}, r: 90 },
    waveSkip: [{ x: 520, y: 220, r: 260 }, { x: 420, y: ${Math.round(korkeus * 0.82)}, r: 150 }],
    landmarks: [],
    terrainBands: [
      { maxY: ${Math.round(korkeus * 0.34)}, kind: 'trees' },
      { maxY: ${Math.round(korkeus * 0.52)}, kind: 'mountains' },
      { maxY: ${Math.round(korkeus * 0.72)}, kind: 'dunes' },
      { maxY: ${korkeus}, kind: 'trees' },
    ],
  },
};
`;

const ulos = join(JUURI, 'js/packs/vanhamaailma.js');
writeFileSync(ulos, teksti);

console.log(`lauta ${LEVEYS} x ${korkeus}`);
console.log(`rannikkoja ${outlines.length}, pisteitä ${outlines.reduce((s, v) => s + v.length, 0)}`);
console.log(`kaupunkeja ${cities.length}, siirretty maalle ${siirretty}, joista aloitus: `
  + `${cities.filter((c) => c.start).map((c) => c.name).join(', ') || 'ei yhtään'}`);
console.log(`lentokenttiä ${cities.filter((c) => c.airport).length}`);
console.log(`reittejä ${edges.length}, joista meritse ${edges.filter((e) => e.type === 'sea').length}`);
console.log(`saaria ${islands.length}: ${islands.join(', ')}`);
console.log(`merireittejä kierrätetty veden kautta ${reititetty}, ei löytynyt reittiä ${epaonnistui}`);
console.log(`laattoja ${Object.values(counts).reduce((a, b) => a + b, 0)} / kaupunkeja ilman aloitusta ${laattaKaupunkeja}`);
if (pudotetut.length) {
  console.log(`liian lähekkäin, pudotettu ${pudotetut.length}: `
    + pudotetut.map(([a, b]) => `${a} (lähellä ${b})`).join(', '));
}
console.log(`nimien törmäyksiä ${pulmat.length}`);
console.log(`kirjoitettu ${ulos} (${Math.round(teksti.length / 1024)} kt)`);
