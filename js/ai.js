// Yksinkertainen tietokonevastustaja.
//
// Strategia:
//   1. Jos hallussa on tähti tai (tähti löytynyt ja hallussa hevosenkenkä) -> kotiin.
//   2. Muuten: käännä laatta jos seisot sellaisen päällä.
//   3. Muuten: liiku kohti lähintä kääntämätöntä laattaa.

import { cityDistances, distanceOf } from './rules.js';
import { TOKEN_PRICE, FLIGHT_PRICE } from './game.js';

// Kuinka usein botti osaa vastata tietovisaan oikein.
export const BOT_SKILL = 0.55;

function racingHome(game, p) {
  return p.hasStar || (game.starFound && p.horseshoes > 0);
}

/** Etäisyydet kohteisiin: yhdistetty kartta, jossa jokainen kohde on nollaetäisyydellä. */
function distancesToAny(game, targets, money) {
  const merged = new Map();
  for (const target of targets) {
    const dist = cityDistances(game.board, target, money);
    for (const [city, d] of dist) {
      if (d < (merged.get(city) ?? Infinity)) merged.set(city, d);
    }
  }
  return merged;
}

function goalDistances(game, p) {
  if (racingHome(game, p)) {
    const starts = game.players.map((pl) => pl.start);
    return distancesToAny(game, [...new Set(starts)], p.money);
  }
  const targets = [...game.tokens.keys()];
  if (targets.length === 0) {
    return distancesToAny(game, [...new Set(game.players.map((pl) => pl.start))], p.money);
  }
  return distancesToAny(game, targets, p.money);
}

/** Valitsee vuoron aloitustoiminnon. */
export function chooseAction(game) {
  const p = game.player;
  const actions = game.availableActions();

  if (!racingHome(game, p) && actions.quiz) {
    // Rikas botti ostaa varman käännön, muuten se luottaa tietoihinsa.
    if (actions.buy && p.money >= TOKEN_PRICE + 500) return { type: 'buy' };
    return { type: 'quiz' };
  }

  // Kotimatkalla lento kannattaa jos se lyhentää matkaa selvästi.
  if (racingHome(game, p) && actions.fly.length && p.money >= FLIGHT_PRICE) {
    const dist = goalDistances(game, p);
    const here = distanceOf(game.board, p.pos, dist);
    const best = actions.fly.reduce(
      (acc, city) => Math.min(acc, dist.get(city) ?? Infinity),
      Infinity,
    );
    if (best + 4 < here) return { type: 'fly', destination: bestFlight(actions.fly, dist) };
  }

  return { type: 'roll' };
}

function bestFlight(destinations, dist) {
  return destinations.reduce((best, city) =>
    (dist.get(city) ?? Infinity) < (dist.get(best) ?? Infinity) ? city : best,
  );
}

/** Valitsee päätepisteen heiton jälkeen. */
export function chooseMove(game) {
  const p = game.player;
  const options = game.moveOptions();
  if (options.length === 0) return null;
  const dist = goalDistances(game, p);
  const home = racingHome(game, p);

  let best = options[0];
  let bestScore = -Infinity;
  for (const opt of options) {
    // Saavuttamaton kohde saa suuren mutta äärellisen etäisyyden, jotta
    // pisteytys pysyy vertailukelpoisena myös rahattomana.
    let score = -Math.min(distanceOf(game.board, opt.pos, dist), 999) * 10;
    score -= opt.cost / 50; // laivaliput maksavat
    if (!home && opt.hasToken) score += 60; // laatan päälle pysähtyminen on arvokasta
    if (home && opt.city?.start) score += 1000;
    score += game.rng() * 3; // pikkuisen vaihtelua
    if (score > bestScore) {
      bestScore = score;
      best = opt;
    }
  }
  return best.key;
}

/** Botin vastaus tietovisaan: oikein BOT_SKILL:n todennäköisyydellä. */
export function chooseQuizAnswer(game, skill = BOT_SKILL) {
  const quiz = game.quiz;
  if (!quiz) return 0;
  if (game.rng() < skill) return quiz.correct;
  const wrong = quiz.options.map((_, i) => i).filter((i) => i !== quiz.correct);
  return wrong[Math.floor(game.rng() * wrong.length)];
}
