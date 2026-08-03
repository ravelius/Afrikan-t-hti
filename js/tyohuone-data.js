/*
 * Työhuoneen omat tietosisällöt: suunnitelmat, listat ja lähteet.
 *
 * Nämä eivät ole pelin dataa vaan työhuoneen: aarteet ja varusteet ovat
 * suunnitelmia, peli-ideat ovat keskustelua, ja lähteet ja moottorit
 * ovat työkalulistoja. Pelin oma sisältö luetaan aina paketeista
 * (js/packs/*), jotta se ei voi vanhentua.
 *
 * Erotettu omaksi moduulikseen, jotta tyohuone.html on luettava sivu
 * eikä tuhannen rivin tiedosto, jossa sisältö ja rakenne ovat sekaisin.
 */

export const PELITILAT = { kaytossa: 'käytössä', ideoitava: 'ideoidaan yhdessä seuraavaksi', idea: 'idea' };

// --- peli-ideat ---------------------------------------------------------
// tila: kaytossa | ideoitava (mietitään yhdessä) | idea
export const PELIT = [
  { nimi: 'Tietovisa (monivalinta)', tila: 'kaytossa',
    kuvaus: 'Perusmuoto aarrekaupungeissa: paikallinen kysyjä esittää kysymyksen, neljä vaihtoehtoa, 30 s. Vihje ja 50:50 ostettavissa.' },
  { nimi: 'Isoisän väittämä', tila: 'kaytossa',
    kuvaus: 'Päiväkirjan väite vuodelta 1873 — pitääkö yhä paikkansa? Kaksi vaihtoehtoa; pelin ydinteema (vanha maailma vs. nykyaika) tiivistettynä.' },
  { nimi: 'Valokuvakysymys', tila: 'kaytossa',
    kuvaus: 'Matkavalokuvaajan vedos: mistä kaupungista kuva on? Kuvat haetaan Wikipediasta lennossa.' },
  { nimi: 'Isoisän luonnoskirjan pulmat', tila: 'kaytossa',
    kuvaus: 'Piirrospäättelyt (naksutuskieli, vesileilit ym.) ilman kelloa; selite ja ostettava vihje. Viisi pulmaa Afrikassa.' },
  { nimi: 'Tapahtumakortti', tila: 'kaytossa',
    kuvaus: 'Ei kysymys vaan käänne: kyyti, viivästys, rahalöytö. Rytmittää matkaa.' },
  { nimi: 'Rosvon kaksintaistelu', tila: 'kaytossa',
    kuvaus: 'Kahdeksan vaihtoehtoa, kova panos. Hevosenkengällä ohitus.' },
  { nimi: 'Tietoportti', tila: 'kaytossa',
    kuvaus: 'Vaikea kysymys avaa maan laudan (esim. Helsinki → Suomi) ilmaiseksi.' },
  { nimi: 'Tutkiminen', tila: 'kaytossa',
    kuvaus: 'Laatattomatkin kaupungit voi tutkia kerran: palkintona tietoa ja kokemuspisteitä.' },
  { nimi: 'Aineistotutkimus', tila: 'ideoitava',
    kuvaus: 'Omistajan idea: pelaaja saa ensin tutkia aineistoa (esim. museon kuvakokoelman poiminta, vanha kartta tai päiväkirjan aukeama) niin kauan kuin haluaa. Kun hän on valmis, alkaa kysymys- tai pulmasarja aineiston pohjalta. Lisämaksusta pääsee kurkkaamaan aineistoa kesken pelin, ja aikaraja on tavallista pidempi.',
    huomiot: 'Sopii museo-API-lähteisiin (Met, Smithsonian) — aineisto voi olla aidosti eri joka kerralla. Palkinnoksi sopisi matkamuisto.' },
  { nimi: 'Lähikuvatunnistus', tila: 'idea',
    kuvaus: 'Zoomattu yksityiskohta esineestä, kartasta tai rakennuksesta — mikä se on tai missä se sijaitsee? Kuva laajenee vihje vihjeeltä.' },
  { nimi: 'Aikajana', tila: 'idea',
    kuvaus: 'Järjestä tapahtumat tai keksinnöt aikajärjestykseen (esim. 3–5 korttia raahaten).' },
  { nimi: 'Äänitunnistus', tila: 'idea',
    kuvaus: 'Kuuntele ääni — minkä eläimen tai paikan ääni on kyseessä? xeno-canton lintuäänet alueittain sopisivat suoraan.' },
  { nimi: 'Yhdistelypeli', tila: 'idea',
    kuvaus: 'Yhdistä parit: kieli ja maa, ruoka ja kaupunki, lippu ja valtio.' },
  { nimi: 'Salakirjoitus', tila: 'idea',
    kuvaus: 'Isoisän koodattu rivi puretaan yksinkertaisella avaimella — kytkeytyy revityn sivun mysteeriin.' },
  { nimi: 'Basaaritinkiminen', tila: 'idea',
    kuvaus: 'Neuvottelupeli kauppiaan kanssa: osta matkamuisto oikeaan hintaan. Rahapeli, ei tietopeli — vaihtelua rytmiin.' },
  { nimi: 'Muistipeli', tila: 'idea',
    kuvaus: 'Matkamuistojen tai laattojen parit lyhyenä muistipelinä — kevyt välipala nuoremmille pelaajille.' },

  // --- ideat 2.8.2026 -------------------------------------------------
  // Kolme ensimmäistä eivät tarvitse YHTÄÄN uutta aineistoa: kaikki on
  // jo peilattuna. Se tekee niistä selvästi halvimmat toteuttaa.
  { nimi: 'Kielitunnistus', tila: 'idea',
    kuvaus: 'Kuuntele näyte ja arvaa kaupunki tai kieli. Kolme vaihtoehtoa, '
      + 'näyte soi napista.',
    huomiot: 'AINEISTO ON JO OLEMASSA: 31 kaupungissa nauhoitettua '
      + 'kielinäytettä (js/packs/europe-kielet.js), kaikki peilattuna ja '
      + 'lisenssit tarkistettuina. Ei tarvitse yhtään uutta tiedostoa.' },
  { nimi: 'Lipputunnistus', tila: 'idea',
    kuvaus: 'Minkä maan lippu? Tai: mikä näistä lipuista kuuluu maahan, '
      + 'jossa nyt olet?',
    huomiot: 'AINEISTO ON JO OLEMASSA: 83 lippua peilissä. Sopii '
      + 'erityisesti nuoremmille ja on nopea — hyvä kaupunkilaudoille, '
      + 'joissa aika kuluu hitaammin.' },
  { nimi: 'Valokuvan paikannus', tila: 'idea',
    kuvaus: 'Näytetään kuva ja kysytään, missä päin karttaa se on. '
      + 'Vastaus annetaan osoittamalla karttaa.',
    huomiot: 'AINEISTO ON JO OLEMASSA: 320 kuvaa peilissä, kaikki '
      + 'paikkaan sidottuja. Opettaa karttaa ja maailmankuvaa yhtä aikaa '
      + '— osuu suoraan siihen mitä pelillä tavoitellaan.' },
  { nimi: 'Päivämäärä ja pituuspiiri', tila: 'idea',
    kuvaus: 'Matkalla itään päivä lyhenee, länteen pitenee. Pulma siitä, '
      + 'monesko päivä on, kun on kierretty maapallo.',
    huomiot: 'Tämä on Kahdeksankymmenen päivän oma juonenkäänne: Fogg '
      + 'voitti vedon, koska oli matkannut itään ja voittanut päivän. '
      + 'Sopii pelin loppuun Lontooseen palatessa täydellisesti.' },
  { nimi: 'Reitinvalinta', tila: 'idea',
    kuvaus: 'Kaksi tai kolme reittiä samaan kohteeseen: halvin, nopein ja '
      + 'se, jonka varrella näkee eniten. Valinta maksaa rahaa tai päiviä.',
    huomiot: 'Ei ole arvausta vaan päätös — ja juuri se tekee '
      + 'aikarajasta merkityksellisen. Tarttuu suoraan '
      + 'kahdeksaankymmeneen päivään.' },
  { nimi: 'Valuutanvaihto', tila: 'idea',
    kuvaus: 'Vaihda puntia paikalliseen rahaan oikealla kurssilla — tai '
      + 'huomaa, milloin sinua yritetään huijata.',
    huomiot: '1873 matkustamisen arkea ja opettaa lukuja. Vaatii '
      + 'aikakauden kurssit lähteineen.' },
  { nimi: 'Kaupungin avaimet', tila: 'ideoitava',
    kuvaus: 'Pulma, jonka ratkaisemalla saa kaupungin avaimet ja pääsee '
      + 'kaupunkikartalle.',
    huomiot: 'Omistajan sääntö: kaupunkiin ei pääse ilman avaimia. '
      + 'Tämä tarvitsee oman muotonsa — ehkä kaupungin erityispiirteisiin '
      + 'liittyvä kysymyssarja, jolloin avaimet ansaitaan juuri sitä '
      + 'kaupunkia tuntemalla.' },
];

