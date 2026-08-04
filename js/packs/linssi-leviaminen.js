// Ihmisen leviäminen Afrikasta: reitit, ajoitukset ja löytöpaikat.
//
// TÄMÄ TIEDOSTO ON KONEEN KIRJOITTAMA. Älä muokkaa käsin:
//   node tools/hae-leviaminen.mjs
//
// Aineisto: ajoitukset julkaistuista tutkimusartikkeleista (ks. rivien
//           lahde-kentät), löytöpaikkojen koordinaatit Wikidatasta (P625).
// Viite:    Jokaisella rivillä on oma viitteensä. Rungon muodostavat
//           Hublin ym. 2017 (Nature 546:289), Richter ym. 2017 (Nature
//           546:293), Vidal ym. 2022 (Nature 601:579), Hershkovitz ym.
//           2018 (Science 359:456), Groucutt ym. 2018 (Nature Ecology &
//           Evolution 2:800), Clarkson ym. 2017 (Nature 547:306), Hublin
//           ym. 2020 (Nature 581:299), Fu ym. 2014 (Nature 514:445),
//           Bennett ym. 2021 (Science 373:1528), Dillehay ym. 2008
//           (Science 320:784), Wilmshurst ym. 2011 (PNAS 108:1815) sekä
//           Iasi ym. 2024 (Science 386:eadq3010).
// Haettu:   https://www.wikidata.org/w/api.php (wbgetentities, avoin, ei
//           avainta) — 3.8.2026. Ajoitukset on poimittu artikkeleista
//           käsin; koneluettavaa kokoavaa lähdettä ei ole olemassa.
// Lisenssi: Wikidatan koordinaatit CC0 1.0 (creativecommons.org/
//           publicdomain/zero/1.0/) — ei ehtoja. Ajoitusluvut ovat
//           lainauksia julkaistuista tutkimuksista, ja lähde on merkitty
//           jokaiselle riville erikseen.
//
// VAROITUS TULKINNASTA — LUE TÄMÄ ENNEN PIIRTÄMISTÄ.
//
// 1. KAARET EIVÄT OLE AINEISTOA. Kukaan ei tiedä mitä reittiä kuljettiin;
//    tiedetään vain, että jossain vaiheessa oltiin jossain. Kaaret on
//    piirretty käsin maantieteellisesti mahdollisten välipisteiden kautta,
//    jotta kartalla näkyisi suunta ja järjestys. Ne ovat havainnekuva,
//    eivät mitattu polku. Vain löytöpaikkojen koordinaatit ovat mitattuja.
//
// 2. AJOITUKSET MUUTTUVAT. Omo Kibishin ikä hyppäsi 195 000:sta
//    233 000:een vuonna 2022, ja Australian tulovuosi on yhä auki
//    65 000:n ja 50 000:n välillä. Jokaisella rivillä on siksi varmuus:
//      'vakiintunut'  tutkijakunta on laajasti yhtä mieltä
//      'kiistelty'    ajoituksesta tai tulkinnasta kiistellään yhä
//    Kiistellyillä riveillä on lisäksi kiista-kenttä, joka kertoo
//    suomeksi mistä nimenomaan kiistellään. Sitä ei saa jättää
//    näyttämättä: kiistellyn luvun esittäminen faktana on tässä
//    aiheessa se yleisin virhe.
//
// 3. VARHAISET RETKET EIVÄT OLE ESI-ISIÄ. Misliyan, Qafzehin ja
//    Al Wustan ihmiset olivat Afrikan ulkopuolella kymmeniätuhansia
//    vuosia ennen varsinaista leviämistä, mutta he eivät jättäneet
//    jälkeä nykyihmisten perimään. Aikajanalla ne näyttävät samalta
//    kuin pääaalto, vaikka tarina on eri.
//
// --- aikajana ---
//
// Jana on LOGARITMINEN. Haarukka on 300 000 vuodesta 3000 vuoteen eli
// yli satakertainen; lineaarisella janalla Eurooppa, Beringia, Amerikat
// ja Tyynimeri puristuisivat kaikki viimeiseen prosenttiin.
//
// Aineisto antaa valmiit osuudet, joten piirtäjän ei tarvitse laskea
// logaritmeja eikä tietää janan päistä:
//   osuus 0 = janan vanha pää (300 000 vuotta sitten)
//   osuus 1 = janan nuori pää (3000 vuotta sitten)
// Vaiheilla osuudet ovat osuusAlku ja osuusLoppu.
//
// Osuus voi olla ALLE 0 tai YLI 1: kaksi kohtaa ei mahdu janalle.
// Jebel Irhoud on 315 000 vuotta vanha eli janan alkupistettä vanhempi,
// ja Itä-Polynesia asutettiin vasta 1 000–700 vuotta sitten eli
// loppupistettä nuorempana. Kumpaakaan lukua ei ole siirretty janalle
// sopivaksi, vaan rivit on merkitty kentällä ulkopuolella: piirtäjä
// päättää, kiinnittääkö ne janan päähän vai jättääkö näyttämättä.
// Merkintä on sekä vaiheilla että löydöillä.
//
// aikapisteet ovat janan asteikkomerkit; iso: true erottaa pääviivat.
//
// --- kentät ---
//
//   vaiheet    avain, nimi, alkoi ja paattyi (vuotta ennen nykyaikaa,
//              alkoi aina suurempi), osuusAlku, osuusLoppu, ajoitus
//              (suomenkielinen teksti), varmuus, kiista, lahde, selite
//              ja kaaret.
//              kaaret on LISTA KAARIA, ei yksi kaari: useimpiin
//              vaiheisiin kuuluu monta suuntaa, eikä niitä saa yhdistää
//              yhdeksi viivaksi. Piste on [lon, lat].
//              Beringian, Kaukaisen Oseanian ja Itä-Polynesian kaaret
//              ylittävät 180. pituuspiirin, joten pituusaste hyppää
//              kesken kaaren arvosta 178 arvoon -179. Sauma on
//              käsiteltävä kuten muussakin aineistossa (tools/tee-maasto.mjs).
//
//   loydot     avain (Wikidatan Q-tunnus), nimi, maa, lon, lat, ika
//              (vuotta ennen nykyaikaa), pienin ja suurin haarukan päät
//              silloin kun lähde antaa haarukan, osuus, ajoitus,
//              varmuus, lahde ja selite. Järjestys on vanhimmasta
//              nuorimpaan. Vain lon ja lat ovat mitattuja: ne tulevat
//              Wikidatan P625-kentästä, muu on poimittu artikkeleista.
//
// 12 vaihetta (185 kaaripistettä), 20 löytöpaikkaa.
// Kiistellyksi merkittyjä kohtia 11.

