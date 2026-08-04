/*
 * Kirjoittaa uuden valokuvapaketin apureiden kokoamista kuvakorteista.
 *
 *   node tools/kirjoita-kuvakortit.mjs <ehdotukset.json> <ulos.js> <VIENTINIMI> [--kuiva]
 *
 * esim.
 *   node tools/kirjoita-kuvakortit.mjs tools/asia-kuvakortit.json \
 *     js/packs/asia-valokuvat.js ASIA_VALOKUVAT
 *
 * Ero tools/lisaa-kuvapinoon.mjs -työkaluun: se LISÄÄ kuvia jo
 * olemassa oleviin kortteihin, tämä LUO kortit tyhjästä laudalle,
 * jolla niitä ei ole lainkaan.
 *
 * Ehdotukseen ei luoteta. Jokainen tiedosto tarkistetaan Commonsista
 * ennen kirjoittamista, ja tarkistuksia on neljä, koska ne ovat neljä
 * eri kysymystä eikä yksi vastaa toiseen:
 *
 *  1. Onko tiedosto olemassa? Keksitty nimi näyttää uskottavalta —
 *     kuvahaussa yksi 194:stä oli sellainen.
 *  2. Onko se riittävän iso? Kortti avataan koko ruudulle.
 *  3. Onko lisenssi vapaa? ND kieltää muokkaukset, ja peili skaalaa.
 *  4. Onko VANHAKSI merkitty kuva oikeasti vanha? Tiedostonimi ei
 *     kerro ikää — Darfurin sulttaanin muotokuva oli vuodelta 2016.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VANHA_RAJA, kuvanVuosi } from './kuvan-ika.mjs';

// Noden fetch ei lue HTTPS_PROXYa; ks. tools/hae-radiot.mjs.
if (!process.env.NODE_USE_ENV_PROXY && (process.env.HTTPS_PROXY || process.env.https_proxy)) {
  const ajo = spawnSync(process.execPath, [fileURLToPath(import.meta.url), ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1', NODE_NO_WARNINGS: '1' },
  });
  process.exit(ajo.status ?? 1);
}

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const kuiva = process.argv.includes('--kuiva');
const [lahde, kohde, vientinimi] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!lahde || !kohde || !vientinimi) {
  console.error('käyttö: node tools/kirjoita-kuvakortit.mjs <sisaan.json> <ulos.js> <VIENTINIMI>');
  process.exit(1);
}

const RAJA = 1200;
// Ikäraja ja vuosiluvun lukeminen: tools/kuvan-ika.mjs.
const ND = /\bND\b|NoDeriv/i;
const nuku = (ms) => new Promise((r) => { setTimeout(r, ms); });
const siivoa = (s) => (s?.value ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

async function hae(osoite, yrityksia = 5) {
  for (let i = 0; i < yrityksia; i++) {
    try {
      const v = await fetch(osoite, { headers: { 'user-agent': 'Matkakirja/1.0 (opetuspeli)' } });
      if (v.ok) return v.json();
      if (v.status !== 429 && v.status < 500) { console.log(`  HTTP ${v.status}`); return null; }
    } catch (virhe) {
      console.log(`  yhteys katkesi (${virhe?.cause?.code ?? virhe?.name ?? '?'})`);
    }
    await nuku(2500 * (i + 1));
  }
  return null;
}

async function tarkista(nimet) {
  const ulos = new Map();
  for (let i = 0; i < nimet.length; i += 50) {
    const pala = nimet.slice(i, i + 50).map((t) => `File:${t}`);
    const data = await hae('https://commons.wikimedia.org/w/api.php?action=query'
      + '&prop=imageinfo&iiprop=size|extmetadata'
      + '&iiextmetadatafilter=LicenseShortName|DateTimeOriginal|ImageDescription'
      + `&titles=${encodeURIComponent(pala.join('|'))}&format=json`);
    if (!data) continue;
    const polku = new Map();
    for (const r of data?.query?.normalized ?? []) polku.set(r.from, r.to);
    for (const r of data?.query?.redirects ?? []) polku.set(r.from, r.to);
    const sivut = new Map();
    for (const s of Object.values(data?.query?.pages ?? {})) sivut.set(s.title, s);
    for (const nimi of pala) {
      let avain = nimi;
      for (let k = 0; k < 4 && polku.has(avain); k++) avain = polku.get(avain);
      ulos.set(nimi.replace(/^File:/, ''), sivut.get(avain)?.imageinfo?.[0] ?? null);
    }
    await nuku(500);
  }
  return ulos;
}

// --- tarkistus -----------------------------------------------------------------

const ehdotukset = JSON.parse(readFileSync(lahde, 'utf8'));
const kaikki = [];
for (const k of ehdotukset) {
  if (k.vanha?.tiedosto) kaikki.push(k.vanha.tiedosto);
  if (k.uusi?.tiedosto) kaikki.push(k.uusi.tiedosto);
  for (const l of k.lisat ?? []) if (l.tiedosto) kaikki.push(l.tiedosto);
}
const nimet = [...new Set(kaikki)];
console.log(`${ehdotukset.length} kaupunkia, ${nimet.length} eri kuvaa tarkistettavana\n`);
const tiedot = await tarkista(nimet);

const hylatyt = [];
function kelpaa(kuva, id, kohta) {
  if (!kuva?.tiedosto) return null;
  const info = tiedot.get(kuva.tiedosto);
  if (!info) { hylatyt.push(`${id}/${kohta}: tiedostoa ei ole — ${kuva.tiedosto}`); return null; }
  if (info.width < RAJA) { hylatyt.push(`${id}/${kohta}: vain ${info.width} px — ${kuva.tiedosto}`); return null; }
  const lisenssi = siivoa(info.extmetadata?.LicenseShortName);
  if (ND.test(lisenssi)) { hylatyt.push(`${id}/${kohta}: ND-lisenssi — ${kuva.tiedosto}`); return null; }
  // Vanhan kuvan ikä päiväyksestä, kuvauksesta ja nimestä; ks. kuvan-ika.mjs.
  if (kohta === 'vanha') {
    const vanhin = kuvanVuosi({
      paivays: siivoa(info.extmetadata?.DateTimeOriginal),
      kuvaus: siivoa(info.extmetadata?.ImageDescription),
      tiedosto: kuva.tiedosto,
    });
    if (vanhin !== null && vanhin > VANHA_RAJA) {
      hylatyt.push(`${id}/vanha: Commons sanoo ${vanhin} — ${kuva.tiedosto}`);
      return null;
    }
  }
  return {
    tiedosto: kuva.tiedosto,
    vuosi: kuva.vuosi ?? null,
    lahde: kuva.lahde ?? `Commons (${lisenssi})`,
    selite: kuva.selite,
  };
}

const kortit = new Map();
for (const k of ehdotukset) {
  const vanha = kelpaa(k.vanha, k.id, 'vanha');
  const uusi = kelpaa(k.uusi, k.id, 'uusi');
  const lisat = (k.lisat ?? []).map((l, i) => kelpaa(l, k.id, `lisa${i + 1}`)).filter(Boolean);
  /*
   * Kortti tarvitsee ainakin yhden kuvan. Pelkillä lisäkuvilla
   * varustettu kortti on kelvollinen: pino alkaa silloin niistä.
   */
  if (!vanha && !uusi && !lisat.length) { hylatyt.push(`${k.id}: ei yhtään kelvollista kuvaa`); continue; }
  kortit.set(k.id, { vanha, lisat, uusi });
}

