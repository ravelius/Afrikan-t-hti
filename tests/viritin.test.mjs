// Viritysäänen testit.
//
// Web Audiota ei ole Nodessa, joten testataan se mitä voi:
//
//  1. ARVONNAN RAJAT. Viritin on kokonaan satunnainen, ja juuri siksi
//     rajat ovat sen ainoa turva. Tätä kuunnellaan kuulokkeilla, joten
//     yksikin karannut parametri on korvaan sattuva ääni — ja koska
//     jokainen viritys on eri, sellaista ei löydä kokeilemalla.
//  2. LOPETUKSEN TURVALLISUUS. Radiossa on kaksi paikkaa, jotka
//     molemmat pysäyttävät äänen, ja suora lähetys voi alkaa tai pettää
//     missä kohtaa tahansa. lopeta() on siis kutsuttava turvallisesti
//     kahdesti ja ilman aloitusta.
//
// Soittaminen käydään läpi tynkäkontekstilla, joka kirjaa luodut solmut
// samaan tapaan kuin tests/sound.test.mjs — näin testi ajaa oikeasti
// synteesikoodin eikä vain totea, ettei mikään kaadu ilman äänilaitetta.

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  teeViritin, arvoViritysParametrit, VIRITTIMEN_RAJAT as R,
} from '../js/linssit/viritin.js';

// --- tynkäkonteksti ---------------------------------------------------------

/** Automaatioparametri, joka hyväksyy kaikki aikataulutuskutsut. */
function param(value = 0) {
  return {
    value,
    kutsut: [],
    setValueAtTime(v, t) { this.kutsut.push(['set', v, t]); return this; },
    linearRampToValueAtTime(v, t) { this.kutsut.push(['lin', v, t]); return this; },
    exponentialRampToValueAtTime(v, t) { this.kutsut.push(['exp', v, t]); return this; },
    cancelScheduledValues() { this.kutsut.push(['peru']); return this; },
  };
}

function tynkaContext() {
  const ctx = {
    currentTime: 0,
    sampleRate: 44100,
    luodut: [],
    aloitetut: [],
    pysaytetyt: [],
    irrotetut: [],
    destination: { type: 'destination' },
  };
  // `laji` on solmun laji ja `type` sen äänityyppi (sine, bandpass, …),
  // jonka koodi kirjoittaa yli — ne on pidettävä erillään.
  const luo = (laji, lisa = {}) => {
    const solmu = {
      ...lisa,
      laji,
      connect(kohde) { return kohde; },
      disconnect() { ctx.irrotetut.push(laji); },
      start(t) { ctx.aloitetut.push({ laji, t }); },
      stop(t) { ctx.pysaytetyt.push({ laji, t }); },
    };
    ctx.luodut.push(solmu);
    return solmu;
  };
  ctx.createGain = () => luo('gain', { gain: param(1) });
  ctx.createOscillator = () => luo('oscillator', { frequency: param(440), type: 'sine' });
  ctx.createBufferSource = () => luo('bufferSource', { buffer: null, loop: false });
  ctx.createBiquadFilter = () => luo('filter', {
    frequency: param(1000), Q: param(1), type: 'bandpass',
  });
  ctx.createBuffer = (kanavia, kehyksia, rate) => {
    const data = new Float32Array(kehyksia);
    return {
      length: kehyksia, sampleRate: rate, numberOfChannels: kanavia, getChannelData: () => data,
    };
  };
  return ctx;
}

/** Viritin tynkäkontekstiin, aina äänet päällä ja oma kohde. */
function tynkaViritin(asetukset = {}) {
  const ctx = tynkaContext();
  const kohde = { type: 'kohde', connect: (k) => k, disconnect() {} };
  const viritin = teeViritin(ctx, { kohde, mykistetty: () => false, ...asetukset });
  return { ctx, viritin };
}

// --- arvonnan rajat ---------------------------------------------------------

