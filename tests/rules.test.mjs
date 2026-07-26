import test from 'node:test';
import assert from 'node:assert/strict';

import { CITIES, EDGES, TOKEN_CITIES } from '../js/board.js';
import { buildBoard, findMoves, posKey, cityDistances, pointAlong } from '../js/rules.js';
import { isOnLand } from '../js/mapart.js';
import { tokenPileTemplate, TOKEN_COUNTS } from '../js/tokens.js';
import { Game, mulberry32, START_MONEY, STRANDED_AID, FIFTY_FIFTY_PRICE } from '../js/game.js';
import { chooseAction, chooseMove, chooseQuizAnswer, wantsHint } from '../js/ai.js';
import { QUESTIONS, allQuestions } from '../js/questions.js';

const board = buildBoard(CITIES, EDGES);

test('lauta rakentuu ja on yhtenäinen', () => {
  for (const city of CITIES) {
    assert.ok(board.adj.get(city.id).length > 0, `${city.id} on irrallaan`);
  }
  const dist = cityDistances(board, 'tanger');
  for (const city of CITIES) {
    assert.ok(dist.has(city.id), `${city.id} ei ole saavutettavissa Tangerista`);
  }
});

test('laattoja on yhtä monta kuin laattakaupunkeja', () => {
  const pile = tokenPileTemplate();
  assert.equal(pile.length, TOKEN_CITIES.length);
  assert.equal(TOKEN_COUNTS.star, 1);
  assert.equal(TOKEN_COUNTS.horseshoe, 2);
});

test('kaupunkiin pääsee ilman tasalukua, reitille vain täydellä heitolla', () => {
  const start = { type: 'city', city: 'tanger' };
  for (let die = 1; die <= 6; die++) {
    const moves = findMoves(board, start, die, Infinity);
    assert.ok(moves.size > 0);
    for (const [, move] of moves) {
      assert.ok(move.path.length <= die, `siirto käytti yli ${die} askelta`);
      if (move.pos.type === 'edge') {
        assert.equal(move.path.length, die, 'reitin varrelle pysähdytään vasta heiton loputtua');
      }
    }
  }

  // Tripoli on neljän askelen päässä: sinne pääsee myös viitosella ja kuutosella.
  for (const die of [4, 5, 6]) {
    assert.ok(findMoves(board, start, die, Infinity).has('c:tripoli'), `heitto ${die}`);
  }
  assert.ok(!findMoves(board, start, 3, Infinity).has('c:tripoli'));
});

test('laivareitin maksu peritään ja estää liikkeen ilman rahaa', () => {
  const start = { type: 'city', city: 'tanger' };
  const rich = findMoves(board, start, 1, 300);
  const seaStep = [...rich.values()].find((m) => m.cost === 100);
  assert.ok(seaStep, 'laivareitin ensiaskeleen pitäisi maksaa 100');

  const broke = findMoves(board, start, 1, 0);
  assert.ok([...broke.values()].every((m) => m.cost === 0));
  assert.equal(broke.size, rich.size - 1);
});

test('kesken reitin ei saa kääntyä takaisin', () => {
  const pos = { type: 'edge', edge: 'tanger|tripoli', idx: 2 };
  const moves = findMoves(board, pos, 2, Infinity);
  const keys = [...moves.keys()].sort();
  assert.deepEqual(keys, ['c:tanger', 'c:tripoli']);
  assert.ok(!moves.has(posKey(pos)), 'lähtöruutuun ei jäädä');
  // Kahdella askeleella molempiin päihin: kumpikaan ei vaadi peruutusta.
  assert.equal(moves.get('c:tripoli').path.length, 2);
});

test('saarelle pääsee vain laivalla', () => {
  const pos = { type: 'city', city: 'sansibar' };
  assert.equal(findMoves(board, pos, 3, 0).size, 0);
  assert.ok(findMoves(board, pos, 3, 100).size > 0);
});

test('jumiin jäänyt saa avustuksen vuoron alussa', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    rng: mulberry32(7),
  });
  const p = game.players[0];
  p.money = 0;
  p.pos = { type: 'city', city: 'sansibar' };
  game.beginTurn();
  assert.equal(p.money, STRANDED_AID);
});

test('laattojen vaikutukset: jalokivi, ryöstäjä ja tähti', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    rng: mulberry32(3),
  });
  const p = game.player;
  p.pos = { type: 'city', city: 'timbuktu' };

  game.tokens.set('timbuktu', 'ruby');
  game.revealToken('timbuktu');
  assert.equal(p.money, START_MONEY + 1000);

  game.tokens.set('timbuktu', 'robber');
  game.revealToken('timbuktu');
  assert.equal(p.money, 0);

  game.tokens.set('timbuktu', 'star');
  game.revealToken('timbuktu');
  assert.ok(p.hasStar);
  assert.ok(game.starFound);
});

