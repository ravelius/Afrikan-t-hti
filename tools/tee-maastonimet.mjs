/*
 * Kokoaa maastonimet yhdeksi laudan koordinaateissa olevaksi paketiksi.
 *
 *   node tools/tee-maastonimet.mjs [--kuiva]
 *
 * Lukee kolme aineistoa
 *   js/packs/maasto-nimet-vedet.js    jokien ja järvien nimet (VESISTONIMET)
 *   js/packs/maasto-nimet-vuoret.js   vuoristojen nimet asteina (VUORISTONIMET)
 *   js/packs/maailmankartta-maasto.js maaston geometria laudalla
 * ja kirjoittaa niistä tiedoston js/packs/maailmankartta-nimet.js.
 *
 * --- miksi oma vaihe ---
 *
 * Sama peruste kuin maastolla (tools/tee-maasto.mjs 11–18): nimiaineisto
 * on maantiedettä ja pysyy samana, vaikka lauta piirrettäisiin uudelleen.
 * Pelin ei kuulu laskea projektiota eikä etsiä jokea nimen perusteella
 * kesken kehyksen — kumpikin tehdään tässä kerran.
 *
 * --- kolme asiaa, jotka tämä ratkaisee piirtäjän puolesta ---
 *
 * 1. VESISTÖNIMI ON LIITOSAVAIN, EI GEOMETRIAA. Nimipaketti tuntee vain
 *    merkkijonon (avain), maastopaketti vain pisteet. Tässä ne liitetään:
 *    saman avaimen pätkistä valitaan PISIN, ja nimi saa sen pisteet.
 *    Avain, jolle ei löydy pätkää, on virhe ja tulostetaan — se
 *    tarkoittaa, että jompikumpi aineisto on muuttunut.
 *
 * 2. NIMI KIRJOITETAAN VASEMMALTA OIKEALLE. <textPath> kulkee polkua
 *    sen omaan suuntaan, ja Volga virtaa laudalla oikealta vasemmalle:
 *    ilman kääntöä nimi olisi ylösalaisin. Pätkä käännetään tässä, ei
 *    piirrossa, koska suunta on aineiston ominaisuus eikä näkymän.
 *
 * 3. OMA LAATTA VOITTAA i-IKONIN. Omistajan toive: kohteelle, joka on jo
 *    pelin kaupunki, ei tule i-ikonia — laatta on parempi. Kaupunkilista
 *    on maailmankartta.js:ssä, ja päällekkäisyys ratkaistaan tässä
 *    nimivertailulla ja etäisyydellä. Piirtäjä lukee valmiin lipun.
 *
 * --- sauma ---
 *
 * Maastopaketin pisteet ovat jo saumattomia (tee-maasto.mjs muunnaViiva),
 * ja renkaista on kierron kopio laudan toisella laidalla. Nimelle kopiota
 * EI tehdä: piirtäjä siirtää nimen laudan leveyden verran siihen kopioon,
 * joka sattuu olemaan näkyvissä. Yksi nimi, yksi paikka.
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { sovitaLinssi } from './linssiprojektio.mjs';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const kuiva = process.argv.includes('--kuiva');
const luku = (n) => Number(n.toFixed(1));

const { piste, kirjoita, leveys: LEVEYS } = sovitaLinssi();

const { VESISTONIMET } = await import(`file://${join(JUURI, 'js/packs/maasto-nimet-vedet.js')}`);
const { VUORISTONIMET } = await import(`file://${join(JUURI, 'js/packs/maasto-nimet-vuoret.js')}`);
const { MAAILMANKARTAN_MAASTO } = await import(`file://${join(JUURI, 'js/packs/maailmankartta-maasto.js')}`);
const { MAAILMANKARTTA } = await import(`file://${join(JUURI, 'js/packs/maailmankartta.js')}`);

// --- pieniä geometria-apureita ----------------------------------------------

/** Murtoviivan pituus laudan yksiköissä. */
const viivanPituus = (pisteet) => {
  let summa = 0;
  for (let i = 1; i < pisteet.length; i++) {
    summa += Math.hypot(pisteet[i][0] - pisteet[i - 1][0], pisteet[i][1] - pisteet[i - 1][1]);
  }
  return summa;
};

