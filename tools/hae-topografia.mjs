/*
 * Korkeuslinssin topografia -> js/packs/linssi-topografia.js
 *
 *   node tools/hae-topografia.mjs [--kuiva] [valitsimet]
 *
 * --- miksi tämä on eri työkalu kuin hae-korkeusvyohykkeet.mjs ---
 *
 * Se toinen tekee kartan PYSYVÄN maaston: kolme vyöhykettä, karkea
 * ruudukko, tarkoituksella hävitetyt yksityiskohdat. Se on varjo, ja
 * sen kuuluu olla vaimea — kartta on matkakirja eikä atlas.
 *
 * Linssi on päinvastainen lupaus. Pelaaja nostaa sen silmälle nähdäkseen
 * juuri sen, mikä pysyvästä kartasta on jätetty pois: montako kilometriä
 * ylös Andit oikeasti nousevat, missä mannerjalusta loppuu ja mistä
 * merenpohja putoaa kuuden kilometrin syvyyteen. Siksi tässä on 8
 * korkeusvyöhykettä ja 4 syvyysvyöhykettä, ruudukko on 0,1° eikä 0,25°,
 * ja pienimmätkin säilytettävät muodot ovat neljäsosan pysyvän maaston
 * alarajasta.
 *
 * NetCDF-lukija, marching squares, RDP ja renkaiden liitos on lainattu
 * hae-korkeusvyohykkeet.mjs:stä. Ne on kopioitu eikä jaettu, koska
 * työkalut saavat kehittyä eri suuntiin: pysyvän maaston kynnykset ovat
 * makuasia, linssin kynnykset ovat mittalaite.
 *
 * YKSI EROAVAISUUS ON KORJAUS EIKÄ MAKUASIA. Marching squaresin
 * satulatapaus 5 on lainatussa koodissa väärin (ks. aariviivat), ja
 * sisartyökalussa vika on yhä. Se katkoo ääriviivaketjuja, ja katkennut
 * ketju suljetaan suoralla jänteellä väärän muotoiseksi renkaaksi.
 * Mitattuna: ennen korjausta 345 rengasta 200 metrin tasolla suljettiin
 * väkisin ja Mount Everest jäi oman korkeusvyöhykkeensä ULKOPUOLELLE;
 * korjauksen jälkeen väkisin suljettuja on nolla. Ero lähdeaineistoon
 * putosi 5,4 prosentista 0,08:aan.
 *
 * --- meri ---
 *
 * Syvyysvyöhyke on sama laskutoimitus kuin korkeusvyöhyke, kun ruudukon
 * merkki käännetään: "alle -4000 m" on "yli 4000 m" ylösalaisin. Siksi
 * merta ei ole koodissa erikseen kuin yhden etumerkin verran.
 *
 * --- 400 kilotavun katto ---
 *
 * Katto ei jousta, mutta ei jousta myöskään vaatimus siitä, ettei
 * yksikään vyöhyke saa tyhjentyä. Kokoa säädetään RENGASKATOLLA eli
 * sillä, montako muotoa kukin vyöhyke saa näyttää — ei toleranssilla
 * eikä vähimmäisalalla, jotka molemmat pidetään pysyvää maastoa
 * hienompina. Karsittavaksi joutuu siis pieni merenalainen kumpu, ei
 * yhdenkään muodon piirtotarkkuus. Ks. tuota ja main.
 *
 * Verkko: Noden fetch ei lue HTTPS_PROXYa, ks. tools/hae-radiot.mjs.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

if (!process.env.NODE_USE_ENV_PROXY && (process.env.HTTPS_PROXY || process.env.https_proxy)) {
  const ajo = spawnSync(process.execPath, [fileURLToPath(import.meta.url), ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1', NODE_NO_WARNINGS: '1' },
  });
  process.exit(ajo.status ?? 1);
}

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
// Ruudukko on toistasataa megatavua eikä kuulu repoon. TOPOGRAFIA_VALIMUISTI
// osoittaa muualle, jos haluaa säilyttää sen ajojen välillä.
const VALIMUISTI = process.env.TOPOGRAFIA_VALIMUISTI || join(tmpdir(), 'matkakirja-topografia');
const KOHDE = join(JUURI, 'js', 'packs', 'linssi-topografia.js');

const PALVELIN = 'https://coastwatch.pfeg.noaa.gov/erddap/griddap/etopo360';
const AINEISTO = 'NOAA NGDC ETOPO1 Global Relief Model, Ice Surface, 1 kaariminuutti';
const VIITE = 'Amante & Eakins 2009, NOAA NCEI, doi:10.7289/V5C8276M';
const LISENSSI = 'Public domain (US Government work). ERDDAPin lisenssiteksti: '
  + '"The data may be used and redistributed for free but is not intended for legal use, '
  + 'since it may contain inaccuracies."';

// ETOPO1:n ruudukko: 10801 x 21601, lat -90..90, lon 0..360.
const LAT_N = 10801;
const LON_N = 21601;

/*
 * Vyöhykkeet PIIRTOJÄRJESTYKSESSÄ: uloin ensin, sisin viimeisenä.
 *
 * Jokainen vyöhyke on "kaikki tätä ylempi" (maa) tai "kaikki tätä
 * syvempi" (meri), eli ne ovat sisäkkäisiä. Siksi järjestys ei ole
 * metreittäin nouseva vaan merenpinnasta ulospäin kumpaankin suuntaan:
 * jos vyöhykkeet piirtää tässä järjestyksessä, syvempi jää aina
 * matalamman päälle ja korkeampi matalamman päälle. Toisin päin
 * piirretty kartta olisi yhtä yksiväristä läiskää.
 *
 * --- värit ---
 *
 * Hypsometrinen asteikko on kartografian vakio: alangot vihreitä, ylängöt
 * ruskeita, huiput valkoisia, meri sitä tummempi mitä syvempi. Se on
 * tässä käännetty pelin sepiapaperille eli kylläisyys on otettu pois
 * kaikkialta — kirkas vihreä ja kirkas sininen näyttäisivät siltä, että
 * kartan päälle on liimattu toinen kartta.
 *
 * Kaksi sävyä on lainattu suoraan pysyvältä maastolta (css/styles.css):
 * 1000 m on sama #c9a86e ja 3000 m sama #a8823f. Näin linssi ei ole eri
 * maailmasta kuin kartta sen alla, vaan sama maasto tarkempana.
 *
 * Lumi ei ole valkoinen vaan paperin puolella oleva lämmin vaalea
 * (#f0e3c6) samasta syystä kuin pysyvässä maastossa: sepiakartalla
 * paperia vaaleampi sävy luetaan reiäksi eikä lumeksi.
 *
 * Nämä ovat EHDOTUS. Piirtäjä päättää läpinäkyvyyden ja sen, piirretäänkö
 * ääriviivat; aineisto ei ota siihen kantaa.
 */
