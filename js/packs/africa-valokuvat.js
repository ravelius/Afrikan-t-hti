// Vanhat valokuvat muistikirjan tueksi: yksi aikakauden mustavalkokuva
// per kaupunki sieltä, mistä sellainen löytyi vapaalla lisenssillä.
// Kuvat haetaan Wikimedia Commonsista (Special:FilePath skaalaa suoraan),
// lisenssi on varmistettu tiedostokohtaisesti (PD / CC0 / CC BY-SA) ja
// lähde näytetään postikortin kuvatekstissä. Ilman verkkoa pikkukuva jää
// siististi pois. Kaupungit, joille kelvollista vanhaa kuvaa ei vielä
// löytynyt, puuttuvat listalta — niitä täydennetään kun hyvä löytyy.
//
// `selite` on postikortin alle kirjoitettava parin lauseen kuvaus siitä,
// mitä kuvassa näkyy (omistajan toive). Lähde näytetään pienemmällä.
export const AFRICA_VALOKUVAT = {
  tanger: {
    tiedosto: 'Tangier Grand Mosque 1900s.jpg',
    vuosi: '1900-luvun alku',
    lahde: 'Commons (PD)',
    selite: 'Tangerin suurmoskeijan kulmalla kävi vilske jo isoisän aikaan: '
      + 'kantajia, kauppiaita ja aaseja samalla kapealla kadulla.',
    // Uusi kuva pilkottaa vanhan alta (omistajan kokeilu).
    uusi: {
      tiedosto: 'Panorama Tanger Bay Tangier Marokko.jpg',
      lahde: 'Herbert wie, Commons (CC BY-SA 4.0)',
      selite: 'Sama kaupunki nykyään: valkoiset talot kiipeävät yhä '
        + 'rinnettä, mutta lahden rantaan on kasvanut moderni satama.',
    },
  },
  kairo: {
    tiedosto: 'Kairo, marchands ambulants LCCN2017657437.jpg',
    vuosi: '1890-luku',
    lahde: 'Library of Congress (PD)',
    selite: 'Kiertäviä kauppiaita Kairon kadulla. Vesimyyjä kantoi tavaransa '
      + 'selässään ja huusi kaupan kilpaa muiden kanssa.',
    uusi: {
      tiedosto: 'Cairo-Hilton-Skyline.jpg',
      lahde: 'Bluemask, Commons (CC BY-SA 3.0)',
      selite: 'Nykyinen Kairo nousee Niilin rannalla korkeuksiin — mutta '
        + 'joki virtaa keskellä yhtä tyynenä kuin ennenkin.',
    },
  },
  tripoli: {
    tiedosto: 'Arabs in Tripoli WDL2444.png',
    vuosi: '1910-luku',
    lahde: 'World Digital Library (PD)',
    selite: 'Väkeä koolla Tripolin muurien kupeessa. Valkoiset viitat '
      + 'suojasivat sekä auringolta että aavikon hiekalta.',
    uusi: {
      tiedosto: 'The Green Square at Tripoli, Libya - panoramio.jpg',
      lahde: 'Cüneyt Türksen, Commons (CC BY 3.0)',
      selite: 'Sama aukio muurien kupeessa nykyään: Marttyyrien aukio on yhä '
      + 'kaupungin sydän, ja vanha linnoitus vartioi sen laitaa.',
    },
  },
  murzuk: {
    tiedosto: 'Osmanisches Fort von Mursuk.jpg',
    vuosi: null,
    lahde: 'Commons (PD)',
    selite: 'Murzukin linnoitus vartioi Saharan karavaanireittiä. Sen '
      + 'savimuurien varjossa lepäsivät sekä kamelit että kauppiaat.',
    uusi: {
      tiedosto: 'Murzuq - Festung Qala at Turk über dem Ort.jpg',
      lahde: 'Franzfoto, Commons (CC BY-SA 3.0)',
      selite: 'Sama savilinnoitus kohoaa Murzukin kattojen yllä yhä — '
      + 'karavaanit ovat vaihtuneet autoihin, mutta aavikko alkaa '
      + 'entisestä paikasta.',
    },
  },
  alkufra: {
    tiedosto: 'Kufra (aeroview).jpg',
    vuosi: 'noin 1930',
    lahde: 'Commons (PD)',
    selite: 'Kufran keitaat ilmasta kuvattuna: palmulehtoja ja suolajärviä '
      + 'keskellä hiekkamerta, päivien matkan päässä kaikesta.',
    uusi: {
      tiedosto: 'ISS-50 Al-Jawf Oasis in Eastern Libya.jpg',
      lahde: 'NASA (PD)',
      selite: 'Kufran keitaat nykyään avaruudesta: vihreät kastelupellot '
      + 'piirtyvät täysinä ympyröinä keskelle hiekkamerta.',
    },
  },
  gao: {
    tiedosto: 'ETH-BIB-Grabmal von Askia, Gao-Tschadseeflug 1930-31-LBS MH02-08-0548.tif',
    vuosi: '1930–31',
    lahde: 'ETH-Bibliothek (PD)',
    selite: 'Askian hauta Gaossa — savesta muurattu pyramidi, jonka piikit '
      + 'ovat rakennustelineiksi jätettyjä puunrunkoja. Songhain '
      + 'suurvallan mahtavin muistomerkki.',
    uusi: {
      tiedosto: '2014.11.29 - Tombeau des Askia.jpg',
      lahde: 'Commons (CC0)',
      selite: 'Askian hauta seisoo yhä — puupiikit törröttävät savesta kuten '
      + 'viisisataa vuotta sitten, ja muuraus uusitaan käsin joka '
      + 'vuosi.',
    },
  },
  dakar: {
    tiedosto: 'Dakar mosque circa 1900.jpg',
    vuosi: 'noin 1900',
    lahde: 'E. Fortier (PD)',
    selite: 'Dakarin moskeija minareetteineen nuoren satamakaupungin '
      + 'keskellä. Kuvan otti postikorteistaan tunnettu Edmond Fortier.',
    uusi: {
      tiedosto: 'Gorée 2024 - Vue de Dakar - 17.jpg',
      lahde: 'Fawaz.tairou, Commons (CC BY 4.0)',
      selite: 'Dakar mereltä nähtynä nykyään: nuoresta satamakaupungista on '
      + 'kasvanut miljoonien asukkaiden pääkaupunki, jonka tornit '
      + 'nousevat niemen kärkeen.',
    },
  },
  sierraleone: {
    tiedosto: 'Cotton Tree Railway Station 3.30 p.m. Bungalow Train, Freetown.jpg',
    vuosi: '1910-luku',
    lahde: 'Lisk-Carew Brothers (PD)',
    selite: 'Iltapäiväjuna lähdössä Freetownin Cotton Tree -asemalta. '
      + 'Kaupungin kuuluisa puuvillapuu kasvaa yhä samalla paikalla.',
    uusi: {
      tiedosto: 'Cotton tree in Freetown, SL - Mapillary (yIBZ74r6IsUFOaWtAPwhWw).jpg',
      lahde: 'danbjoseph @ Mapillary.com, Commons (CC BY-SA 4.0)',
      selite: 'Sama puuvillapuu sata vuotta myöhemmin keskellä '
      + 'liikenneympyrää. Vanhus kaatui lopulta myrskyssä 2023, ja sen '
      + 'taimista kasvatetaan seuraajaa.',
    },
  },
  kappalmas: {
    tiedosto: 'HEARD(1898) 50 Church of Harper, Cape Palmas.jpg',
    vuosi: '1898',
    lahde: 'W. H. Heard (PD)',
    selite: 'Harperin kirkko Kap Palmasin niemellä. Sen torni näkyi kauas '
      + 'merelle ja toimi purjehtijoiden maamerkkinä.',
    uusi: {
      tiedosto: 'Harper, Liberia - panoramio (1).jpg',
      lahde: 'blk24ga, Commons (CC BY 3.0)',
      selite: 'Harperin kaupunki Kap Palmasin niemellä nykyään: palmut, '
      + 'peltikatot ja Atlantin ranta samassa kuvassa.',
    },
  },
  kumasi: {
    tiedosto: 'Kumasi 28-03-1900 sx.jpg',
    vuosi: '1900',
    lahde: 'Commons (PD)',
    selite: 'Kumasin kattoja vuonna 1900. Ashantien pääkaupunki oli tuolloin '
      + 'yksi Länsi-Afrikan suurimpia kaupunkeja.',
    uusi: {
      tiedosto: 'Modern market hall of Kejetia market.jpg',
      lahde: 'Commons (CC0)',
      selite: 'Kumasin Kejetia-tori sai 2010-luvulla katon: uusi halli on '
      + 'Länsi-Afrikan suurimpia kauppapaikkoja, ja tungos on sama kuin '
      + 'ennenkin.',
    },
  },
  orjarannikko: {
    tiedosto: 'São João Baptista de Ajudá 1920s.jpg',
    vuosi: '1920-luku',
    lahde: 'Commons (PD)',
    selite: 'Ouidahin vanha portugalilaislinnake, Orjarannikon synkän '
      + 'historian vartiopaikka. Isoisän aikaan sen muurit olivat jo '
      + 'rapistumassa.',
    uusi: {
      tiedosto: 'Porte du non-retour au Benin.jpg',
      lahde: 'Commons (CC0)',
      selite: 'Ouidahin rannalla seisoo nykyään Paluuttomuuden portti — '
      + 'muistomerkki niille, jotka vietiin täältä laivoihin eivätkä '
      + 'koskaan palanneet.',
    },
  },
  kano: {
    tiedosto: 'View-Kano city-1911.jpg',
    vuosi: '1911',
    lahde: 'E. D. Morel (PD)',
    selite: 'Kanon savitaloja ja muureja vuonna 1911. Koko vanha kaupunki '
      + 'on rakennettu auringossa kuivatusta savesta.',
    uusi: {
      tiedosto: 'Ganuwa or Badala - Kano City Wall - Outside Sabuwar Kofa.jpg',
      lahde: 'Suleiman Umar ym., Commons (CC BY-SA 4.0)',
      selite: 'Kanon vanhoja savimuureja on jäljellä yhä, ja portit kantavat '
      + 'vanhoja nimiään. Muurien sisällä värjätään kangasta samoissa '
      + 'kuopissa kuin 500 vuotta sitten.',
    },
  },
  kongo: {
    tiedosto: 'Livingstone steamer, Congo, ca. 1902-1915 (IMP-CSCNWW33-OS10-73).jpg',
    vuosi: '1902–1915',
    lahde: 'Commons (PD)',
    selite: 'Höyrylaiva Livingstone Kongojoella. Joki oli sisämaan valtatie: '
      + 'laivat kuljettivat kaiken kylistä kaupunkeihin ja takaisin.',
    uusi: {
      tiedosto: 'Congo River from Kinshasa in Democratic Republic of the Congo (DRC).jpg',
      lahde: 'EdwinAlden.1995, Commons (CC BY-SA 4.0)',
      selite: 'Kongojoki Kinshasan rannasta nykyään. Höyrylaivojen tilalla '
      + 'puksuttavat proomut, mutta joki on yhä sisämaan valtatie.',
    },
  },
  angola: {
    tiedosto: "Saint-Paul de Luanda, port de (l')Angola dans le Portugal africain (vue générale) - btv1b6932475d.jpg",
    vuosi: '1914',
    lahde: 'Agence Rol / BnF (PD)',
    selite: 'Luandan satama ja rantakatu vuonna 1914. Lahden suojissa '
      + 'lepäsi purjelaivoja ja höyryaluksia rinnakkain.',
    uusi: {
      tiedosto: 'Marginal de Luanda HD Dji Mavic 3 Classic - By Délcio Geovany Borges.jpg',
      lahde: 'Iamdelcioborges, Commons (CC BY 4.0)',
      selite: 'Luandan lahti nykyään: purjelaivojen rantakadusta on kasvanut '
      + 'tornien reunustama rantabulevardi, Marginal.',
    },
  },
  kapkaupunki: {
    tiedosto: 'Cape Town tram, Adderley Street - ca. 1900.jpg',
    vuosi: 'noin 1900',
    lahde: 'Commons (PD)',
    selite: 'Raitiovaunu Kapkaupungin Adderley Streetillä. Kadun päästä '
      + 'alkoi satama, toisesta päästä kohosi Pöytävuori.',
    uusi: {
      tiedosto: 'Adderley Street.jpg',
      lahde: 'HelenOnline, Commons (CC BY-SA 4.0)',
      selite: 'Sama Adderley Street nykyään: raitiovaunut ovat poissa, mutta '
      + 'katu johtaa yhä satamasta kohti Pöytävuorta.',
    },
  },
  kimberley: {
    tiedosto: 'Twee gezichten op de mijn Die Groot Gat te Kimberley Diamond fields-Kimberley mine (titel op object) Diamond fields-Tramway, Kimberley mine (titel op object), RP-F-2001-7-425-25.jpg',
    vuosi: 'noin 1870',
    lahde: 'Rijksmuseum (CC0)',
    selite: 'Kimberleyn timanttikaivos alkuaikoinaan: tuhannet kaivajat '
      + 'louhivat kuoppaa käsin, köysiradat kuljettivat maata ylös. '
      + 'Kuopasta kasvoi lopulta Iso Reikä.',
    uusi: {
      tiedosto: 'Big Hole Kimberley.jpg',
      lahde: 'Rudolph Botha, Commons (CC BY-SA 3.0)',
      selite: 'Käsin kaivettu kuoppa on nykyään Iso Reikä: puoli kilometriä '
      + 'leveä ja pohjalla vihreä järvi. Se on suurimpia ihmisen '
      + 'lapiolla kaivamia kuoppia maailmassa.',
    },
  },
  madagaskar: {
    tiedosto: "Tananarive-Temple d'Andohalo.jpg",
    vuosi: 'noin 1900',
    lahde: 'Commons (PD)',
    selite: 'Antananarivon kukkulakaupunkia Madagaskarilla. Talot '
      + 'kipuavat rinnettä kohti Andohalon aukiota ja sen kirkkoa.',
    uusi: {
      tiedosto: "Analakely vu d'en haut, Madagascar.jpg",
      lahde: 'Cactus0625, Commons (CC BY-SA 4.0)',
      selite: 'Antananarivon keskusta nykyään ylhäältä: Analakelyn '
      + 'torikatokset ja pastellitalot täyttävät laakson, ja kukkulat '
      + 'reunustavat kaupunkia kuten ennenkin.',
    },
  },
  sansibar: {
    tiedosto: 'Panorama van de haven van Zanzibar Panorama of Zanzibar (titel op object) Zanzibar (titel op object), RP-F-F00999-DD.jpg',
    vuosi: 'noin 1900',
    lahde: 'Rijksmuseum (CC0)',
    selite: 'Sansibarin satama purjealuksineen. Mausteiden tuoksu kantoi '
      + 'kuulemma merelle asti, ennen kuin kaupunki edes näkyi.',
    uusi: {
      tiedosto: 'Harbour at the picturesque Stone Town.jpg',
      lahde: 'Dr, Commons (CC BY 4.0)',
      selite: 'Sansibarin satama nykyään: dhow-purjeet ovat harvinaistuneet, '
      + 'mutta Kivikaupungin rantaviiva on tunnistettavasti sama.',
    },
  },
  kilimandzaro: {
    tiedosto: 'Bundesarchiv Bild 105-DOA0437, Deutsch-Ostafrika, Kilimandscharo, Gummiplantage.jpg',
    vuosi: '1906–1918',
    lahde: 'Walther Dobbertin, Bundesarchiv (CC BY-SA 3.0 de)',
    selite: 'Viljelmiä Kilimandžaron juurella. Lumihuippu häämöttää pilvien '
      + 'takana — keskellä Afrikkaa, lähes päiväntasaajalla.',
    uusi: {
      tiedosto: 'The view of mountain Kilimanjaro from Moshi town in Tanzania.jpg',
      lahde: 'Prosper Phissoo, Commons (CC BY-SA 4.0)',
      selite: 'Kilimandžaro Moshin kaupungin yltä nykyään. Lumihuippu on '
      + 'kutistunut isoisän ajoista, mutta kohoaa yhä yksin savannin '
      + 'yllä.',
    },
  },
  tanganjika: {
    tiedosto: 'Memorial tablet marking the spot where Livingstone and Stanley met at Ujiji in 1871 ATLIB 305982.png',
    vuosi: '1903',
    lahde: 'A. P. Godber (PD)',
    selite: 'Muistolaatta Ujijissa Tanganjikajärven rannalla — paikassa, '
      + 'jossa Stanley löysi kadonneen Livingstonen vuonna 1871 ja '
      + 'tervehti: "Tohtori Livingstone, otaksun?"',
    uusi: {
      tiedosto: 'Lake Tanganyika ,Kigoma port.jpg',
      lahde: 'Erasmus Kamugisha, Commons (CC BY-SA 4.0)',
      selite: 'Kigoman satama Tanganjikajärvellä nykyään — Ujijin naapurissa, '
      + 'jossa Stanley ja Livingstone kohtasivat. Järvellä liikennöi '
      + 'yhä yli satavuotias höyrylaiva Liemba.',
    },
  },
  addisabeba: {
    tiedosto: 'British delegation Addis Abeba.jpg',
    vuosi: '1930',
    lahde: 'Commons (PD)',
    selite: 'Juhlakulkue Addis Abebassa keisari Haile Selassien '
      + 'kruunajaisvuonna 1930. Koko maailma lähetti edustajansa '
      + 'vuoristopääkaupunkiin.',
    uusi: {
      tiedosto: 'AddisView.jpg',
      lahde: 'DaneyWiki, Commons (CC BY-SA 4.0)',
      selite: 'Addis Abeba nykyään: kruunajaiskulkueiden kaupunki on Afrikan '
      + 'diplomatian pääkaupunki, jonka ylle nousee tornitalo toisensa '
      + 'perään.',
    },
  },
  rashafun: {
    tiedosto: 'Garesadihafun.jpg',
    vuosi: '1900-luvun alku',
    lahde: 'Commons (PD)',
    selite: 'Vanha garesa-linnoitus Hafunin niemellä, Afrikan itäisimmässä '
      + 'kärjessä. Monsuunituulet toivat tänne purjehtijoita jo tuhat '
      + 'vuotta sitten.',
    uusi: {
      tiedosto: 'Hafun from space.jpg',
      lahde: 'NASA (PD)',
      selite: 'Hafunin niemi avaruudesta: Afrikan itäisin kärki työntyy '
      + 'Intian valtamereen kapean hiekkakannaksen päässä.',
    },
  },

  // --- Täydennys (omistajan pyyntö: loput vanhat kuvat). Saharan
  // 1907-kortti hylättiin, koska se on siirtomaanäyttelyssä esitellyn
  // ihmisen kuva. Viimeiset viisi paikkaa saivat kuvansa v.105:ssä:
  // aikakauden valokuvan puuttuessa käytetään vanhinta vapaata kuvaa
  // (Ahaggar 1991) tai aikakauden piirrosta/karttaa (Mosambik 1655,
  // Bahr el Ghazal 1903) — selite kertoo asian rehellisesti.
  karthago: {
    tiedosto: 'Tunisie, Carthage, cathédrale et séminaire de St Louis - btv1b53114044m.jpg',
    vuosi: '1800-luvun loppu',
    lahde: 'BnF Gallica (PD)',
    selite: 'Karthagon Byrsan kukkula isoisän aikaan: raunioiden keskelle '
      + 'oli noussut katedraali, ja kaivaukset olivat vasta alussa.',
    uusi: {
      tiedosto: '01996 01434 Ruins of Antonine Baths at Carthage.jpg',
      lahde: 'Silar, Commons (CC BY-SA 4.0)',
      selite: 'Karthagon kaivaukset valmistuivat kertomaan tarinansa: '
      + 'Antoninuksen termien rauniot ovat nykyään maailmanperintökohde '
      + 'meren äärellä.',
    },
  },
  marrakech: {
    tiedosto: 'Marrakech Minaret depuis la rue animée - sap04 10l01821 p.jpg',
    vuosi: 'noin 1924',
    lahde: 'Lucien Roy, Ministère de la Culture (CC BY-SA 4.0)',
    selite: 'Vilkas katu Marrakechissa ja taustalla Koutoubian minareetti — '
      + 'sama torni, jonka mukaan kaupungissa suunnistetaan yhä.',
    uusi: {
      tiedosto: 'Kutubiyya Mosque, Marrakesh, Morocco, 20250124 1834 7027.jpg',
      lahde: 'Jakub Hałun, Commons (CC BY 4.0)',
      selite: 'Sama Koutoubian minareetti nykyään. Sen yli ei saa '
      + 'Marrakechissa yhä rakentaa, joten torni hallitsee kaupunkia '
      + 'kuten 800 vuotta sitten.',
    },
  },
  timbuktu: {
    tiedosto: 'Timbuktu, 1906.png',
    vuosi: '1906',
    lahde: 'Commons (PD)',
    selite: 'Timbuktun savutaloja ja hiekkakatuja vuonna 1906. Kaupunki oli '
      + 'juuri se salaperäinen aavikon satama, josta Euroopassa tarinoitiin.',
    uusi: {
      tiedosto: 'Sankore Mosque in Timbuktu.jpg',
      lahde: 'upyernoz, Commons (CC BY 2.0)',
      selite: 'Sankoren moskeija nykyään — savesta muurattu yliopisto, jossa '
      + 'opiskeltiin jo 1400-luvulla. Seinät rapataan talkoilla '
      + 'uudelleen joka vuosi.',
    },
  },
  lagos: {
    tiedosto: 'Lagos, 1929.jpg',
    vuosi: '1929',
    lahde: 'The National Archives UK (OGL)',
    selite: 'Lagosin satamakatua vuonna 1929: kauppahuoneita ja laitureita '
      + 'laguunin rannalla — kaupunki oli jo silloin Länsi-Afrikan '
      + 'vilkkaimpia.',
    uusi: {
      tiedosto: 'Lagos Island City Scape.jpg',
      lahde: 'Jamie Tubers, Commons (CC BY-SA 4.0)',
      selite: 'Lagosin saari nykyään: laguunikaupungista on kasvanut Afrikan '
      + 'suurimpia metropoleja, jonka tornit nousevat samalta rannalta '
      + 'kuin kauppahuoneet ennen.',
    },
  },
  tshadjarvi: {
    tiedosto: 'ETH-BIB-Ufer des Tschadsee-Tschadseeflug 1930-31-LBS MH02-08-0976.tif',
    vuosi: '1930–31',
    lahde: 'ETH-Bibliothek, Mittelholzer (PD)',
    selite: 'Tšad-järven rantaa ilmasta Walter Mittelholzerin kuuluisalla '
      + 'Afrikan-lennolla — juuri sellaiselta matkalta, joista isoisäkin '
      + 'luki lehdistä.',
    uusi: {
      tiedosto: 'Waving fisherman on Lake Chad (detilt).jpg',
      lahde: 'Coolthoom1 Removed tilt: Hike395, Commons (CC BY-SA 4.0)',
      selite: 'Kalastaja Tšad-järvellä nykyään. Järvi on kutistunut '
      + 'murto-osaan isoisän ajoista, mutta ruokkii yhä miljoonia '
      + 'ihmisiä neljässä maassa.',
    },
  },
  kamerun: {
    tiedosto: 'People gathered before a church, Cameroon, ca.1910-1920 (IMP-YDS-RG101-012-0000-0036).jpg',
    vuosi: '1910-luku',
    lahde: 'Yale Divinity School (PD)',
    selite: 'Väkeä koolla kirkon edustalla Kamerunissa 1910-luvulla — '
      + 'vuoren juurella kohtasivat tuolloin monet maailmat.',
    uusi: {
      tiedosto: 'Mount Cameroon view from Buea (Soppo).jpg',
      lahde: 'Yona Tientcheu, Commons (CC BY-SA 4.0)',
      selite: 'Kamerunvuori Buean kaupungin yltä nykyään. Tulivuori on yhä '
      + 'toiminnassa — viimeksi se purkautui vuonna 2000.',
    },
  },
  namib: {
    tiedosto: 'Lüderitzbucht, Deutsch-Südwestafrika. The newly finished pier with an Illing locomotive, February 1908, photograph by de Meillon.jpg',
    vuosi: '1908',
    lahde: 'Commons (PD)',
    selite: 'Lüderitzin uusi laituri Namibin rannikolla 1908: veturi ja '
      + 'nostokurjet keskellä maailman vanhinta aavikkoa.',
    uusi: {
      tiedosto: 'Lüderitz.jpg',
      lahde: 'SkyPixels, Commons (CC BY-SA 4.0)',
      selite: 'Lüderitz nykyään: saksalaisajan jugendtalot seisovat '
      + 'värikkäinä aavikon ja Atlantin välissä, ja laituri on edelleen '
      + 'paikallaan.',
    },
  },
  sthelena: {
    tiedosto: 'The drama of Saint Helena (1910) (14777842132).jpg',
    vuosi: '1910',
    lahde: 'Internet Archive (PD)',
    selite: 'Näkymä St. Helenalle 1910 julkaistun kirjan sivuilta — jyrkät '
      + 'kalliot ottivat vastaan jokaisen saapujan, keisarista '
      + 'matkalaiseen.',
    uusi: {
      tiedosto: "Jacob's Ladder near St. James Cathedral in Jamestown Saint Helena.jpg",
      lahde: 'Kevstan, Commons (CC BY-SA 4.0)',
      selite: 'Jamestown nykyään: Jaakobin portaat — 699 askelmaa — nousevat '
      + 'laakson pohjalta jyrkänteelle. Saarelle pääsee nykyisin myös '
      + 'lentäen.',
    },
  },
  viktorianputoukset: {
    tiedosto: 'Victoria Falls Bridge 1905.jpg',
    vuosi: '1905',
    lahde: 'Commons (PD)',
    selite: 'Putousten rautatiesilta juuri valmistuneena 1905. Se '
      + 'rakennettiin niin lähelle, että vaunuihin sataa vesisumua — '
      + 'suunnittelijan tarkoituksella.',
    uusi: {
      tiedosto: 'Victoria Falls Bridge and Zambezi river.jpg',
      lahde: 'Ninaras, Commons (CC BY-SA 4.0)',
      selite: 'Sama silta nykyään Sambian ja Zimbabwen rajalla. Junien '
      + 'rinnalle ovat tulleet benjihyppääjät — vesisumu kastelee yhä '
      + 'molemmat.',
    },
  },
  nairobi: {
    tiedosto: 'Photograph of Kenyan Sikh pioneers in-front of Gurdwara Sahib Railway Landhies in Nairobi, Kenya, 1903.jpg',
    vuosi: '1903',
    lahde: 'Commons (PD)',
    selite: 'Rautatien rakentajia Nairobissa 1903 — kaupunki oli tuolloin '
      + 'vasta muutaman vuoden ikäinen ratatyöläisten leiri.',
    uusi: {
      tiedosto: 'A giraffe with a beautiful background of Nairobi City Skyline.jpg',
      lahde: 'Alexmbogo, Commons (CC BY-SA 4.0)',
      selite: 'Sama kaupunki sata vuotta myöhemmin: kirahvi laiduntaa '
        + 'kansallispuistossa keskustan tornien katseen alla.',
    },
  },
  darfur: {
    tiedosto: 'Sultan Ali Dinar.jpg',
    vuosi: '1910-luku',
    lahde: 'Commons (CC0)',
    selite: 'Ali Dinar, Darfurin viimeinen sulttaani, virallisessa '
      + 'muotokuvassaan. Hänen valtakautensa päättyi 1916 — vain '
      + 'kymmenkunta vuotta ennen isoisän matkaa.',
    uusi: {
      tiedosto: 'ElFasherDarfurSudan RomanDeckert18022015.jpg',
      lahde: 'RomanDeckert, Commons (CC BY-SA 4.0)',
      selite: 'El Fasher, Darfurin vanha sulttaanien kaupunki, savitalojen ja '
      + 'hiekkakatujen laajana mattona ennen nykyistä sotaa.',
    },
  },
  suakin: {
    tiedosto: 'TheLandingPlaceAtSuakim(Suakin)1871.jpg',
    vuosi: '1871',
    lahde: 'Commons (PD)',
    selite: 'Suakinin laituripaikka 1871: dhow-veneitä ja korallitaloja '
      + 'saaren rannassa, kun satama oli vielä täydessä kukassaan.',
    uusi: {
      tiedosto: 'Suakin,custom office.jpg',
      lahde: 'Bertramz, Commons (CC BY 3.0)',
      selite: 'Suakinin korallitalot ovat nykyään rauniokaupunki, jota on '
      + 'alettu entisöidä. Punaisenmeren helmen kadut ovat hiljentyneet '
      + '— dhow-veneet käyvät yhä.',
    },
  },
  sahara: {
    tiedosto: 'ETH-BIB-Fokker in der Sahara-Tschadseeflug 1930-31-LBS MH02-08-0405.tif',
    vuosi: '1930–31',
    lahde: 'ETH-Bibliothek, Mittelholzer (PD)',
    selite: 'Mittelholzerin Fokker aavikkokentällä Saharan ylityksellä — '
      + 'juuri niitä lentoja, joista isoisän aikaan luettiin '
      + 'sanomalehdistä.',
    uusi: {
      tiedosto: 'Erg Chebbi sunset.jpg',
      lahde: 'Thomas Fuhrmann, Commons (CC BY-SA 4.0)',
      selite: 'Auringonlasku Saharan suurilla dyyneillä. Hiekka vaeltaa '
        + 'tuulen mukana yhä — vain matkustajat ovat vaihtuneet.',
    },
  },
  ahaggar: {
    tiedosto: 'Eremitage Foucauld (1991).jpg',
    vuosi: '1991',
    lahde: 'Albert Backer, Commons (CC BY-SA 3.0)',
    selite: 'Charles de Foucauldin kivinen erakkomaja Assekremin laella, '
      + 'rakennettu 1911. Aikakauden valokuvaa vuorilta ei ole vapaana '
      + 'saatavilla — maja seisoo kuvassa samanlaisena kuin isoisän '
      + 'aikaan.',
    uusi: {
      tiedosto: 'Assekrem Peaks at Sunset — Hoggar Mountains, Tamanrasset.jpg',
      lahde: 'Rachid Hamatou, Commons (CC BY-SA 4.0)',
      selite: 'Ahaggarin kivipiikit auringonlaskussa. Huiput ovat vanhojen '
        + 'tulivuorten sisuksia, joiden ympäriltä pehmeämpi kivi on '
        + 'kulunut pois.',
    },
  },
  mosambik: {
    tiedosto: 'Planta da fortaleza da ilha de Moçambique, Leonardo de Ferrari, 1655.jpg',
    vuosi: '1655',
    lahde: 'Commons (PD)',
    selite: 'São Sebastiãon linnoituksen piirros vuodelta 1655 — vanhin '
      + 'kuva saarelta. Sama linnoitus vartioi satamaa isoisän aikaan ja '
      + 'vartioi yhä.',
    uusi: {
      tiedosto: 'Ilha de Mocambique.jpg',
      lahde: 'Stig Nygaard, Commons (CC BY 2.0)',
      selite: 'Mosambikin saari nykyään: linnoituksen muurit, valkoinen '
        + 'hiekka ja dhow-purje. Koko saari on Unescon '
        + 'maailmanperintökohde.',
    },
  },
  viktoria: {
    tiedosto: 'Jules Leclercq- Aux sources du Nil-1913-chutes Ripon.jpg',
    vuosi: '1913',
    lahde: 'Commons (PD)',
    selite: 'Riponin putoukset, joista Niili lähti Viktoria Nyanzasta '
      + 'pohjoiseen. Isoisän ajan kuuluisa nähtävyys upposi padon alle '
      + '1954 — putousta ei enää ole.',
    uusi: {
      tiedosto: 'Boats by the Lake Victoria Shore.jpg',
      lahde: 'Laura Awino, Commons (CC BY-SA 4.0)',
      selite: 'Kalastajaveneitä Viktoria Nyanzan rannassa nykyään. Järvi '
        + 'on Afrikan suurin, ja putouksen paikalla humisee nyt '
        + 'voimalaitos.',
    },
  },
  bahrelghazal: {
    tiedosto: 'Mission Marchand Haut-Oubangui Bahr-el-Ghazal Nil (...)Marchand Jean-Baptiste btv1b53198373d 4.jpg',
    vuosi: '1903',
    lahde: 'BnF Gallica (PD)',
    selite: 'Marchandin retkikunnan kartta: Ranska marssi Bahr el '
      + 'Ghazalin halki Fashodaan 1898 ja oli ajaa Euroopan suursotaan '
      + 'Britannian kanssa — suot ratkaisivat enemmän kuin armeijat.',
    uusi: {
      tiedosto: 'Cattle Wau Sudan.jpg',
      lahde: 'Bertramz, Commons (CC BY-SA 3.0)',
      selite: 'Pitkäsarvinen karja on Bahr el Ghazalin rikkaus '
        + 'nykyäänkin: paimenten vuosi kiertää karjaleirien ja '
        + 'tulvatasankojen mukana.',
    },
  },
};

