// Isoisän luonnoskirjan pulmat (Afrikka).
//
// Pulma on päättelytehtävä tietovisan rinnalla: kortissa on piirros, isoisän
// käsin kirjoittama rivi ja neljä vaihtoehtoa. Pulma aukeaa kerran pelissä,
// kun kaupunkiin saavutaan ensimmäistä kertaa, eikä se koskaan estä
// etenemistä — väärästä vastauksesta ei rangaista, oikea ratkaisu näytetään.
//
// Piirrokset tehdään koodina: inline-SVG samalla mustetyylillä kuin kartan
// koristeet. EI ulkoisia kuvia eikä verkkohakuja, jotta standalone-versio ja
// offline toimivat.
//
// Tärkeintä: pulma on ratkaistavissa pelkästä piirroksesta. Hieroglyfipulmassa
// järjestelmä päätellään annetuista esimerkeistä, ei ennakkotiedosta.

import { el } from '../mapart.js';

const ink = (d, parent) => el('path', { d, class: 'ink' }, parent);
const fill = (d, parent) => el('path', { d, class: 'ink-fill' }, parent);
const text = (x, y, s, parent, size = 13) => {
  const t = el('text', { x, y, class: 'ink-text', 'font-size': size }, parent);
  t.textContent = s;
  return t;
};

// --- hieroglyfimerkit -------------------------------------------------------
// Sauva = 1, kaari (karjan jalkaköysi) = 10, köysikiehkura = 100. Arvoja ei
// kerrota pelaajalle: järjestelmä päätellään kolmesta esimerkkirivistä.

/** Pystysauva. */
const sauva = (x, y, p) => ink(`M${x},${y - 8} L${x},${y + 8}`, p);

/** Kaari: ylösalaisin oleva U. */
const kaari = (x, y, p) => ink(`M${x - 6},${y + 8} L${x - 6},${y - 2} q6,-9 12,0 L${x + 6},${y + 8}`, p);

/** Köysikiehkura: kaksikierroksinen spiraali. */
const kiehkura = (x, y, p) =>
  ink(`M${x + 7},${y + 5} q-13,3 -12,-6 q1,-8 9,-7 q7,1 6,7 q-1,5 -6,4 q-4,-1 -3,-4`, p);

// --- piirrokset -------------------------------------------------------------

