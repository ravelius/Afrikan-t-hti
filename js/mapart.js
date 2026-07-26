// Aarrekartan grafiikka: pergamentti, käsin piirretty rannikko, aallot, maasto,
// kompassiruusu ja reunuskoristeet. Kaikki piirretään SVG:nä ilman kuvatiedostoja.

import { MAP } from './board.js';

const NS = 'http://www.w3.org/2000/svg';

// Paperi jatkuu reilusti pelialueen ulkopuolelle, jotta se täyttää ruudun
// näkymäikkunan (viewBox) muodosta riippumatta.
export const PAPER = { x: -700, y: -700, w: 2400, h: 2400 };

export function el(tag, attrs = {}, parent = null) {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  if (parent) parent.appendChild(node);
  return node;
}

/** Catmull–Rom-pehmennys: pisteistä sulava suljettu käyrä. */
function smoothClosedPath(points) {
  const n = points.length;
  const p = (i) => points[((i % n) + n) % n];
  let d = `M${p(0)[0]},${p(0)[1]}`;
  for (let i = 0; i < n; i++) {
    const [x0, y0] = p(i - 1);
    const [x1, y1] = p(i);
    const [x2, y2] = p(i + 1);
    const [x3, y3] = p(i + 2);
    const c1x = x1 + (x2 - x0) / 6;
    const c1y = y1 + (y2 - y0) / 6;
    const c2x = x2 - (x3 - x1) / 6;
    const c2y = y2 - (y3 - y1) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${x2},${y2}`;
  }
  return `${d} Z`;
}

export const AFRICA_PATH = smoothClosedPath(MAP.africaPoints);
export const MADAGASCAR_PATH = smoothClosedPath(MAP.madagascarPoints);

/** Suodattimet ja liukuvärit, joilla paperi ja mustejälki saavat elävän pinnan. */
export function drawDefs(svg) {
  const defs = el('defs', {}, svg);

  // Käsin piirretty vapina: kohina siirtää viivoja hieman.
  const rough = el('filter', { id: 'rough', x: '-8%', y: '-8%', width: '116%', height: '116%' }, defs);
  el('feTurbulence', {
    type: 'turbulence', baseFrequency: '0.017', numOctaves: 3, seed: 7, result: 'noise',
  }, rough);
  el('feDisplacementMap', {
    in: 'SourceGraphic', in2: 'noise', scale: 8,
    xChannelSelector: 'R', yChannelSelector: 'G',
  }, rough);

  const roughSoft = el('filter', {
    id: 'rough-soft', x: '-8%', y: '-8%', width: '116%', height: '116%',
  }, defs);
  el('feTurbulence', {
    type: 'turbulence', baseFrequency: '0.03', numOctaves: 2, seed: 19, result: 'noise',
  }, roughSoft);
  el('feDisplacementMap', {
    in: 'SourceGraphic', in2: 'noise', scale: 3.5,
    xChannelSelector: 'R', yChannelSelector: 'G',
  }, roughSoft);

  // Paperin kuitupinta.
  const grain = el('filter', { id: 'grain' }, defs);
  el('feTurbulence', {
    type: 'fractalNoise', baseFrequency: '0.8', numOctaves: 4, seed: 3, result: 'grain',
  }, grain);
  el('feColorMatrix', {
    type: 'matrix',
    values: '0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.22  0 0 0 0.3 0',
  }, grain);

  const paper = el('radialGradient', { id: 'paper-grad', cx: '50%', cy: '46%', r: '62%' }, defs);
  el('stop', { offset: '0%', 'stop-color': '#f6e7c6' }, paper);
  el('stop', { offset: '55%', 'stop-color': '#ecd8ae' }, paper);
  el('stop', { offset: '100%', 'stop-color': '#cfae79' }, paper);

  const land = el('linearGradient', { id: 'land-grad', x1: '0', y1: '0', x2: '0.4', y2: '1' }, defs);
  el('stop', { offset: '0%', 'stop-color': '#e7d2a4' }, land);
  el('stop', { offset: '100%', 'stop-color': '#d2b47e' }, land);

  const vignette = el('radialGradient', { id: 'vignette-grad', cx: '50%', cy: '50%', r: '62%' }, defs);
  el('stop', { offset: '52%', 'stop-color': 'rgba(90,60,25,0)' }, vignette);
  el('stop', { offset: '84%', 'stop-color': 'rgba(88,58,24,0.16)' }, vignette);
  el('stop', { offset: '100%', 'stop-color': 'rgba(66,41,15,0.42)' }, vignette);

  return defs;
}

/** Paperipohja ja hennot pituus- ja leveyspiirit. */
export function drawParchment(svg) {
  el('rect', { x: PAPER.x, y: PAPER.y, width: PAPER.w, height: PAPER.h, class: 'paper' }, svg);

  const grid = el('g', { class: 'graticule' }, svg);
  for (let x = -500; x < 1500; x += 125) {
    el('line', { x1: x, y1: PAPER.y, x2: x, y2: PAPER.y + PAPER.h }, grid);
  }
  for (let y = -500; y < 1500; y += 125) {
    el('line', { x1: PAPER.x, y1: y, x2: PAPER.x + PAPER.w, y2: y }, grid);
  }
}

/** Paperin rakeisuus ja tummuvat reunat piirretään päällimmäiseksi. */
export function drawPaperOverlay(svg) {
  el('rect', { x: PAPER.x, y: PAPER.y, width: PAPER.w, height: PAPER.h, class: 'grain' }, svg);
  el('rect', {
    x: PAPER.x, y: PAPER.y, width: PAPER.w, height: PAPER.h, class: 'vignette',
  }, svg);
}

/** Manner: rannikon kaikuviivat, täyttö ja mustepiirto. */
export function drawLand(svg) {
  const g = el('g', { class: 'landmass', filter: 'url(#rough)' }, svg);
  for (const d of [AFRICA_PATH, MADAGASCAR_PATH]) {
    el('path', { d, class: 'sea-echo sea-echo-1' }, g);
    el('path', { d, class: 'sea-echo sea-echo-2' }, g);
    el('path', { d, class: 'sea-echo sea-echo-3' }, g);
  }
  for (const d of [AFRICA_PATH, MADAGASCAR_PATH]) {
    el('path', { d, class: 'land' }, g);
    el('path', { d, class: 'coast' }, g);
  }
}

// --- geometria: missä on merta, missä tyhjää maata ------------------------

function pointInPolygon([px, py], poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    const hits = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (hits) inside = !inside;
  }
  return inside;
}

function distanceToPolygon([px, py], poly) {
  let best = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [x1, y1] = poly[j];
    const [x2, y2] = poly[i];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / len2));
    best = Math.min(best, Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy)));
  }
  return best;
}

const AFRICA = MAP.africaPoints;
const MADAGASCAR = MAP.madagascarPoints;

function onLand(p) {
  return pointInPolygon(p, AFRICA) || pointInPolygon(p, MADAGASCAR);
}

function coastDistance(p) {
  return Math.min(distanceToPolygon(p, AFRICA), distanceToPolygon(p, MADAGASCAR));
}

/** Ruudukon pisteet merellä, riittävän kaukana rannikosta. */
export function seaPoints(spacing = 92, margin = 46) {
  const points = [];
  for (let x = 30; x < MAP.width; x += spacing) {
    for (let y = 30; y < MAP.height; y += spacing) {
      const p = [x, y];
      if (onLand(p) || coastDistance(p) < margin) continue;
      points.push(p);
    }
  }
  return points;
}

/** Ruudukon pisteet maalla, riittävän kaukana rannikosta ja esteistä. */
export function landPoints(obstacles, spacing = 78, clearance = 34) {
  const points = [];
  for (let x = 40; x < MAP.width; x += spacing) {
    for (let y = 40; y < MAP.height; y += spacing) {
      const p = [x, y];
      if (!onLand(p) || coastDistance(p) < 34) continue;
      if (obstacles.some((o) => Math.hypot(p[0] - o.x, p[1] - o.y) < clearance)) continue;
      points.push(p);
    }
  }
  return points;
}

function blocked(p, zones) {
  return zones.some((z) => Math.hypot(p[0] - z.x, p[1] - z.y) < (z.r ?? 90));
}

/** Merelle piirretyt kaksoiskaaret, jotka merkitsevät aaltoja. */
export function drawWaves(svg, skipZones = []) {
  const g = el('g', { class: 'waves', filter: 'url(#rough-soft)' }, svg);
  seaPoints().forEach((p, i) => {
    if (i % 2 === 1 || blocked(p, skipZones)) return;
    const [x, y] = p;
    const w = 19 + (i % 3) * 4;
    el('path', { d: `M${x - w},${y} q${w / 2},-7 ${w},0 q${w / 2},7 ${w},0`, class: 'wave' }, g);
    el('path', {
      d: `M${x - w + 7},${y + 13} q${w / 2},-7 ${w},0 q${w / 2},7 ${w},0`,
      class: 'wave',
    }, g);
  });
}

/**
 * Maaston merkit vanhan kartan tapaan: pohjoisessa dyynejä, keskellä puita ja
 * etelässä vuoria. Piirretään vain kohtiin, joissa ei ole reittejä tai nimiä.
 */
export function drawTerrain(svg, obstacles) {
  const g = el('g', { class: 'terrain', filter: 'url(#rough-soft)' }, svg);
  landPoints(obstacles).forEach((p, i) => {
    if (i % 2 === 1) return;
    const [x, y] = p;
    if (y < 300) {
      el('path', {
        d: `M${x - 16},${y} q8,-9 16,0 M${x - 2},${y + 8} q8,-9 16,0`,
        class: 'terrain-mark',
      }, g);
    } else if (y < 640) {
      el('path', { d: `M${x},${y + 8} L${x},${y - 4}`, class: 'terrain-mark' }, g);
      el('path', {
        d: `M${x},${y - 4} q-11,-2 -13,-10 q9,1 13,7 q4,-6 13,-7 q-2,8 -13,10 z`,
        class: 'terrain-fill',
      }, g);
    } else {
      el('path', {
        d: `M${x - 15},${y + 8} l9,-14 l7,10 l6,-8 l8,12 z`,
        class: 'terrain-mark',
      }, g);
    }
  });
}

/** Kompassiruusu. */
export function drawCompass(svg, cx, cy, r = 62) {
  const g = el('g', { class: 'compass-rose', transform: `translate(${cx},${cy})` }, svg);
  el('circle', { r, class: 'compass' }, g);
  el('circle', { r: r * 0.72, class: 'compass' }, g);

  for (const angle of [0, 90, 180, 270]) {
    el('path', {
      d: `M0,${-r} L${r * 0.17},0 L0,${r * 0.17} L${-r * 0.17},0 Z`,
      class: 'compass-fill',
      transform: `rotate(${angle})`,
    }, g);
  }
  for (const angle of [45, 135, 225, 315]) {
    el('path', {
      d: `M0,${-r * 0.72} L${r * 0.09},0 L0,${r * 0.09} L${-r * 0.09},0 Z`,
      class: 'compass',
      transform: `rotate(${angle})`,
    }, g);
  }
  el('text', {
    x: 0, y: -r - 12, class: 'compass-letter', 'text-anchor': 'middle',
  }, g).textContent = 'N';
}

/** Onko piste mantereella (myös testien käytössä). */
export function isOnLand(point) {
  return onLand(point);
}

// --- laattojen kuvakkeet ---------------------------------------------------

/**
 * Piirtää laatan kuvakkeen ryhmään. Kuvat on suunniteltu ruutuun -12…12,
 * joten samaa kuvaketta voi käyttää kartalla ja paneelissa eri koossa.
 */
export function drawTokenIcon(parent, type) {
  const g = el('g', { class: `icon icon-${type}` }, parent);

  switch (type) {
    case 'star':
      el('path', {
        d: 'M0,-12 L3.5,-4 L12,-3.5 L5.6,2 L7.6,11 L0,6.4 L-7.6,11 L-5.6,2 L-12,-3.5 L-3.5,-4 Z',
        class: 'icon-star',
      }, g);
      break;

    case 'horseshoe':
      el('path', {
        d: 'M-8,10 L-8,-1 A8,9 0 0 1 8,-1 L8,10',
        class: 'icon-shoe',
      }, g);
      el('circle', { cx: -8, cy: 8, r: 1.7, class: 'icon-shoe-hole' }, g);
      el('circle', { cx: 8, cy: 8, r: 1.7, class: 'icon-shoe-hole' }, g);
      break;

    case 'robber':
      // Leveälierinen hattu ja silmänaamio.
      el('path', { d: 'M-12,-2 q12,-5 24,0 q-12,4 -24,0 z', class: 'icon-hat' }, g);
      el('path', { d: 'M-7,-2 q1,-8 7,-8 q6,0 7,8 z', class: 'icon-hat' }, g);
      el('path', { d: 'M-8,2 q8,-2 16,0 l0,4 q-8,2 -16,0 z', class: 'icon-mask' }, g);
      el('circle', { cx: -3.5, cy: 4, r: 1.4, class: 'icon-eye' }, g);
      el('circle', { cx: 3.5, cy: 4, r: 1.4, class: 'icon-eye' }, g);
      break;

    case 'empty':
      el('circle', { r: 9, class: 'icon-empty' }, g);
      el('path', { d: 'M-4,0 L4,0', class: 'icon-empty-line' }, g);
      break;

    default: {
      // Jalokivi: hiottu kanta ja särmät.
      el('path', {
        d: 'M-11,-3 L-6,-9 L6,-9 L11,-3 L0,10 Z',
        class: `icon-gem gem-${type}`,
      }, g);
      el('path', {
        d: 'M-11,-3 L11,-3 M-6,-9 L-3.5,-3 L0,10 M6,-9 L3.5,-3',
        class: 'icon-gem-facets',
      }, g);
    }
  }
  return g;
}

/** Sama kuvake itsenäisenä SVG:nä HTML-paneeleihin. */
export function tokenIconSvg(type, size = 18) {
  const svg = el('svg', {
    width: size,
    height: size,
    viewBox: '-13 -13 26 26',
    class: 'token-icon',
    role: 'img',
  });
  drawTokenIcon(svg, type);
  return svg;
}

/** Purjelaiva, meripeto ja karttaotsikko täyttämässä tyhjää merta. */
export function drawDoodles(svg) {
  const ship = el('g', { class: 'doodle-ship', transform: 'translate(214,548)' }, svg);
  el('path', { d: 'M-40,10 L40,10 L28,30 L-28,30 Z', class: 'doodle-fill' }, ship);
  el('path', { d: 'M-2,10 L-2,-48 M18,10 L18,-30', class: 'doodle' }, ship);
  el('path', { d: 'M0,-46 q26,16 0,30 z', class: 'doodle-fill' }, ship);
  el('path', { d: 'M20,-28 q18,12 0,22 z', class: 'doodle-fill' }, ship);
  el('path', { d: 'M-52,38 q13,9 26,0 M18,38 q13,9 26,0', class: 'doodle' }, ship);

  const serpent = el('g', { class: 'doodle-serpent', transform: 'translate(852,902)' }, svg);
  el('path', {
    d: 'M-78,14 q14,-30 30,-2 q10,18 22,0 q10,-16 22,-2',
    class: 'doodle',
  }, serpent);
  el('path', {
    d: 'M-4,10 q14,-22 34,-16 q-8,7 -6,16 q-12,6 -28,0 z',
    class: 'doodle-fill',
  }, serpent);
  el('path', { d: 'M-86,10 q-10,6 -6,16 q8,-4 8,-12', class: 'doodle-fill' }, serpent);

  const title = el('g', { class: 'map-title-group', transform: 'translate(886,96)' }, svg);
  el('text', {
    x: 0, y: 0, class: 'map-title', 'text-anchor': 'middle', 'font-size': 34,
  }, title).textContent = 'AFRIKA';
  el('path', { d: 'M-80,14 L80,14 M-58,22 L58,22', class: 'doodle' }, title);
}
