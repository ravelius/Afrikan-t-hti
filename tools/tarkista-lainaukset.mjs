/*
 * Tarkistaa, että maastotekstien lainaukset ovat yhä lähteissään.
 *
 *   NODE_USE_ENV_PROXY=1 node tools/tarkista-lainaukset.mjs [--kuvat] [--nopea]
 *
 * MIKSI TÄMÄ ON OLEMASSA
 *
 * Kuusi kirjoittajaa kirjoitti maastotekstit toisistaan tietämättä, ja
 * jokainen kirjoitti 15-30 lainausta 1800-luvun matkakirjallisuudesta.
 * Keksitty lainaus on juuri se virhe, jota kukaan ei huomaa: se on
 * uskottava, se on suomeksi, eikä sitä voi erottaa oikeasta katsomalla.
 * Elokuussa 2026 kaikki 140 luettiin lähdetekstistä. Puolen vuoden
 * päästä kukaan ei muista, että niin tehtiin — siksi tarkistus on
 * työkalu eikä muistiinpano.
 *
 * MITEN
 *
 * Suomennosta ei voi verrata koneella englantilaiseen alkutekstiin.
 * Siksi tarkistus nojaa tools/lainausankkurit.json:iin: jokaiselle
 * lainaukselle on kirjattu se alkukielinen jakso, josta se on
 * suomennettu, ja lyhyt sanatarkka `fraasi` sen sisältä. Työkalu
 * lataa lähteen uudelleen ja katsoo, että fraasi ja ote ovat yhä
 * siellä.
 *
 * Neljä asiaa menee kiinni:
 *
 *  1. Lainaus, jolle ei ole ankkuria. Uusi kirjoittaja on lisännyt
 *     lainauksen tarkistamatta sitä. Tämä on VIRHE, ei puute.
 *  2. Ankkuri, jota ei enää löydy lähteestä. Linkki osoittaa eri
 *     laitokseen kuin luettu, tai teksti on vaihtunut.
 *  3. Lähde, jota ei saa ladattua. Linkki on rikki.
 *  4. Lainauksen puuttuvat kentät (kuka, teos, vuosi, linkki).
 *
 * Lisäksi --kuvat tarkistaa kuvat Commonsista samalla säännöllä kuin
 * tools/kirjoita-kuvakortit.mjs: olemassaolo, yli 1200 px, ei ND.
 *
 * Ladatut lähdetekstit jäävät välimuistiin (.lainausvalimuisti/), joka
 * on .gitignoressa. --nopea käyttää vain välimuistia eikä avaa verkkoa.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Noden fetch ei lue HTTPS_PROXYa ilman lippua; ks. tools/hae-radiot.mjs.
if (!process.env.NODE_USE_ENV_PROXY && (process.env.HTTPS_PROXY || process.env.https_proxy)) {
  const ajo = spawnSync(process.execPath, [fileURLToPath(import.meta.url), ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1', NODE_NO_WARNINGS: '1' },
  });
  process.exit(ajo.status ?? 1);
}

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const VALIMUISTI = join(JUURI, '.lainausvalimuisti');
const PAKETIT = ['js/packs/maasto-tekstit.js', 'js/packs/maasto-tekstit-malli.js'];
const ANKKURIT = 'tools/lainausankkurit.json';
const KUVARAJA = 1200;
const ND = /\bND\b|NoDeriv/i;

const kuvatMukaan = process.argv.includes('--kuvat');
const nopea = process.argv.includes('--nopea');
const nuku = (ms) => new Promise((r) => { setTimeout(r, ms); });

// --- lähteen nimi ja lataus -----------------------------------------------------

/** Linkistä vakaa tiedostonimi. Sama sääntö kuin ankkureita kirjoitettaessa. */
function lahdeId(linkki) {
  let m;
  if ((m = linkki.match(/gutenberg\.org\/ebooks\/(\d+)/))) return `gb-${m[1]}`;
  if ((m = linkki.match(/archive\.org\/details\/([^/?#]+)/))) return `ia-${m[1]}`;
  if ((m = linkki.match(/wikisource\.org\/wiki\/(.+)$/))) return `ws-${m[1].replace(/[^A-Za-z0-9]/g, '_').slice(0, 60)}`;
  return `muu-${linkki.replace(/[^A-Za-z0-9]/g, '_').slice(0, 60)}`;
}

/** Mistä koko teksti haetaan. Gutenbergin sivu ei kelpaa, tarvitaan .txt. */
function latausosoite(linkki) {
  let m;
  if ((m = linkki.match(/gutenberg\.org\/ebooks\/(\d+)/))) return `https://www.gutenberg.org/cache/epub/${m[1]}/pg${m[1]}.txt`;
  if ((m = linkki.match(/archive\.org\/details\/([^/?#]+)/))) return `https://archive.org/download/${m[1]}/${m[1]}_djvu.txt`;
  if ((m = linkki.match(/wikisource\.org\/wiki\/(.+)$/))) return `https://en.wikisource.org/wiki/Special:Export/${m[1]}`;
  return linkki;
}

/** Vertailumuoto: välilyönnit yhteen, ei rivinvaihtoja. OCR:n tavuviivat jäävät. */
const litista = (s) => s.replace(/\s+/g, ' ');

function siivoaLahde(id, teksti) {
  let t = teksti;
  if (id.startsWith('ws-')) t = (t.match(/<text[^>]*>([\s\S]*?)<\/text>/) ?? ['', t])[1];
  if (id.startsWith('muu-')) t = t.replace(/<[^>]+>/g, ' ');
  return litista(t);
}

async function haeTeksti(osoite, yrityksia = 4) {
  for (let i = 0; i < yrityksia; i++) {
    try {
      const v = await fetch(osoite, { headers: { 'user-agent': 'Matkakirja/1.0 (opetuspeli)' } });
      if (v.ok) return v.text();
      if (v.status !== 429 && v.status < 500) return null;
    } catch { /* yhteys katkesi, yritetään uudelleen */ }
    await nuku(2000 * (i + 1));
  }
  return null;
}

const muisti = new Map();
async function lahde(id, linkki) {
  if (muisti.has(id)) return muisti.get(id);
  const polku = join(VALIMUISTI, `${id}.txt`);
  if (existsSync(polku) && statSync(polku).size > 1000) {
    const t = siivoaLahde(id, readFileSync(polku, 'utf8'));
    muisti.set(id, t);
    return t;
  }
  if (nopea) { muisti.set(id, null); return null; }
  const raaka = await haeTeksti(latausosoite(linkki));
  if (!raaka || raaka.length < 1000) { muisti.set(id, null); return null; }
  mkdirSync(VALIMUISTI, { recursive: true });
  writeFileSync(polku, raaka);
  await nuku(300);
  const t = siivoaLahde(id, raaka);
  muisti.set(id, t);
  return t;
}

// --- lainaukset paketeista ------------------------------------------------------

const lainaukset = [];
for (const polku of PAKETIT) {
  if (!existsSync(join(JUURI, polku))) { console.log(`ohitetaan, ei ole: ${polku}`); continue; }
  const paketti = await import(`file://${join(JUURI, polku)}`);
  const taulu = Object.values(paketti)[0];
  for (const [laji, kohteet] of Object.entries(taulu)) {
    for (const [avain, kohde] of Object.entries(kohteet)) {
      for (const pala of kohde.kappaleet ?? []) {
        if (pala.lainaus) lainaukset.push({ id: `${laji}/${avain}`, polku, pala });
      }
    }
  }
}

const ankkurit = JSON.parse(readFileSync(join(JUURI, ANKKURIT), 'utf8'));
console.log(`${lainaukset.length} lainausta, ${Object.keys(ankkurit).filter((k) => !k.startsWith('_')).length} ankkuria\n`);

// --- tarkistus ------------------------------------------------------------------

const virheet = [];
let kunnossa = 0;

for (const { id, polku, pala } of lainaukset) {
  const vajaat = ['kuka', 'teos', 'vuosi', 'linkki'].filter((k) => !pala[k]);
  if (vajaat.length) virheet.push(`${id}: lainaukselta puuttuu ${vajaat.join(', ')} (${polku})`);

  const a = ankkurit[id];
  if (!a) {
    virheet.push(`${id}: EI ANKKURIA — lainausta ei ole tarkistettu lähteestä (${polku})`);
    continue;
  }
  if (pala.linkki && a.linkki && pala.linkki !== a.linkki) {
    virheet.push(`${id}: linkki on vaihtunut ankkurin kirjaamisen jälkeen`);
  }
  const teksti = await lahde(a.lahde, a.linkki ?? pala.linkki);
  if (teksti === null) { virheet.push(`${id}: lähdettä ei saatu (${a.lahde})`); continue; }
  if (!teksti.includes(a.fraasi)) {
    virheet.push(`${id}: fraasia ei löydy lähteestä ${a.lahde} — "${a.fraasi}"`);
    continue;
  }
  if (a.ote && !teksti.includes(litista(a.ote))) {
    virheet.push(`${id}: fraasi löytyy mutta ympäristö on muuttunut (${a.lahde})`);
    continue;
  }
  kunnossa++;
  process.stdout.write('.');
}
process.stdout.write('\n');

// --- ankkurit ilman lainausta ---------------------------------------------------

const elavat = new Set(lainaukset.map((l) => l.id));
for (const avain of Object.keys(ankkurit)) {
  if (avain.startsWith('_')) continue;
  if (!elavat.has(avain)) console.log(`  (ankkuri ilman lainausta: ${avain} — lainaus on poistettu, ankkurin voi poistaa)`);
}

// --- kuvat ----------------------------------------------------------------------

if (kuvatMukaan) {
  const kuvat = [];
  for (const polku of PAKETIT) {
    if (!existsSync(join(JUURI, polku))) continue;
    const paketti = await import(`file://${join(JUURI, polku)}`);
    const taulu = Object.values(paketti)[0];
    for (const [laji, kohteet] of Object.entries(taulu)) {
      for (const [avain, kohde] of Object.entries(kohteet)) {
        for (const pala of kohde.kappaleet ?? []) {
          if (pala.tiedosto) kuvat.push({ id: `${laji}/${avain}`, tiedosto: pala.tiedosto });
        }
      }
    }
  }
  const nimet = [...new Set(kuvat.map((k) => k.tiedosto))];
  console.log(`\n${nimet.length} eri kuvaa Commonsista`);
  const siivoa = (s) => (s?.value ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const tiedot = new Map();
  for (let i = 0; i < nimet.length; i += 50) {
    const pala = nimet.slice(i, i + 50).map((t) => `File:${t}`);
    const vastaus = await haeTeksti('https://commons.wikimedia.org/w/api.php?action=query'
      + '&prop=imageinfo&iiprop=size|extmetadata&iiextmetadatafilter=LicenseShortName'
      + `&titles=${encodeURIComponent(pala.join('|'))}&format=json`);
    if (!vastaus) { virheet.push(`Commons-haku ei vastannut (${i})`); continue; }
    const data = JSON.parse(vastaus);
    const polut = new Map();
    for (const r of data?.query?.normalized ?? []) polut.set(r.from, r.to);
    for (const r of data?.query?.redirects ?? []) polut.set(r.from, r.to);
    const sivut = new Map();
    for (const s of Object.values(data?.query?.pages ?? {})) sivut.set(s.title, s);
    for (const nimi of pala) {
      let a = nimi;
      for (let k = 0; k < 4 && polut.has(a); k++) a = polut.get(a);
      tiedot.set(nimi.replace(/^File:/, ''), sivut.get(a)?.imageinfo?.[0] ?? null);
    }
    await nuku(400);
  }
  let kuvatKunnossa = 0;
  for (const k of kuvat) {
    const info = tiedot.get(k.tiedosto);
    if (!info) { virheet.push(`${k.id}: kuvaa ei ole Commonsissa — ${k.tiedosto}`); continue; }
    if (info.width < KUVARAJA) { virheet.push(`${k.id}: kuva vain ${info.width} px — ${k.tiedosto}`); continue; }
    if (ND.test(siivoa(info.extmetadata?.LicenseShortName))) { virheet.push(`${k.id}: ND-lisenssi — ${k.tiedosto}`); continue; }
    kuvatKunnossa++;
  }
  console.log(`${kuvatKunnossa}/${kuvat.length} kuvaa kunnossa`);
}

// --- tulos ----------------------------------------------------------------------

console.log(`\n${kunnossa}/${lainaukset.length} lainausta löytyi lähteestään.`);
if (virheet.length) {
  console.log(`\n${virheet.length} virhettä:`);
  for (const v of virheet) console.log(`  ${v}`);
  process.exit(1);
}
console.log('Ei virheitä.');
