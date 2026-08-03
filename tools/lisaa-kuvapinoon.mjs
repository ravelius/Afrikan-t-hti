/*
 * Lisää matkakirjan mainitsemien näkymien kuvat kuvapinoon.
 *
 *   node tools/lisaa-kuvapinoon.mjs <ehdotukset.json> [--kuiva]
 *
 * Omistajan toive: "Matkakirjassa mainitut näkymät ja asiat olisi kiva
 * saada kuvin matkakirjan kuviin, joita voi siis olla enemmän kuin
 * kaksi." Kortin `lisat`-kenttä (v183) ottaa vastaan listan kuvia
 * vanhan valokuvan ja nykypäivän väliin.
 *
 * Ehdotukset on tuotettu lukemalla kunkin kaupungin saapumisteksti ja
 * etsimällä siinä mainituille näkymille kuva. Tämä työkalu EI luota
 * ehdotukseen sellaisenaan: jokainen tiedosto tarkistetaan Commonsista
 * ennen kirjoittamista.
 *
 * Neljä ehtoa, ja jokainen on oma virheensä jos se jää kysymättä:
 *  1. Tiedosto on olemassa. Keksitty tiedostonimi näyttää oikealta.
 *  2. Vähintään 1200 pikseliä leveä (omistajan linjaus).
 *  3. Vapaa lisenssi, ei ND-ehtoa.
 *  4. Ei jo kortissa. Sama kuva kahdesti pinossa on virhe, ei rikkaus.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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
const lahde = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!lahde) { console.error('Anna ehdotustiedosto.'); process.exit(1); }

const RAJA = 1200;
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

/** Koko ja lisenssi nipuittain: Commons ottaa 50 nimeä kerralla. */
async function tarkista(nimet) {
  const ulos = new Map();
  for (let i = 0; i < nimet.length; i += 50) {
    const pala = nimet.slice(i, i + 50).map((t) => `File:${t}`);
    const data = await hae('https://commons.wikimedia.org/w/api.php?action=query'
      + '&prop=imageinfo&iiprop=size|extmetadata'
      + '&iiextmetadatafilter=LicenseShortName|DateTimeOriginal'
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

// --- kerää ja tarkista ---------------------------------------------------------

const ehdotukset = JSON.parse(readFileSync(lahde, 'utf8'));
const kaikkiNimet = [...new Set(ehdotukset.flatMap((k) => k.ehdotukset.map((e) => e.tiedosto)))];
console.log(`${ehdotukset.length} kaupunkia, ${kaikkiNimet.length} eri kuvaa tarkistettavana\n`);
const tiedot = await tarkista(kaikkiNimet);

const { EUROPE_VALOKUVAT } = await import('../js/packs/europe-valokuvat.js');
const { AFRICA_VALOKUVAT } = await import('../js/packs/africa-valokuvat.js');
const LAUDAT = [['europe', EUROPE_VALOKUVAT], ['africa', AFRICA_VALOKUVAT]];

/** Missä kortissa kaupunki on, ja mitkä tiedostot siinä jo ovat. */
function kortti(id) {
  for (const [lauta, taulu] of LAUDAT) {
    const v = taulu[id];
    if (!v) continue;
    const jo = new Set([v.tiedosto, v.uusi?.tiedosto, ...(v.lisat ?? []).map((k) => k.tiedosto)].filter(Boolean));
    return { lauta, jo };
  }
  return null;
}

const ND = /\bND\b|NoDeriv/i;
const hyvaksytyt = new Map();
const hylatyt = [];
for (const k of ehdotukset) {
  const paikka = kortti(k.id);
  if (!paikka) { hylatyt.push(`${k.id}: ei valokuvakorttia`); continue; }
  const kelpaa = [];
  for (const e of k.ehdotukset) {
    const info = tiedot.get(e.tiedosto);
    const lisenssi = siivoa(info?.extmetadata?.LicenseShortName);
    if (!info) { hylatyt.push(`${k.id}: tiedostoa ei ole — ${e.tiedosto}`); continue; }
    if (info.width < RAJA) { hylatyt.push(`${k.id}: vain ${info.width} px — ${e.tiedosto}`); continue; }
    if (ND.test(lisenssi)) { hylatyt.push(`${k.id}: ND-lisenssi (${lisenssi}) — ${e.tiedosto}`); continue; }
    if (paikka.jo.has(e.tiedosto)) { hylatyt.push(`${k.id}: jo kortissa — ${e.tiedosto}`); continue; }
    paikka.jo.add(e.tiedosto);
    kelpaa.push({
      tiedosto: e.tiedosto,
      vuosi: e.vuosi ?? null,
      lahde: e.lisenssi ?? `Commons (${lisenssi})`,
      selite: e.selite,
    });
  }
  if (kelpaa.length) hyvaksytyt.set(k.id, { lauta: paikka.lauta, kuvat: kelpaa });
}

const kpl = [...hyvaksytyt.values()].reduce((s, v) => s + v.kuvat.length, 0);
console.log(`${kpl} kuvaa hyväksyttiin ${hyvaksytyt.size} kaupunkiin.`);
// Hylätyt aina näkyviin: hiljainen karsinta näyttäisi täydeltä listalta.
if (hylatyt.length) {
  console.log(`\n${hylatyt.length} hylättyä:`);
  for (const h of hylatyt) console.log(`  ${h}`);
}
if (kuiva) process.exit(0);

// --- kirjoita paketteihin ------------------------------------------------------

const lainaa = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/*
 * Pitkä merkkijono katkotaan samaan tapaan kuin muuallakin paketeissa:
 * rivi ei ylitä 80:tä merkkiä, ja jatko liitetään plussalla.
 */
function katko(teksti, sisennys) {
  const tila = 78 - sisennys.length - 6;
  const sanat = teksti.split(' ');
  const rivit = [];
  let nyt = '';
  for (const s of sanat) {
    if (nyt && (nyt.length + s.length + 1) > tila) { rivit.push(nyt); nyt = s; } else nyt = nyt ? `${nyt} ${s}` : s;
  }
  if (nyt) rivit.push(nyt);
  return rivit.map((r, i) => (i === 0 ? lainaa(`${r} `) : `${sisennys}  + ${lainaa(i === rivit.length - 1 ? r : `${r} `)}`)).join('\n');
}

function lohko(kuvat, sisennys) {
  const rivit = [`${sisennys}lisat: [`];
  for (const k of kuvat) {
    rivit.push(`${sisennys}  {`);
    rivit.push(`${sisennys}    tiedosto: ${lainaa(k.tiedosto)},`);
    if (k.vuosi) rivit.push(`${sisennys}    vuosi: ${lainaa(k.vuosi)},`);
    rivit.push(`${sisennys}    lahde: ${lainaa(k.lahde)},`);
    rivit.push(`${sisennys}    selite: ${katko(k.selite, `${sisennys}    `)},`);
    rivit.push(`${sisennys}  },`);
  }
  rivit.push(`${sisennys}],`);
  return rivit.join('\n');
}

for (const [lauta, tiedosto] of [['europe', 'europe-valokuvat.js'], ['africa', 'africa-valokuvat.js']]) {
  const polku = join(JUURI, 'js', 'packs', tiedosto);
  let teksti = readFileSync(polku, 'utf8');
  let lisatty = 0;
  for (const [id, v] of hyvaksytyt) {
    if (v.lauta !== lauta) continue;
    /*
     * Ankkuriksi kaupungin oman tietueen `tiedosto:`-rivi, ei
     * `uusi:`-riviä: `uusi` on sisäkkäinen olio, ja sen sisään
     * kirjoittaminen tekisi kuvasta nykypäivän kuvan alikohteen.
     */
    const avain = new RegExp(`(\\n(\\s*)${id}: \\{\\n)`);
    const osuma = teksti.match(avain);
    if (!osuma) { console.log(`  ${id}: tietuetta ei löydy ${tiedosto}:sta`); continue; }
    const sisennys = `${osuma[2]}  `;
    teksti = teksti.replace(osuma[0], `${osuma[0]}${lohko(v.kuvat, sisennys)}\n`);
    lisatty += 1;
  }
  writeFileSync(polku, teksti);
  console.log(`${tiedosto}: ${lisatty} kaupunkia sai lisäkuvia`);
}
