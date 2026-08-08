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
      /*
       * Lännestä itään, jotta numerot etenevät kartalla luontevasti —
       * sama järjestysperiaate kuin Berliinissä. Jokaisen wiki on
       * tarkistettu fi.wikipedian artikkeli (action=query&redirects=1).
       */
      { nimi: 'Buckinghamin palatsi', lat: 51.5014, lon: -0.1419, wiki: 'Buckinghamin palatsi' },
      { nimi: 'Trafalgar Square', lat: 51.508, lon: -0.1281, wiki: 'Trafalgar Square' },
      { nimi: 'Big Ben', lat: 51.5007, lon: -0.1246, wiki: 'Big Ben' },
      { nimi: 'Lontoon silmä', lat: 51.5033, lon: -0.1196, wiki: 'London Eye' },
      { nimi: 'Pyhän Paavalin katedraali', lat: 51.5138, lon: -0.0984, wiki: 'Pyhän Paavalin katedraali' },
      { nimi: 'Tower Bridge', lat: 51.5055, lon: -0.0754, wiki: 'Tower Bridge' },
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
};

/** Pisteen paikka kuvassa prosentteina (left/top). */
export function karttapiste(kartta, lat, lon) {
  const { pohjoinen, etela, lansi, ita } = kartta.rajat;
  return {
    x: ((lon - lansi) / (ita - lansi)) * 100,
    y: ((pohjoinen - lat) / (pohjoinen - etela)) * 100,
  };
}
