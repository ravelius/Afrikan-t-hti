// Lähi-itä-laudan tietovisakysymykset. Jokaisella laattakaupungilla on omat
// kysymyksensä, jotka liittyvät paikan maantietoon, kulttuuriin, arkeen tai
// historiaan. `general` toimii varapakkana, jos kaupungin omat kysymykset on
// jo käytetty.
//
// Muoto: { q: kysymys, options: [4 vaihtoehtoa], correct: oikean indeksi,
//          fact: selitys, hint: vihje joka ei paljasta vastausta }

export const MIDDLEEAST_QUESTIONS = {
  izmir: [
    {
      q: 'Minkä meren rannalla Izmir sijaitsee?',
      options: ['Egeanmeri', 'Mustameri', 'Kaspianmeri', 'Punainenmeri'],
      correct: 0,
      fact: 'Izmir on Turkin suurin satamakaupunki Egeanmeren rannalla.',
      hint: 'Samassa meressä on tuhansia kreikkalaisia saaria.',
    },
    {
      q: 'Millä nimellä Izmir tunnettiin antiikin aikana?',
      options: ['Smyrna', 'Troija', 'Efesos', 'Ateena'],
      correct: 0,
      level: 3,
      fact: 'Antiikin Smyrna oli kreikkalainen kauppakaupunki, jonka torin rauniot ovat yhä keskellä Izmiriä.',
      hint: 'Vanha nimi muistuttaa hieman kaupungin nykyistä nimeä.',
    },
    {
      q: 'Mitä hedelmiä Izmirin seudulta on viety maailmalle vuosisatojen ajan?',
      options: ['viikunoita', 'banaaneja', 'ananaksia', 'mangoja'],
      correct: 0,
      fact: 'Izmirin viikunat ja rusinat ovat kuuluisia — suuri osa maailman kuivatuista viikunoista tulee yhä Turkista.',
      hint: 'Niitä syödään usein kuivattuina jouluherkkuna.',
    },
  ],

  ankara: [
    {
      q: 'Minkä maan pääkaupunki Ankara on?',
      options: ['Turkki', 'Syyria', 'Kreikka', 'Irak'],
      correct: 0,
      level: 1,
      fact: 'Ankarasta tuli Turkin pääkaupunki vuonna 1923, kun tasavalta perustettiin.',
      hint: 'Maa levittäytyy kahdelle mantereelle.',
    },
    {
      q: 'Moni luulee Turkin pääkaupungiksi maan suurinta kaupunkia. Mikä se on?',
      options: ['Istanbul', 'Izmir', 'Antalya', 'Bursa'],
      correct: 0,
      fact: 'Istanbul on Turkin suurin kaupunki, mutta pääkaupunki on keskellä maata sijaitseva Ankara.',
      hint: 'Suurkaupunki sijaitsee Bosporinsalmen rannoilla.',
    },
    {
      q: 'Mistä ankaralaisesta eläimestä saadaan kuuluisan pehmeää villaa?',
      options: ['vuohesta', 'lampaasta', 'kamelista', 'laamasta'],
      correct: 0,
      fact: 'Angoravuohen mohair-villa on saanut nimensä Ankaran vanhasta nimestä Angora.',
      hint: 'Sama eläin kiipeilee mielellään kallioilla ja syö melkein mitä vain.',
    },
  ],

  kapadokia: [
    {
      q: 'Mistä Kappadokian kivitornit eli "keijupiiput" ovat syntyneet?',
      options: ['tulivuoren tuhkasta', 'jäätikön jäästä', 'meren simpukoista', 'muurahaiskeoista'],
      correct: 0,
      fact: 'Pehmeä tuffikivi syntyi tulivuortenpurkausten tuhkasta, ja tuuli ja vesi muovasivat siitä torneja.',
      hint: 'Pehmeä kivi on peräisin ikivanhoista purkauksista.',
    },
    {
      q: 'Mitä Kappadokian maan alta löytyy?',
      options: ['kokonaisia kaupunkeja', 'kultakaivoksia', 'dinosauruksen luita', 'jäätiköitä'],
      correct: 0,
      fact: 'Derinkuyun maanalainen kaupunki ulottuu kymmenien metrien syvyyteen, ja sinne mahtui tuhansia ihmisiä.',
      hint: 'Ihmiset kaivoivat ne suojautuakseen vihollisilta.',
    },
    {
      q: 'Millä kulkuneuvolla Kappadokian maisemia ihaillaan auringonnousun aikaan?',
      options: ['kuumailmapallolla', 'kamelilla', 'junalla', 'laivalla'],
      correct: 0,
      level: 1,
      fact: 'Sadat kuumailmapallot nousevat Kappadokian ylle tyyninä aamuina.',
      hint: 'Se nousee taivaalle polttimen liekin voimalla.',
    },
  ],

  nikosia: [
    {
      q: 'Minkä saarivaltion pääkaupunki Nikosia on?',
      options: ['Kypros', 'Malta', 'Kreeta', 'Rodos'],
      correct: 0,
      fact: 'Kyproksen kuparikaivokset olivat antiikissa niin kuuluisia, että kuparin latinankielinen nimi cuprum tulee saaresta.',
      hint: 'Saari on antanut nimensä punertavalle metallille.',
    },
    {
      q: 'Mikä tekee Nikosiasta poikkeuksellisen pääkaupungin?',
      options: ['raja jakaa sen kahtia', 'se on rakennettu veden päälle', 'se sijaitsee vuoren huipulla', 'se on maailman pienin'],
      correct: 0,
      fact: 'Nikosian halki kulkee vartioitu rajavyöhyke, joka jakaa kaupungin kreikkalais- ja turkkilaisosaan.',
      hint: 'Kaupungin keskustan poikki kulkee vihreäksi linjaksi kutsuttu vyöhyke.',
    },
    {
      q: 'Mikä kyproslainen juusto tunnetaan siitä, että sitä voi paistaa pannulla?',
      options: ['halloumi', 'feta', 'mozzarella', 'cheddar'],
      correct: 0,
      fact: 'Halloumi valmistetaan vuohen- ja lampaanmaidosta, eikä se sula kuumassakaan.',
      hint: 'Juusto ei sula vaan saa pinnalleen rapean kuoren.',
    },
  ],

  halab: [
    {
      q: 'Mistä tuotteesta Aleppo on ollut kuuluisa jo tuhansia vuosia?',
      options: ['saippuasta', 'autoista', 'timanteista', 'juustosta'],
      correct: 0,
      level: 3,
      fact: 'Aleppon saippua keitetään oliiviöljystä ja laakerimarjaöljystä, ja sitä kypsytetään kuukausia.',
      hint: 'Sitä keitetään öljystä suurissa padoissa, ja sillä pestään käsiä.',
    },
    {
      q: 'Mistä maailmanennätyksestä Aleppo ja Damaskos kilpailevat keskenään?',
      options: ['vanhimman kaupungin tittelistä', 'korkeimmasta tornista', 'suurimmasta torista', 'pisimmästä sillasta'],
      correct: 0,
      fact: 'Molemmissa kaupungeissa on asuttu yhtäjaksoisesti tuhansia vuosia — kumpikin pitää itseään maailman vanhimpana.',
      hint: 'Kummassakin on asuttu kauemmin kuin melkein missään muualla.',
    },
    {
      q: 'Mitä pähkinöitä Aleppon seudulla viljellään erityisen paljon?',
      options: ['pistaaseja', 'kookospähkinöitä', 'maapähkinöitä', 'saksanpähkinöitä'],
      correct: 0,
      fact: 'Syyria on kuuluisa pistaaseistaan, ja niitä käytetään myös makeisissa kuten baklavassa.',
      hint: 'Vihreä pähkinä raottaa kuortaan itsestään kypsyessään.',
    },
  ],

  damaskos: [
    {
      q: 'Minkä maan pääkaupunki Damaskos on?',
      options: ['Syyria', 'Libanon', 'Jordania', 'Irak'],
      correct: 0,
      fact: 'Damaskos on Syyrian pääkaupunki ja yksi maailman vanhimmista yhä asutuista kaupungeista.',
      hint: 'Naapurimaa Libanon jää sen ja Välimeren väliin.',
    },
    {
      q: 'Mikä kangas on saanut nimensä Damaskoksesta?',
      options: ['damasti', 'farkkukangas', 'satiini', 'flanelli'],
      correct: 0,
      level: 3,
      fact: 'Kiiltäväkuvioista damastia kudottiin Damaskoksessa, ja nimi kulkeutui kankaan mukana Eurooppaan.',
      hint: 'Kuviollista kangasta käytetään juhlapöytäliinoissa.',
    },
    {
      q: 'Mistä keskiaikaiset sepät tunsivat Damaskoksen?',
      options: ['teräksestä', 'kullasta', 'lasista', 'posliinista'],
      correct: 0,
      fact: 'Damaskosteräksestä taottiin kuuluisan kestäviä, aaltokuvioisia miekanteriä.',
      hint: 'Siitä taottiin aaltokuvioisia miekanteriä.',
    },
  ],

  jerusalem: [
    {
      q: 'Kuinka monelle uskonnolle Jerusalem on pyhä kaupunki?',
      options: ['kolmelle', 'yhdelle', 'kahdelle', 'viidelle'],
      correct: 0,
      fact: 'Jerusalem on pyhä juutalaisille, kristityille ja muslimeille.',
      hint: 'Sekä Raamattu että Koraani kertovat kaupungista.',
    },
    {
      q: 'Mikä kuuluisa rukouspaikka on Jerusalemin vanhassakaupungissa?',
      options: ['Itkumuuri', 'Kiinan muuri', 'Berliinin muuri', 'Hadrianuksen valli'],
      correct: 0,
      fact: 'Länsimuuri eli Itkumuuri on juutalaisten pyhin rukouspaikka.',
      hint: 'Sen kivenrakoihin jätetään pieniä rukouslappuja.',
    },
    {
      q: 'Jerusalemin lähellä on järvi, jonka pinnalla kelluu vaivatta. Mikä se on?',
      options: ['Kuollutmeri', 'Kaspianmeri', 'Genesaretinjärvi', 'Araljärvi'],
      correct: 0,
      fact: 'Kuollutmeri on niin suolainen, ettei siinä elä kaloja — ja sen ranta on maanpinnan alin kohta.',
      hint: 'Järven vesi on melkein kymmenen kertaa valtamerta suolaisempaa.',
    },
  ],

  petra: [
    {
      q: 'Miten Petran rakennukset on tehty?',
      options: ['hakkaamalla kallioon', 'muuraamalla tiilistä', 'veistämällä puusta', 'valamalla betonista'],
      correct: 0,
      fact: 'Nabatealaiset hakkasivat temppelit ja haudat suoraan pehmeään hiekkakiveen noin 2 000 vuotta sitten.',
      hint: 'Rakennusten seinät hehkuvat punertavina, sillä ne ovat samaa kiveä kuin vuori.',
    },
    {
      q: 'Mitä kautta Petran kaupunkiin saavutaan?',
      options: ['kapean rotkon läpi', 'riippusillan yli', 'tunnelijunalla', 'köysiradalla'],
      correct: 0,
      fact: 'Siq-rotko on yli kilometrin pituinen, ja sen päässä avautuu kallioon hakattu Aarrekammio.',
      hint: 'Korkeat kallioseinät kohoavat kulkijan molemmin puolin.',
    },
    {
      q: 'Missä maassa Petra sijaitsee nykyään?',
      options: ['Jordania', 'Egypti', 'Israel', 'Saudi-Arabia'],
      correct: 0,
      fact: 'Petra on Jordanian kuuluisin nähtävyys ja Unescon maailmanperintökohde.',
      hint: 'Maan pääkaupunki on Amman.',
    },
  ],

  siinai: [
    {
      q: 'Minkä kahden lahden väliin Siinain niemimaa jää?',
      options: ['Suezin- ja Akabanlahden', 'Persian- ja Omaninlahden', 'Adenin- ja Bengalinlahden', 'Suomen- ja Pohjanlahden'],
      correct: 0,
      level: 3,
      fact: 'Siinai on kolmion muotoinen niemimaa, jota Punaisenmeren kaksi kapeaa pohjukkaa reunustavat.',
      hint: 'Molemmat lahdet ovat Punaisenmeren pohjukoita.',
    },
    {
      q: 'Kuka nousi kertomusten mukaan Siinainvuorelle?',
      options: ['Mooses', 'Nooa', 'Daavid', 'Joosef'],
      correct: 0,
      fact: 'Kertomuksen mukaan Mooses sai Siinainvuorella kymmenen käskyn taulut.',
      hint: 'Hän sai vuorella kivitaulut, joissa oli kymmenen käskyä.',
    },
    {
      q: 'Mikä hyvin vanha rakennus Siinain vuorten keskellä yhä toimii?',
      options: ['luostari', 'rautatieasema', 'majakka', 'sirkus'],
      correct: 0,
      level: 3,
      fact: 'Pyhän Katariinan luostari on toiminut yhtäjaksoisesti yli 1 400 vuotta, ja sen kirjasto on maailman vanhimpia.',
      hint: 'Siellä munkit ovat rukoilleet ja kopioineet kirjoja yli tuhat vuotta.',
    },
  ],

  luxor: [
    {
      q: 'Millä nimellä Luxor tunnettiin muinaisen Egyptin aikana?',
      options: ['Theba', 'Memfis', 'Aleksandria', 'Giza'],
      correct: 0,
      level: 3,
      fact: 'Theba oli faaraoiden Egyptin mahtava pääkaupunki, jota Homeros kutsui sadanporttiseksi.',
      hint: 'Runoilija Homeros ylisti kaupungin sataa porttia.',
    },
    {
      q: 'Mitä Kuninkaiden laaksosta Luxorin lähellä on löydetty?',
      options: ['faaraoiden hautoja', 'dinosaurusten luita', 'kultakaivos', 'viikinkilaiva'],
      correct: 0,
      fact: 'Tutankhamonin lähes koskematon hauta löytyi Kuninkaiden laaksosta vuonna 1922 aarteineen.',
      hint: 'Kuuluisin löytö tehtiin vuonna 1922, ja se kimalsi kullasta.',
    },
    {
      q: 'Mikä joki virtaa Luxorin halki?',
      options: ['Niili', 'Eufrat', 'Tigris', 'Jordan'],
      correct: 0,
      level: 1,
      fact: 'Niili kastelee Luxorin pellot — sen itärannalla asuttiin ja länsirannalle haudattiin.',
      hint: 'Sama joki virtaa myös Kairon halki.',
    },
  ],

  medina: [
    {
      q: 'Mikä sija Medinalla on islamin pyhien kaupunkien joukossa?',
      options: ['toiseksi pyhin', 'pyhin', 'kolmanneksi pyhin', 'neljänneksi pyhin'],
      correct: 0,
      level: 3,
      fact: 'Vain Mekka on Medinaa pyhempi. Profeetta Muhammad muutti Medinaan vuonna 622, ja islamin ajanlasku alkaa siitä.',
      hint: 'Yksi kaupunki on sitä pyhempi — se, jossa Kaaba sijaitsee.',
    },
    {
      q: 'Mikä kuuluisa rakennus Medinassa on?',
      options: ['Profeetan moskeija', 'Kaaba', 'Kalliomoskeija', 'Hagia Sofia'],
      correct: 0,
      fact: 'Profeetan moskeijan vihreän kupolin alla on Muhammadin hauta.',
      hint: 'Sen vihreä kupoli näkyy kauas kaupungin ylle.',
    },
    {
      q: 'Mitä hedelmää Medinan keitailla viljellään?',
      options: ['taateleita', 'omenoita', 'appelsiineja', 'mansikoita'],
      correct: 0,
      level: 1,
      fact: 'Medinan ajwa-taatelit ovat kuuluisimpia lajikkeita — taatelipalmu on keitaiden tärkein puu.',
      hint: 'Makeat hedelmät kypsyvät korkeiden palmujen latvoissa.',
    },
  ],

  mekka: [
    {
      q: 'Mihin suuntaan muslimit kääntyvät rukoillessaan?',
      options: ['kohti Mekkaa', 'kohti aurinkoa', 'kohti pohjoista', 'kohti Jerusalemia'],
      correct: 0,
      level: 1,
      fact: 'Rukoussuunta eli qibla osoittaa kaikkialta maailmasta kohti samaa kaupunkia ja sen Kaabaa.',
      hint: 'Suunta on kaikkialla maailmassa sama — kohti yhtä ja samaa kaupunkia.',
    },
    {
      q: 'Mikä musta kuutiomainen rakennus on Mekan suuren moskeijan keskellä?',
      options: ['Kaaba', 'minareetti', 'obeliski', 'sfinksi'],
      correct: 0,
      fact: 'Kaaba on islamin pyhin paikka, ja pyhiinvaeltajat kiertävät sen seitsemän kertaa.',
      hint: 'Pyhiinvaeltajat kiertävät sen seitsemän kertaa vastapäivään.',
    },
    {
      q: 'Mikä on Mekkaan tehtävän suuren pyhiinvaelluksen nimi?',
      options: ['hadž', 'ramadan', 'safari', 'basaari'],
      correct: 0,
      level: 3,
      fact: 'Hadž kokoaa Mekkaan vuosittain miljoonia pyhiinvaeltajia kaikkialta maailmasta.',
      hint: 'Jokaisen muslimin toivotaan tekevän matkan kerran elämässään.',
    },
  ],

  riad: [
    {
      q: 'Minkä maan pääkaupunki Riad on?',
      options: ['Saudi-Arabia', 'Arabiemiraatit', 'Qatar', 'Kuwait'],
      correct: 0,
      fact: 'Riad on Saudi-Arabian pääkaupunki keskellä Arabian niemimaata.',
      hint: 'Maa on Arabian niemimaan suurin valtio.',
    },
    {
      q: 'Millainen ilmasto Riadissa on?',
      options: ['kuuma aavikkoilmasto', 'sateinen viidakkoilmasto', 'kylmä tundrailmasto', 'leuto saaristoilmasto'],
      correct: 0,
      level: 1,
      fact: 'Riadissa kesäpäivän lämpötila nousee usein yli 45 asteeseen, ja sadetta saadaan vain talvella.',
      hint: 'Kesällä lämpömittari näyttää usein yli 45 astetta.',
    },
    {
      q: 'Mitä eläimiä myydään Riadin laitamilla suurilla markkinoilla?',
      options: ['kameleita', 'poroja', 'norsuja', 'pingviinejä'],
      correct: 0,
      level: 1,
      fact: 'Riadin kamelimarkkinat ovat maailman suurimpia — eläimiä on kaupan tuhansia päivässä.',
      hint: 'Eläin jaksaa kulkea aavikolla päiväkausia lähes ilman vettä.',
    },
  ],

  rubalkhali: [
    {
      q: 'Mitä nimi Rub al-Khali tarkoittaa suomeksi?',
      options: ['tyhjä neljännes', 'kultainen kaupunki', 'punainen meri', 'korkea vuori'],
      correct: 0,
      level: 3,
      fact: 'Nimi kuvaa hyvin seutua: hiekka-aavikko peittää neljänneksen niemimaasta, eikä siellä asu juuri ketään.',
      hint: 'Nimi kertoo, ettei alueella asu juuri ketään.',
    },
    {
      q: 'Mikä Rub al-Khali on?',
      options: ['suurin yhtenäinen hiekka-aavikko', 'syvin kanjoni', 'laajin suoalue', 'korkein vuoristo'],
      correct: 0,
      fact: 'Rub al-Khali on maailman suurin yhtenäinen hiekka-aavikko, jonka dyynit kohoavat yli 200 metriin.',
      hint: 'Sen dyynit kohoavat yli 200 metrin korkeuteen.',
    },
    {
      q: 'Ketkä ovat perinteisesti eläneet Arabian aavikoilla paimentolaisina?',
      options: ['beduiinit', 'saamelaiset', 'inuiitit', 'maasait'],
      correct: 0,
      fact: 'Beduiinit kiersivät keitaalta toiselle kamelien, vuohien ja telttojen kanssa.',
      hint: 'He asuvat teltoissa ja siirtyvät keitaalta toiselle.',
    },
  ],

  sana: [
    {
      q: 'Minkä maan pääkaupunki Sana on?',
      options: ['Jemen', 'Oman', 'Qatar', 'Bahrain'],
      correct: 0,
      fact: 'Sana on Jemenin pääkaupunki yli 2 200 metrin korkeudessa vuoristossa.',
      hint: 'Maa sijaitsee Arabian niemimaan lounaiskulmassa.',
    },
    {
      q: 'Mistä Sanan vanhakaupunki tunnetaan?',
      options: ['tornitaloistaan', 'pilvenpiirtäjistään', 'kanavistaan', 'iglurakennuksistaan'],
      correct: 0,
      level: 3,
      fact: 'Sanan monikerroksiset savitalot on koristeltu valkoisin kuvioin kuin piparkakut — vanhakaupunki on maailmanperintökohde.',
      hint: 'Monikerroksiset savitalot on koristeltu valkoisin kuvioin kuin leivonnaiset.',
    },
    {
      q: 'Mikä juoma levisi maailmalle Jemenin vuorilta ja satamista?',
      options: ['kahvi', 'tee', 'kaakao', 'limonadi'],
      correct: 0,
      level: 3,
      fact: 'Jemenin vuorilla viljelty papu laivattiin maailmalle Mokhan satamasta — siitä tulee sana mokka.',
      hint: 'Mokka-nimitys tulee jemeniläisestä satamakaupungista.',
    },
  ],

  aden: [
    {
      q: 'Millaisessa paikassa Adenin satama sijaitsee?',
      options: ['sammuneen tulivuoren kraatterissa', 'jäätikön reunalla', 'joen suistossa', 'korallilaguunissa'],
      correct: 0,
      level: 3,
      fact: 'Adenin vanha kaupunginosa on rakennettu sammuneen tulivuoren kraatteriin, jota mustat laavakalliot reunustavat.',
      hint: 'Satamaa reunustavat mustat laavakalliot.',
    },
    {
      q: 'Minkä salmen meritietä Aden vartioi?',
      options: ['Bab el-Mandebin', 'Gibraltarin', 'Bosporin', 'Hormuzin'],
      correct: 0,
      level: 3,
      fact: 'Bab el-Mandeb yhdistää Punaisenmeren ja Adeninlahden — nimi tarkoittaa kyynelten porttia.',
      hint: 'Salmen nimi tarkoittaa kyynelten porttia.',
    },
    {
      q: 'Miksi Aden oli tärkeä pysähdyspaikka höyrylaivojen aikakaudella?',
      options: ['laivat täydensivät siellä hiilivarastonsa', 'siellä korjattiin purjeita', 'siellä vaihdettiin miehistöt', 'se oli ainoa satama jossa oli majakka'],
      correct: 0,
      level: 3,
      fact: 'Suezin kanavan avauduttua Aden oli maailman vilkkaimpia satamia: höyrylaivat lastasivat siellä hiiltä matkalla Intiaan.',
      hint: 'Höyrykoneiden pannuihin tarvittiin polttoainetta pitkällä reitillä.',
    },
  ],

  salalah: [
    {
      q: 'Mikä arvokas tuote teki Salalahin seudusta kuuluisan jo antiikin aikana?',
      options: ['suitsuke', 'silkki', 'posliini', 'tee'],
      correct: 0,
      level: 3,
      fact: 'Dhofarin vuorten suitsukepuista valutettua pihkaa vietiin faaraoille ja Rooman temppeleihin asti.',
      hint: 'Tuoksuvaa pihkaa poltetaan temppeleissä ja kirkoissa.',
    },
    {
      q: 'Mikä tekee Salalahin kesästä poikkeuksellisen Arabian niemimaalla?',
      options: ['monsuunisade vihertää seudun', 'siellä sataa lunta', 'aurinko ei laske lainkaan', 'kaupunki suljetaan kuumuuden takia'],
      correct: 0,
      level: 3,
      fact: 'Khareef-monsuuni tuo kesällä mereltä sumua ja sadetta, ja Salalahin ympäristö muuttuu vihreäksi.',
      hint: 'Khareef-tuuli tuo mereltä sumua ja sadetta.',
    },
    {
      q: 'Missä maassa Salalah sijaitsee?',
      options: ['Oman', 'Jemen', 'Saudi-Arabia', 'Qatar'],
      correct: 0,
      fact: 'Salalah on Omanin eteläisen Dhofarin maakunnan pääkaupunki.',
      hint: 'Maan pääkaupunki on Masqat.',
    },
  ],

  masqat: [
    {
      q: 'Minkä maan pääkaupunki Masqat on?',
      options: ['Oman', 'Jemen', 'Kuwait', 'Bahrain'],
      correct: 0,
      fact: 'Masqat on Omanin pääkaupunki, jonka vanhaa satamaa vartioivat kalliolinnoitukset.',
      hint: 'Maa täyttää Arabian niemimaan itäkulman.',
    },
    {
      q: 'Millä perinteisillä puulaivoilla omanilaiset ovat purjehtineet vuosisatoja?',
      options: ['dhow-laivoilla', 'viikinkilaivoilla', 'kaljaaseilla', 'gondoleilla'],
      correct: 0,
      level: 3,
      fact: 'Kolmiopurjeiset dhow-laivat kulkivat monsuunituulten mukana Intiaan ja Itä-Afrikkaan asti.',
      hint: 'Kolmiopurjeiset puualukset kulkivat monsuunituulten mukana.',
    },
    {
      q: 'Mitä Omanin rannikon kallioilla kohoavat vanhat rakennukset ovat?',
      options: ['linnoituksia', 'tuulimyllyjä', 'observatorioita', 'pyramideja'],
      correct: 0,
      fact: 'Portugalilaiset ja omanilaiset rakensivat satamien turvaksi kymmeniä linnoituksia.',
      hint: 'Ne rakennettiin suojaamaan satamia merirosvoilta ja valloittajilta.',
    },
  ],

  dubai: [
    {
      q: 'Mikä maailman korkein rakennus on Dubaissa?',
      options: ['Burj Khalifa', 'Eiffel-torni', 'Empire State Building', 'Taipei 101'],
      correct: 0,
      level: 1,
      fact: 'Burj Khalifa on 828 metriä korkea — yli kaksi kertaa niin korkea kuin Empire State Building.',
      hint: 'Sen huippu kohoaa yli 800 metriin.',
    },
    {
      q: 'Mistä Dubain seudun asukkaat saivat elantonsa ennen öljyä?',
      options: ['helmenkalastuksesta', 'viininviljelystä', 'turkiskaupasta', 'kullankaivuusta'],
      correct: 0,
      fact: 'Sukeltajat poimivat helmisimpukoita Persianlahden pohjasta ilman happilaitteita.',
      hint: 'Sukeltajat etsivät aarteita simpukoista merenpohjasta.',
    },
    {
      q: 'Minkä valtion suurin kaupunki Dubai on?',
      options: ['Arabiemiraattien', 'Saudi-Arabian', 'Qatarin', 'Omanin'],
      correct: 0,
      fact: 'Yhdistyneet arabiemiirikunnat on seitsemän emiraatin liitto — pääkaupunki on Abu Dhabi, mutta Dubai on suurin.',
      hint: 'Valtio on seitsemän pienen emiraatin liitto.',
    },
  ],

  doha: [
    {
      q: 'Minkä maan pääkaupunki Doha on?',
      options: ['Qatar', 'Bahrain', 'Kuwait', 'Oman'],
      correct: 0,
      fact: 'Doha on Qatarin pääkaupunki, jossa asuu suurin osa koko maan väestöstä.',
      hint: 'Pieni maa työntyy niemenä Persianlahteen.',
    },
    {
      q: 'Mikä suuri urheilutapahtuma järjestettiin Qatarissa vuonna 2022?',
      options: ['jalkapallon MM-kisat', 'kesäolympialaiset', 'talviolympialaiset', 'jääkiekon MM-kisat'],
      correct: 0,
      level: 1,
      fact: 'Qatar oli ensimmäinen arabimaa, joka isännöi jalkapallon MM-kisoja.',
      hint: 'Kisat siirrettiin poikkeuksellisesti talveen kuumuuden takia.',
    },
    {
      q: 'Millainen Doha oli sata vuotta sitten?',
      options: ['pieni helmenkalastajakylä', 'suuri teollisuuskaupunki', 'roomalainen siirtokunta', 'viikinkien kauppapaikka'],
      correct: 0,
      fact: 'Ennen öljyä ja maakaasua elanto tuli merestä — nyt Qatar on yksi maailman rikkaimmista maista.',
      hint: 'Ennen öljyä ja kaasua elanto nostettiin merestä.',
    },
  ],

  kuwait: [
    {
      q: 'Minkä kahden suuren naapurin välissä Kuwait sijaitsee?',
      options: ['Irakin ja Saudi-Arabian', 'Iranin ja Turkin', 'Egyptin ja Libyan', 'Syyrian ja Jordanian'],
      correct: 0,
      fact: 'Pieni Kuwait jää Persianlahden pohjukassa kahden ison naapurinsa väliin.',
      hint: 'Pohjoisnaapurin halki virtaavat Eufrat ja Tigris.',
    },
    {
      q: 'Mistä Kuwait saa suurimman osan juomavedestään?',
      options: ['merivedestä suolaa poistamalla', 'jäätiköistä', 'suurista joista', 'sadevesisäiliöistä'],
      correct: 0,
      fact: 'Aavikkomaassa ei ole yhtään pysyvää jokea, joten juomavesi valmistetaan merivedestä suolanpoistolaitoksissa.',
      hint: 'Aavikkomaassa ei virtaa yhtään pysyvää jokea.',
    },
    {
      q: 'Kuwaitin tunnetuimmat maamerkit ovat kolme tornia. Mitä niiden palloissa säilytetään?',
      options: ['vettä', 'öljyä', 'viljaa', 'kultaa'],
      correct: 0,
      level: 3,
      fact: 'Kuwait-tornien suuret pallot ovat vesisäiliöitä, ja ylimmässä on myös näköalakerros.',
      hint: 'Aavikkokaupungissa tätä nestettä on pakko varastoida.',
    },
  ],

  bagdad: [
    {
      q: 'Minkä joen rannalla Bagdad sijaitsee?',
      options: ['Tigris', 'Eufrat', 'Niili', 'Jordan'],
      correct: 0,
      fact: 'Bagdad perustettiin vuonna 762 Tigrisin rannalle pyöreäksi kaupungiksi.',
      hint: 'Sama joki virtaa myös Mosulin ohi.',
    },
    {
      q: 'Mikä kuuluisa oppineiden talo toimi Bagdadissa islamin kulta-aikana?',
      options: ['Viisauden talo', 'Peilisali', 'Taideakatemia', 'Tähtitorni'],
      correct: 0,
      level: 3,
      fact: 'Viisauden taloon koottiin ja käännettiin kreikkalaista, persialaista ja intialaista tiedettä 800-luvulla.',
      hint: 'Sinne koottiin ja käännettiin koko maailman tiedettä.',
    },
    {
      q: 'Missä satukokoelmassa Bagdadin kalifi Harun al-Rashid seikkailee?',
      options: ['Tuhannen ja yhden yön tarinoissa', 'Grimmin saduissa', 'Kalevalassa', 'Aisopoksen faabeleissa'],
      correct: 0,
      fact: 'Tuhannen ja yhden yön tarinoihin kuuluvat myös Aladdin ja merenkulkija Sinbad.',
      hint: 'Samaan kokoelmaan kuuluvat Aladdin ja merenkulkija Sinbad.',
    },
  ],

  mosul: [
    {
      q: 'Minkä muinaisen suurkaupungin rauniot ovat Mosulin naapurissa?',
      options: ['Ninive', 'Babylon', 'Troija', 'Karthago'],
      correct: 0,
      level: 3,
      fact: 'Ninive oli Assyrian valtakunnan pääkaupunki ja aikansa suurimpia kaupunkeja.',
      hint: 'Kaupunki oli Assyrian valtakunnan mahtava pääkaupunki.',
    },
    {
      q: 'Mikä ohut kangas on saanut nimensä Mosulista?',
      options: ['musliini', 'sametti', 'vakosametti', 'tweed'],
      correct: 0,
      level: 3,
      fact: 'Ilmava musliinikangas kulkeutui Euroopan kauppapaikoille Mosulin kautta ja sai siitä nimensä.',
      hint: 'Ilmavaa kangasta käytetään kesävaatteissa ja harsoissa.',
    },
    {
      q: 'Missä maassa Mosul sijaitsee?',
      options: ['Irak', 'Iran', 'Syyria', 'Turkki'],
      correct: 0,
      fact: 'Mosul on Irakin toiseksi suurin kaupunki — pääkaupunki on Bagdad.',
      hint: 'Maan pääkaupunki on Bagdad.',
    },
  ],

  tabriz: [
    {
      q: 'Mistä Tabrizin katettu basaari tunnetaan?',
      options: ['se on yksi maailman suurimmista', 'se on kokonaan maan alla', 'se kelluu veden päällä', 'se on rakennettu lasista'],
      correct: 0,
      fact: 'Tabrizin basaarin holvikäytäviä on kilometrien verran, ja se on Unescon maailmanperintökohde.',
      hint: 'Kilometrien pituiset holvikäytävät ovat maailmanperintöä.',
    },
    {
      q: 'Mitä käsityötuotteita Tabriz on vienyt maailmalle vuosisatoja?',
      options: ['mattoja', 'kelloja', 'viuluja', 'purjeita'],
      correct: 0,
      fact: 'Tabrizin matot solmitaan käsin lanka langalta — hienoimmissa on miljoonia solmuja.',
      hint: 'Ne solmitaan käsin lanka langalta, ja niiden päällä kävellään.',
    },
    {
      q: 'Minkä kuuluisan kauppareitin varrella Tabriz vaurastui?',
      options: ['silkkitien', 'meritien Intiaan', 'suolatien', 'kuninkaantien'],
      correct: 0,
      fact: 'Tabriz oli silkkitien tärkeä etappi, jossa idän karavaanit kohtasivat lännen kauppiaat.',
      hint: 'Reitti sai nimensä Kiinasta tuodusta arvokankaasta.',
    },
  ],

  teheran: [
    {
      q: 'Minkä maan pääkaupunki Teheran on?',
      options: ['Iran', 'Irak', 'Afganistan', 'Turkmenistan'],
      correct: 0,
      level: 1,
      fact: 'Teheran on Iranin pääkaupunki Elburzvuoriston juurella.',
      hint: 'Maassa puhutaan persiaa eli farsia.',
    },
    {
      q: 'Mikä lumihuippuinen vuori näkyy Teheraniin kirkkaalla säällä?',
      options: ['Damavand', 'Mont Blanc', 'Ararat', 'Elbrus'],
      correct: 0,
      level: 3,
      fact: 'Damavand on sammunut tulivuori ja Lähi-idän korkein huippu, yli 5 600 metriä.',
      hint: 'Se on Lähi-idän korkein huippu ja vanha tulivuori.',
    },
    {
      q: 'Mikä sana on levinnyt persialaisesta puutarhasta maailman kieliin?',
      options: ['paratiisi', 'basaari', 'viidakko', 'oaasi'],
      correct: 0,
      level: 3,
      fact: 'Persian sana tarkoitti muurien ympäröimää puutarhaa, ja kreikan kautta siitä tuli monien kielten sana taivaan puutarhalle.',
      hint: 'Muurien ympäröimä puutarha oli kuin taivas maan päällä.',
    },
  ],

  isfahan: [
    {
      q: 'Miten persialainen sananlasku ylistää Isfahania?',
      options: ['se on puoli maailmaa', 'se on tuhat tornia', 'se on kultainen häkki', 'se on aavikon helmi'],
      correct: 0,
      level: 3,
      fact: 'Sananlaskun mukaan Isfahanin nähtyään on nähnyt puolet kaikesta, mitä maailmassa on.',
      hint: 'Sananlaskun mukaan kaupungin nähtyään on nähnyt puolet kaikesta.',
    },
    {
      q: 'Millä Isfahanin moskeijat on päällystetty?',
      options: ['sinisillä kaakeleilla', 'kultalevyillä', 'marmorilla', 'peileillä'],
      correct: 0,
      fact: 'Isfahanin kupolit hohtavat taivaansinisinä — kaakeleiden kuviot ovat persialaisen taiteen huippua.',
      hint: 'Kupolit hohtavat taivaan värisinä.',
    },
    {
      q: 'Mikä Isfahanin Naqsh-e Jahanin aukio on?',
      options: ['yksi maailman suurimmista aukioista', 'maailman vanhin lentokenttä', 'suurin uima-allas', 'syvin kaivos'],
      correct: 0,
      level: 3,
      fact: 'Kuninkaiden aukiolla pelattiin aikoinaan poolo-otteluita, ja shaahi seurasi peliä palatsinsa parvekkeelta.',
      hint: 'Sen laidalla shaahi seurasi poolo-otteluita palatsistaan.',
    },
  ],

  persepolis: [
    {
      q: 'Minkä valtakunnan seremoniallinen pääkaupunki Persepolis oli?',
      options: ['Persian', 'Rooman', 'Egyptin', 'Kreikan'],
      correct: 0,
      fact: 'Suurkuninkaat Dareios ja Kserkses rakensivat Persepolista valtakuntansa loistoksi.',
      hint: 'Valtakunnan kuninkaita olivat Dareios ja Kserkses.',
    },
    {
      q: 'Kuka poltti Persepoliin vuonna 330 eaa.?',
      options: ['Aleksanteri Suuri', 'Julius Caesar', 'Tšingis-kaani', 'Napoleon'],
      correct: 0,
      level: 3,
      fact: 'Makedonian nuori kuningas valloitti Persian ja poltti Persepoliin palatsit.',
      hint: 'Makedonian nuori kuningas valloitti lähes koko tunnetun maailman.',
    },
    {
      q: 'Mitä Persepoliin kivireliefeissä kuvataan?',
      options: ['lahjoja tuovia kansoja', 'jalkapallo-otteluita', 'merirosvolaivoja', 'avaruuden tähtikuvioita'],
      correct: 0,
      fact: 'Portaikkojen seinillä marssii lähettiläitä valtakunnan joka kolkasta lahjat käsissään.',
      hint: 'Portaikkojen seinillä marssii lähettiläitä kaikkialta valtakunnasta.',
    },
  ],

  general: [
    {
      q: 'Mikä salmi erottaa Euroopan ja Aasian Istanbulin kohdalla?',
      options: ['Bosporinsalmi', 'Gibraltarinsalmi', 'Hormuzinsalmi', 'Beringinsalmi'],
      correct: 0,
      fact: 'Istanbul on maailman ainoa suurkaupunki, joka levittäytyy kahdelle mantereelle.',
      hint: 'Salmen molemmilla rannoilla on sama suurkaupunki.',
    },
    {
      q: 'Mitkä meret Suezin kanava yhdistää?',
      options: ['Välimeren ja Punaisenmeren', 'Mustanmeren ja Kaspianmeren', 'Persianlahden ja Adeninlahden', 'Atlantin ja Intian valtameren'],
      correct: 0,
      fact: 'Vuonna 1869 avattu kanava lyhensi laivamatkaa Euroopasta Aasiaan tuhansilla kilometreillä.',
      hint: 'Kanavan ansiosta laivojen ei tarvitse kiertää koko Afrikkaa.',
    },
    {
      q: 'Mihin suuntaan arabiaa kirjoitetaan?',
      options: ['oikealta vasemmalle', 'vasemmalta oikealle', 'ylhäältä alas', 'alhaalta ylös'],
      correct: 0,
      fact: 'Arabiankielisen kirjan sivutkin käännetään meistä katsoen takaperin.',
      hint: 'Kynä kulkee rivillä päinvastoin kuin suomessa.',
    },
    {
      q: 'Mikä on basaari?',
      options: ['katettu kauppapaikka', 'rukoushuone', 'aavikkotuuli', 'teelaji'],
      correct: 0,
      level: 1,
      fact: 'Basaarin kujilla myydään mausteita, mattoja, kultaa ja kankaita — ja hinnoista tingitään.',
      hint: 'Sen kujilla tingitään mausteista, matoista ja kullasta.',
    },
    {
      q: 'Mikä kuukausi on muslimeille paaston aikaa?',
      options: ['ramadan', 'safar', 'muharram', 'shawwal'],
      correct: 0,
      fact: 'Paastokuukauden aikana syödään vasta auringon laskettua, ja kuukauden päättää id al-fitr -juhla.',
      hint: 'Paastokuukauden päättää iloinen id al-fitr -juhla.',
    },
    {
      q: 'Missä taatelit kasvavat?',
      options: ['palmussa', 'pensaassa', 'köynnöksessä', 'maan alla'],
      correct: 0,
      level: 1,
      fact: 'Taatelipalmu on keitaiden tärkein puu: se antaa hedelmiä, varjoa ja rakennusainetta.',
      hint: 'Sama korkea puu antaa varjoa keitaiden viljelmille.',
    },
    {
      q: 'Mistä hummus tehdään?',
      options: ['kikherneistä', 'perunoista', 'riisistä', 'linsseistä'],
      correct: 0,
      fact: 'Hummukseen survotaan myös seesamitahnaa, sitruunaa ja valkosipulia.',
      hint: 'Pyöreät palkokasvin siemenet survotaan tahnaksi.',
    },
    {
      q: 'Mikä eläin tunnetaan aavikon laivana?',
      options: ['kameli', 'hevonen', 'aasi', 'norsu'],
      correct: 0,
      level: 1,
      fact: 'Kyttyrän rasvavarasto ja säästeliäs elimistö vievät eläimen aavikon poikki päivienkin matkat.',
      hint: 'Sen kyttyrässä on rasvavarasto pitkiä matkoja varten.',
    },
    {
      q: 'Mikä on muezzinin tehtävä?',
      options: ['kutsua rukoukseen', 'johtaa karavaania', 'paistaa leipää', 'kutoa mattoja'],
      correct: 0,
      fact: 'Rukouskutsu kaikuu minareetista viidesti päivässä.',
      hint: 'Hänen äänensä kaikuu minareetista viidesti päivässä.',
    },
    {
      q: 'Missä on maanpinnan alin kohta kuivalla maalla?',
      options: ['Kuolleenmeren rannalla', 'Kuolemanlaaksossa', 'Kaspianmeren rannalla', 'Saharan keskellä'],
      correct: 0,
      level: 3,
      fact: 'Ranta on yli 400 metriä merenpinnan alapuolella, ja se laskee yhä.',
      hint: 'Siellä ollaan yli 400 metriä merenpinnan alapuolella.',
    },
    {
      q: 'Minkä raaka-aineen ympärille Persianlahden maiden rikkaus on rakentunut?',
      options: ['öljyn', 'hopean', 'silkin', 'norsunluun'],
      correct: 0,
      fact: 'Suuri osa maailman öljystä pumpataan Persianlahden ympäriltä ja kuljetetaan tankkereilla Hormuzinsalmen kautta.',
      hint: 'Sitä pumpataan maan alta ja kuljetetaan tankkereissa.',
    },
    {
      q: 'Mikä kirjoitusjärjestelmä syntyi Kaksoisvirranmaassa ensimmäisenä maailmassa?',
      options: ['nuolenpääkirjoitus', 'aakkoset', 'hieroglyfit', 'kiinalaiset merkit'],
      correct: 0,
      level: 3,
      fact: 'Sumerilaiset painoivat merkkejä ruokokynällä savitauluihin yli 5 000 vuotta sitten.',
      hint: 'Merkit painettiin ruokokynällä pehmeisiin savitauluihin.',
    },
  ],
};

