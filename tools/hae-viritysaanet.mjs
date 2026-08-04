// Hakee maailmanradion 'virittaa'-tilaan aitoja vanhan radion
// viritysäänityksiä ja leikkaa niistä lyhyet, silmukoituvat pätkät.
//
// Miksi: radiosoittimen 'virittaa' kestää siitä kun kaupunkia napautetaan
// siihen kunnes suora lähetys alkaa kuulua (enintään 12 s, ks.
// VIRITYKSEN_AIKAKATKAISU_MS js/linssit/radiosoitin.js). Tauko oli
// hiljainen, ja hiljainen tauko näyttää rikkinäiseltä — vastaanotin joka
// ei suhise on vastaanotin joka ei toimi. Omistajan toive 4.8.2026 oli
// useampi eri äänite, jottei sama suhina toistu joka kerta.
//
//   node tools/hae-viritysaanet.mjs            # rakentaa pätkät
//   node tools/hae-viritysaanet.mjs --haku     # ajaa arkistohaun uudestaan
//   node tools/hae-viritysaanet.mjs --kuvat    # + spektrikuvat tarkistusta varten
//
// --haku ei kirjoita mitään. Se listaa ehdokkaat lisensseineen, jotta
// LAHTEET-taulun voi koota uudestaan, jos jokin äänite katoaa arkistosta.
// Ehdokkaan hyväksyminen on ihmisen työtä: lisenssi luetaan ja pätkä
// katsotaan spektrikuvasta ennen kuin se päätyy tähän tauluun.
//
// LISENSSILINJA (sama kuin muualla pelissä, ks. LICENSE):
// kelpaavat public domain, CC0, CC BY, CC BY-SA, CC BY-NC ja CC BY-NC-SA.
// ND-lisenssit EIVÄT kelpaa, koska pätkä on muokattu teos: se leikataan,
// ristihäivytetään ja normalisoidaan.
//
// BBC Sound Effects (RemArc) tarkistettiin ja HYLÄTTIIN. RemArc-lisenssi
// sallii vain henkilökohtaisen, opetus- ja tutkimuskäytön ("Commercial use
// of this content is not allowed under the RemArc license"), kieltää
// aineiston muuttamisen ("Don't mess with our content") ja sen jakamisen
// eteenpäin ("Sharing our content... Sharing links is OK"). Peli jakaa
// tiedostot omalta sivultaan ja leikkaa ne — kumpikin rikkoisi ehtoa.
//
// Freesoundia ei voi käyttää tässä ympäristössä: avain on GitHubin
// secretissä. Kaikki alla oleva tulee arkistosta ilman avainta.

import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { leikkaaMp3 } from './leikkaa-mp3.mjs';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const KOHDE = join(JUURI, 'assets/audio');
const TYOT = join(JUURI, '../viritys-tyo'); // raakapalat repon ulkopuolelle
const AGENTTI = 'Matkakirja/1.0 (https://github.com/ravelius/Matkakirja)';

const KUVAT = process.argv.includes('--kuvat');
const HAKU = process.argv.includes('--haku');

// --- ffmpeg -------------------------------------------------------------------
//
// tools/leikkaa-mp3.mjs katkaisee mp3:n kehysrajalta koodaamatta uudelleen,
// ja sitä käytetään alla raakapalan siistimiseen. Se ei kuitenkaan osaa
// aloituskohtaa keskeltä tiedostoa eikä häivytystä: kumpikin vaatii äänen
// purkamisen näytteiksi. Siihen tarvitaan ffmpeg — mutta vain tässä
// työkalussa. Peliin ei tule riippuvuutta: lopputulos on tavallinen mp3.
function etsiFfmpeg() {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return 'ffmpeg';
  } catch { /* ei polulla — kokeillaan alta */ }
  // Pythonin imageio-ffmpeg tuo mukanaan staattisen ffmpegin (libmp3lame
  // mukana). Se on tässä ympäristössä ainoa saatavilla oleva.
  try {
    return execFileSync('python3',
      ['-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())']).toString().trim();
  } catch { /* ei sitäkään */ }
  throw new Error('ffmpeg puuttuu: asenna ffmpeg tai pip install imageio-ffmpeg');
}
const FFMPEG = etsiFfmpeg();
const ffmpeg = (args) => execFileSync(FFMPEG, ['-y', '-hide_banner', '-v', 'error', ...args],
  { maxBuffer: 5e8 }).toString();

