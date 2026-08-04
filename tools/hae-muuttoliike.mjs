/*
 * Hakee väestön liikehdinnän linssin aineiston.
 *
 *   node tools/hae-muuttoliike.mjs [--kuiva] [--kynnys=500000]
 *
 * Kirjoittaa js/packs/linssi-muuttoliike.js, jossa on kaksi aikatasoa:
 * nykyaika (YK:n muuttajakannat 2024) ja historia (1800-luvun suuret
 * siirtolais- ja pakkomuuttovirrat). Molemmissa jokainen virta on
 * lähtöpiste, kohdepiste, määrä, aikaväli, lähde ja varmuus.
 *
 * --- miksi xlsx puretaan itse ---
 *
 * YK:n väestöosaston maiden välinen muuttajataulukko on tarjolla vain
 * Excel-tiedostona. Rekisteröitymistä tai avainta ei tarvita, mutta
 * koneluettavaa rajapintaa ei ole: population.un.org/dataportalapi
 * tuntee vain nettomuuton (TNetMigration), ei sitä mistä mihin.
 * Peliin ei oteta riippuvuuksia eikä niitä haluta työkaluihinkaan,
 * joten xlsx avataan tässä käsin — se on zip-paketti, jonka sisällä on
 * XML:ää, ja node:zlib osaa purkaa sen ilman kirjastoa. Purkaja on
 * tarkoituksella typerä: se lukee vain sen mitä tämä ajo tarvitsee.
 *
 * --- miksi kanta eikä virta ---
 *
 * YK laskee muuttajakantaa (migrant stock): kuinka moni maassa asuva
 * on syntynyt toisaalla. Se EI ole vuoden aikana muuttaneiden määrä
 * vaan vuosikymmenten kertymä. Ero on iso ja se kirjataan sekä
 * tiedoston otsikkoon että jokaisen rivin selitteeseen, ettei peli
 * väitä Meksikosta muuttavan 11 miljoonaa ihmistä vuodessa.
 *
 * --- miksi historia on käsin koottu ---
 *
 * 1800-luvun muuttoliikkeestä ei ole rajapintaa eikä yhtä tilastoa.
 * Luvut ovat historiantutkijoiden arvioita, jotka poikkeavat toisistaan
 * ja tarkentuvat yhä. Siksi historiaosa on tässä tiedostossa käsin
 * kirjoitettuna taulukkona: jokaisella rivillä on lähdeviite, aikaväli
 * ja varmuus 'arvio', ja siellä missä lähde antaa haarukan, mukana ovat
 * myös pienin ja suurin. Mitään lukua ei ole pyöristetty
 * "kauniiksi" eikä johdettu laskemalla toisista luvuista paitsi siinä
 * yhdessä kohdassa, joka on erikseen merkitty (Espanjan Amerikka).
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';

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
const OTSAKKEET = { 'user-agent': 'Matkakirja/1.0 (opetuspeli)' };
const nuku = (ms) => new Promise((r) => { setTimeout(r, ms); });

/*
 * Kynnys, jonka alle jäävät virrat jätetään pois.
 *
 * Maapareja on aineistossa yli 9000. Jos ne kaikki piirrettäisiin,
 * kartta olisi harmaa vyyhti. Puoli miljoonaa jättää 115 virtaa —
 * sen verran kuin kartalle mahtuu niin, että yksittäinen kaari on
 * vielä seurattavissa silmällä.
 */
const KYNNYS = Number(process.argv.find((a) => a.startsWith('--kynnys='))?.slice(9) ?? 500000);

const IMS_OSOITE = 'https://www.un.org/development/desa/pd/sites/www.un.org.development.desa.pd'
  + '/files/undesa_pd_2024_ims_stock_by_sex_destination_and_origin.xlsx';
const IMS_LAHDE = 'YK/DESA, International Migrant Stock 2024, taulukko 1';

// ---------------------------------------------------------------- verkko

async function hae(osoite, yrityksia = 6) {
  for (let i = 0; i < yrityksia; i++) {
    try {
      const vastaus = await fetch(osoite, { headers: OTSAKKEET });
      if (vastaus.ok) return vastaus;
      if (vastaus.status !== 429) { console.log(`  HTTP ${vastaus.status}`); return null; }
    } catch (virhe) {
      console.log(`  yhteys katkesi (${virhe?.cause?.code ?? virhe?.name ?? '?'})`);
    }
    await nuku(3000 * (i + 1));
  }
  return null;
}

// ------------------------------------------------------------- xlsx auki

/**
 * Zipin keskushakemisto: nimi -> missä ja miten pakattuna.
 *
 * Loppumerkintä (EOCD) etsitään takaperin, koska sen jälkeen voi olla
 * vaihtelevan mittainen kommentti. 70 kt riittää: kommentti mahtuu
 * enintään 64 kt:hen.
 */
