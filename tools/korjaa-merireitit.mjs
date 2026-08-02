/*
 * Laskee maalla kulkevat merireitit uudelleen ja kirjoittaa ne pakettiin.
 *
 *   node tools/korjaa-merireitit.mjs vanhamaailma
 *   node tools/korjaa-merireitit.mjs vanhamaailma --kuiva
 *
 * Miksi oma työkalu eikä osa generaattoria: generaattori tarvitsee
 * Natural Earthin aineiston (satoja megatavuja), mutta korjaus ei.
 * Reitit tarkistetaan paketin OMIA rannikoita vasten — samoja, joita
 * peli piirtää ja joita testi tutkii. Se on oikea mittapuu, ja työkalu
 * toimii ilman latauksia.
 *
 * Generaattori laskee reitit samoilla funktioilla, joten seuraava
 * täysajo tuottaa saman tuloksen suoraan.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PACKS } from '../js/pack.js';
import { buildBoard } from '../js/rules.js';
import { isOnLand } from '../js/mapart.js';
import { kulkeeVedessa, tarkennaMeripolku } from './merireitit.mjs';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const lauta = process.argv[2] ?? 'vanhamaailma';
const kuiva = process.argv.includes('--kuiva');

const pack = PACKS.find((p) => p.id === lauta);
if (!pack) throw new Error(`tuntematon lauta: ${lauta}`);

const board = buildBoard(pack.cities, pack.edges);
const leveys = pack.map.width;
const korkeus = pack.map.height;

const korjatut = new Map();
let kunnossa = 0;
let jai = 0;

for (const edge of pack.edges) {
  if (edge.type !== 'sea') continue;
  const a = board.cityById.get(edge.a);
  const b = board.cityById.get(edge.b);
  if (kulkeeVedessa(a, b, edge.via ?? [], isOnLand, pack.map)) { kunnossa += 1; continue; }

  const tulos = tarkennaMeripolku(pack.map, a, b, isOnLand, leveys, korkeus);
  if (!tulos.via) {
    jai += 1;
    console.log(`${edge.a}-${edge.b}: EI RATKENNUT — ${tulos.syy}`);
    continue;
  }
  korjatut.set(`${edge.a}|${edge.b}`, tulos.via);
  console.log(
    `${edge.a}-${edge.b}: ${(edge.via ?? []).length} → ${tulos.via.length} välipistettä ` +
    `(ruutu ${tulos.porras.ruutu}, väljyys ${tulos.porras.valjyys})`,
  );
}

console.log(`\n${kunnossa} kunnossa, ${korjatut.size} korjattu, ${jai} jäi.`);
if (!korjatut.size || kuiva) process.exit(jai ? 1 : 0);

// --- kirjoitus pakettiin ---------------------------------------------------
//
// Rivit korvataan yksitellen, ei koko tiedostoa uudelleen: näin muutos
// näkyy versiohistoriassa juuri niinä reitteinä, joita se koskee.
const polku = join(JUURI, 'js', 'packs', `${lauta}.js`);
const rivit = readFileSync(polku, 'utf8').split('\n');
let osumia = 0;

for (let i = 0; i < rivit.length; i++) {
  const rivi = rivit[i];
  const sisus = rivi.trim().replace(/,$/, '');
  if (!sisus.startsWith('{"a":')) continue;
  let e;
  try { e = JSON.parse(sisus); } catch { continue; }
  const via = korjatut.get(`${e.a}|${e.b}`);
  if (!via) continue;
  const sisennys = rivi.slice(0, rivi.length - rivi.trimStart().length);
  rivit[i] = `${sisennys}${JSON.stringify({ ...e, via })},`;
  osumia += 1;
}

if (osumia !== korjatut.size) {
  throw new Error(`löysin ${osumia} riviä mutta korjattavia oli ${korjatut.size}`);
}
writeFileSync(polku, rivit.join('\n'));
console.log(`Kirjoitettu ${osumia} reittiä tiedostoon js/packs/${lauta}.js`);
