// Oseania-lauta: kaupungit, reitit, kartan piirtotiedot ja teema.
//
// Koordinaatisto on 1000 x 1000 yksikköä.
//
// Kartta on Lambertin konformisessa kartioprojektiossa, standardileveys-
// piireinä 10° ja 40° etelää ja keskimeridiaanina 145° itäistä pituutta.
// Lähdeaineisto on tools/mapdata/oceania.json ja koordinaatit lasketaan
// komennolla `node tools/project.mjs oceania`.
//
// Manner on Australia. Uusi-Guinea, Tasmania, Uuden-Seelannin kaksi saarta,
// Timor, Bali, Salomonsaaret, Vanuatu, Uusi-Kaledonia, Norfolk ja Fidži ovat
// omia saariaan, joihin pääsee vain laivalla — tällä laudalla laivamatkoja on
// enemmän kuin millään muulla.

import { OCEANIA_QUESTIONS, OCEANIA_FACTS } from './oceania-questions.js';
import { themedTokenTypes } from '../tokens.js';

const OC_MAP = {
  width: 1000,
  height: 1000,
  australiaPoints: [
    [449.3, 286.5], [491.5, 350.4], [505.7, 406.4], [543.4, 432.7], [568.6, 466.6],
    [595.9, 518.9], [600.4, 553.6], [582.2, 620.2], [559.1, 655.3], [523.5, 692.3],
    [502.7, 711.9], [482.3, 704.1], [469.2, 710.4], [446.2, 704.6], [424, 690],
    [413, 663], [398, 659.2], [392.3, 624.7], [375.3, 654.5], [348.2, 627.7],
    [321.5, 615], [282.9, 614.7], [246.2, 628.6], [218.8, 658.7], [175.6, 666.3],
    [148.3, 688.7], [116.5, 683.2], [107.2, 648.2], [71, 567.4], [56.2, 517.2],
    [93, 478.1], [148.4, 453.4], [162.1, 425], [178.1, 397.9], [216.1, 355.4],
    [260.2, 363.5], [272.3, 325.4], [301.5, 316.3], [343.4, 314.4], [365.7, 309.8],
    [354.2, 339.7], [370.8, 370.6], [406.8, 394.4], [437.7, 367.7], [436.4, 319.1],
  ],
  tasmaniaPoints: [
    [483.6, 739.6], [525.9, 743.2], [525.1, 774.4], [510, 785.2], [492.9, 778.7],
    [482.5, 750.5],
  ],
  newGuineaPoints: [
    [257.8, 144.8], [324.9, 146.9], [390.5, 159.2], [439, 165.6], [495.1, 189.1],
    [531.1, 213.3], [573.5, 214.6], [576.8, 246.2], [525.2, 275.7], [456.4, 260.1],
    [379.3, 254.9], [314.6, 220], [272.4, 191.9],
  ],
  nzNorthPoints: [
    [830.6, 678.8], [857.6, 717.4], [889.1, 742.4], [876.9, 766.2], [855.2, 780],
    [831.9, 792.1], [826.4, 773.4], [843.4, 751.9], [826.1, 718.2],
  ],
  nzSouthPoints: [
    [811.4, 770.2], [825.8, 792.4], [819.2, 811.8], [802.6, 817.8], [772.1, 849],
    [743.8, 855.2], [728.2, 841.1], [742, 812.8], [774.4, 794.6], [794.5, 782.6],
  ],
  timorPoints: [
    [164.7, 275.8], [215, 268.5], [212.1, 281.5], [173.4, 291.8], [158.5, 286.3],
  ],
  baliPoints: [
    [18, 298.1], [39.1, 293.3], [42.5, 308.5], [21.2, 311.7],
  ],
  solomonPoints: [
    [673.5, 241.7], [717.8, 265], [748.6, 303.1], [724.7, 298.6], [694, 270.3],
    [665.2, 247.2],
  ],
  vanuatuPoints: [
    [808.5, 376.8], [826, 404.4], [832.2, 442.3], [816.5, 433.4], [806.7, 396.5],
    [799.1, 379.9],
  ],
  newCaledoniaPoints: [
    [751.3, 445.9], [792.5, 490.1], [786.1, 495.1], [746.1, 452.7],
  ],
  norfolkPoints: [
    [783.5, 584.1], [789.9, 585.2], [788.6, 592.6], [782.2, 591.5],
  ],
  fijiPoints: [
    [946.4, 442.2], [971.3, 443.8], [982, 465.3], [953.6, 461], [940.1, 449.9],
  ],
};

