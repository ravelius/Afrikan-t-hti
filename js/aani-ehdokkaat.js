// Äänivaihtoehdot: jokaiselle Afrikan kaupungille, tehosteelle ja
// musiikille ehdokkaita Freesoundista (vain CC-lisenssit, osoitteet
// varmistettu). Paras valitaan /aanet.html-sivulla; valinta tallentuu
// selaimeen ja peli käyttää sitä oletuksen sijaan heti seuraavasta
// latauksesta. Kun omistaja on valinnut, voittajat kovakoodataan
// oletuksiksi kaikille.
//
// Kaupungit saavat ehdokkaansa äänimaisematyypin mukaan; osalla on
// lisäksi juuri siitä paikasta tehtyjä äänityksiä. `oletus: null`
// tarkoittaa, että ilman valintaa soi syntetisoitu ambienssi.

import { AFRICA } from './packs/africa.js';

const AVAIN = 'matkakirja-aanivalinnat';

// Paikkakohtaiset äänitykset — juuri tästä kaupungista tai alueelta.
const KAUPUNKIKOHTAISET = {
  kairo: [
    { url: 'https://cdn.freesound.org/previews/723/723081_2978883-lq.mp3', nimi: 'Kairon yöhälinä — rucisko, CC BY-NC' },
    { url: 'https://cdn.freesound.org/previews/511/511005_571436-lq.mp3', nimi: 'Khan el-Khalilin basaari — 3bagbrew, CC0' },
    { url: 'https://cdn.freesound.org/previews/683/683118_8105512-lq.mp3', nimi: 'Attaban katukauppiaat — AhmadAiuby, CC0' },
  ],
  sahara: [
    { url: 'https://cdn.freesound.org/previews/146/146745_832093-lq.mp3', nimi: 'Saharan tuuli soittaa lotaria — omestreandre, CC BY' },
  ],
  dakar: [
    { url: 'https://cdn.freesound.org/previews/677/677253_9756914-lq.mp3', nimi: 'Ouakamin piha illalla — LaureC, CC0' },
    { url: 'https://cdn.freesound.org/previews/677/677252_9756914-lq.mp3', nimi: 'Ouakamin piha aamulla — LaureC, CC0' },
  ],
};

