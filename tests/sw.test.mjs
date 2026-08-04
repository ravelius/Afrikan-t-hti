// Palvelutyöntekijän SHELL-lista on käsin ylläpidetty. Jos moduuli
// unohtuu siitä, peli toimii verkossa mutta hajoaa offline — eikä sitä
// huomaa kehittäessä. Tämä testi vertaa listaa levyyn molempiin
// suuntiin.

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const JUURI = new URL('..', import.meta.url).pathname;
const sw = readFileSync(join(JUURI, 'sw.js'), 'utf8');
const SHELL = [...sw.matchAll(/'\.\/([^']+)'/g)].map((m) => m[1]);

test('kaikki SHELLin tiedostot ovat olemassa', () => {
  const puuttuu = SHELL.filter((p) => p !== '' && !existsSync(join(JUURI, p)));
  assert.deepEqual(puuttuu, [], 'SHELL viittaa tiedostoihin joita ei ole');
});

/*
 * Työhuoneen omat moduulit eivät kuulu pelin SHELLiin.
 *
 * Sama palvelutyöntekijä palvelee molempia sovelluksia (sama laajuus ei
 * voi kuulua kahdelle), mutta eri strategialla: työhuoneen tiedostot
 * haetaan verkosta ensin eikä niitä esiladata. Niiden lisääminen pelin
 * SHELL-listalle kasvattaisi pelin latauskokoa turhaan — peli ei tarvitse
 * työhuonetta lentokoneessa.
 */
const VAIN_TYOHUONE = /^js\/tyohuone-/;

/*
 * Hakemistot, joiden jokainen .js-tiedosto kuuluu pelin SHELLiin.
 *
 * Lista on hakemistoina eikä tiedostoina, koska juuri kokonainen uusi
 * KANSIO jää muuten huomaamatta: yksittäisen unohtuneen tiedoston
 * huomaa alla oleva vertailu, mutta jos skannaus ei tunne kansiota
 * lainkaan, se ei voi kertoa mistään. Niin kävi js/linssit-kansiolle:
 * peli olisi toiminut kehityksessä ja hajonnut vasta lentokoneessa.
 *
 * Kun tänne syntyy uusi js-alihakemisto, se lisätään tähän listaan.
 */
const SKANNATTAVAT = ['js', 'js/packs', 'js/linssit'];

/**
 * Hakemiston .js-tiedostot repon juuresta laskettuina polkuina.
 *
 * Puuttuva hakemisto ei ole virhe. Kansiot syntyvät kesken työn, ja
 * testin tehtävä on vahtia SHELLiä — ei sanella missä järjestyksessä
 * kansiot ilmestyvät.
 */
function moduulitLevylla(hakemisto) {
  const polku = join(JUURI, hakemisto);
  if (!existsSync(polku)) return [];
  return readdirSync(polku)
    .filter((f) => f.endsWith('.js'))
    .map((f) => `${hakemisto}/${f}`)
    .sort();
}

test('kaikki js-moduulit ovat SHELLissä', () => {
  const levy = SKANNATTAVAT.flatMap(moduulitLevylla);
  const unohtui = levy.filter((p) => !SHELL.includes(p) && !VAIN_TYOHUONE.test(p));
  assert.deepEqual(unohtui, [],
    'nämä moduulit puuttuvat sw.js:n SHELL-listalta — offline hajoaisi. Korjaus on '
    + `sw.js:n SHELL-listaan: ${unohtui.map((p) => `'./${p}',`).join(' ')}`);
});

/*
 * Linssikerroksessa ei ole yhtään SVG-suodatinta.
 *
 * iOS:n webapp-tila palauttaa suodatetun kerroksen TYHJÄNÄ sen jälkeen,
 * kun sovellus on ollut taustalla. Sama vika on korjattu tässä repossa
 * jo kolmesti (js/mapart.js 72–91 ja 236–242, js/ui.js 2986–3004), ja
 * joka kerta se huomattiin vasta omistajan iPadilta — kehityskoneelta
 * suodatin näyttää täsmälleen oikealta. Linssi kattaa koko
 * maailmankartan, joten se ei ole missään olosuhteissa se "pieni
 * kerros", joka aikoinaan sai pitää suodattimensa.
 *
 * js/linssit/kerros.js tarkistaa saman ajon aikana, mutta vasta kun
 * linssi on oikeasti piirretty ruudulle. Tämä testi lukee lähdekoodia,
 * joten se osuu myös rasteroitavaan SVG-merkkijonoon ja linssiin, jota
 * kukaan ei ole vielä avannut kertaakaan.
 *
 * Pehmeys ja kohina esilasketaan kuvaan tai <pattern>-laattaan
 * (malli: grainTile, js/mapart.js 177–222).
 */
