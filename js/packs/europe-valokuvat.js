// Euroopan matkakirjavalokuvat (sama rakenne kuin AFRICA_VALOKUVAT):
// vanha vedos isoisän ajoilta ja sama paikka nykyään. Rakentuu kaupunki
// kerrallaan. Lisenssit varmistettu Commonsin extmetadatasta (Venetsia
// 31.7.2026, muut 1.8.2026).
//
// Ateenan seudusta alkaen kuvista EI enää tehdä paikallisia kopioita
// (omistajan päätös): ne haetaan suoraan Commonsista sitä mukaa kuin
// pelaaja ne näkee, ja palvelutyöntekijä tallentaa kerran nähdyn kuvan
// omaan pitkäikäiseen koriinsa. Commons on siis se repon ulkopuolinen
// tallennuspaikka — se on ilmainen, pysyvä ja jo valmiiksi kytketty.
export const EUROPE_VALOKUVAT = {
  venetsia: {
    tiedosto: 'Gondolas and Piazzetta di San Marco, Venice, Italy-LCCN2001701072.jpg',
    vuosi: '1890-luku',
    lahde: 'Library of Congress (PD)',
    selite: 'Gondoliereja Piazzetta di San Marcon edustalla — '
      + 'käsinväritetty photochrom-vedos, jollaisia myytiin matkailijoille '
      + 'jo isoisän aikaan. Taustalla dogen palatsi ja Markuksen leijona '
      + 'pylväänsä päässä.',
    uusi: {
      tiedosto: 'Canal Grande Chiesa della Salute e Dogana dal ponte dell Accademia.jpg',
      lahde: 'Commons (CC BY-SA 3.0)',
      selite: 'Canal Grande nykyään Accademian sillalta: gondolit ja '
        + 'vesibussit risteilevät, ja Santa Maria della Saluten kupoli '
        + 'vartioi kanavan suuta kuten 350 vuotta.',
    },
  },

  marseille: {
    tiedosto: 'Old Harbor (Vieux-Port), Marseille, France-LCCN2002715100.jpg',
    vuosi: '1890-luku',
    lahde: 'Library of Congress (PD)',
    selite: 'Vanha satama purjelaivojen aikaan — käsinväritetty '
      + 'photochrom-vedos. Laivat makasivat kylki kyljessä laiturissa, ja '
      + 'lastit purettiin käsivoimin suoraan kadulle.',
    uusi: {
      tiedosto: 'Vieux-Port de Marseille, France.jpg',
      lahde: 'Commons (CC BY-SA 4.0)',
      selite: 'Sama satama nykyään: rahtiliikenne muutti pohjoisemmas, ja '
        + 'altaassa on huviveneitä. Laiturilla myydään yhä aamun kala, ja '
        + 'aukion yllä on Norman Fosterin peilikatos.',
    },
  },

  granada: {
    tiedosto: 'Court of the Lions, Alhambra by Juan Laurent.jpg',
    vuosi: '1870-luku',
    lahde: 'Wikimedia Commons (PD)',
    selite: 'Leijonapiha Juan Laurentin valokuvaamana isoisän aikaan. '
      + 'Laurent kiersi Espanjaa suurella kamerallaan ja myi vedoksia '
      + 'matkailijoille — moni eurooppalainen näki Alhambran '
      + 'ensimmäisen kerran juuri hänen kuvinaan.',
    uusi: {
      tiedosto: 'Court of the Lions, Alhambra de Granada (Spain).jpg',
      lahde: 'Commons (CC BY-SA 4.0)',
      selite: 'Sama piha tänään. Kaksitoista leijonaa kannattelevat yhä '
        + 'allasta keskellä; ne puhdistettiin ja korjattiin perusteellisesti '
        + '2000-luvulla, ja suihkulähde toimii taas.',
    },
  },

  krakova: {
    tiedosto: 'Krakow - Kosciol Maryacki i Sukiennice. 1910 (69699690).jpg',
    vuosi: '1910',
    lahde: 'Wikimedia Commons (PD)',
    selite: 'Marian kirkko ja Sukiennice torin laidalla vuonna 1910, '
      + 'jolloin Krakova kuului Itävalta-Unkariin. Torilla seisoo '
      + 'hevosvaunuja — niitä on aukiolla vieläkin, joskin turisteja varten.',
    uusi: {
      tiedosto: 'Kraków - Rynek Główny (2).jpg',
      lahde: 'Commons (CC BY 2.0)',
      selite: 'Rynek Główny nykyään. Rakennukset ovat samat: Krakovan '
        + 'vanhakaupunki säilyi toisessa maailmansodassa lähes ehjänä, '
        + 'toisin kuin Varsova.',
    },
  },

  sarajevo: {
    tiedosto: 'Sarajevo Sebilj and Bascarsija, ca. 1930.jpg',
    vuosi: '1930-luku',
    lahde: 'Wikimedia Commons (PD)',
    selite: 'Sebiljin vesikioski ja Baščaršijan basaari 1930-luvulla. '
      + 'Nykyinen kioski rakennettiin 1891 palaneen tilalle, ja aukio '
      + 'on ollut kauppapaikkana 1400-luvulta asti.',
    uusi: {
      tiedosto: 'Sarajevo Bascarsija from Trebevic.JPG',
      lahde: 'Commons (CC BY-SA 3.0)',
      selite: 'Sarajevo Trebevićin rinteeltä nähtynä. Kaupunki on '
        + 'kapeassa laaksossa, ja talot kiipeävät rinteille joka '
        + 'suunnassa — siksi sitä kutsutaan joskus Balkanin Jerusalemiksi.',
    },
  },

  islanti: {
    tiedosto: 'Reykjavík. Fish drying and shark oil station. (4558216609).jpg',
    vuosi: '1900-luvun alku',
    lahde: 'Cornell University Library (ei käyttörajoituksia)',
    selite: 'Kalankuivauskenttä ja hainmaksaöljyn keittämö Reykjavíkin '
      + 'laidalla. Kuivattu turska oli vuosisatojen ajan Islannin '
      + 'tärkein vientitavara, ja hainmaksaöljyä poltettiin lampuissa '
      + 'ympäri Eurooppaa.',
    uusi: {
      tiedosto: 'City View of Reykjavik from Hallgrímskirkja - 2013.08 - panoramio.jpg',
      lahde: 'Commons (CC BY 3.0)',
      selite: 'Reykjavík Hallgrímskirkjan tornista. Kaikki talot '
        + 'lämpiävät maan omalla kuumalla vedellä, ja katot on '
        + 'perinteisesti maalattu kirkkaiksi — pimeä vuodenaika on pitkä.',
    },
  },

  ateena: {
    tiedosto: "Athènes. L' Acropole et le Temple de Thesée LCCN2017658103.jpg",
    vuosi: '1890-luku',
    lahde: 'Library of Congress (PD)',
    selite: 'Akropolis ja etualalla Hefaistoksen temppeli '
      + 'käsinvärittynä photochrom-vedoksena. Kaupunki oli tuolloin '
      + 'pieni: Ateenassa asui noin 100 000 ihmistä, ja temppelien '
      + 'ympärillä oli peltoa.',
    uusi: {
      tiedosto: 'The Acropolis of Athens with the Parthenon, the Erecththeion and the Mycenean Fountain from Monastiraki Square on March 11, 2020.jpg',
      lahde: 'Commons (CC BY-SA 4.0)',
      selite: 'Sama kallio tänään Monastirakin aukiolta: alla kolmen '
        + 'miljoonan asukkaan kaupunki, päällä Parthenon telineineen. '
        + 'Temppeliä on korjattu yhtäjaksoisesti vuodesta 1975 — '
        + 'hitaasti, koska jokainen marmoripala palautetaan omalle '
        + 'paikalleen.',
    },
  },

  rooma: {
    tiedosto: 'The Colisuem and Meta Sudans, Rome, Italy-LCCN2001700939.jpg',
    vuosi: '1890-luku',
    lahde: 'Library of Congress (PD)',
    selite: 'Colosseum ja sen edessä Meta Sudans, antiikin '
      + 'suihkulähteen tyngä. Lähde purettiin 1936 kadun tieltä, joten '
      + 'tässä kuvassa näkyy jotain, mitä ei enää ole.',
    uusi: {
      tiedosto: 'Rome Colosseum exterior 1.jpg',
      lahde: 'Commons (CC BY-SA 4.0)',
      selite: 'Sama amfiteatteri nykyään. Ulkokehästä on jäljellä vain '
        + 'osa: keskiajalla Colosseumia käytettiin kivilouhoksena, ja '
        + 'sen marmoria on monissa Rooman kirkoissa.',
    },
  },

  kreeta: {
    tiedosto: 'Cnossus - room of (?), columns - north entrance - DPLA - 156faa906e3d69e9b9c71702853f1b8a.jpg',
    vuosi: '1900-luvun alku',
    lahde: 'Digital Public Library of America (PD)',
    selite: 'Knossoksen pohjoinen sisäänkäynti kaivausten aikaan. Arthur '
      + 'Evans alkoi kaivaa palatsia 1900 ja rakensi osan siitä '
      + 'uudelleen betonista — tapa, jota arkeologit yhä kiistelevät.',
    uusi: {
      tiedosto: 'Ruins of the Minoan Palace in Knossos.jpg',
      lahde: 'Commons (CC BY-SA 4.0)',
      selite: 'Palatsin rauniot tänään. Punaiset pylväät ovat Evansin '
        + 'rekonstruktiota: minolaiset pylväät levenivät ylöspäin, '
        + 'toisin kuin kreikkalaiset.',
    },
  },

  sisilia: {
    tiedosto: 'Crupi, Giovanni (1861-1925) - n. 0030 B - Teatro Greco - Taormina - DPLA - 51ed756181740204aed046a9302cef1b (page 8).jpg',
    vuosi: '1890-luku',
    lahde: 'Digital Public Library of America (PD)',
    selite: 'Taorminan kreikkalainen teatteri Giovanni Crupin kuvaamana. '
      + 'Crupi piti Taorminassa valokuvaamoa ja myi näkymiä '
      + 'matkailijoille — juuri sellaisia, joita isoisä olisi voinut '
      + 'ostaa muistoksi.',
    uusi: {
      tiedosto: 'Sicily Taormina Teatro Greco Etna.jpg',
      lahde: 'Commons (CC0)',
      selite: 'Sama teatteri tänään, Etna taustalla. Rakennettu '
        + 'kreikkalaisten aikaan 200-luvulla eaa. ja laajennettu '
        + 'roomalaisten toimesta; siellä pidetään yhä konsertteja.',
    },
  },

  dubrovnik: {
    tiedosto: 'Ragusa, general view, Dalmatia, Austro-Hungary-LCCN2002710782.jpg',
    vuosi: '1890-luku',
    lahde: 'Library of Congress (PD)',
    selite: 'Ragusa — Dubrovnikin vanha nimi — Itävalta-Unkarin aikaan. '
      + 'Kaupunki oli menettänyt itsenäisyytensä 1808, ja vedoksen '
      + 'kyljessä lukee siksi "Austro-Hungary".',
    uusi: {
      tiedosto: 'Steep coast near the city wall in the Old Town of Dubrovnik, Croatia (48613191222).jpg',
      lahde: 'Commons (CC BY 2.0)',
      selite: 'Vanhankaupungin muuri ja kattotiilet nykyään. Osa '
        + 'katoista on kirkkaan oransseja: ne uusittiin 1990-luvun sodan '
        + 'jälkeen, kun kaupunkia pommitettiin.',
    },
  },

  sofia: {
    tiedosto: 'Banya Bashi 1900.jpg',
    vuosi: 'noin 1900',
    lahde: 'Wikimedia Commons (PD)',
    selite: 'Banya Bashin moskeija noin vuonna 1900. Se rakennettiin '
      + '1566 kuumien lähteiden päälle — nimi tarkoittaa "monta kylpyä". '
      + 'Bulgaria oli vasta itsenäistynyt, ja Sofiasta tehtiin '
      + 'pääkaupunki 1879.',
    uusi: {
      tiedosto: 'Banya Bashi Mosque.jpg',
      lahde: 'Commons (CC BY-SA 4.0)',
      selite: 'Sama moskeija tänään. Sen ympärillä on korttelin matkalla '
        + 'myös synagoga ja kaksi kirkkoa, ja kuumat lähteet pulppuavat '
        + 'yhä viereisessä puistossa julkisiin hanoihin.',
    },
  },
};
