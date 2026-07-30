// Käynnistys: aloitusruutu, pelin luonti, tallennus ja dialogit.

import { Game } from './game.js';
import { UI } from './ui.js';
import { sfx } from './sound.js';
import { packById } from './pack.js';
import { startQuizMusic, stopPlaceStream, stopQuizMusic } from './ambience-stream.js';

const PLAYER_COLOR = '#d94f3d';
const SAVE_KEY = 'afrikan-tahti-save-v1';
const APP_VERSION = '2026-07-30.65';

const rulesDialog = document.getElementById('rules-dialog');
const winnerDialog = document.getElementById('winner-dialog');

let ui = null;

// Pystyasento. Androidilla tämä lukitsee laitteen; iOS ei tue rajapintaa,
// joten siellä vaaka-asennon hoitaa css:n .rotate-guard.
try {
  screen.orientation?.lock?.('portrait').catch(() => {});
} catch {
  /* selain ei tue lukitusta — kehote riittää */
}

// --- tallennus -------------------------------------------------------------

function saveGame(game) {
  try {
    if (game.phase === 'over') localStorage.removeItem(SAVE_KEY);
    else localStorage.setItem(SAVE_KEY, JSON.stringify(game.toJSON()));
  } catch {
    /* yksityinen selaustila tai täysi levy — peli jatkuu ilman tallennusta */
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const game = Game.fromJSON(JSON.parse(raw));
    return game && game.phase !== 'over' ? game : null;
  } catch {
    return null;
  }
}

function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* ei mitään tehtävissä */
  }
}

// --- pelin aloitus ----------------------------------------------------------
//
// Peli on yksin pelattava vaellus eikä aloitusdialogia enää ole: uusi peli
// avautuu suoraan maailmankartalle, jolta ensimmäinen kohde valitaan
// ilmaiseksi. Matkaaja on aina herra Fogg.
//
// Kysymysten helpotustila on toistaiseksi pois käytöstä — kaikki pelaavat
// tasolla 'normal'. Kysymyspankkien level-kentät ja moottorin tuki jäävät
// paikoilleen, jotta helpotus voidaan palauttaa myöhemmin.

function newPlayer() {
  return {
    name: 'Herra Fogg',
    start: null, // lähtöpiste valitaan maailmankartalta
    quizLevel: 'normal',
    color: PLAYER_COLOR,
  };
}

function attach(game) {
  if (ui) ui.destroy();
  ui = new UI(game, { onNewGame: startGame, onChange: saveGame });
  ui.mount();
  window.afrikanTahti = { game, ui, sfx }; // kehityksen apuri konsolia varten
}

function startGame() {
  if (winnerDialog.open) winnerDialog.close();
  clearSave();
  attach(new Game({ players: [newPlayer()], pack: packById('maailma') }));
}

// --- äänet ------------------------------------------------------------------

// Mykistysnappi palasi yläpalkkiin (omistajan toive). Tila luetaan
// sound.js:n omasta talletuksesta, joten valinta muistetaan käyntien yli.
const muteBtn = document.getElementById('mute-btn');
const naytaMykistys = () => {
  document.getElementById('mute-on').hidden = !sfx.enabled;
  document.getElementById('mute-off').hidden = sfx.enabled;
  muteBtn.title = sfx.enabled ? 'Mykistä äänet' : 'Palauta äänet';
  muteBtn.setAttribute('aria-pressed', String(!sfx.enabled));
};
muteBtn.addEventListener('click', () => {
  sfx.setEnabled(!sfx.enabled); // palatessa kuuluu kuittausklikki
  if (!sfx.enabled) {
    // Kaikki soiva hiljenee heti: striimit, luennat ja lentomoottori.
    stopPlaceStream();
    stopQuizMusic();
    sfx.stopFlight();
    ui?.stopDiaryVoice();
    ui?.stopIntroVoice();
  } else {
    ui?.syncAmbience();
    if (ui?.game?.quiz) startQuizMusic(ui.game.pack.id);
  }
  naytaMykistys();
});
naytaMykistys();

// Napsautusääni kaikille napeille; vastausvaihtoehdoilla on omat äänensä.
document.addEventListener('pointerdown', (event) => {
  const button = event.target.closest?.('button');
  if (button && !button.classList.contains('quiz-option')) sfx.play('click');
});

