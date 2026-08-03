/*
 * Puuttuvien maiden rajat yhdistetylle laudalle Natural Earthista.
 *
 *   NE_GEOJSON=ne_50m_admin_0_countries.geojson node tools/aasian-rajat.mjs [--kuiva]
 *
 * Miksi eri työkalu kuin tools/maat-vanhaanmaailmaan.mjs: se tuo rajat
 * VALMIILTA lähdelaudoilta (Eurooppa, Afrikka) kääntämällä ne
 * projektiosta toiseen. Aasian ja Lähi-idän 31 maalla ei ole
 * lähdelautaa lainkaan, joten rajat on haettava alkuperäisestä
 * aineistosta.
 *
 * Millerin sovitus luetaan LAUDALTA ITSELTÄÄN samalla tavalla kuin
 * tuontityökalussa: jokaiselle kaupungille tiedetään sekä lon/lat että
 * valmis x/y, joten skaalan ja siirron saa pienimmän neliösumman
 * sovituksella. Näin tämä työkalu ei voi ajautua eri mittakaavaan kuin
 * lauta, vaikka se lukee aivan toista lähdettä.
 *
 * Ilman rajoja Tutki-ikkunan minikartta jää tyhjäksi: maan nimi ja
 * liput näkyvät, mutta paikkaa ei näytetä. Sama vika, jonka omistaja
 * huomasi aiemmin koko oikeasta palstasta.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { EUROPE } from '../js/packs/europe.js';
import { AFRICA } from '../js/packs/africa.js';
import { VANHA_MAAILMA } from '../js/packs/vanhamaailma.js';
import { miller, KAANTEISET } from './vanha-maailma.mjs';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const kuiva = process.argv.includes('--kuiva');
const LAHDE = process.env.NE_GEOJSON ?? join(JUURI, 'ne_50m_admin_0_countries.geojson');
const luku = (n) => Number(n.toFixed(1));

/*
 * Pienin sallittu rengas. Pikkusaaret olisivat minikartalla yksittäisiä
 * täpliä, ja niitä on Indonesiassa ja Filippiineillä tuhansia — kaikki
 * mukaan otettuna paketti kasvaisi megatavuja eikä kuva paranisi.
 */
const MIN_KOKO = 12;      // renkaan pienin leveys tai korkeus lautayksikköinä
const MIN_PISTEITA = 4;
const SIETO = 1.2;        // harvennuksen sallima poikkeama lautayksikköinä

// --- Millerin sovitus laudalta -------------------------------------------------

const paikat = new Map(VANHA_MAAILMA.cities.map((c) => [c.id, c]));
const parit = [];
for (const [lauta, pack] of [['europe', EUROPE], ['africa', AFRICA]]) {
  for (const c of pack.cities) {
    const kohde = paikat.get(c.id);
    if (!kohde) continue;
    const [lon, lat] = KAANTEISET[lauta](c.x, c.y);
    const [mx, my] = miller.eteen(lon, lat);
    parit.push({ mx, my, x: kohde.x, y: kohde.y });
  }
}
if (parit.length < 20) throw new Error(`liian vähän vertailukaupunkeja: ${parit.length}`);

function sovita(xs, ys) {
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sxx = xs.reduce((a, b) => a + b * b, 0);
  const sxy = xs.reduce((a, b, i) => a + b * ys[i], 0);
  const k = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  return { k, b: (sy - k * sx) / n };
}

// Kolme kierrosta, huonoin viidennes pois: rannikkokaupungit on
// siirretty lähimpään maakohtaan eivätkä ne noudata projektiota.
let joukko = parit;
let vaaka = sovita(joukko.map((p) => p.mx), joukko.map((p) => p.x));
let pysty = sovita(joukko.map((p) => p.my), joukko.map((p) => p.y));
for (let kierros = 0; kierros < 3; kierros++) {
  const virheet = joukko
    .map((p) => ({ p, e: Math.hypot(vaaka.k * p.mx + vaaka.b - p.x, pysty.k * p.my + pysty.b - p.y) }))
    .sort((a, b) => a.e - b.e);
  joukko = virheet.slice(0, Math.max(20, Math.floor(virheet.length * 0.8))).map((v) => v.p);
  vaaka = sovita(joukko.map((p) => p.mx), joukko.map((p) => p.x));
  pysty = sovita(joukko.map((p) => p.my), joukko.map((p) => p.y));
}

const ero = Math.abs(vaaka.k - pysty.k) / Math.abs(vaaka.k);
if (ero > 0.02) throw new Error(`mittakaavat eroavat ${(ero * 100).toFixed(1)} %`);

const laudalle = ([lon, lat]) => {
  const [mx, my] = miller.eteen(lon, lat);
  return [luku(vaaka.k * mx + vaaka.b), luku(pysty.k * my + pysty.b)];
};

const virheet = parit
  .map((p) => Math.hypot(vaaka.k * p.mx + vaaka.b - p.x, pysty.k * p.my + pysty.b - p.y))
  .sort((a, b) => a - b);
