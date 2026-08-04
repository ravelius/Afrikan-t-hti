/*
 * Tuulivyöhykkeet, merivirrat ja monsuuni -> js/packs/linssi-tuulet.js
 *
 *   NODE_USE_ENV_PROXY=1 node tools/hae-tuulet.mjs [--kuiva]
 *
 * Linssi selittää pelin omat merireitit: miksi purjelaiva kulkee juuri
 * sitä kaarta eikä suoraan, ja miksi paluu on eri reitti kuin meno.
 *
 * --- mikä tässä on mitattua ja mikä piirrettyä ---
 *
 * Kaksi eri asiaa, eikä niitä saa sekoittaa:
 *
 *   TUULET ovat mitattuja. Vyöhykkeiden rajat, suunnat ja nopeudet
 *   lasketaan tässä ICOADSin laivahavainnoista. Yhtään tuulilukua ei ole
 *   kirjoitettu käsin — ne kaikki tulevat aineistosta.
 *
 *   VIRTOJEN VIIVAT ovat piirrettyjä. Merivirran keskiviivalle ei ole
 *   koneluettavaa lähdettä: virta on leveä ja mutkitteleva vyöhyke, ei
 *   viiva, ja jokainen kartta piirtää sen hieman eri paikkaan. Viivat on
 *   siis piirretty käsin oppikirjakarttojen mukaan parin asteen
 *   tarkkuudella — mutta jokainen niistä TARKISTETAAN mittausaineistoa
 *   vastaan (OSCAR), ja ajo kaatuu, jos viiva kulkee väärään suuntaan.
 *   Virran nopeus ja lämpöero ovat mitattuja, eivät käsin kirjoitettuja.
 *
 * Tämä on opetuspeli. Väärä luku on pahempi kuin puuttuva luku, joten
 * tarkistukset ovat portteja eivätkä varoituksia: jos mittaus on eri
 * mieltä kuin käsin piirretty viiva, tiedostoa ei kirjoiteta.
 *
 * --- miksi juuri ICOADS ---
 *
 * ICOADS on laivojen havaintoja. Sen vanhimmat merkinnät ovat 1600-luvun
 * laivapäiväkirjoista, ja juuri niistä sama tieto koottiin 1800-luvulla
 * purjehdusohjeiksi (Maury 1855). Käytämme vuosien 1971–2000 pitkän
 * ajan keskiarvoa, koska se on tasaisin ja tiheimmin havaittu jakso —
 * mutta pasaatit ja länsituulet ovat samat vyöhykkeet, joita purjelaivat
 * käyttivät. Uusanalyysimalli antaisi saman kuvan, mutta laivahavainto
 * on tässä aiheessa oikea lähde myös hengeltään.
 *
 * --- miksi monsuunisektori jätetään vyöhykelaskusta pois ---
 *
 * Vyöhykejako (pasaatit, hevosleveydet, länsituulet) on kolmen kierron
 * malli, joka pätee valtamerten yllä. Intian valtamerellä se ei päde:
 * siellä manner kääntää tuulen puolivuosittain, ja jos monsuunialue
 * lasketaan mukaan, se vetää pohjoisen pasaatin keskiarvon vinoon.
 * Siksi vyöhykeluvut lasketaan ilman ruutuja, jotka ovat välillä
 * 30–120° itäistä pituutta ja 15° etelästä 30° pohjoiseen. Monsuuni
 * saa oman osionsa, jossa se lasketaan erikseen kesältä ja talvelta.
 *
 * --- miksi vyöhykkeiden rajat lasketaan eikä kopioida ---
 *
 * Oppikirja sanoo "pasaatit noin 30. leveysasteelta päiväntasaajalle".
 * Se on totta mutta pyöristetty. Rajat, joilla on fysikaalinen merkitys,
 * saa suoraan aineistosta: kohdat, joissa itä–länsi-suuntainen tuuli
 * vaihtaa merkkiä, ovat hevosleveydet (pasaatin ja länsituulten raja) ja
 * napaseudun raja; kohta, jossa pohjois–etelä-suuntainen tuuli vaihtaa
 * merkkiä, on ITCZ eli tyvenvyöhykkeen keskiviiva. Ne lasketaan tässä
 * lineaarisella interpoloinnilla, ja tulos on merkitty kentällä
 * raja: 'mitattu'.
 *
 * Kaksi rajaa ei ole mitattavissa, ja ne on merkitty raja: 'sopimus':
 * tyvenvyöhykkeen ja hevosleveyksien LEVEYS (kumpikin noin 10° ja 5°,
 * kirjallisuuden luku — mitattavissa on vain keskiviivan paikka) sekä
 * karjuvat nelikymmenluvut, joka on nimensä mukaisesti 40.–50. aste.
 *
 * --- verkko ---
 *
 * Noden fetch ei lue HTTPS_PROXYa ilman NODE_USE_ENV_PROXYa, ks.
 * tools/hae-radiot.mjs. Alla oleva lohko käynnistää itsensä uudelleen,
 * jos muuttuja puuttuu. Haetut taulukot ovat megatavuja eivätkä kuulu
 * repoon, joten ne jäävät väliaikaiskansioon; TUULET_VALIMUISTI
 * osoittaa muualle, jos ne haluaa säilyttää ajojen välillä.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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
const VALIMUISTI = process.env.TUULET_VALIMUISTI || join(tmpdir(), 'matkakirja-tuulet');
const KOHDE = join(JUURI, 'js', 'packs', 'linssi-tuulet.js');
const kuiva = process.argv.includes('--kuiva');

const ERDDAP = 'https://coastwatch.pfeg.noaa.gov/erddap/griddap';
const TUULIAINEISTO = 'esrlIcoads2gec71_LonPM180';
const VIRTA_AINEISTO = 'jplOscar';

const HAETTU = new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------- apurit

const pyorista = (x, n = 1) => Number(x.toFixed(n));
const asteiksi = (a) => (a * 180) / Math.PI;
const radiaaneiksi = (a) => (a * Math.PI) / 180;

/**
 * Meteorologinen tuulen suunta: MISTÄ tuulee, asteina pohjoisesta
 * myötäpäivään. u on itään ja v pohjoiseen osoittava komponentti, joten
 * tuulen tulosuunta on vastakkainen vektorille.
 */
const mistaAste = (u, v) => (asteiksi(Math.atan2(-u, -v)) + 360) % 360;

/*
 * Kuusitoista ilmansuuntaa kahdeksan sijaan.
 *
 * Kahdeksan suuntaa antaisi koillispasaatille nimen "itä", koska sen
 * mitattu keskisuunta on 68° eikä 45°. Se olisi harhaanjohtavaa juuri
 * siinä kohdassa, jossa lukija vertaa nimeä ja lukua toisiinsa.
 */
const ILMANSUUNNAT = [
  'pohjoinen', 'pohjoiskoillinen', 'koillinen', 'itäkoillinen',
  'itä', 'itäkaakko', 'kaakko', 'eteläkaakko',
  'etelä', 'etelälounas', 'lounas', 'länsilounas',
  'länsi', 'länsiluode', 'luode', 'pohjoisluode',
];
const ilmansuunta = (aste) => ILMANSUUNNAT[Math.round((((aste % 360) + 360) % 360) / 22.5) % 16];

/** Kulmien ero asteina, aina 0–180. */
const kulmaero = (a, b) => {
  const d = Math.abs(((a - b) % 360) + 360) % 360;
  return d > 180 ? 360 - d : d;
};

/** Nollakohta kahden mittauspisteen välillä, lineaarisesti. */
const nollakohta = (x1, y1, x2, y2) => x1 + ((x2 - x1) * (0 - y1)) / (y2 - y1);

const nouda = async (url, yrityksia = 6) => {
  for (let i = 1; i <= yrityksia; i += 1) {
    try {
      const vastaus = await fetch(url, { signal: AbortSignal.timeout(300000) });
      if (vastaus.ok) return await vastaus.text();
      console.log(`  ${vastaus.status} — yritys ${i}/${yrityksia}`);
    } catch (virhe) {
      console.log(`  ${virhe.message} — yritys ${i}/${yrityksia}`);
    }
    await new Promise((s) => { setTimeout(s, 8000 * i); });
  }
  throw new Error(`haku ei onnistunut: ${url}`);
};

/** Hakee ja tallettaa välimuistiin. Sama tiedosto ei lataudu kahdesti. */
const noudaVarastoon = async (nimi, url) => {
  mkdirSync(VALIMUISTI, { recursive: true });
  const polku = join(VALIMUISTI, nimi);
  if (existsSync(polku)) {
    console.log(`  ${nimi} välimuistista`);
    return readFileSync(polku, 'utf8');
  }
  console.log(`  haetaan ${nimi}`);
  const teksti = await nouda(url);
  writeFileSync(polku, teksti);
  console.log(`  ${nimi}: ${Math.round(teksti.length / 1024)} kt`);
  return teksti;
};

/** ERDDAPin csv: kaksi otsikkoriviä (nimet ja yksiköt), sitten rivit. */
const csvRivit = (teksti) => {
  const rivit = teksti.split('\n');
  const nimet = rivit[0].split(',');
  const ulos = [];
  for (let i = 2; i < rivit.length; i += 1) {
    if (!rivit[i]) continue;
    const osat = rivit[i].split(',');
    const rivi = {};
    for (let k = 0; k < nimet.length; k += 1) {
      const arvo = osat[k];
      rivi[nimet[k]] = arvo === '' || arvo === 'NaN' ? null : arvo;
    }
    ulos.push(rivi);
  }
  return ulos;
};

// -------------------------------------------------------- ICOADS: tuulet

/*
 * ICOADSin ruudukko on 2°: leveysasteet 89 … -89 ja pituusasteet
 * -179 … 179, eli ruudun keskipisteet. Kuukausia on 12 ja ne ovat
 * järjestyksessä tammikuusta joulukuuhun — tarkistaLampoKierto()
 * varmistaa sen aineistosta itsestään, koska aikaleimat ovat vuoden 1
 * tienoilla eivätkä kerro kuukautta suoraan.
 */
const LAT_N = 90;
const LON_N = 180;
const latAste = (i) => 89 - i * 2;
const lonAste = (i) => -179 + i * 2;
const latIndeksi = (lat) => Math.round((89 - lat) / 2);
const lonIndeksi = (lon) => Math.round((lon + 179) / 2);

