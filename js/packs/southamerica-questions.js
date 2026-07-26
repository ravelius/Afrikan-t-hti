// Etelä-Amerikan laudan kysymykset ja "tiesitkö että" -tiedot.
//
// level: 1 = helppo, 2 = perus (oletus), 3 = vaikea.
// hint = ostettava vihje. Vihje ei saa sisältää oikeaa vastausta sellaisenaan.
// source = osoite, josta tieto on tarkistettu. Merkitään vain luetuista lähteistä.

export const SOUTHAMERICA_QUESTIONS = {
  caracas: [
    {
      q: 'Minkä maan pääkaupunki Caracas on?',
      options: ['Venezuelan', 'Kolumbian', 'Perun', 'Ecuadorin'],
      correct: 0,
      level: 1,
      hint: 'Maa on saanut nimensä Pikku-Venetsiasta: rantakylien paalumajat muistuttivat valloittajia italialaisesta kaupungista.',
      fact: 'Caracas sijaitsee rannikkovuoriston laaksossa noin 900 metrin korkeudessa, vaikka meri on vain kymmenen kilometrin päässä.',
    },
    {
      q: 'Kuka Caracasissa syntynyt vapaustaistelija tunnetaan nimellä El Libertador?',
      options: ['Simón Bolívar', 'José de San Martín', 'Bernardo O’Higgins', 'Antonio de Sucre'],
      correct: 0,
      level: 2,
      hint: 'Yksi Etelä-Amerikan valtioista on nimetty hänen mukaansa.',
      fact: 'Hän syntyi Caracasissa 1783 ja johti viiden maan itsenäistymistä Espanjasta. Bolivia on nimetty hänen mukaansa.',
    },
    {
      q: 'Mikä maailman korkein vesiputous sijaitsee Venezuelassa?',
      options: ['Angelin putous', 'Iguazú', 'Niagara', 'Victoria'],
      correct: 0,
      level: 3,
      hint: 'Putous syöksyy Guayanan ylängön pöytävuoren laidalta, ja se on nimetty sen löytäneen lentäjän mukaan.',
      fact: 'Vesi putoaa Auyán-tepuin laidalta 979 metrin korkeudesta ja hajoaa sumuksi jo ennen kuin se osuu maahan.',
    },
  ],

  bogota: [
    {
      q: 'Minkä maan pääkaupunki Bogotá on?',
      options: ['Kolumbian', 'Ecuadorin', 'Panaman', 'Venezuelan'],
      correct: 0,
      level: 1,
      hint: 'Maa on nimetty Amerikkaan purjehtineen genovalaisen merenkulkijan mukaan.',
      fact: 'Bogotá sijaitsee Andien ylätasangolla noin 2 640 metrin korkeudessa, ja siellä on sama viileä sää ympäri vuoden.',
    },
    {
      q: 'Mistä jalokivestä Kolumbia on maailmankuulu?',
      options: ['smaragdista', 'timantista', 'rubiinista', 'safiirista'],
      correct: 0,
      level: 2,
      hint: 'Kivi on syvän vihreä ja kuuluu berylleihin.',
      fact: 'Muzon ja Chivorin kaivokset ovat tuottaneet vuosisatoja maailman arvostetuimpia vihreitä jalokiviä.',
    },
    {
      q: 'Mihin kultaa koskevaan tarinaan Bogotán lähellä oleva Guatavita-järvi liittyy?',
      options: ['El Doradoon', 'Atlantikseen', 'Kuningas Salomonin kaivoksiin', 'Merenneidon aarteeseen'],
      correct: 0,
      level: 3,
      hint: 'Tarina kertoo päälliköstä, joka voiteli itsensä kultapölyllä ennen järveen sukeltamista.',
      fact: 'Muiscojen päällikkö uhrasi kultaesineitä Guatavita-järveen. Espanjalaiset kuulivat tarinan ja lähtivät etsimään kultaista kaupunkia, jota ei ollut olemassa.',
    },
  ],

  quito: [
    {
      q: 'Minkä maan pääkaupunki Quito on?',
      options: ['Ecuadorin', 'Perun', 'Bolivian', 'Kolumbian'],
      correct: 0,
      level: 1,
      hint: 'Maan nimi tarkoittaa espanjaksi päiväntasaajaa.',
      fact: 'Quito on lähes täsmälleen päiväntasaajalla, mutta 2 850 metrin korkeus pitää sään viileänä ympäri vuoden.',
    },
    {
      q: 'Mikä tekee Quitosta erikoisen päivän ja yön pituuden kannalta?',
      options: [
        'päivä ja yö ovat yhtä pitkiä ympäri vuoden',
        'aurinko ei laske kesällä lainkaan',
        'talvella on kolme kuukautta pimeää',
        'päivä kestää vain kuusi tuntia',
      ],
      correct: 0,
      level: 2,
      hint: 'Kaupunki on päiväntasaajalla, jossa auringon rata pysyy samanlaisena kuukaudesta toiseen.',
      fact: 'Päiväntasaajalla aurinko nousee ja laskee jokseenkin samaan aikaan joka päivä: valoisaa on noin 12 tuntia vuoden ympäri.',
    },
  ],

  galapagos: [
    {
      q: 'Kenen tutkijan evoluutioteoriaan Galápagossaaret liittyvät?',
      options: ['Charles Darwinin', 'Isaac Newtonin', 'Carl von Linnén', 'Alfred Wegenerin'],
      correct: 0,
      level: 1,
      hint: 'Hän kirjoitti kirjan Lajien synty.',
      fact: 'Hän kävi saarilla 1835 Beagle-laivan matkalla. Saarikohtaiset erot peippojen nokissa auttoivat häntä muotoilemaan luonnonvalinnan teorian.',
    },
    {
      q: 'Mikä jättiläiseläin on Galápagossaarten tunnus?',
      options: ['jättiläiskilpikonna', 'norsu', 'komodonvaraani', 'virtahepo'],
      correct: 0,
      level: 1,
      hint: 'Eläin kantaa kilpeä selässään ja voi elää yli sadan vuoden ikäiseksi.',
      fact: 'Saarten nimi tulee espanjan sanasta galápago, satulaa muistuttava kilpi. Osa yksilöistä elää yli 150-vuotiaiksi.',
    },
    {
      q: 'Mikä on ainoa päiväntasaajalla elävä pingviinilaji?',
      options: ['galapagosinpingviini', 'keisaripingviini', 'kuningaspingviini', 'kauluspingviini'],
      correct: 0,
      level: 3,
      hint: 'Laji on nimetty saariryhmän mukaan, jolla se elää.',
      fact: 'Kylmä Humboldtin merivirta tuo saarille viileää vettä, ja siksi pingviinit pärjäävät siellä päiväntasaajasta huolimatta.',
    },
  ],

  boavista: [
    {
      q: 'Minkä maan pohjoisosassa Boa Vista sijaitsee?',
      options: ['Brasilian', 'Venezuelan', 'Guyanan', 'Surinamen'],
      correct: 0,
      level: 2,
      hint: 'Maa on Etelä-Amerikan suurin ja siellä puhutaan portugalia.',
      fact: 'Boa Vista on Roraiman osavaltion pääkaupunki ja ainoa osavaltion pääkaupunki maassaan päiväntasaajan pohjoispuolella.',
    },
    {
      q: 'Millainen muodostuma Boa Vistan pohjoispuolinen Roraima-vuori on?',
      options: ['jyrkkäseinäinen pöytävuori', 'tulivuoren kraatteri', 'hiekkadyyni', 'jäätikkö'],
      correct: 0,
      level: 3,
      hint: 'Huippu on tasainen kuin lauta, ja seinämät nousevat pystysuorina sademetsän yllä.',
      fact: 'Roraima on tepui, jonka huipulla elää lajeja joita ei tavata mistään muualta. Se innoitti Arthur Conan Doylen romaania Kadonnut maailma.',
    },
  ],

  cayenne: [
    {
      q: 'Minkä Euroopan maan merentakaista aluetta Ranskan Guayana on?',
      options: ['Ranskan', 'Espanjan', 'Portugalin', 'Alankomaiden'],
      correct: 0,
      level: 1,
      hint: 'Alueen valuutta on euro ja sen virallinen nimi on Guyane.',
      fact: 'Alue on merentakainen departementti ja siten myös osa Euroopan unionia — EU:n ainoa pala Etelä-Amerikkaa.',
    },
    {
      q: 'Mitä Ranskan Guayanan Kourousta laukaistaan?',
      options: ['avaruusraketteja', 'sukellusveneitä', 'sääpalloja', 'lentokoneita'],
      correct: 0,
      level: 2,
      hint: 'Päiväntasaajan läheisyys antaa lisävauhtia Maan pyörimisestä.',
      fact: 'Euroopan avaruusjärjestön laukaisukeskus on Kourousssa, koska päiväntasaajalla Maan pyöriminen antaa kantoraketille ilmaista vauhtia.',
    },
  ],

  macapa: [
    {
      q: 'Mikä kuvitteellinen viiva kulkee Macapán läpi?',
      options: ['päiväntasaaja', 'nollameridiaani', 'napapiiri', 'päivämäärän vaihtumislinja'],
      correct: 0,
      level: 2,
      hint: 'Viiva jakaa maapallon pohjoiseen ja eteläiseen puoliskoon.',
      fact: 'Macapán jalkapallostadionin keskiviiva on merkitty tälle viivalle: joukkueet pelaavat kumpikin omalla pallonpuoliskollaan.',
    },
    {
      q: 'Minkä joen suistossa Macapá sijaitsee?',
      options: ['Amazonin', 'Orinocon', 'Paranán', 'Magdalenan'],
      correct: 0,
      level: 1,
      hint: 'Joki on maailman vesirikkain ja virtaa läpi sademetsän.',
      fact: 'Suisto on niin leveä, ettei vastarantaa näe. Joki työntää makeaa vettä satoja kilometrejä merelle.',
    },
  ],

  manaus: [
    {
      q: 'Minkä aineen kaupasta Manaus rikastui 1800-luvun lopulla?',
      options: ['kumin', 'kullan', 'kahvin', 'öljyn'],
      correct: 0,
      level: 2,
      hint: 'Aine valutetaan puun kuoresta ja siitä tehdään renkaita.',
      fact: 'Buumin aikaan Manausiin rakennettiin oopperatalo keskelle sademetsää. Rikkaus loppui, kun kumipuun siemeniä vietiin salaa Aasiaan.',
    },
    {
      q: 'Mitä Manausin luona kutsutaan nimellä Encontro das Águas eli vesien kohtaaminen?',
      options: [
        'kahden erivärisen joen rinnakkain virtaamista',
        'vuorovesiaaltoa',
        'vesiputousta',
        'suihkulähdettä',
      ],
      correct: 0,
      level: 3,
      hint: 'Tumma ja vaalea vesi kulkevat kilometrikaupalla sekoittumatta.',
      fact: 'Musta Rio Negro ja savinen Solimões virtaavat rinnakkain noin kuusi kilometriä, koska niiden lämpötila ja virtausnopeus poikkeavat toisistaan.',
    },
  ],

  santarem: [
    {
      q: 'Minkä kahden joen yhtymäkohdassa Santarém sijaitsee?',
      options: ['Amazonin ja Tapajósin', 'Orinocon ja Caronín', 'Paranán ja Paraguayn', 'Madeiran ja Purúsin'],
      correct: 0,
      level: 3,
      hint: 'Toinen on maailman vesirikkain joki, toinen sen kirkasvetinen sivujoki.',
      fact: 'Santarémissa kirkas, sinivihreä sivujoki kohtaa savisen pääuoman, ja raja näkyy vedessä selvänä viivana.',
    },
    {
      q: 'Millaista metsää Santarémin ympärillä kasvaa?',
      options: ['sademetsää', 'havumetsää', 'tammimetsää', 'bambumetsää'],
      correct: 0,
      level: 1,
      hint: 'Metsätyyppi on maailman lajirikkain ja saa vettä ympäri vuoden.',
      fact: 'Amazoniassa sataa niin usein, että suuri osa vedestä palaa ilmaan puiden kautta ja sataa uudestaan alas — metsä tekee oman sateensa.',
    },
  ],

  saoluis: [
    {
      q: 'Mikä maa perusti São Luísin kaupungin vuonna 1612?',
      options: ['Ranska', 'Espanja', 'Englanti', 'Tanska'],
      correct: 0,
      level: 3,
      hint: 'Kaupunki on nimetty perustajamaan silloisen kuninkaan Ludvig XIII:n mukaan.',
      fact: 'São Luís on ainoa Brasilian osavaltion pääkaupunki, jonka perustivat ranskalaiset. Portugalilaiset valtasivat sen muutamaa vuotta myöhemmin.',
    },
    {
      q: 'Mistä São Luísin vanhakaupunki on kuuluisa?',
      options: ['värikkäistä kaakelijulkisivuista', 'kanavistaan', 'pilvenpiirtäjistään', 'linnoituksestaan'],
      correct: 0,
      level: 2,
      hint: 'Portugalilainen azulejo-perinne suojasi talot kosteudelta.',
      fact: 'Historiallinen keskusta on Unescon maailmanperintökohde, ja sen talot on päällystetty portugalilaisilla azulejoilla.',
    },
  ],

  joaopessoa: [
    {
      q: 'Miksi João Pessoan seutu on erityinen koko Amerikan mittakaavassa?',
      options: [
        'se on Amerikan itäisin kohta',
        'se on Amerikan eteläisin kohta',
        'se on Amerikan korkein kohta',
        'se on Amerikan sateisin kohta',
      ],
      correct: 0,
      level: 3,
      hint: 'Kohta on lähempänä Afrikkaa kuin mikään muu paikka manner-Amerikassa.',
      fact: 'Ponta do Seixas on Amerikan mantereen itäisin kärki. Afrikka on sieltä noin 2 900 kilometrin päässä.',
    },
    {
      q: 'Minkä valtameren yli lennettiin ensimmäisiä postilentoja Brasilian itäkärjestä?',
      options: ['Atlantin', 'Tyynenmeren', 'Intian valtameren', 'Jäämeren'],
      correct: 0,
      level: 2,
      hint: 'Meri erottaa Amerikan Euroopasta ja Afrikasta.',
      fact: 'Postilennot kulkivat Dakarista Brasilian itäkärkeen 1920- ja 1930-luvuilla. Reitti oli lyhin mahdollinen mannerten välillä.',
    },
  ],

  salvador: [
    {
      q: 'Mikä Salvador oli Brasilian historiassa vuoteen 1763 asti?',
      options: ['maan pääkaupunki', 'vankisiirtola', 'itsenäinen valtio', 'Espanjan siirtokunta'],
      correct: 0,
      level: 3,
      hint: 'Asema siirtyi sen jälkeen Rio de Janeirolle.',
      fact: 'Salvador oli Portugalin Brasilian ensimmäinen keskus yli kahdensadan vuoden ajan, ja siitä kasvoi sokerikaupan solmukohta.',
    },
    {
      q: 'Mikä brasilialainen tanssin ja taistelun yhdistelmä kehittyi Salvadorin seudulla?',
      options: ['capoeira', 'flamenco', 'tango', 'salsa'],
      correct: 0,
      level: 2,
      hint: 'Orjuutetut afrikkalaiset naamioivat harjoittelunsa tanssiksi.',
      fact: 'Lajissa yhdistyvät potkut, akrobatia ja musiikki. Se kehittyi Bahiassa afrikkalaisten perinteiden pohjalta.',
    },
  ],

  iquitos: [
    {
      q: 'Mikä tekee Iquitosista poikkeuksellisen suuren kaupungin?',
      options: [
        'sinne ei pääse maanteitse',
        'se on rakennettu jäätikölle',
        'se sijaitsee saarella',
        'se on kokonaan maan alla',
      ],
      correct: 0,
      level: 3,
      hint: 'Kaupunkiin saavutaan joko jokea pitkin tai lentäen.',
      fact: 'Iquitos on maailman suurin kaupunki, johon ei johda yhtään maantietä. Sinne pääsee vain Amazonia pitkin tai lentokoneella.',
    },
    {
      q: 'Minkä maan sademetsäalueella Iquitos sijaitsee?',
      options: ['Perun', 'Brasilian', 'Ecuadorin', 'Kolumbian'],
      correct: 0,
      level: 2,
      hint: 'Samassa maassa sijaitsevat myös Lima ja Machu Picchu.',
      fact: 'Iquitos on Perun Amazonian keskus. Vaikka maa tunnetaan Andeista, yli puolet sen pinta-alasta on sademetsää.',
    },
  ],

  portovelho: [
    {
      q: 'Minkä joen varrella Porto Velho sijaitsee?',
      options: ['Madeiran', 'Orinocon', 'Paranán', 'Uruguayn'],
      correct: 0,
      level: 3,
      hint: 'Joki on Amazonin suurin sivujoki, ja sen nimi tarkoittaa portugaliksi puuta.',
      fact: 'Porto Velho kasvoi joen rannalle, kun sademetsän halki rakennettiin rautatietä 1900-luvun alussa.',
    },
    {
      q: 'Millä nimellä 1900-luvun alussa rakennettu Madeira–Mamoré-rautatie tunnetaan?',
      options: [
        'Paholaisen rautatie',
        'maailman nopein rata',
        'Auringon rata',
        'Andien pikajuna',
      ],
      correct: 0,
      level: 3,
      hint: 'Nimi tuli siitä, että rakennustyömailla kuoli tuhansia ihmisiä malariaan ja keltakuumeeseen.',
      fact: 'Rata rakennettiin kumikuljetuksia varten. Se valmistui vasta kun kumibuumi oli jo ohi, ja jäi lopulta vähälle käytölle.',
    },
  ],

  bananal: [
    {
      q: 'Mikä tekee Ilha do Bananalista maailman suurimman laatuaan?',
      options: [
        'se on maailman suurin jokisaari',
        'se on maailman suurin koralliriutta',
        'se on maailman suurin tulivuorisaari',
        'se on maailman suurin jäätikkösaari',
      ],
      correct: 0,
      level: 3,
      hint: 'Saarta ei ympäröi meri vaan makea vesi.',
      fact: 'Araguaia-joki jakautuu kahtia ja yhtyy taas satojen kilometrien päässä. Väliin jäävä maa-alue on lajissaan maailman suurin.',
    },
    {
      q: 'Millaista aluetta Bananalin saari pääosin on?',
      options: ['tulva-aluetta ja savannia', 'aavikkoa', 'ikiroutaa', 'vuoristoa'],
      correct: 0,
      level: 2,
      hint: 'Sadekaudella suuri osa saaresta jää veden alle.',
      fact: 'Kuivalla kaudella esiin tulee cerrado-kasvillisuutta, jolla elää muun muassa jaguaareja ja isomuurahaiskarhuja.',
    },
  ],

  machupicchu: [
    {
      q: 'Minkä kansan rakentama Machu Picchu on?',
      options: ['inkojen', 'atsteekkien', 'mayojen', 'olmeekkien'],
      correct: 0,
      level: 1,
      hint: 'Kansan valtakunnan keskus oli Cuzcossa, ja sen hallitsijaa kutsuttiin Auringon pojaksi.',
      fact: 'Machu Picchu rakennettiin noin 1450 hallitsija Pachacútecin aikaan. Espanjalaiset eivät koskaan löytäneet sitä.',
    },
    {
      q: 'Kuka toi Machu Picchun maailman tietoisuuteen vuonna 1911?',
      options: ['Hiram Bingham', 'Francisco Pizarro', 'Charles Darwin', 'Thor Heyerdahl'],
      correct: 0,
      level: 3,
      hint: 'Hän oli yhdysvaltalainen tutkija ja Yalen yliopiston opettaja.',
      fact: 'Hän etsi inkojen viimeistä pakopaikkaa ja päätyi paikallisten opastamana raunioille. Seudun viljelijät tiesivät niistä jo ennestään.',
    },
    {
      q: 'Miten inkojen parhaat muurit on rakennettu?',
      options: [
        'kivet on hiottu yhteen ilman laastia',
        'savitiilistä',
        'puurungoista',
        'valetusta betonista',
      ],
      correct: 0,
      level: 2,
      hint: 'Saumoihin ei mahdu veistä, vaikka sidosainetta ei käytetty lainkaan.',
      fact: 'Jättikivet on sovitettu toisiinsa niin tarkasti, että rakennelmat ovat kestäneet vuosisatojen maanjäristykset.',
    },
  ],

  titicaca: [
    {
      q: 'Mikä tekee Titicaca-järvestä poikkeuksellisen?',
      options: [
        'se on maailman korkeimmalla sijaitseva suuri laivaliikennejärvi',
        'se on maailman syvin järvi',
        'se on maailman suolaisin järvi',
        'se on maailman pohjoisin järvi',
      ],
      correct: 0,
      level: 2,
      hint: 'Järvi on yli 3 800 metrin korkeudessa Andeilla, ja sillä kulkee aluksia.',
      fact: 'Titicaca on noin 3 812 metrin korkeudessa ja Etelä-Amerikan suurin makean veden järvi tilavuudeltaan.',
    },
    {
      q: 'Minkä kahden maan rajalla Titicaca sijaitsee?',
      options: ['Perun ja Bolivian', 'Chilen ja Argentiinan', 'Ecuadorin ja Kolumbian', 'Brasilian ja Paraguayn'],
      correct: 0,
      level: 2,
      hint: 'Toisen maan pääkaupunki on Lima, toisen hallitus istuu La Pazissa.',
      fact: 'Raja kulkee keskellä vettä: läntinen puoli kuuluu toiselle maalle ja itäinen toiselle.',
    },
    {
      q: 'Mistä Titicacan uros-kansan kelluvat saaret on tehty?',
      options: ['kaislasta', 'puunrungoista', 'muovista', 'jäästä'],
      correct: 0,
      level: 3,
      hint: 'Samasta kasvista tehdään myös veneet, ja se kasvaa järven matalikoilla.',
      fact: 'Uros-kansa rakentaa saarensa, majansa ja veneensä totorasta. Saarille lisätään jatkuvasti uutta ainesta, koska alaosa lahoaa.',
    },
  ],

  lima: [
    {
      q: 'Minkä maan pääkaupunki Lima on?',
      options: ['Perun', 'Chilen', 'Bolivian', 'Ecuadorin'],
      correct: 0,
      level: 1,
      hint: 'Samassa maassa sijaitsee Machu Picchu.',
      fact: 'Francisco Pizarro perusti Liman 1535, ja siitä tuli Espanjan Etelä-Amerikan hallinnon keskus.',
    },
    {
      q: 'Millainen sää Limassa vallitsee, vaikka kaupunki on autiomaassa?',
      options: [
        'pilvistä ja kosteaa mutta lähes sateetonta',
        'lumista suurimman osan vuodesta',
        'rankkasateista päivittäin',
        'myrskyistä ympäri vuoden',
      ],
      correct: 0,
      level: 3,
      hint: 'Kylmä merivirta jäähdyttää ilman sumuiseksi, mutta pisarat eivät kasva tarpeeksi suuriksi putoamaan.',
      fact: 'Limassa sataa alle 20 millimetriä vuodessa, mutta talvella kaupunkia peittää kuukausikaupalla harmaa merisumu, garúa.',
    },
  ],

  santacruz: [
    {
      q: 'Minkä maan suurin kaupunki Santa Cruz de la Sierra on?',
      options: ['Bolivian', 'Perun', 'Paraguayn', 'Argentiinan'],
      correct: 0,
      level: 2,
      hint: 'Maa on nimetty Simón Bolívarin mukaan.',
      fact: 'Santa Cruz on kasvanut maansa suurimmaksi kaupungiksi. Se sijaitsee alavilla mailla, ei Andeilla kuten La Paz ja Sucre.',
    },
    {
      q: 'Kummalla puolella Andeja Santa Cruz sijaitsee?',
      options: ['itäpuolella alavilla mailla', 'länsipuolella rannikolla', 'vuorenhuipulla', 'Tyynenmeren saarella'],
      correct: 0,
      level: 2,
      hint: 'Kaupungista jatkuu tasankoa aina Amazonin altaalle asti.',
      fact: 'Santa Cruz on vain noin 400 metrin korkeudessa, vaikka saman maan toinen puoli kohoaa yli neljään kilometriin.',
    },
  ],

  campogrande: [
    {
      q: 'Mikä maailman laajimpiin kuuluva kosteikko alkaa Campo Granden länsipuolelta?',
      options: ['Pantanal', 'Everglades', 'Okavango', 'Camargue'],
      correct: 0,
      level: 3,
      hint: 'Alue tulvii vuosittain ja on kuuluisa kaimaaneistaan ja jaguaareistaan.',
      fact: 'Alue on yksi maailman laajimmista makean veden kosteikoista. Sadekaudella suuri osa siitä on veden alla.',
    },
    {
      q: 'Mikä Amerikan suurin kissapeto elää Pantanalin kosteikoilla?',
      options: ['jaguaari', 'leijona', 'tiikeri', 'gepardi'],
      correct: 0,
      level: 1,
      hint: 'Peto on täplikäs ja uskaltaa uida — se saalistaa jopa kaimaaneja.',
      fact: 'Peto puree saalistaan kallon läpi. Pantanalissa elää maailman tiheimpiä kantoja tästä lajista.',
    },
  ],

  rio: [
    {
      q: 'Mikä valtava patsas kohoaa Rio de Janeiron yllä?',
      options: ['Kristus Vapahtaja', 'Vapaudenpatsas', 'Rodoksen kolossi', 'Kevätpatsas'],
      correct: 0,
      level: 1,
      hint: 'Patsas seisoo Corcovado-vuorella kädet levitettyinä.',
      fact: 'Patsas valmistui 1931. Se on 30 metriä korkea ja seisoo 710-metrisen Corcovadon huipulla.',
    },
    {
      q: 'Mitä Rio de Janeiro tarkoittaa suomeksi?',
      options: ['tammikuun joki', 'kultainen ranta', 'kaunis lahti', 'uusi satama'],
      correct: 0,
      level: 3,
      hint: 'Portugalilaiset saapuivat lahdelle vuoden ensimmäisenä kuukautena ja luulivat sitä virran suuksi.',
      fact: 'Portugalilaiset purjehtivat Guanabaran lahdelle 1502 ja luulivat sitä joen suuksi — nimi jäi, vaikka jokea ei ollut.',
    },
    {
      q: 'Mikä Rio de Janeiro oli vuosina 1763–1960?',
      options: ['Brasilian pääkaupunki', 'itsenäinen kaupunkivaltio', 'Espanjan siirtomaa', 'Argentiinan satama'],
      correct: 0,
      level: 2,
      hint: 'Asema siirtyi lopulta sisämaahan, tyhjälle paikalle varta vasten rakennetulle kaupungille.',
      fact: 'Rio hoiti tehtävää lähes kaksisataa vuotta, kunnes se siirtyi 1960 Brasílialle.',
    },
  ],

  saopaulo: [
    {
      q: 'Mikä São Paulo on eteläisellä pallonpuoliskolla?',
      options: ['väkiluvultaan suurin kaupunki', 'vanhin kaupunki', 'korkein kaupunki', 'pohjoisin kaupunki'],
      correct: 0,
      level: 2,
      hint: 'Kaupunkialueella asuu yli 20 miljoonaa ihmistä.',
      fact: 'São Paulon metropolialue on eteläisen pallonpuoliskon väkirikkain, ja kaupunki on Brasilian talouden keskus.',
    },
    {
      q: 'Minkä tuotteen vienti teki São Paulon seudusta rikkaan 1800-luvulla?',
      options: ['kahvin', 'kumin', 'sokerin', 'puuvillan'],
      correct: 0,
      level: 2,
      hint: 'Punamullan värinen terra roxa -maaperä sopi pensaalle täydellisesti.',
      fact: 'Ylängön hedelmällinen terra roxa teki alueesta maailman johtavan tuottajan, ja rikkaus rakensi kaupungin.',
    },
  ],

  iguazu: [
    {
      q: 'Mitä Iguazú on?',
      options: ['vesiputousten sarja', 'vuorijono', 'aavikko', 'jäätikkö'],
      correct: 0,
      level: 1,
      hint: 'Alkuperäiskielellä nimi tarkoittaa suurta vettä.',
      fact: 'Iguazússa on yli 270 erillistä putousta lähes kolmen kilometrin matkalla. Suurin niistä on Paholaisen kurkku.',
    },
    {
      q: 'Minkä kahden maan rajalla Iguazún putoukset sijaitsevat?',
      options: ['Argentiinan ja Brasilian', 'Chilen ja Perun', 'Bolivian ja Paraguayn', 'Uruguayn ja Guyanan'],
      correct: 0,
      level: 2,
      hint: 'Kolmas maa, Paraguay, on aivan lähellä mutta ei rajaudu itse putouksiin.',
      fact: 'Raja kulkee putousten läpi, ja Paraguayn kolmoispiste on vain parinkymmenen kilometrin päässä.',
    },
  ],

  portoalegre: [
    {
      q: 'Missä osassa Brasiliaa Porto Alegre sijaitsee?',
      options: ['aivan maan eteläosassa', 'pohjoisrannikolla', 'Amazonin keskellä', 'länsirajalla'],
      correct: 0,
      level: 2,
      hint: 'Kaupungista on lyhyt matka Uruguayn rajalle.',
      fact: 'Porto Alegre on Rio Grande do Sulin pääkaupunki. Sen talvet ovat Brasilian viileimpiä, ja lähialueilla sataa toisinaan lunta.',
    },
    {
      q: 'Mikä juoma kuuluu Etelä-Brasilian, Uruguayn ja Argentiinan arkeen?',
      options: ['mate', 'sake', 'kvass', 'lassi'],
      correct: 0,
      level: 2,
      hint: 'Juoma imetään metalliputkella kurpitsakupista, ja se on tehty kuivatuista lehdistä.',
      fact: 'Juoma nautitaan yhteisestä kupista bombilla-putken läpi. Tapa periytyy guaraní-kansalta.',
    },
  ],

  antofagasta: [
    {
      q: 'Minkä maailman kuivimman autiomaan laidalla Antofagasta sijaitsee?',
      options: ['Atacaman', 'Saharan', 'Gobin', 'Namibin'],
      correct: 0,
      level: 2,
      hint: 'Autiomaa on Pohjois-Chilessä Andien ja Tyynenmeren välissä.',
      fact: 'Osassa aluetta ei ole mitattu sadetta vuosikausiin. Kuivuus tekee siitä myös maailman parhaita paikkoja tähtitieteelle.',
    },
    {
      q: 'Mitä mineraalia Atacamasta louhittiin 1800-luvulla valtavia määriä?',
      options: ['salpietaria', 'marmoria', 'kivihiiltä', 'grafiittia'],
      correct: 0,
      level: 3,
      hint: 'Ainetta käytettiin lannoitteena ja ruudin valmistukseen, kunnes se korvattiin keinotekoisella.',
      fact: 'Aine oli Chilen tärkein vientituote, kunnes typen teollinen sidonta teki siitä kannattamatonta. Autiomaahan jäi aavekaupunkeja.',
    },
  ],

  salta: [
    {
      q: 'Missä maassa Salta sijaitsee?',
      options: ['Argentiinassa', 'Chilessä', 'Boliviassa', 'Perussa'],
      correct: 0,
      level: 2,
      hint: 'Maan pääkaupunki on Buenos Aires.',
      fact: 'Salta on maansa luoteisosan keskus, ja sen siirtomaa-ajan keskusta on yksi parhaiten säilyneistä.',
    },
    {
      q: 'Mikä kuuluisa rautatie nousee Saltasta yli neljän kilometrin korkeuteen?',
      options: ['Tren a las Nubes', 'Transsiperian rata', 'Orient-pikajuna', 'Glacier Express'],
      correct: 0,
      level: 3,
      hint: 'Nimi tarkoittaa espanjaksi junaa pilviin.',
      fact: 'Rata kiipeää Saltasta Andien solaan noin 4 200 metrin korkeuteen ja ylittää La Polvorillan sillan.',
    },
  ],

  catamarca: [
    {
      q: 'Millaisessa maastossa Catamarcan maakunta on?',
      options: ['vuoristoisessa ja kuivassa', 'sademetsässä', 'ikiroudassa', 'suistoalueella'],
      correct: 0,
      level: 2,
      hint: 'Maakunta on Andien varjopuolella, jonne meren sateet eivät yllä.',
      fact: 'Catamarca on Luoteis-Argentiinaa. Sen laaksoissa viljellään viiniä ja oliiveja keinokastelun turvin.',
    },
    {
      q: 'Mikä maailman korkein tulivuori kohoaa Catamarcan ja Chilen rajalla?',
      options: ['Ojos del Salado', 'Fuji', 'Etna', 'Kilimandžaro'],
      correct: 0,
      level: 3,
      hint: 'Vuori yltää lähes 6 900 metriin, ja sen huipulla on maailman korkeimmalla sijaitseva järvi.',
      fact: 'Ojos del Salado on noin 6 890 metriä korkea ja kohoaa Atacaman autiomaan yllä.',
    },
  ],

  valparaiso: [
    {
      q: 'Minkä maan tärkein satamakaupunki Valparaíso on?',
      options: ['Chilen', 'Perun', 'Argentiinan', 'Ecuadorin'],
      correct: 0,
      level: 2,
      hint: 'Maa on kapea kaistale Andien ja Tyynenmeren välissä.',
      fact: 'Valparaíso oli 1800-luvulla purjelaivojen tärkein pysähdyspaikka Kap Hornin kierron jälkeen. Panaman kanava vei siltä aseman 1914.',
    },
    {
      q: 'Millä kulkuvälineellä Valparaíson jyrkille rinteille noustaan?',
      options: ['vinohisseillä', 'köysiradalla', 'hiihtohissillä', 'vesibussilla'],
      correct: 0,
      level: 3,
      hint: 'Laitteita kutsutaan espanjaksi nimellä ascensor, ja ne kiipeävät kiskoja pitkin.',
      fact: 'Kaupunkiin rakennettiin kymmeniä tällaisia laitteita 1880-luvulta alkaen, ja osa niistä kulkee yhä päivittäin.',
    },
  ],

  sanambrosio: [
    {
      q: 'Millainen paikka San Ambrosio on?',
      options: ['pieni asumaton tulivuorisaari', 'suurkaupunki', 'jäätikkö', 'niemimaa'],
      correct: 0,
      level: 3,
      hint: 'Sinne ei ole koskaan rakennettu satamaa, ja se kohoaa jyrkkänä suoraan merestä.',
      fact: 'San Ambrosio kuuluu Chilen Desventuradas-saariin noin 850 kilometriä mantereelta. Siellä ei ole pysyvää asutusta.',
    },
    {
      q: 'Mille maalle Desventuradas-saaret kuuluvat?',
      options: ['Chilelle', 'Perulle', 'Ecuadorille', 'Argentiinalle'],
      correct: 0,
      level: 2,
      hint: 'Sama maa omistaa myös Pääsiäissaaren.',
      fact: 'Desventuradas tarkoittaa espanjaksi onnettomia saaria. Saarten ympärille on perustettu yksi maailman suurimmista merensuojelualueista.',
    },
  ],

  robinsoncrusoe: [
    {
      q: 'Kenen todellisen haaksirikkoisen tarina liittyy Robinson Crusoen saareen?',
      options: ['Alexander Selkirkin', 'Fletcher Christianin', 'James Cookin', 'Ferdinand Magalhãesin'],
      correct: 0,
      level: 3,
      hint: 'Skotlantilainen merimies jätettiin saarelle 1704, ja hän eli siellä yli neljä vuotta yksin.',
      fact: 'Hänet pelastettiin 1709. Daniel Defoen romaani ilmestyi kymmenen vuotta myöhemmin.',
    },
    {
      q: 'Mihin saariryhmään Robinson Crusoen saari kuuluu?',
      options: ['Juan Fernándezin saariin', 'Galápagossaariin', 'Falklandinsaariin', 'Tulimaahan'],
      correct: 0,
      level: 2,
      hint: 'Saariryhmä on nimetty sen löytäneen espanjalaisen merenkulkijan mukaan.',
      fact: 'Chile nimesi saaren virallisesti Robinson Crusoeksi 1966 matkailun toivossa.',
    },
  ],

  puertomontt: [
    {
      q: 'Mikä alkaa Puerto Monttista etelään?',
      options: [
        'Chilen vuonojen ja saarten sokkelo',
        'yhtenäinen aavikko',
        'leveä tasanko',
        'trooppinen sademetsä',
      ],
      correct: 0,
      level: 2,
      hint: 'Rannikko hajoaa tuhansiksi saariksi ja jäätikkölahdiksi.',
      fact: 'Puerto Montt on Chilen yhtenäisen tieverkon eteläinen päätepiste. Sen eteläpuolella kuljetaan lautoilla.',
    },
    {
      q: 'Mistä Chilen eteläosa on nykyisin merkittävä vientimaana?',
      options: ['lohenkasvatuksesta', 'kahvista', 'timanteista', 'öljystä'],
      correct: 0,
      level: 3,
      hint: 'Kylmät suojaisat vuonot sopivat merikasvatusaltaille.',
      fact: 'Chilestä tuli 1990-luvulla yksi maailman suurimmista kasvatetun kalan tuottajista, vaikka laji ei ole alueen alkuperäinen.',
    },
  ],

  sanjorge: [
    {
      q: 'Minkä maan rannikolla San Jorgen lahti sijaitsee?',
      options: ['Argentiinan', 'Chilen', 'Uruguayn', 'Brasilian'],
      correct: 0,
      level: 2,
      hint: 'Lahti aukeaa Atlantille Patagonian kohdalla.',
      fact: 'San Jorgen lahti on Patagonian suurin lahti, ja sen rannalla on maan tärkein öljyntuotantoalue.',
    },
    {
      q: 'Mikä pingviinilaji pesii suurina yhdyskuntina Patagonian rannikolla?',
      options: ['magelhaeninpingviini', 'keisaripingviini', 'kuningaspingviini', 'kultatöyhtöpingviini'],
      correct: 0,
      level: 3,
      hint: 'Laji on nimetty samasta merenkulkijasta kuin salmi Etelä-Amerikan kärjessä.',
      fact: 'Punta Tombon yhdyskunnassa pesii satojatuhansia lintuja — yksi maailman suurimmista mannerpingviiniyhdyskunnista.',
    },
  ],

  falkland: [
    {
      q: 'Mikä maa hallitsee Falklandinsaaria?',
      options: ['Britannia', 'Argentiina', 'Chile', 'Norja'],
      correct: 0,
      level: 2,
      hint: 'Saarista käytiin lyhyt sota 1982, ja hallinto säilyi Euroopassa.',
      fact: 'Falklandinsaaret ovat merentakainen alue. Argentiina kutsuu niitä Malvinassaariksi ja pitää niitä omanaan.',
    },
    {
      q: 'Mikä on Falklandinsaarten yleisin kotieläin?',
      options: ['lammas', 'poro', 'kameli', 'vesipuhveli'],
      correct: 0,
      level: 1,
      hint: 'Eläimiä on saarilla moninkertaisesti asukkaisiin nähden, ja niistä saadaan villaa.',
      fact: 'Saarilla on satoja tuhansia näitä eläimiä ja vain noin 3 500 asukasta. Villa on ollut vuosisadan ajan tärkein vientituote.',
    },
  ],

  puntaarenas: [
    {
      q: 'Minkä salmen rannalla Punta Arenas sijaitsee?',
      options: ['Magalhãesin salmen', 'Gibraltarin salmen', 'Beringinsalmen', 'Bosporinsalmen'],
      correct: 0,
      level: 2,
      hint: 'Salmi on nimetty portugalilaisen merenkulkijan mukaan, joka purjehti sen läpi 1520.',
      fact: 'Salmi oli ennen Panaman kanavaa tärkein reitti Atlantilta Tyynellemerelle, ja Punta Arenas eli sen laivaliikenteestä.',
    },
    {
      q: 'Mikä vei Punta Arenasilta suuren osan sen merkityksestä vuonna 1914?',
      options: ['Panaman kanavan avaaminen', 'maanjäristys', 'öljykriisi', 'jäätikön sulaminen'],
      correct: 0,
      level: 3,
      hint: 'Uusi oikoreitti Keski-Amerikassa lyhensi laivojen matkaa tuhansia kilometrejä.',
      fact: 'Kun laivojen ei enää tarvinnut kiertää koko Etelä-Amerikkaa, kaupungin satama hiljeni.',
    },
  ],

  caphorn: [
    {
      q: 'Mikä Kap Horn on?',
      options: [
        'Etelä-Amerikan eteläisin kärki',
        'Andien korkein huippu',
        'Amazonin lähde',
        'Brasilian pääkaupunki',
      ],
      correct: 0,
      level: 1,
      hint: 'Paikka on kallioinen saari aivan mantereen alapuolella, jossa kaksi valtamerta kohtaavat.',
      fact: 'Kap Horn on Hornoksen saarella. Sen ohi purjehtiminen oli purjelaiva-aikaan merenkulkijan arvomerkki.',
    },
    {
      q: 'Miksi Kap Hornin vedet ovat maailman pelätyimpiä?',
      options: [
        'jatkuvat myrskyt, jättiaallot ja jäävuoret',
        'matalikot ja koralliriutat',
        'tulivuorenpurkaukset',
        'merirosvot',
      ],
      correct: 0,
      level: 2,
      hint: 'Länsituulet kiertävät koko eteläisen pallonpuoliskon esteettä ja puristuvat kapeaan väliin.',
      fact: 'Eteläisellä pallonpuoliskolla tuulella ei ole mantereiden estettä. Drake-salmessa se kasvattaa aallot valtaviksi.',
    },
  ],

  general: [
    {
      q: 'Mikä on Etelä-Amerikan pisin vuorijono?',
      options: ['Andit', 'Alpit', 'Himalaja', 'Kalliovuoret'],
      correct: 0,
      level: 1,
      hint: 'Jono kulkee mantereen länsireunaa pitkin Karibialta Tulimaahan.',
      fact: 'Kyseessä on maailman pisin mannervuoristo, noin 7 000 kilometriä. Se kulkee seitsemän maan halki.',
    },
    {
      q: 'Mikä on Etelä-Amerikan suurin maa pinta-alaltaan?',
      options: ['Brasilia', 'Argentiina', 'Peru', 'Kolumbia'],
      correct: 0,
      level: 1,
      hint: 'Maa täyttää lähes puolet koko mantereesta ja siellä puhutaan portugalia.',
      fact: 'Maa kattaa noin 47 prosenttia mantereen pinta-alasta ja rajoittuu kaikkiin muihin sen maihin paitsi Chileen ja Ecuadoriin.',
    },
    {
      q: 'Mikä on Andien korkein huippu?',
      options: ['Aconcagua', 'Chimborazo', 'Huascarán', 'Illimani'],
      correct: 0,
      level: 2,
      hint: 'Huippu on Argentiinassa lähellä Chilen rajaa ja yltää lähes 7 000 metriin.',
      fact: 'Vuori kohoaa 6 961 metriin ja on korkein huippu Aasian ulkopuolella.',
    },
    {
      q: 'Mikä on maailman vesirikkain joki?',
      options: ['Amazon', 'Niili', 'Kongo', 'Jangtse'],
      correct: 0,
      level: 1,
      hint: 'Joki laskee Atlanttiin Brasiliassa ja kuljettaa enemmän vettä kuin seuraavat kuusi jokea yhteensä.',
      fact: 'Joki purkaa mereen noin viidenneksen kaikesta vedestä, jonka maapallon joet laskevat valtameriin.',
    },
    {
      q: 'Mikä oli inkojen valtakunnan pääkaupunki?',
      options: ['Cuzco', 'Lima', 'Quito', 'La Paz'],
      correct: 0,
      level: 2,
      hint: 'Kaupungin nimi tarkoittaa ketšuaksi maailman napaa.',
      fact: 'Kaupungista lähti neljä valtatietä neljään ilmansuuntaan. Valtakunnan nimi Tawantinsuyu tarkoittaa neljää yhteen liitettyä osaa.',
    },
    {
      q: 'Mikä kieli on virallinen useimmissa Etelä-Amerikan maissa?',
      options: ['espanja', 'portugali', 'ranska', 'englanti'],
      correct: 0,
      level: 1,
      hint: 'Kieli tuli mantereelle konkistadorien mukana, ja sitä puhutaan Perusta Argentiinaan.',
      fact: 'Kieli on virallinen yhdeksässä mantereen maassa. Brasiliassa puhutaan portugalia, Guyanassa englantia ja Surinamessa hollantia.',
    },
    {
      q: 'Mikä alkuperäiskansojen kieli on yhä miljoonien ihmisten äidinkieli Andeilla?',
      options: ['ketšua', 'swahili', 'maori', 'inuktitut'],
      correct: 0,
      level: 3,
      hint: 'Kieli oli inkavaltakunnan hallintokieli ja on nykyään virallinen Perussa ja Boliviassa.',
      fact: 'Kieltä puhuu äidinkielenään useita miljoonia ihmisiä. Siitä ovat peräisin muun muassa sanat laama, kondori ja pampa.',
    },
    {
      q: 'Mikä lintu on Andien tunnus ja maailman suurimpia lentäviä lintuja?',
      options: ['andienkondori', 'flamingo', 'strutsi', 'pelikaani'],
      correct: 0,
      level: 2,
      hint: 'Linnun siipiväli on yli kolme metriä, ja se liitää vuorten nousuvirtauksissa.',
      fact: 'Lintu voi liitää satoja kilometrejä räpyttämättä siipiään juuri lainkaan.',
    },
    {
      q: 'Mikä kasvi kotiutui Andeilta ja on nykyään maailman tärkeimpiä ruokakasveja?',
      options: ['peruna', 'vehnä', 'riisi', 'ohra'],
      correct: 0,
      level: 2,
      hint: 'Mukula otettiin viljelyyn Titicacan seudulla tuhansia vuosia sitten.',
      fact: 'Andeilla viljellään yhä tuhansia lajikkeita. Eurooppaan kasvi levisi vasta 1500-luvulla espanjalaisten mukana.',
    },
    {
      q: 'Mikä on ainoa Etelä-Amerikan maa, jolla on rannikko sekä Tyynellemerelle että Karibianmerelle?',
      options: ['Kolumbia', 'Peru', 'Venezuela', 'Ecuador'],
      correct: 0,
      level: 3,
      hint: 'Maa on mantereen luoteiskulmassa ja rajoittuu Panamaan.',
      fact: 'Maa on ainoa mantereella, jolla on rantaviivaa kahdella eri merialueella.',
    },
    {
      q: 'Mikä kesyeläin on Andien alkuperäinen kuormajuhta?',
      options: ['laama', 'kameli', 'aasi', 'jakki'],
      correct: 0,
      level: 1,
      hint: 'Eläin on villapeitteinen sukulainen villille vikunjalle.',
      fact: 'Inkat käyttivät niitä kuormien kantoon, sillä he eivät tunteneet pyörää eikä mantereella ollut hevosia ennen espanjalaisia.',
    },
    {
      q: 'Mitä El Niño -ilmiössä tapahtuu?',
      options: [
        'Tyynenmeren itäosan pintavesi lämpenee ja sää muuttuu ympäri maailmaa',
        'maanjäristysten määrä kasvaa',
        'Andien tulivuoret purkautuvat sarjassa',
        'jäätiköt kasvavat nopeasti',
      ],
      correct: 0,
      level: 3,
      hint: 'Perun kalastajat nimesivät ilmiön jouluajan mukaan, koska muutos alkaa yleensä joulun tienoilla.',
      fact: 'Ilmiön aikana kalasaaliit romahtavat Perun rannikolla ja sateet siirtyvät poikkeuksellisiin paikkoihin ympäri maailman.',
    },
    {
      q: 'Mikä Etelä-Amerikan maa menetti koko merirajansa naapurilleen 1800-luvulla?',
      options: ['Bolivia', 'Paraguay', 'Uruguay', 'Guyana'],
      correct: 0,
      level: 3,
      hint: 'Maa menetti rannikkonsa Chilelle Tyynenmeren sodassa 1879–1884.',
      fact: 'Maa ylläpitää yhä laivastoa Titicaca-järvellä ja vaatii merireittiä takaisin.',
    },
    {
      q: 'Kuka johti retkikuntaa, joka purjehti ensimmäisenä Etelä-Amerikan eteläpuolitse Tyynellemerelle?',
      options: ['Ferdinand Magalhães', 'Kristoffer Kolumbus', 'James Cook', 'Vasco da Gama'],
      correct: 0,
      level: 2,
      hint: 'Salmi Etelä-Amerikan kärjessä on nimetty hänen mukaansa.',
      fact: 'Retkikunta löysi salmen 1520. Johtaja itse kuoli Filippiineillä, mutta yksi laivoista purjehti maailman ympäri.',
    },
    {
      q: 'Mikä on Etelä-Amerikan suurin suolatasanko?',
      options: ['Salar de Uyuni', 'Death Valley', 'Etosha', 'Danakil'],
      correct: 0,
      level: 3,
      hint: 'Tasanko on Boliviassa yli 3 600 metrin korkeudessa ja peilaa taivaan sadekaudella.',
      fact: 'Tasanko on noin 10 500 neliökilometriä. Sen alla on merkittävä osa maailman litiumvaroista.',
    },
  ],
};