/** Renkaan rajauslaatikko. */
const laatikko = (pisteet) => {
  const xs = pisteet.map(([x]) => x);
  const ys = pisteet.map(([, y]) => y);
  return {
    x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys),
  };
};

/*
 * Etäisyys kahden laudan pisteen välillä KIERTÄVÄLLÄ kartalla.
 *
 * Ilman kiertoa Kamtšatka (x ≈ 11900) ja Nome (x ≈ 300) olisivat kartan
 * vastakkaisissa laidoissa, vaikka niiden välissä on vain Beringinsalmi.
 * Kaupunkivertailu tekisi siitä väärän johtopäätöksen molempiin suuntiin.
 */
const etaisyys = ([ax, ay], [bx, by]) => {
  let dx = Math.abs(ax - bx);
  if (dx > LEVEYS / 2) dx = LEVEYS - dx;
  return Math.hypot(dx, ay - by);
};

// --- nimivertailu kaupunkeja vasten -----------------------------------------

/*
 * Nimen ydin vertailua varten.
 *
 * Kaupunki "Kilimandžaro" ja vuori "Kilimandžaro" ovat sama paikka;
 * kaupunki "Alpit" ja vuoristo "Alpit" myös. Mutta vuoristo "Etiopian
 * ylängöt" ja kaupunki "Addis Abeba" eivät ole, vaikka ovat lähekkäin.
 * Siksi ratkaisee NIMI eikä pelkkä etäisyys: joen varrella on kaupunkeja,
 * eikä Kairo tee Niilistä nimetöntä.
 *
 * Lajipääte (järvi, joki, vuoret, ylängöt) karsitaan, jotta "Tšad-järvi"
 * ja "Tšadjärvi" tunnistetaan samaksi.
 */
const PAATTEET = /(järvi|jarvi|joki|vuori|vuoret|vuoristo|ylängöt|ylanko|tunturit)$/;
const ydin = (nimi) => nimi
  .toLowerCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]/g, '')
  .replace(PAATTEET, '');

/*
 * Sama paikka kahdella kirjoitusasulla.
 *
 * Kolme paria, joita mikään sääntö ei löydä: kaupunkilistassa on
 * Kilimandžaro suomalaisittain ja vuoristolistassa Kilimanjaro
 * kansainvälisesti, Victorianjärvi on kartalla kaupunkina vanhalla
 * nimellään Viktoria Nyanza, ja niemimaan nimi Kamtšatka kattaa sen
 * tulivuoret. Lista on käsin ylläpidetty ja tarkoituksella lyhyt:
 * kirjoitusasujen sietäminen säännöllä toisi mukanaan vääriä osumia
 * (Winnipegosisjärvi ei ole Winnipeg).
 */
const SAMA_PAIKKA = new Map([
  ['Kilimanjaro', 'Kilimandžaro'],
  ['Victorianjärvi', 'Viktoria Nyanza'],
  ['Kamtšatkan tulivuoret', 'Kamtšatka'],
]);

const KAUPUNGIT = MAAILMANKARTTA.cities.map((c) => ({
  nimi: c.name, ydin: ydin(c.name), p: [c.x, c.y],
}));

