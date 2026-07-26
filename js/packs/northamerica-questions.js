// Pohjois-Amerikan laudan kysymykset ja "tiesitkö että" -tiedot.
//
// level: 1 = helppo, 2 = perus (oletus), 3 = vaikea.
// hint = ostettava vihje. Vihje ei saa sisältää oikeaa vastausta sellaisenaan.
// source = osoite, josta tieto on tarkistettu. Merkitään vain luetuista lähteistä.

export const NORTHAMERICA_QUESTIONS = {
  nome: [
    {
      q: 'Minkä osavaltion rannikolla Nome sijaitsee?',
      options: ['Alaskan', 'Kalifornian', 'Texasin', 'Floridan'],
      correct: 0,
      level: 2,
      hint: 'Osavaltio ostettiin Venäjältä 1867 ja on Yhdysvaltain pohjoisin.',
      fact: 'Nome kasvoi kultaryntäyksestä 1899, kun kultaa löytyi suoraan meren rantahiekasta.',
    },
    {
      q: 'Mikä kuuluisa koiravaljakkokilpailu päättyy Nomeen?',
      options: ['Iditarod', 'Tour de France', 'Vasaloppet', 'Dakar-ralli'],
      correct: 0,
      level: 3,
      hint: 'Kilpailu muistuttaa vuoden 1925 lääkekuljetusta, jossa seerumi tuotiin valjakoilla kurkkumätäepidemian keskelle.',
      fact: 'Reitti on noin 1 600 kilometriä Anchoragesta Nomeen, ja se ajetaan maaliskuussa.',
    },
  ],

  anchorage: [
    {
      q: 'Missä osavaltiossa Anchorage sijaitsee?',
      options: ['Alaskassa', 'Oregonissa', 'Montanassa', 'Idahossa'],
      correct: 0,
      level: 1,
      hint: 'Osavaltio on Yhdysvaltain suurin pinta-alaltaan mutta harvimmin asuttu.',
      fact: 'Anchoragessa asuu noin 40 prosenttia koko osavaltion väestöstä.',
    },
    {
      q: 'Miltä maalta Yhdysvallat osti Alaskan vuonna 1867?',
      options: ['Venäjältä', 'Britannialta', 'Ranskalta', 'Tanskalta'],
      correct: 0,
      level: 2,
      hint: 'Myyjämaa hallitsi aluetta turkiskaupan takia ja pelkäsi menettävänsä sen sodassa.',
      fact: 'Kauppahinta oli 7,2 miljoonaa dollaria. Kauppaa pilkattiin aikanaan nimellä Sewardin hulluus.',
    },
  ],

  whitehorse: [
    {
      q: 'Minkä Kanadan territorion pääkaupunki Whitehorse on?',
      options: ['Yukonin', 'Nunavutin', 'Albertan', 'Manitoban'],
      correct: 0,
      level: 3,
      hint: 'Territorio tunnetaan 1890-luvun kultaryntäyksestä Klondike-joella.',
      fact: 'Whitehorse oli kultaryntäyksen aikaan reitin varrella oleva leiri, josta kasvoi territorion suurin kaupunki.',
    },
    {
      q: 'Mikä houkutteli 1890-luvulla kymmeniätuhansia ihmisiä Klondikeen?',
      options: ['kulta', 'öljy', 'timantit', 'hopea'],
      correct: 0,
      level: 1,
      hint: 'Metalli on keltaista ja sitä huuhdottiin jokien pohjahiekasta.',
      fact: 'Klondiken ryntäyksessä perille asti pääsi vain osa lähtijöistä. Kanadan poliisi vaati jokaiselta tulijalta vuoden ruokavarat.',
    },
  ],

  yellowknife: [
    {
      q: 'Mistä luonnonilmiöstä Yellowknife on tunnettu?',
      options: ['revontulista', 'geysireistä', 'hiekkamyrskyistä', 'tulivuorista'],
      correct: 0,
      level: 2,
      hint: 'Ilmiö näkyy pimeinä öinä vihreänä hehkuna taivaalla.',
      fact: 'Yellowknife on yksi maailman parhaista paikoista nähdä revontulia: taivas on usein kirkas ja kaupunki lähellä revontulivyöhykettä.',
    },
    {
      q: 'Minkä järven rannalla Yellowknife sijaitsee?',
      options: ['Isonorjajärven', 'Yläjärven', 'Winnipegjärven', 'Michiganjärven'],
      correct: 0,
      level: 3,
      hint: 'Järvi on Pohjois-Amerikan syvin, ja sen nimi viittaa työhön pakotettuihin ihmisiin.',
      fact: 'Järvi on yli 600 metriä syvä. Talvella sen jäälle rakennetaan teitä kaivoksille.',
    },
  ],

  vancouver: [
    {
      q: 'Minkä maan länsirannikolla Vancouver sijaitsee?',
      options: ['Kanadan', 'Yhdysvaltain', 'Meksikon', 'Venäjän'],
      correct: 0,
      level: 1,
      hint: 'Maan lipussa on vaahteranlehti.',
      fact: 'Vancouver on maansa suurin Tyynenmeren satama ja lämpimin suurkaupunki: meri pitää talvet leutoina.',
    },
    {
      q: 'Mikä vuoristo kohoaa Vancouverin takana?',
      options: ['Rannikkovuoret', 'Appalakit', 'Andit', 'Uralvuoret'],
      correct: 0,
      level: 2,
      hint: 'Vuoret jatkuvat Kalliovuorten länsipuolella pitkin Tyynenmeren rantaa.',
      fact: 'Vancouverista pääsee samana päivänä sekä laskettelemaan että merenrannalle, koska vuoret nousevat aivan kaupungin takaa.',
    },
  ],

  yellowstone: [
    {
      q: 'Mikä Yellowstone on?',
      options: [
        'maailman ensimmäinen kansallispuisto',
        'maailman korkein vuori',
        'maailman suurin järvi',
        'maailman vanhin kaupunki',
      ],
      correct: 0,
      level: 2,
      hint: 'Alue suojeltiin jo vuonna 1872, kauan ennen kuin muualla maailmassa oli vastaavia.',
      fact: 'Puisto on suuren tulivuoren kraatterin päällä, ja siksi siellä on tuhansia kuumia lähteitä.',
    },
    {
      q: 'Mikä Yellowstonen kuuluisa geysir purkautuu säännöllisin väliajoin?',
      options: ['Old Faithful', 'Big Ben', 'Vesuvius', 'Niagara'],
      correct: 0,
      level: 2,
      hint: 'Nimi tarkoittaa suomeksi vanhaa uskollista.',
      fact: 'Geysir purkautuu keskimäärin puolentoista tunnin välein ja suihkuttaa vettä 30–55 metrin korkeuteen.',
    },
  ],

  mountrushmore: [
    {
      q: 'Mitä Mount Rushmoren kalliosta on veistetty?',
      options: [
        'neljän presidentin kasvot',
        'intiaanipäällikön patsas',
        'kotka siivet levällään',
        'vapaudenpatsas',
      ],
      correct: 0,
      level: 2,
      hint: 'Veistokset esittävät Washingtonia, Jeffersonia, Rooseveltia ja Lincolnia.',
      fact: 'Veistostyö kesti 1927–1941. Jokaisen kasvot ovat noin 18 metriä korkeat.',
    },
    {
      q: 'Missä osavaltiossa Mount Rushmore on?',
      options: ['Etelä-Dakotassa', 'Coloradossa', 'Nevadassa', 'Kansasissa'],
      correct: 0,
      level: 3,
      hint: 'Osavaltio on preeriaa Black Hillsin kukkuloita lukuun ottamatta, ja sen pohjoisnaapurilla on lähes sama nimi.',
      fact: 'Vuori on Black Hillsissä, jota lakota-kansa pitää pyhänä alueena. Siitä on kiistelty siitä asti kun sieltä löytyi kultaa 1874.',
    },
  ],

  winnipeg: [
    {
      q: 'Minkä maan preerialla Winnipeg sijaitsee?',
      options: ['Kanadan', 'Yhdysvaltain', 'Meksikon', 'Grönlannin'],
      correct: 0,
      level: 1,
      hint: 'Kaupunki on Manitoban maakunnan pääkaupunki.',
      fact: 'Winnipeg on preerian portti. Talvella lämpötila laskee usein alle −30 asteen, kesällä nousee yli 30:n.',
    },
    {
      q: 'Mikä nallekarhu sai nimensä Winnipegistä?',
      options: ['Nalle Puh', 'Paddington', 'Rupert', 'Baloo'],
      correct: 0,
      level: 3,
      hint: 'Kanadalainen sotilas toi karhunpennun Lontoon eläintarhaan, ja siellä sen tapasi kirjailijan poika.',
      fact: 'A. A. Milnen poika Christopher Robin ihastui karhunpentuun Lontoon eläintarhassa, ja isä kirjoitti sen tarinaksi.',
    },
  ],

  churchill: [
    {
      q: 'Mistä eläimestä Churchill on maailmankuulu?',
      options: ['jääkarhusta', 'pandasta', 'gorillasta', 'tiikeristä'],
      correct: 0,
      level: 1,
      hint: 'Eläin on valkoinen ja odottaa syksyisin kaupungin liepeillä meren jäätymistä.',
      fact: 'Churchillia kutsutaan maailman jääkarhupääkaupungiksi. Eläimet kerääntyvät syksyisin odottamaan Hudsoninlahden jäätymistä.',
    },
    {
      q: 'Minkä lahden rannalla Churchill sijaitsee?',
      options: ['Hudsoninlahden', 'Meksikonlahden', 'Kalifornianlahden', 'Biskajanlahden'],
      correct: 0,
      level: 2,
      hint: 'Lahti on valtava sisämeri Kanadan keskellä, nimetty englantilaisen tutkimusmatkailijan mukaan.',
      fact: 'Churchilliin ei johda maantietä: sinne pääsee junalla, lentäen tai laivalla.',
    },
  ],

  iqaluit: [
    {
      q: 'Minkä Kanadan territorion pääkaupunki Iqaluit on?',
      options: ['Nunavutin', 'Yukonin', 'Quebecin', 'Ontarion'],
      correct: 0,
      level: 3,
      hint: 'Territorio perustettiin 1999 inuiittien omaksi alueeksi, ja sen nimi tarkoittaa maatamme.',
      fact: 'Iqaluit tarkoittaa inuktitutin kielellä paikkaa jossa on paljon kaloja. Se on Kanadan pienin maakuntatason pääkaupunki.',
    },
    {
      q: 'Mikä kansa muodostaa suurimman osan Nunavutin väestöstä?',
      options: ['inuiitit', 'irokeesit', 'maorit', 'saamelaiset'],
      correct: 0,
      level: 2,
      hint: 'Kansa asuu arktisella alueella Grönlannista Alaskaan, ja sen kieli on inuktitut.',
      fact: 'Territorion asukkaista noin 85 prosenttia kuuluu tähän kansaan, ja inuktitut on yksi virallisista kielistä.',
    },
  ],

  nuuk: [
    {
      q: 'Minkä saaren pääkaupunki Nuuk on?',
      options: ['Grönlannin', 'Islannin', 'Newfoundlandin', 'Kuuban'],
      correct: 0,
      level: 2,
      hint: 'Saari on maailman suurin ja kuuluu Tanskan valtakuntaan.',
      fact: 'Nuuk on maailman pohjoisin pääkaupunki. Se perustettiin 1728 nimellä Godthåb.',
    },
    {
      q: 'Kuinka suuri osa Grönlannista on jäätikön peitossa?',
      options: ['noin 80 prosenttia', 'noin 20 prosenttia', 'noin 50 prosenttia', 'ei lainkaan'],
      correct: 0,
      level: 3,
      hint: 'Jäätön alue on kapea kaistale rannikkoa, jossa kaikki asutus sijaitsee.',
      fact: 'Mannerjäätikkö on maailman toiseksi suurin Etelämantereen jälkeen. Paksuimmillaan se on yli kolme kilometriä.',
    },
  ],

  labrador: [
    {
      q: 'Minkä maan osa Labrador on?',
      options: ['Kanadan', 'Grönlannin', 'Islannin', 'Yhdysvaltain'],
      correct: 0,
      level: 2,
      hint: 'Alue muodostaa yhdessä Newfoundlandin saaren kanssa yhden maakunnan.',
      fact: 'Labrador on karua kalliota, tundraa ja havumetsää. Sen rannikolla on vain muutamia kyliä.',
    },
    {
      q: 'Mihin seutuun koirarodun nimi labradorinnoutaja liittyy?',
      options: ['Kanadan itärannikkoon', 'Australiaan', 'Skotlantiin', 'Espanjaan'],
      correct: 0,
      level: 3,
      hint: 'Rotu kehittyi kalastajien apuna alueella, jossa se veti verkkoja jääkylmästä merestä.',
      fact: 'Rodun esi-isät auttoivat kalastajia Newfoundlandissa ja Labradorissa. Lopulliseen muotoonsa rotu jalostettiin Britanniassa.',
    },
  ],

  stjohns: [
    {
      q: 'Millä saarella St. John’s sijaitsee?',
      options: ['Newfoundlandilla', 'Islannissa', 'Grönlannissa', 'Kuubassa'],
      correct: 0,
      level: 2,
      hint: 'Saaren nimi tarkoittaa englanniksi uutta löydettyä maata.',
      fact: 'St. John’s on yksi Pohjois-Amerikan vanhimmista eurooppalaisperäisistä kaupungeista: kalastajien tukikohta oli täällä jo 1500-luvulla.',
    },
    {
      q: 'Mistä Newfoundlandin Grand Banks -matalikko oli vuosisatoja kuuluisa?',
      options: ['turskasta', 'timanteista', 'öljystä', 'helmistä'],
      correct: 0,
      level: 3,
      hint: 'Kylmä ja lämmin merivirta kohtaavat matalikolla, mikä teki siitä maailman rikkaimman kalavesialueen.',
      fact: 'Kannat romahtivat liikakalastuksen takia, ja Kanada lopetti pyynnin 1992. Kanta ei ole toipunut entiselleen.',
    },
  ],

  halifax: [
    {
      q: 'Minkä Kanadan maakunnan pääkaupunki Halifax on?',
      options: ['Nova Scotian', 'Ontarion', 'Albertan', 'Quebecin'],
      correct: 0,
      level: 3,
      hint: 'Maakunnan nimi tarkoittaa latinaksi Uutta Skotlantia.',
      fact: 'Halifaxin satama on yksi maailman suurimmista luonnonsatamista ja jäätyy harvoin.',
    },
    {
      q: 'Minkä laivan uhrit haudattiin Halifaxiin vuonna 1912?',
      options: ['Titanicin', 'Mary Rosen', 'Vasan', 'Endurancen'],
      correct: 0,
      level: 2,
      hint: 'Laiva upposi jäävuoreen ensimmäisellä matkallaan Southamptonista New Yorkiin.',
      fact: 'Halifax oli lähin suuri satama onnettomuuspaikalle. Kaupungin hautausmaille on haudattu yli sata uhria.',
    },
  ],

  montreal: [
    {
      q: 'Mikä kieli on Montrealin yleisin kotikieli?',
      options: ['ranska', 'espanja', 'saksa', 'italia'],
      correct: 0,
      level: 2,
      hint: 'Kieli on Quebecin maakunnan ainoa virallinen kieli.',
      fact: 'Montreal on Pariisin jälkeen yksi maailman suurimmista tämänkielisistä kaupungeista.',
    },
    {
      q: 'Minkä joen varrella Montreal sijaitsee?',
      options: ['Saint Lawrence -joen', 'Mississippin', 'Hudsonin', 'Coloradon'],
      correct: 0,
      level: 3,
      hint: 'Joki yhdistää Suuret järvet Atlanttiin ja on nimetty pyhimyksen mukaan.',
      fact: 'Väylä vie valtamerialukset Atlantilta Suurille järville asti, yli 3 700 kilometrin päähän sisämaahan.',
    },
  ],

  toronto: [
    {
      q: 'Mikä on Kanadan väkirikkain kaupunki?',
      options: ['Toronto', 'Montreal', 'Vancouver', 'Ottawa'],
      correct: 0,
      level: 2,
      hint: 'Kaupunki on Ontariojärven rannalla ja maakuntansa pääkaupunki.',
      fact: 'Kaupungissa asuu yli kolme miljoonaa ihmistä, ja lähes puolet heistä on syntynyt Kanadan ulkopuolella.',
    },
    {
      q: 'Mitkä kuuluisat vesiputoukset ovat lähellä Torontoa?',
      options: ['Niagara', 'Iguazú', 'Victoria', 'Angel'],
      correct: 0,
      level: 1,
      hint: 'Putoukset ovat Kanadan ja Yhdysvaltain rajalla Erie- ja Ontariojärven välissä.',
      fact: 'Putousten yli virtaa yli 2 800 kuutiometriä vettä sekunnissa. Vesi pyörittää myös suuria vesivoimaloita.',
    },
  ],

  chicago: [
    {
      q: 'Minkä järven rannalla Chicago sijaitsee?',
      options: ['Michiganjärven', 'Ontariojärven', 'Eriejärven', 'Huronjärven'],
      correct: 0,
      level: 2,
      hint: 'Järvi on ainoa Suurista järvistä, joka on kokonaan Yhdysvaltain puolella.',
      fact: 'Chicagoa kutsutaan Tuuliseksi kaupungiksi. Järveltä puhaltava tuuli tekee talvista purevia.',
    },
    {
      q: 'Mikä rakennustyyppi kehitettiin Chicagossa 1880-luvulla?',
      options: ['pilvenpiirtäjä', 'riippusilta', 'metro', 'majakka'],
      correct: 0,
      level: 3,
      hint: 'Teräsrunko mahdollisti sen, ettei seinien tarvinnut enää kannattaa koko rakennusta.',
      fact: 'Home Insurance Building valmistui 1885 ja oli ensimmäinen teräsrunkoinen korkea rakennus. Suurpalo 1871 oli tehnyt tilaa uudelle rakentamiselle.',
    },
  ],

  appalakit: [
    {
      q: 'Mikä Appalakit on?',
      options: ['vuorijono', 'aavikko', 'järvi', 'saaristo'],
      correct: 0,
      level: 1,
      hint: 'Muodostuma kulkee Yhdysvaltain itäosassa Alabamasta Kanadaan.',
      fact: 'Appalakit ovat hyvin vanhoja: ne syntyivät yli 400 miljoonaa vuotta sitten ja ovat kuluneet matalaksi.',
    },
    {
      q: 'Mikä kuuluisa vaellusreitti kulkee Appalakkien harjannetta pitkin?',
      options: ['Appalachian Trail', 'Camino de Santiago', 'Karhunkierros', 'Inkojen polku'],
      correct: 0,
      level: 3,
      hint: 'Reitti on noin 3 500 kilometriä pitkä ja kulkee Georgiasta Maineen.',
      fact: 'Koko reitin kävelemiseen menee yleensä viisi tai kuusi kuukautta. Vain osa yrittäjistä pääsee perille asti.',
    },
  ],

  bermuda: [
    {
      q: 'Millä merialueella Bermuda sijaitsee?',
      options: ['Atlantilla', 'Tyynellämerellä', 'Intian valtamerellä', 'Jäämerellä'],
      correct: 0,
      level: 2,
      hint: 'Saaret ovat noin tuhannen kilometrin päässä Yhdysvaltain itärannikolta.',
      fact: 'Bermuda on Britannian merentakainen alue. Se sijaitsee kaukana Karibialta, vaikka usein luullaan toisin.',
    },
    {
      q: 'Mistä tarinasta Bermudan kolmio tunnetaan?',
      options: [
        'kadonneista laivoista ja lentokoneista',
        'merirosvojen aarteista',
        'jättiläiskalmareista',
        'merenneidoista',
      ],
      correct: 0,
      level: 1,
      hint: 'Alue Floridan, Puerto Ricon ja saarten välissä sai maineensa 1950-luvun lehtijutuista.',
      fact: 'Tutkimusten mukaan alueella katoaa aluksia suunnilleen saman verran kuin muillakin vilkkailla merialueilla.',
    },
  ],

  denver: [
    {
      q: 'Miksi Denveriä kutsutaan mailin korkeuden kaupungiksi?',
      options: [
        'se on tasan mailin korkeudessa merenpinnasta',
        'siellä on miljoona asukasta',
        'sen kadut ovat mailin pituisia',
        'siellä on mailin pituinen silta',
      ],
      correct: 0,
      level: 2,
      hint: 'Osavaltiotalon portaissa on merkki, joka kertoo tarkan korkeuden — 5 280 jalkaa.',
      fact: 'Kaupunki on noin 1 609 metrin korkeudessa Kalliovuorten juurella. Ohut ilma vaikuttaa siellä jopa leivonnan ohjeisiin.',
    },
    {
      q: 'Minkä vuoriston juurella Denver sijaitsee?',
      options: ['Kalliovuorten', 'Appalakkien', 'Sierra Nevadan', 'Andien'],
      correct: 0,
      level: 1,
      hint: 'Vuoristo kulkee Pohjois-Amerikan halki Alaskasta New Mexicoon.',
      fact: 'Vuoristo muodostaa mannerjakajan: sen länsipuolelta vedet virtaavat Tyynellemerelle ja itäpuolelta Atlantille.',
    },
  ],

  santafe: [
    {
      q: 'Missä osavaltiossa Santa Fe on?',
      options: ['New Mexicossa', 'Arizonassa', 'Texasissa', 'Utahissa'],
      correct: 0,
      level: 3,
      hint: 'Osavaltion nimi viittaa etelänaapuriin, jonka osa alue oli vuoteen 1848 asti.',
      fact: 'Santa Fe on Yhdysvaltain vanhin osavaltion pääkaupunki: espanjalaiset perustivat sen 1610.',
    },
    {
      q: 'Mistä rakennusmateriaalista Santa Fen vanhat talot on tehty?',
      options: ['adobesta eli savitiilestä', 'marmorista', 'teräksestä', 'lasista'],
      correct: 0,
      level: 2,
      hint: 'Materiaali on auringossa kuivattua maata ja olkea, ja se pitää sisätilat viileinä.',
      fact: 'Kaupungin rakennusmääräykset vaativat yhä keskustassa perinteistä pueblo-tyyliä, joten katukuva on yhtenäinen.',
    },
  ],

  grandcanyon: [
    {
      q: 'Mikä joki on uurtanut Grand Canyonin?',
      options: ['Colorado', 'Mississippi', 'Rio Grande', 'Missouri'],
      correct: 0,
      level: 2,
      hint: 'Joki laskee Kalifornianlahteen, ja sen vesi on jaettu useiden osavaltioiden kesken.',
      fact: 'Rotko on noin 446 kilometriä pitkä ja paikoin yli 1 800 metriä syvä. Vanhimmat kivikerrokset ovat lähes kaksi miljardia vuotta vanhoja.',
    },
    {
      q: 'Missä osavaltiossa Grand Canyon sijaitsee?',
      options: ['Arizonassa', 'Nevadassa', 'Coloradossa', 'Kaliforniassa'],
      correct: 0,
      level: 2,
      hint: 'Osavaltion lempinimi on suoraan rotkon mukaan Grand Canyon State.',
      fact: 'Rotkon pohjalla on usein yli 15 astetta lämpimämpää kuin reunalla, koska korkeusero on niin suuri.',
    },
  ],

  losangeles: [
    {
      q: 'Mikä elokuvateollisuuden keskus sijaitsee Los Angelesissa?',
      options: ['Hollywood', 'Bollywood', 'Cinecittà', 'Pinewood'],
      correct: 0,
      level: 1,
      hint: 'Paikannimen valtava kirjainkyltti seisoo kaupungin yllä kukkulalla.',
      fact: 'Kyltti pystytettiin 1923 mainostamaan asuinaluetta, ja siinä luki alun perin Hollywoodland.',
    },
    {
      q: 'Mikä maanjäristysvyöhyke kulkee Los Angelesin lähellä?',
      options: ['San Andreasin siirros', 'Mariaanien hauta', 'Reininlaakso', 'Itä-Afrikan hautavajoama'],
      correct: 0,
      level: 3,
      hint: 'Siirroksessa Tyynenmeren laatta liukuu Pohjois-Amerikan laatan ohi.',
      fact: 'Kaupunki liikkuu siirroksen takia muutaman senttimetrin vuodessa kohti San Franciscoa.',
    },
  ],

  hawaii: [
    {
      q: 'Mikä Havaiji on Yhdysvalloissa?',
      options: [
        'osavaltio keskellä Tyyntämerta',
        'itsenäinen valtio',
        'Kanadan maakunta',
        'Meksikon osavaltio',
      ],
      correct: 0,
      level: 2,
      hint: 'Alueesta tuli viimeisin uusi jäsen vuonna 1959.',
      fact: 'Havaiji on ainoa Yhdysvaltain osavaltio, joka on kokonaan saaristoa, ja ainoa joka on tropiikissa.',
    },
    {
      q: 'Miten Havaijin saaret ovat syntyneet?',
      options: [
        'tulivuorista kuuman pisteen yllä',
        'koralleista',
        'jäätikön kasaamasta sorasta',
        'meteoriitin törmäyksestä',
      ],
      correct: 0,
      level: 3,
      hint: 'Laatta liikkuu paikallaan pysyvän sulan pisteen yli, ja siksi saaret ovat jonossa iän mukaan.',
      fact: 'Kīlauea on yksi maailman aktiivisimmista tulivuorista. Mauna Kea on merenpohjasta mitattuna maailman korkein vuori.',
    },
  ],

  dallas: [
    {
      q: 'Missä osavaltiossa Dallas sijaitsee?',
      options: ['Texasissa', 'Oklahomassa', 'Louisianassa', 'Arkansasissa'],
      correct: 0,
      level: 1,
      hint: 'Osavaltio on Yhdysvaltain toiseksi suurin ja oli itsenäinen tasavalta 1836–1845.',
      fact: 'Dallas kasvoi puuvillan ja myöhemmin öljyn varassa. Nykyään se on yksi maan suurimmista liikenteen solmukohdista.',
    },
    {
      q: 'Mikä historiallinen tapahtuma sattui Dallasissa marraskuussa 1963?',
      options: [
        'presidentti Kennedyn murha',
        'ensimmäinen kuulento',
        'suuri maanjäristys',
        'maailmannäyttelyn avajaiset',
      ],
      correct: 0,
      level: 2,
      hint: 'Tapaus sattui avoautossa Dealey Plazalla, ja siitä on kiistelty siitä lähtien.',
      fact: 'Tapahtumapaikan varastorakennuksessa on nykyään museo, joka kertoo tapahtumista ja niiden tutkinnasta.',
    },
  ],

  neworleans: [
    {
      q: 'Mikä musiikkityyli syntyi New Orleansissa 1900-luvun alussa?',
      options: ['jazz', 'reggae', 'tango', 'flamenco'],
      correct: 0,
      level: 1,
      hint: 'Tyylissä improvisoidaan, ja Louis Armstrong oli sen kuuluisin varhainen tähti.',
      fact: 'Tyyli syntyi afroamerikkalaisten yhteisöjen musiikista. Louis Armstrong syntyi kaupungissa 1901.',
    },
    {
      q: 'Miltä maalta Yhdysvallat osti Louisianan vuonna 1803?',
      options: ['Ranskalta', 'Espanjalta', 'Britannialta', 'Alankomailta'],
      correct: 0,
      level: 3,
      hint: 'Napoleon myi alueen rahoittaakseen sotiaan Euroopassa.',
      fact: 'Kauppa kaksinkertaisti Yhdysvaltain pinta-alan yhdellä sopimuksella. Hinta oli 15 miljoonaa dollaria.',
    },
  ],

  miami: [
    {
      q: 'Missä osavaltiossa Miami sijaitsee?',
      options: ['Floridassa', 'Georgiassa', 'Alabamassa', 'Kaliforniassa'],
      correct: 0,
      level: 1,
      hint: 'Osavaltio on niemimaa, jonka nimi tarkoittaa espanjaksi kukkaista.',
      fact: 'Miamissa puhutaan espanjaa yhtä yleisesti kuin englantia. Kaupunki on tärkeä yhteys Yhdysvaltain ja Latinalaisen Amerikan välillä.',
    },
    {
      q: 'Mikä laaja kosteikkoalue on Miamin länsipuolella?',
      options: ['Everglades', 'Pantanal', 'Okavango', 'Camargue'],
      correct: 0,
      level: 3,
      hint: 'Aluetta kutsutaan ruohojoeksi, koska vesi virtaa siellä hitaasti ruohikon läpi merta kohti.',
      fact: 'Alue on ainoa paikka maailmassa, jossa alligaattorit ja krokotiilit elävät luonnossa samalla alueella.',
    },
  ],

  santiagodecuba: [
    {
      q: 'Minkä maan toiseksi suurin kaupunki Santiago de Cuba on?',
      options: ['Kuuban', 'Jamaikan', 'Haitin', 'Dominikaanisen tasavallan'],
      correct: 0,
      level: 2,
      hint: 'Maa on Karibian suurin saari ja sen pääkaupunki on Havanna.',
      fact: 'Kaupunki oli saaren ensimmäinen pääkaupunki 1500-luvulla. Se tunnetaan karnevaaleistaan ja son-musiikistaan.',
    },
    {
      q: 'Mistä tanssimusiikista Kuuba on maailmankuulu?',
      options: ['salsasta ja sonista', 'tangosta', 'sambasta', 'polkasta'],
      correct: 0,
      level: 2,
      hint: 'Tyylit syntyivät espanjalaisten ja afrikkalaisten perinteiden kohdatessa saarella.',
      fact: 'Son cubano on salsan perusta. Buena Vista Social Club teki saaren vanhat mestarit tunnetuiksi maailmalla 1990-luvulla.',
    },
  ],

  sanjuan: [
    {
      q: 'Minkä maan alue Puerto Rico on?',
      options: ['Yhdysvaltain', 'Espanjan', 'Britannian', 'Ranskan'],
      correct: 0,
      level: 2,
      hint: 'Asukkaat ovat maan kansalaisia, mutta saari ei ole osavaltio.',
      fact: 'Saari on liittovaltioon kuulumaton alue. Asukkaat eivät äänestä presidentinvaaleissa saarella asuessaan.',
    },
    {
      q: 'Mikä kieli on Puerto Ricossa yleisin?',
      options: ['espanja', 'englanti', 'ranska', 'hollanti'],
      correct: 0,
      level: 1,
      hint: 'Saari oli Madridista käsin hallittu yli 400 vuotta vuoteen 1898 asti.',
      fact: 'Saarella on kaksi virallista kieltä, mutta arjessa puhutaan lähes yksinomaan toista niistä.',
    },
  ],

  monterrey: [
    {
      q: 'Minkä maan teollisuuskeskus Monterrey on?',
      options: ['Meksikon', 'Yhdysvaltain', 'Guatemalan', 'Kuuban'],
      correct: 0,
      level: 2,
      hint: 'Kaupunki on noin 200 kilometrin päässä Texasin rajasta etelään.',
      fact: 'Monterrey on maansa yritysten ja teollisuuden keskus. Sitä ympäröivät jyrkät Sierra Madren vuoret.',
    },
    {
      q: 'Mikä vuoristo kohoaa Monterreyn ympärillä?',
      options: ['Sierra Madre', 'Andit', 'Alpit', 'Atlasvuoret'],
      correct: 0,
      level: 3,
      hint: 'Vuoristo jakautuu itäiseen ja läntiseen haaraan, joiden väliin jää Meksikon ylätasanko.',
      fact: 'Kaupungin maamerkki on Cerro de la Silla eli Satulavuori, jonka kaksihuippuinen siluetti näkyy sen vaakunassa.',
    },
  ],

  mexico: [
    {
      q: 'Minkä kansan pääkaupunki Tenochtitlán sijaitsi nykyisen Mexico Cityn paikalla?',
      options: ['atsteekkien', 'mayojen', 'inkojen', 'olmeekkien'],
      correct: 0,
      level: 2,
      hint: 'Kansa rakensi kaupunkinsa saarelle keskelle järveä ja kulki sinne pengerteitä pitkin.',
      fact: 'Tenochtitlán oli 1500-luvulla yksi maailman suurimmista kaupungeista. Espanjalaiset kuivattivat järven ja rakensivat raunioiden päälle.',
    },
    {
      q: 'Miksi Mexico City vajoaa vuosi vuodelta?',
      options: [
        'kaupunki on kuivatun järven pohjalla ja pohjavettä pumpataan',
        'maanjäristykset painavat sitä alas',
        'meri nousee',
        'jäätikkö sulaa sen alta',
      ],
      correct: 0,
      level: 3,
      hint: 'Pehmeä järvisavi tiivistyy, kun sen alta otetaan vettä.',
      fact: 'Osa kaupungista on vajonnut yli kymmenen metriä sadassa vuodessa. Vanhat rakennukset kallistuvat ja kadut aaltoilevat.',
    },
  ],

  merida: [
    {
      q: 'Millä niemimaalla Mérida sijaitsee?',
      options: ['Jukatanilla', 'Floridalla', 'Kaliforniassa', 'Labradorilla'],
      correct: 0,
      level: 2,
      hint: 'Niemimaa työntyy Meksikonlahden ja Karibianmeren väliin, ja siellä on mayojen raunioita.',
      fact: 'Mérida rakennettiin mayakaupungin päälle, ja sen rakennuksissa on käytetty vanhojen temppelien kiviä.',
    },
    {
      q: 'Mikä tapahtuma 66 miljoonaa vuotta sitten liittyy Jukatanin niemimaahan?',
      options: [
        'jättimäisen asteroidin törmäys',
        'mannerlaattojen törmäys',
        'supertulivuoren purkaus',
        'jääkauden alku',
      ],
      correct: 0,
      level: 3,
      hint: 'Kraatteri on nimeltään Chicxulub, ja tapahtumaa pidetään dinosaurusten häviämisen syynä.',
      fact: 'Kraatteri on noin 180 kilometriä leveä. Sen reunoilla on rivi luonnon kaivoja eli cenotéja.',
    },
  ],

  guatemala: [
    {
      q: 'Minkä maan pääkaupunki Guatemala City on?',
      options: ['Guatemalan', 'Hondurasin', 'Belizen', 'El Salvadorin'],
      correct: 0,
      level: 1,
      hint: 'Kaupungin nimi kertoo maan nimen suoraan.',
      fact: 'Guatemala on Väli-Amerikan väkirikkain maa. Sen alkuperäiskansojen kielistä puhutuimpia ovat mayakielet.',
    },
    {
      q: 'Mikä kuuluisa mayakaupunki sijaitsee Guatemalan sademetsässä?',
      options: ['Tikal', 'Machu Picchu', 'Teotihuacán', 'Cuzco'],
      correct: 0,
      level: 3,
      hint: 'Kaupungin pyramidit nousevat sademetsän latvojen yläpuolelle, ja ne nähtiin Tähtien sodan ensimmäisessä elokuvassa.',
      fact: 'Kaupunki oli mayojen mahtavimpia, ja sen suurin pyramidi on 65 metriä korkea. Se hylättiin noin vuonna 900.',
    },
  ],

  managua: [
    {
      q: 'Minkä maan pääkaupunki Managua on?',
      options: ['Nicaraguan', 'Costa Rican', 'Panaman', 'Hondurasin'],
      correct: 0,
      level: 2,
      hint: 'Maa on Väli-Amerikan suurin pinta-alaltaan ja siellä on kaksi suurta järveä.',
      fact: 'Managua tuhoutui maanjäristyksessä 1972, ja siksi sen keskusta on hajanainen: vanhaa kaupunkia ei rakennettu ennalleen.',
    },
    {
      q: 'Mikä on erikoista Nicaraguajärven haissa?',
      options: [
        'ne elävät makeassa vedessä',
        'ne ovat sokeita',
        'ne hehkuvat pimeässä',
        'ne kävelevät maalla',
      ],
      correct: 0,
      level: 3,
      hint: 'Härkähait pystyvät säätelemään suolatasapainoaan ja nousevat jokea pitkin merestä järveen.',
      fact: 'Härkähai ui San Juan -jokea pitkin Karibianmereltä järveen. Pitkään luultiin, että järvessä eli oma lajinsa.',
    },
  ],

  panama: [
    {
      q: 'Mitkä kaksi valtamerta Panaman kanava yhdistää?',
      options: [
        'Atlantin ja Tyynenmeren',
        'Atlantin ja Intian valtameren',
        'Tyynenmeren ja Jäämeren',
        'Intian valtameren ja Jäämeren',
      ],
      correct: 0,
      level: 1,
      hint: 'Kanava katkaisee kannaksen Pohjois- ja Etelä-Amerikan välissä.',
      fact: 'Kanava avattiin 1914 ja lyhensi New Yorkin ja San Franciscon välimatkan noin 13 000 kilometrillä.',
    },
    {
      q: 'Miksi Panaman kanavassa tarvitaan sulkuja?',
      options: [
        'laivat nostetaan tekojärven tasolle',
        'merivesi on eri suolaista puolin ja toisin',
        'kanava jäätyy talvella',
        'laivoja pestään matkan varrella',
      ],
      correct: 0,
      level: 3,
      hint: 'Kannaksen keskellä on 26 metriä merenpinnan yläpuolella oleva Gatún-järvi.',
      fact: 'Sulut nostavat laivan järvelle ja laskevat sen toisella puolella takaisin merenpintaan. Yksi sulutus käyttää valtavan määrän makeaa vettä.',
    },
  ],

  general: [
    {
      q: 'Mikä on Pohjois-Amerikan korkein vuori?',
      options: ['Denali', 'Mount Whitney', 'Popocatépetl', 'Mount Logan'],
      correct: 0,
      level: 2,
      hint: 'Vuori on Alaskassa ja tunnettiin aiemmin nimellä Mount McKinley.',
      fact: 'Vuori kohoaa 6 190 metriin. Sen nimi tarkoittaa athabaskan kielellä korkeaa.',
    },
    {
      q: 'Mikä on Pohjois-Amerikan pisin jokijärjestelmä?',
      options: ['Mississippi–Missouri', 'Colorado', 'Yukon', 'Rio Grande'],
      correct: 0,
      level: 2,
      hint: 'Järjestelmä halkoo Yhdysvallat pohjoisesta etelään ja laskee Meksikonlahteen.',
      fact: 'Yhdessä laskettuna järjestelmä on noin 6 000 kilometriä pitkä ja kerää vetensä 31 osavaltiosta.',
    },
    {
      q: 'Mitkä ovat Suuret järvet?',
      options: [
        'viisi järveä Kanadan ja Yhdysvaltain rajalla',
        'Meksikon tulivuorijärvet',
        'Alaskan jäätikköjärvet',
        'Karibian laguunit',
      ],
      correct: 0,
      level: 1,
      hint: 'Niitä ovat Yläjärvi, Michigan, Huron, Erie ja Ontario.',
      fact: 'Ne sisältävät noin viidenneksen maailman pintamakeasta vedestä.',
    },
    {
      q: 'Mikä maa on Pohjois-Amerikan suurin pinta-alaltaan?',
      options: ['Kanada', 'Yhdysvallat', 'Meksiko', 'Grönlanti'],
      correct: 0,
      level: 1,
      hint: 'Maa on myös maailman toiseksi suurin, ja sen lipussa on vaahteranlehti.',
      fact: 'Maa on noin 10 miljoonaa neliökilometriä. Silti siellä asuu vähemmän ihmisiä kuin Kaliforniassa.',
    },
    {
      q: 'Mikä on maailman pisin kahden maan välinen raja?',
      options: [
        'Kanadan ja Yhdysvaltain raja',
        'Venäjän ja Kiinan raja',
        'Meksikon ja Yhdysvaltain raja',
        'Argentiinan ja Chilen raja',
      ],
      correct: 0,
      level: 3,
      hint: 'Raja kulkee suurelta osin suoraan 49. leveyspiiriä pitkin.',
      fact: 'Raja on noin 8 890 kilometriä pitkä Alaskan osuus mukaan lukien.',
    },
    {
      q: 'Mikä eläin on Kanadan tunnus ja rakentaa patoja?',
      options: ['majava', 'hirvi', 'jääkarhu', 'ilves'],
      correct: 0,
      level: 1,
      hint: 'Eläimen turkis oli mannerta 1600–1800-luvuilla tutkineiden kauppiaiden tärkein tavara.',
      fact: 'Turkiskauppa vei tutkimusmatkailijat syvälle mantereelle. Eläin on Kanadan virallinen symboli vuodesta 1975.',
    },
    {
      q: 'Mikä kaupunki on Yhdysvaltain pääkaupunki?',
      options: ['Washington', 'New York', 'Chicago', 'Philadelphia'],
      correct: 0,
      level: 1,
      hint: 'Kaupunki ei kuulu mihinkään osavaltioon vaan omaan liittovaltiopiiriinsä.',
      fact: 'Kaupunki perustettiin 1790 kompromissina pohjoisten ja eteläisten osavaltioiden välillä ja nimettiin ensimmäisen presidentin mukaan.',
    },
    {
      q: 'Minkä viljan viljelystä Kanadan ja Yhdysvaltain preeriat ovat maailmankuuluja?',
      options: ['vehnän', 'riisin', 'teen', 'kahvin'],
      correct: 0,
      level: 2,
      hint: 'Kasvi on maailman tärkeimpiä leipäviljoja, ja preerian musta multa sopii sille erinomaisesti.',
      fact: 'Preerian ruohomaat muutettiin peltoauran avulla vilja-aitaksi 1800-luvun lopulla. Alkuperäisestä preeriasta on jäljellä vain rippeet.',
    },
    {
      q: 'Mikä myrskytyyppi iskee usein Karibialle ja Yhdysvaltain etelärannikolle?',
      options: ['hurrikaani', 'monsuuni', 'tuhkamyrsky', 'lumipyry'],
      correct: 0,
      level: 1,
      hint: 'Myrsky syntyy lämpimän meren yllä, ja sillä on selvä silmä keskellä.',
      fact: 'Myrskykausi kestää kesäkuusta marraskuuhun. Myrskyt saavat nimensä vuosittain kiertävästä listasta.',
    },
    {
      q: 'Mikä alkuperäiskansa asui Suurilla tasangoilla ja metsästi biisoneita?',
      options: ['lakotat', 'inuiitit', 'atsteekit', 'maorit'],
      correct: 0,
      level: 3,
      hint: 'Kansa kuuluu siouxeihin ja pitää Black Hillsin kukkuloita pyhinä.',
      fact: 'Hevoset saapuivat tasangoille espanjalaisten mukana ja mullistivat metsästyksen. Biisonikannat romahtivat 1800-luvulla lähes sukupuuttoon.',
    },
    {
      q: 'Mikä on Pohjois-Amerikan alin kohta?',
      options: ['Death Valley', 'Grand Canyon', 'Suurisuolajärvi', 'Kalifornianlahti'],
      correct: 0,
      level: 3,
      hint: 'Paikka on Kaliforniassa 86 metriä merenpinnan alapuolella, ja siellä on mitattu maailman korkeimpia lämpötiloja.',
      fact: 'Alueella mitattiin 1913 lämpötila 56,7 astetta, mikä on korkein luotettavana pidetty lukema maailmassa.',
    },
    {
      q: 'Minkä puun mahlasta keitetään Kanadan tunnetuinta siirappia?',
      options: ['vaahteran', 'koivun', 'tammen', 'männyn'],
      correct: 0,
      level: 1,
      hint: 'Puun lehti on Kanadan lipussa.',
      fact: 'Mahlaa kerätään keväällä. Noin 40 litraa mahlaa antaa yhden litran siirappia.',
    },
    {
      q: 'Mikä väylä yhdistää Suuret järvet Atlanttiin?',
      options: ['Saint Lawrence -väylä', 'Suezin kanava', 'Kielin kanava', 'Panaman kanava'],
      correct: 0,
      level: 3,
      hint: 'Väylä avattiin 1959 ja nousee sulkujen avulla lähes 180 metriä.',
      fact: 'Väylä vie valtamerialukset Montrealista Yläjärvelle asti. Talvella se on jäiden takia suljettuna kolmisen kuukautta.',
    },
    {
      q: 'Mikä on Karibianmeren suurin saari?',
      options: ['Kuuba', 'Jamaika', 'Hispaniola', 'Puerto Rico'],
      correct: 0,
      level: 2,
      hint: 'Saaren pääkaupunki on Havanna.',
      fact: 'Saari on noin 105 000 neliökilometriä eli suunnilleen kolmasosa Suomen pinta-alasta.',
    },
    {
      q: 'Mikä oli mantereen sisäosia tutkineiden turkiskauppiaiden tärkein kulkuväline?',
      options: ['kanootti', 'juna', 'auto', 'kuumailmapallo'],
      correct: 0,
      level: 2,
      hint: 'Väline oli kevyt, tehty tuohesta tai kaiverretusta rungosta, ja sen saattoi kantaa koskien ohi.',
      fact: 'Kauppiaat kulkivat tuhansia kilometrejä jokia ja järviä pitkin. Reitit noudattivat alkuperäiskansojen vanhoja väyliä.',
    },
  ],
};

