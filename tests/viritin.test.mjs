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

/**
 * Automaatioparametri, joka hyväksyy kaikki aikataulutuskutsut.
 *
 * `kayrat` lisää setValueCurveAtTime- ja cancelAndHoldAtTime-kutsut eli
 * sen tien, jota oikea selain kulkee. Oletuksena niitä EI ole, koska
 * ristihäivytyksen varareitti (eksponenttiramppi) on yhtä lailla
 * testattava: siihen putoavat ne kontekstit, joissa käyriä ei ole.
 */
function param(value = 0, { kayrat = false } = {}) {
  const p = {
    value,
    kutsut: [],
    setValueAtTime(v, t) { this.kutsut.push(['set', v, t]); return this; },
    linearRampToValueAtTime(v, t) { this.kutsut.push(['lin', v, t]); return this; },
    exponentialRampToValueAtTime(v, t) { this.kutsut.push(['exp', v, t]); return this; },
    cancelScheduledValues() { this.kutsut.push(['peru']); return this; },
  };
  if (kayrat) {
    p.setValueCurveAtTime = function curve(kayra, t, kesto) {
      this.kutsut.push(['kayra', Array.from(kayra), t, kesto]);
      // Käyrän päätearvo jää voimaan, jotta seuraava häivytys lähtee
      // oikealta tasolta niin kuin selaimessakin.
      this.value = kayra[kayra.length - 1];
      return this;
    };
    p.cancelAndHoldAtTime = function hold(t) { this.kutsut.push(['pidatys', t]); return this; };
  }
  return p;
}

