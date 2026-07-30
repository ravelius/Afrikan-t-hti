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

import { PACKS } from './pack.js';

const AVAIN = 'matkakirja-aanivalinnat';


// Tyyppiehdokkaat: käyvät kaikille saman maiseman kaupungeille.
export const TYYPPI_EHDOKKAAT = {
  basaari: [
    { url: 'https://cdn.freesound.org/previews/511/511005_571436-lq.mp3', nimi: 'Basaarin hälinä (Khan el-Khalili) — 3bagbrew, CC0' },
    { url: 'https://cdn.freesound.org/previews/677/677253_9756914-lq.mp3', nimi: 'Ouakamin piha illalla (Dakar) — LaureC, CC0' },
    { url: 'https://cdn.freesound.org/previews/677/677252_9756914-lq.mp3', nimi: 'Ouakamin piha aamulla (Dakar) — LaureC, CC0' },
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

export const TYYPPI_NIMET = {
  basaari: 'basaari',
  aavikko: 'aavikko',
  meri: 'meri',
  sademetsa: 'sademetsä',
  savanni: 'savanni',
  ylanko: 'ylänkö',
};


export const EHDOKKAAT = {
  // Tietovisan musiikki jaotellaan maanosittain (Muut äänet → Tietovisat):
  // yleinen valinta soi kaikkialla, ellei maanosalla ole omaansa.
  'musiikki:tietovisa': {
    otsikko: 'Yleinen — soi ellei maanosalla ole omaa valintaa',
    // Omistajan valinta (31.7.) kirjattu oletukseksi kaksinkertaisella
    // voimalla — näin se soi myös kotivalikon sovelluksessa.
    oletus: 'https://cdn.freesound.org/previews/176/176134_334810-lq.mp3#voima=2',
    ehdokkaat: [
      { url: 'https://cdn.freesound.org/previews/176/176134_334810-lq.mp3', nimi: '6_drums_luangprabang.WAV — LukeIRL, CC BY' },
      { url: 'https://cdn.freesound.org/previews/713/713120_14632469-lq.mp3', nimi: 'Arabialainen huilu — DYEKHO, CC0' },
      { url: 'https://cdn.freesound.org/previews/466/466570_197130-lq.mp3', nimi: 'Kalimba-luuppi — CarlosCarty, CC BY' },
      { url: 'https://cdn.freesound.org/previews/843/843466_15636277-lq.mp3', nimi: 'Rumpu ja kalimba -luuppi — bassimat, CC0' },
      { url: 'https://cdn.freesound.org/previews/666/666866_5737443-lq.mp3', nimi: 'Hang drum (Dancing Spirit) — MrJmix, CC BY' },
      { url: 'https://cdn.freesound.org/previews/557/557122_2282212-lq.mp3', nimi: 'Tumma ambient-pinta — szegvari, CC0' },
    ],
  },
  'musiikki:tietovisa:africa': {
    otsikko: 'Afrikka',
    // Omistajan valinta (30.7.) kirjattu oletukseksi: näin se soi myös
    // kotivalikkoon asennetussa pelissä, jonka tallennustila on eri kuin
    // Safarin, jossa studio pyörii.
    oletus: 'assets/audio/musiikki-visa-afrikka-3.mp3',
    ehdokkaat: [
      { url: 'assets/audio/musiikki-visa-afrikka-1.mp3', nimi: 'Kalimba-mietiskely — ElevenLabs-luuppi' },
      { url: 'assets/audio/musiikki-visa-afrikka-2.mp3', nimi: 'Kora-harppu — ElevenLabs-luuppi' },
      { url: 'assets/audio/musiikki-visa-afrikka-3.mp3', nimi: 'Mbira ja helistin — ElevenLabs-luuppi' },
      { url: 'https://cdn.freesound.org/previews/466/466570_197130-lq.mp3', nimi: 'Kalimba-luuppi — CarlosCarty, CC BY' },
      { url: 'https://cdn.freesound.org/previews/843/843466_15636277-lq.mp3', nimi: 'Rumpu ja kalimba -luuppi — bassimat, CC0' },
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
    // Omistajan valinta (31.7.): sama kuin sound.js:n REAL_SAMPLES.jet.
    oletus: 'https://cdn.freesound.org/previews/315/315660_2506497-lq.mp3',
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
    oletus: 'assets/audio/efekti-klik.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-klik.mp3', nimi: 'Messinkisalvan naksaus — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:paper': {
    otsikko: 'Paperin avaus (kortit)',
    oletus: 'assets/audio/efekti-paperi.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-paperi.mp3', nimi: 'Vanhan kirjan sivu — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:coin': {
    otsikko: 'Kolikot',
    oletus: 'assets/audio/efekti-kolikot.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-kolikot.mp3', nimi: 'Kolikot nahkakukkaroon — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:correct': {
    otsikko: 'Oikea vastaus',
    oletus: 'assets/audio/efekti-oikein.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-oikein.mp3', nimi: 'Messinkikellon helähdys — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:wrong': {
    otsikko: 'Väärä vastaus',
    oletus: 'assets/audio/efekti-vaarin.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-vaarin.mp3', nimi: 'Kirja tömähtää kiinni — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:swipe': {
    otsikko: 'Kortin pyyhkäisy',
    oletus: 'assets/audio/efekti-pyyhkaisy.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-pyyhkaisy.mp3', nimi: 'Paperin viuhaus — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:step': {
    otsikko: 'Askel kartalla (väliaskeleen kopina)',
    oletus: 'assets/audio/efekti-naksu.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-naksu.mp3', nimi: 'Nappulan kopina (matala tok) — ElevenLabs SFX' },
      { url: 'assets/audio/efekti-askel.mp3', nimi: 'Saappaan askel polulla — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:arrive': {
    otsikko: 'Saapuminen kaupunkiin (viimeinen kolaus)',
    oletus: 'assets/audio/efekti-naksu.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-naksu.mp3', nimi: 'Nappulan kolaus (korkea tik) — ElevenLabs SFX' },
      { url: 'assets/audio/efekti-saapuminen.mp3', nimi: 'Marimban kaksi nousevaa säveltä — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:ferry': {
    otsikko: 'Laivamatka',
    oletus: 'assets/audio/efekti-laiva.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-laiva.mp3', nimi: 'Höyrylaivan törähdys — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:flight': {
    otsikko: 'Lento (ilmoitus)',
    oletus: 'assets/audio/efekti-lento.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-lento.mp3', nimi: 'Potkurikoneen ohilento — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:hint': {
    otsikko: 'Vihjeen osto',
    oletus: 'assets/audio/efekti-vihje.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-vihje.mp3', nimi: 'Sulkakynän rapsutus — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:tick': {
    otsikko: 'Tiimalasin tikitys',
    oletus: 'assets/audio/efekti-tikitys.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-tikitys.mp3', nimi: 'Puukellon tikahdus — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:timeout': {
    otsikko: 'Aika loppui',
    oletus: 'assets/audio/efekti-aikaloppui.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-aikaloppui.mp3', nimi: 'Hiekka valuu ja puinen kopsahdus — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:flip': {
    otsikko: 'Laatan kääntö',
    oletus: 'assets/audio/efekti-kaanto.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-kaanto.mp3', nimi: 'Puulaatan käännähdys — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:clack': {
    otsikko: 'Nappulan naksu',
    oletus: 'assets/audio/efekti-naksu.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-naksu.mp3', nimi: 'Pelinappula puulaudalle — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:star': {
    otsikko: 'Tähden paljastus',
    oletus: 'assets/audio/efekti-tahti.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-tahti.mp3', nimi: 'Celestan nouseva kimallus — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:gem': {
    otsikko: 'Jalokiven paljastus',
    oletus: 'assets/audio/efekti-jalokivi.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-jalokivi.mp3', nimi: 'Lasinen kimallushelähdys — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:horseshoe': {
    otsikko: 'Hevosenkengän paljastus',
    oletus: 'assets/audio/efekti-kenka.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-kenka.mp3', nimi: 'Metallinen kilahdus puuta vasten — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:robber': {
    otsikko: 'Rosvon paljastus',
    oletus: 'assets/audio/efekti-rosvo.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-rosvo.mp3', nimi: 'Matala rumpuisku ja kalina — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:empty': {
    otsikko: 'Tyhjä laatta',
    oletus: 'assets/audio/efekti-tyhja.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-tyhja.mp3', nimi: 'Pölähdys ja pettynyt kopsahdus — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:stuck': {
    otsikko: 'Ei pääse liikkumaan',
    oletus: 'assets/audio/efekti-jumissa.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-jumissa.mp3', nimi: 'Tömähdys ja narahdus — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:turn': {
    otsikko: 'Vuoron vaihto',
    oletus: 'assets/audio/efekti-vuoro.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-vuoro.mp3', nimi: 'Sivunkääntö ja kevyt kopsahdus — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
  'tehoste:win': {
    otsikko: 'Voittofanfaari',
    oletus: 'assets/audio/efekti-voitto.mp3',
    ehdokkaat: [
      { url: 'assets/audio/efekti-voitto.mp3', nimi: 'Lyhyt messinkifanfaari — ElevenLabs SFX' },
      { url: null, nimi: 'Syntetisoitu' },
    ],
  },
};

// Kaupungit tyypeittäin ja maanosittain: äänityyppi on yläkategoria,
// sen alla maanosat (laudat) ja niiden alla kaupungit. Uusi maanosa
// ilmestyy studioon heti, kun sen kaupungeille merkitään tyypit —
// jokainen maanosa saa oman arvontakorinsa (omistajan päätös:
// maanosia tulee lisää, eikä Aasian savanni soi Afrikan korista).
// Kaupunkikohtaisia valintoja ei ole: äänet tulevat aina korista.
export const KAUPUNGIT_TYYPEITTAIN = {};
for (const pack of PACKS) {
  for (const city of pack.cities) {
    if (!city.ambience) continue;
    const laudat = KAUPUNGIT_TYYPEITTAIN[city.ambience] ??= [];
    let lauta = laudat.find((l) => l.lauta === pack.id);
    if (!lauta) {
      lauta = {
        lauta: pack.id, maanosa: pack.boardLabel ?? pack.name, kaupungit: [], maat: [],
      };
      laudat.push(lauta);
    }
    if (!lauta.kaupungit.includes(city.name)) lauta.kaupungit.push(city.name);
    // Kaupungit ryhmitellään maittain (omistajan päätös: tyyppi →
    // maanosa → maat). Ilman maakytkentää kaupunki jää nimettömään
    // ryhmään, joka listataan pelkin kaupunkinimin.
    const iso = pack.map?.cityCountry?.[city.id] ?? null;
    const maaNimi = iso ? pack.map?.countryShapes?.[iso]?.nimi ?? iso : null;
    let maa = lauta.maat.find((m) => m.nimi === maaNimi);
    if (!maa) {
      maa = { nimi: maaNimi, kaupungit: [] };
      lauta.maat.push(maa);
    }
    if (!maa.kaupungit.includes(city.name)) maa.kaupungit.push(city.name);
  }
}

// Virtuaalipaikat kuuluvat Maailma-laudalle: etusivun satama ja
// maailmankartan merimatkat saavat meri-äänensä sen korista. Muilla
// laudoilla merimatka käyttää oman maanosansa koria.
{
  const meri = KAUPUNGIT_TYYPEITTAIN.meri ??= [];
  if (!meri.some((l) => l.lauta === 'maailma')) {
    const maailma = PACKS.find((p) => p.id === 'maailma');
    const paikat = ['Etusivun satama', 'Merimatkat maailmankartalla'];
    meri.unshift({
      lauta: 'maailma',
      maanosa: maailma?.boardLabel ?? 'Maailma',
      kaupungit: paikat,
      maat: [{ nimi: null, kaupungit: paikat }],
    });
  }
}

/**
 * Valinta voi sisältää säätöjä: 'osoite#alku=20&voima=1.5' aloittaa
 * äänitteen 20 sekunnin kohdalta puolitoistakertaisella voimakkuudella.
 * Tämä purkaa muodon soittimia varten. Vanha muoto ('#alku=20') toimii.
 */
export function jaaAlku(arvo) {
  const teksti = arvo ?? '';
  const risu = teksti.indexOf('#');
  if (risu < 0) return { url: arvo ?? null, alku: 0, voima: 1 };
  const url = teksti.slice(0, risu);
  const osat = Object.fromEntries(
    teksti.slice(risu + 1).split('&').map((p) => p.split('=')).filter((p) => p.length === 2),
  );
  return {
    url,
    alku: Math.max(0, Number(osat.alku) || 0),
    voima: Math.max(0.1, Number(osat.voima) || 1),
  };
}

/** Valittu osoite paikalle, tai null jos oletus kelpaa. */
// Poistetut ehdokkaat: väärin nimetty tai lisenssiä ei voi enää varmistaa
// (esim. lataaja poistanut tilinsä). Vanha tallennettu valinta ohjataan
// takaisin oletukseen, ettei peli jää soittamaan tuntematonta raitaa.
const POISTETUT = new Set([
  'https://cdn.freesound.org/previews/160/160461_1-lq.mp3',
]);

// Kategoriakohtaiset arvontakorit maanosittain: maisematyypille voi
// valita studiossa jokaiselle maanosalle omat äänensä, joista peli arpoo
// yhden joka käynnillä. Talletusmuoto on { tyyppi: { lauta: [urlit] } };
// vanha muoto { tyyppi: [urlit] } koski kaikkia maanosia ja luetaan yhä.
const TYYPPIKORI_AVAIN = 'matkakirja-tyyppivalinnat';

// Oletuskori: yksi varmistettu ääni per maisematyyppi, kunnes omistaja
// rastii omat valintansa maanosalle. Tyhjäksi tallennettu kori
// tarkoittaa synteesiä.
// Omistajan studiovalinnat (31.7.) kirjattu oletuskoreiksi säätöineen:
// näin sama arvonta soi myös kotivalikon sovelluksessa. Uusi maanosa
// perii nämä, kunnes omistaja rastii sille omat äänensä.
const OLETUSKORIT = {
  basaari: [
    'https://cdn.freesound.org/previews/723/723081_2978883-lq.mp3',
    'https://cdn.freesound.org/previews/511/511005_571436-lq.mp3',
  ],
  aavikko: [
    'https://cdn.freesound.org/previews/714/714271_14696146-lq.mp3#voima=2.3',
    'https://cdn.freesound.org/previews/411/411774_1910728-lq.mp3#voima=3',
    'https://cdn.freesound.org/previews/565/565015_12186594-lq.mp3#voima=0.3',
    'https://cdn.freesound.org/previews/635/635912_2247456-lq.mp3',
    'https://cdn.freesound.org/previews/579/579250_2977885-lq.mp3#voima=0.6',
  ],
  meri: [
    'https://cdn.freesound.org/previews/848/848927_17398983-lq.mp3',
    'https://cdn.freesound.org/previews/635/635103_10065335-lq.mp3',
    'https://cdn.freesound.org/previews/411/411509_1661766-lq.mp3#voima=0.6',
    'https://cdn.freesound.org/previews/573/573187_97550-lq.mp3',
    'https://cdn.freesound.org/previews/543/543819_6667441-lq.mp3#alku=22',
    'https://cdn.freesound.org/previews/570/570907_11519060-lq.mp3#voima=1.6',
  ],
  sademetsa: [
    'https://cdn.freesound.org/previews/818/818589_15983207-lq.mp3',
    'https://cdn.freesound.org/previews/812/812609_2309965-lq.mp3#voima=2.3',
    'https://cdn.freesound.org/previews/410/410078_1661766-lq.mp3',
    'https://cdn.freesound.org/previews/407/407583_1661766-lq.mp3#voima=0.6',
    'https://cdn.freesound.org/previews/253/253301_2409224-lq.mp3#voima=0.8',
  ],
  savanni: [
    'https://cdn.freesound.org/previews/202/202876_1934171-lq.mp3#voima=2',
    'https://cdn.freesound.org/previews/714/714271_14696146-lq.mp3#alku=20',
    'https://cdn.freesound.org/previews/504/504694_778707-lq.mp3#voima=1.6',
    'https://cdn.freesound.org/previews/612/612318_13563349-lq.mp3#voima=0.6',
    'https://cdn.freesound.org/previews/764/764981_15688695-lq.mp3#voima=0.8',
    'https://cdn.freesound.org/previews/411/411996_7037-lq.mp3#alku=52',
  ],
  ylanko: [
    'https://cdn.freesound.org/previews/543/543449_3377875-lq.mp3#voima=0.5',
  ],
};

export function tyyppiKori(tyyppi, lauta) {
  try {
    const kaikki = JSON.parse(localStorage.getItem(TYYPPIKORI_AVAIN) ?? '{}');
    const merkinta = kaikki[tyyppi];
    const lista = Array.isArray(merkinta) ? merkinta : merkinta?.[lauta];
    if (Array.isArray(lista)) return lista.filter(Boolean);
  } catch {
    /* yksityinen selaustila — oletuskori kelpaa */
  }
  return OLETUSKORIT[tyyppi] ?? [];
}

/** Tallentaa tyypin arvontakorin yhdelle maanosalle (laudalle). */
export function valitseTyyppiKori(tyyppi, lauta, lista) {
  try {
    const kaikki = JSON.parse(localStorage.getItem(TYYPPIKORI_AVAIN) ?? '{}');
    const vanha = kaikki[tyyppi];
    // Vanhan muodon lista koski kaikkia maanosia: se siirretään jokaiselle
    // tyypin nykyiselle laudalle, ettei yhden maanosan muokkaus hukkaa
    // muiden perimää valintaa.
    const merkinta = Array.isArray(vanha)
      ? Object.fromEntries((KAUPUNGIT_TYYPEITTAIN[tyyppi] ?? []).map((l) => [l.lauta, vanha]))
      : { ...(vanha ?? {}) };
    // Tyhjäkin lista tallennetaan: se tarkoittaa syntetisoitua ääntä,
    // eikä oletuskori saa palata sen tilalle.
    merkinta[lauta] = lista ?? [];
    kaikki[tyyppi] = merkinta;
    localStorage.setItem(TYYPPIKORI_AVAIN, JSON.stringify(kaikki));
  } catch {
    /* yksityinen selaustila — kori ei säily */
  }
}

export function valittuAani(slot) {
  try {
    const arvo = JSON.parse(localStorage.getItem(AVAIN) ?? '{}')[slot] ?? null;
    if (arvo && POISTETUT.has(jaaAlku(arvo).url ?? '')) return null;
    return arvo;
  } catch {
    return null;
  }
}

/**
 * Tallentaa valinnan. `url` null tarkoittaa "syntetisoitu": se
 * tallennetaan tyhjänä merkkijonona, jotta se eroaa poistetusta
 * valinnasta (oletus).
 */
/**
 * Valinta tai slotin oletus: selaimeen tallennettu valinta voittaa, mutta
 * ilman sitä palataan EHDOKKAAT-oletukseen. Tärkeä erityisesti
 * kotivalikkoon asennetussa pelissä, jonka tallennustila on eri kuin
 * Safarin — sinne studio-valinnat eivät kulje, oletukset kulkevat.
 * Tyhjä merkkijono ('' = ääni valittu pois) kunnioitetaan sellaisenaan.
 */
export function valittuTaiOletus(slot) {
  const arvo = valittuAani(slot);
  if (arvo !== null) return arvo;
  return EHDOKKAAT[slot]?.oletus ?? null;
}

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

// Kertojan tila (omistajan toive, yläpalkin valikko): 'pitka' lukee
// kaiken kuten ennenkin, 'lyhyt' vain matkakirjan nuoren herran
// osuuden, 'ei' mykistää kertojan mutta jättää muut äänet soimaan
// (matkakirjan kaiutinnappi yliajaa hetkellisesti). Täysi mykistys on
// erikseen sound.js:n enabled-tilassa.
const KERTOJA_AVAIN = 'matkakirja-kertoja';

export function kertojaTila() {
  try {
    const t = localStorage.getItem(KERTOJA_AVAIN);
    return ['ei', 'lyhyt', 'pitka'].includes(t) ? t : 'pitka';
  } catch {
    return 'pitka';
  }
}

export function asetaKertojaTila(tila) {
  try {
    localStorage.setItem(KERTOJA_AVAIN, tila);
  } catch {
    /* yksityinen selaustila — valinta ei säily */
  }
}

// Puheen voimakkuus: yksi yleinen säätö kaikkiin luentoihin (intro,
// saapumiset, kuuntele-napit) — luentoja ei eritellä (omistajan päätös).
const PUHEVOIMA_AVAIN = 'matkakirja-puhevoima';

export function puheVoima() {
  try {
    const arvo = Number(localStorage.getItem(PUHEVOIMA_AVAIN));
    if (Number.isFinite(arvo) && arvo > 0) return Math.min(1, Math.max(0.1, arvo));
  } catch {
    /* yksityinen selaustila — oletus kelpaa */
  }
  return 0.9;
}

export function asetaPuheVoima(arvo) {
  try {
    localStorage.setItem(PUHEVOIMA_AVAIN, String(arvo));
  } catch {
    /* ei säily */
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
