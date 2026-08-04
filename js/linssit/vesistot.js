/*
 * Vesistölinssi: maailman joet ja järvet, ei mitään muuta.
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
 * --- miksi kartta himmenee alta ---
 *
 * Ensimmäinen kerros on vaalea pergamenttihuntu koko laudan yli. Se ei
 * ole koriste vaan koko linssin idea: ilman sitä uomat piirtyisivät
 * täyden kartan päälle, ja lopputulos olisi tarkalleen se sekavuus, jota
 * omistaja pyysi poistamaan. Hunnun alla mantereet näkyvät yhä — pelaaja
 * näkee missä joki kulkee — mutta ne eivät enää kilpaile.
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
 * kytketään päälle tästä linssistä (js/ui.js paivitaMaastonimet).
 */

import { el, kasinPiirretty, smoothOpenPath, smoothClosedPath } from '../mapart.js';

/*
 * Peittävyys: suunnitelman kova raja kaikille linsseille (luku 2.2
 * sääntö 4). Lento- ja laivareitit ovat linssin ALLA staattisessa
 * kerroksessa, eikä niitä voi nostaa elävään puuhun — täysin peittävä
 * linssi hävittäisi pelaajalta koko reittiverkon.
 */
const PEITTAVYYS = 0.72;

/*
 * VESI ILMAN SINISTÄ.
 *
 * Omistajan linjaus 4.8.2026: "Jätä sininen väri pois kaikista vesi
 * elementeistä." Se koski pohjakarttaa, mutta pätee tässä samasta
 * syystä: peli on seepiaa, ja sininen vesi näytti siinä liimatulta.
 * Vanha kaiverrettu vesistökartta on musteviivaa vaalealla paperilla,
 * ja se on tämän linssin esikuva.
 */
const HUNTU = '#e7d8b2';
const MUSTE = '#463b28';
const JARVEN_VESI = '#a08f6d';

/*
 * Viivanleveydet ruudun pikseleinä tärkeysluokan mukaan.
 *
 * Kolme luokkaa, koska aineistossa on kolme (js/packs/
 * maailmankartta-nimet.js tarkeys): 13 pääjokea, 71 keskisuurta ja 60
 * pientä. Suhde 2,6 : 1,7 : 1,1 on sama kuin kirjapainon viivaportailla
 * — pienempi ero ei erotu, suurempi tekisi pääjoista putkia.
 */
const LEVEYS = { 1: 2.6, 2: 1.7, 3: 1.1 };
const JARVEN_REUNA = 1.1;

let maasto = null;
let nimet = null;