// --- lähteet ------------------------------------------------------------------
//
// Jokainen rivi on tarkistettu käsin: lisenssi luettu archive.orgin
// metadatasta (kenttä licenseurl) ja äänen luonne katsottu spektrikuvasta,
// ettei pätkään jää puhetta tai musiikkia. Se on sekä lisenssi- että
// makuasia: vastaanottimen kohina ei ole kenenkään teos, mutta sen alta
// kuuluva ohjelma on.
//
// alkuTavu/tavuja: arkisto katkoo isot lataukset (nginx palautti 500
// kokonaisesta 75 Mt tiedostosta), ja tavuväli on muutenkin kohteliaampi.
// mp3 tahdistuu itsestään, joten palan saa keskeltä tiedostoa; leikkaaMp3
// etsii palasta ensimmäisen ehjän kehyksen ja korjaa Xing-otsakkeen.
//
// ikkuna: sekunti palan alusta, josta pätkä otetaan. null = työkalu etsii
// tasaisimman kohinajakson itse (ks. parasIkkuna). Käsin valittu ikkuna
// voittaa mittarin, koska mittari ei erota kohinan luonteita toisistaan:
// se kertoo vain, ettei kohta ole puhetta.
//
// HYLÄTYT, jotta samaa ei kokeilla uudestaan:
//  - DxRadioRecording1090KhzDecember10th2010 (CC0, muuten kelvollinen):
//    spektrikuvassa kohinan alta erottuu portaittain hyppivä sävelkulku,
//    eli musiikkia. Kohina ei ole kenenkään teos, mutta sen alta kuuluva
//    ohjelma on — ja tämä äänite on kaukovastaanottoa oldies-asemasta.
//    Muut kohdat samasta äänitteestä ovat pelkkää alle 300 Hz:n jyrinää.
//  - WARFA-häirintänauhat (PDM): kaunista pyyhkäisyvinkunaa, mutta saman
//    lähettäjän muut nauhat on nimetty "music jamming" — häirintä tehdään
//    soittamalla levyjä. Ei oteta riskiä.
//  - FM-kaistapyyhkäisyt (CC0): FM kuulostaa uudelta, ei vanhalta radiolta.
const LAHTEET = [
  {
    nimi: 'viritys-taajuustungos',
    tunnus: 'Crowded13760khz',
    tiedosto: 'crowded 13760.mp3',
    alkuTavu: 0,
    tavuja: 4723200,
    ikkuna: 103,
    kesto: 9,
    kuvaus: 'Ruuhkainen 13760 kHz: leveä kohina ja kaksi paikallaan seisovaa vihellystä',
    tekija: 'samnewton94 (archive.org)',
    lisenssi: 'Public Domain Mark 1.0',
    sivu: 'https://archive.org/details/Crowded13760khz',
  },
  {
    nimi: 'viritys-raskaskohina',
    tunnus: 'radio-angela-heavy-static-edition.-th.-2023-03-24-t-03-18-12-z-5130.0k-hz',
    tiedosto: 'Radio Angela, heavy static edition. Th. 2023-03-24T03_18_12Z_5130.0kHz.mp3',
    alkuTavu: 0,
    tavuja: 4000000,
    ikkuna: 106,
    kesto: 8,
    kuvaus: 'Raskas kohina 5130 kHz:llä, lähetys hukkuu kokonaan alle',
    tekija: 'J. Christie',
    lisenssi: 'CC0 1.0',
    sivu: 'https://archive.org/details/radio-angela-heavy-static-edition.-th.-2023-03-24-t-03-18-12-z-5130.0k-hz',
  },
  {
    nimi: 'viritys-tyhjakaista',
    tunnus: 'tambov-tuning-to-three-ops.-one-pirate-station.-sun.-2025-12-21-t-10-28-16-z-3170.2k-hz',
    tiedosto: 'Tambov, tuning to three ops. One pirate station. Sun. 2025-12-21T10_28_16Z_3170.2kHz.mp3',
    alkuTavu: 0,
    tavuja: 3000000,
    ikkuna: 184,
    kesto: 7,
    kuvaus: 'Tyhjä kohta 100 metrin kaistalla, tasainen hiljainen suhina',
    tekija: 'Strelnikov (archive.org)',
    lisenssi: 'Public Domain Mark 1.0',
    sivu: 'https://archive.org/details/tambov-tuning-to-three-ops.-one-pirate-station.-sun.-2025-12-21-t-10-28-16-z-3170.2k-hz',
  },
  {
    nimi: 'viritys-datasignaali',
    tunnus: 'UnidShortwaveDataVoice7575Khz6208',
    tiedosto: 'UNID_ute-data-voice_7575kHz_June_2-3_2008_0130-0150UTC_64kb.mp3',
    alkuTavu: 0,
    tavuja: 5000000,
    ikkuna: 78,
    kesto: 9,
    kuvaus: 'Tunnistamaton asema 7575 kHz: kohinan seassa naksuva datalähete 2,9 kHz:llä',
    tekija: 'canklecat (archive.org)',
    lisenssi: 'CC Public Domain Dedication',
    sivu: 'https://archive.org/details/UnidShortwaveDataVoice7575Khz6208',
  },
  {
    nimi: 'viritys-asteikonpaa',
    tunnus: 'MediumWaveBandScansPaxtonIllinoisU.s.a.Jan.7th2010',
    tiedosto: '01-07-10MWBandScan530-670KHz.Rec.PaxtonIllinois1746CST.MP3',
    alkuTavu: 0,
    tavuja: 5000000,
    ikkuna: 110,
    kesto: 8,
    kuvaus: 'Keskiaalto-asteikon 530–670 kHz haku, asemien väliin jäävä tumma suhina',
    tekija: 'Curtis Sadowski (The Audio Archivist)',
    lisenssi: 'CC Public Domain Dedication',
    sivu: 'https://archive.org/details/MediumWaveBandScansPaxtonIllinoisU.s.a.Jan.7th2010',
  },
];