const VYOHYKKEET = [
  // meri: matalasta syvään
  { metriä: -200, puoli: 'meri', nimi: 'mannerjalustan reuna', vari: '#a9bcc0' },
  { metriä: -2000, puoli: 'meri', nimi: 'mannerrinne', vari: '#89a3ab' },
  { metriä: -4000, puoli: 'meri', nimi: 'syvänmeren tasanko', vari: '#6c8994' },
  { metriä: -6000, puoli: 'meri', nimi: 'syvänteet', vari: '#52707d' },
  // maa: matalasta korkeaan
  { metriä: 200, puoli: 'maa', nimi: 'alangot', vari: '#c3c79c' },
  { metriä: 500, puoli: 'maa', nimi: 'kumpuileva maa', vari: '#c9bb84' },
  { metriä: 1000, puoli: 'maa', nimi: 'ylängöt', vari: '#c9a86e' },
  { metriä: 1500, puoli: 'maa', nimi: 'korkeat ylängöt', vari: '#c09a5c' },
  { metriä: 2000, puoli: 'maa', nimi: 'vuoristo', vari: '#b58e4d' },
  { metriä: 3000, puoli: 'maa', nimi: 'korkea vuoristo', vari: '#a8823f' },
  { metriä: 4000, puoli: 'maa', nimi: 'ylin vuoristo', vari: '#8e6c34' },
  { metriä: 5000, puoli: 'maa', nimi: 'ikilumi', vari: '#f0e3c6' },
];

// ---------------------------------------------------------------- valitsimet

function valitsin(nimi, oletus) {
  const i = process.argv.indexOf('--' + nimi);
  if (i < 0) return oletus;
  const arvo = process.argv[i + 1];
  return arvo === undefined || arvo.startsWith('--') ? true : Number(arvo);
}

const ASETUKSET = {
  kuiva: process.argv.includes('--kuiva'),
  // näytteenottoväli latauksessa, kaariminuutteina. Kolme antaa 2x2
  // näytettä jokaista 0,1°:n ruutua kohti — keskiarvo eikä poiminta.
  nayte: valitsin('nayte', 3),
  // lopullinen ruutukoko asteina. Pysyvässä maastossa 0,25°.
  ruutu: valitsin('ruutu', 0.1),
  // riviä yhdessä latauspyynnössä
  kaista: valitsin('kaista', 200),
  // Yksi 3x3-pyyhkäisy. Nollalla ääriviivat ovat portaikkoa, jonka RDP
  // joutuu kuvaamaan pisteillä, ja pisteet ovat tavuja. Kahdella syvänteet
  // madaltuvat: kapea kouru on vain seitsemän ruutua leveä.
  sumennus: valitsin('sumennus', 1),
  /*
   * Ramer-Douglas-Peucker, asteina. Pysyvässä maastossa 0,2°.
   *
   * Tämä ja --vahin-ala ovat linssin LAATULATTIA eivätkä säätöruuvi:
   * kumpaakaan ei kiristetä koon takia. Koko haarukoidaan
   * --enin-renkailla, ks. tuota.
   *
   * Arvo on tarkoituksella lähellä pysyvän maaston 0,2 astetta, koska
   * kireämpi ei kannata. Sadan neliökilometrin saari maksaa saman
   * verran pisteitä kuin manner riippumatta siitä, kummalla toleranssilla
   * se piirretään, joten tavut kannattaa käyttää MUOTOJEN MÄÄRÄÄN eikä
   * yksittäisen ääriviivan sileyteen. Mitattuna: 0,12 asteella mahtuu 40
   * rengasta vyöhykettä kohti, 0,19 asteella 185 — ja jälkimmäisessä
   * seitsemän vyöhykettä kahdestatoista näyttää KAIKKI yli 3000 km²:n
   * muotonsa, mihin kireämmällä toleranssilla ei ylletä lähellekään.
   */
  toleranssi: valitsin('toleranssi', 0.19),
  // Pienin säilytettävä rengas, neliökilometreinä. Pysyvässä maastossa
  // 12000 km²; linssi näyttää neljä kertaa pienempiä muotoja.
  vahinAla: valitsin('vahin-ala', 3000),
  /*
   * Enintään näin monta rengasta vyöhykettä kohti, suurimmat ensin.
   *
   * Tämä on se ruuvi, jolla 400 kilotavun katto osutaan; main hakee
   * arvon mittaamalla. Ks. tuota — katto karsii rakeisuutta eikä
   * karkeuta yhdenkään muodon piirtoa.
   */
  eninRenkaat: valitsin('enin-renkaat', 400),
  /*
   * Jokaisesta vyöhykkeestä säilytetään aina näin monta suurinta
   * rengasta, vaikka ne alittaisivat vähimmäisalan.
   *
   * Ilman tätä sääntöä kireä alaraja tyhjentäisi juuri ne vyöhykkeet,
   * joita varten koko linssi tehtiin: yli 5000 metrin huiput ja alle
   * 6000 metrin syvänteet ovat maailman harvinaisimmat maastot, ja
   * kapeina ne ovat myös pienialaisimmat. Vyöhykkeen tyhjentyminen ei
   * ole kompromissi vaan valhe — kartta väittäisi, ettei syvänteitä ole.
   */
  vahinMaara: valitsin('vahin-maara', 12),
  /*
   * Koordinaatin desimaalit. Yksi desimaali on 0,1° eli sama kuin
   * ruudukko: piste ei voi osua ruudukkoa tarkemmin, joten toinen
   * desimaali tallentaisi vain marching squaresin interpoloinnin
   * ruudun sisällä — ja se on toleranssia (0,19°) pienempi eli
   * hukkuu joka tapauksessa yksinkertaistukseen.
   *
   * Mitattuna toinen desimaali maksaa noin viidenneksen tiedostosta:
   * samalla katolla se pudottaa rengaskaton 185:stä 118:aan. Muotoja
   * on parempi olla enemmän kuin niiden koordinaatteja tarkemmin.
   */
  tarkkuus: valitsin('tarkkuus', 1),
  /*
   * 400 000 tavua eikä 409 600. Sisartyökalu hae-korkeusvyohykkeet.mjs
   * lukee "400 kt" muodossa 400 x 1024, mutta tämä tiedosto pysähtyisi
   * silloin 68 tavun päähän katosta. Tiukempi luenta pitää paikkansa
   * kummallakin tavalla laskien, ja se maksaa vain parikymmentä rengasta
   * kolmessa rakeisimmassa vyöhykkeessä.
   */
  katto: valitsin('katto', 400 * 1000),
};

