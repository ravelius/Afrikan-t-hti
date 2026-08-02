// Aarrekartan grafiikka: pergamentti, käsin piirretty rannikko, aallot, maasto,
// kompassiruusu ja reunuskoristeet. Kaikki piirretään SVG:nä ilman kuvatiedostoja.
//
// Piirto ei tiedä mitään yksittäisestä laudasta: rannikot tulevat paketin
// map.outlines-listasta ja koristeet paketin decor-osiosta.

const NS = 'http://www.w3.org/2000/svg';

// Paperi jatkuu reilusti pelialueen ulkopuolelle, jotta se täyttää ruudun
// näkymäikkunan (viewBox) muodosta riippumatta.
// Pergamentti ulottuu selvästi laudan ulkopuolelle: kapealla pystyruudulla
// näkymä on paljon lautaa korkeampi, ja liian pieni arkki jätti alalaitaan
// tumman kaistan.
export const PAPER = { x: -1200, y: -1200, w: 3600, h: 3600 };

/**
 * Deterministinen 0–1 -arvo merkkijonosta (FNV-1a). Sama piirre saa aina saman
 * pienen poikkeaman, joten kartta näyttää käsin piirretyltä mutta ei väreile.
 */
export function hash01(key) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100003) / 100003;
}

/** Symmetrinen poikkeama välillä ±amount. */
export function vary(key, amount) {
  return (hash01(key) - 0.5) * 2 * amount;
}

export function el(tag, attrs = {}, parent = null) {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  if (parent) parent.appendChild(node);
  return node;
}

/*
 * KÄSIN PIIRRETTY HEILUNTA ILMAN SUODATINTA
 *
 * Rannikko, aallot ja maasto heiluivat ennen feTurbulence +
 * feDisplacementMap -suodattimella (#rough ja #rough-soft). Se näytti
 * hyvältä mutta hajosi iOS:n webapp-tilassa: kun sovellus kävi taustalla
 * ja palasi, juuri suodatetut kerrokset tulivat takaisin TYHJINÄ — maa,
 * rannikko, meren kaiut ja aallot katosivat, ja jäljelle jäi paljas
 * paperi. Omistajalla vika toistui joka kerta (kuvakaappaus 2.8.2026).
 *
 * Suodatin tarvitsee oman piirtopuskurin, jonka koko seuraa kerroksen
 * rajauslaatikkoa ja zoomia. Mannerkerros on kartan suurin, ja
 * lähikuvassa sen puskuri kasvaa moninkertaiseksi; iOS vapauttaa
 * taustalle jääneen sovelluksen puskurit eikä ilmeisesti saa tuota
 * kokoa enää varattua. v158 yritti herättää kerrokset irrottamalla ja
 * liittämällä suodatinviitteen takaisin — se ei auttanut, koska ongelma
 * ei ole vanhentunut viite vaan puuttuva puskuri.
 *
 * Sama jälki syntyy siirtämällä pisteitä itse. Kohina lasketaan kerran
 * piirrossa eikä joka ruudunpäivityksellä, joten puskuria ei tarvita
 * lainkaan — eikä ole mitään mitä menettää.
 */

/**
 * Pehmeä pseudokohina paikan mukaan, -1…1. Sama piste saa aina saman
 * arvon ja lähekkäiset pisteet lähes saman, joten viiva aaltoilee
 * loivasti kuin käsi olisi vapissut — ei tärise pisteestä toiseen.
 *
 * Solun koko vastaa vanhan suodattimen aallonpituutta: baseFrequency
 * 0.017 tarkoittaa noin 59 yksikön jaksoa.
 */
const KOHINA_SOLU = 58;

export function kohina(x, y, siemen) {
  const gx = Math.floor(x / KOHINA_SOLU);
  const gy = Math.floor(y / KOHINA_SOLU);
  const fx = x / KOHINA_SOLU - gx;
  const fy = y / KOHINA_SOLU - gy;
  // Kuutiollinen pehmennys, jottei solujen raja näy viivassa taitteena.
  const s = (t) => t * t * (3 - 2 * t);
  const ux = s(fx);
  const uy = s(fy);
  const n = (ix, iy) => hash01(`${siemen}:${ix}:${iy}`) - 0.5;
  const ylä = n(gx, gy) * (1 - ux) + n(gx + 1, gy) * ux;
  const ala = n(gx, gy + 1) * (1 - ux) + n(gx + 1, gy + 1) * ux;
  return (ylä * (1 - uy) + ala * uy) * 2;
}

/**
 * Siirtää pistejonon pisteitä kohinan verran. Vanha suodatin siirsi
 * scale 8:lla eli enintään ±4 yksikköä; sama määrä tässä.
 */
