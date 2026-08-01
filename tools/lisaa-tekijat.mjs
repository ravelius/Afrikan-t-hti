// Lisää kuvien lähdemerkintöihin tekijän nimen.
//
// CC BY ja CC BY-SA vaativat tekijän nimeämisen. Peli merkitsi kuvat
// muodossa "Wikimedia Commons (CC BY-SA 4.0)", mikä kertoo alustan ja
// lisenssin muttei tekijää — eli 112 kuvaa 186:sta näytettiin ehtojen
// vastaisesti. Tekijä on Commonsin omissa tiedoissa (extmetadata:Artist),
// joten se haetaan sieltä ja kirjoitetaan lähdekenttään:
//
//   'Wikimedia Commons (CC BY-SA 4.0)'
//   → 'Diego Delso, Wikimedia Commons (CC BY-SA 4.0)'
//
// Public domain- ja CC0-kuviin tekijää ei lisätä: ne eivät vaadi sitä,
// ja lyhyt merkintä pysyy luettavampana.
//
//   node tools/lisaa-tekijat.mjs           # näyttää mitä tekisi
//   node tools/lisaa-tekijat.mjs --kirjoita
//
// Samalla kerrotaan, jos paketissa merkitty lisenssi ei täsmää
// Commonsin omaan — silloin merkintä on väärä eikä vain vajaa.

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const KIRJOITA = process.argv.includes('--kirjoita');
const AGENTTI = 'Matkakirja/1.0 (https://github.com/ravelius/Matkakirja)';

const nuku = (s) => execFileSync('sleep', [String(s)]);
const hae = (url) => JSON.parse(execFileSync('curl',
  ['-sS', '--max-time', '45', '--retry', '2', '--retry-delay', '3', '-A', AGENTTI, url],
  { maxBuffer: 5e7 }).toString());

/** Vaatiiko lisenssi tekijän nimeämisen? */
const vaatiiTekijan = (lisenssi) => /CC BY/i.test(lisenssi);

/** Onko lähdemerkinnässä jo tekijä? Tunnistetaan siitä, ettei se ala arkiston nimellä. */
function onJoTekija(lahde) {
  const alku = lahde.split('(')[0].trim().replace(/,$/, '');
  if (!alku) return false;
  const arkistot = /^(Wikimedia Commons|Commons|Library of Congress|BnF|BnF Gallica|Bundesarchiv|Rijksmuseum|Nationaal Archief|archive\.org|Freesound|radio aporee)$/i;
  return !arkistot.test(alku);
}

/**
 * Commonsin Artist-kentästä pelkkä nimi.
 *
 * Kenttä on vapaata HTML:ää, ja kuvaajat kirjoittavat siihen mitä
 * sattuu: kokonaisia käyttöehtoja ("This Photo was taken by X. Feel
 * free to use it…"), allekirjoituksia aikaleimoineen, tiedostonimiä ja
 * kotipaikkoja. Lähdemerkintään kuuluu vain nimi — muu tekee siitä
 * lukukelvottoman ja katkeaisi kesken.
 */
function siisti(arvo) {
  let s = (arvo ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // "File:jokin.jpg : Nimi ..." — tiedostonimi edellä
  s = s.replace(/^File:[^:]+:\s*/i, '');
  // "This Photo was taken by X", "Photo by X", "Foto: X", "© X"
  s = s.replace(/^(this (photo|image|picture) (was )?(taken|created) by|photo(graph)? by|foto:|bild:|©)\s*/i, '');
  // Ensimmäinen virke riittää: loppu on käyttöehtoja tai kiitoksia.
  s = s.split(/(?:\.\s|\s\.\s)/)[0].trim();
  // Allekirjoituksen aikaleima ("Nimi 11:52, 3 July 2012 (UTC)")
  s = s.replace(/\s+\d{1,2}:\d{2},.*$/, '');
  // Kotipaikka ei kuulu nimeen ("Tony Hisgett from Birmingham, UK")
  s = s.replace(/\s+from\s+.*$/i, '');
  // Wikipedia-tunnus suluissa ("J Williams (= Hammy07 at en.wikipedia)")
  s = s.replace(/\s*\((=\s*)?[^)]*\b(at|wikipedia|wikimedia)\b[^)]*\)/i, '');
  // Verkko-osoite ei ole nimi
  s = s.replace(/,?\s*(https?:\/\/|www\.)\S*/gi, '');
  s = s.replace(/[,;.]\s*$/, '').replace(/\s+\.$/, '').trim();

  // Useita tekijöitä: nimetään ensimmäinen ja todetaan muut. Nimien
  // katkaiseminen kesken olisi väärin juuri sitä kohtaan, jota
  // lisenssi käskee nimetä.
  const osat = s.split(/,\s*/).filter(Boolean);
  if (osat.length > 2 || s.length > 44) {
    return osat.length > 1 ? `${osat[0]} ym.` : osat[0] ?? '';
  }
  return s;
}

// --- kerätään tiedosto–lähde-parit ------------------------------------------

/**
 * Paketeissa `tiedosto` ja sitä koskeva `lahde` ovat samassa oliossa,
 * mutta niiden välissä voi olla muita kenttiä. Otetaan kutakin
 * tiedostoa lähinnä seuraava lähde ennen seuraavaa tiedostoa.
 */
