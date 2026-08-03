// Palvelutyöntekijän SHELL-lista on käsin ylläpidetty. Jos moduuli
// unohtuu siitä, peli toimii verkossa mutta hajoaa offline — eikä sitä
// huomaa kehittäessä. Tämä testi vertaa listaa levyyn molempiin
// suuntiin.

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const JUURI = new URL('..', import.meta.url).pathname;
const sw = readFileSync(join(JUURI, 'sw.js'), 'utf8');
const SHELL = [...sw.matchAll(/'\.\/([^']+)'/g)].map((m) => m[1]);

test('kaikki SHELLin tiedostot ovat olemassa', () => {
  const puuttuu = SHELL.filter((p) => p !== '' && !existsSync(join(JUURI, p)));
  assert.deepEqual(puuttuu, [], 'SHELL viittaa tiedostoihin joita ei ole');
});

/*
 * Työhuoneen omat moduulit eivät kuulu pelin SHELLiin.
 *
 * Sama palvelutyöntekijä palvelee molempia sovelluksia (sama laajuus ei
 * voi kuulua kahdelle), mutta eri strategialla: työhuoneen tiedostot
 * haetaan verkosta ensin eikä niitä esiladata. Niiden lisääminen pelin
 * SHELL-listalle kasvattaisi pelin latauskokoa turhaan — peli ei tarvitse
 * työhuonetta lentokoneessa.
 */
const VAIN_TYOHUONE = /^js\/tyohuone-/;

test('kaikki js-moduulit ovat SHELLissä', () => {
  const levy = [
    ...readdirSync(join(JUURI, 'js')).filter((f) => f.endsWith('.js')).map((f) => `js/${f}`),
    ...readdirSync(join(JUURI, 'js/packs')).filter((f) => f.endsWith('.js')).map((f) => `js/packs/${f}`),
  ];
  const unohtui = levy.filter((p) => !SHELL.includes(p) && !VAIN_TYOHUONE.test(p));
  assert.deepEqual(unohtui, [],
    'nämä moduulit puuttuvat sw.js:n SHELL-listalta — offline hajoaisi');
});

test('välimuistin nimi seuraa sovelluksen versiota', () => {
  const versio = readFileSync(join(JUURI, 'js/main.js'), 'utf8')
    .match(/const APP_VERSION = '([^']+)'/)?.[1];
  assert.ok(versio, 'APP_VERSION ei löytynyt');
  const cache = sw.match(/const CACHE = '([^']+)'/)?.[1];
  assert.equal(cache, `matkakirja-${versio}`,
    'sw.js:n CACHE ja js/main.js:n APP_VERSION ovat eri versiossa — '
    + 'vanha välimuisti jäisi voimaan');
});
