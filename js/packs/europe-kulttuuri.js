// Euroopan Kaupungin elämää -nostot (sama rakenne kuin AFRICA_KULTTUURI).
// Rakentuu kaupunki kerrallaan. Kuvien lisenssit varmistettu Commonsin
// extmetadatasta (Venetsia 31.7.2026, muut 1.8.2026), ja kuvista on
// paikalliset kopiot kansiossa assets/valokuvat.
export const EUROPE_KULTTUURI = {
  venetsia: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Canaletto maalasi kaupunkinsa',
        tiedosto: 'Canal, Giovanni Antonio (Canaletto) - Return of the Bucentoro to the Molo on Ascension Day, c. 1733-4. Royal Collection Buckingham Palace.jpg',
        teksti: 'Venetsialainen Canaletto maalasi 1700-luvulla kaupunkinsa '
          + 'näkymiä niin tarkasti, että tutkijat käyttävät niitä yhä '
          + 'lähteinä. Maalauksia ostivat etenkin englantilaiset '
          + 'matkailijat muistoksi suurelta Euroopan-kiertueeltaan.',
        selite: 'Bucintoron paluu Molon rantaan helatorstaina (n. 1733): '
          + 'dogen kullattu juhlalaiva palaa seremoniasta, jossa Venetsia '
          + '"vihittiin" merensä kanssa heittämällä sormus aaltoihin. '
          + 'Taustalla dogen palatsi ja kellotorni — näkymä on sama '
          + 'tänäänkin.',
        lahde: 'Wikimedia Commons (PD)',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Cicchetti ja Rialton tori',
        tiedosto: 'Pescaria Rialto Venice.jpg',
        teksti: 'Venetsialaiset syövät cicchettejä — pieniä suupaloja — '
          + 'seisten bacaro-baarien tiskillä, ja viinilasillista kutsutaan '
          + 'nimellä ombra, varjo. Raaka-aineet tulevat Rialton torilta, '
          + 'jossa laguunin kalaa on myyty satojen vuosien ajan.',
        selite: 'Rialton kalatorin pylväshalli Canal Granden varrella. '
          + 'Kauppa käy aamuisin: laguunin ja Adrianmeren kalat ja '
          + 'äyriäiset tuodaan suoraan veneillä hallin laituriin.',
        lahde: 'Wolfgang Moroder, Wikimedia Commons (CC BY-SA 3.0)',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Vivaldi, punainen pappi',
        tiedosto: 'Antonio Vivaldi.jpg',
        teksti: 'Antonio Vivaldi — punatukkainen pappi, il Prete Rosso — '
          + 'opetti viulunsoittoa venetsialaisessa tyttöjen orpokodissa ja '
          + 'sävelsi sen orkesterille satoja konserttoja. Kuuluisin on '
          + 'Neljä vuodenaikaa, jossa musiikista voi kuulla linnunlaulun '
          + 'ja ukkosmyrskyn.',
        selite: 'Ainoa varma Vivaldin muotokuva: François Morellon la '
          + 'Caven kaiverrus vuodelta 1725. Säveltäjä pitelee '
          + 'nuottivihkoa — peruukin alla hehkui lempinimen antanut '
          + 'punainen tukka.',
        lahde: 'Wikimedia Commons (PD)',
        wiki: 'Antonio Vivaldi',
        musiikki: 'https://music.apple.com/fi/artist/antonio-vivaldi/242604',
        musiikkiNimi: 'Antonio Vivaldi Apple Musicissa',
      },
    ],
    kysymys: {
      q: 'Minkä niminen on Vivaldin kuuluisa konserttosarja, jossa musiikki kuvaa kevättä, kesää, syksyä ja talvea?',
      options: ['Neljä vuodenaikaa', 'Kaksitoista kuukautta', 'Meren laulu', 'Talviyön tarina'],
      correct: 0,
      fact: 'Neljä vuodenaikaa on neljän viulukonserton sarja — jokainen '
        + 'kuvaa yhtä vuodenaikaa, ja musiikista voi kuulla linnunlaulua '
        + 'ja ukkosen. Vivaldi sävelsi sen noin vuosina 1718–1723.',
    },
  },

  marseille: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Monte Criston linnasaari',
        tiedosto: "Château d'If @ Baie de Marseille 01.jpg",
        teksti: 'Sataman edustalla olevalle pikkusaarelle rakennettiin '
          + '1500-luvulla linnoitus, josta tuli pian vankila. Alexandre '
          + 'Dumas sijoitti sinne Monte Criston kreivin — kirja on niin '
          + 'tunnettu, että saarelle rakennettiin myöhemmin turisteja '
          + 'varten "Faria-isän selli", vaikka koko mies on keksitty.',
        selite: 'Château d\'If Marseillen lahdella. Linnoitus valmistui '
          + '1531 puolustamaan satamaa; vankilana se toimi yli kolmesataa '
          + 'vuotta. Saarelta ei tiettävästi ole koskaan paennut kukaan.',
        lahde: 'Rémih, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: "Château d'If",
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Bouillabaisse alkoi jätekalasta',
        tiedosto: 'Marseille Filets sur le quai Saint-Jean.jpg',
        teksti: 'Marseillen kuuluisin ruoka oli alun perin kalastajien '
          + 'omaa kotiruokaa: kattilaan meni se osa saaliista, jota '
          + 'kukaan ei ostanut — kivikalat ja muut ruman näköiset. '
          + 'Nykyään bouillabaisse on kallista, ja kaupungin ravintolat '
          + 'ovat allekirjoittaneet oman peruskirjansa siitä, mitä '
          + 'aitoon annokseen kuuluu.',
        selite: 'Kalastajien verkkoja kuivumassa Marseillen laiturilla '
          + '1900-luvun alussa. Vanha satama on ollut kaupungin '
          + 'kalatori keskeytyksettä yli kahdentuhannen vuoden ajan.',
        lahde: 'Wikimedia Commons (PD)',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Hymni sai nimensä matkalla',
        tiedosto: 'Pils - Rouget de Lisle chantant la Marseillaise.jpg',
        teksti: 'Ranskan kansallislaulun sävelsi Rouget de Lisle '
          + 'Strasbourgissa vuonna 1792 — ei Marseillessa. Nimi tarttui '
          + 'siihen, koska marseillelaiset vapaaehtoiset lauloivat sitä '
          + 'marssiessaan Pariisiin, ja pariisilaiset alkoivat kutsua '
          + 'sitä "sikseen marseillelaisten lauluksi".',
        selite: 'Isidore Pilsin maalaus (1849): Rouget de Lisle laulaa '
          + 'juuri säveltämäänsä sotalaulua Strasbourgin pormestarin '
          + 'salongissa huhtikuussa 1792.',
        lahde: 'Wikimedia Commons (PD)',
        wiki: 'La Marseillaise',
        musiikki: 'https://music.apple.com/fi/search?term=La%20Marseillaise',
        musiikkiNimi: 'La Marseillaise Apple Musicissa',
      },
    ],
    kysymys: {
      q: 'Miksi Ranskan kansallislaulua kutsutaan Marseillaisiksi, vaikka se sävellettiin Strasbourgissa?',
      options: [
        'Marseillelaiset vapaaehtoiset lauloivat sitä marssiessaan Pariisiin',
        'Säveltäjä syntyi Marseillessa',
        'Se esitettiin ensi kerran Marseillen satamassa',
        'Marseillen kaupunki maksoi sen säveltämisen',
      ],
      correct: 0,
      fact: 'Rouget de Lisle sävelsi laulun Strasbourgissa 1792. Kun '
        + 'marseillelaiset vapaaehtoiset marssivat sen tahtiin '
        + 'Pariisiin, pariisilaiset alkoivat kutsua sävelmää heidän '
        + 'mukaansa — ja nimi jäi.',
    },
  },

  granada: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Palatsi, jota ei purettu',
        tiedosto: 'View of the Alhambra and Sierra Nevada - Granada - Spain.jpg',
        teksti: 'Alhambra oli Granadan emiirikunnan hallintokeskus ja '
          + 'viimeinen muslimivaltio Iberian niemimaalla. Kun se '
          + 'luovutettiin vuonna 1492, uudet hallitsijat eivät purkaneet '
          + 'palatsia vaan muuttivat siihen — siksi sen kipsikoristelu ja '
          + 'arabiankieliset kirjoitukset ovat yhä paikoillaan.',
        selite: 'Alhambra kukkulallaan ja takana Sierra Nevada, jonka '
          + 'huipuilla on lunta vielä kesäkuussa. Vuoret ovat myös syy '
          + 'palatsin puutarhoihin: sulamisvesi tuotiin kanavaa pitkin '
          + 'suoraan suihkulähteisiin.',
        lahde: 'Adam Jones, Ph.D, Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Alhambra',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Säveltäjä, joka muutti Alhambran kylkeen',
        tiedosto: 'Manuel de Falla.jpg',
        teksti: 'Manuel de Falla asui vuosia pienessä talossa aivan '
          + 'Alhambran vieressä ja sävelsi siellä teoksen "Öitä Espanjan '
          + 'puutarhoissa", jonka ensimmäinen osa on nimeltään '
          + '"Generalifessa" — se on juuri se puutarha kukkulan päällä. '
          + 'Hän myös järjesti Granadassa 1922 kilpailun, '
          + 'jolla pelastettiin vanha cante jondo -flamencolaulu '
          + 'unohdukselta.',
        selite: 'Manuel de Falla (1876–1946), Espanjan tunnetuin '
          + '1900-luvun säveltäjä. Hän oli kotoisin Cádizista mutta '
          + 'asui Granadassa lähes kaksikymmentä vuotta.',
        lahde: 'Wikimedia Commons (PD)',
        wiki: 'Manuel de Falla',
        musiikki: 'https://music.apple.com/fi/artist/manuel-de-falla/319270',
        musiikkiNimi: 'Manuel de Falla Apple Musicissa',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Tapas kuuluu hintaan',
        tiedosto: 'Cerveza y pulpo seco motrileño.jpg',
        teksti: 'Granadassa juoman mukana tulee tapas ilman eri maksua — '
          + 'tapa, joka on Espanjassa nykyään harvinainen ja jota '
          + 'granadalaiset puolustavat kiivaasti. Sanan alkuperä on '
          + 'kansanselityksen mukaan "kansi": lautanen asetettiin '
          + 'lasin päälle pitämään kärpäset poissa.',
        selite: 'Olut ja tapas Granadan seudulla — tässä kuivattua '
          + 'mustekalaa. Annos vaihtuu joka kierroksella, eikä sitä saa '
          + 'valita: se on baarin valinta, ei asiakkaan.',
        lahde: 'Arkangel, Wikimedia Commons (CC BY-SA 2.0)',
      },
    ],
    kysymys: {
      q: 'Mikä oli Alhambra ennen kuin siitä tuli museo?',
      options: [
        'Granadan emiirikunnan hallitsijan palatsi ja linnoitus',
        'Roomalainen kylpylä',
        'Luostari',
        'Kuninkaallinen ratsutalli',
      ],
      correct: 0,
      fact: 'Alhambra rakennettiin 1200–1300-luvuilla Nasridi-suvun '
        + 'hallitsijoiden palatsiksi ja linnoitukseksi. Se oli Iberian '
        + 'viimeisen muslimivaltion keskus, ja se luovutettiin '
        + 'Kastilian ja Aragonian hallitsijoille vuonna 1492.',
    },
  },

  krakova: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Lohikäärme puhaltaa yhä tulta',
        tiedosto: 'Smok Wawelski, Kraków.jpg',
        teksti: 'Wawelin kukkulan juurella on luola ja luolan edessä '
          + 'pronssinen lohikäärme, joka puhaltaa oikeaa tulta muutaman '
          + 'minuutin välein. Tarina kertoo suutarinoppipojasta, joka '
          + 'voitti pedon tarjoamalla sille rikillä täytetyn lampaan — '
          + 'lohikäärme joi järven tyhjäksi ja halkesi.',
        selite: 'Bronisław Chromyn veistämä Smok Wawelski (1972) '
          + 'Veiksel-joen rannassa lohikäärmeen luolan suulla. Tulen '
          + 'saa nykyään puhallettua myös tekstiviestillä.',
        lahde: 'Milena Bielecka-Sujak, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Wawel',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Torvisoitto, joka katkeaa kesken',
        tiedosto: 'Hejnalista krakowski.jpg',
        teksti: 'Marian kirkon tornista soitetaan joka tunti torvella '
          + 'hejnał — ja se katkeaa aina kesken sävelen. Perimätiedon '
          + 'mukaan nuoli osui torvensoittajaan hänen varoittaessaan '
          + 'kaupunkia hyökkäyksestä. Katkos toistetaan uskollisesti '
          + 'joka tunti, myös radiossa keskipäivän aikaan.',
        selite: 'Torvensoittaja Marian kirkon tornissa. Soitto '
          + 'toistetaan neljään ilmansuuntaan, ja tornissa päivystetään '
          + 'ympäri vuorokauden.',
        lahde: 'Jadwiga, Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Hejnał mariacki',
        musiikki: 'https://commons.wikimedia.org/wiki/File:Cracow_trumpet_signal.ogg',
        musiikkiNimi: 'Kuuntele hejnał (Wikimedia Commons)',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Kauppahalli keskellä toria',
        tiedosto: 'Kraków Cloth Hall, 3 Main Market square, Old Town, Krakow, Poland.jpg',
        teksti: 'Sukiennice eli kangashalli on seissyt torin keskellä '
          + 'keskiajalta asti, ja siellä myydään yhä tavaraa. Krakova oli '
          + 'Hansan ja idän karavaanireittien risteyskohta: tänne tuotiin '
          + 'suolaa läheisestä Wieliczkan kaivoksesta ja vietiin kangasta, '
          + 'lyijyä ja kuparia.',
        selite: 'Sukiennice Rynek Głównyn keskellä. Nykyinen '
          + 'renessanssiasu on 1500-luvulta; yläkerrassa on Puolan '
          + '1800-luvun maalaustaiteen kokoelma.',
        lahde: 'Igor123121, Wikimedia Commons (CC BY 4.0)',
        wiki: 'Sukiennice',
      },
    ],
    kysymys: {
      q: 'Miksi Krakovan Marian kirkon torvisoitto katkeaa aina kesken sävelen?',
      options: [
        'Perimätiedon mukaan nuoli osui soittajaan kesken varoituksen',
        'Torvi on rikki eikä sitä ole korjattu',
        'Soittajalla loppuu ilma samassa kohdassa',
        'Sävelmä on jäänyt säveltäjältä kesken',
      ],
      correct: 0,
      fact: 'Tarinan mukaan torvensoittaja varoitti kaupunkia '
        + 'hyökkäyksestä, kun nuoli osui häneen kesken soiton. Katkos '
        + 'toistetaan joka tunti — ja keskipäivällä se kuullaan koko '
        + 'Puolassa radiossa.',
    },
  },

  sarajevo: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Kahvi on aikayksikkö',
        tiedosto: 'Baščaršija.jpg',
        teksti: 'Baščaršijan basaari on 1400-luvulta, ja sen keskellä '
          + 'seisoo Sebilj, puinen vesikioski. Bosnialainen kahvi '
          + 'keitetään kuparisessa džezvassa ja tarjoillaan pienen '
          + 'kuparitarjottimen kanssa: mukana tulee vesilasi ja pala '
          + 'rahat-lokumia. Kahvia ei juoda janoon vaan seuraksi.',
        selite: 'Sebiljin kioski Baščaršijan aukiolla. Nykyinen kioski '
          + 'on vuodelta 1891, ja kyyhkyjen määrästä aukio on saanut '
          + 'lempinimensä "kyyhkytori".',
        lahde: 'Yukof, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Baščaršija',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Sevdalinka — kaupunkilaulu kaipuusta',
        tiedosto: 'Stevan Kragujevic, Nada Mamula, Tv emisija Sjelo na vrelu Bosne, 1962.jpg',
        teksti: 'Sevdalinka on Bosnian oma laulutyyli: hidas, koristeltu '
          + 'ja aina kaipuusta. Nimi tulee turkin sanasta sevda, '
          + 'rakkaudenkaipuu. Laulut ovat vanhoja kaupunkilauluja, ja ne '
          + 'säilyivät suullisesti sukupolvelta toiselle ennen kuin '
          + 'radio alkoi levittää niitä 1900-luvulla.',
        selite: 'Nada Mamula (1927–2001) esiintymässä televisiossa '
          + 'vuonna 1962. Hän oli sevdalinkan tunnetuimpia tulkitsijoita, '
          + 'ja hänen levytyksensä ovat yhä mittapuu.',
        lahde: 'Stevan Kragujević, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Sevdalinka',
        musiikki: 'https://music.apple.com/fi/artist/nada-mamula/289134144',
        musiikkiNimi: 'Nada Mamula Apple Musicissa',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Silta, jolta maailma muuttui',
        tiedosto: 'Latin Bridge Sarajevo summer 2010.JPG',
        teksti: 'Miljackan yli kulkevan Latinalaissillan kulmassa '
          + 'ammuttiin kesäkuussa 1914 Itävalta-Unkarin kruununprinssi '
          + 'Frans Ferdinand. Kuukautta myöhemmin Eurooppa oli sodassa. '
          + 'Sillan vieressä on nykyään museo, jonka ikkunasta näkee '
          + 'täsmälleen sen kadunkulman.',
        selite: 'Latinalaissilta Sarajevossa. Paikalla on ollut silta '
          + '1500-luvulta asti, ja nykyinen kiviholvi on 1790-luvulta — '
          + 'se on seissyt paikallaan kaikkien vaiheiden läpi.',
        lahde: 'BiHVolim, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Stari most',
      },
    ],
    kysymys: {
      q: 'Mistä sana sevdalinka on peräisin?',
      options: [
        'Turkin sanasta sevda, joka tarkoittaa rakkaudenkaipuuta',
        'Erään säveltäjän sukunimestä',
        'Bosnialaisesta soittimesta',
        'Sarajevon kaupunginosan nimestä',
      ],
      correct: 0,
      fact: 'Sevdalinka on Bosnian oma laulutyyli, ja sen nimi tulee '
        + 'turkin sanasta sevda — rakkaudenkaipuu. Laulut ovat vanhoja '
        + 'kaupunkilauluja, jotka siirtyivät suullisesti sukupolvelta '
        + 'toiselle.',
    },
  },

  islanti: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Käräjät kahden mantereen välissä',
        tiedosto: 'Almannagjá Gorge, Þingvellir National Park, Iceland.jpg',
        teksti: 'Þingvellirissä islantilaiset kokoontuivat käräjille '
          + 'vuodesta 930 alkaen: lait luettiin ääneen kalliolta, koska '
          + 'niitä ei ollut kirjoitettu mihinkään. Paikka sattuu olemaan '
          + 'kohdassa, jossa Pohjois-Amerikan ja Euraasian mannerlaatat '
          + 'erkanevat — rotko levenee pari senttiä vuodessa.',
        selite: 'Almannagjá, Þingvellirin suurin repeämä. Kalliolta '
          + 'lainlukija esitti kolmasosan laeista joka vuosi, jotta '
          + 'koko lakikokoelma tuli luetuksi kolmen vuoden välein.',
        lahde: 'Marine SABRES, Wikimedia Commons (CC BY 4.0)',
        wiki: 'Þingvellir',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Kieli, joka ei liikkunut',
        tiedosto: 'GKS 1005 fol., 0005v - 15 (cropped).jpg',
        teksti: 'Islannin kieli on muuttunut niin vähän, että koululainen '
          + 'voi lukea 1200-luvun saagoja alkukielellä. Uusille asioille '
          + 'ei lainata sanoja vaan tehdään omat: tietokone on tölva, '
          + '"lukujen ennustaja", ja kaikille islantilaisille tuttu '
          + 'sana yhtä lailla.',
        selite: 'Aukeama Flateyjarbókista, Islannin suurimmasta '
          + 'keskiaikaisesta käsikirjoituksesta (1387–1394). Se sisältää '
          + 'Norjan kuninkaiden saagoja ja kertomuksen Vinlandin '
          + 'löytämisestä.',
        lahde: 'Wikimedia Commons (PD)',
        wiki: 'Flateyjarbók',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Björk ja pieni maa, joka soi',
        tiedosto: 'BjörkCoachella.jpg',
        teksti: 'Islannissa asuu vähemmän ihmisiä kuin monessa '
          + 'suomalaisessa maakunnassa, mutta musiikkia tulee ulos kuin '
          + 'suurmaasta. Björk aloitti kotimaassaan jo lapsitähtenä ja '
          + 'löi läpi maailmalla 1990-luvulla; hänen jälkeensä tulivat '
          + 'muun muassa Sigur Rós ja Of Monsters and Men.',
        selite: 'Björk esiintymässä. Hän on levyttänyt sekä islanniksi '
          + 'että englanniksi ja tehnyt yhteistyötä muusikoiden ja '
          + 'kuvataiteilijoiden kanssa ympäri maailman.',
        lahde: 'Paul Familetti, Wikimedia Commons (CC BY 2.0)',
        wiki: 'Björk',
        musiikki: 'https://music.apple.com/fi/artist/bjork/295015',
        musiikkiNimi: 'Björk Apple Musicissa',
      },
    ],
    kysymys: {
      q: 'Mikä on Þingvellirin erikoisuus maantieteellisesti?',
      options: [
        'Se on kohdassa, jossa kaksi mannerlaattaa erkanee toisistaan',
        'Se on Islannin korkein vuori',
        'Se on maailman pohjoisin kaupunki',
        'Se on saaren ainoa metsä',
      ],
      correct: 0,
      fact: 'Þingvellir sijaitsee Pohjois-Amerikan ja Euraasian '
        + 'mannerlaattojen saumassa: laatat erkanevat toisistaan noin '
        + 'kaksi senttiä vuodessa, ja maasto repeää kallionrotkoiksi. '
        + 'Samassa paikassa kokoontui Alþingi vuodesta 930.',
    },
  },

  ateena: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Rebetiko — sataman blues',
        tiedosto: 'The Famous Quartet of Pireaus about 1934.jpg',
        teksti: 'Pireuksen satamakortteleissa syntyi 1920-luvulla '
          + 'rebetiko: pakolaisten ja köyhien laulu, jota soitettiin '
          + 'bouzoukilla ja jota valtio yritti aikanaan kieltää. Nykyään '
          + 'se on Unescon suojelemaa kulttuuriperintöä ja soi taas '
          + 'kaupungin tavernoissa.',
        selite: 'Pireuksen kuuluisa kvartetti noin 1934: Markos '
          + 'Vamvakaris ja hänen soittokumppaninsa bouzoukeineen. '
          + 'Yhtye teki rebetikosta koko Kreikan musiikkia.',
        lahde: 'Wikimedia Commons (PD)',
        wiki: 'Rebetiko',
        musiikki: 'https://music.apple.com/fi/search?term=rebetiko',
        musiikkiNimi: 'Rebetiko Apple Musicissa',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Souvlaki syödään seisaaltaan',
        tiedosto: 'Souvlaki in Athens.JPG',
        teksti: 'Souvlaki on grillattua lihaa vartaassa, ja pita '
          + 'kääritään sen ympärille tomaatin, sipulin ja tzatzikin '
          + 'kanssa. Ateenassa se ostetaan luukulta ja syödään kadulla '
          + 'kävellen — halvin kunnon ateria kaupungissa.',
        selite: 'Souvlaki-annos ateenalaisessa kojussa: vartaat, pita ja '
          + 'ranskalaiset samassa käärössä, kuten paikallinen tapa vaatii.',
        lahde: 'Miyagawa, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Souvlaki',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Evzonit ja tupsukengät',
        tiedosto: 'Evzones marching, Athens, Greece.jpg',
        teksti: 'Tuntemattoman sotilaan haudalla vartioivat evzonit '
          + 'kävelevät hitaasti kuin unessa. Puvussa on 400 laskosta — '
          + 'yksi jokaista Kreikan ottomaanivallan vuotta kohti — ja '
          + 'kengät painavat kolme kiloa kappale, sillä niiden pohjissa '
          + 'on 60 naulaa.',
        selite: 'Evzonit vaihtavat vartiota parlamenttitalon edessä. '
          + 'Tupsukenkien nimi on tsarouhia, ja tupsut ovat mustaa villaa.',
        lahde: 'Wikimedia Commons (CC0)',
        wiki: 'Eusonit',
      },
    ],
    kysymys: {
      q: 'Mitä evzonin puvun 400 laskosta esittävät?',
      options: [
        'Ottomaanivallan vuosia',
        'Kreikan saarten määrää',
        'Antiikin kaupunkivaltioita',
        'Marathonin juoksun metrejä',
      ],
      correct: 0,
      fact: 'Kreikka oli ottomaanien vallan alla lähes neljäsataa vuotta, '
        + 'ja vapaussota alkoi 1821. Laskosten määrä on muistutus siitä.',
    },
  },

  rooma: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Kolikko olan yli',
        tiedosto: 'Trevi Fountain - Roma.jpg',
        teksti: 'Trevin lähteeseen heitetään kolikko oikealla kädellä '
          + 'vasemman olan yli: tarinan mukaan se takaa paluun Roomaan. '
          + 'Lähteestä kerätään noin puolitoista miljoonaa euroa vuodessa, '
          + 'ja rahat menevät hyväntekeväisyyteen — ruoka-apuun kaupungin '
          + 'vähävaraisille.',
        selite: 'Fontana di Trevi valmistui 1762. Keskellä on meren '
          + 'jumala Oceanus simpukkavaunuissaan, ja vesi tulee yhä '
          + 'antiikin akveduktia pitkin.',
        lahde: 'NikonZ7II, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Trevin suihkulähde',
        // Kenttä-äänitys Rooman kadulta suihkulähteelle käveltäessä —
        // ei Trevin vaan Pantheonin aukiolta, mutta sama ääni: askelia
        // katukivillä ja veden solinaa.
        aani: 'https://archive.org/download/aporee_15080_17587/WalkingtoPantheonFountainRome.mp3',
        aaniLahde: '"Walking to Pantheon Fountain, Rome" — Rolf Yngve, radio aporee (public domain)',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Carbonarassa ei ole kermaa',
        tiedosto: 'Pasta carbonara.jpg',
        teksti: 'Roomalaisessa carbonarassa on vain neljä ainesta: '
          + 'munankeltuainen, pecorino-juusto, pippuri ja guanciale eli '
          + 'suolattu posken liha. Kermaa ei ole — sen lisääminen on '
          + 'roomalaiselle sama kuin ketsuppi kalakeitossa. Ruoka on '
          + 'yllättävän nuori: se keksittiin vasta toisen maailmansodan '
          + 'jälkeen.',
        selite: 'Carbonara-annos. Kastike syntyy, kun kuuma pasta '
          + 'sekoitetaan keltuaisen ja juuston kanssa liedeltä pois '
          + 'otettuna — jos pannu on liian kuuma, muna kypsyy munakkaaksi.',
        lahde: 'Dandy1022, Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Carbonara',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Vesi kulkee yhä',
        tiedosto: 'Parco degli Acquedotti 02.jpg',
        teksti: 'Roomaan rakennettiin yksitoista akveduktia, jotka '
          + 'toivat vuorilta vettä yli sadan kilometrin päästä. Ne '
          + 'toimivat pelkällä painovoimalla: kaltevuus oli paikoin vain '
          + 'kolmekymmentä senttiä kilometriä kohti. Yksi niistä, Aqua '
          + 'Virgo, syöttää yhä Trevin lähdettä.',
        selite: 'Akveduktipuisto kaupungin laidalla: Aqua Claudian kaaret '
          + 'jatkuvat peltojen yli. Rakennettu vuosina 38–52 jKr.',
        lahde: 'Saverio.G, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Rooman akveduktit',
      },
    ],
    kysymys: {
      q: 'Miten Rooman akveduktit saivat veden liikkeelle?',
      options: [
        'Painovoimalla — putki laskee koko matkan',
        'Orjien pyörittämillä pumpuilla',
        'Tuulivoimalla',
        'Vesi nostettiin ämpäreillä porras kerrallaan',
      ],
      correct: 0,
      fact: 'Kaltevuus oli paikoin vain 30 senttiä kilometrillä. Kaaret '
        + 'rakennettiin juuri siksi: laakson yli piti pitää putki '
        + 'täsmälleen oikeassa kulmassa.',
    },
  },

  kreeta: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Härän yli hypättiin',
        tiedosto: 'Bull leaping minoan fresco archmus Heraklion.jpg',
        teksti: 'Knossoksen seinämaalauksissa nuoret tarttuvat juoksevan '
          + 'härän sarviin ja heittävät kuperkeikan sen selän yli. '
          + 'Tutkijat kiistelevät yhä siitä, oliko se urheilua, uskonnon '
          + 'meno vai molempia — eikä kukaan tiedä, onnistuiko se '
          + 'oikeasti koskaan.',
        selite: 'Härkähyppyfreskon jäänteet Herakleionin arkeologisessa '
          + 'museossa, maalattu noin 1500 eaa. Vaaleat hahmot ovat '
          + 'naisia, tumma mies — minolainen tapa merkitä sukupuoli '
          + 'värillä.',
        lahde: 'Wikimedia Commons (CC0)',
        wiki: 'Knossos',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Lyyra soi polvella',
        tiedosto: 'Cretan lyra.jpg',
        teksti: 'Kreetalainen lyyra on kolmikielinen jousisoitin, jota '
          + 'pidetään pystyssä polvella eikä leuan alla. Sitä soitetaan '
          + 'häissä ja kylän juhlissa, usein läpi yön: tanssi kestää niin '
          + 'kauan kuin soittajaa jaksaa.',
        selite: 'Kreetalainen lyyra. Kieliä painetaan kynsien kyljellä, '
          + 'ei sormenpäillä — siitä tulee soittimen erikoinen liukuva '
          + 'ääni.',
        lahde: 'Lemur12, Wikimedia Commons (CC BY 3.0)',
        wiki: 'Psarantónis',
        musiikki: 'https://music.apple.com/fi/search?term=cretan%20lyra',
        musiikkiNimi: 'Kreetalaista lyyramusiikkia Apple Musicissa',
        musiikkiNayte: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Cretan_Lyra_-_Sample.mp3',
        musiikkiNayteNimi: 'Kreetalainen lyyra — Aerakis, CC BY',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Öljypuita enemmän kuin ihmisiä',
        tiedosto: 'Olive-Harvest-Sitia-Lasithi-Crete-Greece.jpg',
        teksti: 'Kreetalla kasvaa noin 30 miljoonaa oliivipuuta ja asuu '
          + 'reilut 600 000 ihmistä — puita on siis viisikymmentä kertaa '
          + 'enemmän. Osa puista on tuhansia vuosia vanhoja ja tuottaa '
          + 'yhä satoa. Sato korjataan talvella, usein koko suvun voimin.',
        selite: 'Oliivinkorjuuta Sitiassa Itä-Kreetalla. Verkot '
          + 'levitetään puun alle ja oksat ravistellaan tai kammataan '
          + 'tyhjiksi.',
        lahde: 'Petro Stelte, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Oliivi',
      },
    ],
    kysymys: {
      q: 'Kuinka vanha Knossoksen palatsikulttuuri on?',
      options: [
        'Noin 4 000 vuotta — Euroopan vanhin kaupunkikulttuuri',
        'Noin 1 000 vuotta',
        'Noin 500 vuotta',
        'Se rakennettiin roomalaisten aikaan',
      ],
      correct: 0,
      fact: 'Minolainen kulttuuri kukoisti noin 2000–1450 eaa. Palatsissa '
        + 'oli juokseva vesi ja viemärit aikana, jolloin muualla '
        + 'Euroopassa asuttiin puumajoissa.',
    },
  },

  sisilia: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Ritarit narujen varassa',
        tiedosto: 'Sicilian puppets.JPG',
        teksti: 'Opera dei pupi on sisilialainen nukketeatteri, jossa '
          + 'metrin mittaiset haarniskoidut ritarit taistelevat '
          + 'Kaarle Suuren tarinoissa. Sama tarina jatkui iltaa toisensa '
          + 'jälkeen kuukausia, ja yleisö tuli katsomaan kuin '
          + 'televisiosarjaa. Unesco suojeli perinteen 2001.',
        selite: 'Sisilialaisia pupi-nukkeja haarniskoissaan. Nuket '
          + 'painavat jopa kymmenen kiloa, ja niitä ohjataan '
          + 'rautatangoilla ylhäältä.',
        lahde: 'Lookandlike, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Opera dei pupi',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Cannolo täytetään vasta tilauksesta',
        tiedosto: 'Cannoli siciliani.jpg',
        teksti: 'Cannolo on paistettu taikinaputki, joka täytetään '
          + 'makeutetulla ricotta-juustolla. Kunnon leipomossa se '
          + 'täytetään vasta kun asiakas tilaa — muuten kuori pehmenee. '
          + 'Ricotta tehdään lampaanmaidosta, ja arabit toivat '
          + 'sokeriruo’on saarelle 800-luvulla.',
        selite: 'Cannoli siciliani tarjolla. Päihin painetaan usein '
          + 'pistaasirouhetta tai kandeerattua hedelmää.',
        lahde: 'Stefano Mortellaro, Wikimedia Commons (CC BY 2.0)',
        wiki: 'Cannolo',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Torilla huudetaan laulaen',
        tiedosto: 'Ballarò, gente en el mercado, Palermo, Sicilia, Italia, 2015.JPG',
        teksti: 'Palermon Ballarò on toiminut samalla paikalla yli '
          + 'tuhat vuotta, arabivallan ajoista asti. Myyjien huuto on '
          + 'oma taiteenlajinsa nimeltä abbanniata: hinta ja tavara '
          + 'lauletaan venytetyllä melodialla, joka kuuluu korttelin '
          + 'päähän.',
        selite: 'Ballarò-tori Palermossa. Kojujen välissä myydään kalaa, '
          + 'vihanneksia ja katuruokaa; markkina alkaa aamuvarhain ja '
          + 'jatkuu iltaan.',
        lahde: 'Benjamín Núñez González, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Palermo',
        // Kenttä-äänitys juuri tältä torilta maaliskuussa 2009.
        aani: 'https://archive.org/download/aporee_6826_8498/palermoballarmarzo2009.MP3',
        aaniLahde: '"ballarò" — Attilio Migliorati, radio aporee (CC BY-SA 3.0)',
      },
    ],
    kysymys: {
      q: 'Mikä on abbanniata?',
      options: [
        'Torikauppiaan laulava myyntihuuto',
        'Sisilialainen jälkiruoka',
        'Etnan purkaustyyppi',
        'Nukketeatterin päähenkilö',
      ],
      correct: 0,
      fact: 'Abbanniata on Palermon torien oma huutolaulu. Jokaisella '
        + 'myyjällä on oma melodiansa, ja vakioasiakkaat tunnistavat '
        + 'kauppiaan pelkästä äänestä.',
    },
  },

  dubrovnik: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Klapa lauletaan ilman soittimia',
        tiedosto: 'Klapa Cambi, Orebić.2012.JPG',
        teksti: 'Klapa on dalmatialainen mieskuorolaulu ilman soittimia: '
          + 'viidestä kymmeneen laulajaa seisoo tiiviissä puolikaaressa '
          + 'ja sovittaa äänet toisiinsa. Perinne syntyi kirkoissa ja '
          + 'satamissa, ja Unesco suojeli sen 2012.',
        selite: 'Klapa-yhtye laulamassa Orebićissä. Laulajat asettuvat '
          + 'lähelle toisiaan, jotta kukin kuulee muut ilman '
          + 'vahvistusta.',
        lahde: 'Quahadi, Añtó, Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Klapa',
        musiikki: 'https://music.apple.com/fi/search?term=klapa',
        musiikkiNimi: 'Klapa-lauluja Apple Musicissa',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Euroopan vanhin apteekki',
        tiedosto: 'Old pharmacy in the Franciscan Monastery in Dubrovnik 01.jpg',
        teksti: 'Fransiskaaniluostarin apteekki avattiin vuonna 1317 ja '
          + 'palvelee yhä asiakkaita — se on Euroopan vanhin '
          + 'yhtäjaksoisesti toiminut apteekki. Munkit valmistivat '
          + 'voiteita yrteistä, ja osa resepteistä on yhä käytössä.',
        selite: 'Vanhan apteekin purkkeja luostarin museossa. '
          + 'Fajanssiruukuissa säilytettiin yrttejä ja voiteita; '
          + 'jokaisen kyljessä lukee sisältö latinaksi.',
        lahde: 'Bernard Gagnon, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Dubrovnik',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Suola teki kaupungista rikkaan',
        tiedosto: 'Salt pans Ston (4065531015).jpg',
        teksti: 'Stonin suola-altaat ovat toimineet 1300-luvulta asti, ja '
          + 'suola oli Dubrovnikin tasavallan tärkein tulonlähde. Sitä '
          + 'suojaamaan rakennettiin viiden kilometrin muuri — Euroopan '
          + 'pisin linnoitusmuuri Kiinan muurin jälkeen. Suola kerätään '
          + 'yhä käsin puulastoilla.',
        selite: 'Stonin suola-altaat. Merivesi johdetaan matalille '
          + 'kentille ja haihdutetaan auringossa; jäljelle jää suola.',
        lahde: 'Tony Hisgett, Wikimedia Commons (CC BY 2.0)',
        wiki: 'Ston',
      },
    ],
    kysymys: {
      q: 'Millä Dubrovnikin tasavalta pysyi vuosisatoja itsenäisenä?',
      options: [
        'Kaupankäynnillä ja neuvottelemalla, ei sotimalla',
        'Euroopan suurimmalla laivastolla',
        'Vuoristo esti hyökkäykset kokonaan',
        'Se ei ollut koskaan itsenäinen',
      ],
      correct: 0,
      fact: 'Ragusa maksoi veroa milloin ottomaaneille, milloin '
        + 'Unkarille, ja piti kaikkiin välit kunnossa. Se kielsi '
        + 'orjakaupan jo 1416 — yhtenä ensimmäisistä Euroopassa.',
    },
  },

  sofia: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Gaida — säkkipilli Balkanilla',
        tiedosto: 'Kostadin Varimezov playing the gaida.jpg',
        teksti: 'Gaida on vuohennahasta tehty säkkipilli, jota soitetaan '
          + 'Bulgarian häissä ja tansseissa. Rodopeilta kotoisin oleva '
          + 'iso kaba gaida soi matalasti ja käheästi. Bulgarialainen '
          + 'kansanmusiikki tunnetaan oudoista tahtilajeista: yleisiä '
          + 'ovat 7/8 ja 11/16.',
        selite: 'Kostadin Varimezov, yksi Bulgarian tunnetuimmista '
          + 'gaida-soittajista. Puhallusputki on suussa, sormet '
          + 'melodiapillillä ja säkki kainalossa.',
        lahde: 'Martha Forsyth, Wikimedia Commons (CC BY 4.0)',
        wiki: 'Gaida',
        musiikki: 'https://music.apple.com/fi/search?term=bulgarian%20folk%20gaida',
        musiikkiNimi: 'Bulgarialaista kansanmusiikkia Apple Musicissa',
        // Kenttä-äänitys Sofian keskustasta: laulua, gaidaa ja rumpua
        // kadulla. Lisenssi varmistettu archive.orgin metatiedoista.
        aani: 'https://archive.org/download/aporee_34245_39372/streetmusicianssofia.mp3',
        aaniLahde: '"Sofia Center — street musicians: voice, gaida and drum" — dohfoh, radio aporee (public domain)',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Banitsassa on onnenviesti',
        tiedosto: 'Banitsa in Sofia Bulgaria 20090404 001.JPG',
        teksti: 'Banitsa on filotaikinasta ja juustosta kierretty '
          + 'piirakka, jota syödään aamiaiseksi jogurttijuoman kanssa. '
          + 'Uudenvuoden banitsan sisään kätketään paperilappuja, joihin '
          + 'on kirjoitettu toivotuksia — se, minkä lapun saa, kertoo '
          + 'tulevasta vuodesta.',
        selite: 'Banitsa Sofiassa. Taikina kierretään kierteelle ja '
          + 'paistetaan pellillä; täytteenä on sirene-juustoa ja munaa.',
        lahde: 'Apostoloff, Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Banitsa',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Ruusulaakson aamut',
        tiedosto: 'Rose-picking in Bulgaria 1870ies.jpg',
        teksti: 'Kazanlakin Ruusulaaksossa kasvatetaan damaskonruusua '
          + 'hajuvesiöljyä varten. Bulgaria tuottaa siitä suuren osan '
          + 'koko maailman tarpeesta. Kukat poimitaan käsin auringon '
          + 'noustessa: päivän lämmössä tuoksuöljy haihtuu, joten '
          + 'työ tehdään aamuviideltä.',
        selite: 'Ruusunpoimintaa Bulgariassa 1870-luvulla — Felix '
          + 'Kanitzin piirros isoisän matkan ajoilta. Työtapa on '
          + 'sama vielä tänäänkin.',
        lahde: 'Wikimedia Commons (PD)',
        wiki: 'Ruusulaakso',
      },
    ],
    kysymys: {
      q: 'Miksi Bulgarian ruusut poimitaan aamuviideltä?',
      options: [
        'Päivän lämmössä tuoksuöljy haihtuu',
        'Ruusut kukkivat vain aamulla',
        'Mehiläiset häiritsevät myöhemmin',
        'Se on vanha uskonnollinen tapa',
      ],
      correct: 0,
      fact: 'Öljypitoisuus on korkeimmillaan ennen auringonnousua. '
        + 'Yhteen grammaan ruusuöljyä tarvitaan noin kolme kiloa '
        + 'terälehtiä.',
    },
  },

  lontoo: {
    nostot: [
      {
        tyyppi: 'kuva',
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
      {
        tyyppi: 'kuva',
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
      {
        tyyppi: 'kuva',
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
    kysymys: {
      q: 'Mikä veti maailman ensimmäisiä metrojunia Lontoossa vuonna 1863?',
      options: [
        'Höyryveturi',
        'Sähkömoottori',
        'Hevoset',
        'Paineilma',
      ],
      correct: 0,
      fact: 'Sähkövetoinen metrolinja avattiin Lontoossa vasta 1890. '
              + 'Ensimmäisellä radalla savu oli niin sakeaa, että tunneliin '
              + 'jätettiin aukkoja, joista se pääsi kadulle.',
    },
  },

  edinburgh: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Yhdeksän säveltä, ei yhtään taukoa',
        tiedosto: 'Piper busking in Edinburgh DSC05049.JPG',
        teksti: 'Skotlantilaisessa säkkipillissä on melodiapilli ja kolme '
                  + 'bordunapilliä, jotka soivat koko ajan samaa säveltä. '
                  + 'Melodiapillistä saa vain yhdeksän säveltä, eikä ääntä voi '
                  + 'katkaista lainkaan — siksi soittaja erottaa peräkkäiset '
                  + 'sävelet toisistaan salamannopeilla koristenuoteilla. '
                  + 'Soitin on tehty ulos: se soi noin 110 desibeliä.',
        selite: 'Säkkipillinsoittaja Edinburghin kadulla. Säkki on '
                  + 'kainalossa, puhallusputki suussa ja kolme bordunapilliä '
                  + 'lepää olkapäällä.',
        lahde: 'David Monniaux, Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Säkkipilli',
        musiikki: 'https://music.apple.com/fi/search?term=highland%20bagpipe',
        musiikkiNimi: 'Skotlantilaista säkkipillimusiikkia Apple Musicissa',
        musiikkiNayte: 'https://archive.org/download/raretunes_364_beating-retreat-edinburgh-castle/raretunesedretreat.mp3',
        musiikkiNayteNimi: 'Pipe band, Edinburgh Castle — CC BY-NC-SA',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Haggis, lanttu ja peruna',
        tiedosto: 'Haggis neeps tatties.JPG',
        teksti: 'Haggis on lampaan sisäelimistä, kaurasuurimoista, '
                  + 'sipulista ja mausteista tehty makkara, joka keitetään '
                  + 'perinteisesti lampaan mahassa. Se syödään lantun ja '
                  + 'perunan kanssa. Runoilija Robert Burns kirjoitti '
                  + 'haggisille oman runon 1786, ja siksi joka 25. tammikuuta '
                  + 'istutaan Burns-illalliselle: runo luetaan ääneen ja '
                  + 'makkara avataan puukolla.',
        selite: 'Haggis, neeps ja tatties eli haggis, lanttusose ja '
                  + 'perunasose ravintola-annoksena. Kotona ne kasataan '
                  + 'lautaselle vierekkäin, ei päällekkäin.',
        lahde: 'Metukkalihis, Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Haggis',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Kutsumattomat perustivat festivaalin',
        tiedosto: 'Fringe 2014 HighSt MG 0026-001.jpg',
        teksti: 'Vuonna 1947 Edinburghiin perustettiin kansainvälinen '
                  + 'taidefestivaali. Kahdeksan teatteriryhmää jäi kutsulistan '
                  + 'ulkopuolelle ja tuli silti — ne esiintyivät reunalla eli '
                  + 'fringellä. Siitä kasvoi maailman suurin esittävän taiteen '
                  + 'festivaali: vuonna 2025 ohjelmassa oli 3 893 esitystä 301 '
                  + 'paikassa. Ohjelmaa ei valitse kukaan: kuka tahansa saa '
                  + 'esiintyä, jos löytää itselleen esityspaikan.',
        selite: 'Royal Milen yläpää elokuussa: esiintyjä seisoo pollarin '
                  + 'päällä ja mainostaa omaa esitystään. Katu on festivaalin '
                  + 'ajan kokonaan jalankulkijoiden.',
        lahde: 'Brian McNeil, Wikimedia Commons (CC BY 3.0)',
      },
    ],
    kysymys: {
      q: 'Miten Edinburghin Fringe-festivaali sai alkunsa vuonna 1947?',
      options: [
        'Kahdeksan kutsumatonta ryhmää tuli esiintymään silti',
        'Kuningatar määräsi sen perustettavaksi',
        'Se alkoi radio-ohjelmana',
        'Se siirrettiin Edinburghiin Lontoosta',
      ],
      correct: 0,
      fact: 'Fringe tarkoittaa reunaa. Festivaali on yhä avoin kaikille: '
              + 'ohjelmaa ei valitse mikään raati, mutta esiintyjän on itse '
              + 'hankittava esityspaikkansa ja maksettava se.',
    },
  },

  dublin: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Säkkipilli, jota ei puhalleta',
        tiedosto: 'Patrick D\'Arcy, musician..jpg',
        teksti: 'Uilleann-pilli on Irlannin oma säkkipilli, eikä siihen '
                  + 'puhalleta lainkaan: ilma pumpataan palkeella, joka on '
                  + 'hihnalla kiinni oikeassa kyynärpäässä. Nimi tuleekin '
                  + 'irlannin sanasta uillinn eli kyynärpää. Soittaja istuu ja '
                  + 'pitää melodiapilliä polvellaan. Unesco otti '
                  + 'uilleann-pillin perinneluetteloonsa vuonna 2017.',
        selite: 'Uilleann-pillin täysi setti soittajan olalla: '
                  + 'melodiapilli, kolme bordunapilliä ja kolme säätöpilliä, '
                  + 'joiden läpillä soitetaan sointuja säestykseksi.',
        lahde: 'PatDarcy, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Irlantilainen kansanmusiikki',
        musiikki: 'https://music.apple.com/fi/search?term=uilleann%20pipes',
        musiikkiNimi: 'Uilleann-pillimusiikkia Apple Musicissa',
        musiikkiNayte: 'https://archive.org/download/TheKerryJigTheMugOfBrownAle/01_kerry_mug_of_brown_ale_jigs.mp3',
        musiikkiNayteNimi: 'Irlantilainen jigi ja reel — Tradschool, CC BY-NC-SA',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Coddle on tähteiden pata',
        tiedosto: 'Irish Coddle.jpg',
        teksti: 'Coddle on dublinilainen pata: makkarat, pekoni, perunat ja '
                  + 'sipuli haudutetaan samassa liemessä tiiviin kannen alla. '
                  + 'Mausteina on yleensä vain suola ja pippuri, eikä mitään '
                  + 'ruskisteta — siksi ruoka näyttää vaaleammalta kuin '
                  + 'maistuu. Coddlea tehtiin, jotta viikon tähteet saatiin '
                  + 'syödyksi, ja se esiintyy myös James Joycen teksteissä.',
        selite: 'Kulhollinen coddlea. Makkarat ja pekoni antavat liemen, '
                  + 'perunat imevät sen itseensä, ja kaikki kypsyy samassa '
                  + 'kattilassa yhtä aikaa.',
        lahde: 'Wikimedia Commons (CC0)',
        wiki: 'Irlantilainen keittiö',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Täysi stadion, palkaton joukkue',
        tiedosto: 'Parade, hurling match.jpg',
        teksti: 'Hurlingissa lyödään saarnipuisella mailalla sliotar-palloa '
                  + 'maalin ylitse tai sisään. Peli on irlantilainen ja hyvin '
                  + 'vanha: siitä kerrotaan jo keskiaikaisissa laeissa. Croke '
                  + 'Parkiin Dublinissa mahtuu 82 300 katsojaa, mikä on '
                  + 'Euroopan neljänneksi eniten, mutta yksikään pelaaja ei saa '
                  + 'palkkaa — kaikki ovat amatöörejä ja käyvät arkena töissä.',
        selite: 'Joukkueiden marssi ennen hurlingin All-Ireland-välierää '
                  + 'Croke Parkissa 2017. Pelaajat kiertävät kentän '
                  + 'soittokunnan perässä ennen aloitusta.',
        lahde: 'Sheila1988, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Hurling',
      },
    ],
    kysymys: {
      q: 'Miten irlantilaiseen uilleann-säkkipilliin saadaan ilmaa?',
      options: [
        'Palkeella, joka on kiinni soittajan kyynärpäässä',
        'Puhaltamalla putkeen',
        'Jalkapolkimella',
        'Pienellä sähköpumpulla',
      ],
      correct: 0,
      fact: 'Nimi uilleann tulee irlannin sanasta uillinn eli kyynärpää. '
              + 'Palkeen kuiva ilma pitää soittimen vireessä paremmin kuin '
              + 'suusta puhallettu kostea ilma.',
    },
  },

  pariisi: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Édith Piaf lauloi ensin kadulla',
        tiedosto: 'Édith Piaf 914-6440.jpg',
        teksti: 'Édith Piaf syntyi Pariisissa 1915 ja lauloi nuorena '
                  + 'kolikoista kaduilla ja pihoilla. Kabaree-isäntä löysi '
                  + 'hänet 1935 ja antoi lempinimen la Môme Piaf — piaf on '
                  + 'pariisilaista puhekieltä ja tarkoittaa varpusta. Laulaja '
                  + 'oli 142 senttiä pitkä. Tunnetuin laulu on La Vie en rose '
                  + 'vuodelta 1946, jonka sanat hän kirjoitti itse.',
        selite: 'Édith Piaf konsertissa Rotterdamissa joulukuussa 1962, '
                  + 'alle vuosi ennen kuolemaansa. Hän esiintyi aina mustassa '
                  + 'mekossa ja lauloi kädet koholla — asu ja asento olivat '
                  + 'hänen tavaramerkkinsä.',
        lahde: 'Wikimedia Commons (CC0)',
        wiki: 'Édith Piaf',
        musiikki: 'https://music.apple.com/fi/search?term=edith%20piaf',
        musiikkiNimi: 'Édith Piaf Apple Musicissa',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Patongista kilpaillaan joka vuosi',
        tiedosto: 'Boulangerie Tout autour du pain.jpg',
        teksti: 'Ranskan laki määrää, mitä perinteisessä patongissa saa '
                  + 'olla: käytännössä vain vehnäjauhoa, vettä, suolaa ja '
                  + 'hiivaa, eikä taikinaa saa missään vaiheessa pakastaa. '
                  + 'Pariisin kaupunki järjestää joka vuosi kilpailun, jossa '
                  + 'raati maistaa sokkona toistasataa patonkia. Voittaja saa '
                  + 'rahapalkinnon ja toimittaa vuoden ajan leivät presidentin '
                  + 'palatsiin.',
        selite: 'Pariisilaisen leipomon ikkuna, johon on maalattu '
                  + 'sijoitukset kaupungin patonkikilpailussa ja '
                  + 'croissant-kilpailussa vuosien varrelta. Hyvä sijoitus on '
                  + 'mainos, joka pidetään esillä vuosikymmeniä.',
        lahde: 'FreCha, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Patonki',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Seinen vihreät kirjalaatikot',
        tiedosto: 'Paris 75005 Quai de Montebello Bouquinistes 20071014.jpg',
        teksti: 'Seinen kaiteisiin on pultattu vihreitä peltilaatikoita, '
                  + 'joissa myydään käytettyjä kirjoja. Kauppiaita on runsaat '
                  + 'kaksisataa ja laatikoita lähes yhdeksänsataa noin kolmen '
                  + 'kilometrin matkalla. Kaupunki päättää säännöt: yhdellä '
                  + 'myyjällä on neljä laatikkoa, kaikki on maalattava samalla '
                  + 'tummanvihreällä, ja ne on avattava vähintään neljänä '
                  + 'päivänä viikossa.',
        selite: 'Bouquiniste-kojuja Quai de Montebellella Notre-Damen '
                  + 'vastarannalla. Laatikot ovat kiinni kaiteessa ja aukeavat '
                  + 'kannen tavoin; illaksi ne lukitaan ja kauppias kävelee '
                  + 'kotiin.',
        lahde: 'Benh LIEU SONG, Wikimedia Commons (CC BY-SA 3.0)',
      },
    ],
    kysymys: {
      q: 'Mitä pariisilainen leipuri saa palkinnoksi, jos voittaa kaupungin '
           + 'patonkikilpailun?',
      options: [
        'Hän toimittaa vuoden ajan leivät presidentin palatsiin',
        'Hän saa leipoa yhden päivän Eiffel-tornissa',
        'Hänen leipomonsa vapautuu verosta',
        'Hän pääsee raatiin seuraavaksi vuodeksi',
      ],
      correct: 0,
      fact: 'Pariisin patonkikilpailu on järjestetty vuodesta 1994. Raati '
              + 'maistaa leivät sokkona, ja voittaja saa rahapalkinnon sekä '
              + 'oikeuden — ja velvollisuuden — toimittaa Élysée-palatsin '
              + 'patongit seuraavan vuoden ajan.',
    },
  },

  lissabon: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Fado — laulu, jossa on saudade',
        tiedosto: 'Amalia Rodrigues Portugese fado-zangeres op Schiphol, Bestanddeelnr 916-9840.jpg',
        teksti: 'Fado on Lissabonin oma laulu: yksi laulaja, klassinen '
                  + 'kitara ja portugalilainen kitara, jossa on kaksitoista '
                  + 'kieltä kuutena parina. Aiheena on useimmiten saudade, '
                  + 'kaipaus jotakin kohti, mitä ei enää ole. Amália Rodrigues '
                  + 'lauloi fadoa yli viisikymmentä vuotta, ja kun hän kuoli '
                  + '1999, Portugalissa vietettiin kolme päivää kansallista '
                  + 'surua.',
        selite: 'Amália Rodrigues Schipholin lentokentällä lokakuussa 1964 '
                  + 'kesken kiertueen. Hän esiintyi lähes aina mustissa '
                  + 'vaatteissa ja huivi hartioilla — asusta tuli fadolaulajan '
                  + 'tunnusmerkki.',
        lahde: 'Wikimedia Commons (CC0)',
        wiki: 'Amália Rodrigues',
        musiikki: 'https://music.apple.com/fi/search?term=am%C3%A1lia%20rodrigues',
        musiikkiNimi: 'Amália Rodrigues Apple Musicissa',
        musiikkiNayte: 'https://archive.org/download/Fado2017/003-don-bosco-students.mp3',
        musiikkiNayteNimi: 'Fadokilpailu 2017 — Aren Noronha, CC BY-SA',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Pastel de nata on luostarin resepti',
        tiedosto: 'Pasteles de nata en Pasteis de Belém.jpg',
        teksti: 'Jerónimosin luostarin munkit paistoivat '
                  + 'lehtitaikinakuppeja, joissa on munakermatäyte. Kun '
                  + 'luostarit suljettiin 1834, resepti päätyi viereiselle '
                  + 'sokerikaupalle, ja Pastéis de Belém on myynyt leivoksia '
                  + 'vuodesta 1837. Kahvila kertoo paistavansa niitä yli 20 000 '
                  + 'päivässä. Vain siellä ne saa nimittää pastéis de belém — '
                  + 'muualla ne ovat pastel de nata.',
        selite: 'Leivoksia myyntitiskillä Pastéis de Belémissä '
                  + 'Lissabonissa. Kuoren pitää olla rapea ja täytteen pinnan '
                  + 'hieman palanut: juuri ne mustat läiskät ovat oikein '
                  + 'paistetun merkki.',
        lahde: 'ProtoplasmaKid, Wikimedia Commons (CC BY-SA 4.0)',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Azulejot pitävät talon viileänä',
        tiedosto: 'Lisboa, azulejos 3.jpg',
        teksti: 'Lissabonin talot on päällystetty maalatuilla laatoilla. '
                  + 'Tavallisen azulejon sivu on neljätoista senttiä, ja laatat '
                  + 'ladotaan seinään kuvioksi. Kyse ei ole vain koristeesta: '
                  + 'laatta torjuu sadetta ja pitää sisätilan viileämpänä '
                  + 'helteellä. Sana ei tule espanjan sinistä tarkoittavasta '
                  + 'sanasta azul vaan arabian sanasta az-zulayj, kiillotettu '
                  + 'pikkukivi.',
        selite: 'Lissabonilaisen talon julkisivu läheltä. Sama kuvio '
                  + 'toistuu laatasta toiseen, ja neljä laattaa muodostaa '
                  + 'yhdessä yhden suuremman kuvion — siksi ladonnan on '
                  + 'osuttava kohdalleen.',
        lahde: 'LBM1948, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Azulejo',
      },
    ],
    kysymys: {
      q: 'Mistä portugalilaisten seinälaattojen nimi azulejo tulee?',
      options: [
        'Arabian sanasta az-zulayj, kiillotettu pikkukivi',
        'Espanjan sanasta azul, sininen',
        'Lissabonin Azul-korttelin nimestä',
        'Latinan sanasta azula, savi',
      ],
      correct: 0,
      fact: 'Moni luulee nimen tulevan sinisestä väristä, koska laatat ovat '
              + 'usein sinivalkoisia. Sana on kuitenkin arabiaa ja tarkoittaa '
              + 'kiillotettua pikkukiveä eli mosaiikin palasta. Portugalissa '
              + 'laattoja on tehty yli viisisataa vuotta.',
    },
  },

  madrid: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Chotis tanssitaan yhden laatan päällä',
        tiedosto: 'Parejas bailando Chotis - Madrid 01.jpg',
        teksti: 'Chotis tuli Madridiin 1850 Keski-Euroopasta, mutta muuttui '
                  + 'perillä omanlaisekseen. Säännön mukaan mies ei siirry '
                  + 'laatalta, jolla seisoo: hän pyörii paikallaan, ja nainen '
                  + 'kiertää hänen ympärillään. Säestää organillo, kadulla '
                  + 'työnnettävä kampiurut. Tanssi kuuluu verbena-juhliin, '
                  + 'joista suurin on San Isidro 15. toukokuuta.',
        selite: 'Pareja tanssimassa chotisia Plaza de Santa Cruzilla '
                  + 'Madridissa. Miehillä on chulapon lakki ja liivi, naisilla '
                  + 'pitkä pilkullinen mekko, huivi hartioilla ja neilikka '
                  + 'hiuksissa.',
        lahde: 'Javier Perez Montes, Wikimedia Commons (CC BY-SA 4.0)',
        musiikki: 'https://music.apple.com/fi/search?term=chotis%20madrile%C3%B1o',
        musiikkiNimi: 'Chotis-musiikkia Apple Musicissa',
        musiikkiNayte: 'https://archive.org/download/granvi30g/AE2784.mp3',
        musiikkiNayteNimi: 'La Gran Vía -zarzuela — Emilio Sagi-Barba, PD',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Cocido kaadetaan pöytään kolmesti',
        tiedosto: 'Cocido madrileño.jpg',
        teksti: 'Cocido madrileño hautuu tuntikausia yhdessä padassa mutta '
                  + 'syödään erissä. Ensin tulee liemi ohuine nuudeleineen, '
                  + 'sitten kikherneet ja vihannekset ja viimeisenä lihat: '
                  + 'naudanrintaa, kanaa, chorizoa ja verimakkaraa. Eriä '
                  + 'sanotaan nimellä vuelco, kaato, ja perinteisin tapa on '
                  + 'kaataa pata lautaselle kolmeen kertaan.',
        selite: 'Cocido madrileño tarjoiltuna kahdessa erässä: edessä '
                  + 'liemi, takana kikherneet, peruna, porkkana ja padan lihat. '
                  + 'Kikherneet on liotettu edellisenä iltana koko yön.',
        lahde: 'Smnt, Wikimedia Commons (CC BY-SA 4.0)',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Kaksitoista rypälettä kellonlyönnillä',
        tiedosto: 'Ensayo general ....las doce campanadas del ilustre y solemne reloj de la Puerta del Sol !!!.jpg',
        teksti: 'Uudenvuodenyönä espanjalaiset syövät kaksitoista '
                  + 'rypälettä, yhden jokaisella kellonlyönnillä. Kello on '
                  + 'Puerta del Solin vanhan postitalon tornissa, ja lyönnit '
                  + 'tulevat parin sekunnin välein — koko urakka on ohi '
                  + 'puolessa minuutissa. Tapa levisi koko maahan vuoden 1909 '
                  + 'jälkeen, kun Alicanten viininviljelijöillä oli '
                  + 'poikkeuksellisen suuri sato myytävänä.',
        selite: 'Puerta del Sol 30. joulukuuta: aukiolla harjoitellaan '
                  + 'uudenvuodenyötä etukäteen, ja tuhannet ihmiset syövät '
                  + 'rypäleensä vuorokautta liian aikaisin. Taustalla '
                  + 'valaistuna Real Casa de Correosin kellotorni.',
        lahde: 'jacinta lluch valero, Wikimedia Commons (CC BY-SA 2.0)',
        wiki: 'Puerta del Sol',
      },
    ],
    kysymys: {
      q: 'Mikä on madridilaisen chotis-tanssin tunnetuin sääntö?',
      options: [
        'Mies ei siirry laatalta, jolla seisoo',
        'Tanssijat eivät saa koskettaa toisiaan',
        'Tanssia saa vain ulkosalla',
        'Pari vaihtuu joka kahdeksas tahti',
      ],
      correct: 0,
      fact: 'Sanotaan, että chotis tanssitaan yhden laatan päällä: mies '
              + 'pyörii paikallaan ja nainen kiertää hänen ympärillään. Tanssi '
              + 'tuli Madridiin 1850 Keski-Euroopasta ja sai kaupungissa oman '
              + 'muotonsa.',
    },
  },

  barcelona: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Sardanassa askeleet lasketaan',
        tiedosto: 'Sardana Pla de la Seu.jpg',
        teksti: 'Sardana tanssitaan piirissä käsi kädessä, ja askeleet '
                  + 'lasketaan tarkasti: jokaisessa sävelmässä on oma määrä '
                  + 'lyhyitä ja pitkiä askelia, ja joku piirissä laskee ne '
                  + 'muiden puolesta. Soittaa cobla, jossa on yksitoista '
                  + 'soittajaa mutta kaksitoista soitinta — flabiol-huilun '
                  + 'soittaja lyö samalla käsivarteensa sidottua pikkurumpua.',
        selite: 'Sardanaa tanssitaan katedraalin edustalla Barcelonassa. '
                  + 'Tanssijat jättävät laukkunsa ja takkinsa piirin keskelle; '
                  + 'se kuuluu tapaan yhtä lailla kuin askeleet.',
        lahde: 'Canaan, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Sardana',
        musiikki: 'https://music.apple.com/fi/search?term=sardana%20cobla',
        musiikkiNimi: 'Sardana-musiikkia Apple Musicissa',
        musiikkiNayte: 'https://archive.org/download/TarannCobla-OdaAlFolklore/01RquiemDeCooper.mp3',
        musiikkiNayteNimi: 'Cobla soittaa — Tarannà + Cobla, CC BY-NC',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Calçot syödään esiliina kaulassa',
        tiedosto: 'Calçotada a Valls (Catalonia).jpg',
        teksti: 'Calçot on pitkäksi kasvatettu kevätsipuli, jota paahdetaan '
                  + 'avotulella viiniköynnöksen oksista. Musta pinta vedetään '
                  + 'sormin pois, sipuli kastetaan romesco-kastikkeeseen ja '
                  + 'pudotetaan suuhun pää takakenossa. Kausi kestää talvesta '
                  + 'kevääseen, ja Vallsin kaupunki, josta laji on kotoisin, '
                  + 'järjestää oman calçotada-juhlansa tammikuun viimeisenä '
                  + 'sunnuntaina.',
        selite: 'Calçoteja paahdetaan kadulla Vallsissa. Sipulit ladotaan '
                  + 'ritilälle palavien viiniköynnöksen oksien päälle, ja '
                  + 'kuoren pitää hiiltyä mustaksi, jotta sisus kypsyy '
                  + 'höyryssä. Paahtajilla on punainen barretina-lakki.',
        lahde: 'flydime, Wikimedia Commons (CC BY-SA 2.0)',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Ihmistornin huipulla on lapsi',
        tiedosto: '4de9f-Colla Jove Xiquets de Tarragona-Concurs2010.jpg',
        teksti: 'Castell on katalaanien ihmistorni. Pohjalla on pinya, '
                  + 'satojen ihmisten tiivis kasa, jonka päälle kerrokset '
                  + 'nousevat; korkeimmissa torneissa on kymmenen kerrosta. '
                  + 'Huipulle kiipeää lapsi, enxaneta, joka nostaa kätensä ja '
                  + 'näyttää neljää sormea — yhtä montaa kuin Katalonian '
                  + 'lipussa on raitaa.',
        selite: 'Castell nimeltä 4 de 9 amb folre Tarragonan kilpailussa: '
                  + 'neljä ihmistä joka kerroksessa ja yhdeksän kerrosta. '
                  + 'Alhaalla näkyy pinya, joka kannattelee tornia ja ottaa sen '
                  + 'kiinni, jos se sortuu.',
        lahde: 'Ferran ( fer55 ), Wikimedia Commons (CC BY-SA 2.0)',
      },
    ],
    kysymys: {
      q: 'Mitä katalaanien ihmistornin huipulle kiipeävä lapsi, enxaneta, '
           + 'tekee päästyään ylös?',
      options: [
        'Nostaa kätensä ja näyttää neljää sormea',
        'Heittää alas punaisen huivin',
        'Huutaa tornin nimen',
        'Soittaa pientä kelloa',
      ],
      correct: 0,
      fact: 'Neljä sormea tarkoittaa Katalonian lipun neljää raitaa, ja '
              + 'merkki kertoo että torni on valmis. Onnistuneeksi torni '
              + 'lasketaan kuitenkin vasta, kun se on purettu kaatumatta. '
              + 'Unesco otti castells-perinteen suojelukseensa 2010.',
    },
  },

  amsterdam: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Katu-urut ja kolisevat kolikot',
        tiedosto: 'Amsterdam. Een draaiorgel op een van de grachten, Bestanddeelnr 901-8132.jpg',
        teksti: 'Belgialainen Leon Warnies avasi Amsterdamiin katu-urkujen '
                  + 'vuokraamon vuonna 1875, ja siitä alkoi koko hollantilainen '
                  + 'perinne. Musiikki tulee taitellusta pahvikirjasta, johon '
                  + 'on lyöty reikiä: yksi kirja on yksi kappale. Urkuri '
                  + 'kääntää kampea ja ravistaa toisella kädellä rahalipasta '
                  + 'ohikulkijoille.',
        selite: 'Katu-urut kanavan rannalla vuonna 1946. Soitin on '
                  + 'kokonainen vaunu, jota työnnetään käsin paikasta toiseen — '
                  + 'soittajan lisäksi mukana on aina rahankerääjä.',
        lahde: 'Wikimedia Commons (CC0)',
        wiki: 'Posetiivi',
        musiikki: 'https://music.apple.com/fi/search?term=draaiorgel',
        musiikkiNimi: 'Katu-urkumusiikkia Apple Musicissa',
        musiikkiNayte: 'https://archive.org/download/VPROreisnaarheteinde-draaiorgel/draaiorgel.mp3',
        musiikkiNayteNimi: 'Katu-urut — VPRO / lolaradio, CC BY-SA',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Silli syödään pyrstöstä',
        tiedosto: 'Hollandse nieuwe haring eten bij een haringstal in Amsterdam, Bestanddeelnr 932-6068.jpg',
        teksti: 'Hollandse Nieuwe on kevään ensimmäinen suolasilli, ja sen '
                  + 'saa myydä vasta kun kalan rasvapitoisuus on noussut noin '
                  + '16 prosenttiin. Perkauksessa haima jätetään paikalleen: '
                  + 'sen entsyymit kypsyttävät lihan muutamassa päivässä. '
                  + 'Kojulla silli kastetaan sipuliin ja lasketaan suuhun '
                  + 'pyrstöstä pidellen.',
        selite: 'Silliä syödään amsterdamilaisella kalakojulla vuonna 1983. '
                  + 'Pää on poistettu ja ruoto vedetty pois, joten kala '
                  + 'nostetaan pyrstöstä — juuri niin kuin paikallinen tapa '
                  + 'vaatii.',
        lahde: 'Wikimedia Commons (CC0)',
        wiki: 'Silli',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Verotettiin julkisivun leveydestä',
        tiedosto: 'Detail van de top van de voorgevel, een klokgevel, met hijsbalk - Amsterdam - 20528909 - RCE.jpg',
        teksti: '1600-luvulla Amsterdamin kiinteistövero laskettiin '
                  + 'julkisivun leveydestä, joten taloista tehtiin kapeita ja '
                  + 'syviä. Kapein niistä, Oude Hoogstraat 22, on 2,02 metriä '
                  + 'leveä ja kuusi metriä syvä. Portaat ovat siksi jyrkät kuin '
                  + 'tikkaat, ja huonekalut nostetaan yhä ulkokautta ikkunasta '
                  + 'sisään.',
        selite: 'Kellonmuotoinen päätykoriste ja siitä ulos työntyvä '
                  + 'hijsbalk-nostopuu. Talot rakennettiin hieman eteenpäin '
                  + 'kallelleen, jottei nostettava tavara kolhisi julkisivua.',
        lahde: 'Rijksdienst voor het Cultureel Erfgoed, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Amsterdam',
      },
    ],
    kysymys: {
      q: 'Miksi Amsterdamin vanhat kanavatalot ovat niin kapeita?',
      options: [
        'Kiinteistövero laskettiin julkisivun leveydestä',
        'Kapea talo kesti tulvat paremmin',
        'Kanavan varrella ei ollut tilaa leveämmille',
        'Laki kielsi yli kolme metriä leveät talot',
      ],
      correct: 0,
      fact: '1600-luvulla vero määräytyi julkisivun leveyden mukaan, joten '
              + 'rakennettiin kapeaa ja syvää. Kapein talo, Oude Hoogstraat 22, '
              + 'on 2,02 metriä leveä — ja siinä toimii nykyään kauppa.',
    },
  },

  berliini: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Tyhjät talot täyttyivät bassosta',
        tiedosto: 'Love Parade 1998 03.jpg',
        teksti: 'Kun muuri kaatui 1989, keskustaan jäi tyhjiä tehtaita, '
                  + 'kellareita ja pankkiholveja, joilla ei ollut omistajaa. '
                  + 'Niihin syntyi teknoklubeja, joissa idän ja lännen nuoret '
                  + 'tanssivat ensi kertaa samoissa tiloissa. Berliinin '
                  + 'teknokulttuuri otettiin maaliskuussa 2024 Saksan '
                  + 'aineettoman kulttuuriperinnön luetteloon.',
        selite: 'Love Parade Berliinissä 1998. Ensimmäisessä kulkueessa '
                  + 'vuonna 1989 oli 150 osallistujaa, huippuvuonna 1999 '
                  + 'arviolta puolitoista miljoonaa. Viimeinen paraati '
                  + 'pidettiin 2010.',
        lahde: 'Ago76, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Love Parade',
        musiikki: 'https://music.apple.com/fi/search?term=berlin%20techno',
        musiikkiNimi: 'Berliiniläistä teknoa Apple Musicissa',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Makkara, jolla on oma pykälä',
        tiedosto: 'Currywurst von Curry 36 Berlin (2023 Okt) - Bild 01.jpg',
        teksti: 'Herta Heuwer sekoitti kioskillaan Charlottenburgissa 4. '
                  + 'syyskuuta 1949 kastikkeen ketsupista, currystä ja '
                  + 'mausteista ja kaatoi sen paistetun makkaran päälle. Nimen '
                  + 'Chillup hän rekisteröi 1959. Nykyään suolittoman '
                  + 'berliininmakkaran nimi on suojattu: hakemuksen käsittely '
                  + 'kesti kolmetoista vuotta.',
        selite: 'Currywurst ja ranskalaiset berliiniläisellä kioskilla. '
                  + 'Makkara paistetaan kokonaisena, leikataan paloiksi vasta '
                  + 'annokseen ja peitetään kastikkeella ja currymausteella.',
        lahde: 'Chainwit, Wikimedia Commons (CC BY 4.0)',
        wiki: 'Currywurst',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Hattupäinen ukkeli sai jäädä',
        tiedosto: 'Ampelmännchen go.jpg',
        teksti: 'Liikennepsykologi Karl Peglau piirsi vuonna 1961 '
                  + 'Itä-Saksalle oman jalankulkuvalon: leveä hahmo hattuineen '
                  + 'erottuu kauas, koska valopintaa on paljon. Ensimmäiset '
                  + 'syttyivät Itä-Berliinissä 1969. Yhdistymisen jälkeen '
                  + 'ukkelia oltiin poistamassa, mutta kansalaiskampanja '
                  + 'pelasti sen.',
        selite: 'Vihreä Ampelmännchen Berliinissä. Taustalla Keisari '
                  + 'Vilhelmin muistokirkon torso, joka jätettiin pommituksissa '
                  + 'saamaansa asuun muistutukseksi sodasta.',
        lahde: 'Wikimedia Commons (CC0)',
        wiki: 'Ampelmännchen',
      },
    ],
    kysymys: {
      q: 'Mistä Berliinin liikennevalojen hattupäinen ukkeli on peräisin?',
      options: [
        'Itä-Saksasta, jossa se suunniteltiin vuonna 1961',
        'Berliinin olympialaisista vuodelta 1936',
        'Se on 2000-luvun matkamuistokeksintö',
        'Ranskasta, jossa se otettiin ensin käyttöön',
      ],
      correct: 0,
      fact: 'Karl Peglau suunnitteli Ampelmännchenin Itä-Saksan '
              + 'liikenneministeriölle vuonna 1961, ja ensimmäiset valot '
              + 'syttyivät Itä-Berliinissä 1969. Yhdistymisen jälkeen '
              + 'kansalaiskampanja esti sen poistamisen.',
    },
  },

  wien: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Kaupunki sävelsi oman jokensa',
        tiedosto: 'Johann Strauss II by Fritz Luckhardt.jpg',
        teksti: 'Johann Strauss nuoremman valssi Tonava kaunoinen '
                  + 'kantaesitettiin Wienissä 15. helmikuuta 1867 — ensin '
                  + 'mieskuorolle, vasta myöhemmin orkesterille. '
                  + 'Wieniläisvalssissa toinen isku tulee hitusen etuajassa, '
                  + 'joten se ei mene metronomin kanssa tasan: sitä ei voi '
                  + 'laskea, se pitää tuntea.',
        selite: 'Johann Strauss nuorempi Fritz Luckhardtin valokuvaamana '
                  + 'vuonna 1899, hänen kuolinvuotenaan. Strauss sävelsi noin '
                  + 'viisisataa teosta ja johti orkesteriaan viulu kädessä.',
        lahde: 'Wikimedia Commons (PD)',
        wiki: 'Johann Strauss nuorempi',
        musiikki: 'https://music.apple.com/fi/search?term=Johann%20Strauss%20Donauwalzer',
        musiikkiNimi: 'Tonava kaunoinen Apple Musicissa',
        musiikkiNayte: 'https://upload.wikimedia.org/wikipedia/commons/d/de/%22An_der_sch%C3%B6nen%2C_blauen_Donau%22%2C_performed_by_the_US_Marine_Band.mp3',
        musiikkiNayteNimi: 'Strauss: Tonava kaunoinen — United States Marine Band, PD',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Kahvila on kaupungin olohuone',
        tiedosto: 'Cafe Central in Vienna interior near portraits.JPG',
        teksti: 'Wieniläisessä kahvilassa yhden kupin voi venyttää koko '
                  + 'iltapäiväksi, ja lehdet kuuluvat hintaan. Kahvin kanssa '
                  + 'tuodaan aina lasi hanavettä, joka täytetään pyytämättä '
                  + 'uudelleen. Melange — kahvia maidon ja maitovaahdon kanssa '
                  + '— on lajeista vanhimpia. Kahvilakulttuuri pääsi Itävallan '
                  + 'kulttuuriperintöluetteloon 2011.',
        selite: 'Café Centralin holvisali Wienissä. Seinällä keisaripari '
                  + 'Frans Joosef ja Elisabet, pöydissä luetaan ja kirjoitetaan '
                  + '— juuri niin kuin kahvilassa kuuluu.',
        lahde: 'Clayton Tang, Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Wien',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Kilometrin pituinen kotitalo',
        tiedosto: 'Karl Marx Hof.jpg',
        teksti: 'Vuoden 1917 laskennassa 92 prosentissa Wienin asunnoista '
                  + 'ei ollut omaa vessaa. Kaupunki ryhtyi itse '
                  + 'rakennuttajaksi: Karl-Marx-Hof valmistui 1930, on noin 1 '
                  + '050 metriä pitkä ja siinä on runsaat 1 300 asuntoa. '
                  + 'Tontista jätettiin rakentamatta yli kolme neljäsosaa — '
                  + 'loppu on pihaa ja leikkikenttää.',
        selite: 'Karl-Marx-Hofin julkisivu Döblingin kaupunginosassa. Neljä '
                  + 'holvikaarta ovat kukin 12 metriä leveitä, ja tornien '
                  + 'lipputangot kuuluivat alkuperäiseen suunnitelmaan.',
        lahde: 'Thomas Ledl, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Karl-Marx-Hof',
      },
    ],
    kysymys: {
      q: 'Kuinka moni wieniläinen asuu kaupungin omistamassa '
           + 'vuokra-asunnossa?',
      options: [
        'Noin joka neljäs',
        'Noin joka sadas',
        'Ei kukaan, kaikki asunnot ovat yksityisiä',
        'Kaikki, muunlaisia asuntoja ei ole',
      ],
      correct: 0,
      fact: 'Wienin kaupunki omistaa noin 220 000 asuntoa ja on Euroopan '
              + 'suurin vuokranantaja. Niissä asuu noin puoli miljoonaa ihmistä '
              + 'eli suunnilleen neljäsosa kaupunkilaisista.',
    },
  },

  alpit: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Torvi, joka puhuu laaksosta toiseen',
        tiedosto: 'Alphornblaeserformation über Kreuz in Zermatt - panoramio.jpg',
        teksti: 'Alppitorvessa ei ole yhtäkään venttiiliä eikä läppää, '
                  + 'joten siitä saa vain luonnonsävelsarjan äänet — taitava '
                  + 'soittaja yltää kuuteentoista. Ääni kantaa maastosta '
                  + 'riippuen viidestä kymmeneen kilometriin. Sillä kutsuttiin '
                  + 'karja kotiin ja viestittiin naapurilaaksoon, kun muuta '
                  + 'puhelinta ei ollut.',
        selite: 'Alppitorvensoittajia Zermattissa. Torvien suppilot '
                  + 'lepäävät maassa; jokainen on veistetty kuusesta ja koottu '
                  + 'kolmesta osasta, ja seinämä on vain 6–8 millimetriä paksu.',
        lahde: 'Walter Schärer, Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Alppitorvi',
        musiikki: 'https://music.apple.com/fi/search?term=alphorn',
        musiikkiNimi: 'Alppitorvimusiikkia Apple Musicissa',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Kansallisruoka, joka piti keksiä',
        tiedosto: 'Full cheese fondue set - in Switzerland.JPG',
        teksti: 'Juustofondue oli 1900-luvun alussa tuttu vain muutamassa '
                  + 'laaksossa. Sveitsin juustoliitto teki siitä kansallisruoan '
                  + 'mainoskampanjalla, ja armeijan keittokirja levitti '
                  + 'reseptin koko maahan 1950-luvulla. Tunnetuin sekoitus on '
                  + 'moitié-moitié: puolet gruyèrea, puolet vacherinia. Pataan '
                  + 'pudonnut leipä maksaa laulun.',
        selite: 'Fonduepata eli caquelon lämmittimen päällä, vieressä '
                  + 'leipäkuutioita ja pikkukurkkuja. Juusto pidetään sulana '
                  + 'pienellä liekillä ja sitä sekoitetaan koko ajan.',
        lahde: 'Wikimedia Commons (PD)',
        wiki: 'Fondue',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Vuoren kanssa opitaan elämään',
        tiedosto: 'St. Antönien Lawinenverbauung 02.jpg',
        teksti: 'Alppikylissä lumivyöryn hallinta on taitoa, joka on '
                  + 'siirtynyt sukupolvelta toiselle: mitä metsää ei kaadeta, '
                  + 'minne ei rakenneta, milloin tie suljetaan. Rinteisiin on '
                  + 'pystytetty teräsaitoja pitämään lumi paikallaan. Unesco '
                  + 'lisäsi tämän osaamisen kulttuuriperintöluetteloonsa vuonna '
                  + '2018 Sveitsin ja Itävallan yhteisestä hakemuksesta.',
        selite: 'Lumivyöryesteitä St. Antöniessa Graubündenin kantonissa. '
                  + 'Teräsristikot on rakennettu juuri sinne, mistä vyöry '
                  + 'lähtisi liikkeelle — kylän yläpuoliseen rinteeseen.',
        lahde: 'Paebi, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Lumivyöry',
      },
    ],
    kysymys: {
      q: 'Miksi alppitorvella voi soittaa vain tietyt sävelet?',
      options: [
        'Siinä ei ole venttiilejä eikä läppiä, joten se soittaa vain '
          + 'luonnonsäveliä',
        'Se on liian pitkä matalia ääniä varten',
        'Puu ei kestäisi kaikkia ääniä',
        'Soittajat eivät perinteen mukaan saa käyttää kaikkia säveliä',
      ],
      correct: 0,
      fact: 'Alppitorvi on luonnontorvi: sävelkorkeutta muutetaan vain '
              + 'huulilla. Siksi siitä saa noin kuusitoista säveltä, ja yksi '
              + 'niistä kuulostaa hieman epävireiseltä — sitä sanotaan '
              + 'alppitorvisäveleksi.',
    },
  },

  praha: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Kuuro mies sävelsi joen',
        tiedosto: 'Jan Vilímek - Bedřich Smetana.jpg',
        teksti: 'Bedřich Smetana menetti kuulonsa kokonaan lokakuussa 1874. '
                  + 'Alle kaksi kuukautta myöhemmin, 20. marraskuuta ja 8. '
                  + 'joulukuuta välisenä aikana, hän sävelsi Vltavan — teoksen, '
                  + 'joka seuraa jokea kahdesta pienestä lähteestä Prahaan '
                  + 'asti. Hän ei kuullut siitä koskaan säveltäkään. Vuodesta '
                  + '1952 Prahan kevät -festivaali on alkanut joka 12. '
                  + 'toukokuuta juuri tällä musiikilla.',
        selite: 'Bedřich Smetana (1824–1884) Jan Vilímekin litografiassa. '
                  + 'Vltava on osa kuuden sinfonisen runon sarjaa Má vlast eli '
                  + 'Isänmaani, jonka Smetana sävelsi vuosina 1874–1879.',
        lahde: 'Wikimedia Commons (PD)',
        wiki: 'Bedřich Smetana',
        musiikki: 'https://music.apple.com/fi/search?term=smetana%20vltava',
        musiikkiNimi: 'Smetanan Vltava Apple Musicissa',
        musiikkiNayte: 'https://archive.org/download/Friedrich_Smetana_-_Die_Moldau/Smetana-Moldau.mp3',
        musiikkiNayteNimi: 'Smetana: Vltava — CC0',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Voileipä, joka syödään haarukalla',
        tiedosto: 'Obložené chlebíčky.jpg',
        teksti: 'Chlebíček on paksu viipale vaaleaa leipää, jonka päälle '
                  + 'ladotaan perunasalaattia, kinkkua, kananmunaa ja '
                  + 'suolakurkkua. Prahalainen herkkukauppias Jan Paukert alkoi '
                  + 'myydä niitä liikkeessään 1910-luvulla, ja tapa levisi koko '
                  + 'maahan. Syntymäpäiviin ja hautajaisiin niitä tehdään yhä '
                  + 'vadillinen, ja kaupassa hinta lasketaan kappaleittain.',
        selite: 'Vadillinen chlebíčkejä katetulla pöydällä. Pohjana on '
                  + 'tavallisesti perunasalaatti, ja päälle tulee kinkkua, '
                  + 'salamia, munaa ja suolakurkkua — jokainen leipä '
                  + 'koristellaan erikseen.',
        lahde: 'Wikimedia Commons (CC0)',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Nukketeatteri puolusti kieltä',
        tiedosto: 'Marionette Opera Prague.jpg',
        teksti: 'Habsburgien valtakunnassa virastojen ja koulujen kieli oli '
                  + 'saksa, mutta kiertävät nukkenäyttelijät esittivät '
                  + 'markkinoilla näytelmänsä tšekiksi — siksi marionetit '
                  + 'muistetaan Tšekissä kielen puolustajina. Unesco otti '
                  + 'tšekkiläisen ja slovakialaisen nukketeatterin ihmiskunnan '
                  + 'kulttuuriperinnön luetteloon vuonna 2016. Prahassa on yhä '
                  + 'teattereita, joissa lankojen varassa esitetään kokonainen '
                  + 'ooppera.',
        selite: 'Prahan Vanhankaupungin nukketeatterin sisäänkäynti. Kyltti '
                  + 'mainostaa Don Giovannia — Mozartin ooppera sai maailman '
                  + 'ensi-iltansa Prahassa 29. lokakuuta 1787 säveltäjän '
                  + 'itsensä johtamana.',
        lahde: 'Jim Milles, Wikimedia Commons (CC BY 2.0)',
        wiki: 'Marionetti',
      },
    ],
    kysymys: {
      q: 'Mikä oli erikoista siinä, miten Bedřich Smetana sävelsi Vltavan '
           + 'vuonna 1874?',
      options: [
        'Hän oli juuri menettänyt kuulonsa kokonaan',
        'Hän sävelsi sen laivamatkalla',
        'Hän oli vasta kymmenvuotias',
        'Hän sävelsi sen ulkomuistista kahdella kielellä',
      ],
      correct: 0,
      fact: 'Smetana kuuroutui täysin lokakuussa 1874. Vltava syntyi 20. '
              + 'marraskuuta ja 8. joulukuuta välisenä aikana, eikä hän kuullut '
              + 'sitä koskaan. Prahan kevät -festivaali on avattu tällä '
              + 'musiikilla joka 12. toukokuuta vuodesta 1952.',
    },
  },

  budapest: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Tanssitalo alkoi yhdestä illasta',
        tiedosto: 'Muzsikás együttes, Hamar Dániel, ifj. Csooóri Sándor, Sipos Mihály. Fortepan 89430.jpg',
        teksti: 'Vuonna 1972 muutama budapestilainen soittaja järjesti '
                  + 'illan, jossa kansantanssia ei katsottu lavalta vaan '
                  + 'tanssittiin itse, kuten transilvanialaisissa kylissä. '
                  + 'Ideasta kasvoi táncház eli tanssitalo -liike: soittajat '
                  + 'istuvat nurkassa, opettaja näyttää askeleet ja loput '
                  + 'opitaan kädestä pitäen. Unesco nosti liikkeen '
                  + 'mallikelpoisten suojelutapojen luetteloon vuonna 2011.',
        selite: 'Muzsikás-yhtye soittaa tanssitalossa vuonna 1978: '
                  + 'kontrabasso, viuluja ja alttoviulu. Yhtye keräsi '
                  + 'sävelmänsä matkoilla kyliin, joissa vanhat soittajat vielä '
                  + 'muistivat ne ulkoa.',
        lahde: 'FORTEPAN / Urbán Tamás, Wikimedia Commons (CC BY-SA 3.0)',
        musiikki: 'https://music.apple.com/fi/search?term=muzsikas',
        musiikkiNimi: 'Muzsikás Apple Musicissa',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Gulassi on Unkarissa keitto',
        tiedosto: 'Paprika Vendor Budapest big hall.jpg',
        teksti: 'Se, mitä muualla Euroopassa kutsutaan gulassiksi, on '
                  + 'Unkarissa pörkölt eli paksu pata. Gulyás taas on keitto: '
                  + 'lientä, naudanlihaa, perunaa ja paprikaa, ja se syödään '
                  + 'lusikalla. Paprika saapui maahan ottomaanien mukana '
                  + '1500-luvulla, ja Budapestin suuressa kauppahallissa, joka '
                  + 'avattiin vuonna 1897, sitä myydään makeasta tuliseen.',
        selite: 'Paprikakauppa Budapestin suuressa kauppahallissa. Palot '
                  + 'riippuvat kuivumassa nauhoissa, ja jauhettu paprika '
                  + 'myydään irtotavarana — asiakas valitsee vahvuuden, ei '
                  + 'merkkiä.',
        lahde: 'Takkk, Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Gulassi',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Shakkia lämpimässä altaassa',
        tiedosto: 'Széchényi Spa Chess Champions (6991219530).jpg',
        teksti: 'Budapestin alla on toistasataa lämmintä lähdettä, ja '
                  + 'kaupunki on rakentanut niiden päälle kylpylöitä '
                  + 'ottomaanien ajoista asti. Széchenyin kylpylä avattiin '
                  + 'vuonna 1913, ja sen vesi nousee maasta 74- ja '
                  + '77-asteisena; altaisiin se jäähdytetään. Ulkoaltaan '
                  + 'reunalle on muurattu shakkilaudat, ja vakiopelaajat '
                  + 'tulevat paikalle myös talvella.',
        selite: 'Shakinpelaajia Széchenyin kylpylän ulkoaltaassa. Laudat on '
                  + 'kiinnitetty altaan reunaan, ja peli jatkuu vaikka '
                  + 'ympärillä uidaan.',
        lahde: 'Christine Zenino, Wikimedia Commons (CC BY 2.0)',
        wiki: 'Széchenyin kylpylä',
      },
    ],
    kysymys: {
      q: 'Mitä gulyás tarkoittaa Unkarissa?',
      options: [
        'Keittoa',
        'Paksua patalihaa',
        'Paprikajauhetta',
        'Grillattua leipää',
      ],
      correct: 0,
      fact: 'Gulyás on unkariksi keitto, jossa on lientä, naudanlihaa, '
              + 'perunaa ja paprikaa. Se paksu pata, jota muualla Euroopassa '
              + 'kutsutaan gulassiksi, on Unkarissa nimeltään pörkölt.',
    },
  },

  varsova: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Sydän palasi ilman omistajaansa',
        tiedosto: 'Frédéric Chopin - Eugène Delacroix - Musée du Louvre Peintures RF 1717.jpg',
        teksti: 'Fryderyk Chopin kasvoi Varsovassa ja lähti kaupungista '
                  + '20-vuotiaana marraskuussa 1830. Hän ei nähnyt sitä enää '
                  + 'koskaan. Kun hän kuoli Pariisissa 1849, hänen sisarensa '
                  + 'Ludwika toi sydämen Varsovaan, ja se on yhä muurattuna '
                  + 'Pyhän Ristin kirkon pilariin. Chopinin pianokilpailu on '
                  + 'järjestetty kaupungissa viiden vuoden välein vuodesta '
                  + '1927.',
        selite: 'Eugène Delacroix’n muotokuva Chopinista vuodelta 1838. '
                  + 'Maalaus oli alun perin kaksoismuotokuva, jossa oli myös '
                  + 'kirjailija George Sand; kangas leikattiin myöhemmin '
                  + 'kahtia.',
        lahde: 'Wikimedia Commons (PD)',
        wiki: 'Fryderyk Chopin',
        musiikki: 'https://music.apple.com/fi/search?term=chopin',
        musiikkiNimi: 'Fryderyk Chopin Apple Musicissa',
        musiikkiNayte: 'https://archive.org/download/ChopinAsDurPolonaise1/Chopin%20As%20Dur%20Polonaise%201.mp3',
        musiikkiNayteNimi: 'Chopin: Polonaise As-duuri — Ignaz Friedman, PD',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Maitobaari on yhä auki',
        tiedosto: 'Bar Mleczny Prasowy w Warszawie.png',
        teksti: 'Ensimmäisen maitobaarin avasi varsovalainen maidonmyyjä '
                  + 'Stanisław Dłużewski vuonna 1896: halpaa ruokaa maidosta, '
                  + 'munista ja jauhoista, ei lihaa eikä alkoholia. Sosialismin '
                  + 'aikana niitä oli Puolassa tuhansia, nykyään noin 150. '
                  + 'Valtio maksaa yhä osan raaka-aineista, joten lautasellinen '
                  + 'pierogeja maksaa murto-osan ravintolahinnasta.',
        selite: 'Bar Prasowy Varsovan keskustassa. Ikkunassa lukee vain '
                  + '"bar mleczny", maitobaari. Ruokalista on seinällä tiskin '
                  + 'takana, ja jonossa seisovat opiskelijat ja eläkeläiset '
                  + 'rinnakkain.',
        lahde: 'Artur Kuczmarski, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Bar mleczny',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Kaupungin läpi virtaa villi joki',
        tiedosto: 'POL Warszawa plaza 23.JPG',
        teksti: 'Veiksel kulkee Varsovan halki patoamattomana, ja itäranta '
                  + 'on jätetty lähes luonnontilaan: hiekkasärkkiä, pajukkoa ja '
                  + 'majavia keskellä lähes kahden miljoonan asukkaan '
                  + 'kaupunkia. Ranta kuuluu EU:n Natura 2000 '
                  + '-suojeluverkostoon. Kesäisin kaupunkilaiset makaavat '
                  + 'samoilla hiekoilla, joilla linnut pesivät, ja '
                  + 'vastarannalla näkyy lasitorneja.',
        selite: 'Varsovan kaupunkiranta Veikselin varrella sillan kupeessa. '
                  + 'Vasemmalla hiekkaa ja pensaikkoa, oikealla silta, jota '
                  + 'pitkin kulkee kaupungin liikenne.',
        lahde: 'Tadeusz Rudzki, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Veiksel',
      },
    ],
    kysymys: {
      q: 'Mitä Fryderyk Chopinista palasi Varsovaan hänen kuolemansa '
           + 'jälkeen?',
      options: [
        'Hänen sydämensä',
        'Hänen flyygelinsä',
        'Hänen kirjastonsa',
        'Hänen nuottikäsikirjoituksensa',
      ],
      correct: 0,
      fact: 'Chopin kuoli Pariisissa vuonna 1849. Hänen sisarensa Ludwika '
              + 'toi sydämen Varsovaan, ja se on muurattuna Pyhän Ristin kirkon '
              + 'pilariin. Muuten hänet on haudattu Pariisiin.',
    },
  },

  bukarest: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Soittajasuku maailmannäyttelyssä',
        tiedosto: 'P. Nadar - Exposition universelle de Paris. Section roumaine - Bande de Dinicu.jpg',
        teksti: 'Lăutar on romanialainen ammattisoittaja: hän soittaa '
                  + 'häissä, kastajaisissa ja hautajaisissa, ja sävelmät '
                  + 'opitaan korvakuulolta ilman nuotteja. Suurin osa '
                  + 'lăutareista on ollut romaneja. Valakian ja Moldavian '
                  + 'ruhtinaskunnissa aateliset, luostarit ja valtio pitivät '
                  + 'romaneja orjinaan, ja moni lăutar soitti orjana; '
                  + 'ruhtinaskunnat lakkauttivat orjuuden vuonna 1856. Romaneja '
                  + 'asuu Romaniassa satoja tuhansia, ja he tekevät kaikkia '
                  + 'ammatteja. Bukarestilainen Dinicun suku vei tämän musiikin '
                  + 'Pariisin maailmannäyttelyyn vuonna 1889 — samaan '
                  + 'näyttelyyn, jota varten Eiffel-torni rakennettiin.',
        selite: 'Dinicun soittokunta Pariisin maailmannäyttelyssä 1889, '
                  + 'Paul Nadarin kuvaamana. Eturivissä soitetaan naita eli '
                  + 'panhuilua ja näppäiltävää cobzaa, takana viuluja ja '
                  + 'kontrabassoa.',
        lahde: 'Wikimedia Commons (PD)',
        wiki: 'Panhuilu',
        musiikki: 'https://music.apple.com/fi/search?term=lautari%20romania',
        musiikkiNimi: 'Romanialaista lăutari-musiikkia Apple Musicissa',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Makkara, jolta loppui kuori',
        tiedosto: 'Mititei la gratar.jpg',
        teksti: 'Mici eli mititei, "pienet", ovat kuorettomia '
                  + 'jauhelihamakkaroita, joissa on valkosipulia, timjamia ja '
                  + 'ruokasoodaa — sooda tekee niistä kuohkeita. Tarinan mukaan '
                  + 'ne syntyivät 1800-luvun Bukarestissa, kun eräältä '
                  + 'kapakoitsijalta loppuivat makkarankuoret kesken illan ja '
                  + 'hän paistoi massan sellaisenaan. Vappuna niitä grillataan '
                  + 'koko maassa pihoilla ja puistoissa.',
        selite: 'Micejä hiiligrillissä. Massa puristetaan sormenpaksuisiksi '
                  + 'pötköiksi ilman kuorta ja käännellään hiilloksella '
                  + 'muutaman minuutin ajan. Lisukkeeksi tulee sinappia ja '
                  + 'leipää.',
        lahde: 'Nicubunu, Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Mititei',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Maailman painavin rakennus',
        tiedosto: 'Avenida de la Unión, Bucarest, Rumanía, 2016-05-29, DD 57.jpg',
        teksti: 'Parlamenttipalatsin rakentaminen alkoi vuonna 1984 Nicolae '
                  + 'Ceaușescun määräyksestä. Lattiapinta-alaa on 365 000 '
                  + 'neliömetriä ja painoa noin 4,1 miljoonaa tonnia — enemmän '
                  + 'kuin missään muussa rakennuksessa maailmassa. Tieltä '
                  + 'purettiin kokonainen vanha kaupunginosa, ja '
                  + 'kymmenettuhannet asukkaat muuttivat muualle. Nyt talossa '
                  + 'kokoontuu Romanian parlamentti.',
        selite: 'Unirii-bulevardi johtaa suoraan Parlamenttipalatsin '
                  + 'edustalle. Bulevardi rakennettiin samaan aikaan palatsin '
                  + 'kanssa, ja se on runsaat kolme kilometriä pitkä ja lähes '
                  + 'sata metriä leveä.',
        lahde: 'Diego Delso, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Casa Poporului',
      },
    ],
    kysymys: {
      q: 'Minkä maailmanennätyksen Bukarestin Parlamenttipalatsi pitää?',
      options: [
        'Se on maailman painavin rakennus',
        'Se on maailman korkein rakennus',
        'Se on maailman vanhin parlamenttitalo',
        'Siinä on maailman pisin liukuportaikko',
      ],
      correct: 0,
      fact: 'Palatsi painaa noin 4,1 miljoonaa tonnia ja on siten maailman '
              + 'painavin rakennus. Lattiapinta-alaltaan se on maailman suurin '
              + 'siviilihallinnon rakennus; ainoa sitä suurempi '
              + 'hallintorakennus on Yhdysvaltain Pentagon.',
    },
  },

  kiova: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Kobzari lauloi, ja sali vaikeni',
        tiedosto: 'Вересай Остап з дружиною.jpg',
        teksti: 'Kobzarit olivat sokeita kiertäviä laulajia, jotka '
                  + 'esittivät dumia — pitkiä kertovia lauluja — banduran '
                  + 'säestyksellä. Kuuluisin heistä, Ostap Veresai, kutsuttiin '
                  + 'Kiovaan vuonna 1873 maantieteellisen seuran kokoukseen: '
                  + 'kuulijoina oli 28 seuran jäsentä ja 60 kutsuvierasta. '
                  + 'Seuraavana vuonna hän lauloi Kiovan arkeologisessa '
                  + 'kongressissa, ja lontoolainen Athenaeum-lehti vertasi '
                  + 'häntä antiikin Kreikan runonlaulajiin.',
        selite: 'Ostap Veresai vaimonsa kanssa vuonna 1873. Bandura on '
                  + 'polvella ja kävelykeppi nojaa seinään — kobzarit kulkivat '
                  + 'kylästä kylään oppaan kanssa.',
        lahde: 'Wikimedia Commons (PD)',
        wiki: 'Bandura',
        musiikki: 'https://music.apple.com/fi/search?term=bandura%20kobzar',
        musiikkiNimi: 'Bandura-musiikkia Apple Musicissa',
        musiikkiNayte: 'https://archive.org/download/jamendo-369605/01-1720225-Nataliya%20Bermas-Ukrainian%20Melody%20Ivanko.mp3',
        musiikkiNayteNimi: 'Ukrainalainen sävelmä "Ivanko" — Nataliya Bermas, CC BY-NC',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Borssi sai kiireellisen suojelun',
        tiedosto: 'Ukrainian borscht.jpg',
        teksti: 'Borssi on punajuuresta keitetty hapan keitto, jonka päälle '
                  + 'tulee lusikallinen smetanaa ja viereen valkosipulisämpylä. '
                  + 'Unesco otti ukrainalaisen borssinkeiton kulttuurin '
                  + 'kiireellistä suojelua vaativien luetteloon heinäkuussa '
                  + '2022. Samalla se muistutti, että borssia keitetään monessa '
                  + 'maassa eikä merkintä tee siitä kenenkään yksinomaista '
                  + 'omaisuutta.',
        selite: 'Ukrainalainen borssi lautasella. Punajuuri antaa värin, '
                  + 'smetana kelluu keskellä ja päälle on ripoteltu tilliä ja '
                  + 'persiljaa.',
        lahde: 'Nillerdk, Wikimedia Commons (CC BY 3.0)',
        wiki: 'Borssi',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Sata metriä alas ja takaisin',
        tiedosto: 'Escalators at the deepest metro station of the world Arsenalna (105.5m) (8601894844).jpg',
        teksti: 'Kiovan Arsenalnan metroasema on 105,5 metriä maanpinnan '
                  + 'alapuolella. Se oli maailman syvin asema vuoteen 2022 '
                  + 'asti, jolloin Kiinan Chongqingiin avattiin 116 metrin '
                  + 'syvyyteen ulottuva Hongyancunin asema. Liukuportaita on '
                  + 'kaksi peräkkäin, 55,8 ja 46,6 metriä, ja niiden välissä on '
                  + 'oma väliaula. Syvyys johtuu Dneprin jyrkästä '
                  + 'rantatörmästä, jonka sisään asema on kaivettu.',
        selite: 'Arsenalnan liukuportaat ylhäältä kuvattuna. Matka pinnalta '
                  + 'laiturille kestää useita minuutteja, ja tunnelin pää '
                  + 'katoaa näkyvistä.',
        lahde: 'Jorge Láscar, Wikimedia Commons (CC BY 2.0)',
        wiki: 'Kiovan metro',
      },
    ],
    kysymys: {
      q: 'Miksi Kiovan Arsenalnan metroasema kaivettiin yli sadan metrin '
           + 'syvyyteen?',
      options: [
        'Dneprin ranta kohoaa jyrkkänä muun kaupungin yläpuolelle',
        'Maan alta löytyi kultaa, joka piti louhia ensin',
        'Asema rakennettiin valmiiseen luolastoon',
        'Syvyys pitää junat kesällä viileinä',
      ],
      correct: 0,
      fact: 'Kiova on Dneprin korkealla länsirannalla, ja asema on törmän '
              + 'sisällä. Se oli maailman syvin metroasema vuoteen 2022 saakka.',
    },
  },

  odessa: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Odessan ääni',
        tiedosto: 'Leonid Utesov 1934.jpg',
        teksti: 'Leonid Utjosov syntyi Odessassa 1895 nimellä Lazar '
                  + 'Vaisbein, aloitti uransa sirkusakrobaattina ja perusti '
                  + '1920-luvulla yhden Neuvostoliiton ensimmäisistä '
                  + 'jazzorkestereista. Hänen ohjelmistossaan olivat '
                  + 'satamakortteleiden laulut ja odessalainen sanailu. Vuonna '
                  + '1965 hänestä tuli ensimmäinen kevyen musiikin laulaja, '
                  + 'joka sai Neuvostoliiton kansantaiteilijan arvon.',
        selite: 'Leonid Utjosov vuonna 1934, jolloin hänen '
                  + 'Thea-Jazz-orkesterinsa oli maan tunnetuin. Laulun ja '
                  + 'vitsin väliä hän ei erotellut lainkaan.',
        lahde: 'Wikimedia Commons (PD)',
        wiki: 'Jazz',
        musiikki: 'https://music.apple.com/fi/search?term=leonid%20utesov',
        musiikkiNimi: 'Leonid Utjosov Apple Musicissa',
        musiikkiNayte: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Der_Terk_in_America.mp3',
        musiikkiNayteNimi: 'Klezmeria: Der Terk in America — PD',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Privozilla hinta on keskustelu',
        tiedosto: 'At the Privoz Market in Odessa.jpg',
        teksti: 'Privoz alkoi vuonna 1827 hevoskärryjen takalaidoilta ja on '
                  + 'yhä Odessan suurin ruokatori. Kauppa käydään ääneen: myyjä '
                  + 'sanoo hinnan, ostaja nauraa, ja lopullinen summa on jotain '
                  + 'siltä väliltä. Tiskeillä on suolattua silliä, mustanmeren '
                  + 'kalaa ja forshmakia — sillitahnaa, joka tuli kaupungin '
                  + 'juutalaisesta keittiöstä.',
        selite: 'Privozin valmisruokatiski: säilöttyjä punajuuria, '
                  + 'merilevää, sieniä ja täytettyjä paprikoita rasioissa, '
                  + 'kauhat valmiina rivissä.',
        lahde: 'jmv, Wikimedia Commons (CC BY 2.0)',
        wiki: 'Odessa',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Kaupunki seisoo oman louhoksensa päällä',
        tiedosto: 'Odessa Catacombs 01.jpg',
        teksti: 'Odessan talot on rakennettu simpukkakalkkikivestä, jota '
                  + 'louhittiin suoraan kaupungin alta. Käytäviä kertyi '
                  + 'arviolta 2 500 kilometriä — enemmän kuin minkään muun '
                  + 'kaupungin alle maailmassa — ja syvimmillään ne ulottuvat '
                  + '60 metriä merenpinnan alapuolelle. Louhoksia on käytävistä '
                  + '95 prosenttia, eikä koko verkostoa ole koskaan '
                  + 'kartoitettu.',
        selite: 'Katakombien käytävä. Seinissä näkyvät sahanjäljet: '
                  + 'kalkkikivi leikattiin suorakulmaisiksi lohkoiksi ja '
                  + 'nostettiin ylös talojen seiniksi.',
        lahde: 'Vi Ko, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Katakombi',
      },
    ],
    kysymys: {
      q: 'Miten Odessan alle syntyi noin 2 500 kilometriä käytäviä?',
      options: [
        'Kaupungin rakennuskivi louhittiin sen omasta alustasta',
        'Ne kaivettiin sodan aikana pommisuojiksi',
        'Ne ovat luonnon muovaamia tippukiviluolia',
        'Niissä kulki aikoinaan maanalainen rautatie',
      ],
      correct: 0,
      fact: 'Odessan talot tehtiin simpukkakalkkikivestä, jota otettiin '
              + 'suoraan jalkojen alta. Vasta myöhemmin käytäviä käytettiin '
              + 'varastoina ja suojina.',
    },
  },

  moskova: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Bolshoi tarkoittaa suurta',
        tiedosto: 'Bolshoi ballet troupe.jpeg',
        teksti: 'Bolshoi-teatterin juuret ulottuvat vuoteen 1776, ja sen '
                  + 'balettiryhmässä tanssii yli 200 tanssijaa — enemmän kuin '
                  + 'missään muussa maailman balettiryhmässä. Nykyinen talo '
                  + 'avattiin uudelleen lokakuussa 2011 kuusi vuotta kestäneen '
                  + 'korjauksen jälkeen, jossa palautettiin salin alkuperäinen '
                  + 'akustiikka. Teatterin julkisivu on painettu Venäjän sadan '
                  + 'ruplan seteliin.',
        selite: 'Bolshoin koko seurue lavalla. Taustakankaaseen on maalattu '
                  + 'teatterin oma julkisivu pylväineen, ja edessä seisovat '
                  + 'balettitanssijat mustissa tutuissa.',
        lahde: 'Kremlin.ru, Wikimedia Commons (CC BY 4.0)',
        wiki: 'Bolshoi-teatteri',
        musiikki: 'https://music.apple.com/fi/search?term=bolshoi%20ballet',
        musiikkiNimi: 'Bolshoi-baletin musiikkia Apple Musicissa',
        musiikkiNayte: 'https://archive.org/download/TchaikovskyTheNutcrackerSuite/Tchaikovsky_nutcrackerSuitePartTwo.mp3',
        musiikkiNayteNimi: 'Tšaikovski: Pähkinänsärkijä — CC BY',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Laskiaisviikolla syödään aurinkoja',
        tiedosto: 'Tea party with pancakes and a samovar.jpg',
        teksti: 'Maslenitsa on viikon mittainen juhla ennen ortodoksisen '
                  + 'kirkon suurta paastoa, ja sen ruoka on blini: ohut lettu, '
                  + 'joka esittää aurinkoa. Täytteenä on smetanaa, hilloa, '
                  + 'suolakalaa tai kaviaaria, ja teevesi keitetään '
                  + 'samovaarissa. Viikko päättyy sunnuntaihin, jolloin on '
                  + 'tapana pyytää anteeksi kaikilta, joita on vuoden mittaan '
                  + 'loukannut.',
        selite: 'Laskiaispöytä lumihangessa. Samovaari höyryää keskellä, '
                  + 'koreissa on blinejä ja piirakoita, ja seurue seisoo ulkona '
                  + 'takit päällä.',
        lahde: 'Avsolov, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Maslenitsa',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Maanalainen palatsi',
        tiedosto: 'Vertical panorama of the Mayakovskaya Metro Station.jpg',
        teksti: 'Majakovskajan metroasema avattiin syyskuussa 1938 ja on 33 '
                  + 'metriä syvällä. Katon soikeissa kuopissa on 34 mosaiikkia, '
                  + 'joiden sarjan nimi on "Vuorokausi neuvostotaivaalla", ja '
                  + 'pylväät on päällystetty ruostumattomalla teräksellä ja '
                  + 'vaaleanpunaisella rodoniitilla. Aseman suunnittelija '
                  + 'Aleksei Dushkin sai New Yorkin maailmannäyttelyn '
                  + 'pääpalkinnon 1939.',
        selite: 'Majakovskajan laituri alhaalta kuvattuna. Kattoon on '
                  + 'upotettu soikeita kuoppia, joiden pohjassa on mosaiikki ja '
                  + 'reunalla rengas lamppuja.',
        lahde: 'Andrey Kryuchenko, Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Moskovan metro',
      },
    ],
    kysymys: {
      q: 'Mitä Majakovskajan metroaseman katon 34 mosaiikkia esittävät?',
      options: [
        'Vuorokautta neuvostotaivaalla',
        'Moskovan historian käännekohtia',
        'Venäjän suurimpia jokia',
        'Kuuluisia balettikohtauksia',
      ],
      correct: 0,
      fact: 'Aleksandr Deinekan mosaiikeissa lentää lentokoneita, '
              + 'laskuvarjoja, lintuja ja purjelentokoneita. Ylös katsova näkee '
              + 'taivaan, vaikka on 33 metriä maan alla.',
    },
  },

  pietari: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Sinfonia piiritetyssä kaupungissa',
        tiedosto: 'Fireman shostakovich.jpg',
        teksti: 'Dmitri Šostakovitš aloitti seitsemännen sinfoniansa '
                  + 'Leningradissa 1941, kun kaupunki oli saarrettu. Teos '
                  + 'esitettiin siellä 9. elokuuta 1942. Kaupungin '
                  + 'radio-orkesterista oli jäljellä vain 15 soittajaa, joten '
                  + 'muita haettiin rintamalta. Esitys kuului kaiuttimista '
                  + 'kaduilla ja kaupungin ulkopuolelle asti. Sinfonia kestää '
                  + 'noin 80 minuuttia.',
        selite: 'Šostakovitš palokunnan varusteissa. Hän oli sodan alussa '
                  + 'Leningradin konservatorion palovartiossa, ja kuva kiersi '
                  + 'maailman lehdissä 1942.',
        lahde: 'Wikimedia Commons (PD)',
        wiki: 'Dmitri Šostakovitš',
        musiikki: 'https://music.apple.com/fi/search?term=shostakovich%20symphony%207',
        musiikkiNimi: 'Šostakovitšin 7. sinfonia Apple Musicissa',
        musiikkiNayte: 'https://archive.org/download/ShostakovichSymphonyNo.5-Stokowski/02.Ii.Allegretto.mp3',
        musiikkiNayteNimi: 'Šostakovitš: 5. sinfonia — Leopold Stokowski, CC BY-NC-SA',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Kevät tuoksuu kurkulta',
        tiedosto: 'Homemaid fried smelt Saint Petersburg Russia.jpg',
        teksti: 'Kuore nousee keväällä Nevaan kutemaan, ja tuoreena se '
                  + 'tuoksuu tuoreelta kurkulta — sen tunnistaa torilla nenällä '
                  + 'ennen kuin näkee. Kala pyöritetään jauhoissa ja paistetaan '
                  + 'kokonaisena. Pietarissa kevään katsotaan alkavan siitä, '
                  + 'kun kuore ilmestyy myyntiin, ja kaupungissa on 2000-luvun '
                  + 'alusta järjestetty sille oma juhla.',
        selite: 'Paistettuja kuoreita lautasella Pietarissa. Kalat ovat '
                  + 'kämmenen mittaisia ja ne syödään kokonaisina, päät ja '
                  + 'pyrstöt mukaan lukien.',
        lahde: 'Markovka, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Kuore',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Museon virkakissat',
        tiedosto: 'Hermitage cat1.JPG',
        teksti: 'Talvipalatsin kellareissa asuu kissoja, joiden työ on '
                  + 'pitää hiiret poissa taidekokoelmien kimpusta. Keisarinna '
                  + 'Elisabet määräsi vuonna 1745 tuomaan palatsiin kissoja '
                  + 'Kazanista, jonka hiirenpyytäjiä pidettiin maan parhaina. '
                  + 'Nykyään kissoja on noin 60, niillä on kolme hoitajaa, ja '
                  + 'museossa on lehdistösihteeri pelkästään kissoja varten.',
        selite: 'Eremitaašin kissa istumassa museon graniittiportaalla. '
                  + 'Kissat asuvat kellarikerroksessa mutta käyvät kesäisin '
                  + 'ulkona rantakadulla.',
        lahde: 'Petrov Victor, Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Eremitaaši',
      },
    ],
    kysymys: {
      q: 'Miksi Eremitaašin kellareissa asuu kissoja?',
      options: [
        'Ne pitävät hiiret poissa taidekokoelmien kimpusta',
        'Ne ovat museon maskotteja matkailijoita varten',
        'Ne kuuluvat museon taidekokoelmaan',
        'Ne johdattavat vieraat salista toiseen',
      ],
      correct: 0,
      fact: 'Keisarinna Elisabet määräsi 1745 tuomaan Kazanista parhaat '
              + 'hiirenpyytäjät Talvipalatsiin. Työ jatkuu yhä, ja kissoja on '
              + 'noin 60.',
    },
  },

  tallinna: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Laulukaari täyttyy viiden vuoden välein',
        tiedosto: 'Üldlaulupidu 2014 - 26.JPG',
        teksti: 'Viron laulujuhlia on pidetty vuodesta 1869, ja laulukaaren '
                  + 'lavalle mahtuu noin 15 000 laulajaa ja kentälle jopa 100 '
                  + '000 kuulijaa. Syyskuussa 1988 samalle kentälle kokoontui '
                  + 'arviolta 300 000 ihmistä laulamaan lauluja, joita ei '
                  + 'silloin saanut laulaa julkisesti. Siitä tuli nimi laulava '
                  + 'vallankumous.',
        selite: 'XXVI laulujuhlat kesällä 2014. Yhteiskuoro seisoo '
                  + 'laulukaaren alla ja yleisö kentällä. Kaari valmistui 1960, '
                  + 'ja sen kaareva katto heijastaa äänen alas väkijoukkoon.',
        lahde: 'Ivo Kruusamägi, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Tallinnan laulujuhlat',
        musiikki: 'https://music.apple.com/fi/search?term=estonian%20choir',
        musiikkiNimi: 'Virolaista kuorolaulua Apple Musicissa',
        musiikkiNayte: 'https://archive.org/download/aporee_19813_23018/20130704Estland07Tartu07MannerchorimParkgegenuberLossi3Donnerstag1707Uhr.mp3',
        musiikkiNayteNimi: 'Virolainen mieskuoro Tartossa — Fritz Schlüter, CC BY',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Kamaa ei keitetä ollenkaan',
        tiedosto: 'Kama.jpg',
        teksti: 'Kamajauho on sekoitus paahdettua ohraa, ruista, kauraa ja '
                  + 'hernettä. Sitä ei kypsennetä lainkaan: jauho vatkataan '
                  + 'piimään, päälle pannaan marjoja, ja aamiainen on valmis '
                  + 'minuutissa. Paahdettu jauho säilyi ennen kuukausia '
                  + 'pilaantumatta, joten se oli pellolle ja merimatkalle '
                  + 'sopiva eväs.',
        selite: 'Kamajauhoa piimäkulhossa ja takana puolen kilon kamapussi. '
                  + 'Jauhe on hienoa ja hiekanväristä, ja se sekoitetaan '
                  + 'lusikalla, kunnes seos on tasaista.',
        lahde: 'Mmh, Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Kama',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Valtio mahtuu muovikorttiin',
        tiedosto: 'E-Residency card.jpg',
        teksti: 'Viro oli vuonna 2005 maailman ensimmäinen maa, jossa sai '
                  + 'äänestää vaaleissa internetissä. Äänestäjä tunnistautuu '
                  + 'sirullisella henkilökortilla. Vuoden 2023 '
                  + 'parlamenttivaaleissa yli puolet äänistä annettiin '
                  + 'verkossa, ja samalla kortilla haetaan resepti, '
                  + 'allekirjoitetaan sopimus ja perustetaan yritys.',
        selite: 'Viron e-residentin henkilökortti. Sirulle tallennettu '
                  + 'varmenne käy allekirjoituksesta, ja ulkomaalainenkin voi '
                  + 'hakea kortin ja perustaa sillä virolaisen yrityksen.',
        lahde: 'Masayuki (Yuki) Kawagishi, Wikimedia Commons (CC BY 2.0)',
        wiki: 'Sähköinen äänestys',
      },
    ],
    kysymys: {
      q: 'Mikä maa antoi ensimmäisenä äänestää vaaleissa internetissä?',
      options: [
        'Viro',
        'Suomi',
        'Yhdysvallat',
        'Etelä-Korea',
      ],
      correct: 0,
      fact: 'Viro äänesti verkossa ensin kunnallisvaaleissa 2005 ja '
              + 'parlamenttivaaleissa 2007. Tunnistautuminen tapahtuu '
              + 'henkilökortin sirulla.',
    },
  },

  riika: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Kaapissa on 268 815 lappua',
        tiedosto: 'Dainu skapja oriģināls LNB.jpg',
        teksti: 'Daina on nelisäkeinen latvialainen kansanlaulu. Krišjānis '
                  + 'Barons keräsi niitä ja järjesti ne itse piirtämäänsä '
                  + 'kaappiin: 160 senttiä korkea, 70 laatikkoa, jokaisessa 20 '
                  + 'lokeroa. Lappuja on 268 815, kukin 3 × 11 senttiä. Unesco '
                  + 'liitti kaapin maailman muisti -rekisteriin 2001.',
        selite: 'Dainakaapin alkuperäiskappale Latvian '
                  + 'kansalliskirjastossa. Laatikot on vedetty auki, ja '
                  + 'lokeroissa näkyvät pystyyn ladotut paperilaput, joihin '
                  + 'laulut on kirjoitettu käsin.',
        lahde: 'Savannah Rivka, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Daina',
        musiikki: 'https://music.apple.com/fi/search?term=latvian%20folk%20songs',
        musiikkiNimi: 'Latvialaisia kansanlauluja Apple Musicissa',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Ruispohja, porkkanaa ja kuminaa',
        tiedosto: 'Sklandrausis (10890919013).jpg',
        teksti: 'Sklandrausis on kämmenen kokoinen avoin piirakka, jonka '
                  + 'pohja on ruistaikinaa ja täyte perunaa ja porkkanaa '
                  + 'kuminan kanssa. Se on kotoisin Kuurinmaalta Latvian '
                  + 'länsiosasta, jossa asui liiviläisiä, ja sitä leivottiin '
                  + 'ennen juhlapyhiksi. EU myönsi sille aidon perinteisen '
                  + 'tuotteen merkin vuonna 2013.',
        selite: 'Sklandrauši-piirakoita rivissä. Reunat nostetaan sormin '
                  + 'pystyyn ja täyte jää näkyviin: alla vaalea perunakerros, '
                  + 'päällä oranssi porkkanakerros.',
        lahde: 'Liga Eglite, Wikimedia Commons (CC BY 2.0)',
        wiki: 'Kuurinmaa',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Torikatot olivat ilmalaivojen halleja',
        tiedosto: 'German zeppelin hangars, now Riga Central Market (23074882114).jpg',
        teksti: 'Riian keskustorin viisi hallia rakennettiin 1924–1930 '
                  + 'saksalaisten zeppelin-ilmalaivojen hallien teräsrungoista. '
                  + 'Rungot tuotiin Vaiņodesta ja pystytettiin joen rantaan. '
                  + 'Toria on 72 300 neliömetriä ja myyntipisteitä yli 3 000 — '
                  + 'se on yhä Euroopan suurimpia.',
        selite: 'Lihahallin sisäkatto Riian keskustorilla. Teräsristikko '
                  + 'kaartuu toistakymmentä metriä pään yläpuolelle. Se tehtiin '
                  + 'alun perin kannattamaan ilmalaivan seinämiä, ei '
                  + 'kalatiskejä.',
        lahde: 'Jorge Láscar, Wikimedia Commons (CC BY 2.0)',
        wiki: 'Riian keskustori',
      },
    ],
    kysymys: {
      q: 'Mistä Riian keskustorin hallit on tehty?',
      options: [
        'Ilmalaivojen halleista',
        'Vanhoista kirkoista',
        'Laivojen rungoista',
        'Rautatiesillan osista',
      ],
      correct: 0,
      fact: 'Saksan armeija jätti Latviaan zeppelin-hallit ensimmäisen '
              + 'maailmansodan jälkeen. Teräsrungot purettiin, kuljetettiin '
              + 'Riikaan ja pystytettiin uudelleen kauppahalleiksi.',
    },
  },

  vilna: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Sutartinė soi tahallaan riitasointuisena',
        tiedosto: 'Sutartinės.jpg',
        teksti: 'Sutartinė on liettualainen moniääninen laulu, jota esittää '
                  + 'kaksi, kolme tai neljä naista. Äänet kulkevat sekunnin '
                  + 'päässä toisistaan — siis niin lähellä, että sointi hankaa '
                  + 'korvaa tahallaan. Laji on kotoisin Aukštaitijasta, ja '
                  + 'Unesco otti sen ihmiskunnan perintöluetteloon vuonna 2010.',
        selite: 'Kaksi laulajaa esittää sutartinėtä. Laulajat seisovat '
                  + 'vastakkain ja liikkuvat askel kerrallaan: laululla on '
                  + 'usein oma yksinkertainen koreografiansa.',
        lahde: 'Bcecilija, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Liettua',
        musiikki: 'https://music.apple.com/fi/search?term=sutartines',
        musiikkiNimi: 'Sutartinės-lauluja Apple Musicissa',
        musiikkiNayte: 'https://archive.org/download/EDIS-SRP-0197-03/EDIS-SRP-0197-03.mp3',
        musiikkiNayteNimi: 'Liettualainen kansanlaulu kanteleilla — CC0',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Kirkkaanpinkki keitto ja kuumat perunat',
        tiedosto: 'Lithuanian cold beetroot soup, 11 April 2018.png',
        teksti: 'Šaltibarščiai on kylmä keitto, jossa on punajuurta, '
                  + 'kefiiriä, kurkkua, tilliä ja keitetty muna. Kefiiri värjää '
                  + 'sen kirkkaanpinkiksi. Keitto tarjotaan jääkylmänä, mutta '
                  + 'vieressä on aina lautasellinen höyryäviä keitettyjä '
                  + 'perunoita — niitä syödään vuorotellen keiton kanssa.',
        selite: 'Šaltibarščiai-annos: pinkki keitto kulhossa, päällä '
                  + 'munanpuolikas ja tilliä, vieressä keitettyjä perunoita '
                  + 'omalla lautasellaan.',
        lahde: 'Ke an, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Borssi',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Tasavalta, jonka perustuslaissa on 41 pykälää',
        tiedosto: 'Uzupis Constitution - panoramio.jpg',
        teksti: 'Užupis on Vilnian kaupunginosa joen toisella puolen. '
                  + 'Taiteilijat julistivat sen omaksi tasavallakseen '
                  + 'aprillipäivänä, ja sillä on presidentti, lippu ja '
                  + 'perustuslaki, jossa on 41 pykälää. Ne on kiinnitetty kadun '
                  + 'seinään kiiltäville metallilaatoille, yksi laatta kutakin '
                  + 'kieltä kohti.',
        selite: 'Užupisin perustuslakilaatta englanniksi Paupion kadulla. '
                  + 'Pykälä 12 kuuluu: "Koiralla on oikeus olla koira." Pykälä '
                  + '16: "Jokaisella on oikeus olla onnellinen."',
        lahde: 'AwOiSoAk KaOsIoWa, Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Užupis',
      },
    ],
    kysymys: {
      q: 'Mitä Užupisin perustuslaki lupaa koiralle?',
      options: [
        'Oikeuden olla koira',
        'Oman äänestyslipun',
        'Ilmaisen ruoan torilta',
        'Paikan tasavallan hallituksessa',
      ],
      correct: 0,
      fact: 'Perustuslain pykälä 12 kuuluu: "Koiralla on oikeus olla '
              + 'koira." Pykäliä on kaikkiaan 41, ja ne on käännetty useille '
              + 'kymmenille kielille.',
    },
  },

  istanbul: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Maailman vanhin sotilassoittokunta',
        tiedosto: 'Istanbul Military Museum Mehter show in 2016 25 9327.jpg',
        teksti: 'Mehter on ottomaanien sotilassoittokunta ja vanhin '
                  + 'tunnettu marssiva soittokunta maailmassa. Sen jyminä '
                  + 'kuului Euroopan puolelle asti: Haydn, Mozart ja Beethoven '
                  + 'kirjoittivat kaikki musiikkia, joka matkii mehterin '
                  + 'rumpuja ja lautasia. Soittokunta lakkautettiin 1826 ja '
                  + 'herätettiin henkiin 1911.',
        selite: 'Mehter-soittokunta esiintyy Istanbulin sotilasmuseossa '
                  + 'Harbiyessä. Rummut ovat kaksipuolisia davul-rumpuja, ja '
                  + 'soittajat astelevat hitaasti kääntyen vuoroin oikealle ja '
                  + 'vasemmalle.',
        lahde: 'Dosseman, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Mehter',
        musiikki: 'https://music.apple.com/fi/search?term=mehter',
        musiikkiNimi: 'Mehter-marsseja Apple Musicissa',
        musiikkiNayte: 'https://archive.org/download/ceddin-deden/06-Ceddin%20Deden%20%5B1080p%5D.mp3',
        musiikkiNayteNimi: 'Mehter-marssi "Ceddin Deden" — CC0',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Teetä juodaan enemmän kuin missään',
        tiedosto: 'Tarihi cinaralti cay bahcesi.jpg',
        teksti: 'Turkissa juodaan teetä yli kolme kiloa henkeä kohti '
                  + 'vuodessa — enemmän kuin missään muussa maassa. Tee '
                  + 'kasvatetaan Mustanmeren rannalla Rizen ympärillä. Se '
                  + 'tarjoillaan tulppaanin muotoisessa lasissa ilman kahvaa: '
                  + 'lasista pidetään kiinni reunasta, jottei sormia polta.',
        selite: 'Teepuutarha Çengelköyssä Istanbulin Aasian puolella. '
                  + 'Pöydät on aseteltu vanhan plataanin alle, ja jokaisella '
                  + 'pöydällä on oma pieni teepannu.',
        lahde: 'M. Fatih Morgül, Wikimedia Commons (CC BY 4.0)',
        wiki: 'Tee',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Kadun kissat ovat kaikkien kissoja',
        tiedosto: 'Hagia Sophia Cat Gli.png',
        teksti: 'Istanbulin katukissoja on arvioitu olevan '
                  + 'sadastatuhannesta yli miljoonaan. Niitä ei pidetä '
                  + 'irtolaisina vaan korttelin yhteisinä lemmikkeinä: '
                  + 'kauppiaat jättävät ovensa eteen vesikupin ja ruokaa. '
                  + 'Kuuluisin niistä oli Gli, joka asui Hagia Sofiassa '
                  + 'vuodesta 2004 kuolemaansa 2020 asti.',
        selite: 'Gli Hagia Sofian marmorilattialla ruokakuppinsa vieressä. '
                  + 'Kissa syntyi kirkossa, joka oli silloin museo, ja se tuli '
                  + 'tunnetuksi tuhansien matkailijoiden valokuvista.',
        lahde: 'Kadı, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Hagia Sofia',
      },
    ],
    kysymys: {
      q: 'Minkä juoman kulutus henkeä kohti on Turkissa maailman suurin?',
      options: [
        'Tee',
        'Kahvi',
        'Appelsiinimehu',
        'Kivennäisvesi',
      ],
      correct: 0,
      fact: 'Turkissa juodaan teetä yli kolme kiloa henkeä kohti vuodessa. '
              + 'Tee tuli maahan vasta 1900-luvun alussa, kun kahvi kallistui '
              + 'ja teetä alettiin viljellä Rizessä.',
    },
  },

  helsinki: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Finlandia soitettiin väärällä nimellä',
        tiedosto: 'Jean-Sibelius-at-the-piano.jpg',
        teksti: 'Jean Sibelius sävelsi Finlandian vuonna 1899, kun Venäjän '
                  + 'hallinto kiristi otettaan Suomen itsehallinnosta. Kappale '
                  + 'kiihotti kuulijoita niin, että sitä esitettiin varmuuden '
                  + 'vuoksi vaihtuvilla nimillä — yksi niistä oli pelkkä '
                  + '"Impromptu". Sibelius sävelsi kaikkiaan seitsemän '
                  + 'sinfoniaa, mutta Finlandia on hänen tunnetuin teoksensa, '
                  + 'ja se kestää vain noin kahdeksan minuuttia.',
        selite: 'Jean Sibelius soittamassa flyygeliä kotonaan Ainolassa '
                  + 'Järvenpäässä. Talo valmistui 1904, ja säveltäjä asui '
                  + 'siellä yli viisikymmentä vuotta kuolemaansa 1957 asti.',
        lahde: 'Wikimedia Commons (PD)',
        wiki: 'Jean Sibelius',
        musiikki: 'https://music.apple.com/fi/search?term=sibelius%20finlandia',
        musiikkiNimi: 'Sibeliuksen Finlandia Apple Musicissa',
        musiikkiNayte: 'https://archive.org/download/SIBELIUSFinlandia-NEWTRANSFER/Sibelius-FinlandiaOp.26.mp3',
        musiikkiNayteNimi: 'Sibelius: Finlandia — Artur Rodzinski, CC BY-NC-SA',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Silakkamarkkinat vuodesta 1743',
        tiedosto: 'Kauppatori, syys- eli silakkamarkkinat - G30676 - hkm.HKMS000005-km0000pheu.jpg',
        teksti: 'Joka lokakuu Kauppatorille purjehtii kalastajia myymään '
                  + 'suolattua ja maustettua silakkaa suoraan veneen kannelta. '
                  + 'Markkinat on pidetty vuodesta 1743, ja ne ovat Helsingin '
                  + 'vanhin yhtäjaksoisesti järjestetty tapahtuma. Mukana '
                  + 'myydään myös tummaa saaristolaisleipää, ja viikon '
                  + 'päätteeksi valitaan vuoden paras silakkatuote.',
        selite: 'Syys- eli silakkamarkkinat Kauppatorilla 1890-luvulla. '
                  + 'Silakan lisäksi kojuissa myytiin villasukkia ja '
                  + 'kangaspakkoja — markkinat olivat saariston ja kaupungin '
                  + 'vuosittainen kohtaaminen.',
        lahde: 'Unknown author, Wikimedia Commons (CC BY 4.0)',
        wiki: 'Silakkamarkkinat',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Kolme miljoonaa saunaa',
        tiedosto: 'Kotiharjun yleinen sauna (Kotiharju public sauna in Helsinki) Helsingin Torkkelinmäellä Kalliossa 01.jpg',
        teksti: 'Suomessa on noin kolme miljoonaa saunaa ja 5,6 miljoonaa '
                  + 'asukasta — sauna kuuluu kerrostaloasuntoonkin. Unesco '
                  + 'lisäsi suomalaisen saunomisen ihmiskunnan aineettoman '
                  + 'kulttuuriperinnön luetteloon vuonna 2020. Yleisessä '
                  + 'saunassa vieraat istuvat vieretysten tuntemattomien '
                  + 'kanssa, ja löylyn jälkeen mennään kadulle jäähtymään pyyhe '
                  + 'päällä.',
        selite: 'Kotiharjun sauna Torkkelinmäellä Kalliossa. Se avattiin '
                  + '1928 ja on Helsingin viimeinen alkuperäisessä käytössä '
                  + 'säilynyt puulämmitteinen yleinen sauna.',
        lahde: 'Paasikivi, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Kotiharjun sauna',
      },
    ],
    kysymys: {
      q: 'Miksi Sibeliuksen Finlandiaa esitettiin aikoinaan muilla nimillä, '
           + 'kuten "Impromptu"?',
      options: [
        'Venäjän hallinto piti kappaletta liian isänmaallisena',
        'Sibelius ei pitänyt nimestä Finlandia',
        'Nimi oli jo varattu toiselle teokselle',
        'Nuotit olivat kadonneet ensiesityksessä',
      ],
      correct: 0,
      fact: 'Finlandia syntyi 1899, kun Venäjän hallinto rajoitti Suomen '
              + 'itsehallintoa. Kappale innosti kuulijoita niin voimakkaasti, '
              + 'että konserttiohjelmiin painettiin varmuuden vuoksi jokin '
              + 'toinen nimi.',
    },
  },

  tukholma: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'ABBA voitti Brightonissa 1974',
        tiedosto: 'ABBA - TopPop 1974 5.png',
        teksti: 'Neljä ruotsalaista voitti euroviisut 6. huhtikuuta 1974 '
                  + 'kappaleella Waterloo. Nimi ABBA muodostuu jäsenten '
                  + 'etunimien alkukirjaimista: Agnetha, Björn, Benny ja '
                  + 'Anni-Frid. Voitto käänsi Ruotsin musiikkiviennin kasvuun, '
                  + 'ja maasta tuli yksi maailman suurimmista popmusiikin '
                  + 'viejistä — Tukholmassa toimii yhä poikkeuksellisen paljon '
                  + 'studioita ja lauluntekijöitä.',
        selite: 'ABBA hollantilaisessa TopPop-ohjelmassa keväällä 1974. '
                  + 'Björn Ulvaeus on kertonut, että asut tehtiin tahallaan '
                  + 'mahdottomiksi: esiintymisvaatteet sai vähentää '
                  + 'verotuksessa vain, jos niitä ei voinut käyttää arkena.',
        lahde: 'AVRO, Wikimedia Commons (CC BY-SA 3.0 NL)',
        wiki: 'Abba',
        musiikki: 'https://music.apple.com/fi/search?term=ABBA%20Waterloo',
        musiikkiNimi: 'ABBA Apple Musicissa',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Fika on sovittu hetki',
        tiedosto: 'Fika kaffe bulle.jpg',
        teksti: 'Fika tarkoittaa taukoa, jolla juodaan kahvia ja syödään '
                  + 'jotain makeaa — mieluiten kanelipulla. Se ei ole pelkkä '
                  + 'kahvikuppi vaan sovittu tapa istua alas yhdessä, ja '
                  + 'monella työpaikalla se on kellonaika siinä missä '
                  + 'lounaskin. Kanelipullalla on Ruotsissa oma päivänsä 4. '
                  + 'lokakuuta; leipomisneuvosto keksi sen vuonna 1999.',
        selite: 'Kahvikuppi ja kanelipulla ruotsalaiseen tapaan. Sana fika '
                  + 'syntyi puhekielessä kääntämällä sanan kaffe tavut toisin '
                  + 'päin — samaa temppua käytettiin 1800-luvun lopulla moneen '
                  + 'muuhunkin sanaan.',
        lahde: 'Johannes Jansson/norden.org, Wikimedia Commons (CC BY 2.5 DK)',
        wiki: 'Korvapuusti',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Maailman pisin taidenäyttely',
        tiedosto: 'Tunnelbana T-Centralen Blue Line (43481298780).jpg',
        teksti: 'Tukholman metrossa on sata asemaa, ja niistä yli 90:llä on '
                  + 'taidetta: maalauksia, veistoksia, mosaiikkeja ja reliefejä '
                  + 'yli 150 taiteilijalta. Sinisen linjan asemat louhittiin '
                  + 'syvälle kallioon, eikä louhittua pintaa peitetty laatoilla '
                  + '— se maalattiin sellaisenaan. Rataa on noin 105 '
                  + 'kilometriä, ja tavallinen matkalippu kelpaa koko '
                  + 'näyttelyyn.',
        selite: 'T-Centralenin sinisen linjan laituri. Per Olof Ultvedt '
                  + 'maalasi 1975 karkeaan kallioseinään siniset köynnökset ja '
                  + 'lehdet — rauhallinen väri valittiin kaupungin '
                  + 'vilkkaimmalle vaihtoasemalle.',
        lahde: 'Sonse, Wikimedia Commons (CC BY 2.0)',
        wiki: 'Tukholman metro',
      },
    ],
    kysymys: {
      q: 'Kuinka monella Tukholman noin sadasta metroasemasta on taidetta?',
      options: [
        'Yli 90:llä',
        'Noin 20:llä',
        'Kolmella',
        'Ei yhdelläkään',
      ],
      correct: 0,
      fact: 'Metroa on kutsuttu maailman pisimmäksi taidenäyttelyksi. '
              + 'Teoksia on tehnyt yli 150 taiteilijaa, ja ensimmäiset '
              + 'tilattiin asemille jo 1950-luvulla.',
    },
  },

  oslo: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Vuorenkuninkaan luolassa',
        tiedosto: 'Anders Beer Wilse - Edvard Grieg - NMK.2006.5769 - National Museum of Art, Architecture and Design.jpg',
        teksti: 'Henrik Ibsenin näytelmä Peer Gynt sai ensi-iltansa '
                  + 'Christianiassa 24. helmikuuta 1876, ja musiikin siihen '
                  + 'sävelsi Edvard Grieg. Kuuluisin kohta on Vuorenkuninkaan '
                  + 'luolassa: sama lyhyt sävelkulku toistuu yhä uudestaan ja '
                  + 'kiihtyy loppua kohti niin, että soittajilla on työ pysyä '
                  + 'mukana. Grieg kirjoitti näytelmään 26 musiikkinumeroa.',
        selite: 'Edvard Grieg (1843–1907) valokuvaaja Anders Beer Wilsen '
                  + 'kuvaamana vuonna 1903. Grieg oli kotoisin Bergenistä, '
                  + 'mutta hänen tunnetuin teoksensa kuultiin ensi kerran '
                  + 'Oslossa.',
        lahde: 'Wikimedia Commons (PD)',
        wiki: 'Peer Gynt',
        musiikki: 'https://music.apple.com/fi/search?term=Grieg%20Peer%20Gynt',
        musiikkiNimi: 'Griegin Peer Gynt Apple Musicissa',
        musiikkiNayte: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Hall_of_the_Mountain_King_%28ISRC_USUAN1200072%29.mp3',
        musiikkiNayteNimi: 'Grieg: Vuorenkuninkaan luolassa — Kevin MacLeod, CC BY',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Ruskea juusto keitetään herasta',
        tiedosto: 'Brunost - Brown cheese.jpg',
        teksti: 'Brunost tehdään herasta, joka jää juustonvalmistuksesta '
                  + 'yli. Sitä keitetään tuntikausia, kunnes maitosokeri '
                  + 'ruskistuu ja massa muuttuu makeaksi. Anne Hov lisäsi '
                  + 'joukkoon kermaa vuonna 1863 Gudbrandsdalenissa, ja siitä '
                  + 'syntyi maan tunnetuin juusto. Leivän päälle se leikataan '
                  + 'juustohöylällä — myös se on norjalainen keksintö, vuodelta '
                  + '1925.',
        selite: 'Palanen brunostia leikattuna. Väri ei tule väriaineesta '
                  + 'vaan kuumennuksesta: maitosokeri karamellisoituu samalla '
                  + 'tavalla kuin sokeri pannulla.',
        lahde: 'color line, Wikimedia Commons (CC BY 2.0)',
        wiki: 'Gudbrandsdalsost',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Puisto, jonka teki yksi mies',
        tiedosto: 'Gustav Vigeland - Monolith. Oslo Frogner Park, 1999.jpeg',
        teksti: 'Frognerin puistossa on yli 200 veistosta, ja ne kaikki '
                  + 'ovat saman taiteilijan käsialaa: Gustav Vigeland '
                  + 'suunnitteli myös puiston sillat, portit ja lyhdyt. '
                  + 'Keskellä kohoaa Monoliitti, 14 metriä korkea pylväs, johon '
                  + 'on veistetty 121 ihmishahmoa. Kolme kivenhakkaajaa työsti '
                  + 'sitä yhdestä graniittilohkareesta neljätoista vuotta. '
                  + 'Puistoon pääsee maksutta mihin aikaan tahansa.',
        selite: 'Monoliitti Frognerin puistossa. Graniittilohkare tuotiin '
                  + 'Halden lähistöltä 1920-luvulla, ja veistotyö kesti '
                  + 'vuodesta 1929 vuoteen 1943. Vigeland teki savimallin, '
                  + 'kivenhakkaajat siirsivät sen kiveen.',
        lahde: 'The original uploader was DIMSFIKAS at Greek Wikipedia, Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Vigelandin puisto',
      },
    ],
    kysymys: {
      q: 'Kuinka moni taiteilija teki Frognerin puiston yli 200 veistosta?',
      options: [
        'Yksi — Gustav Vigeland',
        'Kymmenen norjalaista kuvanveistäjää',
        'Sata eri taiteilijaa',
        'Veistokset ostettiin valmiina eri maista',
      ],
      correct: 0,
      fact: 'Vigeland teki koko puiston: veistokset, sillat, portit ja '
              + 'lyhdyt. Kaupunki antoi hänelle vastineeksi työhuoneen ja '
              + 'asunnon, ja työn tulokset jäivät kaupungin omaisuudeksi.',
    },
  },

  kobenhavn: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Sinfonia, jossa on kaksi patarumpalia',
        tiedosto: 'Carl Nielsen c. 1908.jpg',
        teksti: 'Carl Nielsen soitti kuninkaallisen teatterin orkesterissa '
                  + 'toista viulua kuusitoista vuotta ja sävelsi samaan aikaan '
                  + 'kaksi ensimmäistä sinfoniaansa. Kaikkiaan sinfonioita '
                  + 'syntyi kuusi. Neljännessä, nimeltään Sammumaton, on kaksi '
                  + 'patarumpalia lavan eri laidoilla, ja lopussa ne käyvät '
                  + 'keskenään kaksintaistelun. Nielsen kirjoitti myös satoja '
                  + 'lauluja, joita tanskalaiset laulavat yhdessä koulussa ja '
                  + 'juhlissa.',
        selite: 'Carl Nielsen (1865–1931) noin vuonna 1908. Hän kasvoi '
                  + 'köyhässä perheessä Fynin saarella ja soitti nuorena '
                  + 'sotilassoittokunnassa, ennen kuin pääsi opiskelemaan '
                  + 'Kööpenhaminaan.',
        lahde: 'Wikimedia Commons (PD)',
        wiki: 'Carl Nielsen',
        musiikki: 'https://music.apple.com/fi/search?term=Carl%20Nielsen',
        musiikkiNimi: 'Carl Nielsen Apple Musicissa',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Voileipä syödään haarukalla',
        tiedosto: 'Smørrebrød in Copenhagen 01.jpg',
        teksti: 'Smørrebrød on avoin voileipä tummalla ruisleivällä, ja se '
                  + 'syödään veitsellä ja haarukalla. Järjestyskin on tarkka: '
                  + 'ensin kala, sitten liha, viimeisenä juusto — eikä '
                  + 'päällisiä sekoiteta keskenään. Vanhoissa '
                  + 'lounasravintoloissa listalla voi olla yli kaksikymmentä '
                  + 'eri leipää, ja jokaisella on oma nimensä ja vakiintunut '
                  + 'kuormansa.',
        selite: 'Kaksi smørrebrødiä kööpenhaminalaisella lautasella. '
                  + 'Pohjalla on tumma ruisleipä, jonka päälle levitetään voi — '
                  + 'juuri siitä nimi tulee: smør on voi ja brød leipä.',
        lahde: 'Kritzolina, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Smørrebrød',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Pyöriä enemmän kuin autoja',
        tiedosto: 'Cyclists at red 2.jpg',
        teksti: 'Kööpenhaminassa on noin 385 kilometriä autoliikenteestä '
                  + 'erotettuja pyöräteitä, ja niitä pitkin ajetaan joka '
                  + 'säällä. Kaupungin oman laskennan mukaan noin puolet '
                  + 'kaikista työ- ja koulumatkoista tehdään pyörällä. '
                  + 'Risteyksissä pyörillä on omat liikennevalonsa, ja talvella '
                  + 'pyörätiet aurataan ensimmäisten teiden joukossa.',
        selite: 'Pyöräilijöitä odottamassa vihreää valoa Kööpenhaminassa. '
                  + 'Pyöräkaista on korotettu ajoradan ja jalkakäytävän väliin '
                  + 'omalle tasolleen, joten pyörä ei kulje autojen eikä '
                  + 'kävelijöiden seassa.',
        lahde: 'heb@Wikimedia Commons (mail), Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Pyöräily',
      },
    ],
    kysymys: {
      q: 'Kuinka suuri osa Kööpenhaminan työ- ja koulumatkoista tehdään '
           + 'pyörällä?',
      options: [
        'Noin puolet',
        'Noin neljäsosa',
        'Noin kymmenesosa',
        'Alle 5 prosenttia',
      ],
      correct: 0,
      fact: 'Kaupunki on rakentanut noin 385 kilometriä pyöräteitä ja '
              + 'laskee pyöräilijöiden määrän vuosittain. Osuus on kasvanut '
              + 'vuosikymmeniä, koska pyörätiet on erotettu autoliikenteestä '
              + 'omalle tasolleen.',
    },
  },

  lappi: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Joikua ei lauleta jostakusta',
        tiedosto: 'Wimme Saari.jpg',
        teksti: 'Joiku on saamelaisten vanha laulutapa: ihmiselle, paikalle '
                  + 'tai eläimelle tehdään oma sävelmä. Ihmisestä ei lauleta — '
                  + 'hänet joikataan, ja valmis joiku on kuin toinen nimi. Sitä '
                  + 'ei enää muuteta, ja se voi periytyä suvussa. Kirkko piti '
                  + 'joikaamista syntinä, ja vielä 1950-luvulla se oli '
                  + 'kielletty saamelaisalueen kouluissa.',
        selite: 'Wimme Saari joikaa Etno-Espan lavalla Helsingissä '
                  + 'elokuussa 2006. Yllään hänellä on gákti eli saamenpuku. '
                  + 'Joikaaja tulee toimeen ilman soittimia: sävel muuntuu '
                  + 'kurkunpään lihaksilla.',
        lahde: 'Tomisti, Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Joiku',
        musiikki: 'https://music.apple.com/fi/search?term=joiku',
        musiikkiNimi: 'Joikua Apple Musicissa',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Käristys tehdään jäisestä lihasta',
        tiedosto: 'Poronkäristys.jpg',
        teksti: 'Poronkäristykseen liha höylätään jäätyneenä ohuiksi '
                  + 'lastuiksi, kuullotetaan rasvassa ja haudutetaan pehmeäksi. '
                  + 'Seuraksi tulee perunamuusia ja puolukkaa. Porot '
                  + 'laiduntavat vapaina: poronhoitoalue on 122 936 '
                  + 'neliökilometriä eli 36 prosenttia Suomen maapinta-alasta, '
                  + 'ja suurin sallittu poromäärä on ollut 203 700 eloporoa.',
        selite: 'Poronkäristystä perunamuusin, puolukan ja suolakurkun '
                  + 'kanssa Muonion Jeriksellä. Liha on porosta, joka on ollut '
                  + 'ulkona koko elämänsä — siksi lastut ovat tummia ja lähes '
                  + 'rasvattomia.',
        lahde: 'Wikimedia Commons (PD)',
        wiki: 'Poronkäristys',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Kieli, jota puhutaan vain Suomessa',
        tiedosto: 'Sajos sign OCT2022 IMG 4712a.jpg',
        teksti: 'Inarinsaamea puhutaan ainoastaan Inarijärven ympärillä. '
                  + '1990-luvun puolivälissä kieltä puhui lapsilleen enää kaksi '
                  + 'perhettä ja alle 20-vuotiaita puhujia oli neljä. Vuonna '
                  + '1997 Inarissa aloitettiin kielipesä, jossa aikuiset '
                  + 'puhuvat lapsille vain inarinsaamea. Nyt puhujia on muutama '
                  + 'sata, ja osa kielipesän lapsista opettaa kieltä itse.',
        selite: 'Sajos-talon opastaulu Inarissa: samat asiat '
                  + 'pohjoissaameksi, inarinsaameksi, koltansaameksi ja '
                  + 'suomeksi. Alimmalla rivillä on Anarâškielâ servi, '
                  + 'inarinsaamen kieliyhdistys.',
        lahde: 'Kimberli Mäkäräinen, Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Inarinsaame',
      },
    ],
    kysymys: {
      q: 'Mitä näistä kielistä puhutaan vain Suomessa?',
      options: [
        'Suomi',
        'Inarinsaame',
        'Koltansaame',
        'Pohjoissaame',
      ],
      correct: 1,
      fact: 'Suomea puhutaan myös Ruotsissa ja Norjassa, ja pohjois- ja '
              + 'koltansaamea puhutaan kolmen valtion alueella. Inarinsaame on '
              + 'kotonaan vain Inarijärven kylissä. Puhujia on muutama sata — '
              + 'enemmän kuin kolmekymmentä vuotta sitten.',
    },
  },

  tromssa: {
    nostot: [
      {
        tyyppi: 'kuva',
        otsikko: 'Syntikat soivat kaamoksen läpi',
        tiedosto: 'Röyksopp - Glastonbury Festival 2005 crop.jpg',
        teksti: 'Tromssassa alettiin 1980-luvulla tehdä elektronista '
                  + 'musiikkia kellareissa silloin, kun ulkona oli pimeää. '
                  + 'Kaupungissa perustettiin Bel Canto vuonna 1985, samasta '
                  + 'porukasta tuli Biosphere, ja lapsuudenystävät Svein Berge '
                  + 'ja Torbjørn Brundtland perustivat Röyksoppin 1998. Pieni '
                  + 'kaupunki kuuluu yhä maailman festivaaleilla.',
        selite: 'Röyksopp Glastonburyn festivaalilla 2005: kaksi miestä, '
                  + 'pino Korgin syntetisaattoreita ja valotaulu. Duon '
                  + 'kotikaupunki on noin 350 kilometriä napapiiristä '
                  + 'pohjoiseen.',
        lahde: 'Beyond My Ken (talk), Wikimedia Commons (CC BY-SA 2.0)',
        wiki: 'Röyksopp',
        musiikki: 'https://music.apple.com/fi/search?term=royksopp',
        musiikkiNimi: 'Röyksopp Apple Musicissa',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Turska, joka tulee itse käymään',
        tiedosto: 'Tørrfisk.jpg',
        teksti: 'Skrei on turska, joka ui joka talvi Barentsinmereltä '
                  + 'Norjan rannikolle kutemaan. Osa syödään heti '
                  + 'mølje-ateriana: kalaa, mätiä, maksaa ja perunaa. Osa '
                  + 'ripustetaan telineille helmikuussa, kun maassa on vielä '
                  + 'lunta ja kärpäset nukkuvat. Kolmessa kuukaudessa kalasta '
                  + 'haihtuu noin 70 prosenttia vedestä, ja sen jälkeen se '
                  + 'säilyy vuosia.',
        selite: 'Kapakalatelineitä Moskenesissä Lofooteilla. Samanlaisia '
                  + 'telineitä on pitkin Pohjois-Norjan rannikkoa. Suurin osa '
                  + 'valmiista kalasta viedään Italiaan, missä se liotetaan '
                  + 'viikon ajan ennen ruoanlaittoa.',
        lahde: 'Wikimedia Commons (PD)',
        wiki: 'Kapakala',
      },
      {
        tyyppi: 'kuva',
        otsikko: 'Aurinkopäivä on 21. tammikuuta',
        tiedosto: 'Ishavskatedralen Tromsø.jpg',
        teksti: 'Tromssassa aurinko pysyy horisontin alapuolella marraskuun '
                  + 'lopusta tammikuun puoliväliin. Kaupungin eteläpuoliset '
                  + 'vuoret peittävät sen vielä pari viikkoa, joten aurinko '
                  + 'nähdään vasta 21. tammikuuta. Se päivä juhlitaan: '
                  + 'kouluissa ja päiväkodeissa syödään aurinkopullia ja '
                  + 'appelsiineja. Kesällä aurinko ei laske toukokuun '
                  + 'puolivälistä heinäkuun loppuun.',
        selite: 'Jäämeren katedraali eli Tromsdalenin kirkko tapaninpäivänä '
                  + 'kello 14.50. Keskellä kaamosta taivas on tunnin tai kaksi '
                  + 'juuri näin sininen — se on päivän valoisin hetki.',
        lahde: 'Harald Groven, Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Kaamos',
      },
    ],
    kysymys: {
      q: 'Tromssassa juhlitaan auringon paluuta vasta 21. tammikuuta. '
           + 'Miksi?',
      options: [
        'Vuoret peittävät auringon vielä pari viikkoa',
        'Aurinko nousee horisontin yläpuolelle vasta silloin',
        'Se on kaupungin perustamispäivä',
        'Juhla siirrettiin sopimaan koulujen lomiin',
      ],
      correct: 0,
      fact: 'Aurinko nousee horisontin yläpuolelle jo tammikuun '
              + 'puolivälissä, mutta kaupungin eteläpuoliset vuoret pitävät sen '
              + 'piilossa 21. päivään asti. Silloin syödään aurinkopullia ja '
              + 'appelsiineja.',
    },
  },
};
