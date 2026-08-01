// Eurooppa-lauta: kaupungit, reitit, kartan piirtotiedot ja teema.
//
// Koordinaatisto on 1000 x 1000 yksikköä ja vastaa suoraan Euroopan karttaa:
//   x = (pituusaste + 11) * 19.2    (lännestä -11° itään 41°)
//   y = (72 - leveysaste) * 26.3    (pohjoisesta 72° etelään 34°)
//
// Manner on yksi yhtenäinen ääriviiva, jonka sisään Itämeri, Mustameri ja
// Välimeri työntyvät lahtina. Britannia, Irlanti, Sisilia ja Kreeta ovat omia
// saariaan, ja kartan alalaidassa näkyy kaistale Pohjois-Afrikkaa, jotta
// Välimeri erottuu mereksi. Kaupungit ovat todellisilla paikoillaan; Wieniä,
// Budapestia ja Alppeja on siirretty muutama yksikkö, jotta nimet mahtuvat.

import { EUROPE_QUESTIONS, EUROPE_FACTS } from './europe-questions.js';
import { EUROPE_COUNTRY_SHAPES, EUROPE_CITY_COUNTRY } from './europe-countries.js';
import { themedTokenTypes } from '../tokens.js';

const EU_MAP = {
  width: 1000,
  height: 1000,
  mainlandPoints: [
    [103.7, 946.8], [90.2, 925.8], [69.1, 915.2], [40.3, 920.5], [38.4, 883.7],
    [28.8, 873.2], [42.2, 836.3], [40.3, 810.0], [42.2, 786.4], [32.6, 762.7],
    [57.6, 744.3], [96.0, 746.9], [134.4, 749.6], [153.6, 752.2], [176.6, 752.2],
    [188.2, 718.0], [190.1, 678.5], [169.0, 649.6], [119.0, 620.7], [153.6, 607.5],
    [180.5, 586.5], [215.0, 586.5], [241.9, 554.9], [272.6, 541.8], [299.5, 512.9],
    [314.9, 497.1], [341.8, 486.6], [374.4, 476.0], [376.3, 449.7], [376.3, 436.6],
    [393.6, 376.1], [414.7, 378.7], [412.8, 402.4], [401.3, 447.1], [401.3, 460.2],
    [422.4, 468.1], [441.6, 462.9], [470.4, 460.2], [483.8, 473.4], [528.0, 460.2],
    [568.3, 455.0], [585.6, 462.9], [614.4, 439.2], [652.8, 426.1], [672.0, 420.8],
    [614.4, 397.1], [614.4, 378.7], [683.0, 380.0], [673.0, 361.0], [692.0, 331.0],
    [710.4, 328.8], [748.8, 328.8], [793.0, 315.6], [729.6, 305.1], [689.3, 310.3],
    [643.2, 307.7], [622.1, 276.2], [622.1, 231.4], [641.3, 197.2], [681.6, 165.7],
    [639.4, 163.1], [614.4, 197.2], [564.5, 239.3], [554.9, 289.3], [566.4, 331.4],
    [528.0, 352.4], [528.0, 394.5], [485.8, 436.6], [458.9, 436.6], [453.1, 415.5],
    [437.8, 376.1], [426.2, 341.9], [416.6, 318.2], [384.0, 344.5], [326.4, 365.6],
    [313.0, 305.1], [322.6, 249.8], [364.8, 223.6], [403.2, 220.9], [451.2, 171.0],
    [489.6, 118.4], [518.4, 92.0], [576.0, 65.8], [633.6, 47.3], [706.6, 23.7],
    [748.8, 28.9], [787.2, 52.6], [844.8, 57.9], [883.2, 65.8], [940.8, 92.0],
    [1045, 99.9], [1045, 694.3], [960.0, 723.2], [931.2, 710.1], [912.0, 702.2],
    [883.2, 699.6], [854.4, 725.9], [852.5, 704.8], [835.2, 699.6], [816.0, 668.0],
    [787.2, 670.6], [779.5, 699.6], [764.2, 715.4], [760.3, 736.4], [746.9, 752.2],
    [748.8, 778.5], [748.8, 791.6], [777.6, 810.0], [806.4, 810.0], [864.0, 789.0],
    [912.0, 807.4], [950.4, 807.4], [1045, 802.1], [1045, 936.3], [917.8, 941.5],
    [864.0, 925.8], [825.6, 933.6], [798.7, 938.9], [758.4, 928.4], [729.6, 920.5],
    [720.0, 883.7], [727.7, 841.6], [714.2, 831.1], [691.2, 817.9], [672.0, 825.8],
    [662.4, 833.7], [650.9, 828.5], [652.8, 862.6], [662.4, 881.1], [672.0, 894.2],
    [666.2, 902.1], [652.8, 936.3], [633.6, 936.3], [624.0, 920.5], [614.4, 886.3],
    [608.6, 854.8], [585.6, 828.5], [581.8, 799.5], [566.4, 773.2], [528.0, 754.8],
    [503.0, 728.5], [472.3, 697.0], [447.4, 699.6], [451.2, 723.2], [480.0, 789.0],
    [518.4, 791.6], [556.8, 839.0], [537.6, 870.5], [520.3, 875.8], [510.7, 888.9],
    [480.0, 820.6], [441.6, 807.4], [426.2, 778.5], [403.2, 736.4], [374.4, 728.5],
    [355.2, 744.3], [307.2, 754.8], [268.8, 775.9], [228.5, 815.3], [215.0, 854.8],
    [199.7, 888.9], [170.9, 928.4], [126.7, 928.4],
  ],
  britainPoints: [
    [111.4, 576.0], [153.6, 547.0], [124.8, 489.2], [119.0, 455.0], [115.2, 423.4],
    [105.6, 381.4], [153.6, 352.4], [172.8, 376.1], [176.6, 420.8], [218.9, 486.6],
    [243.8, 507.6], [230.4, 541.8], [192.0, 562.8], [144.0, 562.8],
  ],
  irelandPoints: [
    [13.4, 536.5], [21.1, 494.4], [19.2, 465.5], [51.8, 441.8], [97.9, 441.8],
    [97.9, 473.4], [95.0, 491.8], [90.2, 520.7], [57.6, 539.1],
  ],
  sicilyPoints: [
    [449.3, 899.5], [451.2, 888.9], [468.5, 888.9], [503.0, 886.3], [510.7, 891.6],
    [501.1, 928.4], [489.6, 928.4], [449.3, 904.7],
  ],
  cretePoints: [
    [662.4, 965.2], [677.8, 957.3], [693.1, 962.6], [716.2, 965.2], [712.3, 973.1],
    [685.4, 975.7], [664.3, 970.5],
  ],
  // Islanti on todellisuudessa kartan ulkopuolella lännessä; saari on tuotu
  // luoteisnurkkaan pitkien laivareittien päähän, kuten St. Helena Afrikassa.
  // Ääriviiva on Natural Earthin oikea Islanti (50m) sovitettuna tähän
  // laatikkoon, jotta maan korostus ja Tutki-kortin minikartta osuvat
  // täsmälleen siihen saareen, joka laudalla näkyy.
  icelandPoints: [
    [89.9, 35.3], [97.1, 32.5], [93.2, 37.1], [96.3, 39.0], [95.4, 43.6], [98.7, 43.2],
    [98.1, 47.0], [100.4, 45.8], [104.5, 48.0], [103.1, 51.0], [104.9, 56.1], [101.3, 62.0],
    [98.7, 61.9], [96.9, 67.9], [87.7, 72.2], [81.6, 77.8], [72.7, 80.5], [71.7, 83.7],
    [66.3, 86.0], [54.6, 83.3], [52.9, 78.8], [51.1, 80.1], [47.7, 76.4], [35.9, 78.4],
    [35.6, 73.8], [39.5, 74.6], [45.0, 68.5], [40.5, 69.7], [44.0, 64.1], [40.1, 65.8],
    [37.3, 61.1], [27.1, 62.1], [25.5, 59.8], [41.7, 56.5], [42.6, 54.0], [37.0, 53.8],
    [42.1, 49.3], [34.0, 46.9], [26.5, 50.0], [22.1, 47.9], [23.8, 46.3], [26.8, 47.7],
    [25.0, 43.4], [28.6, 45.2], [31.1, 43.9], [27.0, 42.1], [29.3, 41.6], [27.4, 39.1],
    [30.0, 39.0], [29.9, 36.1], [37.5, 41.0], [37.5, 38.1], [33.7, 35.6], [37.2, 34.6],
    [32.4, 33.3], [33.7, 31.7], [37.7, 31.7], [45.4, 38.9], [45.6, 44.0], [43.5, 44.4],
    [47.5, 52.6], [50.0, 45.9], [52.6, 47.1], [54.5, 37.6], [60.0, 43.6], [60.8, 38.0],
    [64.8, 36.1], [70.2, 44.2], [69.0, 36.6], [74.7, 40.0], [77.7, 35.8], [82.8, 35.9],
    [82.4, 31.4], [84.6, 30.0], [89.1, 34.7],
  ],
  maghrebPoints: [
    [-45, 960.0], [97.9, 952.1], [169.0, 970.5], [211.2, 949.4], [268.8, 925.8],
    [316.8, 923.1], [376.3, 917.9], [409.0, 915.2], [424.3, 923.1], [412.8, 957.3],
    [432.0, 1045], [-45, 1045],
  ],
};

