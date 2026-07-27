// Maailma-lauta: koko maapallo yhtenä vieritettävänä pelilautana.
//
// Koordinaatisto on 1000 x 1000 yksikköä ja kattaa koko maapallon:
//   x = (pituusaste + 180) / 0.36    (lännestä 180°W itään 180°E)
//   y = 305 + (80 - leveysaste) * 1000/360  (pohjoisesta 80°N etelään 60°S)
//
// Mittakaava on sama molemmissa suunnissa, joten mantereet eivät veny
// pystysuunnassa. Kartan ylä- ja alalaitaan jää siksi avomerta.
//
// Mantereet ylitetään laivalla valtamerten poikki, lentäen tai kahta
// maareittiä pitkin (Siperian rata ja Amerikan mannerrata). Lähes joka
// kaupunki on portti mantereensa tarkemmalle laudalle.

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
  // Koristesaaret täyttävät valtameriä; niissä ei ole kaupunkeja eikä reittejä.
  greenlandPoints: [
    [303, 349], [309, 326], [326, 309], [352, 299], [383, 296], [412, 300],
    [425, 312], [420, 330], [405, 344], [383, 354], [360, 363], [338, 360],
    [317, 357],
  ],
  madagascarPoints: [
    [622, 560], [633, 566], [640, 580], [638, 596], [628, 604], [618, 598],
    [615, 582], [616, 570],
  ],
  japanPoints: [
    [871, 432], [878, 420], [886, 407], [895, 399], [902, 404], [897, 417],
    [888, 430], [879, 439], [872, 441],
  ],
  indonesiaPoints: [
    [768, 536], [786, 545], [804, 551], [822, 552], [836, 556], [843, 562],
    [837, 566], [818, 562], [796, 556], [776, 547], [763, 542],
  ],
  nzNorthPoints: [
    [963, 622], [972, 630], [978, 641], [972, 647], [963, 640], [958, 630],
  ],
  nzSouthPoints: [
    [975, 650], [983, 658], [989, 670], [983, 676], [974, 668], [970, 658],
  ],
  // Arktinen jääraja täyttää kartan ylälaidan korkeilla näytöillä.
  arcticPoints: [
    [-40, 228], [1045, 228], [1045, 258], [950, 266], [850, 255], [745, 268],
    [640, 257], [535, 270], [430, 259], [325, 272], [220, 261], [115, 274],
    [20, 263], [-40, 270],
  ],
  // Etelämantereen jäinen rannikko täyttää kartan alalaidan.
  antarcticaPoints: [
    [-40, 745], [60, 728], [160, 736], [280, 722], [400, 732], [520, 718],
    [640, 728], [760, 714], [880, 724], [1000, 716], [1045, 745], [1045, 850],
    [-40, 850],
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
  {
    id: 'sydney', name: 'Sydney', x: 913, y: 620.0, airport: true, la: 'end', lx: -16, ly: -10,
    links: [{ pack: 'oceania', city: 'sydney', label: 'Oseanian lauta' }],
  },
  {
    id: 'moskova', name: 'Moskova', x: 604, y: 372.3, airport: true, la: 'start', lx: 16, ly: 5,
    links: [{ pack: 'europe', city: 'moskova', label: 'Euroopan lauta' }],
  },
  {
    id: 'tokio', name: 'Tokio', x: 893, y: 432, airport: true, la: 'start', lx: 18, ly: 5,
    links: [{ pack: 'asia', city: 'tokio', label: 'Aasian lauta' }],
  },
  {
    id: 'singapore', name: 'Singapore', x: 793, y: 530, airport: true, la: 'start', lx: 18, ly: -12,
    links: [{ pack: 'asia', city: 'singapore', label: 'Aasian lauta' }],
  },
  {
    id: 'kapkaupunki', name: 'Kapkaupunki', x: 560, y: 608, airport: true, la: 'end', lx: -18, ly: 10,
    links: [{ pack: 'africa', city: 'kapkaupunki', label: 'Afrikan lauta' }],
  },
  {
    id: 'losangeles', name: 'Los Angeles', x: 190, y: 438, airport: true, la: 'end', lx: -16, ly: 12,
    links: [{ pack: 'northamerica', city: 'losangeles', label: 'Pohjois-Amerikan lauta' }],
  },
  {
    id: 'ateena', name: 'Ateena', x: 556, y: 412, airport: true, la: 'start', lx: 16, ly: 8,
    // Etelä-Euroopan portti: Eurooppaan pääsee myös Välimeren suunnasta.
    links: [{ pack: 'europe', city: 'ateena', label: 'Euroopan lauta' }],
  },
  {
    // Afrikan luoteiskulma. Ilman tätä mantereella oli maailmankartalla vain
    // Kairo ja Kapkaupunki, eikä niiden välillä ollut laivareittiä lainkaan:
    // purjehtien piti kiertää Rion tai Sydneyn kautta. Tanger on Afrikan
    // laudan aloituskaupunki, joten portti vie sinne suoraan.
    id: 'tanger', name: 'Tanger', x: 484, y: 436, airport: true, la: 'end', lx: -16, ly: 10,
    links: [{ pack: 'africa', city: 'tanger', label: 'Afrikan lauta' }],
  },
];

