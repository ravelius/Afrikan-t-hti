/*
 * Tutki-ikkunan MAAKOHTAISET aiheet.
 *
 * Omistajan päätös 5.8.2026: "nostot tehdään ennemmin maasta kuin
 * kaupungista, ja Tutki-osion etusivulla olisi muutama itse
 * kaupungista." Ruoka, musiikki, historia ja luonto ovat maan tason
 * asioita — ja sama maapaketti palvelee kaikkia maan kaupunkeja, joten
 * yksi Italia kattaa Rooman, Venetsian ja Sisilian kerralla.
 *
 * TYÖNJAKO KAUPUNGIN KANSSA (js/ui.js rakennaSivut):
 *   1. Kaupungin omat aiheet (KULTTUURI_KATEGORIAT[cityId]) ensin —
 *      ne ovat lehden kansisivut: maamerkit ja paikallinen elämä.
 *   2. Kaupungin litteät nostot ("Elämää") heti niiden perään, jos
 *      omia aiheita ei ole.
 *   3. Maan aiheet viimeisenä. Jos kaupungilla ja maalla on sama
 *      aihe-id, kaupungin versio voittaa eikä maan sivua näytetä —
 *      Rooma voi siis halutessaan korvata Italian historian omallaan.
 *
 * Avain on ISO-3-maatunnus (sama kuin map.cityCountry ja RADIOT).
 * Kategorian muoto on sama kuin KULTTUURI_KATEGORIAT-taulussa, ja
 * samat säännöt pätevät (docs/tutki-aiheet.md): vakioaiheiden id:t,
 * kuvat ≥ 1200 px, lähde muodossa "Tekijä, Wikimedia Commons
 * (LISENSSI)". Monistusmitta on 5–6 aihetta ja 4–5 nostoa aihetta
 * kohti — Lontoo (54 nostoa) on lippulaiva, ei mittatikku.
 *
 * Sama maasivu näkyy maan joka kaupungissa tarkoituksella: se on kuin
 * sama matkaopas laukussa koko maan ajan, vain kansilehti vaihtuu.
 *
 * OTSIKKOON TULEE MAAN NIMI (omistajan toive 6.8.2026: "maata
 * koskevilla sivuilla otsikossa saisi olla maan nimi mukana"). Sivun
 * osastonotsikko luki pelkkä "HISTORIA", jolloin se näytti kaupungin
 * omalta osastolta — vaikka sama sivu toistuu maan jokaisessa
 * kaupungissa ja kertoo koko maasta. Nyt siinä lukee "EGYPTIN
 * HISTORIA". Muunnos tehdään vasta sivua rakennettaessa (ui.js
 * rakennaSivut), jotta aineistossa säilyy yksi lyhyt vakioaiheen nimi
 * eikä sitä tarvitse kirjoittaa maakohtaisesti uudestaan.
 */

/*
 * Maiden genetiivit, joita sääntö ei osaa: astevaihtelu (Kreikka →
 * Kreikan), monikot (Alankomaat → Alankomaiden), taipuva määrite
 * (Iso-Britannia → Ison-Britannian) ja yksittäiset omat tapauksensa
 * (Suomi → Suomen, Kypros → Kyproksen).
 *
 * Taulussa on vain nimiä, jotka ovat oikeasti pelin maadatassa
 * (map.countryShapes: africa, europe, maailmankartta) — arvattuja
 * varastoon ei kerätä. Sääntöä ei voi laajentaa yleiseksi
 * astevaihteluksi, koska vierasnimet eivät noudata sitä: Itävalta →
 * Itävallan mutta Malta → Maltan, ja Sri Lanka → Sri Lankan vaikka
 * lanka → langan. Siksi poikkeukset luetellaan.
 */
const MAAN_GENETIIVIT = {
  Alankomaat: 'Alankomaiden',
  Arabiemiirikunnat: 'Arabiemiirikuntien',
  'Etelä-Afrikka': 'Etelä-Afrikan',
  Filippiinit: 'Filippiinien',
  Irlanti: 'Irlannin',
  Islanti: 'Islannin',
  'Iso-Britannia': 'Ison-Britannian',
  Itävalta: 'Itävallan',
  Kreikka: 'Kreikan',
  Kypros: 'Kyproksen',
  Marokko: 'Marokon',
  Suomi: 'Suomen',
  Turkki: 'Turkin',
  Tšekki: 'Tšekin',
};

/**
 * Maan nimi genetiiviin: "Egypti" → "Egyptin", "Irak" → "Irakin".
 *
 * Sääntö on tarkoituksella kapea: vokaaliin päättyvä nimi saa n:n ja
 * konsonanttiin päättyvä in:n. Se riittää pelin maadatan 84 nimestä
 * kaikkiin muihin paitsi ylläolevan taulun poikkeuksiin — ja tuntematon
 * nimi taipuu sillä useimmiten oikein (Kanadan, Brasilian, Vietnamin)
 * sen sijaan että sivu jäisi ilman maan nimeä.
 */
export function maanGenetiivi(nimi) {
  const puhdas = (nimi ?? '').trim();
  if (!puhdas) return '';
  if (MAAN_GENETIIVIT[puhdas]) return MAAN_GENETIIVIT[puhdas];
  return /[aeiouyäö]$/i.test(puhdas) ? `${puhdas}n` : `${puhdas}in`;
}

/**
 * Maan aihesivun otsikko: "Egypti" + "Historia" → "Egyptin historia".
 *
 * Aiheen nimi pienenee, koska se ei ole enää otsikon ensimmäinen sana —
 * vakioaiheet (historia, ruoka, kuvataide, luonto, musiikki, tiede)
 * ovat yleisnimiä. Ruudulla otsikko on versaalilla, mutta DOM:iin jää
 * oikein kirjoitettua suomea myös ruudunlukijalle.
 *
 * Jos maan nimi puuttuu tai se on jo aiheen nimessä, otsikko jää
 * ennalleen — "Egyptin Egypti tänään" ei ole parannus.
 */
export function maanAiheOtsikko(maanNimi, aiheNimi) {
  const aihe = (aiheNimi ?? '').trim();
  const maa = (maanNimi ?? '').trim();
  if (!aihe || !maa) return aihe;
  if (aihe.toLowerCase().includes(maa.toLowerCase())) return aihe;
  return `${maanGenetiivi(maa)} ${aihe[0].toLowerCase()}${aihe.slice(1)}`;
}

export const MAA_KATEGORIAT = {
  GBR: [
    {
      id: 'historia',
      nimi: 'Historia',
      johdanto: 'Kivikehä, jonka rakentajat kiskoivat kivet satojen kilometrien '
        + 'päästä, pergamentti joka pani kuninkaankin lain alle, ja veturi '
        + 'joka aloitti rautatieajan.',
      nostot: [
        {
          otsikko: 'Kivet kiskottiin 250 kilometrin päästä',
          aika: 'n. 2500 eaa.',
          tiedosto: 'Stonehenge2007 07 30.jpg',
          teksti: 'Stonehengen suurimmat kivet painavat 25 tonnia, mutta '
            + 'hämmästyttävimpiä ovat pienemmät siniset kivet: ne louhittiin '
            + 'Walesin Preselivuorilta, noin 250 kilometrin päästä. Kukaan ei '
            + 'tiedä varmasti, miten ne siirrettiin — pyörää ei vielä ollut. '
            + 'Kehä on rakennettu niin, että keskikesän auringonnousu osuu '
            + 'täsmälleen sisäänkäynnin akselille, joten se toimii '
            + 'jättimäisenä kalenterina. Rakentamiseen meni yli tuhat vuotta '
            + 'ja monta sukupolvea: ne jotka aloittivat, eivät nähneet sitä '
            + 'valmiina.',
          selite: 'Stonehengen kehä Wiltshiren tasangolla. Vaakasuorat kivet on '
            + 'liitetty pystykiviin puusepän tapein.',
          lahde: 'garethwiscombe, Wikimedia Commons (CC BY 2.0)',
          wiki: 'Stonehenge',
        },
        {
          otsikko: 'Mustat kivet piirtävät areenan',
          tiedosto: 'The Guildhall (16763316129).jpg',
          teksti: 'Guildhall Yardin aukion kivetyksessä kaartaa tummasta kivestä '
            + 'ladottu soikea juova. Se ei ole koriste vaan tarkka merkki: '
            + 'siinä kulki roomalaisen amfiteatterin areenan ulkoreuna. Koko '
            + 'rakennelma oli noin 100 metriä pitkä ja 85 metriä leveä, ja '
            + 'katsomoon mahtui noin 7 000 katsojaa eli viidesosa Londiniumin '
            + 'väestä. Areena tehtiin puusta vuonna 70 ja rakennettiin '
            + 'kivestä uudelleen 100-luvun alussa. Sitten se unohtui '
            + 'vuosisadoiksi ja löytyi vasta 1988, kun aukion laitaan '
            + 'kaivettiin taidemuseon perustuksia. Muurit, puinen '
            + 'vedenpoistokouru ja areenan hiekkapohja ovat nyt esillä museon '
            + 'kellarissa noin kuusi metriä kadun pinnan alapuolella.',
          selite: 'Guildhall Yardin aukio Lontoon Cityssä. Kivetyksen halki '
            + 'kaartava tumma juova merkitsee roomalaisen amfiteatterin '
            + 'areenan ulkoreunan, ja oikealla on Guildhall Art Gallery, '
            + 'jonka kellarissa rauniot ovat esillä.',
          lahde: 'It\'s No Game (Duncan Harris), Wikimedia Commons (CC BY 2.0)',
          wiki: 'Londinium',
        },
        {
          otsikko: 'Kuningas pakotettiin lain alle',
          aika: '1215',
          tiedosto: 'Magna Carta (British Library Cotton MS Augustus II.106).jpg',
          teksti: 'Kuningas Juhana oli hävinnyt sotia ja kiristänyt veroja niin, '
            + 'että paronit kyllästyivät. Kesäkuussa 1215 he pakottivat hänet '
            + 'Runnymeden niitylle allekirjoittamaan asiakirjan, joka sanoi '
            + 'jotain siihen asti kuulumatonta: myös kuningas on lain '
            + 'alainen. Magna Cartan tunnetuin kohta lupaa, ettei ketään '
            + 'vapaata miestä saa vangita ilman maan lain mukaista tuomiota. '
            + 'Juhana yritti mitätöidä sopimuksen heti, mutta ajatus jäi '
            + 'elämään — ja siitä kasvoi vähitellen ajatus siitä, että '
            + 'vallalla on rajat.',
          selite: 'Yksi neljästä säilyneestä vuoden 1215 kappaleesta. Teksti on '
            + 'latinaa, kirjoitettu rautagallusmusteella pergamentille.',
          lahde: 'Tuntematon kirjuri, Wikimedia Commons (PD)',
          wiki: 'Magna Carta',
        },
        {
          otsikko: 'Leipomon uuni poltti kaupungin',
          aika: '1666',
          tiedosto: 'Great Fire London.jpg',
          teksti: 'Tuli syttyi syyskuun yönä Pudding Lanen leipomossa ja levisi '
            + 'neljässä päivässä läpi puisen Lontoon. Talot oli rakennettu '
            + 'niin, että yläkerrat työntyivät kadun päälle — ylimmät '
            + 'kerrokset melkein koskettivat toisiaan, ja liekit hyppäsivät '
            + 'kadun yli vaivatta. Palo tuhosi 13 000 taloa ja Pyhän Paavalin '
            + 'katedraalin. Kuolleita kirjattiin silti vain kuusi. '
            + 'Jälkeenpäin kaupunki määrättiin rakennettavaksi tiilestä ja '
            + 'kivestä, ja kadut levennettiin — palo kirjoitti Lontoon '
            + 'uusiksi.',
          selite: 'Tuntemattoman taiteilijan maalaus noin vuodelta 1675: palo '
            + 'nähtynä Thamesilta, vanha Lontoon silta vasemmalla.',
          lahde: 'Tuntematon taiteilija, Wikimedia Commons (PD)',
          wiki: 'Lontoon suurpalo',
        },
        {
          otsikko: 'Kilpailu, joka ratkaisi rautatien',
          aika: '1829',
          tiedosto: 'Stephenson Rocket at the National Railway Museum York Oct25 01.jpg',
          teksti: 'Kun Liverpoolin ja Manchesterin välille rakennettiin rataa, '
            + 'kukaan ei ollut varma, kannattaisiko vaunuja vetää veturilla '
            + 'vai köydellä ja paikallaan seisovalla höyrykoneella. Asia '
            + 'ratkaistiin kilpailulla Rainhillissä 1829. George ja Robert '
            + 'Stephensonin Rocket voitti: se kulki 46 kilometriä tunnissa, '
            + 'mikä oli silloin käsittämätön vauhti. Salaisuus oli '
            + 'kattilassa, jonka läpi kulki 25 kuparista putkea — mitä '
            + 'enemmän pintaa, sitä nopeammin vesi kiehui. Kaikki '
            + 'höyryveturit rakennettiin sen jälkeen samalla periaatteella.',
          selite: 'Rocketin säilynyt runko Yorkin rautatiemuseossa. Etupyörät '
            + 'ovat alkuperäiset, savupiippu myöhemmin lyhennetty.',
          lahde: 'Malcolmxl5, Wikimedia Commons (CC0)',
          wiki: 'George Stephenson',
        },
        {
          otsikko: 'Rantakatu on viemärin katto',
          tiedosto: 'Installation of the sewerage system of the Metropolis Wellcome M0010346.jpg',
          teksti: 'Kesällä 1858 Thames löyhkäsi niin pahasti, että parlamentin '
            + 'jokipuolen verhot kastettiin kalkkikloridiin ja edustajat '
            + 'puhuivat vakavissaan hallituksen siirtämisestä Oxfordiin tai '
            + 'St Albansiin. Laki uudesta viemäriverkosta säädettiin jo saman '
            + 'kesän elokuussa. Insinööri Joseph Bazalgette muurasi 318 '
            + 'miljoonasta tiilestä järjestelmän, joka vie jätevedet '
            + 'kaupungin ohi itään. Viemäri tarvitsi tilaa, joten jokeen '
            + 'rakennettiin uusi rantamuuri ja väli täytettiin maalla: noin '
            + 'yhdeksän hehtaaria eli 22 eekkeriä Thamesia muuttui kaduksi. '
            + 'Victoria Embankmentin leveä rantakatu on siis viemärin katto — '
            + 'ja saman penkereen sisällä kulkee myös metro.',
          selite: 'Poikkileikkaus Thamesin penkereestä vuodelta 1867, Charing '
            + 'Crossin aseman kohdalta. Kadun alle on merkitty johtotunneli '
            + '(1), matalan tason viemäri (2), metrorata höyryvetureineen (3) '
            + 'ja joen pohjan alle paineilmarata (4); oikealla muurataan '
            + 'uutta rantamuuria ulos jokeen.',
          lahde: 'The Illustrated London News / Wellcome Collection, Wikimedia Commons (PD)',
          wiki: 'Thames',
        },
        {
          otsikko: 'Maailman ensimmäinen metro',
          tiedosto: 'Metropolitan Railway, Baker Street Station.jpg',
          teksti: 'Lontoon metro avattiin 10. tammikuuta 1863 maailman '
            + 'ensimmäisenä. Vaunut olivat puuta ja niitä valaistiin '
            + 'kaasulyhdyillä, ja maan alla junaa veti höyryveturi — savu '
            + 'johdettiin ulos tunneliin jätetyistä aukoista. Ensimmäisenä '
            + 'vuonna tehtiin 9,5 miljoonaa matkaa. Nyt asemia on 272 ja '
            + 'rataa 400 kilometriä.',
          selite: 'Baker Streetin asema noin 1863. Krinoliinihameiset matkustajat '
            + 'odottavat laiturilla, ja tunnelin suulla savuaa höyryveturi.',
          lahde: 'Wikimedia Commons (PD)',
          wiki: 'Lontoon metro',
        },
        {
          otsikko: 'Kirkko, josta tuli puutarha',
          tiedosto: 'St.Dunstan in the East Church Garden, London - geograph.org.uk - 2595823.jpg',
          teksti: 'Vuoden 1666 suurpalo tuhosi Cityssä 87 seurakuntakirkkoa. St '
            + 'Dunstan-in-the-East selvisi vaurioituneena, se paikattiin, ja '
            + 'Christopher Wren lisäsi siihen tornin, jonka neulanterävä '
            + 'huippu lepää neljän kaaren varassa. Kirkkosali rakennettiin '
            + 'vielä kertaalleen uudelleen 1817–1821, mutta Wrenin torni jäi '
            + 'paikalleen. Vuoden 1941 pommituksissa kirkkoon osui täysosuma: '
            + 'pystyyn jäivät torni sekä pohjois- ja eteläseinä. Uutta '
            + 'kirkkoa ei rakennettu, vaan kaupunki päätti 1967 jättää '
            + 'rauniot paikalleen ja istuttaa niiden sisään puutarhan, joka '
            + 'avattiin 1971. Nyt ikkuna-aukoista työntyy puita ja '
            + 'köynnöksiä, ja entisen keskilaivan kohdalla lorisee matala '
            + 'suihkulähde.',
          selite: 'Goottilainen holvikaari St Dunstan-in-the-Eastin raunioissa. '
            + 'Kiviportaat johtavat entiseen kirkkosaliin, jossa kasvaa nyt '
            + 'palmu ja tiheää vihreää; seinät ovat pystyssä, mutta kattoa ei '
            + 'ole.',
          lahde: 'Peter Trimming, Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Lontoon pommitukset',
        },
      ],
    },
    {
      id: 'kuvataide',
      nimi: 'Kuvataide',
      nostot: [
        {
          otsikko: 'Piirros, joka synnytti tekijänoikeuden',
          tiedosto: 'A Rake\'s Progress, Plate 2 MET DP825208.jpg',
          teksti: 'Lontoossa syntynyt William Hogarth kertoi tarinansa '
            + 'kuvasarjoina, ja kun niistä tehdyt vedokset menivät kaupaksi, '
            + 'painajat kopioivat ne omiin nimiinsä muutamassa päivässä. '
            + 'Hogarth vei asian parlamenttiin, ja 25. kesäkuuta 1735 astui '
            + 'voimaan laki, jota kutsutaan yhä Hogarthin laiksi: se oli '
            + 'ensimmäisiä tekijänoikeuslakeja, joka suojasi kuvia eikä '
            + 'pelkkää kirjoitettua sanaa. Samana päivänä hän julkaisi '
            + 'kahdeksan lehden sarjansa perintönsä tuhlaavasta nuoresta '
            + 'miehestä, ja jokaisen lehden alle painettiin rivi "Publish\'d '
            + 'according to Act of Parliament".',
          selite: 'Hogarthin kuvasarjan toinen lehti: nuori perijä seisoo salinsa '
            + 'keskellä miekkailumestarin, viulua pitelevän tanssimestarin, '
            + 'metsästystorven soittajan ja muiden onnenonkijoiden '
            + 'ympäröimänä. Alareunan tekstirivi kertoo, että lehti on '
            + 'julkaistu parlamentin lain mukaisesti 25. kesäkuuta 1735.',
          lahde: 'William Hogarth / Metropolitan Museum of Art, Wikimedia Commons (CC0)',
          wiki: 'William Hogarth',
        },
        {
          otsikko: 'Parturin poika maalasi valon',
          tiedosto: 'The Fighting Temeraire, JMW Turner, National Gallery.jpg',
          teksti: 'Joseph Mallord William Turner syntyi vuonna 1775 Covent '
            + 'Gardenissa, jossa hänen isällään oli parturinliike Maiden '
            + 'Lanen varrella. Isä ripusti kymmenvuotiaan poikansa '
            + 'piirustuksia näyteikkunaan ja myi niitä muutamalla '
            + 'shillingillä, ja neljäntoistavuotiaana poika pääsi '
            + 'kuninkaallisen taideakatemian oppilaaksi. Kuollessaan 1851 hän '
            + 'testamenttasi kansakunnalle noin 300 öljymaalausta, noin 30 '
            + '000 akvarellia ja piirustusta sekä satoja luonnoskirjoja ja '
            + 'toivoi valmiiden töidensä pysyvän yhdessä. Toive ei aivan '
            + 'toteutunut, mutta hänen töitään katsellaan yhä ilman '
            + 'pääsymaksua Tate Britainissa ja National Galleryssä.',
          selite: 'Turnerin Taisteleva Temeraire vuodelta 1839: kalpea, '
            + 'kolmimastoinen sotalaiva liukuu pienen mustatorvisen '
            + 'höyryhinaajan perässä viimeiseen satamaansa purettavaksi. '
            + 'Oikealla aurinko laskee punaisena, ylhäällä vasemmalla '
            + 'häämöttää ohut kuunsirppi.',
          lahde: 'Joseph Mallord William Turner, Wikimedia Commons (PD)',
          wiki: 'William Turner',
        },
        {
          otsikko: 'Talo, jota ei saanut muuttaa',
          tiedosto: 'Interior view - Sir John Soane\'s Museum - DSC00041.jpg',
          teksti: 'Arkkitehti John Soane täytti kotinsa Lincoln\'s Inn Fieldsin '
            + 'varrella kipsivaloksilla, antiikin palasilla ja maalauksilla, '
            + 'ja sai vuonna 1833 parlamentin säätämään lain: hänen '
            + 'kuolemansa jälkeen taloa oli säilytettävä mahdollisimman '
            + 'tarkalleen sellaisena kuin hän sen jätti — osaksi siksi, ettei '
            + 'riitaantunut George-poika perisi sitä. Taulusalissa seinät '
            + 'ovat suuria saranoituja levyjä, jotka aukeavat kaapinovien '
            + 'tavoin, joten pieneen huoneeseen mahtuu kolminkertainen määrä '
            + 'tauluja. Sisään pääsee yhä ilmaiseksi, mutta vain '
            + 'yhdeksänkymmentä ihmistä kerrallaan.',
          selite: 'Näkymä ylös Soanen museon kupolitilaan: seinät on peitetty '
            + 'lattiasta kattoon kipsivaloksilla, pylväänpäillä ja '
            + 'koristepalasilla. Kaaren takana kohoaa Apollon antiikkipatsaan '
            + 'kipsikopio, sen edessä on rivi koristeltuja maljakoita ja '
            + 'alempana leveä reliefivyö.',
          lahde: 'Daderot, Wikimedia Commons (CC0)',
          wiki: 'John Soane',
        },
        {
          otsikko: 'Neula, joka ei ole Kleopatran',
          tiedosto: 'Cleopatra\'s Needle 2022-04-24d.jpg',
          teksti: 'Victoria Embankmentin rantakadulla seisoo obeliski, jonka '
            + 'faarao Thutmosis III pystytti Egyptiin noin vuonna 1450 eaa. '
            + 'eli lähes 1 400 vuotta ennen Kleopatran syntymää, vaikka kivi '
            + 'on nimetty tämän mukaan. Se lähti Aleksandriasta syyskuussa '
            + '1877 maaten 28 metriä pitkän rautasylinterin sisällä, ja '
            + 'Biskajanlahden myrskyssä hukkui kuusi pelastusveneeseen '
            + 'lähtenyttä miestä, joiden nimet on kaiverrettu jalustan '
            + 'pronssilaattaan. Kivi pystytettiin paikalleen vasta syyskuussa '
            + '1878, ja kun viereen putosi pommi vuonna 1917, sirpaleiden '
            + 'jäljet jätettiin tahallaan korjaamatta.',
          selite: 'Kleopatran neula Victoria Embankmentilla alhaalta kuvattuna: '
            + 'graniittiin hakatut hieroglyfit ja kartussit nousevat kohti '
            + 'sinistä taivasta. Jalustan pronssisessa kannessa levittäytyy '
            + 'siipipari, jonka keskellä on kahden kobran välissä pyhä '
            + 'skarabee.',
          lahde: 'Djehouty, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Kleopatran neulat',
        },
      ],
    },
    {
      id: 'kirjallisuus',
      nimi: 'Kirjallisuus',
      johdanto: 'Näytelmäkirjailija, joka keksi sanoja jotka yhä puuttuivat, '
        + 'orpopoika jonka tarina muutti lakia, ja etsivä jolle lähetetään '
        + 'yhä kirjeitä.',
      nostot: [
        {
          otsikko: 'Hän keksi sanat, joita ei ollut',
          tiedosto: 'The Globe Theatre, in London, in 2011.jpg',
          teksti: 'William Shakespeare kirjoitti noin 38 näytelmää, ja kun '
            + 'sopivaa sanaa ei ollut, hän teki sen itse. Englannin kieleen '
            + 'jäi häneltä satoja ilmauksia — muun muassa sanat lonely, '
            + 'bedroom ja eyeball ovat ensi kertaa kirjattu hänen '
            + 'teksteistään. Globe-teatterissa halvin lippu maksoi pennin, ja '
            + 'sen ostaneet seisoivat avoimen katon alla näyttämön edessä; '
            + 'heitä kutsuttiin groundlingeiksi. Teatteri paloi 1613, kun '
            + 'näytelmän tykinlaukaus sytytti olkikaton. Nykyinen Globe on '
            + '1997 valmistunut jäljennös muutaman sadan metrin päässä '
            + 'alkuperäisestä.',
          selite: 'Nykyinen Globe Thamesin etelärannalla: sama pyöreä muoto ja '
            + 'avoin katto kuin 1599 rakennetussa alkuperäisessä.',
          lahde: 'Amy Truter, Wikimedia Commons (CC BY 2.0)',
          wiki: 'Globe-teatteri',
        },
        {
          otsikko: '42 773 sanaa yhdestä talosta',
          tiedosto: 'Statue of Hodge - Dr Johnsons cat - in Gough Square (4043318307).jpg',
          teksti: 'Samuel Johnson allekirjoitti sanakirjasopimuksen kesäkuussa '
            + '1746 ja sai palkkioksi 1 500 guineaa. Työ tehtiin 17 Gough '
            + 'Squaren talossa Fleet Streetin takana, jonne hän muutti 1748, '
            + 'ja kirja ilmestyi 15. huhtikuuta 1755. Siinä oli 42 773 '
            + 'hakusanaa ja noin 114 000 lainausta noin viideltäsadalta '
            + 'kirjailijalta. Ullakolla kuusi apulaista seisoi pitkän pöydän '
            + 'ääressä ja kopioi Johnsonin kirjoihin merkitsemiä kohtia '
            + 'paperiliuskoille. Talon edustalla istuu nykyään pronssinen '
            + 'kissa: Johnsonin Hodge, jolle isäntä kävi itse ostamassa '
            + 'ostereita, jottei palvelusväki suuttuisi elukalle.',
          selite: 'Hodge-patsas Gough Squarella, tohtori Johnsonin talon '
            + 'vastapäätä. Jon Bickleyn vuonna 1997 tekemä kissa istuu '
            + 'pronssisen sanakirjan päällä, ja kirjan kannella on kaksi '
            + 'tyhjää osterinkuorta.',
          lahde: 'Elliott Brown, Commons (CC BY 2.0)',
          wiki: 'Samuel Johnson',
        },
        {
          otsikko: 'Kirjailija, joka oli itse ollut lapsityöläinen',
          tiedosto: 'Charles Dickens by Daniel Maclise.jpg',
          teksti: 'Kun Charles Dickens oli kaksitoista, hänen isänsä joutui '
            + 'velkavankilaan ja poika lähetettiin töihin '
            + 'kenkälankkitehtaaseen liimaamaan etikettejä purkkeihin. Hän ei '
            + 'kertonut siitä juuri kenellekään, mutta kokemus päätyi '
            + 'kirjoihin: Oliver Twistin ja David Copperfieldin lapset ovat '
            + 'yksin aikuisten maailmassa. Romaanit ilmestyivät '
            + 'jatkokertomuksina lehdissä kuukausi kerrallaan, ja lukijat '
            + 'odottivat seuraavaa osaa kuin sarjan jaksoa. Dickensin '
            + 'kuvaukset köyhien oloista vaikuttivat siihen, että lapsityötä '
            + 'alettiin rajoittaa laissa.',
          selite: 'Daniel Maclisen muotokuva vuodelta 1839, jolloin 27-vuotias '
            + 'Dickens oli jo kuuluisa.',
          lahde: 'Daniel Maclise, Wikimedia Commons (PD)',
          wiki: 'Charles Dickens',
        },
        {
          otsikko: 'Tarina syntyi soutuveneessä',
          tiedosto: 'John Tenniel - Illustration from The Nursery Alice (1890) - c03757 07.jpg',
          teksti: 'Heinäkuisena iltapäivänä 1862 matemaatikko Charles Dodgson '
            + 'souti Thamesilla kolmen pikkutytön kanssa ja keksi matkalla '
            + 'tarinan tylsistyneestä Alicesta, joka putoaa kaninkoloon. '
            + 'Kymmenvuotias Alice Liddell pyysi kirjoittamaan sen muistiin. '
            + 'Dodgson julkaisi sen nimellä Lewis Carroll. Kuvittajaksi tuli '
            + 'Punch-lehden pilapiirtäjä John Tenniel, jonka kuvista tuli '
            + 'niin tunnettuja, että moni näkee Liisan yhä juuri sellaisena. '
            + 'Hullun hatuntekijän hattuun kirjoitettu "10/6" on hinta: '
            + 'kymmenen shillinkiä ja kuusi penceä.',
          selite: 'Hullut teekutsut John Tennielin kuvituksena. Väritetty laitos '
            + 'Nursery Alice -kirjasta vuodelta 1890.',
          lahde: 'John Tenniel, Wikimedia Commons (PD)',
          wiki: 'Liisan seikkailut ihmemaassa',
        },
        {
          otsikko: 'Osoite, jota ei ollut olemassa',
          tiedosto: 'Sherlock Holmes Museum, Baker Street, London (2).jpg',
          teksti: 'Arthur Conan Doyle antoi Sherlock Holmesille osoitteen 221B '
            + 'Baker Street, vaikka sellaista ei ollut olemassa: vuonna 1890 '
            + 'katu loppui numeroon 85. Vasta 1930-luvulla Baker Street '
            + 'pidennettiin ja talot numeroitiin uudelleen, jolloin numerot '
            + '219–229 osuivat asuntoluottoyhtiö Abbey Nationalin juuri '
            + 'valmistuneeseen pääkonttoriin. Sinne alkoi tulla kirjeitä '
            + 'ympäri maailmaa: ihmiset pyysivät Holmesia ratkaisemaan omia '
            + 'arvoituksiaan. Yhtiö palkkasi työntekijän, jonka tehtävä oli '
            + 'vastata niihin, ja tätä työtä riitti vuodesta 1932 aina '
            + 'vuoteen 2002. Vakiovastaus kuului, että etsivä on jäänyt '
            + 'eläkkeelle ja hoitaa nyt mehiläisiä Sussexissa.',
          selite: 'Sherlock Holmes -museon vihreä julkisivu Baker Streetillä. '
            + 'Parvekkeen takana seinässä on sininen laatta, jossa lukee 221b '
            + 'ja vuodet 1881–1904, vaikka talo on todellisuudessa numeroiden '
            + '237 ja 241 välissä.',
          lahde: 'MOs810, Commons (CC BY-SA 4.0)',
          wiki: 'Sherlock Holmes',
        },
        {
          otsikko: 'Patsas, joka ilmestyi yön aikana',
          tiedosto: 'Peter Pan Statue in Kensington Gardens (01).jpg',
          teksti: 'J. M. Barrie tilasi Peter Pan -patsaan omalla rahallaan ja '
            + 'antoi pystyttää sen Kensington Gardensiin 30. huhtikuuta 1912 '
            + 'salaa, ilman lupaa ja ilman juhlaa, jotta lapset luulisivat '
            + 'keijujen tuoneen sen yöllä. Seuraavana aamuna hän ilmoitti '
            + 'Times-lehdessä, että Serpentinen rannalle on ilmestynyt '
            + 'vappulahja: Peter Pan puhaltamassa pilliään puunkannon päällä. '
            + 'Kuvanveistäjä George Frampton ei kuitenkaan käyttänyt mallina '
            + 'Michael Llewelyn Daviesia, jonka valokuvat Barrie oli hänelle '
            + 'antanut, ja kirjailija jäi pettyneeksi: hänen mielestään '
            + 'patsaasta puuttui Peterin pirullinen puoli.',
          selite: 'Peter Pan soittaa pilliä puunkannon päällä Kensington '
            + 'Gardensissa. Kannon kylkeen on valettu oravia, hiiriä, kaneja '
            + 'ja keijuja, ja koko veistos on runsaat neljä metriä korkea.',
          lahde: 'Ethan Doyle White, Commons (CC BY-SA 4.0)',
          wiki: 'Peter Pan',
        },
        {
          otsikko: 'Karhu, jolla on lappu kaulassa',
          tiedosto: 'Statue of Paddington Bear with offerings.jpg',
          teksti: 'Michael Bond osti jouluaattona 1956 Selfridgesin tavaratalosta '
            + 'nallen, joka oli jäänyt yksin hyllylle, ja vei sen lahjaksi '
            + 'vaimolleen. Tarina syntyi kymmenessä päivässä ja kirja '
            + 'ilmestyi 13. lokakuuta 1958; karhu sai nimen läheisen '
            + 'rautatieaseman mukaan, sillä Bond asui tuolloin Paddingtonin '
            + 'kupeessa. Paddingtonin kaulassa roikkuu lappu "Please look '
            + 'after this bear. Thank you", ja esikuvana olivat sota-ajan '
            + 'uutisfilmit, joissa lontoolaislapsia lähetettiin maaseudulle '
            + 'turvaan nimilappu kaulassa ja pieni matkalaukku kädessä.',
          selite: 'Marcus Cornishin veistämä ja vuonna 2000 paljastettu '
            + 'Paddington-patsas Paddingtonin asemalla heinäkuussa 2017. '
            + 'Kirjailija Michael Bond oli kuollut 27. kesäkuuta, ja ihmiset '
            + 'olivat tuoneet patsaan juurelle marmeladipurkkeja, kortteja ja '
            + 'kukkia.',
          lahde: 'JRennocks, Commons (CC BY-SA 4.0)',
          wiki: 'Michael Bond',
        },
        {
          otsikko: 'Runoilijoiden nurkka syntyi vahingossa',
          tiedosto: 'Geoffrey Chaucer tomb, Poet\'s Corner.jpg',
          teksti: 'Geoffrey Chaucer haudattiin Westminster Abbeyhin vuonna 1400, '
            + 'mutta ei runojensa takia: hän oli hoitanut kuninkaan '
            + 'rakennustöitä ja asunut vuokralla kirkon alueella. Vasta 156 '
            + 'vuotta myöhemmin Nicholas Brigham teetti hänelle komean haudan '
            + 'ja siirsi luut siihen. Kun Edmund Spenser haudattiin viereen '
            + '1599, tapa oli syntynyt. Nyt saman eteläisen ristivarren '
            + 'lattia on täynnä kirjailijoiden muistolaattoja, joiden yli '
            + 'kävellään joka päivä.',
          selite: 'Chaucerin hauta Westminster Abbeyn runoilijoiden nurkassa. '
            + 'Tumma marmoriarkku ja goottilainen katos ovat vuodelta 1556, '
            + 'ja latinankielisessä kirjoituksessa mainitaan niiden teettäjä '
            + 'N. Brigham.',
          lahde: '14GTR, Commons (CC BY-SA 4.0)',
          wiki: 'Geoffrey Chaucer',
        },
      ],
    },
    {
      id: 'musiikki',
      nimi: 'Musiikki',
      johdanto: 'Kuninkaan jokijuhlat, marssi jota soitetaan koulun päättäjäisissä '
        + 'ympäri maailmaa, merimiesten työlaulu.',
      nostot: [
        {
          otsikko: 'Orkesteri soitti proomulla kuninkaalle',
          tiedosto: 'George Frideric Handel by Thomas Hudson.jpg',
          teksti: 'Saksassa syntynyt Georg Friedrich Händel muutti Lontooseen ja '
            + 'jäi loppuiäkseen. Vuonna 1717 kuningas Yrjö I halusi juhlat '
            + 'Thamesille: viisikymmentä muusikkoa sijoitettiin proomulle, '
            + 'joka seurasi kuninkaan venettä pitkin jokea. Händelin '
            + 'Vesimusiikki soi niin, että kuningas pyysi toistamaan koko '
            + 'teoksen kolmesti — soittajat pelasivat sen läpi useaan kertaan '
            + 'matkalla Whitehallista Chelseaan ja takaisin. Händel sävelsi '
            + 'myös Messias-oratorion, jonka Halleluja-kuoron aikana yleisö '
            + 'nousee yhä seisomaan.',
          selite: 'Thomas Hudsonin muotokuva Händelistä. Säveltäjä eli Lontoossa '
            + 'lähes viisikymmentä vuotta.',
          lahde: 'Thomas Hudson, Wikimedia Commons (PD)',
          wiki: 'Georg Friedrich Händel',
          musiikkiNayte: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/83/4-George_Frideric_Handel_-_Water_Music_Suite_in_F_major_%28Presto%29_HWV348.ogg/4-George_Frideric_Handel_-_Water_Music_Suite_in_F_major_%28Presto%29_HWV348.ogg.mp3',
          musiikkiNayteNimi: 'Händel: Vesimusiikki, Presto (CC BY-SA 3.0)',
        },
        {
          otsikko: 'Sinfonia, joka sävellettiin päässä',
          tiedosto: 'Mozart was here, pair of houses, 180 ^ 182 Ebury Street - geograph.org.uk - 8013426.jpg',
          teksti: 'Mozartin perhe viipyi Lontoossa viisitoista kuukautta, '
            + 'huhtikuusta 1764 heinäkuuhun 1765. Kesällä 1764 isä Leopold '
            + 'sairastui pahasti, perhe muutti silloiseen Chelsean kylään '
            + 'osoitteeseen 180 Ebury Street, ja talossa määrättiin täysi '
            + 'hiljaisuus: kosketinsoittimeen ei saanut koskea kukaan. '
            + 'Kahdeksanvuotias Wolfgang sävelsi silloin ensimmäisen '
            + 'sinfoniansa päässään, ilman soitinta. Se kantaesitettiin 21. '
            + 'helmikuuta 1765 Haymarketin pienessä teatterissa, ja poika '
            + 'johti esitystä itse.',
          selite: 'Ebury Streetin talot 180 ja 182 Belgraviassa; molempien '
            + 'pohjakerros on rapattu valkeaksi. Oikeanpuoleisessa talossa '
            + '180 on ruskea pyöreä laatta, jossa lukee Wolfgang Amadeus '
            + 'Mozart 1756–1791. Vasemmanpuoleisen naapuritalon 182 laatta on '
            + 'kirjailijapariskunnalle Harold Nicolson ja Vita '
            + 'Sackville-West.',
          lahde: 'A J Paxton, Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Sinfonia nro 1 (Mozart)',
        },
        {
          otsikko: 'Kellot soivat lukuja, ei sävelmää',
          tiedosto: 'Great Bells of Bow.jpg',
          teksti: 'Englantilaisessa kellonsoitossa kello heilahtaa lähes täyden '
            + 'ympyrän, ja jokaista kelloa vetää oma soittajansa omasta '
            + 'köydestään. Sävelmää ei synny: kellot soitetaan joka '
            + 'kierroksella eri järjestyksessä, eikä sama järjestys saa '
            + 'toistua kertaakaan. Kahdellatoista kellolla järjestyksiä on '
            + '479 001 600, ja niiden kaikkien läpi soittaminen veisi yli '
            + 'kolmekymmentä vuotta. Täysi peal on vähintään viisituhatta '
            + 'vaihdosta ja kestää noin kolme tuntia, kaikki ulkomuistista '
            + 'ilman nuotteja.',
          selite: 'St Mary-le-Bow\'n kellohuone Cityssä. Kaksitoista pronssikelloa '
            + 'lepää kehikossaan suu alaspäin, ja jokaisen kyljessä on iso '
            + 'pyörä, jonka ympäri soittajan köysi kiertyy. Kellojen '
            + 'olkapäähän on valettu valajan nimi Mears. Vanhastaan oikea '
            + 'lontoolainen eli cockney on syntynyt näiden kellojen '
            + 'kuuluvilla.',
          lahde: 'Bellminsterboy, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'St Mary-le-Bow',
        },
        {
          otsikko: 'Marssi, jota soitetaan päättäjäisissä',
          tiedosto: 'Edward Elgar 1905.jpg',
          teksti: 'Edward Elgar opetteli musiikin itse: hänen isänsä piti '
            + 'soitinkauppaa, ja poika luki nuotteja varaston lattialla. '
            + 'Vuonna 1901 valmistunut marssi Pomp and Circumstance nro 1 sai '
            + 'yleisön niin villiksi, että se piti soittaa kolmesti '
            + 'peräkkäin. Sen keskiosan laulava melodia tunnetaan '
            + 'Britanniassa nimellä Land of Hope and Glory, ja Yhdysvalloissa '
            + 'sama sävelmä soi käytännössä joka koulun ja yliopiston '
            + 'päättäjäisissä — tapa alkoi Yalessa 1905, kun Elgar itse oli '
            + 'paikalla vastaanottamassa kunniatohtorin arvoa.',
          selite: 'Elgar vuonna 1905, samana vuonna kun hänen marssistaan tuli '
            + 'amerikkalaisten päättäjäisten vakiosävelmä.',
          lahde: 'Arthur Elson, Wikimedia Commons (PD)',
          wiki: 'Edward Elgar',
          musiikkiNayte: 'https://upload.wikimedia.org/wikipedia/commons/2/28/ELGAR_Pomp_and_Circumstance_in_D%2C_Opus_39%2C_No._1_-_United_States_Marine_Band.mp3',
          musiikkiNayteNimi: 'Elgar: Pomp and Circumstance nro 1 — United States Marine Band (PD)',
        },
        {
          otsikko: 'Laulu piti nostoväen tahdissa',
          tiedosto: 'Cutty Sark rigging 17RM0464.jpg',
          teksti: 'Purjelaivalla monta työtä vaati yhtäaikaista voimaa: ankkurin '
            + 'nostaminen tai purjeen kiristäminen onnistui vain, jos kaikki '
            + 'vetivät samalla hetkellä. Siksi laulettiin. Merimieslauluissa '
            + 'esilaulaja lauloi säkeen ja miehistö vastasi kertosäkeen — ja '
            + 'juuri kertosäkeen kohdalla vedettiin. What shall we do with '
            + 'the drunken sailor on niin sanottu stamp-and-go -laulu, jota '
            + 'laulettiin marssien kannen poikki köysi kädessä. Höyrykoneen '
            + 'myötä työlaulut kävivät tarpeettomiksi, mutta laulut jäivät.',
          selite: 'Cutty Sarkin takila Greenwichissä. Jokainen köysi vaati '
            + 'vetäjänsä, ja veto tehtiin laulun tahtiin.',
          lahde: 'Ermell, Wikimedia Commons (CC BY-SA 4.0)',
          musiikkiNayte: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/2/29/%22Drunken_Sailor%22%2C_performed_by_the_Midshipmen_Glee_Club_%281977%29.ogg/%22Drunken_Sailor%22%2C_performed_by_the_Midshipmen_Glee_Club_%281977%29.ogg.mp3',
          musiikkiNayteNimi: 'Drunken Sailor — USNA Midshipmen Glee Club (PD)',
        },
        {
          otsikko: 'Proms — konsertti, jossa seistään',
          tiedosto: 'Royal Albert Hall, BBC Proms 2017.jpg',
          teksti: 'Proms on kahdeksan viikon konserttisarja, joka on soinut joka '
            + 'kesä vuodesta 1895. Royal Albert Halliin mahtuu 5 272 istujaa, '
            + 'mutta halvimmat liput ovat lattialle: prommaajat seisovat '
            + 'orkesterin edessä koko illan. Jokainen konsertti lähetetään '
            + 'radiossa, joten sen kuulee ilmaiseksi missä tahansa.',
          selite: 'Royal Albert Hall Proms-konsertin aikana. Alhaalla areenalla '
            + 'ei ole tuoleja lainkaan — siellä seisova yleisö on kuulunut '
            + 'Promsiin alusta asti.',
          lahde: 'Ed g2s, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'BBC Proms',
          musiikki: 'https://music.apple.com/fi/search?term=bbc%20proms',
          musiikkiNimi: 'Proms-konsertteja Apple Musicissa',
          musiikkiNayte: 'https://upload.wikimedia.org/wikipedia/commons/2/28/ELGAR_Pomp_and_Circumstance_in_D%2C_Opus_39%2C_No._1_-_United_States_Marine_Band.mp3',
          musiikkiNayteNimi: 'Elgar: Pomp and Circumstance nro 1 — United States Marine Band, PD',
        },
        {
          otsikko: 'Öljytynnyri, joka soittaa melodian',
          tiedosto: 'Ebony Steel Band raising funds for NSPCC Oxford Street, London.jpg',
          teksti: 'Steel pan taotaan kahdensadan litran peltitynnyristä: pohja '
            + 'lyödään kupiksi ja siihen taotaan soikeita kenttiä, joista '
            + 'jokainen soi omaa säveltään. Mitä isompi soikio, sitä '
            + 'matalampi ääni, ja korkeimpaan tenoripanniin mahtuu noin '
            + 'kolmekymmentä säveltä. Soitin syntyi Trinidadissa, ja '
            + 'Lontoossa se nähtiin ensi kerran vuoden 1951 Festival of '
            + 'Britainissa. Notting Hillin karnevaalia edeltävässä '
            + 'Panorama-kisassa soittaa nykyään noin tuhat ihmistä, kaikki '
            + 'ulkomuistista.',
          selite: 'Lontoolainen Ebony Steel Band soittaa Oxford Streetin varrella '
            + 'House of Fraserin edustalla joulukuussa 2021 ja kerää samalla '
            + 'rahaa lastensuojelujärjestö NSPCC:lle. Etualalla seisova '
            + 'kerääjä pitelee vihreää keräyslipasta. Bassopanneista näkee '
            + 'yhä tynnyrin: kiiltävät pellit seisovat pyörillä, ja kylkeen '
            + 'on maalattu bändin nimi.',
          lahde: 'Philafrenzy, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Steel pan',
        },
        {
          otsikko: 'Metron soittopaikat jaetaan koesoitolla',
          tiedosto: 'Busker at Piccadilly Circus tube station in March 2012.JPG',
          teksti: 'Lontoon metrossa katusoitto on luvanvaraista. Transport for '
            + 'London ylläpitää 39 soittopaikkaa 25 keskusta-asemalla, ja '
            + 'luvan saa vain läpäisemällä raadin edessä pidettävän '
            + 'koesoiton. Paikat on maalattu asemien lattioihin puolikaarina: '
            + 'kaaren sisällä saa soittaa, sen ulkopuolella ei. Maan päällä '
            + 'säännöt vaihtelevat kaupunginosittain. Cityn alueella '
            + 'katusoitto on kielletty, ja Leicester Squaren esiintymispaikat '
            + 'suljettiin huhtikuussa 2025, kun tuomioistuin oli määrännyt '
            + 'melun loppumaan.',
          selite: 'Kitaristi soittaa Piccadilly Circusin metroasemalla '
            + 'maaliskuussa 2012. Hän istuu retkijakkaralla lattiaan maalatun '
            + 'soittopaikan laidalla, kaaren reunassa lukee Mayor of London '
            + 'ja Transport for London, ja kolikot kilahtavat auki jätettyyn '
            + 'kitarapussiin. Vieressä olevalla kärryllä on kannettava '
            + 'tietokone ja kaksi nukkea.',
          lahde: 'Editor5807, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Katusoittaja',
        },
      ],
    },
    {
      id: 'ruoka',
      nimi: 'Ruoka',
      tehtava: {
        kysymys: 'Miksi voileipä sai nimensä?',
        vaihtoehdot: ['Jaarli halusi syödä pelipöydässä', 'Se keksittiin Sandwichin kaupungissa', 'Leipä leikattiin hiekkarannalla'],
        oikea: 0,
        fakta: 'Sandwichin jaarli halusi syödä korttipöydästä nousematta — '
          + 'vastaus löytyi voileipänostosta.',
      },
      nostot: [
        {
          otsikko: 'Kalaa ja ranskalaisia sanomalehdestä',
          tiedosto: 'Modern fish and chips (8368723726).jpg',
          teksti: 'Fish and chips syntyi kahdesta erillisestä ideasta, jotka '
            + 'löysivät toisensa 1860-luvun Lontoossa: juutalaiset '
            + 'maahanmuuttajat olivat tuoneet tavan uppopaistaa kalaa '
            + 'taikinassa, ja pohjoisen tehdaskaupungeissa paistettiin '
            + 'perunaa. Yhdessä niistä tuli työväen ruokaa, jota myytiin '
            + 'kadulla käärittynä vanhaan sanomalehteen — halpaa, kuumaa ja '
            + 'täyttävää. Toisessa maailmansodassa fish and chips oli yksi '
            + 'harvoista ruoista, joita ei säännöstelty: hallitus katsoi sen '
            + 'pitävän mielialaa yllä.',
          selite: 'Uppopaistettu turska taikinakuoressa, paksut chipsit ja '
            + 'sitruuna — annos sanomalehden päällä kuten ennenkin.',
          lahde: 'LearningLark, Wikimedia Commons (CC BY 2.0)',
          wiki: 'Fish and chips',
        },
        {
          otsikko: 'Jaarli ei halunnut nousta pelipöydästä',
          tiedosto: 'John Montagu, 4th Earl of Sandwich by Johann Zoffany.jpg',
          teksti: 'John Montagu, Sandwichin neljäs jaarli, oli innokas '
            + 'korttipelaaja ja kova työntekijä. Kertomuksen mukaan hän pyysi '
            + 'vuonna 1762 palvelijaa tuomaan lihaa kahden leipäviipaleen '
            + 'välissä, jotta hän voisi syödä nousematta pöydästä eivätkä '
            + 'sormet rasvaantuisi kortteihin. Muut alkoivat tilata samaa — '
            + 'sitä mitä Sandwich syö. Nimi jäi. Jaarli oli myös laivaston '
            + 'johtaja, ja kapteeni Cook nimesi hänen mukaansa Havaijin '
            + 'saaret, jotka tunnettiin pitkään Sandwichsaarina.',
          selite: 'Johann Zoffanyn muotokuva jaarlista. Sama mies antoi nimen '
            + 'sekä voileivälle että Havaijin saarille.',
          lahde: 'Johann Zoffany, Wikimedia Commons (PD)',
          wiki: 'Voileipä',
        },
        {
          otsikko: 'Vanukas ennen lihaa',
          tiedosto: 'Victoria Inn, Peckham, London (4872592446).jpg',
          teksti: 'Sunnuntaipaisti on viikon tärkein ateria, ja siihen kuuluu '
            + 'yorkshirenvanukas: ohut taikina kaadetaan tulikuumaan '
            + 'paistinrasvaan, ja uunissa se kohoaa ontoksi kupoliksi. Ennen '
            + 'se ei ollut lisuke vaan alkuruoka. Vanukas syötiin ensin '
            + 'paksun kastikkeen kanssa, jotta pöytäseurue tulisi halvasta '
            + 'jauhoruoasta kylläiseksi eikä söisi niin paljon kallista '
            + 'lihaa. Kuninkaallinen kemian seura julisti vuonna 2008, ettei '
            + 'alle neljän tuuman eli noin kymmenen sentin korkuinen kohokas '
            + 'enää ansaitse vanukkaan nimeä.',
          selite: 'Sunnuntaipaisti lontoolaisen pubin pöydässä Peckhamissa. '
            + 'Paahtopaistin päällä lepää iso ruskistunut yorkshirenvanukas, '
            + 'ja lautasella on uuniperunoita, kukkakaalia, vihreitä papuja '
            + 'ja porkkanaa; vieressä höyryää kastikekannu.',
          lahde: 'Ewan Munro, Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Paahtopaisti',
        },
        {
          otsikko: 'Hieno tee on matala tee',
          tiedosto: 'Afternoon Tea at The Ritz.jpg',
          teksti: 'Iltapäivätee sai alkunsa nälästä. Yläluokan päivällistä '
            + 'syötiin 1800-luvulla vasta puoli kahdeksan jälkeen, ja '
            + 'Bedfordin herttuatar Anna Russell alkoi noin vuonna 1840 '
            + 'pyytää väliaikaan teetä ja pikkupurtavaa. Tapa levisi '
            + 'seurapiireihin, ja sitä sanotaan myös matalaksi teeksi, koska '
            + 'se juotiin salongin matalien sivupöytien ääressä. Korkea tee '
            + 'eli high tea ei siis ole hienompi vaan päinvastoin: se on '
            + 'työväen kunnon iltaruoka, joka syötiin viiden ja seitsemän '
            + 'välillä korkean ruokapöydän ääressä.',
          selite: 'Iltapäivätee kolmikerroksisessa telineessä Ritzillä Lontoossa: '
            + 'alimpana pikkuvoileipiä, keskellä rusinaisia skonsseja ja '
            + 'päällimmäisenä pikkuleivoksia. Etualalla on kullareunainen '
            + 'teekuppi.',
          lahde: 'RT6HPU, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Kello viiden tee',
        },
        {
          otsikko: 'Yliopisto pennyn hinnalla',
          tiedosto: 'Interior of a London Coffee-house, 17th centuryFXD.jpg',
          teksti: 'Lontoon ensimmäisen kahvihuoneen avasi vuonna 1652 Pasqua '
            + 'Rosée, joka oli tullut kaupunkiin kauppiaan palvelijana '
            + 'Smyrnasta. Pennyllä pääsi sisään ja sai kupillisen kahvia, '
            + 'päivän lehdet ja oikeuden osallistua keskusteluun — säätyyn '
            + 'katsomatta. Siksi kahvihuoneita sanottiin pennyn '
            + 'yliopistoiksi. Vuoteen 1708 mennessä niitä oli Cityssä ja '
            + 'Westminsterissä 500–600. Edward Lloyd avasi omansa 1686, ja '
            + 'siellä vaihdetuista laivauutisista kasvoi vakuutustalo '
            + 'Lloyd\'s.',
          selite: 'Lontoolaisen kahvihuoneen sisus 1600-luvun lopulta. '
            + 'Peruukkipäiset miehet istuvat pitkien pöytien ääressä, lukevat '
            + 'lehtiä ja juovat kahvia matalista kupeista; takan yllä riippuu '
            + 'pannu ja vasemmalla emäntä istuu korotetussa kopissaan.',
          lahde: 'Tuntematon taiteilija, Wikimedia Commons (PD)',
          wiki: 'Lloyd’s of London',
        },
        {
          otsikko: 'Tori, jonka parlamentti lakkautti',
          tiedosto: 'Borough Market - geograph.org.uk - 5246520.jpg',
          teksti: 'Southwarkin puolella on myyty ruokaa ainakin 1200-luvulta '
            + 'asti. Vuonna 1754 parlamentti lakkautti torin kokonaan, koska '
            + 'se tukki kadut — mutta seurakuntalaiset saivat luvan aloittaa '
            + 'alusta, ja kahden vuoden päästä kojut nousivat viereiselle '
            + 'tontille. Sinne ne jäivät. Kun rautatie 1860-luvulla halusi '
            + 'kulkea yli, torin isännät eivät lain mukaan saaneet myydä '
            + 'maataan, joten radalle annettiin vain vuokraoikeus sillan '
            + 'verran ja kauppa jatkui sen alla. Nyt junat jyrisevät ostajien '
            + 'pään päällä. Maanantaisin tori on kiinni.',
          selite: 'Väkeä Borough Marketin kojujen välissä. Pään päällä kaartuu '
            + 'rautatiesillan niitattu teräspalkisto, ja taustalla näkyy '
            + 'torin kyltti ja kahvikoju.',
          lahde: 'Chris Holifield, Wikimedia Commons (CC BY-SA 2.0)',
        },
        {
          otsikko: 'Piirakka, muusi ja vihreä liquor',
          tiedosto: 'Pie mash and liquor Manze Bermondsey.jpg',
          teksti: 'Pie and mash on Lontoon satamakortteleiden ruokaa: '
            + 'jauhelihapiirakka, perunamuusia ja päälle liquor eli vihreä '
            + 'persiljakastike — nimestä huolimatta siinä ei ole tippaakaan '
            + 'väkijuomaa. Ennen piirakat tehtiin ankeriaasta, sillä Thames '
            + 'oli niitä täynnä ja ne olivat halvinta lihaa mitä sai.',
          selite: 'Annos lontoolaisessa piirakkapuodissa marmoripöydällä. Liquor '
            + 'keitettiin alun perin ankeriaan keitinliemestä, ja väri tulee '
            + 'persiljasta.',
          lahde: 'Secretlondon, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Brittiläinen keittiö',
        },
        {
          otsikko: 'Seiso oikealla, kävele vasemmalla',
          tiedosto: '2016-02 Escalators Underground London 02.jpg',
          teksti: 'Metron liukuportaissa on yksi rautainen sääntö: seisojat '
            + 'oikealle, kiirehtijät vasemmalle. Tapa syntyi vahingossa. '
            + 'Ensimmäiset liukuportaat avattiin Earl\'s Courtin asemalla '
            + 'vuonna 1911, ja niiden yläpäässä vino väliseinä ohjasi '
            + 'matkustajat ulos vasemmalta puolelta, joten seisojan kannatti '
            + 'pysyä oikealla. Vuonna 2015 Holbornissa kokeiltiin, että '
            + 'kaikki seisoisivat molemmin puolin. Portaisiin mahtui lähes '
            + 'kolmanneksen enemmän väkeä, mutta heti kun valvojat lähtivät, '
            + 'lontoolaiset palasivat entiseen.',
          selite: 'Ruuhkaiset liukuportaat Camden Townin metroasemalla. Sinisissä '
            + 'kylteissä lukee Stand on the right, ja nousevissa portaissa '
            + 'matkustajat ovat pakkautuneet oikeaan reunaan jättäen vasemman '
            + 'puolen vapaaksi ohittajille.',
          lahde: '0x010C, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Lontoon metro',
        },
      ],
    },
    {
      id: 'tiede',
      nimi: 'Tiede',
      johdanto: 'Mies joka keksi painovoiman lait rutonaikaisella maatilalla, '
        + 'kirjansitojan oppipoika josta tuli sähkön isä, ja koodinmurtaja '
        + 'jonka kone päätti sodan.',
      nostot: [
        {
          otsikko: 'Rutto sulki yliopiston ja avasi maailman',
          tiedosto: 'Sir Isaac Newton by Sir Godfrey Kneller, Bt.jpg',
          teksti: 'Kun rutto sulki Cambridgen yliopiston 1665, 23-vuotias Isaac '
            + 'Newton palasi kotitilalleen Woolsthorpeen. Siellä vietetyn '
            + 'puolentoista vuoden aikana hän kehitti '
            + 'differentiaalilaskennan, selvitti valon jakautumisen väreiksi '
            + 'prisman avulla ja muotoili painovoiman lain. Hän itse kertoi '
            + 'myöhemmin, että ajatus lähti puutarhan omenapuusta: miksi '
            + 'omena putoaa aina suoraan alas? Newton oli myös rahapajan '
            + 'johtaja ja jahtasi väärentäjiä katujen kapakoissa — hän '
            + 'lähetti heistä useita hirsipuuhun.',
          selite: 'Godfrey Knellerin muotokuva vuodelta 1702, jolloin Newton oli '
            + 'jo kuuluisa ja rahapajan johtaja.',
          lahde: 'Godfrey Kneller, Wikimedia Commons (PD)',
          wiki: 'Isaac Newton',
        },
        {
          otsikko: 'Kirjansitojasta sähkön löytäjä',
          tiedosto: 'Faraday\'s Magnetic Laboratory.jpg',
          teksti: 'Michael Faraday kävi koulua vain muutaman vuoden ja pääsi '
            + 'neljätoistavuotiaana kirjansitojan oppipojaksi — siellä hän '
            + 'luki seitsemän vuoden ajan kaikki kirjat, jotka sai käsiinsä. '
            + 'Royal Institutionin kellarilaboratoriossa hän kiersi vuonna '
            + '1831 kaksi eristettyä käämiä saman rautarenkaan ympäri ja '
            + 'huomasi, että virran kytkeminen toiseen sai virran hetkeksi '
            + 'liikkeelle myös toisessa. Saman talon luentosalissa hän piti '
            + 'nuorille yhdeksäntoista joululuentosarjaa, ja sarja on '
            + 'järjestetty vuodesta 1825 lähtien joka vuosi, neljää '
            + 'maailmansodan vuotta lukuun ottamatta.',
          selite: 'Faradayn magneettinen laboratorio Royal Institutionin '
            + 'kellarissa, nykyään lasin takana. Huone purettiin ja koottiin '
            + 'uudelleen 1930-luvulla Harriet Mooren 1850-luvun akvarellien '
            + 'mukaan; hyllyillä on pulloja, lasikupuja ja koelaitteita.',
          lahde: 'AndyScott, Commons (CC BY-SA 4.0)',
          wiki: 'Michael Faraday',
        },
        {
          otsikko: 'Kartta, joka paljasti pumpun',
          tiedosto: 'Snow-cholera-map-1.jpg',
          teksti: 'Elokuun lopulla 1854 Sohossa puhkesi koleraepidemia, joka '
            + 'tappoi 616 ihmistä. Lääkäri John Snow ei uskonut taudin '
            + 'leviävän pahasta hajusta, vaan kiersi ovelta ovelle ja '
            + 'merkitsi jokaisen kuolleen mustana palkkina sen talon '
            + 'kohdalle, jossa tämä oli asunut. Palkit kasautuivat yhden '
            + 'ainoan vesipumpun ympärille Broad Streetillä; pumpun kahva '
            + 'irrotettiin 8. syyskuuta, ja myöhemmin selvisi, että kaivon '
            + 'reunasta oli vajaa metri vuotavaan likakaivoon.',
          selite: 'Snow\'n kartta vuodelta 1854, hänen kirjansa Map 1. Jokainen '
            + 'musta palkki on yksi koleraan kuollut, ja sana PUMP merkitsee '
            + 'kadun vesipumput; tihein rykelmä kasvaa keskellä karttaa Broad '
            + 'Streetin pumpun ympärille.',
          lahde: 'John Snow, Commons (PD)',
          wiki: 'John Snow',
        },
        {
          otsikko: 'Viisi vuotta laivalla, kaksikymmentä vuotta epäröintiä',
          tiedosto: 'Charles Robert Darwin by John Collier.jpg',
          teksti: 'Charles Darwin lähti 22-vuotiaana Beagle-laivalle '
            + 'luonnontutkijaksi ja oli merellä lähes viisi vuotta — '
            + 'merisairaana lähes koko ajan. Galápagossaarilla hän keräsi '
            + 'peippoja huomaamatta niiden merkitystä; vasta Lontoossa '
            + 'lintuasiantuntija kertoi, että eri saarten linnut olivat eri '
            + 'lajeja, joiden nokat sopivat kunkin saaren ravintoon. Darwin '
            + 'ymmärsi, mitä se tarkoitti, mutta pelkäsi julkaista. Lajien '
            + 'synty ilmestyi vasta 1859, kun toinen tutkija oli päätymässä '
            + 'samaan ajatukseen.',
          selite: 'John Collierin muotokuva. Darwin kirjoitti kotonaan Kentissä '
            + 'ja käveli päivittäin saman polun ajatellakseen.',
          lahde: 'John Collier, Wikimedia Commons (PD)',
          wiki: 'Charles Darwin',
        },
        {
          otsikko: 'Punainen pallo putoaa kello yksi',
          tiedosto: 'Greenwich time ball 2014.jpg',
          teksti: 'Greenwichin observatorion katolla seisoo mastossa punainen '
            + 'pallo, joka nousee puoliväliin kello 12.55, huipulle 12.58 ja '
            + 'putoaa tasan kello 13; näin on tehty vuodesta 1833. Thamesilla '
            + 'ja Lontoon satama-altaissa olleet laivat tähystivät palloa '
            + 'kaukoputkella ja säätivät sen mukaan merikellonsa, ja aika '
            + 'luetaan siitä hetkestä, jolloin pallo lähtee liikkeelle, ei '
            + 'siitä kun se pysähtyy. Merkki annetaan yhdeltä eikä '
            + 'keskipäivällä siksi, että tähtitieteilijät olivat puolenpäivän '
            + 'aikaan itse kiinni auringon mittauksissa.',
          selite: 'Greenwichin observatorion Flamsteed Housen katto: punainen '
            + 'aikapallo mastonsa juuressa, mastonhuipussa tuuliviiri ja alla '
            + 'talon valkoinen pylväskaide.',
          lahde: 'Stanislav Kozlovskiy, Commons (CC BY-SA 4.0)',
          wiki: 'Greenwichin kuninkaallinen observatorio',
        },
        {
          otsikko: 'Kone, joka odotti 142 vuotta',
          tiedosto: 'London Science Museum by Marcin Wichary - Difference Engine No. 2, pt. 1 (2290036668).jpg',
          teksti: 'Charles Babbage piirsi vuosina 1846–1849 laskukoneen, joka '
            + 'pyörii kammesta ja laskee 31-numeroisilla luvuilla, mutta sitä '
            + 'ei rakennettu hänen elinaikanaan. Lontoon Science Museum '
            + 'halusi tietää, olisiko se toiminut, ja teki koneen Babbagen '
            + 'omien piirustusten mukaan tarkkuudella, joka oli mahdollinen '
            + '1800-luvulla: laskuosa valmistui vuonna 1991 keksijän syntymän '
            + 'kaksisatavuotispäiväksi ja laski oikein. Babbagen '
            + 'suunnittelema tulostin saatiin valmiiksi vasta 2002, ja koko '
            + 'laitteessa on noin 8 000 osaa ja painoa viisi tonnia — sähköä '
            + 'se ei tarvitse lainkaan.',
          selite: 'Difference Engine No. 2 lasikaapissaan Lontoon Science '
            + 'Museumissa. Pystyrivit ovat numeropyöriä, oikeassa reunassa '
            + 'näkyy iso kampi ja vasemmalla tulostuslaite paperirullineen; '
            + 'kaapin pohjalla lepää esittelytaulu.',
          lahde: 'Marcin Wichary, Commons (CC BY 2.0)',
          wiki: 'Charles Babbage',
        },
        {
          otsikko: 'Kone, joka luki vihollisen postit',
          tiedosto: 'Alan Turing by Stephen Kettle 2007.jpg',
          teksti: 'Saksan Enigma-koodikone vaihtoi asetuksensa joka keskiyö, '
            + 'joten murtajilla oli aikaa yksi vuorokausi. Alan Turing '
            + 'suunnitteli Bletchley Parkissa koneen nimeltä Bombe, joka '
            + 'kokeili asetuksia mekaanisesti tuhansia kertoja nopeammin kuin '
            + 'ihminen. Ratkaiseva oivallus oli, että saksalaiset sähkeet '
            + 'sisälsivät arvattavia sanoja: säätiedotus alkoi lähes aina '
            + 'sanalla WETTER. Työn arvioidaan lyhentäneen sotaa vuosilla. '
            + 'Turing oli myös kuvannut jo 1936 ajatuksen yleiskäyttöisestä '
            + 'laskukoneesta — tietokoneen esi-isästä.',
          selite: 'Stephen Kettlen veistos Bletchley Parkissa. Se on tehty '
            + 'puolesta miljoonasta ohuesta liuskekivipalasta.',
          lahde: 'DeFacto, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Alan Turing',
        },
        {
          otsikko: 'Sinivalas maksoi 250 puntaa',
          tiedosto: 'Hope, Hintze Hall, Natural History Museum, London - 1.jpg',
          teksti: 'Maaliskuussa 1891 valaanpyytäjien haavoittama nuori '
            + 'naarassinivalas ajautui hiekkasärkälle Wexfordin edustalle '
            + 'Irlannissa, ja Lontoon luonnontieteellinen museo osti sen '
            + 'luurangon 250 punnalla. Luut makasivat varastossa yli '
            + 'neljäkymmentä vuotta, ja vasta vuonna 1934 valmistunut '
            + 'valassali antoi niille tilaa. Vuonna 2017 luuranko — 25,2 '
            + 'metriä pitkä, 221 luuta, 4,5 tonnia — nostettiin pääsalin '
            + 'kattoon syöksysukelluksen asentoon suu auki: se on maailman '
            + 'ainoa näin ripustettu sinivalaan luuranko.',
          selite: 'Hope-niminen sinivalaan luuranko Hintze Hallissa, kuvattuna '
            + 'salin parvelta. Luuranko roikkuu katosta syöksyen alaspäin suu '
            + 'auki, ja alaleuka kaartuu pitkälle kävijöiden pään '
            + 'yläpuolelle.',
          lahde: 'APK, Commons (CC BY 4.0)',
          wiki: 'Natural History Museum',
        },
      ],
    },
    {
      id: 'huumori',
      nimi: 'Huumori',
      nostot: [
        {
          otsikko: 'Nukke, jolla on syntymäpäivä',
          tiedosto: 'Near this spot Punch\'s Puppet Show was first performed in England and witnessed by Samuel Pepys 1662.jpg',
          teksti: 'Samuel Pepys kirjoitti päiväkirjaansa 9. toukokuuta 1662 '
            + 'nähneensä Covent Gardenissa italialaisen nukketeatterin, joka '
            + 'oli hänen mielestään hyvin sievä. Nukettaja oli italialainen '
            + 'Pietro Gimonde, ja esityksen tähti oli Pulcinella, josta '
            + 'englannissa tuli Mr Punch. Tuota päivää pidetään yhä Punchin '
            + 'virallisena syntymäpäivänä. Punchin kimeä kirkuna syntyy '
            + 'swazzlesta, kahdesta metalliliuskasta ja niiden välisestä '
            + 'nauhasta, jota nukettaja pitää suussaan koko näytöksen ajan. '
            + 'Punchista on jäänyt englantiin sanontakin: pleased as Punch '
            + 'tarkoittaa hyvin tyytyväistä.',
          selite: 'Muistolaatta St Paulin kirkon seinässä Covent Gardenissa. '
            + 'Kiveen on hakattu, että lähellä tätä paikkaa Punchin '
            + 'nukketeatteri esitettiin ensi kerran Englannissa ja Samuel '
            + 'Pepys näki sen vuonna 1662. Alin rivi kertoo laatan vuosiluvun '
            + '1962, tasan kolmesataa vuotta myöhemmin.',
          lahde: 'Spudgun67, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Samuel Pepys',
        },
        {
          otsikko: 'Sana cartoon syntyi vitsistä',
          tiedosto: 'SubstanceandShadow.jpg',
          teksti: 'Vuonna 1834 palanutta parlamenttitaloa rakennettiin uudelleen, '
            + 'ja Westminster Hallissa oli kesällä 1843 esillä jättimäisiä '
            + 'luonnoksia tulevia seinämaalauksia varten. Italiaksi tällaista '
            + 'luonnosta sanotaan nimellä cartone, englanniksi cartoon. '
            + 'Pilalehti Punch julkaisi 15. heinäkuuta 1843 oman versionsa '
            + 'otsikolla Cartoon, No. 1: 25-vuotias John Leech päästi '
            + 'ryysyiset katulapset hienoon taulugalleriaan, jossa rikkaiden '
            + 'muotokuvat riippuivat nälkäisten silmien edessä. Pilkka jäi '
            + 'elämään niin sitkeästi, että cartoon tarkoittaa englannissa '
            + 'yhä pilapiirrosta.',
          selite: 'Punchin ensimmäinen cartoon heinäkuulta 1843. Yläreunassa '
            + 'lukee CARTOON, No. 1 ja alareunassa SUBSTANCE AND SHADOW. '
            + 'Ryysyinen väki katselee kullattuihin kehyksiin ripustettuja '
            + 'ylhäisön muotokuvia: mukana on kepin varassa kulkeva mies, '
            + 'lapsia rievuissa ja pyörällisellä laudalla istuva raajarikko.',
          lahde: 'John Leech, Wikimedia Commons (PD)',
          wiki: 'Pilapiirros',
        },
        {
          otsikko: 'Kellot ratkaisevat, kuka on cockney',
          tiedosto: 'View of St. Mary-le-Bow church from Cheapside - geograph.org.uk - 7160633.jpg',
          teksti: 'Vanhan säännön mukaan aito cockney on syntynyt St '
            + 'Mary-le-Bow\'n kirkonkellojen kuuluvuusalueella. Vuoden 2012 '
            + 'ääniselvityksessä todettiin, että 1850-luvulla kellot '
            + 'kuuluivat idässä Hackney Marshesille ja Stratfordiin saakka, '
            + 'mutta nykyään liikenteen melu kutistaa alueen Cityn itäosiin '
            + 'ja Shoreditchiin. Kirkonkellojen soitto kiellettiin koko '
            + 'maassa 13. kesäkuuta 1940, ja Blitzin viimeisenä yönä 10.–11. '
            + 'toukokuuta 1941 kellot tuhoutuivat. Uudet kellot soivat vasta '
            + '21. joulukuuta 1961. Näiden kellojen alla kehittyi myös '
            + 'riimislangi, jossa portaat ovat apples and pears.',
          selite: 'St Mary-le-Bow\'n torni kohoaa Cheapside-kadun päässä Lontoon '
            + 'Cityssä. Christopher Wren suunnitteli kirkon vuoden 1666 '
            + 'suurpalon jälkeen, ja juuri tämän tornin kelloja tarkoitetaan, '
            + 'kun puhutaan cockneyn rajoista.',
          lahde: 'Robert Lamb, Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Cockney',
        },
        {
          otsikko: 'Kadunlakaisijan nappipuku',
          tiedosto: 'Pearly Kings and Queens Harvest Festival 2024 (28).jpg',
          teksti: 'Henry Croft syntyi 24. toukokuuta 1861 St Pancrasin '
            + 'vaivaistalossa ja ryhtyi kadunlakaisijaksi noin vuonna 1876, '
            + 'viisitoistavuotiaana. Kerätäkseen rahaa sairaaloille ja '
            + 'orpokodeille hän ompeli vaatteisiinsa tuhansia '
            + 'helmiäisnappeja, joita valmistettiin East Endin tehtaissa, ja '
            + 'puvusta tuli niin kirkas, ettei kerääjää voinut olla '
            + 'huomaamatta. Tapa levisi: vuoteen 1911 mennessä Lontoon '
            + 'kaikilla 28 kaupunginosalla oli oma pearly king ja pearly '
            + 'queen. Croft kuoli tammikuussa 1930, ja hänen '
            + 'hautajaissaattueensa oli noin puoli mailia pitkä; siinä käveli '
            + '400 nappipukuista.',
          selite: 'Pearly kings ja queens riviin asettuneina Guildhallin '
            + 'edustalla sadonkorjuujuhlassa 2024. Napeista on muotoiltu '
            + 'hevosenkenkiä, sydämiä, ankkureita ja korttikuvioita, ja '
            + 'takkien selkämyksiin on kirjailtu tittelit: Pearly King of '
            + 'Mile End, Pearly King of Highgate ja Pearly Queen of Royal '
            + 'Greenwich.',
          lahde: 'Doyle of London, Wikimedia Commons (CC BY-SA 4.0)',
        },
        {
          otsikko: 'Chaplin oli lontoolainen köyhä poika',
          tiedosto: 'Charlie Chaplin statue, Leicester Square.jpg',
          teksti: 'Charlie Chaplin syntyi 16. huhtikuuta 1889 Walworthissa '
            + 'Etelä-Lontoossa, ja seitsemänvuotiaana hänet vietiin Lambethin '
            + 'vaivaistaloon. Molemmat vanhemmat olivat music hall '
            + '-esiintyjiä, ja poika itse kiersi yhdeksänvuotiaana '
            + 'englantilaisia varieteesaleja Eight Lancashire Lads '
            + '-puukenkätanssiryhmässä. Kulkurin asun hän kokosi Keystonen '
            + 'studiolla Los Angelesissa 1914 yhden periaatteen mukaan, jonka '
            + 'hän myöhemmin kirjoitti muistiin: kaiken piti olla '
            + 'ristiriitaista, housut pussittavat, takki tiukka, hattu pieni '
            + 'ja kengät suuret.',
          selite: 'John Doubledayn pronssiveistos Chaplinista Kulkurin roolissa '
            + 'Leicester Squarella. Patsas paljastettiin 16. huhtikuuta 1981, '
            + 'päivälleen 92 vuotta Chaplinin syntymän jälkeen. Keppi, '
            + 'knalli, ahdas takki ja liian suuret kengät ovat kaikki '
            + 'paikallaan.',
          lahde: 'Matt Brown, Wikimedia Commons (CC BY 2.0)',
          wiki: 'Charles Chaplin',
        },
        {
          otsikko: 'Viimeinen suuri music hall',
          tiedosto: 'Wilton\'s Music Hall - Interior.jpg',
          teksti: 'John Wilton rakensi 1859 ostamansa Mahogany Bar -pubin taakse '
            + 'Tower Hamletsiin salin, johon mahtui 1 500 työläistä istumaan '
            + 'pöytien ääreen kuuntelemaan laulajia ja koomikoita. Katosta '
            + 'riippui sun-burner, jossa paloi 300 kaasuliekkiä ja välkkyi 27 '
            + '000 hiottua kristallia; sen kuumuuden jättämä palojälki näkyy '
            + 'kattoparruissa yhä. Sali ehti olla metodistien lähetysasema ja '
            + 'lumppuvarasto ennen kuin se määrättiin purettavaksi, mutta '
            + 'koomikot Peter Sellers ja Spike Milligan olivat mukana '
            + 'pelastamassa sitä, ja talo suojeltiin huhtikuussa 1971.',
          selite: 'Wilton\'s Music Hallin sali East Endissä. Parveke kiertää '
            + 'kolmelta sivulta kierteisten valurautapylväiden varassa, ja '
            + 'seinien rapattu pinta on jätetty kulumaan näkyviin. Lattialle '
            + 'katetaan pitkiä juhlapöytiä samaan tapaan kuin siihen aikaan, '
            + 'kun salissa myös syötiin.',
          lahde: 'Kbthompson at English Wikipedia, Wikimedia Commons (CC BY 3.0)',
          wiki: 'Music hall',
        },
      ],
    },
    {
      id: 'urheilu',
      nimi: 'Urheilu',
      johdanto: 'Britanniassa kirjoitettiin säännöt peleille, joita nyt pelataan '
        + 'kaikkialla: jalkapallo, tennis ja kriketti syntyivät samoilla '
        + 'saarilla.',
      nostot: [
        {
          otsikko: 'Säännöt kirjoitettiin pubin takahuoneessa',
          tiedosto: 'Original laws of the game 1863.jpg',
          teksti: 'Lokakuussa 1863 kaksitoista seuraa kokoontui lontoolaiseen '
            + 'Freemasons\' Tavern -pubiin sopimaan yhteisistä säännöistä. '
            + 'Siihen asti joka koulu pelasi omillaan: joissakin sai kantaa '
            + 'palloa käsissä, toisissa ei, ja vastustajan potkiminen sääreen '
            + 'kuului joidenkin mielestä peliin. Kokouksissa käsien käyttö ja '
            + 'säären potkiminen äänestettiin pois — ne seurat, jotka '
            + 'halusivat pitää ne, lähtivät ja perustivat myöhemmin rugbyn. '
            + 'Käsisääntö erotti kaksi maailmanlaajuista peliä toisistaan '
            + 'yhdessä illassa.',
          selite: 'Alkuperäinen käsin kirjoitettu sääntökirja vuodelta 1863 ja '
            + 'aikakauden nahkapallo.',
          lahde: 'Adrian Roebuck, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Jalkapallo',
        },
        {
          otsikko: 'Turnaus keksittiin nurmikonjyrän maksamiseksi',
          tiedosto: 'Wimbledon Centre Court (May 15, 2019).jpg',
          teksti: 'Wimbledonin krokettiseura tarvitsi 1877 rahaa rikkoutuneen '
            + 'nurmijyrän korjaamiseen ja järjesti varainkeruuksi '
            + 'tennisturnauksen. Paikalle tuli 22 pelaajaa ja noin 200 '
            + 'katsojaa. Turnaus on yhä olemassa ja on maailman vanhin '
            + 'tennisturnaus. Perinteet ovat tiukkoja: pelaajien on '
            + 'pukeuduttava lähes kokonaan valkoiseen, ja katsojat syövät '
            + 'turnauksen aikana noin 30 tonnia mansikoita. Nurmi leikataan '
            + 'täsmälleen kahdeksan millimetrin mittaan — lyhyempi kuluisi '
            + 'puhki, pidempi hidastaisi palloa.',
          selite: 'Keskuskenttä ja sen liukukatto. Nurmi on raiheinää, ja se '
            + 'kylvetään joka syksy uudelleen.',
          lahde: 'GATORFAN2525, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Wimbledonin tennisturnaus',
        },
        {
          otsikko: 'Ottelu voi kestää viisi päivää',
          tiedosto: 'The Cricket Match (geograph 3985226).jpg',
          teksti: 'Kriketin arvokkain palkinto on pieni tuhkauurna. Kun Australia '
            + 'voitti Englannin ensi kertaa kotikentällä 1882, lehti julkaisi '
            + 'pilaillen kuolinilmoituksen englantilaisen kriketin kuolemasta '
            + 'ja kertoi ruumiin poltetun. Seuraavalla kiertueella '
            + 'englantilaiset saivat tuhkat sisältävän uurnan, ja siitä tuli '
            + 'The Ashes -sarjan palkinto. Kansainvälinen testiottelu kestää '
            + 'enintään viisi päivää eikä silti aina ratkea. Lounas- ja '
            + 'teetauko ovat sääntöihin kirjattuja: peli keskeytetään teelle.',
          selite: 'Kylän krikettiottelu kesäisellä nurmella. Valkoiset asut ovat '
            + 'perua ajalta, jolloin vaalea kangas piti pelaajan viileänä.',
          lahde: 'John Myers, Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Kriketti',
        },
        {
          otsikko: 'Neljän minuutin muuri murtui iltapäivällä',
          tiedosto: 'Iffley Road Track-blue plaque.jpg',
          teksti: 'Pitkään uskottiin, ettei ihminen voi juosta mailia alle neljän '
            + 'minuutin — jotkut lääkärit pitivät sitä ihmiskeholle '
            + 'mahdottomana. Lääketieteen opiskelija Roger Bannister '
            + 'harjoitteli lounastauoillaan ja yritti 6. toukokuuta 1954 '
            + 'Oxfordin Iffley Roadin radalla. Tuuli oli kova, ja hän päätti '
            + 'vasta viime hetkellä juosta. Aika oli 3.59,4. Kuuluttaja ehti '
            + 'sanoa vain "three" ennen kuin yleisön huuto peitti loput. Alle '
            + 'kaksi kuukautta myöhemmin toinen juoksija alitti saman rajan — '
            + 'muuri oli ollut päässä.',
          selite: 'Sininen muistolaatta Oxfordin Iffley Roadin radalla, jossa '
            + 'neljän minuutin raja alitettiin ensi kerran.',
          lahde: 'Owen Massey McKnight, Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Roger Bannister',
        },
      ],
    },
    {
      id: 'menovinkit',
      nimi: 'Menovinkit',
      johdanto: 'Britannian kokoelmat ovat verkossa niin täydellisinä, että matkan '
        + 'voi tehdä selaimella: zoomattavia maalauksia, miljoona esinettä, '
        + '300 vuoden oikeudenkäynnit, koko maa ilmasta ja suoria '
        + 'pesäkameroita.',
      lista: [
        {
          otsikko: 'Museot ja taide',
          kohteet: [
            {
              nimi: 'National Gallery — Auringonkukat zoomattavana',
              tiedosto: 'Giuseppe Gabrielli - The National Gallery, Interior of Room 32 - 1886.png',
              teksti: 'National Galleryn kokoelmassa on yli 2 400 maalausta, ja '
                + 'jokaisella on verkossa oma sivunsa.',
              selite: 'National Galleryn sali vuonna 1886: seinät täynnä '
                + 'maalauksia kolmessa rivissä, kävijät hatuissa ja pitkissä '
                + 'takeissa, kattoikkuna valaisee salin.',
              lahde: 'Giuseppe Gabrielli, Wikimedia Commons (public domain)',
              linkki: 'https://www.nationalgallery.org.uk/paintings/vincent-van-gogh-sunflowers',
            },
            {
              nimi: 'V&A — Explore the Collections',
              tiedosto: 'PXL 20231218 155438181.MP Victoria and Albert Museum Artefacts 46 Ruddock Family Cast Court.jpg',
              teksti: 'Victoria and Albert Museum on maailman suurin muotoilun ja '
                + 'käsityön museo, ja sen hakukoneessa on yli 1,25 miljoonaa '
                + 'esinettä.',
              selite: 'V&A:n Cast Court: Trajanuksen pylvään kipsijäljennös ja '
                + 'rivi hautapatsaiden kopioita punaisten seinien keskellä.',
              lahde: 'Sourabh.biswas003, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://collections.vam.ac.uk/search/?images_exist=true',
            },
            {
              nimi: 'Wellcome Collection — kokoelmat verkossa',
              tiedosto: 'The Wellcome Building, Euston Road, London 2009-10-18.jpg',
              teksti: 'Wellcome Collection kerää lääketieteen ja tieteen '
                + 'historiaa: verkkokatalogissa on 1,17 miljoonaa teosta ja '
                + '126 559 kuvaa.',
              selite: 'Wellcome Collectionin talo Euston Roadilla — 1930-luvun '
                + 'portlandinkivinen rakennus pylväineen, jonne on vapaa '
                + 'pääsy.',
              lahde: 'ell brown, Wikimedia Commons (CC BY 2.0)',
              linkki: 'https://wellcomecollection.org/collections',
            },
          ],
        },
        {
          otsikko: 'Arkistot ja kirjat',
          kohteet: [
            {
              nimi: 'Old Bailey Online — pöytäkirjat 1674–1913',
              tiedosto: 'Microcosm of London Plate 058 - Old Bailey (colour).jpg',
              teksti: 'Old Bailey Online sisältää Lontoon '
                + 'keskusrikostuomioistuimen painetut pöytäkirjat vuosilta '
                + '1674–1913: 197 754 oikeudenkäyntiä sanatarkasti.',
              selite: 'Old Baileyn sali vuonna 1809: peruukkipäiset asianajajat '
                + 'pöytien ääressä, täysi yleisölehteri ja syytetty '
                + 'aitauksessa.',
              lahde: 'Thomas Rowlandson ja Augustus Charles Pugin, Wikimedia Commons (public domain)',
              linkki: 'https://www.oldbaileyonline.org/',
            },
            {
              nimi: 'Bodleian First Folio — lue kirja sivu sivulta',
              tiedosto: 'Duke Humfrey\'s Library Interior 4, Bodleian Library, Oxford, UK - Diliff.jpg',
              teksti: 'Bodleianin kirjaston oma kappale Shakespearen '
                + 'ensimmäisestä foliosta on skannattu kokonaan, ja sitä voi '
                + 'lukea verkossa sivunkääntäjällä kuten oikeaa kirjaa.',
              selite: 'Duke Humfrey\'s Library, Bodleianin vanhin lukusali: hyllyt '
                + 'täynnä nahkaselkäisiä kirjoja ja maalattu kasettikatto.',
              lahde: 'Diliff, Wikimedia Commons (CC BY-SA 3.0)',
              linkki: 'https://firstfolio.bodleian.ox.ac.uk/book.html',
            },
            {
              nimi: 'Britain from Above — hae kartalta',
              tiedosto: 'Launceston from an Aeroplane - 23650 by Aerofilms. Aerial View. CORNWALL POSTCARD 1925 (50626799973).jpg',
              teksti: 'Aerofilms-yhtiö nousi lentokoneella ilmaan ja valokuvasi '
                + 'Britanniaa kaupunki kaupungilta, ja koko arkisto on nyt '
                + 'verkossa: 96 344 kuvaa, joista 82 521 Englannista, 6 398 '
                + 'Skotlannista ja 4 321 Walesista.',
              selite: 'Aerofilmsin postikorttikuva Launcestonista Cornwallissa '
                + '1925: kirkontorni keskellä, aidatut pellot kaupungin '
                + 'ympärillä.',
              lahde: 'Aerofilms Ltd, kuvan tallentanut Mark Crombie, Wikimedia Commons (public domain)',
              linkki: 'https://britainfromabove.org.uk/en/search',
            },
          ],
        },
        {
          otsikko: 'Luonto suorana',
          kohteet: [
            {
              nimi: 'The Wildlife Trusts — suorat luontokamerat',
              tiedosto: 'Puffin on Skomer Island.jpg',
              teksti: 'The Wildlife Trusts kokoaa yhdelle sivulle Britannian '
                + 'suorat luontokamerat, ja niitä on yli 25.',
              selite: 'Lunni levittää siipensä pesäkolon suulla Skomerin '
                + 'saarella; taustalla toinen lintu ruohikossa.',
              lahde: 'RewildingGirl5, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://www.wildlifetrusts.org/webcams',
            },
          ],
        },
      ],
    },
  ],
  EGY: [
    {
      id: 'historia',
      nimi: 'Historia',
      johdanto: 'Egyptin historia on niin pitkä, että pyramidit olivat '
        + 'muinaisia jo Kleopatralle — hänestä meihin on lyhyempi matka '
        + 'kuin hänestä pyramidien rakentajiin.',
      nostot: [
        {
          otsikko: 'Poikakuninkaan koskematon hauta',
          aika: '1922',
          tiedosto: 'Golden Mask of Tutankhamu00 (5).jpg',
          teksti: 'Tutankhamon nousi valtaistuimelle noin '
            + 'yhdeksänvuotiaana ja kuoli alle kaksikymppisenä — '
            + 'vähäpätöinen faarao, jonka nimen historia melkein unohti. '
            + 'Juuri siksi hänen hautansa säilyi: kun Howard Carter '
            + 'vuonna 1922 avasi reiän hautakammion oveen ja häneltä '
            + 'kysyttiin, näkyykö mitään, hän vastasi: "Näkyy — '
            + 'ihmeellisiä asioita." Hauta oli ainoa lähes koskemattomana '
            + 'löydetty faaraonhauta: yli 5 000 esinettä, ja niiden '
            + 'joukossa 11-kiloinen kultainen kasvonaamio.',
          selite: 'Tutankhamonin kultainen naamio Kairon Egyptiläisessä '
            + 'museossa — luultavasti maailman tunnetuin museoesine.',
          lahde: 'لا روسا, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Tutankhamon',
        },
        {
          otsikko: 'Kivi, joka avasi hieroglyfit',
          aika: '1822',
          tiedosto: 'Rosetta Stone.JPG',
          teksti: 'Hieroglyfejä osattiin ihailla 1400 vuotta ilman, että '
            + 'kukaan maailmassa osasi lukea niitä. Avain löytyi 1799 '
            + 'Rosettan kaupungista: kivipaasi, johon sama teksti oli '
            + 'hakattu kolmella kirjoituksella — hieroglyfein, arkisella '
            + 'egyptillä ja kreikaksi. Ranskalainen Jean-François '
            + 'Champollion vertasi kirjoituksia toisiinsa vuosikausia ja '
            + 'mursi koodin 1822. Sillä hetkellä kolme tuhatta vuotta '
            + 'mykkänä ollut sivilisaatio alkoi taas puhua: temppelien '
            + 'seinät muuttuivat luettaviksi kirjoiksi.',
          selite: 'Rosettan kivi British Museumissa. Sama teksti kolmella '
            + 'kirjoituksella teki mahdottomasta mahdollisen.',
          lahde: 'Hans Hillewaert, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Rosettan kivi',
        },
        {
          otsikko: 'Temppeli siirrettiin palasina',
          aika: '1960-luku',
          tiedosto: 'Abu Simbel, façade of the Great Temple (6201194723).jpg',
          teksti: 'Kun Assuanin suurpato rakennettiin 1960-luvulla, '
            + 'nouseva tekojärvi uhkasi hukuttaa Abu Simbelin '
            + 'kalliotemppelit, jotka Ramses II oli hakkauttanut vuoreen '
            + '3 200 vuotta aiemmin. Maailma päätti pelastaa ne: '
            + 'temppelit sahattiin yli tuhanneksi lohkoksi, joista '
            + 'painavimmat olivat 30 tonnia, ja koottiin uudelleen 65 '
            + 'metriä korkeammalle keinotekoisen kukkulan sisään. '
            + 'Urakasta syntyi ajatus maailmanperinnöstä — siitä, että '
            + 'jotkin paikat kuuluvat koko ihmiskunnalle.',
          selite: 'Abu Simbelin suurtemppelin julkisivu: neljä '
            + 'kaksikymmenmetristä Ramses II:n istuvaa patsasta — '
            + 'jokainen siirretty palasina nykyiselle paikalleen.',
          lahde: 'Arian Zwegers, Wikimedia Commons (CC BY 2.0)',
          wiki: 'Abu Simbel',
        },
        {
          otsikko: 'Kanava, jota maailma vahtii',
          aika: '1869',
          tiedosto: 'Ever Given in Suez Canal viewed from ISS.jpg',
          teksti: 'Suezin kanava avattiin 1869, ja se lyhensi merimatkan '
            + 'Euroopasta Aasiaan tuhansilla kilometreillä — laivojen ei '
            + 'enää tarvinnut kiertää koko Afrikkaa. Nykyään kanavan '
            + 'kautta kulkee yli kymmenesosa maailmankaupasta. Keväällä '
            + '2021 koko maailma sai muistutuksen kapeikon merkityksestä, '
            + 'kun 400-metrinen konttilaiva Ever Given juuttui poikittain '
            + 'kanavaan kuudeksi päiväksi: sadat laivat jonottivat, ja '
            + 'kaivinkone kaivoi keulaa irti hiekasta koko maailman '
            + 'seuratessa.',
          selite: 'Ever Given poikittain Suezin kanavassa maaliskuussa '
            + '2021, kuvattuna avaruusasemalta.',
          lahde: 'NASA, Wikimedia Commons (PD)',
          wiki: 'Suezin kanava',
        },
        {
          /*
           * Aineeton kulttuuriperintö (uusi lähdeidea 5.8.2026):
           * Unescon ICH-luettelo on nostoaiheiden aarreaitta — vinkki
           * kirjattu monistusohjeeseen muillekin maille.
           */
          otsikko: 'Keppiottelu faaraoiden ajoilta',
          aika: 'n. 2000 eaa.',
          tiedosto: 'Tahtib, Mawlid Al-Ashi, Luxor 02.jpg',
          teksti: 'Egyptiläiset ottelivat kepein jo faaraoiden aikana: '
            + 'tahtib-kamppailu on kuvattu temppelien ja hautojen '
            + 'seiniin yli neljätuhatta vuotta sitten, ja sama laji '
            + 'elää yhä. Nykyään se on Ylä-Egyptin juhlien leikkimielinen '
            + 'taito: kaksi ottelijaa pyörittää pitkiä keppejä rumpujen '
            + 'ja mizmar-huilujen tahtiin, ja yleisö seisoo piirissä '
            + 'ympärillä. Osuma ei ole tavoite — voittaja on se, joka '
            + 'liikkuu kauneimmin. Unesco otti tahtibin aineettoman '
            + 'kulttuuriperinnön luetteloonsa 2016.',
          selite: 'Tahtib-ottelu mawlid-juhlassa Luxorissa: kepit '
            + 'koholla ja kyläläiset piirissä ympärillä.',
          lahde: 'ولاء, Wikimedia Commons (PD)',
        },
      ],
    },
    {
      id: 'ruoka',
      nimi: 'Ruoka',
      johdanto: 'Egyptiläinen ruoka on kaduilla syntynyttä: papupata '
        + 'aamulla, koshari lounaaksi ja tuore leipä, joka kulkee '
        + 'pyörän tarakalla pään päällä.',
      tehtava: {
        kysymys: 'Mitä egyptinarabian sana aish tarkoittaa leivän '
          + 'lisäksi?',
        vaihtoehdot: ['Elämää', 'Aurinkoa', 'Niiliä'],
        oikea: 0,
        fakta: 'Leipä on egyptiläisille niin tärkeää, että sen nimi '
          + 'tarkoittaa elämää — vastaus löytyi leipänostosta.',
      },
      nostot: [
        {
          otsikko: 'Koshari, kansallisruoka kulhossa',
          tiedosto: 'Egyptian Koshari.jpg',
          teksti: 'Egyptin kansallisruoka koshari on kerroksittain '
            + 'riisiä, makaronia ja linssejä, päällä tomaattikastiketta, '
            + 'kikherneitä ja rapeaksi paistettua sipulia. Se syntyi '
            + '1800-luvulla halvaksi työväen ruoaksi, ja sitä myydään '
            + 'yhä kaduilla ja koshari-ravintoloissa, joissa annos '
            + 'kootaan metallikulhoon sekunneissa. Jokainen lisää itse '
            + 'etikkaa ja tulista dakka-kastiketta — siitä väitellään, '
            + 'kuinka paljon on oikea määrä.',
          selite: 'Koshari-annos: riisin, makaronin ja linssien päällä '
            + 'tomaattikastike ja kikherneet.',
          lahde: 'Basma, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Koshari',
        },
        {
          otsikko: 'Papupata porisee koko yön',
          tiedosto: 'Foul Mudames.jpg',
          teksti: 'Egyptin aamiainen on ful medames: härkäpapuja, jotka '
            + 'hautuvat suuressa pataruukussa hiljaisella tulella koko '
            + 'yön ja maustetaan kuminalla, sitruunalla ja öljyllä. '
            + 'Ruoka on niin vanha, että papuja on löydetty faaraoiden '
            + 'haudoista asti. Aamuisin ful-kärryjen ympärille syntyy '
            + 'jono: myyjä kauhoo papuja ruukun suusta leipätaskuihin, '
            + 'ja työmatkalaiset syövät ne siinä seisten.',
          selite: 'Ful-myyjä kallistaa isoa pataruukkuaan — samanlaisesta '
            + 'on kauhottu aamiaista Kairon kaduilla sukupolvien ajan.',
          lahde: 'Mona Abo-Abda, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Ful medames',
        },
        {
          otsikko: 'Leipä tarkoittaa elämää',
          tiedosto: 'Bread in move.jpg',
          teksti: 'Arabiaksi leipä on khubz — mutta Egyptissä sitä '
            + 'kutsutaan sanalla aish, joka tarkoittaa elämää. Litteä '
            + 'aish baladi -leipä paistetaan kivikuumassa uunissa, jossa '
            + 'se pullistuu palloksi, ja valtio tukee sen hintaa, jotta '
            + 'leipää riittää kaikille. Kairon katukuvaan kuuluvat '
            + 'leivänkuljettajat, jotka polkevat pyörällä ruuhkan läpi '
            + 'valtava leipäritilä pään päällä tasapainossa — kädet '
            + 'tarvitaan ohjaustankoon.',
          selite: 'Leivänkuljettaja Kairossa: tuoreet leivät kulkevat '
            + 'ritilällä pään päällä, pyörä alla.',
          lahde: 'Myousry6666, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Aish baladi',
        },
        {
          otsikko: 'Ahwa on olohuone kadulla',
          tiedosto: 'Kairo 2019-11-04j.jpg',
          teksti: 'Egyptiläinen kahvila eli ahwa on olohuone kadun '
            + 'varrella: pöydissä juodaan paksua kahvia ja makeaa '
            + 'minttuteetä, pelataan tavla-lautapeliä ja ratkotaan '
            + 'maailman asiat. Tee tilataan sokerimäärän mukaan — '
            + 'ziyada tarkoittaa reilusti sokeria. Kiirettä ahwassa ei '
            + 'tunneta: lasi teetä oikeuttaa istumaan niin pitkään kuin '
            + 'juttua riittää, ja vakioasiakkaan tilaus muistetaan '
            + 'kysymättä.',
          selite: 'Ahwa täynnä väkeä Kairon vanhassakaupungissa — puhe '
            + 'sorisee, teelasit kiertävät.',
          lahde: 'Djehouty, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Egyptin keittiö',
        },
      ],
    },
    {
      id: 'kuvataide',
      nimi: 'Kuvataide',
      johdanto: 'Egyptin taide on maailman pisin kuvakertomus: samat '
        + 'selkeät muodot ja kirkkaat värit kantoivat kolme tuhatta '
        + 'vuotta — ja näkyvät museoissa yhä.',
      nostot: [
        {
          otsikko: 'Nefertiti, kuvanveiston koulutyö',
          tiedosto: 'Nofretete Neues Museum.jpg',
          teksti: 'Kuningatar Nefertitin rintakuva löytyi 1912 '
            + 'kuvanveistäjä Thutmosen työpajan raunioista Amarnasta. Se '
            + 'ei ollut valmis teos vaan mestarin mallikappale, josta '
            + 'oppilaat kopioivat kuningattaren kasvot — siksi toinen '
            + 'silmä jäi viimeistelemättä. Kolme ja puoli tuhatta vuotta '
            + 'myöhemmin harjoitustyöstä on tullut yksi maailman '
            + 'kuuluisimmista muotokuvista, jota jonotetaan Berliinin '
            + 'museossa kuin tähteä ainakin.',
          selite: 'Nefertitin rintakuva (n. 1345 eaa.) Berliinin Neues '
            + 'Museumissa. Vasen silmä jäi mallityössä tyhjäksi.',
          lahde: 'Philip Pikart, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Nefertiti',
        },
        {
          otsikko: 'Kissa mukana metsällä',
          tiedosto: 'Tomb of Nebamun.jpg',
          teksti: 'Kirjuri Nebamunin hautakammion seinään maalattiin '
            + '3 400 vuotta sitten metsästysretki papyruskosteikossa: '
            + 'Nebamun seisoo veneessä heittokeppi kädessä, linnut '
            + 'pyrähtävät lentoon, ja perheen kissa on ehtinyt napata '
            + 'kolme lintua yhtä aikaa. Vaimo ja tytär ovat mukana '
            + 'juhlavaatteissa, koska kuva ei esitä arkea vaan '
            + 'ikuisuutta: tällaisena Nebamun halusi elää kuolemansa '
            + 'jälkeen — perhe ja kissa mukanaan.',
          selite: 'Nebamun metsästää kosteikossa (n. 1350 eaa.), British '
            + 'Museum. Ruskea kissa nappaa lintuja veneen keulassa.',
          lahde: 'British Museum, Wikimedia Commons (PD)',
          wiki: 'Nebamun',
        },
        {
          otsikko: 'Kasvot muumion päällä',
          tiedosto: 'Fayum egyptian funerary portrait 1627 NAMAthens.jpg',
          teksti: 'Fajumin keitaalta on löydetty satoja roomalaisajan '
            + 'muotokuvia, jotka maalattiin puulevylle ja sidottiin '
            + 'muumion kasvojen päälle. Ne ovat lähes ainoat säilyneet '
            + 'antiikin maalaukset kasvoista — ja niin eläviä, että '
            + 'kahden tuhannen vuoden takainen ihminen katsoo suoraan '
            + 'silmiin: kampaukset, korvakorut ja katse kuin '
            + 'valokuvassa. Museot ympäri maailman pitävät niitä '
            + 'muotokuvamaalauksen ensimmäisenä kultakautena.',
          selite: 'Fajumin muumiomuotokuva 100-luvulta Ateenan '
            + 'arkeologisessa museossa: parrakas mies valkoisessa '
            + 'tunikassa.',
          lahde: 'Jebulon, Wikimedia Commons (CC0)',
          wiki: 'Fajumin muotokuvat',
        },
        {
          otsikko: 'Sarjakuva tuonpuoleisesta',
          tiedosto: 'The judgement of the dead in the presence of Osiris (cropped).jpg',
          teksti: 'Kuolleiden kirja oli papyruskäärö, joka pantiin '
            + 'vainajan mukaan hautaan kuin matkaopas tuonpuoleiseen: '
            + 'loitsuja, karttoja ja kuvia vaarallisen matkan varrelle. '
            + 'Kuuluisimmassa kohtauksessa vainajan sydän punnitaan '
            + 'totuuden sulkaa vasten ennen kuin hänet päästetään '
            + 'Osiriksen valtakuntaan. Kirjuri Huneferin kääröllä kuvat '
            + 'ja kirjoitus kulkevat rinnakkain kuin sarjakuvassa — '
            + 'kolme tuhatta vuotta ennen sarjakuvia.',
          selite: 'Kirjuri Hunefer johdatetaan Osiriksen eteen '
            + '(n. 1275 eaa.), British Museum.',
          lahde: 'British Museum, Wikimedia Commons (PD)',
          wiki: 'Kuolleiden kirja',
        },
      ],
    },
    {
      id: 'luonto',
      nimi: 'Luonto',
      johdanto: 'Egypti on aavikkoa reunasta reunaan — ja silti sen '
        + 'halki virtaa maailman kuuluisin joki, ja meren alla kukkii '
        + 'riutta.',
      nostot: [
        {
          otsikko: 'Niili teki koko maan',
          tiedosto: 'Feluccas and The Nile at sunset (14284288808).jpg',
          teksti: 'Niili virtaa Egyptin läpi yli tuhat kilometriä, eikä '
            + 'sen varrella sada juuri koskaan — kaikki vesi tulee '
            + 'kaukaa etelän vuorilta. Lähes kaikki egyptiläiset asuvat '
            + 'kapealla vihreällä nauhalla joen varressa: kartalla maa '
            + 'näyttää aavikolle piirretyltä vihreältä viivalta, joka '
            + 'levenee suistoksi pohjoisessa. Joella purjehtivat yhä '
            + 'felukat, kolmikulmapurjeiset puuveneet, joiden malli on '
            + 'pysynyt samana vuosisatoja.',
          selite: 'Felukoita Niilillä auringonlaskun aikaan. '
            + 'Kolmikulmainen purje on kuulunut jokimaisemaan '
            + 'vuosisatojen ajan.',
          lahde: 'Jorge Láscar, Wikimedia Commons (CC BY 2.0)',
          wiki: 'Niili',
        },
        {
          otsikko: 'Aavikko täynnä sieniä',
          tiedosto: 'White Desert, Egypt.jpg',
          teksti: 'Valkoisessa autiomaassa Saharan keskellä nousee '
            + 'hiekasta liituvalkoisia torneja ja sienen muotoisia '
            + 'patsaita, jotka hiekkaa kantava tuuli on veistänyt. '
            + 'Liitu syntyi merieliöiden kuorista — koko aavikko oli '
            + 'kerran meren pohjaa, ja kalliosta löytyy simpukoiden '
            + 'jälkiä keskellä kuivinta hiekkaa. Täysikuun valossa '
            + 'valkoiset muodot hohtavat niin aavemaisesti, että '
            + 'retkeilijät leiriytyvät niiden keskelle varta vasten.',
          selite: 'Valkoisen autiomaan liitumuodostelmia: tuulen '
            + 'veistämiä torneja entisellä merenpohjalla.',
          lahde: 'Vyacheslav Argenberg, Wikimedia Commons (CC BY 4.0)',
          wiki: 'Valkoinen autiomaa',
        },
        {
          otsikko: 'Riutta, joka sietää kuumaa',
          tiedosto: 'Coral (Acropora hemprichii), Ras Katy, Sharm el-Sheij, Egipto, 2022-03-26, DD 108.jpg',
          teksti: 'Punaisenmeren rannikolla kasvaa satoja kilometrejä '
            + 'koralliriuttaa, jonka väreissä sukeltaa muun muassa '
            + 'papukaijakaloja, keisarikaloja ja merikilpikonnia. '
            + 'Erikoista on, että nämä korallit kestävät lämpöä '
            + 'paremmin kuin mitkään muut maailmassa: vesi on täällä '
            + 'aina ollut lämmintä ja suolaista. Siksi tutkijat '
            + 'arvelevat, että Punaisenmeren riutta voi olla viimeisiä, '
            + 'jotka selviävät merien lämmetessä — koko maailman '
            + 'korallien varakappale.',
          selite: 'Korallipesäke Sharm el-Sheikhin edustalla '
            + 'Punaisellamerellä; haarojen lomassa suikertaa pikkukaloja.',
          lahde: 'Diego Delso, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Punainenmeri',
        },
        {
          otsikko: 'Keidas keskellä ei-mitään',
          tiedosto: 'Siwa Oasis, Western Desert, Egypt.jpg',
          teksti: 'Siwan keidas on aavikon saari: lähimpään kaupunkiin '
            + 'on satoja kilometrejä hiekkaa, mutta keitaalla pulppuaa '
            + 'satoja lähteitä, joiden varassa kasvaa satojatuhansia '
            + 'taateli- ja oliivipuita. Eristyksissä siwalaiset '
            + 'säilyttivät oman berberikielensä, jota muualla Egyptissä '
            + 'ei puhuta. Kuuluisin vieras saapui vuonna 331 eaa.: '
            + 'Aleksanteri Suuri vaelsi aavikon poikki kysymään neuvoa '
            + 'keitaan oraakkelilta.',
          selite: 'Siwan keidas ylhäältä: palmumeri ja kylä aavikon '
            + 'keskellä, taustalla pöytävuoria.',
          lahde: 'Vyacheslav Argenberg, Wikimedia Commons (CC BY 4.0)',
          wiki: 'Siwa',
        },
      ],
    },
    {
      id: 'tiede',
      nimi: 'Tiede',
      johdanto: 'Kalenteri, kirurgia ja maailman kuuluisin kirjasto — '
        + 'moni tuttu asia keksittiin Niilin varrella tuhansia vuosia '
        + 'sitten.',
      nostot: [
        {
          otsikko: 'Vuodessa on 365 päivää — kiitos Niilin',
          tiedosto: 'Zodiaque de Dendéra - Musée du Louvre Antiquités Egyptiennes D 38 ; E 13482.jpg',
          teksti: 'Egyptiläiset tarvitsivat tarkan kalenterin yhtä asiaa '
            + 'varten: milloin Niili tulvii. He huomasivat, että tulva '
            + 'alkoi aina, kun Sirius-tähti nousi ensi kertaa '
            + 'aamutaivaalle, ja laskivat vuoden pituudeksi 365 päivää — '
            + 'kolme tuhatta vuotta ennen kuin Julius Caesar lainasi '
            + 'saman kalenterin Roomaan. Meidän kalenterimme on sen '
            + 'suora jälkeläinen: kun katsot seinäkalenteria, katsot '
            + 'Niilin tulvan aikataulua.',
          selite: 'Denderan temppelin tähtikatto Louvressa: taivas '
            + 'tähdistöineen kiekkona, jota jumalhahmot kannattelevat.',
          lahde: 'Shonagon, Wikimedia Commons (CC0)',
          wiki: 'Denderan eläinrata',
        },
        {
          otsikko: 'Maailman vanhin kirurgin opas',
          tiedosto: 'Edwin Smith Papyrus v2.jpg',
          teksti: 'Edwin Smithin papyrus on 3 600 vuotta vanha '
            + 'lääkärikirja — vanhin tunnettu kirurgian opas maailmassa. '
            + 'Siinä käydään läpi 48 potilastapausta päästä varpaisiin: '
            + 'murtumia, haavoja ja sijoiltaanmenoja, jokaisessa tutkimus, '
            + 'diagnoosi ja hoito-ohje. Taikuutta kirjassa ei juuri ole, '
            + 'vaan lastoja, ompeleita ja hunajasiteitä — ja siinä '
            + 'mainitaan aivot ensimmäistä kertaa ihmiskunnan '
            + 'kirjoitetussa historiassa.',
          selite: 'Aukeama Edwin Smithin papyruksesta: lääkärin '
            + 'muistiinpanoja mustalla, otsikot punaisella.',
          lahde: 'Jeff Dahl, Wikimedia Commons (PD)',
          wiki: 'Edwin Smithin papyrus',
        },
        {
          otsikko: 'Mittari, joka määräsi verot',
          tiedosto: 'Nilometer Rhoda Island Cairo Egypt (1).jpg',
          teksti: 'Kairon Rhodan saarella laskeutuu kaivoon '
            + 'porraskäytävä, jonka keskellä seisoo mittapylväs: '
            + 'nilometri, jolla mitattiin Niilin tulvan korkeus. Lukema '
            + 'ratkaisi koko valtakunnan vuoden — matala tulva tiesi '
            + 'niukkuutta, korkea tuhoja, ja sopiva runsasta satoa. '
            + 'Verotkin määrättiin lukeman mukaan: hyvänä tulvavuonna '
            + 'viljelijä maksoi enemmän. Rhodan nilometri mittasi jokea '
            + 'yli tuhat vuotta, kunnes Assuanin pato tasasi tulvat.',
          selite: 'Rhodan saaren nilometri: porrastettu mittakaivo ja '
            + 'kahdeksankulmainen mittapylväs.',
          lahde: 'Radosław Botev, Wikimedia Commons (CC BY 3.0 PL)',
          wiki: 'Nilometri',
        },
        {
          otsikko: 'Kirjasto, joka halusi kaikki kirjat',
          tiedosto: 'Bibliotiqa Alexandria 9 edited.jpg',
          teksti: 'Aleksandrian muinainen kirjasto yritti mahdotonta: '
            + 'koota kaiken maailman tiedon yhteen paikkaan. Satamaan '
            + 'saapuvat laivat tarkastettiin kirjojen varalta, ja '
            + 'kääröt kopioitiin kokoelmiin. Kirjaston tutkijat '
            + 'mittasivat maapallon ympärysmitan ja järjestivät tähdet '
            + 'luetteloiksi. Kirjasto tuhoutui vähitellen, mutta vuonna '
            + '2002 Aleksandriaan avattiin sen perillinen: Bibliotheca '
            + 'Alexandrina, jonka lukusali on maailman suurimpia.',
          selite: 'Bibliotheca Alexandrinan porrastettu lukusali: '
            + 'vinon kattolevyn alla on tilaa kahdelle tuhannelle '
            + 'lukijalle.',
          lahde: 'Mona Abo-Abda, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Aleksandrian kirjasto',
        },
      ],
    },
    {
      id: 'musiikki',
      nimi: 'Musiikki',
      johdanto: 'Laulaja, jonka konsertti tyhjensi kadut kerran kuussa, soitin '
        + 'jolla on oma koulunsa, ja hautakammion seinälle veistetty harpisti '
        + '3 300 vuoden takaa.',
      nostot: [
        {
          otsikko: 'Kerran kuussa kadut hiljenivät',
          tiedosto: 'Oum Kaltoum à Rabat.jpg',
          teksti: 'Umm Kulthum lauloi radiossa joka kuukauden ensimmäisenä '
            + 'torstaina, ja koko arabimaailma pysähtyi kuuntelemaan: '
            + 'kahvilat täyttyivät, kadut tyhjenivät ja taksit jäivät '
            + 'odottamaan. Konsertti saattoi kestää kuusi tuntia, koska hän '
            + 'lauloi saman säkeen uudestaan ja uudestaan hieman eri tavalla '
            + '— niin kauan kuin yleisö huusi lisää. Kädessä oli aina '
            + 'nenäliina, jota hän puristi laulaessaan. Hänen hautajaisissaan '
            + '1975 Kairon kaduilla oli arviolta neljä miljoonaa ihmistä.',
          selite: 'Umm Kulthum lavalla Rabatissa 1968, nenäliina kädessä. Takana '
            + 'orkesteri, oikealla qanun-kanteleen soittaja.',
          lahde: 'Mmaradji, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Umm Kulthum',
          musiikki: 'https://music.apple.com/fi/album/enta-oumry-remastered/922753882?i=922753943',
          musiikkiNimi: 'Umm Kulthum: Enta Omri',
          esikuuntelu: 'Umm Kulthum Enta Omri',
        },
        {
          otsikko: 'Koulu, jossa opetetaan yhtä ainoaa soitinta',
          tiedosto: 'Oud class at Cairo\'s Beit el-Oud (House of Oud).jpg',
          teksti: 'Ud on arabialaisen musiikin pääsoitin: päärynänmuotoinen '
            + 'kaikukoppa, taaksepäin taittuva viritinlapa ja otelauta ilman '
            + 'nauhoja. Juuri nauhattomuus on olennaista — sävelten väliin '
            + 'mahtuu ääniä, joita pianolla ei voi soittaa, ja niistä '
            + 'arabialainen sävelasteikko rakentuu. Kairossa toimii Beit '
            + 'el-Oud, oudin talo, jossa opetetaan vain tätä soitinta. Sana '
            + 'ud tarkoittaa puuta, ja siitä tuli mutkan kautta myös '
            + 'eurooppalaisen luutun nimi: al-ud muuttui espanjaksi laúdiksi '
            + 'ja englanniksi luteksi.',
          selite: 'Oppilas soittaa udia Kairon Beit el-Oudissa. Otelaudassa ei '
            + 'ole nauhoja, joten sormi voi hakea sävelen väliltä.',
          lahde: 'Enas El Masry, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Ud',
          musiikkiNayte: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Oud_music_by_Andy_R._Jordan_1V2_long.mp3',
          musiikkiNayteNimi: 'Ud-soolo — Andy R. Jordan (CC BY-SA 3.0)',
        },
        {
          otsikko: 'Harpisti soittaa silmät kiinni',
          tiedosto: 'Tomb chapel of paätenemheb (RMO Leiden egypt saqqara 1333-1307bc) (3970065130).jpg',
          teksti: 'Muinaisen Egyptin haudoissa on satoja kuvia muusikoista, ja '
            + 'niistä tiedetään mitä soittimia oli: kaarevia harppuja, '
            + 'huiluja, pitkäkaulaisia luuttuja, kehärumpuja ja '
            + 'sistrum-helistin. Nuotteja ei sen sijaan ole yhtään — kukaan '
            + 'ei tiedä, miltä musiikki kuulosti. Harpistit on kuvattu usein '
            + 'silmät suljettuina, ja monet tutkijat arvelevat heidän olleen '
            + 'sokeita: soittajan ammatti oli yksi harvoista, joka sopi '
            + 'näkövammaiselle. Kuvien soittimista on rakennettu '
            + 'jäljennöksiä, mutta sävelmät ovat kadonneet lopullisesti.',
          selite: 'Harpisti ja huilunsoittaja Paatenemhebin hautakappelin '
            + 'reliefissä Sakkarasta, n. 1330 eaa. Harpun kielet erottuvat '
            + 'kiveen veistettyinä.',
          lahde: 'Rob Koopman, Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Harppu',
        },
        {
          otsikko: 'Hame muuttuu pyöriessä väripyöräksi',
          tiedosto: 'Tanoura Dance, Egypt.jpg',
          teksti: 'Tanoura on egyptiläinen pyörivä tanssi, joka periytyy '
            + 'sufilaisten dervissien hartausmenoista: pyöriminen on niissä '
            + 'rukouksen muoto, ei esitys. Tanssija pyörii samaan suuntaan '
            + 'kymmeniä minuutteja pysähtymättä, ja painava monivärinen hame '
            + 'nousee ilmaan vaakasuoraksi kiekoksi. Salaisuus on katseessa — '
            + 'tanssija pitää katseen omassa kädessään, joka kiertää mukana, '
            + 'jolloin pää ei saa huimausta. Musiikin pitää rytmiä kehärumpu '
            + 'riqq, jonka reunoissa helisevät pienet metallilautaset.',
          selite: 'Kaksi tanoura-tanssijaa pyörii niin nopeasti, että hameet ovat '
            + 'suoristuneet kiekoiksi. Oikealla riqq-kehärummun soittaja.',
          lahde: 'Tsidoti, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Dervissit',
          musiikkiNayte: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/cc/Ala_fi_Sabil_Allah.ogg/Ala_fi_Sabil_Allah.ogg.mp3',
          musiikkiNayteNimi: 'Ala fi Sabil Allah — Sheikh Sayed El-Safti (PD)',
        },
      ],
    },
    {
      id: 'rakennukset',
      nimi: 'Rakennukset',
      johdanto: 'Egyptiläiset eivät rakentaneet vain isosti vaan tarkasti — ja '
        + 'jättivät jälkeensä keskeneräisiä työmaita, joista näkee '
        + 'tarkalleen, miten se tehtiin.',
      nostot: [
        {
          otsikko: 'Kaksi miljoonaa kiveä, ei yhtään orjaa',
          aika: 'n. 2560 eaa.',
          tiedosto: 'Giseh 13.jpg',
          teksti: 'Kheopsin pyramidiin meni noin 2,3 miljoonaa kivilohkaretta, '
            + 'keskimäärin 2,5 tonnia kappale, ja se oli maailman korkein '
            + 'rakennus lähes neljätuhatta vuotta. Pyramidin viereltä on '
            + 'kaivettu esiin rakentajien kylä: leipomoita, olutpanimo, '
            + 'ruokaloita ja nukkumaparakkeja. Luurangoissa näkyy '
            + 'parantuneita luunmurtumia, eli loukkaantuneita hoidettiin. '
            + 'Työläiset olivat palkattuja ryhmiä eivätkä orjia — ryhmillä '
            + 'oli jopa omat nimensä, kuten Kheopsin ystävät.',
          selite: 'Kheopsin pyramidin kylki läheltä. Vaakasuorat kivikerrokset '
            + 'nousevat portaikkona, ja yksittäiset lohkareet erottuvat.',
          lahde: 'Olaf Tausch, Wikimedia Commons (CC BY 3.0)',
          wiki: 'Kheopsin pyramidi',
        },
        {
          otsikko: 'Työmaa, joka jäi kesken 3 500 vuotta sitten',
          aika: 'n. 1500 eaa.',
          tiedosto: 'Obelisco inacabado, Asuán, Egipto, 2022-04-01, DD 167.jpg',
          teksti: 'Assuanin louhoksessa makaa obeliski, joka olisi ollut 42 '
            + 'metriä pitkä ja painanut yli tuhat tonnia — suurin koskaan '
            + 'tehty. Kiveen ilmestyi halkeama, ja työ jätettiin kesken. '
            + 'Juuri siksi se on arvokas: se on ainoa paikka maailmassa, '
            + 'jossa näkee, miten graniittia irrotettiin. Graniitti on niin '
            + 'kovaa, ettei pronssitaltta pure siihen, joten kiveä hakattiin '
            + 'doleriittipalloilla — käsissä pidellyillä kivipalloilla, jotka '
            + 'ovat graniittia kovempia. Ura hakattiin senttimetri kerrallaan '
            + 'koko obeliskin ympäri.',
          selite: 'Keskeneräinen obeliski yhä kiinni kalliossa. Kourun seinämässä '
            + 'näkyy rivi kupinmuotoisia jälkiä doleriittipallojen iskuista.',
          lahde: 'Diego Delso, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Obeliski',
        },
        {
          otsikko: 'Ensimmäinen arkkitehti, jonka nimi tiedetään',
          aika: 'n. 2650 eaa.',
          tiedosto: 'Saqqara, Pyramid of Djoser, Ancient Egypt.jpg',
          teksti: 'Sakkaran porraspyramidi on maailman vanhin suuri kivirakennus, '
            + 'ja sen suunnittelija Imhotep on ensimmäinen ihminen, jonka '
            + 'tiedämme nimeltä arkkitehdiksi. Kivilohkareet ovat pieniä, '
            + 'savitiilen kokoisia: rakentajat eivät vielä uskaltaneet '
            + 'luottaa isoihin kiviin vaan tekivät kivestä sitä, minkä '
            + 'osasivat tehdä savesta. Pyramidi ei myöskään ollut valmis '
            + 'suunnitelma vaan sarja muutoksia — matalaa hautaa '
            + 'laajennettiin ja korotettiin kerta toisensa jälkeen, kunnes '
            + 'portaita oli kuusi ja korkeutta 62 metriä.',
          selite: 'Djoserin porraspyramidi Sakkarassa. Kuusi kapenevaa tasoa '
            + 'erottuvat selvästi; oikealla kulkevat ihmiset kertovat '
            + 'mittakaavan.',
          lahde: 'Vyacheslav Argenberg, Wikimedia Commons (CC BY 4.0)',
          wiki: 'Sakkaran porraspyramidi',
        },
        {
          otsikko: 'Minareetti, jonka portaat kiertävät ulkopuolella',
          aika: '879',
          tiedosto: 'Kairo Ibn Tulun Moschee BW 4.jpg',
          teksti: 'Ibn Tulunin moskeija on Kairon vanhin alkuperäisessä asussaan '
            + 'säilynyt rakennus ja pinta-alaltaan kaupungin suurin. Se on '
            + 'tehty poltetusta tiilestä eikä kivestä: perimätiedon mukaan '
            + 'rakennuttaja halusi tiiltä siksi, ettei rakennus voisi palaa. '
            + 'Pihaa kiertävät kaaret ovat suippokaaria — samaa muotoa, jolla '
            + 'Euroopan katedraalit nousivat vasta kolmesataa vuotta '
            + 'myöhemmin. Suippo kaari johtaa painon alaspäin pilareille, '
            + 'joten sillä voi tehdä korkeampia ja kevyempiä holveja kuin '
            + 'pyöreällä.',
          selite: 'Ibn Tulunin moskeijan piha. Vasemmalla minareetti, jonka '
            + 'portaat kiertävät tornin ulkopuolella; kaaret ovat suippoja.',
          lahde: 'Berthold Werner, Wikimedia Commons (CC BY 3.0)',
          wiki: 'Ibn Tulunin moskeija',
        },
      ],
    },
    {
      id: 'menovinkit',
      nimi: 'Menovinkit',
      johdanto: 'Egyptiä on kaivettu ja kuvattu satakunta vuotta, ja iso osa siitä '
        + 'työstä on nyt verkossa: pyramidikentän kartat, Karnakin jokainen '
        + 'kirjoitus ja museoiden esineet kuva kerrallaan.',
      lista: [
        {
          otsikko: 'Kaivaukset ja temppelit',
          kohteet: [
            {
              nimi: 'Digital Giza — Gizan pyramidikenttä verkossa',
              tiedosto: 'Sphinx and pyramids of Giza panorama.jpg',
              teksti: 'Digital Giza on Harvardin yliopiston projekti, joka on '
                + 'koonnut kaiken Gizan pyramidikentästä tiedetyn yhteen '
                + 'paikkaan.',
              selite: 'Panoraama Gizasta: sfinksi vasemmalla, kaksi pyramidia '
                + 'takana ja niiden välissä hiekkaan kaivettuja '
                + 'hautarakenteita.',
              lahde: 'kallerna, Wikimedia Commons (CC BY-SA 3.0)',
              linkki: 'https://giza.fas.harvard.edu/',
            },
            {
              nimi: 'Karnak — temppelin kirjoitusten tietokanta',
              tiedosto: 'Karnak Temple Great Hypostyle Hall 2014.jpg',
              teksti: 'Karnakin temppelialuetta rakennettiin yli tuhat vuotta, ja '
                + 'sen seinät, pylväät ja obeliskit ovat täynnä hieroglyfejä.',
              selite: 'Karnakin pylvässali alhaalta kuvattuna: paksuja '
                + 'hiekkakivipylväitä nousee riveissä sinistä taivasta '
                + 'vasten, osa kattopalkeista yhä paikoillaan.',
              lahde: 'Tsyganov Sergey, Wikimedia Commons (CC0)',
              linkki: 'https://sith.huma-num.fr/karnak',
            },
            {
              nimi: 'Egypt Exploration Society — kaivausarkisto',
              tiedosto: 'Deir el-Medina 1999 01.jpg',
              teksti: 'Egypt Exploration Society on kaivanut Egyptissä yli sadan '
                + 'neljänkymmenen vuoden ajan, ja sen arkistoon on kertynyt '
                + 'valokuvia, muistikirjoja, karttoja ja piirroksia koko '
                + 'siltä ajalta.',
              selite: 'Aavikkolaakson rinteessä kivistä ladottujen talojen '
                + 'perustuksia tiiviinä ruudukkona, taustalla paljas '
                + 'kallioharjanne.',
              lahde: 'LBM1948, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://www.ees.ac.uk/',
            },
          ],
        },
        {
          otsikko: 'Museot ja kirjastot',
          kohteet: [
            {
              nimi: 'Museo Egizio — Torinon kokoelma verkossa',
              tiedosto: 'Statue of the goddess Sekhmet, granodiorite - Museo Egizio (Turin) C 255 p01.jpg',
              teksti: 'Torinon Museo Egizio on maailman vanhin pelkästään '
                + 'Egyptille omistettu museo, ja sen kokoelma on Kairon '
                + 'jälkeen laajin. Esineet on kuvattu ja viety verkkoon '
                + 'yksitellen.',
              selite: 'Seisova kivipatsas harmaasta graniitista: naisen vartalo '
                + 'ja leijonan pää, kädessä pystysuora sauva ja jalat '
                + 'rinnakkain jalustalla.',
              lahde: 'Wikimedia Commons (CC0)',
              linkki: 'https://collezioni.museoegizio.it/en-GB/',
            },
            {
              nimi: 'Bibliotheca Alexandrina — digitoidut aineistot',
              tiedosto: 'Reading Room in Bibliotheca Alexandrina.jpg',
              teksti: 'Aleksandrian antiikin kirjasto tuhoutui kauan sitten, '
                + 'mutta sen muistoksi rakennettiin samalle seudulle uusi. '
                + 'Bibliotheca Alexandrina avattiin vuonna 2002.',
              selite: 'Kirjaston lukusali sisältä: vinot valkoiset kattopaneelit '
                + 'lepäävät betonipylväiden varassa, ja alla aukeaa avara '
                + 'portaittainen lukutila.',
              lahde: 'D-Stanley, Wikimedia Commons (CC BY 2.0)',
              linkki: 'https://www.bibalex.org/en/default',
            },
          ],
        },
      ],
    },
  ],
  ITA: [
    {
      id: 'historia',
      nimi: 'Historia',
      johdanto: 'Italia on nuori valtio vanhalla maalla: Rooman '
        + 'valtakunnasta on kaksituhatta vuotta, mutta yhtenäinen '
        + 'Italia on nuorempi kuin moni sen kahviloista.',
      nostot: [
        {
          otsikko: 'Kaikki tiet veivät Roomaan',
          aika: '312 eaa.',
          tiedosto: 'Via Appia Antica Rome 2006.jpg',
          teksti: 'Via Appia avattiin vuonna 312 ennen ajanlaskua, ja sen '
            + 'basalttikivet ovat yhä paikoillaan Rooman eteläpuolella. '
            + 'Valtakunta rakensi teitä yli 80 000 kilometriä — niin '
            + 'suoria, että moni Euroopan moottoritie kulkee nykyään '
            + 'samaa linjaa. Tiet tehtiin sotajoukoille, mutta niitä '
            + 'pitkin kulkivat myös kauppiaat, kirjeet ja ajatukset: '
            + 'sanonta "kaikki tiet vievät Roomaan" oli aikanaan aivan '
            + 'kirjaimellinen väite. Pinjojen reunustamalla Via Appialla '
            + 'voi kävellä saman kiveyksen päällä kuin roomalaiset kaksi '
            + 'vuosituhatta sitten.',
          selite: 'Via Appia Antican vanhaa kiveystä pinjapuiden alla '
            + 'Rooman laidalla.',
          lahde: 'Radosław Botev, Wikimedia Commons (Attribution)',
          wiki: 'Via Appia',
        },
        {
          otsikko: 'Pompeji pysähtyi kesken päivän',
          aika: 'v. 79',
          tiedosto: 'Pompeii, Italy 101.jpg',
          teksti: 'Kun Vesuvius purkautui vuonna 79, tuhka hautasi '
            + 'Pompejin kaupungin niin nopeasti, että leipomon leivät '
            + 'jäivät uuniin. Sen ansiosta roomalaisten arjesta tiedetään '
            + 'enemmän kuin mistään muualta: kadut vaunujen urineen, '
            + 'pikaruokalat tiskeineen ja seinien vaalimainokset ovat '
            + 'kaikki tallella. Kaivaukset alkoivat 1748 ja jatkuvat yhä — '
            + 'kolmasosa kaupungista on edelleen tuhkan alla. Kadun päässä '
            + 'häämöttää itse tulivuori, joka ei ole sammunut: se on vain '
            + 'tauolla.',
          selite: 'Pompejin kivetty pääkatu; taustalla kohoaa Vesuvius, '
            + 'joka hautasi kaupungin vuonna 79.',
          lahde: 'Simon Burchell, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Pompeji',
        },
        {
          otsikko: 'Renessanssi syntyi kilpailusta',
          aika: '1400-luku',
          tiedosto: 'Florence Duomo from Michelangelo hill.jpg',
          teksti: '1400-luvun Firenzessä suvut ja killat kilpailivat '
            + 'siitä, kuka teettää kauneimman kirkon, patsaan tai '
            + 'kupolin. Kilpailusta syntyi renessanssi — '
            + '"uudelleensyntyminen" — joka muutti koko Euroopan taiteen, '
            + 'tieteen ja rakentamisen. Brunelleschin tuomiokirkon kupoli '
            + 'oli valmistuessaan 1436 maailman suurin muuraamalla tehty '
            + 'kupoli, eikä kukaan tiennyt varmasti, pysyisikö se '
            + 'pystyssä: se rakennettiin ilman tukitelineitä tavalla, '
            + 'jota insinöörit ihmettelevät yhä.',
          selite: 'Firenzen tuomiokirkon kupoli kohoaa kaupungin kattojen '
            + 'yllä Michelangelo-kukkulalta katsottuna.',
          lahde: 'Petar Milošević, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Firenzen tuomiokirkko',
        },
        {
          otsikko: 'Italia on nuorempi kuin luulisi',
          aika: '1861',
          tiedosto: 'Garibaldi (1866).jpg',
          teksti: 'Saapasmaa oli vuosisatoja tilkkutäkki kuningaskuntia, '
            + 'herttuakuntia ja kaupunkivaltioita, jotka sotivat keskenään '
            + 'ja puhuivat eri murteita. Yhtenäinen Italia syntyi vasta '
            + '1861, ja sen kokosi punapaitainen sissipäällikkö Giuseppe '
            + 'Garibaldi, joka valtasi tuhannen vapaaehtoisen voimin '
            + 'puoli niemimaata ja luovutti sen sitten kuninkaalle '
            + 'kädenpuristuksella. Kun valtio syntyi, vain harva osasi '
            + 'yhteistä italiaa — kieli opittiin vasta koulusta, '
            + 'radiosta ja televisiosta.',
          selite: 'Giuseppe Garibaldi Alinarin veljesten valokuvassa '
            + 'vuodelta 1866.',
          lahde: 'Fratelli Alinari, Wikimedia Commons (PD)',
          wiki: 'Giuseppe Garibaldi',
        },
      ],
    },
    {
      id: 'ruoka',
      nimi: 'Ruoka',
      johdanto: 'Italialainen keittiö on yksinkertaisuuden taidetta: '
        + 'muutama raaka-aine, jokainen paikallaan, eikä mitään turhaa.',
      /*
       * Lehden minitehtävä (omistajan toive 5.8.2026): pieni kysymys,
       * johon vastaus löytyy tämän sivun tekstistä — kuin sanomalehden
       * tehtäväpalsta. Yksi tehtävä lehteä kohti riittää; sivu saa
       * vaihdella lehdestä toiseen. Palkitaan kerran per kaupunki
       * (game.actionMinitehtava).
       */
      tehtava: {
        kysymys: 'Mitä jotkut italialaiset pankit hyväksyvät lainan '
          + 'vakuudeksi?',
        vaihtoehdot: ['Parmigiano-juustokiekkoja', 'Oliiviöljytynnyreitä', 'Viinipulloja'],
        oikea: 0,
        fakta: 'Pankkien holveissa kypsyy juustokiekkoja kuin '
          + 'kultaharkkoja — vastaus löytyi Parmigiano-nostosta.',
      },
      nostot: [
        {
          otsikko: 'Pizza on Napolin lahja',
          tiedosto: 'Pizza Margherita stu spivack.jpg',
          teksti: 'Pizza syntyi Napolin köyhien kortteleiden katuruokana: '
            + 'litteä leipä, jonka päälle pantiin mitä oli. Tarinan '
            + 'mukaan napolilainen leipuri teki vuonna 1889 kuningatar '
            + 'Margheritalle pizzan Italian lipun väreissä — tomaattia, '
            + 'mozzarellaa ja basilikaa — ja nimesi sen kuningattaren '
            + 'mukaan. Aito napolilainen pizza paistuu puu-uunissa alle '
            + 'kahdessa minuutissa, ja sen reuna on pehmeä, ei rapea. '
            + 'Unesco otti napolilaisen pizzanpaiston aineettoman '
            + 'kulttuuriperinnön luetteloonsa 2017.',
          selite: 'Pizza margherita: tomaattia, mozzarellaa ja basilikaa '
            + '— Italian lipun värit.',
          lahde: 'stu_spivack, Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Pizza',
        },
        {
          otsikko: 'Pastalla on sata nimeä',
          tiedosto: 'Pasta 2006 1.jpg',
          teksti: 'Italiassa pasta ei ole yksi ruoka vaan satojen '
            + 'muotojen perhe, ja jokaisella muodolla on nimi ja '
            + 'tehtävä: putkimainen rigatoni pitää paksun kastikkeen '
            + 'sisällään, litteä bavette imee öljyn, ja spaghetti alla '
            + 'chitarra leikataan "kitaran" kielillä. Muoto ei ole '
            + 'koristelua vaan insinöörityötä, joka ratkaisee, miten '
            + 'kastike tarttuu. Italialainen syö pastaa keskimäärin 23 '
            + 'kiloa vuodessa, enemmän kuin kukaan muu maailmassa, ja '
            + 'väittely oikeasta muodosta oikealle kastikkeelle on '
            + 'kansallislaji siinä missä jalkapallokin.',
          selite: 'Pitkien pastojen kirjoa nimineen: fusilli, bigoli, '
            + 'ziti, bucatini ja monta muuta.',
          lahde: 'ChiemseeMan, Wikimedia Commons (PD)',
          wiki: 'Pasta',
        },
        {
          otsikko: 'Espresso juodaan seisten',
          tiedosto: 'Tazzina di caffè a Ventimiglia.jpg',
          teksti: 'Italialainen kahvila on pikapysäkki: espresso '
            + 'tilataan tiskiltä, juodaan parilla kulauksella seisten ja '
            + 'jatketaan matkaa. Pieneen kuppiin mahtuu yllättävän monta '
            + 'sääntöä — cappuccino kuuluu vain aamuun, eikä maitokahvia '
            + 'tilata aterian päälle. Espressokone on italialainen '
            + 'keksintö 1900-luvun alusta, ja sana espresso tarkoittaa '
            + 'puristettua ja pikaista. Monessa baarissa kahvi maksaa '
            + 'tiskillä vähemmän kuin pöydässä: istumisesta veloitetaan, '
            + 'kahvista ei juuri.',
          selite: 'Espresso posliinikupissa baarin tiskillä — juoma, '
            + 'jonka ääressä ei viivytä.',
          lahde: 'Lemone, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Espresso',
        },
        {
          otsikko: 'Parmigiano kypsyy vuosia',
          tiedosto: 'Wheel of 2013 Parmigiano-Reggiano DOP.JPG',
          teksti: 'Parmigiano Reggiano -kiekko painaa noin 40 kiloa ja '
            + 'kypsyy vähintään vuoden, usein kolmekin, ennen kuin '
            + 'tarkastaja koputtaa sitä vasaralla ja kuuntelee, onko '
            + 'sisus ehjä. Vain Parman seudulla tehty juusto saa kantaa '
            + 'nimeä, ja resepti on ollut sama lähes tuhat vuotta: '
            + 'maitoa, suolaa ja aikaa. Kiekot ovat niin arvokkaita, '
            + 'että jotkut italialaiset pankit hyväksyvät niitä lainan '
            + 'vakuudeksi — holveissa kypsyy juustoa kuin kultaharkkoja.',
          selite: 'Kokonainen Parmigiano Reggiano -kiekko leimoineen.',
          lahde: 'Wittylama, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Parmesaani',
        },
      ],
    },
    {
      id: 'musiikki',
      nimi: 'Musiikki',
      johdanto: 'Ooppera, viulunrakennus ja musiikin oma kieli — piano, '
        + 'forte, allegro — ovat kaikki Italian lahjoja maailmalle.',
      nostot: [
        {
          otsikko: 'Ooppera keksittiin Italiassa',
          tiedosto: 'Mailand scala view from stage 1300010 Pano.jpg',
          teksti: 'Ooppera syntyi Firenzessä 1600-luvun taitteessa, kun '
            + 'joukko oppineita yritti herättää henkiin antiikin Kreikan '
            + 'näytelmät — ja loi vahingossa kokonaan uuden '
            + 'taiteenlajin. Milanon La Scala on sen kuuluisin näyttämö: '
            + 'kuusi kerrosta aitioita kultauksineen ja yleisö, joka ei '
            + 'anna virheitä anteeksi. Sanat, joilla musiikista puhutaan '
            + 'kaikkialla maailmassa, ovat italiaa: piano tarkoittaa '
            + 'hiljaa, forte lujaa ja allegro iloisesti.',
          selite: 'La Scalan katsomo näyttämöltä nähtynä: kuusi kerrosta '
            + 'aitioita hevosenkengän muodossa.',
          lahde: 'Ermell, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'La Scala',
        },
        {
          otsikko: 'Verdin kuorosta tuli kansan ääni',
          tiedosto: 'Giuseppe Verdi by Giovanni Boldini.jpg',
          teksti: 'Giuseppe Verdi sävelsi oopperoita, joiden melodioita '
            + 'hyräiltiin kaduilla kuin iskelmiä. Nabucco-oopperan '
            + 'orjien kuorosta "Va, pensiero" tuli 1800-luvulla '
            + 'epävirallinen kansallislaulu, kun italialaiset kuulivat '
            + 'siinä oman kaipuunsa yhtenäiseen maahan. Nimikin taipui '
            + 'iskulauseeksi: seinään kirjoitettu VERDI luettiin '
            + '"Vittorio Emanuele Re D\'Italia". Kun säveltäjä kuoli '
            + '1901, Milanon kaduilla sadattuhannet lauloivat juuri sen '
            + 'kuoron — hiljaa, ilman johtajaa.',
          selite: 'Giovanni Boldinin muotokuva Giuseppe Verdistä '
            + 'vuodelta 1886.',
          lahde: 'Giovanni Boldini, Wikimedia Commons (PD)',
          wiki: 'Giuseppe Verdi',
          // Juuri se kuoro, josta teksti kertoo — Italian kansallisen
          // äänitearkiston (ICBSA) äänite Commonsin mp3-transkoodina.
          musiikkiNayte: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/5/50/ICBSA_Verdi_-_Nabucco%2C_Va_pensiero.ogg/ICBSA_Verdi_-_Nabucco%2C_Va_pensiero.ogg.mp3',
          musiikkiNayteNimi: 'Verdi: Va, pensiero — ICBSA:n arkistoäänite (CC BY-SA 4.0)',
        },
        {
          otsikko: 'Cremonan viuluja ei ole ylitetty',
          tiedosto: 'Cremona - Museo del violino - Statua di Stradivari.JPG',
          teksti: 'Pienessä Cremonan kaupungissa rakennettiin 1600- ja '
            + '1700-luvuilla maailman parhaat viulut, eikä kukaan ole '
            + 'sen jälkeen tehnyt parempia. Antonio Stradivari valmisti '
            + 'työpajassaan yli tuhat soitinta, joista noin 650 on '
            + 'säilynyt — ja niillä soitetaan yhä, sillä parhaat '
            + 'maksavat enemmän kuin kerrostalo. Salaisuutta on etsitty '
            + 'puusta, lakasta ja liimasta, mutta varmaa vastausta ei '
            + 'tiedä kukaan. Cremonassa on edelleen yli sata '
            + 'viulunrakentajan verstasta, ja käsityö jatkuu.',
          selite: 'Stradivarin patsas kotikaupungissaan Cremonassa: '
            + 'mestari työkaluineen ja keskeneräinen viulu kädessä.',
          lahde: 'Monica Rondoni, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Antonio Stradivari',
        },
        {
          otsikko: 'Napolin laulut kiersivät maailman',
          tiedosto: 'Naples Panorama prise de la Chartreuse S. Martin, RP-F-F16758.jpg',
          teksti: 'Kun miljoonat italialaiset lähtivät 1800- ja '
            + '1900-luvuilla siirtolaisiksi valtameren taakse, laulut '
            + 'lähtivät mukana. Napolin laulut — O sole mio, Funiculì '
            + 'funiculà, Santa Lucia — levisivät satamakaupungista koko '
            + 'maailman lauluiksi, joita esittävät niin oopperatähdet '
            + 'kuin jäätelöautot. O sole mio tarkoittaa "minun '
            + 'aurinkoni", ja se sävellettiin 1898 — ei Napolissa vaan '
            + 'Odessassa, jossa napolilainen säveltäjä oli kiertueella '
            + 'ja ikävöi kotiin.',
          selite: 'Napoli ja Vesuvius 1800-luvun valokuvassa — tältä '
            + 'kaupunki näytti, kun sen laulut lähtivät maailmalle.',
          lahde: 'Rijksmuseum, Wikimedia Commons (CC0)',
          wiki: 'O sole mio',
          musiikki: 'https://music.apple.com/fi/album/o-sole-mio-orch-chiaramello-live-at-piazza-grande-modena/6795110776?i=6795111186',
          musiikkiNimi: 'Napolin lauluja Apple Musicissa',
          // Tunnetuin tulkinta: oopperatähti, jonka teksti mainitsee.
          esikuuntelu: 'O sole mio Pavarotti',
        },
      ],
    },
    {
      id: 'kuvataide',
      nimi: 'Kuvataide',
      johdanto: 'Italian kirkot, palatsit ja aukiot ovat yhtä suurta '
        + 'taidemuseota — moni mestariteos on yhä siinä paikassa, johon '
        + 'se aikanaan tehtiin.',
      nostot: [
        {
          otsikko: 'David, kivestä vapautettu',
          tiedosto: "Michelangelo's David 2015.jpg",
          teksti: 'Michelangelo veisti Davidin 1501–1504 '
            + 'marmorilohkareesta, jota kaksi muuta kuvanveistäjää oli '
            + 'jo ehtinyt pitää pilalle hakattuna. Hän oli 26-vuotias. '
            + 'Viisimetrinen David esittää hetkeä ennen taistelua '
            + 'jättiläistä vastaan: kulmat kurtussa, linko olalla, '
            + 'jännitys näkyy käden suonissa asti. Michelangelo sanoi, '
            + 'ettei hän veistänyt patsaita vaan vapautti ne — hahmo '
            + 'odotti valmiina kiven sisällä, ja hän poisti vain '
            + 'ylimääräisen. Alkuperäinen on Firenzen galleriassa; '
            + 'aukiolla seisoo kopio.',
          selite: 'Michelangelon David Galleria dell\'Accademiassa '
            + 'Firenzessä.',
          lahde: 'Livioandronico2013, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'David (Michelangelo)',
        },
        {
          otsikko: 'Ehtoollinen, joka haalistuu arvokkaasti',
          tiedosto: 'Última Cena - Da Vinci 5.jpg',
          teksti: 'Leonardo da Vinci maalasi Viimeisen ehtoollisen '
            + '1490-luvulla milanolaisen luostarin ruokasalin seinään — '
            + 'ja kokeili uutta tekniikkaa, joka alkoi hilseillä jo '
            + 'hänen elinaikanaan. Siksi maalaus on ollut korjattavana '
            + 'melkein koko olemassaolonsa ajan: viimeisin restaurointi '
            + 'kesti 21 vuotta, pidempään kuin maalaaminen. Teos on yhä '
            + 'samassa seinässä, ja sitä katsotaan vartin vuoroissa '
            + 'kuivatussa ilmassa, muutama kymmenen ihmistä kerrallaan. '
            + 'Hauras alkuperäinen voittaa silti kaikki kopiot.',
          selite: 'Leonardon Viimeinen ehtoollinen Santa Maria delle '
            + 'Grazien luostarin seinällä Milanossa.',
          lahde: 'Leonardo da Vinci, Wikimedia Commons (PD)',
          wiki: 'Viimeinen ehtoollinen (Leonardo)',
        },
        {
          otsikko: 'Venus nousi merestä Firenzessä',
          tiedosto: 'Sandro Botticelli - La nascita di Venere - Google Art Project - edited.jpg',
          teksti: 'Sandro Botticellin Venus nousee merestä '
            + 'simpukankuoressa, ja tuulet puhaltavat sen rantaan '
            + 'ruusujen sateessa. Maalaus syntyi 1480-luvun Firenzessä '
            + 'Medici-suvun tilauksesta, ja se oli rohkea teko: '
            + 'ensimmäisiä suuria maalauksia vuosisatoihin, joiden aihe '
            + 'ei ollut Raamatusta vaan antiikin tarustosta. '
            + 'Vuosisatoja myöhemmin siitä on tullut yksi maailman '
            + 'tunnistetuimmista kuvista — Venus katsoo ohi, kuin ei '
            + 'huomaisi koko mainetta.',
          selite: 'Venuksen syntymä (n. 1485) Uffizin galleriassa '
            + 'Firenzessä.',
          lahde: 'Sandro Botticelli, Wikimedia Commons (PD)',
          wiki: 'Venuksen syntymä',
        },
        {
          otsikko: 'Caravaggio maalasi valonheittimellä',
          tiedosto: 'The Calling of Saint Matthew-Caravaggo (1599-1600).jpg',
          teksti: 'Caravaggio toi 1600-luvun alussa maalaukseen '
            + 'pimeyden ja valokiilan: hänen kuvissaan tavalliset '
            + 'ihmiset likaisine jalkoineen astuvat esiin mustasta '
            + 'taustasta kuin näyttämölle. Kirkonmiehet närkästyivät, '
            + 'kun pyhimyksillä oli kadunkulmien kasvot, mutta tyyli '
            + 'muutti koko eurooppalaisen taiteen suunnan. Mies itse '
            + 'eli kuin seikkailuromaanin konna: riitoja, pakomatkoja '
            + 'ja varhainen kuolema epäselvissä oloissa. Rooman '
            + 'kirkoissa hänen teoksiaan voi yhä katsoa ilmaiseksi — '
            + 'kolikolla valot syttyvät.',
          selite: 'Matteuksen kutsuminen (1599–1600) San Luigi dei '
            + 'Francesin kirkossa Roomassa: valokiila osoittaa '
            + 'tullimiehen pöytään.',
          lahde: 'Caravaggio, Wikimedia Commons (PD)',
          wiki: 'Caravaggio',
        },
      ],
    },
    {
      id: 'luonto',
      nimi: 'Luonto',
      johdanto: 'Saappaan sisään mahtuu kolme toimivaa tulivuorta, '
        + 'Alppien kiviseinämä ja kukkuloita, jotka näyttävät '
        + 'maalatuilta.',
      nostot: [
        {
          otsikko: 'Etna ei nuku koskaan',
          tiedosto: 'Etna eruption seen from the International Space Station.jpg',
          teksti: 'Sisilian Etna on Euroopan korkein ja ahkerin '
            + 'tulivuori: se purkautuu lähes joka vuosi, ja tuhkavana '
            + 'näkyy avaruudesta asti. Purkaukset ovat harvoin '
            + 'vaarallisia — laava valuu hitaasti ja ennustettavasti — '
            + 'ja rinteiden tuhkamaa on niin ravinteikasta, että sillä '
            + 'kasvatetaan viiniä, appelsiineja ja pistaaseja. '
            + 'Paikalliset elävät tulivuorensa kanssa kuin ison '
            + 'eläimen: sitä kunnioitetaan, kuunnellaan ja kiitetään '
            + 'sadosta.',
          selite: 'Etnan purkaus kansainväliseltä avaruusasemalta '
            + 'kuvattuna: tuhkapatsas nousee Sisilian ylle.',
          lahde: 'NASA, Wikimedia Commons (PD)',
          wiki: 'Etna',
        },
        {
          otsikko: 'Dolomiitit olivat merenpohjaa',
          tiedosto: 'Tre Cime di Lavaredo.jpg',
          teksti: 'Dolomiittien vaaleat kalkkikivitornit hehkuvat '
            + 'auringonlaskussa vaaleanpunaisina — ilmiöllä on oma '
            + 'nimikin, enrosadira. Vuoristo oli kerran trooppisen '
            + 'meren pohjaa: sen kivi syntyi koralliriutoista, ja '
            + 'huippujen kerroksissa on simpukoiden jälkiä kolmen '
            + 'kilometrin korkeudessa. Tre Cime di Lavaredon kolme '
            + 'tornia ovat vuoriston tunnus, ja niiden ympäri kävelee '
            + 'puolessa päivässä. Unesco liitti Dolomiitit '
            + 'maailmanperintöluetteloon 2009.',
          selite: 'Tre Cime di Lavaredon kolme kalkkikivitornia '
            + 'Dolomiiteilla.',
          lahde: 'Andremere, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Dolomiitit',
        },
        {
          otsikko: 'Toscanan maisema on tehty käsin',
          tiedosto: "I cipressi della Val D'Orcia.jpg",
          teksti: 'Val d\'Orcian aaltoilevat kukkulat sypressiriveineen '
            + 'näyttävät maalaukselta, ja tavallaan ne ovatkin: maisema '
            + 'on viljelty samaan asuun jo renessanssin aikana, ja '
            + 'aikakauden maalarit ottivat siitä mallin taulujensa '
            + 'taustoihin. Sypressit istutettiin teiden varsille '
            + 'opasteiksi ja tuulensuojaksi; vehnä ja viini '
            + 'vuorottelevat rinteillä. Koko laakso on Unescon '
            + 'maailmanperintökohde — ei koskemattomana luontona, vaan '
            + 'siksi että ihminen ja maisema muovasivat toisiaan '
            + 'satojen vuosien ajan.',
          selite: 'Sypressirivi Val d\'Orcian kukkuloilla Toscanassa.',
          lahde: 'Carlo cattaneo fotografie, Wikimedia Commons '
            + '(CC BY-SA 4.0)',
          wiki: 'Val d\'Orcia',
        },
        {
          otsikko: 'Alppikauris pelastui viime hetkellä',
          tiedosto: 'Stambecchi nel Parco Nazionale del Gran Paradiso.jpg',
          teksti: '1800-luvun puolivälissä alppikauriita oli jäljellä '
            + 'alle sata, kaikki yhdessä laaksossa Gran Paradison '
            + 'vuorilla — muualta Alpeilta ne oli metsästetty loppuun. '
            + 'Italian kuningas rauhoitti viimeisen lauman omaksi '
            + 'metsästysmaakseen, ja tästä ristiriidasta alkoi '
            + 'pelastus: alueesta tuli 1922 Italian ensimmäinen '
            + 'kansallispuisto. Nykyään Alpeilla kiipeilee taas yli '
            + '50 000 kaurista, ja jokainen polveutuu Gran Paradison '
            + 'lauman eläimistä. Sarvekas kiipeilijä on nykyään '
            + 'puiston tunnuksessa.',
          selite: 'Alppikauriita Gran Paradison kansallispuistossa.',
          lahde: 'Luca Casale, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Alppikauris',
        },
      ],
    },
    {
      id: 'menovinkit',
      nimi: 'Menovinkit',
      johdanto: 'Italia on digitoinut sen, mihin museoissa on jono: Sikstuksen '
        + 'kappelin katon voi kääntää selaimessa, Leonardon muistikirjat '
        + 'aukeavat sivu kerrallaan ja Galilein kaukoputket ovat kuvattu joka '
        + 'puolelta.',
      lista: [
        {
          otsikko: 'Museot ja kierrokset',
          kohteet: [
            {
              nimi: 'Vatikaanin museot — 360 asteen kierrokset',
              tiedosto: 'Sistine Chapel ceiling 02 (brightened).jpg',
              teksti: 'Vatikaanin museot ovat tehneet salikohtaisia 360 asteen '
                + 'kierroksia, joissa näkymää käännellään hiirellä.',
              selite: 'Sikstuksen kappelin katto ja päätyseinä alhaalta '
                + 'kuvattuna: Michelangelon holvimaalaukset kaartuvat ylös ja '
                + 'päädyssä on Viimeinen tuomio.',
              lahde: 'Antoine Taveneaux, Wikimedia Commons (CC BY-SA 3.0)',
              linkki: 'https://www.museivaticani.va/content/museivaticani/en/collezioni/musei/tour-virtuali-elenco.html',
            },
            {
              nimi: 'Uffizi — verkkonäyttelyt',
              tiedosto: 'Ceiling of Uffizi Gallery.jpg',
              teksti: 'Uffizi rakentaa verkkoon omia näyttelyitään, jotka kootaan '
                + 'yhden aiheen ympärille ja jotka pysyvät auki senkin '
                + 'jälkeen, kun museon oma näyttely on purettu.',
              selite: 'Uffizin käytävän maalattu katto: valkoiselle pohjalle '
                + 'maalattuja köynnöksiä, lintuja, vaakunoita ja pieniä '
                + 'maisemakuvia kultakehysten välissä.',
              lahde: 'Livioandronico2013, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://www.uffizi.it/en/online-exhibitions',
            },
            {
              nimi: 'Pompeii Sites — kaivauksen viralliset sivut',
              tiedosto: 'North Wall of Cubiculum 20 in House of Neptune Pompeii VI 5,3.jpg',
              teksti: 'Pompejin kaivausalueen oma sivusto kertoo, mitä '
                + 'kaupungista on juuri nyt kaivettu esiin.',
              selite: 'Väripainos pompejilaisen huoneen seinästä: punaisia ja '
                + 'oransseja kenttiä, valkoisia pilareita, köynnöksiä ja '
                + 'pieni maalaus keskellä.',
              lahde: 'Vittorio Steeger, Wikimedia Commons (public domain)',
              linkki: 'https://pompeiisites.org/en/',
            },
          ],
        },
        {
          otsikko: 'Käsikirjoitukset ja tiede',
          kohteet: [
            {
              nimi: 'DigiVatLib — Vatikaanin kirjaston käsikirjoitukset',
              tiedosto: 'Vaticana, Vat. lat. 3868 (2r).jpg',
              teksti: 'Vatikaanin apostolinen kirjasto on yksi maailman '
                + 'vanhimmista kirjastoista, ja sen käsikirjoituksia ei '
                + 'lainata. Sen sijaan niitä on kuvattu tuhansia sivu '
                + 'kerrallaan, ja kuvat ovat kenen tahansa katsottavissa.',
              selite: 'Käsikirjoituksen kuvitussivu: kaksi naamioitua näyttelijää '
                + 'kannattelee muotokuvamitalia jalustan päällä, yläreunassa '
                + 'lukee TERENTI.',
              lahde: 'Wikimedia Commons (public domain)',
              linkki: 'https://digi.vatlib.it/',
            },
            {
              nimi: 'Leonardo Digitale — kaikki Leonardon muistikirjat',
              tiedosto: 'Leonardo da Vinci - Codex Atlanticus folio 309v.png',
              teksti: 'Leonardo da Vinci täytti muistikirjoja koko elämänsä: '
                + 'koneita, pyörteitä, kasveja, ostoslistoja ja '
                + 'muistiinpanoja, jotka hän kirjoitti peilikuvana oikealta '
                + 'vasemmalle.',
              selite: 'Leonardon luonnos: ympyrän sisään piirretty vinoruutuinen '
                + 'ristikko, alla tiheää peilikirjoitusta ruskealla '
                + 'musteella.',
              lahde: 'Leonardo da Vinci, Wikimedia Commons (public domain)',
              linkki: 'https://www.leonardodigitale.com/en/',
            },
            {
              nimi: 'Museo Galileo — tieteen kojeet verkossa',
              tiedosto: 'Galilei telescopes, Museo Galileo, Florence, Inv. 242, 2428, 224088.jpg',
              teksti: 'Museo Galileo Firenzessä säilyttää Galileo Galilein kahta '
                + 'säilynyttä kaukoputkea. Ne ovat puisia putkia, joissa on '
                + 'nahkapäällys — ei mitään sen kummempaa, ja silti niillä '
                + 'nähtiin ensimmäisenä Jupiterin kuut ja Kuun vuoret.',
              selite: 'Kaksi puista kaukoputkea vitriinissä vaakasuorassa; '
                + 'alempana näkyy koristeellinen kehys, jossa on Galilein '
                + 'objektiivilinssi.',
              lahde: 'Zde, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://www.museogalileo.it/en/',
            },
          ],
        },
      ],
    },
  ],

  /*
   * ESPANJA (lehtimaa 4, 6.8.2026). Lehtikaupunki on Madrid, mutta
   * sama maaosasto avautuu myös Barcelonassa ja Granadassa — siksi
   * nostot on valittu koko maasta eikä pääkaupungista: Altamira on
   * Kantabriassa, Mezquita Córdobassa, Teide Kanarialla.
   *
   * Viisi aihetta ohjeen vakiolistalta (docs/tutki-aiheet.md kohta 2).
   * Tehtävä on Luonto-aiheessa, ja sen vastaus on saman sivun
   * tekstissä.
   */
  ESP: [
    {
      id: 'historia',
      nimi: 'Historia',
      johdanto: 'Espanjan historia on kerroksia päällekkäin: '
        + 'jääkauden maalarit, roomalaiset insinöörit, kahdeksansataa '
        + 'vuotta arabiankielistä valtakuntaa ja tuhat vuotta '
        + 'pyhiinvaeltajia samalla tiellä.',
      nostot: [
        {
          otsikko: 'Luola, jota kukaan ei uskonut',
          aika: '1879',
          tiedosto: 'Panoramica altamira rep.jpg',
          teksti: 'Kun Marcelino Sanz de Sautuola vuonna 1879 kaivoi '
            + 'Altamiran luolassa Kantabriassa, hänen '
            + 'kahdeksanvuotias tyttärensä María kyllästyi ja lähti '
            + 'kierrelemään lyhty kädessä. Hän katsoi ylös ja huusi: '
            + '"Katso, isä, härkiä!" Katossa oli parikymmentä '
            + 'biisonia punaisella ja mustalla, ja isä ymmärsi ne '
            + 'jääkautisiksi. Tiedemiehet pitivät häntä väärentäjänä '
            + 'kaksikymmentä vuotta — maalaukset olivat heidän '
            + 'mielestään aivan liian taitavia kivikauden ihmiselle. '
            + 'Sautuola kuoli ennen kuin hänet uskottiin. Maalaukset '
            + 'ovat noin 15 000 vuotta vanhoja.',
          selite: 'Altamiran suuren katon biisonit. Kuva on '
            + 'täsmällisestä kopiosta: alkuperäinen luola suljettiin '
            + 'yleisöltä, koska kävijöiden hengitys kasvatti '
            + 'maalausten päälle hometta.',
          lahde: 'Pictures by User:MatthiasKabel , fusion by Nachosan, '
            + 'Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Altamira',
        },
        {
          otsikko: 'Vesijohto ilman laastia',
          aika: '1. vuosisata',
          tiedosto: 'Acueducto, Segovia, España, 2024-06-14, DD 19.jpg',
          teksti: 'Segovian akvedukti nousee kaupungin halki '
            + 'kahdessa kaarikerroksessa 28 metrin korkeuteen, ja '
            + 'sen 20 000 graniittilohkoa on ladottu paikoilleen '
            + 'ILMAN LAASTIA: kivet pysyvät pystyssä pelkällä painolla '
            + 'ja tarkalla muodolla. Roomalaiset rakensivat sen '
            + 'ensimmäisellä vuosisadalla tuomaan vettä 17 kilometrin '
            + 'päästä vuorilta. Vettä se toi 1900-luvulle asti — eli '
            + 'lähes kaksituhatta vuotta. Suurin uhka ei ollut aika '
            + 'vaan autojen pakokaasu, joka alkoi syödä kiveä 1970-'
            + 'luvulla; nyt liikenne on ohjattu muualle.',
          selite: 'Segovian akvedukti ylittää kaupungin. Korkeimmalla '
            + 'kohdalla kaaria on kaksi päällekkäin, matalalla yksi.',
          lahde: 'Diego Delso, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Segovian akvedukti',
        },
        {
          otsikko: 'Moskeija, jonka sisään rakennettiin katedraali',
          aika: '1236',
          tiedosto: 'Mezquita cordoba arcos flotantes.jpg',
          teksti: 'Córdoban Mezquitassa on 856 pylvästä ja niiden '
            + 'päällä kaksi kaarikerrosta punavalkoisin raidoin. '
            + 'Ratkaisu on käytännöllinen: pylväät olivat vanhoja '
            + 'roomalaisia ja liian lyhyitä, joten kaaret ladottiin '
            + 'päällekkäin korkeuden saamiseksi. Tuloksena on metsä, '
            + 'jonka läpi katse ei kanna. Kun Córdoba vallattiin '
            + '1236, moskeijaa ei purettu vaan sen keskelle '
            + 'rakennettiin katedraali — kaupunki pyysi kuningas '
            + 'Kaarle V:tä estämään työn, ja tämän kerrotaan '
            + 'katuneen lupaansa nähtyään lopputuloksen.',
          selite: 'Mezquita-Catedralin kaksikerroksiset kaaret. Ohuet '
            + 'pylväät saavat kaaret näyttämään kelluvilta.',
          lahde: 'Alvaro.vinuela.carnicero, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Córdoban suuri moskeija',
        },
        {
          otsikko: 'Suitsutusastia, joka lentää poikki kirkon',
          aika: '1000-luku',
          tiedosto: 'Schwenken der Botafumeiro (25812582595).jpg',
          teksti: 'Santiago de Compostelan katedraaliin on kävelty '
            + 'tuhat vuotta: Camino de Santiago on pyhiinvaellustie, '
            + 'jota kulkee yhä satojatuhansia ihmisiä vuodessa. '
            + 'Perillä odottaa botafumeiro, 53-kiloinen hopeoitu '
            + 'suitsutusastia, jota kahdeksan miestä heiluttaa '
            + 'köysillä poikki ristilaivan. Se kiihtyy lähes '
            + '70 kilometrin tuntinopeuteen ja nousee 21 metrin '
            + 'korkeuteen. Alkuperäinen syy oli arkinen: pitkän '
            + 'matkan kulkeneet pyhiinvaeltajat haisivat.',
          selite: 'Botafumeiro heilahtaa savuavana Santiagon '
            + 'katedraalin ristilaivan poikki. Köyttä vetää kahdeksan '
            + 'miestä, joita sanotaan nimellä tiraboleiros.',
          lahde: 'wolfgang.mller54 from Niedersachsen /Germany, '
            + 'Wikimedia Commons (CC BY 2.0)',
          wiki: 'Santiago de Compostelan pyhiinvaellus',
        },
      ],
    },
    {
      id: 'ruoka',
      nimi: 'Ruoka',
      johdanto: 'Espanjassa ruoka-aika on eri kuin muualla Euroopassa '
        + 'ja ruoan tahti eri kuin muualla maailmassa: pata kaadetaan '
        + 'pöytään kolmesti, sika syö kolme kuukautta pelkkiä '
        + 'tammenterhoja, ja vuosi vaihtuu kahdessatoista rypäleessä.',
      nostot: [
        {
          otsikko: 'Cocido kaadetaan pöytään kolmesti',
          tiedosto: 'Cocido madrileño.jpg',
          teksti: 'Cocido madrileño hautuu tuntikausia yhdessä padassa '
            + 'mutta syödään erissä. Ensin tulee liemi ohuine '
            + 'nuudeleineen, sitten kikherneet ja vihannekset ja '
            + 'viimeisenä lihat: naudanrintaa, kanaa, chorizoa ja '
            + 'verimakkaraa. Eriä sanotaan nimellä vuelco, kaato, ja '
            + 'perinteisin tapa on kaataa pata lautaselle kolmeen '
            + 'kertaan. Ruoka on talvista ja raskasta, ja Madridin '
            + 'vanhat ravintolat tarjoavat sitä vain tiettyinä '
            + 'viikonpäivinä.',
          selite: 'Cocido madrileño tarjoiltuna kahdessa erässä: '
            + 'edessä liemi, takana kikherneet, peruna, porkkana ja '
            + 'padan lihat. Kikherneet on liotettu edellisenä iltana '
            + 'koko yön.',
          lahde: 'Smnt, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Cocido',
        },
        {
          otsikko: 'Sika, joka syö vain tammenterhoja',
          // Yhdellä rivillä tahallaan: peilaustyökalu poimii tiedostonimet
          // lähdetekstistä hakukuviolla eikä osaa yhdistää katkaistua
          // merkkijonoa (ks. tools/peilaa-media.mjs kohteet).
          tiedosto: '051127 1126 Villalba de los Llanos - La Utrera - Encinas cerdos ibéricos T91 edited.JPG',
          teksti: 'Espanjan kalleimman kinkun salaisuus on kolme '
            + 'viimeistä kuukautta. Mustasorkkainen iberiansika '
            + 'päästetään lokakuussa dehesaan, harvaan '
            + 'tammimetsälaitumeen, ja se saa syödä siellä vain '
            + 'tammenterhoja ja ruohoa. Terhojen rasva imeytyy lihaan '
            + 'ja tekee siitä pehmeän ja pähkinäisen. Yksi sika '
            + 'tarvitsee useamman hehtaarin laidunta, ja kinkkua '
            + 'kuivataan sen jälkeen kolmesta neljään vuotta. Dehesa '
            + 'on ihmisen tekemä maisema, joka on säilynyt satoja '
            + 'vuosia juuri siksi, että se kannattaa.',
          selite: 'Iberiansikoja dehesassa Salamancan maakunnassa. '
            + 'Puut ovat rautatammia, joiden terhot ovat sikojen '
            + 'syysruokaa.',
          lahde: 'Juan Pablo Zumel Arranz, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Jamón ibérico',
        },
        {
          otsikko: 'Oikeassa paellassa ei ole kalaa',
          tiedosto: '01 Paella Valenciana original.jpg',
          teksti: 'Paella on Valencian riisipeltojen ruokaa, ja '
            + 'alkuperäinen valencialainen paella tehdään siitä, mitä '
            + 'pellon laidalta sai: kanaa, kaniinia, leveää '
            + 'vihreää papua ja joskus etanoita. Merenelävät ovat '
            + 'myöhempi, rannikon versio — valencialaiselle '
            + 'chorizopaella on loukkaus, josta on kirjoitettu '
            + 'sanomalehtiin asti. Ruoka syötiin suoraan pannusta '
            + 'puulusikoilla, jokainen omalta sektoriltaan, ja '
            + 'parasta on socarrat: pohjaan paahtunut rapea riisi.',
          selite: 'Valencialainen paella pannussaan: kanaa, kaniinia '
            + 'ja leveää papua. Pannu on matala ja leveä, jotta riisi '
            + 'jää yhteen kerrokseen.',
          lahde: 'Jan Harenburg, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Paella',
        },
        {
          otsikko: 'Kaksitoista rypälettä kellonlyönnillä',
          tiedosto: 'Ensayo general ....las doce campanadas del ilustre y solemne reloj de la Puerta del Sol !!!.jpg',
          teksti: 'Uudenvuodenyönä espanjalaiset syövät kaksitoista '
            + 'rypälettä, yhden jokaisella kellonlyönnillä. Kello on '
            + 'Madridin Puerta del Solin vanhan postitalon tornissa, '
            + 'ja lyönnit tulevat parin sekunnin välein — koko urakka '
            + 'on ohi puolessa minuutissa, ja suu on täynnä. Tapa '
            + 'levisi koko maahan vuoden 1909 jälkeen, kun Alicanten '
            + 'viininviljelijöillä oli poikkeuksellisen suuri sato '
            + 'myytävänä. Nykyään rypäleitä myydään purkeissa '
            + 'valmiiksi kuorittuina ja siemenettöminä.',
          selite: 'Puerta del Sol 30. joulukuuta: aukiolla '
            + 'harjoitellaan uudenvuodenyötä etukäteen, ja tuhannet '
            + 'ihmiset syövät rypäleensä vuorokautta liian '
            + 'aikaisin. Taustalla valaistuna Real Casa de '
            + 'Correosin kellotorni.',
          lahde: 'jacinta lluch valero from madrid * barcelona...., '
            + '(España-Spain), Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Puerta del Sol',
        },
      ],
    },
    {
      id: 'kuvataide',
      nimi: 'Kuvataide',
      johdanto: 'Espanjan maalaustaide on tehnyt kaksi asiaa '
        + 'paremmin kuin kukaan: katsonut valtaa suoraan silmiin ja '
        + 'kieltäytynyt kaunistelemasta sitä, mitä näkee.',
      nostot: [
        {
          otsikko: 'Taulu, jossa katsoja on mallina',
          tiedosto: 'Las Meninas 01.jpg',
          teksti: 'Diego Velázquez maalasi 1656 taulun, jossa hän '
            + 'seisoo itse vasemmalla valtavan kankaan takana ja '
            + 'katsoo ulos kuvasta. Keskellä on viisivuotias '
            + 'infanta Margarita hovinaisineen. Mutta ketä maalari '
            + 'oikeastaan maalaa? Takaseinän peilistä näkyvät '
            + 'kuningas ja kuningatar — he seisovat siinä, missä '
            + 'katsoja seisoo. Taulu kääntää katseen ympäri: se '
            + 'katsoo sinua takaisin ja panee sinut mallin paikalle. '
            + 'Pradossa se on oma huoneensa, ja sen edessä seisotaan '
            + 'joka päivä jonossa.',
          selite: 'Las Meninas (1656). Velázquez itse vasemmalla, '
            + 'infanta Margarita keskellä ja peilissä takana '
            + 'kuningaspari.',
          lahde: 'Diego Velázquez, Wikimedia Commons (Public domain)',
          wiki: 'Las Meninas',
        },
        {
          otsikko: 'Yö, jota Goya ei kaunistellut',
          tiedosto: 'El tres de mayo de 1808 en Madrid.jpg',
          teksti: 'Toukokuun 2. päivänä 1808 madridilaiset nousivat '
            + 'kapinaan Napoleonin joukkoja vastaan. Seuraavana yönä '
            + 'kapinalliset teloitettiin kaupungin laidalla. Goya '
            + 'maalasi tapahtuman kuusi vuotta myöhemmin, ja hän '
            + 'teki jotain, mitä sotataiteessa ei ollut ennen tehty: '
            + 'sankari ei ole ratsain eikä komea, vaan valkopaitainen '
            + 'mies polvillaan kädet levällään, kasvot kauhusta '
            + 'vääntyneinä. Ampujilla ei näy kasvoja lainkaan. '
            + 'Maalauksesta tuli malli lähes kaikelle sotaa '
            + 'kuvaavalle taiteelle sen jälkeen.',
          selite: 'Kolmas päivä toukokuuta 1808 (1814). Lyhty maassa '
            + 'valaisee vain uhrit; ampujat jäävät varjoon ja '
            + 'selin.',
          lahde: 'Francisco Goya, Wikimedia Commons (Public domain)',
          wiki: 'Kolmas päivä toukokuuta 1808',
        },
        {
          otsikko: 'Kreikkalainen, joka maalasi Toledossa',
          tiedosto: 'Entierro del Conde de Orgaz.jpg',
          teksti: 'Doménikos Theotokópoulos syntyi Kreetalla, '
            + 'opiskeli Venetsiassa ja päätyi Toledoon, jossa häntä '
            + 'sanottiin yksinkertaisesti El Grecoksi, kreikkalaiseksi. '
            + 'Hänen hahmonsa venyvät pitkiksi ja värit hehkuvat '
            + 'kylmästi — aikalaiset pitivät sitä outona, ja '
            + 'vuosisatoja myöhemmin siitä tuli syy pitää häntä '
            + 'nykytaiteen esi-isänä. Orgazin kreivin hautaus on yhä '
            + 'siinä kirkossa, jota varten se maalattiin 1586: '
            + 'alaosassa Toledon herrat mustissa kauluksissaan, '
            + 'yläosassa taivas.',
          selite: 'Orgazin kreivin hautaus (1586) Santo Toméssa '
            + 'Toledossa. Alhaalla maa ja muotokuvat, ylhäällä '
            + 'taivas — kaksi maailmaa samassa kankaassa.',
          lahde: 'El Greco, Wikimedia Commons (Public domain)',
          wiki: 'El Greco',
        },
        {
          otsikko: 'Kirkko, jota on rakennettu yli sata vuotta',
          tiedosto: 'Sagrada Família. Interior nau.jpg',
          teksti: 'Antoni Gaudí otti Sagrada Famílian työn '
            + 'vastaan 1883 ja teki sitä kuolemaansa asti — '
            + 'viimeiset vuodet hän asui työmaalla. Sisällä pylväät '
            + 'haarautuvat kuin puut, koska ne ovat puita: Gaudí '
            + 'sanoi metsän olevan paras rakennus, ja haarautuva '
            + 'pylväs kantaa katon painon ilman tukikaaria. Muodot '
            + 'hän laski riippuvilla naruilla ja painoilla, ja '
            + 'katsoi mallia peilistä ylösalaisin. Rakennus '
            + 'valmistuu aikaisintaan 2030-luvulla, eli työtä on '
            + 'kestänyt yli 140 vuotta.',
          selite: 'Sagrada Famílian pääsalin pylväät haarautuvat '
            + 'latvoistaan. Värit tulevat lasimaalauksista: itäpuoli '
            + 'sinivihreä aamu, länsipuoli punakeltainen ilta.',
          lahde: 'Sagrada Família (oficial), Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Sagrada Família',
        },
      ],
    },
    {
      id: 'musiikki',
      nimi: 'Musiikki',
      johdanto: 'Espanjan äänessä on kitara — soitin, joka sai '
        + 'nykymuotonsa espanjalaisen puusepän verstaassa ja jonka '
        + 'ympärille syntyi sekä flamenco että konserttisalien '
        + 'kuuluisin espanjalainen sävellys.',
      nostot: [
        {
          otsikko: 'Flamencossa kello lyö kahtatoista',
          tiedosto: 'Viernes Flamen Jerez 5 agosto 2016 Familia Sordera P1050567.jpg',
          teksti: 'Flamenco syntyi Andalusiassa romanien, '
            + 'andalusialaisten ja Pohjois-Afrikan perinteiden '
            + 'sekoituksesta. Sen ydin ei ole melodia vaan compás, '
            + 'tahtikuvio: tavallisin on kahdentoista iskun kierto, '
            + 'jossa painot osuvat epätasaisiin kohtiin. Siksi '
            + 'käsientaputus, palmas, on oma taitonsa eikä pelkkää '
            + 'säestystä. Paco de Lucía toi flamencokitaraan '
            + 'jazzin harmoniat ja cajón-rummun 1970-luvulla; '
            + 'perinteen vartijat suuttuivat, ja lopputuloksesta '
            + 'tuli uusi perinne.',
          selite: 'Flamencoilta Jerez de la Fronterassa: bailaora '
            + 'tanssii, ja takana istuvat laulaja, kitaristi ja '
            + 'taputtajat.',
          lahde: 'El Pantera, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Flamenco',
          musiikki: 'https://music.apple.com/fi/album/entre-dos-aguas/1451208136?i=1451208220',
          musiikkiNimi: 'Paco de Lucía Apple Musicissa',
          // Tekstin mainitseman uudistajan tunnetuin kappale.
          esikuuntelu: 'Paco de Lucía Entre dos aguas',
        },
        {
          otsikko: 'Puutarha, jota säveltäjä ei nähnyt',
          tiedosto: 'Palacio Real de Aranjuez - 130921 115527.jpg',
          teksti: 'Joaquín Rodrigo sokeutui kolmivuotiaana '
            + 'kurkkumädän jälkitautiin. Hän sävelsi koko elämänsä '
            + 'pistekirjoituksella ja saneli nuotit kopistille. '
            + 'Vuonna 1939 hän kirjoitti Concierto de Aranjuezin, '
            + 'kitarakonserton, jonka aiheena ovat Aranjuezin '
            + 'kuninkaalliset puutarhat Madridin eteläpuolella — '
            + 'paikka, jota hän ei ollut koskaan nähnyt. Hitaan osan '
            + 'englannintorvimelodiasta tuli maailman soitetuin '
            + 'espanjalainen sävelmä. Rodrigo kertoi myöhemmin sen '
            + 'kertovan surusta: pariskunnan menettämästä '
            + 'esikoisesta.',
          selite: 'Aranjuezin kuninkaallinen palatsi ja Tajo-joen '
            + 'pato sen edustalla. Puutarhat ovat Espanjan vanhimpia '
            + 'ja niissä kasvaa puita neljältä mantereelta.',
          lahde: 'Barcex, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Concierto de Aranjuez',
          musiikki: 'https://music.apple.com/fi/album/concierto-de-aranjuez-adagio/696551481?i=696551486',
          musiikkiNimi: 'Concierto de Aranjuez Apple Musicissa',
          // Juuri se hidas osa, josta teksti kertoo.
          esikuuntelu: 'Rodrigo Concierto de Aranjuez Adagio',
        },
        {
          otsikko: 'Puuseppä, joka keksi nykyisen kitaran',
          tiedosto: "Guitarra d'Antonio de Torres, MDMB 626, al Museu de la Música de Barcelona.jpg",
          teksti: 'Ennen 1850-lukua kitara oli pieni ja hiljainen, '
            + 'kotisoitin salonkiin. Almerialainen puuseppä Antonio '
            + 'de Torres suurensi kaikukopan, ohensi kannen ja '
            + 'kehitti sen alle viuhkamaisen rimatuen, joka jakaa '
            + 'värähtelyn koko kannelle. Ääni kasvoi niin paljon, '
            + 'että kitara kelpasi konserttisaliin. Todistaakseen, '
            + 'että ääni tulee kannesta eikä kalliista kyljistä, '
            + 'Torres rakensi kerran kitaran, jonka kyljet ja pohja '
            + 'olivat pahvia — ja se soi. Kaikki nykyiset '
            + 'klassiset ja flamencokitarat noudattavat hänen '
            + 'mittojaan.',
          selite: 'Antonio de Torresin rakentama kitara Barcelonan '
            + 'musiikkimuseossa. Muoto on se, jonka kuka tahansa '
            + 'tunnistaa kitaraksi — ja se on tämän miehen käsialaa.',
          lahde: 'sguastevi, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Antonio de Torres Jurado',
        },
        {
          otsikko: 'Viikko, jolloin Sevilla pukeutuu',
          tiedosto: '17401536242 8583de996d o feria de abril 2012.jpg',
          teksti: 'Sevillan huhtikuun feria on viikon mittainen '
            + 'juhla, jota varten kaupungin laitaan pystytetään '
            + 'tuhat juhlatelttaa omine katuineen ja lyhtyineen. '
            + 'Siellä tanssitaan sevillanoja: neljä lyhyttä osaa, '
            + 'joilla on kiinteät askeleet, joten kuka tahansa '
            + 'espanjalainen osaa tanssia ne kenen tahansa kanssa. '
            + 'Sevillanat eivät ole flamencoa vaan kansantanssia — '
            + 'ero on sama kuin oopperan ja yhteislaulun. Naisten '
            + 'traje de gitana on ainoa espanjalainen kansanpuku, '
            + 'jonka muoti muuttuu joka vuosi.',
          selite: 'Sevillan huhtikuun feria: naiset traje de gitana '
            + '-puvuissaan, hiuksissa iso kukka. Puvun kuosi ja '
            + 'röyhelöiden määrä vaihtuvat vuosittain.',
          lahde: 'Sandra Vallaure, Wikimedia Commons (CC BY 2.0)',
          wiki: 'Feria de Abril',
        },
      ],
    },
    {
      id: 'luonto',
      nimi: 'Luonto',
      johdanto: 'Espanja on Euroopan toiseksi vuoristoisin maa, ja '
        + 'sen luonto on siksi Euroopan kirjavin: kosteikko, jonka '
        + 'läpi kulkee koko Länsi-Euroopan muuttolinnusto, kissa, '
        + 'jota oli jäljellä sata, ja vuori, joka on Atlantilla.',
      tehtava: {
        kysymys: 'Kuinka monta ilvestä Espanjassa oli jäljellä, kun '
          + 'lajia alettiin pelastaa?',
        vaihtoehdot: ['Noin sata', 'Noin tuhat', 'Noin kymmenentuhatta'],
        oikea: 0,
        fakta: 'Vuonna 2002 iberianilveksiä laskettiin alle sata. Nyt '
          + 'niitä on yli kaksituhatta — vastaus löytyi '
          + 'ilvesnostosta.',
      },
      nostot: [
        {
          otsikko: 'Kosteikko, jossa Eurooppa vaihtaa mannerta',
          tiedosto: 'Marismas de Doñana.jpg',
          teksti: 'Doñana on Guadalquivirin suistoon jäänyt '
            + 'matala kosteikko Andalusian rannikolla, ja se on '
            + 'Länsi-Euroopan muuttolintujen tärkein levähdyspaikka: '
            + 'täällä sadattuhannet linnut lepäävät ja syövät ennen '
            + 'Saharan ylitystä tai sen jälkeen. Talvella '
            + 'vesilintuja voi olla yhtä aikaa yli puoli miljoonaa. '
            + 'Alue on samalla varoitus: pohjaveden pumppaus '
            + 'marjapelloille ja kuivat vuodet ovat kutistaneet '
            + 'lammikoita niin, että osa niistä ei enää täyty '
            + 'joka vuosi.',
          selite: 'Doñanan marisma keväällä. Vesi on matalaa ja '
            + 'lämmintä, ja pohjan pieneliöstö ruokkii koko '
            + 'lintuparven.',
          lahde: 'Dvazquezq, Wikimedia Commons (CC BY-SA 3.0 es)',
          wiki: 'Doñanan kansallispuisto',
        },
        {
          otsikko: 'Kissa, joka melkein hävisi',
          tiedosto: 'Lince ibérico (Lynx pardinus), Almuradiel, Ciudad Real, España, 2021-12-19, DD 07.jpg',
          teksti: 'Iberianilves syö melkein pelkkiä kaneja, ja kun '
            + 'kanitauti kaatoi saaliskannan 1900-luvun lopulla, '
            + 'ilves seurasi perässä. Vuonna 2002 niitä laskettiin '
            + 'koko maailmassa alle sata yksilöä — se oli maailman '
            + 'uhanalaisin kissaeläin. Pelastus tehtiin kolmella '
            + 'asialla: kanikantoja hoidettiin, ilveksiä kasvatettiin '
            + 'tarhoissa ja päästettiin luontoon, ja teille '
            + 'rakennettiin alikulkuja. Nyt niitä on yli '
            + 'kaksituhatta, ja laji siirrettiin luokasta '
            + '"äärimmäisen uhanalainen" luokkaan "vaarantunut".',
          selite: 'Iberianilves Ciudad Realissa. Tunnistaa '
            + 'poskiparrasta, korvatupsuista ja lyhyestä '
            + 'töpöhännästä.',
          lahde: 'Diego Delso, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Iberianilves',
        },
        {
          otsikko: 'Espanjan korkein vuori on Afrikan edustalla',
          tiedosto: 'Teide qtl1.jpg',
          teksti: 'Espanjan korkein kohta ei ole Pyreneillä vaan '
            + 'Teneriffalla: Teide nousee 3 715 metriin, ja '
            + 'merenpohjasta mitattuna se on yli seitsemän '
            + 'kilometriä korkea eli maailman kolmanneksi korkein '
            + 'tulivuorirakennelma. Huipun ympärillä on Las Cañadasin '
            + 'kraatterilaakso, jonka kivikko muistuttaa niin paljon '
            + 'Marsia, että Euroopan avaruusjärjestö on koekäyttänyt '
            + 'siellä mönkijöitään. Vuori purkautui viimeksi 1909. '
            + 'Kanariansaaret ovat maantieteellisesti Afrikkaa, '
            + 'sata kilometriä Marokon rannikolta.',
          selite: 'Teide lumihuippuisena Las Cañadasin laavakentän '
            + 'takaa. Etualan mustat kivet ovat vanhaa laavavirtaa.',
          lahde: 'Quartl, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Teide',
        },
        {
          otsikko: 'Puolet maailman oliiviöljystä',
          tiedosto: 'Olivos-Martos.jpg',
          teksti: 'Espanja tuottaa noin puolet koko maailman '
            + 'oliiviöljystä, ja siitä valtaosa tulee yhdestä '
            + 'maakunnasta: Jaénissa kasvaa yli 60 miljoonaa '
            + 'oliivipuuta niin tasaisin rivein, että maisema '
            + 'näyttää lentokoneesta ruudukolta. Sato korjataan '
            + 'talvella ravistamalla puita koneella, ja hedelmät '
            + 'puristetaan öljyksi saman vuorokauden aikana — '
            + 'nopeus ratkaisee maun. Oliivipuu elää satoja vuosia '
            + 'ja kestää kuivuutta paremmin kuin melkein mikään '
            + 'muu viljelykasvi, mikä on yhä tärkeämpää.',
          selite: 'Oliivilehto Martosissa Jaénin maakunnassa. Puut '
            + 'on istutettu riveihin, jotta koneet mahtuvat väliin '
            + 'sadonkorjuussa.',
          lahde: 'Alifates, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Oliiviöljy',
        },
      ],
    },
    {
      id: 'menovinkit',
      nimi: 'Menovinkit',
      johdanto: 'Espanjan museot ovat vieneet kokoelmansa verkkoon: Pyreneiden '
        + 'kirkkojen maalaukset, iberialainen kivikasvo, Mirón värit ja Don '
        + 'Quijoten ensipainos aukeavat kaikki ilman lippujonoa.',
      lista: [
        {
          otsikko: 'Museot ja taide',
          kohteet: [
            {
              nimi: 'Museo Arqueológico Nacional — kokoelmat verkossa',
              tiedosto: 'Museo Arqueológico Nacional - 26207 - Dama de Elche 01.jpg',
              teksti: 'Elchen daami on kalkkikivestä veistetty naisen rintakuva, '
                + 'jonka iberialainen kuvanveistäjä teki yli kaksituhatta '
                + 'vuotta sitten.',
              selite: 'Lähikuva kivestä veistetyistä kasvoista: sileät posket, '
                + 'hillityt kasvonpiirteet ja korvien kohdalla suuret '
                + 'pyörylät, joissa on hienoa koristelua.',
              lahde: 'Ángel Martínez Levas, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://www.man.es/man/en/home.html',
            },
            {
              nimi: 'MNAC — Katalonian kansallinen taidemuseo',
              tiedosto: 'Meister aus Tahull 001.jpg',
              teksti: 'Pyreneiden vuoristokylissä on pieniä kivikirkkoja, joiden '
                + 'seinät maalattiin täyteen 1100-luvulla. Kun kävi ilmi, '
                + 'että maalaukset olivat katoamassa, ne irrotettiin '
                + '1920-luvulla seinistä ja siirrettiin Barcelonaan.',
              selite: 'Kirkon puolikupolin maalaus: Kristus istuu soikean '
                + 'sädekehän sisällä kirja kädessään, ympärillä siivekkäitä '
                + 'hahmoja ja alarivissä pyhimyksiä.',
              lahde: 'Taüllin mestari, Wikimedia Commons (public domain)',
              linkki: 'https://www.museunacional.cat/en',
            },
            {
              nimi: 'Museo Thyssen-Bornemisza — kokoelma aikajanana',
              tiedosto: 'Museo Thyssen-Bornemisza (Madrid) 03.jpg',
              teksti: 'Thyssen-Bornemiszan suku keräsi maalauksia kahdessa '
                + 'polvessa, ja kokoelmasta tuli niin laaja, että Espanjan '
                + 'valtio osti sen vuonna 1993.',
              selite: 'Punatiilinen palatsi Madridin kadun varrella; julkisivulla '
                + 'riippuu suuria näyttelybannereita, joissa on muotokuvia.',
              lahde: 'Adal-Honduras, Wikimedia Commons (CC BY 2.0)',
              linkki: 'https://www.museothyssen.org/en',
            },
            {
              nimi: 'Fundació Joan Miró — Mirón oma säätiö',
              tiedosto: 'Joan Miro - Dona i ocell (1).jpg',
              teksti: 'Joan Miró maalasi kirkkailla väreillä muotoja, jotka '
                + 'näyttävät yksinkertaisilta mutta joita ei osaa piirtää '
                + 'perässä.',
              selite: 'Korkea betonitorni puistossa: pinta on peitetty punaisin, '
                + 'sinisin ja keltaisin laatoin, ja huipulla on keltainen '
                + 'puolikuun muotoinen kappale.',
              lahde: 'PierreSelim, Wikimedia Commons (CC BY 3.0)',
              linkki: 'https://www.fmirobcn.org/en/',
            },
          ],
        },
        {
          otsikko: 'Rakennukset ja kirjat',
          kohteet: [
            {
              nimi: 'Alhambra — palatsin viralliset sivut',
              tiedosto: 'Pavillon Cour des Lions Alhambra Granada Spain.jpg',
              teksti: 'Granadan Alhambra rakennettiin 1300-luvulla, kun kaupunki '
                + 'oli vielä musliminhallitsijoiden pääkaupunki.',
              selite: 'Alhambran sisäpihan paviljonki: tiilikatto, '
                + 'kipsikoristeltu julkisivu ja rivi ohuita marmoripylväitä, '
                + 'jotka kannattelevat kaarikäytävää.',
              lahde: 'Jebulon, Wikimedia Commons (CC0)',
              linkki: 'https://www.alhambra-patronato.es/',
            },
            {
              nimi: 'Biblioteca Virtual Cervantes — espanjankielinen kirjallisuus',
              tiedosto: 'Title page first edition Don Quijote.jpg',
              teksti: 'Biblioteca Virtual Miguel de Cervantes on espanjankielisen '
                + 'kirjallisuuden ilmainen verkkokirjasto.',
              selite: 'Vuoden 1605 nimiölehti: isoilla kirjaimilla EL INGENIOSO '
                + 'HIDALGO DON QVIXOTE DE LA MANCHA, alla kirjapainon '
                + 'vaakunamerkki ja vuosiluku 1605.',
              lahde: 'Juan de la Cuesta, Wikimedia Commons (public domain)',
              linkki: 'https://www.cervantesvirtual.com/',
            },
          ],
        },
      ],
    },
  ],
  /*
   * Ruotsi (v315), lehtikaupunkina Tukholma. Viisi vakioaihetta;
   * musiikki jää pois, koska ABBA kantaa sen kaupungin kannessa.
   */
  SWE: [
    {
      id: 'historia',
      nimi: 'Historia',
      johdanto: 'Ruotsin historia kulkee viikinkien hopeasta Itämeren '
        + 'suurvallaksi ja siitä maaksi, joka ei ole ollut sodassa '
        + 'kahteensataan vuoteen.',
      nostot: [
        {
          otsikko: 'Laiva, joka kaatui tuhannen metrin jälkeen',
          aika: '1628',
          tiedosto: 'Lateral view of the Vasa ship, Vasa Museum, Stockholm, Sweden julesvernex2.jpg',
          teksti: 'Sotalaiva Vasa lähti neitsytmatkalleen Tukholman '
            + 'satamasta 10. elokuuta 1628. Se ehti purjehtia noin '
            + 'tuhat kolmesataa metriä, kun tuulenpuuska kallisti sen '
            + 'niin, että vesi syöksyi sisään avoimista tykkiluukuista. '
            + 'Kuningas oli vaatinut kaksi tykkikantta, eikä kapea runko '
            + 'kantanut niiden painoa. Itämeren vähäsuolaisessa vedessä '
            + 'ei elä laivamato, joka syö puun muissa merissä — siksi '
            + 'laiva säilyi mudassa. Vasa nostettiin 1961, ja siitä on '
            + 'alkuperäistä puuta yli 95 prosenttia.',
          selite: 'Vasan kylki Vasa-museossa. Neliönmuotoiset aukot ovat '
            + 'tykkiluukkuja: juuri niistä vesi pääsi sisään.',
          lahde: 'Jules Verne Times Two, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Vasa (laiva)',
        },
        {
          otsikko: 'Taivaalla paloi kuusi aurinkoa',
          aika: '1535',
          tiedosto: 'Vädersolstavlan 1535.jpg',
          teksti: 'Huhtikuun 20. päivänä 1535 tukholmalaiset näkivät '
            + 'aamutaivaalla valkoisia renkaita ja niiden kehällä useita '
            + 'hehkuvia auringonkuvia. Kyse oli halosta: ilmassa '
            + 'leijuvat jääkiteet taittavat auringonvaloa kuin '
            + 'lasiprismat. Näky pelotti, ja pappi Olaus Petri teetti '
            + 'siitä maalauksen. Samalla syntyi vanhin tunnettu värikuva '
            + 'Tukholmasta: kaupunki muureineen, kirkontorneineen ja '
            + 'ympäröivine hirsiaitoineen. Alkuperäinen taulu on '
            + 'kadonnut — Storkyrkanissa riippuu vuoden 1636 kopio.',
          selite: 'Vädersolstavlan: sivuaurinkojen renkaat 1535 ja niiden '
            + 'alla keskiaikainen Tukholma. Kuvan kaupunki mahtuisi '
            + 'nykyiseen Gamla staniin.',
          lahde: 'Urban målare, Wikimedia Commons (PD)',
          wiki: 'Suurkirkko (Tukholma)',
        },
        {
          otsikko: 'Maailman suurin viikinkihopea',
          aika: '1999',
          tiedosto: 'Silver tangle Spillings Hoard 1.jpg',
          teksti: 'Gotlannin Spillingsissä eräs maanviljelijä oli '
            + 'kyntänyt vuosikymmeniä pellon yli, jonka alla makasi '
            + 'suurin tunnettu viikinkiaikainen hopeakätkö. Kun '
            + 'arkeologit tutkivat paikan 1999 metallinilmaisimella, '
            + 'maasta nousi 67 kiloa hopeaa: rannerenkaita, tankoja ja '
            + 'noin neljätoistatuhatta kolikkoa. Suurin osa kolikoista '
            + 'oli lyöty islamilaisissa maissa Bagdadista Samarkandiin. '
            + 'Gotlantilaiset kävivät siis kauppaa Venäjän jokia pitkin '
            + 'aina Kaspianmerelle saakka ja toivat turkiksista hopeaa.',
          selite: 'Hopeisia rannerenkaita Spillingsin aarteesta. Renkaat '
            + 'olivat maksuväline: niistä katkaistiin pala kerrallaan ja '
            + 'punnittiin.',
          lahde: 'W.carter, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Viikinkiaika',
        },
        {
          otsikko: 'Kuninkaan pakoreitti hiihdetään joka vuosi',
          aika: '1520',
          tiedosto: 'Jørgen Aukland Vasaloppet 2013 002.jpg',
          teksti: 'Vuonna 1520 nuori Kustaa Eriksson pakeni tanskalaisia '
            + 'Taalainmaalle ja yritti saada talonpojat kapinaan. Moran '
            + 'miehet epäröivät, ja hän jatkoi suksilla kohti Norjaa. '
            + 'Kun tieto Tukholman verilöylystä levisi, kaksi hiihtäjää '
            + 'lähetettiin hänen peräänsä — he saivat hänet kiinni ja '
            + 'käänsivät takaisin. Kolme vuotta myöhemmin hänestä tuli '
            + 'kuningas Kustaa Vaasa. Vuodesta 1922 sama matka on '
            + 'hiihdetty toisin päin: 90 kilometriä Säleniltä Moraan. '
            + 'Ensimmäinen kilpailu järjestettiin sanomalehden '
            + 'ehdotuksesta, ja siihen osallistui 119 hiihtäjää.',
          selite: 'Vasaloppetin maalissa voittajan kaulaan asetetaan '
            + 'seppele. Hiihtäjiä on nykyään kymmeniätuhansia, ja '
            + 'ensimmäiset lähtevät liikkeelle ennen aamukahdeksaa.',
          lahde: 'Vasaloppet/Nisse Schmidt, Wikimedia Commons (CC BY 3.0)',
          wiki: 'Vaasahiihto',
        },
      ],
    },
    {
      id: 'ruoka',
      nimi: 'Ruoka',
      johdanto: 'Ruotsalainen ruoka tulee metsästä ja merestä — ja '
        + 'kahvitauolla on oma nimi, oma leivonnainen ja oma '
        + 'kalenteripäivä.',
      tehtava: {
        kysymys: 'Minä päivänä vietetään Ruotsissa kanelipullan päivää?',
        vaihtoehdot: ['4. lokakuuta', '1. toukokuuta', '13. joulukuuta'],
        oikea: 0,
        fakta: 'Kanelipullan päivä on 4. lokakuuta — leipomisneuvosto '
          + 'keksi sen 1999, ja vastaus löytyi pullanostosta.',
      },
      nostot: [
        {
          otsikko: 'Lihapullat ja punainen marja',
          tiedosto: 'DSC00045-swedish meatballs.jpg',
          teksti: 'Ruotsalaiselle lautaselle kuuluu kolme asiaa: '
            + 'lihapullat, perunamuusi ja lusikallinen puolukkahilloa. '
            + 'Makea marja hapan lihan vieressä hämmästyttää monta '
            + 'vierasta, mutta yhdistelmä on vanha keino: ennen '
            + 'jääkaappeja happamat ja sokeriset säilykkeet pitivät '
            + 'ruoan syömäkelpoisena talven yli. Ruotsin virallinen '
            + 'somekin on kertonut, että lihapullan resepti tuotiin '
            + 'maahan Turkista kuningas Kaarle XII:n mukana 1700-luvun '
            + 'alussa — asiaa on sen jälkeen kiistelty innokkaasti.',
          selite: 'Lihapullat, keitetyt perunat ja puolukkahillo. '
            + 'Puolukka poimitaan metsästä, ja sen saa jokamiehen '
            + 'oikeudella kuka tahansa.',
          lahde: 'Øyvind Holmstad, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Lihapulla',
        },
        {
          otsikko: 'Purkki, joka avataan ulkona',
          tiedosto: 'Cans of surströmming .jpg',
          teksti: 'Surströmming on silakkaa, joka on suolattu kevyesti ja '
            + 'annettu käydä kuukausien ajan. Käyminen jatkuu purkissa, '
            + 'joten kansi pullistuu — ja kun se avataan, haju on niin '
            + 'voimakas, että purkki avataan ulkona ja mielellään veden '
            + 'alla. Tapa syntyi pakosta: suolaa oli 1500-luvulla vähän '
            + 'ja kallista, joten kalaa säilöttiin niukalla suolalla ja '
            + 'käymisellä. Perinteinen tarjoilu on ohut näkkileipä, '
            + 'perunaa ja sipulia. Ensimmäinen purkki avataan elokuussa.',
          selite: 'Surströmming-purkkeja. Pullistunut kansi ei ole '
            + 'merkki pilaantumisesta vaan siitä, että käyminen jatkuu '
            + 'purkin sisällä.',
          lahde: 'hadyelsahar, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Hapansilakka',
        },
        {
          otsikko: 'Kanelipullalla on oma päivänsä',
          tiedosto: 'Kanelbullar in Skansen (Stockholm).jpg',
          teksti: 'Fika tarkoittaa taukoa, jolla juodaan kahvia ja '
            + 'syödään jotain makeaa. Se ei ole pelkkä kahvikuppi vaan '
            + 'sovittu hetki istua alas yhdessä: monella työpaikalla '
            + 'fika on kellonaika siinä missä lounas. Sana syntyi '
            + 'puhekielessä kääntämällä sanan kaffe tavut toisin päin. '
            + 'Kanelipulla sai oman juhlapäivänsä vuonna 1999, kun '
            + 'leipomisneuvosto täytti neljäkymmentä vuotta ja julisti '
            + 'lokakuun neljännen päivän kanelipullan päiväksi. Päivä jäi '
            + 'elämään: sinä päivänä ruotsalaiset syövät arviolta useita '
            + 'miljoonia pullia enemmän kuin tavallisena päivänä.',
          selite: 'Vastapaistettuja kanelipullia Skansenin leipomossa '
            + 'Tukholmassa. Ruotsalaiseen pullaan tulee kanelin lisäksi '
            + 'usein kardemummaa.',
          lahde: 'Luke Webber, Wikimedia Commons (CC BY 2.0)',
          wiki: 'Korvapuusti',
        },
        {
          otsikko: 'Rapujuhlat paperihatuissa',
          tiedosto: 'Kräftskiva, Häringe slott, 1991.jpg',
          teksti: 'Elokuussa ruotsalaiset kokoontuvat pihoille syömään '
            + 'tilliin keitettyjä rapuja. Pöydän yllä roikkuu '
            + 'paperilyhtyjä, päässä on paperihattu, kaulassa '
            + 'ruutuliina — ja välillä lauletaan lyhyt juomalaulu. '
            + 'Juhlan tausta on kuiva sääntö: rapujen pyynti oli pitkään '
            + 'sallittua vasta elokuun alusta, jotta kannat kestäisivät. '
            + 'Kiellon päättyminen muuttui juhlaksi, ja se on säilynyt, '
            + 'vaikka nykyään suurin osa ravuista tuodaan ulkomailta. '
            + 'Ruotsin omat joet menetti 1900-luvulla rapurutto, joka '
            + 'levisi Amerikasta tuotujen rapujen mukana.',
          selite: 'Rapujuhla ulkona 1990-luvun alussa. Lyhdyt, hatut ja '
            + 'liinat kuuluvat asuun; rapuja syödään sormin.',
          lahde: 'Holger.Ellgaard, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Rapujuhla',
        },
      ],
    },
    {
      id: 'kuvataide',
      nimi: 'Kuvataide',
      johdanto: 'Ruotsalainen taide meni sinne, missä ihmiset ovat: '
        + 'kotien keittiöihin, kesäisille tanssilavoille ja syvälle '
        + 'peikkojen metsään.',
      nostot: [
        {
          otsikko: 'Koti, josta tuli koko maan malli',
          tiedosto: 'Skamvrån av Carl Larsson 1894.jpg',
          teksti: 'Carl Larsson maalasi 1890-luvulla akvarelleja omasta '
            + 'kodistaan Sundbornissa: keittiöstä, lastenhuoneesta ja '
            + 'kattauksesta. Kirjana julkaistut kuvat levisivät '
            + 'kaikkialle, ja niistä tuli ruotsalaisen kodin ihanne — '
            + 'vaaleat seinät, raidalliset räsymatot, kirkkaat värit ja '
            + 'valo. Ideat olivat suurelta osin hänen vaimonsa Karinin, '
            + 'joka suunnitteli huonekalut ja tekstiilit. Sama ihanne '
            + 'näkyy yhä ruotsalaisissa huonekaluliikkeissä ympäri '
            + 'maailman.',
          selite: 'Skamvrån (1894): rangaistuspenkki nurkassa. Larssonin '
            + 'lapset esiintyvät kuvissa jatkuvasti — myös silloin, kun '
            + 'jotain oli sattunut.',
          lahde: 'Carl Larsson, Wikimedia Commons (PD)',
          wiki: 'Carl Larsson',
        },
        {
          otsikko: 'Peikot syntyivät männikössä',
          tiedosto: 'John Bauer - The Princess and the Trolls - Google Art Project.jpg',
          teksti: 'John Bauer kuvitti satukirjasarjaa Bland tomtar och '
            + 'troll ja loi samalla sen, miltä peikko pohjoismaisessa '
            + 'mielikuvassa näyttää: kyhmyinen, sammaleinen ja '
            + 'jättimäinen, mutta ei pelkästään paha. Metsänsä hän '
            + 'maalasi Smålannin kalliomänniköistä, joissa hän '
            + 'retkeili. Bauer kuoli vain 36-vuotiaana, kun '
            + 'höyrylaiva upposi myrskyssä Vätternillä 1918 — hänen '
            + 'kuvansa ovat sen jälkeen kulkeneet sukupolvelta toiselle. '
            + 'Tunnetuin niistä esittää pientä prinsessaa, joka kulkee '
            + 'peikkojen välissä pelkäämättä lainkaan — juuri se '
            + 'yhdistelmä teki Bauerin kuvista rakastettuja.',
          selite: 'Prinsessa ja peikot (1913). Kalliot kuvan yläosassa '
            + 'ovat tarkemmin katsottuna nukkuvia peikkoja.',
          lahde: 'John Bauer, Wikimedia Commons (PD)',
          wiki: 'John Bauer',
        },
        {
          otsikko: 'Juhannustanssi ei lopu yöhön',
          tiedosto: 'Anders Zorn - Midsummer Dance - Google Art Project.jpg',
          teksti: 'Anders Zorn syntyi taalainmaalaiseen kylään ja tuli '
            + 'maailmankuuluksi muotokuvamaalarina, joka maalasi '
            + 'Yhdysvaltain presidenttejä. Tunnetuin teos on silti '
            + 'kotoinen: Midsommardans vuodelta 1897 kuvaa juhannusyön '
            + 'tanssia Moran kylässä. Valo on erikoinen, koska sitä ei '
            + 'ole — pohjoisessa aurinko ei juhannuksena laske, ja '
            + 'ihmiset tanssivat hämärässä joka on melkein päivä. '
            + 'Kalpea keltainen taivas kertoo kellonajan tarkemmin kuin '
            + 'mikään kello. Zorn maalasi teoksen omassa kotikylässään '
            + 'ja käytti mallina naapureitaan, ei ammattimalleja.',
          selite: 'Midsommardans (1897). Oikealla nousee juhannussalko, '
            + 'jonka ympärillä tanssitaan koko yö.',
          lahde: 'Anders Zorn, Wikimedia Commons (PD)',
          wiki: 'Anders Zorn',
        },
        {
          otsikko: 'Abstrakti taide alkoi salaa',
          tiedosto: 'Hilma af Klint - Group VI, Evolution No. 13 (13949).jpg',
          teksti: 'Hilma af Klint maalasi jo vuonna 1906 suuria teoksia, '
            + 'joissa ei ole yhtään esittävää kohdetta — värejä, '
            + 'ympyröitä ja spiraaleja. Se tapahtui vuosia ennen kuin '
            + 'Kandinskyn ja muiden abstrakteja maalauksia nähtiin. '
            + 'Hilma ei kuitenkaan näyttänyt niitä juuri kenellekään: '
            + 'hän määräsi testamentissaan, ettei töitä saa asettaa '
            + 'esille ennen kuin kaksikymmentä vuotta on kulunut hänen '
            + 'kuolemastaan. Maailma näki ne kunnolla vasta 1980-luvulla, '
            + 'ja vasta silloin taidehistoriaa alettiin kirjoittaa '
            + 'uudestaan: abstrakti taide olikin alkanut Ruotsissa.',
          selite: 'Evolution nro 13 (1908) sarjasta Group VI. Muodot ovat '
            + 'omaa merkkikieltä, jota Hilma selitti muistikirjoissaan.',
          lahde: 'Hilma af Klint, Wikimedia Commons (PD)',
          wiki: 'Hilma af Klint',
        },
      ],
    },
    /*
     * Musiikki lisättiin 7.8.2026 (omistajan tarkennus): ABBA siirtyi
     * tänne Tukholman kannesta — yhtye on koko maan tarina, ja kansi
     * sai tilalle Vasa-laivan.
     */
    {
      id: 'musiikki',
      nimi: 'Musiikki',
      johdanto: 'Pieni maa, jonka laulut soivat isosti: '
        + 'kansansoittimesta ja 1800-luvun supertähdestä ABBAan ja '
        + 'tv-kisaan, jota katsoo koko kansa.',
      nostot: [
        {
          otsikko: 'Avainviulu soi kuudetta vuosisataa',
          tiedosto: '2022-07-28 Nyckelharpa-Spielerin in der Schillerstraße Ecke Rosenstraße in Hannover.jpg',
          teksti: 'Ruotsin kansallissoitin nyckelharpa on viulun ja '
            + 'näppäimistön risteytys: jousi soittaa kieliä, mutta '
            + 'sävelet valitaan puunäppäimillä, jotka lyhentävät '
            + 'kieltä alhaalta päin. Rungon sisällä värähtelee tusina '
            + 'resonanssikieltä, joihin ei kosketa lainkaan — ne '
            + 'humisevat mukana ja antavat soittimelle sen hopeisen '
            + 'kaiun. Soitin on vanha: avainviulua soittava hahmo on '
            + 'kuvattu gotlantilaisen kirkon portin veistoksessa jo '
            + '1300-luvulla. Välillä soitin melkein unohtui, mutta '
            + 'kansanmuusikot elvyttivät sen, ja nykyään sitä opetetaan '
            + 'taas musiikkiopistoissa.',
          selite: 'Nyckelharpan näppäimet ja kielet katusoitossa. '
            + 'Jousi kulkee kielillä, sormet painavat näppäimiä kuin '
            + 'pianossa.',
          lahde: 'Bernd Schwabe, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Avainviulu',
          // Jan Lingin väitöstutkimuksen kenttä-äänite (Musikverket);
          // Commonsin mp3-transkoodi soi myös iPadilla.
          musiikkiNayte: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/f/fe/Polska_-_SMV_-_MMF7_0677_06.wav/Polska_-_SMV_-_MMF7_0677_06.wav.mp3',
          musiikkiNayteNimi: 'Polska avainviululla — Jan Lingin kenttä-äänite, Musikverket (CC0)',
        },
        {
          otsikko: 'Satakieli, jonka lippuja huudettiin huutokaupassa',
          tiedosto: 'Magnus, Eduard - Lind, Jenny - Alte Nationalgalerie - Google Arts Project.jpg',
          teksti: 'Tukholmalainen Jenny Lind oli 1800-luvun suurin '
            + 'laulutähti — "Ruotsin satakieli", jonka ääntä tultiin '
            + 'kuulemaan kuninkaanlinnoihin ympäri Euroopan. Kun hän '
            + 'lähti 1850 Amerikan-kiertueelle, liput myytiin '
            + 'huutokaupalla ja satamiin kerääntyi kymmeniätuhansia '
            + 'ihmisiä vain katsomaan laivan saapumista. Lind lahjoitti '
            + 'valtavista palkkioistaan suuren osan kouluille ja '
            + 'sairaaloille jo kiertueen aikana. Sata vuotta myöhemmin '
            + 'hänen kasvonsa painettiin Ruotsin '
            + 'viidenkymmenen kruunun seteliin.',
          selite: 'Eduard Magnusin muotokuva vuodelta 1862 — tunnetuin '
            + 'kuva laulajasta, jonka ääntä ei ehditty koskaan '
            + 'äänittää.',
          lahde: 'Eduard Magnus, Wikimedia Commons (Public domain)',
          wiki: 'Jenny Lind',
        },
        /*
         * ABBA siirtyi tänne Tukholman kannesta (kulttuuri-kategoriat.js)
         * musiikkilinkkeineen — omistajan tarkennus 7.8.2026.
         */
        {
          otsikko: 'Neljä nimeä, joista tuli ABBA',
          tiedosto: 'Agnetha Fältskog and Anni-Frid Lyngstad in Göteborg 1979.jpg',
          teksti: 'Kun Agnetha, Björn, Benny ja Anni-Frid voittivat '
            + 'euroviisut Brightonissa 6. huhtikuuta 1974 kappaleella '
            + 'Waterloo, yhtyeen nimi oli koottu heidän etunimiensä '
            + 'alkukirjaimista. Voitto käänsi koko maan musiikkiviennin '
            + 'kasvuun: Tukholmassa toimii yhä poikkeuksellisen paljon '
            + 'studioita ja lauluntekijöitä, ja ruotsalaisia hittejä '
            + 'laulavat muidenkin maiden tähdet. Esiintymisasut tehtiin '
            + 'tahallaan mahdottomiksi — ne sai vähentää verotuksessa '
            + 'vain, jos niitä ei voinut käyttää arkena.',
          selite: 'Agnetha Fältskog ja Anni-Frid Lyngstad lavalla '
            + 'Göteborgissa 1979, yhtyeen suosion huipulla.',
          lahde: 'Kåre Eide, Wikimedia Commons (CC0)',
          wiki: 'Abba',
          musiikki: 'https://music.apple.com/fi/album/waterloo/1422648512?i=1422649021',
          musiikkiNimi: 'ABBA Apple Musicissa',
          // Juuri se voittokappale, josta teksti kertoo.
          esikuuntelu: 'ABBA Waterloo',
        },
        {
          otsikko: 'Koko kansan laulukilpailu',
          tiedosto: 'Melodifestivalen 2025 - Kamikaze Life - Maja Ivarsson 35.jpg',
          teksti: 'Joka kevät Ruotsi pysähtyy television ääreen, kun '
            + 'Melodifestivalen valitsee maan euroviisukappaleen. '
            + 'Kilpailu kiertää viikkokausia kaupungista toiseen kuin '
            + 'sirkus, ja finaali on vuoden katsotuin tv-lähetys — '
            + 'moni oppii kappaleet ulkoa ennen kuin euroviisuista on '
            + 'kuultu sanaakaan. Tulokset näkyvät: juuri tätä kautta '
            + 'ABBA lähti Waterloineen maailmalle 1974, ja Ruotsi on '
            + 'voittanut euroviisut seitsemän kertaa — yhtä moneen '
            + 'voittoon on yltänyt vain Irlanti.',
          selite: 'Maja Ivarsson esittää kappaletta Kamikaze Life '
            + 'Melodifestivalenissa 2025.',
          lahde: 'Jonatan Svensson Glad, Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Melodifestivalen',
          musiikki: 'https://music.apple.com/fi/album/euphoria-single-version/499907070?i=499907132',
          musiikkiNimi: 'Melodifestivalenin kappaleita Apple Musicissa',
          // Kisan tunnetuin voittaja: Loreen voitti myös euroviisut
          // kahdesti, ainoana naisena.
          esikuuntelu: 'Loreen Euphoria',
        },
      ],
    },
    {
      id: 'luonto',
      nimi: 'Luonto',
      johdanto: 'Ruotsissa metsä on kaikkien: sinne saa mennä, siellä saa '
        + 'yöpyä ja marjat saa poimia — kunhan ei häiritse eikä tuhoa.',
      nostot: [
        {
          otsikko: 'Jokaisella on oikeus metsään',
          tiedosto: 'Fresh bilberries picked in Tuntorp 1.jpg',
          teksti: 'Allemansrätten eli jokamiehenoikeus antaa kenelle '
            + 'tahansa luvan kulkea, uida, telttailla yön ja poimia '
            + 'marjoja ja sieniä myös toisen mailla. Sääntö tiivistyy '
            + 'kahteen sanaan: inte störa, inte förstöra — ei saa '
            + 'häiritä eikä tuhota. Pihan lähelle ei mennä, viljelyksiä '
            + 'ei talloa eikä nuotiota tehdä kalliolle, joka halkeaa '
            + 'kuumuudesta. Oikeutta ei ole kirjoitettu yhdeksi laiksi '
            + 'vaan se on tapa, joka on aikojen kuluessa vahvistettu. '
            + 'Sama oikeus on Suomessa ja Norjassa, mutta suuressa '
            + 'osassa Eurooppaa metsään ei saa mennä ilman lupaa.',
          selite: 'Metsästä poimittuja mustikoita. Marjojen poimimiseen '
            + 'ei tarvita maanomistajan lupaa — kalastukseen ja '
            + 'metsästykseen tarvitaan.',
          lahde: 'W.carter, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Jokaisenoikeus',
        },
        {
          otsikko: 'Erämaa ilman polkuja',
          tiedosto: 'Skierfe and Rapaätno delta - Sarek national park - panoramio.jpg',
          teksti: 'Sarek perustettiin kansallispuistoksi 1909, samana '
            + 'vuonna kuin Euroopan ensimmäiset kansallispuistot '
            + 'ylipäätään. Se on lähes tienotonta ja polutonta '
            + 'tunturimaata: parisataa yli 1800-metristä huippua, '
            + 'kymmeniä jäätiköitä eikä juuri lainkaan siltoja. Sisään '
            + 'mennään omin voimin ja ulos samoin. Kuuluisin näkymä on '
            + 'Rapadalen, jossa jäätiköiden liete on kasannut jokeen '
            + 'suistoja kuin punos — vihreä laakso keskellä harmaita '
            + 'vuoria. Puistossa ei ole majoitusta eikä kioskeja, joten '
            + 'kaikki tarvittava kannetaan selässä.',
          selite: 'Rapadalenin suisto Skierfen kalliolta. Vaaleat juovat '
            + 'ovat jäätikön hiomaa kiviainesta, jonka joki on tuonut '
            + 'mukanaan.',
          lahde: 'Tero Laakso, Wikimedia Commons (CC BY 3.0)',
          wiki: 'Sarek',
        },
        {
          otsikko: 'Metsän kuningas painaa puoli tonnia',
          tiedosto: 'Älg (Alces alces) på Ornö.jpg',
          teksti: 'Ruotsin metsissä elää talvisin noin kolmesataatuhatta '
            + 'hirveä, ja kesällä vasojen kanssa selvästi enemmän. '
            + 'Aikuinen sonni painaa jopa puoli tonnia ja kasvattaa '
            + 'joka kevät uuden sarvikruunun, jonka se pudottaa '
            + 'talvella. Hirvi on niin tavallinen, että se on tiellä '
            + 'todellinen vaara: teiden varsilla on satoja kilometrejä '
            + 'hirviaitaa ja varoituskylttejä. Ruotsalaiset kutsuvat '
            + 'sitä metsän kuninkaaksi — skogens konung. Sarvet ovat '
            + 'aikuisella sonnilla lapiomaiset ja voivat olla yli '
            + 'puolentoista metrin levyiset.',
          selite: 'Hirvi Ornön saarella Tukholman saaristossa. Hirvi ui '
            + 'hyvin ja siirtyy saarelta toiselle omin päin.',
          lahde: 'Hangsna, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Hirvi',
        },
        {
          otsikko: 'Taivas repeää vihreäksi',
          tiedosto: 'Aurora in Abisko near Torneträsk.jpg',
          teksti: 'Abisko Pohjois-Ruotsissa on yksi maailman parhaista '
            + 'paikoista nähdä revontulet, ja syy on maantieteessä: '
            + 'tunturit pysäyttävät Atlantilta tulevat pilvet, joten '
            + 'Torneträskin yllä on usein selkeää silloinkin, kun '
            + 'ympärillä sataa. Ilmiötä kutsutaan siniseksi aukoksi. '
            + 'Revontulet syntyvät, kun auringosta sinkoutuneet hiukkaset '
            + 'törmäävät ilmakehän kaasuihin sadan kilometrin korkeudessa '
            + '— happi hehkuu vihreänä, typpi violettina. Parhaat yöt '
            + 'ovat pimeimmän talven selkeitä pakkasöitä, jolloin valo '
            + 'näkyy myös vedenpinnasta heijastuneena.',
          selite: 'Revontulet Abiskossa Torneträskin lähellä. Talvella '
            + 'aurinko ei nouse siellä lainkaan useaan viikkoon.',
          lahde: 'Pavel.shyshkouski, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Revontulet',
        },
      ],
    },
    {
      id: 'tiede',
      nimi: 'Tiede',
      johdanto: 'Ruotsalaiset ovat antaneet maailmalle lajien nimet, '
        + 'lämpömittarin asteikon, tulitikun joka ei syty vahingossa — '
        + 'ja palkinnon, joka jaetaan joulukuussa Tukholmassa.',
      nostot: [
        {
          otsikko: 'Dynamiitin keksijän testamentti',
          tiedosto: 'Panorama of Stockholms stadshus (24228618004).jpg',
          teksti: 'Alfred Nobel keksi dynamiitin 1867 ja rikastui '
            + 'räjähteillä, joita käytettiin sekä tunneleiden '
            + 'louhimiseen että sodassa. Vuonna 1888 eräs lehti luuli '
            + 'hänen kuolleen ja julkaisi muistokirjoituksen otsikolla '
            + '"kuoleman kauppias on kuollut". Nobel luki oman '
            + 'muistokirjoituksensa ja kirjoitti myöhemmin '
            + 'testamentin, jossa hän määräsi lähes koko omaisuutensa '
            + 'palkinnoiksi. Ensimmäiset Nobelin palkinnot jaettiin '
            + '1901, ja juhlaillallista on vietetty Tukholman '
            + 'kaupungintalolla 1930-luvulta asti.',
          selite: 'Tukholman kaupungintalo. Sen Sinisessä salissa '
            + 'katetaan joka 10. joulukuuta Nobel-illallinen noin '
            + 'tuhannelle vieraalle.',
          lahde: 'Jorge Láscar from Melbourne, Australia, Wikimedia Commons (CC BY 2.0)',
          wiki: 'Alfred Nobel',
        },
        {
          otsikko: 'Mies, joka antoi lajeille nimet',
          tiedosto: 'Carl von Linné.jpg',
          teksti: 'Ennen Carl von Linnéä kasvin nimi saattoi olla kokonainen '
            + 'latinankielinen lause. Linné otti käyttöön kahden sanan '
            + 'nimen: ensin suku, sitten laji — Homo sapiens, Alces '
            + 'alces. Järjestelmä oli niin selkeä, että se on käytössä '
            + 'yhä, ja se teki mahdolliseksi verrata löytöjä maasta '
            + 'toiseen. Linné lähetti oppilaitaan, "apostoleitaan", '
            + 'keräämään lajeja ympäri maailmaa; osa heistä ei palannut '
            + 'koskaan. Hänen kotinsa Uppsalan kasvitieteellisessä '
            + 'puutarhassa on yhä nähtävissä.',
          selite: 'Carl von Linné (1707–1778) Alexander Roslinin '
            + 'maalaamana. Napinlävessä on hänen suosikkikasvinsa, '
            + 'vanamo.',
          lahde: 'Alexander Roslin, Wikimedia Commons (PD)',
          wiki: 'Carl von Linné',
        },
        {
          otsikko: 'Asteikko, joka oli aluksi väärin päin',
          tiedosto: 'Celsius Thermometer - Replica.jpg',
          teksti: 'Uppsalalainen tähtitieteilijä Anders Celsius esitti '
            + '1742 lämpömittarin asteikon, jossa on sata astetta veden '
            + 'jäätymisen ja kiehumisen välillä. Hänen omassa '
            + 'asteikossaan luvut olivat kuitenkin toisin päin kuin '
            + 'nyt: nolla tarkoitti kiehumista ja sata jäätymistä. '
            + 'Asteikko käännettiin pian hänen kuolemansa jälkeen — '
            + 'kääntäjäksi on esitetty muun muassa Linnéä, joka '
            + 'tarvitsi kasvihuoneeseensa mittarin, jossa lämpimämpi '
            + 'on suurempi luku. Asteikko sai Celsiuksen nimen vasta '
            + 'vuonna 1948 — sitä ennen sitä kutsuttiin usein '
            + 'sadanjaon asteikoksi.',
          selite: 'Kopio Celsiuksen lämpömittarista Tekniska museetissa. '
            + 'Asteikko on maalattu puulevylle elohopeaputken viereen.',
          lahde: 'Tekniska museet, Wikimedia Commons (CC BY 4.0)',
          wiki: 'Anders Celsius',
        },
        {
          otsikko: 'Tulitikku, joka syttyy vain omasta rasiastaan',
          tiedosto: 'Säkerhetständstickor.JPG',
          teksti: 'Vanhat tulitikut syttyivät mistä tahansa hankauksesta '
            + 'ja sisälsivät valkoista fosforia, joka sairastutti '
            + 'tehtaiden työntekijät. Ruotsalainen Gustaf Erik Pasch '
            + 'keksi 1844 jakaa syttyminen kahtia: tikun päähän jää osa '
            + 'aineista ja loput siirretään rasian kylkeen. Johan '
            + 'Edvard Lundström kehitti ideasta Jönköpingissä '
            + 'valmistuskelpoisen tuotteen 1850-luvulla. Turvatulitikku '
            + 'syttyy vain omaa raapaisupintaansa vasten — siksi tikut '
            + 'eivät syty taskussa.',
          selite: 'Vanhoja jönköpingiläisiä turvatulitikkurasioita. '
            + 'Kyljessä lukee ruotsiksi: "syttyy vain rasian pintaa '
            + 'vasten".',
          lahde: 'Bengt Oberger, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Tulitikku',
        },
      ],
    },
    {
      id: 'menovinkit',
      nimi: 'Menovinkit',
      johdanto: 'Ruotsi on avannut kokoelmansa poikkeuksellisen laajasti: klassikot '
        + 'ensipainoksina, 1500 vuotta vanha hopearaamattu sivu kerrallaan, '
        + 'koko maan muinaisjäännökset kartalla ja luontohavainnot tältä '
        + 'aamulta.',
      lista: [
        {
          otsikko: 'Kirjat ja käsikirjoitukset',
          kohteet: [
            {
              nimi: 'Litteraturbanken — Ruotsin kirjallisuus ilmaiseksi',
              tiedosto: 'Selma Lagerlof (1908), painted by Carl Larsson.jpg',
              teksti: 'Litteraturbanken on Ruotsin kirjallisuuden ilmainen '
                + 'verkkokirjasto.',
              selite: 'Carl Larssonin muotokuva Selma Lagerlöfistä vuodelta 1908: '
                + 'kirjailija istuu kaiverretussa nojatuolissa käsi posken '
                + 'alla, taustalla vaalea kuvakudos ja punainen kukka.',
              lahde: 'Carl Larsson, Wikimedia Commons (public domain)',
              linkki: 'https://litteraturbanken.se/',
            },
            {
              nimi: 'Alvin — ruotsalaisten yliopistojen digitoidut aarteet',
              tiedosto: 'Codex Argenteus.jpg',
              teksti: 'Alvin on ruotsalaisten yliopistojen yhteinen '
                + 'digitointiportaali: käsikirjoituksia, karttoja ja '
                + 'valokuvia. Sen kuuluisin aarre on Codex Argenteus, '
                + 'Hopearaamattu.',
              selite: 'Hopeisin ja kultaisin kirjaimin purppuranväriselle '
                + 'pergamentille kirjoitettu sivu; alareunassa rivi pieniä '
                + 'kaaria.',
              lahde: 'Wikimedia Commons (public domain)',
              linkki: 'https://www.alvin-portal.org/',
            },
          ],
        },
        {
          otsikko: 'Muinaisuus ja riimut',
          kohteet: [
            {
              nimi: 'Fornsök — Ruotsin muinaisjäännökset kartalla',
              tiedosto: 'Ales stenar (by Pudelek).JPG',
              teksti: 'Fornsök on Ruotsin muinaismuistoviraston karttapalvelu, '
                + 'jossa maan kaikki tunnetut muinaisjäännökset ovat '
                + 'pisteinä.',
              selite: 'Kivilaiva Skånen niityllä: pystyyn nostetut lohkareet '
                + 'muodostavat pitkän soikion, jonka läpi kulkee kulunut '
                + 'polku.',
              lahde: 'Pudelek, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://app.raa.se/open/fornsok/',
            },
            {
              nimi: 'Riimukoulu — opi lukemaan riimukiviä',
              tiedosto: 'U 614, Torsätra.jpg',
              teksti: 'Ruotsissa on enemmän riimukiviä kuin missään muualla '
                + 'maailmassa, ja suurin osa niistä seisoo yhä ulkona samalla '
                + 'paikalla kuin tuhat vuotta sitten.',
              selite: 'Riimukivi museon sinistä seinää vasten: punaisiksi '
                + 'maalatut riimut kiertävät kiven reunaa, ja keskellä '
                + 'kiemurtelee käärme.',
              lahde: 'Berig, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://www.raa.se/kulturarv/runor-och-runstenar/runskolan/runstenar/',
            },
          ],
        },
        {
          otsikko: 'Luonto ja tekniikka',
          kohteet: [
            {
              nimi: 'Artportalen — Ruotsin luontohavainnot',
              tiedosto: 'Lavskrika Siberian Jay (20162468398).jpg',
              teksti: 'Artportalen on Ruotsin luontohavaintojen yhteinen '
                + 'kirjanpito. Kuka tahansa saa ilmoittaa näkemänsä lajin, ja '
                + 'kaikki havainnot ovat julkisia — myös ne, jotka on tehty '
                + 'tunti sitten.',
              selite: 'Lavskrika istuu matalassa varvikossa: ruskeanharmaa '
                + 'höyhenpuku, tumma naamio silmien ympärillä ja '
                + 'ruostepunaista pyrstön tyvessä.',
              lahde: 'Åsa Berndtsson, Wikimedia Commons (CC BY 2.0)',
              linkki: 'https://www.artportalen.se/',
            },
            {
              nimi: 'Tekniska museet — Ruotsin tekniikan kokoelmat',
              tiedosto: 'Christopher Polhem painted by Johan Henrik Scheffel 1741.jpg',
              teksti: 'Tekniska museet Tukholmassa on Ruotsin tekniikan museo, ja '
                + 'sen kokoelmissa on Christopher Polhemin mekaaninen '
                + 'aakkosto.',
              selite: 'Öljyvärimuotokuva Christopher Polhemista: iäkäs mies '
                + 'samettitakissa ja -lakissa, rinnassa ritarikunnan tähti, '
                + 'kädet lepäävät paperin ja piirtimen päällä.',
              lahde: 'Johan Henrik Scheffel, Wikimedia Commons (public domain)',
              linkki: 'https://www.tekniskamuseet.se/',
            },
          ],
        },
      ],
    },
  ],

  DEU: [
    {
      id: 'historia',
      nimi: 'Historia',
      johdanto: 'Saksa oli vuosisatoja pienten valtioiden tilkkutäkki '
        + '— ja sitten maa, joka jaettiin kahtia ja kasvoi jälleen '
        + 'yhteen.',
      nostot: [
        {
          otsikko: 'Kauppiaiden liitto hallitsi Itämerta',
          aika: 'keskiaika',
          tiedosto: 'Kieler Hansekogge.jpg',
          teksti: 'Keskiajalla Itämerta ei hallinnut kuningas vaan '
            + 'kauppiaiden kerho. Hansaliittoon kuului parhaimmillaan '
            + 'lähes kaksisataa kaupunkia Lontoosta Novgorodiin, ja '
            + 'sitä johdettiin Lyypekistä. Hansan laiva oli koggi: '
            + 'pyöreämahainen puualus, joka kuljetti suolaa, silliä, '
            + 'viljaa ja kankaita. Liitolla oli omat lait ja omat '
            + 'kauppatalot vieraissa satamissa, ja kun joku kuningas '
            + 'kiusasi kauppiaita, Hansa saattoi julistaa koko maan '
            + 'saartoon — ja voitti kerran Tanskan sodassakin. Moni '
            + 'Pohjois-Saksan kaupunki kutsuu itseään hansakaupungiksi '
            + 'vielä tänäänkin.',
          selite: 'Kieler Hansekogge, vuonna 1991 rakennettu '
            + 'keskiaikaisen koggin jäljennös, purjehtimassa Kielin '
            + 'edustalla.',
          lahde: 'Chattus, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Hansaliitto',
        },
        {
          otsikko: 'Kuningas rakensi itselleen satulinnan',
          aika: '1869',
          tiedosto: 'Schloss Neuschwanstein 2013.jpg',
          teksti: 'Baijerin kuningas Ludvig II ei viihtynyt '
            + 'hallitsijana vaan saduissa. Vuonna 1869 hän alkoi '
            + 'rakennuttaa vuorenrinteelle linnaa, joka näyttää '
            + 'keskiaikaiselta mutta oli sisältä aikansa uusinta '
            + 'tekniikkaa: keskuslämmitys, juokseva vesi ja jopa '
            + 'sähkökelloilla kutsuttava palveluskunta. Ludvig ehti '
            + 'asua Neuschwansteinissa vain 172 päivää, ja rahat '
            + 'loppuivat kesken — torneja jäi rakentamatta. Nykyään '
            + 'linnassa käy 1,4 miljoonaa vierasta vuodessa, ja sen '
            + 'sanotaan olleen Disneyn satulinnan esikuva.',
          selite: 'Neuschwanstein Alppien juurella Baijerissa. '
            + 'Taustalla Forggensee-järvi.',
          lahde: 'Thomas Wolf (foto-tw.de), Wikimedia Commons (CC BY-SA 3.0 DE)',
          wiki: 'Neuschwanstein',
        },
        {
          otsikko: 'Karkkeja putosi taivaalta',
          aika: '1948–49',
          tiedosto: 'C-54 landing on old Tempelhof runway as work continues - USACE-p15141coll5-630.jpeg',
          teksti: 'Kesällä 1948 Neuvostoliitto katkaisi kaikki tiet '
            + 'Länsi-Berliiniin, ja kahden miljoonan ihmisen ruoka oli '
            + 'lopussa. Silloin alkoi ilmasilta: lentokone laskeutui '
            + 'kaupunkiin lähes joka toinen minuutti, yötä päivää, '
            + 'lähes vuoden ajan. Koneissa tuli jauhoja, hiiltä ja '
            + 'maitojauhetta — ja lentäjä Gail Halvorsen alkoi pudottaa '
            + 'lapsille karkkeja pienissä nenäliinalaskuvarjoissa. '
            + 'Berliiniläislapset kutsuivat koneita nimellä '
            + 'Rosinenbomber, rusinapommittaja. Saarto päättyi 1949, '
            + 'kun se ei ollut tehonnut.',
          selite: 'C-54-kuljetuskone laskeutuu Tempelhofiin 1948 samalla '
            + 'kun uutta kiitorataa vielä rakennetaan.',
          lahde: 'Yhdysvaltain ilmavoimat, Wikimedia Commons (Public domain)',
          wiki: 'Berliinin saarto',
        },
        {
          otsikko: 'Muuri avautui paperilapun takia',
          aika: '1989',
          tiedosto: 'Crane removed part of Wall Brandenburg Gate.jpg',
          teksti: 'Itä-Saksa aikoi 9. marraskuuta 1989 helpottaa '
            + 'matkustussääntöjä vasta seuraavana päivänä, mutta '
            + 'tiedottaja Günter Schabowski sai käteensä keskeneräisen '
            + 'paperin. Kun toimittaja kysyi suorassa lähetyksessä, '
            + 'milloin uudet säännöt tulevat voimaan, Schabowski selasi '
            + 'lappujaan ja vastasi: "Tietääkseni heti." Kymmenettuhannet '
            + 'itäberliiniläiset lähtivät samana iltana muurille, '
            + 'rajavartijat avasivat puomit — ja 28 vuotta kaupungin '
            + 'halkaissut muuri alkoi murtua vielä samana yönä.',
          selite: 'Nosturi siirtää muurinlohkoa Brandenburgin portin '
            + 'edestä joulukuussa 1989, kun porttia valmistellaan '
            + 'avattavaksi.',
          lahde: 'SSGT F. Lee Corkran, Wikimedia Commons (Public domain)',
          wiki: 'Berliinin muuri',
        },
      ],
    },
    {
      id: 'ruoka',
      nimi: 'Ruokaa ja tapakulttuuria',
      johdanto: 'Saksassa ruoka ja tavat kulkevat yhdessä: leipää on tuhansia '
        + 'lajeja, kahvi juodaan kakun kanssa tiettyyn kellonaikaan, ja '
        + 'joulumarkkinat avataan joka vuosi samana päivänä.',
      nostot: [
        {
          otsikko: 'Kolmetuhatta leipää, ja jokaisella oma nimi',
          tiedosto: 'Brezel l Bäckerei-Raisch.jpg',
          teksti: 'Saksan leipomoiden yhdistys pitää rekisteriä maan '
            + 'leipälajeista, ja niitä on yli kolmetuhatta. Se on enemmän '
            + 'kuin missään muualla maailmassa. Unesco otti saksalaisen '
            + 'leipäkulttuurin aineettoman kulttuuriperinnön listalleen '
            + 'vuonna 2014. Brezel eli rinkeli on niistä tunnetuin: '
            + 'taikinanauha vedetään pitkäksi, solmitaan kädenkäänteessä ja '
            + 'kastetaan lipeään, joka antaa kuoreen ruskean värin ja oman '
            + 'makunsa.',
          selite: 'Vastapaistettuja Brezeleitä leipomon pöydällä. Karkea suola '
            + 'painetaan pintaan ennen uunia.',
          lahde: 'LenaRaisch, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Pretzel',
        },
        {
          otsikko: 'Kello kolme juodaan kahvit ja syödään kakkua',
          aika: '1900-luku',
          tiedosto: 'Kirchner - Kaffetafel - 1907.jpeg',
          teksti: 'Kaffee und Kuchen on saksalainen tapa, ei ateria: iltapäivällä '
            + 'noin kolmen aikaan istutaan alas, keitetään kahvi ja syödään '
            + 'pala kakkua. Sunnuntaisin siihen kutsutaan vieraita. Tapa '
            + 'syntyi 1800-luvulla, kun kahvista tuli tavallisen väen juoma, '
            + 'ja se näkyy yhä siinä, että konditoriat ovat täynnä juuri '
            + 'iltapäivällä. Kakku on usein hedelmäpiirakka tai Schwarzwaldin '
            + 'kirsikkakakku.',
          selite: 'Ernst Ludwig Kirchnerin maalaus vuodelta 1907: kolme naista '
            + 'keltaisen pöytäliinan ääressä, kahvipannu ja kupit edessään.',
          lahde: 'Ernst Ludwig Kirchner, Wikimedia Commons (public domain)',
          wiki: 'Ernst Ludwig Kirchner',
        },
        {
          otsikko: 'Markkinat, jotka avataan joka vuosi samana päivänä',
          aika: '1628',
          tiedosto: 'Wilhelm Ritter - Weihnachtsmarkt auf der vorderen Insel Schütt 1930.jpg',
          teksti: 'Joulumarkkinat ovat Saksassa oma vuodenaikansa. Nürnbergin '
            + 'Christkindlesmarkt on niistä kuuluisin, ja se mainitaan '
            + 'asiakirjoissa jo vuonna 1628. Markkinat avataan adventin alla '
            + 'ja suljetaan jouluaattona. Kojuissa myydään puisia leluja, '
            + 'kynttilöitä, paahdettuja manteleita ja Glühweiniä, joka on '
            + 'kuumaa maustettua viiniä — lapsille sama juoma tehdään ilman '
            + 'viiniä ja se on nimeltään Kinderpunsch.',
          selite: 'Wilhelm Ritterin maalaus Nürnbergin joulumarkkinoilta vuodelta '
            + '1930: lumiset katot, valaistut kojut ja kuusta kantava mies.',
          lahde: 'Wilhelm Ritter, Wikimedia Commons (public domain)',
          wiki: 'Joulumarkkinat',
        },
        {
          otsikko: 'Piparkakkusydän, jossa lukee mitä et uskalla sanoa',
          tiedosto: 'Lebkuchenherzen verziert.jpg',
          teksti: 'Lebkuchenherz on sydämen muotoinen piparkakku, jonka pintaan '
            + 'on kirjoitettu kuorrutuksella lyhyt lause ja johon on '
            + 'pujotettu nauha kaulaan ripustamista varten. Niitä myydään '
            + 'joulumarkkinoilla ja Oktoberfestissä. Tekstit ovat useimmiten '
            + 'hellyttäviä tai kiusoittelevia, ja sydän annetaan lahjaksi sen '
            + 'sijaan että asia sanottaisiin ääneen. Syödä sitä ei ole pakko '
            + '— moni säilyttää sydämen vuosia.',
          selite: 'Rivi koristeltuja piparkakkusydämiä nauhoissaan markkinakojun '
            + 'katossa, kuorrutetut tekstit näkyvissä.',
          lahde: 'Naturpuur, Wikimedia Commons (CC BY-SA 4.0)',
        },
        {
          otsikko: 'Karhu, joka syntyi kotikeittiössä',
          aika: '1922',
          tiedosto: 'Gummi bears in a row.jpg',
          teksti: 'Hans Riegel perusti Bonnissa vuonna 1922 pienen makeistehtaan, '
            + 'jonka koko omaisuus oli säkki sokeria, kuparipata ja '
            + 'marmorilaatta. Kaksi vuotta myöhemmin hän muotoili '
            + 'gelatiinista tanssivan karhun ja nimesi sen Tanzbäriksi. '
            + 'Yrityksen nimi Haribo tulee perustajan nimestä ja '
            + 'kotikaupungista: HAns RIegel, BOnn. Karhu on sittemmin '
            + 'kutistunut ja pyöristynyt nykyiseen muotoonsa.',
          selite: 'Kumikarhut rivissä. Alkuperäinen Tanzbär oli nykyistä karhua '
            + 'kookkaampi ja hoikempi.',
          lahde: 'Indoor-Fanatiker, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Haribo',
        },
        {
          otsikko: 'Kebab sai leivän Berliinissä',
          aika: '1970-luku',
          tiedosto: 'Döner Kebab, Berlin, 2010 (01).jpg',
          teksti: 'Pystyvartaassa paistettu liha on vanha turkkilainen tapa, '
            + 'mutta ajatus tunkea se leivän sisään ja syödä kävellen syntyi '
            + 'Berliinissä 1970-luvulla. Turkkilaiset siirtolaiset myivät '
            + 'annosta tehdastyöläisille, joilla oli lyhyt ruokatunti. Nyt '
            + 'döner on Saksan myydyimpiä pikaruokia, ja Berliinissä siitä '
            + 'kiistellään yhä: kuka keksi, mitä kuuluu sisään ja mikä kioski '
            + 'on paras.',
          selite: 'Döner berliiniläisittäin: paahdettu leipä täytetään lihalla, '
            + 'salaatilla, tomaatilla ja kastikkeella.',
          lahde: 'AleGranholm, Wikimedia Commons (CC BY 2.0)',
          wiki: 'Kebab',
        },
      ],
    },
    {
      id: 'musiikki',
      nimi: 'Musiikki',
      johdanto: 'Saksasta tulivat kanttori, joka sävelsi joka viikoksi '
        + 'uutta, kuuroutunut säveltäjä, jonka sävelmä on nyt Euroopan '
        + 'hymni — ja muurin kaatumisen jälkeen kellareista noussut '
        + 'tekno.',
      nostot: [
        {
          otsikko: 'Kanttori sävelsi joka viikolle uuden teoksen',
          tiedosto: 'Johann Sebastian Bach - Google Arts Project.jpg',
          teksti: 'Johann Sebastian Bach oli Leipzigin Tuomaskirkon '
            + 'kanttori, jonka työhön kuului säveltää lähes joka '
            + 'sunnuntaille uusi kantaatti — ja opettaa samalla '
            + 'poikakuoroa ja latinaa. Sävellyksiä kertyi yli tuhat. '
            + 'Bach oli aikansa kuuluisin urkujen testaaja: kun uudet '
            + 'urut valmistuivat, hän veti kaikki äänikerrat auki ja '
            + 'sanoi haluavansa kuulla, onko soittimella "hyvät '
            + 'keuhkot". Kotona oli kaksikymmentä lasta, joista neljä '
            + 'pojista nousi itsekin kuuluisiksi säveltäjiksi.',
          selite: 'Elias Gottlob Haussmannin muotokuva vuodelta 1746: '
            + 'Bach pitää kädessään kaanonin nuottia — pientä '
            + 'sävellysarvoitusta.',
          lahde: 'Elias Gottlob Haussmann, Wikimedia Commons (Public domain)',
          wiki: 'Johann Sebastian Bach',
          musiikkiNayte: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Bach%2C_Toccata_und_Fuge_d-moll_BWV_565%2C_Norbert_Schenk.mp3',
          musiikkiNayteNimi: 'Bach: Toccata ja fuuga d-molli — Norbert Schenk, urut (CC BY 4.0)',
        },
        {
          otsikko: 'Kuuro säveltäjä kuuli musiikin päässään',
          tiedosto: "Joseph Karl Stieler's Beethoven mit dem Manuskript der Missa solemnis.jpg",
          teksti: 'Bonnissa syntynyt Ludwig van Beethoven alkoi '
            + 'menettää kuuloaan alle kolmekymppisenä — säveltäjälle '
            + 'pahin mahdollinen kohtalo. Hän ei lopettanut vaan '
            + 'sävelsi päänsä sisällä: keskustelut käytiin '
            + 'vihkoihin kirjoittamalla, ja flyygelistä hän sahasi '
            + 'jalat, jotta tunsi sävelet lattian värinänä. Yhdeksännen '
            + 'sinfonian kantaesityksessä 1824 täysin kuuro Beethoven '
            + 'piti kääntää kasvot yleisöön päin, jotta hän näki '
            + 'suosionosoitukset, joita ei kuullut. Sinfonian '
            + 'loppuhymni Oodi ilolle on nykyään Euroopan unionin '
            + 'hymni.',
          selite: 'Joseph Karl Stielerin muotokuva (1820): Beethoven '
            + 'säveltämässä Missa solemnista, kynä kädessä.',
          lahde: 'Joseph Karl Stieler, Wikimedia Commons (Public domain)',
          wiki: 'Ludwig van Beethoven',
          // Juuri se sävelmä, josta teksti kertoo: EU:n hymni.
          musiikkiNayte: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Ode_to_Joy_-_Concert_Band_-_United_States_Air_Force_Band_of_the_Rockies.mp3',
          musiikkiNayteNimi: 'Beethoven: Oodi ilolle — United States Air Force Band, PD',
        },
        {
          otsikko: 'Pianotähti kiersi Eurooppaa jo lapsena',
          tiedosto: 'Franz Hanfstaengl - Clara Schumann (1857).jpg',
          teksti: 'Clara Wieck soitti ensimmäisen julkisen konserttinsa '
            + 'Leipzigissa yhdeksänvuotiaana ja kiersi teini-ikäisenä '
            + 'Euroopan konserttisaleja kuin tähti ainakin — Wienissä '
            + 'hänen kunniakseen leivottiin kakkuja. Hän sävelsi itse, '
            + 'soitti ulkomuistista aikana jolloin se oli ennenkuulumatonta, '
            + 'ja jatkoi esiintymistä kuusikymmentä vuotta samalla kun '
            + 'kasvatti kahdeksan lasta. Saksa painoi hänen kuvansa '
            + 'sadan markan seteliin 1989 — harva pianisti on päätynyt '
            + 'rahaan.',
          selite: 'Clara Schumann Franz Hanfstaenglin valokuvaamana '
            + 'Münchenissä 1857.',
          lahde: 'Franz Hanfstaengl, Wikimedia Commons (Public domain)',
          wiki: 'Clara Schumann',
        },
        /*
         * Teknonosto siirtyi tänne Berliinin litteistä nostoista
         * (europe-kulttuuri.js) musiikkilinkkeineen — maan
         * musiikkisivu palvelee samaa lehteä.
         */
        {
          otsikko: 'Tyhjät talot täyttyivät bassosta',
          tiedosto: 'Love Parade 1998 03.jpg',
          teksti: 'Kun muuri kaatui 1989, keskustaan jäi tyhjiä '
            + 'tehtaita, kellareita ja pankkiholveja, joilla ei ollut '
            + 'omistajaa. Niihin syntyi teknoklubeja, joissa idän ja '
            + 'lännen nuoret tanssivat ensi kertaa samoissa tiloissa — '
            + 'kuuluisin klubi, Tresor, aloitti tavaratalon vanhassa '
            + 'holvikellarissa, jonka teräsovet olivat jääneet '
            + 'paikoilleen. Berliinin teknokulttuuri otettiin '
            + 'maaliskuussa 2024 Saksan aineettoman kulttuuriperinnön '
            + 'luetteloon — samaan sarjaan leipurintaidon ja '
            + 'käkikellojen kanssa.',
          selite: 'Love Parade Berliinissä 1998. Ensimmäisessä '
            + 'kulkueessa vuonna 1989 oli 150 osallistujaa, '
            + 'huippuvuonna 1999 arviolta puolitoista miljoonaa. '
            + 'Viimeinen paraati pidettiin 2010.',
          lahde: 'Ago76, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Love Parade',
          musiikki: 'https://music.apple.com/fi/album/sky-and-sand/1676029121?i=1676029548',
          musiikkiNimi: 'Berliiniläistä teknoa Apple Musicissa',
          // Berliiniläisen teknon tunnetuin kappale (Berlin Calling).
          esikuuntelu: 'Paul Kalkbrenner Sky and Sand',
        },
      ],
    },
    /*
     * Uusi aihesivu (omistajan hyväksyntä 7.8.2026: "ota vain ne
     * uudet sivuvaihtoehdot käyttöön eri maille sen mukaan, mitkä
     * sopii") — Saksalle sadut istuvat kuin mikään muu. Kuvat
     * silmätarkistettu 480 px:ssä 7.8.2026.
     */
    {
      id: 'sadut',
      nimi: 'Sadut ja tarinat',
      johdanto: 'Saksa on satujen maa: Grimmin veljekset keräsivät '
        + 'kansansadut kirjaksi, ja moni tarina — pillipiiparista '
        + 'Jörö-Jukkaan — lähti täältä koko maailman omaksi.',
      nostot: [
        {
          otsikko: 'Veljekset, jotka keräsivät sadut talteen',
          aika: '1812',
          tiedosto: 'Alte Nationalgalerie-Jerichau-Baumann-Gebrüder Grimm DSC8174.jpg',
          teksti: 'Jacob ja Wilhelm Grimm eivät keksineet satujaan '
            + 'itse — he kulkivat kuuntelemassa, mitä ihmiset '
            + 'kertoivat, ja kirjoittivat kuulemansa muistiin. Kokoelma '
            + 'Lasten- ja kotisatuja ilmestyi 1812, ja sen tarinat — '
            + 'Punahilkka, Tuhkimo, Hannu ja Kerttu, Lumikki — '
            + 'tunnetaan nykyään lähes joka maassa. Veljekset olivat '
            + 'myös kielentutkijoita: he aloittivat saksan kielen '
            + 'suursanakirjan, joka oli niin valtava urakka, että se '
            + 'valmistui vasta yli sata vuotta heidän kuolemansa '
            + 'jälkeen.',
          selite: 'Elisabeth Jerichau-Baumannin kaksoismuotokuva '
            + 'vuodelta 1855 riippuu Berliinin Alte '
            + 'Nationalgaleriessa: Wilhelm kynä kädessä, Jacob '
            + 'vierellä.',
          lahde: 'Elisabeth Jerichau-Baumann, Wikimedia Commons (Public domain)',
          wiki: 'Grimmin veljekset',
        },
        {
          otsikko: 'Soittaja, jota seurattiin kaupungista',
          aika: '1284',
          tiedosto: 'Pied Piper2.jpg',
          teksti: 'Hamelnin kaupungin kirjoihin merkittiin 1284 outo '
            + 'suru: sata kolmekymmentä lasta lähti kaupungista '
            + 'kirjavan soittajan perässä eikä palannut. Kukaan ei '
            + 'tiedä varmasti, mitä oikeasti tapahtui — vasta '
            + 'myöhemmin tarinaan liitettiin rotat, jotka soittaja '
            + 'houkutteli ensin jokeen. Hamelnissa tarina elää yhä: '
            + 'kesäsunnuntaisin se esitetään näytelmänä, ja '
            + 'Bungelosenstrassella eli Rummuttomalla kadulla ei '
            + 'edelleenkään soiteta musiikkia — kunnioituksesta '
            + 'kadonneita kohtaan.',
          selite: 'Kate Greenawayn kuvitus vuodelta 1888: pillipiipari '
            + 'johdattaa lapsia, jotka eivät malta jäädä.',
          lahde: 'Kate Greenaway, Wikimedia Commons (Public domain)',
          wiki: 'Hamelnin pillipiipari',
        },
        {
          otsikko: 'Soittoniekat, jotka eivät päässeet perille',
          aika: '1951',
          tiedosto: 'Bremen, Bremer Stadtmusikanten -- 2021 -- 6358.jpg',
          teksti: 'Grimmin sadussa vanha aasi, koira, kissa ja kukko '
            + 'lähtevät Bremeniin soittajiksi, kun niitä ei enää '
            + 'kotona tarvita. Perille ne eivät koskaan pääse — '
            + 'matkalla ne pelästyttävät rosvot ulos talosta '
            + 'huutamalla yhteen ääneen ja jäävät sinne asumaan. '
            + 'Bremen otti soittoniekat silti omikseen: raatihuoneen '
            + 'kupeessa on seissyt vuodesta 1951 pronssipatsas, jossa '
            + 'eläimet seisovat päällekkäin. Aasin etujalat kiiltävät '
            + 'kullalta, koska niistä pidetään kiinni molemmin käsin '
            + 'ja toivotaan — yhdellä kädellä tarttuminen on '
            + 'paikallisten mukaan vain aasin kättelyä.',
          selite: 'Gerhard Marcksin patsas Bremenin raatihuoneen '
            + 'vieressä: aasi, koira, kissa ja kukko valmiina '
            + 'säikäyttämään.',
          lahde: 'Dietmar Rabich, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Bremenin soittoniekat',
        },
        {
          otsikko: 'Lääkäri kirjoitti kirjan, jota pelättiin ja rakastettiin',
          aika: '1845',
          tiedosto: 'Heinrich Hoffmann - Buste-Peer eller morsomme Smaafortællinger og pudsige Billeder (Norwegian edition of Der Struwwelpeter publ. by Abelstedt 1862) (02) I Buste-Peer (Struwwelpeter) Nasjonalbiblioteket Public domain.jpg',
          teksti: 'Frankfurtilainen lääkäri Heinrich Hoffmann etsi '
            + 'jouluksi 1844 kuvakirjaa kolmevuotiaalle pojalleen, '
            + 'mutta kaikki olivat hänestä tylsiä — joten hän osti '
            + 'tyhjän vihon ja teki kirjan itse. Struwwelpeterin '
            + 'värssyissä käy huonosti sille, joka ei leikkaa '
            + 'kynsiään, ei syö keittoaan tai leikkii tulitikuilla. '
            + 'Kirjasta tuli maailmanmenestys: suomeksi se ilmestyi '
            + 'nimellä Jörö-Jukka jo 1869, ja englanniksi sen käänsi '
            + 'itse Mark Twain. Nykylukija hymyilee varoituksille, '
            + 'mutta tunnistaa hahmot heti.',
          selite: 'Takkutukkainen Jörö-Jukka norjalaisen painoksen '
            + 'sivulla 1862 — sama kirja levisi kielestä toiseen '
            + 'ympäri maailman.',
          lahde: 'Heinrich Hoffmann / Nasjonalbiblioteket, Wikimedia Commons (Public domain)',
          wiki: 'Jörö-Jukka',
        },
      ],
    },
    {
      id: 'luonto',
      nimi: 'Luonto',
      johdanto: 'Saksan luonto ulottuu vuorovesirannoilta Alppien '
        + 'huipuille, ja metsää on kolmannes koko maasta.',
      nostot: [
        {
          otsikko: 'Meri vetäytyy ja pohja aukeaa',
          tiedosto: 'Wattwanderung auf Norderney 05.jpg',
          teksti: 'Pohjanmeren rannikolla meri vetäytyy kahdesti '
            + 'päivässä kilometrien päähän ja jättää jälkeensä '
            + 'Wattenmeerin: mutatasangon, jota pitkin voi kävellä '
            + 'merenpohjassa saarelta toiselle. Opas kulkee aina '
            + 'mukana, sillä vuoksi palaa nopeammin kuin ihminen '
            + 'juoksee. Pohja näyttää tyhjältä mutta kuhisee elämää: '
            + 'yhdessä neliömetrissä voi asua kymmeniätuhansia matoja, '
            + 'kotiloita ja simpukoita, ja hietikoilla lepää '
            + 'kirjohylkeitä. Vattimeri on Unescon '
            + 'maailmanperintökohde.',
          selite: 'Retkikunta ylittää paljastunutta merenpohjaa '
            + 'Norderneyn saaren edustalla.',
          lahde: 'Stephan Sprinz, Wikimedia Commons (CC BY 4.0)',
          wiki: 'Vattimeri',
        },
        {
          otsikko: 'Liitukalliot hehkuvat valkoisina',
          tiedosto: 'Kreidefelsen Rügen in spring.jpg',
          teksti: 'Rügenin saaren itärannalla metsä päättyy äkkiä sadan '
            + 'metrin valkoiseen pudotukseen. Liitukalliot ovat '
            + 'muinaisen meren pohjaa: liitu on syntynyt miljardien '
            + 'pikkuruisten levänkuorien kerrostumista kymmenien '
            + 'miljoonien vuosien aikana, ja kallioista löytää yhä '
            + 'fossiileja. Korkein kohta on 118-metrinen Königsstuhl, '
            + 'Kuninkaanistuin. Taidemaalari Caspar David Friedrich '
            + 'maalasi kalliot 1818, ja taulusta tuli niin kuuluisa, '
            + 'että sitä pidetään Saksan romantiikan tunnuskuvana.',
          selite: 'Liitukallioita Jasmundin kansallispuistossa Rügenillä '
            + 'keväällä.',
          lahde: 'NilsMargott, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Rügen',
        },
        {
          otsikko: 'Sudet palasivat sadan vuoden tauon jälkeen',
          tiedosto: 'Europäischer Wolf im Wildpark Tambach.jpg',
          teksti: 'Viimeinen Saksan susi ammuttiin 1900-luvun alussa, '
            + 'ja sata vuotta maa oli sudeton. Vuonna 2000 Lausitzin '
            + 'seudulle Itä-Saksaan syntyi ensimmäinen uusi pentue, '
            + 'kun sudet vaelsivat rajan yli Puolasta — ne asettuivat '
            + 'armeijan vanhalle harjoitusalueelle, jossa kukaan ei '
            + 'häirinnyt. Nykyään Saksassa elää taas noin kaksisataa '
            + 'laumaa. Paluu jakaa mielipiteitä: lammasfarmarit '
            + 'suojaavat katraitaan aidoin ja koirin, ja susikannan '
            + 'kasvua seurataan tarkasti.',
          selite: 'Euroopansusi lepäilee villieläinpuistossa '
            + 'Tambachissa — luonnonvaraista sutta on vaikea saada '
            + 'kuvaan.',
          lahde: 'Stephan van Helden, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Susi',
        },
        {
          otsikko: 'Metsä, joka oppi tekemään kelloja',
          tiedosto: 'Kuckucksuhr (Schonach) jm178577.jpg',
          teksti: 'Schwarzwald, Mustametsä, on niin tiheää kuusikkoa, '
            + 'että se näyttää kaukaa mustalta — siitä nimi. Talvet '
            + 'olivat pitkiä, ja 1700-luvulla maatilojen väki alkoi '
            + 'vuolla pimeinä kuukausina puusta kelloja, joita '
            + 'kaupattiin keväällä selässä kannettavilla telineillä '
            + 'ympäri Eurooppaa. Kelloon lisättiin lintu, joka kertoo '
            + 'tunnit kukkumalla — käki siksi, että sen kutsu on '
            + 'helppo matkia kahdella urkupillillä. Schonachin kylässä '
            + 'voi kävellä sisään maailman suurimpaan käkikelloon.',
          selite: 'Schonachin jättikäkikellon puinen koneisto on '
            + 'kuusikymmentä kertaa tavallista suurempi — kello '
            + 'rakennettiin kokonaisen talon sisään.',
          lahde: 'joergens.mi, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Käkikello',
        },
      ],
    },
    {
      id: 'tiede',
      nimi: 'Tiede',
      johdanto: 'Neljä saksalaista keksintöä, jotka muuttivat maailmaa: '
        + 'painettu kirja, luiden läpi näkevä säde, uusi käsitys '
        + 'ajasta ja ensimmäinen tietokone.',
      nostot: [
        {
          otsikko: 'Kirjoja alkoi valmistua sadoittain',
          tiedosto: 'Gutenberg Bible (Pelplin copy) 02.jpg',
          teksti: 'Ennen Johannes Gutenbergia kirja syntyi niin, että '
            + 'munkki kopioi sen käsin — yhteen kirjaan meni '
            + 'kuukausia. Mainzilainen kultaseppä valoi 1450-luvulla '
            + 'jokaisen kirjaimen omaksi metallipalakseen, jotka '
            + 'voitiin latoa sanoiksi, painaa arkille ja käyttää '
            + 'uudelleen. Ensimmäinen suurtyö oli Raamattu, jota '
            + 'painettiin noin 180 kappaletta — jokaisesta tuli '
            + 'käsin kopioitua halvempi ja siistimpi. Puolessa '
            + 'vuosisadassa Euroopassa oli painettu jo miljoonia '
            + 'kirjoja, ja tieto lähti leviämään vauhdilla, jota '
            + 'kukaan ei enää pysäyttänyt.',
          selite: 'Gutenbergin Raamattu 1450-luvulta. Punaiset '
            + 'korostukset ja nuotinkaltaiset alkukirjaimet '
            + 'viimeisteltiin yhä käsin.',
          lahde: 'Kpalion, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Johannes Gutenberg',
        },
        {
          otsikko: 'Säde näytti luut ihon läpi',
          tiedosto: "First medical X-ray by Wilhelm Röntgen of his wife Anna Bertha Ludwig's hand - 18951222.jpg",
          teksti: 'Wilhelm Röntgen tutki marraskuussa 1895 Würzburgissa '
            + 'sähköpurkauksia lasiputkessa, kun huoneen poikki '
            + 'pimeässä hohti jotain, minkä ei pitänyt olla '
            + 'mahdollista: säteily läpäisi pahvin, puun ja kirjan '
            + 'sivut. Hän nimesi tuntemattoman säteen X:ksi. '
            + 'Joulukuussa hän kuvasi vaimonsa Anna Berthan käden — '
            + 'kuvassa näkyvät luut ja sormus, ja vaimon kerrotaan '
            + 'huudahtaneen: "Olen nähnyt oman kuolemani!" Röntgen sai '
            + 'historian ensimmäisen fysiikan Nobelin 1901 eikä '
            + 'patentoinut keksintöään: se kuului hänen mielestään '
            + 'kaikille.',
          selite: 'Maailman ensimmäinen lääketieteellinen röntgenkuva '
            + '22. joulukuuta 1895: Anna Bertha Ludwigin käsi '
            + 'sormuksineen.',
          lahde: 'Wilhelm Röntgen, Wikimedia Commons (Public domain)',
          wiki: 'Wilhelm Röntgen',
        },
        {
          otsikko: 'Ajatuskokeet mullistivat käsityksen ajasta',
          tiedosto: 'Albert Einstein by Mishkin, 1921.png',
          teksti: 'Ulmissa syntynyt Albert Einstein mietti '
            + 'nuorena, miltä maailma näyttäisi, jos valonsäteen '
            + 'rinnalla voisi lentää. Ajatuskokeista kasvoi '
            + 'suhteellisuusteoria, jonka hän viimeisteli Berliinissä '
            + '1915: aika ei kulje kaikille samaa vauhtia, ja painava '
            + 'kappale taivuttaa jopa valon reittiä. Kun brittiläinen '
            + 'retkikunta mittasi auringonpimennyksessä 1919 tähtien '
            + 'valon taipuvan juuri kuten teoria ennusti, Einsteinista '
            + 'tuli yhdessä yössä maailman kuuluisin tiedemies. '
            + 'Nykyään hänen teoriaansa tarvitaan joka kerta, kun '
            + 'puhelin näyttää sijainnin kartalla.',
          selite: 'Albert Einstein valokuvattuna New Yorkissa 1921 — '
            + 'samana vuonna hän sai Nobelin palkinnon.',
          lahde: 'Herman Mishkin, Wikimedia Commons (Public domain)',
          wiki: 'Albert Einstein',
        },
        {
          otsikko: 'Ensimmäinen tietokone syntyi kotona',
          tiedosto: 'Z3 Deutsches Museum.JPG',
          teksti: 'Berliiniläinen rakennusinsinööri Konrad Zuse kyllästyi '
            + 'laskemaan samoja kaavoja käsin ja alkoi rakentaa '
            + 'laskukonetta vanhempiensa olohuoneeseen. Vuonna 1941 '
            + 'valmistunut Z3 oli maailman ensimmäinen ohjelmoitava '
            + 'tietokone: se luki ohjelmansa rei\'itetyltä '
            + 'filminauhalta ja laski 2 600 releen naksuessa. Kone '
            + 'tuhoutui pommituksessa 1943, eikä maailma huomannut '
            + 'koko keksintöä ennen kuin vuosia myöhemmin. Zuse '
            + 'rakensi koneensa uudelleen — ja jäljennös naksuttaa '
            + 'nykyään museossa Münchenissä.',
          selite: 'Z3:n jäljennös Deutsches Museumissa Münchenissä. '
            + 'Alkuperäinen tuhoutui pommituksessa 1943.',
          lahde: 'Venusianer, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Konrad Zuse',
        },
      ],
    },
    /*
     * Sarjakuva lehden viimeisenä aiheena (omistajan toive 7.8.2026:
     * "Sarjakuva ja valokuva olisi kiva saada jonnekin myös") — kuin
     * oikean sanomalehden takasivu. Ruudut selataan gallerianuolista,
     * ja selite kertoo tarinan ruutu ruudulta. Kujeeksi valittiin
     * leipomokuje: se on kirjan lempeimpiä. Kuvat silmätarkistettu
     * 480 px:ssä 7.8.2026.
     */
    /*
     * Valokuvaus on oma osionsa (omistajan linjaus 7.8.2026), EI
     * lisäys maa-etusivun loppuun — ja sivu tehdään vain maille,
     * joilta löytyy vapaasti käytettävä valokuvaaja ("kaikkiin
     * kaupunkeihin ei tarvitse kaikkia sivuja liittää"). Sivun
     * lopussa on lisäksi Päivän kuva maailmalta -palsta (paketti
     * samassa kansiossa) — ui.js liittää sen id:n 'valokuvaus'
     * perusteella.
     */
    {
      id: 'menovinkit',
      nimi: 'Menovinkit',
      johdanto: 'Saksassa lähes jokainen museo, arkisto ja kirjasto on vienyt '
        + 'kokoelmansa verkkoon, ja moni on antanut kuvat vapaaseen käyttöön. '
        + 'Bachin käsiala ja Blossfeldtin kasvit ovat parin klikkauksen '
        + 'päässä.',
      lista: [
        {
          otsikko: 'Museot ja galleriat',
          kohteet: [
            {
              nimi: 'Städel-museo Frankfurt — kokoelma zoomattavana',
              tiedosto: 'Johannes Vermeer - The Geographer - Google Art Project.jpg',
              teksti: 'Frankfurtin Städelissä on yli 25 000 teosta verkossa, muun '
                + 'muassa Vermeerin Maantieteilijä. Etusivun arpakuutio '
                + 'heittää kolme sanaa ja etsii niihin sopivan maalauksen.',
              selite: 'Maalaus tutkijasta sinisessä kaavussa: hän nojaa ikkunan '
                + 'ääressä pöytään, jolla on kartta, ja kaapin päällä seisoo '
                + 'maapallo.',
              lahde: 'Johannes Vermeer, Wikimedia Commons (public domain)',
              linkki: 'https://sammlung.staedelmuseum.de/en',
            },
            {
              nimi: 'Pinakothekit München — Baijerin maalaukset yhdessä haussa',
              tiedosto: 'Dürer - Selbstbildnis im Pelzrock - Alte Pinakothek.jpg',
              teksti: 'Baijerin valtion taidekokoelmien 17 museota ja yli 27 000 '
                + 'teosta ovat samassa haussa. Mukana on Dürerin omakuva '
                + 'vuodelta 1500, jossa hän katsoo suoraan katsojaa silmiin.',
              selite: 'Omakuva tummaa taustaa vasten: pitkät kiharat hiukset, '
                + 'turkiskauluksinen takki ja käsi rinnan päällä.',
              lahde: 'Albrecht Dürer, Wikimedia Commons (public domain)',
              linkki: 'https://www.sammlung.pinakothek.de/en',
            },
            {
              nimi: 'Dresdenin taidekokoelmat — Zwingerin aarteet verkossa',
              tiedosto: 'Jean-Etienne Liotard - The Chocolate Girl - Google Art Project.jpg',
              teksti: 'Dresdenin viidentoista museon esineet ovat yhdessä haussa: '
                + 'vanhat mestarit, Vihreän holvin jalokivityöt ja Liotardin '
                + 'Suklaatyttö, joka on maalattu pastelliliiduilla.',
              selite: 'Nuori nainen sivuprofiilissa kantaa tarjotinta, jolla on '
                + 'suklaakuppi ja vesilasi. Yllä keltainen liivi, valkoinen '
                + 'esiliina ja myssy.',
              lahde: 'Jean-Étienne Liotard, Wikimedia Commons (public domain)',
              linkki: 'https://skd-online-collection.skd.museum/',
            },
            {
              nimi: 'Germanisches Nationalmuseum — Nürnbergin esineluettelo',
              tiedosto: 'Erdglobus, sogenannter Behaim-Globus.jpg',
              teksti: 'Saksan suurimman kulttuurihistoriallisen museon '
                + 'luettelossa on maailman vanhin säilynyt maapallo vuodelta '
                + '1492. Siitä puuttuu Amerikka, koska sitä ei vielä '
                + 'tunnettu.',
              selite: 'Vanha maapallo rautajalustalla: sininen meri, kellertävät '
                + 'maat ja messinkinen vanne pallon ympärillä.',
              lahde: 'Germanisches Nationalmuseum, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://objektkatalog.gnm.de/',
            },
            {
              nimi: 'Berliinin valtionmuseot — kokoelmahaku',
              tiedosto: 'Ishtar Gate - Pergamonmuseum - Berlin - Germany 2017.jpg',
              teksti: 'Berliinin valtionmuseoilla on yhteinen kokoelmahaku, jossa '
                + 'on esineitä kaikista sen museoista. Pergamonmuseumin '
                + 'Ištarin portti on niistä tunnetuin: sinisiksi lasitettuja '
                + 'tiiliä, joiden pintaan on muotoiltu leijonia ja '
                + 'lohikäärmeitä.',
              selite: 'Ištarin portti museosalissa: syvänsininen tiiliseinä, '
                + 'jossa kulkee rivejä keltaisia leijonia, ja portin edessä '
                + 'kävijöitä kokovertailuksi.',
              lahde: 'José Luiz, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://recherche.smb.museum/',
            },
            {
              nimi: 'Bauhaus Kooperation — koulun oma arkisto',
              tiedosto: 'Außenansichten des Bauhaus-Gebäudes in Dessau 01.jpg',
              teksti: 'Bauhaus oli taidekoulu, joka toimi Saksassa vain vuodesta '
                + '1919 vuoteen 1933. Silti sen ajatus siitä, miltä tuoli, '
                + 'lamppu, talo tai kirjasin saa näyttää, näkyy yhä lähes '
                + 'kaikkialla.',
              selite: 'Dessaun Bauhaus-rakennus ulkoa: pitkä lasiseinä nurkasta '
                + 'katsottuna ja pystysuora betonipinta, jossa lukee alhaalta '
                + 'ylös BAUHAUS.',
              lahde: 'JensKunstfreund, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://bauhauskooperation.de/',
            },
          ],
        },
        {
          otsikko: 'Valokuvausnäyttelyt',
          kohteet: [
            {
              nimi: 'Münchner Stadtmuseum — valokuva-albumit verkossa',
              teksti: 'Museon verkkokokoelmassa on kymmeniä valokuvanäyttelyitä '
                + 'albumeina: käsin väritettyjä matkakuvia 1800-luvun '
                + 'Japanista, fotoform-ryhmän kokeiluja ja Otto Steinertin '
                + 'töitä.',
              linkki: 'https://sammlungonline.muenchner-stadtmuseum.de/',
            },
            {
              nimi: 'Die Photographische Sammlung Köln — valokuvaajat aakkosissa',
              tiedosto: 'Karl Blossfeldt. Cucurbita, 1928.jpg',
              teksti: 'Kölnin valokuvakokoelmaan kuuluvat August Sanderin '
                + 'muotokuvat ja Karl Blossfeldtin kasvikuvat. '
                + 'Aakkosellisesta luettelosta pääsee jokaisen valokuvaajan '
                + 'omalle sivulle.',
              selite: 'Mustavalkoinen lähikuva kurpitsan kärhistä: ohuet varret '
                + 'kiertyvät tiukoiksi spiraaleiksi vaaleaa taustaa vasten.',
              lahde: 'Karl Blossfeldt, Wikimedia Commons (public domain)',
              linkki: 'https://photographie-stiftungkultur.de/bestaende',
            },
            {
              nimi: 'Museum Folkwang Essen — valokuvakokoelma',
              teksti: 'Essenin Folkwang on yksi Saksan tärkeimmistä '
                + 'valokuvamuseoista. Se säilyttää kokonaisia valokuvaajien '
                + 'jäämistöjä negatiiveineen, ja kuvat selataan museon '
                + 'verkkohaussa.',
              linkki: 'https://www.museum-folkwang.de/de/sammlung/fotografische-sammlung',
            },
            {
              nimi: 'Bundesarchiv Wikimedia Commonsissa',
              tiedosto: 'Bundesarchiv Bild 183-63107-0001, Berlin, Postzeitungsvertrieb, Zeitungshändlerin.jpg',
              teksti: 'Saksan liittovaltion arkisto luovutti valtavan määrän '
                + 'valokuviaan vapaaseen käyttöön Wikimedia Commonsiin.',
              selite: 'Mustavalkokuva Friedrichstraßen aseman edestä: lehtimyyjä '
                + 'pitelee sylissään paksua nippua sanomalehtiä ja hymyilee '
                + 'kameralle.',
              lahde: 'Günter Weiß, Wikimedia Commons (CC BY-SA 3.0 de)',
              linkki: 'https://commons.wikimedia.org/wiki/Category:Images_from_the_German_Federal_Archive',
            },
          ],
        },
        {
          otsikko: 'Kirjastot ja arkistot',
          kohteet: [
            {
              nimi: 'Deutsche Digitale Bibliothek — koko Saksa yhdessä haussa',
              tiedosto: 'Weimar, Herzogin Anna Amalia Bibliothek, 2019-09 CN-03.jpg',
              teksti: 'Deutsche Digitale Bibliothek kokoaa saksalaisten '
                + 'museoiden, arkistojen ja kirjastojen aineistot samaan '
                + 'hakuun.',
              selite: 'Weimarin Anna Amalian kirjaston rokokoosali: valkoiset ja '
                + 'kullatut hyllyt kahdessa kerroksessa, marmoririntakuvia '
                + 'lattiatasolla ja parvekekaide keskellä.',
              lahde: 'Steffen Schmitz, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://www.deutsche-digitale-bibliothek.de/',
            },
            {
              nimi: 'Staatsbibliothek zu Berlin — digitoidut käsikirjoitukset',
              tiedosto: 'BWV 232 Titelblatt Missa.jpg',
              teksti: 'Berliinin valtionkirjasto säilyttää suurinta osaa Johann '
                + 'Sebastian Bachin säilyneistä nuottikäsikirjoituksista, ja '
                + 'ne on digitoitu.',
              selite: 'Kellastunut kansilehti ruskealla musteella: ylinnä lukee '
                + 'Missa, oikeassa reunassa luettelo äänistä ja soittimista '
                + 'ja alimpana nimikirjoitus J. S. Bach.',
              lahde: 'Johann Sebastian Bach, Wikimedia Commons (public domain)',
              linkki: 'https://digital.staatsbibliothek-berlin.de/',
            },
            {
              nimi: 'Münchener DigitalisierungsZentrum — kolme miljoonaa niteen sivua',
              teksti: 'Baijerin valtionkirjaston digitointikeskuksessa on yli '
                + 'kolme miljoonaa digitoitua käsikirjoitusta, karttaa, '
                + 'nuottia ja sanomalehteä, kaikki selattavissa sivu '
                + 'kerrallaan.',
              linkki: 'https://www.digitale-sammlungen.de/en/',
            },
            {
              nimi: 'Wolfenbüttelin herttuakirjasto — keskiajan käsikirjoitukset',
              tiedosto: 'Gospels1.jpg',
              teksti: 'Käsikirjoitustietokannassa selataan keskiaikaisia '
                + 'koodekseja aukeama kerrallaan. Talon kuuluisin aarre on '
                + 'Heinrich Leijonan kultaisin kirjaimin kirjoitettu '
                + 'evankeliumikirja.',
              selite: 'Keskiaikainen käsikirjoitussivu: ylhäällä kruunattu hahmo '
                + 'ympyrän sisällä, alhaalla neljä juhla-asuista henkilöä, '
                + 'reunoissa punaista, vihreää ja kultaa.',
              lahde: 'Wikimedia Commons (public domain)',
              linkki: 'https://diglib.hab.de/?db=mss',
            },
            {
              nimi: 'LeMO — Saksan historia aikajanana',
              teksti: 'Deutsches Historisches Museumin verkkomuseo kulkee '
                + 'vuodesta 1815 nykypäivään. Aikajanalta pääsee esineisiin, '
                + 'valokuviin, silminnäkijävideoihin ja 360 asteen '
                + 'kohteisiin.',
              linkki: 'https://www.dhm.de/lemo/',
            },
          ],
        },
        {
          otsikko: 'Musiikki ja esitykset',
          kohteet: [
            {
              nimi: 'Beethoven-Haus Bonn — säveltäjän oma arkisto',
              tiedosto: 'Beethoven.jpg',
              teksti: 'Beethovenin syntymätalon digitaalisessa arkistossa on '
                + 'nuottikäsikirjoituksia, kirjeitä ja kuvia. Osassa '
                + 'käsikirjoituksia musiikki soi samaan aikaan kuin sivua '
                + 'selaa.',
              selite: 'Muotokuva Beethovenista: harmaa tukka pörröllä, punainen '
                + 'kaulahuivi ja käsissä nuottivihko ja kynä.',
              lahde: 'Joseph Karl Stieler, Wikimedia Commons (public domain)',
              linkki: 'https://www.beethoven.de/en/archive',
            },
            {
              nimi: 'Elbphilharmonie Hampuri — konsertteja mediateekissa',
              teksti: 'Hampurin aaltokattoisen konserttitalon mediateekissa '
                + 'katsotaan ilmaiseksi tallennettuja konsertteja, myös '
                + 'lapsille tehtyjä Funkelkonzert-esityksiä, ja kuunnellaan '
                + 'podcasteja.',
              linkki: 'https://www.elbphilharmonie.de/en/mediatheque',
            },
          ],
        },
        {
          otsikko: 'Tiede ja tekniikka',
          kohteet: [
            {
              nimi: 'Deutsches Museum Digital — tekniikan kokoelmat',
              tiedosto: 'An exhibition hall in Deutsches Museum in Munich.jpg',
              teksti: 'Münchenin Deutsches Museum on yksi maailman suurimmista '
                + 'tekniikan ja luonnontieteen museoista, ja sen '
                + 'kokoelmatietokanta on avoin.',
              selite: 'Museon korkea sali kattoikkunan alla: valtava vauhtipyörä, '
                + 'pystysuora höyrykone ja rivi vanhoja koneita matalilla '
                + 'jalustoilla.',
              lahde: 'Robert von Oliva, Wikimedia Commons (CC0)',
              linkki: 'https://digital.deutsches-museum.de/',
            },
            {
              nimi: 'Museum für Naturkunde Berlin — Archaeopteryx ja Tristan',
              tiedosto: 'Archaeopteryx lithographica (Berlin specimen).jpg',
              teksti: 'Berliinin luonnontieteellisessä museossa on maailman '
                + 'kuuluisin Archaeopteryx-fossiili ja Tristan-niminen '
                + 'tyrannosaurus. Sivustolla on ääniopastuksia ja '
                + 'digitaalisia näyttelyitä.',
              selite: 'Vaalea kivilaatta, johon on painautunut linnun luuranko '
                + 'sulkineen: kaula taipuu taakse ja pitkät sormet levittyvät '
                + 'sivuille.',
              lahde: 'H. Raab (User: Vesta), Wikimedia Commons (CC BY-SA 3.0)',
              linkki: 'https://www.museumfuernaturkunde.berlin/en',
            },
          ],
        },
        {
          otsikko: 'Luonto ja retket',
          kohteet: [
            {
              nimi: 'NABU-webkamerat — pesäkuvaa suorana',
              tiedosto: 'Heidekrug Münster Storch mit Jungen.jpg',
              teksti: 'Saksan luonnonsuojeluliiton kamerat näyttävät suorana '
                + 'kattohaikaran pesän, tornipöllöt ja muuttohaukat. Keväällä '
                + 'poikaset kuoriutuvat ja kasvavat kameran edessä.',
              selite: 'Kattohaikara seisoo risupesässä katon yläpuolella nokka '
                + 'auki, ja pesän reunan takaa pilkistää poikasen pää.',
              lahde: 'Daydove, Wikimedia Commons (CC BY-SA 3.0)',
              linkki: 'https://www.nabu.de/wir-ueber-uns/infothek/webcams/index.html',
            },
            {
              nimi: 'Zugspitze — Saksan korkein huippu kameran takaa',
              teksti: 'Kamera kuvaa Saksan korkeinta vuorta muutaman minuutin '
                + 'välein. Kuvat jäävät arkistoon, joten samasta paikasta voi '
                + 'katsoa aikalapsun tai vertailla eilistä säätä tähän '
                + 'päivään.',
              linkki: 'https://www.foto-webcam.eu/webcam/zugspitze/',
            },
          ],
        },
      ],
    },
  ],
  FRA: [
    {
      id: 'historia',
      nimi: 'Historia',
      johdanto: 'Ranskan historia on jäänyt talteen poikkeuksellisen konkreettisina '
        + 'esineinä: luolan seinään, seitsemänkymmenmetriseen kirjontaan, '
        + 'linnoituksen raunioihin ja saliin, joka rakennettiin pelkästä '
        + 'valosta.',
      nostot: [
        {
          otsikko: 'Neljä poikaa ja koira löysivät luolan',
          aika: 'n. 17 000 vuotta sitten',
          tiedosto: 'Lascaux painting.jpg',
          teksti: 'Syyskuussa 1940 neljä teini-ikäistä poikaa etsi koiraansa '
            + 'Dordognen metsässä ja putosi kuoppaan. Alta paljastui '
            + 'luolasto, jonka seinät olivat täynnä maalattuja hevosia, '
            + 'hirviä ja alkuhärkiä. Maalaukset ovat noin 17 000 vuotta '
            + 'vanhoja. Luola avattiin yleisölle sodan jälkeen, mutta '
            + 'kävijöiden hengitys alkoi tuhota värejä, ja se suljettiin '
            + 'vuonna 1963. Viereen rakennettiin tarkka jäljennös, jossa '
            + 'käydään yhä.',
          selite: 'Luolan seinä, jolle on maalattu suuria alkuhärkiä mustin '
            + 'ääriviivoin ja niiden lomaan pienempiä hevosia ruskean ja '
            + 'keltaisen sävyin.',
          lahde: 'Wikimedia Commons (public domain)',
          wiki: 'Lascaux’n luola',
        },
        {
          otsikko: 'Seitsemänkymmentä metriä sarjakuvaa pellavalle',
          aika: '1070-luku',
          tiedosto: 'Bayeux Tapestry 32-33 comet Halley Harold.jpg',
          teksti: 'Bayeux\'n seinävaate kertoo, miten Normandian herttua Vilhelm '
            + 'valloitti Englannin vuonna 1066. Se ei ole kudottu vaan '
            + 'kirjottu villalangalla pellavakankaalle, ja sitä on lähes '
            + 'seitsemänkymmentä metriä. Kuvat etenevät kohtaus kohtaukselta '
            + 'kuin sarjakuva, ja niiden yllä kulkee latinankielinen '
            + 'tekstirivi. Yhdessä kohtauksessa ihmiset osoittavat taivaalle: '
            + 'siellä näkyy Halleyn komeetta, joka todella ohitti maan samana '
            + 'vuonna.',
          selite: 'Kirjottu kohtaus, jossa miehet osoittavat sormellaan taivaalla '
            + 'näkyvää komeettaa; vieressä istuu kruunattu Harold ja '
            + 'yläpuolella lukee ISTI MIRANT STELLA.',
          lahde: 'Myrabella, Wikimedia Commons (public domain)',
          wiki: 'Bayeux’n seinävaate',
        },
        {
          otsikko: 'Linnoituksessa oli vain seitsemän vankia',
          aika: '1789',
          tiedosto: 'Jean-Baptiste Lallemand - La prise de la Bastille, le 14 juillet 1789 - P1718 - Musée Carnavalet.jpg',
          teksti: 'Bastilji oli keskiaikainen linnoitus, jota kuningas käytti '
            + 'vankilana. Kun väkijoukko valtasi sen 14. heinäkuuta 1789, '
            + 'sisällä oli seitsemän vankia — ei yhtään kuuluisaa. Merkitys '
            + 'ei ollutkaan vangeissa vaan siinä, mitä rakennus edusti: '
            + 'kuningas saattoi sulkea kenet tahansa sinne ilman '
            + 'oikeudenkäyntiä. Linnoitus purettiin heti, ja päivästä tuli '
            + 'Ranskan kansallispäivä, jota vietetään yhä joka vuosi.',
          selite: 'Maalaus valtauspäivästä: savua nousee linnoituksen muurien '
            + 'takaa, etualalla ihmisiä tykkien kanssa ja kaatuneita maassa.',
          lahde: 'Jean-Baptiste Lallemand, Wikimedia Commons (public domain)',
          wiki: 'Bastiljin valtaus',
        },
        {
          otsikko: 'Sali, joka rakennettiin valosta',
          aika: '1678–1684',
          tiedosto: 'Chateau Versailles Galerie des Glaces.jpg',
          teksti: 'Versaillesin peilisali on 73 metriä pitkä käytävä, jonka '
            + 'toisella seinällä on ikkunat puutarhaan ja toisella yhtä monta '
            + 'peiliä niitä vastapäätä. Peilejä on 357. Se oli 1600-luvulla '
            + 'tavaton ylellisyys: peili oli kallis ja Venetsia varjeli '
            + 'valmistustaitoaan tarkasti. Kun kynttilät sytytettiin illalla, '
            + 'valo heijastui edestakaisin ja sali näytti kaksi kertaa '
            + 'suuremmalta. Nykyään sinne pääsee tavallisella pääsylipulla.',
          selite: 'Pitkä juhlasali, jossa kultaiset kynttiläkruunut riippuvat '
            + 'holvin alla ja aurinko piirtää ikkunoista ruudukon '
            + 'parkettilattiaan.',
          lahde: 'Myrabella, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Peilisali',
        },
      ],
    },
    {
      id: 'menovinkit',
      nimi: 'Menovinkit',
      johdanto: 'Ranska on avannut verkkoon sen, mihin ei muuten pääse: luolan '
        + 'johon kukaan ei saa astua, museon varastot kokonaisuudessaan ja '
        + 'ilmakuvat, joilla oman kylän voi katsoa seitsemänkymmentä vuotta '
        + 'taaksepäin.',
      lista: [
        {
          otsikko: 'Museot ja luolat',
          kohteet: [
            {
              nimi: 'Louvren kokoelmat — koko kokoelma verkossa',
              tiedosto: 'Cour Napoléon at night - Louvre.jpg',
              teksti: 'Louvren kokoelmatietokannassa on yli 480 000 teosta — eli '
                + 'paljon enemmän kuin museon seinillä on tilaa.',
              selite: 'Louvren sisäpiha illalla: lasipyramidi hehkuu keskellä ja '
                + 'vanhan palatsin siivet kaartuvat sen ympärille '
                + 'valaistuina.',
              lahde: 'Benh Lieu Song, Wikimedia Commons (CC BY 2.5)',
              linkki: 'https://collections.louvre.fr/',
            },
            {
              nimi: 'Chauvet\'n luola — virtuaalikierros',
              tiedosto: 'Lions painting, Chauvet Cave (museum replica).jpg',
              teksti: 'Chauvet\'n luola löytyi vuonna 1994, ja sen maalaukset ovat '
                + 'noin 36 000 vuotta vanhoja — kaksi kertaa vanhempia kuin '
                + 'Lascaux\'n.',
              selite: 'Luolamaalaus, jossa rivi leijonan päitä on piirretty '
                + 'mustalla hiilellä vaaleaa kalkkikiveä vasten, katseet '
                + 'samaan suuntaan.',
              lahde: 'Wikimedia Commons (public domain)',
              linkki: 'https://archeologie.culture.gouv.fr/chauvet/en',
            },
            {
              nimi: 'Centre Pompidou — nykytaiteen kokoelma',
              tiedosto: 'Interior of the Centre Pompidou 2.jpg',
              teksti: 'Centre Pompidou on Pariisin nykytaiteen museo, ja sen '
                + 'rakennus on itsessään osa juttua: putket, ilmastointi ja '
                + 'portaat vietiin julkisivulle, jotta sisälle jäisi '
                + 'mahdollisimman paljon tyhjää tilaa.',
              selite: 'Museon aulakerros sisältä: katossa kulkee paksuja sinisiä '
                + 'putkia ja teräsristikkoa, alhaalla jonotusköydet ja '
                + 'muutama kävijä.',
              lahde: 'DiscoA340, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://www.centrepompidou.fr/en/',
            },
          ],
        },
        {
          otsikko: 'Arkistot ja ilmakuvat',
          kohteet: [
            {
              nimi: 'Remonter le temps — Ranska ilmasta ennen ja nyt',
              tiedosto: 'Vue aérienne de la région de Luxeuil-les-Bains - Froideconche - btv1b53237326r.jpg',
              teksti: 'Ranskan karttalaitos on kuvannut koko maan ilmasta '
                + '1900-luvun alusta lähtien, ja kuvat ovat verkossa. '
                + 'Remonter le temps -palvelussa ruutu jaetaan kahtia: '
                + 'toisella puolella on nykyinen kartta ja toisella vanha '
                + 'ilmakuva samasta paikasta.',
              selite: 'Vanha mustavalkoinen ilmakuva lasilevylle: kylä '
                + 'jokimutkassa, ympärillä kapeita peltosarkoja ja teitä kuin '
                + 'viivapiirroksena.',
              lahde: 'Jean Baumont, Wikimedia Commons (public domain)',
              linkki: 'https://remonterletemps.ign.fr/',
            },
            {
              nimi: 'INA — Ranskan radio- ja tv-arkisto',
              tiedosto: 'Auditorium de la Maison de la Radio, Paris 2018.jpg',
              teksti: 'INA on Ranskan valtion audiovisuaalinen arkisto, joka '
                + 'tallentaa maan radio- ja tv-lähetykset.',
              selite: 'Radiotalon konserttisali: seinät ja parvet ovat vaaleaa '
                + 'puuta portaittain, ja lavalla on yksinään flyygeli.',
              lahde: 'Jean-Pierre Dalbéra, Wikimedia Commons (CC BY 2.0)',
              linkki: 'https://www.ina.fr/',
            },
          ],
        },
      ],
    },
  ],
  NLD: [
    {
      id: 'menovinkit',
      nimi: 'Menovinkit',
      johdanto: 'Alankomaat on skannannut itsensä verkkoon: maalaukset '
        + 'pikselintarkkoina, salainen takahuoneisto kolmiulotteisena, '
        + 'sanomalehdet vuodesta 1618 ja museo, jossa tyrannosaurus odottaa '
        + 'ilman pääsylippua.',
      lista: [
        {
          otsikko: 'Museot ja taide',
          kohteet: [
            {
              nimi: 'Rijksmuseum — kokoelma ja Rijksstudio verkossa',
              tiedosto: 'Amsterdam-3418-Rijksmuseum-2008-gje.jpg',
              teksti: 'Rijksmuseum Amsterdamissa on kuvaillut verkkoon yli puoli '
                + 'miljoonaa kokoelmansa esinettä ja julkaissut niistä '
                + 'satojatuhansia valokuvia.',
              selite: 'Rijksmuseumin punatiilinen päärakennus tornineen '
                + 'Museumpleinin nurmikon takana; edessä suuret punavalkoiset '
                + 'I amsterdam -kirjaimet.',
              lahde: 'Gerd Eichmann, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://www.rijksmuseum.nl/en/collection',
            },
            {
              nimi: 'Rijksmuseum — Yövartio äärimmäisen tarkkana kuvana',
              tiedosto: 'Rembrandt Night Watch Girl.jpg',
              teksti: 'Rembrandtin Yövartio vuodelta 1642 valokuvattiin '
                + 'uudelleen, kun museo alkoi tutkia ja korjata sitä. '
                + 'Tuloksena on 717 gigapikselin kuva eli 717 000 000 000 '
                + 'pikseliä: suurin ja tarkin valokuva, joka taideteoksesta '
                + 'on koskaan otettu.',
              selite: 'Yksityiskohta Yövartiosta: kultapukuinen tyttö, jonka '
                + 'hiuksissa on koristepanta ja jonka kasvot on maalattu '
                + 'paksuin siveltimenvedoin.',
              lahde: 'Rembrandt, Wikimedia Commons (public domain)',
              linkki: 'https://www.rijksmuseum.nl/en/stories/operation-night-watch/story/ultra-high-resolution-photo',
            },
            {
              nimi: 'Van Gogh Museum — kokoelma verkossa',
              tiedosto: 'Amandelbloesem - s0176V1962 - Van Gogh Museum.jpg',
              teksti: 'Van Gogh Museum Amsterdamissa omistaa maailman suurimman '
                + 'Vincent van Goghin kokoelman, ja verkossa siitä on yli '
                + 'tuhat maalausta, piirustusta ja kirjettä.',
              selite: 'Van Goghin maalaus Amandelbloesem vuodelta 1890: valkoisia '
                + 'mantelinkukkia ja mutkaisia oksia kirkkaan turkoosia '
                + 'taivasta vasten.',
              lahde: 'Vincent van Gogh, Wikimedia Commons (public domain)',
              linkki: 'https://www.vangoghmuseum.nl/en/collection',
            },
          ],
        },
        {
          otsikko: 'Historia ja luonto',
          kohteet: [
            {
              nimi: 'Anne Frank Huis — takahuoneisto pohjapiirroksena ja 3D:nä',
              tiedosto: 'AnneFrankHouseAmsterdamtheNetherlands.jpg',
              teksti: 'Frankin perhe siirtyi piiloon heinäkuussa 1942 '
                + 'Prinsengracht 263:n takarakennukseen. Viikkoa myöhemmin '
                + 'tuli van Pelsin perhe ja neljän kuukauden päästä Fritz '
                + 'Pfeffer — kahdeksan ihmistä yli kahdeksi vuodeksi.',
              selite: 'Anne Frankin talo Prinsengrachtin varrella iltavalossa: '
                + 'kapea tummanruskea tiilitalo, jonka korkeissa ikkunoissa '
                + 'on valkoiset karmit.',
              lahde: 'Massimo Catarinella, Wikimedia Commons (CC BY-SA 3.0)',
              linkki: 'https://www.annefrank.org/en/anne-frank/secret-annex/',
            },
            {
              nimi: 'Delpher — hollantilaiset lehdet ja kirjat 1618 alkaen',
              tiedosto: 'Courante uyt Italien, Duytslandt, &c. 1618-11-23.jpg',
              teksti: 'Delpher on Alankomaiden kansalliskirjaston hakupalvelu, '
                + 'jossa on yli kaksi miljoonaa sanomalehteä vuosilta '
                + '1618–1995, lähes 500 000 aikakauslehteä ja 200 000 kirjaa.',
              selite: 'Courante uyt Italien, Duytslandt -lehden sivu marraskuulta '
                + '1618: tiheää vanhaa fraktuuratekstiä kahdessa palstassa '
                + 'ilman yhtään kuvaa.',
              lahde: 'Wikimedia Commons (public domain)',
              linkki: 'https://www.delpher.nl/',
            },
            {
              nimi: 'Naturalis — virtuaalimuseo',
              tiedosto: 'Trix - lateral view.jpg',
              teksti: 'Naturalis Leidenissä on yksi maailman suurimmista '
                + 'luonnontieteellisistä kokoelmista: lähes 200 vuodessa '
                + 'kertyneet 43 miljoonaa esinettä, sammalista '
                + 'dinosauruksiin.',
              selite: 'Trix-tyrannosauruksen luuranko pystytettynä '
                + 'näyttelysaliin: pää painuneena alas, hännän ja kaulan '
                + 'muodostama kaari sinistä seinää vasten.',
              lahde: 'Rique, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://www.naturalis.nl/en/virtualmuseum',
            },
          ],
        },
      ],
    },
  ],
  PRT: [
    {
      id: 'menovinkit',
      nimi: 'Menovinkit',
      johdanto: 'Portugalin parhaat paikat ovat verkossa ja ilmaisia: zoomattava '
        + 'hirviömaalaus, kuninkaan kultavaunut sisältä, kuusituhatta '
        + 'fadolevyä ja kamera, joka näyttää maailman suurimmat aallot juuri '
        + 'nyt.',
      lista: [
        {
          otsikko: 'Museot ja kokoelmat',
          kohteet: [
            {
              nimi: 'Google Arts & Culture — Pyhän Antoniuksen kiusaukset zoomattavana',
              tiedosto: 'Temptation of Saint Anthony.jpg',
              teksti: 'Museu Nacional de Arte Antiga Lissabonissa omistaa '
                + 'Hieronymus Boschin Pyhän Antoniuksen kiusaukset noin '
                + 'vuodelta 1500.',
              selite: 'Boschin kolmiosainen maalaus: keskellä palava kylä ja '
                + 'raunioitunut torni, sivupaneeleissa ihmisiä ja hirviöitä, '
                + 'ilmassa lentäviä olentoja.',
              lahde: 'Hieronymus Bosch, Wikimedia Commons (public domain)',
              linkki: 'https://artsandculture.google.com/asset/the-temptations-of-st-anthony-jheronymus-bosch/WwHN8Z7G17mnkA',
            },
            {
              nimi: 'Museu Calouste Gulbenkian — perustajan kokoelma verkossa',
              tiedosto: 'Portugal, Lisbon, Gulbenkian Museum, Peacock Corsage, René Lalique (52593923406).jpg',
              teksti: 'Calouste Gulbenkian oli öljymies, joka keräsi elämänsä '
                + 'aikana noin 6 000 taideteosta ja jätti ne Lissabonille.',
              selite: 'Laliquen riikinkukkokoriste: kullattu lintu levittää '
                + 'pyrstönsä, jonka vihreissä emalilehdissä hohtaa opaaleja.',
              lahde: 'Lark Ascending, Wikimedia Commons (public domain)',
              linkki: 'https://gulbenkian.pt/museu/en/works_museu/',
            },
            {
              nimi: 'Google Arts & Culture — vaunumuseon salit katunäkymänä',
              tiedosto: 'Coach of the Oceans (18th century) (37767646395).jpg',
              teksti: 'Lissabonin vaunumuseo perustettiin vuonna 1905, kun '
                + 'kuningatar Amélia kokosi kuninkaallisten tallien ajopelit '
                + 'yhteen saliin. Google Arts & Culturen katunäkymässä museo '
                + 'aukeaa niin, että vaunujen välissä voi kävellä ja kääntyä '
                + 'ympäri.',
              selite: 'Valtamerten vaunu museosalissa: punainen samettikatos, '
                + 'valtavat kullatut kaiverretut pyörät ja perässä ryhmä '
                + 'kullattuja veistoshahmoja.',
              lahde: 'Pedro Ribeiro Simões, Wikimedia Commons (CC BY 2.0)',
              linkki: 'https://artsandculture.google.com/streetview/national-coach-museum-the-coaches/UgHIa6HsKttsmA',
            },
          ],
        },
        {
          otsikko: 'Kirjat, musiikki ja meri',
          kohteet: [
            {
              nimi: 'Biblioteca Nacional Digital — Os Lusíadas vuoden 1572 painoksena',
              tiedosto: 'Large hall in the Biblioteca Nacional de Portugal.jpg',
              teksti: 'Portugalin kansalliskirjaston digitaalinen kokoelma '
                + 'avattiin vuonna 2002, ja ensimmäinen siihen viety teos oli '
                + 'Luís de Camõesin Os Lusíadas.',
              selite: 'Kansalliskirjaston suuri lukusali Lissabonissa: puinen '
                + 'kasettikatto kattoikkunoineen, takaseinällä iso kudottu '
                + 'seinävaate ja rivi lukupöytiä.',
              lahde: 'Threeohsix, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://purl.pt/1/1/',
            },
            {
              nimi: 'Museu do Fado — digitaalinen ääniarkisto',
              tiedosto: 'Lisbon. Tribute to Fado legends of Mouraria. (27072597077).jpg',
              teksti: 'Lissabonin fadomuseon digitaalinen ääniarkisto on '
                + 'Portugalin suurin äänitekokoelma verkossa: 6 159 raitaa, '
                + 'vanhimmat 1900-luvun alusta.',
              selite: 'Mourarian kujalla Lissabonissa: talon seinään on '
                + 'kehystetty suuria mustavalkoisia muotokuvia '
                + 'fadolaulajista, kadulla kävelee mies.',
              lahde: 'Vernaccia, Wikimedia Commons (CC BY 2.0)',
              linkki: 'https://arquivosonoro.museudofado.pt/en',
            },
            {
              nimi: 'Beachcam — Nazaré, Praia do Norte suorana',
              tiedosto: '10 meters - Nazaré - Portugal - Flickr - Carlos Eduardo Joos.jpg',
              teksti: 'Nazarén edustalla merenpohjassa on 230 kilometriä pitkä ja '
                + 'paikoin 5 000 metriä syvä kanjoni. Se ohjaa Atlantin '
                + 'myrskyjen voiman suoraan rantaan, ja siksi Praia do '
                + 'Nortessa nousevat maailman suurimmat surffatut aallot.',
              selite: 'Surffaaja vihreällä laudalla laskee jättiaallon rinnettä '
                + 'Nazarén edustalla; aallon harja murtuu vaahdoksi hänen '
                + 'yläpuolellaan.',
              lahde: 'Carlos Eduardo Joos, Wikimedia Commons (CC BY 2.0)',
              linkki: 'https://beachcam.meo.pt/livecams/praia-do-norte-canhao-nazare/',
            },
          ],
        },
      ],
    },
  ],
  GRC: [
    {
      id: 'menovinkit',
      nimi: 'Menovinkit',
      johdanto: 'Kreikan aarteet ovat auki selaimessa: Akropoliille pääsee '
        + 'paikkoihin, joihin kävijää ei päästetä, marmoripatsaita saa '
        + 'pyörittää käsissään, ja maanjäristykset piirtyvät kartalle sitä '
        + 'mukaa kuin maa tärisee.',
      lista: [
        {
          otsikko: 'Antiikki ja museot',
          kohteet: [
            {
              nimi: 'Acropolis Virtual Tour — 360°-kierros Akropoliilla',
              tiedosto: 'Athens Acropolis Propylaea (28411780906).jpg',
              teksti: 'Akropoliin monumenttien suojelupalvelu ΥΣΜΑ kuvasi '
                + 'kukkulan 360 asteen panoraamoina, ja kierros aukeaa '
                + 'suoraan selaimessa.',
              selite: 'Akropoliin porttirakennus Propylaia alhaalta kuvattuna: '
                + 'pylväiden kapiteelit, marmoriset kattopalkit ja pilviä '
                + 'sinisellä taivaalla.',
              lahde: 'Gary Todd, Wikimedia Commons (CC0)',
              linkki: 'https://www.acropolisvirtualtour.gr/',
            },
            {
              nimi: 'Museum of Cycladic Art — Objects 360°',
              tiedosto: 'EC II schematic male figurine of the Chalandriani variety by the Goulandris Hunter-Warrior Sculptor from Spedos - Athens MCA NG 308 - 01.jpg',
              teksti: 'Ateenan Kykladisen taiteen museo on tehnyt 20 esineestään '
                + 'kolmiulotteiset mallit. Niitä voi kääntää, kallistaa ja '
                + 'katsoa takaapäin — sitä museosalissa ei saa tehdä.',
              selite: 'Kykladinen marmoripatsas lähikuvassa: pää ja ylävartalo, '
                + 'kädet vatsan päällä ja rinnan yli kulkeva viiltokoristeltu '
                + 'olkanauha. Kasvoista on veistetty vain nenä.',
              lahde: 'ArchaiOptix, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://cycladic.gr/en/experience-category/objects360-en/',
            },
            {
              nimi: 'Kotsanas Museum — antiikin keksinnöt',
              tiedosto: 'Antikythera Mechanism - National Archaeological Museum, Athens by Joy of Museum.jpg',
              teksti: 'Kotsanaksen museo rakentaa toimivia kopioita antiikin '
                + 'kreikkalaisista koneista, ja jokaisella on verkossa oma '
                + 'sivunsa: yli 90 keksintöä yli 30 aihepiirissä.',
              selite: 'Antikytheran mekanismin vihertäviä pronssinpaloja '
                + 'vitriinissä. Keskimmäisessä palassa erottuu iso '
                + 'hammasratas ja sen ympärillä pienempiä rattaita.',
              lahde: 'Joyofmuseums, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://kotsanas.com/exhibits/',
            },
          ],
        },
        {
          otsikko: 'Arkistot ja maan liike',
          kohteet: [
            {
              nimi: 'SearchCulture.gr — koko Kreikka yhdessä haussa',
              tiedosto: 'Karaghiozis1.JPG',
              teksti: 'SearchCulture.gr kokoaa kreikkalaisten museoiden, '
                + 'arkistojen ja kirjastojen digitoinnit samaan hakuun: 1 085 '
                + '547 kohdetta 163 kokoelmasta.',
              selite: 'Puinen Karagiozis-hahmo talon oven vieressä Ateenassa: '
                + 'varjoteatterin kujeilija paljain jaloin, iso nenä ja '
                + 'paikattu takki.',
              lahde: 'Aeleftherios, Wikimedia Commons (CC BY-SA 3.0)',
              linkki: 'https://www.searchculture.gr/aggregator/portal/?language=en_US',
            },
            {
              nimi: 'BSA Digital Collections — hae kaivausarkistosta',
              tiedosto: 'Knossos Throne-room 20230604 110755.jpg',
              teksti: 'Britannian Ateenan-instituutti on kaivanut Kreikassa '
                + '1880-luvulta asti, ja sen arkisto on nyt verkossa: 36 048 '
                + 'kuvallista kohdetta.',
              selite: 'Knossoksen valtaistuinsalin seinämaalaus, joka '
                + 'entistettiin 1900-luvun alussa: makaava aarnikotka '
                + 'punaisella pohjalla ja valkoisia ruokokasveja ympärillä.',
              lahde: 'Rigorius, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://digital.bsa.ac.uk/',
            },
            {
              nimi: 'Geodynamic Institute — järistyskartta reaaliajassa',
              tiedosto: 'Raised beach western Crete.jpg',
              teksti: 'Kreikassa maa tärisee lähes päivittäin, ja Ateenan '
                + 'observatorion geodynaaminen instituutti seuraa sitä ympäri '
                + 'vuorokauden.',
              selite: 'Länsi-Kreetan rannikkoa Paleochoran lähellä: '
                + 'kallioseinämän meriluolat ja aallon syömä lovi ovat nyt '
                + 'noin yhdeksän metriä merenpinnan yläpuolella, sillä vuoden '
                + '365 maanjäristys nosti rantaa.',
              lahde: 'Mikenorton, Wikimedia Commons (CC BY-SA 3.0)',
              linkki: 'https://www.gein.noa.gr/en/',
            },
          ],
        },
      ],
    },
  ],
  POL: [
    {
      id: 'menovinkit',
      nimi: 'Menovinkit',
      johdanto: 'Puola on avannut kokoelmansa verkkoon isolla kädellä: '
        + 'kansalliskirjaston käsikirjoituksia, Chopinin omaa käsialaa, '
        + 'suolakaivos katunäkymänä, museoesineitä 3D:nä ja kirja, jossa on '
        + 'jokainen maailman visentti.',
      lista: [
        {
          otsikko: 'Kirjastot ja museot',
          kohteet: [
            {
              nimi: 'Polona — Puolan kansalliskirjaston digitaalinen kokoelma',
              tiedosto: 'Psałterz-floriański-7r.jpg',
              teksti: 'Polona on Puolan kansalliskirjaston digitaalinen kokoelma '
                + 'ja maan suurin: kirjoja, sanomalehtiä, karttoja, '
                + 'julisteita, nuotteja ja käsikirjoituksia, kaikki ilman '
                + 'kirjautumista ja maksua.',
              selite: 'Aukeama Florianin psalttarista: sinikultainen koristeltu '
                + 'B-alkukirjain, tiheää käsialaa kahdessa palstassa ja '
                + 'reunuksissa kiemurtelevia lehtiä, joiden seassa on '
                + 'pikkuruisia ihmishahmoja.',
              lahde: 'Tuntematon tekijä, Wikimedia Commons (public domain)',
              linkki: 'https://polona.pl/',
            },
            {
              nimi: 'Wirtualne Muzea Małopolski — esineet käännettävinä',
              tiedosto: 'Wawel heads Cracow.jpg',
              teksti: 'Wirtualne Muzea Małopolski on skannannut yli tuhat '
                + 'esinettä 42 museosta Krakovan seudulta, ja niitä voi '
                + 'kääntää ruudulla joka suuntaan.',
              selite: 'Mustavalkokuva neljästä Wawelin puupäästä kasettikaton '
                + 'koristeellisten kehysten sisällä: lattapäähineinen mies, '
                + 'seppelepäinen nainen, valkolakkinen hahmo ja partainen '
                + 'mies baskerissa.',
              lahde: 'S. Kolowca, Wikimedia Commons (public domain)',
              linkki: 'https://muzea.malopolska.pl/en/objects-list',
            },
            {
              nimi: 'Cyfrowe MNW — Varsovan kansallismuseon kokoelmat',
              tiedosto: 'Faras Saint Anne.jpg',
              teksti: 'Varsovan kansallismuseo on vienyt verkkoon lähes 60 000 '
                + 'esinettä. Erikoisin osa on Farasin galleria.',
              selite: 'Farasin katedraalista irrotettu seinämaalaus 700-luvulta: '
                + 'pyhä Anna huivi päässään, etusormi huulillaan, ja '
                + 'ympärillä kreikankielinen teksti rapautuneella '
                + 'kalkkipinnalla.',
              lahde: 'Tuntematon taiteilija (Faras), Wikimedia Commons (public domain)',
              linkki: 'https://cyfrowe.mnw.art.pl/en/catalog',
            },
          ],
        },
        {
          otsikko: 'Musiikki, maan alla ja metsässä',
          kohteet: [
            {
              nimi: 'Chopin Heritage in Open Access — koko Chopin-kokoelma',
              tiedosto: 'Op.27 Nocturne.jpg',
              teksti: 'Fryderyk Chopinin instituutti digitoi koko kokoelmansa '
                + 'vuosina 2017–2020 ja avasi sen verkkoon. Kohteita on 39 '
                + '500: käsikirjoituksia, 500 ensipainosta, 30 000 valokuvaa, '
                + 'Chopinin kirjeitä ja lähes tuhat tuntia äänitteitä.',
              selite: 'Chopinin oma käsikirjoitus nokturnoon op. 27 nro 2 '
                + 'vuodelta 1836: kolme nuottirivistöä käsin vedettyä '
                + 'nuottia, ylhäällä merkintä Lento sostenuto ja reunassa '
                + 'kirjaston pyöreitä leimoja.',
              lahde: 'Frédéric Chopin, Wikimedia Commons (public domain)',
              linkki: 'https://chopin.musicsources.pl/en/',
            },
            {
              nimi: 'Google Arts & Culture — Wieliczkan museoreitti katunäkymänä',
              tiedosto: 'Saint Kinga Chapel in Wieliczka Salt Mine.jpg',
              teksti: 'Wieliczkan suolakaivosta Krakovan kupeessa on kaivettu '
                + '1200-luvulta lähtien, ja suolaa nostettiin sieltä vuoteen '
                + '1996 asti. Käytäviä kertyi 287 kilometriä ja syvyyttä 327 '
                + 'metriä.',
              selite: 'Pyhän Kingan kappeli suolakaivoksessa: valtava maanalainen '
                + 'sali, jonka katosta riippuu kolme suolakidekruunua ja '
                + 'jonka seiniin on veistetty reliefejä.',
              lahde: 'Андрей Романенко, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://artsandculture.google.com/streetview/salt-mine-in-wieliczka-museum-route/0wEn5KBrU5rH3g',
            },
            {
              nimi: 'Białowieżan kansallispuisto — visenttien sukukirja',
              tiedosto: 'Wisent - European bison - Bison bonasus - Wiking.jpg',
              teksti: 'Visentti eli euroopanbiisoni katosi luonnosta 1900-luvun '
                + 'alussa. Vuonna 1923 perustettu kansainvälinen '
                + 'suojeluyhdistys laski jäljellä olevat puhdasrotuiset '
                + 'eläimet: niitä oli 54, kaikki tarhoissa.',
              selite: 'Visenttisonni makaa kukkivalla niityllä Białowieżan '
                + 'metsässä ja katsoo suoraan kameraan; paksut sarvet '
                + 'kaartuvat ylöspäin ja takana on tumma metsänreuna.',
              lahde: 'Bouke ten Cate, Wikimedia Commons (CC BY 4.0)',
              linkki: 'https://bpn.gov.pl/ksiega-rodowodowa-zubrow',
            },
          ],
        },
      ],
    },
  ],
  CHE: [
    {
      id: 'menovinkit',
      nimi: 'Menovinkit',
      johdanto: 'Sveitsi on pieni maa, mutta sen verkkoon mahtuu paljon: 3 049 '
        + 'keskiaikaista kirjaa, viisi petatavua hiukkasfysiikkaa, 3,5 '
        + 'miljoonaa vanhaa valokuvaa, 10 000 kelloa ja Matterhorn sellaisena '
        + 'kuin se juuri nyt näyttää.',
      lista: [
        {
          otsikko: 'Käsikirjoitukset ja kokoelmat',
          kohteet: [
            {
              nimi: 'e-codices — Sveitsin käsikirjoitukset verkossa',
              tiedosto: 'St. Gall Gospels Cod.Sang.51 - p.6 - Carpet page.jpg',
              teksti: 'e-codices on Sveitsin virtuaalinen käsikirjoituskirjasto. '
                + 'Siellä on 3 049 käsikirjoitusta sadasta eri kokoelmasta, '
                + 'ja jokainen on kuvattu sivu sivulta.',
              selite: 'Koristesivu vanhasta evankeliumikirjasta: punaisia, '
                + 'okrankeltaisia ja sinisiä punossolmuja, jotka muodostavat '
                + 'ristin kellastuneelle pergamentille.',
              lahde: 'Wikimedia Commons (public domain)',
              linkki: 'https://www.e-codices.unifr.ch/en',
            },
            {
              nimi: 'E-Pics Bildarchiv — ETH-kirjaston kuva-arkisto',
              tiedosto: 'ETH-BIB-Luzern, Altstadt, Wasserturm, Kapellbrücke-Inlandflüge-LBS MH01-001755.tif',
              teksti: 'ETH-korkeakoulun kirjaston kuva-arkistossa on 3,5 '
                + 'miljoonaa valokuvaa. Mukana ovat Swissairin oma arkisto, '
                + 'Comet Photo AG:n uutiskuvat, postikorttikokoelmia ja '
                + 'lentäjä Walter Mittelholzerin ilmakuvat 1920- ja '
                + '1930-luvuilta.',
              selite: 'Mittelholzerin ilmakuva Luzernin vanhastakaupungista: '
                + 'katettu Kapellbrücke-silta kulkee viistosti joen yli ja '
                + 'kahdeksankulmainen vesitorni seisoo vedessä.',
              lahde: 'Walter Mittelholzer, Wikimedia Commons (public domain)',
              linkki: 'https://ba.e-pics.ethz.ch/',
            },
            {
              nimi: 'Sammlung Online — Sveitsin kansallismuseo',
              tiedosto: 'Landesmuseum Zürich, 2017.jpg',
              teksti: 'Sveitsin kansallismuseo säilyttää maan omaa historiaa: '
                + 'pukuja, huonekaluja, aseita, kolikoita, leluja ja '
                + 'tavallisen arjen esineitä.',
              selite: 'Kansallismuseon sisäpiha Zürichissä: linnamainen '
                + '1800-luvun lopun rakennus torneineen ja holvikäytävineen, '
                + 'pihalla kahvilan pöytiä.',
              lahde: 'Burkhard Mücke, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://sammlung.nationalmuseum.ch/de',
            },
          ],
        },
        {
          otsikko: 'Tiede, kellot ja vuoret',
          kohteet: [
            {
              nimi: 'CERN Open Data — CMS:n tapahtumakatselin',
              tiedosto: 'CERN LHC CMS 11.jpg',
              teksti: 'CERN on Geneven kupeessa, osaksi Sveitsin ja osaksi '
                + 'Ranskan puolella. Sen kiihdytin on 27 kilometrin mittainen '
                + 'rengas maan alla.',
              selite: 'CMS-ilmaisimen kylki maan alla: kerroksittain '
                + 'elektroniikkaa, punaisia ja vihreitä paneeleja ja satoja '
                + 'sinisiä kaapeleita.',
              lahde: 'SimonWaldherr, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://opendata.cern.ch/visualise/events/cms',
            },
            {
              nimi: 'Musée international d\'horlogerie — kokoelmat',
              tiedosto: 'Pocket Watch (Switzerland), 1850–53 (CH 18475631).jpg',
              teksti: 'La Chaux-de-Fonds on kellojen kaupunki Jura-vuorilla, ja '
                + 'koko kaupunki on Unescon maailmanperintökohde.',
              selite: 'Sveitsiläinen kultainen taskukello 1850-luvulta: kanteen '
                + 'on maalattu pieni emalikuva, vieressä kellonketju ja '
                + 'pehmeä nahkapussi.',
              lahde: 'Wikimedia Commons (public domain)',
              linkki: 'https://www.mih.ch/en/watch-collections/',
            },
            {
              nimi: 'Zermatt — Matterhornin webkamerat',
              tiedosto: 'Matterhorn Riffelsee 2005-06-11.jpg',
              teksti: 'Zermattin matkailutoimisto pitää yllä webkameroita, jotka '
                + 'kuvaavat Matterhornia ja sen ympärysvuoria. Vuori on 4 478 '
                + 'metriä korkea ja melkein täydellinen kolmio.',
              selite: 'Matterhorn peilautuu Riffelseen pintaan: lumihuippuinen '
                + 'kolmio sinistä taivasta vasten ja sama kuva ylösalaisin '
                + 'vedessä.',
              lahde: 'Dirk Beyer, Wikimedia Commons (CC BY-SA 3.0)',
              linkki: 'https://zermatt.swiss/en/info/webcams',
            },
          ],
        },
      ],
    },
  ],
  NOR: [
    {
      id: 'menovinkit',
      nimi: 'Menovinkit',
      johdanto: 'Norja on avannut verkkoon sen, mihin ei muuten pääse: Huudon '
        + 'siveltimenjäljet, viikinkilaivan jonka museo on kiinni, koko '
        + 'kansan nimet vuodesta 1769 ja kartan, joka kertoo missä revontulet '
        + 'juuri nyt palavat.',
      lista: [
        {
          otsikko: 'Taide ja kirjallisuus',
          kohteet: [
            {
              nimi: 'Nasjonalmuseet — Huuto zoomattavana',
              tiedosto: 'Edvard Munch, 1893, The Scream, oil, tempera and pastel on cardboard, 91 x 73 cm, National Gallery of Norway.jpg',
              teksti: 'Norjan kansallismuseon verkkokokoelmassa Huuto aukeaa '
                + 'zoomattavana kuvana. Vuoden 1893 versio on niistä '
                + 'ensimmäinen, maalattu pahville temperalla ja '
                + 'rasvaliidulla.',
              selite: 'Munchin Huuto vuodelta 1893: sillalla seisova hahmo painaa '
                + 'kädet poskilleen suu auki, taustalla verenpunainen taivas '
                + 'ja sinipyörteinen vuono.',
              lahde: 'Edvard Munch, Wikimedia Commons (public domain)',
              linkki: 'https://www.nasjonalmuseet.no/en/collection/object/NG.M.00939',
            },
            {
              nimi: 'Henrik Ibsens skrifter — Peer Gynt 1867',
              tiedosto: 'Peer Gynt et dramatisk Digt.png',
              teksti: 'Oslon yliopisto on julkaissut Henrik Ibsenin koko '
                + 'tuotannon verkkoon ilmaiseksi. Peer Gynt aukeaa siinä '
                + 'asussa, jossa se ilmestyi vuonna 1867: vanha kirjoitustapa '
                + 'ja ensipainoksen sivunvaihdot näkyvissä.',
              selite: 'Sivu Peer Gyntin ensipainoksesta vuodelta 1867: säkeitä '
                + 'ladottuna tiheään vanhalla kirjoitusasulla kellastuneelle '
                + 'paperille.',
              lahde: 'Henrik Ibsen, Wikimedia Commons (public domain)',
              linkki: 'https://www.ibsen.uio.no/DRVIT_PG%7CPGht.html',
            },
          ],
        },
        {
          otsikko: 'Viikingit ja retkikunnat',
          kohteet: [
            {
              nimi: 'Vikingtidsmuseet — Osebergin kokoelma verkossa',
              tiedosto: 'Oseberg ship-Vikingskipshuset, Oslo.jpg',
              teksti: 'Osebergin laiva rakennettiin tammesta noin vuonna 820 ja '
                + 'haudattiin maakumpuun kahden naisen kanssa. Kummallakin '
                + 'laidalla on 15 airoreikää, eli täysi miehistö oli 30 '
                + 'soutajaa.',
              selite: 'Osebergin laiva museon valkoisessa holvisalissa: musta '
                + 'tammirunko kaartuu ylös keulaan asti, ja vieressä seisovat '
                + 'kävijät jäävät sen rinnalla pieniksi.',
              lahde: 'Yair-haklai, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://www.vikingtidsmuseet.no/english/the-collection/',
            },
            {
              nimi: 'Kon-Tiki-museo — Heyerdahlin retkikunnat',
              tiedosto: 'Kon-Tiki raft, side view.jpg',
              teksti: 'Kon-Tiki lähti Perun Callaosta 28. huhtikuuta 1947. Lautta '
                + 'oli sidottu balsapuun rungoista, kippari oli 33-vuotias '
                + 'Thor Heyerdahl, ja mukana oli viisi miestä ja papukaija.',
              selite: 'Kon-Tiki-lautta museossa: paksut balsapuurungot on sidottu '
                + 'köysillä yhteen, päällä on bambumaja ja purje, ja vieressä '
                + 'liehuu Norjan lippu.',
              lahde: 'Wikipek, Wikimedia Commons (CC0)',
              linkki: 'https://www.kon-tiki.no/en/heyerdahls-expeditions',
            },
          ],
        },
        {
          otsikko: 'Arkistot ja taivas',
          kohteet: [
            {
              nimi: 'Digitalarkivet — Norjan väestönlaskennat',
              tiedosto: 'Riksarkivet på Sognsvann i Oslo.jpg',
              teksti: 'Digitalarkivet on Norjan kansallisarkiston ilmainen '
                + 'hakupalvelu. Sinne on kirjoitettu puhtaaksi maan '
                + 'väestönlaskennat vuosilta 1769, 1801, 1815, 1865, 1900 ja '
                + 'aina vuoteen 1920 asti.',
              selite: 'Norjan kansallisarkiston rakennus Oslon Sognsvannissa: '
                + 'valkoinen betonijulkisivu, lasinen sisäänkäynti ja '
                + 'seinällä Norjan vaakuna kruunattuine leijonineen.',
              lahde: 'Arete23, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://www.digitalarkivet.no/en/censuses',
            },
            {
              nimi: 'Norwegian Centre for Space Weather — revontulet juuri nyt',
              tiedosto: 'Northern Lights - Aurora Borealis Ringvassøya Tromsø Norway.jpg',
              teksti: 'Tromssan geofysikaalinen observatorio laskee koko ajan, '
                + 'missä revontulivyöhyke juuri nyt kaartuu. Kartalla vihreä '
                + 'kaari kelluu Pohjolan yllä, ja punainen kolmio merkitsee '
                + 'Tromssaa: jos kaari osuu kolmion päälle, ulkona kannattaa '
                + 'käydä.',
              selite: 'Revontulet Ringvassøyalla lähellä Tromssaa: vihreä nauha '
                + 'kaartuu tähtitaivaan poikki lumisen maan ja paljaiden '
                + 'koivunoksien yllä.',
              lahde: 'Svein-Magne Tunli, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://site.uit.no/spaceweather/data-and-products/aurora/tromso/nowcast/',
            },
          ],
        },
      ],
    },
  ],
  DNK: [
    {
      id: 'menovinkit',
      nimi: 'Menovinkit',
      johdanto: 'Tanska on siirtänyt itsensä ruudulle: kansallisgallerian teokset '
        + 'saa ladata koneelle, koko maa näkyy ilmasta vuodesta 1890, '
        + 'kirkkojen holvimaalauksia selataan aiheittain ja merikotkanpesään '
        + 'näkee suorana.',
      lista: [
        {
          otsikko: 'Taide ja tarinat',
          kohteet: [
            {
              nimi: 'SMK Open — Tanskan kansallisgallerian kokoelma',
              tiedosto: 'Christen Købke, Parti af Østerbro i morgenbelysning, 1836, KMS844, Statens Museum for Kunst.jpg',
              teksti: 'Tanskan kansallisgalleria SMK on avannut kokoelmansa '
                + 'verkkoon. Tietokannassa on yli 200 000 kohdetta, ja 150 '
                + '893 niistä on jo tekijänoikeuksista vapaita.',
              selite: 'Christen Købken maalaus vuodelta 1836: aamuvalossa lehmiä '
                + 'ajetaan pitkin Østerbron katua Kööpenhaminassa, vasemmalla '
                + 'järven kulma ja oikealla korkea poppelirivi.',
              lahde: 'Christen Købke, Wikimedia Commons (public domain)',
              linkki: 'https://open.smk.dk/',
            },
            {
              nimi: 'Kalkmalerier.dk — keskiaikaiset kirkkomaalaukset',
              tiedosto: 'Fanefjord Kirke - kalkmalerier1.jpg',
              teksti: 'Tanskaan rakennettiin vuosina 1050–1250 yli 2 000 kirkkoa, '
                + 'ja niiden holvit maalattiin täyteen kuvia. Kalkmalerier.dk '
                + 'on kuvannut näitä maalauksia 538 kirkosta, '
                + 'kymmeniätuhansia otoksia vuosilta 1100–1600.',
              selite: 'Fanefjordin kirkon holvi Mønin saarella: punaruskeaa '
                + 'kasviornamenttia, enkeleitä ja keskellä Kristus soikion '
                + 'sisällä. Oikealla näkyy puinen saarnastuoli.',
              lahde: 'Hubertus, Wikimedia Commons (CC BY-SA 3.0)',
              linkki: 'https://www.kalkmalerier.dk/',
            },
            {
              nimi: 'The Complete Andersen — kaikki sadut verkossa',
              tiedosto: 'Hans Christian Andersen by Thora Hallager 1869.jpg',
              teksti: 'H.C. Andersen kirjoitti paljon muutakin kuin Pienen '
                + 'merenneidon ja Ruman ankanpoikasen.',
              selite: 'Thora Hallagerin valokuva vuodelta 1869: H.C. Andersen '
                + 'istuu sivuttain kameraan, terävä profiili, rusetti '
                + 'kaulassa ja samettikaulus takissa.',
              lahde: 'Thora Hallager, Wikimedia Commons (public domain)',
              linkki: 'https://andersen.sdu.dk/vaerk/hersholt/',
            },
          ],
        },
        {
          otsikko: 'Maa, muinaisuus ja linnut',
          kohteet: [
            {
              nimi: 'Danmark set fra Luften — Tanska ilmasta vuodesta 1890',
              tiedosto: 'Kongskildegård, 1950.jpg',
              teksti: 'Tanskan kuninkaallisella kirjastolla on noin kolme '
                + 'miljoonaa ilmakuvaa vuosilta 1890–2010. Lentokoneesta '
                + 'kuvattiin talo talolta, ja kuvat myytiin asukkaille.',
              selite: 'Mustavalkoinen ilmakuva vuodelta 1950: tanskalainen '
                + 'maatila lammen rannalla, valkoiset rakennukset pihan '
                + 'ympärillä ja lehmiä laitumella. Negatiivissa näkyy vaalea '
                + 'naarmu.',
              lahde: 'Sylvest Jensen Luftfoto / Det Kgl. Bibliotek, Wikimedia Commons (CC BY 4.0)',
              linkki: 'https://www.kb.dk/danmarksetfraluften/',
            },
            {
              nimi: 'Fund og Fortidsminder — muinaisjäännökset kartalla',
              tiedosto: 'Poskær Stenhus, forår 2015.jpg',
              teksti: 'Tanskan valtio pitää rekisteriä kaikista maan '
                + 'muinaisjäännöksistä ja arkeologisista löydöistä, ja '
                + 'rekisteri on auki kenelle tahansa.',
              selite: 'Poskær Stenhus Itä-Jyllannissa: pyöreä kivikehä ympäröi '
                + 'matalaa kumpua, jonka päällä lepää valtava kattokivi '
                + 'kannatinkivien varassa. Takana on kevätpuinen metsä.',
              lahde: 'Old Dane, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://www.kulturarv.dk/fundogfortidsminder/',
            },
            {
              nimi: 'ØrneTV — merikotkat suorana',
              tiedosto: 'White-tailed eagle (22856267294).jpg',
              teksti: 'Tanskan lintuyhdistys DOF lähettää suoraa kuvaa '
                + 'merikotkien pesältä Fugleværnsfondenin '
                + 'luonnonsuojelualueelta Saksfjed-Hyllekrogissa Lollannin '
                + 'saarella.',
              selite: 'Merikotka lähikuvassa: keltainen koukkunokka, keltaiset '
                + 'silmät ja vaalea pää, takana sumea vihreä niitty.',
              lahde: 'Susanne Nilsson, Wikimedia Commons (CC BY-SA 2.0)',
              linkki: 'https://www.dof.dk/oplev-fuglene/ornetv',
            },
          ],
        },
      ],
    },
  ],
  AUT: [
    {
      id: 'menovinkit',
      nimi: 'Menovinkit',
      johdanto: 'Itävalta on avannut verkkoon sen, mitä salissa ei näe: maalin alle '
        + 'jääneet luonnokset, Klimtin kultalehden lähikuvana, 28 miljoonaa '
        + 'sanomalehden sivua, Mozartin oman käsialan ja alppilaakson suorana '
        + 'kuvana.',
      lista: [
        {
          otsikko: 'Taide ja musiikki',
          kohteet: [
            {
              nimi: 'Inside Bruegel — kaksitoista maalausta suurennettuna',
              tiedosto: 'Pieter Bruegel the Elder - Children’s Games - Google Art Project.jpg',
              teksti: 'Kunsthistorisches Museumilla Wienissä on maailman suurin '
                + 'Pieter Bruegel vanhemman kokoelma: kaksitoista maalausta. '
                + 'Museo valokuvasi ne kaikki ja avasi kuvat verkkoon '
                + 'ilmaiseksi.',
              selite: 'Bruegelin Lastenleikit vuodelta 1560: kaupungin aukio ja '
                + 'kadut ovat täynnä lapsia, jotka kieriskelevät, kiipeilevät '
                + 'ja pyörittävät vanteita.',
              lahde: 'Pieter Bruegel vanhempi, Wikimedia Commons (public domain)',
              linkki: 'https://insidebruegel.net/',
            },
            {
              nimi: 'Belvedere — Suudelma museon verkkokokoelmassa',
              tiedosto: 'Gustav Klimt - Der Kuss (Liebespaar) - 912 - Österreichische Galerie Belvedere.jpg',
              teksti: 'Gustav Klimt maalasi Suudelman vuosina 1907–1908. Hän '
                + 'liimasi kankaalle oikeaa kultaa, hopeaa ja platinaa, joten '
                + 'teos kimaltaa yhä.',
              selite: 'Klimtin Suudelma: pari polvistuu kukkivalla niityllä, ja '
                + 'heidän kultaiset viittansa sulautuvat yhdeksi kuvioksi '
                + 'kimaltavaa taustaa vasten.',
              lahde: 'Gustav Klimt, Wikimedia Commons (public domain)',
              linkki: 'https://sammlung.belvedere.at/objects/6678/der-kuss-liebespaar',
            },
            {
              nimi: 'Digitale Mozart-Edition — kirjeet ja asiakirjat',
              tiedosto: 'Mozart Family Croce.jpg',
              teksti: 'Salzburgin Mozarteum-säätiöllä on noin puolet kaikista '
                + 'tunnetuista Mozartin perheen kirjeistä. Verkkoeditiossa '
                + 'niitä on yli 1400, vanhin vuodelta 1747.',
              selite: 'Mozartin perhe noin vuonna 1780: Nannerl ja Wolfgang '
                + 'soittavat samaa kosketinsoitinta, isä Leopold pitää viulua '
                + 'ja seinällä riippuu kuolleen äidin muotokuva.',
              lahde: 'Johann Nepomuk della Croce, Wikimedia Commons (public domain)',
              linkki: 'https://dme.mozarteum.at/DME/briefe/doclist.php',
            },
          ],
        },
        {
          otsikko: 'Arkistot ja vuoret',
          kohteet: [
            {
              nimi: 'ANNO — Wiener Zeitung, vuosi 1873',
              tiedosto: 'Rotunde Weltausstellung 1873.jpg',
              teksti: 'Itävallan kansalliskirjaston ANNO-arkistossa on 28 '
                + 'miljoonaa skannattua sivua ja yli 1600 lehteä. Wiener '
                + 'Zeitung alkoi ilmestyä vuonna 1703, ja se on verkossa '
                + 'ensimmäisestä vuodesta lähtien.',
              selite: 'Wienin maailmannäyttelyn Rotunda keväällä 1873: valtava '
                + 'kupolihalli on vielä telineissä, ja pääportin edessä '
                + 'seisoo joukko tummiin pukeutuneita miehiä.',
              lahde: 'Wiener Photographen-Association, Wikimedia Commons (public domain)',
              linkki: 'https://anno.onb.ac.at/cgi-content/anno?aid=wrz&datum=1873',
            },
            {
              nimi: 'Wien Museum Online Sammlung',
              tiedosto: 'Wien Museum in 2024 02.jpg',
              teksti: 'Wien Museum kerää oman kaupunkinsa tavaraa: muotia, '
                + 'kelloja, Praterin huvipuiston esineitä, kaivauslöytöjä ja '
                + 'taidetta. Verkkokokoelmassa on nyt 135 968 kohdetta ja 212 '
                + '917 kuvaa, ja jokaisesta kohteesta on kuva.',
              selite: 'Näkymä Wien Museumin kattoterassilta iltahämärässä: '
                + 'alhaalla Karlsplatzin aukio ja edessä Karlskirchen vihreä '
                + 'kupoli kahden korkean pylvään välissä.',
              lahde: 'Renek78, Wikimedia Commons (CC0)',
              linkki: 'https://sammlung.wienmuseum.at/',
            },
            {
              nimi: 'Foto-Webcam — Innsbruck Seegruben kamerasta',
              tiedosto: 'Nordkette.jpg',
              teksti: 'Innsbruckin yläpuolella, Nordketten rinteellä 1945 metrin '
                + 'korkeudessa, on kamera joka kuvaa kaupunkia etelään päin. '
                + 'Kuva päivittyy jatkuvasti ja on niin tarkka, että siitä '
                + 'voi etsiä hyppyrimäen, sillat ja Inn-joen mutkat.',
              selite: 'Näkymä Nordketten rinteeltä alas Innsbruckiin: etualalla '
                + 'tyhjiä tuolihissin istuimia, alhaalla kaupunki ja Inn-joki '
                + 'kaartamassa talojen välissä.',
              lahde: 'Blommetjie1, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://www.foto-webcam.eu/webcam/innsbruck/',
            },
          ],
        },
      ],
    },
  ],
  FIN: [
    {
      id: 'menovinkit',
      nimi: 'Menovinkit',
      johdanto: 'Suomen arkistot ja kokoelmat ovat verkossa poikkeuksellisen '
        + 'avoimina: sanomalehdet 1770-luvulta, museoiden kuvat ladattavina '
        + 'ja muinaisjäännökset kartalla.',
      lista: [
        {
          otsikko: 'Arkistot ja lehdet',
          kohteet: [
            {
              nimi: 'Kansalliskirjasto — digitoidut sanomalehdet',
              tiedosto: '1847-10-19 Suometar 42 19 10 1847.jpg',
              teksti: 'Suomen sanomalehdet 1770-luvulta alkaen, sivu sivulta '
                + 'skannattuna. Vuoteen 1939 asti kaikki on vapaasti '
                + 'luettavissa — hae oman kotipaikkakuntasi nimellä.',
              selite: 'Suomettaren etusivu vuodelta 1847 fraktuurakirjaimin.',
              lahde: 'Paavo Tikkanen, Wikimedia Commons (public domain)',
              linkki: 'https://digi.kansalliskirjasto.fi/search?formats=NEWSPAPER',
            },
            {
              nimi: 'Finna — museot ja kirjastot yhdessä haussa',
              teksti: 'Yli kolmensadan suomalaisen museon, kirjaston ja arkiston '
                + 'aineistot samasta hakukentästä. Rajaa haun pelkkiin kuviin '
                + 'tai pelkkiin vapaasti käytettäviin.',
              linkki: 'https://finna.fi/',
            },
            {
              nimi: 'Helsingin kaupunginmuseo — 111 000 valokuvaa',
              tiedosto: 'Munkkisaari, Helsinki 1907.jpg',
              teksti: 'Signe Branderin ja muiden kuvaajien Helsinki sadan vuoden '
                + 'takaa. Melkein kaikki kuvat saa ladata ja käyttää '
                + 'vapaasti.',
              selite: 'Pyykinhuuhtojia Munkkisaaren laiturilla vuonna 1907, '
                + 'taustalla höyrylaiva.',
              lahde: 'Signe Brander, Wikimedia Commons (public domain)',
              linkki: 'https://hkm.finna.fi',
            },
          ],
        },
        {
          otsikko: 'Taide ja perinne',
          kohteet: [
            {
              nimi: 'Kansallisgalleria — 12 000 kuvaa ilman käyttöehtoja',
              tiedosto: 'Albert Edelfelt - Leikkiviä poikia rannalla.jpg',
              teksti: 'Ateneumin, Kiasman ja Sinebrychoffin kokoelmat verkossa. '
                + 'Vanhemmat teokset on merkitty CC0:ksi, eli kuvan saa '
                + 'ladata ja tehdä sillä mitä haluaa.',
              selite: 'Kolme poikaa leikkilaivoineen rantavedessä, taustalla '
                + 'purjelaivoja.',
              lahde: 'Albert Edelfelt, Wikimedia Commons (public domain)',
              linkki: 'https://kokoelma.kansallisgalleria.fi/fi/search',
            },
            {
              nimi: 'SKVR — Suomen Kansan Vanhat Runot',
              tiedosto: 'Runonlaulaja Petri Shemeikka, Ristivaara 1907 (KK3490-590).tif',
              teksti: 'Ne runot, joista Kalevala koottiin, kaikki 34 kirjaa '
                + 'haettavassa muodossa. Voit etsiä laulajan nimellä tai '
                + 'pitäjällä ja lukea saman runon eri versiot vierekkäin.',
              selite: 'Runonlaulaja Petri Shemeikka istumassa hirsitalon edessä '
                + 'vuonna 1907.',
              lahde: 'Samuli Paulaharju, Wikimedia Commons (CC BY 4.0)',
              linkki: 'https://aineistot.finlit.fi/exist/apps/skvr/',
            },
          ],
        },
        {
          otsikko: 'Maastossa ja taivaalla',
          kohteet: [
            {
              nimi: 'Museovirasto — muinaisjäännösrekisteri',
              tiedosto: 'Sammallahdenmäki 1.jpg',
              teksti: 'Yli 40 000 muinaisjäännöstä kartalla. Zoomaa oman '
                + 'kotikuntasi kohdalle ja katso, mitä sen maan alta on '
                + 'löytynyt.',
              selite: 'Sammallahdenmäen pronssikautinen kiviladelma männikössä.',
              lahde: 'kallerna, Wikimedia Commons (CC BY-SA 3.0)',
              linkki: 'https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_default.aspx',
            },
            {
              nimi: 'Ilmatieteen laitos — revontulet ja avaruussää',
              tiedosto: 'Aurora borealis over Saana fell.jpg',
              teksti: 'Onko taivaalla revontulia juuri nyt? Kartta näyttää '
                + 'magneettiset mittausasemat ja vuorokauden käyrän, ja '
                + 'sivulla on sanallinen ennuste.',
              selite: 'Vihreät revontulet Saanatunturin yllä lumisessa '
                + 'maisemassa.',
              lahde: 'WikiLucas00, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://www.ilmatieteenlaitos.fi/revontulet-ja-avaruussaa',
            },
            {
              nimi: 'Paikkatietoikkuna — vanhat kartat päällekkäin',
              teksti: 'Maanmittauslaitoksen karttapalvelu, jossa nykykartan '
                + 'päälle voi ladata vanhoja karttatasoja ja verrata, miten '
                + 'maisema on muuttunut.',
              linkki: 'https://kartta.paikkatietoikkuna.fi/',
            },
            {
              nimi: 'Kansallisarkisto — Astia',
              teksti: 'Digitoituja asiakirjoja kirkonkirjoista karttoihin. '
                + 'Sukututkimuksen aloittamiseen ei tarvita muuta kuin '
                + 'isovanhemman syntymäpitäjä.',
              linkki: 'https://astia.narc.fi/uusiastia/',
            },
          ],
        },
      ],
    },
  ],
  CZE: [
    {
      id: 'menovinkit',
      nimi: 'Menovinkit',
      johdanto: 'Tšekki on siirtänyt menneisyytensä ruudulle: 1300-luvun '
        + 'kuvaraamattu aukeaa sivu kerrallaan, Prahan tähtikelloa saa itse '
        + 'kelata, kolmesataatuhatta museoesinettä on yhdessä haussa ja '
        + 'norsuihin näkee suorana.',
      lista: [
        {
          otsikko: 'Käsikirjoitukset ja kokoelmat',
          kohteet: [
            {
              nimi: 'Manuscriptorium — Velislavin raamattu',
              tiedosto: 'Velislavova bible, NK ČR sign. XXIII.C.124, fol. 182r.jpg',
              teksti: 'Velislavin raamattu tehtiin Prahassa noin vuonna 1340, ja '
                + 'se on keskiajan Keski-Euroopan laajin kuvakirja. '
                + 'Pergamenttilehtiä on 188 ja piirroksia 747.',
              selite: 'Sivu Velislavin raamatusta: ylhäällä kaksi hahmoa ja '
                + 'punakattoinen kirkko, jonka seinää vasten nojaa tikkaat. '
                + 'Alhaalla neljä hahmoa, joista yhdellä on punainen kirja. '
                + 'Latinankieliset rivit erottavat kuvakentät toisistaan.',
              lahde: 'Tuntematon tekijä, Wikimedia Commons (public domain)',
              linkki: 'https://www.manuscriptorium.com/en/digital-library-treasures/-/velislav-bible/',
            },
            {
              nimi: 'eSbírky — Tšekin museokokoelmat verkossa',
              tiedosto: 'Praha, Nové Město, Václavské náměstí, Národní muzeum.jpg',
              teksti: 'eSbírky kokoaa tšekkiläisten museoiden kokoelmat samaan '
                + 'paikkaan: 302 118 esinettä 148 laitoksesta. Sivustoa '
                + 'ylläpitää Tšekin kansallismuseo, ja hakuun pääsee ilman '
                + 'tunnuksia.',
              selite: 'Tšekin kansallismuseo Václavin aukion päässä Prahassa: '
                + 'kupolillinen 1800-luvun rakennus, edessä pyhän Vaclavin '
                + 'ratsastajapatsas ja etualalla valko-keltainen ruusupenkki.',
              lahde: 'PatrikPaprika, Wikimedia Commons (CC BY-SA 3.0)',
              linkki: 'https://www.esbirky.cz/',
            },
            {
              nimi: 'Mucha Foundation — Browse Works',
              tiedosto: 'Alphonse Mucha - Zodiac, 1869.jpg',
              teksti: 'Alfons Mucha teki Pariisissa julisteita, joiden kaartuvat '
                + 'kukat, kehykset ja pitkät hiukset määrittelivät koko '
                + 'jugendtyylin.',
              selite: 'Muchan Zodiac-juliste: punatukkainen nainen profiilissa, '
                + 'päässä koristeellinen otsapanta, taustalla kultainen kehä, '
                + 'jonka sisällä kiertävät kaksitoista eläinradan merkkiä.',
              lahde: 'Alphonse Mucha, Wikimedia Commons (public domain)',
              linkki: 'https://www.muchafoundation.org/gallery/browse-works',
            },
          ],
        },
        {
          otsikko: 'Katso ja kokeile',
          kohteet: [
            {
              nimi: 'Orloj.org — Prahan tähtikellon simulaattori',
              tiedosto: 'Czech-2013-Prague-Astronomical clock face.jpg',
              teksti: 'Prahan raatihuoneen tähtitieteellinen kello on vuodelta '
                + '1410 ja käy yhä. Vanhempaa toimivaa tähtikelloa ei '
                + 'maailmassa ole.',
              selite: 'Orlojin kellotaulu lähikuvassa: kultainen eläinrataympyrä, '
                + 'sinivalkoinen taivaskiekko, auringon kuva käsivarren '
                + 'päässä ja musta kuupallo. Reunoilla kullatut veistokset, '
                + 'oikealla luuranko.',
              lahde: 'Godot13, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://www.orloj.org/orloj/en-US/',
            },
            {
              nimi: 'Prahan eläintarha — Norsulaakso suorana',
              tiedosto: 'ZOO Praha, Elephas maximus, 03.jpg',
              teksti: 'Prahan eläintarhan Norsulaakso lähettää suoraa kuvaa '
                + 'kahdeksasta kamerasta. Kamerat 1–3 ovat sisällä naaraiden '
                + 'pavilongissa, kamerat 4–8 ulkotarhassa, ja kamera 7 '
                + 'näyttää uroksen oman tilan.',
              selite: 'Kaksi aasiannorsua Prahan eläintarhan ulkotarhassa: '
                + 'etummainen kääntyy kohti kameraa, takana toinen norsu '
                + 'betoniseinän edessä, maassa risuja ja oksia.',
              lahde: 'Honza Groh (Jagro), Wikimedia Commons (CC BY-SA 3.0)',
              linkki: 'https://www.zoopraha.cz/en/animals/live-from-elephant-valley',
            },
            {
              nimi: 'Muzeum loutkářských kultur — kokoelma verkossa',
              tiedosto: 'Chrudim, Muzeum loutkářských kultur (3).JPG',
              teksti: 'Chrudimin nukketeatterimuseolla on yli 50 000 '
                + 'kokoelmaesinettä, ja pelkkiä nukkeja on yli 10 000 eri '
                + 'puolilta maailmaa. Vanhimmat ovat 1800-luvun kiertävien '
                + 'kansannukketeatterien marionetteja.',
              selite: 'Vitriini Chrudimin nukketeatterimuseossa: valkoiseen '
                + 'pitsipukuun puettu morsiusnukke, silinteripäinen herra '
                + 'istumassa ja rivi sotilas- ja naishahmoja vihreällä '
                + 'korokkeella.',
              lahde: 'Palickap, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://puppets.bach.cz/vademecum/',
            },
          ],
        },
      ],
    },
  ],
  IRL: [
    {
      id: 'menovinkit',
      nimi: 'Menovinkit',
      johdanto: 'Irlanti on avannut arkistonsa: koululaisten keräämät tarinat '
        + '1930-luvulta, käsin kirjoitetut vuosisadat, suljettu museo jonka '
        + 'salit voi silti kävellä läpi, ja kivet joissa aakkoset ovat '
        + 'pelkkiä viiruja.',
      lista: [
        {
          otsikko: 'Sanat ja tarinat',
          kohteet: [
            {
              nimi: 'Dúchas.ie — koululaisten kansanperinnekokoelma',
              tiedosto: 'Goble-Book of Fairy Poetry024Lupracaun or Fairy Shoemaker.jpg',
              teksti: 'Irlannissa pyydettiin 1930-luvulla koululaisia keräämään '
                + 'tarinoita isovanhemmiltaan ja naapureiltaan. Lapset '
                + 'kirjoittivat vihkoihin taruja, kummituksia, '
                + 'parannuskeinoja, sääenteitä ja leikkejä.',
              selite: 'Warwick Goblen piirros vuodelta 1920: leprikoni istuu '
                + 'jakkaralla sormustinkukkien keskellä, vasara kädessä. '
                + 'Maassa ympärillä on pieniä kenkiä.',
              lahde: 'Warwick Goble, Wikimedia Commons (public domain)',
              linkki: 'https://www.duchas.ie/en/cbes',
            },
            {
              nimi: 'Irish Script on Screen — Ballymoten kirja sivu sivulta',
              tiedosto: 'Book of Ballymote 008r.jpg',
              teksti: 'Ballymoten kirja kirjoitettiin vasikannahalle 1300-luvun '
                + 'lopulla. Vuonna 1522 Aodh Dubh Ó Domhnaill osti sen 140 '
                + 'lypsylehmällä.',
              selite: 'Ballymoten kirjan sivu 8r: kaksi palstaa tiheää '
                + 'irlantilaista käsialaa ja vasemmassa reunassa suuri '
                + 'alkukirjain puna-vihreine palmikkokoristeineen. '
                + 'Pergamentissa on reikiä.',
              lahde: 'Wikimedia Commons (public domain)',
              linkki: 'https://www.isos.dias.ie/RIA/RIA_MS_23_P_12.html',
            },
            {
              nimi: 'Ogham in 3D — ogham-kirjoitukset kolmiulotteisina',
              tiedosto: 'Detail of ogham in Dunloe Ogham site.jpg',
              teksti: 'Ogham on kirjoitustapa, jota käytettiin vain Irlannissa ja '
                + 'Britanniassa. Siinä ei ole yhtään kuvaa muistuttavaa '
                + 'merkkiä: kirjaimet ovat yhdestä viiteen viirua, jotka on '
                + 'hakattu kiven särmän yli, ja teksti luetaan pystysuoraan.',
              selite: 'Lähikuva Dunloen ogham-kivestä Kerryn kreivikunnassa: '
                + 'jäkälän täplittämään pystykiveen on hakattu rivi lyhyitä '
                + 'viiruja kiven särmän yli.',
              lahde: 'HKath74, Wikimedia Commons (CC0)',
              linkki: 'https://ogham.celt.dias.ie/',
            },
          ],
        },
        {
          otsikko: 'Museot ja musiikki',
          kohteet: [
            {
              nimi: 'National Museum of Ireland — luonnontieteellinen museo 3D:nä',
              tiedosto: 'National Museum of Ireland - Natural History elephant and walrus.jpg',
              teksti: 'Dublinin luonnontieteellistä museota kutsutaan '
                + 'lempinimellä Dead Zoo. Merrion Streetin talo on suljettu '
                + 'suuren korjauksen ajaksi, mutta salit on kuvattu '
                + 'kolmiulotteisiksi.',
              selite: 'Museon ylempi sali Dublinissa: täytetty norsu korokkeella '
                + 'ja mursu matalalla penkillä. Seinillä on rivikaupalla '
                + 'hirvenpäitä ja takana korkeat lasivitriinit.',
              lahde: 'James Petts, Wikimedia Commons (CC BY-SA 2.0)',
              linkki: 'https://www.museum.ie/en-IE/Museums/Natural-History/Visitor-Information/3D-Virtual-Visit',
            },
            {
              nimi: 'National Gallery of Ireland — kokoelma verkossa',
              tiedosto: 'The Taking of Christ-Caravaggio (c.1602).jpg',
              teksti: 'Irlannin kansallisgallerian verkkokokoelmassa on 14 637 '
                + 'teosta: 6 893 piirustusta, 3 597 grafiikanlehteä, 2 903 '
                + 'maalausta, 566 valokuvaa ja 391 veistosta.',
              selite: 'Caravaggion maalaus vuodelta 1602: Juudas tarttuu '
                + 'Jeesukseen kiinni, vieressä kiiltävään haarniskaan '
                + 'puettuja sotilaita ja oikeassa reunassa mies pitelee '
                + 'lyhtyä pimeässä.',
              lahde: 'Caravaggio, Wikimedia Commons (public domain)',
              linkki: 'https://onlinecollection.nationalgallery.ie/',
            },
            {
              nimi: 'ITMA — irlantilaista kansanmusiikkia kuunneltavaksi',
              tiedosto: 'William Rowsome uilleann.jpg',
              teksti: 'Irish Traditional Music Archive Dublinissa kerää '
                + 'irlantilaista kansanmusiikkia ja antaa sen kaikkien '
                + 'kuunneltavaksi ilmaiseksi.',
              selite: 'Valokuva vuodelta 1913: pillimestari William Rowsome istuu '
                + 'tummassa puvussa, uilleann-pillien palkeet ja putket '
                + 'vinossa sylissään.',
              lahde: 'Francis O\'Neill, Wikimedia Commons (public domain)',
              linkki: 'https://www.itma.ie/collections-overview/listen/',
            },
          ],
        },
      ],
    },
  ],
  ISL: [
    {
      id: 'menovinkit',
      nimi: 'Menovinkit',
      johdanto: 'Islanti on pieni maa, joka on avannut verkkoon paljon: melkein '
        + 'miljoona kuvaa nahalle kirjoitetuista saagoista, karttoja joiden '
        + 'merissä ui hirviöitä, 32 suoraa kameraa ja maanjäristyslistan, '
        + 'joka päivittyy koko ajan.',
      lista: [
        {
          otsikko: 'Saagat ja kartat',
          kohteet: [
            {
              nimi: 'Handrit.is — islantilaiset käsikirjoitukset verkossa',
              tiedosto: 'Flateyjarbok Olaf Tryggvason.jpg',
              teksti: 'Islantilaiset kirjoittivat saagansa vasikannahalle 1200- '
                + 'ja 1300-luvuilla. Handrit.is kokoaa kymmenen kirjaston '
                + 'käsikirjoitukset samaan hakuun: kaikkiaan 17 953 '
                + 'kappaletta, joista 4 353 on kuvattu sivu sivulta.',
              selite: 'Flateyjarbókin koristeltu sivu: kaksi tiivistä '
                + 'tekstipalstaa kullanruskean köynnöskehyksen sisällä, iso '
                + 'alkukirjain johon on maalattu taistelevia miehiä, ja '
                + 'alareunassa pieniä hahmoja ja eläimiä.',
              lahde: 'Wikimedia Commons (public domain)',
              linkki: 'https://handrit.is/',
            },
            {
              nimi: 'Íslandskort.is — Islannin vanhat kartat',
              tiedosto: 'Island 1590 Theatrum Orbis Terrarum Ortelius.jpg',
              teksti: 'Islannin kansalliskirjasto on kuvannut maan vanhat kartat '
                + 'ja pannut ne verkkoon. Íslandskort.is-sivustolla niitä on '
                + '285, jaettuna 13 ryhmään sen mukaan kuka kartan piirsi ja '
                + 'milloin.',
              selite: 'Käsin väritetty kuparipiirroskartta Islannista 1500-luvun '
                + 'lopulta: keltainen ja vaaleanpunainen maa, keskellä '
                + 'punaisena purkautuva tulivuori ja ympäröivässä meressä '
                + 'toistakymmentä hirviötä — käärmeitä, valaita ja '
                + 'torahampaisia otuksia.',
              lahde: 'Abraham Ortelius, Wikimedia Commons (public domain)',
              linkki: 'https://islandskort.is/',
            },
            {
              nimi: 'Icelandic Saga Map — saagat kartalla',
              tiedosto: 'Thorarinn thingvellir.jpg',
              teksti: 'Saagat kertovat tarkasti, kuka asui millä tilalla ja kuka '
                + 'ratsasti minne. Islannin yliopiston Icelandic Saga Map on '
                + 'merkinnyt nämä paikat kartalle: kaikki islantilaissaagat '
                + 'ja lisäksi Landnámabók eli asutuksen kirja.',
              selite: 'Þórarinn B. Þorlákssonin maalaus vuodelta 1900: vaalea '
                + 'hevonen seisoo tyynen veden rannalla Þingvellirissä, '
                + 'toinen hevonen kauempana, vastarannalla valkoinen kirkko '
                + 'ja pari taloa, takana siniharmaat tunturit.',
              lahde: 'Þórarinn B. Þorláksson, Wikimedia Commons (public domain)',
              linkki: 'https://sagamap.hi.is/en/',
            },
          ],
        },
        {
          otsikko: 'Maa liikkuu juuri nyt',
          kohteet: [
            {
              nimi: 'Veðurstofa Íslands — maanjäristykset kartalla',
              tiedosto: 'Geldingadalagos2.jpg',
              teksti: 'Islannin ilmatieteen laitos mittaa maanjäristykset koko '
                + 'maasta ja näyttää ne kartalla saman tien. Listassa on '
                + 'jokainen järistys viimeisen 48 tunnin ajalta: kellonaika, '
                + 'syvyys kilometreinä, voimakkuus ja lähin paikannimi.',
              selite: 'Fagradalsfjallin purkaus maaliskuussa 2021: matala '
                + 'kraatteri sylkee oranssia laavaa, joka valuu virtoina '
                + 'lumiselle tasangolle. Etualalla rinteellä istuu ja seisoo '
                + 'toistakymmentä katsojaa värikkäissä ulkoilutakeissa.',
              lahde: 'Berserkur, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://en.vedur.is/earthquakes-and-volcanism/earthquakes/',
            },
            {
              nimi: 'Live From Iceland — kaikki suorat kamerat',
              tiedosto: 'Sólheimajökull glacier 16.jpg',
              teksti: 'Live From Iceland lähettää suoraa kuvaa 32 paikasta ympäri '
                + 'Islantia. Kuusi kameraa on suunnattu Reykjanesin '
                + 'purkausalueelle, ja omansa on myös Heklalla, Katlalla ja '
                + 'Eyjafjallajökullilla.',
              selite: 'Sólheimajökullin jäätikön kieli: mustanharmaaksi '
                + 'raidoittunut jäämuuri, jonka juurella on sameanharmaa '
                + 'lampi ja siinä kelluvia jäänkappaleita. Takana kohoaa '
                + 'sammalinen kukkula.',
              lahde: 'Netha Hussain, Wikimedia Commons (CC BY-SA 4.0)',
              linkki: 'https://www.livefromiceland.is/webcams/',
            },
            {
              nimi: 'Mannanafnaskrá — Islannin virallinen nimilista',
              tiedosto: 'Börn Eiríks og Sigríðar.png',
              teksti: 'Islannissa lapselle ei saa antaa mitä nimeä tahansa. Nimen '
                + 'pitää löytyä virallisesta nimirekisteristä, ja jos sitä ei '
                + 'ole siellä, vanhemmat joutuvat hakemaan lupaa '
                + 'nimilautakunnalta.',
              selite: 'Nicoline Weywadtin studiokuva 1800-luvun lopulta: '
                + 'seitsemän nuorta islantilaista kolmessa rivissä — edessä '
                + 'kolme naista tummissa puvuissa ja vaaleissa esiliinoissa, '
                + 'keskellä kaksi poikaa, takana kaksi nuorta miestä.',
              lahde: 'Nicoline Weywadt, Wikimedia Commons (public domain)',
              linkki: 'https://island.is/leit-i-mannanafnaskra',
            },
          ],
        },
      ],
    },
  ],
};
