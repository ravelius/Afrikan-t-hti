/*
 * VERTAILULINSSI — varuste, joka avaa vapaan maavertailun
 * "Maa numeroina" -sivulla (docs/valtion-analyysi.md).
 *
 * Ilman varustetta vertailu on aina Suomi: jokaisessa käyrässä kulkee
 * himmeä Suomi-viiva. Tämä varuste tuo valinnan vapauden — pelaaja
 * asettaa minkä tahansa toisen maan samoille asteikoille, ja Suomi
 * säilyy kolmantena viivana.
 *
 * Linssi EI piirrä karttakerrosta (kerros: false, kuten radio):
 * varsinainen toiminto asuu tilastosivulla, jonka piirtää
 * js/maakayrat.js. Sivu kysyy OMISTUSTA (js/linssit/omistus.js), ei
 * päälläoloa — lehteä luetaan eri näkymässä kuin karttaa, eikä
 * pelaajan tarvitse käydä sytyttämässä linssiä kartalla ennen lehden
 * avaamista. Valikossa linssi näkyy silti muiden varusteiden tavoin,
 * ja sen kuvaus kertoo missä se toimii.
 *
 * Löytyminen noudattaa varusteiden yleistä mallia: manner: null
 * rekisterissä tarkoittaa, että linssi ansaitaan kokemuspisteillä
 * (js/linssit/omistus.js, LINSSIKYNNYKSET) — tämä suunnitelman
 * mukaisesti, joka ei lukitse löytymistä eikä hintaa erikseen.
 */

export const LINSSI = {
  tunnus: 'vertailu',
  jarjestys: 90,
  kerros: false,

  nimi: 'Vertailulinssi',
  lyhyt: 'Aseta Maa numeroina -sivulla kaksi maata rinnakkain samoille asteikoille.',
  // Kaksi käyrää samassa kehyksessä ja yhteinen pohjaviiva.
  ikoni: '<path d="M3 19.2h18"/>'
    + '<path d="M3 16.4c4.4-1.2 8.2-5.6 13-11.2"/>'
    + '<path d="M3 12.6c4.8 2.2 10.4 1.6 15.4-3.4"/>',
  valokuva: false,

  // Tilastosivu on jokaisella laudalla, jolla kaupungeilla on
  // maatunnus — linssi kulkee siis kaikkialla mukana.
  laudat: ['*'],

  lahde: {
    aineisto: 'Maailmanpankki (World Development Indicators) ja UN World Population Prospects 2024',
    lisenssi: 'CC BY 4.0 / CC BY 3.0 IGO',
    osoite: 'https://data.worldbank.org/',
    haettu: '2026-08-06',
  },
};
