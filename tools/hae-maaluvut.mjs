/*
 * Hakee maakohtaiset tunnusluvut lämpökarttalinssiä varten.
 *
 *   node tools/hae-maaluvut.mjs [--kuiva]
 *
 * Kirjoittaa js/packs/linssi-maaluvut.js, jossa on kuusi mittaria
 * maittain ISO 3166-1 alpha-3 -koodilla avattuna. Linssi värittää
 * maailmankartan maat luvun mukaan, joten aineiston on katettava
 * mahdollisimman moni js/packs/maailmankartta.js:n countryShapes-maa.
 *
 * --- miksi uusin vuosi haetaan maakohtaisesti ---
 *
 * Maailmanpankin sarjoissa on aukkoja, eivätkä ne ole samoja eri
 * maissa: väkiluku on kaikilta viime vuodelta, mutta lukutaitoaste
 * mitataan väestönlaskennan yhteydessä, joten yhdellä maalla tuorein
 * luku on viime vuodelta ja toisella 1990-luvulta. Jos kaikille
 * otettaisiin sama vuosi, kartalta katoaisi puolet maista. Siksi
 * jokaiselle maalle otetaan sen oma tuorein ei-tyhjä havainto ja
 * vuosi kirjataan mukaan — pelaajalle on rehellistä näyttää, että
 * luku voi olla vanha.
 *
 * --- miksi onnellisuus tulee muualta ---
 *
 * Onnellisuusindeksiä ei ole Maailmanpankissa. World Happiness Report
 * julkaisee kuvion 2.1 aineiston ilmaiseksi, mutta xlsx-tiedostona,
 * jota ei saa luettua ilman kirjastoa (pelissä ei ole riippuvuuksia
 * eikä niitä haluta työkaluihinkaan). Our World in Data julkaisee
 * saman sarjan koneluettavana CSV:nä ISO-3-koodeilla, joten se
 * haetaan sieltä. Luku on sama; lähde on merkitty molempiin.
 *
 * --- aggregaatit pois ---
 *
 * country/all palauttaa myös koostealueet (WLD, EUU, "Africa Eastern
 * and Southern"). Ne näyttäisivät kartalla mailta mutta eivät ole
 * maita, joten maalista haetaan erikseen ja koosteet — joilla
 * region.id on 'NA' — pudotetaan.
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
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
const nuku = (ms) => new Promise((r) => { setTimeout(r, ms); });
const OTSAKKEET = { 'user-agent': 'Matkakirja/1.0 (opetuspeli)' };

/*
 * Mittarit siinä järjestyksessä kuin ne linssivalikossa näytetään.
 *
 * `suunta` kertoo, saako lukua arvottaa: 'ylos' tarkoittaa että
 * suurempi on parempi, 'neutraali' ettei ole. Väkiluku ja
 * kaupungistumisaste ovat tarkoituksella neutraaleja — iso maa ei ole
 * parempi kuin pieni eikä kaupunki parempi kuin maaseutu, ja
 * opetuspelissä värin ei pidä väittää niin. Piirtäjä voi käyttää
 * neutraaleille yksiväristä asteikkoa ja arvotetuille kaksipäistä.
 *
 * `tarkkuus` on desimaalien määrä pyöristyksessä. Se ei mene
 * vientiin, vaan on tämän ajon oma asetus.
 */
const MITTARIT = [
  {
    avain: 'onnellisuus',
    nimi: 'Onnellisuus',
    yksikko: 'pistettä (0–10)',
    lahde: 'World Happiness Report 2026 / Our World in Data',
    suunta: 'ylos',
    tarkkuus: 2,
  },
  {
    avain: 'bkt',
    nimi: 'Bruttokansantuote asukasta kohti',
    yksikko: 'dollaria vuodessa',
    lahde: 'Maailmanpankki NY.GDP.PCAP.CD',
    suunta: 'ylos',
    tarkkuus: 0,
    koodi: 'NY.GDP.PCAP.CD',
  },
  {
    avain: 'elinika',
    nimi: 'Odotettu elinikä',
    yksikko: 'vuotta',
    lahde: 'Maailmanpankki SP.DYN.LE00.IN',
    suunta: 'ylos',
    tarkkuus: 1,
    koodi: 'SP.DYN.LE00.IN',
  },
  {
    avain: 'vakiluku',
    nimi: 'Väkiluku',
    yksikko: 'asukasta',
    lahde: 'Maailmanpankki SP.POP.TOTL',
    suunta: 'neutraali',
    tarkkuus: 0,
    koodi: 'SP.POP.TOTL',
  },
  {
    avain: 'lukutaito',
    nimi: 'Lukutaitoaste',
    yksikko: '% aikuisista',
    lahde: 'Maailmanpankki SE.ADT.LITR.ZS',
    suunta: 'ylos',
    tarkkuus: 1,
    koodi: 'SE.ADT.LITR.ZS',
  },
  {
    avain: 'kaupungistuminen',
    nimi: 'Kaupungistumisaste',
    yksikko: '% väestöstä',
    lahde: 'Maailmanpankki SP.URB.TOTL.IN.ZS',
    suunta: 'neutraali',
    tarkkuus: 1,
    koodi: 'SP.URB.TOTL.IN.ZS',
  },
];

