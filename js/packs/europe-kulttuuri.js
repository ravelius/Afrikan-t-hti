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
        lahde: 'Wikimedia Commons (CC BY-SA 3.0)',
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
        lahde: 'Wikimedia Commons (CC BY-SA 4.0)',
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
        lahde: 'Wikimedia Commons (CC BY-SA 3.0)',
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
        lahde: 'Wikimedia Commons (CC BY-SA 2.0)',
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
        lahde: 'Wikimedia Commons (CC BY-SA 4.0)',
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
        lahde: 'Wikimedia Commons (CC BY-SA 3.0)',
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
        lahde: 'Wikimedia Commons (CC BY 4.0)',
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
        lahde: 'Wikimedia Commons (CC BY-SA 4.0)',
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
        lahde: 'Wikimedia Commons (CC BY-SA 4.0)',
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
        lahde: 'Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Latinalaissilta',
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
        lahde: 'Wikimedia Commons (CC BY 4.0)',
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
        lahde: 'Wikimedia Commons (CC BY 2.0)',
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
        musiikkiVapaa: 'https://webradio.ert.gr/',
        musiikkiVapaaNimi: 'ERT — Kreikan yleisradion verkkoradiot',
        musiikkiVapaaLyhyt: 'ERT',
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
        lahde: 'Wikimedia Commons (CC BY-SA 4.0)',
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
        wiki: 'Evzonit',
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
        lahde: 'Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Trevin suihkulähde',
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
        lahde: 'Wikimedia Commons (CC BY-SA 3.0)',
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
        lahde: 'Wikimedia Commons (CC BY-SA 4.0)',
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
        lahde: 'Wikimedia Commons (CC BY 3.0)',
        wiki: 'Kreetalainen lyyra',
        musiikki: 'https://music.apple.com/fi/search?term=cretan%20lyra',
        musiikkiNimi: 'Kreetalaista lyyramusiikkia Apple Musicissa',
        musiikkiVapaa: 'https://webradio.ert.gr/',
        musiikkiVapaaNimi: 'ERT — Kreikan yleisradion verkkoradiot',
        musiikkiVapaaLyhyt: 'ERT',
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
        lahde: 'Wikimedia Commons (CC BY-SA 4.0)',
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
        lahde: 'Wikimedia Commons (CC BY-SA 4.0)',
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
        lahde: 'Wikimedia Commons (CC BY 2.0)',
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
        lahde: 'Wikimedia Commons (CC BY-SA 4.0)',
        wiki: 'Palermo',
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
        lahde: 'Wikimedia Commons (CC BY-SA 3.0)',
        wiki: 'Klapa',
        musiikki: 'https://music.apple.com/fi/search?term=klapa',
        musiikkiNimi: 'Klapa-lauluja Apple Musicissa',
        musiikkiVapaa: 'https://radio.hrt.hr/',
        musiikkiVapaaNimi: 'HRT — Kroatian yleisradion verkkoradiot',
        musiikkiVapaaLyhyt: 'HRT',
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
        lahde: 'Wikimedia Commons (CC BY-SA 4.0)',
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
        lahde: 'Wikimedia Commons (CC BY 2.0)',
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
        lahde: 'Wikimedia Commons (CC BY 4.0)',
        wiki: 'Gaida',
        musiikki: 'https://music.apple.com/fi/search?term=bulgarian%20folk%20gaida',
        musiikkiNimi: 'Bulgarialaista kansanmusiikkia Apple Musicissa',
        musiikkiVapaa: 'https://bnr.bg/en/live',
        musiikkiVapaaNimi: 'BNR — Bulgarian yleisradion suorat lähetykset',
        musiikkiVapaaLyhyt: 'BNR',
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
        lahde: 'Wikimedia Commons (CC BY-SA 3.0)',
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
};
