// Peliäänet syntetisoituna Web Audio API:lla — ei äänitiedostoja, joten peli
// pysyy kevyenä ja toimii myös offline.
//
// Selaimet vaativat käyttäjän eleen ennen äänen toistoa, joten AudioContext
// luodaan vasta ensimmäisen napautuksen yhteydessä.

const STORAGE_KEY = 'afrikan-tahti-sound';

import { valittuAani } from './aani-ehdokkaat.js';

// Ambienssin ristihäivytys ja tapahtumien väli. Väli on tarkoituksella pitkä
// ja epäsäännöllinen: säännöllinen ääni alkaa kuulua kellona.
const AMBIENCE_FADE = 2;
const AMBIENCE_EVENT_MIN = 8000;
const AMBIENCE_EVENT_MAX = 30000;

class Sound {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.noise = null;
    this.ambience = null;
    this.ambienceType = null;
    this.enabled = this.loadSetting();
  }

  loadSetting() {
    try {
      return localStorage.getItem(STORAGE_KEY) !== 'off';
    } catch {
      return true;
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
    } catch {
      /* tallennus ei ole välttämätöntä */
    }
    if (enabled) this.play('click');
    else this.setAmbience(null);
  }

  /** Luo äänikontekstin ensimmäisellä kerralla ja herättää sen tarvittaessa. */
  ensureContext() {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      this.ctx = new Ctx();

      // Masteriketju: kaikki äänet → kompressori → ulos. Kompressori pitää
      // päällekkäiset äänet kasassa ilman että kokonaisvoimakkuus nousee.
      // Hillitty kokonaistaso: syntetisoitu ääni antaa anteeksi paljon
      // enemmän hiljaisena kuin kovana.
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.24;
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -20;
      comp.knee.value = 26;
      comp.ratio.value = 3;
      comp.attack.value = 0.006;
      comp.release.value = 0.22;
      this.master.connect(comp).connect(this.ctx.destination);

      // Tila: pieni generoitu kaiku, jonka läpi kaikki äänet kulkevat
      // rinnakkain kuivan signaalin kanssa. Tämä on suurin yksittäinen
      // parannus — ilman sitä äänet kuulostavat siltä, että ne syntyvät
      // korvan sisällä eivätkä huoneessa.
      this.dry = this.ctx.createGain();
      this.dry.gain.value = 0.82;
      this.wet = this.ctx.createGain();
      this.wet.gain.value = 0.18;
      this.reverb = this.ctx.createConvolver();
      this.reverb.buffer = this.makeImpulse(1.2);
      this.dry.connect(this.master);
      this.wet.connect(this.reverb).connect(this.master);
      // Äänet kytketään tähän: se haaroittaa kuivaan ja märkään.
      this.bus = this.ctx.createGain();
      this.bus.connect(this.dry);
      this.bus.connect(this.wet);

      // Yhden sekunnin valkoinen kohina, jota käytetään uudelleen kaikissa äänissä.
      const frames = this.ctx.sampleRate;
      this.noise = this.ctx.createBuffer(1, frames, this.ctx.sampleRate);
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;

      // Oikeat äänitteet (noppa, kynä) latautuvat taustalla.
      this.loadRealSamples();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    return this.ctx;
  }

  /**
   * Kaiun impulssivaste: eksponentiaalisesti vaimeneva kohinapulssi.
   * Ei äänitiedostoa, joten standalone ja offline pysyvät kevyinä.
   */
  makeImpulse(seconds) {
    const rate = this.ctx.sampleRate;
    const frames = Math.floor(rate * seconds);
    const buf = this.ctx.createBuffer(2, frames, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < frames; i++) {
        // Loppuosa vaimenee jyrkemmin, jotta häntä ei jää soimaan.
        const vaimennus = (1 - i / frames) ** 3.2;
        data[i] = (Math.random() * 2 - 1) * vaimennus;
      }
    }
    return buf;
  }

  /**
   * Pieni satunnaisheitto vireeseen ja voimakkuuteen. Ilman tätä sama ääni
   * kymmenennellä kerralla alkaa kuulostaa koneelta. Math.random käy: äänet
   * eivät ole pelitilaa eivätkä vaikuta tallennukseen.
   */
  jitter(arvo, osuus = 0.03) {
    return arvo * (1 + (Math.random() * 2 - 1) * osuus);
  }

  // --- perusäänet ---------------------------------------------------------

  tone({ freq = 440, to = null, dur = 0.2, type = 'sine', gain = 0.2, attack = 0.006, delay = 0 }) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    const f0 = this.jitter(freq);
    osc.frequency.setValueAtTime(f0, t0);
    if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(this.jitter(to), 20), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(this.jitter(gain), t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(this.bus);
    osc.start(t0);
    osc.stop(t0 + dur + 0.06);
  }

  hiss({
    dur = 0.2, gain = 0.15, type = 'bandpass', freq = 1200, sweepTo = null, q = 1, delay = 0,
  }) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.Q.value = q;
    filter.frequency.setValueAtTime(this.jitter(freq), t0);
    if (sweepTo) filter.frequency.exponentialRampToValueAtTime(Math.max(sweepTo, 40), t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(this.jitter(gain), t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filter).connect(g).connect(this.bus);
    src.start(t0);
    src.stop(t0 + dur + 0.06);
  }


  /**
   * Resonoiva kopsahdus: lyhyt kohinapurske useamman kaistanpäästön läpi.
   * Suodattimien taajuudet ovat esineen ominaistaajuuksia, joten sama
   * rakenne kuulostaa puulta tai metallilta pelkillä luvuilla.
   */
  knock({ freqs = [180, 290, 430], dur = 0.16, gain = 0.2, q = 9, delay = 0 }) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    for (const [i, freq] of freqs.entries()) {
      const src = ctx.createBufferSource();
      src.buffer = this.noise;
      src.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = this.jitter(freq);
      f.Q.value = q;
      const g = ctx.createGain();
      // Ylemmät osasävelet vaimenevat nopeammin, kuten oikeassa esineessä.
      const kesto = dur * (1 - i * 0.22);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(this.jitter(gain / (i + 1.4)), t0 + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + Math.max(kesto, 0.03));
      src.connect(f).connect(g).connect(this.bus);
      src.start(t0);
      src.stop(t0 + dur + 0.06);
    }
  }

  /**
   * Soittorasian kello: epäharmoniset osasävelet omilla vaimenemisillaan.
   * Juuri epäharmonisuus tekee äänestä kellon eikä pillin.
   */
  bell({ freq = 880, dur = 1.1, gain = 0.12, delay = 0 }) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    // Kellon klassiset suhteet: perusääni, pieni desimi, kaksoisoktaavi.
    for (const [kerroin, osuus, kestoOsuus] of [[1, 1, 1], [2.76, 0.5, 0.62], [5.4, 0.28, 0.38]]) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = this.jitter(freq * kerroin);
      const g = ctx.createGain();
      const kesto = dur * kestoOsuus;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(this.jitter(gain * osuus), t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + kesto);
      osc.connect(g).connect(this.bus);
      osc.start(t0);
      osc.stop(t0 + kesto + 0.06);
    }
  }

  /** Metallinen kilahdus: FM-synteesi nopealla vaimennuksella. */
  ding({ freq = 1200, ratio = 3.5, index = 500, dur = 0.4, gain = 0.12, delay = 0 }) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const carrier = ctx.createOscillator();
    carrier.frequency.value = this.jitter(freq);
    const mod = ctx.createOscillator();
    mod.frequency.value = this.jitter(freq * ratio);
    const modGain = ctx.createGain();
    // Moduloinnin syvyys romahtaa nopeasti: siitä syntyy metallin kirkas isku.
    modGain.gain.setValueAtTime(index, t0);
    modGain.gain.exponentialRampToValueAtTime(1, t0 + dur * 0.4);
    mod.connect(modGain).connect(carrier.frequency);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(this.jitter(gain), t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    carrier.connect(g).connect(this.bus);
    carrier.start(t0); mod.start(t0);
    carrier.stop(t0 + dur + 0.06); mod.stop(t0 + dur + 0.06);
  }

  /**
   * Potkurihurina lennon ajaksi: saha-aalto alipäästön läpi, ja LFO moduloi
   * voimakkuutta lapojen tahtiin. Soi kunnes stopFlight kutsutaan.
   */
  startFlight(kestoMs = 4800) {
    const ctx = this.ensureContext();
    if (!ctx || this.flightNodes) return;
    const t0 = ctx.currentTime;
    const kesto = kestoMs / 1000;

    // Oikea moottoriäänitys, jos se on ehditty ladata: lentoonlähtö
    // matkustamosta kuultuna. Ilman verkkoa soi syntetisoitu kone.
    const jet = this.samples?.jet;
    if (jet) {
      const src = ctx.createBufferSource();
      src.buffer = jet;
      src.loop = true; // lyhyempikin äänite kantaa koko kohtauksen yli
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.5, t0 + 0.9);
      g.gain.setValueAtTime(0.5, t0 + Math.max(1, kesto - 1));
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + kesto);
      src.connect(g).connect(this.bus);
      // Pitkissä äänityksissä alku on lähestymistä ja odottelua —
      // hypätään suoraan lennon ytimeen (omistajan ohje: ~25 s kohdalta).
      const alku = jet.duration > 40 ? 25 : 0;
      // Jos kohtaus venyy äänitettä pidemmäksi, silmukka palaa samaan
      // kohtaan eikä äänitteen hiljaiseen alkuun.
      src.loopStart = alku;
      src.loopEnd = jet.duration;
      src.start(t0, alku);
      src.stop(t0 + kesto + 0.1);
      this.flightNodes = { lahteet: [src], vaimennukset: [g] };
      src.onended = () => {
        if (this.flightNodes?.lahteet?.includes(src)) this.flightNodes = null;
      };
      return;
    }

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(this.jitter(84), t0);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(400, t0);
    lp.Q.value = 1.2;

    // Lapojen isku: ~14 Hz voimakkuusmodulaatio.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = this.jitter(14);
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.35;
    const depth = ctx.createGain();
    depth.gain.value = 0.65;
    lfo.connect(lfoGain).connect(depth.gain);

    // Nousee ja laskee kohtauksen mukana.
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.075, t0 + 0.5);
    g.gain.setValueAtTime(0.075, t0 + kesto - 0.8);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + kesto);

    // Moottorin virtausääni potkurin alle: kohinaa kaistanpäästön läpi,
    // taajuus nousee lähdössä ja laskee laskeutuessa. Tämä tekee lennosta
    // koneen — pelkkä saha-aalto kuulosti hyttyseltä.
    const virtaus = ctx.createBufferSource();
    virtaus.buffer = this.noise;
    virtaus.loop = true;
    const vf = ctx.createBiquadFilter();
    vf.type = 'bandpass';
    vf.Q.value = 0.5;
    vf.frequency.setValueAtTime(600, t0);
    vf.frequency.exponentialRampToValueAtTime(1600, t0 + kesto * 0.4);
    vf.frequency.exponentialRampToValueAtTime(500, t0 + kesto);
    const vg = ctx.createGain();
    vg.gain.setValueAtTime(0.0001, t0);
    vg.gain.exponentialRampToValueAtTime(0.055, t0 + 0.7);
    vg.gain.setValueAtTime(0.055, t0 + kesto - 0.9);
    vg.gain.exponentialRampToValueAtTime(0.0001, t0 + kesto);

    // Matala jyrinä pohjalle.
    const runko = ctx.createBufferSource();
    runko.buffer = this.noise;
    runko.loop = true;
    const rf = ctx.createBiquadFilter();
    rf.type = 'lowpass';
    rf.frequency.value = 180;
    const rg = ctx.createGain();
    rg.gain.setValueAtTime(0.0001, t0);
    rg.gain.exponentialRampToValueAtTime(0.06, t0 + 0.6);
    rg.gain.setValueAtTime(0.06, t0 + kesto - 0.9);
    rg.gain.exponentialRampToValueAtTime(0.0001, t0 + kesto);

    osc.connect(lp).connect(depth).connect(g).connect(this.bus);
    virtaus.connect(vf).connect(vg).connect(this.bus);
    runko.connect(rf).connect(rg).connect(this.bus);
    osc.start(t0); lfo.start(t0); virtaus.start(t0); runko.start(t0);
    osc.stop(t0 + kesto + 0.1); lfo.stop(t0 + kesto + 0.1);
    virtaus.stop(t0 + kesto + 0.1); runko.stop(t0 + kesto + 0.1);
    this.flightNodes = { lahteet: [osc, lfo, virtaus, runko], vaimennukset: [g, vg, rg] };
    // Siivotaan itsestään, jos stopFlight jää kutsumatta.
    osc.onended = () => {
      if (this.flightNodes?.lahteet?.includes(osc)) this.flightNodes = null;
    };
  }

  /** Lopettaa moottoriäänen pehmeästi. */
  stopFlight() {
    const solmut = this.flightNodes;
    if (!solmut || !this.ctx) return;
    this.flightNodes = null;
    const t = this.ctx.currentTime;
    try {
      for (const gain of solmut.vaimennukset) {
        gain.gain.cancelScheduledValues(t);
        gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      }
      for (const src of solmut.lahteet) src.stop(t + 0.4);
    } catch {
      /* solmu oli jo pysäytetty */
    }
  }


  // --- ambienssi ------------------------------------------------------------
  //
  // Hiljainen taustaäänimaisema, joka vaihtuu kohteen mukaan. Rakenne on
  // kaikilla tyypeillä sama: jatkuva pohja (suodatettua kohinaa hitailla
  // LFO:illa) ja sen päällä satunnaisia tapahtumia epäsäännöllisin välein.
  // Kaikki on tarkoituksella hyvin hiljaista — ambienssin kuuluu huomata
  // vasta kun se lakkaa.

  /**
   * Vaihtaa äänimaiseman ristihäivytyksellä. `null` sammuttaa.
   * Sama tyyppi uudelleen ei tee mitään, jotta maisema ei nykäise
   * jokaisella renderöinnillä.
   */
  setAmbience(type) {
    if (type === this.ambienceType) return;
    this.ambienceType = type ?? null;

    const ctx = this.ensureContext();
    if (!ctx) return;

    // Vanha häivytetään pois ja puretaan vasta sen jälkeen.
    if (this.ambience) this.fadeOutAmbience(this.ambience);
    this.ambience = null;
    if (!type || !AMBIENCES[type]) return;

    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, ctx.currentTime);
    out.gain.exponentialRampToValueAtTime(1, ctx.currentTime + AMBIENCE_FADE);
    out.connect(this.bus);

    const maisema = { out, nodes: [], timer: null, type };
    this.ambience = maisema;
    AMBIENCES[type](this, maisema);
    this.scheduleAmbienceEvent(maisema);
  }

  /** Häivyttää ja purkaa yhden maiseman. */
  fadeOutAmbience(maisema) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    clearTimeout(maisema.timer);
    maisema.timer = null;
    maisema.loppuu = true;
    try {
      maisema.out.gain.cancelScheduledValues(t);
      maisema.out.gain.setValueAtTime(Math.max(maisema.out.gain.value, 0.0001), t);
      maisema.out.gain.exponentialRampToValueAtTime(0.0001, t + AMBIENCE_FADE);
    } catch {
      /* solmu oli jo purettu */
    }
    for (const n of maisema.nodes) {
      try { n.stop(t + AMBIENCE_FADE + 0.1); } catch { /* jo pysäytetty */ }
    }
  }

  /**
   * Jatkuva pohja: kohinaa suodattimen läpi, ja hidas LFO liikuttaa
   * voimakkuutta niin ettei ääni ole tasainen seinä.
   */
  ambienceBed(maisema, { type = 'lowpass', freq = 500, q = 0.7, gain = 0.04, lfoHz = 0.08, lfoDepth = 0.5 }) {
    const ctx = this.ctx;
    const t0 = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.value = gain;

    // Hidas huojunta: puuskia ja laantumista.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = lfoHz;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = gain * lfoDepth;
    lfo.connect(lfoGain).connect(g.gain);

    src.connect(f).connect(g).connect(maisema.out);
    src.start(t0);
    lfo.start(t0);
    maisema.nodes.push(src, lfo);
  }

  /** Ajastaa seuraavan satunnaisen tapahtuman epäsäännöllisen välin päähän. */
  scheduleAmbienceEvent(maisema) {
    if (maisema.loppuu) return;
    const viive = AMBIENCE_EVENT_MIN + Math.random() * (AMBIENCE_EVENT_MAX - AMBIENCE_EVENT_MIN);
    maisema.timer = setTimeout(() => {
      if (maisema.loppuu || this.ambience !== maisema) return;
      const tapahtuma = AMBIENCE_EVENTS[maisema.type];
      if (tapahtuma) {
        try { tapahtuma(this, maisema); } catch { /* ei saa kaataa peliä */ }
      }
      this.scheduleAmbienceEvent(maisema);
    }, viive);
    // Ajastin ei saa pitää Nodea hereillä testeissä.
    if (maisema.timer && typeof maisema.timer.unref === 'function') maisema.timer.unref();
  }

  /** Lyhyt ambienssiääni maiseman omaan ulostuloon (ei kaikubussiin suoraan). */
  ambienceHit({ maisema, freq = 800, dur = 0.5, gain = 0.02, type = 'bandpass', q = 4, sweepTo = null }) {
    const ctx = this.ctx;
    if (!ctx || maisema.loppuu) return;
    const t0 = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(this.jitter(freq), t0);
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(Math.max(sweepTo, 40), t0 + dur);
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(this.jitter(gain), t0 + dur * 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f).connect(g).connect(maisema.out);
    src.start(t0);
    src.stop(t0 + dur + 0.05);
  }

  /** Lyhyt sävelambienssi: linnut, kulkuset ja vastaavat. */
  ambienceTone({ maisema, freq = 900, to = null, dur = 0.3, gain = 0.02, type = 'sine', delay = 0 }) {
    const ctx = this.ctx;
    if (!ctx || maisema.loppuu) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(this.jitter(freq), t0);
    if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(this.jitter(to), 20), t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(this.jitter(gain), t0 + dur * 0.2);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(maisema.out);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  // --- pelin äänet --------------------------------------------------------

  play(name) {
    if (!this.enabled) return;
    // Oikea äänite ensin, jos se on ladattu; muuten syntetisoitu versio.
    const real = REAL_PLAYERS[name];
    if (real && real(this)) return;
    const sound = SOUNDS[name];
    if (sound) sound(this);
  }

  /**
   * Lataa oikeat äänitteet WebAudio-puskureiksi taustalla. Kutsutaan
   * kerran, kun äänikonteksti syntyy. Epäonnistunut lataus (offline) ei
   * haittaa: play() palaa synteesiin niin kauan kuin puskuria ei ole.
   */
  loadRealSamples() {
    if (this.samples) return;
    this.samples = {};
    this.sampleHits = {};
    for (const [name, { url }] of Object.entries(REAL_SAMPLES)) {
      // Omistajan valitsema äänite (/aanet.html) ohittaa oletuksen;
      // tyhjä valinta jättää synteesin voimaan.
      const valinta = valittuAani(`tehoste:${name}`);
      if (valinta === '') continue;
      // Ilman oletusta (url null) ladataan vain, jos omistaja on valinnut
      // äänen viritysivulta.
      if (!(valinta ?? url)) continue;
      fetch(valinta ?? url)
        .then((res) => (res.ok ? res.arrayBuffer() : Promise.reject(new Error('http'))))
        .then((data) => this.ctx.decodeAudioData(data))
        .then((buf) => {
          this.samples[name] = buf;
          this.sampleHits[name] = this.findHits(buf);
        })
        .catch(() => { /* ei verkkoa — synteesi kelpaa */ });
    }
  }

  /**
   * Etsii äänitteestä iskukohdat (esim. kirjoituskoneen näppäilyt tai
   * nopan kopsahdukset): kohdat, joissa taso ylittää osan äänitteen
   * huipusta. Satunnainen siivu osui usein iskujen väliseen hiljaisuuteen,
   * jolloin ääntä ei kuulunut — iskulistalta siivu osuu aina.
   */
  findHits(buf, { kynnys = 0.3, valiMs = 100 } = {}) {
    const data = buf.getChannelData(0);
    const rate = buf.sampleRate;
    const vali = Math.floor(rate * (valiMs / 1000));
    let huippu = 0;
    for (let i = 0; i < data.length; i += 16) huippu = Math.max(huippu, Math.abs(data[i]));
    const raja = huippu * kynnys;
    const iskut = [];
    for (let i = 0; i < data.length; i += 8) {
      if (Math.abs(data[i]) >= raja) {
        iskut.push(Math.max(0, i / rate - 0.005));
        i += vali;
      }
    }
    return iskut;
  }

  /**
   * Soittaa satunnaisen siivun äänitteestä masterketjun läpi. Siivut
   * otetaan äänitteen keskiosasta (20–80 %), jottei osuta alun tai lopun
   * hiljaisuuteen; `tail` soittaa äänitteen lopun (esim. nopan asettuminen).
   * Palauttaa false, jos puskuria ei ole ladattu — silloin soi synteesi.
   */
  playSlice(name, {
    dur = 0.1, gain = 0.3, tail = null, alusta = false, isku = false, delay = 0, tasavire = false,
  } = {}) {
    const ctx = this.ensureContext();
    const buf = this.samples?.[name];
    if (!ctx || !buf) return false;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    // Vireheitto elävöittää kolahduksia, mutta vääristää mekaanisia ääniä
    // (kirjoituskone kuulosti sen kanssa oudolta).
    src.playbackRate.value = tasavire ? 1 : this.jitter(1, 0.05);
    const kesto = tail ?? dur;
    const iskut = isku ? this.sampleHits?.[name] : null;
    const alku = tail != null
      ? Math.max(0, buf.duration - tail - 0.15)
      : alusta
        ? 0
        : iskut?.length
          ? iskut[Math.floor(Math.random() * iskut.length)]
          : buf.duration * 0.2 + Math.random() * Math.max(0.01, buf.duration * 0.6 - dur);
    // Pehmeä alku ja loppu, ettei leikkauskohta naksu.
    const g = ctx.createGain();
    const t0 = ctx.currentTime + delay;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
    g.gain.setValueAtTime(gain, t0 + Math.max(0.02, kesto - 0.04));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + kesto);
    src.connect(g).connect(this.bus);
    src.start(t0, alku, kesto + 0.03);
    return true;
  }
}

