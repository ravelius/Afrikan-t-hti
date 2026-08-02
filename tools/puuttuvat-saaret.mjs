/*
 * Palauttaa yhdistetyltä laudalta pudonneet saaret.
 *
 *   node tools/puuttuvat-saaret.mjs [--kuiva]
 *
 * Miksi: rannikot karsitaan Ramer–Douglas–Peuckerilla, ja liian pienet
 * renkaat pudotetaan kokonaan. Poikkeuksena säilytetään ne, joiden
 * sisällä on kaupunki — Sisilia, Kreeta, Kypros ja Sansibar jäivät
 * siksi kartalle. Korsika ja Sardinia eivät: niillä ei ole kaupunkia,
 * joten ne katosivat Välimereltä (omistajan havainto).
 *
 * Kaupungittomuus on väärä mittapuu saaren olemassaololle. Oikea korjaus
 * olisi laskea rannikot uudelleen matalammalla kynnyksellä, mutta se
 * vaatii Natural Earthin aineiston. Sama tieto on jo pelissä: vanhojen
 * lautojen omat rannikot. Ne käännetään takaisin leveys- ja
 * pituusasteiksi ja projisoidaan Milleriin, kuten maiden rajatkin.
 *
 * Lisätään vain se, mitä laudalta puuttuu: jos jokin olemassa oleva
 * ääriviiva jo peittää saaren paikan, sitä ei kosketa.
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
const LAHTEET = [['europe', EUROPE], ['africa', AFRICA]];

const luku = (n) => Number(n.toFixed(1));

// --- Millerin sovitus laudalta (sama menetelmä kuin maiden rajoissa) ----------

const paikat = new Map(VANHA_MAAILMA.cities.map((c) => [c.id, c]));
const parit = [];
for (const [lauta, pack] of LAHTEET) {
  for (const c of pack.cities) {
    const kohde = paikat.get(c.id);
    if (!kohde) continue;
    const [lon, lat] = KAANTEISET[lauta](c.x, c.y);
    const [mx, my] = miller.eteen(lon, lat);
    parit.push({ mx, my, x: kohde.x, y: kohde.y });
  }
}

function suora(xs, ys) {
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sxx = xs.reduce((a, b) => a + b * b, 0);
  const sxy = xs.reduce((a, b, i) => a + b * ys[i], 0);
  const k = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  return { k, b: (sy - k * sx) / n };
}

// Kaupunkeja on siirretty rannalle, joten huonoin viidennes pudotetaan.
let joukko = parit;
let vaaka = suora(joukko.map((p) => p.mx), joukko.map((p) => p.x));
let pysty = suora(joukko.map((p) => p.my), joukko.map((p) => p.y));
for (let i = 0; i < 3; i++) {
  const virheet = joukko
    .map((p) => ({ p, e: Math.hypot(vaaka.k * p.mx + vaaka.b - p.x, pysty.k * p.my + pysty.b - p.y) }))
    .sort((a, b) => a.e - b.e);
  joukko = virheet.slice(0, Math.max(20, Math.floor(virheet.length * 0.8))).map((v) => v.p);
  vaaka = suora(joukko.map((p) => p.mx), joukko.map((p) => p.x));
  pysty = suora(joukko.map((p) => p.my), joukko.map((p) => p.y));
}
const laudalle = ([lon, lat]) => {
  const [mx, my] = miller.eteen(lon, lat);
  return [luku(vaaka.k * mx + vaaka.b), luku(pysty.k * my + pysty.b)];
};

// --- puuttuvat renkaat ---------------------------------------------------------

/** Onko piste renkaan sisällä? Pariton määrä leikkauksia = sisällä. */
function sisalla([px, py], rengas) {
  let osuu = false;
  for (let i = 0, j = rengas.length - 1; i < rengas.length; j = i++) {
    const [xi, yi] = rengas[i];
    const [xj, yj] = rengas[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) osuu = !osuu;
  }
  return osuu;
}

const keskipiste = (rengas) => [
  rengas.reduce((a, p) => a + p[0], 0) / rengas.length,
  rengas.reduce((a, p) => a + p[1], 0) / rengas.length,
];

const ala = (rengas) => {
  let s = 0;
  for (let i = 0, j = rengas.length - 1; i < rengas.length; j = i++) {
    s += rengas[j][0] * rengas[i][1] - rengas[i][0] * rengas[j][1];
  }
  return Math.abs(s) / 2;
};

/*
 * Pienin saari, joka kannattaa palauttaa. Laudan yksiköissä: alle tämän
 * jäävät renkaat ovat luotoja, jotka näkyisivät vain pisteinä ja
 * kasvattaisivat tiedostoa turhaan.
 */
const MIN_ALA = 900;

const olemassa = VANHA_MAAILMA.map.outlines;
const lisattavat = [];

for (const [lauta, pack] of LAHTEET) {
  const kaanteinen = KAANTEISET[lauta];
  for (const rengas of pack.map?.outlines ?? []) {
    const projisoitu = rengas.map(([x, y]) => laudalle(kaanteinen(x, y)));
    if (ala(projisoitu) < MIN_ALA) continue;
    const keski = keskipiste(projisoitu);
    // Onko tämä alue jo laudalla? Riittää, että jokin olemassa oleva
    // ääriviiva peittää keskipisteen — mantereet peittävät omansa.
    if (olemassa.some((o) => sisalla(keski, o))) continue;
    if (lisattavat.some((o) => sisalla(keski, o.rengas))) continue;
    lisattavat.push({ lauta, rengas: projisoitu, keski, ala: ala(projisoitu) });
  }
}

lisattavat.sort((a, b) => b.ala - a.ala);
for (const s of lisattavat) {
  console.log(`${s.lauta}: ${s.rengas.length} pistettä, ala ${Math.round(s.ala)}, `
    + `keskipiste ${s.keski.map(Math.round)}`);
}
console.log(`\n${lisattavat.length} puuttuvaa saarta.`);
if (!lisattavat.length || kuiva) process.exit(0);

// --- kirjoitus ----------------------------------------------------------------

const polku = join(JUURI, 'js', 'packs', 'vanhamaailma.js');
let teksti = readFileSync(polku, 'utf8');
const merkki = '\nconst OUTLINES = [';
if (!teksti.includes(merkki)) throw new Error('OUTLINES-listaa ei löytynyt');
const rivit = lisattavat
  .map((s) => `  ${JSON.stringify(s.rengas)},`)
  .join('\n');
teksti = teksti.replace(merkki, `${merkki}\n`
  + '  // Saaret, jotka putosivat rannikoiden karsinnassa, koska niillä ei\n'
  + '  // ole kaupunkia (tools/puuttuvat-saaret.mjs). Käännetty vanhojen\n'
  + '  // lautojen rannikoista ja projisoitu uudelleen.\n'
  + `${rivit}`);
writeFileSync(polku, teksti);
console.log(`Kirjoitettu ${lisattavat.length} saarta tiedostoon js/packs/vanhamaailma.js`);
