/*
 * Tarinalliset kohtaamiset (omistajan toive 5.8.2026): "Etsi kätkö"
 * ei ole irrallinen tietovisa vaan kohtaaminen — kaupungissa on
 * nimetty paikallinen hahmo, jonka kautta aarretehtävä aukeaa.
 *
 * Rakenne per kaupunki (avain = kaupunki-id):
 *
 *   hahmo     — hahmon nimi (esim. laukun ja lokien riveille)
 *   nappi     — saapumiskortin napin teksti ("Etsi kätkö" tilalle)
 *   frame     — visakortin otsikkorivi ("<hahmo> ... ja kysyy")
 *   tervehdys — kohtaamisen avaus; kirjoitetaan kortille ennen
 *               kysymystä ENSIMMÄISELLÄ kerralla (ui muistaa session)
 *   loyto     — hahmon repliikki, kun kätköstä löytyy jotain
 *   tyhja     — repliikki, kun kätkö on tyhjä
 *   vaarin    — repliikki väärästä vastauksesta
 *
 * Tämä on esityskerros: pelimoottori ei tunne kohtaamisia, joten
 * vanhat tallennukset ja muut kaupungit toimivat ennallaan. Muut
 * kysymysmuodot (väittämä, valokuvaaja, tullimies, portti) pitävät
 * omat kehyshahmonsa — kohtaaminen koskee tavallista visaa.
 *
 * Kaupunki ilman riviä saa entisen satunnaisen kysyjän (ASKERS).
 */
