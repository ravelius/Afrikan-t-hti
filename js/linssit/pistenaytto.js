/*
 * PISTENÄYTTÖ — nestekidenäyttö, jonka kirjaimet koostuvat pisteistä.
 *
 * Maailmanradion soittimen näyttö. Kanavan nimi ei tule sivun fontilla
 * vaan piirtyy pisteruudukkoon kuten vanhassa nestekidenäytössä tai
 * asemalaiturin ilmoitustaulussa: jokainen kirjain on 5 × 7 pyöreää
 * pistettä, ja pisteet ovat paikoillaan myös silloin kun ne eivät pala.
 *
 * SAMMUNEET PISTEET OVAT KOKO TEMPPU. Jos ruudukkoon piirretään vain
 * palavat pisteet, tulos on outo rakeinen fontti. Kun sammuneet pisteet
 * ovat näkyvissä himmeinä, silmä näkee laitteen: ruudukon, jonka osa
 * lampuista on sytytetty. Siksi jokaiseen ruutuun piirretään ympyrä
 * riippumatta siitä palaako se.
 *
 * EI SUODATTIMIA. Ei feGaussianBlur-hehkua, ei feDropShadow-syvyyttä.
 * iOS:n webapp-tila palauttaa suodatetun SVG-kerroksen TYHJÄNÄ sen
 * jälkeen kun sovellus on käynyt taustalla; tämä on rikkonut kartan
 * kolmesti (js/mapart.js 72–91, js/linssit/kerros.js 228–249). Näyttö,
 * joka on tyhjä juuri kun pelaaja katsoo sitä, on pahempi kuin näyttö
 * ilman hehkua.
 *
 * EI TUONTEJA. Moduuli ei tuo edes js/mapart.js:n el()-apuria, vaikka
 * se tekisi saman kolmella rivillä. Syy on kaksi: näyttö on soittimen
 * osa eikä karttakerros, joten se ei tarvitse karttamoduulia mihinkään,
 * ja ilman tuonteja tämän voi ajaa ja testata pelkällä DOM-tyngällä
 * (tests/pistenaytto.test.mjs).
 *
 * KAIKKI VÄRIT ATTRIBUUTTEINA, EI LUOKKINA. Sama sääntö kuin linsseillä
 * (docs/linssit-suunnitelma.md luku 2.2): näyttö voidaan piirtää myös
 * irralliseen SVG:hen, joka ei peri sivun tyylitiedostoa, ja luokkaan
 * nojaava väri katoaisi silloin mustaksi läiskäksi.
 *
 * Käyttö:
 *
 *     const naytto = teePistenaytto({ merkkeja: 16, rivit: 2 });
 *     soitin.appendChild(naytto.juuri);
 *     naytto.naytaTeksti(['YLE RADIO SUOMI', 'HELSINKI 94.0']);
 *     …
 *     naytto.pysayta();   // vieritys seis, teksti jää paikalleen
 */

const NS = 'http://www.w3.org/2000/svg';

/** Yhden merkin pisteruudukko. 5 × 7 on pienin, jolla Ä ja Ö erottuvat. */
export const MERKIN_LEVEYS = 5;
export const MERKIN_KORKEUS = 7;

/*
 * Pisteiden väli ja säde näytön omissa yksiköissä. Suhde 10 : 3,6 jättää
 * pisteiden väliin selvän raon — juuri se rako tekee ruudukosta laitteen
 * eikä sumeaa tekstiä. Juuri-SVG skaalataan viewBoxilla, joten nämä
 * luvut eivät ole pikseleitä eikä niitä tarvitse säätää koon mukaan.
 */
const JAKO = 10;
const SADE = 3.6;
const REUNA = 9;

/*
 * Oletusvärit ovat kartan omat (css/styles.css 24–27) kirjaimellisina
 * heksoina eivätkä var()-viittauksina: irrallinen SVG ei näe sivun
 * muuttujia. Kutsuja voi antaa omat värit, jos soittimen kuori vaatii
 * tummempaa lasia.
 */
const TAUSTA = '#c6b98d';
const PALAVA = '#46331f';
const SAMMUNUT = '#46331f';
/* Sammuneen pisteen peittävyys. 0,13 on tarpeeksi, että ruudukko näkyy
 * lasin läpi, muttei niin paljon että se kilpailisi tekstin kanssa. */