// --- päivitys ----------------------------------------------------------------

/**
 * Hakee uusimman version: poistaa palvelutyöntekijän välimuistit ja lataa
 * sivun uudelleen. Kesken oleva peli säilyy, koska se on tallennettu erikseen.
 */
const updateBtn = document.getElementById('update-btn');
updateBtn.addEventListener('click', async () => {
  updateBtn.disabled = true;
  updateBtn.textContent = 'Päivitetään…';
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((reg) => reg.unregister()));
    }
    if (window.caches) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  } catch {
    /* päivitys onnistuu myös ilman välimuistin siivousta */
  }
  location.reload();
});

document.getElementById('app-version').textContent = APP_VERSION;
// Kulmaan lyhyt muoto ("v39") — koko päivämäärä on sääntöjen alalaidassa.
document.getElementById('versio-kulma').textContent = `v${APP_VERSION.split('.').pop()}`;
document.getElementById('newgame-btn').addEventListener('click', startGame);
document.getElementById('rules-btn').addEventListener('click', () => rulesDialog.showModal());
// Passi kuuluu pelaajalle eikä yksittäiselle pelille, joten nappi kytketään
// kerran täällä eikä käyttöliittymän mukana joka uudessa pelissä.
document.getElementById('passport-btn').addEventListener('click', () => ui?.openPassport());
document.getElementById('rules-close').addEventListener('click', () => rulesDialog.close());
document.getElementById('winner-close').addEventListener('click', startGame);

// Palvelutyöntekijä tekee pelistä asennettavan ja offline-toimivan.
// Ohitetaan hiljaisesti, jos sivu on avattu file://-osoitteesta tai hiekkalaatikossa.
// Yhden tiedoston versiossa ei ole manifestia eikä sw.js:ää, joten rekisteröinti
// tehdään vain kun sivulla on manifest-linkki.
const hasManifest = !!document.querySelector('link[rel="manifest"]');
if (hasManifest && 'serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      /* offline-tuki ei ole käytettävissä — peli toimii silti */
    });
  });

  // Kotivalikkoon asennettu sovellus voi herätä viikkojen takaa samaan
  // sivuun, jolloin uusi versio ei koskaan pääse käyttöön itsestään.
  // Kun uusi palvelutyöntekijä ottaa ohjat, sivu ladataan kerran
  // uudelleen — kesken oleva peli jatkuu tallennuksesta. Ensiasennuksessa
  // ohjaimen ilmestyminen ei ole päivitys, joten silloin ei ladata.
  let oliOhjain = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!oliOhjain) {
      oliOhjain = true;
      return;
    }
    location.reload();
  });

  // Päivitystarkistus aina, kun sovellus palaa esiin taustalta.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    navigator.serviceWorker.getRegistration()
      .then((reg) => reg?.update())
      .catch(() => { /* tarkistus epäonnistui — yritetään taas seuraavalla kerralla */ });
  });
}

// Katselutila: ?lauta=<id> avaa laudan kartan suoraan ilman porttia,
// avaustekstiä ja tallennusta — työhuoneen Maanosat-välilehti näyttää
// kartat tällä. Kaupunkia voi klikata ja lautaa kokeilla vapaasti:
// mikään ei kirjoita tallennettua peliä yli, ja Uusi peli -nappi on
// piilossa, ettei se tyhjentäisi oikeaa tallennusta.
function avaaKatselu(pack) {
  document.body.classList.add('katselu');
  const game = new Game({ players: [newPlayer()], pack });
  if (ui) ui.destroy();
  ui = new UI(game, { onNewGame: () => {}, onChange: () => {} });
  ui.katselu = true;
  ui.aloitettu = true;
  ui.mount();
  window.afrikanTahti = { game, ui, sfx };
}

let katseluPack = null;
try {
  const lauta = new URLSearchParams(location.search).get('lauta');
  katseluPack = lauta ? packById(lauta) ?? null : null;
} catch {
  katseluPack = null;
}

// Kesken jäänyt peli jatkuu automaattisesti, muuten kysytään pelaajat.
if (katseluPack) {
  avaaKatselu(katseluPack);
} else {
  const saved = loadGame();
  if (saved) attach(saved);
  else startGame();
}