const kpl = [...kortit.values()].reduce((s, v) => s + (v.vanha ? 1 : 0) + v.lisat.length + (v.uusi ? 1 : 0), 0);
console.log(`${kpl} kuvaa hyväksyttiin ${kortit.size} kaupunkiin.`);
// Hylätyt aina näkyviin: hiljainen karsinta näyttäisi täydeltä listalta.
if (hylatyt.length) {
  console.log(`\n${hylatyt.length} hylättyä:`);
  for (const h of hylatyt) console.log(`  ${h}`);
}
if (kuiva) process.exit(0);

// --- kirjoitus -----------------------------------------------------------------

const lainaa = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/** Pitkä teksti katkotaan 80 merkin riveiksi kuten muuallakin paketeissa. */
function katko(teksti, sisennys) {
  const tila = 78 - sisennys.length - 6;
  const rivit = [];
  let nyt = '';
  for (const sana of String(teksti).split(' ')) {
    if (nyt && (nyt.length + sana.length + 1) > tila) { rivit.push(nyt); nyt = sana; } else nyt = nyt ? `${nyt} ${sana}` : sana;
  }
  if (nyt) rivit.push(nyt);
  return rivit
    .map((r, i) => (i === 0
      ? lainaa(rivit.length === 1 ? r : `${r} `)
      : `${sisennys}  + ${lainaa(i === rivit.length - 1 ? r : `${r} `)}`))
    .join('\n');
}

function kuvaRivit(kuva, sisennys) {
  const r = [`${sisennys}tiedosto: ${lainaa(kuva.tiedosto)},`];
  if (kuva.vuosi) r.push(`${sisennys}vuosi: ${lainaa(kuva.vuosi)},`);
  r.push(`${sisennys}lahde: ${lainaa(kuva.lahde)},`);
  r.push(`${sisennys}selite: ${katko(kuva.selite, sisennys)},`);
  return r.join('\n');
}

const osat = [];
for (const [id, v] of [...kortit].sort(([a], [b]) => a.localeCompare(b))) {
  const r = [`  ${id}: {`];
  if (v.vanha) r.push(kuvaRivit(v.vanha, '    '));
  if (v.lisat.length) {
    r.push('    lisat: [');
    for (const l of v.lisat) {
      r.push('      {');
      r.push(kuvaRivit(l, '        '));
      r.push('      },');
    }
    r.push('    ],');
  }
  if (v.uusi) {
    r.push('    uusi: {');
    r.push(kuvaRivit(v.uusi, '      '));
    r.push('    },');
  }
  r.push('  },');
  osat.push(r.join('\n'));
}

const sisalto = `// Matkakirjan valokuvakortit (${vientinimi}).
//
// Sama rakenne kuin EUROPE_VALOKUVAT ja AFRICA_VALOKUVAT: vanha vedos
// isoisän ajoilta, päiväkirjan mainitsemat näkymät (lisat) ja sama
// paikka nykyään. Kuvat haetaan Commonsista sitä mukaa kuin pelaaja ne
// näkee, ja palvelutyöntekijä tallentaa kerran nähdyn omaan koriinsa.
//
// Kuvat on etsitty kaupungin päiväkirjamerkinnän pohjalta ja jokainen
// tiedosto tarkistettu Commonsista ennen kirjoittamista: olemassaolo,
// vähintään ${RAJA} pikseliä, vapaa lisenssi ilman ND-ehtoa, ja vanhaksi
// merkityn kuvan ikä.
//
// Tuotettu komennolla tools/kirjoita-kuvakortit.mjs. Älä muokkaa
// pistelistoja käsin — korjaa lähde ja aja uudelleen.
export const ${vientinimi} = {
${osat.join('\n')}
};
`;

writeFileSync(join(JUURI, kohde), sisalto);
console.log(`\nKirjoitettu ${kohde}: ${kortit.size} kaupunkia, ${kpl} kuvaa.`);