import { VALOKUVAT_PAIKALLISET } from './valokuvat-paikalliset.js';
import { LIPUT_PAIKALLISET } from './liput-paikalliset.js';
import { PEILI_JUURI, peiliKuvaPolku, peiliKaytossa } from '../media.js';

/** Alkuperäinen lähde Commonsissa. Tämä on aina viimeinen varareitti. */
function commonsUrl(tiedosto, leveys) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(tiedosto)}?width=${leveys}`;
}

const omaKansio = () => typeof location !== 'undefined' && location.protocol !== 'file:';

/**
 * Kuvaosoite kolmessa portaassa:
 *   1. paikallinen kopio repossa (nopein, toimii offline)
 *   2. peili — pelin oma kopio kaikesta ulkopuolisesta aineistosta
 *   3. Commons, alkuperäinen lähde
 *
 * Peili on ennen Commonsia siksi, että Commonsista voi kadota tiedosto
 * uudelleennimeämisen tai poiston takia. Jos peili ei vastaa, kuvan
 * asettaja (media.js: asetaKuva) siirtyy varareitille automaattisesti.
 *
 * Standalone-tiedosto (file:) ohittaa assets-kansion, koska sen vieressä
 * ei ole sellaista — peili ja Commons toimivat silti.
 */
export function valokuvaUrl(tiedosto, leveys) {
  const paikallinen = VALOKUVAT_PAIKALLISET.get(tiedosto);
  if (paikallinen && omaKansio()) return `assets/valokuvat/${paikallinen}`;
  if (peiliKaytossa('kuvat')) return `${PEILI_JUURI}${peiliKuvaPolku(tiedosto, 'kuvat')}`;
  return commonsUrl(tiedosto, leveys);
}

/** Valokuvan varareitti, kun ensisijainen osoite ei vastaa. */
export function valokuvaVara(tiedosto, leveys) {
  return commonsUrl(tiedosto, leveys);
}

/**
 * Lipun osoite samoissa portaissa. Liput ovat repossa
 * (tools/fetch-flags.mjs), koska saapumiskortti näyttää niitä useita
 * kerralla ja Commons alkoi rajoittaa peräkkäisiä pyyntöjä — silloin
 * liput jäivät pois kokonaan.
 */
export function lippuUrl(tiedosto, leveys) {
  const paikallinen = LIPUT_PAIKALLISET.get(tiedosto);
  if (paikallinen && omaKansio()) return `assets/liput/${paikallinen}`;
  if (peiliKaytossa('kuvat')) return `${PEILI_JUURI}${peiliKuvaPolku(tiedosto, 'liput')}`;
  return commonsUrl(tiedosto, leveys);
}

/** Lipun varareitti. */
export function lippuVara(tiedosto, leveys) {
  return commonsUrl(tiedosto, leveys);
}
