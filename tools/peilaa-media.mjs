/*
 * Peilaa kaiken repon ulkopuolelta ladattavan aineiston yhteen paikkaan.
 *
 *   node tools/peilaa-media.mjs [--ulos <kansio>] [--vain kuvat|liput|aanet|tekstit]
 *
 * Omistajan päätös: peli ei saa mennä rikki, jos jokin palvelin kaatuu tai
 * tiedosto poistetaan. Siksi jokaisesta ulkopuolisesta kuvasta ja äänestä
 * otetaan oma kopio, ja peli hakee ensin kopion. Alkuperäinen osoite jää
 * varareitiksi.
 *
 * TEKSTEJÄ EI PEILATA. Omistajan linjaus: kaikki wiki-tekstit kirjoitetaan
 * itse lyhyemmiksi ja pelin tyylin mukaisiksi, ja englanninkielisestä
 * Wikipediasta haetaan lisäaineistoa tarvittaessa. Siksi --vain tekstit
 * lataa raaka-aineen kansioon lahteet/, josta tekstit kirjoitetaan
 * paketteihin (ARTIKKELIT ja OMAT_TIIVISTELMAT). Sitä kansiota ei viedä
 * media-repoon eikä peli lue sitä.
 *
 * Työkalu on turvallinen ajaa uudestaan: valmiit tiedostot ohitetaan.
 * Lopuksi kirjoitetaan manifesti.json, jossa on jokaisen tiedoston
 * alkuperäinen osoite, lisenssi ja tekijä — lähdemaininnat eivät katoa
 * peilatessa.
 *
 * Tulos viedään omaan media-repoon (ravelius/matkakirja-media) ja
 * julkaistaan GitHub Pagesissa. Osoite kirjoitetaan js/media.js:n
 * MEDIA_PEILI-vakioon.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const arvo = (lippu, oletus) => {
  const i = argv.indexOf(lippu);
  return i >= 0 ? argv[i + 1] : oletus;
};
const ULOS = arvo('--ulos', join(JUURI, '..', 'matkakirja-media'));
const VAIN = arvo('--vain', null);
const AGENTTI = 'Matkakirja/1.0 (https://github.com/ravelius/Matkakirja)';

/**
 * Yksi HTTP-haku curlilla. node:n fetch ei pääse hiekkalaatikon läpi.
 *
 * Yksittäinen epäonnistuminen ei saa kaataa koko ajoa: isoja
 * äänitiedostoja on kymmeniä megatavuja, ja ensimmäinen versio kuoli
 * aikakatkaisuun kesken 13 megatavun latauksen. Siksi aikaraja on
 * väljä ja virhe palautetaan koodina.
 */
function hae(url, tiedosto = null) {
  const args = ['-sSL', '--max-time', '300', '--retry', '2', '--retry-delay', '3',
    '-A', AGENTTI, url];
  if (tiedosto) args.push('-o', tiedosto, '-w', '%{http_code}');
  try {
    const ulos = execFileSync('curl', args, { maxBuffer: 3e8, timeout: 330000 });
    return tiedosto ? ulos.toString().trim() : ulos;
  } catch (e) {
    if (tiedosto) {
      // Keskeneräinen tiedosto pois, jottei sitä pidetä valmiina.
      try { rmSync(tiedosto, { force: true }); } catch { /* ei ollut */ }
      return 'virhe';
    }
    throw e;
  }
}

const nuku = (ms) => execFileSync('sleep', [String(ms / 1000)]);

/** Turvallinen tiedostonimi mistä tahansa merkkijonosta. */
function turvanimi(teksti, pate) {
  const puhdas = teksti
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 90);
  return pate ? `${puhdas}.${pate}` : puhdas;
}

// --- kerätään kohteet paketeista -------------------------------------------

