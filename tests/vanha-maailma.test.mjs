// Vanhan maailman yhdistämisen tarkistukset.
//
// Työkalu kääntää nykyisten lautojen x/y takaisin oikeiksi sijainneiksi.
// Kaavat ovat kunkin pakettitiedoston alkukommentissa, ja jos paketin
// kaavaa joskus muutetaan, käänteinen on muutettava mukana. Muuten
// kaupungit valuisivat hiljaa väärille paikoille yhdistetyllä kartalla —
// eikä sitä huomaisi kuin katsomalla karttaa tarkkaan.

import test from 'node:test';
import assert from 'node:assert/strict';

import { miller, KAANTEISET, sovita, rannikot } from '../tools/vanha-maailma.mjs';
import { PACKS } from '../js/pack.js';

/** Karkea etäisyys kilometreinä. */
function km(lon1, lat1, lon2, lat2) {
  const keski = ((lat1 + lat2) / 2) * (Math.PI / 180);
  return Math.hypot((lon1 - lon2) * 111 * Math.cos(keski), (lat1 - lat2) * 111);
}

test('Miller-projektio kääntyy takaisin itsekseen', () => {
  for (const [lon, lat] of [[0, 0], [24.9, 60.2], [-9.1, 38.7], [139.7, 35.7], [18.4, -33.9]]) {
    const [x, y] = miller.eteen(lon, lat);
    const [lon2, lat2] = miller.taakse(x, y);
    assert.ok(Math.abs(lon - lon2) < 1e-9, `pituusaste ${lon} → ${lon2}`);
    assert.ok(Math.abs(lat - lat2) < 1e-9, `leveysaste ${lat} → ${lat2}`);
  }
});

test('Miller pitää pohjoisen kurissa toisin kuin Mercator', () => {
  // Juuri tämän takia Miller valittiin: Mercatorilla 70° venyy niin, että
  // Lappi ja Tromssa paisuisivat mahdottomiksi.
  const [, ekvaattori] = miller.eteen(0, 0);
  const [, pohjoinen] = miller.eteen(0, 70);
  const [, mercator70] = [0, -Math.log(Math.tan(Math.PI / 4 + 70 * (Math.PI / 180) / 2))];
  assert.ok(Math.abs(pohjoinen - ekvaattori) < Math.abs(mercator70),
    'Millerin pitäisi litistää pohjoista vähemmän kuin Mercatorin');
});

test('käänteiskaavat vievät kaupungit oikeille paikoilleen', () => {
  // Todelliset sijainnit (Wikipedia).
  //
  // Raja on lautakohtainen, koska osa kaupungeista on TARKOITUKSELLA
  // siirretty paikaltaan. Afrikan rannikko on pelkistetty (93 pistettä
  // koko mantereelle), ja kaupunkeja on siirretty osumaan siihen —
  // Kapkaupunki on 120 km ja Nairobi yli 400 km sivussa. Euroopassa ja
  // Lähi-idässä rannikko on tarkka, joten siellä siirrot ovat pieniä.
  //
  // Testi ei vartioi kaupunkien paikkoja vaan KAAVAA: rikkoutunut kaava
  // heittäisi tuhansia kilometrejä, ei satoja.
  const oikea = {
    europe: {
      raja: 100,
      lontoo: [-0.13, 51.51], rooma: [12.50, 41.90], ateena: [23.73, 37.98],
      moskova: [37.62, 55.75], lissabon: [-9.14, 38.72],
    },
    africa: {
      raja: 500,
      kairo: [31.24, 30.04], tanger: [-5.80, 35.77], kapkaupunki: [18.42, -33.93],
    },
    middleeast: {
      raja: 100,
      bagdad: [44.36, 33.31], mekka: [39.83, 21.42], jerusalem: [35.21, 31.78],
    },
  };
  for (const [lauta, { raja, ...kaupungit }] of Object.entries(oikea)) {
    const pack = PACKS.find((p) => p.id === lauta);
    for (const [id, [olon, olat]] of Object.entries(kaupungit)) {
      const c = pack.cities.find((x) => x.id === id);
      assert.ok(c, `${lauta}: kaupunkia ${id} ei löydy`);
      const [lon, lat] = KAANTEISET[lauta](c.x, c.y);
      const virhe = km(lon, lat, olon, olat);
      assert.ok(virhe < raja, `${lauta}/${id}: ${virhe.toFixed(0)} km sivussa (raja ${raja})`);
    }
  }
});

