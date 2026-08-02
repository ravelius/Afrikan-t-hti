/*
 * Siirtää merireitin päässä olevat kaupungit rannan tuntumaan.
 *
 *   node tools/satamat-rannalle.mjs vanhamaailma [--kuiva]
 *
 * Miksi: peli sallii sataman ja kaupungin väliin 55 yksikön pätkän, joka
 * saa kulkua maalla. Jos kaupunki on sitä kauempana vedestä, yksikään
 * merireitti sen päästä ei voi koskaan kelvata — ei tiheämmällä
 * ruudukolla eikä millään reitinhaulla. Madagaskar oli 70 yksikön päässä
 * rannasta, ja se kaatoi kaikki kolme sen merireittiä.
 *
 * Kaupunkia ei siirretä mielivaltaisesti: uusi paikka on lähin maapiste,
 * josta vettä on korkeintaan RANTAAN yksikön päässä, eikä se saa tulla
 * liian lähelle toista kaupunkia.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PACKS } from '../js/pack.js';
import { isOnLand } from '../js/mapart.js';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const lauta = process.argv[2] ?? 'vanhamaailma';
const kuiva = process.argv.includes('--kuiva');

const pack = PACKS.find((p) => p.id === lauta);
if (!pack) throw new Error(`tuntematon lauta: ${lauta}`);

/*
 * Kaksi eri lukua, ja se on tahallista.
 *
 * LAUKAISU on raja, jonka ylittävä kaupunki siirretään. Se on lähellä
 * pelin 55:tä, koska tarkoitus EI ole siistiä kaikkia satamia rannalle
 * vaan korjata ne, joiden merireitti ei voi mitenkään kelvata. Nizzan
 * tai Kairon kaltaiset 32–44 yksikön päässä olevat kaupungit ovat
 * omilla paikoillaan syystä, eikä niitä pidä liikutella.
 *
 * RANTAAN on tavoite siirretylle: reilusti alle 55:n, jotta myös
 * pehmennetty reittiviiva mahtuu satamapätkään.
 */
const LAUKAISU = 46;
const RANTAAN = 26;
const VAHIMMAISVALI = pack.map.minCityDistance ?? 60;

/** Kuinka kaukana lähin vesi on? */
function vedenEtaisyys(x, y) {
  if (!isOnLand([x, y], pack.map)) return 0;
  for (let r = 4; r <= 220; r += 4) {
    for (let a = 0; a < 48; a++) {
      const kulma = (a / 48) * Math.PI * 2;
      if (!isOnLand([x + Math.cos(kulma) * r, y + Math.sin(kulma) * r], pack.map)) return r;
    }
  }
  return Infinity;
}

const merikaupungit = new Set();
for (const e of pack.edges) {
  if (e.type !== 'sea') continue;
  merikaupungit.add(e.a);
  merikaupungit.add(e.b);
}

const siirrot = new Map();
for (const c of pack.cities) {
  if (!merikaupungit.has(c.id)) continue;
  const nyt = vedenEtaisyys(c.x, c.y);
  if (nyt <= LAUKAISU) continue;

  /*
   * Uusi paikka etsitään vedestä käsin, ei maalta.
   *
   * Ensimmäinen versio kokeili maapisteitä kehä kerrallaan ja kysyi
   * jokaiselta erikseen "kuinka kaukana vesi on". Se on haku haun
   * sisällä eikä valmistunut lainkaan. Nyt etsitään ensin lähimmät
   * vesipisteet ja astutaan niistä takaisin maalle: rantaviiva löytyy
   * yhdellä läpikäynnillä.
   */
  let paras = null;
  for (let r = 8; r <= 260 && !paras; r += 4) {
    const ehdokkaat = [];
    for (let a = 0; a < 96; a++) {
      const kulma = (a / 96) * Math.PI * 2;
      const vx = c.x + Math.cos(kulma) * r;
      const vy = c.y + Math.sin(kulma) * r;
      if (isOnLand([vx, vy], pack.map)) continue;
      // Askel vedestä kaupunkia kohti, kunnes ollaan maalla.
      const dx = c.x - vx;
      const dy = c.y - vy;
      const pit = Math.hypot(dx, dy) || 1;
      for (let d = 4; d <= RANTAAN; d += 3) {
        const x = Math.round((vx + (dx / pit) * d) * 10) / 10;
        const y = Math.round((vy + (dy / pit) * d) * 10) / 10;
        if (!isOnLand([x, y], pack.map)) continue;
        ehdokkaat.push([x, y, Math.hypot(x - c.x, y - c.y)]);
        break;
      }
    }
    ehdokkaat.sort((p, q) => p[2] - q[2]);
    for (const [x, y] of ehdokkaat) {
      const liianLahella = pack.cities.some(
        (o) => o.id !== c.id && Math.hypot(o.x - x, o.y - y) < VAHIMMAISVALI,
      );
      if (liianLahella) continue;
      paras = [x, y];
      break;
    }
  }
  if (!paras) {
    console.log(`${c.id}: rantapaikkaa ei löytynyt (vettä ${nyt} yksikön päässä)`);
    continue;
  }
  siirrot.set(c.id, paras);
  console.log(
    `${c.id}: ${c.x},${c.y} → ${paras[0]},${paras[1]} ` +
    `(vettä ${nyt} → ${vedenEtaisyys(paras[0], paras[1])} yksikön päässä)`,
  );
}

console.log(`\n${siirrot.size} kaupunkia siirrettävänä.`);
if (!siirrot.size || kuiva) process.exit(0);

const polku = join(JUURI, 'js', 'packs', `${lauta}.js`);
const rivit = readFileSync(polku, 'utf8').split('\n');
let osumia = 0;
for (let i = 0; i < rivit.length; i++) {
  const sisus = rivit[i].trim().replace(/,$/, '');
  if (!sisus.startsWith('{"id":')) continue;
  let c;
  try { c = JSON.parse(sisus); } catch { continue; }
  const uusi = siirrot.get(c.id);
  if (!uusi) continue;
  const sisennys = rivit[i].slice(0, rivit[i].length - rivit[i].trimStart().length);
  rivit[i] = `${sisennys}${JSON.stringify({ ...c, x: uusi[0], y: uusi[1] })},`;
  osumia += 1;
}
if (osumia !== siirrot.size) throw new Error(`löysin ${osumia} riviä mutta siirtoja oli ${siirrot.size}`);
writeFileSync(polku, rivit.join('\n'));
console.log(`Kirjoitettu ${osumia} kaupunkia tiedostoon js/packs/${lauta}.js`);
