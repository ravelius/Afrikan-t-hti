// Etelä-Amerikka-lauta: kaupungit, reitit, kartan piirtotiedot ja teema.
//
// Koordinaatisto on 1000 x 1000 yksikköä ja vastaa suoraan Etelä-Amerikan
// karttaa:
//   x = (pituusaste + 93) * 13.3 + 65   (lännestä -93° itään -33°)
//   y = (14 - leveysaste) * 14.1        (pohjoisesta 14° etelään -57°)
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
    [198, 62], [208.6, 70.5], [224.6, 71.9], [237.9, 64.9], [244.6, 62],
    [257.9, 66.3], [272.5, 74.7], [279.1, 76.1], [291.1, 64.9], [297.8, 50.8],
    [307.1, 42.3], [315, 38.1], [337.7, 32.4], [353.6, 22.6], [357.6, 31],
    [349.6, 42.3], [368.2, 35.3], [374.9, 35.3], [393.5, 49.4], [410.8, 49.4],
    [430.8, 47.9], [448, 47.9], [469.3, 46.5], [478.6, 62], [493.3, 76.1],
    [503.9, 84.6], [527.8, 101.5], [550.5, 114.2], [577.1, 119.8], [606.3, 128.3],
    [623.6, 141], [630.3, 169.2], [636.9, 190.3], [650.2, 211.5], [683.5, 225.6],
    [712.7, 232.7], [746, 238.3], [789.9, 249.6], [816.5, 269.3], [833.7, 279.2],
    [837.7, 297.5], [837.7, 311.6], [823.1, 338.4], [809.8, 352.5], [789.9, 379.3],
    [783.2, 406.1], [773.9, 437.1], [763.3, 465.3], [756.6, 500.6], [727.3, 521.7],
    [703.4, 533], [682.1, 535.8], [656.9, 556.9], [655.5, 578.1], [636.9, 606.3],
    [620.9, 620.4], [606.3, 645.8], [591.7, 669.8], [570.4, 689.5], [554.4, 689.5],
    [537.2, 685.3], [525.2, 685.3], [537.2, 705], [547.8, 733.2], [477.3, 747.3],
    [473.3, 768.4], [450.7, 772.7], [437.4, 775.5], [437.4, 803.7], [433.4, 831.9],
    [404.2, 844.6], [410.8, 860.1], [426.8, 871.4], [401.5, 902.4], [390.9, 934.8],
    [389.5, 971.5], [406.8, 981.4], [370.9, 977.1], [350.9, 958.8], [358.9, 947.5],
    [324.4, 930.6], [311.1, 902.4], [304.4, 874.2], [297.8, 831.9], [317.7, 803.7],
    [331, 782.5], [324.4, 747.3], [328.3, 719.1], [349.6, 662.7], [352.3, 620.4],
    [364.3, 556.9], [365.6, 531.6], [368.2, 482.2], [366.9, 458.3], [353.6, 437.1],
    [337.7, 430.1], [301.7, 408.9], [287.1, 387.8], [277.8, 366.6], [257.9, 324.3],
    [244.6, 303.1], [228.6, 282], [221.9, 267.9], [225.9, 246.8], [233.9, 235.5],
    [225.9, 211.5], [231.3, 193.2], [251.2, 174.8], [257.9, 162.2], [271.1, 148],
    [272.5, 126.9], [271.1, 105.8], [265.8, 84.6], [257.9, 80.4], [244.6, 84.6],
    [231.3, 81.8], [224.6, 91.6], [218, 84.6], [200.7, 81.8], [198, 77.5],
  ],
  galapagosPoints: [
    [86.3, 198.8], [96.9, 194.6], [106.2, 203], [114.2, 210.1], [104.9, 217.1],
    [92.9, 214.3], [85, 205.9],
  ],
  falklandPoints: [
    [486.6, 920.7], [505.2, 917.9], [523.9, 920.7], [534.5, 929.2], [518.5, 934.8],
    [499.9, 933.4], [485.3, 927.8],
  ],
  robinsonPoints: [
    [246.5, 666.8], [261.5, 666.8], [261.5, 677], [246.2, 677],
  ],
  ambrosioPoints: [
    [231.6, 563.8], [246.9, 563.8], [246.9, 574], [231.6, 574],
  ],
  hornPoints: [
    [399.8, 979.8], [415.1, 979.8], [415.1, 991.4], [399.8, 991.4],
  ],
};