const AIKAJANA = {"alku":300000,"loppu":3000,"asteikko":"logaritminen"};

const AIKAPISTEET = [
  {"vuotta":300000,"teksti":"300 000","osuus":0,"iso":true},
  {"vuotta":200000,"teksti":"200 000","osuus":0.088,"iso":false},
  {"vuotta":100000,"teksti":"100 000","osuus":0.2386,"iso":true},
  {"vuotta":50000,"teksti":"50 000","osuus":0.3891,"iso":false},
  {"vuotta":30000,"teksti":"30 000","osuus":0.5,"iso":true},
  {"vuotta":20000,"teksti":"20 000","osuus":0.588,"iso":false},
  {"vuotta":10000,"teksti":"10 000","osuus":0.7386,"iso":true},
  {"vuotta":5000,"teksti":"5000","osuus":0.8891,"iso":false},
  {"vuotta":3000,"teksti":"3000","osuus":1,"iso":true},
];

const VAIHEET = [
  {"avain":"afrikka","nimi":"Afrikan sisäinen leviäminen","alkoi":315000,"paattyi":60000,"osuusAlku":-0.0106,"osuusLoppu":0.3495,"ulkopuolella":true,"ajoitus":"noin 315 000–60 000 vuotta sitten","varmuus":"vakiintunut","kiista":"Se että lajimme on yli 300 000 vuotta vanha ja että sen luita on Afrikan vastakkaisista päistä, on vakiintunutta. Kiistaa käydään siitä, syntyikö ihminen yhdellä alueella vai koko mantereen laajuisessa väestöverkostossa.","lahde":"Hublin ym. 2017, Nature 546:289; Richter ym. 2017, Nature 546:293; Vidal ym. 2022, Nature 601:579; Scerri ym. 2018, Trends in Ecology & Evolution 33:582","selite":"Lajimme vanhimmat luut eivät ole yhdestä paikasta vaan Afrikan eri laidoilta: Marokosta noin 315 000 ja Etiopiasta vähintään 233 000 vuoden takaa. Nykykäsityksen mukaan ihminen ei syntynyt yhdessä kehdossa vaan toisiinsa löyhästi yhteydessä olleiden väestöjen verkostossa.","kaaret":[[[-8.9,31.9],[-2,29],[8,24],[20,18],[30,13],[36,5]],[[36,5],[38,-2],[39.7,-3.7],[35,-12],[30,-22],[25,-30],[21.2,-34.4]],[[30,13],[18,13],[5,14],[-8,13],[-16,14]]]},
  {"avain":"varhaiset-retket","nimi":"Varhaiset retket Afrikan ulkopuolelle","alkoi":210000,"paattyi":88000,"osuusAlku":0.0775,"osuusLoppu":0.2663,"ajoitus":"noin 210 000–88 000 vuotta sitten","varmuus":"kiistelty","kiista":"Skhulin ja Qafzehin 120 000–90 000 vuoden hautaukset ovat vakiintuneita, samoin Al Wustan 88 000 vuoden sormiluu. Sen sijaan Misliyan 194 000–177 000 vuoden ajoitusta on arvosteltu uraanisarjadatan tulkinnasta, ja Kreikan Apidiman yli 210 000 vuoden tulkintaa pidetään monin paikoin epävarmana.","lahde":"Hershkovitz ym. 2018, Science 359:456; kommentti Sharp & Paces 2018, Science 362:eaat6598; Groucutt ym. 2018, Nature Ecology & Evolution 2:800; Harvati ym. 2019, Nature 571:500","selite":"Ihmisiä kävi Afrikan ulkopuolella jo kauan ennen varsinaista leviämistä. Nämä retket eivät kuitenkaan jättäneet jälkeä nykyihmisten perimään, joten niiden tekijöiden suku näyttää sammuneen jälkeläisittä.","kaaret":[[[32,20],[32.5,26],[33,30],[34.5,31.5],[35,32.7]],[[35,32],[36,30],[37.5,28],[39.4,27.4]],[[35,32.7],[32,36],[28,38],[24,37],[22.4,36.7]]]},
  {"avain":"paauloslahto","nimi":"Ratkaiseva lähtö Afrikasta","alkoi":60000,"paattyi":50000,"osuusAlku":0.3495,"osuusLoppu":0.3891,"ajoitus":"noin 60 000–50 000 vuotta sitten","varmuus":"vakiintunut","kiista":"Että kaikkien Afrikan ulkopuolisten esivanhemmat lähtivät yhtenä pääaaltona, on vakiintunutta. Tarkka vuosiluku ei ole: vuoden 2024 perimätutkimukset ajoittavat neandertalilaisekoituksen välille 50 500–43 500 vuotta sitten, mikä sitoo lähdön juuri sitä edeltävään aikaan, mutta arviot vaihtelevat 70 000:n ja 50 000:n välillä.","lahde":"Iasi ym. 2024, Science 386:eadq3010; Sümer ym. 2024, Nature, doi:10.1038/s41586-024-08420-x","selite":"Jokaisen nykyisin Afrikan ulkopuolella asuvan ihmisen esivanhemmat lähtivät samassa pääaallossa. Matkalla he saivat lapsia neandertalilaisten kanssa, ja siksi heidän jälkeläisillään on yhä 1–2 prosenttia neandertalilaisperimää.","kaaret":[[[35,12],[33,20],[32.5,27],[34,31],[36,33],[41,35],[47,34],[54,30],[60,28]]]},
  {"avain":"etelainen-reitti","nimi":"Eteläinen reitti Punaisenmeren yli","alkoi":70000,"paattyi":50000,"osuusAlku":0.316,"osuusLoppu":0.3891,"ajoitus":"noin 70 000–50 000 vuotta sitten","varmuus":"kiistelty","kiista":"Kumpaa reittiä pääaalto kulki — Siinain kannasta pitkin vai Bab-el-Mandebin salmen yli Arabian eteläreunalle — ei tiedetä. Molemmilla on kannattajansa, eikä kysymystä ole ratkaistu. Tämä kaari on siis vaihtoehto edelliselle, ei sen lisä.","lahde":"Groucutt ym. 2015, Evolutionary Anthropology 24:149; Bae, Douka & Petraglia 2017, Science 358:eaai9067","selite":"Jääkauden matalan merenpinnan aikaan Bab-el-Mandebin salmi kapeni muutamaan kilometriin. Osa tutkijoista pitää sitä todennäköisempänä reittinä kuin Siinain kannasta, koska Arabian eteläreunan rannikko tarjosi ruokaa koko matkan.","kaaret":[[[40,13],[43.3,12.5],[45,13],[50,15],[55,18],[58,22],[60,25]]]},
  {"avain":"etela-aasia","nimi":"Etelä- ja Kaakkois-Aasia","alkoi":73000,"paattyi":45000,"osuusAlku":0.3069,"osuusLoppu":0.412,"ajoitus":"noin 73 000–45 000 vuotta sitten","varmuus":"kiistelty","kiista":"Fa-Hien Lenan noin 48 000 vuoden löydöt ovat kiistattomia. Sen sijaan Sumatran Lida Ajerin 73 000–63 000 vuoden hampaat ja Laosin Tam Pa Lingin vanhimmat kerrokset viittaisivat paljon varhaisempaan tuloon — mutta perimätutkimus ei löydä näistä varhaisista tulijoista jälkeä nykyihmisissä. Ristiriitaa ei ole ratkaistu.","lahde":"Westaway ym. 2017, Nature 548:322; Wedage ym. 2019, Nature Communications 10:739; Freidline ym. 2023, Nature Communications 14:3193","selite":"Rannikkoa ja jokilaaksoja pitkin edettiin Intian niemimaan yli Kaakkois-Aasiaan. Sri Lankan Fa-Hien Lenassa metsästettiin sademetsässä luusta veistetyillä nuolenkärjillä jo 48 000 vuotta sitten.","kaaret":[[[60,25],[67,25],[72,23],[76,18],[79,13],[80.2,6.6]],[[76,22],[85,23],[90,24],[95,22],[100,20],[103.4,20.2]],[[95,22],[99,15],[101,8],[101,1],[100.5,-0.5]]]},
  {"avain":"australia","nimi":"Australia ja Uusi-Guinea","alkoi":65000,"paattyi":40000,"osuusAlku":0.3321,"osuusLoppu":0.4375,"ajoitus":"noin 65 000–40 000 vuotta sitten","varmuus":"kiistelty","kiista":"Madjedbeben 65 000 ± 6 000 vuoden ajoitus on kiistetty: arvostelijoiden mukaan nuoremmat esineet ovat voineet vajota hiekassa alaspäin, ja he pitävät noin 50 000 vuotta todennäköisempänä. Vuoden 2024 perimätutkimukset tukevat myöhempää tuloa. Mungojärven noin 40 000 vuoden hautaukset ovat sen sijaan kiistattomia.","lahde":"Clarkson ym. 2017, Nature 547:306; arvostelu O’Connell ym. 2018, PNAS 115:8482; Bowler ym. 2003, Nature 421:837","selite":"Australiaan pääsy vaati merenkulkua: silloinkin kun merenpinta oli yli sata metriä nykyistä alempana, Aasian ja Australian väliin jäi kymmenien kilometrien avomeri. Tämä on maailman vanhin todiste siitä, että ihminen kulki vesillä näkymättömissä olevaan määränpäähän.","kaaret":[[[103,3],[110,-2],[115,-6],[120,-8],[125,-9],[128,-9],[130,-11],[132.9,-12.5]],[[120,0],[125,1],[130,-1],[135,-3],[140,-5],[143,-8],[146,-10]],[[132.9,-12.5],[138,-18],[142,-25],[143.1,-33.8]]]},
  {"avain":"eurooppa","nimi":"Eurooppa","alkoi":45000,"paattyi":40000,"osuusAlku":0.412,"osuusLoppu":0.4375,"ajoitus":"noin 45 000–40 000 vuotta sitten","varmuus":"vakiintunut","kiista":"Ranskan Grotte Mandrinista on esitetty jopa 54 000 vuoden ihmishammasta, mutta tulkinnasta kiistellään. Batšo Kiron 45 930–42 580 vuoden luut on sen sijaan ajoitettu suoraan.","lahde":"Hublin ym. 2020, Nature 581:299; Fewlass ym. 2020, Nature Ecology & Evolution 4:794; Sümer ym. 2024, Nature, doi:10.1038/s41586-024-08420-x; Slimak ym. 2022, Science Advances 8:eabj9496","selite":"Eurooppaan tultiin idästä, Anatolian ja Balkanin kautta. Manner ei ollut tyhjä: neandertalilaiset olivat asuneet siellä satojatuhansia vuosia ja katosivat noin 40 000 vuotta sitten, muutaman tuhannen vuoden päällekkäiselon jälkeen.","kaaret":[[[45,37],[40,39],[35,40],[30,41],[26,42],[25.4,42.9],[20,45],[16,47],[13,48],[8,48],[3,47],[-2,43],[-6,40]],[[25.4,42.9],[22,46],[19,49],[15,50.5],[11.3,50.6],[6,51],[1,51]]]},
  {"avain":"pohjois-aasia","nimi":"Pohjois-Aasia ja Siperia","alkoi":45000,"paattyi":30000,"osuusAlku":0.412,"osuusLoppu":0.5,"ajoitus":"noin 45 000–30 000 vuotta sitten","varmuus":"vakiintunut","lahde":"Fu ym. 2014, Nature 514:445; Douka ym. 2019, Nature 565:640; Pitulko ym. 2004, Science 303:52; Sikora ym. 2019, Nature 570:182","selite":"Länsi-Siperian Ust-Ishimin miehen perimä on luettu 45 000 vuoden takaa. 32 000 vuotta sitten oltiin jo napapiirin pohjoispuolella Janajoella — kylmimmässä paikassa, jossa ihminen oli siihen mennessä koskaan asunut.","kaaret":[[[50,38],[57,45],[64,52],[71.2,57.7]],[[71.2,57.7],[78,54],[84.7,51.4],[95,53],[105,56],[115,61],[125,66],[135.4,70.7]]]},
  {"avain":"beringia","nimi":"Beringia","alkoi":23000,"paattyi":16000,"osuusAlku":0.5577,"osuusLoppu":0.6365,"ajoitus":"noin 23 000–16 000 vuotta sitten","varmuus":"kiistelty","kiista":"Pysähdyksen kesto ja ajoitus vaihtelevat arvioissa: eristyksen alkua on esitetty välille 25 000–20 000 ja loppua välille 16 000–15 000 vuotta sitten. Osa tutkijoista pitää perimähavaintoja selitettävissä myös nopealla väestönkasvulla ilman pitkää pysähdystä.","lahde":"Tamm ym. 2007, PLoS ONE 2:e829; Llamas ym. 2016, Science Advances 2:e1501385; Moreno-Mayar ym. 2018, Nature 553:203; Potter ym. 2017, Current Anthropology 58 (S17)","selite":"Jääkauden huipulla merenpinta oli yli sata metriä nykyistä alempana ja Siperian ja Alaskan väliin paljastui tuhat kilometriä leveä maa-alue. Perimätutkimusten mukaan Amerikan asuttajien esivanhemmat viipyivät siellä eristyksissä tuhansia vuosia ennen etenemistä etelään.","kaaret":[[[135.4,70.7],[145,69],[155,67],[165,65],[175,64],[-178,64],[-170,64],[-163,63],[-155,63],[-150,62]]]},
  {"avain":"amerikat","nimi":"Amerikat","alkoi":16000,"paattyi":14000,"osuusAlku":0.6365,"osuusLoppu":0.6655,"ajoitus":"noin 16 000–14 000 vuotta sitten","varmuus":"kiistelty","kiista":"Monte Verden noin 14 500 vuoden asuinpaikka Chilessä on laajasti hyväksytty. New Mexicon White Sandsin jalanjälkien 23 000–21 000 vuoden ajoituksesta sen sijaan kiistellään: ensimmäinen ajoitus perustui siemeniin, jotka voivat ottaa pohjavedestä vanhaa hiiltä. Vuoden 2023 siitepöly- ja kvartsiajoitukset tukevat vanhaa ikää, mutta asia ei ole ratkennut.","lahde":"Dillehay ym. 2008, Science 320:784; Bennett ym. 2021, Science 373:1528; Pigati ym. 2023, Science 382:73; kommentti Madsen ym. 2022, Science 375:eabm4678","selite":"Amerikat olivat viimeinen suuri manneralue, johon ihminen asettui. Chilen Monte Verdessä oltiin noin 14 500 vuotta sitten — eli mantereiden toisessa päässä hyvin pian sen jälkeen, kun reitti etelään aukesi.","kaaret":[[[-150,62],[-145,60],[-135,57],[-130,52],[-125,46],[-122,38],[-117,32],[-110,24],[-100,17],[-90,13],[-82,8],[-78,2],[-77,-7],[-73,-18],[-72,-30],[-73.2,-41.5]],[[-140,63],[-132,59],[-122,55],[-115,52],[-110,47],[-105,42],[-100,36],[-97,31],[-95,25]]]},
  {"avain":"tyynimeri","nimi":"Kaukainen Oseania","alkoi":3300,"paattyi":2800,"osuusAlku":0.9793,"osuusLoppu":1.015,"ulkopuolella":true,"ajoitus":"noin 3 300–2 800 vuotta sitten","varmuus":"vakiintunut","lahde":"Sheppard 2011, Current Anthropology 52:799; Bedford ym. 2006, Antiquity 80:812; Lipson ym. 2018, Current Biology 28:1157","selite":"Lapita-keramiikan tekijät ylittivät Kaukaisen Oseanian rajan noin 3 000 vuotta sitten ja levisivät Vanuatulle, Fidžille, Tongaan ja Samoaan muutamassa sukupolvessa. Tämä oli ensimmäinen kerta, kun ihminen asutti saaria, joita ei näe edellisestä saaresta.","kaaret":[[[147,-3],[151,-5],[155,-7],[159,-9],[163,-11],[167,-15],[168.4,-17.8],[172,-18],[178,-18],[-179,-19],[-175,-21],[-172,-13.8]]]},
  {"avain":"ita-polynesia","nimi":"Itä-Polynesia","alkoi":1000,"paattyi":700,"osuusAlku":1.2386,"osuusLoppu":1.316,"ulkopuolella":true,"ajoitus":"noin 1 000–700 vuotta sitten (1000–1300 jaa.)","varmuus":"vakiintunut","kiista":"Aiemmin esitettiin jopa 2 000 vuoden takaisia asutusaikoja, mutta tarkkuusradiohiiliajoitus siirsi ne selvästi nuoremmiksi. Nykyarvio on vakiintunut: Seurasaaret 1025–1120 jaa. ja loput saaret 1190–1290 jaa.","lahde":"Wilmshurst ym. 2011, PNAS 108:1815; Kirch 2017, On the Road of the Winds (2. laitos)","selite":"Tyynenmeren itäosa asutettiin vasta paljon Lapitan jälkeen ja hyvin nopeasti. Uusi-Seelanti — maapallon viimeinen suuri asumaton maa — sai ensimmäiset asukkaansa vasta 1250–1300 jaa.","kaaret":[[[-172,-13.8],[-165,-16],[-158,-17],[-151,-17],[-149.5,-17.5]],[[-149.5,-17.5],[-145,-14],[-140,-9],[-130,-17],[-120,-24],[-109.4,-27.1]],[[-149.5,-17.5],[-155,-20],[-165,-25],[-178,-32],[176,-38],[174.8,-41.3]],[[-149.5,-17.5],[-152,-8],[-155,2],[-157,12],[-156,19.5]]]},
];

