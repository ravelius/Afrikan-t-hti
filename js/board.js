// Pelilauta: kaupungit, reitit ja kartan piirtotiedot.
//
// Koordinaatisto on 1000 x 1000 yksikköä ja vastaa suoraan Afrikan karttaa:
//   x = (pituusaste + 20) * 13.333   (lännestä -20° itään 55°)
//   y = (40 - leveysaste) * 12.5     (pohjoisesta 40° etelään -40°)

export const MAP = {
  width: 1000,
  height: 1000,
  // Karkea Afrikan rannikkoviiva samassa koordinaatistossa.
  africa:
    'M186,50 L267,37 L400,37 L533,87 L667,112 L707,112 L733,150 L773,225 ' +
    'L840,350 L947,362 L947,475 L813,525 L800,625 L733,750 L693,825 L640,912 ' +
    'L533,937 L467,837 L427,725 L387,512 L387,450 L307,425 L213,437 L160,450 ' +
    'L93,387 L40,325 L53,237 L93,162 L133,125 Z',
  madagascar: 'M853,650 L933,700 L907,812 L853,750 Z',
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
  { id: 'sansibar', name: 'Sansibar', x: 789, y: 578, la: 'start', lx: 16, ly: 5 },
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
  { a: 'tanger', b: 'dakar', steps: 3, type: 'sea' },
  { a: 'dakar', b: 'kappalmas', steps: 3, type: 'sea' },
  { a: 'kappalmas', b: 'kamerun', steps: 4, type: 'sea' },
  { a: 'kongo', b: 'namib', steps: 4, type: 'sea' },
  { a: 'kapkaupunki', b: 'madagaskar', steps: 5, type: 'sea' },
  { a: 'madagaskar', b: 'mosambik', steps: 3, type: 'sea' },
  { a: 'madagaskar', b: 'sansibar', steps: 4, type: 'sea' },
  { a: 'sansibar', b: 'mosambik', steps: 3, type: 'sea' },
  { a: 'sansibar', b: 'kilimandzaro', steps: 2, type: 'sea' },
  { a: 'sansibar', b: 'rashafun', steps: 5, type: 'sea' },
  { a: 'rashafun', b: 'suakin', steps: 4, type: 'sea' },
];

// Lentoreitit kulkevat suoraan kaupungista toiseen yhdellä vuorolla.
export const AIR_ROUTES = [
  { a: 'tanger', b: 'kairo' },
  { a: 'kairo', b: 'kapkaupunki' },
  { a: 'tanger', b: 'kapkaupunki' },
];

export const TOKEN_CITIES = CITIES.filter((c) => !c.start).map((c) => c.id);
