// Kokoaa pelin yhdeksi tiedostoksi, jonka voi avata ilman web-palvelinta.
//
//   node tools/build-standalone.mjs
//
// Tuottaa:
//   dist/afrikan-tahti.html          täysi HTML-sivu (avaa selaimessa suoraan)
//   dist/afrikan-tahti.partial.html  sama ilman <html>/<head>/<body>-kuorta

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

// Moduulit riippuvuusjärjestyksessä; import/export-rivit poistetaan.
const MODULES = [
  'js/board.js',
  'js/tokens.js',
  'js/questions.js',
  'js/sound.js',
  'js/rules.js',
  'js/mapart.js',
  'js/game.js',
  'js/ai.js',
  'js/ui.js',
  'js/main.js',
];

/** Varmistaa, ettei yksikään moduuli jää pois niputuksesta. */
function checkModuleList() {
  const included = new Set(MODULES);
  for (const file of MODULES) {
    for (const match of read(file).matchAll(/from '\.\/([\w-]+\.js)'/g)) {
      const dep = `js/${match[1]}`;
      if (!included.has(dep)) {
        throw new Error(`${file} tarvitsee moduulin ${dep}, joka puuttuu MODULES-listalta`);
      }
    }
  }
}

function stripModuleSyntax(source) {
  return source
    .replace(/^import\s[^;]*;\s*$/gm, '')
    .replace(/^export\s*\{[^}]*\}\s*;\s*$/gm, '')
    .replace(/^export\s+(?=(const|let|function|class|async))/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

checkModuleList();

const bundle = MODULES.map((file) => `// ===== ${file} =====\n${stripModuleSyntax(read(file))}`)
  .join('\n\n');

const css = read('css/styles.css');
const indexHtml = read('index.html');

const body = indexHtml
  .slice(indexHtml.indexOf('<body>') + '<body>'.length, indexHtml.indexOf('</body>'))
  .replace(/\s*<script type="module"[^>]*><\/script>/, '')
  .trim();

const script = `<script>\n${bundle}\n</script>`;

// Artefaktialustat käärivät sisällön itse, joten niille riittää runko ilman
// <html>/<head>/<body>-tageja.
const partial = `<title>Afrikan tähti</title>

<style>
${css}
</style>

${body}

${script}
`;

const full = `<!DOCTYPE html>
<html lang="fi">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Afrikan tähti</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text y='26' font-size='26'>★</text></svg>" />
<style>
${css}
</style>
</head>
<body>
${body}

${script}
</body>
</html>
`;

mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/afrikan-tahti.partial.html'), partial);
writeFileSync(join(root, 'dist/afrikan-tahti.html'), full);

console.log(
  `dist/afrikan-tahti.html (${Math.round(full.length / 1024)} kt)`,
  `\ndist/afrikan-tahti.partial.html (${Math.round(partial.length / 1024)} kt)`,
);
