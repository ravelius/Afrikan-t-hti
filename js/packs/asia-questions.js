// Aasian laudan kysymykset ja "tiesitkö että" -tiedot.
//
// level: 1 = helppo, 2 = perus (oletus), 3 = vaikea.
// hint = ostettava vihje. Vihje ei saa sisältää oikeaa vastausta sellaisenaan.
// source = osoite, josta tieto on tarkistettu. Merkitään vain luetuista lähteistä.

export const ASIA_QUESTIONS = {
  jekaterinburg: [
    {
      q: 'Minkä vuoriston juurella Jekaterinburg sijaitsee?',
      options: ['Uralvuorten', 'Kaukasuksen', 'Altain', 'Himalajan'],
      correct: 0,
      level: 2,
      hint: 'Vuoristo on perinteinen raja Euroopan ja Aasian välillä.',
      fact: 'Kaupungin lähellä on kivipylväs, joka merkitsee maanosien rajaa: toinen jalka Euroopassa, toinen Aasiassa.',
    },
    {
      q: 'Mikä rautatie kulkee Jekaterinburgin kautta?',
      options: ['Transsiperian rata', 'Orient-pikajuna', 'Tren a las Nubes', 'Rautatie Kap–Kairo'],
      correct: 0,
      level: 2,
      hint: 'Rata on maailman pisin yhtenäinen junayhteys ja päättyy Vladivostokiin.',
      fact: 'Rata on Moskovasta Vladivostokiin noin 9 300 kilometriä, ja koko matka kestää lähes viikon.',
    },
  ],

  astana: [
    {
      q: 'Minkä maan pääkaupunki Astana on?',
      options: ['Kazakstanin', 'Uzbekistanin', 'Mongolian', 'Kirgisian'],
      correct: 0,
      level: 3,
      hint: 'Maa on maailman suurin sisämaavaltio ja ulottuu Kaspianmereltä Kiinaan.',
      fact: 'Pääkaupunki siirrettiin Almatysta tänne 1997. Talvella lämpötila laskee usein alle −30 asteen.',
    },
    {
      q: 'Mikä avaruustoiminnan keskus sijaitsee Kazakstanissa?',
      options: ['Baikonur', 'Cape Canaveral', 'Kourou', 'Plesetsk'],
      correct: 0,
      level: 3,
      hint: 'Täältä laukaistiin Sputnik ja Juri Gagarin.',
      fact: 'Kosmodromi rakennettiin 1955, ja Venäjä vuokraa aluetta Kazakstanilta. Ensimmäinen ihminen avaruuteen lähti täältä 1961.',
    },
  ],

  novosibirsk: [
    {
      q: 'Minkä maan kolmanneksi suurin kaupunki Novosibirsk on?',
      options: ['Venäjän', 'Kiinan', 'Kazakstanin', 'Mongolian'],
      correct: 0,
      level: 2,
      hint: 'Maa on maailman suurin pinta-alaltaan ja ulottuu yhdelletoista aikavyöhykkeelle.',
      fact: 'Kaupunki syntyi 1893, kun Transsiperian radalle rakennettiin silta Ob-joen yli. Se on Siperian suurin kaupunki.',
    },
    {
      q: 'Millaista metsävyöhykettä Siperiassa kasvaa laajimmin?',
      options: ['taigaa', 'sademetsää', 'savannia', 'mangrovea'],
      correct: 0,
      level: 2,
      hint: 'Vyöhyke on havumetsää, jota on myös Suomessa ja Kanadassa.',
      fact: 'Siperian taiga on maailman laajin yhtenäinen metsäalue. Sen alla on paikoin ikirouta.',
    },
  ],

  irkutsk: [
    {
      q: 'Minkä järven rannalla Irkutsk sijaitsee?',
      options: ['Baikalin', 'Kaspianmeren', 'Aralin', 'Balhašin'],
      correct: 0,
      level: 2,
      hint: 'Järvi on maailman syvin, yli 1 600 metriä.',
      fact: 'Baikalissa on noin viidennes maailman jäätymättömästä pintamakeasta vedestä — enemmän kuin kaikissa Suurissa järvissä yhteensä.',
    },
    {
      q: 'Mikä on erikoista Baikal-järven hylkeessä?',
      options: [
        'se on maailman ainoa kokonaan makeassa vedessä elävä hyljelaji',
        'se on maailman suurin hylje',
        'se elää puissa',
        'se ei osaa uida',
      ],
      correct: 0,
      level: 3,
      hint: 'Laji on nimeltään norppa, ja se on jäänyt eristyksiin sisämaahan.',
      fact: 'Baikalinnorppa on ainoa hyljelaji, joka elää koko elämänsä makeassa vedessä. Kukaan ei tiedä varmasti, miten se päätyi järveen.',
    },
  ],

  jakutsk: [
    {
      q: 'Mistä Jakutsk on maailmankuulu?',
      options: [
        'se on maailman kylmin suurehko kaupunki',
        'se on maailman kuumin kaupunki',
        'siellä sataa eniten',
        'se on maailman korkeimmalla',
      ],
      correct: 0,
      level: 2,
      hint: 'Talvilämpötilat laskevat säännöllisesti alle −40 asteen.',
      fact: 'Kaupunki on rakennettu ikiroudan päälle: talot seisovat paaluilla, jottei niiden lämpö sulattaisi maata alta.',
    },
    {
      q: 'Mitä ikirouta tarkoittaa?',
      options: [
        'maata, joka on jäässä ympäri vuoden',
        'jäätikköä vuoren huipulla',
        'jäätynyttä merta',
        'lumimyrskyä',
      ],
      correct: 0,
      level: 1,
      hint: 'Vain ohut pintakerros sulaa kesällä; sen alla maa pysyy jäässä.',
      fact: 'Jakutiassa ikirouta ulottuu paikoin yli kilometrin syvyyteen. Sen sulaessa maahan syntyy painanteita ja rakennukset kallistuvat.',
    },
  ],

  magadan: [
    {
      q: 'Minkä meren rannalla Magadan sijaitsee?',
      options: ['Ohotanmeren', 'Mustanmeren', 'Punaisenmeren', 'Välimeren'],
      correct: 0,
      level: 3,
      hint: 'Meri on Tyynenmeren pohjoinen sivumeri Kamtšatkan ja Siperian välissä.',
      fact: 'Magadan perustettiin 1930-luvulla kullan louhinnan ja pakkotyöleirien tukikohdaksi.',
    },
    {
      q: 'Mikä on Kolyman alueen tunnetuin luonnonvara?',
      options: ['kulta', 'öljy', 'timantit', 'kivihiili'],
      correct: 0,
      level: 3,
      hint: 'Metalli on keltaista, ja sen takia alueelle rakennettiin tie nimeltä Kolyman valtatie.',
      fact: 'Kolyman kultakentät olivat Neuvostoliiton tärkeimpiä. Alueen tietä kutsutaan sen historian takia luiden tieksi.',
    },
  ],

  kamtsatka: [
    {
      q: 'Mistä Kamtšatkan niemimaa on kuuluisa?',
      options: ['tulivuorista', 'aavikoista', 'koralliriutoista', 'suolatasangoista'],
      correct: 0,
      level: 2,
      hint: 'Alueella on yli kaksikymmentä aktiivista purkausaukkoa Tyynenmeren tulirenkaalla.',
      fact: 'Kamtšatkan tulivuoret ovat Unescon maailmanperintökohde. Kljutševskaja Sopka on Euraasian korkein aktiivinen tulivuori.',
    },
    {
      q: 'Mikä karhulaji elää Kamtšatkalla runsaana?',
      options: ['ruskeakarhu', 'jääkarhu', 'panda', 'silmälasikarhu'],
      correct: 0,
      level: 1,
      hint: 'Sama laji elää myös Suomessa, mutta Kamtšatkalla yksilöt ovat poikkeuksellisen suuria.',
      fact: 'Kamtšatkan karhut lihovat syksyllä jokiin nousevalla lohella. Niemimaalla elää tuhansia yksilöitä.',
    },
  ],

  sahalin: [
    {
      q: 'Mikä Sahalin on?',
      options: ['saari', 'vuori', 'joki', 'aavikko'],
      correct: 0,
      level: 1,
      hint: 'Se on Venäjän suurin laatuaan, kapea ja pitkä Ohotanmeressä.',
      fact: 'Sahalin on noin 950 kilometriä pitkä mutta kapeimmillaan vain 26 kilometriä leveä.',
    },
    {
      q: 'Mitä luonnonvaraa Sahalinin edustalta pumpataan?',
      options: ['öljyä ja maakaasua', 'kultaa', 'timantteja', 'uraania'],
      correct: 0,
      level: 3,
      hint: 'Merenpohjan esiintymät ovat Venäjän tärkeimpiä, ja niistä nesteytettynä laivataan Japaniin.',
      fact: 'Sahalinin edustan hankkeet ovat Venäjän suurimpia energiaprojekteja. Jäät vaikeuttavat työtä puolet vuodesta.',
    },
  ],

  vladivostok: [
    {
      q: 'Mihin kaupunkiin Transsiperian rata päättyy?',
      options: ['Vladivostokiin', 'Pekingiin', 'Tokioon', 'Soulíin'],
      correct: 0,
      level: 2,
      hint: 'Kaupunki on Venäjän tärkein Tyynenmeren satama.',
      fact: 'Rata on Moskovasta tänne noin 9 300 kilometriä. Nimi tarkoittaa venäjäksi idän hallitsijaa.',
    },
    {
      q: 'Minkä meren rannalla Vladivostok sijaitsee?',
      options: ['Japaninmeren', 'Punaisenmeren', 'Karibianmeren', 'Barentsinmeren'],
      correct: 0,
      level: 2,
      hint: 'Meri erottaa Venäjän ja Korean saaristomaasta idässä.',
      fact: 'Satama jäätyy talvella, ja sitä pidetään auki jäänmurtajilla.',
    },
  ],

  ulanbator: [
    {
      q: 'Minkä maan pääkaupunki Ulan Bator on?',
      options: ['Mongolian', 'Kiinan', 'Kazakstanin', 'Nepalin'],
      correct: 0,
      level: 2,
      hint: 'Maa on Kiinan ja Venäjän välissä, ja siellä on enemmän hevosia kuin ihmisiä.',
      fact: 'Ulan Bator on maailman kylmin pääkaupunki: vuoden keskilämpötila on pakkasen puolella.',
    },
    {
      q: 'Kuka mongolijohtaja loi 1200-luvulla historian suurimman yhtenäisen maaimperiumin?',
      options: ['Tšingis-kaani', 'Attila', 'Tamerlan', 'Kublai-kaani'],
      correct: 0,
      level: 2,
      hint: 'Hänen nimensä tarkoittaa valtamerten hallitsijaa, ja hänen pojanpoikansa valloitti Kiinan.',
      fact: 'Imperiumi ulottui laajimmillaan Tyyneltämereltä Itä-Eurooppaan. Se oli maailmanhistorian suurin yhtenäinen maa-alue.',
    },
    {
      q: 'Millaista asumusta mongolipaimentolaiset käyttävät?',
      options: ['jurttaa', 'igluta', 'tiipiitä', 'paalumajaa'],
      correct: 0,
      level: 3,
      hint: 'Asumus on pyöreä, huovalla verhottu ja kootaan uudelleen muutamassa tunnissa.',
      fact: 'Mongoliaksi asumusta kutsutaan nimellä ger. Sen ovi osoittaa perinteisesti etelään.',
    },
  ],

  peking: [
    {
      q: 'Minkä maan pääkaupunki Peking on?',
      options: ['Kiinan', 'Japanin', 'Korean', 'Mongolian'],
      correct: 0,
      level: 1,
      hint: 'Maa on maailman väkirikkaimpia ja sen lipussa on viisi keltaista tähteä.',
      fact: 'Nimi tarkoittaa pohjoista pääkaupunkia. Kielletty kaupunki oli keisarien palatsi lähes 500 vuotta.',
    },
    {
      q: 'Mikä valtava rakennelma kulkee Pekingin pohjoispuolella?',
      options: ['Kiinan muuri', 'Hadrianuksen muuri', 'Berliinin muuri', 'Itkumuuri'],
      correct: 0,
      level: 1,
      hint: 'Rakennelmaa rakennettiin vuosisatojen ajan pohjoisen ratsuväkeä vastaan.',
      fact: 'Kaikkine haaroineen muuria on yli 20 000 kilometriä. Se ei kuitenkaan näy avaruudesta paljain silmin.',
    },
    {
      q: 'Mikä oli Kielletty kaupunki?',
      options: [
        'keisarien palatsialue',
        'vankila',
        'kauppatori',
        'sotilastukikohta',
      ],
      correct: 0,
      level: 2,
      hint: 'Alueelle ei saanut astua ilman keisarin lupaa, ja siinä on lähes tuhat rakennusta.',
      fact: 'Palatsialue valmistui 1420 ja siellä asui 24 keisaria. Nykyään se on museo ja maailmanperintökohde.',
    },
  ],

  soul: [
    {
      q: 'Minkä maan pääkaupunki Soul on?',
      options: ['Etelä-Korean', 'Pohjois-Korean', 'Japanin', 'Kiinan'],
      correct: 0,
      level: 2,
      hint: 'Maa jakautui naapurinsa kanssa kahtia 1940-luvulla, ja tämä puoli jäi etelään.',
      fact: 'Soulin seudulla asuu noin puolet koko maan väestöstä. Raja pohjoiseen on vain 50 kilometrin päässä.',
    },
    {
      q: 'Mikä korealainen aakkosto luotiin 1440-luvulla lukutaidon helpottamiseksi?',
      options: ['hangul', 'kyrilliset', 'kanji', 'devanagari'],
      correct: 0,
      level: 3,
      hint: 'Kuningas Sejong teetti kirjaimiston, jonka muodot jäljittelevät suun asentoa.',
      fact: 'Aakkosto otettiin käyttöön 1446. Sitä pidetään yhtenä maailman järjestelmällisimmistä kirjoitusjärjestelmistä.',
    },
  ],

  xian: [
    {
      q: 'Mikä kuuluisa hauta-armeija löytyi Xi’anin läheltä 1974?',
      options: ['terrakotta-armeija', 'kultainen armeija', 'jadesoturit', 'pronssiratsastajat'],
      correct: 0,
      level: 2,
      hint: 'Kaivauksista paljastui tuhansia savesta poltettuja sotilaita, joilla jokaisella on omat kasvot.',
      fact: 'Talonpojat löysivät armeijan kaivaessaan kaivoa. Sotilaita on arviolta yli 8 000, ja ne vartioivat Kiinan ensimmäisen keisarin hautaa.',
    },
    {
      q: 'Mikä kauppareitti alkoi Xi’anista?',
      options: ['Silkkitie', 'Merensuolatie', 'Hansareitti', 'Teekaravaani Afrikkaan'],
      correct: 0,
      level: 2,
      hint: 'Reitti vei Keski-Aasian halki Välimerelle, ja sen tärkein vientituote oli hieno kangas.',
      fact: 'Xi’an oli kolmentoista dynastian pääkaupunki ja aikanaan yksi maailman suurimmista kaupungeista.',
    },
  ],

  shanghai: [
    {
      q: 'Mikä Shanghai on Kiinassa?',
      options: ['maan väkirikkain kaupunki', 'maan pääkaupunki', 'pieni kalastajakylä', 'vuoristokaupunki'],
      correct: 0,
      level: 2,
      hint: 'Kaupunki on Jangtsen suistossa, ja sen satama on maailman vilkkain.',
      fact: 'Shanghain satama käsittelee enemmän konttiliikennettä kuin mikään muu satama maailmassa.',
    },
    {
      q: 'Minkä joen suistossa Shanghai sijaitsee?',
      options: ['Jangtsen', 'Keltaisenjoen', 'Mekongin', 'Gangesin'],
      correct: 0,
      level: 3,
      hint: 'Joki on Aasian pisin, noin 6 300 kilometriä.',
      fact: 'Joen varrella on Kolmen rotkon pato, maailman suurin vesivoimalaitos.',
    },
  ],

  taipei: [
    {
      q: 'Millä saarella Taipei sijaitsee?',
      options: ['Taiwanilla', 'Okinawalla', 'Hainanilla', 'Luzonilla'],
      correct: 0,
      level: 2,
      hint: 'Saari tunnettiin ennen nimellä Formosa, mikä tarkoittaa portugaliksi kaunista.',
      fact: 'Saarella on korkeita vuoria: Yushan kohoaa lähes 4 000 metriin, vaikka saari on pieni.',
    },
    {
      q: 'Mistä Taiwan on maailmantaloudessa erityisen tärkeä?',
      options: ['mikrosiruista', 'öljystä', 'timanteista', 'kahvista'],
      correct: 0,
      level: 3,
      hint: 'Saarella valmistetaan suurin osa maailman kaikkein kehittyneimmistä puolijohteista.',
      fact: 'Yksi taiwanilainen yhtiö valmistaa valtaosan maailman edistyneimmistä siruista. Siksi saarta kutsutaan alan sydämeksi.',
    },
  ],

  hongkong: [
    {
      q: 'Mikä maa hallitsi Hongkongia vuoteen 1997 asti?',
      options: ['Britannia', 'Portugali', 'Alankomaat', 'Ranska'],
      correct: 0,
      level: 2,
      hint: 'Alue luovutettiin takaisin Kiinalle, kun 99 vuoden vuokrasopimus päättyi.',
      fact: 'Hongkong siirtyi Kiinalle 1997 erityishallintoalueena. Sen naapuri Macao siirtyi Portugalilta 1999.',
    },
    {
      q: 'Mistä Hongkongin kaupunkikuva on tunnettu?',
      options: [
        'valtavasta määrästä pilvenpiirtäjiä',
        'yhdestäkään korkeasta talosta',
        'puutaloista',
        'maanalaisista asunnoista',
      ],
      correct: 0,
      level: 1,
      hint: 'Tasaista maata on vähän ja ihmisiä paljon, joten on rakennettu ylöspäin.',
      fact: 'Hongkongissa on enemmän yli 150-metrisiä rakennuksia kuin missään muussa kaupungissa maailmassa.',
    },
  ],

  manila: [
    {
      q: 'Minkä maan pääkaupunki Manila on?',
      options: ['Filippiinien', 'Indonesian', 'Malesian', 'Vietnamin'],
      correct: 0,
      level: 2,
      hint: 'Maa koostuu yli 7 000 saaresta ja oli Espanjan siirtomaa yli 300 vuotta.',
      fact: 'Manila on Luzonin saarella. Espanjalaiset perustivat sen 1571, ja sieltä purjehti hopealaivoja Meksikoon.',
    },
    {
      q: 'Kuinka monta saarta Filippiineillä on suunnilleen?',
      options: ['yli 7 000', 'noin 50', 'noin 300', 'yli 100 000'],
      correct: 0,
      level: 3,
      hint: 'Määrä on yksi maailman suurimmista saarivaltioiden joukossa, mutta vain noin 2 000 saarta on asuttuja.',
      fact: 'Saaria on noin 7 640. Suurimmat ovat Luzon ja Mindanao, ja niillä asuu suurin osa väestöstä.',
    },
  ],

  hanoi: [
    {
      q: 'Minkä maan pääkaupunki Hanoi on?',
      options: ['Vietnamin', 'Laosin', 'Kambodžan', 'Thaimaan'],
      correct: 0,
      level: 2,
      hint: 'Maa on pitkä ja kapea Kiinan eteläpuolella, ja sen etelärannikolla on Mekongin suisto.',
      fact: 'Hanoi on yli tuhat vuotta vanha kaupunki Punaisenjoen suistossa. Nimi tarkoittaa jokien väliä.',
    },
    {
      q: 'Mikä kuuluisa lahti kalkkikivikallioineen on Hanoin lähellä?',
      options: ['Ha Long', 'Bengalinlahti', 'Persianlahti', 'Biskajanlahti'],
      correct: 0,
      level: 3,
      hint: 'Lahdesta kohoaa lähes 2 000 pystysuoraa kalliosaarta, ja sen nimi tarkoittaa laskeutuvaa lohikäärmettä.',
      fact: 'Lahti on Unescon maailmanperintökohde. Kalliot ovat kalkkikiveä, jota merivesi on syövyttänyt miljoonia vuosia.',
    },
  ],

  bangkok: [
    {
      q: 'Minkä maan pääkaupunki Bangkok on?',
      options: ['Thaimaan', 'Malesian', 'Myanmarin', 'Kambodžan'],
      correct: 0,
      level: 1,
      hint: 'Maa tunnettiin ennen nimellä Siam, eikä sitä koskaan siirtomaitettu.',
      fact: 'Bangkokin virallinen seremoniallinen nimi on maailman pisin paikannimi, yli 160 kirjainta.',
    },
    {
      q: 'Mikä uskonto on Thaimaassa vallitseva?',
      options: ['buddhalaisuus', 'islam', 'kristinusko', 'hindulaisuus'],
      correct: 0,
      level: 2,
      hint: 'Uskonnon perustaja syntyi Nepalissa, ja Thaimaassa on yli 30 000 sen temppeliä.',
      fact: 'Noin 90 prosenttia thaimaalaisista on buddhalaisia. Moni mies viettää osan elämästään munkkina.',
    },
  ],

  yangon: [
    {
      q: 'Minkä maan suurin kaupunki Yangon on?',
      options: ['Myanmarin', 'Thaimaan', 'Bangladeshin', 'Laosin'],
      correct: 0,
      level: 3,
      hint: 'Maa tunnettiin aiemmin nimellä Burma, ja sen pääkaupunki siirrettiin 2005 sisämaahan.',
      fact: 'Yangon oli maan pääkaupunki vuoteen 2005 asti. Sen jälkeen hallinto siirtyi Naypyidawiin.',
    },
    {
      q: 'Mikä kullattu pagodi on Yangonin maamerkki?',
      options: ['Shwedagon', 'Borobudur', 'Angkor Wat', 'Taj Mahal'],
      correct: 0,
      level: 3,
      hint: 'Pagodi on peitetty tonneilla kultalehteä, ja sen huipussa on tuhansia jalokiviä.',
      fact: 'Pagodi kohoaa lähes sata metriä. Sen kultaus uusitaan lahjoitusvaroin säännöllisesti.',
    },
  ],

  singapore: [
    {
      q: 'Millainen valtio Singapore on?',
      options: ['kaupunkivaltio', 'kuningaskunta mantereella', 'saariryhmä Tyynellämerellä', 'osa Malesiaa'],
      correct: 0,
      level: 2,
      hint: 'Koko maa mahtuu yhden suurkaupungin kokoiselle alueelle Malakan niemimaan kärkeen.',
      fact: 'Singapore itsenäistyi Malesiasta 1965. Se on yksi maailman tiheimmin asutuista maista.',
    },
    {
      q: 'Miksi Singaporen sijainti on kaupalle poikkeuksellisen tärkeä?',
      options: [
        'se vartioi Malakansalmea',
        'sillä on maailman suurimmat öljyvarat',
        'se on maailman korkeimmalla',
        'se on ainoa saari päiväntasaajalla',
      ],
      correct: 0,
      level: 3,
      hint: 'Salmi on lyhin meritie Intian valtamereltä Tyynellemerelle, ja siitä kulkee valtaosa Aasian laivaliikenteestä.',
      fact: 'Salmen kautta kulkee noin neljännes maailman kaupatuista tavaroista. Sen kapein kohta on vain muutaman kilometrin levyinen.',
    },
  ],

  sumatra: [
    {
      q: 'Minkä maan suurimpia saaria Sumatra on?',
      options: ['Indonesian', 'Malesian', 'Filippiinien', 'Thaimaan'],
      correct: 0,
      level: 2,
      hint: 'Maa on maailman suurin saarivaltio ja sen pääkaupunki on Jakarta.',
      fact: 'Sumatran halki kulkee päiväntasaaja. Saarella on sademetsää, tulivuoria ja maailman suurin kraatterijärvi Toba.',
    },
    {
      q: 'Mikä uhanalainen ihmisapina elää Sumatran sademetsissä?',
      options: ['orangutani', 'gorilla', 'simpanssi', 'gibboni'],
      correct: 0,
      level: 2,
      hint: 'Apinan nimi tarkoittaa malaijiksi metsän ihmistä, ja se on punaruskea.',
      fact: 'Sumatranorangutani on äärimmäisen uhanalainen. Sen elinympäristöä on raivattu palmuöljyplantaaseiksi.',
    },
  ],

  borneo: [
    {
      q: 'Kuinka monen maan kesken Borneon saari on jaettu?',
      options: ['kolmen', 'yhden', 'kahden', 'viiden'],
      correct: 0,
      level: 3,
      hint: 'Saarta hallitsevat Indonesia, Malesia ja pieni sulttaanikunta Brunei.',
      fact: 'Borneo on maailman kolmanneksi suurin saari. Indonesialla on siitä suurin osa, ja saarelle rakennetaan maan uutta pääkaupunkia.',
    },
    {
      q: 'Millaista metsää Borneolla kasvaa?',
      options: ['trooppista sademetsää', 'havumetsää', 'tammimetsää', 'tundraa'],
      correct: 0,
      level: 1,
      hint: 'Metsä on maailman vanhimpia ja lajirikkaimpia, ja siellä elää orangutaneja.',
      fact: 'Borneon sademetsä on arviolta yli 100 miljoonaa vuotta vanha. Siellä elää lajeja, joita ei tunneta mistään muualta.',
    },
  ],

  jakarta: [
    {
      q: 'Minkä maan pääkaupunki Jakarta on?',
      options: ['Indonesian', 'Malesian', 'Filippiinien', 'Vietnamin'],
      correct: 0,
      level: 2,
      hint: 'Maa koostuu yli 17 000 saaresta ja on maailman väkirikkaimpia.',
      fact: 'Jakarta on Javan saarella. Kaupunki vajoaa nopeasti, ja siksi maa rakentaa uutta pääkaupunkia Borneolle.',
    },
    {
      q: 'Miksi Indonesiassa on niin paljon tulivuoria?',
      options: [
        'se on Tyynenmeren tulirenkaalla',
        'siellä on kuuma ilmasto',
        'siellä sataa paljon',
        'se on päiväntasaajalla',
      ],
      correct: 0,
      level: 3,
      hint: 'Kaksi mannerlaattaa törmää saariketjun alla, ja toinen työntyy toisen alle.',
      fact: 'Indonesiassa on yli 120 aktiivista tulivuorta. Krakatau purkautui 1883 niin voimakkaasti, että ääni kuultiin tuhansien kilometrien päähän.',
    },
  ],

  lhasa: [
    {
      q: 'Minkä alueen pääkaupunki Lhasa on?',
      options: ['Tiibetin', 'Nepalin', 'Bhutanin', 'Mongolian'],
      correct: 0,
      level: 2,
      hint: 'Aluetta kutsutaan maailman katoksi, ja se on nykyään osa Kiinaa.',
      fact: 'Lhasa on noin 3 650 metrin korkeudessa. Potala-palatsi oli dalai-lamojen talvipalatsi.',
    },
    {
      q: 'Mikä on Tiibetin ylängön lempinimi?',
      options: ['maailman katto', 'maailman napa', 'maailman kaivo', 'maailman puutarha'],
      correct: 0,
      level: 2,
      hint: 'Ylänkö on keskimäärin yli 4 000 metrin korkeudessa — korkeampi kuin mikään muu laaja alue maailmassa.',
      fact: 'Ylängöltä saavat alkunsa Aasian suurimmat joet: Jangtse, Mekong, Ganges ja Indus.',
    },
  ],

  kathmandu: [
    {
      q: 'Minkä maan pääkaupunki Kathmandu on?',
      options: ['Nepalin', 'Bhutanin', 'Bangladeshin', 'Tiibetin'],
      correct: 0,
      level: 2,
      hint: 'Maassa on kahdeksan maailman kymmenestä korkeimmasta vuoresta.',
      fact: 'Kathmandu on Himalajan retkikuntien lähtöpiste. Laakso on täynnä vanhoja temppeleitä ja palatsitoreja.',
    },
    {
      q: 'Mikä kansa tunnetaan Himalajan vuorikiipeilijöiden oppaina ja kantajina?',
      options: ['šerpat', 'beduiinit', 'inuiitit', 'maasait'],
      correct: 0,
      level: 3,
      hint: 'Kansa muutti Tiibetistä Nepaliin satoja vuosia sitten ja on sopeutunut ohueen ilmaan.',
      fact: 'Tenzing Norgay nousi Edmund Hillaryn kanssa Everestin huipulle 1953. Kansan nimestä on tullut ammattinimike.',
    },
  ],

  delhi: [
    {
      q: 'Minkä maan pääkaupunki New Delhi on?',
      options: ['Intian', 'Pakistanin', 'Bangladeshin', 'Nepalin'],
      correct: 0,
      level: 1,
      hint: 'Maa on maailman väkirikkain ja itsenäistyi Britanniasta 1947.',
      fact: 'Delhi on yksi maailman suurimmista kaupunkialueista. New Delhi rakennettiin 1910-luvulta alkaen hallintokaupungiksi vanhan Delhin viereen.',
    },
    {
      q: 'Mikä valkoinen marmorimausoleumi on Delhin lähellä Agrassa?',
      options: ['Taj Mahal', 'Angkor Wat', 'Borobudur', 'Potala'],
      correct: 0,
      level: 1,
      hint: 'Mogulihallitsija Shah Jahan rakennutti sen puolisonsa muistoksi 1600-luvulla.',
      fact: 'Rakennus valmistui 1653, ja sen rakentamiseen meni yli kaksikymmentä vuotta. Marmori vaihtaa sävyä vuorokaudenajan mukaan.',
    },
  ],

  kolkata: [
    {
      q: 'Minkä joen suistossa Kolkata sijaitsee?',
      options: ['Gangesin', 'Indus-joen', 'Mekongin', 'Jangtsen'],
      correct: 0,
      level: 2,
      hint: 'Joki on hindulaisuudessa pyhä ja saa alkunsa Himalajalta.',
      fact: 'Gangesin ja Brahmaputran yhteinen suisto on maailman suurin. Sen mangrovemetsissä elää bengalintiikereitä.',
    },
    {
      q: 'Mikä kaupunki oli Brittiläisen Intian pääkaupunki vuoteen 1911 asti?',
      options: ['Kolkata', 'Mumbai', 'Delhi', 'Chennai'],
      correct: 0,
      level: 3,
      hint: 'Kaupunki tunnettiin silloin nimellä Calcutta ja oli Britannian valtakunnan toiseksi suurin kaupunki.',
      fact: 'Pääkaupunki siirrettiin Delhiin 1911. Kaupunki on yhä Intian kulttuurin ja kirjallisuuden keskuksia.',
    },
  ],

  mumbai: [
    {
      q: 'Mikä elokuvateollisuuden keskus toimii Mumbaissa?',
      options: ['Bollywood', 'Hollywood', 'Cinecittà', 'Nollywood'],
      correct: 0,
      level: 1,
      hint: 'Nimi yhdistää kaupungin vanhan nimen Bombay ja Los Angelesin elokuvakaupunginosan.',
      fact: 'Intiassa tehdään vuosittain enemmän elokuvia kuin missään muussa maassa.',
    },
    {
      q: 'Mikä Mumbai on Intiassa?',
      options: ['maan talouden keskus', 'maan pääkaupunki', 'pieni vuoristokylä', 'maan pohjoisin kaupunki'],
      correct: 0,
      level: 2,
      hint: 'Kaupungissa ovat maan pörssi ja keskuspankki, mutta hallitus istuu muualla.',
      fact: 'Mumbai rakennettiin seitsemälle saarelle, jotka yhdistettiin maankohotustöillä yhdeksi niemekkeeksi.',
    },
  ],

  chennai: [
    {
      q: 'Millä Intian rannikolla Chennai sijaitsee?',
      options: ['itärannikolla', 'länsirannikolla', 'pohjoisrannikolla', 'sisämaassa'],
      correct: 0,
      level: 3,
      hint: 'Kaupunki on Bengalinlahden puolella, vastapäätä Mumbaita.',
      fact: 'Chennai tunnettiin ennen nimellä Madras. Se on eteläisen Intian suurimpia kaupunkeja ja tamilikulttuurin keskus.',
    },
    {
      q: 'Mikä kieli on Chennain seudun pääkieli?',
      options: ['tamili', 'hindi', 'bengali', 'urdu'],
      correct: 0,
      level: 3,
      hint: 'Kieli on yksi maailman vanhimmista yhä puhutuista kirjakielistä ja kuuluu dravidakieliin.',
      fact: 'Kieltä puhutaan myös Sri Lankassa ja Singaporessa, joissa se on virallinen kieli.',
    },
  ],

  colombo: [
    {
      q: 'Minkä saarivaltion suurin kaupunki Colombo on?',
      options: ['Sri Lankan', 'Malediivien', 'Madagaskarin', 'Kyproksen'],
      correct: 0,
      level: 2,
      hint: 'Saari tunnettiin ennen nimellä Ceylon ja on Intian kaakkoispuolella.',
      fact: 'Colombo on maan suurin kaupunki ja satama, mutta hallinnollinen pääkaupunki on sen esikaupungissa Sri Jayawardenepura Kottessa.',
    },
    {
      q: 'Mistä juomasta Sri Lanka on maailmankuulu?',
      options: ['teestä', 'kahvista', 'kaakaosta', 'oluesta'],
      correct: 0,
      level: 1,
      hint: 'Vuoriston viljelmiä kutsutaan yhä saaren vanhalla nimellä Ceylon.',
      fact: 'Britit istuttivat teetä saarelle 1860-luvulla, kun kahviviljelmät tuhoutuivat kasvitautiin.',
    },
  ],

  karachi: [
    {
      q: 'Minkä maan suurin kaupunki Karachi on?',
      options: ['Pakistanin', 'Intian', 'Iranin', 'Afganistanin'],
      correct: 0,
      level: 2,
      hint: 'Maa syntyi 1947, kun Brittiläinen Intia jaettiin kahtia.',
      fact: 'Karachi oli maan ensimmäinen pääkaupunki. Nykyään hallinto istuu Islamabadissa, mutta Karachi on yhä suurin kaupunki ja satama.',
    },
    {
      q: 'Minkä joen laaksossa kukoisti yksi maailman vanhimmista kaupunkikulttuureista?',
      options: ['Indus-joen', 'Gangesin', 'Mekongin', 'Jangtsen'],
      correct: 0,
      level: 3,
      hint: 'Kulttuurin kaupungeissa Mohenjo-darossa ja Harappassa oli viemärit jo 4 500 vuotta sitten.',
      fact: 'Kulttuuri kukoisti noin 2600–1900 eaa. Sen kirjoitusta ei ole vieläkään pystytty lukemaan.',
    },
  ],

  kabul: [
    {
      q: 'Minkä maan pääkaupunki Kabul on?',
      options: ['Afganistanin', 'Pakistanin', 'Iranin', 'Tadžikistanin'],
      correct: 0,
      level: 2,
      hint: 'Maa on vuoristoinen sisämaavaltio Iranin ja Pakistanin välissä.',
      fact: 'Kabul on noin 1 800 metrin korkeudessa vuorten ympäröimässä laaksossa. Kaupunki on ollut Silkkitien risteyspaikka yli 3 000 vuotta.',
    },
    {
      q: 'Mikä vuoristo kohoaa Kabulin pohjoispuolella?',
      options: ['Hindukuš', 'Kaukasus', 'Altai', 'Uralvuoret'],
      correct: 0,
      level: 3,
      hint: 'Vuoristo on Himalajan läntinen jatke, ja sen solat ovat olleet valloittajien reitti Intiaan.',
      fact: 'Vuoriston huiput kohoavat yli 7 000 metriin. Khyberin sola sen eteläpuolella on ollut kauppa- ja sotatie vuosituhansia.',
    },
  ],

  samarkand: [
    {
      q: 'Minkä kauppareitin kuuluisa kaupunki Samarkand on?',
      options: ['Silkkitien', 'Hansareitin', 'Merenkulun mausteväylän', 'Kolyman valtatien'],
      correct: 0,
      level: 2,
      hint: 'Reitti kuljetti kiinalaista kangasta Välimerelle karavaanien selässä.',
      fact: 'Samarkand on yksi maailman vanhimmista yhtäjaksoisesti asutuista kaupungeista. Registanin aukio siniturkooseine medreseineen on maailmanperintökohde.',
    },
    {
      q: 'Minkä maan kaupunki Samarkand on nykyään?',
      options: ['Uzbekistanin', 'Kazakstanin', 'Turkmenistanin', 'Tadžikistanin'],
      correct: 0,
      level: 3,
      hint: 'Maa on yksi maailman kahdesta valtiosta, joita ympäröivät pelkät sisämaavaltiot.',
      fact: 'Tamerlan teki kaupungista valtakuntansa pääkaupungin 1300-luvulla ja rakennutti sinne mahtavia rakennuksia.',
    },
  ],

  kashgar: [
    {
      q: 'Mikä Kašgar oli Silkkitien varrella?',
      options: [
        'reitin pohjoisen ja eteläisen haaran risteys',
        'reitin päätepiste',
        'satamakaupunki',
        'tulivuori',
      ],
      correct: 0,
      level: 3,
      hint: 'Kaupunki on Taklamakanin autiomaan länsilaidalla, jossa aavikon molemmin puolin kiertäneet reitit yhtyivät.',
      fact: 'Kašgarin torilla on käyty kauppaa yli kahden vuosituhannen ajan. Kaupunki on Kiinan läntisimpiä.',
    },
    {
      q: 'Mikä autiomaa on Kašgarin itäpuolella?',
      options: ['Taklamakan', 'Gobi', 'Sahara', 'Atacama'],
      correct: 0,
      level: 3,
      hint: 'Nimeä on tulkittu tarkoittavan paikkaa, josta ei ole paluuta.',
      fact: 'Autiomaa on yksi maailman suurimmista hiekka-autiomaista. Karavaanit kiersivät sen aina reunoja pitkin keitaalta toiselle.',
    },
  ],

  teheran: [
    {
      q: 'Minkä maan pääkaupunki Teheran on?',
      options: ['Iranin', 'Irakin', 'Afganistanin', 'Turkin'],
      correct: 0,
      level: 1,
      hint: 'Maa tunnettiin ennen vuotta 1935 nimellä Persia.',
      fact: 'Teheran on Elburz-vuorten juurella. Kaupungin pohjoisosat ovat satoja metrejä korkeammalla kuin eteläosat.',
    },
    {
      q: 'Mikä kieli on Iranin virallinen kieli?',
      options: ['persia', 'arabia', 'turkki', 'urdu'],
      correct: 0,
      level: 2,
      hint: 'Kieli on indoeurooppalainen, vaikka se kirjoitetaan arabialaisin kirjaimin.',
      fact: 'Persia eli farsi on sukua Euroopan kielille, toisin kuin arabia. Sitä puhutaan myös Afganistanissa ja Tadžikistanissa.',
    },
  ],

  tokio: [
    {
      q: 'Minkä maan pääkaupunki Tokio on?',
      options: ['Japanin', 'Etelä-Korean', 'Kiinan', 'Taiwanin'],
      correct: 0,
      level: 1,
      hint: 'Maan lipussa on punainen ympyrä valkoisella pohjalla.',
      fact: 'Tokion metropolialue on väkiluvultaan maailman suurin: siellä asuu yli 35 miljoonaa ihmistä.',
    },
    {
      q: 'Miksi Japanissa tapahtuu paljon maanjäristyksiä?',
      options: [
        'saaret ovat useiden mannerlaattojen saumassa',
        'siellä on paljon kaivoksia',
        'meri on syvä',
        'siellä sataa paljon',
      ],
      correct: 0,
      level: 2,
      hint: 'Alue kuuluu Tyynenmeren tulirenkaaseen, jossa laatat työntyvät toistensa alle.',
      fact: 'Japanissa mitataan vuosittain tuhansia järistyksiä. Rakennukset suunnitellaan joustamaan niiden mukana.',
    },
    {
      q: 'Mikä on Japanin korkein vuori?',
      options: ['Fuji', 'Everest', 'Kilimandžaro', 'Elbrus'],
      correct: 0,
      level: 1,
      hint: 'Vuori on lähes täydellisen kartion muotoinen tulivuori Tokion lounaispuolella.',
      fact: 'Vuori kohoaa 3 776 metriin. Se on yhä aktiivinen tulivuori, vaikka viimeisestä purkauksesta on yli 300 vuotta.',
    },
  ],

  general: [
    {
      q: 'Mikä on maailman korkein vuori?',
      options: ['Mount Everest', 'K2', 'Kilimandžaro', 'Mont Blanc'],
      correct: 0,
      level: 1,
      hint: 'Vuori on Nepalin ja Kiinan rajalla ja kohoaa yli 8 800 metriin.',
      fact: 'Huippu on 8 849 metrissä. Se nousee yhä muutaman millimetrin vuodessa, kun mannerlaatat törmäävät.',
    },
    {
      q: 'Mikä on Aasian pisin joki?',
      options: ['Jangtse', 'Ganges', 'Mekong', 'Indus'],
      correct: 0,
      level: 2,
      hint: 'Joki virtaa Tiibetiltä Shanghain kohdalle ja on maailman kolmanneksi pisin.',
      fact: 'Joki on noin 6 300 kilometriä pitkä. Sen varrella on Kolmen rotkon pato, maailman suurin vesivoimalaitos.',
    },
    {
      q: 'Mikä on maailman suurin järvi pinta-alaltaan?',
      options: ['Kaspianmeri', 'Baikal', 'Yläjärvi', 'Viktoriajärvi'],
      correct: 0,
      level: 3,
      hint: 'Vesi on suolaista, mutta järvellä ei ole yhteyttä valtamereen.',
      fact: 'Pinta-ala on noin 371 000 neliökilometriä. Sitä ympäröi viisi valtiota.',
    },
    {
      q: 'Mikä vuoristo erottaa Intian niemimaan muusta Aasiasta?',
      options: ['Himalaja', 'Andit', 'Alpit', 'Kalliovuoret'],
      correct: 0,
      level: 1,
      hint: 'Vuoristossa ovat kaikki maailman yli 8 000 metrin huiput.',
      fact: 'Vuoristo syntyi, kun Intian mannerlaatta törmäsi Aasiaan noin 50 miljoonaa vuotta sitten. Törmäys jatkuu yhä.',
    },
    {
      q: 'Mikä tuulijärjestelmä tuo Etelä-Aasiaan sadekauden?',
      options: ['monsuuni', 'passaatituuli', 'hurrikaani', 'mistraali'],
      correct: 0,
      level: 2,
      hint: 'Tuuli kääntyy vuodenajan mukaan: kesällä mereltä maalle, talvella toisin päin.',
      fact: 'Kesäsateet tuovat suurimman osan Intian vuotuisesta sademäärästä muutamassa kuukaudessa. Koko maanviljely on niiden varassa.',
    },
    {
      q: 'Mikä uskonto sai alkunsa Intiasta ja levisi Kiinaan ja Japaniin?',
      options: ['buddhalaisuus', 'islam', 'juutalaisuus', 'kristinusko'],
      correct: 0,
      level: 2,
      hint: 'Perustaja Siddhartha Gautama syntyi nykyisen Nepalin alueella noin 2 500 vuotta sitten.',
      fact: 'Uskonto levisi Silkkitietä pitkin Kiinaan ja sieltä Koreaan ja Japaniin.',
    },
    {
      q: 'Mikä on maailman väkirikkain maa?',
      options: ['Intia', 'Kiina', 'Indonesia', 'Yhdysvallat'],
      correct: 0,
      level: 2,
      hint: 'Maa ohitti naapurinsa väkiluvussa vuonna 2023.',
      fact: 'Molemmissa asuu yli 1,4 miljardia ihmistä eli yhdessä yli kolmannes koko maailman väestöstä.',
    },
    {
      q: 'Mikä autiomaa levittäytyy Mongolian ja Kiinan rajalle?',
      options: ['Gobi', 'Sahara', 'Kalahari', 'Atacama'],
      correct: 0,
      level: 2,
      hint: 'Autiomaan nimi tarkoittaa mongoliaksi vedetöntä paikkaa, ja siellä on löydetty dinosaurusten munia.',
      fact: 'Autiomaa on kylmä: talvella lämpötila laskee alle −30 asteen. Sieltä löydettiin 1920-luvulla ensimmäiset tunnetut dinosaurusten pesät.',
    },
    {
      q: 'Mikä kirjoitusjärjestelmä on käytössä Kiinassa?',
      options: ['merkkikirjoitus', 'latinalaiset aakkoset', 'kyrilliset aakkoset', 'nuolenpääkirjoitus'],
      correct: 0,
      level: 2,
      hint: 'Jokainen merkki vastaa sanaa tai sen osaa, eikä yksittäistä äännettä.',
      fact: 'Merkkejä on kymmeniätuhansia, mutta arjessa pärjää noin kolmella tuhannella. Kirjoitusta on käytetty yli 3 000 vuotta.',
    },
    {
      q: 'Mikä eläin on Kiinan tunnus ja syö lähes yksinomaan bambua?',
      options: ['isopanda', 'tiikeri', 'norsu', 'kameli'],
      correct: 0,
      level: 1,
      hint: 'Eläin on mustavalkoinen ja elää Kiinan vuoristometsissä.',
      fact: 'Eläin syö bambua jopa 14 tuntia vuorokaudessa, vaikka sen ruoansulatus on lihansyöjän. Kanta on suojelun ansiosta kasvanut.',
    },
    {
      q: 'Mikä on maailman syvin järvi?',
      options: ['Baikal', 'Tanganjika', 'Kaspianmeri', 'Titicaca'],
      correct: 0,
      level: 2,
      hint: 'Järvi on Siperiassa, ja sen syvyys ylittää 1 600 metriä.',
      fact: 'Järvessä on noin viidennes maailman jäätymättömästä pintamakeasta vedestä.',
    },
    {
      q: 'Mikä salmi on Aasian ja Pohjois-Amerikan välissä?',
      options: ['Beringinsalmi', 'Gibraltarin salmi', 'Bosporinsalmi', 'Malakansalmi'],
      correct: 0,
      level: 3,
      hint: 'Salmi on vain noin 82 kilometriä leveä, ja sen yli kulki jääkaudella maasilta.',
      fact: 'Salmen keskellä kulkee sekä valtioiden raja että päivämäärän vaihtumislinja: saarilta toiselle katsoessa näkee eri päivän.',
    },
    {
      q: 'Mikä on maailman suurin saarivaltio saarten lukumäärällä mitattuna?',
      options: ['Indonesia', 'Japani', 'Filippiinit', 'Malediivit'],
      correct: 0,
      level: 3,
      hint: 'Maassa on yli 17 000 saarta ja sen pääkaupunki on Jakarta.',
      fact: 'Maa ulottuu idästä länteen yli 5 000 kilometriä eli kauemmas kuin Euroopan halki.',
    },
    {
      q: 'Mikä kirjoitusmateriaali keksittiin Kiinassa noin 2 000 vuotta sitten?',
      options: ['paperi', 'papyrus', 'pergamentti', 'savitaulu'],
      correct: 0,
      level: 2,
      hint: 'Materiaali tehtiin kasvikuiduista, ja resepti levisi länteen vasta satoja vuosia myöhemmin.',
      fact: 'Paperin valmistus levisi Kiinasta arabien kautta Eurooppaan. Samarkand oli yksi ensimmäisistä paperikaupungeista Kiinan ulkopuolella.',
    },
    {
      q: 'Mikä maa on maailman suurin pinta-alaltaan?',
      options: ['Venäjä', 'Kiina', 'Kanada', 'Intia'],
      correct: 0,
      level: 1,
      hint: 'Maa ulottuu yhdelletoista aikavyöhykkeelle Itämereltä Tyynellemerelle.',
      fact: 'Maasta noin kolme neljäsosaa on Aasian puolella, mutta suurin osa väestöstä asuu Euroopan puolella.',
    },
  ],
};

