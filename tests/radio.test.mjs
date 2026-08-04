// Maailmanradion kaksi sääntöä, jotka voi tarkistaa ilman selainta.
//
// Radiotila itsessään on ääntä ja DOM:ia, eikä sitä Nodessa aja mikään.
// Nämä kaksi asiaa ovat silti puhdasta laskentaa, ja molemmat ovat
// sellaisia, jotka rikkoutuisivat hiljaa: kaupunkivalinta muuttuisi
// aineiston mukana kenenkään huomaamatta, ja ajoituksen vakiot voisi
// säätää yksi kerrallaan niin, että yksi vaihe katoaa kokonaan.

import test from 'node:test';
import assert from 'node:assert/strict';

import { radionKaupungit, kanavakaupungit, VIRITYKSEN_AJAT, VIRITYKSEN_VAIHEET } from '../js/linssit/radio.js';
import { PACKS } from '../js/pack.js';

/** Laudat, joilla radiolinssi on käytössä (radio.js LINSSI.laudat). */
const RADIOLAUDAT = ['maailmankartta', 'europe', 'africa'];

function lauta(tunnus) {
  const pakkaus = PACKS.find((p) => p.id === tunnus);
  assert.ok(pakkaus, `lautaa ${tunnus} ei löytynyt`);
  return pakkaus;
}

test('radiotilassa näkyy tasan yksi kaupunki jokaisesta maasta', () => {
  for (const tunnus of RADIOLAUDAT) {
    const pakkaus = lauta(tunnus);
    const nakyvat = radionKaupungit(pakkaus.map, pakkaus.cities);

    const maat = new Map();
    for (const id of nakyvat) {
      const iso = pakkaus.map.cityCountry?.[id];
      // Maaton kaupunki edustaa itseään, ks. radionKaupungit.
      if (!iso) continue;
      maat.set(iso, (maat.get(iso) ?? 0) + 1);
    }
    for (const [iso, monta] of maat) {
      assert.equal(monta, 1, `${tunnus}: maalla ${iso} on ${monta} kaupunkia radiotilassa`);
    }

    // Yhtään maata ei saa myöskään kadota: jokainen laudalla oleva maa
    // on yhä napautettavissa, vaikka sen kaupungeista näkyy vain yksi.
    const kaikkiMaat = new Set(
      pakkaus.cities.map((k) => pakkaus.map.cityCountry?.[k.id]).filter(Boolean),
    );
    assert.equal(maat.size, kaikkiMaat.size, `${tunnus}: maita katosi kartalta`);
  }
});

test('jokainen kanava on yhä valittavissa — karsinta ei vie yhtään asemaa', () => {
  for (const tunnus of RADIOLAUDAT) {
    const pakkaus = lauta(tunnus);
    const nakyvat = radionKaupungit(pakkaus.map, pakkaus.cities);
    const kanavalliset = kanavakaupungit(pakkaus.map, pakkaus.cities);

    // Kanavan tunnistaa maasta, joten "kaikki kanavat" on niiden maiden
    // joukko, joilla kanava on. Yhdenkään ei saa jäädä ilman nappia.
    const ennen = new Set([...kanavalliset].map((id) => pakkaus.map.cityCountry[id]));
    const jalkeen = new Set(
      [...nakyvat].filter((id) => kanavalliset.has(id)).map((id) => pakkaus.map.cityCountry[id]),
    );
    assert.equal(jalkeen.size, ennen.size, `${tunnus}: kanavia katosi`);
  }
});

test('pelaajan oma sijainti näkyy aina, vaikka maa valitsisi toisen kaupungin', () => {
  const pakkaus = lauta('maailmankartta');
  const oletus = radionKaupungit(pakkaus.map, pakkaus.cities);

  // Etsitään kaupunki, joka EI ole maansa oletusvalinta — juuri se on
  // se tapaus, jossa pelaaja katoaisi kartalta.
  const piilossa = pakkaus.cities.find((k) => !oletus.has(k.id) && pakkaus.map.cityCountry?.[k.id]);
  assert.ok(piilossa, 'karsinta ei piilottanut yhtään kaupunkia — testi ei mittaa mitään');

  const sijainnilla = radionKaupungit(pakkaus.map, pakkaus.cities, { sijainti: piilossa.id });
  assert.ok(sijainnilla.has(piilossa.id), `pelaajan sijainti ${piilossa.id} katosi kartalta`);
  // Sijainti korvaa maansa edustajan eikä tule sen rinnalle: joukon koko
  // ei muutu.
  assert.equal(sijainnilla.size, oletus.size, 'sijainti lisäsi kaupungin sen sijaan että korvasi');
});

test('valinta on vakaa: sama lauta antaa aina saman kaupungin', () => {
  const pakkaus = lauta('maailmankartta');
  const eka = [...radionKaupungit(pakkaus.map, pakkaus.cities)].sort();
  const toka = [...radionKaupungit(pakkaus.map, [...pakkaus.cities])].sort();
  assert.deepEqual(toka, eka);
});

test('virityksessä on tilaa kaikille kolmelle vaiheelle', () => {
  const { vahimmaisaika, siirtyma, lukittuminen } = VIRITYKSEN_AJAT;

  // Omistajan antama haarukka 4.8.2026: "ehdotus 2,5–3 s".
  assert.ok(vahimmaisaika >= 2500 && vahimmaisaika <= 3000, `vähimmäisaika ${vahimmaisaika} ms`);

  /*
   * Haku on se vaihe, joka jää väliin, jos siirtymä ja lukittuminen
   * täyttävät vähimmäisajan. Silloin nopea asema näyttäisi liu'un ja
   * napsahduksen, eikä kolmesta vaiheesta olisi jäljellä kuin kaksi.
   * Sekunti on se raja, jonka alle pientä liikettä ei ehdi huomata.
   */
  const haku = vahimmaisaika - siirtyma - lukittuminen;
  assert.ok(haku >= 1000, `haulle jää vain ${haku} ms`);
  assert.deepEqual(VIRITYKSEN_VAIHEET, ['siirtyma', 'haku', 'lukittuu']);
});
