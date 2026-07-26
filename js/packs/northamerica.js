// Pohjois-Amerikka-lauta: kaupungit, reitit, kartan piirtotiedot ja teema.
//
// Koordinaatisto on 1000 x 1000 yksikköä.
//
// Kartta on Lambertin konformisessa kartioprojektiossa, standardileveys-
// piireinä 20° ja 60° pohjoista leveyttä ja keskimeridiaanina 100° läntistä
// pituutta. Muodot pysyvät oikeina sekä Meksikossa että Alaskassa, toisin kuin
// yksinkertaisessa lieriöprojektiossa, joka venyttäisi pohjoisen leveäksi.
// Lähdeaineisto on tools/mapdata/northamerica.json ja koordinaatit lasketaan
// komennolla `node tools/project.mjs northamerica`.
//
// Manner on yksi ääriviiva Beringinsalmelta Panaman kannakselle;
// Hudsoninlahti ja Kalifornianlahti työntyvät siihen lahtina. Grönlanti, Newfoundland, Kuuba, Puerto Rico, Bermuda ja Havaiji
// ovat omia saariaan, joihin pääsee vain laivalla.

import { NORTHAMERICA_QUESTIONS, NORTHAMERICA_FACTS } from './northamerica-questions.js';
import { themedTokenTypes } from '../tokens.js';

const NA_MAP = {
  width: 1000,
  height: 1000,
  mainlandPoints: [
    [301.9, 153.9], [306.4, 141.6], [321.9, 139.3], [333.7, 133.3], [332.7, 113.7],
    [372, 116], [387.6, 113.2], [403.5, 138.6], [419.4, 154.3], [431.9, 168.3],
    [455.6, 180.7], [486.8, 185.7], [501.8, 197], [538.8, 218.3], [560.8, 227.8],
    [584.5, 223.6], [607.5, 224.2], [630.5, 223.6], [638.1, 266.2], [646, 301.4],
    [655.2, 341.3], [682, 361], [703.4, 374.8], [721.2, 365.7], [728.5, 340.9],
    [733.2, 310.3], [730, 287.1], [722.9, 270.6], [759, 278.4], [788.1, 292.7],
    [810.9, 302.1], [828.9, 312.9], [849.8, 328], [874.8, 334.2], [894.1, 348.9],
    [886.4, 371.7], [874.3, 395.8], [867.7, 416.8], [873.4, 426.2], [891.6, 423.9],
    [898.5, 412.1], [903, 419.5], [896.2, 433.7], [882.6, 441.2], [872.1, 456.3],
    [861.7, 447.7], [866.9, 430.2], [862.2, 442.8], [852.3, 449.1], [840.9, 474.2],
    [834.8, 493.6], [820.3, 515.3], [815.4, 528.1], [811.7, 546.1], [817.7, 567.1],
    [798.4, 600.4], [784.1, 620.6], [796, 651.9], [805.6, 680.6], [794.3, 690],
    [779.2, 666.9], [765.3, 647], [750.2, 644.1], [721.5, 646.4], [704.1, 662],
    [669.8, 657.4], [655.9, 666.1], [637.7, 700.4], [634, 745.8], [651.3, 777.4],
    [668.4, 788.1], [695.7, 781.3], [716.4, 768.6], [745.5, 741.6], [734.5, 780.4],
    [743.7, 806.5], [790.8, 810.9], [802.1, 839.4], [821.1, 873.3], [857.1, 865.3],
    [854.9, 882.6], [817.5, 886.8], [789.9, 872.8], [761.2, 846.4], [724.5, 839],
    [693.8, 824], [664.4, 814.2], [630.1, 809.7], [596.3, 798.1], [563.6, 779.7],
    [548.2, 761.5], [549.7, 738.6], [540.3, 723.2], [526.5, 702.8], [513.2, 684.6],
    [500.5, 666.3], [488.4, 647.9], [480.7, 635.6], [469.5, 645], [480.4, 669.1],
    [496.3, 699.5], [505.5, 726.7], [486.3, 698.2], [469.8, 673.1], [456.4, 637],
    [451.3, 613.7], [441.2, 594.8], [425.6, 563.3], [416.5, 546.4], [412.1, 514.8],
    [417.1, 482.4], [429.2, 454.2], [431.9, 431.2], [444.1, 427.8], [423.3, 398.7],
    [414.8, 360.7], [408.8, 322.5], [398.6, 299.7], [384.6, 274.2], [359.1, 260.7],
    [341.1, 256.8], [323.2, 252.2], [303.6, 259.6], [282, 258], [255.3, 251.3],
    [241.9, 247.3], [273.2, 229.4], [278.9, 204.3], [269.9, 188.5], [293.7, 170.6],
  ],
  greenlandPoints: [
    [847.3, 245.5], [850.9, 229.9], [847.6, 204], [833.4, 177], [818.4, 149.4],
    [806.2, 126.6], [812.5, 117.5], [842.3, 156.2], [866, 199], [876.7, 234.5],
    [869, 254.4],
  ],
  newfoundlandPoints: [
    [895.7, 396.4], [906.7, 379.6], [910.4, 363.9], [923.2, 357.7], [938.9, 372.6],
    [932.9, 388.8], [911.2, 395.8],
  ],
  cubaPoints: [
    [766.6, 732.3], [788.8, 714.2], [809.4, 710.9], [836.5, 711.4], [872.8, 722.8],
    [883, 726.9], [859.7, 736.1], [823.9, 726.3], [791.8, 728.7],
  ],
  puertoRicoPoints: [
    [959, 718.9], [978.4, 711], [982, 719.6], [962.4, 727.6],
  ],
  bermudaPoints: [
    [921.1, 564.3], [927.1, 561.7], [929.7, 567.8], [923.7, 570.3],
  ],
  hawaiiPoints: [
    [18, 535], [35.6, 552.1], [47.6, 571.4], [34.7, 590.6], [30.6, 567.2],
    [18.6, 544.4],
  ],
};

