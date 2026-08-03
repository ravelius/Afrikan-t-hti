/*
 * Maailman korkeusvyöhykkeet -> js/packs/maasto-korkeus.js
 *
 *   node tools/hae-korkeusvyohykkeet.mjs [--kuiva] [valitsimet]
 *
 * Tuottaa lon/lat-monikulmioita kolmelle vyöhykkeelle. Rajat ovat
 * oletuksena 1000, 2500 ja 5000 metriä ja vaihdettavissa valitsimilla
 * --keski, --ylos ja --huippu. Projisoinnista ei välitetä lainkaan —
 * ulos tulee pelkkää maantiedettä asteina, ja piirtäjä hoitaa loput.
 *
 * TÄMÄ EI OLE KORKEUSKARTTA VAAN SEN VARJO. Tavoite on että Alpit,
 * Himalaja, Andit ja Etiopian ylängöt näkyvät suurina muotoina eikä
 * jokainen kukkula. Siksi ketjussa on kolme peräkkäistä karkeuttajaa:
 *
 *   1. ruudukko alinäytteistetään 1 kaariminuutista 15 kaariminuuttiin
 *      keskiarvoistamalla — yksittäinen huippu ei enää riitä mihinkään
 *   2. ruudukko sumennetaan muutamalla 3x3-pyyhkäisyllä — rosoiset
 *      reunat pyöristyvät, kapeat harjanteet katkeavat
 *   3. VALMIISTA renkaista pudotetaan kaikki pienemmät kuin
 *      --vahin-ala neliökilometriä
 *
 * Kohta 3 on se rajoitin, joka pitää kartan siistinä. Jos kartta menee
 * tukkoon, nosta sitä äläkä lisää yksityiskohtia. Sama koskee kokoa:
 * 400 kilotavun katto ei jousta, mutta --toleranssi ja --vahin-ala
 * joustavat, eikä yhtäkään vyöhykettä saa pudottaa pois.
 *
 * Aineisto: NOAA NGDC ETOPO1 (jäänpinta, 1 kaariminuutti), haettuna
 * NOAA CoastWatchin ERDDAPista (dataset "etopo360"). Yhdysvaltain
 * liittovaltion virastojen tuottamana se on public domain.
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
// Ruudukko on parikymmentä megatavua eikä kuulu repoon. KORKEUS_VALIMUISTI
// osoittaa muualle, jos haluaa säilyttää sen ajojen välillä.
const VALIMUISTI = process.env.KORKEUS_VALIMUISTI || join(tmpdir(), 'matkakirja-korkeus');
const KOHDE = join(JUURI, 'js', 'packs', 'maasto-korkeus.js');

const PALVELIN = 'https://coastwatch.pfeg.noaa.gov/erddap/griddap/etopo360';
const AINEISTO = 'NOAA NGDC ETOPO1 Global Relief Model, Ice Surface, 1 kaariminuutti';
const VIITE = 'Amante & Eakins 2009, NOAA NCEI, doi:10.7289/V5C8276M';
const LISENSSI = 'Public domain (US Government work). ERDDAPin lisenssiteksti: '
  + '"The data may be used and redistributed for free but is not intended for legal use, '
  + 'since it may contain inaccuracies."';

// ETOPO1:n ruudukko: 10801 x 21601, lat -90..90, lon 0..360.
const LAT_N = 10801;
const LON_N = 21601;

// ---------------------------------------------------------------- valitsimet

function valitsin(nimi, oletus) {
  const i = process.argv.indexOf('--' + nimi);
  if (i < 0) return oletus;
  const arvo = process.argv[i + 1];
  return arvo === undefined || arvo.startsWith('--') ? true : Number(arvo);
}

const ASETUKSET = {
  kuiva: process.argv.includes('--kuiva'),
  // näytteenottoväli latauksessa, kaariminuutteina
  nayte: valitsin('nayte', 5),
  // lopullinen ruutukoko asteina
  ruutu: valitsin('ruutu', 0.25),
  // montako 3x3-sumennusta. Yksi riittää: nollalla Andien ketju hajoaa
  // pisteiksi, kahdella Etiopian ylängöt kutistuvat kohtuuttomasti.
  sumennus: valitsin('sumennus', 1),
  // Ramer-Douglas-Peucker, asteina
  toleranssi: valitsin('toleranssi', 0.2),
  // Pienin säilytettävä rengas, neliökilometreinä — tämä on se rajoitin.
  // 12000 km² on noin 110 x 110 km. Puolittaminen toi 24 rengasta lisää
  // eikä yhtäkään uutta tunnistettavaa muotoa, vain täpliä.
  vahinAla: valitsin('vahin-ala', 12000),
  katto: valitsin('katto', 400 * 1024),
  /*
   * Vyöhykkeiden rajat metreinä.
   *
   * Ylin oli aluksi 4000 m, koska se on Alpeilla ja Andeilla suunnilleen
   * lumiraja. Himalajalla se ei ole: siellä lumiraja on noin 5000 m, ja
   * koko Tiibetin ylätasanko on yli neljä kilometriä korkealla. Valkoinen
   * täyttö levisi siis tasangon kokoiseksi läiskäksi, joka näytti kartan
   * repeämältä (omistajan havainto: "Himalaja näyttää reiältä").
   *
   * 5000 m jättää tasangon ruskeaksi ja valkoisen sinne, missä lunta
   * oikeasti on: Himalajan ja Karakoramin harjanteelle sekä Andien
   * korkeimpaan osaan. Nauha lukeutuu vuoristoksi, läiskä ei.
   */
  keski: valitsin('keski', 1000),
  ylos: valitsin('ylos', 2500),
  huippu: valitsin('huippu', 5000),
};

