/*
 * Kirkkaat tähdet, tähtikuviot ja sekstantin opit -> js/packs/linssi-tahdet.js
 *
 *   NODE_USE_ENV_PROXY=1 node tools/hae-tahdet.mjs [--kuiva] [--raja 5.0]
 *
 * --- miksi tämä aineisto on eri maailmassa kuin kaikki muu ---
 *
 * Jokainen muu pelin aineisto on lon/lat: joet, rajat, kielialueet, yön
 * valot. Ne kaikki päätyvät lopulta laudan pikseleiksi samalla Millerin
 * sovituksella. Tähdet EIVÄT päädy. Ne ovat taivaanpallolla, eivät
 * maapallolla, ja niiden koordinaatit ovat rektaskensio ja deklinaatio.
 * Deklinaatio muistuttaa leveysastetta sen verran, että sen voi vahingossa
 * syöttää karttaprojektioon — ja tulos näyttäisi kartalta, koska pisteitä
 * on tuhat ja ne asettuisivat siististi. Se olisi silti täyttä hölynpölyä:
 * Sirius ei ole Kongon yllä, se on koko taivaan yllä.
 *
 * Siksi tämä työkalu ei projisoi mitään. Se hakee taivaan sellaisenaan ja
 * jättää näkymän laskennan linssille, joka tietää pelaajan leveysasteen.
 * Sama varoitus on kirjoitettu tuotetun tiedoston otsikkoon isoin
 * kirjaimin, koska sitä tiedostoa lukee joku muu kuin tämän kirjoittaja.
 *
 * --- miksi juuri nämä lähteet ---
 *
 * Tähdet: Yale Bright Star Catalogue (BSC5). Se on vanha (1991) ja siksi
 * juuri oikea: se sisältää tähdet magnitudiin 6,5 asti eli täsmälleen sen,
 * mitä paljas silmi näkee, eikä miljoonaa Gaian mittaamaa pistettä, joita
 * kukaan ei näe. Tähtien paikat eivät ole muuttuneet kolmessakymmenessä
 * vuodessa peliin vaikuttavalla tavalla — oma liike on kirkkaimmillakin
 * tähdillä sekunnin murto-osia vuodessa.
 *
 * Tähtikuviot: Marc van der Sluysin ConstellationLines, CC BY 4.0.
 * Ratkaisevaa on, että se viittaa tähtiin BSC-numeroilla, samoilla joita
 * yllä oleva katalogi käyttää — kuvioiden ja tähtien välissä ei siis ole
 * yhtään nimien sovitusta, joka voisi mennä pieleen. Useimmat vapaat
 * kuvioaineistot (Stellarium, Dominic Fordin kokoelma) ovat GPL-lisensoituja
 * eivätkä sovi tähän MIT-repoon; tämä sopii.
 *
 * Tähtikuvioiden viivat eivät ole luonnonlaki. Yhtään virallista standardia
 * ei ole siitä, mitkä tähdet yhdistetään: jokainen tähtikartta piirtää omat
 * tikku-ukkonsa. Siksi viivat otetaan yhdestä nimetystä lähteestä eikä
 * kyhätä käsin — käsin kyhätty olisi yhtä pätevä mutta lähteetön.
 *
 * Nimet: IAU:n virallinen tähtien nimiluettelo (IAU-CSN) antaa Sirius,
 * Betelgeuse ja muut. Suomenkieliset tähdistönimet tulevat Wikipedian
 * taulukosta, koska niistä ei ole muuta koneluettavaa lähdettä; taulukon
 * lyhenteet ristiintarkistetaan katalogin omia lyhenteitä vasten.
 *
 * Verkko: Noden fetch ei lue HTTPS_PROXYa ilman NODE_USE_ENV_PROXY=1,
 * ks. tools/hae-radiot.mjs. Skripti käynnistää itsensä uudelleen, jos
 * muuttuja puuttuu.
 */
import { spawnSync } from 'node:child_process';
import { gunzipSync } from 'node:zlib';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

if (!process.env.NODE_USE_ENV_PROXY && (process.env.HTTPS_PROXY || process.env.https_proxy)) {
  const ajo = spawnSync(process.execPath, [fileURLToPath(import.meta.url), ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1', NODE_NO_WARNINGS: '1' },
  });
  process.exit(ajo.status ?? 1);
}

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const KOHDE = join(JUURI, 'js', 'packs', 'linssi-tahdet.js');
// Lähdetiedostot ovat yhteensä pari megatavua eivätkä kuulu repoon.
const VALIMUISTI = process.env.TAHTI_VALIMUISTI || join(tmpdir(), 'matkakirja-tahdet');

const argv = process.argv.slice(2);
const kuiva = argv.includes('--kuiva');
const valitsin = (lippu, oletus) => {
  const i = argv.indexOf(lippu);
  return i >= 0 ? Number(argv[i + 1]) : oletus;
};

/*
 * Kirkkausraja 5,0.
 *
 * Paljas silmi näkee hyvissä oloissa magnitudiin 6, mutta kaupungissa
 * tuskin neljättä. Viisi on kompromissi, jolla kuviot pysyvät koossa
 * mutta taivas ei muutu puuroksi: rajan alle jää noin 1600 tähteä, kun
 * kuudessa niitä olisi 5000 ja tiedosto kolminkertainen.
 */
const KIRKKAUSRAJA = valitsin('--raja', 5.0);

// --- lähteet ----------------------------------------------------------------

const LAHTEET = {
  tahdet: {
    osoite: 'https://cdsarc.cds.unistra.fr/ftp/V/50/catalog.gz',
    tiedosto: 'bsc5.dat.gz',
    pakattu: true,
    aineisto: 'Yale Bright Star Catalogue, 5th Revised Ed. (Preliminary Version), 9110 tähteä',
    viite: 'Hoffleit D., Warren Jr W.H. 1991, Astronomical Data Center, NSSDC/ADC. '
      + 'Bibcode 1991bsc..book.....H. VizieR-luettelo V/50.',
    lisenssi: 'Yhdysvaltain NASA:n Astronomical Data Centerin kokoama luettelo, jota '
      + 'CDS jakaa vapaasti. Erillistä lisenssitekstiä ei ole; CDS pyytää '
      + 'mainitsemaan VizieR-palvelun (DOI 10.26093/cds/vizier) ja luettelon tekijät.',
  },
  kuviot: {
    osoite: 'https://raw.githubusercontent.com/MarcvdSluys/ConstellationLines/master/ConstellationLines.dat',
    tiedosto: 'ConstellationLines.dat',
    aineisto: 'ConstellationLines: 88 tähdistön tikkukuviot BSC-numeroina',
    viite: 'van der Sluys, Marc (2005-2023), hemel.waarnemen.com. DOI 10.5281/zenodo.10397192.',
    lisenssi: 'CC BY 4.0 (repon LICENSE, readme.org ja CITATION.cff). HUOM: '
      + 'itse .dat-tiedoston otsikkorivi sanoo CC BY-SA 4.0 — ristiriita on '
      + 'lähteessä. Tässä noudatetaan repon virallista lisenssiä ja mainitaan ero.',
  },
  nimet: {
    osoite: 'https://www.pas.rochester.edu/~emamajek/WGSN/IAU-CSN.txt',
    tiedosto: 'IAU-CSN.txt',
    aineisto: 'IAU Catalog of Star Names (IAU-CSN), tähtien viralliset erisnimet',
    viite: 'IAU Division C Working Group on Star Names (WGSN), päivitetty 2022-04-04.',
    lisenssi: 'CC BY — "All IAU-produced products (Images, Videos, Texts) are '
      + 'released under Creative Commons Attribution".',
  },
  suomi: {
    osoite: 'https://fi.wikipedia.org/w/api.php?action=parse&page=T%C3%A4hdist%C3%B6'
      + '&prop=wikitext&format=json&formatversion=2',
    tiedosto: 'fiwiki-tahdisto.json',
    aineisto: 'Wikipedia-artikkelin "Tähdistö" taulukko: 88 tähdistön suomenkieliset '
      + 'ja latinankieliset nimet, lyhenteet ja genetiivit',
    viite: 'Wikipedia (fi), artikkeli "Tähdistö".',
    lisenssi: 'Wikipedian teksti on CC BY-SA 4.0. Tästä on otettu vain nimiä ja '
      + 'lyhenteitä, jotka ovat tosiasioita eivätkä tekijänoikeuden alaisia; '
      + 'lähde mainitaan silti.',
  },
};

// --- nouto -------------------------------------------------------------------

// Wikipedia vastaa tuntemattomalle asiakkaalle 429 (liikaa pyyntöjä)
// ilman tunnistetta, joten sama otsake kuin muissakin hakutyökaluissa.
const OTSAKKEET = { 'user-agent': 'Matkakirja/1.0 (opetuspeli)' };

async function nouda(avain) {
  const lahde = LAHTEET[avain];
  mkdirSync(VALIMUISTI, { recursive: true });
  const polku = join(VALIMUISTI, lahde.tiedosto);
  if (!existsSync(polku)) {
    process.stdout.write(`  haetaan ${lahde.tiedosto} ... `);
    const vastaus = await fetch(lahde.osoite, { redirect: 'follow', headers: OTSAKKEET });
    if (!vastaus.ok) throw new Error(`${lahde.osoite} vastasi ${vastaus.status}`);
    writeFileSync(polku, Buffer.from(await vastaus.arrayBuffer()));
    console.log('ok');
  }
  const raaka = readFileSync(polku);
  const sisalto = lahde.pakattu ? gunzipSync(raaka) : raaka;
  // BSC on 1990-luvun ASCII-tiedosto: latin1 estää tavujen sotkeutumisen.
  return sisalto.toString(avain === 'tahdet' ? 'latin1' : 'utf8');
}

