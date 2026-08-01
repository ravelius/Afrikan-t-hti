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
import { writeFileSync } from 'node:fs';
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

/**
 * Kaupunkien koordinaatit Wikipediasta, puuttuvat Wikidatasta.
 *
 * Kaksi sudenkuoppaa, joihin ensimmäinen ajo kaatui:
 *
 * 1. `prop=coordinates` palauttaa oletuksena vain kymmenen sivun
 *    koordinaatit pyyntöä kohti, vaikka `titles` ottaa viisikymmentä.
 *    Loput sivut näyttivät koordinaatittomilta. `colimit=max` korjaa.
 * 2. Seuduilla ja saarilla (Alpit, Kreeta, Lapin maakunta) ei ole
 *    artikkelissa koordinaattia lainkaan. Ne haetaan Wikidatan
 *    P625-ominaisuudesta sivun wikibase_item-tunnuksella — sama tunnus
 *    kulkee kieliversiosta toiseen, joten otsikoita ei tarvitse
 *    kääntää käsin.
 */
function koordinaatit(otsikot) {
  const ulos = new Map();
  const qidt = new Map(); // otsikko → Wikidata-tunnus
  for (const kieli of ['fi', 'en']) {
    const puuttuu = otsikot.filter((t) => !ulos.has(t));
    if (!puuttuu.length) break;
    for (let i = 0; i < puuttuu.length; i += 20) {
      const era = puuttuu.slice(i, i + 20);
      let d;
      try {
        d = hae(`https://${kieli}.wikipedia.org/w/api.php?format=json&action=query`
          + '&prop=coordinates|pageprops&colimit=max&ppprop=wikibase_item&redirects=1'
          + '&titles=' + encodeURIComponent(era.join('|')));
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
        const otsikko = juurelle(sivu.title);
        const co = sivu.coordinates?.[0];
        if (co) ulos.set(otsikko, { lat: co.lat, lon: co.lon });
        const qid = sivu.pageprops?.wikibase_item;
        if (qid && !qidt.has(otsikko)) qidt.set(otsikko, qid);
      }
      nuku(2);
    }
  }
  // Wikidata-varareitti niille, joiden artikkelissa ei ole koordinaattia.
  const vajaat = [...qidt].filter(([otsikko]) => !ulos.has(otsikko));
  for (let i = 0; i < vajaat.length; i += 25) {
    const era = vajaat.slice(i, i + 25);
    let d;
    try {
      d = hae('https://www.wikidata.org/w/api.php?format=json&action=wbgetentities'
        + '&props=claims&ids=' + encodeURIComponent(era.map(([, q]) => q).join('|')));
    } catch { nuku(5); continue; }
    for (const [otsikko, qid] of era) {
      const arvo = d.entities?.[qid]?.claims?.P625?.[0]?.mainsnak?.datavalue?.value;
      if (arvo) ulos.set(otsikko, { lat: arvo.latitude, lon: arvo.longitude });
    }
    nuku(2);
  }
  return ulos;
}

const paikat = koordinaatit([...new Set(kaupungit.map((c) => c.wiki))]);
console.log(`koordinaatit löytyi ${paikat.size}/${kaupungit.length}`);

// --- aporee-haku -------------------------------------------------------------

/*
 * Koordinaattihaun kaksi ansaa. Molemmat kaatoivat ensimmäisen ajon.
 *
 * 1. Hakemisto ei tunne etumerkkiä. Latitude ja longitude ovat
 *    merkkijonokenttiä, ja jäsennin pudottaa miinusmerkin pois:
 *    kohde, jonka longitude on "-0.1119" (Brixton, Lontoo), löytyy
 *    välillä ["0.0" TO "0.9"] eikä miltään negatiiviselta väliltä.
 *    Kysely tehdään siis itseisarvoilla ja etumerkki tarkistetaan
 *    vasta tuloksista. Suojaamaton miinusmerkki kaataisi kyselyn
 *    muutenkin: Lucene lukee sen kieltooperaattoriksi ja vastaa
 *    "a reserved character appears at an unexpected position".
 *    Tähän jäivät nollaosumille Lontoo, Dublin, Edinburgh, Lissabon,
 *    Madrid ja Granada — ja samasta syystä koko eteläinen
 *    pallonpuolisko olisi jäänyt löytymättä Afrikan kierroksella.
 *
 * 2. Vertailu on aakkosellinen, ei numeerinen. Väli ["9.8" TO "10.2"]
 *    jää tyhjäksi, koska "10.2" on aakkosissa ennen merkkijonoa "9.8".
 *    Aakkosjärjestys vastaa lukujärjestystä vain, kun kokonaisosassa
 *    on yhtä monta numeroa, joten väli pilkotaan sen mukaan. Ylärajat
 *    on nipistetty nelidesimaalisen esityksen sisälle.
 *
 * Aakkoshaku päästää läpi myös vääriä osumia (väli "0.0000"–"9.9999"
 * kelpuuttaa merkkijonon "10.5"), joten tulokset suodatetaan vielä
 * numeerisesti alla.
 */
