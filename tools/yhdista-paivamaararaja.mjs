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

/*
 * Sama leikkaus on kahdessa aineistossa.
 *
 * Rannikko korjattiin ensin, mutta merisyvyysvyöhykkeet tulevat samasta
 * lähteestä ja ovat samalla tavalla katkaistut — 50 pystysuoraa
 * leikkausjanaa 291 renkaassa. Ne piirtyvät meren päälle, joten katkos
 * näkyy kartalla yhtä lailla. Yksi työkalu hoitaa molemmat: algoritmi on
 * sama, vain se mistä renkaat luetaan ja minne ne kirjoitetaan vaihtuu.
 */
const KOHTEET = {
  rannikko: {
    polku: 'js/packs/maailmankartta.js',
    lue: (m) => [m.MAAILMANKARTTA.map.outlines],
    lohko: /const OUTLINES = \[[^]*?\n\];/,
    kirjoita: (rivit) => `const OUTLINES = [\n${rivit}\n];`,
  },
  syvyys: {
    polku: 'js/packs/maailmankartta-syvyys.js',
    lue: (m) => Object.values(m)[0].vyohykkeet.map((v) => v.renkaat),
    // Syvyyspaketti kirjoitetaan kokonaan uusiksi, koska renkaat ovat
    // vyöhykkeiden sisällä eikä yhtenä lohkona.
    vyohykkeet: true,
  },
};

const nimi = process.argv.find((a) => KOHTEET[a]) ?? 'rannikko';
const kohde = KOHTEET[nimi];
const POLKU = join(JUURI, kohde.polku);
const moduuli = await import(`file://${POLKU}`);
const ryhmat = kohde.lue(moduuli);
console.log(`kohde: ${nimi} (${ryhmat.length} ryhmää)`);

/*
 * Pystysuora jana: sama x kahdella peräkkäisellä pisteellä ja pitkä
 * matka y:ssä. Raja on 120 yksikköä eli noin neljä leveysastetta —
 * sitä pidempää suoraa pystyrannikkoa ei ole olemassa luonnossa.
 */
const SIETO_X = 0.6;
const VAHIN_PITUUS = 120;

const kaikkiTulokset = [];
for (const outlines of ryhmat) {
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

/*
 * Sama jana vastakkaiseen suuntaan? Silloin ne ovat saman leikkauksen
 * puolet.
 *
 * X vertaillaan LAUDAN LEVEYDEN MODULO. Merisyvyysaineistossa leikkauksen
 * puolet ovat sauman eri puolilla: toinen x = 11833,3 ja toinen
 * x = -166,7. Ne ovat sama pituuspiiri, mutta suora vertailu piti niitä
 * eri kohtina, ja 50 katkoksesta löytyi vain yksi pari. Rannikossa tätä
 * ei huomannut, koska siellä molemmat puolet sattuivat olemaan samalla
 * puolella nollaa.
 */
const LEVEYS = 12000;
const samaX = (a, b) => {
  const ero = Math.abs(((a - b) % LEVEYS + LEVEYS) % LEVEYS);
  return Math.min(ero, LEVEYS - ero) < SIETO_X;
};
const vastapari = (a, b) => samaX(a.x, b.x)
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
  console.log('  ei yhdistettävää tässä ryhmässä');
  kaikkiTulokset.push(outlines);
  continue;
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
console.log(`  renkaita ${outlines.length} -> ${tulos.length}`);
kaikkiTulokset.push(tulos);
}

if (kuiva) process.exit(0);

/*
 * Kirjoitus takaisin tiedostoon tekstinä. Koko paketti on koneen
 * kirjoittama, mutta sitä EI saa luoda uudelleen koostajalla: siihen on
 * ajettu käsin korjauksia (satamat rannalle, merireitit), ja
 * uudelleenluonti veisi ne mukanaan. Sama syy on kirjattu paketin
 * omaan otsikkoon.
 */
const teksti = readFileSync(POLKU, 'utf8');
const piste = ([x, y]) => `[${Number(x.toFixed(1))},${Number(y.toFixed(1))}]`;
const rivi = (r) => `  [${r.map(piste).join(',')}],`;

if (kohde.vyohykkeet) {
  /*
   * Syvyyspaketissa renkaat ovat vyöhykkeiden sisällä, joten kirjoitetaan
   * koko vyöhykelista uusiksi. Otsikko ja muu tiedosto säilyvät.
   */
  const vanhat = Object.values(moduuli)[0].vyohykkeet;
  const lohkot = vanhat.map((v, i) => `  {\n    metria: ${v.metria},\n    renkaat: [\n`
    + `${kaikkiTulokset[i].map((r) => `      [${r.map(piste).join(',')}],`).join('\n')}\n    ],\n  },`);
  const uusi = `  vyohykkeet: [\n${lohkot.join('\n')}\n  ],`;
  const vanhaLohko = teksti.match(/ {2}vyohykkeet: \[[^]*?\n {2}\],/);
  if (!vanhaLohko) throw new Error('vyohykkeet-lohkoa ei löytynyt');
  writeFileSync(POLKU, teksti.replace(vanhaLohko[0], uusi));
} else {
  const lohko = `const OUTLINES = [\n${kaikkiTulokset[0].map(rivi).join('\n')}\n];`;
  const vanhaLohko = teksti.match(/const OUTLINES = \[[^]*?\n\];/);
  if (!vanhaLohko) throw new Error('OUTLINES-lohkoa ei löytynyt');
  writeFileSync(POLKU, teksti.replace(vanhaLohko[0], lohko));
}
console.log(`Kirjoitettu ${POLKU}`);
