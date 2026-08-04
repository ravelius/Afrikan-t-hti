/*
 * Hienovarainen syvyys seepiakarttaan -> js/packs/maailmankartta-varjostus.js
 *
 *   node tools/tee-seepiavarjostus.mjs [--kuiva] [valitsimet]
 *
 * Lukee korkeusruudukon (tools/hae-korkeusruudukko.mjs), varjostaa sen
 * luoteesta (tools/varjostus.mjs) ja tekee varjosta MONIKULMIOITA laudan
 * koordinaateissa. Tuloksena on kolme vyöhykettä — kaksi varjon ja yksi
 * valon — jotka piirretään kartan pysyvään taiteeseen aivan kuten
 * korkeusvyöhykkeet.
 *
 * --- omistajan päätös 4.8.2026 ---
 *
 * "täysväri siihen linssiin, mutta pidetään seepia normaalissa
 * pelinäkymässä, ja sitä voi hieman kehittää vielä noiden mainitsemieni
 * varjostusten ja muiden avulla."
 *
 * Kaksi eri lopputulosta samasta laskennasta. Linssi saa täysvärisen
 * reliefikartan; TÄMÄ tiedosto tekee toisen puolen. Sana on HIEMAN:
 * kartta pysyy seepiana, mikään ei saa uutta väriä, eikä kartalle tule
 * uutta kerrosta joka vaatii katsojalta huomiota. Ainoa muutos on että
 * nykyiset vaimeat korkeusvyöhykkeet alkavat näyttää maastolta.
 *
 * ===================================================================
 * MIKSI VEKTORI EIKÄ KUVA — ja mitä tästä mitattiin
 * ===================================================================
 *
 * Kartan staattinen taide muutetaan bittikartaksi rasteroimalla SVG
 * kuvaksi (js/mapart.js rasteroiRuutu: Blob -> <img> -> canvas). SVG,
 * joka ladataan KUVANA, ei saa hakea ulkoisia tiedostoja. Mitattuna
 * täsmälleen sillä polulla, jota rasteroiRuutu käyttää:
 *
 *     <image href="/assets/icon-192.png">   ->  rgba(0,0,0,0)   tyhjä
 *     <image href="data:image/png;base64,"> ->  rgba(255,0,0,255)  näkyy
 *     <rect fill="#0f0">  (verrokki)        ->  rgba(0,255,0,255)  näkyy
 *
 * Ulkoinen kuva jää siis tyhjäksi kuten pelättiin, MUTTA data:-URI
 * toimii. Kuvavaihtoehtoa ei siis kaadakaan tekniikka vaan koko:
 *
 *   1. Ruutu kootaan paloista, jotka osuvat siihen (mapart.js
 *      kokoaRuudunTaide). Yksi koko maailman reliefikuva olisi yksi
 *      pala, joka osuu JOKAISEEN ruutuun — jokainen ruutu purkaisi
 *      megapikselin kuvan, vaikka siitä näkyisi prosentti.
 *   2. Kuvan paloittelu ruuduiksi korjaisi sen, mutta 0,2 asteen
 *      tarkkuudella maailma on 1800 x 900 pikseliä, ja base64 lihottaa
 *      vielä kolmanneksen. Repo kantaisi megatavuja siitä, mistä
 *      monikulmiot maksavat kymmeniä kilotavuja.
 *
 * Elävä kerros raster-ruutujen päällä (mix-blend-mode: multiply) taas
 * on tässä repossa kolmesti kaatunut tapa: iOS vapauttaa suodatetun tai
 * sekoitetun kerroksen piirtopuskurin taustalla eikä saa sitä enää
 * varattua, ja kerros palaa TYHJÄNÄ. Kartalla ei ole yhtään suodatinta
 * juuri siksi (ks. js/mapart.js drawDefs, drawMaasto). Hienovarainen
 * syvyys ei ole sen arvoinen, että kartta katoaisi puhelimessa.
 *
 * Vektori menee samaan staattiseen taiteeseen kuin korkeusvyöhykkeet,
 * saa saman käsin piirretyn heilunnan (kasinPiirretty) ja maksaa
 * ajonaikana täsmälleen nolla.
 *
 * ===================================================================
 * MIKSI VARJON ÄÄRIVIIVAT EIKÄ TUMMA REUNA VYÖHYKKEEN KAAKKOISPUOLELLE
 * ===================================================================
 *
 * Ilmeisin tapa saada rinne näkymään olisi piirtää jokaiselle nykyiselle
 * korkeusvyöhykkeelle hento tummempi reuna kaakon puolelle. Se on halpa
 * mutta se on VÄÄRÄ KUVA kahdesta syystä:
 *
 *   1. Se osaa vain vyöhykkeen RAJAN. Tiibetin ylätasanko on yhtä
 *      vyöhykettä laidasta laitaan, joten se jäisi litteäksi juuri
 *      niin kuin nytkin — ja tasanko on se paikka, jossa litteys
 *      eniten häiritsee.
 *   2. Vyöhykkeen kaakkoisreuna ei ole sama asia kuin kaakkoon viettävä
 *      rinne. Andien itärinne on satoja kilometrejä leveä ja loiva, sen
 *      länsireuna taas pystysuora — vyöhykkeen reunaan piirretty varjo
 *      kertoisi molemmista saman valheen.
 *
 * Varjostus kysyy jokaiselta ruudulta erikseen "mihin suuntaan tämä
 * viettää", eikä siltä jää tasankoa väliin. Se on koko ero litteän
 * läntin ja maaston välillä (ks. tools/varjostus.mjs).
 *
 * ===================================================================
 * MIKSI KAKSI VARJOA JA VAIN YKSI VALO
 * ===================================================================
 *
 * Varjo leikkautuu nollaan ja valo ykköseen, joten poikkeama tasaisesta
 * ei ole symmetrinen: mitattuna 0,2 asteen ruudukosta varjon puolella
 * ylitetään -0,26 sadasosassa maasta ja valon puolella vain +0,12.
 * Varjo siis KANTAA muodon ja valo vain vahvistaa sitä.
 *
 * Sama näkyy paperilla: seepiakartan vaalein sävy on paperi itse, eikä
 * sitä vaaleampaa ole olemassa (ks. css/styles.css .korkeus-huippu ja
 * "Himalaja näyttää reiältä"). Valo voi siis vain hipaista, kun taas
 * varjolla on koko musteen matka käytettävissään.
 *
 * ===================================================================
 * MIKSI TÄMÄ EI KIRJOITA js/packs/maasto-korkeus.js:ää
 * ===================================================================
 *
 * Se on kartan nykyinen maasto ja se toimii. Varjostus on sen RINNALLE
 * tuleva kerros eikä sen korvaaja: korkeusvyöhyke kertoo edelleen
 * kuinka korkealla ollaan, varjo kertoo mihin suuntaan maa viettää.
 * Jos ne yhdistettäisiin, kumpaakaan ei voisi säätää erikseen.
 *
 * Verkko: Noden fetch ei lue HTTPS_PROXYa, ks. tools/hae-radiot.mjs.
 * Ruudukko on tavallisesti jo välimuistissa, jolloin verkkoa ei tarvita.
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const TAMA = fileURLToPath(import.meta.url);

if (!process.env.NODE_USE_ENV_PROXY && (process.env.HTTPS_PROXY || process.env.https_proxy)) {
  const ajo = spawnSync(process.execPath, [TAMA, ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1', NODE_NO_WARNINGS: '1' },
  });
  process.exit(ajo.status ?? 1);
}

const { haeKorkeusruudukko } = await import('./hae-korkeusruudukko.mjs');
const { varjosta, OLETUKSET: VARJO_OLETUKSET, AURINKO } = await import('./varjostus.mjs');
const { sovitaMaailma } = await import('./vanha-maailma.mjs');

const JUURI = join(dirname(TAMA), '..');
const KOHDE = join(JUURI, 'js', 'packs', 'maailmankartta-varjostus.js');

// ---------------------------------------------------------------- valitsimet

function valitsin(nimi, oletus) {
  const i = process.argv.indexOf('--' + nimi);
  if (i < 0) return oletus;
  const arvo = process.argv[i + 1];
  return arvo === undefined || arvo.startsWith('--') ? true : Number(arvo);
}

const ASETUKSET = {
  kuiva: process.argv.includes('--kuiva'),
  /*
   * Ruudun koko, jolla ääriviivat piirretään.
   *
   * Varjo LASKETAAN 0,05 asteen ruudukosta ja karkeutetaan vasta sen
   * jälkeen. Järjestys on tärkeä: jos rinteen jyrkkyys laskettaisiin
   * suoraan karkeasta ruudukosta, jokainen harjanne olisi ensin
   * keskiarvoistettu pois eikä varjostettavaa olisi jäljellä. Nyt
   * keskiarvoistetaan valmis varjo, mikä on täsmälleen se, miltä
   * reliefikuva näyttää pienennettynä.
   *
   * 0,2° on laudalla 6,7 yksikköä (12000 yksikköä = 360°). Kartan
   * tiukin zoomi näyttää noin 700 yksikköä eli sata ruutua leveydeltä,
   * joten ääriviiva ei ole portaikko siinäkään.
   */
  ruutu: valitsin('ruutu', 0.2),
  /*
   * Sumennuskierroksia karkealle varjolle.
   *
   * Tämä on se säädin, joka päättää tuleeko kartalle maastoa vai
   * täpliä. Sumentamaton varjo on täynnä yhden ruudun kokoisia
   * saarekkeita, joista jokainen on oma renkaansa: mitattuna 0 kierrosta
   * antaa yli 8000 rengasta ja 3 kierrosta reilut 1200 samalla
   * alarajalla. Muoto ei häviä, koska se on satoja kilometrejä leveä —
   * vain rakeisuus häviää.
   */
  sumennus: valitsin('sumennus', 3),
  /*
   * Vyöhykkeiden rajat POIKKEAMANA tasaisesta maasta (varjosta()
   * palauttaa `tasainen`, joka on 0,707 eikä 0,5 — ks. varjostus.mjs).
   * Positiivinen luku tarkoittaa molemmilla puolilla etäisyyttä
   * tasaisesta: varjo1 = 0,04 on poikkeama -0,04.
   *
   * Luvut on valittu 0,2 asteen ruudukon jakaumasta sumennuksen
   * jälkeen niin, että varjo1 kattaa noin kymmenesosan maasta ja
   * varjo2 muutaman prosentin. Sitä leveämpi vyöhyke ei enää erottele
   * vuoristoa tasangosta vaan värjää mantereen.
   */
  varjo1: valitsin('varjo1', 0.04),
  varjo2: valitsin('varjo2', 0.09),
  valo1: valitsin('valo1', 0.035),
  /*
   * Ramer-Douglas-Peucker, asteina. Tiukempi kuin korkeusvyöhykkeillä
   * (0,2°), koska varjon muodot ovat kapeita nauhoja eivätkä pyöreitä
   * läiskiä: 0,2° oikaisisi harjanteen varjon suoraksi tikuksi.
   */
  toleranssi: valitsin('toleranssi', 0.12),
  /*
   * Pienin säilytettävä rengas neliökilometreinä — sama rajoitin kuin
   * sisartyökalussa hae-korkeusvyohykkeet.mjs ja samasta syystä: jos
   * kartta menee tukkoon, tätä nostetaan eikä yksityiskohtia lisätä.
   */
  vahinAla: valitsin('vahin-ala', 9000),
  katto: valitsin('katto', 320 * 1024),
  /*
   * Kuinka suuren osan karkean ruudun alasta on oltava maata, ennen
   * kuin ruutu saa varjoa lainkaan.
   *
   * Meri jätetään kokonaan varjostamatta. Se ei ole laiskuutta vaan
   * omistajan "hieman": seepiakartalla meri on PAPERI eikä väri, ja
   * varjo paperilla olisi uusi kerros eikä nykyisen hienovarainen
   * syventäminen. Merenpohjan muodot ovat linssin asia.
   *
   * Rannikko häivytetään sen sijaan että se leikattaisiin: ruudun arvo
   * on maan varjojen summa jaettuna KAIKKIEN ruutujen määrällä, joten
   * puoliksi merellä oleva ruutu saa puolet voimasta. Ilman häivytystä
   * varjo vuotaisi rantaviivan yli — ETOPO1:n rantaviiva ja kartan
   * oma (Natural Earth) eivät ole sama viiva, ja 0,2 asteen ruutu on
   * päiväntasaajalla 22 kilometriä leveä.
   */
  maataVahintaan: valitsin('maata-vahintaan', 0.35),
};

