// Päivän kuvan kuvateksti tulee Commonsista wikitekstinä, ja
// riisuWikiteksti (js/uutiset.js) muuttaa sen pelkäksi tekstiksi.
// Rikkinäinen riisunta näkyisi pelaajalle hakasulkeina ja mallineina
// keskellä kuvatekstiä — siksi muodot vahditaan tässä.

import test from 'node:test';
import assert from 'node:assert/strict';

import { riisuWikiteksti } from '../js/uutiset.js';

test('linkit, mallineet ja korostukset riisutaan', () => {
  assert.equal(
    riisuWikiteksti("Poster for ''[[:en:Three Friends (1913 film)|Three Friends]]'', "
      + 'a [[Biograph Studios]] release. Today is {{w|International Beer Day}}.'),
    'Poster for Three Friends, a Biograph Studios release. Today is International Beer Day.',
  );
});

test('tuntematon malline katoaa ja välit siistiytyvät', () => {
  assert.equal(riisuWikiteksti('Kuva {{Potd description|x}}  vuoristosta.'), 'Kuva vuoristosta.');
  assert.equal(riisuWikiteksti('<span lang="en">Vuori</span> aamulla'), 'Vuori aamulla');
});
