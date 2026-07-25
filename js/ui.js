// Käyttöliittymä: SVG-kartan piirto, napit ja botin ohjaus.

import { MAP, AIR_ROUTES } from './board.js';
import { pixelOf, posKey } from './rules.js';
import { TOKEN_TYPES } from './tokens.js';
import { chooseAction, chooseMove, chooseQuizAnswer } from './ai.js';
import { TOKEN_PRICE, FLIGHT_PRICE } from './game.js';

const NS = 'http://www.w3.org/2000/svg';
const DIE_FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
const BOT_DELAY = 850;
const BOT_QUIZ_DELAY = 1500; // botin kysymys jää hetkeksi näkyviin luettavaksi
const LETTERS = ['A', 'B', 'C', 'D'];

function el(tag, attrs = {}, parent = null) {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  if (parent) parent.appendChild(node);
  return node;
}

function html(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export class UI {
  constructor(game, { onNewGame }) {
    this.game = game;
    this.onNewGame = onNewGame;
    this.botTimer = null;
    this.svg = document.getElementById('board');
    this.hint = document.getElementById('board-hint');
    this.playersEl = document.getElementById('players');
    this.turnTitle = document.getElementById('turn-title');
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
    this.quizContinue = document.getElementById('quiz-continue');
    this.quizContinue.addEventListener('click', () => this.doAction(() => this.game.closeQuiz()));
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  mount() {
    this.drawBoard();
    this.render();
  }

  destroy() {
    clearTimeout(this.botTimer);
  }

  // --- kartta -------------------------------------------------------------

  drawBoard() {
    const { board } = this.game;
    this.svg.textContent = '';

    el('rect', { x: 0, y: 0, width: MAP.width, height: MAP.height, class: 'ocean' }, this.svg);
    el('path', { d: MAP.africa, class: 'land' }, this.svg);
    el('path', { d: MAP.madagascar, class: 'land' }, this.svg);

    // Lentoreitit kaarina taustalle.
    for (const route of AIR_ROUTES) {
      const a = board.cityById.get(route.a);
      const b = board.cityById.get(route.b);
      const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.12;
      const my = (a.y + b.y) / 2 - (b.x - a.x) * 0.12;
      el('path', { d: `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`, class: 'air-route' }, this.svg);
    }

    // Reitit ja niiden askelpisteet.
    const routes = el('g', { class: 'routes' }, this.svg);
    for (const e of board.edges) {
      const a = board.cityById.get(e.a);
      const b = board.cityById.get(e.b);
      el(
        'line',
        { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: `route route-${e.type}` },
        routes,
      );
      for (let i = 1; i < e.steps; i++) {
        const t = i / e.steps;
        el(
          'circle',
          {
            cx: a.x + (b.x - a.x) * t,
            cy: a.y + (b.y - a.y) * t,
            r: 6,
            class: `step step-${e.type}`,
          },
          routes,
        );
      }
      if (e.type === 'sea') {
        el(
          'text',
          {
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2 - 12,
            class: 'fare',
            'text-anchor': 'middle',
          },
          routes,
        ).textContent = `${e.fee}`;
      }
    }

    // Kaupungit.
    const cities = el('g', { class: 'cities' }, this.svg);
    for (const c of board.cities) {
      el(
        'circle',
        { cx: c.x, cy: c.y, r: c.start ? 17 : 12, class: c.start ? 'city city-start' : 'city' },
        cities,
      );
      if (c.airport) {
        el('text', { x: c.x, y: c.y + 5, class: 'airport', 'text-anchor': 'middle' }, cities)
          .textContent = '✈';
      }
      // la/lx/ly siirtävät nimilapun pois päällekkäisyyksistä.
      const anchor = c.la ?? 'middle';
      const dx = c.lx ?? 0;
      const dy = c.ly ?? -(c.start ? 24 : 19);
      const label = el(
        'text',
        { x: c.x + dx, y: c.y + dy, class: 'city-label', 'text-anchor': anchor },
        cities,
      );
      label.textContent = c.name;
    }

    this.tokenLayer = el('g', { class: 'tokens' }, this.svg);
    this.targetLayer = el('g', { class: 'targets' }, this.svg);
    this.pawnLayer = el('g', { class: 'pawns' }, this.svg);
  }

  drawTokens() {
    const { game } = this;
    this.tokenLayer.textContent = '';
    for (const cityId of game.board.cities.map((c) => c.id)) {
      const city = game.board.cityById.get(cityId);
      const hidden = game.tokens.has(cityId);
      const revealed = game.revealed.get(cityId);
      if (!hidden && !revealed) continue;
      const g = el('g', { transform: `translate(${city.x + 20},${city.y + 18})` }, this.tokenLayer);
      if (hidden) {
        el('circle', { r: 13, class: 'token token-hidden' }, g);
        el('text', { y: 6, class: 'token-mark', 'text-anchor': 'middle' }, g).textContent = '?';
      } else {
        const t = TOKEN_TYPES[revealed];
        el('circle', { r: 13, class: 'token token-open', fill: t.color }, g);
        el('text', { y: 6, class: 'token-mark dark', 'text-anchor': 'middle' }, g).textContent =
          t.symbol;
      }
    }
  }

  drawTargets() {
    const { game } = this;
    this.targetLayer.textContent = '';
    if (game.phase !== 'move' || game.player.isBot) return;
    for (const opt of game.moveOptions()) {
      const { x, y } = pixelOf(game.board, opt.pos);
      const g = el('g', { class: 'target' }, this.targetLayer);
      // Näkymätön, isompi osumisalue sormella osumista varten.
      el('circle', { cx: x, cy: y, r: 28, class: 'target-hit' }, g);
      el('circle', { cx: x, cy: y, r: opt.city ? 20 : 13, class: 'target-ring' }, g);
      if (opt.cost) {
        el('text', { x, y: y - 26, class: 'target-cost', 'text-anchor': 'middle' }, g).textContent =
          `-${opt.cost}`;
      }
      g.addEventListener('click', () => this.doMove(opt.key));
    }
  }

  drawPawns() {
    const { game } = this;
    this.pawnLayer.textContent = '';
    const groups = new Map();
    for (const p of game.players) {
      const key = posKey(p.pos);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(p);
    }
    for (const [, players] of groups) {
      const base = pixelOf(game.board, players[0].pos);
      players.forEach((p, i) => {
        const angle = (i / Math.max(players.length, 1)) * Math.PI * 2 - Math.PI / 2;
        const spread = players.length > 1 ? 15 : 0;
        const x = base.x + Math.cos(angle) * spread;
        const y = base.y + Math.sin(angle) * spread;
        const g = el('g', { class: 'pawn' }, this.pawnLayer);
        el(
          'circle',
          {
            cx: x,
            cy: y,
            r: 11,
            fill: p.color,
            class: p.id === game.current ? 'pawn-dot active' : 'pawn-dot',
          },
          g,
        );
        if (p.hasStar) {
          el('text', { x, y: y - 16, class: 'pawn-star', 'text-anchor': 'middle' }, g).textContent =
            '★';
        }
      });
    }
  }

  // --- paneeli ------------------------------------------------------------

  renderPlayers() {
    const { game } = this;
    this.playersEl.textContent = '';
    for (const p of game.players) {
      const card = html('div', 'player-card' + (p.id === game.current ? ' current' : ''));
      const head = html('div', 'player-head');
      const dot = html('span', 'dot');
      dot.style.background = p.color;
      head.appendChild(dot);
      head.appendChild(html('span', 'player-name', p.name + (p.isBot ? ' (botti)' : '')));
      card.appendChild(head);

      card.appendChild(html('div', 'money', `${p.money} puntaa`));

      const marks = html('div', 'marks');
      if (p.hasStar) marks.appendChild(html('span', 'mark star', '★ Afrikan tähti'));
      for (let i = 0; i < p.horseshoes; i++) {
        marks.appendChild(html('span', 'mark', 'Ω hevosenkenkä'));
      }
      const gems = p.finds.filter((t) => TOKEN_TYPES[t].value > 0);
      if (gems.length) marks.appendChild(html('span', 'mark', `◆ ${gems.length} jalokiveä`));
      card.appendChild(marks);

      const city = game.cityOf(p);
      card.appendChild(
        html('div', 'where', city ? city.name : `matkalla (${game.routeName(p.pos.edge)})`),
      );
      this.playersEl.appendChild(card);
    }
  }

  renderActions() {
    const { game } = this;
    this.actionsEl.textContent = '';
    this.errorEl.hidden = true;

    if (game.phase === 'over') {
      this.turnTitle.textContent = `${game.winner.name} voitti!`;
      this.hint.textContent = '';
      const again = html('button', 'primary', 'Uusi peli');
      again.addEventListener('click', () => this.onNewGame());
      this.actionsEl.appendChild(again);
      return;
    }

    const p = game.player;
    this.turnTitle.textContent = `Vuorossa: ${p.name}`;

    const die = game.die;
    this.dieEl.hidden = die === null || die === undefined;
    if (!this.dieEl.hidden) this.dieEl.textContent = `${DIE_FACES[die]} ${die}`;

    if (p.isBot) {
      this.hint.textContent = 'Botti miettii…';
      this.actionsEl.appendChild(html('div', 'muted', 'Botin vuoro.'));
      return;
    }

    if (game.phase === 'move') {
      this.hint.textContent = `Heitit ${game.die} — valitse kohde kartalta.`;
      this.actionsEl.appendChild(
        html('div', 'muted', 'Korostetut kohdat ovat mahdollisia pysähdyspaikkoja.'),
      );
      return;
    }

    if (game.phase === 'quiz') {
      this.hint.textContent = 'Tietovisa käynnissä.';
      return;
    }

    this.hint.textContent = '';
    const actions = game.availableActions();
    const tokenCity = game.tokenHere();

    if (tokenCity) {
      const quizBtn = html('button', 'primary', `Vastaa kysymykseen — ${tokenCity.name}`);
      quizBtn.addEventListener('click', () => this.doAction(() => game.actionQuiz()));
      this.actionsEl.appendChild(quizBtn);

      const buyBtn = html('button', '', `Osta laatta (${TOKEN_PRICE} p)`);
      buyBtn.disabled = !actions.buy;
      buyBtn.addEventListener('click', () => this.doAction(() => game.actionBuy()));
      this.actionsEl.appendChild(buyBtn);
    }

    const rollBtn = html('button', tokenCity ? '' : 'primary', 'Heitä noppa ja liiku');
    rollBtn.addEventListener('click', () => this.doRoll());
    this.actionsEl.appendChild(rollBtn);

    for (const dest of actions.fly) {
      const city = game.board.cityById.get(dest);
      const flyBtn = html('button', '', `✈ Lennä: ${city.name} (${FLIGHT_PRICE} p)`);
      flyBtn.addEventListener('click', () => this.doAction(() => game.actionFly(dest)));
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
    this.drawTokens();
    this.drawTargets();
    this.drawPawns();
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
      btn.appendChild(html('span', 'letter', LETTERS[i]));
      btn.appendChild(html('span', 'text', text));
      if (quiz.chosen !== null) {
        btn.disabled = true;
        if (i === quiz.correct) btn.classList.add('correct');
        if (i === quiz.chosen && !quiz.right) btn.classList.add('wrong');
      } else if (game.player.isBot) {
        btn.disabled = true;
      } else {
        btn.addEventListener('click', () => this.doAction(() => game.answerQuiz(i)));
      }
      this.quizOptions.appendChild(btn);
    });

    const answered = quiz.chosen !== null;
    this.quizResult.hidden = !answered;
    if (answered) {
      this.quizResult.className = `quiz-result ${quiz.right ? 'right' : 'wrong'}`;
      this.quizResult.textContent = '';
      const found = quiz.found ? TOKEN_TYPES[quiz.found] : null;
      const heading = quiz.right
        ? found
          ? `Oikein! Laatan alta löytyi: ${found.symbol} ${found.name}`
          : 'Oikein!'
        : `Väärin — oikea vastaus oli "${quiz.options[quiz.correct]}".`;
      this.quizResult.appendChild(html('strong', '', heading));
      if (quiz.fact) {
        this.quizResult.appendChild(document.createElement('br'));
        this.quizResult.appendChild(html('span', 'muted', quiz.fact));
      }
    }
    this.quizContinue.hidden = !answered || game.player.isBot;

    if (!this.quizDialog.open) this.quizDialog.showModal();
  }

  // --- toiminnot ----------------------------------------------------------

  doAction(fn) {
    const result = fn();
    if (result && result.ok === false) {
      this.errorEl.textContent = result.error;
      this.errorEl.hidden = false;
      return;
    }
    this.render();
  }

  doMove(key) {
    this.doAction(() => this.game.actionMove(key));
  }

  /** Heittää nopan kevyen animaation kanssa. */
  doRoll() {
    const { game } = this;
    const result = game.actionRoll();
    if (result.ok === false) {
      this.errorEl.textContent = result.error;
      this.errorEl.hidden = false;
      return;
    }
    this.animateDie(result.die).then(() => this.render());
  }

  animateDie(value) {
    if (!value || this.reducedMotion) return Promise.resolve();
    this.actionsEl.textContent = ''; // estä tuplaklikkaus heiton aikana
    this.hint.textContent = 'Noppa pyörii…';
    const dieEl = this.dieEl;
    dieEl.hidden = false;
    dieEl.classList.add('rolling');

    return new Promise((resolve) => {
      let ticks = 0;
      const timer = setInterval(() => {
        const face = 1 + Math.floor(Math.random() * 6);
        dieEl.textContent = DIE_FACES[face];
        if (++ticks >= 8) {
          clearInterval(timer);
          dieEl.classList.remove('rolling');
          dieEl.classList.add('landed');
          dieEl.textContent = `${DIE_FACES[value]} ${value}`;
          setTimeout(() => {
            dieEl.classList.remove('landed');
            resolve();
          }, 260);
        }
      }, 70);
    });
  }

  scheduleBot() {
    clearTimeout(this.botTimer);
    const { game } = this;
    if (game.phase === 'over' || !game.player.isBot) return;
    const delay = game.phase === 'quiz' ? BOT_QUIZ_DELAY : BOT_DELAY;
    this.botTimer = setTimeout(() => this.botStep(), delay);
  }

  botStep() {
    const { game } = this;
    if (game.phase === 'over' || !game.player.isBot) return;

    if (game.phase === 'quiz') {
      if (game.quiz.chosen === null) game.answerQuiz(chooseQuizAnswer(game));
      else game.closeQuiz();
      this.render();
      return;
    }

    if (game.phase === 'move') {
      const key = chooseMove(game);
      if (key) game.actionMove(key);
      else game.endTurn();
      this.render();
      return;
    }

    const action = chooseAction(game);
    if (action.type === 'buy') {
      game.actionBuy();
    } else if (action.type === 'quiz') {
      game.actionQuiz();
    } else if (action.type === 'fly') {
      game.actionFly(action.destination);
    } else {
      const result = game.actionRoll();
      this.animateDie(result.die).then(() => this.render());
      return;
    }
    this.render();
  }
}
