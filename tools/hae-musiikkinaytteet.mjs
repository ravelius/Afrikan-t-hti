// Etsii kulttuurinostojen musiikkikorteille ilmaisen ääninäytteen,
// joka lähtee soimaan suoraan napista.
//
// Ennen tätä musiikkikortissa oli Apple Music -linkin rinnalla linkki
// kansallisen yleisradion etusivulle ("ERT", "BBC"). Omistajan huomio:
// napista ei kuulu musiikkia, vaan aukeaa outo sivu. Näyte kuuluu
// soida heti — sivulle päätyminen on eri asia kuin musiikin
// kuuleminen.
//
//   node tools/hae-musiikkinaytteet.mjs [--ulos tiedosto.json] [--vain kaupunki]
//
// Kaksi lähdettä, molemmat mp3-muodossa. Ogg ja flac jätetään pois,
// koska Safari ei soita niitä — ja peliä pelataan iPadilla.
//
//   1. Wikimedia Commons. Lisenssi luetaan tiedoston omasta
//      metadatasta, joten sitä ei tarvitse arvata.
//   2. archive.org, mutta vain kohteet joilla on `licenseurl`.
//      Ilman sitä oikeudet ovat tuntemattomat; 78-levyjen
//      digitoinneissa (Great 78 Project) niitä ei ole, joten ne
//      jätetään kokonaan pois vaikka osumat olisivat kuinka osuvia.
//
// Työkalu ei kirjoita pelin tiedostoja. Se kerää ehdokkaat, ja
// valinta tehdään käsin: hakusana "sardana" löytää myös kadun nimen
// ja levyn, jonka nimessä sana sattuu esiintymään.

import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const AGENTTI = 'Matkakirja/1.0 (https://github.com/ravelius/Matkakirja)';
const arg = (nimi, oletus) => {
  const i = process.argv.indexOf(nimi);
  return i > 0 ? process.argv[i + 1] : oletus;
};
const ULOS = arg('--ulos', join(JUURI, '../musiikkinaytteet.json'));
const VAIN = arg('--vain', null);

const nuku = (s) => execFileSync('sleep', [String(s)]);
const hae = (url, data = []) => {
  const komento = ['-sSL', '--max-time', '60', '--retry', '2', '--retry-delay', '3',
    '-A', AGENTTI, '-G', url];
  for (const d of data) komento.push('--data-urlencode', d);
  return JSON.parse(execFileSync('curl', komento, { maxBuffer: 1e8 }).toString());
};

/*
 * Hakusanat kortti kerrallaan. Yleinen sana ei riitä: "sardana" osuu
 * myös Barcelonan kadunnimeen ja "joik" ei osu mihinkään, jos kirjoitusasu
 * on toinen. Siksi jokaisella kortilla on oma lista, jossa on sekä
 * paikallinen että kansainvälinen kirjoitusasu.
 *
 * `kaupunki` on kulttuurinoston kaupunki, `osuma` tunnistesana, jonka
 * pitää esiintyä otsikossa tai tekijässä — se karsii sattumaosumat.
 */