const SUODATINSAANNOT = [
  // feTurbulence, feGaussianBlur, feColorMatrix… — pieni fe + iso kirjain
  // on SVG:ssä aina suodatinalkio. Taulukon .filter() ja merkkijono 'fe'
  // eivät osu tähän.
  { nimi: 'suodatinalkio', saanto: /\bfe[A-Z]\w*/ },
  // filter="url(#…)", { filter: … }, 'filter': … ja <filter>. Vertailu
  // nimi === 'filter' (moottorin oma vahti) ei osu, koska sitä ei seuraa
  // kaksoispiste eikä yhtäläisyysmerkki.
  { nimi: 'filter-attribuutti', saanto: /<\s*filter\b|filter\s*=\s*["']|["']filter["']\s*:|\bfilter\s*:/ },
];

/** Kokonaan kommentiksi kirjoitettu rivi — sääntöä saa selittää sanoin. */
const kommenttirivi = (rivi) => /^\s*(\/\/|\/?\*)/.test(rivi);

test('linssimoduuleissa ei ole SVG-suodattimia', () => {
  const loydot = [];
  for (const polku of moduulitLevylla('js/linssit')) {
    readFileSync(join(JUURI, polku), 'utf8').split('\n').forEach((rivi, i) => {
      if (kommenttirivi(rivi)) return;
      for (const { nimi, saanto } of SUODATINSAANNOT) {
        const osuma = rivi.match(saanto);
        if (osuma) loydot.push(`${polku}:${i + 1} ${nimi}: ${osuma[0]}`);
      }
    });
  }
  assert.deepEqual(loydot, [],
    'linssikerroksessa ei saa olla SVG-suodattimia: iOS:n webapp-tila palauttaa '
    + 'suodatetun kerroksen tyhjänä taustalta palatessa. Esilaske pehmeys kuvaan '
    + 'tai <pattern>-laattaan (docs/linssit-suunnitelma.md luku 1.7)');
});

/*
 * Yhden tiedoston versio niputtaa jokaisen karttapaketin.
 *
 * tools/build-standalone.mjs kokoaa vain MODULES-listan tiedostot, ja
 * sen oma checkModuleList huomaa vain listalla jo olevien moduulien
 * puuttuvat riippuvuudet. Kokonaan unohtunut paketti menee siis läpi:
 * dist/matkakirja.html syntyy virheittä mutta vajaana, ja puute näkyy
 * vasta pelatessa. SHELListä puuttumisesta on testi yllä; MODULESista
 * puuttumisesta ei ollut mitään.
 *
 * Linssimoduulit (js/linssit/) EIVÄT kuulu listalle: ne tuodaan
 * dynaamisesti ja yhden tiedoston versio jää tarkoituksella ilman
 * linssejä, kuten se jää ilman valokuvia ja ääniä
 * (docs/linssit-suunnitelma.md luku 2.1). Siksi tämä testi vertaa vain
 * karttapaketteja.
 */
test('yhden tiedoston versio niputtaa kaikki karttapaketit', () => {
  const kokooja = readFileSync(join(JUURI, 'tools/build-standalone.mjs'), 'utf8');
  const lohko = kokooja.match(/const MODULES = \[([\s\S]*?)\n\];/);
  assert.ok(lohko, 'MODULES-listaa ei löytynyt tools/build-standalone.mjs:stä');
  const listatut = lohko[1].split('\n')
    .filter((rivi) => !kommenttirivi(rivi))
    .flatMap((rivi) => [...rivi.matchAll(/'([^']+)'/g)].map((m) => m[1]));

  const unohtui = moduulitLevylla('js/packs').filter((p) => !listatut.includes(p));
  assert.deepEqual(unohtui, [],
    'nämä karttapaketit puuttuvat tools/build-standalone.mjs:n MODULES-listalta — '
    + 'yhden tiedoston versio jäisi vajaaksi');

  const haamut = listatut.filter((p) => p.startsWith('js/packs/') && !existsSync(join(JUURI, p)));
  assert.deepEqual(haamut, [],
    'MODULES-lista viittaa karttapaketteihin joita ei ole — kokoaja kaatuu lukemiseen');
});

test('välimuistin nimi seuraa sovelluksen versiota', () => {
  const versio = readFileSync(join(JUURI, 'js/main.js'), 'utf8')
    .match(/const APP_VERSION = '([^']+)'/)?.[1];
  assert.ok(versio, 'APP_VERSION ei löytynyt');
  const cache = sw.match(/const CACHE = '([^']+)'/)?.[1];
  assert.equal(cache, `matkakirja-${versio}`,
    'sw.js:n CACHE ja js/main.js:n APP_VERSION ovat eri versiossa — '
    + 'vanha välimuisti jäisi voimaan');
});

