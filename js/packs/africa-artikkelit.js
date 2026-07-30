// Matkakirjan omat artikkelit (pilotti: Tanger ja Tripoli — omistajan
// päätös, laajennetaan jos malli toimii): Lue lisää -dialogin pitkä
// teksti kirjoitettu itse Wikipedia-artikkelien pohjalta — vähän
// lyhyempänä ja pelin tyyliin. Väliotsikot merkitään "== Otsikko ==",
// jotka renderArticle muuttaa otsikkoriveiksi. Toimii myös ilman
// verkkoa. `intro` on saman paikan parin lauseen nosto Tutki-kortille.
//
// Avaimena wiki-otsikko: kaupungeilla city.wiki, mailla countryShapesin
// wiki tai nimi — sama avain, jolla cachedSummary hakee.
export const OMAT_ARTIKKELIT = {
  Marokko: {
    intro: 'Marokon kuningaskunta on Afrikan luoteiskulman maa, jossa '
      + 'Atlasvuoret erottavat meren rannikot Saharasta. Eurooppaan on '
      + 'matkaa vain salmen verran, ja se näkyy kaikessa — Marokko on '
      + 'aina ollut kahden maailman naapuri.',
    artikkeli: 'Marokko on kuningaskunta Afrikan luoteisosassa. Sillä on '
      + 'rantaa kahdelle merelle, Atlantille ja Välimerelle, ja maan '
      + 'halki kulkee Atlasvuoristo, jonka huiput nousevat yli neljään '
      + 'kilometriin. Vuorten takana alkaa Sahara.'
      + '\n\n== Historiaa lyhyesti ==\n'
      + 'Maan vanhin väestö ovat berberit, joiden kieli ja kulttuuri '
      + 'elävät yhä vahvoina. Arabit toivat 600-luvulta alkaen islamin '
      + 'ja arabian kielen, ja vuosisatojen ajan Marokkoa hallitsivat '
      + 'omat sulttaanit — maa ei koskaan kuulunut Osmanien '
      + 'valtakuntaan. 1900-luvun alussa Ranska ja Espanja jakoivat '
      + 'Marokon suojelualueikseen; itsenäiseksi kuningaskunnaksi maa '
      + 'palasi vuonna 1956, ja samaa kuningassukua se on hallinnut '
      + '1600-luvulta asti.'
      + '\n\n== Elämää ==\n'
      + 'Marokon kaupungeissa vanha ja uusi elävät rinnakkain: medinan '
      + 'kujat, torit ja käsityöläiskorttelit kuuluvat arkeen siinä '
      + 'missä uudet lähiöt. Vieraalle kaadetaan makeaa minttuteetä, '
      + 'perjantaina tuoksuu kuskus, ja toreilla tingitään hyvällä '
      + 'tuulella. Kuuluisimpia kaupunkeja ovat Marrakech, Fes ja '
      + 'Casablanca — ja pohjoisessa Tanger, kahden meren portti.',
  },
  Libya: {
    intro: 'Libya on Pohjois-Afrikan valtio, jossa kapean rannikkokaistan '
      + 'takana aukeaa Saharan suuri hiekkameri. Lähes koko maa on '
      + 'aavikkoa — siksi melkein kaikki libyalaiset asuvat meren '
      + 'äärellä.',
    artikkeli: 'Libya on suuri maa Välimeren rannalla Egyptin ja '
      + 'Tunisian välissä. Pinta-alaltaan se on yli viisi kertaa Suomen '
      + 'kokoinen, mutta valtaosa siitä on Saharan aavikkoa: hiekkaa, '
      + 'kivikkoa ja hajallaan olevia keitaita. Siksi lähes kaikki '
      + 'asutus on kapealla rannikkokaistalla.'
      + '\n\n== Historiaa lyhyesti ==\n'
      + 'Rannikolle rakensivat kaupunkeja jo foinikialaiset ja '
      + 'kreikkalaiset, ja roomalaisten aikana seutu kukoisti — Leptis '
      + 'Magnan rauniokaupunki on yhä yksi maailman hienoimpia. '
      + 'Myöhemmin maata hallitsivat osmanit ja 1900-luvun alusta '
      + 'Italia. Itsenäinen Libya syntyi vuonna 1951, ja pian sen '
      + 'jälkeen aavikon alta löytyi öljyä, joka muutti köyhän maan '
      + 'talouden.'
      + '\n\n== Elämää ==\n'
      + 'Libyalaisten elämä keskittyy rannikon kaupunkeihin, joista '
      + 'suurin on pääkaupunki Tripoli. Tee juodaan vahvana ja '
      + 'vaahtoavana useampi lasillinen, juhlapöydässä on bazin-pata, '
      + 'ja häissä soi malouf. Aavikko on silti aina läsnä: karavaanien '
      + 'vanhat reitit, keitaiden taatelitarhat ja Fezzanin '
      + 'kalliopiirrokset kertovat, miten tässä maassa on aina osattu '
      + 'elää hiekan ehdoilla.',
  },
  Tanger: {
    intro: 'Tanger vartioi Gibraltarinsalmea Afrikan luoteiskulmassa: '
      + 'Eurooppaan on merta vain neljätoista kilometriä, ja kaupungin '
      + 'edustalla Atlantti ja Välimeri kohtaavat. Portti kahden meren '
      + 'ja kahden mantereen välissä on tehnyt siitä satamakaupungin, '
      + 'jota kaikki ovat aina halunneet.',
    artikkeli: 'Tanger on satamakaupunki Marokon pohjoisrannikolla, '
      + 'Gibraltarinsalmen suulla. Espanjan rannikko näkyy selkeällä '
      + 'säällä paljain silmin: merta on välissä vain reilut kymmenen '
      + 'kilometriä. Siksi Tanger on aina ollut portti — Afrikan ovi '
      + 'Eurooppaan ja Euroopan ovi Afrikkaan.'
      + '\n\n== Kahden meren kaupunki ==\n'
      + 'Kaupungin edustalla kohtaavat Atlantin valtameri ja Välimeri. '
      + 'Vanha kaupunki eli medina kiipeää rinnettä satamasta ylös '
      + 'kapeina, mutkittelevina kujina, ja sen yläpuolella seisoo '
      + 'kasbah, vanha linnoitusalue portteineen. Valkoiseksi kalkitut '
      + 'talot hehkuvat auringossa niin, että kaupunki näkyy merelle '
      + 'kauas.'
      + '\n\n== Kaikkien haluama satama ==\n'
      + 'Tangerin ovat vallanneet vuorollaan foinikialaiset, roomalaiset, '
      + 'arabit, portugalilaiset ja englantilaiset. 1900-luvun alussa '
      + 'keksittiin erikoinen ratkaisu: kaupunkia hallitsi vuosikymmenten '
      + 'ajan monta maata yhdessä, ja tätä kansainvälistä kautta kesti '
      + 'vuoteen 1956, jolloin Tanger liittyi itsenäistyneeseen '
      + 'Marokkoon. Kansainvälisinä vuosina kaupunkiin muutti kauppiaita, '
      + 'kirjailijoita ja taiteilijoita kaikkialta maailmasta, ja sen '
      + 'kahviloissa puhuttiin puolta tusinaa kieltä samassa pöydässä.'
      + '\n\n== Tanger tänään ==\n'
      + 'Nykyään Tanger on Marokon suurimpia kaupunkeja ja sen satama '
      + 'yksi Afrikan vilkkaimmista: lautat ja rahtilaivat kulkevat '
      + 'salmen yli tauotta. Medinan torit, minttutee ja gnawa-musiikki '
      + 'kuuluvat katukuvaan kuten sata vuotta sittenkin — kaupunki on '
      + 'yhä paikka, jossa kaksi mannerta katsoo toisiaan silmiin.',
  },
  Tripoli: {
    intro: 'Tripoli on Libyan pääkaupunki ja Välimeren rannan valkoinen '
      + 'satamakaupunki, jota on kutsuttu meren morsiameksi. Sen '
      + 'kauppapaikalla ovat kohdanneet meri ja Sahara: laivat toivat '
      + 'tavaransa satamaan, karavaanit aavikon halki.',
    artikkeli: 'Tripoli on Libyan pääkaupunki ja maan suurin kaupunki '
      + 'Välimeren rannalla. Nimi tulee kreikan sanoista "kolme '
      + 'kaupunkia": antiikin aikana rannikolla oli kolme '
      + 'naapurikaupunkia, joista Tripoli on ainoana yhä pystyssä ja '
      + 'täynnä elämää.'
      + '\n\n== Antiikin perintö ==\n'
      + 'Kaupungin perustivat foinikialaiset kauppiaat lähes kolme '
      + 'tuhatta vuotta sitten, ja roomalaisten aikana seutu kukoisti. '
      + 'Vanhassakaupungissa seisoo yhä keisari Marcus Aureliuksen '
      + 'riemukaari 160-luvulta — se on jäänyt kuoppaan, koska katu on '
      + 'noussut sen ympärillä metrikaupalla vuosisatojen kuluessa. '
      + 'Idempänä rannikolla ovat Leptis Magnan rauniot, yksi maailman '
      + 'parhaiten säilyneistä roomalaiskaupungeista.'
      + '\n\n== Meren ja aavikon kauppapaikka ==\n'
      + 'Tripolin rikkaus syntyi sijainnista: satamaan tulivat laivat '
      + 'Välimereltä, ja etelästä saapuivat karavaanit Saharan halki. '
      + 'Laiturilla kaksi maailmaa vaihtoi tavaransa — suolaa, kultaa, '
      + 'kankaita ja taateleita. Vanhakaupunki eli medina rakentui '
      + 'tämän kaupan ympärille toreineen ja käsityöläiskujineen, ja '
      + 'sitä vartioi merenpuoleinen linnoitus, Punainen linna.'
      + '\n\n== Tripoli tänään ==\n'
      + 'Vuosisatojen varrella kaupunkia ovat hallinneet muun muassa '
      + 'osmanit ja italialaiset, ja itsenäisen Libyan pääkaupunki '
      + 'siitä tuli 1950-luvulla. Nykyisin Tripolissa asuu yli miljoona '
      + 'ihmistä. Medinan kujilla juodaan yhä vahvaa, vaahtoavaa teetä, '
      + 'juhlissa soi malouf-musiikki, ja valkoiset talot hehkuvat '
      + 'auringossa kuten aina — meren morsian pitää nimestään kiinni.',
  },
};
