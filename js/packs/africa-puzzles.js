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
// Sauva = 1, kantapääluu = 10, köysikiehkura = 100, lootus = 1000.

/** Pystysauva. */
const sauva = (x, y, p) => ink(`M${x},${y - 9} L${x},${y + 9}`, p);

/** Kantapääluu: ylösalaisin oleva kaari. */
const luu = (x, y, p) => ink(`M${x - 7},${y + 6} q7,-16 14,0`, p);

/** Köysikiehkura: kierre. */
const kiehkura = (x, y, p) =>
  ink(`M${x + 6},${y + 6} q-12,2 -11,-6 q1,-7 8,-6 q6,1 5,6 q-1,4 -5,3`, p);

/** Lootuksenkukka: varsi ja kolme terälehteä. */
const lootus = (x, y, p) => {
  ink(`M${x},${y + 8} L${x},${y - 1}`, p);
  ink(`M${x},${y - 1} q-9,-3 -7,-9 q5,1 7,5 q2,-6 7,-5 q2,6 -7,9`, p);
};

/** Rivi merkkejä vasemmalta oikealle; palauttaa rivin leveyden. */
function merkkirivi(parent, x, y, merkit) {
  merkit.forEach((piirra, i) => piirra(x + i * 15, y, parent));
  return merkit.length * 15;
}

/** Yksi hieroglyfiluku: merkit ja niiden alla arvo (tai kysymysmerkki). */
function luku(parent, x, y, merkit, arvo) {
  const leveys = merkkirivi(parent, x, y, merkit);
  text(x + leveys / 2 - 7, y + 30, arvo, parent);
}

// --- piirrokset -------------------------------------------------------------

