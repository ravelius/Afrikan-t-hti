// Matkakirjan saapumistekstit (Aasia ja Lähi-itä) — sama muoto ja sama
// ääni kuin Euroopan ja Afrikan teksteissä.
//
//  - `kuvaus` on nuoren herran tuore fiilis paikasta. Ensimmäinen lause
//    näkyy lihavoituna ja lukija lukee koko merkinnän ääneen tunteella.
//  - `nosto` päättää merkinnän isoisän kirjan lainaukseen niin, että
//    lähde käy ilmi tekstistä itsestään — erillistä otsikkoa ei ole.
//
// Kaupunkien välillä on tarkoituksella vaihtelua: riemua, hiljaista
// kunnioitusta, pelonsekaista ihailua, naurua ja vakavuutta. Jokaisessa
// merkinnässä on ainakin yksi tarkistettava luku tai vuosiluku — se on
// se kohta, josta pelaaja oppii jotain, ja se kestää lukemisen monta
// kertaa.
//
// Isoisän lainaukset ovat vuodelta 1873 (hänen oma matkansa) tai
// hänen kirjastaan ilman vuosilukua. Ne ovat sepitettä, kuten koko
// kehyskertomus, mutta niissä mainitut asiat ovat tosia.
export const ASIA_SAAPUMISET = {
  // --- Turkki, Kypros ja Levantti ---------------------------------------------
  izmir: {
    kuvaus: 'Izmirin lahti kaartuu kuin hevosenkenkä, ja laiva liukui '
      + 'sen pohjukkaan iltapäivällä kaupungin kaartaessa ympärille joka '
      + 'suunnasta. Rantabulevardilla ihmiset kävelivät hitaasti meren '
      + 'vieressä ja söivät simittiä. Tämä on Smyrna — kaupunki, jossa on '
      + 'asuttu yhtäjaksoisesti yli kolme tuhatta vuotta, ja silti se '
      + 'näyttää siltä kuin olisi juuri herännyt.',
    nosto: 'Isoisä kirjoitti 1873: "Smyrnan satamassa lastataan viikunoita '
      + 'ja mattoja, ja jokainen laiva vie mukanaan palan Anatoliaa." '
      + 'Ostin kourallisen viikunoita ja söin ne laiturilla.',
  },
  ankara: {
    kuvaus: 'Ankara yllätti: odotin pikkukaupunkia ja sain leveät kadut, '
      + 'ministeriöt ja ylängön tuulen. Kaupunki nostettiin pääkaupungiksi '
      + 'vuonna 1923, kun Istanbul jäi liian lähelle rajaa ja liian kauas '
      + 'maan sydämestä — ja sen jälkeen se on kasvanut kylästä '
      + 'miljoonakaupungiksi. Kukkulan päällä seisoo vanha linna, jonka '
      + 'muurit ovat vanhempia kuin koko tasavalta.',
    nosto: 'Isoisän kirjassa Ankara mainitaan yhdellä rivillä: "Angora, '
      + 'josta tulevat pitkäkarvaiset vuohet ja pehmein villa, jota olen '
      + 'käsissäni pidellyt." Ukko ei arvannut, mitä kylästä tulisi.',
  },
  kapadokia: {
    kuvaus: 'Voi hyvänen aika — maisema näyttää siltä kuin joku olisi '
      + 'kaatanut vahaa kynttilästä ja jättänyt sen jähmettymään! '
      + 'Tuhkakivi on pehmeää, ja ihmiset ovat kaivertaneet siihen taloja, '
      + 'kirkkoja ja kokonaisia maanalaisia kaupunkeja. Derinkuyussa '
      + 'käytävät laskeutuvat kahdeksaan kerrokseen, ja siellä mahtui '
      + 'piileskelemään tuhansia ihmisiä karjoineen.',
    nosto: 'Isoisä kirjoitti: "Kappadokiassa kansa ei rakentanut ylöspäin '
      + 'vaan sisäänpäin, ja niin se säilyi." Kiipesin ulos maan alta '
      + 'auringonvaloon ja huomasin pidättäneeni hengitystä.',
  },
  nikosia: {
    kuvaus: 'Nikosia on kaupunki, jonka läpi kulkee raja. Kävelin '
      + 'venetsialaisten muurien sisäpuolella kapeaa katua, ja katu '
      + 'yksinkertaisesti loppui: tynnyreitä, peltiä ja vartiomies. '
      + 'Toisella puolella puhutaan turkkia, tällä puolella kreikkaa, ja '
      + 'kadut jatkuvat aivan samanlaisina. Se on maailman viimeinen '
      + 'jaettu pääkaupunki.',
    nosto: 'Isoisä kirjoitti Kyproksesta: "Saari on ollut kaikkien '
      + 'valtakuntien välietappi, eikä yksikään ole malttanut jättää sitä '
      + 'rauhaan." Katsoin muurin yli enkä keksinyt sanottavaa.',
  },
  halab: {
    kuvaus: 'Aleppon linnoitus nousee keskeltä kaupunkia oman kukkulansa '
      + 'päälle, ja sinne kiivetään kivisiltaa pitkin kuin satulinnaan. '
      + 'Alhaalla kiemurtelee basaari, jonka katetut käytävät ovat '
      + 'kilometrien mittaiset — saippuaa, pistaasia ja kangasta niin '
      + 'kauas kuin näkee. Täällä on käyty kauppaa yhtäjaksoisesti '
      + 'neljätuhatta vuotta.',
    nosto: 'Isoisän kirjassa lukee: "Halepissa karavaanit purkavat '
      + 'kuormansa ja meri ottaa ne vastaan. Kaupunki elää siitä, että se '
      + 'on välissä." Ostin palan oliiviöljysaippuaa ja kannoin sitä '
      + 'taskussa koko loppumatkan.',
  },
  damaskos: {
    kuvaus: 'Suoralla kadulla — sillä samalla, joka mainitaan Raamatussa '
      + 'nimeltä — kävelin varjossa ja kuulin vasaran äänen joka '
      + 'kolmannesta ovesta. Umaijadien moskeijan pihalla marmori on '
      + 'kulunut valkoiseksi paljaista jaloista. Damaskosta sanotaan '
      + 'vanhimmaksi yhtäjaksoisesti asutuksi pääkaupungiksi maailmassa, '
      + 'ja sen uskoo heti.',
    nosto: 'Isoisä kirjoitti 1873: "Damaskoksessa aika ei kulje eteenpäin '
      + 'vaan kerrostuu." Istuin suihkulähteen reunalle ja annoin sen '
      + 'kerrostua hetken minunkin päälleni.',
  },
  jerusalem: {
    kuvaus: 'Jerusalemin vanhakaupunki on alle kilometrin levyinen, ja '
      + 'sen sisällä on kolmen uskonnon pyhimmät paikat kävelymatkan '
      + 'päässä toisistaan. Kuulin samaan aikaan kirkonkellot, rukouskutsun '
      + 'ja shofar-torven. Kalkkikivi on täällä niin vaaleaa, että '
      + 'iltapäivällä koko kaupunki hehkuu kullanvärisenä.',
    nosto: 'Isoisä kirjoitti: "Jerusalemissa jokainen kivi kuuluu jollekin, '
      + 'ja siksi se kuuluu kaikille." Seisoin kujien risteyksessä enkä '
      + 'kääntynyt mihinkään suuntaan pitkään aikaan.',
  },
  petra: {
    kuvaus: 'Ratsastin kapeaan rotkoon, jonka seinät nousivat kahden '
      + 'talon korkuisiksi molemmin puolin, ja se jatkui yli kilometrin. '
      + 'Ja sitten — rako aukeni, ja siinä se oli: kokonainen temppelin '
      + 'julkisivu kaiverrettuna suoraan punaiseen kallioon. Huusin '
      + 'ääneen. Nabatealaiset veistivät sen yli kaksituhatta vuotta '
      + 'sitten, ja he veistivät myös vesikanavat rotkon seinään.',
    nosto: 'Isoisän kirjassa on tästä vain kysymys: "Kuinka aavikon kansa '
      + 'rikastui? Vastaus on vesi, ei kulta." Löysin kanavan uran '
      + 'seinästä ja seurasin sitä sormella koko rotkon läpi.',
  },
  siinai: {
    kuvaus: 'Nousin pimeässä ylös, tuhat kivistä porrasta, ja huipulla '
      + 'istuin odottamassa aurinkoa muiden vaeltajien kanssa hiljaa. '
      + 'Kun valo tuli, vuoret värjäytyivät ruosteenpunaisiksi joka '
      + 'suuntaan eikä missään näkynyt yhtään puuta. Alhaalla luostari on '
      + 'ollut auki keskeytyksettä 500-luvulta asti — kauemmin kuin mikään '
      + 'muu kristillinen luostari maailmassa.',
    nosto: 'Isoisä kirjoitti: "Siinailla ei ole mitään, ja juuri siksi '
      + 'sinne on menty kolmentuhannen vuoden ajan." Ymmärsin vasta '
      + 'huipulla, ettei se ollut vitsi.',
  },

  // --- Egypti ja Arabian niemimaa ---------------------------------------------
  luxor: {
    kuvaus: 'Luxorissa temppeli ei ole kaupungin laidalla vaan keskellä '
      + 'sitä — pylväät nousevat suoraan kadun vierestä, ja niiden välissä '
      + 'kulkee ihmisiä ostoksilla. Karnakin pylvässalissa on 134 pylvästä, '
      + 'ja isoimmat ovat niin paksuja, ettei niiden ympäri ylety '
      + 'kymmenenkään ihmisen käsivarsin. Joen toisella rannalla ovat '
      + 'kuninkaiden haudat.',
    nosto: 'Isoisä kirjoitti 1873: "Theban temppelit ovat ihmiskäden töitä, '
      + 'mutta mittakaava on jumalten." Seisoin pylvään juurella ja '
      + 'tunsin itseni pikkuruiseksi ihan hyvällä tavalla.',
  },
  medina: {
    kuvaus: 'Medinaan tullaan hiljaa. Kaupunki oli se, joka otti '
      + 'profeetta Muhammadin vastaan vuonna 622, kun Mekka ei ottanut — '
      + 'ja siitä muutosta alkaa islamilainen ajanlasku. Palmutarhat '
      + 'reunustavat teitä, ja iltaisin moskeijan piha täyttyy niin '
      + 'tasaisesti, ettei kukaan näytä kiirehtivän mihinkään.',
    nosto: 'Isoisän kirjassa lukee: "Vuosi yksi ei ala syntymästä vaan '
      + 'muutosta." Laskin päässäni, monesko vuosi täällä nyt on, ja '
      + 'jouduin laskemaan kahdesti.',
  },
  mekka: {
    kuvaus: 'Mekka on laakso vuorten välissä, ja sen pohjalla on piha, '
      + 'jonka ympäri kävellään. Joka päivä miljoona ihmistä kääntyy '
      + 'maailman joka kolkassa tätä yhtä pistettä kohti viisi kertaa. '
      + 'Kaupunkiin ei pääse kuka tahansa, ja katselin sitä kukkulalta — '
      + 'valot levisivät laakson pohjalle kuin kaadettu maito.',
    nosto: 'Isoisä kirjoitti: "En nähnyt Mekkaa. Näin tien, joka vei '
      + 'sinne, ja se oli täynnä ihmisiä joka ilmansuunnasta." Seisoin '
      + 'samalla tiellä ja laskin kymmenen eri kieltä.',
  },
  riad: {
    kuvaus: 'Riad nousee keskeltä aavikkoa ilman jokea, ilman merta, '
      + 'ilman mitään syytä olla juuri siinä — paitsi kaivot. Vanha '
      + 'savitiililinnoitus seisoo yhä keskustassa lasitornien juurella, '
      + 'ja niiden ero on sadassa vuodessa. Iltapäivällä on niin kuuma, '
      + 'että kadut tyhjenevät ja kaupunki herää vasta pimeän tultua.',
    nosto: 'Isoisän kirjassa lukee: "Nedždin ylängöllä kaupungit ovat '
      + 'kaivojen ympärille rakennettuja muistiinpanoja." Join vettä '
      + 'pullosta ja ajattelin, kuinka helppoa se nyt on.',
  },
  rubalkhali: {
    kuvaus: 'Rub al-Khali tarkoittaa tyhjää neljännestä, ja nimi on '
      + 'rehellinen. Dyynit ovat paikoin kolmensadan metrin korkuisia — '
      + 'korkeampia kuin yksikään talo, jonka olen nähnyt — ja niitä '
      + 'jatkuu satojen kilometrien verran ilman kylää, tietä tai puuta. '
      + 'Hiekka on ruosteenpunaista, ja illalla se muuttuu violetiksi.',
    nosto: 'Isoisä kirjoitti: "Autiomaassa ei ole tyhjyyttä, on vain '
      + 'tilaa, jota kukaan ei ole vielä täyttänyt." Makasin dyynin '
      + 'harjalla selälläni ja katsoin tähtiä, joita oli liikaa laskettavaksi.',
  },
  sana: {
    kuvaus: 'Sanaan talot ovat kuusi- ja seitsenkerroksisia savitiilestä '
      + 'ja niiden ikkunat on reunustettu valkoisella kipsillä kuin '
      + 'pitsillä. Ne näyttävät piparkakkutaloilta, mutta ne ovat oikeita '
      + 'asuintaloja, ja osa on seissyt satoja vuosia. Kaupunki on '
      + 'kahdentuhannen metrin korkeudessa, joten ilma on viileää '
      + 'keskellä Arabiaa.',
    nosto: 'Isoisän kirjassa lukee: "Sanaassa rakennettiin pilviä kohti '
      + 'jo silloin, kun Euroopassa asuttiin yhdessä kerroksessa." '
      + 'Laskin kerrokset yhdestä talosta: seitsemän.',
  },
  aden: {
    kuvaus: 'Aden on rakennettu sammuneen tulivuoren kraatteriin — '
      + 'kirjaimellisesti sen sisään. Mustat kalliot nousevat ympärillä '
      + 'joka suunnassa, ja niiden keskellä on satama, jonka ohi kulkee '
      + 'lähes kaikki Punaisenmeren liikenne. Vanhat vesisäiliöt on '
      + 'louhittu kallioon niin kauan sitten, ettei kukaan tiedä varmasti '
      + 'kenen toimesta.',
    nosto: 'Isoisä kirjoitti 1873: "Aden on hiilivarasto, jonka ympärille '
      + 'on sattunut kaupunki. Suezin kanava avattiin neljä vuotta sitten, '
      + 'ja se teki tästä kalliosta maailman vilkkaimman." Laivoja laski '
      + 'sataman edustalla kaksitoista.',
  },
  salalah: {
    kuvaus: 'Salalah on vihreä. Keskellä Arabian niemimaata, aavikon '
      + 'reunalla, on kaistale jota monsuuni kastelee joka kesä — kolme '
      + 'kuukautta sumua ja tihkusadetta, ja rinteet muuttuvat '
      + 'niityiksi. Täältä on tuhansien vuosien ajan viety suitsuketta, '
      + 'ja suitsukepuu kasvaa yhä kivikossa kuin rikkaruoho.',
    nosto: 'Isoisän kirjassa lukee: "Dhofarin pihka oli aikanaan kullan '
      + 'arvoista, ja sitä kannettiin kamelien selässä pohjoiseen '
      + 'kuukausikaupalla." Rikoin oksan ja haistoin: kirkasta, hartsista, '
      + 'aivan kuin kirkossa.',
  },
  masqat: {
    kuvaus: 'Masqat on puristettu meren ja paljaiden vuorten väliin niin '
      + 'ahtaasti, että talot kiipeävät rinteeseen. Sataman suulla '
      + 'seisoo kaksi portugalilaisten 1500-luvulla rakentamaa linnaketta '
      + 'vastakkain kuin kaksi vartijaa. Valkoiset talot, siniset ovet ja '
      + 'vuorten ruskea — kolme väriä, ei enempää.',
    nosto: 'Isoisä kirjoitti: "Omanin merenkulkijat purjehtivat Kiinaan '
      + 'ennen kuin Eurooppa löysi Amerikan." Katselin dhow-venettä, jonka '
      + 'runko oli ommeltu kokoon köydellä ilman ainuttakaan naulaa.',
  },
  dubai: {
    kuvaus: 'Dubaissa astuin abra-veneeseen, ylitin lahden yhdellä '
      + 'kolikolla ja nousin maihin toisella rannalla mausteiden hajuun. '
      + 'Sitten käänsin päätä ja näin lasitornit, joita ei ollut '
      + 'olemassakaan viisikymmentä vuotta sitten. Sama kaupunki, kaksi '
      + 'aikaa, viiden minuutin venematkan päässä toisistaan.',
    nosto: 'Isoisän kirjassa lukee vain: "Dubai, pieni helmenkalastajien '
      + 'satama Persianlahdella." Luin lauseen uudestaan seisoessani '
      + 'maailman korkeimman talon juurella.',
  },
  doha: {
    kuvaus: 'Dohan rantabulevardilta kaupunki näyttää kahtia jaetulta: '
      + 'toisella puolella lahtea lasitornit, tällä puolella tori, jossa '
      + 'myydään haukkoja. Oikeita metsästyshaukkoja, nahkahuppu päässä, '
      + 'omalla osastollaan. Qatar oli sata vuotta sitten '
      + 'helmenkalastajien maa, ja sitten löytyi kaasua — enemmän kuin '
      + 'melkein missään muualla.',
    nosto: 'Isoisä kirjoitti Persianlahdesta: "Sukeltajat menevät alas '
      + 'ilman köyttä ja nousevat ylös ilman ilmaa. Helmi maksaa sen, '
      + 'mitä sen hakeminen maksaa." Katselin haukkaa ja mietin, mitä '
      + 'ukko olisi sanonut tornista.',
  },

  // --- Mesopotamia ja Persia ---------------------------------------------------
  kuwait: {
    kuvaus: 'Kuwait Cityn vesitornit näyttävät siltä kuin joku olisi '
      + 'pujottanut helmiä betonipiikkiin — ja juuri sitä ne ovat, '
      + 'vesisäiliöitä. Kaupunki on lahden pohjukassa, jossa on ollut '
      + 'satama niin kauan kuin laivoja on rakennettu, ja telakalla '
      + 'tehdään yhä puisia dhow-veneitä käsin.',
    nosto: 'Isoisän kirjassa lukee: "Kuwaitissa rakennetaan laivoja, '
      + 'joilla ei ole piirustuksia. Mestari kantaa mitat päässään." '
      + 'Kysyin telakalla piirustuksia ja sain vastaukseksi naurun.',
  },
  bagdad: {
    kuvaus: 'Tigris virtaa Bagdadin läpi leveänä ja ruskeana, ja rannalla '
      + 'grillataan kalaa avotulella pystyyn nostettuina. Tuhat vuotta '
      + 'sitten tämä oli maailman suurin kaupunki ja sen viisauden talossa '
      + 'käännettiin kreikkalaiset kirjat arabiaksi — ilman sitä työtä '
      + 'Eurooppa olisi menettänyt puolet omasta perinnöstään.',
    nosto: 'Isoisä kirjoitti: "Bagdadissa säilytettiin se, minkä me '
      + 'unohdimme." Söin kalan sormin joen rannalla ja mietin, kuinka '
      + 'harvoin sitä muistetaan sanoa ääneen.',
  },
  mosul: {
    kuvaus: 'Mosulin toisella rannalla ovat Niniven rauniot — Assyrian '
      + 'pääkaupunki, joka oli aikanaan maailman suurin kaupunki ja '
      + 'tuhoutui vuonna 612 eaa. Kävelin muurin uraa pitkin ja yritin '
      + 'kuvitella sen korkeaksi. Vanhassa kaupungissa vasarat kalskahtavat '
      + 'jälleen: kirkkoja ja moskeijoita rakennetaan uudelleen kivi '
      + 'kerrallaan.',
    nosto: 'Isoisän kirjassa lukee: "Ninive katosi niin täydellisesti, '
      + 'että sitä pidettiin satuna kunnes se kaivettiin esiin." Poimin '
      + 'savenpalan maasta ja panin sen takaisin.',
  },
  tabriz: {
    kuvaus: 'Tabrizin katettu basaari on niin suuri, että siellä eksyy — '
      + 'käytäviä on kilometrikaupalla holvien alla, ja mattojen osasto '
      + 'on oma kaupunginosansa. Täällä silkkitie kääntyi länteen, ja '
      + 'kauppa on jatkunut samoissa käytävissä satoja vuosia. Ilma '
      + 'tuoksuu villalta, teeltä ja pölyltä.',
    nosto: 'Isoisä kirjoitti 1873: "Tabrizissa matto ei ole lattialla '
      + 'vaan seinällä, koska se on taulu." Katselin yhtä puoli tuntia '
      + 'enkä löytänyt kahta samanlaista kuviota.',
  },
  teheran: {
    kuvaus: 'Teheran on kiinni vuorissa: kadun päässä näkyy '
      + 'lumihuippuinen Alborz, ja kaupunki nousee rinnettä niin, että '
      + 'pohjoisosassa on useita asteita viileämpää kuin etelässä. '
      + 'Damavand, Iranin korkein huippu, on 5 610 metriä ja uinuva '
      + 'tulivuori. Sitä katsoo kaupungista kuin vahtimestaria.',
    nosto: 'Isoisän kirjassa lukee: "Persiassa puutarha ei ole koriste '
      + 'vaan lupaus — se kertoo, että vettä on." Istuin platanien varjossa '
      + 'ja uskoin lupauksen heti.',
  },
  isfahan: {
    kuvaus: 'Isfahanin keskusaukio on niin iso, että sen ylittäminen vie '
      + 'aikaa: yli 500 metriä pitkä ja 160 leveä, ja sen reunoilla '
      + 'seisovat moskeija, palatsi ja basaarin portti. Sinisiä kaakeleita '
      + 'on niin paljon, että ne heijastavat taivaan takaisin. Vanha '
      + 'sanonta sanoo Isfahania puoleksi maailmaksi, ja aukiolla sen '
      + 'ymmärtää.',
    nosto: 'Isoisä kirjoitti: "Isfahanissa arkkitehti tiesi, mitä valo '
      + 'tekee kaakelille eri vuorokaudenaikoina, ja rakensi sen mukaan." '
      + 'Palasin aukiolle illalla, ja se oli eri paikka.',
  },
  persepolis: {
    kuvaus: 'Persepoliksessa portaat on tehty niin loiviksi, että hevonen '
      + 'pääsee niitä ylös — ja niiden kyljessä marssii kivinen jono '
      + 'lähettiläitä kaikista valtakunnan kansoista, kukin oma lahjansa '
      + 'kädessä. Aleksanteri poltti paikan vuonna 330 eaa., ja pylväät '
      + 'ovat siitä asti seisseet katottomina.',
    nosto: 'Isoisän kirjassa lukee: "Persepoliksessa ei kerskuta '
      + 'voitoista vaan luetellaan kansat, jotka toivat lahjoja." Laskin '
      + 'reliefistä kaksikymmentäkolme eri kansaa ennen kuin luovutin.',
  },

  // --- Ural, Siperia ja Kaukoitä -----------------------------------------------
  jekaterinburg: {
    kuvaus: 'Jekaterinburgin laidalla seisoo kivinen obeliski, jonka '
      + 'toisella kyljellä lukee Eurooppa ja toisella Aasia. Seisoin '
      + 'jalat harallaan kahdessa maanosassa yhtä aikaa ja nauroin '
      + 'itsekseni kuin pikkupoika. Uralvuoret eivät ole korkeita — '
      + 'metsäisiä kumpuja — mutta ne ovat raja, jonka kaikki tuntevat.',
    nosto: 'Isoisä kirjoitti 1873: "Uralilla maanosa vaihtuu ilman '
      + 'että maisema muuttuu. Raja on sopimus, ei seinä." Kävelin '
      + 'obeliskin ympäri kolme kertaa varmuuden vuoksi.',
  },
  novosibirsk: {
    kuvaus: 'Novosibirsk on nuorempi kuin isoisäni: kaupunki syntyi '
      + 'vuonna 1893, kun rautatiesilta piti rakentaa Obin yli, ja '
      + 'nyt siinä asuu yli puolitoista miljoonaa ihmistä. Se on '
      + 'Siperian suurin kaupunki, ja se kasvoi sillan ympärille kuin '
      + 'kylä kaivon ympärille — vain nopeammin.',
    nosto: 'Isoisä kirjoitti: "Radan varteen syntyy kaupunki siellä, '
      + 'missä juna joutuu hidastamaan." Katselin Obin virtaa sillalta '
      + 'ja mietin, kuinka ohuesta syystä miljoonakaupunki alkaa.',
  },
  irkutsk: {
    kuvaus: 'Baikal! Vesi on niin kirkasta, että pohja näkyy '
      + 'kymmenienkin metrien syvyyteen, ja järvi on syvin maailmassa — '
      + 'yli 1 600 metriä. Siihen mahtuu viidesosa kaikesta maailman '
      + 'juoksevasta makeasta vedestä. Irkutskissa on puutaloja, joiden '
      + 'ikkunanpielet on veistetty pitsiksi.',
    nosto: 'Isoisän kirjassa lukee: "Baikal ei ole järvi vaan meri, '
      + 'joka ei ole päässyt merenrantaan." Kastoin käteni veteen '
      + 'elokuussa ja vedin sen heti pois.',
  },
  jakutsk: {
    kuvaus: 'Jakutskissa talot seisovat paaluilla ilmassa — jos ne '
      + 'seisoisivat maassa, lämpö sulattaisi ikiroudan ja talo vajoaisi. '
      + 'Tämä on kylmin suuri kaupunki maailmassa: talvella mitataan '
      + 'yli viisikymmentä pakkasastetta, ja kesällä voi olla '
      + 'kolmekymmentä lämpöastetta. Sata astetta eroa samassa '
      + 'kaupungissa.',
    nosto: 'Isoisä kirjoitti: "Jakutiassa maa ei sula koskaan '
      + 'kokonaan, ja siksi siellä rakennetaan ilmaan." Koputin '
      + 'betonipaalua ja yritin kuvitella talven.',
  },
  magadan: {
    kuvaus: 'Magadan on satamakaupunki Ohotanmeren rannalla, ja sinne '
      + 'ei johda tietä mistään muualta kuin pohjoisesta. Kaupungin '
      + 'laidalla seisoo suuri muistomerkki, Surun naamio, niiden '
      + 'muistoksi jotka tuotiin tänne pakolla — Kolyman leirien tie '
      + 'alkoi juuri tästä satamasta. Meri oli tyyni ja harmaa.',
    nosto: 'Isoisän kirjassa ei ole Magadania: kaupunki perustettiin '
      + 'vasta 1929. Kirjoitin sen itse tyhjälle riville ja lisäsin '
      + 'perään: "Tänne tultiin, mutta harva tuli vapaaehtoisesti."',
  },
  kamtsatka: {
    kuvaus: 'Kamtšatkalla on yli kolmesataa tulivuorta, ja niistä '
      + 'parikymmentä on yhä toimivia. Kljutševskaja Sopka nousee '
      + 'lähes viiteen kilometriin ja savuaa. Karhuja on enemmän kuin '
      + 'missään muualla Euraasiassa, ja kesällä joet ovat niin täynnä '
      + 'lohta, että vesi näyttää liikkuvan väärään suuntaan.',
    nosto: 'Isoisä kirjoitti: "Kamtšatkassa maa on vielä keskeneräinen '
      + 'ja tekee itseään lisää." Näin höyrypatsaan nousevan lumen '
      + 'keskeltä enkä osannut päättää, pelottiko vai naurattiko.',
  },
  sahalin: {
    kuvaus: 'Sahalin on pitkä ja kapea saari, jonka pohjoispää on '
      + 'jäässä silloin kun eteläpäässä on jo kevät. Saari on '
      + 'vaihtanut omistajaa monta kertaa: puolet siitä oli Japanin '
      + 'aluetta vuoteen 1945 asti, ja etelässä näkyy yhä japanilaisten '
      + 'rakentamia siltoja. Rannalla haisi levä ja kylmä meri.',
    nosto: 'Isoisän kirjassa lukee: "Sahalinilla raja on kulkenut '
      + 'saaren poikki, ei sen ympäri — ja se on saaren onnettomuus." '
      + 'Kävelin rantaa pitkin enkä nähnyt rajaa missään.',
  },
  vladivostok: {
    kuvaus: 'Vladivostokissa päättyy maailman pisin rautatie: '
      + 'yhdeksäntuhatta kilometriä Moskovasta, seitsemän aikavyöhykettä '
      + 'ja kuusi vuorokautta junassa. Asemalla on kilometripylväs, '
      + 'jossa lukee 9 288. Satamassa oli sotalaivoja ja kalastusaluksia '
      + 'vierekkäin, ja kukkuloilta kaupunki näyttää San Franciscolta '
      + 'väärässä maanosassa.',
    nosto: 'Isoisä kirjoitti 1873: "Rataa rakennetaan itään, ja kun se '
      + 'valmistuu, Aasiaan pääsee kuivin jaloin." Rata valmistui 1916, '
      + 'ja minä tulin sitä pitkin.',
  },
  astana: {
    kuvaus: 'Astana rakennettiin pääkaupungiksi tyhjälle arolle vuonna '
      + '1997 — ennen sitä täällä oli pikkukaupunki ja tuulta. Nyt '
      + 'siinä on lasitorneja, telttamainen kauppakeskus ja leveitä '
      + 'katuja, joilla talvella on kolmekymmentä astetta pakkasta. Se '
      + 'on maailman toiseksi kylmin pääkaupunki.',
    nosto: 'Isoisän kirjassa lukee arosta: "Kazakkien maa on niin '
      + 'avara, ettei sitä voi omistaa, vain kulkea." Katselin katua, '
      + 'joka päättyi aroon, ja arvasin ukon olevan yhä oikeassa.',
  },
  samarkand: {
    kuvaus: 'Registanin aukiolla seisoo kolme koulurakennusta vastakkain, '
      + 'ja niiden julkisivut ovat kokonaan sinistä ja kultaista '
      + 'kaakelia — sellaista sinistä, jota ei ole missään muualla. '
      + 'Samarkand oli Timurin pääkaupunki 1300-luvulla, ja tähtitieteen '
      + 'observatorio rakennettiin tänne puoli vuosisataa ennen kuin '
      + 'Kopernikus syntyi.',
    nosto: 'Isoisä kirjoitti: "Samarkandissa Ulug Beg mittasi vuoden '
      + 'pituuden virheellä, joka on alle minuutin." Seisoin '
      + 'kvadrantin kaaren äärellä ja tunsin itseni hitaaksi.',
  },
  kashgar: {
    kuvaus: 'Kašgarissa silkkitien kaksi haaraa yhtyvät — pohjoinen ja '
      + 'eteläinen reitti Taklamakanin autiomaan ympäri — ja sunnuntain '
      + 'karjatorilla myydään yhä lampaita, aaseja ja kameleita. '
      + 'Kaupankäynti on äänekästä, ja kättä lyödään kirjaimellisesti. '
      + 'Vuoret nousevat joka suunnassa seitsemään kilometriin.',
    nosto: 'Isoisän kirjassa lukee: "Kašgarissa autiomaa loppuu ja '
      + 'kauppa alkaa. Se on ollut sama järjestys kaksituhatta vuotta." '
      + 'Ostin kuivattuja aprikooseja ja söin ne torin laidalla.',
  },
  ulanbator: {
    kuvaus: 'Ulaanbaatar on maailman kylmin pääkaupunki, ja sen '
      + 'laidoilla asutaan yhä geriteltoissa — pyöreissä, huovalla '
      + 'päällystetyissä majoissa, joiden savupiippu nousee keskeltä '
      + 'kattoa. Kaupungin ulkopuolella aro alkaa heti, ilman esikaupunkia. '
      + 'Mongolia on maailman harvimmin asuttu itsenäinen valtio.',
    nosto: 'Isoisä kirjoitti: "Mongoliassa talo on se, joka muuttaa, '
      + 'ei asukas." Kurkistin gerin ovesta ja näin uunin, sängyn ja '
      + 'television.',
  },
  lhasa: {
    kuvaus: 'Lhasa on 3 650 metrin korkeudessa, ja sen huomaa heti: '
      + 'portaat hengästyttävät kuin juoksu. Potalan palatsi nousee '
      + 'kalliolle kolmetoista kerrosta ja siinä on yli tuhat huonetta. '
      + 'Barkhorin kadulla ihmiset kiertävät temppeliä myötäpäivään, ja '
      + 'jotkut kulkevat koko matkan maahan heittäytyen.',
    nosto: 'Isoisän kirjassa lukee: "Tiibetissä ilma on ohutta ja '
      + 'hiljaisuus paksua." Istuin portailla henkeä haukkoen ja '
      + 'ymmärsin lauseen kummankin puolen.',
  },
  peking: {
    kuvaus: 'Kielletty kaupunki on nimensä veroinen: 980 rakennusta '
      + 'muurin sisällä, ja tavallinen ihminen ei päässyt sinne viiteen '
      + 'sataan vuoteen. Nyt sinne kävellään lipulla. Muurit ovat '
      + 'punaiset ja katot keltaiset, ja keltainen oli väri, jota vain '
      + 'keisari sai käyttää.',
    nosto: 'Isoisä kirjoitti 1873: "Pekingissä muuri muurin sisällä, ja '
      + 'jokaisen sisällä yhä yksi." Kävelin viimeisen portin läpi ja '
      + 'käännyin katsomaan taaksepäin koko matkan.',
  },
  xian: {
    kuvaus: 'Voi hyvänen aika — kuoppa maassa, ja sen pohjalla seisoo '
      + 'kahdeksantuhatta savisotilasta rivissä, jokainen eri naamalla! '
      + 'Ne haudattiin ensimmäisen keisarin haudan vartijoiksi yli '
      + 'kaksituhatta vuotta sitten, ja ne löydettiin vasta 1974, kun '
      + 'talonpojat kaivoivat kaivoa. Xi\'anissa alkoi silkkitie.',
    nosto: 'Isoisän kirjassa lukee: "Chang\'anista lähdettiin länteen, '
      + 'ja Roomassa naiset pukeutuivat siihen mitä matkalta tuli." '
      + 'Kaivo, josta armeija löytyi, on merkitty pienellä kyltillä.',
  },
  shanghai: {
    kuvaus: 'Shanghain rantakadulla seisoo rivi eurooppalaisia '
      + 'pankkitaloja 1920-luvulta, ja joen toisella puolella nousee '
      + 'lasitorneja, joita ei ollut vielä 1990. Kääntyi minne tahansa, '
      + 'näki kaksi vuosisataa yhtä aikaa. Illalla koko vastaranta '
      + 'syttyy väreihin kuin jättimäinen mainos itsestään.',
    nosto: 'Isoisä kirjoitti: "Shanghaissa jokainen maa rakensi oman '
      + 'kadunpätkänsä ja kutsui sitä kotimaakseen." Kävelin Bundin '
      + 'päästä päähän ja laskin viisi eri arkkitehtuuria.',
  },
  hongkong: {
    kuvaus: 'Hongkongissa noustiin vuorelle vaunulla, joka kiipeää niin '
      + 'jyrkkää rinnettä, että talot ikkunan takana näyttävät '
      + 'kaatuvan. Ylhäällä koko kaupunki oli jalkojen alla: torneja '
      + 'niin tiheässä, ettei katuja näkynyt. Täällä on enemmän '
      + 'pilvenpiirtäjiä kuin missään muualla maailmassa.',
    nosto: 'Isoisän kirjassa lukee: "Hongkong on kallio, jolle on '
      + 'rakennettu satama ja sataman päälle kaupunki." Laskin torneja '
      + 'kunnes en enää tiennyt, mitkä olin jo laskenut.',
  },
  taipei: {
    kuvaus: 'Taipeissa yömarkkinat alkavat kun aurinko laskee: koko '
      + 'katu täyttyy kojuista, ja ilmassa on höyryä, savua ja '
      + 'kymmenen erilaista tuoksua yhtä aikaa. Kaupungin yllä nousee '
      + 'torni, joka oli valmistuessaan maailman korkein — ja se on '
      + 'rakennettu kestämään sekä maanjäristys että taifuuni.',
    nosto: 'Isoisä kirjoitti Formosasta: "Saari on vuori, joka on '
      + 'noussut merestä, ja sen selkäranka on kolmen kilometrin '
      + 'korkuinen." Söin kulhollisen nuudeleita ja katsoin vuoria '
      + 'kadun päässä.',
  },
  soul: {
    kuvaus: 'Soulissa palatsin portilla vaihdetaan vartio vanhoissa '
      + 'asuissa, ja sadan metrin päässä maan alle laskeutuu metro, '
      + 'jossa on ruudulla junan saapumisaika sekunnin tarkkuudella. '
      + 'Kaupungin läpi virtaa Han-joki, ja sen molemmin puolin nousee '
      + 'kerrostaloja niin pitkälle kuin näkee.',
    nosto: 'Isoisän kirjassa lukee: "Koreassa kirjaimet keksittiin '
      + 'niin, että ne kuvaavat suun asentoa." Katselin kylttiä ja '
      + 'yritin muodostaa yhden äänteen — ja se toimi.',
  },
  tokio: {
    kuvaus: 'Tokiossa astuin risteykseen, jonka yli kävelee kerralla '
      + 'tuhansia ihmisiä joka suuntaan, eikä kukaan törmää kehenkään. '
      + 'Sitten käännyin kadun kulmasta ja löysin pyhäkön, jonka pihalla '
      + 'ei kuulunut mitään. Tokio on maailman väkirikkain kaupunkialue '
      + '— ja silti hiljaisin, jossa olen ollut.',
    nosto: 'Isoisä kirjoitti 1873: "Yedossa on juuri vaihdettu nimi ja '
      + 'koko valtakunnan suunta." Nimi vaihtui Tokioksi 1868, viisi '
      + 'vuotta ennen ukon matkaa — hän ehti nähdä muutoksen alun.',
  },

  // --- Kaakkois-Aasia ----------------------------------------------------------
  manila: {
    kuvaus: 'Manilassa vanhankaupungin muurit ovat kolme kilometriä '
      + 'pitkät ja espanjalaisten rakentamat 1500-luvulla — Filippiinit '
      + 'oli Espanjan siirtomaa yli kolmesataa vuotta, ja se kuuluu '
      + 'yhä nimissä ja kirkoissa. Kadulla ajaa jeepney, kirkasväriseksi '
      + 'maalattu pikkubussi, jollaisia ei ole missään muualla.',
    nosto: 'Isoisän kirjassa lukee: "Manilasta lähti hopealaiva '
      + 'Acapulcoon kaksi ja puoli vuosisataa peräkkäin." Se oli '
      + 'maailman ensimmäinen säännöllinen valtamerireitti, ja se '
      + 'kulki tästä satamasta.',
  },
  hanoi: {
    kuvaus: 'Hanoin vanhassakaupungissa on 36 katua, ja jokainen niistä '
      + 'oli aikanaan yhden ammattikunnan katu: silkkikatu, hopeakatu, '
      + 'bambukatu. Nimet ovat yhä samat. Mopoja tulee joka suunnasta '
      + 'yhtä aikaa, ja kadun yli mennään kävelemällä tasaisesti — '
      + 'liikenne kiertää, jos et pysähdy.',
    nosto: 'Isoisä kirjoitti: "Tonkinissa kaupungin kartta on '
      + 'ammattiluettelo." Etsin hopeakadun ja löysin sieltä hopeasepän, '
      + 'aivan kuten piti.',
  },
  bangkok: {
    kuvaus: 'Bangkokissa nousin veneeseen ja huomasin, että joki on '
      + 'valtatie: pitkähäntäveneet, lautat ja proomut kulkevat '
      + 'Chao Phraya\'ta ylös ja alas koko päivän. Rannalla kimaltavat '
      + 'temppelien katot kullalla ja peililasilla. Kaupungin '
      + 'seremonialliseen nimeen kuuluu 168 kirjainta — se on '
      + 'maailman pisin paikannimi.',
    nosto: 'Isoisän kirjassa lukee: "Siamissa kanavia oli enemmän kuin '
      + 'katuja, ja niitä kutsuttiin idän Venetsiaksi." Suurin osa '
      + 'kanavista on nyt asfaltin alla, mutta joki jäi.',
  },
  yangon: {
    kuvaus: 'Shwedagonin pagodi kohoaa lähes sata metriä ja on '
      + 'päällystetty oikealla kullalla — sitä on lahjoitettu levy '
      + 'kerrallaan satojen vuosien ajan. Huipulla on tuhansia '
      + 'jalokiviä. Kävelin pihalla paljain jaloin muiden mukana, ja '
      + 'kivi oli lämmin.',
    nosto: 'Isoisä kirjoitti 1873: "Rangoonissa temppelin kulta ei ole '
      + 'maalia vaan lahjoituksia, kerros kerrokselta." Katselin ylös '
      + 'niin kauan, että niska jäykistyi.',
  },
  singapore: {
    kuvaus: 'Singapore on saarivaltio, joka mahtuisi Suomeen yli '
      + 'kolmesataa kertaa, ja silti sen satama on maailman '
      + 'vilkkaimpia. Kaupungissa on neljä virallista kieltä, ja saman '
      + 'korttelin varrella on kiinalainen temppeli, moskeija ja '
      + 'hindutemppeli. Ilma on lämmin ja märkä kellon ympäri.',
    nosto: 'Isoisän kirjassa lukee: "Singaporessa laiva ei pysähdy '
      + 'siksi että olisi perillä, vaan siksi että kaikki muutkin '
      + 'pysähtyvät." Laskin satamassa lippuja kahdeksasta maasta.',
  },
  sumatra: {
    kuvaus: 'Sumatralla nousin Tobajärvelle, joka syntyi kun tulivuori '
      + 'räjähti 74 000 vuotta sitten — se oli suurin purkaus kahteen '
      + 'miljoonaan vuoteen, ja se muutti koko maapallon ilmaston '
      + 'vuosiksi. Kraatteri täyttyi vedellä, ja sen keskellä on saari, '
      + 'joka on Singaporen kokoinen.',
    nosto: 'Isoisä kirjoitti: "Sumatran sisämaassa maa muistaa '
      + 'räjähdyksen, jota kukaan ei ole nähnyt." Uin järvessä ja '
      + 'yritin olla ajattelematta, minkä sisällä uin.',
  },
  borneo: {
    kuvaus: 'Borneon sademetsä on yksi maailman vanhimmista — noin '
      + '140 miljoonaa vuotta, paljon vanhempi kuin Amazon. Puut '
      + 'nousevat seitsemänkymmenen metrin korkeuteen, ja niiden '
      + 'latvoissa liikkuu orankeja, joita ei ole luonnossa missään '
      + 'muualla kuin täällä ja Sumatralla. Sade tulee joka iltapäivä '
      + 'kuin kellon mukaan.',
    nosto: 'Isoisän kirjassa lukee: "Borneon metsässä valo ei osu '
      + 'maahan asti." Seisoin latvuston alla keskipäivällä ja jouduin '
      + 'siristämään silmiäni pimeässä.',
  },
  jakarta: {
    kuvaus: 'Jakarta on rakennettu suistoon, ja se vajoaa: osa '
      + 'kaupungista on jo merenpinnan alapuolella, ja siksi Indonesia '
      + 'on päättänyt rakentaa uuden pääkaupungin Borneolle. Vanhan '
      + 'kaupungin hollantilaiset varastotalot seisovat yhä kanavan '
      + 'varrella, ja niiden ohi ajaa moottoripyöriä tuhansittain.',
    nosto: 'Isoisä kirjoitti: "Bataviassa hollantilaiset kaivoivat '
      + 'kanavat kuin kotona, eikä ilmasto ollut samaa mieltä." '
      + 'Kanava on yhä siinä, ja niin on ilmastokin.',
  },

  // --- Etelä-Aasia -------------------------------------------------------------
  kathmandu: {
    kuvaus: 'Kathmandun laaksosta näkyy selkeällä säällä lumihuippuja, '
      + 'jotka ovat kahdeksan kilometrin korkuisia — maailman '
      + 'neljätoista korkeinta vuorta ovat kaikki tässä samassa '
      + 'vuoristossa. Durbar-aukiolla puiset temppelit on kaiverrettu '
      + 'niin tiheään, ettei sileää kohtaa löydy.',
    nosto: 'Isoisän kirjassa lukee: "Nepalissa vuoret eivät ole '
      + 'maisemaa vaan seinä, ja portit siihen ovat harvassa." Seisoin '
      + 'aukiolla ja katsoin pohjoiseen kunnes pilvi tuli väliin.',
  },
  delhi: {
    kuvaus: 'Delhissä on seitsemän kaupunkia päällekkäin: jokainen '
      + 'valtakunta rakensi oman, ja vanhat jäivät uusien alle ja '
      + 'viereen. Qutb Minar on 73 metriä korkea tiiliminareetti '
      + '1200-luvulta, ja sen vieressä seisoo rautapylväs, joka on '
      + 'ollut ulkona 1 600 vuotta eikä ole ruostunut.',
    nosto: 'Isoisä kirjoitti 1873: "Delhissä rauta ei ruostu ja '
      + 'valtakunnat eivät kestä." Kosketin pylvästä ja se oli sileä '
      + 'kuin eilen taottu.',
  },
  kolkata: {
    kuvaus: 'Kolkatassa kulkee yhä raitiovaunu, joka aloitti 1873 — '
      + 'samana vuonna kun isoisä lähti matkaan — ja se on Aasian '
      + 'vanhin yhä liikennöivä raitiotie. Howrahin silta kantaa yli '
      + 'sata tuhatta ajoneuvoa ja miljoona jalankulkijaa päivässä, '
      + 'eikä siinä ole yhtään pulttia: se on kokonaan niitattu.',
    nosto: 'Isoisän kirjassa lukee: "Kalkutassa englantilaiset '
      + 'rakensivat pääkaupungin ja unohtivat kysyä joelta lupaa." '
      + 'Seisoin sillalla ihmisvirrassa enkä päässyt reunalle asti.',
  },
  mumbai: {
    kuvaus: 'Mumbai on rakennettu seitsemälle saarelle, jotka on '
      + 'yhdistetty yhdeksi maakielekkeeksi — meri kaivettiin väleistä '
      + 'pois. Chhatrapati Shivajin rautatieasema näyttää katedraalilta, '
      + 'ja sen läpi kulkee joka päivä kolme miljoonaa ihmistä. '
      + 'Lounasruoat kannetaan kotoa työpaikoille käsin, ja ne löytävät '
      + 'perille lähes aina.',
    nosto: 'Isoisä kirjoitti: "Bombayssa saaret päätettiin liittää '
      + 'yhteen, ja meri väistyi." Katselin karttaa ja etsin saarten '
      + 'rajoja kaduista — kaksi löysin.',
  },
  chennai: {
    kuvaus: 'Chennain Marina Beach on lähes kolmetoista kilometriä '
      + 'pitkä, yksi maailman pisimmistä kaupunkirannoista, ja illalla '
      + 'siellä on koko kaupunki. Kukaan ei ui: virta on liian kova. '
      + 'Sisämaassa temppelien tornit nousevat portaittain ylös, ja '
      + 'jokainen porras on täynnä kivisiä hahmoja.',
    nosto: 'Isoisän kirjassa lukee: "Madrasin rannalla ei ole satamaa '
      + 'vaan aallokko, ja lastit tuodaan maihin veneillä." Satama '
      + 'rakennettiin lopulta, mutta aallokko on ennallaan.',
  },
  colombo: {
    kuvaus: 'Colombossa satama on ollut käytössä kaksituhatta vuotta, '
      + 'ja täällä ovat käyneet vuorollaan arabit, portugalilaiset, '
      + 'hollantilaiset ja britit. Kaupungista lähtee juna etelään '
      + 'aivan meren rantaa pitkin — niin läheltä, että vaunuun '
      + 'roiskuu. Kanelia viedään täältä yhä, kuten viisisataa vuotta '
      + 'sitten.',
    nosto: 'Isoisä kirjoitti 1873: "Ceylonin kaneli on ohutta kuin '
      + 'paperi ja kalliimpaa kuin hopea." Ostin kääryn ja tuoksutin '
      + 'sitä koko junamatkan.',
  },
  karachi: {
    kuvaus: 'Karachi oli sata vuotta sitten pieni kalastajakylä, ja nyt '
      + 'siinä asuu yli kaksikymmentä miljoonaa ihmistä — enemmän kuin '
      + 'koko Skandinaviassa. Satama on Pakistanin portti merelle, ja '
      + 'kalatorille tuodaan aamulla saalis suoraan puuveneistä, joiden '
      + 'keulat on maalattu kirkkaanvärisiksi.',
    nosto: 'Isoisän kirjassa lukee: "Karachi on hiekkaranta, jonne on '
      + 'ankkuroitu satama." Katselin nostureita ja mietin, mitä ukko '
      + 'sanoisi kahdestakymmenestä miljoonasta.',
  },
  kabul: {
    kuvaus: 'Kabul on 1 800 metrin korkeudessa vuorten ympäröimässä '
      + 'laaksossa, ja lumihuiput näkyvät kaupungin kaduilta. Täältä '
      + 'kulki silkkitien haara, ja täällä ovat kulkeneet kaikki, jotka '
      + 'ovat halunneet Intiaan: Aleksanteri, mongolit, britit. '
      + 'Baburin puutarha on ollut samalla rinteellä 1500-luvulta.',
    nosto: 'Isoisä kirjoitti: "Afganistanissa vuoret päättävät, kuka '
      + 'pääsee läpi, eikä yksikään armeija ole toistaiseksi ollut '
      + 'niitä vahvempi." Katselin solaa pohjoisessa enkä epäillyt '
      + 'lausetta hetkeäkään.',
  },
};
