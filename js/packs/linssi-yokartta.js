// Yön kartta: maailma valoissa. Kuvan polku ja sen paikka laudalla.
//
// TÄMÄ TIEDOSTO ON KONEEN KIRJOITTAMA. Älä muokkaa käsin:
//   node tools/hae-yonkartta.mjs
//
// Aineisto: NASA Earth Observatory / Visible Earth: Earth at Night (Black
//           Marble) 2016, värikartta 3 km (13500 x 6750, tasakulmainen)
// Mittari:  Suomi NPP -satelliitin VIIRS, day–night band; vuoden 2016
//           pilvettömien öiden koonti
// Viite:    NASA Goddard Space Flight Center. Tutkija Miguel Román
//           (NASA/GSFC), kuvankäsittely Joshua Stevens (SSAI); julkaistu
//           25.4.2017.
// Haettu:   2026-08-03 osoitteesta
//           https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144898/BlackMarble_2016_3km.jpg
//           Tietue https://visibleearth.nasa.gov/images/144898/earth-at-night-black-marble-2016-color-maps
//           ohjaa nykyään NASAn uudistetulle sivustolle; tekijätiedot on
//           vahvistettu osoitteesta https://svs.gsfc.nasa.gov/30876/
// Lisenssi: Public domain — NASAn kuva-aineisto ei ole Yhdysvalloissa
//           tekijänoikeuden alaista ("NASA content ... generally are not
//           subject to copyright in the United States"). Ehtona on
//           lähteen mainitseminen, ei lupaa; ks.
//           https://www.nasa.gov/nasa-brand-center/images-and-media/
//
// TÄSSÄ TIEDOSTOSSA EI OLE KUVAA vaan sen polku. Kuva on binääri ja
// asuu assets-kansiossa: assets/linssit/yokartta.jpg (421 kt).
// Yhden tiedoston versio (dist/matkakirja.html) ei siis saa tätä
// linssiä mukaansa — se on tarkoituksellinen raja, sillä kuvan
// upottaminen base64:nä kasvattaisi paketin lähes megatavulla.
//
// --- mihin kuva laudalla osuu ---
//
// Kuva on projisoitu tasakulmaisesta Milleriin samalla sovituksella kuin
// lauta itse (tools/vanha-maailma.mjs, sovitaMaailma). Se peittää laudan
// TARKALLEEN: vasen reuna x=0, oikea x=12000, ylin y=0, alin y=5399.
// Piirtäjän ei siis tarvitse laskea asteita lainkaan — kuva venytetään
// suoraan raja-suorakulmioon.
//
// Kartta kiertää ympäri, joten kuva on toistettava laudan molemmin
// puolin samoin kuin rannikot: kuvan oikea reuna jatkuu vasempaan
// saumattomasti, koska molemmat ovat samaa pituusastetta -175°.
//
// --- mitä kuvassa EI ole ---
//
// Lauta ulottuu -58°:sta 76°:seen, joten Etelämanner ja pohjoisin
// arktinen alue jäävät kuvan ulkopuolelle. Ne eivät ole kadonneet
// aineistosta vaan laudalta.
//
// --- mitä valot mittaavat ---
//
// VIIRSin day–night band mittaa yöllä ylöspäin karkaavaa näkyvää valoa.
// Se ei ole väkiluku eikä vauraus, vaikka korreloi molempien kanssa:
// kirkkaimmat pisteet maailmassa ovat kaasusoihtuja Persianlahdella,
// Siperiassa ja Pohjois-Dakotassa, missä asuu tuskin ketään. Sama toisin
// päin — tiheään asuttu maaseutu Intiassa ja Nigeriassa näkyy himmeänä,
// koska sähköä on vähän. Kuva kertoo missä poltetaan valoa, ei missä
// asutaan.
//
// Koonti on vuodelta 2016 eikä yhdeltä yöltä: pilvet, kuutamo, revontulet
// ja tulipalot on suodatettu pois monen kuukauden havainnoista.

export const YOKARTTA = {
  kuva: 'assets/linssit/yokartta.jpg',

  // Kuvan omat mitat pikseleinä. Piirtäjä ei tarvitse näitä venytykseen
  // (raja riittää), mutta esilataus ja mittasuhteen tarkistus tarvitsevat.
  leveysPx: 2400,
  korkeusPx: 1080,

  // Kuvan paikka laudan koordinaatteina. Peittää laudan kokonaan.
  raja: { x: 0, y: 0, leveys: 12000, korkeus: 5399 },

  // Kuva jatkuu reunan yli itseensä, kuten lauta.
  kiertava: true,

  // Rajaus asteina — sama kuin laudalla. Tämä on tarkistusta ja
  // kuvatekstejä varten, ei piirtoa.
  rajaus: { lon0: -175, etela: -58, pohjoinen: 76 },

  otsikko: 'Yön kartta: maailma valoissa',
  kuvaus: 'Maapallon yövalot Suomi NPP -satelliitin VIIRS-mittarin '
    + 'koonnista vuodelta 2016. Kirkkaus on ylöspäin karkaavaa valoa, '
    + 'ei väkilukua: kaasusoihdut loistavat autiomaassa ja tiheään '
    + 'asuttu maaseutu jää himmeäksi.',

  lahde: {
    aineisto: 'NASA Earth Observatory / Visible Earth: Earth at Night (Black Marble) 2016, värikartta 3 km (13500 x 6750, tasakulmainen)',
    mittari: 'Suomi NPP -satelliitin VIIRS, day–night band; vuoden 2016 pilvettömien öiden koonti',
    tekijat: 'NASA Goddard Space Flight Center. Tutkija Miguel Román (NASA/GSFC), kuvankäsittely Joshua Stevens (SSAI); julkaistu 25.4.2017.',
    osoite: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144898/BlackMarble_2016_3km.jpg',
    tietue: 'https://visibleearth.nasa.gov/images/144898/earth-at-night-black-marble-2016-color-maps',
    studio: 'https://svs.gsfc.nasa.gov/30876/',
    haettu: '2026-08-03',
  },

  lisenssi: {
    nimi: 'Public domain (Yhdysvaltain liittovaltion virasto)',
    ehto: 'Lähteen maininta: NASA / Suomi NPP VIIRS.',
    osoite: 'https://www.nasa.gov/nasa-brand-center/images-and-media/',
  },
};