// -------------------------------------------------------------- netCDF-luku

/*
 * NetCDF-3 classic on niin suoraviivainen muoto, että sen lukeminen on
 * halvempaa kuin riippuvuuden ottaminen. Peli ei ota riippuvuuksia,
 * eikä sen työkalupakkikaan ota niitä ilman syytä.
 */
function lueNetCDF(buf) {
  if (buf.toString('latin1', 0, 3) !== 'CDF') throw new Error('ei ole netCDF-3-tiedosto');
  const versio = buf[3];
  let p = 4;
  const u32 = () => { const v = buf.readUInt32BE(p); p += 4; return v; };
  const i32 = () => { const v = buf.readInt32BE(p); p += 4; return v; };
  const i64 = () => { const v = Number(buf.readBigInt64BE(p)); p += 8; return v; };
  const nimi = () => {
    const n = u32();
    const s = buf.toString('utf8', p, p + n);
    p += n + ((4 - n % 4) % 4);
    return s;
  };
  const KOKO = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 4, 6: 8 };
  const arvot = (tyyppi, n) => {
    const alku = p;
    const tavut = KOKO[tyyppi] * n;
    p += tavut + ((4 - tavut % 4) % 4);
    if (tyyppi === 2) return buf.toString('utf8', alku, alku + n);
    const ulos = tyyppi === 3 ? new Int16Array(n) : new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const o = alku + i * KOKO[tyyppi];
      ulos[i] = tyyppi === 1 ? buf.readInt8(o)
        : tyyppi === 3 ? buf.readInt16BE(o)
          : tyyppi === 4 ? buf.readInt32BE(o)
            : tyyppi === 5 ? buf.readFloatBE(o) : buf.readDoubleBE(o);
    }
    return ulos;
  };
  u32(); // numrecs
  const lista = (tunnus, lue) => {
    const tag = u32();
    const n = u32();
    if (tag === 0) return [];
    if (tag !== tunnus) throw new Error('odottamaton netCDF-lista ' + tag);
    const ulos = [];
    for (let i = 0; i < n; i++) ulos.push(lue());
    return ulos;
  };
  const dimit = lista(10, () => ({ nimi: nimi(), pituus: u32() }));
  const attrit = () => lista(12, () => { const k = nimi(); const t = i32(); const n = u32(); return { k, v: arvot(t, n) }; });
  attrit();
  const muuttujat = lista(11, () => {
    const nm = nimi();
    const nd = u32();
    const dimid = [];
    for (let i = 0; i < nd; i++) dimid.push(u32());
    attrit();
    const tyyppi = i32();
    u32(); // vsize
    const alku = versio === 2 ? i64() : u32();
    return { nimi: nm, dimid, tyyppi, alku };
  });
  const ulos = {};
  for (const m of muuttujat) {
    const muoto = m.dimid.map(d => dimit[d].pituus);
    const n = muoto.reduce((a, b) => a * b, 1);
    p = m.alku;
    ulos[m.nimi] = { muoto, data: arvot(m.tyyppi, n) };
  }
  return ulos;
}

// ------------------------------------------------------------------ lataus

async function hae(url, kohde) {
  if (existsSync(kohde) && statSync(kohde).size > 0) return readFileSync(kohde);
  for (let yritys = 1; yritys <= 4; yritys++) {
    try {
      const v = await fetch(url, { signal: AbortSignal.timeout(300000) });
      if (!v.ok) throw new Error('HTTP ' + v.status + ' ' + (await v.text()).slice(0, 200));
      const buf = Buffer.from(await v.arrayBuffer());
      writeFileSync(kohde, buf);
      return buf;
    } catch (e) {
      if (yritys === 4) throw e;
      process.stderr.write(`  uusiksi (${yritys}): ${e.message}\n`);
      await new Promise(r => setTimeout(r, 3000 * yritys));
    }
  }
}

/*
 * Hakee ETOPO1:n ja keskiarvoistaa sen suoraan lopulliseen ruudukkoon.
 *
 * Kaista puretaan ruudukkoon heti eikä kerätä muistiin: 3 kaariminuutin
 * välein poimittu maailma on 3601 x 7201 lukua eli parisataa megatavua,
 * kun taas 0,1°:n ruudukko on kolmasosa siitä. Iso ruudukko ei ole
 * missään vaiheessa kokonaan muistissa.
 *
 * Pituusaste käännetään välille [-180, 180]. Sarakkeet -180 ja +180 ovat
 * sama meridiaani kahdesti, joten päivämääränrajan yli menevä muoto
 * katkeaa siististi kahdeksi renkaaksi sen sijaan että vetäisi viivan
 * halki kartan.
 */
