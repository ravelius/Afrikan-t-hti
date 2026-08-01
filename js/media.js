// Peili: pelin kaikista repon ulkopuolelta ladattavista kuvista ja
// äänistä on oma kopio yhdessä paikassa (github.com/ravelius/Matkakirja-media).
// Peli hakee aineiston ensisijaisesti sieltä, jottei yksi kaatunut
// palvelin tai poistettu tiedosto riko peliä kesken matkan. Alkuperäinen
// osoite jää varareitiksi.
//
// Peilin polku LASKETAAN samalla säännöllä kuin peilaustyökalussa
// (tools/peilaa-media.mjs). Erillistä hakemistotiedostoa ei siis tarvita
// eikä 298 tiedostonimeä toisteta pelin koodissa. tests/media.test.mjs
// vartioi, etteivät säännöt pääse eriytymään: se tarkistaa jokaisen
// paketeissa mainitun tiedoston peilin manifestia vasten.

export const PEILI_JUURI = 'https://ravelius.github.io/Matkakirja-media/';

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

const POIS_AVAIN = 'matkakirja-peili-pois';
const VIRHERAJA = 3;

let virheita = 0;
let peiliPois = false;
try {
  peiliPois = globalThis.sessionStorage?.getItem(POIS_AVAIN) === '1';
} catch { /* selain voi kieltää tallennuksen — mennään oletuksella */ }

/** Onko peili tässä istunnossa käytössä? */
export function peiliKaytossa() {
  // Paikallisesti avattu tiedosto (file:) ei saa verkkoyhteyttä samalla
  // tavalla, mutta peili on tavallinen https-osoite ja toimii silti.
  return !peiliPois;
}

/** Peili petti: kolmannen virheen jälkeen se jätetään väliin. */
export function peiliPetti() {
  if (peiliPois) return;
  virheita += 1;
  if (virheita < VIRHERAJA) return;
  peiliPois = true;
  try { globalThis.sessionStorage?.setItem(POIS_AVAIN, '1'); } catch { /* ks. yllä */ }
}

/** Vain testejä varten: nollaa katkaisijan tila. */
export function nollaaPeili() {
  virheita = 0;
  peiliPois = false;
  try { globalThis.sessionStorage?.removeItem(POIS_AVAIN); } catch { /* ks. yllä */ }
}

// --- äänet --------------------------------------------------------------------

/**
 * Äänitteen osoite peilistä, jos se on peilattu. Vain Freesoundin ja
 * archive.orgin äänitteet ovat peilissä; muut (esim. omat assets-
 * tiedostot) palautuvat sellaisenaan.
 */
export function aaniOsoite(url) {
  if (!url || !peiliKaytossa()) return url;
  if (!/cdn\.freesound\.org|archive\.org/.test(url)) return url;
  // Valinta voi kantaa aloituskohdan (#alku=20&voima=1.5). Peilattu
  // nimi on laskettu ilman sitä, joten tunniste otetaan katkaistusta.
  const polku = peiliAaniPolku(url.split('#')[0]);
  return polku ? `${PEILI_JUURI}${polku}` : url;
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
    peiliPetti();
  }
  return fetch(url);
}

/** Onko osoite peilistä? Kertoo, kannattaako varareittiä yrittää. */
export function onPeilista(osoite) {
  return typeof osoite === 'string' && osoite.startsWith(PEILI_JUURI);
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
    peiliPetti();
    kuva.addEventListener('error', () => { if (yha(vara)) onVirhe?.(); }, { once: true });
    kuva.src = vara;
  }, { once: true });

  kuva.src = kohde;
}