// --- Bright Star Catalogue ---------------------------------------------------

/*
 * BSC on kiinteäleveyksinen: sarakkeet ovat tavupaikkoja, eivät välilyöntejä.
 * Paikat ovat luettelon oman ReadMe-tiedoston mukaiset (V/50). Ne on
 * kirjoitettu tähän auki, koska yhden tavun heitto siirtäisi koko taivaan
 * eikä sitä huomaisi mistään — tarkistukset alempana kiinnittävät paikat
 * tunnettuihin tähtiin.
 */
const SARAKE = {
  hr: [1, 4], nimi: [5, 14], hd: [26, 31],
  raH: [76, 77], raM: [78, 79], raS: [80, 83],
  decMerkki: [84, 84], decD: [85, 86], decM: [87, 88], decS: [89, 90],
  vmag: [103, 107], bv: [110, 114], spektri: [128, 147],
};

const pala = (rivi, [a, b]) => rivi.slice(a - 1, b);

/*
 * Nimikenttä on kymmenen tavua: Flamsteedin numero, Bayerin kreikkalainen
 * kirjain kolmikirjaimisena lyhenteenä, mahdollinen yläindeksi ja tähdistön
 * lyhenne. Esimerkiksi " 50Alp UMa" ja "   Alp1Cru".
 */
function lueTunnus(kentta) {
  const flamsteed = kentta.slice(0, 3).trim();
  const bayer = kentta.slice(3, 6).trim();
  const indeksi = kentta.slice(6, 7).trim();
  const kuvio = kentta.slice(7, 10).trim();
  return {
    flamsteed: flamsteed ? Number(flamsteed) : null,
    bayer: bayer ? (bayer + indeksi).toLowerCase() : null,
    kuvio: kuvio || null,
  };
}

function lueTahdet(teksti) {
  const tahdet = new Map();
  let ohitettu = 0;
  for (const rivi of teksti.split('\n')) {
    if (rivi.length < 100) { ohitettu += 1; continue; }
    const vmag = pala(rivi, SARAKE.vmag).trim();
    const raH = pala(rivi, SARAKE.raH).trim();
    // Neljätoista numeroa on novia tai galakseja, joilta paikka ja kirkkaus
    // on poistettu mutta numero jätetty, jotta luettelon numerointi säilyy.
    if (!vmag || !raH) { ohitettu += 1; continue; }

    const ra = 15 * (Number(pala(rivi, SARAKE.raH))
      + Number(pala(rivi, SARAKE.raM)) / 60
      + Number(pala(rivi, SARAKE.raS)) / 3600);
    const merkki = pala(rivi, SARAKE.decMerkki) === '-' ? -1 : 1;
    const dec = merkki * (Number(pala(rivi, SARAKE.decD))
      + Number(pala(rivi, SARAKE.decM)) / 60
      + Number(pala(rivi, SARAKE.decS)) / 3600);
    const bv = pala(rivi, SARAKE.bv).trim();
    const hd = pala(rivi, SARAKE.hd).trim();

    const hr = Number(pala(rivi, SARAKE.hr));
    tahdet.set(hr, {
      hr,
      hd: hd ? Number(hd) : null,
      ra,
      dec,
      mag: Number(vmag),
      bv: bv ? Number(bv) : null,
      spektri: pala(rivi, SARAKE.spektri).trim() || null,
      nimi: null,
      ...lueTunnus(pala(rivi, SARAKE.nimi)),
    });
  }
  return { tahdet, ohitettu };
}

// --- tähtikuvioiden viivat ---------------------------------------------------

function lueKuvioviivat(teksti) {
  const viivat = new Map();
  for (const rivi of teksti.split('\n')) {
    if (!rivi.trim() || rivi.startsWith('#')) continue;
    const osat = rivi.trim().split(/\s+/);
    const lyhenne = osat[0];
    const maara = Number(osat[1]);
    const tahdet = osat.slice(2).map(Number);
    if (tahdet.length !== maara) {
      throw new Error(`${lyhenne}: rivi lupaa ${maara} tähteä mutta antaa ${tahdet.length}`);
    }
    if (!viivat.has(lyhenne)) viivat.set(lyhenne, []);
    viivat.get(lyhenne).push(tahdet);
  }
  return viivat;
}

// --- IAU:n viralliset nimet --------------------------------------------------

/*
 * IAU-CSN on myös kiinteäleveyksinen, mutta vain alkuosastaan: loppu
 * (WDS, magnitudi, HIP, HD, paikka, päiväys) on välilyönnein eroteltu.
 * Sekamuoto on tahallinen valinta, koska pelkkä välilyöntijako kaatuu
 * riveihin joilta komponenttisarake puuttuu (esim. Mebsuta) ja pelkkä
 * kiinteä leveys kaatuisi, jos IAU joskus levittää sarakkeitaan.
 */
function lueViralliset(teksti) {
  const hrNimet = new Map();
  const hdNimet = new Map();
  const ohi = [];
  for (const rivi of teksti.split('\n')) {
    if (!rivi.trim() || rivi.startsWith('#') || rivi.startsWith('$')) continue;
    const nimi = rivi.slice(0, 18).trim();
    const tunnus = rivi.slice(36, 49).trim();
    const kuvio = rivi.slice(61, 65).trim();
    const loppu = rivi.slice(70).trim().split(/\s+/);
    if (!nimi || loppu.length < 7) { ohi.push({ nimi: nimi || rivi.slice(0, 40), mag: NaN }); continue; }
    const [, mag, , , hd] = loppu;
    const tietue = { nimi, kuvio, mag: Number(mag) };
    const hr = /^HR\s+(\d+)$/.exec(tunnus)?.[1];
    if (hr) hrNimet.set(Number(hr), tietue);
    else if (hd && hd !== '_') hdNimet.set(Number(hd), tietue);
    else ohi.push({ nimi, mag: Number(mag) });
  }
  return { hrNimet, hdNimet, ohi };
}

// --- suomenkieliset tähdistönimet --------------------------------------------

const siistiWiki = (solu) => solu
  .replace(/\[\[([^\]|]*\|)?([^\]]*)\]\]/g, '$2')
  .replace(/<ref[^>]*\/>/g, '')
  .replace(/<[^>]*>/g, '')
  .replace(/''/g, '')
  .trim();

function lueSuomenkieliset(json) {
  const teksti = String(JSON.parse(json).parse.wikitext);
  const alku = teksti.indexOf('== Luettelo tähdistöistä ==');
  if (alku < 0) throw new Error('Wikipedian artikkelista ei löydy tähdistöluetteloa');
  const taulu = teksti.slice(alku, teksti.indexOf('|}', alku));

  const nimet = new Map();
  const epailyt = [];
  for (const lohko of taulu.split('\n|-\n').slice(1)) {
    const solut = lohko.split('\n')[0].replace(/^\|\s*/, '').split('||').map(siistiWiki);
    if (solut.length < 4) continue;
    // Yhdessä rivissä on rikkinäinen wikilinkki ("tähdistö)|Corona
    // Australis"). Putken jälkeinen osa on aina se oikea nimi.
    const latina = solut[1].includes('|') ? solut[1].slice(solut[1].lastIndexOf('|') + 1).trim() : solut[1];
    const rivi = { suomi: solut[0], latina, lyhenne: solut[2], genetiivi: solut[3] };
    // Latinankielisen nimen ja genetiivin pitää alkaa samoin. Halpa
    // tarkistus, joka nappaa juuri edellä mainitun kaltaiset sotkut.
    if (latina.slice(0, 2).toLowerCase() !== rivi.genetiivi.slice(0, 2).toLowerCase()) {
      epailyt.push(`${rivi.lyhenne}: "${latina}" vs. "${rivi.genetiivi}"`);
    }
    nimet.set(rivi.lyhenne, rivi);
  }
  return { nimet, epailyt };
}

// --- käsin kirjoitettu osuus -------------------------------------------------
//
// Kaikki alla oleva suomenkielinen selitysteksti on kirjoitettu käsin tässä
// tiedostossa, ei johdettu aineistosta. Se on merkitty myös tuotetun
// tiedoston otsikkoon. Tähtiin viitataan Bayerin tunnuksilla eikä
// BSC-numeroilla, jotta numero tulee aina katalogista eikä muistista:
// tunnistaTahti kaataa ajon, jos tunnus ei osu mihinkään.

