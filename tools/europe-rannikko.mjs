/*
 * Euroopan laudan rannikkoviivat oikeasta aineistosta.
 *
 *   NE_LAND=ne_10m_land.geojson node tools/europe-rannikko.mjs
 *
 * Kartan ääriviivat oli piirretty käsin noin 150 pisteellä, ja se näkyi:
 * Sardinia ja Korsika puuttuivat kokonaan, Britannia oli möykky ja
 * rannikot mutkittelivat sinne päin. Islanti oli ainoa oikeasta
 * aineistosta piirretty saari — ja ainoa, joka näytti itseltään.
 *
 * Tämä lukee Natural Earthin 10m-maapolygonit (public domain) ja
 * projisoi ne laudan koordinaatistoon samalla kaavalla kuin kaupunkien
 * x/y europe.js:ssä:
 *
 *   x = (pituusaste + 11) * 19.2      y = (72 - leveysaste) * 26.3
 *
 * Manner leikataan laudan ympärille jäävään laatikkoon, jotta polygoni
 * ei kanna mukanaan koko Aasiaa. Leikkausraja on selvästi näkyvän
 * alueen ulkopuolella, joten leikkauksen jäljet eivät näy pelissä.
 */
import { readFileSync } from 'node:fs';

const LAHDE = process.env.NE_LAND ?? 'ne_10m_land.geojson';
const X = (lon) => (lon + 11) * 19.2;
const Y = (lat) => (72 - lat) * 26.3;

/*
 * Leikkauslaatikko. Lauta on 1000 x 1000, mutta kartta saa jatkua
 * reunojen yli: lähikuvassa sitä panoroidaan, ja Pohjois-Afrikan pitää
 * ulottua alas asti (vanha maghrebPoints päättyi y-arvoon 1160). Raja
 * on niin kaukana, ettei leikkauksen synnyttämä suora reunaviiva näy
 * pelaajalle.
 */
const LAATIKKO = { x0: -260, y0: -260, x1: 1300, y1: 1420 };
// Näkyvä alue: tämän sisällä olevat saaret otetaan mukaan.
const NAKYVA = { x0: -60, y0: -40, x1: 1060, y1: 1200 };

const data = JSON.parse(readFileSync(LAHDE, 'utf8'));

/** Kaikki ulkokehät laudan koordinaatteina. */
function kehat() {
  const ulos = [];
  for (const f of data.features) {
    const g = f.geometry;
    const monet = g.type === 'MultiPolygon' ? g.coordinates : [g.coordinates];
    // Vain ulkokehä: reiät (esim. Kaspianmeri) ovat laudan ulkopuolella.
    for (const p of monet) ulos.push(p[0].map(([lon, lat]) => [X(lon), Y(lat)]));
  }
  return ulos;
}

const ala = (r) => Math.abs(r.reduce((s, [x, y], i) => {
  const [x2, y2] = r[(i + 1) % r.length];
  return s + x * y2 - x2 * y;
}, 0)) / 2;

const laatikko = (r) => ({
  x0: Math.min(...r.map((p) => p[0])),
  x1: Math.max(...r.map((p) => p[0])),
  y0: Math.min(...r.map((p) => p[1])),
  y1: Math.max(...r.map((p) => p[1])),
});

const osuu = (b, k) => b.x1 >= k.x0 && b.x0 <= k.x1 && b.y1 >= k.y0 && b.y0 <= k.y1;

/**
 * Sutherland–Hodgman: leikkaa renkaan laatikkoon. Laatikko on kupera,
 * joten tulos on yksi suljettu rengas — juuri se osa maasta, joka jää
 * laudan ympäristöön.
 */
function leikkaa(rengas, k) {
  const reunat = [
    { sisalla: (p) => p[0] >= k.x0, leikkaus: (a, b) => kohta(a, b, 0, k.x0) },
    { sisalla: (p) => p[0] <= k.x1, leikkaus: (a, b) => kohta(a, b, 0, k.x1) },
    { sisalla: (p) => p[1] >= k.y0, leikkaus: (a, b) => kohta(a, b, 1, k.y0) },
    { sisalla: (p) => p[1] <= k.y1, leikkaus: (a, b) => kohta(a, b, 1, k.y1) },
  ];
  const kohta = (a, b, akseli, arvo) => {
    const t = (arvo - a[akseli]) / (b[akseli] - a[akseli]);
    return akseli === 0
      ? [arvo, a[1] + (b[1] - a[1]) * t]
      : [a[0] + (b[0] - a[0]) * t, arvo];
  };
  let ulos = rengas;
  for (const reuna of reunat) {
    const sisaan = ulos;
    ulos = [];
    for (let i = 0; i < sisaan.length; i += 1) {
      const a = sisaan[(i + sisaan.length - 1) % sisaan.length];
      const b = sisaan[i];
      const aSis = reuna.sisalla(a);
      const bSis = reuna.sisalla(b);
      if (bSis) {
        if (!aSis) ulos.push(reuna.leikkaus(a, b));
        ulos.push(b);
      } else if (aSis) {
        ulos.push(reuna.leikkaus(a, b));
      }
    }
    if (!ulos.length) return [];
  }
  return ulos;
}

