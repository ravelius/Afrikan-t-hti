/*
 * NASAn yökuva maapallosta -> assets/linssit/yokartta.jpg
 *
 *   node tools/hae-yonkartta.mjs [--kuiva] [valitsimet]
 *
 * Hakee Black Marble -yökuvan tasakulmaisessa projektiossa, muuntaa sen
 * pelin Miller-lautaan ja pakkaa JPEGiksi. Ulos tulee YKSI kuva, joka
 * peittää laudan kokonaan ja kiertää saumattomasti ympäri.
 *
 * --- miksi kuva eikä monikulmioita ---
 *
 * Muut linssit ovat vektoreita, koska niiden aineisto on rajoja:
 * korkeusvyöhyke joko on tai ei ole yli 1000 metriä. Kaupunkien valot
 * eivät ole rajoja vaan jatkuva kenttä, jossa kirkkaus vaihtelee
 * viereisten pikselien välillä satakertaisesti. Sen piirtäminen
 * ääriviivoiksi vaatisi kynnyksen, ja kynnys on keksitty luku: se
 * päättäisi puolestamme, missä kohtaa Kairo "loppuu". Kuvana aineisto
 * kertoo itse mitä mittasi.
 *
 * Siksi tämä on ainoa linssi, joka menee assets-kansioon eikä
 * js/packs-kansioon. js/packs/linssi-yokartta.js kertoo kuvan polun,
 * rajat laudan koordinaatteina ja lähteen.
 *
 * --- miksi projektio ajetaan tässä eikä selaimessa ---
 *
 * Lauta on Millerin lieriöprojektiossa (tools/vanha-maailma.mjs) ja
 * lähdekuva tasakulmaisessa. Ne eivät ole sama asia: Millerissä
 * pystymittakaava kasvaa navoille päin kertoimella 1/cos(0,8·leveys),
 * eli 76. leveysasteella yli kaksinkertaiseksi. Tasakulmainen kuva
 * suoraan laudan päälle venytettynä siirtäisi Skandinavian valot
 * satoja kilometrejä väärään paikkaan.
 *
 * Selain ei osaa venyttää kuvaa epälineaarisesti ilman WebGL:ää, ja
 * lauta on joka tapauksessa kiinteä. Siksi muunnos tehdään kerran
 * täällä ja peli saa valmiin kuvan.
 *
 * --- miksi laatikkosuodatus ---
 *
 * Lähde on 13500 pikseliä leveä ja kohde 2400: joka suuntaan pienennetään
 * yli viisinkertaisesti. Jos jokainen kohdepikseli poimittaisiin yhdestä
 * lähdepikselistä, pienet kaupungit joko katoaisivat tai kaksinkertaistuisivat
 * sen mukaan, osuuko poiminta sattumalta valon kohdalle. Siksi jokainen
 * kohdepikseli on sen PEITTÄMÄN lähdealueen keskiarvo — myös pystysuunnassa,
 * jossa alueen korkeus vaihtelee Millerin venytyksen mukana.
 *
 * Verkko: Noden fetch ei lue HTTPS_PROXYa ilman NODE_USE_ENV_PROXY=1,
 * ks. tools/hae-radiot.mjs. Skripti käynnistää itsensä uudelleen, jos
 * muuttuja puuttuu.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { sovitaMaailma, miller } from './vanha-maailma.mjs';

if (!process.env.NODE_USE_ENV_PROXY && (process.env.HTTPS_PROXY || process.env.https_proxy)) {
  const ajo = spawnSync(process.execPath, [fileURLToPath(import.meta.url), ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1', NODE_NO_WARNINGS: '1' },
  });
  process.exit(ajo.status ?? 1);
}

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
// Lähdekuva on kahdeksan megatavua eikä kuulu repoon. YOKUVA_VALIMUISTI
// osoittaa muualle, jos sen haluaa säilyttää ajojen välillä.
const VALIMUISTI = process.env.YOKUVA_VALIMUISTI || join(tmpdir(), 'matkakirja-yokartta');
const KOHDE = join(JUURI, 'assets', 'linssit', 'yokartta.jpg');
const PAKETTI = join(JUURI, 'js', 'packs', 'linssi-yokartta.js');

// --- lähde ------------------------------------------------------------------
//
// Visible Earthin tietue 144898 "Earth at Night (Black Marble) 2016 Color
// Maps". Tarjolla on kolme tarkkuutta; 3 km riittää yli kolminkertaisesti
// kohteen 12 km:n pikseliin, joten 750 metrin versiota (54000 x 27000,
// satoja megatavuja) ei tarvitse hakea.

const LAHDE = {
  osoite: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144898/BlackMarble_2016_3km.jpg',
  tietue: 'https://visibleearth.nasa.gov/images/144898/earth-at-night-black-marble-2016-color-maps',
  // Tiedot vahvistettu NASAn visualisointistudion tietueesta, joka toimii
  // yhä. Visible Earthin oma sivu ohjaa nykyään (tarkistettu 3.8.2026)
  // NASAn uudistetulle sivustolle eikä näytä tietuetta — kuvatiedosto
  // sen sijaan on paikallaan eoimagesissa, joten se on pysyvä osoite.
  studio: 'https://svs.gsfc.nasa.gov/30876/',
  aineisto: 'NASA Earth Observatory / Visible Earth: Earth at Night '
    + '(Black Marble) 2016, värikartta 3 km (13500 x 6750, tasakulmainen)',
  mittari: 'Suomi NPP -satelliitin VIIRS, day–night band; vuoden 2016 '
    + 'pilvettömien öiden koonti',
  tekijat: 'NASA Goddard Space Flight Center. Tutkija Miguel Román '
    + '(NASA/GSFC), kuvankäsittely Joshua Stevens (SSAI); julkaistu 25.4.2017.',
};

// --- laudan sovitus ----------------------------------------------------------
//
// Nämä neljä lukua ovat samat kuin maailmankartalla (js/packs/maailmankartta.js
// ja tools/tee-maasto.mjs). Jos lauta joskus piirretään toisin, tämä ajetaan
// uudelleen — lähdekuvaa ei tarvitse hakea enää koskaan, sillä se on
// välimuistissa.

const LAUTA = { leveys: 12000, lon0: -175, etela: -58, pohjoinen: 76 };

const argv = process.argv.slice(2);
const kuiva = argv.includes('--kuiva');
const arvo = (lippu, oletus) => {
  const i = argv.indexOf(lippu);
  return i >= 0 ? Number(argv[i + 1]) : oletus;
};

const LEVEYS_PX = arvo('--leveys', 2400);
const KATTO_KT = arvo('--katto', 600);

/*
 * Näytepisteet, joilla lähdekuvan sijoittelu tarkistetaan ENNEN muunnosta.
 *
 * Tasakulmaisen kuvan reunoja ei ole kirjoitettu tiedostoon mihinkään:
 * oletus "vasen reuna on -180°, ylin rivi +90°" on juuri se, joka menee
 * hiljaa väärin, jos NASA joskus julkaisee kuvan toisin rajattuna. Silloin
 * koko kartta olisi siirroksissa eikä sitä huomaisi mistään — valot
 * näyttäisivät yhä valoilta. Kirkkaat kaupungit ja tyhjät valtameret
 * paljastavat siirron heti.
 */
