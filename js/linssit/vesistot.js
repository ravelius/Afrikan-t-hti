/*
 * Vesistölinssi: maailman joet ja järvet reliefikartan päällä.
 *
 * Omistajan päätös 4.8.2026: *"Ota joet pois kokonaan. Täytyy tehdä
 * niistä vaikka oma linssi, missä näkyisi vain pelkät joet ja järvet.
 * Nykyinen on liian sekava."*
 *
 * Joet olivat pohjakartalla samaan aikaan kaiken muun kanssa, ja
 * kartasta tuli sotkuinen juuri siksi: uoma, rannikko, korkeusvyöhyke,
 * reitti ja kaupunki kilpailivat samasta viivasta. Linssi ratkaisee sen
 * kysymyksen kääntämällä sen ympäri — kun pelaaja NOSTAA lasit
 * silmilleen, hän kysyy nimenomaan vesistöä, ja silloin kaikki muu saa
 * väistyä.
 *
 * --- miksi pohjana on topografia eikä pergamentti ---
 *
 * Ensimmäinen versio himmensi kartan vaalealla pergamenttihunnulla.
 * Huntu teki tehtävänsä (uomat erottuivat) mutta hukkasi kaksi asiaa:
 * meret jäivät tyhjäksi paperiksi, eikä kartasta näkynyt MIKSI joki
 * kulkee juuri siinä.
 *
 * Omistaja 5.8.2026: *"koko Jokilinssin voisi itse asiassa rakentaa
 * topografiakartan päälle. Silloin saataisiin meretkin hienosti
 * näkyviin. Jolloin myös joet voisivat olla sinisen eri sävyissä."*
 *
 * Se on sama havainto kuin topografialinssin omassa kuvauksessa:
 * vesistö on se, minkä topografia selittää — joki laskee sinne minne
 * maa viettää. Kun laakso näkyy uoman alla, kartta perustelee itsensä.
 * Pohja piirretään topografialinssin omalla funktiolla
 * (js/linssit/topografia.js piirraReliefi), joten kaksi linssiä jakaa
 * yhden kuvan ja yhden tavan piirtää se.
 *
 * Reliefikuvan meri on sinistä, joten sininen joki on nyt kartan omaa
 * kieltä eikä päälle liimattu poikkeus. Pohjakartan seepiasääntö
 * ("jätä sininen pois vesielementeistä") koskee peruspeliä, ei tätä
 * kuvaa — täysväri linssiin oli sama omistajan päätös 4.8.2026.
 *
 * --- miksi viivanleveys on pikseleitä eikä laudan yksiköitä ---
 *
 * Pohjakartan uomat mitattiin laudan yksiköissä, jolloin ne levenevät
 * kartan mukana. Se on oikein maastolle, mutta väärin tälle linssille:
 * linssi piirretään KERRAN eikä zoomin mukana (js/linssit/kerros.js
 * piirtää kerroksen linssiä vaihdettaessa), joten laudan yksiköissä
 * annettu uoma olisi maailmankuvassa alle pikselin levyinen ja
 * kaupunkikuvassa nauha. Mitattu: lauta on 12000 yksikköä leveä, joten
 * maailmankuvassa yksi pikseli on noin kymmenen yksikköä.
 *
 * `vector-effect="non-scaling-stroke"` pitää viivan samanlevyisenä
 * ruudulla riippumatta zoomista. Vesistökartta on verkosto, ei maasto:
 * verkoston viiva on merkintä eikä mitta, ja merkinnän kuuluukin pysyä
 * samankokoisena. Sama valinta on tehty kaikissa metrokartoissa.
 *
 * --- nimet eivät ole tässä ---
 *
 * Jokien nimet piirtyvät kartan omaan maastonimikerrokseen
 * (js/mapart.js drawMaastonimet), joka piirretään uudelleen jokaisella
 * zoomilla ja osaa siksi näyttää nimen oikean kokoisena ja vain silloin
 * kun se on luettava. Täällä ne olisivat jäätyneet yhteen kokoon. Kerros
 * kytketään päälle tästä linssistä (js/ui.js paivitaMaastonimet), ja
 * sen sävyt hoitaa css/styles.css `body.linssi-vesistot`: kaupunkien
 * nimet ja pallot haalistuvat, jokien nimet tummuvat.
 */

import { el, kasinPiirretty, smoothOpenPath, smoothClosedPath } from '../mapart.js';
import { lataaReliefi, piirraReliefi } from './topografia.js';

/*
 * Peittävyys: suunnitelman kova raja kaikille linsseille (luku 2.2
 * sääntö 4). Lento- ja laivareitit ovat linssin ALLA staattisessa
 * kerroksessa, eikä niitä voi nostaa elävään puuhun — täysin peittävä
 * linssi hävittäisi pelaajalta koko reittiverkon.
 */
