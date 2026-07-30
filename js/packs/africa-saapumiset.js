// Matkakirjan saapumistekstit uudella mallilla (kaikki Afrikan kaupungit):
//
//  - `kuvaus` on nuoren herran tuore fiilis paikasta. Se näkyy
//    lihavoituna ja lukija lukee koko merkinnän ääneen tunteella.
//  - `nosto` päättää merkinnän isoisän kirjan lainaukseen niin, että
//    lähde käy ilmi tekstistä itsestään — erillistä otsikkoa ei ole.
//
// Teksti ei vaihdu kaupungissa olon aikana. Luennat generoidaan
// ElevenLabsilla (Viisas Kertoja, v3 tunnetageilla) tiedostoon
// assets/audio/puhe-africa-saapuminen-<kaupunki>.mp3 — toistaiseksi
// luenta on olemassa vain piloteille (Tanger, Tripoli), ja peli käyttää
// uutta mallia vain niissä (ui.js SAAPUMISLUENNAT). Muut tekstit ovat
// omistajan luettavina työhuoneen Tekstit-välilehdellä; äänet tehdään
// vasta lukukierroksen jälkeen.
export const AFRICA_SAAPUMISET = {
  tanger: {
    kuvaus: 'Laiva kääntyi lahteen ja Tanger nousi vastaan kuin katsomo: '
      + 'valkoiset talot kiipeävät rinnettä, minareetti niiden yllä, ja '
      + 'satamassa sellainen huuto ja touhu, että sydän löi tahtia perässä. '
      + 'Seisoin kannella suolainen tuuli kasvoilla enkä olisi halunnut '
      + 'kiirehtiä mihinkään — kahden meren ja kahden mantereen portti '
      + 'avautui juuri minulle.',
    nosto: 'Isoisän kirjassa on tästä satamasta vain yksi lause: "Täältä '
      + 'Afrikka alkaa, ja täällä sitä on turha yrittää ymmärtää kiireellä." '
      + 'Ukko osasi sittenkin pysähtyä.',
  },
  kairo: {
    kuvaus: 'Kairo ei ala mistään eikä lopu mihinkään — se vain kasvaa '
      + 'ympärille: torvet, kauppiaat, tomu ja kahdenkymmenen miljoonan '
      + 'ihmisen puheensorina. Ja sitten, kadun päässä, ne seisovat: '
      + 'pyramidit, rauhallisina kuin olisivat odottaneet juuri minua '
      + 'neljä ja puoli tuhatta vuotta.',
    nosto: 'Isoisä kirjoitti hävinneensä basaarissa tinkimisen kolmen '
      + 'teekupin jälkeen ja lisäsi: "Pyramidit olivat vanhoja jo silloin, '
      + 'kun Rooma oli kylä." Join oman teeni ja hävisin myös.',
  },
  tripoli: {
    kuvaus: 'Tripoliin tullaan aavikon ja meren välistä: kaupunki makaa '
      + 'kalliolla kuin laivan keula, ja valkoiset muurit hehkuvat '
      + 'auringossa niin, että silmiä täytyy siristää. Kujilta tuoksuu '
      + 'suola, savu ja jasmiini, ja jossain muurien takana kilahtavat '
      + 'karavaanin kellot kuin lupaus pitkästä matkasta.',
    nosto: 'Isoisä kirjoitti nähneensä täällä, kuinka aavikon karavaanit '
      + 'purkavat lastinsa suoraan laivoihin — "kaksi maailmaa kättelee '
      + 'laiturilla", hän merkitsi. Sama kädenpuristus näkyy satamassa yhä.',
  },
  murzuk: {
    kuvaus: 'Viimeinen harju ylitettiin auringonlaskussa, ja siinä se oli: '
      + 'Murzuk, kourallinen savitaloja hiekkameren laidalla. Hiljaisuus on '
      + 'täällä niin täydellinen, että kuulin oman sykkeeni — ja silti '
      + 'tämän tyhjyyden halki on kulkenut valtakuntien kauppatie. Pelkäsin '
      + 'ja ihailin samaan aikaan, enkä hävennyt kumpaakaan.',
    nosto: 'Isoisän kirjassa lukee: "Oppaani tietää tien ilman karttaa; '
      + 'minulla on kartta, enkä tiedä tietä." Ymmärrän lauseen nyt '
      + 'paremmin kuin kotona ymmärsin.',
  },
  alkufra: {
    kuvaus: 'Päiväkausia pelkkää hiekkaa — ja sitten silmänkantamattoman '
      + 'tyhjyyden keskeltä nousee vihreä saareke: palmuja, varjoa, veden '
      + 'tuoksu. Al Kufran keidas ilmestyi eteen niin äkkiä, että hieroin '
      + 'silmiäni kuin unesta herännyt. Vesi maistui täällä paremmalta '
      + 'kuin mikään juoma Lontoossa ikinä.',
    nosto: 'Isoisä merkitsi keitaasta: "Se ilmestyy hiekan keskelle kuin '
      + 'virhe kartassa. Veden määrän tietävät vain ne, jotka ovat asuneet '
      + 'täällä sukupolvia." Virhe kartassa — ja silti ainoa tosi paikka '
      + 'päivien matkalla.',
  },
  sahara: {
    kuvaus: 'Aavikko ei ole tyhjä — sen huomaa vasta täällä. Päivällä valo '
      + 'lyö kuin vasara ja kivet väreilevät kuumuutta, mutta illalla '
      + 'taivas syttyy niin täyteen tähtiä, että jouduin istumaan alas. '
      + 'Opas kaatoi teetä kolmannen lasillisen ja hymyili kartalleni: '
      + 'täällä tiet kulkevat muistissa, eivät paperilla.',
    nosto: 'Isoisä kirjoitti palelleensa yöllä kahden peiton alla ja '
      + 'ihmetelleensä kallioon piirrettyjä karjalaumoja: "Joku on siis '
      + 'paimentanut lehmiä siellä, missä minä en löydä vettä." Sama '
      + 'ihmetys valtasi minutkin.',
  },
  ahaggar: {
    kuvaus: 'Aamuyöllä kiivettiin kylmässä pimeässä, ja sitten valo tuli: '
      + 'Ahaggarin mustat kivitornit nousivat hiekasta yksi kerrallaan '
      + 'kuin uponneen linnan huiput. Henkeäni salpasi — keskellä maailman '
      + 'suurinta aavikkoa seison vuoristossa, jossa palelen, ja kivissä '
      + 'kulkee kirjoitusta, jota tuaregit lukevat sujuvasti.',
    nosto: 'Isoisän sivulla lukee: "Tuaregit tuntevat nämä polut nimeltä; '
      + 'me nimesimme ne uudelleen ja luulimme sitä löytämiseksi." Se on '
      + 'rehellisin lause, jonka ukko koskaan kirjoitti.',
  },
  timbuktu: {
    kuvaus: 'Timbuktun kadut ovat hiekkaa, ja aamulla niistä voi lukea koko '
      + 'yön tarinan: vuohien sorkat, lakaisijan viuhkan jäljet. Klubilla '
      + 'tämän kaupungin nimellä tarkoitetaan paikkaa, jota ei ole — ja '
      + 'kuitenkin täällä on kirjastoja, joiden käsikirjoitukset kertovat '
      + 'tähdistä ja laista. Häpesin hetken sitä, mitä olin uskonut.',
    nosto: 'Isoisä kirjoitti täältä: "Enemmän kirjoja kuin monessa '
      + 'englantilaisessa pikkukaupungissa." Lauseen perään hän oli '
      + 'piirtänyt huutomerkin — ukolla ei ollut tapana tuhlata niitä.',
  },
  gao: {
    kuvaus: 'Tulin aavikon puolelta, ja joki tuli vastaan varoittamatta: '
      + 'Niger, leveä ja hidas, ja vastarannalla hehkuu vaaleanpunainen '
      + 'dyyni. Rannassa lastataan veneitä kuin satamassa ikään, ja '
      + 'Askian savinen hautapyramidi kohoaa kattojen yllä. Täältä '
      + 'hallittiin valtakuntaa, jonka valtatie oli tämä joki.',
    nosto: 'Isoisän kirjassa lukee: "Joen rannalla oli valtakunnan '
      + 'pääkaupunki silloin, kun Englannissa riideltiin ruusuista. '
      + 'Savea kannattaa siis olla kunnioittavampi kuin olen ollut." '
      + 'Katselin hautaa ja nyökkäsin ukolle.',
  },
  dakar: {
    kuvaus: 'Dakarissa Atlantti on joka puolella: tuuli maistuu suolalta, '
      + 'rantabulevardi vilisee elämää ja aallot lyövät mantereen '
      + 'läntisimpään kärkeen. Tästä eteenpäin länteen on vain merta. '
      + 'Goréen saarella hiljenin — sen kauniiden talojen takana on ovi, '
      + 'joka avautuu suoraan merelle, eikä sen historia päästä otteestaan.',
    nosto: 'Isoisä kirjoitti täällä lauseen, jota luen yhä uudelleen: '
      + '"Sen laivauksen järjesti minun maanosani, ei tämä." Hän ei '
      + 'selitellyt, eikä selittele nytkään.',
  },
  sierraleone: {
    kuvaus: 'Vuoret nousevat täällä suoraan merestä, ja kun laiva kaartoi '
      + 'lahteen, ymmärsin portugalilaisia: nämä ovat leijonan vuoret. '
      + 'Freetownin satamassa kannettiin, huudettiin ja naurettiin, ja '
      + 'kaupungin nimi kulki mielessäni koko päivän — vapaudenkaupunki, '
      + 'jonka perustivat orjuudesta vapautetut. Nimi velvoittaa yhä.',
    nosto: 'Isoisän kirjassa on tästä satamasta tarkka lause: "Nimi on '
      + 'annettu siksi, että vapaus oli ensin otettu pois." Sitä ei '
      + 'sanota juhlapuheissa, hän lisäsi — mutta hän kirjoitti sen.',
  },
  kappalmas: {
    kuvaus: 'Kap Palmasin kohdalla koko rannikko kääntyy: viikkokausia '
      + 'etelään, ja yhtäkkiä keula osoittaa itään. Palmut kaartuvat '
      + 'rannalla tuulessa niin taajaan, että ne näkyvät kannelle asti — '
      + 'kuin manner heiluttaisi vihreää lippua käännöksen merkiksi. '
      + 'Seisoin keulassa ja tunsin matkan tekevän mutkan allani.',
    nosto: 'Isoisä merkitsi tähän kohtaan: "Purjehtija tietää sijaintinsa '
      + 'puista; minä tarvitsin siihen sekstantin ja kaksi tuntia." '
      + 'Minä tarvitsin peräti kartan, jossa kulma on valmiiksi piirretty.',
  },
  kumasi: {
    kuvaus: 'Kumasiin tullaan sademetsän läpi, ja kaupunki aukeaa kuin '
      + 'tori, jolla ei ole reunoja: kankaita, kultaa, tomaatteja, '
      + 'kenkiä, ja kaiken yllä puheensorina kuin mehiläispesässä. '
      + 'Eksyin neljästi ja nautin joka kerrasta. Tämä on kuningaskunnan '
      + 'pääkaupunki, ja sen hovin järjestys nöyryyttää vieraan iloisesti.',
    nosto: 'Isoisä kirjoitti Ashantin hovista: "Järjestetty tarkemmin '
      + 'kuin meidän. Kuninkaan istuinta ei lasketa maahan eikä kukaan '
      + 'istu sillä." Perään hän lisäsi kuivasti: "Makuasia." Ukossa '
      + 'oli huumorintajua, kun tarkkaan lukee.',
  },
  orjarannikko: {
    kuvaus: 'Ouidahissa hiekkatie kulkee kaupungilta rannalle, ja mitä '
      + 'pidemmälle kävelin, sitä hiljaisemmaksi tulin. Tien päässä on '
      + 'vain meri ja portti, jonka läpi näkyy pelkkää vettä. Tämän '
      + 'rannan kautta vietiin yli miljoona ihmistä. Seisoin kauan '
      + 'paikallani ja annoin aaltojen puhua, koska itselläni ei ollut '
      + 'sanoja.',
    nosto: 'Isoisän kirjassa on tästä rannikosta ankarin lause, jonka hän '
      + 'kirjoitti: "Nimi ei kerro alueesta mitään; se kertoo meistä '
      + 'kaiken." Hän ei piirtänyt nimeä uudelleen — eikä piirrä tämä '
      + 'kartta minunkaan kädessäni.',
  },
  kano: {
    kuvaus: 'Kano ilmestyi harmattanin pölyn takaa vähitellen, kuin kuva '
      + 'kehittyisi: ensin savimuurit, sitten portit, sitten kokonainen '
      + 'kaupunki auringossa kuivatusta savesta. Värjäämökuoppien äärellä '
      + 'miehet nostivat kankaita, jotka hehkuivat indigonsinisinä — ja '
      + 'sama sini jäi omiin käsiini päiväkausiksi. Kannan sitä ylpeänä.',
    nosto: 'Isoisä kirjoitti: "Värjäämöt ovat toimineet kauemmin kuin '
      + 'yksikään tuntemani englantilainen tehdas." Hänenkin kätensä '
      + 'olivat viikon siniset. Suku ei kehity.',
  },
  kamerun: {
    kuvaus: 'Kamerunvuori nousee suoraan merestä pilviin, ja sen rinteillä '
      + 'sade ei ole säätila vaan olotila. Sateenvarjoni kääntyi nurin '
      + 'ensimmäisessä puuskassa, ja luovuin siitä nauraen — täällä '
      + 'kastutaan arvokkaasti. Vuoren juurella kylät tuoksuvat märälle '
      + 'mullalle ja savulle, ja kaikki mikä kasvaa, kasvaa täysillä.',
    nosto: 'Isoisän kirjassa lukee: "Sateenvarjoni kesti kaksi minuuttia. '
      + 'Vuori on ollut tässä kauemmin." Minun varjoni kesti yhden. '
      + 'Kehitys kulkee suvussa taaksepäin.',
  },
  kongo: {
    kuvaus: 'Kongo ei ole joki vaan sisämeri, joka liikkuu: ruskea vesi '
      + 'kulkee ohi leveänä kuin salmi, ja metsä sen ympärillä ei ole '
      + 'hetkeäkään hiljaa. Se sirisee, kopisee ja huutaa kerroksittain, '
      + 'ja sade kuuluu tulevan jo minuutteja ennen ensimmäistä pisaraa. '
      + 'Ylävirrasta kantautuu koskien jylinä — vesi kuuluu ennen kuin '
      + 'näkyy.',
    nosto: 'Isoisän kartassa tässä kohdassa luki "tuntematon". Hän lisäsi '
      + 'perään: "Tuntematon meille, ei niille jotka siellä asuvat." Se '
      + 'yksi lause on koko kirjan arvoinen.',
  },
  angola: {
    kuvaus: 'Luandan lahti kaartuu kuin sirppi, ja satamassa purjeet ja '
      + 'höyrypiiput seisovat rinnakkain kuin kaksi aikakautta samassa '
      + 'kuvassa. Astuin mereen ja hätkähdin: vesi on kylmää keskellä '
      + 'tropiikkia. Merivirta tuo sen etelästä asti — tämä rannikko ei '
      + 'tee mitään puolivillaisesti.',
    nosto: 'Isoisä kirjoitti satamasta lauseen, joka ei kaipaa jatkoa: '
      + '"Laivat lähtivät Brasiliaan kolmensadan vuoden ajan, ja lastina '
      + 'oli ihmisiä. Muusta ei kannata kiittää ketään." Kylmä vesi '
      + 'tuntui sen jälkeen oikealta.',
  },
  namib: {
    kuvaus: 'Aamulla dyynit nousivat sumusta kuin oranssit vuoret unesta. '
      + 'Kiipesin harjalle auringonnousuun — joka askeleesta puolet valui '
      + 'takaisin — ja ylhäältä näkyi vain lisää hiekkaa, kauniina niin '
      + 'kauas kuin silmä kantoi. Rannalla törröttää laivanhylkyjä: meri '
      + 'ja aavikko ottavat täällä mittaa toisistaan, eikä kumpikaan '
      + 'anna periksi.',
    nosto: 'Isoisä kirjoitti hylyistä: "Jokainen niistä oli jonkun '
      + 'kapteenin varma laskelma. Pidän tämän sivun mielessäni, ennen '
      + 'kuin taas sanon olevani varma." Luin lauseen dyynin harjalla '
      + 'kahdesti.',
  },
  kapkaupunki: {
    kuvaus: 'Pöytävuori näkyi merelle jo tuntikausia ennen satamaa: tasainen '
      + 'kuin veistetty, ja pilvi valui sen laen yli hitaana vesiputouksena. '
      + 'Kaupunki sen juurella tuoksuu merelle ja uudelle maalille, ja '
      + 'kaduilla kuulee puolen maailman kielet. Täällä kaksi valtamerta '
      + 'kohtaa — ja minä seison niiden saumalla.',
    nosto: 'Isoisän kirjassa lukee: "Täydennämme vesitynnyrit vuoren '
      + 'juurella, kuten kaikki Intiaan menevät ovat tehneet. Kaksi '
      + 'valtamerta kohtaa tässä, eikä kumpikaan kysy meiltä lupaa." '
      + 'Ne eivät kysyneet minultakaan.',
  },
  kimberley: {
    kuvaus: 'Kimberleyssä kävelin suoraan maailman reunalle: Iso reikä '
      + 'aukeaa keskellä kaupunkia, puoli kilometriä leveä ja kokonaan '
      + 'lapioilla kaivettu. Pohjalla lepää vihreä vesi kuin salaisuus. '
      + 'Katuvalot syttyivät täällä timanttirahalla ennen kuin monessa '
      + 'Euroopan kaupungissa — ja jokainen valo on kaivettu käsin.',
    nosto: 'Isoisä kirjoitti kuopan reunalta: "Voiton laskee joku, joka '
      + 'ei ole koskaan seisonut reunalla. Kivet lähetetään Lontooseen." '
      + 'Hän ei kirjoittanut, mitä reunalla seisominen maksoi. Sen näkee '
      + 'täällä yhä.',
  },
  mosambik: {
    kuvaus: 'Saari lepää salmessa kuin ankkuroitu laiva, ja lautturi lauloi '
      + 'koko ylityksen. Vanha kaupunki on korallikiveä ja kalkkia, kujat '
      + 'kapeita kuin käytävät, ja vesi ympärillä niin kirkasta, että '
      + 'kalat näkyvät veneeseen asti. Intian valtameri tuo tänne '
      + 'monsuunin, kauppiaat ja tarinat — ja vie ne taas mukanaan.',
    nosto: 'Isoisä merkitsi: "Riutta on niin kirkas, että näen kalat '
      + 'kannelta." Se on hänen kirjansa iloisin lause, ja se pitää '
      + 'yhä paikkansa.',
  },
  madagaskar: {
    kuvaus: 'Madagaskar ei ole Afrikkaa eikä Aasiaa — se on oma maailmansa. '
      + 'Matka rannikolta ylängölle vaihtoi maiseman kolmesti: sademetsä, '
      + 'punaiset kukkulat, riisiterassit. Metsässä katseli takaisin '
      + 'silmäpareja, joita ei näe missään muualla maapallolla, ja kieli '
      + 'kadulla soi kuin kaukaisten saarten laulu. Sitä se onkin.',
    nosto: 'Isoisä päätteli kielestä väärin ja myönsi sen kirjassaan: '
      + '"He purjehtivat tänne idästä." Ukko osasi olla väärässä '
      + 'ääneen — taito, jota opettelen edelleen.',
  },
  sansibar: {
    kuvaus: 'Sansibar tuoksui ennen kuin näkyi: neilikka kantoi merelle '
      + 'asti, ja sitten valkoinen kivikaupunki nousi aalloista. Kujilla '
      + 'veistetyt ovet kertovat tarinoita messinkipiikein ja kuvioin, '
      + 'joita en osaa lukea mutta joita en lakkaa katselemasta. Tämä '
      + 'saari on rakennettu korallista, mausteista ja monsuunituulista.',
    nosto: 'Isoisän kirjassa lukee: "Tyyleissä näkyy Oman, Intia ja '
      + 'swahilirannikko — ei Eurooppa." Hän alleviivasi viimeiset '
      + 'kaksi sanaa. Ymmärrän täällä miksi.',
  },
  kilimandzaro: {
    kuvaus: 'Pilvet raottuivat illalla, ja siinä se hohti: lumihuippu '
      + 'keskellä Afrikkaa, lähes päiväntasaajalla. Katselin sitä kunnes '
      + 'niska puutui. Alhaalla savannin ruoho lainehti lämpimänä, ja '
      + 'ylhäällä valkoinen laki leijui taivaan ja maan välissä kuin ei '
      + 'kuuluisi kumpaankaan. Ymmärrän, ettei kukaan kotona uskonut.',
    nosto: 'Isoisä kirjoitti Lontooseen lumesta ja sai vastauksen neljän '
      + 'kuukauden päästä: "Ei liene mahdollista." Kirjaansa hän merkitsi: '
      + '"Lumi ei tiettävästi ole lukenut kirjettä." Se ei ole '
      + 'vieläkään.',
  },
  viktoria: {
    kuvaus: 'Sanoivat järveksi, mutta silmä sanoo mereksi: Viktoria Nyanza '
      + 'jatkuu horisonttiin asti, eikä toista rantaa näy mistään. '
      + 'Aallokko keinutti lauttaa niin, että kannella tartuttiin '
      + 'kaiteeseen, ja kalastajaveneet lähtivät iltaan lyhtyineen kuin '
      + 'tähdet vesille. Tästä altaasta lähtee liikkeelle itse Niili.',
    nosto: 'Isoisä merkitsi rannalta: "Nimen antoi maanmieheni '
      + 'kuningattaren mukaan, vaikka rannoilla oli ollut nimiä jo '
      + 'pitkään." Kirjoitan tähän molemmat, kuten hänkin teki: '
      + 'Viktoria — ja Nyanza, järvi.',
  },
  tanganjika: {
    kuvaus: 'Tanganjika on kapea ja loputon: vuoret laskeutuvat veteen '
      + 'molemmin puolin, ja järvi jatkuu etelään päivämatkojen päähän. '
      + 'Vesi on niin kirkasta, että veneen varjo kulkee pohjassa syvällä '
      + 'allamme, ja kalat välkkyvät värejä, joita en ole nähnyt missään '
      + 'kirjassa. Rannalla Ujijin mangopuut varjostavat kuuluisaa '
      + 'kohtaamispaikkaa.',
    nosto: 'Isoisä kirjoitti: "Täällä kaksi maanmiestäni tapasi toisensa '
      + 'ja kutsui sitä löytöretkeksi." Ukko valitsi sanansa tarkasti — '
      + 'järvi oli löydetty kauan ennen heitä.',
  },
  bahrelghazal: {
    kuvaus: 'Täällä joki lakkaa olemasta joki: Bahr el Ghazal hajoaa '
      + 'ruohikkoon, ja vene kulkee käytävissä, joiden seinät ovat '
      + 'kaislaa korkeammalta kuin mies. Suot jatkuvat silmänkantamatta, '
      + 'linnut nousevat pilvinä, ja kenkänokka seisoi kaislikossa '
      + 'liikkumatta kuin vartija. Jouduimme kiinni kolmesti — kalastajat '
      + 'lipuivat ohi vaivatta ja tervehtivät kohteliaasti.',
    nosto: 'Isoisän kirjassa lukee: "Karttani sanoi tässä olevan joki." '
      + 'Lauseen kuivuus on ukon mittapuullakin ansiokas. Minun karttani '
      + 'sanoo samaa, ja olemme molemmat yhtä väärässä.',
  },
  darfur: {
    kuvaus: 'Puoliaavikon keskeltä nousee vuori, joka tekee oman säänsä: '
      + 'Jebel Marran rinteillä tuoksuivat appelsiinipuut, kun alhaalla '
      + 'tasangolla pöly peitti jäljet. Täältä lähtivät karavaanit '
      + 'Egyptiin Neljänkymmenen päivän tietä — nimi ei ole runoutta '
      + 'vaan aikataulu, ja se sanotaan täällä yhä samalla '
      + 'itsestäänselvyydellä kuin junavuoro kotona.',
    nosto: 'Isoisä piti tämän alueen nimestä: "Furien maa — eli sen, '
      + 'kenen maa se on. Harvinaisen selkeä nimi kartalla." Toivoin '
      + 'hänen kanssaan, että selkeys tarttuisi muihinkin karttoihin.',
  },
  suakin: {
    kuvaus: 'Suakin on satama, joka on veistetty merestä: talot on '
      + 'rakennettu korallikivestä, ja iltavalossa koko saari hehkuu '
      + 'vaaleanpunaisena kuin simpukan sisus. Laiturilla lastattiin '
      + 'pyhiinvaeltajien laivaa, ja kutsu kantautui veden yli. Istuin '
      + 'kauppiastalon portailla ja kuuntelin kaupunkia, joka on nähnyt '
      + 'tuhat vuotta laivoja.',
    nosto: 'Isoisä kirjoitti korallitaloista: "Kekseliäämpää kuin mikään '
      + 'Lontoon uudisrakennus." Meri antaa täällä rakennuskivetkin — '
      + 'ukko arvosti sellaista taloudenpitoa.',
  },
  addisabeba: {
    kuvaus: 'Addis Abebaan noustaan — kirjaimellisesti: ylänkö on lähes '
      + 'kahden ja puolen kilometrin korkeudessa, ja portaissa huomasin '
      + 'hengästyväni kuin vanhus, kunnes muistin missä olen. Ilma on '
      + 'viileää ja kirkasta, eukalyptus tuoksuu, ja kahviseremonia '
      + 'kesti tunnin, joka meni kuin siivillä. Nimi tarkoittaa uutta '
      + 'kukkaa, ja kaupunki tuntuu nimeltään.',
    nosto: 'Isoisä kirjoitti keisarikunnasta, joka säilytti '
      + 'itsenäisyytensä: "Se hämmentää klubissani suuresti; minua se '
      + 'ei enää hämmennä." Minua ei hämmentänyt hetkeäkään.',
  },
  rashafun: {
    kuvaus: 'Kävelin kapeaa hiekkakannasta, jonka meri on itse rakentanut, '
      + 'ja niemen kärjessä tuuli otti vastaan kuin vanha tuttu: tämä on '
      + 'mantereen itäisin kohta, ja seuraava ranta idässä on Intia. '
      + 'Hiekassa kimalsi ruukunsirpale — joku kauppias pudotti sen ehkä '
      + 'kaksituhatta vuotta sitten. Monsuuni kääntyy täällä yhä '
      + 'vuodenaikojen mukaan, kuten aina.',
    nosto: 'Isoisä merkitsi: "Purjelaiva pääsee Intiaan ja takaisin saman '
      + 'vuoden aikana — tämän tiesivät täällä kaikki ennen kuin '
      + 'höyrykone keksittiin." Seisoin kärjessä ja annoin saman tuulen '
      + 'kääntää lehteä.',
  },
};