const KUVIOHUOMIOT = {
  UMa: 'Seitsemän kirkkainta tähteä muodostavat Otavan. Se on asterismi eli '
    + 'kuvio kuvion sisällä: koko Iso karhu on paljon laajempi ja himmeämpi. '
    + 'Otavan kauhan takareuna osoittaa Pohjantähteen, ja Suomen leveysasteilla '
    + 'kuvio ei laske horisontin alle koskaan.',
  UMi: 'Kauhan varren päässä on Pohjantähti. Kuviota sanotaan myös Pieneksi '
    + 'Otavaksi, ja se on paljon himmeämpi kuin iso sisarensa: kaupungin '
    + 'valoissa siitä näkyy usein vain Pohjantähti ja kaksi kirkkainta '
    + 'kauhan tähteä, Kochab ja Pherkad.',
  Ori: 'Taivaan tunnistettavin kuvio, ja koska se istuu taivaanekvaattorilla, '
    + 'se näkyy kaikkialta maapallolta. Vyön kolme tähteä ovat suomeksi '
    + 'Väinämöisen vyö; koko kuviosta on käytetty myös nimiä Väinämöisen '
    + 'viikate ja Kalevan miekka. Vyö nousee lähes tarkalleen idästä ja '
    + 'laskee länteen, mistä se kelpaa suunnan tarkistukseen.',
  Cru: 'Taivaan pienin tähdistö ja eteläisen pallonpuoliskon tärkein '
    + 'suuntamerkki. Ristin pitkä akseli osoittaa taivaan etelänapaa, jonka '
    + 'kohdalla ei ole kirkasta tähteä. Etelän risti on lipussa Australialla, '
    + 'Uudella-Seelannilla, Brasilialla, Samoalla ja Papua-Uudella-Guinealla.',
  Cas: 'W-kirjain Pohjantähden toisella puolella kuin Otava. Siitä on hyötyä: '
    + 'kun Otava on matalalla, Kassiopeia on korkealla, joten pohjoinen löytyy '
    + 'vuodenajasta riippumatta. Kulkee Linnunradan poikki.',
  Sco: 'Skorpionin sydämessä hehkuu punainen Antares, jonka nimi tarkoittaa '
    + '"Mars-haastajaa" — planeetta ja tähti ovat samanvärisiä. Kuvio on '
    + 'harvinaisen tunnistettava: koukkuun kääntyvä pyrstö näyttää oikeasti '
    + 'skorpionilta. Suomesta näkyy kesäöisin vain yläosa etelähorisontissa.',
  Tau: 'Punainen Aldebaran on härän silmä ja sen ympärillä oleva V-kirjain '
    + 'Hyadit, lähin avoin tähtijoukko. Samassa tähdistössä ovat Seulaset '
    + 'eli Plejadit, joka on hyvä näön koe: useimmat erottavat kuusi tähteä, '
    + 'tarkkasilmäiset seitsemän tai enemmän.',
  Leo: 'Leijonan pään muodostaa sirppi, joka näyttää takaperin käännetyltä '
    + 'kysymysmerkiltä. Sen tyvessä on Regulus lähes tarkalleen ekliptikalla, '
    + 'joten Kuu ja planeetat kulkevat sen ohitse.',
  Cyg: 'Pohjoinen risti, joka lentää pitkin Linnunrataa. Pyrstössä oleva Deneb '
    + 'on kesäkolmion pohjoisin kärki ja yksi taivaan kirkkaimmista tähdistä '
    + 'siitä huolimatta, että se on satoja kertoja kauempana kuin Vega.',
  Lyr: 'Pieni kuvio, jonka Vega on pohjoisen taivaan kirkkaimpia tähtiä. '
    + 'Prekession takia Vega oli napatähti noin 12 000 vuotta sitten ja on '
    + 'sitä taas 12 000 vuoden kuluttua.',
  Aql: 'Altair on kesäkolmion eteläinen kärki ja yksi lähimmistä kirkkaista '
    + 'tähdistä. Se pyörii ympäri alle kymmenessä tunnissa ja on siksi '
    + 'mitattavasti litteä.',
  Gem: 'Kaksosten päät ovat Castor ja Pollux. Pollux on kirkkaampi, vaikka '
    + 'kreikkalainen aakkosjärjestys antaisi ymmärtää toisin — Bayer merkitsi '
    + 'kirjaimet silmämääräisesti.',
  CMa: 'Sirius on koko taivaan kirkkain tähti, ja se on kirkas lähinnä siksi, '
    + 'että se on lähellä: alle yhdeksän valovuoden päässä. Egyptissä sen '
    + 'ilmestyminen aamutaivaalle ennusti Niilin tulvaa.',
  CMi: 'Käytännössä yhden tähden tähdistö: Procyon on talvikolmion kolmas '
    + 'kärki Siriuksen ja Betelgeuzen kanssa.',
  Boo: 'Leijamainen kuvio, jonka löytää jatkamalla Otavan varren kaarta: '
    + 'kaari vie Arcturukseen, pohjoisen taivaan kirkkaimpaan tähteen. '
    + 'Sama kaari jatkuu Neitsyen Spicaan.',
  Vir: 'Eläinradan suurin tähdistö. Spica on viljantähkä neitsyen kädessä, ja '
    + 'sen nousu aamutaivaalle merkitsi Välimerellä sadonkorjuun aikaa.',
  Sgr: 'Kirkkaimmat tähdet muodostavat teekannun. Kannun nokan suunnassa on '
    + 'Linnunradan keskus: paksuin osa tähtitaivasta osuu juuri tähän.',
  Cen: 'Alfa Centauri on Aurinkoa lähin tähtijärjestelmä, noin 4,4 valovuoden '
    + 'päässä. Se ja Beta Centauri ovat Etelän ristin osoittimet: ne '
    + 'erottavat oikean ristin väärästä, sillä lähistöllä on toinenkin '
    + 'ristin muotoinen tähtiryhmä.',
  Car: 'Canopus on taivaan toiseksi kirkkain tähti ja avaruusluotainten '
    + 'suunnistustähti vielä nykyään. Köli on osa muinaista Argo-laivan '
    + 'tähdistöä, joka jaettiin kolmeen 1700-luvulla.',
  And: 'Andromedan galaksi on tässä kuviossa: himmeä soikea täplä, joka on '
    + 'kaukaisin paljain silmin näkyvä kohde, kaksi ja puoli miljoonaa '
    + 'valovuotta.',
  Peg: 'Pegasoksen neliö on iso ja tyhjä: neljä kirkasta kulmaa ja niiden '
    + 'sisällä tuskin mitään. Neliön koillinen kulma kuuluu nykyään '
    + 'Andromedaan, ei Pegasokseen.',
  Per: 'Algol on tunnetuin pimenevä kaksoistähti: kirkkaus putoaa joka '
    + 'kolmas päivä muutamaksi tunniksi, koska kumppani kulkee sen edestä. '
    + 'Nimi tulee arabian sanasta "paholainen".',
  Aur: 'Capella on kuudenneksi kirkkain tähti ja Suomen leveysasteilla '
    + 'ympärivuotinen. Kuvio on viisikulmio, jonka yksi kärki on '
    + 'lainassa Härältä.',
  Cep: 'Delta Cephei antoi nimen kefeideille, muuttuville tähdille joiden '
    + 'jakso kertoo todellisen kirkkauden. Niillä mitataan etäisyyksiä '
    + 'toisiin galakseihin — koko avaruuden mittatikku alkaa tästä.',
  Dra: 'Thuban oli napatähti pyramidien rakennusaikaan noin 2700 eaa. '
    + 'Maapallon akseli kiertää 26 000 vuoden kartiota, joten napatähti '
    + 'vaihtuu — Pohjantähti on vain nykyinen vuoro.',
  Cnc: 'Himmeä kuvio, jonka keskellä on Seimi (Praesepe), sumuiselta '
    + 'näyttävä tähtijoukko. Sen erottaminen paljain silmin oli vanha '
    + 'sään ennustuskeino: jos Seimi ei näy, ilmassa on kosteutta.',
  Ari: 'Kevätpäiväntasauspiste oli Oinaassa antiikin aikana, ja siksi '
    + 'sitä sanotaan yhä Oinaan pisteeksi. Prekessio on siirtänyt sen '
    + 'sittemmin Kaloihin.',
  Psc: 'Kevätpäiväntasauspiste on nykyään täällä: se on rektaskension '
    + 'nollakohta, taivaan Greenwich.',
  Oph: 'Ekliptika kulkee Käärmeenkantajan läpi, joten Aurinko viettää '
    + 'siinä pari viikkoa vuodessa — silti sitä ei lasketa eläinradan '
    + 'merkiksi. Merkit ovat 2000 vuotta vanha jako, tähdistöt eivät.',
  Hya: 'Taivaan laajin tähdistö: se venyy neljänneksen taivaan ympäri, '
    + 'mutta on niin himmeä että sen huomaa harvoin.',
  Eri: 'Pitkä mutkitteleva joki, joka alkaa Orionin jalasta ja päättyy '
    + 'kirkkaaseen Achernariin syvällä etelässä. Achernar tarkoittaa '
    + '"joen päätä".',
  PsA: 'Fomalhaut on syyskuun iltataivaan yksinäinen kirkas tähti '
    + 'eteläisellä taivaalla — sen ympärillä ei ole muuta kirkasta, mistä '
    + 'nimitys "yksinäinen".',
  Oct: 'Etelänavan tähdistö. Sen Sigma-tähti on etelän napatähti, mutta niin '
    + 'himmeä että sitä ei käytännössä voi käyttää suunnistukseen. Siksi '
    + 'etelässä navigoidaan Etelän ristillä eikä napatähdellä.',
  Lyn: 'Hevelius nimesi tämän ilvekseksi, koska hänen mukaansa sen '
    + 'näkemiseen tarvitaan ilveksen silmät. Kuviossa ei ole yhtään '
    + 'kirkasta tähteä.',
  Cir: 'Yksi Lacaillen 1700-luvulla nimeämistä työkalutähdistöistä: harppi, '
    + 'kello, ilmapumppu, mikroskooppi. Valistuksen aika näkyy taivaalla '
    + 'yhtä selvästi kuin antiikin myytit.',
};

/*
 * Asterismit: kuvioita, joita virallinen tähdistöjako ei tunne mutta jotka
 * ihmiset tunnistavat. Otava on tässä tärkein — se on suomalaisille se
 * kuvio, jonka kaikki osaavat, mutta luettelossa sitä ei ole olemassa.
 *
 * Tähdet on kirjoitettu Bayerin ja Flamsteedin tunnuksina, jotta numerot
 * tulevat katalogista. "eta Tau" on Alcyone, "17 Tau" on Electra.
 */