const KOETIN = [
  { nimi: 'Kairo', lon: 31.24, lat: 30.04, odotus: 'valoisa' },
  { nimi: 'Tokio', lon: 139.69, lat: 35.69, odotus: 'valoisa' },
  { nimi: 'Lontoo', lon: -0.13, lat: 51.51, odotus: 'valoisa' },
  { nimi: 'Los Angeles', lon: -118.24, lat: 34.05, odotus: 'valoisa' },
  { nimi: 'São Paulo', lon: -46.63, lat: -23.55, odotus: 'valoisa' },
  { nimi: 'Tyynenmeren keskiosa', lon: -140, lat: 0, odotus: 'pimeä' },
  { nimi: 'Pohjois-Atlantti', lon: -30, lat: 30, odotus: 'pimeä' },
  { nimi: 'Eteläinen valtameri', lon: 80, lat: -40, odotus: 'pimeä' },
];

// --- lähdekuvan nouto --------------------------------------------------------

async function noudaLahde() {
  mkdirSync(VALIMUISTI, { recursive: true });
  const polku = join(VALIMUISTI, LAHDE.osoite.split('/').pop());
  if (existsSync(polku) && statSync(polku).size > 1e6) {
    console.log(`lähde välimuistista: ${polku} (${Math.round(statSync(polku).size / 1024)} kt)`);
    return polku;
  }
  console.log(`haetaan ${LAHDE.osoite}`);
  const vastaus = await fetch(LAHDE.osoite);
  if (!vastaus.ok) throw new Error(`nouto epäonnistui: HTTP ${vastaus.status}`);
  const tavut = Buffer.from(await vastaus.arrayBuffer());
  if (tavut.length < 1e6) throw new Error(`vastaus liian pieni (${tavut.length} tavua) — onko osoite muuttunut?`);
  writeFileSync(polku, tavut);
  console.log(`  ${Math.round(tavut.length / 1024)} kt -> ${polku}`);
  return polku;
}