/** Tarkistaa yhden arvonnan tuloksen kaikkia rajoja vasten. */
function tarkistaParametrit(p, nimi) {
  const vali = (arvo, raja, mika) => assert.ok(
    arvo >= raja[0] - 1e-9 && arvo <= raja[1] + 1e-9,
    `${nimi}: ${mika} = ${arvo}, rajat ${raja[0]}…${raja[1]}`,
  );

  vali(p.jakso, R.jakso, 'jakso');
  vali(p.kohina.voima, R.kohinaVoima, 'kohinan voima');

  assert.ok(p.kohina.pisteet.length >= 2, `${nimi}: viisarilla ei ole liikettä`);
  let edellinen = -1;
  for (const piste of p.kohina.pisteet) {
    vali(piste.hz, R.kohinaHz, 'kohinan taajuus');
    vali(piste.q, R.kohinaQ, 'kohinan Q');
    assert.ok(piste.aika >= edellinen, `${nimi}: viisarin pisteet eivät ole aikajärjestyksessä`);
    assert.ok(piste.aika <= p.jakso + 1e-9, `${nimi}: viisarin piste jakson ulkopuolella`);
    edellinen = piste.aika;
  }

  assert.ok(
    p.vihellykset.length >= R.viheltajia[0] && p.vihellykset.length <= R.viheltajia[1],
    `${nimi}: viheltäjiä ${p.vihellykset.length}`,
  );
  for (const v of p.vihellykset) {
    vali(v.alkuHz, R.vihellysHz, 'vihellyksen alkutaajuus');
    vali(v.loppuHz, R.vihellysHz, 'vihellyksen lopputaajuus');
    vali(v.kesto, R.vihellysKesto, 'vihellyksen kesto');
    vali(v.voima, R.vihellysVoima, 'vihellyksen voima');
    vali(v.nousu, R.vihellysNousu, 'vihellyksen nousu');
    assert.ok(v.alku >= 0, `${nimi}: vihellys alkaa ennen jaksoa`);
    assert.ok(v.alku + v.kesto <= p.jakso + 1e-9, `${nimi}: vihellys jatkuu jakson yli`);
    // Ei äkillisiä huippuja: lyhinkin nousu on kymmeniä millisekunteja.
    assert.ok(v.kesto * v.nousu >= 0.06, `${nimi}: vihellys nousee ${v.kesto * v.nousu} s:ssa`);
  }

  assert.ok(
    p.vilahdukset.length >= R.vilahduksia[0] && p.vilahdukset.length <= R.vilahduksia[1],
    `${nimi}: vilahduksia ${p.vilahdukset.length}`,
  );
  let edellinenLoppu = 0;
  for (const v of p.vilahdukset) {
    assert.ok(v.laji === 'puhe' || v.laji === 'musiikki', `${nimi}: tuntematon laji ${v.laji}`);
    vali(v.voima, R.vilahdusVoima, 'vilahduksen voima');
    vali(v.vaisto, R.vilahdusVaisto, 'vilahduksen väistö');
    vali(v.formantit[0], R.formanttiYksi, 'ensimmäinen formantti');
    vali(v.formantit[1], R.formanttiKaksi, 'toinen formantti');
    for (const q of v.formanttiQ) vali(q, R.formanttiQ, 'formantin Q');
    vali(v.nousu, v.laji === 'puhe' ? R.puheenNousu : R.musiikinNousu, 'aseman nousu');
    vali(v.lasku, R.asemanLasku, 'aseman lasku');
    // Nousun ja laskun väliin on jäätävä runkoa. Ilman sitä asema on
    // pelkkä nousu ja lasku, ja kohinan väistö — joka seuraa näitä samoja
    // lukuja — muuttuu aukoksi.
    assert.ok(v.nousu + v.lasku <= 0.8, `${nimi}: asemalle ei jää runkoa`);
    assert.ok(v.kesto > 0 && v.kesto <= R.vilahdusKesto[1] + 1e-9, `${nimi}: vilahduksen kesto ${v.kesto}`);
    assert.ok(v.alku >= 0, `${nimi}: vilahdus alkaa ennen jaksoa`);
    assert.ok(v.alku + v.kesto <= p.jakso + 1e-9, `${nimi}: vilahdus jatkuu jakson yli`);
    // Omat lokerot: kaksi asemaa yhtä aikaa ei ole tunnelma vaan sotku.
    assert.ok(v.alku >= edellinenLoppu - 1e-9, `${nimi}: vilahdukset menevät päällekkäin`);
    edellinenLoppu = v.alku + v.kesto;

    if (v.laji === 'puhe') {
      assert.ok(v.tavut.length > 0, `${nimi}: puhevilahduksessa ei ole tavuja`);
      for (const tavu of v.tavut) {
        assert.ok(tavu.kesto > 0, `${nimi}: tavun kesto ${tavu.kesto}`);
        assert.ok(tavu.kesto <= R.tavunKesto[1] + 1e-9, `${nimi}: liian pitkä tavu ${tavu.kesto}`);
        assert.ok(tavu.voima > 0 && tavu.voima <= 1, `${nimi}: tavun voima ${tavu.voima}`);
        assert.ok(
          tavu.alku + tavu.kesto <= v.kesto + 1e-9,
          `${nimi}: tavu jatkuu vilahduksen yli`,
        );
      }
    } else {
      assert.ok(v.savelet.length >= 2, `${nimi}: musiikkivilahduksessa ei ole sointua`);
      // Musiikin ylin sävel on kaksi oktaavia perusäänestä; katto pitää
      // huolen lopusta, mutta arvonnankin on pysyttävä kuulokekelpoisena.
      for (const hz of v.savelet) {
        assert.ok(hz >= R.musiikkiHz[0] && hz <= R.musiikkiHz[1] * 2 + 1e-9,
          `${nimi}: sävel ${hz} rajojen ulkopuolella`);
      }
    }
  }
}

