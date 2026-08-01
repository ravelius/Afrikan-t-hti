/*
 * Euroopan maiden rajat pelin karttaprojektioon.
 *
 *   node tools/europe-countries.mjs FRA ESP POL BIH
 *
 * Lukee Natural Earthin 110m-maapolygonit (public domain) ja tulostaa
 * `renkaat`-listat, jotka liitetään js/packs/europe-countries.js:ään.
 *
 * Euroopan lauta on tasavälinen projektio (sama kaava kuin europe.js:n
 * kaupunkien x/y:ssä):  x = (lon + 11) * 19.2,  y = (72 - lat) * 26.3
 *
 * Merentakaiset alueet karsitaan: Ranskan polygoniin kuuluu Guayana ja
 * Espanjan Kanariansaaret, jotka eivät ole Euroopan laudalla. Siksi
 * mukaan otetaan vain renkaat, jotka osuvat laudan ikkunaan, ja niistä
 * vain riittävän isot — pikkusaaret olisivat kartalla pelkkiä täpliä.
 */
import fs from 'node:fs';

// Natural Earthin 50m-aineisto: 110m litistää pienet maat (Bosnia jäi
// neljääntoista pisteeseen ja näytti läiskältä), 10m taas on turhan
// raskas tähän mittakaavaan.
const LAHDE = process.env.NE_GEOJSON ?? 'ne_50m_admin_0_countries.geojson';
const X = (lon) => (lon + 11) * 19.2;
const Y = (lat) => (72 - lat) * 26.3;
// Laudan ikkuna maantieteellisinä asteina (x 0–1000, y 0–1000).
const IKKUNA = { lonMin: -12, lonMax: 44, latMin: 33, latMax: 72 };
const MIN_PISTEITA = 4;
const MIN_KOKO = 25;   // renkaan pienin sallittu leveys/korkeus lautayksikköinä

const data = JSON.parse(fs.readFileSync(LAHDE, 'utf8'));
const koodit = process.argv.slice(2);
if (!koodit.length) {
  console.error('Anna maakoodit, esim. node tools/europe-countries.mjs FRA ESP');
  process.exit(1);
}

/** Ramer–Douglas–Peucker: karsii pisteitä säilyttäen muodon. */
function harvenna(pisteet, siedatty) {
  if (pisteet.length < 3) return pisteet;
  let maxD = 0;
  let jako = 0;
  const [ax, ay] = pisteet[0];
  const [bx, by] = pisteet[pisteet.length - 1];
  const dx = bx - ax;
  const dy = by - ay;
  const pit = Math.hypot(dx, dy) || 1;
  for (let i = 1; i < pisteet.length - 1; i += 1) {
    const [px, py] = pisteet[i];
    const d = Math.abs(dy * px - dx * py + bx * ay - by * ax) / pit;
    if (d > maxD) { maxD = d; jako = i; }
  }
  if (maxD <= siedatty) return [pisteet[0], pisteet[pisteet.length - 1]];
  return [
    ...harvenna(pisteet.slice(0, jako + 1), siedatty).slice(0, -1),
    ...harvenna(pisteet.slice(jako), siedatty),
  ];
}

for (const koodi of koodit) {
  const maa = data.features.find((f) => (f.properties.ADM0_A3 ?? f.properties.ISO_A3) === koodi);
  if (!maa) { console.error('ei löytynyt:', koodi); continue; }
  const monet = maa.geometry.type === 'MultiPolygon'
    ? maa.geometry.coordinates
    : [maa.geometry.coordinates];
  const renkaat = [];
  for (const polygoni of monet) {
    // Vain ulkokehä (polygoni[0]); reiät eivät näy pelin mittakaavassa.
    const kehä = polygoni[0];
    const ikkunassa = kehä.some(([lon, lat]) => lon >= IKKUNA.lonMin && lon <= IKKUNA.lonMax
      && lat >= IKKUNA.latMin && lat <= IKKUNA.latMax);
    if (!ikkunassa) continue;
    let pisteet = kehä.map(([lon, lat]) => [X(lon), Y(lat)]);
    // GeoJSON toistaa ensimmäisen pisteen lopussa; polku suljetaan Z:lla.
    if (pisteet.length > 1
      && pisteet[0][0] === pisteet[pisteet.length - 1][0]
      && pisteet[0][1] === pisteet[pisteet.length - 1][1]) pisteet.pop();
    const xs = pisteet.map((p) => p[0]);
    const ys = pisteet.map((p) => p[1]);
    const leveys = Math.max(...xs) - Math.min(...xs);
    const korkeus = Math.max(...ys) - Math.min(...ys);
    const koko = Math.max(leveys, korkeus);
    if (koko < MIN_KOKO) continue;
    // Harvennus suhteessa maan kokoon: kiinteä sietoraja söi pienten
    // maiden muodon (Bosnia) mutta jätti isot turhan raskaiksi.
    pisteet = harvenna(pisteet, Math.max(0.5, Math.min(2.4, koko / 110)));
    if (pisteet.length < MIN_PISTEITA) continue;
    renkaat.push(pisteet);
  }
  renkaat.sort((a, b) => b.length - a.length);
  const kaikki = renkaat.flat();
  const xs = kaikki.map((p) => p[0]);
  const ys = kaikki.map((p) => p[1]);
  const keskus = [
    ((Math.min(...xs) + Math.max(...xs)) / 2).toFixed(1),
    ((Math.min(...ys) + Math.max(...ys)) / 2).toFixed(1),
  ];
  const leveys = Math.round(Math.max(...xs) - Math.min(...xs));
  console.log(`// ${koodi}: ${renkaat.length} rengasta, ${kaikki.length} pistettä`);
  console.log(`    keskus: [${keskus.join(', ')}],`);
  console.log(`    leveys: ${leveys},`);
  console.log('    renkaat: [');
  for (const r of renkaat) {
    console.log(`      [${r.map(([x, y]) => `[${x.toFixed(1)}, ${y.toFixed(1)}]`).join(', ')}],`);
  }
  console.log('    ],');
}
