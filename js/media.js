// Peili: pelin kaikista repon ulkopuolelta ladattavista kuvista ja
// äänistä on oma kopio yhdessä paikassa (ämpäri, ks. R2_JUURI alla).
// Peli hakee aineiston ensisijaisesti sieltä, jottei yksi kaatunut
// palvelin tai poistettu tiedosto riko peliä kesken matkan. Alkuperäinen
// osoite jää varareitiksi.
//
// Peilin polku LASKETAAN samalla säännöllä kuin peilaustyökalussa
// (tools/peilaa-media.mjs). Erillistä hakemistotiedostoa ei siis tarvita
// eikä 298 tiedostonimeä toisteta pelin koodissa. tests/media.test.mjs
// vartioi, etteivät säännöt pääse eriytymään: se tarkistaa jokaisen
// paketeissa mainitun tiedoston peilin manifestia vasten.

/*
 * Koko peili on omassa ämpärissään (Cloudflare R2).
 *
 * Aineisto oli GitHub Pagesissa, jonka suositusraja on 1 Gt sivustoa
 * kohti. Pelkkä Euroopan äänipuoli vei 569 Mt, eikä koko maailma olisi
 * mahtunut. Äänet siirtyivät ensin, kuvat ja liput perässä — nyt
 * media-repoa ei enää tarvita lainkaan.
 *
 * Juuria on kaksi vakiota, vaikka ne osoittavat samaan paikkaan. Ne
 * ovat eri asioita: kuvat ja äänet voi tarvittaessa erottaa taas eri
 * palvelimille vaihtamalla toisen. Katkaisija erottaa lajit polusta
 * (peilinLaji alla), ei juuresta, joten yhteinen osoite ei sekoita
 * niitä keskenään.
 *
 * Alkuperäinen lähde (Wikimedia Commons, archive.org, Freesound) jää
 * yhä varareitiksi, jos ämpäri ei vastaa.
 *
 * Ämpärillä on CORS-sääntö, joka sallii GETin osoitteesta
 * https://ravelius.github.io. Sitä tarvitaan kahteen kohtaan:
 * js/sound.js loadRealSamples hakee tehosteet fetchillä ja purkaa ne
 * decodeAudioDatalla, ja sw.js noutaa kuvat omaan pitkäikäiseen
 * koriinsa mode: 'cors' -pyynnöllä. Tavallinen <audio>- ja
 * <img>-lataus ei CORSia tarvitse, joten muualta avattuna — esimerkiksi
 * yhden tiedoston versio levyltä — peli toimii silti: nuo kaksi kohtaa
 * putoavat alkuperäiseen lähteeseen.
 */
const R2_JUURI = 'https://pub-7bc0ed2083a74a68bd7115618bca4709.r2.dev/';
export const PEILI_JUURI = R2_JUURI;
export const AANI_JUURI = R2_JUURI;

/**
 * Turvallinen tiedostonimi mistä tahansa merkkijonosta.
 * Sama funktio kuin peilaustyökalussa — älä muuta vain toista puolta.
 */
function turvanimi(teksti, pate) {
  const puhdas = teksti
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 90);
  return pate ? `${puhdas}.${pate}` : puhdas;
}

