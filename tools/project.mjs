// Kartan projisointi: maantieteelliset koordinaatit lautakoordinaateiksi.
//
//   node tools/project.mjs asia
//
// Lukee tools/mapdata/<lauta>.json ja tulostaa pakettitiedostoon liitettävät
// pistelistat ja kaupunkien x/y-arvot.
//
// Miksi kartioprojektio? Yksinkertainen lieriöprojektio (x suoraan pituus-
// asteesta, y leveysasteesta) on oikeassa muodossa vain yhdellä leveys-
// piirillä. Mannerkartalla, joka ulottuu tropiikista napapiirille, se venyttää
// pohjoisen leveäksi ja litistää etelän kapeaksi. Lambertin konforminen
// kartioprojektio on juuri tätä varten: pituuspiirit lähenevät toisiaan napaa
// kohti, ja muodot pysyvät oikeina koko kartalla. Sama projektio on käytössä
// esimerkiksi ilmailukartoissa.
//
// Kaikki laudan pisteet — rannikot, kaupungit ja merireittien välipisteet —
// projisoidaan samalla funktiolla, jotta ne pysyvät keskenään kohdallaan.

import { readFileSync } from 'node:fs';

const RAD = Math.PI / 180;

/**
 * Lambertin konforminen kartioprojektio pallolle.
 * lat1 ja lat2 ovat standardileveyspiirit, joilla mittakaava on tarkalleen
 * oikea; niiden välissä ja lähellä virhe on hyvin pieni.
 */
export function lambertConic({ lat1, lat2, lon0 }) {
  const t = (lat) => Math.tan(Math.PI / 4 + (lat * RAD) / 2);
  const n = Math.log(Math.cos(lat1 * RAD) / Math.cos(lat2 * RAD))
    / Math.log(t(lat2) / t(lat1));
  const f = (Math.cos(lat1 * RAD) * t(lat1) ** n) / n;

  // Palautetaan suoraan piirtokoordinaateissa, joissa y kasvaa alaspäin:
  // kartion kärki on pohjoisnavan puolella, joten leveyspiirit kaartuvat
  // ylöspäin kartan reunoilla. Sama kaava toimii myös eteläisellä pallon-
  // puoliskolla, jolloin n ja rho ovat negatiivisia ja kaarto kääntyy.
  return (lon, lat) => {
    const rho = f / t(lat) ** n;
    const theta = n * (lon - lon0) * RAD;
    return [rho * Math.sin(theta), rho * Math.cos(theta)];
  };
}

/**
 * Sovittaa projisoidut pisteet laudalle: sama mittakaava molempiin suuntiin,
 * keskitettynä ja marginaalin verran reunoista sisään.
 */
export function fitToBoard(groups, { size = 1000, margin = 18 } = {}) {
  const all = groups.flat();
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const minX = Math.min(...xs); const maxX = Math.max(...xs);
  const minY = Math.min(...ys); const maxY = Math.max(...ys);
  const usable = size - 2 * margin;
  const scale = Math.min(usable / (maxX - minX), usable / (maxY - minY));
  const offX = margin + (usable - (maxX - minX) * scale) / 2;
  const offY = margin + (usable - (maxY - minY) * scale) / 2;
  return ([x, y]) => [
    Number(((x - minX) * scale + offX).toFixed(1)),
    Number(((y - minY) * scale + offY).toFixed(1)),
  ];
}

function formatPoints(name, points) {
  const rows = [];
  for (let i = 0; i < points.length; i += 5) {
    rows.push(`    ${points.slice(i, i + 5).map(([x, y]) => `[${x}, ${y}]`).join(', ')},`);
  }
  return `  ${name}: [\n${rows.join('\n')}\n  ],`;
}

const board = process.argv[2];
if (!board) {
  console.error('käyttö: node tools/project.mjs <lauta>');
  process.exit(1);
}

const url = new URL(`./mapdata/${board}.json`, import.meta.url);
const data = JSON.parse(readFileSync(url, 'utf8'));
const project = lambertConic(data.projection);

// Kaikki pisteet samaan sovitukseen, jotta mittakaava on yhteinen.
const outlineNames = Object.keys(data.outlines);
const cityNames = Object.keys(data.cities);
const routeNames = Object.keys(data.routes ?? {});

const projected = {
  outlines: outlineNames.map((k) => data.outlines[k].map(([lon, lat]) => project(lon, lat))),
  cities: cityNames.map((k) => project(...data.cities[k])),
  routes: routeNames.map((k) => (data.routes[k] ?? []).map(([lon, lat]) => project(lon, lat))),
};

const fit = fitToBoard([
  ...projected.outlines,
  projected.cities,
  ...projected.routes,
]);

for (const [i, name] of outlineNames.entries()) {
  console.log(formatPoints(name, projected.outlines[i].map(fit)));
}
console.log('\n// --- kaupungit ---');
for (const [i, name] of cityNames.entries()) {
  const [x, y] = fit(projected.cities[i]);
  console.log(`  ${name}: x: ${Math.round(x)}, y: ${Math.round(y)},`);
}
if (routeNames.length) {
  console.log('\n// --- merireittien välipisteet ---');
  for (const [i, name] of routeNames.entries()) {
    const pts = projected.routes[i].map(fit).map(([x, y]) => `[${Math.round(x)}, ${Math.round(y)}]`);
    console.log(`  ${name}: via: [${pts.join(', ')}],`);
  }
}
