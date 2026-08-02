/*
 * Etsii Library of Congressista korvaajat kuville, joille Commonsista ei
 * löytynyt riittävän isoa vaihtoehtoa.
 *
 *   node tools/hae-loc-korvaajat.mjs
 *
 * Miksi juuri LoC: kortin vanha kuva on aitoa 1900-luvun alun aineistoa,
 * ja Commonsissa se on usein pieni skannaus. LoC skannaa alkuperäiset
 * lasilevyt ja vedokset tuhansien pikselien tarkkuudella, ja
 * Photochrom-kokoelma on nimenomaan vuosilta 1890–1910 eli juuri isoisän
 * aikaa. Public domain, ei avainta.
 *
 * Työkalu EI kirjoita pakettiin. Se tuottaa ehdotuslistan, josta kuvat
 * valitaan ja kuvatekstit kirjoitetaan käsin — teksti kertoo juuri siitä
 * kuvasta, joka valitaan, eikä sitä voi tuottaa koneella.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const JUURI = join(dirname(fileURLToPath(import.meta.url)), '..');
const RAJA = 1200;
const nuku = (ms) => new Promise((r) => { setTimeout(r, ms); });

/*
 * Verkkovirhe ei ole sama asia kuin virhevastaus.
 *
 * Ensimmäinen versio käsitteli vain HTTP-koodit, ja katkennut yhteys
 * (UND_ERR_SOCKET) kaatoi koko ajon kesken listan. Palvelin katkaisee
 * yhteyden ajoittain ilman vastausta, ja se on normaalia — se pitää
 * yrittää uudestaan aivan kuten 429.
 */
async function hae(osoite, yrityksia = 5) {
  for (let i = 0; i < yrityksia; i++) {
    try {
      /*
       * Ei AbortSignal.timeoutia. Se heittää ajastimestaan try-lohkon
       * ULKOPUOLELLA, jos pyyntö on jo valmistunut — ja kaatoi koko
       * ajon kesken listan. Uudelleenyritys riittää suojaksi.
       */
      const vastaus = await fetch(osoite, {
        headers: { 'user-agent': 'Matkakirja/1.0 (opetuspeli)' },
      });
      if (vastaus.ok) return vastaus.json();
      if (vastaus.status !== 429) { console.log(`  HTTP ${vastaus.status}`); return null; }
    } catch (virhe) {
      console.log(`  yhteys katkesi (${virhe?.cause?.code ?? virhe?.name ?? 'tuntematon'})`);
    }
    await nuku(3000 * (i + 1));
  }
  console.log('  luovutetaan');
  return null;
}

/*
 * LoC kertoo kuvan koon osoitteen perässä (#h=1024&w=1580). Se on ainoa
 * paikka, josta koon saa ilman erillistä pyyntöä jokaiselle kuvalle.
 */
function mitat(osoite) {
  const h = Number(osoite.match(/[#&]h=(\d+)/)?.[1] ?? 0);
  const w = Number(osoite.match(/[#&]w=(\d+)/)?.[1] ?? 0);
  return { leveys: w, korkeus: h };
}

/** Suurin riittävän iso vaakakuva osumasta. */
function parasKuva(osuma) {
  return (osuma.image_url ?? [])
    .map((u) => ({ osoite: u.split('#')[0], ...mitat(u) }))
    .filter((k) => k.leveys >= RAJA && k.leveys >= k.korkeus * 0.9)
    .sort((a, b) => b.leveys - a.leveys)[0] ?? null;
}

const pienet = JSON.parse(readFileSync(join(JUURI, 'tools', 'kuvakorvaajat.json'), 'utf8'));
const kohteet = pienet.filter((p) => !p.ehdokkaat.length);
console.log(`${kohteet.length} kuvaa ilman Commons-ehdokasta\n`);

/*
 * Hakusanat. Pelin kaupunkinimi on suomeksi, LoC on englanniksi, ja
 * moni paikka tunnetaan aikakauden nimellä: Ras Hafun on 'Hafun',
 * Kilimanjaro 'Kilimanjaro'. Suomenkielinen nimi ei löydä mitään.
 */
const HAKU = {
  sarajevo: 'Sarajevo', ateena: 'Athens Greece', kreeta: 'Crete',
  sisilia: 'Sicily', lissabon: 'Lisbon', lappi: 'Lapland',
  tanger: 'Tangier Morocco', kairo: 'Cairo Egypt', madagaskar: 'Madagascar',
  addisabeba: 'Addis Ababa', rashafun: 'Somaliland coast', kamerun: 'Cameroon',
  viktorianputoukset: 'Victoria Falls', bahrelghazal: 'Sudan Nile',
  murzuk: 'Libya Sahara', dakar: 'Dakar Senegal', sierraleone: 'Freetown',
  orjarannikko: 'Dahomey', kano: 'Kano Nigeria', kilimandzaro: 'Kilimanjaro',
  darfur: 'Darfur Sudan', suakin: 'Suakin', timbuktu: 'Timbuktu',
  marrakech: 'Marrakesh Morocco', lagos: 'Lagos Nigeria', sofia: 'Sofia Bulgaria',
};

const ehdotukset = [];
for (const p of kohteet) {
  const sana = HAKU[p.kaupunki] ?? p.kaupunki;
  const data = await hae(`https://www.loc.gov/photos/?q=${encodeURIComponent(sana)}`
    + '&fo=json&c=40&at=results');
  const osumat = (data?.results ?? [])
    .map((x) => ({ osuma: x, kuva: parasKuva(x) }))
    .filter((x) => x.kuva)
    .slice(0, 6)
    .map((x) => ({
      otsikko: (x.osuma.title ?? '').slice(0, 120),
      kuvaus: (x.osuma.description?.[0] ?? '').slice(0, 400),
      vuosi: x.osuma.date ?? '',
      osoite: x.kuva.osoite,
      leveys: x.kuva.leveys,
      korkeus: x.kuva.korkeus,
    }));
  ehdotukset.push({ ...p, haku: sana, loc: osumat });
  console.log(`${p.kaupunki}/${p.kohta} (${sana}): ${osumat.length} ehdokasta`
    + (osumat[0] ? ` — suurin ${osumat[0].leveys} px` : ''));
  // Tulos levylle joka kierroksella: katkennut ajo ei vie tehtyä työtä.
  writeFileSync(join(JUURI, 'tools', 'loc-korvaajat.json'), `${JSON.stringify(ehdotukset, null, 1)}\n`);
  await nuku(600);
}

writeFileSync(join(JUURI, 'tools', 'loc-korvaajat.json'), `${JSON.stringify(ehdotukset, null, 1)}\n`);
const tyhjat = ehdotukset.filter((e) => !e.loc.length);
console.log(`\n${ehdotukset.length - tyhjat.length} löytyi, ${tyhjat.length} ei.`);
if (tyhjat.length) console.log('ei löytynyt:', tyhjat.map((e) => `${e.kaupunki}/${e.kohta}`).join(' '));