function kohteet() {
  const paketit = readdirSync(join(JUURI, 'js/packs'))
    .map((f) => readFileSync(join(JUURI, 'js/packs', f), 'utf8')).join('\n');
  const muut = ['js/aani-ehdokkaat.js', 'js/ui.js']
    .map((f) => readFileSync(join(JUURI, f), 'utf8')).join('\n');
  const kaikki = `${paketit}\n${muut}`;

  // Heittomerkilliset nimet ("Château d\'If") katkesivat yksinkertaisella
  // hakukuviolla ensimmäiseen hipsuun ja päätyivät 404:ään. Siksi
  // kelpuutetaan myös suojatut merkit ja puretaan suojaus.
  const pura = (t) => t.replace(/\\(['"\\])/g, '$1');
  const poimi = (kentta) => new Set([
    ...[...paketit.matchAll(new RegExp(`${kentta}: '((?:[^'\\\\]|\\\\.)*)'`, 'g'))].map((m) => pura(m[1])),
    ...[...paketit.matchAll(new RegExp(`${kentta}: "((?:[^"\\\\]|\\\\.)*)"`, 'g'))].map((m) => pura(m[1])),
  ]);
  const kuvat = poimi('tiedosto');
  const liput = poimi('lippu');
  const aanet = new Set(
    [...kaikki.matchAll(/https?:\/\/(?:cdn\.freesound\.org|archive\.org)\/[^'"\s)#]+/g)]
      .map((m) => m[0]),
  );
  const wikit = new Set([...paketit.matchAll(/\n\s+wiki: '([^']+)'/g)].map((m) => m[1]));
  for (const nimi of ['africa-artikkelit', 'europe-artikkelit']) {
    const s = readFileSync(join(JUURI, `js/packs/${nimi}.js`), 'utf8');
    for (const m of s.matchAll(/^ {2}('?)([A-ZÅÄÖ][^:']*)\1: \{/gm)) wikit.add(m[2]);
  }
  return {
    kuvat: [...kuvat], liput: [...liput], aanet: [...aanet], wikit: [...wikit],
  };
}

// --- lataus ------------------------------------------------------------------

/**
 * Manifesti täydentyy, se ei korvaudu. Kun ajetaan vain yksi laji
 * (`--vain kuvat`), muiden lajien merkinnät on säilytettävä: muuten
 * ääni- ja lippurivit katoaisivat, vaikka tiedostot ovat levyllä.
 */
function lueManifesti() {
  const pohja = { luotu: null, kuvat: {}, liput: {}, aanet: {}, tekstit: {} };
  const polku = join(ULOS, 'manifesti.json');
  if (!existsSync(polku)) return pohja;
  try {
    const vanha = JSON.parse(readFileSync(polku, 'utf8'));
    for (const laji of ['kuvat', 'liput', 'aanet', 'tekstit']) {
      Object.assign(pohja[laji], vanha[laji] ?? {});
    }
  } catch { /* rikkinäinen manifesti kirjoitetaan yli */ }
  return pohja;
}

const manifesti = lueManifesti();
const virheet = [];

function commonsMeta(nimet) {
  const url = 'https://commons.wikimedia.org/w/api.php?format=json&action=query'
    + '&prop=imageinfo&iiprop=url|extmetadata&titles='
    + encodeURIComponent(nimet.map((t) => `File:${t}`).join('|'));
  try {
    const d = JSON.parse(hae(url).toString());
    const ulos = {};
    for (const sivu of Object.values(d.query?.pages ?? {})) {
      const nimi = sivu.title.replace(/^File:/, '');
      if (sivu.missing !== undefined || !sivu.imageinfo) { ulos[nimi] = null; continue; }
      const m = sivu.imageinfo[0].extmetadata ?? {};
      const puhdista = (v) => (v ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      ulos[nimi] = {
        lisenssi: puhdista(m.LicenseShortName?.value),
        tekija: puhdista(m.Artist?.value).slice(0, 120),
      };
    }
    return ulos;
  } catch {
    return {};
  }
}

async function lataaKuvat(nimet, alikansio, leveys) {
  const kansio = join(ULOS, alikansio);
  mkdirSync(kansio, { recursive: true });
  for (let i = 0; i < nimet.length; i += 20) {
    const era = nimet.slice(i, i + 20);
    const meta = commonsMeta(era);
    for (const nimi of era) {
      const pate = (nimi.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
      const kohde = turvanimi(nimi.replace(/\.[^.]+$/, ''), pate === 'svg' ? 'png' : pate);
      const polku = join(kansio, kohde);
      manifesti[alikansio][nimi] = {
        tiedosto: `${alikansio}/${kohde}`,
        alkuperainen: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(nimi)}`,
        ...(meta[nimi] ?? {}),
      };
      if (existsSync(polku)) continue;
      const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(nimi)}?width=${leveys}`;
      const koodi = hae(url, polku);
      if (koodi !== '200') {
        // curl kirjoittaa myös virhesivun kohteeseen. Se näyttäisi
        // seuraavalla ajolla valmiilta tiedostolta, joten se poistetaan.
        rmSync(polku, { force: true });
        virheet.push(`${alikansio}: ${nimi} → HTTP ${koodi}`);
      } else {
        kokoYhteensa += statSync(polku).size;
      }
      nuku(350);
    }
    console.log(`  ${alikansio}: ${Math.min(i + 20, nimet.length)}/${nimet.length}`);
  }
}

let kokoYhteensa = 0;

function lataaAanet(urlit) {
  const kansio = join(ULOS, 'aanet');
  mkdirSync(kansio, { recursive: true });
  for (const [i, url] of urlit.entries()) {
    const loppu = url.split('/').pop() ?? 'aani.mp3';
    const pate = (loppu.split('.').pop() ?? 'mp3').toLowerCase();
    const tunnus = url.includes('freesound')
      ? `freesound-${url.match(/previews\/\d+\/(\d+)/)?.[1] ?? i}`
      : `aporee-${url.match(/download\/([^/]+)/)?.[1] ?? i}`;
    const kohde = turvanimi(tunnus, pate === 'mp3' ? 'mp3' : pate);
    const polku = join(kansio, kohde);
    manifesti.aanet[url] = { tiedosto: `aanet/${kohde}`, alkuperainen: url };
    if (existsSync(polku)) continue;
    const koodi = hae(url, polku);
    if (koodi !== '200') virheet.push(`aanet: ${url} → ${koodi}`);
    else kokoYhteensa += statSync(polku).size;
    nuku(400);
    if ((i + 1) % 10 === 0) console.log(`  aanet: ${i + 1}/${urlit.length}`);
  }
}

/**
 * Raaka-aine omien artikkelien kirjoittamiseen: sekä suomen- että
 * englanninkielinen Wikipedia-teksti jokaisesta otsikosta samaan
 * tiedostoon. Englanninkielinen on usein paljon laajempi, ja juuri siitä
 * poimitaan lisää kun suomenkielinen on tynkä.
 *
 * Tulos EI ole pelin sisältöä vaan kirjoituspöydän aineistoa.
 */
function lataaTekstit(otsikot) {
  const kansio = join(ULOS, 'lahteet');
  mkdirSync(kansio, { recursive: true });
  for (const [i, otsikko] of otsikot.entries()) {
    const kohde = `${turvanimi(otsikko)}.json`;
    manifesti.tekstit[otsikko] = { tiedosto: `lahteet/${kohde}`, alkuperainen: null };
    const polku = join(kansio, kohde);
    if (existsSync(polku)) continue;
    // Molemmat kielet talteen: englanninkielinen on lähes aina laajempi,
    // ja siitä poimitaan lisäaineistoa kun suomenkielinen on tynkä.
    const tulos = { otsikko, fi: null, en: null };
    for (const kieli of ['fi', 'en']) {
      try {
        const d = JSON.parse(hae(
          `https://${kieli}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(otsikko)}`,
        ).toString());
        if (d.type === 'disambiguation' || !d.extract) { nuku(250); continue; }
        tulos[kieli] = { title: d.title, tiivistelma: d.extract, artikkeli: null };
        if (kieli === 'fi') {
          manifesti.tekstit[otsikko].alkuperainen = `https://fi.wikipedia.org/wiki/${encodeURIComponent(otsikko)}`;
        }
      } catch { /* kokeillaan seuraavaa kieltä */ }
      nuku(250);
      if (!tulos[kieli]) continue;
      try {
        const d = JSON.parse(hae(
          `https://${kieli}.wikipedia.org/w/api.php?format=json&action=query&prop=extracts`
          + `&explaintext=1&exsectionformat=plain&redirects=1&titles=${encodeURIComponent(otsikko)}`,
        ).toString());
        const sivu = Object.values(d.query?.pages ?? {})[0];
        if (sivu?.extract) tulos[kieli].artikkeli = sivu.extract.slice(0, 30000);
      } catch { /* pelkkä tiivistelmä riittää */ }
      nuku(250);
    }
    if (!tulos.fi && !tulos.en) virheet.push(`lahteet: ${otsikko} → ei artikkelia kummallakaan kielellä`);
    writeFileSync(polku, JSON.stringify(tulos, null, 1));
    if ((i + 1) % 10 === 0) console.log(`  tekstit: ${i + 1}/${otsikot.length}`);
  }
}

// --- ajo ---------------------------------------------------------------------

const k = kohteet();
console.log(`Peilataan: ${k.kuvat.length} kuvaa, ${k.liput.length} lippua, `
  + `${k.aanet.length} ääntä, ${k.wikit.length} tekstiä → ${ULOS}`);
mkdirSync(ULOS, { recursive: true });

if (!VAIN || VAIN === 'kuvat') await lataaKuvat(k.kuvat, 'kuvat', 1200);
if (!VAIN || VAIN === 'liput') await lataaKuvat(k.liput, 'liput', 320);
if (!VAIN || VAIN === 'aanet') lataaAanet(k.aanet);
if (!VAIN || VAIN === 'tekstit') lataaTekstit(k.wikit);

manifesti.luotu = new Date().toISOString().slice(0, 10);
writeFileSync(join(ULOS, 'manifesti.json'), JSON.stringify(manifesti, null, 1));

if (!existsSync(join(ULOS, 'README.md'))) {
  writeFileSync(join(ULOS, 'README.md'), `# Matkakirja — media

Tämä repo on [Matkakirja](https://github.com/ravelius/Matkakirja)-pelin
kuvien, äänien ja tekstien kopio yhdessä paikassa. Peli hakee aineiston
täältä, jottei se mene rikki jos alkuperäinen palvelin kaatuu tai
tiedosto poistetaan. Alkuperäinen osoite jää varareitiksi.

Kaikki aineisto on avoimella lisenssillä. Jokaisen tiedoston
alkuperäinen osoite, lisenssi ja tekijä ovat tiedostossa
\`manifesti.json\`.

Kansiot:

- \`kuvat/\` — Wikimedia Commonsin valokuvat ja kulttuurikuvat
- \`liput/\` — lippukuvat
- \`aanet/\` — äänimaisemat (Freesound) ja kenttä-äänitykset (radio aporee)
Pelin tekstit eivät ole täällä: ne kirjoitetaan itse pelin tyyliin ja
asuvat pelirepossa.

Aineisto päivitetään komennolla \`node tools/peilaa-media.mjs\`
pelin repossa.
`);
}

console.log(`\nValmis. Ladattu ${(kokoYhteensa / 1e6).toFixed(1)} Mt. Virheitä: ${virheet.length}`);
for (const v of virheet.slice(0, 30)) console.log('  ', v);
