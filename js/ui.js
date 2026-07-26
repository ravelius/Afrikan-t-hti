// Käyttöliittymä: aarrekartan piirto, ohjauspaneeli, tietovisa ja bottien ohjaus.

import { AIR_ROUTES } from './board.js';
import { pixelOf, pointAlong, posKey } from './rules.js';
import { TOKEN_TYPES } from './tokens.js';
import { chooseAction, chooseMove, chooseQuizAnswer, wantsHint } from './ai.js';
import { FIFTY_FIFTY_PRICE, FLIGHT_PRICE } from './game.js';
import {
  el,
  drawCompass,
  drawDefs,
  drawDoodles,
  drawLand,
  drawPaperOverlay,
  drawParchment,
  drawTerrain,
  drawTokenIcon,
  drawWaves,
  tokenIconSvg,
} from './mapart.js';

const DIE_FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
const BOT_DELAY = 650;
const BOT_QUIZ_DELAY = 1500; // botin kysymys jää hetkeksi näkyviin luettavaksi
const LETTERS = ['A', 'B', 'C', 'D'];
const COMPASS = { x: 168, y: 772, r: 62 };

// Animaatioiden rytmi millisekunteina.
const STEP_MS = 190; // yksi askel kartalla
const FLIGHT_MS = 900;
const TOAST_MS = { die: 950, default: 1200 };

// Paljastusruudun alateksti laattatyypeittäin.
const REVEAL_SUB = {
  star: 'Vie tähti kotiin ja voitat pelin!',
  horseshoe: 'Voit voittaa, jos ehdit kotiin ensimmäisenä',
  robber: 'Ryöstäjä vie kaikki rahat',
  empty: 'Ei aarretta täällä',
};

