// Etsii jokaiselle kaupungille aidosti siinä kaupungissa tehdyn
// kenttä-äänityksen radio aporeesta.
//
// Pelin taustaäänet ovat tähän asti tulleet maisematyypin arvontakorista:
// 22 Euroopan kaupunkia jakoi kolme "kaupunki"-ääntä, joten Praha ja
// Lissabon kuulostivat samalta. Aporeen äänitteillä on koordinaatit,
// joten oikeasta paikasta tehdyn äänityksen voi hakea luotettavasti —
// ei nimen perusteella arvaten vaan sijainnin mukaan.
//
//   node tools/hae-kaupunkiaanet.mjs [--maanosa europe] [--ulos tiedosto.json]
//
// Tulos on JSON, jonka voi lukea aani-ehdokkaat.js:ään. Työkalu ei
// kirjoita pelin tiedostoja itse: valinta on omistajan, ja ehdokkaat
// kuunnellaan äänistudiossa.

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const AGENTTI = 'Matkakirja/1.0 (https://github.com/ravelius/Matkakirja)';
const arg = (nimi, oletus) => {
  const i = process.argv.indexOf(nimi);
  return i > 0 ? process.argv[i + 1] : oletus;
};
const MAANOSA = arg('--maanosa', 'europe');
const ULOS = arg('--ulos', join(JUURI, `../kaupunkiaanet-${MAANOSA}.json`));

const nuku = (s) => execFileSync('sleep', [String(s)]);
const hae = (url) => JSON.parse(execFileSync('curl',
  ['-sSL', '--max-time', '60', '--retry', '2', '--retry-delay', '3', '-A', AGENTTI, url],
  { maxBuffer: 1e8 }).toString());

// --- kaupungit ---------------------------------------------------------------

const pack = Object.values(await import(join(JUURI, `js/packs/${MAANOSA}.js`)))
  .find((v) => v?.cities);
const kaupungit = pack.cities.map((c) => ({
  id: c.id, nimi: c.name, wiki: c.wiki ?? c.name, tyyppi: c.ambience ?? null,
}));
console.log(`${kaupungit.length} kaupunkia paketissa ${MAANOSA}`);

/** Kaupungin oikeat koordinaatit Wikipediasta. */
function koordinaatit(otsikot) {
  const ulos = new Map();
  for (const kieli of ['fi', 'en']) {
    const puuttuu = otsikot.filter((t) => !ulos.has(t));
    if (!puuttuu.length) break;
    for (let i = 0; i < puuttuu.length; i += 20) {
      const era = puuttuu.slice(i, i + 20);
      let d;
      try {
        d = hae(`https://${kieli}.wikipedia.org/w/api.php?format=json&action=query`
          + '&prop=coordinates&redirects=1&titles=' + encodeURIComponent(era.join('|')));
      } catch { nuku(5); continue; }
      const alkuun = new Map([
        ...(d.query?.normalized ?? []).map((n) => [n.to, n.from]),
        ...(d.query?.redirects ?? []).map((r) => [r.to, r.from]),
      ]);
      const juurelle = (nimi) => {
        let n = nimi;
        for (let k = 0; k < 5 && alkuun.has(n); k += 1) n = alkuun.get(n);
        return n;
      };
      for (const sivu of Object.values(d.query?.pages ?? {})) {
        const co = sivu.coordinates?.[0];
        if (co) ulos.set(juurelle(sivu.title), { lat: co.lat, lon: co.lon });
      }
      nuku(2);
    }
  }
  return ulos;
}

const paikat = koordinaatit([...new Set(kaupungit.map((c) => c.wiki))]);
console.log(`koordinaatit löytyi ${paikat.size}/${kaupungit.length}`);

// --- aporee-haku -------------------------------------------------------------

/**
 * Äänitykset annetun pisteen ympäriltä. Säde asteina: 0,08° on noin
 * yhdeksän kilometriä pohjois–eteläsuunnassa, eli kaupungin kokoinen.
 * Seutukohteille (Lappi, Alpit) tarvitaan väljempi haku.
 */