const mediaani = virheet[Math.floor(virheet.length / 2)];
console.log(`sovitus ${parit.length} kaupungista: mediaani ${mediaani.toFixed(1)} yksikköä`);
if (mediaani > 8) throw new Error('sovitus ei osu kaupunkeihin — rajoja ei kirjoiteta');

// --- harvennus -----------------------------------------------------------------

/** Ramer–Douglas–Peucker: karsii pisteitä säilyttäen muodon. */
function harvenna(pisteet, sieto) {
  if (pisteet.length < 3) return pisteet;
  let maxD = 0;
  let kohta = 0;
  const [ax, ay] = pisteet[0];
  const [bx, by] = pisteet[pisteet.length - 1];
  const pituus = Math.hypot(bx - ax, by - ay);
  for (let i = 1; i < pisteet.length - 1; i++) {
    const [px, py] = pisteet[i];
    const d = pituus === 0
      ? Math.hypot(px - ax, py - ay)
      : Math.abs((bx - ax) * (ay - py) - (ax - px) * (by - ay)) / pituus;
    if (d > maxD) { maxD = d; kohta = i; }
  }
  if (maxD <= sieto) return [pisteet[0], pisteet[pisteet.length - 1]];
  return [
    ...harvenna(pisteet.slice(0, kohta + 1), sieto).slice(0, -1),
    ...harvenna(pisteet.slice(kohta), sieto),
  ];
}

// --- maat ----------------------------------------------------------------------

const nykyiset = VANHA_MAAILMA.map?.countryShapes ?? {};
const cityCountry = VANHA_MAAILMA.map?.cityCountry ?? {};
const tarvitaan = [...new Set(Object.values(cityCountry))].filter((iso) => !nykyiset[iso]);
console.log(`${tarvitaan.length} maata ilman rajoja\n`);

/*
 * Kaupunkivaltiot ja erityisalueet ovat 50m-aineistossa niin pieniä,
 * ettei niistä tule mielekästä minikarttaa — Hongkong ja Singapore
 * olisivat yhden pikselin täpliä. Ne jätetään pois tietoisesti, ja
 * niiden kortista puuttuu vain minikartta, ei mikään muu.
 */
const LIIAN_PIENET = new Set(['HKG', 'SGP', 'SHN']);

/*
 * Suomenkieliset nimet ja wiki-otsikot. Natural Earthissa on
 * englanninkielinen nimi, ja kortissa lukee maan nimi suomeksi.
 * Lippu on Commonsin tiedostonimi, sama muoto kuin muillakin mailla.
 */
const NIMET = {
  AFG: ['Afganistan', 'Afganistan', 'Flag of Afghanistan (2013–2021).svg'],
  ARE: ['Arabiemiirikunnat', 'Arabiemiirikunnat', 'Flag of the United Arab Emirates.svg'],
  CHN: ['Kiina', 'Kiina', 'Flag of the People\'s Republic of China.svg'],
  CYP: ['Kypros', 'Kypros', 'Flag of Cyprus.svg'],
  IDN: ['Indonesia', 'Indonesia', 'Flag of Indonesia.svg'],
  IND: ['Intia', 'Intia', 'Flag of India.svg'],
  IRN: ['Iran', 'Iran', 'Flag of Iran.svg'],
  IRQ: ['Irak', 'Irak', 'Flag of Iraq.svg'],
  JOR: ['Jordania', 'Jordania', 'Flag of Jordan.svg'],
  JPN: ['Japani', 'Japani', 'Flag of Japan.svg'],
  KAZ: ['Kazakstan', 'Kazakstan', 'Flag of Kazakhstan.svg'],
  KOR: ['Etelä-Korea', 'Etelä-Korea', 'Flag of South Korea.svg'],
  KWT: ['Kuwait', 'Kuwait', 'Flag of Kuwait.svg'],
  LKA: ['Sri Lanka', 'Sri Lanka', 'Flag of Sri Lanka.svg'],
  MMR: ['Myanmar', 'Myanmar', 'Flag of Myanmar.svg'],
  MNG: ['Mongolia', 'Mongolia', 'Flag of Mongolia.svg'],
  NPL: ['Nepal', 'Nepal', 'Flag of Nepal.svg'],
  OMN: ['Oman', 'Oman', 'Flag of Oman.svg'],
  PAK: ['Pakistan', 'Pakistan', 'Flag of Pakistan.svg'],
  PHL: ['Filippiinit', 'Filippiinit', 'Flag of the Philippines.svg'],
  QAT: ['Qatar', 'Qatar', 'Flag of Qatar.svg'],
  SAU: ['Saudi-Arabia', 'Saudi-Arabia', 'Flag of Saudi Arabia.svg'],
  SYR: ['Syyria', 'Syyria', 'Flag of Syria (1980–2024).svg'],
  THA: ['Thaimaa', 'Thaimaa', 'Flag of Thailand.svg'],
  TWN: ['Taiwan', 'Taiwan', 'Flag of the Republic of China.svg'],
  UZB: ['Uzbekistan', 'Uzbekistan', 'Flag of Uzbekistan.svg'],
  VNM: ['Vietnam', 'Vietnam', 'Flag of Vietnam.svg'],
  YEM: ['Jemen', 'Jemen', 'Flag of Yemen.svg'],
  ISR: ['Israel', 'Israel', 'Flag of Israel.svg'],
};

