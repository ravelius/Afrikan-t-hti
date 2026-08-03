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
    kuvaus: 'Marseillen sataman edustalla on pieni linnoitussaari nimeltä '
              + 'If. Sen tyrmästä pakeni Monte Criston kreivi — maailman '
              + 'kuuluisimmassa seikkailukirjassa. Vene kiersi saaren '
              + 'hitaasti, ja minä katsoin muureja ja mietin, mistä kohtaa '
              + 'minä olisin uinut.',
    nosto: 'Isoisä kirjoitti: "Kävin Ifin linnakkeessa. Vartija näytti '
             + 'kopin, josta kreivi pakeni — vaikka kreiviä ei ole ollut '
             + 'olemassakaan." Koppia näytetään yhä. Hyvä tarina voittaa '
             + 'aina.',
  },

  granada: {
    kuvaus: 'Alhambran palatsissa vesi on kaikkialla: se solisee pienissä '
              + 'kanavissa huoneesta toiseen, kokoontuu suihkulähteiksi ja '
              + 'jatkaa matkaansa. Rakentajat halusivat, että palatsi '
              + 'kuulostaa viileältä. Vuorilla sen takana oli lunta, vaikka '
              + 'oli kesäkuu.',
    nosto: 'Isoisä merkitsi sivun reunaan: "Maurien viimeinen kaupunki '
             + 'Euroopassa. Sen kauneuden edessä puheliaskin mies vaikenee." '
             + 'Vaikenin minäkin — ja kuuntelin vettä.',
  },

  krakova: {
    kuvaus: 'Krakovan suuren torin ylle soi joka tunti torvi, joka '
              + 'vaikenee kesken sävelen. Tarina kertoo vartijasta, joka '
              + 'varoitti kaupunkia vihollisesta ja soitti niin kauan kuin '
              + 'ehti. Soittaja lopettaa yhä samaan kohtaan — hänen '
              + 'kunniakseen.',
    nosto: 'Isoisä kirjoitti: "Kaupunki, jota ei ole poltettu — '
             + 'harvinaista näillä main." Hän ei voinut tietää, että se '
             + 'pitäisi paikkansa vielä seuraavankin vuosisadan.',
  },

  sarajevo: {
    kuvaus: 'Sarajevossa jalkakäytävään on merkitty viiva: toisella '
              + 'puolella ottomaanien basaari puukattoineen, toisella '
              + 'wieniläiset kivitalot. Astuin sen yli edestakaisin kuin '
              + 'taikarajan — idästä länteen ja takaisin yhdellä askeleella.',
    nosto: 'Isoisä ei ehtinyt Sarajevoon. Sivun reunassa lukee vain: '
             + '"Bosniaan, jos aika riittää." Aika ei riittänyt — joten '
             + 'seison tällä viivalla hänen puolestaan.',
  },

  islanti: {
    kuvaus: 'Islannissa maasta nousee höyryä, vaikka mikään ei pala. '
              + 'Seisoin Þingvellirin rotkossa, jossa kaksi mannerlaattaa '
              + 'vetäytyy erilleen pari senttiä vuodessa — toinen jalka '
              + 'Euroopan puolella, toinen Amerikan.',
    nosto: 'Isoisä merkitsi: "Saari, jossa on tulivuoria ja parlamentti. '
             + 'Kumpi on vanhempi, en tiedä." Parlamentti — se on '
             + 'kokoontunut vuodesta 930, kauemmin kuin mikään muu '
             + 'maailmassa.',
  },

  edinburgh: {
    kuvaus: 'Edinburghin linna seisoo sammuneen tulivuoren päällä '
              + 'keskellä kaupunkia. Kun kello löi yksi, muurilta pamahti '
              + 'tykki — minä hyppäsin ilmaan, eikä kukaan muu edes '
              + 'vilkaissut ylös.',
    nosto: 'Isoisä kirjoitti: "Tykki ammutaan kello yksi joka päivä, '
             + 'jotta sataman laivoissa osataan asettaa kellot oikeaan." '
             + 'Sitä ammutaan yhä — vaikka aika on nykyään jokaisen '
             + 'taskussa.',
  },

  dublin: {
    kuvaus: 'Dublinissa talot ovat kaikki samanlaisia — tiiltä ja kolme '
              + 'ikkunariviä — mutta ovet on maalattu punaisiksi, sinisiksi '
              + 'ja keltaisiksi, eikä yksikään ole naapurinsa värinen. '
              + 'Illalla pubin nurkassa joku aloitti sävelmän, ja viulu ja '
              + 'rumpu tulivat perässä itsestään.',
    nosto: 'Isoisä kirjoitti: "Pääkatu on leveämpi kuin mikään näkemäni, '
             + 'ja sen keskellä seisoo Nelson pylväänsä nokassa." Pylväs on '
             + 'poissa — sen paikalla kiiltää teräsneula, joka on korkeampi '
             + 'kuin yksikään talo.',
  },

  lissabon: {
    kuvaus: 'Nousin keltaiseen ratikkaan, ja se kiipesi Alfaman kujia '
              + 'niin ahtaita, että olisin ylettynyt koskettamaan seiniä '
              + 'ikkunasta. Ylhäällä koko kaupunki avautui kerralla: vaaleat '
              + 'talot, oranssit katot ja joki leveänä kuin meri.',
    nosto: 'Isoisä kirjoitti: "Kaupunki nousee seitsemälle kukkulalle, '
             + 'ja jokaiselta näkyy meri. Täältä lähdettiin aikoinaan '
             + 'etsimään reittiä Intiaan." Katsoin samaan suuntaan kuin hän '
             + '— ja ymmärsin lähtijöitä.',
  },

  madrid: {
    kuvaus: 'Madridissa kello kymmeneltä illalla toreille tuli lisää '
              + 'ihmisiä eikä vähemmän — lapset leikkivät aukiolla, kun minä '
              + 'jo haukottelin. Täällä päivä alkaa myöhään ja loppuu vielä '
              + 'myöhemmin, ja aurinko paistaa kuin olisi muita lähempänä.',
    nosto: 'Isoisä kirjoitti: "Madrid ei ole vanha kaupunki eikä sillä '
             + 'ole satamaa. Se on olemassa siksi, että kuningas sanoi '
             + 'niin." Kuninkaita ei enää totella samalla tavalla — mutta '
             + 'pääkaupunki pysyi.',
  },

  barcelona: {
    kuvaus: 'Barcelonassa on kirkko, jota on rakennettu lähes '
              + 'sataviisikymmentä vuotta, eikä se ole vieläkään valmis. '
              + 'Tornit näyttävät sulaneelta hiekkalinnalta, ja niiden '
              + 'väleissä kääntyilee nostureita. Sisällä pylväät haarautuvat '
              + 'kuin puut, ja valo tulee läpi kaikenvärisenä.',
    nosto: 'Isoisä ei maininnut kirkkoa sanallakaan — sen rakentamista '
             + 'ei ollut vielä aloitettu. Hän kirjoitti vain: "Täällä '
             + 'puhutaan kieltä, jota en osaa lukea kyltistä." Katalaania '
             + 'puhutaan yhä — ja kirkkoa rakennetaan yhä.',
  },

  amsterdam: {
    kuvaus: 'Amsterdamin talot nojaavat eteenpäin kuin kuuntelisivat, ja '
              + 'jokaisen harjalla törröttää koukku, jolla huonekalut '
              + 'nostetaan ikkunasta sisään — portaat ovat liian kapeat. Koko '
              + 'kaupunki seisoo puupaalujen varassa pehmeässä maassa, eikä '
              + 'ole kaatunut vielä.',
    nosto: 'Isoisä kirjoitti: "Hollantilaiset eivät jää odottamaan maata '
             + '— he tekevät sitä itse." Hänen aikanaan kokonainen järvi '
             + 'pumpattiin kuivaksi. Nyt sen pohjalla on lentokenttä.',
  },

  berliini: {
    kuvaus: 'Berliinissä kadun kiveyksessä kulkee kaksinkertainen '
              + 'mukulakivilinja. Seurasin sitä korttelin verran ennen kuin '
              + 'tajusin: siinä oli ollut muuri, ja toisella puolella oli '
              + 'toinen maa. Nyt samassa kohdassa myydään makkaraa ja '
              + 'harjoitellaan rullaluistelua.',
    nosto: 'Isoisä kirjoitti: "Berliini rakennetaan juuri nyt uudelleen, '
             + 'ja se aikoo olla suurempi kuin eilen." Hän ei arvannut, '
             + 'kuinka monta kertaa kaupunki vielä rakennettaisiin '
             + 'uudelleen.',
  },

  wien: {
    kuvaus: 'Wienissä tilasin kaakaon ja sain sen hopeatarjottimella, '
              + 'vierellä lasi vettä, jota en ollut pyytänyt. Kukaan ei '
              + 'hoputtanut, vaikka istuin kaksi tuntia. Jostain ikkunasta '
              + 'kuului valssiharjoitus: sama tahti kolmesti, kunnes se meni '
              + 'oikein.',
    nosto: 'Isoisä kirjoitti: "Keisari avasi tänään vesijohdon, joka tuo '
             + 'juomaveden vuorilta kaupunkiin ilman ainuttakaan pumppua." '
             + 'Join siitä hanasta tänään — vesi kulkee yhä samaa reittiä '
             + 'omalla painollaan.',
  },

  alpit: {
    kuvaus: 'Juna kiipesi rinnettä niin jyrkästi, että laukkuni liukui '
              + 'lattialle, ja ylhäällä ilma oli kylmää keskellä heinäkuuta. '
              + 'Vastapäiseltä rinteeltä joku puhalsi alppitorveen — ääni '
              + 'ylitti koko laakson ja osui minuun kuin tarkoitettuna.',
    nosto: 'Isoisä kirjoitti: "Jäätikkö ulottuu melkein hotellin '
             + 'portaille. Opas sanoo sen liikkuvan, mutta minä en nähnyt." '
             + 'Sama jäätikkö on nyt vetäytynyt kilometrien päähän — se '
             + 'liikkui sittenkin.',
  },

  praha: {
    kuvaus: 'Prahan Vanhankaupungin torilla kello löi täyden tunnin: '
              + 'luukut aukesivat, kaksitoista apostolia kulki ohi ja kukko '
              + 'kiekui. Koko aukio nosti katseensa yhtä aikaa — kellolle, '
              + 'joka on jauhanut aikaa yli kuusisataa vuotta.',
    nosto: 'Isoisä kirjoitti: "Prahassa on kello, joka näyttää auringon '
             + 'ja kuun paikan mutta ei kiirettä." Se näyttää yhä samat '
             + 'asiat — ja minä myöhästyin sen takia raitiovaunusta.',
  },

  budapest: {
    kuvaus: 'Budapestissa menin illalla kylpylään: vesi oli lämmintä kuin '
              + 'ammeessa, hiuksista nousi höyryä, ja kaksi herraa pelasi '
              + 'shakkia altaan reunalla ulkoilmassa. Kukaan ei pitänyt sitä '
              + 'sen kummempana kuin kahvinjuontia.',
    nosto: 'Isoisä sattui paikalle juuri sinä vuonna, kun kaupunki '
             + 'syntyi: "Buda, Óbuda ja Pest yhdistettiin yhdeksi, ja nimi '
             + 'on nyt Budapest. Kartantekijöille riittää töitä." Nimi kesti '
             + '— kartat piirrettiin uusiksi.',
  },

  varsova: {
    kuvaus: 'Varsovan vanhallakaupungilla kaikki näytti sadan vuoden '
              + 'takaiselta, kunnes opas näytti valokuvaa samasta paikasta '
              + 'sodan jälkeen: pelkkää soraa. Koko kortteli on rakennettu '
              + 'uudelleen, ja mallina käytettiin vanhoja maalauksia. Kävelin '
              + 'aukion yli uudestaan, paljon hitaammin.',
    nosto: 'Isoisä merkitsi: "Kadulla puhutaan puolaa ja kirkoissa '
             + 'lauletaan puolaksi, vaikka keisari hallitsee." Kaupunki '
             + 'ehdittiin tuhota lähes maan tasalle — ja puolaa puhutaan '
             + 'yhä.',
  },

  bukarest: {
    kuvaus: 'Bukarestissa käännyin pois leveältä bulevardilta ja löysin '
              + 'pihakadun, jossa kasvoi viiniköynnös ja grilliltä nousi '
              + 'savua. Kolme korttelia myöhemmin edessä kohosi rakennus, '
              + 'joka on maailman painavin — niin suuri, että sitä on vaikea '
              + 'katsoa kerralla.',
    nosto: 'Isoisä kirjoitti: "Kadut valaistaan täällä petrolilampuin, '
             + 'tuhat kappaletta — ensimmäisenä maailmassa, niin täällä '
             + 'sanotaan." Lamppujen sytyttäjä oli silloin kokonainen '
             + 'ammatti. Nyt valot syttyvät itsestään.',
  },

  kiova: {
    kuvaus: 'Kiovassa laskeuduin liukuportaita, jotka eivät tuntuneet '
              + 'loppuvan — metroasema on syvemmällä kuin yksikään muu '
              + 'maailmassa. Ylhäällä odottivat kastanjapuut ja luostarin '
              + 'kullatut kupolit. Kun ilmahälytys soi, ihmiset laskeutuvat '
              + 'samat portaat suojaan — ja palaavat, kun se on ohi.',
    nosto: 'Isoisä kirjoitti: "Puutarhassa istui sokea laulaja bandura '
             + 'sylissään, ja koko seurue vaikeni kuin käskystä." Kiovassa '
             + 'lauletaan yhä — eikä se vaikene käskystä.',
  },

  odessa: {
    kuvaus: 'Odessassa nousin merestä kaupunkiin pitkin portaita, joissa '
              + 'on melkein kaksisataa askelmaa. Alhaalta katsoen näkyvät '
              + 'vain portaat, loputtomana vuorena — ylhäältä taas pelkät '
              + 'tasanteet, ei portaita lainkaan. Ylhäällä tuoksui akaasia ja '
              + 'paistettu kala.',
    nosto: 'Isoisä kirjoitti: "Odessassa puhutaan viittä kieltä yhdessä '
             + 'lauseessa ja kaupataan kaikkea, minkä laiva jaksaa kantaa." '
             + 'Portaat ovat samat — ja meri on yhä kadun päässä.',
  },

  moskova: {
    kuvaus: 'Punaisella torilla seisoo Vasili Autuaan kirkko kuin kasa '
              + 'erivärisiä karkkeja — jokainen sipulikupoli on erilainen. '
              + 'Menin metroon ja unohdin nousta pois: asemat ovat marmoria '
              + 'ja mosaiikkia kuin palatsin salit maan alla.',
    nosto: 'Isoisä kirjoitti: "Moskova on palanut poroksi useammin kuin '
             + 'kukaan muistaa, ja rakennettu joka kerta uudelleen entistä '
             + 'isommaksi." Kiersin Kremlin muurin ympäri puolessa tunnissa '
             + '— kaupunki jatkui joka suuntaan.',
  },

  pietari: {
    kuvaus: 'Pietarin kesäyö ei pimene lainkaan: luin katukylttiä '
              + 'keskiyöllä ilman lamppua. Yöllä Nevan sillat nousevat '
              + 'pystyyn, jotta laivat pääsevät läpi — jos myöhästyt, jäät '
              + 'väärälle rannalle aamuun asti. Jäin katsomaan, kun silta '
              + 'aukesi kuin portti.',
    nosto: 'Isoisä kirjoitti: "Tämä kaupunki on rakennettu suolle, mutta '
             + 'se näyttää siltä kuin se olisi rakennettu marmorille." Suo '
             + 'ei näy vieläkään — palatsit ovat keltaisia ja vihreitä kuin '
             + 'sokerikakut.',
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
    kuvaus: 'Istanbulissa astuin lautalle Euroopassa ja nousin maihin '
              + 'Aasiassa vartissa. Lokit lensivät lautan vierellä koko '
              + 'matkan, koska matkustajat heittivät niille palasia '
              + 'simit-rinkeleistä — ja kaupunki jatkui molemmilla rannoilla '
              + 'niin kauas kuin näki.',
    nosto: 'Isoisä kirjoitti: "Konstantinopolissa höyrylautta vie '
             + 'maanosasta toiseen muutamalla kolikolla. Halvempaa matkaa '
             + 'maailman toiselle puolelle ei ole." Lautta maksaa yhä '
             + 'vähemmän kuin lasi teetä.',
  },

  helsinki: {
    kuvaus: 'Helsinki ei noussut merestä kerralla vaan pala palalta: ensin '
              + 'paljas luoto, sitten graniittiranta ja lopulta Tuomiokirkko '
              + 'valkoisena kaiken yllä. Laiva pujotteli Suomenlinnan saarten '
              + 'välistä satamaan, ja Kauppatorilla lokit väijyivät '
              + 'saalistaan.',
    nosto: 'Isoisä kirjoitti: "Helsingfors on nuori pääkaupunki, joka '
             + 'näyttää mereltä suuremmalta kuin maalta. Valkoinen kirkko '
             + 'seisoo sen yllä kuin keisarin allekirjoitus." Keisari on '
             + 'poissa — kirkko seisoo paikallaan.',
  },

  tukholma: {
    kuvaus: 'Tukholma on rakennettu neljälletoista saarelle, ja sen huomaa '
              + 'heti: joka kadun päässä välkkyi vesi, ja sillat jatkoivat '
              + 'katuja saarelta toiselle. Gamla stanin kujilla kämmenet '
              + 'ylsivät molemmille seinille, ja ilmassa tuoksui kaneli.',
    nosto: 'Isoisä kirjoitti: "Tänä keväänä Oscar II kruunattiin Ruotsin '
             + 'kuninkaaksi ja kesällä vielä Norjankin. Kaksi maata, yksi '
             + 'mies." Nyt kruunuja on kaksi eikä kumpikaan hallitse.',
  },

  oslo: {
    kuvaus: 'Isoisän kartassa ei ole Osloa — tämän kaupungin kohdalla lukee '
              + 'Christiania. Vuono toi laivan suoraan keskustaan, ja metsä '
              + 'alkoi siitä, mihin raitiovaunu loppui. Ostin kioskilta '
              + 'vohvelin, jonka väliin lastattiin ruskeaa juustoa. Se maistui '
              + 'suolaiselta karamellilta — söin toisenkin.',
    nosto: 'Isoisä kirjoitti: "Christiania kuuluu Ruotsin kuninkaalle, '
             + 'vaikka jokainen täällä sanoo olevansa norjalainen." He olivat '
             + 'oikeassa: Norja itsenäistyi, ja kaupunki otti takaisin oman '
             + 'vanhan nimensä.',
  },

  kobenhavn: {
    kuvaus: 'Kööpenhaminan ensimmäinen ääni ei ollut auto vaan polkupyörän '
              + 'kello — pyöriä tuli sillan yli sadoittain, ja odotin '
              + 'reunalla, kunnes virta katkesi. Illalla keskellä kaupunkia '
              + 'aukesi portti puutarhaan, jossa paloi tuhansia lyhtyjä ja '
              + 'karuselli soi.',
    nosto: 'Isoisä kirjoitti: "Tanska menetti sodassa kolmanneksen '
             + 'maastaan, ja silti täällä käydään illat huvipuistossa." Se '
             + 'puisto on Tivoli — sama, jonka portista minäkin kävelin '
             + 'sisään.',
  },

  lappi: {
    kuvaus: 'Inariin ei pääse junalla — ajoimme neljä tuntia, ja jossain '
              + 'kohtaa metsä madaltui tunturiksi. Järvi oli niin iso, ettei '
              + 'toista rantaa näkynyt, ja kaupan ovella puhuttiin kolmea '
              + 'kieltä, joista tunnistin yhden. Täällä ei ole kaupunkia — '
              + 'täällä on koko taivas.',
    nosto: 'Isoisä kirjoitti: "Ivalojoen kultakaivannoilla tehdään '
             + 'pitkiä päiviä, ja yö on niin valoisa, ettei kukaan muista '
             + 'lopettaa." Kello on nyt puoli yksi yöllä — ja minäkin '
             + 'unohdin.',
  },

  tromssa: {
    kuvaus: 'Nousin laiturille keskellä kirkasta yötä: kello oli yksi, ja '
              + 'aurinko roikkui vuorten yllä kuin joku olisi unohtanut '
              + 'sammuttaa sen. Satamassa kolisivat tyhjät kalalaatikot, ja '
              + 'ohi pyöräili poika t-paidassa. Täällä ei kesällä nukuta.',
    nosto: 'Isoisä kirjoitti: "Tromssan puodissa kuulee norjaa, suomea ja '
             + 'venäjää samassa lauseessa. Tätä sanotaan Pohjolan Pariisiksi." '
             + 'Nimi on käytössä yhä.',
  },
};