const RAJAT = [
  // avain, kentän merkki (varjo lasketaan negatiivisesta poikkeamasta), raja
  { avain: 'varjo1', merkki: -1, raja: ASETUKSET.varjo1 },
  { avain: 'varjo2', merkki: -1, raja: ASETUKSET.varjo2 },
  { avain: 'valo1', merkki: 1, raja: ASETUKSET.valo1 },
];

// ------------------------------------------------------------- karkeutus

/**
 * Karkeuttaa varjon poikkeaman maalta ja häivyttää rannikon.
 *
 * Palauttaa `{ z, leveys, korkeus, ruutu }`, jossa z on poikkeama
 * tasaisesta: negatiivinen on varjo, positiivinen valo, meri on nolla.
 *
 * Sauma säilyy: lähtöruudukon sarakkeet 0 ja leveys-1 ovat sama
 * meridiaani, ja koska kerroin jakaa välin tasan, niin ovat tuloksenkin.
 */
function karkeuta(g, varjo, tasainen, kerroin) {
  const leveys = Math.floor((g.leveys - 1) / kerroin) + 1;
  const korkeus = Math.floor((g.korkeus - 1) / kerroin) + 1;
  const summa = new Float64Array(leveys * korkeus);
  const maata = new Int32Array(leveys * korkeus);
  const kaikki = new Int32Array(leveys * korkeus);

  for (let y = 0; y < g.korkeus; y++) {
    const Y = Math.min(korkeus - 1, Math.round(y / kerroin));
    const rivi = Y * leveys;
    for (let x = 0; x < g.leveys; x++) {
      const i = rivi + Math.min(leveys - 1, Math.round(x / kerroin));
      kaikki[i]++;
      if (g.z[y * g.leveys + x] >= 0) {
        summa[i] += varjo[y * g.leveys + x] - tasainen;
        maata[i]++;
      }
    }
  }

  const z = new Float64Array(leveys * korkeus);
  for (let i = 0; i < z.length; i++) {
    if (!kaikki[i] || maata[i] / kaikki[i] < ASETUKSET.maataVahintaan) continue;
    // Jakajana KAIKKI eikä maa: rannikkoruutu saa vaimeamman varjon.
    z[i] = summa[i] / kaikki[i];
  }
  return { z, leveys, korkeus, ruutu: g.ruutu * kerroin };
}

