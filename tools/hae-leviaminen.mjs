/*
 * Hakee ihmisen Afrikasta leviämisen linssin aineiston.
 *
 *   node tools/hae-leviaminen.mjs [--kuiva]
 *
 * Kirjoittaa js/packs/linssi-leviaminen.js, jossa on kolme osaa:
 * logaritminen aikajana valmiine aikapisteineen, leviämisen vaiheet
 * kaarina ja tunnetut löytöpaikat koordinaatteineen.
 *
 * --- miksi rajapintaa ei ole ---
 *
 * Muille linsseille löytyi koneluettava lähde (Maailmanpankki, YK,
 * NOAA). Tälle ei löydy. Ihmisen leviämisen ajoitukset ovat yksittäisiä
 * lukuja yksittäisissä tutkimusartikkeleissa, ja ne muuttuvat sitä
 * mukaa kuin uusia ajoitusmenetelmiä sovelletaan vanhoihin löytöihin:
 * Omo Kibishin ikä hyppäsi 195 000:sta 233 000:een vuonna 2022, ja
 * Australian tulovuosi on yhä auki 65 000:n ja 50 000:n välillä.
 * Vapaata tietokantaa, joka kokoaisi nämä yhteen ja pysyisi ajan
 * tasalla, ei ole olemassa.
 *
 * Siksi ajoitustaulukko on tässä tiedostossa käsin koottuna — samaan
 * tapaan kuin tools/hae-muuttoliike.mjs:n historiaosa. Jokaisella
 * rivillä on oma lähdeviite ja varmuus, eikä yhtäkään lukua ole
 * pyöristetty kauniiksi tai johdettu toisesta luvusta.
 *
 * --- mikä sitten haetaan verkosta ---
 *
 * Löytöpaikkojen koordinaatit. Ne ovat Wikidatassa (P625) ja CC0, eli
 * ne saa ottaa sellaisenaan ilman lisenssiehtoja. Koordinaatin käsin
 * kopiointi artikkelista on juuri se kohta, jossa numero menee
 * huomaamatta väärin, joten se tehdään koneella Q-tunnuksen perusteella.
 * Q-tunnukset ovat kovakoodattuna: hakusanahaku palauttaisi eri
 * tuloksen eri päivinä, eikä aineiston pidä muuttua ajon ja toisen
 * välillä ilman että joku päättää niin.
 *
 * Jos jollain paikalla ei ole Wikidata-koordinaattia, se jätetään pois
 * kokonaan. Arvattua koordinaattia ei kirjoiteta.
 *
 * --- miksi varmuus on pakollinen kenttä ---
 *
 * Tämä on opetuspeli, ja tässä aiheessa on kiistoja, jotka näyttävät
 * ulospäin faktoilta. Madjedbeben 65 000 vuotta on Naturessa, ja niin
 * on sen kumoamisyrityskin. Siksi jokaisella rivillä on varmuus
 * ('vakiintunut' tai 'kiistelty') ja kiistellyillä lisäksi kiista-kenttä,
 * joka kertoo suomeksi mistä nimenomaan kiistellään. Piirtäjän on
 * tarkoitus näyttää ero, ei piilottaa sitä.
 *
 * --- miksi reitit ovat kaavamaisia ---
 *
 * Kaarten pisteet EIVÄT ole aineistoa. Kukaan ei tiedä mitä reittiä
 * kuljettiin; tiedetään vain että jossain vaiheessa oltiin jossain.
 * Kaaret on piirretty käsin maantieteellisesti mahdollisten
 * välipisteiden kautta, jotta kartalla näkyisi suunta ja järjestys.
 * Tämä sanotaan myös valmiin tiedoston otsikossa, ettei pelaaja luule
 * viivaa mitatuksi poluksi.
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Noden fetch ei lue HTTPS_PROXYa; ks. tools/hae-radiot.mjs.
if (!process.env.NODE_USE_ENV_PROXY && (process.env.HTTPS_PROXY || process.env.https_proxy)) {
  const ajo = spawnSync(process.execPath, [fileURLToPath(import.meta.url), ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1', NODE_NO_WARNINGS: '1' },
  });
  process.exit(ajo.status ?? 1);
}

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const kuiva = process.argv.includes('--kuiva');
const OTSAKKEET = { 'user-agent': 'Matkakirja/1.0 (opetuspeli)' };

/*
 * Aikajanan päät.
 *
 * Vanhin kohta on Jebel Irhoud (315 000) ja nuorin Lapita-levittäytyminen
 * (3 000). Suhde on yli satakertainen, joten lineaarisella janalla
 * kaikki jääkauden jälkeinen puristuisi viimeiseen prosenttiin ja
 * Amerikat, Tyynimeri ja Eurooppa olisivat päällekkäin samassa
 * pisteessä. Siksi jana on logaritminen ja aineisto antaa jokaiselle
 * kohdalle valmiin osuuden — piirtäjän ei tarvitse laskea logaritmeja
 * eikä tietää janan päistä.
 */
const ALKU = 300000;
const LOPPU = 3000;

/** Vuosiluku janan osuudeksi: 0 = janan vanha pää, 1 = nuori pää. */
const osuus = (vuotta) => {
  const arvo = (Math.log10(ALKU) - Math.log10(vuotta)) / (Math.log10(ALKU) - Math.log10(LOPPU));
  return Number(arvo.toFixed(4));
};

/*
 * Janan asteikkomerkit.
 *
 * Kymmenpotenssit ja niiden puolivälit, jotta merkit jakautuvat
 * tasaisesti logaritmisella janalla. iso: true merkitsee pääviivat
 * (1-3-1-3-sarja), joille piirtäjä voi antaa vahvemman ilmeen.
 */
const AIKAPISTEET = [
  { vuotta: 300000, iso: true },
  { vuotta: 200000, iso: false },
  { vuotta: 100000, iso: true },
  { vuotta: 50000, iso: false },
  { vuotta: 30000, iso: true },
  { vuotta: 20000, iso: false },
  { vuotta: 10000, iso: true },
  { vuotta: 5000, iso: false },
  { vuotta: 3000, iso: true },
];

/** Suomalainen tuhaterotin: välilyönti viisinumeroisesta ylöspäin. */
const luvuksi = (n) => (n >= 10000
  ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  : String(n));

