/*
 * Ääneen lukija (omistajan toive 7.8.2026: "voiko teksteihin saada
 * reaaliaikaista lukijaa? paras olisi että lukijalta olisi karsittu
 * pois lähdeviitteet, napit sekä kuvatekstit").
 *
 * Selaimen oma puhesyntesi (Web Speech API): ilmainen, reaaliaikainen,
 * ei palvelinta. Luettava teksti kootaan pelin omasta datasta eikä
 * ruudulta, joten lähderivit, kuvatekstit ja napit jäävät pois
 * itsestään.
 *
 * ÄÄNEN VALINTA: selain saa käyttöönsä laitteen puheäänet — Siriä
 * Apple ei anna millekään sovellukselle. Suomen oletusääni (Satu,
 * suppea) on koneellinen, mutta iPadin asetuksista ladattu parempi
 * ääni (Käyttöapu → Puhuttu sisältö → Äänet → Suomi) näkyy myös
 * selaimelle, ja parasSuomiAani poimii sen automaattisesti.
 *
 * PALOITTELU: pitkä teksti luetaan lausepaloina. Chromen tunnettu
 * vika katkaisee pitkän puheen ~15 sekunnin kohdalla verkkoäänillä —
 * jono lyhyitä puheenvuoroja ei katkea, ja pysäytys osuu heti
 * seuraavaan palaan.
 */

/** Onko puhesyntesi tässä selaimessa. */
export function lukijaTuettu() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Paloittelee tekstin puhesyntesille sopiviin lausepaloihin.
 * Katkaisu vain lauseen rajalta; enimmäispituus on väljä, koska
 * yksittäinen ylipitkä lause luetaan silti kokonaisena.
 */
export function jaaPaloiksi(teksti, enintaan = 220) {
  const lauseet = String(teksti).match(/[^.!?…]+[.!?…]*\s*/g) ?? [String(teksti)];
  const palat = [];
  let pala = '';
  for (const lause of lauseet) {
    if (pala && (pala + lause).length > enintaan) {
      palat.push(pala.trim());
      pala = '';
    }
    pala += lause;
  }
  if (pala.trim()) palat.push(pala.trim());
  return palat;
}

/**
 * Paras saatavilla oleva suomiääni. Ladatut laatuäänet ("Satu
 * (laajennettu)", "Enhanced", "Premium") voittavat; verkkoäänet
 * (esim. Chromen "Google suomi") voittavat suppean paikallisen.
 */
export function parasSuomiAani(aanet) {
  const suomet = (aanet ?? []).filter((a) => /^fi([-_]|$)/i.test(a.lang ?? ''));
  if (!suomet.length) return null;
  const pisteet = (a) => {
    let p = 0;
    if (/enhanced|premium|natural|laajennettu|parannettu/i.test(a.name ?? '')) p += 4;
    if (/google|microsoft/i.test(a.name ?? '')) p += 2;
    if (/compact|suppea/i.test(a.name ?? '')) p -= 1;
    return p;
  };
  return [...suomet].sort((x, y) => pisteet(y) - pisteet(x))[0];
}

/**
 * Odottaa äänilistan (voiceschanged tulee usein vasta hetken päästä;
 * Safarissa lista on valmis heti). Palauttaa listan sellaisenaan —
 * tyhjäkin kelpaa, silloin puhutaan selaimen oletusäänellä.
 */
function odotaAanet() {
  const heti = window.speechSynthesis.getVoices();
  if (heti.length) return Promise.resolve(heti);
  return new Promise((valmis) => {
    const aikaraja = setTimeout(() => valmis(window.speechSynthesis.getVoices()), 1000);
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      clearTimeout(aikaraja);
      valmis(window.speechSynthesis.getVoices());
    }, { once: true });
  });
}

/* Yksi lukija koko pelille: uusi aloitus pysäyttää edellisen. */
let kaynnissa = null;

/** Lukeeko lukija parhaillaan. */
export function lukijaLukee() {
  return Boolean(kaynnissa);
}

/** Pysäyttää lukemisen heti. Turvallinen kutsua aina. */
export function lukijaSeis() {
  if (!lukijaTuettu()) return;
  const oli = kaynnissa;
  kaynnissa = null;
  window.speechSynthesis.cancel();
  if (oli?.onLoppu) oli.onLoppu();
}

/**
 * Lukee tekstit järjestyksessä. Palauttaa valitun äänen (tai null),
 * jotta kutsuja voi näyttää laatuvinkin suppealla äänellä.
 *
 * onLoppu kutsutaan kerran, kun lukeminen loppuu — itsestään,
 * pysäytettynä tai virheeseen.
 */
export async function lukijaLue(tekstit, { onLoppu = null } = {}) {
  if (!lukijaTuettu()) return null;
  lukijaSeis();
  const aanet = await odotaAanet();
  const aani = parasSuomiAani(aanet);
  const palat = tekstit.filter(Boolean).flatMap((t) => jaaPaloiksi(t));
  if (!palat.length) return aani;
  const oma = { onLoppu };
  kaynnissa = oma;
  let jaljella = palat.length;
  const loppu = () => {
    jaljella -= 1;
    if (jaljella > 0 || kaynnissa !== oma) return;
    kaynnissa = null;
    if (onLoppu) onLoppu();
  };
  for (const pala of palat) {
    const puhe = new SpeechSynthesisUtterance(pala);
    puhe.lang = 'fi-FI';
    if (aani) puhe.voice = aani;
    puhe.addEventListener('end', loppu);
    puhe.addEventListener('error', loppu);
    window.speechSynthesis.speak(puhe);
  }
  /*
   * Vahtikoira: puhemoottori voi puuttua kokonaan (speechSynthesis on
   * olemassa, mutta speak() ei tee mitään eikä lähetä tapahtumia —
   * esim. Linux ilman puhepalvelua). Jos mikään ei ala puhua neljässä
   * sekunnissa, lukeminen todetaan epäonnistuneeksi eikä nappi jää
   * soi-tilaan.
   */
  setTimeout(() => {
    if (kaynnissa === oma && !window.speechSynthesis.speaking) lukijaSeis();
  }, 4000);
  return aani;
}
