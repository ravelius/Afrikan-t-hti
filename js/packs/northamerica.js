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
    [302, 152.8], [306.5, 140.5], [322.1, 138.2], [333.9, 132.2], [332.8, 112.6],
    [372.3, 114.8], [387.9, 112.1], [403.9, 137.5], [419.8, 153.2], [432.4, 167.3],
    [456.1, 179.7], [487.4, 184.7], [502.5, 196], [539.6, 217.5], [561.7, 227],
    [585.4, 222.7], [608.5, 223.4], [631.6, 222.7], [639.2, 265.5], [647.1, 300.8],
    [656.4, 340.8], [683.3, 360.6], [704.7, 374.4], [722.5, 365.3], [729.8, 340.4],
    [734.6, 309.7], [731.4, 286.4], [724.3, 269.9], [760.5, 277.7], [789.7, 292.1],
    [812.5, 301.5], [830.6, 312.3], [851.5, 327.4], [876.6, 333.7], [896, 348.5],
    [888.3, 371.3], [876.1, 395.5], [869.5, 416.6], [875.2, 426], [893.4, 423.7],
    [900.4, 411.8], [904.9, 419.3], [898.1, 433.5], [884.4, 441], [873.9, 456.2],
    [863.5, 447.5], [868.7, 430], [864, 442.6], [854.1, 448.9], [842.6, 474.2],
    [836.6, 493.5], [822, 515.4], [817.1, 528.2], [813.4, 546.3], [819.3, 567.3],
    [800, 600.7], [785.7, 621], [797.6, 652.3], [807.3, 681.1], [795.8, 690.6],
    [780.7, 667.4], [766.8, 647.4], [751.6, 644.6], [722.9, 646.8], [705.4, 662.4],
    [671, 657.9], [657.1, 666.6], [638.8, 701], [635.1, 746.5], [652.5, 778.2],
    [669.6, 788.9], [696.9, 782.1], [717.8, 769.4], [746.9, 742.3], [735.9, 781.3],
    [745.1, 807.4], [792.4, 811.8], [803.8, 840.4], [822.8, 874.4], [858.9, 866.4],
    [856.6, 883.7], [819.2, 887.9], [791.5, 874], [762.7, 847.4], [725.9, 840.1],
    [695.1, 825], [665.6, 815.2], [631.2, 810.6], [597.3, 799], [564.5, 780.5],
    [549.1, 762.3], [550.5, 739.3], [541.1, 723.8], [527.3, 703.4], [514, 685.2],
    [501.2, 666.8], [489.1, 648.3], [481.3, 636], [470.1, 645.4], [481, 669.6],
    [497, 700.1], [506.2, 727.4], [486.9, 698.8], [470.4, 673.6], [457, 637.5],
    [451.9, 614], [441.7, 595.1], [426.1, 563.5], [417, 546.5], [412.5, 514.9],
    [417.6, 482.4], [429.7, 454.1], [432.4, 431], [444.7, 427.5], [423.7, 398.4],
    [415.2, 360.3], [409.2, 321.9], [399, 299.1], [384.9, 273.5], [359.3, 260],
    [341.3, 256.1], [323.3, 251.4], [303.7, 258.9], [282, 257.2], [255.2, 250.5],
    [241.8, 246.6], [273.2, 228.6], [278.9, 203.4], [269.9, 187.6], [293.8, 169.6],
  ],
  greenlandPoints: [
    [870.2, 252.6], [879.3, 240.1], [882.3, 224.1], [893.2, 225.1], [896, 214.5],
    [888.5, 190.6], [880, 166.8], [864.6, 139.6], [845.3, 122.6], [823.3, 114.8],
    [810.8, 118.7], [811.3, 138.7], [821.1, 162.7], [822.7, 183.6], [834.3, 198.2],
    [848, 211], [855.7, 234.1],
  ],
  newfoundlandPoints: [
    [902.1, 343.9], [898.9, 349.4], [897.6, 360.2], [895, 370.3], [892.8, 380.1],
    [896.8, 392.8], [904.2, 392.8], [913.8, 388.9], [922.8, 385.2], [931.9, 378.8],
    [938.5, 381.3], [940.9, 372.2], [933.9, 366.2], [925.5, 363.5], [915.3, 363],
    [907.7, 359.7], [906.6, 349],
  ],
  cubaPoints: [
    [767.7, 734.3], [777.1, 729.1], [788.4, 721.1], [794.5, 714], [803.7, 712.1],
    [811.9, 710.2], [824.7, 714.3], [836.5, 713.7], [848.8, 718.7], [861.9, 722.3],
    [873.6, 723.7], [884.2, 725.4], [881.1, 730], [870.9, 734.1], [860.4, 737.1],
    [848.6, 739.1], [836.9, 737.3], [822.7, 733.6], [809.7, 729.5], [799.2, 731.7],
    [788.8, 733.8], [776, 735.1],
  ],
  puertoRicoPoints: [
    [963.5, 719.8], [971.8, 716.5], [980.4, 714.2], [982, 718], [974.2, 722.5],
    [965.7, 725.3],
  ],
  bermudaPoints: [
    [926, 565.9], [927.7, 565.3], [928.4, 566.2], [927.3, 567.1], [926.3, 566.7],
  ],
  hawaiiPoints: [
    // Saariketju on tuotu lähemmäs mannerta, jotta lauta rajautuu tiiviisti.
    [168, 590], [177.6, 594.2], [182.3, 605.3], [185.4, 613.5], [192.3, 620.3],
    [192.3, 633.3], [196.8, 645.2], [186.8, 649.4], [185.7, 639.9], [188.2, 625.8],
    [182.3, 614], [175.2, 604], [169.2, 596.2],
  ],
};

