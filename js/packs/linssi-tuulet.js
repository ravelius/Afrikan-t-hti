// Tuulet ja merivirrat: pasaatit, valtamerivirrat ja monsuuni.
//
// TÄMÄ TIEDOSTO ON KONEEN KIRJOITTAMA. Älä muokkaa käsin:
//   NODE_USE_ENV_PROXY=1 node tools/hae-tuulet.mjs
//
// Aineisto: 1) ICOADS, 2° enhanced, kuukausien pitkän ajan keskiarvo
//              1971–2000 (uwnd, vwnd, wspd, sst) — laivojen havaintoja
//           2) OSCAR Sea Surface Velocity, 1/3°, 5 vrk:n koosteet
//              2011-12-06 … 2014-10-06 (u, v)
// Viite:    ICOADS: Freeman ym. 2017, International Journal of Climatology
//           37:2211–2232; tuote NOAA PSL, https://icoads.noaa.gov/
//           OSCAR: Bonjean & Lagerloef 2002, Journal of Physical
//           Oceanography 32:2938–2954; Earth & Space Research (ESR)
//           Vyöhykkeiden nimet ja kolmen kierron malli: NOAA/NWS JetStream,
//           Global Atmospheric Circulations
//           Virtojen keskiviivat: Tomczak & Godfrey, Regional Oceanography
//           (2. laitos 2003); monsuunivirrat Schott & McCreary 2001,
//           Progress in Oceanography 51:1–123
// Haettu:   2026-08-04 osoitteesta
//           https://coastwatch.pfeg.noaa.gov/erddap/griddap/esrlIcoads2gec71_LonPM180
//           https://coastwatch.pfeg.noaa.gov/erddap/griddap/jplOscar
// Lisenssi: Molemmat aineistot jaellaan vapaasti. ERDDAPin lisenssiteksti
//           kummallekin: "The data may be used and redistributed for free
//           but is not intended for legal use, since it may contain
//           inaccuracies." ICOADSia ylläpitää NOAA, ja NOAAn tuottamana
//           aineisto ei ole Yhdysvalloissa tekijänoikeuden alainen.
//           OSCARin tekee Earth & Space Research NASAn rahoituksella, ja
//           se on avointa tutkimusaineistoa.
//
// --- MIKÄ ON MITATTU JA MIKÄ PIIRRETTY ---
//
// Lue tämä ennen kuin piirrät mitään numeroa näkyviin.
//
// MITATTUA (tulee suoraan aineistosta, ei käsin kirjoitettua):
//   - vyöhykkeiden rajat, suunnat, nopeudet ja vakaus
//   - ITCZ:n paikka vuodenajoittain
//   - virtojen nopeus ja lämpöero
//   - kaikki monsuunin nuolet ja kohtien luvut
//   - Somalivirran suunta ja nopeus kummassakin vuodenajassa
//
// PIIRRETTYÄ (havainnekuva, tarkkuus 1–2 astetta):
//   - merivirtojen viivat. Virta ei ole viiva vaan satojen kilometrien
//     levyinen vyöhyke, jonka keskikohta liikkuu viikoittain. Viivat on
//     piirretty oppikirjakartoista käsin.
//   - Somalivirran viiva samoin.
//
// Jokainen piirretty viiva on kuitenkin TARKISTETTU mittausaineistoa
// vastaan: hakutyökalu näytteistää OSCARin virtakentän viivan jokaisen
// pätkän kohdalta ja vaatii, että vähintään 75 % pätkistä osoittaa
// samaan suuntaan kuin mitattu virta. Lämmin/kylmä on tarkistettu
// reunavirroilla ICOADSin pintalämpötilasta: lämpimän virran vesi on
// lämpimämpää kuin saman leveysasteen meri keskimäärin. Kentät nopeus,
// lampoEro ja tarkistettu kertovat, mitä kullekin virralle mitattiin.
//
// --- MIKSI VYÖHYKKEIDEN RAJAT OVAT OUTOJA LUKUJA ---
//
// Oppikirja sanoo "pasaatit noin 30. leveysasteelta päiväntasaajalle".
// Tässä rajat on laskettu aineistosta: hevosleveydet ovat siellä, missä
// itä–länsi-suuntainen tuuli vaihtaa merkkiä, ja tyvenvyöhykkeen
// keskiviiva siellä, missä pohjois–etelä-suuntainen tuuli vaihtaa
// merkkiä. Siksi rajat eivät ole tasalukuja. Kenttä raja kertoo kummasta
// on kyse:
//   'mitattu'   molemmat reunat on laskettu aineistosta
//   'sopimus'   reunat ovat kirjallisuuden lukuja (hevosleveyksien
//               LEVEYS, karjuvien nelikymmenlukujen 40–50)
//   'sekoitus'  keskiviiva mitattu, leveys sopimus (tyvenvyöhyke)
//
// Vyöhykeluvuista on jätetty pois monsuunisektori (30–120° itäistä
// pituutta, 15° etelästä 30° pohjoiseen). Kolmen kierron malli ei päde
// siellä, ja mukana se vetäisi pohjoisen pasaatin keskiarvon vinoon.
// Monsuuni on siksi oma osionsa.
//
// Pasaattivyöhykkeet ulottuvat tässä ITCZ:ään asti, eli ne KOSKETTAVAT
// toisiaan päiväntasaajan tienoilla ja tyvenvyöhyke on piirretty niiden
// päälle. Se ei ole virhe: tyven on juuri se kaista, jossa pasaatit
// kohtaavat, ja sen paikka vaihtuu vuodenajan mukaan.
//
// --- MITÄ KUUKAUSIKESKIARVO EI NÄYTÄ ---
//
// Lue tämä ennen kuin selität lapselle "tyventä".
//
// Aineisto on kuukausikeskiarvojen keskiarvo 2 asteen ruuduissa. Siitä
// EI näy yksittäinen tyven eikä yksittäinen myrsky. Kaksi kuuluisaa
// asiaa jäävät siksi näkymättä, ja molemmat on sanottava ääneen:
//
//   1. Tyvenvyöhykkeen mitattu keskinopeus ei ole nolla. Se on selvästi
//      pasaattia pienempi, mutta kaukana tyvenestä. Purjelaivan viikkojen
//      seisominen oli paikallinen ja hetkellinen asia, jonka keskiarvo
//      pyyhkii pois.
//   2. Hevosleveyksillä ei mitata vähemmän tuulta kuin pasaateilla.
//      Niiden tuntomerkki keskiarvoaineistossa ei ole heikkous vaan
//      EPÄVAKAUS: tuulen suunta ei pysy. Sama koskee tyvenvyöhykettä.
//
// Siksi vakaus on tässä tiedostossa yhtä tärkeä luku kuin nopeus, eikä
// vyöhykkeitä pidä esittää pelkkien nopeuksien perusteella.
//
// --- VAKAUS ON PURJEHTIJAN LUKU ---
//
// vakaus on 0–1: ruudun kuukausikeskituulen vektoripituus jaettuna saman
// ruudun keskinopeudella. Arvo lähellä yhtä tarkoittaa, että tuuli oli
// lähes joka havainnossa samasta suunnasta; matala arvo tarkoittaa, että
// tuuli oli yhtä kova mutta suunta vaihteli. Juuri tästä pasaattien ja
// länsituulten ero syntyy: pasaatilla saattoi purjehtia viikkoja
// koskematta köysiin, länsituulissa ei.
//
// nopeus on skalaarinen keskinopeus (m/s) eli se, minkä laiva tuntee.
// Se on aina suurempi kuin vektorikeskiarvon pituus.
//
// --- SUUNNAT ---
//
// mista on meteorologinen suunta: MISTÄ tuulee, astetta pohjoisesta
// myötäpäivään. Koillispasaatin mista on siis lähes 70°, ja nuoli
// piirretään päinvastaiseen suuntaan (länsilounaaseen). Suuntasana on
// 16-portainen (itäkoillinen, itäkaakko), koska 8 porrasta antaisi
// koillispasaatille nimen "itä".
//
// Mitattu suunta on molemmilla pasaateilla lähempänä itää kuin nimi
// lupaa. Se ei ole virhe: nimet ovat purjehdusperinnettä, ja vyöhykkeen
// yli laskettu keskiarvo painottuu sen päiväntasaajan puoleiseen laitaan,
// jossa tuuli on jo lähes suoraan idästä.
//
// Monsuunin nuolissa annetaan u ja v (m/s itään ja pohjoiseen), koska
// nuolen saa niistä suoraan ilman trigonometriaa; sama u ja v on myös
// vyöhykkeillä. Virroilla ja Somalivirralla suunta on MINNE vesi kulkee —
// vesi ja tuuli nimetään vastakkain päin, ja se on maantieteen sopimus,
// ei virhe tässä tiedostossa.
//
// --- VIRTOJEN NOPEUS ---
//
// nopeus on virran YTIMEN nopeus OSCARin keskiarvokentässä: viivan
// jokaisen pätkän kohdalta otetaan nopein ruutu 1,2 asteen säteeltä ja
// näistä lasketaan keskiarvo. Suunnan tarkistus tehdään sen sijaan koko
// säteen keskiarvosta, joka on suunnan osalta luotettavampi.
//
// Luku on kolmen vuoden aikakeskiarvo, joten hetkellinen nopeus on
// suurempi: NOAAn mukaan Golfvirta kulkee 1–3 solmun eli noin 0,5–1,5
// metrin sekuntinopeudella. Keskiarvokentän SUHTEET ovat silti oikeat,
// ja juuri ne kannattaa näyttää: mannerten itälaidan virrat (Golfvirta,
// Kuroshio, Agulhas) ovat mittauksessa 5–10 kertaa nopeampia kuin
// länsilaidan virrat (Kanaria, Kalifornia, Benguela). Purjelaivalle ero
// oli merkittävä.
//
// --- SAUMA ---
//
// Länsituulten ajovirta ja ekvatoriaalivirrat ylittävät 180. pituus-
// piirin, jolloin pituusaste hyppää kesken viivan arvosta 165 arvoon
// -170. Sauma on käsiteltävä kuten muussakin aineistossa
// (ks. tools/tee-maasto.mjs).
//
// --- KENTÄT ---
//
//   vyohykkeet  avain, nimi, pallonpuolisko, kaistat, selitys, purjehdus.
//               Tyvenvyöhykkeellä on lisäksi itcz: keskiviivan paikka
//               vuoden, talven ja kesän keskiarvona sekä lista
//               kuukausittain (tammikuusta joulukuuhun). Juuri tämä
//               lista kertoo, miksi purjehdusaika oli ratkaiseva:
//               vyöhyke on eri paikassa keväällä ja syksyllä.
//
//               kaistat on LISTA, ei yksi kaista: hevosleveydet ja
//               länsituulet ovat molemmilla pallonpuoliskoilla, ja
//               niiden luvut ovat eri. Kaistassa on etela ja pohjoinen
//               (leveysasteet, + pohjoiseen), raja, u ja v (m/s),
//               mista (astetta), suunta (sana), nopeus (m/s), vakaus
//               (0–1) ja ydin (leveysaste, jolla vyöhyke on vahvimmillaan).
//
//   virrat      avain, nimi, laatu ('lämmin' tai 'kylmä'), suunta
//               (sanoin), nopeus (m/s, ytimestä mitattu), lampoEro (°C
//               saman leveysasteen meren keskiarvoon nähden),
//               tarkistettu, viivat, selitys, purjehdus.
//               viivat on LISTA VIIVOJA: Agulhasilla on paluumutka ja
//               ekvatoriaalivirroilla oma viiva kussakin valtameressä.
//               Piste on [lon, lat].
//
//   monsuuni    kesa ja talvi, kummassakin nimi, kuukaudet (sanoin),
//               kuukausiNumerot, nuolet, kohdat, virta, selitys ja
//               purjehdus.
//               nuolet on 4°:n ruudukko Intian valtameren yllä:
//               lon, lat, u, v (m/s) ja nopeus (m/s). Ruudukko on
//               ICOADSin oma 2°:n ruudukko, ja rannikolla ruudun
//               KESKIPISTE voi osua maalle, vaikka havainnot ovat
//               mereltä (ICOADS on merihavaintoaineisto, joten pelkkää
//               mannerta olevissa ruuduissa ei ole arvoa lainkaan).
//               Piirtäjä voi pudottaa maalle osuvat nuolet pois.
//               kohdat on viisi nimettyä merialuetta: lon, lat, mista,
//               suunta, nopeus.
//               virta on Somalivirta: viiva, minne (astetta),
//               ilmansuunta, nopeus ja koosteita (montako OSCARin
//               viiden vuorokauden koostetta keskiarvoon osui).
//
// 6 vyöhykettä, 12 merivirtaa, 424 monsuuninuolta.

