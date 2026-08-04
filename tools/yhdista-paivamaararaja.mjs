/*
 * Yhdistää päivämääräradalla katkaistut mantereet.
 *
 *   node tools/yhdista-paivamaararaja.mjs [--kuiva]
 *
 * --- mistä on kyse ---
 *
 * Rannikkoaineisto (Natural Earth) on leikattu 180. pituuspiirillä,
 * koska useimmat kartat päättyvät siihen. Tšukotkan niemi jatkuu rajan
 * yli, joten se on aineistossa KAHTENA monikulmiona, ja molemmilla on
 * pitkä suora reuna pitkin leikkauskohtaa.
 *
 * Tämän kartan sauma ei ole siellä. Lauta alkaa 175. läntiseltä
 * pituuspiiriltä ja kiertää ympäri, joten 180. piiri on keskellä
 * merta — ja siellä näkyi pystysuora viiva, jonka kohdalla Siperia
 * loppui kesken ja alkoi uudelleen. Omistajan sanoin: "nämähän pitäisi
 * olla paremmin yhdessä."
 *
 * --- miten yhdistäminen tunnistaa parin ---
 *
 * Leikkauksen jälki on yksikäsitteinen: kaksi monikulmiota, joissa
 * molemmissa on TÄSMÄLLEEN sama pystysuora jana mutta vastakkaisiin
 * suuntiin kuljettuna. Se ei ole sattuma vaan saman leikkauksen kaksi
 * puolta. Muoto, jonka reuna sattuu olemaan pystysuora luonnostaan, ei
 * löydä paria eikä siis muutu.
 *
 * Yhdistäminen poistaa janan molemmista ja liittää loput yhdeksi
 * renkaaksi. Rannikko jatkuu silloin katkeamatta rajan yli.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const kuiva = process.argv.includes('--kuiva');
const POLKU = join(JUURI, 'js/packs/maailmankartta.js');

const { MAAILMANKARTTA } = await import(`file://${POLKU}`);
const outlines = MAAILMANKARTTA.map.outlines;

/*
 * Pystysuora jana: sama x kahdella peräkkäisellä pisteellä ja pitkä
 * matka y:ssä. Raja on 120 yksikköä eli noin neljä leveysastetta —
 * sitä pidempää suoraa pystyrannikkoa ei ole olemassa luonnossa.
 */
const SIETO_X = 0.6;
const VAHIN_PITUUS = 120;

const janat = [];
for (const [i, rengas] of outlines.entries()) {
  for (let k = 1; k < rengas.length; k++) {
    const [x1, y1] = rengas[k - 1];
    const [x2, y2] = rengas[k];
    if (Math.abs(x1 - x2) > SIETO_X) continue;
    if (Math.abs(y1 - y2) < VAHIN_PITUUS) continue;
    janat.push({ rengas: i, kohta: k - 1, x: x1, ya: y1, yb: y2 });
  }
}
console.log(`${janat.length} pystysuoraa leikkausjanaa`);
for (const j of janat) {
  console.log(`  ääriviiva ${j.rengas}: x ${j.x.toFixed(1)}, y ${j.ya.toFixed(1)} -> ${j.yb.toFixed(1)}`);
}

/** Sama jana vastakkaiseen suuntaan? Silloin ne ovat saman leikkauksen puolet. */
const vastapari = (a, b) => Math.abs(a.x - b.x) < SIETO_X
  && Math.abs(a.ya - b.yb) < 2 && Math.abs(a.yb - b.ya) < 2;

const parit = [];
const kaytetyt = new Set();
for (let i = 0; i < janat.length; i++) {
  if (kaytetyt.has(i)) continue;
  for (let k = i + 1; k < janat.length; k++) {
    if (kaytetyt.has(k) || janat[i].rengas === janat[k].rengas) continue;
    if (!vastapari(janat[i], janat[k])) continue;
    parit.push([janat[i], janat[k]]);
    kaytetyt.add(i); kaytetyt.add(k);
    break;
  }
}
console.log(`${parit.length} yhdistettävää paria`);

if (!parit.length) {
  console.log('Ei yhdistettävää — kartta on jo ehjä.');
  process.exit(0);
}

/*
 * Rengas auki leikkausjanan kohdalta: kierretään niin, että jana on
 * lopussa, ja pudotetaan se pois. Jäljelle jää polku, jonka päät ovat
 * juuri ne kohdat, joissa rannikko jatkui rajan toisella puolella.
 */
function avaa(rengas, kohta) {
  const suljettu = rengas[0][0] === rengas.at(-1)[0] && rengas[0][1] === rengas.at(-1)[1];
  const pisteet = suljettu ? rengas.slice(0, -1) : rengas.slice();
  const n = pisteet.length;
  const ulos = [];
  for (let i = 1; i < n; i++) ulos.push(pisteet[(kohta + 1 + i) % n]);
  ulos.unshift(pisteet[(kohta + 1) % n]);
  return ulos;
}

const poistettavat = new Set();
const uudet = [];
for (const [a, b] of parit) {
  const polkuA = avaa(outlines[a.rengas], a.kohta);
  const polkuB = avaa(outlines[b.rengas], b.kohta);
  /*
   * Liitos päistä. Kummankin polun loppu on leikkausjanan toinen pää,
   * ja toisen polun alku on sama piste rajan toisella puolella — sama
   * kohta maastossa, eri monikulmiossa.
   */
  const yhdistetty = [...polkuA, ...polkuB];
  yhdistetty.push([...yhdistetty[0]]);
  uudet.push(yhdistetty);
  poistettavat.add(a.rengas);
  poistettavat.add(b.rengas);
  console.log(`  yhdistetty ${a.rengas} + ${b.rengas} -> ${yhdistetty.length} pistettä`);
}

const tulos = outlines.filter((_, i) => !poistettavat.has(i));
tulos.push(...uudet);
console.log(`ääriviivoja ${outlines.length} -> ${tulos.length}`);

if (kuiva) process.exit(0);

/*
 * Kirjoitus takaisin tiedostoon tekstinä. Koko paketti on koneen
 * kirjoittama, mutta sitä EI saa luoda uudelleen koostajalla: siihen on
 * ajettu käsin korjauksia (satamat rannalle, merireitit), ja
 * uudelleenluonti veisi ne mukanaan. Sama syy on kirjattu paketin
 * omaan otsikkoon.
 */
const teksti = readFileSync(POLKU, 'utf8');
const rivi = (r) => `  [${r.map(([x, y]) => `[${Number(x.toFixed(1))},${Number(y.toFixed(1))}]`).join(',')}],`;
const lohko = `const OUTLINES = [\n${tulos.map(rivi).join('\n')}\n];`;
const vanhaLohko = teksti.match(/const OUTLINES = \[[^]*?\n\];/);
if (!vanhaLohko) throw new Error('OUTLINES-lohkoa ei löytynyt');
writeFileSync(POLKU, teksti.replace(vanhaLohko[0], lohko));
console.log(`Kirjoitettu ${POLKU}`);