/*
 * Kolmen kertaa kolmen keskiarvo, sauman yli kiertäen.
 *
 * Sarakkeen 0 länsinaapuri on leveys-2 eikä leveys-1: viimeinen sarake
 * on sama meridiaani kuin ensimmäinen, joten tavallinen modulo ottaisi
 * naapuriksi ruudun itsensä ja jättäisi päivämääränrajan kohdalle
 * sumentumattoman kaistaleen.
 */
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
            let xx = x + dx;
            if (xx < 0) xx = leveys - 2;
            else if (xx >= leveys) xx = 1;
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
 * Perinteinen marching squares, lainattu hae-korkeusvyohykkeet.mjs:stä.
 * Lainattu eikä jaettu samasta syystä kuin siellä: työkalut saavat
 * kehittyä eri suuntiin, ja tämä on jo kehittynyt kahdella tavalla.
 *
 * 1. SATULATAPAUS 5 ON KORJATTU. Sisartyökalussa (ja sen esikuvassa
 *    hae-topografia.mjs) tapauksen 5 kaksi haaraa ovat väärin päin:
 *    kun keskiarvo on tason YLÄPUOLELLA, ylätaso on yhtenäinen ja
 *    erotettaviksi jäävät ALEMMAT kulmat — nykyinen koodi erottaa
 *    ylemmät. Tapaus 10 on sielläkin oikein. Vika ei näy vuorilla,
 *    koska kapeat solmut katoavat sumennuksessa, mutta varjokenttä on
 *    täynnä satuloita (harjanne on satula määritelmän mukaan), joten
 *    täällä se kannattaa tehdä oikein.
 *
 *    Suunta ratkaisee, koska liitaRenkaiksi liittää janat päästä
 *    päähän. Sopimus on koko taulukossa sama: ylätaso jää janan
 *    OIKEALLE puolelle. Tapaus 1 (vasen -> ala) kertoo sen.
 *
 * 2. Kehysarvo on parametri. Varjokenttä on nollakeskinen eikä
 *    korkeus, joten "kaikkea alempi" on tässä 0 miinus jotain eikä
 *    -9999 metriä.
 */