/*
 * Leviämisen vaiheet siinä järjestyksessä kuin ne tapahtuivat.
 *
 * alkoi ja paattyi ovat vuosia ennen nykyaikaa, alkoi aina suurempi.
 * kaaret on lista kaaria, ei yksi kaari: useimpiin vaiheisiin kuuluu
 * monta suuntaa, eikä niitä saa yhdistää yhdeksi viivaksi (Afrikan
 * sisäinen leviäminen kulki sekä pohjoiseen että etelään, eikä kartalle
 * kuulu piirtää siksakkia niiden välille).
 *
 * Kaarten pisteet ovat [lon, lat]. Beringian ja Tyynenmeren kaaret
 * ylittävät 180. päivämääräraja, joten pituusaste hyppää arvosta 178
 * arvoon -179 kesken kaaren — piirtäjän on käsiteltävä sauma samoin
 * kuin muissakin aineistoissa (ks. tools/tee-maasto.mjs).
 */
const VAIHEET = [
  {
    avain: 'afrikka',
    nimi: 'Afrikan sisäinen leviäminen',
    alkoi: 315000,
    paattyi: 60000,
    ajoitus: 'noin 315 000–60 000 vuotta sitten',
    varmuus: 'vakiintunut',
    kiista: 'Se että lajimme on yli 300 000 vuotta vanha ja että sen '
      + 'luita on Afrikan vastakkaisista päistä, on vakiintunutta. Kiistaa '
      + 'käydään siitä, syntyikö ihminen yhdellä alueella vai koko '
      + 'mantereen laajuisessa väestöverkostossa.',
    lahde: 'Hublin ym. 2017, Nature 546:289; Richter ym. 2017, Nature 546:293; '
      + 'Vidal ym. 2022, Nature 601:579; Scerri ym. 2018, Trends in Ecology & Evolution 33:582',
    selite: 'Lajimme vanhimmat luut eivät ole yhdestä paikasta vaan Afrikan eri '
      + 'laidoilta: Marokosta noin 315 000 ja Etiopiasta vähintään 233 000 vuoden '
      + 'takaa. Nykykäsityksen mukaan ihminen ei syntynyt yhdessä kehdossa vaan '
      + 'toisiinsa löyhästi yhteydessä olleiden väestöjen verkostossa.',
    kaaret: [
      [[-8.9, 31.9], [-2, 29], [8, 24], [20, 18], [30, 13], [36, 5]],
      [[36, 5], [38, -2], [39.7, -3.7], [35, -12], [30, -22], [25, -30], [21.2, -34.4]],
      [[30, 13], [18, 13], [5, 14], [-8, 13], [-16, 14]],
    ],
  },
  {
    avain: 'varhaiset-retket',
    nimi: 'Varhaiset retket Afrikan ulkopuolelle',
    alkoi: 210000,
    paattyi: 88000,
    ajoitus: 'noin 210 000–88 000 vuotta sitten',
    varmuus: 'kiistelty',
    kiista: 'Skhulin ja Qafzehin 120 000–90 000 vuoden hautaukset ovat '
      + 'vakiintuneita, samoin Al Wustan 88 000 vuoden sormiluu. Sen sijaan '
      + 'Misliyan 194 000–177 000 vuoden ajoitusta on arvosteltu uraanisarjadatan '
      + 'tulkinnasta, ja Kreikan Apidiman yli 210 000 vuoden tulkintaa pidetään '
      + 'monin paikoin epävarmana.',
    lahde: 'Hershkovitz ym. 2018, Science 359:456; kommentti Sharp & Paces 2018, '
      + 'Science 362:eaat6598; Groucutt ym. 2018, Nature Ecology & Evolution 2:800; '
      + 'Harvati ym. 2019, Nature 571:500',
    selite: 'Ihmisiä kävi Afrikan ulkopuolella jo kauan ennen varsinaista '
      + 'leviämistä. Nämä retket eivät kuitenkaan jättäneet jälkeä nykyihmisten '
      + 'perimään, joten niiden tekijöiden suku näyttää sammuneen jälkeläisittä.',
    kaaret: [
      [[32, 20], [32.5, 26], [33, 30], [34.5, 31.5], [35, 32.7]],
      [[35, 32], [36, 30], [37.5, 28], [39.4, 27.4]],
      [[35, 32.7], [32, 36], [28, 38], [24, 37], [22.4, 36.7]],
    ],
  },
  {
    avain: 'paauloslahto',
    nimi: 'Ratkaiseva lähtö Afrikasta',
    alkoi: 60000,
    paattyi: 50000,
    ajoitus: 'noin 60 000–50 000 vuotta sitten',
    varmuus: 'vakiintunut',
    kiista: 'Että kaikkien Afrikan ulkopuolisten esivanhemmat lähtivät yhtenä '
      + 'pääaaltona, on vakiintunutta. Tarkka vuosiluku ei ole: vuoden 2024 '
      + 'perimätutkimukset ajoittavat neandertalilaisekoituksen välille '
      + '50 500–43 500 vuotta sitten, mikä sitoo lähdön juuri sitä edeltävään '
      + 'aikaan, mutta arviot vaihtelevat 70 000:n ja 50 000:n välillä.',
    lahde: 'Iasi ym. 2024, Science 386:eadq3010; Sümer ym. 2024, Nature, '
      + 'doi:10.1038/s41586-024-08420-x',
    selite: 'Jokaisen nykyisin Afrikan ulkopuolella asuvan ihmisen esivanhemmat '
      + 'lähtivät samassa pääaallossa. Matkalla he saivat lapsia neandertalilaisten '
      + 'kanssa, ja siksi heidän jälkeläisillään on yhä 1–2 prosenttia '
      + 'neandertalilaisperimää.',
    kaaret: [
      [[35, 12], [33, 20], [32.5, 27], [34, 31], [36, 33], [41, 35], [47, 34], [54, 30], [60, 28]],
    ],
  },
  {
    avain: 'etelainen-reitti',
    nimi: 'Eteläinen reitti Punaisenmeren yli',
    alkoi: 70000,
    paattyi: 50000,
    ajoitus: 'noin 70 000–50 000 vuotta sitten',
    varmuus: 'kiistelty',
    kiista: 'Kumpaa reittiä pääaalto kulki — Siinain kannasta pitkin vai '
      + 'Bab-el-Mandebin salmen yli Arabian eteläreunalle — ei tiedetä. '
      + 'Molemmilla on kannattajansa, eikä kysymystä ole ratkaistu. Tämä kaari '
      + 'on siis vaihtoehto edelliselle, ei sen lisä.',
    lahde: 'Groucutt ym. 2015, Evolutionary Anthropology 24:149; '
      + 'Bae, Douka & Petraglia 2017, Science 358:eaai9067',
    selite: 'Jääkauden matalan merenpinnan aikaan Bab-el-Mandebin salmi kapeni '
      + 'muutamaan kilometriin. Osa tutkijoista pitää sitä todennäköisempänä '
      + 'reittinä kuin Siinain kannasta, koska Arabian eteläreunan rannikko '
      + 'tarjosi ruokaa koko matkan.',
    kaaret: [
      [[40, 13], [43.3, 12.5], [45, 13], [50, 15], [55, 18], [58, 22], [60, 25]],
    ],
  },
  {
    avain: 'etela-aasia',
    nimi: 'Etelä- ja Kaakkois-Aasia',
    alkoi: 73000,
    paattyi: 45000,
    ajoitus: 'noin 73 000–45 000 vuotta sitten',
    varmuus: 'kiistelty',
    kiista: 'Fa-Hien Lenan noin 48 000 vuoden löydöt ovat kiistattomia. Sen '
      + 'sijaan Sumatran Lida Ajerin 73 000–63 000 vuoden hampaat ja Laosin '
      + 'Tam Pa Lingin vanhimmat kerrokset viittaisivat paljon varhaisempaan '
      + 'tuloon — mutta perimätutkimus ei löydä näistä varhaisista tulijoista '
      + 'jälkeä nykyihmisissä. Ristiriitaa ei ole ratkaistu.',
    lahde: 'Westaway ym. 2017, Nature 548:322; Wedage ym. 2019, Nature '
      + 'Communications 10:739; Freidline ym. 2023, Nature Communications 14:3193',
    selite: 'Rannikkoa ja jokilaaksoja pitkin edettiin Intian niemimaan yli '
      + 'Kaakkois-Aasiaan. Sri Lankan Fa-Hien Lenassa metsästettiin sademetsässä '
      + 'luusta veistetyillä nuolenkärjillä jo 48 000 vuotta sitten.',
    kaaret: [
      [[60, 25], [67, 25], [72, 23], [76, 18], [79, 13], [80.2, 6.6]],
      [[76, 22], [85, 23], [90, 24], [95, 22], [100, 20], [103.4, 20.2]],
      [[95, 22], [99, 15], [101, 8], [101, 1], [100.5, -0.5]],
    ],
  },
  {
    avain: 'australia',
    nimi: 'Australia ja Uusi-Guinea',
    alkoi: 65000,
    paattyi: 40000,
    ajoitus: 'noin 65 000–40 000 vuotta sitten',
    varmuus: 'kiistelty',
    kiista: 'Madjedbeben 65 000 ± 6 000 vuoden ajoitus on kiistetty: '
      + 'arvostelijoiden mukaan nuoremmat esineet ovat voineet vajota hiekassa '
      + 'alaspäin, ja he pitävät noin 50 000 vuotta todennäköisempänä. Vuoden '
      + '2024 perimätutkimukset tukevat myöhempää tuloa. Mungojärven noin '
      + '40 000 vuoden hautaukset ovat sen sijaan kiistattomia.',
    lahde: 'Clarkson ym. 2017, Nature 547:306; arvostelu O’Connell ym. 2018, '
      + 'PNAS 115:8482; Bowler ym. 2003, Nature 421:837',
    selite: 'Australiaan pääsy vaati merenkulkua: silloinkin kun merenpinta oli '
      + 'yli sata metriä nykyistä alempana, Aasian ja Australian väliin jäi '
      + 'kymmenien kilometrien avomeri. Tämä on maailman vanhin todiste siitä, '
      + 'että ihminen kulki vesillä näkymättömissä olevaan määränpäähän.',
    kaaret: [
      [[103, 3], [110, -2], [115, -6], [120, -8], [125, -9], [128, -9], [130, -11], [132.9, -12.5]],
      [[120, 0], [125, 1], [130, -1], [135, -3], [140, -5], [143, -8], [146, -10]],
      [[132.9, -12.5], [138, -18], [142, -25], [143.1, -33.8]],
    ],
  },
  {
    avain: 'eurooppa',
    nimi: 'Eurooppa',
    alkoi: 45000,
    paattyi: 40000,
    ajoitus: 'noin 45 000–40 000 vuotta sitten',
    varmuus: 'vakiintunut',
    kiista: 'Ranskan Grotte Mandrinista on esitetty jopa 54 000 vuoden '
      + 'ihmishammasta, mutta tulkinnasta kiistellään. Batšo Kiron 45 930–42 580 '
      + 'vuoden luut on sen sijaan ajoitettu suoraan.',
    lahde: 'Hublin ym. 2020, Nature 581:299; Fewlass ym. 2020, Nature Ecology & '
      + 'Evolution 4:794; Sümer ym. 2024, Nature, doi:10.1038/s41586-024-08420-x; '
      + 'Slimak ym. 2022, Science Advances 8:eabj9496',
    selite: 'Eurooppaan tultiin idästä, Anatolian ja Balkanin kautta. Manner ei '
      + 'ollut tyhjä: neandertalilaiset olivat asuneet siellä satojatuhansia '
      + 'vuosia ja katosivat noin 40 000 vuotta sitten, muutaman tuhannen vuoden '
      + 'päällekkäiselon jälkeen.',
    kaaret: [
      [[45, 37], [40, 39], [35, 40], [30, 41], [26, 42], [25.4, 42.9], [20, 45],
        [16, 47], [13, 48], [8, 48], [3, 47], [-2, 43], [-6, 40]],
      [[25.4, 42.9], [22, 46], [19, 49], [15, 50.5], [11.3, 50.6], [6, 51], [1, 51]],
    ],
  },
  {
    avain: 'pohjois-aasia',
    nimi: 'Pohjois-Aasia ja Siperia',
    alkoi: 45000,
    paattyi: 30000,
    ajoitus: 'noin 45 000–30 000 vuotta sitten',
    varmuus: 'vakiintunut',
    lahde: 'Fu ym. 2014, Nature 514:445; Douka ym. 2019, Nature 565:640; '
      + 'Pitulko ym. 2004, Science 303:52; Sikora ym. 2019, Nature 570:182',
    selite: 'Länsi-Siperian Ust-Ishimin miehen perimä on luettu 45 000 vuoden '
      + 'takaa. 32 000 vuotta sitten oltiin jo napapiirin pohjoispuolella '
      + 'Janajoella — kylmimmässä paikassa, jossa ihminen oli siihen mennessä '
      + 'koskaan asunut.',
    kaaret: [
      [[50, 38], [57, 45], [64, 52], [71.2, 57.7]],
      [[71.2, 57.7], [78, 54], [84.7, 51.4], [95, 53], [105, 56], [115, 61],
        [125, 66], [135.4, 70.7]],
    ],
  },
  {
    avain: 'beringia',
    nimi: 'Beringia',
    alkoi: 23000,
    paattyi: 16000,
    ajoitus: 'noin 23 000–16 000 vuotta sitten',
    varmuus: 'kiistelty',
    kiista: 'Pysähdyksen kesto ja ajoitus vaihtelevat arvioissa: eristyksen '
      + 'alkua on esitetty välille 25 000–20 000 ja loppua välille 16 000–15 000 '
      + 'vuotta sitten. Osa tutkijoista pitää perimähavaintoja selitettävissä '
      + 'myös nopealla väestönkasvulla ilman pitkää pysähdystä.',
    lahde: 'Tamm ym. 2007, PLoS ONE 2:e829; Llamas ym. 2016, Science Advances '
      + '2:e1501385; Moreno-Mayar ym. 2018, Nature 553:203; Potter ym. 2017, '
      + 'Current Anthropology 58 (S17)',
    selite: 'Jääkauden huipulla merenpinta oli yli sata metriä nykyistä alempana '
      + 'ja Siperian ja Alaskan väliin paljastui tuhat kilometriä leveä maa-alue. '
      + 'Perimätutkimusten mukaan Amerikan asuttajien esivanhemmat viipyivät '
      + 'siellä eristyksissä tuhansia vuosia ennen etenemistä etelään.',
    kaaret: [
      [[135.4, 70.7], [145, 69], [155, 67], [165, 65], [175, 64], [-178, 64],
        [-170, 64], [-163, 63], [-155, 63], [-150, 62]],
    ],
  },
  {
    avain: 'amerikat',
    nimi: 'Amerikat',
    alkoi: 16000,
    paattyi: 14000,
    ajoitus: 'noin 16 000–14 000 vuotta sitten',
    varmuus: 'kiistelty',
    kiista: 'Monte Verden noin 14 500 vuoden asuinpaikka Chilessä on laajasti '
      + 'hyväksytty. New Mexicon White Sandsin jalanjälkien 23 000–21 000 vuoden '
      + 'ajoituksesta sen sijaan kiistellään: ensimmäinen ajoitus perustui '
      + 'siemeniin, jotka voivat ottaa pohjavedestä vanhaa hiiltä. Vuoden 2023 '
      + 'siitepöly- ja kvartsiajoitukset tukevat vanhaa ikää, mutta asia ei ole '
      + 'ratkennut.',
    lahde: 'Dillehay ym. 2008, Science 320:784; Bennett ym. 2021, Science '
      + '373:1528; Pigati ym. 2023, Science 382:73; kommentti Madsen ym. 2022, '
      + 'Science 375:eabm4678',
    selite: 'Amerikat olivat viimeinen suuri manneralue, johon ihminen asettui. '
      + 'Chilen Monte Verdessä oltiin noin 14 500 vuotta sitten — eli mantereiden '
      + 'toisessa päässä hyvin pian sen jälkeen, kun reitti etelään aukesi.',
    kaaret: [
      [[-150, 62], [-145, 60], [-135, 57], [-130, 52], [-125, 46], [-122, 38],
        [-117, 32], [-110, 24], [-100, 17], [-90, 13], [-82, 8], [-78, 2],
        [-77, -7], [-73, -18], [-72, -30], [-73.2, -41.5]],
      [[-140, 63], [-132, 59], [-122, 55], [-115, 52], [-110, 47], [-105, 42],
        [-100, 36], [-97, 31], [-95, 25]],
    ],
  },
  {
    avain: 'tyynimeri',
    nimi: 'Kaukainen Oseania',
    alkoi: 3300,
    paattyi: 2800,
    ajoitus: 'noin 3 300–2 800 vuotta sitten',
    varmuus: 'vakiintunut',
    lahde: 'Sheppard 2011, Current Anthropology 52:799; Bedford ym. 2006, '
      + 'Antiquity 80:812; Lipson ym. 2018, Current Biology 28:1157',
    selite: 'Lapita-keramiikan tekijät ylittivät Kaukaisen Oseanian rajan noin '
      + '3 000 vuotta sitten ja levisivät Vanuatulle, Fidžille, Tongaan ja '
      + 'Samoaan muutamassa sukupolvessa. Tämä oli ensimmäinen kerta, kun '
      + 'ihminen asutti saaria, joita ei näe edellisestä saaresta.',
    kaaret: [
      [[147, -3], [151, -5], [155, -7], [159, -9], [163, -11], [167, -15],
        [168.4, -17.8], [172, -18], [178, -18], [-179, -19], [-175, -21], [-172, -13.8]],
    ],
  },
  {
    avain: 'ita-polynesia',
    nimi: 'Itä-Polynesia',
    alkoi: 1000,
    paattyi: 700,
    ajoitus: 'noin 1 000–700 vuotta sitten (1000–1300 jaa.)',
    varmuus: 'vakiintunut',
    kiista: 'Aiemmin esitettiin jopa 2 000 vuoden takaisia asutusaikoja, mutta '
      + 'tarkkuusradiohiiliajoitus siirsi ne selvästi nuoremmiksi. Nykyarvio on '
      + 'vakiintunut: Seurasaaret 1025–1120 jaa. ja loput saaret 1190–1290 jaa.',
    lahde: 'Wilmshurst ym. 2011, PNAS 108:1815; Kirch 2017, On the Road of the '
      + 'Winds (2. laitos)',
    selite: 'Tyynenmeren itäosa asutettiin vasta paljon Lapitan jälkeen ja hyvin '
      + 'nopeasti. Uusi-Seelanti — maapallon viimeinen suuri asumaton maa — sai '
      + 'ensimmäiset asukkaansa vasta 1250–1300 jaa.',
    kaaret: [
      [[-172, -13.8], [-165, -16], [-158, -17], [-151, -17], [-149.5, -17.5]],
      [[-149.5, -17.5], [-145, -14], [-140, -9], [-130, -17], [-120, -24], [-109.4, -27.1]],
      [[-149.5, -17.5], [-155, -20], [-165, -25], [-178, -32], [176, -38], [174.8, -41.3]],
      [[-149.5, -17.5], [-152, -8], [-155, 2], [-157, 12], [-156, 19.5]],
    ],
  },
];

