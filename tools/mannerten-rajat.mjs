/*
 * Maiden rajat Oseanian ja Amerikkojen laudoille Natural Earthista.
 *
 *   NE_GEOJSON=ne50.geojson node tools/mannerten-rajat.mjs <lauta> [--kuiva]
 *   lauta: oceania | northamerica | southamerica
 *
 * Miksi kolmas rajatyökalu:
 *   - tools/maat-vanhaanmaailmaan.mjs kääntää rajat VALMIILTA laudalta
 *     toiselle (Eurooppa ja Afrikka -> yhdistetty lauta)
 *   - tools/aasian-rajat.mjs hakee ne Natural Earthista ja sovittaa
 *     Milleriin sovittamalla laudan omiin kaupunkeihin
 *   - tämä käyttää laudan OMAA projektiota suoraan
 *
 * Nämä laudat ovat Lambertin konformisessa kartioprojektiossa, ja
 * projektio on jo koodissa (tools/project.mjs, lambertConic). Sitä ei
 * siis tarvitse arvata eikä sovittaa: sama funktio, joka laski
 * kaupunkien paikat, laskee myös rajat. Sovitus laudalle luetaan
 * lähdeaineistosta samalla tavalla kuin project.mjs sen tekee, joten
 * mittakaava on väistämättä sama.
 *
 * Ilman rajoja Tutki-ikkunan minikartta jää tyhjäksi.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { lambertConic, fitToBoard } from './project.mjs';

// Noden fetch ei lue HTTPS_PROXYa; ks. tools/hae-radiot.mjs.
if (!process.env.NODE_USE_ENV_PROXY && (process.env.HTTPS_PROXY || process.env.https_proxy)) {
  const ajo = spawnSync(process.execPath, [fileURLToPath(import.meta.url), ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1', NODE_NO_WARNINGS: '1' },
  });
  process.exit(ajo.status ?? 1);
}

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const kuiva = process.argv.includes('--kuiva');
const lauta = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!lauta) { console.error('Anna lauta: oceania | northamerica | southamerica'); process.exit(1); }
const LAHDE = process.env.NE_GEOJSON ?? join(JUURI, 'ne_50m_admin_0_countries.geojson');
const luku = (n) => Number(n.toFixed(1));

/*
 * Nämä laudat ovat 1000 x 1000 yksikköä eli seitsemäsosa yhdistetyn
 * laudan leveydestä, joten rajat ovat suhteessa tiheämpiä. Siedot on
 * skaalattu sen mukaan: Aasian laudalla 1,2 yksikköä vastaa tässä
 * noin 0,17:ää.
 */
const MIN_KOKO = 2;
const MIN_PISTEITA = 4;
const SIETO = 0.25;

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

/*
 * Laudan sovitus lasketaan TÄSMÄLLEEN samoin kuin tools/project.mjs
 * sen laskee: samat ryhmät samassa järjestyksessä. Jos tämä eroaisi
 * vaikka yhden pisteen verran, rajat siirtyisivät kaupunkien suhteen.
 */
const data = JSON.parse(readFileSync(join(JUURI, 'tools', 'mapdata', `${lauta}.json`), 'utf8'));
const project = lambertConic(data.projection);
const projected = {
  outlines: Object.keys(data.outlines).map((k) => data.outlines[k].map(([lon, lat]) => project(lon, lat))),
  cities: Object.keys(data.cities).map((k) => project(...data.cities[k])),
  routes: Object.keys(data.routes ?? {}).map((k) => (data.routes[k] ?? []).map(([lon, lat]) => project(lon, lat))),
};
const fit = fitToBoard([...projected.outlines, projected.cities, ...projected.routes]);
const laudalle = ([lon, lat]) => fit(project(lon, lat));

/*
 * Tarkistus: projisoi laudan omat kaupungit uudelleen ja vertaa
 * pakettiin. Jos sovitus on oikea, ero on nolla. Tämä on halpa ja
 * kertoo heti, jos lähdeaineisto tai projektio on muuttunut.
 */
const { PACKS } = await import('../js/pack.js');
const pack = PACKS.find((p) => p.id === lauta);
if (!pack) throw new Error(`tuntematon lauta: ${lauta}`);
const nimet = Object.keys(data.cities);
let pahin = 0;
for (const nimi of nimet) {
  const c = pack.cities.find((x) => x.id === nimi);
  if (!c) continue;
  const [x, y] = laudalle(data.cities[nimi]);
  pahin = Math.max(pahin, Math.hypot(x - c.x, y - c.y));
}
console.log(`sovituksen tarkistus: pahin ero ${pahin.toFixed(2)} yksikköä`);
if (pahin > 1) throw new Error('projektio ei vastaa lautaa — rajoja ei kirjoiteta');