export const KOHTAAMISET = {
  lontoo: {
    hahmo: 'jokietsijä Ned',
    nappi: 'Tapaa jokietsijä',
    frame: 'jokietsijä Ned pyyhkii mutaa käsistään ja kysyy',
    tervehdys: 'Laskuveden paljastamalla rantakaistalla London '
      + 'Bridgen alla kumara mies seuloo mutaa — jokietsijä, joka '
      + 'poimii Thamesista menneiden vuosisatojen esineitä. Hän '
      + 'näkee kirjasi ja suoristautuu: "Tuon kirjan omistajan '
      + 'nimikirjaimet minä tunnen. Löysin kerran liejusta '
      + 'messinkikompassin, jossa oli samat kirjaimet. Näytä että '
      + 'tunnet maailmaa kuten hän — niin kerron, mistä kohtaa '
      + 'rantaa se löytyi."',
    loyto: 'Ned kaivaa taskustaan mutaisen kompassin ja painaa sen '
      + 'käteesi: "Tämä kuuluu sinulle. Neula osoittaa yhä sinne, '
      + 'minne isoisäsi oli menossa."',
    tyhja: 'Ned seuloo kourallisen mutaa ja kohauttaa harteitaan: '
      + '"Joki antaa ja joki ottaa. Tänään se ei antanut — mutta '
      + 'laskuvesi tulee huomennakin."',
    vaarin: 'Ned palaa seulomiseen: "Ei vielä, kaveri. Joki ei '
      + 'luovuta salaisuuksiaan ensimmäisellä yrityksellä — eikä '
      + 'luovuta etsijäkään."',
  },
  kairo: {
    hahmo: 'kirjakauppias Faruk',
    nappi: 'Tapaa kirjakauppias',
    frame: 'kirjakauppias Faruk kohentaa lasejaan ja kysyy',
    tervehdys: 'Khan el-Khalilin kapeimmalla kujalla vanha kirjakauppias '
      + 'laskee teelasinsa ja tuijottaa kainalossasi olevaa kirjaa. '
      + '"Tuo kirja on käynyt tässä puodissa ennenkin — isäni myi sen '
      + 'omistajalle kartan, jota ei ollut muilla. Jos kannat sitä nyt, '
      + 'näytä että tunnet maailmaa kuten hän — sitten kerron, minne '
      + 'kartta hänet johti."',
    loyto: 'Faruk kääntää lyhdyn liekkiä suuremmalle ja levittää '
      + 'kellastuneen kartan tiskille: "Tässä. Isoisäsi merkitsi tämän '
      + 'itse — katso, mitä hän jätti sinulle."',
    tyhja: 'Faruk selaa hyllynsä kääröjä ja pudistaa päätään: "Joku on '
      + 'käynyt täällä ennen sinua. Mutta basaarissa mikään ei katoa '
      + 'lopullisesti — jatka etsimistä."',
    vaarin: 'Faruk sulkee kirjansa pehmeästi: "Ei vielä, ystäväni. '
      + 'Palaa, kun tunnet maailman paremmin — tee odottaa silloinkin."',
  },
  tukholma: {
    hahmo: 'höyrylaivan konemestari Elsa',
    nappi: 'Tapaa konemestari',
    frame: 'konemestari Elsa pyyhkii kätensä trasseliin ja kysyy',
    tervehdys: 'Strömkajenin laiturissa käy höyrylaiva, jonka koneet '
      + 'ovat vanhemmat kuin kukaan laivassa. Konehuoneen luukusta '
      + 'nousee nainen öljyisissä haalareissa, katsoo kirjaasi ja '
      + 'nyökkää hitaasti. "Tuon kirjan omistaja matkusti tällä '
      + 'laivalla ulos saaristoon. Isoisäni lapioi silloin hiiliä ja '
      + 'muisti hänet, koska hän kysyi koneesta enemmän kuin '
      + 'maisemasta. Näytä että tunnet maailmaa kuten hän — niin '
      + 'kerron, mihin saareen hän jäi."',
    loyto: 'Elsa hymyilee ja nostaa penkin alta pellisen '
      + 'öljykannun: "Tämä on ollut laivalla kauemmin kuin minä. '
      + 'Katso, mitä pohjaan on raapustettu — se odotti sinua."',
    tyhja: 'Elsa katsoo tyhjää lokeroa ja pudistaa päätään: "Joku '
      + 'on ehtinyt ensin. Meri liikuttaa tavaraa, ei vain vettä — '
      + 'tule takaisin, kun laiva palaa."',
    vaarin: 'Elsa naurahtaa ja kääntyy takaisin konehuoneen '
      + 'portaille: "Ei vielä. Koneen kanssa on sama juttu: opettele '
      + 'ensin, painele vasta sitten."',
  },
  madrid: {
    hahmo: 'kirpputorikauppias Rosa',
    nappi: 'Tapaa kirpputorikauppias',
    frame: 'kirpputorikauppias Rosa pyyhkii pölyt kämmeneensä ja kysyy',
    tervehdys: 'El Rastron sunnuntaisessa tungoksessa vanha nainen '
      + 'levittää tavaransa huovalle: kelloja, avaimia, postikortteja. '
      + 'Hän nostaa katseensa kirjaasi ja hymyilee. "Sen kirjan '
      + 'omistaja seisoi tässä samassa kohdassa. Osti äidiltäni '
      + 'messinkiavaimen eikä kertonut mihin oveen. Näytä että tunnet '
      + 'maailmaa kuten hän — niin kerron, mitä hän jätti tänne."',
    loyto: 'Rosa kaivaa huovan alta kuluneen postikortin ja ojentaa '
      + 'sen: "Tämä jäi tänne. Katso mitä kääntöpuolelle on '
      + 'kirjoitettu — se odotti sinua."',
    tyhja: 'Rosa kohauttaa harteitaan ja järjestää tavaroitaan '
      + 'uudelleen: "Joku ehti ennen sinua. Rastro tyhjenee ja täyttyy '
      + 'joka sunnuntai — tule takaisin."',
    vaarin: 'Rosa naurahtaa ja kääntyy seuraavan asiakkaan puoleen: '
      + '"Ei vielä, hija. Täällä ei ole kiire — palaa kun tiedät '
      + 'enemmän."',
  },
  venetsia: {
    hahmo: 'gondolieeri Matteo',
    nappi: 'Tapaa gondolieeri',
    frame: 'gondolieeri Matteo nojaa airoonsa ja kysyy',
    tervehdys: 'Rialton laiturilla harmaantunut gondolieeri huomaa '
      + 'kainalossasi kuluneen kirjan ja laskee aironsa. "Tunnen tuon '
      + 'kirjan. Isoisäni souti sen omistajaa halki laguunin ja puhui '
      + 'hänestä koko ikänsä. Jos kannat sitä, näytä että tunnet '
      + 'maailmaa kuten hän — sitten soudan sinut paikkaan, jota ei '
      + 'löydy kartoista."',
    loyto: 'Matteo ohjaa gondolin hiljaiselle syrjäkanavalle ja '
      + 'osoittaa airollaan: "Tässä. Isoisäsi jälki päättyy tähän — '
      + 'ja sinun alkaa."',
    tyhja: 'Matteo tutkii tyhjää kätköä ja hymähtää: "Joku ehti '
      + 'ensin. Mutta laguuni pitää monta salaisuutta — jatka '
      + 'matkaa."',
    vaarin: 'Matteo työntää gondolin takaisin virtaan: "Ei tänään, '
      + 'ystäväni. Palaa, kun tunnet maailman paremmin."',
  },
  berliini: {
    hahmo: 'posetiivari Otto',
    nappi: 'Tapaa posetiivari',
    frame: 'posetiivari Otto pysäyttää kammen ja kysyy',
    tervehdys: 'Hackescher Marktin kulmalla vanha mies veivaa '
      + 'posetiivia, jonka kylkeen on maalattu kadonneen Berliinin '
      + 'kattoja. Kampi pysähtyy, kun hän näkee kirjasi. "Isoisäni '
      + 'soitti tätä samaa laatikkoa Unter den Lindenillä, ja eräs '
      + 'matkalainen tuon kirjan kanssa kuunteli koko rullan loppuun '
      + 'ja kysyi sitten tietä. Näytä, että tunnet maailmaa kuten hän '
      + '— niin kerron, minne isoisäni häntä neuvoi."',
    loyto: 'Otto kääntää posetiivin taakse ja avaa pienen luukun, '
      + 'jossa säilytettiin nuottirullia: "Tämä on odottanut täällä '
      + 'kauan. Isoisäsi jätti sen soittajan haltuun — katso itse."',
    tyhja: 'Otto sulkee luukun ja kohauttaa harteitaan: "Tyhjä. Tämä '
      + 'kaupunki on purettu ja rakennettu niin monta kertaa, että '
      + 'kätköt vaihtavat paikkaa — jatka etsimistä."',
    vaarin: 'Otto tarttuu kampeen ja soitto jatkuu: "Ei vielä, nuori '
      + 'ystävä. Kuuntele maailmaa vähän kauemmin — laatikkokin oppi '
      + 'sävelensä rulla kerrallaan."',
  },
};