const ASTERISMIT = [
  {
    avain: 'otava',
    nimi: 'Otava',
    muualla: 'Big Dipper, Karlavagnen, Großer Wagen, Plough',
    kuvio: 'UMa',
    viivat: [['alp UMa', 'bet UMa', 'gam UMa', 'del UMa', 'alp UMa'], ['del UMa', 'eps UMa', 'zet UMa', 'eta UMa']],
    huomio: 'Nimi tulee otavasta eli patoverkosta, jollaisella kalastettiin. '
      + 'Otava mainitaan Kalevalassa ajan kulun opettajana. Muita suomalaisia '
      + 'nimiä ovat seitsentähtinen ja toivontähdet. Kauha on kuviona niin '
      + 'vahva, että sama seitsikko on aura Irlannissa, vaunut '
      + 'Skandinaviassa ja pohjoinen vakka Kiinassa.',
  },
  {
    avain: 'seulaset',
    nimi: 'Seulaset',
    muualla: 'Plejadit, M45, Pleiades',
    kuvio: 'Tau',
    // Tähtijoukko, ei kuvio: pisteet piirretään ilman viivoja.
    pisteet: ['eta Tau', '27 Tau', '17 Tau', '20 Tau', '23 Tau', '19 Tau', '28 Tau', '16 Tau'],
    huomio: 'Avoin tähtijoukko, jonka tähdet ovat oikeasti toistensa naapureita '
      + 'eivätkä vain samassa suunnassa. Seulasten nousu ja lasku jakoi vuoden '
      + 'monissa kulttuureissa. Nebran kiekossa, joka on yli 3600 vuotta vanha, '
      + 'ne ovat vanhin tunnettu tähtikuvaus.',
  },
  {
    avain: 'vainamoisen-vyo',
    nimi: 'Väinämöisen vyö',
    muualla: 'Orionin vyö, Orion\'s Belt',
    kuvio: 'Ori',
    viivat: [['del Ori', 'eps Ori', 'zet Ori']],
    huomio: 'Kolme lähes samankirkkasta tähteä suorassa rivissä — taivaalla ei '
      + 'ole toista yhtä siistiä kuviota. Vyö on melkein taivaanekvaattorilla, '
      + 'joten se nousee idästä ja laskee länteen kaikkialla maailmassa.',
  },
  {
    avain: 'kesakolmio',
    nimi: 'Kesäkolmio',
    muualla: 'Summer Triangle',
    viivat: [['alp Lyr', 'alp Cyg', 'alp Aql', 'alp Lyr']],
    huomio: 'Kolme kirkasta tähteä kolmesta eri tähdistöstä: Vega, Deneb ja '
      + 'Altair. Pohjoisen kesäyön vaaleudessa nämä ovat usein ainoat tähdet, '
      + 'jotka näkyvät — siitä nimi.',
  },
  {
    avain: 'talvikolmio',
    nimi: 'Talvikolmio',
    muualla: 'Winter Triangle',
    viivat: [['alp CMa', 'alp Ori', 'alp CMi', 'alp CMa']],
    huomio: 'Sirius, Betelgeuze ja Procyon. Kolmio näkyy talvi-iltoina '
      + 'etelätaivaalla ja on kesäkolmion vastapari.',
  },
  {
    avain: 'pegasoksen-nelio',
    nimi: 'Pegasoksen neliö',
    muualla: 'Great Square of Pegasus',
    viivat: [['alp Peg', 'bet Peg', 'alp And', 'gam Peg', 'alp Peg']],
    huomio: 'Iso ja lähes tyhjä nelikulmio syystaivaalla. Sen sisällä näkyvien '
      + 'tähtien määrä on kelvollinen mittari sille, kuinka pimeä taivas on: '
      + 'kaupungissa ei yhtään, erämaassa kymmeniä.',
  },
];

/*
 * Osoittimet: kaksi tähteä, joiden välinen jana jatkettuna osuu johonkin.
 * Kerroin lasketaan aineistosta eikä muistista — se on juuri sellainen
 * luku, jonka voisi muistaa väärin ja jota kukaan ei tarkistaisi.
 */
const OSOITTIMET = [
  {
    avain: 'otava-pohjantahti',
    nimi: 'Otavan takapyörät',
    alku: 'bet UMa',
    loppu: 'alp UMa',
    kohdeTahti: 'alp UMi',
    huomio: 'Merak ja Dubhe ovat kauhan takareuna. Jana niiden välillä '
      + 'jatkettuna osuu Pohjantähteen. Tämä on pohjoisen pallonpuoliskon '
      + 'vanhin suunnistustemppu, eikä siihen tarvita mitään välinettä.',
  },
  {
    avain: 'risti-etelanapa',
    nimi: 'Etelän ristin pitkä akseli',
    alku: 'gam Cru',
    loppu: 'alp1 Cru',
    kohdeNapa: -90,
    huomio: 'Ristin pitkä akseli jatkettuna osoittaa taivaan etelänapaa. '
      + 'Navan kohdalla ei ole kirkasta tähteä, joten kohta arvioidaan '
      + 'janan pituudesta ja lasketaan sieltä pystysuoraan horisonttiin: '
      + 'siinä on etelä.',
  },
];

// --- navigointi --------------------------------------------------------------
//
// Nämä tekstit ovat pelin opetussisältöä. Osa luvuista täytetään
// aineistosta (LUKU-merkinnät), jotta ne pysyvät katalogin kanssa
// samoina eikä muistista kirjoitettuina.

const navigointiTekstit = ({ napaetaisyys, sigmaOct, otavaKerroin, ristiKerroin, polariksenSija }) => [
  {
    avain: 'pohjantahti-leveysaste',
    otsikko: 'Pohjantähden korkeus on leveysaste',
    teksti: 'Jos seisot päiväntasaajalla, Pohjantähti on horisontissa. Jos seisot '
      + 'pohjoisnavalla, se on suoraan pään päällä. Kaikkialla siltä väliltä sen '
      + 'korkeus horisontista on sama luku kuin leveysasteesi — ei suunnilleen '
      + 'vaan tarkalleen, koska Maan akseli osoittaa siihen suuntaan. Lontoossa '
      + 'Pohjantähti on 51 astetta ylhäällä, Helsingissä 60, Kairossa 30. '
      + `Yksi varaus: Pohjantähti ei ole aivan navassa vaan ${napaetaisyys} asteen `
      + 'päässä siitä, joten se piirtää vuorokaudessa pienen ympyrän. Asteen '
      + 'tarkkuuteen se ei vaikuta; merenkulkijat korjasivat sen taulukosta.',
    kaava: 'leveysaste = Pohjantähden korkeus horisontista',
    tahdet: ['alp UMi'],
  },
  {
    avain: 'lyodaan-pohjoinen',
    otsikko: 'Miten Pohjantähti löydetään',
    teksti: `Pohjantähti ei ole kirkas — tässä luettelossa se on vasta ${polariksenSija}. `
      + 'kirkkain tähti, ja juuri siksi sitä etsitään aina toisen kuvion kautta. Ota Otavan kauhan '
      + 'takareuna, Merak ja Dubhe, ja jatka niiden välistä janaa noin '
      + `${otavaKerroin} kertaa sen pituuden verran. Siinä on Pohjantähti, ja sen `
      + 'alla on pohjoinen. Jos Otava on horisontin rajassa, sama tähti löytyy '
      + 'toiselta puolelta: Kassiopeian W on aina navan vastakkaisella puolella.',
    kaava: 'Merak → Dubhe, jatka ' + otavaKerroin + '×',
    tahdet: ['bet UMa', 'alp UMa', 'alp UMi'],
  },
  {
    avain: 'etelanristi',
    otsikko: 'Etelässä ei ole napatähteä',
    teksti: 'Eteläisellä pallonpuoliskolla ei ole Pohjantähden vastinetta. Lähin '
      + 'tähti taivaan etelänapaa on Oktantin Sigma, mutta se on magnitudiltaan '
      + `${sigmaOct} eli juuri ja juuri näkyvä — pilvenhattarassa se katoaa. Siksi `
      + 'etelä etsitään Etelän ristin avulla: ristin pitkä akseli Gacruxista '
      + `Acruxiin, jatkettuna noin ${ristiKerroin} kertaa, osuu etelänavan kohdalle. `
      + 'Sieltä katse suoraan alas horisonttiin, ja siinä on etelä. Vahvista '
      + 'aina Alfa ja Beta Centaurilla: ne osoittavat oikeaan ristiin, sillä '
      + 'lähistöllä on toinenkin ristin muotoinen tähtijoukko, jota merimiehet '
      + 'sanoivat väärentäjäksi.',
    kaava: 'Gacrux → Acrux, jatka ' + ristiKerroin + '× = taivaan etelänapa',
    // Alfa Centauri on katalogissa kaksoistähtenä alp1 ja alp2.
    tahdet: ['gam Cru', 'alp1 Cru', 'alp1 Cen', 'bet Cen', 'sig Oct'],
  },
  {
    avain: 'sekstantti',
    otsikko: 'Mitä sekstantilla tehdään',
    teksti: 'Sekstantti mittaa yhden asian: kulman horisontin ja taivaankappaleen '
      + 'välillä. Se onnistuu keinuvalla kannella, koska mittaus ei tarvitse '
      + 'vaakasuoraa alustaa — kaksi peiliä tuo tähden kuvan horisontin viereen, '
      + 'ja mittaaja kääntää liikkuvaa peiliä kunnes tähti näyttää istuvan '
      + 'horisontissa. Kulma luetaan kaarelta. Nimi tulee kaaresta, joka on '
      + 'kuudesosa ympyrää eli 60 astetta, mutta kaksoisheijastuksen ansiosta '
      + 'sillä mitataan 120 asteeseen asti. Ennen lukemista tehdään kaksi '
      + 'korjausta: indeksivirhe (kaaren nollakohdan poikkeama) ja horisontin '
      + 'kallistuma, joka riippuu siitä kuinka korkealla silmä on merenpinnasta.',
    kaava: 'kallistuma kaariminuutteina ≈ 1,76 × √(silmän korkeus metreinä)',
  },
  {
    avain: 'leveysaste-auringosta',
    otsikko: 'Leveysaste auringosta keskipäivällä',
    teksti: 'Yöllä riittää Pohjantähti, mutta päivällä mitataan Aurinko. Odota '
      + 'hetkeä, jolloin Aurinko on korkeimmillaan — se on paikallinen keskipäivä '
      + 'eikä välttämättä kellon kaksitoista. Mittaa korkeus sekstantilla ja katso '
      + 'almanakasta Auringon deklinaatio sille päivälle. Deklinaatio heiluu '
      + 'vuoden mittaan kääntöpiirien välillä, ja juuri siksi almanakka oli '
      + 'jokaisen laivan hyllyssä. Kaava pätee, kun kohde kulminoi etelässä; '
      + 'eteläisellä pallonpuoliskolla merkit kääntyvät.',
    kaava: 'leveysaste = 90° − mitattu korkeus + deklinaatio',
  },
  {
    avain: 'pituusaste-vaatii-kellon',
    otsikko: 'Pituusaste vaatii kellon',
    teksti: 'Leveysasteen näkee taivaalta, pituusasteen ei. Maapallo pyörii, joten '
      + 'sama tähtitaivas näkyy tunnin päästä viisitoista astetta lännempänä. Ainoa '
      + 'keino on verrata paikallista aikaa johonkin sovittuun aikaan: kun '
      + 'paikallinen keskipäivä osuu kello kahteen Greenwichin aikaa, olet 30 '
      + 'astetta lännessä. Siksi merikronometri oli 1700-luvun kallein '
      + 'navigointiväline ja siksi isoisän matkassa kello on yhtä tärkeä kuin '
      + 'kartta. Sama laskutoimitus selittää Vernen tempun: itään kiertävä '
      + 'matkustaja tapaa auringon kerran liikaa ja voittaa vuorokauden.',
    kaava: '1 tunti aikaeroa = 15° pituutta, 4 minuuttia = 1°',
  },
  {
    avain: 'taivas-leveysasteelta',
    otsikko: 'Mikä taivaalta näkyy ja mikä ei',
    teksti: 'Leveysaste ei ratkaise vain Pohjantähden korkeutta vaan koko taivaan. '
      + 'Tähti ei laske koskaan, jos sen deklinaatio on suurempi kuin 90 astetta '
      + 'miinus leveysaste — Suomessa Otava, Kassiopeia ja Lohikäärme kiertävät '
      + 'napaa laskematta. Tähti taas ei nouse koskaan, jos sen deklinaatio on '
      + 'pienempi kuin leveysaste miinus 90 astetta: siksi Etelän ristiä ei '
      + 'nähdä Euroopasta eikä Pohjantähteä Australiasta. Kun matkustaa etelään, '
      + 'pohjoinen taivas painuu horisonttiin ja tilalle nousee uusia tähtiä. '
      + 'Sen huomaa laivalla päivä päivältä, ja se on konkreettisin todiste '
      + 'siitä, että maapallo on pallo.',
    kaava: 'kiertää napaa: δ > 90° − |φ|   ·   ei nouse: δ < |φ| − 90°',
  },
];

