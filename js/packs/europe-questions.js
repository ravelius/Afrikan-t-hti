// Eurooppa-laudan tietovisakysymykset ja Tiesitkö että -tiedot.
//
// Jokaisella laattakaupungilla on omat kysymyksensä, jotka liittyvät paikan
// maantietoon, kulttuuriin, arkeen tai historiaan. `general` on varapakka,
// josta arvotaan, kun kaupungin omat kysymykset on jo käytetty.
//
// Muoto: { q, options: [4], correct, fact, hint, level }
// Vaihtoehdot sekoitetaan vasta kysyttäessä, joten oikea vastaus voi olla
// tässä missä tahansa kohdassa.

export const EUROPE_QUESTIONS = {
  dublin: [
    {
      q: 'Minkä maan pääkaupunki Dublin on?',
      options: ['Irlanti', 'Skotlanti', 'Wales', 'Islanti'],
      correct: 0,
      level: 1,
      fact: 'Dublin on Irlannin pääkaupunki ja saaren suurin kaupunki.',
      hint: 'Maata kutsutaan smaragdisaareksi.',
      source: 'https://fi.wikipedia.org/wiki/Dublin',
    },
    {
      q: 'Mikä on Irlannin ensimmäinen virallinen kieli?',
      options: ['iiri', 'englanti', 'kymri', 'bretoni'],
      correct: 0,
      fact: 'Iiri on Irlannin kansalliskieli ja ensimmäinen virallinen kieli, englanti toinen. Iiriä puhutaan päivittäin etenkin länsirannikon gaeltacht-alueilla.',
      hint: 'Kielen nimi on sama kuin maan nimi lyhennettynä.',
      source: 'https://fi.wikipedia.org/wiki/Irlanti',
    },
    {
      q: 'Mikä joki virtaa Dublinin halki?',
      options: ['Liffey', 'Thames', 'Seine', 'Shannon'],
      correct: 0,
      level: 3,
      fact: 'Liffey laskee Dublinin kohdalla Irlanninmereen. Shannon on Irlannin pisin joki, mutta se virtaa lännempänä.',
      hint: 'Joen nimi alkaa L-kirjaimella.',
      source: 'https://fi.wikipedia.org/wiki/Dublin',
    },
  ],

  edinburgh: [
    {
      q: 'Minkä maan pääkaupunki Edinburgh on?',
      options: ['Skotlanti', 'Irlanti', 'Wales', 'Norja'],
      correct: 0,
      level: 1,
      fact: 'Edinburgh on Skotlannin pääkaupunki. Skotlannilla on oma parlamenttinsa osana Yhdistynyttä kuningaskuntaa.',
      hint: 'Maa tunnetaan säkkipilleistä ja ylängöistä.',
    },
    {
      q: 'Minkä päällä Edinburghin linna seisoo?',
      options: ['sammuneen tulivuoren', 'hiekkasärkän', 'saaren', 'sillan'],
      correct: 0,
      fact: 'Castle Rock on tulivuoren jäänne, jonka jäätikkö hioi jyrkäksi kallioksi.',
      hint: 'Kallio syntyi kauan sitten sulasta kivestä.',
      source: 'https://en.wikipedia.org/wiki/Edinburgh_Castle',
    },
    {
      q: 'Mikä Edinburghissa elokuussa järjestettävä tapahtuma on maailman suurin esittävän taiteen festivaali?',
      options: ['Fringe', 'Glastonbury', 'Roskilde', 'Salzburgin juhlaviikot'],
      correct: 0,
      level: 3,
      fact: 'Edinburgh Festival Fringe kokoaa elokuussa tuhansia esityksiä eri puolilta maailmaa.',
      hint: 'Nimi tarkoittaa englanniksi reunaa.',
      source: 'https://en.wikipedia.org/wiki/Edinburgh_Festival_Fringe',
    },
  ],

  pariisi: [
    {
      q: 'Mikä joki virtaa Pariisin halki?',
      options: ['Seine', 'Rhône', 'Loire', 'Rein'],
      correct: 0,
      level: 1,
      fact: 'Seine halkoo Pariisin ja kiertää keskellä olevan Cité-saaren.',
      hint: 'Joen nimi alkaa S-kirjaimella.',
      source: 'https://fi.wikipedia.org/wiki/Pariisi',
    },
    {
      q: 'Mitä varten Eiffel-torni alun perin rakennettiin?',
      options: ['maailmannäyttelyyn', 'majakaksi', 'kirkoksi', 'vankilaksi'],
      correct: 0,
      fact: 'Torni valmistui vuoden 1889 maailmannäyttelyyn ja oli aikanaan maailman korkein rakennus.',
      hint: 'Tapahtuma esitteli maailmalle tekniikan uutuuksia.',
      source: 'https://fi.wikipedia.org/wiki/Eiffel-torni',
    },
    {
      q: 'Mikä on Ranskan kansallispäivä?',
      options: ['14. heinäkuuta', '4. heinäkuuta', '1. toukokuuta', '11. marraskuuta'],
      correct: 0,
      fact: 'Päivä muistuttaa Bastiljin valtauksesta vuonna 1789, Ranskan suuren vallankumouksen alusta.',
      hint: 'Päivä on keskellä kesää.',
      source: 'https://fi.wikipedia.org/wiki/Bastiljin_valtaus',
    },
  ],

  bordeaux: [
    {
      q: 'Mistä tuotteesta Bordeaux’n seutu on maailmankuulu?',
      options: ['viinistä', 'juustosta', 'suklaasta', 'teestä'],
      correct: 0,
      level: 1,
      fact: 'Bordeaux’n ympärillä on tuhansia viinitiloja, ja alue on yksi maailman tunnetuimmista viinialueista.',
      hint: 'Tuote tehdään rypäleistä.',
      source: 'https://fi.wikipedia.org/wiki/Bordeaux',
    },
    {
      q: 'Minkä valtameren rannikolla Bordeaux sijaitsee?',
      options: ['Atlantin', 'Tyynenmeren', 'Intian valtameren', 'Jäämeren'],
      correct: 0,
      fact: 'Bordeaux on Garonne-joen varrella lähellä rannikkoa, Biskajanlahden pohjukassa.',
      hint: 'Sama valtameri huuhtoo Amerikan itärannikkoa.',
    },
    {
      q: 'Mikä Euroopan korkein hiekkadyyni sijaitsee Bordeaux’n lähellä?',
      options: ['Pilat', 'Sylt', 'Słowiński', 'Maspalomas'],
      correct: 0,
      level: 3,
      fact: 'Dune du Pilat kohoaa yli sadan metrin korkeuteen Atlantin rannalla ja siirtyy tuulen mukana hiukan joka vuosi.',
      hint: 'Dyynin nimi alkaa samalla kirjaimella kuin Pariisi.',
      source: 'https://en.wikipedia.org/wiki/Dune_of_Pilat',
    },
  ],

  lissabon: [
    {
      q: 'Minkä maan pääkaupunki Lissabon on?',
      options: ['Portugali', 'Espanja', 'Italia', 'Kreikka'],
      correct: 0,
      level: 1,
      fact: 'Lissabon on Portugalin pääkaupunki ja Tejo-joen suulla sijaitseva satama.',
      hint: 'Maan kieltä puhutaan myös Brasiliassa.',
    },
    {
      q: 'Mikä luonnonmullistus tuhosi Lissabonin vuonna 1755?',
      options: ['maanjäristys', 'tulivuorenpurkaus', 'lumivyöry', 'metsäpalo'],
      correct: 0,
      fact: 'Järistys ja sen aiheuttama hyökyaalto tuhosivat suuren osan kaupungista. Keskusta rakennettiin sen jälkeen uudelleen suoraan ruutukaavaan.',
      hint: 'Maa tärisi ja meri nousi perässä.',
      source: 'https://fi.wikipedia.org/wiki/Lissabon',
    },
    {
      q: 'Mitä portugalilaista laulutyyliä Lissabonissa kuullaan?',
      options: ['fado', 'flamenco', 'tango', 'polkka'],
      correct: 0,
      level: 3,
      fact: 'Fado on haikea laulutyyli, joka on Unescon aineettoman kulttuuriperinnön luettelossa.',
      hint: 'Nimi tarkoittaa portugaliksi kohtaloa.',
      source: 'https://fi.wikipedia.org/wiki/Fado',
    },
  ],

  madrid: [
    {
      q: 'Minkä maan pääkaupunki Madrid on?',
      options: ['Espanja', 'Portugali', 'Meksiko', 'Argentiina'],
      correct: 0,
      level: 1,
      fact: 'Madrid on Espanjan pääkaupunki ja sijaitsee keskellä Iberian niemimaata.',
      hint: 'Maa jakaa niemimaan Portugalin kanssa.',
    },
    {
      q: 'Mikä on Madridin kuuluisin taidemuseo?',
      options: ['Prado', 'Louvre', 'Uffizi', 'Ermitaasi'],
      correct: 0,
      fact: 'Pradossa on laaja kokoelma espanjalaista maalaustaidetta, muun muassa Velázquezia ja Goyaa.',
      hint: 'Museon nimi tarkoittaa espanjaksi niittyä.',
      source: 'https://fi.wikipedia.org/wiki/Madrid',
    },
    {
      q: 'Mikä tekee Madridista erityisen Euroopan suurten pääkaupunkien joukossa?',
      options: [
        'se sijaitsee korkeimmalla',
        'se on ainoa saarella sijaitseva',
        'se on pohjoisin',
        'se on ainoa ilman jokea',
      ],
      correct: 0,
      level: 3,
      fact: 'Madrid on 655 metrin korkeudessa ylätasangolla. Euroopan pääkaupungeista vain pikkuruinen Andorra la Vella on korkeammalla.',
      hint: 'Vastaus liittyy siihen, kuinka ylhäällä kaupunki on.',
      source: 'https://fi.wikipedia.org/wiki/Madrid',
    },
  ],

  barcelona: [
    {
      q: 'Kuka suunnitteli Barcelonan Sagrada Famílian?',
      options: ['Antoni Gaudí', 'Le Corbusier', 'Alvar Aalto', 'Gustave Eiffel'],
      correct: 0,
      fact: 'Gaudí työskenteli kirkon parissa yli 40 vuotta, ja rakennustyöt jatkuvat yhä.',
      hint: 'Arkkitehti oli katalaani, ja hänen tyylissään on paljon kaarevia muotoja.',
    },
    {
      q: 'Mitä kieltä espanjan ohella puhutaan Barcelonassa?',
      options: ['katalaania', 'baskia', 'galiciaa', 'oksitaania'],
      correct: 0,
      fact: 'Katalaani on Katalonian oma virallinen kieli, jota käytetään kouluissa ja tiedotusvälineissä.',
      hint: 'Kieli on nimetty maakunnan mukaan.',
    },
    {
      q: 'Minkä meren rannalla Barcelona sijaitsee?',
      options: ['Välimeren', 'Mustanmeren', 'Pohjanmeren', 'Itämeren'],
      correct: 0,
      level: 1,
      fact: 'Barcelona on yksi Välimeren vilkkaimmista satamakaupungeista.',
      hint: 'Sama meri huuhtoo Italian ja Kreikan rantoja.',
    },
  ],

  amsterdam: [
    {
      q: 'Mistä Amsterdam on erityisen kuuluisa?',
      options: ['kanavistaan', 'vuoristaan', 'aavikostaan', 'geysireistään'],
      correct: 0,
      level: 1,
      fact: 'Amsterdamin kanaaliverkosto rakennettiin 1600-luvulla, ja se on Unescon maailmanperintökohde.',
      hint: 'Kaupungissa liikutaan myös veneellä.',
    },
    {
      q: 'Miksi Alankomaissa on padottu merta?',
      options: [
        'osa maasta on merenpinnan alapuolella',
        'kalastuksen takia',
        'rajan merkiksi',
        'urheilua varten',
      ],
      correct: 0,
      fact: 'Noin neljännes Alankomaista on merenpinnan alapuolella, ja maata on kuivattu padoilla ja pumpuilla vuosisatoja.',
      hint: 'Ilman patoja osa maasta jäisi veden alle.',
    },
    {
      q: 'Kenen päiväkirja kirjoitettiin piilopaikassa Amsterdamissa?',
      options: ['Anne Frankin', 'Astrid Lindgrenin', 'Vincent van Goghin', 'Erasmus Rotterdamilaisen'],
      correct: 0,
      fact: 'Anne Frank kirjoitti päiväkirjaansa perheen piilopaikassa toisen maailmansodan aikana. Talo on nykyään museo.',
      hint: 'Päiväkirjan kirjoitti nuori tyttö.',
      source: 'https://fi.wikipedia.org/wiki/Anne_Frank',
    },
  ],

  berliini: [
    {
      q: 'Minkä maan pääkaupunki Berliini on?',
      options: ['Saksa', 'Itävalta', 'Sveitsi', 'Puola'],
      correct: 0,
      level: 1,
      fact: 'Berliini on Saksan pääkaupunki ja maan suurin kaupunki.',
      hint: 'Maan kieltä puhutaan myös Itävallassa.',
    },
    {
      q: 'Mikä jakoi Berliinin kahtia vuosina 1961–1989?',
      options: ['muuri', 'joki', 'rautatie', 'kanava'],
      correct: 0,
      fact: 'Berliinin muuri erotti kaupungin itä- ja länsiosat 28 vuodeksi. Se avattiin marraskuussa 1989.',
      hint: 'Rakennelma oli betonia ja piikkilankaa.',
      source: 'https://fi.wikipedia.org/wiki/Berliinin_muuri',
    },
    {
      q: 'Mikä on Berliinin tunnetuin portti?',
      options: ['Brandenburgin portti', 'Riemukaari', 'Ištarin portti', 'Kultainen portti'],
      correct: 0,
      fact: 'Brandenburgin portti valmistui 1791 ja on Saksan yhdistymisen tunnetuin symboli.',
      hint: 'Portti on nimetty ympäröivän maakunnan mukaan.',
      source: 'https://fi.wikipedia.org/wiki/Brandenburgin_portti',
    },
  ],

  praha: [
    {
      q: 'Minkä maan pääkaupunki Praha on?',
      options: ['Tšekki', 'Slovakia', 'Unkari', 'Puola'],
      correct: 0,
      level: 1,
      fact: 'Praha on Tšekin pääkaupunki Vltava-joen varrella.',
      hint: 'Maa erosi rauhanomaisesti Slovakiasta vuonna 1993.',
    },
    {
      q: 'Mikä on Prahan kuuluisin silta?',
      options: ['Kaarlensilta', 'Rialto', 'Ponte Vecchio', 'Tower Bridge'],
      correct: 0,
      fact: 'Sillan rakentaminen alkoi 1357 ja se valmistui vasta 1402. Kaiteita reunustaa kolmisenkymmentä patsasta.',
      hint: 'Silta on nimetty kuninkaan mukaan.',
      source: 'https://en.wikipedia.org/wiki/Charles_Bridge',
    },
    {
      q: 'Mitä Prahan raatihuoneen kuuluisa kello näyttää tavallisen kellonajan lisäksi?',
      options: ['tähtitieteellisiä tietoja', 'säätilan', 'junien lähtöajat', 'vuoroveden'],
      correct: 0,
      level: 3,
      fact: 'Orlojin vanhin osa, kellokoneisto ja tähtitieteellinen taulu, on vuodelta 1410.',
      hint: 'Kello kertoo taivaankappaleista.',
      source: 'https://en.wikipedia.org/wiki/Prague_astronomical_clock',
    },
  ],

  wien: [
    {
      q: 'Mistä musiikin lajista Wien on erityisen kuuluisa?',
      options: ['klassisesta musiikista', 'reggaesta', 'flamencosta', 'bluesista'],
      correct: 0,
      fact: 'Wienissä työskentelivät muun muassa Mozart, Haydn, Beethoven ja Schubert.',
      hint: 'Musiikkia soitetaan sinfoniaorkesterilla.',
    },
    {
      q: 'Mikä joki virtaa Wienin ohi?',
      options: ['Tonava', 'Rein', 'Elbe', 'Po'],
      correct: 0,
      level: 1,
      fact: 'Tonava on Euroopan toiseksi pisin joki ja virtaa kymmenen maan halki.',
      hint: 'Joesta on tehty kuuluisa valssi.',
      source: 'https://fi.wikipedia.org/wiki/Tonava',
    },
    {
      q: 'Minkä maan pääkaupunki Wien on?',
      options: ['Itävalta', 'Saksa', 'Sveitsi', 'Tšekki'],
      correct: 0,
      level: 1,
      fact: 'Wien on Itävallan pääkaupunki ja maan suurin kaupunki.',
      hint: 'Maassa puhutaan saksaa ja sen eteläosassa kohoavat Alpit.',
    },
  ],

  budapest: [
    {
      q: 'Mistä kahdesta kaupungista Budapest sai nimensä?',
      options: ['Budasta ja Pestistä', 'Böömistä ja Määristä', 'Idasta ja Lännestä', 'Pannoniasta ja Daciasta'],
      correct: 0,
      fact: 'Buda ja Pest yhdistettiin Óbudan kanssa yhdeksi kaupungiksi vuonna 1873. Tonava virtaa niiden välissä.',
      hint: 'Vastaus löytyy kaupungin nimestä.',
    },
    {
      q: 'Mistä Budapest on kuuluisa jo roomalaisajoilta asti?',
      options: ['kuumista lähteistä', 'kultakaivoksista', 'satamastaan', 'tulivuoristaan'],
      correct: 0,
      fact: 'Budapestissa on kymmeniä kylpylöitä, jotka käyttävät maan alta nousevaa lämmintä vettä.',
      hint: 'Vesi nousee maan alta lämpimänä.',
    },
    {
      q: 'Mihin kieliryhmään unkari kuuluu?',
      options: ['suomalais-ugrilaisiin', 'slaavilaisiin', 'romaanisiin', 'germaanisiin'],
      correct: 0,
      level: 3,
      fact: 'Unkari on suomen ja viron kaukainen sukukieli, vaikka sanastot ovat ehtineet erkaantua kauas toisistaan.',
      hint: 'Kieli on suomen kaukainen sukulainen.',
      source: 'https://en.wikipedia.org/wiki/Hungarian_language',
    },
  ],

  varsova: [
    {
      q: 'Minkä maan pääkaupunki Varsova on?',
      options: ['Puola', 'Liettua', 'Valko-Venäjä', 'Ukraina'],
      correct: 0,
      level: 1,
      fact: 'Varsova on Puolan pääkaupunki ja suurin kaupunki Veiksel-joen varrella.',
      hint: 'Maan lipussa on valkoinen ja punainen vaakaraita.',
    },
    {
      q: 'Mitä Varsovan vanhallekaupungille tehtiin toisen maailmansodan jälkeen?',
      options: [
        'se rakennettiin uudelleen vanhojen kuvien mukaan',
        'se jätettiin raunioiksi',
        'se siirrettiin toiseen paikkaan',
        'se muutettiin puistoksi',
      ],
      correct: 0,
      fact: 'Sodassa tuhoutunut vanhakaupunki rakennettiin uudelleen maalausten ja valokuvien avulla. Se on Unescon maailmanperintökohde.',
      hint: 'Kaupunki palautettiin ennalleen vanhojen kuvien avulla.',
      source: 'https://fi.wikipedia.org/wiki/Varsova',
    },
    {
      q: 'Kuka Varsovan seudulla varttunut säveltäjä tunnetaan pianomusiikistaan?',
      options: ['Fryderyk Chopin', 'Johann Strauss', 'Jean Sibelius', 'Edvard Grieg'],
      correct: 0,
      fact: 'Chopin vietti nuoruutensa Varsovassa ja sävelsi lähes kaiken musiikkinsa pianolle.',
      hint: 'Säveltäjän mukaan on nimetty Varsovan lentoasema.',
      source: 'https://fi.wikipedia.org/wiki/Fryderyk_Chopin',
    },
  ],

  alpit: [
    {
      q: 'Mikä on Alppien korkein huippu?',
      options: ['Mont Blanc', 'Matterhorn', 'Jungfrau', 'Eiger'],
      correct: 0,
      fact: 'Mont Blanc kohoaa noin 4 800 metriin Ranskan ja Italian rajalla.',
      hint: 'Nimi tarkoittaa ranskaksi valkoista vuorta.',
      source: 'https://fi.wikipedia.org/wiki/Mont_Blanc',
    },
    {
      q: 'Mikä muovasi Alppien laaksot U-kirjaimen muotoisiksi?',
      options: ['jäätiköt', 'tuuli', 'maanjäristykset', 'meri'],
      correct: 0,
      fact: 'Jääkauden jäätiköt hioivat laaksot leveiksi ja pyöreäpohjaisiksi. Jokien uurtamat laaksot ovat V:n muotoisia.',
      hint: 'Muovaaja oli hidasta ja kylmää.',
    },
    {
      q: 'Miksi korkealla vuorilla on kylmempää kuin laaksossa?',
      options: [
        'ilma harvenee ja viilenee ylöspäin',
        'aurinko paistaa siellä heikommin',
        'vuoret ovat kauempana päiväntasaajasta',
        'lumi jäähdyttää ilman',
      ],
      correct: 0,
      level: 3,
      fact: 'Lämpötila laskee noin puoli astetta jokaista sataa metriä kohti, koska ilmanpaine pienenee korkeutta kohti.',
      hint: 'Syy liittyy ilmanpaineeseen.',
    },
  ],

  milano: [
    {
      q: 'Mistä Milano tunnetaan maailmalla?',
      options: ['muodista', 'öljystä', 'kalastuksesta', 'timanteista'],
      correct: 0,
      fact: 'Milano on yksi maailman muotikaupungeista, ja sen muotiviikot ovat alan tärkeimpiä tapahtumia.',
      hint: 'Ala liittyy vaatteisiin.',
    },
    {
      q: 'Kuka maalasi Milanossa sijaitsevan Viimeinen ehtoollinen -teoksen?',
      options: ['Leonardo da Vinci', 'Michelangelo', 'Rafael', 'Caravaggio'],
      correct: 0,
      fact: 'Leonardo maalasi teoksen luostarin ruokasalin seinään 1490-luvulla.',
      hint: 'Sama taiteilija maalasi Mona Lisan.',
    },
    {
      q: 'Millä alueella Milano sijaitsee?',
      options: ['Po-joen tasangolla', 'Sisilian rannikolla', 'Alppien huipulla', 'Sardiniassa'],
      correct: 0,
      level: 3,
      fact: 'Po-joen tasanko on Italian tärkein maatalous- ja teollisuusalue.',
      hint: 'Alue on nimetty Italian pisimmän joen mukaan.',
    },
  ],

  rooma: [
    {
      q: 'Mikä pieni valtio sijaitsee Rooman sisällä?',
      options: ['Vatikaani', 'Monaco', 'San Marino', 'Andorra'],
      correct: 0,
      level: 1,
      fact: 'Vatikaanivaltio on pinta-alaltaan maailman pienin itsenäinen valtio.',
      hint: 'Valtiota johtaa paavi.',
      source: 'https://fi.wikipedia.org/wiki/Vatikaanivaltio',
    },
    {
      q: 'Mihin Colosseumia käytettiin antiikin aikana?',
      options: ['näytöksiin ja kilpailuihin', 'kirkkona', 'viljavarastona', 'satamana'],
      correct: 0,
      fact: 'Colosseum valmistui vuonna 80 jaa., ja siihen mahtui kymmeniätuhansia katsojia.',
      hint: 'Yleisö tuli katsomaan esityksiä.',
      source: 'https://fi.wikipedia.org/wiki/Colosseum',
    },
    {
      q: 'Mikä oli Rooman valtakunnan hallintokieli?',
      options: ['latina', 'kreikka', 'italia', 'etruski'],
      correct: 0,
      fact: 'Latinasta kehittyivät myöhemmin muun muassa italia, ranska, espanja, portugali ja romania.',
      hint: 'Kieltä käytetään yhä kasvien ja eläinten tieteellisissä nimissä.',
    },
  ],

  sisilia: [
    {
      q: 'Mikä Euroopan suurin toimiva tulivuori sijaitsee Sisiliassa?',
      options: ['Etna', 'Vesuvius', 'Stromboli', 'Hekla'],
      correct: 0,
      fact: 'Etna on Euroopan suurin toimiva tulivuori ja yksi maailman aktiivisimmista. Se kohoaa yli 3 300 metriin.',
      hint: 'Nimi on lyhyt ja alkaa E-kirjaimella.',
      source: 'https://fi.wikipedia.org/wiki/Etna',
    },
    {
      q: 'Minkä maan osa Sisilia on?',
      options: ['Italia', 'Kreikka', 'Malta', 'Espanja'],
      correct: 0,
      level: 1,
      fact: 'Sisilia on Italian suurin saari ja yksi maan itsehallintoalueista.',
      hint: 'Maa on saappaan muotoinen.',
      source: 'https://fi.wikipedia.org/wiki/Sisilia',
    },
    {
      q: 'Mitä Sisiliassa kasvatetaan runsaasti?',
      options: ['sitrushedelmiä', 'kahvia', 'teetä', 'kaakaota'],
      correct: 0,
      fact: 'Sitruunat ja appelsiinit ovat Sisilian vanha vientituote; arabit toivat sitrusviljelyn saarelle keskiajalla.',
      hint: 'Hedelmät ovat happamia ja keltaisia tai oransseja.',
    },
  ],

  ateena: [
    {
      q: 'Mikä temppeli kohoaa Ateenan Akropoliilla?',
      options: ['Parthenon', 'Pantheon', 'Colosseum', 'Hagia Sofia'],
      correct: 0,
      fact: 'Parthenon rakennettiin 400-luvulla eaa. jumalatar Athenen temppeliksi.',
      hint: 'Nimi muistuttaa Rooman kuuluisaa rakennusta, mutta kirjaimet menevät toisin.',
    },
    {
      q: 'Mikä hallintomuoto sai alkunsa antiikin Ateenasta?',
      options: ['demokratia', 'kuningaskunta', 'keisarikunta', 'kalifaatti'],
      correct: 0,
      fact: 'Sana tulee kreikan sanoista kansa ja valta. Ateenan kansankokouksessa äänioikeus oli aikanaan vain osalla asukkaista.',
      hint: 'Sana tarkoittaa kreikaksi kansanvaltaa.',
    },
    {
      q: 'Missä järjestettiin nykyajan ensimmäiset olympialaiset vuonna 1896?',
      options: ['Ateenassa', 'Pariisissa', 'Lontoossa', 'Roomassa'],
      correct: 0,
      level: 3,
      fact: 'Kisat pidettiin antiikin perinteen kunniaksi Kreikassa. Antiikin kisat oli aikanaan pidetty Olympiassa.',
      hint: 'Paikka valittiin antiikin perinteen kunniaksi.',
    },
  ],

  kreeta: [
    {
      q: 'Mikä Euroopan varhaisin korkeakulttuuri kukoisti Kreetalla?',
      options: ['minolainen', 'egyptiläinen', 'etruskien', 'kelttiläinen'],
      correct: 0,
      level: 3,
      fact: 'Minolainen kulttuuri kukoisti Kreetalla noin 2000–1450 eaa. ja rakensi Knossoksen palatsin.',
      hint: 'Kulttuuri on nimetty taruvaltias Minoksen mukaan.',
    },
    {
      q: 'Minkä maan suurin saari Kreeta on?',
      options: ['Kreikan', 'Italian', 'Turkin', 'Kyproksen'],
      correct: 0,
      level: 1,
      fact: 'Kreeta on Kreikan suurin saari ja Välimeren viidenneksi suurin.',
      hint: 'Maan pääkaupunki on Ateena.',
      source: 'https://fi.wikipedia.org/wiki/Kreeta',
    },
    {
      q: 'Mikä on kreetalaisen ruokavalion perusta?',
      options: ['oliiviöljy', 'voi', 'kookosöljy', 'palmuöljy'],
      correct: 0,
      fact: 'Kreetalainen ruokavalio perustuu oliiviöljyyn, vihanneksiin, kalaan ja viljaan. Se on välimerellisen ruokavalion tunnetuin esimerkki.',
      hint: 'Tuote puristetaan puun hedelmistä.',
    },
  ],

  dubrovnik: [
    {
      q: 'Minkä maan rannikolla Dubrovnik sijaitsee?',
      options: ['Kroatia', 'Kreikka', 'Albania', 'Slovenia'],
      correct: 0,
      fact: 'Dubrovnik on Kroatian eteläisin suuri kaupunki Adrianmeren rannalla.',
      hint: 'Maan lipussa on punavalkoinen ruudukko.',
    },
    {
      q: 'Mikä ympäröi Dubrovnikin vanhaakaupunkia?',
      options: ['kivimuuri', 'kanava', 'metsä', 'rautatie'],
      correct: 0,
      level: 1,
      fact: 'Lähes kahden kilometrin pituinen muuri on säilynyt melkein kokonaan, ja sen päällä voi kävellä.',
      hint: 'Rakennelma suojasi kaupunkia hyökkäyksiltä.',
    },
    {
      q: 'Millä nimellä Dubrovnik tunnettiin itsenäisenä merivaltana?',
      options: ['Ragusa', 'Venetsia', 'Genova', 'Trieste'],
      correct: 0,
      level: 3,
      fact: 'Ragusan tasavalta oli vuosisatoja itsenäinen kauppavaltio, joka kilpaili Venetsian kanssa.',
      hint: 'Nimi alkaa R-kirjaimella.',
    },
  ],

  sofia: [
    {
      q: 'Minkä maan pääkaupunki Sofia on?',
      options: ['Bulgaria', 'Romania', 'Serbia', 'Kreikka'],
      correct: 0,
      fact: 'Sofia on Bulgarian pääkaupunki ja sijaitsee Vitoša-vuoren juurella.',
      hint: 'Maa sijaitsee Mustanmeren rannalla ja sen naapuri on Romania.',
    },
    {
      q: 'Millä kirjaimistolla bulgariaa kirjoitetaan?',
      options: ['kyrillisillä', 'latinalaisilla', 'kreikkalaisilla', 'arabialaisilla'],
      correct: 0,
      fact: 'Kirjaimisto kehitettiin 800-luvulla, ja se levisi Bulgariasta muualle Itä-Eurooppaan.',
      hint: 'Samaa kirjaimistoa käytetään Venäjällä.',
    },
    {
      q: 'Mistä kukasta Bulgaria on kuuluisa?',
      options: ['ruususta', 'tulppaanista', 'laventelista', 'auringonkukasta'],
      correct: 0,
      level: 3,
      fact: 'Bulgarian Ruusulaaksossa tuotetaan ruusuöljyä, jota käytetään hajuvesissä ympäri maailman.',
      hint: 'Kukassa on piikkejä ja se annetaan usein lahjaksi.',
    },
  ],

  bukarest: [
    {
      q: 'Minkä maan pääkaupunki Bukarest on?',
      options: ['Romania', 'Bulgaria', 'Moldova', 'Unkari'],
      correct: 0,
      fact: 'Bukarest on Romanian pääkaupunki ja maan suurin kaupunki.',
      hint: 'Maan nimi muistuttaa Rooman nimeä.',
    },
    {
      q: 'Mihin kieliryhmään romania kuuluu?',
      options: ['romaanisiin', 'slaavilaisiin', 'turkkilaisiin', 'germaanisiin'],
      correct: 0,
      fact: 'Romania on latinasta kehittynyt kieli, vaikka maata ympäröivät slaavilaiset kielet.',
      hint: 'Kieli on italian ja espanjan sukulainen.',
    },
    {
      q: 'Mikä vuoristo kaartuu Romanian halki?',
      options: ['Karpaatit', 'Alpit', 'Pyreneet', 'Uralvuoret'],
      correct: 0,
      fact: 'Karpaattien metsissä elää yhä yksi Euroopan suurimmista karhukannoista.',
      hint: 'Vuoristo kiertää Transilvanian.',
    },
  ],

  kiova: [
    {
      q: 'Minkä maan pääkaupunki Kiova on?',
      options: ['Ukraina', 'Valko-Venäjä', 'Puola', 'Moldova'],
      correct: 0,
      level: 1,
      fact: 'Kiova on Ukrainan pääkaupunki ja maan suurin kaupunki Dnepr-joen varrella.',
      hint: 'Maan lipussa on sininen ja keltainen vaakaraita.',
    },
    {
      q: 'Miksi Ukrainaa on kutsuttu Euroopan vilja-aitaksi?',
      options: [
        'sen mustan mullan peltojen takia',
        'suurten metsien takia',
        'kalarikkaiden järvien takia',
        'vuoristolaitumien takia',
      ],
      correct: 0,
      fact: 'Ukrainan mustamulta on maailman viljavimpia maalajeja, ja maa on suuri vehnän ja auringonkukkaöljyn viejä.',
      hint: 'Vastaus liittyy pellon maaperään.',
    },
    {
      q: 'Mikä joki virtaa Kiovan halki?',
      options: ['Dnepr', 'Volga', 'Don', 'Veiksel'],
      correct: 0,
      level: 3,
      fact: 'Joki alkaa Venäjän puolelta, virtaa Valko-Venäjän ja Ukrainan halki ja laskee Mustaanmereen.',
      hint: 'Nimi alkaa D-kirjaimella ja on lyhyt.',
    },
  ],

  odessa: [
    {
      q: 'Minkä meren rannalla Odessa sijaitsee?',
      options: ['Mustanmeren', 'Välimeren', 'Kaspianmeren', 'Itämeren'],
      correct: 0,
      fact: 'Odessa on Ukrainan tärkein satama, ja sen kautta kulkee suuri osa maan viljanviennistä.',
      hint: 'Meren nimessä on väri.',
    },
    {
      q: 'Mistä rakennelmasta Odessa tunnetaan elokuvahistoriassa?',
      options: ['portaistaan', 'oopperastaan', 'majakastaan', 'sillastaan'],
      correct: 0,
      level: 3,
      fact: 'Potemkinin portaat tulivat kuuluisiksi Sergei Eisensteinin elokuvasta Panssarilaiva Potemkin vuodelta 1925.',
      hint: 'Rakennelmaa pitkin kuljetaan ylös ja alas.',
    },
    {
      q: 'Mikä tekee Mustastamerestä epätavallisen?',
      options: [
        'sen syvyyksissä on lähes hapetonta vettä',
        'se jäätyy joka talvi kokonaan',
        'siinä ei ole lainkaan kalaa',
        'se on makeavetinen',
      ],
      correct: 0,
      level: 3,
      fact: 'Syvät vesikerrokset sekoittuvat huonosti pintaveteen, joten syvyydessä on lähes hapetonta vettä. Siksi sinne on säilynyt jopa antiikin laivanhylkyjä.',
      hint: 'Vastaus liittyy siihen, mitä syvällä ei ole.',
    },
  ],

  moskova: [
    {
      q: 'Mikä on Moskovan tunnetuin linnoitusalue?',
      options: ['Kreml', 'Akropolis', 'Tower', 'Alhambra'],
      correct: 0,
      level: 1,
      fact: 'Alue on muurien ympäröimä, ja sen sisällä on palatseja ja kirkkoja.',
      hint: 'Sana tarkoittaa venäjäksi linnoitusta.',
    },
    {
      q: 'Mistä Moskovan metro tunnetaan?',
      options: ['koristelluista asemistaan', 'lyhyydestään', 'maanpäällisyydestään', 'puuvaunuistaan'],
      correct: 0,
      fact: 'Monet asemat on koristeltu marmorilla, mosaiikeilla ja kattokruunuilla.',
      hint: 'Asemia on kutsuttu maanalaisiksi palatseiksi.',
    },
    {
      q: 'Mikä on Euroopan pisin joki?',
      options: ['Volga', 'Tonava', 'Rein', 'Dnepr'],
      correct: 0,
      fact: 'Volga virtaa noin 3 500 kilometriä ja laskee Kaspianmereen. Kanavat yhdistävät Moskovan siihen.',
      hint: 'Joki laskee Kaspianmereen.',
      source: 'https://fi.wikipedia.org/wiki/Volga',
    },
  ],

  pietari: [
    {
      q: 'Mikä ilmiö valaisee Pietarin kesäyöt?',
      options: ['valkeat yöt', 'revontulet', 'auringonpimennys', 'usva'],
      correct: 0,
      fact: 'Kaupunki on niin pohjoisessa, että kesäkuussa aurinko laskee vain hetkeksi eikä tule kunnolla pimeää.',
      hint: 'Ilmiö johtuu kaupungin pohjoisesta sijainnista kesällä.',
    },
    {
      q: 'Mikä maailmankuulu museo sijaitsee Pietarissa?',
      options: ['Ermitaasi', 'Prado', 'Louvre', 'Rijksmuseum'],
      correct: 0,
      fact: 'Museo on yksi maailman suurimmista taidekokoelmista ja toimii entisessä talvipalatsissa.',
      hint: 'Nimi alkaa E-kirjaimella.',
    },
    {
      q: 'Millaiselle maaperälle Pietari rakennettiin 1700-luvun alussa?',
      options: ['suomaalle', 'vuorelle', 'aavikolle', 'tulivuoren rinteelle'],
      correct: 0,
      level: 3,
      fact: 'Kaupunki perustettiin Nevan suistoon märälle maalle, ja rakennukset seisovat paalujen varassa.',
      hint: 'Maa oli märkää ja pehmeää.',
    },
  ],

  helsinki: [
    {
      q: 'Minkä maan pääkaupunki Helsinki on?',
      options: ['Suomi', 'Ruotsi', 'Viro', 'Norja'],
      correct: 0,
      level: 1,
      fact: 'Helsinki on Suomen pääkaupunki ja maan suurin kaupunki.',
      hint: 'Maassa on yli 180 000 järveä.',
    },
    {
      q: 'Mikä Helsingin edustan merilinnoitus on Unescon maailmanperintökohde?',
      options: ['Suomenlinna', 'Kastelholma', 'Olavinlinna', 'Hämeenlinna'],
      correct: 0,
      fact: 'Linnoitus rakennettiin 1700-luvulla usealle saarelle, ja siellä asuu yhä satoja ihmisiä.',
      hint: 'Nimessä on maan nimi.',
    },
    {
      q: 'Kuinka monta kansalliskieltä Suomessa on?',
      options: ['kaksi', 'yksi', 'kolme', 'neljä'],
      correct: 0,
      fact: 'Kansalliskielet ovat suomi ja ruotsi. Saamelaisilla on kotiseutualueellaan oikeus käyttää saamen kieliä viranomaisissa.',
      hint: 'Toinen kieli on naapurimaan kieli.',
    },
  ],

  tukholma: [
    {
      q: 'Kuinka monelle saarelle Tukholman keskusta on rakennettu?',
      options: ['neljälletoista', 'kahdelle', 'seitsemälle', 'kolmellekymmenelle'],
      correct: 0,
      level: 3,
      fact: 'Keskusta levittäytyy neljälletoista saarelle, joita yhdistävät kymmenet sillat.',
      hint: 'Luku on suurempi kuin kymmenen mutta pienempi kuin kaksikymmentä.',
    },
    {
      q: 'Mikä palkinto jaetaan vuosittain Tukholmassa?',
      options: ['Nobel-palkinto', 'Oscar-palkinto', 'Pulitzer-palkinto', 'Turing-palkinto'],
      correct: 0,
      fact: 'Palkinnot jaetaan joulukuun 10. päivänä; rauhanpalkinto jaetaan Oslossa.',
      hint: 'Palkinnon perusti dynamiitin keksijä.',
    },
    {
      q: 'Mikä 1600-luvun sotalaiva nostettiin merestä Tukholman museoon?',
      options: ['Vasa', 'Mary Rose', 'Victory', 'Kronan'],
      correct: 0,
      level: 3,
      fact: 'Laiva kaatui neitsytmatkallaan 1628 ja nostettiin merestä 1961 poikkeuksellisen hyvin säilyneenä.',
      hint: 'Nimi on sama kuin Ruotsin vanhan kuningassuvun.',
    },
  ],

  oslo: [
    {
      q: 'Minkä maan pääkaupunki Oslo on?',
      options: ['Norja', 'Ruotsi', 'Tanska', 'Islanti'],
      correct: 0,
      level: 1,
      fact: 'Oslo on Norjan pääkaupunki Oslovuonon pohjukassa.',
      hint: 'Maa tunnetaan vuonoistaan.',
    },
    {
      q: 'Miten vuono syntyy?',
      options: [
        'jäätikkö kaivaa laakson, jonka meri täyttää',
        'tulivuori räjäyttää kraatterin',
        'joki kasaa hiekkasärkän',
        'maanjäristys halkaisee kallion',
      ],
      correct: 0,
      fact: 'Jääkauden jäätiköt kaivoivat syviä laaksoja, ja meri nousi niihin jään sulettua.',
      hint: 'Muovaaja oli jää.',
    },
    {
      q: 'Mikä Nobelin palkinnoista jaetaan Oslossa?',
      options: ['rauhanpalkinto', 'kirjallisuuspalkinto', 'fysiikan palkinto', 'lääketieteen palkinto'],
      correct: 0,
      fact: 'Alfred Nobel määräsi testamentissaan, että tämän palkinnon jakaa norjalainen komitea muiden jäädessä Ruotsiin.',
      hint: 'Palkinto liittyy sotien lopettamiseen.',
    },
  ],

  kobenhavn: [
    {
      q: 'Minkä maan pääkaupunki Kööpenhamina on?',
      options: ['Tanska', 'Norja', 'Ruotsi', 'Alankomaat'],
      correct: 0,
      level: 1,
      fact: 'Kööpenhamina on Tanskan pääkaupunki ja sijaitsee Sjællandin saarella.',
      hint: 'Maa on Pohjoismaista eteläisin.',
      source: 'https://fi.wikipedia.org/wiki/K%C3%B6%C3%B6penhamina',
    },
    {
      q: 'Kenen sadun mukaan Kööpenhaminan tunnetuin patsas on tehty?',
      options: ['H. C. Andersenin', 'Grimmin veljesten', 'Astrid Lindgrenin', 'Tove Janssonin'],
      correct: 0,
      fact: 'Pieni merenneito -patsas on ollut satamassa vuodesta 1913.',
      hint: 'Kirjailija oli tanskalainen ja kirjoitti myös Rumasta ankanpoikasesta.',
    },
    {
      q: 'Mikä kulkuväline on Kööpenhaminassa erityisen suosittu?',
      options: ['polkupyörä', 'köysirata', 'gondoli', 'moottorikelkka'],
      correct: 0,
      fact: 'Kaupungissa on satoja kilometrejä pyöräteitä, ja suuri osa asukkaista kulkee töihin niitä pitkin.',
      hint: 'Kulkuvälineessä on kaksi rengasta ja polkimet.',
    },
  ],

  lappi: [
    {
      q: 'Mikä valoilmiö näkyy Lapin talvitaivaalla?',
      options: ['revontulet', 'sateenkaari', 'kangastus', 'auringonpimennys'],
      correct: 0,
      level: 1,
      fact: 'Ilmiö syntyy, kun Auringosta tulevat hiukkaset törmäävät ilmakehän kaasuihin.',
      hint: 'Ilmiö näkyy vihreänä hehkuna pimeällä taivaalla.',
    },
    {
      q: 'Mikä on saamelaisten perinteinen elinkeino Lapissa?',
      options: ['poronhoito', 'viininviljely', 'kaivostyö', 'laivanrakennus'],
      correct: 0,
      fact: 'Elinkeino on osa saamelaista kulttuuria, mutta saamelaiset työskentelevät nykyään kaikilla aloilla.',
      hint: 'Elinkeino liittyy sarvipäiseen eläimeen.',
    },
    {
      q: 'Mitä kaamos tarkoittaa?',
      options: [
        'aikaa, jolloin aurinko ei nouse',
        'kovaa pakkasta',
        'kevään sulamisaikaa',
        'yötöntä yötä',
      ],
      correct: 0,
      fact: 'Napapiirin pohjoispuolella aurinko pysyy talvella horisontin alapuolella useita viikkoja.',
      hint: 'Ilmiö on kesän valoisan ajan vastakohta.',
    },
  ],

  tromssa: [
    {
      q: 'Miksi Tromssassa on lämpimämpää kuin muualla samalla leveysasteella?',
      options: [
        'lämmin merivirta huuhtoo rannikkoa',
        'tulivuoret lämmittävät maata',
        'kaupunki on syvässä laaksossa',
        'aurinko paistaa siellä pidempään',
      ],
      correct: 0,
      fact: 'Pohjois-Atlantin virta tuo lämmintä vettä Norjan rannikolle, joten satamat pysyvät sulina läpi talven.',
      hint: 'Syy tulee valtamerestä.',
    },
    {
      q: 'Mitä Tromssasta on lähtenyt liikkeelle 1800-luvulta alkaen?',
      options: ['arktisia tutkimusretkiä', 'ristiretkiä', 'siirtolaislaivoja Amerikkaan', 'öljynporauslauttoja'],
      correct: 0,
      fact: 'Kaupunkia on kutsuttu Jäämeren portiksi, ja sieltä lähtivät muun muassa Roald Amundsenin retkikunnat.',
      hint: 'Matkat suuntautuivat pohjoiseen jäiden keskelle.',
    },
    {
      q: 'Mitä yötön yö tarkoittaa?',
      options: [
        'aurinko ei laske lainkaan',
        'kuu paistaa koko yön',
        'yö on pilvinen',
        'yöllä sataa lunta',
      ],
      correct: 0,
      level: 1,
      fact: 'Napapiirin pohjoispuolella aurinko pysyy keskikesällä horisontin yläpuolella vuorokauden ympäri.',
      hint: 'Ilmiö on kaamoksen vastakohta.',
    },
  ],

  general: [
    {
      q: 'Mikä on pinta-alaltaan Euroopan suurin maa?',
      options: ['Venäjä', 'Ranska', 'Ukraina', 'Espanja'],
      correct: 0,
      fact: 'Venäjä on suurin, joskin suurin osa siitä on Aasian puolella. Kokonaan Euroopassa sijaitsevista maista suurin on Ukraina.',
      hint: 'Maa ulottuu myös Aasian puolelle.',
    },
    {
      q: 'Mikä joki on Euroopan pisin?',
      options: ['Volga', 'Tonava', 'Rein', 'Loire'],
      correct: 0,
      level: 1,
      fact: 'Joki virtaa noin 3 500 kilometriä Venäjän halki Kaspianmereen.',
      hint: 'Nimi alkaa V-kirjaimella.',
    },
    {
      q: 'Mikä vuoristo erottaa Espanjan ja Ranskan?',
      options: ['Pyreneet', 'Alpit', 'Apenniinit', 'Karpaatit'],
      correct: 0,
      fact: 'Vuoristo kulkee Atlantilta Välimerelle, ja sen keskellä on pikkuvaltio Andorra.',
      hint: 'Vuoriston keskellä on pieni valtio Andorra.',
    },
    {
      q: 'Mikä meri on Euroopan vähäsuolaisin?',
      options: ['Itämeri', 'Välimeri', 'Pohjanmeri', 'Mustameri'],
      correct: 0,
      level: 3,
      fact: 'Mereen laskee paljon jokia ja yhteys valtamereen on kapea, joten vesi on lähes murtovettä.',
      hint: 'Meri on Suomen ja Ruotsin välissä.',
    },
    {
      q: 'Kuinka monta jäsenmaata Euroopan unionissa on?',
      options: ['27', '15', '19', '32'],
      correct: 0,
      fact: 'Jäsenmaita on 27 sen jälkeen, kun Yhdistynyt kuningaskunta erosi unionista vuonna 2020.',
      hint: 'Luku pieneni yhdellä vuonna 2020.',
    },
    {
      q: 'Mikä on Euroopan pienin itsenäinen valtio?',
      options: ['Vatikaani', 'Monaco', 'San Marino', 'Liechtenstein'],
      correct: 0,
      level: 1,
      fact: 'Valtion pinta-ala on alle puoli neliökilometriä.',
      hint: 'Valtio on kokonaan Rooman sisällä.',
    },
    {
      q: 'Mikä on Euroopan korkein vuori?',
      options: ['Elbrus', 'Mont Blanc', 'Matterhorn', 'Etna'],
      correct: 0,
      level: 3,
      fact: 'Kaukasuksen Elbrus kohoaa 5 642 metriin. Alppien Mont Blanc on Länsi-Euroopan korkein.',
      hint: 'Vuori sijaitsee Kaukasuksella.',
    },
    {
      q: 'Mitä valuuttaa käytetään useimmissa EU-maissa?',
      options: ['euroa', 'puntaa', 'kruunua', 'frangia'],
      correct: 0,
      level: 1,
      fact: 'Valuutta otettiin käyttöön käteisenä vuonna 2002, ja sitä käyttää valtaosa EU-maista.',
      hint: 'Valuutan nimi muistuttaa maanosan nimeä.',
    },
    {
      q: 'Mikä salmi erottaa Euroopan ja Afrikan?',
      options: ['Gibraltarinsalmi', 'Bosporinsalmi', 'Juutinrauma', 'Messinansalmi'],
      correct: 0,
      fact: 'Salmi on kapeimmillaan noin 14 kilometriä leveä.',
      hint: 'Salmen kohdalla kohoaa kuuluisa kallio.',
    },
    {
      q: 'Mikä kaupunki jakautuu kahdelle mantereelle?',
      options: ['Istanbul', 'Ateena', 'Lissabon', 'Kööpenhamina'],
      correct: 0,
      fact: 'Bosporinsalmi jakaa kaupungin Euroopan ja Aasian puoleiseen osaan.',
      hint: 'Kaupungin läpi kulkee salmi, jonka yli on rakennettu siltoja.',
    },
    {
      q: 'Mikä on pinta-alaltaan Euroopan suurin järvi?',
      options: ['Laatokka', 'Vänern', 'Balaton', 'Saimaa'],
      correct: 0,
      level: 3,
      fact: 'Laatokka sijaitsee Venäjällä lähellä Pietaria, ja siitä laskee Neva-joki Suomenlahteen.',
      hint: 'Järvi on Venäjällä lähellä Suomen rajaa.',
    },
    {
      q: 'Mikä Euroopan maa on kokonaan toisen maan ympäröimä?',
      options: ['San Marino', 'Portugali', 'Tanska', 'Viro'],
      correct: 0,
      level: 3,
      fact: 'San Marinoa ympäröi kokonaan Italia, samoin Vatikaania. San Marino on maailman vanhimpia tasavaltoja.',
      hint: 'Valtio on Italian sisällä.',
    },
    {
      q: 'Mikä on Euroopan asukasluvultaan suurin maa?',
      options: ['Venäjä', 'Saksa', 'Ranska', 'Italia'],
      correct: 0,
      fact: 'Venäjällä on yli 140 miljoonaa asukasta. EU-maista väkirikkain on Saksa.',
      hint: 'Sama maa on myös pinta-alaltaan suurin.',
    },
    {
      q: 'Mistä sana Eurooppa on peräisin?',
      options: ['kreikkalaisesta tarustosta', 'latinan sanasta pelto', 'viikinkien kielestä', 'arabian sanasta länsi'],
      correct: 0,
      level: 3,
      fact: 'Europe oli kreikkalaisessa tarustossa foinikialainen prinsessa, jonka Zeus vei Kreetalle.',
      hint: 'Nimi kuuluu tarun prinsessalle.',
    },
    {
      q: 'Mikä on Euroopan tiheimmin asuttuja maita?',
      options: ['Alankomaat', 'Norja', 'Islanti', 'Suomi'],
      correct: 0,
      fact: 'Alankomaissa asuu yli 500 ihmistä neliökilometrillä; Suomessa noin 18.',
      hint: 'Maa tunnetaan padoistaan ja tuulimyllyistään.',
    },
  ],
};

