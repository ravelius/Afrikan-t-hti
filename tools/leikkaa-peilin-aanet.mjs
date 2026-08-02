// Leikkaa jo peilatut äänitteet kolmeen minuuttiin.
//
// Peilaustyökalu leikkaa uudet äänet latauksen yhteydessä, mutta ennen
// omistajan linjausta (1.8.2026) peilattu aineisto on levyllä täysmit-
// taisena. Tämä käy sen läpi paikallisesti: mitään ei ladata uudestaan,
// koska leikkaus tehdään kehysrajalta olemassa olevasta tiedostosta.
//
//   node tools/leikkaa-peilin-aanet.mjs [--ulos <peilikansio>] [--kuiva]

import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { leikkaaMp3 } from './leikkaa-mp3.mjs';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const arvo = (lippu, oletus) => {
  const i = argv.indexOf(lippu);
  return i >= 0 ? argv[i + 1] : oletus;
};
// Sama oletuskansio kuin peilaustyökalulla — media/ repon sisällä.
const ULOS = arvo('--ulos', join(JUURI, 'media'));
const KUIVA = argv.includes('--kuiva');
const MAX_S = 180;

const polku = join(ULOS, 'manifesti.json');
if (!existsSync(polku)) {
  console.error(`Manifestia ei löydy: ${polku}`);
  process.exit(1);
}
const manifesti = JSON.parse(readFileSync(polku, 'utf8'));

let leikattuja = 0;
let saastoa = 0;
for (const [url, tiedot] of Object.entries(manifesti.aanet ?? {})) {
  if (tiedot.leikattu) continue;
  const tiedosto = join(ULOS, tiedot.tiedosto ?? '');
  if (!tiedosto.endsWith('.mp3') || !existsSync(tiedosto)) continue;
  const ennen = statSync(tiedosto).size;
  const tulos = leikkaaMp3(readFileSync(tiedosto), MAX_S);
  if (!tulos) continue; // mahtuu jo tai ei jäsentynyt — jätetään rauhaan
  leikattuja += 1;
  saastoa += ennen - tulos.puskuri.length;
  console.log(`  ${tiedot.tiedosto}: ${(ennen / 1e6).toFixed(1)} → `
    + `${(tulos.puskuri.length / 1e6).toFixed(1)} Mt (${tulos.kesto} s)`);
  if (KUIVA) continue;
  writeFileSync(tiedosto, tulos.puskuri);
  tiedot.leikattu = tulos.kesto;
  tiedot.alkuperainenKoko = ennen;
  tiedot.koko = tulos.puskuri.length;
}

if (!KUIVA && leikattuja) writeFileSync(polku, `${JSON.stringify(manifesti, null, 1)}\n`);
console.log(`\n${KUIVA ? 'Leikattaisiin' : 'Leikattu'} ${leikattuja} äänitettä, `
  + `säästö ${(saastoa / 1e6).toFixed(1)} Mt.`);
