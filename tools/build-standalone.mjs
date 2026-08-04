// Kokoaa pelin yhdeksi tiedostoksi, jonka voi avata ilman web-palvelinta.
//
//   node tools/build-standalone.mjs
//
// Tuottaa:
//   dist/matkakirja.html          täysi HTML-sivu (avaa selaimessa suoraan)
//   dist/matkakirja.partial.html  sama ilman <html>/<head>/<body>-kuorta

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

// Moduulit riippuvuusjärjestyksessä; import/export-rivit poistetaan.
const MODULES = [
  'js/tokens.js',
  'js/wiki.js',
  'js/media.js',
  'js/packs/maailma-questions.js',
  'js/packs/maailma.js',
  'js/packs/africa-questions.js',
  'js/packs/africa-puzzles.js',
  'js/packs/africa-borders.js',
  'js/packs/africa-countries.js',
  'js/packs/omat-tiivistelmat.js',
  'js/packs/europe-countries.js',
  'js/packs/europe-saapumiset.js',
  'js/packs/asia-saapumiset.js',
  'js/packs/northamerica-saapumiset.js',
  'js/packs/southamerica-saapumiset.js',
  'js/packs/oceania-saapumiset.js',
  'js/packs/asia-artikkelit.js',
  'js/packs/asia-valokuvat.js',
  'js/packs/asia-lisat-valokuvat.js',
  'js/packs/northamerica-valokuvat.js',
  'js/packs/southamerica-valokuvat.js',
  'js/packs/oceania-valokuvat.js',
  'js/packs/asia-maatiedot.js',
  'js/packs/radiot.js',
  'js/packs/europe-kulttuuri.js',
  'js/packs/kulttuuri-kategoriat.js',
  'js/packs/europe-valokuvat.js',
  'js/packs/europe-kielet.js',
  'js/packs/europe-maatiedot.js',
  'js/packs/europe-artikkelit.js',
  'js/linssit/kerros.js',
  'js/linssit/rekisteri.js',
  'js/linssit/omistus.js',
  'js/packs/valokuvat-paikalliset.js',
  'js/packs/liput-paikalliset.js',
  'js/packs/lippu-tekijat.js',
  'js/packs/africa-valokuvat.js',
  'js/packs/africa-saapumiset.js',
  'js/packs/africa-kulttuuri.js',
  'js/packs/africa-artikkelit.js',
  'js/packs/africa-maatiedot.js',
  'js/packs/africa.js',
  'js/packs/middleeast-questions.js',
  'js/packs/europe-questions.js',
  'js/packs/europe-puzzles.js',
  'js/packs/europe.js',
  'js/packs/middleeast.js',
  'js/packs/asia-questions.js',
  'js/packs/asia.js',
  'js/packs/oceania-questions.js',
  'js/packs/oceania.js',
  'js/packs/northamerica-questions.js',
  'js/packs/northamerica.js',
  'js/packs/southamerica-questions.js',
  'js/packs/southamerica.js',
  'js/packs/suomi-questions.js',
  'js/packs/suomi.js',
  'js/packs/istanbul-questions.js',
  'js/packs/istanbul.js',
  'js/packs/maailmankartta.js',
  'js/packs/maailmankartta-maasto.js',
  'js/packs/maasto-vedet.js',
  'js/packs/maasto-korkeus.js',
  'js/packs/linssi-topografia.js',
  'js/packs/linssi-maaluvut.js',
  'js/packs/linssi-muuttoliike.js',
  'js/packs/linssi-historia.js',
  'js/packs/linssi-leviaminen.js',
  'js/packs/linssi-ilmasto.js',
  'js/packs/linssi-kielet.js',
  'js/packs/linssi-tahdet.js',
  'js/packs/linssi-tuulet.js',
  'js/packs/linssi-yokartta.js',
  'js/pack.js',
  'js/passport.js',
  'js/aani-ehdokkaat.js',
  'js/sound.js',
  'js/ambience-stream.js',
  'js/die.js',
  'js/rules.js',
  'js/mapart.js',
  'js/game.js',
  'js/ai.js',
  'js/ui.js',
  'js/muutokset.js',
  'js/main.js',
];

/** Varmistaa, ettei yksikään moduuli jää pois niputuksesta. */
function checkModuleList() {
  const included = new Set(MODULES);
  for (const file of MODULES) {
    const dir = dirname(file);
    for (const match of read(file).matchAll(/from '(\.\.?\/[\w\/-]+\.js)'/g)) {
      const dep = join(dir, match[1]).replaceAll('\\', '/');
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
const partial = `<title>Matkakirja</title>

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
<title>Matkakirja</title>
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
writeFileSync(join(root, 'dist/matkakirja.partial.html'), partial);
writeFileSync(join(root, 'dist/matkakirja.html'), full);

console.log(
  `dist/matkakirja.html (${Math.round(full.length / 1024)} kt)`,
  `\ndist/matkakirja.partial.html (${Math.round(partial.length / 1024)} kt)`,
);