async function haeRuudukko() {
  mkdirSync(VALIMUISTI, { recursive: true });
  const askel = ASETUKSET.nayte;
  const ruutu = ASETUKSET.ruutu;
  const leveys = Math.round(360 / ruutu) + 1; // -180 .. +180, molemmat mukana
  const korkeus = Math.round(180 / ruutu) + 1; // -90 .. +90

  const latIndeksit = [];
  for (let i = 0; i < LAT_N; i += askel) latIndeksit.push(i);
  const lonIndeksit = [];
  for (let i = 0; i < LON_N; i += askel) lonIndeksit.push(i);

  // Sarakkeen paikka ruudukossa ei muutu kaistojen välillä, joten se
  // lasketaan kerran eikä 3601 kertaa.
  const xOf = new Int32Array(lonIndeksit.length);
  for (let c = 0; c < lonIndeksit.length; c++) {
    const raaka = lonIndeksit[c] / 60;
    const lon = raaka > 180 ? raaka - 360 : raaka;
    xOf[c] = Math.min(leveys - 1, Math.max(0, Math.round((lon + 180) / ruutu)));
  }

  const summa = new Float64Array(leveys * korkeus);
  const maara = new Float64Array(leveys * korkeus);

  const KAISTA = ASETUKSET.kaista;
  for (let a = 0; a < latIndeksit.length; a += KAISTA) {
    const b = Math.min(a + KAISTA - 1, latIndeksit.length - 1);
    const kysely = `altitude[${latIndeksit[a]}:${askel}:${latIndeksit[b]}][0:${askel}:${lonIndeksit[lonIndeksit.length - 1]}]`;
    const url = `${PALVELIN}.nc?${encodeURIComponent(kysely)}`;
    const tiedosto = join(VALIMUISTI, `etopo1-${askel}-${a}.nc`);
    process.stderr.write(`lataan rivit ${a}..${b} / ${latIndeksit.length}\n`);
    const nc = lueNetCDF(await hae(url, tiedosto));
    const { muoto, data } = nc.altitude;
    if (muoto[1] !== lonIndeksit.length) throw new Error('odottamaton leveys ' + muoto[1]);
    for (let r = 0; r < muoto[0]; r++) {
      const lat = latIndeksit[a + r] / 60 - 90;
      const y = Math.min(korkeus - 1, Math.max(0, Math.round((lat + 90) / ruutu)));
      const rivi = y * leveys;
      const alku = r * muoto[1];
      for (let c = 0; c < muoto[1]; c++) {
        const arvo = data[alku + c];
        const i = rivi + xOf[c];
        summa[i] += arvo;
        maara[i] += 1;
        // 0 ja 360 osuvat samaan meridiaaniin: kirjataan molempiin reunoihin
        if (xOf[c] === 0) { summa[rivi + leveys - 1] += arvo; maara[rivi + leveys - 1] += 1; }
        else if (xOf[c] === leveys - 1) { summa[rivi] += arvo; maara[rivi] += 1; }
      }
    }
  }

  const z = new Float64Array(leveys * korkeus);
  let tyhjia = 0;
  for (let i = 0; i < z.length; i++) {
    if (maara[i]) z[i] = summa[i] / maara[i];
    else { z[i] = 0; tyhjia++; }
  }
  /*
   * Tyhjä ruutu tarkoittaisi, että näytteenottoväli on harvempi kuin
   * ruudukko ja osa maailmasta on keksittyä. Se pysäytetään tähän:
   * väärä maasto on pahempi kuin puuttuva työkalu.
   */
  if (tyhjia) throw new Error(`${tyhjia} ruutua jäi ilman näytettä — --nayte on liian harva ruudulle ${ruutu}°`);
  return { z, leveys, korkeus, ruutu };
}

/* Kolmen kertaa kolmen keskiarvo. Pyöristää portaikot ja katkoo kohinan. */
function sumenna(g, kierrokset) {
  const { leveys, korkeus } = g;
  let z = g.z;
  for (let k = 0; k < kierrokset; k++) {
    const uusi = new Float64Array(z.length);
    for (let y = 0; y < korkeus; y++) {
      for (let x = 0; x < leveys; x++) {
        let s = 0;
        let n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          const yy = y + dy;
          if (yy < 0 || yy >= korkeus) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const xx = (x + dx + leveys) % leveys;
            s += z[yy * leveys + xx];
            n++;
          }
        }
        uusi[y * leveys + x] = s / n;
      }
    }
    z = uusi;
  }
  return { ...g, z };
}

// ------------------------------------------------------- marching squares

/*
 * Perinteinen marching squares. Ruudukko kehystetään ensin hyvin
 * matalalla reunalla, jolloin kaikki ääriviivat ovat suljettuja
 * silmukoita eikä avoimia päitä tarvitse käsitellä erikseen.
 *
 * Merivyöhykkeellä koko ruudukko käännetään ylösalaisin (kaanna = -1):
 * "alle -4000 m" on täsmälleen sama laskutoimitus kuin "yli 4000 m",
 * kun sekä korkeudet että taso kerrotaan miinus yhdellä. Silloin myös
 * kehyksen -9999 tarkoittaa oikein "maailman ulkopuolella on kuivaa
 * maata", ja valtameren ääriviivat sulkeutuvat ruudukon sisällä.
 *
 * Satulatapaukset (5 ja 10) ratkaistaan neljän kulman keskiarvolla,
 * mikä on tavanomainen ja tässä käytännössä yhdentekevä valinta.
 */
