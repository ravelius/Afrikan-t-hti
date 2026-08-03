/*
 * Hakee kaupunkigallerian kuvat ja kirjoittaa niille suomenkieliset
 * kuvatekstit.
 *
 *   node tools/hae-kaupunkikuvat.mjs [--lauta vanhamaailma] [--kuiva]
 *   node tools/hae-kaupunkikuvat.mjs --kaupunki dubrovnik --kuiva
 *
 * Omistajan toive: jokaiseen kaupunkiin 10–20 kuvaa ja kaikkiin
 * kuvatekstit; karttakuvat pois.
 *
 * --- mistä kuvat tulevat ---
 *
 * 1. Wikimedia Commons -KATEGORIA, ei artikkelin kuvat. Artikkelissa on
 *    tyypillisesti 3–10 kuvaa, kategoriassa satoja: Dubrovnikin
 *    kategoria täytti 500 tiedoston hakurajan. Sama lisenssi ja sama
 *    peilausputki kuin nykyisillä kuvilla.
 * 2. Library of Congress täydentää (omistajan päätös). Photochrom-
 *    kokoelma on vuosilta 1890–1910 eli juuri isoisän aikaa, public
 *    domain, eikä vaadi avainta.
 * 3. Europeana kolmantena, jos avain on ympäristössä. Se on lisä eikä
 *    edellytys, mutta ohitus SANOTAAN ÄÄNEEN: hiljainen ohitus näytti
 *    aiemmin siltä, että Europeanasta ei vain löytynyt mitään.
 *
 *    Avain luetaan muuttujasta EUROPEANA_API (myös vanha nimi
 *    EUROPEANA_AVAIN kelpaa). Avainta EI kirjoiteta tänne eikä
 *    tulosteeseen: se annetaan ympäristöstä, ja GitHubissa se tulee
 *    repon salaisuuksista (.github/workflows/kuvahaku.yml).
 *
 * --- mitä EI oteta ---
 *
 * Kartat, vaakunat, liput, logot ja kaaviot. Ne ovat kaupunkiartikkelien
 * kuvastossa yleisiä ja täyttäisivät gallerian. Karsinta katsoo sekä
 * tiedostonimeä että tiedostotyyppiä: SVG on käytännössä aina kartta,
 * lippu tai vaakuna.
 *
 * --- kuvatekstit ---
 *
 * Teksti kirjoitetaan Commonsin kuvauksen POHJALTA suomeksi (omistajan
 * linjaus), ei kopioida sellaisenaan: kuvaukset ovat useimmiten
 * englanniksi ja kömpelöitä. Tämä työkalu kerää raaka-aineen —
 * kuvauksen, vuoden, tekijän ja lisenssin — tiedostoon, josta tekstit
 * kirjoitetaan. Faktoja ei keksitä: jos kuvauksesta ei saa selvää, teksti
 * kertoo vain sen mitä kuvassa on ja mistä se on.
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const arvo = (nimi, oletus) => {
  const i = process.argv.indexOf(nimi);
  return i >= 0 ? process.argv[i + 1] : oletus;
};
const kuiva = process.argv.includes('--kuiva');
const vainKaupunki = arvo('--kaupunki', null);
const lautaTunnus = arvo('--lauta', 'vanhamaailma');
const MAARA = Number(arvo('--maara', 16));

/*
 * Pois karsittavat. Osumat tiedostonimeen, isot ja pienet kirjaimet
 * sekaisin. Lista on tahallaan laaja: yksi turha kuva gallerian seassa
 * on pahempi kuin yksi puuttuva.
 */
const POIS = [
  'map', 'karte', 'mapa', 'kartta', 'kaart', 'carte', 'mappa', 'plan',
  'locator', 'location', 'orthographic', 'topograph', 'relief',
  'coat of arms', 'coa ', 'wappen', 'escudo', 'blason', 'stemma',
  'flag', 'flagge', 'bandera', 'drapeau', 'lippu',
  'seal of', 'logo', 'emblem', 'insignia', 'banner',
  'diagram', 'chart', 'graph', 'timeline', 'population',
  'satellite', 'landsat', 'sentinel',
];

/** Kelpaako tiedosto galleriaan? */
export function kelpaaKuva(nimi) {
  const matala = nimi.toLowerCase();
  // SVG on käytännössä aina kartta, lippu, vaakuna tai kaavio.
  if (/\.svg$/.test(matala)) return false;
  if (!/\.(jpe?g|png|tiff?)$/.test(matala)) return false;
  return !POIS.some((sana) => matala.includes(sana));
}

