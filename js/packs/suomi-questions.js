// Suomi-laudan kysymykset ja Tiesitkö että -tiedot.
//
// level: 1 = helppo (lapsille), 2 = perus (oletus), 3 = vaikea (bonus).
// Vihje ei saa sisältää oikeaa vastausta — testit valvovat tätä.

export const SUOMI_QUESTIONS = {
  turku: [
    {
      q: 'Mikä joki virtaa Turun halki?',
      options: ['Aurajoki', 'Vantaanjoki', 'Kokemäenjoki', 'Oulujoki'],
      correct: 0,
      level: 1,
      fact: 'Aurajoen rannat ovat turkulaisten olohuone: kesäisin jokilaivat ja rantabulevardit täyttyvät.',
      hint: 'Joen nimi muistuttaa peltotyökalua.',
    },
    {
      q: 'Mikä keskiaikainen rakennus vartioi Turun jokisuuta?',
      options: ['Turun linna', 'Olavinlinna', 'Hämeen linna', 'Suomenlinna'],
      correct: 0,
      fact: 'Linna on Suomen suurin keskiaikainen rakennus, ja sen vanhimmat osat ovat 1280-luvulta.',
      hint: 'Linna on nimetty kaupunkinsa mukaan.',
    },
    {
      q: 'Minä vuonna Turun suurpalo tuhosi lähes koko kaupungin?',
      options: ['1827', '1808', '1852', '1900'],
      correct: 0,
      level: 3,
      fact: 'Palo oli Pohjoismaiden suurin kaupunkipalo. Sen jälkeen yliopisto siirrettiin Helsinkiin.',
      hint: 'Samalla vuosikymmenellä Suomi oli juuri siirtynyt Venäjän vallan alle.',
    },
  ],

  maarianhamina: [
    {
      q: 'Mikä on Ahvenanmaan virallinen kieli?',
      options: ['ruotsi', 'suomi', 'norja', 'tanska'],
      correct: 0,
      level: 1,
      fact: 'Ahvenanmaa on yksikielisesti ruotsinkielinen itsehallintoalue, vaikka se kuuluu Suomeen.',
      hint: 'Länsinaapurin kieli.',
    },
    {
      q: 'Mitä Ahvenanmaan itsehallinto tarkoittaa?',
      options: [
        'maakunnalla on omat päättäjät ja lait monissa asioissa',
        'Ahvenanmaa on itsenäinen valtio',
        'Ahvenanmaa kuuluu Ruotsiin',
        'saarilla ei tarvitse noudattaa lakeja',
      ],
      correct: 0,
      fact: 'Ahvenanmaalla on oma maakuntapäivät, oma lippu ja omat postimerkit — mutta se on osa Suomea.',
      hint: 'Itsehallinto on itsenäisyyttä pienempi asia.',
    },
    {
      q: 'Miksi Ahvenanmaalla ei ole varuskuntia eikä sotilaita?',
      options: [
        'saaret demilitarisoitiin kansainvälisellä sopimuksella',
        'saarille ei mahdu varuskuntaa',
        'Ruotsi kielsi sotilaat',
        'sotilaita ei ole varaa palkata',
      ],
      correct: 0,
      level: 3,
      fact: 'Demilitarisointi alkoi Krimin sodan rauhasta 1856 ja vahvistettiin 1921 — saaret ovat aseeton alue.',
      hint: 'Ratkaisu syntyi 1800-luvun suurvaltasodan jälkeen.',
    },
  ],

  tampere: [
    {
      q: 'Minkä kahden järven välissä Tampere sijaitsee?',
      options: [
        'Näsijärven ja Pyhäjärven',
        'Saimaan ja Päijänteen',
        'Inarijärven ja Oulujärven',
        'Kallaveden ja Keiteleen',
      ],
      correct: 0,
      level: 1,
      fact: 'Järvien välissä kuohuva Tammerkoski antoi voiman tehtaille, joista kaupunki syntyi.',
      hint: 'Koski yhdistää järvet keskellä kaupunkia.',
    },
    {
      q: 'Mikä teollisuus toi Tampereelle lempinimen "Suomen Manchester"?',
      options: ['puuvillatehtaat', 'autotehtaat', 'telakat', 'kaivokset'],
      correct: 0,
      fact: 'Finlaysonin puuvillatehdas oli aikanaan Pohjoismaiden suurin, ja sen alue on nyt kulttuurikeskus.',
      hint: 'Sama ala teki Manchesterista suurkaupungin.',
    },
    {
      q: 'Mikä perinneherkku ostetaan Tampereella kauppahallista puolukkahillon kera?',
      options: ['mustamakkara', 'kalakukko', 'leipäjuusto', 'karjalanpaisti'],
      correct: 0,
      fact: 'Tampereen kauppahalli on Pohjoismaiden suurin, ja sen tunnetuin herkku syödään paikan päällä.',
      hint: 'Nimessä on väri ja ruokalaji.',
    },
  ],

  pori: [
    {
      q: 'Mikä kuuluisa musiikkitapahtuma järjestetään Porissa joka kesä?',
      options: ['Pori Jazz', 'Ruisrock', 'oopperajuhlat', 'tangomarkkinat'],
      correct: 0,
      level: 1,
      fact: 'Festivaali on järjestetty vuodesta 1966 ja se on Euroopan vanhimpia lajissaan.',
      hint: 'Musiikkityyli syntyi Yhdysvalloissa.',
    },
    {
      q: 'Mikä on Porin kuuluisa hiekkaranta?',
      options: ['Yyteri', 'Hietaniemi', 'Nallikari', 'Kalajoki'],
      correct: 0,
      fact: 'Kilometrien pituiset dyynit tekevät rannasta Pohjoismaiden suurimpia — siellä myös lainelautaillaan.',
      hint: 'Nimi alkaa aakkosten harvinaisimmalla kirjaimella.',
    },
  ],

  vaasa: [
    {
      q: 'Mikä Vaasan edustan saaristo on Unescon maailmanperintökohde?',
      options: ['Merenkurkun saaristo', 'Turun saaristo', 'Ahvenanmaa', 'Suomenlahden saaret'],
      correct: 0,
      fact: 'Merenkurkussa maa kohoaa merestä lähes sentin vuodessa — uutta maata syntyy silmissä.',
      hint: 'Kapein kohta Suomen ja Ruotsin välissä.',
    },
    {
      q: 'Miksi maa kohoaa Merenkurkussa yhä?',
      options: [
        'jääkauden jään paino suli pois ja maa oikenee',
        'meri haihtuu auringossa',
        'tulivuoret nostavat maata',
        'joet kasaavat hiekkaa',
      ],
      correct: 0,
      level: 3,
      fact: 'Kilometrien paksuinen mannerjää painoi maankuorta alas; jään sulettua kuori nousee yhä, noin 8 mm vuodessa.',
      hint: 'Syy on kymmenientuhansien vuosien takainen.',
    },
  ],

  jyvaskyla: [
    {
      q: 'Missä maakunnassa Jyväskylä sijaitsee?',
      options: ['Keski-Suomessa', 'Lapissa', 'Savossa', 'Uudellamaalla'],
      correct: 0,
      level: 1,
      fact: 'Jyväskylä on maakuntansa keskus ja tunnettu opiskelijakaupunki.',
      hint: 'Maakunnan nimi kertoo sijainnin kartalla.',
    },
    {
      q: 'Kenen kuuluisan arkkitehdin rakennuksia Jyväskylässä on kymmeniä?',
      options: ['Alvar Aallon', 'Eliel Saarisen', 'C. L. Engelin', 'Reima Pietilän'],
      correct: 0,
      fact: 'Arkkitehti vietti kouluvuotensa Jyväskylässä, ja kaupungissa on hänen nimikkomuseonsa.',
      hint: 'Hänen suunnittelemansa maljakko on maailmankuulu.',
    },
    {
      q: 'Mikä perustettiin Jyväskylään ensimmäisenä Suomessa vuonna 1863?',
      options: [
        'suomenkielinen opettajaseminaari',
        'ensimmäinen yliopisto',
        'ensimmäinen rautatieasema',
        'ensimmäinen sanomalehti',
      ],
      correct: 0,
      level: 3,
      fact: 'Uno Cygnaeuksen johtama seminaari koulutti opettajat kansakouluihin — siksi Jyväskylää kutsutaan Suomen Ateenaksi.',
      hint: 'Kaupunkia kutsutaan koulujensa vuoksi Suomen Ateenaksi.',
    },
  ],

  lappeenranta: [
    {
      q: 'Minkä järven rannalla Lappeenranta sijaitsee?',
      options: ['Saimaan', 'Päijänteen', 'Inarijärven', 'Näsijärven'],
      correct: 0,
      level: 1,
      fact: 'Saimaa on Suomen suurin järvi ja Euroopan neljänneksi suurin luonnonjärvi.',
      hint: 'Suomen suurin järvi.',
    },
    {
      q: 'Minne Saimaan kanava johtaa Lappeenrannan läheltä?',
      options: ['Suomenlahdelle Viipurin kautta', 'Laatokkaan', 'Päijänteeseen', 'Pohjanlahdelle'],
      correct: 0,
      level: 3,
      fact: 'Kanavan loppuosa kulkee Venäjältä vuokratulla alueella — harvinainen järjestely maailmassa.',
      hint: 'Kanava laskee mereen naapurimaan puolella.',
    },
  ],

  savonlinna: [
    {
      q: 'Mikä linna kohoaa keskellä Savonlinnaa?',
      options: ['Olavinlinna', 'Turun linna', 'Hämeen linna', 'Kajaanin linna'],
      correct: 0,
      level: 1,
      fact: 'Vuonna 1475 perustettu linna rakennettiin saarelle keskelle Saimaan virtoja.',
      hint: 'Linna on nimetty pyhimyksen mukaan.',
    },
    {
      q: 'Mikä kuuluisa kesätapahtuma linnassa järjestetään?',
      options: ['oopperajuhlat', 'jazzfestivaali', 'elokuvajuhlat', 'tangomarkkinat'],
      correct: 0,
      fact: 'Juhlat keräävät kesäisin kymmeniätuhansia kuulijoita linnanpihalle — laulu kaikuu muurien sisällä.',
      hint: 'Laulajat esittävät aarioita linnanpihalla.',
    },
    {
      q: 'Mikä harvinainen eläin elää vain Saimaassa?',
      options: ['saimaannorppa', 'merikotka', 'majava', 'ahma'],
      correct: 0,
      level: 1,
      fact: 'Norppia on vain noin 500. Kanta jäi järveen "vangiksi", kun maa kohosi jääkauden jälkeen.',
      hint: 'Se on makeassa vedessä elävä hylje.',
    },
  ],

  kuopio: [
    {
      q: 'Mikä perinneruoka yhdistetään Kuopioon?',
      options: ['kalakukko', 'karjalanpiirakka', 'mustamakkara', 'leipäjuusto'],
      correct: 0,
      level: 1,
      fact: 'Herkussa muikut tai ahvenet leivotaan ruisleivän sisään — eväs säilyi ennen pitkilläkin matkoilla.',
      hint: 'Kala leivotaan ruisleivän sisään.',
    },
    {
      q: 'Miltä mäeltä avautuu Kuopion kuuluisin näköala järville?',
      options: ['Puijolta', 'Kolilta', 'Aavasaksalta', 'Pyynikiltä'],
      correct: 0,
      fact: 'Mäen tornista näkee Kallaveden saariston, ja rinteessä on myös hyppyrimäet.',
      hint: 'Mäellä hypätään talvisin mäkihyppyä.',
    },
  ],

  joensuu: [
    {
      q: 'Minkä maakunnan keskus Joensuu on?',
      options: ['Pohjois-Karjalan', 'Savon', 'Kainuun', 'Lapin'],
      correct: 0,
      level: 1,
      fact: 'Karjalaisuus kuuluu kaupungissa murteena ja näkyy piirakkoina toreilla.',
      hint: 'Maakunta on Suomen itäisin.',
    },
    {
      q: 'Mikä kansallismaisema kohoaa Pielisen rannalla Joensuun pohjoispuolella?',
      options: ['Koli', 'Punkaharju', 'Aavasaksa', 'Pallastunturi'],
      correct: 0,
      level: 3,
      fact: 'Vaaran laelta avautuva järvimaisema innoitti Sibeliusta ja kultakauden taidemaalareita.',
      hint: 'Suomen tunnetuin vaaramaisema, josta on maalattu lukemattomia tauluja.',
    },
  ],

  kajaani: [
    {
      q: 'Minkä maakunnan keskus Kajaani on?',
      options: ['Kainuun', 'Lapin', 'Pohjanmaan', 'Savon'],
      correct: 0,
      level: 1,
      fact: 'Maakunta tunnetaan vaaroistaan, soistaan ja Nälkämaan laulusta.',
      hint: 'Nälkämaan laulu kertoo tästä maakunnasta.',
    },
    {
      q: 'Kuka kuuluisa runonkerääjä työskenteli Kajaanissa piirilääkärinä?',
      options: ['Elias Lönnrot', 'Aleksis Kivi', 'J. L. Runeberg', 'Mika Waltari'],
      correct: 0,
      level: 3,
      fact: 'Hän teki Kajaanista käsin keruumatkansa Vienan Karjalaan ja kokosi runoista Kalevalan.',
      hint: 'Hänen kokoamansa teos on Suomen kansalliseepos.',
    },
  ],

  kemi: [
    {
      q: 'Mikä rakennus nousee Kemiin joka talvi ja sulaa keväällä?',
      options: ['lumilinna', 'hiekkalinna', 'lasikirkko', 'jääkarusselli'],
      correct: 0,
      level: 1,
      fact: 'Maailman suurin lumilinna on rakennettu Kemiin vuodesta 1996 — sisällä on jopa hotelli ja ravintola.',
      hint: 'Se rakennetaan pakkasella vedestä ja tykkilumesta.',
    },
    {
      q: 'Mikä jäänmurtaja vie matkailijoita risteilylle Kemin edustalle?',
      options: ['Sampo', 'Urho', 'Sisu', 'Otso'],
      correct: 0,
      level: 3,
      fact: 'Vuonna 1961 valmistunut murtaja jäi eläkkeeltä matkailukäyttöön: kyytiläiset voivat uida jäissä pelastuspuvuissa.',
      hint: 'Nimi on sama kuin Kalevalan ihmemyllyllä.',
    },
  ],

  rovaniemi: [
    {
      q: 'Kuka kuuluisa hahmo asuu Rovaniemen napapiirillä?',
      options: ['Joulupukki', 'Lumiukko', 'Peikko', 'Petteri Punakuono'],
      correct: 0,
      level: 1,
      fact: 'Napapiirin pajakylään saapuu vuosittain puoli miljoonaa kirjettä ja satojatuhansia vieraita.',
      hint: 'Hänelle kirjoitetaan kirjeitä ympäri maailmaa joulun alla.',
    },
    {
      q: 'Minkä eläimen sarvien muotoon Rovaniemen keskusta jälleenrakennettiin sodan jälkeen?',
      options: ['poron', 'hirven', 'karhun', 'ahman'],
      correct: 0,
      level: 3,
      fact: 'Lapin sota poltti Rovaniemen 1944. Alvar Aallon asemakaavassa pääkadut piirtävät sarvet ja stadion on silmä.',
      hint: 'Eläin on Lapin tunnetuin.',
    },
  ],

  kittila: [
    {
      q: 'Mikä suuri laskettelukeskus sijaitsee Kittilässä?',
      options: ['Levi', 'Ruka', 'Tahko', 'Himos'],
      correct: 0,
      level: 1,
      fact: 'Tunturissa ajetaan alppihiihdon maailmancupin pujottelu marraskuisin.',
      hint: 'Nimi on lyhyt ja tarkoittaa myös leveää.',
    },
    {
      q: 'Mitä Kittilän suurelta kaivokselta louhitaan?',
      options: ['kultaa', 'rautaa', 'nikkeliä', 'timantteja'],
      correct: 0,
      level: 3,
      fact: 'Kittilän kaivos on Euroopan suurin kultakaivos — Lapin kulta ei siis ole pelkkää tarinaa.',
      hint: 'Samaa metallia huuhdotaan Lapin joista vaskoolilla.',
    },
  ],

  inari: [
    {
      q: 'Minkä kansan kulttuurikeskus Sajos sijaitsee Inarissa?',
      options: ['saamelaisten', 'karjalaisten', 'romanien', 'kveenien'],
      correct: 0,
      level: 1,
      fact: 'Sajoksessa kokoontuu Saamelaiskäräjät, joka päättää alkuperäiskansan kieltä ja kulttuuria koskevista asioista.',
      hint: 'Euroopan unionin alueen ainoa alkuperäiskansa.',
    },
    {
      q: 'Mikä museo esittelee saamelaiskulttuuria ja pohjoista luontoa Inarissa?',
      options: ['Siida', 'Arktikum', 'Kiasma', 'Luostarinmäki'],
      correct: 0,
      level: 3,
      fact: 'Museon nimi tarkoittaa saamelaista talvikylää. Ulkomuseoalue kertoo elämästä ennen teitä ja sähköjä.',
      hint: 'Nimi tarkoittaa lapinkylää.',
    },
    {
      q: 'Kuinka montaa saamen kieltä Suomessa puhutaan?',
      options: ['kolmea', 'yhtä', 'kahta', 'viittä'],
      correct: 0,
      level: 3,
      fact: 'Pohjoissaame, inarinsaame ja koltansaame. Inarinsaamea puhutaan vain Inarissa — puhujia on muutama sata.',
      hint: 'Yhtä niistä puhutaan vain Inarissa.',
    },
  ],

  kilpisjarvi: [
    {
      q: 'Mikä jyrkkärinteinen tunturi kohoaa Kilpisjärven kylän yllä?',
      options: ['Saana', 'Halti', 'Ylläs', 'Ounastunturi'],
      correct: 0,
      fact: 'Tunturi on saamelaisille pyhä paikka, ja sen laelta näkee kolmen valtakunnan rajamaille.',
      hint: 'Nimi on lyhyt ja naisennimen kuuloinen.',
    },
    {
      q: 'Minkä kolmen maan rajapyykki on Kilpisjärven lähellä?',
      options: [
        'Suomen, Ruotsin ja Norjan',
        'Suomen, Venäjän ja Norjan',
        'Suomen, Ruotsin ja Tanskan',
        'Suomen, Viron ja Ruotsin',
      ],
      correct: 0,
      level: 1,
      fact: 'Keltainen rajapyykki on pienessä järvessä, ja sen ympäri voi kävellä — kolmessa maassa minuutissa.',
      hint: 'Käsivarsi työntyy kahden länsinaapurin väliin.',
    },
  ],

  utsjoki: [
    {
      q: 'Mikä kuuluisa lohijoki erottaa Utsjoen Norjasta?',
      options: ['Teno', 'Tornionjoki', 'Ivalojoki', 'Kemijoki'],
      correct: 0,
      fact: 'Joki on Euroopan parhaita luonnonlohijokia, ja sen kalastusta säädellään Suomen ja Norjan sopimuksella.',
      hint: 'Saameksi joki on Deatnu, suuri joki.',
    },
    {
      q: 'Mikä tekee Utsjoesta ainutlaatuisen Suomen kuntien joukossa?',
      options: [
        'saamelaiset ovat siellä enemmistönä',
        'siellä ei ole lainkaan teitä',
        'se on Suomen suurin kunta',
        'siellä ei ole yhtään järveä',
      ],
      correct: 0,
      level: 3,
      fact: 'Utsjoki on Suomen ainoa kunta, jossa alkuperäiskansa on enemmistössä, ja Suomen pohjoisin kunta.',
      hint: 'Asia liittyy kunnan asukkaisiin.',
    },
    {
      q: 'Mitä kaamos tarkoittaa?',
      options: [
        'aurinko ei nouse lainkaan',
        'aurinko ei laske lainkaan',
        'järvet jäätyvät pohjaan asti',
        'lunta sataa joka päivä',
      ],
      correct: 0,
      level: 1,
      fact: 'Utsjoella kaamos kestää lähes kaksi kuukautta. Sen vastapainona kesällä on yhtä pitkä yötön yö.',
      hint: 'Kaamos koetaan talvella napapiirin pohjoispuolella.',
    },
  ],

  general: [
    {
      q: 'Mikä on Suomen pääkaupunki?',
      options: ['Helsinki', 'Turku', 'Tampere', 'Oulu'],
      correct: 0,
      level: 1,
      fact: 'Helsingistä tuli pääkaupunki 1812; sitä ennen pääkaupunki oli Turku.',
      hint: 'Suomenlinnan merilinnoitus on sen edustalla.',
    },
    {
      q: 'Mikä eläin on Suomen kansalliseläin?',
      options: ['karhu', 'susi', 'hirvi', 'ilves'],
      correct: 0,
      level: 1,
      fact: 'Metsän kuninkaalla on suomen kielessä sadoittain kiertonimiä, kuten kontio, otso ja mesikämmen.',
      hint: 'Se nukkuu talviunta pesässään.',
    },
    {
      q: 'Mikä lintu on Suomen kansallislintu?',
      options: ['laulujoutsen', 'talitiainen', 'varis', 'merikotka'],
      correct: 0,
      level: 1,
      fact: 'Lintu oli 1950-luvulla lähes hävitetty Suomesta; rauhoituksen jälkeen kanta on elpynyt kymmeniintuhansiin.',
      hint: 'Iso valkoinen lintu, joka esiintyy myös eurokolikossa.',
    },
    {
      q: 'Millä rahalla Suomessa maksetaan?',
      options: ['eurolla', 'markalla', 'kruunulla', 'punnalla'],
      correct: 0,
      level: 1,
      fact: 'Suomi vaihtoi markan euroon 2002 ensimmäisten maiden joukossa. Naapurit Ruotsi ja Norja käyttävät yhä kruunuja.',
      hint: 'Sama raha kuin useimmissa EU-maissa.',
    },
    {
      q: 'Mitkä ovat Suomen lipun värit?',
      options: [
        'sininen ja valkoinen',
        'punainen ja keltainen',
        'musta ja valkoinen',
        'vihreä ja valkoinen',
      ],
      correct: 0,
      level: 1,
      fact: 'Värien on sanottu kuvaavan järviä ja lunta. Siniristilippu otettiin käyttöön 1918.',
      hint: 'Värit kuvaavat järviä ja lunta.',
    },
    {
      q: 'Kuinka pitkä on Suomen ja Venäjän välinen raja?',
      options: ['noin 1 300 km', 'noin 300 km', 'noin 600 km', 'noin 2 500 km'],
      correct: 0,
      level: 3,
      fact: 'Raja on EU:n pisin ulkoraja Venäjän kanssa. Sen itäpuolella aika on tunnin edellä.',
      hint: 'Matka on suunnilleen sama kuin Helsingistä Utsjoelle.',
    },
    {
      q: 'Minä vuonna Suomi liittyi puolustusliitto Natoon?',
      options: ['2023', '2022', '1995', '2004'],
      correct: 0,
      level: 3,
      fact: 'Venäjän hyökkäys Ukrainaan 2022 käänsi mielipiteen nopeasti, ja jäsenyys varmistui huhtikuussa 2023.',
      hint: 'Vuosi hyökkäyssodan alkamisen jälkeen.',
    },
    {
      q: 'Minä vuonna Suomi liittyi Euroopan unioniin?',
      options: ['1995', '1985', '2000', '2004'],
      correct: 0,
      level: 3,
      fact: 'Suomi liittyi yhdessä Ruotsin ja Itävallan kanssa kansanäänestyksen jälkeen.',
      hint: 'Samana vuonna liittyivät myös Ruotsi ja Itävalta.',
    },
    {
      q: 'Kuinka monta saunaa Suomessa arvioidaan olevan?',
      options: ['yli 3 miljoonaa', 'noin 100 000', 'noin puoli miljoonaa', 'noin 10 miljoonaa'],
      correct: 0,
      level: 3,
      fact: 'Saunoja on enemmän kuin henkilöautoja — noin yksi jokaista kahta asukasta kohden.',
      hint: 'Niitä on enemmän kuin henkilöautoja.',
    },
    {
      q: 'Mikä suomalaisyhtiö oli 2000-luvun alussa maailman suurin matkapuhelinvalmistaja?',
      options: ['Nokia', 'Ericsson', 'Motorola', 'Salora'],
      correct: 0,
      fact: 'Parhaimmillaan yhtiö myi joka kolmannen maailman puhelimista ja toi neljänneksen Suomen viennistä.',
      hint: 'Yhtiö on saanut nimensä pirkanmaalaisesta kaupungista.',
    },
    {
      q: 'Kuka sävelsi Finlandian?',
      options: ['Jean Sibelius', 'Oskar Merikanto', 'Toivo Kuula', 'Kaija Saariaho'],
      correct: 0,
      fact: 'Sävelruno kantaesitettiin 1899 sortovuosien aikaan, ja siitä tuli itsenäisyystahdon vertauskuva.',
      hint: 'Hänen päivänään 8. joulukuuta liputetaan suomalaiselle musiikille.',
    },
    {
      q: 'Mitä jokamiehenoikeudet tarkoittavat?',
      options: [
        'luonnossa saa liikkua, marjastaa ja sienestää myös toisen mailla',
        'jokainen mies on kutsuttava armeijaan',
        'kuka tahansa saa metsästää missä vain',
        'rannat ovat aina yksityisiä',
      ],
      correct: 0,
      level: 1,
      fact: 'Oikeuksiin kuuluu myös tilapäinen leiriytyminen — kunhan ei häiritse eikä roskaa.',
      hint: 'Ne koskevat kaikkia luonnossa liikkujia, eivät vain miehiä.',
    },
  ],
};

