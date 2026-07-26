// Käyttöliittymä: aarrekartan piirto, ohjauspaneeli, tietovisa ja bottien ohjaus.

import { pixelOf, pointAlong, posKey } from './rules.js';
import {
  chooseDuelAnswer,
  chooseMove,
  chooseQuizAnswer,
  chooseTravel,
  wantsDuelBypass,
  wantsDuelRelief,
  wantsFiftyFifty,
  wantsHint,
} from './ai.js';
import {
  DUEL_BYPASS_SHOES, DUEL_PRIZE, FIFTY_FIFTY_PRICE, FLIGHT_PRICE, HARD_BONUS,
  HINT_PRICE, QUIZ_SECONDS, SEA_FARE,
} from './game.js';
import { PACKS } from './pack.js';
import { sfx, treasureSound } from './sound.js';
import { BoardDie } from './die.js';
import {
  el,
  hash01,
  vary,
  drawCompass,
  drawDefs,
  drawDoodles,
  drawLand,
  drawPaperOverlay,
  drawParchment,
  drawTerrain,
  drawTokenIcon,
  drawWaves,
  revealFaceSvg,
  revealRaysSvg,
  tokenIconSvg,
} from './mapart.js';

const DIE_FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
const BOT_DELAY = 650;
const BOT_QUIZ_DELAY = 1500; // botin kysymys jää hetkeksi näkyviin luettavaksi
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

// Animaatioiden rytmi millisekunteina.
const STEP_MS = 190; // yksi askel kartalla
const FLIGHT_MS = 900;
const TOAST_MS = { die: 950, default: 1200 };

// Tapahtumakuplien äänet.
const EVENT_SOUND = { fare: 'ferry', flight: 'flight', aid: 'coin', stuck: 'stuck' };

// Paljastusruudun alateksti laattatyypeittäin.
// Matkustustapojen nimet paneelissa.
const TRAVEL_LABEL = { land: 'Maitse', sea: 'Laivalla', fly: 'Lentäen', stay: 'Paikallaan' };

