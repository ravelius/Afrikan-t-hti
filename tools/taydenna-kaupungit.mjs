/*
 * Täydentää Aasian ja Lähi-idän kaupungeille wiki-artikkelin, ambienssin
 * ja maatunnuksen.
 *
 *   node tools/taydenna-kaupungit.mjs [--kuiva]
 *
 * Miksi: Euroopan ja Afrikan kaupungeilla on `wiki` (artikkelin otsikko)
 * ja `ambience` (kaupungin äänimaisema), Aasian ja Lähi-idän
 * kaupungeilla ei yhdelläkään. Ilman wikiä kaupungista ei saa kuvia
 * eikä tiivistelmää, ja ilman ambienssia kaupunki on mykkä. Nämä
 * puuttuivat myös alkuperäisiltä laudoilta, joten korjaus hyödyttää
 * kumpaakin — vanhoja lautoja ja yhdistettyä.
 *
 * Artikkelin otsikkoa EI arvata: se haetaan suomenkielisestä
 * Wikipediasta ja tarkistetaan, että sivu on olemassa eikä ole
 * täsmennyssivu. Maatunnus tulee Wikidatasta (P17), jottei sitä
 * tarvitse päätellä nimestä.
 *
 * Ambienssi on käsin valittu. Se on makuasia eikä sitä voi hakea
 * mistään: Bagdad on basaari, Jakutsk on pohjoinen, Borneo on
 * sademetsä. Sanasto on sama kuin vanhoilla laudoilla.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ASIA } from '../js/packs/asia.js';
import { MIDDLE_EAST } from '../js/packs/middleeast.js';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const kuiva = process.argv.includes('--kuiva');

/*
 * Äänimaisema kaupungeittain.
 *
 * Sanasto on vanhoilta laudoilta: kaupunki, meri, satama, savanni,
 * basaari, aavikko, sademetsa, pohjoinen, metsa, ylanko, vuoristo.
 * Arolle ei ole omaa ääntä, joten Astana ja Ulan Bator saavat savannin
 * — molemmat ovat avointa ruohotasankoa, ja ääni on sama tuuli
 * heinikossa.
 */
const AMBIENSSI = {
  // Lähi-itä
  izmir: 'satama', ankara: 'kaupunki', kapadokia: 'ylanko', nikosia: 'kaupunki',
  halab: 'basaari', damaskos: 'basaari', jerusalem: 'kaupunki', petra: 'aavikko',
  siinai: 'aavikko', luxor: 'aavikko', medina: 'aavikko', mekka: 'basaari',
  riad: 'aavikko', rubalkhali: 'aavikko', sana: 'basaari', aden: 'satama',
  salalah: 'meri', masqat: 'satama', dubai: 'satama', doha: 'satama',
  kuwait: 'satama', bagdad: 'basaari', mosul: 'kaupunki', tabriz: 'basaari',
  teheran: 'kaupunki', isfahan: 'basaari', persepolis: 'aavikko',
  // Aasia
  tokio: 'kaupunki', jekaterinburg: 'kaupunki', astana: 'savanni',
  novosibirsk: 'pohjoinen', irkutsk: 'metsa', jakutsk: 'pohjoinen',
  magadan: 'pohjoinen', kamtsatka: 'vuoristo', sahalin: 'meri',
  vladivostok: 'satama', ulanbator: 'savanni', peking: 'kaupunki',
  soul: 'kaupunki', xian: 'kaupunki', shanghai: 'satama', taipei: 'kaupunki',
  hongkong: 'satama', manila: 'satama', hanoi: 'kaupunki', bangkok: 'basaari',
  yangon: 'basaari', singapore: 'satama', sumatra: 'sademetsa',
  borneo: 'sademetsa', jakarta: 'kaupunki', lhasa: 'vuoristo',
  kathmandu: 'vuoristo', delhi: 'basaari', kolkata: 'basaari',
  mumbai: 'kaupunki', chennai: 'meri', colombo: 'satama', karachi: 'satama',
  kabul: 'vuoristo', samarkand: 'basaari', kashgar: 'basaari',
  // Porttikaupungit: sama ääni kuin niiden omilla laudoilla.
  istanbul: 'basaari', kairo: 'basaari',
};