function zipHakemisto(puskuri) {
  let loppu = -1;
  for (let i = puskuri.length - 22; i >= 0 && i > puskuri.length - 70000; i--) {
    if (puskuri.readUInt32LE(i) === 0x06054b50) { loppu = i; break; }
  }
  if (loppu < 0) throw new Error('xlsx ei ole zip-paketti (EOCD puuttuu)');
  const merkintoja = puskuri.readUInt16LE(loppu + 10);
  let kohta = puskuri.readUInt32LE(loppu + 16);
  const tiedostot = new Map();
  for (let n = 0; n < merkintoja; n++) {
    if (puskuri.readUInt32LE(kohta) !== 0x02014b50) throw new Error('zipin keskushakemisto on rikki');
    const menetelma = puskuri.readUInt16LE(kohta + 10);
    const pakattu = puskuri.readUInt32LE(kohta + 20);
    const nimiPituus = puskuri.readUInt16LE(kohta + 28);
    const lisaPituus = puskuri.readUInt16LE(kohta + 30);
    const kommenttiPituus = puskuri.readUInt16LE(kohta + 32);
    const paikallinen = puskuri.readUInt32LE(kohta + 42);
    const nimi = puskuri.toString('utf8', kohta + 46, kohta + 46 + nimiPituus);
    tiedostot.set(nimi, { menetelma, pakattu, paikallinen });
    kohta += 46 + nimiPituus + lisaPituus + kommenttiPituus;
  }
  return tiedostot;
}

/** Yksi tiedosto zipistä ulos. Vain tallennus ja deflate tunnetaan. */
function zipPura(puskuri, tieto) {
  const p = tieto.paikallinen;
  if (puskuri.readUInt32LE(p) !== 0x04034b50) throw new Error('zipin paikallinen otsake on rikki');
  const alku = p + 30 + puskuri.readUInt16LE(p + 26) + puskuri.readUInt16LE(p + 28);
  const data = puskuri.subarray(alku, alku + tieto.pakattu);
  if (tieto.menetelma === 0) return data;
  if (tieto.menetelma !== 8) throw new Error(`tuntematon pakkaus ${tieto.menetelma}`);
  return inflateRawSync(data);
}

const xmlAuki = (teksti) => teksti
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&apos;|&#39;/g, "'").replace(/&amp;/g, '&');

/**
 * Taulukkovälilehti riveiksi: { A: 'teksti', E: '900', ... }.
 *
 * Excel tallentaa toistuvat merkkijonot omaan luetteloonsa ja viittaa
 * niihin numerolla (t="s"). Ilman luetteloa jokainen maannimi olisi
 * pelkkä indeksi. Tyhjät solut jätetään pois kokonaan, joten rivit
 * ovat harvoja — soluun on aina viitattava kirjaimella, ei sijainnilla.
 */
function* xlsxRivit(xml, jaetut) {
  const SOLU = /<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>(.*?)<\/c>)/gs;
  for (const rivi of xml.matchAll(/<row [^>]*>(.*?)<\/row>/gs)) {
    const solut = {};
    for (const solu of rivi[1].matchAll(SOLU)) {
      const arvo = /<v>(.*?)<\/v>/s.exec(solu[3] ?? '')?.[1];
      if (arvo === undefined) continue;
      solut[solu[1]] = /t="s"/.test(solu[2]) ? (jaetut[Number(arvo)] ?? '') : arvo;
    }
    yield solut;
  }
}

// -------------------------------------------------------------- nykyaika

/** YK:n väestöosaston paikkaluettelo: koodi -> ISO-3 ja koordinaatit. */
async function haePaikat() {
  const vastaus = await hae('https://population.un.org/dataportalapi/api/v1/locations?sort=id&pageSize=400');
  if (!vastaus) throw new Error('YK:n paikkaluetteloa ei saatu haettua');
  const { data } = await vastaus.json();
  const paikat = new Map();
  for (const p of data) {
    // Koostealueilta (World, Europe, Developed regions) puuttuu
    // koordinaatti. Se on tässä juuri se suodatin jota tarvitaan:
    // koostetta ei voi piirtää kartalle pisteenä.
    if (p.latitude === null || p.latitude === undefined) continue;
    paikat.set(p.id, {
      iso3: p.iso3,
      lon: Number(p.longitude.toFixed(2)),
      lat: Number(p.latitude.toFixed(2)),
    });
  }
  return paikat;
}

/**
 * Suomenkieliset maannimet Wikidatasta ISO-3-koodin kautta.
 *
 * YK:n taulukon nimet ovat englanniksi ja osassa on alaviitetähti
 * ("United States of America*"). Suomenkielisessä pelissä kartalla
 * pitää lukea Yhdysvallat. Jos jollekin koodille on useampi
 * suomenkielinen nimike, otetaan lyhin: pitkä on käytännössä aina
 * virallinen pitkä muoto ("miehitetyt palestiinalaisalueet").
 */
async function haeNimet() {
  const kysely = 'SELECT ?iso3 ?nimi WHERE { ?maa wdt:P298 ?iso3 . '
    + '?maa rdfs:label ?nimi . FILTER(lang(?nimi)="fi") }';
  const osoite = `https://query.wikidata.org/sparql?query=${encodeURIComponent(kysely)}`;
  const vastaus = await fetch(osoite, { headers: { ...OTSAKKEET, accept: 'application/sparql-results+json' } })
    .catch(() => null);
  if (!vastaus?.ok) {
    console.log('  Wikidata ei vastannut — käytetään YK:n englanninkielisiä nimiä');
    return new Map();
  }
  const { results } = await vastaus.json();
  const nimet = new Map();
  for (const rivi of results.bindings) {
    const koodi = rivi.iso3.value;
    const nimi = rivi.nimi.value;
    if (!nimet.has(koodi) || nimi.length < nimet.get(koodi).length) nimet.set(koodi, nimi);
  }
  return nimet;
}

