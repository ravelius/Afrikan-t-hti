// Kaupungin kulttuurinostot kategorioittain.
//
// Omistajan toive: "sinne voisi lisätä myös nostoja enemmän ja
// jaotella ne kategorioiden mukaan — vain yksi kategoria näkyisi auki
// kerrallaan ja sen alla voisi olla useampi eri näyte. Tämän pelin
// rikkaus on kulttuuri, joten rakennetaan niitä lisää."
//
// Järjestys on harkittu eikä aakkosellinen. Tutki-ikkuna avautuu
// kaupunkiin SAAVUTTAESSA, joten ensimmäisenä on se, jonka matkaaja
// kohtaisi kadulla ensin — historia kertoo missä ollaan. Huumori on
// viimeisenä, koska se jää mieleen. Aisteihin vetoavat ovat keskellä.
//
// Jokainen kuva on tarkistettu Commonsista: tiedosto on olemassa,
// leveys vähintään 1200 px, lisenssi sallii käytön, tekijän nimi on
// kokonainen ja kuvan SISÄLTÖ vastaa selitettä. Viimeinen on tärkein
// — repon aiemmista kuvista on löytynyt useita, joiden selite kertoi
// eri asiasta kuin mitä kuvassa on.
//
// Tuotettu komennolla tools/kirjoita-kategoriat.mjs.
export const KULTTUURI_KATEGORIAT = {
  lontoo: [
    {
      id: 'kaupunki',
      nimi: 'Lontoo',
      johdanto: 'Kaupunki, jossa maailman ensimmäinen metro, vanhin jalkapallosarja '
        + 'ja tuhat vuotta kruunajaisia mahtuvat saman joen varrelle.',
      kansikuvat: [
        {
          tiedosto: 'Tower Bridge from Shad Thames.jpg',
          selite: 'Tower Bridge on avattu laivoille yli 130 vuotta — taustalla '
            + 'kohoaa Cityn lasinen siluetti.',
          lahde: 'Colin, Wikimedia Commons (CC BY-SA 4.0)',
        },
        {
          tiedosto: 'Palace of Westminster, London - Feb 2007.jpg',
          selite: 'Westminsterin palatsi ja Big Ben iltavalossa Thamesin takaa.',
          lahde: 'Diliff, Wikimedia Commons (CC BY-SA 2.5)',
        },
        {
          tiedosto: 'Red London Buses - geograph.org.uk - 2792011.jpg',
          selite: 'Punaiset kaksikerrosbussit ovat kuljettaneet lontoolaisia '
            + '1950-luvulta asti.',
          lahde: 'Colin Smith, Wikimedia Commons (CC BY-SA 2.0)',
        },
      ],
      nostot: [
        {
          otsikko: 'Canaletto maalasi myös Lontoon',
          tiedosto: 'Canaletto - Westminster Bridge, with the Lord Mayor\'s Procession on the Thames - Google Art Project.jpg',
          teksti: 'Sama venetsialainen Canaletto, jonka vedutoja selailit '
            + 'Venetsian lehdessä, muutti Lontooseen vuonna 1746 ja maalasi '
            + 'kaupunkia yhdeksän vuoden ajan. Hän toi Thamesille saman '
            + 'tarkan katseen kuin Canal Grandelle — ja siksi 1700-luvun '
            + 'Lontoo tunnetaan parhaiten venetsialaisen silmin.',
          selite: 'Westminster Bridge ja lordimayorin juhlakulkue (1747): upouusi '
            + 'silta, jota pidettiin aikansa ihmeenä, ja juhlaveneet kuin '
            + 'Venetsian regatassa.',
          lahde: 'Canaletto, Wikimedia Commons (PD)',
          wiki: 'Canaletto',
          galleria: [
            {
              otsikko: 'Thames ja Pyhän Paavalin katedraali',
              tiedosto: 'The Thames and the City Canaletto 46-47 National Gallery Prague.jpg',
              selite: 'Thames ja City (1746–47): Pyhän Paavalin kupoli hallitsee '
                + 'kaupunkia, ja joki kuhisee veneitä kuin laguuni.',
              lahde: 'Canaletto, Wikimedia Commons (PD)',
            },
            {
              otsikko: 'City sillan kaaren läpi',
              tiedosto: 'Canaletto - The City Seen Through an Arch of Westminster Bridge.JPG',
              selite: 'City rakenteilla olevan Westminster Bridgen kaaren läpi '
                + '(1747) — puutelineiltä katsottu kehys, jonka moderniutta '
                + 'ihmetellään yhä.',
              lahde: 'Canaletto, Wikimedia Commons (PD)',
            },
            {
              otsikko: 'Northumberland House',
              tiedosto: 'Northumberland House by Canaletto (1752).JPG',
              selite: 'Northumberland House Charing Crossilla (1752). Palatsi '
                + 'purettiin 1874 — Canaletton maalaus on sen tarkin '
                + 'muistikuva.',
              lahde: 'Canaletto, Wikimedia Commons (PD)',
            },
            {
              otsikko: 'Ranelaghin rotunda',
              tiedosto: 'Canaletto Ranelegh 1754.jpg',
              selite: 'Ranelagh Gardensin rotundan sisänäkymä (1754): Lontoon '
                + 'hienosto kierteli valtavan pyörösalin lattialla musiikin '
                + 'soidessa. Mozart esiintyi täällä kahdeksanvuotiaana.',
              lahde: 'Canaletto, Wikimedia Commons (PD)',
            },
          ],
        },
        {
          otsikko: 'Pubi, jossa Dickens istui',
          tiedosto: 'The George at Southwark (8553233399).jpg',
          teksti: 'The George on Lontoon viimeinen parvekekäytävällinen majatalo: '
            + 'tällaisten pihojen parvilta katsottiin näytelmiä jo '
            + 'Shakespearen aikaan. Nykyinen rakennus on vuodelta 1677, ja '
            + 'sen penkeillä istui aikanaan Charles Dickens, joka mainitsee '
            + 'pubin romaanissaan Pikku Dorrit. Talo on niin arvokas, että '
            + 'sen omistaa National Trust — olutta myydään silti joka päivä.',
          selite: 'The Georgen parvekekäytävät Southwarkissa. Kyltissä ratsastaa '
            + 'Yrjö-pyhimys, ja kello on käynyt pihalla 1600-luvulta.',
          lahde: 'It\'s No Game, Wikimedia Commons (CC BY 2.0)',
          wiki: 'Charles Dickens',
        },
        {
          otsikko: 'Suojatie, jota jonotetaan',
          tiedosto: 'Abbey Road Zebra.jpg',
          teksti: 'Elokuun 8. päivänä 1969 neljä miestä käveli suojatien yli '
            + 'kahdeksan kertaa, kunnes valokuvaaja sai kuvansa. Kuvasta tuli '
            + 'The Beatlesin Abbey Road -levyn kansi ja suojatiestä maailman '
            + 'kuuluisin: turistit jonottavat yhä joka päivä ylittämään sen '
            + 'samassa rivissä, autoilijoiden kärsivällisyyttä koetellen. '
            + 'Ylityksellä on virallinen suojelumerkintä — ja taustan '
            + 'studiossa äänitetään musiikkia edelleen.',
          selite: 'Abbey Roadin suojatie St John\'s Woodissa hiljaisena hetkenä — '
            + 'ilman jonoa levynkansikävelijöitä.',
          lahde: 'Misterweiss, Wikimedia Commons (PD)',
          wiki: 'The Beatles',
          musiikki: 'https://music.apple.com/fi/album/come-together-2019-mix/1474815798?i=1474815799',
          musiikkiNimi: 'The Beatles Apple Musicissa',
          esikuuntelu: 'The Beatles Come Together',
        },
      ],
    },
    {
      id: 'luonto',
      nimi: 'Luonto',
      johdanto: 'Lontoon luonto ei ole kaupungin ulkopuolella vaan sen sisällä: '
        + 'joki nousee ja laskee kahdesti vuorokaudessa, puistoissa karjuvat '
        + 'hirvet ja kirkuvat papukaijat, ja sää on kerran ollut kaupungin '
        + 'vaarallisin vihollinen.',
      nostot: [
        {
          otsikko: 'Joki, joka laskee joka päivä',
          tiedosto: 'Mudlarks by Millennium Bridge.jpg',
          teksti: 'Thames on vuorovesijoki Teddingtonin sulkuun asti: vesi nousee '
            + 'ja laskee kahdesti vuorokaudessa, keskustassa parhaimmillaan '
            + 'noin seitsemän metriä. Laskuveden aikaan kivinen ranta '
            + 'paljastuu keskellä miljoonakaupunkia, ja sinne lasketaan '
            + 'portaita pitkin etsimään savipiippuja ja astiansirpaleita. '
            + 'Etsijöitä sanotaan mudlarkeiksi. Ranta ei silti ole vapaata '
            + 'riistaa: lupa on ostettava satamaviranomaiselta, ja kun lupia '
            + 'oli kertynyt yli 5 000, myynti keskeytettiin vuonna 2022. Se '
            + 'avattiin uudelleen 2024, mutta lupia jaetaan enintään 4 000. '
            + 'Yli kolmesataa vuotta vanhat löydöt on ilmoitettava Lontoon '
            + 'museolle.',
          selite: 'Thamesin kivinen ranta paljastuu laskuveden aikaan '
            + 'Millennium-sillan vieressä. Rannalla liikkuu kymmenkunta '
            + 'ihmistä, mudasta törröttää vanhojen laitureiden tummuneita '
            + 'puupaaluja, ja takana kohoaa tiilinen varastotalo, jonka '
            + 'alakerrassa on The Samuel Pepys -pubi.',
          lahde: 'Tim Sheerman-Chase, Wikimedia Commons (CC BY 2.0)',
          wiki: 'Thames',
        },
        {
          otsikko: 'Kuninkaan joutsenet lasketaan',
          tiedosto: 'Swan Upping.jpg',
          teksti: 'Britannian hallitsija omistaa kaikki merkitsemättömät '
            + 'kyhmyjoutsenet avovesillä, ja tapa juontuu 1100-luvulta. '
            + 'Heinäkuun kolmannella viikolla soutuveneet nousevat viiden '
            + 'päivän ajan Thamesia Sunburysta Abingdoniin. Veneet '
            + 'piirittävät joutsenperheen, poikaset nostetaan veneeseen, '
            + 'punnitaan, mitataan ja tarkastetaan vammojen varalta, ja '
            + 'jalkaan pannaan kevyt rengas. Kruunun laskijat pukeutuvat '
            + 'punaiseen. Osan joutsenista omistavat yhä kaksi Cityn vanhaa '
            + 'ammattikuntaa, viininmyyjät ja värjärit; ennen linnut '
            + 'merkittiin lovilla nokkaan, nykyään renkailla.',
          selite: 'Joutsenten laskijoita veneissään Thamesilla Abingdonissa '
            + 'heinäkuussa 2006. Lippujen joutsenvaakunat kertovat, kenen '
            + 'miehistöstä on kyse, ja kaksi joutsenta ui veneen kylkeen '
            + 'ajettuna; rantapenkereellä seisoo katselijoita kaiteen takana.',
          lahde: 'Philip Allfrey, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Kyhmyjoutsen',
        },
        {
          otsikko: 'Kuusisataa hirveä aidan sisällä',
          tiedosto: 'Red deer stag roaring in Richmond Park - geograph.org.uk - 3711560.jpg',
          teksti: 'Richmond Park on Lontoon kuninkaallisista puistoista suurin, '
            + 'ja sen kolmentoista kilometrin tiiliaidan sisällä kulkee '
            + 'vapaana noin 630 saksanhirveä ja kuusipeuraa. Kuningas Kaarle '
            + 'I aitasi alueen hirvenmetsästystä varten vuonna 1637. '
            + 'Syys-lokakuussa urokset karjuvat kiima-aikaan. Marraskuussa ja '
            + 'helmikuussa laumasta kaadetaan noin kaksisataa eläintä, jotta '
            + 'laidun riittää lopuille. Vuosina 1867 ja 1876 puistosta '
            + 'lähetettiin kuusipeuroja laivalla Uuteen-Seelantiin, ja ne '
            + 'olivat maan ensimmäiset kuusipeurat.',
          selite: 'Karjuva saksanhirviuros Richmond Parkissa lokakuussa 2013. '
            + 'Sarvet ovat täysikasvuiset ja monihaaraiset, eläin seisoo '
            + 'kuivan heinikon reunassa, ja sen takana kasvaa laaja '
            + 'sananjalkakenttä.',
          lahde: 'Russel Wills, Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Isokauris',
        },
        {
          otsikko: 'Papukaijat oppivat kämmenelle',
          tiedosto: 'Hyde Park feral parakeets (02).jpg',
          teksti: 'Lontoon puistoissa lentää kirkkaanvihreitä kauluskaijoja, '
            + 'joiden kotiseutu on Intiassa ja trooppisessa Afrikassa. '
            + 'Villiintynyt kanta alkoi lisääntyä pysyvästi vuonna 1969 '
            + 'Croydonissa, ja nyt lintuja on kymmeniätuhansia: vuoden 2012 '
            + 'yöpymispuiden laskennassa niitä kertyi Lontoossa noin 32 000. '
            + 'Talvi ei niitä kaada, sillä laji elää luonnossa myös Himalajan '
            + 'lumisilla alarinteillä parintuhannen metrin korkeudessa. Hyde '
            + 'Parkissa ja Kensington Gardensissa ne ovat oppineet lentämään '
            + 'suoraan avoimelle kämmenelle, jos siinä on siemeniä.',
          selite: 'Kauluskaija syö auringonkukansiemeniä ihmisen kämmeneltä Hyde '
            + 'Parkissa marraskuussa 2020. Taustan nurmella odottaa epätarkka '
            + 'pulujoukko, joka jakaa linnun kanssa saman ruokapaikan.',
          lahde: 'Isochrone (Berrely), Wikimedia Commons (CC BY 4.0)',
          wiki: 'Kauluskaija',
        },
        {
          otsikko: 'Sumu, joka ei ollutkaan sumua',
          tiedosto: 'A London Fog, drawn by Duncan - ILN 1847.jpg',
          teksti: 'Lontoon kuuluisa sumu oli kivihiilen savua, ja 1800-luvulla '
            + 'soihtupojat opastivat kulkijoita savuisilla kaduilla. Pahin '
            + 'savusumu alkoi 5. joulukuuta 1952, kun korkeapaine painoi '
            + 'savun kadun tasalle ja tuuli tyyntyi. Viisi päivää kestäneen '
            + 'sumun aikana näkyvyys putosi paikoin noin kolmeenkymmeneen '
            + 'senttiin, konsertteja ja elokuvanäytöksiä peruttiin, ja kaikki '
            + 'joukkoliikenne metroa lukuun ottamatta pysähtyi. Kuolleita '
            + 'arvioitiin ensin neljätuhatta, myöhemmissä laskelmissa 10 '
            + '000-12 000. Neljä vuotta myöhemmin säädettiin laki, jonka '
            + 'nojalla kaupunginosia voitiin määrätä savuttomiksi.',
          selite: 'Lontoolaista sumua The Illustrated London News -lehden '
            + 'puukaiverruksessa 2. tammikuuta 1847, siis yli vuosisata ennen '
            + 'vuoden 1952 savusumua. Kaksi poikaa kantaa palavaa soihtua ja '
            + 'opastaa kulkijoita, oikealla silinteripäinen herra taluttaa '
            + 'naista, ja takana häämöttävät hevonen, vaunut ja palava '
            + 'kaasulyhty.',
          lahde: 'Henry Linton (kaiverrus, piirros Duncan), Wikimedia Commons (PD)',
          wiki: 'Lontoon suuri savusumu',
        },
        {
          otsikko: 'Markkinat jäätyneellä joella',
          tiedosto: 'Frost Fair on the River Thames (1814).jpg',
          teksti: 'Ennen Thames jäätyi. Vuosien 1400 ja 1831 välillä joki '
            + 'jähmettyi Lontoon kohdalla 24 talvena, ja jäälle nousi '
            + 'telttakylä: keilapelejä, veneenmuotoisia keinuja ja '
            + 'painokoneita, jotka myivät muistoksi jäällä painettuja '
            + 'säkeitä. Viimeiset markkinat alkoivat 1. helmikuuta 1814 ja '
            + 'kestivät neljä päivää, ja norsu talutettiin joen yli '
            + 'Blackfriarsin sillan alapuolelta. Sitten purettiin vanha '
            + 'Lontoon silta, jonka yhdeksäntoista pilaria olivat padonneet '
            + 'virran hitaaksi. Nyt joki juoksee liian nopeasti jäätyäkseen.',
          selite: 'Vuoden 1814 jäämarkkinat käsin väritetyssä puupiirroksessa, '
            + 'jonka näkymä otettiin Banksidelta 4. helmikuuta. Jäälle on '
            + 'pystytetty telttarivi, keilapeli ja veneenmuotoiset keinut; '
            + 'taustalla erottuvat Pyhän Paavalin kupoli, Monument-pylväs ja '
            + 'Lontoon silta.',
          lahde: 'George Thompson (kustantaja), Wikimedia Commons (PD)',
          wiki: 'Pieni jääkausi',
        },
      ],
    },
    {
      id: 'nykytaide',
      nimi: 'Nykytaide',
      johdanto: 'Lontoossa nykytaide ei pysy museon seinällä: sitä maalataan '
        + 'junatunnelin kattoon, nostetaan tyhjälle patsasjalustalle ja '
        + 'kiedotaan liukumäeksi olympiapuiston veistoksen ympärille.',
      nostot: [
        {
          otsikko: 'Tunneli, jossa saa maalata',
          tiedosto: '2024-09-26 Leake Street, London graffiti tunnel 01.jpg',
          teksti: 'Waterloon aseman laiturien alla kulkee noin kolmesataa metriä '
            + 'pitkä tunneli, jossa seinien maalaaminen on sallittua — '
            + 'muualla Britanniassa luvaton graffiti on rangaistavaa. Tunneli '
            + 'avautui taiteelle toukokuussa 2008, kun Banksy järjesti siellä '
            + 'kolmipäiväisen Cans Festivalin. Autoja ajoi läpi vielä saman '
            + 'vuoden marraskuuhun asti, mutta nyt siellä vain kävellään. '
            + 'Seinät maalataan jatkuvasti uusiksi, joten aamulla ihailtu '
            + 'teos voi olla iltaan mennessä kadonnut toisen alle.',
          selite: 'Leake Streetin tunneli syyskuussa 2024, kuvattuna '
            + 'mustavalkoisena. Maali peittää seinät, pilarit ja kattopalkit, '
            + 'mutta asfalttilattia on jäänyt lähes paljaaksi. Tunnelin '
            + 'yläpuolella ovat Waterloon aseman laiturit.',
          lahde: 'Ted Potters, Wikimedia Commons (PD)',
          wiki: 'Banksy',
        },
        {
          otsikko: 'Tyhjä jalusta ja 2 400 ihmistä',
          tiedosto: 'Gormley-OneandOther-4thPlinth-TrafalgarSq-20090706.jpg',
          teksti: 'Trafalgar Squarella on neljä jalustaa. Kolmelle nousi patsas, '
            + 'mutta luoteiskulman jalusta jäi vuonna 1841 tyhjäksi, koska '
            + 'rahat loppuivat kesken. Yli 150 vuoden väittelyn jälkeen '
            + 'päätettiin, ettei sille tule pysyvää patsasta lainkaan: '
            + 'jalustalle nostetaan vuorotellen uusia nykytaideteoksia. '
            + 'Kesällä 2009 teoksena olivat ihmiset itse. Sadan päivän ajan, '
            + 'yötä päivää, 2 400 tavallista ihmistä sai kukin tunnin '
            + 'jalustan päällä ja teki siellä mitä halusi.',
          selite: 'Neljäs jalusta One & Other -teoksen avauspäivän iltana 6. '
            + 'heinäkuuta 2009. Jalustan päällä seisova osallistuja lukee '
            + 'papereistaan, ja reunalle on pingotettu turvaverkko. Taustalla '
            + 'näkyvät National Galleryn kupoli ja St Martin-in-the-Fieldsin '
            + 'kellotorni.',
          lahde: 'Simon Lee, Wikimedia Commons (CC BY 2.0)',
          wiki: 'Antony Gormley',
        },
        {
          otsikko: 'Voimalasta tuli taidesali',
          tiedosto: 'Turbine Hall - Tate Modern - geograph.org.uk - 7509077.jpg',
          teksti: 'Tate Modern on entinen hiilivoimala Thamesin etelärannalla. '
            + 'Sen turbiinihalli on 155 metriä pitkä ja 35 metriä korkea, ja '
            + 'museo tilaa siihen kerrallaan yhden jättimäisen teoksen. '
            + 'Vuonna 2010 kiinalainen Ai Weiwei levitti hallin lattialle '
            + 'sata miljoonaa auringonkukansiementä. Jokainen siemen oli '
            + 'muotoiltu käsin posliinista ja maalattu yksitellen: noin 1 600 '
            + 'käsityöläistä Jingdezhenin kaupungissa teki niitä yli kaksi '
            + 'vuotta. Museoon pääsee sisään ilmaiseksi.',
          selite: 'Turbiinihalli huhtikuussa 2023 yläparvelta kuvattuna. Katosta '
            + 'riippuu Cecilia Vicuñan Brain Forest Quipu: kaksi 27 metriä '
            + 'korkeaa villasta ja kasvikuidusta kudottua veistosta, jotka '
            + 'päättyvät ihmisten päiden yläpuolelle. Seinillä kulkevat '
            + 'voimalan alkuperäisen siltanosturin kiskot.',
          lahde: 'Mr Ignavy, Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Tate Modern',
        },
        {
          otsikko: 'Paviljonki, joka puretaan syksyllä',
          tiedosto: 'Serpentine Pavilion 2016 I (27776972542).jpg',
          teksti: 'Kensington Gardensissa nousee joka kesä uusi paviljonki. '
            + 'Serpentine-galleria on tilannut sellaisen vuodesta 2000 '
            + 'lähtien, ja säännöt ovat tiukat: arkkitehti ei saa olla '
            + 'aiemmin saanut valmiiksi yhtään rakennusta Englannissa, ja '
            + 'paviljongin on valmistuttava puolessa vuodessa. Syksyllä se '
            + 'puretaan pois. Vuonna 2016 tanskalaisen Bjarke Ingelsin ryhmä '
            + 'latoi nurmikolle 1 802 lasikuitulaatikkoa, jotka aukeavat '
            + 'suorasta seinästä kaartuvaksi tilaksi. Sisällä oli kahvila, '
            + 'iltaisin esityksiä, eikä pääsy maksanut mitään.',
          selite: 'Bjarke Ingelsin ryhmän suunnittelema paviljonki kesäkuussa '
            + '2016. Päällekkäin ladotut lasikuitulaatikot kiertyvät auki '
            + 'niin, että suorasta seinästä tulee kolmiulotteinen tila. '
            + 'Rakennelma seisoi gallerian nurmikolla kesäkuusta lokakuuhun.',
          lahde: 'Images George Rex, Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Bjarke Ingels',
        },
        {
          otsikko: 'Veistos, jonka sisällä on liukumäki',
          tiedosto: 'ArcelorMittal Orbit - geograph.org.uk - 6402522.jpg',
          teksti: 'Stratfordin olympiapuistossa seisoo 114,5 metriä korkea '
            + 'punainen teräsvyyhti, Britannian suurin julkinen taideteos. '
            + 'Sen suunnittelivat kuvanveistäjä Anish Kapoor ja insinööri '
            + 'Cecil Balmond vuoden 2012 olympialaisia varten. Ylhäällä on '
            + 'kaksi näköalatasannetta, ja alas pääsee 455 porrasta pitkin. '
            + 'Vuonna 2016 veistokseen kiedottiin toinen taideteos: Carsten '
            + 'Höllerin 178 metriä pitkä liukumäki, maailman pisin '
            + 'tunneliliukumäki. Matka alas kiertyy kaksitoista kertaa ja '
            + 'kestää noin 40 sekuntia.',
          selite: 'ArcelorMittal Orbit tammikuussa 2020. Punaisen teräsristikon '
            + 'ympäri kiertyy harmaa liukumäkiputki, ja ylempänä erottuu '
            + 'näköalatasanteen lasiseinä. Taustalla kohoavat Stratfordin '
            + 'tornitalot.',
          lahde: 'Ian S, Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Anish Kapoor',
        },
        {
          otsikko: 'Guernica maksoi parin saappaita',
          tiedosto: 'Tree of Life, Whitechapel Gallery (8132640664).jpg',
          teksti: 'Whitechapelin galleria avattiin vuonna 1901, jotta itäisen '
            + 'Lontoon työläiset pääsisivät näkemään taidetta. Tammikuussa '
            + '1939 siellä oli esillä Picasson Guernica — ainoa kerta, kun '
            + 'teos on ollut Britanniassa. Pääsymaksuksi kelpasi pari '
            + 'kunnollisia saappaita, jotka lähetettiin Espanjan '
            + 'sisällissodan tasavaltalaisille. Kahdessa viikossa maalauksen '
            + 'eteen kertyi satoja saapaspareja ja galleriaan yli 15 000 '
            + 'kävijää. Talo näyttää yhä nykytaidetta, ja sisään pääsee '
            + 'ilmaiseksi.',
          selite: 'Whitechapelin gallerian julkisivu lokakuussa 2012. Yläosaa '
            + 'peittävät Rachel Whitereadin kullatut pronssilehdet, jotka '
            + 'paljastettiin samana kesänä. Oikealla on entinen Passmore '
            + 'Edwards -kirjasto, joka liitettiin galleriaan vuonna 2009, ja '
            + 'sen alla Aldgate Eastin metroaseman sisäänkäynti.',
          lahde: 'John Lord, Wikimedia Commons (CC BY 2.0)',
          wiki: 'Rachel Whiteread',
        },
      ],
    },
  ],
  /*
   * Venetsian KANSISIVU (maa–kaupunki-pilotti 5.8.2026): kaupungin oma
   * aihe kertoo paikallisen, ja Italian yhteiset aiheet tulevat perään
   * js/packs/maa-kategoriat.js:stä (ks. js/ui.js rakennaSivut).
   * Nostot siirrettiin europe-kulttuuri.js:n litteästä taulusta
   * sellaisinaan — kuvat on tarkistettu jo silloin ja ne ovat
   * peilissä. Litteään tauluun jäi vain kulttuurivisa (v220 sääntö).
   */
  kairo: [
    {
      id: 'kaupunki',
      nimi: 'Kairo',
      johdanto: 'Tuhannen minareetin kaupunki, jossa faaraoiden aika ja '
        + 'kahdenkymmenen miljoonan ihmisen arki mahtuvat samaan '
        + 'katukuvaan.',
      /*
       * Lehden etusivun kuvat: sama malli kuin Venetsiassa — oma,
       * tarkistettu valinta. Ensimmäinen on iso pääkuva, loput
       * pienempien kuvien rivissä.
       */
      kansikuvat: [
        {
          tiedosto: 'All Gizah Pyramids.jpg',
          selite: 'Gizan pyramidit kaupungin laidalla — ainoa pystyssä '
            + 'säilynyt antiikin seitsemästä ihmeestä.',
          lahde: 'Ricardo Liberato, Wikimedia Commons (CC BY-SA 2.0)',
        },
        {
          tiedosto: 'Muhammad Ali Mosque 1.jpg',
          selite: 'Muhammad Alin alabasterimoskeija linnoituskukkulalla '
            + 'hallitsee kaupungin siluettia.',
          lahde: 'kallerna, Wikimedia Commons (CC BY-SA 3.0)',
        },
        {
          tiedosto: 'Khan el-Khalili, Cairo Egypt - panoramio (7).jpg',
          selite: 'Khan el-Khalilin basaarissa on käyty kauppaa samoilla '
            + 'kujilla 1300-luvulta asti.',
          lahde: 'The Erica Chang, Wikimedia Commons (CC BY 3.0)',
        },
      ],
      nostot: [
        {
          otsikko: 'Roberts piirsi Kairon',
          tiedosto: 'Cairo, looking west, Egypt. Coloured lithograph by Louis Haghe Wellcome V0049365.jpg',
          teksti: 'Skotlantilainen David Roberts matkusti Egyptiin 1838 '
            + 'ja piirsi Kairoa kuukausien ajan kaduilta ja katoilta. '
            + 'Litografioiksi painetut kuvat olivat monelle '
            + 'eurooppalaiselle ensimmäinen näkymä kaupunkiin, josta oli '
            + 'siihen asti vain kuultu tarinoita.',
          selite: 'Kairo lännestä katsottuna (1849): minareettien metsä '
            + 'täyttää kaupungin, ja taivaanrannassa siintävät Gizan '
            + 'pyramidit.',
          lahde: 'David Roberts / Wellcome Collection, Wikimedia Commons (CC BY 4.0)',
          wiki: 'David Roberts',
          /*
           * Selattava galleria kuten Venetsian Canaletto: lisää
           * Robertsin Kairo-litografioita saman noston nuolista.
           */
          galleria: [
            {
              otsikko: 'Metwaleyn portti',
              tiedosto: 'Gateway of the Metwaleys with minarets, Cairo, Egypt. Colour Wellcome V0049383.jpg',
              selite: 'Bab Zuweilan portti kaksoisminareetteineen: portin '
                + 'varjossa käy basaarikauppa kuten Robertsin aikaan — '
                + 'portti on yhä pystyssä.',
              lahde: 'David Roberts / Wellcome Collection, Wikimedia Commons (CC BY 4.0)',
            },
            {
              otsikko: 'Linnoitus',
              tiedosto: 'Cairo with the residence of Mehemet Ali in the citadel, Egyp Wellcome V0049375.jpg',
              selite: 'Kairon linnoituskukkula Muhammad Alin aikana: '
                + 'kamelikaravaani lepää muurin juurella, ja kukkulalla '
                + 'rakennetaan juuri sitä moskeijaa, joka nyt hallitsee '
                + 'siluettia.',
              lahde: 'David Roberts / Wellcome Collection, Wikimedia Commons (CC BY 4.0)',
            },
            {
              otsikko: 'Kalifien haudat',
              tiedosto: 'Mosque of Ayed Bey, with other tombs of the caliphs, Cairo, Wellcome V0049368.jpg',
              selite: 'Kalifien hautakaupunki muurien ulkopuolella: '
                + 'kupolien ja minareettien kaupunginosa, jossa asutaan '
                + 'yhä — hautojen keskellä.',
              lahde: 'David Roberts / Wellcome Collection, Wikimedia Commons (CC BY 4.0)',
            },
            {
              otsikko: 'Vesijohto Niililtä',
              tiedosto: 'The aqueduct seen from the the Island of Rhoda, Cairo, Egypt Wellcome V0012305.jpg',
              selite: 'Keskiaikainen vesijohto kantoi Niilin vettä '
                + 'linnoitukselle asti. Etualalla joen veneitä Rhodan '
                + 'saaren rannassa.',
              lahde: 'David Roberts / Wellcome Collection, Wikimedia Commons (CC BY 4.0)',
            },
          ],
        },
        {
          otsikko: 'Basaari ja kirjailijan kahvila',
          tiedosto: 'Kairo 2016-03-28h.jpg',
          teksti: 'Khan el-Khalilin kujilla on myyty mausteita, kultaa ja '
            + 'lyhtyjä 1300-luvulta asti, ja tinkiminen kuuluu kauppaan '
            + 'yhä. Basaarin sydämessä el-Fishawin kahvila on tarjoillut '
            + 'teetä yli kaksisataa vuotta — sen peilisalissa istui '
            + 'iltojaan myös Naguib Mahfouz, joka sai Kairon kujista '
            + 'kirjoittamistaan romaaneista Nobelin 1988, ensimmäisenä '
            + 'arabiaksi kirjoittavana kirjailijana.',
          selite: 'El-Fishawin kahvilan ovi Khan el-Khalilin kujalla: '
            + 'kullattu peili, puiset ristikkoseinät ja teelasit '
            + 'odottamassa.',
          lahde: 'Djehouty, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Naguib Mahfouz',
        },
        {
          /*
           * Siirretty litteästä taulusta (africa-kulttuuri.js), koska
           * kategoriat korvaavat litteät nostot — musiikkilinkki ja
           * visan aihe pysyvät näin näkyvissä. Kuva on 548 px leveä eli
           * alle nykysäännön, mutta se on ollut pelissä alusta asti ja
           * on aidosti paras vapaa kuva laulajasta.
           */
          /*
           * Vanha kartta -nosto (uusi lähdeidea 5.8.2026): Napoleonin
           * retkikunnan kartat ovat PD:nä Commonsissa, ja "silloin ja
           * nyt" istuu isoisän matkakirjan kehykseen. Sama vinkki on
           * monistusohjeessa muillekin kaupungeille.
           */
          otsikko: 'Kairo kartalla vuonna 1809',
          tiedosto: 'Environs du Kaire (Cairo). Plan général de Boulâq, du Kaire, de l\'île de Roudah (el-Rôda), du Vieux Kaire et de Gyzeh (Jîzah) (NYPL b14212718-1268726).jpg',
          teksti: 'Napoleonin retkikunnan tutkijat mittasivat Kairon '
            + 'kadut ja piirsivät kaupungin karttaan, joka painettiin '
            + 'jättimäiseen Description de l\'Égypte -teossarjaan. '
            + 'Kartalla Kairo on tiivis täplä Niilin itärannalla — '
            + 'ympärillä peltoja, palmulehtoja ja aavikkoa. Sama '
            + 'kaupunki levittäytyy nyt yli kahdenkymmenen miljoonan '
            + 'ihmisen suurkaupunkina joen molemmin puolin, ja kartan '
            + 'pellot ovat katuja. Vertaa etusivun ilmakuvaan: '
            + 'pyramidit seisovat yhä paikallaan, kaupunki tuli niiden '
            + 'luo.',
          selite: 'Kairon seudun yleiskartta Description de l\'Égypte '
            + '-sarjasta (1809): Bulaq, Kairo, Rodan saari, Vanha '
            + 'Kairo ja Giza.',
          lahde: 'Imprimerie impériale / NYPL, Wikimedia Commons (PD)',
          wiki: 'Description de l\'Égypte',
        },
        {
          otsikko: 'Umm Kulthum, Egyptin ääni',
          tiedosto: 'Umm Kulthum4.jpg',
          teksti: 'Laulajatar Umm Kulthum oli arabimaailman rakastetuin '
            + 'ääni: kun hänen radiokonserttinsa alkoi kuun ensimmäisenä '
            + 'torstaina, Kairon kadut hiljenivät ja kahvilat täyttyivät '
            + 'kuuntelijoista. Yksi laulu saattoi kestää tunnin, eikä '
            + 'kukaan pitänyt sitä pitkänä.',
          selite: 'Umm Kulthum mikrofonin äärellä uransa alkupuolella. '
            + 'Tunnusmerkit olivat aina samat: tummat lasit, nenäliina '
            + 'kädessä ja orkesteri takana — ja ääni, jota kutsuttiin '
            + 'Egyptin neljänneksi pyramidiksi.',
          lahde: 'Wikimedia Commons (PD)',
          wiki: 'Umm Kulthum',
          musiikki: 'https://music.apple.com/fi/album/enta-oumry-remastered/922753882?i=922753943',
          musiikkiNimi: 'Umm Kulthum Apple Musicissa',
          // Laulajan rakastetuin kappale.
          esikuuntelu: 'Umm Kulthum Enta Omri',
        },
      ],
    },
  ],
  /*
   * Madridin KANSISIVU (lehtimaa 4: Espanja, 6.8.2026). Espanjan
   * yhteiset aiheet tulevat perään js/packs/maa-kategoriat.js:stä
   * (ESP), ja sama maaosasto palvelee myös Barcelonaa ja Granadaa.
   *
   * Litteät nostot europe-kulttuuri.js:ssä purettiin ohjeen mukaan
   * (docs/tutki-aiheet.md kohta 1): chotis siirtyi tänne
   * musiikkilinkkeineen — se on myös kulttuurivisan aihe, joten visan
   * vastaus löytyy kannelta — ja cocido sekä uudenvuoden rypäleet
   * siirtyivät Espanjan Ruoka-aiheeseen, jonne ne kuuluvat: molemmat
   * ovat koko maan tapoja, vaikka cocidon nimessä lukee Madrid.
   */
  /*
   * Tukholman kansi (v315). Litteät nostot (europe-kulttuuri.js) on
   * siirretty tänne monistusohjeen mukaan: ABBA Apple Music -linkkeineen
   * ja metron taide, joka on myös visan aihe — siksi se on kannessa.
   * Fika siirtyi maan Ruoka-aiheeseen kanelipullana.
   */

  praha: [
    {
      id: 'kaupunki',
      nimi: 'Praha',
      johdanto: 'Sata tornia, kello joka näyttää auringon paikan taivaalla — ja '
        + 'savesta tehty jättiläinen ullakolla.',
      kansikuvat: [
        {
          tiedosto: 'The Vltava, Charles Bridge, Old Town Bridge Tower and Church of St. Francis of Assisi. Prague, Czech Republic.jpg',
          selite: 'Kaarlensilta ja Vltava iltapäivän valossa. Sillan päässä '
            + 'seisoo vanhankaupungin sillantorni, jonka läpi kuninkaat '
            + 'ratsastivat kruunajaisiinsa.',
          lahde: 'Ввласенко, Wikimedia Commons (CC BY-SA 3.0)',
        },
        {
          tiedosto: 'Old Town Square (Prague) 20150902.jpg',
          selite: 'Vanhankaupungin tori illalla. Kaksi mustaa tornia kuuluu Tynin '
            + 'kirkolle — niitä kutsutaan Aatamiksi ja Eevaksi, koska toinen '
            + 'on hitusen paksumpi.',
          lahde: 'Suicasmo, Wikimedia Commons (CC BY-SA 4.0)',
        },
        {
          tiedosto: 'Lascar Pražský hrad (Prague Castle) and St. Vitus Cathedral (4502233528).jpg',
          selite: 'Prahan linna mäen päällä. Pyhän Vituksen katedraali kohoaa '
            + 'keskeltä; linnaa pidetään maailman suurimpana yhtenäisenä '
            + 'linnana.',
          lahde: 'Jorge Láscar, Wikimedia Commons (CC BY 2.0)',
        },
      ],
      nostot: [
        {
          otsikko: 'Kello, joka näyttää missä aurinko on',
          tiedosto: 'Praha Astronomical Clock 01.jpg',
          teksti: 'Vanhankaupungin raatihuoneen seinässä käy kello vuodelta 1410. '
            + 'Se on maailman vanhin astronominen kello, joka yhä toimii. '
            + 'Viisarit eivät kerro vain kellonaikaa: kultainen käsi näyttää '
            + 'auringon paikan taivaalla, toinen kuun, ja sininen kaari '
            + 'erottaa päivän yöstä. Joka tasatunti kaksitoista apostolia '
            + 'kulkee kellon yläpuolella olevien luukkujen ohi, ja niiden '
            + 'vieressä seisova luuranko kääntää tiimalasinsa ympäri.',
          selite: 'Orloj kokonaisuudessaan. Ylhäällä ovat pienet luukut, joista '
            + 'apostolit kulkevat, keskellä sinivalkoinen tähtikellotaulu ja '
            + 'alhaalla kultainen kalenterikiekko.',
          lahde: 'Uoaei1, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Prahan astronominen kello',
        },
        {
          otsikko: 'Kaarle IV rakensi sillan ja yliopiston',
          tiedosto: 'Charles IV.jpg',
          teksti: 'Kaarle IV oli Böömin kuningas ja Saksalais-roomalaisen '
            + 'keisarikunnan keisari, ja hän teki Prahasta valtakuntansa '
            + 'pääkaupungin. Hänen aikanaan kaupunki sai yliopiston, kokonaan '
            + 'uuden kaupunginosan ja kivisillan Vltavan yli. Silta '
            + 'aloitettiin vuonna 1357 hetkellä, jonka numerot luetaan yhtä '
            + 'lailla eteen- ja taaksepäin: 1-3-5-7-9-7-5-3-1. Se kantaa yhä, '
            + 'ja sitä sanotaan Kaarlensillaksi.',
          selite: 'Kaarle IV kruunu päässään 1300-luvun maalauksessa. Viitassa on '
            + 'kuvioina pieniä kotkia, keisarikunnan tunnuseläimiä.',
          lahde: 'Wikimedia Commons (PD)',
          wiki: 'Kaarle IV',
        },
        {
          otsikko: 'Golem nukkuu ullakolla',
          tiedosto: 'Old New Synagogue 01(js).jpg',
          teksti: 'Prahan juutalaiskorttelin vanhinta synagogaa sanotaan '
            + 'Vanhaksiuudeksi. Se valmistui 1200-luvulla ja on yhä käytössä. '
            + 'Tarinan mukaan rabbi Löw muovasi 1500-luvulla Vltavan savesta '
            + 'Golemin, ihmisen kokoisen apurin, joka heräsi henkiin suuhun '
            + 'asetetusta lapusta. Kun Golem kävi liian voimakkaaksi, rabbi '
            + 'otti lapun pois ja kantoi hahmon synagogan ullakolle. Sinne ei '
            + 'tarinan mukaan saa nousta.',
          selite: 'Vanhauusi synagoga jyrkkine tiilikattoineen. Takana näkyy '
            + 'juutalaisen raatihuoneen kellotorni.',
          lahde: 'Jerzy Strzelecki, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Golem',
        },
      ],
    },
    {
      id: 'musiikki',
      nimi: 'Musiikki',
      johdanto: 'Kaksi säveltäjää teki Prahan joesta ja kylien tansseista '
        + 'musiikkia, jota soitetaan kaikkialla maailmassa.',
      nostot: [
        {
          otsikko: 'Kuuro mies sävelsi joen',
          tiedosto: 'Jan Vilímek - Bedřich Smetana.jpg',
          teksti: 'Bedřich Smetana menetti kuulonsa kokonaan lokakuussa 1874. '
            + 'Alle kaksi kuukautta myöhemmin, 20. marraskuuta ja 8. '
            + 'joulukuuta välisenä aikana, hän sävelsi Vltavan — teoksen, '
            + 'joka seuraa jokea kahdesta pienestä lähteestä Prahaan asti. '
            + 'Matkalla kuuluu metsästystorvia, häätanssi ja kuutamo, kunnes '
            + 'joki jyrisee koskessa. Hän ei kuullut teostaan koskaan. '
            + 'Vuodesta 1952 Prahan kevät -festivaali on alkanut joka 12. '
            + 'toukokuuta juuri tällä musiikilla.',
          selite: 'Bedřich Smetana (1824–1884) Jan Vilímekin litografiassa. '
            + 'Vltava on osa kuuden sinfonisen runon sarjaa Má vlast eli '
            + 'Isänmaani.',
          lahde: 'Jan Vilímek, Wikimedia Commons (PD)',
          wiki: 'Bedřich Smetana',
          musiikki: 'https://music.apple.com/fi/search?term=smetana%20vltava',
          musiikkiNimi: 'Smetanan Vltava Apple Musicissa',
          musiikkiNayte: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/3/39/Smetana%2C_M%C3%A1_vlast_-_Vltava_-_The_Moldau.ogg/Smetana%2C_M%C3%A1_vlast_-_Vltava_-_The_Moldau.ogg.mp3',
          musiikkiNayteNimi: 'Smetana: Vltava — Musopen Symphony Orchestra (CC0)',
        },
        {
          otsikko: 'Dvořák vei kylätanssit maailmalle',
          tiedosto: 'Jan Langhans Antonin Dvorak 1904 (cropped).jpg',
          teksti: 'Antonín Dvořák oli teurastajan poika, joka soitti alttoviulua '
            + 'prahalaisessa orkesterissa ennen kuin hänen sävellyksensä '
            + 'löydettiin. Slaavilaiset tanssit tekivät hänestä kuuluisan: '
            + 'niissä soi böömiläisten ja määriläisten kylien tanssimusiikki '
            + 'sinfoniaorkesterille kirjoitettuna. Myöhemmin hän johti '
            + 'musiikkikoulua New Yorkissa ja sävelsi siellä sinfonian '
            + 'nimeltä Uudesta maailmasta.',
          selite: 'Antonín Dvořák valokuvaaja Jan Langhansin edessä vuonna 1904, '
            + 'hänen viimeisenä elinvuotenaan.',
          lahde: 'Jan Nepomuk Langhans, Wikimedia Commons (PD)',
          wiki: 'Antonín Dvořák',
          musiikki: 'https://music.apple.com/fi/search?term=dvorak%20slavonic%20dances',
          musiikkiNimi: 'Dvořákin Slaavilaiset tanssit Apple Musicissa',
        },
      ],
    },
    {
      id: 'arki',
      nimi: 'Arki ja tavat',
      johdanto: 'Kaupungin oma voileipä ja teatteri, jossa näyttelijät roikkuvat '
        + 'langoissa.',
      nostot: [
        {
          otsikko: 'Nukketeatteri puolusti kieltä',
          tiedosto: 'Marionette Opera Prague.jpg',
          teksti: 'Habsburgien valtakunnassa virastojen ja koulujen kieli oli '
            + 'saksa, mutta kiertävät nukkenäyttelijät esittivät markkinoilla '
            + 'näytelmänsä tšekiksi — siksi marionetit muistetaan Tšekissä '
            + 'kielen puolustajina. Unesco otti tšekkiläisen ja '
            + 'slovakialaisen nukketeatterin ihmiskunnan kulttuuriperinnön '
            + 'luetteloon vuonna 2016. Prahassa on yhä teattereita, joissa '
            + 'lankojen varassa esitetään kokonainen ooppera.',
          selite: 'Prahan Vanhankaupungin nukketeatterin sisäänkäynti. Kyltti '
            + 'mainostaa Don Giovannia — Mozartin ooppera sai maailman '
            + 'ensi-iltansa Prahassa 29. lokakuuta 1787 säveltäjän itsensä '
            + 'johtamana.',
          lahde: 'Jim Milles, Wikimedia Commons (CC BY 2.0)',
          wiki: 'Marionetti',
        },
        {
          otsikko: 'Voileipä, joka syödään haarukalla',
          tiedosto: 'Obložené chlebíčky.jpg',
          teksti: 'Chlebíček on paksu viipale vaaleaa leipää, jonka päälle '
            + 'ladotaan perunasalaattia, kinkkua, kananmunaa ja suolakurkkua. '
            + 'Prahalainen herkkukauppias Jan Paukert alkoi myydä niitä '
            + 'liikkeessään 1910-luvulla, ja tapa levisi koko maahan. '
            + 'Syntymäpäiviin ja hautajaisiin niitä tehdään yhä vadillinen, '
            + 'ja kaupassa hinta lasketaan kappaleittain.',
          selite: 'Vadillinen chlebíčkejä katetulla pöydällä. Pohjana on '
            + 'tavallisesti perunasalaatti, ja päälle tulee kinkkua, salamia, '
            + 'munaa ja suolakurkkua — jokainen leipä koristellaan erikseen.',
          lahde: 'Wikimedia Commons (CC0)',
        },
      ],
    },
  ],
  wien: [
    {
      id: 'kaupunki',
      nimi: 'Wien',
      johdanto: 'Kaupunki, jossa keisari söi aamiaista eläintarhan keskellä ja '
        + 'jonka kuuluisin ratas kulkee hitaammin kuin sinä kävelet.',
      kansikuvat: [
        {
          tiedosto: 'Wien Stephansdom dach.jpg',
          selite: 'Stephansdomin kattoa läheltä: siihen on ladottu noin 250 000 '
            + 'lasitettua tiiltä kymmenessä eri värissä. Kuoriosan '
            + 'eteläpuolella levittää siipiään kaksipäinen keisarinkotka, ja '
            + 'sen ympärillä lukee nurkka kerrallaan 1-8-3-1, katon '
            + 'uusimisvuosi.',
          lahde: 'Andrzej Otrębski, Wikimedia Commons (CC BY-SA 3.0)',
        },
        {
          tiedosto: 'Schönbrunn September 2023 1.jpg',
          selite: 'Schönbrunnin keltainen kesäpalatsi ja sen tyhjä kunniapiha '
            + 'iltapäivän valossa. Palatsin takana olevassa puistossa toimii '
            + 'maailman vanhin eläintarha.',
          lahde: 'Conny Duck, Wikimedia Commons (CC BY-SA 4.0)',
        },
        {
          tiedosto: '2019 - Wiener Staatsoper im Morgengrauen.jpg',
          selite: 'Valtionoopperan talo aamuhämärässä, taivas vielä punaisena. '
            + 'Sen editse kaartaa Ring — kehäkatu, joka rakennettiin puretun '
            + 'kaupunginmuurin paikalle ja jolla kulkevat raitiovaunun '
            + 'kiskot.',
          lahde: 'Moahim, Wikimedia Commons (CC BY-SA 4.0)',
        },
      ],
      nostot: [
        {
          otsikko: 'Ratas, joka kulkee kävelyä hitaammin',
          tiedosto: 'Riesenrad Wiener Prater 2020-07-12 d.jpg',
          teksti: 'Praterin jättiratas nousi vuonna 1897 keisari Frans Joosefin '
            + '50-vuotisen hallitsijajuhlan kunniaksi. Se ei ole ympyrä vaan '
            + 'kolmikymmenkulmio: yksi kulma jokaista alkuperäistä vaunua '
            + 'kohti. Vaunuja oli kolmekymmentä, kunnes ratas paloi '
            + 'huhtikuussa 1945. Kun se avattiin uudelleen 1947, vaunuja '
            + 'ripustettiin takaisin vain viisitoista — ja niin ne roikkuvat '
            + 'siitä asti joka toisessa kulmassa. Ratas kulkee 2,7 kilometriä '
            + 'tunnissa.',
          selite: 'Punainen vaunu numero 4 riippuu rattaan kaarevasta kehästä. '
            + 'Vaunut ovat pieniä puutaloja ovineen ja ikkunoineen, eivät '
            + 'avoimia istuimia.',
          lahde: 'Manfred Werner (Tsui), Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Prater',
          galleria: [
            {
              otsikko: 'Koko ratas kerralla',
              tiedosto: 'Wiener Riesenrad DSC02378.JPG',
              selite: 'Jättiratas ukkospilvien edessä: valkoinen teräskehä, jonka '
                + 'reunalla roikkuu viisitoista punaista vaunua tasavälein, '
                + 'ja alla kaksi jalkaa kuin A-kirjain.',
              lahde: 'David Monniaux, Wikimedia Commons (CC BY-SA 3.0)',
            },
          ],
        },
        {
          otsikko: 'Keisarin aamiaishuone eläintarhan keskellä',
          tiedosto: 'Tiergarten Schönbrunn Kaiserpavillion 2.jpg',
          teksti: 'Maria Teresian puoliso Frans Stefan teetti Schönbrunnin '
            + 'puistoon eläintarhan, joka esiteltiin vieraille kesällä 1752. '
            + 'Se on maailman vanhin yhä toimiva eläintarha. Keskelle '
            + 'valmistui 1759 kahdeksankulmainen paviljonki, jonka '
            + 'keisariperhe rakennutti aamiaishuoneekseen. Sen ympärille oli '
            + 'asetettu kaksitoista samankokoista tarhaa kuin kakunpalat, '
            + 'joten pöydästä näki joka suuntaan eläimiä. Paviljonki on '
            + 'nykyään ravintola.',
          selite: 'Kahdeksankulmainen keisaripaviljonki: vaaleankeltainen '
            + 'julkisivu, vihreäksi hapettunut kuparikatto ja portaiden '
            + 'edessä ravintolan valkoisia päivänvarjoja.',
          lahde: 'Geolina163, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Tiergarten Schönbrunn',
          galleria: [
            {
              otsikko: 'Norsut paviljongin edessä',
              tiedosto: 'Historisches Bild Elefanten.jpg',
              selite: 'Vanha postikorttimaalaus Schönbrunnin norsutarhasta: kolme '
                + 'aikuista norsua ja yksi poikanen hiekkakentällä, aidan '
                + 'takana katsojia ja taustalla keisaripaviljongin kupoli.',
              lahde: 'Ludwig Hans Fischer, Wikimedia Commons (PD)',
            },
          ],
        },
        {
          otsikko: 'Valkoiset hevoset syntyvät tummina',
          tiedosto: 'Kawecan.jpg',
          teksti: 'Hofburgin palatsissa toimii ratsastuskoulu, jonne '
            + 'lipizzanoriit tuodaan nelivuotiaina Piberin siitostallilta '
            + 'Steiermarkista. Valkoisia ne eivät silloin vielä ole: varsat '
            + 'syntyvät ruunikkoina tai mustina ja vaalenevat vuosi vuodelta, '
            + 'kunnes ovat 6–10 vuoden iässä valkoisia. Perinne vaatii, että '
            + 'tallissa on aina myös yksi ruunikko. Ratsastajat tervehtivät '
            + 'salin seinällä olevaa keisari Kaarle VI:n muotokuvaa ennen '
            + 'kuin ratsastavat.',
          selite: 'Valkoisen lipizzanoriin pää lähikuvassa Stallburgin pihalla. '
            + 'Kuonon ympärillä on nahkainen kapistin, ja takana kohoaa '
            + 'kolmikerroksinen kaarikäytävä, jonka takana ovat tallit.',
          lahde: 'Eerschay, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Espanjalainen ratsastuskoulu',
        },
      ],
    },
    {
      id: 'musiikki',
      nimi: 'Musiikki',
      johdanto: 'Valssi, jonka toinen isku tulee etuajassa, ja satuooppera, joka '
        + 'kirjoitettiin esikaupungin puiselle näyttämölle.',
      nostot: [
        {
          otsikko: 'Kaupunki sävelsi oman jokensa',
          tiedosto: 'Johann Strauss II by Fritz Luckhardt.jpg',
          teksti: 'Johann Strauss nuoremman valssi Tonava kaunoinen '
            + 'kantaesitettiin Wienissä 15. helmikuuta 1867 — ensin '
            + 'mieskuorolle, vasta myöhemmin pelkälle orkesterille. '
            + 'Wieniläisvalssissa toinen isku tulee hitusen etuajassa, joten '
            + 'se ei mene metronomin kanssa tasan: sitä ei voi laskea, se '
            + 'pitää tuntea. Strauss sävelsi noin viisisataa teosta ja johti '
            + 'orkesteriaan viulu kädessä, soittaen ja tahdittaen yhtä aikaa.',
          selite: 'Johann Strauss nuorempi ateljeekuvassa vuodelta 1899, hänen '
            + 'viimeiseltä elinvuodeltaan: tumma takki ja liivi, leveä kihara '
            + 'parta ja ylös kaartuvat viikset. Kortin alareunaan on painettu '
            + 'valokuvaamon nimi.',
          lahde: 'Fritz Luckhardt, Wikimedia Commons (PD)',
          wiki: 'Johann Strauss nuorempi',
          musiikki: 'https://music.apple.com/fi/search?term=Johann%20Strauss%20Donauwalzer',
          musiikkiNimi: 'Tonava kaunoinen Apple Musicissa',
          musiikkiNayte: 'https://upload.wikimedia.org/wikipedia/commons/d/de/%22An_der_sch%C3%B6nen%2C_blauen_Donau%22%2C_performed_by_the_US_Marine_Band.mp3',
          musiikkiNayteNimi: 'Strauss: Tonava kaunoinen — United States Marine Band (PD)',
        },
        {
          otsikko: 'Taikahuilu tehtiin esikaupungin teatteriin',
          tiedosto: 'Karl Friedrich Schinkel - Die Sternenhalle der Königin der Nacht (ca. 1815).jpg',
          teksti: 'Mozartin viimeinen ooppera ei syntynyt hovia varten. '
            + 'Taikahuilu sai ensi-iltansa 30. syyskuuta 1791 Emanuel '
            + 'Schikanederin teatterissa Wienin Wiedenin esikaupungissa, ja '
            + 'se laulettiin saksaksi eikä italiaksi — tavallisen wieniläisen '
            + 'kielellä. Schikaneder kirjoitti sanat itse ja näytteli '
            + 'linnustaja Papagenoa. Mozart kuoli kaksi kuukautta myöhemmin. '
            + 'Kymmenen vuoden päästä Schikaneder avasi kaupunkiin uuden '
            + 'teatterin ja antoi veistää itsensä Papagenona sen portin '
            + 'päälle.',
          selite: 'Yön kuningattaren tähtisali, Karl Friedrich Schinkelin '
            + 'lavastusmaalaus noin vuodelta 1815: syvänsininen kupoli on '
            + 'ladottu täyteen tähtiä tasaisiin riveihin, ja alhaalla '
            + 'kuunsirpin päällä seisoo pieni tumma hahmo.',
          lahde: 'Karl Friedrich Schinkel, Wikimedia Commons (PD)',
          wiki: 'Taikahuilu',
          musiikki: 'https://music.apple.com/fi/search?term=Mozart%20Zauberfl%C3%B6te%20K%C3%B6nigin%20der%20Nacht',
          musiikkiNimi: 'Taikahuilu Apple Musicissa',
          musiikkiNayte: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/d/de/W._A._Mozart_-_Die_Zauberfl%C3%B6te_-_18._Der_H%C3%B6lle_Rache_kocht_in_meinem_Herzen_%28Ferenc_Fricsay%2C_1953%29.ogg/W._A._Mozart_-_Die_Zauberfl%C3%B6te_-_18._Der_H%C3%B6lle_Rache_kocht_in_meinem_Herzen_%28Ferenc_Fricsay%2C_1953%29.ogg.mp3',
          musiikkiNayteNimi: 'Mozart: Yön kuningattaren aaria — johtaa Ferenc Fricsay, äänitetty 1953 (PD)',
          galleria: [
            {
              otsikko: 'Papagenon portti',
              tiedosto: 'Theater an der Wien.jpg',
              selite: 'Kivinen veistosryhmä Theater an der Wienin sivuportin '
                + 'päällä: Schikaneder höyhenpuvussa soittamassa pillejään, '
                + 'vieressä lintuhäkki ja kolme höyhenpukuista lasta. Kuvattu '
                + 'kohtaus on Taikahuilun jatko-osasta Das Labyrinth.',
              lahde: 'Yair Haklai, Wikimedia Commons (CC BY-SA 3.0)',
            },
          ],
        },
      ],
    },
    {
      id: 'arki',
      nimi: 'Arki ja tavat',
      johdanto: 'Kaupunki, jossa yhtä kahvikuppia voi venyttää koko iltapäivän ja '
        + 'jossa kaupunki itse ryhtyi rakentamaan asuntoja.',
      nostot: [
        {
          otsikko: 'Kahvila on kaupungin olohuone',
          tiedosto: 'Cafe Central in Vienna interior near portraits.JPG',
          teksti: 'Wieniläisessä kahvilassa yhden kupin voi venyttää koko '
            + 'iltapäiväksi, ja lehdet kuuluvat hintaan. Kahvin kanssa '
            + 'tuodaan aina lasi hanavettä, joka täytetään pyytämättä '
            + 'uudelleen. Jokaisella kahvilajilla on oma nimensä: melangessa '
            + 'on maitoa ja maitovaahtoa, ja einspänner tarjoillaan lasissa '
            + 'kermavaahtohatun alla. Nimi tulee yksivaljakon ajureista, '
            + 'jotka pitivät lasia toisessa kädessä ja ohjaksia toisessa — '
            + 'vaahto piti kahvin lämpimänä.',
          selite: 'Café Centralin holvisali Wienissä. Seinällä on kaksi suurta '
            + 'muotokuvaa, keisari Frans Joosef ja keisarinna Elisabet, ja '
            + 'niiden alla istutaan valkoisilla liinoilla katetuissa '
            + 'pöydissä.',
          lahde: 'Clayton Tang, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Wien',
        },
        {
          otsikko: 'Kilometrin pituinen kotitalo',
          tiedosto: 'Karl Marx Hof.jpg',
          teksti: 'Vuoden 1917 asuntolaskennassa 92 prosentissa Wienin asunnoista '
            + 'ei ollut omaa vessaa eikä 95 prosentissa vesijohtoa. Kaupunki '
            + 'ryhtyi silloin itse rakennuttajaksi. Karl-Marx-Hof avattiin '
            + '12. lokakuuta 1930: se on noin 1 050 metriä pitkä ja siihen '
            + 'tehtiin 1 382 asuntoa noin viidelletuhannelle asukkaalle. '
            + 'Tontista rakennettiin vain 23 prosenttia — kaikki muu '
            + 'jätettiin pihaksi ja leikkikentäksi.',
          selite: 'Karl-Marx-Hofin julkisivu Döblingin kaupunginosassa. '
            + 'Punatiilisen rakennuksen läpi johtaa neljä suurta holvikaarta, '
            + 'torneissa on lipputangot, ja edessä on nurmikko ja kukkiva '
            + 'kastanja.',
          lahde: 'Thomas Ledl, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Karl-Marx-Hof',
        },
      ],
    },
  ],
  madrid: [
    {
      id: 'kaupunki',
      nimi: 'Madrid',
      johdanto: 'Euroopan korkeimmalla sijaitseva pääkaupunki, jonka kuninkaat '
        + 'perustivat keskelle tyhjää ylätasankoa ja jonka asukkaat päättivät '
        + 'valvoa myöhempään kuin kukaan muu.',
      kansikuvat: [
        {
          tiedosto: 'Madrid May 2014-42a.jpg',
          selite: 'Plaza Mayor on suorakulmainen sali ilman kattoa: yhdeksän '
            + 'porttia, 237 parveketta ja keskellä Filip III ratsain.',
          lahde: 'Alvesgaspar, Wikimedia Commons (CC BY-SA 3.0)',
        },
        {
          tiedosto: 'Madrid Gran Via Metropolis (28895530633).jpg',
          selite: 'Gran Vía illalla. Etualalla Metrópolis-talon kupoli, jonka '
            + 'huipulla siivekäs voitonjumalatar on seissyt vuodesta 1975.',
          lahde: 'Nan Palmero from San Antonio, TX, USA, Wikimedia Commons (CC BY 2.0)',
        },
        {
          tiedosto: 'Palacio de Cristal - 02.jpg',
          selite: 'Retiron puiston Kristallipalatsi syksyisen lammen takaa. Se '
            + 'rakennettiin 1887 kasvihuoneeksi, nykyään se on näyttelytila '
            + 'ilman vakituista kokoelmaa.',
          lahde: 'Carlos Delgado, Wikimedia Commons (CC BY-SA 3.0)',
        },
      ],
      nostot: [
        {
          otsikko: 'Goya maalasi madridilaisten vapaapäivät',
          tiedosto: 'La pradera de San Isidro, Francisco de Goya.jpg',
          teksti: 'Ennen kuin Francisco de Goyasta tuli hovimaalari ja ennen kuin '
            + 'hän maalasi sotaa ja hulluutta, hän teki kymmenen vuotta töitä '
            + 'kuninkaallisen kutomon tilauksesta: malleja seinävaatteisiin, '
            + 'joiden aiheeksi haluttiin iloisia kansankuvia. Goya meni '
            + 'kaduille ja niityille ja katsoi, mitä madridilaiset oikeasti '
            + 'tekivät vapaapäivinään — joivat, tanssivat, riitelivät, '
            + 'leikkivät. Siitä syntyi tarkin muotokuva, joka 1700-luvun '
            + 'Madridista on: ei kuninkaista vaan kaupungista.',
          selite: 'San Isidron niitty (1788): koko kaupunki juhlii '
            + 'suojeluspyhimyksensä päivää Manzanaresin rannalla, ja joen '
            + 'takana kohoaa Madrid kupoleineen.',
          lahde: 'Francisco Goya, Wikimedia Commons (Public domain)',
          wiki: 'Francisco de Goya',
          galleria: [
            {
              otsikko: 'Päivänvarjo',
              tiedosto: 'El Quitasol (Goya).jpg',
              selite: 'Päivänvarjo (1777). Palvelija pitää varjoa nuoren naisen '
                + 'yllä — Goyan tunnetuin kutomomalli ja yhä Pradon '
                + 'suosituimpia tauluja.',
              lahde: 'Francisco Goya, Wikimedia Commons (Public domain)',
            },
            {
              otsikko: 'Sokkoleikki',
              tiedosto: 'La gallina ciega (Goya).jpg',
              selite: 'Sokkoleikki (1789): piiri tanssii silmät sidotun ympärillä '
                + 'puulusikka kädessä. Leikin nimi on espanjaksi "sokea '
                + 'kana".',
              lahde: 'Francisco Goya, Wikimedia Commons (Public domain)',
            },
            {
              otsikko: 'Lumisade',
              tiedosto: 'La nevada, Francisco de Goya.jpg',
              selite: 'Lumisade eli Talvi (1786). Madrid on 650 metrin '
                + 'korkeudessa, ja talvi puree — kolme miestä taluttaa aasia '
                + 'lumituiskussa, koira perässä.',
              lahde: 'Francisco Goya, Wikimedia Commons (Public domain)',
            },
            {
              otsikko: 'Tanssi Manzanaresin rannalla',
              tiedosto: 'El baile a orillas del Manzanares.jpg',
              selite: 'Tanssi Manzanaresin rannalla (1777): majo ja maja, '
                + 'kaupungin omat keikarit, tanssivat seguidillaa joen '
                + 'törmällä.',
              lahde: 'Francisco Goya, Wikimedia Commons (Public domain)',
            },
            {
              otsikko: 'Saviastioiden kauppias',
              tiedosto: 'El cacharrero, Francisco de Goya.jpg',
              selite: 'Saviastioiden kauppias (1779). Kauppias levittää ruukkunsa '
                + 'maahan, ja ohi vierivistä vaunuista katsotaan — kaksi '
                + 'Madridia samassa kuvassa.',
              lahde: 'Francisco Goya, Wikimedia Commons (Public domain)',
            },
          ],
        },
        {
          otsikko: 'Kaupunki, jossa syödään seisten',
          tiedosto: 'Mercado de San Miguel, Madrid - 001.jpg',
          teksti: 'Madridissa lounas on kahdelta ja illallinen yhdeksän jälkeen, '
            + 'ja väliin jää tunteja, jotka täytetään tapaksilla. Tapa '
            + 'tarkoittaa kantta: juomalasin päälle asetettiin viipale '
            + 'kinkkua tai leipää, jottei kärpäsiä päässyt sisään — kansi '
            + 'muuttui ruoaksi. Tapaksia syödään seisten baaritiskillä ja '
            + 'siirrytään sitten seuraavaan paikkaan; kierros on nimeltään '
            + 'tapeo, ja se on yhtä paljon kävelyä kuin syömistä. Vuoden 1916 '
            + 'valurautainen San Miguelin halli on kierroksen tunnetuin '
            + 'pysäkki.',
          selite: 'Mercado de San Miguelin lasi- ja valurautahalli Plaza Mayorin '
            + 'kupeessa. Vanha vihannestori muuttui 2009 tapastoriksi, jonka '
            + 'tiskien ympärillä seistään.',
          lahde: 'Nicolas Vigier, Wikimedia Commons (CC0)',
          wiki: 'Tapas',
        },
        {
          otsikko: 'Chotis tanssitaan yhden laatan päällä',
          tiedosto: 'Parejas bailando Chotis - Madrid 01.jpg',
          teksti: 'Chotis tuli Madridiin 1850 Keski-Euroopasta, mutta muuttui '
            + 'perillä omanlaisekseen. Säännön mukaan mies ei siirry '
            + 'laatalta, jolla seisoo: hän pyörii paikallaan, ja nainen '
            + 'kiertää hänen ympärillään. Säestää organillo, kadulla '
            + 'työnnettävä kampiurut. Tanssi kuuluu verbena-juhliin, joista '
            + 'suurin on San Isidro 15. toukokuuta — sama juhla, jonka Goya '
            + 'maalasi. Samasta Madridista syntyi myös zarzuela, laulun ja '
            + 'puheen vuorottelu, jota esitetään kaupungin omassa '
            + 'Zarzuela-teatterissa yhä.',
          selite: 'Pareja tanssimassa chotisia Plaza de Santa Cruzilla. Miehillä '
            + 'on chulapon lakki ja liivi, naisilla pitkä pilkullinen mekko, '
            + 'huivi hartioilla ja neilikka hiuksissa.',
          lahde: 'Javier Perez Montes, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Zarzuela',
          musiikki: 'https://music.apple.com/fi/search?term=zarzuela',
          musiikkiNimi: 'Zarzuela-musiikkia Apple Musicissa',
          musiikkiNayte: 'https://archive.org/download/granvi30g/AE2784.mp3',
          musiikkiNayteNimi: 'La Gran Vía -zarzuela — Emilio Sagi-Barba, PD',
        },
      ],
    },
    {
      id: 'urheilu',
      nimi: 'Urheilu',
      johdanto: 'Kaupungissa on kaksi suurta jalkapalloseuraa, ja kummallakin on '
        + 'oma suihkulähde, jonka päälle mestaruus kiivetään juhlimaan.',
      nostot: [
        {
          otsikko: 'Nurmi lasketaan hissillä maan alle',
          tiedosto: 'Estadio Santiago Bernabeu - Field.jpg',
          teksti: 'Real Madridin kotistadion avattiin 14. joulukuuta 1947, ja '
            + 'siihen mahtuu nykyään 83 186 katsojaa. Suuren remontin jälkeen '
            + 'sen erikoisin osa on nurmikenttä. Kenttä on leikattu kuudeksi '
            + 'yli sadan metrin pituiseksi kaukaloksi, jotka voidaan ajaa '
            + 'sivuun ja laskea hydraulisella hissillä kolmenkymmenen metrin '
            + 'syvyyteen. Siellä alhaalla on kasvihuone, jossa ruoho saa '
            + 'valoa ja jatkaa kasvamistaan. Koko kentän piilottaminen kestää '
            + 'noin kuusi tuntia — sen jälkeen stadionille mahtuu konsertti.',
          selite: 'Bernabéun nurmi ja siniset katsomot tyhjinä vuonna 2018, ennen '
            + 'remonttia. Katsomo nousee kolmena kerroksena kentän ympäri, ja '
            + 'ylimmän yllä näkyy katos ja pala taivasta.',
          lahde: 'Mervat, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Estadio Santiago Bernabéu',
        },
        {
          otsikko: 'Suihkulähde, joka vaihtoi joukkuetta',
          tiedosto: 'Fuente de Cibeles - 03.jpg',
          teksti: 'Cibeleen aukion suihkulähteessä jumalatar ajaa vaunuja, joita '
            + 'vetää kaksi leijonaa. Ensimmäisinä sen päälle kiipesivät '
            + 'Atlético Madridin kannattajat: seuran toimisto oli '
            + 'naapurikadulla, ja siellä juhlittiin voittoja jo vuonna 1962. '
            + 'Real Madridin väki omaksui tavan perässä, ja 1980-luvun '
            + 'lopulla Cibeles oli jo niin vahvasti valkoisten paikka, että '
            + 'atléticolaiset luovuttivat sen. Vuodesta 1991 he ovat '
            + 'juhlineet saman puistokadun toisessa päässä, Neptunuksen '
            + 'suihkulähteellä.',
          selite: 'Cibeleen suihkulähteen kaksi kivileijonaa alaviistosta '
            + 'kuvattuna: harjat, valjaat ja tassut erottuvat tarkkaan. Ne '
            + 'veisti ranskalainen Roberto Michel 1780-luvulla. Takana liehuu '
            + 'Espanjan lippu ja kohoaa vaalea palatsi.',
          lahde: 'Carlos Delgado, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Plaza de Cibeles',
        },
      ],
    },
    {
      id: 'rakennukset',
      nimi: 'Kadut ja talot',
      johdanto: 'Kaupungin läpi murrettiin katu hopeisella hakulla, ja palaneen '
        + 'linnan tilalle rakennettiin sellainen, joka ei voisi palaa.',
      nostot: [
        {
          otsikko: 'Katu, joka murrettiin talojen läpi',
          tiedosto: 'Derribo de casas para la apertura de la Gran Vía - 1912.jpg',
          teksti: 'Madridin vanhassa keskustassa kadut olivat kapeita ja '
            + 'mutkaisia, ja niiden läpi päätettiin murtaa yksi leveä. Työ '
            + 'alkoi 4. huhtikuuta 1910, kun kuningas Alfonso XIII löi '
            + 'hopeisella hakulla ensimmäisen reiän papin talon seinään San '
            + 'Josén kirkon vieressä. Ennen kuin Gran Vía oli valmis, oli '
            + 'purettu 312 taloa ja 48 katua kadonnut tai muuttunut toiseksi. '
            + 'Sisällissodassa katua sanottiin Kranaattikaduksi: sen '
            + 'korkeimman talon ylimmissä kerroksissa oli tähystyspaikka, ja '
            + 'tykit ampuivat sitä kohti.',
          selite: 'Gran Vían ensimmäistä osuutta rakennetaan vuonna 1912. '
            + 'Vasemmalla seisoo juuri valmistunut Metrópolis-talo, edessä on '
            + 'kasa hakattuja kivenlohkareita, ja ihmiset kävelevät paljaalla '
            + 'maalla siinä, missä oli ollut kortteleittain taloja.',
          lahde: 'Wikimedia Commons (PD)',
          wiki: 'Alfonso XIII',
        },
        {
          otsikko: 'Linna rakennettiin palamattomaksi',
          tiedosto: 'Real Alcázar de Madrid, unknown.jpg',
          teksti: 'Kuninkaiden vanha Alcázar-linna syttyi palamaan jouluaattona '
            + '1734, ja tuli tuhosi sen lähes kokonaan. Filip V käski '
            + 'rakentaa tilalle linnan, joka ei voisi palaa: seinät kiveä ja '
            + 'tiiltä, katot holvattuja, puuta vain ovissa, ikkunanpuitteissa '
            + 'ja kattotuoleissa. Työ alkoi 1738, ja ensimmäinen kuningas '
            + 'muutti sisään 1764. Kuninkaanlinna on 135 000 neliömetrillään '
            + 'Länsi-Euroopan suurin — silti kuningas ei asu siellä vaan '
            + 'pienemmässä talossa kaupungin laidalla.',
          selite: 'Vanha Alcázar noin vuonna 1710 tehdyssä kuvassa: pitkä '
            + 'julkisivu ikkunariveineen, keskellä kello ja vaakuna oven '
            + 'yllä, päädyissä jyrkkäkattoiset tornit. Rakennuksesta ei ole '
            + 'jäljellä mitään.',
          lahde: 'Wikimedia Commons (PD)',
          wiki: 'Palacio Real de Madrid',
        },
      ],
    },
  ],
  berliini: [
    {
      id: 'kaupunki',
      nimi: 'Berliini',
      johdanto: 'Suolle rakennettu kaupunki, joka jaettiin muurilla kahtia ja '
        + 'kasvoi yhteen uudelleen — historia näkyy täällä joka '
        + 'kadunkulmassa.',
      kansikuvat: [
        {
          tiedosto: 'Brandenburger Tor abends.jpg',
          selite: 'Brandenburgin portti iltavalossa. Portin päällä ajaa '
            + 'voitonjumalatar nelivaljakollaan — Napoleon vei sen '
            + 'sotasaaliiksi Pariisiin 1806, mutta se haettiin takaisin.',
          lahde: 'Thomas Wolf (foto-tw.de), Wikimedia Commons (CC BY-SA 3.0 DE)',
        },
        {
          tiedosto: 'Fernsehturm, Berlín, Alemania, 2016-04-22, DD 40-42 HDR.jpg',
          selite: 'Tv-torni Alexanderplatzilla on 368-metrisenä Saksan korkein '
            + 'rakennus. Itä-Saksa rakensi sen 1969 näkymään kaikkialle '
            + 'kaupunkiin.',
          lahde: 'Diego Delso, Wikimedia Commons (CC BY-SA 4.0)',
        },
        {
          tiedosto: 'East side gallery, Berlin Wall (Ank Kumar, Infosys Limited) 07.jpg',
          selite: 'East Side Gallery: 1,3 kilometriä muuria jätettiin pystyyn, ja '
            + '118 taiteilijaa 21 maasta maalasi siihen maailman pisimmän '
            + 'ulkoilmagallerian vuonna 1990.',
          lahde: 'Ank Kumar, Wikimedia Commons (CC BY-SA 4.0)',
        },
      ],
      nostot: [
        {
          otsikko: 'Gaertner maalasi Berliinin talo talolta',
          tiedosto: '1856 Gaertner Unter den Linden anagoria.JPG',
          teksti: 'Kun valokuvaa ei vielä ollut, Eduard Gaertner oli Berliinin '
            + 'kamera. Entinen posliininmaalari kiersi katuja ja maalasi ne '
            + 'niin tarkasti, että taloista voi laskea ikkunaruudut ja '
            + 'kylttien tekstit voi lukea. Kuningas osti hänen töitään, mutta '
            + 'Gaertner ei maalannut vain paraatinäkymiä: hänen kaduillaan '
            + 'korjataan kiveystä, koirat nuuskivat toisiaan ja pyykki kuivuu '
            + 'ikkunoissa. Juuri siksi hänen taulunsa ovat nyt tutkijoiden '
            + 'aarre — niistä nähdään, miltä kadonnut Berliini oikeasti '
            + 'näytti.',
          selite: 'Unter den Linden (1856): paraatikadun perällä häämöttää '
            + 'kuninkaanlinnan kupoli, oikealla Fredrik Suuren '
            + 'ratsastajapatsas.',
          lahde: 'Eduard Gaertner, Wikimedia Commons (Public domain)',
          wiki: 'Unter den Linden',
          galleria: [
            {
              otsikko: 'Klosterstraße',
              tiedosto: 'Eduard Gaertner Berlin Klosterstrasse 1830.jpg',
              selite: 'Klosterstraße (1830). Ukkospilvet kasaantuvat '
                + 'vanhankaupungin ylle; kadun perällä kohoaa '
                + 'Parochialkirchen torni.',
              lahde: 'Eduard Gaertner, Wikimedia Commons (Public domain)',
            },
            {
              otsikko: 'Parochialstraße',
              tiedosto: 'Eduard Gaertner - Die Parochialstraße - Google Art Project.jpg',
              selite: 'Parochialstraße (1831). Katutyömaa käynnissä: miehet '
                + 'latovat kiveystä, kauppiaan kupariastiat roikkuvat '
                + 'kylttinä ja koirat hoitavat omia asioitaan.',
              lahde: 'Eduard Gaertner, Wikimedia Commons (Public domain)',
            },
            {
              otsikko: 'Schloßfreiheit',
              tiedosto: 'Eduard Gaertner - Rear view of the Houses at Schloßfreiheit - Google Art Project.jpg',
              selite: 'Talojen takapihat Schloßfreiheitin rannassa (1855) — '
                + 'arkinen puoli, jota varten kukaan muu ei pystyttänyt '
                + 'maalaustelinettä. Takana kuninkaanlinnan kappelin kupoli.',
              lahde: 'Eduard Gaertner, Wikimedia Commons (Public domain)',
            },
            {
              otsikko: 'Friedrichsgracht',
              tiedosto: 'Eduard Gaertner (1801-1877) - The Friedrichsgracht, Berlin - NG6524 - National Gallery.jpg',
              selite: 'Friedrichsgracht kattojen yli nähtynä: proomut lastaavat '
                + 'kanavassa. Berliini oli 1800-luvulla myös satamakaupunki.',
              lahde: 'Eduard Gaertner, Wikimedia Commons (Public domain)',
            },
            {
              otsikko: 'Kuninkaallinen ooppera',
              tiedosto: 'Eduard Gaertner - Ansicht der Königlichen Oper und Unter den Linden, Berlin (1845).jpg',
              selite: 'Kuninkaallinen ooppera iltahämärässä (1845). Sama talo '
                + 'seisoo Unter den Lindenillä yhä, ja siellä lauletaan '
                + 'edelleen.',
              lahde: 'Eduard Gaertner, Wikimedia Commons (Public domain)',
            },
          ],
        },
        {
          otsikko: 'Hattupäinen ukkeli sai jäädä',
          tiedosto: 'Ampelmännchen go.jpg',
          teksti: 'Liikennepsykologi Karl Peglau piirsi vuonna 1961 Itä-Saksalle '
            + 'oman jalankulkuvalon: leveä hahmo hattuineen erottuu kauas, '
            + 'koska valopintaa on paljon. Ensimmäiset syttyivät '
            + 'Itä-Berliinissä 1969. Kun Saksat yhdistyivät, ukkelia alettiin '
            + 'vaihtaa lännen tikku-ukkoon — kunnes kansalaiskampanja '
            + '"Pelastakaa Ampelmännchen" nousi vastaan ja voitti. Nykyään '
            + 'hattupäinen ukkeli ohjaa kulkijoita myös monessa '
            + 'Länsi-Berliinin risteyksessä, ja siitä on tullut koko '
            + 'kaupungin maskotti, jota myydään matkamuistona.',
          selite: 'Vihreä Ampelmännchen Berliinissä. Taustalla Keisari Vilhelmin '
            + 'muistokirkon torso, joka jätettiin pommituksissa saamaansa '
            + 'asuun muistutukseksi sodasta.',
          lahde: 'Wikimedia Commons (CC0)',
          wiki: 'Ampelmännchen',
        },
        {
          otsikko: 'Tyttö Schönebergistä lauloi maailman ympäri',
          tiedosto: 'My Child Speaks Marlene Dietrich 1930, Erich Salomon.jpg',
          teksti: 'Marlene Dietrich syntyi 1901 Schönebergin kaupunginosassa ja '
            + 'nousi maailmantähdeksi berliiniläisen elokuvan Sininen enkeli '
            + '(1930) myötä — samana vuonna hän muutti Hollywoodiin. Kun '
            + 'natsihallinto houkutteli häntä takaisin mainoskasvokseen, hän '
            + 'kieltäytyi, otti Yhdysvaltain kansalaisuuden ja lauloi sen '
            + 'sijaan rintamalla sotilaille — tunnetuimpana laulun Lili '
            + 'Marleen, jota kuunneltiin juoksuhaudoissa molemmin puolin. '
            + 'Berliiniin hän palasi viimeisen kerran arkussa: hauta on '
            + 'Schönebergissä, äidin haudan vieressä.',
          selite: 'Marlene Dietrich soittaa Hollywoodista Berliiniin tyttärelleen '
            + '1930. Yöpöydällä tyttären valokuva — Erich Salomonin kuuluisa '
            + 'otos.',
          lahde: 'Erich Salomon, Wikimedia Commons (Public domain)',
          wiki: 'Marlene Dietrich',
          musiikki: 'https://music.apple.com/fi/album/lili-marleen/724182416?i=724182571',
          musiikkiNimi: 'Marlene Dietrichin lauluja Apple Musicissa',
          esikuuntelu: 'Marlene Dietrich Lili Marleen',
        },
      ],
    },
    {
      id: 'rakennukset',
      nimi: 'Tornit ja torit',
      johdanto: 'Syksyllä 1969 Alexanderplatzille valmistui neljän päivän välein '
        + 'kaksi asiaa: kello, joka näyttää maailman ajat, ja torni, joka '
        + 'näkyy kaikkialle kaupunkiin.',
      nostot: [
        {
          otsikko: 'Aurinko piirsi torniin ristin',
          tiedosto: 'The Pope\'s Revenge.jpg',
          teksti: 'Itä-Saksa rakensi televisiotornin vuosina 1965–1969 ja vihki '
            + 'sen käyttöön 3. lokakuuta 1969. Tornin pallo koottiin maassa '
            + '120 teräslohkosta ja nostettiin vasta sitten betonipylvään '
            + 'päähän. Sen jälkeen tapahtui jotain, mitä kukaan ei ollut '
            + 'piirtänyt kuviin: kun aurinko osuu kiiltävään palloon, '
            + 'heijastus muodostaa ristin. Valtio oli virallisesti '
            + 'uskonnoton, joten muurin länsipuolella keksittiin ilmiölle '
            + 'nimi — paavin kosto. Nimi jäi.',
          selite: 'Tornin pallo läheltä. Auringonvalo heijastuu teräslevyistä '
            + 'niin, että pintaan syttyy vaalea risti: pystyjuova ylhäältä '
            + 'alas ja sen poikki leveämpi vaakanauha.',
          lahde: 'Tobi85, Wikimedia Commons (Public domain)',
          wiki: 'Berliinin televisiotorni',
          galleria: [
            {
              otsikko: 'Työmaa toukokuussa 1968',
              tiedosto: 'Bundesarchiv Bild 183-G0521-0005-001, Berlin, Fernsehturm, Bau.jpg',
              selite: 'Kaksi kypäräpäistä miestä työskentelee tornin rungon '
                + 'reunalla. Alhaalla mutkittelee Spree ja kaupungin kattoja; '
                + 'miesten välissä on teräspalkki ja köysi.',
              lahde: 'Hans-Joachim Spremberg, Bundesarchiv / Wikimedia Commons (CC BY-SA 3.0 DE)',
            },
          ],
        },
        {
          otsikko: 'Kelloa pyöritti Trabantin vaihteisto',
          tiedosto: 'Urania-Weltzeituhr auf dem Alexanderplatz in Berlin 2015.jpg',
          teksti: 'Muutama päivä ennen tornia, 30. syyskuuta 1969, samalle '
            + 'aukiolle pystytettiin kymmenmetrinen maailmankello. Erich '
            + 'Johnin suunnittelemassa alumiinirummussa on 24 sivua, yksi '
            + 'jokaista aikavyöhykettä kohti, ja niihin on jyrsitty 146 '
            + 'paikannimeä Reykjavíkista Kinshasaan. Rummun ympäri kiertää '
            + 'tuntirengas, ja katolla pyörii kerran minuutissa pieni '
            + 'aurinkokunta. Koneisto on kadun alla kellarissa, ja '
            + 'tuntirengasta pyöritti Trabantista purettu vaihteisto.',
          selite: 'Maailmankello aukiolla. Rummun kylkiin on jyrsitty kaupunkien '
            + 'nimiä, sen ympäri kiertää värillinen tuntirengas ja päällä '
            + 'pyörii teräsrenkaista koottu aurinkokunta pikkupalloineen. '
            + 'Alhaalla ohittaa pyöräilijöitä.',
          lahde: 'Christian Wolf (www.c-w-design.de), Wikimedia Commons (CC BY-SA 3.0 DE)',
          wiki: 'Alexanderplatz',
          galleria: [
            {
              otsikko: 'Nimet lähietäisyydeltä',
              tiedosto: 'Weltzeituhr Detail Alexanderplatz.jpg',
              selite: 'Rummun kylki lähikuvassa: nimirivejä kuten REYKJAVIK, '
                + 'DUBLIN, LONDON ja OSLO, KOPENHAGEN, WIEN, ROM, TUNIS, '
                + 'KINSHASA, ja niiden alla isot oranssit tuntinumerot 10–17.',
              lahde: 'Gryffindor, Wikimedia Commons (Public domain)',
            },
          ],
        },
      ],
    },
    {
      id: 'arki',
      nimi: 'Arki ja kadut',
      johdanto: 'Kaupungin oma katuruoka syntyi ketsupista, jota idän puolella ei '
        + 'saanut — ja kaupasta, jonka valo palaa, kun kaikki muut ovat '
        + 'kiinni.',
      nostot: [
        {
          otsikko: 'Currywurst keksittiin kadunkulmassa',
          tiedosto: 'Currywurst-1.jpg',
          teksti: 'Herta Heuwer piti kioskia Charlottenburgissa Kantstraßen ja '
            + 'Kaiser-Friedrich-Straßen kulmassa. Hän kertoi sekoittaneensa '
            + '4. syyskuuta 1949 tomaatista ja mausteista kastikkeen, '
            + 'kaataneensa sen paistetun makkaran päälle ja ripotelleensa '
            + 'vielä currya pinnalle. Ainekset hän oli saanut '
            + 'brittisotilailta. Kastikkeen hän rekisteröi 1959 nimellä '
            + 'Chillup — chilistä ja ketsupista. Kulmassa on nykyään hänen '
            + 'muistolaattansa.',
          selite: 'Berliiniläinen currywurst pahvivadissa: paloiteltu makkara, '
            + 'punaista kastiketta, päällä currymaustetta ja pystyssä pieni '
            + 'sininen muovihaarukka.',
          lahde: 'Rainer Zenz, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Currywurst',
          galleria: [
            {
              otsikko: 'Idän puolella keitettiin oma kastike',
              tiedosto: 'MitteKonnopke.jpg',
              selite: 'Jono Konnopken kioskin luukulla metrosillan alla. Kyltissä '
                + 'lukee Konnopke’s Imbiß ja "über 80 Jahre". Kioski aloitti '
                + 'samassa kulmassa 1930; idässä ketsuppia ei saanut, joten '
                + 'perhe keitti kastikkeensa itse.',
              lahde: 'Fridolin freudenfett (Peter Kuley), Wikimedia Commons (CC BY-SA 3.0)',
            },
          ],
        },
        {
          otsikko: 'Puoti, joka on auki kun muut ovat kiinni',
          tiedosto: 'Spätkauf Late Night Shop.jpg',
          teksti: 'Saksassa kaupat sulkeutuvat illalla aikaisin ja sunnuntaisin '
            + 'kokonaan. Berliinissä on silti melkein joka korttelissa pieni '
            + 'puoti, jonka valo palaa myöhään: Späti. Nimi tulee sanasta '
            + 'spät, myöhään. Itä-Berliinissä avattiin 1950-luvulla '
            + 'vuorotyöläisiä varten spätverkaufsstelle-kauppoja, ja '
            + 'länsipuolella samanlaisia alettiin 1980-luvulla kutsua nimellä '
            + 'Spätkauf. Lyhennys Späti otettiin Duden-sanakirjaan vuonna '
            + '2017.',
          selite: 'Keltainen kilpi talon seinässä. Siinä lukee isoin punaisin '
            + 'kirjaimin SPÄTKAUF ja sen alla pienemmällä LATE NIGHT SHOP.',
          lahde: 'ChickSR, Wikimedia Commons (CC BY-SA 4.0)',
          galleria: [
            {
              otsikko: 'Puoti Kaiserdammilla',
              tiedosto: 'Späti Berlin-Kaiserdamm.jpg',
              selite: 'Spätin ovi ja näyteikkuna. Kyltissä lukee SPÄTI, ikkunan '
                + 'reunassa on lista tavaroista — juomia, jäätelöä, makeisia, '
                + 'lehtiä — ja hyllyt ovat täynnä purkkeja.',
              lahde: 'Jeuwre, Wikimedia Commons (CC BY-SA 4.0)',
            },
          ],
        },
      ],
    },
  ],
  venetsia: [
    {
      id: 'kaupunki',
      nimi: 'Venetsia',
      johdanto: 'Kaupunki, joka päätti rakentaa itsensä veteen — ja teki '
        + 'mahdottomasta tunnusmerkkinsä.',
      kansikuvat: [
        {
          tiedosto: 'Aerial photographs of Venice 2013, Anton Nossik, 045.jpg',
          selite: 'Markuksentori ja dogen palatsi ilmasta — koko kaupunki seisoo '
            + 'keskellä laguunia.',
          lahde: 'Anton Nosik, Wikimedia Commons (CC BY 3.0)',
        },
        {
          tiedosto: 'Canal Grande Chiesa della Salute e Dogana dal ponte dell Accademia.jpg',
          selite: 'Canal Grande ja Santa Maria della Saluten kupolit Accademian '
            + 'sillalta.',
          lahde: 'Wolfgang Moroder, Wikimedia Commons (CC BY-SA 3.0)',
        },
        {
          tiedosto: 'Rialto Gondoliers.jpg',
          selite: 'Rialton silta on ylittänyt pääkanavan yli neljäsataa vuotta.',
          lahde: 'Saffron Blaze, Wikimedia Commons (CC BY-SA 3.0)',
        },
      ],
      nostot: [
        {
          otsikko: 'Canaletto maalasi kaupunkinsa',
          tiedosto: 'Canal, Giovanni Antonio (Canaletto) - Return of the Bucentoro to the Molo on Ascension Day, c. 1733-4. Royal Collection Buckingham Palace.jpg',
          teksti: 'Venetsialainen Canaletto maalasi 1700-luvulla kaupunkinsa '
            + 'näkymiä niin tarkasti, että tutkijat käyttävät niitä yhä '
            + 'lähteinä. Maalauksia ostivat etenkin englantilaiset '
            + 'matkailijat muistoksi suurelta Euroopan-kiertueeltaan.',
          selite: 'Bucintoron paluu Molon rantaan helatorstaina (n. 1733): dogen '
            + 'kullattu juhlalaiva palaa seremoniasta, jossa Venetsia '
            + '"vihittiin" merensä kanssa heittämällä sormus aaltoihin. '
            + 'Taustalla dogen palatsi ja kellotorni — näkymä on sama '
            + 'tänäänkin.',
          lahde: 'Canaletto, Wikimedia Commons (PD)',
          wiki: 'Canaletto',
          galleria: [
            {
              otsikko: 'Kivenhakkaajien piha',
              tiedosto: 'Canaletto - The Stonemason\'s Yard.jpg',
              selite: 'Kivenhakkaajien piha (n. 1725): Campo San Vidalilla '
                + 'veistetään kiveä kirkon korjaustöihin. Harvinainen näkymä '
                + 'arjen Venetsiasta — ei juhlaa vaan työtä, pyykkinaruja ja '
                + 'leikkiviä lapsia.',
              lahde: 'Canaletto, Wikimedia Commons (PD)',
            },
            {
              otsikko: 'Markuksentori',
              tiedosto: 'Canaletto - The Piazza San Marco in Venice - Google Art Project.jpg',
              selite: 'Markuksentori (n. 1724): basilika ja kellotorni nuoren '
                + 'Canaletton siveltimellä. Kauppiaiden kojut täyttävät torin '
                + '— se oli silloinkin kaupungin olohuone.',
              lahde: 'Canaletto, Wikimedia Commons (PD)',
            },
            {
              otsikko: 'Canal Granden suu',
              tiedosto: 'Canaletto - The Entrance to the Grand Canal, Venice - Google Art Project.jpg',
              selite: 'Canal Granden suu ja Santa Maria della Saluten '
                + 'kupolikirkko (n. 1730). Kirkko rakennettiin kiitokseksi '
                + 'ruton väistymisestä, ja sen portaille kuljetaan yhä joka '
                + 'marraskuu siltaa pitkin juhlimaan.',
              lahde: 'Canaletto, Wikimedia Commons (PD)',
            },
            {
              otsikko: 'Regatta Canal Grandella',
              tiedosto: 'Canal, Giovanni Antonio Canal - Venice, A Regatta on the Grand Canal - National Gallery NG938.jpg',
              selite: 'Regatta Canal Grandella (n. 1740): kevyet kilpagondolat '
                + 'kiitävät väkijoukon editse, ja parvekkeet on verhoiltu '
                + 'juhlakankain. Sama soutukilpailu soudetaan Venetsiassa yhä '
                + 'joka syksy.',
              lahde: 'Canaletto, Wikimedia Commons (PD)',
            },
            {
              otsikko: 'Rio dei Mendicanti',
              tiedosto: 'Ca\' Rezzonico - Il rio dei Mendicanti - Canaletto.jpg',
              selite: 'Rio dei Mendicanti (n. 1723): varhainen Canaletto '
                + 'sivukanavan varrelta. Ikkunoissa kuivuu pyykkiä ja '
                + 'rannassa korjataan veneitä — tavallista Venetsiaa ilman '
                + 'juhlapukua.',
              lahde: 'Didier Descouens, Wikimedia Commons (CC BY-SA 4.0)',
            },
          ],
        },
        {
          otsikko: 'Cicchetti ja Rialton tori',
          tiedosto: 'Pescaria Rialto Venice.jpg',
          teksti: 'Venetsialaiset syövät cicchettejä — pieniä suupaloja — seisten '
            + 'bacaro-baarien tiskillä, ja viinilasillista kutsutaan nimellä '
            + 'ombra, varjo. Raaka-aineet tulevat Rialton torilta, jossa '
            + 'laguunin kalaa on myyty satojen vuosien ajan.',
          selite: 'Rialton kalatorin pylväshalli Canal Granden varrella. Kauppa '
            + 'käy aamuisin: laguunin ja Adrianmeren kalat ja äyriäiset '
            + 'tuodaan suoraan veneillä hallin laituriin.',
          lahde: 'Wolfgang Moroder, Wikimedia Commons (CC BY-SA 3.0)',
        },
        {
          otsikko: 'Vivaldi, punainen pappi',
          tiedosto: 'Antonio Vivaldi.jpg',
          teksti: 'Antonio Vivaldi — punatukkainen pappi, il Prete Rosso — opetti '
            + 'viulunsoittoa venetsialaisessa tyttöjen orpokodissa ja sävelsi '
            + 'sen orkesterille satoja konserttoja. Kuuluisin on Neljä '
            + 'vuodenaikaa, jossa musiikista voi kuulla linnunlaulun ja '
            + 'ukkosmyrskyn.',
          selite: 'Ainoa varma Vivaldin muotokuva: François Morellon la Caven '
            + 'kaiverrus vuodelta 1725. Säveltäjä pitelee nuottivihkoa — '
            + 'peruukin alla hehkui lempinimen antanut punainen tukka.',
          lahde: 'François Morellon la Cave, Wikimedia Commons (PD)',
          wiki: 'Antonio Vivaldi',
          musiikki: 'https://music.apple.com/fi/artist/antonio-vivaldi/242604',
          musiikkiNimi: 'Antonio Vivaldi Apple Musicissa',
          musiikkiNayte: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/f/ff/Vivaldi_-_Four_Seasons_1_Spring_mvt_1_Allegro_-_John_Harrison_violin.oga/Vivaldi_-_Four_Seasons_1_Spring_mvt_1_Allegro_-_John_Harrison_violin.oga.mp3',
          musiikkiNayteNimi: 'Vivaldi: Kevät, 1. osa — John Harrison, viulu (CC BY-SA)',
        },
      ],
    },
    {
      id: 'rakennukset',
      nimi: 'Kaupunki veden varassa',
      johdanto: 'Talot eivät seiso kalliolla vaan miljoonien puunrunkojen päällä — '
        + 'ja meri käy joka syksy tarkistamassa, pitävätkö ne yhä.',
      nostot: [
        {
          otsikko: 'Kaupunki seisoo puunrunkojen päällä',
          tiedosto: 'A canal in Venice being drained and cleaned using a Decauville railway.jpg',
          teksti: 'Venetsian talot eivät seiso kalliolla vaan puussa. Rakentajat '
            + 'löivät laguunin mutaan tiheät rivit lepän runkoja, kunnes '
            + 'paalut ylsivät alla olevaan kovaan savikerrokseen. Paalujen '
            + 'päälle ladottiin istrialaisia kalkkikivilaattoja ja vasta '
            + 'niiden päälle tiilet. Mudassa ei ole happea, joten puu ei '
            + 'lahoa vaan kovettuu vuosisatojen kuluessa. Santa Maria della '
            + 'Saluten kirkkoa varten mutaan lyötiin yli miljoona paalua.',
          selite: 'Venetsialainen kanava vuonna 1956: molemmat päät on padottu, '
            + 'vesi pumpattu pois ja miehet lapioivat pohjan mutaa vaunuihin. '
            + 'Oikeassa reunassa kulkee kapearaiteinen kisko, jota pitkin '
            + 'vaunut työnnetään pois, ja takana kaartuu kivisilta. Kanavia '
            + 'tyhjennetään yhä, sillä vain kuivalla pohjalla talojen '
            + 'perustuksia pääsee korjaamaan.',
          lahde: 'Tuntematon valokuvaaja 1956, Wikimedia Commons (PD-Italy)',
          wiki: 'Venetsia',
        },
        {
          otsikko: 'Portit nousevat merenpohjasta',
          tiedosto: 'Venedig Acqua alta-4496.jpg',
          teksti: 'Kun syksyn tuuli työntää Adrianmerta laguunia kohti, vesi '
            + 'nousee kaduille. Ilmiön nimi on acqua alta, korkea vesi. '
            + 'Korkein mitattu oli 194 senttiä 4. marraskuuta 1966, ja '
            + 'kaupunki varoittaa siitä sireeneillä: mitä useamman kerran '
            + 'sireeni soi, sitä korkeammalle vesi nousee. Lokakuusta 2020 '
            + 'alkaen suojana on ollut MOSE, 78 terästulvaporttia laguunin '
            + 'kolmen suuaukon pohjassa.',
          selite: 'Mies kävelee märkää kujaa pitkin reisisaappaissa marraskuussa '
            + '2019: mustassa takissa, sateenvarjo kädessä ja vihreä '
            + 'verkkokassi olalla. Vieressä on tiiliseinä, jonka alaosan '
            + 'rappaus on lohkeillut suolaisen veden syövyttämänä. Acqua '
            + 'altan aikaan saappaat ovat venetsialaisen tavallinen työasu.',
          lahde: 'GodeNehler, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Venetsian laguuni',
          galleria: [
            {
              otsikko: 'Näin portti nousee',
              tiedosto: '03 movimento paratoie.jpg',
              selite: 'Kolme piirrosta MOSE-portin liikkeestä. Ylinnä portti '
                + 'makaa merenpohjan betonikotelossa vedellä täytettynä. '
                + 'Keskellä siihen puhalletaan paineilmaa (musta nuoli), vesi '
                + 'työntyy ulos (valkoinen nuoli) ja portti kääntyy saranansa '
                + 'varassa ylös. Alinna portti seisoo pystyssä ja erottaa '
                + 'laguunin (laguna) merestä (mare). Nousuun menee noin puoli '
                + 'tuntia.',
              lahde: 'Magistrato alle Acque di Venezia — Consorzio Venezia Nuova, Wikimedia Commons (CC BY-SA 3.0)',
            },
          ],
        },
      ],
    },
    {
      id: 'kasityo',
      nimi: 'Käsityö',
      johdanto: 'Saari, jonne lasinpuhaltajat karkotettiin tulipalon pelossa, ja '
        + 'vene, joka on tahallaan vino.',
      nostot: [
        {
          otsikko: 'Lasinpuhaltajat karkotettiin saarelle',
          tiedosto: 'Glass blowing in the Murano island (14023312236).jpg',
          teksti: 'Vuonna 1291 Venetsian tasavalta määräsi kaikki lasinpuhaltajat '
            + 'siirtämään uuninsa Muranon saarelle. Syy oli pelko: lasi sulaa '
            + 'vasta yli tuhannen asteen kuumuudessa, ja uunit paloivat '
            + 'keskellä kaupunkia, jonka talot olivat suureksi osaksi puuta. '
            + 'Muranossa mestarit saivat erikoisoikeuksia — jopa luvan kantaa '
            + 'miekkaa — mutta tasavallasta heidän ei ollut lupa lähteä. '
            + 'Lasin valmistustapa oli valtionsalaisuus.',
          selite: 'Lasimestari istuu työpenkin ääressä ja muotoilee raudan päässä '
            + 'hehkuvaa oranssia lasia pieneksi hevoseksi. Penkin reunalla on '
            + 'rivi pihtejä ja saksia, edessä lattialla puinen '
            + 'muotoilupölkky. Muranossa esineet tehdään yhä käsin ilman '
            + 'muotteja.',
          lahde: 'Miguel Mendez, Wikimedia Commons (CC BY 2.0)',
          wiki: 'Murano',
          galleria: [
            {
              otsikko: 'Uunin suu',
              tiedosto: 'Italy-1453 - Murano Glass (5228946002).jpg',
              selite: 'Muranolaisen uunin aukko hehkuu keltaisena kuin pieni '
                + 'aurinko. Aukon keskellä näkyy pyörivän raudan päässä '
                + 'lasimalja, jota kuumennetaan uudelleen pehmeäksi. Alhaalla '
                + 'lepää kolme punahehkuista lasitankoa.',
              lahde: 'Dennis G. Jarvis, Wikimedia Commons (CC BY-SA 2.0)',
            },
          ],
        },
        {
          otsikko: 'Gondoli on tahallaan vino',
          tiedosto: 'Forcola da pope su gondola.jpg',
          teksti: 'Gondoli ei ole symmetrinen: sen vasen kylki on oikeaa '
            + 'leveämpi. Vinous on tarkoituksellista. Soutaja seisoo perässä '
            + 'ja soutaa yhdellä airolla veneen oikealta puolelta, ja vino '
            + 'runko kumoaa kaarron, jonka yksi airo muuten aiheuttaisi. Vene '
            + 'on noin 10,85 metriä pitkä, painaa 350 kiloa ja kootaan 280 '
            + 'osasta kahdeksaa eri puulajia. Näin jyrkäksi vinous kehittyi '
            + 'vasta 1900-luvun alussa.',
          selite: 'Veistetty puinen forcola eli hankain nousee veneen laidalta, '
            + 'ja airo lepää sen ylimmässä lovessa. Lovia on useita eri '
            + 'soutuotteita varten, eikä forcolaa ole kiinnitetty mihinkään — '
            + 'se nostetaan pois soudun jälkeen. Kuvan vene on kirkkaan '
            + 'sininen: tavallinen gondoli on musta, ja vain kilpaveneet ovat '
            + 'värikkäitä.',
          lahde: 'Kevin Lucich, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Gondoli',
          galleria: [
            {
              otsikko: 'Keulan kampa',
              tiedosto: 'Gondola ferro di prua.jpg',
              selite: 'Gondolin keulan metallinen ferro vihreää kanavavettä '
                + 'vasten: leveä kaareva terä, jonka alla on kuusi eteenpäin '
                + 'osoittavaa piikkiä. Ferro ei ole pelkkä koriste vaan '
                + 'raskas vastapaino perässä seisovalle soutajalle, jotta '
                + 'veneen litteä pohja pysyisi vaakasuorassa.',
              lahde: 'Adriano, Wikimedia Commons (CC BY-SA 3.0)',
            },
          ],
        },
      ],
    },
  ],
  tukholma: [
    {
      id: 'kaupunki',
      nimi: 'Tukholma',
      johdanto: 'Neljäntoista saaren pääkaupunki, jossa vesi on katua ja kaupungin '
        + 'laidalta lähtee höyrylaiva kolmenkymmenentuhannen saaren '
        + 'saaristoon.',
      kansikuvat: [
        {
          tiedosto: 'Riddarholmen (by Pudelek).JPG',
          selite: 'Riddarholmen Riddarfjärdenin takaa. Terävä valurautainen torni '
            + 'kuuluu Riddarholmenin kirkolle, jonne Ruotsin kuninkaat '
            + 'haudattiin 1600-luvulta 1950-luvulle.',
          lahde: 'Pudelek, Wikimedia Commons (CC BY-SA 4.0)',
        },
        {
          tiedosto: 'Julmarknad på Stortorget, Gamla stan, Stockholm, 2017b.jpg',
          selite: 'Joulutori Stortorgetilla, Gamla stanin keskusaukiolla. Kapeat '
            + 'talot ovat 1600-luvulta, ja niiden erikokoiset ikkunat '
            + 'kertovat, että jokainen rakensi omaan tahtiinsa.',
          lahde: 'Bysmon, Wikimedia Commons (CC BY-SA 4.0)',
        },
        {
          tiedosto: 'Storskär August 2015 05.jpg',
          selite: 'Höyrylaiva Storskär ohittaa Vaxholmin linnoituksen. Laiva on '
            + 'vuodelta 1908 ja kulkee yhä saaristoreittiä kesäisin — sen '
            + 'koneet ovat alkuperäiset.',
          lahde: 'Arild Vågen, Wikimedia Commons (CC BY-SA 4.0)',
        },
      ],
      nostot: [
        {
          otsikko: 'Martin piirsi Tukholman ennen valokuvaa',
          tiedosto: 'Stockholmspanorama 1790.jpg',
          teksti: 'Elias Martin oppi ammattinsa Lontoossa, jossa hän asui '
            + 'kaksitoista vuotta ja opetteli akvatinnan — tekniikan, jolla '
            + 'kuparilevystä saa vesivärimäisen sävyn. Kotiin palattuaan 1780 '
            + 'hän kääntyi kaupunkiin, jota kukaan ei ollut piirtänyt '
            + 'sellaisenaan: satamaan, toreille ja työn ääreen. Veli Johan '
            + 'Fredrik kaiversi kuvat levyiksi, ja niitä myytiin sarjoina. Ne '
            + 'ovat tarkin näkymä Tukholmaan ennen valokuvaa.',
          selite: 'Näkymä Tukholmaan Mosebackelta Södermalmilta noin 1790. '
            + 'Kirkontornien takana laivoja on ankkurissa niin tiheässä, että '
            + 'masto peittää maston.',
          lahde: 'Elias Martin, Wikimedia Commons (PD)',
          wiki: 'Elias Martin',
          galleria: [
            {
              otsikko: 'Drottninggatan',
              tiedosto: 'Elias Martin - Street in Stockholm (Drottninggatan) - A II 868 - Finnish National Gallery.jpg',
              selite: 'Drottninggatan matalien puutalojen aikaan. Katu on yhä '
                + 'samassa paikassa, mutta nykyään se on kävelykatu ja talot '
                + 'ovat kivestä.',
              lahde: 'Elias Martin, Wikimedia Commons (PD)',
            },
            {
              otsikko: 'Näkymä Mälarenille',
              tiedosto: 'Southern shore of Lake Mälaren in Stockholm, Sweden (25413579586).jpg',
              selite: 'Mälarenin eteläranta Söderin sulun kohdalta. Purjeveneet '
                + 'toivat kaupunkiin polttopuuta, viljaa ja rautaa sisämaan '
                + 'järviltä.',
              lahde: 'Elias Martin / Riksantikvarieämbetet, Wikimedia Commons (PD)',
            },
            {
              otsikko: 'Rautavaaka',
              tiedosto: '"Järnvågen" - "The Iron Weighing Scale" in Stockholm, Sweden (25969387273).jpg',
              selite: 'Järnvågen eli rautavaaka, jossa punnittiin kaikki '
                + 'Ruotsista ulos lähtenyt tankorauta. Rauta oli maan tärkein '
                + 'vientitavara, ja se kulki tämän pihan kautta.',
              lahde: 'Elias Martin / Riksantikvarieämbetet, Wikimedia Commons (PD)',
            },
            {
              otsikko: 'Skeppsbron portaat',
              tiedosto: 'The steps on Skeppsbro etching by Elias Martin.jpg',
              selite: 'Skeppsbron portaat, joita myöten tavara nostettiin '
                + 'veneistä maihin. Etiketti puuttuu: kuvassa tehdään työtä, '
                + 'ei poseerata.',
              lahde: 'Elias Martin, Wikimedia Commons (PD)',
            },
          ],
        },
        {
          otsikko: 'Maailman pisin taidenäyttely',
          tiedosto: 'Tunnelbana T-Centralen Blue Line (43481298780).jpg',
          teksti: 'Tukholman metrossa on noin sata asemaa, ja niistä yli '
            + 'yhdeksälläkymmenellä on taidetta: maalauksia, veistoksia, '
            + 'mosaiikkeja ja reliefejä yli 150 taiteilijalta. Sinisen linjan '
            + 'asemat louhittiin syvälle kallioon, eikä louhittua pintaa '
            + 'peitetty laatoilla — se ruiskubetonoitiin ja maalattiin '
            + 'sellaisenaan, joten aseman seinä on kirjaimellisesti vuori. '
            + 'Tavallinen matkalippu kelpaa koko näyttelyyn.',
          selite: 'T-Centralenin sinisen linjan laituri. Per Olof Ultvedt maalasi '
            + '1975 karkeaan kallioon siniset köynnökset — rauhallinen väri '
            + 'valittiin kaupungin vilkkaimmalle vaihtoasemalle.',
          lahde: 'Sonse, Wikimedia Commons (CC BY 2.0)',
          wiki: 'Tukholman metro',
        },
        {
          otsikko: 'Laiva, joka upposi ja nousi',
          tiedosto: 'Lateral view of the Vasa ship, Vasa Museum, Stockholm, Sweden julesvernex2.jpg',
          teksti: 'Kuninkaan ylpeys, sotalaiva Vasa, lähti neitsytmatkalleen '
            + 'Tukholman satamasta 10. elokuuta 1628 — ja kaatui ensimmäiseen '
            + 'kunnon tuulenpuuskaan ehdittyään noin kilometrin. Laiva oli '
            + 'rakennettu liian kapeaksi ja korkeaksi, ja vesi ryntäsi sisään '
            + 'avoimista tykkiporteista. Vasa makasi sataman pohjamudassa 333 '
            + 'vuotta, kunnes se nostettiin 1961 lähes ehjänä: Itämeren '
            + 'vähäsuolainen vesi oli pitänyt laivamadot loitolla. Nykyään '
            + 'alus seisoo omassa museossaan yhä valtaosin alkuperäisenä '
            + 'puuna, ja Vasa-museo on koko Pohjolan suosituimpia museoita.',
          selite: 'Vasan kylkeä Vasa-museossa. Juuri nämä tykkiportit upottivat '
            + 'laivan: alin porttirivi painui kallistuksessa veden alle.',
          lahde: 'Jules Verne Times Two, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Vasa (laiva)',
        },
      ],
    },
    {
      id: 'rakennukset',
      nimi: 'Kadut ja sulut',
      johdanto: 'Tukholma rakennettiin kapeikkoon, jossa järvi purkautuu mereen — '
        + 'siksi täällä nostetaan veneitä sulussa ja kapein kuja on 90 '
        + 'senttiä leveä.',
      nostot: [
        {
          otsikko: 'Polhem sai sulkutyön 83-vuotiaana',
          tiedosto: 'Blå slussen Cumelin.jpg',
          teksti: 'Mälaren on järvi, jonka pinta on merenpintaa korkeammalla, ja '
            + 'Tukholma seisoo juuri siinä kohdassa, jossa vesi purkautuu '
            + 'Itämereen. Ennen sulkuja veneet piti sauvoa ja hinata virran '
            + 'läpi maksua vastaan, ja moni ajoi matalikolle. Ensimmäisen '
            + 'sulun rakensivat hollantilaiset mestarit kuningatar Kristiinan '
            + 'aikaan, ja se valmistui 1642. Kun siitä tuli liian pieni, työ '
            + 'annettiin 1744 Christopher Polhemille, joka oli silloin '
            + '83-vuotias. Hän kuoli kesken hankkeen, ja poika Gabriel sai '
            + 'sulun valmiiksi 1755.',
          selite: 'Polhemin sulku noin vuonna 1800. Sinisen nostosillan yli '
            + 'kulkee hevoskärry, sulkukanavassa on kiinni purjevene ja '
            + 'taustalla nousee laivojen mastoja.',
          lahde: 'Johan Petter Cumelin, Wikimedia Commons (PD)',
          wiki: 'Christopher Polhem',
          galleria: [
            {
              otsikko: 'Sulku vuonna 2005',
              tiedosto: 'Slussning i Slussen Stockholm 01 2005-08-09.JPG',
              selite: 'Vene odottaa sulussa liikenneramppien alla vuonna 2005 — '
                + 'ylhäällä ajaa punainen bussi. Tämä Slussen purettiin 2016, '
                + 'ja uuden sulun on määrä avautua veneille 2027.',
              lahde: 'Jordgubbe, Wikimedia Commons (CC BY-SA 2.0)',
            },
          ],
        },
        {
          otsikko: 'Kuja, jonne mahtuu yksi kerrallaan',
          tiedosto: 'M Trotzigs gränd 2013.jpg',
          teksti: 'Gamla stanin kortteleiden välissä kulkee Mårten Trotzigs '
            + 'gränd, kapeimmalta kohdaltaan 90 senttimetriä leveä. Se on '
            + 'Tukholman kapein kuja, ja sen 36 porrasaskelmaa laskevat '
            + 'Prästgatanilta alas Västerlånggatanille. Nimi tuli '
            + 'saksalaiselta kauppiaalta, joka muutti kaupunkiin 1581 ja osti '
            + 'kujan varrelta taloja. 1800-luvun puolivälissä kuja suljettiin '
            + 'molemmista päistä lankkuseinällä, ja se avattiin uudelleen '
            + 'vasta 1945.',
          selite: 'Mårten Trotzigs gränd kirkkaana päivänä: seinät melkein '
            + 'koskettavat toisiaan, seinään kiinnitetty lyhty valaisee '
            + 'portaita ja kaukana kujalla kävelee yksi ihminen.',
          lahde: 'Holger Ellgaard, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Gamla stan',
        },
      ],
    },
    {
      id: 'elaimet',
      nimi: 'Eläimet kaupungissa',
      johdanto: 'Keskellä pääkaupunkia nostetaan lohia, ja Djurgårdenin mäellä '
        + 'laiduntaa eläin, joka oli kerran kadota koko maailmasta.',
      nostot: [
        {
          otsikko: 'Lohi ui eduskuntatalon ohi',
          tiedosto: 'Håvbåt på Strömmen 2020.jpg',
          teksti: 'Norrström on virta, jota pitkin Mälarenin vesi syöksyy mereen '
            + 'aivan eduskuntatalon vierestä. Siitä nostetaan joka vuosi '
            + 'satoja lohia ja meritaimenia: vuonna 2000 saatiin lohi, joka '
            + 'painoi lähes 22 kiloa. Vedessä elää noin kolmekymmentä '
            + 'kalalajia, enemmän kuin missään muualla Tukholman seudun '
            + 'vesissä. Kalat palasivat 1970-luvulla aloitettujen istutusten '
            + 'myötä, ja vuonna 2024 vanha vuoden 1850 sulku muutettiin '
            + 'kalatieksi, jota myöten kalat pääsevät nousemaan järveen.',
          selite: 'Vihreä haavivene kiinni Norrströmin virrassa Kuninkaallisen '
            + 'oopperan edessä. Puomista roikkuu iso nostohaavi, joka '
            + 'lasketaan veteen kalaa odottamaan.',
          lahde: 'Frankie Fouganthin, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Lohi',
          galleria: [
            {
              otsikko: 'Onkija keskellä kaupunkia',
              tiedosto: 'Fishing in Strömmen, Stockholm - panoramio.jpg',
              selite: 'Kalastaja heittää vapaansa kivilaiturin portailta. '
                + 'Vastarannalla on kivitaloja ja vasemmalla silta — '
                + 'kalapaikka on keskellä liikennettä.',
              lahde: 'Bengt Nyman, Wikimedia Commons (CC BY 3.0)',
            },
          ],
        },
        {
          otsikko: 'Visentti pelastui kaupungin mäellä',
          tiedosto: 'Bison bonasus, Skansen (23157746126).jpg',
          teksti: 'Djurgårdenin Skansen avattiin 1891, ja sinne siirrettiin '
            + 'kokonaisia taloja ympäri Ruotsia. Malli levisi niin laajalle, '
            + 'että monessa kielessä sana skansen tarkoittaa yhä '
            + 'ulkoilmamuseota. Skansenilla pidettiin myös visenttejä, '
            + 'Euroopan raskaimpia maaeläimiä. Kun laji oli 1920-luvulla '
            + 'katoamassa, koko maailmassa oli enää 54 visenttiä — ja kaksi '
            + 'niistä eli täällä. Vuonna 1929 Skansenilta lähetettiin hiehoja '
            + 'Puolan Białowieżaan, jonne laji päästettiin takaisin metsään '
            + '1952.',
          selite: 'Visentin pää lähikuvassa Skansenilla: paksu ruskea otsatukka, '
            + 'lyhyet ylöspäin kaartuvat sarvet ja tumma turpa. Taustalla '
            + 'näkyy aitauksen lauta-aita talvivalossa.',
          lahde: 'Bengt Nyman, Wikimedia Commons (CC BY 2.0)',
          wiki: 'Visentti',
        },
      ],
    },
  ],
};
