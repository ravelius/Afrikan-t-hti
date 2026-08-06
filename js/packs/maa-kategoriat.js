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
 */

export const MAA_KATEGORIAT = {
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
          tiedosto: 'Giuseppe Garibaldi (1866).jpg',
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
          musiikki: 'https://music.apple.com/fi/artist/paco-de-luc%C3%ADa/463800',
          musiikkiNimi: 'Paco de Lucía Apple Musicissa',
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
  ],
};