function aariviivat(g, metriä, kaanna) {
  const { leveys, korkeus, ruutu, z } = g;
  const taso = metriä * kaanna;
  const L = leveys + 2;
  const K = korkeus + 2;
  const kehys = new Float64Array(L * K).fill(-9999);
  for (let y = 0; y < korkeus; y++) {
    for (let x = 0; x < leveys; x++) kehys[(y + 1) * L + (x + 1)] = z[y * leveys + x] * kaanna;
  }
  const lonOf = (gx) => -180 + (gx - 1) * ruutu;
  const latOf = (gy) => -90 + (gy - 1) * ruutu;

  const paloja = [];
  const lisaa = (a, b) => paloja.push([a, b]);

  for (let y = 0; y < K - 1; y++) {
    for (let x = 0; x < L - 1; x++) {
      const v0 = kehys[y * L + x];           // vasen ala
      const v1 = kehys[y * L + x + 1];       // oikea ala
      const v2 = kehys[(y + 1) * L + x + 1]; // oikea ylä
      const v3 = kehys[(y + 1) * L + x];     // vasen ylä
      let tapaus = 0;
      if (v0 >= taso) tapaus |= 1;
      if (v1 >= taso) tapaus |= 2;
      if (v2 >= taso) tapaus |= 4;
      if (v3 >= taso) tapaus |= 8;
      if (tapaus === 0 || tapaus === 15) continue;

      const sek = (a, b) => (taso - a) / (b - a);
      const ala = () => [lonOf(x + sek(v0, v1)), latOf(y)];
      const oikea = () => [lonOf(x + 1), latOf(y + sek(v1, v2))];
      const yla = () => [lonOf(x + sek(v3, v2)), latOf(y + 1)];
      const vasen = () => [lonOf(x), latOf(y + sek(v0, v3))];

      switch (tapaus) {
        case 1: lisaa(vasen(), ala()); break;
        case 2: lisaa(ala(), oikea()); break;
        case 3: lisaa(vasen(), oikea()); break;
        case 4: lisaa(oikea(), yla()); break;
        case 6: lisaa(ala(), yla()); break;
        case 7: lisaa(vasen(), yla()); break;
        case 8: lisaa(yla(), vasen()); break;
        case 9: lisaa(yla(), ala()); break;
        case 11: lisaa(yla(), oikea()); break;
        case 12: lisaa(oikea(), vasen()); break;
        case 13: lisaa(oikea(), ala()); break;
        case 14: lisaa(ala(), vasen()); break;
        /*
         * Satula: v0 ja v2 sisällä, v1 ja v3 ulkona. Keskiarvo ratkaisee,
         * yhdistyvätkö sisäkulmat lävistäjän kautta.
         *
         * HUOM: tässä oli virhe, joka on peritty sisartyökalusta
         * hae-korkeusvyohykkeet.mjs (ks. raportti). Haarat olivat väärin
         * päin JA ala->oikea oli väärään suuntaan. Seuraus: janan pää ei
         * osunut naapuriruudun janan alkuun, ketju katkesi, ja
         * liitaRenkaiksi sulki katkenneen ketjun suoralla jänteellä.
         * Yli 200 metrin ääriviivassa se rikkoi Aasian ylängöt niin,
         * ettei Mount Everest ollut enää oman vyöhykkeensä sisällä.
         *
         * Suunnat johdetaan yksikäsitteisistä tapauksista: yksin sisällä
         * oleva v3 on yla->vasen (tapaus 8), yksin ULKONA oleva v3 on
         * vasen->yla (tapaus 7) eli sama jana toisin päin.
         */
        case 5: {
          const keski = (v0 + v1 + v2 + v3) / 4;
          // keskus sisällä: sisäkulmat yhdistyvät, erotetaan ulkokulmat v1 ja v3
          if (keski >= taso) { lisaa(oikea(), ala()); lisaa(vasen(), yla()); }
          // keskus ulkona: v0 ja v2 ovat erillisiä sisäkulmia
          else { lisaa(vasen(), ala()); lisaa(oikea(), yla()); }
          break;
        }
        case 10: {
          const keski = (v0 + v1 + v2 + v3) / 4;
          if (keski >= taso) { lisaa(ala(), vasen()); lisaa(yla(), oikea()); }
          else { lisaa(ala(), oikea()); lisaa(yla(), vasen()); }
          break;
        }
        default: break;
      }
    }
  }
  return liitaRenkaiksi(paloja);
}

/*
 * Liittää irralliset janat renkaiksi päätepisteiden perusteella. Naapuriruudut
 * laskevat saman reunan leikkauskohdan samasta kaavasta samoista luvuista,
 * joten päätepisteet ovat bitilleen samat eikä sietoa tarvita.
 */
function liitaRenkaiksi(paloja) {
  const avain = (p) => p[0].toFixed(9) + ',' + p[1].toFixed(9);
  const alkavat = new Map();
  for (let i = 0; i < paloja.length; i++) {
    const k = avain(paloja[i][0]);
    if (!alkavat.has(k)) alkavat.set(k, []);
    alkavat.get(k).push(i);
  }
  const kaytetty = new Uint8Array(paloja.length);
  const renkaat = [];
  for (let i = 0; i < paloja.length; i++) {
    if (kaytetty[i]) continue;
    kaytetty[i] = 1;
    const rengas = [paloja[i][0], paloja[i][1]];
    for (;;) {
      const k = avain(rengas[rengas.length - 1]);
      const ehdot = alkavat.get(k);
      if (!ehdot) break;
      const j = ehdot.find(n => !kaytetty[n]);
      if (j === undefined) break;
      kaytetty[j] = 1;
      rengas.push(paloja[j][1]);
      if (avain(rengas[rengas.length - 1]) === avain(rengas[0])) break;
    }
    if (rengas.length >= 4) {
      if (avain(rengas[rengas.length - 1]) !== avain(rengas[0])) rengas.push(rengas[0]);
      renkaat.push(rengas);
    }
  }
  return renkaat;
}

// ------------------------------------------------------- yksinkertaistus

function rdp(pisteet, toleranssi) {
  if (pisteet.length < 3) return pisteet;
  const pidä = new Uint8Array(pisteet.length);
  pidä[0] = 1;
  pidä[pisteet.length - 1] = 1;
  const pino = [[0, pisteet.length - 1]];
  while (pino.length) {
    const [a, b] = pino.pop();
    if (b - a < 2) continue;
    const [x1, y1] = pisteet[a];
    const [x2, y2] = pisteet[b];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const pituus = Math.hypot(dx, dy);
    let paras = -1;
    let parasI = -1;
    for (let i = a + 1; i < b; i++) {
      const [x, y] = pisteet[i];
      const d = pituus === 0
        ? Math.hypot(x - x1, y - y1)
        : Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1) / pituus;
      if (d > paras) { paras = d; parasI = i; }
    }
    if (paras > toleranssi) {
      pidä[parasI] = 1;
      pino.push([a, parasI], [parasI, b]);
    }
  }
  return pisteet.filter((_, i) => pidä[i]);
}

/*
 * Suljettu rengas pitää yksinkertaistaa kahtena kaarena, muuten alku- ja
 * loppupisteen väli jää oikaisematta ja renkaisiin tulee tekopiikkejä.
 */
function yksinkertaistaRengas(rengas, toleranssi) {
  const p = rengas.slice(0, -1);
  if (p.length < 4) return null;
  // aloitetaan kaukaisimmasta pisteparista, jotta jako ei satu mutkaan
  let kaukaisin = 0;
  let paras = -1;
  for (let i = 1; i < p.length; i++) {
    const d = Math.hypot(p[i][0] - p[0][0], p[i][1] - p[0][1]);
    if (d > paras) { paras = d; kaukaisin = i; }
  }
  const a = rdp(p.slice(0, kaukaisin + 1), toleranssi);
  const b = rdp(p.slice(kaukaisin).concat([p[0]]), toleranssi);
  const ulos = a.concat(b.slice(1, -1));
  if (ulos.length < 3) return null;
  ulos.push(ulos[0]);
  return ulos;
}

// ------------------------------------------------------------------ ala