const PEITTAVYYS = 0.72;

/*
 * Vesistö piirretään pohjaa peittävämpänä (0,94).
 *
 * Raja 0,72 on olemassa siksi, että KARTTA näkyisi linssin läpi. Uoma
 * on tässä linssissä se asia, jota katsotaan, eikä se saa kadota
 * reliefin kirjavuuteen: 0,72:lla ohut sivujoki sekoittui Andien
 * ruskeaan. Reitit näkyvät yhä pohjan läpi, koska pohja on se kerros,
 * joka noudattaa rajaa — joet ovat viivoja, eivät peitettä.
 */
const VESI_PEITTO = 0.94;

/*
 * Varapergamentti.
 *
 * Käytössä vain jos reliefikuva puuttuu tai lauta ei täsmää kuvan
 * rajasuorakulmioon (ks. piirra). Linssi ei saa kaatua siihen: joet ja
 * järvet ovat sen sisältö, pohja on sen tausta.
 */
const HUNTU = '#e7d8b2';

/*
 * SININEN VIIVA JA SEN VARJO.
 *
 * Kolmiulotteisuus tehdään kahdella vedolla samaa polkua: leveämpi
 * tumma penger alle ja kapeampi kirkas uoma päälle. Silmä lukee parin
 * uraksi, ei kahdeksi viivaksi — sama kuvio on kaiverretuissa
 * merikartoissa ja pohjakartan omassa lähivedessä (js/mapart.js
 * drawLahivesi).
 *
 * Varjo ei ole suodatin eikä siirretty kopio: molemmat olisivat
 * kiellettyjä (suodatin) tai kaksinkertaistaisivat elementtimäärän
 * ilman, että ura paranisi. Sama polku kahdesti riittää, koska
 * `stroke-linejoin: round` pyöristää molemmat reunat samalla tavalla.
 *
 * Sävyt on poimittu reliefikuvan omasta merestä (mitattu
 * assets/linssit/topografia.webp: avomeri 57,104,165, syvänne
 * 29,62,124), jotta joki ja meri ovat samaa vettä. Uoma on merta
 * vaaleampi, koska joki on matala ja kirkas — ja koska vaalea viiva
 * erottuu sekä vihreältä alangolta että ruskealta vuorelta.
 */
const PENGER = '#123f68';
const UOMA = { 1: '#5aa9e0', 2: '#4a95d0', 3: '#3c82be' };
const JARVEN_VESI = '#3b7db5';

/*
 * Viivanleveydet ruudun pikseleinä tärkeysluokan mukaan.
 *
 * Kolme luokkaa, koska aineistossa on kolme (js/packs/
 * maailmankartta-nimet.js tarkeys): 13 pääjokea, 71 keskisuurta ja 85
 * pientä. Suhde on sama kuin kirjapainon viivaportailla — pienempi ero
 * ei erotu, suurempi tekisi pääjoista putkia.
 *
 * PENGER ON UOMA + 3 PIKSELIÄ, siis 1,5 pikseliä kummallakin puolella.
 * Ensin kokeiltiin kaksinkertaista leveyttä (2,6 / 5,0), ja mitattuna
 * ruudulla pari suli yhdeksi siniseksi viivaksi: 1,2 pikselin reuna on
 * tavallisella näytöllä alle kokonaisen pikselin ja sekoittuu uoman
 * sävyyn. 1,5 pikseliä piirtyy.
 *
 * PENGER VAIN KAHDELLE YLIMMÄLLE LUOKALLE. Luokan 3 uoma on 1,3
 * pikseliä, ja sama 3 pikselin lisäys tekisi siitä 4,3 leveän eli
 * leveämmän kuin luokan 2 koko uran. Tärkeysjärjestys katoaisi juuri
 * siitä syystä, jonka takia luokkia on kolme. Sivutuotteena
 * elementtimäärä pysyy reilusti katon alla (ks. piirra).
 */
const LEVEYS = {
  1: { uoma: 3.0, penger: 7.0 },
  2: { uoma: 2.0, penger: 5.0 },
  3: { uoma: 1.3, penger: 0 },
};
const JARVEN_REUNA = 1.4;

let maasto = null;
let nimet = null;
let kuvatiedot = null;

