// Oikeat kenttä-äänitykset paikoista. Äänite striimataan <audio>-
// elementillä suoraan verkosta — peli ei silti ole striimin varassa:
// ilman verkkoa, ennen ensimmäistä napautusta tai merkinnän puuttuessa
// palataan syntetisoituun ambienssiin (js/sound.js), joka on varmistus.
//
// Osoitteet ovat Freesoundin esikuunteluversioita (mp3, vakaat osoitteet)
// ja ne arvotaan maisematyypin korista (aani-ehdokkaat.js). Vain
// CC-lisensoituja äänitteitä.

import { sfx } from './sound.js';
import {
  valittuTaiOletus, jaaAlku, tyyppiKori, kaupunkiKori,
} from './aani-ehdokkaat.js';
import { aaniOsoite, onPeilista, peiliPetti } from './media.js';

// Arvottu ääni pysyy samana koko käynnin ajan: syncAmbience kutsuu
// playPlaceAmbiencea jokaisella piirrolla, eikä ääni saa vaihtua tai
// katkeilla kesken kaupungissa olon.
let arvottu = null; // { cityId, url }

/*
 * Paikat, joiden ääni ei saa arpoutua: etusivu on pelin ensimmäinen
 * vaikutelma ja sen kuuluu kuulostaa aina samalta (omistajan toive).
 * Muille paikoille ääni arvotaan korista.
 */
const VAKIOPAIKAT = new Set(['etusivu']);

/**
 * Kaupungin äänimaisema: oma kenttä-äänitys ensin, maisematyypin
 * arvontakori varalle.
 *
 * Aiemmin ääni tuli aina tyyppikorista, jolloin 22 Euroopan kaupunkia
 * jakoi kolme "kaupunki"-ääntä ja Praha kuulosti Lissabonilta.
 * Kaupungille kerätyt äänitykset on haettu koordinaattien perusteella
 * (tools/hae-kaupunkiaanet.mjs), joten ne ovat varmasti siitä
 * kaupungista — ne menevät korin edelle (omistajan toive). Ilman omaa
 * äänitystä tyyppikori toimii kuten ennen.
 */
function arvoAani(cityId, tyyppi, lauta) {
  if (!cityId) return null;
  if (arvottu?.cityId === cityId) return arvottu.url;
  const oma = kaupunkiKori(lauta, cityId);
  const kori = oma.length ? oma : (tyyppi ? tyyppiKori(tyyppi, lauta) : []);
  if (!kori.length) return null;
  const url = VAKIOPAIKAT.has(cityId)
    ? kori[0]
    : kori[Math.floor(Math.random() * kori.length)];
  arvottu = { cityId, url };
  return url;
}

