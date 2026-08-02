/*
 * Kaupunkien nimien paikat yhdistetylle kartalle.
 *
 *   node tools/nimien-paikat.mjs [--esikatselu ulos.svg]
 *
 * Jokaisella kaupungilla on paketissa nimen ankkuri ja siirtymä
 * (la, lx, ly). Ne on säädetty käsin OMALLE laudalleen: uudella
 * yhdistetyllä kartalla mittakaava on eri ja naapurit ovat eri, joten
 * ne eivät kelpaa sellaisinaan. 143 nimeä on liikaa käsin siirreltäväksi
 * yksi kerrallaan.
 *
 * Tämä on kartografian vakio-ongelma (point-feature label placement), ja
 * suurin osa siitä ratkeaa hakemalla. Jokaiselle nimelle kokeillaan
 * joukko paikkoja nimikkopisteensä ympäriltä ja valitaan se, joka
 * törmää vähiten muihin nimiin, kaupunkiympyröihin ja reitteihin.
 *
 * Tavoite ei ole täydellisyys vaan se, että käsin katsottavaksi jää
 * kymmenen nimeä eikä sataaneljäkymmentä.
 *
 * --- miksi tekstin leveys mitataan selaimessa ---
 *
 * Nimen viemä tila riippuu fontista, ja pelin fontti on Iowan Old Style
 * (varalla Palatino, Georgia). Merkkien laskeminen antaisi väärän
 * tuloksen: "Kilimandžaro" ja "Lissabon" ovat eri levyisiä samalla
 * merkkimäärällä. Leveydet mitataan siksi samalla fontilla ja samoilla
 * asetuksilla kuin peli piirtää.
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { miller, sovita, rannikot, kaupungit, reitit } from './vanha-maailma.mjs';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const arg = (lippu, oletus) => {
  const i = argv.indexOf(lippu);
  return i >= 0 ? argv[i + 1] : oletus;
};

// Pelin omat mitat (css/styles.css .city-label ja js/ui.js drawCities).
const FONTTI = '600 18px "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif';
const FONTTI_ALOITUS = '600 21px "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif';
const RIVI = 18;          // tekstin korkeus laatikkoa varten
const YMPYRA = 16;        // kaupunkiympyrän säde, jonka päälle nimi ei saa tulla

/*
 * Ehdokaspaikat nimikkopisteen ympärillä, paras ensin.
 *
 * Kartografian sääntö: oikea yläkulma on luettavin, sitten vasen ylä,
 * sitten oikea ala. Suoraan pisteen ylä- tai alapuolelle sijoitettu nimi
 * on huonompi, koska se osuu helpommin reitteihin. Kauempana olevat
 * paikat ovat viimeisenä: ne toimivat, mutta nimi irtoaa pisteestään.
 */
const PAIKAT = [
  { la: 'start', lx: 20, ly: 5, sakko: 0 },    // oikealla, keskellä
  { la: 'end', lx: -20, ly: 5, sakko: 1 },     // vasemmalla
  { la: 'middle', lx: 0, ly: -24, sakko: 2 },  // yllä
  { la: 'start', lx: 17, ly: -16, sakko: 3 },  // oikea ylä
  { la: 'end', lx: -17, ly: -16, sakko: 3 },   // vasen ylä
  { la: 'middle', lx: 0, ly: 32, sakko: 4 },   // alla
  { la: 'start', lx: 17, ly: 26, sakko: 5 },   // oikea ala
  { la: 'end', lx: -17, ly: 26, sakko: 5 },    // vasen ala
  { la: 'start', lx: 30, ly: 5, sakko: 7 },    // kauempana oikealla
  { la: 'end', lx: -30, ly: 5, sakko: 7 },     // kauempana vasemmalla
  { la: 'middle', lx: 0, ly: -38, sakko: 8 },  // kauempana ylhäällä
  { la: 'middle', lx: 0, ly: 46, sakko: 8 },   // kauempana alhaalla
];

/** Nimen laatikko annetussa paikassa. */
export function laatikko(kaupunki, paikka, leveys) {
  const x = kaupunki.x + paikka.lx;
  const y = kaupunki.y + paikka.ly;
  const vasen = paikka.la === 'start' ? x
    : paikka.la === 'end' ? x - leveys
      : x - leveys / 2;
  return {
    x0: vasen, x1: vasen + leveys,
    // y on tekstin perusviiva; laatikko ulottuu siitä ylös ja vähän alas.
    y0: y - RIVI * 0.8, y1: y + RIVI * 0.3,
  };
}

