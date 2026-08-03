/*
 * Tuo maiden rajat maailmankartalle vanhalta yhdistetyltä laudalta.
 *
 *   node tools/maat-maailmankartalle.mjs [--kuiva]
 *
 * Miksi: Tutki-ikkunan oikea palsta — maan nimi, lippu, minikartta,
 * tunnusluvut ja tervehdykset — on kiinni kahdesta kentästä,
 * `map.cityCountry` ja `map.countryShapes`. Maailmankartta sai
 * ensimmäisen koostajalta, mutta toinen jäi puuttumaan, ja koko palsta
 * olisi kadonnut 143 kaupungilta samalla kun vanha lauta korvattiin.
 *
 * --- miksi rajoja ei voi vain kopioida ---
 *
 * Vanhan laudan rajat ovat sen omassa koordinaatistossa: 7200 yksikköä
 * leveä Miller-sovitus, jonka nollakohta ja mittakaava ovat eri kuin
 * maailmankartan 12000 yksikön kierrossa. Suoraan kopioituna Italia
 * osuisi Atlantille.
 *
 * Siksi rajat käännetään takaisin leveys- ja pituusasteiksi ja
 * projisoidaan uudelleen. Vanhan laudan sovitusta ei tarvitse tietää
 * etukäteen: sen kaupungeille tunnetaan sekä lon/lat että valmis x/y,
 * joten skaalan ja siirron saa pienimmän neliösumman sovituksella.
 * Sama keino kuin tools/maat-vanhaanmaailmaan.mjs käytti aikanaan.
 *
 * Sauman ylittävät maat (Venäjä, Fidži) pidetään yhtenäisinä
 * muunnaViivalla — muuten rengas piirtyisi vaakaviivana halki kartan.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { miller, sovitaMaailma, kaupungit, KOKO_MAAILMA } from './vanha-maailma.mjs';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const kuiva = process.argv.includes('--kuiva');
const luku = (n) => Number(n.toFixed(1));

/*
 * Vanha lauta luetaan tiedostosta, joka on jätetty repoon vain tätä
 * varten. Kun rajat on kerran siirretty, se voidaan poistaa.
 */
const VANHA = join(JUURI, 'js/packs/.vanhamaailma-vanha.js');
if (!existsSync(VANHA)) {
  throw new Error('js/packs/.vanhamaailma-vanha.js puuttuu — palauta se git-historiasta');
}
const { VANHA_MAAILMA } = await import(`file://${VANHA}`);
const { MAAILMANKARTTA } = await import(`file://${join(JUURI, 'js/packs/maailmankartta.js')}`);

// --- vanhan laudan sovitus takaisinpäin ---------------------------------------
//
// x = skaala * mx + siirtoX, y = skaala * my + siirtoY. Sama skaala
// molemmille akseleille, koska projektio on yhdenmuotoinen.

const { kaupungit: kaikki } = await kaupungit(KOKO_MAAILMA);
const lonlat = new Map(kaikki.map((c) => [c.id, c]));

const parit = [];
for (const c of VANHA_MAAILMA.cities) {
  const g = lonlat.get(c.id);
  if (!g) continue;
  const [mx, my] = miller.eteen(g.lon, g.lat);
  parit.push({ mx, my, x: c.x, y: c.y });
}
if (parit.length < 20) throw new Error(`liian vähän vertailupareja: ${parit.length}`);

const keski = (f) => parit.reduce((s, p) => s + f(p), 0) / parit.length;
const kmx = keski((p) => p.mx);
const kmy = keski((p) => p.my);
const kx = keski((p) => p.x);
const ky = keski((p) => p.y);
let ylos = 0;
let alas = 0;
for (const p of parit) {
  ylos += (p.mx - kmx) * (p.x - kx) + (p.my - kmy) * (p.y - ky);
  alas += (p.mx - kmx) ** 2 + (p.my - kmy) ** 2;
}
const skaala = ylos / alas;
const siirtoX = kx - skaala * kmx;
const siirtoY = ky - skaala * kmy;

/*
 * Sovituksen laatu. Mitataan MEDIAANILLA eikä pahimmalla poikkeamalla:
 * osa kaupungeista siirrettiin koostajan jälkeen käsin rannalle
 * (satamat-rannalle) ja osa maalle, joten ne eivät ole projektiossa
 * enää samassa paikassa kuin laskukaava sanoo. Ne ovat poikkeamia
 * aineistossa, eivät virheitä sovituksessa — pahin poikkeama kertoisi
 * niistä eikä sovituksen osuvuudesta.
 */
const poikkeamat = parit
  .map((p) => Math.hypot(skaala * p.mx + siirtoX - p.x, skaala * p.my + siirtoY - p.y))
  .sort((a, b) => a - b);
