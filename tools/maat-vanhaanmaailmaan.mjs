/*
 * Tuo maiden rajat ja kaupunki→maa-kytkennän yhdistetylle laudalle.
 *
 *   node tools/maat-vanhaanmaailmaan.mjs [--kuiva]
 *
 * Miksi: Tutki-ikkunan oikea palsta — maan nimi, lippu, minikartta,
 * tunnusluvut ja tervehdykset — on kiinni kahdessa kentässä,
 * `map.cityCountry` ja `map.countryShapes`. Yhdistetyllä laudalla
 * kumpaakaan ei ollut, joten koko palsta jäi piiloon ja ikkuna näytti
 * vajaalta (omistajan havainto iPadilla ja iPhonella — kyse ei siis
 * ollut ruudun koosta).
 *
 * Rajat ovat lähdelaudoilla kunkin oman projektion koordinaateissa.
 * Ne käännetään takaisin leveys- ja pituusasteiksi samoilla kaavoilla
 * kuin kaupungit (tools/vanha-maailma.mjs, KAANTEISET) ja projisoidaan
 * Milleriin.
 *
 * Millerin sovitus luetaan LAUDALTA ITSELTÄÄN eikä lasketa uudestaan:
 * jokaiselle kaupungille tiedetään sekä lon/lat että valmis x/y, joten
 * skaalan ja siirron saa pienimmän neliösumman sovituksella. Näin
 * työkalu ei tarvitse Natural Earthin aineistoa eikä voi ajautua eri
 * mittakaavaan kuin lauta.
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

/** Numero lyhyeksi kuten paketissa muutenkin. */
const luku = (n) => Number(n.toFixed(1));

// --- Millerin sovitus laudalta -------------------------------------------------

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
if (parit.length < 20) throw new Error(`liian vähän vertailukaupunkeja: ${parit.length}`);

/** Pienimmän neliösumman suora y = k*x + b. */
function sovita(xs, ys) {
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sxx = xs.reduce((a, b) => a + b * b, 0);
  const sxy = xs.reduce((a, b, i) => a + b * ys[i], 0);
  const k = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  return { k, b: (sy - k * sx) / n };
}
/*
 * Sovitus karsii poikkeamat.
 *
 * Kaupunkien paikat EIVÄT ole puhdasta projektiota: rannikkokaupungit
 * on siirretty lähimpään maakohtaan, jotta laatta ei kellu vedessä, ja
 * kaksi satamaa siirrettiin erikseen rannan tuntumaan. Suora sovitus
 * kaikkiin kaupunkeihin epäonnistui juuri siksi. Sovitetaan siis
 * kolmesti ja pudotetaan joka kierroksella huonoin viidennes.
 */
let joukko = parit;
let vaaka = sovita(joukko.map((p) => p.mx), joukko.map((p) => p.x));
let pysty = sovita(joukko.map((p) => p.my), joukko.map((p) => p.y));
for (let kierros = 0; kierros < 3; kierros++) {
  const virheet = joukko.map((p) => ({
    p,
    e: Math.hypot(vaaka.k * p.mx + vaaka.b - p.x, pysty.k * p.my + pysty.b - p.y),
  }));
  virheet.sort((a, b) => a.e - b.e);
  joukko = virheet.slice(0, Math.max(20, Math.floor(virheet.length * 0.8))).map((v) => v.p);
  vaaka = sovita(joukko.map((p) => p.mx), joukko.map((p) => p.x));
  pysty = sovita(joukko.map((p) => p.my), joukko.map((p) => p.y));
}

/*
 * Tarkistus. Miller on lieriöprojektio, joten sama mittakaava koskee
 * molempia akseleita; jos sovitukset eroavat, jokin on pielessä eikä
 * rajoja pidä kirjoittaa lautaan.
 */
const ero = Math.abs(vaaka.k - pysty.k) / Math.abs(vaaka.k);
if (ero > 0.02) throw new Error(`mittakaavat eroavat ${(ero * 100).toFixed(1)} %`);

const laudalle = ([lon, lat]) => {
  const [mx, my] = miller.eteen(lon, lat);
  return [luku(vaaka.k * mx + vaaka.b), luku(pysty.k * my + pysty.b)];
};