/*
 * Löytöpaikat. Koordinaatti EI ole tässä vaan haetaan Wikidatasta
 * qid-tunnuksen perusteella; tässä on vain ikä, lähde ja selitys.
 *
 * ika on lähteen ilmoittama keskiluku vuosina ennen nykyaikaa, ja
 * pienin/suurin sen haarukka silloin kun lähde antaa sellaisen.
 * Vähintään-ajoituksissa (Omo Kibish) ika on se vähimmäisikä jonka
 * lähde ilmoittaa, ei arvaus todellisesta iästä.
 */
const LOYDOT = [
  {
    qid: 'Q846913',
    nimi: 'Jebel Irhoud',
    maa: 'Marokko',
    ika: 315000,
    pienin: 281000,
    suurin: 349000,
    ajoitus: '315 000 ± 34 000 vuotta sitten',
    varmuus: 'vakiintunut',
    lahde: 'Richter ym. 2017, Nature 546:293; Hublin ym. 2017, Nature 546:289',
    selite: 'Vanhimmat tunnetut luut, joissa on lajimme tuntomerkit. Kasvot ovat '
      + 'jo nykyihmisen, mutta aivokoppa pitkulaisempi — moderni ihminen ei '
      + 'ilmestynyt kerralla valmiina.',
  },
  {
    qid: 'Q3882284',
    nimi: 'Omo Kibish',
    maa: 'Etiopia',
    ika: 233000,
    pienin: 211000,
    suurin: 255000,
    ajoitus: 'vähintään 233 000 ± 22 000 vuotta sitten',
    varmuus: 'vakiintunut',
    lahde: 'Vidal ym. 2022, Nature 601:579; aiempi ajoitus McDougall ym. 2005, '
      + 'Nature 433:733',
    selite: 'Omo I -kallo löytyi vuonna 1967. Sen yläpuolisen tuhkakerroksen '
      + 'jäljittäminen Shalan tulivuoren purkaukseen siirsi iän vuonna 2022 '
      + 'vähintään 233 000 vuoteen; aiempi arvio oli 195 000.',
  },
  {
    qid: 'Q3643194',
    nimi: 'Herto (Bourin muodostuma)',
    maa: 'Etiopia',
    ika: 157000,
    pienin: 154000,
    suurin: 160000,
    ajoitus: '160 000–154 000 vuotta sitten',
    varmuus: 'vakiintunut',
    lahde: 'White ym. 2003, Nature 423:742; Clark ym. 2003, Nature 423:747',
    selite: 'Kolme kalloa, joita kuvattiin alalajina Homo sapiens idaltu. '
      + 'Kalloissa on jälkiä kuolemanjälkeisestä käsittelystä — mahdollisesti '
      + 'vanhimmat merkit vainajan hoitamisen tavoista.',
  },
  {
    qid: 'Q53443604',
    nimi: 'Panga ya Saidi',
    maa: 'Kenia',
    ika: 78000,
    ajoitus: 'noin 78 000 vuotta sitten',
    varmuus: 'vakiintunut',
    lahde: 'Martinón-Torres ym. 2021, Nature 593:95; Shipton ym. 2018, Nature '
      + 'Communications 9:1832',
    selite: 'Afrikan vanhin tunnettu tahallinen hautaus: noin kolmivuotias lapsi, '
      + 'jota kutsutaan Mtotoksi, laskettiin kaivettuun kuoppaan pää tuettuna. '
      + 'Luola oli asuttu yhtäjaksoisesti 78 000 vuotta.',
  },
  {
    qid: 'Q884971',
    nimi: 'Blombosluola',
    maa: 'Etelä-Afrikka',
    ika: 73000,
    pienin: 73000,
    suurin: 77000,
    ajoitus: 'noin 77 000–73 000 vuotta sitten',
    varmuus: 'vakiintunut',
    lahde: 'Henshilwood ym. 2002, Science 295:1278; Henshilwood ym. 2018, '
      + 'Nature 562:115',
    selite: 'Okrapalasiin kaiverrettuja ristikkokuvioita ja okravärillä piirretty '
      + 'kuvio kivensirulle. Vanhimpia tunnettuja merkkejä siitä, että ihminen '
      + 'teki kuvan tarkoituksella eikä sattumalta.',
  },
  {
    qid: 'Q12409386',
    nimi: 'Misliyan luola',
    maa: 'Israel',
    ika: 185000,
    pienin: 177000,
    suurin: 194000,
    ajoitus: '194 000–177 000 vuotta sitten (kiistelty)',
    varmuus: 'kiistelty',
    lahde: 'Hershkovitz ym. 2018, Science 359:456; arvostelu Sharp & Paces 2018, '
      + 'Science 362:eaat6598',
    selite: 'Yläleuanpuolikas, joka olisi vanhin nykyihmisen luu Afrikan '
      + 'ulkopuolella. Uraanisarja-ajoituksen tulkintaa on arvosteltu: '
      + 'arvostelijoiden mukaan aineisto takaa vain 60 000–70 000 vuoden '
      + 'vähimmäisiän.',
  },
  {
    qid: 'Q2121357',
    nimi: 'Qafzehin luola',
    maa: 'Israel',
    ika: 100000,
    pienin: 90000,
    suurin: 120000,
    ajoitus: 'noin 120 000–90 000 vuotta sitten',
    varmuus: 'vakiintunut',
    lahde: 'Valladas ym. 1988, Nature 331:614; Grün ym. 2005, Journal of Human '
      + 'Evolution 49:316',
    selite: 'Vähintään viidentoista ihmisen hautauksia, osa punaokralla ja '
      + 'hautalahjoilla. Nämä ihmiset eivät kuitenkaan ole nykyisten Afrikan '
      + 'ulkopuolisten esivanhempia — heidän sukunsa sammui.',
  },
  {
    qid: 'Q15067212',
    nimi: 'Apidiman luola',
    maa: 'Kreikka',
    ika: 210000,
    ajoitus: 'yli 210 000 vuotta sitten (kiistelty)',
    varmuus: 'kiistelty',
    lahde: 'Harvati ym. 2019, Nature 571:500',
    selite: 'Kallonpalanen, jonka tulkittiin olevan yli 210 000 vuotta vanha '
      + 'nykyihminen — 150 000 vuotta vanhempi kuin mikään muu Euroopasta. Sekä '
      + 'lajimääritys että ajoitus ovat yhä kiistanalaisia.',
  },
  {
    qid: 'Q136439221',
    nimi: 'Al Wusta',
    maa: 'Saudi-Arabia',
    ika: 88000,
    ajoitus: 'noin 88 000 vuotta sitten',
    varmuus: 'vakiintunut',
    lahde: 'Groucutt ym. 2018, Nature Ecology & Evolution 2:800',
    selite: 'Yksi sormiluu muinaisen järven rannalta keskeltä nykyistä Nefudin '
      + 'hiekkaerämaata. Vanhin suoraan ajoitettu nykyihmisen luu Afrikan ja '
      + 'Levantin ulkopuolelta.',
  },
  {
    qid: 'Q27922296',
    nimi: 'Tam Pa Ling',
    maa: 'Laos',
    ika: 70000,
    pienin: 46000,
    suurin: 86000,
    ajoitus: '86 000–46 000 vuotta sitten (kiistelty)',
    varmuus: 'kiistelty',
    lahde: 'Demeter ym. 2012, PNAS 109:14375; Freidline ym. 2023, Nature '
      + 'Communications 14:3193',
    selite: 'Manner-Kaakkois-Aasian vanhimmat nykyihmisen luut. Vuoden 2023 '
      + 'uusintaajoitus vei syvimmät kerrokset noin 86 000 vuoteen, mikä sotii '
      + 'perimätutkimuksen antamaa lähtöaikaa vastaan.',
  },
  {
    qid: 'Q3721993',
    nimi: 'Fa-Hien Lena',
    maa: 'Sri Lanka',
    ika: 48000,
    pienin: 45000,
    suurin: 48000,
    ajoitus: 'noin 48 000–45 000 vuotta sitten',
    varmuus: 'vakiintunut',
    lahde: 'Wedage ym. 2019, Nature Communications 10:739',
    selite: 'Vanhin tunnettu ihmisasutus sademetsässä. Luolasta on löytynyt '
      + 'luusta veistettyjä nuolenkärkiä — todiste jousesta ja nuolesta jo '
      + '48 000 vuotta sitten.',
  },
  {
    qid: 'Q8563176',
    nimi: 'Madjedbebe',
    maa: 'Australia',
    ika: 65000,
    pienin: 59000,
    suurin: 71000,
    ajoitus: '65 000 ± 6 000 vuotta sitten (kiistelty)',
    varmuus: 'kiistelty',
    lahde: 'Clarkson ym. 2017, Nature 547:306; arvostelu O’Connell ym. 2018, '
      + 'PNAS 115:8482',
    selite: 'Kalliosuoja, jonka kivityökalut ja okrajauheet ajoitettiin '
      + 'optisesti 65 000 vuoden ikäisiksi. Arvostelijoiden mukaan nuoremmat '
      + 'esineet ovat voineet vajota hiekassa alaspäin, ja he pitävät noin '
      + '50 000 vuotta todennäköisempänä.',
  },
  {
    qid: 'Q452812',
    nimi: 'Mungojärvi',
    maa: 'Australia',
    ika: 40000,
    pienin: 38000,
    suurin: 42000,
    ajoitus: '40 000 ± 2 000 vuotta sitten',
    varmuus: 'vakiintunut',
    lahde: 'Bowler ym. 2003, Nature 421:837',
    selite: 'Mungo-nainen poltettiin ja Mungo-mies haudattiin punaokralla '
      + 'siroteltuna noin 40 000 vuotta sitten. Maailman vanhimpia tunnettuja '
      + 'tuhkaushautauksia.',
  },
  {
    qid: 'Q4838907',
    nimi: 'Batšo Kiron luola',
    maa: 'Bulgaria',
    ika: 44000,
    pienin: 42580,
    suurin: 45930,
    ajoitus: '45 930–42 580 vuotta sitten',
    varmuus: 'vakiintunut',
    lahde: 'Hublin ym. 2020, Nature 581:299; Fewlass ym. 2020, Nature Ecology & '
      + 'Evolution 4:794',
    selite: 'Euroopan vanhimmat suoraan ajoitetut nykyihmisen luut. Samoista '
      + 'kerroksista löytyi luutyökaluja ja karhunhampaista tehtyjä riipuksia.',
  },
  {
    qid: 'Q1029322',
    nimi: 'Denisovan luola',
    maa: 'Venäjä (Altai)',
    ika: 45000,
    ajoitus: 'nykyihmisen jälkiä noin 45 000 vuoden takaa; denisovanihmisiä '
      + 'luolassa jo yli 200 000 vuotta sitten',
    varmuus: 'vakiintunut',
    lahde: 'Reich ym. 2010, Nature 468:1053; Douka ym. 2019, Nature 565:640; '
      + 'Zavala ym. 2021, Nature 595:399',
    selite: 'Luola, josta löytyi vuonna 2010 kokonaan tuntematon ihmislaji '
      + 'pelkän sormiluun perimästä: denisovanihminen. Papuan ja Australian '
      + 'alkuperäisväestöillä on yhä 3–6 prosenttia denisovanperimää.',
  },
  {
    qid: 'Q4478405',
    nimi: 'Ust-Ishim',
    maa: 'Venäjä (Länsi-Siperia)',
    ika: 45000,
    ajoitus: 'noin 45 000 vuotta sitten',
    varmuus: 'vakiintunut',
    lahde: 'Fu ym. 2014, Nature 514:445',
    selite: 'Irtysin rannalta löytyi yksi reisiluu, josta luettiin vanhin hyvin '
      + 'säilynyt nykyihmisen perimä. Sen neandertalilaisjaksot olivat pitkiä, '
      + 'mikä osoitti sekoittumisen tapahtuneen vain muutamaa tuhatta vuotta '
      + 'aiemmin.',
  },
  {
    qid: 'Q18399201',
    nimi: 'Janajoen sarvipaikka',
    maa: 'Venäjä (Jakutia)',
    ika: 32000,
    pienin: 31600,
    suurin: 32000,
    ajoitus: 'noin 32 000 vuotta sitten',
    varmuus: 'vakiintunut',
    lahde: 'Pitulko ym. 2004, Science 303:52; Sikora ym. 2019, Nature 570:182',
    selite: 'Vanhin tunnettu asuinpaikka napapiirin pohjoispuolella. Kahden '
      + 'pojan hampaista luettu perimä paljasti aiemmin tuntemattoman väestön, '
      + 'joita kutsutaan muinaisiksi pohjoissiperialaisiksi.',
  },
  {
    qid: 'Q1200164',
    nimi: 'White Sands',
    maa: 'Yhdysvallat',
    ika: 22000,
    pienin: 21000,
    suurin: 23000,
    ajoitus: '23 000–21 000 vuotta sitten (kiistelty)',
    varmuus: 'kiistelty',
    lahde: 'Bennett ym. 2021, Science 373:1528; Pigati ym. 2023, Science 382:73; '
      + 'kommentti Madsen ym. 2022, Science 375:eabm4678',
    selite: 'Muinaisen järven rantaan jääneitä paljaiden jalkojen jälkiä. Jos '
      + 'ajoitus pitää, ihmisiä oli Amerikassa jo ennen jääkauden huippua — mikä '
      + 'sotii lähes kaikkia muita todisteita vastaan.',
  },
  {
    qid: 'Q975775',
    nimi: 'Monte Verde',
    maa: 'Chile',
    ika: 14500,
    pienin: 14200,
    suurin: 14800,
    ajoitus: 'noin 14 500 vuotta sitten',
    varmuus: 'vakiintunut',
    lahde: 'Dillehay ym. 2008, Science 320:784',
    selite: 'Turvesuon säilyttämä asuinpaikka: puisia rakenteita, köysiä, '
      + 'jalanjälki ja merilevää 90 kilometrin päästä rannikolta. Löytö mursi '
      + '1990-luvulla käsityksen, jonka mukaan Clovis-kulttuuri olisi ollut '
      + 'Amerikan ensimmäinen.',
  },
  {
    qid: 'Q7701210',
    nimi: 'Teouma',
    maa: 'Vanuatu',
    ika: 3000,
    pienin: 2900,
    suurin: 3000,
    ajoitus: 'noin 3 000 vuotta sitten',
    varmuus: 'vakiintunut',
    lahde: 'Bedford ym. 2006, Antiquity 80:812; Lipson ym. 2018, Current Biology '
      + '28:1157',
    selite: 'Lapita-kulttuurin hautausmaa. Vainajien perimä osoitti, että '
      + 'Kaukaisen Oseanian ensimmäiset asukkaat tulivat suoraan Taiwanin ja '
      + 'Filippiinien suunnalta lähes ilman papualaista sekoitusta.',
  },
];

