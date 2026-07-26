// Aasia-lauta: kaupungit, reitit, kartan piirtotiedot ja teema.
//
// Koordinaatisto on 1000 x 1000 yksikköä ja vastaa suoraan Aasian karttaa:
//   x = (pituusaste - 40) * 6.69 + 30   (lännestä 40° itään 180°)
//   y = (76 - leveysaste) * 11.5        (pohjoisesta 76° etelään -11°)
//
// Mittasuhteet on valittu niin, että kartta on oikeassa muodossa 54. leveys-
// asteella eli Siperian eteläosassa. Manner on yksi ääriviiva Iranista
// Beringinsalmelle ja Malakan niemimaan kärkeen; lännessä se jatkuu kartan
// reunan yli Lähi-idän laudalle. Japani, Sahalin, Taiwan, Sri Lanka, Sumatra,
// Java, Borneo ja Luzon ovat omia saariaan, joihin pääsee vain laivalla.

import { ASIA_QUESTIONS, ASIA_FACTS } from './asia-questions.js';
import { themedTokenTypes } from '../tokens.js';

const AS_MAP = {
  width: 1000,
  height: 1000,
  mainlandPoints: [
    [30, 92], [96.9, 80.5], [163.8, 69], [230.7, 34.5], [297.6, 23],
    [364.5, 11.5], [431.4, 5.8], [498.3, 11.5], [518.4, 34.5], [618.7, 34.5],
    [699, 46], [765.9, 69], [832.8, 69], [899.7, 80.5], [966.6, 115],
    [953.2, 149.5], [913.1, 161], [866.3, 184], [852.9, 218.5], [826.1, 276],
    [806, 287.5], [799.4, 230], [812.7, 184], [765.9, 195.5], [719.1, 195.5],
    [685.6, 241.5], [699, 322], [665.6, 368], [632.1, 379.5], [612, 414],
    [625.4, 471.5], [605.3, 483], [605.3, 448.5], [592, 414], [578.6, 414],
    [558.5, 425.5], [571.9, 506], [551.8, 598], [525.1, 621], [498.3, 632.5],
    [484.9, 632.5], [471.5, 667], [491.6, 747.5], [464.9, 770.5], [451.5, 759],
    [431.4, 724.5], [424.7, 770.5], [431.4, 839.5], [458.2, 859.1], [451.5, 816.5],
    [418, 782], [418, 736], [411.3, 690], [391.3, 667], [391.3, 632.5],
    [364.5, 621], [344.4, 632.5], [331.1, 644], [297.6, 690], [297.6, 782],
    [277.5, 782], [270.8, 736], [250.8, 667], [230.7, 609.5], [217.3, 609.5],
    [210.6, 598], [170.5, 586.5], [143.7, 575], [130.4, 575], [96.9, 563.5],
    [83.5, 529], [56.8, 494.5], [30, 448.5], [30, 356.5], [30, 241.5],
  ],
  japanPoints: [
    [750.0, 350.8], [776.8, 373.8], [753.4, 414], [746.7, 460], [740.0, 477.3],
    [713.2, 483], [686.5, 483], [676.4, 517.5], [669.8, 494.5], [693.2, 465.8],
    [719.9, 448.5], [740.0, 425.5], [746.7, 391],
  ],
  sahalinPoints: [
    [733.7, 253], [742.4, 287.5], [739.1, 345], [728.4, 345], [725.0, 287.5],
    [730.4, 253],
  ],
  taiwanPoints: [
    [579.9, 581.1], [577.9, 623], [563.9, 617.3], [564.5, 583.4],
  ],
  sriLankaPoints: [
    [296.6, 759.3], [312.3, 791.2], [300.9, 808.1], [293.6, 776.3],
  ],
  sumatraPoints: [
    [402, 805], [423.4, 831.8], [453.5, 883.5], [471.5, 941.9], [458.2, 937.3],
    [429.4, 887.5], [400.6, 841.5], [389.6, 812.1],
  ],
  javaPoints: [
    [468.2, 941], [525.1, 967.4], [528.4, 978.4], [471.5, 959.9],
  ],
  borneoPoints: [
    [491.6, 851], [525.1, 793.5], [558.5, 810.8], [551.8, 828], [545.1, 885.5],
    [525.1, 914.3], [498.3, 908.5], [491.6, 874],
  ],
  luzonPoints: [
    [566.5, 659.3], [580.6, 678.5], [580.6, 713], [571.9, 720.8], [563.2, 703.8],
    [561.9, 682.3],
  ],
};

