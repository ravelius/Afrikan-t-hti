// Etelä-Amerikka-lauta: kaupungit, reitit, kartan piirtotiedot ja teema.
//
// Koordinaatisto on 1000 x 1000 yksikköä.
//
// Kartta on Lambertin konformisessa kartioprojektiossa, standardileveys-
// piireinä 5° ja 45° etelää ja keskimeridiaanina 60° läntistä pituutta.
// Muodot pysyvät oikeina sekä päiväntasaajalla että Patagoniassa. Lähde-
// aineisto on tools/mapdata/southamerica.json ja koordinaatit lasketaan
// komennolla `node tools/project.mjs southamerica`.
//
// Manner on yksi ääriviiva Panaman kannakselta Tulimaahan. Galápagos,
// Falklandinsaaret, Juan Fernándezin Robinson Crusoe, San Ambrosio ja
// Kap Horn ovat omia saariaan, joihin pääsee vain laivalla. Manner on kapea
// ja korkea, joten kartan laidoille jää valtamerta — sinne mahtuvat otsikko,
// kompassi ja laiva.

import { SOUTHAMERICA_QUESTIONS, SOUTHAMERICA_FACTS } from './southamerica-questions.js';
import { themedTokenTypes } from '../tokens.js';

const SA_MAP = {
  width: 1000,
  height: 1000,
  mainlandPoints: [
    [181.9, 96], [195.7, 103.2], [214.1, 101.7], [228.2, 91.6], [235.3, 87.4],
    [251.3, 89.8], [269.4, 96.8], [277.2, 97.4], [289.4, 83.3], [295.2, 66.7],
    [305, 56], [313.8, 50.2], [339.7, 41.2], [357.5, 28.3], [363, 37.5],
    [354.8, 51.1], [376, 41.3], [383.8, 40.7], [406.7, 55.1], [426.9, 54],
    [450.2, 51.3], [470.4, 50.5], [495.3, 48.3], [506.5, 65.5], [523.6, 80.9],
    [535.9, 90.2], [563.1, 108.8], [588.5, 122.9], [618.3, 130], [650.7, 140.6],
    [669.2, 155.2], [674.5, 185.1], [680.1, 207.4], [692.7, 230], [726.8, 247.4],
    [757, 257.9], [791.2, 268], [835.3, 286], [859.4, 309.9], [875.3, 322.7],
    [876, 341.1], [873.4, 354.6], [854.2, 377.3], [838.7, 388.2], [815, 410.1],
    [804.6, 434.1], [791.3, 461.5], [777.4, 486], [766.6, 517.6], [737.6, 533.5],
    [714.9, 541.3], [695.6, 541.8], [671.3, 559.2], [668.4, 578.6], [650.2, 603.4],
    [635.7, 615.5], [621.8, 638.3], [608.5, 660], [590.2, 677.7], [577.2, 677.3],
    [563.1, 673], [553.3, 672.8], [562.8, 691.5], [570.7, 718.4], [515, 731.5],
    [512.2, 751.8], [494.8, 756.3], [484.7, 759.4], [485.7, 786.6], [483.8, 814.4],
    [462.9, 827.9], [468.6, 843.1], [480.6, 853.9], [464.3, 886.2], [459.1, 920.3],
    [460.7, 959.2], [472.6, 969.2], [448.9, 966.2], [434.2, 947.6], [438.5, 935.2],
    [413.5, 919.6], [401.3, 891.5], [393.5, 863.5], [383.8, 822.2], [395.6, 793.1],
    [403.6, 771.7], [395.1, 738.5], [395.5, 711.6], [407.9, 657.2], [406.7, 617.7],
    [412.2, 558.2], [411.6, 534.7], [410.4, 488.8], [407.5, 466.7], [393.3, 448],
    [377.6, 442.8], [341.3, 426.6], [324.8, 408.4], [313.3, 389.6], [288.1, 352.1],
    [271.8, 333.8], [252.5, 315.8], [243.5, 303.2], [244.3, 281.9], [250.9, 269.5],
    [238.8, 246.9], [241.5, 227.6], [260.2, 205.8], [265.6, 191.7], [278.2, 175.1],
    [276.7, 152.8], [272.3, 130.5], [263.2, 108.6], [253.5, 105.2], [239, 112],
    [223.4, 111.3], [217.6, 123.1], [208.8, 116.7], [188.7, 117], [184.9, 112.9],
  ],
  galapagosPoints: [
    [88.8, 263.7], [99, 256.9], [110.7, 263], [120.7, 268.1], [112.5, 277.3],
    [99.4, 277.4], [89.1, 271.1],
  ],
  falklandPoints: [
    [524, 903.1], [536.8, 900.2], [549.6, 903.2], [556.8, 912.1], [545.8, 917.8],
    [533.2, 916.3], [523.1, 910.5],
  ],
  robinsonPoints: [
    [325.2, 672.1], [333.9, 670.9], [334.9, 677.4], [326.2, 678.7],
  ],
  ambrosioPoints: [
    [298.7, 579.4], [307.9, 578], [308.9, 584.4], [299.7, 585.8],
  ],
  hornPoints: [
    [464.6, 966.6], [481.1, 965.7], [481.9, 981.1], [465.6, 982],
  ],
};