const SAMMUNUT_PEITTO = 0.13;
const KEHYS = '#46331f';

/*
 * Vierityksen oletusnopeus: yksi pistesarake 110 millisekunnissa eli
 * noin yhdeksän sarakkeen sekuntivauhti. Merkki on kuusi saraketta
 * leveä, joten teksti kulkee vajaat kaksi merkkiä sekunnissa — sama
 * lukunopeus kuin oikeissa ilmoitustauluissa. Nopeampi vieritys tekee
 * pitkistä asemannimistä lukukelvottomia.
 */
const NOPEUS_MS = 110;

/*
 * 5 × 7 -PISTEFONTTI
 *
 * Jokainen merkki on seitsemän riviä ylhäältä alas, viisi saraketta
 * vasemmalta oikealle. '#' on palava piste ja '.' sammunut. Muoto on
 * tarkoituksella tällainen: fontin voi lukea ja korjata suoraan
 * lähdekoodista ilman työkalua, koska rivit näyttävät kirjaimilta.
 *
 * Merkkien väliin ei ole kirjoitettu tyhjää saraketta — ruudukko lisää
 * sen itse (ks. sarakkeita-laskenta), jotta jokainen merkki on täsmälleen
 * yhtä leveä kuten oikeassa pistenäytössä.
 *
 * Ä JA Ö OVAT PAKOLLISIA. Suomenkielisissä asemannimissä on niitä
 * (Yle Ykkönen, Radio Suomi Jyväskylä), ja puuttuva merkki jättäisi
 * nimeen aukon. Pisteet ja itse kirjain eivät mahdu seitsemälle riville
 * täysikokoisina, joten Å, Ä ja Ö on kavennettu viidelle riville ja
 * pisteet ovat ylimmällä rivillä. Sama ratkaisu on tehty jokaisessa
 * oikeassa 5 × 7 -näytössä.
 */