export const SUOMI_FACTS = {
  helsinki: [
    'Suomenlinnaan pääsee Kauppatorilta lautalla vartissa — merilinnoitus on Unescon maailmanperintökohde, jossa asuu 800 ihmistä.',
    'Helsingin alla on kymmeniä kilometrejä tunneleita ja jopa maanalainen uimahalli — kallioon louhittu kaupunki toimii myös väestönsuojana.',
  ],
  turku: [
    'Joulurauha on julistettu Turun Brinkkalan talon parvekkeelta jo 1300-luvulta asti — julistusta kuuntelee joka jouluaatto koko Suomi.',
    'Turun saaristossa on yli 20 000 saarta ja luotoa, ja Saariston rengastien voi kiertää polkupyörällä lauttoja hyppien.',
  ],
  maarianhamina: [
    'Maarianhaminan satamassa seisoo Pommern, maailman ainoa alkuperäisessä asussaan säilynyt nelimastoinen viljapurjelaiva.',
    'Ahvenanmaalla on omat postimerkit ja oma rekisterikilpi, vaikka saaret kuuluvat Suomeen.',
  ],
  tampere: [
    'Tampereella on maailman ainoa muumilaakson taidetta esittelevä Muumimuseo.',
    'Tammerkosken partaalla sijaitseva Finlaysonin alue oli 1800-luvulla kuin kaupunki kaupungissa: sillä oli oma kirkko, poliisi ja sairaala.',
  ],
  pori: [
    'Yyterin dyynit ovat kilometrien pituiset — ranta on yksi Pohjoismaiden pisimmistä hiekkarannoista.',
    'Porin jazzfestivaali on tuonut kaupunkiin esiintyjiä Miles Davisista Stingiin jo yli puolen vuosisadan ajan.',
  ],
  vaasa: [
    'Merenkurkussa syntyy maankohoamisen ansiosta joka vuosi noin sata hehtaaria uutta maata — saaret kasvavat yhteen silmissä.',
    'Vaasan seudulla on Pohjoismaiden suurin energiateknologian keskittymä, jonka laitteita viedään ympäri maailmaa.',
  ],
  jyvaskyla: [
    'Jyväskylässä on enemmän Alvar Aallon suunnittelemia rakennuksia kuin missään muualla maailmassa.',
    'Kaupunkia kutsutaan Suomen Ateenaksi, koska suomenkielinen koulutus sai siellä alkunsa 1800-luvulla.',
  ],
  lappeenranta: [
    'Lappeenrannan linnoituksen valleilta näkee Saimaalle — kaupunki oli vuosisatoja Ruotsin ja Venäjän rajaseutua.',
    'Saimaan kanavaa pitkin pääsi ennen laivalla Lappeenrannasta Viipuriin ja merelle asti; kanava valmistui 1856.',
  ],
  savonlinna: [
    'Olavinlinnan oopperajuhlien katsomoon mahtuu yli 2 000 kuulijaa — esitykset pidetään keskiaikaisen linnan pihassa.',
    'Saimaannorppa on yksi maailman harvinaisimmista hylkeistä: sitä suojellaan muun muassa verkkokalastuskielloin.',
  ],
  kuopio: [
    'Kuopion torilla myydään kalakukkoa suoraan leipurien kojuista, ja savolainen puheenparsi kuuluu kaupassa kaupan päälle.',
    'Puijon tornista avautuu näkymä Kallaveden satoihin saariin; ensimmäinen torni rakennettiin jo 1856.',
  ],
  joensuu: [
    'Joensuussa toimii Euroopan metsäinstituutti — kaupunki on yksi maailman johtavista metsäosaamisen keskuksista.',
    'Ilosaarirock on järjestetty vuodesta 1971 ja on yksi Euroopan vanhimmista yhä jatkuvista rockfestivaaleista.',
  ],
  kajaani: [
    'Kajaanin linnan rauniot seisovat Kajaaninjoen saarella; linnassa istui aikoinaan vankina myös historioitsija Johannes Messenius.',
    'Kainuun tervaa soudettiin 1800-luvulla veneillä Ouluun asti — terva oli aikansa öljy, jota vietiin maailman laivastoille.',
  ],
  kemi: [
    'Kemin lumilinna rakennetaan joka talvi uudelleen merivedestä tykitetystä lumesta — arkkitehtuuri vaihtuu vuosittain.',
    'Jäänmurtaja Sampolla pääsee kävelemään jäälle keskellä merta ja kellumaan pelastuspuvussa avannossa.',
  ],
  rovaniemi: [
    'Napapiirin pajakylässä voi ylittää napapiirin viivan jalan — ja saada siitä todistuksen.',
    'Arktikum-museon lasiputki osoittaa suoraan pohjoiseen; museo kertoo arktisten alueiden elämästä ja ilmastonmuutoksesta.',
  ],
  kittila: [
    'Levillä ajetaan alppihiihdon maailmancupia, ja tunturin huipulle pääsee gondolihissillä ympäri vuoden.',
    'Kittilän kultakaivos on Euroopan suurin — kultaa louhitaan yli kilometrin syvyydestä.',
  ],
  inari: [
    'Inarijärvessä on yli 3 000 saarta; Ukonkivi oli saamelaisten pyhä uhripaikka.',
    'Saamelaiskäräjät kokoontuu Inarin Sajoksessa — rakennuksen muoto kiertyy kuin nuotiopiiri.',
  ],
  kilpisjarvi: [
    'Suomen korkein tunturi Halti (1 324 m) on Kilpisjärveltä vaellusmatkan päässä Käsivarren erämaassa.',
    'Mallan luonnonpuisto on Suomen vanhimpia suojelualueita — siellä kasvaa tunturikasveja, joita ei tapaa muualla maassa.',
  ],
  utsjoki: [
    'Utsjoella aurinko ei laske lainkaan noin 70 vuorokauteen kesällä — yöttömän yön aikaan voi lukea ulkona keskiyöllä.',
    'Tenojoki on Euroopan parhaita luonnonlohijokia, ja sen rannoilla saamelainen kalastusperinne elää yhä.',
  ],
  oulu: [
    'Oulussa järjestetään joka elokuu ilmakitaransoiton MM-kisat — laji keksittiin kaupungissa vitsinä, josta tuli maailmanilmiö.',
    'Oulu oli 1800-luvulla maailman johtavia tervanviejiä; terva laskettiin jokea pitkin veneillä kaupungin satamaan.',
  ],
};
