/*
 * Tarkistaa, mitkä radiokanavat sallivat CORSin.
 *
 *   node tools/tarkista-radio-cors.mjs
 *
 * MIKSI TÄMÄ ON OLEMASSA. VU-mittari lukee lähetyksen tason Web Audion
 * kautta, ja `createMediaElementSource` antaa pelkkiä nollia, jos ääni
 * tulee toiselta palvelimelta EIKÄ palvelin lähetä
 * `Access-Control-Allow-Origin`-otsaketta. Peli pyytää siis CORSia, ja
 * jos palvelin ei sitä anna, lataus epäonnistuu ja asema avataan
 * uudelleen ilman pyyntöä — jolloin mittari jää ilman lähdettä.
 *
 * Kysymys "kuinka moni asema sallii CORSin" on siis suoraan kysymys
 * "kuinka monella asemalla mittari voi toimia". Sitä ei saa arvata.
 *
 * Pyyntö on Range-rajattu kilotavuun: lähetysvirralla ei ole loppua,
 * eikä otsakkeiden lukemiseen tarvita enempää.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const suorita = promisify(execFile);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const ORIGIN = 'https://ravelius.github.io';
const AIKAKATKO_S = 12;
// Kuusitoista rinnakkain: kaikki odottavat verkkoa, eikä yksikään
// palvelin saa kahta pyyntöä yhtä aikaa.
const RINNAKKAIN = 16;

/** Lukee RADIOT-taulun paketista ilman moduulin ajamista. */
function lueRadiot() {
  const teksti = readFileSync(join(root, 'js/packs/radiot.js'), 'utf8');
  const rivit = [];
  const kaava = /^\s*(\w{3}):\s*\{\s*url:\s*'([^']+)',\s*asema:\s*'((?:[^'\\]|\\.)*)'/gm;
  for (const osuma of teksti.matchAll(kaava)) {
    rivit.push({ maa: osuma[1], url: osuma[2], asema: osuma[3].replace(/\\'/g, "'") });
  }
  return rivit;
}

/**
 * Hakee otsakkeet yhdeltä asemalta.
 *
 * curl eikä fetch: lähetysvirta ei pääty, ja fetchin keskeyttäminen
 * kesken rungon lukemisen jättäisi yhteyden roikkumaan. curl lopettaa
 * Range-pyynnön itse.
 */
async function otsakkeet(url) {
  try {
    const { stdout } = await suorita('curl', [
      '-s', '-S', '-L', '-m', String(AIKAKATKO_S),
      '-o', '/dev/null', '-D', '-',
      '-r', '0-1024',
      '-H', `Origin: ${ORIGIN}`,
      '-A', 'Mozilla/5.0',
      url,
    ], { maxBuffer: 1 << 20 });
    return stdout;
  } catch {
    return null;
  }
}

function tulkitse(vastaus) {
  if (!vastaus) return { tavoitettu: false, cors: false, koodi: null };
  // Proxy vastaa ensin omalla 200:llaan; oikea tila on viimeinen.
  const koodit = [...vastaus.matchAll(/^HTTP\/[\d.]+ (\d{3})/gm)].map((m) => Number(m[1]));
  const oma = koodit.filter((k) => k !== 200 || koodit.length === 1);
  const koodi = koodit.length > 1 ? koodit[koodit.length - 1] : (oma[0] ?? koodit[0] ?? null);
  const cors = /^access-control-allow-origin:\s*(\*|https?:\/\/)/im.test(vastaus);
  const kelpaa = koodi !== null && koodi >= 200 && koodi < 400;
  return { tavoitettu: kelpaa, cors: cors && kelpaa, koodi };
}

const asemat = lueRadiot();
console.log(`${asemat.length} asemaa, ${RINNAKKAIN} rinnakkain…`);

const tulokset = [];
for (let i = 0; i < asemat.length; i += RINNAKKAIN) {
  const nippu = asemat.slice(i, i + RINNAKKAIN);
  const vastaukset = await Promise.all(nippu.map((a) => otsakkeet(a.url)));
  nippu.forEach((asema, j) => tulokset.push({ ...asema, ...tulkitse(vastaukset[j]) }));
  process.stdout.write(`\r${tulokset.length}/${asemat.length}`);
}
process.stdout.write('\n');

const tavoitetut = tulokset.filter((t) => t.tavoitettu);
const korsilliset = tulokset.filter((t) => t.cors);
const ilman = tavoitetut.filter((t) => !t.cors);

console.log(`tavoitettu   ${tavoitetut.length}/${tulokset.length}`);
console.log(`CORS sallii  ${korsilliset.length}`);
console.log(`CORS ei      ${ilman.length}`);
if (ilman.length) {
  console.log('\nIlman CORSia:');
  for (const t of ilman) console.log(`  ${t.maa}  ${t.asema}`);
}
const kuolleet = tulokset.filter((t) => !t.tavoitettu);
if (kuolleet.length) {
  console.log('\nEi vastannut:');
  for (const t of kuolleet) console.log(`  ${t.maa}  ${t.asema}  (${t.koodi ?? 'aikakatko'})`);
}

writeFileSync(
  join(root, 'tools/radio-cors.json'),
  `${JSON.stringify(tulokset.map(({ maa, asema, tavoitettu, cors, koodi }) => ({ maa, asema, tavoitettu, cors, koodi })), null, 2)}\n`,
);
console.log('\ntools/radio-cors.json kirjoitettu');
