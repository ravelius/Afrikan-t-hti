/*
 * Kaupunkikartan kohteiden omat nähtävyysjutut, avaimistettu
 * kaupungin id:llä ja sitten kohteen nimellä (täsmälleen sama nimi
 * kuin js/packs/maakartat.js KAUPUNKIKARTAT[kaupunki].kohteet[i].nimi).
 * js/ui.js piirraKaupunkiKartta yhdistää tämän kartan kohdeolioon
 * ajonaikaisesti, joten karttadataa (maakartat.js: koordinaatit,
 * kaupunkijulisteet, wiki-viitteet) ei tarvitse koskea uusia juttuja
 * lisättäessä.
 *
 * Rakenne on Lontoon malli (maakartat.js, Opuksen v350), mutta ilman
 * `wiki`-kenttää: omistajan spesifikaatio 8.8.2026 haluaa lähderiviksi
 * pelkän "Wikipedia"-maininnan, ei "Lue lisää" -linkkiä artikkeliin.
 * Tekstit ovat oma tiivis suomenkielinen kooste englanninkielisestä
 * Wikipediasta, ei käännös.
 *
 * Mitta on tarkoituksella lyhyt (omistajan korjaus 8.8.2026 Berliinin
 * pilotin jälkeen: "tämä on tarkoitettu lyhyeksi pop-up-lukuelämykseksi"):
 * 2-3 kappaletta ja yksi kuva per juttu, useampi kuva (max 2-3) vain kun
 * aihe kantaa sen. Hyvät lainaukset (Reagan, Reuter, Vrubel) säilyvät.
 */

