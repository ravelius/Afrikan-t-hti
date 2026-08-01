// Isoisän luonnoskirjan pulmat (Eurooppa).
//
// Sama rakenne kuin AFRICA_PUZZLES: piirros, isoisän rivi ja neljä
// vaihtoehtoa. Pulma aukeaa kerran pelissä, kun kaupunkiin saavutaan
// ensimmäistä kertaa, eikä se koskaan estä etenemistä.
//
// Piirrokset tehdään koodina inline-SVG:nä, jotta standalone- ja
// offline-versiot toimivat ilman verkkoa.
//
// Tärkein sääntö on sama kuin Afrikassa — ja Afrikan pulmista opittu
// (omistajan havainto: kuvat olivat liian kryptisiä): **pulma on
// ratkaistavissa pelkästä piirroksesta**, ja piirroksessa lukee
// selväsanaisesti mitä siinä katsotaan. Jokaisessa on esimerkkirivejä
// tai nimilaput, joista järjestelmän voi päätellä ilman ennakkotietoa.

import { el } from '../mapart.js';

const ink = (d, parent) => el('path', { d, class: 'ink' }, parent);
const fill = (d, parent) => el('path', { d, class: 'ink-fill' }, parent);
const text = (x, y, s, parent, size = 13, anchor = 'middle') => {
  const t = el('text', {
    x, y, class: 'ink-text', 'font-size': size, 'text-anchor': anchor,
  }, parent);
  t.textContent = s;
  return t;
};

const poimi = (rng, lista) => lista[Math.floor(rng() * lista.length)];
const sekoita = (rng, lista) => {
  const ulos = [...lista];
  for (let i = ulos.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [ulos[i], ulos[j]] = [ulos[j], ulos[i]];
  }
  return ulos;
};

// --- 1. Roomalaiset numerot -------------------------------------------------
// Kolme esimerkkiriviä arvoineen opettaa järjestelmän: merkit lasketaan
// yhteen, mutta pienempi ennen suurempaa vähennetään. Neljäs ratkaistaan.

const ROMAANIT = [
  { rivit: ['VII', 'XXIV', 'LX'], arvot: [7, 24, 60], kysytty: 'XLII', oikea: 42, muut: [62, 52, 38] },
  { rivit: ['VI', 'XIX', 'XL'], arvot: [6, 19, 40], kysytty: 'XCIV', oikea: 94, muut: [114, 84, 96] },
  { rivit: ['IX', 'XXXI', 'LXX'], arvot: [9, 31, 70], kysytty: 'XXIX', oikea: 29, muut: [31, 21, 39] },
];

function arvoRoomalaiset(rng) {
  const v = poimi(rng, ROMAANIT);
  const options = sekoita(rng, [v.oikea, ...v.muut]).map(String);
  return {
    sketch: { rivit: v.rivit, arvot: v.arvot, kysytty: v.kysytty },
    options,
    correct: options.indexOf(String(v.oikea)),
  };
}

const piirraRoomalaiset = (svg, data) => {
  const d = data ?? ROMAANIT[0];
  const rivit = d.rivit ?? ROMAANIT[0].rivit;
  const arvot = d.arvot ?? ROMAANIT[0].arvot;
  svg.setAttribute('viewBox', '0 0 260 150');
  text(130, 18, 'KIVEEN HAKATUT LUVUT', svg, 11);
  ink('M28,26 L232,26', svg);
  rivit.forEach((rivi, i) => {
    const y = 52 + i * 26;
    text(72, y, rivi, svg, 19);
    text(128, y, '=', svg, 14);
    text(172, y, String(arvot[i]), svg, 17);
  });
  ink('M28,124 L232,124', svg);
  const y = 143;
  text(72, y, d.kysytty ?? ROMAANIT[0].kysytty, svg, 19);
  text(128, y, '=', svg, 14);
  text(172, y, '?', svg, 19);
};

// --- 2. Pylväiden päät ------------------------------------------------------
// Kolme pylvästä nimilappuineen, neljäs kysymysmerkillä. Vastaus näkyy
// piirroksesta: sama pää kuin jollakin nimetyistä.

const PYLVAAT = ['doorilainen', 'joonialainen', 'korinttilainen'];

