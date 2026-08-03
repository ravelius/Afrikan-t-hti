/*
 * Kirjoittaa maatietopaketin apureiden kokoamista tunnusluvuista.
 *
 *   node tools/kirjoita-maatiedot.mjs <sisaan.json> <ulos.js> <VIENTINIMI> [--kuiva]
 *
 * Tunnusluvut näkyvät Tutki-ikkunan oikeassa palstassa: väkiluku,
 * pinta-ala, keskitulo, demokratiaindeksi ja tervehdykset kielineen.
 *
 * Kolme tarkistusta ennen kirjoittamista:
 *
 *  1. Onko tervehdyksen lippu olemassa Commonsissa? Lippu haetaan
 *     tiedostonimellä, ja väärä nimi jättää kortin puolityhjäksi.
 *  2. Onko sijoitus muodossa "25./195"? Käyttöliittymä näyttää sen
 *     sellaisenaan, joten muoto on osa aineistoa.
 *  3. Onko demokratialinkki oikean maan kuvaajaan? Väärä maatunnus
 *     linkissä vie pelaajan toisen maan sivulle, eikä sitä huomaa
 *     ennen kuin klikkaa.
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
const [lahde, kohde, vientinimi] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!lahde || !kohde || !vientinimi) {
  console.error('käyttö: node tools/kirjoita-maatiedot.mjs <sisaan.json> <ulos.js> <VIENTINIMI>');
  process.exit(1);
}

const nuku = (ms) => new Promise((r) => { setTimeout(r, ms); });
const SIJA = /^\d+\.\/\d+$/;

async function lippujenTiedot(nimet) {
  const ulos = new Set();
  for (let i = 0; i < nimet.length; i += 50) {
    const pala = nimet.slice(i, i + 50).map((t) => `File:${t}`);
    const osoite = 'https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo'
      + `&iiprop=size&titles=${encodeURIComponent(pala.join('|'))}&format=json`;
    let data = null;
    for (let y = 0; y < 5 && !data; y++) {
      try {
        const v = await fetch(osoite, { headers: { 'user-agent': 'Matkakirja/1.0 (opetuspeli)' } });
        if (v.ok) data = await v.json();
        else if (v.status !== 429 && v.status < 500) break;
      } catch { /* uudelleen */ }
      if (!data) await nuku(2500 * (y + 1));
    }
    if (!data) continue;
    const polku = new Map();
    for (const r of data?.query?.normalized ?? []) polku.set(r.from, r.to);
    for (const r of data?.query?.redirects ?? []) polku.set(r.from, r.to);
    const sivut = new Map();
    for (const s of Object.values(data?.query?.pages ?? {})) sivut.set(s.title, s);
    for (const nimi of pala) {
      let avain = nimi;
      for (let k = 0; k < 4 && polku.has(avain); k++) avain = polku.get(avain);
      if (sivut.get(avain)?.imageinfo) ulos.add(nimi.replace(/^File:/, ''));
    }
    await nuku(500);
  }
  return ulos;
}

const maat = JSON.parse(readFileSync(lahde, 'utf8'));
const liput = [...new Set(maat.flatMap((m) => (m.tervehdykset ?? []).map((t) => t.lippu)).filter(Boolean))];
console.log(`${maat.length} maata, ${liput.length} eri lippua tarkistettavana\n`);
const olemassa = await lippujenTiedot(liput);