/** Commons-tiedostonimestä peilin polku. Kansio on 'kuvat' tai 'liput'. */
export function peiliKuvaPolku(tiedosto, kansio) {
  const pate = (tiedosto.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  // Peilissä SVG-liput on tallennettu PNG:nä, koska ne haetaan
  // valmiiksi skaalattuina Commonsin renderöijältä.
  return `${kansio}/${turvanimi(tiedosto.replace(/\.[^.]+$/, ''), pate === 'svg' ? 'png' : pate)}`;
}

/** Freesoundin tai archive.orgin osoitteesta peilin polku. */
export function peiliAaniPolku(url) {
  const loppu = url.split('/').pop() ?? 'aani.mp3';
  const pate = (loppu.split('.').pop() ?? 'mp3').toLowerCase();
  const tunnus = url.includes('freesound')
    ? `freesound-${url.match(/previews\/\d+\/(\d+)/)?.[1] ?? ''}`
    : `aporee-${url.match(/download\/([^/]+)/)?.[1] ?? ''}`;
  if (tunnus.endsWith('-')) return null;
  return `aanet/${turvanimi(tunnus, pate === 'mp3' ? 'mp3' : pate)}`;
}

// --- katkaisija ---------------------------------------------------------------
//
// Peiliä ei kannata kysellä loputtomiin, jos sitä ei ole vielä julkaistu
// tai se on nurin: silloin jokainen kuva maksaisi turhan epäonnistuneen
// pyynnön. Muutaman virheen jälkeen peili jätetään väliin koko istunnon
// ajaksi ja aineisto haetaan suoraan alkuperäisestä lähteestä. Seuraava
// välilehti kokeilee taas.
//
// Katkaisija on lähdekohtainen. Kuvat ja äänet ovat eri palvelimilla,
// eikä toisen kaatuminen kerro toisesta mitään: yhteinen laskuri sammutti
// kuvapeilin kolmen ääniongelman jälkeen, vaikka kuvapalvelin olisi ollut
// koko ajan kunnossa. Sama koskee tilannetta, jossa osa äänistä
// tarkoituksella jätetään peilaamatta — niiden 404:t eivät saa viedä
// kuvia mukanaan.

const VIRHERAJA = 3;
const LAJIT = ['kuvat', 'aanet'];
const poisAvain = (laji) => `matkakirja-peili-pois-${laji}`;

const virheita = { kuvat: 0, aanet: 0 };
const pois = { kuvat: false, aanet: false };
for (const laji of LAJIT) {
  try {
    pois[laji] = globalThis.sessionStorage?.getItem(poisAvain(laji)) === '1';
  } catch { /* selain voi kieltää tallennuksen — mennään oletuksella */ }
}

/** Onko peili tässä istunnossa käytössä tälle lajille? */
export function peiliKaytossa(laji = 'kuvat') {
  // Paikallisesti avattu tiedosto (file:) ei saa verkkoyhteyttä samalla
  // tavalla, mutta peili on tavallinen https-osoite ja toimii silti.
  return !pois[laji];
}

/** Peili petti: kolmannen virheen jälkeen se laji jätetään väliin. */
export function peiliPetti(laji = 'kuvat') {
  if (!LAJIT.includes(laji) || pois[laji]) return;
  virheita[laji] += 1;
  if (virheita[laji] < VIRHERAJA) return;
  pois[laji] = true;
  try { globalThis.sessionStorage?.setItem(poisAvain(laji), '1'); } catch { /* ks. yllä */ }
}

/** Vain testejä varten: nollaa katkaisijan tila. */
export function nollaaPeili() {
  for (const laji of LAJIT) {
    virheita[laji] = 0;
    pois[laji] = false;
    try { globalThis.sessionStorage?.removeItem(poisAvain(laji)); } catch { /* ks. yllä */ }
  }
}

// --- äänet --------------------------------------------------------------------

/**
 * Äänitteen osoite peilistä, jos se on peilattu. Vain Freesoundin ja
 * archive.orgin äänitteet ovat peilissä; muut (esim. omat assets-
 * tiedostot) palautuvat sellaisenaan.
 */
export function aaniOsoite(url) {
  if (!url || !peiliKaytossa('aanet')) return url;
  if (!/cdn\.freesound\.org|archive\.org/.test(url)) return url;
  // Valinta voi kantaa aloituskohdan (#alku=20&voima=1.5). Peilattu
  // nimi on laskettu ilman sitä, joten tunniste otetaan katkaistusta.
  const polku = peiliAaniPolku(url.split('#')[0]);
  return polku ? `${AANI_JUURI}${polku}` : url;
}

/**
 * Hakee äänitteen puskuriin peilistä ja putoaa tarvittaessa
 * alkuperäiseen lähteeseen. Palauttaa saman kuin fetch.
 */
export async function haeAani(url) {
  const peili = aaniOsoite(url);
  if (peili !== url) {
    const vastaus = await fetch(peili).catch(() => null);
    if (vastaus?.ok) return vastaus;
    peiliPetti('aanet');
  }
  return fetch(url);
}

/**
 * Onko osoite peilistä, ja mistä lajista? Kertoo sekä sen, kannattaako
 * varareittiä yrittää, että sen kummalle katkaisijalle virhe kuuluu.
 * Palauttaa 'kuvat', 'aanet' tai null.
 */
export function peilinLaji(osoite) {
  if (typeof osoite !== 'string') return null;
  if (osoite.startsWith(AANI_JUURI) && /\/aanet\//.test(osoite)) return 'aanet';
  if (osoite.startsWith(PEILI_JUURI)) return 'kuvat';
  return null;
}

/** Onko osoite peilistä? Kertoo, kannattaako varareittiä yrittää. */
export function onPeilista(osoite) {
  return peilinLaji(osoite) !== null;
}

// --- kuvan asettaminen --------------------------------------------------------

/**
 * Asettaa kuvan osoitteen niin, että peilin pettäessä siirrytään
 * varareitille. `onVirhe` kutsutaan vasta, kun kumpikin osoite on
 * epäonnistunut — silloin kuvaa ei oikeasti ole.
 *
 * Sama <img> uusiokäytetään galleriassa, joten kuuntelija tarkistaa
 * ennen toimintaansa, että kuva yhä yrittää juuri sitä osoitetta jolle
 * se asetettiin. Muuten vanha kuuntelija voisi pudottaa uuden kuvan
 * edellisen varareitille. Ketju on enintään kahden pyynnön mittainen
 * eikä voi jäädä silmukkaan.
 */
export function asetaKuva(kuva, osoite, vara, onVirhe = null) {
  const kohde = osoite ?? vara;
  if (!kohde) return;
  if (kuva.getAttribute('src') === kohde) return;

  const varalla = Boolean(vara) && vara !== kohde;
  const yha = (odotettu) => kuva.getAttribute('src') === odotettu;

  kuva.addEventListener('error', () => {
    if (!yha(kohde)) return;
    if (!varalla) { onVirhe?.(); return; }
    peiliPetti(peilinLaji(kohde) ?? 'kuvat');
    kuva.addEventListener('error', () => { if (yha(vara)) onVirhe?.(); }, { once: true });
    kuva.src = vara;
  }, { once: true });

  kuva.src = kohde;
}