const piirraPaa = (x, y, tyyli, p) => {
  // Runko: uurrettu pylväs.
  fill(`M${x - 11},${y} L${x + 11},${y} L${x + 9},${y + 46} L${x - 9},${y + 46} Z`, p);
  for (const dx of [-5, 0, 5]) ink(`M${x + dx},${y + 4} L${x + dx},${y + 44}`, p);
  if (tyyli === 'doorilainen') {
    // Koruton laatta.
    fill(`M${x - 15},${y - 10} L${x + 15},${y - 10} L${x + 15},${y} L${x - 15},${y} Z`, p);
  } else if (tyyli === 'joonialainen') {
    // Kaksi kiehkuraa eli voluuttaa.
    ink(`M${x - 15},${y - 4} L${x + 15},${y - 4}`, p);
    ink(`M${x - 8},${y - 6} q-9,-2 -8,-7 q1,-5 6,-4 q4,1 3,4`, p);
    ink(`M${x + 8},${y - 6} q9,-2 8,-7 q-1,-5 -6,-4 q-4,1 -3,4`, p);
  } else {
    // Akantuksen lehdet.
    ink(`M${x - 14},${y - 2} L${x + 14},${y - 2}`, p);
    for (const dx of [-9, 0, 9]) {
      ink(`M${x + dx},${y - 3} q-4,-8 0,-14 q4,6 0,14`, p);
    }
  }
};

function arvoPylvaat(rng) {
  const jarjestys = sekoita(rng, PYLVAAT);
  const kysytty = poimi(rng, PYLVAAT);
  const options = sekoita(rng, [...PYLVAAT, 'roomalainen']);
  return {
    sketch: { jarjestys, kysytty },
    options,
    correct: options.indexOf(kysytty),
  };
}

const piirraPylvaat = (svg, data) => {
  const jarjestys = data?.jarjestys ?? PYLVAAT;
  const kysytty = data?.kysytty ?? PYLVAAT[1];
  svg.setAttribute('viewBox', '0 0 260 160');
  text(130, 16, 'PYLVÄIDEN PÄÄT — NIMET ALLA', svg, 11);
  jarjestys.forEach((tyyli, i) => {
    const x = 44 + i * 58;
    piirraPaa(x, 46, tyyli, svg);
    text(x, 108, tyyli, svg, 9);
  });
  // Neljäs: sama tyyli kuin kysytty, mutta nimen tilalla kysymysmerkki.
  ink('M226,24 L226,120', svg);
  piirraPaa(243, 46, kysytty, svg);
  text(243, 108, '?', svg, 15);
  text(130, 140, 'Mikä on neljännen pylvään nimi?', svg, 11);
};

// --- 3. Suola-altaat --------------------------------------------------------
// Neljä allasta, joissa lukee vedenpinta senttimetreinä. Piirroksessa
// kerrotaan haihtumisnopeus ja päivien määrä; valmis on se, jonka vesi
// on juuri haihtunut loppuun.

function arvoSuolaaltaat(rng) {
  const haihtuu = 2 + Math.floor(rng() * 2); // 2 tai 3 cm päivässä
  const paivia = 4 + Math.floor(rng() * 3);  // 4–6 päivää
  const oikea = haihtuu * paivia;
  const muut = [oikea + haihtuu, oikea - haihtuu, oikea + haihtuu * 2];
  const syvyydet = sekoita(rng, [oikea, ...muut]);
  const kirjaimet = ['A', 'B', 'C', 'D'];
  const options = kirjaimet.map((k, i) => `Allas ${k} (${syvyydet[i]} cm)`);
  return {
    sketch: { syvyydet, haihtuu, paivia, kirjaimet },
    options,
    correct: syvyydet.indexOf(oikea),
  };
}

const piirraSuolaaltaat = (svg, data) => {
  const d = data ?? { syvyydet: [8, 10, 12, 14], haihtuu: 2, paivia: 5, kirjaimet: ['A', 'B', 'C', 'D'] };
  svg.setAttribute('viewBox', '0 0 260 160');
  text(130, 16, 'SUOLA-ALTAAT — VEDEN SYVYYS', svg, 11);
  d.syvyydet.forEach((cm, i) => {
    const x = 26 + i * 58;
    // Allas: matala laatikko, jonka pohjalla vettä.
    ink(`M${x},44 L${x},96 L${x + 44},96 L${x + 44},44`, svg);
    fill(`M${x + 2},${96 - Math.min(48, cm * 3)} L${x + 42},${96 - Math.min(48, cm * 3)} L${x + 42},94 L${x + 2},94 Z`, svg);
    text(x + 22, 112, `${cm} cm`, svg, 12);
    text(x + 22, 36, d.kirjaimet[i], svg, 13);
  });
  ink('M14,124 L246,124', svg);
  text(130, 140, `Vettä haihtuu ${d.haihtuu} cm päivässä.`, svg, 11);
  text(130, 154, `Suola on valmista, kun allas on kuiva ${d.paivia} päivän kuluttua.`, svg, 11);
};

