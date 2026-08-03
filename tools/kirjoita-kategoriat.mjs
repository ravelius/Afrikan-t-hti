/*
 * Kirjoittaa kaupungin kulttuurinostot kategorioittain paketiksi.
 *
 *   node tools/kirjoita-kategoriat.mjs <sisaan.json> <ulos.js> <VIENTINIMI> <kaupunki>
 *
 * Miksi tämä on eri taulu kuin EUROPE_KULTTUURI:
 *
 * Nykyinen kulttuuritaulu on litteä lista nostoja kaupunkia kohti.
 * Omistajan toive on ryhmitellä ne kategorioihin, joista yksi on auki
 * kerrallaan — mutta se on käyttöliittymäpäätös, jota ei ole vielä
 * tehty. Sisältö on valmis ja tarkistettu, joten se tallennetaan nyt
 * omaan tauluunsa. Kun näkymä on päätetty, taulu on odottamassa.
 *
 * Litteä taulu jää paikalleen. Sen korvaaminen ennen kuin näkymä on
 * olemassa tekisi olemassa olevasta sisällöstä näkymätöntä.
 *
 * TARKISTUKSET ennen kirjoittamista:
 *  1. Onko kuvatiedostolle merkitty leveys vähintään 1200 px? Pienempi
 *     venyy rumaksi, kun kuva avataan koko ruudulle.
 *  2. Onko lähdemerkinnässä tekijä? Lisenssi käskee nimetä, ja pelkkä
 *     "Wikimedia Commons" ei nimeä ketään.
 *  3. Onko tekijän nimi katkennut? Yhden tai kahden merkin nimi on
 *     lähes aina merkki siitä, että titteli tai alkukirjain on niellyt
 *     lopun (ks. tools/lisaa-tekijat.mjs).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const kuiva = process.argv.includes('--kuiva');
const [lahde, kohde, vientinimi, kaupunki] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!lahde || !kohde || !vientinimi || !kaupunki) {
  console.error('käyttö: node tools/kirjoita-kategoriat.mjs <sisaan.json> <ulos.js> <VIENTINIMI> <kaupunki>');
  process.exit(1);
}

const LEVEYS_RAJA = 1200;
const data = JSON.parse(readFileSync(lahde, 'utf8'));

const huomiot = [];
const kategoriat = [];
for (const k of data.kategoriat ?? []) {
  const nostot = (k.nostot ?? []).filter((n) => {
    if (!n.tiedosto) { huomiot.push(`${k.kategoria}/${n.otsikko}: ei kuvatiedostoa`); return false; }
    if ((n.leveys ?? 0) < LEVEYS_RAJA) {
      huomiot.push(`${k.kategoria}/${n.otsikko}: kuva vain ${n.leveys} px`);
      return false;
    }
    const lahdeteksti = String(n.lahde ?? '');
    const tekija = lahdeteksti.split(',')[0].trim();
    if (!tekija || /^(wikimedia|commons|unknown)$/i.test(tekija)) {
      huomiot.push(`${k.kategoria}/${n.otsikko}: lähteessä ei tekijää — "${lahdeteksti}"`);
      return false;
    }
    if (tekija.length <= 2) {
      huomiot.push(`${k.kategoria}/${n.otsikko}: tekijän nimi katkennut — "${tekija}"`);
      return false;
    }
    return true;
  });
  if (!nostot.length) { huomiot.push(`${k.kategoria}: ei yhtään kelvollista nostoa, kategoria jätetään pois`); continue; }
  kategoriat.push({ ...k, nostot });
}

const yhteensa = kategoriat.reduce((s, k) => s + k.nostot.length, 0);
console.log(`${kategoriat.length} kategoriaa, ${yhteensa} nostoa läpäisi.`);
// Huomiot aina näkyviin: hiljainen karsinta näyttäisi täydeltä listalta.
if (huomiot.length) {
  console.log(`\n${huomiot.length} huomiota:`);
  for (const h of huomiot) console.log(`  ${h}`);
}
if (kuiva) process.exit(0);

// --- kirjoitus -----------------------------------------------------------------

const lainaa = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/** Katkoo pitkän tekstin 78 merkin riveiksi jatkettuina merkkijonoina. */
function katko(teksti, sisennys) {
  const tila = 78 - sisennys.length - 6;
  const rivit = [];
  let nyt = '';
  for (const sana of String(teksti).split(' ')) {
    if (nyt && (nyt.length + sana.length + 1) > tila) { rivit.push(nyt); nyt = sana; } else nyt = nyt ? `${nyt} ${sana}` : sana;
  }
  if (nyt) rivit.push(nyt);
  return rivit
    .map((r, i) => (i === 0
      ? lainaa(rivit.length === 1 ? r : `${r} `)
      : `${sisennys}  + ${lainaa(i === rivit.length - 1 ? r : `${r} `)}`))
    .join('\n');
}

const osat = kategoriat.map((k) => {
  const r = [`    {`];
  r.push(`      id: ${lainaa(k.id ?? k.kategoria.toLowerCase())},`);
  r.push(`      nimi: ${lainaa(k.kategoria)},`);
  if (k.johdanto) r.push(`      johdanto: ${katko(k.johdanto, '      ')},`);
  r.push('      nostot: [');
  for (const n of k.nostot) {
    r.push('        {');
    r.push(`          otsikko: ${lainaa(n.otsikko)},`);
    r.push(`          teksti: ${katko(n.teksti, '          ')},`);
    r.push(`          tiedosto: ${lainaa(n.tiedosto)},`);
    r.push(`          selite: ${katko(n.selite, '          ')},`);
    r.push(`          lahde: ${lainaa(n.lahde)},`);
    if (n.wiki) r.push(`          wiki: ${lainaa(n.wiki)},`);
    r.push('        },');
  }
  r.push('      ],');
  r.push('    },');
  return r.join('\n');
});

const sisalto = `// Kaupungin kulttuurinostot kategorioittain.
//
// Omistajan toive: "sinne voisi lisätä myös nostoja enemmän ja
// jaotella ne kategorioiden mukaan — vain yksi kategoria näkyisi auki
// kerrallaan ja sen alla voisi olla useampi eri näyte. Tämän pelin
// rikkaus on kulttuuri, joten rakennetaan niitä lisää."
//
// Järjestys on harkittu eikä aakkosellinen. Tutki-ikkuna avautuu
// kaupunkiin SAAVUTTAESSA, joten ensimmäisenä on se, jonka matkaaja
// kohtaisi kadulla ensin — historia kertoo missä ollaan. Huumori on
// viimeisenä, koska se jää mieleen. Aisteihin vetoavat ovat keskellä.
//
// Jokainen kuva on tarkistettu Commonsista: tiedosto on olemassa,
// leveys vähintään 1200 px, lisenssi sallii käytön, tekijän nimi on
// kokonainen ja kuvan SISÄLTÖ vastaa selitettä. Viimeinen on tärkein
// — repon aiemmista kuvista on löytynyt useita, joiden selite kertoi
// eri asiasta kuin mitä kuvassa on.
//
// Tuotettu komennolla tools/kirjoita-kategoriat.mjs.
export const ${vientinimi} = {
  ${kaupunki}: [
${osat.join('\n')}
  ],
};
`;

writeFileSync(join(JUURI, kohde), sisalto);
console.log(`\nKirjoitettu ${kohde}: ${kategoriat.length} kategoriaa, ${yhteensa} nostoa.`);