// Striimi on taustaa, ei etualaa — hiljaisempi kuin tehosteäänet.
const VOIMA = 0.14;
// Etusivu on pelin ensimmäinen vaikutelma, ja siinä ääni soi ilman
// mitään muuta: sama taso kuin matkalla kuulosti liian kovalta
// (omistajan havainto). Puolet siitä riittää tunnelmaksi.
const ETUSIVUN_VOIMA = 0.5;
const HAIVYTYS_MS = 1800;
// Sama äänite alkaa joka kerta eri kohdasta, jottei paikka kuulosta
// itseään toistavalta kun sinne palaa. Loppuun jätetään varaa, ettei
// silmukka pyörähdy heti alkuun.
const LOPPUVARA_S = 45;

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
export function playPlaceAmbience(cityId, fallbackType, lauta) {
  // Kaupungin oma äänitys ensin, maisematyypin maanosakohtainen
  // arvontakori varalle. Tyhjä kori tarkoittaa syntetisoitua ambienssia.
  const url = arvoAani(cityId, fallbackType, lauta);
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
  const audio = new Audio(aaniOsoite(osoite));
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0;
  // Aloituskohta arvotaan äänitteen mitasta. `alku` on äänitteen vaimean
  // alun ylitys, eli aikaisin sallittu kohta; sitä myöhemmästä valitaan
  // satunnainen. Etusivu alkaa aina samasta kohdasta, koska sen kuuluu
  // kuulostaa joka avauksella samalta.
  const arvoAlku = !VAKIOPAIKAT.has(cityId);
  let hypatty = false;
  const hyppaa = () => {
    if (hypatty) return;
    const pohja = alku ?? 0;
    // Kesto ei ole aina tiedossa vielä loadedmetadata-hetkellä: osalla
    // äänitteistä se selviää vasta myöhemmin. Siksi kuunnellaan myös
    // durationchange — muuten arvonta jäisi tekemättä hiljaisesti.
    if (!Number.isFinite(audio.duration)) return;
    const yla = audio.duration - LOPPUVARA_S;
    const kohta = arvoAlku && yla > pohja + 5
      ? pohja + Math.random() * (yla - pohja)
      : pohja;
    hypatty = true;
    if (!kohta) return;
    try {
      audio.currentTime = kohta;
    } catch {
      /* selain ei salli hyppyä ennen dataa — soi alusta */
    }
  };
  audio.addEventListener('loadedmetadata', hyppaa);
  audio.addEventListener('durationchange', hyppaa);
  audio.addEventListener('canplay', hyppaa);
  const paikanVoima = VAKIOPAIKAT.has(cityId) ? ETUSIVUN_VOIMA : 1;
  const oma = { audio, cityId, url, tavoite: Math.min(1, VOIMA * voima * paikanVoima) };
  nykyinen = oma;

  // Kaksi porrasta ennen synteesiä: jos peili ei vastaa, sama äänite
  // löytyy yhä alkuperäisestä lähteestä. Vasta kun sekin pettää,
  // palataan syntetisoituun ambienssiin.
  let varareittiKokeiltu = false;
  const varalle = () => {
    if (nykyinen === oma) nykyinen = null;
    audio.pause();
    sfx.setAmbience(fallbackType ?? null);
  };
  // Soitto ja onnistumisen käsittely ovat omassa funktiossaan, jotta
  // varareitti käy täsmälleen saman polun: ilman sitä äänite jäisi
  // vaihdon jälkeen soimaan nollavoimakkuudella.
  const soi = () => audio.play().then(() => {
    if (nykyinen !== oma) {
      audio.pause();
      return;
    }
    sfx.setAmbience(null); // synteesi väistyy, kun oikea äänite soi
    haivyta(audio, oma.tavoite);
  }).catch(petti);
  const petti = () => {
    if (!varareittiKokeiltu && onPeilista(audio.getAttribute('src'))) {
      varareittiKokeiltu = true;
      peiliPetti();
      if (nykyinen !== oma) return;
      audio.src = osoite;
      audio.load();
      soi();
      return;
    }
    varalle();
  };
  audio.addEventListener('error', petti);
  soi();
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

export function startQuizMusic(lauta) {
  // Kaupungin ääni väistyy reilusti kysymyksen ajaksi — kaksi ääntä
  // päällekkäin täydellä voimalla oli puuroa.
  if (nykyinen) haivyta(nykyinen.audio, (nykyinen.tavoite ?? VOIMA) * 0.15);
  if (!sfx.enabled || musiikki) return;
  // Maanosan oma valinta tai oletus voittaa; ilman kumpaakaan soi
  // yleinen. Oletukset kulkevat koodin mukana, joten ne toimivat myös
  // kotivalikkoon asennetussa pelissä, jonne selainvalinnat eivät yllä.
  let valinta = lauta ? valittuTaiOletus(`musiikki:tietovisa:${lauta}`) : null;
  if (valinta == null) valinta = valittuTaiOletus('musiikki:tietovisa');
  if (valinta === '') return; // musiikki valittu pois
  const asetus = jaaAlku(valinta);
  const alkuperainen = asetus.url ?? QUIZ_MUSIC.url;
  const audio = new Audio(aaniOsoite(alkuperainen));
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
  // Sama kahden portaan varareitti kuin paikan ambienssilla: peilin
  // pettäessä kokeillaan alkuperäistä lähdettä, ja vasta sitten
  // kysymys jää hiljaiseksi.
  let varareittiKokeiltu = false;
  const luovuta = () => { if (musiikki === audio) musiikki = null; };
  const soi = () => audio.play().then(() => {
    if (musiikki !== audio) {
      audio.pause();
      return;
    }
    haivyta(audio, Math.min(1, MUSIIKKI_VOIMA * asetus.voima));
  }).catch(petti);
  const petti = () => {
    if (varareittiKokeiltu || !onPeilista(audio.getAttribute('src'))) { luovuta(); return; }
    varareittiKokeiltu = true;
    peiliPetti();
    if (musiikki !== audio) return;
    audio.src = alkuperainen;
    audio.load();
    soi();
  };
  audio.addEventListener('error', petti);
  soi();
}

/**
 * Taustaäänen väistö muun äänen (esim. kulttuurinoston ääninäytteen)
 * ajaksi — sama kevennys kuin tietovisan aikana. Palautus nostaa
 * taustan takaisin täyteen voimaansa.
 */
export function vaimennaTausta() {
  if (nykyinen) haivyta(nykyinen.audio, (nykyinen.tavoite ?? VOIMA) * 0.15);
}

export function palautaTausta() {
  if (nykyinen) haivyta(nykyinen.audio, nykyinen.tavoite ?? VOIMA);
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

