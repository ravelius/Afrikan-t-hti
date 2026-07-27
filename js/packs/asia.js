// Aasia-lauta: kaupungit, reitit, kartan piirtotiedot ja teema.
//
// Koordinaatisto on 1000 x 1000 yksikköä.
//
// Kartta on Lambertin konformisessa kartioprojektiossa, standardileveys-
// piireinä 20° ja 60° pohjoista leveyttä ja keskimeridiaanina 105° itäistä
// pituutta. Muodot pysyvät oikeina sekä tropiikissa että Siperiassa, toisin
// kuin yksinkertaisessa lieriöprojektiossa, joka venyttäisi pohjoisen
// leveäksi. Lähdeaineisto on tools/mapdata/asia.json ja koordinaatit
// lasketaan komennolla `node tools/project.mjs asia`.
//
// Manner on yksi ääriviiva Iranista Beringinsalmelle ja Malakan niemimaan
// kärkeen; lännessä se jatkuu kartan reunan yli Lähi-idän laudalle. Japani,
// Sahalin, Taiwan, Sri Lanka, Sumatra, Java, Borneo ja Luzon ovat omia
// saariaan, joihin pääsee vain laivalla.

import { ASIA_QUESTIONS, ASIA_FACTS } from './asia-questions.js';
import { themedTokenTypes } from '../tokens.js';

const AS_MAP = {
  width: 1000,
  height: 1000,
  mainlandPoints: [
    [320.7, 34.3], [361.1, 52.4], [402.4, 65], [453.3, 49.3], [491.3, 49.5],
    [527.7, 44.8], [561.5, 42.2], [594.8, 48.7], [607.2, 73.3], [661.1, 63.6],
    [707.5, 60.7], [753.5, 65], [787.7, 42.9], [827.3, 25.7], [882.8, 18],
    [901.6, 47.4], [888.3, 76.8], [875.3, 117.4], [886.6, 149.2], [898.4, 205.3],
    [888.4, 224.6], [855, 184.6], [840.9, 143.1], [814.3, 172.2], [780.1, 189.8],
    [770.5, 239.9], [809.6, 301.5], [791.6, 352], [759.9, 373], [746.1, 408.2],
    [774.8, 452.8], [753.1, 469], [745.9, 439.5], [723.6, 413.6], [708.5, 416.7],
    [687.3, 430.8], [715.7, 497.9], [702.3, 584], [666.4, 609.9], [627.8, 623.7],
    [607.8, 624.6], [588.3, 657.4], [622.9, 734.4], [577.9, 758.5], [555.2, 746.7],
    [523.1, 711.2], [509, 756.1], [516.4, 828.6], [565.4, 851.5], [553.8, 805.7],
    [496.6, 766.9], [500.3, 720.9], [493.3, 675.4], [464.5, 650.3], [468.6, 618.2],
    [430.9, 601.8], [399.7, 606.7], [377.8, 612.8], [316.8, 641.6], [291.1, 728.8],
    [257.8, 718.4], [261.8, 671], [254.4, 597.4], [246.6, 536.5], [228.8, 528.7],
    [224.4, 515.1], [178.1, 479.8], [150.7, 451.8], [134.9, 441.8], [102.4, 406.9],
    [106.4, 371.3], [98.4, 325.5], [100.3, 273.1], [155.1, 213.8], [224.5, 138.6],
  ],
  japanPoints: [
    [829.3, 320.6], [864, 326.6], [855.4, 369.8], [864.5, 409.9], [862.9, 427.2],
    [833.6, 444.3], [801.7, 455.3], [798.5, 488.3], [784.4, 471.2], [805, 438.2],
    [830.6, 412.9], [845.1, 385.3], [840.2, 354.4],
  ],
  sahalinPoints: [
    [799.5, 238.7], [820, 263.3], [838.7, 310.7], [828.5, 315.4], [804.8, 270.3],
    [796.8, 240],
  ],
  taiwanPoints: [
    [738.3, 562.9], [742.6, 599.6], [723.1, 596.7], [719.2, 568.6],
  ],
  sriLankaPoints: [
    [296.2, 707.3], [310.7, 745.4], [289.4, 755.5], [288.3, 721.9],
  ],
  sumatraPoints: [
    [463.6, 790], [500.7, 822.7], [554.7, 881.9], [591.6, 945.9], [564.4, 939.1],
    [513.3, 881.6], [467.2, 824.7], [453.6, 793.7],
  ],
  javaPoints: [
    [583.4, 946], [706.6, 971.3], [713.5, 982], [590.4, 966.7],
  ],
  borneoPoints: [
    [627.8, 841.6], [683.7, 776.6], [744.9, 786.5], [735.7, 806.3], [732.3, 870.2],
    [697.2, 907.4], [643.9, 905.1], [628.9, 866.8],
  ],
  luzonPoints: [
    [735.2, 637], [755.7, 650.9], [762.4, 684.5], [750.6, 692.4], [737.2, 679],
    [732, 660.8],
  ],
};