const LOYDOT = [
  {"avain":"Q846913","nimi":"Jebel Irhoud","maa":"Marokko","lon":-8.8725,"lat":31.855,"ika":315000,"pienin":281000,"suurin":349000,"osuus":-0.0106,"ulkopuolella":true,"ajoitus":"315 000 ± 34 000 vuotta sitten","varmuus":"vakiintunut","lahde":"Richter ym. 2017, Nature 546:293; Hublin ym. 2017, Nature 546:289","selite":"Vanhimmat tunnetut luut, joissa on lajimme tuntomerkit. Kasvot ovat jo nykyihmisen, mutta aivokoppa pitkulaisempi — moderni ihminen ei ilmestynyt kerralla valmiina."},
  {"avain":"Q3882284","nimi":"Omo Kibish","maa":"Etiopia","lon":35.9671,"lat":4.8003,"ika":233000,"pienin":211000,"suurin":255000,"osuus":0.0549,"ajoitus":"vähintään 233 000 ± 22 000 vuotta sitten","varmuus":"vakiintunut","lahde":"Vidal ym. 2022, Nature 601:579; aiempi ajoitus McDougall ym. 2005, Nature 433:733","selite":"Omo I -kallo löytyi vuonna 1967. Sen yläpuolisen tuhkakerroksen jäljittäminen Shalan tulivuoren purkaukseen siirsi iän vuonna 2022 vähintään 233 000 vuoteen; aiempi arvio oli 195 000."},
  {"avain":"Q15067212","nimi":"Apidiman luola","maa":"Kreikka","lon":22.3617,"lat":36.6669,"ika":210000,"osuus":0.0775,"ajoitus":"yli 210 000 vuotta sitten (kiistelty)","varmuus":"kiistelty","lahde":"Harvati ym. 2019, Nature 571:500","selite":"Kallonpalanen, jonka tulkittiin olevan yli 210 000 vuotta vanha nykyihminen — 150 000 vuotta vanhempi kuin mikään muu Euroopasta. Sekä lajimääritys että ajoitus ovat yhä kiistanalaisia."},
  {"avain":"Q12409386","nimi":"Misliyan luola","maa":"Israel","lon":34.9724,"lat":32.7413,"ika":185000,"pienin":177000,"suurin":194000,"osuus":0.105,"ajoitus":"194 000–177 000 vuotta sitten (kiistelty)","varmuus":"kiistelty","lahde":"Hershkovitz ym. 2018, Science 359:456; arvostelu Sharp & Paces 2018, Science 362:eaat6598","selite":"Yläleuanpuolikas, joka olisi vanhin nykyihmisen luu Afrikan ulkopuolella. Uraanisarja-ajoituksen tulkintaa on arvosteltu: arvostelijoiden mukaan aineisto takaa vain 60 000–70 000 vuoden vähimmäisiän."},
  {"avain":"Q3643194","nimi":"Herto (Bourin muodostuma)","maa":"Etiopia","lon":40.5299,"lat":10.2871,"ika":157000,"pienin":154000,"suurin":160000,"osuus":0.1406,"ajoitus":"160 000–154 000 vuotta sitten","varmuus":"vakiintunut","lahde":"White ym. 2003, Nature 423:742; Clark ym. 2003, Nature 423:747","selite":"Kolme kalloa, joita kuvattiin alalajina Homo sapiens idaltu. Kalloissa on jälkiä kuolemanjälkeisestä käsittelystä — mahdollisesti vanhimmat merkit vainajan hoitamisen tavoista."},
  {"avain":"Q2121357","nimi":"Qafzehin luola","maa":"Israel","lon":35.318,"lat":32.6885,"ika":100000,"pienin":90000,"suurin":120000,"osuus":0.2386,"ajoitus":"noin 120 000–90 000 vuotta sitten","varmuus":"vakiintunut","lahde":"Valladas ym. 1988, Nature 331:614; Grün ym. 2005, Journal of Human Evolution 49:316","selite":"Vähintään viidentoista ihmisen hautauksia, osa punaokralla ja hautalahjoilla. Nämä ihmiset eivät kuitenkaan ole nykyisten Afrikan ulkopuolisten esivanhempia — heidän sukunsa sammui."},
  {"avain":"Q136439221","nimi":"Al Wusta","maa":"Saudi-Arabia","lon":39.3959,"lat":27.4183,"ika":88000,"osuus":0.2663,"ajoitus":"noin 88 000 vuotta sitten","varmuus":"vakiintunut","lahde":"Groucutt ym. 2018, Nature Ecology & Evolution 2:800","selite":"Yksi sormiluu muinaisen järven rannalta keskeltä nykyistä Nefudin hiekkaerämaata. Vanhin suoraan ajoitettu nykyihmisen luu Afrikan ja Levantin ulkopuolelta."},
  {"avain":"Q53443604","nimi":"Panga ya Saidi","maa":"Kenia","lon":39.7358,"lat":-3.6786,"ika":78000,"osuus":0.2925,"ajoitus":"noin 78 000 vuotta sitten","varmuus":"vakiintunut","lahde":"Martinón-Torres ym. 2021, Nature 593:95; Shipton ym. 2018, Nature Communications 9:1832","selite":"Afrikan vanhin tunnettu tahallinen hautaus: noin kolmivuotias lapsi, jota kutsutaan Mtotoksi, laskettiin kaivettuun kuoppaan pää tuettuna. Luola oli asuttu yhtäjaksoisesti 78 000 vuotta."},
  {"avain":"Q884971","nimi":"Blombosluola","maa":"Etelä-Afrikka","lon":21.2225,"lat":-34.4144,"ika":73000,"pienin":73000,"suurin":77000,"osuus":0.3069,"ajoitus":"noin 77 000–73 000 vuotta sitten","varmuus":"vakiintunut","lahde":"Henshilwood ym. 2002, Science 295:1278; Henshilwood ym. 2018, Nature 562:115","selite":"Okrapalasiin kaiverrettuja ristikkokuvioita ja okravärillä piirretty kuvio kivensirulle. Vanhimpia tunnettuja merkkejä siitä, että ihminen teki kuvan tarkoituksella eikä sattumalta."},
  {"avain":"Q27922296","nimi":"Tam Pa Ling","maa":"Laos","lon":103.4097,"lat":20.2086,"ika":70000,"pienin":46000,"suurin":86000,"osuus":0.316,"ajoitus":"86 000–46 000 vuotta sitten (kiistelty)","varmuus":"kiistelty","lahde":"Demeter ym. 2012, PNAS 109:14375; Freidline ym. 2023, Nature Communications 14:3193","selite":"Manner-Kaakkois-Aasian vanhimmat nykyihmisen luut. Vuoden 2023 uusintaajoitus vei syvimmät kerrokset noin 86 000 vuoteen, mikä sotii perimätutkimuksen antamaa lähtöaikaa vastaan."},
  {"avain":"Q8563176","nimi":"Madjedbebe","maa":"Australia","lon":132.8833,"lat":-12.5,"ika":65000,"pienin":59000,"suurin":71000,"osuus":0.3321,"ajoitus":"65 000 ± 6 000 vuotta sitten (kiistelty)","varmuus":"kiistelty","lahde":"Clarkson ym. 2017, Nature 547:306; arvostelu O’Connell ym. 2018, PNAS 115:8482","selite":"Kalliosuoja, jonka kivityökalut ja okrajauheet ajoitettiin optisesti 65 000 vuoden ikäisiksi. Arvostelijoiden mukaan nuoremmat esineet ovat voineet vajota hiekassa alaspäin, ja he pitävät noin 50 000 vuotta todennäköisempänä."},
  {"avain":"Q3721993","nimi":"Fa-Hien Lena","maa":"Sri Lanka","lon":80.2183,"lat":6.6017,"ika":48000,"pienin":45000,"suurin":48000,"osuus":0.3979,"ajoitus":"noin 48 000–45 000 vuotta sitten","varmuus":"vakiintunut","lahde":"Wedage ym. 2019, Nature Communications 10:739","selite":"Vanhin tunnettu ihmisasutus sademetsässä. Luolasta on löytynyt luusta veistettyjä nuolenkärkiä — todiste jousesta ja nuolesta jo 48 000 vuotta sitten."},
  {"avain":"Q1029322","nimi":"Denisovan luola","maa":"Venäjä (Altai)","lon":84.6762,"lat":51.3976,"ika":45000,"osuus":0.412,"ajoitus":"nykyihmisen jälkiä noin 45 000 vuoden takaa; denisovanihmisiä luolassa jo yli 200 000 vuotta sitten","varmuus":"vakiintunut","lahde":"Reich ym. 2010, Nature 468:1053; Douka ym. 2019, Nature 565:640; Zavala ym. 2021, Nature 595:399","selite":"Luola, josta löytyi vuonna 2010 kokonaan tuntematon ihmislaji pelkän sormiluun perimästä: denisovanihminen. Papuan ja Australian alkuperäisväestöillä on yhä 3–6 prosenttia denisovanperimää."},
  {"avain":"Q4478405","nimi":"Ust-Ishim","maa":"Venäjä (Länsi-Siperia)","lon":71.1708,"lat":57.6944,"ika":45000,"osuus":0.412,"ajoitus":"noin 45 000 vuotta sitten","varmuus":"vakiintunut","lahde":"Fu ym. 2014, Nature 514:445","selite":"Irtysin rannalta löytyi yksi reisiluu, josta luettiin vanhin hyvin säilynyt nykyihmisen perimä. Sen neandertalilaisjaksot olivat pitkiä, mikä osoitti sekoittumisen tapahtuneen vain muutamaa tuhatta vuotta aiemmin."},
  {"avain":"Q4838907","nimi":"Batšo Kiron luola","maa":"Bulgaria","lon":25.4303,"lat":42.9467,"ika":44000,"pienin":42580,"suurin":45930,"osuus":0.4168,"ajoitus":"45 930–42 580 vuotta sitten","varmuus":"vakiintunut","lahde":"Hublin ym. 2020, Nature 581:299; Fewlass ym. 2020, Nature Ecology & Evolution 4:794","selite":"Euroopan vanhimmat suoraan ajoitetut nykyihmisen luut. Samoista kerroksista löytyi luutyökaluja ja karhunhampaista tehtyjä riipuksia."},
  {"avain":"Q452812","nimi":"Mungojärvi","maa":"Australia","lon":143.0833,"lat":-33.75,"ika":40000,"pienin":38000,"suurin":42000,"osuus":0.4375,"ajoitus":"40 000 ± 2 000 vuotta sitten","varmuus":"vakiintunut","lahde":"Bowler ym. 2003, Nature 421:837","selite":"Mungo-nainen poltettiin ja Mungo-mies haudattiin punaokralla siroteltuna noin 40 000 vuotta sitten. Maailman vanhimpia tunnettuja tuhkaushautauksia."},
  {"avain":"Q18399201","nimi":"Janajoen sarvipaikka","maa":"Venäjä (Jakutia)","lon":135.4297,"lat":70.7236,"ika":32000,"pienin":31600,"suurin":32000,"osuus":0.486,"ajoitus":"noin 32 000 vuotta sitten","varmuus":"vakiintunut","lahde":"Pitulko ym. 2004, Science 303:52; Sikora ym. 2019, Nature 570:182","selite":"Vanhin tunnettu asuinpaikka napapiirin pohjoispuolella. Kahden pojan hampaista luettu perimä paljasti aiemmin tuntemattoman väestön, joita kutsutaan muinaisiksi pohjoissiperialaisiksi."},
  {"avain":"Q1200164","nimi":"White Sands","maa":"Yhdysvallat","lon":-106.1717,"lat":32.7797,"ika":22000,"pienin":21000,"suurin":23000,"osuus":0.5673,"ajoitus":"23 000–21 000 vuotta sitten (kiistelty)","varmuus":"kiistelty","lahde":"Bennett ym. 2021, Science 373:1528; Pigati ym. 2023, Science 382:73; kommentti Madsen ym. 2022, Science 375:eabm4678","selite":"Muinaisen järven rantaan jääneitä paljaiden jalkojen jälkiä. Jos ajoitus pitää, ihmisiä oli Amerikassa jo ennen jääkauden huippua — mikä sotii lähes kaikkia muita todisteita vastaan."},
  {"avain":"Q975775","nimi":"Monte Verde","maa":"Chile","lon":-73.2044,"lat":-41.5047,"ika":14500,"pienin":14200,"suurin":14800,"osuus":0.6579,"ajoitus":"noin 14 500 vuotta sitten","varmuus":"vakiintunut","lahde":"Dillehay ym. 2008, Science 320:784","selite":"Turvesuon säilyttämä asuinpaikka: puisia rakenteita, köysiä, jalanjälki ja merilevää 90 kilometrin päästä rannikolta. Löytö mursi 1990-luvulla käsityksen, jonka mukaan Clovis-kulttuuri olisi ollut Amerikan ensimmäinen."},
  {"avain":"Q7701210","nimi":"Teouma","maa":"Vanuatu","lon":168.3862,"lat":-17.7856,"ika":3000,"pienin":2900,"suurin":3000,"osuus":1,"ajoitus":"noin 3 000 vuotta sitten","varmuus":"vakiintunut","lahde":"Bedford ym. 2006, Antiquity 80:812; Lipson ym. 2018, Current Biology 28:1157","selite":"Lapita-kulttuurin hautausmaa. Vainajien perimä osoitti, että Kaukaisen Oseanian ensimmäiset asukkaat tulivat suoraan Taiwanin ja Filippiinien suunnalta lähes ilman papualaista sekoitusta."},
];

export const LEVIAMINEN = {
  aikajana: AIKAJANA, aikapisteet: AIKAPISTEET, vaiheet: VAIHEET, loydot: LOYDOT,
};
