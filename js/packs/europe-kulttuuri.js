// Euroopan Kaupungin elämää -nostot (sama rakenne kuin AFRICA_KULTTUURI).
// Rakentuu kaupunki kerrallaan — pilotti: Venetsia. Kuvien lisenssit
// varmistettu Commonsin extmetadatasta (31.7.2026).
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
};
