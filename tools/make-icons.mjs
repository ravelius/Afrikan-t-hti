// Luo sovelluskuvakkeet (assets/icon.svg + PNG:t) pelin oikeasta rannikkoviivasta.
//
//   node tools/make-icons.mjs                     # vain SVG
//   node tools/make-icons.mjs --png <polku>       # myös PNG:t Playwrightilla
//
// PNG:t on versioitu repoon, joten skriptiä ei tarvitse ajaa normaalisti.

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { MAP } from '../js/board.js';
import { AFRICA_PATH } from '../js/mapart.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const xs = MAP.africaPoints.map((p) => p[0]);
const ys = MAP.africaPoints.map((p) => p[1]);
const bbox = {
  x: Math.min(...xs), y: Math.min(...ys),
  w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys),
};

const SIZE = 512;
const PAD = 104;
const scale = Math.min((SIZE - PAD * 2) / bbox.w, (SIZE - PAD * 2) / bbox.h);
const tx = (SIZE - bbox.w * scale) / 2 - bbox.x * scale;
const ty = (SIZE - bbox.h * scale) / 2 - bbox.y * scale;

/** Viisisakarainen tähti annettuun kohtaan. */
function starPath(cx, cy, outer, inner, turn = -Math.PI / 2) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? inner : outer;
    const a = turn + (i / 10) * Math.PI * 2;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return `M${pts.join(' L')} Z`;
}

// Kuvake: pergamenttilaatta, jossa Afrikan ääriviiva ja sen päällä kultainen tähti.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="Afrikan tähti">
  <defs>
    <radialGradient id="paper" cx="40%" cy="34%" r="78%">
      <stop offset="0%" stop-color="#f8ecd0"/>
      <stop offset="62%" stop-color="#e8d2a5"/>
      <stop offset="100%" stop-color="#c9a86f"/>
    </radialGradient>
    <radialGradient id="gold" cx="36%" cy="30%" r="72%">
      <stop offset="0%" stop-color="#ffdb85"/>
      <stop offset="58%" stop-color="#e5ac36"/>
      <stop offset="100%" stop-color="#b9811d"/>
    </radialGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" rx="112" fill="#241a12"/>
  <rect x="24" y="24" width="${SIZE - 48}" height="${SIZE - 48}" rx="92" fill="url(#paper)"/>
  <rect x="52" y="52" width="${SIZE - 104}" height="${SIZE - 104}" rx="72"
        fill="none" stroke="#46331f" stroke-width="6" stroke-dasharray="22 16" opacity="0.45"/>
  <g transform="translate(${tx.toFixed(1)},${ty.toFixed(1)}) scale(${scale.toFixed(4)})">
    <path d="${AFRICA_PATH}" fill="#d3b076" stroke="#46331f"
          stroke-width="${(11 / scale).toFixed(1)}" stroke-linejoin="round"/>
  </g>
  <g transform="rotate(-7 272 296)">
    <path d="${starPath(272, 296, 96, 40)}" fill="url(#gold)" stroke="#46331f"
          stroke-width="12" stroke-linejoin="round"/>
  </g>
</svg>
`;

writeFileSync(join(root, 'assets/icon.svg'), svg);
console.log('assets/icon.svg');

const pngFlag = process.argv.indexOf('--png');
if (pngFlag !== -1) {
  const playwrightPath = process.argv[pngFlag + 1];
  if (!playwrightPath) throw new Error('Anna Playwrightin polku: --png <polku/index.mjs>');
  const { chromium } = await import(playwrightPath);
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const [size, padding, file] of [
    [192, 0, 'assets/icon-192.png'],
    [512, 0, 'assets/icon-512.png'],
    [180, 0, 'assets/apple-touch-icon.png'],
    [512, 56, 'assets/icon-maskable-512.png'],
  ]) {
    const inner = size - padding * 2;
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(
      `<body style="margin:0;background:#241a12">
         <div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center">
           <div style="width:${inner}px;height:${inner}px">${svg}</div>
         </div>
       </body>`,
    );
    writeFileSync(join(root, file), await page.screenshot());
    console.log(file);
  }
  await browser.close();
}
