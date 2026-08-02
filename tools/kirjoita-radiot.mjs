/*
 * Kirjoittaa tools/radiot.json -tuloksen pelin pakkatiedostoksi.
 *
 *   node tools/kirjoita-radiot.mjs
 *
 * Erillinen työkalu siksi, että haku (tools/hae-radiot.mjs) kestää
 * kymmeniä minuutteja ja sen tulosta katsotaan välissä käsin. Kun
 * lista on kunnossa, tämä kääntää sen pakkamuotoon eikä muuta
 * mitään muuta.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(JUURI, 'tools', 'radiot.json'), 'utf8'));

const lainaa = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/*
 * Maan pääkielet hakemiston kirjoitusasussa.
 *
 * Haku valitsee aseman maakoodin perusteella, ja maakoodi on
 * yhteisön kirjaama — siinä on virheitä. Angolan, Kamerunin ja
 * Liberian kohdalle osui sama arabiankielinen koraanikanava, ja
 * Korean kohdalle Pjongjangin asema. Kieli paljastaa nämä: portugalia
 * puhuvan maan asemalla ei lue "arabic".
 *
 * Lista on vain niille maille, joille virallista kanavaa ei
 * löytynyt — muille kelpuutus tulee nimestä.
 */
const KIELI_MAALLE = {
  EGY: ['arabic'], AFG: ['persian', 'pashto', 'dari', 'farsi'], AGO: ['portuguese'],
  ARE: ['arabic'], BIH: ['bosnian', 'croatian', 'serbian'], CMR: ['french', 'english'],
  COD: ['french', 'lingala', 'swahili'], CYP: ['greek', 'turkish'],
  IRQ: ['arabic', 'kurdish'], ISL: ['icelandic'], JOR: ['arabic'], JPN: ['japanese'],
  KOR: ['korean'], KWT: ['arabic'], LBR: ['english'], LBY: ['arabic'],
  LTU: ['lithuanian'], LVA: ['latvian'], MMR: ['burmese'], MNG: ['mongolian', 'monoglian'],
  MOZ: ['portuguese'], NAM: ['english', 'afrikaans', 'oshiwambo'], OMN: ['arabic'],
  PAK: ['urdu', 'punjabi', 'sindhi'], QAT: ['arabic'], ROU: ['romanian'],
  SDN: ['arabic'], SDS: ['english', 'arabic'], SHN: ['english'],
  SLE: ['english', 'krio'], SOM: ['somali'], SYR: ['arabic'],
  TCD: ['french', 'arabic'], TUN: ['arabic', 'french'], TZA: ['swahili'],
  UKR: ['ukrainian'], UZB: ['uzbek'], VNM: ['vietnamese'], YEM: ['arabic'],
  ZAF: ['english', 'afrikaans', 'zulu', 'xhosa'], ZWE: ['english', 'shona', 'ndebele'],
  POL: ['polish'], IND: ['hindi', 'english'], TWN: ['chinese', 'mandarin', 'taiwanese'],
};

/*
 * Yksittäiset torjunnat, joita kielitieto ei kiinni saa.
 *  - Pjongjang on kirjattu hakemistossa Etelä-Korean asemaksi.
 *  - Koraaninlausunta on kaunista arabiaa mutta ei arkipuhetta,
 *    ja se päätyi seitsemän eri maan kohdalle.
 *  - Lastensatukanava ja musiikkikanavat eivät opeta kieltä.
 */
const EI_KELPAA = /평양|pyongyang|abdulbasit|abdulsamad|bedtime|chillout|zipfm|evergreen|fred film/i;

const hylatyt = [];
for (const maa of Object.keys(data)) {
  const r = data[maa];
  if (r.virallinen) continue;
  const kielet = KIELI_MAALLE[maa];
  const kieli = (r.kieli ?? '').toLowerCase();
  const vaaraKieli = kielet && kieli && !kielet.some((k) => kieli.includes(k));
  if (EI_KELPAA.test(r.asema) || vaaraKieli) {
    hylatyt.push(`${maa} ${r.asema}${vaaraKieli ? ` (kieli: ${kieli})` : ''}`);
    delete data[maa];
  }
}

const maat = Object.keys(data).sort();
const rivit = maat.map((maa) => {
  const r = data[maa];
  const osat = [`url: ${lainaa(r.url)}`, `asema: ${lainaa(r.asema)}`];
  if (r.virallinen) osat.push('virallinen: true');
  return `  ${maa}: { ${osat.join(', ')} },`;
});

const viralliset = maat.filter((m) => data[m].virallinen).length;

const sisalto = `/*
 * Suora radiolähetys maittain: "Kuuntele kieltä" -napin ensisijainen
 * ääni.
 *
 * Miksi radio eikä äänite: aporeen äänimaisemat on tallennettu
 * maisemaksi, ei puheeksi, ja torinäytteessä kuuluu enimmäkseen
 * askelia ja liikennettä (omistajan havainto). Suorassa puheradiossa
 * puhutaan koko ajan, eikä lähetys ole koskaan kahdesti samanlainen.
 *
 * Järjestys on omistajan antama: maan virallinen ykkösradio ensin,
 * sen puuttuessa mikä tahansa saman maan asema, ja vasta viimeisenä
 * vanha kolmen minuutin tallenne (js/packs/europe-kielet.js). Tallenne
 * jää varareitiksi: lähetysosoitteet lakkaavat toimimasta ilman
 * varoitusta, ja silloin nappi soittaa äänitteen sen sijaan että
 * vaikenisi.
 *
 * Kaikki osoitteet ovat https-muotoisia ja tarkistettu hakemalla —
 * salaamatonta virtaa selain ei soita lainkaan. Lista on tuotettu
 * komennoilla
 *   node tools/hae-radiot.mjs
 *   node tools/kirjoita-radiot.mjs
 * Radio Browserin aineistosta. Älä muokkaa käsin: aja haku uudelleen.
 *
 * ${maat.length} maata, joista ${viralliset} maan yleisradion kanava.
 *
 * Avaimena ISO-3-maatunnus, sama jota map.cityCountry käyttää.
 */
export const RADIOT = {
${rivit.join('\n')}
};

/** Maan suora lähetys, tai null. */
export function radioMaalle(maa) {
  return (maa && RADIOT[maa]) || null;
}
`;

writeFileSync(join(JUURI, 'js', 'packs', 'radiot.js'), sisalto);
console.log(`js/packs/radiot.js: ${maat.length} maata, ${viralliset} virallista`);
// Hylätyt luetellaan aina: hiljainen karsinta näyttää täydeltä listalta.
if (hylatyt.length) {
  console.log(`\n${hylatyt.length} hylättyä (näille jää vanha äänite):`);
  for (const h of hylatyt) console.log(`  ${h}`);
}
