/*
 * Kaupunki- ja maalehtien rakenne.
 *
 * Lehdet kirjoitetaan käsin ja agenttien avulla, kymmenen kaupunkia
 * kerrallaan, joten yksittäisen sivun unohtunut kenttä ei näy diffiä
 * lukemalla. Nämä testit ovat se kohta, jossa unohdus näkyy.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { KULTTUURI_KATEGORIAT } from '../js/packs/kulttuuri-kategoriat.js';

/** Minitehtävän ja kulttuurivisan yhteiset muotovaatimukset. */
function tarkistaTehtava(t, missa) {
  assert.equal(t.vaihtoehdot?.length, 4, `${missa}: vaihtoehtoja pitää olla neljä`);
  assert.equal(new Set(t.vaihtoehdot).size, 4, `${missa}: vaihtoehdot toistavat toisiaan`);
  assert.ok(Number.isInteger(t.oikea) && t.oikea >= 0 && t.oikea <= 3,
    `${missa}: oikea on indeksi 0–3, ei ${t.oikea}`);
  assert.ok(t.kysymys?.length > 0, `${missa}: kysymys puuttuu`);
  assert.ok(t.fakta?.length > 0, `${missa}: fakta puuttuu`);
  // Palkkion suuruus tulee mekanismista ja on jo ehtinyt muuttua kahdesti
  // saman päivän aikana. Tekstiin kirjoitettuna luku vanhenisi.
  for (const teksti of [t.kysymys, t.fakta, ...t.vaihtoehdot]) {
    assert.doesNotMatch(teksti, /\b(punta|puntaa|pistettä|palkkio)/i,
      `${missa}: teksti ei saa mainita palkkiota — peli lisää sen itse`);
  }
}

test('kaupunkilehden jokaisella aihesivulla on minitehtävä', () => {
  for (const [kaupunki, sivut] of Object.entries(KULTTUURI_KATEGORIAT)) {
    for (const sivu of sivut) {
      if (sivu.id === 'kaupunki') continue;
      assert.ok(sivu.tehtava, `${kaupunki}/${sivu.id}: aihesivulta puuttuu minitehtävä`);
      tarkistaTehtava(sivu.tehtava, `${kaupunki}/${sivu.id}`);
    }
  }
});

test('kannella ei ole minitehtävää — siellä on jo kulttuurivisa', () => {
  for (const [kaupunki, sivut] of Object.entries(KULTTUURI_KATEGORIAT)) {
    const kansi = sivut.find((s) => s.id === 'kaupunki');
    assert.ok(kansi, `${kaupunki}: lehdeltä puuttuu kansi`);
    assert.equal(kansi.tehtava, undefined,
      `${kaupunki}: kannelle ei tule minitehtävää, siellä on kulttuurivisa`);
  }
});

test('sama nosto ei ole sekä lehdessä että vanhoissa litteissä nostoissa', async () => {
  const { EUROPE_KULTTUURI } = await import('../js/packs/europe-kulttuuri.js');
  for (const [kaupunki, sivut] of Object.entries(KULTTUURI_KATEGORIAT)) {
    const vanhat = EUROPE_KULTTUURI[kaupunki]?.nostot ?? [];
    // Kun kaupunki saa lehden, sen litteät nostot siirretään lehteen ja
    // poistetaan täältä. Jos poisto unohtuu, sama juttu näkyy pelissä
    // kahdesti — eikä se näy mistään muualta kuin pelaamalla.
    assert.equal(vanhat.length, 0,
      `${kaupunki}: lehti on olemassa, joten europe-kulttuuri.js:n `
      + `${vanhat.length} nostoa näkyisivät kahdesti`);
  }
});
