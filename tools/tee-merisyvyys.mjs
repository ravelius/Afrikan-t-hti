/*
 * Meren syvyysvyöhykkeet laudan koordinaatteihin.
 *
 *   node tools/tee-merisyvyys.mjs [--kuiva]
 *
 * Omistajan toive 4.8.2026: "Sama järvissä ja merissä. Niihin voisi
 * tehdä saman kevyen topografian."
 *
 * --- miksi tämä ei ole linssi ---
 *
 * Syvyysaineisto haettiin alun perin topografialinssiä varten, ja
 * linssi näyttää sen täydellä värillä kaikkine kahdentoista
 * vyöhykkeineen. Tämä on eri asia: kartan PYSYVÄ meri, joka saa
 * hyvin kevyen sävyeron matalan ja syvän välille — sama hillitty
 * ajatus kuin maastolla. Siksi mukaan otetaan vain neljä
 * merivyöhykettä, ja piirtopuoli pitää ne vaimeina.
 *
 * Lähde on siis sama tiedosto kuin linssillä (ETOPO1, NOAA, public
 * domain), mutta tulos on oma: linssi ja pohjakartta eivät saa jakaa
 * samaa piirrettyä aineistoa, koska niiden karkeus ja väri ovat eri
 * asioita ja muuttuvat eri syistä.
 *
 * --- miksi vain syvyydet ---
 *
 * Maanpuoleiset vyöhykkeet ovat jo kartalla (js/packs/maasto-korkeus.js
 * ja tools/tee-maasto.mjs). Niiden ottaminen tästä toisen kerran
 * piirtäisi saman ylängön kahdesti hieman eri muodolla.
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { sovitaLinssi } from './linssiprojektio.mjs';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const kuiva = process.argv.includes('--kuiva');

const { KORKEUSLINSSI } = await import(`file://${join(JUURI, 'js/packs/linssi-topografia.js')}`);

/*
 * Neljä vyöhykettä riittää: rannikkomatala, mannerjalusta, syvänmeren
 * pohja ja syvänteet. Sitä useampi menisi tukkoon juuri niin kuin
 * omistaja kielsi maastosta ("ei mikään oikea korkeuskartta, joka on
 * aika hässäkän näköinen").
 */
const SYVYYDET = [-200, -2000, -4000, -6000];

const { viiva, rengas, enimmakseenLaudalla } = sovitaLinssi();

let pudotettu = 0;
const vyohyke = (renkaat) => (renkaat ?? []).flatMap((r) => {
  if (!enimmakseenLaudalla(viiva(r))) { pudotettu += 1; return []; }
  return rengas(r);
});

const vyohykkeet = [];
for (const metria of SYVYYDET) {
  const lahde = KORKEUSLINSSI.vyohykkeet.find((v) => v.metria === metria);
  if (!lahde) {
    console.log(`  ${metria} m puuttuu lähteestä — ohitetaan`);
    continue;
  }
  const renkaat = vyohyke(lahde.renkaat);
  vyohykkeet.push({ metria, renkaat });
  const pisteita = renkaat.reduce((s, r) => s + r.length, 0);
  console.log(`${String(metria).padStart(6)} m  ${String(renkaat.length).padStart(4)} rengasta, ${pisteita} pistettä`);
}
console.log(`laudan ulkopuolelta pudotettu ${pudotettu} muotoa`);

if (kuiva) process.exit(0);

const { kirjoita } = sovitaLinssi();
const tulos = kirjoita({
  ulos: 'js/packs/maailmankartta-syvyys.js',
  tyokalu: 'tools/tee-merisyvyys.mjs',
  asteet: 'js/packs/linssi-topografia.js',
  otsikko: 'Meren syvyysvyöhykkeet laudan koordinaatteina.\n'
    + '//\n'
    + '// Vyöhykkeet ovat SISÄKKÄISIÄ kuten korkeusvyöhykkeetkin: -200 on\n'
    + '// kaikki 200 metriä syvempi, -2000 kaikki sitä syvempi ja niin\n'
    + '// edelleen. Piirrä matalimmasta syvimpään, jolloin näkyviin jäävä\n'
    + '// kaistale on juuri sen vyöhykkeen syvyys.\n'
    + '//\n'
    + '// Nämä kuuluvat kartan LÄHIKUVAAN eivätkä yleisnäkymään: kaukaa\n'
    + '// katsottuna meri on paperia, ja vasta lähellä siihen tulee syvyys.',
  /*
   * Lähdetiedot kirjoitetaan tässä auki, koska js/packs/linssi-topografia.js
   * ei vie niitä kenttänä — ne ovat sen tiedoston otsikkokommentissa.
   * Kopio on tarkoituksellinen: julkaistavan tiedoston on kannettava oma
   * lähdeviitteensä eikä nojata siihen, että joku muistaa katsoa toista.
   */
  lahteet: {
    aineisto: 'NOAA NGDC ETOPO1 Global Relief Model, Ice Surface, 1 kaariminuutti',
    lisenssi: 'Public domain (Yhdysvaltain liittovaltion viraston tuottama)',
    osoite: 'https://coastwatch.pfeg.noaa.gov/erddap/griddap/etopo360',
    haettu: '2026-08-03',
    viite: 'Amante & Eakins 2009, NOAA NCEI, doi:10.7289/V5C8276M',
  },
  vienti: 'MERISYVYYS',
  data: { vyohykkeet },
  kuiva,
});
console.log(`kirjoitettu ${tulos.polku} (${Math.round(tulos.teksti.length / 1024)} kt)`);
