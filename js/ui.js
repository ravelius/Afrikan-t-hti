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
  DUEL_BYPASS_SHOES, DUEL_PRIZE, EXPLORE_REWARD, FIFTY_FIFTY_PRICE, FLIGHT_PRICE,
  HARD_BONUS, HINT_PRICE, QUIZ_SECONDS, SEA_FARE,
} from './game.js';
import {
  factSource, factText, factVoice, isSourceUrl, packById, sourceLabel, voiceTitle,
} from './pack.js';
import { stampBoard, stampDate, stampList } from './passport.js';
import { fetchArticle, fetchImage, fetchImages, fetchSummary, upsizeImage } from './wiki.js';
import { drawPuzzle } from './packs/africa-puzzles.js';
import { OMAT_TIIVISTELMAT } from './packs/africa-tiivistelmat.js';
import { AFRICA_VALOKUVAT, valokuvaUrl } from './packs/africa-valokuvat.js';
import { AFRICA_SAAPUMISET } from './packs/africa-saapumiset.js';
import { AFRICA_KULTTUURI, KULTTUURI_PALKKIO } from './packs/africa-kulttuuri.js';

// Uuden mallin saapumistekstit laudoittain (pilotti: Afrikka).
const SAAPUMISTEKSTIT = { africa: AFRICA_SAAPUMISET };

// Kaupungin elämää -nostot laudoittain (pilotti: Afrikka).
const KULTTUURIT = { africa: AFRICA_KULTTUURI };

// Vanhat valokuvat muistikirjan kylkeen laudoittain — toistaiseksi vain
// Afrikalla on kuvasto.
const VALOKUVAT = { africa: AFRICA_VALOKUVAT };

// Tiivistelmät ja kuvat haetaan kerran per artikkeli: sama kuva näkyy
// sekä saapumiskortissa että Lue lisää -dialogissa ilman uutta hakua.
const wikiSummaryCache = new Map();
const wikiImageCache = new Map();

async function cachedSummary(title) {
  if (!wikiSummaryCache.has(title)) {
    // Oma suomenkielinen tiivistelmä paikkaa puuttuvan tai englannin-
    // kielisen wikitekstin — ja toimii myös ilman verkkoa. Kunnollinen
    // fi-artikkeli ohittaa oman tekstin itsestään. Wikihaun kuva
    // säilytetään, otsikko pysyy pelin omana.
    wikiSummaryCache.set(title, fetchSummary(title).then((summary) => {
      const oma = OMAT_TIIVISTELMAT[title];
      if (!oma || (summary && summary.lang === 'fi')) return summary;
      return { ...(summary ?? {}), title, extract: oma, lang: 'fi', oma: true };
    }).catch(() => {
      const oma = OMAT_TIIVISTELMAT[title];
      return oma ? { title, extract: oma, lang: 'fi', oma: true } : null;
    }));
  }
  return wikiSummaryCache.get(title);
}

async function cachedImage(title) {
  if (!wikiImageCache.has(title)) {
    wikiImageCache.set(title, cachedSummary(title).then((s) => fetchImage(s)));
  }
  return wikiImageCache.get(title);
}

// Saapumishavaintojen luennat: 'pakka:kaupunki' kertoo, että tiedosto
// assets/audio/puhe-<pakka>-havainto-<kaupunki>.mp3 on olemassa
// (ElevenLabs, Viisas Kertoja). Kortin kaiutin ja luenta näkyvät vain
// näille — muut kaupungit saavat tekstinsä ilman ääntä, kunnes niiden
// luennat generoidaan.
const HAVAINTOLUENNAT = new Set([
  'africa:tanger',
  'africa:kairo',
  'africa:tripoli',
  'africa:murzuk',
  'africa:alkufra',
  'africa:sahara',
  'africa:ahaggar',
  'africa:timbuktu',
  'africa:gao',
  'africa:dakar',
  'africa:sierraleone',
  'africa:kappalmas',
  'africa:kumasi',
  'africa:orjarannikko',
  'africa:kano',
  'africa:kamerun',
  'africa:kongo',
  'africa:angola',
  'africa:namib',
  'africa:kapkaupunki',
  'africa:kimberley',
  'africa:mosambik',
  'africa:madagaskar',
  'africa:sansibar',
  'africa:kilimandzaro',
  'africa:viktoria',
  'africa:tanganjika',
  'africa:bahrelghazal',
  'africa:darfur',
  'africa:suakin',
  'africa:addisabeba',
  'africa:rashafun',
]);

const wikiGalleryCache = new Map();

async function cachedGallery(title) {
  if (!wikiGalleryCache.has(title)) {
    wikiGalleryCache.set(title, cachedSummary(title).then((s) => fetchImages(s)));
  }
  return wikiGalleryCache.get(title);
}
import { sfx, treasureSound } from './sound.js';
import {
  playPlaceAmbience, startQuizMusic, stopPlaceStream, stopQuizMusic,
} from './ambience-stream.js';
import { puheVoima } from './aani-ehdokkaat.js';
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
// Mantereen sisäinen lento liukuu rauhallisemmin moottorin hurinalla.
const MANNER_LENTO_MS = 2800;
// Lentoanimaation kesto: sen verran, että repliikin ehtii lukea.
// Kalvolento saa kestää: matka on tarkoitus tuntea, ei ohittaa.
const FLY_OVERLAY_MS = 4800;
const TOAST_MS = { die: 950, default: 1200 };
const AUTO_ROLL_MS = 320; // tauko ennen itsestään pyörähtävää noppaa
// Kuinka paljon pergamenttia jatketaan kartan alle avaustekstiä varten.
const INTRO_SPACE = 0.5;
// Kuinka paljon lautaa lasketaan yläreunasta aloitusnäkymässä.
const INTRO_TOP = 0.05;
// Kirjoituskoneen tahti: avaus saa naksua rauhassa, muut tekstit ripeästi.
const TYPE_MS = 50;
const INTRO_TYPE_MS = 190;
// Tehtäväkortti paljastuu vaiheittain: kehys, tauko, kysymys, tauko,
// vaihtoehdot. Kirjoituskone on etusivua ripeämpi mutta rauhallisempi
// kuin pelitilanneilmoitukset.
const QUIZ_TYPE_MS = 95;
const QUIZ_PAUSE_MS = 700;
// Avaustekstin kirjasinkoko sovitetaan kaistaan näiden rajojen sisällä.
const INTRO_FONT_MAX = 1.32;
const INTRO_FONT_MIN = 0.72;
// Omistajan päättämä avausteksti. ÄLÄ muokkaa ilman omistajan lupaa
// (docs/tyolista-opukselle.md, paketti 3).
const INTRO_TEXT = 'Vintiltä löytyi isoisän matkalaukku: kartta vuodelta 1872, '
  + 'kukkarollinen puntia ja kulunut päiväkirja.\n\n'
  + 'Ensimmäinen sivu: "Maailman ympäri kahdeksassakymmenessä päivässä."\n\n'
  + 'Viimeinen sivu on revitty melkein kokonaan: "…en tajunnut, että siellä olikin…"\n\n'
  + 'Mitä? Mitä hän oli löytänyt? Tämä pitää selvittää.\n\n'
  + 'Menen heti ostamaan liput — mutta mistä kaupungista aloitan etsinnän?';
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

/**
 * Ensimmäinen virke lainaus- ja päätösmerkkeineen; loput erikseen.
 * Päiväkirjan luennassa ääneen luetaan vain tämä ja teksti lihavoidaan.
 */