/** Ramer–Douglas–Peucker: karsii pisteitä säilyttäen muodon. */
function harvenna(pisteet, siedatty) {
  if (pisteet.length < 3) return pisteet;
  let maxD = 0;
  let jako = 0;
  const [ax, ay] = pisteet[0];
  const [bx, by] = pisteet[pisteet.length - 1];
  const dx = bx - ax;
  const dy = by - ay;
  const pit = Math.hypot(dx, dy) || 1;
  for (let i = 1; i < pisteet.length - 1; i += 1) {
    const [px, py] = pisteet[i];
    const d = Math.abs(dy * px - dx * py + bx * ay - by * ax) / pit;
    if (d > maxD) { maxD = d; jako = i; }
  }
  if (maxD <= siedatty) return [pisteet[0], pisteet[pisteet.length - 1]];
  return [
    ...harvenna(pisteet.slice(0, jako + 1), siedatty).slice(0, -1),
    ...harvenna(pisteet.slice(jako), siedatty),
  ];
}

/**
 * Visvalingam–Whyatt: poistaa aina sen pisteen, jonka naapureineen
 * muodostama kolmio on pienin, kunnes tavoitemäärä on saavutettu.
 *
 * Miksi ei RDP: RDP säilyttää kärkipisteitä etäisyyden perusteella ja
 * jättää rannikolle neuloja — Norjan vuonoista jäi yksittäisiä piikkejä
 * ilman naapureitaan, ja pelin Catmull–Rom-pehmennys olisi kääntänyt ne
 * villeiksi silmukoiksi. Pinta-alaan perustuva karsinta on tehty juuri
 * rannikoiden yleistämiseen: neula on pieni kolmio ja häviää ensin.
 *
 * Rengas käsitellään suljettuna, joten myös ensimmäinen ja viimeinen
 * piste kilpailevat poistosta — muuten sulkevaan janaan jäisi kulma.
 */
function visvalingam(rengas, tavoite) {
  if (rengas.length <= tavoite) return rengas;
  const n = rengas.length;
  const edell = new Int32Array(n);
  const seur = new Int32Array(n);
  const elossa = new Uint8Array(n).fill(1);
  for (let i = 0; i < n; i += 1) {
    edell[i] = (i - 1 + n) % n;
    seur[i] = (i + 1) % n;
  }
  const kolmio = (i) => {
    const [ax, ay] = rengas[edell[i]];
    const [bx, by] = rengas[i];
    const [cx, cy] = rengas[seur[i]];
    return Math.abs((bx - ax) * (cy - ay) - (cx - ax) * (by - ay)) / 2;
  };
  const alat = new Float64Array(n);
  for (let i = 0; i < n; i += 1) alat[i] = kolmio(i);
  let jaljella = n;
  while (jaljella > tavoite) {
    let pienin = -1;
    for (let i = 0; i < n; i += 1) {
      if (elossa[i] && (pienin < 0 || alat[i] < alat[pienin])) pienin = i;
    }
    if (pienin < 0) break;
    elossa[pienin] = 0;
    jaljella -= 1;
    const e = edell[pienin];
    const s = seur[pienin];
    seur[e] = s;
    edell[s] = e;
    alat[e] = kolmio(e);
    alat[s] = kolmio(s);
  }
  return rengas.filter((_, i) => elossa[i]);
}

/**
 * Harvennus renkaalle kahdessa vaiheessa: karkea RDP pudottaa
 * kymmenistätuhansista pisteistä käsiteltävään määrään (silmukka on
 * neliöllinen, joten koko rannikkoa ei kannata syöttää sellaisenaan),
 * ja Visvalingam viimeistelee muodon tavoitepistemäärään.
 */