// start = aloituskaupunki (ei laattaa), airport = lentokenttä.
const EU_CITIES = [
  {
    id: 'lontoo', name: 'Lontoo', x: 209, y: 539, start: true, airport: true,
    links: [{ pack: 'maailma', city: 'lontoo', label: 'Maailma-lauta' }],
  },
  {
    id: 'istanbul', name: 'Istanbul', x: 768, y: 815, start: true, airport: true,
    // Sama kaupunki on myös Lähi-idän laudalla ja sillä on oma kaupunkilautansa.
    links: [
      { pack: 'middleeast', city: 'istanbul', label: 'Lähi-idän lauta' },
      { pack: 'istanbul', city: 'lentoasema', label: 'Istanbulin kaupunkilauta' },
    ],
  },
  { id: 'dublin', name: 'Dublin', x: 91, y: 490, la: 'end', lx: -16, ly: 5 },
  { id: 'edinburgh', name: 'Edinburgh', x: 150, y: 422, la: 'end', lx: -16, ly: 5 },
  { id: 'pariisi', name: 'Pariisi', x: 256, y: 609 },
  { id: 'marseille', name: 'Marseille', wiki: 'Marseille', x: 312, y: 744, la: 'end', lx: -16, ly: 14 },
  { id: 'lissabon', name: 'Lissabon', x: 36, y: 875, la: 'start', lx: 16, ly: 5 },
  {
    id: 'madrid', name: 'Madrid', x: 140, y: 831, airport: true,
    // Gibraltarin salmen yli Afrikkaan.
    links: [{ pack: 'africa', city: 'tanger', label: 'Afrikan lauta' }],
  },
  { id: 'barcelona', name: 'Barcelona', x: 244, y: 800, la: 'start', lx: 16, ly: 5 },
  { id: 'granada', name: 'Granada', wiki: 'Granada', x: 142, y: 916, la: 'end', lx: -16, ly: 5 },
  { id: 'amsterdam', name: 'Amsterdam', x: 305, y: 516, la: 'start', lx: 16, ly: 5 },
  { id: 'berliini', name: 'Berliini', x: 468, y: 512, airport: true },
  { id: 'praha', name: 'Praha', x: 488, y: 576, la: 'end', lx: -16, ly: 5 },
  { id: 'wien', name: 'Wien', x: 526, y: 626, la: 'start', lx: 16, ly: -6 },
  { id: 'budapest', name: 'Budapest', x: 591, y: 658, la: 'start', lx: 16, ly: 10 },
  { id: 'varsova', name: 'Varsova', x: 615, y: 520 },
  { id: 'krakova', name: 'Krakova', wiki: 'Krakova', x: 594, y: 577, la: 'start', lx: 16, ly: 8 },
  { id: 'alpit', name: 'Alpit', x: 352, y: 640, la: 'end', lx: -16, ly: 5 },
  // Venetsia on Adrianmeren pohjukassa Milanon tilalla (omistajan valinta).
  { id: 'venetsia', name: 'Venetsia', wiki: 'Venetsia', x: 448, y: 698, la: 'start', lx: 16, ly: -6 },
  { id: 'rooma', name: 'Rooma', x: 451, y: 792, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'sisilia', name: 'Sisilia', x: 468, y: 891, la: 'end', lx: -16, ly: 5 },
  {
    id: 'ateena', name: 'Ateena', x: 667, y: 895, start: true, airport: true, la: 'end', lx: -16, ly: 5,
    links: [{ pack: 'maailma', city: 'ateena', label: 'Maailma-lauta' }],
  },
  { id: 'kreeta', name: 'Kreeta', x: 694, y: 964, la: 'middle', lx: 0, ly: 26 },
  // Nimi alapuolelle: Sarajevo on nyt suoraan yläpuolella.
  { id: 'dubrovnik', name: 'Dubrovnik', x: 560, y: 770, la: 'middle', lx: 0, ly: 30 },
  // Sarajevoa on siirretty hieman itään, jotta nimet mahtuvat Balkanilla.
  // Sarajevo ei mahdu tarkalleen oikealle paikalleen (565, 740): se on
  // vain 30 yksikön päässä Dubrovnikista, ja lauta vaatii kaupunkien
  // väliksi 60. Aiemmin kaupunkia oli siirretty itään, jolloin piste
  // jäi Bosnian rajojen ULKOPUOLELLE Tutki-kortin minikartalla
  // (omistajan havainto). Nyt siirto on pohjoiseen: tämä on lähin
  // sallittu paikka, joka on maan sisällä.
  { id: 'sarajevo', name: 'Sarajevo', wiki: 'Sarajevo', x: 561, y: 710, la: 'start', lx: 16, ly: -6 },
  { id: 'sofia', name: 'Sofia', x: 659, y: 771, la: 'start', lx: 16, ly: 5 },
  { id: 'bukarest', name: 'Bukarest', x: 712, y: 725, la: 'start', lx: 16, ly: 5 },
  { id: 'kiova', name: 'Kiova', x: 797, y: 567 },
  { id: 'odessa', name: 'Odessa', x: 800, y: 669, la: 'start', lx: 16, ly: 5 },
  {
    id: 'moskova', name: 'Moskova', x: 934, y: 427, start: true, airport: true, la: 'end', lx: -16, ly: 5,
    // Sama kaupunki on myös Maailma-laudalla, josta Siperian rata jatkuu itään.
    links: [{ pack: 'maailma', city: 'moskova', label: 'Maailma-lauta' }],
  },
  { id: 'pietari', name: 'Pietari', x: 793, y: 317, la: 'start', lx: 16, ly: 5 },
  {
    id: 'helsinki', name: 'Helsinki', x: 688, y: 303, airport: true, la: 'end', lx: -16, ly: -12,
    // Suomen oma lauta avautuu Helsingistä.
    links: [{ pack: 'suomi', city: 'helsinki', label: 'Suomen lauta' }],
  },
  { id: 'tallinna', name: 'Tallinna', x: 684, y: 374, la: 'start', lx: 14, ly: 12 },
  { id: 'riika', name: 'Riika', x: 648, y: 434, la: 'end', lx: -14, ly: 14 },
  { id: 'vilna', name: 'Vilna', x: 703, y: 470, la: 'start', lx: 16, ly: 5 },
  {
    id: 'tukholma', name: 'Tukholma', x: 558, y: 333, airport: true, la: 'end', lx: -16, ly: 5,
    // Ruotsinlaiva Ahvenanmaalle — Suomen laudalle.
    links: [{ pack: 'suomi', city: 'maarianhamina', label: 'Suomen lauta (laiva Ahvenanmaalle)' }],
  },
  { id: 'oslo', name: 'Oslo', x: 418, y: 318, la: 'end', lx: -16, ly: 5 },
  { id: 'kobenhavn', name: 'Kööpenhamina', x: 457, y: 429, la: 'start', lx: 16, ly: 5 },
  { id: 'lappi', name: 'Lappi', x: 705, y: 145, la: 'end', lx: -16, ly: 5 },
  { id: 'tromssa', name: 'Tromssa', x: 577, y: 66, la: 'start', lx: 16, ly: 5 },
  { id: 'islanti', name: 'Islanti', wiki: 'Islanti', x: 62, y: 60, la: 'middle', lx: 0, ly: 42 },
];

