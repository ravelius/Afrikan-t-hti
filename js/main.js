// Käynnistys: aloitusruutu, pelin luonti, tallennus ja dialogit.

import { Game } from './game.js';
import { UI } from './ui.js';
import { sfx } from './sound.js';

const COLORS = ['#d94f3d', '#3d7dd9', '#4caf50', '#e6b422'];
const START_CITIES = [
  { id: 'tanger', name: 'Tanger' },
  { id: 'kairo', name: 'Kairo' },
];
const SAVE_KEY = 'afrikan-tahti-save-v1';

const setupDialog = document.getElementById('setup');
const setupForm = document.getElementById('setup-form');
const countSelect = document.getElementById('player-count');
const playerSetup = document.getElementById('player-setup');
const rulesDialog = document.getElementById('rules-dialog');
const winnerDialog = document.getElementById('winner-dialog');

let ui = null;

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

// --- aloitusruutu ----------------------------------------------------------

function buildPlayerRows() {
  const count = Number(countSelect.value);
  playerSetup.textContent = '';
  for (let i = 0; i < count; i++) {
    const row = document.createElement('div');
    row.className = 'setup-row';

    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.background = COLORS[i];
    row.appendChild(dot);

    const name = document.createElement('input');
    name.type = 'text';
    name.value = `Pelaaja ${i + 1}`;
    name.maxLength = 16;
    name.dataset.role = 'name';
    row.appendChild(name);

    const start = document.createElement('select');
    start.dataset.role = 'start';
    for (const city of START_CITIES) {
      const opt = document.createElement('option');
      opt.value = city.id;
      opt.textContent = city.name;
      start.appendChild(opt);
    }
    start.value = i % 2 === 0 ? 'tanger' : 'kairo';
    row.appendChild(start);

    const botLabel = document.createElement('label');
    botLabel.className = 'bot-label';
    const bot = document.createElement('input');
    bot.type = 'checkbox';
    bot.dataset.role = 'bot';
    bot.checked = i > 0;
    botLabel.appendChild(bot);
    botLabel.appendChild(document.createTextNode('botti'));
    row.appendChild(botLabel);

    playerSetup.appendChild(row);
  }
}

function readPlayers() {
  return [...playerSetup.querySelectorAll('.setup-row')].map((row, i) => ({
    name: row.querySelector('[data-role="name"]').value.trim() || `Pelaaja ${i + 1}`,
    start: row.querySelector('[data-role="start"]').value,
    isBot: row.querySelector('[data-role="bot"]').checked,
    color: COLORS[i],
  }));
}

function attach(game) {
  if (ui) ui.destroy();
  ui = new UI(game, { onNewGame: openSetup, onChange: saveGame });
  ui.mount();
  window.afrikanTahti = { game, ui, sfx }; // kehityksen apuri konsolia varten
}

function startGame() {
  clearSave();
  attach(new Game({ players: readPlayers() }));
}

function openSetup() {
  if (winnerDialog.open) winnerDialog.close();
  clearSave();
  buildPlayerRows();
  setupDialog.showModal();
}

// --- äänet ------------------------------------------------------------------

const soundBtn = document.getElementById('sound-btn');

function updateSoundButton() {
  soundBtn.textContent = sfx.enabled ? '🔊' : '🔇';
  soundBtn.title = sfx.enabled ? 'Äänet päällä' : 'Äänet pois';
}

soundBtn.addEventListener('click', () => {
  sfx.setEnabled(!sfx.enabled);
  updateSoundButton();
});
updateSoundButton();

// Napsautusääni kaikille napeille; vastausvaihtoehdoilla on omat äänensä.
document.addEventListener('pointerdown', (event) => {
  const button = event.target.closest?.('button');
  if (button && !button.classList.contains('quiz-option')) sfx.play('click');
});

countSelect.addEventListener('change', buildPlayerRows);
setupForm.addEventListener('submit', () => {
  // Dialogin sulkeutuminen tapahtuu selaimen toimesta; peli luodaan sen jälkeen.
  setTimeout(startGame, 0);
});

document.getElementById('newgame-btn').addEventListener('click', openSetup);
document.getElementById('rules-btn').addEventListener('click', () => rulesDialog.showModal());
document.getElementById('rules-close').addEventListener('click', () => rulesDialog.close());
document.getElementById('winner-close').addEventListener('click', openSetup);

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
else openSetup();