export const AARTEET = [
  { maanosa: 'Eurooppa', aarre: 'Meripihkahuone', tila: 'kaytossa' },
  { maanosa: 'Afrikka', aarre: 'Tähti', tila: 'kaytossa' },
  { maanosa: 'Lähi-itä', aarre: 'laudan oma aarre', tila: 'kaytossa' },
  { maanosa: 'Aasia', aarre: 'laudan oma aarre', tila: 'kaytossa' },
];

// tila: kaytossa | sovittu | idea
export const VARUSTEET = [
  { nimi: 'Erikoissilmälasit', tila: 'sovittu',
    vaikutus: 'Karsii tietovisassa kaksi väärää vaihtoehtoa ilmaiseksi.',
    huomiot: 'Omistajan oma esimerkki. Halpa toteuttaa: mekaniikka on jo '
      + 'olemassa maksullisena (50:50 maksaa 80 puntaa) — varuste tekee '
      + 'siitä ilmaisen kerran.' },
  { nimi: 'Suosituskirje', tila: 'idea',
    vaikutus: 'Yksi ilmainen laiva- tai lentomatka.',
    huomiot: 'Toinen halvoista: maksumekaniikka on jo olemassa. Sopii '
      + 'kahdeksankymmenen päivän kiireeseen.' },
  { nimi: 'Kiikari', tila: 'idea',
    vaikutus: 'Näet naapurikaupunkien laatat käymättä siellä.',
    huomiot: 'Kiikaritehoste on jo piirretty peliin (etusivun linssi), '
      + 'joten ulkoasu on valmiina.' },
  { nimi: 'Kompassi', tila: 'idea',
    vaikutus: 'Saat valita nopan tuloksen kerran.',
    huomiot: 'Vahvin näistä — kannattaa olla harvinainen.' },
  { nimi: 'Isoisän muistikirja', tila: 'idea',
    vaikutus: 'Yksi uusi yritys väärin menneeseen kysymykseen.',
    huomiot: 'Sopii tarinaan: peli perustuu isoisän päiväkirjaan.' },
  { nimi: 'Kiniini', tila: 'idea',
    vaikutus: 'Estää sairastumisen, joka veisi päiviä.',
    huomiot: 'Vaatisi uuden sairastumismekaniikan. 1873 matkustamisen '
      + 'todellisuutta, ja puree suoraan aikarajaan.' },
  { nimi: 'Kaupungin avaimet', tila: 'sovittu',
    vaikutus: 'Avaa yhden kaupunkikartan. Ilman avaimia kaupunkiin ei pääse.',
    huomiot: 'Omistajan sääntö: kaupunki on palkinto eikä oikotie — '
      + 'sinne ansaitaan pääsy. Avaimet ovat kaupunkikohtaiset, joten '
      + 'niitä on yhtä monta kuin kaupunkikarttoja. Oikeakin '
      + 'kunnianosoitus: kaupungit ovat antaneet avaimensa '
      + 'arvovieraille.' },
  { nimi: 'Valokuvauskamera', tila: 'idea',
    vaikutus: 'Kuva kaupungissa: passiin leima kuvan kanssa ja kokemuspisteitä.',
    huomiot: 'Kauimpana Afrikan tähdestä: ei auta voittamaan lainkaan, '
      + 'vaan palkitsee uteliaisuudesta. Istuu suoraan siihen, että '
      + 'suurin palkinto on ymmärrys.' },
];