// Tyyppiehdokkaat: käyvät kaikille saman maiseman kaupungeille.
const TYYPPI_EHDOKKAAT = {
  basaari: [
    { url: 'https://cdn.freesound.org/previews/511/511005_571436-lq.mp3', nimi: 'Basaarin hälinä (Khan el-Khalili) — 3bagbrew, CC0' },
    { url: 'https://cdn.freesound.org/previews/683/683118_8105512-lq.mp3', nimi: 'Katukauppiaat (Kairo) — AhmadAiuby, CC0' },
    { url: 'https://cdn.freesound.org/previews/723/723081_2978883-lq.mp3', nimi: 'Kaupungin yö (Kairo) — rucisko, CC BY-NC' },
  ],
  aavikko: [
    { url: 'https://cdn.freesound.org/previews/146/146745_832093-lq.mp3', nimi: 'Aavikkotuuli soittaa lotaria — omestreandre, CC BY' },
    { url: 'https://cdn.freesound.org/previews/714/714271_14696146-lq.mp3', nimi: 'Aavikon äänimaisema — Metris, CC BY' },
    { url: 'https://cdn.freesound.org/previews/182/182868_3409336-lq.mp3', nimi: 'Hiekkainen tuulenvire — FableVision_Studios, CC0' },
    { url: 'https://cdn.freesound.org/previews/411/411774_1910728-lq.mp3', nimi: 'Aavikon yön hiljaisuus — Diegolar, CC BY' },
    { url: 'https://cdn.freesound.org/previews/565/565015_12186594-lq.mp3', nimi: 'Hiekkamyrsky — blackatomproductions, CC0' },
    { url: 'https://cdn.freesound.org/previews/438/438877_2524442-lq.mp3', nimi: 'Hiekkamyrskyn tuuli — craigsmith, CC0' },
    { url: 'https://cdn.freesound.org/previews/635/635912_2247456-lq.mp3', nimi: 'Kiuruja tuulisten dyynien yllä — Kinoton, CC0' },
    { url: 'https://cdn.freesound.org/previews/579/579250_2977885-lq.mp3', nimi: 'Tuuli puissa — Danjocross, CC0' },
  ],
  meri: [
    { url: 'https://cdn.freesound.org/previews/635/635103_10065335-lq.mp3', nimi: 'Tyyni aallokko — Eatyourburger, CC0' },
    { url: 'https://cdn.freesound.org/previews/848/848927_17398983-lq.mp3', nimi: 'Rantatyrsky — Benson_Arizona, CC BY-NC' },
    { url: 'https://cdn.freesound.org/previews/392/392664_4043130-lq.mp3', nimi: 'Satama yöllä (Lissabon) — corkob, CC0' },
    { url: 'https://cdn.freesound.org/previews/411/411509_1661766-lq.mp3', nimi: 'Aallot lyövät kallioihin — felix.blume, CC0' },
    { url: 'https://cdn.freesound.org/previews/573/573187_97550-lq.mp3', nimi: 'Kirkas rantahyöky — TRP, CC0' },
    { url: 'https://cdn.freesound.org/previews/543/543819_6667441-lq.mp3', nimi: 'Isot aallot kivikkorannalla — Profispiesser, CC0' },
    { url: 'https://cdn.freesound.org/previews/570/570907_11519060-lq.mp3', nimi: 'Laivan kansi merellä — bruno.auzet, CC0' },
  ],
  sademetsa: [
    { url: 'https://cdn.freesound.org/previews/818/818589_15983207-lq.mp3', nimi: 'Viidakko ja apinat — AlaskanMariner, CC BY' },
    { url: 'https://cdn.freesound.org/previews/812/812609_2309965-lq.mp3', nimi: 'Linnut metsässä — Alex_hears_things, CC0' },
    { url: 'https://cdn.freesound.org/previews/410/410078_1661766-lq.mp3', nimi: 'Yösade ja ukkonen sademetsässä — felix.blume, CC0' },
    { url: 'https://cdn.freesound.org/previews/407/407583_1661766-lq.mp3', nimi: 'Sademetsän linnut — felix.blume, CC0' },
    { url: 'https://cdn.freesound.org/previews/253/253301_2409224-lq.mp3', nimi: 'Viidakon yö (Borneo) — RTB45, CC BY' },
    { url: 'https://cdn.freesound.org/previews/486/486437_7266967-lq.mp3', nimi: 'Yösirkat viidakossa — FreeToUseSounds, CC BY' },
  ],
  savanni: [
    { url: 'https://cdn.freesound.org/previews/202/202876_1934171-lq.mp3', nimi: 'Savannin yösirkat — AugustSandberg, CC0' },
    // Omistajan huomio: klipin alku on vaimea — esitäytetty alkukohta 20 s.
    { url: 'https://cdn.freesound.org/previews/714/714271_14696146-lq.mp3', nimi: 'Kuiva tuulinen maisema — Metris, CC BY', alku: 20 },
    { url: 'https://cdn.freesound.org/previews/277/277743_3808723-lq.mp3', nimi: 'Afrikan pensasmaa — CHRISFOPFILMS, CC0' },
    { url: 'https://cdn.freesound.org/previews/504/504694_778707-lq.mp3', nimi: 'Masai-leirin luontoäänet — selcukartut, CC0' },
    { url: 'https://cdn.freesound.org/previews/612/612318_13563349-lq.mp3', nimi: 'Virtahevot joella (Kruger) — noisymichael, CC BY' },
    { url: 'https://cdn.freesound.org/previews/764/764981_15688695-lq.mp3', nimi: 'Sirkat yöllä (Etelä-Afrikka) — Christian.Combrinck, CC0' },
    { url: 'https://cdn.freesound.org/previews/411/411996_7037-lq.mp3', nimi: 'Ukkosmyrsky Etelä-Afrikassa — tim.kahn, CC BY-NC' },
  ],
  ylanko: [
    { url: 'https://cdn.freesound.org/previews/577/577263_9827221-lq.mp3', nimi: 'Vuoristomaisema — BotanicalVan, CC0' },
    { url: 'https://cdn.freesound.org/previews/543/543449_3377875-lq.mp3', nimi: 'Ulvova tuuli — Kostas17, CC BY' },
  ],
};

const TYYPPI_NIMET = {
  basaari: 'basaari',
  aavikko: 'aavikko',
  meri: 'meri',
  sademetsa: 'sademetsä',
  savanni: 'savanni',
  ylanko: 'ylänkö',
};

// Kaupungit, joilla oikea äänite soi oletuksena (ambience-stream.js:n
// STREAMS). Muilla oletus on syntetisoitu, kunnes valinta tehdään.
const STRIIMIOLETUKSET = {
  kairo: 'https://cdn.freesound.org/previews/723/723081_2978883-lq.mp3',
  sahara: 'https://cdn.freesound.org/previews/146/146745_832093-lq.mp3',
  dakar: 'https://cdn.freesound.org/previews/677/677253_9756914-lq.mp3',
  kimberley: 'https://cdn.freesound.org/previews/202/202876_1934171-lq.mp3',
  angola: 'https://cdn.freesound.org/previews/202/202876_1934171-lq.mp3',
};

