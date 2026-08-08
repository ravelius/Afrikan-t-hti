/*
 * Apple Music -linkit vievät kappaleeseen, eivät artistiin (v349).
 *
 * Omistaja 7.8.2026: *"Apple linkki ei vie suoraan kappaleeseen, onko
 * mahdollista korjata?"* Oli: linkit osoittivat artistisivulle
 * (`/artist/...`), hakutulokseen (`/search?term=...`) tai albumiin
 * ilman kappaleankkuria. Kaikki kolme avaavat jotain muuta kuin sen
 * kappaleen, jota nosto käsittelee.
 *
 * Applen kanoninen kappaleosoite on albumiosoite, jonka perässä on
 * `?i=<kappaletunnus>` — juuri sen iTunesin hakurajapinta palauttaa
 * kentässä trackViewUrl. Ilman `?i=`-osaa selain avaa albumin
 * ensimmäisen raidan.
 *
 * Sääntö koskee VAIN nostoja, joilla on `esikuuntelu`: ne lupaavat
 * yhden nimetyn kappaleen, ja linkin on vietävä siihen. Pelkkä
 * `musiikki`-linkki ilman esikuuntelua saa yhä osoittaa artistiin —
 * silloin nosto kertoo esittäjästä eikä yksittäisestä kappaleesta.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const PAKKA = new URL('../js/packs/', import.meta.url);

/** Kaikki (musiikki, esikuuntelu) -parit koko aineistosta. */
function esikuunteluParit() {
  const parit = [];
  for (const nimi of readdirSync(PAKKA)) {
    if (!nimi.endsWith('.js')) continue;
    const teksti = readFileSync(new URL(nimi, PAKKA), 'utf8');
    const kuvio = /musiikki: '([^']+)'(.{0,400}?)esikuuntelu: '([^']+)'/gs;
    for (const osuma of teksti.matchAll(kuvio)) {
      parit.push({ tiedosto: nimi, url: osuma[1], termi: osuma[3] });
    }
  }
  return parit;
}

test('esikuuntelunostojen linkki vie kappaleeseen', () => {
  const parit = esikuunteluParit();
  // Jos kuvio lakkaa osumasta, testi menisi läpi tyhjänä eikä vahtisi
  // mitään — siksi määrä tarkistetaan erikseen.
  assert.ok(parit.length >= 10,
    `vain ${parit.length} esikuuntelunostoa löytyi — hakukuvio on todennäköisesti rikki`);
  for (const { tiedosto, url, termi } of parit) {
    assert.match(url, /^https:\/\/music\.apple\.com\//,
      `${tiedosto} / ${termi}: linkki ei ole Apple Music -osoite`);
    assert.doesNotMatch(url, /\/artist\//,
      `${tiedosto} / ${termi}: linkki vie artistisivulle eikä kappaleeseen`);
    assert.doesNotMatch(url, /\/search\?/,
      `${tiedosto} / ${termi}: linkki vie hakutulokseen eikä kappaleeseen`);
    assert.match(url, /[?&]i=\d+/,
      `${tiedosto} / ${termi}: linkistä puuttuu kappaleankkuri ?i= — avaisi albumin`);
  }
});

test('esikuuntelunostolla on aina myös linkki', () => {
  /*
   * Applen ehto: 30 sekunnin esikuuntelua saa soittaa vain, jos
   * vieressä on linkki kauppaan. Ehto oli jo ennestään voimassa, mutta
   * sitä ei vahtinut mikään — ja juuri linkkejä nyt muokattiin.
   */
  for (const nimi of readdirSync(PAKKA)) {
    if (!nimi.endsWith('.js')) continue;
    const teksti = readFileSync(new URL(nimi, PAKKA), 'utf8');
    // Nostot erotetaan otsikko-kentän kohdalta; riittävän tarkka,
    // koska kentät ovat aina saman nostonoliogin sisällä.
    for (const lohko of teksti.split(/\n {8}\{\n/)) {
      if (!lohko.includes('esikuuntelu:')) continue;
      assert.match(lohko, /musiikki: '/,
        `${nimi}: esikuuntelunostolta puuttuu musiikki-linkki (Applen ehto)`);
    }
  }
});