/*
 * Hakusanat niille, joiden pelinimi ei ole artikkelin otsikko.
 * Ensimmäinen olemassa oleva voittaa; loput ovat varalla.
 */
const HAKUSANAT = {
  sana: ['Sanaa'], masqat: ['Masqat', 'Muscat'], halab: ['Aleppo'],
  kapadokia: ['Kappadokia'], rubalkhali: ["Rub' al-Khali", 'Rub al-Khali'],
  kuwait: ['Kuwait (kaupunki)', 'Kuwait'], soul: ['Soul'], xian: ['Xi’an', "Xi'an"],
  kamtsatka: ['Kamtšatka'], sahalin: ['Sahalin'], kashgar: ['Kašgar'],
  ulanbator: ['Ulan Bator'], astana: ['Astana'], peking: ['Peking'],
  borneo: ['Borneo'], sumatra: ['Sumatra'], siinai: ['Siinain niemimaa', 'Siinai'],
  persepolis: ['Persepolis'], salalah: ['Salalah'], doha: ['Doha'],
  // Suomenkielinen otsikko poikkeaa pelin nimestä: 'Soul' on
  // täsmennyssivu (kaupunki ja musiikkityyli), ja Kamtšatka on
  // artikkelina niemimaa.
  soul: ['Soul (kaupunki)', 'Souli', 'Soul'],
  petra: ['Petra (kaupunki)', 'Petra (Jordania)', 'Petra'],
  kamtsatka: ['Kamtšatkan niemimaa', 'Kamtšatka'],
};

/*
 * Maatunnukset, joita Wikidata ei anna. Singapore on kaupunkivaltio,
 * eikä artikkelilla ole 'sijaintimaa'-tietoa — se ON maa.
 */
const OMAT_MAAT = { singapore: 'SGP', hongkong: 'HKG' };

/*
 * Haku hidastettuna ja uudelleenyrityksellä.
 *
 * Ensimmäinen ajo onnistui 19 kaupungin kohdalla ja kaatui sitten
 * kaikkiin: Wikipedia vastasi 429 "too many requests". Työkalu nieli
 * virheen ja tulosti "artikkelia ei löytynyt" — mikä oli valhe. Nyt
 * pyyntöjen väliin jää tauko, 429 odotetaan pois, ja muu virhe
 * kerrotaan koodilla.
 */
const nuku = (ms) => new Promise((r) => { setTimeout(r, ms); });

async function hae(osoite, yrityksia = 4) {
  for (let i = 0; i < yrityksia; i++) {
    const vastaus = await fetch(osoite, {
      headers: { 'user-agent': 'Matkakirja/1.0 (opetuspeli; sami)' },
    });
    if (vastaus.ok) return vastaus.json();
    if (vastaus.status !== 429) {
      console.log(`  HTTP ${vastaus.status}: ${osoite.slice(0, 80)}`);
      return null;
    }
    await nuku(2000 * (i + 1));
  }
  console.log('  429 neljästi — luovutetaan');
  return null;
}

/*
 * Kyselyt NIPUTETAAN.
 *
 * Ensimmäinen versio kysyi yhden kaupungin kerrallaan, ja Wikipedia
 * vastasi 429 "too many requests" — ensin 46 kaupungille, ja hidastuksen
 * jälkeenkin seitsemälle. Hidastus oli väärä korjaus: MediaWikin
 * rajapinta ottaa viisikymmentä nimeä yhdellä kertaa, ja Wikidata
 * viisikymmentä tunnusta. Koko työ mahtuu kouralliseen pyyntöjä, eikä
 * rajaa tarvitse kiertää lainkaan.
 */