/* Renkaan ala neliökilometreinä. Pituusaste kutistuu navoille päin. */
function alaKm2(rengas) {
  let a = 0;
  let latSumma = 0;
  for (let i = 0; i < rengas.length - 1; i++) {
    const [x1, y1] = rengas[i];
    const [x2, y2] = rengas[i + 1];
    a += x1 * y2 - x2 * y1;
    latSumma += y1;
  }
  const keskiLat = latSumma / (rengas.length - 1);
  const KM = 111.32;
  return Math.abs(a / 2) * KM * KM * Math.cos(keskiLat * Math.PI / 180);
}

// --------------------------------------------------------------- pyöristys

function pyorista(rengas, tarkkuus) {
  const kerroin = 10 ** tarkkuus;
  const ulos = [];
  for (const [x, y] of rengas) {
    const p = [Math.round(x * kerroin) / kerroin, Math.round(y * kerroin) / kerroin];
    const edellinen = ulos[ulos.length - 1];
    if (edellinen && edellinen[0] === p[0] && edellinen[1] === p[1]) continue;
    ulos.push(p);
  }
  if (ulos.length < 4) return null;
  const eka = ulos[0];
  const vika = ulos[ulos.length - 1];
  if (eka[0] !== vika[0] || eka[1] !== vika[1]) ulos.push([eka[0], eka[1]]);
  return ulos.length >= 4 ? ulos : null;
}

// ------------------------------------------------------------------- ajo

/*
 * Marching squares ajetaan KERRAN vyöhykettä kohti, ja tulos esikarsitaan
 * heti. Kokoa haarukoidaan sen jälkeen pelkällä yksinkertaistuksella,
 * joka on sekunnin murto-osa — muuten kahdentoista vyöhykkeen
 * haarukointi kestäisi tunteja.
 *
 * Esikarsinta on olemassa muistin takia. 0,1°:n ruudukolla syvänmeren
 * tasangon ääriviiva on miljoonia pisteitä, ja kahdentoista vyöhykkeen
 * raakarenkaat yhtä aikaa muistissa kaatavat ajon. Siksi jokainen
 * vyöhyke pyöristetään heti neljäsosatoleranssilla ja siitä pudotetaan
 * kahdeksasosa-alan alittavat täplät.
 *
 * Kahdesti tehty RDP ei ole sama asia kuin kerran tehty, mutta ero on
 * korkeintaan esitoleranssin verran eli neljäsosa siitä, mikä joka
 * tapauksessa hyväksytään. Suurimmat renkaat säilytetään aina, jotta
 * esikarsinta ei voi viedä sitä muotoa, jonka lopullinen kierros olisi
 * pitänyt.
 *
 * Luvut ovat KIINTEITÄ eivätkä johdettuja lopullisista kynnyksistä.
 * Näin sama välimuisti kelpaa, vaikka --toleranssia ja --vahin-alaa
 * haarukoisi: kumpikin on aina esikarsintaa karkeampi, joten esikarsittu
 * aineisto riittää niille kaikille. Jos näitä muuttaa, välimuisti on
 * mitätöitävä — siksi ne ovat myös välimuistin avaimessa.
 */
const ESIKARSINTA = { esiToleranssi: 0.03, esiAla: 375, esiMaara: 36 };
function raakarenkaat(g) {
  const { esiToleranssi, esiAla, esiMaara } = ESIKARSINTA;
  const ulos = [];
  for (const v of VYOHYKKEET) {
    const kaanna = v.puoli === 'meri' ? -1 : 1;
    const renkaat = aariviivat(g, v.metriä, kaanna);
    const ehdokkaat = [];
    for (const rengas of renkaat) {
      const yks = yksinkertaistaRengas(rengas, esiToleranssi);
      if (yks) ehdokkaat.push({ rengas: yks, ala: alaKm2(yks) });
    }
    ehdokkaat.sort((a, b) => b.ala - a.ala);
    const pidetyt = ehdokkaat
      .filter((e, i) => e.ala >= esiAla || i < esiMaara)
      .map((e) => e.rengas);
    process.stderr.write(`  ${String(v.metriä).padStart(6)} m: ${renkaat.length} raakarengasta -> ${pidetyt.length} esikarsinnan jälkeen\n`);
    ulos.push({ renkaat: pidetyt, raakoja: renkaat.length });
  }
  return ulos;
}

/*
 * Yksi vyöhyke: yksinkertaista, karsi alaltaan pienet, jätä jäljelle
 * enintään --enin-renkaat suurinta.
 *
 * --- miksi kattona renkaiden määrä eikä kireämpi toleranssi ---
 *
 * Vyöhykkeet ovat rajusti erikokoisia. Syvänmeren tasangon ääriviiva
 * kiertää jokaisen merenalaisen vuoren erikseen (4915 raakarengasta),
 * kun taas yli 5000 metrin ikilumi on sata pientä lakea. Jos kokoa
 * säädetään yhteisellä toleranssilla, se kiristyy sen mukaan mitä pahin
 * vyöhyke vaatii, ja koko linssistä tulee tasangon takia karkeampi kuin
 * kartan pysyvästä maastosta. Juuri niin kävi ensimmäisellä ajolla:
 * toleranssi karkasi 0,22 asteeseen, kun pysyvä maasto on 0,2.
 *
 * Rengaskatto osuu vain sinne, missä on rakeisuutta. Se on myös se, mitä
 * kartografiassa yleistetään ensimmäisenä: pieni kumpu jätetään pois,
 * isoa ei piirretä huonommin. Katto on löysä siellä missä ehdokkaita on
 * vähän (3000 m, 4000 m ja 5000 m mahtuvat kokonaan) ja puree siellä
 * missä niitä on tuhansia.
 *
 * Vaihtoehtona kokeiltiin pistebudjetin jakamista tasan vyöhykkeiden
 * kesken. Se epäonnistui juuri päinvastoin: mannerten kokoiset renkaat
 * söivät osuutensa yksinään, ja alangoista jäi kolmetoista jättiläistä
 * ilman yhtäkään saarta.
 */