// start = aloituskaupunki (ei laattaa), airport = lentokenttä.
const OC_CITIES = [
  {
    id: 'sydney', name: 'Sydney', x: 563, y: 633, start: true, airport: true,
    la: 'start', lx: 18, ly: 5,
    // Sama kaupunki on myös Maailma-laudalla.
    links: [{ pack: 'maailma', city: 'sydney', label: 'Maailma-lauta' }],
  },
  {
    id: 'perth', name: 'Perth', x: 123, y: 643, start: true, airport: true,
    la: 'start', lx: 18, ly: 5,
  },

  { id: 'melbourne', name: 'Melbourne', x: 487, y: 689, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'brisbane', name: 'Brisbane', x: 588, y: 541, airport: true, la: 'start', lx: 16, ly: 5 },
  { id: 'cairns', name: 'Cairns', x: 496, y: 381, airport: true, la: 'start', lx: 16, ly: 5 },
  { id: 'darwin', name: 'Darwin', x: 277, y: 326, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'adelaide', name: 'Adelaide', x: 407, y: 648, airport: true, la: 'end', lx: -16, ly: 16 },
  { id: 'alicesprings', name: 'Alice Springs', x: 335, y: 489, la: 'start', lx: 16, ly: 5 },
  { id: 'uluru', name: 'Uluru', x: 286, y: 522, la: 'end', lx: -16, ly: 5 },
  { id: 'broome', name: 'Broome', x: 165, y: 423, la: 'start', lx: 16, ly: 5 },
  { id: 'kalgoorlie', name: 'Kalgoorlie', x: 185, y: 614, la: 'middle', lx: 0, ly: -22 },
  { id: 'townsville', name: 'Townsville', x: 521, y: 435, la: 'start', lx: 16, ly: 5 },
  { id: 'hobart', name: 'Hobart', x: 513, y: 770, la: 'start', lx: 16, ly: 5 },
  { id: 'nullarbor', name: 'Nullarbor', x: 295, y: 609, la: 'middle', lx: 0, ly: 28 },
  { id: 'birdsville', name: 'Birdsville', x: 412, y: 517, la: 'start', lx: 16, ly: 5 },
  { id: 'exmouth', name: 'Exmouth', x: 74, y: 508, la: 'start', lx: 16, ly: 5 },
  { id: 'mountisa', name: 'Mount Isa', x: 410, y: 439, la: 'end', lx: -16, ly: 5 },
  { id: 'cooberpedy', name: 'Coober Pedy', x: 354, y: 567, la: 'start', lx: 16, ly: -6 },
  { id: 'geraldton', name: 'Geraldton', x: 88, y: 588, la: 'end', lx: -16, ly: 5 },
  { id: 'portmoresby', name: 'Port Moresby', x: 519, y: 266, la: 'start', lx: 16, ly: 5 },
  { id: 'sepik', name: 'Sepik', x: 459, y: 189, la: 'middle', lx: 0, ly: -22 },
  { id: 'honiara', name: 'Honiara', x: 715, y: 279, la: 'start', lx: 16, ly: 5 },
  { id: 'portvila', name: 'Port Vila', x: 820, y: 422, la: 'start', lx: 16, ly: 5 },
  { id: 'noumea', name: 'Nouméa', x: 782, y: 484, la: 'start', lx: 16, ly: 5 },
  { id: 'norfolk', name: 'Norfolk', x: 786, y: 588, la: 'start', lx: 16, ly: 5 },
  { id: 'suva', name: 'Suva', x: 960, y: 458, la: 'end', lx: -16, ly: 20 },
  { id: 'auckland', name: 'Auckland', x: 848, y: 721, airport: true, la: 'start', lx: 16, ly: -6 },
  { id: 'wellington', name: 'Wellington', x: 836, y: 787, la: 'start', lx: 16, ly: 5 },
  { id: 'christchurch', name: 'Christchurch', x: 793, y: 821, la: 'start', lx: 16, ly: 12 },
  { id: 'milfordsound', name: 'Milford Sound', x: 739, y: 833, la: 'end', lx: -16, ly: 5 },
  { id: 'dili', name: 'Dili', x: 190, y: 278, la: 'middle', lx: 0, ly: -22 },
  {
    id: 'bali', name: 'Bali', x: 30, y: 303, airport: true, la: 'middle', lx: 0, ly: 28,
    // Indonesian saariketju jatkuu lännessä Aasian laudalle.
    links: [{ pack: 'asia', city: 'jakarta', label: 'Aasian lauta' }],
  },
];

