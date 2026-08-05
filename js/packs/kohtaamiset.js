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
};