function tuota(raaka, toleranssi, vahinAla, eninRenkaat) {
  const vyohykkeet = [];
  for (let i = 0; i < VYOHYKKEET.length; i++) {
    const kaikki = [];
    let pudotettu = 0;
    for (const rengas of raaka[i].renkaat) {
      const yks = yksinkertaistaRengas(rengas, toleranssi);
      if (!yks) { pudotettu++; continue; }
      const p = pyorista(yks, ASETUKSET.tarkkuus);
      if (!p) { pudotettu++; continue; }
      kaikki.push({ rengas: p, ala: alaKm2(p) });
    }
    // Suurimmat ensin: sekä alaraja että katto koskevat pienimpiä.
    kaikki.sort((a, b) => b.ala - a.ala);
    const kelpaavat = kaikki
      .filter((e, k) => e.ala >= vahinAla || k < ASETUKSET.vahinMaara)
      .slice(0, Math.max(eninRenkaat, ASETUKSET.vahinMaara));
    vyohykkeet.push({
      ...VYOHYKKEET[i],
      renkaat: kelpaavat.map((e) => e.rengas),
      pudotettu: pudotettu + (kaikki.length - kelpaavat.length),
      raakoja: raaka[i].raakoja,
      pisteitä: kelpaavat.reduce((s, e) => s + e.rengas.length, 0),
      pieninAla: kelpaavat.length ? Math.round(kelpaavat[kelpaavat.length - 1].ala) : 0,
    });
  }
  return vyohykkeet;
}

function kirjoita(vyohykkeet, toleranssi, vahinAla, budjetti) {
  const paiva = new Date().toISOString().slice(0, 10);
  const rivit = [];
  rivit.push('// Korkeuslinssin topografia: korkeus- ja syvyysvyöhykkeet asteina.');
  rivit.push('//');
  rivit.push('// TÄMÄ TIEDOSTO ON KONEEN KIRJOITTAMA. Älä muokkaa käsin:');
  rivit.push('//   node tools/hae-topografia.mjs');
  rivit.push('//');
  rivit.push(`// Aineisto: ${AINEISTO}`);
  rivit.push(`// Viite:    ${VIITE}`);
  rivit.push(`// Haettu:   ${paiva} osoitteesta`);
  rivit.push(`//           ${PALVELIN} (NOAA CoastWatch ERDDAP)`);
  rivit.push('// Lisenssi: Public domain — Yhdysvaltain liittovaltion viraston (NOAA)');
  rivit.push('//           tuottamana aineisto ei ole tekijänoikeuden alainen. ERDDAPin');
  rivit.push('//           oma lisenssiteksti: "The data may be used and redistributed for');
  rivit.push('//           free but is not intended for legal use, since it may contain');
  rivit.push('//           inaccuracies."');
  rivit.push('//');
  rivit.push('// Kynnykset joilla tämä ajo tehtiin:');
  rivit.push(`//   näytteenotto      ${ASETUKSET.nayte} kaariminuuttia`);
  rivit.push(`//   ruudukko          ${ASETUKSET.ruutu}° (${Math.round(ASETUKSET.ruutu * 60)} kaariminuuttia), keskiarvoistaen`);
  rivit.push(`//   sumennus          ${ASETUKSET.sumennus} x 3x3`);
  rivit.push(`//   RDP-toleranssi    ${Number(toleranssi.toFixed(4))}°`);
  rivit.push(`//   pienin rengas     ${Math.round(vahinAla)} km²`);
  rivit.push(`//   poikkeus          jokaisen vyöhykkeen ${ASETUKSET.vahinMaara} suurinta rengasta säilytetään`);
  rivit.push(`//                     aina, vaikka ne alittaisivat rajan — muuten syvänteet`);
  rivit.push('//                     ja korkeimmat huiput katoaisivat kokonaan');
  rivit.push(`//   enintään          ${budjetti} rengasta vyöhykettä kohti, suurimmat ensin`);
  const asteKm = 111.32 * 10 ** -ASETUKSET.tarkkuus;
  rivit.push(`//   koordinaatit      ${ASETUKSET.tarkkuus} desimaalia (~${asteKm < 10 ? asteKm.toFixed(1) : Math.round(asteKm)} km päiväntasaajalla)`);
  rivit.push('//');
  rivit.push('// Ruudukko, toleranssi ja vähimmäisala ovat kaikki hienompia kuin kartan');
  rivit.push('// pysyvässä maastossa (0,25°, 0,2°, 12000 km²). 400 kilotavun katto');
  rivit.push('// osutaan sen sijaan rengaskatolla: se rajaa, montako muotoa kukin');
  rivit.push('// vyöhyke saa näyttää, eikä se karkeuta yhdenkään muodon piirtoa.');
  rivit.push('// Katto puree vain siellä, missä on rakeisuutta — syvänmeren tasangon');
  rivit.push('// ääriviiva kiertää tuhansia merenalaisia vuoria, kun taas ikilumi');
  rivit.push('// mahtuu mukaan kokonaan.');
  rivit.push('//');
  rivit.push('// Tämä on eri aineisto kuin js/packs/maasto-korkeus.js. Se on kartan');
  rivit.push('// pysyvä, vaimea maasto kolmella karkealla vyöhykkeellä; tämä on linssi,');
  rivit.push('// joka näyttää saman maaston tarkemmin ja myös merenpohjan.');
  rivit.push('//');
  rivit.push('// Vyöhykkeet ovat SISÄKKÄISIÄ, eivät vieretysten: maavyöhyke on "kaikki');
  rivit.push('// tätä ylempi" ja merivyöhyke "kaikki tätä syvempi". Taulukko on');
  rivit.push('// PIIRTOJÄRJESTYKSESSÄ — piirrä alusta loppuun, jolloin syvempi jää');
  rivit.push('// matalamman päälle ja korkeampi matalamman päälle. Toisin päin');
  rivit.push('// piirretty kartta olisi yhtä läiskää.');
  rivit.push('//');
  rivit.push('// Renkaat ovat suljettuja [lon, lat] -pareja: viimeinen piste on sama');
  rivit.push('// kuin ensimmäinen. Sisäkkäinen rengas on kolo (laakso ylängön keskellä,');
  rivit.push('// matalikko syvänteen keskellä), joten täyttösäännöksi sopii evenodd.');
  rivit.push('//');
  rivit.push('// Värit ovat EHDOTUS: hypsometrinen asteikko käännettynä pelin');
  rivit.push('// sepiapaperille eli kylläisyys otettuna pois. 1000 m ja 3000 m ovat');
  rivit.push('// samat sävyt kuin kartan pysyvässä maastossa (css/styles.css), jotta');
  rivit.push('// linssi näyttää samalta maastolta tarkempana eikä toiselta kartalta.');
  rivit.push('//');
  for (const v of vyohykkeet) {
    const otsikko = `${String(v.metriä).padStart(6)} m ${v.nimi}`.padEnd(34);
    rivit.push(`//   ${otsikko} ${String(v.renkaat.length).padStart(4)} rengasta, ${String(v.pisteitä).padStart(5)} pistettä (raakoja ${v.raakoja}, pudotettu ${v.pudotettu})`);
  }
  rivit.push('');
  rivit.push('export const KORKEUSLINSSI = {');
  rivit.push('  vyohykkeet: [');
  for (const v of vyohykkeet) {
    const suunta = v.puoli === 'meri' ? 'syvemmällä kuin' : 'ylempänä kuin';
    rivit.push(`    // ${v.nimi}: kaikki ${suunta} ${v.metriä} m`);
    rivit.push('    {');
    rivit.push(`      metria: ${v.metriä},`);
    rivit.push(`      puoli: '${v.puoli}',`);
    rivit.push(`      nimi: '${v.nimi}',`);
    rivit.push(`      vari: '${v.vari}',`);
    rivit.push('      renkaat: [');
    for (const rengas of v.renkaat) {
      rivit.push('        [' + rengas.map(([x, y]) => `[${x},${y}]`).join(',') + '],');
    }
    rivit.push('      ],');
    rivit.push('    },');
  }
  rivit.push('  ],');
  rivit.push('};');
  rivit.push('');
  return rivit.join('\n');
}

