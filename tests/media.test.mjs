// Peilin polkusääntö on kahdessa paikassa: pelissä (js/media.js) ja
// peilaustyökalussa (tools/peilaa-media.mjs). Jos ne eriytyvät, peli
// hakee kuvia osoitteista joita ei ole — eikä sitä huomaa ennen kuin
// pelaaja avaa kortin. Nämä testit lukevat molemmat säännöt ja
// vertaavat niitä toisiinsa sekä peilin manifestiin, jos se on
// koneella.

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  PEILI_JUURI, peiliKuvaPolku, peiliAaniPolku, aaniOsoite, onPeilista,
  asetaKuva, peiliPetti, peiliKaytossa, nollaaPeili, peilinLaji, AANI_JUURI,
} from '../js/media.js';
import { valokuvaUrl } from '../js/packs/africa-valokuvat.js';

test('peilin juuri on https ja päättyy kauttaviivaan', () => {
  assert.match(PEILI_JUURI, /^https:\/\//);
  assert.ok(PEILI_JUURI.endsWith('/'), 'juuren perään liitetään polku sellaisenaan');
});

test('kuvan polku noudattaa peilaustyökalun nimeämistä', () => {
  assert.equal(
    peiliKuvaPolku('Souvlaki in Athens.JPG', 'kuvat'),
    'kuvat/souvlaki-in-athens.jpg',
  );
  // Aksentit puretaan, heittomerkit ja välilyönnit muuttuvat viivoiksi.
  assert.equal(
    peiliKuvaPolku("Château d'If @ Baie de Marseille 01.jpg", 'kuvat'),
    'kuvat/chateau-d-if-baie-de-marseille-01.jpg',
  );
  // Liput haetaan Commonsista valmiiksi renderöityinä, siis PNG:nä.
  assert.equal(
    peiliKuvaPolku('Flag of Greece.svg', 'liput'),
    'liput/flag-of-greece.png',
  );
});

test('äänen polku tunnistaa Freesoundin ja archive.orgin', () => {
  assert.equal(
    peiliAaniPolku('https://cdn.freesound.org/previews/511/511005_571436-lq.mp3'),
    'aanet/freesound-511005.mp3',
  );
  assert.equal(
    peiliAaniPolku('https://archive.org/download/aporee_21876_25420/marrakesh.mp3'),
    'aanet/aporee-aporee_21876_25420.mp3',
  );
});

test('aaniOsoite koskee vain peilattuja lähteitä', () => {
  nollaaPeili();
  const freesound = 'https://cdn.freesound.org/previews/511/511005_571436-lq.mp3';
  // Äänet tulevat omasta ämpäristään, eivät kuvien kanssa samasta
  // Pages-sivustosta.
  assert.ok(aaniOsoite(freesound).startsWith(AANI_JUURI));
  assert.ok(onPeilista(aaniOsoite(freesound)));
  // Repon omat tiedostot eivät kulje peilin kautta.
  assert.equal(aaniOsoite('assets/audio/efekti-klik.mp3'), 'assets/audio/efekti-klik.mp3');
  assert.equal(onPeilista('assets/audio/efekti-klik.mp3'), false);
});

test('katkaisija sammuttaa peilin kolmen virheen jälkeen', () => {
  nollaaPeili();
  assert.equal(peiliKaytossa('aanet'), true);
  peiliPetti('aanet');
  peiliPetti('aanet');
  assert.equal(peiliKaytossa('aanet'), true, 'kaksi virhettä voi olla sattumaa');
  peiliPetti('aanet');
  assert.equal(peiliKaytossa('aanet'), false, 'kolmas virhe sammuttaa peilin istunnoksi');
  // Sammutettuna osoitteet menevät suoraan alkuperäiseen lähteeseen.
  assert.equal(
    aaniOsoite('https://cdn.freesound.org/previews/511/511005_571436-lq.mp3'),
    'https://cdn.freesound.org/previews/511/511005_571436-lq.mp3',
  );
  nollaaPeili();
});

test('äänipeilin kaatuminen ei vie kuvapeiliä mukanaan', () => {
  // Kuvat ja äänet ovat eri palvelimilla, eikä toisen kaatuminen kerro
  // toisesta mitään. Yhteinen laskuri sammutti kuvapeilin kolmen
  // ääniongelman jälkeen — ja sama olisi toistunut heti, jos osa äänistä
  // päätetään jättää peilaamatta.
  nollaaPeili();
  for (let i = 0; i < 5; i += 1) peiliPetti('aanet');
  assert.equal(peiliKaytossa('aanet'), false, 'äänipeilin piti sammua');
  assert.equal(peiliKaytossa('kuvat'), true, 'kuvapeili sammui äänivirheistä');
  assert.ok(
    valokuvaUrl('Souvlaki in Athens.JPG', 640).startsWith(PEILI_JUURI),
    'kuvat eivät enää tulleet peilistä',
  );
  nollaaPeili();
  for (let i = 0; i < 5; i += 1) peiliPetti('kuvat');
  assert.equal(peiliKaytossa('kuvat'), false, 'kuvapeilin piti sammua');
  assert.equal(peiliKaytossa('aanet'), true, 'äänipeili sammui kuvavirheistä');
  nollaaPeili();
});

test('peilin laji tunnistetaan osoitteesta', () => {
  // Katkaisija tarvitsee tiedon siitä, kumman palvelimen virheestä on
  // kyse. Ilman tätä varareitille siirtyvä ääni merkittäisiin
  // kuvavirheeksi.
  const aani = aaniOsoite('https://cdn.freesound.org/previews/511/511005_571436-lq.mp3');
  assert.equal(peilinLaji(aani), 'aanet');
  assert.equal(peilinLaji(`${PEILI_JUURI}kuvat/souvlaki-in-athens.jpg`), 'kuvat');
  assert.equal(peilinLaji(`${PEILI_JUURI}liput/flag-of-greece.png`), 'kuvat');
  assert.equal(peilinLaji('assets/audio/efekti-klik.mp3'), null);
  assert.equal(peilinLaji(null), null);
});

/** Kevyt <img>-jäljitelmä: riittää asetaKuvan ketjun tarkistamiseen. */
function teeKuva() {
  const kuuntelijat = [];
  return {
    src: null,
    getAttribute() { return this.src; },
    setAttribute(_, arvo) { this.src = arvo; },
    addEventListener(laji, fn, asetus) {
      if (laji === 'error') kuuntelijat.push({ fn, kerran: Boolean(asetus?.once) });
    },
    removeEventListener(laji, fn) {
      const i = kuuntelijat.findIndex((k) => k.fn === fn);
      if (i >= 0) kuuntelijat.splice(i, 1);
    },
    /** Laukaisee latausvirheen niin kuin selain tekisi. */
    petta() {
      for (const k of kuuntelijat.splice(0, kuuntelijat.length)) {
        if (!k.kerran) kuuntelijat.push(k);
        k.fn();
      }
    },
  };
}

test('asetaKuva siirtyy varareitille ja luovuttaa vasta sitten', () => {
  nollaaPeili();
  const kuva = teeKuva();
  let luovutti = 0;
  asetaKuva(kuva, 'https://peili.test/a.jpg', 'https://alkuperainen.test/a.jpg',
    () => { luovutti += 1; });
  assert.equal(kuva.src, 'https://peili.test/a.jpg');

  kuva.petta();
  assert.equal(kuva.src, 'https://alkuperainen.test/a.jpg', 'peilin pettäessä varareitille');
  assert.equal(luovutti, 0, 'ei vielä luovuteta');

  kuva.petta();
  assert.equal(luovutti, 1, 'kumpikin petti — nyt luovutetaan');

  kuva.petta();
  assert.equal(luovutti, 1, 'ketju ei jää silmukkaan');
  nollaaPeili();
});

test('asetaKuva luovuttaa heti, kun varareittiä ei ole', () => {
  nollaaPeili();
  const kuva = teeKuva();
  let luovutti = 0;
  asetaKuva(kuva, 'https://vain.test/a.jpg', null, () => { luovutti += 1; });
  kuva.petta();
  assert.equal(luovutti, 1);
  nollaaPeili();
});

test('vanha kuuntelija ei pudota uutta kuvaa edellisen varareitille', () => {
  nollaaPeili();
  const kuva = teeKuva();
  asetaKuva(kuva, 'https://peili.test/eka.jpg', 'https://alkuperainen.test/eka.jpg');
  // Galleriassa sama <img> saa heti seuraavan kuvan ilman virhettä.
  asetaKuva(kuva, 'https://peili.test/toka.jpg', 'https://alkuperainen.test/toka.jpg');
  kuva.petta();
  assert.equal(kuva.src, 'https://alkuperainen.test/toka.jpg',
    'varareitin pitää olla juuri sen kuvan, joka petti');
  nollaaPeili();
});

// --- vertailu peilaustyökaluun ja manifestiin --------------------------------

const JUURI = new URL('..', import.meta.url).pathname;

test('peilaustyökalu käyttää samaa turvanimi-sääntöä', () => {
  const tyokalu = readFileSync(join(JUURI, 'tools/peilaa-media.mjs'), 'utf8');
  const peli = readFileSync(join(JUURI, 'js/media.js'), 'utf8');
  const ydin = (s) => {
    const osa = s.match(/function turvanimi\([^)]*\) \{([\s\S]*?)\n\}/);
    assert.ok(osa, 'turvanimi-funktiota ei löytynyt');
    return osa[1].replace(/\s+/g, ' ').trim();
  };
  assert.equal(ydin(peli), ydin(tyokalu),
    'js/media.js ja tools/peilaa-media.mjs ovat eriytyneet — korjaa molemmat');
});

