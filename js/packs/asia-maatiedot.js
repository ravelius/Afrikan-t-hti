// Aasian ja Lähi-idän maiden tunnusluvut (sama rakenne kuin
// EUROPE_MAATIEDOT ja AFRICA_MAATIEDOT).
//
// Lähteet ja menetelmä:
//  - väkiluku SP.POP.TOTL, pinta-ala AG.SRF.TOTL.K2 ja keskitulo
//    NY.GNP.PCAP.CD (BKTL/asukas Atlas-menetelmällä), kaikki
//    Maailmanpankin rajapinnasta, uusin saatavilla oleva vuosi;
//  - demokratia = V-Demin liberaalin demokratian indeksi Our World in
//    Datan aineistosta.
// Sijoitus on laskettu suvereenien valtioiden kesken, ja nimittäjä on
// pyöristetty samaan tapaan kuin Euroopan tiedoissa.
//
// Jokainen tervehdyksen lippu on tarkistettu Commonsista: puuttuva
// tiedostonimi jättäisi kortin puolityhjäksi ilman virhettä.
//
// Tuotettu komennolla tools/kirjoita-maatiedot.mjs.
export const ASIA_MAATIEDOT = {
  AFG: {
    vakiluku: '44 milj.',
    vakilukuSija: '36./195',
    pintaAla: '653 000 km²',
    pintaAlaSija: '40./195',
    demokratia: {
      arvo: '0,02',
      sija: '172./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~AFG',
      selitys: 'Indeksi mittaa vaaleja, vallan rajoja ja yksilönoikeuksien suojaa. '
        + 'Talibanin palattua valtaan 2021 Afganistanissa ei ole voimassa '
        + 'olevaa perustuslakia, parlamenttia eikä vaaleja, vaan valta on '
        + 'uskonnollisella johtajalla ja hänen nimittämillään ministereillä. '
        + 'Tytöiltä on lisäksi kielletty koulunkäynti kuudennen luokan '
        + 'jälkeen ja naisilta useimmat työt, mikä painaa indeksin '
        + 'kansalaisoikeuksia mittaavia osia.',
    },
    keskitulo: {
      arvo: '390 $/v',
      sija: '189./190',
    },
    tervehdykset: [
      { teksti: 'سلام علیکم', kieli: 'dari (persia)', lippu: 'Flag of Afghanistan.svg', osuus: '78 %' },
      { teksti: 'ستړی مه شې', kieli: 'paštu', lippu: 'Flag of Afghanistan.svg', osuus: '50 %' },
      { teksti: 'Assalomu alaykum', kieli: 'uzbekki (Pohjois-Afganistan)', lippu: 'Flag of Uzbekistan.svg', osuus: '10 %' },
    ],
  },
  ARE: {
    vakiluku: '12 milj.',
    vakilukuSija: '85./195',
    pintaAla: '84 000 km²',
    pintaAlaSija: '116./195',
    demokratia: {
      arvo: '0,08',
      sija: '155./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~ARE',
      selitys: 'Arabiemiirikunnat on seitsemän emiirikunnan liitto, jota johtavat '
        + 'perinnölliset hallitsijat. Liittoneuvoston 40 jäsenestä puolet '
        + 'nimitetään ja puolet valitsee rajattu valitsijakunta, puolueita ei '
        + 'ole, ja tiedotusvälineitä koskee lupa- ja sisältösääntely. V-Dem '
        + 'mittaa juuri vaaleja, sananvapautta ja vallan rajoja, joten luku '
        + 'jää matalaksi vauraudesta huolimatta.',
    },
    keskitulo: {
      arvo: '51 550 $/v',
      sija: '23./190',
    },
    tervehdykset: [
      { teksti: 'السلام عليكم', kieli: 'arabia', lippu: 'Flag of Saudi Arabia.svg', osuus: '40 %' },
      { teksti: 'Good morning', kieli: 'englanti', lippu: 'Flag of the United Kingdom.svg', osuus: '75 %' },
      { teksti: 'नमस्ते', kieli: 'hindi', lippu: 'Flag of India.svg', osuus: '30 %' },
      { teksti: 'നമസ്കാരം', kieli: 'malajalam', lippu: 'Flag of India.svg', osuus: '10 %' },
    ],
  },
  CHN: {
    vakiluku: '1,4 mrd.',
    vakilukuSija: '2./195',
    pintaAla: '9 560 000 km²',
    pintaAlaSija: '4./195',
    demokratia: {
      arvo: '0,04',
      sija: '176./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~CHN',
      selitys: 'V-Demin mittari kysyy, valitaanko vallanpitäjät kilpailluissa '
        + 'vaaleissa ja rajaavatko tuomioistuimet, parlamentti ja media '
        + 'heidän valtaansa. Kiinassa yksi puolue nimittää johdon, '
        + 'kansankongressin edustajia ei valita monipuoluevaaleilla, ja '
        + 'tiedotusvälineet ja verkkokeskustelu ovat valtion valvonnassa — '
        + 'siksi luku on lähellä asteikon alapäätä.',
    },
    keskitulo: {
      arvo: '14 230 $/v',
      sija: '66./190',
    },
    tervehdykset: [
      { teksti: '你好', kieli: 'mandariinikiina', lippu: 'Flag of the People\'s Republic of China.svg', osuus: '80 %' },
      { teksti: '侬好', kieli: 'wu (Shanghain seutu)', lippu: 'Flag of the People\'s Republic of China.svg', osuus: '6 %' },
      { teksti: '你好', kieli: 'kantoninkiina', lippu: 'Flag of Hong Kong.svg', osuus: '5 %' },
      { teksti: 'ياخشىمۇسىز', kieli: 'uiguuri (Xinjiang)', lippu: 'Flag of the People\'s Republic of China.svg', osuus: '0,8 %' },
    ],
  },
  CYP: {
    vakiluku: '1,4 milj.',
    vakilukuSija: '153./195',
    pintaAla: '9 250 km²',
    pintaAlaSija: '162./195',
    demokratia: {
      arvo: '0,66',
      sija: '35./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~CYP',
      selitys: 'Kypros on presidenttijohtoinen tasavalta, jossa vaalit ovat '
        + 'vapaat, valta vaihtuu rauhassa ja tuomioistuimet ovat '
        + 'riippumattomia. Luku koskee vain tasavallan hallitsemaa osaa '
        + 'saarta; pohjoisosa on ollut vuodesta 1974 sen ulottumattomissa. '
        + 'V-Demin arviota painavat median omistuksen keskittyminen ja '
        + 'korruptioepäilyt, kuten kohu kansalaisuuksien myynnistä '
        + 'sijoittajille.',
    },
    keskitulo: {
      arvo: '36 110 $/v',
      sija: '33./190',
    },
    tervehdykset: [
      { teksti: 'Καλημέρα', kieli: 'kreikka', lippu: 'Flag of Greece.svg', osuus: '75 %' },
      { teksti: 'Good morning', kieli: 'englanti', lippu: 'Flag of the United Kingdom.svg', osuus: '75 %' },
    ],
  },
  IRN: {
    vakiluku: '92 milj.',
    vakilukuSija: '17./195',
    pintaAla: '1 648 000 km²',
    pintaAlaSija: '17./195',
    demokratia: {
      arvo: '0,10',
      sija: '139./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~IRN',
      selitys: 'Iranissa äänestetään säännöllisesti presidentistä ja '
        + 'parlamentista, mutta vartijain neuvosto karsii ehdokkaat ennakolta '
        + '— vuoden 2024 presidentinvaalissa hyväksyttyjä oli kuusi lähes 80 '
        + 'hakijasta. Ylintä johtajaa ei valita vaaleilla, ja hän nimittää '
        + 'tuomiolaitoksen johdon ja asevoimien komentajat. Indeksi mittaa '
        + 'juuri tätä: sitä, kuinka aitoja vaalit ovat ja rajoittavatko '
        + 'riippumattomat toimijat vallankäyttöä.',
    },
    keskitulo: {
      arvo: '4 650 $/v',
      sija: '122./190',
    },
    tervehdykset: [
      { teksti: 'سلام', kieli: 'persia (farsi)', lippu: 'Flag of Iran.svg', osuus: '80 %' },
      { teksti: 'سالام', kieli: 'azeri (Luoteis-Iran)', lippu: 'Flag of Azerbaijan.svg', osuus: '16 %' },
      { teksti: 'ڕۆژباش', kieli: 'kurdi', lippu: 'Flag of Kurdistan.svg', osuus: '10 %' },
    ],
  },
  IRQ: {
    vakiluku: '47 milj.',
    vakilukuSija: '34./195',
    pintaAla: '435 000 km²',
    pintaAlaSija: '59./195',
    demokratia: {
      arvo: '0,22',
      sija: '111./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~IRQ',
      selitys: 'Irakissa on järjestetty parlamenttivaalit säännöllisesti vuodesta '
        + '2005, ja hallitus muodostetaan niiden tuloksen mukaan. V-Demin '
        + 'arviota painavat aseelliset ryhmät, joita valtio ei täysin '
        + 'hallitse, ministerien ja virkojen jakaminen uskonto- ja '
        + 'kansallisuuskiintiöiden mukaan sekä toimittajiin ja '
        + 'mielenosoittajiin kohdistuva painostus. Kurdialueella on oma '
        + 'parlamenttinsa ja hallituksensa.',
    },
    keskitulo: {
      arvo: '5 690 $/v',
      sija: '111./190',
    },
    tervehdykset: [
      { teksti: 'السلام عليكم', kieli: 'arabia', lippu: 'Flag of Saudi Arabia.svg', osuus: '80 %' },
      { teksti: 'ڕۆژباش', kieli: 'kurdi (sorani)', lippu: 'Flag of Kurdistan.svg', osuus: '18 %' },
    ],
  },
  JOR: {
    vakiluku: '12 milj.',
    vakilukuSija: '83./195',
    pintaAla: '89 000 km²',
    pintaAlaSija: '112./195',
    demokratia: {
      arvo: '0,27',
      sija: '102./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~JOR',
      selitys: 'Jordania on kuningaskunta, jossa parlamentin alahuone valitaan '
        + 'vaaleilla, mutta kuningas nimittää hallituksen ja senaatin ja voi '
        + 'hajottaa parlamentin. V-Demin arviota laskevat lisäksi '
        + 'kyberrikoslain kaltaiset säädökset, jotka rajoittavat '
        + 'valtionjohdon arvostelua verkossa ja lehdistössä.',
    },
    keskitulo: {
      arvo: '5 260 $/v',
      sija: '116./190',
    },
    tervehdykset: [
      { teksti: 'السلام عليكم', kieli: 'arabia', lippu: 'Flag of Saudi Arabia.svg', osuus: '98 %' },
      { teksti: 'Good morning', kieli: 'englanti', lippu: 'Flag of the United Kingdom.svg', osuus: '30 %' },
    ],
  },
  JPN: {
    vakiluku: '123 milj.',
    vakilukuSija: '12./195',
    pintaAla: '378 000 km²',
    pintaAlaSija: '62./195',
    demokratia: {
      arvo: '0,73',
      sija: '24./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~JPN',
      selitys: 'Japanissa vaalit ovat vapaat, tuomioistuimet riippumattomia ja '
        + 'kansalaisoikeudet vahvat. Kärkimaiden alle luku jää siitä, että '
        + 'sama puolue on ollut vallassa lähes yhtäjaksoisesti vuodesta 1955 '
        + 'ja että toimittajien pääsy tietolähteisiin kulkee ministeriöiden '
        + 'ylläpitämien lehdistöklubien kautta, mikä kaventaa median '
        + 'moniäänisyyttä.',
    },
    keskitulo: {
      arvo: '38 340 $/v',
      sija: '29./190',
    },
    tervehdykset: [
      { teksti: 'こんにちは', kieli: 'japani', lippu: 'Flag of Japan.svg', osuus: '99 %' },
      { teksti: 'はいさい', kieli: 'okinawa (uchinaaguchi)', lippu: 'Flag of Okinawa Prefecture.svg', osuus: '1 %' },
      { teksti: 'イランカラプテ', kieli: 'ainu', lippu: 'Ainu flag.svg', osuus: '0,01 %' },
    ],
  },
  KAZ: {
    vakiluku: '21 milj.',
    vakilukuSija: '64./195',
    pintaAla: '2 720 000 km²',
    pintaAlaSija: '9./195',
    demokratia: {
      arvo: '0,13',
      sija: '134./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~KAZ',
      selitys: 'Kazakstanissa on presidentti ja parlamentti, mutta vaaleissa ei '
        + 'ole ollut todellista kilpailua: ensimmäinen presidentti johti '
        + 'maata 1990–2019, ja hänen seuraajansa valittiin 2022 yli 80 '
        + 'prosentin äänisaaliilla. V-Demin arviota laskevat myös puolueiden '
        + 'ja kansalaisjärjestöjen rekisteröinnin esteet sekä '
        + 'mielenosoitusten ja tiedotusvälineiden valvonta.',
    },
    keskitulo: {
      arvo: '13 740 $/v',
      sija: '69./190',
    },
    tervehdykset: [
      { teksti: 'Сәлеметсіз бе', kieli: 'kazakki', lippu: 'Flag of Kazakhstan.svg', osuus: '80 %' },
      { teksti: 'Здравствуйте', kieli: 'venäjä', lippu: 'Flag of Russia.svg', osuus: '85 %' },
      { teksti: 'Assalomu alaykum', kieli: 'uzbekki', lippu: 'Flag of Uzbekistan.svg', osuus: '3 %' },
    ],
  },
  KOR: {
    vakiluku: '52 milj.',
    vakilukuSija: '29./195',
    pintaAla: '100 000 km²',
    pintaAlaSija: '108./195',
    demokratia: {
      arvo: '0,74',
      sija: '22./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~KOR',
      selitys: 'Etelä-Korea oli sotilashallinnon alainen vuoteen 1987, ja '
        + 'demokratia on sen jälkeen vakiintunut: vaalit ovat vapaat ja valta '
        + 'on vaihtunut puolueelta toiselle useaan kertaan. V-Demin arviota '
        + 'painavat kunnianloukkauslait, joiden nojalla syyte on mahdollinen '
        + 'myös tosista väitteistä, sekä joulukuun 2024 poikkeustilajulistus, '
        + 'jonka parlamentti kumosi muutamassa tunnissa.',
    },
    keskitulo: {
      arvo: '37 880 $/v',
      sija: '30./190',
    },
    tervehdykset: [
      { teksti: '안녕하세요', kieli: 'korea', lippu: 'Flag of South Korea.svg', osuus: '100 %' },
      { teksti: 'Good day', kieli: 'englanti (vieras kieli)', lippu: 'Flag of the United Kingdom.svg', osuus: '50 %' },
      { teksti: '혼저옵서예', kieli: 'jejun kieli (tervetuloa)', lippu: 'Flag of Jeju Province.svg', osuus: '0,01 %' },
    ],
  },
  KWT: {
    vakiluku: '4,9 milj.',
    vakilukuSija: '126./195',
    pintaAla: '17 800 km²',
    pintaAlaSija: '152./195',
    demokratia: {
      arvo: '0,13',
      sija: '129./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~KWT',
      selitys: 'Kuwaitissa on Persianlahden vanhin vaaleilla valittu parlamentti, '
        + 'joka on aikanaan kaatanut hallituksia ja kuulustellut '
        + 'ministereitä. Emiiri kuitenkin nimittää hallituksen, puolueita ei '
        + 'ole sallittu, ja toukokuussa 2024 emiiri hajotti parlamentin ja '
        + 'keskeytti osan perustuslain pykälistä neljäksi vuodeksi. V-Demin '
        + 'luku laski juuri tämän jälkeen.',
    },
    keskitulo: {
      arvo: '41 110 $/v',
      sija: '28./190',
    },
    tervehdykset: [
      { teksti: 'السلام عليكم', kieli: 'arabia', lippu: 'Flag of Saudi Arabia.svg', osuus: '60 %' },
      { teksti: 'Good morning', kieli: 'englanti', lippu: 'Flag of the United Kingdom.svg', osuus: '55 %' },
      { teksti: 'नमस्ते', kieli: 'hindi', lippu: 'Flag of India.svg', osuus: '20 %' },
      { teksti: 'Magandang araw', kieli: 'tagalog', lippu: 'Flag of the Philippines.svg', osuus: '5 %' },
    ],
  },
  MNG: {
    vakiluku: '3,6 milj.',
    vakilukuSija: '131./195',
    pintaAla: '1 560 000 km²',
    pintaAlaSija: '18./195',
    demokratia: {
      arvo: '0,42',
      sija: '79./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~MNG',
      selitys: 'Mongolia siirtyi yksipuoluevallasta monipuoluejärjestelmään vuonna '
        + '1990, ja valta on sen jälkeen vaihtunut vaaleilla toistuvasti. '
        + 'Lukua painavat korruptio, toimittajia vastaan nostetut '
        + 'kunnianloukkausjutut ja se, että kaksi suurta puoluetta jakavat '
        + 'keskenään virat ja suuren osan tiedotusvälineistä.',
    },
    keskitulo: {
      arvo: '6 210 $/v',
      sija: '107./190',
    },
    tervehdykset: [
      { teksti: 'Сайн байна уу', kieli: 'mongoli', lippu: 'Flag of Mongolia.svg', osuus: '95 %' },
      { teksti: 'Сәлеметсіз бе', kieli: 'kazakki (Bajan-Ölgii)', lippu: 'Flag of Kazakhstan.svg', osuus: '4 %' },
    ],
  },
  OMN: {
    vakiluku: '5,5 milj.',
    vakilukuSija: '119./195',
    pintaAla: '310 000 km²',
    pintaAlaSija: '70./195',
    demokratia: {
      arvo: '0,14',
      sija: '125./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~OMN',
      selitys: 'Omania johtaa sulttaani, joka säätää lait asetuksilla ja nimittää '
        + 'hallituksen. Neuvoa-antavan shuura-neuvoston jäsenet valitaan '
        + 'vaaleilla, mutta neuvoston valta on rajattu, eikä puolueita ole. '
        + 'V-Dem mittaa vaalien merkitystä ja vallan rajoja, joten luku jää '
        + 'matalaksi, vaikka arki on rauhallista ja hallinto vakaata.',
    },
    keskitulo: {
      arvo: '19 520 $/v',
      sija: '56./190',
    },
    tervehdykset: [
      { teksti: 'السلام عليكم', kieli: 'arabia', lippu: 'Flag of Saudi Arabia.svg', osuus: '75 %' },
      { teksti: 'Good morning', kieli: 'englanti', lippu: 'Flag of the United Kingdom.svg', osuus: '40 %' },
      { teksti: 'नमस्ते', kieli: 'hindi', lippu: 'Flag of India.svg', osuus: '20 %' },
      { teksti: 'Jambo', kieli: 'swahili (Sansibarin perua)', lippu: 'Flag of Tanzania.svg', osuus: '3 %' },
    ],
  },
  PAK: {
    vakiluku: '255 milj.',
    vakilukuSija: '5./195',
    pintaAla: '796 000 km²',
    pintaAlaSija: '35./195',
    demokratia: {
      arvo: '0,18',
      sija: '115./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~PAK',
      selitys: 'Pakistanissa järjestetään vaaleja ja valta on vaihtunut niiden '
        + 'myötä, mutta armeijalla on vahva asema politiikassa: yksikään '
        + 'pääministeri ei ole istunut täyttä viisivuotiskautta. Vuoden 2024 '
        + 'vaaleissa eniten paikkoja saaneen puolueen ehdokkaat joutuivat '
        + 'asettumaan sitoutumattomina, koska puolueelta oli evätty sen '
        + 'vaalimerkki. Vaalien lisäksi indeksi mittaa tuomioistuinten '
        + 'riippumattomuutta ja sananvapautta, joita mediaa koskevat '
        + 'säädökset rajoittavat.',
    },
    keskitulo: {
      arvo: '1 500 $/v',
      sija: '163./190',
    },
    tervehdykset: [
      { teksti: 'السلام علیکم', kieli: 'urdu (yleiskieli)', lippu: 'Flag of Pakistan.svg', osuus: '77 %' },
      { teksti: 'سلام', kieli: 'pandžabi', lippu: 'Flag of Punjab.svg', osuus: '39 %' },
      { teksti: 'ستړی مه شې', kieli: 'paštu', lippu: 'Flag of Khyber Pakhtunkhwa.svg', osuus: '18 %' },
      { teksti: 'السلام عليڪم', kieli: 'sindhi', lippu: 'Flag of Sindh.svg', osuus: '15 %' },
    ],
  },
  PHL: {
    vakiluku: '117 milj.',
    vakilukuSija: '14./195',
    pintaAla: '300 000 km²',
    pintaAlaSija: '72./195',
    demokratia: {
      arvo: '0,29',
      sija: '105./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~PHL',
      selitys: 'Filippiineillä vaaleja pidetään säännöllisesti ja äänestysvilkkaus '
        + 'on korkea, mutta V-Dem mittaa myös vaalien välistä aikaa. Lukua '
        + 'painavat vuosien 2016–2022 huumesodan tuhannet tuomioistuinten '
        + 'ulkopuoliset surmat, toimittajia ja arvostelijoita vastaan '
        + 'nostetut oikeusjutut sekä se, että politiikka on keskittynyt '
        + 'muutamille suvuille.',
    },
    keskitulo: {
      arvo: '4 850 $/v',
      sija: '119./190',
    },
    tervehdykset: [
      { teksti: 'Magandang araw', kieli: 'filipino (tagalog)', lippu: 'Flag of the Philippines.svg', osuus: '95 %' },
      { teksti: 'Good day', kieli: 'englanti (virallinen kieli)', lippu: 'Flag of the United Kingdom.svg', osuus: '60 %' },
      { teksti: 'Maayong adlaw', kieli: 'cebuano', lippu: 'Flag of Cebu Province.svg', osuus: '25 %' },
      { teksti: 'Naimbag nga aldaw', kieli: 'ilokano', lippu: 'Flag of the Philippines.svg', osuus: '9 %' },
    ],
  },
  QAT: {
    vakiluku: '3,0 milj.',
    vakilukuSija: '136./195',
    pintaAla: '11 500 km²',
    pintaAlaSija: '158./195',
    demokratia: {
      arvo: '0,09',
      sija: '151./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~QAT',
      selitys: 'Qatar on emiirikunta, jossa emiiri nimittää hallituksen. '
        + 'Shuura-neuvoston 45 paikasta 30 valittiin ensi kerran vaaleilla '
        + 'vuonna 2021, mutta marraskuun 2024 kansanäänestyksen jälkeen '
        + 'neuvosto nimitetään taas kokonaan. Puolueita ei ole, ja lehdistöä '
        + 'koskevat rajoitukset painavat V-Demin arviota lisää.',
    },
    keskitulo: {
      arvo: '74 330 $/v',
      sija: '10./190',
    },
    tervehdykset: [
      { teksti: 'السلام عليكم', kieli: 'arabia', lippu: 'Flag of Saudi Arabia.svg', osuus: '40 %' },
      { teksti: 'Good morning', kieli: 'englanti', lippu: 'Flag of the United Kingdom.svg', osuus: '80 %' },
      { teksti: 'नमस्ते', kieli: 'hindi', lippu: 'Flag of India.svg', osuus: '25 %' },
      { teksti: 'नमस्कार', kieli: 'nepali', lippu: 'Flag of Nepal.svg', osuus: '12 %' },
    ],
  },
  SAU: {
    vakiluku: '37 milj.',
    vakilukuSija: '43./195',
    pintaAla: '2 150 000 km²',
    pintaAlaSija: '12./195',
    demokratia: {
      arvo: '0,05',
      sija: '163./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~SAU',
      selitys: 'Indeksi mittaa vaalien vapautta, tuomioistuinten riippumattomuutta '
        + 'ja yksilönoikeuksien suojaa. Saudi-Arabia on perinnöllinen '
        + 'kuningaskunta, jossa ei ole valtakunnallisia vaaleja eikä '
        + 'puolueita: kuningas nimittää ministerit ja neuvoa-antavan '
        + 'shuura-neuvoston jäsenet. Öljytuloilla rahoitettuja '
        + 'yhteiskunnallisia uudistuksia on tehty 2010-luvulta lähtien, mutta '
        + 'ne eivät kosketa niitä asioita, joita tämä mittari katsoo.',
    },
    keskitulo: {
      arvo: '36 070 $/v',
      sija: '34./190',
    },
    tervehdykset: [
      { teksti: 'السلام عليكم', kieli: 'arabia', lippu: 'Flag of Saudi Arabia.svg', osuus: '95 %' },
      { teksti: 'আসসালামু আলাইকুম', kieli: 'bengali (siirtotyöläiset)', lippu: 'Flag of Bangladesh.svg', osuus: '7 %' },
      { teksti: 'السلام علیکم', kieli: 'urdu (siirtotyöläiset)', lippu: 'Flag of Pakistan.svg', osuus: '6 %' },
      { teksti: 'Magandang araw', kieli: 'tagalog (siirtotyöläiset)', lippu: 'Flag of the Philippines.svg', osuus: '2 %' },
    ],
  },
  SYR: {
    vakiluku: '26 milj.',
    vakilukuSija: '57./195',
    pintaAla: '185 000 km²',
    pintaAlaSija: '87./195',
    demokratia: {
      arvo: '0,05',
      sija: '159./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~SYR',
      selitys: 'Mittari katsoo vaaleja, vallan jakautumista ja kansalaisoikeuksien '
        + 'suojaa. Syyriassa Assadin perheen viisi vuosikymmentä kestänyt '
        + 'valta päättyi joulukuussa 2024, ja maata on sen jälkeen johtanut '
        + 'siirtymäkauden hallinto. Lokakuussa 2025 koottiin uusi '
        + 'parlamentti, mutta ei suorilla vaaleilla: osan valitsivat '
        + 'valitsijakokoukset ja osan nimitti presidentti, joten vuoden 2025 '
        + 'luku kuvaa yhä välivaihetta.',
    },
    keskitulo: {
      arvo: '720 $/v',
      sija: '185./190',
    },
    tervehdykset: [
      { teksti: 'السلام عليكم', kieli: 'arabia', lippu: 'Flag of Syria.svg', osuus: '90 %' },
      { teksti: 'Rojbaş', kieli: 'kurdi (Koillis-Syyria)', lippu: 'Flag of Kurdistan.svg', osuus: '9 %' },
      { teksti: 'ܫܠܡܐ', kieli: 'aramea (syyriankristityt)', lippu: 'Flag of Assyria.svg', osuus: '1 %' },
    ],
  },
  TWN: {
    vakiluku: '23 milj.',
    vakilukuSija: '60./195',
    pintaAla: '36 200 km²',
    pintaAlaSija: '134./195',
    demokratia: {
      arvo: '0,70',
      sija: '29./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~TWN',
      selitys: 'Taiwan siirtyi sotatilalain alta monipuoluejärjestelmään vuosina '
        + '1987–1996, ja sen jälkeen presidentti on vaihtunut vaaleilla '
        + 'useaan otteeseen. Vaalien ja kansalaisoikeuksien osalta Taiwan on '
        + 'V-Demin mittauksessa Aasian kärjessä; kokonaisluku jää '
        + 'Pohjois-Euroopan tason alle liberaalissa osaindeksissä eli siinä, '
        + 'kuinka tiukasti tuomioistuimet ja parlamentti rajaavat '
        + 'toimeenpanovaltaa.',
    },
    keskitulo: {
      arvo: '35 200 $/v',
      sija: '36./190',
    },
    tervehdykset: [
      { teksti: '你好', kieli: 'mandariinikiina', lippu: 'Flag of the Republic of China.svg', osuus: '95 %' },
      { teksti: 'Lí-hó', kieli: 'taiwanin hokkien (pe̍h-ōe-jī)', lippu: 'Flag of the Republic of China.svg', osuus: '70 %' },
      { teksti: 'Ngì-hó', kieli: 'hakka', lippu: 'Flag of the Republic of China.svg', osuus: '6 %' },
      { teksti: 'Nga\'ay ho', kieli: 'amis (alkuperäiskansan kieli)', lippu: 'Flag of the Republic of China.svg', osuus: '0,9 %' },
    ],
  },
  UZB: {
    vakiluku: '37 milj.',
    vakilukuSija: '42./195',
    pintaAla: '449 000 km²',
    pintaAlaSija: '57./195',
    demokratia: {
      arvo: '0,08',
      sija: '151./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~UZB',
      selitys: 'Uzbekistania johti itsenäistymisestä 2016 asti yksi ja sama '
        + 'presidentti, ja vallanvaihdon jälkeen moni asia on muuttunut: '
        + 'pakkotyö puuvillapelloilla lopetettiin ja maasta poistumiseen '
        + 'vaadittu viisumi poistui. Poliittinen kilpailu on silti vähäistä, '
        + 'sillä kaikki rekisteröidyt puolueet tukevat presidenttiä eikä '
        + 'oppositiopuolueita ole hyväksytty vaaleihin. Indeksi mittaa juuri '
        + 'vaalien aitoutta ja vallan rajoja, joten tehdyt uudistukset '
        + 'näkyvät siinä vain hitaasti.',
    },
    keskitulo: {
      arvo: '3 670 $/v',
      sija: '134./190',
    },
    tervehdykset: [
      { teksti: 'Assalomu alaykum', kieli: 'uzbekki', lippu: 'Flag of Uzbekistan.svg', osuus: '85 %' },
      { teksti: 'Здравствуйте', kieli: 'venäjä', lippu: 'Flag of Russia.svg', osuus: '14 %' },
      { teksti: 'Салом', kieli: 'tadžikki', lippu: 'Flag of Tajikistan.svg', osuus: '5 %' },
      { teksti: 'Ássalawma áleykum', kieli: 'karakalpakki (Karakalpakia)', lippu: 'Flag of Karakalpakstan.svg', osuus: '2 %' },
    ],
  },
  YEM: {
    vakiluku: '42 milj.',
    vakilukuSija: '37./195',
    pintaAla: '528 000 km²',
    pintaAlaSija: '51./195',
    demokratia: {
      arvo: '0,04',
      sija: '165./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~YEM',
      selitys: 'Indeksi arvioi vaaleja, oikeuslaitoksen riippumattomuutta ja '
        + 'kansalaisoikeuksia. Jemenissä on käyty sotaa vuodesta 2014, ja maa '
        + 'on jakautunut kahtia: pohjoista hallitsee huthiliike Sanaasta ja '
        + 'etelää kansainvälisesti tunnustettu hallitus. Viimeiset '
        + 'presidentinvaalit pidettiin 2012 ja parlamenttivaalit 2003, joten '
        + 'vaaleja koskevat osat indeksistä jäävät lähes nollaan.',
    },
    keskitulo: {
      arvo: '740 $/v',
      sija: '183./190',
    },
    tervehdykset: [
      { teksti: 'السلام عليكم', kieli: 'arabia', lippu: 'Flag of Yemen.svg', osuus: '100 %' },
    ],
  },
};
