// Varjostuksen tarkistukset.
//
// TÄMÄ TESTI ESTÄÄ KOKO KUVAN KÄÄNTYMISEN NURIN PÄIN.
//
// Varjostus on kaksi etumerkkiä: mihin suuntaan ruudukon y kasvaa ja
// mistä suunnasta aurinko paistaa. Kumpi tahansa väärin ja kartta
// näyttää yhä täysin uskottavalta — vuoret vain ovat laaksoja ja
// laaksot vuoria. Silmä ei huomaa virhettä laskusta vaan siitä, että
// maasto tuntuu oudolta, eikä sitä huomaa lainkaan ilman vertailua.
// Siksi suunnat tarkistetaan tässä numeroina.
//
// Kaikki ruudukot ovat keksittyjä: varjosta() ei koske verkkoon eikä
// tiedostoihin, joten testi on nopea eikä vaadi ETOPO1:n latausta.

import test from 'node:test';
import assert from 'node:assert/strict';

import { varjosta, tasainenVarjo, AURINKO, OLETUKSET } from '../tools/varjostus.mjs';
import { latRivista, lonSarakkeesta } from '../tools/hae-korkeusruudukko.mjs';

/*
 * Testiruudukko on koko maailma yhden asteen ruuduilla: 361 x 181.
 * Koko maailma eikä pala siitä, koska leveysaste luetaan y:stä ja
 * sauma sarakkeista 0 ja leveys-1 — pala ei kantaisi kumpaakaan.
 */
const RUUTU = 1;
const LEVEYS = 361;
const KORKEUS = 181;

/** Ruudukko funktiosta (lat, lon) -> metriä. */
function teeRuudukko(f) {
  const z = new Float32Array(LEVEYS * KORKEUS);
  for (let y = 0; y < KORKEUS; y++) {
    for (let x = 0; x < LEVEYS; x++) {
      z[y * LEVEYS + x] = f(latRivista(y, RUUTU), lonSarakkeesta(x, RUUTU), x, y);
    }
  }
  return { z, leveys: LEVEYS, korkeus: KORKEUS, ruutu: RUUTU };
}

const kohta = (lat, lon) => Math.round((lat + 90) / RUUTU) * LEVEYS + Math.round((lon + 180) / RUUTU);
const TASAINEN = tasainenVarjo();

test('tasainen maa antaa kaikkialla saman arvon', () => {
  // Tasaisen maan arvo on auringon korkeuden sini, ei 0,5. Se on
  // varjon nollataso: pohjakartta piirtää poikkeaman tästä.
  assert.equal(TASAINEN, Math.sin(45 * Math.PI / 180));

  const { varjo, tasainen } = varjosta(teeRuudukko(() => 500));
  assert.equal(tasainen, TASAINEN);
  let poikkeavia = 0;
  for (let i = 0; i < varjo.length; i++) {
    if (Math.abs(varjo[i] - TASAINEN) > 1e-6) poikkeavia += 1;
  }
  assert.equal(poikkeavia, 0, 'tasainen maa ei saanut yhtä ja samaa arvoa');
});

test('pohjoiseen viettävä rinne on vaaleampi kuin etelään viettävä', () => {
  /*
   * TÄMÄ ON SE TESTI. Aurinko on luoteessa, joten pohjoiseen laskeva
   * rinne kääntyy sitä kohti ja etelään laskeva pois. Jos nämä menevät
   * päittäin, koko maailman maasto on ylösalaisin.
   *
   * "Viettää pohjoiseen" = korkeus VÄHENEE pohjoiseen mentäessä.
   */
  const kaltevuus = 500; // metriä leveysastetta kohti
  const pohjoiseen = varjosta(teeRuudukko((lat) => 5000 - kaltevuus * lat));
  const etelaan = varjosta(teeRuudukko((lat) => 5000 + kaltevuus * lat));

  const p = pohjoiseen.varjo[kohta(0, 0)];
  const e = etelaan.varjo[kohta(0, 0)];

  assert.ok(p > TASAINEN, `pohjoiseen viettävä ei ollut tasaista vaaleampi (${p})`);
  assert.ok(e < TASAINEN, `etelään viettävä ei ollut tasaista tummempi (${e})`);
  assert.ok(p > e, `pohjoisrinne ${p} ei ollut etelärinnettä ${e} vaaleampi`);

  // Yhtä jyrkät vastarinteet ovat symmetrisesti tasaisen molemmin
  // puolin — jos eivät, valo tulee vinossa jostain muusta syystä.
  assert.ok(Math.abs((p - TASAINEN) - (TASAINEN - e)) < 0.02,
    `vastarinteet eivät ole symmetrisiä: ${p} ja ${e}`);
});

