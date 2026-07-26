// Maailma-lauta: koko maapallo yhtenä vieritettävänä pelilautana.
//
// Koordinaatisto on 1000 x 1000 yksikköä ja kattaa koko maapallon:
//   x = (pituusaste + 180) / 0.36    (lännestä 180°W itään 180°E)
//   y = 305 + (80 - leveysaste) * 1000/360  (pohjoisesta 80°N etelään 60°S)
//
// Mittakaava on sama molemmissa suunnissa, joten mantereet eivät veny
// pystysuunnassa. Kartan ylä- ja alalaitaan jää siksi avomerta.
//
// Mantereet ylitetään laivalla valtamerten poikki tai lentäen. Tässä on
// aluksi vain yksi kaupunki mannerta kohden — yhteisö voi lisätä kaupunkeja
// ja tihentää verkkoa. Kairosta laskeudutaan Afrikan ja Lähi-idän
// tarkemmille laudoille.

import { MAAILMA_QUESTIONS, MAAILMA_FACTS } from './maailma-questions.js';
import { themedTokenTypes } from '../tokens.js';

const WORLD_MAP = {
  width: 1000,
  height: 1000,
  // Amerikat: yksi manner Alaskasta Kap Hornille, Panama kannaksena.
  americasPoints: [
    [33.3, 343.9], [38.9, 360.6], [83.3, 363.3], [125.0, 366.1], [152.8, 391.1],
    [155.6, 416.1], [175.0, 435.6], [194.4, 463.3], [208.3, 471.7], [233.3, 482.8],
    [263.9, 499.4], [283.3, 507.8], [280.6, 532.8], [275.0, 543.9], [288.9, 566.1],
    [305.6, 577.2], [302.8, 610.6], [297.2, 638.3], [300.0, 666.1], [311.1, 680.0],
    [319.4, 652.2], [327.8, 635.6], [341.7, 624.4], [366.7, 605.0], [388.9, 588.3],
    [402.8, 549.5], [377.8, 535.6], [361.1, 527.2], [355.6, 513.3], [333.3, 502.2],
    [322.2, 499.4], [300.0, 493.9], [286.1, 502.2], [269.4, 496.7], [255.6, 482.8],
    [258.3, 468.9], [250.0, 474.4], [230.6, 455.0], [238.9, 446.7], [252.8, 446.7],
    [272.2, 452.2], [277.8, 457.8], [275.0, 441.1], [288.9, 430.0], [294.4, 416.1],
    [305.6, 407.8], [316.7, 402.2], [333.3, 396.7], [347.2, 382.8], [338.9, 374.5],
    [322.2, 360.6], [311.1, 349.5], [277.8, 341.1], [250.0, 335.6], [194.4, 338.3],
    [138.9, 332.8], [83.3, 330.0], [50.0, 332.8],
  ],
  // Afrikka, Eurooppa ja Aasia ovat yhtä mannermassaa; Itämeri, Välimeri,
  // Mustameri ja Punainenmeri ovat sen sisäänvetoja.
  afroeurasiaPoints: [
    [475.0, 407.8], [497.2, 399.5], [486.1, 393.9], [500.0, 391.1], [511.1, 382.8],
    [522.2, 377.2], [525.0, 370.3], [530.6, 367.5], [536.1, 375.8], [555.6, 374.5],
    [577.8, 361.9], [566.7, 359.2], [547.2, 360.6], [533.3, 367.5], [527.8, 363.3],
    [513.9, 357.8], [538.9, 338.3], [569.4, 330.0], [625.0, 338.3], [666.7, 335.6],
    [708.3, 324.4], [750.0, 316.1], [805.6, 313.3], [861.1, 324.4], [916.7, 332.8],
    [972.2, 332.8], [994.4, 343.9], [972.2, 360.6], [950.0, 371.7], [930.6, 388.3],
    [888.9, 377.2], [875.0, 405.0], [863.9, 407.8], [858.3, 430.0], [838.9, 424.4],
    [836.1, 438.4], [825.0, 463.3], [800.0, 468.9], [797.2, 480.0], [791.7, 499.4],
    [786.1, 524.5], [777.8, 507.8], [772.2, 493.9], [761.1, 482.8], [752.8, 466.1],
    [738.9, 471.7], [722.2, 485.6], [713.9, 505.0], [702.8, 485.6], [700.0, 468.9],
    [683.3, 457.8], [661.1, 457.8], [658.3, 455.0], [666.7, 466.1], [650.0, 480.0],
    [625.0, 490.1], [619.4, 489.7], [600.0, 449.4], [588.9, 452.2], [613.9, 493.9],
    [641.7, 498.0], [633.3, 513.3], [619.4, 527.2], [611.1, 549.5], [600.0, 577.2],
    [597.2, 593.9], [591.7, 610.6], [577.8, 621.7], [550.0, 621.7], [533.3, 577.2],
    [525.0, 541.1], [525.0, 516.1], [500.0, 510.6], [477.8, 516.1], [463.9, 502.2],
    [452.8, 485.6], [455.6, 468.9], [472.2, 443.9], [483.3, 433.3], [508.3, 427.2],
    [527.8, 424.4], [541.7, 438.4], [555.6, 441.1], [569.4, 438.4], [583.3, 441.1],
    [589.7, 443.9], [597.2, 435.6], [600.0, 425.8], [583.3, 427.2], [575.0, 424.4],
    [572.2, 416.1], [580.6, 413.3], [597.2, 410.5], [613.9, 411.9], [615.3, 407.8],
    [602.8, 402.2], [591.7, 399.5], [583.3, 399.5], [577.8, 407.8], [579.2, 412.8],
    [566.7, 416.1], [558.3, 421.7], [563.9, 427.2], [550.0, 416.1], [538.9, 402.2],
    [533.3, 405.0], [544.4, 421.7], [533.3, 413.3], [527.8, 405.0], [513.9, 407.8],
    [508.3, 410.5], [500.0, 418.9], [494.4, 423.6], [485.6, 423.3], [475.0, 424.4],
  ],
  britainPoints: [
    [486.1, 388.3], [502.8, 385.5], [501.4, 380.0], [495.8, 371.7], [488.9, 366.1],
    [483.3, 374.5], [486.1, 380.0], [487.5, 385.5],
  ],
  australiaPoints: [
    [816.7, 588.3], [838.9, 577.2], [863.9, 560.5], [880.6, 560.5], [894.4, 557.8],
    [905.6, 580.0], [916.7, 588.3], [925.0, 602.2], [919.4, 621.7], [905.6, 635.6],
    [888.9, 632.8], [875.0, 624.4], [858.3, 616.1], [844.4, 618.9], [819.4, 621.7],
    [813.9, 599.4],
  ],
};