/**
 * "Tiesitkö että…" -tiedot paketin kaupungeista. Peli näyttää yhden vuorossa
 * olevan pelaajan sijainnista, joten jokaisella paikalla on useampi vaihtoehto.
 */
export const EUROPE_FACTS = {
  lontoo: [
    'Lontoon metro avattiin vuonna 1863 ja on maailman vanhin. Sen lempinimi Tube tulee tunnelien pyöreästä muodosta.',
    'Thamesin vuorovesi nostaa ja laskee veden pintaa Lontoossa noin seitsemän metriä vuorokaudessa.',
  ],
  istanbul: [
    'Istanbul on ainoa suurkaupunki, joka sijaitsee kahdella mantereella: Bosporinsalmi erottaa sen Euroopan ja Aasian puolen.',
    'Kaupunki tunnettiin ennen nimillä Bysantion ja Konstantinopoli, ja se oli kahden valtakunnan pääkaupunki lähes 1 600 vuoden ajan.',
  ],
  dublin: [
    { text: 'Dublinin nimi tulee iirin sanoista dubh linn, musta lammikko, joka oli viikinkien satamapaikka Liffey-joen mutkassa.', source: 'https://fi.wikipedia.org/wiki/Dublin' },
    'Irlannin kansallissymboli on kolmiapila, ja maan lempinimi smaragdisaari kertoo runsaista sateista ja vihreistä laitumista.',
  ],
  edinburgh: [
    'Edinburghin vanhakaupunki ja uusikaupunki ovat molemmat Unescon maailmanperintökohteita — keskiaikainen sokkelo ja 1700-luvun ruutukaava vierekkäin.',
    'Skotlannin ylängöillä puhutaan yhä gaelia, ja kielen elvyttämiseksi on perustettu omia kouluja.',
  ],
  pariisi: [
    'Pariisin katujen alla kulkee satoja kilometrejä vanhoja kivilouhoksia. Osa niistä on katakombeja, joihin siirrettiin vanhojen hautausmaiden luut 1700-luvulla.',
    'Louvre oli alun perin linnoitus ja kuninkaanlinna. Museoksi se avattiin vasta Ranskan vallankumouksen jälkeen vuonna 1793.',
  ],
  bordeaux: [
    'Bordeaux’n satamasta on viety viiniä Englantiin 1100-luvulta asti, jolloin alue kuului Englannin kruunulle.',
    'Kaupungin puolikuun muotoinen jokiranta on Unescon maailmanperintökohde: 1700-luvun julkisivut jatkuvat lähes taukoamatta kilometrien matkan.',
  ],
  lissabon: [
    'Lissabonin keltaiset raitiovaunut kiipeävät niin jyrkkiä katuja, että kaupungissa on myös julkisia hissejä ja köysiratoja.',
    'Portugalilaiset purjehtijat lähtivät Lissabonista etsimään merireittiä Intiaan; Vasco da Gama saapui perille vuonna 1498.',
  ],
  madrid: [
    'Madridin Retiro-puisto oli alun perin kuninkaan yksityinen puutarha. Se avattiin kaikille 1800-luvulla ja on nykyään kaupunkilaisten olohuone.',
    'Espanjassa syödään päivällinen usein vasta kello 21 jälkeen, ja työpäivä katkeaa pitkään lounastaukoon.',
  ],
  barcelona: [
    'Barcelonan Eixample-kaupunginosan korttelit on suunniteltu viistetyin kulmin, jotta risteyksiin syntyy pieniä aukioita.',
    'Sagrada Famílian rakentaminen alkoi vuonna 1882, ja se rahoitetaan yhä lahjoituksilla ja pääsymaksuilla.',
  ],
  amsterdam: [
    'Amsterdamin taloissa on ullakolla usein nostokoukku: portaat ovat niin kapeat, että huonekalut nostetaan sisään ikkunasta.',
    'Kaupungissa on enemmän polkupyöriä kuin asukkaita, ja pyöriä nostetaan vuosittain tuhansittain kanavista.',
  ],
  berliini: [
    'Berliinissä on enemmän siltoja kuin Venetsiassa — kaupungin halki virtaa Spree ja sitä ympäröi kanavien verkosto.',
    'Muurin paikka on merkitty katukiveykseen kaksoisrivillä mukulakiviä, joten reitin voi kävellä vielä tänäkin päivänä.',
  ],
  praha: [
    'Prahan linna on pinta-alaltaan yksi maailman suurimmista linnoista ja toimii yhä Tšekin presidentin virka-asuntona.',
    { text: 'Tšekissä juodaan asukasta kohden enemmän olutta kuin missään muualla maailmassa; ensimmäinen panimo perustettiin jo 993.', source: 'https://fi.wikipedia.org/wiki/T%C5%A1ekki' },
  ],
  wien: [
    { text: 'Wienin kahvilakulttuuri on ollut vuodesta 2011 Itävallan kansallisessa aineettoman kulttuuriperinnön luettelossa: kahvilassa saa istua tuntikausia yhden kupillisen kanssa.', source: 'https://en.wikipedia.org/wiki/Viennese_caf%C3%A9' },
    'Wienin juomavesi tulee putkia pitkin suoraan Alpeilta, ja vesijohto valmistui jo vuonna 1873.',
  ],
  budapest: [
    { text: 'Budapestin maanalainen on Manner-Euroopan vanhin metro. Se avattiin vuonna 1896 ja on Unescon maailmanperintökohde.', source: 'https://fi.wikipedia.org/wiki/Budapestin_metro' },
    'Tonava jakaa kaupungin: Buda on kukkulainen ja rauhallinen, Pest tasainen ja vilkas.',
  ],
  varsova: [
    'Varsovan vaakunassa on merenneito, joka legendan mukaan käski kalastajien perustaa kaupungin joen mutkaan.',
    'Puolan kieli kirjoitetaan latinalaisin kirjaimin, mutta siinä on omia merkkejä kuten ł, ż ja ę.',
  ],
  alpit: [
    { text: 'Alppien halki kulkee Gotthardin pohjatunneli, joka on yli 57 kilometriä pitkä — maailman pisin rautatietunneli.', source: 'https://fi.wikipedia.org/wiki/Gotthardin_pohjatunneli' },
    'Alppien jäätiköt ovat sulaneet nopeasti, ja niiden reunoilta on paljastunut esineitä, jotka ovat olleet jään alla tuhansia vuosia.',
  ],
  milano: [
    { text: 'Milanon tuomiokirkon rakentaminen kesti lähes kuusi vuosisataa: se alkoi vuonna 1386 ja viimeiset yksityiskohdat valmistuivat 1965.', source: 'https://en.wikipedia.org/wiki/Milan_Cathedral' },
    'Milano on Italian talouden keskus: siellä sijaitsevat maan pörssi ja suuri osa muoti- ja muotoilualan yrityksistä.',
  ],
  rooma: [
    'Roomassa on yhä käytössä antiikin aikana rakennettuja vesijohtoja, ja kaupungin kaduilla on tuhansia ilmaisia juomavesihanoja.',
    { text: 'Pantheonin betonikupoli on lähes kahden vuosituhannen jälkeen yhä maailman suurin ilman terästä rakennettu kupoli.', source: 'https://en.wikipedia.org/wiki/Pantheon,_Rome' },
  ],
  sisilia: [
    'Sisilia on ollut vuorollaan kreikkalaisten, roomalaisten, arabien ja normannien hallussa, ja kaikki näkyvät yhä saaren ruoassa ja rakennuksissa.',
    'Etnan rinteillä viljellään viiniä ja pistaaseja, koska tuhka tekee maaperästä poikkeuksellisen ravinteikasta.',
  ],
  ateena: [
    'Ateenassa on asuttu yhtäjaksoisesti yli 3 000 vuotta, mikä tekee siitä yhden Euroopan vanhimmista kaupungeista.',
    'Kreikan kieltä on kirjoitettu samalla kirjaimistolla lähes 2 800 vuotta, ja siitä ovat peräisin sanat kuten museo, teatteri ja matematiikka.',
  ],
  kreeta: [
    'Knossoksen palatsissa oli juokseva vesi ja viemäröinti jo pronssikaudella, noin 3 500 vuotta sitten.',
    'Kreetan Samarian rotko on Euroopan pisimpiä: se kulkee 16 kilometriä vuorilta merelle ja kapenee paikoin muutaman metrin levyiseksi.',
  ],
  dubrovnik: [
    'Dubrovnik perusti Euroopan ensimmäisiin kuuluvan karanteenin vuonna 1377: laivaväen piti odottaa saarella 30 päivää ennen kaupunkiin pääsyä.',
    'Ragusan tasavalta kielsi orjakaupan jo vuonna 1416, varhain Euroopan mittapuulla.',
  ],
  sofia: [
    'Sofian keskustassa seisovat vierekkäin ortodoksinen katedraali, moskeija, synagoga ja katolinen kirkko muutaman korttelin säteellä.',
    'Sofia on yksi Euroopan korkeimmalla sijaitsevista pääkaupungeista, noin 550 metrissä, ja hiihtokeskus on kaupungin rajojen sisällä.',
  ],
  bukarest: [
    'Bukarestin parlamenttitalo on yksi maailman suurimmista ja painavimmista rakennuksista. Se valmistui 1980-luvulla.',
    'Romaniassa puhutaan latinasta polveutuvaa kieltä, mutta sanastossa on paljon lainoja naapureiden slaavilaisista kielistä.',
  ],
  kiova: [
    'Kiovan Petšerskin luostarin alla kiemurtelee kilometrien pituinen luolasto, jota on kaivettu 1000-luvulta lähtien.',
    'Kiovan Rus oli keskiajalla mahtava ruhtinaskunta, jonka perintöä pitävät omanaan useat nykyiset itäslaavilaiset kansat.',
  ],
  odessa: [
    'Odessa perustettiin 1794 vapaasatamaksi, ja kaupunkiin muutti väkeä kymmenistä maista — siksi sen kulttuuri on poikkeuksellisen monikielinen.',
    'Odessan oopperatalo on rakennettu tanskalaisen ja itävaltalaisen arkkitehdin suunnitelmien mukaan, ja sitä pidetään yhtenä Euroopan kauneimmista.',
  ],
  moskova: [
    'Moskovan Punaisen torin nimi ei tule väristä eikä politiikasta: vanha venäjän sana krasnyi tarkoitti sekä punaista että kaunista.',
    'Moskova on Euroopan väkirikkain kaupunki, ja sen metrolla tehdään arkisin miljoonia matkoja päivässä.',
  ],
  pietari: [
    'Pietarin siltoja nostetaan kesäöisin ylös, jotta laivat pääsevät Nevaa pitkin — jalankulkijan kannattaa tarkistaa aikataulu ennen kotimatkaa.',
    'Kaupunki on rakennettu yli sadalle saarelle, ja sitä on kutsuttu Pohjolan Venetsiaksi.',
  ],
  helsinki: [
    'Helsingin edustalla on yli 300 saarta, ja monille niistä pääsee kaupungin omalla lautalla.',
    'Suomen kieli ei ole sukua ruotsille eikä venäjälle vaan virolle ja unkarille — se kuuluu suomalais-ugrilaisiin kieliin.',
  ],
  tukholma: [
    'Tukholman vanhankaupungin kujista kapein on alle metrin levyinen.',
    'Ruotsissa on jokamiehenoikeus: luonnossa saa liikkua ja telttailla myös toisen mailla, kunhan ei häiritse eikä tuhoa.',
  ],
  oslo: [
    'Oslo lahjoittaa joka vuosi kuusen Lontoon Trafalgar Squarelle kiitokseksi toisen maailmansodan aikaisesta tuesta.',
    'Norjan Oslovuono ja rannikko ovat niin syviä, että suuret risteilijät pääsevät aivan kaupungin keskustaan asti.',
  ],
  kobenhavn: [
    'Kööpenhaminan ja Ruotsin Malmön yhdistää Juutinrauman silta, joka sukeltaa keskellä salmea tunneliin tekosaaren kautta.',
    'Tanskalainen sana hygge tarkoittaa lämmintä ja kiireetöntä yhdessäoloa — kynttilöitä, kahvia ja hyvää seuraa.',
  ],
  lappi: [
    'Napapiiri kulkee Rovaniemen pohjoispuolelta: sen pohjoispuolella aurinko ei laske keskikesällä eikä nouse keskitalvella.',
    'Saamen kieliä on useita, ja niissä on kymmeniä sanoja lumelle sen mukaan, millaista hangella on kulkea.',
  ],
  tromssa: [
    { text: 'Tromssassa on maailman pohjoisin yliopisto, ja kaupungissa toimii myös oma panimo ja katedraali.', source: 'https://en.wikipedia.org/wiki/University_of_Troms%C3%B8' },
    { text: 'Tromssan kaupunki sijaitsee saarella, ja mantereelle pääsee vuonon yli kaartuvaa siltaa pitkin.', source: 'https://fi.wikipedia.org/wiki/Tromssa' },
  ],
};