/*
 * Nimet joita Wikidatasta ei ISO-3-koodilla saa.
 *
 * Hongkong ja Macao ovat YK:n taulukossa omina alueinaan, samoin
 * Taiwan, ja pelin kartalla ne ovat omia muotojaan. Wikidatan
 * suomenkielinen nimike on niille joko puutteellinen tai valtiomuodon
 * mukainen pitkä nimi ("Kiinan kansantasavalta", "Korean tasavalta"),
 * joka opetuspelin kartalla hämää enemmän kuin selittää.
 */
const NIMILISA = {
  CHN: 'Kiina',
  HKG: 'Hongkong',
  MAC: 'Macao',
  TWN: 'Taiwan',
  KOR: 'Etelä-Korea',
  PRK: 'Pohjois-Korea',
  COD: 'Kongon demokraattinen tasavalta',
  COG: 'Kongon tasavalta',
  PSE: 'Palestiina',
};

async function haeNykyaika() {
  console.log('haetaan YK:n paikkaluettelo…');
  const paikat = await haePaikat();
  console.log(`  ${paikat.size} maata tai aluetta koordinaatteineen`);

  console.log('haetaan suomenkieliset maannimet Wikidatasta…');
  const nimet = await haeNimet();
  console.log(`  ${nimet.size} nimeä`);

  console.log('ladataan YK:n muuttajataulukko (noin 6 Mt)…');
  const vastaus = await hae(IMS_OSOITE);
  if (!vastaus) throw new Error('YK:n muuttajataulukkoa ei saatu ladattua');
  const puskuri = Buffer.from(await vastaus.arrayBuffer());
  console.log(`  ${Math.round(puskuri.length / 1024)} kt`);

  const hakemisto = zipHakemisto(puskuri);
  const jaetutXml = zipPura(puskuri, hakemisto.get('xl/sharedStrings.xml')).toString('utf8');
  const jaetut = [...jaetutXml.matchAll(/<si>(.*?)<\/si>/gs)]
    .map((si) => xmlAuki([...si[1].matchAll(/<t[^>]*>(.*?)<\/t>/gs)].map((t) => t[1]).join('')));

  /*
   * Taulukko 1 on työkirjan toinen välilehti (sheet2.xml). Sarakkeet:
   *   A juokseva numero   B kohteen nimi    E kohteen koodi
   *   F lähdön nimi       G lähdön koodi    H..O molemmat sukupuolet
   *                                          1990,1995,…,2020,2024
   * Sarake O eli vuosi 2024 on tuorein, ja se otetaan.
   */
  const xml = zipPura(puskuri, hakemisto.get('xl/worksheets/sheet2.xml')).toString('utf8');

  const virrat = [];
  let paareja = 0;
  for (const solut of xlsxRivit(xml, jaetut)) {
    if (!/^\d+$/.test(solut.A ?? '')) continue; // otsikkorivit pois
    paareja += 1;
    const henkiluku = Number(solut.O);
    if (!Number.isFinite(henkiluku) || henkiluku < KYNNYS) continue;
    const lahto = paikat.get(Number(solut.G));
    const kohde = paikat.get(Number(solut.E));
    if (!lahto || !kohde) continue; // koostealue jommassakummassa päässä
    // Alaviitetähti pois: YK merkitsee sillä maat, joiden luvussa on huomautus.
    const nimea = (paikka, ykNimi) => NIMILISA[paikka.iso3]
      ?? nimet.get(paikka.iso3)
      ?? (ykNimi ?? paikka.iso3).replace(/\*+$/, '').trim();
    virrat.push({
      lahto: { nimi: nimea(lahto, solut.F), iso3: lahto.iso3, lon: lahto.lon, lat: lahto.lat },
      kohde: { nimi: nimea(kohde, solut.B), iso3: kohde.iso3, lon: kohde.lon, lat: kohde.lat },
      henkiluku,
      aikavali: '2024',
      lahde: IMS_LAHDE,
      varmuus: 'tilasto',
    });
  }
  virrat.sort((a, b) => b.henkiluku - a.henkiluku);
  console.log(`  ${paareja} rivistä ${virrat.length} virtaa yli ${KYNNYS.toLocaleString('fi-FI')} hengen`);

  const ilmanNimea = virrat.flatMap((v) => [v.lahto, v.kohde])
    .filter((p) => !NIMILISA[p.iso3] && !nimet.has(p.iso3));
  if (ilmanNimea.length) {
    console.log(`  ilman suomenkielistä nimeä: ${[...new Set(ilmanNimea.map((p) => p.iso3))].join(' ')}`);
  }
  return virrat;
}

// --------------------------------------------------------------- historia