// Sovituksen osuvuus. Mediaani kertoo kaavan oikeellisuuden; yksittäiset
// isot poikkeamat ovat siirrettyjä kaupunkeja eivätkä virhe.
const virheet = parit
  .map((p) => Math.hypot(vaaka.k * p.mx + vaaka.b - p.x, pysty.k * p.my + pysty.b - p.y))
  .sort((a, b) => a - b);
const mediaani = virheet[Math.floor(virheet.length / 2)];
console.log(`sovitus ${parit.length} kaupungista: mediaani ${mediaani.toFixed(1)}, `
  + `pahin ${virheet[virheet.length - 1].toFixed(1)} yksikköä`);
if (mediaani > 8) throw new Error('sovitus ei osu kaupunkeihin — rajoja ei kirjoiteta');

// --- maat ---------------------------------------------------------------------

const cityCountry = {};
const countryShapes = {};
let renkaita = 0;

for (const [lauta, pack] of LAHTEET) {
  const kaanteinen = KAANTEISET[lauta];
  for (const [id, iso] of Object.entries(pack.map?.cityCountry ?? {})) {
    if (paikat.has(id)) cityCountry[id] = iso;
  }
  for (const [iso, maa] of Object.entries(pack.map?.countryShapes ?? {})) {
    // Sama maa voi olla kahdella laudalla (Egypti, Turkki). Ensimmäinen
    // voittaa: lähteet ovat samaa aineistoa eivätkä eroa sisällöltään.
    if (countryShapes[iso]) continue;
    const renkaat = (maa.renkaat ?? []).map((rengas) => rengas.map(
      ([x, y]) => laudalle(kaanteinen(x, y)),
    ));
    renkaita += renkaat.length;
    countryShapes[iso] = {
      ...maa,
      ...(maa.keskus ? { keskus: laudalle(kaanteinen(maa.keskus[0], maa.keskus[1])) } : {}),
      /*
       * Leveys lasketaan projisoiduista renkaista eikä skaalata
       * vanhasta luvusta: lähdelaudoilla on eri mittakaavat (Eurooppa
       * 19,2 ja Afrikka 13,3 yksikköä astetta kohti), joten yksi
       * kerroin olisi oikea vain toiselle.
       */
      ...(maa.leveys && renkaat.length
        ? { leveys: luku(Math.max(...renkaat.flat().map(([x]) => x)) - Math.min(...renkaat.flat().map(([x]) => x))) }
        : {}),
      renkaat,
    };
  }
}

console.log(`${Object.keys(cityCountry).length} kaupunkia, ${Object.keys(countryShapes).length} maata, ${renkaita} rengasta`);
if (kuiva) process.exit(0);

// --- kirjoitus ----------------------------------------------------------------

const polku = join(JUURI, 'js', 'packs', 'vanhamaailma.js');
let teksti = readFileSync(polku, 'utf8');
const vanha = '  map: { width: 7200, height: 4694, outlines: OUTLINES },';
if (!teksti.includes(vanha)) throw new Error('map-riviä ei löytynyt — tarkista paketin muoto');
teksti = teksti.replace(
  vanha,
  '  map: {\n'
  + '    width: 7200, height: 4694, outlines: OUTLINES,\n'
  + '    cityCountry: CITY_COUNTRY, countryShapes: COUNTRY_SHAPES,\n'
  + '  },',
);

const lisays = '\n// Kaupunki -> maa ja maiden rajat, tuotu lähdelaudoilta ja projisoitu\n'
  + '// uudelleen (tools/maat-vanhaanmaailmaan.mjs). Näistä syntyy Tutki-ikkunan\n'
  + '// oikea palsta: maan nimi, lippu, minikartta ja tunnusluvut.\n'
  + `const CITY_COUNTRY = ${JSON.stringify(cityCountry)};\n\n`
  + `const COUNTRY_SHAPES = ${JSON.stringify(countryShapes)};\n`;

const kohta = teksti.indexOf('export const VANHA_MAAILMA');
teksti = teksti.slice(0, kohta) + lisays + '\n' + teksti.slice(kohta);
writeFileSync(polku, teksti);
console.log('Kirjoitettu js/packs/vanhamaailma.js');