/**
 * "Tiesitkö että…" -tiedot paikoista. Peli näyttää yhden pelaajan nykyisestä
 * sijainnista, joten jokaisella kaupungilla on useampi vaihtoehto.
 */
export const MIDDLEEAST_FACTS = {
  istanbul: [
    'Istanbul on maailman ainoa suurkaupunki, joka levittäytyy kahdelle mantereelle: Bosporinsalmen toinen ranta on Eurooppaa ja toinen Aasiaa.',
    'Istanbulin suuri basaari on yksi maailman vanhimmista ja suurimmista katetuista kauppapaikoista — kujia on kymmeniä ja myymälöitä tuhansia.',
    'Kaupunki on ollut kolmen valtakunnan pääkaupunki: Rooman, Bysantin ja osmanien.',
  ],
  kairo: [
    'Kairo on arabimaailman suurin kaupunki, ja sen laidalla Gizassa seisovat yli 4 500 vuotta vanhat pyramidit.',
    'Kairon al-Azharissa on opetettu yli tuhat vuotta — se on maailman vanhimpia yliopistoja.',
  ],
  izmir: [
    'Izmir oli antiikin Smyrna, ja sen torin eli agoran rauniot ovat yhä keskellä nykykaupunkia.',
    'Izmirin satamasta on laivattu viikunoita ja rusinoita maailmalle vuosisatojen ajan.',
  ],
  ankara: [
    'Ankara valittiin Turkin pääkaupungiksi vuonna 1923, koska se sijaitsee suojassa keskellä Anatolian ylänköä.',
    'Angoravuohen pehmeä mohair-villa on saanut nimensä Ankaran vanhasta nimestä — samoin pörröinen angorakani.',
  ],
  kapadokia: [
    'Kappadokian pehmeään tuffikiveen on kaiverrettu koteja, kyyhkyslakkoja, kirkkoja ja kokonaisia maanalaisia kaupunkeja.',
    'Derinkuyun maanalainen kaupunki ulottuu noin 60 metrin syvyyteen, ja sinne saattoi suojautua tuhansia ihmisiä karjoineen.',
  ],
  nikosia: [
    'Nikosia on Euroopan viimeinen jaettu pääkaupunki: vartioitu vihreä linja erottaa sen kreikkalais- ja turkkilaisosan.',
    'Kypros antoi nimensä kuparille — saaren kaivokset olivat antiikin maailman tärkeimmät.',
  ],
  halab: [
    'Aleppon linnoitus kohoaa kukkulalla, jolla on asuttu jo yli 4 000 vuotta.',
    'Aleppon saippuaa keitetään oliiviöljystä ja laakerimarjaöljystä ja kypsytetään kuukausia — palat leimataan käsin.',
  ],
  damaskos: [
    'Damaskos on yksi maailman vanhimmista yhä asutuista kaupungeista — sen kaduilla on kävelty tuhansia vuosia.',
    'Umaijadien suuri moskeija on islamin vanhimpia, ja sen paikalla on sitä ennen ollut temppeli ja kirkko.',
  ],
  jerusalem: [
    'Jerusalemin muurien ympäröimä vanhakaupunki jakautuu neljään kortteliin: juutalaiseen, kristittyyn, muslimien ja armenialaisten.',
    'Kalliomoskeijan kultainen kupoli on hallinnut Jerusalemin siluettia yli 1 300 vuoden ajan.',
  ],
  petra: [
    'Petra oli nabatealaisten karavaanikaupunki, joka rikastui suitsuke- ja maustekaupan tulliporttina.',
    'Petra unohtui ulkomaailmalta sadoiksi vuosiksi, kunnes tutkimusmatkailija Johann Burckhardt löysi sen uudelleen vuonna 1812.',
  ],
  siinai: [
    'Siinain niemimaa on Aasian ja Afrikan välinen maasilta, jonka halki kauppiaat ja pyhiinvaeltajat ovat kulkeneet vuosituhansia.',
    'Pyhän Katariinan luostarissa on toiminut munkkeja yhtäjaksoisesti yli 1 400 vuotta, ja sen kirjasto on maailman vanhimpia.',
  ],
  luxor: [
    'Luxoria kutsutaan maailman suurimmaksi ulkoilmamuseoksi: temppeleitä ja hautoja on joka puolella.',
    'Karnakin temppeliä rakennettiin ja laajennettiin yli tuhannen vuoden ajan — sen suursali on metsä jättiläispylväitä.',
  ],
  medina: [
    'Islamin ajanlasku alkaa vuodesta 622, jolloin profeetta Muhammad muutti Mekasta Medinaan.',
    'Medinan keitaat ovat kuuluisia taateleistaan — arvostetuin lajike on tumma ajwa.',
  ],
  mekka: [
    'Hadž-pyhiinvaellus kokoaa Mekkaan vuosittain miljoonia ihmisiä kaikkialta maailmasta.',
    'Mekan suuren moskeijan keskellä on Kaaba, jota kohti muslimit rukoilevat kaikkialla maailmassa.',
  ],
  riad: [
    'Riadin nimi tulee arabian puutarhoja tarkoittavasta sanasta — kaupunki syntyi aavikon keitaalle.',
    'Riad kasvoi muutamassa vuosikymmenessä savitiilikylästä miljoonakaupungiksi öljyn löytymisen jälkeen.',
  ],
  rubalkhali: [
    'Rub al-Khali on maailman suurin yhtenäinen hiekka-aavikko — lähes Ranskan kokoinen hiekkameri.',
    'Ensimmäiset tunnetut eurooppalaiset ylittivät Rub al-Khalin vasta 1930-luvulla kamelikaravaanilla.',
  ],
  sana: [
    'Sana on yli 2 200 metrin korkeudessa — yksi maailman korkeimmalla sijaitsevista pääkaupungeista.',
    'Sanan vanhankaupungin tornitalot on rakennettu savesta ja koristeltu valkoisin kipsikuvioin kuin piparkakut.',
  ],
  aden: [
    'Adenin vanha kaupunginosa on rakennettu sammuneen tulivuoren kraatteriin.',
    'Höyrylaivojen aikaan Aden oli maailman vilkkaimpia satamia: laivat lastasivat siellä hiiltä matkalla Intiaan.',
  ],
  salalah: [
    'Salalahin seudun suitsukepuiden pihkaa vietiin jo faaraoiden Egyptiin ja Rooman temppeleihin.',
    'Kesän khareef-monsuuni muuttaa Salalahin ympäristön vihreäksi keskellä Arabian kuuminta aikaa.',
  ],
  masqat: [
    'Masqatin dhow-laivat kuljettivat taateleita, suitsuketta ja mausteita monsuunituulten mukana Intiaan ja Afrikkaan.',
    'Omanilaiset merenkulkijat purjehtivat aikoinaan Sansibariin asti, ja saari kuului pitkään Omanin sulttaanille.',
  ],
  dubai: [
    'Burj Khalifa on 828 metriä korkea — huipulta näkee kirkkaalla säällä yli sadan kilometrin päähän.',
    'Vielä 1900-luvun puolivälissä Dubai oli pieni helmenkalastajien ja kauppiaiden satamakylä.',
  ],
  doha: [
    'Qatarin niemimaalla ei ole yhtään jokea, joten juomavesi valmistetaan merivedestä.',
    'Dohan islamilaisen taiteen museo seisoo omalla tekosaarellaan sataman edustalla.',
  ],
  kuwait: [
    'Kuwait-tornien suuret pallot ovat vesisäiliöitä — ylimmässä on myös pyörivä näköalakerros.',
    'Kuwaitin luonnonsatama teki pienestä kalastajakylästä helmenpyynnin ja kaupan keskuksen jo ennen öljyä.',
  ],
  bagdad: [
    'Bagdad perustettiin vuonna 762 täysin pyöreäksi kaupungiksi, jonka keskellä oli kalifin palatsi.',
    'Islamin kulta-aikana Bagdad oli maailman suurimpia kaupunkeja, jonka Viisauden taloon koottiin aikansa tiede.',
  ],
  mosul: [
    'Mosulin naapurissa ovat muinaisen Niniven rauniot — Assyrian pääkaupungin, josta Raamattukin kertoo.',
    'Ohut musliinikangas on saanut nimensä Mosulista, jonka kautta sitä tuotiin Eurooppaan.',
  ],
  tabriz: [
    'Tabrizin katettu basaari on yksi maailman vanhimmista ja suurimmista — sen holvikäytäviä on kilometrien verran.',
    'Tabriz oli silkkitien tärkeä etappi, jossa idän karavaanit kohtasivat lännen kauppiaat.',
  ],
  teheran: [
    'Teheran nojaa Elburzvuoristoon: kaupungista pääsee talvella hiihtämään alle tunnissa.',
    'Damavandin yli 5 600-metrinen lumihuippu näkyy Teheraniin kirkkaalla säällä.',
  ],
  isfahan: [
    'Naqsh-e Jahanin aukio on yksi maailman suurimmista — sen laidalla pelattiin poolo-otteluita jo 1600-luvulla.',
    'Isfahanin vanhojen siltojen holveissa istutaan iltaisin teellä, ja Si-o-se-polin sillassa on 33 kaarta.',
  ],
  persepolis: [
    'Persepoliin palatsit seisovat suurella kiviterassilla, jonne noustaan leveitä seremoniaportaita pitkin.',
    'Persepoliin reliefeissä marssii lahjoja tuovia lähettiläitä 23 kansasta — kulkue on kuin valtakunnan kuvakirja.',
  ],
};
