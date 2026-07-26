// Maailma-lauta: koko maapallo yhtenä vieritettävänä pelilautana.
//
// Koordinaatisto on 1000 x 1000 yksikköä ja kattaa koko maapallon:
//   x = (pituusaste + 180) / 0.36    (lännestä 180°W itään 180°E)
//   y = (80 - leveysaste) * 1000/140 (pohjoisesta 80°N etelään 60°S)
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
    [33.3, 100.0], [38.9, 142.9], [83.3, 150.0], [125.0, 157.1], [152.8, 221.4],
    [155.6, 285.7], [175.0, 335.7], [194.4, 407.1], [208.3, 428.6], [233.3, 457.1],
    [263.9, 500.0], [283.3, 521.4], [280.6, 585.7], [275.0, 614.3], [288.9, 671.4],
    [305.6, 700.0], [302.8, 785.7], [297.2, 857.1], [300.0, 928.6], [311.1, 964.3],
    [319.4, 892.9], [327.8, 850.0], [341.7, 821.4], [366.7, 771.4], [388.9, 728.6],
    [402.8, 628.6], [377.8, 592.9], [361.1, 571.4], [355.6, 535.7], [333.3, 507.1],
    [322.2, 500.0], [300.0, 485.7], [286.1, 507.1], [269.4, 492.9], [255.6, 457.1],
    [258.3, 421.4], [250.0, 435.7], [230.6, 385.7], [238.9, 364.3], [252.8, 364.3],
    [272.2, 378.6], [277.8, 392.9], [275.0, 350.0], [288.9, 321.4], [294.4, 285.7],
    [305.6, 264.3], [316.7, 250.0], [333.3, 235.7], [347.2, 200.0], [338.9, 178.6],
    [322.2, 142.9], [311.1, 114.3], [277.8, 92.9], [250.0, 78.6], [194.4, 85.7],
    [138.9, 71.4], [83.3, 64.3], [50.0, 71.4],
  ],
  // Afrikka, Eurooppa ja Aasia ovat yhtä mannermassaa; Itämeri, Välimeri,
  // Mustameri ja Punainenmeri ovat sen sisäänvetoja.
  afroeurasiaPoints: [
    [475.0, 264.3], [497.2, 242.9], [486.1, 228.6], [500.0, 221.4], [511.1, 200.0],
    [522.2, 185.7], [525.0, 167.9], [530.6, 160.7], [536.1, 182.1], [555.6, 178.6],
    [577.8, 146.4], [566.7, 139.3], [547.2, 142.9], [533.3, 160.7], [527.8, 150.0],
    [513.9, 135.7], [538.9, 85.7], [569.4, 64.3], [625.0, 85.7], [666.7, 78.6],
    [708.3, 50.0], [750.0, 28.6], [805.6, 21.4], [861.1, 50.0], [916.7, 71.4],
    [972.2, 71.4], [994.4, 100.0], [972.2, 142.9], [950.0, 171.4], [930.6, 214.3],
    [888.9, 185.7], [875.0, 257.1], [863.9, 264.3], [858.3, 321.4], [838.9, 307.1],
    [836.1, 342.9], [825.0, 407.1], [800.0, 421.4], [797.2, 450.0], [791.7, 500.0],
    [786.1, 564.3], [777.8, 521.4], [772.2, 485.7], [761.1, 457.1], [752.8, 414.3],
    [738.9, 428.6], [722.2, 464.3], [713.9, 514.3], [702.8, 464.3], [700.0, 421.4],
    [683.3, 392.9], [661.1, 392.9], [658.3, 385.7], [666.7, 414.3], [650.0, 450.0],
    [625.0, 476.0], [619.4, 475.0], [600.0, 371.4], [588.9, 378.6], [613.9, 485.7],
    [641.7, 496.4], [633.3, 535.7], [619.4, 571.4], [611.1, 628.6], [600.0, 700.0],
    [597.2, 742.9], [591.7, 785.7], [577.8, 814.3], [550.0, 814.3], [533.3, 700.0],
    [525.0, 607.1], [525.0, 542.9], [500.0, 528.6], [477.8, 542.9], [463.9, 507.1],
    [452.8, 464.3], [455.6, 421.4], [472.2, 357.1], [483.3, 330.0], [508.3, 314.3],
    [527.8, 307.1], [541.7, 342.9], [555.6, 350.0], [569.4, 342.9], [583.3, 350.0],
    [589.7, 357.1], [597.2, 335.7], [600.0, 310.7], [583.3, 314.3], [575.0, 307.1],
    [572.2, 285.7], [580.6, 278.6], [597.2, 271.4], [613.9, 275.0], [615.3, 264.3],
    [602.8, 250.0], [591.7, 242.9], [583.3, 242.9], [577.8, 264.3], [579.2, 277.1],
    [566.7, 285.7], [558.3, 300.0], [563.9, 314.3], [550.0, 285.7], [538.9, 250.0],
    [533.3, 257.1], [544.4, 300.0], [533.3, 278.6], [527.8, 257.1], [513.9, 264.3],
    [508.3, 271.4], [500.0, 292.9], [494.4, 305.0], [485.6, 304.3], [475.0, 307.1],
  ],
  britainPoints: [
    [486.1, 214.3], [502.8, 207.1], [501.4, 192.9], [495.8, 171.4], [488.9, 157.1],
    [483.3, 178.6], [486.1, 192.9], [487.5, 207.1],
  ],
  australiaPoints: [
    [816.7, 728.6], [838.9, 700.0], [863.9, 657.1], [880.6, 657.1], [894.4, 650.0],
    [905.6, 707.1], [916.7, 728.6], [925.0, 764.3], [919.4, 814.3], [905.6, 850.0],
    [888.9, 842.9], [875.0, 821.4], [858.3, 800.0], [844.4, 807.1], [819.4, 814.3],
    [813.9, 757.1],
  ],
};