test('arvonta pysyy rajoissa tuhannella kierroksella', () => {
  for (let i = 0; i < 1000; i++) {
    tarkistaParametrit(arvoViritysParametrit(), `kierros ${i}`);
  }
});

test('arvonta pysyy rajoissa myös ääriarvoilla', () => {
  // Satunnaislähde reunoillaan on se tapaus, jota tuhannellakaan
  // kierroksella ei osu kohdalle — ja juuri siellä rajat pettävät.
  tarkistaParametrit(arvoViritysParametrit(() => 0), 'nolla');
  tarkistaParametrit(arvoViritysParametrit(() => 0.9999999), 'ykkönen');
  tarkistaParametrit(arvoViritysParametrit(() => 0.5), 'puolikas');
  // Vuorotteleva lähde sekoittaa suunnat: pyyhkäisyt ylös ja alas.
  let vuoro = 0;
  tarkistaParametrit(arvoViritysParametrit(() => ((vuoro++ % 2) ? 0.999999 : 0)), 'vuorottelu');
});

test('mikään taajuus ei nouse kuulokekaton yli', () => {
  // Katto on ketjun lopussa suodattimena, mutta jos arvonta tuottaisi
  // sen yli meneviä ääniä, ne kuuluisivat silti vaimennettuina — ja
  // omistajan ohje oli, ettei kirkkaita korkeita taajuuksia tule.
  for (let i = 0; i < 500; i++) {
    const p = arvoViritysParametrit();
    for (const v of p.vihellykset) {
      assert.ok(Math.max(v.alkuHz, v.loppuHz) <= R.katto, `vihellys ${v.alkuHz}→${v.loppuHz} Hz`);
    }
    for (const piste of p.kohina.pisteet) assert.ok(piste.hz <= R.katto);
    for (const v of p.vilahdukset) {
      assert.ok(Math.max(...v.formantit) <= R.katto);
      for (const hz of v.savelet) assert.ok(hz <= R.katto, `sävel ${hz} Hz`);
    }
  }
});

test('kaksi viritystä ei ole koskaan sama', () => {
  // Tämä on koko moduulin olemassaolon syy: omistaja ei halunnut, että
  // ihan sama ääni toistuu joka kerralla.
  const nahdyt = new Set();
  for (let i = 0; i < 300; i++) {
    const avain = JSON.stringify(arvoViritysParametrit());
    assert.ok(!nahdyt.has(avain), 'sama viritys arvottiin kahdesti');
    nahdyt.add(avain);
  }
});