function aariviivat(g, taso, kehysArvo) {
  const { leveys, korkeus, ruutu, z } = g;
  const L = leveys + 2;
  const K = korkeus + 2;
  const kehys = new Float64Array(L * K).fill(kehysArvo);
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
          // v0 ja v2 ylätasoa. Keskiarvo kertoo, kumpi pari on yhteydessä.
          const keski = (v0 + v1 + v2 + v3) / 4;
          if (keski >= taso) { lisaa(oikea(), ala()); lisaa(vasen(), yla()); }
          else { lisaa(vasen(), ala()); lisaa(oikea(), yla()); }
          break;
        }
        case 10: {
          // v1 ja v3 ylätasoa.
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
 * Liittää irralliset janat renkaiksi päätepisteiden perusteella.
 * Naapuriruudut laskevat saman reunan leikkauskohdan samasta kaavasta
 * samoista luvuista, joten päätepisteet ovat bitilleen samat eikä
 * sietoa tarvita. (hae-korkeusvyohykkeet.mjs, sellaisenaan)
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

/* Ramer-Douglas-Peucker. (hae-korkeusvyohykkeet.mjs, sellaisenaan) */
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
 * Suljettu rengas kahtena kaarena, muuten alku- ja loppupisteen väli
 * jää oikaisematta ja renkaisiin tulee tekopiikkejä.
 * (hae-korkeusvyohykkeet.mjs, sellaisenaan)
 */
function yksinkertaistaRengas(rengas, toleranssi) {
  const p = rengas.slice(0, -1);
  if (p.length < 4) return null;
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

/* Renkaan ala neliökilometreinä. (hae-korkeusvyohykkeet.mjs, sellaisenaan) */
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

// -------------------------------------------------------------- projektio

/*
 * Sama sovitus kuin laudalla itsellään ja kuin tools/tee-maasto.mjs:llä.
 * Jos nämä eriytyisivät, varjo ei osuisi vuoren päälle.
 */
const { MAAILMANKARTTA } = await import(`file://${join(JUURI, 'js/packs/maailmankartta.js')}`);
const LAUDAN_LEVEYS = MAAILMANKARTTA.map.width;
const LAUDAN_KORKEUS = MAAILMANKARTTA.map.height;
const { muunnaViiva } = sovitaMaailma({
  leveys: LAUDAN_LEVEYS, lon0: -175, etela: -58, pohjoinen: 76,
});

const luku = (n) => Number(n.toFixed(1));
const viiva = (pisteet) => muunnaViiva(pisteet).map(([x, y]) => [luku(x), luku(y)]);

/*
 * Laudan ulkopuolelle jäävä muoto pois — sama enemmistösääntö kuin
 * tools/tee-maasto.mjs:ssä. Etelämanner projisoituu laudan alareunan
 * alapuolelle eikä kuulu kartalle; Grönlanti ylittää yläreunan
 * osittain ja kuuluu ehdottomasti mukaan.
 */
const enimmakseenLaudalla = (pisteet) => {
  const sisalla = pisteet.filter(([, y]) => y >= 0 && y <= LAUDAN_KORKEUS).length;
  return sisalla > pisteet.length * 0.5;
};

/*
 * Rengas laudalle, kierron kopio mukaan. Sauman yli roikkuva monikulmio
 * on täytettävä myös laudan toisella laidalla, koska <use> toistaa vain
 * sen mitä on piirretty.
 */
const laudalle = (pisteet) => {
  const perus = viiva(pisteet);
  const xs = perus.map(([x]) => x);
  const ulos = [perus];
  if (Math.min(...xs) < 0) ulos.push(perus.map(([x, y]) => [luku(x + LAUDAN_LEVEYS), y]));
  else if (Math.max(...xs) > LAUDAN_LEVEYS) ulos.push(perus.map(([x, y]) => [luku(x - LAUDAN_LEVEYS), y]));
  return ulos;
};

// ------------------------------------------------------------------- ajo

function tuota(g, toleranssi, vahinAla) {
  const vyohykkeet = {};
  const tilasto = {};
  for (const { avain, merkki, raja } of RAJAT) {
    /*
     * Kenttä käännetään varjon puolella, jotta ääriviiva rajaa aina
     * SEN alueen, joka on rajan yli. Kehys on rajaa pienempi, joten
     * jokainen rengas sulkeutuu ruudukon sisällä eikä varjo vuoda
     * kartan laidan yli.
     */
    const kentta = merkki === 1 ? g : { ...g, z: g.z.map((v) => -v) };
    const raa = aariviivat(kentta, raja, -1);
    let pudotettu = 0;
    let ulkopuolella = 0;
    const ulos = [];
    for (const rengas of raa) {
      const yks = yksinkertaistaRengas(rengas, toleranssi);
      if (!yks) { pudotettu++; continue; }
      if (alaKm2(yks) < vahinAla) { pudotettu++; continue; }
      if (!enimmakseenLaudalla(viiva(yks))) { ulkopuolella++; continue; }
      ulos.push(...laudalle(yks));
    }
    vyohykkeet[avain] = ulos;
    tilasto[avain] = {
      raakoja: raa.length,
      pudotettu,
      ulkopuolella,
      renkaita: ulos.length,
      pisteitä: ulos.reduce((s, r) => s + r.length, 0),
    };
  }
  return { vyohykkeet, tilasto };
}

function kirjoita(vyohykkeet, tilasto, toleranssi, vahinAla, lahteet) {
  const rivit = [];
  rivit.push('// Maailmankartan varjostus laudan koordinaatteina.');
  rivit.push('//');
  rivit.push('// TÄMÄ TIEDOSTO ON KONEEN KIRJOITTAMA. Älä muokkaa käsin:');
  rivit.push('//   node tools/tee-seepiavarjostus.mjs');
  rivit.push('//');
  rivit.push(`// Aineisto: ${lahteet.aineisto}`);
  rivit.push(`// Viite:    ${lahteet.viite}`);
  rivit.push(`// Haettu:   ${lahteet.osoite}`);
  rivit.push('// Lisenssi: Public domain — Yhdysvaltain liittovaltion viraston (NOAA)');
  rivit.push('//           tuottamana aineisto ei ole tekijänoikeuden alainen.');
  rivit.push('//');
  rivit.push('// MITÄ NÄMÄ MONIKULMIOT OVAT');
  rivit.push('//');
  rivit.push('// Ne eivät ole korkeusvyöhykkeitä vaan VARJOA: alueita, joilla maa');
  rivit.push(`// viettää poispäin kuvitteellisesta auringosta (atsimuutti ${AURINKO.atsimuutti}°,`);
  rivit.push(`// korkeuskulma ${AURINKO.korkeuskulma}° eli luoteesta). Aurinko on luoteessa siksi,`);
  rivit.push('// että ihmissilmä lukee luoteesta valaistun pinnan kohoumana ja');
  rivit.push('// kaakosta valaistun kuoppana — väärä suunta kääntäisi vuoret');
  rivit.push('// laaksoiksi (ks. tools/varjostus.mjs).');
  rivit.push('//');
  rivit.push('// varjo1 ja varjo2 ovat SISÄKKÄISIÄ kuten korkeusvyöhykkeet: varjo2');
  rivit.push('// on varjo1:n sisällä. Piirrä varjo1 ensin, niin päällekkäisyys');
  rivit.push('// tummentaa syvimmät kohdat itsestään. valo1 on eri puoli eikä');
  rivit.push('// mene niiden kanssa päällekkäin.');
  rivit.push('//');
  rivit.push('// Meri on jätetty kokonaan varjostamatta ja rannikko on häivytetty:');
  rivit.push('// seepiakartalla meri on paperia, ja paperille piirretty varjo olisi');
  rivit.push('// uusi kerros eikä nykyisen hienovarainen syventäminen.');
  rivit.push('//');
  rivit.push('// Kynnykset joilla tämä ajo tehtiin:');
  rivit.push(`//   varjon ruudukko    ${ASETUKSET.ruutu}° (laskettu 0.05°:sta, keskiarvoistaen)`);
  rivit.push(`//   liioittelu         ${VARJO_OLETUKSET.liioittelu} (varjostus.mjs:n oletus)`);
  rivit.push(`//   sumennus           ${ASETUKSET.sumennus} x 3x3`);
  rivit.push(`//   rajat              varjo ${ASETUKSET.varjo1} ja ${ASETUKSET.varjo2}, valo ${ASETUKSET.valo1} (poikkeamana tasaisesta)`);
  rivit.push(`//   RDP-toleranssi     ${toleranssi}°`);
  rivit.push(`//   pienin rengas      ${Math.round(vahinAla)} km²`);
  rivit.push(`//   maata ruudussa     vähintään ${Math.round(ASETUKSET.maataVahintaan * 100)} %`);
  rivit.push('//');
  for (const { avain } of RAJAT) {
    const t = tilasto[avain];
    rivit.push(`//   ${avain.padEnd(7)} ${String(t.renkaita).padStart(4)} rengasta, ${String(t.pisteitä).padStart(6)} pistettä`
      + ` (raakoja ${t.raakoja}, pudotettu ${t.pudotettu}, laudan ulkopuolelta ${t.ulkopuolella})`);
  }
  rivit.push('');
  const lista = (renkaat) => renkaat
    .map((r) => `  [${r.map(([x, y]) => `[${x},${y}]`).join(',')}],`).join('\n');
  for (const { avain } of RAJAT) {
    rivit.push(`const ${avain.toUpperCase()} = [`);
    rivit.push(lista(vyohykkeet[avain]));
    rivit.push('];');
    rivit.push('');
  }
  rivit.push('export const MAASTON_VARJOSTUS = {');
  rivit.push('  varjo1: VARJO1, varjo2: VARJO2, valo1: VALO1,');
  rivit.push('};');
  rivit.push('');
  return rivit.join('\n');
}

async function main() {
  const g = await haeKorkeusruudukko();
  process.stderr.write(`ruudukko ${g.leveys} x ${g.korkeus} (${g.ruutu}°)\n`);

  const { varjo, tasainen } = varjosta(g);
  process.stderr.write(`varjostettu, tasainen maa = ${tasainen.toFixed(3)}, liioittelu ${VARJO_OLETUKSET.liioittelu}\n`);

  const kerroin = Math.round(ASETUKSET.ruutu / g.ruutu);
  if (Math.abs(kerroin * g.ruutu - ASETUKSET.ruutu) > 1e-9) {
    throw new Error(`--ruutu ${ASETUKSET.ruutu} ei ole lähderuudukon ${g.ruutu} monikerta`);
  }
  let karkea = karkeuta(g, varjo, tasainen, kerroin);
  process.stderr.write(`karkeutettu ${karkea.leveys} x ${karkea.korkeus} (${karkea.ruutu}°)\n`);
  karkea = sumenna(karkea, ASETUKSET.sumennus);
  process.stderr.write(`sumennettu ${ASETUKSET.sumennus} kertaa\n\n`);

  // Kuinka suuri osa maasta jää minkäkin rajan yli — tämä on se luku,
  // jolla rajoja säädetään, eikä silmämäärä.
  let maata = 0;
  const yli = new Map(RAJAT.map(({ avain }) => [avain, 0]));
  for (const v of karkea.z) {
    if (v === 0) continue;
    maata++;
    for (const { avain, merkki, raja } of RAJAT) if (merkki * v >= raja) yli.set(avain, yli.get(avain) + 1);
  }
  for (const { avain, raja } of RAJAT) {
    process.stderr.write(`${avain.padEnd(7)} raja ${raja} -> ${(yli.get(avain) / maata * 100).toFixed(1)} % maasta\n`);
  }
  process.stderr.write('\n');

  let toleranssi = ASETUKSET.toleranssi;
  let vahinAla = ASETUKSET.vahinAla;
  let teksti = null;
  for (let kierros = 0; kierros < 12; kierros++) {
    const { vyohykkeet, tilasto } = tuota(karkea, toleranssi, vahinAla);
    teksti = kirjoita(vyohykkeet, tilasto, toleranssi, vahinAla, g.lahteet);
    const koko = Buffer.byteLength(teksti);
    process.stderr.write(`kierros ${kierros}: toleranssi ${toleranssi.toFixed(3)}°, vähin ala ${Math.round(vahinAla)} km² -> ${(koko / 1024).toFixed(1)} kt\n`);
    for (const { avain } of RAJAT) {
      const s = tilasto[avain];
      process.stderr.write(`   ${avain.padEnd(7)} ${String(s.renkaita).padStart(4)} rengasta ${String(s.pisteitä).padStart(6)} pistettä (raakoja ${s.raakoja}, pudotettu ${s.pudotettu})\n`);
    }
    if (koko <= ASETUKSET.katto) break;
    toleranssi *= 1.25;
    vahinAla *= 1.6;
  }
  if (Buffer.byteLength(teksti) > ASETUKSET.katto) {
    throw new Error(`${Math.round(ASETUKSET.katto / 1024)} kt ei alittunut — nosta --toleranssi ja --vahin-ala käsin`);
  }

  if (ASETUKSET.kuiva) {
    process.stderr.write('\n--kuiva: mitään ei kirjoitettu\n');
    return;
  }
  writeFileSync(KOHDE, teksti);
  process.stderr.write(`\nkirjoitettu ${KOHDE} (${(Buffer.byteLength(teksti) / 1024).toFixed(1)} kt)\n`);
}

main().catch(e => { process.stderr.write('VIRHE: ' + (e.stack || e.message) + '\n'); process.exit(1); });