// --- tarkistukset ------------------------------------------------------------
//
// Kiinteäleveyksisen tiedoston sarakepaikat menevät väärin hiljaa: jos
// magnitudi luettaisiin yhtä tavua sivusta, taivas olisi yhä täynnä
// tähtiä eikä mikään näyttäisi rikkinäiseltä. Nämä tähdet ovat niin
// tuttuja, että väärä luku paljastuu heti.

const KOETIN = [
  { hr: 2491, nimi: 'Sirius', bayer: 'alp', kuvio: 'CMa', ra: 101.29, dec: -16.72, mag: -1.46 },
  { hr: 424, nimi: 'Polaris', bayer: 'alp', kuvio: 'UMi', ra: 37.95, dec: 89.26, mag: 2.02 },
  { hr: 7001, nimi: 'Vega', bayer: 'alp', kuvio: 'Lyr', ra: 279.23, dec: 38.78, mag: 0.03 },
  { hr: 2061, nimi: 'Betelgeuse', bayer: 'alp', kuvio: 'Ori', ra: 88.79, dec: 7.41, mag: 0.50 },
  { hr: 4730, nimi: 'Acrux', bayer: 'alp1', kuvio: 'Cru', ra: 186.65, dec: -63.10, mag: 1.33 },
  { hr: 6134, nimi: 'Antares', bayer: 'alp', kuvio: 'Sco', ra: 247.35, dec: -26.43, mag: 0.96 },
];

// --- pallogeometria ----------------------------------------------------------

const RAD = Math.PI / 180;

/** Kahden taivaanpisteen välinen kulma asteina (haversine). */
function kulmaEtaisyys(a, b) {
  const dRa = (b.ra - a.ra) * RAD;
  const d1 = a.dec * RAD;
  const d2 = b.dec * RAD;
  const kosini = Math.sin(d1) * Math.sin(d2) + Math.cos(d1) * Math.cos(d2) * Math.cos(dRa);
  return Math.acos(Math.min(1, Math.max(-1, kosini))) / RAD;
}

// --- ajo ---------------------------------------------------------------------

console.log('Tähtitaivas ja sekstantti — aineiston haku');
console.log(`  välimuisti ${VALIMUISTI}`);

// Peräkkäin eikä rinnakkain: neljä yhtaikaista pyyntöä eri palvelimille ei
// nopeuta mitään, mutta Wikipedian rajoitin ehtii vastata 429:llä.
const bscTeksti = await nouda('tahdet');
const kuvioTeksti = await nouda('kuviot');
const nimiTeksti = await nouda('nimet');
const suomiJson = await nouda('suomi');

const { tahdet: kaikkiTahdet, ohitettu } = lueTahdet(bscTeksti);
console.log(`  BSC: ${kaikkiTahdet.size} tähteä (${ohitettu} riviä ilman paikkaa tai kirkkautta)`);

for (const koe of KOETIN) {
  const t = kaikkiTahdet.get(koe.hr);
  if (!t) throw new Error(`koetintähti HR ${koe.hr} (${koe.nimi}) puuttuu katalogista`);
  const virheet = [];
  if (Math.abs(t.ra - koe.ra) > 0.02) virheet.push(`ra ${t.ra.toFixed(2)} != ${koe.ra}`);
  if (Math.abs(t.dec - koe.dec) > 0.02) virheet.push(`dec ${t.dec.toFixed(2)} != ${koe.dec}`);
  if (Math.abs(t.mag - koe.mag) > 0.01) virheet.push(`mag ${t.mag} != ${koe.mag}`);
  if (t.bayer !== koe.bayer) virheet.push(`bayer ${t.bayer} != ${koe.bayer}`);
  if (t.kuvio !== koe.kuvio) virheet.push(`kuvio ${t.kuvio} != ${koe.kuvio}`);
  if (virheet.length) {
    throw new Error(`${koe.nimi} (HR ${koe.hr}) luettiin väärin: ${virheet.join(', ')} `
      + '— sarakepaikat ovat siirtyneet, ks. SARAKE');
  }
}
console.log(`  koetintähdet ${KOETIN.map((k) => k.nimi).join(', ')} — paikat ja kirkkaudet täsmäävät`);

/*
 * Bayerin ja Flamsteedin tunnukset hakemistoon, jotta käsin kirjoitetut
 * asterismit voivat viitata tähtiin nimillä eivätkä numeroilla.
 *
 * Sama tunnus esiintyy katalogissa useammin kuin kerran, koska kaksoistähden
 * molemmat komponentit kantavat sitä: "79Zet UMa" on sekä HR 5054 (Mizar,
 * 2,3 mag) että HR 5055 (sen kumppani, 4,0 mag). Kirkkaampi voittaa, koska
 * juuri se on se tähti, jonka ihminen näkee ja jota kuvio tarkoittaa.
 */
const tunnusHakemisto = new Map();
let kaksoisia = 0;
const merkitse = (avain, tahti) => {
  const vanha = tunnusHakemisto.get(avain);
  if (vanha) {
    kaksoisia += 1;
    if (vanha.mag <= tahti.mag) return;
  }
  tunnusHakemisto.set(avain, tahti);
};
for (const t of kaikkiTahdet.values()) {
  if (t.bayer && t.kuvio) merkitse(`${t.bayer} ${t.kuvio}`, t);
  if (t.flamsteed && t.kuvio) merkitse(`${t.flamsteed} ${t.kuvio}`, t);
}
console.log(`  tunnushakemistossa ${tunnusHakemisto.size} tunnusta `
  + `(${kaksoisia} kaksoistähden komponenttia jäi kirkkaamman varjoon)`);
const tunnista = (tunnus) => {
  const t = tunnusHakemisto.get(tunnus);
  if (!t) throw new Error(`tunnusta "${tunnus}" ei löydy katalogista — kirjoitusvirhe?`);
  return t;
};

const kuvioviivat = lueKuvioviivat(kuvioTeksti);
console.log(`  kuviot: ${kuvioviivat.size} tähdistöä, `
  + `${[...kuvioviivat.values()].flat().length} piirrettävää viivaa`);