/** Artikkelit nipussa: nimi -> { otsikko, qid } tai null. */
async function artikkelit(nimet) {
  const ulos = new Map();
  for (let i = 0; i < nimet.length; i += 50) {
    const pala = nimet.slice(i, i + 50);
    const osoite = 'https://fi.wikipedia.org/w/api.php?action=query&redirects=1'
      + `&prop=pageprops&titles=${encodeURIComponent(pala.join('|'))}&format=json`;
    const data = await hae(osoite);
    if (!data) continue;
    // Uudelleenohjaukset ja normalisointi pitää seurata, jotta kysytty
    // nimi löytää vastauksensa.
    const polku = new Map();
    for (const r of data?.query?.normalized ?? []) polku.set(r.from, r.to);
    for (const r of data?.query?.redirects ?? []) polku.set(r.from, r.to);
    const sivut = new Map();
    for (const sivu of Object.values(data?.query?.pages ?? {})) sivut.set(sivu.title, sivu);
    for (const nimi of pala) {
      let avain = nimi;
      for (let k = 0; k < 4 && polku.has(avain); k++) avain = polku.get(avain);
      const sivu = sivut.get(avain);
      if (!sivu || sivu.missing !== undefined) { ulos.set(nimi, null); continue; }
      // Täsmennyssivu ei kelpaa: siitä ei saa tiivistelmää eikä kuvia.
      if (sivu.pageprops?.disambiguation !== undefined) { ulos.set(nimi, null); continue; }
      ulos.set(nimi, { otsikko: sivu.title, qid: sivu.pageprops?.wikibase_item ?? null });
    }
    await nuku(600);
  }
  return ulos;
}

/** Maatunnukset nipussa: qid -> ISO-3 tai null. */
async function maatunnukset(qidit) {
  const kohde = new Map();
  const maaQidit = new Set();
  for (let i = 0; i < qidit.length; i += 50) {
    const pala = qidit.slice(i, i + 50);
    const data = await hae('https://www.wikidata.org/w/api.php?action=wbgetentities'
      + `&ids=${pala.join('|')}&props=claims&format=json`);
    if (!data) continue;
    for (const [qid, olio] of Object.entries(data?.entities ?? {})) {
      const maa = olio?.claims?.P17?.[0]?.mainsnak?.datavalue?.value?.id ?? null;
      kohde.set(qid, maa);
      if (maa) maaQidit.add(maa);
    }
    await nuku(600);
  }
  const isot = new Map();
  const lista = [...maaQidit];
  for (let i = 0; i < lista.length; i += 50) {
    const pala = lista.slice(i, i + 50);
    const data = await hae('https://www.wikidata.org/w/api.php?action=wbgetentities'
      + `&ids=${pala.join('|')}&props=claims&format=json`);
    if (!data) continue;
    for (const [qid, olio] of Object.entries(data?.entities ?? {})) {
      isot.set(qid, olio?.claims?.P298?.[0]?.mainsnak?.datavalue?.value ?? null);
    }
    await nuku(600);
  }
  const ulos = new Map();
  for (const [qid, maa] of kohde) ulos.set(qid, maa ? isot.get(maa) ?? null : null);
  return ulos;
}

const tulokset = new Map();
const kaupungit = [];
for (const [lauta, pack] of [['middleeast', MIDDLE_EAST], ['asia', ASIA]]) {
  for (const c of pack.cities) {
    if (c.wiki && c.ambience) continue;
    if (kaupungit.some((k) => k.id === c.id)) continue;
    kaupungit.push({ lauta, id: c.id, nimi: c.name });
  }
}

// Kaikki ehdokasnimet yhteen nippuun.
const ehdokkaat = new Map();
for (const k of kaupungit) ehdokkaat.set(k.id, [...(HAKUSANAT[k.id] ?? []), k.nimi]);
const kaikkiNimet = [...new Set([...ehdokkaat.values()].flat())];
const loydetyt = await artikkelit(kaikkiNimet);

