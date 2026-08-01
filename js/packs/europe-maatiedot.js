// Euroopan maiden tunnusluvut (sama rakenne kuin AFRICA_MAATIEDOT).
// Rakentuu maa kerrallaan.
//
// Lähteet ja menetelmä (Ranska, Espanja, Puola, Bosnia ja Islanti,
// haettu 1.8.2026):
//  - väkiluku SP.POP.TOTL (2024), pinta-ala AG.SRF.TOTL.K2 (2022) ja
//    keskitulo NY.GNP.PCAP.CD eli BKTL/asukas Atlas-menetelmällä (2024),
//    kaikki Maailmanpankin rajapinnasta;
//  - demokratia = V-Demin liberaalin demokratian indeksi (2025) Our
//    World in Datan aineistosta.
// Sijoitus on laskettu suvereenien valtioiden kesken (Maailmanpankin
// maalista ilman merentakaisia alueita), ja nimittäjä on pyöristetty
// samaan tapaan kuin Afrikan tiedoissa. Menetelmä tarkistettiin
// toistamalla Italian ja Marokon valmiit luvut: sijoitukset osuivat
// ±1 tarkkuudella.
export const EUROPE_MAATIEDOT = {
  ITA: {
    vakiluku: '59 milj.',
    vakilukuSija: '25./195',
    pintaAla: '302 000 km²',
    pintaAlaSija: '71./195',
    demokratia: {
      arvo: '0,64',
      sija: '37./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~ITA',
      selitys: 'Italia on vakiintunut demokratia, mutta sen luku on '
        + 'laskenut viime vuosina selvästi: V-Demin mittareissa '
        + 'erityisesti sananvapauden ja median tila on heikentynyt, '
        + 'kun televisio ja lehdistö keskittyvät harvoihin käsiin.',
    },
    keskitulo: { arvo: '42 100 $/v', sija: '26./190' },
    // `osuus` on karkea arvio kielen puhujista maassa.
    tervehdykset: [
      { teksti: 'Buongiorno', kieli: 'italia', lippu: 'Flag of Italy.svg', osuus: '95 %' },
      { teksti: 'Bona die', kieli: 'sardi', lippu: 'Flag of Sardinia, Italy.svg', osuus: '2 %' },
      { teksti: 'Guten Tag', kieli: 'saksa (Etelä-Tiroli)', lippu: 'Flag of Germany.svg', osuus: '0,5 %' },
    ],
  },

  FRA: {
    vakiluku: '69 milj.',
    vakilukuSija: '23./195',
    // Maailmanpankin luku sisältää merentakaiset departementit; pelkkä
    // Manner-Ranska on noin 550 000 km².
    pintaAla: '610 000 km²',
    pintaAlaSija: '45./195',
    demokratia: {
      arvo: '0,80',
      sija: '9./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~FRA',
      selitys: 'Ranska on yksi maailman korkeimmalle arvioiduista '
        + 'demokratioista: vaalit ovat vapaat, tuomioistuimet '
        + 'riippumattomia ja lehdistö moniääninen. Presidentin valta on '
        + 'eurooppalaisittain poikkeuksellisen suuri, mutta parlamentti '
        + 'ja perustuslakineuvosto rajaavat sitä.',
    },
    keskitulo: { arvo: '45 000 $/v', sija: '23./190' },
    tervehdykset: [
      { teksti: 'Bonjour', kieli: 'ranska', lippu: 'Flag of France.svg', osuus: '100 %' },
      { teksti: 'Salam alaikum', kieli: 'arabia', lippu: 'Flag of Saudi Arabia.svg', osuus: '5 %' },
      { teksti: 'Bonjorn', kieli: 'oksitaani', lippu: 'Flag of Occitania.svg', osuus: '1 %' },
    ],
  },

  ESP: {
    vakiluku: '49 milj.',
    vakilukuSija: '32./195',
    pintaAla: '510 000 km²',
    pintaAlaSija: '53./195',
    demokratia: {
      arvo: '0,74',
      sija: '21./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~ESP',
      selitys: 'Espanja siirtyi diktatuurista demokratiaan vasta 1970-'
        + 'luvun lopulla, ja se näkyy yhä: alueiden itsehallinto ja '
        + 'keskusvallan suhde on kestoaihe, ja tuomarien nimityksistä '
        + 'kiistellään puolueiden kesken. Vaalit, lehdistö ja '
        + 'kansalaisoikeudet arvioidaan vahvoiksi.',
    },
    keskitulo: { arvo: '34 000 $/v', sija: '32./190' },
    tervehdykset: [
      { teksti: 'Buenos días', kieli: 'espanja', lippu: 'Flag of Spain.svg', osuus: '99 %' },
      { teksti: 'Bon dia', kieli: 'katalaani', lippu: 'Flag of Catalonia.svg', osuus: '17 %' },
      { teksti: 'Bo día', kieli: 'galicia', lippu: 'Flag of Galicia.svg', osuus: '5 %' },
      { teksti: 'Egun on', kieli: 'baski', lippu: 'Flag of the Basque Country.svg', osuus: '2 %' },
    ],
  },

  POL: {
    vakiluku: '37 milj.',
    vakilukuSija: '42./195',
    pintaAla: '310 000 km²',
    pintaAlaSija: '69./195',
    demokratia: {
      arvo: '0,65',
      sija: '36./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~POL',
      selitys: 'Puolan luku on käynyt kokonaisen kierroksen: se romahti '
        + '2015–2021, kun hallitus otti tuomioistuinten nimitykset ja '
        + 'valtion television ohjaukseensa, ja on sen jälkeen noussut '
        + 'takaisin vuoden 2023 vaalien myötä. Harva maa on laskenut ja '
        + 'noussut näin nopeasti.',
    },
    keskitulo: { arvo: '22 000 $/v', sija: '48./190' },
    tervehdykset: [
      { teksti: 'Dzień dobry', kieli: 'puola', lippu: 'Flag of Poland.svg', osuus: '98 %' },
      { teksti: 'Dzyń dobry', kieli: 'sleesia', lippu: 'Flag of Upper Silesia.svg', osuus: '1,5 %' },
      { teksti: 'Guten Tag', kieli: 'saksa (Opolen seutu)', lippu: 'Flag of Germany.svg', osuus: '0,3 %' },
    ],
  },

  BIH: {
    vakiluku: '3,2 milj.',
    vakilukuSija: '132./195',
    pintaAla: '51 000 km²',
    pintaAlaSija: '126./195',
    demokratia: {
      arvo: '0,34',
      sija: '96./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~BIH',
      selitys: 'Bosnian hallinto rakennettiin vuoden 1995 rauhansopimuksessa '
        + 'kolmen kansan — bosniakkien, serbien ja kroaattien — varaan: '
        + 'maalla on kolme presidenttiä ja kaksi puoliksi itsenäistä '
        + 'osaa. Järjestelmä lopetti sodan, mutta tekee päätöksenteosta '
        + 'hidasta, ja moni virka täytetään kansallisuuden perusteella.',
    },
    keskitulo: { arvo: '8 800 $/v', sija: '79./190' },
    // Bosnia, kroatia ja serbia ovat sama kieli kolmella nimellä, ja
    // tervehdys on niissä kaikissa sama — lippu kertoo, minkä nimen alla.
    tervehdykset: [
      { teksti: 'Dobar dan', kieli: 'bosnia', lippu: 'Flag of Bosnia and Herzegovina.svg', osuus: '50 %' },
      { teksti: 'Dobar dan', kieli: 'serbia', lippu: 'Flag of Serbia.svg', osuus: '31 %' },
      { teksti: 'Dobar dan', kieli: 'kroatia', lippu: 'Flag of Croatia.svg', osuus: '15 %' },
    ],
  },

  ISL: {
    vakiluku: '390 000',
    vakilukuSija: '171./195',
    pintaAla: '103 000 km²',
    pintaAlaSija: '107./195',
    demokratia: {
      arvo: '0,72',
      sija: '25./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~ISL',
      selitys: 'Islannin parlamentti Alþingi on maailman vanhin yhä '
        + 'toimiva — perustettu vuonna 930. Vaalit ja kansalaisoikeudet '
        + 'arvioidaan erittäin vahvoiksi; V-Demin liberaali osaindeksi '
        + 'jää naapureita alemmas lähinnä siksi, että pienessä maassa '
        + 'valvontaelimet ja hallitus ovat lähellä toisiaan.',
    },
    keskitulo: { arvo: '81 000 $/v', sija: '5./190' },
    tervehdykset: [
      { teksti: 'Góðan daginn', kieli: 'islanti', lippu: 'Flag of Iceland.svg', osuus: '97 %' },
      { teksti: 'Good day', kieli: 'englanti (vieras kieli)', lippu: 'Flag of the United Kingdom.svg', osuus: '80 %' },
      { teksti: 'Dzień dobry', kieli: 'puola', lippu: 'Flag of Poland.svg', osuus: '5 %' },
    ],
  },

  // Kreikka, Kroatia ja Bulgaria (haettu 1.8.2026). Sama menetelmä kuin
  // yllä, mutta suvereenien valtioiden suodatin on nyt sama kaikissa
  // luvuissa — myös demokratiaindeksissä, jonka nimittäjä on siksi 172
  // aiempien merkintöjen 179:n sijaan. Italian luvut toistettiin
  // tarkistukseksi: väkiluku ja pinta-ala osuivat täsmälleen, demokratia
  // ±1.
  GRC: {
    vakiluku: '10 milj.',
    vakilukuSija: '93./195',
    pintaAla: '132 000 km²',
    pintaAlaSija: '96./195',
    demokratia: {
      arvo: '0,57',
      sija: '51./172',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~GRC',
      selitys: 'Demokratia keksittiin Ateenassa, mutta nykyinen luku on '
        + 'eurooppalaisittain keskitasoa. V-Demin arvio laski selvästi '
        + '2020-luvulla: syinä ovat lehdistönvapauden heikkeneminen ja '
        + 'toimittajien puhelinten vakoiluohjelmakohu. Vaalit ja '
        + 'vallanvaihdot toimivat moitteetta.',
    },
    keskitulo: { arvo: '25 400 $/v', sija: '47./190' },
    tervehdykset: [
      { teksti: 'Γεια σας', kieli: 'kreikka', lippu: 'Flag of Greece.svg', osuus: '99 %' },
      { teksti: 'Merhaba', kieli: 'turkki (Länsi-Traakia)', lippu: 'Flag of Turkey.svg', osuus: '1 %' },
    ],
  },

  HRV: {
    vakiluku: '3,9 milj.',
    vakilukuSija: '129./195',
    // Maailmanpankin "pinta-ala" on Kroatialle 88 070 km², koska siihen
    // lasketaan aluevedet. Tässä käytetään maapinta-alaa 56 594 km²,
    // ja sija on laskettu samalla luvulla.
    pintaAla: '56 600 km²',
    pintaAlaSija: '125./195',
    demokratia: {
      arvo: '0,59',
      sija: '45./172',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~HRV',
      selitys: 'Kroatia itsenäistyi 1991 ja liittyi EU:hun 2013. '
        + 'Vaalit ja tuomioistuimet toimivat, mutta V-Demin arviota '
        + 'painaa korruptio ja se, että osa mediasta on lähellä '
        + 'puolueita. Sodan jäljet näkyvät yhä politiikassa.',
    },
    keskitulo: { arvo: '25 400 $/v', sija: '46./190' },
    tervehdykset: [
      { teksti: 'Dobar dan', kieli: 'kroaatti', lippu: 'Flag of Croatia.svg', osuus: '96 %' },
      { teksti: 'Добар дан', kieli: 'serbia', lippu: 'Flag of Serbia.svg', osuus: '4 %' },
      { teksti: 'Buon giorno', kieli: 'italia (Istria)', lippu: 'Flag of Italy.svg', osuus: '1 %' },
    ],
  },

  BGR: {
    vakiluku: '6,4 milj.',
    vakilukuSija: '110./195',
    pintaAla: '111 000 km²',
    pintaAlaSija: '104./195',
    demokratia: {
      arvo: '0,50',
      sija: '66./172',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~BGR',
      selitys: 'Bulgaria on EU:n jäsen, jossa vaalit ovat vapaat mutta '
        + 'hallitukset kaatuvat tiuhaan: maassa käytiin seitsemät vaalit '
        + 'kolmessa vuodessa 2021–2024. V-Demin arviota painavat '
        + 'korruptio ja oikeuslaitoksen riippumattomuuden puutteet, '
        + 'joista EU on huomauttanut toistuvasti.',
    },
    keskitulo: { arvo: '17 800 $/v', sija: '61./190' },
    tervehdykset: [
      { teksti: 'Добър ден', kieli: 'bulgaria', lippu: 'Flag of Bulgaria.svg', osuus: '85 %' },
      { teksti: 'Merhaba', kieli: 'turkki', lippu: 'Flag of Turkey.svg', osuus: '9 %' },
      { teksti: 'Lachho dives', kieli: 'romani', lippu: 'Flag of the Romani people.svg', osuus: '4 %' },
    ],
  },
};