export const GENERATORS = {
  roomalaiset: arvoRoomalaiset,
  pylvaat: arvoPylvaat,
  suolaaltaat: arvoSuolaaltaat,
};

const SKETCHES = {
  roomalaiset: piirraRoomalaiset,
  pylvaat: piirraPylvaat,
  suolaaltaat: piirraSuolaaltaat,
};

/** Euroopan pulmat. Sama muoto kuin AFRICA_PUZZLES. */
export const EUROPE_PUZZLES = [
  {
    id: 'roomalaiset',
    generate: GENERATORS.roomalaiset,
    city: 'rooma',
    title: 'Kiveen hakatut luvut',
    selite: 'Piirroksessa: neljä kiveen hakattua lukua. Kolmen ensimmäisen arvo lukee vieressä; neljäs on ratkaistava.',
    hint: 'Merkit lasketaan yhteen vasemmalta oikealle — paitsi kun pienempi merkki on suuremman edessä, jolloin se vähennetään.',
    q: 'Forumin kivissä on lukuja kaikkialla. Opas luki kolme niistä ääneen ja jätti neljännen minun ratkaistavakseni.',
    fact: 'Roomalaisissa numeroissa I on 1, V on 5, X on 10, L on 50, C on 100. Merkit lasketaan yhteen, mutta pienempi suuremman edessä vähennetään: IV on 4 ja XL on 40. Järjestelmässä ei ole nollaa lainkaan, mikä teki laskemisesta työlästä — siksi roomalaiset käyttivät laskemiseen helmitaulua. Nykyiset numeromme tulivat Eurooppaan vasta keskiajalla arabien välityksellä Intiasta.',
    source: 'Roomalaiset numerot',
  },
  {
    id: 'pylvaat',
    generate: GENERATORS.pylvaat,
    city: 'ateena',
    title: 'Pylväiden päät',
    selite: 'Piirroksessa: neljä pylvästä ylhäältä. Kolmen nimi lukee alla, neljännen kohdalla on kysymysmerkki — sen pää on samanlainen kuin jollakin nimetyistä.',
    hint: 'Vertaa neljännen pylvään päätä kolmeen ensimmäiseen: koruton laatta, kaksi kiehkuraa vai lehtikimppu?',
    q: 'Piirsin muistiin kolme pylväänpäätä ja kirjoitin nimet alle. Neljännen kohdalla muste loppui — mutta pää ehti piirtyä.',
    fact: 'Kreikkalaisia pylväitä on kolmea päätyyliä. Doorilainen on koruton ja jykevä — sellaisia ovat Parthenonin pylväät. Joonialaisessa on kaksi kiehkuraa eli voluuttaa, ja korinttilaisessa akantuksen lehtiä. Roomalaiset lainasivat kaikki kolme ja pitivät korinttilaisesta eniten, koska se oli komein.',
    source: 'Antiikin arkkitehtuurin pylväsjärjestelmät',
  },
  {
    id: 'suolaaltaat',
    generate: GENERATORS.suolaaltaat,
    city: 'dubrovnik',
    title: 'Stonin suola-altaat',
    selite: 'Piirroksessa: neljä allasta, joissa lukee veden syvyys senttimetreinä. Alla lukee, montako senttiä haihtuu päivässä ja monenko päivän kuluttua suolan pitää olla valmis.',
    hint: 'Kerro haihtuminen päivien määrällä. Se allas on oikea, jonka vesi loppuu juuri silloin.',
    q: 'Suolamestari näytti neljä allasta ja sanoi, että vain yksi on juuri oikeassa syvyydessä tämän viikon satoon. Muut ovat liian täynnä tai jo liian tyhjiä.',
    fact: 'Stonissa on kerätty suolaa 1300-luvulta asti samalla tavalla: merivesi johdetaan matalille kentille ja aurinko haihduttaa sen. Suola oli Dubrovnikin tasavallan tärkein tulonlähde — niin tärkeä, että sitä suojaamaan rakennettiin viiden kilometrin muuri, Euroopan pisin linnoitusmuuri Kiinan muurin jälkeen.',
    source: 'Stonin suola-altaat',
  },
];

/** Piirtää Euroopan pulman luonnoksen annettuun SVG-elementtiin. */
export function drawPuzzle(svg, id, data) {
  SKETCHES[id]?.(svg, data);
}

/** Onko pulmalle olemassa piirros? Testit vartioivat tätä. */
export function hasSketch(id) {
  return typeof SKETCHES[id] === 'function';
}