// --- kohdepikselien maantiede ------------------------------------------------

/*
 * Kohdekuvan pikselirivien ja -sarakkeiden REUNAT asteina.
 *
 * Reunat eivätkä keskikohdat, koska laatikkosuodatus tarvitsee tietää
 * kunkin pikselin peittämän alueen — ei sen keskipistettä. Reunoja on
 * yksi enemmän kuin pikseleitä.
 *
 * Kuva peittää laudan tarkalleen: sarake 0 alkaa laudan x=0:sta ja
 * viimeinen päättyy x=leveys:iin, rivi 0 laudan y=0:sta ja viimeinen
 * y=korkeus:een. Pyöristetty pikselimäärä ei siis siirrä kuvaa, vaan
 * korkeintaan venyttää sitä promillen verran.
 */
function reunatAsteina(sovitus, leveysPx, korkeusPx) {
  const RAD = Math.PI / 180;
  const yPohjoinen = miller.eteen(0, LAUTA.pohjoinen)[1];
  // sovitaMaailma antaa vain eteenpäin menevän kaavan; nämä ovat sen
  // käänteiset. miller.taakse on saman tiedoston vienti, joten kaava
  // pysyy yhtenä eikä sitä kirjoiteta tänne uudelleen.
  const lon = (lautaX) => LAUTA.lon0 + (lautaX / sovitus.skaala) / RAD;
  const lat = (lautaY) => miller.taakse(0, yPohjoinen + lautaY / sovitus.skaala)[1];

  const lonReunat = [];
  for (let i = 0; i <= leveysPx; i++) lonReunat.push(lon((i * sovitus.leveys) / leveysPx));
  const latReunat = [];
  for (let j = 0; j <= korkeusPx; j++) latReunat.push(lat((j * sovitus.korkeus) / korkeusPx));
  return { lonReunat, latReunat };
}

// --- kuvankäsittely ----------------------------------------------------------
//
// Node ei osaa purkaa JPEGiä eikä peliin saa lisätä riippuvuuksia, joten
// pikselit käsitellään Pythonin Pillow'lla ja NumPylla. Työkalu saa käyttää
// mitä tahansa koneelta löytyvää; peli itse ei näe tästä mitään.
//
// Skripti kirjoitetaan tiedostoon eikä anneta python3 -c:lle: -c:n
// argumentti puretaan käyttöjärjestelmän merkistöllä, joten ä ja ö
// hajoaisivat koneella, jolla LANG on C. Tiedoston Python lukee aina
// UTF-8:na.