/*
 * Ääriviivojen laskenta kestää minuutteja, joten esikarsittu tulos
 * talletetaan välimuistiin samaan tapaan kuin ladattu netCDF. Näin
 * pistebudjetin haarukointi ja värien viilaus eivät vaadi koko ketjun
 * ajamista uudelleen. Avaimessa on jokainen asetus, joka vaikuttaa
 * renkaisiin — muuten välimuisti tarjoilisi vanhentuneita muotoja.
 */
function esiVarasto() {
  const { nayte, ruutu, sumennus } = ASETUKSET;
  const { esiToleranssi, esiAla, esiMaara } = ESIKARSINTA;
  return join(VALIMUISTI, `esirenkaat-${nayte}-${ruutu}-${sumennus}-${esiToleranssi}-${esiAla}-${esiMaara}.json`);
}

async function haeEsirenkaat() {
  const varasto = esiVarasto();
  if (existsSync(varasto) && statSync(varasto).size > 0) {
    process.stderr.write(`esirenkaat välimuistista: ${varasto}\n`);
    return JSON.parse(readFileSync(varasto, 'utf8'));
  }
  let g = await haeRuudukko();
  process.stderr.write(`\nruudukko: ${g.leveys} x ${g.korkeus} (${g.ruutu}°)\n`);
  g = sumenna(g, ASETUKSET.sumennus);
  process.stderr.write(`sumennettu ${ASETUKSET.sumennus} kertaa\n\nääriviivat:\n`);
  const raaka = raakarenkaat(g);
  writeFileSync(varasto, JSON.stringify(raaka));
  return raaka;
}

async function main() {
  process.stderr.write(`aineisto: ${AINEISTO}\nlisenssi: ${LISENSSI}\n\n`);
  const raaka = await haeEsirenkaat();

  /*
   * Toleranssi ja vähimmäisala pysyvät paikallaan; kokoa haarukoidaan
   * rengaskatolla. Puolitushaku, koska koon ja katon suhde ei ole
   * suoraviivainen: pienenevät renkaat maksavat yhä vähemmän tavuja.
   * Ylin arvo, joka mahtuu kattoon, voittaa.
   */
  const toleranssi = ASETUKSET.toleranssi;
  const vahinAla = ASETUKSET.vahinAla;
  let ala = ASETUKSET.vahinMaara;
  let yla = ASETUKSET.eninRenkaat;
  let paras = null;
  let teksti = null;
  let vyohykkeet = null;
  process.stderr.write('\nhaarukointi:\n');

  const kokeile = (katto) => {
    const v = tuota(raaka, toleranssi, vahinAla, katto);
    const t = kirjoita(v, toleranssi, vahinAla, katto);
    const koko = Buffer.byteLength(t);
    process.stderr.write(`  enintään ${String(katto).padStart(4)} rengasta/vyöhyke -> ${(koko / 1024).toFixed(1)} kt\n`);
    return { v, t, koko, katto };
  };

  // Ensin selvitetään, mahtuuko pyydetty katto sellaisenaan.
  let koe = kokeile(yla);
  if (koe.koko <= ASETUKSET.katto) {
    paras = koe;
    // Mahtui — kokeillaan, sopisiko vielä isompi katto.
    for (let kierros = 0; kierros < 6; kierros++) {
      yla = Math.round(yla * 1.6);
      koe = kokeile(yla);
      if (koe.koko > ASETUKSET.katto) break;
      if (koe.koko === paras.koko) break; // ehdokkaat loppuivat
      paras = koe;
    }
    ala = paras.katto;
  }
  // Puolitushaku ala..yla
  while (yla - ala > 1) {
    const keski = Math.floor((ala + yla) / 2);
    koe = kokeile(keski);
    if (koe.koko <= ASETUKSET.katto) { paras = koe; ala = keski; } else yla = keski;
  }
  if (!paras) throw new Error('400 kt ei alittunut edes vähimmäismäärällä renkaita');
  vyohykkeet = paras.v;
  teksti = paras.t;
  process.stderr.write(`\nvalittu katto: ${paras.katto} rengasta/vyöhyke, ${(paras.koko / 1024).toFixed(1)} kt\n`);

  process.stderr.write('\n');
  for (const v of vyohykkeet) {
    process.stderr.write(`  ${String(v.metriä).padStart(6)} m ${v.nimi.padEnd(22)} ${String(v.renkaat.length).padStart(4)} rengasta ${String(v.pisteitä).padStart(6)} pistettä, pienin ${v.pieninAla} km²\n`);
    if (!v.renkaat.length) throw new Error(`vyöhyke ${v.metriä} m jäi tyhjäksi — sitä ei saa julkaista`);
  }

  if (ASETUKSET.kuiva) {
    process.stderr.write('\n--kuiva: mitään ei kirjoitettu\n');
    return;
  }
  writeFileSync(KOHDE, teksti);
  process.stderr.write(`\nkirjoitettu ${KOHDE} (${(Buffer.byteLength(teksti) / 1024).toFixed(1)} kt)\n`);
}

main().catch(e => { process.stderr.write('VIRHE: ' + (e.stack || e.message) + '\n'); process.exit(1); });