// --- soittaminen ja lopetus -------------------------------------------------

test('aloita rakentaa kohinapohjan, vihellykset ja vilahdukset', () => {
  const { ctx, viritin } = tynkaViritin();
  assert.equal(viritin.aloita(), true);
  assert.equal(viritin.soi, true);

  const tyypit = ctx.luodut.map((s) => s.laji);
  assert.ok(tyypit.filter((t) => t === 'bufferSource').length >= 1, 'kohinapohja puuttuu');
  assert.ok(tyypit.filter((t) => t === 'oscillator').length >= 2, 'vihellykset puuttuvat');
  assert.ok(tyypit.filter((t) => t === 'filter').length >= 3, 'suodattimia liian vähän');
  assert.ok(ctx.aloitetut.length >= 3, 'lähteitä ei käynnistetty');

  // Kaikki solmut ovat muistissa, jotta lopeta saa ne irti.
  assert.ok(viritin.solmuja >= ctx.luodut.length - 1);
  viritin.lopeta();
});

test('sama viritin ei käynnisty kahdesti', () => {
  const { ctx, viritin } = tynkaViritin();
  viritin.aloita();
  const ennen = ctx.aloitetut.length;
  assert.equal(viritin.aloita(), true, 'toinen aloitus valehtelee tilasta');
  assert.equal(ctx.aloitetut.length, ennen, 'viritys käynnistyi kahdesti');
  viritin.lopeta();
});

test('lopeta on turvallinen ilman aloitusta', () => {
  const { ctx, viritin } = tynkaViritin();
  assert.doesNotThrow(() => viritin.lopeta());
  assert.equal(ctx.luodut.length, 0, 'aloittamaton viritin loi solmuja');
  assert.equal(viritin.soi, false);
});

test('lopeta on turvallinen kahdesti', () => {
  const { viritin } = tynkaViritin();
  viritin.aloita();
  assert.doesNotThrow(() => viritin.lopeta());
  assert.doesNotThrow(() => viritin.lopeta());
  assert.equal(viritin.soi, false);
});

test('lopetus ei jätä yhtään lähdettä käyntiin', () => {
  const { ctx, viritin } = tynkaViritin();
  viritin.aloita();
  const kaynnistetyt = ctx.aloitetut.length;
  viritin.lopeta();
  // Jokainen käynnistetty lähde on saanut stop-kutsun. Oskillaattori,
  // joka jää soimaan, soi ikuisesti — ja radiotilan voi avata uudelleen.
  assert.ok(
    ctx.pysaytetyt.length >= kaynnistetyt,
    `käynnistetty ${kaynnistetyt}, pysäytetty ${ctx.pysaytetyt.length}`,
  );
  assert.equal(viritin.solmuja, 0, 'solmuja jäi muistiin');
});

test('lopetus häivyttää eikä katkaise', () => {
  const { ctx, viritin } = tynkaViritin();
  viritin.aloita();
  const ulos = ctx.luodut.find((s) => s.laji === 'gain');
  viritin.lopeta();
  const viimeinen = ulos.gain.kutsut.at(-1);
  assert.equal(viimeinen[0], 'exp', 'lopetus ei ole ramppi');
  assert.ok(viimeinen[2] >= R.loppuHaive, `häivytys kesti vain ${viimeinen[2]} s`);
  // Lähteet pysähtyvät vasta häivytyksen jälkeen, ei sen aikana.
  for (const p of ctx.pysaytetyt) {
    if (p.laji === 'bufferSource') assert.ok(p.t >= R.loppuHaive, `lähde katkaistiin ${p.t} s`);
  }
});

