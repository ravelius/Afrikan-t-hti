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
  kairo: {
    'Kairon torni': {
      aika: '1961',
      teksti: 'Kairon torni valmistui vuonna 1961 Niilin rannalle. Se on '
          + '187 metriä korkea, ja se oli hetken Afrikan korkein '
          + 'rakennelma. Arkkitehti Naoum Shebib suunnitteli tornin '
          + 'muistuttamaan muinaista lootuskukkaa, tärkeää egyptiläistä '
          + 'symbolia.'
        + '\n\n'
        + 'Tornin rakentamiseen käytettiin rahaa, joka oli alun perin '
          + 'tarkoitettu ihan muuhun. Presidentti Gamal Abdel Nasser '
          + 'käytti sen tornin rakentamiseen, kun hän ei halunnut ottaa '
          + 'vastaan ulkomaista lahjusta.'
        + '\n\n'
        + 'Tornin huipulla on pyörivä ravintola ja näköalatasanne, josta '
          + 'näkee koko Kairon. Vuosina 2006–2009 torni kunnostettiin, ja '
          + 'se on yhä suosittu nähtävyys.',
      kuvat: [
        {
          tiedosto: 'نهر النيل وبرج القاهرة.jpg',
          selite: 'Kairon torni kohoaa Niilin rantamaisemassa.',
          lahde: 'Abdouououou, Wikimedia Commons (CC BY-SA 4.0)',
        },
      ],
      lahde: 'Wikipedia',
    },
    'Egyptin museo': {
      aika: '1902',
      teksti: 'Egyptin museo avattiin Tahririn aukion laidalla vuonna '
          + '1902. Ranskalainen arkkitehti Marcel Dourgnon suunnitteli '
          + 'rakennuksen, ja sen rakensi italialainen yhtiö.'
        + '\n\n'
        + 'Museossa on yli 170 000 muinaisen Egyptin esinettä — enemmän '
          + 'kuin missään muualla maailmassa. Täältä löytyy muun muassa '
          + 'kuningas Tutankhamonin aarteita ja muumioita. Alakerrassa on '
          + '42 huonetta täynnä kivipatsaita, yläkerrassa pienempiä '
          + 'esineitä kuten papyruksia ja kolikoita.'
        + '\n\n'
        + 'Osa aarteista on siirretty uuteen Ison Egyptin museoon '
          + 'Gizaan. Vanha museo on silti yhä auki, ja vuoden 2011 '
          + 'mellakoiden aikana varastetut esineet saatiin lopulta '
          + 'suurimmaksi osaksi takaisin.',
      kuvat: [
        {
          tiedosto: 'Facade of the Egyptian Museum, Tahrir Square, Cairo, Egypt1.jpg',
          selite: 'Egyptin museon punainen julkisivu Tahririn aukiolla.',
          lahde: 'Diego Delso, Wikimedia Commons (CC BY-SA 3.0)',
        },
      ],
      lahde: 'Wikipedia',
    },
    'Tahririn aukio': {
      aika: '2011',
      teksti: 'Tahririn aukio tarkoittaa arabiaksi "vapautuksen aukiota". '
          + 'Aukio syntyi vuonna 1867 nimellä Ismailia-aukio, mutta se '
          + 'sai nykyisen nimensä vasta myöhemmin, kansannousun jälkeen.'
        + '\n\n'
        + 'Vuonna 2011 aukiosta tuli koko maailman huomion keskipiste. '
          + 'Kymmenettuhannet egyptiläiset kokoontuivat sinne 18 '
          + 'päiväksi vaatimaan muutosta. Lopulta presidentti erosi, ja '
          + 'aukiolla juhlittiin läpi yön.'
        + '\n\n'
        + 'Nykyään aukion laidalla on Egyptin museo ja Kairon metron '
          + 'asema. Aukiolle mahtuu parhaimmillaan jopa 250 000 ihmistä, '
          + 'ja sinne on pystytetty muinainen obeliski ja sfinssipatsaita '
          + 'muistona Egyptin pitkästä historiasta.',
      kuvat: [
        {
          tiedosto: 'Tahrir Square, Cairo, in the early morning - c.jpg',
          selite: 'Tahririn aukio ylhäältä kuvattuna auringonnousun '
            + 'aikaan.',
          lahde: 'Frank Schulenburg ja Julian Herzog, Wikimedia Commons '
            + '(CC BY-SA 3.0)',
        },
      ],
      lahde: 'Wikipedia',
    },
    'Ibn Tulunin moskeija': {
      aika: '879',
      teksti: 'Ibn Tulunin moskeija valmistui vuonna 879 Kairoon. Sen '
          + 'rakennutti Ahmad ibn Tulun, joka hallitsi Egyptiä lähes '
          + 'itsenäisesti. Moskeija on yksi Egyptin suurimmista, ja se on '
          + 'säilynyt lähes alkuperäisessä asussaan — maan vanhin hyvin '
          + 'säilynyt moskeija.'
        + '\n\n'
        + 'Moskeijan minareetti on erikoinen: sen ulkopuolella kiertää '
          + 'spiraalimainen porras. Tarinan mukaan Ibn Tulun keksi '
          + 'muodon vahingossa, kun hän kokouksessa kietoi '
          + 'pergamenttiliuskan sormensa ympärille.'
        + '\n\n'
        + 'Moskeijan seinillä kiertää Koraanin tekstiä lähes kaksi '
          + 'kilometriä — vanhin säilynyt näin pitkä kirjoitus '
          + 'islamilaisessa taiteessa.',
      kuvat: [
        {
          tiedosto: 'Kairo Ibn Tulun Moschee BW 5.jpg',
          selite: 'Moskeijan sisäpiha ja taustalla kiertyvä '
            + 'spiraaliminareetti.',
          lahde: 'Berthold Werner, Wikimedia Commons (CC BY 3.0)',
        },
      ],
      lahde: 'Wikipedia',
    },
    'Saladinin linnoitus': {
      aika: '1176',
      teksti: 'Saladin aloitti linnoituksen rakentamisen vuonna 1176 '
          + 'suojellakseen Kairoa ristiretkeläisten hyökkäyksiltä. '
          + 'Linnoitus kohoaa Mokattam-kukkulalla, ja siitä tuli Egyptin '
          + 'hallituksen keskus lähes 700 vuodeksi.'
        + '\n\n'
        + 'Vuosisatoja myöhemmin, 1800-luvulla, Muhammad Ali Pasha '
          + 'muutti linnoitusta rajusti. Hän purki vanhoja rakennuksia ja '
          + 'rakensi tilalle suuren moskeijan, jonka kupoli ja '
          + 'minareetit näkyvät yhä kauas Kairon yli.'
        + '\n\n'
        + 'Linnoituksessa on nähty synkkiäkin hetkiä: vuonna 1811 '
          + 'Muhammad Ali kutsui mamelukkiruhtinaat juhlaan ja väijytti '
          + 'heidät portailla. Nykyään linnoitus on avoinna kaikille ja '
          + 'kuuluu maailmanperintökohteisiin.',
      kuvat: [
        {
          tiedosto: 'Muhammad Ali Mosque 1.jpg',
          selite: 'Muhammad Alin moskeija linnoituksen sisäpihalla.',
          lahde: 'kallerna, Wikimedia Commons (CC BY-SA 3.0)',
        },
      ],
      lahde: 'Wikipedia',
    },
    'Khan el-Khalili': {
      aika: '1382',
      teksti: 'Khan el-Khalilin basaari perustettiin 1380-luvulla '
          + 'sulttaani Barquqin aikana. Nimensä se sai '
          + 'Jaharkas al-Khalililtä, joka purki vanhan haudan ja rakensi '
          + 'tilalle suuren kauppahallin.'
        + '\n\n'
        + 'Basaarista kasvoi vuosisatojen myötä Kairon tärkein '
          + 'kauppapaikka. Vuoteen 1800 mennessä alueella oli lähes 40 '
          + 'kauppamajaa, joissa kauppiaat myivät mausteita, kultaa ja '
          + 'kankaita. Yksi vanhimmista kahviloista, El-Fishawy, on '
          + 'ollut auki vuodesta 1773 lähtien.'
        + '\n\n'
        + 'Basaari innoitti myös kirjailija Naguib Mahfouzia, joka '
          + 'sijoitti kuuluisan romaaninsa Midaq-kuja juuri tänne. '
          + 'Kapeilla kujilla voi yhä tänään tinkiä ja haistella '
          + 'mausteiden tuoksua.',
      kuvat: [
        {
          tiedosto: 'Khan el-Khalili 2019.jpg',
          selite: 'Kimaltavia lyhtyjä basaarin kojussa.',
          lahde: 'Mohammed Moussa, Wikimedia Commons (CC BY-SA 4.0)',
        },
      ],
      lahde: 'Wikipedia',
    },
  },
  venetsia: {
    'Canal Grande': {
      aika: '1631',
      teksti: 'Canal Grande on Venetsian pääkatu, vaikka se onkin '
          + 'oikeasti vesitie. Se mutkittelee kaupungin läpi käänteisen '
          + 'S-kirjaimen muotoisena, on 3,8 kilometriä pitkä ja 30–90 '
          + 'metriä leveä. Rannoilla seisoo yli 170 rakennusta, monet '
          + '1200–1700-luvuilta.'
        + '\n\n'
        + 'Pitkään kanaalin yli pääsi vain yhtä ainoaa siltaa, Rialtoa — '
          + 'muuten piti mennä veneellä. Nykyään ylityspaikkoja on '
          + 'neljä, uusin on vuonna 2008 valmistunut lasinen '
          + 'Konstituutiosilta.'
        + '\n\n'
        + 'Kanaalin varrella kohoaa valkoinen Santa Maria della Saluten '
          + 'kirkko. Sen rakentaminen alkoi 1631 kiitokseksi siitä, että '
          + 'hirveä ruttoepidemia vihdoin väistyi.',
      kuvat: [
        {
          tiedosto: 'Canal Grande Chiesa della Salute e Dogana dal ponte dell Accademia.jpg',
          selite: 'Canal Grande iltapäivän valossa, gondoli etualalla ja '
            + 'Santa Maria della Salute -kirkon kupoli taustalla.',
          lahde: 'Wolfgang Moroder, Wikimedia Commons (CC BY-SA 3.0)',
        },
      ],
      lahde: 'Wikipedia',
    },
    'La Fenicen oopperatalo': {
      aika: '1792',
      teksti: 'La Fenice tarkoittaa Feeniksiä, satulintua joka nousee '
          + 'tuhkasta uudelleen — ja nimi on osunut kohdalleen. '
          + 'Arkkitehti Giannantonio Selvan suunnittelema talo valmistui '
          + '1792, ja siihen mahtuu nykyään 1126 katsojaa.'
        + '\n\n'
        + 'Talo on palanut kahdesti. Ensin 1836, ja se rakennettiin '
          + 'uudelleen vain vuodessa. Sitten tuhopolttajat sytyttivät '
          + 'sen tuleen tammikuussa 1996. Uudelleenrakennus maksoi 90 '
          + 'miljoonaa euroa ja kesti seitsemän vuotta.'
        + '\n\n'
        + 'Talossa ovat kantaesittäneet oopperansa muun muassa Rossini '
          + 'ja Verdi, jonka Rigoletto ja La traviata kuultiin täällä '
          + 'ensi kertaa. Talo avattiin taas juhlallisesti 2003.',
      kuvat: [
        {
          tiedosto: 'Teatro La Fenice, Venice.jpg',
          selite: 'La Fenicen kultainen katsomo täynnä yleisöä '
            + 'esityksen aikana.',
          lahde: 'Youflavio, Wikimedia Commons (CC BY-SA 4.0)',
        },
      ],
      lahde: 'Wikipedia',
    },
    'Rialton silta': {
      aika: '1591',
      teksti: 'Rialton silta on Canal Granden neljästä sillasta vanhin '
          + 'ja kuuluisin. Ennen sitä jopa Michelangelo ja Palladio '
          + 'ehdottivat omia siltamallejaan, mutta lopulta valittiin '
          + 'arkkitehti Antonio da Ponten kivinen kaarisilta, joka '
          + 'valmistui vuosina 1588–1591.'
        + '\n\n'
        + 'Paikalla oli aiemmin pelkkä pontonisilta vuodesta 1181 ja '
          + 'puinen kääntösilta vuodesta 1255. Se romahti kahdesti: '
          + 'kerran 1444 häitä katsomassa olleen väkijoukon alla ja '
          + 'uudelleen 1524.'
        + '\n\n'
        + 'Sillan pisin kaari on lähes 32 metriä ja koko silta on liki '
          + '23 metriä leveä. Keskellä kulkee katettu käytävä, jonka '
          + 'reunoilla on pieniä kauppoja — aivan kuten satoja vuosia '
          + 'sitten.',
      kuvat: [
        {
          tiedosto: 'Ponte di Rialto Venice 1.jpg',
          selite: 'Rialton silta kultaisessa iltavalossa, veneitä '
            + 'kanaalilla sen edessä.',
          lahde: 'kallerna, Wikimedia Commons (CC BY-SA 4.0)',
        },
      ],
      lahde: 'Wikipedia',
    },
    'Pyhän Markuksen tori': {
      aika: '1902',
      teksti: 'Pyhän Markuksen tori on Venetsian sydän, jota '
          + 'Napoleonin kerrotaan kutsuneen "Euroopan olohuoneeksi". '
          + 'Torin laidalla kohoaa Pyhän Markuksen basilika: pyhän '
          + 'Markuksen jäännökset tuotiin sinne salaa Alexandriasta, ja '
          + 'ensimmäinen kirkko niille valmistui jo vuonna 836.'
        + '\n\n'
        + '14. heinäkuuta 1902 kello 9.53 vieressä kohoava 98,6 metriä '
          + 'korkea kellotorni, campanile, romahti täysin muutamassa '
          + 'sekunnissa. Ihmeen kaupalla kukaan ei loukkaantunut — '
          + 'ainoa uhri oli vahtimestarin kissa. Torni rakennettiin '
          + 'uudelleen tismalleen samanlaisena ja avattiin taas vuonna '
          + '1912.'
        + '\n\n'
        + 'Torilla asuu myös kymmeniä pulukatraita. Matalan sijaintinsa '
          + 'vuoksi tori tulvii yhä usein: vuonna 1966 vesi nousi '
          + 'peräti 194 senttiä.',
      kuvat: [
        {
          tiedosto: 'Piazza San Marco, St Mark\'s Square, Venice, Italy.jpg',
          selite: 'Pyhän Markuksen basilika ja campanile, pulukatraita '
            + 'torin kivetyksellä.',
          lahde: 'Vyacheslav Argenberg, Wikimedia Commons (CC BY 4.0)',
        },
      ],
      lahde: 'Wikipedia',
    },
    'San Giorgio Maggiore': {
      aika: '1566',
      teksti: 'San Giorgio Maggiore on pieni saari aivan Pyhän '
          + 'Markuksen torin edustalla, ja sen valkoinen kirkko on yksi '
          + 'Venetsian tunnetuimmista näkymistä. Munkki Giovanni '
          + 'Morosini perusti saarelle luostarin jo vuonna 982 '
          + 'kuivattuaan ensin suot.'
        + '\n\n'
        + 'Nykyinen kirkko alkoi nousta vuonna 1566 kuuluisan '
          + 'arkkitehti Andrea Palladion piirustusten mukaan. Sen '
          + 'korkea tiilinen kellotorni ja valkoinen marmorijulkisivu '
          + 'näkyvät kauas yli laguunin.'
        + '\n\n'
        + 'Maalari Claude Monet maalasi kirkosta kokonaisen sarjan '
          + 'tauluja. Nykyään saarella toimii kulttuurisäätiö, kirjasto '
          + 'ja ulkoilmateatteri, ja tornissa soi yhdeksän kellon '
          + 'sarja.',
      kuvat: [
        {
          tiedosto: 'Basilica di San Giorgio Maggiore a Venezia.jpg',
          selite: 'San Giorgio Maggioren valkoinen kirkko ja tiilinen '
            + 'kellotorni saaren rannalla.',
          lahde: 'Wolfgang Moroder, Wikimedia Commons (CC BY-SA 3.0)',
        },
      ],
      lahde: 'Wikipedia',
    },
    Arsenaali: {
      aika: '1104',
      teksti: 'Arsenaali oli Venetsian valtava laivaveistämö, jonka '
          + 'rakentaminen alkoi noin vuonna 1104. Parhaimmillaan '
          + '1500-luvulla siellä työskenteli lähes 16 000 ihmistä, ja '
          + 'uusi laiva voitiin koota liukuhihnamaisesti jopa yhdessä '
          + 'päivässä.'
        + '\n\n'
        + 'Osat olivat valmiiksi tehtyjä ja samanlaisia, aivan kuten '
          + 'tehtaissa vasta satoja vuosia myöhemmin. Arsenaalissa myös '
          + 'käännettiin laivanrakennuksen järjestys: ensin pystytettiin '
          + 'kylkiluista tehty runko, sitten laudat sen ympärille. Tämä '
          + 'nopeutti työtä ja säästi puuta.'
        + '\n\n'
        + 'Runoilija Dante kirjoitti Arsenaalista Jumalaisessa '
          + 'näytelmässään, kuinka siellä kiehui piki jo talvella. '
          + 'Vuonna 1797 Napoleon valloitti Venetsian, ja Arsenaalin '
          + 'suuruuden aika päättyi.',
      lainaus: {
        teksti: 'Quale ne l\'arzanà de\' Viniziani bolle l\'inverno la '
          + 'tenace pece — Niin kuin Venetsian arsenaalissa kiehuu '
          + 'talvella sitkeä piki.',
        lahde: 'Dante Alighieri, Jumalaisen näytelmän Helvetti-osan 21. '
          + 'laulu (n. 1308–1320), jossa Arsenaalin touhu vertautuu '
          + 'helvetin kiehuvaan pikeen',
      },
      kuvat: [
        {
          tiedosto: 'Arsenale ingresso Venezia notte.jpg',
          selite: 'Arsenaalin porttitornit ja silta valaistuina '
            + 'iltahämärässä, kuvastuen veteen.',
          lahde: 'Wolfgang Moroder, Wikimedia Commons (CC BY-SA 3.0)',
        },
      ],
      lahde: 'Wikipedia',
    },
  },
};
