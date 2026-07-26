// Pohjois-Amerikka-lauta: kaupungit, reitit, kartan piirtotiedot ja teema.
//
// Koordinaatisto on 1000 x 1000 yksikköä ja vastaa suoraan Pohjois-Amerikan
// karttaa:
//   x = (pituusaste + 166) * 8.4 + 15   (lännestä -166° itään -50°)
//   y = (73 - leveysaste) * 14.3        (pohjoisesta 73° etelään 3°)
//
// Mittasuhteet on valittu niin, että kartta on oikeassa muodossa 54. leveys-
// asteella eli Kanadan eteläosassa. Manner on yksi ääriviiva Beringinsalmelta
// Panaman kannakselle: Hudsoninlahti ja Kalifornianlahti työntyvät siihen
// lahtina. Grönlanti, Newfoundland, Kuuba, Puerto Rico, Bermuda ja Havaiji
// ovat omia saariaan, joihin pääsee vain laivalla.

import { NORTHAMERICA_QUESTIONS, NORTHAMERICA_FACTS } from './northamerica-questions.js';
import { themedTokenTypes } from '../tokens.js';

const NA_MAP = {
  width: 1000,
  height: 1000,
  mainlandPoints: [
    [23.4, 121.6], [15, 107.3], [31.8, 93], [40.2, 78.7], [15, 62.9],
    [73.8, 35.8], [94.8, 22.9], [149.4, 35.8], [191.4, 41.5], [225, 48.6],
    [275.4, 50.1], [334.2, 42.9], [367.8, 50.1], [443.4, 64.4], [485.4, 71.5],
    [527.4, 64.4], [569.4, 64.4], [611.4, 64.4], [619.8, 114.4], [628.2, 157.3],
    [636.6, 207.4], [670.2, 236], [695.4, 257.4], [720.6, 250.3], [737.4, 221.7],
    [754.2, 185.9], [758.4, 157.3], [754.2, 135.8], [804.6, 157.3], [838.2, 185.9],
    [863.4, 207.4], [880.2, 228.8], [897, 257.4], [922.2, 278.9], [934.8, 307.4],
    [913.8, 328.9], [888.6, 350.4], [871.8, 371.8], [855, 400.4], [842.4, 403.3],
    [821.4, 429], [808.8, 450.5], [787.8, 471.9], [779.4, 486.2], [771, 507.7],
    [771, 536.3], [745.8, 572], [729, 593.5], [733.2, 636.4], [735.7, 675],
    [724.8, 683.5], [716.4, 650.6], [708, 622.1], [695.4, 614.9], [670.2, 612],
    [653.4, 629.2], [624, 619.2], [611.4, 629.2], [594.6, 672.1], [590.4, 729.3],
    [603, 769.3], [615.6, 783.6], [636.6, 777.9], [653.4, 765.1], [678.6, 736.5],
    [666, 782.2], [670.2, 815.1], [703.8, 829.4], [708, 865.2], [716.4, 908.1],
    [741.6, 908.1], [737.4, 926.6], [712.2, 922.4], [695.4, 900.9], [678.6, 865.2],
    [653.4, 850.9], [632.4, 829.4], [611.4, 815.1], [586.2, 808], [561, 793.7],
    [535.8, 772.2], [523.2, 750.8], [523.2, 722.2], [514.8, 703.6], [502.2, 679.3],
    [489.6, 657.8], [477, 636.4], [464.4, 614.9], [456, 600.6], [447.6, 614.9],
    [460.2, 643.5], [477, 679.3], [487.1, 712.1], [468.6, 679.3], [451.8, 650.6],
    [435, 607.8], [426.6, 579.1], [414, 557.7], [393, 522], [380.4, 503.4],
    [367.8, 464.8], [363.6, 421.9], [367.8, 381.8], [363.6, 351.8], [376.2, 343.2],
    [342.6, 314.6], [317.4, 271.7], [292.2, 228.8], [267, 207.4], [233.4, 185.9],
    [191.4, 185.9], [166.2, 193.1], [141, 200.2], [124.2, 221.7], [99, 236],
    [65.4, 250.3], [48.6, 257.4], [65.4, 214.5], [48.6, 185.9], [23.4, 178.8],
    [31.8, 143],
  ],
  greenlandPoints: [
    [947.4, 164.5], [964.2, 150.2], [981, 121.6], [985.2, 85.8], [989.4, 50.1],
    [993.6, 21.5], [1000, 14.3], [1000, 71.5], [1000, 128.7], [1006.2, 171.6],
    [972.6, 188.8],
  ],
  newfoundlandPoints: [
    [910.4, 363.2], [930.6, 350.4], [943.2, 334.6], [960, 336.1], [966.7, 363.2],
    [951.6, 377.5], [926.4, 371.8],
  ],
  cubaPoints: [
    [696.2, 729.3], [716.4, 712.1], [733.2, 713.6], [754.2, 722.2], [779.4, 747.9],
    [786.1, 756.5], [766.8, 759.3], [741.6, 736.5], [716.4, 730.7],
  ],
  puertoRicoPoints: [
    [842.1, 776.4], [860.4, 776.4], [860.4, 789.9], [842.1, 789.9],
  ],
  bermudaPoints: [
    [858.2, 575.6], [871.8, 575.6], [871.8, 588.4], [858.2, 588.4],
  ],
  hawaiiPoints: [
    [62.9, 730.7], [82.2, 733.6], [99, 743.6], [99.8, 772.2], [86.4, 752.2],
    [67.9, 739.3],
  ],
};

