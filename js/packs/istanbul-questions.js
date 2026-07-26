// Istanbul-laudan tietovisakysymykset. Kaupunkilaudalla "kaupungit" ovat
// kaupunginosia ja nähtävyyksiä, ja kysymykset kertovat suurkaupungin
// historiasta, kulttuurista ja arjesta. `general` toimii varapakkana.
//
// Muoto: { q, options[4], correct, fact, hint, level? } — ks. CONTRIBUTING.md.

export const ISTANBUL_QUESTIONS = {
  rumelinlinnoitus: [
    {
      q: 'Mitä varten Rumelin linnoitus rakennettiin vuonna 1452?',
      options: ['Konstantinopolin piirityksen tueksi', 'kesäpalatsiksi sulttaanille', 'merirosvojen vankilaksi', 'viljavarastoksi'],
      correct: 0,
      level: 3,
      fact: 'Mehmed II rakennutti linnoituksen salmen kapeimpaan kohtaan muutamassa kuukaudessa — vuotta myöhemmin Konstantinopoli valloitettiin.',
      hint: 'Linnoitus sulki laivatien kaupunkiin pohjoisesta.',
    },
    {
      q: 'Minkä salmen rannalla Rumelin linnoitus seisoo?',
      options: ['Bosporinsalmen', 'Gibraltarinsalmen', 'Hormuzinsalmen', 'Juutinrauman'],
      correct: 0,
      level: 1,
      fact: 'Linnoitus valvoi salmea, joka erottaa Euroopan ja Aasian.',
      hint: 'Sama salmi jakaa koko kaupungin kahdelle mantereelle.',
    },
    {
      q: 'Kuinka nopeasti Rumelin linnoitus valmistui?',
      options: ['muutamassa kuukaudessa', 'kymmenessä vuodessa', 'sadassa vuodessa', 'yhdessä yössä'],
      correct: 0,
      fact: 'Tuhannet rakentajat pystyttivät muurit ja tornit ennätysajassa kesällä 1452.',
      hint: 'Rakentajilla oli kova kiire ennen suurta piiritystä.',
    },
  ],

  dolmabahce: [
    {
      q: 'Mikä Dolmabahçe on?',
      options: ['sulttaanien palatsi', 'rautatieasema', 'jalkapallostadion', 'kylpylä'],
      correct: 0,
      fact: 'Sulttaanit muuttivat 1856 Topkapısta tähän eurooppalaistyyliseen palatsiin Bosporin rannalle.',
      hint: 'Sen salien kattokruunut kimaltavat kristallista.',
    },
    {
      q: 'Kenen kuolinhuone Dolmabahçessa on museona?',
      options: ['Atatürkin', 'Kleopatran', 'Napoleonin', 'Aleksanteri Suuren'],
      correct: 0,
      level: 3,
      fact: 'Turkin tasavallan perustaja Mustafa Kemal Atatürk kuoli palatsissa 1938 — sen kellot pysäytettiin hetkeen 9.05.',
      hint: 'Hän oli Turkin tasavallan ensimmäinen presidentti.',
    },
    {
      q: 'Missä Dolmabahçen palatsi sijaitsee?',
      options: ['Bosporin rannalla', 'vuoren huipulla', 'saarella', 'maan alla'],
      correct: 0,
      level: 1,
      fact: 'Palatsin portilta pääsi astumaan suoraan veneeseen.',
      hint: 'Sulttaani saapui palatsiinsa usein veneellä.',
    },
  ],

  taksim: [
    {
      q: 'Mikä Taksim on?',
      options: ['kaupungin keskusaukio', 'moskeija', 'silta', 'satama'],
      correct: 0,
      level: 1,
      fact: 'Taksimin aukio ja siitä lähtevä İstiklal-katu ovat nyky-Istanbulin sydän.',
      hint: 'Sieltä lähtee kuuluisa İstiklal-kävelykatu.',
    },
    {
      q: 'Mikä kulkuneuvo kulkee İstiklal-kadulla Taksimista?',
      options: ['nostalginen raitiovaunu', 'metrojuna', 'kamelikaravaani', 'köysirata'],
      correct: 0,
      fact: 'Punainen 1900-luvun alun raitiovaunu kulkee kävelykadun päästä päähän.',
      hint: 'Punainen vaunu kilistää kelloaan väkijoukon keskellä.',
    },
    {
      q: 'Mitä sana taksim tarkoittaa?',
      options: ['veden jakamista', 'toria', 'mäkeä', 'porttia'],
      correct: 0,
      level: 3,
      fact: 'Aukion paikalla jaettiin kaupungin vesi eri kaupunginosiin — nimi tulee jakamisesta.',
      hint: 'Nimi liittyy siihen, miten kaupungin juomavesi aikoinaan ohjattiin.',
    },
  ],

  galata: [
    {
      q: 'Ketkä rakensivat Galata-tornin 1300-luvulla?',
      options: ['genovalaiset', 'viikingit', 'roomalaiset', 'egyptiläiset'],
      correct: 0,
      level: 3,
      fact: 'Genovan kauppiaiden siirtokunta rakensi tornin muuriensa kulmaksi.',
      hint: 'Rakentajat tulivat italialaisesta merenkävijäkaupungista.',
    },
    {
      q: 'Mitä Galata-tornin parvekkeelta näkee?',
      options: ['koko kaupungin ja salmen', 'vain sisäpihan', 'Mustanmeren rannat', 'pyramidit'],
      correct: 0,
      level: 1,
      fact: 'Torni seisoo kukkulalla, ja sen ympäri kiertävältä parvekkeelta näkyy koko vanhakaupunki.',
      hint: 'Torni on kukkulan päällä, ja parveke kiertää sen ympäri.',
    },
    {
      q: 'Millä tarun sankari Hezârfen liiti Galata-tornista 1600-luvulla?',
      options: ['tekosiivillä', 'kuumailmapallolla', 'leijalla', 'raketilla'],
      correct: 0,
      fact: 'Tarinan mukaan Hezârfen Ahmed Çelebi liiti tornista Bosporin yli Üsküdariin asti.',
      hint: 'Tarinan mukaan hän ylitti salmen linnun tavoin.',
    },
  ],

  pierreloti: [
    {
      q: 'Kuka oli Pierre Loti, jonka mukaan kukkula on nimetty?',
      options: ['ranskalainen kirjailija', 'saksalainen keisari', 'italialainen maalari', 'venäläinen säveltäjä'],
      correct: 0,
      fact: 'Kirjailija istui kukkulan kahvilassa katselemassa Kultaista sarvea ja kirjoitti Istanbulista romaaneja.',
      hint: 'Hän kirjoitti romaaneja ja rakasti tätä kaupunkia.',
    },
    {
      q: 'Miten Pierre Lotin kukkulalle pääsee kätevimmin?',
      options: ['köysiradalla', 'hissillä pilvenpiirtäjässä', 'metrolla', 'laivalla'],
      correct: 0,
      fact: 'Pieni kaapelirata nousee rinnettä kahvilan terassille.',
      hint: 'Vaunu nousee rinnettä vaijerin varassa.',
    },
    {
      q: 'Mikä lahti kukkulalta avautuu?',
      options: ['Kultainen sarvi', 'Suomenlahti', 'Persianlahti', 'Biskajanlahti'],
      correct: 0,
      level: 1,
      fact: 'Kultainen sarvi on Bosporista erkaneva kapea lahti, kaupungin ikivanha satama.',
      hint: 'Lahden nimessä on jalometalli.',
    },
  ],

  balat: [
    {
      q: 'Mistä Balatin kaupunginosa tunnetaan?',
      options: ['värikkäistä taloistaan', 'pilvenpiirtäjistä', 'hiekkarannoista', 'viinitarhoista'],
      correct: 0,
      level: 1,
      fact: 'Balatin jyrkillä kujilla vanhat talot on maalattu keltaisiksi, punaisiksi ja sinisiksi.',
      hint: 'Kadut ovat kuin sateenkaari — joka talo eri sävyä.',
    },
    {
      q: 'Keiden vanha kotikaupunginosa Balat on?',
      options: ['juutalaisten ja kreikkalaisten', 'viikinkien', 'mongolien', 'atsteekkien'],
      correct: 0,
      level: 3,
      fact: 'Balat oli vuosisatoja juutalaisyhteisön koti, ja naapurikortteli Fener kreikkalaisten — synagogat ja kirkot ovat yhä vierekkäin.',
      hint: 'Kaupunginosassa on vanhoja synagogia ja kirkkoja vierekkäin.',
    },
    {
      q: 'Millainen Balatin katukuva on nykyään?',
      options: ['kahviloita ja antiikkikauppoja', 'autotehtaita', 'riisipeltoja', 'laskettelurinteitä'],
      correct: 0,
      fact: 'Vanhat talot ovat täyttyneet kahviloista, kirpputoreista ja pikkuputiikeista.',
      hint: 'Vanhoihin taloihin on avattu putiikkeja ja kuppiloita.',
    },
  ],

  maustebasaari: [
    {
      q: 'Millä toisella nimellä Maustebasaari tunnetaan?',
      options: ['Egyptin basaarina', 'Rooman torina', 'Silkkitorina', 'Kultabasaarina'],
      correct: 0,
      level: 3,
      fact: 'Basaari rakennettiin 1660-luvulla Egyptistä saatujen tullimaksujen tuotolla.',
      hint: 'Nimi viittaa Niilin maahan.',
    },
    {
      q: 'Mitä Maustebasaarista ostetaan?',
      options: ['mausteita ja makeisia', 'autonrenkaita', 'huonekaluja', 'tietokoneita'],
      correct: 0,
      level: 1,
      fact: 'Kojujen säkeissä tuoksuvat sahrami, sumakki, kaneli ja chili — ja hyllyt notkuvat makeisia.',
      hint: 'Säkeissä tuoksuvat sahrami, kaneli ja chili.',
    },
    {
      q: 'Mikä on lokum?',
      options: ['hyytelömäinen sokerimakeinen', 'suolainen keksi', 'jäätelölaji', 'kova karamelli'],
      correct: 0,
      fact: 'Lokumia eli "turkkilaista iloa" on tehty Istanbulissa 1700-luvulta asti, usein ruusuvedellä ja pistaasilla maustettuna.',
      hint: 'Pehmeät palat pyöritellään tomusokerissa.',
    },
  ],

  suuribasaari: [
    {
      q: 'Kuinka laaja Suuri basaari on?',
      options: ['tuhansia myymälöitä kymmenillä kujilla', 'yksi pitkä käytävä', 'kolme kioskia', 'yhden korttelin halli'],
      correct: 0,
      fact: 'Katettuja kujia on yli 60 ja myymälöitä noin 4 000 — yksi maailman suurimmista ja vanhimmista kauppapaikoista.',
      hint: 'Sokkeloon voi helposti eksyä koko päiväksi.',
    },
    {
      q: 'Milloin Suuri basaari perustettiin?',
      options: ['1400-luvulla', '1900-luvulla', 'antiikin aikana', '2000-luvulla'],
      correct: 0,
      level: 3,
      fact: 'Mehmed Valloittaja perusti basaarin pian Konstantinopolin valtauksen jälkeen.',
      hint: 'Se perustettiin pian Konstantinopolin valloituksen jälkeen.',
    },
    {
      q: 'Mitä basaarissa kuuluu tehdä ennen ostosta?',
      options: ['tinkiä hinnasta', 'jonottaa lippua', 'maksaa sisäänpääsy', 'varata aika'],
      correct: 0,
      level: 1,
      fact: 'Tinkiminen on osa kaupankäynnin iloa — myyjä tarjoaa usein teetä kaupanpäälle.',
      hint: 'Ensimmäinen hinta on vasta keskustelun avaus.',
    },
  ],

  topkapi: [
    {
      q: 'Keiden kotina Topkapın palatsi toimi vuosisatoja?',
      options: ['osmanisulttaanien', 'Rooman keisarien', 'faaraoiden', 'tsaarien'],
      correct: 0,
      fact: 'Topkapı oli osmanien valtakunnan hallintokeskus ja sulttaanien koti lähes 400 vuotta.',
      hint: 'Heidän valtakuntansa ulottui kolmelle mantereelle.',
    },
    {
      q: 'Mikä kuuluisa jalokivi on esillä Topkapıssa?',
      options: ['Kauhantekijän timantti', 'Kohinoor', 'Toivon timantti', 'Musta helmi'],
      correct: 0,
      level: 3,
      fact: '86-karaattinen Kaşıkçı eli Kauhantekijän timantti — tarun mukaan löytäjä vaihtoi sen kolmeen puulusikkaan.',
      hint: 'Tarun mukaan löytäjä vaihtoi sen kolmeen puulusikkaan.',
    },
    {
      q: 'Minkä kahden vesistön näkymät palatsin niemeltä avautuvat?',
      options: ['Bosporin ja Kultaisen sarven', 'Niilin ja Punaisenmeren', 'Tonavan ja Mustanmeren', 'Seinen ja Atlantin'],
      correct: 0,
      fact: 'Palatsi rakennettiin Sarayburnun niemelle, jossa salmi ja lahti kohtaavat.',
      hint: 'Palatsi seisoo niemen kärjessä kahden veden välissä.',
    },
  ],

  hagiasofia: [
    {
      q: 'Minä rakennuksena Hagia Sofia aloitti 500-luvulla?',
      options: ['kirkkona', 'moskeijana', 'palatsina', 'kirjastona'],
      correct: 0,
      fact: 'Keisari Justinianuksen suurkirkko oli lähes tuhat vuotta kristikunnan suurin.',
      hint: 'Sen rakennutti Bysantin keisari Justinianus.',
    },
    {
      q: 'Mikä Hagia Sofiassa hämmästytti aikalaisia eniten?',
      options: ['valtava kupoli', 'lasihissi', 'kellotorni', 'liukuportaat'],
      correct: 0,
      level: 1,
      fact: 'Kupoli näyttää leijuvan ikkunarivin päällä — aikalaiset uskoivat sen riippuvan taivaasta ketjulla.',
      hint: 'Se näyttää leijuvan ilmassa ikkunarivin päällä.',
    },
    {
      q: 'Mitä Hagia Sofian nimi tarkoittaa?',
      options: ['pyhää viisautta', 'kultaista porttia', 'suurta valoa', 'ikuista kaupunkia'],
      correct: 0,
      level: 3,
      fact: 'Nimi on kreikkaa: rakennus omistettiin Kristukselle Pyhänä Viisautena.',
      hint: 'Nimi on kreikkaa ja liittyy tietämiseen.',
    },
  ],

  sinimoskeija: [
    {
      q: 'Mistä Sininen moskeija on saanut lempinimensä?',
      options: ['sinisistä kaakeleista', 'sinisestä katosta', 'meren väristä', 'sinisistä ovista'],
      correct: 0,
      level: 1,
      fact: 'Sisäseiniä peittävät yli 20 000 sinivalkoista İznikin kaakelia.',
      hint: 'Sisäseiniä peittävät tuhannet käsin maalatut laatat.',
    },
    {
      q: 'Kuinka monta minareettia Sinisellä moskeijalla on?',
      options: ['kuusi', 'yksi', 'kaksi', 'kymmenen'],
      correct: 0,
      level: 3,
      fact: 'Määrä oli aikanaan kohu: yhtä monta kuin Mekan suurella moskeijalla, joten Mekkaan rakennettiin seitsemäs.',
      hint: 'Määrä herätti kohua, koska se oli sama kuin Mekassa.',
    },
    {
      q: 'Mitä kävijältä odotetaan moskeijaan astuttaessa?',
      options: ['kenkien riisumista', 'päähineen ostamista', 'pääsylippua', 'valokuvan ottamista'],
      correct: 0,
      level: 1,
      fact: 'Moskeijaan astutaan sukkasillaan, ja hartiat ja polvet peitetään.',
      hint: 'Ne jätetään ovelle hyllyyn tai kannetaan pussissa.',
    },
  ],

  uskudar: [
    {
      q: 'Millä mantereella Üsküdar sijaitsee?',
      options: ['Aasiassa', 'Euroopassa', 'Afrikassa', 'Etelä-Amerikassa'],
      correct: 0,
      level: 1,
      fact: 'Lauttamatka Eminönüstä Üsküdariin ylittää mantereiden rajan parissakymmenessä minuutissa.',
      hint: 'Lauttamatka vanhastakaupungista vie toiselle mantereelle.',
    },
    {
      q: 'Mitä Üsküdarin rannalta katsotaan auringonlaskussa?',
      options: ['vanhankaupungin tornit vastarannalla', 'aavikon dyynit', 'lumihuippuinen vuorijono', 'ei mitään — aina on sumua'],
      correct: 0,
      level: 1,
      fact: 'Aurinko laskee Euroopan puolen taakse, ja minareetit ja kupolit piirtyvät siluetteina taivasta vasten.',
      hint: 'Vastarannalla piirtyvät kupolit ja minareetit.',
    },
    {
      q: 'Mikä Üsküdar oli osmanien aikana?',
      options: ['karavaanien lähtöpaikka Aasiaan', 'kalastajakylä ilman satamaa', 'suljettu linnoitussaari', 'viinisatama'],
      correct: 0,
      level: 3,
      fact: 'Aasian karavaanit ja pyhiinvaeltajat lähtivät Üsküdarista kohti Mekkaa ja idän kaupunkeja.',
      hint: 'Sieltä alkoi maamatka kohti Mekkaa ja itää.',
    },
  ],

  neitsyttorni: [
    {
      q: 'Missä Neitsyttorni seisoo?',
      options: ['pikkusaarella salmen suulla', 'vuoren huipulla', 'sillan päällä', 'tekojärvessä'],
      correct: 0,
      level: 1,
      fact: 'Torni on rakennettu pienelle luodolle Bosporin suulle, ja sinne pääsee vain veneellä.',
      hint: 'Sinne pääsee vain veneellä.',
    },
    {
      q: 'Mitä tarina kertoo tornin nimestä?',
      options: ['prinsessa piilotettiin sinne ennustukselta', 'torni maalattiin valkoiseksi häitä varten', 'siellä asui merenneito', 'torni nousi merestä yhdessä yössä'],
      correct: 0,
      fact: 'Tarun mukaan sulttaani kätki tyttärensä torniin käärme-ennustukselta — mutta käärme saapui hedelmäkorissa.',
      hint: 'Tarinassa on ennustus, käärme ja hedelmäkori.',
    },
    {
      q: 'Mihin tornia on käytetty vuosisatojen aikana?',
      options: ['majakkana ja vartiotornina', 'viljasiilona', 'uimahyppytornina', 'tuulimyllynä'],
      correct: 0,
      fact: 'Torni on ollut vartiopaikka, majakka ja karanteeniasema — nykyään se on museo.',
      hint: 'Sen valo opasti laivoja salmen suulla.',
    },
  ],

  kadikoy: [
    {
      q: 'Mikä Kadıköy nykyään on?',
      options: ['vilkas tori- ja ravintolakaupunginosa', 'suljettu satama-alue', 'lentokenttäalue', 'teollisuusalue'],
      correct: 0,
      level: 1,
      fact: 'Kadıköyn kalatori, kahvilat ja katutaide tekevät siitä Aasian puolen sykkivän sydämen.',
      hint: 'Kalatorin kojut ja kahvilat täyttävät kadut.',
    },
    {
      q: 'Millä nimellä Kadıköyn paikalla ollut antiikin kaupunki tunnettiin?',
      options: ['Khalkedon', 'Troija', 'Sparta', 'Karthago'],
      correct: 0,
      level: 3,
      fact: 'Khalkedonia kutsuttiin "sokeain maaksi": sen asukkaat eivät muka huomanneet vastarannan parempaa paikkaa.',
      hint: 'Asukkaita sanottiin sokeiksi, koska he eivät valinneet vastarannan parempaa paikkaa.',
    },
    {
      q: 'Mitä Kadıköyn kuuluisalla torilla myydään?',
      options: ['kalaa ja vihanneksia', 'mattoja', 'autoja', 'jalokiviä'],
      correct: 0,
      level: 1,
      fact: 'Tiskeillä kimaltavat aamun saalis, oliivit, juustot ja mausteet.',
      hint: 'Tiskeillä kimaltaa aamun saalis suoraan veneistä.',
    },
  ],

  prinssisaaret: [
    {
      q: 'Mikä kulkuneuvo Prinssisaarilla oli pitkään kielletty?',
      options: ['autot', 'polkupyörät', 'veneet', 'junat'],
      correct: 0,
      fact: 'Saarilla liikuttiin hevoskärryillä ja polkupyörillä — nykyään hevoset on korvattu sähköbusseilla.',
      hint: 'Saarilla liikuttiin hevoskärryillä ja kävellen.',
    },
    {
      q: 'Mistä Prinssisaarten nimi tulee?',
      options: ['sinne karkotettiin Bysantin prinssejä', 'prinssit rakensivat saaret', 'saaret muistuttavat kruunua', 'vanhasta sadusta'],
      correct: 0,
      level: 3,
      fact: 'Bysantin hallitsijasuvun jäseniä karkotettiin saarten luostareihin pois vallan ääreltä.',
      hint: 'Saarille ei muutettu vapaaehtoisesti — sinne lähetettiin.',
    },
    {
      q: 'Miten Prinssisaarille pääsee?',
      options: ['lautalla', 'siltaa pitkin', 'tunnelin kautta', 'köysiradalla'],
      correct: 0,
      level: 1,
      fact: 'Lautat kulkevat saarille Kadıköystä ja Eminönüstä pitkin Marmaranmerta.',
      hint: 'Matka taittuu vain vettä pitkin.',
    },
  ],

  general: [
    {
      q: 'Kuinka monta ihmistä Istanbulissa asuu?',
      options: ['yli 15 miljoonaa', 'noin miljoona', 'noin satatuhatta', 'yli 50 miljoonaa'],
      correct: 0,
      fact: 'Istanbul on Euroopan suurin kaupunki — asukkaita on enemmän kuin monessa valtiossa.',
      hint: 'Enemmän kuin Suomessa ja Ruotsissa yhteensä.',
    },
    {
      q: 'Millä kahdella mantereella Istanbul sijaitsee?',
      options: ['Euroopassa ja Aasiassa', 'Aasiassa ja Afrikassa', 'Euroopassa ja Afrikassa', 'vain Euroopassa'],
      correct: 0,
      level: 1,
      fact: 'Bosporinsalmi jakaa kaupungin kahdelle mantereelle — ainoana suurkaupunkina maailmassa.',
      hint: 'Salmi jakaa kaupungin kahtia.',
    },
    {
      q: 'Mikä oli Istanbulin nimi Bysantin valtakunnan aikana?',
      options: ['Konstantinopoli', 'Ankara', 'Aleksandria', 'Antiokia'],
      correct: 0,
      fact: 'Kaupunki oli yli tuhat vuotta Konstantinopoli, ja sitä ennen Byzantion.',
      hint: 'Nimi tuli keisari Konstantinuksesta.',
    },
    {
      q: 'Minkä juoman ääressä kahviloissa pelataan backgammonia?',
      options: ['teen', 'kaakaon', 'limonadin', 'piimän'],
      correct: 0,
      level: 1,
      fact: 'Tulppaanilasista juotava çay on Turkin seurustelujuoma aamusta iltaan.',
      hint: 'Sitä tarjoillaan pienestä tulppaanin muotoisesta lasista.',
    },
    {
      q: 'Mikä on simit?',
      options: ['rinkilämäinen seesamileipä', 'kalakeitto', 'jäätelöannos', 'kudottu matto'],
      correct: 0,
      fact: 'Katukauppiaiden rapeita simit-rinkeleitä syödään aamiaiseksi ja välipalaksi.',
      hint: 'Katukauppias kantaa niitä pinossa tarjottimella päänsä päällä.',
    },
    {
      q: 'Mikä silta yhdisti ensimmäisenä Euroopan ja Aasian Istanbulissa?',
      options: ['Bosporinsilta', 'Tower Bridge', 'Kultaportin silta', 'Öresundin silta'],
      correct: 0,
      level: 1,
      fact: 'Ensimmäinen silta valmistui 1973 — nykyään salmen ylittää kolme siltaa ja kaksi tunnelia.',
      hint: 'Silta on saanut nimensä salmesta, jonka se ylittää.',
    },
    {
      q: 'Miten turkkilainen kahvi valmistetaan?',
      options: ['keittämällä hienoksi jauhettu kahvi pannussa', 'suodattamalla', 'kapselikoneella', 'pikakahvina'],
      correct: 0,
      fact: 'Cezve-pannussa keitetty kahvi tarjoillaan sakkoineen — ja kupin pohjasta ennustetaan.',
      hint: 'Pieni pitkävartinen pannu upotetaan joskus kuumaan hiekkaan.',
    },
    {
      q: 'Mikä on hamam?',
      options: ['turkkilainen kylpylä', 'perinteinen tanssi', 'soitin', 'jälkiruoka'],
      correct: 0,
      level: 1,
      fact: 'Höyryävässä hamamissa peseydytään kuumalla marmoritasolla, ja pesijä hieroo saippuavaahdolla.',
      hint: 'Siellä hikoillaan höyryssä marmoritasolla.',
    },
    {
      q: 'Mitä balık ekmek tarkoittaa?',
      options: ['kalaleipää', 'lihapullia', 'hedelmäsalaattia', 'juustotarjotinta'],
      correct: 0,
      fact: 'Eminönün rannassa paistettu kala käännetään sämpylän väliin suoraan veneestä.',
      hint: 'Sämpylän väliin käännetään juuri paistettu saalis.',
    },
    {
      q: 'Kuka valloitti Konstantinopolin vuonna 1453?',
      options: ['Mehmed II', 'Aleksanteri Suuri', 'Tšingis-kaani', 'Julius Caesar'],
      correct: 0,
      level: 3,
      fact: 'Nuori sulttaani sai lisänimen Valloittaja — hänen laivansa vedettiin maata pitkin Kultaiseen sarveen.',
      hint: 'Nuori sulttaani sai lisänimen Valloittaja.',
    },
    {
      q: 'Mikä asema Istanbulin kadunkissoilla on?',
      options: ['ne ovat koko kaupungin hoivaamia', 'ne on kielletty', 'niitä ei ole', 'ne kuuluvat sulttaanille'],
      correct: 0,
      level: 1,
      fact: 'Asukkaat ruokkivat kulmakuntansa kissoja, ja niistä on tehty kuuluisa elokuvakin.',
      hint: 'Karvaisia kaupunkilaisia ruokitaan joka kulmalla.',
    },
    {
      q: 'Mikä muinainen kilparata oli Sultanahmetin aukion paikalla?',
      options: ['hippodromi', 'Colosseum', 'Circus Maximus', 'olympiastadion'],
      correct: 0,
      level: 3,
      fact: 'Bysantin hippodromilla kilpailtiin hevosvaunuilla — aukiolla seisoo yhä sieltä tuotu egyptiläinen obeliski.',
      hint: 'Siellä kilpailtiin hevosvaunuilla kymmenientuhansien katsojien edessä.',
    },
  ],
};

