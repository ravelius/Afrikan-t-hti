// Pelilauta: kaupungit, reitit ja kartan piirtotiedot.
//
// Koordinaatisto on 1000 x 1000 yksikköä ja vastaa suoraan Afrikan karttaa:
//   x = (pituusaste + 20) * 13.333   (lännestä -20° itään 55°)
//   y = (40 - leveysaste) * 12.5     (pohjoisesta 40° etelään -40°)

export const MAP = {
  width: 1000,
  height: 1000,
  // Rannikkoviiva oikeista koordinaateista projisoituna; mapart.js pyöristää
  // pisteet pehmeäksi käyräksi ja lisää käsin piirretyn vapinan.
  africaPoints: [
    [188.0, 51.3], [240.0, 60.0], [280.0, 43.8], [333.3, 40.0], [373.3, 35.0],
    [400.0, 33.8], [413.3, 77.5], [466.7, 95.0], [520.0, 120.0], [546.7, 97.5],
    [586.7, 97.5], [626.7, 108.7], [666.7, 107.5], [693.3, 110.0], [713.3, 150.0],
    [733.3, 200.0], [760.0, 237.5], [780.0, 275.0], [793.3, 312.5], [820.0, 331.2],
    [846.7, 356.2], [866.7, 368.8], [906.7, 356.2], [946.7, 352.5], [952.0, 375.0],
    [933.3, 400.0], [906.7, 437.5], [866.7, 475.0], [826.7, 512.5], [800.0, 550.0],
    [793.3, 587.5], [806.7, 637.5], [808.0, 675.0], [773.3, 712.5], [733.3, 750.0],
    [706.7, 800.0], [693.3, 825.0], [666.7, 862.5], [640.0, 900.0], [600.0, 925.0],
    [560.0, 931.2], [520.0, 935.0], [500.0, 900.0], [466.7, 837.5], [440.0, 787.5],
    [426.7, 725.0], [426.7, 675.0], [446.7, 637.5], [426.7, 575.0], [393.3, 525.0],
    [393.3, 475.0], [373.3, 450.0], [320.0, 425.0], [280.0, 431.2], [226.7, 437.5],
    [166.7, 445.0], [120.0, 425.0], [93.3, 393.8], [66.7, 362.5], [46.7, 337.5],
    [33.3, 316.2], [53.3, 300.0], [53.3, 262.5], [66.7, 237.5], [93.3, 212.5],
    [120.0, 175.0], [140.0, 137.5], [160.0, 112.5], [186.7, 87.5],
  ],
  madagascarPoints: [
    [925.3, 653.8], [936.0, 677.5], [932.0, 693.8], [940.0, 702.5], [926.7, 718.8],
    [917.3, 737.5], [902.7, 775.0], [894.7, 800.0], [869.3, 820.0], [849.3, 803.8],
    [844.0, 775.0], [860.0, 748.8], [856.0, 727.5], [884.0, 696.2], [902.7, 681.2],
    [918.7, 666.2],
  ],
};