const haeIcoads = async () => {
  const alue = '[0:1:11][0:1:89][0:1:179]';
  const muuttujat = ['uwnd', 'vwnd', 'wspd', 'sst'].map((v) => `${v}${alue}`).join(',');
  const teksti = await noudaVarastoon('icoads.csv', `${ERDDAP}/${TUULIAINEISTO}.csv?${muuttujat}`);

  // [kuukausi][lat][lon] -> { u, v, nopeus, sst }
  const kentta = Array.from({ length: 12 }, () => Array.from({ length: LAT_N }, () => new Array(LON_N).fill(null)));
  const ajat = new Map();
  for (const rivi of csvRivit(teksti)) {
    if (!ajat.has(rivi.time)) ajat.set(rivi.time, ajat.size);
    const kk = ajat.get(rivi.time);
    const i = latIndeksi(Number(rivi.latitude));
    const j = lonIndeksi(Number(rivi.longitude));
    if (rivi.uwnd === null || rivi.vwnd === null) {
      // Lämpötila voi olla olemassa vaikka tuuli puuttuisi.
      if (rivi.sst !== null) kentta[kk][i][j] = { u: null, v: null, nopeus: null, sst: Number(rivi.sst) };
      continue;
    }
    kentta[kk][i][j] = {
      u: Number(rivi.uwnd),
      v: Number(rivi.vwnd),
      nopeus: rivi.wspd === null ? null : Number(rivi.wspd),
      sst: rivi.sst === null ? null : Number(rivi.sst),
    };
  }
  if (ajat.size !== 12) throw new Error(`ICOADSista tuli ${ajat.size} kuukautta, odotettiin 12`);
  return kentta;
};

/*
 * Kuukausijärjestyksen tarkistus.
 *
 * Aineiston aikaleimat ovat vuoden 1 tienoilla (0000-12-30, 0001-01-30,
 * …), eivätkä ne kerro suoraan mikä kuukausi on kyseessä. Väärä
 * järjestys kääntäisi monsuunin ympäri — kesästä tulisi talvi — eikä
 * sitä huomaisi mistään muusta kuin siitä, että kartta on väärin päin.
 * Siksi järjestys todistetaan aineistosta: pohjoisen pallonpuoliskon
 * meri on lämpimimmillään loppukesästä ja kylmimmillään loppu-
 * talvesta. Jos indeksi 0 ei ole tammikuu, tämä kaatuu.
 */
const tarkistaLampoKierto = (kentta) => {
  const keskiLampo = (kk) => {
    let summa = 0;
    let n = 0;
    for (let i = 0; i < LAT_N; i += 1) {
      const lat = latAste(i);
      if (lat < 25 || lat > 55) continue;
      for (let j = 0; j < LON_N; j += 1) {
        const s = kentta[kk][i][j];
        if (!s || s.sst === null) continue;
        summa += s.sst;
        n += 1;
      }
    }
    return summa / n;
  };
  const lammot = Array.from({ length: 12 }, (_, kk) => keskiLampo(kk));
  const lampimin = lammot.indexOf(Math.max(...lammot));
  const kylmin = lammot.indexOf(Math.min(...lammot));
  console.log(`  kuukausijärjestys: lämpimin kk ${lampimin + 1}, kylmin kk ${kylmin + 1}`);
  if (lampimin < 6 || lampimin > 8) {
    throw new Error(`pohjoisen meren lämpöhuippu osui kuukauteen ${lampimin + 1} — kuukausijärjestys ei ole tammikuusta alkava`);
  }
  if (kylmin > 2 && kylmin < 11) {
    throw new Error(`pohjoisen meren lämpöpohja osui kuukauteen ${kylmin + 1} — kuukausijärjestys ei ole tammikuusta alkava`);
  }
};

/** Monsuunisektori jätetään vyöhykelaskun ulkopuolelle, ks. otsikko. */
const MONSUUNISEKTORI = { lonMin: 30, lonMax: 120, latMin: -15, latMax: 30 };
const monsuunissa = (lat, lon) => lon >= MONSUUNISEKTORI.lonMin && lon <= MONSUUNISEKTORI.lonMax
  && lat >= MONSUUNISEKTORI.latMin && lat <= MONSUUNISEKTORI.latMax;

/**
 * Leveysasteittainen keskituuli: vektorikeskiarvo (u, v), skalaarinen
 * keskinopeus ja vakaus.
 *
 * Vakaus on purjehtijan luku, ja se lasketaan RUUDUITTAIN eikä koko
 * kaistasta: yhden ruudun yhden kuukauden vektorikeskiarvon pituus
 * jaettuna saman ruudun skalaarisella keskinopeudella. ICOADSissa
 * uwnd/vwnd on kuukauden havaintojen vektorikeskiarvo ja wspd samojen
 * havaintojen nopeuksien keskiarvo, joten suhde kertoo, kuinka usein
 * tuuli oli samasta suunnasta — 0,9 tarkoittaa lähes muuttumatonta
 * pasaattia, 0,3 kovaa mutta suunnaltaan vaihtelevaa länsituulta.
 *
 * Jos vakaus laskettaisiin vasta kaistan keskiarvoista, se mittaisi
 * lisäksi sitä, kuinka samansuuntainen tuuli on kaistan eri laidoilla —
 * eli tekisi jokaisesta leveästä vyöhykkeestä epävakaan. Se ei ole se,
 * mitä purjehtija tuntee yhdessä paikassa.
 */
const leveysprofiili = (kentta, kuukaudet) => {
  const profiili = [];
  for (let i = 0; i < LAT_N; i += 1) {
    const lat = latAste(i);
    let u = 0;
    let v = 0;
    let nopeus = 0;
    let vakaus = 0;
    let n = 0;
    for (const kk of kuukaudet) {
      for (let j = 0; j < LON_N; j += 1) {
        const s = kentta[kk][i][j];
        if (!s || s.u === null || s.nopeus === null || s.nopeus <= 0) continue;
        if (monsuunissa(lat, lonAste(j))) continue;
        u += s.u;
        v += s.v;
        nopeus += s.nopeus;
        vakaus += Math.min(1, Math.hypot(s.u, s.v) / s.nopeus);
        n += 1;
      }
    }
    profiili.push(n < 12 ? { lat, n } : {
      lat, u: u / n, v: v / n, nopeus: nopeus / n, vakaus: vakaus / n, n,
    });
  }
  return profiili;
};

/** Etsii leveysasteen, jolla profiilin kenttä vaihtaa merkkiä. */
const merkinvaihto = (profiili, kentta, latMin, latMax, suunta) => {
  const osa = profiili.filter((p) => p.u !== undefined && p.lat >= latMin && p.lat <= latMax)
    .sort((a, b) => a.lat - b.lat);
  for (let i = 1; i < osa.length; i += 1) {
    const a = osa[i - 1];
    const b = osa[i];
    if (suunta === 'nouseva' && a[kentta] < 0 && b[kentta] >= 0) return nollakohta(a.lat, a[kentta], b.lat, b[kentta]);
    if (suunta === 'laskeva' && a[kentta] > 0 && b[kentta] <= 0) return nollakohta(a.lat, a[kentta], b.lat, b[kentta]);
  }
  throw new Error(`merkinvaihtoa ei löytynyt: ${kentta} välillä ${latMin}…${latMax}`);
};

/** Vyöhykkeen mitatut luvut: suunta, nopeus, vakaus ja ydinleveys. */
const kaistanMittaus = (profiili, etela, pohjoinen) => {
  let u = 0;
  let v = 0;
  let nopeus = 0;
  let vakaus = 0;
  let paino = 0;
  let ydin = null;
  for (const p of profiili) {
    if (p.u === undefined || p.lat < etela || p.lat > pohjoinen) continue;
    // Leveyspiirin pituus lyhenee napoja kohti, joten kaista painotetaan.
    const w = Math.cos(radiaaneiksi(p.lat)) * p.n;
    u += p.u * w;
    v += p.v * w;
    nopeus += p.nopeus * w;
    vakaus += p.vakaus * w;
    paino += w;
    const vahvuus = Math.hypot(p.u, p.v);
    if (!ydin || vahvuus > ydin.vahvuus) ydin = { lat: p.lat, vahvuus };
  }
  if (!paino) throw new Error(`tyhjä kaista ${etela}…${pohjoinen}`);
  const ku = u / paino;
  const kv = v / paino;
  return {
    u: pyorista(ku, 1),
    v: pyorista(kv, 1),
    mista: pyorista(mistaAste(ku, kv), 0),
    suunta: ilmansuunta(mistaAste(ku, kv)),
    nopeus: pyorista(nopeus / paino, 1),
    vakaus: pyorista(vakaus / paino, 2),
    ydin: pyorista(ydin.lat, 0),
  };
};

// -------------------------------------------------------- OSCAR: virrat

/*
 * OSCARin ruudukko on 1/3° ja pituusasteet 20…420, jotta valtameret
 * eivät katkeaisi kesken. Muunnos pelin koordinaateista on siis
 * lon < 20 ? lon + 360 : lon.
 *
 * Aika: tällä palvelimella on 118 viiden vuorokauden koostetta väliltä
 * 2011-12 … 2014-10. Otamme joka kuudennen eli noin 20 näytettä yli
 * kolmen vuoden, jolloin keskiarvoon tulee kaikki vuodenajat. Se ei ole
 * ilmastollinen keskiarvo eikä sellaiseksi väitetä: sitä käytetään vain
 * virran SUUNNAN ja suuruusluokan tarkistamiseen.
 */
const oscarLon = (lon) => (lon < 20 ? lon + 360 : lon);

const OSCAR_LON_ALKU = 20;
const OSCAR_LON_LOPPU = 419.6;

const haeVirtaruutu = async (avain, laatikko) => {
  const askel = laatikko.koko || laatikko.lonMax - laatikko.lonMin > 60 ? 6 : 2;
  /*
   * Pituusasteikko 20…420 ei ala nollasta, joten laatikko voi mennä sen
   * alkukohdan yli (esim. Agulhas ulottuu 19,5 asteeseen). Silloin
   * ikkuna aloitetaan ruudukon alusta: puolen asteen kaistale jää pois,
   * mutta näytteenoton säde ottaa sen takaisin naapuriruuduista.
   */
  let alkuLon = laatikko.koko ? OSCAR_LON_ALKU : oscarLon(laatikko.lonMin);
  let loppuLon = laatikko.koko ? OSCAR_LON_LOPPU : oscarLon(laatikko.lonMax);
  if (alkuLon > loppuLon) alkuLon = OSCAR_LON_ALKU;
  alkuLon = Math.max(OSCAR_LON_ALKU, alkuLon);
  loppuLon = Math.min(OSCAR_LON_LOPPU, loppuLon);

  const alue = '[0:6:117][0]'
    + `[(${pyorista(laatikko.latMax, 2)}):${askel}:(${pyorista(laatikko.latMin, 2)})]`
    + `[(${pyorista(alkuLon, 2)}):${askel}:(${pyorista(loppuLon, 2)})]`;
  // Laatikon mitat ovat tiedostonimessä: jos viivaa siirretään, vanha
  // välimuisti ei kelpaa enää ja uusi haku lähtee itsestään.
  const nimi = `oscar-${avain}-${[laatikko.latMin, laatikko.latMax, alkuLon, loppuLon]
    .map((x) => Math.round(x)).join('_')}.csv`;
  const teksti = await noudaVarastoon(nimi, `${ERDDAP}/${VIRTA_AINEISTO}.csv?u${alue},v${alue}`);

  // Ruuduittainen keskiarvo yli kaikkien näytteiden.
  const ruudut = new Map();
  for (const rivi of csvRivit(teksti)) {
    if (rivi.u === null || rivi.v === null) continue;
    const lat = Number(rivi.latitude);
    let lon = Number(rivi.longitude);
    if (lon > 180) lon -= 360;
    const avainRuutu = `${lat.toFixed(3)}|${lon.toFixed(3)}`;
    const s = ruudut.get(avainRuutu) ?? { lat, lon, u: 0, v: 0, n: 0 };
    s.u += Number(rivi.u);
    s.v += Number(rivi.v);
    s.n += 1;
    ruudut.set(avainRuutu, s);
  }
  return [...ruudut.values()].map((s) => ({ lat: s.lat, lon: s.lon, u: s.u / s.n, v: s.v / s.n }));
};

