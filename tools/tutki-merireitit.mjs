/*
 * Kertoo, missä kohtaa merireitti kulkee maalla ja miksi.
 *
 *   node tools/tutki-merireitit.mjs vanhamaailma
 *
 * Tämä on vain diagnoosi. Korjaus on tools/korjaa-merireitit.mjs.
 */
import { PACKS } from '../js/pack.js';
import { buildBoard } from '../js/rules.js';
import { isOnLand } from '../js/mapart.js';

const lauta = process.argv[2] ?? 'vanhamaailma';
const pack = PACKS.find((p) => p.id === lauta);
if (!pack) throw new Error(`tuntematon lauta: ${lauta}`);

const board = buildBoard(pack.cities, pack.edges, pack.map);
const SATAMA = 55;

let maalla = 0;
for (const edge of board.edges) {
  if (edge.type !== 'sea') continue;
  const a = board.cityById.get(edge.a);
  const b = board.cityById.get(edge.b);
  /*
   * Näytteet viivaa PITKIN, ei vain kulmapisteistä.
   *
   * Pelkät kulmapisteet antavat liian kauniin kuvan: välipisteettömällä
   * suoralla niitä on kaksi ja molemmat ovat satamassa, jolloin mitään
   * ei tarkasteta. Askel on yksi yksikkö, koska lyhyillä reiteillä
   * satamavyöhykkeiden väliin voi jäädä vain pari yksikköä.
   */
  const osumat = [];
  for (let i = 1; i < edge.poly.length; i++) {
    const [x0, y0] = edge.poly[i - 1];
    const [x1, y1] = edge.poly[i];
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
    for (let k = 0; k <= n; k++) {
      const t = k / n;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t;
      if (Math.hypot(x - a.x, y - a.y) < SATAMA) continue;
      if (Math.hypot(x - b.x, y - b.y) < SATAMA) continue;
      if (isOnLand([x, y], pack.map)) osumat.push([Math.round(x), Math.round(y)]);
    }
  }
  if (!osumat.length) continue;
  maalla += 1;

  // Onko vika välipisteissä vai niiden välisessä pehmennyksessä? Pelin
  // reittiviiva on Catmull-Rom-käyrä välipisteiden läpi, ja käyrä kaartaa
  // jyrkissä mutkissa pisteiden ULKOPUOLELLE. Jos välipisteet itse ovat
  // vedessä mutta käyrä ei, vika on pehmennyksessä eikä haussa.
  const valit = edge.via ?? [];
  const pisteetVedessa = valit.every((p) => !isOnLand(p, pack.map));
  const etaisyys = Math.round(Math.hypot(b.x - a.x, b.y - a.y));

  console.log(
    `${edge.id}: ${osumat.length}/${edge.poly.length} pistettä maalla, ` +
    `${valit.length} välipistettä (${pisteetVedessa ? 'kaikki vedessä' : 'MAALLA'}), ` +
    `pituus ${etaisyys}`,
  );
  console.log(`   ensimmäinen osuma ${osumat[0]}, viimeinen ${osumat[osumat.length - 1]}`);
}
console.log(`\n${maalla} merireittiä kulkee maalla.`);