// Lisenssit, jotka kelpaavat. ND puuttuu tarkoituksella: pätkä on muokattu.
const SALLITTU = /publicdomain|licenses\/(by|by-sa|by-nc|by-nc-sa)\//;

// --- arkistohaku (--haku) -----------------------------------------------------

const HAUT = [
  '(collection:shortwave-airchecks OR collection:airchecks) AND (title:(tuning OR static OR scan OR crowded OR jamming OR interference OR noise OR heterodyne OR bandscan))',
  'mediatype:audio AND licenseurl:* AND (title:(shortwave AND tuning) OR title:(radio AND static) OR title:(numbers AND station) OR title:(radio AND dial))',
  'creator:"The Audio Archivist" AND mediatype:audio',
];

async function arkistohaku() {
  for (const kysely of HAUT) {
    const url = 'https://archive.org/advancedsearch.php?output=json&rows=60&page=1'
      + '&fl%5B%5D=identifier&fl%5B%5D=title&fl%5B%5D=creator&fl%5B%5D=licenseurl'
      + '&q=' + encodeURIComponent(kysely);
    const vastaus = await fetch(url, { headers: { 'User-Agent': AGENTTI } });
    const data = await vastaus.json();
    console.log(`\n=== ${kysely}\n    osumia ${data.response.numFound}`);
    for (const osuma of data.response.docs) {
      const lisenssi = osuma.licenseurl ?? '';
      // Lisensoimaton osuma jätetään näkyviin merkittynä: arkistossa on
      // hyviä äänitteitä ilman lisenssikenttää, mutta niitä ei saa käyttää
      // ennen kuin oikeudet on selvitetty muualta.
      const merkki = !lisenssi ? '  ?' : (SALLITTU.test(lisenssi) ? ' OK' : '  x');
      console.log(`${merkki} ${osuma.identifier}`);
      console.log(`     ${String(osuma.title).slice(0, 78)}`);
      console.log(`     ${osuma.creator ?? '(tekijä puuttuu)'} | ${lisenssi || '(ei lisenssiä)'}`);
    }
  }
}

// --- lataus -------------------------------------------------------------------

/** Tavuväli arkistosta. curl uudelleenyrityksineen: arkiston solmut heittävät satunnaisia 500:ia. */
function haeVali(lahde) {
  const osoite = `https://archive.org/download/${encodeURIComponent(lahde.tunnus)}`
    + `/${encodeURIComponent(lahde.tiedosto)}`;
  const raaka = join(TYOT, `${lahde.nimi}.raaka`);
  execFileSync('curl', [
    '-sSL', '--fail', '--retry', '6', '--retry-all-errors', '--retry-delay', '3',
    '--max-time', '300', '-A', AGENTTI,
    '-r', `${lahde.alkuTavu}-${lahde.alkuTavu + lahde.tavuja - 1}`,
    '-o', raaka, osoite,
  ]);
  return raaka;
}