export const LINSSI = {
  tunnus: 'vesistot',
  /*
   * Topografian (10) jälkeen. Molemmat kertovat maasta eivätkä
   * ihmisistä, ja vesistö on se, minkä topografia selittää: joki kulkee
   * siellä minne maa viettää. Ne kuuluvat valitsimessa vierekkäin.
   */
  jarjestys: 20,
  kerros: true,

  nimi: 'Vesistölinssi',
  lyhyt: 'Maailma vesistönä: joet ja järvet ilman muuta kartalla.',
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
   * kuin ei jokea.
   */
  laudat: ['maailmankartta'],

  lahde: {
    aineisto: 'Natural Earth 10m: ne_10m_rivers_lake_centerlines ja ne_10m_lakes '
      + '(Kaspianmeri ne_10m_ocean-aineistosta)',
    lisenssi: 'Public domain',
    osoite: 'https://www.naturalearthdata.com/downloads/10m-physical-vectors/',
    haettu: '2026-07-27',
  },

  /**
   * Vesistöaineisto ja nimipaketti (tärkeysluokat) valmiiksi. Molemmat
   * ovat pohjakartan omia moduuleja, joten ne ovat useimmiten jo
   * selaimen muistissa eikä lataus maksa mitään.
   */
  async lataa() {
    if (!maasto) {
      ({ MAAILMANKARTAN_MAASTO: maasto } = await import('../packs/maailmankartta-maasto.js'));
    }
    if (!nimet) {
      ({ MAAILMANKARTAN_NIMET: nimet } = await import('../packs/maailmankartta-nimet.js'));
    }
  },

  /**
   * Huntu, järvet ja joet — tässä järjestyksessä.
   *
   * Elementtejä on noin 210 (38 järveä + 169 jokea + huntu ja ryhmät),
   * eli reilusti alle moottorin rasterointirajan (LINSSIN_ELEMENTTIKATTO
   * = 400). Se on tarkoituksellista eikä sattumaa: rasteroituna
   * `non-scaling-stroke` paistuisi kuvaan yhdellä mittakaavalla ja
   * lähikuvassa jokiverkosto olisi sumea. Siksi järvi on YKSI polku
   * (täyttö ja reunaviiva samassa) ja joki YKSI veto — pohjakartan
   * kolmen vedon nauha (js/mapart.js drawLahivesi) olisi nostanut luvun
   * yli viiden sadan.
   */
  piirra(ryhma, tila) {
    if (!maasto) return false;
    const g = el('g', { opacity: PEITTAVYYS }, ryhma);

    /*
     * HUNTU KOKO LAUDAN YLI JA SEN ULKOPUOLELLE.
     *
     * Näkyvä alue ulottuu laudan ylä- ja alapuolelle: reunimmaiset
     * kaupungit on voitava panoroida yläpalkin ja alanappien alta esiin
     * (js/ui.js YLAKAISTA ja ALAKAISTA). Jos huntu loppuisi laudan
     * reunaan, kaistaan jäisi himmentämätön kaistale kirkasta merta —
     * sama vika korjattiin kerran topografialinssissä.
     *
     * Kaista on reilu: rajaus (js/ui.js `linssi-rajaus`) leikkaa
     * ylimääräisen pois, ja vaakasuunnassa se pitää kiertävän kartan
     * kopion päällekkäisyyden poissa.
     */
    el('rect', {
      x: 0,
      y: -tila.korkeus,
      width: tila.leveys,
      height: tila.korkeus * 3,
      fill: HUNTU,
      opacity: 0.82,
    }, g);

    /*
     * Järvet ensin, joet päälle. Joki laskee järveen, ja uoman on
     * jatkuttava rantaan asti — toisin päin järven täyttö katkaisisi
     * uoman juuri siitä kohtaa, jossa se on kiinnostavin.
     */
    const jarvet = el('g', {}, g);
    for (const jarvi of maasto.jarvet ?? []) {
      const rengas = jarvi.rengas ?? jarvi;
      if (!rengas || rengas.length < 4) continue;
      el('path', {
        d: smoothClosedPath(kasinPiirretty(rengas)),
        fill: JARVEN_VESI,
        stroke: MUSTE,
        'stroke-width': JARVEN_REUNA,
        'vector-effect': 'non-scaling-stroke',
      }, jarvet);
    }

    const jokiTarkeys = new Map((nimet?.joet ?? []).map((j) => [j.avain, j.tarkeys]));
    const joet = el('g', {
      fill: 'none',
      stroke: MUSTE,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }, g);
    for (const joki of maasto.joet ?? []) {
      const pisteet = joki.pisteet ?? joki;
      if (!pisteet || pisteet.length < 2) continue;
      el('path', {
        d: smoothOpenPath(kasinPiirretty(pisteet)),
        'stroke-width': LEVEYS[jokiTarkeys.get(joki.nimi) ?? 3] ?? LEVEYS[3],
        'vector-effect': 'non-scaling-stroke',
      }, joet);
    }
    return true;
  },

  selite() {
    return [
      { vari: MUSTE, teksti: 'Pääjoki, esimerkiksi Niili tai Amazon' },
      { vari: MUSTE, teksti: 'Sivujoki ja pienempi uoma' },
      { vari: JARVEN_VESI, teksti: 'Järvi tai suolainen sisämeri' },
      { vari: HUNTU, teksti: 'Manner himmennettynä taustaksi' },
    ];
  },
};