// Manifesti on ämpärissä eikä pelin mukana. Jos se on koneella,
// tarkistetaan koko aineisto; muuten testi ohitetaan.
//
// Ensisijainen paikka on media/ repon sisällä: sinne peilaustyökalu
// kirjoittaa, ja sinne peilausajo (.github/workflows/peilaa.yml) noutaa
// ämpärin sisällön ennen kuin ajaa nämä testit. Niin tämä tarkistus
// oikeasti ajetaan jokaisella peilauksella eikä vain sattumalta.
//
// Perässä ovat vanhat sijainnit media-repon ajalta, jottei testi ohitu
// keneltäkään jolla se on yhä levyllä. Linuxissa polku on kirjainkoolle
// herkkä, ja ilman isoa alkukirjainta testi ohittui hiljaisesti juuri
// siellä, missä repo oli.
const MANIFESTIT = [
  join(JUURI, 'media/manifesti.json'),
  join(JUURI, '../matkakirja-media-repo/manifesti.json'),
  join(JUURI, '../matkakirja-media/manifesti.json'),
  join(JUURI, '../Matkakirja-media/manifesti.json'),
];
const manifestiPolku = MANIFESTIT.find((p) => existsSync(p));

test('peilin polut täsmäävät manifestiin', { skip: !manifestiPolku && 'manifestia ei ole koneella' }, () => {
  const m = JSON.parse(readFileSync(manifestiPolku, 'utf8'));
  for (const kansio of ['kuvat', 'liput']) {
    for (const [nimi, tieto] of Object.entries(m[kansio])) {
      assert.equal(peiliKuvaPolku(nimi, kansio), tieto.tiedosto, `${kansio}: ${nimi}`);
    }
  }
  for (const [url, tieto] of Object.entries(m.aanet)) {
    assert.equal(peiliAaniPolku(url), tieto.tiedosto, `aanet: ${url}`);
  }
  const yhteensa = Object.keys(m.kuvat).length + Object.keys(m.liput).length
    + Object.keys(m.aanet).length;
  assert.ok(yhteensa > 250, `peilissä pitäisi olla koko aineisto, nyt ${yhteensa}`);
});