const VYOHYKKEET = [
  {"avain":"koillispasaati","nimi":"Koillispasaati","pallonpuolisko":"pohjoinen","kaistat":[{"pallonpuolisko":"pohjoinen","etela":6.4,"pohjoinen":30.9,"raja":"mitattu","u":-3.8,"v":-1.5,"mista":68,"suunta":"itäkoillinen","nopeus":7,"vakaus":0.69,"ydin":15}],"selitys":"Hevosleveyksien korkeapaineesta valuu ilmaa kohti päiväntasaajaa. Maapallon pyöriminen kääntää sen pohjoisella pallonpuoliskolla oikealle, jolloin syntyy tasainen koillistuuli.","purjehdus":"Tämä on Atlantin länsireitti. Purjelaiva ei kääntynyt Euroopasta suoraan länteen vaan laskeutui ensin Kanarian saarille asti — vasta täältä tuuli puhalsi joka päivä samaan suuntaan Karibialle."},
  {"avain":"kaakkoispasaati","nimi":"Kaakkoispasaati","pallonpuolisko":"eteläinen","kaistat":[{"pallonpuolisko":"eteläinen","etela":-32,"pohjoinen":6.4,"raja":"mitattu","u":-3.3,"v":1.7,"mista":117,"suunta":"itäkaakko","nopeus":6.4,"vakaus":0.7,"ydin":-17}],"selitys":"Sama kierto eteläisellä pallonpuoliskolla, mutta kääntyminen on vasemmalle. Vyöhyke ulottuu päiväntasaajan yli sinne asti, missä se kohtaa koillispasaatin.","purjehdus":"Eteläiselle Atlantille laskeutunut laiva sai kaakkoispasaatista vauhtia Brasilian rannikolle, ja Intiaan matkaava käytti sitä samaa tuulta kaartaakseen Hyväntoivonniemen leveyksille."},
  {"avain":"tyvenvyohyke","nimi":"Tyvenvyöhyke","pallonpuolisko":"päiväntasaaja","kaistat":[{"pallonpuolisko":"päiväntasaaja","etela":-4,"pohjoinen":13.6,"raja":"sekoitus","u":-2.2,"v":0,"mista":90,"suunta":"itä","nopeus":5.3,"vakaus":0.54,"ydin":1.6}],"selitys":"Pasaatit kohtaavat toisensa, ja ilma nousee ylös sen sijaan että kulkisi sivusuunnassa. Jäljelle jää tyventä, äkillisiä ukkoskuuroja ja tuulta, jonka suunta ei pysy — vyöhykkeen nimi merisäätiedossa on ITCZ.","purjehdus":"Purjelaivan pahin paikka: täällä saattoi ajelehtia viikkoja. Kapteenit oppivat ylittämään vyöhykkeen Atlantin länsiosassa, jossa se on kapeimmillaan, ja mieluiten vuodenaikana, jolloin se on kauimpana reitistä.","itcz":{"vuosi":6.4,"talvi":3.3,"kesa":9.4,"kuukausittain":[3.2,-1,-1.5,2.4,5.4,7.6,9.5,10.8,11.1,9.7,7.7,5.3]}},
  {"avain":"hevosleveydet","nimi":"Hevosleveydet","pallonpuolisko":"molemmat","kaistat":[{"pallonpuolisko":"pohjoinen","etela":28.4,"pohjoinen":33.4,"raja":"sopimus","u":0,"v":-0.8,"mista":1,"suunta":"pohjoinen","nopeus":7.3,"vakaus":0.38,"ydin":29},{"pallonpuolisko":"eteläinen","etela":-34.5,"pohjoinen":-29.5,"raja":"sopimus","u":0,"v":1,"mista":180,"suunta":"etelä","nopeus":7.3,"vakaus":0.34,"ydin":-31}],"selitys":"Noin 30. leveysasteella noussut ilma laskeutuu takaisin alas. Laskeva ilma on kuivaa, ja samalla vyöhykkeellä ovat maailman suuret aavikot. Tämä on myös raja, jonka takana tuuli kääntyy pasaatista länsituuleksi.","purjehdus":"Nimi tulee tarinasta, jonka mukaan tyveneen jääneiltä laivoilta heitettiin hevoset yli laidan veden säästämiseksi. Mitattuna tämä kaista ei ole muuta merta tyynempi — sen tuntomerkki on epävakaus: tuuli tulee milloin mistäkin, ja purjelaiva saattoi ajautua päiväkausia väärään suuntaan."},
  {"avain":"lansituulet","nimi":"Länsituulet","pallonpuolisko":"molemmat","kaistat":[{"pallonpuolisko":"pohjoinen","etela":30.9,"pohjoinen":62.9,"raja":"mitattu","u":1.6,"v":-0.1,"mista":275,"suunta":"länsi","nopeus":8.3,"vakaus":0.33,"ydin":49},{"pallonpuolisko":"eteläinen","etela":-64.6,"pohjoinen":-32,"raja":"mitattu","u":3.4,"v":-0.1,"mista":272,"suunta":"länsi","nopeus":8.6,"vakaus":0.49,"ydin":-53}],"selitys":"Hevosleveyksiltä napoja kohti virtaava ilma kääntyy lännenpuoleiseksi. Vyöhykkeellä kulkevat matalapaineet, joten tuuli on kova mutta suunnaltaan paljon pasaatia epävakaampi.","purjehdus":"Tämä on paluureitti. Amerikasta Eurooppaan palattiin pohjoista kaarta länsituulten mukana, ei samaa tietä takaisin — meno ja paluu ovat siksi kartalla kaksi eri kaarta, jotka yhdessä kiertävät Atlantin."},
  {"avain":"karjuvat-nelikymmenluvut","nimi":"Karjuvat nelikymmenluvut","pallonpuolisko":"eteläinen","kaistat":[{"pallonpuolisko":"eteläinen","etela":-50,"pohjoinen":-40,"raja":"sopimus","u":4.4,"v":-0.5,"mista":276,"suunta":"länsi","nopeus":9,"vakaus":0.54,"ydin":-49}],"selitys":"Eteläisellä pallonpuoliskolla länsituulet kiertävät maapallon ympäri lähes ilman mannerten vastusta. Siksi ne ovat paljon kovempia kuin pohjoiset länsituulet — 50. asteella puhutaan raivoavista viisikymmenluvuista.","purjehdus":"Viljaklippereiden valtatie: Hyväntoivonniemeltä Australiaan ja edelleen Kap Hornin ympäri kuljettiin näiden tuulien mukana aina itään, jolloin maailman ympäri oli nopeampi purjehtia kuin palata samaa tietä takaisin."},
];

