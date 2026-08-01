// Omat suomenkieliset tiivistelmät paikoille, joista fi-Wikipediassa ei
// ole artikkelia tai se on vain parin rivin tynkä (alle pelin 200 merkin
// rajan, js/wiki.js MIN_EXTRACT) — ilman näitä Tutki-kortti näytti
// englantia tai jäi tyhjäksi.
//
// Tiedosto koskee kaikkia lautoja, ei vain Afrikkaa (ui.js tuo sen
// sellaisenaan). Nimi oli aiemmin africa-tiivistelmat.js, mikä
// harhautti — sisältö on aina ollut yhteinen.
// Avain on paikan wiki-otsikko. Tekstit on kirjoitettu pelin sävyllä,
// mutta jokainen väite on tarkistettavissa (periaate 2): pohjana
// en-Wikipedian artikkelit heinäkuussa 2026.
//
// Kun fi-Wikipediaan ilmestyy kunnollinen artikkeli, se ohittaa oman
// tekstin itsestään — tiivistelmä on vain paikka-aine, ei pysyvä totuus.
export const OMAT_TIIVISTELMAT = {
  Tanger: 'Tanger on satamakaupunki Marokon pohjoisrannikolla, siellä missä '
    + 'Välimeri ja Atlantti kohtaavat. Gibraltarinsalmen yli Espanjaan on '
    + 'vain reilut kymmenen kilometriä, joten kaupunki on ollut vuosisatoja '
    + 'Afrikan portti Eurooppaan. Vanhakaupunki eli medina kapeine kujineen '
    + 'kohoaa rinnettä ylös sataman yllä.',
  Kufra: 'Kufra on keidasryhmä Kaakkois-Libyassa keskellä Saharan '
    + 'autiomaata. Se oli pitkään karavaanireittien tärkeä levähdyspaikka, '
    + 'ja 1800-luvun lopulla siitä tuli senussiveljeskunnan keskus ja pyhä '
    + 'paikka. Ympäröivä hiekka-aavikko on maailman kuivimpia seutuja.',
  Gao: 'Gao on kaupunki Nigerjoen varrella Malissa, noin kolmesataa '
    + 'kilometriä Timbuktusta itään. Se oli 1400- ja 1500-luvuilla mahtavan '
    + 'Songhain valtakunnan pääkaupunki, jonka muistona kaupungissa kohoaa '
    + 'yhä Askia-kuninkaan hautamonumentti. Nykyään Gao on alueensa '
    + 'hallinnollinen keskus ja jokiliikenteen satama.',
  'Cape Palmas': 'Cape Palmas on kallioinen niemi Liberian kaakkoiskulmassa '
    + 'kohdassa, jossa Afrikan rannikko kääntyy itään kohti Guineanlahden '
    + 'pohjukkaa. Niemen kupeessa on Harperin kaupunki, jonka Yhdysvalloista '
    + 'palanneet vapautetut orjat perustivat 1830-luvulla. Idempänä virtaava '
    + 'Cavallajoki muodostaa rajan Norsunluurannikolle.',
  Ouidah: 'Ouidah on rannikkokaupunki Beninissä Guineanlahden rannalla. Se '
    + 'oli 1600–1800-luvuilla yksi Länsi-Afrikan suurimmista orjakaupan '
    + 'satamista, ja koko seutu sai eurooppalaisilta nimen Orjarannikko. '
    + 'Nykyään kaupunki tunnetaan vodun-uskonnon keskuksena ja historian '
    + 'muistomerkeistä, kuten rantaan johtavasta Ei paluuta -portista.',
  Tanganjikajärvi: 'Tanganjika on Itä-Afrikan hautavajoaman pitkä ja kapea '
    + 'järvi — maailman pisin makeavesijärvi ja Baikalin jälkeen toiseksi '
    + 'syvin. Sen rannat jakautuvat neljälle maalle: Tansanialle, Kongon '
    + 'demokraattiselle tasavallalle, Burundille ja Sambialle. Järvessä elää '
    + 'satoja kalalajeja, joita ei tavata missään muualla maailmassa.',
  'Bahr el Ghazal': 'Bahr el Ghazal on joki ja sen mukaan nimetty laaja '
    + 'alue Etelä-Sudanissa. Nimi on arabiaa ja tarkoittaa gasellien jokea. '
    + 'Joki kokoaa vetensä suunnattomilta suoseuduilta ja yhtyy Valkoiseen '
    + 'Niiliin; sen varret ovat karjanhoitajakansojen kotiseutua.',
  Suakin: 'Suakin on vanha satamakaupunki Sudanissa Punaisenmeren '
    + 'rannalla. Se oli vuosisatoja seudun tärkein satama, josta '
    + 'purjehdittiin kauppa- ja pyhiinvaellusmatkoille kohti Arabiaa, kunnes '
    + 'uusi Port Sudan ohitti sen 1900-luvun alussa. Vanhan kaupungin '
    + 'korallikivitalot seisovat suurelta osin raunioina saarella, jonka '
    + 'kapea pengertie yhdistää mantereeseen.',
  'Ras Hafun': 'Ras Hafun on pitkä, matala niemimaa Somalian '
    + 'koillisrannikolla — koko Afrikan mantereen itäisin kärki. Kapea '
    + 'hiekkakannas liittää sen mantereeseen. Seudulla käytiin kauppaa jo '
    + 'antiikin aikana: niemeltä on löydetty muinaisen Oponen kauppapaikan '
    + 'jäänteitä.',
  Liberia: 'Liberia on valtio Länsi-Afrikan rannikolla Sierra Leonen, '
    + 'Guinean ja Norsunluurannikon naapurina. Sen perustivat 1800-luvulla '
    + 'Yhdysvalloista palanneet vapautetut orjat, ja maa julistautui '
    + 'itsenäiseksi tasavallaksi jo vuonna 1847 — se on Afrikan vanhin '
    + 'tasavalta eikä ollut koskaan siirtomaa. Virallinen kieli on englanti, '
    + 'ja pääkaupunki Monrovia on nimetty Yhdysvaltain presidentin James '
    + 'Monroen mukaan.',

  // Eurooppa. Näiden kaupunkien fi-artikkeli on tynkä: Ateena 101,
  // Rooma 135 ja Sofia 105 merkkiä (mitattu 1.8.2026). Ilman omaa
  // tiivistelmää peli näyttäisi englanninkielisen tekstin.
  Ateena: 'Ateena on Kreikan pääkaupunki ja maan suurin kaupunki: '
    + 'seudulla asuu noin kolme ja puoli miljoonaa ihmistä. Kaupungin '
    + 'yllä kohoaa Akropolis, kalliokukkula, jonka päällä seisoo '
    + 'Parthenon-temppeli vuodelta 432 eaa. Ateena on Euroopan '
    + 'vanhimpia yhtäjaksoisesti asuttuja kaupunkeja — samalla paikalla '
    + 'on eletty yli kolme tuhatta vuotta — ja siellä kehitettiin '
    + 'antiikin aikana demokratia, teatteri ja länsimainen filosofia.',

  Rooma: 'Rooma on Italian pääkaupunki ja maan suurin kaupunki, '
    + 'rakennettu seitsemälle kukkulalle Tiber-joen varrelle. Se oli '
    + 'antiikin aikana maailman suurimman valtakunnan keskus, ja sen '
    + 'keskustassa seisovat yhä Colosseum, Forum Romanum ja Pantheon. '
    + 'Kaupungin sisällä on oma valtionsa Vatikaani, maailman pienin. '
    + 'Roomasta tuli yhdistyneen Italian pääkaupunki vasta 1871.',

  Sofia: 'Sofia on Bulgarian pääkaupunki ja maan suurin kaupunki, '
    + 'runsaan miljoonan asukkaan koti. Se sijaitsee laaksossa '
    + 'Vitosha-vuoren juurella, ja paikalla on asuttu yli seitsemän '
    + 'tuhatta vuotta. Roomalaiset perustivat tänne kuumien lähteiden '
    + 'takia kaupungin nimeltä Serdica, jonka katuja kaivettiin esiin '
    + 'metroa rakennettaessa. Sofiasta tuli pääkaupunki 1879, vuosi '
    + 'Bulgarian itsenäistymisen jälkeen.',
};