const huomiot = [];
const valmiit = [];
for (const m of maat) {
  const viat = [];
  if (!SIJA.test(m.vakilukuSija ?? '')) viat.push(`vakilukuSija "${m.vakilukuSija}"`);
  if (!SIJA.test(m.pintaAlaSija ?? '')) viat.push(`pintaAlaSija "${m.pintaAlaSija}"`);
  if (!SIJA.test(m.keskitulo?.sija ?? '')) viat.push(`keskitulo.sija "${m.keskitulo?.sija}"`);
  if (!SIJA.test(m.demokratia?.sija ?? '')) viat.push(`demokratia.sija "${m.demokratia?.sija}"`);
  if (!(m.demokratia?.linkki ?? '').includes(`~${m.iso}`)) {
    viat.push(`demokratia.linkki ei osoita maahan ${m.iso}`);
  }
  const tervehdykset = (m.tervehdykset ?? []).filter((t) => {
    if (olemassa.has(t.lippu)) return true;
    huomiot.push(`${m.iso}: lippua ei ole — ${t.lippu} (${t.kieli})`);
    return false;
  });
  if (!tervehdykset.length) viat.push('ei yhtään tervehdystä lipulla');
  if (viat.length) { huomiot.push(`${m.iso}: ${viat.join(', ')}`); continue; }
  valmiit.push({ ...m, tervehdykset });
}

console.log(`${valmiit.length}/${maat.length} maata läpäisi.`);
// Huomiot aina näkyviin: hiljainen karsinta näyttäisi täydeltä listalta.
if (huomiot.length) {
  console.log(`\n${huomiot.length} huomiota:`);
  for (const h of huomiot) console.log(`  ${h}`);
}
if (kuiva) process.exit(0);

// --- kirjoitus -----------------------------------------------------------------

const lainaa = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

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

const osat = valmiit
  .sort((a, b) => a.iso.localeCompare(b.iso))
  .map((m) => {
    const r = [`  ${m.iso}: {`];
    r.push(`    vakiluku: ${lainaa(m.vakiluku)},`);
    r.push(`    vakilukuSija: ${lainaa(m.vakilukuSija)},`);
    r.push(`    pintaAla: ${lainaa(m.pintaAla)},`);
    r.push(`    pintaAlaSija: ${lainaa(m.pintaAlaSija)},`);
    r.push('    demokratia: {');
    r.push(`      arvo: ${lainaa(m.demokratia.arvo)},`);
    r.push(`      sija: ${lainaa(m.demokratia.sija)},`);
    r.push(`      linkki: ${lainaa(m.demokratia.linkki)},`);
    r.push(`      selitys: ${katko(m.demokratia.selitys, '      ')},`);
    r.push('    },');
    r.push('    keskitulo: {');
    r.push(`      arvo: ${lainaa(m.keskitulo.arvo)},`);
    r.push(`      sija: ${lainaa(m.keskitulo.sija)},`);
    r.push('    },');
    r.push('    tervehdykset: [');
    for (const t of m.tervehdykset) {
      r.push(`      { teksti: ${lainaa(t.teksti)}, kieli: ${lainaa(t.kieli)}, `
        + `lippu: ${lainaa(t.lippu)}, osuus: ${lainaa(t.osuus)} },`);
    }
    r.push('    ],');
    r.push('  },');
    return r.join('\n');
  });

const sisalto = `// Aasian ja Lähi-idän maiden tunnusluvut (sama rakenne kuin
// EUROPE_MAATIEDOT ja AFRICA_MAATIEDOT).
//
// Lähteet ja menetelmä:
//  - väkiluku SP.POP.TOTL, pinta-ala AG.SRF.TOTL.K2 ja keskitulo
//    NY.GNP.PCAP.CD (BKTL/asukas Atlas-menetelmällä), kaikki
//    Maailmanpankin rajapinnasta, uusin saatavilla oleva vuosi;
//  - demokratia = V-Demin liberaalin demokratian indeksi Our World in
//    Datan aineistosta.
// Sijoitus on laskettu suvereenien valtioiden kesken, ja nimittäjä on
// pyöristetty samaan tapaan kuin Euroopan tiedoissa.
//
// Jokainen tervehdyksen lippu on tarkistettu Commonsista: puuttuva
// tiedostonimi jättäisi kortin puolityhjäksi ilman virhettä.
//
// Tuotettu komennolla tools/kirjoita-maatiedot.mjs.
export const ${vientinimi} = {
${osat.join('\n')}
};
`;

writeFileSync(join(JUURI, kohde), sisalto);
console.log(`\nKirjoitettu ${kohde}: ${valmiit.length} maata.`);