/**
 * Tavuvälistä ehjä mp3. leikkaaMp3 etsii ensimmäisen kelvollisen kehyksen
 * (tavuväli alkaa lähes varmasti kesken kehyksen) ja katkaisee lopun
 * kehysrajalle, joten ffmpeg saa eteensä siistin tiedoston.
 */
function siistiPala(lahde, raaka, sekunteja) {
  const pala = join(TYOT, `${lahde.nimi}.pala.mp3`);
  const puskuri = readFileSync(raaka);
  const leikattu = leikkaaMp3(puskuri, sekunteja);
  // null = pala oli jo lyhyempi kuin pyydetty. Silloin kelpaa sellaisenaan;
  // ffmpeg sivuuttaa lopun vajaan kehyksen itse.
  writeFileSync(pala, leikattu ? leikattu.puskuri : puskuri);
  return pala;
}

// --- ikkunan valinta ----------------------------------------------------------

/**
 * Mittaa palan sekunti kerrallaan. Spektrin entropia ja tasaisuus erottavat
 * kohinan puheesta ja musiikista: kohina on leveää ja tasaista, puhe kapeaa
 * ja tavurytmissä vaihtelevaa. RMS kertoo, ettei kohta ole hiljaisuutta.
 */
function mittaaSekunnit(tiedosto) {
  const ulos = ffmpeg(['-i', tiedosto, '-af',
    'aformat=channel_layouts=mono,aresample=22050,'
    + 'aspectralstats=win_size=2048:measure=entropy+flatness,'
    + 'astats=metadata=1:reset=1:measure_perchannel=RMS_level:measure_overall=none,'
    + 'ametadata=mode=print:file=-',
    '-f', 'null', '-']);

  const korit = new Map();
  let hetki = null;
  for (const rivi of ulos.split('\n')) {
    const aika = rivi.match(/^frame:\d+\s+pts:\d+\s+pts_time:([\d.]+)/);
    if (aika) {
      const s = Math.floor(Number(aika[1]));
      if (!korit.has(s)) korit.set(s, { entropia: [], tasaisuus: [], rms: [] });
      hetki = korit.get(s);
      continue;
    }
    if (!hetki) continue;
    const spektri = rivi.match(/^lavfi\.aspectralstats\.1\.(entropy|flatness)=(-?[\d.]+)/);
    if (spektri) {
      hetki[spektri[1] === 'entropy' ? 'entropia' : 'tasaisuus'].push(Number(spektri[2]));
      continue;
    }
    const taso = rivi.match(/^lavfi\.astats\.1\.RMS_level=(-?[\d.]+)/);
    if (taso) hetki.rms.push(Number(taso[1]));
  }
  const ka = (lista) => lista.reduce((a, b) => a + b, 0) / (lista.length || 1);
  return [...korit.keys()].sort((a, b) => a - b).map((s) => ({
    s, entropia: ka(korit.get(s).entropia), tasaisuus: ka(korit.get(s).tasaisuus), rms: ka(korit.get(s).rms),
  }));
}

/** Tasaisimman kohinajakson aloitussekunti. */
function parasIkkuna(sekunnit, pituus) {
  const ka = (lista) => lista.reduce((a, b) => a + b, 0) / (lista.length || 1);
  let paras = null;
  for (let i = 0; i + pituus <= sekunnit.length; i += 1) {
    const w = sekunnit.slice(i, i + pituus);
    const e = ka(w.map((x) => x.entropia));
    const t = ka(w.map((x) => x.tasaisuus));
    const r = ka(w.map((x) => x.rms));
    const eHajonta = Math.sqrt(ka(w.map((x) => (x.entropia - e) ** 2)));
    const rHajonta = Math.sqrt(ka(w.map((x) => (x.rms - r) ** 2)));
    // Vaihtelu vähentää pisteitä: puheen entropia heiluu tavujen tahdissa,
    // ja voimakkuuden heilahtelu tarkoittaa yleensä alkavaa ohjelmaa.
    const pisteet = e + t * 4 - eHajonta * 3 - rHajonta * 0.25;
    if (!paras || pisteet > paras.pisteet) paras = { alku: w[0].s, pisteet, e, t, r };
  }
  return paras;
}

// --- leikkaus -----------------------------------------------------------------

const RISTI = 0.75; // ristihäivytyksen pituus sekunteina
const REUNA = 0.01; // 10 ms reunahäivytys