export const LINSSI = {
  tunnus: 'vesistot',
  /*
   * Topografian (10) jälkeen. Molemmat kertovat maasta eivätkä
   * ihmisistä, ja vesistö on se, minkä topografia selittää: joki kulkee
   * siellä minne maa viettää. Ne kuuluvat valitsimessa vierekkäin, ja
   * nyt myös jakavat pohjakuvan.
   */
  jarjestys: 20,
  kerros: true,

  nimi: 'Vesistölinssi',
  lyhyt: 'Joet ja järvet maaston päällä: vesi näkyy siellä minne maa viettää.',
  /*
   * Mutkitteleva joki ja järvi sen varrella. Ei pisaraa eikä aaltoa:
   * kuvakkeen on kerrottava mitä linssi NÄYTTÄÄ, ja tämä linssi näyttää
   * uomia. 24×24 viivapolkuja ilman <svg>-kuorta, kuten muillakin.
   */
  ikoni: '<path d="M4 3.2c0 3.4 3.4 3.9 3.4 7.1 0 3.2-3.4 3.7-3.4 7 0 2 1.2 3.1 3 3.5"/>'
    + '<path d="M13.2 8.6c2.1-.9 4.6-.5 5.9.9 1.4 1.6 1 3.9-.8 5-1.9 1.1-4.6.8-6-.7'
    + '-1.3-1.4-1-3.4.9-5.2z"/>',

  /*
   * Vain maailmankartalla. Aineisto on projisoitu tälle laudalle
   * (tools/hae-vedet.mjs), ja väärässä paikassa oleva joki on pahempi
   * kuin ei jokea. Sama koskee reliefipohjaa.
   */
  laudat: ['maailmankartta'],

  /*
   * valokuva: true ottaa paperin rakeisuuden pois linssin päältä
   * (css/styles.css: body.linssi-valokuva .grain). Sama syy kuin
   * topografialinssissä, ja nyt sama kuva: rakeisuus sekoittuu
   * KERTOLASKULLA, joten se jää linssin päälle ja vetäisi
   * täysvärireliefin ruskeaksi. Sininen joki ruskean seulan alla ei ole
   * enää sininen.
   */
  valokuva: true,

  lahde: {
    aineisto: 'Natural Earth 10m: ne_10m_rivers_lake_centerlines ja ne_10m_lakes '
      + '(Kaspianmeri ne_10m_ocean-aineistosta); pohjana NOAA NGDC ETOPO1',
    lisenssi: 'Public domain',
    osoite: 'https://www.naturalearthdata.com/downloads/10m-physical-vectors/',
    haettu: '2026-07-27',
  },

  /**
   * Vesistöaineisto, nimipaketti (tärkeysluokat) ja reliefipohja
   * valmiiksi. Kaksi ensimmäistä ovat pohjakartan omia moduuleja, joten
   * ne ovat useimmiten jo selaimen muistissa eikä lataus maksa mitään.
   *
   * Reliefin lataus ei saa kaataa linssiä: ilman kuvaa piirretään
   * pergamenttihuntu, ja joet näkyvät yhä.
   */
  async lataa() {
    if (!maasto) {
      ({ MAAILMANKARTAN_MAASTO: maasto } = await import('../packs/maailmankartta-maasto.js'));
    }
    if (!nimet) {
      ({ MAAILMANKARTAN_NIMET: nimet } = await import('../packs/maailmankartta-nimet.js'));
    }
    try {
      kuvatiedot = await lataaReliefi();
    } catch {
      kuvatiedot = null;
    }
  },

  /**
   * Pohja, järvet ja joet — tässä järjestyksessä.
   *
   * ELEMENTTIMÄÄRÄ ON MITOITETTU, EI SATTUMA. Moottori muuttaa linssin
   * yhdeksi kuvaksi, jos elementtejä on yli LINSSIN_ELEMENTTIKATTO =
   * 400 — ja rasteroitu SVG ajetaan blob-hiekkalaatikossa, joka EI hae
   * ulkoisia osoitteita (suunnitelma luku 1.7). Rasteroituna
   * reliefikuva palauttaisi läpinäkyvän tyhjän, ja pohja katoaisi ilman
   * yhtäkään virhettä lokissa.
   *
   * Laskenta: pohja 7 (kaksi rajausta, kaksi suorakulmiota, kolme
   * kuvaa) + 38 järveä + 84 penkereen vetoa (luokat 1 ja 2) + 169 uomaa
   * + neljä ryhmää = 302. Katto on 400, joten aineisto saa kasvaa
   * kolmanneksen ennen kuin tämä on mietittävä uudelleen.
   */
  piirra(ryhma, tila) {
    if (!maasto) return false;

    /*
     * POHJA: reliefi, tai pergamentti jos kuva puuttuu.
     *
     * Rajatarkistus on sama kuin topografialinssissä: jos lauta on
     * vaihtunut kuvan tekemisen jälkeen, kuva peittäisi kartan mutta
     * mantereet olisivat väärässä kohdassa. Tässä linssissä se ei
     * kelpaa piilottamisen syyksi — joet ovat oikeassa paikassa joka
     * tapauksessa, joten pohja vaihtuu hunnuksi ja linssi jää päälle.
     */
    const raja = kuvatiedot?.raja;
    const sopiiLautaan = raja && raja.leveys === tila.leveys && raja.korkeus === tila.korkeus;
    if (sopiiLautaan) {
      piirraReliefi(ryhma, raja, kuvatiedot.kuva, PEITTAVYYS, 'vesi');
    } else {
      /*
       * HUNTU KOKO LAUDAN YLI JA SEN ULKOPUOLELLE.
       *
       * Näkyvä alue ulottuu laudan ylä- ja alapuolelle: reunimmaiset
       * kaupungit on voitava panoroida yläpalkin ja alanappien alta
       * esiin (js/ui.js YLAKAISTA ja ALAKAISTA). Jos huntu loppuisi
       * laudan reunaan, kaistaan jäisi himmentämätön kaistale kirkasta
       * merta.
       */
      el('rect', {
        x: 0,
        y: -tila.korkeus,
        width: tila.leveys,
        height: tila.korkeus * 3,
        fill: HUNTU,
        opacity: PEITTAVYYS * 0.82,
      }, ryhma);
    }

    const g = el('g', { opacity: VESI_PEITTO }, ryhma);

    /*
     * Järvet ensin, joet päälle. Joki laskee järveen, ja uoman on
     * jatkuttava rantaan asti — toisin päin järven täyttö katkaisisi
     * uoman juuri siitä kohtaa, jossa se on kiinnostavin.
     *
     * Järvi on YKSI polku: täyttö ja tumma reuna samassa. Reuna tekee
     * järvelle saman kuin penger joelle — se laskee rannan varjoon ja
     * nostaa vesipinnan muodoksi.
     */
    const jarvet = el('g', {
      fill: JARVEN_VESI,
      stroke: PENGER,
      'stroke-width': JARVEN_REUNA,
      'vector-effect': 'non-scaling-stroke',
    }, g);
    for (const jarvi of maasto.jarvet ?? []) {
      const rengas = jarvi.rengas ?? jarvi;
      if (!rengas || rengas.length < 4) continue;
      el('path', { d: smoothClosedPath(kasinPiirretty(rengas)) }, jarvet);
    }

    /*
     * KAKSI RYHMÄÄ, EI KAHTA VETOA PERÄKKÄIN.
     *
     * Kaikki penkereet piirretään ensin ja kaikki uomat vasta sitten.
     * Jos pari piirrettäisiin joki kerrallaan, seuraavan joen tumma
     * penger leikkaisi edellisen kirkkaan uoman poikki jokaisessa
     * yhtymäkohdassa — ja yhtymäkohta on juuri se paikka, jossa
     * vesistön pitää näyttää yhtenäiseltä.
     */
    const jokiTarkeys = new Map((nimet?.joet ?? []).map((j) => [j.avain, j.tarkeys]));
    const yhteiset = {
      fill: 'none',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'vector-effect': 'non-scaling-stroke',
    };
    const penkat = el('g', { ...yhteiset, stroke: PENGER }, g);
    const uomat = el('g', yhteiset, g);

    for (const joki of maasto.joet ?? []) {
      const pisteet = joki.pisteet ?? joki;
      if (!pisteet || pisteet.length < 2) continue;
      // Polku lasketaan kerran ja käytetään molemmissa vedoissa.
      const d = smoothOpenPath(kasinPiirretty(pisteet));
      const luokka = jokiTarkeys.get(joki.nimi) ?? 3;
      const mitat = LEVEYS[luokka] ?? LEVEYS[3];
      if (mitat.penger) el('path', { d, 'stroke-width': mitat.penger }, penkat);
      el('path', {
        d,
        stroke: UOMA[luokka] ?? UOMA[3],
        'stroke-width': mitat.uoma,
      }, uomat);
    }
    return true;
  },

  selite() {
    return [
      { vari: UOMA[1], teksti: 'Pääjoki, esimerkiksi Niili tai Amazon' },
      { vari: UOMA[3], teksti: 'Sivujoki ja pienempi uoma' },
      { vari: JARVEN_VESI, teksti: 'Järvi tai suolainen sisämeri' },
      { vari: '#3968a5', teksti: 'Meri ja valtameri' },
      { vari: '#3e6e42', teksti: 'Alanko, jonne joet laskevat' },
      { vari: '#94623e', teksti: 'Vuoristo, josta joet saavat alkunsa' },
    ];
  },
};
