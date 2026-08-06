/*
 * Vertailulinssin sopimus (js/linssit/vertailu.js).
 *
 * Linssimoottori tarkistaa sopimuksen vasta selaimessa (js/linssit/
 * kerros.js tarkistaLinssi) — rikkinäinen linssi putoaisi valikosta
 * hiljaa kesken pelin. Tämä testi tekee saman tarkistuksen Nodessa,
 * jotta rike näkyy jo ennen julkaisua. Lisäksi vahditaan rekisteririvi:
 * varuste ansaitaan kokemuspisteillä (manner: null), mikä on
 * varusteiden yleinen malli (docs/valtion-analyysi.md: suunnitelma ei
 * lukitse löytymistä erikseen).
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { LINSSI } from '../js/linssit/vertailu.js';
import { LINSSIT } from '../js/linssit/rekisteri.js';

test('vertailulinssi täyttää linssisopimuksen', () => {
  assert.equal(LINSSI.tunnus, 'vertailu');
  for (const kentta of ['nimi', 'lyhyt', 'ikoni']) {
    assert.ok(typeof LINSSI[kentta] === 'string' && LINSSI[kentta], `kenttä ${kentta} puuttuu`);
  }
  assert.ok(Array.isArray(LINSSI.laudat) && LINSSI.laudat.length, 'laudat puuttuu');
  assert.ok(LINSSI.lahde && typeof LINSSI.lahde === 'object', 'lähde puuttuu — periaate 2');
  // Kerrokseton linssi: piirra puuttuu tarkoituksella, kuten radiolla.
  assert.equal(LINSSI.kerros, false);
  assert.equal(LINSSI.piirra, undefined);
  // Kuvaus kertoo missä varuste toimii — kartalla se ei piirrä mitään.
  assert.match(LINSSI.lyhyt, /Maa numeroina/);
});

test('vertailulinssi on rekisterissä kokemuspistelinssinä', () => {
  const rivi = LINSSIT.find((r) => r.tunnus === 'vertailu');
  assert.ok(rivi, 'rekisteririvi puuttuu');
  assert.equal(rivi.manner, null, 'vertailulinssi ansaitaan kokemuspisteillä, ei laatasta');
});