/*
 * Etelä-Sudan kahdella koodilla.
 *
 * ISO 3166-1 antaa Etelä-Sudanille koodin SSD, mutta maailmankartan
 * muodot on piirretty Natural Earthin aineistosta, jossa koodi on
 * SDS. Kartan avain on siis SDS, ja ilman tätä siltaa Etelä-Sudan
 * jäisi ainoana pelin maana kokonaan värittämättä. Arvo kirjoitetaan
 * molempiin avaimiin, jotta tiedosto on oikein sekä ISO-koodilla
 * hakevalle että pelin kartalle.
 */
const LISAAVAIMET = { SSD: 'SDS' };

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

/** Maailmanpankin maalista ilman koostealueita. */
async function maalista() {
  const vastaus = await hae('https://api.worldbank.org/v2/country?format=json&per_page=400');
  if (!vastaus) throw new Error('maalistaa ei saatu haettua');
  const [, rivit] = await vastaus.json();
  return new Map(rivit.filter((m) => m.region?.id !== 'NA').map((m) => [m.id, m.name]));
}

/**
 * Yhden mittarin tuorein ei-tyhjä havainto joka maalle.
 *
 * Koko sarja haetaan sivuittain eikä esimerkiksi mrnev-parametrilla,
 * koska silloin rajapinta päättäisi puolestamme mikä on "tuorein" —
 * näin valinta on tässä tiedostossa näkyvissä ja tarkistettavissa.
 */
async function haeMittari(koodi) {
  const ulos = new Map();
  let sivu = 1;
  let sivuja = 1;
  do {
    const osoite = `https://api.worldbank.org/v2/country/all/indicator/${koodi}`
      + `?format=json&per_page=5000&page=${sivu}`;
    const vastaus = await hae(osoite);
    if (!vastaus) throw new Error(`${koodi}: sivu ${sivu} jäi hakematta`);
    const [meta, rivit] = await vastaus.json();
    sivuja = meta?.pages ?? 1;
    for (const rivi of rivit ?? []) {
      if (rivi.value === null || rivi.value === undefined) continue;
      const maa = rivi.countryiso3code;
      const vuosi = Number(rivi.date);
      if (!maa || !Number.isFinite(vuosi)) continue;
      const vanha = ulos.get(maa);
      if (!vanha || vanha.vuosi < vuosi) ulos.set(maa, { arvo: Number(rivi.value), vuosi });
    }
    sivu += 1;
    await nuku(300);
  } while (sivu <= sivuja);
  return ulos;
}

/**
 * Onnellisuusindeksin tuorein vuosi maittain Our World in Datan
 * CSV:stä. Rivi on `entity,code,year,cantril_ladder_score`, ja
 * koosteilla (World, Europe) koodi on OWID_-alkuinen — vain kolmen
 * ison kirjaimen koodit ovat maita.
 */
async function haeOnnellisuus() {
  const osoite = 'https://ourworldindata.org/grapher/happiness-cantril-ladder.csv'
    + '?csvType=full&useColumnShortNames=true';
  const vastaus = await hae(osoite);
  if (!vastaus) throw new Error('onnellisuusaineistoa ei saatu haettua');
  const teksti = await vastaus.text();
  const ulos = new Map();
  for (const rivi of teksti.trim().split('\n').slice(1)) {
    const [, koodi, vuosiTeksti, arvoTeksti] = rivi.split(',');
    if (!/^[A-Z]{3}$/.test(koodi ?? '')) continue;
    const vuosi = Number(vuosiTeksti);
    const arvo = Number(arvoTeksti);
    if (!Number.isFinite(vuosi) || !Number.isFinite(arvo)) continue;
    const vanha = ulos.get(koodi);
    if (!vanha || vanha.vuosi < vuosi) ulos.set(koodi, { arvo, vuosi });
  }
  return ulos;
}

const { MAAILMANKARTTA } = await import(`file://${join(JUURI, 'js/packs/maailmankartta.js')}`);
const PELIN_MAAT = Object.keys(MAAILMANKARTTA.map.countryShapes);

console.log('haetaan Maailmanpankin maalista…');
const maat = await maalista();
console.log(`  ${maat.size} maata (koosteet pudotettu)\n`);

/*
 * Taiwan ei ole Maailmanpankin jäsen eikä sen maalistalla, joten sen
 * luvut jäävät puuttumaan. Se on silti pelin kartalla, ja Our World
 * in Datan onnellisuussarjassa se on mukana — siksi kelpuutetut
 * koodit ovat maalista JA pelin maat, ei pelkkä maalista.
 */
const KELPAA = new Set([...maat.keys(), ...PELIN_MAAT]);

const arvot = {};
const merkitse = (maa, avain, tieto, tarkkuus) => {
  if (!KELPAA.has(maa)) return;
  const arvo = Number(tieto.arvo.toFixed(tarkkuus));
  for (const koodi of [maa, LISAAVAIMET[maa]].filter(Boolean)) {
    (arvot[koodi] ??= {})[avain] = { arvo, vuosi: tieto.vuosi };
  }
};