// Kaupunkitason laudat. Istanbul on jo pelissä, joten pohja on
// todistettu — uutta olisi hitaampi kello.
export const KAUPUNKIKARTAT = [
  { nimi: 'Istanbul', tila: 'kaytossa',
    kuvaus: 'Ensimmäinen kaupunkitason lauta. Bosporin lautat ovat '
      + 'laivareittejä ja kaupunginosat kaupunkeja.',
    huomiot: 'Kello käy täällä yhä samaa vauhtia kuin mantereella — '
      + 'hitaampi kello on vielä tekemättä (js/game.js TURN_HOURS).' },
  { nimi: 'Lisää kaupunkeja', tila: 'idea',
    kuvaus: 'Kaupungin sisältä voi löytyä lisää asioita: varusteita, '
      + 'rahaa ja kohtaamisia.',
    huomiot: 'Omistajan linjaus: aika kuluu kaupungissa hitaammin, '
      + 'koska välimatkat ovat pieniä. Se tekee pysähtymisestä '
      + 'kannattavaa aikarajasta huolimatta.' },
  { nimi: 'Yhteiskehitys — myöhemmin', tila: 'idea',
    kuvaus: 'Kaupunkien sisällöt tulisivat ainakin osittain '
      + 'yhteiskehityksen piiriin: joku, joka tuntee kaupungin oikein '
      + 'hyvin — vaikka on sieltä kotoisin — voisi ehdottaa tai jopa '
      + 'itse rakentaa kaupungin kartan ja kirjoittaa ylös sen '
      + 'erityispiirteet.',
    huomiot: 'Vasta sitten kun koko maailmankartta on rakennettu. '
      + 'Omistaja lisää todennäköisesti itse ensimmäisenä yhden '
      + 'kaupungin Suomeen. Tämä sopii siihen, että paikallinen tieto '
      + 'on juuri sitä mitä peli tavoittelee — ymmärrystä maailman '
      + 'ihmisistä ja kulttuureista.' },
];