const mediaani = poikkeamat[Math.floor(poikkeamat.length / 2)];
console.log(`sovitus vanhaan lautaan: skaala ${skaala.toFixed(2)}, mediaanipoikkeama `
  + `${mediaani.toFixed(1)} yksikköä, pahin ${poikkeamat.at(-1).toFixed(1)} (${parit.length} kaupunkia)`);
if (mediaani > 5) throw new Error('sovitus ei osu — rajoja ei siirretä');

/** Vanhan laudan piste takaisin leveys- ja pituusasteiksi. */
const asteiksi = ([x, y]) => miller.taakse((x - siirtoX) / skaala, (y - siirtoY) / skaala);

// --- uudelle laudalle ----------------------------------------------------------

const uusi = sovitaMaailma({
  leveys: MAAILMANKARTTA.map.width,
  lon0: -175,
  etela: -58,
  pohjoinen: 76,
});

const countryShapes = {};
let renkaita = 0;
for (const [iso, maa] of Object.entries(VANHA_MAAILMA.map.countryShapes ?? {})) {
  const renkaat = maa.renkaat.map((rengas) => uusi.muunnaViiva(rengas.map(asteiksi)));
  renkaita += renkaat.length;
  // Keskus ja leveys uudelleen renkaista: ne ohjaavat minikartan rajausta.
  const xs = renkaat.flat().map(([x]) => x);
  const ys = renkaat.flat().map(([, y]) => y);
  countryShapes[iso] = {
    nimi: maa.nimi,
    wiki: maa.wiki,
    lippu: maa.lippu,
    keskus: [luku((Math.min(...xs) + Math.max(...xs)) / 2), luku((Math.min(...ys) + Math.max(...ys)) / 2)],
    leveys: luku(Math.max(...xs) - Math.min(...xs)),
    renkaat,
  };
}
console.log(`${Object.keys(countryShapes).length} maata, ${renkaita} rengasta`);

// Tarkistus: kaupungin pitää osua oman maansa rajojen sisään.
const sisalla = ([px, py], rengas) => {
  let osuu = false;
  for (let i = 0, j = rengas.length - 1; i < rengas.length; j = i++) {
    const [xi, yi] = rengas[i];
    const [xj, yj] = rengas[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) osuu = !osuu;
  }
  return osuu;
};
let osui = 0;
let ohi = [];
for (const c of MAAILMANKARTTA.cities) {
  const iso = MAAILMANKARTTA.map.cityCountry?.[c.id];
  const maa = iso && countryShapes[iso];
  if (!maa) continue;
  // Kierto: kaupunki voi olla laudan toisella laidalla kuin rengas.
  const kohdat = [c.x, c.x - MAAILMANKARTTA.map.width, c.x + MAAILMANKARTTA.map.width];
  if (maa.renkaat.some((r) => kohdat.some((x) => sisalla([x, c.y], r)))) osui += 1;
  else ohi.push(c.name);
}
console.log(`${osui} kaupunkia oman maansa rajojen sisällä, ${ohi.length} ulkona`
  + (ohi.length ? `: ${ohi.slice(0, 8).join(', ')}` : ''));

if (kuiva) process.exit(0);

const polku = join(JUURI, 'js/packs/maailmankartta.js');
let teksti = readFileSync(polku, 'utf8');
const rivit = Object.entries(countryShapes)
  .map(([iso, m]) => `  ${JSON.stringify(iso)}: ${JSON.stringify(m)},`).join('\n');
const lohko = `/*\n * Maiden rajat, nimet ja liput. Siirretty vanhalta yhdistetyltä\n`
  + ` * laudalta kääntämällä takaisin asteiksi ja projisoimalla uudelleen\n`
  + ` * (tools/maat-maailmankartalle.mjs).\n */\nconst COUNTRY_SHAPES = {\n${rivit}\n};\n\n`;

if (teksti.includes('const COUNTRY_SHAPES')) {
  teksti = teksti.replace(/\/\*[^]*?\*\/\nconst COUNTRY_SHAPES = \{[^]*?\n\};\n\n/, lohko);
} else {
  teksti = teksti.replace('export const MAAILMANKARTTA = {', `${lohko}export const MAAILMANKARTTA = {`);
}
if (!teksti.includes('countryShapes: COUNTRY_SHAPES')) {
  teksti = teksti.replace('    cityCountry: CITY_COUNTRY,', '    cityCountry: CITY_COUNTRY,\n    countryShapes: COUNTRY_SHAPES,');
}
writeFileSync(polku, teksti);
console.log(`Kirjoitettu ${polku}`);
