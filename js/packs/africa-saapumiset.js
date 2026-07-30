// Matkakirjan saapumistekstit uudella mallilla (pilotti: Tanger ja
// Tripoli — omistajan päätös, laajennetaan kaikkiin jos malli toimii):
//
//  - `kuvaus` on nuoren herran tuore fiilis paikasta. Se näkyy
//    lihavoituna ja lukija lukee koko merkinnän ääneen tunteella.
//  - `nosto` päättää merkinnän isoisän kirjan lainaukseen niin, että
//    lähde käy ilmi tekstistä itsestään — erillistä otsikkoa ei ole.
//
// Teksti ei vaihdu kaupungissa olon aikana. Luenta on generoitu
// ElevenLabsilla (Viisas Kertoja, v3 tunnetageilla) tiedostoon
// assets/audio/puhe-africa-saapuminen-<kaupunki>.mp3.
export const AFRICA_SAAPUMISET = {
  tanger: {
    kuvaus: 'Laiva kääntyi lahteen ja Tanger nousi vastaan kuin katsomo: '
      + 'valkoiset talot kiipeävät rinnettä, minareetti niiden yllä, ja '
      + 'satamassa sellainen huuto ja touhu, että sydän löi tahtia perässä. '
      + 'Seisoin kannella suolainen tuuli kasvoilla enkä olisi halunnut '
      + 'kiirehtiä mihinkään — kahden meren ja kahden mantereen portti '
      + 'avautui juuri minulle.',
    nosto: 'Isoisän kirjassa on tästä satamasta vain yksi lause: "Täältä '
      + 'Afrikka alkaa, ja täällä sitä on turha yrittää ymmärtää kiireellä." '
      + 'Ukko osasi sittenkin pysähtyä.',
  },
  tripoli: {
    kuvaus: 'Tripoliin tullaan aavikon ja meren välistä: kaupunki makaa '
      + 'kalliolla kuin laivan keula, ja valkoiset muurit hehkuvat '
      + 'auringossa niin, että silmiä täytyy siristää. Kujilta tuoksuu '
      + 'suola, savu ja jasmiini, ja jossain muurien takana kilahtavat '
      + 'karavaanin kellot kuin lupaus pitkästä matkasta.',
    nosto: 'Isoisä kirjoitti nähneensä täällä, kuinka aavikon karavaanit '
      + 'purkavat lastinsa suoraan laivoihin — "kaksi maailmaa kättelee '
      + 'laiturilla", hän merkitsi. Sama kädenpuristus näkyy satamassa yhä.',
  },
};