// Oikeat äänitteet Freesoundista (CC0). Ladataan verkosta puskuriin;
// ilman verkkoa vastaava syntetisoitu ääni soi entiseen tapaan.
const REAL_SAMPLES = {
  dice: {
    url: 'https://cdn.freesound.org/previews/94/94031_1554038-lq.mp3',
    credit: '"Dice Roll" — LoafDV, Freesound (CC0)',
  },
  // Kirjoituskoneen yksittäinen näppäinlyönti: edellisessä äänityksessä
  // naputus alkoi vasta ~20 sekunnin kohdalla, joten iskuntunnistus
  // poimi rullan rahinaa. Tässä klipissä on pelkkiä lyöntejä.
  pen: {
    url: 'https://cdn.freesound.org/previews/856/856165_18901108-lq.mp3',
    credit: '"Vintage Typewriter Key Press" — brktkrgll, Freesound (CC0)',
  },
  // Potkurikoneen ylilento — omistajan viritysivulta valitsema
  // lentokohtauksen moottoriääni.
  jet: {
    url: 'https://cdn.freesound.org/previews/315/315660_2506497-lq.mp3',
    credit: '"ATR 72 flyover" — Hoscalegeek, Freesound (CC0)',
  },
  // Sivunkääntö: kysymyskortti avautuu kuin päiväkirjan sivu.
  quizOpen: {
    url: 'https://cdn.freesound.org/previews/842/842183_13307919-lq.mp3',
    credit: '"Page Turn Free" — AardsReal, Freesound (CC0)',
  },
  // ElevenLabs-efektipilotit: ei oletusta (url: null) — syntetisoitu soi,
  // kunnes omistaja valitsee äänen viritysivulta. Tiedostot ovat repossa.
  click: { url: null, credit: 'ElevenLabs SFX -pilotti' },
  paper: { url: null, credit: 'ElevenLabs SFX -pilotti' },
  coin: { url: null, credit: 'ElevenLabs SFX -pilotti' },
  correct: { url: null, credit: 'ElevenLabs SFX -pilotti' },
  wrong: { url: null, credit: 'ElevenLabs SFX -pilotti' },
};

