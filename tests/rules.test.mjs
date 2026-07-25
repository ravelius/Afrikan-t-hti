import test from 'node:test';
import assert from 'node:assert/strict';

import { CITIES, EDGES, TOKEN_CITIES } from '../js/board.js';
import { buildBoard, findMoves, posKey, cityDistances } from '../js/rules.js';
import { tokenPileTemplate, TOKEN_COUNTS } from '../js/tokens.js';
import { Game, mulberry32, START_MONEY, STRANDED_AID } from '../js/game.js';
import { chooseAction, chooseMove } from '../js/ai.js';

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

test('nopan silmäluku käytetään kokonaan', () => {
  const start = { type: 'city', city: 'tanger' };
  for (let die = 1; die <= 6; die++) {
    const moves = findMoves(board, start, die, Infinity);
    assert.ok(moves.size > 0);
    for (const [, move] of moves) {
      assert.equal(move.path.length, die, `silmäluku ${die} ei täsmää polkuun`);
    }
  }
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
  assert.ok(!moves.has(posKey(pos)));
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
    } else {
      const action = chooseAction(game);
      if (action.type === 'buy') game.actionBuy();
      else if (action.type === 'luck') game.actionLuck();
      else if (action.type === 'fly') game.actionFly(action.destination);
      else game.actionRoll();
    }
    steps++;
  }

  assert.equal(game.phase, 'over');
  assert.ok(game.winner);
  assert.ok(game.starFound);
});
