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
/*
 * Silmukan sauma ristihäivytyksellä (omistajan toive). Selaimen oma
 * `loop` katkaisee nauhan pään alkuun kuin veitsellä, ja kolmen minuutin
 * äänitteessä sen kuulee. Siksi uusi kierros käynnistetään omana
 * soittimenaan hieman ennen kuin edellinen ehtii loppua, ja ne
 * ristihäivytetään: vanha vaimenee samaa tahtia kuin uusi voimistuu.
 */
const SILMUKKA_RISTI_MS = 2600;

let nykyinen = null; // { audio, cityId, url, tavoite, vaimennus }

/** Soiva taso: kohdevoimakkuus kerrottuna mahdollisella väistöllä. */
const taso = (oma) => (oma ? oma.tavoite * (oma.vaimennus ?? 1) : 0);

function haivyta(audio, kohde, done, kesto = HAIVYTYS_MS) {
  // Uusi häivytys keskeyttää saman äänen edellisen, etteivät kaksi
  // silmukkaa vedä voimakkuutta eri suuntiin.
  const oma = (audio.haivytysId = (audio.haivytysId ?? 0) + 1);
  const alku = audio.volume;
  const t0 = performance.now();
  const askel = (nyt) => {
    if (audio.haivytysId !== oma) return;
    // rAF:n aikaleima voi olla ennen t0:aa — ilman alarajaa volume
    // painui negatiiviseksi ja koko ääniketju kaatui poikkeukseen.
    const t = Math.min(1, Math.max(0, (nyt - t0) / kesto));
    audio.volume = Math.min(1, Math.max(0, alku + (kohde - alku) * t));
    if (t < 1) requestAnimationFrame(askel);
    else done?.();
  };
  requestAnimationFrame(askel);
}

/** Sammuttaa yhden soittimen pehmeästi ja vapauttaa sen. */
function paasta(audio, kesto = HAIVYTYS_MS) {
  haivyta(audio, 0, () => {
    audio.pause();
    audio.removeAttribute('src');
  }, kesto);
}

export function stopPlaceStream() {
  const vanha = nykyinen;
  nykyinen = null;
  if (!vanha) return;
  // Myös kesken olevan ristihäivytyksen väistyvä puoli pitää sammuttaa,
  // muuten se jäisi soimaan omilleen kaupungin vaihtuessa.
  if (vanha.vaistyva) paasta(vanha.vaistyva);
  paasta(vanha.audio);
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
  const { url: osoite, alku, voima } = jaaAlku(url);
  const paikanVoima = VAKIOPAIKAT.has(cityId) ? ETUSIVUN_VOIMA : 1;
  const oma = {
    cityId,
    url,
    osoite,
    alku: alku ?? 0,
    audio: null,
    vaistyva: null,
    vaimennus: 1,
    tavoite: Math.min(1, VOIMA * voima * paikanVoima),
    // Etusivu alkaa aina samasta kohdasta, koska sen kuuluu kuulostaa
    // joka avauksella samalta.
    arvoAlku: !VAKIOPAIKAT.has(cityId),
    fallbackType: fallbackType ?? null,
  };
  nykyinen = oma;
  oma.audio = luoSoitin(oma, { arvottuAlku: oma.arvoAlku, nouse: HAIVYTYS_MS });
}

/**
 * Yksi soitin äänimaisemalle: hakee äänitteen peilistä, hyppää oikeaan
 * kohtaan ja nousee kuuluviin. Sama funktio luo sekä paikkaan
 * saavuttaessa alkavan soittimen että silmukan seuraavan kierroksen,
 * jotta varareitti ja aloituskohta käyttäytyvät molemmissa samoin.
 */
