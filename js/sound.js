// Peliäänet syntetisoituna Web Audio API:lla — ei äänitiedostoja, joten peli
// pysyy kevyenä ja toimii myös offline.
//
// Selaimet vaativat käyttäjän eleen ennen äänen toistoa, joten AudioContext
// luodaan vasta ensimmäisen napautuksen yhteydessä.

const STORAGE_KEY = 'afrikan-tahti-sound';

class Sound {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.noise = null;
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

    osc.connect(lp).connect(depth).connect(g).connect(this.bus);
    osc.start(t0); lfo.start(t0);
    osc.stop(t0 + kesto + 0.1); lfo.stop(t0 + kesto + 0.1);
    this.flightNodes = { osc, lfo, g };
    // Siivotaan itsestään, jos stopFlight jää kutsumatta.
    osc.onended = () => { this.flightNodes = null; };
  }

  /** Lopettaa potkurihurinan pehmeästi. */
  stopFlight() {
    const solmut = this.flightNodes;
    if (!solmut || !this.ctx) return;
    this.flightNodes = null;
    const t = this.ctx.currentTime;
    try {
      solmut.g.gain.cancelScheduledValues(t);
      solmut.g.gain.setValueAtTime(Math.max(solmut.g.gain.value, 0.0001), t);
      solmut.g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      solmut.osc.stop(t + 0.4);
      solmut.lfo.stop(t + 0.4);
    } catch {
      /* solmu oli jo pysäytetty */
    }
  }

  // --- pelin äänet --------------------------------------------------------

  play(name) {
    if (!this.enabled) return;
    const sound = SOUNDS[name];
    if (sound) sound(this);
  }
}

const SOUNDS = {
  // Käyttöliittymä
  click: (s) => s.knock({ freqs: [540, 880], dur: 0.045, gain: 0.06, q: 8 }),
  paper: (s) => s.hiss({ dur: 0.34, type: 'highpass', freq: 900, sweepTo: 2800, gain: 0.075 }),
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
