/*
 * Työhuoneen Kehitys-välilehden sisältö (omistajan tilaus 8.8.2026:
 * "kokeillaan ja kuuntelen, miten ne toimivat" + "kirjoita myös
 * sinne, miten ajattelit koko ison kaaren"). Fable kirjoittaa tämän
 * tiedoston sisällön; Sonnet rakentaa välilehden, joka näyttää sen.
 *
 * Euroopan valmiit tekstit äänineen välilehti lukee suoraan
 * paketeista (EUROPE_SAAPUMISET, KOHTAAMISET) — tänne kirjataan
 * vain se, mitä ei ole pelissä: kaari, ääninäytteet ja
 * mannerkokeilut. Näytetiedostot: assets/audio/naytteet/.
 */

/** Ison kaaren esittely omistajalle — jaksotettuna lukukappaleiksi. */
export const KEHITYS_KAARI = [
  {
    otsikko: 'Mistä pelissä on kyse',
    teksti: 'Reginald Fogg perii isoisänsä Horation matkapäiväkirjan '
      + 'vuodelta 1873 ja lähtee kulkemaan sen jälkiä. Pelin runko on '
      + 'kahden äänen vuoropuhelu: Reginaldin nykyhetki ja Horation '
      + 'vuosi 1873 samalla sivulla. Tieto asuu sanomalehdessä, imu '
      + 'matkakirjassa — tämä jako on kaiken sisällön perussääntö.',
  },
  {
    otsikko: 'Dekkarikerros',
    teksti: 'Horatio ei vain matkustanut — häntä seurattiin. '
      + 'Antikvaari Ezekiel Grimshaw halusi Aarnin luettelon itselleen, '
      + 'ja hänen varjonsa näkyy vuoden 1873 merkinnöissä: sähkeet '
      + '("PALATKAA HETI. G. TIETÄÄ."), vaihdetut majatalot, kadotetut '
      + 'seuraajat. Nykyajassa Reginald alkaa huomata samaa: tuore '
      + 'liituristi sillankaiteessa, käyntikortti jossa lukee E. G., '
      + 'tummansininen sateenvarjo aukiolla. Sääntö on: askeleet '
      + 'sumussa kyllä, vaara ei — tämä on lasten peli, ja jännitys '
      + 'purkautuu aina joko arvoitukseksi tai lämmöksi, kuten '
      + 'Edinburghin tykinlaukaus.',
  },
  {
    otsikko: 'Seitsemän säveltä',
    teksti: 'Dekkari ei ole pelkkää jännitystä. Merkinnät kiertävät '
      + 'seitsemää säveltä: jännitys, arvoitus, lämpö, huumori, '
      + 'haikeus, ihmetys ja hengähdys. Euroopassa jännitteisiä on '
      + 'noin joka neljäs kaupunki, ja raja ei ole määrä vaan '
      + 'vaihtelu — sama temppu ei toistu naapurikaupungeissa, ja '
      + 'lämpimät ja rauhalliset merkinnät antavat jännitykselle '
      + 'kaikupohjan.',
  },
  {
    otsikko: 'Aarrejuoni ja vihjeet',
    teksti: 'Tutkimusmatkailija Aarnin luettelo lupaa jokaiselle '
      + 'maanosalle unohdetun aarteen: Euroopassa Meripihkahuone, '
      + 'Afrikassa Suuren Zimbabwen kivilintu, Aasiassa keisarin '
      + 'jadesinetti, ja niin edelleen. Aarrejahti kulkee isoisän '
      + 'taitetuilla sivuilla — vihjeillä, jotka nousevat esiin '
      + 'kaupunkien välissä matkalla ja kertovat suunnan, eivät '
      + 'koskaan kaupunkia. Kaupunkimerkinnät eivät viittaa '
      + 'pääaarteeseen: dekkarikoukut ja aarrevihjeet ovat kaksi eri '
      + 'lankaa, jotka eivät sotke toisiaan.',
  },
  {
    otsikko: 'Maanosien luonteet',
    teksti: 'Jokainen lauta saa oman motiiviperheensä, eivätkä '
      + 'Euroopan langat (liituristi, sähkeet, sivu 14, messinkiavain) '
      + 'toistu muualla. Afrikka: kivilinnun varjo — siipi veistoksessa, '
      + 'höyhen kirjan välissä; sävyinä ihmetys ja kunnioitus. '
      + 'Lähi-itä: suitsukkeen tie ja tähdistä suunnistaminen. Aasia: '
      + 'sinetin jälki vahassa — asiakirja, johon Horatio ei koskaan '
      + 'saanut leimaa. Pohjois-Amerikka: rautatiet ja sähkösanomat — '
      + 'ainoa manner, jolla Horatio on itse se, joka ihmettelee. '
      + 'Etelä-Amerikka: kulta joka ei kiillä, joet ja sumu. Oseania: '
      + 'tähtitaivas, jota kartanpiirtäjä ei tunne — laudoista '
      + 'rauhallisin. Piikki osoittaa aina Foggiin ja hänen vanhaan '
      + 'maailmaansa, ei koskaan maihin tai ihmisiin.',
  },
  {
    otsikko: 'Iso avoin päätös: sateenvarjomies',
    teksti: 'Madridissa mies avaa tummansinisen sateenvarjon '
      + 'pilvettömän taivaan alla, ja Kairossa opas ojentaa E. G:n '
      + 'käyntikortin. Kuka nykyajassa kulkee Reginaldin perässä? '
      + 'Ehdotukseni omistajalle: sateenvarjomies on Grimshawin '
      + 'pojanpojanpoika — hänkin peri isoisänsä matkan, kuten '
      + 'Reginald omansa. Kaksi lapsenlasta jatkaa isoisiensä '
      + 'kilpajuoksua tietämättä juuri toisistaan, ja kun he lopulta '
      + 'kohtaavat, takaa-ajo purkautuu lämmöksi: kumpikin haluaa vain '
      + 'nähdä luettelon valmiina. Vaihtoehdot: (a) suojelija — isoisän '
      + 'vanhan ystävän jälkeläinen, joka varjelee Reginaldia etäältä; '
      + '(b) kilpailija joka pehmenee liittolaiseksi (suositukseni); '
      + '(c) jää pysyväksi arvoitukseksi kuten revitty sivu. Päätös ei '
      + 'ole kiireinen — motiivibudjetti pitää G:n harvinaisena siihen '
      + 'asti.',
  },
  {
    otsikko: 'Mihin kaari päättyy',
    teksti: 'Matkakirjan revitty viimeinen sivu ("…voinut uskoa, '
      + 'siellä olikin…") ei paljastu koskaan — se on pelin pysyvä '
      + 'mysteeri ja syy jatkaa matkaa. Yksittäinen peli päättyy, kun '
      + 'aarre tuodaan kotiin; iso kaari ei pääty vaan levenee: uusia '
      + 'maanosia, uusia lehtiä, uusia ääniä. Tarinan kysymys '
      + '"loppuuko matka koskaan" saa saman vastauksen kuin isoisällä: '
      + 'ei — ja juuri se on pointti.',
  },
];