const osuu = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

/** Osuuko laatikko ympyrään? Karkea mutta riittävä: ympyrän laatikko. */
const osuuYmpyraan = (l, p, sade = YMPYRA) => osuu(l, {
  x0: p.x - sade, x1: p.x + sade, y0: p.y - sade, y1: p.y + sade,
});

/** Osuuko laatikko janaan? Testataan janan pisteitä tasavälein. */
function osuuJanaan(l, a, b) {
  const askeleet = Math.max(2, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 12));
  for (let i = 0; i <= askeleet; i++) {
    const t = i / askeleet;
    const x = a.x + (b.x - a.x) * t;
    const y = a.y + (b.y - a.y) * t;
    if (x > l.x0 && x < l.x1 && y > l.y0 && y < l.y1) return true;
  }
  return false;
}

/**
 * Sijoittaa nimet. Palauttaa jokaiselle kaupungille paikan ja listan
 * niistä, joille kelvollista paikkaa ei löytynyt.
 *
 * Järjestys on tärkeä: ahtaimmalla olevat ensin. Jos väljällä seudulla
 * olevat sijoitettaisiin ensin, ne veisivät parhaat paikat naapureiltaan
 * ja ahtaat jäisivät ilman — sama ilmiö kuin istumajärjestyksessä.
 */
export function sijoita(kaupungit, leveydet, janat) {
  // Ahtaus: montako muuta kaupunkia on lähellä.
  const ahtaus = new Map(kaupungit.map((c) => [c.id, kaupungit.filter(
    (o) => o.id !== c.id && Math.hypot(o.x - c.x, o.y - c.y) < 140,
  ).length]));
  const jarjestys = [...kaupungit].sort((a, b) => ahtaus.get(b.id) - ahtaus.get(a.id));

  const asetetut = [];
  const tulos = new Map();
  const pulmat = [];

  for (const c of jarjestys) {
    const leveys = leveydet.get(c.id) ?? c.nimi.length * 9;
    let paras = null;
    let parasPisteet = Infinity;
    for (const paikka of PAIKAT) {
      const l = laatikko(c, paikka, leveys);
      let pisteet = paikka.sakko;
      // Törmäys toiseen nimeen on pahin: nimet menevät lukukelvottomiksi.
      for (const muu of asetetut) if (osuu(l, muu)) pisteet += 100;
      // Kaupunkiympyrän päälle ei saa tulla — ei omansa eikä muiden.
      for (const p of kaupungit) if (osuuYmpyraan(l, p)) pisteet += 40;
      // Reitin päällä nimi on yhä luettava, mutta rumempi.
      for (const [a, b] of janat) if (osuuJanaan(l, a, b)) pisteet += 6;
      if (pisteet < parasPisteet) { parasPisteet = pisteet; paras = { paikka, l }; }
      if (pisteet === paikka.sakko) break; // täysin vapaa, ei tarvitse etsiä lisää
    }
    asetetut.push(paras.l);
    tulos.set(c.id, { ...paras.paikka, pisteet: parasPisteet });
    // Yli sadan pistettä tarkoittaa, että nimi menee toisen päälle.
    if (parasPisteet >= 100) pulmat.push({ id: c.id, nimi: c.nimi, pisteet: parasPisteet });
  }
  return { paikat: tulos, pulmat };
}