test('länteen viettävä rinne on vaaleampi kuin itään viettävä', () => {
  // Sama koe toisessa suunnassa: luode on yhtä paljon länttä kuin
  // pohjoista, joten itä-länsi-suunnan etumerkin on osuttava myös.
  const kaltevuus = 500; // metriä pituusastetta kohti
  const lanteen = varjosta(teeRuudukko((lat, lon) => 5000 + kaltevuus * lon));
  const itaan = varjosta(teeRuudukko((lat, lon) => 5000 - kaltevuus * lon));

  const l = lanteen.varjo[kohta(0, 0)];
  const i = itaan.varjo[kohta(0, 0)];
  assert.ok(l > TASAINEN, `länteen viettävä ei ollut tasaista vaaleampi (${l})`);
  assert.ok(i < TASAINEN, `itään viettävä ei ollut tasaista tummempi (${i})`);
});

test('aurinko kaakosta kääntää kuvan nurin päin', () => {
  /*
   * Vastakoe: jos joku siirtää auringon kaakkoon, saman rinteen
   * kirkkauden ON muututtava päinvastaiseksi. Testi ei siis vartioi
   * vain lopputulosta vaan sitä, että atsimuutti todella ohjaa valoa
   * eikä ole koristeena asetuksissa.
   */
  const rinne = teeRuudukko((lat) => 5000 - 500 * lat); // viettää pohjoiseen
  const luode = varjosta(rinne).varjo[kohta(0, 0)];
  const kaakko = varjosta(rinne, { atsimuutti: 135 }).varjo[kohta(0, 0)];

  assert.equal(AURINKO.atsimuutti, 315, 'oletusaurinko ei ole enää luoteessa');
  assert.equal(AURINKO.korkeuskulma, 45, 'auringon korkeuskulma ei ole enää 45°');
  assert.ok(luode > TASAINEN && kaakko < TASAINEN,
    `atsimuutti ei käännä valoa: luode ${luode}, kaakko ${kaakko}`);
});

test('jyrkempi rinne erottuu enemmän ja liioittelu 0 litistää kaiken', () => {
  const loiva = teeRuudukko((lat) => 5000 - 100 * lat);
  const jyrkka = teeRuudukko((lat) => 5000 - 1000 * lat);
  const ero = (r, asetukset) => varjosta(r, asetukset).varjo[kohta(0, 0)] - TASAINEN;

  assert.ok(ero(jyrkka) > ero(loiva), 'jyrkkä rinne ei erottunut loivaa enempää');
  // Liioittelun on kasvatettava eroa — se on koko kertoimen tarkoitus.
  assert.ok(ero(loiva, { liioittelu: 20 }) > ero(loiva, { liioittelu: 5 }),
    'liioittelu ei kasvata eroa');
  assert.ok(Math.abs(ero(jyrkka, { liioittelu: 0 })) < 1e-6,
    'liioittelu 0 ei litistänyt maastoa tasaiseksi');
});

test('varjo pysyy välillä 0-1 myös mahdottoman jyrkässä maastossa', () => {
  // Kilometri korkeuseroa joka ruutuun molempiin suuntiin: pelkkää
  // sahalaitaa, jota ei ole olemassa. Arvon on silti pysyttävä
  // välillä, koska piirtäjä käyttää sitä suoraan kirkkautena.
  const sahalaita = teeRuudukko((lat, lon, x, y) => ((x + y) % 2 ? 1000 : -1000));
  const { varjo } = varjosta(sahalaita, { liioittelu: 60 });
  let pienin = Infinity;
  let suurin = -Infinity;
  for (let i = 0; i < varjo.length; i++) {
    if (varjo[i] < pienin) pienin = varjo[i];
    if (varjo[i] > suurin) suurin = varjo[i];
    assert.ok(Number.isFinite(varjo[i]), `epäluku kohdassa ${i}`);
  }
  assert.ok(pienin >= 0 && suurin <= 1, `varjo karkasi välin ulkopuolelle: ${pienin} .. ${suurin}`);
});

