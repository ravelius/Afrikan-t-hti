/*
 * Tarkistaa historialinssin aineiston js/packs/linssi-historia.js.
 *
 *   node tools/tarkista-historia.mjs
 *   NODE_USE_ENV_PROXY=1 node tools/tarkista-historia.mjs --verkko
 *
 * --- miksi tämä on olemassa ---
 *
 * Aineisto on käsin koottu, koska koneellisesti vapaana ei ole yhtään
 * lähdettä, joka antaisi Silkkitien reitit ja historialliset rajat
 * käyttökelpoisella lisenssillä. Käsin koottu tarkoittaa, että virhe on
 * kirjoitusvirheen päässä: väärä avain, unohtunut lahde-kenttä tai
 * kaupunki, joka merkitään aikaikkunaan jossa sitä ei vielä ollut.
 * Yksikään näistä ei näy pelissä muuten kuin siten, että kartta valehtelee
 * hiljaa. Siksi rakenne tarkistetaan koneella.
 *
 * Verkkotarkistus (--verkko) hakee kaupunkien koordinaatit uudelleen
 * Wikipedian API:sta ja vertaa niitä tiedostossa oleviin. Se ei ole
 * pelin ajossa mukana eikä sitä tarvitse ajaa kuin silloin, kun
 * kaupunkeja lisätään.
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const verkko = process.argv.includes('--verkko');

const { HISTORIA } = await import(`file://${join(JUURI, 'js/packs/linssi-historia.js')}`);

const virheet = [];
const huomiot = [];
const virhe = (viesti) => virheet.push(viesti);

// Sama kolmiportainen asteikko kuin tiedoston otsikossa. Jos joku keksii
// neljännen tason, se on todennäköisesti kirjoitusvirhe.
const VARMUUDET = new Set(['melko varma', 'karkea', 'epavarma']);

const kelpoPiste = (p) => Array.isArray(p) && p.length === 2
  && Number.isFinite(p[0]) && Number.isFinite(p[1])
  && p[0] >= -180 && p[0] <= 180 && p[1] >= -90 && p[1] <= 90;

if (!HISTORIA?.varoitus) virhe('HISTORIA.varoitus puuttuu');
if (!Array.isArray(HISTORIA?.aiheet) || HISTORIA.aiheet.length === 0) {
  virhe('HISTORIA.aiheet on tyhjä');
  process.exit(1);
}

for (const aihe of HISTORIA.aiheet) {
  const tunnus = `aihe ${aihe.avain}`;
  if (!aihe.avain || !aihe.nimi) virhe(`${tunnus}: avain tai nimi puuttuu`);
  if (!aihe.varoitus) virhe(`${tunnus}: varoitus puuttuu`);

  const kaupunkiAvaimet = new Map(aihe.kaupungit.map((k) => [k.avain, k]));
  const reittiAvaimet = new Map(aihe.reitit.map((r) => [r.avain, r]));
  const valtakuntaAvaimet = new Map(aihe.valtakunnat.map((v) => [v.avain, v]));

  if (kaupunkiAvaimet.size !== aihe.kaupungit.length) virhe(`${tunnus}: kaupungeissa kaksoisavain`);
  if (reittiAvaimet.size !== aihe.reitit.length) virhe(`${tunnus}: reiteissä kaksoisavain`);
  if (valtakuntaAvaimet.size !== aihe.valtakunnat.length) virhe(`${tunnus}: valtakunnissa kaksoisavain`);

  for (const k of aihe.kaupungit) {
    const t = `${tunnus} / kaupunki ${k.avain}`;
    if (!k.nimi) virhe(`${t}: nimi puuttuu`);
    if (!kelpoPiste([k.lon, k.lat])) virhe(`${t}: koordinaatti ei kelpaa`);
    if (!VARMUUDET.has(k.varmuus)) virhe(`${t}: varmuus puuttuu tai tuntematon (${k.varmuus})`);
    if (!k.lahde) virhe(`${t}: lahde puuttuu`);
    if (k.asti != null && k.alkaen != null && k.asti < k.alkaen) virhe(`${t}: asti on ennen alkaen`);
  }

  for (const r of aihe.reitit) {
    const t = `${tunnus} / reitti ${r.avain}`;
    if (!r.nimi) virhe(`${t}: nimi puuttuu`);
    if (!VARMUUDET.has(r.varmuus)) virhe(`${t}: varmuus puuttuu tai tuntematon`);
    if (!r.lahde) virhe(`${t}: lahde puuttuu`);
    if (!Array.isArray(r.pisteet) || r.pisteet.length < 2) virhe(`${t}: pisteitä on alle kaksi`);
    for (const p of r.pisteet ?? []) {
      if (!kelpoPiste(p)) virhe(`${t}: kelvoton piste ${JSON.stringify(p)}`);
    }
    for (const avain of r.kaupungit ?? []) {
      if (!kaupunkiAvaimet.has(avain)) virhe(`${t}: tuntematon kaupunki ${avain}`);
    }
    /*
     * Reitin nimetyt pysähdykset pitää löytyä viivalta. Jos kaupunki
     * mainitaan mutta viiva kulkee sadan kilometrin päästä ohi, jompi
     * kumpi on väärin — ja kartalla se näyttäisi siltä, että karavaani
     * ohitti Samarkandin.
     */
    for (const avain of r.kaupungit ?? []) {
      const k = kaupunkiAvaimet.get(avain);
      if (!k) continue;
      const lahin = Math.min(...r.pisteet.map(
        ([lon, lat]) => Math.hypot(lon - k.lon, (lat - k.lat) * 1.0),
      ));
      if (lahin > 0.6) huomiot.push(`${t}: ${avain} on ${lahin.toFixed(2)}° päässä lähimmästä pisteestä`);
    }
  }

  for (const v of aihe.valtakunnat) {
    const t = `${tunnus} / valtakunta ${v.avain}`;
    if (!v.nimi) virhe(`${t}: nimi puuttuu`);
    if (!VARMUUDET.has(v.varmuus)) virhe(`${t}: varmuus puuttuu tai tuntematon`);
    if (v.varmuus === 'melko varma') {
      virhe(`${t}: rajaviiva ei voi olla 'melko varma' — ne ovat aina vähintään karkeita`);
    }
    if (!v.lahde) virhe(`${t}: lahde puuttuu`);
    if (!v.selite) virhe(`${t}: selite puuttuu`);
    for (const rengas of v.aariviivat ?? []) {
      if (rengas.length < 4) virhe(`${t}: rengas on liian lyhyt`);
      const eka = rengas[0];
      const vika = rengas[rengas.length - 1];
      if (eka[0] !== vika[0] || eka[1] !== vika[1]) virhe(`${t}: rengas ei ole suljettu`);
      for (const p of rengas) {
        if (!kelpoPiste(p)) virhe(`${t}: kelvoton piste ${JSON.stringify(p)}`);
      }
      // Kymmeniä pisteitä, ei satoja: nämä ovat tarkoituksella karkeita.
      if (rengas.length > 200) virhe(`${t}: rengas on liian tarkka (${rengas.length} pistettä)`);
    }
  }

  for (const i of aihe.ikkunat) {
    const t = `${tunnus} / ikkuna ${i.avain}`;
    if (!i.nimi || !i.otsikko || !i.selite) virhe(`${t}: nimi, otsikko tai selite puuttuu`);
    if (!Number.isInteger(i.vuosi)) virhe(`${t}: vuosi puuttuu`);
    if (!(i.alku <= i.vuosi && i.vuosi <= i.loppu)) virhe(`${t}: vuosi ei ole välillä alku–loppu`);
    if (!VARMUUDET.has(i.varmuus)) virhe(`${t}: varmuus puuttuu tai tuntematon`);

    for (const avain of i.reitit) {
      if (!reittiAvaimet.has(avain)) virhe(`${t}: tuntematon reitti ${avain}`);
    }
    for (const avain of i.valtakunnat) {
      const v = valtakuntaAvaimet.get(avain);
      if (!v) { virhe(`${t}: tuntematon valtakunta ${avain}`); continue; }
      if (Math.abs(v.vuosi - i.vuosi) > 120) {
        virhe(`${t}: valtakunta ${avain} on vuodelta ${v.vuosi}, ikkuna vuodelta ${i.vuosi}`);
      }
    }
    /*
     * Aikaikkunan tärkein lupaus on, ettei siinä näy paikkoja jotka eivät
     * vielä olleet olemassa tai olivat jo hylättyjä. Tämä on koko linssin
     * pointti, joten se on virhe eikä huomautus.
     */
    for (const avain of i.kaupungit) {
      const k = kaupunkiAvaimet.get(avain);
      if (!k) { virhe(`${t}: tuntematon kaupunki ${avain}`); continue; }
      if (k.alkaen != null && k.alkaen > i.vuosi) {
        virhe(`${t}: ${avain} alkaa vasta vuonna ${k.alkaen}`);
      }
      if (k.asti != null && k.asti < i.vuosi) {
        virhe(`${t}: ${avain} päättyi jo vuonna ${k.asti}`);
      }
    }
  }

  // Ikkunat aikajärjestyksessä: piirtäjä olettaa listan olevan järjestyksessä.
  const vuodet = aihe.ikkunat.map((i) => i.vuosi);
  for (let n = 1; n < vuodet.length; n++) {
    if (vuodet[n] <= vuodet[n - 1]) virhe(`${tunnus}: ikkunat eivät ole aikajärjestyksessä`);
  }

  // Käyttämättä jäänyt aineisto on todennäköisemmin unohdus kuin tarkoitus.
  const kaytetyt = new Set(aihe.ikkunat.flatMap((i) => [...i.reitit, ...i.kaupungit, ...i.valtakunnat]));
  for (const avain of [...kaupunkiAvaimet.keys(), ...reittiAvaimet.keys(), ...valtakuntaAvaimet.keys()]) {
    if (!kaytetyt.has(avain)) huomiot.push(`${tunnus}: ${avain} ei esiinny yhdessäkään ikkunassa`);
  }
}

