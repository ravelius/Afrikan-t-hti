// Puhdas sääntölogiikka: laudan rakenne, siirtojen laskenta ja etäisyydet.
// Tämä moduuli ei tiedä mitään DOM:ista, joten sen voi testata suoraan Nodella.

import { SEA_FEE } from './board.js';

/**
 * Sijainti on joko kaupungissa tai reitin varrella:
 *   { type: 'city', city: 'kairo' }
 *   { type: 'edge', edge: 'kairo|suakin', idx: 2 }   idx = askelia a-päästä
 */
export function posKey(pos) {
  return pos.type === 'city' ? `c:${pos.city}` : `e:${pos.edge}:${pos.idx}`;
}

export function edgeId(a, b) {
  return `${a}|${b}`;
}

/** Catmull–Rom-pehmennys avoimelle polulle: tiheä pistejono piirtoa varten. */
function densify(points, perSpan = 14) {
  if (points.length < 3) return points;
  const p = (i) => points[Math.max(0, Math.min(points.length - 1, i))];
  const out = [points[0]];
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = p(i - 1);
    const [x1, y1] = p(i);
    const [x2, y2] = p(i + 1);
    const [x3, y3] = p(i + 2);
    for (let s = 1; s <= perSpan; s++) {
      const t = s / perSpan;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push([
        0.5 * (2 * x1 + (x2 - x0) * t + (2 * x0 - 5 * x1 + 4 * x2 - x3) * t2 + (-x0 + 3 * x1 - 3 * x2 + x3) * t3),
        0.5 * (2 * y1 + (y2 - y0) * t + (2 * y0 - 5 * y1 + 4 * y2 - y3) * t2 + (-y0 + 3 * y1 - 3 * y2 + y3) * t3),
      ]);
    }
  }
  return out;
}

/** Reitin kulkema polku pisteinä. Merireitit kaartavat via-pisteiden kautta. */
export function edgePolyline(edge, cityById) {
  const a = cityById.get(edge.a);
  const b = cityById.get(edge.b);
  const base = [[a.x, a.y], ...(edge.via ?? []), [b.x, b.y]];
  return densify(base);
}

/** Piste polulla suhteellisella etäisyydellä t (0–1), kaarenpituuden mukaan. */
export function pointAlong(poly, t) {
  if (poly.length === 1) return { x: poly[0][0], y: poly[0][1] };
  const lengths = [];
  let total = 0;
  for (let i = 1; i < poly.length; i++) {
    const d = Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]);
    lengths.push(d);
    total += d;
  }
  let target = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < lengths.length; i++) {
    if (target <= lengths[i] || i === lengths.length - 1) {
      const f = lengths[i] ? target / lengths[i] : 0;
      return {
        x: poly[i][0] + (poly[i + 1][0] - poly[i][0]) * f,
        y: poly[i][1] + (poly[i + 1][1] - poly[i][1]) * f,
      };
    }
    target -= lengths[i];
  }
  const last = poly[poly.length - 1];
  return { x: last[0], y: last[1] };
}

export function buildBoard(cities, edges) {
  const cityById = new Map(cities.map((c) => [c.id, c]));
  const edgeById = new Map();
  const adj = new Map(cities.map((c) => [c.id, []]));

  for (const raw of edges) {
    const id = edgeId(raw.a, raw.b);
    if (edgeById.has(id)) throw new Error(`Kaksoisreitti: ${id}`);
    if (!cityById.has(raw.a) || !cityById.has(raw.b)) {
      throw new Error(`Tuntematon kaupunki reitillä ${id}`);
    }
    const edge = {
      ...raw,
      id,
      type: raw.type ?? 'land',
      fee: raw.type === 'sea' ? (raw.fee ?? SEA_FEE) : 0,
    };
    edge.poly = edgePolyline(edge, cityById);
    edgeById.set(id, edge);
    adj.get(raw.a).push(id);
    adj.get(raw.b).push(id);
  }

  return { cities, cityById, edges: [...edgeById.values()], edgeById, adj };
}

/** Yhden askeleen naapurit. fee peritään vain kun laivareitille astutaan kaupungista. */
export function stepsFrom(board, pos) {
  const out = [];
  if (pos.type === 'city') {
    for (const eid of board.adj.get(pos.city)) {
      const e = board.edgeById.get(eid);
      const other = e.a === pos.city ? e.b : e.a;
      if (e.steps === 1) {
        out.push({ pos: { type: 'city', city: other }, fee: e.fee });
      } else {
        const idx = e.a === pos.city ? 1 : e.steps - 1;
        out.push({ pos: { type: 'edge', edge: eid, idx }, fee: e.fee });
      }
    }
  } else {
    const e = board.edgeById.get(pos.edge);
    for (const dir of [-1, 1]) {
      const idx = pos.idx + dir;
      if (idx <= 0) out.push({ pos: { type: 'city', city: e.a }, fee: 0 });
      else if (idx >= e.steps) out.push({ pos: { type: 'city', city: e.b }, fee: 0 });
      else out.push({ pos: { type: 'edge', edge: e.id, idx }, fee: 0 });
    }
  }
  return out;
}