// start = aloituskaupunki (ei laattaa), airport = lentokenttä.
const AS_CITIES = [
  {
    id: 'teheran', name: 'Teheran', x: 106, y: 463, start: true, airport: true,
    la: 'start', lx: 16, ly: 5,
    // Sama kaupunki on myös Lähi-idän laudalla.
    links: [{ pack: 'middleeast', city: 'teheran', label: 'Lähi-idän lauta' }],
  },
  {
    id: 'tokio', name: 'Tokio', x: 738, y: 463, start: true, airport: true,
    la: 'start', lx: 18, ly: 5,
  },

  { id: 'jekaterinburg', name: 'Jekaterinburg', x: 168, y: 221, la: 'start', lx: 16, ly: 5 },
  { id: 'astana', name: 'Astana', x: 240, y: 285, la: 'start', lx: 16, ly: 5 },
  { id: 'novosibirsk', name: 'Novosibirsk', x: 317, y: 242, la: 'middle', lx: 0, ly: -22 },
  { id: 'irkutsk', name: 'Irkutsk', x: 460, y: 273, la: 'middle', lx: 0, ly: -22 },
  { id: 'jakutsk', name: 'Jakutsk', x: 630, y: 161, la: 'middle', lx: 0, ly: -22 },
  { id: 'magadan', name: 'Magadan', x: 771, y: 189, la: 'end', lx: -16, ly: 5 },
  { id: 'kamtsatka', name: 'Kamtšatka', x: 823, y: 265, la: 'start', lx: 16, ly: 5 },
  { id: 'sahalin', name: 'Sahalin', x: 735, y: 299, la: 'start', lx: 16, ly: 5 },
  { id: 'vladivostok', name: 'Vladivostok', x: 636, y: 372, la: 'start', lx: 16, ly: 5 },
  { id: 'ulanbator', name: 'Ulan Bator', x: 478, y: 323, la: 'middle', lx: 0, ly: -22 },
  {
    id: 'peking', name: 'Peking', x: 541, y: 415, airport: true, la: 'end', lx: -16, ly: 5,
    // Sama kaupunki on myös Maailma-laudalla.
    links: [{ pack: 'maailma', city: 'peking', label: 'Maailma-lauta' }],
  },
  { id: 'soul', name: 'Soul', x: 612, y: 442, la: 'start', lx: 16, ly: 5 },
  { id: 'xian', name: 'Xi’an', x: 491, y: 480, la: 'end', lx: -16, ly: 5 },
  { id: 'shanghai', name: 'Shanghai', x: 566, y: 512, airport: true, la: 'start', lx: 16, ly: 5 },
  { id: 'taipei', name: 'Taipei', x: 572, y: 592, la: 'start', lx: 16, ly: 5 },
  { id: 'hongkong', name: 'Hongkong', x: 526, y: 618, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'manila', name: 'Manila', x: 572, y: 696, airport: true, la: 'start', lx: 16, ly: 5 },
  { id: 'hanoi', name: 'Hanoi', x: 470, y: 633, la: 'end', lx: -16, ly: 5 },
  { id: 'bangkok', name: 'Bangkok', x: 435, y: 715, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'yangon', name: 'Yangon', x: 398, y: 668, la: 'end', lx: -16, ly: 5 },
  { id: 'singapore', name: 'Singapore', x: 450, y: 852, airport: true, la: 'middle', lx: 0, ly: 30 },
  { id: 'sumatra', name: 'Sumatra', x: 400, y: 816, la: 'start', lx: 16, ly: 5 },
  { id: 'borneo', name: 'Borneo', x: 525, y: 857, la: 'start', lx: 16, ly: 5 },
  { id: 'jakarta', name: 'Jakarta', x: 482, y: 950, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'lhasa', name: 'Lhasa', x: 376, y: 520, la: 'start', lx: 16, ly: 5 },
  { id: 'kathmandu', name: 'Kathmandu', x: 331, y: 562, la: 'start', lx: 16, ly: 5 },
  { id: 'delhi', name: 'Delhi', x: 274, y: 545, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'kolkata', name: 'Kolkata', x: 354, y: 614, la: 'end', lx: -16, ly: 5 },
  {
    id: 'mumbai', name: 'Mumbai', x: 250, y: 654, airport: true, la: 'end', lx: -16, ly: 5,
    // Sama kaupunki on myös Maailma-laudalla.
    links: [{ pack: 'maailma', city: 'mumbai', label: 'Maailma-lauta' }],
  },
  { id: 'chennai', name: 'Chennai', x: 293, y: 718, la: 'end', lx: -16, ly: 5 },
  { id: 'colombo', name: 'Colombo', x: 300, y: 787, la: 'middle', lx: 0, ly: 28 },
  { id: 'karachi', name: 'Karachi', x: 211, y: 588, la: 'end', lx: -16, ly: 5 },
  { id: 'kabul', name: 'Kabul', x: 225, y: 477, la: 'end', lx: -16, ly: 5 },
  { id: 'samarkand', name: 'Samarkand', x: 210, y: 417, la: 'end', lx: -16, ly: 5 },
  { id: 'kashgar', name: 'Kašgar', x: 270, y: 420, la: 'start', lx: 16, ly: 5 },
];