/*
 * Koordinaatit Wikidatasta yhdellä kutsulla.
 *
 * wbgetentities ottaa 50 tunnusta kerralla, ja niitä on kaksikymmentä.
 * Yksi pyyntö riittää — peräkkäiset haut törmäisivät nopeusrajoitukseen
 * ("You are making too many requests to the API"), joka palauttaa
 * pelkkää tekstiä eikä JSONia.
 */
async function haeKoordinaatit(qidt) {
  const osoite = 'https://www.wikidata.org/w/api.php?action=wbgetentities'
    + `&ids=${qidt.join('|')}&props=claims&format=json`;
  const vastaus = await fetch(osoite, { headers: OTSAKKEET });
  if (!vastaus.ok) throw new Error(`Wikidata vastasi ${vastaus.status}`);
  const data = await vastaus.json();
  const paikat = new Map();
  for (const qid of qidt) {
    const piste = data.entities?.[qid]?.claims?.P625?.[0]?.mainsnak?.datavalue?.value;
    if (!piste) continue;
    paikat.set(qid, {
      lon: Number(piste.longitude.toFixed(4)),
      lat: Number(piste.latitude.toFixed(4)),
    });
  }
  return paikat;
}

console.log(`Haetaan ${LOYDOT.length} löytöpaikan koordinaatit Wikidatasta...`);
const paikat = await haeKoordinaatit(LOYDOT.map((l) => l.qid));

