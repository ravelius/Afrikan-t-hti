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
 */

export const NAHTAVYYSJUTUT = {
  berliini: {
    Valtiopäivätalo: {
      aika: '1894',
      teksti: 'Valtiopäivätalon suunnitteli arkkitehti Paul Wallot, ja '
          + 'peruskiven muurasi keisari Vilhelm I kesäkuussa 1884. Rakennus '
          + 'valmistui kymmenen vuotta myöhemmin, 1894. Se on 47 metriä '
          + 'korkea, ja sen kattoa koristi alun perin teräksestä ja lasista '
          + 'tehty kupoli, joka oli aikansa insinööritaidon näyte.'
        + '\n\n'
        + '27. helmikuuta 1933 rakennus paloi. Palon sytytti hollantilainen '
          + 'Marinus van der Lubbe, mutta Hitler syytti siitä kommunisteja ja '
          + 'käytti tulipaloa tekosyynä kansalaisoikeuksien kaventamiseen. '
          + 'Palon jälkeen kansanedustuslaitos kokoontui seuraavat 12 vuotta '
          + 'lähellä sijaitsevassa Kroll-oopperassa, ei enää omassa '
          + 'talossaan.'
        + '\n\n'
        + 'Toisen maailmansodan aikana ikkunat muurattiin umpeen ja talosta '
          + 'tehtiin sairaala ja radioputkitehdas. Toukokuussa 1945 '
          + 'neuvostosotilaat pystyttivät katolle lipun — kuuluisassa '
          + 'valokuvassa se liehuu raunioituneen kaupungin yllä. Sotilaat '
          + 'jättivät seinille myös venäjänkielisiä kirjoituksia, jotka '
          + 'näkyvät talossa yhä.'
        + '\n\n'
        + 'Sodan jälkeen talo jäi Länsi-Berliinin puolelle, tyhjänä ja '
          + 'käyttämättömänä koko kylmän sodan ajan. Sen edustalla pidettiin '
          + 'silti suuria mielenosoituksia, kun Neuvostoliitto sulki tiet '
          + 'kaupunkiin 1948. Vasta 3. lokakuuta 1990 talossa juhlittiin '
          + 'Saksan yhdistymistä.'
        + '\n\n'
        + 'Uusi lasikupoli rakennettiin 1990-luvulla arkkitehti Norman '
          + 'Fosterin suunnitelmien mukaan, vanhan kupolin muistoksi. Sen '
          + 'sisällä kiertää loiva kävelyramppi katolle asti, ja keskellä '
          + 'oleva peilikartio päästää päivänvaloa suoraan alla istuvien '
          + 'kansanedustajien saliin. Aurinkosuoja seuraa aurinkoa ja estää '
          + 'salia kuumenemasta. Kupoliin pääsee ilmaiseksi, kunhan käynnin '
          + 'varaa etukäteen.',
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
          selite: 'Valtiopäivätalon länsijulkisivu ilta-auringossa. '
            + 'Pylväikön yläpuolella erottuu lasikupolin pyöreä muoto, ja '
            + 'edessä on portaat ja nurmikenttä täynnä ihmisiä.',
          lahde: 'Jürgen Matern, Wikimedia Commons (CC BY-SA 3.0)',
        },
        {
          tiedosto: 'Bundesarchiv Bild 146-1977-148-19A, Berlin, Reichstagsbrand.jpg',
          selite: 'Mustavalkoinen kuva talon palosta helmikuussa 1933: savu '
            + 'nousee taustalla kupolin kohdalta, ja edustalla seisoo '
            + 'palomiehiä ja poliiseja.',
          lahde: 'Saksan liittoarkisto (Bundesarchiv), Wikimedia Commons '
            + '(CC BY-SA 3.0 DE)',
        },
        {
          tiedosto: 'Raising a flag over the Reichstag - Restoration.jpg',
          selite: 'Neuvostosotilas pystyttää lippua raunioituneen talon '
            + 'katolle toukokuussa 1945. Alla palava ja savuava kaupunki '
            + 'jatkuu näköpiirin äärille asti.',
          lahde: 'Jevgeni Haldei, Wikimedia Commons (PD)',
        },
        {
          tiedosto: 'The Reichstag dome (11851173483).jpg',
          selite: 'Lasikupolin sisus alhaalta kuvattuna: kaksi rinnakkaista '
            + 'ramppia kiertyy spiraalina ylös, ja keskellä käännetty '
            + 'peilikartio heijastaa valoa.',
          lahde: 'Fulvio Spada, Wikimedia Commons (CC BY-SA 2.0)',
        },
        {
          tiedosto: 'View of the Plenary Chamber of the Bundestag from the Dome of the Reichstag. (4209149129).jpg',
          selite: 'Näkymä kupolin peilikartion läpi alas istuntosaliin, '
            + 'jossa siniset tuolit erottuvat riveittäin lasin ja '
            + 'teräspalkkien takaa.',
          lahde: 'BriYYZ, Wikimedia Commons (CC BY-SA 2.0)',
        },
      ],
      lahde: 'Wikipedia',
    },
    'Brandenburgin portti': {
      aika: '1791',
      teksti: 'Portin suunnitteli arkkitehti Carl Gotthard Langhans, ja se '
          + 'rakennettiin 1788–1791 kuningas Fredrik Vilhelm II:n '
          + 'tilauksesta antiikin Ateenan temppelien malliin. Portti on 26 '
          + 'metriä korkea ja yli 60 metriä leveä, ja se avattiin yleisölle '
          + 'elokuussa 1791 ennen kuin työt olivat edes valmiit. Sen '
          + 'alkuperäinen nimi oli Rauhanportti.'
        + '\n\n'
        + 'Portin harjalla seisoo pronssinen nelivaljakko eli kvadriga, '
          + 'jonka teki kuvanveistäjä Johann Gottfried Schadow. Se esitti '
          + 'alun perin rauhan jumalatarta. Napoleon vei patsaan '
          + 'sotasaaliina Pariisiin voitettuaan Preussin 1806, ja se '
          + 'palautettiin Berliiniin vasta 1814 Napoleonin tappion jälkeen. '
          + 'Silloin patsas nimettiin uudelleen voitonjumalattareksi ja '
          + 'siihen lisättiin Preussin kotka ja rautaristi.'
        + '\n\n'
        + 'Toisen maailmansodan pommitukset jättivät porttiin luotien '
          + 'reikiä, ja alkuperäisestä kvadrigasta selvisi ehjänä vain yksi '
          + 'hevosenpää. Kun Berliinin muuri nousi elokuussa 1961, se kulki '
          + 'juuri portin länsipuolitse ja sulki koko alueen — portti '
          + 'seisoi kaksikymmentäkahdeksan vuotta tyhjän kaistaleen '
          + 'keskellä, kummankaan puolen saavuttamattomissa.'
        + '\n\n'
        + 'Muuri avautui lopulta 9. marraskuuta 1989, ja portin läpi pääsi '
          + 'taas kulkemaan virallisesti 22. joulukuuta samana vuonna, kun '
          + 'Länsi-Saksan liittokansleri Helmut Kohl käveli sen läpi '
          + 'tapaamaan Itä-Saksan pääministeriä.'
        + '\n\n'
        + 'Portin ympärille rakennettu Pariser Platz on nykyään '
          + 'kävelyalue, josta autot on kielletty. Portti kunnostettiin '
          + 'perusteellisesti 2000–2002, ja se avattiin uudelleen 3. '
          + 'lokakuuta 2002 Saksan yhdistymisen kunniaksi. Nykyään se on '
          + 'koko Saksan tunnetuin rauhan ja yhtenäisyyden symboli.',
      lainaus: {
        teksti: 'Mr. Gorbachev, tear down this wall! — Herra Gorbatšov, '
          + 'purkakaa tämä muuri!',
        lahde: 'Presidentti Ronald Reagan puheessaan Brandenburgin portin '
          + 'edustalla 12. kesäkuuta 1987',
      },
      kuvat: [
        {
          tiedosto: 'Brandenburger Tor abends.jpg',
          selite: 'Portti valaistuna iltahämärässä. Pylväikön läpi näkyy '
            + 'Pariser Platzin puistokäytävä, ja harjalla erottuu kultainen '
            + 'kvadriga.',
          lahde: 'Thomas Wolf, Wikimedia Commons (CC BY-SA 3.0)',
        },
        {
          tiedosto: 'West and East Germans at the Brandenburg Gate in 1989.jpg',
          selite: 'Itä- ja länsisaksalaiset seisovat yhdessä muurin '
            + 'harjalla portin edessä marraskuussa 1989. Muurin kylkeen on '
            + 'maalattu rauhan ja yhtenäisyyden tekstejä.',
          lahde: 'Tuntematon valokuvaaja, Wikimedia Commons (CC BY-SA 3.0)',
        },
        {
          tiedosto: 'President Ronald Reagan Making His Berlin Wall Speech at Brandenburg Gate West Berlin - DPLA - dce9b53e6ef9b7e01d184ce61f78871b.jpg',
          selite: 'Presidentti Reagan puhumassa korokkeelta muurin ja '
            + 'portin edessä kesäkuussa 1987. Yleisö ja liput täyttävät '
            + 'katsomon.',
          lahde: 'Yhdysvaltain presidentin valokuvaajien toimisto, '
            + 'Wikimedia Commons (PD)',
        },
        {
          tiedosto: 'Restored quadriga atop Brandenburg Gate.jpg',
          selite: 'Kvadriga läheltä yöllä valaistuna: neljä hevosta vetää '
            + 'vaunua, jossa seisoo voitonjumalatar sauva kädessään.',
          lahde: 'Karl-Ludwig Poggemann, Wikimedia Commons (CC BY 2.0)',
        },
      ],
      lahde: 'Wikipedia',
    },
    'Checkpoint Charlie': {
      aika: '1961',
      teksti: 'Checkpoint Charlie oli yksi kolmesta liittoutuneiden '
          + 'rajanylityspaikasta Saksassa, ja sen nimi tulee Naton '
          + 'aakkosista: A niin kuin Alpha, B niin kuin Bravo, C niin kuin '
          + 'Charlie. Se rakennettiin elokuussa 1961, kun Itä-Saksa '
          + 'pystytti piikkilanka-aidan ja sitten muurin estämään ihmisten '
          + 'pakenemisen länteen. Vain seitsemässä kuukaudessa ennen '
          + 'muurin nousua yli 200 000 itäsaksalaista oli paennut länteen.'
        + '\n\n'
        + 'Lokakuussa 1961 tarkastuspisteellä syntyi vaarallinen tilanne, '
          + 'kun amerikkalaiselta diplomaatilta vaadittiin papereita '
          + 'rajalla. Yhdysvallat toi paikalle panssarivaunuja, ja '
          + 'Neuvostoliitto vastasi samalla — 27. lokakuuta kymmenen '
          + 'amerikkalaista ja kymmenen neuvostovaunua seisoivat piipun '
          + 'mitan päässä toisistaan. Tilanne laukesi rauhanomaisesti '
          + 'vasta seuraavana päivänä salaisten neuvottelujen jälkeen.'
        + '\n\n'
        + 'Monet yrittivät paeta juuri tästä pisteestä. Yksi ajoi autolla '
          + 'portin läpi, toinen irrotti auton tuulilasin ja livahti '
          + 'puomin ali. Elokuussa 1962 nuori Peter Fechter ammuttiin '
          + 'pakomatkalla piikkilankaan, ja hän makasi haavoittuneena '
          + 'maailman lehdistön silmien edessä ennen kuin apu ehti '
          + 'paikalle.'
        + '\n\n'
        + 'Muuri avautui marraskuussa 1989, ja alkuperäinen vartiokoppi '
          + 'purettiin kesäkuussa 1990 — se on nykyään esillä '
          + 'Alliierten-museossa. Nykyinen koppi on jälkeenpäin rakennettu '
          + 'jäljennös samalle paikalle, ja tuhannet turistit pysähtyvät '
          + 'joka päivä ottamaan kuvan tutuista kylteistä.',
      kuvat: [
        {
          tiedosto: 'US Army tanks face off against Soviet tanks, Berlin 1961.jpg',
          selite: 'Amerikkalaisia panssarivaunuja rajanylityspaikalla '
            + 'lokakuussa 1961. Taustalla näkyy kyltti, joka kertoo '
            + 'neljällä kielellä amerikkalaisen sektorin alkavan.',
          lahde: 'Yhdysvaltain armeija, Wikimedia Commons (PD)',
        },
        {
          tiedosto: 'Checkpoint Charlie sign in Berlin.jpg',
          selite: 'Tarkastuspisteen kyltti, jossa lukee neljällä kielellä: '
            + 'tässä saavutaan amerikkalaiselle sektorille.',
          lahde: 'Chris Mitchell, Wikimedia Commons (CC BY-SA 4.0)',
        },
        {
          tiedosto: 'Checkpoint Charlie, Berlin, Germany (Ank Kumar) 01.jpg',
          selite: 'Nykyinen jälkeenpäin rakennettu vartiokoppi samalla '
            + 'paikalla, hiekkasäkkeineen ja lippuineen.',
          lahde: 'Ank Kumar, Wikimedia Commons (CC BY-SA 4.0)',
        },
        {
          tiedosto: 'Peter Fechter Berlin Wall Memorial.jpg',
          selite: 'Risti ja kukkia muurin muistomerkillä, joka on '
            + 'pystytetty muurin uhrien muistoksi.',
          lahde: 'Yhdysvaltain puolustusministeriö, Wikimedia Commons (PD)',
        },
      ],
      lahde: 'Wikipedia',
    },
    Museosaari: {
      aika: '1830',
      teksti: 'Museosaari on saanut nimensä siitä, että se on saari joen '
          + 'Spreen keskellä, ja siellä on peräti viisi museota '
          + 'vierekkäin. Ensimmäinen niistä, Vanha museo, avattiin '
          + 'yleisölle elokuussa 1830 arkkitehti Karl Friedrich Schinkelin '
          + 'suunnittelemana. Sitä seurasivat Uusi museo 1859, Vanha '
          + 'kansallisgalleria 1876, Bode-museo 1904 ja viimeisenä '
          + 'Pergamonmuseo, joka valmistui vasta 1930.'
        + '\n\n'
        + 'Pergamonmuseossa on koottuna kokonaisia muinaisia rakennuksia '
          + 'oikean kokoisina. Kuuluisin on Babylonin Ištar-portti, joka '
          + 'on koristeltu sinisillä lasitetuilla tiilillä ja kultaisilla '
          + 'härillä ja lohikäärmeillä. Portti kaivettiin esiin '
          + '1900-luvun alussa ja koottiin uudelleen Berliinissä palanen '
          + 'palaselta.'
        + '\n\n'
        + 'Museon toinen jättiläinen on kreikkalainen Pergamon-alttari, '
          + 'jonka portaat ja pylväät tuotiin nekin paloina nykyisen '
          + 'Turkin alueelta 1800-luvun lopulla. Alttarin ympärillä kiertää '
          + 'yli 100 metriä pitkä kiviveistos, jossa jumalat taistelevat '
          + 'jättiläisiä vastaan.'
        + '\n\n'
        + 'Uudessa museossa asuu 3 300 vuotta vanha kuningatar Nefertiti, '
          + 'jonka kipsipäällysteinen kalkkikivipää löydettiin Egyptistä '
          + '1912. Rintakuva on niin herkkä, ettei sitä ole koskaan '
          + 'lainattu ulkomaille. Museo itse tuhoutui pahoin toisessa '
          + 'maailmansodassa ja seisoi raunioina vuosikymmeniä, kunnes '
          + 'arkkitehti David Chipperfield korjautti sen ja se avattiin '
          + 'uudelleen 2009.'
        + '\n\n'
        + 'Unesco liitti koko Museosaaren maailmanperintöluetteloon 1999. '
          + 'Museot on nykyään yhdistetty toisiinsa maan alla kulkevalla '
          + 'käytävällä, jota kutsutaan arkeologiseksi promenadiksi, joten '
          + 'kaikessa rauhassa pääsee kulkemaan museosta toiseen '
          + 'kastumatta.',
      kuvat: [
        {
          tiedosto: 'Altes Museum (Berlin) (6339770591).jpg',
          selite: 'Vanhan museon pylväsjulkisivu Lustgarten-puiston '
            + 'puolelta. Katolla seisoo pronssisia hevospatsaita, ja '
            + 'portailla istuu ja kävelee ihmisiä.',
          lahde: 'Jean-Pierre Dalbéra, Wikimedia Commons (CC BY 2.0)',
        },
        {
          tiedosto: 'Ishtar Gate, Babylon, ca. 575 BCE, built by Nebuchadnezzar II; Pergamon Museum, Berlin (1) (39530940984).jpg',
          selite: 'Babylonin Ištar-portin sinisiä lasitettuja tiiliä '
            + 'läheltä. Kuvioihin on muotoiltu kultaisia härkiä ja '
            + 'lohikäärmeitä riveittäin.',
          lahde: 'Richard Mortel, Wikimedia Commons (CC BY 2.0)',
        },
        {
          tiedosto: 'Berlin - Pergamonmuseum - Altar 01.jpg',
          selite: 'Pergamon-alttarin leveät portaat ja pylväikkö '
            + 'museosalissa. Portailla ja niiden juurella seisoo ja istuu '
            + 'kävijöitä kokoa vertailemassa.',
          lahde: 'Lestat (Jan Mehlich), Wikimedia Commons (CC BY-SA 3.0)',
        },
        {
          tiedosto: 'Nefertiti Bust Neues Museum Berlin.jpg',
          selite: 'Kuningatar Nefertitin rintakuva lasivitriinissä. '
            + 'Sininen kruunu ja maalatut kasvonpiirteet ovat säilyneet '
            + 'yli 3 000 vuotta.',
          lahde: 'Ywpark2003, Wikimedia Commons (CC0)',
        },
      ],
      lahde: 'Wikipedia',
    },
    'Tv-torni': {
      aika: '1969',
      teksti: 'Fernsehturm eli tv-torni rakennettiin 1965–1969 Itä-Saksan '
          + 'hallituksen päätöksellä. Sen piti näyttää koko maailmalle, '
          + 'että sosialistinen valtio pystyy tekniikan huipputekoihin — '
          + 'ja samalla se toimi ihan tavallisena lähetysasemana radiolle '
          + 'ja televisiolle. Torni valmistui virallisesti 3. lokakuuta '
          + '1969.'
        + '\n\n'
        + 'Torni on 368 metriä korkea, ja sen yläosassa oleva pallo '
          + 'painaa 4 800 tonnia ja on halkaisijaltaan 32 metriä. Rungon '
          + 'betonia meni 8 000 kuutiometriä. Portaita palloon johtaa 986 '
          + 'askelmaa, mutta useimmat käyttävät kahta hissiä, jotka vievät '
          + '12 hengen ryhmän ylös 40 sekunnissa.'
        + '\n\n'
        + 'Kun aurinko paistaa palloon sopivasta kulmasta, sen '
          + 'ruostumattomasta teräksestä tehdyt laatat heijastavat valon '
          + 'ristin muotoisena. Länsiberliiniläiset ristivät ilmiön '
          + 'nimellä paavin kosto, koska Itä-Saksan hallitus oli poistanut '
          + 'ristejä kirkoista — ja aurinko piirsi ristin takaisin '
          + 'taivaalle joka tapauksessa.'
        + '\n\n'
        + 'Näköalatasanne on 204 metrin korkeudessa, ja sen yläpuolella '
          + 'pyörii ravintola, joka tekee täyden kierroksen tunnissa. '
          + 'Kirkkaalla säällä näkyvyys ulottuu 42 kilometrin päähän. '
          + 'Torniin mahtuu kerralla 320 ihmistä, ja se on Saksan korkein '
          + 'rakennelma.'
        + '\n\n'
        + 'Alun perin torni oli Itä-Saksan ylpeyden symboli, mutta Saksan '
          + 'yhdistymisen jälkeen siitä tuli koko Berliinin tunnusmerkki. '
          + 'Kesäkuussa 2011 torni toivotti tervetulleeksi 50 '
          + 'miljoonannen kävijänsä, ja nykyään se näkyy taustalla lähes '
          + 'jokaisessa Berliini-elokuvassa.',
      kuvat: [
        {
          tiedosto: 'Berliner Fernsehturm, Sicht vom Neptunbrunnen - Berlin Mitte.jpg',
          selite: 'Torni koko pituudeltaan sinistä taivasta vasten, '
            + 'alaosassa Park Inn -hotelli ja puistoalue.',
          lahde: 'Christian Wolf, Wikimedia Commons (CC BY-SA 3.0 DE)',
        },
        {
          tiedosto: 'Bundesarchiv Bild 183-G1206-0028-001, Berlin, Fernsehturm, Bau.jpg',
          selite: 'Torni lähes valmiina joulukuussa 1968, kuvattuna '
            + 'vierestä toisen rakennuksen työmaalta.',
          lahde: 'Rainer Mittelstädt (Bundesarchiv), Wikimedia Commons '
            + '(CC BY-SA 3.0 DE)',
        },
        {
          tiedosto: 'Berliner Fernsehturm at night 1.JPG',
          selite: 'Valaistu pallo-osa yöllä mustaa taivasta vasten, '
            + 'antenni kohoaa huipulla ylöspäin.',
          lahde: 'Pudelek (Marcin Szala), Wikimedia Commons (CC BY-SA 3.0)',
        },
        {
          tiedosto: 'Lascar Fernsehturm (Television tower) using a super-wide angle (4472440296).jpg',
          selite: 'Tornin kapeneva runko alhaalta kuvattuna yöllä, '
            + 'valaistuna alta ylöspäin; rungossa erottuu pyöreitä '
            + 'huoltoluukkuja.',
          lahde: 'Jorge Láscar, Wikimedia Commons (CC BY 2.0)',
        },
      ],
      lahde: 'Wikipedia',
    },
    'East Side Gallery': {
      aika: '1990',
      teksti: 'East Side Gallery on 1 316 metrin pituinen pätkä '
          + 'Berliinin muuria, joka on jätetty pystyyn ja maalattu '
          + 'tauluksi. Keväällä 1990, heti muurin avauduttua, 118 '
          + 'taiteilijaa 21 maasta maalasi seinään 105 teosta. Se on '
          + 'maailman pisin ja pisimpään säilynyt galleria ulkoilmassa.'
        + '\n\n'
        + 'Tunnetuin teoksista on Dmitri Vrubelin maalaus, jossa '
          + 'Neuvostoliiton johtaja Leonid Brežnev ja Itä-Saksan johtaja '
          + 'Erich Honecker suutelevat. Maalaus perustuu oikeaan '
          + 'valokuvaan lokakuulta 1979, jossa kaksi johtajaa antoivat '
          + 'toisilleen niin kutsutun veljeyssuudelman Itä-Saksan '
          + '30-vuotisjuhlassa.'
        + '\n\n'
        + 'Toinen suosikki on Birgit Kinderin maalaama Trabant-auto, joka '
          + 'näyttää puhkaisevan muurin läpi. Kuvassa auton '
          + 'rekisterikilvessä lukee päivämäärä 9.11.89 — päivä, jolloin '
          + 'muuri avautui.'
        + '\n\n'
        + '2000-luvulle tultaessa kaksi kolmasosaa maalauksista oli '
          + 'rapistunut sään, graffitien ja ilkivallan takia. Vuonna 2009 '
          + 'taiteilijat kutsuttiin takaisin maalaamaan teoksensa '
          + 'uudelleen, ja nykyään galleriassa nähtävät kuvat ovat '
          + 'pääosin näitä uusintoja.'
        + '\n\n'
        + 'Vuonna 2013 osa muurista purettiin luksusasuntojen tieltä '
          + 'ilman, että kaikkia taiteilijoita edes tiedotettiin. '
          + 'Protestit pysäyttivät purkutyöt, ja 2018 koko galleria '
          + 'siirtyi Berliinin muurisäätiön suojelemaksi muistomerkiksi. '
          + 'Sitä käy katsomassa yli kolme miljoonaa ihmistä joka vuosi.',
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
          selite: 'Maalaus, jossa kaksi valtionjohtajaa suutelee. Teoksen '
            + 'alla ja yllä on venäjän- ja saksankielistä tekstiä.',
          lahde: 'Gzen92, Wikimedia Commons (CC BY-SA 4.0)',
        },
        {
          tiedosto: 'East Side Gallery trabi.jpg',
          selite: 'Valkoinen Trabant-auto puhkaisee maalatun muurin, '
            + 'rekisterikilvessä lukee päivämäärä 9.11.89.',
          lahde: 'Toytoy, Wikimedia Commons (CC BY-SA 3.0)',
        },
        {
          tiedosto: 'Friedrichshain, Berlin, Germany - panoramio (77).jpg',
          selite: 'Pätkä muuria täynnä eri taiteilijoiden maalauksia, ja '
            + 'kävelijöitä kulkee pitkin jalkakäytävää muurin vierellä.',
          lahde: 'Jan M, Wikimedia Commons (CC BY-SA 3.0)',
        },
      ],
      lahde: 'Wikipedia',
    },
  },
};