// start = aloituskaupunki (ei laattaa), airport = lentokenttä.
const NA_CITIES = [
  {
    id: 'newyork', name: 'New York', x: 816, y: 507, start: true, airport: true,
    la: 'start', lx: 16, ly: 5,
    // Sama kaupunki on myös Maailma-laudalla.
    links: [{ pack: 'maailma', city: 'newyork', label: 'Maailma-lauta' }],
  },
  {
    id: 'sanfrancisco', name: 'San Francisco', x: 419, y: 546, start: true, airport: true,
    la: 'end', lx: -18, ly: 5,
  },

  { id: 'nome', name: 'Nome', x: 304, y: 154, la: 'start', lx: 16, ly: 5 },
  { id: 'anchorage', name: 'Anchorage', x: 342, y: 234, airport: true, la: 'start', lx: 16, ly: 5 },
  { id: 'whitehorse', name: 'Whitehorse', x: 413, y: 279, la: 'middle', lx: 0, ly: 28 },
  { id: 'yellowknife', name: 'Yellowknife', x: 530, y: 291, la: 'middle', lx: 0, ly: -22 },
  { id: 'vancouver', name: 'Vancouver', x: 446, y: 423, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'yellowstone', name: 'Yellowstone', x: 527, y: 493, la: 'end', lx: -16, ly: 5 },
  { id: 'mountrushmore', name: 'Mount Rushmore', x: 585, y: 489, la: 'middle', lx: 0, ly: -24 },
  { id: 'winnipeg', name: 'Winnipeg', x: 628, y: 439, la: 'middle', lx: 0, ly: -22 },
  { id: 'churchill', name: 'Churchill', x: 643, y: 339, la: 'end', lx: -16, ly: 5 },
  { id: 'iqaluit', name: 'Iqaluit', x: 749, y: 282, la: 'start', lx: 16, ly: 5 },
  { id: 'nuuk', name: 'Nuuk', x: 851, y: 205, la: 'end', lx: -16, ly: 5 },
  { id: 'labrador', name: 'Labrador', x: 862, y: 343, la: 'end', lx: -16, ly: 5 },
  { id: 'stjohns', name: 'St. John’s', x: 924, y: 373, la: 'end', lx: -16, ly: -14 },
  { id: 'halifax', name: 'Halifax', x: 881, y: 436, la: 'start', lx: 16, ly: 5 },
  { id: 'montreal', name: 'Montreal', x: 805, y: 450, la: 'middle', lx: 0, ly: -22 },
  { id: 'toronto', name: 'Toronto', x: 768, y: 488, la: 'end', lx: -16, ly: 5 },
  { id: 'chicago', name: 'Chicago', x: 707, y: 520, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'appalakit', name: 'Appalakit', x: 774, y: 556, la: 'end', lx: -16, ly: 5 },
  { id: 'bermuda', name: 'Bermuda', x: 925, y: 566, la: 'start', lx: 16, ly: 5 },
  { id: 'denver', name: 'Denver', x: 566, y: 549, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'santafe', name: 'Santa Fe', x: 552, y: 604, la: 'start', lx: 16, ly: 5 },
  { id: 'grandcanyon', name: 'Grand Canyon', x: 501, y: 582, la: 'end', lx: -16, ly: 5 },
  { id: 'losangeles', name: 'Los Angeles', x: 444, y: 593, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'hawaii', name: 'Havaiji', x: 33, y: 564, la: 'middle', lx: 0, ly: 28 },
  { id: 'dallas', name: 'Dallas', x: 637, y: 625, la: 'start', lx: 16, ly: 5 },
  { id: 'neworleans', name: 'New Orleans', x: 700, y: 648, airport: true, la: 'start', lx: 16, ly: 5 },
  { id: 'miami', name: 'Miami', x: 800, y: 677, airport: true, la: 'start', lx: 16, ly: 5 },
  { id: 'santiagodecuba', name: 'Santiago de Cuba', x: 863, y: 729, la: 'middle', lx: 0, ly: -22 },
  { id: 'sanjuan', name: 'San Juan', x: 971, y: 719, la: 'end', lx: -16, ly: 5 },
  { id: 'monterrey', name: 'Monterrey', x: 605, y: 704, la: 'end', lx: -16, ly: 5 },
  { id: 'mexico', name: 'Mexico City', x: 617, y: 774, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'merida', name: 'Mérida', x: 724, y: 764, la: 'start', lx: 16, ly: -6 },
  { id: 'guatemala', name: 'Guatemala', x: 717, y: 823, la: 'end', lx: -16, ly: 5 },
  { id: 'managua', name: 'Managua', x: 770, y: 846, la: 'end', lx: -16, ly: 16 },
  {
    id: 'panama', name: 'Panama', x: 856, y: 870, airport: true, la: 'start', lx: 16, ly: 5,
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
    via: [[316, 275], [342, 303], [380, 359], [415, 402]] },
  { a: 'sanfrancisco', b: 'hawaii', steps: 7, type: 'sea',
    via: [[358, 572], [229, 590], [95, 577]] },
  { a: 'hawaii', b: 'losangeles', steps: 7, type: 'sea',
    via: [[60, 630], [223, 650], [378, 636]] },
  { a: 'miami', b: 'santiagodecuba', steps: 3, type: 'sea', via: [[823, 700]] },
  { a: 'miami', b: 'bermuda', steps: 5, type: 'sea', via: [[856, 630], [903, 591]] },
  { a: 'santiagodecuba', b: 'sanjuan', steps: 4, type: 'sea', via: [[919, 725]] },
  { a: 'sanjuan', b: 'bermuda', steps: 5, type: 'sea', via: [[955, 654], [942, 599]] },
  { a: 'bermuda', b: 'newyork', steps: 5, type: 'sea', via: [[875, 543], [836, 522]] },
  { a: 'bermuda', b: 'halifax', steps: 5, type: 'sea', via: [[911, 505], [901, 462]] },
  { a: 'halifax', b: 'stjohns', steps: 4, type: 'sea', via: [[904, 406]] },
  { a: 'stjohns', b: 'nuuk', steps: 6, type: 'sea', via: [[924, 325], [903, 258], [868, 226]] },
  { a: 'nuuk', b: 'iqaluit', steps: 4, type: 'sea', via: [[807, 227]] },
  { a: 'iqaluit', b: 'churchill', steps: 6, type: 'sea',
    via: [[735, 274], [718, 296], [694, 319], [666, 334]] },
  { a: 'santiagodecuba', b: 'merida', steps: 4, type: 'sea', via: [[779, 748]] },
  { a: 'santiagodecuba', b: 'panama', steps: 5, type: 'sea', via: [[857, 790], [850, 835]] },
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
      { x: 140, y: 700, r: 95 },
      { x: 848, y: 880, r: 105 },
    ],
    ship: { x: 848, y: 880 },
    serpent: { x: 140, y: 700 },
    dieSpot: { x: 0.05, y: 0.34 },
    terrainBands: [
      { maxY: 260, kind: 'mountains' },
      { maxY: 560, kind: 'trees' },
      { maxY: Infinity, kind: 'mountains' },
    ],
  },
};