function luoSoitin(oma, { arvottuAlku, nouse }) {
  const audio = new Audio(aaniOsoite(oma.osoite));
  // Selaimen oma silmukka katkaistaisiin veitsellä; kierrokset
  // ristihäivytetään itse (ks. vahdiSilmukka).
  audio.loop = false;
  audio.preload = 'auto';
  audio.volume = 0;
  let hypatty = false;
  const hyppaa = () => {
    if (hypatty) return;
    const pohja = oma.alku;
    // Kesto ei ole aina tiedossa vielä loadedmetadata-hetkellä: osalla
    // äänitteistä se selviää vasta myöhemmin. Siksi kuunnellaan myös
    // durationchange — muuten arvonta jäisi tekemättä hiljaisesti.
    if (!Number.isFinite(audio.duration)) return;
    const yla = audio.duration - LOPPUVARA_S;
    const kohta = arvottuAlku && yla > pohja + 5
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

  // Kaksi porrasta ennen synteesiä: jos peili ei vastaa, sama äänite
  // löytyy yhä alkuperäisestä lähteestä. Vasta kun sekin pettää,
  // palataan syntetisoituun ambienssiin.
  let varareittiKokeiltu = false;
  const varalle = () => {
    if (nykyinen === oma && oma.audio === audio) {
      nykyinen = null;
      sfx.setAmbience(oma.fallbackType);
    }
    audio.pause();
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
    haivyta(audio, taso(oma), null, nouse);
    vahdiSilmukka(oma, audio);
  }).catch(petti);
  const petti = () => {
    if (!varareittiKokeiltu && onPeilista(audio.getAttribute('src'))) {
      varareittiKokeiltu = true;
      peiliPetti();
      if (nykyinen !== oma) return;
      audio.src = oma.osoite;
      audio.load();
      soi();
      return;
    }
    varalle();
  };
  audio.addEventListener('error', petti);
  soi();
  return audio;
}

/**
 * Käynnistää seuraavan kierroksen hieman ennen kuin nauha loppuu ja
 * ristihäivyttää kierrokset päällekkäin. Ilman tätä silmukan sauma
 * kuuluu naksahduksena keskellä äänimaisemaa.
 */
function vahdiSilmukka(oma, audio) {
  const risti = SILMUKKA_RISTI_MS / 1000;
  const vaihda = () => {
    if (nykyinen !== oma || oma.audio !== audio) return;
    // Uusi kierros alkaa aina äänitteen alusta (`alku` on vain vaimean
    // alun ylitys) — sauma kuuluu sitä vähemmän, mitä samankaltaisempi
    // kohta on, ja alku on ainoa kohta joka on varmasti käytettävissä.
    oma.vaistyva = audio;
    oma.audio = luoSoitin(oma, { arvottuAlku: false, nouse: SILMUKKA_RISTI_MS });
    haivyta(audio, 0, () => {
      audio.pause();
      audio.removeAttribute('src');
      if (oma.vaistyva === audio) oma.vaistyva = null;
    }, SILMUKKA_RISTI_MS);
  };
  audio.addEventListener('timeupdate', () => {
    if (nykyinen !== oma || oma.audio !== audio) return;
    if (!Number.isFinite(audio.duration)) return;
    if (audio.duration - audio.currentTime > risti) return;
    vaihda();
  });
  // Varareitti: jos timeupdate ei ehtinyt laukaista vaihtoa (hidas
  // laite, taustavälilehti), kierros alkaa heti nauhan loputtua.
  audio.addEventListener('ended', vaihda);
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
  saadaVaistoa(0.15);
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
 *
 * Väistö talletetaan kertoimena, ei pelkkänä häivytyksenä: kesken
 * väistön alkava silmukan kierros nousisi muuten täyteen voimaan ja
 * puhe hukkuisi sen alle.
 */
export function vaimennaTausta() {
  saadaVaistoa(0.15);
}

export function palautaTausta() {
  saadaVaistoa(1);
}

/** Asettaa väistökertoimen ja ajaa kaikki soivat kierrokset sen mukaiseksi. */
function saadaVaistoa(kerroin) {
  if (!nykyinen) return;
  nykyinen.vaimennus = kerroin;
  const kohde = taso(nykyinen);
  if (nykyinen.audio) haivyta(nykyinen.audio, kohde);
  // Ristihäivytyksen väistyvä puoli on jo matkalla nollaan — sitä ei
  // nosteta takaisin, muuten sauma kuuluisi uudestaan.
  if (nykyinen.vaistyva && kerroin < 1) haivyta(nykyinen.vaistyva, 0);
}

export function stopQuizMusic() {
  // Kaupungin ääni palaa täyteen voimaansa.
  saadaVaistoa(1);
  const vanha = musiikki;
  musiikki = null;
  if (!vanha) return;
  haivyta(vanha, 0, () => {
    vanha.pause();
    vanha.removeAttribute('src');
  });
}