/** Etäisyys asteina, pituusaste kosinilla kutistettuna. */
const etaisyys = (lat, lon, r) => {
  let dlon = r.lon - lon;
  if (dlon > 180) dlon -= 360;
  if (dlon < -180) dlon += 360;
  return Math.hypot(r.lat - lat, dlon * Math.cos(radiaaneiksi(lat)));
};

/**
 * Ruutujen keskiarvo säteen sisältä. Rannikolla osa ruuduista on maata,
 * joten tyhjät jätetään pois nimittäjästäkin.
 *
 * Keskiarvo kertoo virran SUUNNAN luotettavasti, mutta laimentaa
 * nopeuden: Golfvirran ydin on kapeampi kuin säde, ja ympäriltä
 * lasketaan mukaan hidasta vettä. Siksi nopeus otetaan erikseen
 * ytimestä (ks. ydinNopeus).
 */
const naytteista = (ruudut, lat, lon, sade = 1.2) => {
  let u = 0;
  let v = 0;
  let n = 0;
  for (const r of ruudut) {
    if (etaisyys(lat, lon, r) > sade) continue;
    u += r.u;
    v += r.v;
    n += 1;
  }
  return n ? { u: u / n, v: v / n, n } : null;
};

/** Nopein ruutu säteen sisältä eli virran ydin. */
const ydinNopeus = (ruudut, lat, lon, sade = 1.2) => {
  let huippu = 0;
  for (const r of ruudut) {
    if (etaisyys(lat, lon, r) > sade) continue;
    huippu = Math.max(huippu, Math.hypot(r.u, r.v));
  }
  return huippu;
};

// ---------------------------------------------------------- vyöhykkeet

/*
 * Vyöhykkeiden nimet, selitykset ja odotettu suunta. Rajat EIVÄT ole
 * tässä: ne lasketaan aineistosta (ks. otsikko). odotettu on tarkistus,
 * ei tulos — jos mitattu suunta poikkeaa siitä yli 45°, ajo kaatuu.
 */
const VYOHYKEPOHJAT = [
  {
    avain: 'koillispasaati',
    nimi: 'Koillispasaati',
    pallonpuolisko: 'pohjoinen',
    odotettu: 45,
    selitys: 'Hevosleveyksien korkeapaineesta valuu ilmaa kohti päiväntasaajaa. '
      + 'Maapallon pyöriminen kääntää sen pohjoisella pallonpuoliskolla oikealle, '
      + 'jolloin syntyy tasainen koillistuuli.',
    purjehdus: 'Tämä on Atlantin länsireitti. Purjelaiva ei kääntynyt Euroopasta suoraan '
      + 'länteen vaan laskeutui ensin Kanarian saarille asti — vasta täältä tuuli '
      + 'puhalsi joka päivä samaan suuntaan Karibialle.',
  },
  {
    avain: 'kaakkoispasaati',
    nimi: 'Kaakkoispasaati',
    pallonpuolisko: 'eteläinen',
    odotettu: 135,
    selitys: 'Sama kierto eteläisellä pallonpuoliskolla, mutta kääntyminen on vasemmalle. '
      + 'Vyöhyke ulottuu päiväntasaajan yli sinne asti, missä se kohtaa koillispasaatin.',
    purjehdus: 'Eteläiselle Atlantille laskeutunut laiva sai kaakkoispasaatista vauhtia '
      + 'Brasilian rannikolle, ja Intiaan matkaava käytti sitä samaa tuulta '
      + 'kaartaakseen Hyväntoivonniemen leveyksille.',
  },
  {
    avain: 'tyvenvyohyke',
    nimi: 'Tyvenvyöhyke',
    pallonpuolisko: 'päiväntasaaja',
    odotettu: null,
    selitys: 'Pasaatit kohtaavat toisensa, ja ilma nousee ylös sen sijaan että kulkisi '
      + 'sivusuunnassa. Jäljelle jää tyventä, äkillisiä ukkoskuuroja ja tuulta, jonka '
      + 'suunta ei pysy — vyöhykkeen nimi merisäätiedossa on ITCZ.',
    purjehdus: 'Purjelaivan pahin paikka: täällä saattoi ajelehtia viikkoja. Kapteenit '
      + 'oppivat ylittämään vyöhykkeen Atlantin länsiosassa, jossa se on kapeimmillaan, '
      + 'ja mieluiten vuodenaikana, jolloin se on kauimpana reitistä.',
  },
  {
    avain: 'hevosleveydet',
    nimi: 'Hevosleveydet',
    pallonpuolisko: 'molemmat',
    odotettu: null,
    selitys: 'Noin 30. leveysasteella noussut ilma laskeutuu takaisin alas. Laskeva ilma '
      + 'on kuivaa, ja samalla vyöhykkeellä ovat maailman suuret aavikot. Tämä on myös '
      + 'raja, jonka takana tuuli kääntyy pasaatista länsituuleksi.',
    purjehdus: 'Nimi tulee tarinasta, jonka mukaan tyveneen jääneiltä laivoilta '
      + 'heitettiin hevoset yli laidan veden säästämiseksi. Mitattuna tämä kaista ei '
      + 'ole muuta merta tyynempi — sen tuntomerkki on epävakaus: tuuli tulee milloin '
      + 'mistäkin, ja purjelaiva saattoi ajautua päiväkausia väärään suuntaan.',
  },
  {
    avain: 'lansituulet',
    nimi: 'Länsituulet',
    pallonpuolisko: 'molemmat',
    odotettu: 270,
    selitys: 'Hevosleveyksiltä napoja kohti virtaava ilma kääntyy lännenpuoleiseksi. '
      + 'Vyöhykkeellä kulkevat matalapaineet, joten tuuli on kova mutta suunnaltaan '
      + 'paljon pasaatia epävakaampi.',
    purjehdus: 'Tämä on paluureitti. Amerikasta Eurooppaan palattiin pohjoista kaarta '
      + 'länsituulten mukana, ei samaa tietä takaisin — meno ja paluu ovat siksi '
      + 'kartalla kaksi eri kaarta, jotka yhdessä kiertävät Atlantin.',
  },
  {
    avain: 'karjuvat-nelikymmenluvut',
    nimi: 'Karjuvat nelikymmenluvut',
    pallonpuolisko: 'eteläinen',
    odotettu: 270,
    selitys: 'Eteläisellä pallonpuoliskolla länsituulet kiertävät maapallon ympäri lähes '
      + 'ilman mannerten vastusta. Siksi ne ovat paljon kovempia kuin pohjoiset '
      + 'länsituulet — 50. asteella puhutaan raivoavista viisikymmenluvuista.',
    purjehdus: 'Viljaklippereiden valtatie: Hyväntoivonniemeltä Australiaan ja edelleen '
      + 'Kap Hornin ympäri kuljettiin näiden tuulien mukana aina itään, jolloin '
      + 'maailman ympäri oli nopeampi purjehtia kuin palata samaa tietä takaisin.',
  },
];

/*
 * Tyvenvyöhyke mitataan ITCZ:ää seuraten, ei kiinteältä kaistalta.
 *
 * ITCZ vaeltaa vuoden mittaan usean asteen verran. Jos tyven mitattaisiin
 * kiinteältä leveyskaistalta, keskiarvoon tulisi puolet vuodesta pasaattia
 * — ja tyvenvyöhykkeestä tulisi tuulinen paikka, mitä se ei ole. Siksi
 * jokaiselle kuukaudelle etsitään erikseen ITCZ:n paikka ja mitataan
 * sen molemmin puolin 2,5 astetta. Purjelaiva kohtasi juuri tämän: kapean
 * tyvenkaistan siinä missä se sattui sinä vuodenaikana olemaan.
 */
const TYVEN_PUOLILEVEYS = 2.5;

/**
 * ITCZ:n paikka yhdellä pituusasteella yhtenä kuukautena: kohta, jossa
 * pohjois–etelä-tuuli vaihtaa merkkiä etelästä pohjoiseen mentäessä.
 * Yksittäinen 2°:n ruutu on levoton, joten v tasoitetaan kolmen ruudun
 * liukuvalla keskiarvolla ennen nollakohdan etsintää.
 */
const paikallinenItcz = (kentta, kk, j) => {
  const sarake = [];
  for (let i = LAT_N - 1; i >= 0; i -= 1) {
    const lat = latAste(i);
    if (lat < -20 || lat > 20) continue;
    const s = kentta[kk][i][j];
    sarake.push({ lat, v: s && s.v !== null && !monsuunissa(lat, lonAste(j)) ? s.v : null });
  }
  const tasoitettu = sarake.map((p, i) => {
    const ymparilta = [sarake[i - 1], p, sarake[i + 1]].filter((q) => q && q.v !== null);
    return { lat: p.lat, v: ymparilta.length ? ymparilta.reduce((s, q) => s + q.v, 0) / ymparilta.length : null };
  }).filter((p) => p.v !== null);
  if (tasoitettu.length < 12) return null;
  for (let i = 1; i < tasoitettu.length; i += 1) {
    const a = tasoitettu[i - 1];
    const b = tasoitettu[i];
    if (a.v > 0 && b.v <= 0) return nollakohta(a.lat, a.v, b.lat, b.v);
  }
  return null;
};