const PYTHON = `
import io, json, sys
import numpy as np
from PIL import Image

ohje = json.load(sys.stdin)

# Lähde on 91 megapikseliä. Pillow'n oma pommisuoja on tätä isompi, mutta
# raja nostetaan varmuuden vuoksi: tarkempi lähde kaatuisi muuten tähän.
Image.MAX_IMAGE_PIXELS = None
kuva = Image.open(ohje['lahde']).convert('RGB')
lahdeLeveys, lahdeKorkeus = kuva.size
pikselit = np.asarray(kuva)


def laatikkokeskiarvo(taulukko, reunat):
    """
    Pienentää taulukon akselilla 0 laatikkosuodattaen.

    reunat on N+1 murtolukua lähteen riveinä. Rivi i on lähderivien
    keskiarvo väliltä [reunat[i], reunat[i+1]) niin, että osittain
    peittyvät reunarivit saavat murto-osapainon. Näin jokainen lähdepikseli
    vaikuttaa tasan kerran eikä yksikään kaupunki katoa poiminnan väliin.

    Reunat saavat mennä taulukon yli: silloin kierretään ympäri. Sitä
    tarvitaan vaakasuunnassa, koska lauta alkaa -175 asteesta ja jatkuu
    päivämäärärajan yli.
    """
    n = taulukko.shape[0]
    ulos = np.empty((len(reunat) - 1,) + taulukko.shape[1:], dtype=np.float32)
    for i in range(len(reunat) - 1):
        alku = reunat[i]
        loppu = reunat[i + 1]
        eka = int(np.floor(alku))
        vika = max(int(np.ceil(loppu)), eka + 1)
        paino = np.ones(vika - eka, dtype=np.float32)
        # Osittain peittyvät päät pois. Jos väli mahtuu yhden pikselin
        # sisään, molemmat vähennykset osuvat samaan painoon ja jäljelle
        # jää tasan (loppu - alku) — juuri niin kuin pitääkin.
        paino[0] -= alku - eka
        paino[-1] -= vika - loppu
        pala = taulukko[np.arange(eka, vika) % n].astype(np.float32)
        ulos[i] = np.tensordot(paino, pala, axes=(0, 0)) / paino.sum()
    return ulos


def sarake(lon):
    """Pituusaste lähdekuvan sarakkeeksi. Vasen reuna on -180 astetta."""
    return (lon + 180.0) / 360.0 * lahdeLeveys


def rivi(lat):
    """Leveysaste lähdekuvan riviksi. Ylin rivi on +90 astetta."""
    return (90.0 - lat) / 180.0 * lahdeKorkeus


# Tarkistus ennen muunnosta: osuuko oletettu rajaus kohdalleen?
koetin = {}
for k in ohje['koetin']:
    x = int(sarake(k['lon']))
    y = int(rivi(k['lat']))
    r = max(2, lahdeLeveys // 1200)
    koetin[k['nimi']] = float(pikselit[y - r:y + r, x - r:x + r].mean())

# Pysty ensin: se pienentää taulukon 6750 rivistä runsaaseen tuhanteen,
# jolloin vaakavaihe käsittelee kuudesosan datasta.
riviReunat = [rivi(a) for a in ohje['latReunat']]
valissa = laatikkokeskiarvo(pikselit, riviReunat)

# Vaaka: sama suodatin käännetylle taulukolle. Sarakereunat lasketaan
# vakioaskeleesta eikä kierretyistä asteista, koska kierto katkaisisi
# kasvavan jonon keskeltä — juuri se ylivuoto on sauman tarkoitus.
sarakeReunat = [sarake(ohje['lonReunat'][0]) + i * (ohje['lonAskel'] / 360.0) * lahdeLeveys
                for i in range(len(ohje['lonReunat']))]
valissa = np.ascontiguousarray(np.swapaxes(valissa, 0, 1))
tulos = np.swapaxes(laatikkokeskiarvo(valissa, sarakeReunat), 0, 1)

valmis = Image.fromarray(np.clip(np.rint(tulos), 0, 255).astype(np.uint8), 'RGB')

# Laatu haarukoidaan: otetaan paras, joka mahtuu kattoon. Kiinteä luku
# vanhenisi heti, jos kuvan leveys tai lähde vaihtuu.
#
# subsampling=0 eli täysi väritarkkuus. JPEGin tavallinen 4:2:0 puolittaa
# värikanavien tarkkuuden, ja tässä kuvassa väri on aineistoa eikä
# koristetta: kaasusoihdut palavat oranssina, natriumvalaistut vanhat
# kaupungit kellertävinä ja LEDeille vaihtaneet sinivalkoisina.
# Puolitettuna yksittäisen kaupungin väri valuisi naapurin yli.
paras = None
for laatu in ohje['laadut']:
    puskuri = io.BytesIO()
    valmis.save(puskuri, format='JPEG', quality=laatu, optimize=True,
                progressive=True, subsampling=0)
    tavut = puskuri.getvalue()
    if len(tavut) <= ohje['kattoTavua']:
        paras = (laatu, tavut)
        break

if paras is None:
    sys.exit('katto ei täyty edes huonoimmalla laadulla')

if not ohje['kuiva']:
    with open(ohje['kohde'], 'wb') as t:
        t.write(paras[1])

print(json.dumps({
    'leveys': valmis.size[0],
    'korkeus': valmis.size[1],
    'laatu': paras[0],
    'tavua': len(paras[1]),
    'lahdeLeveys': lahdeLeveys,
    'lahdeKorkeus': lahdeKorkeus,
    'koetin': koetin,
}))
`;

