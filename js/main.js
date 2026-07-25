// Käynnistys: aloitusruutu, pelin luonti ja dialogit.

import { Game } from './game.js';
import { UI } from './ui.js';

const COLORS = ['#d94f3d', '#3d7dd9', '#4caf50', '#e6b422'];
const START_CITIES = [
  { id: 'tanger', name: 'Tanger' },
  { id: 'kairo', name: 'Kairo' },
];

const setupDialog = document.getElementById('setup');
const setupForm = document.getElementById('setup-form');
const countSelect = document.getElementById('player-count');
const playerSetup = document.getElementById('player-setup');
const rulesDialog = document.getElementById('rules-dialog');
const winnerDialog = document.getElementById('winner-dialog');

let ui = null;

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

function startGame() {
  if (ui) ui.destroy();
  const game = new Game({ players: readPlayers() });
  ui = new UI(game, { onNewGame: openSetup });
  ui.mount();
  window.afrikanTahti = { game, ui }; // kehityksen apuri konsolia varten
}

function openSetup() {
  if (winnerDialog.open) winnerDialog.close();
  buildPlayerRows();
  setupDialog.showModal();
}

countSelect.addEventListener('change', buildPlayerRows);
setupForm.addEventListener('submit', () => {
  // Dialogin sulkeutuminen tapahtuu selaimen toimesta; peli luodaan sen jälkeen.
  setTimeout(startGame, 0);
});

document.getElementById('newgame-btn').addEventListener('click', openSetup);
document.getElementById('rules-btn').addEventListener('click', () => rulesDialog.showModal());
document.getElementById('rules-close').addEventListener('click', () => rulesDialog.close());
document.getElementById('winner-close').addEventListener('click', openSetup);

openSetup();
