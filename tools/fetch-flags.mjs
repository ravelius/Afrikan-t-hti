/*
 * Hakee pelissä käytetyt liput Wikimedia Commonsista repoon.
 *
 * Aja:  node tools/fetch-flags.mjs
 *
 * Miksi: liput haettiin ennen suoraan Commonsista jokaisella
 * saapumiskortilla. Kortti näyttää neljä lippua kerralla, ja Commons
 * rajoittaa peräkkäisiä pyyntöjä (429) — silloin liput jäivät kokonaan
 * pois. Paikallisina ne latautuvat heti ja toimivat myös ilman verkkoa.
 *
 * Liput ovat Commonsissa SVG:nä; Special:FilePath?width=N palauttaa
 * valmiiksi rasteroidun PNG:n, joten tässä ei tarvita SVG-työkaluja.
 * Kaikki liput ovat vapaassa käytössä (useimmiten public domain, koska
 * valtioiden liput eivät ole tekijänoikeuden alaisia).
 */
import fs from 'node:fs';
import path from 'node:path';

const LEVEYS = 120;              // riittää sekä 0,8 rem että 1,05 rem korkeuteen retinallakin
const KANSIO = 'assets/liput';
const KARTTA = 'js/packs/liput-paikalliset.js';

/*
 * Poimi lippujen tiedostonimet paketeista MODUULEINA, ei tekstinä.
 *
 * Ensimmäinen versio haki tekstistä hahmolla /lippu: '([^']+)'/ eli
 * heittomerkeillä. Kun Aasian rajat kirjoitettiin JSON.stringifyllä,
 * kentät saivat lainausmerkit ("lippu":"Flag of Japan.svg") ja
 * kaikki 28 uutta lippua jäivät löytymättä — hiljaa, koska
 * puuttuvasta ei tullut virhettä vaan vain lyhyempi lista.
 *
 * Moduulina luettuna muotoilulla ei ole väliä.
 */
const nimet = new Set();
const { PACKS } = await import('../js/pack.js');
for (const pack of PACKS) {
  for (const maa of Object.values(pack.map?.countryShapes ?? {})) {
    if (maa.lippu) nimet.add(maa.lippu);
  }
  // Tervehdyskorteissa ja kulttuurinostoissa on lippuja kentässä
  // `lippu` myös muualla kuin maiden rajoissa.
  for (const c of pack.cities ?? []) if (c.lippu) nimet.add(c.lippu);
}
// Loput tekstistä: osa lipuista on taulukoissa, joita ei viedä ulos.
for (const tiedosto of fs.readdirSync('js/packs')) {
  const sisalto = fs.readFileSync(path.join('js/packs', tiedosto), 'utf8');
  for (const osuma of sisalto.matchAll(/["']?lippu["']?\s*:\s*['"]([^'"]+)['"]/g)) nimet.add(osuma[1]);
}
const lista = [...nimet].sort();
console.log(`${lista.length} lippua`);

/** Tiedostonimestä siisti paikallinen nimi: "Flag of Côte d'Ivoire.svg" -> "cote-divoire.png" */
function paikallinenNimi(tiedosto) {
  return `${tiedosto
    .replace(/\.svg$/i, '')
    .replace(/^Flag of (the )?/i, '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}.png`;
}

fs.mkdirSync(KANSIO, { recursive: true });
const parit = [];
for (const tiedosto of lista) {
  const nimi = paikallinenNimi(tiedosto);
  const kohde = path.join(KANSIO, nimi);
  parit.push([tiedosto, nimi]);
  if (fs.existsSync(kohde)) { console.log('on jo', nimi); continue; }
  const osoite = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(tiedosto)}?width=${LEVEYS}`;
  // Wikimedia torjuu pyynnöt ilman tunnistautuvaa User-Agentia (403).
  const vastaus = await fetch(osoite, {
    redirect: 'follow',
    headers: { 'User-Agent': 'AfrikanTahti-kuvahaku/1.0 (opetuspeli; https://github.com/ravelius/afrikan-tahti)' },
  });
  if (!vastaus.ok) { console.error('VIRHE', vastaus.status, tiedosto); continue; }
  const data = Buffer.from(await vastaus.arrayBuffer());
  fs.writeFileSync(kohde, data);
  console.log('haettu', nimi, data.length, 'tavua');
  // Commons rajoittaa nopeaa pyyntösarjaa; pieni tauko riittää.
  await new Promise((r) => { setTimeout(r, 900); });
}

const rivit = parit.map(([a, b]) => `  [${JSON.stringify(a)}, '${b}'],`).join('\n');
fs.writeFileSync(KARTTA, `// Lippujen paikalliset kopiot (generoitu: node tools/fetch-flags.mjs).
// Avain on Commonsin tiedostonimi, arvo tiedosto kansiossa assets/liput.
// Älä muokkaa käsin.
export const LIPUT_PAIKALLISET = new Map([
${rivit}
]);
`);
console.log('kirjoitettu', KARTTA);
