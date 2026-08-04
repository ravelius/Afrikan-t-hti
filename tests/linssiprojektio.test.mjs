// Linssien projisointiapurin tarkistukset.
//
// Apuri on kymmenen linssin yhteinen: jos se liukuu, kymmenen
// aineistopakettia liukuu mukana eikä sitä huomaa kuin katsomalla
// karttaa tarkkaan. Siksi tässä vartioidaan kolmea asiaa:
//
//  1. TUNNETUT PISTEET. Samat kaupungit ja samat laudan reunat kuin
//     tests/vanha-maailma.test.mjs käyttää — sovitus ei saa muuttua
//     vahingossa.
//  2. SAUMA. Sauman ylittävä viiva pysyy yhtenäisenä ja sauman yli
//     valuva rengas saa kierron kopion. Molemmat ovat jo kertaalleen
//     rikkoneet kartan (tools/tee-maasto.mjs 20–25, 69–81).
//  3. KIRJOITETTU TIEDOSTO. Otsikossa on lähde, lisenssi ja hakupäivä,
//     ja tulos on ajettavaa JS:ää.

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { sovitaLinssi, SOVITUS } from '../tools/linssiprojektio.mjs';
import { miller } from '../tools/vanha-maailma.mjs';
import { MAAILMANKARTTA } from '../js/packs/maailmankartta.js';

const { piste, viiva, rengas, enimmakseenLaudalla, kirjoita, leveys, korkeus, skaala } = sovitaLinssi();

/** Leveysaste laudan y:stä. Käänteinen tarkistus samoille reunoille. */
const latYsta = (y) => miller.taakse(0, y / skaala + miller.eteen(0, SOVITUS.pohjoinen)[1])[1];

/** Pituusaste laudan x:stä, kierrettynä välille (-180, 180]. */
const lonXsta = (x) => {
  const lon = SOVITUS.lon0 + (x / skaala) * (180 / Math.PI);
  return ((lon + 180) % 360 + 360) % 360 - 180;
};

test('tunnetut kaupungit osuvat laudalle', () => {
  // Nämä kaksi ovat sovituksen kiintopisteet: Helsinki pohjoisella
  // pallonpuoliskolla lähellä yläreunaa, Sydney eteläisellä ja sauman
  // itäpuolella. Jos kumpikin liikkuu, sovitus on muuttunut.
  assert.deepEqual(piste([24.94, 60.17]), [6664.7, 917.2], 'Helsinki');
  assert.deepEqual(piste([151.2, -33.87]), [10873.3, 4385.1], 'Sydney');
});

test('laudan reunat vastaavat sovituksen asteita', () => {
  // x = 0 on nollameridiaani lon0 = -175. Sama piste toiselta suunnalta
  // (185°) osuu samaan kohtaan — kartta kiertää ympäri.
  assert.equal(piste([SOVITUS.lon0, 0])[0], 0, 'lon -175 ei ole laudan vasen reuna');
  assert.equal(piste([SOVITUS.lon0 + 360, 0])[0], 0, 'kierto ei tuo samaa pistettä samaan kohtaan');
  assert.equal(lonXsta(0), SOVITUS.lon0, 'x = 0 ei käänny takaisin lon -175:ksi');

  // y = 0 on pohjoisreuna 76° ja y = korkeus eteläreuna -58°.
  assert.equal(piste([0, SOVITUS.pohjoinen])[1], 0, 'lat 76 ei ole laudan yläreuna');
  assert.equal(latYsta(0), SOVITUS.pohjoinen, 'y = 0 ei käänny takaisin lat 76:ksi');

  /*
   * Alareuna on 0,1 yksikköä epätarkka, eikä se ole vika.
   *
   * Laudan korkeus on `Math.round((yEtela - yPohjoinen) * skaala)` =
   * 5399, kun projisoitu tarkka arvo on 5399,1. Pyöristys on pakko:
   * pakan `height` on kokonaisluku. Ero on 0,1 laudan yksikköä eli
   * 1/50 pikselistä yleiskuvassa — asteina 3 tuhannesosaa, noin 300 m.
   */
  assert.equal(korkeus, 5399, 'laudan korkeus ei ole enää 5399');
  const alareuna = piste([0, SOVITUS.etela])[1];
  assert.ok(Math.abs(alareuna - korkeus) <= 0.2,
    `lat -58 osuu kohtaan ${alareuna}, ei laudan alareunaan ${korkeus}`);
  assert.ok(Math.abs(latYsta(korkeus) - SOVITUS.etela) < 0.01,
    `y = ${korkeus} kääntyy leveysasteeksi ${latYsta(korkeus)}, ei -58`);
});

test('sovitus täsmää maailmankartan pakan mittoihin', () => {
  // Tämä on koko apurin olemassaolon ehto: projisoitu aineisto piirtyy
  // pakan laudalle. Jos pakan mitat muuttuvat, SOVITUS on muutettava
  // mukana ja kaikki linssit ajettava uudelleen.
  assert.equal(leveys, MAAILMANKARTTA.map.width, 'laudan leveys ei täsmää pakkaan');
  assert.equal(korkeus, MAAILMANKARTTA.map.height, 'laudan korkeus ei täsmää pakkaan');
  assert.ok(Math.abs(skaala - 1909.8593) < 0.001, `skaala on ${skaala}, odotettu 1909,8593`);
});