function parit(sisalto) {
  const merkit = [];
  for (const m of sisalto.matchAll(/(tiedosto|lahde): '((?:[^'\\]|\\.)*)'/g)) {
    merkit.push({ laji: m[1], arvo: m[2].replace(/\\(['"\\])/g, '$1'), kohta: m.index, koko: m[0] });
  }
  const ulos = [];
  for (let i = 0; i < merkit.length; i += 1) {
    if (merkit[i].laji !== 'tiedosto') continue;
    const seuraava = merkit.slice(i + 1).find((x) => x.laji === 'lahde');
    const seuraavaTiedosto = merkit.slice(i + 1).find((x) => x.laji === 'tiedosto');
    if (!seuraava) continue;
    if (seuraavaTiedosto && seuraavaTiedosto.kohta < seuraava.kohta) continue;
    ulos.push({ tiedosto: merkit[i].arvo, lahde: seuraava.arvo, lahdeKoko: seuraava.koko });
  }
  return ulos;
}

const tiedostot = readdirSync(join(JUURI, 'js/packs')).filter((f) => f.endsWith('.js'));
const kaikki = new Map(); // tiedostonimi -> lähdemerkintöjen joukko
const paketit = new Map();
for (const f of tiedostot) {
  const s = readFileSync(join(JUURI, 'js/packs', f), 'utf8');
  paketit.set(f, s);
  for (const p of parit(s)) {
    if (!kaikki.has(p.tiedosto)) kaikki.set(p.tiedosto, new Set());
    kaikki.get(p.tiedosto).add(p.lahde);
  }
}

const tarvitsevat = [...kaikki.entries()]
  .filter(([, lahteet]) => [...lahteet].some((l) => vaatiiTekijan(l) && !onJoTekija(l)));

console.log(`Kuvia paketeissa: ${kaikki.size}`);
console.log(`Näistä CC BY / CC BY-SA ilman tekijää: ${tarvitsevat.length}\n`);
if (!tarvitsevat.length) process.exit(0);

// --- haetaan tekijät Commonsista --------------------------------------------

const nimet = tarvitsevat.map(([t]) => t);
const tekijat = new Map();
const commonsLisenssi = new Map();
for (let i = 0; i < nimet.length; i += 25) {
  const era = nimet.slice(i, i + 25);
  let d;
  try {
    d = hae('https://commons.wikimedia.org/w/api.php?format=json&action=query'
      + '&prop=imageinfo&iiprop=extmetadata&iiextmetadatafilter=Artist|LicenseShortName'
      + '&titles=' + encodeURIComponent(era.map((t) => `File:${t}`).join('|')));
  } catch (e) {
    console.log(`  haku epäonnistui erässä ${i}: ${e.message.slice(0, 50)}`);
    nuku(5);
    continue;
  }
  const alkuun = new Map((d.query?.normalized ?? []).map((n) => [n.to, n.from]));
  for (const sivu of Object.values(d.query?.pages ?? {})) {
    const nimi = (alkuun.get(sivu.title) ?? sivu.title).replace(/^File:/, '');
    const m = sivu.imageinfo?.[0]?.extmetadata;
    if (!m) continue;
    const tekija = siisti(m.Artist?.value);
    if (tekija) tekijat.set(nimi, tekija);
    commonsLisenssi.set(nimi, siisti(m.LicenseShortName?.value));
  }
  process.stdout.write(`  haettu ${Math.min(i + 25, nimet.length)}/${nimet.length}\r`);
  nuku(2);
}
console.log('');

// --- kirjoitetaan lähdemerkinnät uusiksi -------------------------------------

let muutettu = 0;
const ristiriidat = [];
const ilmanTekijaa = [];

for (const [f, alkuperainen] of paketit) {
  let s = alkuperainen;
  for (const p of parit(alkuperainen)) {
    if (!vaatiiTekijan(p.lahde) || onJoTekija(p.lahde)) continue;
    const tekija = tekijat.get(p.tiedosto);
    const commons = commonsLisenssi.get(p.tiedosto);
    if (commons && !p.lahde.includes(commons)) {
      ristiriidat.push([p.tiedosto, p.lahde, commons]);
    }
    if (!tekija) { ilmanTekijaa.push(p.tiedosto); continue; }
    const uusi = `${tekija}, ${p.lahde}`;
    const vanhaKoko = p.lahdeKoko;
    const uusiKoko = `lahde: '${uusi.replace(/'/g, "\\'")}'`;
    if (!s.includes(vanhaKoko)) continue;
    s = s.replace(vanhaKoko, uusiKoko);
    muutettu += 1;
  }
  if (s !== alkuperainen && KIRJOITA) writeFileSync(join(JUURI, 'js/packs', f), s);
}

console.log(`Lähdemerkintöjä täydennetty: ${muutettu}`);
if (ilmanTekijaa.length) {
  console.log(`\nEi tekijätietoa Commonsissa (${ilmanTekijaa.length}) — tarkista käsin:`);
  for (const n of ilmanTekijaa.slice(0, 20)) console.log('  ?', n);
}
if (ristiriidat.length) {
  console.log(`\nLISENSSI EI TÄSMÄÄ (${ristiriidat.length}) — paketissa väärä tieto:`);
  for (const [n, oma, commons] of ristiriidat.slice(0, 20)) {
    console.log(`  ✗ ${n}\n      paketissa: ${oma}\n      Commons:   ${commons}`);
  }
}
console.log(KIRJOITA ? '\nKirjoitettu.' : '\nKuivaharjoitus — aja --kirjoita tehdäksesi muutokset.');