// start = aloituskaupunki (ei laattaa), airport = lentokenttä.
const NA_CITIES = [
  {
    id: 'newyork', name: 'New York', x: 818, y: 507, start: true, airport: true,
    la: 'start', lx: 16, ly: 5,
    // Sama kaupunki on myös Maailma-laudalla.
    links: [{ pack: 'maailma', city: 'newyork', label: 'Maailma-lauta' }],
  },
  {
    id: 'sanfrancisco', name: 'San Francisco', x: 420, y: 546, start: true, airport: true,
    la: 'end', lx: -18, ly: 5,
  },

  { id: 'nome', name: 'Nome', x: 304, y: 153, la: 'start', lx: 16, ly: 5 },
  { id: 'anchorage', name: 'Anchorage', x: 343, y: 234, airport: true, la: 'start', lx: 16, ly: 5 },
  { id: 'whitehorse', name: 'Whitehorse', x: 414, y: 278, la: 'middle', lx: 0, ly: 28 },
  { id: 'yellowknife', name: 'Yellowknife', x: 530, y: 290, la: 'middle', lx: 0, ly: -22 },
  { id: 'vancouver', name: 'Vancouver', x: 447, y: 422, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'yellowstone', name: 'Yellowstone', x: 527, y: 493, la: 'end', lx: -16, ly: 5 },
  { id: 'mountrushmore', name: 'Mount Rushmore', x: 586, y: 489, la: 'middle', lx: -14, ly: -24 },
  { id: 'winnipeg', name: 'Winnipeg', x: 629, y: 439, la: 'middle', lx: 0, ly: -22 },
  { id: 'churchill', name: 'Churchill', x: 644, y: 338, la: 'end', lx: -16, ly: 5 },
  { id: 'iqaluit', name: 'Iqaluit', x: 750, y: 281, la: 'start', lx: 16, ly: 5 },
  { id: 'nuuk', name: 'Nuuk', x: 852, y: 204, la: 'end', lx: -16, ly: 5 },
  { id: 'labrador', name: 'Labrador', x: 863, y: 343, la: 'end', lx: -16, ly: 5 },
  { id: 'stjohns', name: 'St. John’s', x: 926, y: 372, la: 'end', lx: -16, ly: 18 },
  { id: 'halifax', name: 'Halifax', x: 883, y: 436, la: 'start', lx: 16, ly: 5 },
  { id: 'montreal', name: 'Montreal', x: 807, y: 450, la: 'middle', lx: 0, ly: -22 },
  { id: 'toronto', name: 'Toronto', x: 769, y: 488, la: 'end', lx: -16, ly: 5 },
  { id: 'chicago', name: 'Chicago', x: 709, y: 520, airport: true, la: 'start', lx: 16, ly: 12 },
  { id: 'appalakit', name: 'Appalakit', x: 776, y: 556, la: 'end', lx: -16, ly: 26 },
  { id: 'bermuda', name: 'Bermuda', x: 927, y: 566, la: 'start', lx: 16, ly: 5 },
  { id: 'denver', name: 'Denver', x: 567, y: 550, airport: true, la: 'start', lx: 16, ly: 5 },
  { id: 'santafe', name: 'Santa Fe', x: 553, y: 604, la: 'start', lx: 16, ly: 5 },
  { id: 'grandcanyon', name: 'Grand Canyon', x: 502, y: 583, la: 'middle', lx: 0, ly: -22 },
  {
    id: 'losangeles', name: 'Los Angeles', x: 445, y: 594, airport: true, la: 'end', lx: -16, ly: 5,
    links: [{ pack: 'maailma', city: 'losangeles', label: 'Maailma-lauta' }],
  },
  { id: 'hawaii', name: 'Havaiji', x: 185, y: 628, la: 'middle', lx: 0, ly: 34 },
  { id: 'dallas', name: 'Dallas', x: 638, y: 626, la: 'start', lx: 16, ly: 5 },
  { id: 'neworleans', name: 'New Orleans', x: 701, y: 649, airport: true, la: 'start', lx: 16, ly: 5 },
  { id: 'miami', name: 'Miami', x: 801, y: 678, airport: true, la: 'start', lx: 16, ly: 5 },
  { id: 'santiagodecuba', name: 'Santiago de Cuba', x: 865, y: 730, la: 'middle', lx: 0, ly: 24 },
  { id: 'sanjuan', name: 'San Juan', x: 973, y: 720, la: 'end', lx: -16, ly: 5 },
  { id: 'monterrey', name: 'Monterrey', x: 606, y: 705, la: 'end', lx: -16, ly: 5 },
  { id: 'mexico', name: 'Mexico City', x: 618, y: 775, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'merida', name: 'Mérida', x: 725, y: 765, la: 'start', lx: 16, ly: -6 },
  { id: 'guatemala', name: 'Guatemala', x: 718, y: 824, la: 'end', lx: -16, ly: 5 },
  { id: 'managua', name: 'Managua', x: 771, y: 847, la: 'start', lx: 14, ly: 16 },
  {
    id: 'panama', name: 'Panama', x: 857, y: 871, airport: true, la: 'start', lx: 16, ly: 5,
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
    via: [[316, 274], [342, 303], [380, 359], [415, 402]] },
  { a: 'sanfrancisco', b: 'hawaii', steps: 7, type: 'sea',
    via: [[350, 588], [265, 606]] },
  { a: 'hawaii', b: 'losangeles', steps: 7, type: 'sea',
    via: [[245, 674], [350, 657]] },
  { a: 'miami', b: 'santiagodecuba', steps: 3, type: 'sea', via: [[825, 700]] },
  { a: 'miami', b: 'bermuda', steps: 5, type: 'sea', via: [[857, 631], [905, 591]] },
  { a: 'santiagodecuba', b: 'sanjuan', steps: 4, type: 'sea', via: [[921, 726]] },
  { a: 'sanjuan', b: 'bermuda', steps: 5, type: 'sea', via: [[957, 654], [944, 599]] },
  { a: 'bermuda', b: 'newyork', steps: 5, type: 'sea', via: [[877, 543], [837, 522]] },
  { a: 'bermuda', b: 'halifax', steps: 5, type: 'sea', via: [[913, 505], [902, 462]] },
  { a: 'halifax', b: 'stjohns', steps: 4, type: 'sea', via: [[906, 406]] },
  { a: 'stjohns', b: 'nuuk', steps: 6, type: 'sea', via: [[926, 325], [905, 258], [870, 225]] },
  { a: 'nuuk', b: 'iqaluit', steps: 4, type: 'sea', via: [[809, 226]] },
  { a: 'iqaluit', b: 'churchill', steps: 6, type: 'sea',
    via: [[736, 273], [719, 296], [695, 318], [668, 334]] },
  { a: 'santiagodecuba', b: 'merida', steps: 4, type: 'sea', via: [[781, 748]] },
  { a: 'santiagodecuba', b: 'panama', steps: 5, type: 'sea', via: [[859, 791], [852, 836]] },
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
  name: 'Montezuman aarre',
  boardLabel: 'Pohjois-Amerikka',
  tagline: 'Etsi Montezuman kadonnut aarre Kalliovuorilta, preerialta, Karibian saarilta ja Alaskan tundralta.',
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
      star: { name: 'Montezuman aarre' },
      topaz: { name: 'Klondiken kulta', color: '#e0b02a' },
    }),
    counts: { star: 1, horseshoe: 2, robber: 3, ruby: 4, emerald: 5, topaz: 7, empty: 13 },
  },

  questions: NORTHAMERICA_QUESTIONS,
  placeFacts: NORTHAMERICA_FACTS,

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
    intro: 'Peli alkaa! Etsikää Montezuman aarre ja palatkaa New Yorkiin tai San Franciscoon.',
    starFound: (name, city) => `★ ${name} löysi MONTEZUMAN AARTEEN kaupungista ${city}!`,
    starToast: 'MONTEZUMAN AARRE!',
    starChase: 'Nyt on kiire kotiin — myös hevosenkengän haltija voi voittaa pelin.',
    winStar: 'toi Montezuman aarteen turvallisesti kotiin',
    winnerStar: (name, money) => `${name} toi Montezuman aarteen kotiin ${money} punnan kanssa.`,
    // Saapumismerkinnät: yksi arvotaan laudalle saavuttaessa.
    // KAISTA B: tälle laudalle tarvitaan vielä vähintään neljä merkintää.
    diaries: [
      'Siirtokunnat ovat pärjänneet ilman meitä hämmentävän hyvin. Päätin olla ottamatta teekutsuja puheeksi.',
    ],
    // Isoisän vihjeet laudan pääaarteesta: suunta tai seutu, ei koskaan
    // kaupungin nimeä. KAISTA B: vihje puuttuu vielä kaikilta
    // aarrekaupungeilta — ks. docs/tyolista-opukselle.md, paketti 4.
    starHints: {},
  },

  decor: {
    mapLabel: 'POHJOIS-AMERIKKA',
    mapLabelPos: { x: 250, y: 880 },
    compass: { x: 195, y: 330, r: 56 },
    waveSkip: [
      { x: 250, y: 880, r: 175 },
      { x: 195, y: 330, r: 95 },
      { x: 255, y: 768, r: 95 },
      { x: 935, y: 128, r: 100 },
    ],
    ship: { x: 935, y: 128 },
    serpent: { x: 255, y: 768 },
    dieSpot: { x: 0.05, y: 0.34 },
    terrainBands: [
      { maxY: 260, kind: 'mountains' },
      { maxY: 560, kind: 'trees' },
      { maxY: Infinity, kind: 'mountains' },
    ],
  },
};