const nuku = (ms) => new Promise((r) => { setTimeout(r, ms); });

async function hae(osoite, yrityksia = 6) {
  for (let i = 0; i < yrityksia; i++) {
    const vastaus = await fetch(osoite, {
      headers: { 'user-agent': 'Matkakirja/1.0 (opetuspeli)' },
    });
    if (vastaus.ok) return vastaus.json();
    if (vastaus.status !== 429) {
      console.log(`  HTTP ${vastaus.status}`);
      return null;
    }
    await nuku(3000 * (i + 1));
  }
  return null;
}

/** Commons-kategorian tiedostot. Kategoria arvataan artikkelin nimestä. */
async function commonsKategoria(nimi) {
  const osoite = 'https://commons.wikimedia.org/w/api.php?action=query'
    + `&list=categorymembers&cmtitle=Category:${encodeURIComponent(nimi)}`
    + '&cmtype=file&cmlimit=500&format=json';
  const data = await hae(osoite);
  return (data?.query?.categorymembers ?? []).map((x) => x.title);
}

/** Tiedostojen tiedot: kuvaus, tekijä, lisenssi, koko, osoite. */
async function tiedostotiedot(tiedostot) {
  const ulos = [];
  // API ottaa 50 nimeä kerralla.
  for (let i = 0; i < tiedostot.length; i += 50) {
    const pala = tiedostot.slice(i, i + 50);
    const osoite = 'https://commons.wikimedia.org/w/api.php?action=query'
      + '&prop=imageinfo&iiprop=url|size|extmetadata|mime'
      + `&iiurlwidth=1200&titles=${encodeURIComponent(pala.join('|'))}&format=json`;
    const data = await hae(osoite);
    for (const sivu of Object.values(data?.query?.pages ?? {})) {
      const tieto = sivu.imageinfo?.[0];
      if (!tieto) continue;
      const meta = tieto.extmetadata ?? {};
      const puhdista = (teksti) => (teksti ?? '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&[a-z]+;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      ulos.push({
        tiedosto: sivu.title.replace(/^File:/, ''),
        leveys: tieto.width,
        korkeus: tieto.height,
        kuvaus: puhdista(meta.ImageDescription?.value).slice(0, 600),
        tekija: puhdista(meta.Artist?.value).slice(0, 120),
        lisenssi: puhdista(meta.LicenseShortName?.value),
        vuosi: puhdista(meta.DateTimeOriginal?.value).slice(0, 40),
      });
    }
    await nuku(400);
  }
  return ulos;
}

/*
 * Vapaa lisenssi. Peliin kelpaa vain se, mitä saa peilata ja näyttää:
 * public domain ja CC-lisenssit ilman ND-ehtoa. ND kieltää muokkaukset,
 * ja peili skaalaa kuvat pienemmiksi.
 */
function vapaaLisenssi(teksti) {
  const t = (teksti ?? '').toLowerCase();
  if (!t) return false;
  if (t.includes('nd')) return false;
  return /public domain|cc0|cc by|cc-by|attribution|gfdl/.test(t);
}

/*
 * Europeana kokoaa Euroopan museoiden, kirjastojen ja arkistojen
 * aineiston yhteen. Se täydentää Commonsia siellä, missä paikallinen
 * museo on digitoinut kokoelmansa mutta ei ole vienyt sitä Commonsiin.
 *
 * reusability=open rajaa suoraan siihen, mitä saa käyttää ja muokata;
 * ilman sitä tuloksissa on paljon aineistoa, jota ei saa näyttää.
 */
const EUROPEANA_AVAIN = process.env.EUROPEANA_API ?? process.env.EUROPEANA_AVAIN ?? null;