const VIRRAT = [
  {"avain":"golfvirta","nimi":"Golfvirta","laatu":"lämmin","suunta":"lounaasta koilliseen","nopeus":0.66,"lampoEro":2.7,"tarkistettu":"suunta ja lämpötila","viivat":[[[-80,25],[-79.5,28],[-80.5,31],[-78,33],[-75,35.5],[-72,37.5],[-68,39.5],[-63,40.5],[-58,41.5],[-52,43],[-46,44]]],"selitys":"Meksikonlahdelta Floridansalmen kautta purkautuva kapea ja nopea virta, joka seuraa Yhdysvaltain rannikkoa Hatterasniemelle ja kaartaa siitä avomerelle. Se on maailman tunnetuin merivirta ja yksi nopeimmista.","purjehdus":"Purjelaiva ajoi Amerikasta Eurooppaan Golfvirran mukana ja pysytteli sen ulkopuolella tullessaan takaisin. Benjamin Franklin painatti virrasta kartan noin 1770 selittääkseen, miksi Britannian postilaivat kulkivat Amerikkaan viikkoja hitaammin kuin samaa reittiä ajaneet kauppalaivat."},
  {"avain":"pohjois-atlantin-virta","nimi":"Pohjois-Atlantin virta","laatu":"lämmin","suunta":"lounaasta koilliseen","nopeus":0.18,"lampoEro":4.3,"tarkistettu":"suunta ja lämpötila","viivat":[[[-46,44],[-40,47],[-34,49],[-28,51],[-22,53],[-16,55],[-10,57],[-5,59],[0,61],[5,63]]],"selitys":"Golfvirran jatke, joka levenee Atlantin poikki ja kuljettaa lämmintä vettä Luoteis-Euroopan rannikolle. Se on syy siihen, että Norjan satamat ovat sulia yhtä pohjoisessa kuin Grönlannin jäätiköt.","purjehdus":"Sama vesi, joka vei laivat Amerikasta kotiin, pitää Euroopan rannikon jäättömänä. Pohjoisen reitin satamat olivat siksi auki ympäri vuoden, toisin kuin samalla leveydellä Kanadan puolella."},
  {"avain":"kanarian-virta","nimi":"Kanarian virta","laatu":"kylmä","suunta":"koillisesta lounaaseen","nopeus":0.06,"lampoEro":-2.9,"tarkistettu":"suunta ja lämpötila","viivat":[[[-11,36],[-13,33],[-15,30],[-17,27],[-18,24],[-19,21],[-20,18],[-21,15]]],"selitys":"Atlantin kierron itälaita: viileää vettä valuu Iberian niemimaalta Luoteis-Afrikan rannikkoa pitkin etelään. Rannikolla nousee lisäksi kylmää vettä syvyydestä, mikä tekee vesistä poikkeuksellisen kalaisia.","purjehdus":"Virta vie samaan suuntaan kuin koillispasaati, joten laivat pääsivät Euroopasta Kanarialle nopeasti. Paluu samaa reittiä oli mahdotonta — sekä tuuli että vesi olivat vastaan."},
  {"avain":"brasilian-virta","nimi":"Brasilian virta","laatu":"lämmin","suunta":"koillisesta lounaaseen","nopeus":0.18,"lampoEro":0.6,"tarkistettu":"suunta ja lämpötila","viivat":[[[-35,-9],[-36.5,-13],[-38,-17],[-41,-21],[-45,-25],[-48,-29],[-51,-33],[-53,-37]]],"selitys":"Etelä-Amerikan itärannikkoa etelään kulkeva lämmin reunavirta. Se kohtaa pohjoiseen tulevan kylmän Falklandin virran noin 38. asteella, ja kohtaamiskohta on yksi maailman jyrkimmistä lämpötilarajoista merellä.","purjehdus":"Etelä-Atlantin ylittänyt laiva sai virrasta apua Rio de Janeiroon ja Montevideoon. Sama virta hidasti pohjoiseen palaavia, jotka pysyttelivät kauempana avomerellä."},
  {"avain":"benguela","nimi":"Benguelan virta","laatu":"kylmä","suunta":"etelästä pohjoiseen","nopeus":0.11,"lampoEro":-4,"tarkistettu":"suunta ja lämpötila","viivat":[[[16.5,-33],[14,-30],[12.5,-27],[11.5,-24],[10.5,-21],[9.5,-18],[8.5,-16]]],"selitys":"Kylmää vettä nousee syvyydestä Namibian rannikolla ja kulkee luoteeseen kohti päiväntasaajaa. Kylmä meri kuivattaa yllään olevan ilman, ja siksi Namibin autiomaa alkaa suoraan rantaviivasta.","purjehdus":"Hyväntoivonniemen kiertänyt laiva sai virrasta vastuksen palatessaan pohjoiseen — mutta samalla sumun ja kylmyyden, joista Luurankorannikon maine haaksirikkojen paikkana syntyi."},
  {"avain":"agulhas","nimi":"Agulhasvirta","laatu":"lämmin","suunta":"koillisesta lounaaseen","nopeus":0.58,"lampoEro":2.8,"tarkistettu":"suunta ja lämpötila","viivat":[[[37,-19],[36,-22],[34,-25],[32,-28],[30,-31],[27,-34],[23,-36],[20,-38]],[[20,-38],[24,-40],[28,-40.5],[32,-40.5]]],"selitys":"Intian valtameren kapea ja nopea reunavirta, joka kulkee Afrikan itärannikkoa etelään. Agulhasniemen kohdalla se kääntyy jyrkästi takaisin itään — toinen viiva on tämä paluumutka.","purjehdus":"Virta kulkee lounaaseen mutta karjuvat nelikymmenluvut puhaltavat idästä: kun kova vastatuuli kohtaa nopean virran, syntyy Agulhasin hirmuaallot. Purjelaivan reitti Intiasta kotiin kulki juuri tästä."},
  {"avain":"kuroshio","nimi":"Kuroshio","laatu":"lämmin","suunta":"lounaasta koilliseen","nopeus":0.73,"lampoEro":1.4,"tarkistettu":"suunta ja lämpötila","viivat":[[[122,23],[124,26],[128,29],[132,31.5],[137,33.5],[141,35],[145,36],[150,36],[155,36]]],"selitys":"Tyynenmeren Golfvirtaa vastaava lämmin reunavirta, joka kulkee Taiwanilta Japanin eteläpuolitse koilliseen. Japanilainen nimi tarkoittaa mustaa virtaa: sen kirkas ja ravinneköyhä vesi näyttää tummansiniseltä.","purjehdus":"Kuroshio vei laivat Japanista Tyynenmeren poikki Amerikkaan. Samalla virralla ajelehti vuosisatojen ajan japanilaisia haaksirikkoja Pohjois-Amerikan rannikolle asti."},
  {"avain":"kalifornian-virta","nimi":"Kalifornian virta","laatu":"kylmä","suunta":"pohjoisesta etelään","nopeus":0.07,"lampoEro":-2.7,"tarkistettu":"suunta ja lämpötila","viivat":[[[-127,47],[-126,43],[-125,39],[-123,35],[-120,31],[-117,27],[-115,23]]],"selitys":"Tyynenmeren pohjoisen kierron itälaita: viileä vesi valuu Brittiläisestä Kolumbiasta Kalifornian ohi etelään. Kylmä meri lämpimän maan vieressä tekee San Franciscon kuuluisat kesäsumut.","purjehdus":"Etelään pääsi helposti, pohjoiseen ei. Espanjalaisten Manilan-galeonien oli purjehdittava kauas pohjoiseen länsituulten vyöhykkeelle ennen kuin ne saattoivat kääntyä Kaliforniaan — virtaa vastaan ei noustu."},
  {"avain":"humboldt","nimi":"Humboldtin virta","laatu":"kylmä","suunta":"etelästä pohjoiseen","nopeus":0.09,"lampoEro":-4,"tarkistettu":"suunta ja lämpötila","viivat":[[[-75,-43],[-74,-38],[-73,-33],[-72.5,-28],[-73.5,-23],[-75,-18],[-78,-14],[-81,-10],[-83,-6]]],"selitys":"Kylmä virta kulkee Chilen ja Perun rannikkoa pohjoiseen, ja sen mukana nousee syvyydestä ravinteikasta vettä. Alue on maailman tuottoisin kalavesi — ja kuivin rannikko, sillä kylmä meri ei anna sateita Atacamalle.","purjehdus":"Kap Hornin kiertäneelle laivalle virta oli myötäinen aina Peruun asti. Etelään palaavat pysyttelivät kaukana rannikosta, missä virran vastus on pienempi."},
  {"avain":"lansituulten-ajovirta","nimi":"Länsituulten ajovirta","laatu":"kylmä","suunta":"lännestä itään","nopeus":0.11,"lampoEro":-0.1,"tarkistettu":"suunta","viivat":[[[-65,-57],[-45,-53],[-25,-50],[-5,-49],[15,-48],[40,-48],[65,-49],[90,-52],[115,-55],[140,-57],[165,-59],[-170,-59],[-140,-58],[-110,-57],[-85,-57],[-70,-57]]],"selitys":"Ainoa merivirta, joka kiertää koko maapallon ympäri kohtaamatta mannerta. Karjuvat nelikymmenluvut työntävät sitä itään, ja se kuljettaa enemmän vettä kuin mikään muu virta maailmassa.","purjehdus":"Viljalaivojen moottori: Hyväntoivonniemeltä Australiaan ja Kap Hornin ympäri kuljettiin aina itään, tuulen ja virran mukana. Länteen päin samaa matkaa ei kannattanut yrittää."},
  {"avain":"pohjois-ekvatoriaalivirta","nimi":"Pohjoinen ekvatoriaalivirta","laatu":"lämmin","suunta":"idästä länteen","nopeus":0.11,"lampoEro":-0.4,"tarkistettu":"suunta","viivat":[[[-20,12],[-30,12],[-40,12],[-50,13],[-58,14]],[[-108,12],[-130,12],[-150,12],[-170,12],[175,13],[155,13],[135,13]]],"selitys":"Koillispasaatin työntämä leveä virta, joka kulkee valtameren poikki itälaidalta länsilaidalle. Lännessä vesi kasautuu ja kääntyy pohjoiseen Golfvirraksi ja Kuroshioksi.","purjehdus":"Sama tuuli, joka vei laivan länteen, vei myös veden. Menomatka Atlantin yli oli siksi nopeampi kuin pelkkä tuulen nopeus antaisi ymmärtää."},
  {"avain":"etela-ekvatoriaalivirta","nimi":"Eteläinen ekvatoriaalivirta","laatu":"lämmin","suunta":"idästä länteen","nopeus":0.25,"lampoEro":-0.1,"tarkistettu":"suunta","viivat":[[[8,-6],[-5,-5],[-18,-4],[-30,-4]],[[-88,-4],[-110,-4],[-135,-4],[-160,-4],[175,-5],[155,-6]],[[100,-10],[85,-11],[70,-12],[55,-13],[45,-14]]],"selitys":"Kaakkoispasaatin työntämä vastine päiväntasaajan eteläpuolella. Se ylittää kaikki kolme valtamerta ja päättyy lännessä lämpimään vesialtaaseen, josta lähtevät Brasilian ja Agulhasin virrat.","purjehdus":"Atlantin haara työntää vettä Etelä-Amerikan itäkärkeä kohti ja jakautuu siinä kahtia. Sama tuuli ja virta vei Pedro Álvares Cabralin laivaston Brasiliaan vuonna 1500 matkalla Intiaan — historioitsijat kiistelevät yhä siitä, oliko poikkeama vahinko vai tarkoitus."},
];