// Mitkä äänet soivat oikeasta äänitteestä ja miten siivu otetaan.
const REAL_PLAYERS = {
  dieTick: (s) => s.playSlice('dice', { dur: 0.08, gain: 0.4, isku: true }),
  dieLand: (s) => s.playSlice('dice', { tail: 0.6, gain: 0.55 }),
  // Yksi kunnollinen lyönti sanan ilmestymishetkellä: siivu alkaa aina
  // iskukohdasta ja on tarpeeksi pitkä, että lyönnin sointi kuuluu —
  // lyhyet pätkät eivät kuulostaneet kirjoituskoneelta. Rytmi tulee
  // tekstin kirjoittumisesta (typeText), ei purskeista.
  pen: (s) => s.playSlice('pen', { dur: 0.24, gain: 0.35, isku: true, tasavire: true }),
  // Sivunkääntö soi alusta, ei siivuna — se on yksi ele.
  quizOpen: (s) => s.playSlice('quizOpen', { dur: 1.1, gain: 0.4, alusta: true }),
  // Generoidut yksittäisefektit soivat aina alusta kokonaisina.
  click: (s) => s.playSlice('click', { dur: 0.5, gain: 0.35, alusta: true }),
  paper: (s) => s.playSlice('paper', { dur: 1.2, gain: 0.35, alusta: true }),
  coin: (s) => s.playSlice('coin', { dur: 1.3, gain: 0.4, alusta: true }),
  correct: (s) => s.playSlice('correct', { dur: 1.5, gain: 0.4, alusta: true }),
  wrong: (s) => s.playSlice('wrong', { dur: 1.1, gain: 0.4, alusta: true }),
};


