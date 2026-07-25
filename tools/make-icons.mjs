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
const PAD = 96;
const scale = Math.min((SIZE - PAD * 2) / bbox.w, (SIZE - PAD * 2) / bbox.h);
const tx = (SIZE - bbox.w * scale) / 2 - bbox.x * scale;
const ty = (SIZE - bbox.h * scale) / 2 - bbox.y * scale;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="Afrikan tähti">
  <defs>
    <radialGradient id="paper" cx="42%" cy="38%" r="76%">
      <stop offset="0%" stop-color="#f6e7c6"/>
      <stop offset="65%" stop-color="#e8d2a5"/>
      <stop offset="100%" stop-color="#c9a86f"/>
    </radialGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" rx="96" fill="#241a12"/>
  <rect x="26" y="26" width="${SIZE - 52}" height="${SIZE - 52}" rx="74" fill="url(#paper)"/>
  <g transform="translate(${tx.toFixed(1)},${ty.toFixed(1)}) scale(${scale.toFixed(4)})">
    <path d="${AFRICA_PATH}" fill="#d8bb85" stroke="#46331f" stroke-width="${(9 / scale).toFixed(1)}" stroke-linejoin="round"/>
  </g>
  <path d="M138 330 L198 390 M198 330 L138 390" stroke="#b03a2b" stroke-width="26" stroke-linecap="round"/>
  <path d="M368 116 l22 46 50 7 -36 35 8 50 -44 -23 -44 23 8 -50 -36 -35 50 -7z"
        fill="#d9a13b" stroke="#7a5a12" stroke-width="9" stroke-linejoin="round"/>
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