/*
 * 1800-luvun virrat.
 *
 * Koordinaatit ovat alueen edustava piste, eivät tarkka osoite: kun
 * lähtö on "Beninlahti", piste on rannikolla Ouidahin kohdalla, ei
 * minkään yksittäisen sataman kohdalla. Kokoava piste (kokoava: true)
 * tarkoittaa, että pää ei ole yksi paikka vaan monta: lähde antaa
 * vain summan, ei sitä miten se jakautui.
 *
 * henkiluku on se luku jonka lähde ilmoittaa. Kun lähde sanoo "yli 15
 * miljoonaa", henkiluku on 15000000 ja pienin sama; kun lähde antaa
 * haarukan, henkiluku on sen keskikohta ja päät ovat pienin ja suurin.
 * Kaikkien varmuus on 'arvio' — myös orjakaupan kuuden numeron
 * tarkkuudella ilmoitetut luvut, jotka ovat tietokannan laskema
 * arvio kirjatuista matkoista eivätkä henkilölaskenta.
 *
 * Kentän nimi on henkiluku eikä määrä, koska pakettien tunnukset
 * kirjoitetaan ilman umlautteja ja umlautiton "maara" on
 * tests/vanha-maailma.test.mjs:n kieltämien sanojen listalla.
 */

const SV = 'Slave Voyages -tietokanta (Trans-Atlantic Slave Trade Database, Eltis ym.), '
  + 'arviotaulukot slavevoyages.org/assessment/estimates';
const MCKEOWN = 'Adam McKeown, "Global Migration, 1846–1940", Journal of World History 15:2 (2004)';

/** Amerikka yhtenä päätepisteenä: lähde ei kerro miten summa jakautui. */
const AMERIKKA = { nimi: 'Amerikka (kaikki kohteet)', lon: -52, lat: -3, kokoava: true };
const AFRIKKA = { nimi: 'Afrikan Atlantin rannikko', lon: 2, lat: 2, kokoava: true };

const orjakauppaLahdot = [
  ['Angolan ja Loangon rannikko', 13.2, -8.8, 5694570],
  ['Beninlahti', 2.4, 6.2, 1999060],
  ['Biafranlahti', 8.5, 4.0, 1594564],
  ['Kultarannikko', -1.2, 5.1, 1209322],
  ['Senegambia ja Atlantin saaret', -16.5, 14.0, 755515],
  ['Kaakkois-Afrikka ja Intian valtameren saaret', 40.0, -18.0, 542668],
  ['Sierra Leone', -13.2, 8.5, 388771],
  ['Tuulenpuoleinen rannikko', -9.0, 5.3, 336869],
].map(([nimi, lon, lat, henkiluku]) => ({
  lahto: { nimi, lon, lat },
  kohde: AMERIKKA,
  henkiluku,
  aikavali: '1501–1866',
  lahde: SV,
  varmuus: 'arvio',
  selite: 'Laivaan otettuja. Matkalla kuoli koko kaupassa noin 14,5 prosenttia.',
}));

const orjakauppaKohteet = [
  ['Portugalin Brasilia', -40.0, -12.0, 4864372],
  ['Brittiläinen Karibia', -72.0, 17.0, 2318251],
  ['Espanjan Amerikka', -78.0, 21.5, 1292911],
  ['Ranskan Karibia', -72.3, 18.9, 1120216],
  ['Alankomaiden Amerikka', -55.2, 5.8, 444729],
  ['Pohjois-Amerikan mannermaa', -79.9, 32.8, 388747],
  ['Afrikkaan puretut (Sierra Leone, Saint Helena)', -13.2, 8.5, 155568],
  ['Tanskan Länsi-Intia', -64.7, 17.7, 108998],
].map(([nimi, lon, lat, henkiluku]) => ({
  lahto: AFRIKKA,
  kohde: { nimi, lon, lat },
  henkiluku,
  aikavali: '1501–1866',
  lahde: SV,
  varmuus: 'arvio',
  selite: nimi.startsWith('Afrikkaan')
    ? 'Afrikkaan purettuja: pääosin sotalaivojen pysäyttämiltä aluksilta vapautettuja.'
    : 'Perille saapuneita, ei laivaan otettuja.',
}));