// start = aloituskaupunki (ei laattaa), airport = lentokenttä.
const SA_CITIES = [
  {
    id: 'panama', name: 'Panama', x: 236, y: 97, start: true, airport: true,
    la: 'end', lx: -16, ly: 5,
    // Sama kaupunki on myös Pohjois-Amerikan laudalla: kannas yhdistää mantereet.
    links: [{ pack: 'northamerica', city: 'panama', label: 'Pohjois-Amerikan lauta' }],
  },
  {
    id: 'buenosaires', name: 'Buenos Aires', x: 552, y: 677, start: true, airport: true,
    la: 'start', lx: 18, ly: 5,
  },

  { id: 'caracas', name: 'Caracas', x: 429, y: 59 },
  { id: 'bogota', name: 'Bogotá', x: 327, y: 151, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'quito', name: 'Quito', x: 271, y: 230, la: 'end', lx: -16, ly: 5 },
  { id: 'galapagos', name: 'Galápagos', x: 106, y: 269, la: 'middle', lx: 0, ly: 26 },
  { id: 'boavista', name: 'Boa Vista', x: 526, y: 168 },
  { id: 'cayenne', name: 'Cayenne', x: 645, y: 143, la: 'start', lx: 16, ly: 5 },
  { id: 'macapa', name: 'Macapá', x: 661, y: 210, la: 'start', lx: 16, ly: 5 },
  { id: 'manaus', name: 'Manaus', x: 536, y: 254, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'santarem', name: 'Santarém', x: 611, y: 245, la: 'middle', lx: 0, ly: -22 },
  { id: 'saoluis', name: 'São Luís', x: 752, y: 263, la: 'middle', lx: 0, ly: -22 },
  {
    id: 'joaopessoa', name: 'João Pessoa', x: 872, y: 342, airport: true,
    la: 'start', lx: 16, ly: 5,
    // Etelä-Atlantin postilentoreitti Dakariin: Brasilian itäkärki on
    // Afrikkaa lähinnä oleva kohta koko Amerikassa.
    links: [{ pack: 'africa', city: 'dakar', label: 'Afrikan lauta' }],
  },
  { id: 'salvador', name: 'Salvador', x: 811, y: 408, la: 'start', lx: 16, ly: 5 },
  { id: 'iquitos', name: 'Iquitos', x: 351, y: 272, la: 'end', lx: -16, ly: 5 },
  { id: 'portovelho', name: 'Porto Velho', x: 483, y: 332, la: 'end', lx: -16, ly: 5 },
  { id: 'bananal', name: 'Ilha do Bananal', x: 666, y: 364, la: 'start', lx: 16, ly: 5 },
  { id: 'machupicchu', name: 'Machu Picchu', x: 373, y: 402, la: 'start', lx: 16, ly: -6 },
  { id: 'titicaca', name: 'Titicaca', x: 417, y: 430, la: 'start', lx: 16, ly: 8 },
  { id: 'lima', name: 'Lima', x: 319, y: 394, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'santacruz', name: 'Santa Cruz', x: 496, y: 453 },
  { id: 'campogrande', name: 'Campo Grande', x: 602, y: 489, la: 'start', lx: 16, ly: 5 },
  {
    id: 'rio', name: 'Rio de Janeiro', x: 736, y: 529, airport: true,
    la: 'start', lx: 16, ly: 5,
    // Sama kaupunki on myös Maailma-laudalla.
    links: [{ pack: 'maailma', city: 'rio', label: 'Maailma-lauta' }],
  },
  { id: 'saopaulo', name: 'São Paulo', x: 679, y: 522, la: 'start', lx: 16, ly: -6 },
  { id: 'iguazu', name: 'Iguazú', x: 601, y: 557, la: 'end', lx: -16, ly: 5 },
  { id: 'portoalegre', name: 'Porto Alegre', x: 631, y: 613, la: 'start', lx: 16, ly: 5 },
  { id: 'antofagasta', name: 'Antofagasta', x: 416, y: 533, la: 'end', lx: -16, ly: 5 },
  { id: 'salta', name: 'Salta', x: 472, y: 545, la: 'start', lx: 16, ly: 5 },
  { id: 'catamarca', name: 'Catamarca', x: 465, y: 601, la: 'start', lx: 16, ly: 5 },
  { id: 'valparaiso', name: 'Valparaíso', x: 412, y: 657, airport: true, la: 'start', lx: 16, ly: 5 },
  { id: 'sanambrosio', name: 'San Ambrosio', x: 304, y: 582, la: 'middle', lx: 0, ly: 28 },
  { id: 'robinsoncrusoe', name: 'Robinson Crusoe', x: 330, y: 675, la: 'middle', lx: 0, ly: 28 },
  { id: 'puertomontt', name: 'Puerto Montt', x: 408, y: 770, la: 'end', lx: -16, ly: 5 },
  { id: 'sanjorge', name: 'San Jorge', x: 459, y: 824, la: 'start', lx: 16, ly: 5 },
  { id: 'falkland', name: 'Falkland', x: 540, y: 909, la: 'start', lx: 16, ly: 5 },
  { id: 'puntaarenas', name: 'Punta Arenas', x: 433, y: 925, la: 'end', lx: -16, ly: 5 },
  { id: 'caphorn', name: 'Kap Horn', x: 473, y: 974, la: 'middle', lx: 0, ly: -22 },
];