const RYHMAT = [[0, 9.9999], [10, 99.9999], [100, 180]];

function vali(kentta, ala, yla) {
  // Nollan yli menevä väli kattaa molemmat etumerkit, joten sen
  // itseisarvoväli alkaa nollasta.
  const ylitys = ala < 0 && yla > 0;
  const a = Math.min(180, Math.max(0, ylitys ? 0 : Math.min(Math.abs(ala), Math.abs(yla))));
  const b = Math.min(180, Math.max(Math.abs(ala), Math.abs(yla)));
  const palat = [];
  for (const [ryhmaAla, ryhmaYla] of RYHMAT) {
    const x = Math.max(a, ryhmaAla);
    const y = Math.min(b, ryhmaYla);
    if (x > y) continue;
    palat.push(`${kentta}:["${x.toFixed(4)}" TO "${y.toFixed(4)}"]`);
  }
  return palat.length === 1 ? palat[0] : `(${palat.join(' OR ')})`;
}

/**
 * Äänitykset annetun pisteen ympäriltä. Säde asteina: 0,08° on noin
 * yhdeksän kilometriä pohjois–eteläsuunnassa, eli kaupungin kokoinen.
 * Seutukohteille (Lappi, Alpit) tarvitaan väljempi haku.
 */
function aanitykset(lat, lon, sade) {
  const lonSade = sade / Math.max(0.05, Math.cos(lat * Math.PI / 180));
  const q = 'collection:(radio-aporee-maps)'
    + ` AND ${vali('latitude', lat - sade, lat + sade)}`
    + ` AND ${vali('longitude', lon - lonSade, lon + lonSade)}`;
  const url = 'https://archive.org/advancedsearch.php?q=' + encodeURIComponent(q)
    + '&fl[]=identifier&fl[]=title&fl[]=latitude&fl[]=longitude&fl[]=licenseurl'
    + '&fl[]=creator&fl[]=date&rows=100&output=json';
  let docs;
  try {
    docs = hae(url).response?.docs ?? [];
  } catch {
    return [];
  }
  // Aakkoshaun väärät osumat pois: väli tarkistetaan vielä lukuina.
  return docs.filter((d) => {
    const dLat = Number(d.latitude);
    const dLon = Number(d.longitude);
    return Number.isFinite(dLat) && Number.isFinite(dLon)
      && Math.abs(dLat - lat) <= sade && Math.abs(dLon - lon) <= lonSade;
  });
}

/** Vapaa lisenssi? Aporeessa on CC BY, CC BY-SA, CC BY-NC ja public domain. */
const vapaa = (url) => !url || /creativecommons\.org|publicdomain/.test(url);

/*
 * Peli tarvitsee paikan yleisen äänimaiseman, ei tapahtumaa. Karsittavat
 * jakautuvat kolmeen: sisätilat (jotka kuulostavat kaikkialla samalta ja
 * rikkovat "olen ulkona kaupungissa" -tunnun), kertaluonteiset tapahtumat
 * (joulutori, mielenosoitus, uudenvuoden ilotulitus) ja koneet, joiden
 * jyrinä peittää muun. Ensimmäinen ajo nosti kärkeen juuri näitä:
 * Budapestin kuusi parasta olivat kaksi joulutoria ja neljä metroasemaa.
 *
 * Suodatin on karkea eikä korvaa kuuntelua — se vain nostaa kuunneltavat
 * kärkeen.
 */
const EI_KELPAA = new RegExp([
  // sisätilat ja liikenteen hallit
  'concert|konzert|rehearsal|interview|radio show|lecture|church service|mass ',
  'museum|inside|indoor|studio|test |mic test|library|bibliothek|biennale',
  'exhibition|gallery|shopping|mall|parking|garage|waiting room|escalator',
  'station|bahnhof|n[áa]dra[žz]|metro|subway|u-bahn|underground|t-bana|platform',
  // tapahtumat
  'christmas|weihnacht|new year|demonstration|protest|occupy|carnival|parade',
  'siege|bombard|bombing',
  // koneet ja rakennustyöt
  'construction|bulldozer|power station|ventilation|drain|road 4|traffic light',
].join('|'), 'i');
// Nämä kertovat juuri siitä, mitä haetaan. 'station' kuului tähän ensin,
// mutta se nosti asemahallit kärkeen — ne ovat sisätiloja.
const HYVA = /(street|square|market|plaza|piazza|platz|plein|torg|tori|harbour|harbor|port|quay|tram|bridge|park|old town|centre|center|city|downtown|avenue|boulevard|promenade|ambien|soundscape)/i;