test('tähti kotiin voittaa, hevosenkenkä voi ehtiä ensin', () => {
  const makeGame = () =>
    new Game({
      players: [
        { name: 'A', color: '#f00', start: 'tanger' },
        { name: 'B', color: '#00f', start: 'kairo' },
      ],
      rng: mulberry32(11),
    });

  const g1 = makeGame();
  g1.player.hasStar = true;
  g1.starFound = true;
  g1.player.pos = { type: 'city', city: 'tanger' };
  assert.ok(g1.checkWin());
  assert.equal(g1.winner.name, 'A');
  assert.equal(g1.phase, 'over');

  // Ilman tähteä hevosenkenkä ei riitä ennen kuin tähti on löytynyt.
  const g2 = makeGame();
  g2.player.horseshoes = 1;
  g2.player.pos = { type: 'city', city: 'tanger' };
  assert.equal(g2.checkWin(), false);
  g2.starFound = true;
  assert.ok(g2.checkWin());
});

test('bottien peli päättyy voittoon', () => {
  const game = new Game({
    players: [
      { name: 'Botti 1', color: '#f00', start: 'tanger', isBot: true },
      { name: 'Botti 2', color: '#00f', start: 'kairo', isBot: true },
      { name: 'Botti 3', color: '#0f0', start: 'tanger', isBot: true },
    ],
    rng: mulberry32(2024),
  });

  let steps = 0;
  while (game.phase !== 'over' && steps < 5000) {
    if (game.phase === 'move') {
      const key = chooseMove(game);
      if (key) game.actionMove(key);
      else game.endTurn();
    } else if (game.phase === 'quiz') {
      if (game.quiz.chosen !== null) game.closeQuiz();
      else if (wantsHint(game)) game.actionFiftyFifty();
      else game.answerQuiz(chooseQuizAnswer(game));
    } else {
      const action = chooseAction(game);
      if (action.type === 'quiz') game.actionQuiz();
      else if (action.type === 'fly') game.actionFly(action.destination);
      else game.actionRoll();
    }
    steps++;
  }

  assert.equal(game.phase, 'over');
  assert.ok(game.winner);
  assert.ok(game.starFound);
});

test('kysymyspankki on ehjä', () => {
  const cityIds = CITIES.filter((c) => !c.start).map((c) => c.id);
  for (const id of cityIds) {
    assert.ok(QUESTIONS[id]?.length >= 2, `kaupungilta ${id} puuttuu kysymyksiä`);
  }
  assert.ok(QUESTIONS.general.length >= 10);

  for (const q of allQuestions()) {
    assert.ok(q.q.trim().length > 0, 'tyhjä kysymys');
    assert.equal(q.options.length, 4, `kysymyksellä "${q.q}" ei ole neljää vaihtoehtoa`);
    assert.equal(new Set(q.options).size, 4, `kysymyksessä "${q.q}" on kaksi samaa vaihtoehtoa`);
    assert.ok(
      Number.isInteger(q.correct) && q.correct >= 0 && q.correct < 4,
      `kysymyksen "${q.q}" oikea vastaus on virheellinen`,
    );
    assert.ok(q.fact && q.fact.length > 0, `kysymykseltä "${q.q}" puuttuu selitys`);
  }

  const texts = allQuestions().map((q) => q.q);
  assert.equal(new Set(texts).size, texts.length, 'sama kysymys esiintyy kahdesti');
});

test('oikea vastaus kääntää laatan, väärä ei', () => {
  const makeGame = () => {
    const game = new Game({
      players: [
        { name: 'A', color: '#f00', start: 'tanger' },
        { name: 'B', color: '#00f', start: 'kairo' },
      ],
      rng: mulberry32(42),
    });
    game.player.pos = { type: 'city', city: 'timbuktu' };
    game.tokens.set('timbuktu', 'ruby');
    return game;
  };

  const win = makeGame();
  assert.ok(win.actionQuiz().ok);
  assert.equal(win.phase, 'quiz');
  assert.equal(win.quiz.options.length, 4);
  const rahaEnnen = win.player.money;
  win.answerQuiz(win.quiz.correct);
  assert.equal(win.revealed.get('timbuktu'), 'ruby');
  assert.equal(win.players[0].money, rahaEnnen + 1000);
  win.closeQuiz();
  assert.equal(win.phase, 'action');
  assert.equal(win.current, 1, 'vuoro siirtyy vastauksen jälkeen');

  const lose = makeGame();
  lose.actionQuiz();
  const vaara = (lose.quiz.correct + 1) % 4;
  lose.answerQuiz(vaara);
  assert.equal(lose.quiz.right, false);
  assert.ok(lose.tokens.has('timbuktu'), 'laatta jää kääntämättä');
  lose.closeQuiz();
  assert.equal(lose.current, 1);
});

test('sama kysymys ei toistu ennen kuin pakka on käyty läpi', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    rng: mulberry32(9),
  });
  const nahdyt = new Set();
  for (let i = 0; i < QUESTIONS.timbuktu.length; i++) {
    const kysymys = game.pickQuestion('timbuktu');
    assert.ok(!nahdyt.has(kysymys.q), 'kysymys toistui liian aikaisin');
    nahdyt.add(kysymys.q);
  }
});