export const LASIT = [
  { nimi: 'Animoitu historiakartta', tila: 'ideoitava',
    kuvaus: 'Omistajan idea 2.8.2026: kartta pysyy paikallaan ja sen päällä oleva kerros elää vuosilukujen mukana. Ensimmäinen aihe: Silkkitie. Taikalasit voisivat olla juuri se väline, jolla historialliset kartat näkee.',
    huomiot: 'Tämä on rakennettavissa nykyisillä välineillä. Kartta on jo vektoria, ja pelin oma projektio kääntää leveys- ja pituuspiirit laudan koordinaateiksi — sama kaava, jolla neljä lautaa yhdistettiin. Kerros on siis lista pisteitä ja vuosilukuja, ja aikajana valitsee mitkä niistä näkyvät. Työläin osa ei ole tekniikka vaan AINEISTO: reitit ja rajat pitää saada luotettavasta lähteestä ja vuosiluvut tarkistaa. Yksi tärkeä varaus: mitä kauemmas ajassa mennään, sitä epävarmempia rajat ovat, ja se pitää sanoa pelaajalle ääneen — muuten peli opettaa arvauksia faktoina.' },
  { nimi: 'Ihmisen leviäminen Afrikasta', tila: 'ideoitava',
    kuvaus: 'Omistajan idea: animoitu kerros, joka näyttää ihmisen leviämisen maapallolle Afrikasta alkaen.',
    huomiot: 'Sama koneisto kuin historiakartassa, mutta aikaskaala on kymmeniä tuhansia vuosia eikä vuosisatoja, joten aikajanan pitää olla logaritminen. Sopii pelin ytimeen erinomaisesti: se kertoo yhdellä kuvalla, että kaikki matkalla kohdatut kansat ovat samaa sukua.' },
  { nimi: 'Lämpökartat: onnellisuus ja muut luvut', tila: 'ideoitava',
    kuvaus: 'Omistajan idea: onnellisuusindeksi lämpökarttana ja sen muunnelmat — asukasluku, bruttokansantuote, odotettu elinikä, veroprosentti ja niin edelleen.',
    huomiot: 'Tämä on näistä kolmesta helpoin: aineisto on nykyaikaista, avointa ja maakohtaista (World Happiness Report, Maailmanpankki, YK). Peli tuntee jo maiden rajat maakerroksessa, joten kerros on maa ja väri. Opetuksellisesti vahvin kohta on vertailu: kaksi lukua rinnakkain kertoo enemmän kuin kumpikaan yksin — esimerkiksi bruttokansantuote ja onnellisuus.' },
  { nimi: 'Museokuva kaupungista', tila: 'ideoitava',
    kuvaus: 'Omistajan linjaus 2.8.2026: "Paras idea on käyttää museoiden yms kuvia tehtävissä. Olisi kiva että tehtävä liittyy kyseiseen kaupunkiin jossa ollaan." Tehtävä rakennetaan siis oikean museoesineen ympärille, ja esine on sieltä missä pelaaja juuri on: Istanbulissa osmanikäsityötä, Kairossa egyptiläistä, Lissabonissa löytöretkien aineistoa.',
    huomiot: 'Tämä on minipelien tärkein suunta. Lähteet ovat avoimia ja ilmaisia: Met Museum (avoin API, CC0), Smithsonian, Rijksmuseum, Europeana ja Wikimedia Commons. Kuvat menevät saman peilin läpi kuin muutkin, joten ne toimivat myös offline. Kaupunkiin sidonta tehdään esineen alkuperämaan tai -kaupungin perusteella, ja aineisto haetaan etukäteen pelipaketteihin — ei lennossa, ettei tehtävä jää tulematta yhteydettömänä.' },
];