const valitut = new Map();
for (const k of kaupungit) {
  const osuma = ehdokkaat.get(k.id).map((n) => loydetyt.get(n)).find(Boolean);
  if (!osuma) { console.log(`${k.id}: ARTIKKELIA EI LÖYTYNYT (${ehdokkaat.get(k.id).join(', ')})`); continue; }
  valitut.set(k.id, osuma);
}

const isot = await maatunnukset([...new Set([...valitut.values()].map((v) => v.qid).filter(Boolean))]);
for (const k of kaupungit) {
  const osuma = valitut.get(k.id);
  if (!osuma) continue;
  const iso = OMAT_MAAT[k.id] ?? (osuma.qid ? isot.get(osuma.qid) ?? null : null);
  tulokset.set(k.id, { wiki: osuma.otsikko, ambience: AMBIENSSI[k.id] ?? 'kaupunki', iso });
  console.log(`${k.id.padEnd(16)} ${osuma.otsikko.padEnd(28)} ${AMBIENSSI[k.id] ?? '?'} ${iso ?? '—'}`);
}

console.log(`\n${tulokset.size}/${kaupungit.length} täydennettävää.`);
const ilmanAmbienssia = [...tulokset].filter(([, v]) => !v.ambience);
if (ilmanAmbienssia.length) console.log('ilman ambienssia:', ilmanAmbienssia.map(([k]) => k).join(' '));
if (kuiva) process.exit(0);

// --- kirjoitus paketteihin ----------------------------------------------------

for (const tiedosto of ['asia.js', 'middleeast.js']) {
  const polku = join(JUURI, 'js', 'packs', tiedosto);
  const rivit = readFileSync(polku, 'utf8').split('\n');
  let osumia = 0;
  for (let i = 0; i < rivit.length; i++) {
    /*
     * Kaupunki voi olla yhdellä rivillä tai monella.
     *
     * Ensimmäinen versio hyväksyi vain rivit, jotka ALKAVAT
     * aaltosulkeella. Aloituskaupungit on kirjoitettu useammalle
     * riville, jolloin `id:` on rivin alussa ilman sulkua — ja juuri ne
     * jäivät täydentämättä: Tokio, Peking, Istanbul, Kairo. Riittää,
     * että rivillä on sekä id että name.
     */
    const sisus = rivit[i].trim().replace(/,$/, '');
    if (!/(^|\{\s*)id:\s*'/.test(sisus) && !/"id":"/.test(sisus)) continue;
    if (!/name:\s*'/.test(sisus) && !/"name":"/.test(sisus)) continue;
    const tunnus = sisus.match(/id:\s*'([^']+)'/)?.[1] ?? sisus.match(/"id":"([^"]+)"/)?.[1];
    const lisa = tunnus && tulokset.get(tunnus);
    if (!lisa) continue;
    if (/\bwiki:/.test(rivit[i])) continue;
    // Kentät nimen perään, kuten Euroopan paketissa.
    const uusi = rivit[i].replace(
      /(name:\s*'(?:[^']|\\')*')/,
      `$1, wiki: '${lisa.wiki.replace(/'/g, "\\'")}', ambience: '${lisa.ambience}'`,
    );
    if (uusi === rivit[i]) continue;
    rivit[i] = uusi;
    osumia += 1;
  }
  writeFileSync(polku, rivit.join('\n'));
  console.log(`${tiedosto}: ${osumia} kaupunkia täydennetty`);
}

writeFileSync(join(JUURI, 'tools', 'kaupunkitiedot.json'),
  `${JSON.stringify(Object.fromEntries(tulokset), null, 2)}\n`);
console.log('Maatunnukset talteen: tools/kaupunkitiedot.json');