export const FONTTI = {
  ' ': [
    '.....',
    '.....',
    '.....',
    '.....',
    '.....',
    '.....',
    '.....',
  ],
  A: [
    '.###.',
    '#...#',
    '#...#',
    '#####',
    '#...#',
    '#...#',
    '#...#',
  ],
  B: [
    '####.',
    '#...#',
    '#...#',
    '####.',
    '#...#',
    '#...#',
    '####.',
  ],
  C: [
    '.###.',
    '#...#',
    '#....',
    '#....',
    '#....',
    '#...#',
    '.###.',
  ],
  D: [
    '####.',
    '#...#',
    '#...#',
    '#...#',
    '#...#',
    '#...#',
    '####.',
  ],
  E: [
    '#####',
    '#....',
    '#....',
    '####.',
    '#....',
    '#....',
    '#####',
  ],
  F: [
    '#####',
    '#....',
    '#....',
    '####.',
    '#....',
    '#....',
    '#....',
  ],
  G: [
    '.###.',
    '#...#',
    '#....',
    '#.###',
    '#...#',
    '#...#',
    '.###.',
  ],
  H: [
    '#...#',
    '#...#',
    '#...#',
    '#####',
    '#...#',
    '#...#',
    '#...#',
  ],
  I: [
    '.###.',
    '..#..',
    '..#..',
    '..#..',
    '..#..',
    '..#..',
    '.###.',
  ],
  J: [
    '..###',
    '...#.',
    '...#.',
    '...#.',
    '...#.',
    '#..#.',
    '.##..',
  ],
  K: [
    '#...#',
    '#..#.',
    '#.#..',
    '##...',
    '#.#..',
    '#..#.',
    '#...#',
  ],
  L: [
    '#....',
    '#....',
    '#....',
    '#....',
    '#....',
    '#....',
    '#####',
  ],
  M: [
    '#...#',
    '##.##',
    '#.#.#',
    '#...#',
    '#...#',
    '#...#',
    '#...#',
  ],
  N: [
    '#...#',
    '#...#',
    '##..#',
    '#.#.#',
    '#..##',
    '#...#',
    '#...#',
  ],
  O: [
    '.###.',
    '#...#',
    '#...#',
    '#...#',
    '#...#',
    '#...#',
    '.###.',
  ],
  P: [
    '####.',
    '#...#',
    '#...#',
    '####.',
    '#....',
    '#....',
    '#....',
  ],
  Q: [
    '.###.',
    '#...#',
    '#...#',
    '#...#',
    '#.#.#',
    '#..#.',
    '.##.#',
  ],
  R: [
    '####.',
    '#...#',
    '#...#',
    '####.',
    '#.#..',
    '#..#.',
    '#...#',
  ],
  S: [
    '.####',
    '#....',
    '#....',
    '.###.',
    '....#',
    '....#',
    '####.',
  ],
  T: [
    '#####',
    '..#..',
    '..#..',
    '..#..',
    '..#..',
    '..#..',
    '..#..',
  ],
  U: [
    '#...#',
    '#...#',
    '#...#',
    '#...#',
    '#...#',
    '#...#',
    '.###.',
  ],
  V: [
    '#...#',
    '#...#',
    '#...#',
    '#...#',
    '#...#',
    '.#.#.',
    '..#..',
  ],
  W: [
    '#...#',
    '#...#',
    '#...#',
    '#.#.#',
    '#.#.#',
    '##.##',
    '#...#',
  ],
  X: [
    '#...#',
    '#...#',
    '.#.#.',
    '..#..',
    '.#.#.',
    '#...#',
    '#...#',
  ],
  Y: [
    '#...#',
    '#...#',
    '.#.#.',
    '..#..',
    '..#..',
    '..#..',
    '..#..',
  ],
  Z: [
    '#####',
    '....#',
    '...#.',
    '..#..',
    '.#...',
    '#....',
    '#####',
  ],
  // Å: rengas on yhtenä pisteenä. Kahdella pisteellä se sekoittuisi
  // Ä:hän, ja täysi rengas ei mahdu viiden pisteen leveyteen.
  Å: [
    '..#..',
    '.....',
    '.###.',
    '#...#',
    '#####',
    '#...#',
    '#...#',
  ],
  Ä: [
    '.#.#.',
    '.....',
    '.###.',
    '#...#',
    '#####',
    '#...#',
    '#...#',
  ],
  Ö: [
    '.#.#.',
    '.....',
    '.###.',
    '#...#',
    '#...#',
    '#...#',
    '.###.',
  ],
  0: [
    '.###.',
    '#...#',
    '#..##',
    '#.#.#',
    '##..#',
    '#...#',
    '.###.',
  ],
  1: [
    '..#..',
    '.##..',
    '..#..',
    '..#..',
    '..#..',
    '..#..',
    '.###.',
  ],
  2: [
    '.###.',
    '#...#',
    '....#',
    '...#.',
    '..#..',
    '.#...',
    '#####',
  ],
  3: [
    '#####',
    '...#.',
    '..#..',
    '...#.',
    '....#',
    '#...#',
    '.###.',
  ],
  4: [
    '...#.',
    '..##.',
    '.#.#.',
    '#..#.',
    '#####',
    '...#.',
    '...#.',
  ],
  5: [
    '#####',
    '#....',
    '####.',
    '....#',
    '....#',
    '#...#',
    '.###.',
  ],
  6: [
    '..##.',
    '.#...',
    '#....',
    '####.',
    '#...#',
    '#...#',
    '.###.',
  ],
  7: [
    '#####',
    '....#',
    '...#.',
    '..#..',
    '.#...',
    '.#...',
    '.#...',
  ],
  8: [
    '.###.',
    '#...#',
    '#...#',
    '.###.',
    '#...#',
    '#...#',
    '.###.',
  ],
  9: [
    '.###.',
    '#...#',
    '#...#',
    '.####',
    '....#',
    '...#.',
    '.##..',
  ],
  '.': [
    '.....',
    '.....',
    '.....',
    '.....',
    '.....',
    '.##..',
    '.##..',
  ],
  ',': [
    '.....',
    '.....',
    '.....',
    '.....',
    '..##.',
    '..##.',
    '.#...',
  ],
  '-': [
    '.....',
    '.....',
    '.....',
    '#####',
    '.....',
    '.....',
    '.....',
  ],
  ':': [
    '.....',
    '.##..',
    '.##..',
    '.....',
    '.##..',
    '.##..',
    '.....',
  ],
  "'": [
    '.##..',
    '.##..',
    '.#...',
    '.....',
    '.....',
    '.....',
    '.....',
  ],
  '(': [
    '...#.',
    '..#..',
    '.#...',
    '.#...',
    '.#...',
    '..#..',
    '...#.',
  ],
  ')': [
    '.#...',
    '..#..',
    '...#.',
    '...#.',
    '...#.',
    '..#..',
    '.#...',
  ],
  '?': [
    '.###.',
    '#...#',
    '....#',
    '...#.',
    '..#..',
    '.....',
    '..#..',
  ],
  '!': [
    '..#..',
    '..#..',
    '..#..',
    '..#..',
    '..#..',
    '.....',
    '..#..',
  ],
  '/': [
    '....#',
    '....#',
    '...#.',
    '..#..',
    '.#...',
    '#....',
    '#....',
  ],
  // Pystyviiva ja plus ovat mukana siksi, että ne ovat oikeissa
  // asemannimissä: js/packs/radiot.js:ssä lukee "Ö1 | ORF | HQ",
  // "Deutschlandfunk | DLF | MP3 128k" ja "Radio SWH+". Ilman näitä
  // nimeen tulisi aukko juuri siihen kohtaan, jossa ihminen odottaa
  // erotinta — ja aukko luetaan rikkinäiseksi näytöksi.
  '|': [
    '..#..',
    '..#..',
    '..#..',
    '..#..',
    '..#..',
    '..#..',
    '..#..',
  ],
  '+': [
    '.....',
    '..#..',
    '..#..',
    '#####',
    '..#..',
    '..#..',
    '.....',
  ],
  // Välipiste erottaa aseman ja kaupungin toisistaan soittimen rivillä
  // ("YLE RADIO SUOMI · HELSINKI"). Yksi piste keskellä riittää; isompi
  // merkki lukisi pisteenä.
  '·': [
    '.....',
    '.....',
    '.....',
    '..#..',
    '.....',
    '.....',
    '.....',
  ],
};