// --- lähteet ------------------------------------------------------------
// tila: kaytossa | kokeiltava | idea. Lisenssi on lähteen pääsääntö —
// yksittäinen aineisto tarkistetaan aina erikseen.
export const LAHTEET = [
  { nimi: 'Wikimedia Commons', tyyppi: 'kuvat', lisenssi: 'PD/CC', api: true, url: 'https://commons.wikimedia.org', tila: 'kaytossa',
    idea: 'Pelin nykyiset kuvat tulevat Wikipedian kautta täältä. Suora API antaisi enemmän kuvia per paikka.' },
  { nimi: 'The Met Open Access', tyyppi: 'kuvat', lisenssi: 'CC0', api: true, url: 'https://metmuseum.github.io', tila: 'kokeiltava',
    idea: 'Yli 400 000 CC0-teosta ilman avainta. Egyptin, Afrikan ja Aasian kokoelmat: aarre-esineiden kuvat, taidekysymykset.' },
  { nimi: 'Smithsonian Open Access', tyyppi: 'kuvat', lisenssi: 'CC0', api: true, url: 'https://www.si.edu/openaccess', tila: 'kokeiltava',
    idea: 'Miljoonia CC0-kuvia: luonnontiede, kulttuurit, historia. Ilmainen api.data.gov-avain.' },
  { nimi: 'Rijksmuseum (Rijksstudio)', tyyppi: 'kuvat', lisenssi: 'PD', api: true, url: 'https://www.rijksmuseum.nl/en/rijksstudio', tila: 'kokeiltava',
    idea: 'Hollannin kulta-ajan taide suurina kuvina. Löytöretki- ja karttateemat sopivat pelin henkeen.' },
  { nimi: 'Cleveland Museum of Art', tyyppi: 'kuvat', lisenssi: 'CC0', api: true, url: 'https://openaccess-api.clevelandart.org', tila: 'kokeiltava',
    idea: 'Avoin API ilman avainta, CC0-teokset. Hyvä Afrikan taiteen kokoelma.' },
  { nimi: 'Art Institute of Chicago', tyyppi: 'kuvat', lisenssi: 'CC0', api: true, url: 'https://api.artic.edu/docs/', tila: 'kokeiltava',
    idea: 'Siisti julkinen API, IIIF-kuvat — tarkkoja rajauksia teoksista pulmiin ja kysymyksiin.' },
  { nimi: 'Europeana', tyyppi: 'kuvat', lisenssi: 'vaihtelee', api: true, url: 'https://pro.europeana.eu/page/apis', tila: 'idea',
    idea: 'Euroopan museoiden ja arkistojen yhteishaku — Euroopan laudan sisältöön aikanaan.' },
  { nimi: 'Library of Congress', tyyppi: 'kuvat', lisenssi: 'PD (pääosin)', api: true, url: 'https://www.loc.gov/apis/', tila: 'idea',
    idea: 'Historialliset valokuvat ja julisteet; 1800-luvun matkakuvaukset sopivat isoisän aikakauteen.' },
  { nimi: 'Flickr Commons', tyyppi: 'kuvat', lisenssi: 'PD ("no known copyright")', api: true, url: 'https://www.flickr.com/commons', tila: 'idea',
    idea: 'Kymmenien museoiden vanhat valokuvat yhdellä haulla — aikalaiskuvia kaupungeista.' },
  { nimi: 'David Rumsey Map Collection', tyyppi: 'kartat', lisenssi: 'CC BY-NC-SA', api: false, url: 'https://www.davidrumsey.com', tila: 'kokeiltava',
    idea: 'Valtava historiallisten karttojen kokoelma. 1870-luvun Afrikka-kartta "Katso kuva" -aiheeksi tai pulmien pohjaksi.' },
  { nimi: 'Old Maps Online', tyyppi: 'kartat', lisenssi: 'vaihtelee', api: false, url: 'https://www.oldmapsonline.org', tila: 'idea',
    idea: 'Hakukone vanhoihin karttoihin paikan mukaan — reitti alkuperäislähteille.' },
  { nimi: 'Natural Earth', tyyppi: 'kartat', lisenssi: 'PD', api: false, url: 'https://www.naturalearthdata.com', tila: 'kaytossa',
    idea: 'Rannikot ja maiden rajat tulevat jo täältä. Myös joet ja järvet saatavilla samasta aineistosta.' },
  { nimi: 'Freesound', tyyppi: 'ääni', lisenssi: 'CC0/CC BY', api: true, url: 'https://freesound.org', tila: 'kaytossa',
    idea: 'Kaikki pelin kenttä-äänitykset. API-avaimella haku suoraan äänistudioon olisi mahdollinen.' },
  { nimi: 'xeno-canto', tyyppi: 'ääni', lisenssi: 'CC (vaihtelee)', api: true, url: 'https://xeno-canto.org', tila: 'kokeiltava',
    idea: 'Lintuäänet lajilleen ja alueelleen: kaupungin ambienssiin juuri sillä seudulla pesivä laji (esim. kenkänokka Bahr el Ghazaliin).' },
  { nimi: 'BBC Sound Effects', tyyppi: 'ääni', lisenssi: 'RemArc (ei-kaupallinen)', api: false, url: 'https://sound-effects.bbcrewind.co.uk', tila: 'idea',
    idea: '33 000 arkistotehoste-ääntä; höyrylaivat, juna-asemat, torit. Lisenssi sallii harrastuskäytön.' },
  { nimi: 'radio aporee', tyyppi: 'ääni', lisenssi: 'CC', api: true, url: 'https://aporee.org/maps/', tila: 'kaytossa',
    idea: 'Kenttä-äänityksiä kartalla ympäri maailmaa. Haku archive.orgin rajapinnasta koordinaateilla, ei nimellä: jokaisen 41 Euroopan kaupungin oma taustaääni tulee täältä. Huom: hakemisto pudottaa koordinaateista miinusmerkin, joten kysely tehdään itseisarvoilla.' },
  { nimi: 'Musopen', tyyppi: 'musiikki', lisenssi: 'PD/CC', api: false, url: 'https://musopen.org', tila: 'idea',
    idea: 'Vapaita klassisen musiikin äänityksiä — aikakauden salonkimusiikkia esim. voittoruutuun.' },
  { nimi: 'Free Music Archive', tyyppi: 'musiikki', lisenssi: 'CC (vaihtelee)', api: false, url: 'https://freemusicarchive.org', tila: 'idea',
    idea: 'CC-musiikkia tunnelmittain, jos tietovisamusiikille halutaan vaihtoehtoja.' },
  { nimi: 'Internet Archive', tyyppi: 'kuvat', lisenssi: 'vaihtelee (paljon PD)', api: true, url: 'https://archive.org', tila: 'idea',
    idea: '1800-luvun matkakirjojen skannaukset: aitoja sivuja, piirroksia ja karttoja isoisän kirjan kuvitukseksi.' },
  { nimi: 'Wikidata', tyyppi: 'data', lisenssi: 'CC0', api: true, url: 'https://www.wikidata.org', tila: 'kokeiltava',
    idea: 'Rakenteinen tieto (väkiluvut, korkeudet, vuodet) kysymysgeneroinnin ja faktantarkistuksen tueksi.' },
  { nimi: 'Our World in Data', tyyppi: 'data', lisenssi: 'CC BY', api: false, url: 'https://ourworldindata.org', tila: 'idea',
    idea: 'Nykypäivän tilastot kysymyksiin, joissa isoisän aikakäsitys törmää nykyaikaan — pelin ydinteema.' },
  { nimi: 'REST Countries', tyyppi: 'data', lisenssi: 'avoin', api: true, url: 'https://restcountries.com', tila: 'idea',
    idea: 'Liput, valuutat, kielet ja rajanaapurit koneluettavana — lippukysymykset ja tarkistukset.' },
  { nimi: 'UNESCO World Heritage', tyyppi: 'data', lisenssi: 'avoin lista', api: false, url: 'https://whc.unesco.org/en/list/', tila: 'idea',
    idea: 'Maailmanperintökohteet mantereittain — valmis runko uusien kaupunkien "aarrepaikoiksi".' },
  { nimi: 'Open-Meteo', tyyppi: 'live', lisenssi: 'avoin API', api: true, url: 'https://open-meteo.com', tila: 'kokeiltava',
    idea: 'Ilmainen sääAPI ilman avainta: saapumiskorttiin kaupungin sää juuri nyt — "Kairossa on tänään 34°C".' },
  { nimi: 'explore.org', tyyppi: 'live', lisenssi: 'upotus sallittu', api: false, url: 'https://explore.org/livecams', tila: 'kokeiltava',
    idea: 'Livekamerat Afrikan vesipaikoilta (Mpala, Tembe). "Ikkuna maailmaan" -nappi savannikaupungeissa.' },
  { nimi: 'Windy Webcams', tyyppi: 'live', lisenssi: 'API (ilmainen taso)', api: true, url: 'https://api.windy.com/webcams', tila: 'idea',
    idea: 'Kaupunkien webkamerat rajapinnan kautta — live-näkymä saapumiskorttiin missä kamera löytyy.' },
  { nimi: 'Skyline Webcams', tyyppi: 'live', lisenssi: 'upotus', api: false, url: 'https://www.skylinewebcams.com', tila: 'idea',
    idea: 'Paljon kaupunkikameroita (mm. Välimeri, Afrikka) — linkkeinä varovaisesti, upotusehdot tarkistettava.' },
];

