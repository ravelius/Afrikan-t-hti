// Oikeat kenttä-äänitykset paikoista. Äänite striimataan <audio>-
// elementillä suoraan verkosta — peli ei silti ole striimin varassa:
// ilman verkkoa, ennen ensimmäistä napautusta tai merkinnän puuttuessa
// palataan syntetisoituun ambienssiin (js/sound.js), joka on varmistus.
//
// Osoitteet ovat Freesoundin esikuunteluversioita (mp3, vakaat osoitteet)
// ja ne arvotaan maisematyypin korista (aani-ehdokkaat.js). Vain
// CC-lisensoituja äänitteitä.

import { sfx } from './sound.js';
import { valittuAani, jaaAlku, tyyppiKori } from './aani-ehdokkaat.js';

// Maisematyypin arvontakorista arvottu ääni pysyy samana koko käynnin
// ajan: syncAmbience kutsuu playPlaceAmbiencea jokaisella piirrolla,
// eikä ääni saa vaihtua tai katkeilla kesken kaupungissa olon.
let arvottu = null; // { cityId, url }

function arvoTyypista(cityId, tyyppi) {
  if (!cityId || !tyyppi) return null;
  if (arvottu?.cityId === cityId) return arvottu.url;
  const kori = tyyppiKori(tyyppi);
  if (!kori.length) return null;
  const url = kori[Math.floor(Math.random() * kori.length)];
  arvottu = { cityId, url };
  return url;
}

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
    // rAF:n aikaleima voi olla ennen t0:aa — ilman alarajaa volume
    // painui negatiiviseksi ja koko ääniketju kaatui poikkeukseen.
    const t = Math.min(1, Math.max(0, (nyt - t0) / HAIVYTYS_MS));
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
  // Kaupunkien äänet tulevat aina maisematyypin arvontakorista —
  // kaupunkikohtaisia valintoja tai oletuksia ei ole (omistajan päätös).
  // Tyhjä kori tarkoittaa syntetisoitua ambienssia.
  const url = arvoTyypista(cityId, fallbackType);
  if (!sfx.enabled || !url) {
    stopPlaceStream();
    sfx.setAmbience(sfx.enabled ? fallbackType ?? null : null);
    return;
  }
  if (nykyinen?.cityId === cityId && nykyinen?.url === url) return;

  stopPlaceStream();
  // Valinta voi kantaa aloituskohdan ja voimakkuuden (#alku=20&voima=1.5):
  // hypätään äänitteen vaimean alun yli ja soitetaan halutulla tasolla.
  // Silmukka palaa selaimen tapaan alkuun asti, mikä on siedettävää —
  // äänitteet ovat pitkiä.
  const { url: osoite, alku, voima } = jaaAlku(url);
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
  const oma = { audio, cityId, url, tavoite: Math.min(1, VOIMA * voima) };
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
    haivyta(audio, oma.tavoite);
  }).catch(varalle);
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
  if (nykyinen) haivyta(nykyinen.audio, (nykyinen.tavoite ?? VOIMA) * 0.15);
  if (!sfx.enabled || musiikki) return;
  const valinta = valittuAani('musiikki:tietovisa');
  if (valinta === '') return; // musiikki valittu pois
  const asetus = jaaAlku(valinta);
  const audio = new Audio(asetus.url ?? QUIZ_MUSIC.url);
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0;
  if (asetus.alku) {
    audio.addEventListener('loadedmetadata', () => {
      try {
        audio.currentTime = asetus.alku;
      } catch {
        /* soi alusta */
      }
    }, { once: true });
  }
  musiikki = audio;
  audio.play().then(() => {
    if (musiikki !== audio) {
      audio.pause();
      return;
    }
    haivyta(audio, Math.min(1, MUSIIKKI_VOIMA * asetus.voima));
  }).catch(() => {
    if (musiikki === audio) musiikki = null;
  });
}

export function stopQuizMusic() {
  // Kaupungin ääni palaa täyteen voimaansa.
  if (nykyinen) haivyta(nykyinen.audio, nykyinen.tavoite ?? VOIMA);
  const vanha = musiikki;
  musiikki = null;
  if (!vanha) return;
  haivyta(vanha, 0, () => {
    vanha.pause();
    vanha.removeAttribute('src');
  });
}

