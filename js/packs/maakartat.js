// Maa-osioiden aloitussivujen isot kartat (omistajan toive 7.8.2026:
// "maaosion aloitussivu voisi alkaa isolla maan kartalla johon
// merkitty tärkeimmät kaupungit ja maastonmuodot").
//
// Pohjakuvat ovat Wikimedia Commonsin sijaintikarttaperheen
// korkokarttoja (tekijä useimmiten TUBS): yhtenäinen tyyli, iso
// SVG-lähde ja — ratkaisevana — tiedostosivulla DOKUMENTOIDUT
// reunakoordinaatit tasavälisessä (equirectangular) projektiossa.
// Niiden ansiosta kaupunkipisteet voidaan asemoida kuvan päälle
// pelkällä prosenttilaskulla:
//   x % = (lon − lansi) / (ita − lansi) × 100
//   y % = (pohjoinen − lat) / (pohjoinen − etela) × 100
// Pystysuunnan venytys (leveyspiirit ~150 % pituuspiirien koosta)
// vaikuttaa vain kuvasuhteeseen, ei prosenttiasemointiin.
//
// Kun lisäät maan: hae "Relief Map of <maa>" / "<maa> relief
// location map" Commonsista, tarkista lisenssi (PD/CC BY/CC BY-SA),
// poimi rajat tiedostosivun "Map to illustrate ... borders"
// -kohdasta ja KATSO 480 px pikkukuva silmin kuten muutkin kuvat.
// Kaupunkien koordinaatit suomenkielisestä Wikipediasta.

/**
 * ISO3-koodi → kartta.
 *
 * tiedosto  Commonsin tiedostonimi (Special:FilePath skaalaa).
 * lahde     Lähderivi pelin vakiomuodossa.
 * rajat     Kuvan reunojen koordinaatit asteina.
 * kaupungit Piirrettävät pisteet; paa merkitsee pääkaupungin.
 */