// --- moottorit ----------------------------------------------------------
export const MOOTTORIT = [
  { id: 'elevenlabs', nimi: 'ElevenLabs', tila: 'kaytossa',
    mita: 'Puhe (eleven_v3 tunnetageilla, eleven_multilingual_v2 nopeussäädöllä) ja efektigeneraattori (/v1/sound-generation, myös luupit).',
    huomiot: 'Käytössä: intro, lentorepliikki, 23 tehostetta ja 32 kaupunkien saapumisluentaa (ääni: Viisas Kertoja). Krediitit kuluvat merkeistä; efektit halpoja, puhe kalliimpaa. Avain kierrätetään generointien jälkeen.' },
  { id: 'piper', nimi: 'Piper TTS (avoin)', tila: 'kokeiltava',
    mita: 'Ilmainen paikallinen puhesynteesi, suomenkielisiä ääniä. Ei krediittejä lainkaan.',
    huomiot: 'Laatu selvästi ElevenLabsia heikompi, mutta ilmainen varakone jos krediitit loppuvat tai halutaan massatuotantoa (esim. joka kaupungin tervehdys).' },
  { id: 'azure', nimi: 'Azure / Google TTS', tila: 'idea',
    mita: 'Suuret pilvipuhepalvelut, ilmainen kuukausikiintiö, hyvä suomi.',
    huomiot: 'Neutraalimpi luenta kuin ElevenLabs. Varteenotettava jos tarvitaan paljon puhetta halvalla.' },
  { id: 'stableaudio', nimi: 'Stable Audio', tila: 'idea',
    mita: 'Musiikin ja äänimaisemien generointi tekstistä.',
    huomiot: 'Voisi tehdä tietovisamusiikin variaatioita. Lisenssiehdot luettava ennen käyttöä pelissä.' },
  { id: 'musicgen', nimi: 'MusicGen (Meta, avoin)', tila: 'idea',
    mita: 'Avoin musiikkigeneraattori, ajettavissa itse.',
    huomiot: 'Ilmainen vaihtoehto taustamusiikin kokeiluihin; laatu vaihtelee.' },
  { id: 'deepl', nimi: 'DeepL', tila: 'idea',
    mita: 'Käännökset (ilmainen taso 500 000 merkkiä/kk).',
    huomiot: 'Jos peli joskus käännetään ruotsiksi/englanniksi, tämä on työkalu siihen.' },
];

