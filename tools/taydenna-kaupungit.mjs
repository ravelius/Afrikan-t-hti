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
};

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

/** Onko sivu olemassa eikä täsmennyssivu? Palauttaa lopullisen otsikon. */
async function artikkeli(nimi) {
  const osoite = 'https://fi.wikipedia.org/w/api.php?action=query&redirects=1'
    + `&prop=pageprops&titles=${encodeURIComponent(nimi)}&format=json`;
  const data = await hae(osoite);
  if (!data) return null;
  const sivut = Object.values(data?.query?.pages ?? {});
  const sivu = sivut[0];
  if (!sivu || sivu.missing !== undefined) return null;
  // Täsmennyssivu ei kelpaa: siitä ei saa tiivistelmää eikä kuvia.
  if (sivu.pageprops?.disambiguation !== undefined) return null;
  return { otsikko: sivu.title, qid: sivu.pageprops?.wikibase_item ?? null };
}

/** Maan ISO-3-tunnus Wikidatasta (P17 -> P298). */
async function maatunnus(qid) {
  if (!qid) return null;
  const data = await hae(`https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`);
  if (!data) return null;
  const vaateet = data?.entities?.[qid]?.claims?.P17 ?? [];
  const maaQid = vaateet[0]?.mainsnak?.datavalue?.value?.id;
  if (!maaQid) return null;
  const maaData = await hae(`https://www.wikidata.org/wiki/Special:EntityData/${maaQid}.json`);
  return maaData?.entities?.[maaQid]?.claims?.P298?.[0]?.mainsnak?.datavalue?.value ?? null;
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

for (const k of kaupungit) {
  const ehdokkaat = [...(HAKUSANAT[k.id] ?? []), k.nimi];
  let loytyi = null;
  for (const ehdokas of ehdokkaat) {
    loytyi = await artikkeli(ehdokas);
    if (loytyi) break;
  }
  if (!loytyi) {
    console.log(`${k.id}: ARTIKKELIA EI LÖYTYNYT (${ehdokkaat.join(', ')})`);
    continue;
  }
  await nuku(400);
  const iso = await maatunnus(loytyi.qid);
  await nuku(400);
  tulokset.set(k.id, { wiki: loytyi.otsikko, ambience: AMBIENSSI[k.id] ?? 'kaupunki', iso });
  console.log(`${k.id.padEnd(16)} ${loytyi.otsikko.padEnd(28)} ${AMBIENSSI[k.id] ?? '?'} ${iso ?? '—'}`);
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
    const sisus = rivit[i].trim().replace(/,$/, '');
    if (!sisus.startsWith('{ id:') && !sisus.startsWith('{"id"')) continue;
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