function html(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export class UI {
  constructor(game, { onNewGame, onChange }) {
    this.game = game;
    this.onNewGame = onNewGame;
    this.onChange = onChange;
    this.botTimer = null;

    this.svg = document.getElementById('board');
    this.hint = document.getElementById('board-hint');
    this.playersEl = document.getElementById('players');
    this.turnPill = document.getElementById('turn-pill');
    this.turnStatus = document.getElementById('turn-status');
    this.dieEl = document.getElementById('die');
    this.actionsEl = document.getElementById('actions');
    this.errorEl = document.getElementById('error');
    this.logEl = document.getElementById('log');

    this.winnerDialog = document.getElementById('winner-dialog');
    this.quizDialog = document.getElementById('quiz-dialog');
    this.quizCity = document.getElementById('quiz-city');
    this.quizQuestion = document.getElementById('quiz-question');
    this.quizOptions = document.getElementById('quiz-options');
    this.quizResult = document.getElementById('quiz-result');
    this.quizHint = document.getElementById('quiz-hint');
    this.quizHint.addEventListener('click', () => this.doAction(() => this.game.actionFiftyFifty()));
    this.quizContinue = document.getElementById('quiz-continue');
    this.quizContinue.addEventListener('click', () => this.doAction(() => this.game.closeQuiz()));

    this.mapPane = this.svg.parentElement;
    this.busy = false;
    this.movingPlayerId = null;
    this.revealShownFor = null;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  mount() {
    this.drawBoard();
    this.fitViewBox();
    this.observer = new ResizeObserver(() => this.fitViewBox());
    this.observer.observe(this.svg.parentElement);
    this.render();
  }

  destroy() {
    clearTimeout(this.botTimer);
    this.observer?.disconnect();
  }

  /**
   * Venyttää näkymäikkunan ruudun muotoiseksi, jolloin pergamentti täyttää
   * koko alueen ja pelialue pysyy silti kokonaan näkyvissä.
   */
  fitViewBox() {
    const pane = this.svg.parentElement;
    const w = pane.clientWidth;
    const h = pane.clientHeight;
    if (!w || !h) return;
    const size = 1000;
    const [vw, vh] = w > h ? [size * (w / h), size] : [size, size / (w / h)];
    this.svg.setAttribute('viewBox', `${500 - vw / 2} ${500 - vh / 2} ${vw} ${vh}`);
  }

  /** Kohdat, joihin maastokuvioita ei saa piirtää: kaupungit, nimet ja reitit. */
  mapObstacles() {
    const { board } = this.game;
    const spots = [];
    for (const c of board.cities) {
      spots.push({ x: c.x, y: c.y });
      spots.push({ x: c.x + (c.lx ?? 0), y: c.y + (c.ly ?? -20) });
      spots.push({ x: c.x + 21, y: c.y + 17 }); // laatan paikka
    }
    for (const e of board.edges) {
      const a = board.cityById.get(e.a);
      const b = board.cityById.get(e.b);
      const steps = Math.max(e.steps * 2, 4);
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        spots.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
    }
    return spots;
  }

  // --- kartta -------------------------------------------------------------

  drawBoard() {
    const { board } = this.game;
    this.svg.textContent = '';

    drawDefs(this.svg);
    drawParchment(this.svg);
    drawLand(this.svg);
    drawWaves(this.svg, [
      { x: COMPASS.x, y: COMPASS.y, r: COMPASS.r + 45 },
      { x: 232, y: 556, r: 95 },
      { x: 858, y: 905, r: 110 },
      { x: 880, y: 92, r: 135 },
    ]);
    drawTerrain(this.svg, this.mapObstacles());
    drawCompass(this.svg, COMPASS.x, COMPASS.y, COMPASS.r);
    drawDoodles(this.svg);

    // Lentoreitit kaarina.
    const air = el('g', { class: 'air-routes' }, this.svg);
    for (const route of AIR_ROUTES) {
      const a = board.cityById.get(route.a);
      const b = board.cityById.get(route.b);
      const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.12;
      const my = (a.y + b.y) / 2 - (b.x - a.x) * 0.12;
      el('path', { d: `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`, class: 'air-route' }, air);
    }

    // Reitit ja askelpisteet. Merireitit kaartavat rannikon ympäri.
    const routes = el('g', { class: 'routes', filter: 'url(#rough-soft)' }, this.svg);
    for (const e of board.edges) {
      const d = e.poly.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
      el('path', { d, class: `route route-${e.type}` }, routes);
      for (let i = 1; i < e.steps; i++) {
        const { x, y } = pointAlong(e.poly, i / e.steps);
        el('circle', { cx: x, cy: y, r: 6, class: `step step-${e.type}` }, routes);
      }
    }

    // Laivamatkojen hinnat erikseen, jotta teksti pysyy terävänä.
    const fares = el('g', { class: 'fares' }, this.svg);
    for (const e of board.edges) {
      if (e.type !== 'sea') continue;
      const mid = pointAlong(e.poly, 0.5);
      el('text', {
        x: mid.x,
        y: mid.y - 12,
        class: 'fare',
        'text-anchor': 'middle',
      }, fares).textContent = `⚓${e.fee}`;
    }

    // Kaupungit ja nimet.
    const cities = el('g', { class: 'cities' }, this.svg);
    for (const c of board.cities) {
      if (c.start) {
        el('circle', { cx: c.x, cy: c.y, r: 20, class: 'city-start' }, cities);
        el('circle', { cx: c.x, cy: c.y, r: 12, class: 'coast-soft' }, cities);
      } else {
        el('circle', { cx: c.x, cy: c.y, r: 12, class: 'city' }, cities);
      }
      if (c.airport) {
        el('text', {
          x: c.x, y: c.y + 5, class: 'airport', 'text-anchor': 'middle',
        }, cities).textContent = '✈';
      }
      const anchor = c.la ?? 'middle';
      const dx = c.lx ?? 0;
      const dy = c.ly ?? -(c.start ? 28 : 19);
      const label = el('text', {
        x: c.x + dx,
        y: c.y + dy,
        class: c.start ? 'city-label start-label' : 'city-label',
        'text-anchor': anchor,
      }, cities);
      label.textContent = c.name;
    }

    this.tokenLayer = el('g', { class: 'tokens' }, this.svg);
    this.targetLayer = el('g', { class: 'targets' }, this.svg);
    this.pawnLayer = el('g', { class: 'pawns' }, this.svg);
    drawPaperOverlay(this.svg);
  }

  /** Kartalla näkyvät vain käännetyt laatat omina kuvakkeinaan. */
  drawTokens() {
    const { game } = this;
    this.tokenLayer.textContent = '';
    for (const [cityId, type] of game.revealed) {
      const city = game.board.cityById.get(cityId);
      const g = el('g', {
        class: 'token-found',
        transform: `translate(${city.x + 22},${city.y + 18})`,
      }, this.tokenLayer);
      el('circle', { r: 17, class: 'token-disc' }, g);
      const icon = drawTokenIcon(g, type);
      icon.setAttribute('transform', 'scale(0.88)');
    }
  }

  drawTargets() {
    const { game } = this;
    this.targetLayer.textContent = '';
    if (game.phase !== 'move' || game.player.isBot) return;
    for (const opt of game.moveOptions()) {
      const { x, y } = pixelOf(game.board, opt.pos);
      const g = el('g', { class: 'target' }, this.targetLayer);
      el('circle', { cx: x, cy: y, r: 30, class: 'target-hit' }, g);
      el('circle', { cx: x, cy: y, r: opt.city ? 22 : 14, class: 'target-ring' }, g);
      if (opt.cost) {
        el('text', {
          x, y: y - 28, class: 'target-cost', 'text-anchor': 'middle',
        }, g).textContent = `−${opt.cost}`;
      }
      g.addEventListener('click', () => this.doMove(opt.key));
    }
  }

  /** Pelinappula: varjo, vaalea kehys, pelaajan väri ja kiilto. */
  pawnShape(parent, player, active) {
    const g = el('g', { class: 'pawn' }, parent);
    el('ellipse', { cx: 2, cy: 9, rx: 11, ry: 4, class: 'pawn-shadow' }, g);
    if (active) {
      el('circle', { r: 15, class: 'pawn-pulse', stroke: player.color }, g);
      el('circle', { r: 17, class: 'pawn-active-ring' }, g);
    }
    el('circle', { r: 13, class: 'pawn-ring' }, g);
    el('circle', { r: 9.5, fill: player.color, class: 'pawn-dot' }, g);
    el('path', { d: 'M-5,-3 a6,6 0 0 1 8,-3', class: 'pawn-gloss', fill: 'none',
      stroke: 'rgba(255,255,255,0.6)', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, g);
    if (player.hasStar) {
      el('text', { x: 0, y: -18, class: 'pawn-star', 'text-anchor': 'middle' }, g).textContent = '★';
    }
    return g;
  }

  drawPawns() {
    const { game } = this;
    this.pawnLayer.textContent = '';
    const groups = new Map();
    for (const p of game.players) {
      if (p.id === this.movingPlayerId) continue; // liikkuva nappula piirretään erikseen
      const key = posKey(p.pos);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(p);
    }
    for (const [, players] of groups) {
      const base = pixelOf(game.board, players[0].pos);
      players.forEach((p, i) => {
        const angle = (i / Math.max(players.length, 1)) * Math.PI * 2 - Math.PI / 2;
        const spread = players.length > 1 ? 17 : 0;
        const x = base.x + Math.cos(angle) * spread;
        const y = base.y + Math.sin(angle) * spread;
        const g = this.pawnShape(this.pawnLayer, p, p.id === game.current && !this.busy);
        g.setAttribute('transform', `translate(${x},${y})`);
      });
    }
  }

  // --- paneeli ------------------------------------------------------------

  renderTurnPill() {
    const { game } = this;
    this.turnPill.textContent = '';
    if (game.phase === 'over') {
      this.turnPill.appendChild(html('span', '', `🏆 ${game.winner.name} voitti`));
      return;
    }
    const p = game.player;
    const dot = html('span', 'dot');
    dot.style.background = p.color;
    this.turnPill.appendChild(dot);
    this.turnPill.appendChild(html('span', '', `Vuorossa: ${p.name}`));
  }

  renderPlayers() {
    const { game } = this;
    this.playersEl.textContent = '';
    for (const p of game.players) {
      const chip = html('div', 'player-chip' + (p.id === game.current ? ' current' : ''));

      const head = html('div', 'chip-head');
      const dot = html('span', 'dot');
      dot.style.background = p.color;
      head.appendChild(dot);
      head.appendChild(html('span', 'chip-name', p.name + (p.isBot ? ' 🤖' : '')));
      chip.appendChild(head);

      const row = html('div', 'chip-row');
      row.appendChild(html('span', 'money', `${p.money} p`));
      const marks = html('span', 'chip-marks');
      if (p.hasStar) marks.appendChild(tokenIconSvg('star', 17));
      for (let i = 0; i < p.horseshoes; i++) marks.appendChild(tokenIconSvg('horseshoe', 17));
      const gems = p.finds.filter((t) => TOKEN_TYPES[t].value > 0);
      if (gems.length) {
        marks.appendChild(tokenIconSvg(gems[gems.length - 1], 17));
        if (gems.length > 1) marks.appendChild(html('span', 'gem-count', `×${gems.length}`));
      }
      row.appendChild(marks);
      chip.appendChild(row);

      const city = game.cityOf(p);
      chip.appendChild(
        html('div', 'chip-row chip-where', city ? city.name : game.routeName(p.pos.edge)),
      );
      this.playersEl.appendChild(chip);
    }
  }

  renderActions() {
    const { game } = this;
    this.actionsEl.textContent = '';
    this.errorEl.hidden = true;

    if (game.phase === 'over') {
      this.turnStatus.textContent = 'Peli päättyi.';
      this.hint.textContent = '';
      this.dieEl.hidden = true;
      const again = html('button', 'primary', 'Uusi peli');
      again.addEventListener('click', () => this.onNewGame());
      this.actionsEl.appendChild(again);
      return;
    }

    const p = game.player;
    this.dieEl.hidden = game.die === null || game.die === undefined;
    if (!this.dieEl.hidden) this.dieEl.textContent = `${DIE_FACES[game.die]} ${game.die}`;

    if (p.isBot) {
      this.turnStatus.textContent = `${p.name} miettii…`;
      this.hint.textContent = '';
      return;
    }

    if (game.phase === 'move') {
      this.turnStatus.textContent = `Heitit ${game.die} — valitse kohde kartalta.`;
      this.hint.textContent = 'Napauta punaista rengasta kartalla.';
      return;
    }

    if (game.phase === 'quiz') {
      this.turnStatus.textContent = 'Tietovisa käynnissä.';
      this.hint.textContent = '';
      return;
    }

    this.hint.textContent = '';
    const actions = game.availableActions();
    const tokenCity = game.tokenHere();
    this.turnStatus.textContent = tokenCity
      ? `${tokenCity.name}: aarre aukeaa oikealla vastauksella.`
      : 'Valitse toiminto.';

    if (tokenCity) {
      const quizBtn = html('button', 'primary', '❓ Avaa laatta kysymyksellä');
      quizBtn.addEventListener('click', () => this.doAction(() => game.actionQuiz()));
      this.actionsEl.appendChild(quizBtn);
    }

    const rollBtn = html('button', tokenCity ? '' : 'primary', '🎲 Heitä noppa');
    rollBtn.addEventListener('click', () => this.doRoll());
    this.actionsEl.appendChild(rollBtn);

    for (const dest of actions.fly) {
      const city = game.board.cityById.get(dest);
      const flyBtn = html('button', '', `✈ ${city.name} (${FLIGHT_PRICE} p)`);
      flyBtn.addEventListener('click', () => this.doFly(dest));
      this.actionsEl.appendChild(flyBtn);
    }
  }

  renderLog() {
    this.logEl.textContent = '';
    for (const entry of this.game.log.slice(0, 40)) {
      const li = html('li', 'log-item');
      const dot = html('span', 'dot small');
      dot.style.background =
        entry.playerId === null ? 'transparent' : this.game.players[entry.playerId].color;
      li.appendChild(dot);
      li.appendChild(html('span', '', entry.text));
      this.logEl.appendChild(li);
    }
  }

  render() {
    this.onChange?.(this.game);
    this.drawTokens();
    this.drawTargets();
    this.drawPawns();
    this.renderTurnPill();
    this.renderPlayers();
    this.renderActions();
    this.renderLog();
    this.renderQuiz();

    if (this.game.phase === 'over') {
      this.showWinner();
      return;
    }
    this.scheduleBot();
  }

  showWinner() {
    clearTimeout(this.botTimer);
    const w = this.game.winner;
    document.getElementById('winner-title').textContent = `🏆 ${w.name} voitti!`;
    document.getElementById('winner-text').textContent = w.hasStar
      ? `${w.name} toi Afrikan tähden kotiin ${w.money} punnan kanssa.`
      : `${w.name} ehti hevosenkengän kanssa kotiin ennen tähden löytäjää.`;
    if (!this.winnerDialog.open) this.winnerDialog.showModal();
  }

  // --- tietovisa ----------------------------------------------------------

  renderQuiz() {
    const { game } = this;
    const quiz = game.quiz;
    if (game.phase !== 'quiz' || !quiz) {
      if (this.quizDialog.open) this.quizDialog.close();
      return;
    }

    const city = game.board.cityById.get(quiz.cityId);
    this.quizCity.textContent = `${city.name} — ${game.player.name}`;
    this.quizQuestion.textContent = quiz.question;
    this.quizOptions.textContent = '';

    quiz.options.forEach((text, i) => {
      const btn = html('button', 'quiz-option');
      btn.style.setProperty('--i', String(i));
      btn.appendChild(html('span', 'letter', LETTERS[i]));
      btn.appendChild(html('span', 'text', text));
      if (quiz.hidden.includes(i)) {
        btn.classList.add('hidden-option');
        btn.disabled = true;
      } else if (quiz.chosen !== null) {
        btn.disabled = true;
        if (i === quiz.correct) btn.classList.add('correct');
        if (i === quiz.chosen && !quiz.right) btn.classList.add('wrong');
      } else if (game.player.isBot) {
        btn.disabled = true;
      } else {
        btn.addEventListener('click', () => this.answerQuiz(i));
      }
      this.quizOptions.appendChild(btn);
    });

    const answered = quiz.chosen !== null;
    // Vastauksen jälkeen näytetään ensin pelkkä tuomio, ja vasta aarteen
    // paljastuksen jälkeen löytö ja selitys.
    const revealed = this.revealShownFor === quiz;

    // Vihjenappi: 50 punnalla kaksi väärää vaihtoehtoa pois.
    const p = game.player;
    const used = quiz.hidden.length > 0;
    this.quizHint.hidden = answered || p.isBot;
    this.quizHint.disabled = used || p.money < FIFTY_FIFTY_PRICE;
    this.quizHint.textContent = used
      ? '50:50 käytetty'
      : `50:50 — poista kaksi väärää (${FIFTY_FIFTY_PRICE} p)`;

    this.quizResult.hidden = !answered;
    if (answered) {
      this.quizResult.className = `quiz-result ${quiz.right ? 'right' : 'wrong'}`;
      this.quizResult.textContent = '';

      if (!revealed) {
        this.quizResult.appendChild(
          html('strong', 'quiz-verdict', quiz.right ? 'Oikein!' : 'Väärin.'),
        );
      } else {
        const found = quiz.found ? TOKEN_TYPES[quiz.found] : null;
        const body = html('div');
        if (quiz.right && found) {
          this.quizResult.appendChild(tokenIconSvg(quiz.found, 24));
          body.appendChild(html('strong', '', `Löysit: ${found.name}`));
        } else if (quiz.right) {
          body.appendChild(html('strong', '', 'Oikein!'));
        } else {
          body.appendChild(
            html('strong', '', `Oikea vastaus oli "${quiz.options[quiz.correct]}".`),
          );
          body.appendChild(
            html('span', 'muted', 'Vuoro vaihtuu — seuraavalla vuorolla saat uuden kysymyksen.'),
          );
        }
        if (quiz.fact) body.appendChild(html('span', 'muted', quiz.fact));
        this.quizResult.appendChild(body);
      }
    }
    this.quizContinue.hidden = !answered || !revealed || game.player.isBot;

    if (!this.quizDialog.open) this.quizDialog.showModal();
  }

  /**
   * Vastaus tietovisaan: ensin "Oikein!"/"Väärin.", pieni tauko ja sitten
   * aarteen paljastus, jossa iso laatta kääntyy ympäri.
   */
  answerQuiz(index) {
    const { game } = this;
    this.run(() => game.answerQuiz(index), {
      after: async () => {
        const quiz = game.quiz;
        if (!quiz) return;
        this.renderQuiz();
        await this.wait(this.reducedMotion ? 200 : 850);
        if (quiz.right && quiz.found) await this.playTokenReveal(quiz.found);
        this.revealShownFor = quiz;
        this.renderQuiz();
        if (!quiz.right) await this.wait(this.reducedMotion ? 0 : 500);
      },
    });
  }

  /** Iso laatta kääntyy ruudun keskellä ja paljastaa sisällön. */
  async playTokenReveal(type) {
    const token = TOKEN_TYPES[type];
    const overlay = html('div', 'reveal-overlay');
    const scene = html('div', 'reveal-scene');
    const disc = html('div', `reveal-disc ${type}`);

    const back = html('div', 'reveal-face reveal-back');
    back.appendChild(html('span', '', '?'));
    const front = html('div', 'reveal-face reveal-front');
    front.appendChild(tokenIconSvg(type, 160));
    disc.appendChild(back);
    disc.appendChild(front);

    const caption = html('div', 'reveal-caption');
    caption.appendChild(html('strong', '', token.name));
    caption.appendChild(html('span', '', REVEAL_SUB[type] ?? `+${token.value} puntaa`));

    scene.appendChild(disc);
    scene.appendChild(caption);
    overlay.appendChild(scene);
    // Dialogi on top layerissa, joten paljastus lisätään sen sisään.
    this.quizDialog.appendChild(overlay);

    if (this.reducedMotion) {
      disc.classList.add('flipped');
      caption.classList.add('shown');
      await this.wait(900);
    } else {
      await this.wait(420);
      disc.classList.add('flipped');
      await this.wait(760);
      caption.classList.add('shown');
      await this.wait(1250);
      overlay.classList.add('leaving');
      await this.wait(300);
    }
    overlay.remove();
  }

  // --- toiminnot ja animaatiot ---------------------------------------------

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  showError(message) {
    this.errorEl.textContent = message;
    this.errorEl.hidden = false;
  }

  /**
   * Suorittaa toiminnon ja antaa animaatioiden pyöriä rauhassa: uusi klikkaus
   * tai botin vuoro odottaa, kunnes edellinen tapahtuma on näytetty.
   */
  async run(fn, { after } = {}) {
    if (this.busy) return;
    this.busy = true;
    this.actionsEl.dataset.busy = 'true';
    try {
      const result = fn();
      if (result && result.ok === false) {
        this.showError(result.error);
        return;
      }
      if (after) await after(result);
      await this.playEvents();
    } finally {
      this.busy = false;
      delete this.actionsEl.dataset.busy;
      this.render();
    }
  }

  doAction(fn) {
    this.run(fn);
  }

  /** Nopanheitto: silmäluku pyörii kartan päällä ja jää hetkeksi näkyviin. */
  doRoll() {
    this.run(() => this.game.actionRoll(), { after: (result) => this.animateDie(result.die) });
  }

  /** Siirto: nappula hyppii reittiä pitkin piste kerrallaan. */
  doMove(key) {
    const { game } = this;
    const move = game.moves?.get(key);
    if (!move) return;
    const player = game.player;
    const from = player.pos;
    const path = move.path;
    this.run(() => game.actionMove(key), { after: () => this.animatePawn(player, from, path) });
  }

  doFly(destination) {
    const { game } = this;
    const player = game.player;
    const from = player.pos;
    this.run(() => game.actionFly(destination), {
      after: () => this.animatePawn(player, from, [player.pos], FLIGHT_MS),
    });
  }

  /** Siirtää nappulaa askel kerrallaan annettua polkua pitkin. */
  async animatePawn(player, from, path, stepMs = STEP_MS) {
    if (!path || path.length === 0) return;
    const { board } = this.game;

    this.movingPlayerId = player.id;
    this.drawPawns();
    const g = this.pawnShape(this.pawnLayer, player, false);
    g.classList.add('pawn-moving');
    if (stepMs !== STEP_MS) g.style.transitionDuration = `${stepMs}ms`;

    const start = pixelOf(board, from);
    g.style.transform = `translate(${start.x}px, ${start.y}px)`;
    g.getBoundingClientRect(); // varmistaa, että ensimmäinenkin askel animoituu

    for (const pos of path) {
      const { x, y } = pixelOf(board, pos);
      g.style.transform = `translate(${x}px, ${y}px)`;
      await this.wait(this.reducedMotion ? 0 : stepMs);
    }

    g.remove();
    this.movingPlayerId = null;
    this.revealShownFor = null;
    this.drawPawns();
  }

  /** Noppa pyörii kartan päällä ja pysähtyy silmälukuun. */
  async animateDie(value) {
    if (!value) return;
    this.dieEl.hidden = false;
    this.dieEl.textContent = `${DIE_FACES[value]} ${value}`;
    if (this.reducedMotion) return;

    const toast = this.buildToast({ kind: 'die', text: 'Noppa pyörii…' });
    const icon = toast.querySelector('.toast-icon');
    const label = toast.querySelector('.toast-text');

    for (let i = 0; i < 8; i++) {
      icon.textContent = DIE_FACES[1 + Math.floor(Math.random() * 6)];
      await this.wait(70);
    }
    icon.textContent = DIE_FACES[value];
    label.textContent = `Heitit ${value}`;
    toast.classList.add('landed');
    await this.wait(TOAST_MS.die);
    await this.removeToast(toast);
  }

  buildToast({ kind, text, sub, icon, token }) {
    const box = html('div', `event-toast ${kind === 'robber' ? 'bad' : kind}`);
    if (token) box.appendChild(tokenIconSvg(token, kind === 'die' ? 30 : 34));
    else box.appendChild(html('span', 'toast-icon', icon ?? '•'));
    const body = html('div');
    body.appendChild(html('span', 'toast-text', text));
    if (sub) body.appendChild(html('span', 'toast-sub', sub));
    box.appendChild(body);
    this.mapPane.appendChild(box);
    return box;
  }

  async removeToast(box) {
    box.classList.add('leaving');
    await this.wait(this.reducedMotion ? 0 : 300);
    box.remove();
  }

  /** Näyttää kertyneet tapahtumat yksi kerrallaan kartan päällä. */
  async playEvents() {
    // Aarre ja ryöstäjä nähdään jo paljastusanimaatiossa, joten niitä ei toisteta.
    const events = this.game.takeEvents().filter((e) => e.kind !== 'treasure' && e.kind !== 'robber');
    for (const event of events) {
      const box = this.buildToast(event);
      await this.wait(this.reducedMotion ? 0 : TOAST_MS[event.kind] ?? TOAST_MS.default);
      await this.removeToast(box);
    }
  }

  scheduleBot() {
    clearTimeout(this.botTimer);
    const { game } = this;
    if (this.busy || game.phase === 'over' || !game.player.isBot) return;
    const delay = game.phase === 'quiz' ? BOT_QUIZ_DELAY : BOT_DELAY;
    this.botTimer = setTimeout(() => this.botStep(), delay);
  }

  botStep() {
    const { game } = this;
    if (this.busy || game.phase === 'over' || !game.player.isBot) return;

    if (game.phase === 'quiz') {
      if (game.quiz.chosen !== null) this.run(() => game.closeQuiz());
      else if (wantsHint(game)) this.run(() => game.actionFiftyFifty());
      else this.answerQuiz(chooseQuizAnswer(game));
      return;
    }

    if (game.phase === 'move') {
      const key = chooseMove(game);
      if (key) this.doMove(key);
      else this.run(() => game.endTurn());
      return;
    }

    const action = chooseAction(game);
    if (action.type === 'quiz') this.run(() => game.actionQuiz());
    else if (action.type === 'fly') this.doFly(action.destination);
    else this.doRoll();
  }
}