// steps = kuinka monta silmälukua reitin kulkeminen vaatii.
// type 'sea' = laivareitti; via = piirto- ja tarkistuspisteet veden päällä.
const EU_EDGES = [
  // Brittein saaret ja Kanaali
  { a: 'lontoo', b: 'edinburgh', steps: 3 },
  // Kanaalitunneli on oikea maayhteys mantereelle.
  { a: 'lontoo', b: 'pariisi', steps: 3 },

  // Länsi-Eurooppa. Biskajan rannikon suora reitti on jätetty pois:
  // Iberiaan kuljetaan Rhônen laaksoa ja rannikkoa pitkin (haaste).
  { a: 'pariisi', b: 'amsterdam', steps: 3 },
  { a: 'pariisi', b: 'marseille', steps: 4 },
  { a: 'pariisi', b: 'alpit', steps: 3 },
  { a: 'marseille', b: 'barcelona', steps: 3 },
  { a: 'marseille', b: 'alpit', steps: 3 },
  { a: 'madrid', b: 'lissabon', steps: 3 },
  { a: 'madrid', b: 'barcelona', steps: 3 },
  { a: 'madrid', b: 'granada', steps: 3 },
  { a: 'granada', b: 'lissabon', steps: 4 },

  // Keski-Eurooppa
  { a: 'amsterdam', b: 'berliini', steps: 4 },
  { a: 'berliini', b: 'praha', steps: 2 },
  { a: 'berliini', b: 'varsova', steps: 4 },
  { a: 'berliini', b: 'kobenhavn', steps: 2 },
  { a: 'praha', b: 'wien', steps: 2 },
  { a: 'praha', b: 'krakova', steps: 3 },
  { a: 'krakova', b: 'varsova', steps: 2 },
  { a: 'krakova', b: 'budapest', steps: 3 },
  { a: 'wien', b: 'budapest', steps: 2 },
  { a: 'wien', b: 'venetsia', steps: 4 },
  { a: 'alpit', b: 'venetsia', steps: 3 },
  { a: 'alpit', b: 'berliini', steps: 4 },
  { a: 'venetsia', b: 'rooma', steps: 3 },
  // Bosnian rata: Budapestista Sarajevoon ja vuorten yli rannikolle.
  { a: 'budapest', b: 'sarajevo', steps: 2 },
  { a: 'sarajevo', b: 'dubrovnik', steps: 2 },
  { a: 'sarajevo', b: 'sofia', steps: 3 },
  { a: 'budapest', b: 'bukarest', steps: 4 },
  { a: 'sofia', b: 'ateena', steps: 4 },
  { a: 'sofia', b: 'istanbul', steps: 3 },
  { a: 'sofia', b: 'bukarest', steps: 2 },
  { a: 'bukarest', b: 'odessa', steps: 3 },
  { a: 'odessa', b: 'kiova', steps: 3 },
  { a: 'kiova', b: 'varsova', steps: 5 },
  { a: 'pietari', b: 'tallinna', steps: 3 },
  { a: 'tallinna', b: 'riika', steps: 2 },
  { a: 'riika', b: 'vilna', steps: 2 },
  { a: 'vilna', b: 'varsova', steps: 3 },
  { a: 'kiova', b: 'moskova', steps: 5 },
  { a: 'moskova', b: 'pietari', steps: 4 },
  { a: 'pietari', b: 'helsinki', steps: 3 },
  { a: 'helsinki', b: 'lappi', steps: 4 },
  { a: 'lappi', b: 'tromssa', steps: 3 },
  { a: 'tromssa', b: 'oslo', steps: 6 },
  { a: 'oslo', b: 'tukholma', steps: 3 },
  { a: 'oslo', b: 'kobenhavn', steps: 3 },
  { a: 'tukholma', b: 'kobenhavn', steps: 3 },

  // Laivareitit
  { a: 'lontoo', b: 'amsterdam', steps: 3, type: 'sea' },
  { a: 'lontoo', b: 'dublin', steps: 3, type: 'sea',
    via: [[225, 570], [170, 576], [110, 600], [70, 592], [100, 540], [100, 505]] },
  { a: 'dublin', b: 'edinburgh', steps: 3, type: 'sea' },
  { a: 'barcelona', b: 'rooma', steps: 4, type: 'sea' },
  { a: 'venetsia', b: 'dubrovnik', steps: 4, type: 'sea', via: [[505, 745]] },
  { a: 'rooma', b: 'sisilia', steps: 3, type: 'sea' },
  { a: 'sisilia', b: 'ateena', steps: 4, type: 'sea' },
  { a: 'ateena', b: 'kreeta', steps: 2, type: 'sea' },
  { a: 'kreeta', b: 'sisilia', steps: 5, type: 'sea', via: [[620, 950], [540, 930]] },
  { a: 'istanbul', b: 'odessa', steps: 4, type: 'sea' },
  { a: 'dubrovnik', b: 'rooma', steps: 3, type: 'sea' },
  { a: 'tukholma', b: 'helsinki', steps: 2, type: 'sea' },
  { a: 'helsinki', b: 'tallinna', steps: 1, type: 'sea', via: [[672, 340]] },
  { a: 'riika', b: 'tukholma', steps: 3, type: 'sea', via: [[610, 395], [580, 365]] },
  // Islannin pitkät valtamerireitit: etelään Skotlantiin ja itään Jäämerelle.
  // Eteläreitti kiertää EUROOPPA-otsikon itäpuolelta Pohjanmeren kautta.
  { a: 'islanti', b: 'edinburgh', steps: 5, type: 'sea',
    via: [[210, 80], [320, 110], [300, 240], [240, 340], [205, 385]] },
  { a: 'islanti', b: 'tromssa', steps: 5, type: 'sea', via: [[290, 32], [450, 38]] },
];