// start = aloituskaupunki (ei laattaa), airport = lentokenttä.
const WORLD_CITIES = [
  { id: 'lontoo', name: 'Lontoo', x: 500, y: 384.3, start: true, airport: true, la: 'end', lx: -16, ly: 5,
    links: [{ pack: 'europe', city: 'lontoo', label: 'Euroopan lauta' }] },
  {
    id: 'newyork', name: 'New York', x: 287, y: 415.1, start: true, airport: true,
    la: 'end', lx: -16, ly: 5,
    links: [{ pack: 'northamerica', city: 'newyork', label: 'Pohjois-Amerikan lauta' }],
  },

  {
    id: 'kairo', name: 'Kairo', x: 585, y: 446.9, airport: true, la: 'start', lx: 16, ly: 5,
    // Kairosta laskeudutaan tarkemmille laudoille.
    links: [
      { pack: 'africa', city: 'kairo', label: 'Afrikan lauta' },
      { pack: 'middleeast', city: 'kairo', label: 'Lähi-idän lauta' },
    ],
  },
  {
    id: 'rio', name: 'Rio de Janeiro', x: 380, y: 590.8, airport: true, la: 'end', lx: -16, ly: 5,
    // Sama kaupunki on myös Etelä-Amerikan laudalla.
    links: [{ pack: 'southamerica', city: 'rio', label: 'Etelä-Amerikan lauta' }],
  },
  {
    id: 'mumbai', name: 'Mumbai', x: 706, y: 473.0, airport: true, la: 'start', lx: 16, ly: 5,
    links: [
      { pack: 'asia', city: 'mumbai', label: 'Aasian lauta' },
      { pack: 'middleeast', city: 'dubai', label: 'Lähi-idän lauta' },
    ],
  },
  {
    id: 'peking', name: 'Peking', x: 823, y: 416.2, airport: true, la: 'end', lx: -16, ly: 5,
    links: [{ pack: 'asia', city: 'peking', label: 'Aasian lauta' }],
  },
  { id: 'sydney', name: 'Sydney', x: 913, y: 620.0, airport: true, la: 'end', lx: -16, ly: -10 },
  {
    id: 'moskova', name: 'Moskova', x: 604, y: 372.3, airport: true, la: 'start', lx: 16, ly: 5,
    links: [{ pack: 'europe', city: 'moskova', label: 'Euroopan lauta' }],
  },
];