function ekaLause(teksti) {
  const m = /^[\s\S]*?[.!?…](?:["»”])?(?=\s|$)/.exec(teksti);
  if (!m) return { eka: teksti, loput: '' };
  return { eka: m[0], loput: teksti.slice(m[0].length).trimStart() };
}

function html(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/**
 * Toimintonappien viivaikonit: emoji erottui kartan mustepiirroksesta,
 * joten ikonit piirretään samalla kynällä kuin kartta — pelkkä ääriviiva
 * nykyisellä tekstivärillä. Nopan silmät ovat ainoa täytetty muoto.
 */
const VIIVA_IKONIT = {
  saapas: '<path d="M7 3.5h4.4v8.2c0 .9.6 1.7 1.5 2l4.8 1.6c1.4.5 2.3 1.3 2.3 2.4 0 .8-.6 1.4-1.4 1.4H8.6c-.9 0-1.6-.7-1.6-1.6z"/><path d="M7 6h4.4M7 8.2h4.4M4 20.6h16.5"/>',
  purje: '<path d="M11 5.4 6 13.6h5zM13 4.2l5.6 9.4H13z"/><path d="M4.6 16.2h14.8l-2 3.4H6.6zM12 13.6v2.6"/>',
  suurennuslasi: '<circle cx="9.8" cy="9.8" r="5.6"/><path d="M13.9 13.9 20 20"/>',
  noppa: '<rect x="3.6" y="3.6" width="16.8" height="16.8" rx="3.2"/><g class="taytto"><circle cx="8.2" cy="8.2" r="1.25"/><circle cx="15.8" cy="8.2" r="1.25"/><circle cx="12" cy="12" r="1.25"/><circle cx="8.2" cy="15.8" r="1.25"/><circle cx="15.8" cy="15.8" r="1.25"/></g>',
  kompassi: '<circle cx="12" cy="12" r="8.4"/><path d="M12 5.8 14.3 12 12 18.2 9.7 12z"/><circle class="taytto" cx="12" cy="12" r="1"/>',
  nuoli: '<path d="M9.5 6.2 5 10.6l4.5 4.4"/><path d="M5 10.6h9.2a4.6 4.6 0 1 1 0 9.2H9.5"/>',
  kone: '<path d="M12 3.6v5.9l7.6 4.6v2.1L12 13.7v4.4l2.4 1.9v1.6L12 20.5l-2.4 1.1V20l2.4-1.9v-4.4L4.4 16.2v-2.1L12 9.5z"/>',
  tahti: '<path d="m12 3.8 2.5 5.2 5.5.7-4 3.9 1 5.6-5-2.7-5 2.7 1-5.6-4-3.9 5.5-.7z"/>',
  passi: '<rect x="5.5" y="3.5" width="13" height="17" rx="2"/><circle cx="12" cy="10.3" r="2.9"/><path d="M8.6 16.6h6.8"/>',
  paivita: '<path d="M19.4 4.8v3.7h-3.7"/><path d="M19.2 8.4a7.4 7.4 0 1 0 1 5.4"/>',
  kallo: '<path d="M12 3.8c-3.9 0-6.5 2.7-6.5 6.1 0 2 .9 3.3 2.1 4.2v2.5h8.8v-2.5c1.2-.9 2.1-2.2 2.1-4.2 0-3.4-2.6-6.1-6.5-6.1z"/><g class="taytto"><circle cx="9.6" cy="10.1" r="1.3"/><circle cx="14.4" cy="10.1" r="1.3"/></g><path d="M10.3 16.6v2.4M13.7 16.6v2.4"/>',
  kenka: '<path d="M5.2 19.6h4.3v-3.2a5.7 5.7 0 1 1 5 0v3.2h4.3"/>',
  kukkaro: '<path d="M9.6 6.9 8.3 4.2h7.4L14.4 6.9"/><path d="M9.6 6.9h4.8c2.5 1.6 4.1 4.2 4.1 7 0 3.3-2.5 5.4-6.5 5.4s-6.5-2.1-6.5-5.4c0-2.8 1.6-5.4 4.1-7z"/>',
  estetty: '<circle cx="12" cy="12" r="8.4"/><path d="M6.3 6.3l11.4 11.4"/>',
  ankkuri: '<circle cx="12" cy="5" r="1.8"/><path d="M12 6.8v12.6M8.7 9.6h6.6"/><path d="M5.2 13.8c.3 3.9 3.2 6.3 6.8 6.3s6.5-2.4 6.8-6.3"/><path d="M5.2 13.8 3.5 12.6M18.8 13.8l1.7-1.2"/>',
  mitali: '<path d="M9.6 3.6 8.2 9.2M14.4 3.6l1.4 5.6"/><circle cx="12" cy="14.4" r="5.2"/><circle class="taytto" cx="12" cy="14.4" r="1.1"/>',
};

/** Viivaikoni ikonin nimellä — tai null, jos nimi onkin tekstimerkki. */
function viivaIkoni(nimi) {
  const piirto = VIIVA_IKONIT[nimi];
  if (!piirto) return null;
  const span = html('span', 'icon-glyph viiva-ikoni');
  span.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${piirto}</svg>`;
  return span;
}

/**
 * Lyhentää Wikipedian tiivistelmän saapumiskortin parin lauseen esittelyksi.
 * Suomen järjestysluvut ("3. suurin") voivat katkaista lauseen liian
 * aikaisin — se on harvinaista ja lopputulos on silti luettava.
 */
function shortIntro(text, maxChars = 280, maxSentences = 3) {
  const siisti = String(text).replace(/\s+/g, ' ').trim();
  const lauseet = siisti.match(/[^.!?]+[.!?]+/g);
  if (!lauseet) {
    return siisti.length > maxChars ? `${siisti.slice(0, maxChars).trimEnd()}…` : siisti;
  }
  let esittely = '';
  let maara = 0;
  for (const lause of lauseet) {
    if (maara && (maara >= maxSentences || esittely.length + lause.length > maxChars)) break;
    esittely += lause;
    maara++;
  }
  return esittely.trim();
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
    this.passportCount = document.getElementById('passport-count-sisus');
    this.passportFinds = document.getElementById('passport-finds');
    this.passportProgress = document.getElementById('passport-progress');

    this.turnCard = document.getElementById('actions').closest('.turn-card');
    this.introEl = document.getElementById('intro');
    this.introText = document.getElementById('intro-text');

    this.arrivalDialog = document.getElementById('arrival-dialog');
    this.arrivalCity = document.getElementById('arrival-city');
    this.arrivalImage = document.getElementById('arrival-image');
    this.arrivalImage.addEventListener('click', () => {
      const city = this.game.board.cityById.get(this.arrivalShownFor);
      if (city?.wiki) this.openLightbox(city.wiki, city.name);
    });
    this.arrivalIntro = document.getElementById('arrival-intro');
    this.arrivalWiki = document.getElementById('arrival-wiki');
    this.arrivalWiki.addEventListener('click', () => this.openWiki(this.arrivalShownFor));
    // Maan tiedot kaupungin rinnalla: lohko täyttyy openArrivalissa.
    this.arrivalMaa = document.getElementById('arrival-maa');
    this.arrivalMaaNimi = document.getElementById('arrival-maa-nimi');
    this.arrivalMaaIntro = document.getElementById('arrival-maa-intro');
    this.arrivalMaaKartta = document.getElementById('arrival-maa-kartta');
    // Lippu näytetään vasta kun se on oikeasti latautunut — ilman verkkoa
    // riviltä ei jää rikkinäistä kuvaruutua.
    this.arrivalMaaLippu = document.getElementById('arrival-maa-lippu');
    this.arrivalMaaLippu.addEventListener('load', () => {
      this.arrivalMaaLippu.hidden = false;
    });
    this.arrivalMaaLippu.addEventListener('error', () => {
      this.arrivalMaaLippu.hidden = true;
    });
    this.arrivalMaaWiki = document.getElementById('arrival-maa-wiki');
    this.arrivalMaaWiki.addEventListener('click', () => {
      const maa = this.arrivalMaaTiedot;
      if (maa) this.openWikiArticle(maa.wiki ?? maa.nimi, maa.nimi);
    });
    // Kaupungin elämää -lohko täytetään openArrivalissa.
    this.arrivalKulttuuri = document.getElementById('arrival-kulttuuri');
    this.arrivalKulttuuriLista = document.getElementById('arrival-kulttuuri-lista');
    this.arrivalKulttuuriVisa = document.getElementById('arrival-kulttuuri-visa');
    this.arrivalKulttuuriKysymys = document.getElementById('arrival-kulttuuri-kysymys');
    this.arrivalKulttuuriVaihtoehdot = document.getElementById('arrival-kulttuuri-vaihtoehdot');
    this.arrivalKulttuuriTulos = document.getElementById('arrival-kulttuuri-tulos');
    document.getElementById('arrival-yes').addEventListener('click', () => {
      this.closeArrival();
      sfx.play('paper');
      this.doAction(() => this.game.actionQuiz());
    });
    document.getElementById('arrival-no').addEventListener('click', () => {
      this.closeArrival();
      // Kortti avataan nykyään Tutki-napista kesken vuoron, jolloin
      // sulkeminen on pelkkä paluu kartalle — päiväkirja pysyy ennallaan.
      // Vanha tallennus voi silti herätä tarjousvaiheeseen, jossa
      // sulkeminen päättää vuoron.
      if (this.game.phase === 'offer') this.doAction(() => this.game.actionSkipQuiz());
    });

    this.quizSketch = document.getElementById('quiz-sketch');
    this.quizSelite = document.getElementById('quiz-selite');
    this.quizPhoto = document.getElementById('quiz-photo');
    this.quizPhoto.addEventListener('click', () => {
      const quiz = this.game.quiz;
      if (quiz?.photoWiki) this.openLightbox(quiz.photoWiki, 'Matkavalokuvaajan vedos');
    });
    this.quizBadge = document.getElementById('quiz-badge');

    this.wikiDialog = document.getElementById('wiki-dialog');
    this.wikiTitle = document.getElementById('wiki-title');
    this.wikiImage = document.getElementById('wiki-image');
    this.wikiExtract = document.getElementById('wiki-extract');
    this.wikiSource = document.getElementById('wiki-source');
    this.wikiImage.addEventListener('click', () => {
      if (this.wikiOpenFor) this.openLightbox(this.wikiOpenFor, this.wikiTitle.textContent);
    });
    this.factImage = document.getElementById('fact-image');
    this.factImage.addEventListener('click', () => {
      if (this.factImageTitle) this.openWikiArticle(this.factImageTitle);
    });
    // Kaiutin jatkaa merkinnän luentaa siitä, mihin se pysähtyi
    // ensimmäisen virkkeen jälkeen — ja toimii myös taukonappina.
    // Vanha valokuva muistikirjan kyljessä: pikkukuva aukeaa napautuksesta
    // postikortiksi kortin viereen. Latausvirhe (esim. ei verkkoa)
    // piilottaa pikkukuvan siististi.
    this.factValokuva = document.getElementById('fact-valokuva');
    this.factValokuvaKuva = document.getElementById('fact-valokuva-kuva');
    this.factValokuvaKuva.addEventListener('error', () => {
      this.factValokuva.hidden = true;
    });
    this.factValokuva.addEventListener('click', (event) => {
      event.stopPropagation();
      this.naytaPostikortti();
    });
    this.postikorttiSulkija = () => this.suljePostikortti();

    this.factKuuntele = document.getElementById('fact-kuuntele');
    this.factKuuntele.addEventListener('click', () => {
      const audio = this.diaryVoice;
      if (audio) {
        if (audio.paused) {
          audio.jatkettu = true; // automaattinen pysäytys ei enää koske
          audio.play().catch(() => {});
        } else {
          audio.pause();
        }
        return;
      }
      // Ääni ehti sulkeutua (esim. korttien vaihto) — aloitetaan alusta.
      if (this.diaryFullUrl) this.playDiaryVoice(this.diaryFullUrl);
    });

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

    // Lappu sulkeutuu myös taustaa — siis karttaa — napauttamalla, ettei
    // sulkunappia tarvitse etsiä; tietovisassa sellaista ei edes ole.
    // Napautus vastaa lapun kevyintä poistumistietä (sulje / Jatka matkaa).
    this.lappuTausta = (event) => {
      if (event.target === event.currentTarget) this.suljeLappu(event.currentTarget);
    };
    // Esc kulkee samaa polkua: selaimen oletus sulkisi lapun päivittämättä
    // pelitilaa, ja peli jäisi jumiin kysymys- tai tapahtumavaiheeseen.
    this.lappuPeruutus = (event) => {
      event.preventDefault();
      this.suljeLappu(event.currentTarget);
    };
    this.taustaLaput = [
      this.arrivalDialog, this.wikiDialog, this.eventDialog, this.passportDialog,
      this.quizDialog, this.winnerDialog, document.getElementById('rules-dialog'),
    ];
    for (const lappu of this.taustaLaput) lappu.addEventListener('click', this.lappuTausta);
    this.peruutusLaput = [this.quizDialog, this.eventDialog, this.arrivalDialog];
    for (const lappu of this.peruutusLaput) lappu.addEventListener('cancel', this.lappuPeruutus);

    this.mapPane = this.svg.parentElement;
    this.busy = false;
    this.dead = false; // destroy() jälkeen instanssi ei saa enää piirtää
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
    // Kuollut instanssi ei saa enää koskea jaettuun DOM:iin: sen
    // tapahtumakuuntelijat ja kesken olevat animaatioketjut jäävät elämään
    // uuden pelin rinnalle, ja ilman lippua ne piirtäisivät vanhan pelin
    // tilaa uuden päälle (esim. edellisen pelin kysymyksen tekstin).
    this.dead = true;
    stopPlaceStream();
    stopQuizMusic();
    sfx.stopFlight();
    this.stopIntroVoice();
    this.stopDiaryVoice();
    this.suljePostikortti();
    // Kesken jäänyt lentokalvo siivotaan, ettei se jää uuden pelin päälle.
    document.body.classList.remove('flight-active');
    for (const kalvo of document.querySelectorAll('.flight-overlay')) kalvo.remove();
    this.suljeAloitusportti();
    clearTimeout(this.botTimer);
    clearTimeout(this.autoRollTimer);
    clearTimeout(this.lentoPuheAjastin);
    if (this.previewFrame) cancelAnimationFrame(this.previewFrame);
    for (const timer of Object.values(this.typeTimers ?? {})) clearTimeout(timer);
    this.stopQuizTimer();
    for (const lappu of this.taustaLaput ?? []) lappu.removeEventListener('click', this.lappuTausta);
    for (const lappu of this.peruutusLaput ?? []) lappu.removeEventListener('cancel', this.lappuPeruutus);
    this.observer?.disconnect();
  }

  /**
   * Lapun kevyin poistumistie taustanapautukselle ja Esc:lle: takaisin
   * karttanäkymään. Tietovisassa sulkeminen on kysymyksestä luopumista —
   * pulma palaa taskuun, muu kysymys päättää vuoron vastaamatta.
   * Rosvon kaksintaistelusta ei karata taustaa napauttamalla.
   */
  suljeLappu(lappu) {
    const { game } = this;
    if (lappu === this.quizDialog) {
      if (this.busy) return;
      if (game.phase === 'duel') {
        const duel = game.duel;
        if (duel && duel.chosen !== null && this.revealShownFor === duel) {
          sfx.play('paper');
          this.doAction(() => game.closeDuel());
        }
        return;
      }
      if (game.phase !== 'quiz' || !game.quiz) return;
      // Tuomion paljastus on kesken — tulos ei saa jäädä näkemättä.
      if (game.quiz.chosen !== null && this.revealShownFor !== game.quiz) return;
      sfx.play('paper');
      this.doAction(() => game.closeQuiz());
      return;
    }
    // Saapumis- ja tapahtumalaput vievät pelitilaa eteenpäin, joten
    // taustanapautus painaa niiden omaa jatkonappia.
    if (lappu === this.eventDialog) {
      document.getElementById('event-ok').click();
      return;
    }
    if (lappu === this.arrivalDialog) {
      document.getElementById('arrival-no').click();
      return;
    }
    sfx.play('paper');
    lappu.close();
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
    // Katselutila (?lauta=) näyttää laudan kuin pelissä: ei porttia eikä
    // avaustekstiä, vaikka vaihe on pickstart.
    const alkuun = this.game.phase === 'pickstart' && !this.katselu;
    // Leveällä ikkunalla (Mac) lauta täyttäisi koko korkeuden ja alareunan
    // kelluvat kortit ruuhkautuisivat kartan eteläosan päälle: kun korkeus
    // on rajoittava mitta, laudalta varataan alakaista korteille. Kapealla
    // ruudulla leveys rajoittaa, kaista jää nollaan eikä asettelu muutu.
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const kaista = !alkuun && w / box.w > h / box.h ? Math.min(h * 0.2, rem * 7) : 0;
    const scale = Math.min(w / box.w, (h - kaista) / box.h);
    const vw = w / scale;
    const vh = h / scale;
    this.viewBoxSize = { vw, vh };
    // Aloitusnäkymässä lauta on ennen Aloita seikkailu -nappia keskellä
    // ruutua (pystyruudulla alaosa ammotti muuten tyhjänä), ja nousee
    // portin auettua ylös, jolloin alle jäävä kaista annetaan kokonaan
    // avaustekstille suurella fontilla. Pelissä sisältö keskitetään
    // kaistan yläpuoliseen osaan.
    let vy;
    if (alkuun && !this.aloitettu) {
      const laudanKorkeus = box.h / (1 + INTRO_SPACE);
      vy = box.y + laudanKorkeus / 2 - vh / 2;
    } else if (alkuun) {
      vy = box.y - box.h * INTRO_TOP;
    } else {
      vy = box.y + box.h / 2 - (h - kaista) / (2 * scale);
    }
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
    // Askelia riittävästi koko haarukkaan; INTRO_FONT_MIN on lattia.
    for (let i = 0; i < 8 && this.introText.scrollHeight > kaista; i++) {
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
    // Nykyisen maan korostus (hento sävy + nimi kaunolla) piirretään tähän
    // kerrokseen pelin edetessä (drawCountryBorders). Sävy rajataan
    // tyylitellyn rantaviivan sisään, ettei se valu mereen — maiden
    // todelliset rannikot poikkeavat piirretystä.
    if (pack.map.countryShapes) {
      const clip = el('clipPath', { id: 'maa-rajaus' }, root);
      for (const outline of pack.map.outlines) {
        const d = `M${outline.map(([x, y]) => `${x},${y}`).join(' L')}Z`;
        el('path', { d }, clip);
      }
    }
    this.countryLayer = el('g', { class: 'country-borders', 'clip-path': 'url(#maa-rajaus)' }, root);
    // Nimi piirretään leikkaamattomaan kerrokseen: maan todellinen
    // keskipiste voi osua tyylitellyn rannikon ulkopuolelle, eikä
    // kaunokirjoituksen saa katketa siihen.
    this.countryNameLayer = el('g', { class: 'country-names' }, root);
    this.countryKey = null;
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
    // Lentoanimaatio piirtyy kaiken päälle: kone ja sen perässä kulkeva viiva.
    this.flightLayer = el('g', { class: 'flight' }, root);
    drawPaperOverlay(svg);
  }

  /**
   * Korostaa maan, jossa pelaaja on: alue sävytetään aavistuksen
   * tummemmaksi ja maan nimi kirjoitetaan hennosti kaunokirjoituksella
   * keskelle. Reitillä (kaupunkien välissä) edellinen korostus jää
   * näkyviin, kunnes seuraava kaupunki vaihtaa maata — kartta ei vilku.
   */
  drawCountryBorders() {
    if (!this.countryLayer) return;
    const map = this.game.pack.map;
    const city = this.game.cityOf();
    const iso = city ? map.cityCountry?.[city.id] : null;
    if (!iso) return;
    const key = `${this.game.pack.id}:${iso}`;
    if (this.countryKey === key) return;
    this.countryKey = key;
    this.countryLayer.textContent = '';
    this.countryNameLayer.textContent = '';
    const maa = map.countryShapes?.[iso];
    if (!maa) return;
    const d = maa.renkaat
      .map((r) => `M${r.map(([x, y]) => `${x},${y}`).join(' L')}Z`)
      .join(' ');
    el('path', { d, class: 'country-tint' }, this.countryLayer);
    // Nimi sovitetaan maan leveyteen, ettei se pursua pienistä maista.
    const koko = Math.max(15, Math.min(34, (maa.leveys * 0.9) / Math.max(4, maa.nimi.length)));
    const nimi = el('text', {
      x: maa.keskus[0],
      y: maa.keskus[1],
      class: 'country-name',
      'text-anchor': 'middle',
      'font-size': koko.toFixed(0),
    }, this.countryNameLayer);
    nimi.textContent = maa.nimi;
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
      this.turnPill.appendChild(html('span', '', `${game.winner.name} voitti`));
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
    // Matkustustavan ensimmäinen vaihe latoo nappinsa aina yhteen riviin;
    // muut näkymät (vaihe B, kysymykset) käyttävät tavallista ruudukkoa.
    delete this.actionsEl.dataset.rivi;
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
      const rollBtn = this.ikoniTekstiNappi('noppa', 'Heitä noppa', 'primary');
      rollBtn.addEventListener('click', () => this.doRoll());
      this.actionsEl.appendChild(rollBtn);

      const backBtn = this.ikoniTekstiNappi('nuoli', 'Vaihda matkustustapa');
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

    // Jos välivaiheeseen ei jää yhtään valintaa (esim. rahat eivät riitä
    // lentoon eikä satamaa ole), palataan suoraan perusvalintoihin —
    // pelkkä Takaisin-nappi ei ole näkymä.
    if (this.travelExpanded && !hasSlow) this.travelExpanded = false;

    if (!this.travelExpanded) {
      this.turnStatus.textContent = 'Valitse matkustustapa.';
      // Kaikki vaiheen A napit mahtuvat aina yhteen riviin.
      this.actionsEl.dataset.rivi = 'yksi';

      if (modes.includes('land')) {
        const landBtn = this.iconButton('saapas', 'Jalan', modes.includes('stay') ? '' : 'primary');
        landBtn.addEventListener('click', () => this.doWalk());
        this.actionsEl.appendChild(landBtn);
      }

      if (hasSlow) {
        const moreBtn = this.iconButton('purje', 'Laiva & lento');
        moreBtn.addEventListener('click', () => {
          this.travelExpanded = true;
          this.render();
        });
        this.actionsEl.appendChild(moreBtn);
      }

      if (modes.includes('stay')) {
        const stayBtn = this.iconButton('suurennuslasi', 'Tutki', 'primary');
        stayBtn.addEventListener('click', () => {
          sfx.play('paper');
          // Tutki avaa ensin saapumiskortin (esittely, kuva ja Lue lisää) —
          // peliin siirrytään vasta kortin omasta Tutki paikka -napista.
          this.openArrival(game.cityOf());
        });
        this.actionsEl.appendChild(stayBtn);
      }
      return;
    }

    // Vaihe B.
    this.turnStatus.textContent = 'Laivalla, lentäen vai portin kautta?';

    if (modes.includes('sea')) {
      const seaBtn = this.ikoniTekstiNappi('purje', `Laivalla (${SEA_FARE} p)`, 'wide');
      seaBtn.addEventListener('click', () => {
        this.travelExpanded = false;
        sfx.play('ferry');
        this.doAction(() => game.actionTravel('sea'));
      });
      this.actionsEl.appendChild(seaBtn);
    }

    for (const dest of flights) {
      const city = game.board.cityById.get(dest);
      const flyBtn = this.ikoniTekstiNappi('kone', `${city.name} (${FLIGHT_PRICE} p)`, 'wide');
      flyBtn.addEventListener('click', () => this.doFly(dest));
      this.actionsEl.appendChild(flyBtn);
    }

    // Vaelluksessa porttikaupungeista jatketaan toisille laudoille.
    for (const link of gateways) {
      const gwBtn = this.ikoniTekstiNappi('kompassi', link.label, 'wide');
      gwBtn.addEventListener('click', async () => {
        this.travelExpanded = false;
        sfx.play('flight');
        // Lentokalvo kuuluu vain maailmankartalle — mantereella lento
        // tapahtuu suoraan karttanäkymässä. Siirto tehdään ennen kalvoa,
        // jotta perillä odottava päiväkirjamerkintä alkaa puheineen jo
        // lennon aikana.
        const lahto = game.cityOf()?.name ?? '';
        const kalvo = game.pack.id === 'maailma';
        const line = kalvo ? game.flightLine(link.city, packById(link.pack)) : null;
        // Lippu ennen siirtoa: kohteen äänimaisema ja päiväkirja odottavat
        // kalvon alla, kunnes pelaaja astuu ulos.
        if (kalvo && !this.reducedMotion) document.body.classList.add('flight-active');
        this.doAction(() => game.actionGateway(link.index));
        if (kalvo) await this.animateFlight(lahto, link.label, line);
      });
      this.actionsEl.appendChild(gwBtn);
    }

    // Tietoportti: maan lauta aukeaa pääkaupungista vaikealla kysymyksellä.
    for (const gate of countryGates) {
      const gateBtn = this.ikoniTekstiNappi('tahti', `${gate.label} — vaikea kysymys`, 'wide');
      gateBtn.addEventListener('click', () => {
        this.travelExpanded = false;
        sfx.play('paper');
        this.doAction(() => game.actionGateQuiz(gate.index));
      });
      this.actionsEl.appendChild(gateBtn);
    }

    const backBtn = this.iconButton('nuoli', 'Takaisin');
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
    btn.appendChild(viivaIkoni(icon) ?? html('span', 'icon-glyph', icon));
    btn.appendChild(html('span', 'icon-label', label));
    return btn;
  }

  /** Tekstinappi, jonka edessä on kartan kynällä piirretty viivaikoni. */
  ikoniTekstiNappi(ikoni, teksti, luokka = '') {
    const btn = html('button', `ikoni-teksti${luokka ? ` ${luokka}` : ''}`);
    btn.type = 'button';
    const kuva = viivaIkoni(ikoni);
    if (kuva) btn.appendChild(kuva);
    btn.appendChild(html('span', '', teksti));
    return btn;
  }

  /** Vaihtaa olemassa olevan napin sisällöksi viivaikonin ja tekstin. */
  ikonoi(btn, ikoni, teksti) {
    btn.classList.add('ikoni-teksti');
    btn.textContent = '';
    const kuva = viivaIkoni(ikoni);
    if (kuva) btn.appendChild(kuva);
    btn.appendChild(html('span', '', teksti));
  }

  /**
   * Lähtöpisteen valinta: napautus vie suoraan perille. Porttikaupungista
   * laskeudutaan mantereen omalle laudalle, muualta jäädään maailmankartalle.
   * Useamman portin kaupungeista (Kairo, Mumbai) otetaan ensimmäinen eli
   * kaupungin oma manner — välikysymystä ei enää esitetä.
   */
  async doPickStart(city) {
    const { game } = this;
    const portti = (city.links ?? []).length > 0;
    sfx.play(portti ? 'flight' : 'paper');
    // Pelin avaus on se filmihetki: avausteksti häipyy ja lento piirtyy
    // kalvona kartan päälle ennen kuin mantereen kartta aukeaa.
    const lontoo = game.board.cityById.get('lontoo');
    if (lontoo && lontoo.id !== city.id) {
      // Lukuääni väistyy, kun matka alkaa.
      this.stopIntroVoice();
      this.introEl.classList.add('intro-fade');
      // Repliikki ennen siirtoa, jotta rng-kutsut osuvat samaan kohtaan.
      const line = game.firstFlightLine(city.id);
      // Lippu ennen siirtoa, jotta saapumismerkintä ei ala kalvon alla —
      // se odottaa Astu ulos -nappia. animateFlight poistaa lipun.
      if (!this.reducedMotion) document.body.classList.add('flight-active');
      this.doAction(() => game.actionPickStart(city.id, portti ? 0 : null));
      if (!this.reducedMotion) {
        // Avauslennon repliikki on lukittu ja luettu ääneen: puhe alkaa
        // pienellä viiveellä, kun moottori on jo ehtinyt nousta esiin.
        this.lentoPuheAjastin = setTimeout(() => {
          if (!this.dead) this.playDiaryVoice('assets/audio/puhe-lento-alku.mp3');
        }, 1400);
      }
      await this.animateFlight(
        'Lontoo', city.name, line,
        { dx: city.x - lontoo.x, dy: city.y - lontoo.y },
      );
      clearTimeout(this.lentoPuheAjastin);
      return;
    }
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
   * Maan minikartta saapumiskorttiin pelin omasta rajadatasta: maan
   * muoto, pelin kaupungit pisteinä ja nykyinen kaupunki korostettuna.
   * Sama kynä kuin laudalla — ja toimii ilman verkkoa, toisin kuin
   * Wikipediasta haettu kartta.
   */
  piirraMaakartta(iso, nykyinenId) {
    const map = this.game.pack.map;
    const maa = map?.countryShapes?.[iso];
    if (!maa?.renkaat?.length) return null;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const rengas of maa.renkaat) {
      for (const [x, y] of rengas) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
    const mitta = Math.max(maxX - minX, maxY - minY);
    // Nimilaput tarvitsevat reunoille hieman ilmaa muodon ympärille.
    const vara = mitta * 0.16;
    const svg = el('svg', {
      class: 'arrival-maa-kartta-svg',
      viewBox: `${minX - vara} ${minY - vara} ${maxX - minX + vara * 2} ${maxY - minY + vara * 2}`,
      'aria-hidden': 'true',
    });
    const d = maa.renkaat
      .map((r) => `M${r.map(([x, y]) => `${x},${y}`).join(' L')}Z`)
      .join(' ');
    el('path', { d, class: 'minimaa-pohja' }, svg);
    for (const [cityId, maanIso] of Object.entries(map.cityCountry ?? {})) {
      if (maanIso !== iso) continue;
      const kaupunki = this.game.board.cityById.get(cityId);
      if (!kaupunki) continue;
      const oma = cityId === nykyinenId;
      el('circle', {
        cx: kaupunki.x,
        cy: kaupunki.y,
        r: ((oma ? 0.024 : 0.016) * mitta).toFixed(2),
        class: oma ? 'minimaa-piste nykyinen' : 'minimaa-piste',
      }, svg);
      const nimi = el('text', {
        x: kaupunki.x,
        y: kaupunki.y - 0.04 * mitta,
        class: 'minimaa-nimi',
        'text-anchor': 'middle',
        'font-size': (0.07 * mitta).toFixed(1),
      }, svg);
      nimi.textContent = kaupunki.name;
    }
    return svg;
  }

  /**
   * Vanhan valokuvan pikkukuva muistikirjan kylkeen, jos kaupungille on
   * kuva kuvastossa. Null piilottaa kuvan ja sulkee auki jääneen kortin.
   */
  naytaFactValokuva(cityId, paikka) {
    const valokuva = cityId ? (VALOKUVAT[this.game.pack.id] ?? {})[cityId] ?? null : null;
    this.factValokuvaTiedot = valokuva ? { ...valokuva, paikka } : null;
    if (!valokuva) {
      this.factValokuva.hidden = true;
      this.suljePostikortti();
      return;
    }
    const osoite = valokuvaUrl(valokuva.tiedosto, 160);
    if (this.factValokuvaKuva.getAttribute('src') !== osoite) {
      this.factValokuvaKuva.src = osoite;
    }
    this.factValokuva.hidden = false;
  }

  /**
   * Valokuva aukeaa postikorttina hieman vinottain muistikirjan viereen:
   * valkoiset reunukset, kuvateksti ja lähde. Napautus mihin tahansa
   * sulkee kortin.
   */
  naytaPostikortti() {
    this.suljePostikortti();
    const tiedot = this.factValokuvaTiedot;
    if (!tiedot) return;
    const kortti = html('div', 'postikortti');
    const kuva = document.createElement('img');
    kuva.src = valokuvaUrl(tiedot.tiedosto, 1000);
    kuva.alt = `Vanha valokuva: ${tiedot.paikka}`;
    kortti.appendChild(kuva);
    const teksti = html('p', 'kuvateksti',
      [tiedot.paikka, tiedot.vuosi, tiedot.lahde].filter(Boolean).join(' · '));
    kortti.appendChild(teksti);
    // Kortti muistikirjan viereen: yläpuolelle kun muistikirja on ruudun
    // alaosassa, muuten alle. Vaakasuunnassa pysytään ruudussa.
    const rect = this.factCard.getBoundingClientRect();
    const leveys = Math.min(window.innerWidth * 0.78, 400);
    kortti.style.left = `${Math.max(8, Math.min(window.innerWidth - leveys - 8, rect.left))}px`;
    if (rect.top > window.innerHeight / 2) {
      kortti.style.bottom = `${window.innerHeight - rect.top + 10}px`;
    } else {
      kortti.style.top = `${rect.bottom + 10}px`;
    }
    document.body.appendChild(kortti);
    this.postikortti = kortti;
    // Sieppausvaiheessa, jotta kartan omat käsittelijät eivät estä
    // sulkemista — napautus mihin tahansa sulkee kortin.
    setTimeout(() => {
      document.addEventListener('pointerdown', this.postikorttiSulkija, { once: true, capture: true });
    }, 0);
  }

  suljePostikortti() {
    document.removeEventListener('pointerdown', this.postikorttiSulkija, true);
    this.postikortti?.remove();
    this.postikortti = null;
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
      this.factVoiceEl.textContent = '';
      this.factPlace.textContent = '';
      this.factText.textContent = '';
      this.factImage.hidden = true;
      this.factKuuntele.hidden = true;
      this.naytaFactValokuva(null);
      this.stopDiaryVoice();
      return;
    }

    // Matkalla kortti ei päivity: sama merkintä pysyy näytöllä, kunnes
    // saavutaan uuteen kaupunkiin — uusi nopanheitto reitillä ei vaihda
    // tekstiä (omistajan päätös).
    if (game.player.pos.type === 'edge' && this.factKey) return;

    // Isoisän aikataulu nousee esiin, kun matkapäivä ohittaa merkinnän. Rivi
    // menee saapumismerkinnän edelle, koska se näkyy vain yhden vuoron ajan.
    const aikataulu = game.scheduleNote;
    if (aikataulu && aikataulu.packId === game.pack.id) {
      const key = `schedule:${aikataulu.packId}:${aikataulu.day}`;
      if (this.factKey === key) return;
      this.factKey = key;
      this.factVoiceEl.textContent = 'Isoisän aikataulusta';
      this.factPlace.textContent = `Päivä ${aikataulu.day}`;
      this.factImage.hidden = true;
      this.factKuuntele.hidden = true;
      this.naytaFactValokuva(null);
      this.stopDiaryVoice();
      this.typeText(this.factText, aikataulu.text);
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
      this.factImage.hidden = true;
      this.factKuuntele.hidden = true;
      this.naytaFactValokuva(null);
      this.stopDiaryVoice();
      this.typeText(this.factText, hint);
      return;
    }

    // Saapumishavainto: kortti kertoo aina siitä kaupungista, jossa
    // matkaaja on. Isoisän muistelu luetaan ääneen ensisijaisesti; ilman
    // sitä käytetään kaupungin ensimmäistä havaintoa. Sama teksti pysyy
    // koko käynnin ajan, ja luenta kuuluu vain kerran per saapuminen.
    const saapuminen = game.arrivalFact;
    if (saapuminen && saapuminen.packId === game.pack.id
      && game.player.pos.type === 'city' && game.player.pos.city === saapuminen.cityId) {
      // Lennon aikana ruudussa on lentorepliikki — havainto ja luenta
      // alkavat vasta, kun pelaaja astuu ulos koneesta. Muuten lukija
      // lukisi eri tekstiä kuin ruudulla näkyy.
      if (document.body.classList.contains('flight-active')) return;
      const kaupunki = game.board.cityById.get(saapuminen.cityId);

      // Uusi malli (pilotti): nuoren herran fiiliskuvaus lihavoituna,
      // perässä isoisän nosto, ja lukija lukee koko merkinnän tunteella.
      // Teksti ei vaihdu kaupungissa olon aikana.
      const uusi = (SAAPUMISTEKSTIT[saapuminen.packId] ?? {})[saapuminen.cityId];
      if (uusi && kaupunki) {
        const key = `saapui:${saapuminen.packId}:${saapuminen.cityId}`;
        if (this.factKey === key) return;
        this.factKey = key;
        this.factVoiceEl.textContent = 'Matkakirjasta';
        this.factPlace.textContent = kaupunki.name;
        this.factImageTitle = null;
        this.factImage.hidden = true;
        this.naytaFactValokuva(saapuminen.cityId, kaupunki.name);
        this.factText.textContent = '';
        const lihava = html('b', 'fact-lead');
        const jatko = html('span');
        this.factText.appendChild(lihava);
        this.factText.appendChild(document.createTextNode(' '));
        this.factText.appendChild(jatko);
        this.typeText(lihava, uusi.kuvaus, 'fact', () => {
          this.typeText(jatko, uusi.nosto, 'fact');
        });
        this.diaryFullUrl = `assets/audio/puhe-${saapuminen.packId}-saapuminen-${saapuminen.cityId}.mp3`;
        this.factKuuntele.hidden = false;
        if (this.luettuSaapuminen !== key) {
          this.luettuSaapuminen = key;
          // Koko merkintä luetaan — ei pysähdystä ensimmäiseen virkkeeseen.
          this.playDiaryVoice(this.diaryFullUrl);
        } else {
          this.stopDiaryVoice();
        }
        return;
      }

      const faktat = game.pack.placeFacts?.[saapuminen.cityId] ?? [];
      const isoisanIdx = faktat.findIndex((f) => factVoice(f) === 'isoisa');
      const fakta = faktat[isoisanIdx >= 0 ? isoisanIdx : 0];
      if (fakta && kaupunki) {
        const key = `saapui:${saapuminen.packId}:${saapuminen.cityId}`;
        if (this.factKey === key) return;
        this.factKey = key;
        this.factVoiceEl.textContent = voiceTitle(factVoice(fakta));
        this.factPlace.textContent = kaupunki.name;
        this.factImageTitle = typeof fakta === 'string' ? null : fakta.wiki ?? null;
        this.factImage.hidden = !this.factImageTitle;
        // Vanha valokuva kaupungista pikkukuvana tekstin kylkeen.
        this.naytaFactValokuva(saapuminen.cityId, kaupunki.name);
        // Ensimmäinen lause lihavoituna, loput perään samalla koneella.
        const teksti = factText(fakta);
        const { eka, loput } = ekaLause(teksti);
        this.factText.textContent = '';
        const lihava = html('b', 'fact-lead');
        const jatko = html('span');
        this.factText.appendChild(lihava);
        this.factText.appendChild(document.createTextNode(' '));
        this.factText.appendChild(jatko);
        this.typeText(lihava, eka, 'fact', () => {
          if (loput) this.typeText(jatko, loput, 'fact');
        });
        // Luenta pysähtyy ensimmäisen virkkeen jälkeiseen hengähdykseen —
        // kaiutin jatkaa samasta kohdasta. Vihjeen tai aikataulun väläys
        // ei käynnistä luentaa uudelleen samassa kaupungissa.
        const luettava = HAVAINTOLUENNAT.has(`${saapuminen.packId}:${saapuminen.cityId}`);
        this.diaryFullUrl = luettava
          ? `assets/audio/puhe-${saapuminen.packId}-havainto-${saapuminen.cityId}.mp3`
          : null;
        this.factKuuntele.hidden = !luettava;
        if (luettava && this.luettuSaapuminen !== key) {
          this.luettuSaapuminen = key;
          this.playDiaryVoice(this.diaryFullUrl, {
            ekaLauseeseen: true,
            // Ensimmäisen virkkeen osuus tekstistä ohjaa tauon valintaa.
            osuus: teksti.length ? eka.length / teksti.length : null,
          });
        } else {
          this.stopDiaryVoice();
        }
        return;
      }
    }

    const player = game.player;
    const city = this.factCity(player.pos);
    const facts = game.pack.placeFacts[city.id];
    if (!facts || facts.length === 0) return;

    const pick = Math.floor(hash01(`fact:${city.id}:${game.turnCount}:${player.id}`) * facts.length);
    const fact = facts[Math.min(pick, facts.length - 1)];
    const text = factText(fact);
    const key = `${city.id}:${text}`;
    if (key === this.factKey) return;
    this.factKey = key;
    this.factKuuntele.hidden = true;
    this.naytaFactValokuva(player.pos.type === 'city' ? city.id : null, city.name);
    this.stopDiaryVoice();

    // Otsikko kertoo kumpi ääni puhuu, alarivi paikan.
    const onRoute = player.pos.type === 'edge';
    this.factVoiceEl.textContent = voiceTitle(factVoice(fact));
    this.factPlace.textContent = onRoute ? `Matkalla — ${city.name}` : city.name;
    // Havaintoon voi liittyä kuva: pieni linkki avaa ilmiön Wikipedia-kuvan.
    this.factImageTitle = typeof fact === 'string' ? null : fact.wiki ?? null;
    this.factImage.hidden = !this.factImageTitle;
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

  /**
   * Äänimaisema seuraa matkaajaa: paikan oikea äänite jos sellainen on
   * merkitty, muuten kaupungin syntetisoitu ambienssi, tai meri kun ollaan
   * reitillä merellä. Ilman ambience-kenttää ei soiteta mitään, joten muut
   * laudat pysyvät hiljaisina kunnes ne saavat omansa.
   */
  syncAmbience() {
    const { game } = this;
    // Lennon aikana kuuluu vain moottori: kaupungin äänimaisema alkaa
    // vasta, kun pelaaja astuu ulos koneesta (kalvon sulkeva render).
    if (document.body.classList.contains('flight-active')) {
      playPlaceAmbience(null, null);
      return;
    }
    if (game.phase === 'over') {
      playPlaceAmbience(null, null);
      return;
    }
    // Etusivullakin on äänimaisema: satama ja meri odottavat lähtijää.
    // 'etusivu' ja 'merimatka' ovat virtuaalipaikkoja, joille voi valita
    // äänen studiosta kuten kaupungeille. Lauta kertoo maanosan, jonka
    // korista ääni arvotaan.
    const lauta = game.pack?.id;
    if (game.phase === 'pickstart') {
      playPlaceAmbience('etusivu', 'meri', lauta);
      return;
    }
    const pos = game.player.pos;
    if (pos.type === 'edge') {
      const edge = game.board.edgeById.get(pos.edge);
      if (edge?.type === 'sea') playPlaceAmbience('merimatka', 'meri', lauta);
      else playPlaceAmbience(null, null);
      return;
    }
    const city = game.board.cityById.get(pos.city);
    playPlaceAmbience(city?.id ?? null, city?.ambience ?? null, lauta);
  }

  /**
   * Lataa laudan kaupunkien kuvia taustalla valokuvakysymyksiä varten ja
   * kertoo moottorille, mitkä ovat valmiina. Lista ei ole pelitilaa:
   * ilman verkkoa se jää tyhjäksi ja valokuvamuoto putoaa pois käytöstä.
   * Haut porrastetaan, ettei Wikipediaa kuormiteta ryöpyllä.
   */
  primePhotoPool() {
    const pack = this.game.pack;
    this.photoPools ??= new Map();
    if (!this.photoPools.has(pack.id)) {
      const valmiit = new Set();
      this.photoPools.set(pack.id, valmiit);
      const kaupungit = pack.cities.filter((c) => c.wiki);
      // Sekoitus tavallisella satunnaisluvulla — kuvien latausjärjestys
      // ei ole pelitilaa eikä saa kuluttaa pelin siemenlukua.
      const arvottu = [...kaupungit].sort(() => Math.random() - 0.5).slice(0, 12);
      arvottu.forEach((c, i) => {
        setTimeout(() => {
          if (this.dead) return;
          cachedImage(c.wiki).then((url) => {
            if (this.dead || !url) return;
            valmiit.add(c.id);
            if (this.game.pack.id === pack.id) this.game.setPhotoPool([...valmiit]);
          });
        }, 400 * i);
      });
    }
    this.game.setPhotoPool([...this.photoPools.get(pack.id)]);
  }

  render() {
    this.syncAmbience();
    if (this.dead) return;
    this.primePhotoPool();
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
    this.drawCountryBorders();
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
        icon: 'passi',
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
        icon: 'mitali',
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

    // Kortissa on kuva, parin lauseen esittely ja päätös. Esittely tulee
    // Wikipedian tiivistelmästä; kunnes haku valmistuu — tai jos paikalla
    // ei ole artikkelia — kortissa lukee isoisän vakiorivi.
    this.arrivalCity.textContent = city.name;
    this.arrivalImage.hidden = true;
    this.arrivalImage.removeAttribute('src');
    this.arrivalIntro.textContent = 'Isoisä on merkinnyt tämän paikan karttaansa.';
    this.arrivalWiki.hidden = true;

    // Maan tiedot kaupungin rinnalla (omistajan toive): nimi näkyy heti,
    // parin lauseen esittely täyttyy kun haku ehtii. Laudoilla, joilla
    // kaupunki→maa-kytkentää ei ole, lohko pysyy piilossa.
    const iso = this.game.pack.map?.cityCountry?.[city.id];
    const maa = iso ? this.game.pack.map?.countryShapes?.[iso] : null;
    this.arrivalMaaTiedot = maa ?? null;
    this.arrivalMaa.hidden = !maa;
    this.arrivalMaaWiki.hidden = true;
    if (maa) {
      this.arrivalMaaNimi.textContent = maa.nimi;
      this.arrivalMaaIntro.textContent = '';
      // Lippu suht pienenä nimen vieressä; puuttuva verkko piilottaa sen.
      this.arrivalMaaLippu.hidden = true;
      if (maa.lippu) {
        this.arrivalMaaLippu.alt = `${maa.nimi} — lippu`;
        this.arrivalMaaLippu.src = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(maa.lippu)}?width=96`;
      } else {
        this.arrivalMaaLippu.removeAttribute('src');
      }
      // Minikartta pelin omasta rajadatasta — toimii myös ilman verkkoa.
      this.arrivalMaaKartta.textContent = '';
      const kartta = this.piirraMaakartta(iso, city.id);
      if (kartta) this.arrivalMaaKartta.appendChild(kartta);
      cachedSummary(maa.wiki ?? maa.nimi).then((summary) => {
        if (!this.arrivalDialog.open || this.arrivalShownFor !== city.id) return;
        if (!summary?.extract) return;
        this.arrivalMaaIntro.textContent = shortIntro(summary.extract);
        this.arrivalMaaWiki.hidden = false;
      });
    }

    // Kaupungin elämää: taide-, ruoka- ja musiikkinostot ja niihin
    // liittyvä tutustu ja vastaa -kysymys (pilottikaupungit).
    this.naytaKulttuuri(city);

    if (!this.arrivalDialog.open) this.arrivalDialog.showModal();
    if (!city.wiki) return;

    Promise.all([cachedSummary(city.wiki), cachedImage(city.wiki)]).then(([summary, image]) => {
      // Pelaaja on voinut ehtiä jatkaa matkaa haun aikana.
      if (!this.arrivalDialog.open || this.arrivalShownFor !== city.id) return;
      if (!summary) return;
      if (image) {
        this.arrivalImage.src = image;
        this.arrivalImage.alt = summary.title || city.name;
        this.arrivalImage.hidden = false;
      }
      if (summary.extract) this.arrivalIntro.textContent = shortIntro(summary.extract);
      this.arrivalWiki.hidden = false;
    });
  }

  /**
   * Kaupungin elämää -lohko: nostot (kuva, teksti tai linkki lähteineen)
   * ja niiden perässä tutustu ja vastaa -kysymys. Oikeasta vastauksesta
   * pieni palkkio kerran per kaupunki — väärästä ei rangaista, mutta
   * uutta yritystä ei saa.
   */
  naytaKulttuuri(city) {
    const tiedot = (KULTTUURIT[this.game.pack.id] ?? {})[city.id] ?? null;
    this.arrivalKulttuuri.hidden = !tiedot;
    this.arrivalKulttuuri.open = false;
    if (!tiedot) return;
    const lista = this.arrivalKulttuuriLista;
    lista.textContent = '';
    for (const nosto of tiedot.nostot ?? []) {
      const lohko = html('div', 'kulttuuri-nosto');
      lohko.appendChild(html('p', 'kulttuuri-otsikko', nosto.otsikko));
      if (nosto.tyyppi === 'kuva' && nosto.tiedosto) {
        const kuva = document.createElement('img');
        kuva.loading = 'lazy';
        kuva.alt = nosto.otsikko;
        kuva.src = valokuvaUrl(nosto.tiedosto, 640);
        // Ilman verkkoa nosto jää pelkäksi tekstiksi.
        kuva.addEventListener('error', () => kuva.remove());
        lohko.appendChild(kuva);
      }
      lohko.appendChild(html('p', 'arrival-intro', nosto.teksti));
      if (nosto.wiki) {
        const nappi = html('button', 'wiki-btn', 'Lue lisää aiheesta');
        nappi.type = 'button';
        nappi.addEventListener('click', () => this.openWikiArticle(nosto.wiki, nosto.otsikko));
        lohko.appendChild(nappi);
      }
      if (nosto.lahde) lohko.appendChild(html('p', 'kulttuuri-lahde', nosto.lahde));
      lista.appendChild(lohko);
    }

    const { kysymys } = tiedot;
    this.arrivalKulttuuriVisa.hidden = !kysymys;
    this.arrivalKulttuuriTulos.hidden = true;
    this.arrivalKulttuuriVaihtoehdot.textContent = '';
    if (!kysymys) return;
    const vastattu = this.game.kulttuuriVastatut?.has(`${this.game.pack.id}:${city.id}`);
    this.arrivalKulttuuriKysymys.textContent = vastattu
      ? 'Kulttuurikysymykseen on jo vastattu tässä kaupungissa.'
      : `Tutustuitko? ${kysymys.q}`;
    if (vastattu) return;
    kysymys.options.forEach((vaihtoehto, i) => {
      const nappi = html('button', '', vaihtoehto);
      nappi.type = 'button';
      nappi.addEventListener('click', () => {
        const oikein = i === kysymys.correct;
        const vastaus = this.game.actionKulttuuri(city.id, oikein, KULTTUURI_PALKKIO);
        if (!vastaus.ok) return;
        this.arrivalKulttuuriVaihtoehdot.textContent = '';
        this.arrivalKulttuuriKysymys.textContent = kysymys.q;
        this.arrivalKulttuuriTulos.hidden = false;
        this.arrivalKulttuuriTulos.textContent = (oikein
          ? `Oikein! +${KULTTUURI_PALKKIO} puntaa. `
          : `Oikea vastaus: ${kysymys.options[kysymys.correct]}. `) + (kysymys.fact ?? '');
        sfx.play(oikein ? 'correct' : 'wrong');
        this.render();
      });
      this.arrivalKulttuuriVaihtoehdot.appendChild(nappi);
    });
  }

  /**
   * Muotoilee koko artikkelin tekstin: MediaWiki extracts palauttaa
   * väliotsikot muodossa "== Otsikko ==", ja ne muutetaan omiksi
   * otsikkoriveiksi. Pelkkää tekstiä — HTML:ää ei upoteta.
   */
  renderArticle(container, text) {
    container.textContent = '';
    let para = [];
    const flush = () => {
      if (para.length) container.appendChild(html('p', 'wiki-p', para.join(' ')));
      para = [];
    };
    for (const line of text.split('\n')) {
      const t = line.trim();
      if (!t) {
        flush();
        continue;
      }
      const m = t.match(/^(={2,6})\s*(.+?)\s*={2,6}$/);
      if (m) {
        flush();
        container.appendChild(html('p', m[1].length <= 2 ? 'wiki-h2' : 'wiki-h3', m[2]));
      } else {
        para.push(t);
      }
    }
    flush();
  }

  /**
   * "Lue lisää": Wikipedian artikkeli paikasta. Dialogi avautuu heti,
   * tiivistelmä täyttyy kun haku valmistuu, ja koko artikkeli ladataan
   * perään samalta kieleltä. Jos haku epäonnistuu — ei yhteyttä, 404 tai
   * täsmennyssivu — dialogissa lukee kohteliaasti, ettei tietoja saatu,
   * eikä peli jää siitä jumiin.
   */
  async openWiki(cityId) {
    const city = this.game.board.cityById.get(cityId);
    if (!city?.wiki) return;
    await this.openWikiArticle(city.wiki, city.name);
  }

  /**
   * Sama dialogi mille tahansa artikkelille — esimerkiksi havainnossa
   * mainitulle ilmiölle (Katso kuva), jolla ei ole omaa kaupunkia.
   */
  async openWikiArticle(title, label = title) {
    this.wikiOpenFor = title;
    this.wikiTitle.textContent = label;
    this.wikiImage.hidden = true;
    this.wikiImage.removeAttribute('src');
    this.wikiExtract.textContent = 'Haetaan…';
    this.wikiSource.textContent = '';
    if (!this.wikiDialog.open) this.wikiDialog.showModal();

    const summary = await cachedSummary(title);
    // Pelaaja on voinut ehtiä sulkea dialogin tai avata toisen paikan.
    if (!this.wikiDialog.open || this.wikiOpenFor !== title) return;

    if (!summary) {
      this.wikiExtract.textContent = 'Tietoja ei saatu haettua. Matka jatkuu.';
      return;
    }

    this.wikiTitle.textContent = summary.title || label;
    cachedImage(title).then((image) => {
      if (!this.wikiDialog.open || this.wikiOpenFor !== title || !image) return;
      this.wikiImage.src = image;
      this.wikiImage.alt = summary.title || label;
      this.wikiImage.hidden = false;
    });
    this.wikiExtract.textContent = summary.extract;

    // Koko artikkeli ladataan tiivistelmän perään; tiivistelmä jää, jos
    // hakua ei saada tehtyä. Kysytään vain kerran per avaus.
    fetchArticle(summary.title, summary.lang).then((article) => {
      if (!this.wikiDialog.open || this.wikiOpenFor !== title || !article) return;
      if (article.length <= summary.extract.length) return;
      this.renderArticle(this.wikiExtract, article);
    });

    // CC BY-SA vaatii maininnan ja linkin — myös kaupallisessa käytössä.
    // Oma tiivistelmä ei ole Wikipediaa, joten sille kerrotaan oma lähde.
    if (summary.oma) {
      this.wikiSource.textContent = 'Matkakirjan oma tiivistelmä — fi-Wikipediassa ei vielä ole tästä artikkelia.';
      return;
    }
    this.wikiSource.textContent = 'Lähde: Wikipedia (CC BY-SA) — ';
    const link = html('a', '', 'lue artikkeli');
    link.href = summary.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    this.wikiSource.appendChild(link);
  }

  /**
   * Kuvakatselin: napautettu kuva aukeaa isona, ja jos artikkelissa on
   * useampia kelvollisia kuvia, niitä voi selata nuolista tai pyyhkäisemällä.
   * Katselin lisätään avoimen dialogin sisään, koska dialogi on selaimen
   * top layerissa — muualle lisätty kerros jäisi sen alle.
   */
  async openLightbox(title, alt = '') {
    if (!title) return;
    const parent = [this.wikiDialog, this.arrivalDialog].find((d) => d.open) ?? document.body;
    const overlay = html('div', 'lightbox');
    const img = html('img', 'lightbox-img');
    img.alt = alt;
    const lataus = html('div', 'lightbox-loading', 'Ladataan…');
    const kuvateksti = html('div', 'lightbox-caption');
    const prev = html('button', 'lightbox-nav prev', '‹');
    const next = html('button', 'lightbox-nav next', '›');
    const counter = html('div', 'lightbox-counter');
    const close = html('button', 'lightbox-close', '✕');
    prev.hidden = next.hidden = kuvateksti.hidden = true;
    img.hidden = true; // rikkinäisen kuvan kysymysmerkki ei saa vilahtaa
    overlay.append(img, lataus, kuvateksti, prev, next, counter, close);
    parent.appendChild(overlay);

    let kuvat = []; // { src, caption }
    let kohdalla = 0;
    img.addEventListener('load', () => {
      img.hidden = false;
      lataus.hidden = true;
    });
    const nayta = () => {
      if (!kuvat.length) return;
      const kohde = kuvat[kohdalla];
      img.hidden = true;
      lataus.hidden = false;
      lataus.textContent = 'Ladataan…';
      img.src = upsizeImage(kohde.src);
      kuvateksti.textContent = kohde.caption ?? '';
      kuvateksti.hidden = !kohde.caption;
      counter.textContent = kuvat.length > 1 ? `${kohdalla + 1} / ${kuvat.length}` : '';
      prev.hidden = next.hidden = kuvat.length < 2;
    };
    // Jos suurennosta ei ole olemassa (alkuperäinen on pienempi), palataan
    // kuvalistan omaan osoitteeseen; jos sekään ei lataudu, sanotaan se.
    img.addEventListener('error', () => {
      if (!kuvat.length) return;
      if (img.src !== kuvat[kohdalla].src) img.src = kuvat[kohdalla].src;
      else lataus.textContent = 'Kuvaa ei saatu ladattua.';
    });
    const siirry = (askel) => {
      if (kuvat.length < 2) return;
      kohdalla = (kohdalla + askel + kuvat.length) % kuvat.length;
      nayta();
      sfx.play('swipe');
    };
    prev.addEventListener('click', (e) => { e.stopPropagation(); siirry(-1); });
    next.addEventListener('click', (e) => { e.stopPropagation(); siirry(1); });
    close.addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
    // Pyyhkäisy vaihtaa kuvaa sormella.
    let alkuX = null;
    overlay.addEventListener('pointerdown', (e) => { alkuX = e.clientX; });
    overlay.addEventListener('pointerup', (e) => {
      if (alkuX === null) return;
      const siirtyma = e.clientX - alkuX;
      alkuX = null;
      if (Math.abs(siirtyma) > 40) siirry(siirtyma < 0 ? 1 : -1);
    });

    // Ensimmäinen kuva heti ruutuun, koko galleria kun lista on haettu.
    const eka = await cachedImage(title);
    if (!overlay.isConnected) return;
    if (eka) {
      kuvat = [{ src: eka, caption: null }];
      nayta();
    }
    const lista = await cachedGallery(title);
    if (!overlay.isConnected || !lista.length) return;
    const nykyinen = kuvat[0]?.src ?? null;
    kuvat = lista;
    kohdalla = Math.max(0, lista.findIndex((k) => k.src === nykyinen));
    nayta();
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
    // Katselutilassa (?lauta=) porttia ja avaustekstiä ei näytetä: kartta
    // on heti esillä täydessä koossaan.
    const nakyy = this.game.phase === 'pickstart' && !this.katselu;
    this.introEl.hidden = !nakyy;
    // Uusi peli tuo tekstin takaisin täyteen näkyvyyteen häivytyksestä.
    if (nakyy) this.introEl.classList.remove('intro-fade');
    if (!nakyy) {
      this.introShown = false;
      this.introText.textContent = '';
      this.stopIntroVoice();
      this.suljeAloitusportti();
      return;
    }
    if (this.introShown) return;
    // Seikkailu alkaa napista: selain sallii äänet vasta napautuksesta,
    // joten lukuääni, kirjoituskone ja ambienssi käynnistyvät kaikki
    // samasta Aloita seikkailu -painalluksesta. Tausta on himmeänä takana.
    if (!this.aloitettu) {
      this.showAloitusportti();
      return;
    }
    this.introShown = true;
    this.playIntroVoice();
    // Avausteksti kirjoittuu selvästi hitaammin kuin muut: se on matkan
    // ensimmäinen hetki eikä pelitilanteen ilmoitus.
    this.typeText(this.introText, INTRO_TEXT, 'intro', null, INTRO_TYPE_MS);
    // Koko teksti on jo paikallaan, joten koon voi sovittaa heti — sen
    // jälkeen mikään ei enää liiku kirjoituksen aikana.
    this.fitIntro();
  }

  /** Aloita seikkailu -portti: keskellä ruutua, kartta himmeänä takana. */
  showAloitusportti() {
    if (this.aloitusportti) return;
    const portti = html('div', 'start-gate');
    const nappi = html('button', 'start-btn primary', 'Aloita seikkailu');
    nappi.addEventListener('click', () => {
      this.aloitettu = true;
      this.suljeAloitusportti();
      // Lauta siirtyy keskeltä ylös tekstin tieltä heti portin auettua.
      this.fitViewBox();
      this.render();
    });
    portti.appendChild(nappi);
    this.mapPane.appendChild(portti);
    this.aloitusportti = portti;
  }

  suljeAloitusportti() {
    this.aloitusportti?.remove();
    this.aloitusportti = null;
  }

  /**
   * Avausteksti luettuna: omistajan ElevenLabsilla tuottama lukuääni
   * (assets/audio/intro-puhe.mp3). Selain ei salli ääntä ennen
   * ensimmäistä kosketusta — silloin puhe alkaa vasta ensimmäisestä
   * napautuksesta. Puuttuva tiedosto ei haittaa: virhe ohitetaan.
   */
  playIntroVoice() {
    if (!sfx.enabled) return;
    this.stopIntroVoice();
    const audio = new Audio('assets/audio/intro-puhe.mp3');
    audio.volume = puheVoima();
    this.pehmeaLoppu(audio);
    this.introVoice = audio;
    audio.play().catch(() => {
      const aloita = () => {
        if (this.introVoice === audio && this.game.phase === 'pickstart' && !this.dead) {
          audio.play().catch(() => {});
        }
      };
      window.addEventListener('pointerdown', aloita, { once: true });
    });
  }

  stopIntroVoice() {
    const vanha = this.introVoice;
    this.introVoice = null;
    if (!vanha) return;
    vanha.pause();
    vanha.removeAttribute('src');
  }

  /**
   * Saapumismerkinnän lukuääni. Soi kerran kun merkintä ilmestyy ja
   * vaikenee, kun tietoruutu vaihtaa aihetta. Puuttuva tiedosto (esim.
   * lauta jolle puhetta ei ole tuotettu) ohitetaan hiljaa.
   * `ekaLauseeseen` pysäyttää toiston ensimmäisen virkkeen jälkeiseen
   * hiljaisuuteen — kaiutinnappi jatkaa samasta kohdasta.
   */
  playDiaryVoice(url, { ekaLauseeseen = false, osuus = null } = {}) {
    this.stopDiaryVoice();
    if (!url || !sfx.enabled) return;
    const audio = new Audio(url);
    audio.volume = puheVoima();
    this.pehmeaLoppu(audio);
    this.diaryVoice = audio;
    // Kirjanpito kaikista luennoista: pysäytys hiljentää myös sellaisen
    // äänen, joka ei enää ole diaryVoice mutta soi yhä.
    (this.luennat ??= new Set()).add(audio);
    audio.addEventListener('ended', () => this.luennat?.delete(audio));
    if (ekaLauseeseen) {
      this.lauseTauko(url, osuus).then((raja) => {
        if (this.diaryVoice !== audio || raja == null) return;
        const vahti = () => {
          if (audio.jatkettu) {
            audio.removeEventListener('timeupdate', vahti);
            return;
          }
          if (audio.currentTime >= raja) {
            audio.pause();
            audio.removeEventListener('timeupdate', vahti);
          }
        };
        audio.addEventListener('timeupdate', vahti);
      });
    }
    audio.play().then(() => {
      // play() on asynkroninen: jos luenta ehti vaihtua tai pysähtyä
      // käynnistyksen aikana, myöhässä herännyt ääni pysäytetään heti —
      // muuten kaksi luentaa soi päällekkäin (omistajan havainto).
      if (this.diaryVoice !== audio) audio.pause();
    }).catch(() => {
      if (this.diaryVoice === audio) this.diaryVoice = null;
    });
  }

  /**
   * Ensimmäisen virkkeen jälkeisen hengähdyksen paikka äänitteessä.
   * Pelkkä "ensimmäinen hiljaisuus" osui lukijan hengitykseen ja katkaisi
   * virkkeen kesken (omistajan havainto), joten raja valitaan nyt
   * tekstistä lasketun arvion läheltä: ensimmäisen virkkeen osuus koko
   * tekstistä kertoo, missä kohdassa puhetta virkkeen loppu suunnilleen
   * on, ja sitä lähin vähintään 0,3 sekunnin hiljaisuus voittaa.
   * Lasketaan kerran per tiedosto ja muistetaan.
   */
  lauseTauko(url, osuus = null) {
    this.lauseTauot ??= new Map();
    const avain = `${url}|${osuus == null ? '' : osuus.toFixed(3)}`;
    if (!this.lauseTauot.has(avain)) {
      const lupaus = (async () => {
        const ctx = sfx.ensureContext();
        if (!ctx) return null;
        const data = await fetch(url).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()));
        const buf = await ctx.decodeAudioData(data);
        const kanava = buf.getChannelData(0);
        const ikkuna = Math.floor(buf.sampleRate * 0.05);
        let huippu = 0;
        for (let i = 0; i < kanava.length; i += 16) huippu = Math.max(huippu, Math.abs(kanava[i]));
        const raja = huippu * 0.04;
        // Ikkunoittainen äänekkyys: siitä puheen alku ja loppu sekä
        // puheen sisään jäävät hiljaisuudet.
        const aanekas = [];
        for (let i = 0; i < kanava.length; i += ikkuna) {
          let maksimi = 0;
          const loppu = Math.min(i + ikkuna, kanava.length);
          for (let j = i; j < loppu; j += 4) maksimi = Math.max(maksimi, Math.abs(kanava[j]));
          aanekas.push(maksimi >= raja);
        }
        const eka = aanekas.indexOf(true);
        const vika = aanekas.lastIndexOf(true);
        if (eka < 0) return null;
        const s = 0.05; // yhden ikkunan kesto sekunteina
        const tauot = []; // vähintään 0,3 s hiljaisuuksien alkukohdat
        let alkoi = -1;
        for (let i = eka; i <= vika + 1; i++) {
          if (i <= vika && !aanekas[i]) {
            if (alkoi < 0) alkoi = i;
          } else {
            if (alkoi >= 0 && (i - alkoi) * s >= 0.3) tauot.push(alkoi * s);
            alkoi = -1;
          }
        }
        if (!tauot.length) return null; // yksivirkkeinen — soi kokonaan
        const puheAlku = eka * s;
        const puheLoppu = (vika + 1) * s;
        let valinta = null;
        if (osuus == null) {
          // Ilman tekstiarviota kelpaa ensimmäinen tauko 1,2 s jälkeen.
          valinta = tauot.find((t) => t >= 1.2) ?? null;
        } else {
          // Arvio virkkeen lopusta puheen kestoon sovitettuna — lähin
          // tauko voittaa, jolloin hengitystauko kesken virkkeen häviää
          // aina oikealle virkerajalle.
          const arvio = puheAlku + (puheLoppu - puheAlku) * osuus;
          for (const t of tauot) {
            if (valinta == null || Math.abs(t - arvio) < Math.abs(valinta - arvio)) valinta = t;
          }
        }
        // Tauon alku + pieni hengähdys, jotta sana ehtii loppuun.
        return valinta == null ? null : valinta + 0.15;
      })().catch(() => null);
      this.lauseTauot.set(avain, lupaus);
    }
    return this.lauseTauot.get(avain);
  }

  /**
   * Pehmeä loppu puhetiedostoille: viimeinen neljännessekunti häivytetään
   * ja toisto pysäytetään juuri ennen tiedoston reunaa. ElevenLabsin
   * tiedosto päättyy keskeltä signaalia, ja kova reuna kuului pienenä
   * töksähdyksenä (omistajan havainto etusivulla) — pehmennys tehdään
   * toistossa, joten tiedostoja ei tarvinnut generoida uusiksi.
   */
  pehmeaLoppu(audio) {
    const perus = audio.volume;
    let rampissa = false;
    const rullaa = () => {
      if (audio.paused || !audio.duration) {
        rampissa = false;
        audio.volume = perus;
        return;
      }
      const jaljella = audio.duration - audio.currentTime;
      if (jaljella <= 0.06) {
        audio.pause();
        rampissa = false;
        return;
      }
      if (jaljella < 0.3) {
        audio.volume = perus * Math.max(0, (jaljella - 0.05) / 0.25);
      }
      requestAnimationFrame(rullaa);
    };
    // timeupdate on liian harva häivytykseen (~4 krt/s): se vain
    // käynnistää tiheän rampin, kun loppu lähestyy.
    audio.addEventListener('timeupdate', () => {
      if (rampissa || !audio.duration) return;
      if (audio.duration - audio.currentTime < 1.2) {
        rampissa = true;
        requestAnimationFrame(rullaa);
      }
    });
  }

  stopDiaryVoice() {
    this.diaryVoice = null;
    // Kaikki luennat kiinni — myös mahdollinen myöhästelijä, joka ei
    // enää ollut diaryVoice mutta soi yhä.
    for (const audio of this.luennat ?? []) {
      audio.pause();
      audio.removeAttribute('src');
    }
    this.luennat?.clear();
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
    document.getElementById('winner-title').textContent = `${w.name} voitti!`;
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
    if (this.dead) return; // kesken jäänyt animaatioketju voi kutsua tätä vielä destroyn jälkeen
    const { game } = this;
    this.renderEvent();
    if (game.phase === 'duel' && game.duel) {
      this.renderDuel();
      return;
    }
    const quiz = game.quiz;
    if (game.phase !== 'quiz' || !quiz) {
      this.stopQuizTimer();
      stopQuizMusic();
      if (this.quizDialog.open) this.quizDialog.close();
      return;
    }

    const city = game.board.cityById.get(quiz.cityId);
    const hardTag = quiz.hard ? ` · vaikea kysymys +${HARD_BONUS} p` : '';
    // Pulman piirros ensin, kysymysrivi alla — kortti on isoisän luonnos.
    // HUOM: SVGElement ei peri HTMLElementiä, joten .hidden-ominaisuus ei
    // heijastu attribuuttiin — se jäisi päälle ja [hidden]-sääntö piilottaisi
    // piirroksen pysyvästi. Attribuuttia on siis käsiteltävä suoraan.
    this.quizSketch.toggleAttribute('hidden', quiz.kind !== 'puzzle');
    if (quiz.kind === 'puzzle' && this.sketchFor !== quiz) {
      this.sketchFor = quiz;
      this.quizSketch.textContent = '';
      drawPuzzle(this.quizSketch, quiz.puzzleId, quiz.sketchData);
    }
    // Piirroksen selite: kertoo mitä luonnoksessa näkyy.
    this.quizSelite.hidden = quiz.kind !== 'puzzle' || !quiz.selite;
    if (!this.quizSelite.hidden) this.quizSelite.textContent = quiz.selite;

    // Valokuvakysymyksen kuva ladataan kerran per kysymys. Jos kuvaa ei
    // saada (esim. verkko katkesi kysymyksen avauduttua), tilalle jää
    // kysymysteksti — vaihtoehtoihin voi silti vastata tai antaa ajan
    // valua umpeen.
    this.quizPhoto.hidden = quiz.kind !== 'photo';
    if (quiz.kind === 'photo' && this.photoShownFor !== quiz) {
      this.photoShownFor = quiz;
      this.quizPhoto.removeAttribute('src');
      cachedImage(quiz.photoWiki).then((url) => {
        if (this.photoShownFor !== quiz || !url) return;
        this.quizPhoto.src = url;
        this.quizPhoto.alt = 'Matkavalokuvaajan vedos';
      });
    }

    // Leima näkyy vain pulmissa ja valokuvissa: irrallinen "Tietovisa"-sana
    // on turha, kun kehys kertoo kuka kysymyksen esittää.
    this.quizBadge.hidden = quiz.kind !== 'puzzle' && quiz.kind !== 'photo';
    this.quizBadge.textContent = quiz.kind === 'photo' ? 'Valokuva' : 'Pulma';
    let otsikko;
    if (quiz.kind === 'puzzle') {
      otsikko = `Isoisän luonnoskirjasta — ${quiz.title}`;
    } else if (quiz.kind === 'claim') {
      // Väittämässä puhuu isoisä, ei peli: otsikko kertoo äänen ja paikan,
      // jota merkintä koskee — se on usein muu kuin pelaajan sijainti.
      const aihe = quiz.place ? ` · ${quiz.place}` : '';
      otsikko = `Isoisän päiväkirjasta, 1873${aihe} — pitääkö tämä yhä paikkansa?`;
    } else if (quiz.gate) {
      otsikko = `${city.name} — portti: ${quiz.gate.label}`;
    } else {
      // Kehystarina: paikallinen kysyjä. Vanhassa tallenteessa kehystä ei
      // ole, jolloin otsikkona on pelkkä kaupunki.
      otsikko = quiz.frame
        ? `${city.name} — ${quiz.frame}:${hardTag}`
        : `${city.name}${hardTag}`;
    }
    // Kortti paljastuu vaiheittain kirjoituskoneella: ensin kehystarina,
    // pieni tauko, sitten kysymys, tauko, ja vasta lopuksi vaihtoehdot.
    // Samalla kääntyy päiväkirjan sivu ja hiljainen mietintämusiikki alkaa.
    if (this.typedQuizFor !== quiz) {
      this.typedQuizFor = quiz;
      this.quizStage = 0;
      sfx.play('quizOpen');
      startQuizMusic(this.game.pack.id);
      this.quizQuestion.textContent = '';
      const vaihtoehdot = () => {
        if (this.dead || this.typedQuizFor !== quiz) return;
        this.quizStage = 2;
        this.renderQuiz();
      };
      const kysymys = () => {
        if (this.dead || this.typedQuizFor !== quiz) return;
        this.quizStage = 1;
        this.typeText(this.quizQuestion, quiz.question, 'quiz', () => {
          this.typeTimers.quiz = setTimeout(vaihtoehdot, QUIZ_PAUSE_MS);
        }, QUIZ_TYPE_MS);
      };
      this.typeText(this.quizCity, otsikko, 'quiz', () => {
        this.typeTimers.quiz = setTimeout(kysymys, QUIZ_PAUSE_MS);
      }, QUIZ_TYPE_MS);
    } else if ((this.quizStage ?? 2) >= 2) {
      // Itsekorjaus valmiille kortille: jos jokin muu kirjoitus on ehtinyt
      // sotkea tekstit (esim. edellisen pelin kesken jäänyt kirjoituskone),
      // ne asetetaan kerralla kokonaan — muuten vaihtoehdot ja tulos
      // näkyisivät väärän kysymyksen alla.
      if (this.quizCity.textContent !== otsikko) this.quizCity.textContent = otsikko;
      if (this.quizQuestion.textContent !== String(quiz.question)) {
        this.quizQuestion.textContent = quiz.question;
      }
    }
    this.syncOptions(quiz, (i) => this.answerQuiz(i));
    // Vaihtoehdot ja apukeinot pysyvät piilossa, kunnes kysymys on
    // kirjoitettu loppuun. Vanha tallenne (ei quizStage-arvoa) näyttää
    // kaiken heti.
    const esilla = (this.quizStage ?? 2) >= 2 || quiz.chosen !== null;
    this.quizOptions.hidden = !esilla;

    const answered = quiz.chosen !== null;
    // Vastauksen jälkeen näytetään ensin pelkkä tuomio, ja vasta aarteen
    // paljastuksen jälkeen löytö ja selitys.
    const revealed = this.revealShownFor === quiz;

    // Apukeinot: 40 punnalla sanallinen vihje, 80 punnalla kaksi väärää pois.
    const p = game.player;
    const used = quiz.hidden.length > 0;
    // Väittämässä on kaksi vaihtoehtoa ja karttakysymykseen vastataan
    // kartalta, joten 50:50 ei kuulu niihin lainkaan.
    this.quizFifty.hidden = !esilla || answered || p.isBot || quiz.options.length < 4;
    this.quizFifty.disabled = used || p.money < FIFTY_FIFTY_PRICE;
    this.quizFifty.textContent = used ? '50:50 käytetty' : `50:50 (${FIFTY_FIFTY_PRICE} p)`;

    this.quizHint.hidden = !esilla || answered || p.isBot || !quiz.hint;
    this.quizHint.disabled = quiz.hintShown || p.money < HINT_PRICE;
    this.quizHint.textContent = quiz.hintShown ? 'Vihje ostettu' : `Vihje (${HINT_PRICE} p)`;

    this.quizHintText.hidden = !quiz.hintShown;
    if (quiz.hintShown) this.quizHintText.textContent = quiz.hint;

    // Tiimalasi käynnistyy vasta, kun vaihtoehdot ovat esillä — lukuaikaa
    // ei kuluteta kirjoituskoneen naksutteluun.
    if (esilla) {
      this.renderTimer(quiz);
    } else {
      this.quizTimerEl.hidden = true;
      this.stopQuizTimer();
    }

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
        } else if (quiz.right && quiz.explore) {
          body.appendChild(html('strong', '', `Oikein! Löytöpalkkio +${EXPLORE_REWARD} puntaa.`));
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

    this.quizBadge.hidden = true;
    this.quizCity.textContent = `Rosvon kaksintaistelu — ${p.name}`;
    // Kaksintaistelu ei käytä vaiheittaista paljastusta: vaihtoehdot ovat
    // heti esillä, eikä edellisen kortin piilotus saa jäädä päälle.
    this.quizStage = 2;
    this.quizOptions.hidden = false;
    if (this.typedQuizFor !== duel) {
      this.typedQuizFor = duel;
      startQuizMusic(this.game.pack.id);
      this.typeText(this.quizQuestion, duel.question, 'quiz');
    } else if (this.quizQuestion.textContent !== String(duel.question)) {
      // Sama itsekorjaus kuin tietovisassa: teksti ei saa jäädä eriämään.
      this.quizQuestion.textContent = duel.question;
    }
    this.syncOptions(duel, (i) => this.answerDuelUi(i));

    const answered = duel.chosen !== null;
    const revealed = this.revealShownFor === duel;

    // Helpotus rosvolta: puolet rahoista, puolet vääristä pois.
    const toll = Math.floor(p.money / 2);
    this.quizFifty.hidden = answered || p.isBot;
    this.quizFifty.disabled = duel.reliefs >= 2 || toll <= 0;
    if (duel.reliefs >= 2) this.quizFifty.textContent = 'Helpotukset käytetty';
    else this.ikonoi(this.quizFifty, 'kallo', `Helpotus (rosvo vie ${toll} p)`);

    // Kolmella hevosenkengällä pääsee ohi.
    this.quizHint.hidden = answered || p.isBot || p.horseshoes < DUEL_BYPASS_SHOES;
    this.quizHint.disabled = false;
    this.ikonoi(this.quizHint, 'kenka', `Ohita rosvo (${DUEL_BYPASS_SHOES} kenkää)`);

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
    // Pulmassa ei ole kelloa: se on päättelytehtävä, ei nopeuskilpailu.
    const show = !this.game.player.isBot && quiz.chosen === null && quiz.kind !== 'puzzle';
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

    // Näyttöaika kasvaa selitteen mukana: "+300 puntaa" saa vilahtaa,
    // mutta pitkä selite (esim. tyhjän laatan "merkintä oli vanhentunut")
    // pitää ehtiä lukea. Napautus ohittaa odotuksen.
    const seliteMs = (REVEAL_SUB[type] ?? '').length * 45;
    const napautus = new Promise((resolve) => {
      overlay.addEventListener('pointerdown', resolve, { once: true });
    });

    if (this.reducedMotion) {
      disc.classList.add('flipped');
      rays.classList.add('shown');
      caption.classList.add('shown');
      sfx.play(treasureSound(type));
      await Promise.race([this.wait(900 + seliteMs), napautus]);
    } else {
      await this.wait(420);
      disc.classList.add('flipped');
      sfx.play('flip');
      await this.wait(760);
      sfx.play('clack');
      sfx.play(treasureSound(type));
      rays.classList.add('shown');
      caption.classList.add('shown');
      await Promise.race([this.wait(1250 + seliteMs), napautus]);
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
    clearTimeout(this.typeTimers[slot]);
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

    // Avaustekstillä on kirjoittajan rytmi: sanaväli huojuu ja
    // välimerkin jälkeen pidetään tauko — tasainen konemainen tahti
    // kuulosti ja näytti luonnottomalta.
    const viive = (sana) => {
      if (slot !== 'intro') return speed;
      const perus = speed * (0.7 + Math.random() * 0.6);
      // Revennyt katkelma jättää lukijan tyhjän päälle: pitkä hiljaisuus
      // ennen kuin seuraava ajatus naksahtaa ruutuun.
      if (/…"?$/.test(sana)) return perus + 1200 + Math.random() * 500;
      if (/[.!?]$/.test(sana)) return perus + 620 + Math.random() * 320;
      if (/[,;:—–]$/.test(sana)) return perus + 300 + Math.random() * 160;
      // Kirjoittaja pysähtyy välillä miettimään kesken virkkeenkin.
      if (Math.random() < 0.15) return perus + 280 + Math.random() * 340;
      return perus;
    };

    const kirjoita = () => {
      shown++;
      piirra();
      // Kirjoituskoneen lyönti täsmälleen sillä hetkellä, kun sana
      // ilmestyy — ei ennen eikä jälkeen.
      if (slot === 'intro') sfx.play('pen');
      if (shown >= words.length) {
        // Lopuksi pelkkä teksti, jotta perään lisättävä lähderivi asettuu
        // luontevasti eikä jää näkymättömän jäänteen taakse.
        target.textContent = full;
        done?.();
        return;
      }
      this.typeTimers[slot] = setTimeout(kirjoita, viive(words[shown - 1]));
    };
    this.typeTimers[slot] = setTimeout(kirjoita, speed);
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
    if (this.busy || this.dead) return;
    this.busy = true;
    this.actionsEl.dataset.busy = 'true';
    try {
      const result = fn();
      if (result && result.ok === false) {
        this.showError(result.error);
        // Peruuntunut lento ei saa jättää kalvolippua päälle mykistämään
        // äänimaisemaa.
        if (!document.querySelector('.flight-overlay')) {
          document.body.classList.remove('flight-active');
        }
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
    // Matkavalinnan välivaihe ei saa jäädä päälle seuraavaan vuoroon.
    this.travelExpanded = false;
    const player = game.player;
    const from = player.pos;
    const lahto = from.type === 'city' ? game.board.cityById.get(from.city) : null;
    const kohde = game.board.cityById.get(destination);
    const suunta = lahto && kohde ? { dx: kohde.x - lahto.x, dy: kohde.y - lahto.y } : null;
    // Repliikki arvotaan ennen siirtoa, jotta rng-kutsu osuu samaan kohtaan
    // riippumatta siitä, näytetäänkö animaatio.
    const line = game.flightLine(destination);
    // Kalvollisella lennolla kohteen äänimaisema odottaa kalvon loppuun.
    if (game.pack.id === 'maailma') {
      sfx.play('flight');
      if (!this.reducedMotion) document.body.classList.add('flight-active');
    }
    this.run(() => game.actionFly(destination), {
      after: async () => {
        // Lentokalvo kuuluu vain maailmankartalle; mantereella nappula
        // lentää suoraan karttanäkymässä — rauhallisemmin ja moottorin
        // hurinan saattelemana (omistajan toive).
        if (game.pack.id === 'maailma') {
          await this.animateFlight(lahto?.name ?? '', kohde?.name ?? '', line, suunta);
          await this.animatePawn(player, from, [player.pos], FLIGHT_MS);
        } else {
          sfx.startFlight(MANNER_LENTO_MS);
          await this.animatePawn(player, from, [player.pos], MANNER_LENTO_MS);
          sfx.stopFlight();
        }
      },
    });
  }

  /**
   * Zoomaa näkymän kahden pisteen ympärille lennon ajaksi — kertaheitolla,
   * ei liukuen: viewBoxin animointi piirtää koko kartan joka ruudulla
   * uudelleen ja tökkii hitaammilla koneilla. Rajaus on tiukka, jotta
   * lentoreitti täyttää reilusti yli puolet ruudusta ja matka näyttää
   * matkalta. Palauttaa lähtönäkymän viewBox-merkkijonon paluuta varten.
   */
  /**
   * Indiana Jones -lentoanimaatio läpikuultavana kalvona kartan päällä.
   * Näytetään vain maailmankartalla — mantereella lento tapahtuu suoraan
   * karttanäkymässä. Kohtaus häipyy itsestään hetken kuluttua perillä,
   * ja napautus mihin tahansa ohittaa sen heti.
   *
   * `prefers-reduced-motion` ohittaa animaation kokonaan: silloin ei piirretä
   * mitään eikä odoteta, jotta peli etenee samaa tahtia kuin ennenkin.
   */
  async animateFlight(fromLabel, toLabel, line = null, dir = null) {
    if (this.reducedMotion) return;

    const overlay = html('div', 'flight-overlay');
    const scene = el('svg', { viewBox: '0 0 1000 560', class: 'flight-scene' }, overlay);
    this.mapPane.appendChild(overlay);
    // Alareunan kortit ja napit piiloon lennon ajaksi: kalvon alla näkyy
    // vain kohdemantereen kartta. Lukuääni jatkuu kalvon alla.
    document.body.classList.add('flight-active');

    // Napautus mihin tahansa hypäyttää koneen perille; kalvo pysyy
    // kuitenkin esillä, kunnes pelaaja astuu ulos napista.
    let ohitettu = false;
    overlay.addEventListener('pointerdown', () => { ohitettu = true; }, { once: true });

    // Isoisän karttalehti: käsin piirretyt vyöhykeviivat katkoviivalla
    // (kääntöpiirit) ja himmeitä päiväkirjamerkintöjä piirroksineen.
    const vyohyke = (y, nimi) => {
      el('path', {
        d: `M20,${y} q160,-8 330,-2 t320,8 t310,-6`,
        class: 'flight-zone',
      }, scene);
      const t = el('text', { x: 962, y: y - 10, 'text-anchor': 'end', class: 'flight-zone-name' }, scene);
      t.textContent = nimi;
    };
    vyohyke(120, 'Kravun kääntöpiiri');
    vyohyke(300, 'päiväntasaaja');
    vyohyke(470, 'Kauriin kääntöpiiri');
    const muistiinpano = (x, y, rivit, kulma = -2) => {
      const g = el('g', { transform: `translate(${x},${y}) rotate(${kulma})`, class: 'flight-note' }, scene);
      rivit.forEach((rivi, i) => {
        const t = el('text', { x: 0, y: i * 26, class: 'flight-note-text' }, g);
        t.textContent = rivi;
      });
      return g;
    };
    muistiinpano(60, 80, ['pasaatituuli kantaa', 'lounaaseen — luota siihen'], -3);
    muistiinpano(640, 90, ['N.B. monsuuni kääntyy', 'lokakuussa'], 2);
    muistiinpano(90, 505, ['täällä kompassi', 'valehtelee hiukan'], -1);
    // Pieni kompassiruusu ja aaltoja isoisän käden jälkeä.
    const ruusu = el('g', { transform: 'translate(905,505)', class: 'flight-note' }, scene);
    el('circle', { cx: 0, cy: 0, r: 26, fill: 'none', class: 'flight-doodle' }, ruusu);
    el('path', { d: 'M0,-24 L5,0 L0,24 L-5,0 z M-24,0 L0,-5 L24,0 L0,5 z', class: 'flight-doodle-fill' }, ruusu);
    el('path', { d: 'M330,520 q14,-10 28,0 q14,10 28,0', fill: 'none', class: 'flight-doodle' }, scene);
    el('path', { d: 'M540,60 l14,-18 l12,18 l10,-12 l9,12', fill: 'none', class: 'flight-doodle' }, scene);

    // Lennon suunta seuraa oikeaa maantiedettä, kun molempien päiden
    // koordinaatit tunnetaan: Lontoosta Tangeriin lennetään ylhäältä
    // oikealta alas vasemmalle, kuten oikeallakin kartalla. Ilman suuntaa
    // (esim. porttilento toiselle laudalle) lento nousee vasemmalta ylös.
    const itaan = dir ? dir.dx >= 0 : true;
    const etelaan = dir ? dir.dy >= 0 : false;
    const a = { x: itaan ? 130 : 870, y: etelaan ? 120 : 450 };
    const b = { x: itaan ? 870 : 130, y: etelaan ? 450 : 120 };
    el('circle', { cx: a.x, cy: a.y, r: 9, class: 'flight-dot' }, scene);
    el('circle', { cx: b.x, cy: b.y, r: 9, class: 'flight-dot' }, scene);
    const nimi = (p, teksti) => {
      const t = el('text', {
        x: p.x, y: p.y + 56, 'text-anchor': p.x > 500 ? 'end' : 'start', class: 'flight-name',
      }, scene);
      t.textContent = teksti;
    };
    if (fromLabel) nimi(a, fromLabel);
    if (toLabel) nimi(b, toLabel);

    // Kaari kaartuu aina ylöspäin kulkusuunnasta riippumatta, kuin
    // lentorata vanhan filmin kartalla.
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    let px = -dy / len;
    let py = dx / len;
    if (py > 0) { px = -px; py = -py; }
    const kx = (a.x + b.x) / 2 + px * 170;
    const ky = (a.y + b.y) / 2 + py * 170;
    const d = `M${a.x},${a.y} Q${kx},${ky} ${b.x},${b.y}`;
    const reitti = el('path', { d, class: 'flight-trail' }, scene);
    const kokoPituus = reitti.getTotalLength();
    reitti.style.strokeDasharray = kokoPituus;
    reitti.style.strokeDashoffset = kokoPituus;

    const kone = el('g', { class: 'flight-plane' }, scene);
    // Yksinkertainen kone ylhäältä: runko, siivet ja pyrstö.
    el('path', {
      d: 'M14,0 L-6,0 M-10,0 L-14,0 M2,0 L-8,-9 L-4,-9 L6,0 L-4,9 L-8,9 z '
        + 'M-11,0 L-15,-5 L-13,-5 L-9,0 L-13,5 L-15,5 z',
      class: 'flight-plane-body',
      transform: 'scale(1.7)',
    }, kone);

    // Reitti näytteistetään kerran valmiiksi: getPointAtLength jokaisella
    // ruudunpäivityksellä oli raskas (etenkin iPadin Safarissa) ja teki
    // koneen liikkeestä nykivän. Taulukosta poiminta on ilmaista.
    const NAYTTEITA = 240;
    const naytteet = [];
    for (let i = 0; i <= NAYTTEITA; i++) {
      naytteet.push(reitti.getPointAtLength((kokoPituus * i) / NAYTTEITA));
    }
    const kohta = (osuus) => {
      const f = Math.min(NAYTTEITA - 0.001, Math.max(0, osuus * NAYTTEITA));
      const i = Math.floor(f);
      const j = f - i;
      const p1 = naytteet[i];
      const p2 = naytteet[i + 1];
      return {
        x: p1.x + (p2.x - p1.x) * j,
        y: p1.y + (p2.y - p1.y) * j,
        kulma: (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI,
      };
    };

    // Repliikki ja Astu mantereelle -nappi asuvat samassa kelluvassa
    // alaosassa: asettelu hoituu itsestään eikä napin osumakohtaa
    // tarvitse laskea käsin.
    const alaosa = html('div', 'flight-alaosa');
    overlay.appendChild(alaosa);
    if (line) this.showFlightLine(line, alaosa);
    // Potkurihurina koko kohtauksen ajaksi: nousee ja laskee sen mukana.
    sfx.startFlight(FLY_OVERLAY_MS);

    await new Promise((resolve) => {
      const alku = performance.now();
      const askel = (nyt) => {
        // Napautus hyppää suoraan perille.
        const t = ohitettu ? 1 : Math.min(1, (nyt - alku) / FLY_OVERLAY_MS);
        // Pehmeä kiihdytys ja jarrutus, jottei kone nykäise liikkeelle.
        const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        reitti.style.strokeDashoffset = kokoPituus * (1 - e);

        const p = kohta(e);
        kone.setAttribute('transform', `translate(${p.x},${p.y}) rotate(${p.kulma})`);

        if (t < 1) requestAnimationFrame(askel);
        else resolve();
      };
      requestAnimationFrame(askel);
    });

    // Moottori jää käymään kalvon ajaksi — se hiljenee vasta, kun
    // pelaaja astuu ulos koneesta.

    // Perillä kalvo jää odottamaan: lukuääni saa puhua rauhassa, ja
    // pelaaja astuu ulos itse valitsemallaan hetkellä.
    await new Promise((resolve) => {
      const nappi = html('button', 'flight-exit', 'Astu mantereelle');
      nappi.addEventListener('click', resolve, { once: true });
      // Nappi virtaa repliikin alle samassa alaosassa — osumakohta on
      // aina täsmälleen siinä missä nappi näkyy.
      alaosa.appendChild(nappi);
    });

    sfx.stopFlight();
    overlay.classList.add('flight-leaving');
    await this.wait(280);
    overlay.remove();
    this.hideFlightLine();
    document.body.classList.remove('flight-active');
    // Ulos astuttaessa päiväkirja pääsee ääneen: lennon ajaksi lykätty
    // saapumismerkintä alkaa kirjoittua ja soida vasta nyt.
    if (!this.dead) this.render();
  }

  /**
   * Nuoren herran repliikki lennon ajaksi, kirjoituskoneella. Rivi elää
   * kalvon kelluvassa alaosassa ja poistuu kalvon mukana.
   */
  showFlightLine(line, kotelo) {
    this.flightLine = html('p', 'flight-line');
    kotelo.appendChild(this.flightLine);
    this.typeText(this.flightLine, line, 'flight');
  }

  hideFlightLine() {
    // Rivi poistuu kalvon mukana; viite siivotaan, ettei kirjoitus jatku
    // irronneeseen elementtiin.
    this.flightLine = null;
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
    // Ikoni voi olla viivaikonin nimi tai suora merkki — kuplat piirretään
    // samalla kynällä kuin napit aina kun ikoni sarjasta löytyy.
    const kuva = viivaIkoni(icon);
    if (kuva) kuva.classList.add('toast-icon');
    if (token) box.appendChild(tokenIconSvg(token, kind === 'die' ? 30 : 34));
    else box.appendChild(kuva ?? html('span', 'toast-icon', icon ?? '•'));
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