const HISTORIA = [
  // --- Atlantin orjakauppa ---
  ...orjakauppaLahdot,
  ...orjakauppaKohteet,
  {
    lahto: { nimi: 'Angolan ja Loangon rannikko', lon: 13.2, lat: -8.8 },
    kohde: { nimi: 'Brasilia', lon: -40.0, lat: -12.0 },
    henkiluku: 3900000,
    pienin: 3800000,
    aikavali: '1501–1866',
    lahde: SV,
    varmuus: 'arvio',
    selite: 'Koko kaupan suurin yksittäinen reitti: Angolasta lähteneistä 5,7 miljoonasta '
      + 'lähes 3,9 miljoonaa vietiin Brasiliaan.',
  },
  {
    lahto: AFRIKKA,
    kohde: AMERIKKA,
    henkiluku: 3500000,
    pienin: 3500000,
    aikavali: '1810–1860',
    lahde: 'Martin Meredith, The Fortunes of Africa (2014), s. 193',
    varmuus: 'arvio',
    selite: 'Orjakaupan 1800-luvun osuus. Britannia kielsi kaupan 1807, mutta Brasiliaan ja '
      + 'Kuubaan vietiin väkeä vielä puoli vuosisataa.',
  },

  // --- Intian valtameren ja Punaisenmeren orjakauppa ---
  {
    lahto: { nimi: 'Swahili-rannikko ja Sansibar', lon: 39.2, lat: -6.2 },
    kohde: { nimi: 'Intian valtameren orjamarkkinat', lon: 55.0, lat: 24.0, kokoava: true },
    henkiluku: 300000,
    pienin: 300000,
    aikavali: '1800-luku',
    lahde: 'Ralph A. Austen, "The 19th Century Islamic Slave Trade from East Africa", '
      + 'Slavery & Abolition 9:3 (1988)',
    varmuus: 'arvio',
    selite: 'Itärannikolta vietyjä. Noin kaksi kolmasosaa jäi Afrikkaan — Sansibarille, '
      + 'rannikolle ja Somaliaan — eikä ylittänyt merta.',
  },
  {
    lahto: { nimi: 'Adeninlahden rannikko', lon: 43.0, lat: 10.5 },
    kohde: { nimi: 'Arabian niemimaa', lon: 39.5, lat: 21.5 },
    henkiluku: 500000,
    suurin: 500000,
    aikavali: '1800-luku',
    lahde: 'Ralph A. Austen, "The 19th Century Islamic Slave Trade from East Africa", '
      + 'Slavery & Abolition 9:3 (1988)',
    varmuus: 'arvio',
    selite: 'Punaisenmeren kauppa: Austenin arvion mukaan hieman alle puoli miljoonaa.',
  },

  // --- Eurooppa Amerikkaan ---
  {
    lahto: { nimi: 'Eurooppa', lon: 12.0, lat: 50.0, kokoava: true },
    kohde: { nimi: 'Amerikka (etenkin Yhdysvallat)', lon: -74.0, lat: 40.7, kokoava: true },
    henkiluku: 56500000,
    pienin: 55000000,
    suurin: 58000000,
    aikavali: '1846–1940',
    lahde: MCKEOWN,
    varmuus: 'arvio',
    selite: 'Yli 65 prosenttia meni Yhdysvaltoihin, loput etenkin Kanadaan, Argentiinaan ja '
      + 'Brasiliaan. Luku on lähtöjä, ei jääneitä: arviolta 40 prosenttia palasi.',
  },
  {
    lahto: { nimi: 'Irlanti', lon: -8.0, lat: 53.0 },
    kohde: { nimi: 'Yhdysvallat', lon: -74.0, lat: 40.7 },
    henkiluku: 1800000,
    aikavali: '1845–1855',
    lahde: 'University College Cork, Emigre — Irish Emigration History',
    varmuus: 'arvio',
    selite: 'Suuren nälänhädän vuodet. Irlannin väkiluku putosi vuosisadan lopulla '
      + 'alle puoleen nälänhätää edeltäneestä.',
  },
  {
    lahto: { nimi: 'Irlanti', lon: -8.0, lat: 53.0 },
    kohde: { nimi: 'Pohjois-Amerikka', lon: -73.0, lat: 44.0, kokoava: true },
    henkiluku: 900000,
    pienin: 800000,
    suurin: 1000000,
    aikavali: '1815–1846',
    lahde: 'University College Cork, Emigre — Irish Emigration History',
    varmuus: 'arvio',
    selite: 'Nälänhätää edeltänyt muutto: noin puolet Kanadaan, puolet Yhdysvaltoihin.',
  },
  {
    lahto: { nimi: 'Saksa', lon: 10.0, lat: 51.0 },
    kohde: { nimi: 'Yhdysvallat', lon: -74.0, lat: 40.7 },
    henkiluku: 5000000,
    pienin: 5000000,
    aikavali: '1800-luku',
    lahde: 'Yhdysvaltain kongressin kirjasto (Library of Congress), German immigration; '
      + 'Deutsches Historisches Museum antaa 1820–1912 yli 5,5 miljoonaa',
    varmuus: 'arvio',
    selite: 'Saksa oli 1800-luvun suurin yksittäinen lähtömaa Yhdysvaltoihin.',
  },
  {
    lahto: { nimi: 'Suomi', lon: 25.7, lat: 61.9 },
    kohde: { nimi: 'Pohjois-Amerikka', lon: -88.0, lat: 46.5, kokoava: true },
    henkiluku: 350000,
    pienin: 300000,
    suurin: 380000,
    aikavali: '1866–1930',
    lahde: 'Siirtolaisuusinstituutin ja Kansallisarkiston aineistoihin perustuvat esitykset; '
      + 'passitilastoista on kirjattu 198 827 lähtijää vuosina 1893–1907',
    varmuus: 'arvio',
    selite: 'Suomalaiset asettuivat etenkin Ylä-järven kaivos- ja metsäseuduille '
      + 'Michiganiin ja Minnesotaan. Vuonna 1930 Yhdysvalloissa laskettiin noin '
      + '320 000 suomalaissyntyistä tai -taustaista.',
  },
  {
    lahto: { nimi: 'Italia', lon: 12.5, lat: 42.0 },
    kohde: { nimi: 'Latinalainen Amerikka', lon: -58.4, lat: -34.6, kokoava: true },
    henkiluku: 6710000,
    aikavali: '1820–1960',
    lahde: 'José C. Moya, siteerattuna Wikipedian artikkelissa "European immigration to the Americas"',
    varmuus: 'arvio',
    selite: 'Suurin osa 1880-luvun jälkeen, pääkohteina Argentiina ja Brasilia. '
      + 'Aikaväli ulottuu 1800-luvun yli, koska lähde raportoi sen niin.',
  },
  {
    lahto: { nimi: 'Espanja', lon: -3.7, lat: 40.4 },
    kohde: { nimi: 'Latinalainen Amerikka', lon: -58.4, lat: -34.6, kokoava: true },
    henkiluku: 5380000,
    aikavali: '1820–1960',
    lahde: 'José C. Moya, siteerattuna Wikipedian artikkelissa "European immigration to the Americas"',
    varmuus: 'arvio',
    selite: 'Pääkohteina Argentiina ja Kuuba.',
  },
  {
    lahto: { nimi: 'Portugali', lon: -8.6, lat: 39.5 },
    kohde: { nimi: 'Brasilia', lon: -43.2, lat: -22.9 },
    henkiluku: 1850000,
    aikavali: '1820–1960',
    lahde: 'José C. Moya, siteerattuna Wikipedian artikkelissa "European immigration to the Americas"',
    varmuus: 'arvio',
    selite: 'Portugalilaiset olivat Brasilian suurin siirtolaisryhmä vuosisadan alkupuolella.',
  },
  {
    lahto: { nimi: 'Britannia ja Irlanti', lon: -3.0, lat: 54.0 },
    kohde: { nimi: 'Australia', lon: 151.2, lat: -33.9 },
    henkiluku: 162000,
    pienin: 162000,
    aikavali: '1788–1868',
    lahde: 'National Museum of Australia, Convict transportation',
    varmuus: 'arvio',
    selite: 'Rangaistusvankeja, joista noin 25 000 naisia. Viimeinen vankilaiva '
      + 'saapui Fremantleen 1868.',
  },

  // --- Aasian suuret järjestelmät ---
  {
    lahto: { nimi: 'Intia (Kalkutta)', lon: 88.4, lat: 22.6 },
    kohde: { nimi: 'Burma', lon: 96.2, lat: 16.8 },
    henkiluku: 15000000,
    pienin: 15000000,
    aikavali: '1846–1940',
    lahde: MCKEOWN,
    varmuus: 'arvio',
    selite: 'Kausityötä riisipelloilla ja satamissa. Valtaosa palasi Intiaan.',
  },
  {
    lahto: { nimi: 'Intia (Madras)', lon: 80.3, lat: 13.1 },
    kohde: { nimi: 'Ceylon', lon: 79.9, lat: 6.9 },
    henkiluku: 8000000,
    pienin: 8000000,
    aikavali: '1846–1940',
    lahde: MCKEOWN,
    varmuus: 'arvio',
    selite: 'Teeplantaasit. Suurin osa kävi ja palasi useita kertoja.',
  },
  {
    lahto: { nimi: 'Intia (Madras)', lon: 80.3, lat: 13.1 },
    kohde: { nimi: 'Malaija', lon: 101.7, lat: 3.1 },
    henkiluku: 4000000,
    suurin: 4000000,
    aikavali: '1846–1940',
    lahde: MCKEOWN,
    varmuus: 'arvio',
    selite: 'Kumiplantaasit ja tinakaivokset.',
  },
  {
    lahto: { nimi: 'Intia (Bombay)', lon: 72.9, lat: 19.1 },
    kohde: { nimi: 'Itä- ja Etelä-Afrikka', lon: 36.0, lat: -8.0, kokoava: true },
    henkiluku: 1000000,
    aikavali: '1846–1940',
    lahde: MCKEOWN,
    varmuus: 'arvio',
    selite: 'Kauppiaita, virkamiehiä ja rautatietyöläisiä Brittiläisen Itä-Afrikan alueelle.',
  },
  {
    lahto: { nimi: 'Etelä-Kiina', lon: 114.2, lat: 22.3 },
    kohde: { nimi: 'Malakan salmen siirtokunnat', lon: 103.8, lat: 1.35 },
    henkiluku: 11000000,
    suurin: 11000000,
    aikavali: '1846–1940',
    lahde: MCKEOWN,
    varmuus: 'arvio',
    selite: 'Singapore oli koko eteläisen Kiinan siirtolaisuuden solmukohta.',
  },
  {
    lahto: { nimi: 'Etelä-Kiina', lon: 114.2, lat: 22.3 },
    kohde: { nimi: 'Siam', lon: 100.5, lat: 13.75 },
    henkiluku: 4000000,
    pienin: 4000000,
    aikavali: '1846–1940',
    lahde: MCKEOWN,
    varmuus: 'arvio',
  },
  {
    lahto: { nimi: 'Etelä-Kiina', lon: 114.2, lat: 22.3 },
    kohde: { nimi: 'Ranskan Indokiina', lon: 106.7, lat: 10.8 },
    henkiluku: 2500000,
    pienin: 2000000,
    suurin: 3000000,
    aikavali: '1846–1940',
    lahde: MCKEOWN,
    varmuus: 'arvio',
  },
  {
    lahto: { nimi: 'Pohjois-Kiina', lon: 118.0, lat: 36.5 },
    kohde: { nimi: 'Mantsuria ja Siperia', lon: 126.6, lat: 45.8 },
    henkiluku: 30500000,
    pienin: 28000000,
    suurin: 33000000,
    aikavali: '1846–1940',
    lahde: MCKEOWN,
    varmuus: 'arvio',
    selite: 'Yhtä suuri muuttoliike kuin Euroopasta Amerikkaan, mutta paljon vähemmän tunnettu. '
      + 'Shandongista ja Hebeistä lähdettiin pohjoiseen raivaamaan peltoa.',
  },
  {
    lahto: { nimi: 'Venäjä', lon: 37.6, lat: 55.8 },
    kohde: { nimi: 'Keski-Aasia ja Siperia', lon: 82.9, lat: 55.0, kokoava: true },
    henkiluku: 13000000,
    pienin: 13000000,
    aikavali: '1846–1940',
    lahde: MCKEOWN,
    varmuus: 'arvio',
    selite: 'Maaorjuuden lakkauttaminen 1861 ja Siperian rata vetivät talonpoikia itään.',
  },
  {
    lahto: { nimi: 'Korea', lon: 127.0, lat: 37.6 },
    kohde: { nimi: 'Mantsuria ja Japani', lon: 130.0, lat: 41.0, kokoava: true },
    henkiluku: 2000000,
    suurin: 2000000,
    aikavali: '1846–1940',
    lahde: MCKEOWN,
    varmuus: 'arvio',
  },
  {
    lahto: { nimi: 'Japani', lon: 139.7, lat: 35.7 },
    kohde: { nimi: 'Mantsuria ja Tyynenmeren siirtokunnat', lon: 125.0, lat: 42.0, kokoava: true },
    henkiluku: 500000,
    pienin: 500000,
    aikavali: '1846–1940',
    lahde: MCKEOWN,
    varmuus: 'arvio',
  },
  {
    lahto: { nimi: 'Etelä- ja Itä-Aasia', lon: 110.0, lat: 20.0, kokoava: true },
    kohde: { nimi: 'Amerikka', lon: -122.4, lat: 37.8, kokoava: true },
    henkiluku: 2500000,
    suurin: 2500000,
    aikavali: '1846–1940',
    lahde: MCKEOWN,
    varmuus: 'arvio',
    selite: 'Kultakenttiä ja rautateitä. Virta tyrehtyi, kun Yhdysvallat ja muut maat '
      + 'säätivät aasialaisia koskevat maahantulokiellot.',
  },

  // --- Sopimustyöläiset siirtomaihin ---
  {
    lahto: { nimi: 'Intia', lon: 88.4, lat: 22.6 },
    kohde: { nimi: 'Mauritius', lon: 57.5, lat: -20.3 },
    henkiluku: 400000,
    pienin: 400000,
    aikavali: '1834–1917',
    lahde: 'Striking Women -hanke (Leedsin ja Lincolnin yliopistot), Indentured labour from South Asia',
    varmuus: 'arvio',
    selite: 'Sopimustyöläisiä sokeriplantaaseille. Järjestelmä otettiin käyttöön, kun '
      + 'orjuus lakkautettiin Britannian siirtomaissa 1833.',
  },
  {
    lahto: { nimi: 'Intia', lon: 88.4, lat: 22.6 },
    kohde: { nimi: 'Brittiläinen Guayana', lon: -58.2, lat: 6.8 },
    henkiluku: 239000,
    aikavali: '1838–1917',
    lahde: 'Striking Women -hanke; Stabroek News, An overview of Indian Indentureship in Guyana',
    varmuus: 'arvio',
    selite: 'Saapuneita kirjattiin 238 979, joista 65 538 palasi Intiaan.',
  },
  {
    lahto: { nimi: 'Intia', lon: 80.3, lat: 13.1 },
    kohde: { nimi: 'Natal', lon: 31.0, lat: -29.9 },
    henkiluku: 150000,
    aikavali: '1860–1911',
    lahde: 'Striking Women -hanke (Leedsin ja Lincolnin yliopistot)',
    varmuus: 'arvio',
    selite: 'Tästä väestä kasvoi Etelä-Afrikan intialaisyhteisö.',
  },
  {
    lahto: { nimi: 'Intia', lon: 88.4, lat: 22.6 },
    kohde: { nimi: 'Trinidad', lon: -61.4, lat: 10.4 },
    henkiluku: 145000,
    aikavali: '1845–1917',
    lahde: 'Striking Women -hanke (Leedsin ja Lincolnin yliopistot)',
    varmuus: 'arvio',
  },
  {
    lahto: { nimi: 'Intia', lon: 88.4, lat: 22.6 },
    kohde: { nimi: 'Fidži', lon: 178.4, lat: -18.1 },
    henkiluku: 61000,
    aikavali: '1879–1916',
    lahde: 'Striking Women -hanke; laivaluetteloissa 60 965 lähtijää',
    varmuus: 'arvio',
  },
];