/** Tuntematon merkki: tyhjä ruutu. Sama kuin väli, mutta oma vakionsa,
 *  jotta lukija näkee ettei tämä ole vahinko. */
const TYHJA = FONTTI[' '];

/**
 * Fontin rivit yhdelle merkille. Palauttaa AINA seitsemän riviä.
 *
 * Tuntematon merkki ei ole virhe eikä poikkeus vaan tyhjä ruutu.
 * Asemannimet tulevat js/packs/radiot.js:stä eli maailmalta: joukossa on
 * kyrillisiä, kreikkalaisia ja arabialaisia nimiä, joita 5 × 7 -fontti ei
 * voi esittää. Näyttö saa jäädä niiden kohdalta tyhjäksi — se ei saa
 * kaatua, koska silloin katoaisi koko soitin eikä vain yksi kirjain.
 */
export function merkinRivit(merkki) {
  if (typeof merkki !== 'string' || merkki.length === 0) return TYHJA;
  const iso = merkki.toUpperCase();
  if (FONTTI[iso]) return FONTTI[iso];
  /*
   * Tarkkeellinen kirjain riisutaan perusmuotoonsa: É → E, Ñ → N. Näin
   * ranskalainen ja espanjalainen asemannimi luetaan lähes oikein sen
   * sijaan että siihen tulisi reikiä. Ä, Ö ja Å eivät joudu tänne, koska
   * ne löytyvät fontista jo yllä — niille tämä olisi väärin, ne eivät ole
   * A ja O tarkkeilla vaan omia kirjaimiaan.
   */
  const riisuttu = iso.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (riisuttu.length === 1 && FONTTI[riisuttu]) return FONTTI[riisuttu];
  return TYHJA;
}

/**
 * Merkin pisteet totuusarvoina: 7 riviä × 5 saraketta.
 * Tarkoitettu testeille ja fontin katselmointiin, ei piirtoon.
 */