// --- ajo ---------------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  const { readFileSync } = await import('node:fs');
  const lahde = process.env.NE_LAND ?? 'ne_10m_land.geojson';
  const geo = JSON.parse(readFileSync(lahde, 'utf8'));
  const { kaupungit: kaup } = await kaupungit();
  const tiet = await reitit();

  const lonit = kaup.map((c) => c.lon);
  const latit = kaup.map((c) => c.lat);
  const viivat = rannikot(geo, {
    lon0: Math.min(...lonit) - 12, lon1: Math.max(...lonit) + 12,
    lat0: Math.min(...latit) - 10, lat1: Math.max(...latit) + 10,
  });
  const kaupPisteet = kaup.map((c) => miller.eteen(c.lon, c.lat));
  const { muunna, korkeus } = sovita([...viivat, kaupPisteet]);

  const pisteet = kaup.map((c) => {
    const [x, y] = muunna(miller.eteen(c.lon, c.lat));
    return { ...c, x, y };
  });
  const paikka = new Map(pisteet.map((c) => [c.id, c]));

  // Reitit janoina törmäystarkistusta varten.
  const janat = [];
  for (const t of tiet) {
    const a = paikka.get(t.a);
    const b = paikka.get(t.b);
    if (!a || !b) continue;
    const kohdat = [a, ...(t.via ?? []).map((p) => {
      const [x, y] = muunna(miller.eteen(p[0], p[1]));
      return { x, y };
    }), b];
    for (let i = 1; i < kohdat.length; i++) janat.push([kohdat[i - 1], kohdat[i]]);
  }

  // Tekstien leveydet selaimessa, pelin omalla fontilla.
  const { avaaSelain } = await import('./mittaa-selaimessa.mjs');
  const { sivu, sulje } = await avaaSelain();
  const mitat = await sivu.evaluate(({ nimet, fontti, fonttiAloitus }) => {
    const kangas = document.createElement('canvas').getContext('2d');
    const ulos = {};
    for (const [id, { nimi, aloitus }] of Object.entries(nimet)) {
      kangas.font = aloitus ? fonttiAloitus : fontti;
      // Aloituskaupunkien nimet piirretään versaalilla ja harvennettuna.
      const teksti = aloitus ? nimi.toUpperCase() : nimi;
      const harvennus = (aloitus ? 0.1 : 0.04) * (aloitus ? 21 : 18) * teksti.length;
      ulos[id] = kangas.measureText(teksti).width + harvennus;
    }
    return ulos;
  }, {
    nimet: Object.fromEntries(pisteet.map((c) => [c.id, { nimi: c.nimi, aloitus: false }])),
    fontti: FONTTI,
    fonttiAloitus: FONTTI_ALOITUS,
  });
  await sulje();
  const leveydet = new Map(Object.entries(mitat));

  const { paikat, pulmat } = sijoita(pisteet, leveydet, janat);

  console.log(`kaupunkeja ${pisteet.length}, reittijanoja ${janat.length}`);
  const jakauma = {};
  for (const p of paikat.values()) jakauma[p.la] = (jakauma[p.la] ?? 0) + 1;
  console.log(`ankkurit: ${Object.entries(jakauma).map(([k, v]) => `${k} ${v}`).join(', ')}`);
  console.log(`\nkäsin katsottavaksi jää ${pulmat.length} nimeä:`);
  for (const p of pulmat.sort((a, b) => b.pisteet - a.pisteet)) {
    console.log(`  ${p.nimi.padEnd(18)} ${p.pisteet} pistettä`);
  }

  writeFileSync(join(JUURI, 'tools/nimipaikat.json'), `${JSON.stringify(
    Object.fromEntries([...paikat].map(([id, p]) => [id, { la: p.la, lx: p.lx, ly: p.ly }])),
    null, 2,
  )}\n`);
  console.log('\npaikat: tools/nimipaikat.json');

  const esikatselu = arg('--esikatselu', null);
  if (esikatselu) {
    const polku = (v) => `M${v.map(muunna).map(([x, y]) => `${x},${y}`).join(' L')} Z`;
    const pulmaIdt = new Set(pulmat.map((p) => p.id));
    const svg = [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4000 ${korkeus}" width="2200">`,
      `<rect width="4000" height="${korkeus}" fill="#ecd8ae"/>`,
      '<style>text{font-family:Palatino,Georgia,serif;font-weight:600;'
        + 'paint-order:stroke;stroke:rgba(239,220,180,0.9);stroke-width:4px;'
        + 'stroke-linejoin:round;fill:#46331f}</style>',
      ...viivat.map((v) => `<path d="${polku(v)}" fill="#ddc394" stroke="#46331f" stroke-width="2"/>`),
      ...janat.map(([a, b]) => `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"`
        + ' stroke="#8a6c46" stroke-width="3" opacity="0.6"/>'),
      ...pisteet.map((c) => `<circle cx="${c.x}" cy="${c.y}" r="9" fill="#f3e3c0"`
        + ' stroke="#46331f" stroke-width="3"/>'),
      ...pisteet.map((c) => {
        const p = paikat.get(c.id);
        const vari = pulmaIdt.has(c.id) ? '#b03030' : '#46331f';
        return `<text x="${c.x + p.lx}" y="${c.y + p.ly}" text-anchor="${p.la}"`
          + ` font-size="18" fill="${vari}">${c.nimi}</text>`;
      }),
      '</svg>',
    ].join('\n');
    writeFileSync(esikatselu, svg);
    console.log(`esikatselu: ${esikatselu}  (punaiset = käsin katsottavat)`);
  }
}