// steps = kuinka monta silmälukua reitin kulkeminen vaatii.
// type 'sea' = laivareitti; via = piirto- ja tarkistuspisteet veden päällä.
const OC_EDGES = [
  // Länsi-Australia
  { a: 'perth', b: 'geraldton', steps: 3 },
  { a: 'geraldton', b: 'exmouth', steps: 5 },
  { a: 'exmouth', b: 'broome', steps: 6 },
  { a: 'broome', b: 'darwin', steps: 6 },
  { a: 'perth', b: 'kalgoorlie', steps: 3 },
  { a: 'kalgoorlie', b: 'nullarbor', steps: 4 },
  { a: 'nullarbor', b: 'cooberpedy', steps: 4 },
  { a: 'kalgoorlie', b: 'adelaide', steps: 6 },

  // Punainen keskusta
  { a: 'darwin', b: 'alicesprings', steps: 6 },
  { a: 'darwin', b: 'mountisa', steps: 6 },
  { a: 'alicesprings', b: 'uluru', steps: 3 },
  { a: 'alicesprings', b: 'mountisa', steps: 5 },
  { a: 'uluru', b: 'cooberpedy', steps: 4 },
  { a: 'cooberpedy', b: 'adelaide', steps: 4 },
  { a: 'mountisa', b: 'birdsville', steps: 4 },
  { a: 'birdsville', b: 'adelaide', steps: 5 },
  { a: 'birdsville', b: 'brisbane', steps: 6 },

  // Itärannikko
  { a: 'mountisa', b: 'townsville', steps: 4 },
  { a: 'townsville', b: 'cairns', steps: 3 },
  { a: 'townsville', b: 'brisbane', steps: 5 },
  { a: 'brisbane', b: 'sydney', steps: 4 },
  { a: 'sydney', b: 'melbourne', steps: 4 },
  { a: 'sydney', b: 'adelaide', steps: 6 },
  { a: 'melbourne', b: 'adelaide', steps: 4 },

  // Uusi-Guinea
  { a: 'portmoresby', b: 'sepik', steps: 5 },

  // Uusi-Seelanti
  { a: 'auckland', b: 'wellington', steps: 5 },
  { a: 'christchurch', b: 'milfordsound', steps: 5 },

  // Laivareitit
  { a: 'cairns', b: 'portmoresby', steps: 4, type: 'sea', via: [[495, 322], [502, 291]] },
  { a: 'portmoresby', b: 'honiara', steps: 5, type: 'sea', via: [[594, 278], [655, 275]] },
  { a: 'honiara', b: 'portvila', steps: 5, type: 'sea', via: [[756, 324], [794, 376]] },
  { a: 'portvila', b: 'noumea', steps: 3, type: 'sea', via: [[802, 454]] },
  { a: 'noumea', b: 'norfolk', steps: 4, type: 'sea', via: [[783, 534]] },
  { a: 'norfolk', b: 'auckland', steps: 5, type: 'sea', via: [[804, 637], [820, 686]] },
  { a: 'noumea', b: 'suva', steps: 4, type: 'sea', via: [[851, 463], [910, 460]] },
  { a: 'suva', b: 'auckland', steps: 6, type: 'sea', via: [[920, 539], [886, 623], [860, 679]] },
  { a: 'wellington', b: 'christchurch', steps: 3, type: 'sea', via: [[823, 801]] },
  { a: 'sydney', b: 'auckland', steps: 7, type: 'sea', via: [[637, 644], [735, 671], [805, 698]] },
  { a: 'hobart', b: 'melbourne', steps: 4, type: 'sea', via: [[499, 730]] },
  { a: 'hobart', b: 'sydney', steps: 6, type: 'sea', via: [[552, 746], [578, 701]] },
  { a: 'darwin', b: 'dili', steps: 4, type: 'sea', via: [[239, 309], [206, 295]] },
  { a: 'dili', b: 'bali', steps: 5, type: 'sea', via: [[122, 302], [69, 308]] },
  { a: 'broome', b: 'dili', steps: 5, type: 'sea', via: [[178, 361], [189, 313]] },
  { a: 'brisbane', b: 'noumea', steps: 6, type: 'sea', via: [[647, 539], [719, 502]] },
];