// --- laajennussuunnat ---------------------------------------------------
//
// Nämä eivät ole pelin ominaisuuksia vaan suuntia koko projektille:
// asioita, jotka vaatisivat rahoitusta tai aikaa enemmän kuin yksi
// julkaisu. Erillään Suunnitelmasta, koska sekaisin mentynä pieni
// korjaus ja vuoden hanke näyttäisivät samalta työltä.
//
// Kirjoitettu niin, että tekstin voi liittää apurahahakemukseen
// sellaisenaan — siksi mukana on myös se, mikä on jo olemassa ja
// mitkä ovat tiedossa olevat vaikeat kohdat. Hakemuksessa
// realistisuus vakuuttaa enemmän kuin innostus.
export const LAAJENNUKSET = [
  {
    nimi: 'Oma kartta kouluun — lapset sisällöntekijöinä',
    tila: 'idea',
    lahde: 'Omistajan idea 3.8.2026, apurahahaun pohjaksi.',
    idea: 'Helppokäyttöinen työkalu, jolla koululuokka tekee opettajan '
      + 'johdolla kartan omasta kotipaikkakunnastaan: merkitsee kohteet, '
      + 'kirjoittaa niihin sisällön ja laatii kysymykset ja vastaukset. '
      + 'Lopputulos on pelattava kartta, samalla moottorilla kuin '
      + 'Matkakirja.',
    miksi: 'Oppiminen tapahtuu tekemisessä, ei pelaamisessa. Kysymyksen '
      + 'laatiminen vaatii aiheen ymmärtämistä selvästi enemmän kuin '
      + 'siihen vastaaminen: pitää tietää mikä on olennaista, mikä on '
      + 'uskottava väärä vaihtoehto ja mistä tiedon voi tarkistaa. '
      + 'Luokka oppii samalla lähdekritiikkiä, tekijänoikeuksia ja '
      + 'oman kotiseudun historiaa.',
    tekoaly: 'Tekoäly on työkalu luokan käsissä, ei sisällön tekijä. '
      + 'Se ehdottaa kysymyksiä oppilaan kirjoittamasta tekstistä, '
      + 'etsii kuvaehdokkaita avoimista arkistoista lisensseineen ja '
      + 'huomauttaa jos väite ei löydy lähteestä. Oppilas päättää. '
      + 'Näin lapset näkevät myös sen, että tekoäly ehdottaa väärin — '
      + 'ja se on osa opetusta.',
    valmiina: 'Pelimoottori, karttapiirto, kysymysmuodot (monivalinta, '
      + 'väittämä, valokuva, lippu, tapahtuma), avoimien aineistojen '
      + 'haku Wikimediasta ja arkistoista lisenssitietoineen, '
      + 'peilauskoneisto ja koko sisältöputki apureineen. '
      + 'Laajennus ei siis ala tyhjästä vaan toimivasta pelistä.',
    puuttuu: 'Selainpohjainen karttaeditori ilman koodia. Luokan oma '
      + 'tallennustila ja jako-osoite. Opettajan näkymä: kenen työ on '
      + 'kesken, mikä on tarkistamatta. Moderointi ennen julkaisua. '
      + 'Tietosuoja: alaikäisten tuotokset ja mahdolliset omat kuvat.',
    vaikeat: 'Kolme tiedossa olevaa vaikeaa kohtaa. '
      + '1) Tietosuoja: jos oppilas lisää oman valokuvan, siinä voi olla '
      + 'muita lapsia — tarvitaan selkeä sääntö ja tekninen este. '
      + '2) Moderointi: julkinen kartta tarvitsee jonkun, joka vastaa '
      + 'sisällöstä; opettaja ei ehdi lukea kaikkea. '
      + '3) Helppokäyttöisyys on koko hankkeen ydin eikä kuori — jos '
      + 'työkalu vaatii ohjeen, sitä ei käytetä oppitunnilla.',
    huomiot: 'Kohderyhmä kannattaa rajata hakemuksessa yhteen '
      + 'luokka-asteeseen ja kokeilu yhteen kouluun. Laajemmalti '
      + 'luvattu hanke on vaikeampi uskoa kuin kapea ja valmis.',
  },
];
