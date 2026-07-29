// Oikeat kenttä-äänitykset paikoista. Äänite striimataan <audio>-
// elementillä suoraan verkosta — peli ei silti ole striimin varassa:
// ilman verkkoa, ennen ensimmäistä napautusta tai merkinnän puuttuessa
// palataan syntetisoituun ambienssiin (js/sound.js), joka on varmistus.
//
// Osoitteet ovat Freesoundin esikuunteluversioita (mp3, vakaat osoitteet).
// Uusi paikka lisätään STREAMS-taulukkoon: suora mp3-osoite ja
// tekijämaininta lisensseineen. Vain CC-lisensoituja äänitteitä.

import { sfx } from './sound.js';
import { valittuAani, jaaAlku } from './aani-ehdokkaat.js';

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
  // Uusi häivytys keskeyttää saman äänen edellisen, etteivät kaksi
  // silmukkaa vedä voimakkuutta eri suuntiin.
  const oma = (audio.haivytysId = (audio.haivytysId ?? 0) + 1);
  const alku = audio.volume;
  const t0 = performance.now();
  const askel = (nyt) => {
    if (audio.haivytysId !== oma) return;
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
  // Omistajan valinta (/aanet.html) ohittaa oletuksen: osoite soittaa
  // sen, tyhjä merkkijono tarkoittaa syntetisoitua, null jättää
  // STREAMS-oletuksen voimaan.
  const valinta = cityId ? valittuAani(`kaupunki:${cityId}`) : null;
  const url = valinta === '' ? null : valinta ?? (cityId ? STREAMS[cityId]?.url : null);
  if (!sfx.enabled || !url) {
    stopPlaceStream();
    sfx.setAmbience(sfx.enabled ? fallbackType ?? null : null);
    return;
  }
  if (nykyinen?.cityId === cityId && nykyinen?.url === url) return;

  stopPlaceStream();
  // Valinta voi kantaa aloituskohdan (#alku=20): hypätään äänitteen
  // vaimean alun yli. Silmukka palaa selaimen tapaan alkuun asti, mikä
  // on siedettävää — äänitteet ovat pitkiä.
  const { url: osoite, alku } = jaaAlku(url);
  const audio = new Audio(osoite);
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0;
  if (alku) {
    audio.addEventListener('loadedmetadata', () => {
      try {
        audio.currentTime = alku;
      } catch {
        /* selain ei salli hyppyä ennen dataa — soi alusta */
      }
    }, { once: true });
  }
  const oma = { audio, cityId, url };
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

// Tietovisan taustamusiikki: hiljainen huililuuppi kysymyksen ajaksi.
// Aina sama — tunnistettava "nyt mietitään" -sävy. Ilman verkkoa
// kysymys on hiljainen, mikä on myös ihan hyvä.
const QUIZ_MUSIC = {
  url: 'https://cdn.freesound.org/previews/713/713120_14632469-lq.mp3',
  credit: '"Arabic Flute 04" — DYEKHO, Freesound (CC0)',
};
const MUSIIKKI_VOIMA = 0.09;

let musiikki = null;

export function startQuizMusic() {
  // Kaupungin ääni väistyy reilusti kysymyksen ajaksi — kaksi ääntä
  // päällekkäin täydellä voimalla oli puuroa.
  if (nykyinen) haivyta(nykyinen.audio, VOIMA * 0.15);
  if (!sfx.enabled || musiikki) return;
  const valinta = valittuAani('musiikki:tietovisa');
  if (valinta === '') return; // musiikki valittu pois
  const audio = new Audio(valinta ?? QUIZ_MUSIC.url);
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0;
  musiikki = audio;
  audio.play().then(() => {
    if (musiikki !== audio) {
      audio.pause();
      return;
    }
    haivyta(audio, MUSIIKKI_VOIMA);
  }).catch(() => {
    if (musiikki === audio) musiikki = null;
  });
}

export function stopQuizMusic() {
  // Kaupungin ääni palaa täyteen voimaansa.
  if (nykyinen) haivyta(nykyinen.audio, VOIMA);
  const vanha = musiikki;
  musiikki = null;
  if (!vanha) return;
  haivyta(vanha, 0, () => {
    vanha.pause();
    vanha.removeAttribute('src');
  });
}