const KORTIT = [
  { kaupunki: 'ateena', haut: ['rebetiko', 'rembetiko', 'bouzouki greek'], osuma: /rebe|remb|bouzouk|greek/i },
  { kaupunki: 'kreeta', haut: ['cretan lyra', 'lyra crete', 'kritiki lyra'], osuma: /lyra|cret|krit/i },
  { kaupunki: 'dubrovnik', haut: ['klapa dalmatia', 'klapa singing', 'dalmatian a cappella'], osuma: /klapa|dalmat/i },
  { kaupunki: 'sofia', haut: ['gaida bagpipe bulgaria', 'bulgarian folk music', 'kaba gaida'], osuma: /gaida|bulgar/i },
  { kaupunki: 'lontoo', haut: ['Elgar Pomp and Circumstance', 'Land of Hope and Glory'], osuma: /elgar|pomp|hope and glory/i },
  { kaupunki: 'edinburgh', haut: ['Great Highland Bagpipe pibroch', 'scottish bagpipe piobaireachd'], osuma: /bagpipe|piob|pibroch|highland/i },
  { kaupunki: 'dublin', haut: ['uilleann pipes', 'irish pipes traditional'], osuma: /uilleann|irish pipe/i },
  { kaupunki: 'pariisi', haut: ['musette accordion paris', 'valse musette'], osuma: /musette|accord/i },
  { kaupunki: 'lissabon', haut: ['fado portuguese guitar', 'guitarra portuguesa fado'], osuma: /fado|guitarra portug/i },
  { kaupunki: 'madrid', haut: ['chotis madrileno', 'organillo madrid'], osuma: /chotis|schotis|organillo/i },
  { kaupunki: 'barcelona', haut: ['sardana cobla', 'cobla catalana'], osuma: /sardana|cobla/i },
  { kaupunki: 'amsterdam', haut: ['draaiorgel', 'street organ dutch', 'barrel organ amsterdam'], osuma: /draaiorgel|street organ|barrel organ/i },
  { kaupunki: 'berliini', haut: ['berlin techno', 'techno set berlin'], osuma: /techno/i },
  { kaupunki: 'wien', haut: ['An der schoenen blauen Donau', 'Blue Danube Strauss'], osuma: /donau|danube/i },
  { kaupunki: 'alpit', haut: ['alphorn', 'alpenhorn', 'Alphorn Schweiz'], osuma: /alphorn|alpenhorn|alpuhorn/i },
  { kaupunki: 'praha', haut: ['Vltava Smetana', 'Moldau Smetana'], osuma: /vltava|moldau/i },
  { kaupunki: 'budapest', haut: ['hungarian folk music tanchaz', 'magyar nepzene'], osuma: /hungar|magyar|nepzene|tanchaz/i },
  { kaupunki: 'varsova', haut: ['Chopin mazurka', 'Chopin polonaise'], osuma: /chopin/i },
  { kaupunki: 'bukarest', haut: ['lautari romania', 'romanian folk music taraf'], osuma: /lautar|roman|taraf/i },
  { kaupunki: 'kiova', haut: ['bandura kobzar', 'ukrainian bandura'], osuma: /bandura|kobza/i },
  { kaupunki: 'odessa', haut: ['odessa songs klezmer', 'odessa mama'], osuma: /odessa|klezmer/i },
  { kaupunki: 'moskova', haut: ['Tchaikovsky Swan Lake', 'Tchaikovsky Nutcracker'], osuma: /tchaikov|swan lake|nutcracker/i },
  { kaupunki: 'pietari', haut: ['Shostakovich symphony', 'Glinka'], osuma: /shostakovich|glinka/i },
  { kaupunki: 'tallinna', haut: ['estonian choir song festival', 'eesti laulupidu'], osuma: /eston|eesti|laulupidu/i },
  { kaupunki: 'riika', haut: ['latvian folk song daina', 'latviesu tautasdziesma'], osuma: /latvi|daina/i },
  { kaupunki: 'vilna', haut: ['sutartines', 'lithuanian folk song'], osuma: /sutartin|lithuan|lietuv/i },
  { kaupunki: 'istanbul', haut: ['mehter marsi', 'ottoman military band', 'janissary music'], osuma: /mehter|janissar|ottoman/i },
  { kaupunki: 'helsinki', haut: ['Finlandia Sibelius', 'Sibelius'], osuma: /finlandia|sibelius/i },
  { kaupunki: 'tukholma', haut: ['swedish folk music nyckelharpa', 'polska sweden fiddle'], osuma: /nyckelharpa|swed|polska/i },
  { kaupunki: 'oslo', haut: ['Hall of the Mountain King Grieg', 'Peer Gynt Grieg'], osuma: /grieg|mountain king|peer gynt/i },
  { kaupunki: 'kobenhavn', haut: ['Carl Nielsen symphony', 'Carl Nielsen'], osuma: /nielsen/i },
  { kaupunki: 'lappi', haut: ['joik sami', 'yoik saami', 'juoiggus'], osuma: /joik|yoik|juoig|sami|saami/i },
  { kaupunki: 'tromssa', haut: ['norwegian electronic music', 'nordic synth'], osuma: /norweg|nordic|synth/i },
];

// --- Wikimedia Commons -------------------------------------------------------

/**
 * Commonsin tiedostohaku. Lisenssi ja tekijä luetaan extmetadatasta,
 * joten kumpaakaan ei tarvitse päätellä tiedoston nimestä.
 *
 * Vain mp3 kelpaa. Commonsin äänitiedostot ovat useimmiten ogg tai
 * flac, joita Safari ei soita — ja peliä pelataan iPadilla, joten
 * ogg-näyte olisi juuri siellä hiljainen.
 */