function harvennaRengas(rengas, tavoite) {
  if (rengas.length <= tavoite) return rengas;
  // RDP olettaa avoimen viivan, joten rengas kierretään alkamaan
  // läntisimmästä pisteestä: se on varmasti muodon kärki, eikä sulkeva
  // jana siksi oikaise mitään olennaista.
  let karki = 0;
  for (let i = 1; i < rengas.length; i += 1) {
    if (rengas[i][0] < rengas[karki][0]) karki = i;
  }
  let avoin = [...rengas.slice(karki), ...rengas.slice(0, karki)];
  if (avoin.length > 4000) avoin = harvenna(avoin, 0.6);
  if (avoin.length > 4000) avoin = harvenna(avoin, 1.4);
  return visvalingam(avoin, tavoite);
}

const pyorista = (r) => r.map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]);

/** Muotoilee pistelistan europe.js:n tyyliin: viisi paria riville. */
function muotoile(nimi, rengas, sisennys = '  ') {
  const rivit = [];
  for (let i = 0; i < rengas.length; i += 5) {
    rivit.push(`${sisennys}  ${rengas.slice(i, i + 5)
      .map(([x, y]) => `[${x}, ${y}]`).join(', ')},`);
  }
  return `${sisennys}${nimi}: [\n${rivit.join('\n')}\n${sisennys}],`;
}

// --- manner ------------------------------------------------------------------

const kaikki = kehat();
kaikki.sort((a, b) => ala(b) - ala(a));
const afroEuraasia = kaikki[0];
const manner = harvennaRengas(pyorista(leikkaa(afroEuraasia, LAATIKKO)), 620);

// --- saaret ------------------------------------------------------------------

/*
 * Saaret, jotka lauta piirtää omina ääriviivoinaan. Tunnistus tehdään
 * laatikolla eikä nimellä: Natural Earthin maapolygoneissa ei ole
 * nimiä, ja koordinaatit ovat yksikäsitteinen tunniste.
 *
 * Islanti puuttuu tästä listasta tarkoituksella: se on oikeasti kartan
 * ulkopuolella lännessä ja on siirretty käsin luoteisnurkkaan, joten
 * sen ääriviiva on jo europe.js:ssä omana erikoistapauksenaan.
 */
const SAARET = [
  { nimi: 'britainPoints', x: [91, 245], y: [350, 580], tavoite: 130 },
  { nimi: 'irelandPoints', x: [10, 107], y: [437, 541], tavoite: 80 },
  { nimi: 'sardiniaPoints', x: [367, 400], y: [808, 871], tavoite: 60 },
  { nimi: 'corsicaPoints', x: [375, 395], y: [762, 806], tavoite: 50 },
  { nimi: 'sicilyPoints', x: [450, 512], y: [886, 930], tavoite: 60 },
  { nimi: 'cretePoints', x: [663, 717], y: [955, 975], tavoite: 50 },
  { nimi: 'cyprusPoints', x: [831, 875], y: [955, 984], tavoite: 40 },
  { nimi: 'mallorcaPoints', x: [256, 278], y: [842, 861], tavoite: 35 },
  { nimi: 'gotlandPoints', x: [559, 578], y: [370, 397], tavoite: 30 },
  { nimi: 'saaremaaPoints', x: [630, 659], y: [352, 370], tavoite: 30 },
  { nimi: 'sjaellandPoints', x: [420, 454], y: [417, 458], tavoite: 40 },
  { nimi: 'euboeaPoints', x: [650, 683], y: [867, 895], tavoite: 40 },
];

const ulos = [muotoile('mainlandPoints', manner)];
const loydetyt = [];
for (const saari of SAARET) {
  const osumat = kaikki.filter((r) => {
    const b = laatikko(r);
    return b.x0 >= saari.x[0] - 6 && b.x1 <= saari.x[1] + 6
      && b.y0 >= saari.y[0] - 6 && b.y1 <= saari.y[1] + 6;
  });
  osumat.sort((a, b) => ala(b) - ala(a));
  if (!osumat.length) { console.error(`ei löytynyt: ${saari.nimi}`); continue; }
  const rengas = harvennaRengas(pyorista(osumat[0]), saari.tavoite);
  loydetyt.push([saari.nimi, rengas.length]);
  ulos.push(muotoile(saari.nimi, rengas));
}

console.log(ulos.join('\n'));
console.error(`\nmanner ${manner.length} pistettä (leikattu laatikkoon `
  + `${LAATIKKO.x0}..${LAATIKKO.x1} x ${LAATIKKO.y0}..${LAATIKKO.y1})`);
for (const [nimi, n] of loydetyt) console.error(`  ${nimi}: ${n} pistettä`);
console.error(`näkyvä alue ${NAKYVA.x0}..${NAKYVA.x1} x ${NAKYVA.y0}..${NAKYVA.y1}`);