test('meren varjostus lasketaan mutta se on paljon vaimeampi', () => {
  /*
   * Merenpohja EI ole litteä — mannerjalustan reuna ja keskiselänteet
   * ovat maailman suurimpia maastonmuotoja, ja oikeasta ruudukosta
   * mitattuna syvän meren varjo hajoaa enemmän kuin maan (0,141 vs
   * 0,089 kertoimella 10). Siksi se on vaimennettava, tai meri veisi
   * huomion mantereilta.
   */
  const rinne = (pohja) => teeRuudukko((lat) => pohja - 1000 * lat);
  const poikkeama = (pohja) => varjosta(rinne(pohja)).varjo[kohta(0, 0)] - TASAINEN;

  const maalla = poikkeama(3000);
  const syvalla = poikkeama(-3000);
  assert.ok(maalla > 0.01, 'maan rinne ei erottunut lainkaan');
  assert.ok(syvalla > 0, 'meren varjostus katosi kokonaan — merenpohjakin on maastoa');
  assert.ok(Math.abs(syvalla / maalla - OLETUKSET.meriVaimennus) < 0.02,
    `meren vaimennus ${(syvalla / maalla).toFixed(3)} ei vastaa asetusta ${OLETUKSET.meriVaimennus}`);
});

test('rannan vaimennus liukuu eikä hyppää', () => {
  /*
   * Jyrkkä raja merenpinnassa piirtäisi yhden ruudun levyisen
   * kirkkausportaan pitkin koko maailman rantaviivaa — hiusviivan,
   * joka näyttää piirtovirheeltä. Vaimennuksen on siis alettava
   * nollasta rannalla ja oltava täysi vasta mannerjalustan reunalla.
   */
  const rinne = (pohja) => teeRuudukko((lat) => pohja - 1000 * lat);
  const poikkeama = (pohja) => varjosta(rinne(pohja)).varjo[kohta(0, 0)] - TASAINEN;

  const ranta = poikkeama(0);
  const matala = poikkeama(OLETUKSET.meriSyvyys / 2);
  const taysi = poikkeama(OLETUKSET.meriSyvyys);
  const syva = poikkeama(OLETUKSET.meriSyvyys * 20);

  assert.ok(Math.abs(ranta / poikkeama(1000) - 1) < 0.01, 'rannalla ei saa vielä vaimentaa');
  assert.ok(ranta > matala && matala > taysi, 'vaimennus ei kasva syvyyden mukana');
  // Puolivälissä puolet vaimennuksesta.
  const puolivali = (1 + OLETUKSET.meriVaimennus) / 2;
  assert.ok(Math.abs(matala / ranta - puolivali) < 0.02,
    `puolivälin vaimennus ${(matala / ranta).toFixed(3)} ei ole ${puolivali}`);
  // Täyden syvyyden jälkeen vaimennus ei enää kasva.
  assert.ok(Math.abs(syva - taysi) < 1e-6, 'vaimennus jatkoi kasvuaan pohjaan asti');
});

