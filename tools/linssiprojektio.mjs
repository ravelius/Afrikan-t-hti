/*
 * Linssien yhteinen projisointiapuri: asteet laudan koordinaateiksi.
 *
 * Tätä käyttää jokainen `tools/tee-linssi-<tunnus>.mjs`. Yksikään
 * linssiagentti ei siis kirjoita sauman käsittelyä eikä laudan
 * rajausta uudelleen — ne ovat tässä kertaalleen ja oikein.
 *
 * --- käyttöesimerkki: kokonainen tee-linssi-<tunnus>.mjs ---
 *
 *   import { join, dirname } from 'node:path';
 *   import { fileURLToPath } from 'node:url';
 *   import { sovitaLinssi } from './linssiprojektio.mjs';
 *
 *   const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
 *   const { ILMASTO } = await import(`file://${join(JUURI, 'tools/mapdata/linssi-ilmasto.js')}`);
 *
 *   const { viiva, rengas, enimmakseenLaudalla, kirjoita } = sovitaLinssi();
 *
 *   // Renkaat laudalle: laudan ulkopuoliset pois, loput kierron kopioineen.
 *   let pudotettu = 0;
 *   const vyohyke = (renkaat) => (renkaat ?? []).flatMap((r) => {
 *     if (!enimmakseenLaudalla(viiva(r))) { pudotettu += 1; return []; }
 *     return rengas(r);
 *   });
 *
 *   const ryhmat = ILMASTO.ryhmat.map((r) => ({ ...r, renkaat: vyohyke(r.renkaat) }));
 *   console.log(`laudan ulkopuolelta pudotettu ${pudotettu} muotoa`);
 *
 *   kirjoita({
 *     ulos: 'js/packs/linssi-ilmasto-lauta.js',
 *     tyokalu: 'tools/tee-linssi-ilmasto.mjs',
 *     asteet: 'tools/mapdata/linssi-ilmasto.js',
 *     otsikko: 'Ilmastovyöhykkeet laudan koordinaatteina.',
 *     lahteet: ILMASTO.lahde,          // { aineisto, lisenssi, osoite, haettu }
 *     vienti: 'ILMASTO_LAUTA',
 *     data: { ryhmat },
 *     kuiva: process.argv.includes('--kuiva'),
 *   });
 *
 * Viivalle `viiva`, monikulmiolle `rengas`, yksittäiselle merkille
 * `piste`. Muuta ei tarvita.
 *
 * --- miksi projisointi tehdään rakennusaikana ---
 *
 * Sama peruste kuin maastolla (`tools/tee-maasto.mjs` 11–18): aineisto
 * on maantiedettä ja pysyy samana, vaikka lauta piirrettäisiin uudelleen
 * toisella projektiolla. Siksi asteet ja pikselit pidetään erillään —
 * hakutyökalut tuottavat asteita, nämä työkalut pikseleitä. `js/`-puolella
 * ei ole yhtään lon/lat-muunnosta eikä sinne tule: pelin ei kuulu laskea
 * projektiota kesken kehyksen.
 *
 * --- kolme sääntöä, jotka tämä tiedosto hoitaa puolestasi ---
 *
 * 1. Viivalle `muunnaViiva`, ei `muunna`. Kartta kiertää ympäri, ja
 *    sauman ylittävä viiva piirtyisi muuten vaakaviivana halki kartan:
 *    peräkkäiset pisteet hyppäisivät laidasta laitaan. Näin kävi Venäjän
 *    pohjoisrannan joille (`tools/tee-maasto.mjs` 20–25).
 * 2. Renkaalle kierron kopio. Sauman yli roikkuva monikulmio on
 *    täytettävä myös laudan toisella laidalla, koska `<use>`-kopio
 *    toistaa vain sen mitä on piirretty — se ei täytä mitään itse.
 * 3. Laudan ulkopuolinen muoto pois enemmistösäännöllä. Muuten
 *    Etelämanner piirtyy möykkynä kartan alle ja Grönlanti katoaa.
 */
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { sovitaMaailma } from './vanha-maailma.mjs';

const JUURI = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/*
 * Laudan sovitus. Tarkalleen sama kuin maailmankartalla itsellään
 * (`tools/vanha-maailma.mjs` 272) ja maastolla (`tools/tee-maasto.mjs`
 * 62–66). Näistä luvuista seuraa skaala 1909,8593 ja korkeus 5399, mikä
 * täsmää pakan kentän { width: 12000, height: 5399 } kanssa.
 *
 * Luvut ovat vakio eivätkä parametri: kymmenen linssiä on projisoitava
 * samalle laudalle, ja parametri olisi kymmenen tilaisuutta poiketa.
 */
export const SOVITUS = { leveys: 12000, lon0: -175, etela: -58, pohjoinen: 76 };

/*
 * Sovitus lasketaan kertaalleen moduulin latauksessa. Se on puhdasta
 * laskentaa muutamalla vakiolla, ja näin sekä apurit että otsikon
 * kirjoittaja lukevat samat mitat samasta paikasta.
 */