// start = aloituskaupunki (ei laattaa), airport = lentokenttä.
const NA_CITIES = [
  {
    id: 'newyork', name: 'New York', x: 788, y: 462, start: true, airport: true,
    la: 'start', lx: 16, ly: 5,
    // Sama kaupunki on myös Maailma-laudalla.
    links: [{ pack: 'maailma', city: 'newyork', label: 'Maailma-lauta' }],
  },
  {
    id: 'sanfrancisco', name: 'San Francisco', x: 381, y: 503, start: true, airport: true,
    la: 'end', lx: -18, ly: 5,
  },

  { id: 'nome', name: 'Nome', x: 34, y: 128, la: 'start', lx: 16, ly: 5 },
  { id: 'anchorage', name: 'Anchorage', x: 150, y: 169, airport: true, la: 'start', lx: 16, ly: 5 },
  { id: 'whitehorse', name: 'Whitehorse', x: 275, y: 176, la: 'middle', lx: 0, ly: -22 },
  { id: 'yellowknife', name: 'Yellowknife', x: 448, y: 150, la: 'middle', lx: 0, ly: -22 },
  { id: 'vancouver', name: 'Vancouver', x: 375, y: 339, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'yellowstone', name: 'Yellowstone', x: 481, y: 406, la: 'end', lx: -16, ly: 5 },
  { id: 'mountrushmore', name: 'Mount Rushmore', x: 540, y: 416, la: 'middle', lx: 0, ly: -24 },
  { id: 'winnipeg', name: 'Winnipeg', x: 594, y: 330, la: 'middle', lx: 0, ly: -22 },
  { id: 'churchill', name: 'Churchill', x: 618, y: 203, la: 'end', lx: -16, ly: 5 },
  { id: 'iqaluit', name: 'Iqaluit', x: 812, y: 168, la: 'start', lx: 16, ly: 5 },
  { id: 'nuuk', name: 'Nuuk', x: 990, y: 120, la: 'end', lx: -16, ly: 5 },
  { id: 'labrador', name: 'Labrador', x: 902, y: 282, la: 'end', lx: -16, ly: 5 },
  { id: 'stjohns', name: 'St. John’s', x: 948, y: 358, la: 'end', lx: -16, ly: -14 },
  { id: 'halifax', name: 'Halifax', x: 850, y: 390, la: 'start', lx: 16, ly: 5 },
  { id: 'montreal', name: 'Montreal', x: 791, y: 393, la: 'middle', lx: 0, ly: -22 },
  { id: 'toronto', name: 'Toronto', x: 742, y: 419, la: 'end', lx: -16, ly: 5 },
  { id: 'chicago', name: 'Chicago', x: 674, y: 445, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'appalakit', name: 'Appalakit', x: 733, y: 508, la: 'end', lx: -16, ly: 5 },
  { id: 'bermuda', name: 'Bermuda', x: 865, y: 582, la: 'start', lx: 16, ly: 5 },
  { id: 'denver', name: 'Denver', x: 527, y: 476, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'santafe', name: 'Santa Fe', x: 519, y: 533, la: 'start', lx: 16, ly: 5 },
  { id: 'grandcanyon', name: 'Grand Canyon', x: 468, y: 528, la: 'end', lx: -16, ly: 5 },
  { id: 'losangeles', name: 'Los Angeles', x: 417, y: 556, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'hawaii', name: 'Havaiji', x: 83, y: 739, la: 'middle', lx: 0, ly: 28 },
  { id: 'dallas', name: 'Dallas', x: 596, y: 575, la: 'end', lx: -16, ly: 5 },
  { id: 'neworleans', name: 'New Orleans', x: 653, y: 615, airport: true, la: 'start', lx: 16, ly: 5 },
  { id: 'miami', name: 'Miami', x: 726, y: 666, airport: true, la: 'start', lx: 16, ly: 5 },
  { id: 'santiagodecuba', name: 'Santiago de Cuba', x: 773, y: 758, la: 'middle', lx: 0, ly: -22 },
  { id: 'sanjuan', name: 'San Juan', x: 854, y: 779, la: 'start', lx: 16, ly: 5 },
  { id: 'monterrey', name: 'Monterrey', x: 567, y: 676, la: 'end', lx: -16, ly: 5 },
  { id: 'mexico', name: 'Mexico City', x: 577, y: 766, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'merida', name: 'Mérida', x: 655, y: 778, la: 'start', lx: 16, ly: -6 },
  { id: 'guatemala', name: 'Guatemala', x: 649, y: 835, la: 'end', lx: -16, ly: 5 },
  { id: 'managua', name: 'Managua', x: 684, y: 871, la: 'end', lx: -16, ly: 16 },
  {
    id: 'panama', name: 'Panama', x: 728, y: 916, airport: true, la: 'start', lx: 16, ly: 5,
    // Sama kaupunki on myös Etelä-Amerikan laudalla: kannas yhdistää mantereet.
    links: [{ pack: 'southamerica', city: 'panama', label: 'Etelä-Amerikan lauta' }],
  },
];

