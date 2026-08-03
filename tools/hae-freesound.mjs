/*
 * Hakee ääniehdokkaita Freesoundista.
 *
 *   FREESOUND_API=… node tools/hae-freesound.mjs --kori meri --maara 12
 *   FREESOUND_API=… node tools/hae-freesound.mjs --haku "bazaar market" --ulos ehdokkaat.json
 *
 * MIKSI TÄMÄ AJETAAN GITHUB ACTIONSISSA EIKÄ TÄÄLLÄ:
 *
 * Freesoundin avain on repon salaisuuksissa, eikä GitHub näytä
 * salaisuuden arvoa kenellekään sen tallentamisen jälkeen — ei
 * käyttöliittymässä eikä rajapinnassa. Arvo on luettavissa vain
 * työnkulun ajon sisällä, ympäristömuuttujana.
 *
 * Se on tarkoituksellista ja hyvä niin: omistajan sääntö on, ettei
 * avaimia liitetä keskusteluun, koska ne päätyisivät lokeihin.
 * Työkalu on siis kirjoitettu niin, että avain ei koskaan poistu
 * ajoympäristöstä — tulokseen kirjoitetaan vain julkisia osoitteita,
 * lisenssejä ja tekijöiden nimiä.
 *
 * Sama malli kuin tools/hae-kaupunkikuvat.mjs + kuvahaku.yml.
 *
 * LISENSSIRAJAUS. Mukaan otetaan vain CC0 ja CC BY. Freesoundissa on
 * paljon myös CC BY-NC -aineistoa, jota ei voi käyttää, ja
 * "Sampling+"-lisenssiä, jonka ehdot ovat monimutkaiset. Rajaus
 * tehdään palvelimen puolella filter-parametrilla eikä jälkikäteen:
 * jälkikäteen suodattava haku palauttaisi kymmenen osumaa, joista
 * kaksi kelpaa, ja näyttäisi siltä että aineistoa ei ole.
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Noden fetch ei lue HTTPS_PROXYa; ks. tools/hae-radiot.mjs.
if (!process.env.NODE_USE_ENV_PROXY && (process.env.HTTPS_PROXY || process.env.https_proxy)) {
  const ajo = spawnSync(process.execPath, [fileURLToPath(import.meta.url), ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1', NODE_NO_WARNINGS: '1' },
  });
  process.exit(ajo.status ?? 1);
}

/*
 * Avain luetaan useasta nimestä.
 *
 * Salaisuuden nimeä ei voi tarkistaa täältä käsin, ja väärä arvaus
 * näyttäisi täsmälleen samalta kuin puuttuva avain — työkalu kaatuisi
 * sanoen "avainta ei ole", vaikka se olisi repossa toisella nimellä.
 * Siksi kokeillaan kaikkia tavallisia kirjoitusasuja ja kerrotaan
 * lopuksi, mitä etsittiin.
 */
const AVAIN_NIMET = ['FREESOUND_API', 'FREESOUND_API_KEY', 'FREESOUND_AVAIN', 'FREESOUND_TOKEN', 'FREESOUND'];
const avainNimi = AVAIN_NIMET.find((n) => (process.env[n] ?? '').trim());
const AVAIN = avainNimi ? process.env[avainNimi].trim() : '';

if (!AVAIN) {
  console.error('Freesoundin avainta ei löytynyt ympäristöstä.');
  console.error(`Etsittiin nimillä: ${AVAIN_NIMET.join(', ')}`);
  console.error('');
  console.error('Aseta se repon salaisuuksiin (Settings > Secrets and variables >');
  console.error('Actions) ja välitä työnkulussa env-lohkossa. Älä koskaan aja');
  console.error('tätä niin, että avain näkyy komentorivillä — komentorivit');
  console.error('päätyvät lokeihin.');
  process.exit(1);
}

// --- valitsimet ----------------------------------------------------------------