// Lentoreitit kulkevat suoraan kaupungista toiseen yhdellä vuorolla.
const OC_AIR_ROUTES = [
  { a: 'perth', b: 'adelaide' },
  { a: 'perth', b: 'darwin' },
  { a: 'adelaide', b: 'melbourne' },
  { a: 'melbourne', b: 'sydney' },
  { a: 'sydney', b: 'brisbane' },
  { a: 'brisbane', b: 'cairns' },
  { a: 'cairns', b: 'darwin' },
  { a: 'darwin', b: 'bali' },
  { a: 'sydney', b: 'auckland' },
];

export const OCEANIA = {
  id: 'oceania',
  name: 'Oseanian tähti',
  boardLabel: 'Oseania',
  tagline: 'Etsi tähti punaiselta keskustalta, Suurelta valliriutalta ja Tyynenmeren saarilta.',
  ariaLabel: 'Oseanian aarrekartta',

  map: {
    ...OC_MAP,
    outlines: [
      OC_MAP.australiaPoints, OC_MAP.tasmaniaPoints, OC_MAP.newGuineaPoints,
      OC_MAP.nzNorthPoints, OC_MAP.nzSouthPoints, OC_MAP.timorPoints,
      OC_MAP.baliPoints, OC_MAP.solomonPoints, OC_MAP.vanuatuPoints,
      OC_MAP.newCaledoniaPoints, OC_MAP.norfolkPoints, OC_MAP.fijiPoints,
    ],
  },
  cities: OC_CITIES,
  edges: OC_EDGES,
  airRoutes: OC_AIR_ROUTES,
  islands: [
    'hobart', 'portmoresby', 'sepik', 'honiara', 'portvila', 'noumea', 'norfolk',
    'suva', 'auckland', 'wellington', 'christchurch', 'milfordsound',
    'dili', 'bali',
  ],
  minCityDistance: 50,

  tokens: {
    // Topaasin tilalla opaali: Coober Pedy tuottaa valtaosan maailman
    // jalo-opaaleista, ja kaivoskaupungissa asutaan maan alla helteen takia.
    types: themedTokenTypes({
      star: { name: 'Oseanian tähti' },
      topaz: { name: 'Opaali', color: '#7fb7c9' },
    }),
    counts: { star: 1, horseshoe: 2, robber: 3, ruby: 4, emerald: 5, topaz: 6, empty: 9 },
  },

  questions: OCEANIA_QUESTIONS,
  placeFacts: OCEANIA_FACTS,

  worldPos: { x: 300, y: 152 },
  duels: [
    {
      q: 'Mikä on maailman suurin koralliriutta?',
      options: ['Suuri valliriutta', 'Belizen riutta', 'Punaisenmeren riutta',
        'Malediivien riutta', 'Ningaloo', 'Tubbataha', 'Andros', 'Apo'],
      correct: 0,
      fact: 'Suuri valliriutta on yli 2 300 kilometriä pitkä Australian koillisrannikolla ja näkyy avaruuteen asti.',
    },
    {
      q: 'Mikä on Australian pääkaupunki?',
      options: ['Canberra', 'Sydney', 'Melbourne', 'Brisbane',
        'Perth', 'Adelaide', 'Darwin', 'Hobart'],
      correct: 0,
      fact: 'Canberra rakennettiin varta vasten pääkaupungiksi, koska Sydney ja Melbourne eivät päässeet sopuun kummalle tehtävä kuuluisi.',
    },
    {
      q: 'Mikä eläin ei ole pussieläin?',
      options: ['vombattinokkaeläin', 'kenguru', 'koala', 'vompatti',
        'kuseli', 'bandikoot', 'tasmanianpiru', 'sokeriliito'],
      correct: 0,
      fact: 'Kysymyksen ensimmäistä eläintä ei ole olemassa. Nokkaeläin on munivista nisäkkäistä, ei pussieläin — kaikki muut listalla ovat pussieläimiä.',
    },
    {
      q: 'Mikä kansa asutti Uuden-Seelannin ennen eurooppalaisia?',
      options: ['maorit', 'aboriginaalit', 'inuiitit', 'polynesialaiset samoalaiset',
        'melanesialaiset', 'mikronesialaiset', 'papualaiset', 'havaijilaiset'],
      correct: 0,
      fact: 'Maorit saapuivat Uuteen-Seelantiin polynesialaisilta saarilta noin 1300-luvulla. Maan nimi heidän kielellään on Aotearoa.',
    },
    {
      q: 'Mikä on Oseanian korkein vuori?',
      options: ['Puncak Jaya', 'Mount Kosciuszko', 'Aoraki', 'Mauna Kea',
        'Mount Wilhelm', 'Mount Ossa', 'Ruapehu', 'Uluru'],
      correct: 0,
      fact: 'Puncak Jaya Uudessa-Guineassa kohoaa 4 884 metriin. Sen huipulla on jäätikkö, vaikka vuori on lähellä päiväntasaajaa.',
    },
    {
      q: 'Mikä valtameri ympäröi Oseaniaa?',
      options: ['Tyynimeri', 'Atlantti', 'Jäämeri', 'Karibianmeri',
        'Pohjanmeri', 'Mustameri', 'Välimeri', 'Baltia'],
      correct: 0,
      fact: 'Tyynimeri on maailman suurin valtameri: se peittää kolmanneksen maapallon pinnasta ja on laajempi kuin kaikki mantereet yhteensä.',
    },
  ],

  texts: {
    intro: 'Peli alkaa! Etsikää Oseanian tähti ja palatkaa Sydneyyn tai Perthiin.',
    starFound: (name, city) => `★ ${name} löysi OSEANIAN TÄHDEN kaupungista ${city}!`,
    starToast: 'OSEANIAN TÄHTI!',
    starChase: 'Nyt on kiire kotiin — myös hevosenkengän haltija voi voittaa pelin.',
    winStar: 'toi Oseanian tähden turvallisesti kotiin',
    winnerStar: (name, money) => `${name} toi Oseanian tähden kotiin ${money} punnan kanssa.`,
  },

  decor: {
    mapLabel: 'OSEANIA',
    mapLabelPos: { x: 240, y: 880 },
    compass: { x: 690, y: 130, r: 58 },
    waveSkip: [
      { x: 240, y: 880, r: 130 },
      { x: 690, y: 130, r: 100 },
      { x: 130, y: 180, r: 95 },
      { x: 880, y: 176, r: 105 },
    ],
    ship: { x: 880, y: 176 },
    serpent: { x: 130, y: 180 },
    dieSpot: { x: 0.06, y: 0.86 },
    terrainBands: [
      { maxY: 380, kind: 'trees' },
      { maxY: 620, kind: 'mountains' },
      { maxY: Infinity, kind: 'trees' },
    ],
  },
};