const tyvenMittaus = (kentta) => {
  // Piirrettävä kaista: kuinka laajalti vyöhykekeskiarvon ITCZ vaeltaa vuodessa.
  const kuukausiLatit = [];
  for (let kk = 0; kk < 12; kk += 1) {
    kuukausiLatit.push(merkinvaihto(leveysprofiili(kentta, [kk]), 'v', -15, 15, 'laskeva'));
  }

  /*
   * Mittaus seuraa PAIKALLISTA ITCZ:ää, ei vyöhykekeskiarvoa.
   *
   * Atlantin ITCZ on eri leveydellä kuin Tyynenmeren, joten leveyspiirin
   * yli laskettu keskiarvo osuisi toisessa valtameressä tyveneen ja
   * toisessa keskelle pasaattia. Siksi jokaiselle pituusasteelle
   * etsitään oma ITCZ ja mitataan sen molemmin puolin.
   */
  let u = 0;
  let v = 0;
  let nopeus = 0;
  let vakaus = 0;
  let n = 0;
  let latSumma = 0;
  let sarakkeita = 0;
  for (let kk = 0; kk < 12; kk += 1) {
    for (let j = 0; j < LON_N; j += 1) {
      const keskus = paikallinenItcz(kentta, kk, j);
      if (keskus === null) continue;
      latSumma += keskus;
      sarakkeita += 1;
      for (let i = 0; i < LAT_N; i += 1) {
        const lat = latAste(i);
        if (Math.abs(lat - keskus) > TYVEN_PUOLILEVEYS) continue;
        const s = kentta[kk][i][j];
        if (!s || s.u === null || !s.nopeus) continue;
        if (monsuunissa(lat, lonAste(j))) continue;
        u += s.u;
        v += s.v;
        nopeus += s.nopeus;
        vakaus += Math.min(1, Math.hypot(s.u, s.v) / s.nopeus);
        n += 1;
      }
    }
  }
  if (!sarakkeita) throw new Error('ITCZ:ää ei löytynyt yhdeltäkään pituusasteelta');
  console.log(`  tyven mitattu ${sarakkeita} sarakkeesta, ${n} ruudusta`);

  const ku = u / n;
  const kv = v / n;
  return {
    mittaus: {
      u: pyorista(ku, 1),
      v: pyorista(kv, 1),
      mista: pyorista(mistaAste(ku, kv), 0),
      suunta: ilmansuunta(mistaAste(ku, kv)),
      nopeus: pyorista(nopeus / n, 1),
      vakaus: pyorista(vakaus / n, 2),
      ydin: pyorista(latSumma / sarakkeita),
    },
    etela: Math.min(...kuukausiLatit) - TYVEN_PUOLILEVEYS,
    pohjoinen: Math.max(...kuukausiLatit) + TYVEN_PUOLILEVEYS,
    kuukaudet: kuukausiLatit.map((l) => pyorista(l)),
  };
};