export const SOUTHAMERICA_FACTS = {
  panama: [
    'Panaman kanava avattiin 1914 ja lyhensi New Yorkin ja San Franciscon välimatkan noin 13 000 kilometrillä.',
    'Kanavan sulut nostavat laivat 26 metrin korkeuteen Gatún-tekojärvelle ja laskevat ne toisella puolella takaisin merenpintaan.',
    'Panaman kannas mutkittelee niin, että kanavassa purjehditaan Atlantilta Tyynellemerelle luoteesta kaakkoon.',
  ],
  buenosaires: [
    'Buenos Aires tarkoittaa espanjaksi hyviä ilmoja: nimi tulee merenkulkijoiden suojeluspyhimykseltä.',
    'Tango syntyi 1800-luvun lopulla Buenos Airesin ja Montevideon satamakortteleissa siirtolaisten keskuudessa.',
    'Kaupungin ohi virtaava Río de la Plata on maailman leveimpiä jokisuita: vastarantaa ei näe.',
  ],
  caracas: [
    'Caracas on rannikkovuoriston laaksossa noin 900 metrin korkeudessa, vaikka Karibianmeri on vain kymmenen kilometrin päässä.',
    'Kaupungin ja sen lentokentän välissä on vuorijono, jonka läpi kuljetaan tunneleita pitkin.',
    'Venezuelassa on maailman suurimmat todetut öljyvarat, suurelta osin Orinocon raskaan öljyn vyöhykkeellä.',
  ],
  bogota: [
    'Bogotá on noin 2 640 metrin korkeudessa, ja siellä on sama viileä sää ympäri vuoden.',
    'Kaupungin kultamuseossa on kymmeniätuhansia esikolumbiaanisia kultaesineitä.',
    'Bogotássa suljetaan sunnuntaisin satoja kilometrejä katuja autoilta pyöräilijöiden käyttöön — tapaa kutsutaan nimellä ciclovía.',
  ],
  quito: [
    'Quiton vanhakaupunki oli yksi ensimmäisistä Unescon maailmanperintökohteista vuonna 1978.',
    'Kaupunki on lähes päiväntasaajalla, joten päivä ja yö ovat yhtä pitkiä ympäri vuoden.',
    'Quiton yllä kohoaa Pichincha-tulivuori, joka peitti kaupungin tuhkaan purkautuessaan 1999.',
  ],
  galapagos: [
    'Galápagossaaret ovat noin tuhannen kilometrin päässä mantereesta ja syntyneet tulivuorista kuuman pisteen yllä.',
    'Merileguaani on maailman ainoa merestä ruokailemaan sukeltava liskolaji ja elää vain näillä saarilla.',
    'Saarten ympärillä kohtaavat kylmä Humboldtin virta ja lämpimät trooppiset vedet, mikä tekee vedenalaisesta lajistosta poikkeuksellisen.',
  ],
  boavista: [
    'Boa Vista on Brasilian ainoa osavaltion pääkaupunki päiväntasaajan pohjoispuolella.',
    'Kaupunki on rakennettu viuhkamaisen kaavan mukaan 1940-luvulla, mikä on Amazonian kaupungeissa harvinaista.',
    'Boa Vistan pohjoispuolella kohoaa Roraiman pöytävuori, jonka huipulla elää kasvilajeja joita ei tavata muualta.',
  ],
  cayenne: [
    'Ranskan Guayana on Ranskan merentakainen departementti ja siten Euroopan unionin ainoa alue Etelä-Amerikassa.',
    'Euroopan avaruusjärjestön laukaisukeskus sijaitsee lähellä Kouroussa, koska päiväntasaajan läheisyys antaa raketille lisävauhtia.',
    'Cayennenpippuri sai nimensä kaupungista, vaikka chilit ovat kotoisin laajemmalti trooppisesta Amerikasta.',
  ],
  macapa: [
    'Päiväntasaaja kulkee Macapán läpi, ja kaupungin stadionin keskiviiva on merkitty sen kohdalle.',
    'Macapá on Amazonin pohjoisrannalla, eikä sinne johda yhtään siltaa pääuoman yli.',
    'Amazonin suistossa esiintyy pororoca-vuoroveden aalto, joka nousee jokea ylös kilometrikaupalla.',
  ],
  manaus: [
    'Manausin oopperatalo Teatro Amazonas valmistui 1896 kumibuumin rahoilla keskelle sademetsää.',
    'Kaupungin edustalla musta Rio Negro ja savinen Solimões virtaavat rinnakkain kilometrejä sekoittumatta.',
    'Manaus on noin 1 500 kilometrin päässä merestä, mutta valtamerialukset pääsevät sinne Amazonia pitkin.',
  ],
  santarem: [
    'Santarémissa kirkasvetinen Tapajós kohtaa savisen Amazonin, ja veden raja näkyy silmin.',
    'Kaupunki on yksi Amazonian vanhimpia: portugalilaiset perustivat sen 1661 aiemman alkuperäisasutuksen paikalle.',
    'Lähellä sijaitseva Alter do Chão tunnetaan valkoisista jokirannoistaan, joita kutsutaan Amazonin Karibiaksi.',
  ],
  saoluis: [
    'São Luís on ainoa Brasilian osavaltion pääkaupunki, jonka perustivat ranskalaiset — vuonna 1612.',
    'Vanhankaupungin talot on päällystetty portugalilaisilla azulejo-kaakeleilla, ja alue on Unescon maailmanperintökohde.',
    'Kaupungin lähistöllä on Lençóis Maranhensesin dyynialue, jonka hiekkakumpujen väliin muodostuu sadekaudella tuhansia sinisiä lampia.',
  ],
  joaopessoa: [
    'Ponta do Seixas João Pessoan laidalla on Amerikan mantereen itäisin kohta.',
    'Kaupunki on yksi Brasilian vanhimpia: se perustettiin 1585.',
    'Etelä-Atlantin ensimmäiset postilennot Afrikasta suuntasivat juuri Brasilian itäkärkeen, koska matka oli lyhin mahdollinen.',
  ],
  salvador: [
    'Salvador oli Brasilian pääkaupunki 1549–1763, siis yli kaksisataa vuotta.',
    'Kaupungin Pelourinho-kaupunginosa on Unescon maailmanperintökohde ja tunnettu värikkäistä siirtomaataloistaan.',
    'Capoeira, joka yhdistää taistelun, tanssin ja musiikin, kehittyi Bahiassa afrikkalaisten perinteiden pohjalta.',
  ],
  iquitos: [
    'Iquitos on maailman suurin kaupunki, johon ei johda maantietä: sinne pääsee vain jokea pitkin tai lentäen.',
    'Kaupunki rikastui kumibuumin aikaan, ja sen keskustassa on yhä eurooppalaistyylisiä kaakelijulkisivuja.',
    'Belénin kaupunginosassa talot on rakennettu paalujen tai lauttojen varaan, koska joen pinta vaihtelee vuodessa monta metriä.',
  ],
  portovelho: [
    'Porto Velho kasvoi Madeira–Mamoré-rautatien päätepisteeseen 1900-luvun alussa.',
    'Madeira on Amazonin suurin sivujoki ja kuljettaa valtavia määriä Andeilta huuhtoutunutta lietettä.',
    'Rautatien rakentamisessa kuoli tuhansia työntekijöitä malariaan ja keltakuumeeseen, ja rataa kutsuttiin Paholaisen rautatieksi.',
  ],
  bananal: [
    'Ilha do Bananal on maailman suurin jokisaari: Araguaia jakautuu kahtia ja yhtyy vasta satojen kilometrien päässä.',
    'Sadekaudella suuri osa saaresta jää tulvaveden alle, ja kuivalla kaudella esiin tulee cerrado-savannia.',
    'Saarella asuu karajá-kansaa, joka tunnetaan savesta muotoilluista ritxoko-nukeista.',
  ],
  machupicchu: [
    'Machu Picchu rakennettiin noin vuonna 1450, eivätkä espanjalaiset koskaan löytäneet sitä.',
    'Kaupunki on 2 430 metrin korkeudessa jyrkän harjanteen päällä, ja sen ympärillä on satoja viljelyterasseja.',
    'Inkojen muureissa kivet on hiottu yhteen ilman laastia niin tarkasti, että rakenteet ovat kestäneet vuosisatojen maanjäristykset.',
  ],
  titicaca: [
    'Titicaca on noin 3 812 metrin korkeudessa ja Etelä-Amerikan suurin makean veden järvi tilavuudeltaan.',
    'Uros-kansa asuu järvellä kelluvilla saarilla, jotka on punottu totora-kaislasta.',
    'Järven raja jakaa veden Perun ja Bolivian kesken, ja molemmilla mailla on sillä aluksia.',
  ],
  lima: [
    'Francisco Pizarro perusti Liman 1535, ja siitä tuli Espanjan Etelä-Amerikan hallinnon keskus.',
    'Limassa sataa alle 20 millimetriä vuodessa, mutta talvella kaupunkia peittää kuukausiksi garúa-merisumu.',
    'Rannikon ohi virtaa kylmä Humboldtin merivirta, joka tekee maasta autiomaata mutta merestä yhden maailman kalarikkaimmista.',
  ],
  santacruz: [
    'Santa Cruz de la Sierra on kasvanut Bolivian suurimmaksi kaupungiksi, vaikka maa tunnetaan Andien vuoristosta.',
    'Kaupunki on vain noin 400 metrin korkeudessa alavilla mailla, kun La Paz on yli 3 600 metrissä.',
    'Santa Cruzin itäpuolelta alkaa Chiquitanían alue, jonka jesuiittakirkot ovat Unescon maailmanperintökohde.',
  ],
  campogrande: [
    'Campo Granden länsipuolelta alkaa Pantanal, yksi maailman laajimmista makean veden kosteikoista.',
    'Pantanalissa elää maailman tiheimpiä jaguaarikantoja, ja niitä on siellä helpompi nähdä kuin sademetsässä.',
    'Kaupunkia kutsutaan nimellä Cidade Morena punaruskean maaperänsä takia.',
  ],
  rio: [
    'Kristus Vapahtaja -patsas valmistui 1931 ja seisoo 710 metriä korkean Corcovadon huipulla.',
    'Rio oli Brasilian pääkaupunki 1763–1960, kunnes tehtävä siirtyi varta vasten rakennetulle Brasílialle.',
    'Nimi Rio de Janeiro tarkoittaa tammikuun jokea: portugalilaiset saapuivat lahdelle tammikuussa 1502 ja luulivat sitä joen suuksi.',
  ],
  saopaulo: [
    'São Paulon metropolialue on eteläisen pallonpuoliskon väkirikkain: siellä asuu yli 20 miljoonaa ihmistä.',
    'Kaupungin rikkaus rakentui 1800-luvulla kahvista, jolle ylängön punainen terra roxa -maaperä sopi täydellisesti.',
    'São Paulo on noin 800 metrin korkeudessa, ja siksi sen ilmasto on selvästi viileämpi kuin Rion.',
  ],
  iguazu: [
    'Iguazún putouksissa on yli 270 erillistä putousta lähes kolmen kilometrin matkalla.',
    'Suurin osa putouksista on Argentiinan puolella, mutta laajimmat näkymät ovat Brasilian puolelta.',
    'Nimi tulee guaranín kielen sanoista y (vesi) ja guasu (suuri).',
  ],
  portoalegre: [
    'Porto Alegre on Rio Grande do Sulin pääkaupunki aivan Brasilian eteläkulmassa.',
    'Alueen talvet ovat Brasilian viileimpiä, ja ylängöillä sataa toisinaan lunta.',
    'Etelä-Brasiliassa juodaan matea samaan tapaan kuin Uruguayssa ja Argentiinassa: kurpitsakupista metalliputken läpi.',
  ],
  antofagasta: [
    'Antofagasta on Atacaman autiomaan laidalla, jonka osissa ei ole mitattu sadetta vuosikausiin.',
    'Kaupunki kuului Bolivialle, kunnes Chile valtasi sen Tyynenmeren sodassa 1879–1884.',
    'Atacaman kuivuus ja korkeus tekevät siitä yhden maailman parhaista paikoista tähtitieteelle: alueella on useita suuria observatorioita.',
  ],
  salta: [
    'Salta on Luoteis-Argentiinan keskus ja tunnettu hyvin säilyneestä siirtomaa-ajan keskustastaan.',
    'Tren a las Nubes -rata nousee kaupungista Andien solaan noin 4 200 metrin korkeuteen.',
    'Alueen Cafayaten laaksossa viljellään viiniä yli 1 700 metrin korkeudessa — maailman korkeimpia viinialueita.',
  ],
  catamarca: [
    'Catamarca on kuivaa vuoristomaakuntaa, jonka laaksoissa viljellään keinokastelun turvin viiniä ja oliiveja.',
    'Maakunnan ja Chilen rajalla kohoaa Ojos del Salado, maailman korkein tulivuori.',
    'Alueen käsityöläiset kutovat yhä perinteisiä poncho-viittoja vikunjan ja laaman villasta.',
  ],
  valparaiso: [
    'Valparaíso oli 1800-luvulla purjelaivojen tärkein pysähdyspaikka Kap Hornin kierron jälkeen.',
    'Kaupungin jyrkille rinteille noustaan vinohisseillä, joita rakennettiin 1880-luvulta alkaen kymmeniä.',
    'Panaman kanavan avaaminen 1914 vei satamalta suuren osan sen merkityksestä.',
  ],
  sanambrosio: [
    'San Ambrosio on asumaton tulivuorisaari noin 850 kilometrin päässä Chilen mantereesta.',
    'Saari kuuluu Desventuradas-saariin, mikä tarkoittaa espanjaksi onnettomia saaria.',
    'Chile on perustanut saarten ympärille yhden maailman suurimmista merensuojelualueista.',
  ],
  robinsoncrusoe: [
    'Skotlantilainen merimies Alexander Selkirk eli saarella yksin yli neljä vuotta vuodesta 1704 alkaen.',
    'Daniel Defoen romaani Robinson Crusoe ilmestyi 1719, ja Chile nimesi saaren sen mukaan vasta 1966.',
    'Saari kuuluu Juan Fernándezin saariin, joiden kasvistosta suuri osa on kotoperäistä.',
  ],
  puertomontt: [
    'Puerto Montt on Chilen yhtenäisen tieverkon eteläinen päätepiste: sen eteläpuolella kuljetaan lautoilla.',
    'Kaupungin perustivat 1850-luvulla saksalaiset siirtolaiset, mikä näkyy yhä rakennuksissa ja sukunimissä.',
    'Alueen suojaisat vuonot tekivät Chilestä 1990-luvulla yhden maailman suurimmista kasvatetun lohen tuottajista.',
  ],
  sanjorge: [
    'San Jorgen lahti on Argentiinan Patagonian suurin lahti ja maan tärkein öljyntuotantoalue.',
    'Rannikon Punta Tombossa pesii satojatuhansia magelhaeninpingviinejä.',
    'Patagonian rannikkoa piiskaavat lähes jatkuvat länsituulet, jotka kallistavat pensaatkin itään.',
  ],
  falkland: [
    'Falklandinsaarilla on satoja tuhansia lampaita ja vain noin 3 500 asukasta.',
    'Britannia ja Argentiina kävivät saarista sodan 1982; Argentiina kutsuu niitä Malvinassaariksi.',
    'Saarilla pesii viisi pingviinilajia, ja lintuja on moninkertaisesti asukaslukuun nähden.',
  ],
  puntaarenas: [
    'Punta Arenas on Magalhãesin salmen rannalla ja oli tärkeä pysähdyspaikka ennen Panaman kanavaa.',
    'Kaupunki on yksi maailman eteläisimmistä yli 100 000 asukkaan kaupungeista.',
    'Salmen läpi purjehtiminen oli purjelaiva-aikaan turvallisempaa kuin Kap Hornin kierto, mutta myös vaikeampaa vastatuulessa.',
  ],
  caphorn: [
    'Kap Horn on Hornoksen saarella ja merkitsee Etelä-Amerikan eteläisintä kärkeä.',
    'Kap Hornin ohi purjehtiminen oli purjelaiva-aikaan merenkulkijan arvomerkki, eivätkä kaikki laivat päässeet perille.',
    'Eteläisen pallonpuoliskon länsituulet kiertävät maapallon ilman mantereiden estettä ja kasvattavat aallot Drake-salmessa valtaviksi.',
  ],
};