const SKETCHES = {
  /**
   * Kairo: neljä lukua allekkain. Kolme ensimmäistä opettavat järjestelmän
   * arvoineen, neljäs kysyy. Merkit suurimmasta pienimpään vasemmalta
   * oikealle, jotta rivit ovat keskenään vertailukelpoisia.
   */
  hieroglyfit: (svg) => {
    const g = el('g', {}, svg);
    /** Yksi rivi: merkkiryhmä vasemmalle, arvo oikealle. */
    const rivi = (y, ryhmat, arvo) => {
      let x = 30;
      for (const [piirra, kpl] of ryhmat) {
        for (let i = 0; i < kpl; i++) {
          piirra(x, y, g);
          x += 16;
        }
        x += 8; // väli merkkilajien välissä
      }
      text(258, y + 5, arvo, g, 15);
    };
    rivi(22, [[sauva, 3]], '3');
    rivi(56, [[kaari, 2], [sauva, 3]], '23');
    rivi(90, [[kiehkura, 1], [kaari, 3], [sauva, 1]], '131');
    ink('M24,108 L286,108', g);
    rivi(132, [[kiehkura, 2], [kaari, 1], [sauva, 3]], '?');
  },

  /**
   * Kumasi: kaksivartinen vaaka tavoitetilassa eli tasan vaakasuorassa.
   * Luvut tulevat pulmadatasta, jottei piirros ja vaihtoehdot voi eriytyä.
   */
  punnukset: (svg, data = {}) => {
    const { kulta = 10, vasen = 2, oikea = [5, 4] } = data;
    const g = el('g', { transform: 'translate(160,20)' }, svg);
    // Tolppa, jalka ja vaakasuora varsi.
    ink('M0,96 L0,10 M-78,10 L78,10', g);
    fill('M-14,104 L14,104 L8,96 L-8,96 z', g);
    // Narut ja matalat vadit.
    ink('M-78,10 L-78,30 M78,10 L78,30', g);
    ink('M-104,30 q26,20 52,0 M52,30 q26,20 52,0', g);

    // Vasen vati: nyöritetty kultahiekkapussi ja yksi punnus.
    fill('M-96,30 q-6,-16 7,-20 q10,-4 14,6 q4,11 -4,14 z', g);
    ink('M-90,12 L-82,12', g);
    text(-86, 52, String(kulta), g, 12);
    el('rect', { x: -68, y: 14, width: 16, height: 16, class: 'ink' }, g);
    text(-60, 27, String(vasen), g, 12);

    // Oikea vati: kaksi tunnettua punnusta ja katkoviivalla kysytty.
    ink('M54,30 L70,30 L62,14 z', g);
    text(62, 27, String(oikea[0]), g, 11);
    ink('M78,22 L86,12 L94,22 L86,32 z', g);
    text(86, 26, String(oikea[1]), g, 11);
    el('rect', {
      x: 100, y: 14, width: 16, height: 16, class: 'ink', 'stroke-dasharray': '3 3',
    }, g);
    text(108, 27, '?', g, 12);
  },

  /**
   * Kapkaupunki: kolme suun poikkileikkausta samalla kaavalla. Piste kertoo
   * kosketuskohdan ja nuoli ilman purkaussuunnan. Kaikki kolme merkkiä
   * näkyvät — kysymys on, millä niistä sana isiXhosa alkaa.
   */
  naksutus: (svg) => {
    const suu = (x, merkki, kohta) => {
      const g = el('g', { transform: `translate(${x},14)` }, svg);
      // Kitalaki ja leuka; katse vasemmalle.
      ink('M-30,6 q30,-12 58,2', g);
      ink('M-30,52 q30,12 58,-4', g);
      // Ylähampaat edessä, poskihampaat takana.
      ink('M-26,6 L-26,15 M-20,7 L-20,16', g);
      ink('M8,3 L8,12 M16,4 L16,13', g);
      // Kieli.
      fill('M-20,40 q20,-12 40,-6 q-16,12 -40,6 z', g);

      // 0 = etuhampaat, 1 = poskihampaat sivulle, 2 = hammasvalli alas.
      if (kohta === 0) {
        el('circle', { cx: -24, cy: 14, r: 2.6, class: 'ink-fill' }, g);
        ink('M-30,22 L-46,22', g);
        fill('M-46,22 l7,-3 l0,6 z', g);
      } else if (kohta === 1) {
        el('circle', { cx: 10, cy: 14, r: 2.6, class: 'ink-fill' }, g);
        ink('M10,14 q10,-10 22,-14', g);
        fill('M32,0 l-7,1 l3,5 z', g);
      } else {
        el('circle', { cx: -6, cy: 12, r: 2.6, class: 'ink-fill' }, g);
        ink('M-6,16 L-6,34', g);
        fill('M-6,34 l-3,-7 l6,0 z', g);
      }
      text(0, 74, merkki, g, 17);
    };
    suu(56, 'c', 0);
    suu(160, 'x', 1);
    suu(264, 'q', 2);
  },

  /**
   * Timbuktu: käsikirjoitussivu ja kuunvaiheiden sarja. Pimeä osa on
   * varjostettu, valaistu jätetty tyhjäksi. Valaistu reuna kasvaa oikealta,
   * kuten pohjoisella pallonpuoliskolla.
   */
  kuunvaiheet: (svg) => {
    const g = el('g', {}, svg);
    // Kaksoisviivakehys.
    ink('M10,6 L310,6 L310,144 L10,144 z', g);
    ink('M15,11 L305,11 L305,139 L15,139 z', g);
    // Käsinkirjoitetut rivit oikealta vasemmalle, alin lyhyempi.
    ink('M120,26 q30,4 60,0 q40,-4 100,0', g);
    ink('M120,36 q30,4 60,0 q40,-4 100,0', g);
    ink('M186,46 q24,4 48,0 q30,-4 46,0', g);
    // Nelisakaraiset tähdet yläkulmissa.
    for (const [sx, sy] of [[32, 26], [288, 26]]) {
      ink(`M${sx},${sy - 6} L${sx},${sy + 6} M${sx - 6},${sy} L${sx + 6},${sy}`, g);
    }

    /**
     * Kuunvaihe: pimeä osa varjostetaan ohuilla viivoilla, valaistu jää
     * tyhjäksi. `valaistu` on 0…1 oikeasta reunasta lukien.
     */
    const kuu = (cx, valaistu) => {
      const r = 20;
      const cy = 92;
      el('circle', { cx, cy, r, class: 'ink' }, g);
      if (valaistu >= 1) return;
      // Varjostus rajataan kuun pimeään osaan leikkauspolulla.
      const raja = cx + r - 2 * r * valaistu;
      const id = `kuu-${cx}`;
      const clip = el('clipPath', { id }, g);
      if (valaistu <= 0) {
        el('circle', { cx, cy, r, class: '' }, clip);
      } else {
        el('path', {
          d: `M${cx},${cy - r} a${r},${r} 0 0,0 0,${2 * r} L${raja},${cy + r} `
            + `a${r * (1 - 2 * valaistu)},${r} 0 0,${valaistu < 0.5 ? 0 : 1} 0,${-2 * r} z`,
        }, clip);
      }
      const varjo = el('g', { 'clip-path': `url(#${id})` }, g);
      for (let y = cy - r; y <= cy + r; y += 4) {
        ink(`M${cx - r},${y} L${cx + r},${y}`, varjo);
      }
    };
    kuu(70, 0);      // uusikuu: kokonaan pimeä
    kuu(130, 0.18);  // kasvava sirppi
    kuu(190, 0.5);   // puolikuu
    // Neljäs: tyhjä kehä ja kysymysmerkki.
    el('circle', { cx: 250, cy: 92, r: 20, class: 'ink' }, g);
    text(250, 99, '?', g, 20);
    ink('M50,124 L270,124', g);
  },

  /**
   * Sahara: kaksi nahkaleiliä, 3 ja 5 mittaa. EI asteikkoa eikä poikkiviivoja
   * kyljissä — koko pulman idea on, ettei leileistä voi lukea välimittoja.
   */
  vesileilit: (svg) => {
    /** Leili: pussimainen vartalo, kapea kaula ja kantolenkit. */
    const leili = (x, y, koko, merkki) => {
      const g = el('g', { transform: `translate(${x},${y}) scale(${koko})` }, svg);
      ink('M0,-26 q-30,6 -30,30 q0,26 30,26 q30,0 30,-26 q0,-24 -30,-30 z', g);
      // Kaula ja nyöri suulla.
      ink('M-7,-27 L-7,-40 q7,-4 14,0 L7,-27', g);
      ink('M-9,-38 q9,5 18,0', g);
      // Kantolenkit kyljissä.
      ink('M-30,0 q-7,4 0,8 M30,0 q7,4 0,8', g);
      text(0, 12, merkki, g, 22);
    };
    leili(78, 62, 0.78, '3');
    leili(226, 56, 1, '5');
    // Tavoite ympyröitynä leilien alle.
    el('circle', { cx: 160, cy: 132, r: 14, class: 'ink' }, svg);
    text(160, 139, '4', svg, 17);
  },
};