export const ASIA_FACTS = {
  teheran: [
    'Teheran on Elburz-vuorten juurella; kaupungin pohjoisosat ovat satoja metrejä korkeammalla kuin eteläosat.',
    'Iran tunnettiin ennen vuotta 1935 nimellä Persia, ja sen kieli farsi on indoeurooppalainen.',
    'Kaupungin liikennettä varjostaa usein saastesumu, koska vuoret estävät ilmaa vaihtumasta.',
  ],
  tokio: [
    'Tokion metropolialueella asuu yli 35 miljoonaa ihmistä — enemmän kuin missään muussa kaupunkialueessa maailmassa.',
    'Kaupunki tunnettiin vuoteen 1868 asti nimellä Edo.',
    'Shibuyan risteystä ylittää ruuhka-aikaan kerralla tuhansia jalankulkijoita.',
  ],
  jekaterinburg: [
    'Jekaterinburgin lähellä on kivipylväs, joka merkitsee Euroopan ja Aasian rajaa.',
    'Kaupunki perustettiin 1723 rautaruukiksi Uralin malmivarojen ääreen.',
    'Transsiperian rata kulkee kaupungin kautta; Moskovaan on noin 1 800 kilometriä.',
  ],
  astana: [
    'Kazakstanin pääkaupunki siirrettiin Almatysta Astanaan vuonna 1997.',
    'Astana on yksi maailman kylmimmistä pääkaupungeista: talvella lämpötila laskee usein alle −30 asteen.',
    'Kazakstan on maailman suurin sisämaavaltio, ja siellä sijaitsee Baikonurin kosmodromi.',
  ],
  novosibirsk: [
    'Novosibirsk syntyi 1893, kun Transsiperian radalle rakennettiin silta Ob-joen yli.',
    'Se on Siperian suurin kaupunki ja Venäjän kolmanneksi suurin.',
    'Kaupungin kupeessa on Akademgorodok, neuvostoaikana perustettu tiedekaupunki.',
  ],
  irkutsk: [
    'Irkutsk on Baikal-järven kupeessa; järvi on maailman syvin, yli 1 600 metriä.',
    'Baikalissa on noin viidennes maailman jäätymättömästä pintamakeasta vedestä.',
    'Baikalinnorppa on maailman ainoa hyljelaji, joka elää koko elämänsä makeassa vedessä.',
  ],
  jakutsk: [
    'Jakutsk on maailman kylmimpiä kaupunkeja: talvella lämpötila laskee säännöllisesti alle −40 asteen.',
    'Talot on rakennettu paaluille, jottei niiden lämpö sulattaisi ikiroutaa alta.',
    'Jakutiassa ikirouta ulottuu paikoin yli kilometrin syvyyteen.',
  ],
  magadan: [
    'Magadan perustettiin 1930-luvulla kullan louhinnan ja pakkotyöleirien tukikohdaksi.',
    'Kolyman valtatietä kutsutaan sen historian takia luiden tieksi.',
    'Kaupunki on Ohotanmeren rannalla, ja satama jäätyy talveksi.',
  ],
  kamtsatka: [
    'Kamtšatkan tulivuoret ovat Unescon maailmanperintökohde; niitä on yli kaksikymmentä aktiivista.',
    'Kljutševskaja Sopka on Euraasian korkein aktiivinen tulivuori, yli 4 700 metriä.',
    'Niemimaan joet täyttyvät kesällä lohesta, ja karhut kerääntyvät niiden rannoille.',
  ],
  sahalin: [
    'Sahalin on Venäjän suurin saari: noin 950 kilometriä pitkä mutta kapeimmillaan 26 kilometriä leveä.',
    'Saaren edustan öljy- ja kaasuhankkeet ovat Venäjän suurimpia energiaprojekteja.',
    'Saari kuului osittain Japanille vuosina 1905–1945.',
  ],
  vladivostok: [
    'Transsiperian rata päättyy Vladivostokiin; Moskovasta on matkaa noin 9 300 kilometriä.',
    'Kaupungin nimi tarkoittaa venäjäksi idän hallitsijaa.',
    'Satama jäätyy talvella, ja sitä pidetään auki jäänmurtajilla.',
  ],
  ulanbator: [
    'Ulan Bator on maailman kylmin pääkaupunki: vuoden keskilämpötila on pakkasen puolella.',
    'Mongoliassa on enemmän hevosia kuin ihmisiä.',
    'Kaupungin laidoilla asutaan yhä jurtissa, joita mongoliaksi kutsutaan nimellä ger.',
  ],
  peking: [
    'Pekingin nimi tarkoittaa pohjoista pääkaupunkia.',
    'Kielletty kaupunki valmistui 1420, ja siellä asui 24 keisaria.',
    'Kiinan muuria on kaikkine haaroineen yli 20 000 kilometriä, mutta se ei näy avaruudesta paljain silmin.',
  ],
  soul: [
    'Soulin seudulla asuu noin puolet Etelä-Korean väestöstä.',
    'Raja Pohjois-Koreaan on vain noin 50 kilometrin päässä kaupungista.',
    'Korean hangul-aakkosto luotiin 1440-luvulla, ja sen kirjainten muodot jäljittelevät suun asentoa.',
  ],
  xian: [
    'Xi’anin läheltä löytyi 1974 terrakotta-armeija: arviolta yli 8 000 savisoturia.',
    'Kaupunki oli kolmentoista dynastian pääkaupunki ja Silkkitien itäinen päätepiste.',
    'Vanhan kaupungin ympärillä on yhä ehjä 14 kilometrin pituinen muuri.',
  ],
  shanghai: [
    'Shanghain satama käsittelee enemmän konttiliikennettä kuin mikään muu satama maailmassa.',
    'Kaupunki on Jangtsen suistossa; joki on Aasian pisin, noin 6 300 kilometriä.',
    'Bundin rantabulevardin rakennukset ovat 1900-luvun alun eurooppalaisten pankkien perua.',
  ],
  taipei: [
    'Taiwan tunnettiin ennen nimellä Formosa, mikä tarkoittaa portugaliksi kaunista.',
    'Saaren Yushan-vuori kohoaa lähes 4 000 metriin.',
    'Saarella valmistetaan suurin osa maailman kaikkein kehittyneimmistä mikrosiruista.',
  ],
  hongkong: [
    'Hongkong siirtyi Britannialta Kiinalle 1997 erityishallintoalueena.',
    'Kaupungissa on enemmän yli 150-metrisiä rakennuksia kuin missään muualla maailmassa.',
    'Victoria Peakille nouseva vaunurata on kulkenut vuodesta 1888.',
  ],
  manila: [
    'Manilan perustivat espanjalaiset 1571, ja sieltä purjehti hopealaivoja Meksikoon.',
    'Filippiineillä on noin 7 640 saarta, joista vain noin 2 000 on asuttuja.',
    'Maa oli Espanjan siirtomaa yli 300 vuotta, ja siksi enemmistö on katolilaisia.',
  ],
  hanoi: [
    'Hanoi on yli tuhat vuotta vanha kaupunki Punaisenjoen suistossa.',
    'Ha Longin lahdesta kohoaa lähes 2 000 pystysuoraa kalkkikivisaarta.',
    'Kaupungin vanhassakaupungissa kadut on nimetty niillä myydyn tavaran mukaan.',
  ],
  bangkok: [
    'Bangkokin seremoniallinen nimi on maailman pisin paikannimi, yli 160 kirjainta.',
    'Thaimaa on ainoa Kaakkois-Aasian maa, jota ei koskaan siirtomaitettu.',
    'Noin 90 prosenttia thaimaalaisista on buddhalaisia, ja maassa on yli 30 000 temppeliä.',
  ],
  yangon: [
    'Yangon oli Myanmarin pääkaupunki vuoteen 2005 asti, jolloin hallinto siirtyi Naypyidawiin.',
    'Shwedagon-pagodi kohoaa lähes sata metriä ja on peitetty kultalehdellä.',
    'Maa tunnettiin aiemmin nimellä Burma.',
  ],
  singapore: [
    'Singapore itsenäistyi Malesiasta 1965 ja on yksi maailman tiheimmin asutuista maista.',
    'Malakansalmen kautta kulkee noin neljännes maailman kaupatuista tavaroista.',
    'Maalla on neljä virallista kieltä: englanti, malaiji, mandariinikiina ja tamili.',
  ],
  sumatra: [
    'Sumatran halki kulkee päiväntasaaja.',
    'Saarella on Toba, maailman suurin kraatterijärvi: se syntyi valtavassa purkauksessa noin 74 000 vuotta sitten.',
    'Sumatranorangutani on äärimmäisen uhanalainen, kun sademetsää raivataan plantaaseiksi.',
  ],
  borneo: [
    'Borneo on maailman kolmanneksi suurin saari ja jaettu Indonesian, Malesian ja Brunein kesken.',
    'Saaren sademetsä on arviolta yli 100 miljoonaa vuotta vanha.',
    'Indonesia rakentaa saarelle uutta pääkaupunkiaan, koska Jakarta vajoaa.',
  ],
  jakarta: [
    'Jakarta on Javan saarella, joka on maailman tiheimmin asuttu suuri saari.',
    'Kaupunki vajoaa nopeasti, koska pohjavettä pumpataan sen alta.',
    'Indonesiassa on yli 120 aktiivista tulivuorta; Krakataun purkaus 1883 kuultiin tuhansien kilometrien päähän.',
  ],
  lhasa: [
    'Lhasa on noin 3 650 metrin korkeudessa, ja Potala-palatsi oli dalai-lamojen talvipalatsi.',
    'Tiibetin ylänkö on keskimäärin yli 4 000 metrin korkeudessa ja sitä kutsutaan maailman katoksi.',
    'Ylängöltä saavat alkunsa Jangtse, Mekong, Ganges ja Indus.',
  ],
  kathmandu: [
    'Kathmandu on Himalajan retkikuntien lähtöpiste, ja laakso on täynnä vanhoja temppeleitä.',
    'Nepalissa on kahdeksan maailman kymmenestä korkeimmasta vuoresta.',
    'Šerpat muuttivat Tiibetistä Nepaliin satoja vuosia sitten ja ovat sopeutuneet ohueen ilmaan.',
  ],
  delhi: [
    'Delhi on yksi maailman suurimmista kaupunkialueista.',
    'New Delhi rakennettiin 1910-luvulta alkaen hallintokaupungiksi vanhan Delhin viereen.',
    'Agran Taj Mahal valmistui 1653, ja sen marmori vaihtaa sävyä vuorokaudenajan mukaan.',
  ],
  kolkata: [
    'Kolkata oli Brittiläisen Intian pääkaupunki vuoteen 1911 asti.',
    'Gangesin ja Brahmaputran yhteinen suisto on maailman suurin.',
    'Suiston mangrovemetsissä eli Sundarbansissa elää bengalintiikereitä.',
  ],
  mumbai: [
    'Mumbai rakennettiin seitsemälle saarelle, jotka yhdistettiin maankohotustöillä.',
    'Kaupunki on Intian talouden keskus: siellä ovat maan pörssi ja keskuspankki.',
    'Bollywood tekee vuosittain satoja elokuvia, ja Intiassa valmistuu niitä enemmän kuin missään muualla.',
  ],
  chennai: [
    'Chennai tunnettiin ennen nimellä Madras ja on eteläisen Intian suurimpia kaupunkeja.',
    'Alueen kieli tamili on yksi maailman vanhimmista yhä puhutuista kirjakielistä.',
    'Marina Beach on yksi maailman pisimmistä kaupunkirannoista.',
  ],
  colombo: [
    'Colombo on Sri Lankan suurin kaupunki ja satama.',
    'Saari tunnettiin ennen nimellä Ceylon, ja sen teetä myydään yhä sillä nimellä.',
    'Britit istuttivat teetä saarelle 1860-luvulla, kun kahviviljelmät tuhoutuivat kasvitautiin.',
  ],
  karachi: [
    'Karachi oli Pakistanin ensimmäinen pääkaupunki ja on yhä maan suurin kaupunki ja satama.',
    'Indus-joen laaksossa kukoisti 4 500 vuotta sitten kaupunkikulttuuri, jonka kaupungeissa oli viemärit.',
    'Kulttuurin kirjoitusta ei ole vieläkään pystytty lukemaan.',
  ],
  kabul: [
    'Kabul on noin 1 800 metrin korkeudessa vuorten ympäröimässä laaksossa.',
    'Kaupunki on ollut Silkkitien risteyspaikka yli 3 000 vuotta.',
    'Hindukuš-vuoriston huiput kohoavat yli 7 000 metriin kaupungin pohjoispuolella.',
  ],
  samarkand: [
    'Samarkand on yksi maailman vanhimmista yhtäjaksoisesti asutuista kaupungeista.',
    'Registanin aukio siniturkooseine medreseineen on Unescon maailmanperintökohde.',
    'Tamerlan teki kaupungista valtakuntansa pääkaupungin 1300-luvulla.',
  ],
  kashgar: [
    'Kašgarissa yhtyivät Silkkitien pohjoinen ja eteläinen haara, jotka kiersivät Taklamakanin autiomaan.',
    'Kaupungin torilla on käyty kauppaa yli kahden vuosituhannen ajan.',
    'Taklamakan on yksi maailman suurimmista hiekka-autiomaista, ja karavaanit kiersivät sen aina reunoja pitkin.',
  ],
};