const REVEAL_SUB = {
  star: 'Vie tähti kotiin ja voitat pelin!',
  horseshoe: 'Voit voittaa, jos ehdit kotiin ensimmäisenä',
  robber: 'Rosvo haastaa kaksintaisteluun!',
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
    this.factPlace = document.getElementById('fact-place');
    this.factText = document.getElementById('fact-text');
    this.factKey = null;

    this.winnerDialog = document.getElementById('winner-dialog');
    this.quizDialog = document.getElementById('quiz-dialog');
    this.quizCity = document.getElementById('quiz-city');
    this.quizQuestion = document.getElementById('quiz-question');
    this.quizOptions = document.getElementById('quiz-options');
    this.quizResult = document.getElementById('quiz-result');
    this.quizHintText = document.getElementById('quiz-hint-text');
    this.quizFifty = document.getElementById('quiz-5050');
    this.quizFifty.addEventListener('click', () => {
      if (this.game.phase === 'duel') {
        sfx.play('robber');
        this.doAction(() => this.game.actionDuelRelief());
        return;
      }
      sfx.play('swipe');
      this.doAction(() => this.game.actionFiftyFifty());
    });
    this.quizHint = document.getElementById('quiz-hint');
    this.quizHint.addEventListener('click', () => {
      if (this.game.phase === 'duel') {
        sfx.play('coin');
        this.doAction(() => this.game.actionDuelBypass());
        return;
      }
      sfx.play('hint');
      this.doAction(() => this.game.actionHint());
    });

    // Tiimalasi
    this.quizTimerEl = document.getElementById('quiz-timer');
    this.quizSeconds = document.getElementById('quiz-seconds');
    this.hourglass = document.getElementById('hourglass');
    this.hgTopSand = document.getElementById('hg-top-sand');
    this.hgBottomSand = document.getElementById('hg-bottom-sand');
    this.hgStream = document.getElementById('hg-stream');
    this.quizTimer = null;
    this.timedQuiz = null;
    this.quizContinue = document.getElementById('quiz-continue');
    this.quizContinue.addEventListener('click', () => this.doAction(() => (
      this.game.phase === 'duel' ? this.game.closeDuel() : this.game.closeQuiz()
    )));

    this.mapPane = this.svg.parentElement;
    this.busy = false;
    this.movingPlayerId = null;
    this.revealShownFor = null;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Kartan raahaus ja zoomaus.
    this.zoom = 1;
    this.viewCenter = null; // null = kartan keskipiste
    this.viewBoxSize = { vw: 1000, vh: 1000 };
  }

  mount() {
    this.drawBoardFor(this.game.pack);
    this.boardDie = new BoardDie(this.mapPane);
    this.fitViewBox();
    this.observer = new ResizeObserver(() => this.fitViewBox());
    this.observer.observe(this.svg.parentElement);
    this.setupMapGestures();
    this.render();
  }

  /** Piirtää annetun laudan; vaelluksessa lauta vaihtuu porttien kautta. */
  drawBoardFor(pack) {
    this.drawnPackId = pack.id;
    this.svg.setAttribute('aria-label', pack.ariaLabel);
    document.body.dataset.pack = pack.id;
    this.zoom = 1;
    this.viewCenter = null;
    this.drawBoard();
  }

  // --- kartan raahaus ja zoomaus -------------------------------------------

  /** Sormiraahaus, nipistyszoomaus ja hiiren rulla; kaksoisnapautus palauttaa. */
  setupMapGestures() {
    const svg = this.svg;
    const pointers = new Map();
    let pinchStart = null;
    this.panned = false;

    // Kartan yksiköt yhtä ruudun pikseliä kohden.
    const unitsPerPixel = () => this.viewBoxSize.vw / (this.mapPane.clientWidth || 1);

    svg.addEventListener('pointerdown', (event) => {
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 1) this.panned = false;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchStart = { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, zoom: this.zoom };
      }
      svg.setPointerCapture(event.pointerId);
    });

    svg.addEventListener('pointermove', (event) => {
      const prev = pointers.get(event.pointerId);
      if (!prev) return;
      const cur = { x: event.clientX, y: event.clientY };
      pointers.set(event.pointerId, cur);

      if (pointers.size === 2 && pinchStart) {
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        this.setZoom(pinchStart.zoom * (dist / pinchStart.dist));
        this.panned = true;
        return;
      }

      const dx = cur.x - prev.x;
      const dy = cur.y - prev.y;
      if (dx === 0 && dy === 0) return;
      if (Math.hypot(dx, dy) > 2) this.panned = true;
      const k = unitsPerPixel();
      const c = this.viewCenter ?? (this.viewCenter = { x: 500, y: 500 });
      c.x -= dx * k;
      c.y -= dy * k;
      this.fitViewBox();
    });

    const release = (event) => {
      pointers.delete(event.pointerId);
      if (pointers.size < 2) pinchStart = null;
    };
    svg.addEventListener('pointerup', release);
    svg.addEventListener('pointercancel', release);

    // Raahauksen päättävä klikkaus ei saa osua siirtokohteisiin.
    svg.addEventListener('click', (event) => {
      if (this.panned) {
        event.stopPropagation();
        event.preventDefault();
        this.panned = false;
      }
    }, true);

    svg.addEventListener('wheel', (event) => {
      event.preventDefault();
      this.setZoom(this.zoom * Math.exp(-event.deltaY * 0.0015));
    }, { passive: false });

    svg.addEventListener('dblclick', () => {
      this.zoom = 1;
      this.viewCenter = null;
      this.fitViewBox();
    });
  }

  setZoom(zoom) {
    this.zoom = Math.min(3, Math.max(1, zoom));
    if (this.zoom === 1) this.viewCenter = null;
    this.fitViewBox();
  }

  destroy() {
    clearTimeout(this.botTimer);
    this.stopQuizTimer();
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
    let [vw, vh] = w > h ? [size * (w / h), size] : [size, size / (w / h)];
    vw /= this.zoom;
    vh /= this.zoom;
    this.viewBoxSize = { vw, vh };
    // Keskipiste pysyy pelialueella, jottei kartta karkaa raahatessa.
    const c = this.viewCenter ?? { x: 500, y: 500 };
    c.x = Math.min(1000, Math.max(0, c.x));
    c.y = Math.min(1000, Math.max(0, c.y));
    this.svg.setAttribute('viewBox', `${c.x - vw / 2} ${c.y - vh / 2} ${vw} ${vh}`);
    // Noppa lepää kartan koordinaateissa, joten se siirretään uuteen mittakaavaan.
    if (this.dieThrown && this.boardDie) this.boardDie.place(this.dieRestingSpot());
  }

  /** Kartan koordinaatit kartta-alueen pikseleiksi. */
  mapToPane({ x, y }) {
    const point = this.svg.createSVGPoint();
    point.x = x;
    point.y = y;
    const screen = point.matrixTransform(this.svg.getScreenCTM());
    const rect = this.mapPane.getBoundingClientRect();
    return { x: screen.x - rect.left, y: screen.y - rect.top };
  }

  /**
   * Nopan lepopaikka: kartan vasen alakulma on avomerta, joten noppa ei jää
   * kenenkään nappulan tai kaupungin päälle. Paikka arpoutuu hieman joka
   * heitolla, jotta noppa ei osu aina täsmälleen samaan kohtaan.
   */
  dieRestingSpot() {
    const pane = this.mapPane;
    const w = pane.clientWidth || 600;
    const h = pane.clientHeight || 600;
    const spot = this.game.pack.decor.dieSpot;
    const jitter = this.dieJitter ?? { x: 0, y: 0 };
    return {
      x: w * (spot.x + jitter.x),
      y: h * (spot.y + jitter.y),
    };
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
    const { board, pack } = this.game;
    const { decor } = pack;
    this.svg.textContent = '';

    drawDefs(this.svg);
    drawParchment(this.svg);
    drawLand(this.svg, pack.map);
    drawWaves(this.svg, pack.map, [
      { x: decor.compass.x, y: decor.compass.y, r: decor.compass.r + 45 },
      ...decor.waveSkip,
    ]);
    drawTerrain(this.svg, pack.map, this.mapObstacles(), decor.terrainBands);
    drawCompass(this.svg, decor.compass.x, decor.compass.y, decor.compass.r);
    drawDoodles(this.svg, decor);

    // Lentoreitit kaarina.
    const air = el('g', { class: 'air-routes' }, this.svg);
    for (const route of this.game.airRoutes) {
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
      el('path', {
        d,
        class: `route route-${e.type}`,
        opacity: (0.82 + hash01(`route:${e.id}`) * 0.36).toFixed(2),
      }, routes);

      for (let i = 1; i < e.steps; i++) {
        const key = `${e.id}:${i}`;
        // Askelmat eivät ole tasavälein eivätkä täysin samankokoisia.
        const t = (i + vary(`${key}:t`, 0.09)) / e.steps;
        const { x, y } = pointAlong(e.poly, Math.min(Math.max(t, 0.04), 0.96));
        const r = 5.3 + hash01(`${key}:r`) * 1.5;
        el('ellipse', {
          cx: x + vary(`${key}:x`, 1.6),
          cy: y + vary(`${key}:y`, 1.6),
          rx: r,
          ry: r * (0.86 + hash01(`${key}:ry`) * 0.24),
          transform: `rotate(${vary(`${key}:rot`, 40).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})`,
          opacity: (0.72 + hash01(`${key}:o`) * 0.5).toFixed(2),
          class: `step step-${e.type}`,
        }, routes);
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
        transform: `rotate(${vary(`fare:${e.id}`, 2.6).toFixed(2)} ${mid.x.toFixed(1)} ${mid.y.toFixed(1)})`,
        opacity: (0.85 + hash01(`fare:o:${e.id}`) * 0.3).toFixed(2),
      }, fares).textContent = `⚓${e.fee}`;
    }

    // Kaupungit ja nimet.
    const cities = el('g', { class: 'cities' }, this.svg);
    for (const c of board.cities) {
      const wobble = `rotate(${vary(`city:rot:${c.id}`, 12).toFixed(1)} ${c.x} ${c.y})`;
      const base = c.start ? 20 : 11.6;
      const rx = base + vary(`city:rx:${c.id}`, 0.7);
      const ry = base + vary(`city:ry:${c.id}`, 0.7);
      if (c.start) {
        el('ellipse', {
          cx: c.x, cy: c.y, rx, ry, transform: wobble, class: 'city-start',
        }, cities);
        el('ellipse', {
          cx: c.x, cy: c.y, rx: rx * 0.6, ry: ry * 0.6, transform: wobble, class: 'coast-soft',
        }, cities);
      } else {
        el('ellipse', {
          cx: c.x,
          cy: c.y,
          rx,
          ry,
          transform: wobble,
          'stroke-width': (2.2 + hash01(`city:sw:${c.id}`) * 0.7).toFixed(2),
          class: 'city',
        }, cities);
      }
      if (c.airport) {
        el('text', {
          x: c.x, y: c.y + 5, class: 'airport', 'text-anchor': 'middle',
        }, cities).textContent = '✈';
      }
      const anchor = c.la ?? 'middle';
      const dx = c.lx ?? 0;
      const dy = c.ly ?? -(c.start ? 28 : 19);
      const lx = c.x + dx;
      const ly = c.y + dy + vary(`label:y:${c.id}`, 1.2);
      const label = el('text', {
        x: lx,
        y: ly,
        class: c.start ? 'city-label start-label' : 'city-label',
        'text-anchor': anchor,
        transform: `rotate(${vary(`label:rot:${c.id}`, 1.1).toFixed(2)} ${lx.toFixed(1)} ${ly.toFixed(1)})`,
        opacity: (0.92 + hash01(`label:o:${c.id}`) * 0.08).toFixed(2),
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
        transform: `translate(${city.x + 22},${city.y + 18}) rotate(${vary(`token:${cityId}`, 8).toFixed(1)})`,
      }, this.tokenLayer);
      el('circle', {
        r: 16.4 + hash01(`token:r:${cityId}`) * 1.4,
        class: 'token-disc',
      }, g);
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
      if (p.packId !== this.drawnPackId) continue; // toisella laudalla olevat eivät näy
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
      const gems = p.finds.filter((t) => game.tokenTypes[t].value > 0);
      if (gems.length) {
        marks.appendChild(tokenIconSvg(gems[gems.length - 1], 17));
        if (gems.length > 1) marks.appendChild(html('span', 'gem-count', `×${gems.length}`));
      }
      row.appendChild(marks);
      chip.appendChild(row);

      const city = game.cityOf(p);
      const where = city ? city.name : game.routeName(p.pos.edge, game.worldOf(p).board);
      const elsewhere = p.packId !== this.drawnPackId ? ` · ${game.worldOf(p).pack.boardLabel}` : '';
      chip.appendChild(html('div', 'chip-row chip-where', where + elsewhere));
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
    this.dieEl.hidden = true; // silmäluku näkyy laudalla olevassa nopassa

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
    const modes = game.travelModes();

    if (game.phase === 'offer') {
      const city = game.cityOf();
      this.turnStatus.textContent = `${city.name}: kokeile kysymystä tai päätä vuoro.`;
      const quizBtn = html('button', 'primary', '❓ Vastaa kysymykseen');
      quizBtn.addEventListener('click', () => {
        sfx.play('paper');
        this.doAction(() => game.actionQuiz());
      });
      this.actionsEl.appendChild(quizBtn);
      this.addHardQuizButton(city);

      const skipBtn = html('button', '', '➡ Päätä vuoro');
      skipBtn.addEventListener('click', () => this.doAction(() => game.actionSkipQuiz()));
      this.actionsEl.appendChild(skipBtn);
      return;
    }

    if (game.phase === 'roll') {
      this.turnStatus.textContent = `${TRAVEL_LABEL[game.travelMode]} — heitä noppa.`;
      const rollBtn = html('button', 'primary', '🎲 Heitä noppa');
      rollBtn.addEventListener('click', () => this.doRoll());
      this.actionsEl.appendChild(rollBtn);

      // Kun matkustustapa valittiin automaattisesti, ei ole mihin palata.
      if (!game.autoTravel) {
        const backBtn = html('button', '', '↩ Vaihda matkustustapa');
        backBtn.addEventListener('click', () => this.doAction(() => game.actionCancelTravel()));
        this.actionsEl.appendChild(backBtn);
      }
      return;
    }

    // Vaihe 'action': matkustustavan valinta.
    this.turnStatus.textContent = 'Valitse matkustustapa.';

    if (modes.includes('stay')) {
      const stayBtn = html('button', 'primary', '❓ Jää paikalleen ja vastaa');
      stayBtn.addEventListener('click', () => {
        sfx.play('paper');
        this.doAction(() => game.actionTravel('stay'));
      });
      this.actionsEl.appendChild(stayBtn);
      this.addHardQuizButton(game.cityOf());
    }

    if (modes.includes('land')) {
      const landBtn = html('button', modes.includes('stay') ? '' : 'primary', '🥾 Maitse');
      landBtn.addEventListener('click', () => this.doAction(() => game.actionTravel('land')));
      this.actionsEl.appendChild(landBtn);
    }

    if (modes.includes('sea')) {
      const seaBtn = html('button', '', `⛵ Laivalla (${SEA_FARE} p)`);
      seaBtn.addEventListener('click', () => {
        sfx.play('ferry');
        this.doAction(() => game.actionTravel('sea'));
      });
      this.actionsEl.appendChild(seaBtn);
    }

    for (const dest of game.airportDestinations()) {
      const city = game.board.cityById.get(dest);
      const flyBtn = html('button', '', `✈ Lennä: ${city.name} (${FLIGHT_PRICE} p)`);
      flyBtn.addEventListener('click', () => this.doFly(dest));
      this.actionsEl.appendChild(flyBtn);
    }

    // Vaelluksessa porttikaupungeista jatketaan toisille laudoille.
    for (const link of game.gatewayOptions()) {
      const gwBtn = html('button', '', `🧭 ${link.label}`);
      gwBtn.addEventListener('click', () => {
        sfx.play('flight');
        this.doAction(() => game.actionGateway(link.index));
      });
      this.actionsEl.appendChild(gwBtn);
    }

    // Lentokentältä avautuu maailmankartta.
    if (game.worldDestinations().length) {
      const worldBtn = html('button', '', `🌍 Maailmankartta (${FLIGHT_PRICE} p)`);
      worldBtn.addEventListener('click', () => this.openWorldMap());
      this.actionsEl.appendChild(worldBtn);
    }
  }

  /** Maailmankartta: laudat tähtinä, joiden välillä lennetään. */
  openWorldMap() {
    const { game } = this;
    const dialog = document.getElementById('world-dialog');
    const holder = document.getElementById('world-map');
    holder.textContent = '';

    const svg = el('svg', { viewBox: '0 0 360 220', class: 'world-map-svg' });
    el('rect', { x: 4, y: 4, width: 352, height: 212, rx: 10, class: 'world-paper' }, svg);

    const current = game.pack;
    const destinations = game.worldDestinations();

    // Lentoreitit nykyiseltä laudalta muille.
    for (const dest of destinations) {
      const from = current.worldPos;
      const to = this.packById(dest.pack).worldPos;
      const mx = (from.x + to.x) / 2 + (to.y - from.y) * 0.2;
      const my = (from.y + to.y) / 2 - (to.x - from.x) * 0.2;
      el('path', {
        d: `M${from.x},${from.y} Q${mx},${my} ${to.x},${to.y}`,
        class: 'world-route',
      }, svg);
    }

    // Laudat tähtinä; nykyinen kullanvärisenä.
    for (const pack of [current, ...destinations.map((d) => this.packById(d.pack))]) {
      const here = pack.id === current.id;
      const node = el('g', {
        transform: `translate(${pack.worldPos.x},${pack.worldPos.y})`,
        class: here ? 'world-node here' : 'world-node',
      }, svg);
      el('circle', { r: 15, class: 'world-disc' }, node);
      el('text', { y: 5, 'text-anchor': 'middle', class: 'world-star' }, node).textContent = here ? '📍' : '★';
      el('text', { y: 30, 'text-anchor': 'middle', class: 'world-label' }, node).textContent = pack.boardLabel;
      if (!here) {
        node.addEventListener('click', () => {
          dialog.close();
          sfx.play('flight');
          this.doAction(() => game.actionWorldFlight(pack.id));
        });
      }
    }

    holder.appendChild(svg);
    dialog.showModal();
  }

  packById(id) {
    return PACKS.find((p) => p.id === id);
  }

  /** Vaikean kysymyksen nappi, jos kaupungin pakassa on vaikeita kysymyksiä. */
  addHardQuizButton(city) {
    const { game } = this;
    if (!city || !game.hardAvailable(city.id)) return;
    const hardBtn = html('button', '', `★ Vaikea kysymys (+${HARD_BONUS} p)`);
    hardBtn.addEventListener('click', () => {
      sfx.play('paper');
      this.doAction(() => game.actionQuiz({ hard: true }));
    });
    this.actionsEl.appendChild(hardBtn);
  }

  /**
   * Kaupunki, jonka tiedon paneeli näyttää. Reitin varrella valitaan se pää,
   * jota lähempänä pelaaja on.
   */
  factCity(pos) {
    const { board } = this.game;
    if (pos.type === 'city') return board.cityById.get(pos.city);
    const edge = board.edgeById.get(pos.edge);
    const nearer = pos.idx * 2 <= edge.steps ? edge.a : edge.b;
    return board.cityById.get(nearer);
  }

  /**
   * "Tiesitkö että…" -tieto pelaajan sijainnista. Tieto vaihtuu kierroksittain,
   * mutta pysyy samana saman vuoron ajan, jotta sen ehtii lukea.
   */
  renderFact() {
    const { game } = this;
    const player = game.player;
    const city = this.factCity(player.pos);
    const facts = game.pack.placeFacts[city.id];
    if (!facts || facts.length === 0) return;

    const pick = Math.floor(hash01(`fact:${city.id}:${game.turnCount}:${player.id}`) * facts.length);
    const text = facts[Math.min(pick, facts.length - 1)];
    const key = `${city.id}:${text}`;
    if (key === this.factKey) return;
    this.factKey = key;

    const onRoute = player.pos.type === 'edge';
    this.factPlace.textContent = onRoute ? `Matkalla — ${city.name}` : city.name;
    this.factText.textContent = text;

    // Uusi tieto häivähtää esiin, jotta vaihdoksen huomaa.
    this.factText.classList.remove('fact-in');
    void this.factText.offsetWidth;
    this.factText.classList.add('fact-in');
  }

  render() {
    this.onChange?.(this.game);
    // Vuorossa oleva pelaaja voi olla eri laudalla kuin edellinen.
    if (this.game.pack.id !== this.drawnPackId) this.drawBoardFor(this.game.pack);
    this.drawTokens();
    this.drawTargets();
    this.drawPawns();
    this.renderTurnPill();
    this.renderPlayers();
    this.renderActions();
    this.renderFact();
    this.renderQuiz();

    if (this.game.phase === 'over') {
      this.showWinner();
      return;
    }
    this.scheduleBot();
  }

  showWinner() {
    clearTimeout(this.botTimer);
    if (!this.winnerDialog.open) sfx.play('win');
    const w = this.game.winner;
    document.getElementById('winner-title').textContent = `🏆 ${w.name} voitti!`;
    document.getElementById('winner-text').textContent = w.hasStar
      ? this.game.pack.texts.winnerStar(w.name, w.money)
      : `${w.name} ehti hevosenkengän kanssa kotiin ennen tähden löytäjää.`;
    const roamBtn = document.getElementById('winner-roam');
    roamBtn.onclick = () => {
      this.winnerDialog.close();
      this.doAction(() => this.game.continueRoaming());
    };
    if (!this.winnerDialog.open) this.winnerDialog.showModal();
  }

  // --- tietovisa ----------------------------------------------------------

  renderQuiz() {
    const { game } = this;
    if (game.phase === 'duel' && game.duel) {
      this.renderDuel();
      return;
    }
    const quiz = game.quiz;
    if (game.phase !== 'quiz' || !quiz) {
      this.stopQuizTimer();
      if (this.quizDialog.open) this.quizDialog.close();
      return;
    }

    const city = game.board.cityById.get(quiz.cityId);
    const hardTag = quiz.hard ? ` · vaikea kysymys +${HARD_BONUS} p` : '';
    this.quizCity.textContent = `${city.name} — ${game.player.name}${hardTag}`;
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

    // Apukeinot: 40 punnalla sanallinen vihje, 80 punnalla kaksi väärää pois.
    const p = game.player;
    const used = quiz.hidden.length > 0;
    this.quizFifty.hidden = answered || p.isBot;
    this.quizFifty.disabled = used || p.money < FIFTY_FIFTY_PRICE;
    this.quizFifty.textContent = used ? '50:50 käytetty' : `50:50 (${FIFTY_FIFTY_PRICE} p)`;

    this.quizHint.hidden = answered || p.isBot || !quiz.hint;
    this.quizHint.disabled = quiz.hintShown || p.money < HINT_PRICE;
    this.quizHint.textContent = quiz.hintShown ? 'Vihje ostettu' : `Vihje (${HINT_PRICE} p)`;

    this.quizHintText.hidden = !quiz.hintShown;
    if (quiz.hintShown) this.quizHintText.textContent = quiz.hint;

    this.renderTimer(quiz);

    this.quizResult.hidden = !answered;
    if (answered) {
      this.quizResult.className = `quiz-result ${quiz.right ? 'right' : 'wrong'}`;
      this.quizResult.textContent = '';

      if (!revealed) {
        const verdict = quiz.timedOut ? 'Aika loppui!' : quiz.right ? 'Oikein!' : 'Väärin.';
        this.quizResult.appendChild(html('strong', 'quiz-verdict', verdict));
      } else {
        const found = quiz.found ? game.tokenTypes[quiz.found] : null;
        const body = html('div');
        if (quiz.right && found) {
          this.quizResult.appendChild(tokenIconSvg(quiz.found, 24));
          body.appendChild(html('strong', '', `Löysit: ${found.name}`));
        } else if (quiz.right) {
          body.appendChild(html('strong', '', 'Oikein!'));
        } else {
          const lead = quiz.timedOut ? 'Aika loppui. ' : '';
          body.appendChild(
            html('strong', '', `${lead}Oikea vastaus oli "${quiz.options[quiz.correct]}".`),
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

  /** Rosvon kaksintaistelu: 8 vaihtoehtoa, helpotukset ja hevosenkenkäohitus. */
  renderDuel() {
    const { game } = this;
    const duel = game.duel;
    const p = game.player;

    this.quizCity.textContent = `☠ Rosvon kaksintaistelu — ${p.name}`;
    this.quizQuestion.textContent = duel.question;
    this.quizOptions.textContent = '';

    duel.options.forEach((text, i) => {
      const btn = html('button', 'quiz-option');
      btn.style.setProperty('--i', String(i));
      btn.appendChild(html('span', 'letter', LETTERS[i]));
      btn.appendChild(html('span', 'text', text));
      if (duel.hidden.includes(i)) {
        btn.classList.add('hidden-option');
        btn.disabled = true;
      } else if (duel.chosen !== null) {
        btn.disabled = true;
        if (i === duel.correct) btn.classList.add('correct');
        if (i === duel.chosen && !duel.right) btn.classList.add('wrong');
      } else if (p.isBot) {
        btn.disabled = true;
      } else {
        btn.addEventListener('click', () => this.answerDuelUi(i));
      }
      this.quizOptions.appendChild(btn);
    });

    const answered = duel.chosen !== null;
    const revealed = this.revealShownFor === duel;

    // Helpotus rosvolta: puolet rahoista, puolet vääristä pois.
    const toll = Math.floor(p.money / 2);
    this.quizFifty.hidden = answered || p.isBot;
    this.quizFifty.disabled = duel.reliefs >= 2 || toll <= 0;
    this.quizFifty.textContent = duel.reliefs >= 2
      ? 'Helpotukset käytetty'
      : `☠ Helpotus (rosvo vie ${toll} p)`;

    // Kolmella hevosenkengällä pääsee ohi.
    this.quizHint.hidden = answered || p.isBot || p.horseshoes < DUEL_BYPASS_SHOES;
    this.quizHint.disabled = false;
    this.quizHint.textContent = `Ω Ohita rosvo (${DUEL_BYPASS_SHOES} kenkää)`;

    this.quizHintText.hidden = duel.reliefs === 0;
    if (duel.reliefs > 0) {
      this.quizHintText.textContent = `Rosvo on vienyt ${duel.taken} puntaa.`;
    }

    this.renderTimer(duel);

    this.quizResult.hidden = !answered;
    if (answered) {
      this.quizResult.className = `quiz-result ${duel.right ? 'right' : 'wrong'}`;
      this.quizResult.textContent = '';
      if (!revealed) {
        const verdict = duel.timedOut ? 'Aika loppui!' : duel.right ? 'Oikein!' : 'Väärin.';
        this.quizResult.appendChild(html('strong', 'quiz-verdict', verdict));
      } else {
        const body = html('div');
        if (duel.right && duel.prize) {
          body.appendChild(html('strong', '', `Voitit rosvon — saalis ${duel.prize} puntaa!`));
        } else if (duel.right) {
          body.appendChild(html('strong', '', 'Voitit rosvon — loput rahat säilyvät.'));
        } else {
          const lead = duel.timedOut ? 'Aika loppui. ' : '';
          body.appendChild(
            html('strong', '', `${lead}Rosvo vei rahat — oikea vastaus oli "${duel.options[duel.correct]}".`),
          );
        }
        if (duel.fact) body.appendChild(html('span', 'muted', duel.fact));
        this.quizResult.appendChild(body);
      }
    }
    this.quizContinue.hidden = !answered || !revealed || p.isBot;

    if (!this.quizDialog.open) this.quizDialog.showModal();
  }

  /** Vastaus rosvolle: tuomio, tauko ja selitys — kuten tietovisassa. */
  answerDuelUi(index) {
    const { game } = this;
    this.stopQuizTimer();
    this.run(() => game.answerDuel(index), {
      after: async () => {
        const duel = game.duel;
        if (!duel) return;
        sfx.play(duel.right ? 'correct' : 'robber');
        this.renderQuiz();
        await this.wait(this.reducedMotion ? 200 : 900);
        this.revealShownFor = duel;
        this.renderQuiz();
        await this.wait(this.reducedMotion ? 0 : 500);
      },
    });
  }

  // --- tiimalasi ------------------------------------------------------------

  /** Käynnistää tai pysäyttää vastausajan sen mukaan, kuka on vuorossa. */
  renderTimer(quiz) {
    // Toimii sekä tietovisalle että kaksintaistelulle: molemmilla on
    // chosen- ja seconds-kentät.
    const show = !this.game.player.isBot && quiz.chosen === null;
    this.quizTimerEl.hidden = !show;
    if (!show) {
      this.stopQuizTimer();
      return;
    }
    if (this.timedQuiz !== quiz) this.startQuizTimer(quiz);
  }

  startQuizTimer(quiz) {
    this.stopQuizTimer();
    this.timedQuiz = quiz;
    this.remaining = (quiz.seconds ?? QUIZ_SECONDS) * 1000;
    this.lastTick = performance.now();
    this.lastWhole = Math.ceil(this.remaining / 1000);
    if (!this.reducedMotion) {
      this.hourglass.classList.remove('turning');
      void this.hourglass.getBoundingClientRect();
      this.hourglass.classList.add('turning');
    }
    this.updateTimer();
    this.quizTimer = setInterval(() => this.tickTimer(), 100);
  }

  stopQuizTimer() {
    if (this.quizTimer) clearInterval(this.quizTimer);
    this.quizTimer = null;
    this.timedQuiz = null;
  }

  tickTimer() {
    const now = performance.now();
    const dt = now - this.lastTick;
    this.lastTick = now;
    // Animaatioiden ajaksi kello pysähtyy, jotta aikaa ei kulu odotellessa.
    if (this.busy) return;

    this.remaining = Math.max(0, this.remaining - dt);
    const quiz = this.game.quiz;
    if (quiz) quiz.seconds = Math.ceil(this.remaining / 1000);
    this.updateTimer();

    const whole = Math.ceil(this.remaining / 1000);
    if (whole !== this.lastWhole) {
      this.lastWhole = whole;
      if (whole > 0 && whole <= 10) sfx.play('tick');
    }
    if (this.remaining <= 0) this.timeUp();
  }

  updateTimer() {
    const secs = Math.ceil(this.remaining / 1000);
    this.quizSeconds.textContent = String(secs);
    this.quizTimerEl.classList.toggle('urgent', secs <= 10);
    this.setSand(1 - this.remaining / (QUIZ_SECONDS * 1000));
  }

  /**
   * Piirtää hiekan tiimalasiin: ylhäällä pinta valuu suppilon muotoisena
   * kuoppana kohti kaulaa, alhaalla kasa nousee pyöreänä kekona.
   */
  setSand(progress) {
    const t = Math.min(1, Math.max(0, progress));
    const cx = 22;

    // Yläkupu: leveä ylhäällä (y 8.4), kapea kaulassa (y 33.6).
    const surface = 8.4 + t * 25.2;
    const topHalf = Math.max(0, 12.8 - (surface - 8.4) * 0.4901);
    const dip = 1.5 * (1 - t) + 0.25;
    this.hgTopSand.setAttribute(
      'd',
      t >= 0.999
        ? ''
        : `M ${(cx - topHalf).toFixed(2)} ${surface.toFixed(2)} `
          + `Q ${cx} ${(surface + dip * 2).toFixed(2)} ${(cx + topHalf).toFixed(2)} ${surface.toFixed(2)} `
          + `L 22.45 33.6 L 21.55 33.6 Z`,
    );

    // Alakupu: hiekka kertyy pohjalle (y 60.2) ja nousee kohti kaulaa (y 34.4).
    const level = 60.2 - t * 25.8;
    const botHalf = Math.min(12.8, 0.45 + (level - 34.4) * 0.4787);
    const height = 60.2 - level;
    const mound = Math.min(2.6, height * 0.5, (level - 34.4) * 0.4);
    this.hgBottomSand.setAttribute(
      'd',
      t <= 0.001
        ? ''
        : `M 9.2 60.2 L 34.8 60.2 L ${(cx + botHalf).toFixed(2)} ${level.toFixed(2)} `
          + `Q ${cx} ${(level - mound * 2).toFixed(2)} ${(cx - botHalf).toFixed(2)} ${level.toFixed(2)} Z`,
    );

    // Virtaava hiekka näkyy vain niin kauan kuin sitä riittää.
    const flowing = t > 0.004 && t < 0.999;
    this.hgStream.style.display = flowing ? '' : 'none';
    this.hgStream.setAttribute('height', Math.max(0, level - 33.6).toFixed(2));
  }

  /** Aika loppui: sama rytmi kuin väärässä vastauksessa, mutta ilman paljastusta. */
  timeUp() {
    this.stopQuizTimer();
    const { game } = this;
    if (game.phase === 'duel' && game.duel && game.duel.chosen === null) {
      this.run(() => game.timeoutDuel(), {
        after: async () => {
          const duel = game.duel;
          if (!duel) return;
          sfx.play('timeout');
          this.renderQuiz();
          await this.wait(this.reducedMotion ? 200 : 900);
          this.revealShownFor = duel;
          this.renderQuiz();
          await this.wait(this.reducedMotion ? 0 : 500);
        },
      });
      return;
    }
    if (game.phase !== 'quiz' || !game.quiz || game.quiz.chosen !== null) return;
    this.run(() => game.timeoutQuiz(), {
      after: async () => {
        const quiz = game.quiz;
        if (!quiz) return;
        sfx.play('timeout');
        this.renderQuiz();
        await this.wait(this.reducedMotion ? 200 : 900);
        this.revealShownFor = quiz;
        this.renderQuiz();
        await this.wait(this.reducedMotion ? 0 : 500);
      },
    });
  }

  /**
   * Vastaus tietovisaan: ensin "Oikein!"/"Väärin.", pieni tauko ja sitten
   * aarteen paljastus, jossa iso laatta kääntyy ympäri.
   */
  answerQuiz(index) {
    const { game } = this;
    this.stopQuizTimer();
    this.run(() => game.answerQuiz(index), {
      after: async () => {
        const quiz = game.quiz;
        if (!quiz) return;
        sfx.play(quiz.right ? 'correct' : 'wrong');
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
    const token = this.game.tokenTypes[type];
    const overlay = html('div', 'reveal-overlay');
    const scene = html('div', 'reveal-scene');
    const disc = html('div', `reveal-disc ${type}`);

    const back = html('div', 'reveal-face reveal-back');
    back.appendChild(revealFaceSvg('back'));
    const front = html('div', 'reveal-face reveal-front');
    front.appendChild(revealFaceSvg('front', type));
    disc.appendChild(back);
    disc.appendChild(front);

    const rays = revealRaysSvg();
    rays.classList.add('reveal-rays');

    const caption = html('div', 'reveal-caption');
    caption.appendChild(html('strong', '', token.name));
    caption.appendChild(html('span', '', REVEAL_SUB[type] ?? `+${token.value} puntaa`));

    const stage = html('div', 'reveal-stage');
    stage.appendChild(rays);
    stage.appendChild(disc);
    scene.appendChild(stage);
    scene.appendChild(caption);
    overlay.appendChild(scene);
    // Dialogi on top layerissa, joten paljastus lisätään sen sisään.
    this.quizDialog.appendChild(overlay);

    if (this.reducedMotion) {
      disc.classList.add('flipped');
      rays.classList.add('shown');
      caption.classList.add('shown');
      sfx.play(treasureSound(type));
      await this.wait(900);
    } else {
      await this.wait(420);
      disc.classList.add('flipped');
      sfx.play('flip');
      await this.wait(760);
      sfx.play('clack');
      sfx.play(treasureSound(type));
      rays.classList.add('shown');
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
    sfx.play('flight');
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

    for (const [i, pos] of path.entries()) {
      const { x, y } = pixelOf(board, pos);
      g.style.transform = `translate(${x}px, ${y}px)`;
      sfx.play(i === path.length - 1 ? 'arrive' : 'step');
      await this.wait(this.reducedMotion ? 0 : stepMs);
    }

    g.remove();
    this.movingPlayerId = null;
    this.revealShownFor = null;
    this.drawPawns();
  }

  /** Nopanheitto: noppa lentää nappulan vierestä laudalle ja jää siihen. */
  async animateDie(value) {
    if (!value) return;
    this.dieEl.hidden = true;
    this.turnStatus.textContent = 'Noppa pyörii…';

    const player = this.game.player;
    this.dieJitter = { x: (Math.random() - 0.5) * 0.06, y: (Math.random() - 0.5) * 0.05 };
    const from = this.mapToPane(pixelOf(this.game.board, player.pos));
    const to = this.dieRestingSpot();
    this.dieThrown = true;

    await this.boardDie.roll(value, from, to, {
      reduced: this.reducedMotion,
      onTick: () => sfx.play('dieTick'),
      onLand: () => sfx.play('dieLand'),
      onBounce: () => sfx.play('clack'),
    });
    this.turnStatus.textContent = `Heitit ${value} — valitse kohde kartalta.`;
    await this.wait(this.reducedMotion ? 0 : 260);
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
      sfx.play(EVENT_SOUND[event.kind] ?? 'turn');
      const box = this.buildToast(event);
      await this.wait(this.reducedMotion ? 0 : TOAST_MS[event.kind] ?? TOAST_MS.default);
      await this.removeToast(box);
    }
  }

  scheduleBot() {
    clearTimeout(this.botTimer);
    const { game } = this;
    if (this.busy || game.phase === 'over' || !game.player.isBot) return;
    const delay = game.phase === 'quiz' || game.phase === 'duel' ? BOT_QUIZ_DELAY : BOT_DELAY;
    this.botTimer = setTimeout(() => this.botStep(), delay);
  }

  botStep() {
    const { game } = this;
    if (this.busy || game.phase === 'over' || !game.player.isBot) return;

    if (game.phase === 'duel') {
      if (game.duel.chosen !== null) this.run(() => game.closeDuel());
      else if (wantsDuelBypass(game)) this.run(() => game.actionDuelBypass());
      else if (wantsDuelRelief(game)) this.run(() => game.actionDuelRelief());
      else this.answerDuelUi(chooseDuelAnswer(game));
      return;
    }

    if (game.phase === 'quiz') {
      if (game.quiz.chosen !== null) this.run(() => game.closeQuiz());
      else if (wantsHint(game)) this.run(() => game.actionHint());
      else if (wantsFiftyFifty(game)) this.run(() => game.actionFiftyFifty());
      else this.answerQuiz(chooseQuizAnswer(game));
      return;
    }

    if (game.phase === 'offer') {
      this.run(() => game.actionQuiz());
      return;
    }

    if (game.phase === 'move') {
      const key = chooseMove(game);
      if (key) this.doMove(key);
      else this.run(() => game.endTurn());
      return;
    }

    if (game.phase === 'roll') {
      this.doRoll();
      return;
    }

    const travel = chooseTravel(game);
    if (travel.type === 'fly') this.doFly(travel.destination);
    else this.run(() => game.actionTravel(travel.type));
  }
}