/*
 * Onko kohteella jo oma laattansa?
 *
 * Kaksi ehtoa yhdessä: nimien on tarkoitettava samaa paikkaa JA
 * kaupungin on oltava riittävän lähellä. Nimi ratkaisee ensin, koska
 * pelkkä etäisyys tekisi jokaisesta joesta nimettömän — Kairo on Niilin
 * varrella, mutta se ei ole Niili.
 *
 * Sisältyminen sallitaan vain, jos nimet ovat lähes yhtä pitkiä
 * ("Madagaskarin" ⊃ "Madagaskar"). Ilman pituusrajaa Winnipegosisjärvi
 * — eri järvi kahdensadan kilometrin päässä — menisi Winnipegin
 * kaupungin laatan alle ja jäisi ikuisesti nimeämättä.
 *
 * Etäisyysraja on väljä, koska kaupunki on merkitty kohteen viereen eikä
 * sen keskelle — mutta ei niin väljä, että samanniminen paikka toisella
 * mantereella osuisi.
 */
const LAATTAETAISYYS = 900;
const PITUUSERO = 3;

function omaLaatta(nimi, pisteet) {
  const y = ydin(nimi);
  if (y.length < 4) return null;
  const alias = SAMA_PAIKKA.get(nimi);
  for (const kaupunki of KAUPUNGIT) {
    if (kaupunki.ydin.length < 4) continue;
    const osuu = alias
      ? kaupunki.nimi === alias
      : (kaupunki.ydin.includes(y) || y.includes(kaupunki.ydin))
        && Math.abs(kaupunki.ydin.length - y.length) <= PITUUSERO;
    if (!osuu) continue;
    const lahin = Math.min(...pisteet.map((p) => etaisyys(p, kaupunki.p)));
    if (lahin <= LAATTAETAISYYS) return kaupunki.nimi;
  }
  return null;
}

// --- joet --------------------------------------------------------------------

/*
 * Joen pätkät nimen mukaan. Sama nimi voi esiintyä monta kertaa: iso
 * joki on aineistossa katkottu haaroihin ja pätkiin, ja nimi kuuluu
 * niistä vain yhdelle.
 */
const patkat = new Map();
for (const joki of MAAILMANKARTAN_MAASTO.joet) {
  if (!joki.nimi) continue;
  if (!patkat.has(joki.nimi)) patkat.set(joki.nimi, []);
  patkat.get(joki.nimi).push(joki.pisteet);
}

const puuttuvat = [];
const joet = [];
for (const nimi of VESISTONIMET.joet) {
  const omat = patkat.get(nimi.avain);
  if (!omat?.length) { puuttuvat.push(`joki ${nimi.avain}`); continue; }

  // Pisin pätkä saa nimen: siinä on eniten tilaa kirjoittaa.
  let pisin = omat[0];
  let paras = viivanPituus(pisin);
  for (const p of omat.slice(1)) {
    const pit = viivanPituus(p);
    if (pit > paras) { pisin = p; paras = pit; }
  }

  /*
   * Suunta vasemmalta oikealle. Vertailu on päätepisteiden välillä eikä
   * pätkän jokaisen askelen: mutkitteleva joki kulkee molempiin suuntiin,
   * mutta nimi seuraa sen yleissuuntaa.
   */
  const suunta = pisin.at(-1)[0] - pisin[0][0];
  const pisteet = suunta < 0 ? [...pisin].reverse() : pisin;

  joet.push({
    avain: nimi.avain,
    nimi: nimi.nimi,
    tarkeys: nimi.tarkeys,
    // Pituus on TÄMÄN pätkän pituus eikä nimipaketin yhteispituus:
    // nimi kirjoitetaan tälle kaarelle, ja vain sen tila ratkaisee.
    pituus: luku(paras),
    wiki: nimi.wiki,
    selitys: nimi.selitys,
    laatta: omaLaatta(nimi.nimi, pisteet),
    pisteet,
  });
}

// --- järvet ------------------------------------------------------------------

/*
 * Järven rengas. Sauman yli valuvasta järvestä maastopaketissa on kaksi
 * rengasta (kierron kopio); nimi kuuluu sille, joka on laudalla.
 */
