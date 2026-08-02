/*
 * Etsii korvaajat liian hiljaisille taustaäänille.
 *
 *   node tools/etsi-korvaajat.mjs [--laji aavikko] [--maara 6]
 *
 * tools/mittaa-aanet.mjs paljasti seitsemän äänitettä, jotka ovat niin
 * hiljaisia (-47…-63 LUFS), ettei niitä saa tasolle ilman että niiden oma
 * kohina nousee kuuluviin. Omistajan päätös: etsitään korvaajat.
 *
 * Haku on radio aporeesta (archive.org), koska Freesoundin rajapinta
 * vaatii avaimen. Aporee on kenttä-äänitysten arkisto, joten siellä on
 * juuri tämänkaltaista aineistoa — ja peli peilaa sitä jo.
 *
 * TÄRKEINTÄ: ehdokas mitataan heti samalla mittarilla kuin nykyisetkin.
 * Ilman sitä toistaisimme saman virheen — valitsisimme korvalta ja
 * huomaisimme vasta pelissä, että uusikin on liian hiljainen.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const AGENTTI = 'Matkakirja/1.0 (https://github.com/ravelius/Matkakirja)';
const argv = process.argv.slice(2);
const arg = (lippu, oletus) => {
  const i = argv.indexOf(lippu);
  return i >= 0 ? argv[i + 1] : oletus;
};
const MAARA = Number(arg('--maara', 6));
const VAIN = arg('--laji', null);

/*
 * Mitä haetaan ja mille lajille. Hakusanat ovat englanniksi, koska
 * aporeen otsikot ovat: nauhoittajat ovat ympäri maailmaa mutta
 * nimeävät englanniksi.
 */
const HAUT = {
  vuoristo: {
    selite: 'Vuoristomaisema (ylanko + vuoristo)',
    sanat: ['mountain wind', 'mountain valley', 'alpine', 'highland wind', 'mountain stream'],
  },
  savanni: {
    selite: 'Afrikan pensasmaa (savanni)',
    // HUOM: pelkkä 'savanna' osuu Illinois'n Savannaan ja 'alpine'
    // Tennesseen Alpine Driveen. Paikannimet ovat aporeessa otsikossa,
    // joten hakusanan pitää olla sellainen, jota ei ole kartalla väärässä
    // maanosassa — siksi nimenomaiset Afrikan seudut.
    sanat: ['serengeti', 'masai', 'kenya bush', 'tanzania night', 'namibia',
      'botswana', 'zambia', 'savannah africa', 'bush veld'],
  },
  satama: {
    selite: 'Satama yöllä (meri + satama)',
    sanat: ['harbour night', 'harbor boats', 'port at night', 'marina rigging', 'fishing harbour'],
  },
  aavikko: {
    selite: 'Aavikkotuuli (aavikko)',
    sanat: ['desert wind', 'sahara', 'desert night', 'sand dunes', 'desert silence'],
  },
  sademetsa: {
    selite: 'Linnut metsässä (sademetsä)',
    sanat: ['forest birds', 'jungle birds', 'rainforest', 'tropical forest morning', 'bird chorus'],
  },
};

const hae = (url) => JSON.parse(execFileSync('curl', [
  '-sSL', '--max-time', '45', '-H', `User-Agent: ${AGENTTI}`, url,
], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));

/**
 * Vapaa lisenssi? Sama sääntö kuin muuallakin pelissä: CC ja public
 * domain kelpaavat, mutta ND EI — peilattu ääni leikataan 180 sekuntiin,
 * ja leikkaus on muunnelma.
 */
const vapaa = (url) => Boolean(url)
  && /creativecommons\.org|publicdomain/.test(url)
  && !/\/by-nc-nd\/|\/by-nd\//.test(url);

/** Hakee aporeesta otsikkohaulla. */
function etsi(sana) {
  const q = `collection:(radio-aporee-maps) AND title:(${sana})`;
  const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(q)}`
    + '&fl[]=identifier&fl[]=title&fl[]=licenseurl&fl[]=creator&rows=25&output=json';
  try {
    return hae(url).response?.docs ?? [];
  } catch {
    return [];
  }
}

/** Kohteen soitettava mp3 ja kesto. */
function tiedosto(tunnus) {
  let d;
  try {
    d = hae(`https://archive.org/metadata/${encodeURIComponent(tunnus)}`);
  } catch {
    return null;
  }
  const mp3 = (d.files ?? [])
    .filter((f) => /\.mp3$/i.test(f.name) && Number(f.length ?? 0) > 60)
    .sort((a, b) => Number(b.length) - Number(a.length))[0];
  if (!mp3) return null;
  return {
    url: `https://archive.org/download/${tunnus}/${encodeURIComponent(mp3.name)}`,
    kesto: Math.round(Number(mp3.length)),
    lisenssi: d.metadata?.licenseurl ?? null,
    tekija: d.metadata?.creator ?? null,
    otsikko: d.metadata?.title ?? tunnus,
  };
}

// --- ajo ---------------------------------------------------------------------

const { MITTAA, avaaSelain } = await import('./mittaa-selaimessa.mjs');
const { voimaTasolle } = await import('./mittaa-aanet.mjs');

const lajit = VAIN ? [VAIN] : Object.keys(HAUT);
const { sivu, sulje } = await avaaSelain();
const tulokset = {};

for (const laji of lajit) {
  const haku = HAUT[laji];
  if (!haku) { console.log(`tuntematon laji: ${laji}`); continue; }
  console.log(`\n=== ${haku.selite} ===`);

  // Kerätään ehdokkaat kaikilta hakusanoilta, kaksoiskappaleet pois.
  const nahdyt = new Set();
  const ehdokkaat = [];
  for (const sana of haku.sanat) {
    for (const d of etsi(sana)) {
      if (nahdyt.has(d.identifier)) continue;
      nahdyt.add(d.identifier);
      if (!vapaa(d.licenseurl)) continue;
      ehdokkaat.push(d);
    }
  }
  console.log(`  ehdokkaita haussa: ${ehdokkaat.length}`);

  const hyvat = [];
  for (const d of ehdokkaat) {
    if (hyvat.length >= MAARA) break;
    const t = tiedosto(d.identifier);
    // Alle kahden minuutin äänite ei kanna silmukkaa: peli soittaa
    // taustaa minuutteja kerrallaan ja lyhyt klippi alkaa toistaa itseään.
    if (!t || t.kesto < 120) continue;
    const mittaus = await MITTAA(sivu, t.url);
    if (mittaus.virhe) { console.log(`  ohi (${mittaus.virhe}): ${t.otsikko.slice(0, 50)}`); continue; }
    const voima = voimaTasolle(mittaus.lufs);
    // Juuri se virhe jota korjataan: liian hiljainen ei kelpaa uudeksikaan.
    const kelpaa = mittaus.lufs > -44;
    console.log(`  ${kelpaa ? 'OK ' : 'ei '} ${String(mittaus.lufs).padStart(7)} LUFS`
      + `  ${String(t.kesto).padStart(4)}s  voima ${String(voima).padStart(4)}`
      + `  ${t.otsikko.slice(0, 46)}`);
    if (kelpaa) hyvat.push({ ...t, ...mittaus, voima });
  }
  tulokset[laji] = hyvat;
}

await sulje();

writeFileSync(join(JUURI, 'tools/korvaajat.json'), `${JSON.stringify(tulokset, null, 2)}\n`);
console.log('\nehdotukset: tools/korvaajat.json');
for (const [laji, lista] of Object.entries(tulokset)) {
  console.log(`  ${laji.padEnd(11)} ${lista.length} kelvollista`);
}