// Lentoreitit kulkevat suoraan kaupungista toiseen yhdellä vuorolla.
const EU_AIR_ROUTES = [
  { a: 'lontoo', b: 'madrid' },
  { a: 'lontoo', b: 'berliini' },
  { a: 'lontoo', b: 'tukholma' },
  { a: 'madrid', b: 'rooma' },
  { a: 'berliini', b: 'rooma' },
  { a: 'rooma', b: 'ateena' },
  { a: 'rooma', b: 'istanbul' },
  { a: 'tukholma', b: 'moskova' },
  { a: 'istanbul', b: 'moskova' },
];

export const EUROPE = {
  id: 'europe',
  name: 'Meripihkahuone',
  boardLabel: 'Eurooppa',
  tagline: 'Etsi kadonneen Meripihkahuoneen aarre tunturien, kanavien ja raunioiden takaa.',
  ariaLabel: 'Euroopan aarrekartta',

  map: {
    ...EU_MAP,
    countryShapes: EUROPE_COUNTRY_SHAPES,
    cityCountry: EUROPE_CITY_COUNTRY,
    outlines: [
      EU_MAP.mainlandPoints, EU_MAP.britainPoints, EU_MAP.irelandPoints,
      EU_MAP.sicilyPoints, EU_MAP.cretePoints, EU_MAP.icelandPoints,
      EU_MAP.maghrebPoints,
    ],
  },
  cities: EU_CITIES,
  edges: EU_EDGES,
  airRoutes: EU_AIR_ROUTES,
  islands: ['dublin', 'sisilia', 'kreeta', 'islanti'],
  minCityDistance: 60,

  tokens: {
    // Meripihka on Itämeren oma jalokivi: fossiloitunutta puuhartsia.
    types: themedTokenTypes({
      star: { name: 'Meripihkahuoneen aarre' },
      topaz: { name: 'Meripihka', color: '#d98f2b' },
    }),
    counts: { star: 1, horseshoe: 2, robber: 3, ruby: 5, emerald: 6, topaz: 8, empty: 12 },
  },

  questions: EUROPE_QUESTIONS,
  placeFacts: EUROPE_FACTS,

  duels: [
    {
      q: 'Mikä näistä kaupungeista EI ole koskaan ollut valtion pääkaupunki?',
      options: ['Milano', 'Praha', 'Wien', 'Varsova', 'Ateena', 'Lissabon', 'Oslo', 'Budapest'],
      correct: 0,
      fact: 'Milano on Lombardian pääkaupunki mutta ei koskaan ollut Italian; kaikki muut ovat oman maansa pääkaupunkeja.',
    },
    {
      q: 'Mikä näistä joista EI laske Mustaanmereen?',
      options: ['Rein', 'Tonava', 'Dnepr', 'Don', 'Dnestr', 'Bug', 'Prut', 'Kubannjoki'],
      correct: 0,
      fact: 'Rein virtaa Alpeilta pohjoiseen ja laskee Pohjanmereen. Kaikki muut päätyvät Mustaanmereen.',
    },
    {
      q: 'Missä maassa sijaitsee Euroopan korkein huippu Elbrus?',
      options: ['Venäjällä', 'Georgiassa', 'Turkissa', 'Italiassa', 'Ranskassa', 'Sveitsissä', 'Itävallassa', 'Espanjassa'],
      correct: 0,
      fact: 'Elbrus on Kaukasuksella Venäjän puolella lähellä Georgian rajaa ja kohoaa 5 642 metriin.',
    },
    {
      q: 'Mikä näistä kielistä EI kuulu indoeurooppalaisiin kieliin?',
      options: ['unkari', 'kreikka', 'albania', 'liettua', 'iiri', 'romania', 'hollanti', 'puola'],
      correct: 0,
      fact: 'Unkari on suomalais-ugrilainen kieli, samoin suomi ja viro. Kaikki muut luetellut ovat indoeurooppalaisia.',
    },
    {
      q: 'Minä vuonna Berliinin muuri avattiin?',
      options: ['1989', '1961', '1968', '1975', '1980', '1985', '1991', '1993'],
      correct: 0,
      fact: 'Muuri avattiin 9. marraskuuta 1989. Se oli seissyt 28 vuotta, sillä sen rakentaminen alkoi 1961.',
    },
    {
      q: 'Mikä näistä on Euroopan unionin virallinen kieli?',
      options: ['iiri', 'norja', 'islanti', 'turkki', 'ukraina', 'serbia', 'albania', 'sveitsinsaksa'],
      correct: 0,
      fact: 'Iiri on ollut EU:n virallinen kieli vuodesta 2007. Norja ja Islanti eivät kuulu unioniin lainkaan.',
    },
  ],

  texts: {
    intro: 'Peli alkaa! Etsikää kadonneen Meripihkahuoneen aarre ja palatkaa kotisatamaan: Lontooseen, Istanbuliin, Moskovaan tai Ateenaan.',
    starFound: (name, city) => `★ ${name} löysi MERIPIHKAHUONEEN AARTEEN kaupungista ${city}!`,
    starToast: 'MERIPIHKAHUONEEN AARRE!',
    starChase: 'Nyt on kiire kotiin — myös hevosenkengän haltija voi voittaa pelin.',
    winStar: 'toi Meripihkahuoneen aarteen turvallisesti kotiin',
    winnerStar: (name, money) => `${name} toi Meripihkahuoneen aarteen kotiin ${money} punnan kanssa.`,
    // Saapumismerkinnät: yksi arvotaan laudalle saavuttaessa.
    diaries: [
      'Kotimantere. Puolet karttani rajoista on väärin, ja loput ylitetään näyttämättä passia. Kukaan ei tarkasta papereitani — en tiedä, olenko helpottunut vai loukkaantunut.',
      '"Mannermaalla tarvitaan passi, kultaa ja kärsivällisyyttä", kirjoitti isoisä. Minulla on kortti, jolla maksan junalipun Lissabonista Tallinnaan, eikä kukaan kysy mitään. Kärsivällisyyttä tarvitaan enää vaihdoilla.',
      'Isoisän kartassa tämä maanosa on jaettu viiden keisarin kesken. Nyt tässä on yli neljäkymmentä valtiota, joista moni käyttää samaa rahaa ja jokainen omaa lippuaan. Hänen viisi keisariaan mahtuisivat nykyään yhteen kokoushuoneeseen — ja jonottaisivat vuoroaan.',
      '"Junat myöhästyvät kaikkialla paitsi Sveitsissä", merkitsi isoisä huolellisesti. Istun asemalla ja katson taulua, joka sanoo saman asian sataviisikymmentä vuotta myöhemmin. Jotkut havainnot eivät vanhene lainkaan.',
      'Isoisä luetteli maanosan suuret joet ja sai ne oikein: Volga, Tonava, Rein, Veiksel. Rajat hän sai väärin lähes kaikki. Vedet pysyivät, rajat eivät — tämä on matkani lyhyin oppitunti.',
    ],
    // Isoisän vihjeet laudan pääaarteesta: suunta tai seutu, ei koskaan
    // kaupungin nimeä.
    starHints: {
      dublin: 'Läntisimmällä saarella, joen mutkassa jonka viikingit nimesivät mustaksi lammikoksi, on satamakaupunki jossa puhutaan kahta kieltä. Sinne pääsee vain laivalla.',
      edinburgh: 'Pohjoisen saaren itärannikolla, vanhan tulivuoren kannalle rakennetun linnan juurella, on kaupunki joka jakautuu vanhaan ja uuteen puoleen. Molemmat pitävät itseään oikeana.',
      pariisi: 'Suuren joen mutkassa keskellä läntistä mannerta on kaupunki, jonka leveät bulevardit korvasivat juuri vanhat kujat. Se pitää itseään maailman keskuksena, ja on siinä lähellä.',
      marseille: 'Etelärannikolla, siellä missä suuri jokilaakso avautuu Välimereen, on maanosan vanhimpia satamia. Sen kaduilla kuulee kaikkien merien kielet, ja saippua kantaa kaupungin nimeä.',
      lissabon: 'Mantereen lounaisimmassa kärjessä, joen suulla jonka vartioksi rakennettiin torni, on kaupunki joka nousi maanjäristyksen raunioista suoriksi kortteleiksi.',
      madrid: 'Läntisen niemimaan keskellä, korkealla kuivalla ylätasangolla kaukana kaikista rannikoista, on pääkaupunki jonka kadut täyttyvät väestä vasta auringonlaskun jälkeen.',
      barcelona: 'Läntisen niemimaan koillisrannalla Välimeren äärellä on satamakaupunki, jonka uudet korttelit on piirretty ruutuun ja niiden kulmat viistetty.',
      granada: 'Läntisen niemimaan eteläosassa, lumihuippuisen vuoriston juurella, on kaupunki jonka kukkulalla seisoo maurien punainen palatsi. Sen suihkulähteet solisevat yhä.',
      amsterdam: 'Alavalla luoteisrannikolla, kanavien ja puupaalujen päälle rakennetussa kaupungissa, talot nojaavat toisiinsa. Maa on siellä osin merenpinnan alapuolella.',
      berliini: 'Pohjoisen tasangon keskellä, kahden hidasvirtaisen joen välissä, on juuri perustetun valtakunnan pääkaupunki. Se rakentaa kuin kilpaa, koska sillä on kiire olla vanha.',
      praha: 'Keskisellä mantereella, jyrkän jokimutkan yllä kohoavan linna-alueen juurella, on kaupunki jonka sillan kaiteilla seisoo kolmekymmentä pyhimystä.',
      wien: 'Suuren itään virtaavan joen varrella on keisarikunnan pääkaupunki, jossa valssia tanssitaan arkenakin. Muurien paikalle on juuri valmistunut leveä kehäkatu.',
      budapest: 'Saman suuren joen varrella kauempana itään, siellä missä kaksi kaupunkia yhdistettiin yhdeksi, nousee kuumista lähteistä vesi kylpyaltaisiin.',
      varsova: 'Pohjoisella tasangolla idässä, Veiksel-joen varrella, on maakuntakaupunki jonka oma valtio on pyyhitty kartalta. Kadulla soitetaan silti sen omaa musiikkia.',
      krakova: 'Saman joen yläjuoksulla etelässä, kuninkaiden vanhassa kruunauskaupungissa, torvensoittaja lopettaa sävelmänsä joka tunti kesken. Torin keskellä seisoo kangaskauppojen halli.',
      alpit: 'Keskisen mantereen vuoristossa, siellä missä laaksot ovat jään jäljiltä U:n muotoisia ja solat ylitetään muulin kanssa, on koko maanosan korkein huippu.',
      venetsia: 'Etelän niemimaan koillisrannalla, matalan laguunin saarille rakennetussa kaupungissa, kadut ovat vettä ja portaat laskevat suoraan mereen. Sen kauppiaat toivat idän tavarat maanosaan.',
      rooma: 'Etelän niemimaan keskellä, seitsemän kukkulan päällä joen varrella, on kaupunki josta tehtiin juuri uuden kuningaskunnan pääkaupunki. Sen akveduktit toimivat yhä.',
      sisilia: 'Etelän niemimaan kärjen takana, salmen toisella puolen, on saari jolla savuaa maanosan suurin tulivuori. Sen kirkoissa on arabialaisia kupoleita.',
      ateena: 'Kaakkoisen niemimaan kärjessä, kalliokukkulan juurella jolla seisoo kaksituhatta vuotta vanha temppeli, on nuoren kuningaskunnan tomuinen pääkaupunki.',
      kreeta: 'Kaikkein eteläisimmällä suurella saarella, sulttaanin valtakunnan laidalla, kukoisti maanosan varhaisin korkeakulttuuri. Oliiviöljyä käytetään siellä kaikkeen.',
      dubrovnik: 'Kaakkoisrannikolla, korkeiden kivimuurien sisällä, on satamakaupunki joka oli vuosisatoja oma tasavaltansa ja säilyi neuvottelemalla eikä sotimalla.',
      sarajevo: 'Kaakkoisen mantereen vuorten välisessä laaksossa on kaupunki, jossa minareetit ja kirkontornit seisovat saman kadun varrella ja basaarissa taotaan kuparia kuin idässä.',
      sofia: 'Kaakkoisen mantereen sisämaassa, korkean vuoren juurella, on maakuntakaupunki jonka ympärille syntyy pian oma valtio. Ruusuöljyä myydään siellä pulloittain.',
      bukarest: 'Alavalla tasangolla Tonavan ja Karpaattien välissä on ruhtinaskunnan pääkaupunki, jossa puhutaan latinasta polveutuvaa kieltä slaavilaisten naapurien keskellä.',
      kiova: 'Idässä, Dnepr-joen jyrkällä rannalla, on tuhat vuotta pyhänä pidetty kaupunki, jonka luostarin käytävät kulkevat maan alla.',
      odessa: 'Mustanmeren pohjoisrannalla on satama, josta vehnä lähtee koko maanosaan ja jonka portaat nousevat rannasta kaupunkiin kuin teatterissa.',
      moskova: 'Idän tasangolla, kaukana kaikista meristä, on vanha kaupunki jossa kupolit ja puutalot vuorottelevat. Se ei ole enää pääkaupunki, mutta pitää itseään sinä.',
      pietari: 'Suomenlahden pohjukassa, keisarin käskyllä suolle rakennetussa kaupungissa, kaikki kadut ovat suoria eikä kesäöisin tarvita kynttilää.',
      helsinki: 'Pohjoisen lahden rannalla on suuriruhtinaskunnan pieni valkoinen pääkaupunki, jonka satamaan tarvitaan jäänmurtajaa puoli vuotta.',
      tallinna: 'Saman lahden eteläpuolella, muurien ja tornien takana, on hansakaupunki jonka ylälinna ja alakaupunki eivät ole koskaan olleet samaa mieltä mistään.',
      riika: 'Itämeren kaakkoisrannalla, suuren joen suussa, on satama joka lähettää puuta ja pellavaa Englantiin. Kauppapöydässä puhutaan saksaa, toreilla maan omaa kieltä.',
      vilna: 'Itämeren kaakkoisessa takamaassa, sisämaassa kahden joen yhtymäkohdassa, on kaupunki jota kutsutaan Pohjolan Jerusalemiksi. Barokkikirkkoja on siellä liikaa laskettavaksi.',
      tukholma: 'Pohjoisen niemimaan itärannalla, neljälletoista saarelle rakennetussa kaupungissa, vesi on niin kirkasta että keskustassa kalastetaan.',
      oslo: 'Pohjoisen niemimaan länsipuolella, pitkän vuonon pohjukassa, on pääkaupunki jonka nimi vaihdettiin kuninkaan mukaan. Vuoret alkavat heti kaupungin takaa.',
      kobenhavn: 'Pohjolan salmien varrella, siellä missä Itämerestä pääsee Pohjanmerelle, on kuningaskunnan pääkaupunki. Sen huvipuistossa palavat lyhdyt iltaan asti.',
      lappi: 'Kaikkein pohjoisimmassa sisämaassa, siellä missä aurinko ei kesällä laske eikä talvella nouse, paimennetaan poroja tuhansittain.',
      tromssa: 'Pohjoisimmalla rannikolla, saarella vuonon suojassa, on satama josta lähdetään jäämerelle. Lämmin merivirta pitää sen sulana keskellä talvea.',
      islanti: 'Kaukana luoteisessa valtameressä on saari, jolla maa höyryää, tuli nousee jäätikön alta ja kuuma vesi purskahtaa ilmaan. Sinne pääsee vain pitkällä laivamatkalla.',
    },
  },

  decor: {
    mapLabel: 'EUROOPPA',
    mapLabelPos: { x: 175, y: 150 },
    compass: { x: 118, y: 330, r: 58 },
    waveSkip: [
      { x: 175, y: 150, r: 135 },
      { x: 118, y: 330, r: 100 },
      { x: 575, y: 975, r: 110 },
      { x: 60, y: 640, r: 95 },
    ],
    ship: { x: 60, y: 640 },
    serpent: { x: 575, y: 975 },
    dieSpot: { x: 0.055, y: 0.52 },
    terrainBands: [
      { maxY: 300, kind: 'mountains' },
      { maxY: 640, kind: 'trees' },
      { maxY: Infinity, kind: 'mountains' },
    ],
  },
};