test('lopetus irrottaa solmut', async () => {
  const { ctx, viritin } = tynkaViritin();
  viritin.aloita();
  const luotuja = ctx.luodut.length;
  viritin.lopeta();
  assert.equal(viritin.siivoaa, true, 'siivousta ei ajastettu');
  // Siivous odottaa häivytyksen loppuun: pysäytetty mutta kytketty
  // solmu jää elämään ketjun varassa.
  await new Promise((valmis) => { setTimeout(valmis, (R.loppuHaive + 0.3) * 1000); });
  assert.equal(ctx.irrotetut.length, luotuja, 'osa solmuista jäi kytketyksi');
  assert.equal(viritin.siivoaa, false);
});

test('mykistetty peli ei viritä', () => {
  const { ctx, viritin } = tynkaViritin({ mykistetty: () => true });
  assert.equal(viritin.aloita(), false);
  assert.equal(viritin.soi, false);
  assert.equal(ctx.luodut.length, 0, 'mykistetty viritin loi solmuja');
  assert.doesNotThrow(() => viritin.lopeta());
});

test('ilman äänikontekstia ei kaaduta', () => {
  const ilman = teeViritin(null, { mykistetty: () => false });
  assert.equal(ilman.aloita(), false);
  assert.doesNotThrow(() => ilman.lopeta());
});

test('äänenvoimakkuus rajautuu välille 0–1', () => {
  const { viritin } = tynkaViritin({ voimakkuus: 0.5 });
  viritin.aloita();
  assert.equal(viritin.asetaVoimakkuus(2), 1);
  assert.equal(viritin.asetaVoimakkuus(-3), 0);
  assert.equal(viritin.asetaVoimakkuus('ei luku'), 0);
  assert.equal(viritin.asetaVoimakkuus(0.42), 0.42);
  viritin.lopeta();
  // Lopetuksen jälkeen nuppi ei enää tee mitään, muttei myöskään kaada.
  assert.doesNotThrow(() => viritin.asetaVoimakkuus(1));
});

test('jaksot jatkuvat ilman aukkoa', () => {
  // Toinen jakso ajastetaan ennen kuin ensimmäinen loppuu, ja se
  // aikataulutetaan edellisen loppuun eikä nykyhetkeen — muuten
  // kohinapohjan liikkeeseen jäisi hiljainen kohta jokaisen jakson väliin.
  const { ctx, viritin } = tynkaViritin();
  viritin.aloita();
  const suodattimet = ctx.luodut.filter((s) => s.laji === 'filter');
  const liikkuva = suodattimet.find((s) => s.frequency.kutsut.length > 2);
  assert.ok(liikkuva, 'kohinan suodatin ei liiku');
  const ajat = liikkuva.frequency.kutsut.map((k) => k[2]);
  assert.ok(Math.max(...ajat) >= R.jakso[0], 'ensimmäinen jakso on liian lyhyt');
  viritin.lopeta();
});

test('pitkä viritys ei kasaa solmuja loputtomiin', (t) => {
  // Viritys kestää niin kauan kuin asemaa haetaan, ja jokainen jakso
  // luo omat vihellyksensä ja vilahduksensa. Jos vaienneita solmuja ei
  // pureta, pitkä haku kasvattaisi ketjua rajatta.
  t.mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const { ctx, viritin } = tynkaViritin();
    viritin.aloita();
    const yksiJakso = viritin.solmuja;
    for (let i = 0; i < 20; i++) {
      // Äänikello eteenpäin ensin, jotta edellinen jakso on vaiennut,
      // sitten jaksoketjun herätys.
      ctx.currentTime += 9;
      t.mock.timers.tick(9000);
    }
    assert.ok(
      viritin.solmuja <= yksiJakso * 2.5,
      `20 jakson jälkeen solmuja ${viritin.solmuja}, yhdessä jaksossa ${yksiJakso}`,
    );
    // Kaikki lähteet pysähtyvät, myös vanhoista jaksoista jääneet.
    const kaynnissa = ctx.aloitetut.length;
    viritin.lopeta();
    assert.ok(ctx.pysaytetyt.length >= kaynnissa, 'osa lähteistä jäi pysäyttämättä');
    assert.equal(viritin.solmuja, 0);
  } finally {
    t.mock.timers.reset();
  }
});