/**
 * "Tiesitkö että…" -tiedot paikoista. Peli näyttää yhden pelaajan nykyisestä
 * sijainnista, joten jokaisella paikalla on useampi vaihtoehto.
 */
export const ISTANBUL_FACTS = {
  lentoasema: [
    'Istanbulin lentoasema on matkustajamääriltään Euroopan suurimpia — sen kautta lentää vuosittain kymmeniä miljoonia matkustajia.',
    'Lentoasemalta on yli 40 kilometriä keskustaan, ja matka taittuu metrolla.',
  ],
  sabihagokcen: [
    'Sabiha Gökçen on nimetty maailman ensimmäisen naishävittäjälentäjän mukaan — hän oli Atatürkin kasvattitytär.',
    'Kenttä palvelee Istanbulin Aasian-puoleista osaa Marmaranmeren tuntumassa.',
  ],
  rumelinlinnoitus: [
    'Rumelin linnoitus rakennettiin salmen kapeimpaan kohtaan vain neljässä kuukaudessa vuonna 1452.',
    'Linnoitusta vastapäätä Aasian rannalla seisoo vanhempi sisar, Anadolun linnoitus.',
  ],
  dolmabahce: [
    'Dolmabahçen juhlasalin kattokruunussa on 750 lamppua — se on maailman suurimpia.',
    'Palatsin kellot on pysäytetty aikaan 9.05, Atatürkin kuolinhetkeen.',
  ],
  taksim: [
    'İstiklal-kadulla kävelee viikonloppuisin jopa miljoonia ihmisiä päivässä.',
    'Taksimin nimi tulee vedenjakelusta: aukiolla jaettiin kaupungin vesi eri kaupunginosiin.',
  ],
  galata: [
    'Galata-tornia on käytetty vankilana, tähtitornina ja palovartiotornina.',
    'Tarun mukaan Hezârfen Ahmed Çelebi liiti tekosiivillä tornista Bosporin yli 1600-luvulla.',
  ],
  pierreloti: [
    'Pierre Lotin kahvilasta avautuu kuuluisin näköala Kultaiseen sarveen.',
    'Kukkulalle nousee köysirata vanhan hautausmaan sypressien yli.',
  ],
  balat: [
    'Balatin värikkäät talot ovat suosituimpia valokuvauspaikkoja koko kaupungissa.',
    'Naapurikorttelissa Fenerissä toimii yhä ekumeeninen patriarkaatti, ortodoksisen kirkon vanha keskus.',
  ],
  maustebasaari: [
    'Maustebasaari rakennettiin 1660-luvulla, ja sen tuotot ylläpitivät viereistä Uutta moskeijaa.',
    'Basaarin kujilla myydään myös lokumia, kuivattuja hedelmiä ja sata lajia juustoa.',
  ],
  suuribasaari: [
    'Suuressa basaarissa on yli 60 katettua kujaa ja noin 4 000 myymälää.',
    'Basaarin kultakauppiaiden kujat ovat toimineet samoilla paikoilla vuosisatoja.',
  ],
  topkapi: [
    'Topkapın keittiöissä valmistettiin parhaimmillaan ruokaa kymmenelle tuhannelle hengelle päivässä.',
    'Palatsin aarrekammiossa säilytetään 86-karaattista Kauhantekijän timanttia.',
  ],
  hagiasofia: [
    'Hagia Sofian kupoli oli lähes tuhat vuotta maailman suurin — sen halkaisija on yli 30 metriä.',
    'Rakennus on ollut kirkko, moskeija, museo ja jälleen moskeija.',
  ],
  sinimoskeija: [
    'Sinisen moskeijan sisäseiniä peittää yli 20 000 käsin maalattua İznikin kaakelia.',
    'Moskeija rakennettiin suoraan Bysantin keisaripalatsin raunioiden päälle.',
  ],
  uskudar: [
    'Üsküdarin rannalta katsotaan kuuluisinta auringonlaskua: vanhakaupunki piirtyy siluettina vastarannalle.',
    'Üsküdar oli karavaanien ja pyhiinvaeltajien lähtöpaikka kohti Mekkaa.',
  ],
  neitsyttorni: [
    'Neitsyttorni on rakennettu pienelle luodolle Bosporin suulle — se on ollut majakka, vartiotorni ja karanteeniasema.',
    'Tornin tarussa prinsessaa suojeltiin käärme-ennustukselta, mutta käärme saapui hedelmäkorissa.',
  ],
  kadikoy: [
    'Kadıköyn paikalla oli antiikin Khalkedon, jota kutsuttiin "sokeain maaksi".',
    'Kadıköyn kalatorilla ja kahviloissa sykkii Aasian puolen arki — ja seinät ovat täynnä katutaidetta.',
  ],
  prinssisaaret: [
    'Prinssisaarilla ei pitkään saanut ajaa autolla — liikenne hoidettiin hevoskärryillä.',
    'Bysantin aikana saarten luostarit toimivat vallasta syrjäytettyjen prinssien karkotuspaikkoina.',
  ],
};