// start = aloituskaupunki (ei laattaa), airport = lentokenttä.
export const CITIES = [
  { id: 'tanger', name: 'Tanger', x: 189, y: 52, start: true, airport: true },
  { id: 'kairo', name: 'Kairo', x: 683, y: 125, start: true, airport: true },

  { id: 'tripoli', name: 'Tripoli', x: 443, y: 89 },
  { id: 'murzuk', name: 'Murzuk', x: 452, y: 176 },
  { id: 'alkufra', name: 'Al Kufra', x: 577, y: 197 },
  { id: 'sahara', name: 'Sahara', x: 400, y: 187, la: 'end', lx: -16, ly: 5 },
  { id: 'ahaggar', name: 'Ahaggar', x: 340, y: 212, la: 'end', lx: -16, ly: 5 },
  { id: 'timbuktu', name: 'Timbuktu', x: 227, y: 290, la: 'end', lx: -16, ly: 5 },
  { id: 'gao', name: 'Gao', x: 267, y: 296, la: 'start', lx: 16, ly: 5 },
  { id: 'dakar', name: 'Dakar', x: 45, y: 318, la: 'start', lx: 16, ly: 5 },
  { id: 'sierraleone', name: 'Sierra Leone', x: 95, y: 392, la: 'start', lx: 16, ly: 5 },
  { id: 'kappalmas', name: 'Kap Palmas', x: 164, y: 445, la: 'end', lx: -16, ly: 5 },
  { id: 'kumasi', name: 'Kumasi', x: 245, y: 416, la: 'end', lx: -16, ly: 26 },
  { id: 'orjarannikko', name: 'Orjarannikko', x: 312, y: 420 },
  { id: 'kano', name: 'Kano', x: 380, y: 350 },
  { id: 'kamerun', name: 'Kamerun', x: 395, y: 455, la: 'start', lx: 16, ly: -8 },
  { id: 'kongo', name: 'Kongo', x: 440, y: 560, la: 'end', lx: -16, ly: 5 },
  { id: 'angola', name: 'Angola', x: 480, y: 650, la: 'end', lx: -16, ly: 5 },
  { id: 'namib', name: 'Namib', x: 475, y: 795, la: 'end', lx: -16, ly: 5 },
  { id: 'kapkaupunki', name: 'Kapkaupunki', x: 525, y: 915, airport: true, la: 'end', lx: -22, ly: 6 },
  { id: 'kimberley', name: 'Kimberley', x: 597, y: 859, la: 'start', lx: 16, ly: 5 },
  { id: 'mosambik', name: 'Mosambik', x: 720, y: 730, la: 'end', lx: -16, ly: 5 },
  { id: 'madagaskar', name: 'Madagaskar', x: 890, y: 730, la: 'middle', lx: 0, ly: -22 },
  { id: 'sansibar', name: 'Sansibar', x: 814, y: 588, la: 'start', lx: 16, ly: 5 },
  { id: 'kilimandzaro', name: 'Kilimandžaro', x: 765, y: 537, la: 'start', lx: 16, ly: -14 },
  { id: 'viktoria', name: 'Viktoria Nyanza', x: 707, y: 512, la: 'end', lx: -18, ly: -8 },
  { id: 'tanganjika', name: 'Tanganjika', x: 664, y: 575, la: 'end', lx: -16, ly: 5 },
  { id: 'bahrelghazal', name: 'Bahr el Ghazal', x: 627, y: 400, la: 'end', lx: -16, ly: 5 },
  { id: 'darfur', name: 'Darfur', x: 587, y: 337 },
  { id: 'suakin', name: 'Suakin', x: 764, y: 261 },
  { id: 'addisabeba', name: 'Addis Abeba', x: 783, y: 387, la: 'end', lx: -16, ly: 5 },
  { id: 'rashafun', name: 'Ras Hafun', x: 940, y: 368, la: 'end', lx: -18, ly: -4 },
];

export const SEA_FEE = 100;
export const FLIGHT_PRICE = 300;