// --- ajo ---------------------------------------------------------------------

const sovitus = sovitaMaailma(LAUTA);
const korkeusPx = Math.round((sovitus.korkeus * LEVEYS_PX) / sovitus.leveys);
const { lonReunat, latReunat } = reunatAsteina(sovitus, LEVEYS_PX, korkeusPx);

console.log(`lauta: ${sovitus.leveys} x ${sovitus.korkeus} yksikköä, `
  + `nollakohta ${LAUTA.lon0}°, ${LAUTA.etela}…${LAUTA.pohjoinen}° leveyttä`);
console.log(`kohde: ${LEVEYS_PX} x ${korkeusPx} px `
  + `(${(sovitus.leveys / LEVEYS_PX).toFixed(1)} lautayksikköä eli `
  + `noin ${Math.round((40075 / LEVEYS_PX))} km päiväntasaajalla per pikseli)`);

const lahdePolku = await noudaLahde();
mkdirSync(dirname(KOHDE), { recursive: true });

const skriptiPolku = join(VALIMUISTI, 'muunna-yokartta.py');
writeFileSync(skriptiPolku, PYTHON, 'utf8');

const ajo = spawnSync('python3', [skriptiPolku], {
  input: JSON.stringify({
    lahde: lahdePolku,
    kohde: KOHDE,
    kuiva,
    lonReunat,
    latReunat,
    // Vaaka-askel on vakio, joten sarakereunat lasketaan siitä eikä
    // kierretyistä asteista: kierto katkaisisi kasvavan jonon keskeltä.
    lonAskel: 360 / LEVEYS_PX,
    koetin: KOETIN,
    laadut: [95, 92, 88, 84, 80, 74, 68, 62, 56, 50, 44, 38],
    kattoTavua: KATTO_KT * 1024,
  }),
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});

if (ajo.status !== 0) {
  console.error(ajo.stderr || ajo.stdout);
  throw new Error('kuvankäsittely epäonnistui — onko python3 + Pillow + NumPy asennettu?');
}

const tulos = JSON.parse(ajo.stdout.trim().split('\n').pop());

console.log(`lähde: ${tulos.lahdeLeveys} x ${tulos.lahdeKorkeus} px tasakulmaisena`);
console.log('sijoittelun tarkistus:');
let virheita = 0;
for (const k of KOETIN) {
  const kirkkaus = tulos.koetin[k.nimi];
  // Valtameri on yökuvassa lähes musta ja suurkaupunki lähes valkoinen;
  // 60 on niiden välissä niin väljästi, ettei raja ole hienosäätöä.
  const osui = k.odotus === 'valoisa' ? kirkkaus > 60 : kirkkaus < 60;
  if (!osui) virheita++;
  console.log(`  ${osui ? 'ok  ' : 'VIKA'} ${k.nimi.padEnd(22)} ${kirkkaus.toFixed(1).padStart(6)} `
    + `(odotus: ${k.odotus})`);
}
if (virheita) {
  throw new Error(`${virheita} näytepistettä osui väärin — lähdekuvan rajaus ei ole `
    + 'oletettu -180…180° / 90…-90°. Kuvaa EI kirjoitettu.');
}

