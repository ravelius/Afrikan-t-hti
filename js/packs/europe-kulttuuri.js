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
};
