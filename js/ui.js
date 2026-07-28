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
import { factSource, factText, factVoice, isSourceUrl, sourceLabel, voiceTitle } from './pack.js';
import { stampBoard, stampDate, stampList } from './passport.js';
import { fetchSummary } from './wiki.js';
import { sfx, treasureSound } from './sound.js';
import { BoardDie } from './die.js';
import {
  el,
  hash01,
  vary,
  drawCompass,
  drawDefs,
  drawDoodles,
  drawHemisphereFrames,
  drawLand,
  drawPaperOverlay,
  drawParchment,
  drawTerrain,
  drawTokenIcon,
  drawWaves,
  isOnLand,
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
const AUTO_ROLL_MS = 320; // tauko ennen itsestään pyörähtävää noppaa
// Kuinka paljon pergamenttia jatketaan kartan alle avaustekstiä varten.
const INTRO_SPACE = 0.5;
// Kuinka paljon lautaa lasketaan yläreunasta aloitusnäkymässä.
const INTRO_TOP = 0.05;
// Kirjoituskoneen tahti: avaus saa naksua rauhassa, muut tekstit ripeästi.
const TYPE_MS = 50;
const INTRO_TYPE_MS = 190;
// Avaustekstin kirjasinkoko sovitetaan kaistaan näiden rajojen sisällä.
const INTRO_FONT_MAX = 1.02;
const INTRO_FONT_MIN = 0.72;
// Omistajan päättämä avausteksti. ÄLÄ muokkaa ilman omistajan lupaa
// (docs/tyolista-opukselle.md, paketti 3).
const INTRO_TEXT = 'Vintiltä löytyi isoisän matkalaukku: kartta vuodelta 1872, '
  + 'kukkarollinen puntia ja kulunut päiväkirja.\n\n'
  + 'Ensimmäinen sivu: "Maailman ympäri kahdeksassakymmenessä päivässä." '
  + 'Viimeinen lause päättyy kesken.\n\n'
  + 'Jonkun on kirjoitettava se loppuun — ja mielellään nopeammin.\n\n'
  + 'Ostin lipun samana iltana.';
// Päiväkirjakortin nurkkahaku: kuinka suuri osa kartasta on "nurkka".
const FACT_CORNER = 0.34;
const FACT_WIDTH = 340; // pidettävä samana kuin .fact-card css:ssä
const TURN_WIDTH = 560; // pidettävä samana kuin .turn-card css:ssä

// Tapahtumakuplien äänet.
const EVENT_SOUND = { fare: 'ferry', flight: 'flight', aid: 'coin', stuck: 'stuck' };

// Paljastusruudun alateksti laattatyypeittäin.
// Matkustustapojen nimet paneelissa.
const TRAVEL_LABEL = { land: 'Maitse', sea: 'Laivalla', fly: 'Lentäen', stay: 'Paikallaan' };

const REVEAL_SUB = {
  star: 'Vie tähti kotiin ja voitat pelin!',
  horseshoe: 'Voit voittaa, jos ehdit kotiin ensimmäisenä',
  robber: 'Rosvo haastaa kaksintaisteluun!',
  empty: 'Isoisän merkintä oli vanhentunut — täältä ei löytynyt mitään',
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
    this.turnPill = document.getElementById('turn-pill');
    this.turnStatus = document.getElementById('turn-status');
    this.dieEl = document.getElementById('die');
    this.actionsEl = document.getElementById('actions');
    this.errorEl = document.getElementById('error');
    this.passportDialog = document.getElementById('passport-dialog');
    this.passportGrid = document.getElementById('passport-grid');
    this.passportCount = document.getElementById('passport-count');
    this.passportFinds = document.getElementById('passport-finds');
    this.passportProgress = document.getElementById('passport-progress');

    this.turnCard = document.getElementById('actions').closest('.turn-card');
    this.introEl = document.getElementById('intro');
    this.introText = document.getElementById('intro-text');

    this.arrivalDialog = document.getElementById('arrival-dialog');
    this.arrivalCity = document.getElementById('arrival-city');
    document.getElementById('arrival-yes').addEventListener('click', () => {
      this.closeArrival();
      sfx.play('paper');
      this.doAction(() => this.game.actionQuiz());
    });
    document.getElementById('arrival-no').addEventListener('click', () => {
      this.closeArrival();
      this.doAction(() => this.game.actionSkipQuiz());
    });

    this.wikiDialog = document.getElementById('wiki-dialog');
    this.wikiTitle = document.getElementById('wiki-title');
    this.wikiImage = document.getElementById('wiki-image');
    this.wikiExtract = document.getElementById('wiki-extract');
    this.wikiSource = document.getElementById('wiki-source');
    this.factWiki = document.getElementById('fact-wiki');
    this.factWiki.addEventListener('click', () => this.openWiki(this.factWikiCity));

    this.eventDialog = document.getElementById('event-dialog');
    this.eventText = document.getElementById('event-text');
    this.eventEffect = document.getElementById('event-effect');
    document.getElementById('event-ok').addEventListener('click', () => {
      if (this.eventDialog.open) this.eventDialog.close();
      this.eventShownFor = null;
      sfx.play('paper');
      this.doAction(() => this.game.closeEvent());
    });

    this.factVoiceEl = document.getElementById('fact-voice');
    this.factPlace = document.getElementById('fact-place');
    this.factText = document.getElementById('fact-text');
    this.factCard = this.factText.closest('.fact-card');
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
    this.travelExpanded = false; // matkavalinnan toinen vaihe auki
    this.autoRollTimer = null;
    this.movingPlayerId = null;
    this.revealShownFor = null;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.viewBoxSize = { vw: 1000, vh: 1000 };
  }

  mount() {
    this.drawBoardFor(this.game.pack);
    this.boardDie = new BoardDie(this.mapPane);
    this.fitViewBox();
    this.observer = new ResizeObserver(() => this.fitViewBox());
    this.observer.observe(this.svg.parentElement);
    this.render();
  }

  /** Piirtää annetun laudan; vaelluksessa lauta vaihtuu porttien kautta. */
  drawBoardFor(pack) {
    this.drawnPackId = pack.id;
    this.svg.setAttribute('aria-label', pack.ariaLabel);
    this.svg.dataset.style = pack.style ?? 'map';
    document.body.dataset.pack = pack.id;
    this.drawBoard();
    this.fitViewBox();
  }

  /**
   * Pelisisällön rajauslaatikko: kaupungit nimineen, reitit, lentokaaret ja
   * koristeet. Näkymä sovitetaan tähän eikä koko karttapohjaan, jolloin lauta
   * näkyy mahdollisimman suurena eikä tyhjää merta jää reunoille.
   */
  boardBounds() {
    const { board, pack } = this.game;
    // Valmiiksi rajattu lauta (esim. Maailma) käyttää omaa kehystään.
    // Kopio, koska aloitusnäkymä kasvattaa laatikkoa eikä pakkaa saa muuttaa.
    if (pack.map.frame) return this.withIntroSpace({ ...pack.map.frame });

    const pts = [];
    // Karkea arvio nimikirjaimen leveydestä. Aloituskaupungit piirtyvät
    // isommalla versaalifontilla (21px, kirjainväli 0.1em), joten niissä
    // kirjain vie puolitoista kertaa tavallisen levyn — muuten esimerkiksi
    // Aasian Tokio jäisi rajauksen ulkopuolelle ja leikkautuisi reunaan.
    const CHAR_W = 9.5;
    const START_CHAR_W = 15.2;
    const STROKE = 2; // nimen vaalea reunusviiva levittää tekstiä hieman
    for (const c of board.cities) {
      pts.push([c.x - 34, c.y - 34], [c.x + 34, c.y + 34]);
      const w = c.name.length * (c.start ? START_CHAR_W : CHAR_W) + STROKE * 2;
      const anchor = c.la ?? 'middle';
      const lx = c.x + (c.lx ?? 0);
      const ly = c.y + (c.ly ?? -(c.start ? 28 : 19));
      const x0 = anchor === 'start' ? lx : anchor === 'end' ? lx - w : lx - w / 2;
      pts.push([x0, ly - 18], [x0 + w, ly + 6]);
    }
    for (const e of board.edges) {
      for (const p of e.poly) pts.push(p);
    }
    for (const route of this.game.airRoutes) {
      const a = board.cityById.get(route.a);
      const b = board.cityById.get(route.b);
      pts.push([(a.x + b.x) / 2 + (b.y - a.y) * 0.12, (a.y + b.y) / 2 - (b.x - a.x) * 0.12]);
    }
    const d = pack.decor;
    pts.push(
      [d.compass.x - d.compass.r - 14, d.compass.y - d.compass.r - 26],
      [d.compass.x + d.compass.r + 14, d.compass.y + d.compass.r + 14],
    );
    const titleHalf = Math.max(110, d.mapLabel.length * 12.5);
    pts.push([d.mapLabelPos.x - titleHalf, d.mapLabelPos.y - 34], [d.mapLabelPos.x + titleHalf, d.mapLabelPos.y + 60]);
    if (d.ship) pts.push([d.ship.x - 62, d.ship.y - 56], [d.ship.x + 62, d.ship.y + 46]);
    if (d.serpent) pts.push([d.serpent.x - 96, d.serpent.y - 26], [d.serpent.x + 96, d.serpent.y + 30]);

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const [x, y] of pts) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
    const pad = 12;
    const box = { x: minX - pad, y: minY - pad, w: maxX - minX + pad * 2, h: maxY - minY + pad * 2 };
    // Aloitusnäkymässä pergamenttia jatketaan kartan alapuolelle, jotta
    // avausteksti mahtuu siihen ja lauta nousee ruudun yläreunaan. Näkymä
    // keskittää laatikon, joten alaosan kasvattaminen nostaa karttaa ylös.
    return this.withIntroSpace(box);
  }

  /**
   * Aloitusnäkymässä pergamenttia jatketaan kartan alapuolelle avaustekstiä
   * varten. Näkymä kiinnitetään yläreunaan (fitViewBox), joten kasvatus
   * nostaa laudan ruudun ylälaitaan ja jättää tekstille tyhjän alaosan.
   */
  withIntroSpace(box) {
    if (this.game.phase !== 'pickstart') return box;
    return { ...box, h: box.h * (1 + INTRO_SPACE) };
  }

  destroy() {
    clearTimeout(this.botTimer);
    clearTimeout(this.autoRollTimer);
    if (this.previewFrame) cancelAnimationFrame(this.previewFrame);
    for (const timer of Object.values(this.typeTimers ?? {})) clearInterval(timer);
    this.stopQuizTimer();
    this.observer?.disconnect();
  }

  /**
   * Sovittaa näkymän pelisisällön rajauslaatikkoon ja venyttää sen ruudun
   * muotoiseksi, jolloin pergamentti täyttää koko alueen ja pelialue näkyy
   * mahdollisimman suurena. Kartta on staattinen: sitä ei zoomata eikä
   * raahata, joten kaikki on aina esillä.
   */
  fitViewBox() {
    const pane = this.svg.parentElement;
    const w = pane.clientWidth;
    const h = pane.clientHeight;
    if (!w || !h) return;
    const box = this.contentBox ?? { x: 0, y: 0, w: 1000, h: 1000 };
    const scale = Math.min(w / box.w, h / box.h);
    const vw = w / scale;
    const vh = h / scale;
    this.viewBoxSize = { vw, vh };
    // Aloitusnäkymässä lauta kiinnitetään yläreunaan: alapuolelle jäävä
    // pergamentti on avaustekstiä varten, eikä sitä saa jakaa ylä- ja
    // alareunan kesken. Muulloin sisältö keskitetään kuten ennen.
    const alkuun = this.game.phase === 'pickstart';
    const vy = alkuun ? box.y - box.h * INTRO_TOP : box.y + box.h / 2 - vh / 2;
    this.svg.setAttribute(
      'viewBox',
      `${box.x + box.w / 2 - vw / 2} ${vy} ${vw} ${vh}`,
    );
    if (alkuun) this.placeIntro(box, vy, vh, h);
    this.placeFactCard(w, h);
    // Noppa lepää kartan koordinaateissa, joten se siirretään uuteen mittakaavaan.
    if (this.dieThrown && this.boardDie) this.boardDie.place(this.dieRestingSpot());
  }

  /**
   * Avausteksti keskelle sitä tyhjää pergamenttia, joka jää laudan alle.
   * Kaista lasketaan näkymästä eikä arvata prosentteina, koska kapealla
   * ruudulla laatikko on myös pystysuunnassa kirjekuoressa.
   */
  placeIntro(box, vy, vh, paneH) {
    const paneY = (boardY) => ((boardY - vy) / vh) * paneH;
    // Kaista alkaa laudan alareunasta ja päättyy rajauslaatikon pohjaan.
    // Rajataan paneelin sisään, jottei teksti valu ulos matalalla ruudulla.
    const ylin = Math.max(0, paneY(box.y + box.h / (1 + INTRO_SPACE)));
    // Kaista jatkuu paneelin pohjaan asti: pergamentti ulottuu sinne, joten
    // kapealla ruudulla teksti saa käyttöönsä kaiken tyhjän tilan.
    const alin = paneH;
    this.introEl.style.top = `${Math.round(ylin)}px`;
    this.introEl.style.height = `${Math.max(0, Math.round(alin - ylin))}px`;
    this.fitIntro();
  }

  /**
   * Kutistaa avaustekstiä, jos se ei mahdu kaistaan. Matalalla ruudulla
   * kaista jää kapeaksi, eikä teksti saa valua laudan tai kartan reunan yli.
   */
  fitIntro() {
    const kaista = this.introEl.clientHeight;
    if (!kaista) return;
    let koko = INTRO_FONT_MAX;
    this.introText.style.fontSize = `${koko}rem`;
    // Kolme askelta riittää: pienempää kuin INTRO_FONT_MIN ei mennä.
    for (let i = 0; i < 3 && this.introText.scrollHeight > kaista; i++) {
      koko = Math.max(INTRO_FONT_MIN, koko - 0.09);
      this.introText.style.fontSize = `${koko}rem`;
    }
  }

  /**
   * Päiväkirjakortti asetetaan sille kartan nurkalle, jossa on eniten merta.
   * Näin kortti ei koskaan peitä mannerta ja lauta näkyy kokonaisena. Kortti
   * on kartan päällä, joten jokin nurkka menetetään joka tapauksessa — meri
   * on niistä halvin.
   *
   * Alanurkat hylätään, jos kortti ja toimintokortti eivät mahdu rinnakkain:
   * silloin ne peittäisivät toisensa.
   */
  placeFactCard(paneW, paneH) {
    const vb = this.svg.viewBox.baseVal;
    if (!vb || !vb.width) return;
    const { map } = this.game.pack;

    // Nurkan kokoinen otos: kolmannes leveydestä ja korkeudesta.
    const meriosuus = (kx, ky) => {
      let meri = 0;
      let kaikki = 0;
      for (let i = 0; i <= 6; i++) {
        for (let j = 0; j <= 6; j++) {
          const x = vb.x + vb.width * (kx + (i / 6) * FACT_CORNER);
          const y = vb.y + vb.height * (ky + (j / 6) * FACT_CORNER);
          kaikki++;
          if (!isOnLand([x, y], map)) meri++;
        }
      }
      return meri / kaikki;
    };

    const loppu = 1 - FACT_CORNER;
    const nurkat = [
      { id: 'tl', kx: 0, ky: 0 },
      { id: 'tr', kx: loppu, ky: 0 },
      { id: 'bl', kx: 0, ky: loppu },
      { id: 'br', kx: loppu, ky: loppu },
    ];
    // Mahtuvatko päiväkirja ja toimintokortti samalle riville?
    const mahtuu = paneW >= FACT_WIDTH + TURN_WIDTH + 40;
    for (const n of nurkat) {
      n.meri = meriosuus(n.kx, n.ky);
      if (!mahtuu && n.id[0] === 'b') n.meri -= 1; // alanurkat viimeisiksi
    }
    nurkat.sort((a, b) => b.meri - a.meri);
    this.factCard.dataset.corner = nurkat[0].id;
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
   * Nopan lepopaikka: avomerta, jotta noppa ei jää kenenkään nappulan tai
   * kaupungin päälle. Paikka arpoutuu hieman joka heitolla, jotta noppa ei
   * osu aina täsmälleen samaan kohtaan. Päiväkirjakortti hakeutuu
   * merellisimpään kulmaan — usein samaan, jonne nopan paikka on valittu —
   * joten kortin kulmaa väistetään peilaamalla paikka vastakkaiselle
   * sivulle (tai pakan omaan varapaikkaan decor.dieSpotAlt).
   */
  dieRestingSpot() {
    const pane = this.mapPane;
    const w = pane.clientWidth || 600;
    const h = pane.clientHeight || 600;
    const decor = this.game.pack.decor;
    let spot = decor.dieSpot;
    const corner = this.factCard?.hidden ? null : this.factCard?.dataset.corner;
    if (corner) {
      const spotCorner = (spot.y < 0.5 ? 't' : 'b') + (spot.x < 0.5 ? 'l' : 'r');
      if (spotCorner === corner) spot = decor.dieSpotAlt ?? { x: 1 - spot.x, y: spot.y };
    }
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
    this.contentBox = this.boardBounds();
    this.svg.textContent = '';

    drawDefs(this.svg);
    // Kaikki piirretään juuriryhmään: esikatselu siirtää ryhmää, ei SVG:tä,
    // jolloin elementin taakse ei paljastu tyhjää taustaa raahatessa.
    const root = el('g', { class: 'board-root' }, this.svg);
    const svg = { appendChild: (node) => root.appendChild(node) };
    this.boardRoot = root;

    drawParchment(svg);
    // Pallonpuoliskokartalla kehykset ja asteverkko piirtyvät maiden alle.
    drawHemisphereFrames(svg, pack.map);
    drawLand(svg, pack.map);
    drawWaves(svg, pack.map, [
      { x: decor.compass.x, y: decor.compass.y, r: decor.compass.r + 45 },
      ...decor.waveSkip,
    ]);
    drawTerrain(svg, pack.map, this.mapObstacles(), decor.terrainBands);
    drawCompass(svg, decor.compass.x, decor.compass.y, decor.compass.r);
    drawDoodles(svg, decor);

    // Lentoreitit kaarina.
    const air = el('g', { class: 'air-routes' }, root);
    for (const route of this.game.airRoutes) {
      const a = board.cityById.get(route.a);
      const b = board.cityById.get(route.b);
      const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.12;
      const my = (a.y + b.y) / 2 - (b.x - a.x) * 0.12;
      el('path', { d: `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`, class: 'air-route' }, air);
    }

    // Reitit ja askelpisteet. Merireitit kaartavat rannikon ympäri.
    const routes = el('g', { class: 'routes', filter: 'url(#rough-soft)' }, root);
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

    // Vakiohinta kerrotaan kerran kartan selitteessä; reitille merkitään
    // hinta vain, jos se poikkeaa vakiosta. Näin meri pysyy siistinä.
    const fares = el('g', { class: 'fares' }, root);
    for (const e of board.edges) {
      if (e.type !== 'sea' || e.fee === SEA_FARE) continue;
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

    // Selite kartan otsikon alle: mitä matkustaminen maksaa tällä laudalla.
    const legendParts = [];
    if (board.edges.some((e) => e.type === 'sea')) legendParts.push(`⚓ laiva ${SEA_FARE} p`);
    if (pack.airRoutes.length) legendParts.push(`✈ lento ${FLIGHT_PRICE} p`);
    if (legendParts.length) {
      el('text', {
        x: decor.mapLabelPos.x,
        y: decor.mapLabelPos.y + 44,
        class: 'map-legend',
        'text-anchor': 'middle',
      }, root).textContent = legendParts.join('  ·  ');
    }

    // Kaupungit ja nimet.
    const cities = el('g', { class: 'cities' }, root);
    // Kaupunkilaudalla solmut ovat pienempiä: mittakaava on kortteleissa.
    const nodeScale = pack.style === 'city' ? 0.82 : 1;
    for (const c of board.cities) {
      const wobble = `rotate(${vary(`city:rot:${c.id}`, 12).toFixed(1)} ${c.x} ${c.y})`;
      const base = (c.start ? 20 : 11.6) * nodeScale;
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
      // Porttikaupungista lähtee pitkä lento toiselle laudalle: kaksoiskehä
      // erottaa sen tavallisesta lentokentästä jo kartalta katsottaessa.
      if (this.game.isGateway(c)) {
        const gr = base + 9;
        el('ellipse', {
          cx: c.x,
          cy: c.y,
          rx: gr + vary(`gate:rx:${c.id}`, 1.1),
          ry: gr + vary(`gate:ry:${c.id}`, 1.1),
          transform: wobble,
          class: 'city-gate',
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

    this.tokenLayer = el('g', { class: 'tokens' }, root);
    this.targetLayer = el('g', { class: 'targets' }, root);
    this.pawnLayer = el('g', { class: 'pawns' }, root);
    drawPaperOverlay(svg);
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

    // Lähtöpisteen valinta: kaikki kaupungit ovat napautettavia.
    if (game.phase === 'pickstart') {
      for (const c of game.board.cities) {
        const g = el('g', { class: 'target' }, this.targetLayer);
        el('circle', { cx: c.x, cy: c.y, r: 34, class: 'target-hit' }, g);
        el('circle', {
          cx: c.x,
          cy: c.y,
          r: c.start ? 27 : 22,
          class: 'target-ring pick',
        }, g);
        g.addEventListener('click', () => this.doPickStart(c));
      }
      return;
    }

    // Karttakysymys: ehdokaskaupungit ovat vastausvaihtoehtoja, ja vastaus
    // annetaan napauttamalla lautaa. Renkaat ovat samat kuin lähtöpisteen
    // valinnassa, koska tässäkin osoitetaan paikkaa eikä kehoteta liikkumaan.
    const quiz = game.quiz;
    if (game.phase === 'quiz' && quiz?.kind === 'map' && quiz.chosen === null) {
      quiz.mapCities.forEach((cityId, i) => {
        const c = game.board.cityById.get(cityId);
        if (!c) return;
        const g = el('g', { class: 'target' }, this.targetLayer);
        el('circle', { cx: c.x, cy: c.y, r: 34, class: 'target-hit' }, g);
        el('circle', { cx: c.x, cy: c.y, r: 24, class: 'target-ring pick' }, g);
        g.addEventListener('click', () => this.answerQuiz(i));
      });
      return;
    }

    if (game.phase !== 'move' || game.player.isBot) return;
    for (const opt of game.moveOptions()) {
      const { x, y } = pixelOf(game.board, opt.pos);
      const g = el('g', { class: 'target' }, this.targetLayer);
      el('circle', { cx: x, cy: y, r: 30, class: 'target-hit' }, g);
      el('circle', {
        cx: x,
        cy: y,
        r: opt.city ? 22 : 14,
        class: opt.city ? 'target-ring' : 'target-ring far',
      }, g);
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
    // Yläpalkissa on kukkaro ja päiväkirjan päivämäärä. Sijainti, kokemus ja
    // tietoprosentti ovat passissa: kartta on tärkeämpi kuin mittaristo.
    this.turnPill.appendChild(html('span', '', `£${game.player.money}`));
    // Mittari on päivämäärä, ei kello eikä palkki: aika on tarinaa, ei uhkaa,
    // joten se ei saa hälytysväriä eikä muutu punaiseksi ennätyksen jälkeen.
    this.turnPill.appendChild(html('span', 'clock', game.clockLabel()));
  }

  /** Matkan tiedot passiin: missä ollaan, paljonko kokemusta ja tietoa. */
  renderProgress() {
    const { game } = this;
    const p = game.player;
    this.passportProgress.textContent = '';

    const rivi = (label, value) => {
      const row = html('div', 'find');
      row.appendChild(html('span', 'find-text', label));
      row.appendChild(html('span', 'find-value', value));
      this.passportProgress.appendChild(row);
    };

    const city = this.factCity(p.pos);
    rivi('Sijainti', p.pos.type === 'edge' ? `matkalla — ${city.name}` : city.name);
    rivi('Kukkaro', `£${p.money}`);
    rivi('Kokemus', `${p.xp ?? 0} kp`);
    const tieto = game.knowledgePercent(p);
    if (tieto !== null) rivi('Tieto tästä laudasta', `${tieto} %`);
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

    // Lähtöpisteen valinta tehdään kartalta yhdellä napautuksella, joten
    // toimintopaneelissa on vain ohje.
    // Aloitusnäkymässä ei ole toimintoja eikä tilariviä: avausteksti hoitaa
    // kehotuksen, ja tyhjä kortti vain veisi tilaa kartalta.
    if (game.phase === 'pickstart') {
      this.turnStatus.textContent = '';
      this.hint.textContent = '';
      this.turnCard.hidden = true;
      return;
    }
    this.turnCard.hidden = false;

    if (p.isBot) {
      this.turnStatus.textContent = `${p.name} miettii…`;
      this.hint.textContent = '';
      return;
    }

    if (game.phase === 'move') {
      // Tilarivi kertoo jo "valitse kohde kartalta" — erillinen kupla
      // ylhäällä olisi sama kehotus kahdesti ja jäisi päiväkirjan päälle.
      this.turnStatus.textContent = `Heitit ${game.die} — valitse kohde kartalta.`;
      this.hint.textContent = '';
      return;
    }

    if (game.phase === 'event') {
      this.turnStatus.textContent = 'Matkalla sattui jotain.';
      this.hint.textContent = '';
      return;
    }
    if (game.phase === 'quiz') {
      this.turnStatus.textContent = 'Tietovisa käynnissä.';
      this.hint.textContent = '';
      return;
    }

    this.hint.textContent = '';
    const modes = game.travelModes();

    // Saapuminen aarrekaupunkiin kerrotaan keskelle ruutua omana korttinaan;
    // valinta tehdään siellä, joten toimintopaneeliin ei tule nappeja.
    if (game.phase === 'offer') {
      const city = game.cityOf();
      this.turnStatus.textContent = `${city.name} — saavuit perille.`;
      this.openArrival(city);
      return;
    }

    if (game.phase === 'roll') {
      // Kun matkustustapa valittiin automaattisesti, ei ole valittavaa eikä
      // mihin palata: noppa pyörähtää itsestään.
      if (game.autoTravel) {
        this.turnStatus.textContent = `${TRAVEL_LABEL[game.travelMode]} — noppa pyörähtää.`;
        this.autoRoll();
        return;
      }
      this.turnStatus.textContent = `${TRAVEL_LABEL[game.travelMode]} — heitä noppa.`;
      const rollBtn = html('button', 'primary', '🎲 Heitä noppa');
      rollBtn.addEventListener('click', () => this.doRoll());
      this.actionsEl.appendChild(rollBtn);

      const backBtn = html('button', '', '↩ Vaihda matkustustapa');
      backBtn.addEventListener('click', () => this.doAction(() => game.actionCancelTravel()));
      this.actionsEl.appendChild(backBtn);
      return;
    }

    // Vaihe 'action': matkustustavan valinta. Näytöllä pidetään kerrallaan
    // vain kourallinen nappeja — laivat, lennot ja portit odottavat
    // toisen vaiheen takana.
    this.renderTravelChoice(modes);
  }

  /**
   * Matkustustavan valinta kahdessa vaiheessa. Vaihe A: jalan, "laiva &
   * lento…" ja aarrekaupungin kysymys. Vaihe B (`travelExpanded`): kaikki
   * maksulliset ja laudalta toiselle vievät vaihtoehdot.
   */
  renderTravelChoice(modes) {
    const { game } = this;
    const flights = game.airportDestinations();
    const gateways = game.gatewayOptions();
    const countryGates = game.countryGateOptions();
    const hasSlow = modes.includes('sea') || flights.length > 0
      || gateways.length > 0 || countryGates.length > 0;

    if (!this.travelExpanded) {
      this.turnStatus.textContent = 'Valitse matkustustapa.';

      if (modes.includes('land')) {
        const landBtn = this.iconButton('🥾', 'Jalan', modes.includes('stay') ? '' : 'primary');
        landBtn.addEventListener('click', () => this.doWalk());
        this.actionsEl.appendChild(landBtn);
      }

      if (hasSlow) {
        const moreBtn = this.iconButton('⛵', 'Laiva & lento');
        moreBtn.addEventListener('click', () => {
          this.travelExpanded = true;
          this.render();
        });
        this.actionsEl.appendChild(moreBtn);
      }

      if (modes.includes('stay')) {
        const stayBtn = this.iconButton('🔍', 'Tutki paikka', 'primary');
        stayBtn.addEventListener('click', () => {
          sfx.play('paper');
          this.doAction(() => game.actionTravel('stay'));
        });
        this.actionsEl.appendChild(stayBtn);
      }
      return;
    }

    // Vaihe B.
    this.turnStatus.textContent = 'Laivalla, lentäen vai portin kautta?';

    if (modes.includes('sea')) {
      const seaBtn = html('button', 'wide', `⛵ Laivalla (${SEA_FARE} p)`);
      seaBtn.addEventListener('click', () => {
        sfx.play('ferry');
        this.doAction(() => game.actionTravel('sea'));
      });
      this.actionsEl.appendChild(seaBtn);
    }

    for (const dest of flights) {
      const city = game.board.cityById.get(dest);
      const flyBtn = html('button', 'wide', `✈ ${city.name} (${FLIGHT_PRICE} p)`);
      flyBtn.addEventListener('click', () => this.doFly(dest));
      this.actionsEl.appendChild(flyBtn);
    }

    // Vaelluksessa porttikaupungeista jatketaan toisille laudoille.
    for (const link of gateways) {
      const gwBtn = html('button', 'wide', `🧭 ${link.label}`);
      gwBtn.addEventListener('click', () => {
        sfx.play('flight');
        this.doAction(() => game.actionGateway(link.index));
      });
      this.actionsEl.appendChild(gwBtn);
    }

    // Tietoportti: maan lauta aukeaa pääkaupungista vaikealla kysymyksellä.
    for (const gate of countryGates) {
      const gateBtn = html('button', 'wide', `★ ${gate.label} — vaikea kysymys`);
      gateBtn.addEventListener('click', () => {
        sfx.play('paper');
        this.doAction(() => game.actionGateQuiz(gate.index));
      });
      this.actionsEl.appendChild(gateBtn);
    }

    const backBtn = this.iconButton('↩', 'Takaisin');
    backBtn.addEventListener('click', () => {
      this.travelExpanded = false;
      this.render();
    });
    this.actionsEl.appendChild(backBtn);
  }

  /**
   * Toimintonappi ikonina. Teksti jää saavutettavuutta varten title- ja
   * aria-label-määreisiin sekä leveälle ruudulle näkyväksi selitteeksi, jotta
   * napit vievät kartalta mahdollisimman vähän tilaa.
   */
  iconButton(icon, label, extra = '') {
    const btn = html('button', `icon-btn${extra ? ` ${extra}` : ''}`);
    btn.type = 'button';
    btn.title = label;
    btn.setAttribute('aria-label', label);
    btn.appendChild(html('span', 'icon-glyph', icon));
    btn.appendChild(html('span', 'icon-label', label));
    return btn;
  }

  /**
   * Lähtöpisteen valinta: napautus vie suoraan perille. Porttikaupungista
   * laskeudutaan mantereen omalle laudalle, muualta jäädään maailmankartalle.
   * Useamman portin kaupungeista (Kairo, Mumbai) otetaan ensimmäinen eli
   * kaupungin oma manner — välikysymystä ei enää esitetä.
   */
  doPickStart(city) {
    const { game } = this;
    const portti = (city.links ?? []).length > 0;
    sfx.play(portti ? 'flight' : 'paper');
    this.doAction(() => game.actionPickStart(city.id, portti ? 0 : null));
  }

  /** Jalan: matkustustapa ja nopanheitto samalla painalluksella. */
  doWalk() {
    const { game } = this;
    this.run(
      () => {
        const chosen = game.actionTravel('land');
        return chosen.ok ? game.actionRoll() : chosen;
      },
      { after: (result) => this.animateDie(result.die) },
    );
  }

  /**
   * Heittää nopan ilman painallusta. Sallittu vain kun matkustustapa
   * valikoitui itsestään — muuten pelaaja saa aina painaa itse.
   */
  autoRoll() {
    if (this.busy || this.autoRollTimer) return;
    this.autoRollTimer = setTimeout(() => {
      this.autoRollTimer = null;
      const { game } = this;
      if (game.phase === 'roll' && game.autoTravel && !game.player.isBot) this.doRoll();
    }, AUTO_ROLL_MS);
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
   * Tietoruutu pelaajan sijainnista. Siinä puhuu vuorotellen kaksi ääntä:
   * isoisän 1870-luvun päiväkirja ja nuoren herran nykyhavainto. Teksti
   * vaihtuu kierroksittain mutta pysyy samana saman vuoron ajan, jotta sen
   * ehtii lukea.
   */
  renderFact() {
    const { game } = this;
    // Aloitusnäkymässä kartta saa puhua puolestaan: tietoruutu on piilossa.
    this.factCard.hidden = game.phase === 'pickstart';
    if (game.phase === 'pickstart') {
      // Piilotuksen lisäksi sisältö tyhjennetään: muuten edellisen pelin
      // teksti voi välähtää ruudulla ennen kuin kortti ehtii piiloon.
      this.factKey = null;
      this.factWiki.hidden = true;
      this.factVoiceEl.textContent = '';
      this.factPlace.textContent = '';
      this.factText.textContent = '';
      return;
    }

    // Isoisän aikataulu nousee esiin, kun matkapäivä ohittaa merkinnän. Rivi
    // menee saapumismerkinnän edelle, koska se näkyy vain yhden vuoron ajan.
    const aikataulu = game.scheduleNote;
    if (aikataulu && aikataulu.packId === game.pack.id) {
      const key = `schedule:${aikataulu.packId}:${aikataulu.day}`;
      if (this.factKey === key) return;
      this.factKey = key;
      this.factVoiceEl.textContent = 'Isoisän aikataulusta';
      this.factPlace.textContent = `Päivä ${aikataulu.day}`;
      this.typeText(this.factText, aikataulu.text);
      return;
    }

    // Laudalle saavuttaessa tietoruudussa on saapumismerkintä. Se väistyy,
    // kun matkaaja lähtee saapumiskaupungista liikkeelle.
    const note = game.diaryNote;
    if (note && note.packId === game.pack.id && posKey(game.player.pos) === note.pos) {
      const key = `diary:${note.packId}:${note.text}`;
      if (this.factKey === key) return;
      this.factKey = key;
      this.factVoiceEl.textContent = 'Matkapäiväkirjasta';
      this.factPlace.textContent = game.pack.boardLabel;
      this.typeText(this.factText, note.text);
      return;
    }

    // Isoisän vihje laudan pääaarteesta nousee esiin harvakseltaan.
    const hint = game.starHint();
    if (hint) {
      const key = `hint:${game.pack.id}:${game.turnCount}`;
      if (this.factKey === key) return;
      this.factKey = key;
      this.factVoiceEl.textContent = 'Päiväkirjan taitettu sivu';
      this.factPlace.textContent = game.pack.boardLabel;
      this.typeText(this.factText, hint);
      return;
    }

    const player = game.player;
    const city = this.factCity(player.pos);
    // "Lue lisää" koskee aina sitä paikkaa, jonka teksti ruudussa on.
    this.factWikiCity = city.id;
    this.factWiki.hidden = !city.wiki;
    const facts = game.pack.placeFacts[city.id];
    if (!facts || facts.length === 0) return;

    const pick = Math.floor(hash01(`fact:${city.id}:${game.turnCount}:${player.id}`) * facts.length);
    const fact = facts[Math.min(pick, facts.length - 1)];
    const text = factText(fact);
    const key = `${city.id}:${text}`;
    if (key === this.factKey) return;
    this.factKey = key;

    // Otsikko kertoo kumpi ääni puhuu, alarivi paikan.
    const onRoute = player.pos.type === 'edge';
    this.factVoiceEl.textContent = voiceTitle(factVoice(fact));
    this.factPlace.textContent = onRoute ? `Matkalla — ${city.name}` : city.name;
    const source = this.sourceLine(factSource(fact));
    this.typeText(this.factText, text, 'fact', () => {
      if (source) this.factText.appendChild(source);
    });

    // Uusi tieto häivähtää esiin, jotta vaihdoksen huomaa.
    this.factText.classList.remove('fact-in');
    void this.factText.offsetWidth;
    this.factText.classList.add('fact-in');
  }

  /**
   * Lähderivi vastauksen perään. Verkko-osoite näytetään linkkinä palvelimen
   * nimellä, sanallinen viite sellaisenaan. Periaate 2: väite on tarkistettavissa.
   */
  sourceLine(sources) {
    if (!sources || sources.length === 0) return null;
    const row = html('span', 'source-line');
    row.appendChild(html('span', 'source-label', 'Lähde:'));
    sources.forEach((source, i) => {
      if (i > 0) row.appendChild(html('span', '', ' · '));
      if (isSourceUrl(source)) {
        const link = html('a', '', sourceLabel(source));
        link.href = source;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        row.appendChild(link);
      } else {
        row.appendChild(html('span', '', source));
      }
    });
    return row;
  }

  render() {
    this.onChange?.(this.game);
    // Aloituskartalla asettelu on kahdessa palstassa; pelin käynnistyttyä
    // kartta täyttää koko ruudun ja paneelit kelluvat sen päällä.
    document.body.dataset.mode = this.game.phase === 'pickstart' ? 'start' : 'play';
    // Matkavalinnan toinen vaihe koskee vain käsillä olevaa valintaa: heti
    // kun vaihe vaihtuu, ollaan taas seuraavan vuoron ensimmäisessä vaiheessa.
    if (this.game.phase !== 'action') this.travelExpanded = false;
    // Saapumiskortti kuuluu vain offer-vaiheeseen: botin vuorolla ja muissa
    // vaiheissa se suljetaan, jottei se jää roikkumaan kartan päälle.
    if (this.game.phase !== 'offer' || this.game.player.isBot) this.closeArrival();
    this.renderIntro();
    this.stampPassport();
    // Vuorossa oleva pelaaja voi olla eri laudalla kuin edellinen.
    if (this.game.pack.id !== this.drawnPackId) this.drawBoardFor(this.game.pack);
    this.drawTokens();
    this.drawTargets();
    this.drawPawns();
    this.renderTurnPill();
    this.renderActions();
    this.renderFact();
    this.renderQuiz();

    if (this.game.phase === 'over') {
      this.showWinner();
      return;
    }
    this.scheduleBot();
  }

  /**
   * Vihreä passi saa leiman jokaisesta laudasta, jolla matkaaja on käynyt.
   * Leimat säilyvät pelikertojen yli, joten aloitusnäkymässä ei leimata:
   * lauta on vasta valitsematta.
   */
  stampPassport() {
    const { game } = this;
    if (game.phase === 'pickstart') return;
    if (stampBoard(game.pack.id, game.pack.boardLabel)) {
      const box = this.buildToast({
        kind: 'stamp',
        icon: '🛂',
        text: 'Passiin uusi leima',
        sub: game.pack.boardLabel,
      });
      sfx.play('paper');
      setTimeout(() => this.removeToast(box), TOAST_MS.default);
    }

    // Kunniamerkintä: isoisän ennätys rikottiin tällä laudalla. Sekin on
    // passissa eikä pelitallenteessa, joten se jää talteen uusiin peleihin.
    const mark = game.recordMark;
    if (mark && stampBoard(`kunnia:${mark.packId}`, `${game.pack.boardLabel} — ${mark.label}`)) {
      const box = this.buildToast({
        kind: 'stamp',
        icon: '🏅',
        text: mark.label,
        sub: `Aarre löytyi päivänä ${mark.day}`,
      });
      sfx.play('paper');
      setTimeout(() => this.removeToast(box), TOAST_MS.default);
    }
  }

  /**
   * Saapumiskortti: kaupungin matkatarina keskellä ruutua ja sen lopussa
   * valinta, avataanko aarre. Kieltävä vastaus päättää vuoron, jolloin
   * seuraava nopanheitto alkaa tavalliseen tapaan.
   */
  openArrival(city) {
    if (this.arrivalShownFor === city.id && this.arrivalDialog.open) return;
    this.arrivalShownFor = city.id;

    // Kortti kertoo vain päätöksen. Paikan tarina tulee kartan
    // päiväkirjasta ja Lue lisää on vain karttanäkymässä, jottei sama
    // tieto toistu kahdessa paikassa.
    this.arrivalCity.textContent = city.name;
    if (!this.arrivalDialog.open) this.arrivalDialog.showModal();
  }

  /**
   * "Lue lisää": Wikipedian tiivistelmä paikasta. Dialogi avautuu heti ja
   * täyttyy kun haku valmistuu, jottei nappi tunnu jumittuneelta. Jos haku
   * epäonnistuu — ei yhteyttä, 404 tai täsmennyssivu — dialogissa lukee
   * kohteliaasti, ettei tietoja saatu, eikä peli jää siitä jumiin.
   */
  async openWiki(cityId) {
    const city = this.game.board.cityById.get(cityId);
    if (!city?.wiki) return;

    this.wikiTitle.textContent = city.name;
    this.wikiImage.hidden = true;
    this.wikiImage.removeAttribute('src');
    this.wikiExtract.textContent = 'Haetaan…';
    this.wikiSource.textContent = '';
    if (!this.wikiDialog.open) this.wikiDialog.showModal();

    const summary = await fetchSummary(city.wiki);
    // Pelaaja on voinut ehtiä sulkea dialogin haun aikana.
    if (!this.wikiDialog.open) return;

    if (!summary) {
      this.wikiExtract.textContent = 'Tietoja ei saatu haettua. Matka jatkuu.';
      return;
    }

    this.wikiTitle.textContent = summary.title || city.name;
    if (summary.image) {
      this.wikiImage.src = summary.image;
      this.wikiImage.alt = summary.title || city.name;
      this.wikiImage.hidden = false;
    }
    this.wikiExtract.textContent = summary.extract;

    // CC BY-SA vaatii maininnan ja linkin — myös kaupallisessa käytössä.
    this.wikiSource.textContent = 'Lähde: Wikipedia (CC BY-SA) — ';
    const link = html('a', '', 'lue artikkeli');
    link.href = summary.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    this.wikiSource.appendChild(link);
  }

  closeArrival() {
    this.arrivalShownFor = null;
    if (this.arrivalDialog.open) this.arrivalDialog.close();
  }

  /**
   * Avausteksti kirjoittuu kartan alapuoliseen tyhjään pergamenttiin.
   * Teksti on omistajan lukkoon lyömä eikä sitä muokata täällä; se naksuu
   * esiin kirjoituskoneen tapaan ja väistyy heti kun kohde on valittu.
   */
  renderIntro() {
    const nakyy = this.game.phase === 'pickstart';
    this.introEl.hidden = !nakyy;
    if (!nakyy) {
      this.introShown = false;
      this.introText.textContent = '';
      return;
    }
    if (this.introShown) return;
    this.introShown = true;
    // Avausteksti kirjoittuu selvästi hitaammin kuin muut: se on matkan
    // ensimmäinen hetki eikä pelitilanteen ilmoitus.
    this.typeText(this.introText, INTRO_TEXT, 'intro', null, INTRO_TYPE_MS);
    // Koko teksti on jo paikallaan, joten koon voi sovittaa heti — sen
    // jälkeen mikään ei enää liiku kirjoituksen aikana.
    this.fitIntro();
  }

  /** Passidialogi: leimat ruudukossa, vanhin ensin. */
  openPassport() {
    const stamps = stampList();
    this.passportGrid.textContent = '';
    if (stamps.length === 0) {
      this.passportGrid.appendChild(html('p', 'muted', 'Passi on vielä puhdas. Ensimmäinen leima tulee heti, kun astut laudalle.'));
    }
    for (const stamp of stamps) {
      const mark = html('div', 'stamp');
      mark.appendChild(html('span', 'stamp-label', stamp.label));
      mark.appendChild(html('span', 'stamp-date', stampDate(stamp.date)));
      this.passportGrid.appendChild(mark);
    }
    this.passportCount.textContent = stamps.length === 1
      ? '1 leima'
      : `${stamps.length} leimaa`;
    this.renderProgress();
    this.renderFinds();
    if (!this.passportDialog.open) this.passportDialog.showModal();
  }

  /**
   * Matkasaalis passissa: tähti, hevosenkengät ja jalokivet. Nämä näkyivät
   * ennen erillisessä pelaajapaneelissa, joka vei tilaa kartalta.
   */
  renderFinds() {
    const { game } = this;
    const p = game.player;
    this.passportFinds.textContent = '';

    const rivi = (icon, text) => {
      const row = html('div', 'find');
      row.appendChild(icon);
      row.appendChild(html('span', 'find-text', text));
      this.passportFinds.appendChild(row);
    };

    if (p.hasStar) rivi(tokenIconSvg('star', 20), game.pack.tokens.types.star.name);
    if (p.horseshoes) rivi(tokenIconSvg('horseshoe', 20), `Hevosenkenkiä ${p.horseshoes}`);

    // Jalokivet tyypeittäin: sama laji voi toistua monelta laudalta.
    const gems = p.finds.filter((t) => (game.tokenTypes[t]?.value ?? 0) > 0);
    const counts = new Map();
    for (const type of gems) counts.set(type, (counts.get(type) ?? 0) + 1);
    for (const [type, n] of counts) {
      rivi(tokenIconSvg(type, 20), `${game.tokenTypes[type].name}${n > 1 ? ` ×${n}` : ''}`);
    }

    if (!this.passportFinds.childElementCount) {
      this.passportFinds.appendChild(html('p', 'muted', 'Laukku on vielä tyhjä.'));
    }
  }

  showWinner() {
    clearTimeout(this.botTimer);
    if (!this.winnerDialog.open) sfx.play('win');
    const w = this.game.winner;
    document.getElementById('winner-title').textContent = `🏆 ${w.name} voitti!`;
    this.typeText(document.getElementById('winner-text'), w.hasStar
      ? this.game.pack.texts.winnerStar(w.name, w.money)
      : `${w.name} ehti hevosenkengän kanssa kotiin ennen tähden löytäjää.`, 'winner');
    const roamBtn = document.getElementById('winner-roam');
    roamBtn.onclick = () => {
      this.winnerDialog.close();
      this.doAction(() => this.game.continueRoaming());
    };
    if (!this.winnerDialog.open) this.winnerDialog.showModal();
  }

  // --- tietovisa ----------------------------------------------------------

  /**
   * Vastausnapit rakennetaan vain kun kysymys vaihtuu, ja päivitetään muuten
   * paikallaan. Jos ne rakennettaisiin joka renderillä uudelleen, esiin-
   * liukuva option-in-animaatio alkaisi alusta joka kerta ja koko lista
   * välähtäisi esimerkiksi väärän vastauksen jälkeen.
   */
  syncOptions(data, onPick) {
    if (this.builtOptionsFor !== data) {
      this.builtOptionsFor = data;
      this.optionButtons = data.options.map((text, i) => {
        const btn = html('button', 'quiz-option');
        btn.style.setProperty('--i', String(i));
        btn.appendChild(html('span', 'letter', LETTERS[i]));
        btn.appendChild(html('span', 'text', text));
        btn.addEventListener('click', () => {
          if (!btn.disabled) onPick(i);
        });
        return btn;
      });
      this.quizOptions.textContent = '';
      for (const btn of this.optionButtons) this.quizOptions.appendChild(btn);
    }

    const answered = data.chosen !== null;
    this.optionButtons.forEach((btn, i) => {
      const hidden = data.hidden.includes(i);
      btn.classList.toggle('hidden-option', hidden);
      btn.classList.toggle('correct', answered && i === data.correct);
      btn.classList.toggle('wrong', answered && i === data.chosen && !data.right);
      btn.disabled = hidden || answered || this.game.player.isBot;
    });
  }

  /**
   * Tapahtumakortti: kysymyksen sijaan tapahtuu jotain. Vaikutus kerrotaan
   * kortin lopussa omalla rivillään, jottei pelaajan tarvitse päätellä
   * sääntöä tarinatekstistä.
   */
  renderEvent() {
    const { game } = this;
    const kortti = game.eventCard;
    if (game.phase !== 'event' || !kortti) {
      if (this.eventDialog.open) this.eventDialog.close();
      this.eventShownFor = null;
      return;
    }
    if (this.eventShownFor === kortti) return;
    this.eventShownFor = kortti;

    const selitteet = {
      viive: 'Matka viivästyy yhdellä vuorolla.',
      kyyti: 'Saat ilmaisen kyydin naapurikaupunkiin.',
    };
    const { effect } = kortti;
    this.eventEffect.textContent = effect?.kind === 'raha'
      ? (effect.amount >= 0 ? `Kukkaroon +${effect.amount} puntaa.` : `Kukkarosta ${effect.amount} puntaa.`)
      : (selitteet[effect?.kind] ?? '');
    this.eventText.textContent = '';
    this.typeText(this.eventText, kortti.text, 'event');
    if (!this.eventDialog.open) this.eventDialog.showModal();
  }

  renderQuiz() {
    const { game } = this;
    this.renderEvent();
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

    // Karttakysymykseen vastataan napauttamalla lautaa, joten modaali pysyy
    // kiinni siihen asti. Vastauksen jälkeen tulos näytetään normaalisti.
    if (quiz.kind === 'map' && quiz.chosen === null) {
      this.stopQuizTimer();
      if (this.quizDialog.open) this.quizDialog.close();
      this.hint.textContent = quiz.question;
      return;
    }

    const city = game.board.cityById.get(quiz.cityId);
    const hardTag = quiz.hard ? ` · vaikea kysymys +${HARD_BONUS} p` : '';
    if (quiz.kind === 'claim') {
      // Väittämässä puhuu isoisä, ei peli: otsikko kertoo äänen.
      this.quizCity.textContent = `Isoisän päiväkirjasta, 1873 — totta vai tarua?`;
    } else if (quiz.kind === 'map') {
      this.quizCity.textContent = `${city.name} — kartalta`;
    } else {
      this.quizCity.textContent = quiz.gate
        ? `${city.name} — portti: ${quiz.gate.label}`
        : `${city.name} — ${game.player.name}${hardTag}`;
    }
    // Kysymys naksuu ruudulle kirjoituskoneella vain kerran avautuessaan.
    if (this.typedQuizFor !== quiz) {
      this.typedQuizFor = quiz;
      this.typeText(this.quizQuestion, quiz.question, 'quiz');
    }
    this.syncOptions(quiz, (i) => this.answerQuiz(i));

    const answered = quiz.chosen !== null;
    // Vastauksen jälkeen näytetään ensin pelkkä tuomio, ja vasta aarteen
    // paljastuksen jälkeen löytö ja selitys.
    const revealed = this.revealShownFor === quiz;

    // Apukeinot: 40 punnalla sanallinen vihje, 80 punnalla kaksi väärää pois.
    const p = game.player;
    const used = quiz.hidden.length > 0;
    // Väittämässä on kaksi vaihtoehtoa ja karttakysymykseen vastataan
    // kartalta, joten 50:50 ei kuulu niihin lainkaan.
    this.quizFifty.hidden = answered || p.isBot || quiz.options.length < 4;
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
        if (quiz.gate && quiz.right) {
          body.appendChild(html('strong', '', `★ Portti aukeaa — ${quiz.gate.label}!`));
          body.appendChild(html('span', 'muted', 'Tieto avasi tien: matka jatkuu ilmaiseksi.'));
        } else if (quiz.right && found) {
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
        const quizSource = this.sourceLine(quiz.source);
        if (quizSource) body.appendChild(quizSource);
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
    if (this.typedQuizFor !== duel) {
      this.typedQuizFor = duel;
      this.typeText(this.quizQuestion, duel.question, 'quiz');
    }
    this.syncOptions(duel, (i) => this.answerDuelUi(i));

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
        const duelSource = this.sourceLine(duel.source);
        if (duelSource) body.appendChild(duelSource);
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

  /**
   * Kirjoituskone: teksti naksuu ruudulle sana kerrallaan kuin vanhalla
   * matkakirjoituskoneella. Sama paikka (slot) keskeyttää edellisen
   * kirjoituksen, jotta tekstit eivät sekoitu keskenään. Liikkeen
   * vähennystä toivovalle teksti ilmestyy kerralla.
   */
  /**
   * Kirjoituskoneteksti. Koko teksti on alusta asti paikallaan, mutta
   * kirjoittamaton osa on näkymätöntä: se varaa tilansa, joten rivitys ei
   * muutu kesken kirjoituksen eikä jo luettu teksti hyppää paikaltaan.
   * Aiemmin sanat lisättiin yksi kerrallaan, jolloin koko kappale latoutui
   * uudelleen joka sanalla.
   */
  typeText(target, text, slot = 'fact', done = null, speed = TYPE_MS) {
    this.typeTimers ??= {};
    clearInterval(this.typeTimers[slot]);
    const full = String(text);
    if (this.reducedMotion) {
      target.textContent = full;
      done?.();
      return;
    }

    target.textContent = '';
    const kirjoitettu = html('span', 'typed');
    const tuleva = html('span', 'pending');
    target.appendChild(kirjoitettu);
    target.appendChild(tuleva);

    const words = full.split(' ');
    let shown = 0;
    const piirra = () => {
      kirjoitettu.textContent = words.slice(0, shown).join(' ');
      tuleva.textContent = shown < words.length
        ? (shown ? ' ' : '') + words.slice(shown).join(' ')
        : '';
    };
    piirra();

    this.typeTimers[slot] = setInterval(() => {
      shown++;
      piirra();
      if (shown >= words.length) {
        clearInterval(this.typeTimers[slot]);
        // Lopuksi pelkkä teksti, jotta perään lisättävä lähderivi asettuu
        // luontevasti eikä jää näkymättömän jäänteen taakse.
        target.textContent = full;
        done?.();
      }
    }, speed);
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

    if (game.phase === 'event') {
      this.run(() => game.closeEvent());
      return;
    }
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