/**
 * Afrikan viisi pulmaa. `sketch` välitetään piirrokselle, jotta piirroksen
 * luvut tulevat samasta paikasta kuin vastausvaihtoehdot.
 */
export const AFRICA_PUZZLES = [
  {
    id: 'hieroglyfit',
    city: 'kairo',
    title: 'Hieroglyfien luvut',
    q: 'Temppelin seinään on hakattu lukuja, ja opas luki kolme niistä minulle ääneen. Neljättä hän ei lukenut — sanoi, että pärjään kyllä itsekin.',
    options: ['312', '2103', '213', '231'],
    correct: 2,
    fact: 'Sauva on 1, kaari — karjan jalkaköysi — on 10 ja köysikiehkura 100. Merkkejä ei aseteta paikoilleen vaan lasketaan yhteen, joten kaksi kiehkuraa, yksi kaari ja kolme sauvaa tekevät 213. Nollaa ei ole eikä paikka-arvoa, mikä on nokkelaa pienillä luvuilla ja tuskaista suurilla: miljoonaan riittää yksi merkki, mutta lukuun 999 999 tarvitaan viisikymmentäneljä.',
    source: [
      'https://en.wikipedia.org/wiki/Egyptian_numerals',
      'MacTutor, University of St Andrews: Egyptian numerals',
    ],
  },
  {
    id: 'punnukset',
    city: 'kumasi',
    title: 'Kultapunnusten vaaka',
    q: 'Kauppias punnitsee kultahiekkaa messinkipunnuksilla, joiden arvot hän tuntee ulkoa. Toinen vati on valmis, toisesta puuttuu vielä yksi punnus — mikä?',
    options: ['2', '3', '4', '6'],
    correct: 1,
    sketch: { kulta: 10, vasen: 2, oikea: [5, 4] },
    fact: 'Vasemmalla on 10 + 2 = 12, joten oikealle tarvitaan 5 + 4 + 3. Akanien kultapunnukset — abrammuo — valettiin messingistä kadotetun vahan menetelmällä, ja täydessä sarjassa oli yli kuusikymmentä eri arvoa. Kultahiekka oli maksuväline, ja punnusten muotoihin valettiin sananlaskuja, joten esine oli yhtä aikaa mitta ja muistisääntö.',
    source: [
      'https://en.wikipedia.org/wiki/Akan_goldweights',
      'Maxwell Museum, University of New Mexico: Asante Gold Weights',
    ],
  },
  {
    id: 'naksutus',
    city: 'kapkaupunki',
    title: 'Kolme naksausta',
    q: 'Piirsin muistiin kolme kohtaa, joista kieli irtoaa naksahtaen; jokaisella on oma kirjaimensa. Kansa kutsuu itseään nimellä isiXhosa — millä näistä nimi alkaa?',
    options: [
      'c — kielen kärki etuhampailta',
      'q — kielen kärki hammasvallilta',
      'c — kielen sivu poskihampailta',
      'x — kielen sivu poskihampailta',
    ],
    correct: 3,
    fact: 'Xhosan kolme naksausta eroavat toisistaan vain irrotuspaikan mukaan: c on dentaalinen (kielen kärki ylähampaiden takana, kuin paheksuva "ts"), x on lateraalinen (ilma purkautuu kielen sivulta, kuin hevosta kannustettaessa) ja q on postalveolaarinen (kielen kärki hammasvallilla, vedetään alas, poksahtaa kuin korkki). Nimi isiXhosa alkaa lateraalisella naksauksella. Isoisä kirjoitti muistiin kolme kuvaa ja luuli sitä kieliopiksi.',
    source: [
      'https://en.wikipedia.org/wiki/Xhosa_language',
      'https://en.wikipedia.org/wiki/Lateral_click',
    ],
  },
  {
    id: 'kuunvaiheet',
    city: 'timbuktu',
    title: 'Kuu käsikirjoituksen sivulla',
    q: 'Kirjaston mestari käänsi eteeni sivun, jolle kuu on piirretty neljä kertaa peräkkäin. Kolme ensimmäistä ymmärrän; neljäs on jätetty tyhjäksi, ja hän odottaa minun sanovan sen ääneen.',
    options: ['kasvava kupera kuu', 'täysikuu', 'kasvava sirppi', 'vähenevä puolikuu'],
    correct: 0,
    fact: 'Sarja etenee neljänneksittäin: pimeä uusikuu, kasvava sirppi, puolikuu — ja seuraavana kasvava kupera kuu, jossa yli puolet kiekosta on valaistu mutta reuna ei ole vielä täysi. Timbuktussa tähtitiede ei ollut koristetta: kaupungin kirjastoissa on käsikirjoituksia, joissa opetetaan laskemaan vuodenaikojen alut tähtien liikkeistä. Isoisän klubilla kaupungin nimeä käytettiin tarkoittamaan paikkaa, jota ei ole; samassa paikassa käytiin oppikirjaa läpi rivi riviltä.',
    source: [
      'Library of Congress: Ancient Manuscripts from the Desert Libraries of Timbuktu',
    ],
  },
  {
    id: 'vesileilit',
    city: 'sahara',
    title: 'Neljä mittaa vettä',
    q: 'Leilejä on kaksi, toiseen menee kolme mittaa ja toiseen viisi, eikä kummankaan kyljessä ole yhtään viivaa. Oppaani tarvitsee tasan neljä ennen kuin lähdemme.',
    options: [
      'Täytä 3, kaada 5:een, täytä 3, kaada 5 täyteen, tyhjennä 5, kaada loput viitoseen',
      'Täytä 5, kaada 3 täyteen, tyhjennä 5, kaada 3 viitoseen',
      'Täytä 5, kaada 3 täyteen, tyhjennä 3, kaada loput 3:een, täytä 5, kaada 3 täyteen',
      'Täytä 5, kaada 3 täyteen, tyhjennä 3, kaada loput 3:een, täytä 3',
    ],
    correct: 2,
    fact: 'Kun täydestä viitosesta kaadetaan kolmonen täyteen, viitoseen jää 2. Tyhjennä kolmonen, siirrä ne kaksi mittaa sinne ja täytä viitonen uudelleen: kolmoseen mahtuu enää yksi, ja viitoseen jää tasan neljä. Muut sarjat päätyvät yhteen, kolmeen tai viiteen mittaan — ne eivät ole vääriä kaatoja, ne vain loppuvat väärään lukuun. Karavaanissa vesi mitataan tarkkaan, koska seuraava kaivo on siellä missä se on, ei siellä missä isoisän kartassa lukee.',
    source: 'Klassinen kahden astian mittapulma',
  },
];

/**
 * Piirtää pulman luonnoksen annettuun SVG-elementtiin. `data` välitetään
 * piirrokselle, jotta luvut tulevat pulmadatasta eivätkä piirroskoodista —
 * näin piirros ja vastausvaihtoehdot eivät voi eriytyä toisistaan.
 */
export function drawPuzzle(svg, id, data) {
  SKETCHES[id]?.(svg, data);
}

/** Onko pulmalle olemassa piirros? Testit vartioivat tätä. */
export function hasSketch(id) {
  return typeof SKETCHES[id] === 'function';
}