// start = aloituskaupunki (ei laattaa), airport = lentokenttä.
const SA_CITIES = [
  {
    id: 'panama', name: 'Panama', x: 244, y: 74, start: true, airport: true,
    la: 'end', lx: -16, ly: 5,
    // Sama kaupunki on myös Pohjois-Amerikan laudalla: kannas yhdistää mantereet.
    links: [{ pack: 'northamerica', city: 'panama', label: 'Pohjois-Amerikan lauta' }],
  },
  {
    id: 'buenosaires', name: 'Buenos Aires', x: 528, y: 694, start: true, airport: true,
    la: 'start', lx: 18, ly: 5,
  },

  { id: 'caracas', name: 'Caracas', x: 414, y: 57 },
  { id: 'bogota', name: 'Bogotá', x: 317, y: 131, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'quito', name: 'Quito', x: 258, y: 200, la: 'end', lx: -16, ly: 5 },
  { id: 'galapagos', name: 'Galápagos', x: 101, y: 208, la: 'middle', lx: 0, ly: 26 },
  { id: 'boavista', name: 'Boa Vista', x: 495, y: 158 },
  { id: 'cayenne', name: 'Cayenne', x: 600, y: 136, la: 'start', lx: 16, ly: 5 },
  { id: 'macapa', name: 'Macapá', x: 620, y: 200, la: 'start', lx: 16, ly: 5 },
  { id: 'manaus', name: 'Manaus', x: 504, y: 241, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'santarem', name: 'Santarém', x: 574, y: 240, la: 'middle', lx: 0, ly: -22 },
  { id: 'saoluis', name: 'São Luís', x: 707, y: 241, la: 'middle', lx: 0, ly: -22 },
  {
    id: 'joaopessoa', name: 'João Pessoa', x: 830, y: 300, airport: true,
    la: 'start', lx: 16, ly: 5,
    // Etelä-Atlantin postilentoreitti Dakariin: Brasilian itäkärki on
    // Afrikkaa lähinnä oleva kohta koko Amerikassa.
    links: [{ pack: 'africa', city: 'dakar', label: 'Afrikan lauta' }],
  },
  { id: 'salvador', name: 'Salvador', x: 783, y: 385, la: 'start', lx: 16, ly: 5 },
  { id: 'iquitos', name: 'Iquitos', x: 328, y: 250, la: 'end', lx: -16, ly: 5 },
  { id: 'portovelho', name: 'Porto Velho', x: 452, y: 321, la: 'end', lx: -16, ly: 5 },
  { id: 'bananal', name: 'Ilha do Bananal', x: 635, y: 350, la: 'start', lx: 16, ly: 5 },
  { id: 'machupicchu', name: 'Machu Picchu', x: 342, y: 380, la: 'start', lx: 16, ly: -6 },
  { id: 'titicaca', name: 'Titicaca', x: 384, y: 424, la: 'start', lx: 16, ly: 8 },
  { id: 'lima', name: 'Lima', x: 284, y: 371, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'santacruz', name: 'Santa Cruz', x: 462, y: 448 },
  { id: 'campogrande', name: 'Campo Grande', x: 575, y: 486, la: 'start', lx: 16, ly: 5 },
  {
    id: 'rio', name: 'Rio de Janeiro', x: 722, y: 515, airport: true,
    la: 'start', lx: 16, ly: 5,
    // Sama kaupunki on myös Maailma-laudalla.
    links: [{ pack: 'maailma', city: 'rio', label: 'Maailma-lauta' }],
  },
  { id: 'saopaulo', name: 'São Paulo', x: 668, y: 537, la: 'end', lx: -16, ly: 16 },
  { id: 'iguazu', name: 'Iguazú', x: 578, y: 560, la: 'end', lx: -16, ly: 5 },
  { id: 'portoalegre', name: 'Porto Alegre', x: 615, y: 626, la: 'start', lx: 16, ly: 5 },
  { id: 'antofagasta', name: 'Antofagasta', x: 373, y: 534, la: 'end', lx: -16, ly: 5 },
  { id: 'salta', name: 'Salta', x: 432, y: 547, la: 'start', lx: 16, ly: 5 },
  { id: 'catamarca', name: 'Catamarca', x: 424, y: 606, la: 'start', lx: 16, ly: 5 },
  { id: 'valparaiso', name: 'Valparaíso', x: 356, y: 666, airport: true, la: 'start', lx: 16, ly: 5 },
  { id: 'sanambrosio', name: 'San Ambrosio', x: 239, y: 569, la: 'middle', lx: 0, ly: 28 },
  { id: 'robinsoncrusoe', name: 'Robinson Crusoe', x: 253, y: 672, la: 'middle', lx: 0, ly: 28 },
  { id: 'puertomontt', name: 'Puerto Montt', x: 338, y: 784, la: 'end', lx: -16, ly: 5 },
  { id: 'sanjorge', name: 'San Jorge', x: 411, y: 841, la: 'start', lx: 16, ly: 5 },
  { id: 'falkland', name: 'Falkland', x: 517, y: 926, la: 'start', lx: 16, ly: 5 },
  { id: 'puntaarenas', name: 'Punta Arenas', x: 365, y: 944, la: 'end', lx: -16, ly: 5 },
  { id: 'caphorn', name: 'Kap Horn', x: 407, y: 987, la: 'middle', lx: 0, ly: -22 },
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
    via: [[190, 90], [150, 130], [110, 165]] },
  { a: 'galapagos', b: 'lima', steps: 6, type: 'sea',
    via: [[130, 240], [180, 300], [230, 345]] },
  { a: 'panama', b: 'caracas', steps: 6, type: 'sea',
    via: [[280, 20], [340, 12], [395, 18]] },
  { a: 'caracas', b: 'cayenne', steps: 6, type: 'sea',
    via: [[470, 20], [540, 55], [590, 92]] },
  { a: 'macapa', b: 'saoluis', steps: 5, type: 'sea',
    via: [[665, 180], [700, 195]] },
  { a: 'salvador', b: 'saoluis', steps: 6, type: 'sea',
    via: [[860, 340], [880, 288], [868, 240], [820, 200], [762, 196]] },
  { a: 'lima', b: 'antofagasta', steps: 6, type: 'sea',
    via: [[255, 400], [290, 460], [330, 505]] },
  { a: 'antofagasta', b: 'sanambrosio', steps: 4, type: 'sea', via: [[300, 545]] },
  { a: 'sanambrosio', b: 'robinsoncrusoe', steps: 4, type: 'sea', via: [[225, 615]] },
  { a: 'robinsoncrusoe', b: 'valparaiso', steps: 3, type: 'sea', via: [[295, 662]] },
  { a: 'puertomontt', b: 'puntaarenas', steps: 5, type: 'sea',
    via: [[295, 815], [280, 870], [300, 925]] },
  { a: 'puntaarenas', b: 'caphorn', steps: 3, type: 'sea', via: [[360, 975]] },
  { a: 'caphorn', b: 'falkland', steps: 4, type: 'sea', via: [[450, 975], [495, 950]] },
  { a: 'falkland', b: 'sanjorge', steps: 4, type: 'sea', via: [[490, 890], [440, 860]] },
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
  minCityDistance: 55,

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
    mapLabelPos: { x: 760, y: 832 },
    compass: { x: 148, y: 800, r: 58 },
    waveSkip: [
      { x: 760, y: 832, r: 170 },
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