// steps = kuinka monta silmälukua reitin kulkeminen vaatii.
// type 'sea' = valtamerireitti; via = reittipisteet veden päällä.
const WORLD_EDGES = [
  // Maareitit: Siperian rata ja Amerikan mannerrata.
  { a: 'moskova', b: 'peking', steps: 7, via: [[667, 374.6], [750, 388.2], [792, 402.2]] },
  { a: 'losangeles', b: 'newyork', steps: 5, via: [[225, 428], [262, 412]] },

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
  { a: 'peking', b: 'tokio', steps: 2, type: 'sea', via: [[850, 442], [872, 450]] },
  { a: 'ateena', b: 'kairo', steps: 2, type: 'sea', via: [[572, 432]] },
  { a: 'mumbai', b: 'singapore', steps: 4, type: 'sea', via: [[711, 513.4], [752, 526]] },
  { a: 'singapore', b: 'sydney', steps: 5, type: 'sea', via: [[855, 528], [888, 548], [925, 578], [933, 602]] },
  { a: 'kapkaupunki', b: 'rio', steps: 6, type: 'sea', via: [[500, 648], [430, 632]] },
  { a: 'kapkaupunki', b: 'sydney', steps: 7, type: 'sea', via: [[610, 642], [680, 656], [760, 652], [830, 648], [890, 650]] },
  {
    a: 'mumbai', b: 'sydney', steps: 6, type: 'sea',
    via: [[711, 513.4], [740, 557.8], [778, 604.8], [817, 632.8], [875, 638.3], [911, 632.8]],
  },
  // Atlantin itäranta: Lontoo - Tanger - Kapkaupunki. Tätä reittiä Afrikan
  // ympäri purjehdittiin ennen Suezin kanavaa, ja ilman sitä mantereen
  // kahden kaupungin välillä ei ollut laivayhteyttä lainkaan.
  {
    a: 'lontoo', b: 'tanger', steps: 3, type: 'sea',
    via: [[478, 396], [468, 412], [470, 428]],
  },
  {
    a: 'tanger', b: 'kapkaupunki', steps: 7, type: 'sea',
    via: [[462, 458], [452, 486], [462, 516], [488, 546], [516, 578], [540, 600]],
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
  { a: 'peking', b: 'tokio' },
  { a: 'tokio', b: 'sydney' },
  { a: 'tokio', b: 'losangeles' },
  { a: 'newyork', b: 'losangeles' },
  { a: 'mumbai', b: 'singapore' },
  { a: 'singapore', b: 'sydney' },
  { a: 'kairo', b: 'kapkaupunki' },
  { a: 'lontoo', b: 'ateena' },
  { a: 'ateena', b: 'moskova' },
  { a: 'rio', b: 'kapkaupunki' },
  { a: 'tanger', b: 'newyork' },
  { a: 'tanger', b: 'kapkaupunki' },
];

export const MAAILMA = {
  id: 'maailma',
  name: 'Magellanin kompassi',
  boardLabel: 'Maailma',
  tagline: 'Kierrä maapallo: valtameret, mantereet ja suuret kaupungit.',
  ariaLabel: 'Maailman aarrekartta',

  map: {
    ...WORLD_MAP,
    outlines: [
      WORLD_MAP.americasPoints, WORLD_MAP.afroeurasiaPoints,
      WORLD_MAP.britainPoints, WORLD_MAP.australiaPoints,
      WORLD_MAP.greenlandPoints, WORLD_MAP.madagascarPoints, WORLD_MAP.japanPoints,
      WORLD_MAP.indonesiaPoints, WORLD_MAP.nzNorthPoints, WORLD_MAP.nzSouthPoints,
      WORLD_MAP.arcticPoints, WORLD_MAP.antarcticaPoints,
    ],
    // Tiivis kehys: tyhjät merikaistat jäävät pois, mutta Grönlanti,
    // Uusi-Seelanti ja Etelämantereen rannikko mahtuvat mukaan.
    frame: { x: 25, y: 288, w: 970, h: 520 },
  },
  cities: WORLD_CITIES,
  edges: WORLD_EDGES,
  airRoutes: WORLD_AIR_ROUTES,
  // Tokio ja Singapore ovat koristesaarilla.
  islands: ['tokio', 'singapore'],
  // Oikeassa mittakaavassa Välimeren rannat ovat aidosti lähekkäin:
  // Ateena ja Kairo mahtuvat molemmat, kun raja on tavallista pienempi.
  minCityDistance: 45,

  tokens: {
    types: themedTokenTypes({ star: { name: 'Magellanin kompassi' } }),
    // 12 aarrekaupunkia: laattoja on oltava täsmälleen yhtä monta.
    counts: { star: 1, horseshoe: 2, robber: 1, ruby: 1, emerald: 2, topaz: 3, empty: 2 },
  },

  questions: MAAILMA_QUESTIONS,
  placeFacts: MAAILMA_FACTS,

  // Sijainti maailmankartalla ja rosvon kaksintaistelukysymykset.
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
      q: 'Mikä on maailman korkeimmalla sijaitseva pääkaupunki?',
      options: ['La Paz', 'Quito', 'Bogotá', 'Kathmandu', 'Addis Abeba', 'Mexico City', 'Nairobi', 'Ulan Bator'],
      correct: 0,
      fact: 'Bolivian hallitus istuu La Pazissa noin 3 600 metrin korkeudessa; naapurikaupunki El Alto ja sen lentokenttä ovat vielä ylempänä.',
    },
    {
      q: 'Kuinka monta kieltä maailmassa arvioidaan puhuttavan?',
      options: ['noin 7 000', 'noin 200', 'noin 700', 'noin 1 500', 'noin 25 000', 'noin 70', 'noin 300', 'noin 70 000'],
      correct: 0,
      fact: 'Kieliä lasketaan olevan noin seitsemäntuhatta, ja arviolta puolet niistä on uhanalaisia — moni jää ilman uusia puhujia.',
    },
    {
      q: 'Mikä raja kulkee Tyynenmeren poikki niin, että sen ylittäessä vaihtuu päivä?',
      options: ['kansainvälinen päivämääräraja', 'nollameridiaani', 'päiväntasaaja', 'Kauriin kääntöpiiri', 'Kravun kääntöpiiri', 'pohjoinen napapiiri', 'eteläinen napapiiri', 'keskipäivän linja'],
      correct: 0,
      fact: 'Päivämäärärajan länsipuolella on aina eri vuorokausi kuin itäpuolella — raja mutkittelee saarivaltioiden ympäri.',
    },
  ],

  texts: {
    intro: 'Peli alkaa! Etsikää Magellanin kompassi — maailmanympäripurjehtijan kadonnut aarre.',
    starFound: (name, city) => `★ ${name} löysi MAGELLANIN KOMPASSIN kaupungista ${city}!`,
    starToast: 'MAGELLANIN KOMPASSI!',
    starChase: 'Nyt on kiire kotiin — myös hevosenkengän haltija voi voittaa pelin.',
    winStar: 'toi Magellanin kompassin turvallisesti kotiin',
    winnerStar: (name, money) => `${name} toi Magellanin kompassin kotiin ${money} punnan kanssa.`,
    // Saapumismerkinnät: yksi arvotaan laudalle saavuttaessa.
    diaries: [
      'Isoisä kiersi tämän pallon kahdeksassakymmenessä päivässä ja piti sitä saavutuksena. Nykyään sen tekee vuorokaudessa kuka tahansa, jolla on varaa lippuun. Minä aion käyttää aikaa — katsoakseni, mitä hän ei ehtinyt nähdä.',
      'Isoisän kartassa kolmannes maailmasta on väritetty samalla punaisella. Nykyisessä kartassa siinä tilassa on yli viisikymmentä itsenäistä valtiota, joilla kaikilla on oma lippu ja oma mielipide meistä. Päätin olla ottamatta asiaa puheeksi ensimmäisenä iltana.',
      '"Matkalla tarvitaan kolme asiaa: kello, kartta ja kärsivällisyyttä", isoisä kirjoitti. Minulla on puhelin, joka on kaikki kolme, ja silti eksyn lentokentällä. Hänen listassaan taisi olla neljäs kohta, jota en osaa lukea.',
      'Isoisä laski matkansa hinnaksi kaksituhatta puntaa ja piti sitä ruhtinaallisena. Sama summa riittää nykyään yhteen lentolippuun ja kohtuulliseen aamiaiseen. Rahassa mitattuna maailma on kutistunut; kaikessa muussa se on kasvanut.',
      'Ensimmäisellä sivulla lukee: "Lähden selvittämään, onko maailma niin suuri kuin sanotaan." Viimeisellä sivulla lukee: "On." Väliin mahtuu kaksisataa sivua, joista aion tarkistaa jokaisen.',
    ],
    // Isoisän vihjeet laudan pääaarteesta: suunta tai seutu,
    // ei koskaan kaupungin nimeä.
    starHints: {
      kairo: 'Suurin joista tulee etelästä ja hajoaa Välimereen kolmiona. Sen suistossa on kaupunki, jonka basaarissa puhuttiin haudatuista kuninkaista. Laivani kääntyi itään ennen kuin ehdin.',
      rio: 'Päiväntasaajan eteläpuolella, Atlantin länsirannalla, on lahti jota purjehtijat pitivät maailman kauneimpana. Kirjasin sen muistiin ja jatkoin pohjoiseen. Typerää.',
      mumbai: 'Intian niemimaan länsirannikolla sataa neljä kuukautta yhteen menoon, ja siellä on satama, jonne monsuuni tuo laivat takaisin. Sinne minun olisi pitänyt jäädä odottamaan.',
      peking: 'Kiinan pohjoisosassa, suuren muurin eteläpuolella, kerrottiin olevan kaupunki jonka keskellä on toinen kaupunki, jonne ei päästetä ketään. Katselin sitä kartalta enkä uskaltanut lähteä.',
      sydney: 'Eteläisen mantereen kaakkoiskulmassa on luonnonsatama, jota merimiehet ylistivät kolmella mantereella. Purjehdin ohi pimeällä. Kadun sitä yhä.',
      moskova: 'Kaukana Euroopan tasangon itälaidalla, joen mutkassa, kohoaa sipulikupolien kaupunki. Sinne olisi pitänyt mennä talvella, kun tiet ovat jäässä eivätkä mudassa.',
      tokio: 'Itäisimmässä saariketjussa, siellä mistä aurinko meille tulee, on pääkaupunki jota kukaan klubilla ei ollut nähnyt omin silmin. Se jäi matkani kaukaisimmaksi puuttuvaksi kohdaksi.',
      singapore: 'Malaijien niemimaan eteläkärjessä, kapean salmen partaalla, on satama jonka läpi kulkee puoli maailman rahtia. Ohitin sen yöllä enkä noussut kannelle katsomaan.',
      kapkaupunki: 'Afrikan eteläkärjessä kaksi valtamerta lyö yhteen, ja siellä on kaupunki pöydänmuotoisen vuoren juurella. Näin vuoren kaukaa mereltä. Sen olisi pitänyt riittää houkutukseksi.',
      losangeles: 'Pohjois-Amerikan länsirannikolla, vuorten kuivalla puolella, kerrottiin kasvavan pikkukaupunkia appelsiinitarhojen keskelle. Pidin kertomusta liioitteluna ja jatkoin matkaa.',
      tanger: 'Afrikan luoteisimmassa kulmassa, siinä salmessa jossa manner on kivenheiton päässä Euroopasta, on satamakaupunki jossa puhutaan viittä kieltä samassa korttelissa. Näin sen kannelta enkä noussut maihin.',
      ateena: 'Välimeren pohjoisrannalla seisoo kukkulalla marmoritemppeli, joka oli vanha jo roomalaisille. Sen kaupungissa en käynyt: satamaan tuli lastia ja laiva lähti ennen aikojaan.',
    },
  },

  decor: {
    mapLabel: 'MAAILMA',
    mapLabelPos: { x: 140, y: 655.0 },
    compass: { x: 85, y: 526.7, r: 58 },
    waveSkip: [
      { x: 170, y: 545, r: 90 },
      { x: 736, y: 638.3, r: 100 },
      { x: 140, y: 655.0, r: 130 },
    ],
    // Laiva purjehtii keskellä Tyyntämerta, kaukana rannikoista.
    ship: { x: 170, y: 545 },
    serpent: { x: 736, y: 638.3 },
    // Nopan lepopaikka: Tyynimeri laudan vasemmassa laidassa.
    dieSpot: { x: 0.08, y: 0.62 },
    // Pohjoisessa vuoria ja tuntureita, keskivyöhykkeellä metsää,
    // tropiikissa aavikoita ja etelässä taas metsää.
    terrainBands: [
      { maxY: 402.2, kind: 'mountains' },
      { maxY: 487.8, kind: 'trees' },
      { maxY: 546.1, kind: 'dunes' },
      { maxY: 700, kind: 'trees' },
      { maxY: Infinity, kind: 'mountains' },
    ],
  },
};
