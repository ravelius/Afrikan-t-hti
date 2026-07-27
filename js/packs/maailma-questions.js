// Maailma-laudan tietovisakysymykset: mantereet, valtameret ja suuret
// kaupungit. `general` toimii varapakkana.
//
// Muoto: { q, options[4], correct, fact, hint, level? } — ks. CONTRIBUTING.md.

export const MAAILMA_QUESTIONS = {
  kairo: [
    {
      q: 'Millä mantereella Kairo sijaitsee?',
      options: ['Afrikassa', 'Aasiassa', 'Euroopassa', 'Etelä-Amerikassa'],
      correct: 0,
      level: 1,
      fact: 'Kairo on Afrikan suurimpia kaupunkeja Niilin varrella.',
      hint: 'Sama manner kuin Saharalla ja Kilimandžarolla.',
    },
    {
      q: 'Minkä kahden mantereen rajalla Egypti sijaitsee?',
      options: ['Afrikan ja Aasian', 'Afrikan ja Euroopan', 'Aasian ja Euroopan', 'Afrikan ja Etelä-Amerikan'],
      correct: 0,
      level: 3,
      fact: 'Siinain niemimaa on Aasiaa, muu Egypti Afrikkaa — Suezin kanava kulkee rajalla.',
      hint: 'Siinain niemimaa on rajan toisella puolella.',
    },
    {
      q: 'Mikä joki tekee Egyptin autiomaasta asuttavan?',
      options: ['Niili', 'Kongo', 'Tigris', 'Amazon'],
      correct: 0,
      level: 1,
      fact: 'Lähes kaikki egyptiläiset asuvat Niilin laakson ja suiston vihreällä kaistaleella.',
      hint: 'Maailman pisimpiä jokia — virtaa etelästä pohjoiseen.',
    },
  ],

  rio: [
    {
      q: 'Millä mantereella Rio de Janeiro on?',
      options: ['Etelä-Amerikassa', 'Pohjois-Amerikassa', 'Afrikassa', 'Australiassa'],
      correct: 0,
      level: 1,
      fact: 'Rio on Brasilian tunnetuin kaupunki Etelä-Amerikan itärannikolla.',
      hint: 'Mantereen halki virtaa Amazon.',
    },
    {
      q: 'Mikä kuuluisa patsas seisoo vuorella Rion yllä?',
      options: ['Kristus-patsas', 'Vapaudenpatsas', 'Pieni merenneito', 'Sfinksi'],
      correct: 0,
      fact: 'Corcovado-vuoren 38-metrinen patsas levittää kätensä koko kaupungin ylle.',
      hint: 'Patsas levittää kätensä kaupungin ylle.',
    },
    {
      q: 'Mitä kieltä Brasiliassa puhutaan?',
      options: ['portugalia', 'espanjaa', 'ranskaa', 'brasiliaa'],
      correct: 0,
      level: 3,
      fact: 'Brasilia oli Portugalin siirtomaa — muissa Etelä-Amerikan maissa puhutaan enimmäkseen espanjaa.',
      hint: 'Sama kieli kuin Lissabonissa.',
    },
  ],

  mumbai: [
    {
      q: 'Missä maassa Mumbai sijaitsee?',
      options: ['Intiassa', 'Kiinassa', 'Egyptissä', 'Indonesiassa'],
      correct: 0,
      level: 1,
      fact: 'Mumbai on Intian suurin kaupunki ja maan talouden sydän.',
      hint: 'Maan lipussa on oranssia, valkoista ja vihreää.',
    },
    {
      q: 'Mikä valtameri lainehtii Mumbain edustalla?',
      options: ['Intian valtameri', 'Atlantti', 'Tyynimeri', 'Jäämeri'],
      correct: 0,
      level: 1,
      fact: 'Monsuunituulet puhaltavat mereltä ja tuovat Mumbain rankkasateet.',
      hint: 'Valtameri on saanut nimensä samalta maalta kuin kaupunki.',
    },
    {
      q: 'Millä nimellä Mumbain elokuvateollisuus tunnetaan?',
      options: ['Bollywood', 'Hollywood', 'Nollywood', 'Mollywood'],
      correct: 0,
      level: 3,
      fact: 'Intiassa tehdään enemmän elokuvia kuin missään muussa maassa — laulua ja tanssia riittää.',
      hint: 'Nimi on väännös kaupungin vanhasta nimestä ja kuuluisasta elokuvakaupungista.',
    },
  ],

  peking: [
    {
      q: 'Minkä maan pääkaupunki Peking on?',
      options: ['Kiina', 'Japani', 'Etelä-Korea', 'Thaimaa'],
      correct: 0,
      level: 1,
      fact: 'Peking on ollut Kiinan keisarien ja tasavallan pääkaupunki vuosisatoja.',
      hint: 'Maa on väkiluvultaan maailman suurimpia.',
    },
    {
      q: 'Mikä valtava rakennelma kiemurtelee Pekingin pohjoispuolen vuorilla?',
      options: ['Kiinan muuri', 'Eiffel-torni', 'Suuri kanava', 'Pyramidi'],
      correct: 0,
      level: 1,
      fact: 'Muuria rakennettiin yli kaksituhatta vuotta suojaksi pohjoisen ratsukansoja vastaan.',
      hint: 'Sitä rakennettiin suojaksi pohjoisen ratsukansoja vastaan.',
    },
    {
      q: 'Kuinka moni puhuu kiinaa äidinkielenään?',
      options: ['noin miljardi', 'noin miljoona', 'noin sata miljoonaa', 'noin kymmenen miljoonaa'],
      correct: 0,
      level: 3,
      fact: 'Mandariinikiina on maailman puhutuin äidinkieli.',
      hint: 'Enemmän kuin millään muulla kielellä maailmassa.',
    },
  ],

  sydney: [
    {
      q: 'Millä mantereella Sydney sijaitsee?',
      options: ['Australiassa', 'Aasiassa', 'Afrikassa', 'Etelä-Amerikassa'],
      correct: 0,
      level: 1,
      fact: 'Australia on kokonainen manner ja valtio samassa paketissa.',
      hint: 'Pienin manner, joka on samalla yksi valtio.',
    },
    {
      q: 'Mikä kuuluisa rakennus seisoo Sydneyn satamassa?',
      options: ['oopperatalo', 'kuninkaanlinna', 'pyramidi', 'televisiotorni'],
      correct: 0,
      fact: 'Purjeita muistuttava Sydneyn oopperatalo on Australian tunnetuin rakennus.',
      hint: 'Sen valkoiset katot muistuttavat purjeita.',
    },
    {
      q: 'Mikä eläin loikkii luonnonvaraisena vain Australiassa?',
      options: ['kenguru', 'kirahvi', 'jääkarhu', 'laama'],
      correct: 0,
      level: 1,
      fact: 'Kenguruja on Australiassa enemmän kuin ihmisiä — poikanen kasvaa emon pussissa.',
      hint: 'Poikanen kasvaa emonsa pussissa.',
    },
  ],

  moskova: [
    {
      q: 'Minkä maan pääkaupunki Moskova on?',
      options: ['Venäjä', 'Ukraina', 'Puola', 'Kazakstan'],
      correct: 0,
      level: 1,
      fact: 'Venäjä on maailman laajin valtio — se ulottuu Itämereltä Tyynellemerelle.',
      hint: 'Maa on pinta-alaltaan maailman suurin.',
    },
    {
      q: 'Mikä on maailman pisin rautatie, jonka itään lähtevä matka alkaa Moskovasta?',
      options: ['Siperian rata', 'Idän pikajuna', 'Kultainen rata', 'Aurinkorata'],
      correct: 0,
      level: 3,
      fact: 'Siperian rata kulkee yli 9 000 kilometriä Moskovasta Vladivostokiin — matka kestää viikon.',
      hint: 'Junamatka Tyynellemerelle kestää kokonaisen viikon.',
    },
    {
      q: 'Mikä värikäs, sipulikupolinen kirkko seisoo Moskovan Punaisella torilla?',
      options: ['Vasilin katedraali', 'Notre Dame', 'Hagia Sofia', 'Temppeliaukion kirkko'],
      correct: 0,
      level: 3,
      fact: 'Vasilin katedraalin kirjavat sipulikupolit ovat kuin satukirjasta — kirkko valmistui 1561.',
      hint: 'Kupolit näyttävät värikkäiltä sipuleilta.',
    },
  ],

  tokio: [
    {
      q: 'Mikä Tokion seudusta tekee erityisen maailman kaupunkien joukossa?',
      options: [
        'se on maailman väkirikkain kaupunkiseutu',
        'se on maailman vanhin kaupunki',
        'se on maailman korkeimmalla sijaitseva pääkaupunki',
        'se on maailman eteläisin pääkaupunki',
      ],
      correct: 0,
      level: 1,
      fact: 'Tokion suurkaupunkialueella asuu lähes 40 miljoonaa ihmistä — enemmän kuin monessa valtiossa.',
      hint: 'Asia liittyy asukkaisiin.',
    },
    {
      q: 'Millä nimellä tunnetaan Japanin huippunopeat junat?',
      options: ['shinkansen', 'maglev-metro', 'samurai express', 'fuji-juna'],
      correct: 0,
      fact: 'Luotijunat ovat kulkeneet vuodesta 1964, ja niiden keskimyöhästyminen lasketaan sekunneissa.',
      hint: 'Nimi on japania ja tarkoittaa uutta runkolinjaa.',
    },
    {
      q: 'Mikä pyhänä pidetty vuori näkyy kirkkaalla säällä Tokioon?',
      options: ['Fuji', 'Aso', 'Tateyama', 'Ontake'],
      correct: 0,
      level: 3,
      fact: 'Fuji (3 776 m) on Japanin korkein vuori ja tulivuori, jonka huipulle vaeltaa kesäisin satojatuhansia.',
      hint: 'Vuori on kuvattu lukemattomiin puupiirroksiin.',
    },
  ],

  singapore: [
    {
      q: 'Mikä Singapore on?',
      options: [
        'saarella sijaitseva kaupunkivaltio',
        'Kiinan maakunta',
        'Intian pääkaupunki',
        'Australian osavaltio',
      ],
      correct: 0,
      level: 1,
      fact: 'Singapore on yksi maailman harvoista kaupunkivaltioista — koko maa on yhtä kaupunkia saarella.',
      hint: 'Koko maa mahtuu yhden kaupungin rajoihin.',
    },
    {
      q: 'Miksi Singaporen satama on maailmankaupalle tärkeä?',
      options: [
        'se vartioi Malakansalmen laivareittiä',
        'sieltä viedään maailman öljy',
        'se on ainoa satama Aasiassa',
        'sinne pääsee vain purjelaivalla',
      ],
      correct: 0,
      level: 3,
      fact: 'Merkittävä osa maailman konttiliikenteestä kulkee Malakansalmen kautta, ja Singapore on sen portti.',
      hint: 'Kapea salmi yhdistää kaksi valtamerta.',
    },
  ],

  kapkaupunki: [
    {
      q: 'Minkä muotoinen vuori kohoaa Kapkaupungin ylle?',
      options: ['pöytämäisen tasainen', 'teräväkärkinen', 'kaksihuippuinen', 'täysin pyöreä'],
      correct: 0,
      level: 1,
      fact: 'Pöytävuoren tasainen laki on yli kilometrin korkeudella, ja pilviverhoa kutsutaan pöytäliinaksi.',
      hint: 'Vuoren nimi kertoo saman kuin sen muoto.',
    },
    {
      q: 'Mitkä kaksi valtamerta kohtaavat Etelä-Afrikan kärjessä?',
      options: [
        'Atlantti ja Intian valtameri',
        'Atlantti ja Tyynimeri',
        'Intian valtameri ja Tyynimeri',
        'Atlantti ja Jäämeri',
      ],
      correct: 0,
      fact: 'Virallinen rajapiste on Kap Agulhas, Afrikan eteläisin kärki, hieman Hyväntoivonniemestä itään.',
      hint: 'Toinen niistä on Afrikan länsipuolella, toinen itäpuolella.',
    },
    {
      q: 'Mikä historian jakso päättyi Etelä-Afrikassa vuonna 1994?',
      options: ['apartheid eli rotuerottelu', 'siirtomaakausi', 'kultaryntäys', 'sisällissota'],
      correct: 0,
      level: 3,
      fact: 'Ensimmäisissä vapaissa vaaleissa 1994 presidentiksi valittiin Nelson Mandela, joka oli istunut vankilassa 27 vuotta.',
      hint: 'Sana on afrikaansia ja tarkoittaa erillisyyttä.',
    },
  ],

  losangeles: [
    {
      q: 'Mistä Los Angeles tunnetaan erityisesti?',
      options: ['elokuvateollisuudesta', 'autotehtaista', 'öljynporauksesta', 'kalastuksesta'],
      correct: 0,
      level: 1,
      fact: 'Hollywoodin kukkuloilla tehdään elokuvia yli sadan vuoden perinteellä — kyltti pystytettiin 1923.',
      hint: 'Kaupunginosan valkoiset kirjaimet näkyvät kauas.',
    },
    {
      q: 'Mikä kuvaa Los Angelesin kaupunkirakennetta?',
      options: [
        'kaupunki on levinnyt satojen kilometrien matkalle',
        'kaupunki on rakennettu veden alle',
        'kaupungissa ei ole yhtään autoa',
        'kaupunki on yhä pieni kalastajakylä',
      ],
      correct: 0,
      fact: 'Los Angelesin seutu on kasvanut moottoriteiden varsille niin laajaksi, että sitä kutsutaan sadan lähiön kaupungiksi.',
      hint: 'Autoilu muovasi kaupungin muodon.',
    },
    {
      q: 'Mikä mannerlaattojen raja tekee Kaliforniasta maanjäristysaluetta?',
      options: [
        'San Andreasin siirros',
        'Atlantin keskiselänne',
        'Mariaanien hauta',
        'Alppien poimuvuoristo',
      ],
      correct: 0,
      level: 3,
      fact: 'San Andreasin siirroksessa Tyynenmeren laatta liukuu Pohjois-Amerikan laattaa vasten noin 5 cm vuodessa.',
      hint: 'Kahden mannerlaatan raja kulkee osavaltion halki.',
    },
  ],

  general: [
    {
      q: 'Kuinka monta mannerta maapallolla yleensä lasketaan olevan?',
      options: ['seitsemän', 'viisi', 'kuusi', 'yhdeksän'],
      correct: 0,
      level: 3,
      fact: 'Suomalaisessa opetuksessa mantereet lasketaan yleensä seitsemäksi: Eurooppa, Aasia, Afrikka, Pohjois- ja Etelä-Amerikka, Australia ja Etelämanner.',
      hint: 'Sama määrä kuin viikonpäiviä.',
    },
    {
      q: 'Mikä on maailman suurin valtameri?',
      options: ['Tyynimeri', 'Atlantti', 'Intian valtameri', 'Jäämeri'],
      correct: 0,
      level: 1,
      fact: 'Tyynimeri peittää kolmanneksen koko maapallon pinnasta.',
      hint: 'Se peittää kolmanneksen koko maapallosta.',
    },
    {
      q: 'Mikä on maailman suurin manner?',
      options: ['Aasia', 'Afrikka', 'Eurooppa', 'Pohjois-Amerikka'],
      correct: 0,
      level: 1,
      fact: 'Aasiassa on myös eniten asukkaita — yli puolet koko ihmiskunnasta.',
      hint: 'Siellä sijaitsevat sekä Kiina että Intia.',
    },
    {
      q: 'Kuinka suuri osa maapallon pinnasta on vettä?',
      options: ['noin 70 %', 'noin 30 %', 'noin 50 %', 'noin 90 %'],
      correct: 0,
      level: 3,
      fact: 'Siksi Maata kutsutaan siniseksi planeetaksi.',
      hint: 'Avaruudesta Maa näyttää siniseltä planeetalta.',
    },
    {
      q: 'Mikä on maailman väkirikkain maa?',
      options: ['Intia', 'Kiina', 'Yhdysvallat', 'Indonesia'],
      correct: 0,
      level: 3,
      fact: 'Intia ohitti Kiinan väkiluvussa 2020-luvulla — molemmissa on yli 1,4 miljardia asukasta.',
      hint: 'Kärkipaikka vaihtui 2020-luvulla.',
    },
    {
      q: 'Mikä on maailman pisin vuoristo?',
      options: ['Andit', 'Alpit', 'Himalaja', 'Kalliovuoret'],
      correct: 0,
      level: 3,
      fact: 'Andit kulkevat yli 7 000 kilometriä pitkin Etelä-Amerikan länsireunaa.',
      hint: 'Se kulkee pitkin Etelä-Amerikan länsireunaa.',
    },
    {
      q: 'Millä mantereella ei ole yhtään pysyvää asukasta?',
      options: ['Etelämantereella', 'Australiassa', 'Afrikassa', 'Etelä-Amerikassa'],
      correct: 0,
      level: 1,
      fact: 'Etelämantereella asuu vain tutkimusasemien väkeä — ja miljoonia pingviinejä.',
      hint: 'Siellä asuu enemmän pingviinejä kuin ihmisiä.',
    },
    {
      q: 'Mikä viiva jakaa maapallon pohjoiseen ja eteläiseen puoliskoon?',
      options: ['päiväntasaaja', 'nollameridiaani', 'napapiiri', 'horisontti'],
      correct: 0,
      level: 1,
      fact: 'Viivan kohdalla päivä ja yö ovat suunnilleen yhtä pitkät ympäri vuoden.',
      hint: 'Sen kohdalla päivä ja yö ovat yhtä pitkät.',
    },
    {
      q: 'Kuinka kauan Maalta kestää kiertää Aurinko?',
      options: ['vuosi', 'vuorokausi', 'kuukausi', 'viikko'],
      correct: 0,
      level: 1,
      fact: 'Yksi kierros Auringon ympäri on yksi vuosi; pyörähdys oman akselin ympäri on vuorokausi.',
      hint: 'Sinä aikana ehtivät kaikki neljä vuodenaikaa.',
    },
    {
      q: 'Mikä valtameri erottaa Euroopan ja Pohjois-Amerikan?',
      options: ['Atlantti', 'Tyynimeri', 'Intian valtameri', 'Jäämeri'],
      correct: 0,
      level: 1,
      fact: 'Atlantin yli lensi ensimmäisenä yksin Charles Lindbergh vuonna 1927.',
      hint: 'Sen yli purjehtivat sekä viikingit että Kolumbus.',
    },
    {
      q: 'Mikä on maailman korkein vuori?',
      options: ['Mount Everest', 'Mont Blanc', 'Kilimandžaro', 'Fuji'],
      correct: 0,
      level: 1,
      fact: 'Everestin huippu on 8 849 metrissä Himalajalla, Nepalin ja Kiinan rajalla.',
      hint: 'Se sijaitsee Himalajalla.',
    },
    {
      q: 'Millä mantereella asuu eniten ihmisiä?',
      options: ['Aasiassa', 'Afrikassa', 'Euroopassa', 'Pohjois-Amerikassa'],
      correct: 0,
      fact: 'Yli puolet maailman ihmisistä asuu Aasiassa.',
      hint: 'Yli puolet ihmiskunnasta.',
    },
  ],
};