function aanitykset(lat, lon, sade) {
  const q = `collection:(radio-aporee-maps)`
    + ` AND latitude:[${(lat - sade).toFixed(4)} TO ${(lat + sade).toFixed(4)}]`
    + ` AND longitude:[${(lon - sade / Math.cos(lat * Math.PI / 180)).toFixed(4)}`
    + ` TO ${(lon + sade / Math.cos(lat * Math.PI / 180)).toFixed(4)}]`;
  const url = 'https://archive.org/advancedsearch.php?q=' + encodeURIComponent(q)
    + '&fl[]=identifier&fl[]=title&fl[]=latitude&fl[]=longitude&fl[]=licenseurl'
    + '&fl[]=creator&fl[]=date&rows=60&output=json';
  try {
    return hae(url).response?.docs ?? [];
  } catch {
    return [];
  }
}

/** Vapaa lisenssi? Aporeessa on CC BY, CC BY-SA, CC BY-NC ja public domain. */
const vapaa = (url) => !url || /creativecommons\.org|publicdomain/.test(url);

// Sisätilat, konsertit ja puhe eivät kelpaa taustaääneksi: peli tarvitsee
// paikan yleisen äänimaiseman, ei tapahtumaa.
const EI_KELPAA = /(concert|konzert|rehearsal|interview|radio show|lecture|church service|mass |museum|inside|indoor|studio|test |mic test)/i;
// Nämä kertovat juuri siitä, mitä haetaan.
const HYVA = /(street|square|market|plaza|piazza|platz|plein|torg|tori|harbour|harbor|port|quay|station|tram|bridge|park|old town|centre|center|city|downtown|avenue|boulevard|promenade)/i;

const tulos = [];
for (const c of kaupungit) {
  const paikka = paikat.get(c.wiki);
  if (!paikka) {
    tulos.push({ ...c, virhe: 'koordinaatteja ei löytynyt' });
    console.log(`  ${c.nimi.padEnd(14)} — koordinaatteja ei löytynyt`);
    continue;
  }
  // Seudut ja vuoristot tarvitsevat laajemman haun kuin kaupunki.
  const laaja = /lappi|alpit|kreeta|sisilia|islanti|tromssa/i.test(c.id);
  let osumat = [];
  for (const sade of laaja ? [0.5, 1.5] : [0.08, 0.25]) {
    osumat = aanitykset(paikka.lat, paikka.lon, sade).filter((d) => vapaa(d.licenseurl));
    if (osumat.length) break;
    nuku(2);
  }
  const pisteet = (d) => {
    const t = String(d.title ?? '');
    if (EI_KELPAA.test(t)) return -1;
    return HYVA.test(t) ? 2 : 1;
  };
  const parhaat = osumat
    .map((d) => ({ ...d, pisteet: pisteet(d) }))
    .filter((d) => d.pisteet > 0)
    .sort((a, b) => b.pisteet - a.pisteet)
    .slice(0, 6);
  tulos.push({
    ...c,
    lat: paikka.lat,
    lon: paikka.lon,
    loytyi: osumat.length,
    ehdokkaat: parhaat.map((d) => ({
      tunnus: d.identifier,
      otsikko: String(d.title ?? '').slice(0, 90),
      tekija: d.creator ?? null,
      lisenssi: d.licenseurl ?? null,
      etaisyysKm: Math.round(Math.hypot(
        (Number(d.latitude) - paikka.lat) * 111,
        (Number(d.longitude) - paikka.lon) * 111 * Math.cos(paikka.lat * Math.PI / 180),
      ) * 10) / 10,
    })),
  });
  console.log(`  ${c.nimi.padEnd(14)} ${String(osumat.length).padStart(3)} osumaa → ${parhaat.length} ehdokasta`);
  nuku(2);
}

writeFileSync(ULOS, JSON.stringify(tulos, null, 1));
const ilman = tulos.filter((t) => !t.ehdokkaat?.length);
console.log(`\nKirjoitettu ${ULOS}`);
console.log(`Ehdokkaita löytyi ${tulos.length - ilman.length}/${tulos.length} kaupungille.`);
if (ilman.length) {
  console.log('Ilman ehdokkaita:');
  for (const t of ilman) console.log(`  ✗ ${t.nimi}${t.virhe ? ` (${t.virhe})` : ''}`);
}
