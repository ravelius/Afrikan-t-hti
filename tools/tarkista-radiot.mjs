/*
 * Tarkistaa ehdotetut radiolähetykset ja liittää ne radiot.json-listaan.
 *
 *   node tools/tarkista-radiot.mjs <ehdokkaat.json> [--kuiva]
 *
 * Ehdokkaat on etsitty maakohtaisella tutkimisella: mikä on maan
 * yleisradion puhekanava ja mistä sen lähetystä saa kuunnella. Sitä
 * työtä ei voi tehdä hakemistokyselyllä, koska hakemisto ei tiedä
 * mikä asema on maan yleisradio.
 *
 * Ehdotukseen ei kuitenkaan luoteta. Sama neljä ehtoa kuin
 * automaattihaussakin, ja ne tarkistetaan hakemalla:
 *   1. https — selain ei soita salaamatonta virtaa lainkaan
 *   2. ei HLS — <audio> soittaa .m3u8:aa vain Safarissa
 *   3. vastaa juuri nyt äänellä
 *   4. sisältötyyppi ei ole HTML (soittolista tai verkkosivu)
 *
 * Ohittava osoite lisätään radiot.json-listaan, ja pakkatiedosto
 * kirjoitetaan erikseen komennolla tools/kirjoita-radiot.mjs.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
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
const kuiva = process.argv.includes('--kuiva');
const lahde = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!lahde) { console.error('Anna ehdokastiedosto.'); process.exit(1); }

/** Soiko osoite oikeasti? Ks. sama tarkistus tools/hae-radiot.mjs. */
async function soiko(osoite) {
  const katkaisin = new AbortController();
  const ajastin = setTimeout(() => katkaisin.abort(), 12000);
  try {
    const vastaus = await fetch(osoite, {
      signal: katkaisin.signal,
      headers: { 'user-agent': 'Matkakirja/1.0 (opetuspeli)' },
    });
    if (!vastaus.ok) return `HTTP ${vastaus.status}`;
    const laji = (vastaus.headers.get('content-type') ?? '').toLowerCase();
    vastaus.body?.cancel().catch(() => {});
    if (/text\/html|application\/xml|\/json/.test(laji)) return `sisältö ${laji}`;
    if (/audio|ogg|mpeg|aacp?/.test(laji)) return null;
    if (laji === '' || laji === 'application/octet-stream') return null;
    return `sisältö ${laji}`;
  } catch (virhe) {
    return `ei vastaa (${virhe?.cause?.code ?? virhe?.name ?? '?'})`;
  } finally {
    clearTimeout(ajastin);
  }
}

const ehdokkaat = JSON.parse(readFileSync(lahde, 'utf8'));
const polku = join(JUURI, 'tools', 'radiot.json');
const lista = JSON.parse(readFileSync(polku, 'utf8'));

/*
 * Sama maa voi saada monta ehdotusta. Virallinen kanava voittaa, ja
 * muuten ensimmäinen toimiva. Järjestetään ennen kokeilua, jotta
 * paras yritetään ensin eikä hyvää korvata huonommalla.
 */
ehdokkaat.sort((a, b) => Number(b.virallinen) - Number(a.virallinen));

const hyvat = new Map();
const hylatyt = [];
for (const e of ehdokkaat) {
  if (hyvat.has(e.maa)) continue;
  if (!e.url?.startsWith('https://')) { hylatyt.push(`${e.maa} ${e.asema}: ei https`); continue; }
  if (/\.m3u8(\?|$)/.test(e.url)) { hylatyt.push(`${e.maa} ${e.asema}: HLS`); continue; }
  const vika = await soiko(e.url);
  if (vika) { hylatyt.push(`${e.maa} ${e.asema}: ${vika}`); continue; }
  hyvat.set(e.maa, {
    url: e.url,
    asema: e.asema,
    kieli: e.kieli ?? '',
    virallinen: Boolean(e.virallinen),
    /*
     * Merkki siitä, että valinta on tutkittu maa kerrallaan eikä
     * pisteytetty hakemistosta. Kirjoitin (tools/kirjoita-radiot.mjs)
     * ohittaa kielisuodattimen näiden kohdalla: suodatin vertaa
     * kielen nimeä englanninkieliseen listaan, ja nämä on kirjattu
     * suomeksi. Ilman merkkiä se hylkäsi 17 hyvää asemaa siksi, että
     * kentässä luki "arabia" eikä "arabic".
     */
    tutkittu: true,
  });
  console.log(`${e.maa}  ${e.virallinen ? '★' : ' '} ${e.asema}`);
}

console.log(`\n${hyvat.size} maalle toimiva osoite.`);
// Hylätyt aina näkyviin: hiljainen karsinta näyttäisi täydeltä listalta.
if (hylatyt.length) {
  console.log(`\n${hylatyt.length} hylättyä:`);
  for (const h of hylatyt) console.log(`  ${h}`);
}
if (kuiva) process.exit(0);

/*
 * Tutkittu valinta voittaa arvatun.
 *
 * Automaattihaku pisteyttää aseman nimen ja merkkien perusteella, ja
 * se erehtyi pahasti: koraaninlausunta osui seitsemän maan kohdalle,
 * Pjongjangin asema oli kirjattu Etelä-Koreaan, ja Latvian valinta oli
 * "Nordic Chillout Radio". Nämä ehdokkaat on sitä vastoin haettu
 * maa kerrallaan kysymällä, mikä on maan yleisradio ja mistä sitä
 * kuulee.
 *
 * Ainoa tapaus, jossa vanha jää: se on maan virallinen kanava ja uusi
 * ei ole. Silloin haku oli jo osunut parhaaseen mahdolliseen.
 */
let uusia = 0;
let parannettu = 0;
for (const [maa, r] of hyvat) {
  const vanha = lista[maa];
  if (!vanha) { lista[maa] = r; uusia += 1; continue; }
  if (vanha.virallinen && !r.virallinen) continue;
  // Sama osoite ei ole syy ohittaa: tietue voi silti kaivata
  // tutkittu-merkkiä tai tarkempaa nimeä.
  if (JSON.stringify(vanha) === JSON.stringify(r)) continue;
  lista[maa] = r;
  parannettu += 1;
}
writeFileSync(polku, `${JSON.stringify(lista, null, 1)}\n`);
console.log(`\ntools/radiot.json: ${uusia} uutta maata, ${parannettu} parannettua.`);
console.log('Aja seuraavaksi: node tools/kirjoita-radiot.mjs');
