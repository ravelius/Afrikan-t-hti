// Euroopan matkakirjamerkinnät: nuoren herran tunnepitoinen kuvaus ja
// isoisän nosto, samaan malliin kuin Afrikassa. Rakentuu kaupunki
// kerrallaan. Luennat: puhe-europe-saapuminen-<id>.mp3 (ks.
// SAAPUMISLUENNAT js/ui.js:ssä — vain siellä listatuilla kaupungeilla
// kaiutinnappi syttyy).
//
// Lontoon, Pariisin, Rooman ja Ateenan tekstit ovat Fablen kirjoittamia:
// hän ehti generoida niistä luennat, mutta tekstit eivät päätyneet
// repoon. Ne on palautettu ElevenLabsin historiasta sanatarkasti, jotta
// ruudulla lukee täsmälleen se, mitä kertoja lukee.
export const EUROPE_SAAPUMISET = {
  lontoo: {
    kuvaus: 'Kotikaupunki — ja silti sydän hakkasi kuin vieraassa! Sumu '
      + 'nousi Thamesilta, Tower Bridge avasi kitansa laivalle, ja metro '
      + 'jyrisi jalkojeni alla kuin maanalainen ukkonen. Tästä '
      + 'kaupungista lähdetään maailmalle — ja tänne se aina jotenkin '
      + 'palataan.',
    nosto: 'Matkakirjan ensimmäisellä sivulla lukee: "Lontoosta pääsee '
      + 'kaikkialle, mutta mikään ei valmista siihen, mitä sieltä '
      + 'löytää." Nyt minä lähden tarkistamaan.',
  },

  pariisi: {
    kuvaus: 'Pariisi tuoksui sateelta ja tuoreelta leivältä. Kävelin '
      + 'bulevardia, jonka päässä Eiffel-torni seisoi kuin rautainen '
      + 'jättiläinen suorassa asennossa — ja kahvilan pöydästä näki koko '
      + 'maailman kulkevan ohi, kiireettä, kuin sillä olisi ikuisesti '
      + 'aikaa.',
    nosto: 'Isoisä kirjoitti: "Pariisissa istuin kolme tuntia samassa '
      + 'kahvilassa enkä hävennyt hetkeäkään. Se on tämän kaupungin '
      + 'suurin keksintö." Tilasin toisen kaakaon hänen kunniakseen.',
  },

  ateena: {
    kuvaus: 'Ateenassa nostin katseeni kadulta — ja siellä se oli, '
      + 'Akropolis, kelluen kaupungin yllä iltavalossa! Alhaalla Plakan '
      + 'kujilla tuoksui oliiviöljy ja grillattu liha, ja joku soitti '
      + 'bouzoukia niin iloisesti, että vieraatkin alkoivat taputtaa.',
    nosto: 'Isoisä kirjoitti temppelin juurella: "Täällä keksittiin, '
      + 'että kaupunkia voi johtaa keskustelemalla. Kaikkea ei ole vielä '
      + 'kokeiltu loppuun." Ukolla oli tapana olla oikeassa.',
  },

  rooma: {
    kuvaus: 'Roomassa kävelin kulman taakse ja melkein törmäsin '
      + 'Colosseumiin! Se vain seisoo siinä, keskellä liikennettä, '
      + 'kaksituhatta vuotta vanhana. Täällä jokainen katukivi on nähnyt '
      + 'keisareita, ja suihkulähteet solisevat kuin mitään ei olisi '
      + 'tapahtunut.',
    nosto: 'Isoisän merkintä: "Heitin kolikon Trevin lähteeseen, kuten '
      + 'tapa vaatii. Jos tarina pitää paikkansa, palaan vielä — ja '
      + 'minulla on paha aavistus, että se pitää." Heitin omani samaan '
      + 'kohtaan.',
  },

  kreeta: {
    kuvaus: 'Knossoksen raunioilla on portaita, jotka johtavat ylös ja '
      + 'alas yhtä aikaa, ja seinillä hyppää härän yli nuoria, jotka '
      + 'maalattiin sinne kolme ja puoli tuhatta vuotta sitten. Tämä on '
      + 'Euroopan vanhin kaupunkikulttuuri, ja se osasi jo tehdä '
      + 'viemärit. Ulkona tuoksui timjami ja meri oli joka suunnassa.',
    nosto: 'Isoisä kirjoitti: "Sanotaan että täällä asui hirviö '
      + 'labyrintissa. Minä näin vain palatsin, jossa on liikaa '
      + 'käytäviä." Eksyin itsekin kahdesti — ja aloin ymmärtää tarinan.',
  },

  sisilia: {
    kuvaus: 'Etna savusi horisontissa kuin se olisi juuri herännyt, ja '
      + 'sen juurella kasvoi sitruunatarhoja mustassa laavamullassa. '
      + 'Torilla huudettiin kalaa laulaen — oikeasti laulaen. Saarella on '
      + 'kreikkalaisia temppeleitä, arabien kupoleita ja normannien '
      + 'kirkkoja, usein samassa korttelissa.',
    nosto: 'Isoisä merkitsi: "Sisilia on ollut kaikkien maa eikä kenenkään. '
      + 'Siksi sen keittiö on paras Välimerellä." En kiistele ruoasta '
      + 'kenenkään kanssa, mutta hän saattoi olla oikeassa.',
  },

  dubrovnik: {
    kuvaus: 'Kävelin kaupunginmuurin päällä koko kierroksen: alla '
      + 'oranssit kattotiilet tiiviisti vieri vieressä, ulkopuolella '
      + 'Adrianmeri niin kirkkaana että pohja näkyi. Dubrovnik oli '
      + 'vuosisatoja oma pieni tasavaltansa, joka pysyi hengissä '
      + 'kauppaamalla ja neuvottelemalla — ei sotimalla.',
    nosto: 'Isoisä kirjoitti: "Ragusa osti rauhansa joka vuosi uudestaan. '
      + 'Halvempaa kuin sota, ja kauniimpaa." Muurit ovat yhä pystyssä, '
      + 'joten kauppa taisi kannattaa.',
  },

  sofia: {
    kuvaus: 'Sofiassa kävelin korttelin matkan ja ohitin moskeijan, '
      + 'synagogan ja kaksi kirkkoa. Keskellä katua on lasin alla '
      + 'roomalainen katu, jota kaivettiin esiin metroa tehdessä — '
      + 'kaupunki on rakennettu itsensä päälle monta kertaa. Vitosha-vuori '
      + 'seisoo kadun päässä niin lähellä, että sinne pääsee bussilla.',
    nosto: 'Isoisä kirjoitti: "Uusi pääkaupunki vanhalla paikalla. '
      + 'Roomalaiset tulivat tänne lähteiden takia." Lähteet ovat yhä '
      + 'käytössä: näin ihmisten hakevan niistä vettä kanistereihin.',
  },

  venetsia: {
    kuvaus: 'Venetsia ei liioittele yhtään: kadut ovat oikeasti vettä! '
      + 'Vaporetto kaartoi Canal Grandelle, palatsit nousivat suoraan '
      + 'aallokosta, ja minä seisoin keulassa nauramassa ääneen — '
      + 'kokonainen kaupunki, joka on päättänyt kellua, ja kellunut jo '
      + 'tuhat vuotta.',
    nosto: 'Isoisä kirjoitti täältä: "Kadut lainehtivat ja talot uivat. '
      + 'Epäkäytännöllisintä ja kauneinta, mitä olen ikinä nähnyt." '
      + 'Ukko oli oikeassa molemmissa.',
  },

  marseille: {
    kuvaus: 'Vanha satama avautuu suoraan kaupungin keskelle, ja aamun '
      + 'saalis myydään laiturilla laatikoista. Join kahvin seisaaltaan '
      + 'ja katselin sataman heräämistä — samaa satamaa, jonka '
      + 'kreikkalaiset merenkulkijat perustivat noin 600 vuotta ennen '
      + 'ajanlaskun alkua. Marseille oli olemassa kauan ennen Pariisia, '
      + 'eikä se ole unohtanut sitä hetkeksikään.',
    nosto: 'Isoisä kirjoitti: "Marseille on Ranskan takaovi, josta koko '
      + 'Välimeri astuu sisään." Ovi on yhä auki — mutta nykyään siitä '
      + 'kuljetaan molempiin suuntiin.',
  },

  granada: {
    kuvaus: 'Alhambra ei näytä kaukaa linnalta vaan siltä, että vuoreen '
      + 'olisi kasvanut torneja. Kiipesin Albaicínin kujia ylös '
      + 'hengästyneenä, ja kun käännyin, koko palatsi oli siinä — ja sen '
      + 'takana Sierra Nevadan huiput, joilla oli lunta vielä kesäkuussa.',
    nosto: 'Isoisä oli merkinnyt sivun reunaan: "Maurien viimeinen '
      + 'kaupunki Euroopassa. Sen sisustuksen edessä englantilainen '
      + 'arkkitehti vaikenee." Vaikenin minäkin.',
  },

  krakova: {
    kuvaus: 'Rynek Główny on niin avara, että sen yli katsoessa näkyy '
      + 'kuin oma horisontti: Euroopan suurin keskiaikainen tori, noin '
      + 'kaksisataa metriä joka suuntaan. Keskellä seisoo Sukiennice, '
      + 'keskiaikainen kauppahalli, jossa yhä myydään tavaraa tiskin '
      + 'takaa. Krakova oli Puolan pääkaupunki yli viisisataa vuotta, ja '
      + 'kuninkaat lepäävät edelleen Wawelin kukkulalla joen mutkassa.',
    nosto: 'Isoisä kirjoitti Krakovasta yhden rivin: "Kaupunki, jota ei '
      + 'ole poltettu — harvinaista näillä main." Hän ei voinut tietää, '
      + 'että se pitäisi paikkansa vielä seuraavan vuosisadankin jälkeen.',
  },

  sarajevo: {
    kuvaus: 'Kävelykadulle on merkitty jalkakäytävään raja: toisella '
      + 'puolella ottomaanien basaari puukattoineen, toisella wieniläiset '
      + 'julkisivut. Astuin sen yli edestakaisin kuin lapsi. Kahvi '
      + 'tuotiin kuparipannussa ja sitä juodaan hitaasti — täällä kahvi '
      + 'on keskustelun mitta, ei virvoke.',
    nosto: 'Isoisä ei ehtinyt Sarajevoon. Sivun reunaan on kirjoitettu '
      + 'vain: "Bosniaan, jos aika riittää." Aika ei riittänyt, joten '
      + 'olen täällä hänen puolestaan.',
  },

  islanti: {
    kuvaus: 'Maasta nousi höyryä ilman että missään paloi mitään. Menin '
      + 'Þingvellirin rotkoon, jossa kaksi mannerlaattaa erkanee '
      + 'toisistaan pari senttiä vuodessa — ja jossa islantilaiset '
      + 'kokoontuivat käräjille jo vuonna 930. Seisoin kahden '
      + 'mannerlaatan välissä ja luin kylttiä ääneen.',
    nosto: 'Isoisä oli merkinnyt: "Saari, jossa on tulivuoria ja '
      + 'parlamentti. Kumpi on vanhempi, en tiedä." Parlamentti on '
      + 'vanhempi kuin Englannin — ja tulivuoret vanhempia kuin molemmat.',
  },

  edinburgh: {
    kuvaus: 'Edinburgh on kahdessa kerroksessa! Alhaalla uudenkaupungin '
              + 'suorat kadut, ylhäällä vanhankaupungin kujat, jotka putoavat '
              + 'Royal Milen kyljestä kuin ruodot kalasta. Kiipesin Arthur\'s '
              + 'Seatille, sammuneelle tulivuorelle keskellä kaupunkia, ja '
              + 'tuuli melkein kaatoi minut kumoon. Alhaalla kello löi yksi ja '
              + 'linnan muurilta pamahti tykki — minä hyppäsin ilmaan, eikä '
              + 'kukaan muu edes vilkaissut ylös.',
    nosto: 'Isoisä kirjoitti: "Tykki ammutaan kello yksi joka päivä paitsi '
             + 'sunnuntaisin, jotta Leithin laivoissa osataan asettaa kellot '
             + 'oikeaan aikaan." Sitä ammutaan yhä — vaikka nykyään aika on '
             + 'jokaisen taskussa.',
  },

  dublin: {
    kuvaus: 'Liffey halkaisee Dublinin, ja siltoja on niin tiheässä, etten '
              + 'ehtinyt laskea niitä. Georgian ajan talot ovat kaikki '
              + 'samanlaisia — tiiltä, kolme ikkunariviä, viuhkaikkuna oven '
              + 'päällä — mutta ovet on maalattu punaisiksi, sinisiksi ja '
              + 'keltaisiksi, eikä yksikään ole naapurinsa värinen. Illalla '
              + 'pubin nurkassa istui viulu, huilu ja rumpu. Kukaan ei '
              + 'ilmoittanut mitään: joku vain aloitti, ja muut tulivat '
              + 'perässä.',
    nosto: 'Isoisä kirjoitti: "Sackville Street on leveämpi kuin mikään '
             + 'katu, jonka olen nähnyt, ja sen keskellä seisoo Nelson '
             + 'pylväänsä nokassa." Katu on nyt O\'Connell Street ja pylvään '
             + 'paikalla kiiltää teräsneula — leveys on yhä sama 49 metriä.',
  },

  lissabon: {
    kuvaus: 'Nousin ratikkaan numero 28, ja se kiipesi Alfaman kujia niin '
              + 'ahtaasti, että olisin voinut koskettaa seiniä ikkunasta. '
              + 'Jarrut kirskuivat joka mutkassa. Ylhäällä koko kaupunki '
              + 'avautui kerralla: vaaleat talot, oranssit katot ja Tejo '
              + 'leveänä kuin meri. Jalkakäytävät ovat käsin ladottua '
              + 'kalkkikiveä, ja ne kiiltävät kuluneina kuin jää. Jostakin '
              + 'avoimesta ikkunasta lauloi joku fadoa, ja minä jäin seisomaan '
              + 'keskelle mäkeä kuuntelemaan.',
    nosto: 'Isoisä kirjoitti: "Kaupunki nousee seitsemälle kukkulalle, ja '
             + 'jokaiselta näkyy meri. Täältä lähdettiin aikoinaan etsimään '
             + 'reittiä Intiaan." Ratikka vei minut samalle kukkulalle, ja '
             + 'katsoin samaan suuntaan kuin hän.',
  },

  madrid: {
    kuvaus: 'Madridissa ilma on kuivaa ja kirkasta, ja aurinko paistaa kuin '
              + 'olisi lähempänä: kaupunki on 667 metriä merenpinnan '
              + 'yläpuolella, korkeammalla kuin yksikään toinen Euroopan '
              + 'unionin pääkaupunki. Kävelin Plaza Mayorille, jota kiertää '
              + 'yhtenäinen punainen talorivi ja 237 parveketta. Kello '
              + 'kymmeneltä illalla toreille tuli lisää ihmisiä eikä vähemmän — '
              + 'täällä päivä alkaa myöhään ja loppuu vielä myöhemmin.',
    nosto: 'Isoisä kirjoitti: "Madrid ei ole vanha kaupunki eikä sillä ole '
             + 'satamaa. Se on olemassa siksi, että kuningas sanoi niin." '
             + 'Kuningas oli Filip II ja päätös vuodelta 1561 — pääkaupunki '
             + 'Madrid on ollut siitä asti.',
  },

  barcelona: {
    kuvaus: 'Barcelonassa jokainen kadunkulma on viistetty vinoksi, joten '
              + 'joka risteyksessä avautuu pieni aukio. Kaupunki on suunniteltu '
              + 'tahallaan sellaiseksi. Kylttien tekstit ovat katalaaniksi — se '
              + 'on oma kielensä eikä espanjan murre, ja täällä sitä puhutaan '
              + 'kaupassa, koulussa ja kotona. Kävelin ruudukon läpi alaspäin, '
              + 'ja kadun päässä odotti Välimeri: keskustasta rannalle pääsee '
              + 'vartissa.',
    nosto: 'Isoisä kirjoitti: "Barcelonassa puhutaan kieltä, jota en osaa '
             + 'lukea kyltistä enkä sanakirjasta. Se ei ole espanjaa." Sata '
             + 'viisikymmentä vuotta myöhemmin katalaani on yhä oma kielensä, '
             + 'ja sitä puhuu äidinkielenään noin neljä miljoonaa ihmistä.',
  },

  amsterdam: {
    kuvaus: 'Amsterdamissa väistin pyörää ennen kuin ehdin nostaa laukkua '
              + 'maasta! Kanavan varrella talot nojaavat eteenpäin kuin '
              + 'kuuntelisivat, ja jokaisen harjalta törröttää koukku, jolla '
              + 'huonekalut nostetaan ikkunasta sisään. Vesi tuoksui sammalelta '
              + 'ja tuoreelta leivältä yhtä aikaa, jossain soi katu-urku, ja '
              + 'minä tajusin: koko kaupunki seisoo puupaalujen varassa '
              + 'pehmeässä suomaassa — eikä ole kaatunut vielä.',
    nosto: 'Isoisä kirjoitti 1873: "Hollantilaiset eivät jää odottamaan '
             + 'maata, he tekevät sitä itse." Haarlemmermeeren järvi oli '
             + 'silloin pumpattu kuivaksi. Nyt sen pohjalla on lentokenttä, '
             + 'runsaat kolme metriä merenpintaa alempana.',
  },

  berliini: {
    kuvaus: 'Berliinissä kävelin kadulla, jonka kiveyksessä kulkee '
              + 'kaksinkertainen mukulakivilinja. Seurasin sitä korttelin '
              + 'verran ennen kuin tajusin: siinä oli ollut muuri. Toisella '
              + 'puolella oli toinen maa. Nyt samassa kohdassa myydään makkaraa '
              + 'ja joku harjoittelee rullaluistelua kaiteen vieressä. '
              + 'Liikennevalossa vilkkui vihreä ukkeli, jolla on hattu päässä — '
              + 'se on idän oma ukkeli, ja se sai jäädä.',
    nosto: 'Isoisä kirjoitti 1873: "Berliini rakennetaan juuri nyt '
             + 'uudelleen, ja se aikoo olla suurempi kuin eilen." Ukko ei '
             + 'arvannut, kuinka monta kertaa kaupunki vielä rakennettaisiin '
             + 'uudelleen.',
  },

  wien: {
    kuvaus: 'Wienissä tilasin kahvin ja sain sen hopeatarjottimella — ja '
              + 'viereen lasin vettä, jota en ollut pyytänyt. Kukaan ei '
              + 'hoputtanut, vaikka istuin kaksi tuntia yhden kupin ja '
              + 'sanomalehden kanssa. Ulkona Ringstrassella raitiovaunu kaarsi '
              + 'oopperan ohi samaa kaarta kuin hevosvaunut isoisän aikaan, ja '
              + 'jostain avoimesta ikkunasta kuului joku harjoittelemassa '
              + 'valssia: sama tahti kolme kertaa peräkkäin, kunnes se meni '
              + 'oikein.',
    nosto: 'Isoisä kirjoitti 1873: "Keisari avasi tänään vesijohdon, joka '
             + 'tuo juomaveden vuorten lähteistä kaupunkiin ilman ainuttakaan '
             + 'pumppua." Join siitä hanasta tänään — vesi tulee yhä samaa '
             + 'reittiä, pelkän painovoiman voimalla.',
  },

  alpit: {
    kuvaus: 'Juna kiipesi rinnettä niin jyrkästi, että laukkuni liukui '
              + 'penkiltä lattialle. Ylhäällä ilma oli ohutta ja kylmää '
              + 'keskellä heinäkuuta, ja laakso näytti alhaalla kartalta: '
              + 'pellot, katto, katto, kirkko. Lehmänkellot kuuluivat kauan '
              + 'ennen kuin lehmät näkyivät. Sitten joku puhalsi alppitorveen '
              + 'vastapäisellä rinteellä — ääni tuli kilometrien takaa poikki '
              + 'koko laakson ja osui minuun kuin se olisi tarkoitettu juuri '
              + 'minulle.',
    nosto: 'Isoisä kirjoitti 1873: "Jäätikkö ulottuu melkein hotellin '
             + 'portaille asti. Opas sanoo sen liikkuvan, mutta minä en nähnyt '
             + 'sen liikkuvan." Sama jäätikkö on nyt vetäytynyt pari kilometriä '
             + 'ylöspäin — se liikkui sittenkin.',
  },

  praha: {
    kuvaus: 'Kävelin Kaarlensillan yli aamuvarhaisella, kun kolmekymmentä '
              + 'patsasta seisoi vielä usvassa eikä vastaan tullut ketään. '
              + 'Sitten Vanhankaupungin torilla kello löi täyden tunnin: luukut '
              + 'aukesivat, kaksitoista apostolia kulki ohi, kukko kiekui — ja '
              + 'koko aukio nosti katseensa yhtä aikaa. Kellon vanhin koneisto '
              + 'on vuodelta 1410, mutta apostolihahmot lisättiin vasta '
              + '1700-luvun lopun korjauksen jälkeen ja kiekuva kukko '
              + '1860-luvulla. Joen toisella puolella linna leviää mäen päällä '
              + 'kuin oma kaupunkinsa.',
    nosto: 'Isoisä kirjoitti: "Prahassa on silta, jolla myydään tavaraa, ja '
             + 'kello, joka näyttää auringon ja kuun paikan mutta ei kiirettä." '
             + 'Kello näyttää yhä samat asiat — ja minä myöhästyin sen takia '
             + 'raitiovaunusta.',
  },

  budapest: {
    kuvaus: 'Astuin Ketjusillalle Budan puolelta ja pysähdyin keskelle: '
              + 'vasemmalla parlamenttitalo kimalsi Tonavan rannassa, oikealla '
              + 'kaupunki jatkui kilometrikaupalla tasangolle. Illalla menin '
              + 'kylpylään, jossa vesi oli lämmintä kuin kylpyammeessa ja kaksi '
              + 'herraa pelasi shakkia altaan reunalla, vaikka ilta oli viileä '
              + 'ja hiuksista nousi höyryä. Kukaan ei pitänyt sitä sen '
              + 'oudompana kuin kahvinjuontia.',
    nosto: 'Isoisä sattui paikalle juuri sinä vuonna, kun kaupunki syntyi: '
             + '"Buda, Óbuda ja Pest yhdistettiin yhdeksi 17. marraskuuta, ja '
             + 'nimi on nyt Budapest. Kartantekijöille riittää töitä." Nimi '
             + 'kesti, ja kartat piirrettiin uusiksi.',
  },

  varsova: {
    kuvaus: 'Vanhankaupungin torilla kaikki näytti vanhalta: kapeat '
              + 'värikkäät talot, holvikäytävät, kaiverretut portit ja '
              + 'katukiveys, jonka yli hevoskärryt kolisivat. Sitten opas '
              + 'näytti kuvaa samasta paikasta vuodelta 1945 — pelkkää soraa ja '
              + 'seinänpätkiä. Koko kortteli on rakennettu uudelleen '
              + '1950-luvulla, ja mallina käytettiin 1700-luvun maalauksia. '
              + 'Kävelin saman aukion yli toiseen kertaan, paljon hitaammin.',
    nosto: 'Isoisä merkitsi muistiin: "Varsova on Venäjän keisarikunnan '
             + 'kaupunki, mutta kadulla puhutaan puolaa ja kirkoissa lauletaan '
             + 'puolaksi." Kaupunki on sen jälkeen ollut kahden miehityksen '
             + 'alla ja tuhottu lähes maan tasalle — ja puolaa puhutaan yhä.',
  },

  bukarest: {
    kuvaus: 'Bukarestissa käännyin pois isolta bulevardilta ja löysin heti '
              + 'kapean pihakadun, jossa kasvoi viiniköynnös ja grilliltä nousi '
              + 'savua. Mici — pieniä jauhelihamakkaroita ilman kuorta — '
              + 'myydään kymmenen kappaleen erissä ja sinappi tulee lautasen '
              + 'laitaan. Kolme korttelia myöhemmin seisoin taas leveän '
              + 'bulevardin varrella, jonka päässä kohoaa maailman painavin '
              + 'rakennus.',
    nosto: 'Isoisä kirjoitti Bukarestista: "Kadut valaistaan täällä '
             + 'petrolilampuin, tuhat kappaletta, ja sanotaan että ensimmäisenä '
             + 'maailmassa." Näin siitä kerrotaan: lamput syttyivät vuonna '
             + '1857, ja Bukarestia pidetään ensimmäisenä petrolilampuin '
             + 'valaistuna kaupunkina. Samalla syntyi uusi ammatti, '
             + 'lampunsytyttäjä.',
  },

  kiova: {
    kuvaus: 'Kiovassa laskeuduin liukuportaita, jotka eivät tuntuneet '
              + 'loppuvan: Arsenalnan asemalle on matkaa 105 metriä maan alle, '
              + 'ja portaita on kaksi peräkkäin. Ylhäällä odotti toinen maailma '
              + '— kastanjapuita, Dneprin leveä mutka ja Luolaluostarin '
              + 'kullatut kupolit rinteen päällä. Tässä kaupungissa on eletty '
              + 'yli tuhat vuotta, ja se kuuluu kadulla: ukrainaa, naurua, '
              + 'kahvikoneen sihinää. Kun ilmahälytys soi, ihmiset menevät '
              + 'metroasemalle suojaan ja palaavat, kun hälytys on ohi. Se '
              + 'kuuluu nyt kiovalaisten arkeen, vaikka kukaan ei ole siihen '
              + 'tottunut.',
    nosto: 'Isoisä kirjoitti Kiovassa: "Puutarhassa istui sokea laulaja '
             + 'bandura sylissään, ja koko seurue vaikeni kuin käskystä." '
             + 'Samana vuonna kaupungissa kuunneltiin kobzari Ostap Veresajta — '
             + 'ehkä ukko oli paikalla.',
  },

  odessa: {
    kuvaus: 'Odessassa nousin merestä kaupunkiin portaita pitkin: 192 '
              + 'askelmaa ja kymmenen tasannetta. Alhaalta katsoen tasanteet '
              + 'katoavat kokonaan näkyvistä, ja edessä on pelkkä loputon '
              + 'rappuvuori. Ylhäällä tuoksui akaasia ja paistettu kala, ja '
              + 'portaiden yläpäässä kaksi miestä neuvotteli hinnasta niin '
              + 'ääneen, että ohikulkijat jäivät kuuntelemaan. Meri on täällä '
              + 'aina kadun päässä. Vitsi on Odessassa oma lajinsa: kaupungin '
              + 'omista jutuista on koottu kirjoja, ja huhtikuun ensimmäisenä '
              + 'päivänä kaduilla vietetään Humorina-juhlaa.',
    nosto: 'Isoisä kirjoitti: "Odessassa puhutaan viittä kieltä yhdessä '
             + 'lauseessa ja kaupataan kaikkea, minkä laiva jaksaa kantaa." '
             + 'Satama on yhä täällä — ja vanhakaupunki päätyi 2023 Unescon '
             + 'maailmanperintöluetteloon ja samalla kertaa sen uhanalaisten '
             + 'listalle.',
  },

  moskova: {
    kuvaus: 'Punaisella torilla kivet kalskahtavat kengän alla, ja torin '
              + 'päässä seisoo Vasili Autuaan kirkko kuin kasa erivärisiä '
              + 'karkkeja. Kremlin muuri ei ole kiveä vaan punaista tiiltä — '
              + 'italialaiset mestarit muurasivat sen 1400-luvun lopulla, ja '
              + 'sitä riittää 2 235 metriä. Menin metroon ja unohdin nousta '
              + 'pois: asemat ovat marmoria, mosaiikkia ja kruunuja, ja juna '
              + 'tulee niin tiuhaan, ettei aikataulua tarvitse katsoa.',
    nosto: 'Isoisä kirjoitti: "Moskova on palanut poroksi useammin kuin '
             + 'kukaan muistaa, ja rakennettu joka kerta uudelleen entistä '
             + 'isommaksi." Kävelin muurin ympäri kokonaan — se vei puoli '
             + 'tuntia, eikä kaupunki loppunut siihen.',
  },

  pietari: {
    kuvaus: 'Pietarissa kesäyö ei pimene lainkaan: kello yksitoista illalla '
              + 'luin katukylttiä ilman lamppua. Neva on niin leveä, että '
              + 'toinen ranta näyttää eri kaupungilta, ja yöllä sillat nousevat '
              + 'pystyyn, jotta laivat pääsevät läpi — jos myöhästyt, jäät '
              + 'väärälle puolelle aamuun asti. Kaupunki rakennettiin suomaalle '
              + 'vuonna 1703, ja kadut ovat suoria kuin viivoittimella vedetyt. '
              + 'Palatsit ovat vaaleanvihreitä ja keltaisia kuin sokerikakkuja.',
    nosto: 'Isoisä kirjoitti: "Tämä kaupunki on rakennettu suolle, mutta se '
             + 'näyttää siltä kuin se olisi rakennettu marmorille." '
             + 'Talvipalatsin kellareissa asuu yhä kissoja — niitä määrättiin '
             + 'sinne jo vuonna 1745.',
  },

  tallinna: {
    kuvaus: 'Tallinna nousi merestä kuin satukirjan kuva: punaiset '
              + 'torninhatut, harmaat muurit ja Toompean kallio kaiken yllä. '
              + 'Porttiholvin takana katu kapeni, ja Raatihuoneentorilla '
              + 'tuoksuivat kuparipannussa paahdetut mantelit. Sitä tuoksua '
              + 'seurasin kolme korttelia.',
    nosto: 'Isoisä kirjoitti: "Revalissa laiva purki lastinsa aamulla, ja '
             + 'juna vei sen Pietariin ennen iltaa." Asema on yhä paikallaan '
             + '— nyt sen vieressä myydään villasukkia.',
  },

  riika: {
    kuvaus: 'Riiassa käänsin päätäni koko ajan: talojen seiniltä tuijottivat '
              + 'kivikasvot, leijonat ja pöllöt. Keskustorin suuret hallit '
              + 'kaartuivat pääni päällä kuin ylösalaisin käännetyt veneet, '
              + 'ja myyjä ojensi minulle palan tummaa ruisleipää kysymättä '
              + 'mitään.',
    nosto: 'Isoisä kirjoitti: "Riiassa lauloi tänään tuhat ihmistä yhtä '
             + 'aikaa latviaksi." Ne laulujuhlat pidetään yhä — tapa on '
             + 'jatkunut jo yli 150 vuotta.',
  },

  vilna: {
    kuvaus: 'Vilnassa jokaisen kadunmutkan takaa nousi esiin uusi '
              + 'barokkitorni. Kävelin Aamunportin ali — se on ainoa jäljellä '
              + 'yhdeksästä kaupunginportista — ja ohikulkijat nostivat '
              + 'hattuaan keskellä katua. Tässä kaupungissa eksyy mielellään.',
    nosto: 'Isoisä kirjoitti: "Täällä saa puhua liettuaa, mutta kirjoja ei '
             + 'saa painaa omilla kirjaimilla. Ne kannetaan rajan yli säkeissä '
             + 'yöllä." Kirjankantajilla on nykyään oma patsaansa.',
  },

  istanbul: {
    kuvaus: 'Istanbulissa astuin lautalle Euroopan puolella ja nousin '
              + 'maihin Aasiassa vartissa. Bosporinsalmi on kapeimmillaan vain '
              + 'seitsemänsataa metriä leveä, ja lokit lentävät lautan vieressä '
              + 'koko matkan, koska matkustajat heittävät niille palasia '
              + 'simit-rinkeleistä. Rannalla joku kaatoi teetä tulppaanin '
              + 'muotoiseen lasiin niin korkealta, että sain pisaran hihalleni. '
              + 'Kannella kuului kolme kieltä ja kaksi laivanpilliä, ja '
              + 'kaupunki jatkui molemmilla rannoilla niin kauas kuin näki.',
    nosto: 'Isoisä kirjoitti 1873: "Konstantinopolissa höyrylautta vie '
             + 'maanosasta toiseen muutamalla kolikolla. Halvempaa matkaa '
             + 'maailman toiselle puolelle ei ole." Lautta maksaa yhä vähemmän '
             + 'kuin lasi teetä.',
  },

  helsinki: {
    kuvaus: 'Laiva kaartoi Kauppatorin eteen, ja kaupunki nousi merestä '
              + 'vaaleana: keltaisia empiretaloja, vihreitä kupoleita ja '
              + 'Tuomiokirkon portaat kuin valkoinen vuori keskellä kaikkea. '
              + 'Torilla myytiin silakkaa ja mustikoita, hintoja huudettiin '
              + 'kahdella kielellä, ja lokki nappasi munkin suoraan viereisen '
              + 'miehen kädestä. Ilmassa oli suolaa ja paahdettua kahvia. '
              + 'Sitten raitiovaunu kilisi ohi, ja minä tiesin olevani perillä.',
    nosto: 'Isoisä kirjoitti 1873: "Helsinki on keisarikunnan siisteimpiä '
             + 'kaupunkeja — ja puhuu ruotsia." Ruotsi oli silloin enemmistön '
             + 'kieli. Nyt kadulla kuulee suomea, ruotsia, viroa, venäjää, '
             + 'somalia ja arabiaa.',
  },

  tukholma: {
    kuvaus: 'Tukholma alkoi vedestä. Juna nousi sillalle, ja alla oli merta '
              + 'joka suuntaan — kaupunki on rakennettu neljälletoista '
              + 'saarelle, ja niitä yhdistää 57 siltaa. Gamla stanissa kujat '
              + 'kapenivat niin, että kämmenet ylsivät molemmille seinille, ja '
              + 'sitten kulman takaa avautui satama täynnä valkoisia laivoja. '
              + 'Kello kolmen jälkeen kaikki katosivat sisätiloihin kahville, '
              + 'ja ilmassa tuoksui kaneli.',
    nosto: 'Isoisä kirjoitti 1873: "Tänä keväänä Oscar II kruunattiin '
             + 'Ruotsin kuninkaaksi ja kesällä vielä Norjankin. Kaksi maata, '
             + 'yksi mies." Unioni purettiin rauhanomaisesti 1905 — nyt '
             + 'kruunuja on kaksi eikä kumpikaan hallitse.',
  },

  oslo: {
    kuvaus: 'Vuono työntyi kaupungin sisään kuin sininen käytävä, ja laivan '
              + 'kannelta näkyi metsää joka suunnassa — Oslossa metsä alkaa '
              + 'siitä, mihin raitiovaunu loppuu. Karl Johans gatella soitti '
              + 'katumuusikko, ja kadun päässä seisoi kuninkaanlinna ilman '
              + 'aitaa ympärillään. Ostin kioskilta vohvelin, jonka väliin '
              + 'lastattiin ruskeaa juustoa. Se maistui suolaiselta '
              + 'karamellilta, ja söin toisenkin.',
    nosto: 'Isoisä kirjoitti 1873: "Kaupunki on nimeltään Christiania ja '
             + 'kuuluu Ruotsin kuninkaalle, vaikka jokainen täällä sanoo '
             + 'olevansa norjalainen." Nimi vaihtui Osloksi 1925, ja Norja oli '
             + 'silloin ollut itsenäinen kaksikymmentä vuotta.',
  },

  kobenhavn: {
    kuvaus: 'Kööpenhaminassa ensimmäinen ääni ei ollut auton töötti vaan '
              + 'polkupyörän kello. Pyöriä tuli sillan yli sadoittain omalla '
              + 'kaistallaan, ja jouduin odottamaan reunalla, kunnes virta '
              + 'katkesi. Nyhavnin varrella talot on maalattu keltaisiksi, '
              + 'punaisiksi ja vaaleansinisiksi, ja kanavan reunalla istutaan '
              + 'jalat roikkuen veden yllä. Ostin makkaran katuvaunusta ja söin '
              + 'sen seisaaltaan, kuten kaikki muutkin.',
    nosto: 'Isoisä kirjoitti 1873: "Tanska menetti yhdeksän vuotta sitten '
             + 'Saksalle kolmanneksen maastaan, ja silti täällä käydään illat '
             + 'huvipuistossa." Se huvipuisto on Tivoli, avattu 1843 — ja auki '
             + 'edelleen.',
  },

  lappi: {
    kuvaus: 'Inariin ei pääse junalla — Suomen pohjoisinkin rautatieasema '
              + 'jää satoja kilometrejä etelämmäksi. Ajoimme Rovaniemeltä neljä '
              + 'tuntia, ja jossain kohtaa metsä madaltui tunturiksi. Astuin '
              + 'ulos Inarissa: ilma tuoksui suopursulta ja sammuneelta '
              + 'nuotiolta, ja järvi oli niin iso, ettei toista rantaa näkynyt. '
              + 'Kello oli yksitoista illalla ja aurinko paistoi suoraan '
              + 'silmiin. Kaupan ovella puhuttiin kolmea kieltä, joista '
              + 'tunnistin yhden. Täällä ei ole kaupunkia — täällä on koko '
              + 'taivas.',
    nosto: 'Isoisän merkintä 1873: "Ivalojoen kaivannoilla tehdään '
             + 'yhdentoista tunnin päiviä, ja yö on niin valoisa, ettei kukaan '
             + 'muista lopettaa." Kello on nyt puoli yksi yöllä, ja minäkin '
             + 'unohdin.',
  },

  tromssa: {
    kuvaus: 'Laiva kääntyi salmeen, ja kaupunki tuli vastaan rinnettä '
              + 'pitkin: puutaloja, kirkontorni ja sillan kaari veden yli. '
              + 'Nousin laiturille keskellä kirkasta yötä — kello oli yksi, ja '
              + 'aurinko roikkui vuorten yllä kuin joku olisi unohtanut '
              + 'sammuttaa sen. Satamasta haisi suola ja koneöljy, kannella '
              + 'kolisivat tyhjät kalalaatikot, ja ohi pyöräili poika '
              + 't-paidassa. Täällä ei kesällä nukuta.',
    nosto: 'Isoisä kirjoitti 1873: "Tromssassa lastataan laivoja '
             + 'Jäämerelle, ja puodissa kuulee norjaa, suomea ja venäjää '
             + 'samassa lauseessa. Tätä sanotaan Pohjolan Pariisiksi." Nimi on '
             + 'yhä käytössä, ja satama on yhä täynnä.',
  },
};