const puuttuu = LOYDOT.filter((l) => !paikat.has(l.qid));
for (const l of puuttuu) console.log(`  ${l.nimi} (${l.qid}): ei koordinaattia — jätetään pois`);

/*
 * ulkopuolella-lippu janan päiden yli meneville kohdille.
 *
 * Kaksi kohtaa ei mahdu janalle. Jebel Irhoud on 315 000 vuotta vanha eli
 * janan alkupistettä 300 000 vanhempi, ja Itä-Polynesia asutettiin
 * 1 000–700 vuotta sitten eli loppupistettä 3 000 nuorempana. Kumpaakaan
 * lukua ei pyöristetä janalle sopivaksi eikä kohtaa jätetä pois — ne ovat
 * olennaisia: toinen on lajimme vanhin luu ja toinen viimeinen asutettu
 * manner. Sen sijaan lippu kertoo piirtäjälle, että osuus on alle 0 tai
 * yli 1 ja kohta on käsiteltävä erikseen (esim. janan päähän
 * kiinnitettynä). Sama sääntö koskee sekä vaiheita että löytöjä.
 */
const janalta = (...osuudet) => osuudet.some((o) => o < 0 || o > 1);

const loydot = LOYDOT
  .filter((l) => paikat.has(l.qid))
  .map((l) => {
    const { lon, lat } = paikat.get(l.qid);
    const oma = osuus(l.ika);
    return {
      avain: l.qid,
      nimi: l.nimi,
      maa: l.maa,
      lon,
      lat,
      ika: l.ika,
      ...(l.pienin ? { pienin: l.pienin } : {}),
      ...(l.suurin ? { suurin: l.suurin } : {}),
      osuus: oma,
      ...(janalta(oma) ? { ulkopuolella: true } : {}),
      ajoitus: l.ajoitus,
      varmuus: l.varmuus,
      lahde: l.lahde,
      selite: l.selite,
    };
  })
  .sort((a, b) => b.ika - a.ika);