/**
 * Suodinketju, joka leikkaa pätkän ja tekee siitä silmukoituvan.
 *
 * Peli on naksahdellut silmukan saumassa ennenkin (js/muutokset.js v176 ja
 * v215), joten sauma hoidetaan tässä eikä soittimessa. Pelkkä häivytys
 * nollaan ei riitä: silmukassa se kuuluisi kohinan keskellä notkahduksena.
 *
 * Siksi lähteestä otetaan kesto + RISTI sekuntia. Runko on väli
 * [alku, alku+kesto) ja häntä sen jatke [alku+kesto, alku+kesto+RISTI).
 * Häntä häivytetään pois, runko sisään, ja ne summataan päällekkäin.
 * Tulos on täsmälleen `kesto` pitkä ja jatkuu saumatta: kohdassa 0 kuuluu
 * lähteen hetki alku+kesto, joka on juuri se hetki, johon tiedoston loppu
 * päättyi. Kohdassa RISTI häntä on vaiennut ja runko soi sellaisenaan.
 *
 * curve=qsin on tässä olennainen. Lineaarinen häivytys summaisi kaksi
 * toisistaan riippumatonta kohinaa niin, että teho putoaa keskellä 3 dB —
 * se kuuluisi silmukassa aaltoiluna. Neljännessinillä sin²+cos² = 1, eli
 * teho pysyy vakiona.
 *
 * amix=normalize=0 on yhtä olennainen: oletuksena amix jakaa summan
 * tulojen määrällä, jolloin ristihäivytyksen kohta hiljenisi puoleen.
 *
 * Päälle vielä 10 ms reunahäivytys. Se ei kuulu silmukassa, mutta estää
 * naksahduksen, jos soitin soittaa pätkän kerran eikä lähde nollasta.
 */
function silmukkaSuodin(alku, kesto, desibelia) {
  const paa = alku + kesto; // hännän alkukohta lähteessä
  return [
    `[0:a]atrim=start=${alku}:end=${paa},asetpts=N/SR/TB,`
      + `afade=t=in:curve=qsin:st=0:d=${RISTI}[runko]`,
    `[0:a]atrim=start=${paa}:end=${paa + RISTI},asetpts=N/SR/TB,`
      + `afade=t=out:curve=qsin:st=0:d=${RISTI},apad=whole_dur=${kesto}[hanta]`,
    '[runko][hanta]amix=inputs=2:normalize=0:duration=first[yhdessa]',
    `[yhdessa]volume=${desibelia.toFixed(2)}dB,`
      + `afade=t=in:curve=qsin:st=0:d=${REUNA},`
      + `afade=t=out:curve=qsin:st=${(kesto - REUNA).toFixed(3)}:d=${REUNA},`
      + 'aformat=channel_layouts=mono,aresample=22050[ulos]',
  ].join(';');
}

function leikkaaPatka(pala, alku, kesto, ulos, desibelia) {
  ffmpeg(['-i', pala, '-filter_complex', silmukkaSuodin(alku, kesto, desibelia),
    '-map', '[ulos]',
    '-c:a', 'libmp3lame', '-b:a', '56k', '-write_xing', '1',
    // Metatiedot pois: id3-kentät veisivät turhaa tilaa offline-korissa.
    '-map_metadata', '-1', ulos]);
}

/**
 * Valmiin pätkän keskimääräinen RMS. Mitataan täsmälleen samasta
 * suodinketjusta, joka lopullisen tiedoston tekee — ei erikseen leikatusta
 * palasta. Ensimmäinen yritys mittasi `-ss`-haulla, ja tulos heitti 2,7 dB:
 * VBR-mp3:sta haku osuu likimain, atrim tarkalleen.
 *
 * Arvo luetaan ametadatan kautta eikä astatsin lokitulosteesta: loki menee
 * virhevirtaan ja katoaisi -v error -asetuksella. Viimeinen kehys kantaa
 * koko jakson kertymän.
 */
function rmsTaso(pala, alku, kesto) {
  const ulos = ffmpeg(['-i', pala, '-filter_complex',
    `${silmukkaSuodin(alku, kesto, 0)};[ulos]`
    + 'astats=metadata=1:measure_perchannel=none:measure_overall=RMS_level,'
    + 'ametadata=mode=print:key=lavfi.astats.Overall.RMS_level:file=-[mitattu]',
    '-map', '[mitattu]', '-f', 'null', '-']);
  const osumat = [...ulos.matchAll(/RMS_level=(-?[\d.]+)/g)];
  return osumat.length ? Number(osumat[osumat.length - 1][1]) : null;
}