async function europeana(nimi) {
  if (!EUROPEANA_AVAIN) return [];
  const osoite = 'https://api.europeana.eu/record/v2/search.json'
    + `?wskey=${encodeURIComponent(EUROPEANA_AVAIN)}`
    + `&query=${encodeURIComponent(nimi)}`
    + '&qf=TYPE:IMAGE&reusability=open&media=true&rows=30&profile=rich';
  const data = await hae(osoite);
  return (data?.items ?? [])
    .filter((x) => x.edmIsShownBy?.length || x.edmPreview?.length)
    .map((x) => ({
      tiedosto: null,
      osoite: (x.edmIsShownBy ?? x.edmPreview)[0],
      kuvaus: (x.dcDescription?.[0] ?? x.title?.[0] ?? '').slice(0, 600),
      vuosi: (x.year ?? [])[0] ?? '',
      tekija: (x.dcCreator ?? []).join(', ').slice(0, 120),
      lisenssi: `Europeana: ${(x.rights ?? []).join(' ') || 'open'}`,
      lahde: 'europeana',
    }));
}

/** Library of Congressin kuvat kaupungista. Ei vaadi avainta. */
async function loc(nimi) {
  const osoite = `https://www.loc.gov/photos/?q=${encodeURIComponent(nimi)}`
    + '&fo=json&c=25&at=results';
  const data = await hae(osoite);
  return (data?.results ?? [])
    .filter((x) => x.image_url?.length)
    .map((x) => ({
      tiedosto: null,
      osoite: x.image_url[x.image_url.length - 1],
      kuvaus: (x.description?.[0] ?? x.title ?? '').slice(0, 600),
      vuosi: x.date ?? '',
      tekija: (x.contributor ?? []).join(', ').slice(0, 120),
      lisenssi: 'Library of Congress (PD)',
      lahde: 'loc',
    }));
}

// --- ajo ----------------------------------------------------------------------

const { PACKS } = await import('../js/pack.js');
const pack = PACKS.find((p) => p.id === lautaTunnus);
if (!pack) throw new Error(`tuntematon lauta: ${lautaTunnus}`);

const kohteet = pack.cities.filter((c) => (!vainKaupunki || c.id === vainKaupunki) && c.wiki);
console.log(`${kohteet.length} kaupunkia, tavoite ${MAARA} kuvaa kussakin`);
/*
 * Sanotaan ääneen. Hiljainen ohitus on tässä projektissa toistuvin
 * virhe: työkalu joka ei erota "ei löytynyt" ja "ei kysytty" toisistaan
 * valehtelee onnistumisesta.
 */
console.log(EUROPEANA_AVAIN
  ? 'Europeana: avain löytyi, haku käytössä\n'
  : 'Europeana: EI AVAINTA ympäristössä (EUROPEANA_API) — vaihe ohitetaan\n');

const kansio = join(JUURI, 'tools', 'kuva-aineisto');
if (!kuiva && !existsSync(kansio)) mkdirSync(kansio, { recursive: true });

const yhteenveto = [];
for (const c of kohteet) {
  const nimet = (await commonsKategoria(c.wiki)).filter((t) => kelpaaKuva(t));
  const tiedot = (await tiedostotiedot(nimet.slice(0, 60)))
    .filter((t) => vapaaLisenssi(t.lisenssi))
    // Pystykuvat ja pikkukuvat pois: galleria on vaakasuuntainen.
    .filter((t) => t.leveys >= 800 && t.leveys >= t.korkeus * 0.9);
  const locKuvat = tiedot.length >= MAARA ? [] : await loc(c.name);
  const euKuvat = (tiedot.length + locKuvat.length) >= MAARA ? [] : await europeana(c.name);
  const kaikki = [...tiedot, ...locKuvat, ...euKuvat].slice(0, MAARA);
  yhteenveto.push({ id: c.id, nimi: c.name, wiki: c.wiki, kuvia: kaikki.length });
  console.log(`${c.id.padEnd(16)} commons ${tiedot.length.toString().padStart(3)} `
    + `+ loc ${locKuvat.length.toString().padStart(2)} `
    + `+ eur ${euKuvat.length.toString().padStart(2)} = ${kaikki.length}`);
  if (!kuiva) {
    writeFileSync(join(kansio, `${c.id}.json`), `${JSON.stringify(kaikki, null, 1)}\n`);
  }
  await nuku(500);
}

const vajaat = yhteenveto.filter((x) => x.kuvia < 10);
console.log(`\n${yhteenveto.length} kaupunkia, keskimäärin `
  + `${(yhteenveto.reduce((a, b) => a + b.kuvia, 0) / Math.max(1, yhteenveto.length)).toFixed(1)} kuvaa`);
console.log(`alle kymmenen kuvan kaupunkeja: ${vajaat.length}`);
if (vajaat.length) console.log(vajaat.map((x) => `${x.id}(${x.kuvia})`).join(' '));