// --- maat ----------------------------------------------------------------------

/*
 * Suomenkieliset nimet, wiki-otsikot ja liput. Natural Earthissa on
 * englanninkielinen nimi; kortissa lukee maan nimi suomeksi.
 */
const NIMET = {
  // Oseania
  AUS: ['Australia', 'Australia', 'Flag of Australia.svg'],
  NZL: ['Uusi-Seelanti', 'Uusi-Seelanti', 'Flag of New Zealand.svg'],
  PNG: ['Papua-Uusi-Guinea', 'Papua-Uusi-Guinea', 'Flag of Papua New Guinea.svg'],
  SLB: ['Salomonsaaret', 'Salomonsaaret', 'Flag of the Solomon Islands.svg'],
  VUT: ['Vanuatu', 'Vanuatu', 'Flag of Vanuatu.svg'],
  NCL: ['Uusi-Kaledonia', 'Uusi-Kaledonia', 'Flag of New Caledonia.svg'],
  FJI: ['Fidži', 'Fidži', 'Flag of Fiji.svg'],
  TLS: ['Itä-Timor', 'Itä-Timor', 'Flag of East Timor.svg'],
  IDN: ['Indonesia', 'Indonesia', 'Flag of Indonesia.svg'],
  // Pohjois-Amerikka
  USA: ['Yhdysvallat', 'Yhdysvallat', 'Flag of the United States.svg'],
  CAN: ['Kanada', 'Kanada', 'Flag of Canada.svg'],
  MEX: ['Meksiko', 'Meksiko', 'Flag of Mexico.svg'],
  GRL: ['Grönlanti', 'Grönlanti', 'Flag of Greenland.svg'],
  CUB: ['Kuuba', 'Kuuba', 'Flag of Cuba.svg'],
  GTM: ['Guatemala', 'Guatemala', 'Flag of Guatemala.svg'],
  NIC: ['Nicaragua', 'Nicaragua', 'Flag of Nicaragua.svg'],
  PAN: ['Panama', 'Panama', 'Flag of Panama.svg'],
  HND: ['Honduras', 'Honduras', 'Flag of Honduras.svg'],
  CRI: ['Costa Rica', 'Costa Rica', 'Flag of Costa Rica.svg'],
  BLZ: ['Belize', 'Belize', 'Flag of Belize.svg'],
  SLV: ['El Salvador', 'El Salvador', 'Flag of El Salvador.svg'],
  HTI: ['Haiti', 'Haiti', 'Flag of Haiti.svg'],
  DOM: ['Dominikaaninen tasavalta', 'Dominikaaninen tasavalta', 'Flag of the Dominican Republic.svg'],
  JAM: ['Jamaika', 'Jamaika', 'Flag of Jamaica.svg'],
  BHS: ['Bahama', 'Bahama', 'Flag of the Bahamas.svg'],
  // Etelä-Amerikka
  BRA: ['Brasilia', 'Brasilia', 'Flag of Brazil.svg'],
  ARG: ['Argentiina', 'Argentiina', 'Flag of Argentina.svg'],
  CHL: ['Chile', 'Chile', 'Flag of Chile.svg'],
  PER: ['Peru', 'Peru', 'Flag of Peru.svg'],
  BOL: ['Bolivia', 'Bolivia', 'Flag of Bolivia.svg'],
  COL: ['Kolumbia', 'Kolumbia', 'Flag of Colombia.svg'],
  VEN: ['Venezuela', 'Venezuela', 'Flag of Venezuela.svg'],
  ECU: ['Ecuador', 'Ecuador', 'Flag of Ecuador.svg'],
  PRY: ['Paraguay', 'Paraguay', 'Flag of Paraguay.svg'],
  URY: ['Uruguay', 'Uruguay', 'Flag of Uruguay.svg'],
  GUY: ['Guyana', 'Guyana', 'Flag of Guyana.svg'],
  SUR: ['Suriname', 'Suriname', 'Flag of Suriname.svg'],
  GUF: ['Ranskan Guayana', 'Ranskan Guayana', 'Flag of France.svg'],
  FLK: ['Falklandinsaaret', 'Falklandinsaaret', 'Flag of the Falkland Islands.svg'],
};

const geo = JSON.parse(readFileSync(LAHDE, 'utf8'));
const piirteet = new Map();
for (const f of geo.features) {
  const iso = f.properties.ADM0_A3 || f.properties.ISO_A3;
  if (iso && !piirteet.has(iso)) piirteet.set(iso, f);
}