const SKETCHES = {
  /**
   * Kairo: kolme lukua hieroglyfeinä arvoineen ja neljäs ilman arvoa.
   * Pelaaja päättelee järjestelmän esimerkeistä — merkkien arvoja ei kerrota.
   */
  hieroglyfit: (svg) => {
    const g = el('g', { transform: 'translate(14,34)' }, svg);
    luku(g, 0, 0, [sauva, sauva, sauva], '3');
    luku(g, 74, 0, [luu, luu, sauva], '21');
    luku(g, 158, 0, [kiehkura, luu], '110');
    // Neljäs on kysymys: köysikiehkura, kaksi luuta ja kaksi sauvaa.
    luku(g, 232, 0, [kiehkura, luu, luu, sauva, sauva], '?');
    ink('M0,52 L296,52', g);
  },

  /**
   * Kumasi: kaksivartinen vaaka. Vasemmalla kultahiekkapussi ja punnus,
   * oikealla punnuksia — mikä punnus tasapainottaa vaa'an?
   */
  punnukset: (svg, data = {}) => {
    // Luvut tulevat pulmadatasta, jottei piirros ja vaihtoehdot voi eriytyä.
    const { kulta = 12, vasen = 5, oikea = 9 } = data;
    const g = el('g', { transform: 'translate(160,26)' }, svg);
    // Jalusta ja vipuvarsi.
    ink('M0,88 L0,4 M-76,4 L76,4', g);
    fill('M-12,96 L12,96 L7,88 L-7,88 z', g);
    // Vaakakupit narujen varassa.
    ink('M-76,4 L-76,26 M76,4 L76,26', g);
    ink('M-100,26 q24,20 48,0 M52,26 q24,20 48,0', g);

    // Vasen kuppi: kultahiekkapussi ja punnus vierekkäin, omilla riveillään.
    fill('M-90,24 q-5,-15 7,-19 q9,-4 13,5 q4,10 -3,14 z', g);
    text(-84, 46, `kulta ${kulta}`, g, 11);
    el('rect', { x: -66, y: 8, width: 15, height: 15, rx: 2, class: 'ink' }, g);
    text(-58, 20, String(vasen), g, 11);

    // Oikea kuppi: tunnettu punnus ja kysytty punnus.
    el('rect', { x: 56, y: 8, width: 15, height: 15, rx: 2, class: 'ink' }, g);
    text(64, 20, String(oikea), g, 11);
    el('rect', {
      x: 80, y: 8, width: 15, height: 15, rx: 2, class: 'ink', 'stroke-dasharray': '3 3',
    }, g);
    text(88, 20, '?', g, 11);
  },

  /**
   * Kapkaupunki: kolme suun profiilia nuolineen. Kahdessa merkki näkyy,
   * kolmannessa kysymysmerkki — mikä merkki kuuluu kuvaan?
   */
  naksutus: (svg) => {
    /** Suun sivuprofiili: kitalaki, kieli ja hampaat. Nuoli osoittaa kohdan. */
    const suu = (x, merkki, kohta) => {
      const g = el('g', { transform: `translate(${x},30)` }, svg);
      // Kitalaki ja leuka.
      ink('M-26,0 q26,-10 52,4', g);
      ink('M-26,44 q26,10 52,-4', g);
      // Hampaat edessä.
      ink('M-26,0 L-26,10 M-26,44 L-26,34', g);
      // Kieli.
      fill('M-16,32 q16,-10 34,-4 q-14,10 -34,4 z', g);
      // Nuoli kosketuskohtaan: 0 = hampaat, 1 = poski, 2 = kitalaki.
      const kohdat = [[-24, 8], [4, 30], [6, 2]];
      const [nx, ny] = kohdat[kohta];
      ink(`M${nx - 14},${ny + 18} L${nx},${ny}`, g);
      fill(`M${nx},${ny} l-7,2 l3,5 z`, g);
      text(0, 68, merkki, g, 16);
    };
    suu(52, 'c', 0);
    suu(160, 'x', 1);
    suu(268, '?', 2);
  },

  /**
   * Timbuktu: käsikirjoitussivu, jolle on piirretty kuunvaiheiden sarja.
   * Neljäs on tyhjä — jatka sarjaa.
   */
  kuunvaiheet: (svg) => {
    const g = el('g', { transform: 'translate(0,12)' }, svg);
    // Käsikirjoitussivun reunus ja rivit.
    ink('M12,4 L308,4 L308,126 L12,126 z', g);
    ink('M24,18 L152,18 M24,26 L128,26', g);
    ink('M24,110 L296,110 M24,118 L240,118', g);

    /** Kuunvaihe: ympyrä, jonka valaistu osa on täytetty. */
    const kuu = (x, y, vaihe) => {
      ink(`M${x},${y - 18} a18,18 0 1,1 0,36 a18,18 0 1,1 0,-36`, g);
      if (vaihe === 'sirppi') fill(`M${x},${y - 18} a18,18 0 0,1 0,36 a9,18 0 0,0 0,-36 z`, g);
      if (vaihe === 'puoli') fill(`M${x},${y - 18} a18,18 0 0,1 0,36 z`, g);
    };
    kuu(56, 64, 'uusi');
    kuu(128, 64, 'sirppi');
    kuu(200, 64, 'puoli');
    // Neljäs paikka on tyhjä: katkoviivakehä ja kysymysmerkki.
    el('circle', {
      cx: 272, cy: 64, r: 18, class: 'ink', 'stroke-dasharray': '4 4',
    }, g);
    text(272, 70, '?', g, 18);
  },

  /**
   * Sahara: kaksi vesileiliä, 3 ja 5 mittaa. Mitta-asteikko näkyy kyljessä,
   * jotta tehtävän voi ratkaista pelkästä kuvasta.
   */
  vesileilit: (svg) => {
    /** Leili: pussimainen ääriviiva, kaula ja mitta-asteikko. */
    const leili = (x, mittoja, nimi) => {
      const g = el('g', { transform: `translate(${x},22)` }, svg);
      const h = 20 * mittoja;
      ink(`M-22,${100 - h} q-8,${h} 22,${h} q30,0 22,-${h} q-6,-14 -22,-14 q-16,0 -22,14`, g);
      // Kaula ja suu.
      ink(`M-8,${86 - h} L-8,${76 - h} q8,-5 16,0 L8,${86 - h}`, g);
      // Mitta-asteikko: yksi viiva mittaa kohti.
      for (let i = 1; i <= mittoja; i++) {
        const y = 100 - i * 20;
        ink(`M-18,${y} L-8,${y}`, g);
      }
      text(0, 118, nimi, g, 13);
    };
    leili(80, 3, '3 mittaa');
    leili(228, 5, '5 mittaa');
    text(160, 22, '= 4 ?', svg, 15);
  },
};

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