/**
 * Ääninäytteet: englanninkieliset ElevenLabs-äänet lukevat suomea
 * (eleven_v3 on monikielinen). Omistaja kuuntelee ja valitsee.
 * Kaikki tiedostot assets/audio/naytteet/-kansiossa.
 */
export const AANINAYTTEET = [
  {
    ryhma: 'Kertojaehdokkaat (dekkarinäyte, Tukholman kuja)',
    naytteet: [
      { tiedosto: 'nayte-kertoja-george.mp3', nimi: 'George', kuvaus: 'brittiläinen tarinankertoja, lämmin' },
      { tiedosto: 'nayte-kertoja-daniel.mp3', nimi: 'Daniel', kuvaus: 'brittiläinen, vakaa uutisääni' },
      { tiedosto: 'nayte-kertoja-brian.mp3', nimi: 'Brian', kuvaus: 'syvä ja rauhallinen' },
      { tiedosto: 'nayte-kertoja-bill.mp3', nimi: 'Bill', kuvaus: 'vanhempi, viisas sävy' },
    ],
  },
  {
    ryhma: 'Naisäänet Elsalle ja Rosalle (Elsan tervehdys)',
    naytteet: [
      { tiedosto: 'nayte-nainen-alice.mp3', nimi: 'Alice', kuvaus: 'selkeä brittiläinen' },
      { tiedosto: 'nayte-nainen-lily.mp3', nimi: 'Lily', kuvaus: 'samettinen brittiläinen' },
      { tiedosto: 'nayte-nainen-sarah.mp3', nimi: 'Sarah', kuvaus: 'kypsä ja rauhoittava' },
      { tiedosto: 'nayte-nainen-matilda.mp3', nimi: 'Matilda', kuvaus: 'asiantunteva, kirkas' },
    ],
  },
  {
    ryhma: 'Hahmoäänet Matteolle ja Otolle (Oton repliikki)',
    naytteet: [
      { tiedosto: 'nayte-mies-callum.mp3', nimi: 'Callum', kuvaus: 'käheä veijari' },
      { tiedosto: 'nayte-mies-eric.mp3', nimi: 'Eric', kuvaus: 'pehmeä ja luotettava' },
    ],
  },
];

