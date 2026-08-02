/*
 * Tarkistaa jo lisättyjen kuvien todellisen koon ja etsii korvaajat.
 *
 *   node tools/tarkista-kuvakoot.mjs            # raportti
 *   node tools/tarkista-kuvakoot.mjs --korvaa   # etsii korvaajat
 *
 * Omistajan linjaus: kaikki alle 1200 pikselin kuvat pois, ja tilalle
 * joko isompi versio samasta kuvasta tai kokonaan toinen kuva.
 *
 * Miksi 1200: suurennos avataan koko ruudulle, ja tabletin näyttö on
 * kaksinkertainen. Sitä pienempi kuva näkyy pehmeänä.
 *
 * "Isompi versio" tarkoittaa alkuperäistiedostoa. Peli pyytää
 * Commonsilta 1200 pikselin pienennöksen, mutta jos ALKUPERÄINEN on
 * pienempi, pienennöstä ei ole olemassa isompana — silloin kuva on
 * vaihdettava toiseen. Tätä eroa ei voi päätellä osoitteesta, se pitää
 * kysyä.
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { EUROPE_VALOKUVAT } from '../js/packs/europe-valokuvat.js';
import { AFRICA_VALOKUVAT } from '../js/packs/africa-valokuvat.js';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const korvaa = process.argv.includes('--korvaa');
const RAJA = 1200;

const nuku = (ms) => new Promise((r) => { setTimeout(r, ms); });

async function hae(osoite, yrityksia = 6) {
  for (let i = 0; i < yrityksia; i++) {
    const vastaus = await fetch(osoite, { headers: { 'user-agent': 'Matkakirja/1.0 (opetuspeli)' } });
    if (vastaus.ok) return vastaus.json();
    if (vastaus.status !== 429) { console.log(`  HTTP ${vastaus.status}`); return null; }
    await nuku(3000 * (i + 1));
  }
  return null;
}

/** Tiedostojen koot nipussa. Commons ottaa 50 nimeä kerralla. */
async function koot(tiedostot) {
  const ulos = new Map();
  for (let i = 0; i < tiedostot.length; i += 50) {
    const pala = tiedostot.slice(i, i + 50).map((t) => `File:${t}`);
    const data = await hae('https://commons.wikimedia.org/w/api.php?action=query'
      + '&prop=imageinfo&iiprop=size|mime'
      + `&titles=${encodeURIComponent(pala.join('|'))}&format=json`);
    if (!data) continue;
    const polku = new Map();
    for (const r of data?.query?.normalized ?? []) polku.set(r.from, r.to);
    for (const r of data?.query?.redirects ?? []) polku.set(r.from, r.to);
    const sivut = new Map();
    for (const sivu of Object.values(data?.query?.pages ?? {})) sivut.set(sivu.title, sivu);
    for (const nimi of pala) {
      let avain = nimi;
      for (let k = 0; k < 4 && polku.has(avain); k++) avain = polku.get(avain);
      const tieto = sivut.get(avain)?.imageinfo?.[0];
      ulos.set(nimi.replace(/^File:/, ''), tieto ? { leveys: tieto.width, korkeus: tieto.height } : null);
    }
    await nuku(600);
  }
  return ulos;
}

// --- kerää kuvat ---------------------------------------------------------------

const kuvat = [];
for (const [lauta, taulu] of [['europe', EUROPE_VALOKUVAT], ['africa', AFRICA_VALOKUVAT]]) {
  for (const [kaupunki, v] of Object.entries(taulu)) {
    if (v.tiedosto) kuvat.push({ lauta, kaupunki, kohta: 'vanha', tiedosto: v.tiedosto, selite: v.selite });
    if (v.uusi?.tiedosto) {
      kuvat.push({ lauta, kaupunki, kohta: 'uusi', tiedosto: v.uusi.tiedosto, selite: v.uusi.selite });
    }
  }
}
console.log(`${kuvat.length} kuvaa tarkistettavana\n`);

const mitat = await koot([...new Set(kuvat.map((k) => k.tiedosto))]);

const pienet = [];
let puuttuu = 0;
for (const k of kuvat) {
  const mitta = mitat.get(k.tiedosto);
  if (!mitta) { puuttuu += 1; console.log(`PUUTTUU  ${k.kaupunki}/${k.kohta}: ${k.tiedosto}`); continue; }
  if (mitta.leveys >= RAJA) continue;
  pienet.push({ ...k, ...mitta });
  console.log(`${String(mitta.leveys).padStart(5)} px  ${k.kaupunki}/${k.kohta}: ${k.tiedosto}`);
}

console.log(`\n${pienet.length} kuvaa alle ${RAJA} pikseliä, ${puuttuu} löytymättä.`);
writeFileSync(join(JUURI, 'tools', 'pienet-kuvat.json'), `${JSON.stringify(pienet, null, 1)}\n`);
if (!korvaa || !pienet.length) process.exit(0);

// --- etsi korvaajat ------------------------------------------------------------

/*
 * Korvaaja haetaan saman kaupungin Commons-kategoriasta. Ehdot ovat
 * tarkoituksella tiukat: vähintään 1200 pikseliä leveä, vaakasuuntainen
 * ja vapaa lisenssi. Kuvateksti pitää kirjoittaa uusiksi käsin, koska
 * se kertoo nimenomaan siitä kuvasta joka vaihtui.
 */
const { PACKS } = await import('../js/pack.js');
const ehdotukset = [];
for (const p of pienet) {
  const pack = PACKS.find((x) => x.id === p.lauta);
  const city = pack?.cities.find((c) => c.id === p.kaupunki);
  if (!city?.wiki) { console.log(`${p.kaupunki}: ei wiki-otsikkoa`); continue; }
  const data = await hae('https://commons.wikimedia.org/w/api.php?action=query'
    + `&list=categorymembers&cmtitle=Category:${encodeURIComponent(city.wiki)}`
    + '&cmtype=file&cmlimit=200&format=json');
  const nimet = (data?.query?.categorymembers ?? [])
    .map((x) => x.title.replace(/^File:/, ''))
    .filter((n) => /\.(jpe?g|png|tiff?)$/i.test(n))
    .filter((n) => !/map|karte|flag|coat of arms|logo|seal|diagram/i.test(n));
  const mitatKat = await koot(nimet.slice(0, 100));
  const kelvolliset = [...mitatKat.entries()]
    .filter(([, m]) => m && m.leveys >= RAJA && m.leveys >= m.korkeus)
    .map(([nimi, m]) => ({ nimi, ...m }))
    .sort((a, b) => b.leveys - a.leveys)
    .slice(0, 5);
  ehdotukset.push({ ...p, ehdokkaat: kelvolliset });
  console.log(`${p.kaupunki}/${p.kohta}: ${kelvolliset.length} ehdokasta`);
  await nuku(500);
}
writeFileSync(join(JUURI, 'tools', 'kuvakorvaajat.json'), `${JSON.stringify(ehdotukset, null, 1)}\n`);
console.log('\nEhdotukset: tools/kuvakorvaajat.json');