const teeVyohykkeet = (kentta) => {
  const vuosi = leveysprofiili(kentta, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  const talvi = leveysprofiili(kentta, [11, 0, 1]);
  const kesa = leveysprofiili(kentta, [5, 6, 7]);

  // ITCZ: kohta jossa pohjois–etelä-tuuli vaihtaa merkkiä eli
  // pallonpuoliskojen pasaatit kohtaavat.
  const itcz = merkinvaihto(vuosi, 'v', -15, 15, 'laskeva');
  const itczTalvi = merkinvaihto(talvi, 'v', -15, 15, 'laskeva');
  const itczKesa = merkinvaihto(kesa, 'v', -15, 15, 'laskeva');
  const tyven = tyvenMittaus(kentta);

  // Hevosleveydet: itä–länsi-tuulen merkinvaihto pasaatin ja
  // länsituulten välissä. Napaseudun raja on sama merkinvaihto toisin päin.
  const hevonenP = merkinvaihto(vuosi, 'u', 20, 45, 'nouseva');
  const hevonenE = merkinvaihto(vuosi, 'u', -45, -20, 'laskeva');
  const napaP = merkinvaihto(vuosi, 'u', 45, 75, 'laskeva');
  const napaE = merkinvaihto(vuosi, 'u', -75, -45, 'nouseva');

  console.log(`  ITCZ ${pyorista(itcz)}° (tammi–maalis ${pyorista(itczTalvi)}°, kesä–elo ${pyorista(itczKesa)}°)`);
  console.log(`  tyvenvyöhykkeen vaellus ${pyorista(tyven.etela)}…${pyorista(tyven.pohjoinen)}°`);
  console.log(`  hevosleveydet ${pyorista(hevonenP)}° ja ${pyorista(hevonenE)}°`);
  console.log(`  länsituulten naparaja ${pyorista(napaP)}° ja ${pyorista(napaE)}°`);

  // Hevosleveyksien LEVEYS on sopimus, keskiviiva mitattu.
  const HEVONEN_LEVEYS = 2.5;

  const kaistat = {
    koillispasaati: [{ pallonpuolisko: 'pohjoinen', etela: itcz, pohjoinen: hevonenP, raja: 'mitattu' }],
    kaakkoispasaati: [{ pallonpuolisko: 'eteläinen', etela: hevonenE, pohjoinen: itcz, raja: 'mitattu' }],
    tyvenvyohyke: [{
      pallonpuolisko: 'päiväntasaaja',
      etela: tyven.etela,
      pohjoinen: tyven.pohjoinen,
      raja: 'sekoitus',
      mittaus: tyven.mittaus,
    }],
    hevosleveydet: [
      { pallonpuolisko: 'pohjoinen', etela: hevonenP - HEVONEN_LEVEYS, pohjoinen: hevonenP + HEVONEN_LEVEYS, raja: 'sopimus' },
      { pallonpuolisko: 'eteläinen', etela: hevonenE - HEVONEN_LEVEYS, pohjoinen: hevonenE + HEVONEN_LEVEYS, raja: 'sopimus' },
    ],
    lansituulet: [
      { pallonpuolisko: 'pohjoinen', etela: hevonenP, pohjoinen: napaP, raja: 'mitattu' },
      { pallonpuolisko: 'eteläinen', etela: napaE, pohjoinen: hevonenE, raja: 'mitattu' },
    ],
    'karjuvat-nelikymmenluvut': [{ pallonpuolisko: 'eteläinen', etela: -50, pohjoinen: -40, raja: 'sopimus' }],
  };

  const vyohykkeet = VYOHYKEPOHJAT.map((pohja) => {
    const omat = kaistat[pohja.avain].map((k) => {
      // Tyvenvyöhyke on mitattu ITCZ:ää seuraten, muut suoraan kaistalta.
      const mittaus = k.mittaus ?? kaistanMittaus(vuosi, k.etela, k.pohjoinen);
      if (pohja.odotettu !== null && kulmaero(mittaus.mista, pohja.odotettu) > 45) {
        throw new Error(
          `${pohja.nimi} (${pyorista(k.etela)}…${pyorista(k.pohjoinen)}): mitattu suunta `
          + `${mittaus.mista}° ei vastaa odotettua ${pohja.odotettu}°`,
        );
      }
      return {
        pallonpuolisko: k.pallonpuolisko,
        etela: pyorista(k.etela),
        pohjoinen: pyorista(k.pohjoinen),
        raja: k.raja,
        ...mittaus,
      };
    });
    const rivi = {
      avain: pohja.avain,
      nimi: pohja.nimi,
      pallonpuolisko: pohja.pallonpuolisko,
      kaistat: omat,
      selitys: pohja.selitys,
      purjehdus: pohja.purjehdus,
    };
    if (pohja.avain === 'tyvenvyohyke') {
      rivi.itcz = {
        vuosi: pyorista(itcz),
        talvi: pyorista(itczTalvi),
        kesa: pyorista(itczKesa),
        kuukausittain: tyven.kuukaudet,
      };
    }
    return rivi;
  });

  // Tyvenvyöhykkeen on oltava tyyni: muuten koko jako on väärin päin.
  const tyventa = vyohykkeet.find((v) => v.avain === 'tyvenvyohyke').kaistat[0].nopeus;
  for (const avain of ['koillispasaati', 'kaakkoispasaati']) {
    const pasaati = vyohykkeet.find((v) => v.avain === avain).kaistat[0].nopeus;
    if (tyventa >= pasaati) throw new Error(`tyvenvyöhyke (${tyventa} m/s) ei ole pasaattia (${pasaati} m/s) tyynempi`);
  }
  return vyohykkeet;
};

// -------------------------------------------------------------- virrat

/*
 * Merivirtojen keskiviivat käsin piirrettyinä. Piste on [lon, lat].
 *
 * Nämä EIVÄT ole mittaustulos vaan havainnekuva: virta on satojen
 * kilometrien levyinen ja mutkitteleva vyöhyke, jonka keskiviiva
 * vaihtaa paikkaa viikoittain. Viivat on piirretty oppikirjakartoista
 * (Tomczak & Godfrey 2003) parin asteen tarkkuudella. Mitattua on
 * suunta, nopeus ja lämpöero — ne lasketaan alempana.
 *
 * laatu on 'lämmin' tai 'kylmä'. Reunavirroilla se on tarkistettavissa:
 * lämmin virta tuo päiväntasaajan vettä kohti napoja, joten sen pinta on
 * lämpimämpi kuin saman leveysasteen meri keskimäärin, ja kylmä virta
 * päinvastoin. Ekvatoriaalivirroilla ja Länsituulten ajovirralla vertailu
 * omaan leveysasteeseensa ei kerro mitään (ne kulkevat leveyspiiriä
 * pitkin), joten niillä lämpöero lasketaan mutta sitä ei käytetä
 * tarkistukseen — kenttä tarkistettu kertoo kummasta on kyse.
 */
const VIRTAPOHJAT = [
  {
    avain: 'golfvirta',
    nimi: 'Golfvirta',
    laatu: 'lämmin',
    suunta: 'lounaasta koilliseen',
    tarkistaLampo: true,
    viivat: [[[-80, 25], [-79.5, 28], [-80.5, 31], [-78, 33], [-75, 35.5], [-72, 37.5], [-68, 39.5], [-63, 40.5], [-58, 41.5], [-52, 43], [-46, 44]]],
    selitys: 'Meksikonlahdelta Floridansalmen kautta purkautuva kapea ja nopea virta, '
      + 'joka seuraa Yhdysvaltain rannikkoa Hatterasniemelle ja kaartaa siitä avomerelle. '
      + 'Se on maailman tunnetuin merivirta ja yksi nopeimmista.',
    purjehdus: 'Purjelaiva ajoi Amerikasta Eurooppaan Golfvirran mukana ja pysytteli sen '
      + 'ulkopuolella tullessaan takaisin. Benjamin Franklin painatti virrasta kartan '
      + 'noin 1770 selittääkseen, miksi Britannian postilaivat kulkivat Amerikkaan '
      + 'viikkoja hitaammin kuin samaa reittiä ajaneet kauppalaivat.',
  },
  {
    avain: 'pohjois-atlantin-virta',
    nimi: 'Pohjois-Atlantin virta',
    laatu: 'lämmin',
    suunta: 'lounaasta koilliseen',
    tarkistaLampo: true,
    viivat: [[[-46, 44], [-40, 47], [-34, 49], [-28, 51], [-22, 53], [-16, 55], [-10, 57], [-5, 59], [0, 61], [5, 63]]],
    selitys: 'Golfvirran jatke, joka levenee Atlantin poikki ja kuljettaa lämmintä vettä '
      + 'Luoteis-Euroopan rannikolle. Se on syy siihen, että Norjan satamat ovat '
      + 'sulia yhtä pohjoisessa kuin Grönlannin jäätiköt.',
    purjehdus: 'Sama vesi, joka vei laivat Amerikasta kotiin, pitää Euroopan rannikon '
      + 'jäättömänä. Pohjoisen reitin satamat olivat siksi auki ympäri vuoden, '
      + 'toisin kuin samalla leveydellä Kanadan puolella.',
  },
  {
    avain: 'kanarian-virta',
    nimi: 'Kanarian virta',
    laatu: 'kylmä',
    suunta: 'koillisesta lounaaseen',
    tarkistaLampo: true,
    viivat: [[[-11, 36], [-13, 33], [-15, 30], [-17, 27], [-18, 24], [-19, 21], [-20, 18], [-21, 15]]],
    selitys: 'Atlantin kierron itälaita: viileää vettä valuu Iberian niemimaalta '
      + 'Luoteis-Afrikan rannikkoa pitkin etelään. Rannikolla nousee lisäksi kylmää '
      + 'vettä syvyydestä, mikä tekee vesistä poikkeuksellisen kalaisia.',
    purjehdus: 'Virta vie samaan suuntaan kuin koillispasaati, joten laivat pääsivät '
      + 'Euroopasta Kanarialle nopeasti. Paluu samaa reittiä oli mahdotonta — '
      + 'sekä tuuli että vesi olivat vastaan.',
  },
  {
    avain: 'brasilian-virta',
    nimi: 'Brasilian virta',
    laatu: 'lämmin',
    suunta: 'koillisesta lounaaseen',
    tarkistaLampo: true,
    viivat: [[[-35, -9], [-36.5, -13], [-38, -17], [-41, -21], [-45, -25], [-48, -29], [-51, -33], [-53, -37]]],
    selitys: 'Etelä-Amerikan itärannikkoa etelään kulkeva lämmin reunavirta. Se kohtaa '
      + 'pohjoiseen tulevan kylmän Falklandin virran noin 38. asteella, ja kohtaamis'
      + 'kohta on yksi maailman jyrkimmistä lämpötilarajoista merellä.',
    purjehdus: 'Etelä-Atlantin ylittänyt laiva sai virrasta apua Rio de Janeiroon ja '
      + 'Montevideoon. Sama virta hidasti pohjoiseen palaavia, jotka pysyttelivät '
      + 'kauempana avomerellä.',
  },
  {
    avain: 'benguela',
    nimi: 'Benguelan virta',
    laatu: 'kylmä',
    suunta: 'etelästä pohjoiseen',
    tarkistaLampo: true,
    viivat: [[[16.5, -33], [14, -30], [12.5, -27], [11.5, -24], [10.5, -21], [9.5, -18], [8.5, -16]]],
    selitys: 'Kylmää vettä nousee syvyydestä Namibian rannikolla ja kulkee luoteeseen '
      + 'kohti päiväntasaajaa. Kylmä meri kuivattaa yllään olevan ilman, ja siksi '
      + 'Namibin autiomaa alkaa suoraan rantaviivasta.',
    purjehdus: 'Hyväntoivonniemen kiertänyt laiva sai virrasta vastuksen palatessaan '
      + 'pohjoiseen — mutta samalla sumun ja kylmyyden, joista Luurankorannikon '
      + 'maine haaksirikkojen paikkana syntyi.',
  },
  {
    avain: 'agulhas',
    nimi: 'Agulhasvirta',
    laatu: 'lämmin',
    suunta: 'koillisesta lounaaseen',
    tarkistaLampo: true,
    viivat: [
      [[37, -19], [36, -22], [34, -25], [32, -28], [30, -31], [27, -34], [23, -36], [20, -38]],
      [[20, -38], [24, -40], [28, -40.5], [32, -40.5]],
    ],
    selitys: 'Intian valtameren kapea ja nopea reunavirta, joka kulkee Afrikan itä'
      + 'rannikkoa etelään. Agulhasniemen kohdalla se kääntyy jyrkästi takaisin itään '
      + '— toinen viiva on tämä paluumutka.',
    purjehdus: 'Virta kulkee lounaaseen mutta karjuvat nelikymmenluvut puhaltavat '
      + 'idästä: kun kova vastatuuli kohtaa nopean virran, syntyy Agulhasin '
      + 'hirmuaallot. Purjelaivan reitti Intiasta kotiin kulki juuri tästä.',
  },
  {
    avain: 'kuroshio',
    nimi: 'Kuroshio',
    laatu: 'lämmin',
    suunta: 'lounaasta koilliseen',
    tarkistaLampo: true,
    viivat: [[[122, 23], [124, 26], [128, 29], [132, 31.5], [137, 33.5], [141, 35], [145, 36], [150, 36], [155, 36]]],
    selitys: 'Tyynenmeren Golfvirtaa vastaava lämmin reunavirta, joka kulkee Taiwanilta '
      + 'Japanin eteläpuolitse koilliseen. Japanilainen nimi tarkoittaa mustaa virtaa: '
      + 'sen kirkas ja ravinneköyhä vesi näyttää tummansiniseltä.',
    purjehdus: 'Kuroshio vei laivat Japanista Tyynenmeren poikki Amerikkaan. Samalla '
      + 'virralla ajelehti vuosisatojen ajan japanilaisia haaksirikkoja Pohjois-'
      + 'Amerikan rannikolle asti.',
  },
  {
    avain: 'kalifornian-virta',
    nimi: 'Kalifornian virta',
    laatu: 'kylmä',
    suunta: 'pohjoisesta etelään',
    tarkistaLampo: true,
    viivat: [[[-127, 47], [-126, 43], [-125, 39], [-123, 35], [-120, 31], [-117, 27], [-115, 23]]],
    selitys: 'Tyynenmeren pohjoisen kierron itälaita: viileä vesi valuu Brittiläisestä '
      + 'Kolumbiasta Kalifornian ohi etelään. Kylmä meri lämpimän maan vieressä tekee '
      + 'San Franciscon kuuluisat kesäsumut.',
    purjehdus: 'Etelään pääsi helposti, pohjoiseen ei. Espanjalaisten Manilan-galeonien '
      + 'oli purjehdittava kauas pohjoiseen länsituulten vyöhykkeelle ennen kuin ne '
      + 'saattoivat kääntyä Kaliforniaan — virtaa vastaan ei noustu.',
  },
  {
    avain: 'humboldt',
    nimi: 'Humboldtin virta',
    laatu: 'kylmä',
    suunta: 'etelästä pohjoiseen',
    tarkistaLampo: true,
    viivat: [[[-75, -43], [-74, -38], [-73, -33], [-72.5, -28], [-73.5, -23], [-75, -18], [-78, -14], [-81, -10], [-83, -6]]],
    selitys: 'Kylmä virta kulkee Chilen ja Perun rannikkoa pohjoiseen, ja sen mukana nousee '
      + 'syvyydestä ravinteikasta vettä. Alue on maailman tuottoisin kalavesi — ja '
      + 'kuivin rannikko, sillä kylmä meri ei anna sateita Atacamalle.',
    purjehdus: 'Kap Hornin kiertäneelle laivalle virta oli myötäinen aina Peruun asti. '
      + 'Etelään palaavat pysyttelivät kaukana rannikosta, missä virran vastus on '
      + 'pienempi.',
  },
  {
    avain: 'lansituulten-ajovirta',
    nimi: 'Länsituulten ajovirta',
    laatu: 'kylmä',
    suunta: 'lännestä itään',
    tarkistaLampo: false,
    viivat: [[[-65, -57], [-45, -53], [-25, -50], [-5, -49], [15, -48], [40, -48], [65, -49], [90, -52], [115, -55], [140, -57], [165, -59], [-170, -59], [-140, -58], [-110, -57], [-85, -57], [-70, -57]]],
    selitys: 'Ainoa merivirta, joka kiertää koko maapallon ympäri kohtaamatta mannerta. '
      + 'Karjuvat nelikymmenluvut työntävät sitä itään, ja se kuljettaa enemmän vettä '
      + 'kuin mikään muu virta maailmassa.',
    purjehdus: 'Viljalaivojen moottori: Hyväntoivonniemeltä Australiaan ja Kap Hornin '
      + 'ympäri kuljettiin aina itään, tuulen ja virran mukana. Länteen päin samaa '
      + 'matkaa ei kannattanut yrittää.',
  },
  {
    avain: 'pohjois-ekvatoriaalivirta',
    nimi: 'Pohjoinen ekvatoriaalivirta',
    laatu: 'lämmin',
    suunta: 'idästä länteen',
    tarkistaLampo: false,
    viivat: [
      [[-20, 12], [-30, 12], [-40, 12], [-50, 13], [-58, 14]],
      [[-108, 12], [-130, 12], [-150, 12], [-170, 12], [175, 13], [155, 13], [135, 13]],
    ],
    selitys: 'Koillispasaatin työntämä leveä virta, joka kulkee valtameren poikki itä'
      + 'laidalta länsilaidalle. Lännessä vesi kasautuu ja kääntyy pohjoiseen '
      + 'Golfvirraksi ja Kuroshioksi.',
    purjehdus: 'Sama tuuli, joka vei laivan länteen, vei myös veden. Menomatka Atlantin '
      + 'yli oli siksi nopeampi kuin pelkkä tuulen nopeus antaisi ymmärtää.',
  },
  {
    avain: 'etela-ekvatoriaalivirta',
    nimi: 'Eteläinen ekvatoriaalivirta',
    laatu: 'lämmin',
    suunta: 'idästä länteen',
    tarkistaLampo: false,
    viivat: [
      [[8, -6], [-5, -5], [-18, -4], [-30, -4]],
      [[-88, -4], [-110, -4], [-135, -4], [-160, -4], [175, -5], [155, -6]],
      [[100, -10], [85, -11], [70, -12], [55, -13], [45, -14]],
    ],
    selitys: 'Kaakkoispasaatin työntämä vastine päiväntasaajan eteläpuolella. Se ylittää '
      + 'kaikki kolme valtamerta ja päättyy lännessä lämpimään vesialtaaseen, josta '
      + 'lähtevät Brasilian ja Agulhasin virrat.',
    purjehdus: 'Atlantin haara työntää vettä Etelä-Amerikan itäkärkeä kohti ja jakautuu '
      + 'siinä kahtia. Sama tuuli ja virta vei Pedro Álvares Cabralin laivaston '
      + 'Brasiliaan vuonna 1500 matkalla Intiaan — historioitsijat kiistelevät yhä '
      + 'siitä, oliko poikkeama vahinko vai tarkoitus.',
  },
];

/** Virran mitatut luvut: kulkeeko se piirretyn viivan suuntaan ja kuinka lujaa. */
const mittaaVirta = async (pohja, kentta) => {
  const pisteet = pohja.viivat.flat();
  const laatikko = {
    latMin: Math.min(...pisteet.map((p) => p[1])) - 1.5,
    latMax: Math.max(...pisteet.map((p) => p[1])) + 1.5,
    lonMin: Math.min(...pisteet.map((p) => p[0])) - 1.5,
    lonMax: Math.max(...pisteet.map((p) => p[0])) + 1.5,
  };
  // Päivämäärärajan ylittävä virta haetaan koko maapallon leveydeltä:
  // laatikon reunat menisivät muuten ristiin.
  const ylittaa = pohja.viivat.some((v) => v.some(([lon], i) => i > 0 && Math.abs(lon - v[i - 1][0]) > 180));
  if (ylittaa) laatikko.koko = true;

  const ruudut = await haeVirtaruutu(pohja.avain, laatikko);

  let osumat = 0;
  let yhteensa = 0;
  let nopeus = 0;
  let pitkin = 0;
  for (const viiva of pohja.viivat) {
    for (let i = 1; i < viiva.length; i += 1) {
      const [lon0, lat0] = viiva[i - 1];
      const [lon1, lat1] = viiva[i];
      let dlon = lon1 - lon0;
      if (dlon > 180) dlon -= 360;
      if (dlon < -180) dlon += 360;
      const lat = (lat0 + lat1) / 2;
      let lon = lon0 + dlon / 2;
      if (lon > 180) lon -= 360;
      if (lon < -180) lon += 360;

      const nayte = naytteista(ruudut, lat, lon);
      if (!nayte) continue;
      // Yksikkövektori viivan suuntaan. Pituusasteen pituus kutistuu
      // kosinilla, joten suunta on laskettava metreissä eikä asteissa.
      const ex = dlon * Math.cos(radiaaneiksi(lat));
      const ey = lat1 - lat0;
      const pit = Math.hypot(ex, ey);
      const proj = (nayte.u * ex + nayte.v * ey) / pit;
      yhteensa += 1;
      if (proj > 0) osumat += 1;
      pitkin += proj;
      nopeus += ydinNopeus(ruudut, lat, lon);
    }
  }
  if (!yhteensa) throw new Error(`${pohja.nimi}: yhtään mittauspistettä ei osunut mereen`);

  // Lämpöero omaan leveysasteeseensa nähden (ICOADSin vuosikeskiarvo).
  let ero = 0;
  let eroN = 0;
  for (const [lon, lat] of pisteet) {
    const paikka = vuosiSst(kentta, lat, lon);
    const vyo = vyohykkeenSst(kentta, lat);
    if (paikka === null || vyo === null) continue;
    ero += paikka - vyo;
    eroN += 1;
  }

  return {
    osuus: osumat / yhteensa,
    pisteita: yhteensa,
    nopeus: pyorista(nopeus / yhteensa, 2),
    pitkin: pyorista(pitkin / yhteensa, 2),
    lampoEro: eroN ? pyorista(ero / eroN, 1) : null,
  };
};

/** Pinnan vuosikeskilämpö pisteessä, lähin kelvollinen ruutu. */
const vuosiSst = (kentta, lat, lon) => {
  for (const sade of [0, 1, 2]) {
    let summa = 0;
    let n = 0;
    for (let di = -sade; di <= sade; di += 1) {
      for (let dj = -sade; dj <= sade; dj += 1) {
        const i = latIndeksi(lat) + di;
        const j = (lonIndeksi(lon) + dj + LON_N) % LON_N;
        if (i < 0 || i >= LAT_N) continue;
        for (let kk = 0; kk < 12; kk += 1) {
          const s = kentta[kk][i][j];
          if (!s || s.sst === null) continue;
          summa += s.sst;
          n += 1;
        }
      }
    }
    if (n >= 12) return summa / n;
  }
  return null;
};

/** Saman leveysasteen meren vuosikeskilämpö kaikkien pituusasteiden yli. */
const vyohykkeenSst = (kentta, lat) => {
  const i = latIndeksi(lat);
  if (i < 0 || i >= LAT_N) return null;
  let summa = 0;
  let n = 0;
  for (let kk = 0; kk < 12; kk += 1) {
    for (let j = 0; j < LON_N; j += 1) {
      const s = kentta[kk][i][j];
      if (!s || s.sst === null) continue;
      summa += s.sst;
      n += 1;
    }
  }
  return n >= 12 ? summa / n : null;
};

const teeVirrat = async (kentta) => {
  const virrat = [];
  for (const pohja of VIRTAPOHJAT) {
    const mittaus = await mittaaVirta(pohja, kentta);
    const osuus = Math.round(mittaus.osuus * 100);
    console.log(
      `  ${pohja.nimi.padEnd(28)} suunta ${String(osuus).padStart(3)} % (${mittaus.pisteita} pistettä), `
      + `ydin ${mittaus.nopeus} m/s, viivaa pitkin ${mittaus.pitkin} m/s, lämpöero ${mittaus.lampoEro} °C`,
    );
    if (mittaus.osuus < 0.75) {
      throw new Error(
        `${pohja.nimi}: vain ${osuus} % viivan pätkistä kulkee mitatun virran suuntaan — `
        + 'piirretty viiva on väärässä paikassa tai väärin päin',
      );
    }
    if (pohja.tarkistaLampo) {
      const odotettu = pohja.laatu === 'lämmin' ? 1 : -1;
      if (mittaus.lampoEro === null || Math.sign(mittaus.lampoEro) !== odotettu) {
        throw new Error(
          `${pohja.nimi}: merkitty ${pohja.laatu}ksi mutta mitattu lämpöero on ${mittaus.lampoEro} °C`,
        );
      }
    }
    virrat.push({
      avain: pohja.avain,
      nimi: pohja.nimi,
      laatu: pohja.laatu,
      suunta: pohja.suunta,
      nopeus: mittaus.nopeus,
      lampoEro: mittaus.lampoEro,
      tarkistettu: pohja.tarkistaLampo ? 'suunta ja lämpötila' : 'suunta',
      viivat: pohja.viivat,
      selitys: pohja.selitys,
      purjehdus: pohja.purjehdus,
    });
  }
  return virrat;
};

// ------------------------------------------------------------ monsuuni

/*
 * Monsuunin kuukaudet.
 *
 * Lounaismonsuuni puhaltaa kesäkuusta syyskuuhun ja koillismonsuuni
 * joulukuusta maaliskuuhun. Väliin jäävät kuukaudet ovat vaihtumis-
 * aikaa, jolloin tuuli on heikko ja suunta epävarma — ne jätetään
 * kummastakin keskiarvosta pois, koska niiden ottaminen mukaan
 * kumoaisi juuri sen ilmiön, jota ollaan näyttämässä.
 */
const KESAKUUKAUDET = [5, 6, 7, 8];
const TALVIKUUKAUDET = [11, 0, 1, 2];

const MONSUUNILAATIKKO = { latMin: -25, latMax: 25, lonMin: 30, lonMax: 110 };
const NUOLIVALI = 4;

/** Monsuunikentän nuolet: vektorikeskiarvo valituilta kuukausilta. */
const monsuuninNuolet = (kentta, kuukaudet) => {
  const nuolet = [];
  for (let lat = MONSUUNILAATIKKO.latMin; lat <= MONSUUNILAATIKKO.latMax; lat += NUOLIVALI) {
    for (let lon = MONSUUNILAATIKKO.lonMin; lon <= MONSUUNILAATIKKO.lonMax; lon += NUOLIVALI) {
      // ICOADSin ruutujen keskipisteet ovat parittomia asteita, joten
      // pyöreä nuoliväli osuu ruudun keskelle vasta pyöristyksen jälkeen.
      const i = latIndeksi(lat);
      const j = lonIndeksi(lon);
      let u = 0;
      let v = 0;
      let nopeus = 0;
      let n = 0;
      for (const kk of kuukaudet) {
        const s = kentta[kk][i]?.[j];
        if (!s || s.u === null || s.nopeus === null) continue;
        u += s.u;
        v += s.v;
        nopeus += s.nopeus;
        n += 1;
      }
      if (n < kuukaudet.length) continue;
      nuolet.push({
        lon: pyorista(lonAste(j)),
        lat: pyorista(latAste(i)),
        u: pyorista(u / n, 1),
        v: pyorista(v / n, 1),
        nopeus: pyorista(nopeus / n, 1),
      });
    }
  }
  return nuolet;
};

/** Nimetyn merialueen tuuli: mistä ja kuinka lujaa. */
const MONSUUNIKOHDAT = [
  { nimi: 'Arabianmeri', lat: 11, lon: 61 },
  { nimi: 'Somalian rannikko', lat: 5, lon: 51 },
  { nimi: 'Intian länsirannikko', lat: 11, lon: 73 },
  { nimi: 'Bengalinlahti', lat: 15, lon: 87 },
  { nimi: 'Malakan salmi', lat: 5, lon: 97 },
];

const monsuuninKohdat = (kentta, kuukaudet) => MONSUUNIKOHDAT.map((kohta) => {
  const i = latIndeksi(kohta.lat);
  const j = lonIndeksi(kohta.lon);
  let u = 0;
  let v = 0;
  let nopeus = 0;
  let n = 0;
  for (const kk of kuukaudet) {
    const s = kentta[kk][i][j];
    if (!s || s.u === null || s.nopeus === null) continue;
    u += s.u;
    v += s.v;
    nopeus += s.nopeus;
    n += 1;
  }
  if (!n) throw new Error(`monsuunikohta ${kohta.nimi} on tyhjä`);
  const mista = mistaAste(u / n, v / n);
  return {
    nimi: kohta.nimi,
    lon: pyorista(lonAste(j)),
    lat: pyorista(latAste(i)),
    mista: pyorista(mista, 0),
    suunta: ilmansuunta(mista),
    nopeus: pyorista(nopeus / n, 1),
  };
});

/*
 * Somalivirta kääntyy monsuunin mukana.
 *
 * Tämä on koko linssin kova todiste: sama meri, sama paikka, mutta vesi
 * kulkee kesällä pohjoiseen ja talvella etelään. Luvut lasketaan OSCARin
 * viiden vuorokauden koosteista, jotka jaetaan kuukauden mukaan kesä- ja
 * talvimonsuuniin. Muista virroista poiketen tässä tarvitaan KAIKKI
 * aikanäytteet, jotta kumpaankin vuodenaikaan jää tarpeeksi havaintoja.
 */
const SOMALIA = [[46, 3], [48, 6], [51, 9], [54, 11], [57, 13]];

const haeSomalivirta = async () => {
  const alue = '[0:1:117][0][(16.0):2:(0.0)][(43.0):2:(60.0)]';
  const teksti = await noudaVarastoon('oscar-somalia.csv', `${ERDDAP}/${VIRTA_AINEISTO}.csv?u${alue},v${alue}`);
  const kaudet = { kesa: [], talvi: [] };
  const koosteet = { kesa: new Set(), talvi: new Set() };
  for (const rivi of csvRivit(teksti)) {
    if (rivi.u === null || rivi.v === null) continue;
    const kk = Number(rivi.time.slice(5, 7)) - 1;
    const kausi = KESAKUUKAUDET.includes(kk) ? 'kesa' : (TALVIKUUKAUDET.includes(kk) ? 'talvi' : null);
    if (!kausi) continue;
    koosteet[kausi].add(rivi.time);
    const lon = Number(rivi.longitude);
    kaudet[kausi].push({
      lat: Number(rivi.latitude),
      lon: lon > 180 ? lon - 360 : lon,
      u: Number(rivi.u),
      v: Number(rivi.v),
    });
  }

  const kausi = (nimi) => {
    // Ruuduittainen keskiarvo, sitten näyte jokaisen viivan pätkän keskeltä.
    const ruudut = new Map();
    for (const r of kaudet[nimi]) {
      const avain = `${r.lat.toFixed(3)}|${r.lon.toFixed(3)}`;
      const s = ruudut.get(avain) ?? { lat: r.lat, lon: r.lon, u: 0, v: 0, n: 0 };
      s.u += r.u;
      s.v += r.v;
      s.n += 1;
      ruudut.set(avain, s);
    }
    const keskiarvot = [...ruudut.values()].map((s) => ({ lat: s.lat, lon: s.lon, u: s.u / s.n, v: s.v / s.n }));
    let u = 0;
    let v = 0;
    let nopeus = 0;
    let n = 0;
    for (let i = 1; i < SOMALIA.length; i += 1) {
      const lat = (SOMALIA[i - 1][1] + SOMALIA[i][1]) / 2;
      const lon = (SOMALIA[i - 1][0] + SOMALIA[i][0]) / 2;
      const nayte = naytteista(keskiarvot, lat, lon, 1.5);
      if (!nayte) continue;
      u += nayte.u;
      v += nayte.v;
      nopeus += Math.hypot(nayte.u, nayte.v);
      n += 1;
    }
    if (!n) throw new Error(`Somalivirran ${nimi}-näytteet jäivät tyhjiksi`);
    const minne = (asteiksi(Math.atan2(u / n, v / n)) + 360) % 360;
    return {
      nimi: 'Somalivirta',
      viiva: SOMALIA,
      minne: pyorista(minne, 0),
      ilmansuunta: ilmansuunta(minne),
      nopeus: pyorista(nopeus / n, 2),
      koosteita: koosteet[nimi].size,
    };
  };

  const kesa = kausi('kesa');
  const talvi = kausi('talvi');
  console.log(`  Somalivirta kesällä ${kesa.ilmansuunta} ${kesa.nopeus} m/s, talvella ${talvi.ilmansuunta} ${talvi.nopeus} m/s`);
  if (kulmaero(kesa.minne, talvi.minne) < 90) {
    throw new Error('Somalivirta ei käänny vuodenaikojen välillä — tarkista aineisto');
  }
  return { kesa, talvi };
};

const teeMonsuuni = async (kentta) => {
  const somali = await haeSomalivirta();

  const kesa = {
    nimi: 'Lounaismonsuuni',
    kuukaudet: 'kesäkuu–syyskuu',
    kuukausiNumerot: KESAKUUKAUDET.map((k) => k + 1),
    nuolet: monsuuninNuolet(kentta, KESAKUUKAUDET),
    kohdat: monsuuninKohdat(kentta, KESAKUUKAUDET),
    virta: somali.kesa,
    selitys: 'Aasian manner kuumenee kesällä merta nopeammin, ilma nousee sen yltä ja '
      + 'meri-ilma imeytyy tilalle. Kaakkoispasaati ylittää päiväntasaajan, kääntyy '
      + 'lounaistuuleksi ja tuo Intiaan sadekauden.',
    purjehdus: 'Tämä on menotuuli. Kesämonsuunilla purjehdittiin Arabiasta ja Afrikasta '
      + 'Intiaan muutamassa viikossa — mutta tuuli on kova ja rannikko tuulen alla, '
      + 'joten satamiin oli tultava ennen pahinta.',
  };
  const talvi = {
    nimi: 'Koillismonsuuni',
    kuukaudet: 'joulukuu–maaliskuu',
    kuukausiNumerot: TALVIKUUKAUDET.map((k) => k + 1),
    nuolet: monsuuninNuolet(kentta, TALVIKUUKAUDET),
    kohdat: monsuuninKohdat(kentta, TALVIKUUKAUDET),
    virta: somali.talvi,
    selitys: 'Talvella manner on merta kylmempi, ilma laskeutuu Aasian ylle ja valuu '
      + 'ulos merelle. Tuuli kääntyy koillisesta, taivas selkenee ja meri rauhoittuu.',
    purjehdus: 'Tämä on paluutuuli. Sama laiva, joka tuli kesällä lounaistuulella '
      + 'Intiaan, odotti syksyn yli ja palasi talvella koillistuulella kotiin. '
      + 'Kauppamatka Intiaan kesti siksi aina vähintään vuoden.',
  };

  // Kesän ja talven on oltava vastakkaiset — muuten koko osio on hukkaan mennyt.
  for (let i = 0; i < kesa.kohdat.length; i += 1) {
    const ero = kulmaero(kesa.kohdat[i].mista, talvi.kohdat[i].mista);
    console.log(
      `  ${kesa.kohdat[i].nimi.padEnd(22)} kesällä ${kesa.kohdat[i].suunta} ${kesa.kohdat[i].nopeus} m/s, `
      + `talvella ${talvi.kohdat[i].suunta} ${talvi.kohdat[i].nopeus} m/s (ero ${Math.round(ero)}°)`,
    );
    if (ero < 90) {
      throw new Error(`${kesa.kohdat[i].nimi}: tuuli kääntyy vain ${Math.round(ero)}° — monsuunia ei näy`);
    }
  }
  return { kesa, talvi };
};

// ------------------------------------------------------------ kirjoitus

const rivit = (lista, sisennys = '  ') => lista.map((r) => `${sisennys}${JSON.stringify(r)},`).join('\n');

/*
 * Monsuunikausi omilla riveillään.
 *
 * Nuolia on yli kahdesataa kaudessa. Yhdellä rivillä ne olisivat
 * lukukelvoton parinkymmenen kilotavun mötkäle, ja jokainen uusi ajo
 * näyttäisi versiohistoriassa siltä kuin koko tiedosto olisi muuttunut.
 */
const kausiTeksti = (kausi) => `{
    nimi: ${JSON.stringify(kausi.nimi)},
    kuukaudet: ${JSON.stringify(kausi.kuukaudet)},
    kuukausiNumerot: ${JSON.stringify(kausi.kuukausiNumerot)},
    selitys: ${JSON.stringify(kausi.selitys)},
    purjehdus: ${JSON.stringify(kausi.purjehdus)},
    virta: ${JSON.stringify(kausi.virta)},
    kohdat: [
${rivit(kausi.kohdat, '      ')}
    ],
    nuolet: [
${rivit(kausi.nuolet, '      ')}
    ],
  }`;

const kirjoita = (vyohykkeet, virrat, monsuuni) => {
  const nuolia = monsuuni.kesa.nuolet.length + monsuuni.talvi.nuolet.length;
  const teksti = `// Tuulet ja merivirrat: pasaatit, valtamerivirrat ja monsuuni.
//
// TÄMÄ TIEDOSTO ON KONEEN KIRJOITTAMA. Älä muokkaa käsin:
//   NODE_USE_ENV_PROXY=1 node tools/hae-tuulet.mjs
//
// Aineisto: 1) ICOADS, 2° enhanced, kuukausien pitkän ajan keskiarvo
//              1971–2000 (uwnd, vwnd, wspd, sst) — laivojen havaintoja
//           2) OSCAR Sea Surface Velocity, 1/3°, 5 vrk:n koosteet
//              2011-12-06 … 2014-10-06 (u, v)
// Viite:    ICOADS: Freeman ym. 2017, International Journal of Climatology
//           37:2211–2232; tuote NOAA PSL, https://icoads.noaa.gov/
//           OSCAR: Bonjean & Lagerloef 2002, Journal of Physical
//           Oceanography 32:2938–2954; Earth & Space Research (ESR)
//           Vyöhykkeiden nimet ja kolmen kierron malli: NOAA/NWS JetStream,
//           Global Atmospheric Circulations
//           Virtojen keskiviivat: Tomczak & Godfrey, Regional Oceanography
//           (2. laitos 2003); monsuunivirrat Schott & McCreary 2001,
//           Progress in Oceanography 51:1–123
// Haettu:   ${HAETTU} osoitteesta
//           https://coastwatch.pfeg.noaa.gov/erddap/griddap/${TUULIAINEISTO}
//           https://coastwatch.pfeg.noaa.gov/erddap/griddap/${VIRTA_AINEISTO}
// Lisenssi: Molemmat aineistot jaellaan vapaasti. ERDDAPin lisenssiteksti
//           kummallekin: "The data may be used and redistributed for free
//           but is not intended for legal use, since it may contain
//           inaccuracies." ICOADSia ylläpitää NOAA, ja NOAAn tuottamana
//           aineisto ei ole Yhdysvalloissa tekijänoikeuden alainen.
//           OSCARin tekee Earth & Space Research NASAn rahoituksella, ja
//           se on avointa tutkimusaineistoa.
//
// --- MIKÄ ON MITATTU JA MIKÄ PIIRRETTY ---
//
// Lue tämä ennen kuin piirrät mitään numeroa näkyviin.
//
// MITATTUA (tulee suoraan aineistosta, ei käsin kirjoitettua):
//   - vyöhykkeiden rajat, suunnat, nopeudet ja vakaus
//   - ITCZ:n paikka vuodenajoittain
//   - virtojen nopeus ja lämpöero
//   - kaikki monsuunin nuolet ja kohtien luvut
//   - Somalivirran suunta ja nopeus kummassakin vuodenajassa
//
// PIIRRETTYÄ (havainnekuva, tarkkuus 1–2 astetta):
//   - merivirtojen viivat. Virta ei ole viiva vaan satojen kilometrien
//     levyinen vyöhyke, jonka keskikohta liikkuu viikoittain. Viivat on
//     piirretty oppikirjakartoista käsin.
//   - Somalivirran viiva samoin.
//
// Jokainen piirretty viiva on kuitenkin TARKISTETTU mittausaineistoa
// vastaan: hakutyökalu näytteistää OSCARin virtakentän viivan jokaisen
// pätkän kohdalta ja vaatii, että vähintään 75 % pätkistä osoittaa
// samaan suuntaan kuin mitattu virta. Lämmin/kylmä on tarkistettu
// reunavirroilla ICOADSin pintalämpötilasta: lämpimän virran vesi on
// lämpimämpää kuin saman leveysasteen meri keskimäärin. Kentät nopeus,
// lampoEro ja tarkistettu kertovat, mitä kullekin virralle mitattiin.
//
// --- MIKSI VYÖHYKKEIDEN RAJAT OVAT OUTOJA LUKUJA ---
//
// Oppikirja sanoo "pasaatit noin 30. leveysasteelta päiväntasaajalle".
// Tässä rajat on laskettu aineistosta: hevosleveydet ovat siellä, missä
// itä–länsi-suuntainen tuuli vaihtaa merkkiä, ja tyvenvyöhykkeen
// keskiviiva siellä, missä pohjois–etelä-suuntainen tuuli vaihtaa
// merkkiä. Siksi rajat eivät ole tasalukuja. Kenttä raja kertoo kummasta
// on kyse:
//   'mitattu'   molemmat reunat on laskettu aineistosta
//   'sopimus'   reunat ovat kirjallisuuden lukuja (hevosleveyksien
//               LEVEYS, karjuvien nelikymmenlukujen 40–50)
//   'sekoitus'  keskiviiva mitattu, leveys sopimus (tyvenvyöhyke)
//
// Vyöhykeluvuista on jätetty pois monsuunisektori (30–120° itäistä
// pituutta, 15° etelästä 30° pohjoiseen). Kolmen kierron malli ei päde
// siellä, ja mukana se vetäisi pohjoisen pasaatin keskiarvon vinoon.
// Monsuuni on siksi oma osionsa.
//
// Pasaattivyöhykkeet ulottuvat tässä ITCZ:ään asti, eli ne KOSKETTAVAT
// toisiaan päiväntasaajan tienoilla ja tyvenvyöhyke on piirretty niiden
// päälle. Se ei ole virhe: tyven on juuri se kaista, jossa pasaatit
// kohtaavat, ja sen paikka vaihtuu vuodenajan mukaan.
//
// --- MITÄ KUUKAUSIKESKIARVO EI NÄYTÄ ---
//
// Lue tämä ennen kuin selität lapselle "tyventä".
//
// Aineisto on kuukausikeskiarvojen keskiarvo 2 asteen ruuduissa. Siitä
// EI näy yksittäinen tyven eikä yksittäinen myrsky. Kaksi kuuluisaa
// asiaa jäävät siksi näkymättä, ja molemmat on sanottava ääneen:
//
//   1. Tyvenvyöhykkeen mitattu keskinopeus ei ole nolla. Se on selvästi
//      pasaattia pienempi, mutta kaukana tyvenestä. Purjelaivan viikkojen
//      seisominen oli paikallinen ja hetkellinen asia, jonka keskiarvo
//      pyyhkii pois.
//   2. Hevosleveyksillä ei mitata vähemmän tuulta kuin pasaateilla.
//      Niiden tuntomerkki keskiarvoaineistossa ei ole heikkous vaan
//      EPÄVAKAUS: tuulen suunta ei pysy. Sama koskee tyvenvyöhykettä.
//
// Siksi vakaus on tässä tiedostossa yhtä tärkeä luku kuin nopeus, eikä
// vyöhykkeitä pidä esittää pelkkien nopeuksien perusteella.
//
// --- VAKAUS ON PURJEHTIJAN LUKU ---
//
// vakaus on 0–1: ruudun kuukausikeskituulen vektoripituus jaettuna saman
// ruudun keskinopeudella. Arvo lähellä yhtä tarkoittaa, että tuuli oli
// lähes joka havainnossa samasta suunnasta; matala arvo tarkoittaa, että
// tuuli oli yhtä kova mutta suunta vaihteli. Juuri tästä pasaattien ja
// länsituulten ero syntyy: pasaatilla saattoi purjehtia viikkoja
// koskematta köysiin, länsituulissa ei.
//
// nopeus on skalaarinen keskinopeus (m/s) eli se, minkä laiva tuntee.
// Se on aina suurempi kuin vektorikeskiarvon pituus.
//
// --- SUUNNAT ---
//
// mista on meteorologinen suunta: MISTÄ tuulee, astetta pohjoisesta
// myötäpäivään. Koillispasaatin mista on siis lähes 70°, ja nuoli
// piirretään päinvastaiseen suuntaan (länsilounaaseen). Suuntasana on
// 16-portainen (itäkoillinen, itäkaakko), koska 8 porrasta antaisi
// koillispasaatille nimen "itä".
//
// Mitattu suunta on molemmilla pasaateilla lähempänä itää kuin nimi
// lupaa. Se ei ole virhe: nimet ovat purjehdusperinnettä, ja vyöhykkeen
// yli laskettu keskiarvo painottuu sen päiväntasaajan puoleiseen laitaan,
// jossa tuuli on jo lähes suoraan idästä.
//
// Monsuunin nuolissa annetaan u ja v (m/s itään ja pohjoiseen), koska
// nuolen saa niistä suoraan ilman trigonometriaa; sama u ja v on myös
// vyöhykkeillä. Virroilla ja Somalivirralla suunta on MINNE vesi kulkee —
// vesi ja tuuli nimetään vastakkain päin, ja se on maantieteen sopimus,
// ei virhe tässä tiedostossa.
//
// --- VIRTOJEN NOPEUS ---
//
// nopeus on virran YTIMEN nopeus OSCARin keskiarvokentässä: viivan
// jokaisen pätkän kohdalta otetaan nopein ruutu 1,2 asteen säteeltä ja
// näistä lasketaan keskiarvo. Suunnan tarkistus tehdään sen sijaan koko
// säteen keskiarvosta, joka on suunnan osalta luotettavampi.
//
// Luku on kolmen vuoden aikakeskiarvo, joten hetkellinen nopeus on
// suurempi: NOAAn mukaan Golfvirta kulkee 1–3 solmun eli noin 0,5–1,5
// metrin sekuntinopeudella. Keskiarvokentän SUHTEET ovat silti oikeat,
// ja juuri ne kannattaa näyttää: mannerten itälaidan virrat (Golfvirta,
// Kuroshio, Agulhas) ovat mittauksessa 5–10 kertaa nopeampia kuin
// länsilaidan virrat (Kanaria, Kalifornia, Benguela). Purjelaivalle ero
// oli merkittävä.
//
// --- SAUMA ---
//
// Länsituulten ajovirta ja ekvatoriaalivirrat ylittävät 180. pituus-
// piirin, jolloin pituusaste hyppää kesken viivan arvosta 165 arvoon
// -170. Sauma on käsiteltävä kuten muussakin aineistossa
// (ks. tools/tee-maasto.mjs).
//
// --- KENTÄT ---
//
//   vyohykkeet  avain, nimi, pallonpuolisko, kaistat, selitys, purjehdus.
//               Tyvenvyöhykkeellä on lisäksi itcz: keskiviivan paikka
//               vuoden, talven ja kesän keskiarvona sekä lista
//               kuukausittain (tammikuusta joulukuuhun). Juuri tämä
//               lista kertoo, miksi purjehdusaika oli ratkaiseva:
//               vyöhyke on eri paikassa keväällä ja syksyllä.
//
//               kaistat on LISTA, ei yksi kaista: hevosleveydet ja
//               länsituulet ovat molemmilla pallonpuoliskoilla, ja
//               niiden luvut ovat eri. Kaistassa on etela ja pohjoinen
//               (leveysasteet, + pohjoiseen), raja, u ja v (m/s),
//               mista (astetta), suunta (sana), nopeus (m/s), vakaus
//               (0–1) ja ydin (leveysaste, jolla vyöhyke on vahvimmillaan).
//
//   virrat      avain, nimi, laatu ('lämmin' tai 'kylmä'), suunta
//               (sanoin), nopeus (m/s, ytimestä mitattu), lampoEro (°C
//               saman leveysasteen meren keskiarvoon nähden),
//               tarkistettu, viivat, selitys, purjehdus.
//               viivat on LISTA VIIVOJA: Agulhasilla on paluumutka ja
//               ekvatoriaalivirroilla oma viiva kussakin valtameressä.
//               Piste on [lon, lat].
//
//   monsuuni    kesa ja talvi, kummassakin nimi, kuukaudet (sanoin),
//               kuukausiNumerot, nuolet, kohdat, virta, selitys ja
//               purjehdus.
//               nuolet on 4°:n ruudukko Intian valtameren yllä:
//               lon, lat, u, v (m/s) ja nopeus (m/s). Ruudukko on
//               ICOADSin oma 2°:n ruudukko, ja rannikolla ruudun
//               KESKIPISTE voi osua maalle, vaikka havainnot ovat
//               mereltä (ICOADS on merihavaintoaineisto, joten pelkkää
//               mannerta olevissa ruuduissa ei ole arvoa lainkaan).
//               Piirtäjä voi pudottaa maalle osuvat nuolet pois.
//               kohdat on viisi nimettyä merialuetta: lon, lat, mista,
//               suunta, nopeus.
//               virta on Somalivirta: viiva, minne (astetta),
//               ilmansuunta, nopeus ja koosteita (montako OSCARin
//               viiden vuorokauden koostetta keskiarvoon osui).
//
// ${vyohykkeet.length} vyöhykettä, ${virrat.length} merivirtaa, ${nuolia} monsuuninuolta.

const VYOHYKKEET = [
${rivit(vyohykkeet)}
];

const VIRRAT = [
${rivit(virrat)}
];

const MONSUUNI = {
  kesa: ${kausiTeksti(monsuuni.kesa)},

  talvi: ${kausiTeksti(monsuuni.talvi)},
};

export const TUULET = {
  vyohykkeet: VYOHYKKEET,
  virrat: VIRRAT,
  monsuuni: MONSUUNI,

  lahde: {
    tuulet: 'ICOADS, 2° enhanced, kuukausien pitkän ajan keskiarvo 1971–2000 (NOAA PSL)',
    virrat: 'OSCAR Sea Surface Velocity, 1/3°, 5 vrk:n koosteet 2011-12-06…2014-10-06 (Earth & Space Research)',
    viitteet: [
      'Freeman ym. 2017, International Journal of Climatology 37:2211–2232 (ICOADS Release 3.0)',
      'Bonjean & Lagerloef 2002, Journal of Physical Oceanography 32:2938–2954 (OSCAR)',
      'NOAA/NWS JetStream: Global Atmospheric Circulations (vyöhykkeiden nimet)',
      'Tomczak & Godfrey 2003, Regional Oceanography: An Introduction, 2. laitos (virtojen keskiviivat)',
      'Schott & McCreary 2001, Progress in Oceanography 51:1–123 (monsuunin kierto)',
    ],
    osoite: 'https://coastwatch.pfeg.noaa.gov/erddap/griddap/${TUULIAINEISTO}',
    haettu: '${HAETTU}',
  },

  lisenssi: {
    nimi: 'Vapaasti käytettävä (NOAA / Earth & Space Research)',
    ehto: 'ERDDAP: "The data may be used and redistributed for free but is not '
      + 'intended for legal use, since it may contain inaccuracies."',
    osoite: 'https://coastwatch.pfeg.noaa.gov/erddap/info/${TUULIAINEISTO}/index.html',
  },
};
`;
  writeFileSync(KOHDE, teksti);
  console.log(`\nkirjoitettu ${KOHDE} (${Math.round(teksti.length / 1024)} kt)`);
};

// ----------------------------------------------------------------- ajo

console.log('ICOADS: laivojen tuulihavainnot');
const kentta = await haeIcoads();
tarkistaLampoKierto(kentta);

console.log('\nvyöhykkeet');
const vyohykkeet = teeVyohykkeet(kentta);
for (const v of vyohykkeet) {
  for (const k of v.kaistat) {
    console.log(
      `  ${v.nimi.padEnd(26)} ${String(k.etela).padStart(6)}…${String(k.pohjoinen).padEnd(6)} `
      + `${k.suunta.padEnd(10)} ${k.mista}°  ${k.nopeus} m/s  vakaus ${k.vakaus}  (${k.raja})`,
    );
  }
}

console.log('\nmerivirrat (OSCAR)');
const virrat = await teeVirrat(kentta);

console.log('\nmonsuuni');
const monsuuni = await teeMonsuuni(kentta);

if (kuiva) {
  console.log('\n--kuiva: tiedostoa ei kirjoitettu');
  process.exit(0);
}
kirjoita(vyohykkeet, virrat, monsuuni);
