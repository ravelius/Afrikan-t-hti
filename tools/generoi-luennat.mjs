/*
 * Saapumisluentojen generointi ElevenLabsilla (docs/isoisan-raamattu.md).
 *
 * Lukee saapumismerkinnän luenta-kentän (teksti tunnetageineen) ja
 * kirjoittaa assets/audio/puhe-europe-saapuminen-<id>.mp3. Resepti on
 * sama kuin aiemmissa luennoissa (docs/muistiinpanot-fablelle.md):
 * ääni "Viisas Kertoja", malli eleven_v3, /v1/text-to-dialogue,
 * mp3_44100_128. Stability kävi arvossa 0.4, mutta palautettiin
 * 0.5:een omistajan palautteesta 7.8.2026: "äänen vaihteluarvoa
 * kannattaa ottaa takaisinpäin, hyppii vähän liikaa".
 *
 * Käyttö:  ELEVEN_API_KEY=... node tools/generoi-luennat.mjs lontoo madrid
 * Avain kierrätetään ajojen jälkeen — sitä ei tallenneta minnekään,
 * ei edes lokiin.
 *
 * HUOM konttiympäristössä: Noden fetch ei käytä ympäristön proxyä
 * ilman lippua — aja NODE_USE_ENV_PROXY=1, tai "Host not in
 * allowlist" -virhe tulee omasta putkesta vaikka verkko on auki.
 */

import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { EUROPE_SAAPUMISET } from '../js/packs/europe-saapumiset.js';

const JUURI = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const AANI = 'Sz0tRTEpybtDJ9ru2kgD'; // Viisas Kertoja
const MALLI = 'eleven_v3';
const STABILITY = 0.5;

const avain = process.env.ELEVEN_API_KEY ?? process.env.ELEVENLABS_API_KEY;
if (!avain) {
  console.error('ELEVEN_API_KEY puuttuu ympäristöstä — luentoja ei voi generoida.');
  process.exit(1);
}

const kaupungit = process.argv.slice(2);
if (!kaupungit.length) {
  console.error('Anna kaupungit: node tools/generoi-luennat.mjs lontoo madrid …');
  process.exit(1);
}

for (const id of kaupungit) {
  const merkinta = EUROPE_SAAPUMISET[id];
  if (!merkinta?.luenta) {
    console.error(`${id}: luenta-kenttä puuttuu (ks. docs/isoisan-raamattu.md) — ohitetaan.`);
    continue;
  }
  console.log(`${id}: generoidaan (${merkinta.luenta.length} merkkiä)…`);
  const vastaus = await fetch(
    'https://api.elevenlabs.io/v1/text-to-dialogue?output_format=mp3_44100_128',
    {
      method: 'POST',
      headers: { 'xi-api-key': avain, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputs: [{ text: merkinta.luenta, voice_id: AANI }],
        model_id: MALLI,
        settings: { stability: STABILITY },
      }),
      signal: AbortSignal.timeout(180000),
    },
  );
  if (!vastaus.ok) {
    // Virherunko näkyviin (ilman avainta) — muodon muutokset selviävät siitä.
    console.error(`${id}: HTTP ${vastaus.status}: ${(await vastaus.text()).slice(0, 400)}`);
    process.exit(1);
  }
  const polku = resolve(JUURI, `assets/audio/puhe-europe-saapuminen-${id}.mp3`);
  const data = Buffer.from(await vastaus.arrayBuffer());
  writeFileSync(polku, data);
  console.log(`${id}: ${(data.length / 1024).toFixed(0)} kt → ${polku}`);
}
console.log('Valmis. Muista: tiedostot repoon ja avain kiertoon.');
