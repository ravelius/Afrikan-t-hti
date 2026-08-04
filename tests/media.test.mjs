// Peilin polkusääntö on yhdessä paikassa: pelissä (js/media.js).
// Peilaustyökalu (tools/peilaa-media.mjs) tuo sen sieltä. Ennen sääntö
// oli kahtena kappaleena, ja ne eriytyivät: työkalu kirjoitti tiedoston
// yhdellä nimellä ja peli haki sitä toisella — eikä sitä huomannut
// ennen kuin pelaaja avasi kortin. Nämä testit vartioivat sekä sitä,
// ettei toista kopiota synny takaisin, että sitä, että sääntö vastaa
// peilin manifestia, jos manifesti on koneella.

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
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
  // Aloituskohta ja voimakkuus kulkevat osoitteen perässä, mutta eivät
  // kuulu tiedoston nimeen.
  assert.equal(
    peiliAaniPolku('https://archive.org/download/aporee_21876_25420/marrakesh.mp3#alku=20&voima=1.5'),
    'aanet/aporee-aporee_21876_25420.mp3',
  );
});

test('äänen nimi tulee osoitteesta eikä listan järjestyksestä', () => {
  // Nimi oli aiemmin positionaalinen: kun osoitteesta ei saatu tunnusta,
  // peilaustyökalu nimesi tiedoston silmukan indeksillä (aporee-50) ja
  // peli tyhjällä merkkijonolla. Peli ei löytänyt tiedostoa koskaan, ja
  // yksi uusi ääni listan alkuun olisi tehnyt kaikista jo peilatuista
  // tiedostoista tavoittamattomia.
  // Nimessä on oltava arkiston oma pysyvä tunnus. Se on ainoa osa, joka
  // ei muutu kun lähdelista järjestyy uudelleen.
  const parit = [
    ['https://archive.org/download/aporee_21876_25420/marrakesh.mp3', 'aporee_21876_25420'],
    ['https://cdn.freesound.org/previews/511/511005_571436-lq.mp3', '511005'],
  ];
  for (const [url, tunnus] of parit) {
    assert.ok(peiliAaniPolku(url).includes(tunnus), `${url} → tunnus ${tunnus} puuttuu nimestä`);
  }

  // Arkiston lähdesivu (kirjaskanni, viritysäänen lisenssisivu) ei ole
  // äänitiedosto. Sitä ei peilata, joten polkua ei ole — eikä sitä
  // arvata. Peilaustyökalu käyttää tätä samaa vastausta päättäessään
  // mitä se lataa, joten kirjoittaja ja lukija eivät voi eriytyä.
  for (const sivu of [
    'https://archive.org/details/Crowded13760khz',
    'https://archive.org/details/radio-angela-heavy-static-edition.-th.-2023-03-24-t-03-18-12-z-5130.0k-hz',
    'https://archive.org/details/narrativeofexped00wran_0',
    'https://archive.org/download/aporee_21876_25420',
  ]) {
    assert.equal(peiliAaniPolku(sivu), null, sivu);
    // Peilaamaton osoite soitetaan sellaisenaan alkuperäisestä lähteestä.
    assert.equal(aaniOsoite(sivu), sivu, sivu);
  }
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

test('nimeämissäännöstä on vain yksi kopio', () => {
  // Ennen sääntö oli kahtena kappaleena ja tämä testi vertasi kopioita
  // toisiinsa. Vertailu ei riittänyt: turvanimi pysyi samana, mutta
  // ääniosoitteen tunnus eriytyi silti (työkalulla varana silmukan
  // indeksi, pelillä tyhjä merkkijono) eikä testi nähnyt sitä. Nyt
  // kopioita ei ole yhtään: työkalu tuo säännön pelistä. Tämä testi
  // vartioi, ettei toista kopiota synny takaisin.
  const tyokalu = readFileSync(join(JUURI, 'tools/peilaa-media.mjs'), 'utf8');
  assert.match(tyokalu, /import \{[^}]*peiliAaniPolku[^}]*\} from '\.\.\/js\/media\.js'/,
    'peilaustyökalun pitää tuoda nimeämissääntö js/media.js:stä');
  assert.doesNotMatch(tyokalu, /function turvanimi\s*\(/,
    'peilaustyökaluun on ilmestynyt oma kopio turvanimestä');
  for (const etuliite of ['freesound-', 'aporee-']) {
    assert.doesNotMatch(tyokalu, new RegExp(`\`${etuliite}\\$\\{`),
      `peilaustyökalu rakentaa taas itse nimen ${etuliite}… — sääntö on eriytymässä`);
  }
});

test('jokainen soitettava ääni on peilattavissa', () => {
  // Peilaustyökalu peilaa vain ne osoitteet, joille sääntö antaa nimen.
  // Jos peliin lisätään ääni jonkin uuden muotoisen osoitteen takaa, se
  // jäisi hiljaa peilin ulkopuolelle ja haettaisiin joka kerta suoraan
  // lähteestä — juuri niin kävi viritysäänille. Soitettavat kentät
  // erotetaan lähdeviitteistä (linkki, lahde): viite osoittaa arkiston
  // sivulle, jota ei soiteta eikä peilata.
  const SOITETTAVAT = ['url', 'musiikkiNayte', 'oletus', 'aani'];
  const lahteet = [
    ...readdirSync(join(JUURI, 'js/packs')).map((f) => join(JUURI, 'js/packs', f)),
    join(JUURI, 'js/aani-ehdokkaat.js'),
  ];
  const teksti = lahteet.map((p) => readFileSync(p, 'utf8')).join('\n');
  const kuvio = new RegExp(
    `(?:${SOITETTAVAT.join('|')}): '(https?://(?:cdn\\.freesound\\.org|archive\\.org)[^']*)'`, 'g',
  );
  const urlit = [...new Set([...teksti.matchAll(kuvio)].map((m) => m[1]))];
  assert.ok(urlit.length > 100, `soitettavia ääniä pitäisi olla runsaasti, nyt ${urlit.length}`);
  const nimettomat = urlit.filter((u) => !peiliAaniPolku(u));
  assert.deepEqual(nimettomat, [],
    'näille soitettaville äänille ei synny peilin nimeä — peilaustyökalu ohittaa ne');
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