/**
 * "Tiesitkö että…" -tiedot paikoista. Peli näyttää yhden pelaajan nykyisestä
 * sijainnista, joten jokaisella kaupungilla on useampi vaihtoehto.
 */
export const MAAILMA_FACTS = {
  tokio: [
    'Tokiossa on enemmän ravintoloita kuin missään muussa maailman kaupungissa — myös eniten Michelin-tähtiä.',
    'Shibuyan risteyksessä voi ylittää kadun jopa 3 000 ihmistä yhdellä vihreällä valolla.',
  ],
  singapore: [
    'Singaporen lentokentällä on maailman korkein sisävesiputous.',
    'Purukumin myynti on Singaporessa kielletty ilman reseptiä — katujen siisteys on kansallisylpeys.',
  ],
  kapkaupunki: [
    'Pöytävuoren kansallispuistossa kasvaa enemmän kasvilajeja kuin koko Britanniassa.',
    'Kapkaupungin edustan Robben Islandin vankilasaari, jossa Nelson Mandela istui 18 vuotta, on nykyään museo.',
  ],
  losangeles: [
    'Los Angelesin seudulla puhutaan yli 200 kieltä — se on maailman monikulttuurisimpia kaupunkeja.',
    'Kaupungin nimi oli alun perin espanjaa ja paljon pidempi: El Pueblo de la Reina de los Ángeles.',
  ],
  lontoo: [
    'Lontoossa puhutaan yli 300 kieltä — se on yksi maailman monikulttuurisimmista kaupungeista.',
    'Lontoon metro eli "the Tube" on maailman vanhin — se avattiin jo 1863 höyryvetureilla.',
  ],
  newyork: [
    'Vapaudenpatsas oli Ranskan lahja Yhdysvalloille — se koottiin paikalleen 1886.',
    'New Yorkia kutsutaan Isoksi omenaksi, ja sen metro kulkee vuorokauden ympäri.',
  ],
  kairo: [
    'Gizan suuri pyramidi on ainoa antiikin seitsemästä ihmeestä, joka on yhä pystyssä.',
    'Kairon halki virtaava Niili on koko Egyptin elämänlanka — sen varrella asuu lähes koko kansa.',
  ],
  rio: [
    'Rion karnevaaleilla sambakoulut tanssivat läpi yön — katsomoissa on kymmeniätuhansia ihmisiä.',
    'Sokeritopan vuorelle noustaan köysiradalla, ja huipulta näkyy koko lahti.',
  ],
  mumbai: [
    'Mumbain dabbawalat kuljettavat joka päivä yli sata tuhatta kotona keitettyä lounasta työpaikoille — lähes virheettä.',
    'Mumbai oli aikoinaan seitsemän erillistä saarta, jotka yhdistettiin täyttömaalla.',
  ],
  peking: [
    'Kielletyssä kaupungissa on tarun mukaan 9 999 huonetta — se oli keisarien koti 500 vuotta.',
    'Pekingin vanhat hutong-kujat ovat kapeimmillaan alle metrin levyisiä.',
  ],
  sydney: [
    'Sydneyn oopperatalon katto on päällystetty yli miljoonalla valkoisella laatalla.',
    'Sydneyn satama on yksi maailman suurimmista luonnonsatamista — lautat ovat osa arkiliikennettä.',
  ],
  moskova: [
    'Moskovan metroasemat rakennettiin kuin maanalaisiksi palatseiksi kristallikruunuineen ja mosaiikkeineen.',
    'Kremlin muurien sisällä on katedraaleja, palatseja ja maailman suurin kello, joka ei ole koskaan soinut.',
  ],
};