test('napa-alueella ruudun leveys pohjataan eikä kutistu nollaan', () => {
  /*
   * Leveyspiiri kutistuu navoille päin, joten itä-länsi-suunnassa
   * ruudun todellinen leveys on ruutu * cos(leveysaste). Ilman
   * pohjaa Etelämanner ja Jäämeri saisivat säteittäisen raidoituksen,
   * joka on jakolaskun räjähdys eikä maastoa: oikeasta ruudukosta
   * mitattuna 89,9 asteella suurin poikkeama on rajattomana 0,21 ja
   * pohjattuna 0,014.
   *
   * Pohja tekee 84 asteen napapuoleisista riveistä keskenään
   * identtisiä, ja juuri se tarkistetaan tässä.
   */
  const raita = teeRuudukko((lat, lon) => 200 * lon);
  const { varjo } = varjosta(raita);
  const raja = OLETUKSET.napaRaja;

  const v84 = varjo[kohta(raja, 0)];
  const v86 = varjo[kohta(86, 0)];
  const v89 = varjo[kohta(89, 0)];
  assert.ok(Math.abs(v86 - v84) < 1e-6 && Math.abs(v89 - v84) < 1e-6,
    `napapohja ei pidä rivejä samana: ${v84}, ${v86}, ${v89}`);

  // Rajan päiväntasaajan puolella arvo muuttuu leveyspiirin mukana.
  assert.ok(Math.abs(varjo[kohta(60, 0)] - v84) > 1e-3, 'pohja ulottui liian etelään');

  // Ja ilman pohjaa sama maasto kärjistyy — tämä on se, mitä estetään.
  const rajaton = varjosta(raita, { napaRaja: 89.999 }).varjo[kohta(89, 0)];
  assert.ok(Math.abs(rajaton - TASAINEN) > Math.abs(v89 - TASAINEN),
    'pohjaton laskenta ei kärjistynyt — pohjaa ei ilmeisesti käytetä');
});

test('sauma ei jätä kartan halki varjotonta kaistaletta', () => {
  /*
   * Sarakkeet 0 ja leveys-1 ovat sama meridiaani kahdesti. Jos
   * naapuri haetaan tavallisella `(x - 1 + leveys) % leveys`
   * -kierrolla, sarakkeen 0 länsinaapuriksi tulee sarake itse ja
   * itä-länsi-rinne litistyy puoleen pitkin koko päivämääränrajaa.
   *
   * Maasto sin(2 * lon) toistuu 180 asteen välein, joten sauman
   * (lon -180) ja nollameridiaanin (lon 0) kohdalla sekä korkeus että
   * rinne ovat täsmälleen samat. Silloin myös varjon on oltava sama.
   *
   * Liioittelu on tässä kokeessa suuri, koska testiruudukon ruutu on
   * kokonainen aste eli 111 kilometriä: sen levyisellä ruudulla mikään
   * todellinen harjanne ei ole mitattavan jyrkkä.
   */
  const aalto = teeRuudukko((lat, lon) => 4000 * Math.sin(2 * lon * Math.PI / 180));
  const { varjo } = varjosta(aalto, { liioittelu: 60 });

  const sauma = varjo[kohta(0, -180)];
  const nolla = varjo[kohta(0, 0)];
  assert.ok(Math.abs(sauma - nolla) < 1e-6,
    `sauman varjo ${sauma} eroaa saman maaston varjosta ${nolla}`);
  assert.ok(Math.abs(sauma - TASAINEN) > 0.02, 'testimaasto oli liian loiva mitatakseen mitään');

  // Sauman molemmat sarakkeet ovat sama paikka, joten myös sama arvo.
  for (const lat of [-60, 0, 45]) {
    const y = Math.round((lat + 90) / RUUTU);
    assert.equal(varjo[y * LEVEYS], varjo[y * LEVEYS + LEVEYS - 1],
      `sauman kaksi saraketta eroavat leveysasteella ${lat}`);
  }
});

test('ruudukon suuntasopimus on sama molemmissa työkaluissa', () => {
  // Varjostus lukee suunnat suoraan indekseistä. Jos hakutyökalu
  // joskus kääntää rivijärjestyksensä, tämä kaatuu ennen kuin
  // kukaan ehtii katsoa väärin päin varjostettua karttaa.
  assert.equal(latRivista(0, RUUTU), -90, 'y = 0 ei ole enää etelänapa');
  assert.equal(latRivista(KORKEUS - 1, RUUTU), 90, 'ylin rivi ei ole enää pohjoisnapa');
  assert.equal(lonSarakkeesta(0, RUUTU), -180, 'x = 0 ei ole enää -180');
  assert.equal(lonSarakkeesta(LEVEYS - 1, RUUTU), 180, 'viimeinen sarake ei ole enää +180');
});

test('mitat tarkistetaan ennen laskentaa', () => {
  // Väärän kokoinen ruudukko antaisi hiljaa vinon maailman: rivit
  // liukuisivat sivuun yhden ruudun verran joka rivillä.
  assert.throws(() => varjosta({ z: new Float32Array(10), leveys: 5, korkeus: 3, ruutu: 1 }),
    /mitat/);
});