// --- äänimaisemat -----------------------------------------------------------
//
// Jokainen maisema on jatkuva pohja; tapahtumat ovat erikseen alla. Kaikki
// voimakkuudet ovat välillä 0,03–0,05: taustan kuuluu jäädä huomaamatta,
// kunnes se lakkaa.

const AMBIENCES = {
  // Aavikko: matala tuulen suhina, jossa pitkät puuskat.
  aavikko: (s, m) => {
    s.ambienceBed(m, { type: 'lowpass', freq: 420, gain: 0.045, lfoHz: 0.06, lfoDepth: 0.6 });
    s.ambienceBed(m, { type: 'bandpass', freq: 1100, q: 0.5, gain: 0.018, lfoHz: 0.11 });
  },
  // Meri: aallot paisuvat ja laantuvat hitaasti.
  meri: (s, m) => {
    s.ambienceBed(m, { type: 'lowpass', freq: 600, gain: 0.05, lfoHz: 0.13, lfoDepth: 0.75 });
    s.ambienceBed(m, { type: 'highpass', freq: 1800, gain: 0.012, lfoHz: 0.09 });
  },
  // Sademetsä: tiheä korkea sirinä ja kostea pohja.
  sademetsa: (s, m) => {
    s.ambienceBed(m, { type: 'bandpass', freq: 3600, q: 1.6, gain: 0.03, lfoHz: 0.22, lfoDepth: 0.35 });
    s.ambienceBed(m, { type: 'lowpass', freq: 300, gain: 0.03, lfoHz: 0.05 });
  },
  // Savanni: heinäsirkkojen kapea kaista ja kuiva tuuli.
  savanni: (s, m) => {
    s.ambienceBed(m, { type: 'bandpass', freq: 5200, q: 3.2, gain: 0.022, lfoHz: 0.3, lfoDepth: 0.5 });
    s.ambienceBed(m, { type: 'lowpass', freq: 500, gain: 0.032, lfoHz: 0.07 });
  },
  // Ylänkö: ohut viima, ei juuri muuta.
  ylanko: (s, m) => {
    s.ambienceBed(m, { type: 'highpass', freq: 900, gain: 0.03, lfoHz: 0.1, lfoDepth: 0.6 });
  },
  // Basaari: ei yritetä puhetta — vain matala hälypohja, jonka päälle tulee
  // kulkusia ja kavionkopsetta harvakseltaan.
  basaari: (s, m) => {
    s.ambienceBed(m, { type: 'bandpass', freq: 700, q: 0.8, gain: 0.035, lfoHz: 0.17, lfoDepth: 0.45 });
  },
};