console.log(`kuva: ${tulos.leveys} x ${tulos.korkeus} px, JPEG-laatu ${tulos.laatu}, `
  + `${(tulos.tavua / 1024).toFixed(0)} kt (katto ${KATTO_KT} kt)`);

if (kuiva) {
  console.log('kuiva ajo — mitään ei kirjoitettu');
  process.exit(0);
}

// --- pakettitiedosto ---------------------------------------------------------

const HAKUPAIVA = new Date().toISOString().slice(0, 10);
const suhteellinen = 'assets/linssit/yokartta.jpg';

/*
 * JS-merkkijono heittomerkeillä, talon tyyliin. JSON.stringify käyttäisi
 * lainausmerkkejä, jolloin kirjoitettu tiedosto erottuisi käsin
 * kirjoitetuista paketeista ilman mitään syytä.
 */
const jono = (teksti) => {
  if (/['\\\n]/.test(teksti)) throw new Error(`lainaus vaatisi pakomerkin: ${teksti}`);
  return `'${teksti}'`;
};

/**
 * Rivittää pitkän tekstin otsikkokommentin sarkaimeen. `sisennys` on
 * otsikkorivin alun pituus ("// Aineisto: " on 13), jotta jatkorivit
 * asettuvat sen alle eivätkä ala kesken sanan.
 */
const rivita = (teksti, sisennys = 13) => {
  const rivit = [];
  let rivi = '';
  for (const sana of teksti.split(' ')) {
    if (rivi && (sisennys + rivi.length + 1 + sana.length) > 78) { rivit.push(rivi); rivi = sana; }
    else rivi = rivi ? `${rivi} ${sana}` : sana;
  }
  rivit.push(rivi);
  return rivit.join(`\n//${' '.repeat(sisennys - 2)}`);
};

const paketti = `// Yön kartta: maailma valoissa. Kuvan polku ja sen paikka laudalla.
//
// TÄMÄ TIEDOSTO ON KONEEN KIRJOITTAMA. Älä muokkaa käsin:
//   node tools/hae-yonkartta.mjs
//
// Aineisto: ${rivita(LAHDE.aineisto)}
// Mittari:  ${rivita(LAHDE.mittari)}
// Viite:    ${rivita(LAHDE.tekijat)}
// Haettu:   ${HAKUPAIVA} osoitteesta
//           ${LAHDE.osoite}
//           Tietue ${LAHDE.tietue}
//           ohjaa nykyään NASAn uudistetulle sivustolle; tekijätiedot on
//           vahvistettu osoitteesta ${LAHDE.studio}
// Lisenssi: Public domain — NASAn kuva-aineisto ei ole Yhdysvalloissa
//           tekijänoikeuden alaista ("NASA content ... generally are not
//           subject to copyright in the United States"). Ehtona on
//           lähteen mainitseminen, ei lupaa; ks.
//           https://www.nasa.gov/nasa-brand-center/images-and-media/
//
// TÄSSÄ TIEDOSTOSSA EI OLE KUVAA vaan sen polku. Kuva on binääri ja
// asuu assets-kansiossa: ${suhteellinen} (${(tulos.tavua / 1024).toFixed(0)} kt).
// Yhden tiedoston versio (dist/matkakirja.html) ei siis saa tätä
// linssiä mukaansa — se on tarkoituksellinen raja, sillä kuvan
// upottaminen base64:nä kasvattaisi paketin lähes megatavulla.
//
// --- mihin kuva laudalla osuu ---
//
// Kuva on projisoitu tasakulmaisesta Milleriin samalla sovituksella kuin
// lauta itse (tools/vanha-maailma.mjs, sovitaMaailma). Se peittää laudan
// TARKALLEEN: vasen reuna x=0, oikea x=${sovitus.leveys}, ylin y=0, alin y=${sovitus.korkeus}.
// Piirtäjän ei siis tarvitse laskea asteita lainkaan — kuva venytetään
// suoraan raja-suorakulmioon.
//
// Kartta kiertää ympäri, joten kuva on toistettava laudan molemmin
// puolin samoin kuin rannikot: kuvan oikea reuna jatkuu vasempaan
// saumattomasti, koska molemmat ovat samaa pituusastetta ${LAUTA.lon0}°.
//
// --- mitä kuvassa EI ole ---
//
// Lauta ulottuu ${LAUTA.etela}°:sta ${LAUTA.pohjoinen}°:seen, joten Etelämanner ja pohjoisin
// arktinen alue jäävät kuvan ulkopuolelle. Ne eivät ole kadonneet
// aineistosta vaan laudalta.
//
// --- mitä valot mittaavat ---
//
// VIIRSin day–night band mittaa yöllä ylöspäin karkaavaa näkyvää valoa.
// Se ei ole väkiluku eikä vauraus, vaikka korreloi molempien kanssa:
// kirkkaimmat pisteet maailmassa ovat kaasusoihtuja Persianlahdella,
// Siperiassa ja Pohjois-Dakotassa, missä asuu tuskin ketään. Sama toisin
// päin — tiheään asuttu maaseutu Intiassa ja Nigeriassa näkyy himmeänä,
// koska sähköä on vähän. Kuva kertoo missä poltetaan valoa, ei missä
// asutaan.
//
// Koonti on vuodelta 2016 eikä yhdeltä yöltä: pilvet, kuutamo, revontulet
// ja tulipalot on suodatettu pois monen kuukauden havainnoista.

export const YOKARTTA = {
  kuva: '${suhteellinen}',

  // Kuvan omat mitat pikseleinä. Piirtäjä ei tarvitse näitä venytykseen
  // (raja riittää), mutta esilataus ja mittasuhteen tarkistus tarvitsevat.
  leveysPx: ${tulos.leveys},
  korkeusPx: ${tulos.korkeus},

  // Kuvan paikka laudan koordinaatteina. Peittää laudan kokonaan.
  raja: { x: 0, y: 0, leveys: ${sovitus.leveys}, korkeus: ${sovitus.korkeus} },

  // Kuva jatkuu reunan yli itseensä, kuten lauta.
  kiertava: true,

  // Rajaus asteina — sama kuin laudalla. Tämä on tarkistusta ja
  // kuvatekstejä varten, ei piirtoa.
  rajaus: { lon0: ${LAUTA.lon0}, etela: ${LAUTA.etela}, pohjoinen: ${LAUTA.pohjoinen} },

  otsikko: 'Yön kartta: maailma valoissa',
  kuvaus: 'Maapallon yövalot Suomi NPP -satelliitin VIIRS-mittarin '
    + 'koonnista vuodelta 2016. Kirkkaus on ylöspäin karkaavaa valoa, '
    + 'ei väkilukua: kaasusoihdut loistavat autiomaassa ja tiheään '
    + 'asuttu maaseutu jää himmeäksi.',

  lahde: {
    aineisto: ${jono(LAHDE.aineisto)},
    mittari: ${jono(LAHDE.mittari)},
    tekijat: ${jono(LAHDE.tekijat)},
    osoite: ${jono(LAHDE.osoite)},
    tietue: ${jono(LAHDE.tietue)},
    studio: ${jono(LAHDE.studio)},
    haettu: '${HAKUPAIVA}',
  },

  lisenssi: {
    nimi: 'Public domain (Yhdysvaltain liittovaltion virasto)',
    ehto: 'Lähteen maininta: NASA / Suomi NPP VIIRS.',
    osoite: 'https://www.nasa.gov/nasa-brand-center/images-and-media/',
  },
};
`;

writeFileSync(PAKETTI, paketti);
console.log(`kirjoitettu ${KOHDE.replace(JUURI + '/', '')}`);
console.log(`kirjoitettu ${PAKETTI.replace(JUURI + '/', '')} (${Math.round(paketti.length / 1024)} kt)`);