// start = aloituskaupunki (ei laattaa), airport = lentokenttä.
const AS_CITIES = [
  {
    id: 'teheran', name: 'Teheran', x: 164, y: 342, start: true, airport: true,
    la: 'start', lx: 16, ly: 5,
    // Sama kaupunki on myös Lähi-idän laudalla.
    links: [{ pack: 'middleeast', city: 'teheran', label: 'Lähi-idän lauta' }],
  },
  {
    id: 'tokio', name: 'Tokio', x: 856, y: 417, start: true, airport: true,
    la: 'start', lx: 18, ly: 5,
  },

  { id: 'jekaterinburg', name: 'Jekaterinburg', x: 333, y: 194, la: 'start', lx: 16, ly: 5 },
  { id: 'astana', name: 'Astana', x: 367, y: 275, la: 'start', lx: 16, ly: 5 },
  { id: 'novosibirsk', name: 'Novosibirsk', x: 447, y: 260, la: 'middle', lx: 0, ly: -22 },
  { id: 'irkutsk', name: 'Irkutsk', x: 574, y: 305, la: 'middle', lx: 0, ly: -22 },
  { id: 'jakutsk', name: 'Jakutsk', x: 703, y: 184, la: 'end', lx: -16, ly: 5 },
  { id: 'magadan', name: 'Magadan', x: 815, y: 165, la: 'end', lx: -16, ly: 5 },
  { id: 'kamtsatka', name: 'Kamtšatka', x: 890, y: 198, la: 'start', lx: 16, ly: 5 },
  { id: 'sahalin', name: 'Sahalin', x: 818, y: 276, la: 'start', lx: 16, ly: 5 },
  { id: 'vladivostok', name: 'Vladivostok', x: 769, y: 366, la: 'start', lx: 16, ly: 5 },
  { id: 'ulanbator', name: 'Ulan Bator', x: 591, y: 360, la: 'middle', lx: 0, ly: -22 },
  {
    id: 'peking', name: 'Peking', x: 666, y: 425, airport: true, la: 'end', lx: -16, ly: 5,
    // Sama kaupunki on myös Maailma-laudalla.
    links: [{ pack: 'maailma', city: 'peking', label: 'Maailma-lauta' }],
  },
  { id: 'soul', name: 'Soul', x: 752, y: 432, la: 'start', lx: 16, ly: 5 },
  { id: 'xian', name: 'Xi’an', x: 611, y: 486, la: 'end', lx: -16, ly: 5 },
  { id: 'shanghai', name: 'Shanghai', x: 713, y: 503, airport: true, la: 'start', lx: 16, ly: 5 },
  { id: 'taipei', name: 'Taipei', x: 731, y: 579, la: 'start', lx: 16, ly: 5 },
  { id: 'hongkong', name: 'Hongkong', x: 667, y: 606, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'manila', name: 'Manila', x: 748, y: 669, airport: true, la: 'start', lx: 16, ly: 5 },
  { id: 'hanoi', name: 'Hanoi', x: 586, y: 625, la: 'end', lx: -16, ly: 5 },
  { id: 'bangkok', name: 'Bangkok', x: 529, y: 703, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'yangon', name: 'Yangon', x: 486, y: 666, la: 'end', lx: -16, ly: 5 },
  { id: 'singapore', name: 'Singapore', x: 563, y: 850, airport: true, la: 'middle', lx: 0, ly: 30 },
  { id: 'sumatra', name: 'Sumatra', x: 488, y: 812, la: 'start', lx: 16, ly: 5 },
  { id: 'borneo', name: 'Borneo', x: 644, y: 846, la: 'start', lx: 16, ly: 5 },
  {
    id: 'jakarta', name: 'Jakarta', x: 605, y: 953, airport: true, la: 'end', lx: -16, ly: 5,
    // Indonesian saariketju jatkuu idässä Oseanian laudalle.
    links: [{ pack: 'oceania', city: 'bali', label: 'Oseanian lauta' }],
  },
  { id: 'lhasa', name: 'Lhasa', x: 461, y: 514, la: 'start', lx: 16, ly: 5 },
  { id: 'kathmandu', name: 'Kathmandu', x: 395, y: 540, la: 'start', lx: 16, ly: 5 },
  { id: 'delhi', name: 'Delhi', x: 324, y: 504, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'kolkata', name: 'Kolkata', x: 417, y: 593, la: 'end', lx: -16, ly: 5 },
  {
    id: 'mumbai', name: 'Mumbai', x: 258, y: 586, airport: true, la: 'end', lx: -16, ly: 5,
    // Sama kaupunki on myös Maailma-laudalla.
    links: [{ pack: 'maailma', city: 'mumbai', label: 'Maailma-lauta' }],
  },
  { id: 'chennai', name: 'Chennai', x: 308, y: 669, la: 'end', lx: -16, ly: 5 },
  { id: 'colombo', name: 'Colombo', x: 295, y: 736, la: 'middle', lx: 0, ly: 28 },
  { id: 'karachi', name: 'Karachi', x: 230, y: 506, la: 'end', lx: -16, ly: 5 },
  { id: 'kabul', name: 'Kabul', x: 287, y: 425, la: 'end', lx: -16, ly: 5 },
  { id: 'samarkand', name: 'Samarkand', x: 292, y: 369, la: 'start', lx: 16, ly: 5 },
  { id: 'kashgar', name: 'Kašgar', x: 356, y: 397, la: 'end', lx: -16, ly: 5 },
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
  { a: 'vladivostok', b: 'sahalin', steps: 4, type: 'sea', via: [[796, 323]] },
  { a: 'sahalin', b: 'magadan', steps: 5, type: 'sea', via: [[821, 234], [825, 191]] },
  { a: 'magadan', b: 'kamtsatka', steps: 4, type: 'sea', via: [[846, 171]] },
  { a: 'sahalin', b: 'tokio', steps: 5, type: 'sea', via: [[822, 330], [820, 385]] },
  { a: 'tokio', b: 'soul', steps: 4, type: 'sea', via: [[848, 471], [808, 504], [768, 483]] },
  { a: 'tokio', b: 'shanghai', steps: 5, type: 'sea', via: [[844, 473], [781, 509]] },
  { a: 'shanghai', b: 'taipei', steps: 4, type: 'sea', via: [[741, 535]] },
  { a: 'taipei', b: 'manila', steps: 4, type: 'sea', via: [[744, 620]] },
  { a: 'hongkong', b: 'manila', steps: 4, type: 'sea', via: [[702, 649]] },
  { a: 'manila', b: 'borneo', steps: 5, type: 'sea', via: [[735, 723], [689, 769], [651, 808]] },
  { a: 'borneo', b: 'singapore', steps: 5, type: 'sea', via: [[609, 850], [584, 849]] },
  { a: 'borneo', b: 'jakarta', steps: 5, type: 'sea', via: [[630, 899], [618, 933]] },
  { a: 'singapore', b: 'jakarta', steps: 5, type: 'sea', via: [[585, 896], [598, 936]] },
  { a: 'singapore', b: 'sumatra', steps: 4, type: 'sea', via: [[529, 829]] },
  { a: 'sumatra', b: 'yangon', steps: 5, type: 'sea', via: [[450, 762], [464, 695]] },
  { a: 'chennai', b: 'colombo', steps: 3, type: 'sea', via: [[298, 707]] },
  { a: 'colombo', b: 'mumbai', steps: 6, type: 'sea', via: [[241, 713], [224, 633]] },
  { a: 'mumbai', b: 'karachi', steps: 4, type: 'sea', via: [[232, 542]] },
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
    mapLabelPos: { x: 185, y: 792 },
    compass: { x: 880, y: 618, r: 56 },
    waveSkip: [
      { x: 185, y: 792, r: 130 },
      { x: 880, y: 618, r: 95 },
      { x: 330, y: 930, r: 95 },
      { x: 862, y: 882, r: 105 },
    ],
    ship: { x: 862, y: 882 },
    serpent: { x: 330, y: 930 },
    dieSpot: { x: 0.06, y: 0.2 },
    terrainBands: [
      { maxY: 340, kind: 'trees' },
      { maxY: 600, kind: 'mountains' },
      { maxY: Infinity, kind: 'trees' },
    ],
  },
};