test('katkaisija erottaa kuvat ja äänet polusta, ei palvelimesta', () => {
  // Koko peili on nyt samassa ämpärissä, joten juuret osoittavat samaan
  // paikkaan. Lähdekohtainen katkaisija ei silti saa sekoittaa lajeja:
  // jos äänet putoavat, kuvien pitää yhä tulla peilistä.
  assert.match(AANI_JUURI, /^https:\/\//);
  assert.ok(AANI_JUURI.endsWith('/'), 'juuren perään liitetään polku sellaisenaan');
  assert.equal(peilinLaji(`${AANI_JUURI}aanet/freesound-511005.mp3`), 'aanet');
  assert.equal(peilinLaji(`${PEILI_JUURI}kuvat/souvlaki-in-athens.jpg`), 'kuvat');
  assert.equal(peilinLaji(`${PEILI_JUURI}liput/flag-of-greece.png`), 'kuvat');
  // Aineisto ei ole enää GitHub Pagesissa: sen suositusraja (1 Gt) tuli
  // vastaan, ja juuri siksi kaikki siirrettiin ämpäriin.
  assert.doesNotMatch(PEILI_JUURI, /github\.io/,
    'peili palasi Pagesiin, jonka kokoraja tuli vastaan');
  assert.doesNotMatch(AANI_JUURI, /github\.io/);
});