export const NAHTAVYYSJUTUT = {
  berliini: {
    Valtiopäivätalo: {
      aika: '1894',
      teksti: 'Valtiopäivätalon suunnitteli arkkitehti Paul Wallot, ja se '
          + 'valmistui 1894. Se on 47 metriä korkea, ja kattoa koristi '
          + 'alun perin teräksestä ja lasista tehty kupoli — aikansa '
          + 'insinööritaidon näyte.'
        + '\n\n'
        + '27. helmikuuta 1933 rakennus paloi, ja Hitler käytti paloa '
          + 'tekosyynä kansalaisoikeuksien kaventamiseen. Toisessa '
          + 'maailmansodassa talo raunioitui, ja toukokuussa 1945 '
          + 'neuvostosotilaat pystyttivät katolle lipun kuuluisassa '
          + 'valokuvassa.'
        + '\n\n'
        + 'Sodan jälkeen talo seisoi tyhjänä Länsi-Berliinissä koko '
          + 'kylmän sodan ajan, kunnes Saksa yhdistyi 1990. Uusi '
          + 'lasikupoli nousi 1990-luvulla arkkitehti Norman Fosterin '
          + 'suunnitelmien mukaan: sen läpi näkee suoraan alla istuvien '
          + 'kansanedustajien saliin.',
      lainaus: {
        teksti: 'Ihr Völker der Welt … schaut auf diese Stadt! — Te '
          + 'maailman kansat … katsokaa tätä kaupunkia!',
        lahde: 'Pormestari Ernst Reuter yli 300 000 berliiniläiselle talon '
          + 'edustalla 9. syyskuuta 1948, kun Neuvostoliitto oli katkaissut '
          + 'tiet Länsi-Berliiniin',
      },
      kuvat: [
        {
          tiedosto: 'Reichstag building Berlin view from west before sunset.jpg',
          selite: 'Valtiopäivätalon länsijulkisivu ilta-auringossa, '
            + 'lasikupoli pylväikön yllä.',
          lahde: 'Jürgen Matern, Wikimedia Commons (CC BY-SA 3.0)',
        },
        {
          tiedosto: 'Raising a flag over the Reichstag - Restoration.jpg',
          selite: 'Neuvostosotilas pystyttää lippua raunioituneen talon '
            + 'katolle toukokuussa 1945.',
          lahde: 'Jevgeni Haldei, Wikimedia Commons (PD)',
        },
      ],
      lahde: 'Wikipedia',
    },
    'Brandenburgin portti': {
      aika: '1791',
      teksti: 'Portin suunnitteli arkkitehti Carl Gotthard Langhans, ja se '
          + 'rakennettiin 1788–1791 antiikin temppelien malliin. Harjalla '
          + 'seisoo pronssinen kvadriga, jonka Napoleon vei sotasaaliina '
          + 'Pariisiin 1806 — se palautettiin vasta 1814.'
        + '\n\n'
        + 'Kun Berliinin muuri nousi 1961, se kulki juuri portin ohi ja '
          + 'sulki koko alueen. Portti seisoi lähes 30 vuotta tyhjän '
          + 'kaistaleen keskellä, kunnes muuri avautui marraskuussa '
          + '1989.'
        + '\n\n'
        + 'Nykyään portti on Saksan tunnetuin yhtenäisyyden symboli, ja '
          + 'sen ympärillä oleva Pariser Platz on autoton kävelyalue.',
      lainaus: {
        teksti: 'Mr. Gorbachev, tear down this wall! — Herra Gorbatšov, '
          + 'purkakaa tämä muuri!',
        lahde: 'Presidentti Ronald Reagan puheessaan Brandenburgin portin '
          + 'edustalla 12. kesäkuuta 1987',
      },
      kuvat: [
        {
          tiedosto: 'Brandenburger Tor abends.jpg',
          selite: 'Portti valaistuna iltahämärässä, kultainen kvadriga '
            + 'harjalla.',
          lahde: 'Thomas Wolf, Wikimedia Commons (CC BY-SA 3.0)',
        },
        {
          tiedosto: 'President Ronald Reagan Making His Berlin Wall Speech at Brandenburg Gate West Berlin - DPLA - dce9b53e6ef9b7e01d184ce61f78871b.jpg',
          selite: 'Presidentti Reagan puhumassa muurin ja portin edessä '
            + 'kesäkuussa 1987.',
          lahde: 'Yhdysvaltain presidentin valokuvaajien toimisto, '
            + 'Wikimedia Commons (PD)',
        },
      ],
      lahde: 'Wikipedia',
    },
    'Checkpoint Charlie': {
      aika: '1961',
      teksti: 'Checkpoint Charlie oli yksi kolmesta liittoutuneiden '
          + 'rajanylityspaikasta — nimi tulee Naton aakkosista, C niin '
          + 'kuin Charlie. Se rakennettiin elokuussa 1961, kun Itä-Saksa '
          + 'pystytti muurin estämään ihmisten pakenemisen länteen.'
        + '\n\n'
        + 'Lokakuussa 1961 tarkastuspisteellä seisoi kymmenen '
          + 'amerikkalaista ja kymmenen neuvostovaunua piipun mitan '
          + 'päässä toisistaan — tilanne laukesi rauhanomaisesti vasta '
          + 'seuraavana päivänä. Monet yrittivät paeta juuri täältä, ja '
          + 'osa maksoi siitä hengellään.'
        + '\n\n'
        + 'Muuri avautui 1989, ja alkuperäinen vartiokoppi purettiin '
          + '1990. Nykyinen koppi on jälkeenpäin rakennettu jäljennös, '
          + 'jonka luona tuhannet turistit pysähtyvät joka päivä.',
      kuvat: [
        {
          tiedosto: 'US Army tanks face off against Soviet tanks, Berlin 1961.jpg',
          selite: 'Amerikkalaisia panssarivaunuja rajanylityspaikalla '
            + 'lokakuussa 1961.',
          lahde: 'Yhdysvaltain armeija, Wikimedia Commons (PD)',
        },
      ],
      lahde: 'Wikipedia',
    },
    Museosaari: {
      aika: '1830',
      teksti: 'Museosaari on saari joen Spreen keskellä, ja siellä on '
          + 'peräti viisi museota vierekkäin. Ensimmäinen, Vanha museo, '
          + 'avattiin 1830 — viimeisenä valmistui Pergamonmuseo vasta '
          + '1930.'
        + '\n\n'
        + 'Pergamonmuseossa on koottuna kokonaisia muinaisia '
          + 'rakennuksia oikean kokoisina, kuten Babylonin sinisenä '
          + 'hohtava Ištar-portti. Uudessa museossa taas asuu 3 300 '
          + 'vuotta vanha kuningatar Nefertitin rintakuva.'
        + '\n\n'
        + 'Unesco liitti koko Museosaaren maailmanperintöluetteloon '
          + '1999. Museot on nykyään yhdistetty maan alla kulkevalla '
          + 'käytävällä, jota pitkin pääsee kulkemaan museosta toiseen '
          + 'kastumatta.',
      kuvat: [
        {
          tiedosto: 'Altes Museum (Berlin) (6339770591).jpg',
          selite: 'Vanhan museon pylväsjulkisivu Lustgarten-puiston '
            + 'puolelta.',
          lahde: 'Jean-Pierre Dalbéra, Wikimedia Commons (CC BY 2.0)',
        },
        {
          tiedosto: 'Nefertiti Bust Neues Museum Berlin.jpg',
          selite: 'Kuningatar Nefertitin rintakuva lasivitriinissä.',
          lahde: 'Ywpark2003, Wikimedia Commons (CC0)',
        },
      ],
      lahde: 'Wikipedia',
    },
    'Tv-torni': {
      aika: '1969',
      teksti: 'Fernsehturm eli tv-torni rakennettiin 1965–1969 '
          + 'Itä-Saksan hallituksen päätöksellä osoittamaan tekniikan '
          + 'huipputekoja. Se on 368 metriä korkea — Saksan korkein '
          + 'rakennelma.'
        + '\n\n'
        + 'Kun aurinko paistaa palloon sopivasta kulmasta, teräslaatat '
          + 'heijastavat valon ristin muotoisena. Länsiberliiniläiset '
          + 'ristivät ilmiön nimellä paavin kosto, koska hallitus oli '
          + 'poistanut ristejä kirkoista.'
        + '\n\n'
        + 'Näköalatasanteelta 204 metrin korkeudesta näkee kirkkaalla '
          + 'säällä 42 kilometrin päähän, ja sen yläpuolella pyörii '
          + 'ravintola. Torni on nykyään koko Berliinin tunnusmerkki.',
      kuvat: [
        {
          tiedosto: 'Berliner Fernsehturm, Sicht vom Neptunbrunnen - Berlin Mitte.jpg',
          selite: 'Torni koko pituudeltaan sinistä taivasta vasten.',
          lahde: 'Christian Wolf, Wikimedia Commons (CC BY-SA 3.0 DE)',
        },
      ],
      lahde: 'Wikipedia',
    },
    'East Side Gallery': {
      aika: '1990',
      teksti: 'East Side Gallery on 1 316 metrin pituinen pätkä '
          + 'Berliinin muuria, jonka 118 taiteilijaa 21 maasta maalasi '
          + 'keväällä 1990. Se on maailman pisin galleria ulkoilmassa.'
        + '\n\n'
        + 'Tunnetuin teos on Dmitri Vrubelin maalaus, jossa '
          + 'Neuvostoliiton ja Itä-Saksan johtajat suutelevat — se '
          + 'perustuu oikeaan valokuvaan vuodelta 1979. Toinen suosikki '
          + 'on Birgit Kinderin maalaama Trabant-auto, joka näyttää '
          + 'puhkaisevan muurin.'
        + '\n\n'
        + '2000-luvulla rapistuneet maalaukset maalattiin uudelleen '
          + '2009, ja galleria on nykyään suojeltu muistomerkki, jota '
          + 'käy katsomassa yli kolme miljoonaa ihmistä vuodessa.',
      lainaus: {
        teksti: 'Mein Gott, hilf mir, diese tödliche Liebe zu überleben — '
          + 'Jumalani, auta minua selviämään tästä tappavasta '
          + 'rakkaudesta.',
        lahde: 'Maalauksen teksti, jonka Dmitri Vrubel kirjoitti muurille '
          + 'suudelmakuvan viereen 1990',
      },
      kuvat: [
        {
          tiedosto: 'East Side Gallery - Dmitri Vrubel - Le baiser (Berlin).jpg',
          selite: 'Maalaus, jossa kaksi valtionjohtajaa suutelee.',
          lahde: 'Gzen92, Wikimedia Commons (CC BY-SA 4.0)',
        },
        {
          tiedosto: 'East Side Gallery trabi.jpg',
          selite: 'Valkoinen Trabant-auto puhkaisee maalatun muurin.',
          lahde: 'Toytoy, Wikimedia Commons (CC BY-SA 3.0)',
        },
      ],
      lahde: 'Wikipedia',
    },
  },
};