const LAUTA = sovitaMaailma(SOVITUS);

/** Yksi desimaali riittää: 0,1 laudan yksikköä on murto-osa pikselistä. */
const luku = (n) => Number(n.toFixed(1));

/**
 * Projisointiapurit maailmankartan laudalle.
 *
 * Palauttaa `piste`, `viiva`, `rengas`, `enimmakseenLaudalla` ja
 * `kirjoita` sekä laudan mitat (`leveys`, `korkeus`, `skaala`).
 */
export function sovitaLinssi() {
  const { muunna, muunnaViiva, korkeus, leveys, skaala } = LAUTA;

  /** Yksittäinen merkki laudalle: `[lon, lat]` → `[x, y]`. */
  const piste = ([lon, lat]) => muunna([lon, lat]);

  /** Viiva laudalle, sauma auki pidettynä. Anna pisteet asteina. */
  const viiva = (pisteet) => muunnaViiva(pisteet).map(([x, y]) => [luku(x), luku(y)]);

  /*
   * Rengas laudalle. Anna pisteet asteina; ulos tulee YKSI TAI KAKSI
   * rengasta, joten kutsu on aina `flatMap(rengas)` eikä `map(rengas)`.
   *
   * Jos muoto valuu laudan reunan yli, siitä tehdään kopio toiselle
   * laidalle. Täyttö ei näy kierron `<use>`-kopiossa, koska se toistaa
   * vain piirretyn — täytetty puolikas on siis piirrettävä itse.
   */
  const rengas = (pisteet) => {
    const perus = viiva(pisteet);
    const xs = perus.map(([x]) => x);
    const ulos = [perus];
    if (Math.min(...xs) < 0) ulos.push(perus.map(([x, y]) => [luku(x + leveys), y]));
    else if (Math.max(...xs) > leveys) ulos.push(perus.map(([x, y]) => [luku(x - leveys), y]));
    return ulos;
  };

  /*
   * Onko muoto enimmäkseen laudalla? Anna LAUDAN pisteitä, ei asteita —
   * tyypillisesti `enimmakseenLaudalla(viiva(rengas))`.
   *
   * Aineisto kattaa koko pallon, mutta lauta on rajattu leveysasteille
   * -58…76: Miller venyttää navat äärettömiin eikä siellä ole kaupunkeja.
   * Etelämanner projisoituu siis alareunan ALAPUOLELLE ja piirtyi silti.
   * Grönlanti taas ylittää yläreunan osittain ja kuuluu ehdottomasti
   * mukaan. Siksi ratkaisee enemmistö: muoto säilyy, jos suurin osa
   * siitä on laudalla. Reunan yli valuva osa on kunnossa — kartta jatkuu
   * reunojen yli muutenkin.
   */
  const enimmakseenLaudalla = (laudanPisteet) => {
    const sisalla = laudanPisteet.filter(([, y]) => y >= 0 && y <= korkeus).length;
    return sisalla > laudanPisteet.length * 0.5;
  };

  return {
    piste,
    viiva,
    rengas,
    enimmakseenLaudalla,
    kirjoita,
    leveys,
    korkeus,
    skaala,
    lon0: SOVITUS.lon0,
  };
}

// --- koneen kirjoittama tiedosto ---------------------------------------------

const AVAIN_SELLAISENAAN = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const onLuku = (x) => typeof x === 'number' && Number.isFinite(x);
const onPiste = (x) => Array.isArray(x) && x.length === 2 && x.every(onLuku);
const onPistelista = (x) => Array.isArray(x) && x.length > 0 && x.every(onPiste);
const onLukulista = (x) => Array.isArray(x) && x.length > 0 && x.every(onLuku);

/** Arvo, joka mahtuu yhdelle riville: alkeisarvo, tyhjä tai pistelista. */
const onYksinkertainen = (x) => x === null || typeof x !== 'object'
  || (Array.isArray(x) && (x.length === 0 || onLukulista(x) || onPistelista(x)))
  || (!Array.isArray(x) && Object.keys(x).length === 0);

/*
 * Arvo JS-lähdekoodiksi.
 *
 * JSON.stringify yhdellä rivillä tekisi aineistosta yhden satojen
 * kilotavujen rivin: sitä ei voi lukea eikä sen muutosta näe
 * versionhallinnassa. Siksi rakenne katkaistaan riveille mutta
 * pistelista pidetään yhdellä rivillä — yksi rengas on yksi rivi, ja
 * diffistä näkee mikä rengas muuttui.
 */
