// Kaupungin elämää: taide-, ruoka- ja musiikkinostot Tutki-kortille
// (pilotti: Tanger ja Tripoli — omistajan päätös, laajennetaan jos malli
// toimii). Jokainen väite on tarkistettavissa; kuvat ovat Wikimedia
// Commonsista ja niiden lisenssi on varmistettu tiedostokohtaisesti.
//
// `kysymys` on tutustu ja vastaa -kokeilu: nostoihin tutustumalla
// kysymykseen osaa vastata, ja oikeasta vastauksesta saa pienen
// palkkion kerran per kaupunki (game.actionKulttuuri).
export const KULTTUURI_PALKKIO = 25;

export const AFRICA_KULTTUURI = {
  tanger: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Matisse maalasi Tangerissa',
        tiedosto: 'Henri Matisse, 1911-12, La Fenêtre à Tanger (Paysage vu d\'une fenêtre Landscape viewed from a window, Tangiers), oil on canvas, 115 x 80 cm, Pushkin Museum.jpg',
        teksti: 'Ranskalainen taidemaalari Henri Matisse asui Tangerissa talvina '
          + '1912–1913 ja maalasi hotellihuoneensa ikkunasta näkymän yli '
          + 'kaupungin — sininen "Ikkuna Tangerissa" kuuluu nykyään Moskovan '
          + 'Pushkin-museon aarteisiin.',
        lahde: 'Wikimedia Commons (PD)',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Minttutee',
        teksti: 'Vieraalle kaadetaan Marokossa lähes aina lasillinen makeaa '
          + 'minttuteetä. Tee kaadetaan korkealta, jotta pintaan syntyy '
          + 'vaahto — ja kieltäytymistä pidetään epäkohteliaana.',
      },
      {
        tyyppi: 'linkki',
        otsikko: 'Gnawa-musiikki',
        teksti: 'Marokon gnawa-perinteessä rautakastanjetit ja kolmikielinen '
          + 'guembri-luuttu vievät kuulijan transsiin asti — perinne on '
          + 'Unescon aineettoman kulttuuriperinnön listalla.',
        wiki: 'Gnawa',
      },
    ],
    kysymys: {
      q: 'Kuka kuuluisa taidemaalari työskenteli Tangerissa talvina 1912–1913?',
      options: ['Henri Matisse', 'Claude Monet', 'Pablo Picasso', 'Vincent van Gogh'],
      correct: 0,
      fact: 'Matisse maalasi Tangerissa kahtena talvena. Hotelli-ikkunan näkymä '
        + '"La Fenêtre à Tanger" on nähtävissä nostossa yllä.',
    },
  },
  tripoli: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Malouf-musiikki',
        tiedosto: 'Libyan Malouf.jpg',
        teksti: 'Malouf on Libyan perinnemusiikkia, jonka juuret ovat keskiajan '
          + 'Andalusiassa. Häissä ja juhlissa sitä esittää kokonainen yhtye '
          + 'lauluineen, luuttuineen ja rumpuineen.',
        lahde: 'Wikimedia Commons (CC BY 4.0)',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Tee ja paahdetut pähkinät',
        teksti: 'Libyalainen tee keitetään vahvaksi ja vaahtoavaksi ja juodaan '
          + 'pienistä laseista useampi kierros — viimeiseen lasiin lisätään '
          + 'usein paahdettuja maapähkinöitä tai manteleita.',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Bazin-pata',
        teksti: 'Juhlapöydän kunniaruoka on bazin: ohrataikinasta keitetty '
          + 'kiinteä kakku, jonka ympärille kaadetaan tulista lammas- ja '
          + 'tomaattikastiketta ja jota syödään yhdessä isolta vadilta.',
      },
    ],
    kysymys: {
      q: 'Mikä on malouf?',
      options: ['Libyan perinnemusiikkia', 'Aavikkotuulen nimi', 'Libyalainen teelaatu', 'Vanha karavaanireitti'],
      correct: 0,
      fact: 'Malouf kulkeutui Libyaan Andalusiasta ja soi yhä häissä ja '
        + 'juhlissa — kuva yhtyeestä on nostossa yllä.',
    },
  },
};