// Satunnaiset tapahtumat maiseman päällä, 8–30 sekunnin välein.
const AMBIENCE_EVENTS = {
  // Hiekan rahinaa puuskassa.
  aavikko: (s, m) => s.ambienceHit({
    maisema: m, type: 'highpass', freq: 1800, sweepTo: 3400, dur: 1.6, gain: 0.022, q: 0.6,
  }),
  // Harva lokinhuuto: kaksi laskevaa säveltä.
  meri: (s, m) => {
    if (Math.random() < 0.55) {
      s.ambienceTone({ maisema: m, freq: 1500, to: 950, dur: 0.3, gain: 0.016, type: 'triangle' });
      s.ambienceTone({ maisema: m, freq: 1400, to: 900, dur: 0.26, gain: 0.013, type: 'triangle', delay: 0.42 });
    } else {
      s.ambienceHit({ maisema: m, type: 'lowpass', freq: 900, sweepTo: 300, dur: 2.4, gain: 0.03, q: 0.5 });
    }
  },
  // Vesipisara tai kaukainen linnun vihellys.
  sademetsa: (s, m) => {
    if (Math.random() < 0.5) {
      s.ambienceTone({ maisema: m, freq: 2400, to: 1300, dur: 0.09, gain: 0.02, type: 'sine' });
    } else {
      s.ambienceTone({ maisema: m, freq: 1900, to: 2600, dur: 0.22, gain: 0.014, type: 'sine' });
      s.ambienceTone({ maisema: m, freq: 2600, to: 1800, dur: 0.18, gain: 0.012, type: 'sine', delay: 0.24 });
    }
  },
  // Sirkkojen tiheys nousee hetkeksi.
  savanni: (s, m) => s.ambienceHit({
    maisema: m, type: 'bandpass', freq: 5600, dur: 2.2, gain: 0.016, q: 4,
  }),
  // Yksittäinen viiman kiihdytys.
  ylanko: (s, m) => s.ambienceHit({
    maisema: m, type: 'highpass', freq: 1200, sweepTo: 2600, dur: 2.8, gain: 0.018, q: 0.5,
  }),
  // Kulkunen tai kavionkopse.
  basaari: (s, m) => {
    if (Math.random() < 0.5) {
      for (let i = 0; i < 3; i++) {
        s.ambienceTone({
          maisema: m, freq: 2100 + i * 90, dur: 0.12, gain: 0.012, type: 'triangle', delay: i * 0.14,
        });
      }
    } else {
      for (let i = 0; i < 4; i++) {
        s.ambienceHit({ maisema: m, freq: 260, dur: 0.09, gain: 0.014, q: 7 });
      }
    }
  },
};

