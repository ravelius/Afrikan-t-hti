// Kertoo, kuinka suureen osaan sisällöstä on merkitty lähde.
//
//   node tools/source-report.mjs            # yhteenveto laudoittain
//   node tools/source-report.mjs --missing  # myös lista lähteettömistä
//
// Periaate 2: jokainen pelin väittämä on tarkistettavissa. Lähde on
// vapaaehtoinen kenttä, joten tämä raportti näyttää, missä työtä on vielä
// jäljellä. Raportti ei kaada mitään — se on työkalu, ei portti.

import { PACKS, allQuestions, factSource, factText, sourceList } from '../js/pack.js';

const showMissing = process.argv.includes('--missing');
const pct = (part, total) => (total === 0 ? '—' : `${Math.round((part / total) * 100)} %`);
// Sarakkeet suoraan pisimmän laudan nimen mukaan.
const width = Math.max(8, ...PACKS.map((pack) => pack.name.length));

let allWith = 0;
let allTotal = 0;

for (const pack of PACKS) {
  const rows = [];

  for (const question of allQuestions(pack)) {
    rows.push({ kind: 'kysymys', text: question.q, sources: sourceList(question.source) });
  }
  for (const duel of pack.duels ?? []) {
    rows.push({ kind: 'kaksintaistelu', text: duel.q, sources: sourceList(duel.source) });
  }
  for (const [cityId, facts] of Object.entries(pack.placeFacts)) {
    for (const fact of facts) {
      rows.push({ kind: `tieto (${cityId})`, text: factText(fact), sources: factSource(fact) });
    }
  }

  const withSource = rows.filter((row) => row.sources.length > 0);
  allWith += withSource.length;
  allTotal += rows.length;

  console.log(
    `${pack.name.padEnd(width)}  ${String(withSource.length).padStart(4)}/${String(rows.length).padEnd(4)} `
    + `lähteellä  ${pct(withSource.length, rows.length)}`,
  );

  if (showMissing) {
    for (const row of rows.filter((r) => r.sources.length === 0)) {
      console.log(`   ${row.kind}: ${row.text.slice(0, 72)}`);
    }
  }
}

console.log('—'.repeat(width + 28));
console.log(
  `${'Yhteensä'.padEnd(width)}  ${String(allWith).padStart(4)}/${String(allTotal).padEnd(4)} `
  + `lähteellä  ${pct(allWith, allTotal)}`,
);