// steps = kuinka monta silmälukua reitin kulkeminen vaatii.
// type 'sea' = valtamerireitti; via = reittipisteet veden päällä.
const WORLD_EDGES = [
  // Siperian rata on laudan ainoa maareitti.
  { a: 'moskova', b: 'peking', steps: 7, via: [[667, 374.6], [750, 388.2], [792, 402.2]] },

  // Valtamerten laivareitit
  { a: 'lontoo', b: 'newyork', steps: 5, type: 'sea', via: [[417, 388.2], [361, 402.2]] },
  {
    a: 'lontoo', b: 'kairo', steps: 5, type: 'sea',
    via: [[483, 390.9], [472, 407.7], [472, 427.1], [479, 428.3], [486, 428.7], [497, 425.6], [510, 422.8], [533, 420.1], [550, 429.8], [578, 434.1]],
  },
  { a: 'lontoo', b: 'moskova', steps: 4, type: 'sea', via: [[508, 377.3], [528, 371.5], [553, 370.3], [571, 364.1]] },
  { a: 'newyork', b: 'rio', steps: 5, type: 'sea', via: [[306, 429.8], [347, 471.8], [375, 513.4], [417, 527.1], [411, 569.1]] },
  {
    a: 'kairo', b: 'mumbai', steps: 5, type: 'sea',
    via: [[597, 455.1], [610, 480.0], [617, 491.7], [632, 492.1], [655, 487.0], [689, 480.0]],
  },
  {
    a: 'mumbai', b: 'peking', steps: 6, type: 'sea',
    via: [[711, 513.4], [774, 519.7], [786, 527.4], [806, 494.0], [823, 467.6], [844, 438.4], [844, 427.1]],
  },
  { a: 'peking', b: 'sydney', steps: 6, type: 'sea', via: [[861, 457.8], [889, 499.4], [911, 549.6], [928, 577.2], [932, 601.3]] },
  {
    a: 'mumbai', b: 'sydney', steps: 6, type: 'sea',
    via: [[711, 513.4], [740, 557.8], [778, 604.8], [817, 632.8], [875, 638.3], [911, 632.8]],
  },
];

// Mannertenväliset lennot.
const WORLD_AIR_ROUTES = [
  { a: 'lontoo', b: 'newyork' },
  { a: 'lontoo', b: 'kairo' },
  { a: 'kairo', b: 'mumbai' },
  { a: 'mumbai', b: 'peking' },
  { a: 'peking', b: 'sydney' },
  { a: 'newyork', b: 'sydney' },
  { a: 'newyork', b: 'rio' },
  { a: 'lontoo', b: 'moskova' },
  { a: 'moskova', b: 'peking' },
];