// steps = kuinka monta silmälukua reitin kulkeminen vaatii.
// type 'sea' = laivareitti; via = piirto- ja tarkistuspisteet veden päällä.
const SA_EDGES = [
  // Panaman kannas ja Andien pohjoispää
  { a: 'panama', b: 'bogota', steps: 4 },
  { a: 'bogota', b: 'caracas', steps: 4 },
  { a: 'bogota', b: 'quito', steps: 3 },
  { a: 'quito', b: 'iquitos', steps: 4 },
  { a: 'quito', b: 'lima', steps: 5 },

  // Guyanan ylänkö ja Amazonin suisto
  { a: 'caracas', b: 'boavista', steps: 4 },
  { a: 'boavista', b: 'cayenne', steps: 5 },
  { a: 'boavista', b: 'manaus', steps: 3 },
  { a: 'cayenne', b: 'macapa', steps: 3 },
  { a: 'macapa', b: 'santarem', steps: 3 },
  { a: 'santarem', b: 'manaus', steps: 3 },
  { a: 'santarem', b: 'saoluis', steps: 4 },

  // Amazonin altaan eteläreuna
  { a: 'manaus', b: 'iquitos', steps: 4 },
  { a: 'manaus', b: 'portovelho', steps: 3 },
  { a: 'iquitos', b: 'portovelho', steps: 4 },
  { a: 'portovelho', b: 'santacruz', steps: 4 },
  { a: 'santarem', b: 'bananal', steps: 4 },
  { a: 'bananal', b: 'saoluis', steps: 4 },
  { a: 'bananal', b: 'campogrande', steps: 4 },

  // Brasilian rannikko
  { a: 'saoluis', b: 'joaopessoa', steps: 4 },
  { a: 'joaopessoa', b: 'salvador', steps: 3 },
  { a: 'salvador', b: 'rio', steps: 5 },
  { a: 'rio', b: 'saopaulo', steps: 2 },
  { a: 'saopaulo', b: 'campogrande', steps: 3 },
  { a: 'saopaulo', b: 'iguazu', steps: 3 },
  { a: 'saopaulo', b: 'portoalegre', steps: 3 },
  { a: 'iguazu', b: 'portoalegre', steps: 2 },
  { a: 'iguazu', b: 'buenosaires', steps: 3 },
  { a: 'portoalegre', b: 'buenosaires', steps: 3 },

  // Andit ja Altiplano
  { a: 'lima', b: 'machupicchu', steps: 3 },
  { a: 'machupicchu', b: 'titicaca', steps: 2 },
  { a: 'titicaca', b: 'santacruz', steps: 3 },
  { a: 'titicaca', b: 'antofagasta', steps: 4 },
  { a: 'santacruz', b: 'salta', steps: 3 },
  { a: 'salta', b: 'antofagasta', steps: 3 },
  { a: 'salta', b: 'catamarca', steps: 2 },
  { a: 'catamarca', b: 'valparaiso', steps: 4 },
  { a: 'catamarca', b: 'buenosaires', steps: 4 },

  // Patagonia
  { a: 'valparaiso', b: 'puertomontt', steps: 4 },
  { a: 'buenosaires', b: 'sanjorge', steps: 5 },
  { a: 'sanjorge', b: 'puntaarenas', steps: 5 },

  // Laivareitit
  { a: 'panama', b: 'galapagos', steps: 5, type: 'sea',
    via: [[179, 168], [130, 223]] },
  { a: 'galapagos', b: 'lima', steps: 6, type: 'sea',
    via: [[165, 318], [255, 357]] },
  { a: 'panama', b: 'caracas', steps: 6, type: 'sea',
    via: [[299, 32], [409, 18]] },
  { a: 'caracas', b: 'cayenne', steps: 6, type: 'sea',
    via: [[505, 43], [597, 91]] },
  { a: 'macapa', b: 'saoluis', steps: 5, type: 'sea',
    via: [[708, 223], [742, 241]] },
  { a: 'salvador', b: 'saoluis', steps: 6, type: 'sea',
    via: [[852, 391], [911, 333], [903, 267], [821, 242], [777, 248]] },
  { a: 'lima', b: 'antofagasta', steps: 6, type: 'sea',
    via: [[293, 433], [376, 489]] },
  { a: 'antofagasta', b: 'sanambrosio', steps: 4, type: 'sea', via: [[359, 557]] },
  { a: 'sanambrosio', b: 'robinsoncrusoe', steps: 4, type: 'sea', via: [[314, 629]] },
  { a: 'robinsoncrusoe', b: 'valparaiso', steps: 3, type: 'sea', via: [[371, 665]] },
  { a: 'puertomontt', b: 'puntaarenas', steps: 5, type: 'sea',
    via: [[379, 823], [369, 896], [411, 935]] },
  { a: 'puntaarenas', b: 'caphorn', steps: 3, type: 'sea', via: [[453, 964]] },
  { a: 'caphorn', b: 'falkland', steps: 4, type: 'sea', via: [[510, 959], [536, 936]] },
  { a: 'falkland', b: 'sanjorge', steps: 4, type: 'sea', via: [[517, 877], [493, 839]] },
];