// steps = kuinka monta silmälukua reitin kulkeminen vaatii.
// type 'sea' = laivareitti; via = piirto- ja tarkistuspisteet veden päällä.
const AS_EDGES = [
  // Siperia ja Keski-Aasia
  { a: 'teheran', b: 'samarkand', steps: 5 },
  { a: 'samarkand', b: 'jekaterinburg', steps: 6 },
  { a: 'samarkand', b: 'kabul', steps: 3 },
  { a: 'samarkand', b: 'kashgar', steps: 4 },
  { a: 'jekaterinburg', b: 'astana', steps: 4 },
  { a: 'astana', b: 'novosibirsk', steps: 4 },
  { a: 'novosibirsk', b: 'irkutsk', steps: 5 },
  { a: 'irkutsk', b: 'jakutsk', steps: 6 },
  { a: 'irkutsk', b: 'ulanbator', steps: 3 },
  { a: 'jakutsk', b: 'magadan', steps: 6 },
  { a: 'jakutsk', b: 'vladivostok', steps: 7 },
  { a: 'ulanbator', b: 'novosibirsk', steps: 5 },
  { a: 'ulanbator', b: 'peking', steps: 4 },

  // Silkkitie ja Himalaja
  { a: 'kashgar', b: 'lhasa', steps: 6 },
  { a: 'kashgar', b: 'xian', steps: 7 },
  { a: 'kabul', b: 'delhi', steps: 5 },
  { a: 'kabul', b: 'karachi', steps: 4 },
  { a: 'delhi', b: 'kathmandu', steps: 3 },
  { a: 'delhi', b: 'karachi', steps: 4 },
  { a: 'delhi', b: 'mumbai', steps: 5 },
  { a: 'kathmandu', b: 'lhasa', steps: 4 },
  { a: 'kathmandu', b: 'kolkata', steps: 3 },
  { a: 'lhasa', b: 'xian', steps: 6 },

  // Intia ja Kaakkois-Aasia
  { a: 'mumbai', b: 'chennai', steps: 5 },
  { a: 'chennai', b: 'kolkata', steps: 5 },
  { a: 'kolkata', b: 'yangon', steps: 5 },
  { a: 'yangon', b: 'bangkok', steps: 4 },
  { a: 'yangon', b: 'hanoi', steps: 5 },
  { a: 'bangkok', b: 'hanoi', steps: 4 },
  { a: 'bangkok', b: 'singapore', steps: 6 },
  { a: 'hanoi', b: 'hongkong', steps: 4 },

  // Kiina, Korea ja Japani
  { a: 'peking', b: 'xian', steps: 4 },
  { a: 'peking', b: 'shanghai', steps: 5 },
  { a: 'peking', b: 'soul', steps: 4 },
  { a: 'xian', b: 'shanghai', steps: 5 },
  { a: 'shanghai', b: 'hongkong', steps: 5 },
  { a: 'soul', b: 'vladivostok', steps: 4 },

  // Laivareitit
  { a: 'vladivostok', b: 'sahalin', steps: 4, type: 'sea', via: [[690, 344]] },
  { a: 'sahalin', b: 'magadan', steps: 5, type: 'sea', via: [[768, 252], [780, 220]] },
  { a: 'magadan', b: 'kamtsatka', steps: 4, type: 'sea', via: [[800, 224]] },
  { a: 'sahalin', b: 'tokio', steps: 5, type: 'sea', via: [[786, 350], [790, 412], [772, 440]] },
  { a: 'tokio', b: 'soul', steps: 4, type: 'sea', via: [[730, 505], [690, 532], [640, 500]] },
  { a: 'tokio', b: 'shanghai', steps: 5, type: 'sea', via: [[694, 560], [620, 540]] },
  { a: 'shanghai', b: 'taipei', steps: 4, type: 'sea', via: [[600, 555]] },
  { a: 'taipei', b: 'manila', steps: 4, type: 'sea', via: [[590, 645]] },
  { a: 'hongkong', b: 'manila', steps: 4, type: 'sea', via: [[556, 660]] },
  { a: 'manila', b: 'borneo', steps: 5, type: 'sea', via: [[566, 760], [548, 800]] },
  { a: 'borneo', b: 'singapore', steps: 5, type: 'sea', via: [[492, 838], [472, 848]] },
  { a: 'borneo', b: 'jakarta', steps: 5, type: 'sea', via: [[512, 930]] },
  { a: 'singapore', b: 'jakarta', steps: 5, type: 'sea', via: [[470, 895], [478, 928]] },
  { a: 'singapore', b: 'sumatra', steps: 4, type: 'sea', via: [[430, 850]] },
  { a: 'sumatra', b: 'yangon', steps: 5, type: 'sea', via: [[390, 780], [388, 726]] },
  { a: 'chennai', b: 'colombo', steps: 3, type: 'sea', via: [[286, 758]] },
  { a: 'colombo', b: 'mumbai', steps: 6, type: 'sea', via: [[262, 762], [232, 700]] },
  { a: 'mumbai', b: 'karachi', steps: 4, type: 'sea', via: [[212, 630]] },
];