export function kasinPiirretty(points, maara = 4) {
  return points.map(([x, y]) => [
    Number((x + kohina(x, y, 'kasi-x') * maara).toFixed(1)),
    Number((y + kohina(x, y, 'kasi-y') * maara).toFixed(1)),
  ]);
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

// Pehmeiksi käyriksi lasketut rannikot muistetaan karttakohtaisesti.
const outlineCache = new WeakMap();

function outlinePaths(map) {
  let paths = outlineCache.get(map);
  if (!paths) {
    // Heilunta lasketaan pisteisiin ennen pehmennystä, jolloin käyrä
    // kaartaa siirtyneiden pisteiden kautta eikä vain väpätä paikallaan.
    paths = map.outlines.map((o) => smoothClosedPath(kasinPiirretty(o)));
    outlineCache.set(map, paths);
  }
  return paths;
}

/** Suodattimet ja liukuvärit, joilla paperi ja mustejälki saavat elävän pinnan. */
// Rakeisuuslaatan koko laudan koordinaateissa. Riittävän suuri, ettei
// toisto erotu, ja riittävän pieni, että laatta pysyy kevyenä.
const GRAIN_TILE = 160;
let grainTileUrl = null;

/**
 * Piirtää paperin kuituhäiriön kerran canvakselle ja palauttaa sen
 * data-osoitteena. Sävy ja voimakkuus vastaavat vanhaa feTurbulence-
 * suodatinta: ruskea (0.45, 0.36, 0.22) ja alfa 0.3 kohinan mukaan.
 *
 * Kohina lasketaan kolmella oktaavilla, jotta pinta on samalla tavalla
 * pehmeän epätasainen kuin fractalNoise eikä pelkkää valkoista kohinaa.
 */
function grainTile() {
  if (grainTileUrl) return grainTileUrl;
  const koko = 256; // laatan tarkkuus pikseleinä
  const canvas = document.createElement('canvas');
  canvas.width = koko;
  canvas.height = koko;
  const ctx = canvas.getContext('2d');
  const kuva = ctx.createImageData(koko, koko);

  // Toistuva kohina: arvo lasketaan hilasta, joka kiertää laatan reunan yli,
  // jotta saumaa ei näy.
  const oktaavi = (x, y, jako, siemen) => {
    const gx = Math.floor(x / jako);
    const gy = Math.floor(y / jako);
    const fx = (x / jako) - gx;
    const fy = (y / jako) - gy;
    const solmu = (ix, iy) => {
      const kx = ((ix % (koko / jako)) + (koko / jako)) % (koko / jako);
      const ky = ((iy % (koko / jako)) + (koko / jako)) % (koko / jako);
      return hash01(`grain:${siemen}:${kx}:${ky}`);
    };
    // Pehmennyskäyrä, jotta hilan solmut eivät näy ruudukkona.
    const u = fx * fx * (3 - 2 * fx);
    const v = fy * fy * (3 - 2 * fy);
    const a = solmu(gx, gy);
    const b = solmu(gx + 1, gy);
    const c = solmu(gx, gy + 1);
    const d = solmu(gx + 1, gy + 1);
    return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
  };

  for (let y = 0; y < koko; y++) {
    for (let x = 0; x < koko; x++) {
      const n = oktaavi(x, y, 2, 'a') * 0.55
        + oktaavi(x, y, 4, 'b') * 0.3
        + oktaavi(x, y, 8, 'c') * 0.15;
      const i = (y * koko + x) * 4;
      kuva.data[i] = 115;      // 0.45 * 255
      kuva.data[i + 1] = 92;   // 0.36 * 255
      kuva.data[i + 2] = 56;   // 0.22 * 255
      kuva.data[i + 3] = Math.round(n * 0.3 * 255);
    }
  }
  ctx.putImageData(kuva, 0, 0);
  grainTileUrl = canvas.toDataURL('image/png');
  return grainTileUrl;
}

export function drawDefs(svg) {
  const defs = el('defs', {}, svg);

  /*
   * Tässä oli myös #rough, joka antoi rannikolle käsin piirretyn
   * vapinan. Se on poistettu: iOS:n webapp-tilassa suodatettu kerros
   * palasi taustalta TYHJÄNÄ ja koko meri katosi kartalta. Rannikon,
   * aaltojen ja maaston heilunta piirretään nyt pisteisiin (kohina ja
   * kasinPiirretty ylempänä), jolloin piirtopuskuria ei tarvita
   * lainkaan eikä ole mitään mitä menettää.
   *
   * #rough-soft jää, koska reittikerros (js/ui.js) käyttää sitä yhä.
   * Reitit näkyivät omistajan kuvassa oikein silloinkin kun maa oli
   * kadonnut, eikä toimivaa kannata rikkoa: reittiviivat kulkevat
   * kaupungista kaupunkiin usein suorana, ja ilman suodatinta niistä
   * tulisi viivoittimella vedettyjä.
   *
   * HUOM: jos tämän joskus poistaa, poista samalla viittaus ui.js:stä.
   * Puuttuvaan suodattimeen viittaava ryhmä ei piirry lainkaan, joten
   * pelkkä määrittelyn poisto veisi kaikki reitit kartalta.
   */
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

  // Paperin kuitupinta laattana. Aiemmin tämä oli feTurbulence-suodatin,
  // joka peitti koko ruudun ja sekoittui multiplyllä kaiken päälle. Se
  // maksoi mittausten mukaan koko pelin ruudunpäivityksen: selain joutui
  // laskemaan kohinan ja sekoituksen uudelleen joka kerta kun mikä tahansa
  // sen alla liikkui — 15 fps pysyvästi, myös silloin kun mitään ei
  // tapahtunut. Kohina on staattista, joten se piirretään kerran laataksi
  // ja toistetaan kuviona. Ulkonäkö on sama, hinta nolla.
  const kuvio = el('pattern', {
    id: 'grain-kuvio',
    patternUnits: 'userSpaceOnUse',
    width: GRAIN_TILE,
    height: GRAIN_TILE,
  }, defs);
  el('image', {
    href: grainTile(),
    x: 0,
    y: 0,
    width: GRAIN_TILE,
    height: GRAIN_TILE,
  }, kuvio);

  const paper = el('radialGradient', { id: 'paper-grad', cx: '50%', cy: '46%', r: '62%' }, defs);
  el('stop', { offset: '0%', 'stop-color': '#f6e7c6' }, paper);
  el('stop', { offset: '55%', 'stop-color': '#ecd8ae' }, paper);
  el('stop', { offset: '100%', 'stop-color': '#cfae79' }, paper);

  const land = el('linearGradient', { id: 'land-grad', x1: '0', y1: '0', x2: '0.4', y2: '1' }, defs);
  el('stop', { offset: '0%', 'stop-color': '#e7d2a4' }, land);
  el('stop', { offset: '100%', 'stop-color': '#d2b47e' }, land);

  const vignette = el('radialGradient', { id: 'vignette-grad', cx: '50%', cy: '50%', r: '62%' }, defs);
  el('stop', { offset: '52%', 'stop-color': 'rgba(90,60,25,0)' }, vignette);
  el('stop', { offset: '84%', 'stop-color': 'rgba(88,58,24,0.07)' }, vignette);
  el('stop', { offset: '100%', 'stop-color': 'rgba(66,41,15,0.16)' }, vignette);

  return defs;
}

/** Paperipohja ja hennot pituus- ja leveyspiirit. */
export function drawParchment(svg) {
  el('rect', { x: PAPER.x, y: PAPER.y, width: PAPER.w, height: PAPER.h, class: 'paper' }, svg);

  const grid = el('g', { class: 'graticule' }, svg);
  for (let x = -1200; x < 2400; x += 125) {
    el('line', {
      x1: x + vary(`grid:v:${x}`, 2), y1: PAPER.y,
      x2: x + vary(`grid:v2:${x}`, 2), y2: PAPER.y + PAPER.h,
      opacity: (0.7 + hash01(`grid:vo:${x}`) * 0.6).toFixed(2),
    }, grid);
  }
  for (let y = -1200; y < 2400; y += 125) {
    el('line', {
      x1: PAPER.x, y1: y + vary(`grid:h:${y}`, 2),
      x2: PAPER.x + PAPER.w, y2: y + vary(`grid:h2:${y}`, 2),
      opacity: (0.7 + hash01(`grid:ho:${y}`) * 0.6).toFixed(2),
    }, grid);
  }
}

/** Paperin rakeisuus ja tummuvat reunat piirretään päällimmäiseksi. */
export function drawPaperOverlay(svg) {
  el('rect', {
    x: PAPER.x, y: PAPER.y, width: PAPER.w, height: PAPER.h,
    class: 'grain', fill: 'url(#grain-kuvio)',
  }, svg);
  el('rect', {
    x: PAPER.x, y: PAPER.y, width: PAPER.w, height: PAPER.h, class: 'vignette',
  }, svg);
}

/** Manner: rannikon kaikuviivat, täyttö ja mustepiirto. */
export function drawLand(svg, map) {
  const paths = outlinePaths(map);
  const g = el('g', { class: 'landmass' }, svg);
  for (const d of paths) {
    el('path', { d, class: 'sea-echo sea-echo-1' }, g);
    el('path', { d, class: 'sea-echo sea-echo-2' }, g);
    el('path', { d, class: 'sea-echo sea-echo-3' }, g);
  }
  for (const d of paths) {
    el('path', { d, class: 'land' }, g);
    el('path', { d, class: 'coast' }, g);
  }
  for (const lake of map.lakes ?? []) {
    const d = smoothClosedPath(kasinPiirretty(lake));
    el('path', { d, class: 'lake' }, g);
    el('path', { d, class: 'coast' }, g);
  }
  // Maiden rajat hyvin hennolla katkoviivalla — koriste, ei pelielementti.
  // Sama heilunta kuin rannikolla antaa käsin piirretyn vaikutelman.
  for (const line of map.borders ?? []) {
    const d = `M${kasinPiirretty(line).map(([x, y]) => `${x},${y}`).join(' L')}`;
    el('path', { d, class: 'border' }, g);
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

function onLand(p, map) {
  if (!map.outlines.some((outline) => pointInPolygon(p, outline))) return false;
  // Järvet ovat vettä maan sisällä (map.lakes) — esimerkiksi Saimaa tai Inari.
  return !(map.lakes ?? []).some((lake) => pointInPolygon(p, lake));
}

function coastDistance(p, map) {
  const shores = [...map.outlines, ...(map.lakes ?? [])];
  return shores.reduce((best, outline) => Math.min(best, distanceToPolygon(p, outline)), Infinity);
}

/** Ruudukon pisteet merellä, riittävän kaukana rannikosta. */
export function seaPoints(map, spacing = 92, margin = 46) {
  const points = [];
  for (let x = 30; x < map.width; x += spacing) {
    for (let y = 30; y < map.height; y += spacing) {
      const p = [x, y];
      if (onLand(p, map) || coastDistance(p, map) < margin) continue;
      points.push(p);
    }
  }
  return points;
}

/** Ruudukon pisteet maalla, riittävän kaukana rannikosta ja esteistä. */
export function landPoints(map, obstacles, spacing = 78, clearance = 34) {
  const points = [];
  for (let x = 40; x < map.width; x += spacing) {
    for (let y = 40; y < map.height; y += spacing) {
      const p = [x, y];
      if (!onLand(p, map) || coastDistance(p, map) < 34) continue;
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
export function drawWaves(svg, map, skipZones = []) {
  // Ei suodatinta: aaltomerkit vaihtelevat jo paikaltaan, kooltaan,
  // kallistukseltaan ja tummuudeltaan, joten suodattimen lisäämä ±1,75
  // yksikön väre ei niissä juuri näkynyt — mutta sen puskuri katosi.
  const g = el('g', { class: 'waves' }, svg);
  seaPoints(map).forEach((p, i) => {
    if (i % 2 === 1 || blocked(p, skipZones)) return;
    const key = `wave:${p[0]}:${p[1]}`;
    const x = p[0] + vary(`${key}:x`, 9);
    const y = p[1] + vary(`${key}:y`, 7);
    const w = 17 + hash01(`${key}:w`) * 9;
    const lift = 5 + hash01(`${key}:l`) * 4;
    const tilt = vary(`${key}:r`, 5);
    const wave = el('g', {
      transform: `rotate(${tilt.toFixed(2)} ${x.toFixed(1)} ${y.toFixed(1)})`,
      opacity: (0.75 + hash01(`${key}:o`) * 0.45).toFixed(2),
    }, g);
    el('path', {
      d: `M${x - w},${y} q${w / 2},${-lift} ${w},0 q${w / 2},${lift} ${w},0`,
      class: 'wave',
    }, wave);
    el('path', {
      d: `M${x - w + 7},${y + 11 + lift} q${w / 2},${-lift} ${w},0 q${w / 2},${lift} ${w},0`,
      class: 'wave',
    }, wave);
  });
}

// Yksittäisten maastomerkkien piirto: dyynit, puu ja vuoret.
const TERRAIN_MARKS = {
  dunes(mark, x, y) {
    el('path', {
      d: `M${x - 16},${y} q8,-9 16,0 M${x - 2},${y + 8} q8,-9 16,0`,
      class: 'terrain-mark',
    }, mark);
  },
  trees(mark, x, y) {
    el('path', { d: `M${x},${y + 8} L${x},${y - 4}`, class: 'terrain-mark' }, mark);
    el('path', {
      d: `M${x},${y - 4} q-11,-2 -13,-10 q9,1 13,7 q4,-6 13,-7 q-2,8 -13,10 z`,
      class: 'terrain-fill',
    }, mark);
  },
  mountains(mark, x, y) {
    el('path', {
      d: `M${x - 15},${y + 8} l9,-14 l7,10 l6,-8 l8,12 z`,
      class: 'terrain-mark',
    }, mark);
  },
  // Kaupunkilaudan korttelit: kaksi pientä taloa harjakattoineen.
  houses(mark, x, y) {
    el('path', {
      d: `M${x - 13},${y + 7} L${x - 13},${y - 1} L${x - 7},${y - 7} L${x - 1},${y - 1} L${x - 1},${y + 7} Z`,
      class: 'terrain-mark',
    }, mark);
    el('path', {
      d: `M${x + 3},${y + 7} L${x + 3},${y + 1} L${x + 8},${y - 4} L${x + 13},${y + 1} L${x + 13},${y + 7} Z`,
      class: 'terrain-mark',
    }, mark);
  },
};

/**
 * Maaston merkit vanhan kartan tapaan. Merkin laji valitaan paketin
 * leveysvyöhykkeistä (decor.terrainBands), ja merkit piirretään vain kohtiin,
 * joissa ei ole reittejä tai nimiä.
 */
export function drawTerrain(svg, map, obstacles, bands) {
  // Ei suodatinta, ks. drawWaves: merkeillä on jo oma vaihtelunsa.
  const g = el('g', { class: 'terrain' }, svg);
  landPoints(map, obstacles).forEach((p, i) => {
    if (i % 2 === 1) return;
    const key = `terrain:${p[0]}:${p[1]}`;
    const x = p[0] + vary(`${key}:x`, 8);
    const y = p[1] + vary(`${key}:y`, 6);
    const mark = el('g', {
      transform: `rotate(${vary(`${key}:r`, 6).toFixed(2)} ${x.toFixed(1)} ${y.toFixed(1)}) `
        + `scale(${(0.88 + hash01(`${key}:s`) * 0.3).toFixed(2)})`,
      opacity: (0.8 + hash01(`${key}:o`) * 0.4).toFixed(2),
      'transform-origin': `${x.toFixed(1)}px ${y.toFixed(1)}px`,
    }, g);
    const band = bands.find((b) => y < b.maxY) ?? bands[bands.length - 1];
    (TERRAIN_MARKS[band.kind] ?? TERRAIN_MARKS.mountains)(mark, x, y);
  });
}

/** Kompassiruusu. */
/**
 * Pallonpuoliskokartan kehykset: 1600-luvun maailmankartoissa kumpikin
 * puolisko piirrettiin kaksoiskehän sisään, jonka väliin merkittiin asteet.
 * Sisään piirretään asteverkko — stereografisessa projektiossa sekä
 * pituus- että leveyspiirit ovat ympyränkaaria, mutta tässä riittää
 * kaarien approksimointi murtoviivalla samasta projektiokaavasta.
 */
/** Murtoviiva SVG-poluksi. */
function linePath(points) {
  return points
    .map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join('');
}

export function drawHemisphereFrames(svg, map) {
  const kehat = map.hemispheres ?? [];
  const navat = map.polars ?? [];
  if (!kehat.length && !navat.length) return;
  // Ei suodatinta. Kehykset ovat laskettuja ympyröitä ja kaaria, joten
  // heilunta piirretään niihin itseensä — muuten 1600-luvun kartasta
  // tulisi harpilla vedetty.
  const g = el('g', { class: 'hemi-frames' }, svg);
  const kehaPolku = (r, siemen) => wobblyCircle(r, siemen, 2.2, 72);

  const RAD = Math.PI / 180;
  // Sama kaava kuin tools/hemispheres.mjs — pidettävä yhtenäisenä.
  const project = ({ cx, cy, r, lon0 }) => (lon, lat) => {
    let d = lon - lon0;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    const k = r / (1 + Math.cos(lat * RAD) * Math.cos(d * RAD));
    return [cx + k * Math.cos(lat * RAD) * Math.sin(d * RAD), cy - k * Math.sin(lat * RAD)];
  };

  for (const kehä of kehat) {
    const { cx, cy, r } = kehä;
    const f = project(kehä);

    // Asteverkko: pituuspiirit 30° välein, leveyspiirit 30° välein.
    const verkko = el('g', { class: 'graticule' }, g);
    for (let lon = -180; lon < 180; lon += 30) {
      const pts = [];
      for (let lat = -88; lat <= 88; lat += 4) {
        const d = ((lon - kehä.lon0 + 540) % 360) - 180;
        if (Math.abs(d) > 89.5) continue;
        pts.push(f(lon, lat));
      }
      if (pts.length > 1) {
        el('path', { d: linePath(kasinPiirretty(pts, 1.8)), class: 'graticule-line' }, verkko);
      }
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts = [];
      for (let d = -89.5; d <= 89.5; d += 3) pts.push(f(kehä.lon0 + d, lat));
      el('path', { d: linePath(kasinPiirretty(pts, 1.8)), class: 'graticule-line' }, verkko);
    }
    // Päiväntasaaja hieman vahvempana.
    const eq = [];
    for (let d = -89.5; d <= 89.5; d += 3) eq.push(f(kehä.lon0 + d, 0));
    el('path', { d: linePath(kasinPiirretty(eq, 1.8)), class: 'graticule-line strong' }, verkko);

    // Kaksoiskehä ja astepykälät väliin.
    el('path', {
      d: kehaPolku(r + 13, `hemi:${cx}:ulko`), transform: `translate(${cx},${cy})`,
      class: 'hemi-ring outer',
    }, g);
    el('path', {
      d: kehaPolku(r, `hemi:${cx}:sisa`), transform: `translate(${cx},${cy})`,
      class: 'hemi-ring',
    }, g);
    const ticks = el('g', { class: 'hemi-ticks' }, g);
    for (let a = 0; a < 360; a += 5) {
      const rad = a * RAD;
      const iso = a % 15 === 0;
      const r1 = r + (iso ? 1 : 5);
      const r2 = r + 12;
      el('path', {
        d: `M${(cx + r1 * Math.cos(rad)).toFixed(1)},${(cy + r1 * Math.sin(rad)).toFixed(1)}`
          + `L${(cx + r2 * Math.cos(rad)).toFixed(1)},${(cy + r2 * Math.sin(rad)).toFixed(1)}`,
        class: 'hemi-tick',
      }, ticks);
    }
  }

  // Napaympyrät: yksinkertaisempi kehä ja säteittäinen verkko.
  for (const napa of navat) {
    const { cx, cy, r } = napa;
    const verkko = el('g', { class: 'graticule' }, g);
    for (let a = 0; a < 360; a += 30) {
      const rad = a * RAD;
      el('path', {
        d: `M${cx},${cy}L${(cx + r * Math.cos(rad)).toFixed(1)},${(cy + r * Math.sin(rad)).toFixed(1)}`,
        class: 'graticule-line',
      }, verkko);
    }
    for (const osa of [0.34, 0.67]) {
      el('path', {
        d: kehaPolku(r * osa, `napa:${cx}:${osa}`), transform: `translate(${cx},${cy})`,
        class: 'graticule-line', fill: 'none',
      }, verkko);
    }
    el('path', {
      d: kehaPolku(r + 9, `napa:${cx}:ulko`), transform: `translate(${cx},${cy})`,
      class: 'hemi-ring outer',
    }, g);
    el('path', {
      d: kehaPolku(r, `napa:${cx}:sisa`), transform: `translate(${cx},${cy})`,
      class: 'hemi-ring',
    }, g);
  }
}

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
export function isOnLand(point, map) {
  return onLand(point, map);
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

// --- aarteen paljastus: käsin piirretty laatta ------------------------------

/** Käsin piirretyn näköinen ympyrä: säde heittelee hieman kulman mukaan. */
function wobblyCircle(radius, seed, amount = 2.4, steps = 46) {
  const pts = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const r = radius + vary(`${seed}:${i}`, amount) + Math.sin(a * 3 + radius) * amount * 0.25;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return `${pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ')} Z`;
}

/**
 * Iso pelilaatta paljastusanimaatioon. Kaikki viivat on piirretty kevyesti
 * heittelehtivinä, ja mustepinta saa saman rosoisuussuodattimen kuin kartta.
 * @param {'back'|'front'} side kumpi puoli
 * @param {string} [type] laattatyyppi etupuolelle
 */
export function revealFaceSvg(side, type) {
  const svg = el('svg', {
    viewBox: '-100 -100 200 200',
    class: `reveal-svg reveal-${side}-art`,
    role: 'img',
    'aria-hidden': 'true',
  });

  const defs = el('defs', {}, svg);
  const rough = el('filter', {
    id: `reveal-rough-${side}`, x: '-12%', y: '-12%', width: '124%', height: '124%',
  }, defs);
  el('feTurbulence', {
    type: 'turbulence', baseFrequency: '0.021', numOctaves: 3, seed: side === 'back' ? 5 : 12,
    result: 'noise',
  }, rough);
  el('feDisplacementMap', {
    in: 'SourceGraphic', in2: 'noise', scale: 3.4, xChannelSelector: 'R', yChannelSelector: 'G',
  }, rough);

  const paper = el('radialGradient', { id: `reveal-paper-${side}`, cx: '38%', cy: '32%' }, defs);
  el('stop', { offset: '0%', 'stop-color': '#f8ecd0' }, paper);
  el('stop', { offset: '58%', 'stop-color': '#ecd8ab' }, paper);
  el('stop', { offset: '100%', 'stop-color': '#cfae76' }, paper);

  const g = el('g', { filter: `url(#reveal-rough-${side})` }, svg);

  // Laatan pohja ja kaksi käsin vedettyä kehää.
  el('path', {
    d: wobblyCircle(92, `${side}-disc`, 2.6),
    fill: `url(#reveal-paper-${side})`,
    class: 'reveal-disc-body',
  }, g);
  el('path', { d: wobblyCircle(88, `${side}-ring1`, 1.8), class: 'reveal-ring' }, g);
  el('path', { d: wobblyCircle(80, `${side}-ring2`, 2.2), class: 'reveal-ring thin' }, g);

  // Reunan viivoitus antaa piirretyn syvyyden.
  const ticks = el('g', { class: 'reveal-ticks' }, g);
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2 + vary(`${side}-tick-a${i}`, 0.03);
    const inner = 80 + vary(`${side}-tick-i${i}`, 1.5);
    const outer = inner + 4.5 + vary(`${side}-tick-o${i}`, 1.6);
    el('path', {
      d: `M${(Math.cos(a) * inner).toFixed(2)},${(Math.sin(a) * inner).toFixed(2)} `
        + `L${(Math.cos(a) * outer).toFixed(2)},${(Math.sin(a) * outer).toFixed(2)}`,
    }, ticks);
  }

  if (side === 'back') {
    // Kääntöpuoli: ristiviivoitus ja käsin piirretty kysymysmerkki.
    const hatch = el('g', { class: 'reveal-hatch' }, g);
    for (let i = -7; i <= 7; i++) {
      const off = i * 11 + vary(`hatch${i}`, 1.4);
      const len = Math.sqrt(Math.max(0, 76 * 76 - off * off));
      el('path', {
        d: `M${(-len).toFixed(1)},${off.toFixed(1)} L${len.toFixed(1)},${(off + vary(`hatch-e${i}`, 1.6)).toFixed(1)}`,
        transform: 'rotate(28)',
      }, hatch);
    }
    el('text', {
      x: 0, y: 30, class: 'reveal-mark', 'text-anchor': 'middle',
      transform: `rotate(${vary('mark', 3).toFixed(2)})`,
    }, g).textContent = '?';
  } else {
    // Etupuoli: aarteen kuvake samalla piirrostyylillä kuin kartalla.
    const icon = el('g', { transform: 'scale(4.6)' }, g);
    drawTokenIcon(icon, type);
  }
  return svg;
}

/** Käsin piirretyt sädeviivat paljastuksen taustalle. */
export function revealRaysSvg() {
  const svg = el('svg', {
    viewBox: '-100 -100 200 200', class: 'reveal-rays', 'aria-hidden': 'true',
  });
  const g = el('g', {}, svg);
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2 + vary(`ray${i}`, 0.05);
    const inner = 52 + vary(`ray-i${i}`, 4);
    const outer = 78 + vary(`ray-o${i}`, 16);
    el('path', {
      d: `M${(Math.cos(a) * inner).toFixed(1)},${(Math.sin(a) * inner).toFixed(1)} `
        + `L${(Math.cos(a) * outer).toFixed(1)},${(Math.sin(a) * outer).toFixed(1)}`,
      'stroke-width': (1 + hash01(`ray-w${i}`) * 1.6).toFixed(2),
    }, g);
  }
  return svg;
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
/**
 * Maamerkkien piirrokset. Samaa mustetyyliä kuin purjelaiva ja meripeto:
 * ohut viiva, muutama täytetty pinta, ei yksityiskohtia. Jokainen piirtyy
 * origon ympärille, jotta sijoitus on pelkkä siirto.
 */
const LANDMARKS = {
  // Giza: kolme pyramidia rivissä, takimmainen pienempänä syvyyden vuoksi.
  pyramids: (g) => {
    el('path', { d: 'M-26,14 L-9,-16 L8,14 Z', class: 'doodle-fill' }, g);
    el('path', { d: 'M2,14 L15,-8 L28,14 Z', class: 'doodle-fill' }, g);
    el('path', { d: 'M20,14 L28,1 L36,14 Z', class: 'doodle-fill' }, g);
    // Hiekan viiva jalustan alla sitoo ryhmän maahan.
    el('path', { d: 'M-32,16 q32,6 70,0', class: 'doodle' }, g);
  },
  // Pöytävuori: litteä laki ja jyrkät reunat, päällä pöytäliinapilvi.
  tablemountain: (g) => {
    el('path', { d: 'M-30,16 L-22,-8 L22,-8 L30,16 Z', class: 'doodle-fill' }, g);
    el('path', { d: 'M-24,-12 q10,-7 24,-4 q12,3 22,2', class: 'doodle' }, g);
    el('path', { d: 'M-30,16 q30,5 60,0', class: 'doodle' }, g);
  },
  // Kilimandžaro: leveä kartio, jonka laki on lumessa.
  snowpeak: (g) => {
    el('path', { d: 'M-30,16 L0,-20 L30,16 Z', class: 'doodle' }, g);
    el('path', { d: 'M-12,-6 L0,-20 L12,-6 q-12,5 -24,0 z', class: 'doodle-fill' }, g);
    el('path', { d: 'M-30,16 q30,5 60,0', class: 'doodle' }, g);
  },
  // Akropolis: pylväsrivi ja päätykolmio kalliokukkulan päällä.
  acropolis: (g) => {
    el('path', { d: 'M-34,18 q34,-9 68,0', class: 'doodle' }, g);
    el('path', { d: 'M-26,4 L0,-14 L26,4 Z', class: 'doodle-fill' }, g);
    el('path', { d: 'M-26,4 L26,4', class: 'doodle' }, g);
    for (const x of [-20, -10, 0, 10, 20]) {
      el('path', { d: `M${x},6 L${x},16`, class: 'doodle' }, g);
    }
    el('path', { d: 'M-24,16 L24,16', class: 'doodle' }, g);
  },
  // Colosseum: soikea kehä kahdessa kaarikerroksessa, toinen laita murtunut.
  colosseum: (g) => {
    // Ääriviivat täytön sijaan: umpinaisena muoto jäi tummaksi läiskäksi
    // eivätkä kaaret erottuneet.
    el('path', { d: 'M-26,8 q26,10 52,0', class: 'doodle' }, g);
    el('path', { d: 'M-26,8 L-26,-8 q26,-12 52,0 L26,8', class: 'doodle' }, g);
    el('path', { d: 'M-26,-2 q26,10 52,0', class: 'doodle' }, g);
    for (const x of [-17, -6, 5, 16]) {
      el('path', { d: `M${x},2 q0,-7 5,-7 q5,0 5,7`, class: 'doodle' }, g);
      el('path', { d: `M${x},-8 q0,-6 5,-6 q5,0 5,6`, class: 'doodle' }, g);
    }
    // Murtunut kohta oikealla: keskiajalla kivi vietiin kirkkoihin.
    el('path', { d: 'M20,-12 L26,-6', class: 'doodle' }, g);
  },
  // Tulivuori: kartio, jonka laelta nousee savu.
  volcano: (g) => {
    // Kartio ääriviivana; vain kraaterin lakiosa täytetään, jotta
    // savu erottuu eikä vuoresta tule tummaa kolmiota.
    el('path', { d: 'M-28,16 L-9,-14 L9,-14 L28,16', class: 'doodle' }, g);
    el('path', { d: 'M-9,-14 q9,5 18,0 L13,-8 q-13,5 -26,0 Z', class: 'doodle-fill' }, g);
    el('path', { d: 'M-4,-19 q-7,-9 2,-14 q9,-5 3,-13', class: 'doodle' }, g);
    el('path', { d: 'M7,-19 q7,-8 -1,-13', class: 'doodle' }, g);
    el('path', { d: 'M-14,-4 q6,10 2,20 M12,-2 q-5,9 -1,18', class: 'doodle' }, g);
    el('path', { d: 'M-28,18 q28,5 56,0', class: 'doodle' }, g);
  },
  // Geysir: maasta purkautuva vesipatsas ja höyryä.
  geyser: (g) => {
    el('path', { d: 'M-22,16 q22,-6 44,0', class: 'doodle' }, g);
    el('path', { d: 'M-8,14 q8,-16 0,-30 q-3,-8 3,-12', class: 'doodle' }, g);
    el('path', { d: 'M6,14 q-6,-14 1,-26', class: 'doodle' }, g);
    el('path', { d: 'M-14,-16 q6,-6 3,-12 M12,-14 q-5,-7 1,-12', class: 'doodle' }, g);
    el('ellipse', { cx: -1, cy: 15, rx: 13, ry: 4, class: 'doodle-fill' }, g);
  },
  // Revontulet: kaksi aaltoilevaa verhoa ja muutama tähti.
  aurora: (g) => {
    el('path', { d: 'M-32,2 q12,-20 26,-8 q14,12 30,-10', class: 'doodle' }, g);
    el('path', { d: 'M-30,12 q12,-19 26,-8 q14,12 30,-10', class: 'doodle' }, g);
    el('path', { d: 'M-26,20 q12,-17 24,-7 q13,11 27,-9', class: 'doodle' }, g);
    for (const [x, y] of [[-24, -14], [4, -18], [26, -8]]) {
      el('path', { d: `M${x - 3},${y} L${x + 3},${y} M${x},${y - 3} L${x},${y + 3}`, class: 'doodle' }, g);
    }
  },
  // Dhow: kolmiomainen latinalaispurje, joka on Intian valtameren tuntomerkki.
  dhow: (g) => {
    el('path', { d: 'M-20,10 L22,10 L14,20 L-14,20 Z', class: 'doodle-fill' }, g);
    el('path', { d: 'M-6,10 L2,-26', class: 'doodle' }, g);
    el('path', { d: 'M2,-24 L18,8 L-4,8 z', class: 'doodle-fill' }, g);
    el('path', { d: 'M-28,26 q12,7 24,0 M6,26 q12,7 24,0', class: 'doodle' }, g);
  },
};

export function drawDoodles(svg, decor) {
  if (decor.ship) {
    const ship = el('g', {
      class: 'doodle-ship', transform: `translate(${decor.ship.x},${decor.ship.y})`,
    }, svg);
    el('path', { d: 'M-40,10 L40,10 L28,30 L-28,30 Z', class: 'doodle-fill' }, ship);
    el('path', { d: 'M-2,10 L-2,-48 M18,10 L18,-30', class: 'doodle' }, ship);
    el('path', { d: 'M0,-46 q26,16 0,30 z', class: 'doodle-fill' }, ship);
    el('path', { d: 'M20,-28 q18,12 0,22 z', class: 'doodle-fill' }, ship);
    el('path', { d: 'M-52,38 q13,9 26,0 M18,38 q13,9 26,0', class: 'doodle' }, ship);
  }

  if (decor.serpent) {
    const serpent = el('g', {
      class: 'doodle-serpent', transform: `translate(${decor.serpent.x},${decor.serpent.y})`,
    }, svg);
    el('path', {
      d: 'M-78,14 q14,-30 30,-2 q10,18 22,0 q10,-16 22,-2',
      class: 'doodle',
    }, serpent);
    el('path', {
      d: 'M-4,10 q14,-22 34,-16 q-8,7 -6,16 q-12,6 -28,0 z',
      class: 'doodle-fill',
    }, serpent);
    el('path', { d: 'M-86,10 q-10,6 -6,16 q8,-4 8,-12', class: 'doodle-fill' }, serpent);
  }

  // Maamerkit: pieniä viivapiirroksia vanhojen karttojen tapaan. Ne myös
  // vihjaavat pulmista (pyramidit ↔ Kairo, Pöytävuori ↔ Kapkaupunki), joten
  // ne ovat tarkoituksella lähellä kaupunkiaan. Ei tekstiä — pelkkä kuva.
  for (const mark of decor.landmarks ?? []) {
    const g = el('g', {
      class: `doodle-landmark landmark-${mark.kind}`,
      transform: `translate(${mark.x},${mark.y})${mark.flip ? ' scale(-1,1)' : ''}`,
    }, svg);
    LANDMARKS[mark.kind]?.(g);
  }

  const title = el('g', {
    class: 'map-title-group',
    transform: `translate(${decor.mapLabelPos.x},${decor.mapLabelPos.y})`,
  }, svg);
  el('text', {
    x: 0, y: 0, class: 'map-title', 'text-anchor': 'middle', 'font-size': 34,
  }, title).textContent = decor.mapLabel;
  el('path', { d: 'M-80,14 L80,14 M-58,22 L58,22', class: 'doodle' }, title);
}