for (const mittari of MITTARIT) {
  process.stdout.write(`${mittari.avain.padEnd(17)}`);
  const tiedot = mittari.koodi ? await haeMittari(mittari.koodi) : await haeOnnellisuus();
  for (const [maa, tieto] of tiedot) merkitse(maa, mittari.avain, tieto, mittari.tarkkuus);
  const pelissa = PELIN_MAAT.filter((m) => arvot[m]?.[mittari.avain]);
  const vuodet = pelissa.map((m) => arvot[m][mittari.avain].vuosi);
  console.log(`${String(tiedot.size).padStart(4)} maata — pelin maista ${pelissa.length}/${PELIN_MAAT.length}`
    + (vuodet.length ? `, vuodet ${Math.min(...vuodet)}–${Math.max(...vuodet)}` : ''));
}

const kaikki = Object.keys(arvot).sort();
const taydet = PELIN_MAAT.filter((m) => MITTARIT.every((mi) => arvot[m]?.[mi.avain]));
const yhtaan = PELIN_MAAT.filter((m) => arvot[m]);
console.log(`\n${kaikki.length} maata tiedostoon`);
console.log(`pelin maista ${yhtaan.length}/${PELIN_MAAT.length} saa vähintään yhden luvun`);
console.log(`pelin maista ${taydet.length}/${PELIN_MAAT.length} saa kaikki kuusi`);
for (const mittari of MITTARIT) {
  const puuttuu = PELIN_MAAT.filter((m) => !arvot[m]?.[mittari.avain]);
  if (puuttuu.length) console.log(`  ${mittari.avain}: puuttuu ${puuttuu.join(' ')}`);
}

if (kuiva) process.exit(0);

const paiva = new Date().toLocaleDateString('fi-FI');
const mittariRivit = MITTARIT
  .map(({ avain, nimi, yksikko, lahde, suunta }) => `  ${JSON.stringify({ avain, nimi, yksikko, lahde, suunta })},`)
  .join('\n');
const arvoRivit = kaikki.map((maa) => `  ${maa}: ${JSON.stringify(arvot[maa])},`).join('\n');

const teksti = `// Maakohtaiset tunnusluvut lämpökarttalinssille.
//
// TÄMÄ TIEDOSTO ON KONEEN KIRJOITTAMA. Älä muokkaa käsin:
//   node tools/hae-maaluvut.mjs
//
// Aineisto: Maailmanpankin World Development Indicators (bkt, elinikä,
//           väkiluku, lukutaito, kaupungistuminen) sekä World Happiness
//           Reportin Cantrilin tikapuu (onnellisuus).
// Viite:    World Bank, World Development Indicators, api.worldbank.org/v2 —
//           Helliwell, Layard, Sachs, De Neve, Aknin & Wang (toim.) 2026,
//           World Happiness Report 2026, University of Oxford: Wellbeing
//           Research Centre.
// Haettu:   https://api.worldbank.org/v2/country/all/indicator/KOODI (avoin,
//           ei avainta) ja https://ourworldindata.org/grapher/
//           happiness-cantril-ladder.csv (${paiva})
// Lisenssi: Maailmanpankin indikaattorit CC BY 4.0 (World Bank Open Data,
//           datacatalog.worldbank.org/public-licenses). World Happiness
//           Reportin kuvion 2.1 aineisto on julkaistu maksutta vapaaseen
//           käyttöön (worldhappiness.report/data-sharing); tässä se on
//           Our World in Datan koneluettavana koosteena, jonka OWIDin oma
//           käsittely on CC BY 4.0. Mainitse lähteet käytettäessä.
//
// Jokaiselle maalle on otettu SEN OMA tuorein ei-tyhjä havainto, koska
// sarjoissa on maakohtaisia aukkoja. Vuosi on siksi mukana jokaisessa
// luvussa, eikä se ole kaikilla sama — etenkin lukutaitoaste mitataan
// harvoin, joten sen vuosi voi olla vuosikymmeniä vanha.
//
// suunta: 'ylos' = suurempi on parempi, 'neutraali' = lukua ei arvoteta.
// Väkiluku ja kaupungistumisaste ovat neutraaleja tarkoituksella.
//
// Kattavuus maailmankartan ${PELIN_MAAT.length} maasta: ${yhtaan.length} saa vähintään yhden luvun,
// ${taydet.length} kaikki kuusi. Etelä-Sudan on tiedostossa sekä ISO-koodilla SSD
// että kartan Natural Earth -koodilla SDS.

const MITTARIT = [
${mittariRivit}
];

const ARVOT = {
${arvoRivit}
};

export const MAALUVUT = { mittarit: MITTARIT, arvot: ARVOT };
`;

const ulos = join(JUURI, 'js/packs/linssi-maaluvut.js');
writeFileSync(ulos, teksti);
console.log(`\nkirjoitettu ${ulos} (${Math.round(teksti.length / 1024)} kt)`);