function tynkaContext({ kayrat = false } = {}) {
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
  ctx.createGain = () => luo('gain', { gain: param(1, { kayrat }) });
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
function tynkaViritin(asetukset = {}, { kayrat = false } = {}) {
  const ctx = tynkaContext({ kayrat });
  const kohde = { type: 'kohde', connect: (k) => k, disconnect() {} };
  const viritin = teeViritin(ctx, { kohde, mykistetty: () => false, ...asetukset });
  return { ctx, viritin };
}

/** Virittimen ulostulo eli ensimmäinen luotu vahvistin. */
function ulostulo(ctx) {
  const gain = ctx.luodut.find((s) => s.laji === 'gain');
  assert.ok(gain, 'ulostuloa ei luotu');
  return gain.gain;
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

// --- ristihäivytys ----------------------------------------------------------
//
// Omistajan toive: "Virityssuhina saisi feidautua kanavanvaihdon alussa ja
// lopussa. Tarkoitan, että siinä pitäisi olla ristifeidaus." Molemmat päät
// ovat siis häivytyksiä, ja molempien on oltava TASATEHOISIA: viritys on
// eri ääni kuin lähetys, ja riippumattomat äänet summautuvat teholtaan.
// Lineaarinen pari jättäisi vaihdon keskelle 3 dB:n kuopan.

test('aloitus häivyttää sisään eikä hyppää täyteen voimaan', () => {
  const { ctx, viritin } = tynkaViritin();
  viritin.aloita(0.6);
  const gain = ulostulo(ctx);

  const alku = gain.kutsut.find((k) => k[0] === 'set');
  assert.ok(alku, 'lähtöarvoa ei asetettu lainkaan');
  assert.ok(alku[1] <= 0.001, `kohina alkoi tasolta ${alku[1]}`);

  const nousu = gain.kutsut.find((k) => k[0] === 'exp');
  assert.ok(nousu, 'sisäänhäivytystä ei ajoitettu');
  assert.ok(nousu[1] > alku[1] * 10, 'ramppi ei nosta ääntä kuuluviin');
  assert.ok(Math.abs(nousu[2] - 0.6) < 1e-9, `sisäänhäivytys kesti ${nousu[2]} s`);

  // Yksikään kutsu ei aseta täyttä tasoa suoraan: se olisi juuri se
  // töksähdys, jonka poistamiseksi häivytys on.
  for (const kutsu of gain.kutsut) {
    if (kutsu[0] === 'set') assert.ok(kutsu[1] <= 0.001, `taso ${kutsu[1]} asetettiin hypyllä`);
  }
  viritin.lopeta();
});

test('kumpikin pää on tasatehoinen käyrä, ei lineaarinen', () => {
  const { ctx, viritin } = tynkaViritin({}, { kayrat: true });
  viritin.aloita(0.6);
  const gain = ulostulo(ctx);

  const nousu = gain.kutsut.find((k) => k[0] === 'kayra');
  assert.ok(nousu, 'sisäänhäivytystä ei ajoitettu käyränä');
  assert.equal(nousu[3], 0.6, 'sisäänhäivytyksen kesto ei ole pyydetty');
  const ylos = nousu[1];
  assert.ok(ylos.length >= 16, `käyrässä vain ${ylos.length} pistettä`);
  assert.ok(ylos[0] <= 0.001, `nousu alkaa tasolta ${ylos[0]}`);
  const huippu = ylos.at(-1);
  assert.ok(huippu > 0.5, `nousun huippu jäi tasolle ${huippu}`);
  for (let i = 1; i < ylos.length; i++) {
    assert.ok(ylos[i] > ylos[i - 1], 'nousu ei ole yksitoikkoisesti kasvava');
  }
  // Tasateho: puolivälissä sin(π/4) ≈ 0,707 huipusta. Lineaarinen nousu
  // olisi tasan puolet, ja juuri se ero on se 3 dB:n kuoppa.
  const keski = ylos[(ylos.length - 1) / 2];
  assert.ok(
    Math.abs(keski / huippu - Math.SQRT1_2) < 0.01,
    `nousu on puolivälissä ${(keski / huippu).toFixed(3)} huipusta, pitäisi olla 0,707`,
  );

  viritin.lopeta(0.6);
  const lasku = gain.kutsut.filter((k) => k[0] === 'kayra').at(-1);
  assert.notEqual(lasku, nousu, 'lopetus ei ajoittanut omaa käyräänsä');
  assert.equal(lasku[3], 0.6, 'loppuhäivytyksen kesto ei ole pyydetty');
  const alas = lasku[1];
  assert.ok(alas[0] > 0.5, `lasku alkaa tasolta ${alas[0]}`);
  assert.ok(alas.at(-1) <= 0.001, `lasku päättyy tasolle ${alas.at(-1)}`);
  for (let i = 1; i < alas.length; i++) {
    assert.ok(alas[i] < alas[i - 1], 'lasku ei ole yksitoikkoisesti vähenevä');
  }
  const laskunKeski = alas[(alas.length - 1) / 2];
  assert.ok(
    Math.abs(laskunKeski / alas[0] - Math.SQRT1_2) < 0.01,
    `lasku on puolivälissä ${(laskunKeski / alas[0]).toFixed(3)} lähdöstä`,
  );
  // Nouseva ja väistyvä puoli ovat sama pari: sin² + cos² = 1.
  for (let i = 0; i < ylos.length; i++) {
    const teho = (ylos[i] / huippu) ** 2 + (alas[i] / alas[0]) ** 2;
    assert.ok(Math.abs(teho - 1) < 0.01, `yhteisteho ${teho} pisteessä ${i}`);
  }
});

test('keskeytys ei kasaa päällekkäisiä häivytyksiä', () => {
  const { ctx, viritin } = tynkaViritin({}, { kayrat: true });
  viritin.aloita(0.6);
  const gain = ulostulo(ctx);
  const kayria = () => gain.kutsut.filter((k) => k[0] === 'kayra').length;
  assert.equal(kayria(), 1, 'aloitus ajoitti muutakin kuin yhden nousun');

  // Toinen aloitus ei ajoita toista nousua: kesken oleva viritys jatkuu
  // sellaisenaan, kun pelaaja hyppää kaupungista toiseen.
  viritin.aloita(0.6);
  assert.equal(kayria(), 1, 'toinen aloitus ajoitti toisen häivytyksen');

  // Nupin kääntäminen kesken nousun katkaisee automaation ensin.
  viritin.asetaVoimakkuus(0.4);
  const nupinJalkeen = gain.kutsut.at(-3);
  assert.ok(
    nupinJalkeen[0] === 'pidatys' || nupinJalkeen[0] === 'peru',
    'voimakkuuden muutos ei katkaissut kesken olevaa häivytystä',
  );

  // Lopetus katkaisee kesken olevan nousun ENNEN laskun ajoittamista.
  viritin.lopeta(0.6);
  const laskunKohta = gain.kutsut.findLastIndex((k) => k[0] === 'kayra');
  assert.equal(kayria(), 2, 'lopetus ajoitti muutakin kuin yhden laskun');
  const edeltava = gain.kutsut[laskunKohta - 1];
  assert.ok(
    edeltava && (edeltava[0] === 'pidatys' || edeltava[0] === 'peru'),
    'laskua ei edeltänyt automaation katkaisu',
  );
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

/* ═══════════════════════════════════════════════════════════════════════
 * KUULUUKO SE OIKEASTI? — automaation arvo, ei pelkkä kutsujen luettelo
 * ═══════════════════════════════════════════════════════════════════════
 *
 * MIKSI TÄMÄ ON OMA OSANSA JA MIKSI SE ON OLEMASSA.
 *
 * Omistaja 4.8.2026: "viritysääni on hävinnyt kokonaan." Kaikki tämän
 * tiedoston testit menivät silti läpi — ne tarkistivat, että rampit ja
 * käyrät AJOITETAAN, eivät sitä, mihin arvoon ne johtavat. Ero on koko
 * juttu: yksikin peruminen väärässä kohdassa pyyhkii juuri ajoitetun
 * käyrän, ja jäljelle jää täydellinen luettelo kutsuja, joiden lopputulos
 * on hiljaisuus.
 *
 * Alla oleva `aikajanaParam` on siksi eri eläin kuin tiedoston alun
 * `param`: se ei kirjaa kutsuja vaan TOTEUTTAA ne, ja osaa kertoa
 * parametrin arvon millä tahansa hetkellä. Sen säännöt ovat Web Audion
 * spesifikaatiosta, ja kaksi niistä on tässä tärkeitä:
 *
 *   1. Parametrilla on pohja-arvo (`value`), johon se palaa, jos yhtään
 *      voimassa olevaa tapahtumaa ei ole. Virittimellä pohja on HILJAA.
 *   2. cancelScheduledValues(t) poistaa tapahtumat hetkestä t alkaen — ja
 *      setValueCurve-tapahtuman KOKONAAN, jos t osuu käyrän sisään.
 *
 * Juuri näiden kahden yhdistelmä oli vika: cancelAndHoldAtTime jätti
 * pidätysarvon hetkeen t, ja heti perässä kutsuttu cancelScheduledValues(t)
 * vei sen mennessään. Arvo putosi pohjaan eli hiljaisuuteen.
 */

/**
 * Automaatioparametri, joka laskee arvonsa niin kuin selain.
 *
 * @param {() => number} kello äänikellon lukija (ctx.currentTime)
 * @param {number} pohja parametrin oma arvo ilman automaatiota
 */
function aikajanaParam(kello, pohja = 0) {
  const p = {
    pohja,
    tapahtumat: [],
    kutsut: [],
  };

  const lisaa = (tapahtuma) => {
    p.tapahtumat.push(tapahtuma);
    p.tapahtumat.sort((a, b) => a.aika - b.aika);
  };

  p.setValueAtTime = function set(arvo, aika) {
    p.kutsut.push(['set', arvo, aika]);
    lisaa({ laji: 'set', arvo, aika });
    return p;
  };
  p.linearRampToValueAtTime = function lin(arvo, aika) {
    p.kutsut.push(['lin', arvo, aika]);
    lisaa({ laji: 'lin', arvo, aika });
    return p;
  };
  p.exponentialRampToValueAtTime = function exp(arvo, aika) {
    p.kutsut.push(['exp', arvo, aika]);
    lisaa({ laji: 'exp', arvo, aika });
    return p;
  };
  p.setValueCurveAtTime = function curve(kayra, aika, kesto) {
    // Selain heittää, jos käyrän ajalle osuu jo tapahtuma. Tynkä tekee
    // samoin, jotta väärä katkaisujärjestys näkyy tässä eikä vasta korvassa.
    const paallekkain = p.tapahtumat.some((e) => e.aika >= aika && e.aika <= aika + kesto);
    if (paallekkain) {
      const virhe = new Error('setValueCurveAtTime: päällekkäinen tapahtuma');
      virhe.name = 'NotSupportedError';
      throw virhe;
    }
    p.kutsut.push(['kayra', Array.from(kayra), aika, kesto]);
    lisaa({ laji: 'kayra', kayra: Array.from(kayra), aika, kesto });
    return p;
  };
  p.cancelScheduledValues = function peru(aika) {
    p.kutsut.push(['peru', aika]);
    p.tapahtumat = p.tapahtumat.filter((e) => {
      if (e.laji === 'kayra') return !(aika >= e.aika && aika <= e.aika + e.kesto) && e.aika < aika;
      return e.aika < aika;
    });
    return p;
  };
  p.cancelAndHoldAtTime = function hold(aika) {
    p.kutsut.push(['pidatys', aika]);
    const arvo = p.arvoHetkella(aika);
    p.tapahtumat = p.tapahtumat.filter((e) => e.aika < aika);
    lisaa({ laji: 'set', arvo, aika });
    return p;
  };

  /** Parametrin arvo hetkellä t, spesifikaation sääntöjen mukaan. */
  p.arvoHetkella = function arvoHetkella(t) {
    const menneet = p.tapahtumat.filter((e) => e.aika <= t);
    const viimeinen = menneet[menneet.length - 1] ?? null;

    // Käyrä käynnissä: interpoloidaan sen sisältä.
    if (viimeinen?.laji === 'kayra') {
      const { kayra, aika, kesto } = viimeinen;
      if (t >= aika + kesto) return kayra[kayra.length - 1];
      const osuus = kesto > 0 ? (t - aika) / kesto : 1;
      const kohta = osuus * (kayra.length - 1);
      const i = Math.min(kayra.length - 2, Math.floor(kohta));
      return kayra[i] + (kayra[i + 1] - kayra[i]) * (kohta - i);
    }

    const lahtoArvo = viimeinen ? viimeinen.arvo : p.pohja;
    const lahtoAika = viimeinen ? viimeinen.aika : 0;

    // Menossa oleva ramppi kohti seuraavaa tapahtumaa.
    const seuraava = p.tapahtumat.find((e) => e.aika > t);
    if (seuraava && (seuraava.laji === 'lin' || seuraava.laji === 'exp')) {
      const matka = seuraava.aika - lahtoAika;
      const osuus = matka > 0 ? (t - lahtoAika) / matka : 1;
      if (seuraava.laji === 'lin') return lahtoArvo + (seuraava.arvo - lahtoArvo) * osuus;
      const a = Math.max(lahtoArvo, 1e-7);
      const b = Math.max(seuraava.arvo, 1e-7);
      return a * ((b / a) ** osuus);
    }
    return lahtoArvo;
  };

  Object.defineProperty(p, 'value', {
    get() { return p.arvoHetkella(kello()); },
    set(arvo) { p.pohja = arvo; },
  });
  return p;
}

/** Tynkäkonteksti, jonka vahvistimet laskevat arvonsa oikeasti. */
function aikajanaContext() {
  const ctx = tynkaContext({ kayrat: true });
  ctx.createGain = () => {
    const solmu = {
      laji: 'gain',
      gain: aikajanaParam(() => ctx.currentTime, 1),
      connect(kohde) { return kohde; },
      disconnect() { ctx.irrotetut.push('gain'); },
    };
    ctx.luodut.push(solmu);
    return solmu;
  };
  return ctx;
}

/** Virittimen ulostulon arvot annetuilla hetkillä. */
function tasot(ctx, hetket) {
  const gain = ulostulo(ctx);
  return hetket.map((t) => gain.arvoHetkella(t));
}

test('viritysääni nousee oikeasti kuuluviin eikä vain ajoita ramppeja', () => {
  const ctx = aikajanaContext();
  const kohde = { type: 'kohde', connect: (k) => k, disconnect() {} };
  const viritin = teeViritin(ctx, { kohde, mykistetty: () => false, voimakkuus: 1 });
  assert.equal(viritin.aloita(0.6), true);

  // TÄMÄ ON SE TARKISTUS, JOKA PUUTTUI: gainin on oltava jossain kohtaa
  // selvästi nollaa suurempi. Pelkkä "rampit on ajoitettu" meni läpi
  // silloinkin, kun peruminen oli pyyhkinyt ne ja arvo jäi pohjaan.
  const nousu = tasot(ctx, [0, 0.15, 0.3, 0.45, 0.6, 1.2]);
  const huippu = Math.max(...nousu);
  assert.ok(
    huippu > 0.5,
    `viritysääni ei noussut kuuluviin: gainin huippu oli ${huippu} (arvot ${nousu.join(', ')})`,
  );
  assert.ok(nousu[0] <= 0.001, `kohina alkoi tasolta ${nousu[0]}`);
  // Nousu on yksitoikkoinen: ei kuoppaa vaihdon keskellä.
  for (let i = 1; i < 5; i++) {
    assert.ok(nousu[i] > nousu[i - 1], `nousu notkahti kohdassa ${i}: ${nousu.join(', ')}`);
  }
  // Häivytyksen jälkeen taso pysyy ylhäällä eikä valu takaisin pohjaan.
  assert.ok(nousu[5] > 0.5, `kohina vaikeni häivytyksen jälkeen tasolle ${nousu[5]}`);

  // Ja lopussa se palaa hiljaisuuteen eikä jää roikkumaan.
  ctx.currentTime = 1.2;
  viritin.lopeta(0.6);
  const lasku = tasot(ctx, [1.2, 1.5, 1.8, 2.4]);
  assert.ok(lasku[0] > 0.5, `lasku alkoi tasolta ${lasku[0]}`);
  assert.ok(
    lasku.at(-1) <= 0.01,
    `viritysääni jäi roikkumaan tasolle ${lasku.at(-1)} (arvot ${lasku.join(', ')})`,
  );
});

test('nupin vääntäminen kesken häivytyksen ei vaienna viritystä', () => {
  // Tässä vika oli: asetaVoimakkuus luki lähtöarvon VASTA katkaisun
  // jälkeen, jolloin se sai pohja-arvon HILJAA ja kohina putosi
  // hiljaisuuteen keskellä nousuaan.
  const ctx = aikajanaContext();
  const kohde = { type: 'kohde', connect: (k) => k, disconnect() {} };
  const viritin = teeViritin(ctx, { kohde, mykistetty: () => false, voimakkuus: 1 });
  viritin.aloita(0.6);

  ctx.currentTime = 0.3;
  const ennen = ulostulo(ctx).arvoHetkella(0.3);
  assert.ok(ennen > 0.3, `häivytys ei ollut käynnissä (taso ${ennen})`);
  viritin.asetaVoimakkuus(0.5);

  const jalkeen = tasot(ctx, [0.3, 0.32, 0.35, 0.38, 0.5]);
  const pohja = Math.min(...jalkeen);
  assert.ok(
    pohja > ennen * 0.4,
    `nupin vääntö pudotti kohinan tasolle ${pohja} (ennen ${ennen}, arvot ${jalkeen.join(', ')})`,
  );
  viritin.lopeta(0.25);
});

test('lopetus kesken nousun ei jätä ääntä päälle', () => {
  // Asema voi lukittua ennen kuin sisäänhäivytys on ohi. Silloin lasku
  // ajoitetaan kesken nousevan käyrän, ja juuri siinä kohdassa väärä
  // katkaisu joko heittää poikkeuksen tai jättää gainin ylös.
  const ctx = aikajanaContext();
  const kohde = { type: 'kohde', connect: (k) => k, disconnect() {} };
  const viritin = teeViritin(ctx, { kohde, mykistetty: () => false, voimakkuus: 1 });
  viritin.aloita(0.6);
  ctx.currentTime = 0.25;
  assert.doesNotThrow(() => viritin.lopeta(0.6));
  const lasku = tasot(ctx, [0.25, 0.55, 0.85, 1.2]);
  assert.ok(lasku[0] > 0.1, `lasku alkoi tasolta ${lasku[0]}`);
  assert.ok(
    lasku.at(-1) <= 0.01,
    `viritys jäi soimaan tasolle ${lasku.at(-1)} (arvot ${lasku.join(', ')})`,
  );
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
