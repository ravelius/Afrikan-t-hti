// Oseanian laudan kysymykset ja "tiesitkö että" -tiedot.
//
// level: 1 = helppo, 2 = perus (oletus), 3 = vaikea.
// hint = ostettava vihje. Vihje ei saa sisältää oikeaa vastausta sellaisenaan.
// source = osoite, josta tieto on tarkistettu. Merkitään vain luetuista lähteistä.

export const OCEANIA_QUESTIONS = {
  melbourne: [
    {
      q: 'Missä maassa Melbourne sijaitsee?',
      options: ['Australiassa', 'Uudessa-Seelannissa', 'Fidžillä', 'Indonesiassa'],
      correct: 0,
      level: 1,
      hint: 'Maa on maailman ainoa, joka on samalla kokonainen manner.',
      fact: 'Melbourne oli maan pääkaupunki 1901–1927, kunnes tehtävä siirtyi varta vasten rakennettuun Canberraan.',
    },
    {
      q: 'Mistä Melbournen sää on kuuluisa?',
      options: [
        'se voi vaihtua rajusti saman päivän aikana',
        'siellä ei sada koskaan',
        'siellä on aina pakkasta',
        'siellä on aina sumua',
      ],
      correct: 0,
      level: 2,
      hint: 'Paikallinen sanonta lupaa neljä vuodenaikaa yhden päivän aikana.',
      fact: 'Kylmä ilma etelästä ja kuuma sisämaasta kohtaavat kaupungin kohdalla, ja lämpötila voi pudota kymmenen astetta tunnissa.',
    },
  ],

  brisbane: [
    {
      q: 'Millä Australian rannikolla Brisbane sijaitsee?',
      options: ['itärannikolla', 'länsirannikolla', 'etelärannikolla', 'sisämaassa'],
      correct: 0,
      level: 2,
      hint: 'Kaupunki on Queenslandin osavaltion pääkaupunki, pohjoiseen Sydneystä.',
      fact: 'Brisbane on Australian kolmanneksi suurin kaupunki. Sen ilmasto on lämmin ja kostea ympäri vuoden.',
    },
    {
      q: 'Mitä ovat Australian tunnetut rannikkoalueet Gold Coast ja Sunshine Coast?',
      options: ['hiekkarantoja', 'vuoristoja', 'aavikoita', 'jäätiköitä'],
      correct: 0,
      level: 1,
      hint: 'Alueet ovat Brisbanen molemmin puolin, ja ne tunnetaan surffauksesta.',
      fact: 'Gold Coastilla on yhtenäistä hiekkarantaa yli 50 kilometriä. Alue on Australian suosituin lomakohde.',
    },
  ],

  cairns: [
    {
      q: 'Mikä maailman suurin koralliriutta on Cairnsin edustalla?',
      options: ['Suuri valliriutta', 'Ningaloo', 'Tubbataha', 'Belizen riutta'],
      correct: 0,
      level: 1,
      hint: 'Riutta on yli 2 300 kilometriä pitkä ja näkyy avaruuteen asti.',
      fact: 'Riutta koostuu lähes 3 000 erillisestä riutasta ja sadoista saarista. Se on maailman suurin elävien eliöiden rakentama muodostuma.',
    },
    {
      q: 'Mikä uhkaa koralliriuttoja eniten nykyään?',
      options: [
        'meriveden lämpeneminen ja korallien vaalentuminen',
        'liian kylmä vesi',
        'jäävuoret',
        'hiekkamyrskyt',
      ],
      correct: 0,
      level: 2,
      hint: 'Kun vesi kuumenee, koralli hylkiä sisällään elävät levät ja menettää värinsä.',
      fact: 'Suurella valliriutalla on koettu useita laajoja vaalentumisia 2000-luvulla. Koralli voi toipua, jos lämpöjakso jää lyhyeksi.',
    },
  ],

  darwin: [
    {
      q: 'Missä osassa Australiaa Darwin sijaitsee?',
      options: ['pohjoisrannikolla', 'etelärannikolla', 'keskellä aavikkoa', 'Tasmaniassa'],
      correct: 0,
      level: 2,
      hint: 'Kaupunki on lähempänä Indonesiaa kuin Sydneytä.',
      fact: 'Darwin on Australian ainoa trooppinen osavaltiotason pääkaupunki. Siellä on vain kaksi vuodenaikaa: sadekausi ja kuiva kausi.',
    },
    {
      q: 'Mikä tuhosi suuren osan Darwinista jouluna 1974?',
      options: ['trooppinen hirmumyrsky', 'maanjäristys', 'tulivuorenpurkaus', 'metsäpalo'],
      correct: 0,
      level: 3,
      hint: 'Myrsky nimeltä Tracy pyyhkäisi kaupungin yli jouluaattona.',
      fact: 'Myrsky tuhosi noin 70 prosenttia kaupungin rakennuksista. Darwin rakennettiin uudelleen tiukoilla myrskymääräyksillä.',
    },
  ],

  adelaide: [
    {
      q: 'Minkä osavaltion pääkaupunki Adelaide on?',
      options: ['Etelä-Australian', 'Länsi-Australian', 'Queenslandin', 'Victorian'],
      correct: 0,
      level: 3,
      hint: 'Osavaltion nimi kertoo suoraan, missä päin mannerta se on.',
      fact: 'Adelaide suunniteltiin ruutukaavaan puistovyöhykkeen ympäröimäksi jo ennen kuin sinne rakennettiin mitään.',
    },
    {
      q: 'Mistä tuotteesta Adelaiden ympäristö on Australiassa kuuluisa?',
      options: ['viinistä', 'kahvista', 'teestä', 'riisistä'],
      correct: 0,
      level: 2,
      hint: 'Barossa Valley on maan tunnetuin viljelyalue tälle juomalle.',
      fact: 'Barossan laakson vanhimmat köynnökset on istutettu 1840-luvulla, ja osa on maailman vanhimpia yhä satoa tuottavia.',
    },
  ],

  alicesprings: [
    {
      q: 'Missä Alice Springs sijaitsee?',
      options: [
        'lähes tarkalleen Australian keskellä',
        'itärannikolla',
        'Tasmaniassa',
        'Uudessa-Guineassa',
      ],
      correct: 0,
      level: 2,
      hint: 'Kaupunki on punaisen keskustan sydämessä, tuhansien kilometrien päässä merestä.',
      fact: 'Alice Springs perustettiin lennätinlinjan asemaksi 1870-luvulla. Lähin suurempi kaupunki on 1 500 kilometrin päässä.',
    },
    {
      q: 'Mikä palvelu vie lääkärin syrjäisille karjatiloille Australiassa?',
      options: ['Royal Flying Doctor Service', 'sukellusvenepartio', 'postijuna', 'kamelikaravaani'],
      correct: 0,
      level: 3,
      hint: 'Palvelu perustettiin 1928 ja käyttää pieniä lentokoneita.',
      fact: 'Palvelu lentää vuosittain miljoonia kilometrejä. Se syntyi, koska monelta tilalta oli päiväkausien matka lähimpään sairaalaan.',
    },
  ],

  uluru: [
    {
      q: 'Mikä Uluru on?',
      options: ['valtava hiekkakivimonoliitti', 'tulivuori', 'järvi', 'kaupunki'],
      correct: 0,
      level: 1,
      hint: 'Kallio kohoaa yksinään tasangolta ja hehkuu punaisena auringonlaskussa.',
      fact: 'Uluru kohoaa 348 metriä ympäröivältä tasangolta, ja suurin osa siitä on maan alla. Kallio on anangu-kansalle pyhä.',
    },
    {
      q: 'Millä nimellä Uluru tunnettiin pitkään englanniksi?',
      options: ['Ayers Rock', 'Red Rock', 'Kings Canyon', 'Devils Marbles'],
      correct: 0,
      level: 3,
      hint: 'Nimi annettiin 1873 Etelä-Australian silloisen pääministerin mukaan.',
      fact: 'Kalliolla on nykyään kaksoisnimi. Kiipeäminen sen päälle kiellettiin 2019 alkuperäisasukkaiden pitkäaikaisen toiveen mukaisesti.',
    },
  ],

  broome: [
    {
      q: 'Mistä Broome oli 1900-luvun alussa maailmankuulu?',
      options: ['helmenkalastuksesta', 'kullasta', 'kahvista', 'timanteista'],
      correct: 0,
      level: 3,
      hint: 'Sukeltajat hakivat merenpohjasta simpukoita, joiden kuoresta tehtiin nappeja.',
      fact: 'Broomessa tuotettiin aikanaan valtaosa maailman helmiäisnapeista. Sukeltajia tuli Japanista, Malesiasta ja Filippiineiltä.',
    },
    {
      q: 'Mikä luonnonilmiö näkyy Broomessa täydenkuun aikaan?',
      options: [
        'kuun heijastus muodostaa portaat merelle',
        'aurinko ei laske',
        'meri jäätyy',
        'taivas muuttuu vihreäksi',
      ],
      correct: 0,
      level: 2,
      hint: 'Nouseva kuu heijastuu paljastuneelta liejutasangolta katkonaisena juovana.',
      fact: 'Ilmiötä kutsutaan nimellä Staircase to the Moon. Se näkyy muutamana iltana kuukaudessa maalis–lokakuussa.',
    },
  ],

  kalgoorlie: [
    {
      q: 'Mistä Kalgoorlie on kuuluisa?',
      options: ['kullasta', 'helmistä', 'viinistä', 'kalastuksesta'],
      correct: 0,
      level: 2,
      hint: 'Kaupungissa on valtava avolouhos, jota kutsutaan Super Pitiksi.',
      fact: 'Kalgoorlien kultaryntäys alkoi 1893. Super Pit on yli kolme kilometriä pitkä ja puoli kilometriä syvä.',
    },
    {
      q: 'Miten Kalgoorlien vesipula ratkaistiin 1900-luvun alussa?',
      options: [
        'rakennettiin yli 500 kilometrin putki rannikolta',
        'kaivettiin syvä kaivo',
        'vesi tuotiin laivalla',
        'kaupunki siirrettiin',
      ],
      correct: 0,
      level: 3,
      hint: 'Insinööri C. Y. O’Connor suunnitteli hankkeen, joka pumppasi vettä ylämäkeen aavikon halki.',
      fact: 'Putki valmistui 1903 ja toimii yhä. Se oli aikanaan maailman kunnianhimoisimpia vesihankkeita.',
    },
  ],

  townsville: [
    {
      q: 'Minkä osavaltion rannikolla Townsville sijaitsee?',
      options: ['Queenslandin', 'Victorian', 'Tasmanian', 'Länsi-Australian'],
      correct: 0,
      level: 3,
      hint: 'Osavaltio on nimetty kuningatar Viktorian mukaan mutta ei se eteläinen samanniminen.',
      fact: 'Townsville on Pohjois-Queenslandin suurin kaupunki ja Suuren valliriutan tutkimuksen keskus.',
    },
    {
      q: 'Mikä myrkyllinen meduusa uiskentelee Pohjois-Queenslandin rannoilla kesäisin?',
      options: ['merivaakku', 'korvameduusa', 'kuunmeduusa', 'palolatva'],
      correct: 0,
      level: 3,
      hint: 'Laji on maailman myrkyllisimpiä eläimiä, ja rannoilla uidaan sen takia verkkoaitauksissa.',
      fact: 'Merivaakun lonkerot voivat olla kolme metriä pitkiä. Uimarit käyttävät kaudella ohuita suojapukuja.',
    },
  ],

  hobart: [
    {
      q: 'Millä saarella Hobart sijaitsee?',
      options: ['Tasmaniassa', 'Uudessa-Guineassa', 'Fidžillä', 'Uudessa-Seelannissa'],
      correct: 0,
      level: 2,
      hint: 'Saari on Australian eteläpuolella, ja sen ja mantereen välissä on Bassin salmi.',
      fact: 'Hobart on Sydneyn jälkeen Australian toiseksi vanhin kaupunki, perustettu 1804.',
    },
    {
      q: 'Mikä pussieläin on saanut nimensä Tasmaniasta?',
      options: ['tasmanianpiru', 'kenguru', 'koala', 'vompatti'],
      correct: 0,
      level: 1,
      hint: 'Eläin on musta, pienikokoinen ja tunnettu voimakkaasta puremastaan ja karjunnastaan.',
      fact: 'Laji elää luonnossa vain Tasmaniassa. Sitä uhkaa tarttuva kasvainsairaus, jota vastaan kantaa yritetään suojella.',
    },
  ],

  nullarbor: [
    {
      q: 'Millainen alue Nullarbor on?',
      options: ['lähes puuton tasanko', 'sademetsä', 'vuoristo', 'jäätikkö'],
      correct: 0,
      level: 2,
      hint: 'Nimi tulee latinan sanoista nulla arbor eli ei puuta.',
      fact: 'Nullarbor on maailman suurin yhtenäinen kalkkikivitasanko. Sen halki kulkee maailman pisin täysin suora rautatieosuus, 478 kilometriä.',
    },
    {
      q: 'Mikä kulkee Nullarborin halki maailman pisimpänä täysin suorana osuutena?',
      options: ['rautatie', 'kanava', 'putkilinja', 'lentokenttä'],
      correct: 0,
      level: 3,
      hint: 'Indian Pacific -juna kulkee tätä reittiä Sydneystä Perthiin.',
      fact: 'Suora osuus on 478 kilometriä ilman ainuttakaan mutkaa. Koko matka Sydneystä Perthiin kestää kolme vuorokautta.',
    },
  ],

  birdsville: [
    {
      q: 'Millainen paikka Birdsville on?',
      options: [
        'pieni kylä keskellä autiomaata',
        'suurkaupunki',
        'saari',
        'hiihtokeskus',
      ],
      correct: 0,
      level: 2,
      hint: 'Kylässä asuu muutama kymmenen ihmistä, ja sen kuuluisin rakennus on hotelli.',
      fact: 'Birdsvillessä asuu noin sata ihmistä, mutta vuosittaisiin hevoskilpailuihin saapuu tuhansia.',
    },
    {
      q: 'Mikä autiomaa alkaa Birdsvillestä länteen?',
      options: ['Simpsonin autiomaa', 'Sahara', 'Gobi', 'Atacama'],
      correct: 0,
      level: 3,
      hint: 'Autiomaassa on tuhansia yhdensuuntaisia punaisia hiekkaharjuja.',
      fact: 'Simpsonin autiomaassa on maailman pisimpiä hiekkaharjuja: osa jatkuu satoja kilometrejä katkeamatta.',
    },
  ],

  exmouth: [
    {
      q: 'Mikä riutta on Exmouthin edustalla?',
      options: ['Ningaloo', 'Suuri valliriutta', 'Tubbataha', 'Aldabra'],
      correct: 0,
      level: 3,
      hint: 'Riutta on Australian länsirannikolla ja alkaa aivan rantavedestä.',
      fact: 'Ningaloo on maailman suurimpia rantariuttoja: koralli alkaa paikoin metrien päästä rannasta.',
    },
    {
      q: 'Mikä maailman suurin kala käy Ningaloon riutalla vuosittain?',
      options: ['valashai', 'valkohai', 'sinivalas', 'mustekala'],
      correct: 0,
      level: 2,
      hint: 'Eläin on täplikäs jättiläinen, joka syö planktonia eikä ole vaarallinen ihmiselle.',
      fact: 'Valashai voi kasvaa yli 12-metriseksi. Ningaloon riutalle ne saapuvat korallien kutuaikaan maalis–heinäkuussa.',
    },
  ],

  mountisa: [
    {
      q: 'Mistä Mount Isa elää?',
      options: ['kaivostoiminnasta', 'kalastuksesta', 'matkailusta', 'viininviljelystä'],
      correct: 0,
      level: 2,
      hint: 'Kaupungin alta louhitaan lyijyä, sinkkiä, hopeaa ja kuparia.',
      fact: 'Mount Isan kaivos on yksi maailman tuottavimmista hopeakaivoksista. Kaupunki on rakennettu kaivoksen ympärille keskelle erämaata.',
    },
    {
      q: 'Kuinka kaukana lähin rannikko on Mount Isasta?',
      options: ['satoja kilometrejä', 'muutaman kilometrin', 'kymmenen kilometriä', 'ei lainkaan, se on rannikolla'],
      correct: 0,
      level: 1,
      hint: 'Kaupunki on syvällä Queenslandin sisämaassa.',
      fact: 'Matkaa Townsvilleen on lähes 900 kilometriä. Mount Isan kunta on pinta-alaltaan suurempi kuin moni Euroopan valtio.',
    },
  ],

  cooberpedy: [
    {
      q: 'Mistä jalokivestä Coober Pedy on maailmankuulu?',
      options: ['opaalista', 'timantista', 'smaragdista', 'rubiinista'],
      correct: 0,
      level: 2,
      hint: 'Kivi hohtaa monivärisenä valon taittuessa sen sisällä olevista piidioksidipalloista.',
      fact: 'Coober Pedy tuottaa suuren osan maailman jalo-opaaleista. Kaupungin ympärillä on satojatuhansia kaivoskuoppia.',
    },
    {
      q: 'Missä suuri osa Coober Pedyn asukkaista asuu?',
      options: ['maan alla', 'puissa', 'lautoilla', 'teltoissa'],
      correct: 0,
      level: 3,
      hint: 'Kesähelteet nousevat yli 40 asteen, mutta kallioon louhitussa tilassa on tasainen lämpötila.',
      fact: 'Kaupungissa on maan alla koteja, kirkkoja, hotelleja ja kauppoja. Asumuksia kutsutaan nimellä dugout.',
    },
  ],

  geraldton: [
    {
      q: 'Minkä valtameren rannalla Geraldton sijaitsee?',
      options: ['Intian valtameren', 'Tyynenmeren', 'Atlantin', 'Jäämeren'],
      correct: 0,
      level: 2,
      hint: 'Meri on Australian länsipuolella ja ulottuu Afrikkaan asti.',
      fact: 'Geraldtonin edustalla haaksirikkoutui 1629 hollantilainen Batavia-laiva, ja tapaus johti kapinaan ja verilöylyyn.',
    },
    {
      q: 'Mistä Australian länsirannikko on tuulen takia suosittu?',
      options: ['purjelautailusta', 'laskettelusta', 'luistelusta', 'koiravaljakoista'],
      correct: 0,
      level: 1,
      hint: 'Iltapäivän merituuli on niin säännöllinen, että sitä kutsutaan nimellä Fremantle Doctor.',
      fact: 'Geraldton on yksi maailman tunnetuimmista purjelautailupaikoista tasaisen ja voimakkaan tuulensa takia.',
    },
  ],

  portmoresby: [
    {
      q: 'Minkä maan pääkaupunki Port Moresby on?',
      options: ['Papua-Uuden-Guinean', 'Australian', 'Indonesian', 'Fidžin'],
      correct: 0,
      level: 2,
      hint: 'Maa kattaa Uuden-Guinean saaren itäisen puoliskon.',
      fact: 'Papua-Uudessa-Guineassa puhutaan yli 800 kieltä — enemmän kuin missään muussa maassa maailmassa.',
    },
    {
      q: 'Kuinka monta kieltä Papua-Uudessa-Guineassa puhutaan suunnilleen?',
      options: ['yli 800', 'noin 10', 'noin 50', 'vain yksi'],
      correct: 0,
      level: 3,
      hint: 'Määrä on maailmanennätys, ja se selittyy vuoristolaaksojen eristyneisyydellä.',
      fact: 'Maassa on noin 12 prosenttia kaikista maailman kielistä, vaikka väkiluku on alle kymmenen miljoonaa.',
    },
  ],

  sepik: [
    {
      q: 'Mikä Sepik on?',
      options: ['Uuden-Guinean suuri joki', 'vuori', 'saari', 'kaupunki Australiassa'],
      correct: 0,
      level: 3,
      hint: 'Se mutkittelee yli tuhat kilometriä sademetsän halki eikä sen suulla ole suistoa.',
      fact: 'Sepik on Uuden-Guinean pisin joki. Sen varren kylät tunnetaan puuveistoksista ja henkitaloista.',
    },
    {
      q: 'Millaista maastoa Uudessa-Guineassa on?',
      options: [
        'korkeaa vuoristoa ja sademetsää',
        'aavikkoa',
        'tundraa',
        'tasaista preeriaa',
      ],
      correct: 0,
      level: 2,
      hint: 'Saaren keskellä kulkee vuorijono, jonka huipuilla on jäätiköitä päiväntasaajan lähellä.',
      fact: 'Puncak Jaya kohoaa 4 884 metriin ja on Oseanian korkein vuori. Sen jäätiköt ovat kutistuneet nopeasti.',
    },
  ],

  honiara: [
    {
      q: 'Minkä saarivaltion pääkaupunki Honiara on?',
      options: ['Salomonsaarten', 'Vanuatun', 'Fidžin', 'Tongan'],
      correct: 0,
      level: 3,
      hint: 'Saariryhmä on Papua-Uuden-Guinean itäpuolella, ja se nimettiin raamatullisen kuninkaan mukaan.',
      fact: 'Honiara on Guadalcanalin saarella, jossa käytiin toisen maailmansodan raskaimpia Tyynenmeren taisteluita 1942–1943.',
    },
    {
      q: 'Mikä saari Salomonsaarilla oli toisen maailmansodan tunnettuja taistelupaikkoja?',
      options: ['Guadalcanal', 'Iwo Jima', 'Okinawa', 'Malta'],
      correct: 0,
      level: 3,
      hint: 'Saarella on Honiaran kaupunki, ja sen ympärillä oleva merialue sai lempinimen Ironbottom Sound.',
      fact: 'Saaren edustalle upposi kymmeniä laivoja, ja merenpohja on siksi yksi maailman tunnetuimmista sukelluskohteista.',
    },
  ],

  portvila: [
    {
      q: 'Minkä saarivaltion pääkaupunki Port Vila on?',
      options: ['Vanuatun', 'Salomonsaarten', 'Fidžin', 'Samoan'],
      correct: 0,
      level: 3,
      hint: 'Maa oli ennen itsenäistymistään 1980 Britannian ja Ranskan yhteishallinnossa.',
      fact: 'Vanuatussa on yli 80 saarta ja useita aktiivisia tulivuoria. Maassa puhutaan yli sataa kieltä.',
    },
    {
      q: 'Miksi Vanuatussa on paljon maanjäristyksiä ja tulivuoria?',
      options: [
        'se on Tyynenmeren tulirenkaalla',
        'siellä sataa paljon',
        'saaret ovat koralleja',
        'meri on matala',
      ],
      correct: 0,
      level: 2,
      hint: 'Kaksi mannerlaattaa kohtaa saariketjun alla.',
      fact: 'Vanuatun Yasur-tulivuori on purkautunut lähes yhtäjaksoisesti satojen vuosien ajan, ja sen kraatterin reunalle voi kävellä.',
    },
  ],

  noumea: [
    {
      q: 'Minkä maan merentakaista aluetta Uusi-Kaledonia on?',
      options: ['Ranskan', 'Britannian', 'Australian', 'Uuden-Seelannin'],
      correct: 0,
      level: 2,
      hint: 'Alueella puhutaan samaa kieltä kuin Pariisissa ja valuutta on Tyynenmeren frangi.',
      fact: 'Nouméa on saaren pääkaupunki. Uusi-Kaledonia tuottaa merkittävän osan maailman nikkelistä.',
    },
    {
      q: 'Mistä metallista Uusi-Kaledonia on maailmanlaajuisesti tärkeä?',
      options: ['nikkelistä', 'kullasta', 'hopeasta', 'platinasta'],
      correct: 0,
      level: 3,
      hint: 'Metallia käytetään ruostumattomaan teräkseen ja akkuihin.',
      fact: 'Saarella on arviolta noin kymmenesosa maailman nikkelivaroista, ja kaivostoiminta on sen talouden selkäranka.',
    },
  ],

  norfolk: [
    {
      q: 'Mikä Norfolkinsaari oli 1800-luvulla?',
      options: ['ankara rangaistussiirtola', 'kauppasatama', 'kalastajakylä', 'sotilastukikohta'],
      correct: 0,
      level: 3,
      hint: 'Britannia lähetti sinne vankeja, joita pidettiin liian vaarallisina Sydneyhyn.',
      fact: 'Saaren siirtolarakennukset ovat Unescon maailmanperintökohde. Nykyään saari kuuluu Australiaan.',
    },
    {
      q: 'Mikä puu on nimetty Norfolkinsaaren mukaan?',
      options: ['norfolkinaraukaria', 'eukalyptus', 'baobab', 'mangrove'],
      correct: 0,
      level: 2,
      hint: 'Puu on suippo havupuu, jota kasvatetaan huonekasvina ympäri maailman.',
      fact: 'Puu kasvaa saarella luonnonvaraisena yli 60-metriseksi. James Cook toivoi siitä laivanmastoja, mutta puu osoittautui liian hauraaksi.',
    },
  ],

  suva: [
    {
      q: 'Minkä saarivaltion pääkaupunki Suva on?',
      options: ['Fidžin', 'Tongan', 'Samoan', 'Vanuatun'],
      correct: 0,
      level: 2,
      hint: 'Maa koostuu yli 300 saaresta, ja sen tunnetuin vientituote on sokeriruoko.',
      fact: 'Suva on Etelä-Tyynenmeren suurimpia kaupunkeja ja alueen yliopiston sijaintipaikka.',
    },
    {
      q: 'Mikä kuvitteellinen viiva kulkee Fidžin lähellä?',
      options: ['päivämäärän vaihtumislinja', 'päiväntasaaja', 'nollameridiaani', 'napapiiri'],
      correct: 0,
      level: 3,
      hint: 'Linja seuraa suunnilleen 180. pituuspiiriä, ja sen yli astuessa vaihtuu päivä.',
      fact: 'Fidžin saaria on linjan molemmin puolin, mutta koko maa noudattaa samaa päivää käytännön syistä.',
    },
  ],

  auckland: [
    {
      q: 'Minkä maan suurin kaupunki Auckland on?',
      options: ['Uuden-Seelannin', 'Australian', 'Fidžin', 'Papua-Uuden-Guinean'],
      correct: 0,
      level: 1,
      hint: 'Maa koostuu kahdesta pääsaaresta, ja sen pääkaupunki on Wellington.',
      fact: 'Aucklandissa asuu noin kolmasosa koko maan väestöstä. Kaupunki on rakennettu yli 50 tulivuoren kartion päälle.',
    },
    {
      q: 'Mikä kansa asutti Uuden-Seelannin ennen eurooppalaisia?',
      options: ['maorit', 'aboriginaalit', 'inuiitit', 'inkat'],
      correct: 0,
      level: 1,
      hint: 'Kansa saapui polynesialaisilta saarilta kanooteilla noin 1300-luvulla.',
      fact: 'Maorien kielellä maan nimi on Aotearoa, pitkän valkoisen pilven maa. Se on yksi maan virallisista kielistä.',
    },
  ],

  wellington: [
    {
      q: 'Minkä maan pääkaupunki Wellington on?',
      options: ['Uuden-Seelannin', 'Australian', 'Fidžin', 'Vanuatun'],
      correct: 0,
      level: 2,
      hint: 'Kaupunki on Pohjoissaaren eteläkärjessä Cookinsalmen rannalla.',
      fact: 'Wellington on maailman eteläisin itsenäisen valtion pääkaupunki, ja sitä kutsutaan tuuliseksi kaupungiksi.',
    },
    {
      q: 'Mikä salmi erottaa Uuden-Seelannin pääsaaret toisistaan?',
      options: ['Cookinsalmi', 'Bassin salmi', 'Torresin salmi', 'Magalhãesin salmi'],
      correct: 0,
      level: 3,
      hint: 'Salmi on nimetty brittiläisen tutkimusmatkailijan mukaan, joka purjehti alueella 1770-luvulla.',
      fact: 'Salmi on kapeimmillaan noin 22 kilometriä leveä. Sen yli kulkee autolautta, ja ylitys kestää kolmisen tuntia.',
    },
  ],

  christchurch: [
    {
      q: 'Millä Uuden-Seelannin saarella Christchurch sijaitsee?',
      options: ['Eteläsaarella', 'Pohjoissaarella', 'Stewartinsaarella', 'Chathamsaarilla'],
      correct: 0,
      level: 2,
      hint: 'Saari on suurempi ja vuoristoisempi, ja siellä kulkee Eteläiset Alpit.',
      fact: 'Christchurch on Eteläsaaren suurin kaupunki. Se kärsi pahoin maanjäristyksissä 2010 ja 2011.',
    },
    {
      q: 'Mikä vuorijono kulkee Uuden-Seelannin Eteläsaaren halki?',
      options: ['Eteläiset Alpit', 'Andit', 'Kalliovuoret', 'Uralvuoret'],
      correct: 0,
      level: 2,
      hint: 'Jonon korkein huippu Aoraki kohoaa yli 3 700 metriin.',
      fact: 'Vuoristossa on satoja jäätiköitä. Läntinen rinne on maailman sateisimpia paikkoja, itäinen taas kuivaa lakeutta.',
    },
  ],

  milfordsound: [
    {
      q: 'Mikä Milford Sound on?',
      options: ['vuono', 'tulivuori', 'aavikko', 'kaupunki'],
      correct: 0,
      level: 2,
      hint: 'Jäätikkö on uurtanut sen mereen laskevaksi kanjoniksi, jonka seinämät nousevat pystysuorina.',
      fact: 'Milford Sound on Fiordlandin kansallispuistossa. Sen seinämät kohoavat yli 1 200 metriin suoraan merestä.',
    },
    {
      q: 'Mikä lintu on Uuden-Seelannin kansallissymboli eikä osaa lentää?',
      options: ['kiivi', 'kotka', 'pingviini', 'strutsi'],
      correct: 0,
      level: 1,
      hint: 'Lintu on yökukkuja, sen nokan päässä on sieraimet, ja siitä on nimetty myös hedelmä.',
      fact: 'Kiivi munii poikkeuksellisen suuren munan kokoonsa nähden. Kaikki lajit ovat uhanalaisia tuotujen petojen takia.',
    },
  ],

  dili: [
    {
      q: 'Minkä maan pääkaupunki Dili on?',
      options: ['Itä-Timorin', 'Indonesian', 'Papua-Uuden-Guinean', 'Malesian'],
      correct: 0,
      level: 3,
      hint: 'Maa itsenäistyi 2002 ja on yksi maailman nuorimmista valtioista.',
      fact: 'Itä-Timor oli Portugalin siirtomaa yli 400 vuotta ja sen jälkeen Indonesian miehittämä. Portugali on yhä yksi maan virallisista kielistä.',
    },
    {
      q: 'Miten Timorin saari on jaettu?',
      options: [
        'itäosa on itsenäinen valtio, länsiosa kuuluu Indonesiaan',
        'se kuuluu kokonaan Australialle',
        'se on jaettu neljän maan kesken',
        'se on asumaton',
      ],
      correct: 0,
      level: 3,
      hint: 'Jako periytyy Portugalin ja Alankomaiden siirtomaarajasta.',
      fact: 'Saaren länsiosa kuuluu Indonesiaan. Itäosassa on lisäksi Oecusse, erillinen alue keskellä Indonesian puolta.',
    },
  ],

  bali: [
    {
      q: 'Minkä maan saari Bali on?',
      options: ['Indonesian', 'Malesian', 'Filippiinien', 'Itä-Timorin'],
      correct: 0,
      level: 1,
      hint: 'Maa on maailman suurin saarivaltio ja sen pääkaupunki on Jakarta.',
      fact: 'Bali on ainoa Indonesian saari, jossa enemmistö on hinduja. Saarella on tuhansia temppeleitä.',
    },
    {
      q: 'Mikä perinteinen viljelymenetelmä on Balilla maailmanperintökohde?',
      options: ['riisiterassit ja niiden kastelujärjestelmä', 'kelluvat puutarhat', 'kasvihuoneet', 'poltettu kaski'],
      correct: 0,
      level: 3,
      hint: 'Järjestelmää kutsutaan nimellä subak, ja sitä hallinnoivat temppeliyhteisöt yhdessä.',
      fact: 'Subak on toiminut yli tuhat vuotta. Vesi jaetaan pelloille yhteisellä päätöksellä, ei omistuksen mukaan.',
    },
  ],

  general: [
    {
      q: 'Mikä on Australian pääkaupunki?',
      options: ['Canberra', 'Sydney', 'Melbourne', 'Perth'],
      correct: 0,
      level: 2,
      hint: 'Kaupunki rakennettiin varta vasten tähän tehtävään kahden suurimman kaupungin väliin.',
      fact: 'Sydney ja Melbourne kiistelivät asemasta, joten pääkaupunki rakennettiin uutena niiden puoliväliin.',
    },
    {
      q: 'Mikä on maailman suurin koralliriutta?',
      options: ['Suuri valliriutta', 'Ningaloo', 'Belizen riutta', 'Tubbataha'],
      correct: 0,
      level: 1,
      hint: 'Riutta on Australian koillisrannikolla ja yli 2 300 kilometriä pitkä.',
      fact: 'Riutta on maailman suurin elävien eliöiden rakentama muodostuma ja Unescon maailmanperintökohde.',
    },
    {
      q: 'Mikä eläinryhmä on tyypillinen juuri Australialle?',
      options: ['pussieläimet', 'kissaeläimet', 'kamelieläimet', 'karhut'],
      correct: 0,
      level: 1,
      hint: 'Poikanen syntyy hyvin pienenä ja kasvaa emon vatsapussissa.',
      fact: 'Australiassa elää yli 200 pussieläinlajia. Manner erosi muista mantereista niin kauan sitten, että sen eläimistö kehittyi omaan suuntaansa.',
    },
    {
      q: 'Mikä nisäkäs munii ja elää Australiassa?',
      options: ['vesinokkaeläin', 'koala', 'kenguru', 'vompatti'],
      correct: 0,
      level: 2,
      hint: 'Eläimellä on sorsan nokkaa muistuttava kuono ja räpylät.',
      fact: 'Vesinokkaeläin ja piikkisiilit ovat ainoat munivat nisäkkäät. Ensimmäiset Eurooppaan lähetetyt näytteet luultiin väärennöksiksi.',
    },
    {
      q: 'Mikä kansa asutti Australian ensimmäisenä?',
      options: ['aboriginaalit', 'maorit', 'polynesialaiset', 'inuiitit'],
      correct: 0,
      level: 2,
      hint: 'Kansa saapui mantereelle yli 50 000 vuotta sitten ja on maailman vanhimpia yhtäjaksoisia kulttuureja.',
      fact: 'Australian alkuperäiskansojen kulttuuria pidetään maailman vanhimpana yhtäjaksoisena. Torresinsalmen saarilla asuu oma erillinen kansansa.',
    },
    {
      q: 'Mikä on Oseanian suurin maa pinta-alaltaan?',
      options: ['Australia', 'Papua-Uusi-Guinea', 'Uusi-Seelanti', 'Fidži'],
      correct: 0,
      level: 1,
      hint: 'Maa on samalla kokonainen manner.',
      fact: 'Australia on maailman kuudenneksi suurin maa, mutta sen väestöstä valtaosa asuu kapealla itä- ja etelärannikolla.',
    },
    {
      q: 'Mikä valtameri ympäröi Oseanian saaria?',
      options: ['Tyynimeri', 'Atlantti', 'Jäämeri', 'Välimeri'],
      correct: 0,
      level: 1,
      hint: 'Meri on maailman suurin ja sai nimensä rauhallisilta vaikuttaneilta vesiltään.',
      fact: 'Tyynimeri peittää noin kolmanneksen maapallon pinnasta — enemmän kuin kaikki mantereet yhteensä.',
    },
    {
      q: 'Miten polynesialaiset löysivät Tyynenmeren saaret?',
      options: [
        'purjehtimalla kaksirunkoisilla kanooteilla tähtien avulla',
        'höyrylaivoilla',
        'kävelemällä maasiltoja pitkin',
        'kuumailmapalloilla',
      ],
      correct: 0,
      level: 3,
      hint: 'Suunnistus perustui tähtiin, aallokkoon, pilviin ja lintuihin ilman mittalaitteita.',
      fact: 'Polynesialaiset asuttivat valtavan merialueen Havaijilta Uuteen-Seelantiin ja Pääsiäissaarelle. Perinteistä suunnistustaitoa elvytetään yhä.',
    },
    {
      q: 'Mikä on Australian tunnetuin kivimuodostuma keskellä mannerta?',
      options: ['Uluru', 'Mount Everest', 'Table Mountain', 'Half Dome'],
      correct: 0,
      level: 1,
      hint: 'Muodostuma hehkuu punaisena auringonlaskussa ja on anangu-kansalle pyhä.',
      fact: 'Kallio kohoaa 348 metriä tasangolta, ja suurin osa siitä on maan alla.',
    },
    {
      q: 'Millainen ilmasto on suurimmassa osassa Australiaa?',
      options: ['kuiva ja aavikkoinen', 'sateinen ja viileä', 'arktinen', 'lauhkea metsäilmasto'],
      correct: 0,
      level: 2,
      hint: 'Sisämaan laajaa aluetta kutsutaan nimellä outback.',
      fact: 'Noin 70 prosenttia mantereesta on kuivaa tai puolikuivaa. Siksi lähes kaikki asutus on rannikoilla.',
    },
    {
      q: 'Mikä tuotu eläin on aiheuttanut Australiassa suuria vahinkoja?',
      options: ['kaniini', 'poro', 'laama', 'panda'],
      correct: 0,
      level: 2,
      hint: 'Eläimiä tuotiin 1800-luvulla metsästystä varten, ja ne lisääntyivät hallitsemattomasti.',
      fact: 'Australiaan rakennettiin tuhansien kilometrien aitoja niiden leviämisen pysäyttämiseksi. Yritykset epäonnistuivat suurelta osin.',
    },
    {
      q: 'Mikä on Uuden-Seelannin korkein vuori?',
      options: ['Aoraki', 'Mount Kosciuszko', 'Puncak Jaya', 'Fuji'],
      correct: 0,
      level: 3,
      hint: 'Vuoren maorinkielinen nimi tarkoittaa pilvien lävistäjää, ja englanniksi se on Mount Cook.',
      fact: 'Vuori kohoaa noin 3 724 metriin. Sen korkeus laski parikymmentä metriä, kun huipulta romahti jäätä 1991.',
    },
    {
      q: 'Mistä Australian ja Uuden-Seelannin ANZAC-päivä muistuttaa?',
      options: [
        'ensimmäisen maailmansodan Gallipolin maihinnoususta',
        'itsenäistymisestä',
        'kultaryntäyksestä',
        'ensimmäisestä purjehduksesta',
      ],
      correct: 0,
      level: 3,
      hint: 'Päivää vietetään 25. huhtikuuta, ja se muistuttaa vuoden 1915 taisteluista Turkin rannikolla.',
      fact: 'ANZAC tulee sanoista Australian and New Zealand Army Corps. Päivä on molemmissa maissa tärkein muistopäivä.',
    },
    {
      q: 'Mikä on Australian eteläpuolella oleva manner?',
      options: ['Etelämanner', 'Afrikka', 'Etelä-Amerikka', 'Aasia'],
      correct: 0,
      level: 1,
      hint: 'Manner on jään peitossa, eikä sillä ole pysyvää asutusta.',
      fact: 'Tasmaniasta Etelämantereelle on noin 2 500 kilometriä. Hobart on monen etelämannerretkikunnan lähtösatama.',
    },
    {
      q: 'Mikä on maailman pienin itsenäinen saarivaltio pinta-alaltaan Tyynellämerellä?',
      options: ['Nauru', 'Fidži', 'Vanuatu', 'Samoa'],
      correct: 0,
      level: 3,
      hint: 'Maan pinta-ala on noin 21 neliökilometriä, ja se rikastui aikanaan fosfaatista.',
      fact: 'Nauru on maailman kolmanneksi pienin valtio Vatikaanin ja Monacon jälkeen. Fosfaattilouhinta on jättänyt saaren keskustan kuunmaisemaksi.',
    },
  ],
};