export const AMBIENCE_TYPES = Object.keys(AMBIENCES);

const SOUNDS = {
  // Käyttöliittymä
  // Kysymyskortin avaus ilman verkkoa: paperi ja pehmeä kello.
  quizOpen: (s) => {
    s.hiss({ dur: 0.4, type: 'highpass', freq: 800, sweepTo: 2400, gain: 0.07 });
    s.bell({ freq: 740, dur: 0.5, gain: 0.06, delay: 0.1 });
  },
  click: (s) => s.knock({ freqs: [540, 880], dur: 0.045, gain: 0.06, q: 8 }),
  paper: (s) => s.hiss({ dur: 0.34, type: 'highpass', freq: 900, sweepTo: 2800, gain: 0.075 }),
  // Kynän raapaisu pergamentilla — avaustekstin käsinkirjoitus. Hyvin
  // hiljainen, koska se toistuu joka sanalla.
  pen: (s) => s.hiss({ dur: 0.06, type: 'highpass', freq: 2600, sweepTo: 1500, gain: 0.02, q: 0.7 }),
  swipe: (s) => s.hiss({ dur: 0.24, freq: 700, sweepTo: 2600, gain: 0.09, q: 0.8 }),

  // Noppa
  dieTick: (s) => s.knock({ freqs: [420, 680], dur: 0.05, gain: 0.09, q: 12 }),
  dieLand: (s) => {
    // Puinen noppa pergamentille: matalat ominaistaajuudet ja pehmeä kahahdus.
    s.knock({ freqs: [180, 290, 430], dur: 0.2, gain: 0.22, q: 8 });
    s.hiss({ dur: 0.09, type: 'highpass', freq: 1600, gain: 0.045 });
  },

  // Liikkuminen
  step: (s) => s.knock({ freqs: [260, 390], dur: 0.06, gain: 0.055, q: 7 }),
  arrive: (s) => {
    s.tone({ freq: 440, to: 300, dur: 0.16, type: 'triangle', gain: 0.14 });
    s.hiss({ dur: 0.06, freq: 1400, gain: 0.05 });
  },
  ferry: (s) => {
    // Sumutorvi: kaksi hieman eri vireistä kanttiaaltoa alipäästön läpi.
    // Pieni vire-ero saa äänen huojumaan kuten oikea torvi.
    s.tone({ freq: 116, dur: 0.9, type: 'square', gain: 0.07 });
    s.tone({ freq: 119, dur: 0.9, type: 'square', gain: 0.06, delay: 0.01 });
    s.hiss({ dur: 0.7, type: 'lowpass', freq: 420, sweepTo: 180, gain: 0.06, delay: 0.05 });
  },
  // Lyhyt lähtöääni; varsinainen potkurihurina on sfx.startFlight().
  flight: (s) => {
    s.hiss({ dur: 0.7, type: 'lowpass', freq: 300, sweepTo: 900, gain: 0.06, q: 0.7 });
    s.tone({ freq: 96, to: 150, dur: 0.6, type: 'sawtooth', gain: 0.045 });
  },

  // Tietovisa
  correct: (s) => {
    // Lyhyt puhdas suuri terssi — ei fanfaaria, vain hyväksyvä nyökkäys.
    s.bell({ freq: 659, dur: 0.5, gain: 0.11 });
    s.bell({ freq: 830, dur: 0.6, gain: 0.09, delay: 0.05 });
  },
  wrong: (s) => {
    // Vaimea matala "hmph": ei piippausta eikä pilkkaa, vain pettymys.
    s.knock({ freqs: [120, 172], dur: 0.34, gain: 0.16, q: 5 });
    s.tone({ freq: 138, to: 104, dur: 0.3, type: 'sine', gain: 0.08, delay: 0.02 });
  },

  // Tiimalasi ja vihjeet
  hint: (s) => {
    s.hiss({ dur: 0.26, type: 'highpass', freq: 1100, sweepTo: 2600, gain: 0.06 });
    s.tone({ freq: 660, dur: 0.22, type: 'sine', gain: 0.09, delay: 0.06 });
  },
  tick: (s) => s.hiss({ dur: 0.025, freq: 3200, gain: 0.03, q: 2.4 }),
  timeout: (s) => {
    s.tone({ freq: 300, to: 90, dur: 0.7, type: 'triangle', gain: 0.15 });
    s.hiss({ dur: 0.5, type: 'lowpass', freq: 900, sweepTo: 200, gain: 0.07 });
  },

  // Aarteen paljastus
  flip: (s) => s.hiss({ dur: 0.55, freq: 380, sweepTo: 2100, gain: 0.08, q: 0.9 }),
  clack: (s) => {
    // Passin leima: matala läiskä ja kuiva klikki.
    s.tone({ freq: 80, to: 62, dur: 0.16, type: 'sine', gain: 0.17 });
    s.knock({ freqs: [900, 1500], dur: 0.05, gain: 0.09, q: 6 });
  },
  star: (s) => {
    // Soittorasia: epäharmoniset kellot nousevassa sarjassa.
    [523, 659, 784, 1046].forEach((freq, i) => {
      s.bell({ freq, dur: i === 3 ? 1.6 : 0.7, gain: 0.13, delay: i * 0.1 });
    });
    s.hiss({ dur: 0.9, type: 'highpass', freq: 3000, sweepTo: 6000, gain: 0.04, delay: 0.25 });
  },
  gem: (s) => s.bell({ freq: 880, dur: 1.2, gain: 0.13 }),
  horseshoe: (s) => {
    // Rauta rautaa vasten: kirkas FM-kilahdus ja pitkä sointi.
    s.ding({ freq: 1180, ratio: 2.1, index: 700, dur: 0.7, gain: 0.11 });
    s.bell({ freq: 1180, dur: 0.9, gain: 0.06, delay: 0.02 });
  },
  robber: (s) => {
    s.tone({ freq: 130, to: 62, dur: 0.55, type: 'sawtooth', gain: 0.17 });
    s.tone({ freq: 196, to: 185, dur: 0.5, type: 'square', gain: 0.06, delay: 0.04 });
    s.hiss({ dur: 0.3, type: 'lowpass', freq: 700, sweepTo: 220, gain: 0.08 });
  },
  empty: (s) => s.tone({ freq: 210, to: 175, dur: 0.14, type: 'sine', gain: 0.1 }),

  // Muut tapahtumat
  coin: (s) => {
    // Metallinen kilahdus ja pyörähdys pöydällä.
    s.ding({ freq: 1180, ratio: 3.5, index: 620, dur: 0.28, gain: 0.12 });
    s.ding({ freq: 1560, ratio: 3.5, index: 380, dur: 0.34, gain: 0.07, delay: 0.07 });
  },
  stuck: (s) => s.tone({ freq: 175, to: 140, dur: 0.22, type: 'square', gain: 0.1 }),
  turn: (s) => s.tone({ freq: 392, dur: 0.1, type: 'sine', gain: 0.07 }),
  win: (s) => {
    [523, 659, 784, 1046, 1318].forEach((freq, i) => {
      s.tone({ freq, dur: i === 4 ? 1.1 : 0.26, type: 'triangle', gain: 0.17, delay: i * 0.14 });
    });
    s.tone({ freq: 261, dur: 1.2, type: 'sine', gain: 0.1, delay: 0.56 });
  },
};

export const sfx = new Sound();

/** Aarteen paljastuksen ääni laattatyypin mukaan. */
export function treasureSound(type) {
  if (type === 'star') return 'star';
  if (type === 'robber') return 'robber';
  if (type === 'horseshoe') return 'horseshoe';
  if (type === 'empty') return 'empty';
  return 'gem';
}