const vaiheet = VAIHEET.map((v) => {
  const osuusAlku = osuus(v.alkoi);
  const osuusLoppu = osuus(v.paattyi);
  return {
    avain: v.avain,
    nimi: v.nimi,
    alkoi: v.alkoi,
    paattyi: v.paattyi,
    osuusAlku,
    osuusLoppu,
    ...(janalta(osuusAlku, osuusLoppu) ? { ulkopuolella: true } : {}),
    ajoitus: v.ajoitus,
    varmuus: v.varmuus,
    ...(v.kiista ? { kiista: v.kiista } : {}),
    lahde: v.lahde,
    selite: v.selite,
    kaaret: v.kaaret,
  };
});

const aikapisteet = AIKAPISTEET.map((p) => ({
  vuotta: p.vuotta,
  teksti: luvuksi(p.vuotta),
  osuus: osuus(p.vuotta),
  iso: p.iso,
}));

const kiistellyt = [...vaiheet, ...loydot].filter((r) => r.varmuus === 'kiistelty').length;
const pisteita = vaiheet.reduce((s, v) => s + v.kaaret.reduce((k, c) => k + c.length, 0), 0);
console.log(`\n${vaiheet.length} vaihetta, ${pisteita} kaaripistettä`);
console.log(`${loydot.length} löytöpaikkaa`);
console.log(`${kiistellyt} kohtaa merkitty kiistellyksi`);