// steps = kuinka monta silmälukua reitin kulkeminen vaatii.
// type 'sea' = laivareitti, jonne astuminen maksaa SEA_FEE.
export const EDGES = [
  // Pohjois-Afrikka
  { a: 'tanger', b: 'tripoli', steps: 4 },
  { a: 'tanger', b: 'sahara', steps: 5 },
  { a: 'tanger', b: 'ahaggar', steps: 4 },
  { a: 'tripoli', b: 'kairo', steps: 4 },
  { a: 'tripoli', b: 'murzuk', steps: 2 },
  { a: 'tripoli', b: 'sahara', steps: 2 },
  { a: 'murzuk', b: 'sahara', steps: 1 },
  { a: 'murzuk', b: 'alkufra', steps: 2 },
  { a: 'alkufra', b: 'kairo', steps: 3 },
  { a: 'alkufra', b: 'darfur', steps: 3 },
  { a: 'kairo', b: 'suakin', steps: 3 },
  { a: 'sahara', b: 'ahaggar', steps: 2 },
  { a: 'sahara', b: 'darfur', steps: 4 },

  // Länsi-Afrikka
  { a: 'ahaggar', b: 'timbuktu', steps: 3 },
  { a: 'ahaggar', b: 'gao', steps: 2 },
  { a: 'timbuktu', b: 'gao', steps: 1 },
  { a: 'timbuktu', b: 'dakar', steps: 4 },
  { a: 'timbuktu', b: 'kumasi', steps: 3 },
  { a: 'dakar', b: 'sierraleone', steps: 2 },
  { a: 'sierraleone', b: 'kappalmas', steps: 2 },
  { a: 'kappalmas', b: 'kumasi', steps: 2 },
  { a: 'kumasi', b: 'orjarannikko', steps: 1 },
  { a: 'orjarannikko', b: 'kano', steps: 2 },
  { a: 'orjarannikko', b: 'kamerun', steps: 2 },
  { a: 'gao', b: 'kano', steps: 3 },
  { a: 'kano', b: 'kamerun', steps: 2 },
  { a: 'kano', b: 'bahrelghazal', steps: 5 },

  // Keski- ja Etelä-Afrikka
  { a: 'kamerun', b: 'kongo', steps: 3 },
  { a: 'kongo', b: 'bahrelghazal', steps: 5 },
  { a: 'kongo', b: 'angola', steps: 2 },
  { a: 'kongo', b: 'tanganjika', steps: 4 },
  { a: 'angola', b: 'namib', steps: 3 },
  { a: 'namib', b: 'kapkaupunki', steps: 3 },
  { a: 'kapkaupunki', b: 'kimberley', steps: 2 },
  { a: 'kimberley', b: 'mosambik', steps: 4 },
  { a: 'kimberley', b: 'tanganjika', steps: 5 },

  // Itä-Afrikka
  { a: 'kilimandzaro', b: 'viktoria', steps: 2 },
  { a: 'viktoria', b: 'tanganjika', steps: 2 },
  { a: 'viktoria', b: 'bahrelghazal', steps: 3 },
  { a: 'bahrelghazal', b: 'darfur', steps: 2 },
  { a: 'bahrelghazal', b: 'addisabeba', steps: 3 },
  { a: 'addisabeba', b: 'suakin', steps: 3 },
  { a: 'addisabeba', b: 'rashafun', steps: 3 },
  { a: 'addisabeba', b: 'kilimandzaro', steps: 3 },

  // Laivareitit
  { a: 'tanger', b: 'dakar', steps: 3, type: 'sea', via: [[150, 110], [95, 178], [45, 252]] },
  { a: 'dakar', b: 'kappalmas', steps: 3, type: 'sea', via: [[26, 382], [78, 442]] },
  { a: 'kappalmas', b: 'kamerun', steps: 4, type: 'sea', via: [[250, 480], [352, 492]] },
  { a: 'kongo', b: 'namib', steps: 4, type: 'sea', via: [[398, 602], [376, 692], [418, 782]] },
  { a: 'kapkaupunki', b: 'madagaskar', steps: 5, type: 'sea', via: [[600, 976], [782, 942], [902, 832]] },
  { a: 'madagaskar', b: 'mosambik', steps: 3, type: 'sea', via: [[812, 752]] },
  { a: 'madagaskar', b: 'sansibar', steps: 4, type: 'sea', via: [[862, 642]] },
  { a: 'sansibar', b: 'mosambik', steps: 3, type: 'sea', via: [[822, 642], [792, 712]] },
  { a: 'sansibar', b: 'kilimandzaro', steps: 2, type: 'sea' },
  { a: 'sansibar', b: 'rashafun', steps: 5, type: 'sea', via: [[852, 540], [902, 458]] },
  { a: 'rashafun', b: 'suakin', steps: 4, type: 'sea', via: [[880, 322], [800, 268]] },
];

// Lentoreitit kulkevat suoraan kaupungista toiseen yhdellä vuorolla.
export const AIR_ROUTES = [
  { a: 'tanger', b: 'kairo' },
  { a: 'kairo', b: 'kapkaupunki' },
  { a: 'tanger', b: 'kapkaupunki' },
];

export const TOKEN_CITIES = CITIES.filter((c) => !c.start).map((c) => c.id);