// Lentoreitit kulkevat suoraan kaupungista toiseen yhdellä vuorolla.
const SA_AIR_ROUTES = [
  { a: 'panama', b: 'bogota' },
  { a: 'bogota', b: 'manaus' },
  { a: 'bogota', b: 'lima' },
  { a: 'manaus', b: 'rio' },
  { a: 'joaopessoa', b: 'rio' },
  { a: 'rio', b: 'buenosaires' },
  { a: 'buenosaires', b: 'valparaiso' },
  { a: 'valparaiso', b: 'lima' },
  { a: 'lima', b: 'manaus' },
  { a: 'joaopessoa', b: 'buenosaires' },
];

export const SOUTHAMERICA = {
  id: 'southamerica',
  name: 'Etelä-Amerikan tähti',
  boardLabel: 'Etelä-Amerikka',
  tagline: 'Etsi tähti Andien huipuilta, Amazonin sademetsästä ja Patagonian tuulilta.',
  ariaLabel: 'Etelä-Amerikan aarrekartta',

  map: {
    ...SA_MAP,
    outlines: [
      SA_MAP.mainlandPoints, SA_MAP.galapagosPoints, SA_MAP.falklandPoints,
      SA_MAP.robinsonPoints, SA_MAP.ambrosioPoints, SA_MAP.hornPoints,
    ],
  },
  cities: SA_CITIES,
  edges: SA_EDGES,
  airRoutes: SA_AIR_ROUTES,
  islands: ['galapagos', 'sanambrosio', 'robinsoncrusoe', 'falkland', 'caphorn'],
  // Andien kaupungit ovat oikeasti tiheässä: Lima, Machu Picchu ja Titicaca
  // mahtuvat pienelle alueelle, joten vähimmäisetäisyys on hieman muita väljempi.
  minCityDistance: 50,

  tokens: {
    // Smaragdin tilalla on Kolumbian oma jalokivi ja topaasin tilalla
    // Andien hopea, jonka takia koko manner aikanaan valloitettiin.
    types: themedTokenTypes({
      star: { name: 'Etelä-Amerikan tähti' },
      topaz: { name: 'Potosín hopea', color: '#c9ccd4' },
    }),
    counts: { star: 1, horseshoe: 2, robber: 3, ruby: 4, emerald: 5, topaz: 7, empty: 13 },
  },

  questions: SOUTHAMERICA_QUESTIONS,
  placeFacts: SOUTHAMERICA_FACTS,

  worldPos: { x: 118, y: 128 },
  duels: [
    {
      q: 'Mikä on maailman korkeimmalla sijaitseva pääkaupunki?',
      options: ['La Paz', 'Quito', 'Bogotá', 'Lima', 'Santiago', 'Caracas', 'Asunción', 'Brasília'],
      correct: 0,
      fact: 'Bolivian La Paz on hallituksen istuinpaikka noin 3 600 metrissä. Quito on toisena noin 2 850 metrissä.',
      source: 'https://fi.wikipedia.org/wiki/La_Paz',
    },
    {
      q: 'Mikä näistä maista EI rajoitu Amazonin sademetsään?',
      options: ['Chile', 'Brasilia', 'Peru', 'Kolumbia', 'Bolivia', 'Ecuador', 'Venezuela', 'Guyana'],
      correct: 0,
      fact: 'Chile on Andien länsipuolella kapea kaistale eikä ylety Amazonin altaaseen lainkaan.',
      source: 'https://en.wikipedia.org/wiki/Amazon_rainforest',
    },
    {
      q: 'Minkä maan virallinen kieli on portugali?',
      options: ['Brasilia', 'Argentiina', 'Peru', 'Chile', 'Kolumbia', 'Bolivia', 'Uruguay', 'Paraguay'],
      correct: 0,
      fact: 'Brasilia on ainoa portugalinkielinen maa Etelä-Amerikassa; muualla puhutaan espanjaa ja alkuperäiskieliä.',
      source: 'https://en.wikipedia.org/wiki/Brazil',
    },
    {
      q: 'Mikä on maailman kuivin autiomaa?',
      options: ['Atacama', 'Sahara', 'Gobi', 'Namib', 'Kalahari', 'Patagonia', 'Sonora', 'Rub al-Khali'],
      correct: 0,
      fact: 'Atacama Pohjois-Chilessä on maailman kuivin ei-polaarinen autiomaa; osassa sitä ei ole mitattu sadetta vuosikausiin.',
      source: 'https://en.wikipedia.org/wiki/Atacama_Desert',
    },
    {
      q: 'Kuka johti Espanjan valloitusretkeä inkavaltakuntaan 1530-luvulla?',
      options: ['Francisco Pizarro', 'Hernán Cortés', 'Vasco da Gama', 'Kristoffer Kolumbus',
        'Ferdinand Magalhães', 'Simón Bolívar', 'Amerigo Vespucci', 'Diego de Almagro'],
      correct: 0,
      fact: 'Pizarro vangitsi inkojen hallitsijan Atahualpan Cajamarcassa 1532 ja kukisti valtakunnan muutamassa vuodessa.',
      source: 'https://en.wikipedia.org/wiki/Francisco_Pizarro',
    },
    {
      q: 'Mikä on Etelä-Amerikan pisin jokijärjestelmä?',
      options: ['Amazon', 'Paraná', 'Orinoco', 'Río Negro', 'Madeira', 'São Francisco', 'Uruguay', 'Magdalena'],
      correct: 0,
      fact: 'Amazon on noin 6 400 kilometriä pitkä ja kuljettaa enemmän vettä kuin mikään muu joki maailmassa.',
      source: 'https://en.wikipedia.org/wiki/Amazon_River',
    },
  ],

  texts: {
    intro: 'Peli alkaa! Etsikää Etelä-Amerikan tähti ja palatkaa Panamaan tai Buenos Airesiin.',
    starFound: (name, city) => `★ ${name} löysi ETELÄ-AMERIKAN TÄHDEN kaupungista ${city}!`,
    starToast: 'ETELÄ-AMERIKAN TÄHTI!',
    starChase: 'Nyt on kiire kotiin — myös hevosenkengän haltija voi voittaa pelin.',
    winStar: 'toi Etelä-Amerikan tähden turvallisesti kotiin',
    winnerStar: (name, money) => `${name} toi Etelä-Amerikan tähden kotiin ${money} punnan kanssa.`,
  },

  decor: {
    mapLabel: 'ETELÄ-AMERIKKA',
    mapLabelPos: { x: 790, y: 900 },
    compass: { x: 148, y: 800, r: 58 },
    waveSkip: [
      { x: 790, y: 900, r: 170 },
      { x: 148, y: 800, r: 100 },
      { x: 150, y: 420, r: 95 },
      { x: 830, y: 120, r: 105 },
    ],
    ship: { x: 830, y: 120 },
    serpent: { x: 150, y: 420 },
    dieSpot: { x: 0.06, y: 0.62 },
    terrainBands: [
      { maxY: 300, kind: 'trees' },
      { maxY: 620, kind: 'mountains' },
      { maxY: Infinity, kind: 'mountains' },
    ],
  },
};