function commons(haku) {
  const j = hae('https://commons.wikimedia.org/w/api.php', [
    'action=query', 'format=json', 'generator=search', 'gsrnamespace=6',
    `gsrsearch=filetype:audio ${haku}`, 'gsrlimit=20',
    'prop=imageinfo', 'iiprop=url|size|mime|extmetadata',
    'iiextmetadatafilter=LicenseShortName|Artist|LicenseUrl',
  ]);
  const sivut = j.query?.pages ?? {};
  const ulos = [];
  for (const v of Object.values(sivut)) {
    const i = v.imageinfo?.[0];
    if (!i || !/audio\/mpeg/.test(i.mime ?? '')) continue;
    const puhdas = (t) => (t ?? '').replace(/<[^>]*>/g, '').trim();
    ulos.push({
      lahde: 'commons',
      otsikko: v.title.replace(/^File:/, ''),
      url: i.url,
      koko: i.size ?? 0,
      tekija: puhdas(i.extmetadata?.Artist?.value) || 'tuntematon',
      lisenssi: puhdas(i.extmetadata?.LicenseShortName?.value) || 'tuntematon',
    });
  }
  return ulos;
}

// --- archive.org -------------------------------------------------------------

/**
 * archive.orgin haku, rajattuna kohteisiin joilla on licenseurl.
 *
 * Rajaus on tarkoituksellisen tiukka. Great 78 Project (collection
 * georgeblood) sisältää juuri näitä levytyksiä valtavasti ja osuu
 * hakusanoihin paremmin kuin mikään muu, mutta sen kohteissa ei ole
 * lisenssitietoa lainkaan — oikeudet ovat levykohtaiset ja osin
 * riidanalaiset. Peli kopioi äänet omaan peiliinsä, joten tuntematon
 * lisenssi ei kelpaa.
 */
function archive(haku, osuma) {
  const j = hae('https://archive.org/advancedsearch.php', [
    `q=mediatype:audio AND licenseurl:[* TO *] AND (${haku})`,
    'fl[]=identifier', 'fl[]=title', 'fl[]=creator', 'fl[]=licenseurl',
    'rows=15', 'output=json',
  ]);
  const ulos = [];
  for (const d of j.response?.docs ?? []) {
    const teksti = `${d.title ?? ''} ${[d.creator].flat().join(' ')}`;
    if (!osuma.test(teksti)) continue;
    ulos.push({
      lahde: 'archive',
      tunnus: d.identifier,
      otsikko: d.title ?? d.identifier,
      tekija: [d.creator].flat().filter(Boolean).join(', ') || 'tuntematon',
      lisenssi: d.licenseurl,
    });
  }
  return ulos;
}

/** Kohteen mp3-tiedosto ja kesto. Ilman mp3:a kohde ei kelpaa. */
function archiveMp3(tunnus) {
  const j = hae(`https://archive.org/metadata/${tunnus}`);
  const mp3 = (j.files ?? [])
    .filter((f) => /mp3/i.test(f.format ?? '') && f.name && !/_spectrogram/i.test(f.name))
    .sort((a, b) => Number(a.size ?? 0) - Number(b.size ?? 0))[0];
  if (!mp3) return null;
  const kesto = String(mp3.length ?? '').includes(':')
    ? mp3.length.split(':').reduce((s, o) => s * 60 + Number(o), 0)
    : Math.round(Number(mp3.length ?? 0));
  return {
    url: `https://archive.org/download/${tunnus}/${encodeURIComponent(mp3.name)}`,
    koko: Number(mp3.size ?? 0),
    kesto: kesto || null,
  };
}

// --- ajo ---------------------------------------------------------------------

const tulos = {};
for (const kortti of KORTIT) {
  if (VAIN && kortti.kaupunki !== VAIN) continue;
  const ehdokkaat = [];
  const nahty = new Set();
  for (const haku of kortti.haut) {
    let osumat = [];
    try {
      osumat = [...commons(haku), ...archive(haku, kortti.osuma)];
    } catch (e) {
      console.log(`  ${kortti.kaupunki}: haku "${haku}" epäonnistui — ${e.message}`);
    }
    for (const o of osumat) {
      const avain = o.url ?? o.tunnus;
      if (nahty.has(avain)) continue;
      nahty.add(avain);
      if (o.lahde === 'archive') {
        let tiedot = null;
        try { tiedot = archiveMp3(o.tunnus); } catch { /* ohitetaan */ }
        if (!tiedot) continue;
        Object.assign(o, tiedot);
        nuku(0.3);
      }
      ehdokkaat.push(o);
    }
    nuku(0.5);
  }
  tulos[kortti.kaupunki] = ehdokkaat;
  console.log(`  ${kortti.kaupunki.padEnd(12)} ${String(ehdokkaat.length).padStart(3)} ehdokasta`);
}

writeFileSync(ULOS, JSON.stringify(tulos, null, 1));
console.log(`\nKirjoitettu ${ULOS}`);
const tyhjat = Object.entries(tulos).filter(([, v]) => !v.length).map(([k]) => k);
if (tyhjat.length) console.log(`Ilman ehdokkaita: ${tyhjat.join(', ')}`);
