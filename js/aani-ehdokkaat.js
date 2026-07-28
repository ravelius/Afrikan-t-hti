// Äänivaihtoehdot: jokaiselle striimipaikalle, tehosteelle ja musiikille
// muutama ehdokas Freesoundista (vain CC-lisenssit, osoitteet varmistettu).
// Paras valitaan /aanet.html-sivulla; valinta tallentuu selaimeen ja peli
// käyttää sitä oletuksen sijaan heti seuraavasta latauksesta. Kun omistaja
// on valinnut, voittajat kovakoodataan oletuksiksi kaikille.

const AVAIN = 'matkakirja-aanivalinnat';

export const EHDOKKAAT = {
  'kaupunki:kairo': {
    otsikko: 'Kairo — kaupungin ääni',
    ehdokkaat: [
      { url: 'https://cdn.freesound.org/previews/723/723081_2978883-lq.mp3', nimi: 'Yöhälinä ("cairo night out") — rucisko, CC BY-NC' },
      { url: 'https://cdn.freesound.org/previews/511/511005_571436-lq.mp3', nimi: 'Khan el-Khalilin basaari — 3bagbrew, CC0' },
      { url: 'https://cdn.freesound.org/previews/683/683118_8105512-lq.mp3', nimi: 'Attaban katukauppiaat — AhmadAiuby, CC0' },
    ],
  },
  'kaupunki:sahara': {
    otsikko: 'Sahara — aavikon ääni',
    ehdokkaat: [
      { url: 'https://cdn.freesound.org/previews/146/146745_832093-lq.mp3', nimi: 'Saharan tuuli soittaa lotaria — omestreandre, CC BY' },
      { url: 'https://cdn.freesound.org/previews/714/714271_14696146-lq.mp3', nimi: 'Aavikon äänimaisema — Metris, CC BY' },
      { url: 'https://cdn.freesound.org/previews/579/579250_2977885-lq.mp3', nimi: 'Tuuli puissa — Danjocross, CC0' },
    ],
  },
  'kaupunki:dakar': {
    otsikko: 'Dakar — sisäpiha',
    ehdokkaat: [
      { url: 'https://cdn.freesound.org/previews/677/677253_9756914-lq.mp3', nimi: 'Ouakamin piha illalla (19 h) — LaureC, CC0' },
      { url: 'https://cdn.freesound.org/previews/677/677252_9756914-lq.mp3', nimi: 'Ouakamin piha aamulla (9.30) — LaureC, CC0' },
    ],
  },
  'kaupunki:kimberley': {
    otsikko: 'Kimberley — savannin yö',
    ehdokkaat: [
      { url: 'https://cdn.freesound.org/previews/202/202876_1934171-lq.mp3', nimi: 'Savannin sirkat — AugustSandberg, CC0' },
    ],
  },
  'kaupunki:angola': {
    otsikko: 'Angola — savannin yö',
    ehdokkaat: [
      { url: 'https://cdn.freesound.org/previews/202/202876_1934171-lq.mp3', nimi: 'Savannin sirkat — AugustSandberg, CC0' },
    ],
  },
  'musiikki:tietovisa': {
    otsikko: 'Tietovisan taustamusiikki',
    ehdokkaat: [
      { url: 'https://cdn.freesound.org/previews/713/713120_14632469-lq.mp3', nimi: 'Arabialainen huilu — DYEKHO, CC0' },
      { url: 'https://cdn.freesound.org/previews/466/466570_197130-lq.mp3', nimi: 'Kalimba-luuppi — CarlosCarty, CC BY' },
      { url: 'https://cdn.freesound.org/previews/160/160461_1-lq.mp3', nimi: 'Oud-improvisaatio — Freesound, CC0' },
    ],
  },
  'tehoste:dice': {
    otsikko: 'Noppa',
    ehdokkaat: [
      { url: 'https://cdn.freesound.org/previews/94/94031_1554038-lq.mp3', nimi: 'Dice Roll — LoafDV, CC0' },
      { url: 'https://cdn.freesound.org/previews/535/535816_9613218-lq.mp3', nimi: 'Dés — Lendewell, CC0' },
      { url: 'https://cdn.freesound.org/previews/764/764471_15688439-lq.mp3', nimi: 'Dice Rolling — CarikaDarvall, CC0' },
    ],
  },
  'tehoste:pen': {
    otsikko: 'Kirjoitus (alkuteksti)',
    ehdokkaat: [
      { url: 'https://cdn.freesound.org/previews/862/862556_12084000-lq.mp3', nimi: 'Kirjoituskone 1946 — ColinMWJones, CC0' },
      { url: 'https://cdn.freesound.org/previews/856/856167_18901108-lq.mp3', nimi: 'Mustekynä pergamentilla — brktkrgll, CC0' },
      { url: 'https://cdn.freesound.org/previews/750/750171_5109200-lq.mp3', nimi: 'Täytekynän raapina — DataJuggler, CC0' },
    ],
  },
  'tehoste:jet': {
    otsikko: 'Lentokohtauksen moottori',
    ehdokkaat: [
      { url: 'https://cdn.freesound.org/previews/416/416891_2456794-lq.mp3', nimi: 'Lentoonlähtö matkustamosta — Apheo, CC0' },
      { url: 'https://cdn.freesound.org/previews/436/436942_843915-lq.mp3', nimi: 'Matkalento sisältä — Filmscore, CC0' },
    ],
  },
  'tehoste:quizOpen': {
    otsikko: 'Kysymyksen avaus',
    ehdokkaat: [
      { url: 'https://cdn.freesound.org/previews/842/842183_13307919-lq.mp3', nimi: 'Sivunkääntö — AardsReal, CC0' },
      { url: 'https://cdn.freesound.org/previews/165/165464_1956076-lq.mp3', nimi: 'Harppukuvio — Puniho, CC BY' },
    ],
  },
};

/** Valittu osoite paikalle, tai null jos oletus kelpaa. */
export function valittuAani(slot) {
  try {
    return JSON.parse(localStorage.getItem(AVAIN) ?? '{}')[slot] ?? null;
  } catch {
    return null;
  }
}

/** Tallentaa valinnan; null poistaa sen (palataan oletukseen). */
export function valitseAani(slot, url) {
  try {
    const valinnat = JSON.parse(localStorage.getItem(AVAIN) ?? '{}');
    if (url) valinnat[slot] = url;
    else delete valinnat[slot];
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