export const EHDOKKAAT = {
  'musiikki:tietovisa': {
    otsikko: 'Tietovisan taustamusiikki',
    oletus: 'https://cdn.freesound.org/previews/713/713120_14632469-lq.mp3',
    ehdokkaat: [
      { url: 'https://cdn.freesound.org/previews/713/713120_14632469-lq.mp3', nimi: 'Arabialainen huilu — DYEKHO, CC0' },
      { url: 'https://cdn.freesound.org/previews/466/466570_197130-lq.mp3', nimi: 'Kalimba-luuppi — CarlosCarty, CC BY' },
      { url: 'https://cdn.freesound.org/previews/160/160461_1-lq.mp3', nimi: 'Oud-improvisaatio — Freesound, CC0' },
    ],
  },
  'tehoste:dice': {
    otsikko: 'Noppa',
    oletus: 'https://cdn.freesound.org/previews/94/94031_1554038-lq.mp3',
    ehdokkaat: [
      { url: 'https://cdn.freesound.org/previews/94/94031_1554038-lq.mp3', nimi: 'Dice Roll — LoafDV, CC0' },
      { url: 'https://cdn.freesound.org/previews/535/535816_9613218-lq.mp3', nimi: 'Dés — Lendewell, CC0' },
      { url: 'https://cdn.freesound.org/previews/764/764471_15688439-lq.mp3', nimi: 'Dice Rolling — CarikaDarvall, CC0' },
    ],
  },
  'tehoste:pen': {
    otsikko: 'Kirjoituskone (alkuteksti)',
    oletus: 'https://cdn.freesound.org/previews/856/856165_18901108-lq.mp3',
    ehdokkaat: [
      { url: 'https://cdn.freesound.org/previews/856/856165_18901108-lq.mp3', nimi: 'Yksittäinen näppäinlyönti — brktkrgll, CC0' },
      { url: 'https://cdn.freesound.org/previews/271/271525_4415905-lq.mp3', nimi: 'Ylen arkiston Triumph Matura 1970-l. — YleArkisto, CC BY' },
      { url: 'https://cdn.freesound.org/previews/650/650986_3066717-lq.mp3', nimi: 'Olympia 1956 — AchimEngels, CC0' },
      { url: 'https://cdn.freesound.org/previews/844/844137_2309965-lq.mp3', nimi: 'Mekaaninen naputus — Alex_hears_things, CC0' },
      { url: 'https://cdn.freesound.org/previews/862/862556_12084000-lq.mp3', nimi: 'L C Speed 1946 (naputus alkaa ~20 s) — ColinMWJones, CC0' },
    ],
  },
  'tehoste:jet': {
    otsikko: 'Lentokohtauksen moottori',
    oletus: 'https://cdn.freesound.org/previews/416/416891_2456794-lq.mp3',
    ehdokkaat: [
      { url: 'https://cdn.freesound.org/previews/416/416891_2456794-lq.mp3', nimi: 'Lentoonlähtö matkustamosta — Apheo, CC0' },
      { url: 'https://cdn.freesound.org/previews/845/845957_14269391-lq.mp3', nimi: 'Nousu, matkustamo — ElevatorFan2020, CC0' },
      { url: 'https://cdn.freesound.org/previews/577/577480_97550-lq.mp3', nimi: 'Pienkoneen jyrinä sisältä — TRP, CC0' },
      { url: 'https://cdn.freesound.org/previews/436/436942_843915-lq.mp3', nimi: 'Matkalento sisältä — Filmscore, CC0' },
      { url: 'https://cdn.freesound.org/previews/315/315660_2506497-lq.mp3', nimi: 'Potkurikoneen ylilento (ATR 72) — Hoscalegeek, CC0' },
      { url: 'https://cdn.freesound.org/previews/586/586106_11576705-lq.mp3', nimi: 'Pienen potkurikoneen ohilento — LarsErikErtzgaardRingen, CC0' },
    ],
  },
  'tehoste:quizOpen': {
    otsikko: 'Kysymyksen avaus',
    oletus: 'https://cdn.freesound.org/previews/842/842183_13307919-lq.mp3',
    ehdokkaat: [
      { url: 'https://cdn.freesound.org/previews/842/842183_13307919-lq.mp3', nimi: 'Sivunkääntö — AardsReal, CC0' },
      { url: 'https://cdn.freesound.org/previews/165/165464_1956076-lq.mp3', nimi: 'Harppukuvio — Puniho, CC BY' },
    ],
  },
  // ElevenLabs-efektipilotit: oletus on syntetisoitu ääni, generoitu
  // vaihtoehto otetaan käyttöön valitsemalla se täältä.
  'tehoste:click': {
    otsikko: 'Napin klikkaus',
    oletus: null,
    ehdokkaat: [
      { url: null, nimi: 'Syntetisoitu (nykyinen)' },
      { url: 'assets/audio/efekti-klik.mp3', nimi: 'Messinkisalvan naksaus — ElevenLabs SFX' },
    ],
  },
  'tehoste:paper': {
    otsikko: 'Paperin avaus (kortit)',
    oletus: null,
    ehdokkaat: [
      { url: null, nimi: 'Syntetisoitu (nykyinen)' },
      { url: 'assets/audio/efekti-paperi.mp3', nimi: 'Vanhan kirjan sivu — ElevenLabs SFX' },
    ],
  },
  'tehoste:coin': {
    otsikko: 'Kolikot',
    oletus: null,
    ehdokkaat: [
      { url: null, nimi: 'Syntetisoitu (nykyinen)' },
      { url: 'assets/audio/efekti-kolikot.mp3', nimi: 'Kolikot nahkakukkaroon — ElevenLabs SFX' },
    ],
  },
  'tehoste:correct': {
    otsikko: 'Oikea vastaus',
    oletus: null,
    ehdokkaat: [
      { url: null, nimi: 'Syntetisoitu (nykyinen)' },
      { url: 'assets/audio/efekti-oikein.mp3', nimi: 'Messinkikellon helähdys — ElevenLabs SFX' },
    ],
  },
  'tehoste:wrong': {
    otsikko: 'Väärä vastaus',
    oletus: null,
    ehdokkaat: [
      { url: null, nimi: 'Syntetisoitu (nykyinen)' },
      { url: 'assets/audio/efekti-vaarin.mp3', nimi: 'Kirja tömähtää kiinni — ElevenLabs SFX' },
    ],
  },
};