/**
 * Mannerkokeilut: raamatun hahmotelmien mukaisia näytemerkintöjä
 * muilta laudoilta, Viisaan Kertojan lukemina. EIVÄT ole pelissä —
 * omistaja kuuntelee sävyn ennen kuin maanosia aletaan kirjoittaa.
 */
/**
 * Lyhyet versiot (omistajan pyyntö 8.8.2026: "matkakirjan tekstit
 * kannattaa vielä lyhentää... myös Eurooppaan lyhyemmät versiot").
 * Kokeilu vastaa samalla kysymykseen "pitääkö vuorotella, ettei
 * isoisä ole ollenkaan": lyhyessä muodossa merkintä kantaa YHDEN
 * kuvan, ja isoisä on mukana vain kun hän on se kuva — noin joka
 * toisessa merkinnässä. Alkuperäiset tekstit näkyvät vertailua
 * varten Euroopan tekstit -osiossa. Äänet generoidaan omistajan
 * valitsemalla äänellä, kun valinta tulee.
 */
export const LYHYT_KOKEILUT = {
  johdanto: 'Vertailu kolmesta mitasta (omistajan pyyntö 8.8.: '
    + '"oikea mitta voisi olla niiden kahden välistä"): LYHYT on '
    + 'tiivein kokeilu, VÄLI on lyhyen ja nykyisen pelitekstin '
    + 'puolimatka. Nykyinen pitkä versio on luettavissa Euroopan '
    + 'tekstit -osiossa. Sääntö kaikissa: yksi kuva per merkintä, '
    + 'ja isoisä puhuu vain noin joka toisessa — Pariisi ja '
    + 'Pietari ovat ilman häntä.',
  kohteet: [
    {
      otsikko: 'Edinburgh (jännitys — isoisä mukana)',
      kuvaus: 'Sumussa kuului askeleita — kunnes linnan tykki '
        + 'pamahti, ja ne kääntyivät kiireesti pois.',
      nosto: 'Isoisä kirjoitti: "Tykki ammutaan kello yksi laivojen '
        + 'takia." Minä kiitin sitä muustakin.',
      vali: 'Sumussa selkäni takana kuului askeleita — kunnes '
        + 'linnan tykki pamahti, ja me molemmat hypähdimme. '
        + 'Askeleet kääntyivät kiireesti pois.',
      valiNosto: 'Isoisä kirjoitti: "Tykki ammutaan kello yksi, '
        + 'jotta laivat asettavat kellonsa." Minä kiitin sitä '
        + 'tänään muustakin.',
    },
    {
      otsikko: 'Pariisi (arvoitus — ilman isoisää)',
      kuvaus: 'Tarjoilija toi kaakaon, jota en tilannut: "Pöytä '
        + 'seitsemän tarjoaa aina teidän suvullenne." Pöydän alle '
        + 'oli liimattu messinkiavain.',
      vali: 'Kahvilan tarjoilija toi kaakaon, jota en ollut '
        + 'tilannut: "Pöytä seitsemän tarjoaa aina teidän '
        + 'suvullenne." Pöydän kannen alle oli liimattu pieni '
        + 'messinkiavain. Tilasin toisen kaakaon ja jäin.',
    },
    {
      otsikko: 'Wien (hengähdys — isoisä kantaa)',
      kuvaus: 'Kahvilassa kukaan ei hoputtanut, vaikka istuin kaksi '
        + 'tuntia.',
      nosto: 'Isoisä kirjoitti: "Keisarin uusi vesijohto tuo veden '
        + 'vuorilta ilman ainuttakaan pumppua." Join siitä hanasta '
        + 'tänään.',
      vali: 'Kahvilassa kaakao tuli hopeatarjottimella, eikä kukaan '
        + 'hoputtanut, vaikka istuin kaksi tuntia.',
      valiNosto: 'Isoisä kirjoitti: "Keisari avasi vesijohdon, joka '
        + 'tuo veden vuorilta ilman ainuttakaan pumppua." Join '
        + 'siitä hanasta tänään.',
    },
    {
      otsikko: 'Ateena (lämpö — isoisä mukana)',
      kuvaus: 'Lippuluukulla myyjä sanoi: "Seuralaisenne maksoi '
        + 'jo." Huipulla odotti vain tyhjä penkki — ja siinä vielä '
        + 'lämmin paikka.',
      nosto: 'Isoisä kirjoitti: "Täällä keksittiin, että kaupunkia '
        + 'johdetaan keskustelemalla." Ukolla oli tapana olla '
        + 'oikeassa.',
      vali: 'Akropoliin lippuluukulla myyjä ojensi lipun, jota en '
        + 'ollut ostanut: "Seuralaisenne maksoi jo." Huipulla '
        + 'odotti vain tyhjä penkki — ja siinä vielä lämmin '
        + 'paikka.',
      valiNosto: 'Isoisä kirjoitti temppelin juurella: "Täällä '
        + 'keksittiin, että kaupunkia voi johtaa keskustelemalla." '
        + 'Ukolla oli tapana olla oikeassa.',
    },
    {
      otsikko: 'Pietari (ihmetys — ilman isoisää)',
      kuvaus: 'Kesäyö ei pimennyt: luin katukylttiä keskiyöllä '
        + 'ilman lamppua, ja Nevan sillat nousivat pystyyn kuin '
        + 'portit.',
      vali: 'Kesäyö ei pimennyt lainkaan: luin katukylttiä '
        + 'keskiyöllä ilman lamppua. Sitten Nevan sillat nousivat '
        + 'pystyyn, ja jäin katsomaan kuin portin avautumista.',
    },
    {
      otsikko: 'Afrikka: Sansibar (mannerkokeilu)',
      kuvaus: 'Vanha veistäjä käänsi työnsä minuun päin: kivestä '
        + 'nousi linnun siipi. "Isoisäsi kysyi samasta linnusta."',
      vali: 'Mausteiden tuoksu tuli vastaan jo laiturilla. Vanha '
        + 'veistäjä käänsi työnsä minuun päin: kivestä nousi '
        + 'linnun siipi. "Isoisäsi kysyi samasta linnusta."',
      valiNosto: 'Isoisä kirjoitti: "Kivilintu ei ole taru — sen '
        + 'varjo on jo nähty."',
    },
    {
      otsikko: 'Lähi-itä: karavaani (mannerkokeilu)',
      kuvaus: 'Vartija sammutti lyhdyn ja osoitti taivaalle: '
        + '"Täällä suunta ei ole kartassa vaan tähdissä."',
      nosto: 'Isoisä kirjoitti: "Sheban aarretta ei löydä se, joka '
        + 'kulkee päivällä."',
      vali: 'Karavaanin vartija sammutti lyhdyn ja osoitti '
        + 'taivaalle: "Täällä suunta ei ole kartassa vaan '
        + 'tähdissä." Kirjani aukesi tuulessa sivulle, johon '
        + 'isoisä oli piirtänyt saman tähtikuvion.',
      valiNosto: 'Isoisä kirjoitti: "Sheban aarretta ei löydä se, '
        + 'joka kulkee päivällä."',
    },
    {
      otsikko: 'Pohjois-Amerikka: preeria (mannerkokeilu)',
      kuvaus: 'Juna ylitti preeriaa kolmatta päivää, eikä maisema '
        + 'loppunut.',
      nosto: 'Isoisä kirjoitti: "Ensimmäistä kertaa minä olen se, '
        + 'joka tuijottaa."',
      vali: 'Juna ylitti preeriaa kolmatta päivää, eikä maisema '
        + 'loppunut. Vaunussa myytiin sähkeitä kuin sanomalehtiä.',
      valiNosto: 'Isoisä kirjoitti: "Ensimmäistä kertaa matkallani '
        + 'minä olen se, joka tuijottaa."',
    },
  ],
};