const data = JSON.parse(readFileSync(LAHDE, 'utf8'));
const piirteet = new Map();
for (const f of data.features) {
  const iso = f.properties.ADM0_A3 || f.properties.ISO_A3;
  if (iso && !piirteet.has(iso)) piirteet.set(iso, f);
}

const uudet = {};
const ilman = [];
let renkaita = 0;
for (const iso of tarvitaan) {
  if (LIIAN_PIENET.has(iso)) { ilman.push(`${iso} (liian pieni minikartalle)`); continue; }
  const f = piirteet.get(iso);
  const nimi = NIMET[iso];
  if (!f) { ilman.push(`${iso} (ei Natural Earthissa)`); continue; }
  if (!nimi) { ilman.push(`${iso} (ei suomenkielistä nimeä)`); continue; }

  const geo = f.geometry;
  const monet = geo.type === 'Polygon' ? [geo.coordinates] : geo.coordinates;
  const renkaat = [];
  for (const monikko of monet) {
    // Vain ulkoreuna: reiät (järvet) eivät näy tässä mittakaavassa.
    const rengas = monikko[0].map(laudalle);
    const xs = rengas.map(([x]) => x);
    const ys = rengas.map(([, y]) => y);
    const leveys = Math.max(...xs) - Math.min(...xs);
    const korkeus = Math.max(...ys) - Math.min(...ys);
    if (leveys < MIN_KOKO && korkeus < MIN_KOKO) continue;
    const harva = harvenna(rengas, SIETO);
    if (harva.length < MIN_PISTEITA) continue;
    renkaat.push(harva);
  }
  if (!renkaat.length) { ilman.push(`${iso} (ei riittävän isoa rengasta)`); continue; }

  /*
   * Keskus on nimen paikka minikartalla. Natural Earthin LABEL_X/Y on
   * kartografin asettama ja parempi kuin laskettu keskipiste:
   * Indonesian ja Norjan kaltaisissa maissa laskettu keskipiste osuu
   * mereen.
   */
  const keskus = Number.isFinite(f.properties.LABEL_X) && Number.isFinite(f.properties.LABEL_Y)
    ? laudalle([f.properties.LABEL_X, f.properties.LABEL_Y])
    : (() => {
      const kaikki = renkaat.flat();
      const xs = kaikki.map(([x]) => x);
      const ys = kaikki.map(([, y]) => y);
      return [luku((Math.min(...xs) + Math.max(...xs)) / 2), luku((Math.min(...ys) + Math.max(...ys)) / 2)];
    })();

  const xs = renkaat.flat().map(([x]) => x);
  uudet[iso] = {
    nimi: nimi[0],
    wiki: nimi[1],
    lippu: nimi[2],
    keskus,
    leveys: luku(Math.max(...xs) - Math.min(...xs)),
    renkaat,
  };
  renkaita += renkaat.length;
  const pisteita = renkaat.reduce((s, r) => s + r.length, 0);
  console.log(`${iso}  ${nimi[0].padEnd(20)} ${renkaat.length} rengasta, ${pisteita} pistettä`);
}

console.log(`\n${Object.keys(uudet).length} maata, ${renkaita} rengasta.`);
// Poisjääneet aina näkyviin: hiljainen karsinta näyttäisi täydeltä listalta.
if (ilman.length) {
  console.log(`\n${ilman.length} jäi ilman:`);
  for (const i of ilman) console.log(`  ${i}`);
}
if (kuiva) process.exit(0);

// --- kirjoitus -----------------------------------------------------------------

const polku = join(JUURI, 'js', 'packs', 'vanhamaailma.js');
let teksti = readFileSync(polku, 'utf8');
/*
 * Yksi rivi, ei koko tiedosto. Ensimmäinen versio käytti /s-lippua ja
 * ahnetta .*, joka nappasi viimeiseen };-pariin asti — siis koko
 * loppupaketin. JSON.parse kaatui siihen, eikä mitään kirjoitettu.
 * COUNTRY_SHAPES kirjoitetaan aina yhdelle riville, joten rivinvaihto
 * on oikea raja.
 */
const osuma = teksti.match(/const COUNTRY_SHAPES = (\{[^\n]*\});/);
if (!osuma) throw new Error('COUNTRY_SHAPES ei löydy');
const yhdessa = { ...JSON.parse(osuma[1]), ...uudet };
teksti = teksti.replace(osuma[0], `const COUNTRY_SHAPES = ${JSON.stringify(yhdessa)};`);
writeFileSync(polku, teksti);
console.log(`\nKirjoitettu: ${Object.keys(yhdessa).length} maata rajoineen.`);