// Hiljainen tausta: viritys ei saa jyrätä käyttöliittymän tehosteita.
// Sama taso kaikille, jotta arvonta ei kuulu voimakkuuden hyppäyksenä.
const TAVOITE_RMS = -20;

// --- lisenssin tarkistus ------------------------------------------------------

/**
 * Lisenssiä ei oleteta vaan luetaan arkistosta joka ajolla. Kohteen lisenssi
 * voi muuttua tai kohde kadota; kumpikin on parempi huomata täällä kuin
 * pelin julkaisun jälkeen. Palauttaa arkiston licenseurl-kentän.
 */
async function tarkistaLisenssi(lahde) {
  const vastaus = await fetch(`https://archive.org/metadata/${lahde.tunnus}`,
    { headers: { 'User-Agent': AGENTTI } });
  const data = await vastaus.json();
  const osoite = data.metadata?.licenseurl ?? '';
  if (!osoite) throw new Error(`${lahde.tunnus}: arkistossa ei ole lisenssiä — ei käytetä`);
  if (!SALLITTU.test(osoite)) throw new Error(`${lahde.tunnus}: lisenssi ${osoite} ei kelpaa`);
  const loytyi = (data.files ?? []).some((t) => t.name === lahde.tiedosto);
  if (!loytyi) throw new Error(`${lahde.tunnus}: tiedostoa ${lahde.tiedosto} ei ole enää`);
  return osoite;
}

// --- ajo ----------------------------------------------------------------------

if (HAKU) {
  await arkistohaku();
  process.exit(0);
}

mkdirSync(TYOT, { recursive: true });
mkdirSync(KOHDE, { recursive: true });

const raportti = [];
for (const lahde of LAHTEET) {
  console.log(`\n--- ${lahde.nimi}`);
  const lisenssiOsoite = await tarkistaLisenssi(lahde);
  console.log(`    ${lahde.tekija} | ${lahde.lisenssi} | ${lisenssiOsoite}`);

  const raaka = haeVali(lahde);
  console.log(`    ladattu ${statSync(raaka).size} tavua`);

  // Palasta otetaan reilusti ikkunan yli, jotta hännälle jää tilaa.
  const palanPituus = Math.max(200, (lahde.ikkuna ?? 0) + lahde.kesto + RISTI + 10);
  const pala = siistiPala(lahde, raaka, palanPituus);

  let alku = lahde.ikkuna;
  if (alku === null || alku === undefined) {
    const paras = parasIkkuna(mittaaSekunnit(pala), lahde.kesto + 1);
    alku = paras.alku;
    console.log(`    työkalu valitsi ikkunan ${alku} s (pisteet ${paras.pisteet.toFixed(3)})`);
  }

  const taso = rmsTaso(pala, alku, lahde.kesto);
  const vahvistus = taso === null ? 0 : TAVOITE_RMS - taso;
  const ulos = join(KOHDE, `${lahde.nimi}.mp3`);
  leikkaaPatka(pala, alku, lahde.kesto, ulos, vahvistus);

  if (KUVAT) {
    ffmpeg(['-i', ulos, '-lavfi',
      'showspectrumpic=s=900x200:legend=0:scale=log', join(TYOT, `${lahde.nimi}.png`)]);
  }

  const koko = statSync(ulos).size;
  raportti.push({ ...lahde, koko, alku, vahvistus, taso, lisenssiOsoite });
  console.log(`    ${ulos.replace(JUURI + '/', '')}  ${lahde.kesto} s  ${koko} tavua`
    + `  (lähde ${alku}–${alku + lahde.kesto} s, vahvistus ${vahvistus.toFixed(1)} dB)`);
}

const yhteensa = raportti.reduce((s, r) => s + r.koko, 0);
console.log(`\nyhteensä ${raportti.length} tiedostoa, ${yhteensa} tavua `
  + `(${(yhteensa / 1024).toFixed(1)} kt)`);
// Offline-kori ladataan kerralla, joten koko on oikeasti rajoite eikä toive.
if (yhteensa > 400 * 1024) console.log('VAROITUS: yli 400 kt — lyhennä pätkiä tai laske bittinopeutta');

console.log('\nRivit js/packs/viritysaanet.js:ään:');
for (const r of raportti) {
  console.log(`  { tiedosto: '${r.nimi}.mp3', kesto: ${r.kesto},`);
  console.log(`    kuvaus: '${r.kuvaus}',`);
  console.log(`    lahde: '${r.sivu}',`);
  console.log(`    lisenssi: '${r.lisenssi}', tekija: '${r.tekija}' },`);
}