test('sauman ylittävä viiva pysyy yhtenäisenä', () => {
  /*
   * Viiva kulkee lännestä sauman yli: -160° → 170°, eli sauman (-175°)
   * poikki 30 asteen matkan. Ilman muunnaViivaa piste hyppäisi laudan
   * laidasta laitaan ja viiva piirtyisi vaakaviivana halki kartan.
   */
  const asteina = [[-160, 30], [-165, 30], [-170, 30], [-175, 30], [-180, 30], [175, 30], [170, 30]];
  const laudalla = viiva(asteina);

  const hypyt = laudalla.slice(1).map(([x], i) => Math.abs(x - laudalla[i][0]));
  assert.ok(Math.max(...hypyt) < leveys / 2,
    `peräkkäisten pisteiden välillä ${Math.max(...hypyt)} yksikön hyppy — sauma repesi`);

  // Yhtenäisyys tarkoittaa myös samaa suuntaa: 30 asteen matka länteen
  // on 1000 yksikköä eikä mitään muuta.
  const kokoMatka = Math.abs(laudalla.at(-1)[0] - laudalla[0][0]);
  assert.ok(Math.abs(kokoMatka - 1000) < 1, `matka on ${kokoMatka} yksikköä, odotettu 1000`);
  for (let i = 1; i < laudalla.length; i++) {
    assert.ok(laudalla[i][0] < laudalla[i - 1][0], 'viiva kääntyi takaisin päin saumassa');
  }

  // Ja sama todistus toisin päin: pisteittäin projisoituna sauma
  // NIMENOMAAN repeää. Juuri siksi viivalle on oma funktio.
  const pisteittain = asteina.map(piste);
  const isoinHyppy = Math.max(...pisteittain.slice(1)
    .map(([x], i) => Math.abs(x - pisteittain[i][0])));
  assert.ok(isoinHyppy > leveys / 2,
    'piste-funktio ei enää hyppää saumassa — testi ei todista mitään');
});

test('sauman yli valuva rengas saa kierron kopion', () => {
  // Rengas laudan vasemman reunan yli: x menee negatiiviseksi, joten
  // kopio kuuluu oikealle laidalle.
  const vasemmalle = rengas([[-174, 10], [-176, 10], [-176, -10], [-174, -10]]);
  assert.equal(vasemmalle.length, 2, 'reunan yli valuva rengas ei saanut kopiota');
  assert.ok(Math.min(...vasemmalle[0].map(([x]) => x)) < 0);
  for (let i = 0; i < vasemmalle[0].length; i++) {
    assert.ok(Math.abs(vasemmalle[1][i][0] - (vasemmalle[0][i][0] + leveys)) < 0.05,
      'kopio ei ole tarkalleen laudan leveyden päässä');
    assert.equal(vasemmalle[1][i][1], vasemmalle[0][i][1], 'kopio siirtyi pystysuunnassa');
  }

  // Sama muoto vastapäivään: muunnaViiva jatkaa oikealle, x ylittää
  // laudan leveyden ja kopio kuuluu vasemmalle laidalle.
  const oikealle = rengas([[-176, 10], [-174, 10], [-174, -10], [-176, -10]]);
  assert.equal(oikealle.length, 2, 'reunan yli valuva rengas ei saanut kopiota');
  assert.ok(Math.max(...oikealle[0].map(([x]) => x)) > leveys);
  assert.ok(Math.abs(oikealle[1][0][0] - (oikealle[0][0][0] - leveys)) < 0.05,
    'kopion pitäisi olla laudan leveyden verran vasemmalla');

  // Laudan keskellä oleva rengas ei saa kopiota: turha kopio maksaisi
  // elementtejä eikä näkyisi missään.
  const keskella = rengas([[20, 60], [30, 60], [30, 50], [20, 50]]);
  assert.equal(keskella.length, 1, 'keskellä oleva rengas kahdennettiin turhaan');
});

test('laudan ulkopuolinen muoto pudotetaan enemmistöllä', () => {
  // Etelämanner: kokonaan alareunan alapuolella. Ilman karsintaa se
  // piirtyi möykkynä kartan alle.
  const etelamanner = viiva([[0, -60], [40, -70], [80, -80], [120, -85]]);
  assert.equal(enimmakseenLaudalla(etelamanner), false, 'Etelämanner jäi mukaan');

  // Grönlanti: pohjoiskärki yläreunan yli mutta enemmistö laudalla.
  const gronlanti = viiva([[-45, 82], [-30, 78], [-25, 74], [-40, 70], [-50, 65]]);
  assert.equal(enimmakseenLaudalla(gronlanti), true, 'Grönlanti katosi');

  // Tasapeli ei riitä: enemmistön on oltava aito, jotta puoliksi
  // reunan takana oleva muoto ei jää roikkumaan.
  const puoliksi = viiva([[0, 80], [10, 80], [20, 70], [30, 60]]);
  assert.equal(enimmakseenLaudalla(puoliksi), false, 'tasapeli meni läpi');
});