export function merkinPisteet(merkki) {
  return merkinRivit(merkki).map((rivi) => {
    const pisteet = [];
    for (let x = 0; x < MERKIN_LEVEYS; x += 1) pisteet.push(rivi[x] === '#');
    return pisteet;
  });
}

/**
 * Tekstin pistesarakkeet bittinaamioina: bitti n = rivi n ylhäältä.
 *
 * Sarake kerrallaan eikä merkki kerrallaan, koska vieritys liikkuu
 * sarakkeen askelin — se on oikean laitteen liike, ja se on myös ainoa
 * tapa saada pitkä nimi mahtumaan ilman että kirjaimet hyppivät.
 * Merkkien väliin lisätään yksi tyhjä sarake; viimeisen jälkeen ei.
 */
function tekstinSarakkeet(teksti) {
  const merkit = [...String(teksti ?? '')];
  const sarakkeet = [];
  merkit.forEach((merkki, i) => {
    const rivit = merkinRivit(merkki);
    for (let x = 0; x < MERKIN_LEVEYS; x += 1) {
      let naamio = 0;
      for (let y = 0; y < MERKIN_KORKEUS; y += 1) {
        if (rivit[y][x] === '#') naamio |= (1 << y);
      }
      sarakkeet.push(naamio);
    }
    if (i < merkit.length - 1) sarakkeet.push(0);
  });
  return sarakkeet;
}

/** Kutsuja voi tarkistaa etukäteen mahtuuko teksti näyttöön. */
export function tekstinLeveys(teksti) {
  return tekstinSarakkeet(teksti).length;
}

function el(tag, attrs = {}, parent = null) {
  const node = document.createElementNS(NS, tag);
  for (const [avain, arvo] of Object.entries(attrs)) node.setAttribute(avain, String(arvo));
  if (parent) parent.appendChild(node);
  return node;
}

/**
 * Kysytään joka kerta uudelleen eikä kerran moduulin latautuessa:
 * käyttöjärjestelmän asetus voi vaihtua kesken istunnon, ja silloin
 * seuraavan kanavan nimen kuuluu totella uutta asetusta.
 */
function liikeSallittu() {
  try {
    return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches !== true;
  } catch {
    // matchMedia puuttuu (testiympäristö, vanha selain): liike sallitaan.
    return true;
  }
}

/**
 * Rakentaa pistenäytön.
 *
 * @param {object} asetukset
 * @param {number} asetukset.merkkeja  montako merkkiä rivillä näkyy kerralla
 * @param {number} asetukset.rivit     montako tekstiriviä näytössä on
 * @param {string} [asetukset.tausta]  lasin väri; null jättää taustan piirtämättä
 * @param {string} [asetukset.palava]  palavan pisteen väri
 * @param {string} [asetukset.sammunut] sammuneen pisteen väri
 * @param {string} [asetukset.kehys]   lasin reunaviivan väri; null = ei reunaa
 * @returns {{juuri: SVGElement, naytaTeksti: Function, pysayta: Function,
 *            mitat: object}}
 */
