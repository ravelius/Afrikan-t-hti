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
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.32;
      this.master.connect(this.ctx.destination);

      // Yhden sekunnin valkoinen kohina, jota käytetään uudelleen kaikissa äänissä.
      const frames = this.ctx.sampleRate;
      this.noise = this.ctx.createBuffer(1, frames, this.ctx.sampleRate);
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    return this.ctx;
  }

  // --- perusäänet ---------------------------------------------------------

  tone({ freq = 440, to = null, dur = 0.2, type = 'sine', gain = 0.2, attack = 0.006, delay = 0 }) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(to, 20), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(this.master);
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
    filter.frequency.setValueAtTime(freq, t0);
    if (sweepTo) filter.frequency.exponentialRampToValueAtTime(Math.max(sweepTo, 40), t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filter).connect(g).connect(this.master);
    src.start(t0);
    src.stop(t0 + dur + 0.06);
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
  click: (s) => {
    s.tone({ freq: 540, to: 430, dur: 0.06, type: 'triangle', gain: 0.1 });
    s.hiss({ dur: 0.04, freq: 2600, gain: 0.05 });
  },
  paper: (s) => s.hiss({ dur: 0.34, type: 'highpass', freq: 900, sweepTo: 2800, gain: 0.075 }),
  swipe: (s) => s.hiss({ dur: 0.24, freq: 700, sweepTo: 2600, gain: 0.09, q: 0.8 }),

  // Noppa
  dieTick: (s) => s.hiss({ dur: 0.04, freq: 2400, gain: 0.07, q: 1.6 }),
  dieLand: (s) => {
    s.tone({ freq: 190, to: 110, dur: 0.18, type: 'triangle', gain: 0.2 });
    s.hiss({ dur: 0.1, freq: 900, gain: 0.08 });
  },

  // Liikkuminen
  step: (s) => s.tone({ freq: 330, to: 250, dur: 0.075, type: 'triangle', gain: 0.09 }),
  arrive: (s) => {
    s.tone({ freq: 440, to: 300, dur: 0.16, type: 'triangle', gain: 0.14 });
    s.hiss({ dur: 0.06, freq: 1400, gain: 0.05 });
  },
  ferry: (s) => {
    s.hiss({ dur: 0.75, type: 'lowpass', freq: 600, sweepTo: 220, gain: 0.09 });
    s.tone({ freq: 150, to: 130, dur: 0.5, type: 'sine', gain: 0.14, delay: 0.05 });
  },
  flight: (s) => {
    s.hiss({ dur: 0.95, freq: 320, sweepTo: 1900, gain: 0.085, q: 0.7 });
    s.tone({ freq: 220, to: 520, dur: 0.85, type: 'sawtooth', gain: 0.05 });
  },

  // Tietovisa
  correct: (s) => {
    s.tone({ freq: 523, dur: 0.16, type: 'triangle', gain: 0.16 });
    s.tone({ freq: 784, dur: 0.32, type: 'triangle', gain: 0.16, delay: 0.13 });
  },
  wrong: (s) => {
    s.tone({ freq: 233, to: 150, dur: 0.34, type: 'sawtooth', gain: 0.12 });
    s.tone({ freq: 220, to: 140, dur: 0.36, type: 'square', gain: 0.06, delay: 0.02 });
  },

  // Tiimalasi ja vihjeet
  hint: (s) => {
    s.hiss({ dur: 0.26, type: 'highpass', freq: 1100, sweepTo: 2600, gain: 0.06 });
    s.tone({ freq: 660, dur: 0.22, type: 'sine', gain: 0.09, delay: 0.06 });
  },
  tick: (s) => s.hiss({ dur: 0.03, freq: 3200, gain: 0.045, q: 2.2 }),
  timeout: (s) => {
    s.tone({ freq: 300, to: 90, dur: 0.7, type: 'triangle', gain: 0.15 });
    s.hiss({ dur: 0.5, type: 'lowpass', freq: 900, sweepTo: 200, gain: 0.07 });
  },

  // Aarteen paljastus
  flip: (s) => s.hiss({ dur: 0.55, freq: 380, sweepTo: 2100, gain: 0.08, q: 0.9 }),
  clack: (s) => {
    s.tone({ freq: 160, to: 90, dur: 0.13, type: 'square', gain: 0.13 });
    s.hiss({ dur: 0.06, freq: 1100, gain: 0.07 });
  },
  star: (s) => {
    [523, 659, 784, 1046].forEach((freq, i) => {
      s.tone({ freq, dur: i === 3 ? 0.7 : 0.24, type: 'triangle', gain: 0.16, delay: i * 0.1 });
    });
    s.hiss({ dur: 0.9, type: 'highpass', freq: 3000, sweepTo: 6000, gain: 0.05, delay: 0.25 });
  },
  gem: (s) => {
    s.tone({ freq: 880, dur: 0.45, type: 'sine', gain: 0.14 });
    s.tone({ freq: 1320, dur: 0.55, type: 'sine', gain: 0.09, delay: 0.06 });
  },
  horseshoe: (s) => {
    s.tone({ freq: 1180, dur: 0.6, type: 'sine', gain: 0.11 });
    s.tone({ freq: 1187, dur: 0.62, type: 'sine', gain: 0.08, delay: 0.01 });
    s.hiss({ dur: 0.08, freq: 4000, gain: 0.05 });
  },
  robber: (s) => {
    s.tone({ freq: 130, to: 62, dur: 0.55, type: 'sawtooth', gain: 0.17 });
    s.tone({ freq: 196, to: 185, dur: 0.5, type: 'square', gain: 0.06, delay: 0.04 });
    s.hiss({ dur: 0.3, type: 'lowpass', freq: 700, sweepTo: 220, gain: 0.08 });
  },
  empty: (s) => s.tone({ freq: 210, to: 175, dur: 0.14, type: 'sine', gain: 0.1 }),

  // Muut tapahtumat
  coin: (s) => {
    s.tone({ freq: 990, dur: 0.12, type: 'triangle', gain: 0.12 });
    s.tone({ freq: 1320, dur: 0.2, type: 'triangle', gain: 0.1, delay: 0.07 });
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
