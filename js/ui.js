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
const BOT_DELAY = 850;
const BOT_QUIZ_DELAY = 1500; // botin kysymys jää hetkeksi näkyviin luettavaksi
const LETTERS = ['A', 'B', 'C', 'D'];
const COMPASS = { x: 168, y: 772, r: 62 };

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
        const spread = players.length > 1 ? 16 : 0;
        const x = base.x + Math.cos(angle) * spread;
        const y = base.y + Math.sin(angle) * spread;
        const g = el('g', { class: 'pawn' }, this.pawnLayer);
        el('ellipse', { cx: x + 2, cy: y + 8, rx: 10, ry: 4, class: 'pawn-shadow' }, g);
        el('circle', {
          cx: x,
          cy: y,
          r: 11,
          fill: p.color,
          class: p.id === game.current ? 'pawn-dot active' : 'pawn-dot',
        }, g);
        if (p.hasStar) {
          el('text', {
            x, y: y - 16, class: 'pawn-star', 'text-anchor': 'middle',
          }, g).textContent = '★';
        }
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
        btn.addEventListener('click', () => this.doAction(() => game.answerQuiz(i)));
      }
      this.quizOptions.appendChild(btn);
    });

    const answered = quiz.chosen !== null;

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
      const found = quiz.found ? TOKEN_TYPES[quiz.found] : null;
      if (quiz.right && found) {
        this.quizResult.appendChild(tokenIconSvg(quiz.found, 22));
        this.quizResult.appendChild(html('strong', '', ` Oikein! Löysit: ${found.name}`));
      } else {
        const heading = quiz.right
          ? 'Oikein!'
          : `Väärin — oikea vastaus oli "${quiz.options[quiz.correct]}". Vuoro vaihtuu, voit yrittää uudella kysymyksellä seuraavalla vuorolla.`;
        this.quizResult.appendChild(html('strong', '', heading));
      }
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
    this.turnStatus.textContent = 'Noppa pyörii…';
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
      if (game.quiz.chosen !== null) game.closeQuiz();
      else if (wantsHint(game)) game.actionFiftyFifty();
      else game.answerQuiz(chooseQuizAnswer(game));
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
    if (action.type === 'quiz') {
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
