// Tarkistaa, että jokainen pelin wiki-viittaus osoittaa oikeasti
// olemassa olevaan suomenkielisen Wikipedian artikkeliin.
//
// Kuollut linkki ei näy koodissa eikä testeissä: peli avaa sen vasta
// kun pelaaja napauttaa "Lue lisää", ja silloin vastassa on tyhjä sivu.
// Kolme sellaista löytyi kerralla (Latinalaissilta, Evzonit,
// Kreetalainen lyyra), joten tämä kannattaa ajaa aina kun uusia
// kaupunkeja lisätään.
//
//   node tools/tarkista-wikit.mjs
//
// Verkkoa tarvitaan, joten tämä ei ole osa tests/-sarjaa.

import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const AGENTTI = 'Matkakirja/1.0 (https://github.com/ravelius/Matkakirja)';

const nuku = (s) => execFileSync('sleep', [String(s)]);
const hae = (url) => JSON.parse(execFileSync('curl',
  ['-sS', '--max-time', '45', '--retry', '2', '--retry-delay', '3', '-A', AGENTTI, url],
  { maxBuffer: 5e7 }).toString());

/** Kerää wiki-otsikot paketeista. Kestää suojatut heittomerkit. */
function otsikot() {
  const paketit = readdirSync(join(JUURI, 'js/packs'))
    .filter((f) => f.endsWith('.js'))
    .map((f) => readFileSync(join(JUURI, 'js/packs', f), 'utf8')).join('\n');
  const pura = (t) => t.replace(/\\(['"\\])/g, '$1');
  const nimet = new Set([
    ...[...paketit.matchAll(/wiki: '((?:[^'\\]|\\.)*)'/g)].map((m) => pura(m[1])),
    ...[...paketit.matchAll(/wiki: "((?:[^"\\]|\\.)*)"/g)].map((m) => pura(m[1])),
  ]);
  // Artikkelitiedostojen avaimet ovat myös Wikipedian otsikoita.
  for (const nimi of ['africa-artikkelit', 'europe-artikkelit']) {
    const s = readFileSync(join(JUURI, `js/packs/${nimi}.js`), 'utf8');
    for (const m of s.matchAll(/^ {2}('?)([A-ZÅÄÖ][^:']*)\1: \{/gm)) nimet.add(m[2]);
  }
  return [...nimet];
}

/**
 * Etsii otsikot yhdeltä kieliversiolta. Palauttaa löytyneet nimet ja
 * uudelleenohjaukset. Peli hakee samassa järjestyksessä kuin WIKI_LANGS
 * (js/wiki.js): suomi ensin, englanti varalla — joten otsikko on kuollut
 * vasta jos se puuttuu kummastakin.
 */
function tarkistaKieli(kieli, nimet) {
  const loytyi = new Set();
  const ohjaus = [];
  for (let i = 0; i < nimet.length; i += 40) {
    const era = nimet.slice(i, i + 40);
    let d;
    try {
      d = hae(`https://${kieli}.wikipedia.org/w/api.php?format=json&action=query&redirects=1&titles=`
        + encodeURIComponent(era.join('|')));
    } catch (e) {
      console.log(`  ${kieli}: haku epäonnistui erässä ${i}: ${e.message.slice(0, 50)}`);
      nuku(5);
      continue;
    }
    const alkuun = new Map([
      ...(d.query?.normalized ?? []).map((n) => [n.to, n.from]),
      ...(d.query?.redirects ?? []).map((r) => [r.to, r.from]),
    ]);
    const juurelle = (nimi) => {
      let n = nimi;
      for (let k = 0; k < 5 && alkuun.has(n); k += 1) n = alkuun.get(n);
      return n;
    };
    for (const sivu of Object.values(d.query?.pages ?? {})) {
      const pyydetty = juurelle(sivu.title);
      if (sivu.missing !== undefined) continue;
      loytyi.add(pyydetty);
      if (sivu.title !== pyydetty) ohjaus.push([pyydetty, sivu.title]);
    }
    process.stdout.write(`  ${kieli}: ${Math.min(i + 40, nimet.length)}/${nimet.length}\r`);
    nuku(2);
  }
  return { loytyi, ohjaus };
}

const kaikki = otsikot();
console.log(`Tarkistetaan ${kaikki.length} wiki-otsikkoa (fi ensin, en varalla)\n`);

const fi = tarkistaKieli('fi', kaikki);
console.log(`\n  suomeksi löytyi ${fi.loytyi.size}/${kaikki.length}`);

const eiSuomeksi = kaikki.filter((n) => !fi.loytyi.has(n));
const en = eiSuomeksi.length ? tarkistaKieli('en', eiSuomeksi) : { loytyi: new Set(), ohjaus: [] };
console.log(`\n  englanniksi löytyi ${en.loytyi.size}/${eiSuomeksi.length} lopuista`);

const kuolleet = eiSuomeksi.filter((n) => !en.loytyi.has(n));

console.log(`\nVAIN ENGLANNIKSI (${en.loytyi.size}) — peli näyttää nämä englanniksi:`);
for (const n of [...en.loytyi].sort()) console.log('  en', n);

console.log(`\nKUOLLEET (${kuolleet.length}) — ei artikkelia kummallakaan kielellä:`);
for (const n of kuolleet.sort()) console.log('  ✗', n);

const ohjaus = [...fi.ohjaus, ...en.ohjaus];
console.log(`\nUUDELLEENOHJAUS (${ohjaus.length}) — toimii, mutta suora nimi on siistimpi:`);
for (const [a, b] of ohjaus.sort()) console.log('  →', a, '⇒', b);

process.exitCode = kuolleet.length ? 1 : 0;