const { hrNimet, hdNimet, ohi } = lueViralliset(nimiTeksti);
/*
 * Ohitetut ovat eksoplaneettojen emotähtiä ja pulsareita, joilla ei ole
 * HR- eikä HD-numeroa (WASP-52, PSR B1257+12). Ne ovat kaikki himmeitä,
 * mutta se on tarkistettava eikä oletettava: jos joukossa olisi paljain
 * silmin näkyvä tähti, sen nimi katoaisi hiljaa.
 */
const ohiKirkkaat = ohi.filter((o) => o.mag < 6);
if (ohiKirkkaat.length) {
  throw new Error('IAU-CSN:stä jäi tunnistamatta kirkas tähti: '
    + ohiKirkkaat.map((o) => `${o.nimi} (${o.mag})`).join(', '));
}
console.log(`  IAU-CSN: ${hrNimet.size} nimeä HR-tunnuksella, ${hdNimet.size} HD:llä, `
  + `${ohi.length} ilman kumpaakaan (kaikki himmeämpiä kuin 6 mag)`);

const { nimet: suomenkieliset, epailyt } = lueSuomenkieliset(suomiJson);
console.log(`  suomenkieliset nimet: ${suomenkieliset.size} tähdistöä`);
for (const e of epailyt) console.log(`    VAROITUS latina/genetiivi eivät täsmää — ${e}`);
if (suomenkieliset.size !== 88) {
  throw new Error(`Wikipedian taulukosta luettiin ${suomenkieliset.size} tähdistöä, pitäisi olla 88`);
}

// Virallinen nimi tähdelle: ensin HR-tunnuksella, sitten HD:llä.
let nimettyja = 0;
for (const t of kaikkiTahdet.values()) {
  const tietue = hrNimet.get(t.hr) ?? (t.hd ? hdNimet.get(t.hd) : null);
  if (!tietue) continue;
  // Ristiintarkistus: IAU:n oma magnitudi ja tähdistö samasta tähdestä.
  // Puolen magnitudin heitto on tavallinen (eri mittaukset, muuttujat),
  // mutta väärä tähdistö tarkoittaa väärää tähteä.
  if (tietue.kuvio && t.kuvio && tietue.kuvio !== t.kuvio) {
    console.log(`    VAROITUS ${tietue.nimi}: IAU sanoo ${tietue.kuvio}, BSC ${t.kuvio} — ohitetaan`);
    continue;
  }
  t.nimi = tietue.nimi;
  nimettyja += 1;
}
console.log(`  nimiä liitettiin ${nimettyja} tähdelle`);

/*
 * Mukaan otettavat tähdet.
 *
 * Kirkkausraja ei riitä yksin: tähtikuvion viiva voi päättyä tähteen, joka
 * on juuri rajan alapuolella, ja silloin viiva jäisi roikkumaan tyhjään.
 * Samoin Oktantin Sigma on navigoinnin kannalta olennainen juuri siksi,
 * että se on himmeä. Ne otetaan mukaan erikseen ja lasketaan erikseen.
 */
const valitut = new Map();
for (const t of kaikkiTahdet.values()) {
  if (t.mag <= KIRKKAUSRAJA) valitut.set(t.hr, t);
}
const rajanTakaa = new Set();
const lisaa = (hr, mista) => {
  const t = kaikkiTahdet.get(hr);
  if (!t) throw new Error(`${mista} viittaa tähteen HR ${hr}, jota ei ole katalogissa`);
  if (!valitut.has(hr)) { valitut.set(hr, t); rajanTakaa.add(hr); }
};
for (const [lyhenne, viivat] of kuvioviivat) {
  for (const viiva of viivat) for (const hr of viiva) lisaa(hr, `tähdistö ${lyhenne}`);
}

// Käsin kirjoitetut kuviot tunnuksista numeroiksi.
const asterismit = ASTERISMIT.map((a) => {
  const kaanna = (lista) => lista.map((tunnus) => {
    const t = tunnista(tunnus);
    lisaa(t.hr, `asterismi ${a.avain}`);
    return t.hr;
  });
  return {
    avain: a.avain,
    nimi: a.nimi,
    muualla: a.muualla,
    kuvio: a.kuvio ?? null,
    viivat: a.viivat ? a.viivat.map(kaanna) : null,
    pisteet: a.pisteet ? kaanna(a.pisteet) : null,
    huomio: a.huomio,
  };
});

const osoittimet = OSOITTIMET.map((o) => {
  const alku = tunnista(o.alku);
  const loppu = tunnista(o.loppu);
  lisaa(alku.hr, `osoitin ${o.avain}`);
  lisaa(loppu.hr, `osoitin ${o.avain}`);
  const jana = kulmaEtaisyys(alku, loppu);
  let matka;
  if (o.kohdeTahti) {
    const kohde = tunnista(o.kohdeTahti);
    lisaa(kohde.hr, `osoitin ${o.avain}`);
    matka = kulmaEtaisyys(loppu, kohde);
  } else {
    // Napaan on aina 90 astetta miinus deklinaation itseisarvo.
    matka = 90 - Math.abs(loppu.dec);
  }
  const kerroin = matka / jana;
  if (!(kerroin > 3 && kerroin < 7)) {
    throw new Error(`${o.avain}: osoittimen kerroin ${kerroin.toFixed(2)} on epäuskottava`);
  }
  return {
    avain: o.avain,
    nimi: o.nimi,
    alku: alku.hr,
    loppu: loppu.hr,
    kohde: o.kohdeTahti ? tunnista(o.kohdeTahti).hr : null,
    kohdeNapa: o.kohdeNapa ?? null,
    janaAste: Number(jana.toFixed(2)),
    kerroin: Number(kerroin.toFixed(1)),
    huomio: o.huomio,
  };
});

// Navigoinnin luvut aineistosta.
const polaris = tunnista('alp UMi');
const sigmaOct = tunnista('sig Oct');
lisaa(sigmaOct.hr, 'navigointi');
const napaetaisyys = (90 - polaris.dec).toFixed(2).replace('.', ',');
const otavaKerroin = String(osoittimet.find((o) => o.avain === 'otava-pohjantahti').kerroin).replace('.', ',');
const ristiKerroin = String(osoittimet.find((o) => o.avain === 'risti-etelanapa').kerroin).replace('.', ',');

/*
 * Pohjantähden sija kirkkausjärjestyksessä lasketaan tästä aineistosta.
 * Yleisesti sanotaan 48., mutta luku riippuu siitä, lasketaanko
 * kaksoistähdet yhtenä vai kahtena — tässä ne ovat erillisiä rivejä,
 * joten sija on toinen. Sanotaan siis mitä tästä luettelosta seuraa.
 */
const polariksenSija = [...valitut.values()].filter((t) => t.mag < polaris.mag).length + 1;

const navigointi = navigointiTekstit({
  napaetaisyys,
  sigmaOct: String(sigmaOct.mag).replace('.', ','),
  otavaKerroin,
  ristiKerroin,
  polariksenSija,
}).map((n) => ({
  ...n,
  tahdet: n.tahdet ? n.tahdet.map((tunnus) => tunnista(tunnus).hr) : null,
}));

console.log(`  tähtiä kirkkausrajaan ${KIRKKAUSRAJA}: ${valitut.size - rajanTakaa.size}`);
console.log(`  lisäksi ${rajanTakaa.size} himmeämpää, joita kuviot tai navigointi tarvitsevat`);
console.log(`  Pohjantähti on ${napaetaisyys}° päässä navasta, `
  + `Otavan osoitin ${otavaKerroin}×, Etelän ristin akseli ${ristiKerroin}×`);

/*
 * Tähdistökohtaiset tiedot.
 *
 * tahtia laskee vain ne tähdet, joiden oma tunnus sanoo tähdistön ("50 Alp
 * UMa"). Se ei siis ole tähdistön kaikkien tähtien määrä: tunnuksettomilla
 * tähdillä ei ole tässä aineistossa tähdistöä lainkaan, koska tähdistörajat
 * ovat oma luettelonsa jota tähän ei ole haettu.
 */
const kuviotUlos = [];
const puuttuvatNimet = [];
for (const [lyhenne, viivat] of [...kuvioviivat].sort((a, b) => a[0].localeCompare(b[0]))) {
  const nimi = suomenkieliset.get(lyhenne);
  if (!nimi) { puuttuvatNimet.push(lyhenne); continue; }
  const omat = [...valitut.values()].filter((t) => t.kuvio === lyhenne);
  const kirkkain = omat.reduce((a, b) => (a && a.mag <= b.mag ? a : b), null);
  kuviotUlos.push({
    lyhenne,
    latina: nimi.latina,
    genetiivi: nimi.genetiivi,
    suomi: nimi.suomi,
    kirkkain: kirkkain ? kirkkain.hr : null,
    kirkkainMag: kirkkain ? kirkkain.mag : null,
    tahtia: omat.length,
    viivat,
    huomio: KUVIOHUOMIOT[lyhenne] ?? null,
  });
}
if (puuttuvatNimet.length) {
  throw new Error(`suomenkielinen nimi puuttuu tähdistöiltä: ${puuttuvatNimet.join(', ')}`);
}

// Katalogin omat lyhenteet vs. Wikipedian taulukko: kumpikin on erillinen
// lähde, joten ero paljastaa virheen jommassakummassa.
const bscLyhenteet = new Set([...kaikkiTahdet.values()].map((t) => t.kuvio).filter(Boolean));
const vieraat = [...bscLyhenteet].filter((l) => !suomenkieliset.has(l));
if (vieraat.length) throw new Error(`katalogissa on tähdistölyhenteitä, joita Wikipedia ei tunne: ${vieraat.join(', ')}`);