// start = aloituskaupunki (ei laattaa), airport = lentokenttä.
const WORLD_CITIES = [
  { id: 'lontoo', name: 'Lontoo', x: 500, y: 204, start: true, airport: true, la: 'end', lx: -16, ly: 5,
    links: [{ pack: 'europe', city: 'lontoo', label: 'Euroopan lauta' }] },
  { id: 'newyork', name: 'New York', x: 287, y: 283, start: true, airport: true, la: 'end', lx: -16, ly: 5 },

  {
    id: 'kairo', name: 'Kairo', x: 585, y: 365, la: 'start', lx: 16, ly: 5,
    // Kairosta laskeudutaan tarkemmille laudoille.
    links: [
      { pack: 'africa', city: 'kairo', label: 'Afrikan lauta' },
      { pack: 'middleeast', city: 'kairo', label: 'Lähi-idän lauta' },
    ],
  },
  { id: 'rio', name: 'Rio de Janeiro', x: 380, y: 735, la: 'end', lx: -16, ly: 5 },
  { id: 'mumbai', name: 'Mumbai', x: 706, y: 432, la: 'start', lx: 16, ly: 5 },
  { id: 'peking', name: 'Peking', x: 823, y: 286, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'sydney', name: 'Sydney', x: 913, y: 810, airport: true, la: 'end', lx: -16, ly: -10 },
  { id: 'moskova', name: 'Moskova', x: 604, y: 173, la: 'start', lx: 16, ly: 5 },
];

// steps = kuinka monta silmälukua reitin kulkeminen vaatii.
// type 'sea' = valtamerireitti; via = reittipisteet veden päällä.
const WORLD_EDGES = [
  // Siperian rata on laudan ainoa maareitti.
  { a: 'moskova', b: 'peking', steps: 7, via: [[667, 179], [750, 214], [792, 250]] },

  // Valtamerten laivareitit
  { a: 'lontoo', b: 'newyork', steps: 5, type: 'sea', via: [[417, 214], [361, 250]] },
  {
    a: 'lontoo', b: 'kairo', steps: 5, type: 'sea',
    via: [[483, 221], [472, 264], [472, 314], [479, 317], [486, 318], [497, 310], [510, 303], [533, 296], [550, 321], [578, 332]],
  },
  { a: 'lontoo', b: 'moskova', steps: 4, type: 'sea', via: [[508, 186], [528, 171], [553, 168], [571, 152]] },
  { a: 'newyork', b: 'rio', steps: 5, type: 'sea', via: [[306, 321], [347, 429], [375, 536], [417, 571], [411, 679]] },
  {
    a: 'kairo', b: 'mumbai', steps: 5, type: 'sea',
    via: [[597, 386], [610, 450], [617, 480], [632, 481], [655, 468], [689, 450]],
  },
  {
    a: 'mumbai', b: 'peking', steps: 6, type: 'sea',
    via: [[711, 536], [774, 552], [786, 572], [806, 486], [823, 418], [844, 343], [844, 314]],
  },
  { a: 'peking', b: 'sydney', steps: 6, type: 'sea', via: [[861, 393], [889, 500], [911, 629], [928, 700], [932, 762]] },
  {
    a: 'mumbai', b: 'sydney', steps: 6, type: 'sea',
    via: [[711, 536], [740, 650], [778, 771], [817, 843], [875, 857], [911, 843]],
  },
];

// Mannertenväliset lennot.
const WORLD_AIR_ROUTES = [
  { a: 'lontoo', b: 'newyork' },
  { a: 'lontoo', b: 'peking' },
  { a: 'newyork', b: 'sydney' },
  { a: 'peking', b: 'sydney' },
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
  minCityDistance: 90,

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
    mapLabelPos: { x: 140, y: 900 },
    compass: { x: 85, y: 570, r: 58 },
    waveSkip: [
      { x: 417, y: 393, r: 90 },
      { x: 736, y: 857, r: 100 },
      { x: 140, y: 900, r: 130 },
    ],
    ship: { x: 417, y: 393 },
    serpent: { x: 736, y: 857 },
    // Nopan lepopaikka: Tyynimeri laudan vasemmassa laidassa.
    dieSpot: { x: 0.08, y: 0.62 },
    // Pohjoisessa vuoria ja tuntureita, keskivyöhykkeellä metsää,
    // tropiikissa aavikoita ja etelässä taas metsää.
    terrainBands: [
      { maxY: 250, kind: 'mountains' },
      { maxY: 470, kind: 'trees' },
      { maxY: 620, kind: 'dunes' },
      { maxY: Infinity, kind: 'trees' },
    ],
  },
};