const jarvet = [];
for (const nimi of VESISTONIMET.jarvet) {
  const omat = MAAILMANKARTAN_MAASTO.jarvet
    .filter((j) => j.nimi === nimi.avain)
    .map((j) => j.rengas);
  if (!omat.length) { puuttuvat.push(`järvi ${nimi.avain}`); continue; }
  const laudalla = omat.find((r) => laatikko(r).x0 >= 0 && laatikko(r).x1 <= LEVEYS) ?? omat[0];
  const l = laatikko(laudalla);

  jarvet.push({
    avain: nimi.avain,
    nimi: nimi.nimi,
    tarkeys: nimi.tarkeys,
    // Renkaan leveys eikä nimipaketin halkaisija: nimi kirjoitetaan
    // vaakasuoraan, joten juuri leveys ratkaisee mahtuuko se.
    pituus: luku(l.x1 - l.x0),
    wiki: nimi.wiki,
    selitys: nimi.selitys,
    laatta: omaLaatta(nimi.nimi, laudalla),
    x: luku((l.x0 + l.x1) / 2),
    y: luku((l.y0 + l.y1) / 2),
  });
}

// --- vuoristot ---------------------------------------------------------------

/*
 * Vuoristo on nimipaketissa piste ja kulma, ei geometriaa. Piste
 * projisoidaan tässä; kulma on jo laskettu laudan koordinaateissa
 * (ks. maasto-nimet-vuoret.js:n kenttäkuvaus), joten se kelpaa
 * sellaisenaan.
 */
const vuoret = VUORISTONIMET.map((v) => {
  const [x, y] = piste([v.lon, v.lat]);
  return {
    avain: v.avain,
    nimi: v.nimi,
    tarkeys: v.tarkeys,
    kulma: v.kulma,
    wiki: v.wiki,
    selitys: v.selitys,
    huippu: v.huippu,
    korkeus: v.korkeus,
    laatta: omaLaatta(v.nimi, [[x, y]]),
    x: luku(((x % LEVEYS) + LEVEYS) % LEVEYS),
    y: luku(y),
  };
});

// --- raportti ja kirjoitus ---------------------------------------------------

const laatalliset = [...joet, ...jarvet, ...vuoret].filter((n) => n.laatta);
console.log(`joet    ${joet.length} nimeä, ${joet.reduce((s, j) => s + j.pisteet.length, 0)} pistettä`);
console.log(`järvet  ${jarvet.length} nimeä`);
console.log(`vuoret  ${vuoret.length} nimeä`);
if (puuttuvat.length) {
  console.log(`EI VASTINETTA maastoaineistossa (${puuttuvat.length}): ${puuttuvat.join(', ')}`);
}
console.log(`oma laatta / kaupunki jo olemassa (${laatalliset.length}):`);
for (const n of laatalliset) console.log(`  ${n.nimi} → kaupunki ${n.laatta}`);

kirjoita({
  ulos: 'js/packs/maailmankartta-nimet.js',
  tyokalu: 'tools/tee-maastonimet.mjs',
  asteet: 'js/packs/maasto-nimet-vuoret.js ja js/packs/maasto-nimet-vedet.js',
  otsikko: 'Maastonimet maailmankartalle: joet, järvet ja vuoristot laudan koordinaateissa.',
  lahteet: [
    {
      aineisto: 'Natural Earth 10m (ne_10m_rivers_lake_centerlines, ne_10m_lakes) — '
        + 'nimet siivottu ja suomennettu käsin, ks. tools/nimea-vedet.mjs',
      lisenssi: 'Public domain',
      osoite: 'https://www.naturalearthdata.com/',
      haettu: '2026-08-04',
    },
    {
      aineisto: 'Vuoristojen nimet, sijainnit ja kulmat käsin koottuna, '
        + 'ks. js/packs/maasto-nimet-vuoret.js',
      lisenssi: 'Matkakirjan omaa aineistoa (MIT)',
      haettu: '2026-08-04',
    },
  ],
  vienti: 'MAAILMANKARTAN_NIMET',
  data: { joet, jarvet, vuoret },
  kuiva,
});
