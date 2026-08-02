/*
 * Hakee puuttuvat maatunnukset yhdistetylle laudalle.
 *
 *   node tools/hae-maatunnukset.mjs [--kuiva]
 *
 * Maatunnus (`map.cityCountry`) ratkaisee, näkyykö Tutki-ikkunan oikea
 * palsta: maan nimi, lippu, tunnusluvut ja tervehdykset. Ilman sitä
 * kortti jää vajaaksi.
 *
 * Kaikilla kaupungeilla on nyt wiki-otsikko, joten tunnus saadaan
 * Wikidatasta: artikkeli -> Q-tunnus -> sijaintimaa (P17) -> ISO-3
 * (P298). Kyselyt niputetaan viidenkymmenen erissä; yksitellen
 * kysyminen törmää Wikipedian rajoitukseen, kuten aiemmin kävi.
 *
 * Alueille, jotka eivät ole minkään maan kaupunkeja — Sahara, Rub
 * al-Khali, Borneo — tunnusta ei ole eikä pidäkään olla. Ne jäävät
 * ilman maapalstaa, ja se on oikein.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PACKS } from '../js/pack.js';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const kuiva = process.argv.includes('--kuiva');
const nuku = (ms) => new Promise((r) => { setTimeout(r, ms); });

async function hae(osoite, yrityksia = 6) {
  for (let i = 0; i < yrityksia; i++) {
    try {
      const vastaus = await fetch(osoite, { headers: { 'user-agent': 'Matkakirja/1.0 (opetuspeli)' } });
      if (vastaus.ok) return vastaus.json();
      if (vastaus.status !== 429) { console.log(`  HTTP ${vastaus.status}`); return null; }
    } catch (virhe) {
      console.log(`  yhteys katkesi (${virhe?.cause?.code ?? virhe?.name ?? '?'})`);
    }
    await nuku(3000 * (i + 1));
  }
  return null;
}

const pack = PACKS.find((p) => p.id === 'vanhamaailma');
const cityCountry = { ...(pack.map.cityCountry ?? {}) };
const puuttuu = pack.cities.filter((c) => c.wiki && !cityCountry[c.id]);
console.log(`${puuttuu.length} kaupunkia ilman maatunnusta\n`);

// 1) Artikkeli -> Q-tunnus, nipuittain.
const qid = new Map();
const otsikot = puuttuu.map((c) => c.wiki);
for (let i = 0; i < otsikot.length; i += 50) {
  const pala = otsikot.slice(i, i + 50);
  const data = await hae('https://fi.wikipedia.org/w/api.php?action=query&redirects=1'
    + `&prop=pageprops&titles=${encodeURIComponent(pala.join('|'))}&format=json`);
  if (!data) continue;
  const polku = new Map();
  for (const r of data?.query?.normalized ?? []) polku.set(r.from, r.to);
  for (const r of data?.query?.redirects ?? []) polku.set(r.from, r.to);
  const sivut = new Map();
  for (const sivu of Object.values(data?.query?.pages ?? {})) sivut.set(sivu.title, sivu);
  for (const nimi of pala) {
    let avain = nimi;
    for (let k = 0; k < 4 && polku.has(avain); k++) avain = polku.get(avain);
    const q = sivut.get(avain)?.pageprops?.wikibase_item;
    if (q) qid.set(nimi, q);
  }
  await nuku(700);
}

// 2) Q-tunnus -> sijaintimaa -> ISO-3, nipuittain.
const maaQid = new Map();
const qidit = [...new Set(qid.values())];
for (let i = 0; i < qidit.length; i += 50) {
  const data = await hae('https://www.wikidata.org/w/api.php?action=wbgetentities'
    + `&ids=${qidit.slice(i, i + 50).join('|')}&props=claims&format=json`);
  if (!data) continue;
  for (const [q, olio] of Object.entries(data?.entities ?? {})) {
    const maa = olio?.claims?.P17?.[0]?.mainsnak?.datavalue?.value?.id;
    if (maa) maaQid.set(q, maa);
  }
  await nuku(700);
}

const iso = new Map();
const maat = [...new Set(maaQid.values())];
for (let i = 0; i < maat.length; i += 50) {
  const data = await hae('https://www.wikidata.org/w/api.php?action=wbgetentities'
    + `&ids=${maat.slice(i, i + 50).join('|')}&props=claims&format=json`);
  if (!data) continue;
  for (const [q, olio] of Object.entries(data?.entities ?? {})) {
    const tunnus = olio?.claims?.P298?.[0]?.mainsnak?.datavalue?.value;
    if (tunnus) iso.set(q, tunnus);
  }
  await nuku(700);
}

/*
 * Käsin annetut. Wikidatassa ei ole sijaintimaata kaupunkivaltioille
 * eikä erityishallintoalueille, ja Saint Helena on oma alueensa.
 */
const OMAT = { singapore: 'SGP', hongkong: 'HKG', sthelena: 'SHN', taipei: 'TWN' };

let lisatty = 0;
const ilman = [];
for (const c of puuttuu) {
  const tunnus = OMAT[c.id] ?? iso.get(maaQid.get(qid.get(c.wiki))) ?? null;
  if (!tunnus) { ilman.push(c.id); continue; }
  cityCountry[c.id] = tunnus;
  lisatty += 1;
}

console.log(`${lisatty} tunnusta löytyi, ${ilman.length} ilman.`);
if (ilman.length) console.log('ilman maata:', ilman.join(' '));
if (kuiva) process.exit(0);

const polku = join(JUURI, 'js', 'packs', 'vanhamaailma.js');
let teksti = readFileSync(polku, 'utf8');
const osuma = teksti.match(/const CITY_COUNTRY = (\{[^\n]*\});/);
if (!osuma) throw new Error('CITY_COUNTRY ei löydy');
teksti = teksti.replace(osuma[0], `const CITY_COUNTRY = ${JSON.stringify(cityCountry)};`);
writeFileSync(polku, teksti);
console.log(`Kirjoitettu: ${Object.keys(cityCountry).length} kaupunkia maineen`);
