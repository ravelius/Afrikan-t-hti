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
