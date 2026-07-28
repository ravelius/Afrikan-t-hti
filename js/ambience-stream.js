// Oikeat kenttä-äänitykset paikoista. Äänite striimataan <audio>-
// elementillä suoraan verkosta — peli ei silti ole striimin varassa:
// ilman verkkoa, ennen ensimmäistä napautusta tai merkinnän puuttuessa
// palataan syntetisoituun ambienssiin (js/sound.js), joka on varmistus.
//
// Osoitteet ovat Freesoundin esikuunteluversioita (mp3, vakaat osoitteet).
// Uusi paikka lisätään STREAMS-taulukkoon: suora mp3-osoite ja
// tekijämaininta lisensseineen. Vain CC-lisensoituja äänitteitä.

import { sfx } from './sound.js';

export const STREAMS = {
  kairo: {
    url: 'https://cdn.freesound.org/previews/723/723081_2978883-lq.mp3',
    credit: '"cairo night out" — rucisko, Freesound (CC BY-NC 4.0)',
  },
  sahara: {
    url: 'https://cdn.freesound.org/previews/146/146745_832093-lq.mp3',
    credit: '"Sahara wind harp (lotar)" — omestreandre, Freesound (CC BY 4.0)',
  },
  dakar: {
    url: 'https://cdn.freesound.org/previews/677/677253_9756914-lq.mp3',
    credit: '"Dakar Ouakam cour intérieure" — LaureC, Freesound (CC0)',
  },
  kimberley: {
    url: 'https://cdn.freesound.org/previews/202/202876_1934171-lq.mp3',
    credit: '"African savanna 2" — AugustSandberg, Freesound (CC0)',
  },
  angola: {
    url: 'https://cdn.freesound.org/previews/202/202876_1934171-lq.mp3',
    credit: '"African savanna 2" — AugustSandberg, Freesound (CC0)',
  },
};

// Striimi on taustaa, ei etualaa — hiljaisempi kuin tehosteäänet.
const VOIMA = 0.14;
const HAIVYTYS_MS = 1800;

let nykyinen = null; // { audio, cityId }

function haivyta(audio, kohde, done) {
  const alku = audio.volume;
  const t0 = performance.now();
  const askel = (nyt) => {
    const t = Math.min(1, (nyt - t0) / HAIVYTYS_MS);
    audio.volume = alku + (kohde - alku) * t;
    if (t < 1) requestAnimationFrame(askel);
    else done?.();
  };
  requestAnimationFrame(askel);
}

export function stopPlaceStream() {
  const vanha = nykyinen;
  nykyinen = null;
  if (!vanha) return;
  haivyta(vanha.audio, 0, () => {
    vanha.audio.pause();
    vanha.audio.removeAttribute('src');
  });
}

/**
 * Paikan äänimaisema: oikea äänite, jos kaupungille on merkitty sellainen,
 * muuten syntetisoitu tyyppi. Striimin epäonnistuminen — offline, estetty
 * automaattitoisto tai poistunut tiedosto — palauttaa synteesin itsestään,
 * ja seuraava renderöinti yrittää striimiä uudelleen.
 */
export function playPlaceAmbience(cityId, fallbackType) {
  const entry = cityId ? STREAMS[cityId] : null;
  if (!sfx.enabled || !entry) {
    stopPlaceStream();
    sfx.setAmbience(sfx.enabled ? fallbackType ?? null : null);
    return;
  }
  if (nykyinen?.cityId === cityId) return;

  stopPlaceStream();
  const audio = new Audio(entry.url);
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0;
  const oma = { audio, cityId };
  nykyinen = oma;

  const varalle = () => {
    if (nykyinen === oma) nykyinen = null;
    audio.pause();
    sfx.setAmbience(fallbackType ?? null);
  };
  audio.addEventListener('error', varalle);
  audio.play().then(() => {
    if (nykyinen !== oma) {
      audio.pause();
      return;
    }
    sfx.setAmbience(null); // synteesi väistyy, kun oikea äänite soi
    haivyta(audio, VOIMA);
  }).catch(varalle);
}

/** Tekijämaininta soivalle äänitteelle, tai null. */
export function placeStreamCredit(cityId) {
  return STREAMS[cityId]?.credit ?? null;
}