// Lentoreitit kulkevat suoraan kaupungista toiseen yhdellä vuorolla.
const AS_AIR_ROUTES = [
  { a: 'teheran', b: 'delhi' },
  { a: 'delhi', b: 'mumbai' },
  { a: 'delhi', b: 'peking' },
  { a: 'mumbai', b: 'bangkok' },
  { a: 'bangkok', b: 'singapore' },
  { a: 'bangkok', b: 'hongkong' },
  { a: 'singapore', b: 'jakarta' },
  { a: 'hongkong', b: 'manila' },
  { a: 'hongkong', b: 'shanghai' },
  { a: 'shanghai', b: 'tokio' },
  { a: 'peking', b: 'tokio' },
  { a: 'peking', b: 'shanghai' },
];

export const ASIA = {
  id: 'asia',
  name: 'Aasian tähti',
  boardLabel: 'Aasia',
  tagline: 'Etsi tähti Silkkitieltä, Himalajalta, Siperian taigalta ja trooppisilta saarilta.',
  ariaLabel: 'Aasian aarrekartta',

  map: {
    ...AS_MAP,
    outlines: [
      AS_MAP.mainlandPoints, AS_MAP.japanPoints, AS_MAP.sahalinPoints,
      AS_MAP.taiwanPoints, AS_MAP.sriLankaPoints, AS_MAP.sumatraPoints,
      AS_MAP.javaPoints, AS_MAP.borneoPoints, AS_MAP.luzonPoints,
    ],
  },
  cities: AS_CITIES,
  edges: AS_EDGES,
  airRoutes: AS_AIR_ROUTES,
  islands: ['tokio', 'sahalin', 'taipei', 'colombo', 'sumatra', 'jakarta', 'borneo', 'manila'],
  minCityDistance: 50,

  tokens: {
    // Topaasin tilalla jade: Kiinassa sitä on arvostettu kultaa enemmän
    // tuhansien vuosien ajan.
    types: themedTokenTypes({
      star: { name: 'Aasian tähti' },
      topaz: { name: 'Jade', color: '#5fa87a' },
    }),
    counts: { star: 1, horseshoe: 2, robber: 3, ruby: 4, emerald: 5, topaz: 7, empty: 13 },
  },

  questions: ASIA_QUESTIONS,
  placeFacts: ASIA_FACTS,

  worldPos: { x: 268, y: 52 },
  duels: [
    {
      q: 'Mikä on maailman korkein vuori?',
      options: ['Mount Everest', 'K2', 'Kangchenjunga', 'Lhotse',
        'Makalu', 'Cho Oyu', 'Annapurna', 'Nanga Parbat'],
      correct: 0,
      fact: 'Everest kohoaa 8 849 metriin Nepalin ja Kiinan rajalla. K2 on toiseksi korkein, 8 611 metriä.',
    },
    {
      q: 'Mikä on maailman väkirikkain maa?',
      options: ['Intia', 'Kiina', 'Indonesia', 'Pakistan',
        'Bangladesh', 'Japani', 'Venäjä', 'Filippiinit'],
      correct: 0,
      fact: 'Intia ohitti Kiinan väkiluvussa vuonna 2023. Molemmissa asuu yli 1,4 miljardia ihmistä.',
    },
    {
      q: 'Mikä näistä on maailman suurin järvi pinta-alaltaan?',
      options: ['Kaspianmeri', 'Baikal', 'Balhaš', 'Aral',
        'Yläjärvi', 'Viktoriajärvi', 'Tanganjika', 'Ladoga'],
      correct: 0,
      fact: 'Kaspianmeri on suolainen mutta sisämaajärvi, pinta-alaltaan noin 371 000 neliökilometriä. Baikal on syvin.',
    },
    {
      q: 'Mikä kauppareitistö yhdisti Kiinan ja Välimeren vuosituhansien ajan?',
      options: ['Silkkitie', 'Hansaliitto', 'Suolatie', 'Meripolku',
        'Karavaanitie', 'Teetie', 'Mausteväylä', 'Kultatie'],
      correct: 0,
      fact: 'Reitistö kulki Kašgarin ja Samarkandin kautta. Silkin lisäksi sitä pitkin kulkivat paperi, ruuti ja uskonnot.',
    },
    {
      q: 'Missä maassa on eniten tulivuoria?',
      options: ['Indonesiassa', 'Japanissa', 'Filippiineillä', 'Islannissa',
        'Italiassa', 'Chilessä', 'Uudessa-Seelannissa', 'Meksikossa'],
      correct: 0,
      fact: 'Indonesiassa on yli 120 aktiivista tulivuorta. Maa on Tyynenmeren tulirenkaalla kahden laatan saumassa.',
    },
    {
      q: 'Mikä on Aasian pisin joki?',
      options: ['Jangtse', 'Keltainenjoki', 'Mekong', 'Ganges',
        'Indus', 'Ob', 'Jenisei', 'Lena'],
      correct: 0,
      fact: 'Jangtse on noin 6 300 kilometriä pitkä ja maailman kolmanneksi pisin joki.',
    },
  ],

  texts: {
    intro: 'Peli alkaa! Etsikää Aasian tähti ja palatkaa Teheraniin tai Tokioon.',
    starFound: (name, city) => `★ ${name} löysi AASIAN TÄHDEN kaupungista ${city}!`,
    starToast: 'AASIAN TÄHTI!',
    starChase: 'Nyt on kiire kotiin — myös hevosenkengän haltija voi voittaa pelin.',
    winStar: 'toi Aasian tähden turvallisesti kotiin',
    winnerStar: (name, money) => `${name} toi Aasian tähden kotiin ${money} punnan kanssa.`,
  },

  decor: {
    mapLabel: 'AASIA',
    mapLabelPos: { x: 800, y: 800 },
    compass: { x: 830, y: 620, r: 58 },
    waveSkip: [
      { x: 800, y: 800, r: 120 },
      { x: 830, y: 620, r: 100 },
      { x: 130, y: 800, r: 95 },
      { x: 900, y: 430, r: 105 },
    ],
    ship: { x: 900, y: 430 },
    serpent: { x: 130, y: 800 },
    dieSpot: { x: 0.12, y: 0.9 },
    terrainBands: [
      { maxY: 340, kind: 'trees' },
      { maxY: 600, kind: 'mountains' },
      { maxY: Infinity, kind: 'trees' },
    ],
  },
};