/**
 * Kaikki lailliset päätepisteet kun nopan silmäluku on `roll`.
 *
 * Kaupunkiin saa pysähtyä jo ennen kuin koko silmäluku on käytetty — tasalukua
 * ei siis tarvita. Reitin varrelle pysähdytään vain silloin, kun silmäluku
 * loppuu kesken. Kesken reitin ei saa kääntyä takaisin ja laivamatkat on
 * pystyttävä maksamaan.
 *
 * @returns {Map<string, {pos, cost, path}>}
 */
export function findMoves(board, start, roll, money = Infinity) {
  const results = new Map();
  const startKey = posKey(start);

  const record = (pos, spent, path) => {
    const key = posKey(pos);
    if (key === startKey) return; // omalle ruudulle ei jäädä
    const prev = results.get(key);
    if (!prev || spent < prev.cost) results.set(key, { pos, cost: spent, path });
  };

  const walk = (pos, remaining, spent, path, prevKey) => {
    // Kaupungissa matkan voi lopettaa vaikka silmälukua olisi jäljellä.
    if (path.length > 0 && (remaining === 0 || pos.type === 'city')) {
      record(pos, spent, path);
    }
    if (remaining === 0) return;
    for (const step of stepsFrom(board, pos)) {
      const key = posKey(step.pos);
      if (key === prevKey) continue; // ei peruutusta samaa reittiä
      const cost = spent + step.fee;
      if (cost > money) continue;
      walk(step.pos, remaining - 1, cost, [...path, step.pos], posKey(pos));
    }
  };

  walk(start, roll, 0, [], null);
  return results;
}

/** Onko pelaajalla ylipäätään laillisia siirtoja millään silmäluvulla. */
export function hasAnyMove(board, pos, money) {
  for (let die = 1; die <= 6; die++) {
    if (findMoves(board, pos, die, money).size > 0) return true;
  }
  return false;
}

/** Kaupungit, joihin sijainnista pääsee nykyisillä rahoilla (laivamaksut huomioiden). */
export function reachableCities(board, pos, money) {
  const seen = new Set();
  const queue = [];
  if (pos.type === 'city') {
    queue.push(pos.city);
  } else {
    // Reitin varrelta pääsee molempiin päihin ilman uutta maksua.
    const e = board.edgeById.get(pos.edge);
    queue.push(e.a, e.b);
  }
  for (const city of queue) seen.add(city);

  while (queue.length) {
    const city = queue.shift();
    for (const eid of board.adj.get(city)) {
      const e = board.edgeById.get(eid);
      if (e.fee > money) continue;
      const other = e.a === city ? e.b : e.a;
      if (!seen.has(other)) {
        seen.add(other);
        queue.push(other);
      }
    }
  }
  return seen;
}

/** Dijkstra askelina kaupungista kaikkiin kaupunkeihin. Laivareitit vain jos varaa. */
export function cityDistances(board, fromCity, money = Infinity) {
  const dist = new Map([[fromCity, 0]]);
  const queue = [[fromCity, 0]];
  while (queue.length) {
    queue.sort((x, y) => x[1] - y[1]);
    const [city, d] = queue.shift();
    if (d > (dist.get(city) ?? Infinity)) continue;
    for (const eid of board.adj.get(city)) {
      const e = board.edgeById.get(eid);
      if (e.fee > money) continue;
      const other = e.a === city ? e.b : e.a;
      const nd = d + e.steps;
      if (nd < (dist.get(other) ?? Infinity)) {
        dist.set(other, nd);
        queue.push([other, nd]);
      }
    }
  }
  return dist;
}

/** Sijainnin etäisyys valmiiksi lasketusta kaupunkietäisyyskartasta. */
export function distanceOf(board, pos, dist) {
  if (pos.type === 'city') return dist.get(pos.city) ?? Infinity;
  const e = board.edgeById.get(pos.edge);
  return Math.min(
    (dist.get(e.a) ?? Infinity) + pos.idx,
    (dist.get(e.b) ?? Infinity) + (e.steps - pos.idx),
  );
}

/** Sijainnin pikselikoordinaatit kartalla. */
export function pixelOf(board, pos) {
  if (pos.type === 'city') {
    const c = board.cityById.get(pos.city);
    return { x: c.x, y: c.y };
  }
  const e = board.edgeById.get(pos.edge);
  return pointAlong(e.poly, pos.idx / e.steps);
}
