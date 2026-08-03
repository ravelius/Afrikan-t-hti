/*
 * Onko jokainen valokuva oikeasti olemassa Commonsissa?
 *
 *   node tools/tarkista-kuvatiedostot.mjs [lauta ...]
 *
 * --- miksi oma työkalu, kun tarkista-kuvakoot.mjs jo kysyy Commonsilta ---
 *
 * Koska se ei kysy kaikista. Se kävi läpi vain kaupungin pääkuvan ja
 * `uusi`-kuvan — ei `lisat`-taulukkoa, johon kuvapinon muut kuvat on
 * kerätty. Marseillen kuva 2/4 oli rikki kuukausia, ja tarkistus meni
 * silti läpi joka kerta: se ei koskenut siihen kuvaan lainkaan.
 *
 * Tästä opittu: tarkistuksen kattavuus pitää lukea rakenteesta, ei
 * muistaa. Tämä työkalu kerää tiedostonimet KAIKISTA kentistä, joissa
 * niitä voi olla, ja kaatuu jos taulusta löytyy tuntematon muoto.
 *
 * Rikkinäinen nimi tarkoittaa käytännössä aina uudelleennimeämistä:
 * Commons siirtää tiedoston ja jättää ohjauksen, mutta ohjaus ei koske
 * Special:FilePath-osoitetta samalla tavalla kuin sivua. Siksi
 * puuttuvalle nimelle haetaan myös uusi nimi lokista.
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');

const TAULUT = {
  europe: ['europe-valokuvat.js', 'EUROPE_VALOKUVAT'],
  africa: ['africa-valokuvat.js', 'AFRICA_VALOKUVAT'],
  asia: ['asia-valokuvat.js', 'ASIA_VALOKUVAT'],
};

const pyydetyt = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const laudat = pyydetyt.length ? pyydetyt : Object.keys(TAULUT);

const nuku = (ms) => new Promise((r) => { setTimeout(r, ms); });

async function hae(osoite, yrityksia = 6) {
  for (let i = 0; i < yrityksia; i++) {
    const vastaus = await fetch(osoite, { headers: { 'user-agent': 'Matkakirja/1.0 (opetuspeli)' } });
    if (vastaus.ok) return vastaus.json();
    if (vastaus.status !== 429) { console.log(`  HTTP ${vastaus.status}`); return null; }
    await nuku(3000 * (i + 1));
  }
  return null;
}

// --- kerää tiedostonimet -------------------------------------------------------

/*
 * Kuvakohta on mikä tahansa olio, jossa on `tiedosto`. Niitä on
 * kolmessa paikassa: kaupungin juuressa (vanha vedos), `uusi`-oliossa
 * ja `lisat`-taulukossa. Tuntematon muoto on virhe eikä ohitus — juuri
 * hiljainen ohitus jätti lisat-kuvat tarkistamatta.
 */
const kuvat = [];
for (const lauta of laudat) {
  const [tiedostoNimi, vienti] = TAULUT[lauta] ?? [];
  if (!vienti) throw new Error(`tuntematon lauta: ${lauta}`);
  const moduuli = await import(`file://${join(JUURI, 'js/packs', tiedostoNimi)}`);
  const taulu = moduuli[vienti];
  for (const [kaupunki, v] of Object.entries(taulu)) {
    const lisaa = (kohta, o) => {
      if (!o?.tiedosto) throw new Error(`${lauta}/${kaupunki}/${kohta}: ei tiedostonimeä`);
      kuvat.push({ lauta, kaupunki, kohta, tiedosto: o.tiedosto });
    };
    if (v.tiedosto) lisaa('vanha', v);
    if (v.uusi) lisaa('uusi', v.uusi);
    (v.lisat ?? []).forEach((o, i) => lisaa(`lisä ${i + 1}`, o));
  }
}

const nimet = [...new Set(kuvat.map((k) => k.tiedosto))];
console.log(`${kuvat.length} kuvakohtaa, ${nimet.length} eri tiedostoa (${laudat.join(', ')})\n`);

// --- onko olemassa -------------------------------------------------------------

/*
 * `missing`-lippu on tässä se mitä kysytään, ei kuvan koko. Nimi voi
 * myös ohjautua toiseen: silloin tiedosto on olemassa, mutta peli
 * pyytää sitä vanhalla nimellä ja saa tyhjän. Ohjaus on siis yhtä lailla
 * korjattava kuin puuttuminen.
 */
const tila = new Map();
for (let i = 0; i < nimet.length; i += 50) {
  const pala = nimet.slice(i, i + 50);
  const data = await hae('https://commons.wikimedia.org/w/api.php?action=query'
    + '&prop=imageinfo&iiprop=size&redirects=1'
    + `&titles=${encodeURIComponent(pala.map((t) => `File:${t}`).join('|'))}&format=json`);
  if (!data) continue;
  const polku = new Map();
  for (const r of data?.query?.normalized ?? []) polku.set(r.from, r.to);
  for (const r of data?.query?.redirects ?? []) polku.set(r.from, r.to);
  const sivut = new Map();
  for (const sivu of Object.values(data?.query?.pages ?? {})) sivut.set(sivu.title, sivu);
  for (const nimi of pala) {
    let avain = `File:${nimi}`;
    const ketju = [];
    for (let k = 0; k < 4 && polku.has(avain); k++) { avain = polku.get(avain); ketju.push(avain); }
    const sivu = sivut.get(avain);
    tila.set(nimi, {
      olemassa: !!sivu?.imageinfo?.[0],
      // Normalisointi (alaviiva ↔ väli) ei ole ohjaus; vain oikea siirto on.
      ohjaus: ketju.length && ketju.at(-1).replace(/^File:/, '') !== nimi
        ? ketju.at(-1).replace(/^File:/, '') : null,
    });
  }
  process.stdout.write(`  ${Math.min(i + 50, nimet.length)}/${nimet.length}\r`);
  await nuku(600);
}

// --- raportti ------------------------------------------------------------------

const rikki = kuvat.filter((k) => !tila.get(k.tiedosto)?.olemassa);
const siirtyneet = kuvat.filter((k) => tila.get(k.tiedosto)?.ohjaus);

console.log(`\n${rikki.length} rikkinäistä kuvaa:\n`);
for (const k of rikki) {
  console.log(`  ${k.lauta}/${k.kaupunki} (${k.kohta})`);
  console.log(`    ${k.tiedosto}`);
}
if (siirtyneet.length) {
  console.log(`\n${siirtyneet.length} uudelleennimettyä (toimii, mutta kannattaa päivittää):\n`);
  for (const k of siirtyneet) {
    console.log(`  ${k.lauta}/${k.kaupunki} (${k.kohta})`);
    console.log(`    ${k.tiedosto}`);
    console.log(`    -> ${tila.get(k.tiedosto).ohjaus}`);
  }
}
if (!rikki.length && !siirtyneet.length) console.log('Kaikki kuvat löytyvät.');
process.exit(rikki.length ? 1 : 0);