if (verkko) {
  const odota = (ms) => new Promise((r) => setTimeout(r, ms));
  const aihe = HISTORIA.aiheet[0];
  // Wikipedian artikkelin nimi luetaan lahde-kentästä lainausmerkeistä.
  const kohteet = aihe.kaupungit
    .map((k) => ({ k, otsikko: k.lahde.match(/Wikipedia \(en\) "([^"]+)"/)?.[1] }))
    .filter((x) => x.otsikko);

  console.log(`Verkkotarkistus: ${kohteet.length} kaupunkia Wikipedian API:sta`);
  for (let n = 0; n < kohteet.length; n += 6) {
    const era = kohteet.slice(n, n + 6);
    const url = new URL('https://en.wikipedia.org/w/api.php');
    url.searchParams.set('action', 'query');
    url.searchParams.set('prop', 'coordinates');
    url.searchParams.set('titles', era.map((x) => x.otsikko).join('|'));
    url.searchParams.set('format', 'json');
    url.searchParams.set('redirects', '1');
    url.searchParams.set('formatversion', '2');

    let sivut = null;
    let uudelleenohjaus = new Map();
    // Wikipedia rajoittaa nopeutta rajusti; kasvava tauko riittää.
    for (let yritys = 0; yritys < 6 && !sivut; yritys++) {
      try {
        const vastaus = await fetch(url, { headers: { 'User-Agent': 'Matkakirja/1.0 (opetuspeli)' } });
        if (!vastaus.ok) throw new Error(vastaus.status);
        const data = (await vastaus.json()).query ?? {};
        sivut = data.pages ?? [];
        // "Hami City" ohjaa artikkeliin "Hami": ilman tätä karttaa
        // uudelleenohjatun sivun koordinaatti jäisi löytymättä.
        uudelleenohjaus = new Map((data.redirects ?? []).map((r) => [r.from, r.to]));
      } catch { await odota(5000 * (yritys + 1)); }
    }
    await odota(4000);
    if (!sivut) { huomiot.push(`verkko: erä ${n} ei vastannut`); continue; }

    for (const { k, otsikko } of era) {
      const kohde = uudelleenohjaus.get(otsikko) ?? otsikko;
      const sivu = sivut.find((s) => s.title === kohde);
      const paikka = sivu?.coordinates?.[0];
      if (!paikka) { huomiot.push(`verkko: ${k.avain} (${otsikko}) — ei koordinaattia`); continue; }
      const ero = Math.hypot(paikka.lon - k.lon, paikka.lat - k.lat);
      // 0,05° on noin 5 km. Sitä suurempi ero tarkoittaa, että lähde on
      // vaihtunut tai tiedostoon on kirjoitettu jotain muuta kuin luultiin.
      if (ero > 0.05) {
        virhe(`verkko: ${k.avain} on ${ero.toFixed(3)}° erossa Wikipedian koordinaatista `
          + `(tiedostossa ${k.lon},${k.lat} — Wikipediassa ${paikka.lon},${paikka.lat})`);
      }
    }
  }
}

const aihe = HISTORIA.aiheet[0];
console.log(`aiheet ${HISTORIA.aiheet.length}, ikkunat ${aihe.ikkunat.length}, `
  + `reitit ${aihe.reitit.length}, kaupungit ${aihe.kaupungit.length}, `
  + `valtakunnat ${aihe.valtakunnat.length}`);

for (const h of huomiot) console.log(`  huom: ${h}`);
for (const v of virheet) console.log(`  VIRHE: ${v}`);

if (virheet.length) {
  console.log(`\n${virheet.length} virhettä.`);
  process.exit(1);
}
console.log('\nAineisto on ehjä.');