const ilmanKuviota = [...valitut.values()].filter((t) => !t.kuvio).length;
const huomioita = kuviotUlos.filter((k) => k.huomio).length;
console.log(`  tähdistöjä ${kuviotUlos.length}, joista ${huomioita} suomenkielisin selityksin`);
if (huomioita < 25) throw new Error(`vain ${huomioita} tähdistöä selitetty, tavoite vähintään 25`);

// Kreikkalaiset kirjaimet: käännöstaulukko katalogin lyhenteille.
// Rakennetaan vain niistä, joita aineistossa oikeasti esiintyy, ja
// kaadutaan jos vastaan tulee tuntematon lyhenne.
const KREIKKA = {
  alp: 'α', bet: 'β', gam: 'γ', del: 'δ', eps: 'ε', zet: 'ζ', eta: 'η', the: 'θ',
  iot: 'ι', kap: 'κ', lam: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', omi: 'ο', pi: 'π',
  rho: 'ρ', sig: 'σ', tau: 'τ', ups: 'υ', phi: 'φ', chi: 'χ', psi: 'ψ', ome: 'ω',
};
for (const t of valitut.values()) {
  if (!t.bayer) continue;
  const kanta = t.bayer.replace(/\d$/, '');
  if (!KREIKKA[kanta]) throw new Error(`tuntematon Bayerin lyhenne "${t.bayer}" (HR ${t.hr})`);
}

// --- kirjoitus ---------------------------------------------------------------

const HAETTU = new Date().toISOString().slice(0, 10);
const pyorista = (x, n) => Number(x.toFixed(n));
const jono = (s) => (s === null || s === undefined ? 'null' : JSON.stringify(s));
/** Luku suomalaisittain: pilkku desimaalierottimena leipätekstissä. */
const desimaali = (x) => String(x).replace('.', ',');

const rivit = [...valitut.values()]
  .sort((a, b) => a.mag - b.mag)
  .map((t) => `  [${t.hr},${pyorista(t.ra, 3)},${pyorista(t.dec, 3)},${t.mag},`
    + `${t.bv === null ? 'null' : t.bv},${jono(t.bayer)},${t.flamsteed ?? 'null'},`
    + `${jono(t.kuvio)},${jono(t.nimi)}],`)
  .join('\n');

const kuvioRivit = kuviotUlos.map((k) => {
  const viivat = k.viivat.map((v) => `[${v.join(',')}]`).join(', ');
  return `  {
    lyhenne: ${jono(k.lyhenne)}, latina: ${jono(k.latina)}, genetiivi: ${jono(k.genetiivi)},
    suomi: ${jono(k.suomi)},
    kirkkain: ${k.kirkkain ?? 'null'}, kirkkainMag: ${k.kirkkainMag ?? 'null'}, tahtia: ${k.tahtia},
    viivat: [${viivat}],
    huomio: ${jono(k.huomio)},
  },`;
}).join('\n');

const asterismiRivit = asterismit.map((a) => `  {
    avain: ${jono(a.avain)}, nimi: ${jono(a.nimi)}, muualla: ${jono(a.muualla)}, kuvio: ${jono(a.kuvio)},
    viivat: ${a.viivat ? `[${a.viivat.map((v) => `[${v.join(',')}]`).join(', ')}]` : 'null'},
    pisteet: ${a.pisteet ? `[${a.pisteet.join(',')}]` : 'null'},
    huomio: ${jono(a.huomio)},
  },`).join('\n');

const osoitinRivit = osoittimet.map((o) => `  {
    avain: ${jono(o.avain)}, nimi: ${jono(o.nimi)},
    alku: ${o.alku}, loppu: ${o.loppu}, kohde: ${o.kohde ?? 'null'}, kohdeNapa: ${o.kohdeNapa ?? 'null'},
    janaAste: ${o.janaAste}, kerroin: ${o.kerroin},
    huomio: ${jono(o.huomio)},
  },`).join('\n');

const navigointiRivit = navigointi.map((n) => `  {
    avain: ${jono(n.avain)}, otsikko: ${jono(n.otsikko)},
    teksti: ${jono(n.teksti)},
    kaava: ${jono(n.kaava ?? null)},
    tahdet: ${n.tahdet ? `[${n.tahdet.join(',')}]` : 'null'},
  },`).join('\n');