export function teePistenaytto({
  merkkeja = 16,
  rivit = 1,
  tausta = TAUSTA,
  palava = PALAVA,
  sammunut = SAMMUNUT,
  kehys = KEHYS,
} = {}) {
  const merkkiluku = Math.max(1, Math.round(merkkeja));
  const rivilukua = Math.max(1, Math.round(rivit));

  /*
   * Ruudukko on tasavälinen myös merkkien ja rivien väleissä. Merkkiväli
   * on yksi tyhjä sarake ja riviväli yksi tyhjä rivi — ne ovat oikeita
   * ruudukon paikkoja, joissa piste vain ei koskaan pala. Juuri siitä
   * pistenäyttö tunnistetaan: taustaruudukko jatkuu kirjainten välissä.
   */
  const sarakkeita = merkkiluku * (MERKIN_LEVEYS + 1) - 1;
  const pisterivit = rivilukua * (MERKIN_KORKEUS + 1) - 1;

  const leveys = (sarakkeita - 1) * JAKO + REUNA * 2;
  const korkeus = (pisterivit - 1) * JAKO + REUNA * 2;

  const juuri = el('svg', {
    xmlns: NS,
    viewBox: `0 0 ${leveys} ${korkeus}`,
    preserveAspectRatio: 'xMidYMid meet',
    // Kutsuja päättää leveyden kuoressaan; korkeus seuraa kuvasuhdetta.
    style: 'display:block;width:100%;height:auto',
    role: 'img',
  });

  if (tausta) {
    el('rect', {
      x: 0,
      y: 0,
      width: leveys,
      height: korkeus,
      rx: REUNA * 0.7,
      fill: tausta,
      ...(kehys ? { stroke: kehys, 'stroke-width': 1.4, 'stroke-opacity': 0.35 } : {}),
    }, juuri);
  }

  /*
   * Kaikki pisteet luodaan kerran ja jäävät paikoilleen. Teksti vaihtuu
   * ja vierii pelkästään fill-attribuuttia muuttamalla: elementtejä ei
   * luoda eikä poisteta koskaan piirron jälkeen.
   *
   * 16 merkkiä yhdellä rivillä on 95 × 7 = 665 ympyrää. Se on kertaluonne
   * pysyvä: sivulla on yksi näyttö, ja vieritysaskel koskettaa vain niitä
   * pisteitä, joiden tila oikeasti muuttuu (ks. sytyta()).
   */
  const ryhma = el('g', {}, juuri);
  const pisteet = [];   // [rivi][sarake] -> <circle>
  const tilat = [];     // [rivi][sarake] -> palaako piste nyt
  for (let y = 0; y < pisterivit; y += 1) {
    const rivinPisteet = [];
    const rivinTilat = [];
    for (let x = 0; x < sarakkeita; x += 1) {
      rivinPisteet.push(el('circle', {
        cx: REUNA + x * JAKO,
        cy: REUNA + y * JAKO,
        r: SADE,
        fill: sammunut,
        'fill-opacity': SAMMUNUT_PEITTO,
      }, ryhma));
      rivinTilat.push(false);
    }
    pisteet.push(rivinPisteet);
    tilat.push(rivinTilat);
  }

  /** Sytyttää tai sammuttaa yhden pisteen. Ei kirjoita jos tila ei muutu. */
  function sytyta(y, x, paalla) {
    if (tilat[y][x] === paalla) return;
    tilat[y][x] = paalla;
    const piste = pisteet[y][x];
    piste.setAttribute('fill', paalla ? palava : sammunut);
    piste.setAttribute('fill-opacity', paalla ? '1' : String(SAMMUNUT_PEITTO));
  }

  /*
   * Rivien tila. puskuri = tekstin pistesarakkeet, siirtyma = monenko
   * sarakkeen verran teksti on liukunut vasemmalle, vierii = onko rivi
   * liikkeessä.
   */
  const rivitila = [];
  for (let i = 0; i < rivilukua; i += 1) {
    rivitila.push({ puskuri: [], siirtyma: 0, vierii: false });
  }

  let ajastin = null;

  /** Piirtää yhden tekstirivin nykyisellä siirtymällä. */
  function piirraRivi(i) {
    const { puskuri, siirtyma, vierii } = rivitila[i];
    const ylin = i * (MERKIN_KORKEUS + 1);
    for (let x = 0; x < sarakkeita; x += 1) {
      /*
       * Vierivä rivi luetaan puskurista renkaana (jäännöslasku), paikallaan
       * oleva suoraan. Ero on olennainen: paikallaan olevalla rivillä
       * jäännöslasku kiertäisi liian pitkän tekstin lopun näytön alkuun,
       * jolloin nimi näyttäisi alkavan omasta hännästään.
       */
      let naamio = 0;
      if (puskuri.length > 0) {
        naamio = vierii
          ? puskuri[(siirtyma + x) % puskuri.length]
          : (puskuri[x] ?? 0);
      }
      for (let y = 0; y < MERKIN_KORKEUS; y += 1) {
        sytyta(ylin + y, x, ((naamio >> y) & 1) === 1);
      }
    }
  }

  function piirraKaikki() {
    for (let i = 0; i < rivilukua; i += 1) piirraRivi(i);
  }

  function pysayta() {
    if (ajastin === null) return;
    clearInterval(ajastin);
    ajastin = null;
  }

  function askel() {
    /*
     * Irronnut näyttö ei jää tikittämään. Jos soitin on poistettu DOM:sta
     * eikä kukaan kutsunut pysayta():a, ajastin sammuu itse — muuten se
     * eläisi koko istunnon ajan ja päivittäisi elementtejä, joita ei ole
     * missään. isConnected === false tarkistetaan nimenomaan näin, koska
     * DOM-tyngässä kenttää ei ole lainkaan.
     */
    if (juuri.isConnected === false) {
      pysayta();
      return;
    }
    let liikkuiko = false;
    for (let i = 0; i < rivilukua; i += 1) {
      const tila = rivitila[i];
      if (!tila.vierii || tila.puskuri.length === 0) continue;
      tila.siirtyma = (tila.siirtyma + 1) % tila.puskuri.length;
      piirraRivi(i);
      liikkuiko = true;
    }
    if (!liikkuiko) pysayta();
  }

  /**
   * Näyttää tekstin.
   *
   * @param {string|string[]} teksti  yksi rivi tai rivi per tekstirivi
   * @param {object} [asetukset]
   * @param {boolean|'auto'} [asetukset.vierita]  true = aina, false = ei koskaan,
   *        'auto' (oletus) = vain jos teksti ei mahdu näyttöön
   * @param {number} [asetukset.nopeus]  millisekuntia yhtä pistesaraketta kohti
   * @returns {boolean} vierittääkö näyttö nyt
   */
  function naytaTeksti(teksti, { vierita = 'auto', nopeus = NOPEUS_MS } = {}) {
    pysayta();
    const rivitTeksti = Array.isArray(teksti) ? teksti : [teksti];
    /*
     * Liikkeen vähennys ohittaa kutsujan toiveen. Vierivä teksti on
     * nimenomaan sitä liikettä, jonka asetus pyytää pois, ja radio on
     * taustatoiminto: pelaaja katsoo karttaa, ja näytön pitäisi kertoa
     * kanava, ei viedä huomiota.
     */
    const saaLiikkua = liikeSallittu();

    let vieriiJokin = false;
    for (let i = 0; i < rivilukua; i += 1) {
      const tila = rivitila[i];
      const oma = rivitTeksti[i] ?? '';
      const sarakkeet = tekstinSarakkeet(oma);
      const mahtuu = sarakkeet.length <= sarakkeita;
      const halutaanVieritys = vierita === true || (vierita === 'auto' && !mahtuu);
      tila.vierii = halutaanVieritys && saaLiikkua && sarakkeet.length > 0;
      tila.siirtyma = 0;
      /*
       * Vierivän tekstin perään tulee näytön levyinen tyhjä alue. Ilman
       * sitä tekstin loppu ja alku törmäisivät renkaassa yhteen ja
       * "HELSINKIYLE" näyttäisi yhdeltä sanalta.
       */
      tila.puskuri = tila.vierii
        ? sarakkeet.concat(new Array(sarakkeita).fill(0))
        : sarakkeet;
      if (tila.vierii) vieriiJokin = true;
    }

    piirraKaikki();
    // Saavutettavuus: ruudunlukija ei näe pisteitä. Sama teksti myös
    // tekstinä, jotta näyttö ei ole sille tyhjä kuva.
    juuri.setAttribute('aria-label', rivitTeksti.filter(Boolean).join(' — '));

    if (vieriiJokin) {
      /*
       * setInterval eikä requestAnimationFrame. Vieritys askeltaa noin
       * yhdeksän kertaa sekunnissa, ei kuusikymmentä: rAF-silmukka
       * heräisi joka kehyksellä vain todetakseen ettei ole vielä aika, ja
       * kartta on jo todettu herkäksi jatkuvalle piirrolle
       * (js/linssit/kerros.js 492–500). Selain hidastaa setIntervalin
       * itsestään, kun välilehti on taustalla.
       */
      ajastin = setInterval(askel, Math.max(20, nopeus));
    }
    return vieriiJokin;
  }

  return {
    juuri,
    naytaTeksti,
    pysayta,
    /** Ruudukon mitat kutsujalle: soittimen kuori voi mitoittaa itsensä. */
    mitat: { sarakkeita, pisterivit, leveys, korkeus },
  };
}