const RAJAT = [
  { avain: 'keski', metriä: ASETUKSET.keski },
  { avain: 'ylos', metriä: ASETUKSET.ylos },
  { avain: 'huippu', metriä: ASETUKSET.huippu },
];

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
 * Hakee ETOPO1:n harvennettuna. Palvelin ei anna koko ruudukkoa kerralla
 * eikä sitä tarvitakaan: --nayte kaariminuutin välein poimittu ruudukko
 * on jo moninkertaisesti tarkempi kuin lopputulos.
 */
async function haeRuudukko() {
  mkdirSync(VALIMUISTI, { recursive: true });
  const askel = ASETUKSET.nayte;
  const latIndeksit = [];
  for (let i = 0; i < LAT_N; i += askel) latIndeksit.push(i);
  const lonIndeksit = [];
  for (let i = 0; i < LON_N; i += askel) lonIndeksit.push(i);

  const KAISTA = 240; // riviä kerrallaan
  const rivit = new Array(latIndeksit.length);
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
      rivit[a + r] = data.slice(r * muoto[1], (r + 1) * muoto[1]);
    }
  }
  return {
    rivit,
    lat: latIndeksit.map(i => -90 + i / 60),
    lon: lonIndeksit.map(i => i / 60), // 0..360
  };
}

// ------------------------------------------------------- ruudukon karkeutus

/*
 * Alinäytteistää keskiarvoistamalla ja kääntää pituusasteet välille
 * [-180, 180]. Reunoihin lisätään syvä valli, jotta jokainen ääriviiva
 * sulkeutuu ruudukon sisällä eikä jää auki laudan laidalle.
 *
 * Pituusaste kierretään: sarakkeet -180 ja +180 ovat sama meridiaani
 * kahdesti, joten päivämääränrajan yli menevä muoto katkeaa siististi
 * kahdeksi renkaaksi sen sijaan että vetäisi viivan halki kartan.
 */
function karkeuta(raaka) {
  const ruutu = ASETUKSET.ruutu;
  const leveys = Math.round(360 / ruutu) + 1; // -180 .. +180, molemmat mukana
  const korkeus = Math.round(180 / ruutu) + 1; // -90 .. +90
  const summa = new Float64Array(leveys * korkeus);
  const maara = new Float64Array(leveys * korkeus);

  for (let r = 0; r < raaka.rivit.length; r++) {
    const lat = raaka.lat[r];
    const rivi = raaka.rivit[r];
    const y = Math.min(korkeus - 1, Math.max(0, Math.round((lat + 90) / ruutu)));
    for (let c = 0; c < rivi.length; c++) {
      const lon = raaka.lon[c] > 180 ? raaka.lon[c] - 360 : raaka.lon[c];
      const x = Math.min(leveys - 1, Math.max(0, Math.round((lon + 180) / ruutu)));
      summa[y * leveys + x] += rivi[c];
      maara[y * leveys + x] += 1;
      // 0 ja 360 osuvat samaan meridiaaniin: kirjataan molempiin reunoihin
      if (x === 0) { summa[y * leveys + leveys - 1] += rivi[c]; maara[y * leveys + leveys - 1] += 1; }
      if (x === leveys - 1) { summa[y * leveys] += rivi[c]; maara[y * leveys] += 1; }
    }
  }

  const z = new Float64Array(leveys * korkeus);
  for (let i = 0; i < z.length; i++) z[i] = maara[i] ? summa[i] / maara[i] : -9999;
  return { z, leveys, korkeus, ruutu };
}

