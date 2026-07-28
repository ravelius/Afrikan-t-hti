// Afrikka-lauta: kaupungit, reitit, kartan piirtotiedot ja teema.
//
// Koordinaatisto on 1000 x 1000 yksikköä ja vastaa suoraan Afrikan karttaa:
//   x = (pituusaste + 20) * 13.333   (lännestä -20° itään 55°)
//   y = (40 - leveysaste) * 12.5     (pohjoisesta 40° etelään -40°)


import { AFRICA_QUESTIONS, AFRICA_FACTS } from './africa-questions.js';
import { themedTokenTypes } from '../tokens.js';

const AFRICA_MAP = {
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
const AFRICA_CITIES = [
  {
    id: 'tanger', name: 'Tanger', x: 189, y: 52, start: true, airport: true,
    // Gibraltarin salmen yli Espanjaan: lyhin hyppy Afrikasta Eurooppaan.
    // Tanger on myös maailmankartalla, joten sinne pääsee takaisin.
    links: [
      { pack: 'europe', city: 'madrid', label: 'Euroopan lauta' },
      { pack: 'maailma', city: 'tanger', label: 'Maailma-lauta' },
    ],
  },
  {
    id: 'kairo', name: 'Kairo', x: 683, y: 125, start: true, airport: true,
    // Sama kaupunki on myös Lähi-idän laudalla: vaelluksessa tästä jatketaan.
    links: [
      { pack: 'middleeast', city: 'kairo', label: 'Lähi-idän lauta' },
      { pack: 'maailma', city: 'kairo', label: 'Maailma-lauta' },
    ],
  },

  { id: 'tripoli', name: 'Tripoli', x: 443, y: 89, airport: true },
  { id: 'murzuk', name: 'Murzuk', x: 474, y: 196 },
  { id: 'alkufra', name: 'Al Kufra', x: 577, y: 197 },
  { id: 'sahara', name: 'Sahara', x: 380, y: 168, la: 'end', lx: -16, ly: 5 },
  { id: 'ahaggar', name: 'Ahaggar', x: 312, y: 232, la: 'end', lx: -16, ly: 5 },
  { id: 'timbuktu', name: 'Timbuktu', x: 212, y: 285, la: 'end', lx: -16, ly: 5 },
  { id: 'gao', name: 'Gao', x: 306, y: 318, la: 'start', lx: 16, ly: 5 },
  {
    id: 'dakar', name: 'Dakar', x: 45, y: 318, airport: true, la: 'start', lx: 16, ly: 5,
    // Etelä-Atlantin ylitys Dakarista Brasiliaan on vanha postilentoreitti.
    links: [{ pack: 'southamerica', city: 'joaopessoa', label: 'Etelä-Amerikan lauta' }],
  },
  { id: 'sierraleone', name: 'Sierra Leone', x: 95, y: 392, la: 'start', lx: 16, ly: 5 },
  { id: 'kappalmas', name: 'Kap Palmas', x: 174, y: 440, la: 'end', lx: -16, ly: 5 },
  { id: 'kumasi', name: 'Kumasi', x: 250, y: 430, la: 'end', lx: -16, ly: -14 },
  { id: 'orjarannikko', name: 'Orjarannikko', x: 330, y: 404 },
  { id: 'kano', name: 'Kano', x: 394, y: 336, airport: true },
  { id: 'kamerun', name: 'Kamerun', x: 395, y: 455, la: 'start', lx: 16, ly: -8 },
  { id: 'kongo', name: 'Kongo', x: 440, y: 560, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'angola', name: 'Angola', x: 480, y: 650, la: 'end', lx: -16, ly: 5 },
  { id: 'namib', name: 'Namib', x: 475, y: 795, la: 'end', lx: -16, ly: 5 },
  {
    id: 'kapkaupunki', name: 'Kapkaupunki', x: 525, y: 915, airport: true, la: 'end', lx: -22, ly: 6,
    links: [{ pack: 'maailma', city: 'kapkaupunki', label: 'Maailma-lauta' }],
  },
  { id: 'kimberley', name: 'Kimberley', x: 597, y: 859, la: 'start', lx: 16, ly: 5 },
  { id: 'mosambik', name: 'Mosambik', x: 720, y: 730, la: 'end', lx: -16, ly: 5 },
  { id: 'madagaskar', name: 'Madagaskar', x: 890, y: 730, la: 'middle', lx: 0, ly: -22 },
  { id: 'sansibar', name: 'Sansibar', x: 836, y: 616, airport: true, la: 'start', lx: 16, ly: 5 },
  { id: 'kilimandzaro', name: 'Kilimandžaro', x: 778, y: 548, la: 'start', lx: 16, ly: -16 },
  { id: 'viktoria', name: 'Viktoria Nyanza', x: 690, y: 500, la: 'end', lx: -18, ly: -8 },
  { id: 'tanganjika', name: 'Tanganjika', x: 655, y: 592, la: 'end', lx: -16, ly: 5 },
  { id: 'bahrelghazal', name: 'Bahr el Ghazal', x: 627, y: 400, la: 'end', lx: -16, ly: 5 },
  { id: 'darfur', name: 'Darfur', x: 575, y: 318 },
  { id: 'suakin', name: 'Suakin', x: 764, y: 261 },
  { id: 'addisabeba', name: 'Addis Abeba', x: 783, y: 387, airport: true, la: 'end', lx: -16, ly: 5 },
  { id: 'rashafun', name: 'Ras Hafun', x: 940, y: 368, la: 'end', lx: -18, ly: -4 },
];


// steps = kuinka monta silmälukua reitin kulkeminen vaatii.
// type 'sea' = laivareitti, jonne astuminen maksaa SEA_FEE.
const AFRICA_EDGES = [
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
const AFRICA_AIR_ROUTES = [
  { a: 'tanger', b: 'tripoli' },
  { a: 'tripoli', b: 'kairo' },
  { a: 'tanger', b: 'dakar' },
  { a: 'dakar', b: 'kano' },
  { a: 'kano', b: 'kongo' },
  { a: 'kairo', b: 'addisabeba' },
  { a: 'addisabeba', b: 'sansibar' },
  { a: 'kongo', b: 'sansibar' },
  { a: 'kongo', b: 'kapkaupunki' },
  { a: 'sansibar', b: 'kapkaupunki' },
];

// Karttapaketti: kaikki mitä pelimoottori tarvitsee yhdestä laudasta.
// Uusi manner lisätään tekemällä vastaava tiedosto ja lisäämällä se pack.js:ään.
export const AFRICA = {
  id: 'africa',
  name: 'Afrikan tähti',
  boardLabel: 'Afrikka',
  tagline: 'Etsi tähti, vastaa kysymyksiin, palaa kotiin.',
  ariaLabel: 'Afrikan aarrekartta',

  map: { ...AFRICA_MAP, outlines: [AFRICA_MAP.africaPoints, AFRICA_MAP.madagascarPoints] },
  cities: AFRICA_CITIES,
  edges: AFRICA_EDGES,
  airRoutes: AFRICA_AIR_ROUTES,
  islands: ['sansibar'], // saarikaupungit: rannikon ulkopuolella, vain laivayhteys
  minCityDistance: 75,

  tokens: {
    types: themedTokenTypes(),
    counts: { star: 1, horseshoe: 2, robber: 3, ruby: 4, emerald: 5, topaz: 6, empty: 9 },
  },

  questions: AFRICA_QUESTIONS,
  placeFacts: AFRICA_FACTS,

  // Sijainti maailmankartalla ja rosvon kaksintaistelukysymykset.
  duels: [
    {
      q: 'Mikä näistä joista EI virtaa Afrikassa?',
      options: ['Eufrat', 'Niili', 'Kongo', 'Niger', 'Sambesi', 'Oranje', 'Limpopo', 'Volta'],
      correct: 0,
      fact: 'Eufrat virtaa Turkista Syyrian kautta Irakiin — kaikki muut ovat Afrikan suuria jokia.',
    },
    {
      q: 'Mikä on Afrikan korkein vuori?',
      options: ['Kilimandžaro', 'Kenia-vuori', 'Ras Dašen', 'Atlas', 'Elgon', 'Kamerunvuori', 'Meru', 'Drakensberg'],
      correct: 0,
      fact: 'Kilimandžaron Uhuru-huippu on 5 895 metrissä — Afrikan katolla.',
    },
    {
      q: 'Minkä kahden maan rajalla Victorian putoukset sijaitsevat?',
      options: ['Sambian ja Zimbabwen', 'Kenian ja Tansanian', 'Egyptin ja Sudanin', 'Angolan ja Namibian', 'Ghanan ja Togon', 'Malin ja Nigerin', 'Etiopian ja Somalian', 'Marokon ja Algerian'],
      correct: 0,
      fact: 'Sambesi syöksyy putouksiin Sambian ja Zimbabwen rajalla — paikallinen nimi tarkoittaa jyrisevää savua.',
    },
    {
      q: 'Mikä valtio hallitsi suurinta osaa Länsi-Afrikkaa siirtomaakaudella?',
      options: ['Ranska', 'Britannia', 'Portugali', 'Espanja', 'Italia', 'Belgia', 'Saksa', 'Alankomaat'],
      correct: 0,
      fact: 'Ranskan Länsi-Afrikka ulottui Senegalista Nigeriin — siksi ranska on yhä monen maan yhteinen kieli.',
    },
    {
      q: 'Kuinka pitkä Niili on?',
      options: ['noin 6 600 km', 'noin 1 000 km', 'noin 2 500 km', 'noin 3 300 km', 'noin 4 800 km', 'noin 8 900 km', 'noin 10 200 km', 'noin 12 000 km'],
      correct: 0,
      fact: 'Niili virtaa yli 6 600 kilometriä Viktoriajärveltä Välimereen — maailman pisimpiä jokia.',
    },
    {
      q: 'Mikä näistä kielistä EI ole afrikkalainen?',
      options: ['urdu', 'swahili', 'hausa', 'joruba', 'amhara', 'zulu', 'wolof', 'somali'],
      correct: 0,
      fact: 'Urdua puhutaan Pakistanissa ja Intiassa — muut ovat Afrikan suuria kieliä.',
    },
  ],

  // Tapahtumakortit: välillä kysymyksen sijaan tapahtuu jotain. Vaikutus on
  // aina pieni ja reilu — tapahtuma ei vie aarretta eikä isoa summaa, ja
  // laatta jää kääntämättä, joten kaupunkiin voi palata. Viivästys johtuu
  // säästä, luonnosta, kertojan omasta typeryydestä tai imperiumin
  // jäänteistä, ei koskaan kohdemaasta tai sen ihmisistä.
  events: [
    { text: 'Sade alkoi iltapäivällä kuin kello olisi soinut, ja kadun poikki juoksi hetkessä ruskea puro. Istuin katoksen alla tunnin ja huomasin olevani ainoa, joka ei ollut osannut varata sitä tuntia valmiiksi.', effect: { kind: 'viive' } },
    { text: 'Auto pysähtyi, koska tiellä seisoi norsulauma eikä sillä ollut kiire. Afrikannorsu on maailman suurin maaeläin, joten väistämisjärjestys oli selvä kaikille muille paitsi minulle, joka ehdotin äänitorvea.', effect: { kind: 'viive' } },
    { text: 'Kartalla kaksi rataa melkein koskettavat toisiaan, mutta juna ei jatka: siirtomaavallat rakensivat kiskonsa satamasta sisämaahan päin, ei naapurin luo, eivätkä aina samalle raideleveydelle. Istun nyt odottamassa imperiumin mittavirhettä.', effect: { kind: 'viive' } },
    { text: 'Huomasin vasta aamiaisella, että isoisän kartta oli jäänyt edelliseen majapaikkaan. Palasin hakemaan sen ja menetin päivän: kartta on vuodelta 1872 eikä kelpaa suunnistamiseen, mutta se on ainoa syy, miksi olen täällä.', effect: { kind: 'viive' } },
    { text: 'Myin villatakkini lentokentällä matkalaiselle, joka oli lähdössä pohjoiseen. Olin raahannut sitä mukanani kolme viikkoa, koska pakkauslistani oli laadittu Lontoossa marraskuussa.', effect: { kind: 'raha', amount: 50 } },
    { text: 'Etsin kolme päivää setelinippua, jonka olin varmuuden vuoksi ommellut takin vuoreen. Tänään se löytyi sieltä, minne olin sen itse pannut, ja olin siitä yhtä riemuissani kuin jos joku olisi antanut sen minulle.', effect: { kind: 'raha', amount: 80 } },
    { text: 'Kanssamatkustaja tarjosi vetoa siitä, että Afrikan suurin maa on Sudan. Vanhassa kartassani se pitää yhä paikkansa, mutta Etelä-Sudanin itsenäistyttyä 2011 suurin on Algeria. Otin rahat vastaan hiljaa.', effect: { kind: 'raha', amount: 70 } },
    { text: 'Vaaka näytti lähtöselvityksessä 27 kiloa, kun sallittu raja oli 23. Ylipainon maksoin käteisellä, ja kaikki ylimääräinen oli isoisän: messinkinen kaukoputki, kaksi karttakirjaa ja kompassi, jota en ole kertaakaan tarvinnut.', effect: { kind: 'raha', amount: -60 } },
    { text: 'Rajalla viisumi maksoi enemmän kuin edellinen yöni majapaikassa. Isoisän vihreä passi avasi aikanaan portteja puolessa maailmassa; minun asiakirjani odottaa vuoroaan kuten kaikki muutkin, ja niin sen kuuluukin.', effect: { kind: 'raha', amount: -45 } },
    { text: 'Kysyin huoltoaseman pihalla, mihin suuntaan kuorma-auto on menossa, ja se sattui olemaan minun suuntani. Matkustin appelsiinilaatikoiden päällä ja opin, että hyvä jousitus on ylellisyys, jota en ole koskaan osannut arvostaa.', effect: { kind: 'kyyti' } },
    { text: 'Rannassa lastattiin venettä alavirtaan lähtevälle matkalle, ja kippari nyökkäsi kohti vapaata paikkaa keulassa. Vesi vei meidät nopeammin kuin tie olisi vienyt. Isoisä olisi mitannut virtaaman; minä nukahdin.', effect: { kind: 'kyyti' } },
    { text: 'Kentän laidalla seisoi kuusipaikkainen potkurikone, joka vie postia samaan suuntaan kuin minä, ja kaksi penkkiä oli tyhjänä. Sain toisen. Ylhäältä näkyi, miten lyhyt oli se matka, jota olin pelännyt kolme päivää.', effect: { kind: 'kyyti' } },
  ],

  texts: {
    intro: 'Peli alkaa! Etsikää Afrikan tähti ja palatkaa Tangeriin tai Kairoon.',
    starFound: (name, city) => `★ ${name} löysi AFRIKAN TÄHDEN kaupungista ${city}!`,
    starToast: 'AFRIKAN TÄHTI!',
    starChase: 'Nyt on kiire kotiin — myös hevosenkengän haltija voi voittaa pelin.',
    winStar: 'toi Afrikan tähden turvallisesti kotiin',
    winnerStar: (name, money) => `${name} toi Afrikan tähden kotiin ${money} punnan kanssa.`,
    // Saapumismerkinnät: yksi arvotaan laudalle saavuttaessa.
    diaries: [
      'Isoisän kartassa tämä manner on paikoin väritetty tyhjäksi. Piirtäjä ei ilmeisesti vaivautunut kysymään niiltä miljoonilta, jotka asuivat täällä jo silloin. Tyhjä kohta kartassa kertoo piirtäjästä, ei maasta.',
      '"Sisämaahan ei pääse", isoisä kirjoitti kolme kertaa eri sivuille, aina yhtä varmasti. Nousin lentokoneeseen ja olin siellä kahdessa tunnissa. Hänen kolme kuukauttaan ovat nyt aamupäivä.',
      'Isoisä laski manterella olevan "muutama kymmenen heimoa". Nykyään täällä on 54 itsenäistä valtiota ja yli tuhat elävää kieltä, ja jokaisella niistä on oma sanansa vieraalle.',
      'Lentokentältä keskustaan taksi ohitti kolme työmaata, joissa valot paloivat vielä yhdeksältä illalla. Tämän mantereen väestön keski-ikä on alle kaksikymmentä vuotta — nuorin koko maailmassa. Istuin takapenkillä ja tunsin itseni vanhentuneeksi kartaksi.',
      'Niili, Kongo, Niger, Sambesi. Päiväkirjan tarkin sivu on se, jolle isoisä luetteli mantereen suuret joet — jokaisen nimen hän sai oikein. Vedet hän näki; ihmiset hän arvasi.',
    ],
    // Isoisän aikataulu: haamu, joka kulkee rinnalla. Rivi nousee esiin, kun
    // matkapäivä ohittaa merkinnän päivän. Ennätys on tavoite eikä tuomio —
    // päivän 80 jälkeenkin merkinnät jatkuvat, sävy vain vaihtuu.
    schedule: [
      { day: 2, text: 'Isoisä odotti Tangerissa laivaa, joka ei tullut. Päiväkirjaan tuli kaksi sivua satamamaksuista ja yksi rivi maisemasta.' },
      { day: 6, text: 'Höyrylaiva itään pitkin rannikkoa. Isoisä merkitsi muistiin jokaisen sataman nimen ja kirjoitti kolme niistä väärin.' },
      { day: 12, text: 'Isoisä oli Egyptissä ja osti kartan, joka oli hänen omaansa vanhempi. Hän käytti sitä loppumatkan.' },
      { day: 19, text: 'Aikataulu piti, mutta vain koska laiva lähti myöhässä samaan suuntaan kuin hänkin.' },
      { day: 26, text: 'Punaisellamerellä. Isoisä kirjoitti kaipaavansa sadetta, minkä hän myöhemmin yliviivasi.' },
      { day: 34, text: 'Isoisä kuuli satamassa karavaanireitistä, joka vie kuukaudessa aavikon halki sisämaahan. Hän ei lähtenyt. Sivun reunaan hän kirjoitti: "toiste".' },
      { day: 42, text: 'Puolimatka. Isoisä laski, että kotiin ehtii, jos mikään ei mene pieleen — ja kirjoitti sen alle, että jokin menee aina.' },
      { day: 50, text: 'Mausteita ostettiin kotiin vietäväksi. Ne loppuivat matkalla, ja päiväkirjassa asiaa selitetään puoli sivua.' },
      { day: 58, text: 'Isoisä kiersi mantereen eteläkärjen ja huomasi olevansa aikataulussa ensimmäistä kertaa koko matkalla.' },
      { day: 66, text: 'Atlantille päin. Isoisä totesi, ettei hän ollut nähnyt sisämaasta mitään — ja jatkoi matkaa rannikkoa pitkin.' },
      { day: 73, text: 'Viimeinen satama ennen kotimatkaa. Isoisä kirjoitti nimensä laivayhtiön kirjaan ja alleviivasi päivämäärän.' },
      { day: 80, text: 'Isoisä oli kotona. Tähän kohtaan päiväkirjassa ei ole muuta kuin päivämäärä ja kaksi alleviivausta.' },
      { day: 84, text: 'Isoisä olisi jo kotona. Minä en ole. Tästä eteenpäin kirjoitan sivuja, joita hänellä ei ole.' },
      { day: 100, text: 'Isoisän päiväkirja loppuu kesken lauseen. Tästä eteenpäin kartta on minun.' },
    ],
    // Isoisän vihjeet laudan pääaarteesta: suunta tai seutu,
    // ei koskaan kaupungin nimeä.
    starHints: {
      tripoli: 'Välimeren eteläisellä rannalla, siellä missä aavikko tulee melkein mereen asti, on satamakaupunki jonka läpi karavaanit purkavat lastinsa laivoihin.',
      murzuk: 'Suoraan etelään Välimeren rannikolta, keskellä autiomaata, on keidaskaupunki joka oli karavaanireitin tärkein pysähdys. Sinne on rannikolta kuukausi kamelilla.',
      alkufra: 'Kaukana koillisessa autiomaassa, kaukana kaikista reiteistä, on keidasryhmä jonne pääsee vain sen tietäen. Kukaan tuntemani eurooppalainen ei ollut käynyt siellä.',
      sahara: 'Keskellä maailman suurinta hiekkamerta, kaukana kaikista rannikoista, on paikka johon karavaanit pysähtyivät veden vuoksi. Sitä ei löydä kartalta, vaan oppaalta.',
      ahaggar: 'Läntisen autiomaan keskellä kohoaa vulkaaninen vuoristo, jonka huipuilla on yöllä kylmä. Tuaregit tunsivat sen polut; me emme.',
      timbuktu: 'Aavikon eteläreunalla, suuren joen mutkassa, kerrottiin kaupungista jonka kirjastot hävettivät Oxfordia. En ehtinyt käydä. Käy sinä.',
      gao: 'Saman suuren joen varrella, alempana itään päin aavikon reunaa, oli mahtavan valtakunnan pääkaupunki, jonka hallitsijan hautakumpu on savesta.',
      dakar: 'Läntisimmässä kärjessä, siinä missä manner työntyy pisimmälle Atlanttiin, on satama josta on Amerikkaan lyhyempi matka kuin Lontooseen.',
      sierraleone: 'Läntisellä rannikolla etelämpänä on vuorinen niemi ja sen suojassa satama, joka perustettiin vapautettujen ihmisten kotipaikaksi. Nimi tarkoittaa leijonavuoria.',
      kappalmas: 'Siinä kohdassa, jossa läntinen rannikko kääntyy jyrkästi itään, on niemi jonka ohi jokainen etelään menevä laiva purjehtii. Palmuja on niin paljon että ne näkyvät mereltä.',
      kumasi: 'Guineanlahden pohjoispuolella, sisämaassa sademetsän keskellä, oli kultarikkaan valtakunnan pääkaupunki. Sen kuninkaan istuin on kultaa eikä sitä saa laskea maahan.',
      orjarannikko: 'Guineanlahden pohjukassa on rannikonpätkä, jolle eurooppalaiset antoivat nimen sen mukaan mitä sieltä veivät. Se nimi on häpeällinen ja se on meidän antamamme.',
      kano: 'Aavikon ja metsän välissä, sisämaassa itään Nigerin mutkasta, on savimuurien ympäröimä kauppakaupunki. Sen indigovärjäämöt ovat toimineet satoja vuosia.',
      kamerun: 'Guineanlahden pohjukassa, aivan rannikolla, kohoaa tulivuori suoraan merestä. Se on koko läntisen rannikon korkein kohta ja sataa siellä enemmän kuin missään.',
      kongo: 'Keskellä mannerta, päiväntasaajalla, laskee mereen joki jonka virtaama on maailman toiseksi suurin. Sen suulle pääsee laivalla; ylemmäs ei koskilta.',
      angola: 'Lounaisrannikolla, päiväntasaajan eteläpuolella, on portugalilaisten satama jonka takana alkaa ylätasanko. Sieltä vietiin ihmisiä Brasiliaan kolmesataa vuotta.',
      namib: 'Lounaassa, siinä missä autiomaa tulee kylmään merivirtaan asti, on rannikko jonka hiekasta löytyy laivanhylkyjä. Sumu tulee mereltä joka aamu eikä sada koskaan.',
      kapkaupunki: 'Aivan mantereen eteläkärjessä, pöydänmuotoisen vuoren juurella, on satama jossa kaksi valtamerta kohtaa. Kaikki Intiaan menevät laivat täydentävät siellä vetensä.',
      kimberley: 'Eteläisellä ylätasangolla, kaukana rannikoilta sisämaassa, kaivettiin maahan kuoppa niin suuri että se näkyy taivaalle. Sieltä nostettiin timantteja.',
      mosambik: 'Kaakkoisrannikolla, suuren saaren vastapäätä salmen toisella puolen, on portugalilaisten vanha satamakaupunki omalla pikkusaarellaan.',
      madagaskar: 'Kaakossa, salmen takana omalla suurella saarellaan, on maa jossa kasvit ja eläimet eivät muistuta mantereen omia lainkaan. Ne kehittyivät erillään miljoonia vuosia.',
      sansibar: 'Itärannikon edustalla, pienellä saarella päiväntasaajan tuntumassa, on satama joka tuoksuu neilikalle kilometrien päähän. Sieltä lähtivät karavaanit sisämaahan.',
      kilimandzaro: 'Itä-Afrikassa, aivan päiväntasaajan tuntumassa, kohoaa yksinäinen vuori jonka huipulla on lunta ympäri vuoden. Lontoossa minua ei uskottu.',
      viktoria: 'Keskellä itäistä ylätasankoa, päiväntasaajan molemmin puolin, on järvi joka on kuin sisämeri: toista rantaa ei näy. Sen pohjoisrannalta lähtee Niili.',
      tanganjika: 'Idässä, kahden hautavajoaman välissä, on kapea ja hyvin pitkä järvi joka on maailman toiseksi syvin. Rannalta rannalle kestää laivalla koko päivän.',
      bahrelghazal: 'Ylä-Niilin varrella, keskellä mannerta pohjoisessa, on suunnaton suoalue jossa joki hajoaa ruohikkoon. Siellä katosi useampi retkikunta kuin yksikään uskalsi laskea.',
      darfur: 'Niilin länsipuolella, autiomaan ja savannin rajalla, on sulttaanikunnan vuoristoinen ylänkö. Sinne ei ollut asiaa ilman sulttaanin lupaa.',
      suakin: 'Punaisenmeren länsirannalla on korallista rakennettu satamakaupunki omalla saarellaan. Sen valkoiset talot on tehty merestä nostetusta kivestä.',
      addisabeba: 'Koillisen ylängöllä, kahden ja puolen kilometrin korkeudessa, perustettiin keisarikunnalle uusi pääkaupunki kuumien lähteiden viereen. Siellä on viileää päiväntasaajan lähelläkin.',
      rashafun: 'Mantereen itäisimmässä kärjessä, siinä missä rannikko kääntyy Intian valtamerelle, on niemi jonka ohi purjehtivat jo antiikin kauppiaat suitsuketta hakemaan.',
    },
  },

  decor: {
    mapLabel: 'AFRIKKA',
    mapLabelPos: { x: 886, y: 96 },
    compass: { x: 168, y: 772, r: 62 },
    // Aaltoja ei piirretä näihin kohtiin: laivadoodle, meripeto ja karttanimi.
    waveSkip: [
      { x: 232, y: 556, r: 95 },
      { x: 858, y: 905, r: 110 },
      { x: 880, y: 92, r: 135 },
    ],
    ship: { x: 214, y: 548 },
    serpent: { x: 852, y: 902 },
    // Nopan lepopaikka suhteellisina koordinaatteina: avomerta vasemmassa alakulmassa.
    dieSpot: { x: 0.115, y: 0.865 },
    // Maaston merkit leveysvyöhykkeittäin: pohjoisessa dyynejä, keskellä puita,
    // etelässä vuoria.
    terrainBands: [
      { maxY: 300, kind: 'dunes' },
      { maxY: 640, kind: 'trees' },
      { maxY: Infinity, kind: 'mountains' },
    ],
  },
};