// Jokainen Afrikan kaupunki listalle: paikkakohtaiset äänitykset ensin,
// sitten maisematyypin yhteiset ehdokkaat.
for (const city of AFRICA.cities) {
  const tyyppi = city.ambience;
  if (!tyyppi) continue;
  const omat = KAUPUNKIKOHTAISET[city.id] ?? [];
  const yhteiset = (TYYPPI_EHDOKKAAT[tyyppi] ?? [])
    .filter((e) => !omat.some((o) => o.url === e.url));
  EHDOKKAAT[`kaupunki:${city.id}`] = {
    otsikko: `${city.name} — ${TYYPPI_NIMET[tyyppi] ?? tyyppi}`,
    oletus: STRIIMIOLETUKSET[city.id] ?? null,
    ehdokkaat: [
      // null-osoite tarkoittaa syntetisoitua ambienssia.
      { url: null, nimi: 'Syntetisoitu äänimaisema' },
      ...omat,
      ...yhteiset,
    ],
  };
}

/**
 * Valinta voi sisältää aloituskohdan: 'osoite#alku=20' aloittaa äänitteen
 * 20 sekunnin kohdalta. Tämä purkaa muodon soittimia varten.
 */
export function jaaAlku(arvo) {
  const m = /^(.*)#alku=([0-9]+(?:\.[0-9]+)?)$/.exec(arvo ?? '');
  return m ? { url: m[1], alku: Number(m[2]) } : { url: arvo ?? null, alku: 0 };
}

/** Valittu osoite paikalle, tai null jos oletus kelpaa. */
export function valittuAani(slot) {
  try {
    return JSON.parse(localStorage.getItem(AVAIN) ?? '{}')[slot] ?? null;
  } catch {
    return null;
  }
}

/**
 * Tallentaa valinnan. `url` null tarkoittaa "syntetisoitu": se
 * tallennetaan tyhjänä merkkijonona, jotta se eroaa poistetusta
 * valinnasta (oletus).
 */
export function valitseAani(slot, url) {
  try {
    const valinnat = JSON.parse(localStorage.getItem(AVAIN) ?? '{}');
    if (url === undefined) delete valinnat[slot];
    else valinnat[slot] = url ?? '';
    localStorage.setItem(AVAIN, JSON.stringify(valinnat));
  } catch {
    /* yksityinen selaustila — valinta ei säily */
  }
}

/** Kaikki valinnat kerralla (Kopioi valinnat -nappia varten). */
export function kaikkiValinnat() {
  try {
    return JSON.parse(localStorage.getItem(AVAIN) ?? '{}');
  } catch {
    return {};
  }
}