// steps = kuinka monta silmälukua reitin kulkeminen vaatii.
// type 'sea' = laivareitti; via = piirto- ja tarkistuspisteet veden päällä.
const NA_EDGES = [
  // Alaska ja Luoteisterritoriot
  { a: 'nome', b: 'anchorage', steps: 5 },
  { a: 'anchorage', b: 'whitehorse', steps: 5 },
  { a: 'whitehorse', b: 'yellowknife', steps: 5 },
  { a: 'whitehorse', b: 'vancouver', steps: 5 },
  { a: 'yellowknife', b: 'vancouver', steps: 5 },
  { a: 'yellowknife', b: 'churchill', steps: 6 },

  // Kalliovuoret ja preeria
  { a: 'vancouver', b: 'yellowstone', steps: 4 },
  { a: 'vancouver', b: 'sanfrancisco', steps: 5 },
  { a: 'yellowstone', b: 'mountrushmore', steps: 3 },
  { a: 'yellowstone', b: 'denver', steps: 3 },
  { a: 'mountrushmore', b: 'denver', steps: 3 },
  { a: 'mountrushmore', b: 'winnipeg', steps: 4 },
  { a: 'winnipeg', b: 'churchill', steps: 5 },
  { a: 'winnipeg', b: 'chicago', steps: 4 },
  { a: 'denver', b: 'santafe', steps: 3 },
  { a: 'denver', b: 'dallas', steps: 4 },
  { a: 'santafe', b: 'grandcanyon', steps: 3 },
  { a: 'santafe', b: 'monterrey', steps: 5 },
  { a: 'grandcanyon', b: 'losangeles', steps: 3 },
  { a: 'losangeles', b: 'sanfrancisco', steps: 3 },

  // Etelävaltiot ja Suuret järvet
  { a: 'dallas', b: 'chicago', steps: 5 },
  { a: 'dallas', b: 'neworleans', steps: 3 },
  { a: 'neworleans', b: 'appalakit', steps: 4 },
  { a: 'neworleans', b: 'miami', steps: 5 },
  { a: 'chicago', b: 'toronto', steps: 4 },
  { a: 'chicago', b: 'appalakit', steps: 4 },
  { a: 'appalakit', b: 'newyork', steps: 3 },
  { a: 'toronto', b: 'montreal', steps: 3 },
  { a: 'toronto', b: 'newyork', steps: 4 },
  { a: 'montreal', b: 'newyork', steps: 3 },
  { a: 'montreal', b: 'halifax', steps: 5 },
  { a: 'halifax', b: 'labrador', steps: 6 },
  { a: 'labrador', b: 'iqaluit', steps: 6 },

  // Meksiko ja Väli-Amerikka
  { a: 'monterrey', b: 'mexico', steps: 4 },
  { a: 'mexico', b: 'merida', steps: 5 },
  { a: 'mexico', b: 'guatemala', steps: 5 },
  { a: 'merida', b: 'guatemala', steps: 4 },
  { a: 'guatemala', b: 'managua', steps: 3 },
  { a: 'managua', b: 'panama', steps: 4 },

  // Laivareitit
  { a: 'anchorage', b: 'vancouver', steps: 6, type: 'sea',
    via: [[150, 240], [130, 262], [200, 292], [280, 306], [330, 332]] },
  { a: 'sanfrancisco', b: 'hawaii', steps: 7, type: 'sea',
    via: [[300, 560], [220, 620], [150, 690]] },
  { a: 'hawaii', b: 'losangeles', steps: 7, type: 'sea',
    via: [[170, 760], [260, 700], [350, 620]] },
  { a: 'miami', b: 'santiagodecuba', steps: 3, type: 'sea', via: [[762, 712]] },
  { a: 'miami', b: 'bermuda', steps: 5, type: 'sea', via: [[790, 640], [830, 606]] },
  { a: 'santiagodecuba', b: 'sanjuan', steps: 4, type: 'sea', via: [[812, 770]] },
  { a: 'sanjuan', b: 'bermuda', steps: 5, type: 'sea', via: [[880, 720], [878, 650]] },
  { a: 'bermuda', b: 'newyork', steps: 5, type: 'sea', via: [[848, 540], [820, 496]] },
  { a: 'bermuda', b: 'halifax', steps: 5, type: 'sea', via: [[888, 530], [890, 460]] },
  { a: 'halifax', b: 'stjohns', steps: 4, type: 'sea', via: [[912, 392]] },
  { a: 'stjohns', b: 'nuuk', steps: 6, type: 'sea', via: [[955, 300], [936, 226], [944, 160], [962, 128]] },
  { a: 'nuuk', b: 'iqaluit', steps: 4, type: 'sea', via: [[930, 118]] },
  { a: 'iqaluit', b: 'churchill', steps: 6, type: 'sea',
    via: [[770, 150], [740, 172], [700, 200], [662, 208]] },
  { a: 'santiagodecuba', b: 'merida', steps: 4, type: 'sea', via: [[706, 762]] },
  { a: 'santiagodecuba', b: 'panama', steps: 5, type: 'sea', via: [[790, 830], [780, 890]] },
];