export const OCEANIA_FACTS = {
  sydney: [
    'Sydneyn oopperatalon katto koostuu betonisista kuorista, jotka on päällystetty yli miljoonalla laatalla.',
    'Kaupungin satama on yksi maailman suurimmista luonnonsatamista.',
    'Sydney oli Britannian ensimmäinen rangaistussiirtola Australiassa, perustettu 1788.',
  ],
  perth: [
    'Perth on yksi maailman eristyneimmistä suurkaupungeista: lähin miljoonakaupunki on yli 2 000 kilometrin päässä.',
    'Kaupunki on lähempänä Jakartaa kuin Sydneytä.',
    'Iltapäivän merituulta kutsutaan nimellä Fremantle Doctor, koska se viilentää helteisen päivän.',
  ],
  melbourne: [
    'Melbourne oli Australian pääkaupunki 1901–1927, kunnes tehtävä siirtyi Canberraan.',
    'Kaupungin säästä sanotaan, että siellä on neljä vuodenaikaa yhden päivän aikana.',
    'Melbournessa kulkee maailman laajin raitiotieverkko, yli 250 kilometriä raidetta.',
  ],
  brisbane: [
    'Brisbane on Australian kolmanneksi suurin kaupunki ja Queenslandin pääkaupunki.',
    'Kaupungin ympärillä ovat Gold Coast ja Sunshine Coast, maan suosituimmat rantakohteet.',
    'Brisbane-joki mutkittelee kaupungin läpi niin, että keskustassa on vaikea hahmottaa ilmansuuntia.',
  ],
  cairns: [
    'Cairnsista lähdetään Suurelle valliriutalle, joka on yli 2 300 kilometriä pitkä.',
    'Riutta koostuu lähes 3 000 erillisestä riutasta ja sadoista saarista.',
    'Kaupungin takana on Daintree, yksi maailman vanhimmista yhtäjaksoisista sademetsistä.',
  ],
  darwin: [
    'Darwin on Australian ainoa trooppinen osavaltiotason pääkaupunki.',
    'Hirmumyrsky Tracy tuhosi jouluna 1974 noin 70 prosenttia kaupungin rakennuksista.',
    'Vuodessa on vain kaksi vuodenaikaa: sadekausi ja kuiva kausi.',
  ],
  adelaide: [
    'Adelaide suunniteltiin ruutukaavaan puistovyöhykkeen ympäröimäksi ennen kuin sinne rakennettiin mitään.',
    'Barossan laakso kaupungin lähellä on Australian tunnetuin viinialue.',
    'Adelaide on ainoa Australian osavaltion pääkaupunki, jota ei perustettu rangaistussiirtolaksi.',
  ],
  alicesprings: [
    'Alice Springs perustettiin lennätinlinjan asemaksi 1870-luvulla keskelle mannerta.',
    'Royal Flying Doctor Service vie lääkärin lentokoneella syrjäisille karjatiloille.',
    'Kaupungista on lähimpään suurempaan kaupunkiin noin 1 500 kilometriä.',
  ],
  uluru: [
    'Uluru kohoaa 348 metriä ympäröivältä tasangolta, ja suurin osa siitä on maan alla.',
    'Kallio on anangu-kansalle pyhä, ja sille kiipeäminen kiellettiin 2019.',
    'Kivi näyttää vaihtavan väriä auringon kulman mukaan, kirkkaimmillaan se hehkuu punaisena laskun aikaan.',
  ],
  broome: [
    'Broomessa tuotettiin 1900-luvun alussa valtaosa maailman helmiäisnapeista.',
    'Sukeltajia tuli helmenkalastukseen Japanista, Malesiasta ja Filippiineiltä.',
    'Täydenkuun aikaan nouseva kuu heijastuu liejutasangolta portaita muistuttavana juovana.',
  ],
  kalgoorlie: [
    'Kalgoorlien kultaryntäys alkoi 1893, ja kaupunki kasvoi keskelle aavikkoa.',
    'Super Pit -avolouhos on yli kolme kilometriä pitkä ja puoli kilometriä syvä.',
    'Kaupungin vesi tuodaan yli 500 kilometrin putkea pitkin rannikolta; putki valmistui 1903 ja toimii yhä.',
  ],
  townsville: [
    'Townsville on Pohjois-Queenslandin suurin kaupunki ja riuttatutkimuksen keskus.',
    'Rannoilla uidaan kesäisin verkkoaitauksissa myrkyllisten merivaakkujen takia.',
    'Kaupungin edustalla on Magnetic Island, jonka nimesi James Cook luullessaan sen häiritsevän kompassia.',
  ],
  hobart: [
    'Hobart on Sydneyn jälkeen Australian toiseksi vanhin kaupunki, perustettu 1804.',
    'Tasmanianpiru elää luonnossa vain tällä saarella.',
    'Kaupunki on monen Etelämantereelle suuntaavan retkikunnan lähtösatama.',
  ],
  nullarbor: [
    'Nullarborin nimi tulee latinan sanoista nulla arbor eli ei puuta.',
    'Se on maailman suurin yhtenäinen kalkkikivitasanko.',
    'Tasangon halki kulkee maailman pisin täysin suora rautatieosuus, 478 kilometriä ilman mutkaa.',
  ],
  birdsville: [
    'Birdsvillessä asuu noin sata ihmistä, mutta vuosittaisiin hevoskilpailuihin saapuu tuhansia.',
    'Kylästä länteen alkaa Simpsonin autiomaa tuhansine punaisine hiekkaharjuineen.',
    'Birdsville Track on kuuluisa hiekkatie, jota pitkin karjaa on ajettu satoja kilometrejä.',
  ],
  exmouth: [
    'Ningaloon riutta alkaa paikoin vain metrien päästä rannasta.',
    'Riutalle saapuu vuosittain valashaita, maailman suurimpia kaloja.',
    'Alue on yksi harvoja paikkoja, joissa suurelle riutalle pääsee suoraan rannalta uimalla.',
  ],
  mountisa: [
    'Mount Isan kaivos on yksi maailman tuottavimmista hopeakaivoksista.',
    'Kunta on pinta-alaltaan suurempi kuin moni Euroopan valtio.',
    'Lähimmälle rannikolle Townsvilleen on lähes 900 kilometriä.',
  ],
  cooberpedy: [
    'Coober Pedy tuottaa suuren osan maailman jalo-opaaleista.',
    'Suuri osa asukkaista asuu maan alla louhituissa kodeissa helteen takia.',
    'Kaupungin ympärillä on satojatuhansia kaivoskuoppia, ja alueella on varoitettava putoamisvaarasta.',
  ],
  geraldton: [
    'Geraldtonin edustalla haaksirikkoutui 1629 hollantilainen Batavia-laiva.',
    'Kaupunki on yksi maailman tunnetuimmista purjelautailupaikoista tasaisen tuulensa takia.',
    'Länsirannikolla on Houtman Abrolhos, saariryhmä jonka riutat ovat maailman eteläisimpiä koralliriuttoja.',
  ],
  portmoresby: [
    'Papua-Uudessa-Guineassa puhutaan yli 800 kieltä — enemmän kuin missään muussa maassa.',
    'Maassa on noin 12 prosenttia kaikista maailman kielistä, vaikka väkiluku on alle kymmenen miljoonaa.',
    'Kokoda Track, tunnettu vaellusreitti ja toisen maailmansodan taistelupaikka, alkaa kaupungin läheltä.',
  ],
  sepik: [
    'Sepik on Uuden-Guinean pisin joki ja mutkittelee yli tuhat kilometriä sademetsän halki.',
    'Joen varren kylät tunnetaan puuveistoksista ja suurista henkitaloista.',
    'Uuden-Guinean korkein huippu Puncak Jaya kohoaa 4 884 metriin ja sillä on jäätikkö päiväntasaajan lähellä.',
  ],
  honiara: [
    'Honiara on Guadalcanalin saarella Salomonsaarilla.',
    'Saaren ympärillä käytiin 1942–1943 toisen maailmansodan raskaimpia Tyynenmeren taisteluita.',
    'Merenpohjaan upposi niin paljon laivoja, että alue sai nimen Ironbottom Sound.',
  ],
  portvila: [
    'Vanuatussa on yli 80 saarta ja useita aktiivisia tulivuoria.',
    'Maa oli ennen itsenäistymistään 1980 Britannian ja Ranskan yhteishallinnossa.',
    'Yasur-tulivuori on purkautunut lähes yhtäjaksoisesti satojen vuosien ajan.',
  ],
  noumea: [
    'Uusi-Kaledonia on Ranskan merentakainen alue, ja Nouméa on sen pääkaupunki.',
    'Saarella on arviolta noin kymmenesosa maailman nikkelivaroista.',
    'Saarta ympäröi maailman toiseksi suurin koralliriutta-alue, joka on maailmanperintökohde.',
  ],
  norfolk: [
    'Norfolkinsaari oli 1800-luvulla ankara rangaistussiirtola, jonne lähetettiin Sydneystä vaarallisimpina pidetyt vangit.',
    'Saaren siirtolarakennukset ovat Unescon maailmanperintökohde.',
    'Norfolkinaraukaria kasvaa saarella luonnonvaraisena yli 60-metriseksi.',
  ],
  suva: [
    'Suva on Etelä-Tyynenmeren suurimpia kaupunkeja ja alueen yliopiston sijaintipaikka.',
    'Fidži koostuu yli 300 saaresta, joista noin sata on asuttuja.',
    'Päivämäärän vaihtumislinja kulkee saarten läpi, mutta koko maa noudattaa samaa päivää.',
  ],
  auckland: [
    'Aucklandissa asuu noin kolmasosa koko Uuden-Seelannin väestöstä.',
    'Kaupunki on rakennettu yli 50 tulivuoren kartion päälle.',
    'Maorien kielellä maan nimi on Aotearoa, pitkän valkoisen pilven maa.',
  ],
  wellington: [
    'Wellington on maailman eteläisin itsenäisen valtion pääkaupunki.',
    'Kaupunkia kutsutaan tuuliseksi: Cookinsalmi ohjaa tuulet suoraan sen läpi.',
    'Salmi on kapeimmillaan noin 22 kilometriä leveä, ja sen yli kulkee autolautta.',
  ],
  christchurch: [
    'Christchurch on Eteläsaaren suurin kaupunki ja kärsi pahoin maanjäristyksissä 2010 ja 2011.',
    'Kaupungin länsipuolella kohoavat Eteläiset Alpit satoine jäätikköineen.',
    'Canterburyn lakeus kaupungin ympärillä on Uuden-Seelannin laajin tasanko.',
  ],
  milfordsound: [
    'Milford Soundin seinämät kohoavat yli 1 200 metriin suoraan merestä.',
    'Fiordlandin sateisimmilla alueilla sataa yli seitsemän metriä vuodessa.',
    'Kiivi, Uuden-Seelannin kansallislintu, ei osaa lentää ja munii kokoonsa nähden poikkeuksellisen suuren munan.',
  ],
  dili: [
    'Itä-Timor itsenäistyi 2002 ja on yksi maailman nuorimmista valtioista.',
    'Maa oli Portugalin siirtomaa yli 400 vuotta, ja portugali on yhä yksi virallisista kielistä.',
    'Timorin saaren länsiosa kuuluu Indonesiaan; itäosalla on lisäksi erillinen Oecussen alue.',
  ],
  bali: [
    'Bali on ainoa Indonesian saari, jossa enemmistö on hinduja.',
    'Saaren riisiterassit ja niiden subak-kastelujärjestelmä ovat Unescon maailmanperintökohde.',
    'Subak on toiminut yli tuhat vuotta: vesi jaetaan pelloille yhteisellä päätöksellä.',
  ],
};