/*
 * Lauta näyttää vain oman alueensa. Maat, jotka eivät osu laudalle,
 * jätetään pois — muuten Brasilian rajat piirtyisivät Australian
 * kartalle laudan ulkopuolelle, ja minikartta skaalautuisi väärin.
 */
const IKKUNA = { min: -60, max: 1060 };
const osuuLaudalle = (renkaat) => renkaat.some((r) => r.some(
  ([x, y]) => x > IKKUNA.min && x < IKKUNA.max && y > IKKUNA.min && y < IKKUNA.max,
));

const uudet = {};
const ilman = [];
let renkaita = 0;
for (const [iso, nimi] of Object.entries(NIMET)) {
  const f = piirteet.get(iso);
  if (!f) { ilman.push(`${iso} (ei Natural Earthissa)`); continue; }
  const g = f.geometry;
  const monet = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  const renkaat = [];
  for (const monikko of monet) {
    const rengas = monikko[0].map(laudalle);
    const xs = rengas.map(([x]) => x);
    const ys = rengas.map(([, y]) => y);
    if ((Math.max(...xs) - Math.min(...xs)) < MIN_KOKO
      && (Math.max(...ys) - Math.min(...ys)) < MIN_KOKO) continue;
    const harva = harvenna(rengas, SIETO);
    if (harva.length >= MIN_PISTEITA) renkaat.push(harva.map(([x, y]) => [luku(x), luku(y)]));
  }
  if (!renkaat.length) { ilman.push(`${iso} (ei riittävän isoa rengasta)`); continue; }
  if (!osuuLaudalle(renkaat)) { ilman.push(`${iso} (ei osu tälle laudalle)`); continue; }

  const keskus = Number.isFinite(f.properties.LABEL_X) && Number.isFinite(f.properties.LABEL_Y)
    ? laudalle([f.properties.LABEL_X, f.properties.LABEL_Y]).map(luku)
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
  console.log(`${iso}  ${nimi[0].padEnd(24)} ${renkaat.length} rengasta, `
    + `${renkaat.reduce((s, r) => s + r.length, 0)} pistettä`);
}

console.log(`\n${Object.keys(uudet).length} maata, ${renkaita} rengasta.`);
// Poisjääneet aina näkyviin: hiljainen karsinta näyttäisi täydeltä listalta.
if (ilman.length) {
  console.log(`\n${ilman.length} jäi ilman:`);
  for (const i of ilman) console.log(`  ${i}`);
}
if (kuiva) process.exit(0);

// --- kirjoitus -----------------------------------------------------------------

const polku = join(JUURI, 'js', 'packs', `${lauta}.js`);
let teksti = readFileSync(polku, 'utf8');
if (teksti.includes('const COUNTRY_SHAPES')) {
  // Rivinvaihto rajaksi, ei ahnetta .* — ks. tools/aasian-rajat.mjs.
  const osuma = teksti.match(/const COUNTRY_SHAPES = (\{[^\n]*\});/);
  if (!osuma) throw new Error('COUNTRY_SHAPES on tiedostossa mutta ei odotetussa muodossa');
  teksti = teksti.replace(osuma[0],
    `const COUNTRY_SHAPES = ${JSON.stringify({ ...JSON.parse(osuma[1]), ...uudet })};`);
} else {
  const lisays = '\n// Maiden rajat minikartalle (tools/mannerten-rajat.mjs, Natural Earth 50m,\n'
    + '// public domain). Laudan oma Lambert-projektio, sama sovitus kuin\n'
    + '// kaupungeilla. Älä muokkaa pistelistoja käsin.\n'
    + `const COUNTRY_SHAPES = ${JSON.stringify(uudet)};\n`;
  const kohta = teksti.search(/^export const [A-Z_]+ = \{/m);
  if (kohta < 0) throw new Error('vientikohtaa ei löydy');
  teksti = teksti.slice(0, kohta) + lisays + '\n' + teksti.slice(kohta);
}

/*
 * Kytkentä map-olioon. Jos countryShapes on jo siellä, ei tehdä
 * mitään — muuten kenttä tulisi kahdesti ja jälkimmäinen voittaisi.
 */
if (!/countryShapes:/.test(teksti)) {
  const osuma = teksti.match(/^(const [A-Z_]+_MAP = \{\n)/m);
  if (!osuma) throw new Error('MAP-oliota ei löydy');
  teksti = teksti.replace(osuma[0], `${osuma[0]}  countryShapes: COUNTRY_SHAPES,\n`);
}

writeFileSync(polku, teksti);
console.log(`\nKirjoitettu js/packs/${lauta}.js`);