const teksti = `// Tähtitaivas ja sekstantti: kirkkaat tähdet, tähtikuviot ja suunnistus.
//
// TÄMÄ TIEDOSTO ON KONEEN KIRJOITTAMA. Älä muokkaa käsin:
//   NODE_USE_ENV_PROXY=1 node tools/hae-tahdet.mjs
//
// Aineisto: Yale Bright Star Catalogue, 5th Revised Ed. (Preliminary Version)
//           — ${valitut.size - rajanTakaa.size} tähteä magnitudiin ${KIRKKAUSRAJA.toFixed(1).replace('.', ',')} asti ja ${rajanTakaa.size} tätä himmeämpää.
//           ConstellationLines — 88 tähdistön tikkukuviot.
//           IAU Catalog of Star Names — tähtien viralliset erisnimet.
//           Wikipedia (fi), "Tähdistö" — suomenkieliset tähdistönimet.
// Viite:    Hoffleit D., Warren Jr W.H. 1991, Astronomical Data Center,
//           NSSDC/ADC; bibcode 1991bsc..book.....H; VizieR-luettelo V/50.
//           van der Sluys, Marc (2005–2023), ConstellationLines,
//           DOI 10.5281/zenodo.10397192.
//           IAU Division C Working Group on Star Names (WGSN), 2022-04-04.
// Haettu:   ${HAETTU}
//           https://cdsarc.cds.unistra.fr/ftp/V/50/catalog.gz
//           https://github.com/MarcvdSluys/ConstellationLines
//           https://www.pas.rochester.edu/~emamajek/WGSN/IAU-CSN.txt
//           https://fi.wikipedia.org/wiki/Tähdistö
// Lisenssi: Bright Star Catalogue on Yhdysvaltain NASA:n Astronomical Data
//           Centerin kokoama ja CDS jakaa sitä vapaasti; erillistä
//           lisenssitekstiä ei ole, mutta CDS pyytää mainitsemaan VizieRin
//           (DOI 10.26093/cds/vizier) ja luettelon tekijät.
//           ConstellationLines CC BY 4.0 (repon LICENSE, readme.org ja
//           CITATION.cff). HUOM: itse .dat-tiedoston otsikkorivi sanoo
//           CC BY-SA 4.0 — ristiriita on lähteessä, ja tässä noudatetaan
//           repon virallista lisenssiä.
//           IAU-CSN: CC BY ("All IAU-produced products ... are released
//           under Creative Commons Attribution").
//           Wikipedian teksti on CC BY-SA 4.0; tästä on otettu vain nimiä
//           ja lyhenteitä, jotka ovat tosiasioita eivätkä tekijänoikeuden
//           alaisia — lähde mainitaan silti.
//
// ============================================================
// KOORDINAATISTO ON ERI KUIN MUUALLA PELISSÄ. ÄLÄ PROJISOI LAUDALLE.
// ============================================================
//
// Kaikki muut pelin aineistot ovat lon/lat ja päätyvät laudan pikseleiksi.
// Nämä eivät. Tähdet ovat taivaanpallolla, ja niiden koordinaatit ovat
//
//   ra   rektaskensio, 0…360 astetta (ei tuntia), tasauspiste J2000.0
//   dec  deklinaatio, -90…+90 astetta, tasauspiste J2000.0
//
// Deklinaatio muistuttaa leveysastetta niin paljon, että sen voi vahingossa
// syöttää karttaprojektioon. Tulos näyttäisi kartalta — tuhat pistettä
// asettuisi siististi — mutta se olisi täyttä hölynpölyä: Sirius ei ole
// Kongon yllä vaan koko maapallon yllä. Rektaskensio ei ole pituusaste
// vaan kulma taivaalla, joka pyörii maapallon alla kerran vuorokaudessa.
//
// Linssi piirtää oman taivaannäkymänsä pelaajan leveysasteelta. Muunnos
// näkymään on tavallista pallotrigonometriaa:
//
//   H = LST − ra                            tuntikulma
//   sin(h) = sin(dec)·sin(φ) + cos(dec)·cos(φ)·cos(H)      korkeus
//   cos(A) = (sin(dec) − sin(h)·sin(φ)) / (cos(h)·cos(φ))  atsimuutti
//                                           (A pohjoisesta itään; jos
//                                            sin(H) > 0, käytä 360° − A)
//   φ = pelaajan leveysaste, LST = paikallinen tähtiaika
//   LST ≈ 280,46062 + 360,98564736629·(JD − 2451545,0) + pituusaste
//
// Kulminaatiokorkeus on 90° − |φ − dec|. Tähti kiertää napaa laskematta,
// jos dec > 90° − |φ|, eikä nouse koskaan, jos dec < |φ| − 90°.
//
// --- mitä tiedostossa on ---
//
//   TAHDET        ${String(valitut.size).padStart(4)} tähteä, kirkkain ensin
//                 ${String(valitut.size - rajanTakaa.size).padStart(4)} niistä on magnitudiin ${KIRKKAUSRAJA.toFixed(1).replace('.', ',')} asti
//                 ${String(rajanTakaa.size).padStart(4)} on tätä himmeämpää, mutta jokin kuvion viiva
//                      tai navigointiohje tarvitsee ne (esim. Oktantin Sigma,
//                      etelän napatähti, magnitudi ${desimaali(sigmaOct.mag)})
//   TAHTIKUVIOT   ${kuviotUlos.length} tähdistöä viivoineen ja suomenkielisine nimineen,
//                 joista ${huomioita} on selitetty
//   ASTERISMIT    ${asterismit.length} kuviota, joita virallinen jako ei tunne (Otava,
//                 Seulaset, Väinämöisen vyö, kesä- ja talvikolmio, Pegasoksen neliö)
//   OSOITTIMET    ${osoittimet.length} tähtiparia, joiden jana jatkettuna osoittaa napaan
//   NAVIGOINTI    ${navigointi.length} ohjetta: Pohjantähti, Etelän risti, sekstantti, aika
//   KREIKKA       Bayerin lyhenne → kreikkalainen kirjain
//
// --- mikä on konetta ja mikä käsityötä ---
//
// Tähtien paikat, kirkkaudet, tunnukset, viralliset nimet, tähtikuvioiden
// viivat ja suomenkieliset tähdistönimet tulevat suoraan lähteistä.
// Suomenkieliset selitystekstit (kuvioiden huomiot, asterismit,
// navigointiohjeet) on kirjoitettu käsin tiedostoon tools/hae-tahdet.mjs.
// Niissä esiintyvät luvut lasketaan aineistosta: Pohjantähden ${napaetaisyys}°
// navasta, Otavan osoittimen ${otavaKerroin}× ja ristin akselin ${ristiKerroin}× ovat mitattuja,
// eivät muistista kirjoitettuja.
//
// --- mitä tässä EI ole ---
//
// Ei Aurinkoa, Kuuta eikä planeettoja: ne liikkuvat tähtien seassa eivätkä
// mahdu kiinteään luetteloon. Ei tähdistörajoja: taivas on jaettu kokonaan
// 88 alueeseen, mutta rajat ovat oma luettelonsa (IAU 1930), eikä linssi
// tarvitse niitä viivojen piirtämiseen. Ei syvän taivaan kohteita galakseja
// ja sumuja lukuun ottamatta niitä, jotka mainitaan tekstissä. Ei tähtien
// omaa liikettä: paikat ovat J2000-tasauspisteessä, ja kirkkaimmillakin
// tähdillä liike on kaarisekunnin murto-osia vuodessa — pelin tarkkuudella
// taivas on sama vuonna 1873 ja tänään. Prekessio siirtää koko taivasta
// noin 0,014° vuodessa, mikä on parikymmentä vuotta laskien näkymätöntä.

/** Sarakkeiden järjestys TAHDET-taulukossa. */
export const TAHTI_KENTAT = ['hr', 'ra', 'dec', 'mag', 'bv', 'bayer', 'flamsteed', 'kuvio', 'nimi'];

/*
 * Tähdet taulukkoina eikä olioina: kenttien nimet veisivät kolme kertaa
 * enemmän tilaa kuin itse luvut. Sarakkeet ovat TAHTI_KENTAT-järjestyksessä.
 *
 *   hr         Bright Star Catalogue -numero, myös kuvioiden viittausavain
 *   ra, dec    asteina, tasauspiste J2000.0 — EI lon/lat, ks. otsikko
 *   mag        näennäinen visuaalinen kirkkaus; pienempi on kirkkaampi
 *   bv         B−V-väri-indeksi tai null: negatiivinen sinivalkoinen,
 *              yli 1,3 punainen — tästä saa tähdelle oikean sävyn
 *   bayer      Bayerin kirjain lyhenteenä ('alp', 'alp1') tai null
 *   flamsteed  Flamsteedin numero tai null
 *   kuvio      tähdistön lyhenne ('UMa') tai null
 *   nimi       IAU:n virallinen erisnimi tai null
 *
 * kuvio tulee tähden omasta tunnuksesta ("50 Alp UMa"), joten se on null
 * niiltä ${ilmanKuviota} tähdeltä, joilla ei ole Bayerin eikä Flamsteedin tunnusta.
 * Se EI tarkoita, ettei tähti kuuluisi mihinkään tähdistöön: taivas on
 * jaettu kokonaan, mutta jako on omaa aineistoaan (IAU:n tähdistörajat),
 * jota tässä tiedostossa ei ole. Kirkkaista tähdistä tämä koskee vain
 * yhtä: kaikki magnitudia 3 kirkkaammat paitsi yksi tuntevat tähdistönsä.
 */
export const TAHDET = [
${rivit}
];

/** Bayerin lyhenne kreikkalaiseksi kirjaimeksi: 'alp' → 'α'. */
export const KREIKKA = {
${Object.entries(KREIKKA).map(([lyh, kirjain]) => `  ${lyh}: '${kirjain}',`).join('\n')}
};

/*
 * Tähtikuviot. viivat on lista murtoviivoja: jokainen on lista HR-numeroita,
 * jotka yhdistetään järjestyksessä. Kynä nostetaan viivojen välissä.
 * Osa viivoista palaa takaisin samaa reittiä, jotta kuvio saadaan yhdellä
 * murtoviivalla — se on lähteen tapa eikä virhe.
 *
 * tahtia on niiden tähtien määrä, joiden oma tunnus sanoo tämän tähdistön.
 * Se ei ole tähdistön kaikkien tähtien määrä, ks. TAHDET-taulukon kuvio-kenttä.
 * Kuvion viiva voi myös lainata tähden naapuritähdistöstä.
 *
 * TÄHTIKUVIOIDEN VIIVAT EIVÄT OLE LUONNONLAKI. Mitään virallista standardia
 * siitä, mitkä tähdet yhdistetään, ei ole: jokainen tähtikartta piirtää omat
 * kuvionsa. Nämä ovat yhden nimetyn lähteen valinta.
 */
export const TAHTIKUVIOT = [
${kuvioRivit}
];

/*
 * Asterismit: tunnettuja kuvioita, joita 88 tähdistön jako ei tunne.
 * Otava on näistä tärkein — se on suomalaisille se kuvio, jonka kaikki
 * osaavat, mutta virallisessa luettelossa sitä ei ole olemassa.
 * pisteet ilman viivoja tarkoittaa tähtijoukkoa (Seulaset).
 */
export const ASTERISMIT = [
${asterismiRivit}
];

/*
 * Osoittimet: kaksi tähteä (alku ja loppu), joiden välinen jana jatkettuna
 * kerroin-kertaa osuu kohteeseen. kerroin ja janaAste on laskettu tämän
 * tiedoston omista koordinaateista, joten ne täsmäävät siihen mitä linssi
 * piirtää. kohde on tähti (HR) tai kohdeNapa taivaannavan deklinaatio.
 */
export const OSOITTIMET = [
${osoitinRivit}
];

/*
 * Navigointi: mitä tähtitaivaalla tehdään, kun ollaan merellä eikä tiedetä
 * missä ollaan. Tekstit on kirjoitettu käsin; kaavat ovat standardia
 * merenkulkumatematiikkaa ja luvut aineistosta.
 */
export const NAVIGOINTI = [
${navigointiRivit}
];

export const TAHTITAIVAS = {
  tahdet: TAHDET,
  kentat: TAHTI_KENTAT,
  kuviot: TAHTIKUVIOT,
  asterismit: ASTERISMIT,
  osoittimet: OSOITTIMET,
  navigointi: NAVIGOINTI,
  kreikka: KREIKKA,

  otsikko: 'Tähtitaivas ja sekstantti',
  kuvaus: 'Sama taivas, jonka alla isoisä purjehti: ${valitut.size - rajanTakaa.size} paljain '
    + 'silmin näkyvää tähteä, ${kuviotUlos.length} tähdistöä ja ne kolme temppua, joilla '
    + 'sijainnin sai selville ennen satelliitteja.',

  // Koordinaatisto kirjattuna myös ohjelmallisesti, jotta piirtäjä voi
  // tarkistaa sen eikä joudu luottamaan kommenttiin.
  koordinaatisto: {
    tyyppi: 'taivas',
    ra: 'asteina 0…360, tasauspiste J2000.0',
    dec: 'asteina -90…+90, tasauspiste J2000.0',
    varoitus: 'Nämä eivät ole lon/lat. Älä projisoi maailmankartalle.',
  },
  kirkkausraja: ${KIRKKAUSRAJA},
  himmeampiaMukana: ${rajanTakaa.size},

  lahde: {
    tahdet: ${jono(LAHTEET.tahdet.aineisto)},
    tahdetViite: ${jono(LAHTEET.tahdet.viite)},
    kuviot: ${jono(LAHTEET.kuviot.aineisto)},
    kuviotViite: ${jono(LAHTEET.kuviot.viite)},
    nimet: ${jono(LAHTEET.nimet.aineisto)},
    nimetViite: ${jono(LAHTEET.nimet.viite)},
    suomi: ${jono(LAHTEET.suomi.aineisto)},
    suomiViite: ${jono(LAHTEET.suomi.viite)},
    haettu: ${jono(HAETTU)},
  },

  lisenssi: {
    tahdet: ${jono(LAHTEET.tahdet.lisenssi)},
    kuviot: ${jono(LAHTEET.kuviot.lisenssi)},
    nimet: ${jono(LAHTEET.nimet.lisenssi)},
    suomi: ${jono(LAHTEET.suomi.lisenssi)},
  },
};
`;

const kilotavut = Math.round(Buffer.byteLength(teksti) / 1024);
console.log(`  tiedoston koko ${kilotavut} kt`);
if (kilotavut > 200) throw new Error(`tiedosto on ${kilotavut} kt, katto on 200 kt — laske kirkkausrajaa`);

if (kuiva) {
  console.log('  --kuiva: tiedostoa ei kirjoitettu');
  process.exit(0);
}

writeFileSync(KOHDE, teksti);
console.log(`kirjoitettu ${KOHDE} (${kilotavut} kt)`);