/*
 * Peli soittaa ambienssia silmukassa ja arpoo aloituskohdan äänitteen
 * mitasta (ambience-stream.js jättää loppuun 45 s varaa). Alle kahden
 * minuutin klippi alkaisi siis aina samasta kohdasta ja toistaisi
 * itseään kuuluvasti, joten kesto on osa valintaa — ja se selviää vasta
 * kohteen omasta metadatasta, ei hakutuloksesta.
 */
const LYHIN_S = 120;
const metatiedot = new Map();

function aanitiedosto(tunnus) {
  if (metatiedot.has(tunnus)) return metatiedot.get(tunnus);
  let tulos = null;
  try {
    const d = hae(`https://archive.org/metadata/${encodeURIComponent(tunnus)}`);
    const mp3 = (d.files ?? [])
      .filter((f) => /\.mp3$/i.test(f.name ?? ''))
      .sort((a, b) => Number(b.size ?? 0) - Number(a.size ?? 0))[0];
    if (mp3) {
      // Kesto puuttuu osalta mp3-merkinnöistä, mutta saman äänitteen
      // ogg-versiossa se on. Ilman tätä puolet ehdokkaista näytti
      // kestottomilta eikä liian lyhyitä olisi voinut karsia.
      const kestot = (d.files ?? [])
        .map((f) => Number(f.length ?? 0))
        .filter((n) => Number.isFinite(n) && n > 0);
      tulos = {
        url: `https://archive.org/download/${tunnus}/${encodeURIComponent(mp3.name)}`,
        kesto: kestot.length ? Math.round(Math.max(...kestot)) : null,
        lisenssi: d.metadata?.licenseurl ?? null,
        tekija: d.metadata?.creator ?? null,
      };
    }
  } catch {
    tulos = null;
  }
  metatiedot.set(tunnus, tulos);
  return tulos;
}

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
  const etaisyys = (d) => Math.round(Math.hypot(
    (Number(d.latitude) - paikka.lat) * 111,
    (Number(d.longitude) - paikka.lon) * 111 * Math.cos(paikka.lat * Math.PI / 180),
  ) * 10) / 10;
  const pisteet = (d) => {
    const t = String(d.title ?? '');
    if (EI_KELPAA.test(t)) return -1;
    return HYVA.test(t) ? 2 : 1;
  };
  // Sama äänite on aporeessa toisinaan kahteen kertaan (Marseillen
  // haitarinsoittaja, Granadan aukiot): samanniminen kelpaa vain kerran.
  const nahdyt = new Set();
  const ehdolla = osumat
    .map((d) => ({ ...d, pisteet: pisteet(d), etaisyysKm: etaisyys(d) }))
    .filter((d) => d.pisteet > 0)
    .filter((d) => {
      const avain = String(d.title ?? '').toLowerCase().trim();
      if (nahdyt.has(avain)) return false;
      nahdyt.add(avain);
      return true;
    })
    .sort((a, b) => b.pisteet - a.pisteet || a.etaisyysKm - b.etaisyysKm);

  // Metadata haetaan vasta karsituille — se on yksi pyyntö kohdetta kohti.
  const ehdokkaat = [];
  for (const d of ehdolla) {
    if (ehdokkaat.length >= 8) break;
    const tiedosto = aanitiedosto(d.identifier);
    nuku(1);
    if (!tiedosto?.url || !vapaa(tiedosto.lisenssi)) continue;
    if (tiedosto.kesto && tiedosto.kesto < LYHIN_S) continue;
    ehdokkaat.push({
      tunnus: d.identifier,
      otsikko: String(d.title ?? '').slice(0, 90),
      url: tiedosto.url,
      kesto: tiedosto.kesto,
      tekija: tiedosto.tekija ?? d.creator ?? null,
      lisenssi: tiedosto.lisenssi ?? d.licenseurl ?? null,
      etaisyysKm: d.etaisyysKm,
    });
  }
  tulos.push({
    ...c, lat: paikka.lat, lon: paikka.lon, loytyi: osumat.length, ehdokkaat,
  });
  console.log(`  ${c.nimi.padEnd(14)} ${String(osumat.length).padStart(3)} osumaa → ${ehdokkaat.length} ehdokasta`);
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