test('sovitus mahtuu laudalle eikä väännä mittasuhteita', () => {
  const ryhmat = [[[0, 0], [1, 0.5]], [[0.25, 0.25]]];
  const { muunna, korkeus, skaala } = sovita(ryhmat, { leveys: 1000, marginaali: 10 });
  const [x0, y0] = muunna([0, 0]);
  const [x1] = muunna([1, 0]);
  assert.equal(x0, 10, 'vasen reuna marginaalille');
  assert.equal(x1, 990, 'oikea reuna marginaalille');
  assert.ok(y0 >= 10, 'ylin piste marginaalin sisään');
  // Sama mittakaava molempiin suuntiin: puolet leveydestä = puolet korkeutta.
  const [, yPuoli] = muunna([0, 0.5]);
  assert.ok(Math.abs((yPuoli - y0) - 0.5 * skaala) < 0.2, 'pystymittakaava eroaa vaakamittakaavasta');
  assert.ok(korkeus > 0);
});

test('rannikkojen karsinta säilyttää muodon mutta pudottaa pisteitä', () => {
  // Suorakaide, jonka sivuilla on turhia välipisteitä: karsinnan pitää
  // pudottaa ne mutta säilyttää nurkat.
  const rengas = [];
  for (let i = 0; i <= 20; i++) rengas.push([i / 20 * 10, 0]);
  for (let i = 1; i <= 20; i++) rengas.push([10, i / 20 * 10]);
  for (let i = 1; i <= 20; i++) rengas.push([10 - i / 20 * 10, 10]);
  for (let i = 1; i <= 20; i++) rengas.push([0, 10 - i / 20 * 10]);
  const geo = { features: [{ geometry: { type: 'Polygon', coordinates: [rengas] } }] };
  // Alue kattaa muodon; toleranssi on projisoiduissa yksiköissä.
  // minPisteet alas, koska karsittu suorakaide on vain nurkkansa — oletus
  // (12) on saariin tarkoitettu roskasuodatin ja pudottaisi tämän.
  const ulos = rannikot(
    geo, { lon0: -1, lon1: 11, lat0: -1, lat1: 11 }, { toleranssi: 0.001, minPisteet: 4 },
  );
  assert.equal(ulos.length, 1);
  assert.ok(ulos[0].length < rengas.length, 'karsinta ei pudottanut yhtään pistettä');
  assert.ok(ulos[0].length >= 4, 'nurkat katosivat karsinnassa');
});

test('yhdistetty kartta löytää päällekkäiset porttikaupungit', async () => {
  const { kaupungit } = await import('../tools/vanha-maailma.mjs');
  const { kaupungit: lista, paallekkaiset } = await kaupungit();
  // Neljän laudan kaupungit yhtenä listana, ilman kaksoiskappaleita.
  const idt = lista.map((c) => c.id);
  assert.equal(new Set(idt).size, idt.length, 'sama kaupunki kahdesti listassa');
  // Istanbul, Kairo ja Teheran ovat kahdella laudalla — yhdistetyllä
  // kartalla niitä on yksi. Jos tämä luku muuttuu, joku on lisännyt tai
  // poistanut porttikaupungin ja sisältö pitää käydä läpi.
  const paallekkaisetIdt = paallekkaiset.map(([id]) => id).sort();
  assert.deepEqual(paallekkaisetIdt, ['istanbul', 'kairo', 'teheran']);
  assert.ok(lista.length > 130, `kaupunkeja pitäisi olla yli 130, nyt ${lista.length}`);
});
