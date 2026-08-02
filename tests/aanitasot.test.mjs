// Taustaäänten tasaus.
//
// Omistajan havainto 2.8.2026: "Toiset tausta-äänet ovat aika hiljaisia
// ja toiset taas häiritsevät liikaa puhetta." Kertoimet oli asetettu
// korvakuulolta yksi kerrallaan, eikä korva muista edellistä äänitettä.
// Nyt ne mitataan (tools/mittaa-aanet.mjs) ja kirjoitetaan koneellisesti.
//
// Nämä testit vartioivat kahta asiaa: ettei mitattua tasausta vahingossa
// pyyhitä pois, ja ettei kerroin lupaa enempää kuin soitinketju pystyy
// toteuttamaan.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { keraaOsoitteet, voimaTasolle, pyorista } from '../tools/mittaa-aanet.mjs';
import { jaaAlku } from '../js/aani-ehdokkaat.js';

const LAHDE = readFileSync(new URL('../js/aani-ehdokkaat.js', import.meta.url), 'utf8');
const VIRTA = readFileSync(new URL('../js/ambience-stream.js', import.meta.url), 'utf8');

test('kerroin ei ylitä sitä mitä soitinketju pystyy toistamaan', () => {
  // Taustaääni soi tasolla VOIMA * voima, ja HTML-soittimen volume ei voi
  // ylittää ykköstä. Sitä suurempi kerroin vain leikkautuisi pois, jolloin
  // tasaus valehtelisi: kaksi eri kerrointa soisi samalla tasolla.
  const perus = Number(VIRTA.match(/const VOIMA = ([\d.]+)/)[1]);
  assert.ok(perus > 0 && perus < 1, `odottamaton perustaso ${perus}`);
  const katto = 1 / perus;
  for (const { url, voima } of keraaOsoitteet(LAHDE)) {
    assert.ok(voima <= katto,
      `${url.split('/').pop()}: kerroin ${voima} leikkautuisi (katto ${katto.toFixed(2)})`);
  }
});

test('taustaäänille on mitattu kerroin eikä oletusta', () => {
  const osoitteet = keraaOsoitteet(LAHDE);
  assert.ok(osoitteet.length > 100, `äänitteitä pitäisi olla yli 100, nyt ${osoitteet.length}`);
  // Mittaus antaa jokaiselle oman kertoimensa. Jos suuri osa on tasan 1,
  // tasaus on pyyhitty pois tai jäänyt ajamatta uusille äänitteille.
  const oletuksella = osoitteet.filter((o) => !o.asetettu).length;
  assert.ok(oletuksella < osoitteet.length * 0.1,
    `${oletuksella}/${osoitteet.length} äänitteellä ei ole mitattua kerrointa — aja tools/mittaa-aanet.mjs`);
});

test('kertoimet jakautuvat molempiin suuntiin', () => {
  // Tasaus sekä vaimentaa että vahvistaa. Jos kaikki ovat samalla
  // puolella ykköstä, tavoitetaso on valittu väärin — silloin koko
  // taustakerros olisi liian kova tai liian hiljainen.
  const voimat = keraaOsoitteet(LAHDE).map((o) => o.voima);
  assert.ok(voimat.some((v) => v < 0.9), 'yksikään äänite ei vaimene');
  assert.ok(voimat.some((v) => v > 1.1), 'yksikään äänite ei vahvistu');
});

test('jaaAlku lukee mitatun kertoimen oikein', () => {
  // Työkalu kirjoittaa säädöt tässä muodossa; peli lukee ne jaaAlkulla.
  // Jos muodot eriytyvät, kertoimet jäisivät hiljaa huomiotta.
  assert.deepEqual(jaaAlku('https://x/y.mp3#voima=0.42'),
    { url: 'https://x/y.mp3', alku: 0, voima: 0.42 });
  assert.deepEqual(jaaAlku('https://x/y.mp3#alku=20&voima=2.5'),
    { url: 'https://x/y.mp3', alku: 20, voima: 2.5 });
  // Aloituskohta ei saa kadota tasauksessa: se on omistajan valitsema
  // kohta äänitteestä eikä liity voimakkuuteen.
  const alkuKanssa = [...LAHDE.matchAll(/#alku=(\d+)&voima=/g)];
  assert.ok(alkuKanssa.length > 0, 'alku-säädöt katosivat tasauksessa');
});

test('voimaTasolle laskee oikean suunnan', () => {
  // Tavoitetta hiljaisempi äänite vahvistuu, kovempi vaimenee.
  assert.ok(voimaTasolle(-40, -30) > 1);
  assert.ok(voimaTasolle(-20, -30) < 1);
  assert.equal(voimaTasolle(-30, -30), 1);
  // 6 dB on kaksinkertainen amplitudi.
  assert.ok(Math.abs(voimaTasolle(-36, -30) - 2) < 0.01);
  // Rajat pitävät.
  assert.equal(pyorista(99), 6);
  assert.equal(pyorista(0.001), 0.15);
});