/* Kolmen kertaa kolmen keskiarvo. Tämä on se, mikä tekee "suuret linjat". */
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
 * Satulatapaukset (5 ja 10) ratkaistaan neljän kulman keskiarvolla,
 * mikä on tavanomainen ja tässä käytännössä yhdentekevä valinta:
 * kapeat solmut katoavat joka tapauksessa sumennuksessa.
 */
function aariviivat(g, taso) {
  const { leveys, korkeus, ruutu, z } = g;
  const L = leveys + 2;
  const K = korkeus + 2;
  const kehys = new Float64Array(L * K).fill(-9999);
  for (let y = 0; y < korkeus; y++) {
    for (let x = 0; x < leveys; x++) kehys[(y + 1) * L + (x + 1)] = z[y * leveys + x];
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
        case 5: {
          const keski = (v0 + v1 + v2 + v3) / 4;
          if (keski >= taso) { lisaa(vasen(), ala()); lisaa(oikea(), yla()); }
          else { lisaa(vasen(), yla()); lisaa(ala(), oikea()); }
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

function pyorista(rengas) {
  const ulos = [];
  for (const [x, y] of rengas) {
    const p = [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
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

function tuota(g, toleranssi, vahinAla) {
  const vyohykkeet = {};
  const tilasto = {};
  for (const { avain, metriä } of RAJAT) {
    const raa = aariviivat(g, metriä);
    let pudotettu = 0;
    const ulos = [];
    for (const rengas of raa) {
      const yks = yksinkertaistaRengas(rengas, toleranssi);
      if (!yks) { pudotettu++; continue; }
      if (alaKm2(yks) < vahinAla) { pudotettu++; continue; }
      const p = pyorista(yks);
      if (!p) { pudotettu++; continue; }
      ulos.push(p);
    }
    vyohykkeet[avain] = ulos;
    tilasto[avain] = {
      raakoja: raa.length,
      pudotettu,
      renkaita: ulos.length,
      pisteitä: ulos.reduce((s, r) => s + r.length, 0),
    };
  }
  return { vyohykkeet, tilasto };
}

function kirjoita(vyohykkeet, tilasto, toleranssi, vahinAla) {
  const rivit = [];
  rivit.push('// Maailman korkeusvyöhykkeet leveys- ja pituusasteina.');
  rivit.push('//');
  rivit.push('// TÄMÄ TIEDOSTO ON KONEEN KIRJOITTAMA. Älä muokkaa käsin:');
  rivit.push('//   node tools/hae-korkeusvyohykkeet.mjs');
  rivit.push('//');
  rivit.push(`// Aineisto: ${AINEISTO}`);
  rivit.push(`// Viite:    ${VIITE}`);
  rivit.push(`// Haettu:   ${PALVELIN} (NOAA CoastWatch ERDDAP)`);
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
  rivit.push(`//   RDP-toleranssi    ${toleranssi}°`);
  rivit.push(`//   pienin rengas     ${vahinAla} km² — tätä pienemmät alueet pudotetaan KOKONAAN`);
  rivit.push('//');
  rivit.push('// Vyöhykkeet ovat SISÄKKÄISIÄ, eivät vieretysten. keski on kaikki');
  rivit.push(`// yli ${ASETUKSET.keski} m, ylos kaikki yli ${ASETUKSET.ylos} m ja huippu kaikki yli ${ASETUKSET.huippu} m.`);
  rivit.push('// Piirrä siis järjestyksessä keski -> ylos -> huippu, jolloin näkyviin');
  rivit.push(`// jäävä keski-alue on juuri ${ASETUKSET.keski}-${ASETUKSET.ylos} m ja ylos juuri ${ASETUKSET.ylos}-${ASETUKSET.huippu} m.`);
  rivit.push('// Renkaat ovat suljettuja: viimeinen piste on sama kuin ensimmäinen.');
  rivit.push('// Sisäkkäinen rengas on kolo (esim. laakso ylängön keskellä), joten');
  rivit.push('// täyttösäännöksi sopii parhaiten evenodd.');
  rivit.push('//');
  rivit.push('// Tämä ei ole korkeuskartta vaan sen karkea varjo: yksityiskohdat on');
  rivit.push('// tarkoituksella hävitetty, jotta Alpit, Himalaja, Andit ja Etiopian');
  rivit.push('// ylängöt näkyvät suurina muotoina eikä kartta mene tukkoon.');
  rivit.push('//');
  for (const { avain, metriä } of RAJAT) {
    const t = tilasto[avain];
    rivit.push(`//   ${avain.padEnd(7)} yli ${String(metriä).padStart(4)} m: ${String(t.renkaita).padStart(4)} rengasta, ${String(t.pisteitä).padStart(5)} pistettä (${t.pudotettu} pudotettu)`);
  }
  rivit.push('');
  rivit.push('export const KORKEUSVYOHYKKEET = {');
  for (const { avain, metriä } of RAJAT) {
    const selite = avain === 'keski' ? `${ASETUKSET.keski}-${ASETUKSET.ylos} m`
      : avain === 'ylos' ? `${ASETUKSET.ylos}-${ASETUKSET.huippu} m`
        : `yli ${ASETUKSET.huippu} m (lumi)`;
    rivit.push(`  // ${selite}`);
    rivit.push(`  ${avain}: [`);
    for (const rengas of vyohykkeet[avain]) {
      rivit.push('    [' + rengas.map(([x, y]) => `[${x},${y}]`).join(',') + '],');
    }
    rivit.push('  ],');
  }
  rivit.push('};');
  rivit.push('');
  return rivit.join('\n');
}

async function main() {
  process.stderr.write(`aineisto: ${AINEISTO}\nlisenssi: ${LISENSSI}\n\n`);
  const raaka = await haeRuudukko();
  process.stderr.write(`\nruudukko ladattu: ${raaka.rivit.length} x ${raaka.rivit[0].length}\n`);
  let g = karkeuta(raaka);
  process.stderr.write(`karkeutettu: ${g.leveys} x ${g.korkeus} (${g.ruutu}°)\n`);
  g = sumenna(g, ASETUKSET.sumennus);
  process.stderr.write(`sumennettu ${ASETUKSET.sumennus} kertaa\n\n`);

  // Jos 400 kt ylittyy, kiristetään yksinkertaistusta ja alarajaa —
  // vyöhykkeitä ei pudoteta.
  let toleranssi = ASETUKSET.toleranssi;
  let vahinAla = ASETUKSET.vahinAla;
  let teksti = null;
  let tilasto = null;
  let vyohykkeet = null;
  for (let kierros = 0; kierros < 12; kierros++) {
    const t = tuota(g, toleranssi, vahinAla);
    vyohykkeet = t.vyohykkeet;
    tilasto = t.tilasto;
    teksti = kirjoita(vyohykkeet, tilasto, toleranssi, vahinAla);
    const koko = Buffer.byteLength(teksti);
    process.stderr.write(`kierros ${kierros}: toleranssi ${toleranssi.toFixed(2)}°, vähin ala ${Math.round(vahinAla)} km² -> ${(koko / 1024).toFixed(1)} kt\n`);
    for (const { avain } of RAJAT) {
      const s = tilasto[avain];
      process.stderr.write(`   ${avain.padEnd(7)} ${String(s.renkaita).padStart(4)} rengasta ${String(s.pisteitä).padStart(6)} pistettä (raakoja ${s.raakoja}, pudotettu ${s.pudotettu})\n`);
    }
    if (koko <= ASETUKSET.katto) break;
    toleranssi *= 1.25;
    vahinAla *= 1.6;
  }
  if (Buffer.byteLength(teksti) > ASETUKSET.katto) {
    throw new Error('400 kt ei alittunut — nosta --toleranssi ja --vahin-ala käsin');
  }

  if (ASETUKSET.kuiva) {
    process.stderr.write('\n--kuiva: mitään ei kirjoitettu\n');
    return;
  }
  writeFileSync(KOHDE, teksti);
  process.stderr.write(`\nkirjoitettu ${KOHDE} (${(Buffer.byteLength(teksti) / 1024).toFixed(1)} kt)\n`);
}

main().catch(e => { process.stderr.write('VIRHE: ' + (e.stack || e.message) + '\n'); process.exit(1); });
