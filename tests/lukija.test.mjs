// Ääneen lukijan puhtaat osat (js/lukija.js): lausepaloittelu ja
// suomiäänen valinta. Itse puhesyntesi on selaimen rajapinta eikä
// testattavissa Nodessa — mutta paloittelun ja äänivalinnan virheet
// kuuluisivat suoraan pelaajalle, joten ne vahditaan tässä.

import test from 'node:test';
import assert from 'node:assert/strict';

import { jaaPaloiksi, parasSuomiAani } from '../js/lukija.js';

test('paloittelu katkaisee vain lauseen rajalta', () => {
  const teksti = 'Ensimmäinen lause. Toinen lause! Kolmas lause? Neljäs lause.';
  const palat = jaaPaloiksi(teksti, 30);
  // Jokainen pala päättyy lauseeseen, ei sanan keskelle.
  for (const pala of palat) assert.match(pala, /[.!?…]$/);
  // Yhdistettynä palat ovat koko teksti.
  assert.equal(palat.join(' ').replace(/\s+/g, ' '), teksti);
});

test('lyhyt teksti on yksi pala, pitkä jakautuu', () => {
  assert.equal(jaaPaloiksi('Lyhyt lause.').length, 1);
  const pitka = Array.from({ length: 12 }, (_, i) => `Tässä on lause numero ${i + 1}.`).join(' ');
  assert.ok(jaaPaloiksi(pitka, 100).length > 1);
});

test('ylipitkä lause luetaan silti kokonaisena', () => {
  const lause = `${'sana '.repeat(100).trim()}.`;
  const palat = jaaPaloiksi(lause, 50);
  assert.equal(palat.join(''), lause);
});

test('äänivalinta poimii vain suomen ja suosii laatuääntä', () => {
  const aanet = [
    { name: 'Alice', lang: 'it-IT' },
    { name: 'Satu', lang: 'fi-FI', voiceURI: 'com.apple.ttsbundle.Satu-compact' },
    { name: 'Satu (laajennettu)', lang: 'fi-FI', voiceURI: 'com.apple.ttsbundle.Satu-premium' },
    { name: 'Google suomi', lang: 'fi-FI' },
  ];
  assert.equal(parasSuomiAani(aanet).name, 'Satu (laajennettu)');
  // Ilman laatuääntä verkkoääni voittaa suppean.
  assert.equal(parasSuomiAani(aanet.slice(0, 2).concat(aanet[3])).name, 'Google suomi');
  // Pelkkä suppea kelpaa, kun muuta ei ole.
  assert.equal(parasSuomiAani(aanet.slice(0, 2)).name, 'Satu');
  // Ilman suomea ei arvata muunkielistä.
  assert.equal(parasSuomiAani([{ name: 'Alice', lang: 'it-IT' }]), null);
});