const MONSUUNI = {
  kesa: {
    nimi: "Lounaismonsuuni",
    kuukaudet: "kesäkuu–syyskuu",
    kuukausiNumerot: [6,7,8,9],
    selitys: "Aasian manner kuumenee kesällä merta nopeammin, ilma nousee sen yltä ja meri-ilma imeytyy tilalle. Kaakkoispasaati ylittää päiväntasaajan, kääntyy lounaistuuleksi ja tuo Intiaan sadekauden.",
    purjehdus: "Tämä on menotuuli. Kesämonsuunilla purjehdittiin Arabiasta ja Afrikasta Intiaan muutamassa viikossa — mutta tuuli on kova ja rannikko tuulen alla, joten satamiin oli tultava ennen pahinta.",
    virta: {"nimi":"Somalivirta","viiva":[[46,3],[48,6],[51,9],[54,11],[57,13]],"minne":67,"ilmansuunta":"itäkoillinen","nopeus":0.48,"koosteita":37},
    kohdat: [
      {"nimi":"Arabianmeri","lon":61,"lat":11,"mista":235,"suunta":"lounas","nopeus":11.4},
      {"nimi":"Somalian rannikko","lon":51,"lat":5,"mista":217,"suunta":"lounas","nopeus":10.9},
      {"nimi":"Intian länsirannikko","lon":73,"lat":11,"mista":272,"suunta":"länsi","nopeus":7.7},
      {"nimi":"Bengalinlahti","lon":87,"lat":15,"mista":228,"suunta":"lounas","nopeus":9},
      {"nimi":"Malakan salmi","lon":97,"lat":5,"mista":252,"suunta":"länsilounas","nopeus":4.1},
    ],
    nuolet: [
      {"lon":35,"lat":-25,"u":-2.2,"v":1.6,"nopeus":6.9},
      {"lon":39,"lat":-25,"u":-3,"v":1.4,"nopeus":6.4},
      {"lon":43,"lat":-25,"u":-3.4,"v":2.5,"nopeus":7.1},
      {"lon":47,"lat":-25,"u":-4.5,"v":-1.2,"nopeus":8.5},
      {"lon":51,"lat":-25,"u":-4.3,"v":-0.2,"nopeus":7.3},
      {"lon":55,"lat":-25,"u":-4,"v":1.1,"nopeus":7.1},
      {"lon":59,"lat":-25,"u":-4.2,"v":1.2,"nopeus":6.9},
      {"lon":63,"lat":-25,"u":-5.1,"v":2.1,"nopeus":7.5},
      {"lon":67,"lat":-25,"u":-4.8,"v":2.4,"nopeus":8},
      {"lon":71,"lat":-25,"u":-4.7,"v":1.9,"nopeus":7.6},
      {"lon":75,"lat":-25,"u":-4.6,"v":2.4,"nopeus":7.5},
      {"lon":79,"lat":-25,"u":-4,"v":2.2,"nopeus":7.2},
      {"lon":83,"lat":-25,"u":-3.1,"v":2.6,"nopeus":7},
      {"lon":87,"lat":-25,"u":-3.8,"v":2.5,"nopeus":7},
      {"lon":91,"lat":-25,"u":-3.7,"v":3.1,"nopeus":7.4},
      {"lon":95,"lat":-25,"u":-3.7,"v":2.7,"nopeus":7.5},
      {"lon":99,"lat":-25,"u":-2.4,"v":3.2,"nopeus":7},
      {"lon":103,"lat":-25,"u":-2.9,"v":3.8,"nopeus":7.2},
      {"lon":107,"lat":-25,"u":-1.9,"v":3.8,"nopeus":7.1},
      {"lon":111,"lat":-25,"u":-1.4,"v":4.1,"nopeus":7.2},
      {"lon":35,"lat":-21,"u":-2.6,"v":2.2,"nopeus":5.5},
      {"lon":39,"lat":-21,"u":-2.3,"v":3.5,"nopeus":6.2},
      {"lon":43,"lat":-21,"u":-0.5,"v":3.8,"nopeus":5.8},
      {"lon":51,"lat":-21,"u":-4.2,"v":1.7,"nopeus":6.3},
      {"lon":55,"lat":-21,"u":-5.4,"v":2.2,"nopeus":7.4},
      {"lon":59,"lat":-21,"u":-6.5,"v":2.7,"nopeus":8.2},
      {"lon":63,"lat":-21,"u":-6.3,"v":2.9,"nopeus":8.2},
      {"lon":67,"lat":-21,"u":-6.8,"v":3.3,"nopeus":8.6},
      {"lon":71,"lat":-21,"u":-6.5,"v":3.5,"nopeus":8.5},
      {"lon":75,"lat":-21,"u":-6.8,"v":4,"nopeus":8.9},
      {"lon":79,"lat":-21,"u":-6.6,"v":3.8,"nopeus":8.8},
      {"lon":83,"lat":-21,"u":-6.6,"v":3.6,"nopeus":8.8},
      {"lon":87,"lat":-21,"u":-5.7,"v":3.3,"nopeus":8.1},
      {"lon":91,"lat":-21,"u":-6,"v":4.1,"nopeus":8.4},
      {"lon":95,"lat":-21,"u":-6.4,"v":3.8,"nopeus":8.7},
      {"lon":99,"lat":-21,"u":-5.6,"v":4.5,"nopeus":8.3},
      {"lon":103,"lat":-21,"u":-4.5,"v":4.1,"nopeus":7.3},
      {"lon":107,"lat":-21,"u":-3.7,"v":4.1,"nopeus":7.3},
      {"lon":111,"lat":-21,"u":-2.9,"v":4.1,"nopeus":7.1},
      {"lon":39,"lat":-17,"u":-1,"v":4,"nopeus":6},
      {"lon":43,"lat":-17,"u":-0.8,"v":3.5,"nopeus":5.4},
      {"lon":51,"lat":-17,"u":-3.4,"v":3.8,"nopeus":6.5},
      {"lon":55,"lat":-17,"u":-6.9,"v":5.1,"nopeus":9.3},
      {"lon":59,"lat":-17,"u":-7.2,"v":3.8,"nopeus":9.2},
      {"lon":63,"lat":-17,"u":-8,"v":4.2,"nopeus":9.7},
      {"lon":67,"lat":-17,"u":-7.5,"v":3.9,"nopeus":9.4},
      {"lon":71,"lat":-17,"u":-7.4,"v":4,"nopeus":9.2},
      {"lon":75,"lat":-17,"u":-7.2,"v":4.5,"nopeus":9.2},
      {"lon":79,"lat":-17,"u":-7.1,"v":4.7,"nopeus":9.2},
      {"lon":83,"lat":-17,"u":-7.8,"v":4.5,"nopeus":9.8},
      {"lon":87,"lat":-17,"u":-7.7,"v":5.1,"nopeus":10.1},
      {"lon":91,"lat":-17,"u":-7.3,"v":5,"nopeus":9.8},
      {"lon":95,"lat":-17,"u":-7.4,"v":4.8,"nopeus":9.6},
      {"lon":99,"lat":-17,"u":-6.4,"v":4.5,"nopeus":8.6},
      {"lon":103,"lat":-17,"u":-6.7,"v":4,"nopeus":8.6},
      {"lon":107,"lat":-17,"u":-4.9,"v":4,"nopeus":7.5},
      {"lon":111,"lat":-17,"u":-4.4,"v":3.9,"nopeus":7.1},
      {"lon":43,"lat":-13,"u":-1.6,"v":5,"nopeus":6.4},
      {"lon":47,"lat":-13,"u":-1.4,"v":2.1,"nopeus":4.9},
      {"lon":51,"lat":-13,"u":-4.1,"v":7.9,"nopeus":9.9},
      {"lon":55,"lat":-13,"u":-6.3,"v":6.4,"nopeus":9.7},
      {"lon":59,"lat":-13,"u":-6.8,"v":4.7,"nopeus":8.7},
      {"lon":63,"lat":-13,"u":-7,"v":4.7,"nopeus":9.1},
      {"lon":67,"lat":-13,"u":-7.9,"v":4.6,"nopeus":9.6},
      {"lon":71,"lat":-13,"u":-7.7,"v":4.6,"nopeus":9.6},
      {"lon":75,"lat":-13,"u":-6.7,"v":4.7,"nopeus":9.2},
      {"lon":79,"lat":-13,"u":-6.6,"v":5,"nopeus":9.2},
      {"lon":83,"lat":-13,"u":-7,"v":5.7,"nopeus":9.7},
      {"lon":87,"lat":-13,"u":-7.3,"v":5.4,"nopeus":9.7},
      {"lon":91,"lat":-13,"u":-7.5,"v":5.1,"nopeus":9.8},
      {"lon":95,"lat":-13,"u":-7,"v":4.3,"nopeus":9},
      {"lon":99,"lat":-13,"u":-7.2,"v":4.1,"nopeus":9.1},
      {"lon":103,"lat":-13,"u":-6.9,"v":3.5,"nopeus":8.4},
      {"lon":107,"lat":-13,"u":-5.9,"v":3.4,"nopeus":7.7},
      {"lon":111,"lat":-13,"u":-4.8,"v":2.9,"nopeus":6.9},
      {"lon":43,"lat":-9,"u":-3.4,"v":4.7,"nopeus":6.9},
      {"lon":47,"lat":-9,"u":-5.6,"v":5.7,"nopeus":8.8},
      {"lon":51,"lat":-9,"u":-5.1,"v":6.8,"nopeus":9.4},
      {"lon":55,"lat":-9,"u":-5.7,"v":6.4,"nopeus":9.1},
      {"lon":59,"lat":-9,"u":-5.6,"v":5.1,"nopeus":8.1},
      {"lon":63,"lat":-9,"u":-5.3,"v":4.1,"nopeus":7.5},
      {"lon":67,"lat":-9,"u":-5.8,"v":4.6,"nopeus":8.2},
      {"lon":71,"lat":-9,"u":-6.2,"v":4.7,"nopeus":8.5},
      {"lon":75,"lat":-9,"u":-6.1,"v":4.7,"nopeus":8.5},
      {"lon":79,"lat":-9,"u":-5.7,"v":5.2,"nopeus":8.4},
      {"lon":83,"lat":-9,"u":-5.2,"v":4.9,"nopeus":8.3},
      {"lon":87,"lat":-9,"u":-5,"v":3.8,"nopeus":7.6},
      {"lon":91,"lat":-9,"u":-5.5,"v":3.5,"nopeus":7.4},
      {"lon":95,"lat":-9,"u":-5.5,"v":3,"nopeus":7.5},
      {"lon":99,"lat":-9,"u":-6.2,"v":2.7,"nopeus":7.7},
      {"lon":103,"lat":-9,"u":-6,"v":2.6,"nopeus":7.6},
      {"lon":107,"lat":-9,"u":-5.9,"v":2.8,"nopeus":7.5},
      {"lon":111,"lat":-9,"u":-5,"v":2.9,"nopeus":6.6},
      {"lon":39,"lat":-5,"u":-0.8,"v":4.9,"nopeus":5.9},
      {"lon":43,"lat":-5,"u":-2.8,"v":6.8,"nopeus":8},
      {"lon":47,"lat":-5,"u":-3.1,"v":7.2,"nopeus":8.5},
      {"lon":51,"lat":-5,"u":-2.9,"v":6.5,"nopeus":7.9},
      {"lon":55,"lat":-5,"u":-2.8,"v":5.8,"nopeus":7.2},
      {"lon":59,"lat":-5,"u":-3.6,"v":5.6,"nopeus":7.4},
      {"lon":63,"lat":-5,"u":-4.6,"v":4.2,"nopeus":7.2},
      {"lon":67,"lat":-5,"u":-4.4,"v":4.3,"nopeus":7.2},
      {"lon":71,"lat":-5,"u":-3.6,"v":4,"nopeus":6.5},
      {"lon":75,"lat":-5,"u":-3.5,"v":4.3,"nopeus":6.7},
      {"lon":79,"lat":-5,"u":-2.9,"v":3.8,"nopeus":6.1},
      {"lon":83,"lat":-5,"u":-0.6,"v":3.5,"nopeus":6.4},
      {"lon":87,"lat":-5,"u":-2.2,"v":3.1,"nopeus":6},
      {"lon":91,"lat":-5,"u":-2.1,"v":2.5,"nopeus":5.8},
      {"lon":95,"lat":-5,"u":-2.3,"v":1.9,"nopeus":5.5},
      {"lon":99,"lat":-5,"u":-3.2,"v":2.2,"nopeus":6},
      {"lon":103,"lat":-5,"u":-3.3,"v":3.3,"nopeus":6.5},
      {"lon":107,"lat":-5,"u":-3.1,"v":1.4,"nopeus":4.8},
      {"lon":111,"lat":-5,"u":-5,"v":2.6,"nopeus":6.3},
      {"lon":43,"lat":-1,"u":-0.4,"v":6.7,"nopeus":7.4},
      {"lon":47,"lat":-1,"u":0.3,"v":6.8,"nopeus":7.5},
      {"lon":51,"lat":-1,"u":0.4,"v":6.9,"nopeus":7.6},
      {"lon":55,"lat":-1,"u":0,"v":5.7,"nopeus":6.5},
      {"lon":59,"lat":-1,"u":-0.4,"v":4.5,"nopeus":5.7},
      {"lon":63,"lat":-1,"u":-0.9,"v":3.3,"nopeus":5.1},
      {"lon":67,"lat":-1,"u":-0.4,"v":2.7,"nopeus":4.7},
      {"lon":71,"lat":-1,"u":-0.1,"v":2.6,"nopeus":4.8},
      {"lon":75,"lat":-1,"u":0.6,"v":2,"nopeus":4.8},
      {"lon":79,"lat":-1,"u":1.7,"v":2.4,"nopeus":5},
      {"lon":83,"lat":-1,"u":1.7,"v":2.7,"nopeus":5.3},
      {"lon":87,"lat":-1,"u":2,"v":2.7,"nopeus":5.4},
      {"lon":91,"lat":-1,"u":0.8,"v":2.2,"nopeus":4.9},
      {"lon":95,"lat":-1,"u":-0.4,"v":1.7,"nopeus":4.4},
      {"lon":99,"lat":-1,"u":-0.5,"v":0.4,"nopeus":4.1},
      {"lon":103,"lat":-1,"u":-0.6,"v":2.6,"nopeus":4.1},
      {"lon":107,"lat":-1,"u":-2.5,"v":3.3,"nopeus":5.1},
      {"lon":111,"lat":-1,"u":-2.5,"v":1.5,"nopeus":5.1},
      {"lon":47,"lat":3,"u":2.9,"v":6.8,"nopeus":8.1},
      {"lon":51,"lat":3,"u":4.4,"v":7.1,"nopeus":8.9},
      {"lon":55,"lat":3,"u":4.6,"v":6.1,"nopeus":8.3},
      {"lon":59,"lat":3,"u":3.7,"v":4.2,"nopeus":6.8},
      {"lon":63,"lat":3,"u":3,"v":3,"nopeus":5.6},
      {"lon":67,"lat":3,"u":2.6,"v":1.9,"nopeus":5},
      {"lon":71,"lat":3,"u":3.6,"v":1.2,"nopeus":5.4},
      {"lon":75,"lat":3,"u":4.6,"v":1.1,"nopeus":6},
      {"lon":79,"lat":3,"u":5.2,"v":1.6,"nopeus":6.6},
      {"lon":83,"lat":3,"u":6,"v":2.8,"nopeus":7.6},
      {"lon":87,"lat":3,"u":4.5,"v":3.6,"nopeus":6.8},
      {"lon":91,"lat":3,"u":3.6,"v":3.3,"nopeus":6},
      {"lon":95,"lat":3,"u":1.3,"v":2.3,"nopeus":4.7},
      {"lon":99,"lat":3,"u":-0.6,"v":0.9,"nopeus":3.7},
      {"lon":103,"lat":3,"u":-0.1,"v":1.5,"nopeus":3.8},
      {"lon":107,"lat":3,"u":0.8,"v":3.6,"nopeus":4.9},
      {"lon":111,"lat":3,"u":1.3,"v":1.5,"nopeus":4},
      {"lon":51,"lat":7,"u":6.3,"v":10.1,"nopeus":12.5},
      {"lon":55,"lat":7,"u":7.4,"v":7.8,"nopeus":11.3},
      {"lon":59,"lat":7,"u":7,"v":5.7,"nopeus":9.7},
      {"lon":63,"lat":7,"u":6.8,"v":3.2,"nopeus":8.3},
      {"lon":67,"lat":7,"u":6.4,"v":0.9,"nopeus":7.5},
      {"lon":71,"lat":7,"u":6.3,"v":0.3,"nopeus":7.3},
      {"lon":75,"lat":7,"u":6.4,"v":-0.6,"nopeus":7.3},
      {"lon":79,"lat":7,"u":6.9,"v":1.2,"nopeus":7.8},
      {"lon":83,"lat":7,"u":4.7,"v":5,"nopeus":8},
      {"lon":87,"lat":7,"u":6.6,"v":5.4,"nopeus":9.2},
      {"lon":91,"lat":7,"u":5.3,"v":4.7,"nopeus":7.9},
      {"lon":95,"lat":7,"u":4.3,"v":4.3,"nopeus":7.3},
      {"lon":99,"lat":7,"u":3,"v":0.5,"nopeus":4.9},
      {"lon":103,"lat":7,"u":2.1,"v":1.6,"nopeus":4.6},
      {"lon":107,"lat":7,"u":3.4,"v":2.9,"nopeus":5.8},
      {"lon":111,"lat":7,"u":3.7,"v":2.7,"nopeus":6},
      {"lon":43,"lat":11,"u":1.1,"v":-0.6,"nopeus":5.7},
      {"lon":47,"lat":11,"u":3.2,"v":3,"nopeus":7},
      {"lon":51,"lat":11,"u":2,"v":11.4,"nopeus":12.6},
      {"lon":55,"lat":11,"u":7.8,"v":10.1,"nopeus":13.3},
      {"lon":59,"lat":11,"u":8.9,"v":7.7,"nopeus":12.3},
      {"lon":63,"lat":11,"u":8.5,"v":4.4,"nopeus":10.3},
      {"lon":67,"lat":11,"u":8,"v":1.9,"nopeus":9.1},
      {"lon":71,"lat":11,"u":7.3,"v":0,"nopeus":8.3},
      {"lon":75,"lat":11,"u":4.7,"v":-0.4,"nopeus":6},
      {"lon":79,"lat":11,"u":3.3,"v":1.9,"nopeus":6.5},
      {"lon":83,"lat":11,"u":5.2,"v":4.7,"nopeus":8.1},
      {"lon":87,"lat":11,"u":5.5,"v":4.8,"nopeus":8.4},
      {"lon":91,"lat":11,"u":5.3,"v":4.7,"nopeus":8.4},
      {"lon":95,"lat":11,"u":5.1,"v":4.1,"nopeus":7.7},
      {"lon":99,"lat":11,"u":5.2,"v":2.5,"nopeus":7.6},
      {"lon":103,"lat":11,"u":4.4,"v":1.4,"nopeus":5.8},
      {"lon":107,"lat":11,"u":3.2,"v":2,"nopeus":5.6},
      {"lon":111,"lat":11,"u":5.2,"v":4.2,"nopeus":8},
      {"lon":39,"lat":15,"u":0.5,"v":-1.6,"nopeus":3.4},
      {"lon":43,"lat":15,"u":1.8,"v":-1.8,"nopeus":4.4},
      {"lon":51,"lat":15,"u":0.9,"v":3.1,"nopeus":5.1},
      {"lon":55,"lat":15,"u":5.4,"v":7.7,"nopeus":10.1},
      {"lon":59,"lat":15,"u":8.4,"v":8.2,"nopeus":12.4},
      {"lon":63,"lat":15,"u":8.3,"v":5.5,"nopeus":11},
      {"lon":67,"lat":15,"u":8.9,"v":2.3,"nopeus":10.1},
      {"lon":71,"lat":15,"u":7.9,"v":0.9,"nopeus":8.9},
      {"lon":75,"lat":15,"u":5.2,"v":0.4,"nopeus":6.5},
      {"lon":83,"lat":15,"u":5,"v":4,"nopeus":7.7},
      {"lon":87,"lat":15,"u":5.8,"v":5.3,"nopeus":9},
      {"lon":91,"lat":15,"u":4.3,"v":4.4,"nopeus":7.3},
      {"lon":95,"lat":15,"u":3.8,"v":3.8,"nopeus":7.1},
      {"lon":99,"lat":15,"u":-3.4,"v":2.8,"nopeus":5.6},
      {"lon":111,"lat":15,"u":1.6,"v":3.8,"nopeus":6.7},
      {"lon":39,"lat":19,"u":3.7,"v":-3.3,"nopeus":6.2},
      {"lon":59,"lat":19,"u":5.1,"v":7.9,"nopeus":10},
      {"lon":63,"lat":19,"u":7.7,"v":5.1,"nopeus":10.1},
      {"lon":67,"lat":19,"u":8,"v":3.2,"nopeus":9.6},
      {"lon":71,"lat":19,"u":6.8,"v":1.7,"nopeus":8.2},
      {"lon":83,"lat":19,"u":3.1,"v":2.5,"nopeus":7.6},
      {"lon":87,"lat":19,"u":4.1,"v":4.6,"nopeus":7.7},
      {"lon":91,"lat":19,"u":2.9,"v":5,"nopeus":7.5},
      {"lon":95,"lat":19,"u":-0.7,"v":1.6,"nopeus":3.4},
      {"lon":107,"lat":19,"u":-0.2,"v":2.7,"nopeus":6.8},
      {"lon":111,"lat":19,"u":0,"v":2.4,"nopeus":6.6},
      {"lon":35,"lat":23,"u":2.5,"v":-3.8,"nopeus":5.3},
      {"lon":39,"lat":23,"u":3.4,"v":-3.5,"nopeus":5.8},
      {"lon":59,"lat":23,"u":-0.9,"v":2.6,"nopeus":5},
      {"lon":63,"lat":23,"u":4.7,"v":5,"nopeus":8.1},
      {"lon":67,"lat":23,"u":6.2,"v":2.9,"nopeus":8},
      {"lon":71,"lat":23,"u":1.6,"v":1.4,"nopeus":6.2},
    ],
  },

  talvi: {
    nimi: "Koillismonsuuni",
    kuukaudet: "joulukuu–maaliskuu",
    kuukausiNumerot: [12,1,2,3],
    selitys: "Talvella manner on merta kylmempi, ilma laskeutuu Aasian ylle ja valuu ulos merelle. Tuuli kääntyy koillisesta, taivas selkenee ja meri rauhoittuu.",
    purjehdus: "Tämä on paluutuuli. Sama laiva, joka tuli kesällä lounaistuulella Intiaan, odotti syksyn yli ja palasi talvella koillistuulella kotiin. Kauppamatka Intiaan kesti siksi aina vähintään vuoden.",
    virta: {"nimi":"Somalivirta","viiva":[[46,3],[48,6],[51,9],[54,11],[57,13]],"minne":246,"ilmansuunta":"länsilounas","nopeus":0.31,"koosteita":46},
    kohdat: [
      {"nimi":"Arabianmeri","lon":61,"lat":11,"mista":41,"suunta":"koillinen","nopeus":6.5},
      {"nimi":"Somalian rannikko","lon":51,"lat":5,"mista":41,"suunta":"koillinen","nopeus":7.3},
      {"nimi":"Intian länsirannikko","lon":73,"lat":11,"mista":6,"suunta":"pohjoinen","nopeus":4.1},
      {"nimi":"Bengalinlahti","lon":87,"lat":15,"mista":55,"suunta":"koillinen","nopeus":4.7},
      {"nimi":"Malakan salmi","lon":97,"lat":5,"mista":61,"suunta":"itäkoillinen","nopeus":4.3},
    ],
    nuolet: [
      {"lon":35,"lat":-25,"u":-3.2,"v":2.6,"nopeus":7},
      {"lon":39,"lat":-25,"u":-3.8,"v":1.5,"nopeus":6.6},
      {"lon":43,"lat":-25,"u":-3.8,"v":3.5,"nopeus":7.9},
      {"lon":47,"lat":-25,"u":-5.4,"v":-1,"nopeus":8.1},
      {"lon":51,"lat":-25,"u":-4.7,"v":-1,"nopeus":7},
      {"lon":55,"lat":-25,"u":-4.3,"v":0.5,"nopeus":7.2},
      {"lon":59,"lat":-25,"u":-4.6,"v":0.1,"nopeus":6.9},
      {"lon":63,"lat":-25,"u":-5.3,"v":0.5,"nopeus":7.2},
      {"lon":67,"lat":-25,"u":-5.5,"v":0.6,"nopeus":7.1},
      {"lon":71,"lat":-25,"u":-5.3,"v":0.9,"nopeus":7},
      {"lon":75,"lat":-25,"u":-5.7,"v":1.1,"nopeus":7.2},
      {"lon":79,"lat":-25,"u":-5.9,"v":1.7,"nopeus":7.7},
      {"lon":83,"lat":-25,"u":-6.2,"v":1.8,"nopeus":7.5},
      {"lon":87,"lat":-25,"u":-6,"v":1.9,"nopeus":7.5},
      {"lon":91,"lat":-25,"u":-5.5,"v":2.6,"nopeus":7.3},
      {"lon":95,"lat":-25,"u":-6,"v":3.5,"nopeus":7.8},
      {"lon":99,"lat":-25,"u":-5.3,"v":4.3,"nopeus":7.7},
      {"lon":103,"lat":-25,"u":-4.7,"v":6,"nopeus":8.3},
      {"lon":107,"lat":-25,"u":-3.4,"v":6.9,"nopeus":8.3},
      {"lon":111,"lat":-25,"u":-1.3,"v":8.1,"nopeus":9.2},
      {"lon":35,"lat":-21,"u":-3,"v":2.6,"nopeus":6.2},
      {"lon":39,"lat":-21,"u":-2.1,"v":2.1,"nopeus":6},
      {"lon":43,"lat":-21,"u":-0.7,"v":1,"nopeus":5.1},
      {"lon":51,"lat":-21,"u":-3.5,"v":-0.3,"nopeus":6.4},
      {"lon":55,"lat":-21,"u":-4.4,"v":0.4,"nopeus":6.8},
      {"lon":59,"lat":-21,"u":-5.8,"v":0.4,"nopeus":7.3},
      {"lon":63,"lat":-21,"u":-5.2,"v":0.3,"nopeus":6.7},
      {"lon":67,"lat":-21,"u":-5.1,"v":0.7,"nopeus":6.6},
      {"lon":71,"lat":-21,"u":-6.7,"v":1.7,"nopeus":7.8},
      {"lon":75,"lat":-21,"u":-6.8,"v":1.7,"nopeus":7.8},
      {"lon":79,"lat":-21,"u":-6.9,"v":1.6,"nopeus":8},
      {"lon":83,"lat":-21,"u":-7.1,"v":1.8,"nopeus":8.2},
      {"lon":87,"lat":-21,"u":-6.6,"v":2.4,"nopeus":7.8},
      {"lon":91,"lat":-21,"u":-7.1,"v":3.2,"nopeus":8.6},
      {"lon":95,"lat":-21,"u":-6.3,"v":3.6,"nopeus":8.1},
      {"lon":99,"lat":-21,"u":-5.5,"v":4.8,"nopeus":7.9},
      {"lon":103,"lat":-21,"u":-4.1,"v":5.6,"nopeus":7.6},
      {"lon":107,"lat":-21,"u":-2.3,"v":6.4,"nopeus":8.2},
      {"lon":111,"lat":-21,"u":-0.5,"v":6.9,"nopeus":8},
      {"lon":39,"lat":-17,"u":-0.5,"v":1.1,"nopeus":5.4},
      {"lon":43,"lat":-17,"u":-0.4,"v":-1.1,"nopeus":4.6},
      {"lon":51,"lat":-17,"u":-1.6,"v":0.9,"nopeus":5.5},
      {"lon":55,"lat":-17,"u":-3.6,"v":1,"nopeus":6.4},
      {"lon":59,"lat":-17,"u":-4.4,"v":0.8,"nopeus":6.8},
      {"lon":63,"lat":-17,"u":-5.2,"v":1.1,"nopeus":6.9},
      {"lon":67,"lat":-17,"u":-5.2,"v":0.7,"nopeus":6.8},
      {"lon":71,"lat":-17,"u":-5.1,"v":1.1,"nopeus":6.6},
      {"lon":75,"lat":-17,"u":-6,"v":1.9,"nopeus":7.3},
      {"lon":79,"lat":-17,"u":-6.9,"v":2.1,"nopeus":8.1},
      {"lon":83,"lat":-17,"u":-6.7,"v":2.3,"nopeus":8},
      {"lon":87,"lat":-17,"u":-6.6,"v":2.7,"nopeus":8},
      {"lon":91,"lat":-17,"u":-6.5,"v":3.5,"nopeus":8.2},
      {"lon":95,"lat":-17,"u":-6,"v":4.1,"nopeus":8},
      {"lon":99,"lat":-17,"u":-4.6,"v":4.5,"nopeus":7.1},
      {"lon":103,"lat":-17,"u":-3.6,"v":4.5,"nopeus":6.8},
      {"lon":107,"lat":-17,"u":-1,"v":4.7,"nopeus":6.4},
      {"lon":111,"lat":-17,"u":0.9,"v":3.6,"nopeus":6.5},
      {"lon":43,"lat":-13,"u":0.4,"v":-1.7,"nopeus":4.9},
      {"lon":47,"lat":-13,"u":0.4,"v":-1.3,"nopeus":4.3},
      {"lon":51,"lat":-13,"u":-1.1,"v":1.8,"nopeus":6.2},
      {"lon":55,"lat":-13,"u":-1.4,"v":0.8,"nopeus":5.7},
      {"lon":59,"lat":-13,"u":-1.4,"v":0.4,"nopeus":5.3},
      {"lon":63,"lat":-13,"u":-1.9,"v":0.6,"nopeus":5.6},
      {"lon":67,"lat":-13,"u":-2.8,"v":1.3,"nopeus":6},
      {"lon":71,"lat":-13,"u":-2.6,"v":0.9,"nopeus":6},
      {"lon":75,"lat":-13,"u":-3.2,"v":1,"nopeus":6},
      {"lon":79,"lat":-13,"u":-3.2,"v":1.8,"nopeus":6.6},
      {"lon":83,"lat":-13,"u":-4.4,"v":1.8,"nopeus":6.5},
      {"lon":87,"lat":-13,"u":-4.6,"v":2.3,"nopeus":6.7},
      {"lon":91,"lat":-13,"u":-4.5,"v":2.6,"nopeus":6.7},
      {"lon":95,"lat":-13,"u":-4.2,"v":2.9,"nopeus":6.3},
      {"lon":99,"lat":-13,"u":-3.8,"v":3.4,"nopeus":6.5},
      {"lon":103,"lat":-13,"u":-2.3,"v":3,"nopeus":5.6},
      {"lon":107,"lat":-13,"u":-0.2,"v":3.1,"nopeus":5.6},
      {"lon":111,"lat":-13,"u":0.6,"v":1.9,"nopeus":5.4},
      {"lon":39,"lat":-9,"u":-2.1,"v":-3.2,"nopeus":5},
      {"lon":43,"lat":-9,"u":-0.6,"v":-1.9,"nopeus":4.6},
      {"lon":47,"lat":-9,"u":-0.5,"v":-1.6,"nopeus":4.8},
      {"lon":51,"lat":-9,"u":-0.1,"v":-0.1,"nopeus":4.5},
      {"lon":55,"lat":-9,"u":0.4,"v":0,"nopeus":4.7},
      {"lon":59,"lat":-9,"u":1.4,"v":-0.4,"nopeus":4.5},
      {"lon":63,"lat":-9,"u":0.8,"v":-0.2,"nopeus":5.5},
      {"lon":67,"lat":-9,"u":0.7,"v":-0.4,"nopeus":5.1},
      {"lon":71,"lat":-9,"u":0.9,"v":-0.1,"nopeus":5.3},
      {"lon":75,"lat":-9,"u":1.2,"v":0,"nopeus":5.2},
      {"lon":79,"lat":-9,"u":0.3,"v":0.8,"nopeus":5.1},
      {"lon":83,"lat":-9,"u":0.3,"v":0.3,"nopeus":5.1},
      {"lon":87,"lat":-9,"u":0.4,"v":-0.2,"nopeus":5.4},
      {"lon":91,"lat":-9,"u":-0.7,"v":1.3,"nopeus":5},
      {"lon":95,"lat":-9,"u":-0.4,"v":1.1,"nopeus":5.1},
      {"lon":99,"lat":-9,"u":-0.6,"v":1.2,"nopeus":5.2},
      {"lon":103,"lat":-9,"u":1.4,"v":-0.4,"nopeus":5.4},
      {"lon":107,"lat":-9,"u":1.6,"v":0.4,"nopeus":5.3},
      {"lon":111,"lat":-9,"u":2.3,"v":-0.1,"nopeus":5.1},
      {"lon":39,"lat":-5,"u":-2.6,"v":-2,"nopeus":4.9},
      {"lon":43,"lat":-5,"u":-2.9,"v":-2.7,"nopeus":5.1},
      {"lon":47,"lat":-5,"u":-1.6,"v":-2.8,"nopeus":4.7},
      {"lon":51,"lat":-5,"u":0.5,"v":-2.7,"nopeus":4.8},
      {"lon":55,"lat":-5,"u":1.1,"v":-2,"nopeus":4.5},
      {"lon":59,"lat":-5,"u":1.3,"v":-1.6,"nopeus":4.2},
      {"lon":63,"lat":-5,"u":1.4,"v":-1.3,"nopeus":4.3},
      {"lon":67,"lat":-5,"u":1.8,"v":-1.5,"nopeus":4.5},
      {"lon":71,"lat":-5,"u":2.2,"v":-1.1,"nopeus":5.1},
      {"lon":75,"lat":-5,"u":2.4,"v":-0.8,"nopeus":4.8},
      {"lon":79,"lat":-5,"u":2.8,"v":-0.6,"nopeus":5.1},
      {"lon":83,"lat":-5,"u":2.2,"v":-1.1,"nopeus":5.2},
      {"lon":87,"lat":-5,"u":2.4,"v":-0.3,"nopeus":4.8},
      {"lon":91,"lat":-5,"u":1.3,"v":-0.1,"nopeus":5},
      {"lon":95,"lat":-5,"u":1.8,"v":0.1,"nopeus":5},
      {"lon":99,"lat":-5,"u":1.9,"v":-0.6,"nopeus":5},
      {"lon":103,"lat":-5,"u":1.9,"v":-1,"nopeus":4.9},
      {"lon":107,"lat":-5,"u":2.5,"v":-1.7,"nopeus":5.1},
      {"lon":111,"lat":-5,"u":3.8,"v":-1.3,"nopeus":5.4},
      {"lon":43,"lat":-1,"u":-5.3,"v":-2.2,"nopeus":6.5},
      {"lon":47,"lat":-1,"u":-3.5,"v":-3.6,"nopeus":5.8},
      {"lon":51,"lat":-1,"u":-1.7,"v":-3.8,"nopeus":5},
      {"lon":55,"lat":-1,"u":-0.7,"v":-2.9,"nopeus":4.5},
      {"lon":59,"lat":-1,"u":-0.1,"v":-2.8,"nopeus":4.1},
      {"lon":63,"lat":-1,"u":0.4,"v":-2.3,"nopeus":4.3},
      {"lon":67,"lat":-1,"u":0.3,"v":-2.2,"nopeus":4.3},
      {"lon":71,"lat":-1,"u":0.6,"v":-1.8,"nopeus":4.4},
      {"lon":75,"lat":-1,"u":0.7,"v":-1.6,"nopeus":4.2},
      {"lon":79,"lat":-1,"u":0.8,"v":-1.7,"nopeus":4.2},
      {"lon":83,"lat":-1,"u":2.1,"v":-1.2,"nopeus":4.6},
      {"lon":87,"lat":-1,"u":2.2,"v":-1.1,"nopeus":4.6},
      {"lon":91,"lat":-1,"u":1.9,"v":-0.7,"nopeus":4.5},
      {"lon":95,"lat":-1,"u":2.8,"v":0,"nopeus":4.4},
      {"lon":99,"lat":-1,"u":0.5,"v":-0.2,"nopeus":3.4},
      {"lon":103,"lat":-1,"u":0.8,"v":-4.5,"nopeus":5.7},
      {"lon":107,"lat":-1,"u":1,"v":-3.9,"nopeus":5.2},
      {"lon":47,"lat":3,"u":-5.8,"v":-4,"nopeus":7.6},
      {"lon":51,"lat":3,"u":-3.9,"v":-4.8,"nopeus":6.6},
      {"lon":55,"lat":3,"u":-3,"v":-3.8,"nopeus":5.7},
      {"lon":59,"lat":3,"u":-2,"v":-3.1,"nopeus":5.1},
      {"lon":63,"lat":3,"u":-2.3,"v":-2.8,"nopeus":4.9},
      {"lon":67,"lat":3,"u":-1.7,"v":-2.4,"nopeus":4.9},
      {"lon":71,"lat":3,"u":-1.4,"v":-2.3,"nopeus":4.5},
      {"lon":75,"lat":3,"u":-1.2,"v":-2.2,"nopeus":4.5},
      {"lon":79,"lat":3,"u":-1.2,"v":-2.5,"nopeus":4.8},
      {"lon":83,"lat":3,"u":-1.2,"v":-2.5,"nopeus":5.1},
      {"lon":87,"lat":3,"u":-1.2,"v":-2.3,"nopeus":4.5},
      {"lon":91,"lat":3,"u":-0.4,"v":-1.8,"nopeus":4.3},
      {"lon":95,"lat":3,"u":1.1,"v":-0.3,"nopeus":3.7},
      {"lon":99,"lat":3,"u":1.1,"v":-1,"nopeus":3.6},
      {"lon":103,"lat":3,"u":-1.3,"v":-2.5,"nopeus":4.7},
      {"lon":107,"lat":3,"u":-2.3,"v":-4.8,"nopeus":6.3},
      {"lon":111,"lat":3,"u":-1.8,"v":-3.8,"nopeus":5.7},
      {"lon":51,"lat":7,"u":-4.7,"v":-5.3,"nopeus":7.6},
      {"lon":55,"lat":7,"u":-4.3,"v":-4.7,"nopeus":6.9},
      {"lon":59,"lat":7,"u":-4,"v":-4.6,"nopeus":6.6},
      {"lon":63,"lat":7,"u":-3.5,"v":-4.2,"nopeus":6.2},
      {"lon":67,"lat":7,"u":-2.5,"v":-3.1,"nopeus":5},
      {"lon":71,"lat":7,"u":-1.6,"v":-2.9,"nopeus":4.5},
      {"lon":75,"lat":7,"u":-1.5,"v":-1.9,"nopeus":4.1},
      {"lon":79,"lat":7,"u":-1.7,"v":-3.8,"nopeus":6.2},
      {"lon":83,"lat":7,"u":-2.6,"v":-3,"nopeus":5.6},
      {"lon":87,"lat":7,"u":-3.2,"v":-2.8,"nopeus":5.6},
      {"lon":91,"lat":7,"u":-3.7,"v":-2.7,"nopeus":5.9},
      {"lon":95,"lat":7,"u":-3.8,"v":-1.8,"nopeus":5.7},
      {"lon":99,"lat":7,"u":-2.6,"v":-1.8,"nopeus":4.8},
      {"lon":103,"lat":7,"u":-4.7,"v":-1.2,"nopeus":6},
      {"lon":107,"lat":7,"u":-4.5,"v":-5.3,"nopeus":7.7},
      {"lon":111,"lat":7,"u":-3.9,"v":-5.6,"nopeus":7.7},
      {"lon":43,"lat":11,"u":-4.5,"v":0.6,"nopeus":5.4},
      {"lon":47,"lat":11,"u":-5.7,"v":-1.7,"nopeus":6.5},
      {"lon":51,"lat":11,"u":-3.7,"v":-2.8,"nopeus":5.8},
      {"lon":55,"lat":11,"u":-4.6,"v":-3.9,"nopeus":6.7},
      {"lon":59,"lat":11,"u":-4.3,"v":-4.3,"nopeus":6.7},
      {"lon":63,"lat":11,"u":-3.5,"v":-4.5,"nopeus":6.3},
      {"lon":67,"lat":11,"u":-2.5,"v":-4.1,"nopeus":5.4},
      {"lon":71,"lat":11,"u":-1.1,"v":-3.5,"nopeus":4.5},
      {"lon":75,"lat":11,"u":-0.1,"v":-2,"nopeus":4.2},
      {"lon":79,"lat":11,"u":-2.7,"v":-2.4,"nopeus":5.1},
      {"lon":83,"lat":11,"u":-3.5,"v":-2.5,"nopeus":5.6},
      {"lon":87,"lat":11,"u":-3.6,"v":-2.6,"nopeus":5.5},
      {"lon":91,"lat":11,"u":-3.4,"v":-3,"nopeus":5.6},
      {"lon":95,"lat":11,"u":-2.7,"v":-2.4,"nopeus":4.9},
      {"lon":99,"lat":11,"u":-3.6,"v":-2.6,"nopeus":5.4},
      {"lon":103,"lat":11,"u":-2.1,"v":0.6,"nopeus":4.5},
      {"lon":107,"lat":11,"u":-6.5,"v":-2.2,"nopeus":8.2},
      {"lon":111,"lat":11,"u":-4.5,"v":-6.8,"nopeus":9.1},
      {"lon":39,"lat":15,"u":-0.3,"v":-2,"nopeus":4.7},
      {"lon":43,"lat":15,"u":-1.7,"v":5.9,"nopeus":8.6},
      {"lon":51,"lat":15,"u":-3.5,"v":-0.6,"nopeus":4.4},
      {"lon":55,"lat":15,"u":-3.5,"v":-2.3,"nopeus":5.4},
      {"lon":59,"lat":15,"u":-3.2,"v":-2.7,"nopeus":5.4},
      {"lon":63,"lat":15,"u":-2.9,"v":-3.9,"nopeus":5.9},
      {"lon":67,"lat":15,"u":-1.9,"v":-4.4,"nopeus":5.5},
      {"lon":71,"lat":15,"u":-0.8,"v":-4.1,"nopeus":5.2},
      {"lon":75,"lat":15,"u":-0.1,"v":-1.6,"nopeus":4},
      {"lon":83,"lat":15,"u":-2.6,"v":-1.1,"nopeus":4.8},
      {"lon":87,"lat":15,"u":-2.6,"v":-1.8,"nopeus":4.7},
      {"lon":91,"lat":15,"u":-2.1,"v":-2.3,"nopeus":4.6},
      {"lon":95,"lat":15,"u":-0.8,"v":-3,"nopeus":4.8},
      {"lon":111,"lat":15,"u":-4.4,"v":-4.3,"nopeus":8},
      {"lon":39,"lat":19,"u":-0.1,"v":-2.4,"nopeus":6.1},
      {"lon":59,"lat":19,"u":-1.4,"v":-1,"nopeus":4.9},
      {"lon":63,"lat":19,"u":-1.4,"v":-2.8,"nopeus":4.7},
      {"lon":67,"lat":19,"u":-1.3,"v":-3.8,"nopeus":5.3},
      {"lon":71,"lat":19,"u":-0.1,"v":-3.8,"nopeus":5.4},
      {"lon":83,"lat":19,"u":0,"v":1.1,"nopeus":4.8},
      {"lon":87,"lat":19,"u":-0.8,"v":-0.6,"nopeus":4.4},
      {"lon":91,"lat":19,"u":-0.2,"v":-2.1,"nopeus":4.7},
      {"lon":107,"lat":19,"u":-4,"v":-3.3,"nopeus":8.2},
      {"lon":111,"lat":19,"u":-4.9,"v":-3.9,"nopeus":8.2},
      {"lon":35,"lat":23,"u":1.3,"v":-4.1,"nopeus":6.3},
      {"lon":39,"lat":23,"u":1.7,"v":-4.4,"nopeus":6.4},
      {"lon":59,"lat":23,"u":0.3,"v":-0.9,"nopeus":4.7},
      {"lon":63,"lat":23,"u":0.5,"v":-1.2,"nopeus":4.5},
      {"lon":67,"lat":23,"u":0.3,"v":-2.5,"nopeus":5.3},
      {"lon":71,"lat":23,"u":-2,"v":-1.3,"nopeus":5.8},
    ],
  },
};