// Lentoreitit kulkevat suoraan kaupungista toiseen yhdellä vuorolla.
const NA_AIR_ROUTES = [
  { a: 'newyork', b: 'chicago' },
  { a: 'chicago', b: 'denver' },
  { a: 'denver', b: 'losangeles' },
  { a: 'losangeles', b: 'sanfrancisco' },
  { a: 'sanfrancisco', b: 'vancouver' },
  { a: 'vancouver', b: 'anchorage' },
  { a: 'newyork', b: 'miami' },
  { a: 'miami', b: 'panama' },
  { a: 'chicago', b: 'neworleans' },
  { a: 'neworleans', b: 'mexico' },
  { a: 'mexico', b: 'panama' },
];

export const NORTHAMERICA = {
  id: 'northamerica',
  name: 'Pohjois-Amerikan tähti',
  boardLabel: 'Pohjois-Amerikka',
  tagline: 'Etsi tähti Kalliovuorilta, preerialta, Karibian saarilta ja Alaskan tundralta.',
  ariaLabel: 'Pohjois-Amerikan aarrekartta',

  map: {
    ...NA_MAP,
    outlines: [
      NA_MAP.mainlandPoints, NA_MAP.greenlandPoints, NA_MAP.newfoundlandPoints,
      NA_MAP.cubaPoints, NA_MAP.puertoRicoPoints, NA_MAP.bermudaPoints,
      NA_MAP.hawaiiPoints,
    ],
  },
  cities: NA_CITIES,
  edges: NA_EDGES,
  airRoutes: NA_AIR_ROUTES,
  islands: ['nuuk', 'stjohns', 'santiagodecuba', 'sanjuan', 'bermuda', 'hawaii'],
  minCityDistance: 50,

  tokens: {
    // Topaasin tilalla Klondiken kulta: kultaryntäys veti 1890-luvulla
    // kymmeniätuhansia onnenonkijoita Yukonin jokilaaksoon.
    types: themedTokenTypes({
      star: { name: 'Pohjois-Amerikan tähti' },
      topaz: { name: 'Klondiken kulta', color: '#e0b02a' },
    }),
    counts: { star: 1, horseshoe: 2, robber: 3, ruby: 4, emerald: 5, topaz: 7, empty: 13 },
  },

  questions: NORTHAMERICA_QUESTIONS,
  placeFacts: NORTHAMERICA_FACTS,

  worldPos: { x: 74, y: 46 },
  duels: [
    {
      q: 'Mikä on Pohjois-Amerikan korkein vuori?',
      options: ['Denali', 'Mount Whitney', 'Mount Rainier', 'Popocatépetl',
        'Mount Logan', 'Pikes Peak', 'Mount Hood', 'Orizaba'],
      correct: 0,
      fact: 'Alaskan Denali kohoaa 6 190 metriin. Kanadan Mount Logan on toiseksi korkein.',
    },
    {
      q: 'Mikä näistä Suurista järvistä on kokonaan Yhdysvaltain puolella?',
      options: ['Michigan', 'Yläjärvi', 'Huron', 'Erie', 'Ontario',
        'Winnipegjärvi', 'Isokarhujärvi', 'Isoorjajärvi'],
      correct: 0,
      fact: 'Michiganjärvi on ainoa Suurista järvistä, joka on kokonaan Yhdysvaltain alueella. Muut jakautuvat Kanadan kanssa.',
    },
    {
      q: 'Kuinka monta osavaltiota Yhdysvalloissa on?',
      options: ['50', '48', '51', '52', '49', '13', '46', '54'],
      correct: 0,
      fact: 'Osavaltioita on 50. Alaska liittyi 1959 ja Havaiji samana vuonna viimeisenä.',
    },
    {
      q: 'Mikä kansa rakensi Chichén Itzán pyramidit Jukatanille?',
      options: ['mayat', 'atsteekit', 'inkat', 'olmeekit', 'toltekit', 'zapoteekit', 'irokeesit', 'siouxit'],
      correct: 0,
      fact: 'Mayakulttuuri kukoisti Jukatanilla ja Guatemalassa. Atsteekkien keskus oli myöhemmin Tenochtitlánissa nykyisen Mexico Cityn kohdalla.',
    },
    {
      q: 'Mikä kaupunki oli Kanadan pääkaupunki vuonna 1867 ja on sitä yhä?',
      options: ['Ottawa', 'Toronto', 'Montreal', 'Quebec', 'Vancouver', 'Winnipeg', 'Halifax', 'Calgary'],
      correct: 0,
      fact: 'Kuningatar Viktoria valitsi Ottawan pääkaupungiksi 1857 kompromissina englannin- ja ranskankielisten keskusten välillä.',
    },
    {
      q: 'Minkä joen uurtama Grand Canyon on?',
      options: ['Coloradojoen', 'Mississippin', 'Rio Granden', 'Missourin',
        'Yukonin', 'Columbian', 'Hudsonin', 'Saint Lawrencen'],
      correct: 0,
      fact: 'Colorado on kaivertanut rotkoa miljoonia vuosia. Rotko on paikoin yli 1 800 metriä syvä.',
    },
  ],

  texts: {
    intro: 'Peli alkaa! Etsikää Pohjois-Amerikan tähti ja palatkaa New Yorkiin tai San Franciscoon.',
    starFound: (name, city) => `★ ${name} löysi POHJOIS-AMERIKAN TÄHDEN kaupungista ${city}!`,
    starToast: 'POHJOIS-AMERIKAN TÄHTI!',
    starChase: 'Nyt on kiire kotiin — myös hevosenkengän haltija voi voittaa pelin.',
    winStar: 'toi Pohjois-Amerikan tähden turvallisesti kotiin',
    winnerStar: (name, money) => `${name} toi Pohjois-Amerikan tähden kotiin ${money} punnan kanssa.`,
  },

  decor: {
    mapLabel: 'POHJOIS-AMERIKKA',
    mapLabelPos: { x: 250, y: 880 },
    compass: { x: 120, y: 430, r: 56 },
    waveSkip: [
      { x: 250, y: 880, r: 175 },
      { x: 120, y: 430, r: 95 },
      { x: 240, y: 620, r: 95 },
      { x: 905, y: 690, r: 105 },
    ],
    ship: { x: 905, y: 690 },
    serpent: { x: 240, y: 620 },
    dieSpot: { x: 0.05, y: 0.34 },
    terrainBands: [
      { maxY: 260, kind: 'mountains' },
      { maxY: 560, kind: 'trees' },
      { maxY: Infinity, kind: 'mountains' },
    ],
  },
};
