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
      id: 'historia',
      nimi: 'Historia',
      johdanto: 'Lontoon historia ei ole museovitriinissä vaan kadun pinnassa: '
        + 'kivetykseen piirretty roomalainen areena, pylväs joka mittaa '
        + 'tulipalon matkan, rantakatu joka on viemärin katto ja kirkko, '
        + 'josta pommi teki puutarhan.',
      nostot: [
        {
          otsikko: 'Mustat kivet piirtävät areenan',
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
          tiedosto: 'The Guildhall (16763316129).jpg',
          selite: 'Guildhall Yardin aukio Lontoon Cityssä. Kivetyksen halki '
            + 'kaartava tumma juova merkitsee roomalaisen amfiteatterin '
            + 'areenan ulkoreunan, ja oikealla on Guildhall Art Gallery, '
            + 'jonka kellarissa rauniot ovat esillä.',
          lahde: 'It\'s No Game (Duncan Harris), Wikimedia Commons (CC BY 2.0)',
          wiki: 'Londinium',
        },
        {
          otsikko: 'Pylväs, joka on mittanauha',
          teksti: 'Cityssä seisoo yksinäinen kivipylväs, jonka huipulla hehkuu '
            + 'kullattu liekkimalja. Se on 61,6 metriä korkea — ja täsmälleen '
            + 'saman verran on matkaa pylvään juurelta paikkaan, jossa '
            + 'kuninkaan leipurin Thomas Farrinerin puoti seisoi Pudding '
            + 'Lanella. Sieltä lähti 2. syyskuuta 1666 palo, joka söi '
            + 'suurimman osan kaupungista. Jos pylvään kaataisi kyljelleen, '
            + 'huippu osuisi leipomon ovelle. Robert Hooken suunnittelema '
            + 'pylväs on lisäksi salaa tiedelaite: sen ytimessä kulkee ontto '
            + 'kuilu kaukoputkea varten, liekkimaljassa on saranoitu kansi ja '
            + 'portaat on mitoitettu tasan kuuden tuuman korkuisiksi '
            + 'ilmanpaineen mittaamista varten. Huipulle niitä on 311.',
          tiedosto: 'The Monument and Pudding Lane (29579325883).jpg',
          selite: 'Pudding Lanen katukilpi Cityn kadunkulmassa, ja taustalla '
            + 'kohoaa Monumentin yläpää kullattuine liekkimaljoineen. Tältä '
            + 'kadulta suurpalo lähti liikkeelle.',
          lahde: 'It\'s No Game (Duncan Harris), Wikimedia Commons (CC BY 2.0)',
          wiki: 'Lontoon suurpalo',
        },
        {
          otsikko: 'Rantakatu on viemärin katto',
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
          tiedosto: 'Installation of the sewerage system of the Metropolis Wellcome M0010346.jpg',
          selite: 'Poikkileikkaus Thamesin penkereestä vuodelta 1867, Charing '
            + 'Crossin aseman kohdalta. Kadun alle on merkitty johtotunneli '
            + '(1), matalan tason viemäri (2), metrorata höyryvetureineen (3) '
            + 'ja joen pohjan alle paineilmarata (4); oikealla muurataan '
            + 'uutta rantamuuria ulos jokeen.',
          lahde: 'The Illustrated London News / Wellcome Collection, Wikimedia Commons (PD)',
          wiki: 'Thames',
        },
        {
          otsikko: 'Kirkko, josta tuli puutarha',
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
          tiedosto: 'St.Dunstan in the East Church Garden, London - geograph.org.uk - 2595823.jpg',
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
      johdanto: 'Lontoossa kuvataide ei pysy museon seinien sisällä: se seisoo '
        + 'torin jalustalla, kätkeytyy arkkitehdin omaan kotiin ja ottaa '
        + 'haltuunsa vanhan voimalaitoksen.',
      nostot: [
        {
          otsikko: 'Parturin poika maalasi valon',
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
          tiedosto: 'The Fighting Temeraire, JMW Turner, National Gallery.jpg',
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
          tiedosto: 'Interior view - Sir John Soane\'s Museum - DSC00041.jpg',
          selite: 'Näkymä ylös Soanen museon kupolitilaan: seinät on peitetty '
            + 'lattiasta kattoon kipsivaloksilla, pylväänpäillä ja '
            + 'koristepalasilla. Kaaren takana kohoaa Apollon antiikkipatsaan '
            + 'kipsikopio, sen edessä on rivi koristeltuja maljakoita ja '
            + 'alempana leveä reliefivyö.',
          lahde: 'Daderot, Wikimedia Commons (CC0)',
          wiki: 'John Soane',
        },
        {
          otsikko: 'Piippu, joka ei saanut olla korkein',
          teksti: 'Thamesin etelärannalla savuttanut Banksiden voimalaitos teki '
            + 'sähköä lokakuuhun 1981 asti. Sen suunnitteli Giles Gilbert '
            + 'Scott, sama mies joka piirsi Britannian punaisen puhelinkopin, '
            + 'ja piipusta tehtiin tarkoituksella vain 99 metriä korkea, '
            + 'jottei se kohoaisi joen vastarannalla seisovaa Pyhän Paavalin '
            + 'katedraalia ylemmäs. Vuonna 2000 tiilihalli avattiin Tate '
            + 'Modern -museona, ja kokoelmanäyttelyihin pääsee yhä '
            + 'ilmaiseksi: vuonna 2025 kävijöitä oli noin 4,5 miljoonaa, mikä '
            + 'teki siitä Britannian neljänneksi vierailluimman nähtävyyden.',
          tiedosto: 'London - Bankside - Jubilee Walkway - View SE on Tate Modern 1947-63 (Bankside Power Station) by Sir Giles Gilbert Scott.jpg',
          selite: 'Tate Modern koivujen takaa: entisen Banksiden voimalaitoksen '
            + 'tiiliseinä ja keskeltä kohoava savupiippu, rakennuksen '
            + 'harjalla myöhemmin lisätty lasikerros. Edustalla ihmisiä '
            + 'istumassa nurmikolla ja kävelemässä hiekkatiellä, oikealla '
            + 'nosturi.',
          lahde: 'Txllxt TxllxT, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Tate Modern',
        },
        {
          otsikko: 'Neula, joka ei ole Kleopatran',
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
          tiedosto: 'Cleopatra\'s Needle 2022-04-24d.jpg',
          selite: 'Kleopatran neula Victoria Embankmentilla alhaalta kuvattuna: '
            + 'graniittiin hakatut hieroglyfit ja kartussit nousevat kohti '
            + 'sinistä taivasta. Jalustan pronssisessa kannessa levittäytyy '
            + 'siipipari, jonka keskellä on kahden kobran välissä pyhä '
            + 'skarabee.',
          lahde: 'Djehouty, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Kleopatran neulat',
        },
        {
          otsikko: 'Piirros, joka synnytti tekijänoikeuden',
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
          tiedosto: 'A Rake\'s Progress, Plate 2 MET DP825208.jpg',
          selite: 'Hogarthin kuvasarjan toinen lehti: nuori perijä seisoo salinsa '
            + 'keskellä miekkailumestarin, viulua pitelevän tanssimestarin, '
            + 'metsästystorven soittajan ja muiden onnenonkijoiden '
            + 'ympäröimänä. Alareunan tekstirivi kertoo, että lehti on '
            + 'julkaistu parlamentin lain mukaisesti 25. kesäkuuta 1735.',
          lahde: 'William Hogarth / Metropolitan Museum of Art, Wikimedia Commons (CC0)',
          wiki: 'William Hogarth',
        },
      ],
    },
    {
      id: 'kirjallisuus',
      nimi: 'Kirjallisuus',
      johdanto: 'Lontoossa kirjallisuus on kaduilla: osoite jota ei koskaan ollut, '
        + 'patsas joka ilmestyi salaa yön aikana, vankilan muuri joka päätyi '
        + 'romaaniin ja kissa, joka sai osterinsa sanakirjantekijältä.',
      nostot: [
        {
          otsikko: 'Osoite, jota ei ollut olemassa',
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
          tiedosto: 'Sherlock Holmes Museum, Baker Street, London (2).jpg',
          selite: 'Sherlock Holmes -museon vihreä julkisivu Baker Streetillä. '
            + 'Parvekkeen takana seinässä on sininen laatta, jossa lukee 221b '
            + 'ja vuodet 1881–1904, vaikka talo on todellisuudessa numeroiden '
            + '237 ja 241 välissä.',
          lahde: 'MOs810, Commons (CC BY-SA 4.0)',
          wiki: 'Sherlock Holmes',
        },
        {
          otsikko: 'Patsas, joka ilmestyi yön aikana',
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
          tiedosto: 'Peter Pan Statue in Kensington Gardens (01).jpg',
          selite: 'Peter Pan soittaa pilliä puunkannon päällä Kensington '
            + 'Gardensissa. Kannon kylkeen on valettu oravia, hiiriä, kaneja '
            + 'ja keijuja, ja koko veistos on runsaat neljä metriä korkea.',
          lahde: 'Ethan Doyle White, Commons (CC BY-SA 4.0)',
          wiki: 'Peter Pan',
        },
        {
          otsikko: '42 773 sanaa yhdestä talosta',
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
          tiedosto: 'Statue of Hodge - Dr Johnsons cat - in Gough Square (4043318307).jpg',
          selite: 'Hodge-patsas Gough Squarella, tohtori Johnsonin talon '
            + 'vastapäätä. Jon Bickleyn vuonna 1997 tekemä kissa istuu '
            + 'pronssisen sanakirjan päällä, ja kirjan kannella on kaksi '
            + 'tyhjää osterinkuorta.',
          lahde: 'Elliott Brown, Commons (CC BY 2.0)',
          wiki: 'Samuel Johnson',
        },
        {
          otsikko: 'Muuri, joka päätyi romaaniin',
          teksti: 'Charles Dickens täytti kaksitoista 7. helmikuuta 1824. Kaksi '
            + 'päivää myöhemmin hänet pantiin töihin kenkämustetehtaaseen: '
            + 'hän kääri purkkien päälle paperit ja sitoi ne narulla kymmenen '
            + 'tuntia päivässä kuuden shillingin viikkopalkalla. Vasta '
            + 'yksitoista päivää myöhemmin, 20. helmikuuta, hänen isänsä '
            + 'joutui Marshalsean velkavankilaan Southwarkissa, koska oli '
            + 'jäänyt leipuri James Kerrille velkaa 40 puntaa ja 10 '
            + 'shillinkiä. Isä vapautui 28. toukokuuta. Vankila suljettiin '
            + '1842 ja purettiin, mutta sen eteläinen tiilimuuri seisoo yhä '
            + 'Angel Placen kujalla, ja muurien sisäpuolelle Dickens sijoitti '
            + 'myöhemmin romaanin Little Dorrit.',
          tiedosto: 'Marshalsea Prison wall IMG 4504.jpg',
          selite: 'Marshalsean velkavankilan jäljellä oleva tiilimuuri Angel '
            + 'Placen kujalla Southwarkissa. Muurin tällä puolella on nykyään '
            + 'pieni puisto penkkeineen, toisella puolella John Harvardin '
            + 'kirjasto.',
          lahde: 'LoopZilla, Commons (CC BY-SA 2.0)',
          wiki: 'Charles Dickens',
        },
        {
          otsikko: 'Karhu, jolla on lappu kaulassa',
          teksti: 'Michael Bond osti jouluaattona 1956 Selfridgesin tavaratalosta '
            + 'nallen, joka oli jäänyt yksin hyllylle, ja vei sen lahjaksi '
            + 'vaimolleen. Tarina syntyi kymmenessä päivässä ja kirja '
            + 'ilmestyi 13. lokakuuta 1958; karhu sai nimen läheisen '
            + 'rautatieaseman mukaan, sillä Bond asui tuolloin Paddingtonin '
            + 'kupeessa. Paddingtonin kaulassa roikkuu lappu "Please look '
            + 'after this bear. Thank you", ja esikuvana olivat sota-ajan '
            + 'uutisfilmit, joissa lontoolaislapsia lähetettiin maaseudulle '
            + 'turvaan nimilappu kaulassa ja pieni matkalaukku kädessä.',
          tiedosto: 'Statue of Paddington Bear with offerings.jpg',
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
          teksti: 'Geoffrey Chaucer haudattiin Westminster Abbeyhin vuonna 1400, '
            + 'mutta ei runojensa takia: hän oli hoitanut kuninkaan '
            + 'rakennustöitä ja asunut vuokralla kirkon alueella. Vasta 156 '
            + 'vuotta myöhemmin Nicholas Brigham teetti hänelle komean haudan '
            + 'ja siirsi luut siihen. Kun Edmund Spenser haudattiin viereen '
            + '1599, tapa oli syntynyt. Nyt saman eteläisen ristivarren '
            + 'lattia on täynnä kirjailijoiden muistolaattoja, joiden yli '
            + 'kävellään joka päivä.',
          tiedosto: 'Geoffrey Chaucer tomb, Poet\'s Corner.jpg',
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
      johdanto: 'Lontoossa musiikki tulee yhtä lailla kirkontornista, pubin '
        + 'takasalista, metroaseman lattiaan maalatusta puolikaaresta kuin '
        + 'karnevaalin öljytynnyreistäkin.',
      nostot: [
        {
          otsikko: 'Kruunajaishymni Brook Streetiltä',
          teksti: 'Georg Friedrich Händel muutti Brook Streetin taloon numero 25 '
            + 'kesällä 1723 ja asui siinä kuolemaansa asti vuoteen 1759, '
            + 'kolmekymmentäkuusi vuotta samassa osoitteessa. Siellä hän '
            + 'sävelsi vuonna 1727 kruunajaishymnin Zadok the Priest Yrjö '
            + 'II:n kruunajaisiin, ja sitä on laulettu jokaisissa Britannian '
            + 'kruunajaisissa siitä lähtien, aina hallitsijan voitelun '
            + 'edellä. Kun Mestarien liigalle tehtiin tunnussävelmä vuonna '
            + '1992, Tony Britten sovitti sen suoraan Händelin hymnin '
            + 'pohjalta. Sen kuulee nykyään joka ottelun alkajaisiksi.',
          tiedosto: 'London 003 Hendrix and Handel houses.jpg',
          selite: 'Brook Streetin vierekkäiset talot Mayfairissa. '
            + 'Vasemmanpuoleisessa vaaleassa talossa numero 23 on sininen '
            + 'laatta Jimi Hendrixille, joka asui siinä vuosina 1968–1969; '
            + 'oikeanpuoleisessa tummassa tiilitalossa numero 25 on '
            + 'samanlainen sininen laatta Händelille. Kaksi muusikkoa '
            + 'naapuritaloissa runsaan kahdensadan vuoden välein.',
          lahde: 'David Holt, Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Zadok the Priest',
        },
        {
          otsikko: 'Sinfonia, joka sävellettiin päässä',
          teksti: 'Mozartin perhe viipyi Lontoossa viisitoista kuukautta, '
            + 'huhtikuusta 1764 heinäkuuhun 1765. Kesällä 1764 isä Leopold '
            + 'sairastui pahasti, perhe muutti silloiseen Chelsean kylään '
            + 'osoitteeseen 180 Ebury Street, ja talossa määrättiin täysi '
            + 'hiljaisuus: kosketinsoittimeen ei saanut koskea kukaan. '
            + 'Kahdeksanvuotias Wolfgang sävelsi silloin ensimmäisen '
            + 'sinfoniansa päässään, ilman soitinta. Se kantaesitettiin 21. '
            + 'helmikuuta 1765 Haymarketin pienessä teatterissa, ja poika '
            + 'johti esitystä itse.',
          tiedosto: 'Mozart was here, pair of houses, 180 ^ 182 Ebury Street - geograph.org.uk - 8013426.jpg',
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
          teksti: 'Englantilaisessa kellonsoitossa kello heilahtaa lähes täyden '
            + 'ympyrän, ja jokaista kelloa vetää oma soittajansa omasta '
            + 'köydestään. Sävelmää ei synny: kellot soitetaan joka '
            + 'kierroksella eri järjestyksessä, eikä sama järjestys saa '
            + 'toistua kertaakaan. Kahdellatoista kellolla järjestyksiä on '
            + '479 001 600, ja niiden kaikkien läpi soittaminen veisi yli '
            + 'kolmekymmentä vuotta. Täysi peal on vähintään viisituhatta '
            + 'vaihdosta ja kestää noin kolme tuntia, kaikki ulkomuistista '
            + 'ilman nuotteja.',
          tiedosto: 'Great Bells of Bow.jpg',
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
          otsikko: 'Musiikkisali pubin takana',
          teksti: 'Wilton\'s rakennettiin vuonna 1859 vanhan talorivin ja pubin '
            + 'taakse umpikujan perälle, ja pubin baaritiski jäi salin '
            + 'sisäänkäynniksi: yleisö käveli esitykseen oluttuvan läpi. '
            + 'Tilaa oli 1 500 ihmiselle, ja he istuivat pöydissä syömässä ja '
            + 'juomassa koko esityksen ajan. Katosta roikkui kaasukruunu, '
            + 'jossa paloi kolmesataa liekkiä ja välkkyi 27 000 hiottua '
            + 'kristallia. Sen kuumuuden kärventämät jäljet näkyvät '
            + 'kattoparruissa yhä. Wilton\'s on ainoa säilynyt 1850-luvun '
            + 'suurista pubisaleista.',
          tiedosto: 'Wilton\'s Music Hall, London-21326127344.jpg',
          selite: 'Wilton\'sin sali Shadwellissa kuvattuna salin perältä parven '
            + 'korkeudelta. Yksi ainoa parvi kiertää salia kolmelta sivulta '
            + 'ja lepää kierrepintaisilla valurautapylväillä; lava on paljas '
            + 'ja seinien rappaus jätetty entisöinnissä kuluneeksi.',
          lahde: 'Alexander Baxevanis, Wikimedia Commons (CC BY 2.0)',
          wiki: 'Music hall',
        },
        {
          otsikko: 'Metron soittopaikat jaetaan koesoitolla',
          teksti: 'Lontoon metrossa katusoitto on luvanvaraista. Transport for '
            + 'London ylläpitää 39 soittopaikkaa 25 keskusta-asemalla, ja '
            + 'luvan saa vain läpäisemällä raadin edessä pidettävän '
            + 'koesoiton. Paikat on maalattu asemien lattioihin puolikaarina: '
            + 'kaaren sisällä saa soittaa, sen ulkopuolella ei. Maan päällä '
            + 'säännöt vaihtelevat kaupunginosittain. Cityn alueella '
            + 'katusoitto on kielletty, ja Leicester Squaren esiintymispaikat '
            + 'suljettiin huhtikuussa 2025, kun tuomioistuin oli määrännyt '
            + 'melun loppumaan.',
          tiedosto: 'Busker at Piccadilly Circus tube station in March 2012.JPG',
          selite: 'Kitaristi soittaa Piccadilly Circusin metroasemalla '
            + 'maaliskuussa 2012. Hän istuu retkijakkaralla lattiaan maalatun '
            + 'soittopaikan laidalla, kaaren reunassa lukee Mayor of London '
            + 'ja Transport for London, ja kolikot kilahtavat auki jätettyyn '
            + 'kitarapussiin. Vieressä olevalla kärryllä on kannettava '
            + 'tietokone ja kaksi nukkea.',
          lahde: 'Editor5807, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Katusoittaja',
        },
        {
          otsikko: 'Öljytynnyri, joka soittaa melodian',
          teksti: 'Steel pan taotaan kahdensadan litran peltitynnyristä: pohja '
            + 'lyödään kupiksi ja siihen taotaan soikeita kenttiä, joista '
            + 'jokainen soi omaa säveltään. Mitä isompi soikio, sitä '
            + 'matalampi ääni, ja korkeimpaan tenoripanniin mahtuu noin '
            + 'kolmekymmentä säveltä. Soitin syntyi Trinidadissa, ja '
            + 'Lontoossa se nähtiin ensi kerran vuoden 1951 Festival of '
            + 'Britainissa. Notting Hillin karnevaalia edeltävässä '
            + 'Panorama-kisassa soittaa nykyään noin tuhat ihmistä, kaikki '
            + 'ulkomuistista.',
          tiedosto: 'Ebony Steel Band raising funds for NSPCC Oxford Street, London.jpg',
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
          otsikko: 'Proms — konsertti, jossa seistään',
          tiedosto: 'Royal Albert Hall, BBC Proms 2017.jpg',
          teksti: 'Proms on kahdeksan viikon konserttisarja, joka on soinut '
            + 'joka kesä vuodesta 1895. Royal Albert Halliin mahtuu 5 272 '
            + 'istujaa, mutta halvimmat liput ovat lattialle: prommaajat '
            + 'seisovat orkesterin edessä koko illan. Jokainen konsertti '
            + 'lähetetään radiossa, joten sen kuulee ilmaiseksi missä '
            + 'tahansa.',
          selite: 'Royal Albert Hall Proms-konsertin aikana. Alhaalla '
            + 'areenalla ei ole tuoleja lainkaan — siellä seisova yleisö '
            + 'on kuulunut Promsiin alusta asti.',
          lahde: 'Ed g2s, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'BBC Proms',
          musiikki: 'https://music.apple.com/fi/search?term=bbc%20proms',
          musiikkiNimi: 'Proms-konsertteja Apple Musicissa',
          musiikkiNayte: 'https://upload.wikimedia.org/wikipedia/commons/2/28/ELGAR_Pomp_and_Circumstance_in_D%2C_Opus_39%2C_No._1_-_United_States_Marine_Band.mp3',
          musiikkiNayteNimi: 'Elgar: Pomp and Circumstance nro 1 — United States Marine Band, PD',
        },
      ],
    },
    {
      id: 'ruoka',
      nimi: 'Ruoka',
      johdanto: 'Lontoossa ruoka kertoo aina jotain muutakin kuin mitä lautasella '
        + 'on: sunnuntain paistista, torin kojuista, kahvikupista ja '
        + 'liukuportaiden äänettömästä säännöstä näkee, millainen kaupunki '
        + 'tapoineen on.',
      nostot: [
        {
          otsikko: 'Vanukas ennen lihaa',
          teksti: 'Sunnuntaipaisti on viikon tärkein ateria, ja siihen kuuluu '
            + 'yorkshirenvanukas: ohut taikina kaadetaan tulikuumaan '
            + 'paistinrasvaan, ja uunissa se kohoaa ontoksi kupoliksi. Ennen '
            + 'se ei ollut lisuke vaan alkuruoka. Vanukas syötiin ensin '
            + 'paksun kastikkeen kanssa, jotta pöytäseurue tulisi halvasta '
            + 'jauhoruoasta kylläiseksi eikä söisi niin paljon kallista '
            + 'lihaa. Kuninkaallinen kemian seura julisti vuonna 2008, ettei '
            + 'alle neljän tuuman eli noin kymmenen sentin korkuinen kohokas '
            + 'enää ansaitse vanukkaan nimeä.',
          tiedosto: 'Victoria Inn, Peckham, London (4872592446).jpg',
          selite: 'Sunnuntaipaisti lontoolaisen pubin pöydässä Peckhamissa. '
            + 'Paahtopaistin päällä lepää iso ruskistunut yorkshirenvanukas, '
            + 'ja lautasella on uuniperunoita, kukkakaalia, vihreitä papuja '
            + 'ja porkkanaa; vieressä höyryää kastikekannu.',
          lahde: 'Ewan Munro, Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Paahtopaisti',
        },
        {
          otsikko: 'Tori, jonka parlamentti lakkautti',
          teksti: 'Southwarkin puolella on myyty ruokaa ainakin 1200-luvulta '
            + 'asti. Vuonna 1754 parlamentti lakkautti torin kokonaan, koska '
            + 'se tukki kadut — mutta seurakuntalaiset saivat luvan aloittaa '
            + 'alusta, ja kahden vuoden päästä kojut nousivat viereiselle '
            + 'tontille. Sinne ne jäivät. Kun rautatie 1860-luvulla halusi '
            + 'kulkea yli, torin isännät eivät lain mukaan saaneet myydä '
            + 'maataan, joten radalle annettiin vain vuokraoikeus sillan '
            + 'verran ja kauppa jatkui sen alla. Nyt junat jyrisevät ostajien '
            + 'pään päällä. Maanantaisin tori on kiinni.',
          tiedosto: 'Borough Market - geograph.org.uk - 5246520.jpg',
          selite: 'Väkeä Borough Marketin kojujen välissä. Pään päällä kaartuu '
            + 'rautatiesillan niitattu teräspalkisto, ja taustalla näkyy '
            + 'torin kyltti ja kahvikoju.',
          lahde: 'Chris Holifield, Wikimedia Commons (CC BY-SA 2.0)',
        },
        {
          otsikko: 'Yliopisto pennyn hinnalla',
          teksti: 'Lontoon ensimmäisen kahvihuoneen avasi vuonna 1652 Pasqua '
            + 'Rosée, joka oli tullut kaupunkiin kauppiaan palvelijana '
            + 'Smyrnasta. Pennyllä pääsi sisään ja sai kupillisen kahvia, '
            + 'päivän lehdet ja oikeuden osallistua keskusteluun — säätyyn '
            + 'katsomatta. Siksi kahvihuoneita sanottiin pennyn '
            + 'yliopistoiksi. Vuoteen 1708 mennessä niitä oli Cityssä ja '
            + 'Westminsterissä 500–600. Edward Lloyd avasi omansa 1686, ja '
            + 'siellä vaihdetuista laivauutisista kasvoi vakuutustalo '
            + 'Lloyd\'s.',
          tiedosto: 'Interior of a London Coffee-house, 17th centuryFXD.jpg',
          selite: 'Lontoolaisen kahvihuoneen sisus 1600-luvun lopulta. '
            + 'Peruukkipäiset miehet istuvat pitkien pöytien ääressä, lukevat '
            + 'lehtiä ja juovat kahvia matalista kupeista; takan yllä riippuu '
            + 'pannu ja vasemmalla emäntä istuu korotetussa kopissaan.',
          lahde: 'Tuntematon taiteilija, Wikimedia Commons (PD)',
          wiki: 'Lloyd’s of London',
        },
        {
          otsikko: 'Napeilla peitetyt kuninkaat',
          teksti: 'Lontoon katukauppiaat ompelivat 1800-luvulla housunsaumoihinsa '
            + 'helmiäisnappeja, joita löytyi torin lattialta. Orpo '
            + 'katulakaisija Henry Croft vei tavan äärimmäisyyteen: hän '
            + 'peitti napeilla kokonaisen puvun ja lakin, jotta ihmiset '
            + 'huomaisivat hänet ja antaisivat rahaa sairaaloille. '
            + 'Hautajaisiinsa tammikuussa 1930 saapui nelisensataa seuraajaa, '
            + 'ja muistokivessä kerrottiin hänen keränneen 5 000 puntaa. Nyt '
            + 'tittelit kulkevat kaupunginosittain: on Hackneyn, Shoreditchin '
            + 'ja Tower Hamletsin omat kuninkaansa, ja keräysrasia kiertää '
            + 'yhä.',
          tiedosto: 'A Pearly Collection.jpg',
          selite: 'Pearly kingejä ja queenejä keräämässä rahaa '
            + 'hyväntekeväisyyteen Covent Gardenissa. Mustat asut on peitetty '
            + 'helmiäisnapeista ommelluilla kuvioilla, ja oikealla näkyy '
            + 'punainen keräysrasia.',
          lahde: 'Garry Knight, Wikimedia Commons (CC BY-SA 2.0)',
        },
        {
          otsikko: 'Seiso oikealla, kävele vasemmalla',
          teksti: 'Metron liukuportaissa on yksi rautainen sääntö: seisojat '
            + 'oikealle, kiirehtijät vasemmalle. Tapa syntyi vahingossa. '
            + 'Ensimmäiset liukuportaat avattiin Earl\'s Courtin asemalla '
            + 'vuonna 1911, ja niiden yläpäässä vino väliseinä ohjasi '
            + 'matkustajat ulos vasemmalta puolelta, joten seisojan kannatti '
            + 'pysyä oikealla. Vuonna 2015 Holbornissa kokeiltiin, että '
            + 'kaikki seisoisivat molemmin puolin. Portaisiin mahtui lähes '
            + 'kolmanneksen enemmän väkeä, mutta heti kun valvojat lähtivät, '
            + 'lontoolaiset palasivat entiseen.',
          tiedosto: '2016-02 Escalators Underground London 02.jpg',
          selite: 'Ruuhkaiset liukuportaat Camden Townin metroasemalla. Sinisissä '
            + 'kylteissä lukee Stand on the right, ja nousevissa portaissa '
            + 'matkustajat ovat pakkautuneet oikeaan reunaan jättäen vasemman '
            + 'puolen vapaaksi ohittajille.',
          lahde: '0x010C, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Lontoon metro',
        },
        {
          otsikko: 'Hieno tee on matala tee',
          teksti: 'Iltapäivätee sai alkunsa nälästä. Yläluokan päivällistä '
            + 'syötiin 1800-luvulla vasta puoli kahdeksan jälkeen, ja '
            + 'Bedfordin herttuatar Anna Russell alkoi noin vuonna 1840 '
            + 'pyytää väliaikaan teetä ja pikkupurtavaa. Tapa levisi '
            + 'seurapiireihin, ja sitä sanotaan myös matalaksi teeksi, koska '
            + 'se juotiin salongin matalien sivupöytien ääressä. Korkea tee '
            + 'eli high tea ei siis ole hienompi vaan päinvastoin: se on '
            + 'työväen kunnon iltaruoka, joka syötiin viiden ja seitsemän '
            + 'välillä korkean ruokapöydän ääressä.',
          tiedosto: 'Afternoon Tea at The Ritz.jpg',
          selite: 'Iltapäivätee kolmikerroksisessa telineessä Ritzillä Lontoossa: '
            + 'alimpana pikkuvoileipiä, keskellä rusinaisia skonsseja ja '
            + 'päällimmäisenä pikkuleivoksia. Etualalla on kullareunainen '
            + 'teekuppi.',
          lahde: 'RT6HPU, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Kello viiden tee',
        },
        {
          otsikko: 'Piirakka, muusi ja vihreä liquor',
          tiedosto: 'Pie mash and liquor Manze Bermondsey.jpg',
          teksti: 'Pie and mash on Lontoon satamakortteleiden ruokaa: '
            + 'jauhelihapiirakka, perunamuusia ja päälle liquor eli '
            + 'vihreä persiljakastike — nimestä huolimatta siinä ei ole '
            + 'tippaakaan väkijuomaa. Ennen piirakat tehtiin ankeriaasta, '
            + 'sillä Thames oli niitä täynnä ja ne olivat halvinta lihaa '
            + 'mitä sai.',
          selite: 'Annos lontoolaisessa piirakkapuodissa marmoripöydällä. '
            + 'Liquor keitettiin alun perin ankeriaan keitinliemestä, ja '
            + 'väri tulee persiljasta.',
          lahde: 'Secretlondon, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Brittiläinen keittiö',
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
          tiedosto: 'Mudlarks by Millennium Bridge.jpg',
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
          tiedosto: 'Swan Upping.jpg',
          selite: 'Joutsenten laskijoita veneissään Thamesilla Abingdonissa '
            + 'heinäkuussa 2006. Lippujen joutsenvaakunat kertovat, kenen '
            + 'miehistöstä on kyse, ja kaksi joutsenta ui veneen kylkeen '
            + 'ajettuna; rantapenkereellä seisoo katselijoita kaiteen takana.',
          lahde: 'Philip Allfrey, Wikimedia Commons (CC BY-SA 3.0)',
          wiki: 'Kyhmyjoutsen',
        },
        {
          otsikko: 'Kuusisataa hirveä aidan sisällä',
          teksti: 'Richmond Park on Lontoon kuninkaallisista puistoista suurin, '
            + 'ja sen kolmentoista kilometrin tiiliaidan sisällä kulkee '
            + 'vapaana noin 630 saksanhirveä ja kuusipeuraa. Kuningas Kaarle '
            + 'I aitasi alueen hirvenmetsästystä varten vuonna 1637. '
            + 'Syys-lokakuussa urokset karjuvat kiima-aikaan. Marraskuussa ja '
            + 'helmikuussa laumasta kaadetaan noin kaksisataa eläintä, jotta '
            + 'laidun riittää lopuille. Vuosina 1867 ja 1876 puistosta '
            + 'lähetettiin kuusipeuroja laivalla Uuteen-Seelantiin, ja ne '
            + 'olivat maan ensimmäiset kuusipeurat.',
          tiedosto: 'Red deer stag roaring in Richmond Park - geograph.org.uk - 3711560.jpg',
          selite: 'Karjuva saksanhirviuros Richmond Parkissa lokakuussa 2013. '
            + 'Sarvet ovat täysikasvuiset ja monihaaraiset, eläin seisoo '
            + 'kuivan heinikon reunassa, ja sen takana kasvaa laaja '
            + 'sananjalkakenttä.',
          lahde: 'Russel Wills, Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Isokauris',
        },
        {
          otsikko: 'Papukaijat oppivat kämmenelle',
          teksti: 'Lontoon puistoissa lentää kirkkaanvihreitä kauluskaijoja, '
            + 'joiden kotiseutu on Intiassa ja trooppisessa Afrikassa. '
            + 'Villiintynyt kanta alkoi lisääntyä pysyvästi vuonna 1969 '
            + 'Croydonissa, ja nyt lintuja on kymmeniätuhansia: vuoden 2012 '
            + 'yöpymispuiden laskennassa niitä kertyi Lontoossa noin 32 000. '
            + 'Talvi ei niitä kaada, sillä laji elää luonnossa myös Himalajan '
            + 'lumisilla alarinteillä parintuhannen metrin korkeudessa. Hyde '
            + 'Parkissa ja Kensington Gardensissa ne ovat oppineet lentämään '
            + 'suoraan avoimelle kämmenelle, jos siinä on siemeniä.',
          tiedosto: 'Hyde Park feral parakeets (02).jpg',
          selite: 'Kauluskaija syö auringonkukansiemeniä ihmisen kämmeneltä Hyde '
            + 'Parkissa marraskuussa 2020. Taustan nurmella odottaa epätarkka '
            + 'pulujoukko, joka jakaa linnun kanssa saman ruokapaikan.',
          lahde: 'Isochrone (Berrely), Wikimedia Commons (CC BY 4.0)',
          wiki: 'Kauluskaija',
        },
        {
          otsikko: 'Sumu, joka ei ollutkaan sumua',
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
          tiedosto: 'A London Fog, drawn by Duncan - ILN 1847.jpg',
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
          teksti: 'Ennen Thames jäätyi. Vuosien 1400 ja 1831 välillä joki '
            + 'jähmettyi Lontoon kohdalla 24 talvena, ja jäälle nousi '
            + 'telttakylä: keilapelejä, veneenmuotoisia keinuja ja '
            + 'painokoneita, jotka myivät muistoksi jäällä painettuja '
            + 'säkeitä. Viimeiset markkinat alkoivat 1. helmikuuta 1814 ja '
            + 'kestivät neljä päivää, ja norsu talutettiin joen yli '
            + 'Blackfriarsin sillan alapuolelta. Sitten purettiin vanha '
            + 'Lontoon silta, jonka yhdeksäntoista pilaria olivat padonneet '
            + 'virran hitaaksi. Nyt joki juoksee liian nopeasti jäätyäkseen.',
          tiedosto: 'Frost Fair on the River Thames (1814).jpg',
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
      id: 'tiede',
      nimi: 'Tiede',
      johdanto: 'Lontoossa mitattiin maailmalle aika, piirrettiin epidemiologian '
        + 'kuuluisin tautikartta ja muurattiin viemärit, jotka näyttävät '
        + 'kirkolta — ja kellot, koneet ja luurangot ovat yhä nähtävissä '
        + 'niissä samoissa taloissa, joihin ne tehtiin.',
      nostot: [
        {
          otsikko: 'Punainen pallo putoaa kello yksi',
          teksti: 'Greenwichin observatorion katolla seisoo mastossa punainen '
            + 'pallo, joka nousee puoliväliin kello 12.55, huipulle 12.58 ja '
            + 'putoaa tasan kello 13; näin on tehty vuodesta 1833. Thamesilla '
            + 'ja Lontoon satama-altaissa olleet laivat tähystivät palloa '
            + 'kaukoputkella ja säätivät sen mukaan merikellonsa, ja aika '
            + 'luetaan siitä hetkestä, jolloin pallo lähtee liikkeelle, ei '
            + 'siitä kun se pysähtyy. Merkki annetaan yhdeltä eikä '
            + 'keskipäivällä siksi, että tähtitieteilijät olivat puolenpäivän '
            + 'aikaan itse kiinni auringon mittauksissa.',
          tiedosto: 'Greenwich time ball 2014.jpg',
          selite: 'Greenwichin observatorion Flamsteed Housen katto: punainen '
            + 'aikapallo mastonsa juuressa, mastonhuipussa tuuliviiri ja alla '
            + 'talon valkoinen pylväskaide.',
          lahde: 'Stanislav Kozlovskiy, Commons (CC BY-SA 4.0)',
          wiki: 'Greenwichin kuninkaallinen observatorio',
        },
        {
          otsikko: 'Kartta, joka paljasti pumpun',
          teksti: 'Elokuun lopulla 1854 Sohossa puhkesi koleraepidemia, joka '
            + 'tappoi 616 ihmistä. Lääkäri John Snow ei uskonut taudin '
            + 'leviävän pahasta hajusta, vaan kiersi ovelta ovelle ja '
            + 'merkitsi jokaisen kuolleen mustana palkkina sen talon '
            + 'kohdalle, jossa tämä oli asunut. Palkit kasautuivat yhden '
            + 'ainoan vesipumpun ympärille Broad Streetillä; pumpun kahva '
            + 'irrotettiin 8. syyskuuta, ja myöhemmin selvisi, että kaivon '
            + 'reunasta oli vajaa metri vuotavaan likakaivoon.',
          tiedosto: 'Snow-cholera-map-1.jpg',
          selite: 'Snow\'n kartta vuodelta 1854, hänen kirjansa Map 1. Jokainen '
            + 'musta palkki on yksi koleraan kuollut, ja sana PUMP merkitsee '
            + 'kadun vesipumput; tihein rykelmä kasvaa keskellä karttaa Broad '
            + 'Streetin pumpun ympärille.',
          lahde: 'John Snow, Commons (PD)',
          wiki: 'John Snow',
        },
        {
          otsikko: 'Kirjansitojasta sähkön löytäjä',
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
          tiedosto: 'Faraday\'s Magnetic Laboratory.jpg',
          selite: 'Faradayn magneettinen laboratorio Royal Institutionin '
            + 'kellarissa, nykyään lasin takana. Huone purettiin ja koottiin '
            + 'uudelleen 1930-luvulla Harriet Mooren 1850-luvun akvarellien '
            + 'mukaan; hyllyillä on pulloja, lasikupuja ja koelaitteita.',
          lahde: 'AndyScott, Commons (CC BY-SA 4.0)',
          wiki: 'Michael Faraday',
        },
        {
          otsikko: 'Kone, joka odotti 142 vuotta',
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
          tiedosto: 'London Science Museum by Marcin Wichary - Difference Engine No. 2, pt. 1 (2290036668).jpg',
          selite: 'Difference Engine No. 2 lasikaapissaan Lontoon Science '
            + 'Museumissa. Pystyrivit ovat numeropyöriä, oikeassa reunassa '
            + 'näkyy iso kampi ja vasemmalla tulostuslaite paperirullineen; '
            + 'kaapin pohjalla lepää esittelytaulu.',
          lahde: 'Marcin Wichary, Commons (CC BY 2.0)',
          wiki: 'Charles Babbage',
        },
        {
          otsikko: 'Katedraali, joka pumppasi likaa',
          teksti: 'Kesällä 1858 Thames haisi niin pahalle, että parlamenttitalon '
            + 'jokipuolen verhot kastettiin kloorikalkkiin ja hallituksen '
            + 'siirtämisestä Oxfordiin tai St Albansiin puhuttiin ääneen. '
            + 'Vuotta myöhemmin alkoi Joseph Bazalgetten urakka: noin 1 800 '
            + 'kilometriä katuviemäriä ja 132 kilometriä pääviemäriä, joihin '
            + 'muurattiin 318 miljoonaa tiiltä. Eteläisen viemärin päähän '
            + 'Crossnessiin nousi neljän höyrykoneen pumppaamo, jonka '
            + 'valurautainen sisus on niin koristeellinen, että '
            + 'arkkitehtuurin historioitsija Nikolaus Pevsner kutsui sitä '
            + 'viktoriaaniseksi raudan katedraaliksi.',
          tiedosto: 'Crossness Pumping Station 1.jpg',
          selite: 'Crossnessin pumppaamon konesali Lontoon itälaidalla: '
            + 'tummanpunaisiksi maalatut valurautapylväät, lehtikoristeiset '
            + 'pylväänpäät ja urakoitsijan nimi WILLIAM WEBSTER kaaren '
            + 'yläpuolella. Vierailijat kulkevat kypärä päässä koneiden '
            + 'lomassa.',
          lahde: 'Steve Cadman, Commons (CC BY-SA 2.0)',
          wiki: 'Suuri löyhkä',
        },
        {
          otsikko: 'Sinivalas maksoi 250 puntaa',
          teksti: 'Maaliskuussa 1891 valaanpyytäjien haavoittama nuori '
            + 'naarassinivalas ajautui hiekkasärkälle Wexfordin edustalle '
            + 'Irlannissa, ja Lontoon luonnontieteellinen museo osti sen '
            + 'luurangon 250 punnalla. Luut makasivat varastossa yli '
            + 'neljäkymmentä vuotta, ja vasta vuonna 1934 valmistunut '
            + 'valassali antoi niille tilaa. Vuonna 2017 luuranko — 25,2 '
            + 'metriä pitkä, 221 luuta, 4,5 tonnia — nostettiin pääsalin '
            + 'kattoon syöksysukelluksen asentoon suu auki: se on maailman '
            + 'ainoa näin ripustettu sinivalaan luuranko.',
          tiedosto: 'Hope, Hintze Hall, Natural History Museum, London - 1.jpg',
          selite: 'Hope-niminen sinivalaan luuranko Hintze Hallissa, kuvattuna '
            + 'salin parvelta. Luuranko roikkuu katosta syöksyen alaspäin suu '
            + 'auki, ja alaleuka kaartuu pitkälle kävijöiden pään '
            + 'yläpuolelle.',
          lahde: 'APK, Commons (CC BY 4.0)',
          wiki: 'Natural History Museum',
        },
        {
          otsikko: 'Maailman ensimmäinen metro',
          tiedosto: 'Metropolitan Railway, Baker Street Station.jpg',
          teksti: 'Lontoon metro avattiin 10. tammikuuta 1863 maailman '
            + 'ensimmäisenä. Vaunut olivat puuta ja niitä valaistiin '
            + 'kaasulyhdyillä, ja maan alla junaa veti höyryveturi — savu '
            + 'johdettiin ulos tunneliin jätetyistä aukoista. '
            + 'Ensimmäisenä vuonna tehtiin 9,5 miljoonaa matkaa. Nyt '
            + 'asemia on 272 ja rataa 400 kilometriä.',
          selite: 'Baker Streetin asema noin 1863. Krinoliinihameiset '
            + 'matkustajat odottavat laiturilla, ja tunnelin suulla '
            + 'savuaa höyryveturi.',
          lahde: 'Wikimedia Commons (PD)',
          wiki: 'Lontoon metro',
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
          teksti: 'Waterloon aseman laiturien alla kulkee noin kolmesataa metriä '
            + 'pitkä tunneli, jossa seinien maalaaminen on sallittua — '
            + 'muualla Britanniassa luvaton graffiti on rangaistavaa. Tunneli '
            + 'avautui taiteelle toukokuussa 2008, kun Banksy järjesti siellä '
            + 'kolmipäiväisen Cans Festivalin. Autoja ajoi läpi vielä saman '
            + 'vuoden marraskuuhun asti, mutta nyt siellä vain kävellään. '
            + 'Seinät maalataan jatkuvasti uusiksi, joten aamulla ihailtu '
            + 'teos voi olla iltaan mennessä kadonnut toisen alle.',
          tiedosto: '2024-09-26 Leake Street, London graffiti tunnel 01.jpg',
          selite: 'Leake Streetin tunneli syyskuussa 2024, kuvattuna '
            + 'mustavalkoisena. Maali peittää seinät, pilarit ja kattopalkit, '
            + 'mutta asfalttilattia on jäänyt lähes paljaaksi. Tunnelin '
            + 'yläpuolella ovat Waterloon aseman laiturit.',
          lahde: 'Ted Potters, Wikimedia Commons (PD)',
          wiki: 'Banksy',
        },
        {
          otsikko: 'Tyhjä jalusta ja 2 400 ihmistä',
          teksti: 'Trafalgar Squarella on neljä jalustaa. Kolmelle nousi patsas, '
            + 'mutta luoteiskulman jalusta jäi vuonna 1841 tyhjäksi, koska '
            + 'rahat loppuivat kesken. Yli 150 vuoden väittelyn jälkeen '
            + 'päätettiin, ettei sille tule pysyvää patsasta lainkaan: '
            + 'jalustalle nostetaan vuorotellen uusia nykytaideteoksia. '
            + 'Kesällä 2009 teoksena olivat ihmiset itse. Sadan päivän ajan, '
            + 'yötä päivää, 2 400 tavallista ihmistä sai kukin tunnin '
            + 'jalustan päällä ja teki siellä mitä halusi.',
          tiedosto: 'Gormley-OneandOther-4thPlinth-TrafalgarSq-20090706.jpg',
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
          teksti: 'Tate Modern on entinen hiilivoimala Thamesin etelärannalla. '
            + 'Sen turbiinihalli on 155 metriä pitkä ja 35 metriä korkea, ja '
            + 'museo tilaa siihen kerrallaan yhden jättimäisen teoksen. '
            + 'Vuonna 2010 kiinalainen Ai Weiwei levitti hallin lattialle '
            + 'sata miljoonaa auringonkukansiementä. Jokainen siemen oli '
            + 'muotoiltu käsin posliinista ja maalattu yksitellen: noin 1 600 '
            + 'käsityöläistä Jingdezhenin kaupungissa teki niitä yli kaksi '
            + 'vuotta. Museoon pääsee sisään ilmaiseksi.',
          tiedosto: 'Turbine Hall - Tate Modern - geograph.org.uk - 7509077.jpg',
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
          teksti: 'Kensington Gardensissa nousee joka kesä uusi paviljonki. '
            + 'Serpentine-galleria on tilannut sellaisen vuodesta 2000 '
            + 'lähtien, ja säännöt ovat tiukat: arkkitehti ei saa olla '
            + 'aiemmin saanut valmiiksi yhtään rakennusta Englannissa, ja '
            + 'paviljongin on valmistuttava puolessa vuodessa. Syksyllä se '
            + 'puretaan pois. Vuonna 2016 tanskalaisen Bjarke Ingelsin ryhmä '
            + 'latoi nurmikolle 1 802 lasikuitulaatikkoa, jotka aukeavat '
            + 'suorasta seinästä kaartuvaksi tilaksi. Sisällä oli kahvila, '
            + 'iltaisin esityksiä, eikä pääsy maksanut mitään.',
          tiedosto: 'Serpentine Pavilion 2016 I (27776972542).jpg',
          selite: 'Bjarke Ingelsin ryhmän suunnittelema paviljonki kesäkuussa '
            + '2016. Päällekkäin ladotut lasikuitulaatikot kiertyvät auki '
            + 'niin, että suorasta seinästä tulee kolmiulotteinen tila. '
            + 'Rakennelma seisoi gallerian nurmikolla kesäkuusta lokakuuhun.',
          lahde: 'Images George Rex, Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Bjarke Ingels',
        },
        {
          otsikko: 'Veistos, jonka sisällä on liukumäki',
          teksti: 'Stratfordin olympiapuistossa seisoo 114,5 metriä korkea '
            + 'punainen teräsvyyhti, Britannian suurin julkinen taideteos. '
            + 'Sen suunnittelivat kuvanveistäjä Anish Kapoor ja insinööri '
            + 'Cecil Balmond vuoden 2012 olympialaisia varten. Ylhäällä on '
            + 'kaksi näköalatasannetta, ja alas pääsee 455 porrasta pitkin. '
            + 'Vuonna 2016 veistokseen kiedottiin toinen taideteos: Carsten '
            + 'Höllerin 178 metriä pitkä liukumäki, maailman pisin '
            + 'tunneliliukumäki. Matka alas kiertyy kaksitoista kertaa ja '
            + 'kestää noin 40 sekuntia.',
          tiedosto: 'ArcelorMittal Orbit - geograph.org.uk - 6402522.jpg',
          selite: 'ArcelorMittal Orbit tammikuussa 2020. Punaisen teräsristikon '
            + 'ympäri kiertyy harmaa liukumäkiputki, ja ylempänä erottuu '
            + 'näköalatasanteen lasiseinä. Taustalla kohoavat Stratfordin '
            + 'tornitalot.',
          lahde: 'Ian S, Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Anish Kapoor',
        },
        {
          otsikko: 'Guernica maksoi parin saappaita',
          teksti: 'Whitechapelin galleria avattiin vuonna 1901, jotta itäisen '
            + 'Lontoon työläiset pääsisivät näkemään taidetta. Tammikuussa '
            + '1939 siellä oli esillä Picasson Guernica — ainoa kerta, kun '
            + 'teos on ollut Britanniassa. Pääsymaksuksi kelpasi pari '
            + 'kunnollisia saappaita, jotka lähetettiin Espanjan '
            + 'sisällissodan tasavaltalaisille. Kahdessa viikossa maalauksen '
            + 'eteen kertyi satoja saapaspareja ja galleriaan yli 15 000 '
            + 'kävijää. Talo näyttää yhä nykytaidetta, ja sisään pääsee '
            + 'ilmaiseksi.',
          tiedosto: 'Tree of Life, Whitechapel Gallery (8132640664).jpg',
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
    {
      id: 'huumori',
      nimi: 'Huumori',
      johdanto: 'Lontoolainen huumori on tehty kadulla ja lavalla: pilalehden '
        + 'vitsistä, nukketeatterin kirkuvasta äänestä, työläiskortteleiden '
        + 'salakielestä ja koomikoista, jotka nousivat vaivaistalosta '
        + 'maailmanmaineeseen.',
      nostot: [
        {
          otsikko: 'Sana cartoon syntyi vitsistä',
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
          tiedosto: 'SubstanceandShadow.jpg',
          selite: 'Punchin ensimmäinen cartoon heinäkuulta 1843. Yläreunassa '
            + 'lukee CARTOON, No. 1 ja alareunassa SUBSTANCE AND SHADOW. '
            + 'Ryysyinen väki katselee kullattuihin kehyksiin ripustettuja '
            + 'ylhäisön muotokuvia: mukana on kepin varassa kulkeva mies, '
            + 'lapsia rievuissa ja pyörällisellä laudalla istuva raajarikko.',
          lahde: 'John Leech, Wikimedia Commons (PD)',
          wiki: 'Pilapiirros',
        },
        {
          otsikko: 'Nukke, jolla on syntymäpäivä',
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
          tiedosto: 'Near this spot Punch\'s Puppet Show was first performed in England and witnessed by Samuel Pepys 1662.jpg',
          selite: 'Muistolaatta St Paulin kirkon seinässä Covent Gardenissa. '
            + 'Kiveen on hakattu, että lähellä tätä paikkaa Punchin '
            + 'nukketeatteri esitettiin ensi kerran Englannissa ja Samuel '
            + 'Pepys näki sen vuonna 1662. Alin rivi kertoo laatan vuosiluvun '
            + '1962, tasan kolmesataa vuotta myöhemmin.',
          lahde: 'Spudgun67, Wikimedia Commons (CC BY-SA 4.0)',
          wiki: 'Samuel Pepys',
        },
        {
          otsikko: 'Kellot ratkaisevat, kuka on cockney',
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
          tiedosto: 'View of St. Mary-le-Bow church from Cheapside - geograph.org.uk - 7160633.jpg',
          selite: 'St Mary-le-Bow\'n torni kohoaa Cheapside-kadun päässä Lontoon '
            + 'Cityssä. Christopher Wren suunnitteli kirkon vuoden 1666 '
            + 'suurpalon jälkeen, ja juuri tämän tornin kelloja tarkoitetaan, '
            + 'kun puhutaan cockneyn rajoista.',
          lahde: 'Robert Lamb, Wikimedia Commons (CC BY-SA 2.0)',
          wiki: 'Cockney',
        },
        {
          otsikko: 'Kadunlakaisijan nappipuku',
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
          tiedosto: 'Pearly Kings and Queens Harvest Festival 2024 (28).jpg',
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
          tiedosto: 'Charlie Chaplin statue, Leicester Square.jpg',
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
          teksti: 'John Wilton rakensi 1859 ostamansa Mahogany Bar -pubin taakse '
            + 'Tower Hamletsiin salin, johon mahtui 1 500 työläistä istumaan '
            + 'pöytien ääreen kuuntelemaan laulajia ja koomikoita. Katosta '
            + 'riippui sun-burner, jossa paloi 300 kaasuliekkiä ja välkkyi 27 '
            + '000 hiottua kristallia; sen kuumuuden jättämä palojälki näkyy '
            + 'kattoparruissa yhä. Sali ehti olla metodistien lähetysasema ja '
            + 'lumppuvarasto ennen kuin se määrättiin purettavaksi, mutta '
            + 'koomikot Peter Sellers ja Spike Milligan olivat mukana '
            + 'pelastamassa sitä, ja talo suojeltiin huhtikuussa 1971.',
          tiedosto: 'Wilton\'s Music Hall - Interior.jpg',
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
  ],
  /*
   * Venetsian KANSISIVU (maa–kaupunki-pilotti 5.8.2026): kaupungin oma
   * aihe kertoo paikallisen, ja Italian yhteiset aiheet tulevat perään
   * js/packs/maa-kategoriat.js:stä (ks. js/ui.js rakennaSivut).
   * Nostot siirrettiin europe-kulttuuri.js:n litteästä taulusta
   * sellaisinaan — kuvat on tarkistettu jo silloin ja ne ovat
   * peilissä. Litteään tauluun jäi vain kulttuurivisa (v220 sääntö).
   */
  venetsia: [
    {
      id: 'kaupunki',
      nimi: 'Venetsia',
      johdanto: 'Kaupunki, joka päätti rakentaa itsensä veteen — ja '
        + 'teki mahdottomasta tunnusmerkkinsä.',
      /*
       * Lehden etusivun kuvat (omistajan toive 5.8.2026): oma,
       * tarkistettu valinta wikin satunnaiskarusellin sijaan.
       * Ensimmäinen on iso pääkuva maston alla, loput pienempien
       * kuvien rivissä esittelyn jälkeen. Napautus avaa selattavan
       * suurennoksen.
       */
      kansikuvat: [
        {
          tiedosto: 'Aerial photographs of Venice 2013, Anton Nossik, 045.jpg',
          selite: 'Markuksentori ja dogen palatsi ilmasta — koko '
            + 'kaupunki seisoo keskellä laguunia.',
          lahde: 'Anton Nosik, Wikimedia Commons (CC BY 3.0)',
        },
        {
          tiedosto: 'Canal Grande Chiesa della Salute e Dogana dal ponte dell Accademia.jpg',
          selite: 'Canal Grande ja Santa Maria della Saluten kupolit '
            + 'Accademian sillalta.',
          lahde: 'Wolfgang Moroder, Wikimedia Commons (CC BY-SA 3.0)',
        },
        {
          tiedosto: 'Rialto Gondoliers.jpg',
          selite: 'Rialton silta on ylittänyt pääkanavan yli '
            + 'neljäsataa vuotta.',
          lahde: 'Saffron Blaze, Wikimedia Commons (CC BY-SA 3.0)',
        },
      ],
      nostot: [
        {
          otsikko: 'Canaletto maalasi kaupunkinsa',
          tiedosto: 'Canal, Giovanni Antonio (Canaletto) - Return of the Bucentoro to the Molo on Ascension Day, c. 1733-4. Royal Collection Buckingham Palace.jpg',
          teksti: 'Venetsialainen Canaletto maalasi 1700-luvulla '
            + 'kaupunkinsa näkymiä niin tarkasti, että tutkijat '
            + 'käyttävät niitä yhä lähteinä. Maalauksia ostivat etenkin '
            + 'englantilaiset matkailijat muistoksi suurelta '
            + 'Euroopan-kiertueeltaan.',
          selite: 'Bucintoron paluu Molon rantaan helatorstaina '
            + '(n. 1733): dogen kullattu juhlalaiva palaa seremoniasta, '
            + 'jossa Venetsia "vihittiin" merensä kanssa heittämällä '
            + 'sormus aaltoihin. Taustalla dogen palatsi ja kellotorni '
            + '— näkymä on sama tänäänkin.',
          lahde: 'Canaletto, Wikimedia Commons (PD)',
          wiki: 'Canaletto',
          /*
           * Selattava galleria (omistajan toive 5.8.2026): lisää
           * Canaletton vedutoja saman noston nuolista. Ensimmäinen teos
           * on noston oma tiedosto; selite ja lähderivi vaihtuvat
           * teoksen mukana. Kaikki maalaukset ovat PD — lähderivi
           * nimeää valokuvaajan, kun museokuva on CC-lisensoitu.
           */
          galleria: [
            {
              otsikko: 'Kivenhakkaajien piha',
              tiedosto: 'Canaletto - The Stonemason\'s Yard.jpg',
              selite: 'Kivenhakkaajien piha (n. 1725): Campo San '
                + 'Vidalilla veistetään kiveä kirkon korjaustöihin. '
                + 'Harvinainen näkymä arjen Venetsiasta — ei juhlaa '
                + 'vaan työtä, pyykkinaruja ja leikkiviä lapsia.',
              lahde: 'Canaletto, Wikimedia Commons (PD)',
            },
            {
              otsikko: 'Markuksentori',
              tiedosto: 'Canaletto - The Piazza San Marco in Venice - Google Art Project.jpg',
              selite: 'Markuksentori (n. 1724): basilika ja kellotorni '
                + 'nuoren Canaletton siveltimellä. Kauppiaiden kojut '
                + 'täyttävät torin — se oli silloinkin kaupungin '
                + 'olohuone.',
              lahde: 'Canaletto, Wikimedia Commons (PD)',
            },
            {
              otsikko: 'Canal Granden suu',
              tiedosto: 'Canaletto - The Entrance to the Grand Canal, Venice - Google Art Project.jpg',
              selite: 'Canal Granden suu ja Santa Maria della Saluten '
                + 'kupolikirkko (n. 1730). Kirkko rakennettiin '
                + 'kiitokseksi ruton väistymisestä, ja sen portaille '
                + 'kuljetaan yhä joka marraskuu siltaa pitkin juhlimaan.',
              lahde: 'Canaletto, Wikimedia Commons (PD)',
            },
            {
              otsikko: 'Regatta Canal Grandella',
              tiedosto: 'Canal, Giovanni Antonio Canal - Venice, A Regatta on the Grand Canal - National Gallery NG938.jpg',
              selite: 'Regatta Canal Grandella (n. 1740): kevyet '
                + 'kilpagondolat kiitävät väkijoukon editse, ja '
                + 'parvekkeet on verhoiltu juhlakankain. Sama '
                + 'soutukilpailu soudetaan Venetsiassa yhä joka syksy.',
              lahde: 'Canaletto, Wikimedia Commons (PD)',
            },
            {
              otsikko: 'Rio dei Mendicanti',
              tiedosto: 'Ca\' Rezzonico - Il rio dei Mendicanti - Canaletto.jpg',
              selite: 'Rio dei Mendicanti (n. 1723): varhainen '
                + 'Canaletto sivukanavan varrelta. Ikkunoissa kuivuu '
                + 'pyykkiä ja rannassa korjataan veneitä — tavallista '
                + 'Venetsiaa ilman juhlapukua.',
              lahde: 'Didier Descouens, Wikimedia Commons (CC BY-SA 4.0)',
            },
          ],
        },
        {
          otsikko: 'Cicchetti ja Rialton tori',
          tiedosto: 'Pescaria Rialto Venice.jpg',
          teksti: 'Venetsialaiset syövät cicchettejä — pieniä suupaloja '
            + '— seisten bacaro-baarien tiskillä, ja viinilasillista '
            + 'kutsutaan nimellä ombra, varjo. Raaka-aineet tulevat '
            + 'Rialton torilta, jossa laguunin kalaa on myyty satojen '
            + 'vuosien ajan.',
          selite: 'Rialton kalatorin pylväshalli Canal Granden '
            + 'varrella. Kauppa käy aamuisin: laguunin ja Adrianmeren '
            + 'kalat ja äyriäiset tuodaan suoraan veneillä hallin '
            + 'laituriin.',
          lahde: 'Wolfgang Moroder, Wikimedia Commons (CC BY-SA 3.0)',
        },
        {
          otsikko: 'Vivaldi, punainen pappi',
          tiedosto: 'Antonio Vivaldi.jpg',
          teksti: 'Antonio Vivaldi — punatukkainen pappi, il Prete '
            + 'Rosso — opetti viulunsoittoa venetsialaisessa tyttöjen '
            + 'orpokodissa ja sävelsi sen orkesterille satoja '
            + 'konserttoja. Kuuluisin on Neljä vuodenaikaa, jossa '
            + 'musiikista voi kuulla linnunlaulun ja ukkosmyrskyn.',
          selite: 'Ainoa varma Vivaldin muotokuva: François Morellon '
            + 'la Caven kaiverrus vuodelta 1725. Säveltäjä pitelee '
            + 'nuottivihkoa — peruukin alla hehkui lempinimen antanut '
            + 'punainen tukka.',
          lahde: 'François Morellon la Cave, Wikimedia Commons (PD)',
          wiki: 'Antonio Vivaldi',
          musiikki: 'https://music.apple.com/fi/artist/antonio-vivaldi/242604',
          musiikkiNimi: 'Antonio Vivaldi Apple Musicissa',
        },
      ],
    },
  ],
};
