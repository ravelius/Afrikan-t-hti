/*
 * "Maa numeroina" -sivun sääntöpohjaiset tulkintalauseet
 * (js/maakayrat.js). Sama logiikka palvelee kaikkia maita ilman
 * käsityötä, joten säännöt testataan keksityillä ääritapauksilla JA
 * oikealla pilottiaineistolla: keksityt rivit todistavat kynnysarvot,
 * pilottimaat todistavat ettei yksikään sivu jää ilman lausetta.
 *
 * Moduulin ylätaso ei saa koskea document-olioon — muuten sitä ei voi
 * tuoda Nodeen eikä tätä testiä voi ajaa. Piirtofunktiot koskevat,
 * mutta vasta kutsuttaessa (sama jako kuin js/saa.js:ssä).
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  muotoileVaki, tulkitsePyramidi, tulkitseVakiluku, tulkitseBkt,
  tulkitseElinika, tulkitseKaupungistuminen, tulkitseCo2,
} from '../js/maakayrat.js';

const JUURI = new URL('..', import.meta.url).pathname;
const data = JSON.parse(readFileSync(join(JUURI, 'assets/data/maakayrat.json'), 'utf8'));

/** Pyramidi, jossa ikäluokkien osuudet annetaan suoraan. */
const pyramidi = (osuudet) => ({
  vuosi: 2023,
  miehet: osuudet.map((o) => Math.round(o * 500)),
  naiset: osuudet.map((o) => Math.round(o * 500)),
});

test('nuori maa saa nuoren lauseen, vanheneva vanhenevan', () => {
  // Kolmannes alle 15-vuotiaita: kolme ensimmäistä luokkaa yhteensä 33 %.
  const nuori = pyramidi([0.11, 0.11, 0.11, ...Array(18).fill(0.67 / 18)]);
  assert.match(tulkitsePyramidi(nuori), /Joka kolmas/);
  // Isovanhempia (65+) enemmän kuin lapsia.
  const vanheneva = pyramidi([0.04, 0.04, 0.04, ...Array(10).fill(0.6 / 10), ...Array(8).fill(0.28 / 8)]);
  assert.match(tulkitsePyramidi(vanheneva), /vanhenee/);
});

test('väkiluvun lause tuntee kasvun ja käänteen', () => {
  const kasvava = {
    alku: 1950,
    ennusteAlku: 2024,
    arvot: Array.from({ length: 101 }, (_, i) => 1_000_000 + i * 60_000),
  };
  assert.match(tulkitseVakiluku(kasvava), /nousua|nousee/);
  const kaantyva = {
    alku: 1950,
    ennusteAlku: 2024,
    arvot: Array.from({ length: 101 }, (_, i) => (i < 74 ? 1_000_000 + i * 10_000 : 1_740_000 - (i - 74) * 12_000)),
  };
  assert.match(tulkitseVakiluku(kaantyva), /vähemmän kuin nyt/);
});

test('bkt vertautuu Suomeen ja Suomi itseensä', () => {
  const sarja = (taso) => ({ alku: 1990, arvot: [taso] });
  assert.match(tulkitseBkt(sarja(50_000), sarja(52_000)), /Suomen tasoa/);
  assert.match(tulkitseBkt(sarja(25_000), sarja(52_000)), /puolet Suomen/);
  assert.match(tulkitseBkt(sarja(52_000), sarja(52_000), true), /vertailuviivan maa/);
});

test('kaupungistuminen tuntee ylitysvuoden', () => {
  const sarja = { alku: 1960, arvot: Array.from({ length: 60 }, (_, i) => 30 + i) };
  // 50 % ylittyy kun 30 + i >= 50 eli vuonna 1980.
  assert.match(tulkitseKaupungistuminen(sarja), /vuonna 1980/);
});

test('laskeneet päästöt saavat laskun lauseen', () => {
  const sarja = { alku: 1970, arvot: Array.from({ length: 55 }, (_, i) => (i < 20 ? 10 + i * 0.2 : 14 - (i - 20) * 0.25)) };
  assert.match(tulkitseCo2(sarja, sarja), /laskuun/);
});

test('väkiluku muotoutuu suomalaisittain', () => {
  // Luvun ja yksikön välissä on sitova välilyönti, ettei rivi katkea
  // niiden välistä — siksi odotuksissa on   eikä tavallinen väli.
  assert.equal(muotoileVaki(5_612_000), '5,6 milj.');
  assert.equal(muotoileVaki(59_435_141), '59 milj.');
  assert.equal(muotoileVaki(1_700_000_000), '1,7 mrd.');
  assert.equal(muotoileVaki(390_000), '390 000');
});

/*
 * Jokainen pilottimaa saa lauseen jokaisesta mittaristaan. Jos sääntö
 * jättää jonkin oikean maan väliin, käyrän alle jäisi tyhjä kohta —
 * ja se huomattaisiin vasta pelissä kyseisen maan kohdalla.
 */
test('pilottimaiden jokainen käyrä saa tulkintalauseen', () => {
  const suomi = data.maat.FIN;
  for (const [iso, maa] of Object.entries(data.maat)) {
    const lauseet = [
      maa.pyramidi && tulkitsePyramidi(maa.pyramidi),
      maa.vakiluku && tulkitseVakiluku(maa.vakiluku),
      maa.bkt && tulkitseBkt(maa.bkt, suomi.bkt, iso === 'FIN'),
      maa.elinika && tulkitseElinika(maa.elinika),
      maa.kaupungistuminen && tulkitseKaupungistuminen(maa.kaupungistuminen),
      maa.co2 && tulkitseCo2(maa.co2, suomi.co2),
    ];
    lauseet.forEach((lause, i) => {
      if (lause === undefined || lause === null) {
        assert.fail(`${iso}: mittari ${i} jäi ilman tulkintalausetta`);
      }
      assert.ok(typeof lause === 'string' && lause.length > 15 && lause.length < 160,
        `${iso}: outo lause "${lause}"`);
    });
  }
});

/*
 * Egyptin esimerkkilause on suunnitelmasta (docs/valtion-analyysi.md):
 * "Joka kolmas egyptiläinen on alle 15-vuotias — maa on nuori."
 * Aineiston mukaan osuus on 32 % — jos sääntö tai data muuttuu niin
 * ettei lause enää synny, sen pitää näkyä täällä eikä pelissä.
 */
test('Egypti on nuori ja Italia vanhenee — kuten suunnitelma lupaa', () => {
  assert.match(tulkitsePyramidi(data.maat.EGY.pyramidi), /Joka kolmas/);
  assert.match(tulkitsePyramidi(data.maat.ITA.pyramidi), /vanhenee/);
});
