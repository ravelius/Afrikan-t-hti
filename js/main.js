// Käynnistys: aloitusruutu, pelin luonti, tallennus ja dialogit.

import { Game } from './game.js';
import { UI } from './ui.js';
import { sfx } from './sound.js';
import { packById } from './pack.js';

const PLAYER_COLOR = '#d94f3d';
const SAVE_KEY = 'afrikan-tahti-save-v1';
const APP_VERSION = '2026-07-29.6';

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

// Äänet ovat aina päällä: erillinen vaimennusnappi poistettiin yläpalkista,
// ja laitteen oma äänenvoimakkuus riittää. Asetetaan lippu suoraan, jottei
// setEnabled soita kuittausääntä heti sivun latauduttua — ja jotta aiemmin
// vaimennettu peli ei jäisi mykäksi ilman nappia, jolla äänet saisi takaisin.
sfx.enabled = true;

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
}

// Kesken jäänyt peli jatkuu automaattisesti, muuten kysytään pelaajat.
const saved = loadGame();
if (saved) attach(saved);
else startGame();
