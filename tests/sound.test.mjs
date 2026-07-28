// Äänten savutesti.
//
// Web Audiota ei ole Nodessa, joten käytämme tynkäkontekstia, joka toteuttaa
// samat rajapinnat ja kirjaa luodut solmut. Näin testi ajaa oikeasti läpi
// synteesikoodin (knock, bell, ding, potkurihurina) eikä vain totea, ettei
// mikään kaadu ilman äänilaitetta.

import test from 'node:test';
import assert from 'node:assert/strict';

/** Automaatioparametri, joka hyväksyy kaikki aikataulutuskutsut. */
function param(value = 0) {
  return {
    value,
    setValueAtTime() { return this; },
    exponentialRampToValueAtTime() { return this; },
    linearRampToValueAtTime() { return this; },
    cancelScheduledValues() { return this; },
  };
}

/** Solmu, joka muistaa mihin se on kytketty. */
function node(type, ctx) {
  const n = {
    type,
    connect(kohde) { ctx.yhteydet.push([type, kohde?.type ?? 'param']); return kohde; },
    disconnect() {},
    start() { ctx.aloitetut.push(type); },
    stop() {},
  };
  return n;
}

function stubContext() {
  const ctx = {
    currentTime: 0,
    sampleRate: 44100,
    state: 'running',
    luodut: [],
    aloitetut: [],
    yhteydet: [],
    destination: { type: 'destination' },
    resume: () => Promise.resolve(),
  };
  const luo = (type, lisa = {}) => {
    ctx.luodut.push(type);
    return Object.assign(node(type, ctx), lisa);
  };
  ctx.createGain = () => luo('gain', { gain: param(1) });
  ctx.createOscillator = () => luo('oscillator', { frequency: param(440), type: 'sine' });
  ctx.createBufferSource = () => luo('bufferSource', { buffer: null, loop: false });
  ctx.createBiquadFilter = () => luo('filter', { frequency: param(1000), Q: param(1), type: 'bandpass' });
  ctx.createConvolver = () => luo('convolver', { buffer: null });
  ctx.createDynamicsCompressor = () => luo('compressor', {
    threshold: param(-24), knee: param(30), ratio: param(12), attack: param(0.003), release: param(0.25),
  });
  ctx.createBuffer = (ch, frames, rate) => ({
    length: frames,
    sampleRate: rate,
    numberOfChannels: ch,
    getChannelData: () => new Float32Array(frames),
  });
  return ctx;
}

/** Lataa sound.js tuoreena tynkäkontekstin kanssa. */
async function lataaSfx() {
  const ctx = stubContext();
  globalThis.window = { AudioContext: function () { return ctx; } };
  globalThis.localStorage = { getItem: () => null, setItem: () => {} };
  const { sfx } = await import(`../js/sound.js?kerta=${Math.random()}`);
  sfx.enabled = true;
  return { sfx, ctx };
}

const NIMET = [
  'click', 'paper', 'swipe', 'dieTick', 'dieLand', 'step', 'arrive', 'ferry',
  'flight', 'correct', 'wrong', 'hint', 'tick', 'timeout', 'flip', 'clack',
  'star', 'gem', 'horseshoe', 'robber', 'empty', 'coin', 'stuck', 'turn', 'win',
];

test('jokainen ääni soi ja tuottaa äänilähteitä', async () => {
  for (const nimi of NIMET) {
    const { sfx, ctx } = await lataaSfx();
    assert.doesNotThrow(() => sfx.play(nimi), `ääni "${nimi}" heitti poikkeuksen`);
    assert.ok(
      ctx.aloitetut.length > 0,
      `ääni "${nimi}" ei käynnistänyt yhtään äänilähdettä`,
    );
  }
});

test('masteriketjuun kuuluu kaiku ja kompressori', async () => {
  const { sfx, ctx } = await lataaSfx();
  sfx.play('click');
  assert.ok(ctx.luodut.includes('convolver'), 'kaiku puuttuu masteriketjusta');
  assert.ok(ctx.luodut.includes('compressor'), 'kompressori puuttuu masteriketjusta');
  // Kaiun impulssivaste on luotu, ei ladattu tiedostosta.
  assert.ok(sfx.reverb.buffer, 'kaiulla ei ole impulssivastetta');
  assert.equal(sfx.reverb.buffer.numberOfChannels, 2);
});

test('kaikki äänet kulkevat kaikubussin kautta', async () => {
  const { sfx, ctx } = await lataaSfx();
  sfx.play('star');
  const bussiin = ctx.yhteydet.filter(([, kohde]) => kohde === 'gain').length;
  assert.ok(bussiin > 0, 'äänet eivät kytkeydy mihinkään');
});

test('potkurihurina käynnistyy ja pysähtyy siististi', async () => {
  const { sfx, ctx } = await lataaSfx();
  sfx.startFlight(2000);
  assert.ok(sfx.flightNodes, 'hurina ei käynnistynyt');
  const oskillaattoreita = ctx.aloitetut.filter((t) => t === 'oscillator').length;
  assert.ok(oskillaattoreita >= 2, 'hurinasta puuttuu kantoaalto tai LFO');

  // Toinen käynnistys ei saa luoda päällekkäistä hurinaa.
  const ennen = ctx.aloitetut.length;
  sfx.startFlight(2000);
  assert.equal(ctx.aloitetut.length, ennen, 'hurina käynnistyi kahdesti');

  sfx.stopFlight();
  assert.equal(sfx.flightNodes, null, 'hurina jäi päälle');
  // Turha lopetus ei kaadu.
  assert.doesNotThrow(() => sfx.stopFlight());
});

test('vireheitto pysyy kolmessa prosentissa', async () => {
  const { sfx } = await lataaSfx();
  for (let i = 0; i < 400; i++) {
    const v = sfx.jitter(1000);
    assert.ok(v >= 970 && v <= 1030, `heitto ${v} ylitti kolme prosenttia`);
  }
});

test('tuntematon äänen nimi ei kaada peliä', async () => {
  const { sfx } = await lataaSfx();
  assert.doesNotThrow(() => sfx.play('ei-tallaista-aanta'));
});

test('äänet ovat turvallisia ilman AudioContextia', async () => {
  globalThis.window = {};
  globalThis.localStorage = { getItem: () => null, setItem: () => {} };
  const { sfx } = await import(`../js/sound.js?kerta=${Math.random()}`);
  sfx.enabled = true;
  for (const nimi of NIMET) {
    assert.doesNotThrow(() => sfx.play(nimi), `"${nimi}" kaatui ilman äänilaitetta`);
  }
  assert.doesNotThrow(() => sfx.startFlight(1000));
  assert.doesNotThrow(() => sfx.stopFlight());
});

test('treasureSound osaa kaikki laattatyypit', async () => {
  const { treasureSound } = await import('../js/sound.js');
  assert.equal(treasureSound('star'), 'star');
  assert.equal(treasureSound('robber'), 'robber');
  assert.equal(treasureSound('horseshoe'), 'horseshoe');
  assert.equal(treasureSound('empty'), 'empty');
  assert.equal(treasureSound('emerald'), 'gem');
  assert.equal(treasureSound(undefined), 'gem');
});