export const MAAKARTAT = {
  EGY: {
    tiedosto: 'Egypt relief location map.jpg',
    lahde: 'Eric Gaba ja NordNordWest, Wikimedia Commons (CC BY-SA 3.0)',
    /*
     * Rajat sijaintikarttaperheen omasta määrittelystä (Wikipedian
     * Module:Location map/data/Egypt), jossa tämä tiedosto on nimetty
     * relief-versioksi.
     *
     * Kuva on 1055 px leveä — pienin pelin korkokartoista. Suurempaa
     * ei ole: koko sijaintikarttaperheessä Egyptistä on vain tämä yksi
     * relief-versio (etsitty 7.8.2026). Riittää lehden leveydelle,
     * mutta jos Commonsiin joskus ilmestyy isompi, se kannattaa vaihtaa.
     */
    rajat: { pohjoinen: 32.1, etela: 21.3, lansi: 24.2, ita: 37.3 },
    /*
     * Viisi paikkaa, jotka kertovat maan muodon: delta (Aleksandria),
     * deltan kärki (Kairo), Niilin laakso (Luxor, Assuan) ja Siinai
     * (Sharm el-Sheikh). Kartalta näkee heti, että kaikki asutus on
     * joen varressa ja muu on aavikkoa.
     */
    kaupungit: [
      { nimi: 'Kairo', lat: 30.044, lon: 31.236, paa: true },
      { nimi: 'Aleksandria', lat: 31.2, lon: 29.92 },
      { nimi: 'Luxor', lat: 25.7, lon: 32.64 },
      { nimi: 'Assuan', lat: 24.09, lon: 32.9 },
      { nimi: 'Sharm el-Sheikh', lat: 27.91, lon: 34.33 },
    ],
    /*
     * Kuvanosto Siinailta: kartta näyttää niemimaan, mutta yksikään
     * Egyptin aihesivu ei kerro siitä mitään — kaikki katsovat Niilin
     * vartta. Aihe ei myöskään osu mihinkään olemassa olevaan nostoon
     * (tarkistettu kaikki 21). Kuva silmätarkistettu 480 px:ssä.
     */
    nosto: {
      otsikko: 'Luostari, joka ei ole koskaan sulkenut oviaan',
      tiedosto: 'Katharinenkloster Sinai BW 2.jpg',
      teksti: 'Siinain vuorten juurella toimii Pyhän Katariinan '
        + 'luostari, joka on ollut yhtäjaksoisesti käytössä 500-luvulta '
        + 'asti — pidempään kuin mikään muu kristitty luostari '
        + 'maailmassa. Muurien sisällä kasvaa karhunvatukkapensas, jota '
        + 'munkit pitävät Raamatun palavana pensaana, ja kirjastossa on '
        + 'maailman toiseksi suurin vanhojen käsikirjoitusten kokoelma '
        + 'Vatikaanin jälkeen. Luostari säilyi valloitusten läpi osin '
        + 'siksi, että sen hallussa on suojelukirje, jonka kerrotaan '
        + 'olevan profeetta Muhammadin antama — pihalla on myös '
        + 'moskeija.',
      selite: 'Pyhän Katariinan luostari Siinain paljaiden vuorten '
        + 'kainalossa. Muurit ovat 500-luvulta, keisari Justinianuksen '
        + 'rakennuttamat.',
      lahde: 'Berthold Werner, Wikimedia Commons (CC BY-SA 3.0)',
      wiki: 'Pyhän Katariinan luostari',
    },
  },
  GBR: {
    tiedosto: 'United Kingdom relief location map.jpg',
    lahde: 'Alexrk2, Wikimedia Commons (CC BY-SA 3.0)',
    /*
     * Rajat sijaintikarttaperheen omasta määrittelystä (Wikipedian
     * Module:Location map/data/United Kingdom), jossa tämä tiedosto on
     * nimetty relief-versioksi. Kuva ulottuu Shetlannista Kanaaliin ja
     * näyttää myös Irlannin saaren — se auttaa hahmottamaan, mikä osa
     * siitä kuuluu Yhdistyneeseen kuningaskuntaan.
     */
    rajat: { pohjoinen: 61, etela: 49, lansi: -11, ita: 2.2 },
    /*
     * Neljä maata, neljä kaupunkia — ja Manchester viidentenä, koska
     * teollinen vallankumous ja ensimmäinen rautatie kuuluvat sen
     * seudulle. Pääkaupungit: Lontoo (koko valtakunta), Edinburgh
     * (Skotlanti), Cardiff (Wales) ja Belfast (Pohjois-Irlanti).
     */
    kaupungit: [
      { nimi: 'Lontoo', lat: 51.51, lon: -0.13, paa: true },
      { nimi: 'Edinburgh', lat: 55.95, lon: -3.19 },
      { nimi: 'Belfast', lat: 54.6, lon: -5.93 },
      { nimi: 'Cardiff', lat: 51.48, lon: -3.18 },
      { nimi: 'Manchester', lat: 53.48, lon: -2.24 },
    ],
    /*
     * Kuvanosto täydentää introa: se puhuu neljän maan liitosta, mutta
     * kaikki aihesivut kertovat Englannista. Tämä on Pohjois-Irlannista
     * ja tuo mukanaan tarinan, jota mikään sivu ei muuten näytä. Kuva
     * silmätarkistettu 480 px:ssä 7.8.2026.
     */
    nosto: {
      otsikko: 'Jättiläisen tie mereen',
      tiedosto: "Giant's Causeway (14).JPG",
      teksti: 'Pohjois-Irlannin rannalla on noin 40 000 kivipylvästä, '
        + 'joista useimmat ovat kuusikulmaisia kuin hunajakenno. Ne '
        + 'syntyivät 60 miljoonaa vuotta sitten, kun paksu laavakerros '
        + 'jäähtyi hitaasti ja kutistuessaan halkeili säännöllisiin '
        + 'sarakkeisiin — sama ilmiö kuin kuivuvassa mutalätäkössä, '
        + 'mutta kivessä. Tarina kertoo toisin: jättiläinen Finn '
        + 'MacCool rakensi tien Skotlantiin tapellakseen toisen '
        + 'jättiläisen kanssa. Skotlannin puolella Staffan saarella on '
        + 'samanlaisia pylväitä — tarina ja geologia osoittavat samaan '
        + 'suuntaan.',
      selite: 'Kuusikulmaiset basalttipylväät laskeutuvat mereen Antrimin '
        + 'rannikolla. Korkeimmat pylväät ovat kaksitoistametrisiä.',
      lahde: 'Chmee2, Wikimedia Commons (CC BY 3.0)',
      wiki: 'Giant’s Causeway',
    },
  },
  DEU: {
    tiedosto: 'Relief Map of Germany.svg',
    lahde: 'TUBS, Wikimedia Commons (CC BY-SA 3.0)',
    rajat: { pohjoinen: 55.1, etela: 47.2, lansi: 5.5, ita: 15.5 },
    kaupungit: [
      { nimi: 'Berliini', lat: 52.52, lon: 13.41, paa: true },
      { nimi: 'Hampuri', lat: 53.55, lon: 9.99 },
      { nimi: 'München', lat: 48.14, lon: 11.58 },
      { nimi: 'Köln', lat: 50.94, lon: 6.96 },
      { nimi: 'Frankfurt', lat: 50.11, lon: 8.68 },
    ],
    /*
     * Kuvanosto kartan ja uutisten väliin elävöittämään sivua
     * (omistajan toive 7.8.2026). Aihe täydentää introa: Rein
     * mainitaan siinä, mutta mikään Saksan sivu ei vielä näytä sitä.
     * Kuva silmätarkistettu 480 px:ssä 7.8.2026.
     */
    nosto: {
      otsikko: 'Loreley vartioi Reinin mutkaa',
      tiedosto: 'Loreley rhine valley d schmidt 08 07.jpg',
      teksti: 'Rein on Euroopan vilkkaimpia vesiteitä: proomut ja '
        + 'risteilijät kulkevat sen halki aamusta iltaan. Loreleyn '
        + '132-metrisen kallion kohdalla joki kapenee ja syvenee '
        + 'jyrkäksi mutkaksi, jonka kohinasta syntyi tarina laulavasta '
        + 'neidosta — Heinrich Heinen runona sen osaa moni saksalainen '
        + 'ulkoa. Keskireinin laaksossa linnoja on tiheämmässä kuin '
        + 'missään muualla Euroopassa, ja koko jokiosuus on Unescon '
        + 'maailmanperintökohde.',
      selite: 'Jokiristeilijä ohittaa Loreleyn kallion Reinin '
        + 'kapeimmassa mutkassa.',
      lahde: 'Dirk Schmidt, Wikimedia Commons (CC BY-SA 3.0)',
      wiki: 'Loreley',
    },
  },
  ITA: {
    tiedosto: 'Italy relief location map.jpg',
    lahde: 'Eric Gaba ja NordNordWest, Wikimedia Commons (CC BY-SA 3.0)',
    // Rajat sijaintikarttaperheen omasta määrittelystä (Module:Location
    // map/data/Italy). Kuvan asteikkoreunukset vastaavat niitä:
    // 9°, 12°, 15° ja 18° pituuspiirit sekä 36°, 39°, 42° ja 45°
    // leveyspiirit osuvat oikeille kohdilleen.
    rajat: { pohjoinen: 47.4, etela: 35.3, lansi: 6.2, ita: 19.0 },
    /*
     * Kuusi paikkaa, jotka kertovat maan muodon: Po-laakson teollinen
     * pohjoinen (Milano, Venetsia), keskusta (Firenze, Rooma), etelä
     * tulivuorineen (Napoli) ja saaret (Palermo). Kartalta näkee, että
     * Apenniinit kulkevat selkärankana koko saappaan läpi.
     */
    kaupungit: [
      { nimi: 'Rooma', lat: 41.903, lon: 12.496, paa: true },
      { nimi: 'Milano', lat: 45.464, lon: 9.19 },
      { nimi: 'Venetsia', lat: 45.441, lon: 12.316 },
      { nimi: 'Firenze', lat: 43.77, lon: 11.256 },
      { nimi: 'Napoli', lat: 40.852, lon: 14.268 },
      { nimi: 'Palermo', lat: 38.116, lon: 13.362 },
    ],
    /*
     * Kuvanosto kartan ja uutisten väliin (sama paikka kuin Saksan
     * Loreley). Aihe täydentää introa: intro mainitsee kaksi valtiota
     * rajojen sisällä, mutta mikään Italian sivu ei näytä niitä — ja
     * kartalla San Marinon voi etsiä itse Adrianmeren puolelta.
     * Kuva silmätarkistettu 480 px:ssä 8.8.2026.
     */
    nosto: {
      otsikko: 'Saappaan sisällä on kaksi omaa valtiota',
      tiedosto: 'Fortress of Guaita 2013-09-19.jpg',
      teksti: 'Italian rajojen sisäpuolella on kaksi valtiota, jotka '
        + 'eivät ole Italiaa. Rooman keskellä on Vatikaani, maailman '
        + 'pienin valtio: sen koko pinta-ala on alle puoli '
        + 'neliökilometriä. Toinen on San Marino, joka kiipeää Monte '
        + 'Titanon kalliolle lähelle Adrianmerta. Se kertoo olevansa '
        + 'maailman vanhin yhä toimiva tasavalta — perustamisvuodeksi '
        + 'merkitään 301 — ja sen harjanteella seisoo kolme tornia, '
        + 'jotka näkyvät myös maan lipussa. Asukkaita on noin 34 000, '
        + 'eikä rajalla ole puomia: linja-auto ajaa Riministä ylös '
        + 'vuorelle kuin mihin tahansa kaupunkiin.',
      selite: 'Guaitan torni vartioi Monte Titanon huippua San '
        + 'Marinossa.',
      lahde: 'Max Ryazanov, Wikimedia Commons (CC BY-SA 3.0)',
      wiki: 'San Marino',
    },
  },
  ESP: {
    tiedosto: 'Spain rel location map.svg',
    lahde: 'NordNordWest, Wikimedia Commons (CC BY-SA 3.0 de)',
    /*
     * Rajat sijaintikarttaperheen omasta määrittelystä (Module:Location
     * map/data/Spain). Espanjan määrittelyssä on kaksi kaavaa: manner
     * ja Kanariansaaret, jotka on piirretty kuvan oikeaan alakulmaan
     * omaan laatikkoonsa. Tässä käytetään mantereen kaavaa, ja se
     * riittää: kaikki kuusi kaupunkia ovat mantereella. Jos joskus
     * lisätään Las Palmas tai Santa Cruz, sitä EI voi asemoida näillä
     * rajoilla — laatikko on eri mittakaavassa.
     */
    rajat: { pohjoinen: 44.4, etela: 34.7, lansi: -9.9, ita: 4.8 },
    kaupungit: [
      { nimi: 'Madrid', lat: 40.417, lon: -3.704, paa: true },
      { nimi: 'Barcelona', lat: 41.387, lon: 2.169 },
      { nimi: 'Valencia', lat: 39.47, lon: -0.376 },
      { nimi: 'Sevilla', lat: 37.389, lon: -5.985 },
      { nimi: 'Granada', lat: 37.177, lon: -3.599 },
      { nimi: 'Bilbao', lat: 43.263, lon: -2.935 },
    ],
    /*
     * Nosto näyttää sen, mikä kartassa on isointa ja mitä intro vain
     * nimeää: keskellä kohoava kuiva ylätasanko. Madridin oma
     * kansisivu kertoo jo, että pääkaupunki on Euroopan korkeimmalla
     * — sitä ei toisteta tässä, vaan kerrotaan millaista ylhäällä on.
     * Kuva silmätarkistettu 480 px:ssä 8.8.2026.
     */
    nosto: {
      otsikko: 'Meseta on Espanjan kuiva katto',
      tiedosto: 'Murallas de Ávila - 01.jpg',
      teksti: 'Kartan keskeltä nousee Meseta, kuiva ylätasanko, joka '
        + 'peittää melkein puolet Espanjasta ja on keskimäärin '
        + '600–700 metrin korkeudella. Sen halki kulkee vuorijono, '
        + 'Sistema Central, joka jakaa tasangon kahtia; Madridista '
        + 'näkyy talvella sen lumihuippuja. Ylhäällä kesät ovat '
        + 'paahtavia ja talvet kylmiä, ja vanha sanonta lupaa Kastilian '
        + 'ilmastoksi yhdeksän kuukautta talvea ja kolme helvettiä. '
        + 'Tasangon laidalla seisoo Ávila 1 132 metrissä, korkeimpana '
        + 'Espanjan maakuntakaupungeista, ja sitä kiertää yhä '
        + 'kokonainen keskiaikainen muuri: 2,5 kilometriä ja 88 tornia.',
      selite: 'Ávilan keskiaikainen muuri kiertää kaupunkia Mesetan '
        + 'laidalla.',
      lahde: 'Carlos Delgado, Wikimedia Commons (CC BY-SA 3.0)',
      wiki: 'Ávila',
    },
  },
};