export const NORTHAMERICA_FACTS = {
  newyork: [
    'Vapaudenpatsas oli Ranskan lahja Yhdysvalloille ja pystytettiin 1886.',
    'New York tunnettiin ensin nimellä Uusi Amsterdam, kunnes englantilaiset ottivat sen haltuunsa 1664.',
    'Kaupungissa puhutaan arviolta yli 700 kieltä, mikä tekee siitä maailman kielellisesti monimuotoisimman.',
  ],
  sanfrancisco: [
    'Golden Gate -silta valmistui 1937 ja on 2 737 metriä pitkä.',
    'Vuoden 1849 kultaryntäys kasvatti kaupungin muutamassa vuodessa tuhannesta yli 25 000 asukkaaseen.',
    'Kaupungin kesät ovat viileitä ja sumuisia, koska kylmä merivesi jäähdyttää ilman rannikolla.',
  ],
  nome: [
    'Nome kasvoi kultaryntäyksestä 1899, kun kultaa löytyi suoraan meren rantahiekasta.',
    'Iditarod-koiravaljakkokilpailu päättyy Nomeen noin 1 600 kilometrin matkan jälkeen.',
    'Vuonna 1925 kaupunkiin tuotiin valjakoilla kurkkumätäseerumia; matka innoitti Balto-koiran tarinan.',
  ],
  anchorage: [
    'Anchoragessa asuu noin 40 prosenttia koko Alaskan väestöstä.',
    'Yhdysvallat osti Alaskan Venäjältä 1867 hintaan 7,2 miljoonaa dollaria.',
    'Kaupungin lentoasema on yksi maailman vilkkaimmista rahtiliikenteessä, koska se on lyhimmän reitin varrella Aasian ja Euroopan välillä.',
  ],
  whitehorse: [
    'Whitehorse on Yukonin territorion pääkaupunki ja kasvoi Klondiken kultaryntäyksen reitille.',
    'Kanadan poliisi vaati kultaryntäyksen aikaan jokaiselta tulijalta vuoden ruokavarat ennen rajan ylitystä.',
    'Kaupunki on yksi Kanadan vähäsateisimpia paikkoja, koska rannikkovuoret pysäyttävät kosteuden.',
  ],
  yellowknife: [
    'Yellowknife on yksi maailman parhaista paikoista nähdä revontulia.',
    'Kaupunki on Isonorjajärven rannalla; järvi on Pohjois-Amerikan syvin, yli 600 metriä.',
    'Talvella järven jäälle rakennetaan teitä, joita pitkin ajetaan kuorma-autoilla kaivoksille.',
  ],
  vancouver: [
    'Vancouver on Kanadan lämpimin suurkaupunki: meri pitää talvet leutoina.',
    'Kaupungin takana kohoavat Rannikkovuoret, joten laskettelurinteille pääsee tunnissa keskustasta.',
    'Satama on Kanadan suurin ja käsittelee enemmän tavaraa kuin mikään muu maan satama.',
  ],
  yellowstone: [
    'Yellowstone perustettiin 1872 ja on maailman ensimmäinen kansallispuisto.',
    'Puisto sijaitsee suuren tulivuoren kraatterin päällä, ja siellä on yli 10 000 kuumaa lähdettä ja geysiriä.',
    'Old Faithful -geysir purkautuu keskimäärin puolentoista tunnin välein 30–55 metrin korkeuteen.',
  ],
  mountrushmore: [
    'Mount Rushmoren veistostyö kesti 1927–1941, ja jokaisen presidentin kasvot ovat noin 18 metriä korkeat.',
    'Vuori on Black Hillsissä, jota lakota-kansa pitää pyhänä alueena.',
    'Lähistöllä on veistetty vuosikymmeniä myös Crazy Horsen muistomerkkiä, josta tulee vielä suurempi.',
  ],
  winnipeg: [
    'Winnipeg on Kanadan preerian portti: talvella lämpötila laskee usein alle −30 asteen.',
    'Nalle Puh sai nimensä Winnipegistä kotoisin olleen karhunpennun mukaan.',
    'Kaupungin keskellä yhtyvät Red- ja Assiniboine-joet; risteystä on käytetty kauppapaikkana tuhansia vuosia.',
  ],
  churchill: [
    'Churchillia kutsutaan maailman jääkarhupääkaupungiksi.',
    'Kaupunkiin ei johda maantietä: sinne pääsee junalla, lentäen tai laivalla.',
    'Kesällä Hudsoninlahdelle saapuu tuhansia valkovalaita, jotka viihtyvät lahden matalissa jokisuissa.',
  ],
  iqaluit: [
    'Iqaluit tarkoittaa inuktitutin kielellä paikkaa jossa on paljon kaloja.',
    'Nunavutin territorio perustettiin 1999 inuiittien omaksi alueeksi.',
    'Kaupungista ei johda maantietä minnekään: kaikki tavara tuodaan laivalla avovesikaudella tai lentäen.',
  ],
  nuuk: [
    'Nuuk on maailman pohjoisin pääkaupunki ja perustettiin 1728.',
    'Noin 80 prosenttia Grönlannista on mannerjäätikön peitossa; paksuimmillaan jää on yli kolme kilometriä.',
    'Grönlanti kuuluu Tanskan valtakuntaan mutta hoitaa itse suurimman osan omista asioistaan.',
  ],
  labrador: [
    'Labrador on karua kalliota, tundraa ja havumetsää, ja sen rannikolla on vain muutamia kyliä.',
    'Labradorinnoutajan esi-isät auttoivat kalastajia vetämällä verkkoja jääkylmästä merestä.',
    'L’Anse aux Meadowsissa Newfoundlandin pohjoiskärjessä on ainoa varmistettu viikinkiasutus Amerikassa.',
  ],
  stjohns: [
    'St. John’s on yksi Pohjois-Amerikan vanhimmista eurooppalaisperäisistä kaupungeista.',
    'Grand Banksin matalikko oli vuosisatoja maailman rikkain turskavesi, kunnes kanta romahti 1990-luvulla.',
    'Kaupungin puutalot on maalattu kirkkain värein; rivistöä kutsutaan nimellä Jellybean Row.',
  ],
  halifax: [
    'Halifaxin satama on yksi maailman suurimmista luonnonsatamista ja jäätyy harvoin.',
    'Titanicin uhreja on haudattu Halifaxin hautausmaille yli sata.',
    'Vuonna 1917 kaupungissa tapahtui räjähdys, joka oli ydinaseita edeltäneen ajan suurimpia ihmisen aiheuttamia räjähdyksiä.',
  ],
  montreal: [
    'Montreal on Pariisin jälkeen yksi maailman suurimmista ranskankielisistä kaupungeista.',
    'Kaupungin alla kulkee kymmenien kilometrien maanalainen käytävästö, jota pitkin liikutaan talvipakkasilla.',
    'Saint Lawrence -väylä vie valtamerialukset Atlantilta Suurille järville, yli 3 700 kilometrin päähän sisämaahan.',
  ],
  toronto: [
    'Torontossa asuu yli kolme miljoonaa ihmistä, ja lähes puolet heistä on syntynyt Kanadan ulkopuolella.',
    'CN Tower oli valmistuessaan 1976 maailman korkein vapaasti seisova rakennus.',
    'Niagaran putoukset ovat noin sadan kilometrin päässä kaupungista.',
  ],
  chicago: [
    'Chicagoa kutsutaan Tuuliseksi kaupungiksi, koska Michiganjärveltä puhaltaa purevia tuulia.',
    'Maailman ensimmäinen teräsrunkoinen pilvenpiirtäjä valmistui Chicagoon 1885.',
    'Vuoden 1871 suurpalo tuhosi suuren osan kaupungista ja teki tilaa uudelle rakentamiselle.',
  ],
  appalakit: [
    'Appalakit syntyivät yli 400 miljoonaa vuotta sitten ja ovat kuluneet matalaksi.',
    'Appalachian Trail on noin 3 500 kilometriä pitkä vaellusreitti Georgiasta Maineen.',
    'Vuoret olivat pitkään este länteen suuntautuvalle asutukselle, kunnes solat löydettiin.',
  ],
  bermuda: [
    'Bermuda on Britannian merentakainen alue keskellä Atlanttia, noin tuhannen kilometrin päässä Yhdysvalloista.',
    'Bermudan kolmion tarina syntyi 1950-luvun lehtijutuista; katoamisia sattuu alueella suunnilleen saman verran kuin muillakin vilkkailla merialueilla.',
    'Saarilla ei ole jokia eikä järviä, joten sadevesi kerätään talojen valkoisilta katoilta.',
  ],
  denver: [
    'Denver on tasan mailin eli noin 1 609 metrin korkeudessa, ja osavaltiotalon portaissa on siitä merkki.',
    'Kalliovuoret muodostavat mannerjakajan: lännestä vedet virtaavat Tyynellemerelle, idästä Atlantille.',
    'Ohut ilma vaikuttaa kaupungissa jopa leivontaan: reseptejä on säädettävä korkeuden mukaan.',
  ],
  santafe: [
    'Santa Fe on Yhdysvaltain vanhin osavaltion pääkaupunki: espanjalaiset perustivat sen 1610.',
    'Vanhat talot on rakennettu adobesta eli auringossa kuivatusta savitiilestä.',
    'Kaupunki on noin 2 200 metrin korkeudessa ja siten maan korkeimmalla sijaitseva osavaltion pääkaupunki.',
  ],
  grandcanyon: [
    'Grand Canyon on noin 446 kilometriä pitkä ja paikoin yli 1 800 metriä syvä.',
    'Rotkon vanhimmat kivikerrokset ovat lähes kaksi miljardia vuotta vanhoja.',
    'Rotkon pohjalla on usein yli 15 astetta lämpimämpää kuin reunalla.',
  ],
  losangeles: [
    'Hollywoodin kirjainkyltti pystytettiin 1923 mainostamaan asuinaluetta, ja siinä luki alun perin Hollywoodland.',
    'San Andreasin siirros liikuttaa kaupunkia muutaman senttimetrin vuodessa kohti San Franciscoa.',
    'La Brean asfalttilammikoista on kaivettu esiin kymmeniätuhansia jääkauden eläinten luita.',
  ],
  hawaii: [
    'Havaiji on ainoa Yhdysvaltain osavaltio, joka on kokonaan saaristoa ja tropiikissa.',
    'Saaret ovat syntyneet tulivuorista kuuman pisteen yllä, ja siksi ne ovat jonossa iän mukaan.',
    'Mauna Kea on merenpohjasta mitattuna maailman korkein vuori, yli 10 000 metriä.',
  ],
  dallas: [
    'Dallas kasvoi puuvillan ja myöhemmin öljyn varassa.',
    'Presidentti John F. Kennedy murhattiin Dallasissa marraskuussa 1963.',
    'Dallas–Fort Worthin lentoasema on pinta-alaltaan suurempi kuin Manhattanin saari.',
  ],
  neworleans: [
    'Jazz syntyi New Orleansissa 1900-luvun alussa afroamerikkalaisten yhteisöjen musiikista.',
    'Yhdysvallat osti Louisianan Ranskalta 1803 ja kaksinkertaisti pinta-alansa yhdellä sopimuksella.',
    'Suuri osa kaupungista on merenpinnan alapuolella, ja sitä suojaavat padot ja pumput.',
  ],
  miami: [
    'Miamissa puhutaan espanjaa yhtä yleisesti kuin englantia.',
    'Kaupungin länsipuolella on Everglades, ainoa paikka maailmassa jossa alligaattorit ja krokotiilit elävät luonnossa samalla alueella.',
    'Miami Beachin art deco -kortteli on yksi maailman laajimmista 1920–1940-lukujen rakennuskokonaisuuksista.',
  ],
  santiagodecuba: [
    'Santiago de Cuba oli saaren ensimmäinen pääkaupunki 1500-luvulla.',
    'Son cubano -musiikkityyli, salsan perusta, kehittyi Kuuban itäosassa.',
    'Kaupunki on Kuuban vuoristoisimmalla alueella Sierra Maestran juurella.',
  ],
  sanjuan: [
    'Puerto Rico on Yhdysvaltain alue, jonka asukkaat ovat maan kansalaisia mutta eivät äänestä presidentinvaaleissa saarella asuessaan.',
    'San Juanin vanhakaupunki ja sen linnoitukset ovat Unescon maailmanperintökohde.',
    'Saarella sijaitsee El Yunque, Yhdysvaltain kansallismetsistä ainoa trooppinen sademetsä.',
  ],
  monterrey: [
    'Monterrey on Meksikon teollisuuden ja yritysten keskus, noin 200 kilometriä Texasin rajasta.',
    'Kaupungin maamerkki on Cerro de la Silla eli Satulavuori, joka näkyy sen vaakunassa.',
    'Sitä ympäröivät Sierra Madre Orientalin jyrkät vuoret, joissa on syviä luolia ja kanjoneita.',
  ],
  mexico: [
    'Mexico City on rakennettu atsteekkien pääkaupungin Tenochtitlánin ja kuivatun järven päälle.',
    'Osa kaupungista on vajonnut yli kymmenen metriä sadassa vuodessa, koska pohjavettä pumpataan pehmeästä savesta.',
    'Kaupunki on noin 2 240 metrin korkeudessa, ja sitä vartioivat tulivuoret Popocatépetl ja Iztaccíhuatl.',
  ],
  merida: [
    'Mérida rakennettiin mayakaupungin päälle, ja sen rakennuksissa on vanhojen temppelien kiviä.',
    'Jukatanin niemimaalla on Chicxulubin törmäyskraatteri, joka syntyi 66 miljoonaa vuotta sitten.',
    'Niemimaalla ei ole juuri jokia: sadevesi imeytyy kalkkikiveen ja kerääntyy cenote-kaivoihin.',
  ],
  guatemala: [
    'Guatemala on Väli-Amerikan väkirikkain maa, ja siellä puhutaan yli kahtakymmentä mayakieltä.',
    'Tikalin mayakaupungin suurin pyramidi on 65 metriä korkea ja nousee sademetsän latvojen yli.',
    'Maassa on yli kolmekymmentä tulivuorta, joista useat ovat aktiivisia.',
  ],
  managua: [
    'Managua tuhoutui maanjäristyksessä 1972, eikä vanhaa keskustaa rakennettu ennalleen.',
    'Nicaraguajärvessä elää härkähaita, jotka nousevat sinne merestä jokea pitkin.',
    'Nicaragua on Väli-Amerikan suurin maa pinta-alaltaan.',
  ],
  panama: [
    'Panaman kanava avattiin 1914 ja lyhensi New Yorkin ja San Franciscon välimatkan noin 13 000 kilometrillä.',
    'Kanavan sulut nostavat laivat 26 metrin korkeuteen Gatún-tekojärvelle ja laskevat ne toisella puolella takaisin merenpintaan.',
    'Panaman kannas mutkittelee niin, että kanavassa purjehditaan Atlantilta Tyynellemerelle luoteesta kaakkoon.',
  ],
};
