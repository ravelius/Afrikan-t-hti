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
};