// ------------------------------------------------------------- kirjoitus

const nykyaika = await haeNykyaika();

const suurin = (lista) => lista.reduce((s, v) => Math.max(s, v.henkiluku), 0);
console.log(`\nnykyaika ${nykyaika.length} virtaa, suurin ${suurin(nykyaika).toLocaleString('fi-FI')}`);
console.log(`historia ${HISTORIA.length} virtaa, suurin ${suurin(HISTORIA).toLocaleString('fi-FI')}`);

const puutteet = HISTORIA.filter((v) => !v.lahde || v.varmuus !== 'arvio');
if (puutteet.length) throw new Error(`${puutteet.length} historiariviltä puuttuu lähde tai varmuusmerkintä`);

if (kuiva) process.exit(0);

const paiva = new Date().toLocaleDateString('fi-FI');
const rivit = (lista) => lista.map((v) => `  ${JSON.stringify(v)},`).join('\n');

const teksti = `// Väestön liikehdintä: mistä minne ja kuinka moni.
//
// TÄMÄ TIEDOSTO ON KONEEN KIRJOITTAMA. Älä muokkaa käsin:
//   node tools/hae-muuttoliike.mjs
//
// Aineisto: nykyaika YK:n väestöosaston muuttajakannoista, historia
//           historiantutkimuksen julkaistuista arvioista (ks. rivien
//           lahde-kentät).
// Viite:    United Nations Department of Economic and Social Affairs,
//           Population Division (2024). International Migrant Stock 2024
//           (POP/DB/MIG/Stock/Rev.2024), taulukko 1.
// Haettu:   ${IMS_OSOITE}
//           (avoin, ei avainta eikä rekisteröitymistä) — ${paiva}
//           Koordinaatit ja ISO-koodit: population.un.org/dataportalapi
//           Suomenkieliset maannimet: Wikidata (P298), CC0.
// Lisenssi: YK:n muuttajakanta-aineisto CC BY 3.0 IGO
//           (creativecommons.org/licenses/by/3.0/igo/), copyright
//           © 2024 United Nations. Historiaosan luvut ovat lainauksia
//           julkaistuista tutkimuksista, ja lähde on merkitty riveille.
//
// VAROITUS TULKINNASTA. Nykyajan luku on muuttajakanta (migrant stock):
// kuinka moni kohdemaassa asuva on syntynyt lähtömaassa vuoden 2024
// puolivälissä. Se on vuosikymmenten kertymä, EI vuoden aikana
// muuttaneiden määrä. Historian luvut taas ovat lähtöjä tai saapumisia
// koko aikavälin ajalta, ja monet niistä sisältävät saman ihmisen
// useaan kertaan — esimerkiksi Intiasta Burmaan matkattiin kausityöhön
// vuosi toisensa jälkeen. Kahden aikatason lukuja ei siis voi verrata
// suoraan keskenään.
//
// Mukana ovat vain yli ${KYNNYS.toLocaleString('fi-FI')} hengen virrat. Pienemmät on jätetty pois,
// jotta kartta pysyy luettavana; koko aineistossa maapareja on yli 9000.
//
// Kentät:
//   lahto, kohde   { nimi, lon, lat } ja nykyajassa myös iso3.
//                  kokoava: true tarkoittaa, ettei pää ole yksi paikka
//                  vaan monta — lähde antaa vain summan.
//                  Historian koordinaatti on alueen edustava piste eikä
//                  tarkka osoite: "Beninlahti" on rannikolla Ouidahin
//                  kohdalla, ei minkään yksittäisen sataman paikalla.
//   henkiluku      ihmisten lukumäärä. Historiassa se luku jonka lähde
//                  ilmoittaa; haarukassa sen keskikohta.
//   pienin         haarukan alapää, tai lähteen "yli tämän verran".
//   suurin         haarukan yläpää, tai lähteen "jopa tämän verran".
//   aikavali       teksti, ei aina vuosiluku.
//   lahde          viite. Jokaisella historiarivillä on oma.
//   varmuus        'tilasto' = virallinen tilasto, 'arvio' = tutkijan
//                  arvio. KAIKKI historian luvut ovat arvioita, myös ne
//                  jotka on ilmoitettu numeron tarkkuudella.
//   selite         valinnainen suomenkielinen taustalause.
//
// Espanjan Amerikan orjakauppaluku 1 292 911 on laskettu Slave Voyages
// -taulukon lippukohtaisista soluista, koska taulukon oma summasarake
// oli tältä riviltä virheellinen. Korjattu luku täsmää julkaistuun
// kokonaissummaan 10 702 652 saapunutta.
//
// nykyaika ${nykyaika.length} virtaa, historia ${HISTORIA.length} virtaa.

const NYKYAIKA = [
${rivit(nykyaika)}
];

const HISTORIA = [
${rivit(HISTORIA)}
];

export const MUUTTOLIIKE = { nykyaika: NYKYAIKA, historia: HISTORIA };
`;

const ulos = join(JUURI, 'js/packs/linssi-muuttoliike.js');
writeFileSync(ulos, teksti);
console.log(`\nkirjoitettu ${ulos} (${Math.round(teksti.length / 1024)} kt)`);