test('kirjoita tekee koneen kirjoittaman tiedoston lähteineen', async () => {
  const kansio = mkdtempSync(join(tmpdir(), 'linssiprojektio-'));
  try {
    const ulos = join(kansio, 'linssi-testi-lauta.js');
    const { teksti, kirjoitettu } = kirjoita({
      ulos,
      tyokalu: 'tools/tee-linssi-testi.mjs',
      asteet: 'tools/mapdata/linssi-testi.js',
      otsikko: 'Testilinssi laudan koordinaatteina.',
      lahteet: {
        aineisto: 'Beck ym. 2018: Köppen–Geiger climate classification maps',
        lisenssi: 'CC BY 4.0',
        osoite: 'https://doi.org/10.1038/sdata.2018.214',
        haettu: '2026-08-03',
      },
      vienti: 'TESTI_LAUTA',
      data: { ryhmat: [{ avain: 'a', vari: '#3f6b45', renkaat: rengas([[20, 60], [30, 60], [30, 50]]) }] },
      hiljaa: true,
    });
    assert.equal(kirjoitettu, true);

    // Otsikko: varoitus, komento ja koko lähdeviite. Ilman näitä
    // koneen kirjoittamaa tiedostoa korjataan käsin ja korjaus katoaa
    // seuraavassa ajossa.
    const sisalto = readFileSync(ulos, 'utf8');
    assert.equal(sisalto, teksti, 'palautettu teksti ei ole sama kuin kirjoitettu');
    assert.match(sisalto.split('\n')[0], /^\/\/ Testilinssi laudan koordinaatteina\.$/);
    assert.match(sisalto, /TÄMÄ TIEDOSTO ON KONEEN KIRJOITTAMA/);
    assert.match(sisalto, /node tools\/tee-linssi-testi\.mjs/);
    assert.match(sisalto, /tools\/mapdata\/linssi-testi\.js/);
    assert.match(sisalto, /Aineisto: Beck ym\. 2018/);
    assert.match(sisalto, /Lisenssi: CC BY 4\.0/);
    assert.match(sisalto, /Haettu:   2026-08-03/);
    assert.match(sisalto, new RegExp(`${leveys} x ${korkeus}`));

    // Tulos on ajettavaa JS:ää ja vie pyydetyn vakion.
    const { TESTI_LAUTA } = await import(`file://${ulos}`);
    assert.equal(TESTI_LAUTA.ryhmat.length, 1);
    assert.deepEqual(TESTI_LAUTA.ryhmat[0].renkaat, rengas([[20, 60], [30, 60], [30, 50]]));

    // Rengas mahtuu yhdelle riville: siitä näkee diffissä mikä muuttui.
    const rengasrivit = sisalto.split('\n').filter((r) => r.includes('[['));
    assert.equal(rengasrivit.length, 1, 'pistelista hajosi usealle riville');
  } finally {
    rmSync(kansio, { recursive: true, force: true });
  }
});

test('kuiva-ajo ei kirjoita tiedostoa', () => {
  const kansio = mkdtempSync(join(tmpdir(), 'linssiprojektio-'));
  try {
    const ulos = join(kansio, 'ei-synny.js');
    const { kirjoitettu } = kirjoita({
      ulos,
      tyokalu: 'tools/tee-linssi-testi.mjs',
      otsikko: 'Testilinssi.',
      lahteet: { aineisto: 'X', lisenssi: 'CC0', haettu: '2026-08-03' },
      vienti: 'TESTI_LAUTA',
      data: [],
      kuiva: true,
      hiljaa: true,
    });
    assert.equal(kirjoitettu, false);
    assert.equal(existsSync(ulos), false, 'kuiva-ajo kirjoitti tiedoston');
  } finally {
    rmSync(kansio, { recursive: true, force: true });
  }
});

test('puuttuva lähdeviite pysäyttää kirjoituksen', () => {
  // Tarkistuslista vaatii lähteen, lisenssin ja hakupäivän jokaisesta
  // projisoidusta tiedostosta. Se on halvempi valvoa koneella kuin
  // yhdentoista linssin katselmoinnissa.
  const perus = {
    ulos: join(tmpdir(), 'ei-koskaan.js'),
    tyokalu: 'tools/tee-linssi-testi.mjs',
    otsikko: 'Testilinssi.',
    vienti: 'TESTI_LAUTA',
    data: [],
    hiljaa: true,
  };
  assert.throws(() => kirjoita({ ...perus, lahteet: { aineisto: 'X', lisenssi: 'CC0' } }),
    /haettu/, 'hakupäivän puute ei pysäyttänyt');
  assert.throws(() => kirjoita({ ...perus, lahteet: { aineisto: 'X', haettu: '2026-08-03' } }),
    /lisenssi/, 'lisenssin puute ei pysäyttänyt');
  assert.throws(() => kirjoita({ ...perus, lahteet: null }), /lahteet/, 'lähteen puute ei pysäyttänyt');
  assert.equal(existsSync(perus.ulos), false, 'virhe ehti kirjoittaa tiedoston');
});