const argv = process.argv.slice(2);
const valitsin = (nimi, oletus = null) => {
  const i = argv.indexOf(`--${nimi}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : oletus;
};

/*
 * Valmiit korit vastaavat pelin omia arvontakoreja (js/aani-ehdokkaat.js).
 * Hakusanat ovat englanniksi, koska Freesoundin aineisto on merkitty
 * englanniksi — suomenkielinen haku löytää muutaman kymmenen tiedostoa
 * koko palvelusta.
 */
const KORIT = {
  meri: 'ocean waves shore surf ambience',
  basaari: 'bazaar market street crowd ambience',
  aavikko: 'desert wind sand ambience',
  sademetsa: 'rainforest jungle birds ambience',
  savanni: 'savanna grassland wind insects',
  ylanko: 'mountain highland wind ambience',
  kaupunki: 'city street traffic distant ambience',
  satama: 'harbour port ships dock ambience',
  juna: 'steam train railway station',
  tori: 'market stall vendors chatter',
  sade: 'rain on roof ambience',
  yo: 'night crickets quiet ambience',
};

const kori = valitsin('kori');
const haku = valitsin('haku') ?? (kori ? KORIT[kori] : null);
const maara = Number(valitsin('maara', '12'));
const ulos = valitsin('ulos');
const minKesto = Number(valitsin('min-kesto', '20'));
const maxKesto = Number(valitsin('max-kesto', '600'));

if (!haku) {
  console.error('käyttö: node tools/hae-freesound.mjs --kori <nimi> | --haku "<sanat>"');
  console.error(`korit: ${Object.keys(KORIT).join(', ')}`);
  process.exit(1);
}

// --- haku ----------------------------------------------------------------------

const LISENSSIT = {
  'http://creativecommons.org/publicdomain/zero/1.0/': 'CC0',
  'https://creativecommons.org/publicdomain/zero/1.0/': 'CC0',
  'http://creativecommons.org/licenses/by/4.0/': 'CC BY 4.0',
  'https://creativecommons.org/licenses/by/4.0/': 'CC BY 4.0',
  'http://creativecommons.org/licenses/by/3.0/': 'CC BY 3.0',
};
const lisenssiNimi = (url) => LISENSSIT[url] ?? url;

const parametrit = new URLSearchParams({
  query: haku,
  page_size: String(Math.min(150, Math.max(maara * 3, 15))),
  token: AVAIN,
  fields: 'id,name,username,license,previews,duration,avg_rating,num_ratings,url',
  // Vain CC0 ja CC BY, ja kesto järkevissä rajoissa. Kolmen sekunnin
  // napsahdus ei kelpaa taustaääneksi, eikä puolen tunnin nauhoitus
  // ole ladattavissa puhelimella.
  filter: `license:("Creative Commons 0" OR "Attribution") duration:[${minKesto} TO ${maxKesto}]`,
  sort: 'rating_desc',
});

console.log(`Haku: ${haku}`);
console.log(`Avain löytyi ympäristömuuttujasta ${avainNimi} (arvoa ei tulosteta).`);
console.log(`Rajaus: CC0 tai CC BY, kesto ${minKesto}–${maxKesto} s.\n`);

let data = null;
for (let yritys = 0; yritys < 4 && !data; yritys++) {
  try {
    const vastaus = await fetch(`https://freesound.org/apiv2/search/text/?${parametrit}`, {
      signal: AbortSignal.timeout(20000),
    });
    if (vastaus.ok) {
      data = await vastaus.json();
      break;
    }
    if (vastaus.status === 401) {
      console.error('Freesound vastasi 401: avain ei kelpaa.');
      console.error(`Tarkista salaisuuden ${avainNimi} arvo osoitteessa`);
      console.error('https://freesound.org/apiv2/apply/');
      process.exit(1);
    }
    if (vastaus.status === 429) {
      console.error(`Kiintiö täynnä (429), odotetaan… (yritys ${yritys + 1}/4)`);
    } else if (vastaus.status < 500) {
      console.error(`Freesound vastasi ${vastaus.status}.`);
      process.exit(1);
    }
  } catch (virhe) {
    console.error(`Haku ei onnistunut: ${virhe.message} (yritys ${yritys + 1}/4)`);
  }
  if (!data) await new Promise((r) => { setTimeout(r, 3000 * (yritys + 1)); });
}

if (!data) {
  console.error('Hakua ei saatu läpi neljällä yrityksellä.');
  process.exit(1);
}

/*
 * Esikuuntelu-mp3 on se osoite, jota peli käyttää: alkuperäinen
 * tiedosto voi olla pakkaamaton wav, jota ei ladata puhelimeen.
 * Ilman previews-kenttää osuma on hyödytön, joten se karsitaan.
 */
const ehdokkaat = (data.results ?? [])
  .map((o) => ({
    url: o.previews?.['preview-hq-mp3'] ?? o.previews?.['preview-lq-mp3'] ?? null,
    nimi: `${o.name} — ${o.username}, ${lisenssiNimi(o.license)}`,
    kesto: Math.round(o.duration ?? 0),
    arvio: o.num_ratings >= 3 ? Number((o.avg_rating ?? 0).toFixed(1)) : null,
    sivu: o.url,
  }))
  .filter((o) => o.url)
  .slice(0, maara);

console.log(`${data.count ?? 0} osumaa, ${ehdokkaat.length} ehdokasta:\n`);
for (const e of ehdokkaat) {
  const arvio = e.arvio === null ? 'ei arvioita' : `${e.arvio}/5`;
  console.log(`  ${String(e.kesto).padStart(4)} s  ${arvio.padEnd(11)} ${e.nimi}`);
  console.log(`            ${e.url}`);
}

if (ulos) {
  writeFileSync(ulos, `${JSON.stringify({ haku, kori, ehdokkaat }, null, 2)}\n`);
  console.log(`\nKirjoitettu ${ulos}.`);
}

if (!ehdokkaat.length) {
  console.log('\nEi yhtään kelvollista ehdokasta. Kokeile toisia hakusanoja tai');
  console.log('väljennä kestorajoja --min-kesto ja --max-kesto.');
}
