/*
 * Tarkistaa, ovatko matkakirjan "vanhat" kuvat oikeasti vanhoja.
 *
 *   node tools/tarkista-kuvaiat.mjs
 *
 * Miksi tämä on olemassa: Darfurin kortissa oli tiedosto nimeltä
 * "Sultan Ali Dinar.jpg", ja kuvateksti kertoi Darfurin viimeisestä
 * sulttaanista, joka kuoli 1916. Kuvassa oli mies rannekello ranteessa
 * ja nykyaikaiset silmälasit — Commonsin tiedoissa vuosi 2016 ja
 * kuvaus "The Official Portrait of the 30TH Sultan of Darfur". Kyseessä
 * oli nykyinen arvonimen haltija, ei se sulttaani josta teksti kertoi.
 *
 * Tiedostonimi ei siis kerro kuvan ikää. Metatieto kertoo, ja se on
 * ilmaista kysyä. Työkalu hakee jokaiselle vanhaksi merkitylle kuvalle
 * Commonsin DateTimeOriginal-kentän ja huomauttaa, jos vuosi on
 * uudempi kuin raja — tai jos vuotta ei ole lainkaan, jolloin sitä ei
 * voi tarkistaa koneella ja se on katsottava itse.
 *
 * Työkalu ei korjaa mitään. Se kertoo, mitkä kuvat pitää katsoa.
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Noden fetch ei lue HTTPS_PROXYa; ks. tools/hae-radiot.mjs.
if (!process.env.NODE_USE_ENV_PROXY && (process.env.HTTPS_PROXY || process.env.https_proxy)) {
  const ajo = spawnSync(process.execPath, [fileURLToPath(import.meta.url), ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1', NODE_NO_WARNINGS: '1' },
  });
  process.exit(ajo.status ?? 1);
}

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const nuku = (ms) => new Promise((r) => { setTimeout(r, ms); });

/*
 * Isoisän matka on 1920-luvulla, ja kortin vanha kuva saa olla siltä
 * ajalta tai vanhempi. Raja on väljä tarkoituksella: 1950-luvun kuva
 * on yhä uskottavasti "vanha valokuva", mutta sitä uudempi ei ole.
 */
const RAJA = 1960;

const { EUROPE_VALOKUVAT } = await import('../js/packs/europe-valokuvat.js');
const { AFRICA_VALOKUVAT } = await import('../js/packs/africa-valokuvat.js');

const kuvat = [];
for (const [lauta, taulu] of [['europe', EUROPE_VALOKUVAT], ['africa', AFRICA_VALOKUVAT]]) {
  for (const [kaupunki, v] of Object.entries(taulu)) {
    if (v.tiedosto) kuvat.push({ lauta, kaupunki, kohta: 'vanha', tiedosto: v.tiedosto, vuosi: v.vuosi ?? '', selite: v.selite ?? '' });
    for (const [i, k] of (v.lisat ?? []).entries()) {
      if (k.tiedosto) kuvat.push({ lauta, kaupunki, kohta: `lisa${i + 1}`, tiedosto: k.tiedosto, vuosi: k.vuosi ?? '', selite: k.selite ?? '' });
    }
  }
}
console.log(`${kuvat.length} vanhaksi merkittyä kuvaa\n`);

/** Commonsin metatiedot nipuittain: viisikymmentä nimeä per pyyntö. */
async function tiedot(nimet) {
  const ulos = new Map();
  for (let i = 0; i < nimet.length; i += 50) {
    const pala = nimet.slice(i, i + 50).map((t) => `File:${t}`);
    const osoite = 'https://commons.wikimedia.org/w/api.php?action=query'
      + '&prop=imageinfo&iiprop=size|extmetadata&iiextmetadatafilter=DateTimeOriginal|ImageDescription|LicenseShortName'
      + `&titles=${encodeURIComponent(pala.join('|'))}&format=json`;
    let data = null;
    for (let y = 0; y < 5 && !data; y++) {
      try {
        const vastaus = await fetch(osoite, { headers: { 'user-agent': 'Matkakirja/1.0 (opetuspeli)' } });
        if (vastaus.ok) data = await vastaus.json();
        else if (vastaus.status !== 429 && vastaus.status < 500) break;
      } catch { /* uudelleen */ }
      if (!data) await nuku(2500 * (y + 1));
    }
    if (!data) continue;
    const polku = new Map();
    for (const r of data?.query?.normalized ?? []) polku.set(r.from, r.to);
    for (const r of data?.query?.redirects ?? []) polku.set(r.from, r.to);
    const sivut = new Map();
    for (const s of Object.values(data?.query?.pages ?? {})) sivut.set(s.title, s);
    for (const nimi of pala) {
      let avain = nimi;
      for (let k = 0; k < 4 && polku.has(avain); k++) avain = polku.get(avain);
      const info = sivut.get(avain)?.imageinfo?.[0];
      ulos.set(nimi.replace(/^File:/, ''), info ?? null);
    }
    await nuku(500);
  }
  return ulos;
}

const siivoa = (s) => (s?.value ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

/*
 * Vuosiluku merkkijonosta. Commons kirjaa päiväyksen kymmenellä eri
 * tavalla ("1916-11-06", "circa 1900", "1 November 2019, 11:24"), ja
 * ainoa yhteinen nimittäjä on neljä peräkkäistä numeroa. Otetaan
 * suurin: "1910s photograph digitised in 2018" on vanha kuva, mutta
 * "2016" ilman muuta vuotta ei ole.
 */
function vuosiluku(teksti) {
  const osumat = [...String(teksti).matchAll(/\b(1[5-9]\d\d|20\d\d)\b/g)].map((m) => Number(m[1]));
  return osumat.length ? Math.max(...osumat) : null;
}

const meta = await tiedot([...new Set(kuvat.map((k) => k.tiedosto))]);

const epailyt = [];
for (const k of kuvat) {
  const info = meta.get(k.tiedosto);
  if (!info) { epailyt.push({ ...k, syy: 'tiedostoa ei löydy Commonsista' }); continue; }
  const e = info.extmetadata ?? {};
  const pvm = siivoa(e.DateTimeOriginal);
  const kuvaus = siivoa(e.ImageDescription);
  const vuosi = vuosiluku(pvm);
  if (vuosi === null) {
    epailyt.push({ ...k, syy: 'ei päiväystä Commonsissa — katsottava itse', kuvaus: kuvaus.slice(0, 200) });
  } else if (vuosi > RAJA) {
    epailyt.push({ ...k, syy: `Commons sanoo ${vuosi}`, pvm, kuvaus: kuvaus.slice(0, 200), leveys: info.width });
  }
}

for (const e of epailyt) {
  console.log(`${e.kaupunki}/${e.kohta}  ${e.syy}`);
  console.log(`    tiedosto: ${e.tiedosto}`);
  console.log(`    kortissa: ${e.vuosi || '(ei vuotta)'} — ${e.selite.slice(0, 110)}`);
  if (e.kuvaus) console.log(`    Commons:  ${e.kuvaus}`);
  console.log();
}

writeFileSync(join(JUURI, 'tools', 'kuva-epailyt.json'), `${JSON.stringify(epailyt, null, 1)}\n`);
console.log(`${epailyt.length}/${kuvat.length} kuvaa tarkistettavaksi. Lista: tools/kuva-epailyt.json`);