export const TUULET = {
  vyohykkeet: VYOHYKKEET,
  virrat: VIRRAT,
  monsuuni: MONSUUNI,

  lahde: {
    tuulet: 'ICOADS, 2° enhanced, kuukausien pitkän ajan keskiarvo 1971–2000 (NOAA PSL)',
    virrat: 'OSCAR Sea Surface Velocity, 1/3°, 5 vrk:n koosteet 2011-12-06…2014-10-06 (Earth & Space Research)',
    viitteet: [
      'Freeman ym. 2017, International Journal of Climatology 37:2211–2232 (ICOADS Release 3.0)',
      'Bonjean & Lagerloef 2002, Journal of Physical Oceanography 32:2938–2954 (OSCAR)',
      'NOAA/NWS JetStream: Global Atmospheric Circulations (vyöhykkeiden nimet)',
      'Tomczak & Godfrey 2003, Regional Oceanography: An Introduction, 2. laitos (virtojen keskiviivat)',
      'Schott & McCreary 2001, Progress in Oceanography 51:1–123 (monsuunin kierto)',
    ],
    osoite: 'https://coastwatch.pfeg.noaa.gov/erddap/griddap/esrlIcoads2gec71_LonPM180',
    haettu: '2026-08-04',
  },

  lisenssi: {
    nimi: 'Vapaasti käytettävä (NOAA / Earth & Space Research)',
    ehto: 'ERDDAP: "The data may be used and redistributed for free but is not '
      + 'intended for legal use, since it may contain inaccuracies."',
    osoite: 'https://coastwatch.pfeg.noaa.gov/erddap/info/esrlIcoads2gec71_LonPM180/index.html',
  },
};