/*
 * Kaupunkisivun lopun kohdekartta (omistajan toive 7.8.2026: "kuin
 * huvipuiston kartassa" — mahdollisimman yksinkertainen pohja ja
 * muutama kuuluisa kohde, joista osa avaa artikkelin). Sama
 * sijaintikarttaperhe ja prosenttiasemointi kuin MAAKARTAT-taulussa.
 * Kohteen wiki on tarkistettu fi.wikipedian artikkeli; ilman wikiä
 * piste on pelkkä merkki. nimiVasen kääntää nimen pisteen
 * vasemmalle puolelle, kun oikealla olisi ahdasta.
 */
export const KAUPUNKIKARTAT = {
  kairo: {
    // Sama työkalu kuin muissa (tools/piirra-kaupunkikartta.mjs).
    // Rajaus tehtiin kahdesti: ensimmäisessä Niili jäi kuvan vasempaan
    // reunaan ja kohteet alalaitaan. Nyt joki kulkee keskeltä, Geziran
    // saari näkyy ja kohteet jakautuvat koko kuvalle.
    polku: 'assets/kartat/kairo-keskusta.png',
    lahde: '© OpenStreetMap-tekijät (ODbL)',
    rajat: { pohjoinen: 30.068, etela: 30.018, lansi: 31.198, ita: 31.278 },
    esittely: 'Kairo on Afrikan suurin kaupunki ja kasvoi kahdesta '
      + 'suunnasta: etelässä oli arabien perustama Fustat, pohjoisessa '
      + 'fatimidien 900-luvulla rakentama linnoituskaupunki al-Qahira, '
      + 'jonka nimestä tuli Kairo. Vasta 1800-luvulla väliin '
      + 'rakennettiin leveäkatuinen keskusta Pariisin malliin.\n\n'
      + 'Niili jakaa kaupungin, ja sen keskellä on Geziran saari. '
      + 'Idässä kadut kapenevat kujiksi — se osa on Unescon '
      + 'maailmanperintökohde, jossa on yli 600 suojeltua rakennusta. '
      + 'Kartan kohteista pääsee lukemaan lisää napauttamalla.',
    kohteet: [
      /*
       * Lännestä itään, jotta numerot etenevät kartalla luontevasti.
       * Wikit tarkistettu fi.wikipediasta (action=query&redirects=1);
       * Kairon tornilla ja Egyptin museolla ei ole suomenkielistä
       * artikkelia, joten ne ovat pelkkiä merkkejä — se on sallittua.
       * Al-Azharin moskeija jätettiin pois, koska se osuu käytännössä
       * samaan pisteeseen Khan el-Khalilin kanssa.
       */
      { nimi: 'Kairon torni', lat: 30.0459, lon: 31.2243 },
      { nimi: 'Egyptin museo', lat: 30.0478, lon: 31.2336 },
      { nimi: 'Tahririn aukio', lat: 30.0444, lon: 31.2357, wiki: 'Tahririn aukio' },
      { nimi: 'Ibn Tulunin moskeija', lat: 30.0288, lon: 31.2497, wiki: 'Ibn Tulunin moskeija' },
      { nimi: 'Saladinin linnoitus', lat: 30.0287, lon: 31.2599, wiki: 'Saladinin linnoitus' },
      { nimi: 'Khan el-Khalili', lat: 30.0477, lon: 31.2622, wiki: 'Khan el-Khalili' },
    ],
  },
  lontoo: {
    // Ydinkeskustan julistekartta samalla työkalulla kuin Berliinin
    // (tools/piirra-kaupunkikartta.mjs). Rajaus Hyde Parkin itälaidalta
    // Tower Bridgelle: Thames kaartaa kuvan halki, ja kaikki kuusi
    // kohdetta mahtuvat alueelle.
    polku: 'assets/kartat/lontoo-keskusta.png',
    lahde: '© OpenStreetMap-tekijät (ODbL)',
    rajat: { pohjoinen: 51.525, etela: 51.4925, lansi: -0.16, ita: -0.06 },
    esittely: 'Lontoo ei ole yksi kaupunki vaan kaksi, jotka kasvoivat '
      + 'yhteen: idässä City of London, roomalaisten muurien rajaama '
      + 'neliökilometri, jossa tehdään rahaa, ja lännessä Westminster, '
      + 'jossa tehdään päätöksiä. Väliin jäänyt maa täyttyi vähitellen '
      + 'taloilla.\n\nThames on vuorovesijoki: pinta nousee ja laskee '
      + 'Lontoon kohdalla noin seitsemän metriä kahdesti päivässä, ja '
      + 'laskuveden aikaan rannalta löytyy yhä savipiippuja ja '
      + 'keskiaikaisia nuppineuloja. Kartan kohteista pääsee lukemaan '
      + 'lisää napauttamalla.',
    kohteet: [
      {
        nimi: 'Buckinghamin palatsi',
        lat: 51.5014,
        lon: -0.1419,
        wiki: 'Buckinghamin palatsi',
        aika: '1837',
        teksti: 'Palatsi ei ollut alun perin palatsi vaan tavallinen '
            + 'kaupunkitalo. Buckingham House rakennettiin 1703 herttualle, '
            + 'ja kuningas Yrjö III osti sen 1761 vaimolleen Charlottelle '
            + 'kodiksi. Talo tunnettiin pitkään nimellä kuningattaren talo, '
            + 'ja siellä syntyi 14 Charlotten 15 lapsesta.'
          + '\n\n'
          + 'Ensimmäinen hallitsija, joka todella muutti sisään, oli '
            + 'Viktoria 1837. Talo oli silloin surkeassa kunnossa. Savupiiput '
            + 'savusivat niin pahasti, että tulet piti antaa sammua, joten '
            + 'huoneet olivat kylmiä, ja ilmanvaihto oli niin huono, että '
            + 'sisällä haisi. Prinssi Albert korjautti viat vuoteen 1840 '
            + 'mennessä.'
          + '\n\n'
          + 'Sisään pääsi silti kuka tahansa sitkeä. Nelitoistavuotias '
            + 'Edward Jones murtautui palatsiin kolme kertaa 1838–1841. '
            + 'Kerran palvelusväki löysi hänet sohvan alta piiloutuneena, '
            + 'toisella kerralla hänet napattiin varastamasta ruokaa '
            + 'ruokakomerosta. Lehdet tekivät pojasta kuuluisuuden.'
          + '\n\n'
          + 'Kuuluisin osa on parveke, ja se on koko rakennuksen nuorimpia. '
            + 'Itäsiipi pystytettiin 1847–1849, ja työ maksettiin myymällä '
            + 'kuninkaan huvila Brightonissa. Julkisivu, jonka kaikki '
            + 'tunnistavat, verhoiltiin Portlandin kivellä vasta 1913. '
            + 'Huoneita on 775 ja puutarha on Lontoon suurin yksityinen '
            + 'puutarha.'
          + '\n\n'
          + 'Toisessa maailmansodassa palatsiin osui pommeja yhdeksän '
            + 'kertaa. Pahin isku tuhosi palatsin kappelin 1940, ja yksi '
            + 'pommi putosi sisäpihalle kuningasparin ollessa kotona. Heidät '
            + 'kuvattiin kiertämässä rikkoutunutta kotiaan, ja filmi '
            + 'näytettiin elokuvateattereissa ympäri maata.'
          + '\n\n'
          + 'Portille tullaan yhä sanomaan asioita ääneen. Toukokuussa 1914 '
            + 'poliisi kantoi Emmeline Pankhurstin pois palatsin aidan '
            + 'edestä, kun tämä yritti viedä kuninkaalle vetoomusta naisten '
            + 'äänioikeudesta. Katolla liehuva lippu kertoo, onko hallitsija '
            + 'kotona: oma kuninkaallinen lippu jos on, Union-lippu jos ei.',
        lainaus: {
          teksti: 'Olen iloinen, että meitä pommitettiin. Nyt voin katsoa East '
            + 'Endiä silmiin.',
          lahde: 'Kuningatar Elisabet syyskuussa 1940, kun pommi oli osunut palatsiin',
        },
        kuvat: [
          {
            tiedosto: 'Buckingham Palace, London - April 2009.jpg',
            selite: 'Palatsin itäjulkisivu The Mallin päästä. Vasemmalla '
              + 'Viktorian muistomerkki kullattuine voitonenkeleineen, '
              + 'katolla lipputanko, edessä kukkapenkit ja kadun täydeltä '
              + 'ihmisiä.',
            lahde: 'Diliff, Wikimedia Commons (CC BY-SA 3.0)',
          },
          {
            tiedosto: 'Guard of Buckingham Palace - 01.jpg',
            selite: 'Vartiomies vartiokopissaan palatsin keskiholvikäytävän '
              + 'vieressä. Toinen koppi on tyhjä, ja mustakullatut '
              + 'lyhtypylväät reunustavat porttia.',
            lahde: 'Carlos Delgado, Wikimedia Commons (CC BY-SA 3.0)',
          },
          {
            tiedosto: 'Band of the Welsh Guards, Buckingham Palace, London - Diliff.jpg',
            selite: 'Walesin kaartin soittokunta marssii palatsilta punatakeissa '
              + 'ja karhunnahkalakeissa. Taustalla näkyy Viktorian '
              + 'muistomerkin kullattu huippu.',
            lahde: 'Diliff, Wikimedia Commons (CC BY-SA 3.0)',
          },
          {
            tiedosto: 'Mrs Emmeline Pankhurst, Leader of the Women\'s Suffragette movement, is arrested outside Buckingham Palace while trying to present a petition to King George V in May 1914. Q81486.jpg',
            selite: 'Poliisi kantaa Emmeline Pankhurstin jalat irti maasta pois '
              + 'palatsin aidan edestä toukokuussa 1914. Ympärillä kävelee '
              + 'knalliin ja olkihattuun pukeutuneita miehiä.',
            lahde: 'Tuntematon valokuvaaja, Wikimedia Commons (PD)',
          },
        ],
      },
      {
        nimi: 'Trafalgar Square',
        lat: 51.508,
        lon: -0.1281,
        wiki: 'Trafalgar Square',
        aika: '1844',
        teksti: 'Ennen aukiota tässä olivat kuninkaan tallit. Paikan vanha nimi '
            + 'King\'s Mews tulee haukoista: mew tarkoitti sulkasatoa, ja '
            + 'täällä pidettiin metsästyshaukkoja siihen aikaan vuodesta, kun '
            + 'ne vaihtoivat höyhenensä. Kun tallit siirrettiin Buckinghamin '
            + 'palatsiin, tontti vapautui, ja aukio avattiin yleisölle 1844.'
          + '\n\n'
          + 'Keskellä seisova pylväs pystytettiin 1840–1843 muistoksi '
            + 'meritaistelusta, jonka Horatio Nelson voitti 1805 ja jossa hän '
            + 'kuoli. Suunnitelmassa pylväs oli 66 metriä korkea, mutta se '
            + 'leikattiin 44 metriin, koska niin korkeaa pidettiin '
            + 'vaarallisena. Aukio sai Trafalgarin nimen vasta 1835.'
          + '\n\n'
          + 'Leijonat tulivat vasta 1867, yli kaksikymmentä vuotta patsaan '
            + 'jälkeen. Kuvanveistäjä Edwin Landseer pyysi eläintarhasta '
            + 'kuolleen leijonan malliksi, mutta piirsi niin hitaasti, että '
            + 'raato ehti mädäntyä ja loput oli keksittävä. Siksi tassut '
            + 'muistuttavat enemmän kissan kuin leijonan tassuja. Yksi '
            + 'leijona painaa seitsemän tonnia.'
          + '\n\n'
          + 'Aukion alla on toisia leijonia. Kun eteläreunaan rakennettiin '
            + '1950-luvulla, maasta löytyi noin 120 000 vuotta vanhoja luita: '
            + 'luolaleijonia, sarvikuonoja, metsänorsuja ja virtahepoja. '
            + 'Silloin Thamesin ranta oli lämmin ja soinen, ja virtahevot '
            + 'makasivat siinä, missä nyt istutaan suihkulähteen reunalla.'
          + '\n\n'
          + 'Tästä paikasta mitataan kaikki etäisyydet Lontooseen. '
            + 'Nollapiste ei ole pylväs vaan aukion eteläkulmassa seisova '
            + 'Kaarle I:n ratsastajapatsas, joka merkitsee vanhan Charing '
            + 'Crossin paikkaa. Kun tienviitassa lukee, montako mailia '
            + 'Lontooseen on, luku on mitattu juuri tähän hevoseen asti.'
          + '\n\n'
          + 'Aukio oli pitkään kuuluisa kyyhkyistään. Parvi kasvoi '
            + 'pahimmillaan noin 35 000 linnun kokoiseksi, ja lintujen '
            + 'jätökset söivät kiveä niin pahasti, että pylvään puhdistus '
            + 'maksoi 140 000 puntaa. Siemenmyynti lopetettiin 2001 ja '
            + 'ruokinta kiellettiin 2003. Tilalle tuotiin haukka, joka lentää '
            + 'aukiolla säännöllisesti.',
        lainaus: {
          teksti: 'Englanti odottaa jokaisen tekevän velvollisuutensa.',
          lahde: 'Horatio Nelsonin lippuviesti laivastolleen Trafalgarin taistelun alkaessa 21. lokakuuta 1805',
        },
        kuvat: [
          {
            tiedosto: 'Trafalgar Square (21178394832).jpg',
            selite: 'Aukio kesäpäivänä: Nelsonin pylväs keskellä, suihkulähde '
              + 'käynnissä ja ihmisiä istumassa altaan reunalla. Reunoilla '
              + 'punaisia busseja.',
            lahde: 'Markus Trienke, Wikimedia Commons (CC BY-SA 2.0)',
          },
          {
            tiedosto: 'Landseer Lion, Trafalgar Square, London - geograph.org.uk - 6823604.jpg',
            selite: 'Kaksi Landseerin pronssileijonaa graniittijalustoillaan. '
              + 'Pieni tyttö istuu leijonan tassun päällä, ja koko on helppo '
              + 'nähdä ihmisistä.',
            lahde: 'habiloid, Wikimedia Commons (CC BY-SA 2.0)',
          },
          {
            tiedosto: 'Trafalgar Square met Nelson Column, Londen Trafalgar Square, London (titel op object), RP-F-F16341.jpg',
            selite: 'Seepianruskea valokuva aukiosta 1800-luvun lopulta. Pylvään '
              + 'ympärillä on hevosvaunuja ja omnibusseja, ja taustalla '
              + 'kohoaa kansallisgallerian kupoli.',
            lahde: 'Tuntematon valokuvaaja (Rijksmuseum), Wikimedia Commons (CC0)',
          },
          {
            tiedosto: 'London MMB 31 Trafalgar Square.jpg',
            selite: 'Nelson pylvään huipulla lähikuvassa: kolmikolkkahattu, tyhjä '
              + 'hiha ja miekka. Alla korinttilainen kapiteeli, joka on '
              + 'valettu pronssista.',
            lahde: 'mattbuck, Wikimedia Commons (CC BY-SA 3.0)',
          },
        ],
      },
      {
        nimi: 'Big Ben',
        lat: 51.5007,
        lon: -0.1246,
        wiki: 'Big Ben',
        aika: '1859',
        teksti: 'Big Ben ei ole torni. Se on kello, joka roikkuu tornin '
            + 'huipulla ja painaa 13,7 tonnia. Torni itse oli vain '
            + 'Kellotorni, kunnes se nimettiin 2012 Elisabetin torniksi. '
            + 'Korkeutta on 96 metriä ja huipulle nousee 334 porrasta — hissi '
            + 'tuli vasta vuosien 2017–2021 remontissa vanhaan '
            + 'ilmanvaihtokuiluun.'
          + '\n\n'
          + 'Ensimmäinen kello halkesi jo koekäytössä, ja uusi valettiin '
            + 'huhtikuussa 1858 Whitechapelin kellovalimossa. Se vedettiin '
            + 'valimolta tornille kärryillä, joita veti kuusitoista hevosta '
            + 'väkijoukon hurratessa. Nosto 61 metriä ylös kellohuoneeseen '
            + 'kesti 18 tuntia.'
          + '\n\n'
          + 'Syyskuussa 1859 uusikin kello halkesi. Syy oli vasara, joka '
            + 'painoi yli kaksi kertaa enemmän kuin oli sallittu. Kolmeen '
            + 'vuoteen Big Ben ei soinut lainkaan. Korjaukseksi reunasta '
            + 'lohkaistiin neliönmuotoinen pala ja kelloa käännettiin '
            + 'kahdeksasosakierros, jotta vasara osuisi ehjään kohtaan.'
          + '\n\n'
          + 'Halkeamaa ei koskaan korjattu, ja juuri se antaa Big Benille '
            + 'sen oman soinnin. Kello käy silti sekunnin tarkkuudella, ja '
            + 'sitä säädetään rahoilla: heilurin päällä on pino vanhoja '
            + 'pennejä. Yksi penni muuttaa käyntinopeutta 0,4 sekuntia '
            + 'vuorokaudessa. Koneisto vedetään käsin kolmesti viikossa.'
          + '\n\n'
          + 'Kellotaulut ovat lähes 7 metriä leveitä, ja jokaisessa on 324 '
            + 'palaa opaalilasia. Taulujen alareunassa kiertää '
            + 'latinankielinen rukous, joka kaiverrettiin siihen kuningatar '
            + 'Viktorian aikana ja on siellä edelleen.'
          + '\n\n'
          + 'Torni myös nojaa. Se seisoo savimaan päällä ja kallistuu '
            + 'huipultaan noin puoli metriä luoteeseen. Kellohuoneen yllä '
            + 'palaa lyhty nimeltä Ayrton Light, joka sytytettiin 1873 '
            + 'palamaan aina kun alahuone istuu pimeän tultua. Se suunnattiin '
            + 'alun perin Buckinghamin palatsiin, jotta Viktoria näki '
            + 'ikkunastaan, olivatko kansanedustajat yhä töissä.',
        lainaus: {
          teksti: 'DOMINE SALVAM FAC REGINAM NOSTRAM VICTORIAM PRIMAM — Herra, '
            + 'varjele kuningattaremme Viktoria ensimmäistä.',
          lahde: 'Kaikkien neljän kellotaulun alareunaan kaiverrettu teksti',
        },
        kuvat: [
          {
            tiedosto: 'Big Ben at sunset - 2014-10-27 17-30.jpg',
            selite: 'Torni hämärässä, kellotaulu valaistuna. Etualalla bussien '
              + 'valojuovat venyvät Westminsterin sillan yli, vasemmalla '
              + 'parlamenttitalon huiput.',
            lahde: 'Colin, Wikimedia Commons (CC BY-SA 4.0)',
          },
          {
            tiedosto: 'BIg Ben - Whitechapel Foundary drawing.jpg',
            selite: 'Valimon käsin väritetty piirustus vuodelta 1859: kello '
              + 'leikattuna halki ja sen oikealla puolella lyömävasara '
              + 'mittoineen.',
            lahde: 'Whitechapel Bell Foundry, Wikimedia Commons (PD)',
          },
          {
            tiedosto: 'London Big Ben Inner Clock Face 1070925-PSD.jpg',
            selite: 'Kellotaulu läheltä. Alareunassa erottuu selvästi '
              + 'latinankielinen kaiverrus, ja lasiruudut muodostavat '
              + 'verkkomaisen kuvion viisarien takana.',
            lahde: 'Ermell, Wikimedia Commons (CC BY-SA 4.0)',
          },
          {
            tiedosto: 'Westminster Clock (Big Ben) – mechanism plan, c.1854 (design by Edmund Beckett Denison; made by E J Dent).png',
            selite: 'Koneiston alkuperäinen piirustus vuodelta 1854. Kolme '
              + 'rinnakkaista rataslinjaa hoitavat käynnin, tuntilyönnin ja '
              + 'neljännessoiton; alla riippuu heiluri.',
            lahde: 'Edmund Beckett Denison, Wikimedia Commons (PD)',
          },
          {
            tiedosto: 'Houses of Parliament, London LCCN92518735.jpg',
            selite: 'Värjätty valokuva parlamenttitalosta joelta noin vuodelta '
              + '1890. Kellotorni oikealla, Viktorian torni lippuineen '
              + 'vasemmalla, edessä lastiproomuja ja hinaaja.',
            lahde: 'Library of Congress, Wikimedia Commons (PD)',
          },
        ],
      },
      {
        nimi: 'Lontoon silmä',
        lat: 51.5033,
        lon: -0.1196,
        wiki: 'London Eye',
        aika: '2000',
        teksti: 'Pyörä on 135 metriä korkea ja kehältään 120 metriä leveä, '
            + 'mutta oudointa siinä on tuki. Se roikkuu vain toiselta '
            + 'puolelta, A-kirjaimen muotoisen jalustan varassa, kuten '
            + 'polkupyörän eturenkaan pinnat yhdellä haarukalla. Toista yhtä '
            + 'korkeaa näin tuettua maisemapyörää ei maailmassa ole.'
          + '\n\n'
          + 'Idea syntyi kilpailussa, jossa etsittiin vuosituhannen '
            + 'vaihteen merkkirakennusta Lontooseen. Tuomaristo ei pitänyt '
            + 'yhtäkään ehdotusta tarpeeksi rohkeana eikä valinnut voittajaa '
            + 'lainkaan. Suunnittelijat David Marks ja Julia Barfield '
            + 'kiinnittivät oman talonsa pankkiin ja veivät hankkeen '
            + 'eteenpäin itse.'
          + '\n\n'
          + 'Pyörää ei nostettu paikalleen valmiina. Osat tuotiin jokea '
            + 'pitkin proomuilla, ja koko kehä koottiin makuulleen Thamesin '
            + 'päälle rakennetuille paalulautoille. Sitten sitä nostettiin '
            + 'pystyyn kaksi astetta tunnissa. Kun kulma oli 65 astetta, työ '
            + 'pysäytettiin viikoksi ja insinöörit valmistelivat loppunoston.'
          + '\n\n'
          + 'Kapseleita on 32, yksi jokaista Lontoon kaupunginosaa kohti. '
            + 'Ne on numeroitu 1–33, koska numeroa 13 ei ole lainkaan. Yksi '
            + 'kapseli painaa 10 tonnia ja siihen mahtuu 25 ihmistä, jotka '
            + 'saavat kävellä sisällä vapaasti.'
          + '\n\n'
          + 'Pyörä pyörii 26 senttiä sekunnissa eli hitaammin kuin ihminen '
            + 'kävelee. Siksi se ei pysähdy lainkaan, vaan kyytiin astutaan '
            + 'sen liikkuessa. Yksi kierros kestää puoli tuntia. Ylimmässä '
            + 'kohdassa kapseli on 135 metrin korkeudessa, ja se oli Lontoon '
            + 'korkein yleisölle avoin näköalapaikka vuoteen 2013 asti, '
            + 'kunnes Shard-pilvenpiirtäjä ohitti sen.'
          + '\n\n'
          + 'Alun perin pyörän piti olla väliaikainen: lupa myönnettiin '
            + 'viideksi vuodeksi. Pääministeri avasi sen juhlallisesti '
            + 'uudenvuodenaattona 1999, mutta yleisö pääsi kyytiin vasta '
            + 'maaliskuussa 2000, koska yhden kapselin kytkin ei toiminut. '
            + 'Nyt se on Britannian suosituin maksullinen nähtävyys.',
        kuvat: [
          {
            tiedosto: 'London eye and county hall pano edited 2008-02-19.jpg',
            selite: 'Koko pyörä joen toiselta rannalta. Kehää kannattavat ohuet '
              + 'teräsvaijerit kuin polkupyörän pinnat, ja kapselit erottuvat '
              + 'kehän ulkoreunalla. Oikealla County Hall.',
            lahde: 'Kim Hansen, Wikimedia Commons (CC BY-SA 4.0)',
          },
          {
            tiedosto: 'The London Eye Under Construction - August 1999.jpg',
            selite: 'Elokuu 1999: kehä makaa vielä vaakatasossa joen päälle '
              + 'rakennetuilla lautoilla, ympärillä nostureita ja hinaajia. '
              + 'Oikealla County Hallin kivijulkisivu.',
            lahde: 'Jim Linwood, Wikimedia Commons (CC BY 2.0)',
          },
          {
            tiedosto: 'London Eye Capsule, 2026-03-31.jpg',
            selite: 'Näkymä kapselista seuraavaan: ihmiset seisovat lasikapselin '
              + 'sisällä, alla kaartuu Thames siltoineen ja edessä '
              + 'levittäytyy kaupunki horisonttiin asti.',
            lahde: 'Andrew Bone, Wikimedia Commons (CC BY 4.0)',
          },
          {
            tiedosto: 'London Eye Twilight April 2006.jpg',
            selite: 'Pyörä iltahämärässä puistokäytävän päässä. Puut on '
              + 'koristeltu sinisillä valoilla, ja kehän reuna hehkuu '
              + 'lämpimänä.',
            lahde: 'Diliff, Wikimedia Commons (CC BY 2.5)',
          },
        ],
      },
      {
        nimi: 'Pyhän Paavalin katedraali',
        lat: 51.5138,
        lon: -0.0984,
        wiki: 'Pyhän Paavalin katedraali',
        aika: '1675–1710',
        teksti: 'Nykyinen kirkko on jo viides samalla kukkulalla. Ensimmäinen '
            + 'rakennettiin 600-luvun alussa, ja edellinen, valtava '
            + 'goottilainen katedraali, tuhoutui suurpalossa 1666. Uuden '
            + 'suunnittelija Christopher Wren oli koulutukseltaan '
            + 'tähtitieteilijä. Rakennusten piirtämisestä tuli hänelle '
            + 'sivutyö, joka kesti loppuelämän.'
          + '\n\n'
          + 'Wren teki ehdotuksestaan valtavan puumallin, jonka sisään '
            + 'pystyi kävelemään. Se hylättiin, ja pettynyt Wren päätti, '
            + 'ettei tee enää malleja eikä näytä piirustuksiaan kenellekään '
            + 'kesken työn. Malli seisoo yhä katedraalissa, ja siitä näkee '
            + 'kirkon, jota ei koskaan rakennettu.'
          + '\n\n'
          + 'Kupoli näyttää yksinkertaiselta, mutta niitä on kolme '
            + 'sisäkkäin. Alimpana on matala kupoli, jonka näkee '
            + 'kirkkosalista. Sen päällä nousee piiloon jäävä tiilikartio, '
            + 'joka kantaa kivilyhdyn painon. Päällimmäisenä on puusta ja '
            + 'lyijystä tehty ulkokuori, joka näyttää kaupungille komealta. '
            + 'Ketjut estävät kartiota leviämästä.'
          + '\n\n'
          + 'Kupolin sisäreunaa kiertää 30 metrin korkeudessa '
            + 'Kuiskausgalleria. Seinää vasten kuiskattu sana kulkee pyöreää '
            + 'seinämää pitkin ja kuuluu selvästi gallerian toisella puolella '
            + 'yli kolmenkymmenen metrin päässä. Ylös nousee 259 porrasta, ja '
            + 'lattia näkyy alhaalla mustavalkoisena ruutukuviona.'
          + '\n\n'
          + 'Pommitusten aikana kirkosta tuli koko maan symboli. Syyskuussa '
            + '1940 katedraalin viereen uponnut aikasytytteinen pommi '
            + 'kaivettiin varovasti esiin ja vietiin pois. Kun se myöhemmin '
            + 'räjäytettiin turvallisessa paikassa, jälkeen jäi 30 metriä '
            + 'leveä kuoppa. Joulukuun 29. yönä 1940 otettu valokuva savun '
            + 'keskellä seisovasta kupolista kiersi maailman.'
          + '\n\n'
          + 'Wren kuoli 91-vuotiaana 1723 ja on haudattu oman kirkkonsa '
            + 'kryptaan. Hänen hautakivensä on tarkoituksella tavallinen ja '
            + 'kirjoitus lyhyt. Sama lause on kaiverrettu myös mustaan '
            + 'marmoriin keskelle kirkon lattiaa, suoraan kupolin alle.',
        lainaus: {
          teksti: 'Lukija, jos etsit hänen muistomerkkiään — katso ympärillesi.',
          lahde: 'Christopher Wrenin hautakiven latinankielinen teksti kryptassa: LECTOR SI MONUMENTUM REQUIRIS CIRCUMSPICE',
        },
        kuvat: [
          {
            tiedosto: 'St Paul\'s Cathedral Dome 2020 Exterior Ground.jpg',
            selite: 'Kupoli läheltä. Lyijypinta on jaettu kaariin, huipulla on '
              + 'kivinen lyhty ja sen päällä kullattu pallo ja risti. Alla '
              + 'kiertää pylväsrivi.',
            lahde: 'Julian Herzog, Wikimedia Commons (CC BY 4.0)',
          },
          {
            tiedosto: 'The Great Model, St. Paul\'s Cathedral-24717030761.jpg',
            selite: 'Wrenin hylätty puumalli holvatussa salissa. Malli on niin '
              + 'suuri, että sen kylkeen tehdystä oviaukosta mahtuu ihminen '
              + 'sisään katsomaan.',
            lahde: 'The National Churches Trust, Wikimedia Commons (CC BY 2.0)',
          },
          {
            tiedosto: 'St Paul\'s Cathedral Nave, London, UK - Diliff.jpg',
            selite: 'Kirkkosali kohti kupolia. Lattia on mustavalkoista '
              + 'marmoriruutua, tuolirivit johtavat eteenpäin, ja kullatut '
              + 'kruunut riippuvat vaaleiden kaarien välissä.',
            lahde: 'Diliff, Wikimedia Commons (CC BY-SA 3.0)',
          },
          {
            tiedosto: 'St Paul\'s Cathedral – Whispering Gallery.jpg',
            selite: 'Näkymä Kuiskausgalleriasta alas. Kupolin maalaukset '
              + 'kaartuvat yllä, ja ruutulattia näkyy syvällä alhaalla '
              + 'pienine ihmisineen.',
            lahde: 'JackPeasePhotography, Wikimedia Commons (CC BY 2.0)',
          },
          {
            tiedosto: 'St Paul\'s Survives.jpg',
            selite: 'Kupoli kohoaa savupilvien yläpuolelle joulukuun 1940 '
              + 'pommitusyönä. Etualalla palavien talojen katot ja oikealla '
              + 'tulen kajo.',
            lahde: 'Herbert Mason, Wikimedia Commons (PD)',
          },
        ],
      },
      {
        nimi: 'Tower Bridge',
        lat: 51.5055,
        lon: -0.0754,
        wiki: 'Tower Bridge',
        aika: '1886–1894',
        teksti: 'Sillan piti ratkaista mahdoton tehtävä: itä-Lontoo tarvitsi '
            + 'ylityspaikan, mutta purjelaivojen oli yhä päästävä satamaan '
            + 'sillan kohdalta. Ehdotuksia tuli yli viisikymmentä. Laki '
            + 'määräsi lopulta, että aukon on oltava 61 metriä leveä ja '
            + 'avattuna 41 metriä korkea — ja että silta avataan laivalle '
            + 'koska tahansa, ruuhkasta riippumatta.'
          + '\n\n'
          + 'Tornit näyttävät keskiaikaisilta, mutta se on kuori. Sisällä '
            + 'on teräsluuranko, johon meni yli 11 000 tonnia terästä. Päälle '
            + 'ladottiin cornwallilaista graniittia ja Portlandin '
            + 'kalkkikiveä, koska laki vaati, että uuden sillan pitää sopia '
            + 'yhteen viereisen Lontoon Towerin kanssa.'
          + '\n\n'
          + 'Avautuva osa on jaettu kahteen läppään, ja kumpikin painaa '
            + 'noin 1 070 tonnia. Vastapainot tekevät nostosta niin kevyen, '
            + 'että läpät nousevat viidessä minuutissa. Ensimmäisen vuoden '
            + 'aikana silta avattiin 6 160 kertaa, keskimäärin 17 kertaa '
            + 'päivässä. Laivalla on yhä etuajo-oikeus auton edelle.'
          + '\n\n'
          + 'Tornien väliin rakennettiin yläkäytävät, jotta jalankulkijat '
            + 'pääsisivät yli sillan ollessa auki. Kukaan ei kuitenkaan '
            + 'jaksanut kiivetä portaita, ja käytävistä tuli taskuvarkaiden '
            + 'paikka. Ne suljettiin 1910 ja avattiin uudelleen 1982. Vuonna '
            + '2014 niihin asennettiin lasilattiat, joiden läpi näkee 42 '
            + 'metriä alas.'
          + '\n\n'
          + 'Joulukuun lopussa 1952 bussi oli sillalla, kun eteläinen läppä '
            + 'alkoi vahingossa nousta. Kuljettaja Albert Gunter painoi '
            + 'kaasun pohjaan ja hyppäsi lähes kahden metrin kuilun yli '
            + 'pohjoiselle läpälle, joka ei ollut vielä liikkunut. Rahastaja '
            + 'mursi jalkansa, ja kuljettaja sai kymmenen punnan bonuksen.'
          + '\n\n'
          + 'Silta sekoitetaan jatkuvasti naapuriinsa London Bridgeen. Kun '
            + 'vanha London Bridge myytiin 1968 amerikkalaiselle '
            + 'liikemiehelle ja koottiin uudelleen Arizonan aavikolle, syntyi '
            + 'sitkeä tarina, että ostaja luuli saavansa juuri tämän sillan. '
            + 'Ostaja kiisti sen koko loppuikänsä. Silta seisoo yhä Lake '
            + 'Havasu Cityssä.',
        kuvat: [
          {
            tiedosto: 'Puente de la Torre, Londres, Inglaterra, 2022-11-26, DD 145.jpg',
            selite: 'Silta läheltä joelta. Kaksi kivistä tornia, niiden välissä '
              + 'yläkäytävät, ja sivuille kaartuvat siniset riippuketjut.',
            lahde: 'Diego Delso, Wikimedia Commons (CC BY-SA 4.0)',
          },
          {
            tiedosto: 'View of the raised bascule of Tower Bridge - geograph.org.uk - 4072106.jpg',
            selite: 'Läppä pystyssä ajoradan tasolta katsottuna: tie seisoo '
              + 'mustana seinänä, keskiviiva pystysuorassa. Punainen '
              + 'liikennevalo palaa ja ihmiset odottavat.',
            lahde: 'Robert Lamb, Wikimedia Commons (CC BY-SA 2.0)',
          },
          {
            tiedosto: 'Cassier\'s Magazine - The Tower Bridge, London, on the Opening Day, June 30, 1894.jpg',
            selite: 'Avajaispäivä 30. kesäkuuta 1894 ylhäältä kuvattuna. Läpät '
              + 'ovat pystyssä, höyrylaivat kulkevat alitse ja rannat ovat '
              + 'mustanaan väkeä.',
            lahde: 'Valentine & Sons, Wikimedia Commons (PD)',
          },
          {
            tiedosto: 'Tower Bridge walkway.jpg',
            selite: 'Yläkäytävän lasilattia. Kengät seisovat lasin päällä, ja sen '
              + 'läpi näkyy ajorata autoineen ja pyöräilijöineen kymmenien '
              + 'metrien alapuolella.',
            lahde: 'Tristan Surtel, Wikimedia Commons (CC BY-SA 4.0)',
          },
          {
            tiedosto: 'London Bridge, Lake Havasu City, Arizona (3227888290).jpg',
            selite: 'Vanha London Bridge uudessa paikassaan Arizonassa. Samat '
              + 'harmaat kiviholvit kaartuvat vihertävän veden yli, taustalla '
              + 'palmuja ja aavikkotaloja.',
            lahde: 'Ken Lund, Wikimedia Commons (CC BY-SA 2.0)',
          },
        ],
      },
    ],
  },
  berliini: {
    /*
     * Ydinkeskustan julistekartta (omistajan tarkennus 7.8.2026:
     * ensimmäinen versio oli "liian epämääräinen ja liian laajalta
     * alalta" — malliksi näytetty Mapiful-juliste). Piirretty itse
     * OpenStreetMap-aineistosta pelin sävyihin:
     * tools/piirra-kaupunkikartta.mjs. Paikallinen tiedosto — ei
     * riipu verkosta eikä Commonsista.
     */
    polku: 'assets/kartat/berliini-keskusta.png',
    lahde: '© OpenStreetMap-tekijät (ODbL)',
    rajat: { pohjoinen: 52.54, etela: 52.485, lansi: 13.34, ita: 13.46 },
    esittely: 'Berliini on rakennettu veden ja metsän keskelle: '
      + 'siltoja on noin 1 700 — moninkertaisesti Venetsian verran — '
      + 'ja kolmasosa kaupungista on puistoa, metsää tai järveä. '
      + 'Vaakunassa seisoo musta karhu, ja karhupatsaita tulee '
      + 'kaduilla vastaan vähän väliä.\n\nKylmän sodan jäljet näkyvät '
      + 'yhä: muurin linja on merkitty keskustaan katukiveyksen '
      + 'kaksoisrivinä, ja idän ja lännen katuvalot hohtavat öisin '
      + 'eri sävyissä. Kartan kohteista pääsee lukemaan lisää '
      + 'napauttamalla.',
    kohteet: [
      /*
       * Järjestys on kartan numerointi (omistajan taittopäätös
       * 7.8.2026: numeroympyrät kartalla, selitteet tekstinä sen
       * ulkopuolella) — lännestä itään, jotta numerot etenevät
       * kartalla luontevasti. Jokaisen wiki on tarkistettu
       * fi.wikipedian artikkeli.
       */
      { nimi: 'Valtiopäivätalo', lat: 52.5186, lon: 13.3762, wiki: 'Valtiopäivätalo (Saksa)' },
      { nimi: 'Brandenburgin portti', lat: 52.5163, lon: 13.3777, wiki: 'Brandenburgin portti' },
      { nimi: 'Checkpoint Charlie', lat: 52.5076, lon: 13.3904, wiki: 'Checkpoint Charlie' },
      { nimi: 'Museosaari', lat: 52.5169, lon: 13.401, wiki: 'Museumsinsel' },
      { nimi: 'Tv-torni', lat: 52.5208, lon: 13.4094, wiki: 'Berliinin televisiotorni' },
      { nimi: 'East Side Gallery', lat: 52.505, lon: 13.4399, wiki: 'East Side Gallery' },
    ],
  },
  madrid: {
    /*
     * Sama työkalu kuin muissa. Madrid oli näistä vaikein rajata:
     * ydinkeskusta on tiheää pikkukatua ilman jokea tai rantaa, ja
     * ensimmäinen väljempi rajaus muuttui pelkäksi verkoksi, jossa
     * mikään ei erottunut. Kiristetty rajaus tuo esiin sen, mikä
     * Madridissa on selkärankaa: Retiron puisto idässä, kuninkaanlinnan
     * puutarhat lännessä ja niiden välissä Prado-akseli.
     */
    polku: 'assets/kartat/madrid-keskusta.png',
    lahde: '© OpenStreetMap-tekijät (ODbL)',
    rajat: { pohjoinen: 40.43, etela: 40.406, lansi: -3.72, ita: -3.675 },
    esittely: 'Madrid oli pieni linnoituskaupunki, kunnes kuningas '
      + 'Filip II siirsi hovinsa tänne vuonna 1561. Sen jälkeen '
      + 'kaupunki kasvoi ulospäin keskustastaan kuin puu '
      + 'vuosirenkaineen, ja kartalla se näkyy yhä: vanhat kadut '
      + 'mutkittelevat kapeina, uudemmat kulkevat suorina ja '
      + 'leveinä.\n\nPuerta del Solin kiveyksessä on laatta, josta '
      + 'Espanjan tiet mitataan: se on kilometri nolla, ja maan '
      + 'päätiet lähtevät siitä ulospäin kuin kellotaulun viisarit. '
      + 'Kartan itälaidan iso vihreä on Retiro, entinen kuninkaan '
      + 'puutarha, joka siirtyi kaupungille ja kaikkien käyttöön vasta '
      + '1868. Kartan kohteista pääsee lukemaan lisää napauttamalla.',
    kohteet: [
      /*
       * Lännestä itään, eli kuninkaanlinnalta Retiron portille.
       * Jokaisen wiki on tarkistettu fi.wikipedian artikkeli;
       * Gran Vía ja Retiron puisto jäivät pois, koska niistä ei ole
       * suomenkielistä artikkelia.
       */
      { nimi: 'Kuninkaanlinna', lat: 40.418, lon: -3.7143, wiki: 'Palacio Real de Madrid' },
      { nimi: 'Plaza Mayor', lat: 40.4155, lon: -3.7074, wiki: 'Plaza Mayor' },
      { nimi: 'Puerta del Sol', lat: 40.4169, lon: -3.7033, wiki: 'Puerta del Sol' },
      { nimi: 'Cibeleen aukio', lat: 40.4192, lon: -3.6931, wiki: 'Plaza de Cibeles' },
      { nimi: 'Prado-museo', lat: 40.4138, lon: -3.6921, wiki: 'Museo del Prado' },
      { nimi: 'Alcalán portti', lat: 40.42, lon: -3.6889, wiki: 'Puerta de Alcalá' },
    ],
  },
  venetsia: {
    /*
     * Sama työkalu kuin muissa. Venetsia on kartantekijälle poikkeus
     * kahdesti: kujat ovat OSM:ssä jalankulkuteitä (yli 5 000
     * pedestrian-tietä rajauksen sisällä, mikä on juuri se ohuin
     * katuluokka) ja laguuni on rantaviiva eikä vesialue, joten se
     * jää paperin väriseksi. Siksi rajaus on kiristetty saariryhmän
     * ympärille: ensimmäinen, väljempi rajaus jätti oikeaan
     * yläkulmaan ison tyhjän laguunin.
     */
    polku: 'assets/kartat/venetsia-keskusta.png',
    lahde: '© OpenStreetMap-tekijät (ODbL)',
    rajat: { pohjoinen: 45.445, etela: 45.4265, lansi: 12.3155, ita: 12.352 },
    esittely: 'Venetsia on rakennettu 118 saarelle keskelle matalaa '
      + 'laguunia. Talot seisovat miljoonien puupaalujen varassa, '
      + 'jotka lyötiin pohjamutaan satoja vuosia sitten ja ovat '
      + 'säilyneet hapettomassa liejussa kovina kuin kivi. Saaret on '
      + 'ommeltu yhteen sadoilla silloilla, ja jokainen niistä '
      + 'ylitetään jalan.\n\nKartan halki kaartaa S-kirjaimen '
      + 'muotoinen Canal Grande, kaupungin pääkatu: se on lähes neljä '
      + 'kilometriä pitkä, ja sen yli pääsee kuivin jaloin vain '
      + 'neljästä kohdasta. Muualla kanavan ylittää traghetto, iso '
      + 'gondoli, jossa matkustajat seisovat koko matkan ajan. Kartan '
      + 'kohteista pääsee lukemaan lisää napauttamalla.',
    kohteet: [
      /*
       * Numerointi seuraa Canal Grandea lännestä itään, eli samassa
       * järjestyksessä kuin vaporetto ajaa. Jokaisen wiki on
       * tarkistettu fi.wikipedian artikkeli — Accademian sillalla,
       * Ca' d'Orolla ja Santa Lucian asemalla sellaista ei ole, joten
       * ne jäivät pois.
       */
      { nimi: 'Canal Grande', lat: 45.4415, lon: 12.3283, wiki: 'Canal Grande' },
      { nimi: 'La Fenicen oopperatalo', lat: 45.4336, lon: 12.3336, wiki: 'La Fenice' },
      { nimi: 'Rialton silta', lat: 45.438, lon: 12.3359, wiki: 'Rialton silta' },
      { nimi: 'Pyhän Markuksen tori', lat: 45.4341, lon: 12.3387, wiki: 'Pyhän Markuksen tori' },
      { nimi: 'San Giorgio Maggiore', lat: 45.4294, lon: 12.3433, wiki: 'San Giorgio Maggiore' },
      { nimi: 'Arsenaali', lat: 45.4348, lon: 12.3496, wiki: 'Arsenale' },
    ],
  },
};

/** Pisteen paikka kuvassa prosentteina (left/top). */
export function karttapiste(kartta, lat, lon) {
  const { pohjoinen, etela, lansi, ita } = kartta.rajat;
  return {
    x: ((lon - lansi) / (ita - lansi)) * 100,
    y: ((pohjoinen - lat) / (pohjoinen - etela)) * 100,
  };
}