export const MAAILMA = {
  id: 'maailma',
  name: 'Maailman tähti',
  boardLabel: 'Maailma',
  tagline: 'Kierrä maapallo: valtameret, mantereet ja suuret kaupungit.',
  ariaLabel: 'Maailman aarrekartta',

  map: {
    ...WORLD_MAP,
    outlines: [
      WORLD_MAP.americasPoints, WORLD_MAP.afroeurasiaPoints,
      WORLD_MAP.britainPoints, WORLD_MAP.australiaPoints,
    ],
  },
  cities: WORLD_CITIES,
  edges: WORLD_EDGES,
  airRoutes: WORLD_AIR_ROUTES,
  islands: [],
  // Oikeassa mittakaavassa esimerkiksi Kairo ja Moskova ovat aidosti lähekkäin.
  minCityDistance: 70,

  tokens: {
    types: themedTokenTypes({ star: { name: 'Maailman tähti' } }),
    counts: { star: 1, horseshoe: 1, robber: 1, ruby: 1, emerald: 1, topaz: 1 },
  },

  questions: MAAILMA_QUESTIONS,
  placeFacts: MAAILMA_FACTS,

  // Sijainti maailmankartalla ja rosvon kaksintaistelukysymykset.
  worldPos: { x: 60, y: 40 },
  duels: [
    {
      q: 'Mikä näistä maista on väkiluvultaan suurin?',
      options: ['Indonesia', 'Brasilia', 'Nigeria', 'Venäjä', 'Japani', 'Meksiko', 'Saksa', 'Egypti'],
      correct: 0,
      fact: 'Indonesiassa on lähes 300 miljoonaa asukasta — maailman neljänneksi eniten.',
    },
    {
      q: 'Mikä on maailman pienin itsenäinen valtio?',
      options: ['Vatikaani', 'Monaco', 'Malta', 'San Marino', 'Liechtenstein', 'Andorra', 'Luxemburg', 'Nauru'],
      correct: 0,
      fact: 'Vatikaani on alle puolen neliökilometrin kokoinen — sen ympäri kävelee tunnissa.',
    },
    {
      q: 'Missä on maailman syvin tunnettu kohta?',
      options: ['Mariaanien haudassa', 'Kuolleessameressä', 'Baikaljärvessä', 'Grand Canyonissa', 'Tongan haudassa', 'Jaavan haudassa', 'Atlantin keskiselänteellä', 'Mustassameressä'],
      correct: 0,
      fact: 'Mariaanien hauta Tyynellämerellä ulottuu lähes 11 kilometrin syvyyteen.',
    },
    {
      q: 'Kuinka pitkä on päiväntasaajan ympärysmitta?',
      options: ['noin 40 000 km', 'noin 4 000 km', 'noin 10 000 km', 'noin 20 000 km', 'noin 60 000 km', 'noin 100 000 km', 'noin 400 000 km', 'noin miljoona km'],
      correct: 0,
      fact: 'Metri määriteltiin alun perin niin, että napojen kautta kulkeva ympärysmitta on 40 miljoonaa metriä.',
    },
    {
      q: 'Mikä raja kulkee Tyynenmeren poikki niin, että sen ylittäessä vaihtuu päivä?',
      options: ['kansainvälinen päivämääräraja', 'nollameridiaani', 'päiväntasaaja', 'Kauriin kääntöpiiri', 'Kravun kääntöpiiri', 'pohjoinen napapiiri', 'eteläinen napapiiri', 'keskipäivän linja'],
      correct: 0,
      fact: 'Päivämäärärajan länsipuolella on aina eri vuorokausi kuin itäpuolella — raja mutkittelee saarivaltioiden ympäri.',
    },
  ],

  texts: {
    intro: 'Peli alkaa! Etsikää Maailman tähti ja palatkaa Lontooseen tai New Yorkiin.',
    starFound: (name, city) => `★ ${name} löysi MAAILMAN TÄHDEN kaupungista ${city}!`,
    starToast: 'MAAILMAN TÄHTI!',
    starChase: 'Nyt on kiire kotiin — myös hevosenkengän haltija voi voittaa pelin.',
    winStar: 'toi Maailman tähden turvallisesti kotiin',
    winnerStar: (name, money) => `${name} toi Maailman tähden kotiin ${money} punnan kanssa.`,
  },

  decor: {
    mapLabel: 'MAAILMA',
    mapLabelPos: { x: 140, y: 655.0 },
    compass: { x: 85, y: 526.7, r: 58 },
    waveSkip: [
      { x: 417, y: 457.8, r: 90 },
      { x: 736, y: 638.3, r: 100 },
      { x: 140, y: 655.0, r: 130 },
    ],
    ship: { x: 417, y: 457.8 },
    serpent: { x: 736, y: 638.3 },
    // Nopan lepopaikka: Tyynimeri laudan vasemmassa laidassa.
    dieSpot: { x: 0.08, y: 0.62 },
    // Pohjoisessa vuoria ja tuntureita, keskivyöhykkeellä metsää,
    // tropiikissa aavikoita ja etelässä taas metsää.
    terrainBands: [
      { maxY: 402.2, kind: 'mountains' },
      { maxY: 487.8, kind: 'trees' },
      { maxY: 546.1, kind: 'dunes' },
      { maxY: Infinity, kind: 'trees' },
    ],
  },
};