test('peli tallentuu ja palautuu samaan tilanteeseen', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo', isBot: true },
    ],
    seed: 1234,
  });
  game.players[0].pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'emerald');
  game.actionQuiz();
  game.answerQuiz(game.quiz.correct);
  game.closeQuiz();
  game.actionRoll();

  const data = JSON.parse(JSON.stringify(game.toJSON()));
  const restored = Game.fromJSON(data);

  assert.ok(restored);
  assert.equal(restored.phase, game.phase);
  assert.equal(restored.die, game.die);
  assert.equal(restored.current, game.current);
  assert.equal(restored.tokens.size, game.tokens.size);
  assert.equal(restored.revealed.get('timbuktu'), 'emerald');
  assert.equal(restored.players[0].money, game.players[0].money);
  assert.deepEqual(restored.players[1].pos, game.players[1].pos);
  assert.equal(restored.usedQuestions.size, game.usedQuestions.size);
  assert.deepEqual([...restored.moves.keys()].sort(), [...game.moves.keys()].sort());
  // Arvonnat jatkuvat samasta kohdasta.
  assert.equal(restored.rng(), game.rng());
});

test('kelvoton tallennus hylätään', () => {
  assert.equal(Game.fromJSON(null), null);
  assert.equal(Game.fromJSON({ version: 99 }), null);
  assert.equal(Game.fromJSON({ version: 1 }), null);
});

test('merireitit kulkevat veden päällä', () => {
  const HARBOUR = 55; // satamaan johtava pätkä saa kulkea maalla
  for (const edge of board.edges) {
    if (edge.type !== 'sea') continue;
    const a = board.cityById.get(edge.a);
    const b = board.cityById.get(edge.b);
    for (let t = 0.02; t <= 0.98; t += 0.02) {
      const { x, y } = pointAlong(edge.poly, t);
      if (Math.hypot(x - a.x, y - a.y) < HARBOUR) continue;
      if (Math.hypot(x - b.x, y - b.y) < HARBOUR) continue;
      assert.ok(!isOnLand([x, y]), `${edge.id} kulkee maalla kohdassa t=${t.toFixed(2)}`);
    }
  }
});

test('aarretta ei voi ostaa rahalla', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    seed: 8,
  });
  assert.equal(typeof game.actionBuy, 'undefined');
  const actions = game.availableActions();
  assert.deepEqual(Object.keys(actions).sort(), ['fly', 'quiz', 'roll']);
});

test('50:50 poistaa kaksi väärää vaihtoehtoa ja maksaa 50', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    seed: 77,
  });
  game.player.pos = { type: 'city', city: 'timbuktu' };
  game.tokens.set('timbuktu', 'topaz');
  game.actionQuiz();

  const rahaEnnen = game.player.money;
  const tulos = game.actionFiftyFifty();
  assert.ok(tulos.ok);
  assert.equal(game.player.money, rahaEnnen - FIFTY_FIFTY_PRICE);
  assert.equal(game.quiz.hidden.length, 2);
  assert.ok(!game.quiz.hidden.includes(game.quiz.correct), 'oikea vastaus ei saa piiloutua');

  // Toista vihjettä ei saa, eikä piilotettua voi valita.
  assert.equal(game.actionFiftyFifty().ok, false);
  assert.equal(game.answerQuiz(game.quiz.hidden[0]).ok, false);

  // Oikea vastaus toimii yhä.
  game.answerQuiz(game.quiz.correct);
  assert.ok(game.quiz.right);
  assert.equal(game.revealed.get('timbuktu'), 'topaz');
});

test('50:50 ei onnistu ilman rahaa', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    seed: 21,
  });
  game.player.pos = { type: 'city', city: 'gao' };
  game.player.money = 20;
  game.actionQuiz();
  const tulos = game.actionFiftyFifty();
  assert.equal(tulos.ok, false);
  assert.equal(game.quiz.hidden.length, 0);
});

test('väärä vastaus päättää vuoron ja seuraavalla vuorolla saa uuden kysymyksen', () => {
  const game = new Game({
    players: [
      { name: 'A', color: '#f00', start: 'tanger' },
      { name: 'B', color: '#00f', start: 'kairo' },
    ],
    seed: 99,
  });
  game.player.pos = { type: 'city', city: 'kano' };
  game.tokens.set('kano', 'ruby');

  game.actionQuiz();
  const eka = game.quiz.question;
  game.answerQuiz((game.quiz.correct + 1) % 4);
  game.closeQuiz();
  assert.equal(game.current, 1, 'vuoro siirtyy väärästä vastauksesta');
  assert.ok(game.tokens.has('kano'), 'aarre pysyy piilossa');

  // Takaisin ensimmäiselle pelaajalle: uusi kysymys samasta kaupungista.
  game.endTurn();
  assert.equal(game.current, 0);
  game.actionQuiz();
  assert.notEqual(game.quiz.question, eka);
  game.answerQuiz(game.quiz.correct);
  assert.equal(game.revealed.get('kano'), 'ruby');
});
