// Kaupungin elämää: taide-, ruoka- ja musiikkinostot Tutki-kortille.
// Pilotit Tanger ja Tripoli; laajennettu kymmeneen kaupunkiin omistajan
// hyväksyttyä mallin (30.7.). Jokainen väite on tarkistettavissa; kuvat
// ovat Wikimedia Commonsista ja niiden lisenssi on varmistettu
// tiedostokohtaisesti.
//
// `kysymys` on tutustu ja vastaa -kokeilu: nostoihin tutustumalla
// kysymykseen osaa vastata, ja oikeasta vastauksesta saa pienen
// palkkion kerran per kaupunki (game.actionKulttuuri).
export const KULTTUURI_PALKKIO = 25;

export const AFRICA_KULTTUURI = {
  tanger: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Matisse maalasi Tangerissa',
        tiedosto: 'Henri Matisse, 1911-12, La Fenêtre à Tanger (Paysage vu d\'une fenêtre Landscape viewed from a window, Tangiers), oil on canvas, 115 x 80 cm, Pushkin Museum.jpg',
        teksti: 'Ranskalainen taidemaalari Henri Matisse asui Tangerissa talvina '
          + '1912–1913 ja maalasi hotellihuoneensa ikkunasta näkymän yli '
          + 'kaupungin — sininen "Ikkuna Tangerissa" kuuluu nykyään Moskovan '
          + 'Pushkin-museon aarteisiin.',
        // Suurennoksen alle kirjoitettava parin lauseen kuvaus itse
        // teoksesta (omistajan toive).
        selite: 'La Fenêtre à Tanger (1912): näkymä hotellihuoneen ikkunasta '
          + 'yli medinan kohti englantilaista kirkkoa. Matisse maalasi koko '
          + 'näkymän sinisen sävyillä — ikkunalaudalla on maljakko, ja '
          + 'sateisen talven kaupunki hehkuu kuin iltahämärässä.',
        lahde: 'Wikimedia Commons (PD)',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Minttutee',
        teksti: 'Vieraalle kaadetaan Marokossa lähes aina lasillinen makeaa '
          + 'minttuteetä. Tee kaadetaan korkealta, jotta pintaan syntyy '
          + 'vaahto — ja kieltäytymistä pidetään epäkohteliaana.',
      },
      {
        tyyppi: 'linkki',
        otsikko: 'Gnawa-musiikki',
        teksti: 'Marokon gnawa-perinteessä rautakastanjetit ja kolmikielinen '
          + 'guembri-luuttu vievät kuulijan transsiin asti — perinne on '
          + 'Unescon aineettoman kulttuuriperinnön listalla.',
        wiki: 'Gnawa',
        musiikki: 'https://music.apple.com/fi/artist/maalem-mahmoud-guinia/981105724',
        musiikkiNimi: 'Maalem Mahmoud Guinia Apple Musicissa',
        // Kenttä-äänitys gnawa-soittajista Marrakechin torilta; lisenssi
        // varmistettu archive.orgin metatiedoista (CC BY 3.0).
        aani: 'https://archive.org/download/aporee_21876_25420/marrakeshCafeEpicesGnawa270214a.mp3',
        aaniLahde: '"Rahba Kedima, Marrakech — Gnawa" — udo noll, radio aporee (CC BY 3.0)',
      },
    ],
    kysymys: {
      q: 'Kuka kuuluisa taidemaalari työskenteli Tangerissa talvina 1912–1913?',
      options: ['Henri Matisse', 'Claude Monet', 'Pablo Picasso', 'Vincent van Gogh'],
      correct: 0,
      fact: 'Matisse maalasi Tangerissa kahtena talvena. Hotelli-ikkunan näkymä '
        + '"La Fenêtre à Tanger" on nähtävissä nostossa yllä.',
    },
  },
  tripoli: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Malouf-musiikki',
        tiedosto: 'Libyan Malouf.jpg',
        teksti: 'Malouf on Libyan perinnemusiikkia, jonka juuret ovat keskiajan '
          + 'Andalusiassa. Häissä ja juhlissa sitä esittää kokonainen yhtye '
          + 'lauluineen, luuttuineen ja rumpuineen.',
        selite: 'Libyalainen malouf-yhtye soittimineen: laulajien rinnalla '
          + 'soivat oud-luuttu, viulu ja darbuka-rumpu. Sama kokoonpano on '
          + 'soittanut häissä ja juhlissa sukupolvien ajan.',
        lahde: 'Wikimedia Commons (CC BY 4.0)',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Tee ja paahdetut pähkinät',
        teksti: 'Libyalainen tee keitetään vahvaksi ja vaahtoavaksi ja juodaan '
          + 'pienistä laseista useampi kierros — viimeiseen lasiin lisätään '
          + 'usein paahdettuja maapähkinöitä tai manteleita.',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Bazin-pata',
        teksti: 'Juhlapöydän kunniaruoka on bazin: ohrataikinasta keitetty '
          + 'kiinteä kakku, jonka ympärille kaadetaan tulista lammas- ja '
          + 'tomaattikastiketta ja jota syödään yhdessä isolta vadilta.',
      },
    ],
    kysymys: {
      q: 'Mikä on malouf?',
      options: ['Libyan perinnemusiikkia', 'Aavikkotuulen nimi', 'Libyalainen teelaatu', 'Vanha karavaanireitti'],
      correct: 0,
      fact: 'Malouf kulkeutui Libyaan Andalusiasta ja soi yhä häissä ja '
        + 'juhlissa — kuva yhtyeestä on nostossa yllä.',
    },
  },
  kairo: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Umm Kulthum, Egyptin ääni',
        tiedosto: 'Umm Kulthum4.jpg',
        teksti: 'Laulajatar Umm Kulthum oli arabimaailman rakastetuin ääni: '
          + 'kun hänen radiokonserttinsa alkoi kuun ensimmäisenä torstaina, '
          + 'Kairon kadut hiljenivät ja kahvilat täyttyivät kuuntelijoista. '
          + 'Yksi laulu saattoi kestää tunnin.',
        selite: 'Umm Kulthum mikrofonin äärellä uransa alkupuolella. '
          + 'Tunnusmerkit olivat aina samat: tumma lasit, nenäliina kädessä '
          + 'ja orkesteri takana — ja ääni, jota kutsuttiin Egyptin '
          + 'neljänneksi pyramidiksi.',
        musiikki: 'https://music.apple.com/fi/artist/umm-kulthum/81179580',
        musiikkiNimi: 'Umm Kulthum Apple Musicissa',
        lahde: 'Wikimedia Commons (PD)',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Ahwa eli kahvila',
        teksti: 'Kairolainen kahvila eli ahwa on olohuone kadun varrella: '
          + 'siellä juodaan paksua kahvia ja minttuteetä, pelataan '
          + 'tavla-lautapeliä ja ratkotaan maailman asiat. Kiirettä '
          + 'ahwassa ei tunneta.',
      },
      {
        tyyppi: 'linkki',
        otsikko: 'Naguib Mahfouz',
        teksti: 'Kirjailija Naguib Mahfouz kirjoitti Kairon kujista ja '
          + 'kahviloista niin elävästi, että hän sai Nobelin '
          + 'kirjallisuuspalkinnon 1988 — ensimmäisenä arabiaksi '
          + 'kirjoittavana kirjailijana.',
        wiki: 'Naguib Mahfouz',
      },
    ],
    kysymys: {
      q: 'Kenen laulajan radiokonsertit hiljensivät Kairon kadut kerran kuussa?',
      options: ['Umm Kulthumin', 'Edith Piafin', 'Maria Callasin', 'Miriam Makeban'],
      correct: 0,
      fact: 'Umm Kulthumin konsertit kokosivat koko arabimaailman radion '
        + 'ääreen — hänen kuvansa on nostossa yllä.',
    },
  },
  marrakech: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Jemaa el-Fnan tori',
        tiedosto: 'ElFnarMarrakech2014.jpg',
        teksti: 'Marrakechin suurtori Jemaa el-Fna muuttuu joka ilta '
          + 'ulkoilmateatteriksi: tarinankertojat kokoavat yleisön piiriin, '
          + 'ruokakojut savuavat ja gnawa-rummut jyskyttävät pimeään asti. '
          + 'Unesco on ottanut torin perinteet suojeltavien listalleen.',
        selite: 'Ilta Jemaa el-Fnalla: ruokakojujen savu nousee valojen '
          + 'läpi ja väkijoukko kiertää kojulta toiselle. Taustalla kohoaa '
          + 'Koutoubian moskeijan torni, jonka mukaan koko kaupunki '
          + 'suunnistaa.',
        lahde: 'Wikimedia Commons (CC BY-SA 4.0)',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Halqa eli tarinapiiri',
        teksti: 'Tarinankertojan ympärille syntyvää yleisörinkiä kutsutaan '
          + 'nimellä halqa. Sama suullinen perinne on kulkenut torilla '
          + 'sukupolvelta toiselle vuosisatojen ajan — hyvä kertoja '
          + 'lopettaa aina jännittävään kohtaan, jotta yleisö palaa '
          + 'huomenna.',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Tajine-pata',
        teksti: 'Marokkolainen tajine on keraaminen pata, jonka '
          + 'kartiomainen kansi kierrättää höyryn takaisin ruokaan. '
          + 'Padassa haudutetaan lihaa, kasviksia, oliiveja ja '
          + 'säilöttyä sitruunaa hiilloksella tuntikausia.',
      },
    ],
    kysymys: {
      q: 'Ketkä kokoavat yleisön piiriin Jemaa el-Fnan torilla iltaisin?',
      options: ['tarinankertojat', 'postinkantajat', 'kellosepät', 'karttapiirtäjät'],
      correct: 0,
      fact: 'Tarinankertojien halqa-piirit ovat torin vanhin perinne — '
        + 'kuva torin illasta on nostossa yllä.',
    },
  },
  lagos: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Eyo-kulkue',
        tiedosto: 'Eyo masquerades. Lagos State, Nigeria.jpg',
        teksti: 'Lagosin oma juhla on Eyo: valkoisiin kaapuihin ja '
          + 'leveälierisiin hattuihin pukeutuneet hahmot kulkevat kaupungin '
          + 'halki sauvoineen. Kulkue järjestetään vain erityisinä päivinä, '
          + 'ja sen sanotaan olevan Lagosin saaren henkien tervehdys.',
        selite: 'Eyo-hahmoja Lagosin kaduilla: valkoinen kaapu peittää '
          + 'kantajansa kokonaan, ja opa-sauva kohotetaan tervehdykseksi. '
          + 'Jokainen hattu kertoo, mitä sukua hahmo edustaa.',
        lahde: 'Wikimedia Commons (CC BY-SA 4.0)',
      },
      {
        tyyppi: 'linkki',
        otsikko: 'Afrobeat',
        teksti: 'Fela Kuti loi Lagosissa afrobeatin: jazzin, funkin ja '
          + 'länsiafrikkalaisten rytmien seoksen, jossa yksi kappale voi '
          + 'kestää puoli tuntia. Hänen klubinsa Afrika Shrine oli '
          + 'kaupungin kuumin näyttämö, ja sama liike jatkuu yhä.',
        wiki: 'Fela Kuti',
        musiikki: 'https://music.apple.com/fi/artist/fela-kuti/55088',
        musiikkiNimi: 'Fela Kuti Apple Musicissa',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Jollof-riisi',
        teksti: 'Tomaatissa ja chilissä haudutettu jollof-riisi on koko '
          + 'Länsi-Afrikan juhlaruoka — ja ikuisen leikkimielisen kiistan '
          + 'aihe: Nigeria ja Ghana väittävät kumpikin tekevänsä sen '
          + 'paremmin.',
      },
    ],
    kysymys: {
      q: 'Mikä musiikkityyli syntyi Lagosissa Fela Kutin johdolla?',
      options: ['afrobeat', 'flamenco', 'reggae', 'samba'],
      correct: 0,
      fact: 'Afrobeat syntyi Lagosissa 1960–70-luvuilla ja soi nykyään '
        + 'kaikkialla maailmassa.',
    },
  },
  dakar: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Goréen saari',
        tiedosto: 'Island of Gorée, Senegal.jpg',
        teksti: 'Dakarin edustalla on pieni Goréen saari, jonka kautta '
          + 'orjakauppa kulki vuosisatojen ajan. Nykyään saari on Unescon '
          + 'maailmanperintökohde ja muistopaikka, jossa "paluuttoman '
          + 'oven" talo muistuttaa miljoonien kohtalosta.',
        selite: 'Goréen satama ja punakattoiset talot mereltä nähtynä. '
          + 'Rauhallinen saari on hiljainen muistomerkki: täältä laivat '
          + 'veivät ihmisiä Atlantin yli, eikä kukaan heistä palannut.',
        lahde: 'Wikimedia Commons (CC BY-SA 2.0)',
      },
      {
        tyyppi: 'linkki',
        otsikko: 'Youssou N\'Dour ja mbalax',
        teksti: 'Senegalin oma tanssimusiikki on mbalax, jossa '
          + 'sabar-rummut vievät tahtia. Sen tunnetuin ääni on Youssou '
          + 'N\'Dour, dakarilainen laulaja, jonka äänen sanotaan '
          + 'kantavan yli valtamerten.',
        wiki: 'Youssou N\'Dour',
        musiikki: 'https://music.apple.com/fi/artist/youssou-ndour/153580',
        musiikkiNimi: 'Youssou N\'Dour Apple Musicissa',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Teranga',
        teksti: 'Senegalilaiset kutsuvat maataan terangan maaksi — sana '
          + 'tarkoittaa vieraanvaraisuutta. Vieras istutetaan aina '
          + 'ruokavadin ääreen: kansallisruoka thiéboudienne on kalaa ja '
          + 'riisiä, jota syödään yhdessä isolta vadilta.',
      },
    ],
    kysymys: {
      q: 'Mistä Dakarin edustalla oleva Goréen saari tunnetaan?',
      options: ['Orjakaupan muistopaikkana', 'Timanttikaivoksista', 'Majakastaan', 'Karavaanien satamana'],
      correct: 0,
      fact: 'Gorée on Unescon maailmanperintökohde ja muistuttaa '
        + 'orjakaupan uhreista — kuva saaresta on nostossa yllä.',
    },
  },
  timbuktu: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Timbuktun käsikirjoitukset',
        tiedosto: 'Timbuktu-manuscripts-astronomy-mathematics.jpg',
        teksti: 'Timbuktu oli 1500-luvulla oppineiden kaupunki, jonka '
          + 'kirjastoihin koottiin satojatuhansia käsikirjoituksia: '
          + 'tähtitiedettä, matematiikkaa, lakia ja runoutta. Suvut ovat '
          + 'varjelleet kirjoja aavikon hiekalta ja sodilta tähän päivään '
          + 'asti.',
        selite: 'Aukeama Timbuktun käsikirjoituksesta: tähtitiedettä ja '
          + 'matematiikkaa arabiankielisin selityksin ja kaavioin. '
          + 'Muste ja paperi ovat kestäneet aavikon kuivuudessa satoja '
          + 'vuosia.',
        lahde: 'Wikimedia Commons (PD)',
      },
      {
        tyyppi: 'linkki',
        otsikko: 'Aavikkoblues',
        teksti: 'Malin suuren joen varrelta nousi 1900-luvun lopulla '
          + 'aavikkoblues: kitara soi kuin ndjarka-viulu ja rytmi kulkee '
          + 'kamelin askelissa. Tyylin isä Ali Farka Touré oli kotoisin '
          + 'Niafunkésta, Timbuktun naapurista.',
        wiki: 'Ali Farka Touré',
        musiikki: 'https://music.apple.com/fi/artist/ali-farka-tour%C3%A9/7420807',
        musiikkiNimi: 'Ali Farka Touré Apple Musicissa',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Suolakaravaanit',
        teksti: 'Timbuktuun tuodaan yhä suolaa aavikon kaivoksilta kuten '
          + 'tuhat vuotta sitten: laatat kulkevat kamelien selässä '
          + 'satojen kilometrien matkan. Suola oli aikanaan niin '
          + 'arvokasta, että sitä vaihdettiin kultaan.',
      },
    ],
    kysymys: {
      q: 'Mistä Timbuktun kirjastot ovat kuuluisia?',
      options: ['Vanhoista käsikirjoituksista', 'Kultaharkoista', 'Maailman kartoista', 'Norsunluusta'],
      correct: 0,
      fact: 'Sadattuhannet käsikirjoitukset tekivät Timbuktusta oppineiden '
        + 'kaupungin — aukeama yhdestä on nostossa yllä.',
    },
  },
  kumasi: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Kente-kangas',
        tiedosto: 'Kente cloth.jpg',
        teksti: 'Asantejen juhlakangas kente kudotaan kapeista '
          + 'silkkisuikaleista, jotka ommellaan yhteen leveäksi vaatteeksi. '
          + 'Jokaisella kuviolla ja värillä on nimi ja merkitys — kangas '
          + 'on viesti, jonka voi lukea.',
        selite: 'Kente-kankaan kuvioita: kulta, vihreä ja punainen '
          + 'vuorottelevat tarkkoina geometrisina raitoina. Kultainen väri '
          + 'kertoo kuninkaallisuudesta ja vauraudesta — kente kuului '
          + 'alkujaan vain Asanten hoville.',
        lahde: 'Wikimedia Commons (CC BY-SA 4.0)',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Adinkra-symbolit',
        teksti: 'Ghanalaiset painavat kankaisiin adinkra-symboleja, joilla '
          + 'jokaisella on oma sanomansa: Gye Nyame kertoo Jumalan '
          + 'kaikkivaltiudesta ja sankofa-lintu muistuttaa, että '
          + 'menneestä saa hakea opin mukaansa.',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Highlife',
        teksti: 'Ghanan oma musiikki on highlife: kitarat soivat kuin '
          + 'palmuviinin äärellä ennen vanhaan, ja puhaltimet tulivat '
          + 'mukaan tanssiorkesterien kaudella. Nimi syntyi, kun tavallinen '
          + 'väki kuunteli aidan takaa hienoston "korkeaa elämää".',
      },
    ],
    kysymys: {
      q: 'Mikä on kente?',
      options: ['Asantejen juhlakangas', 'Ghanalainen keitto', 'Rumpujen tanssi', 'Kuninkaan valtaistuin'],
      correct: 0,
      fact: 'Kente kudotaan suikaleista ja sen kuviot kantavat '
        + 'merkityksiä — kuva kankaasta on nostossa yllä.',
    },
  },
  kapkaupunki: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Bo-Kaapin värit',
        tiedosto: 'Bo-Kaap colourful houses (30114819980).jpg',
        teksti: 'Bo-Kaapin kaupunginosassa talot hehkuvat kaikissa '
          + 'sateenkaaren väreissä. Korttelit rakensivat Kap-malaijit, '
          + 'joiden esivanhemmat tuotiin Kaapille Kaakkois-Aasiasta — '
          + 'värit olivat vapauden ja oman kodin merkki.',
        selite: 'Bo-Kaapin jyrkkä katu: limetinvihreä, pinkki ja '
          + 'turkoosi talo vierekkäin Signal-kukkulan rinteessä. '
          + 'Kaupunginosa on yksi Kapkaupungin vanhimmista, ja sen '
          + 'mukulakivet ovat alkuperäiset.',
        lahde: 'Wikimedia Commons (CC BY-SA 2.0)',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Cape jazz',
        teksti: 'Kapkaupungilla on oma jazzinsa: pianisti Abdullah '
          + 'Ibrahimin "Mannenberg" soi 1970-luvulla niin, että siitä '
          + 'tuli hiljainen vastarintalaulu — ja kaupungin jazzklubit '
          + 'soivat yhä viikon jokaisena iltana.',
        musiikki: 'https://music.apple.com/fi/artist/abdullah-ibrahim/3924942',
        musiikkiNimi: 'Abdullah Ibrahim Apple Musicissa',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Braai',
        teksti: 'Eteläafrikkalainen grillijuhla braai on enemmän kuin '
          + 'ateria: tuli sytytetään ajoissa, makkarat ja maissipuuro '
          + 'jaetaan kaikkien kesken ja tulen ääressä istutaan pitkään. '
          + 'Sana on afrikaansia ja tapa yhteinen koko maalle.',
      },
    ],
    kysymys: {
      q: 'Mistä Bo-Kaapin kaupunginosa tunnetaan?',
      options: ['Värikkäistä taloistaan', 'Pilvenpiirtäjistään', 'Kultakaivoksistaan', 'Kanaaleistaan'],
      correct: 0,
      fact: 'Bo-Kaapin värikkäät talot ovat Kap-malaijien perintöä — '
        + 'kuva kadulta on nostossa yllä.',
    },
  },
  sansibar: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Taarab-musiikki',
        tiedosto: 'Zanzibar Taarab Kidumbak Ensemble.jpg',
        teksti: 'Sansibarin juhlissa soi taarab: orkesterissa viulut, '
          + 'oud-luuttu ja qanun-kannel säestävät laulua, jossa '
          + 'swahilinkieliset säkeet kiertävät kohteliaina '
          + 'vihjailuina. Tyylissä kuuluu koko valtameren kauppareitti — '
          + 'Arabiaa, Intiaa ja Afrikkaa samassa sävelessä.',
        selite: 'Taarab-yhtye soittimineen Sansibarissa: viulut ja '
          + 'käsirummut rinnakkain. Pienempää kokoonpanoa kutsutaan '
          + 'kidumbakiksi — sama musiikki, mutta tanssittavampi.',
        lahde: 'Wikimedia Commons (CC BY-SA 4.0)',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Siti binti Saad',
        teksti: 'Taarabin suuri ääni oli Siti binti Saad, joka lauloi '
          + '1920-luvulla ensimmäisenä itäafrikkalaisena levylle — ja '
          + 'ensimmäisenä swahiliksi. Kylänsä köyhistä lähtenyt laulaja '
          + 'esiintyi sulttaanien hoveissa asti.',
        musiikki: 'https://music.apple.com/fi/artist/siti-binti-saad/257420112',
        musiikkiNimi: 'Siti binti Saad Apple Musicissa',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Neilikkasaaret',
        teksti: 'Sansibaria kutsuttiin maustesaariksi: neilikan tuoksu '
          + 'leijui koko saaren yllä, kun sato kuivui auringossa. '
          + 'Maustetorilla myydään yhä neilikkaa, kanelia, muskottia ja '
          + 'pippuria kasoittain.',
      },
    ],
    kysymys: {
      q: 'Mikä musiikki soi Sansibarin häissä ja juhlissa?',
      options: ['taarab', 'tango', 'polkka', 'ooppera'],
      correct: 0,
      fact: 'Taarab yhdistää valtameren kauppareitin kulttuurit — kuva '
        + 'yhtyeestä on nostossa yllä.',
    },
  },
  addisabeba: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Kahviseremonia',
        tiedosto: 'Ethiopian coffee ceremony.jpg',
        teksti: 'Kahvi on kotoisin Etiopiasta, ja siellä sen juominen on '
          + 'seremonia: pavut paahdetaan hiilloksella vieraiden edessä, '
          + 'jauhetaan huhmareessa ja keitetään jebena-savipannussa. '
          + 'Kolme kierrosta kuuluu tapaan — lähteä ei sovi ennen '
          + 'kolmatta kuppia.',
        selite: 'Kahviseremonian välineet: pyöreäpohjainen jebena-pannu, '
          + 'pienet kupit ja suitsuke. Lattialle levitetään tuoretta '
          + 'ruohoa ja paahtuvien papujen savu kutsuu naapuritkin '
          + 'paikalle.',
        lahde: 'Wikimedia Commons (CC BY-SA 4.0)',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Ethio-jazz',
        teksti: 'Addis Abebassa syntyi 1960-luvulla ethio-jazz, kun '
          + 'Mulatu Astatke yhdisti etiopialaiset viisisäveliset '
          + 'asteikot jazziin ja latinalaisrytmeihin. Tulos ei kuulosta '
          + 'miltään muulta maailmassa — ja sitä soitetaan taas '
          + 'kaupungin klubeilla.',
        musiikki: 'https://music.apple.com/fi/artist/mulatu-astatke/76533627',
        musiikkiNimi: 'Mulatu Astatke Apple Musicissa',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Injera',
        teksti: 'Etiopialainen ateria katetaan injeran päälle: suuren, '
          + 'happaman lettuleivän, joka on lautanen, lusikka ja leipä '
          + 'samassa. Padat kaadetaan sen päälle ja syödään käsin '
          + 'yhdessä — oma pala revitään aina samasta leivästä.',
      },
    ],
    kysymys: {
      q: 'Mistä maasta kahvi on alun perin kotoisin?',
      options: ['Etiopiasta', 'Brasiliasta', 'Kolumbiasta', 'Intiasta'],
      correct: 0,
      fact: 'Kahvipensas kasvaa villinä Etiopian ylängöillä, ja '
        + 'kahviseremonia on maan vieraanvaraisuuden sydän.',
    },
  },
  kongo: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Sanza, peukalopiano',
        tiedosto: 'Sanza Boa-Zaïre-Musée royal de l\'Afrique centrale.jpg',
        teksti: 'Kongon omiin soittimiin kuuluu sanza: puulaatikkoon '
          + 'kiinnitetyt metallikielet, joita näppäillään peukaloilla. '
          + 'Pieni soitin kulkee taskussa, ja sen helähtelevä ääni '
          + 'säestää tarinoita ja pitkiä matkoja.',
        selite: 'Sanza Keski-Afrikasta: metalliset kielet on taottu eri '
          + 'mittaisiksi, jotta jokainen soi omalla korkeudellaan. '
          + 'Soittimen sukulaisia tunnetaan eri nimillä ympäri '
          + 'Afrikkaa.',
        lahde: 'Wikimedia Commons (CC BY-SA 4.0)',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Kongolainen rumba',
        teksti: 'Kinshasan ja Brazzavillen tanssisalit synnyttivät '
          + 'kongolaisen rumban, jonka kitarat helisevät kuin vesi. '
          + 'Unesco otti rumban aineettoman kulttuuriperinnön listalle '
          + '2021 — kahden Kongon yhteisenä aarteena.',
        musiikki: 'https://music.apple.com/fi/artist/franco-luambo/387922243',
        musiikkiNimi: 'Franco Luambo Apple Musicissa',
      },
      {
        tyyppi: 'teksti',
        otsikko: 'Sapeurit',
        teksti: 'Kongon kaduilla kävelee sapeureita: tyylin mestareita, '
          + 'jotka pukeutuvat räätälöityihin pukuihin kuin juhlaan '
          + 'keskellä arkea. La Sape on leikki ja elämäntapa — '
          + 'eleganssi on heille kansalaistaito.',
      },
    ],
    kysymys: {
      q: 'Mikä kongolainen tanssimusiikki pääsi Unescon perintölistalle?',
      options: ['rumba', 'valssi', 'sirtaki', 'kalinka'],
      correct: 0,
      fact: 'Kongolainen rumba soi molemmin puolin Kongojokea ja sai '
        + 'Unescon tunnustuksen 2021.',
    },
  },
};