export const MANTERE_KOKEILUT = [
  {
    lauta: 'Afrikka — Sansibar (kivilinnun varjo)',
    tiedosto: 'kokeilu-afrikka.mp3',
    kuvaus: 'Mausteiden tuoksu tuli vastaan jo laiturilla. Vanha '
      + 'veistäjä katsoi kirjaani ja käänsi työnsä minuun päin: '
      + 'kivestä nousi linnun siipi. "Isoisäsi kysyi samasta '
      + 'linnusta", hän sanoi.',
    nosto: 'Isoisä kirjoitti: "Sansibarissa kaikki tiet tuoksuvat '
      + 'neilikalta ja kaikki tarinat johtavat etelään. Kivilintu ei '
      + 'ole taru — sen varjo on jo nähty."',
  },
  {
    lauta: 'Lähi-itä — karavaani (Sheban tähdet)',
    tiedosto: 'kokeilu-lahi-ita.mp3',
    kuvaus: 'Karavaanin vartija sammutti lyhdyn ja osoitti taivaalle: '
      + '"Täällä suunta ei ole kartassa vaan tähdissä." Kirjani '
      + 'aukesi tuulessa sivulle, johon isoisä oli piirtänyt saman '
      + 'tähtikuvion.',
    nosto: 'Isoisä kirjoitti: "Suitsukkeen tie on vanhempi kuin '
      + 'yksikään valtakunta sen varrella. Sheban aarretta ei löydä '
      + 'se, joka kulkee päivällä."',
  },
  {
    lauta: 'Pohjois-Amerikka — preeria (Horatio ihmettelee)',
    tiedosto: 'kokeilu-pohjois-amerikka.mp3',
    kuvaus: 'Juna ylitti preeriaa kolmatta päivää, eikä maisema '
      + 'loppunut. Vaunussa myytiin sähkeitä kuin sanomalehtiä — '
      + 'täällä minun ei tarvinnut ihmetellä yksin.',
    nosto: 'Isoisä kirjoitti: "Ensimmäistä kertaa matkallani minä '
      + 'olen se, joka tuijottaa. Rautatie ylitti mantereen neljässä '
      + 'päivässä — ja Montezuman aarre makaa yhä jossain sen '
      + 'eteläpuolella."',
  },
];