/*
 * Peiliä ei saa hakea CORS-tilassa.
 *
 * R2:n julkinen pub-*.r2.dev-osoite ei lähetä Access-Control-Allow-Origin
 * -otsaketta. Sinne tehty { mode: 'cors' } -nouto hylätään AINA, jolloin
 * jokainen peilikuva epäonnistuu palvelutyöntekijässä ja peli elää
 * Commons-varareitin varassa. Yksittäinen kuva näyttää silti toimivan,
 * joten vikaa ei huomaa mistään — se paljastuu vasta kun kuvia pyydetään
 * monta kerralla ja Commons alkaa rajoittaa. Juuri niin kävi (omistajan
 * havainto: rikkinäinen kuva Marseillessa, tyhjä pino Ateenassa).
 *
 * Testi lukee lähdekoodia eikä käyttäytymistä, koska palvelutyöntekijää
 * ei voi ajaa Nodessa. Se on karkea mutta osuu juuri siihen riviin,
 * jonka paluu rikkoisi kuvat uudelleen.
 */
test('peilin kuvia ei haeta cors-tilassa', () => {
  const kohta = sw.indexOf('r2.dev');
  assert.ok(kohta > 0, 'sw.js ei enää tunne peiliä — onko ehto poistettu?');
  // Ehdon jälkeinen noutolohko: siinä saa olla cors vain muille lähteille.
  const lohko = sw.slice(kohta, kohta + 2400);
  // Kommenteissa cors mainitaan nimenomaan varoituksena, joten ne pois.
  const corsRivit = lohko.split('\n')
    .filter((r) => !/^\s*(\*|\/\/|\/\*)/.test(r))
    .filter((r) => /mode:\s*'cors'/.test(r));
  assert.ok(
    lohko.includes("osoite.hostname.endsWith('.r2.dev')")
      && /if \(peilista\) return fetch\(event\.request\)/.test(lohko),
    'peilille pitää tehdä pyyntö sellaisenaan (ei cors) — muuten kuvat hajoavat',
  );
  assert.ok(corsRivit.length <= 1,
    'cors-nouto kuuluu vain wikimedia-haaraan');
});

/*
 * Yhdistämismerkkejä ei saa päätyä julkaistuun koodiin.
 *
 * Tänään kävi juuri niin: neljään tiedostoon jäi purkamaton ristiriita
 * (<<<<<<< HEAD), ne commitoitiin, ja KOKO TESTISARJA MENI SILTI LÄPI.
 * Syy on yksinkertainen: yksikään testi ei tuo js/linssit/- eikä
 * css/-tiedostoja, joten rikkinäistä syntaksia ei kukaan jäsentänyt.
 * Peli hajosi selaimessa ensimmäiseen riviin ("Unexpected token '<<'"),
 * ja sen huomasi vain siksi, että satuin ottamaan kuvakaappauksen.
 *
 * Tämä testi lukee tiedostot tekstinä eikä koodina, joten se kattaa myös
 * ne, joita ei voi tuoda: tyylit, HTML ja yhden tiedoston versio.
 */
test('yhdistämismerkkejä ei ole jäänyt tiedostoihin', () => {
  const merkki = /^(<{7}|={7}|>{7})(\s|$)/m;
  const kansiot = ['js', 'js/packs', 'js/linssit', 'css', 'tools', 'tests'];
  const loydot = [];
  for (const kansio of kansiot) {
    const polku = join(JUURI, kansio);
    if (!existsSync(polku)) continue;
    for (const nimi of readdirSync(polku)) {
      if (!/\.(js|mjs|css|html)$/.test(nimi)) continue;
      const tiedosto = join(polku, nimi);
      if (!statSync(tiedosto).isFile()) continue;
      if (merkki.test(readFileSync(tiedosto, 'utf8'))) loydot.push(`${kansio}/${nimi}`);
    }
  }
  for (const juuriTiedosto of ['index.html', 'tyohuone.html', 'sw.js']) {
    const tiedosto = join(JUURI, juuriTiedosto);
    if (existsSync(tiedosto) && merkki.test(readFileSync(tiedosto, 'utf8'))) loydot.push(juuriTiedosto);
  }
  assert.deepEqual(loydot, [],
    'näihin tiedostoihin on jäänyt purkamaton yhdistämisristiriita');
});