function sarjallista(arvo, sisennys = '') {
  if (arvo === undefined || arvo === null) return 'null';
  if (typeof arvo !== 'object') return JSON.stringify(arvo);
  const sisa = `${sisennys}  `;
  if (Array.isArray(arvo)) {
    if (onYksinkertainen(arvo)) return JSON.stringify(arvo);
    return `[\n${arvo.map((x) => `${sisa}${sarjallista(x, sisa)},`).join('\n')}\n${sisennys}]`;
  }
  const parit = Object.entries(arvo).filter(([, v]) => v !== undefined);
  if (!parit.length) return '{}';
  const nimi = (k) => (AVAIN_SELLAISENAAN.test(k) ? k : JSON.stringify(k));
  const rivit = parit.map(([k, v]) => `${nimi(k)}: ${sarjallista(v, sisa)}`);
  // Tietue, jonka kaikki kentät ovat yksinkertaisia, mahtuu yhdelle
  // riville — esimerkiksi { nimi: 'Baikal', rengas: [[x,y],…] }.
  if (parit.every(([, v]) => onYksinkertainen(v))) return `{ ${rivit.join(', ')} }`;
  return `{\n${rivit.map((r) => `${sisa}${r},`).join('\n')}\n${sisennys}}`;
}

/** Yksi lähdeviite otsikkoon. Puuttuva kenttä on virhe, ei tyhjä rivi. */
function lahdeRivit(lahde, i) {
  for (const kentta of ['aineisto', 'lisenssi', 'haettu']) {
    if (!lahde?.[kentta]) {
      throw new Error(`kirjoita: lähteestä ${i + 1} puuttuu kenttä "${kentta}" — `
        + 'projisoidun tiedoston otsikossa on oltava lähde, lisenssi ja hakupäivä');
    }
  }
  return [
    `// Aineisto: ${lahde.aineisto}`,
    `// Lisenssi: ${lahde.lisenssi}`,
    ...(lahde.osoite ? [`// Osoite:   ${lahde.osoite}`] : []),
    `// Haettu:   ${lahde.haettu}`,
  ];
}

/**
 * Kirjoittaa projisoidun aineiston pelin luettavaksi paketiksi.
 *
 * Otsikko on osa tuotetta eikä koriste: se kertoo lukijalle että
 * tiedostoa ei muokata käsin, millä komennolla se syntyy ja mistä
 * aineisto on peräisin — lähde, lisenssi ja hakupäivä mukaan lukien.
 *
 * @param {object} p
 * @param {string} p.ulos      polku repon juuresta, esim. 'js/packs/linssi-x-lauta.js'
 * @param {string} p.tyokalu   mikä työkalu ajetaan uudelleen, esim. 'tools/tee-linssi-x.mjs'
 * @param {string} p.otsikko   yksi rivi suomeksi: mitä tiedosto sisältää
 * @param {object|object[]} p.lahteet  { aineisto, lisenssi, osoite, haettu }
 * @param {string} p.vienti    vietävän vakion nimi, esim. 'ILMASTO_LAUTA'
 * @param {*}      p.data      sarjallistettava arvo
 * @param {string} [p.asteet]  lähtöaineiston polku, esim. 'tools/mapdata/linssi-x.js'
 * @param {boolean} [p.kuiva]  true = älä kirjoita, kerro vain koko
 * @param {boolean} [p.hiljaa] true = älä tulosta mitään
 */
export function kirjoita({
  ulos, tyokalu, otsikko, lahteet, vienti, data, asteet = null, kuiva = false, hiljaa = false,
}) {
  for (const [nimi, arvo] of [['ulos', ulos], ['tyokalu', tyokalu], ['otsikko', otsikko],
    ['vienti', vienti], ['lahteet', lahteet]]) {
    if (!arvo) throw new Error(`kirjoita: pakollinen kenttä "${nimi}" puuttuu`);
  }
  if (!AVAIN_SELLAISENAAN.test(vienti)) {
    throw new Error(`kirjoita: "${vienti}" ei kelpaa vietävän vakion nimeksi`);
  }
  const lista = Array.isArray(lahteet) ? lahteet : [lahteet];

  const mitat = `laudan koordinaatteihin (${LAUTA.leveys} x ${LAUTA.korkeus})`;
  const mista = asteet
    ? `// Lähde on asteina tiedostossa ${asteet};\n// tämä on siitä projisoitu versio ${mitat}.`
    : `// Tämä on hakutyökalun asteaineistosta projisoitu versio\n// ${mitat}.`;

  const teksti = `// ${otsikko}
//
// TÄMÄ TIEDOSTO ON KONEEN KIRJOITTAMA. Älä muokkaa käsin —
// aja \`node ${tyokalu}\` uudelleen.
//
${mista}
// Sauman ylittävät muodot on pidetty yhtenäisinä ja renkaista on kierron
// kopio laudan toisella laidalla.
//
${lista.flatMap(lahdeRivit).join('\n')}

export const ${vienti} = ${sarjallista(data)};
`;

  const polku = resolve(JUURI, ulos);
  const kilotavut = Math.round(teksti.length / 1024);
  if (kuiva) {
    if (!hiljaa) console.log(`kuiva-ajo: ${ulos} olisi ${kilotavut} kt`);
    return { polku, teksti, kirjoitettu: false };
  }
  writeFileSync(polku, teksti);
  if (!hiljaa) console.log(`kirjoitettu ${ulos} (${kilotavut} kt)`);
  return { polku, teksti, kirjoitettu: true };
}