if (kuiva) process.exit(0);

const paiva = new Date().toLocaleDateString('fi-FI');
const rivit = (lista) => lista.map((r) => `  ${JSON.stringify(r)},`).join('\n');

const teksti = `// Ihmisen leviäminen Afrikasta: reitit, ajoitukset ja löytöpaikat.
//
// TÄMÄ TIEDOSTO ON KONEEN KIRJOITTAMA. Älä muokkaa käsin:
//   node tools/hae-leviaminen.mjs
//
// Aineisto: ajoitukset julkaistuista tutkimusartikkeleista (ks. rivien
//           lahde-kentät), löytöpaikkojen koordinaatit Wikidatasta (P625).
// Viite:    Jokaisella rivillä on oma viitteensä. Rungon muodostavat
//           Hublin ym. 2017 (Nature 546:289), Richter ym. 2017 (Nature
//           546:293), Vidal ym. 2022 (Nature 601:579), Hershkovitz ym.
//           2018 (Science 359:456), Groucutt ym. 2018 (Nature Ecology &
//           Evolution 2:800), Clarkson ym. 2017 (Nature 547:306), Hublin
//           ym. 2020 (Nature 581:299), Fu ym. 2014 (Nature 514:445),
//           Bennett ym. 2021 (Science 373:1528), Dillehay ym. 2008
//           (Science 320:784), Wilmshurst ym. 2011 (PNAS 108:1815) sekä
//           Iasi ym. 2024 (Science 386:eadq3010).
// Haettu:   https://www.wikidata.org/w/api.php (wbgetentities, avoin, ei
//           avainta) — ${paiva}. Ajoitukset on poimittu artikkeleista
//           käsin; koneluettavaa kokoavaa lähdettä ei ole olemassa.
// Lisenssi: Wikidatan koordinaatit CC0 1.0 (creativecommons.org/
//           publicdomain/zero/1.0/) — ei ehtoja. Ajoitusluvut ovat
//           lainauksia julkaistuista tutkimuksista, ja lähde on merkitty
//           jokaiselle riville erikseen.
//
// VAROITUS TULKINNASTA — LUE TÄMÄ ENNEN PIIRTÄMISTÄ.
//
// 1. KAARET EIVÄT OLE AINEISTOA. Kukaan ei tiedä mitä reittiä kuljettiin;
//    tiedetään vain, että jossain vaiheessa oltiin jossain. Kaaret on
//    piirretty käsin maantieteellisesti mahdollisten välipisteiden kautta,
//    jotta kartalla näkyisi suunta ja järjestys. Ne ovat havainnekuva,
//    eivät mitattu polku. Vain löytöpaikkojen koordinaatit ovat mitattuja.
//
// 2. AJOITUKSET MUUTTUVAT. Omo Kibishin ikä hyppäsi 195 000:sta
//    233 000:een vuonna 2022, ja Australian tulovuosi on yhä auki
//    65 000:n ja 50 000:n välillä. Jokaisella rivillä on siksi varmuus:
//      'vakiintunut'  tutkijakunta on laajasti yhtä mieltä
//      'kiistelty'    ajoituksesta tai tulkinnasta kiistellään yhä
//    Kiistellyillä riveillä on lisäksi kiista-kenttä, joka kertoo
//    suomeksi mistä nimenomaan kiistellään. Sitä ei saa jättää
//    näyttämättä: kiistellyn luvun esittäminen faktana on tässä
//    aiheessa se yleisin virhe.
//
// 3. VARHAISET RETKET EIVÄT OLE ESI-ISIÄ. Misliyan, Qafzehin ja
//    Al Wustan ihmiset olivat Afrikan ulkopuolella kymmeniätuhansia
//    vuosia ennen varsinaista leviämistä, mutta he eivät jättäneet
//    jälkeä nykyihmisten perimään. Aikajanalla ne näyttävät samalta
//    kuin pääaalto, vaikka tarina on eri.
//
// --- aikajana ---
//
// Jana on LOGARITMINEN. Haarukka on ${luvuksi(ALKU)} vuodesta ${luvuksi(LOPPU)} vuoteen eli
// yli satakertainen; lineaarisella janalla Eurooppa, Beringia, Amerikat
// ja Tyynimeri puristuisivat kaikki viimeiseen prosenttiin.
//
// Aineisto antaa valmiit osuudet, joten piirtäjän ei tarvitse laskea
// logaritmeja eikä tietää janan päistä:
//   osuus 0 = janan vanha pää (${luvuksi(ALKU)} vuotta sitten)
//   osuus 1 = janan nuori pää (${luvuksi(LOPPU)} vuotta sitten)
// Vaiheilla osuudet ovat osuusAlku ja osuusLoppu.
//
// Osuus voi olla ALLE 0 tai YLI 1: kaksi kohtaa ei mahdu janalle.
// Jebel Irhoud on 315 000 vuotta vanha eli janan alkupistettä vanhempi,
// ja Itä-Polynesia asutettiin vasta 1 000–700 vuotta sitten eli
// loppupistettä nuorempana. Kumpaakaan lukua ei ole siirretty janalle
// sopivaksi, vaan rivit on merkitty kentällä ulkopuolella: piirtäjä
// päättää, kiinnittääkö ne janan päähän vai jättääkö näyttämättä.
// Merkintä on sekä vaiheilla että löydöillä.
//
// aikapisteet ovat janan asteikkomerkit; iso: true erottaa pääviivat.
//
// --- kentät ---
//
//   vaiheet    avain, nimi, alkoi ja paattyi (vuotta ennen nykyaikaa,
//              alkoi aina suurempi), osuusAlku, osuusLoppu, ajoitus
//              (suomenkielinen teksti), varmuus, kiista, lahde, selite
//              ja kaaret.
//              kaaret on LISTA KAARIA, ei yksi kaari: useimpiin
//              vaiheisiin kuuluu monta suuntaa, eikä niitä saa yhdistää
//              yhdeksi viivaksi. Piste on [lon, lat].
//              Beringian, Kaukaisen Oseanian ja Itä-Polynesian kaaret
//              ylittävät 180. pituuspiirin, joten pituusaste hyppää
//              kesken kaaren arvosta 178 arvoon -179. Sauma on
//              käsiteltävä kuten muussakin aineistossa (tools/tee-maasto.mjs).
//
//   loydot     avain (Wikidatan Q-tunnus), nimi, maa, lon, lat, ika
//              (vuotta ennen nykyaikaa), pienin ja suurin haarukan päät
//              silloin kun lähde antaa haarukan, osuus, ajoitus,
//              varmuus, lahde ja selite. Järjestys on vanhimmasta
//              nuorimpaan. Vain lon ja lat ovat mitattuja: ne tulevat
//              Wikidatan P625-kentästä, muu on poimittu artikkeleista.
//
// ${vaiheet.length} vaihetta (${pisteita} kaaripistettä), ${loydot.length} löytöpaikkaa.
// Kiistellyksi merkittyjä kohtia ${kiistellyt}.

const AIKAJANA = ${JSON.stringify({ alku: ALKU, loppu: LOPPU, asteikko: 'logaritminen' })};

const AIKAPISTEET = [
${rivit(aikapisteet)}
];

const VAIHEET = [
${rivit(vaiheet)}
];

const LOYDOT = [
${rivit(loydot)}
];

export const LEVIAMINEN = {
  aikajana: AIKAJANA, aikapisteet: AIKAPISTEET, vaiheet: VAIHEET, loydot: LOYDOT,
};
`;

const ulos = join(JUURI, 'js/packs/linssi-leviaminen.js');
writeFileSync(ulos, teksti);
console.log(`\nkirjoitettu ${ulos} (${Math.round(teksti.length / 1024)} kt)`);
