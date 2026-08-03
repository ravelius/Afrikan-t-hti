/*
 * Työhuoneen oma palvelutyöntekijä.
 *
 * Miksi erillinen pelin sw.js:stä: työhuone on eri sovellus. Se
 * asennetaan kotivalikkoon omana kuvakkeenaan, sitä päivitetään eri
 * tahtiin kuin peliä, eikä sen välimuisti saa kaataa pelin välimuistia
 * (eikä toisin päin). Sama sw.js kahdelle sovellukselle tarkoittaisi,
 * että toisen päivitys tyhjentää toisen.
 *
 * Strategia on VERKKO ENSIN, välimuisti varalle.
 *
 * Peli tekee päinvastoin, ja syystä: peli on julkaistu tuote, jonka
 * pitää käynnistyä lentokoneessa. Työhuone on työkalu, jota katsotaan
 * kehityksen aikana, ja siinä vanha tieto on pahempi kuin hidas
 * lataus — työhuoneen koko tarkoitus on kertoa, mikä pelissä juuri nyt
 * on. Välimuisti on siis vain turvaverkko sille hetkelle, kun verkkoa
 * ei ole.
 */
const KORI = 'tyohuone-2026-08-03.3';

/*
 * Vain kuori esiladataan. Pelin paketit (js/packs/*) ovat isoja ja
 * niitä on kymmeniä; ne tallentuvat koriin sitä mukaa kuin työhuone
 * niitä pyytää, eikä asennus kestä minuuttia.
 */
const KUORI = [
  './tyohuone.html',
  './tyohuone.webmanifest',
  './css/tyohuone.css',
  './css/tyohuone-aanistudio.css',
  './tyohuone-kasikirja.html',
  './js/tyohuone-data.js',
  './js/muutokset.js',
  './js/pack.js',
];

self.addEventListener('install', (e) => {
  // skipWaiting: uusi versio ottaa vallan heti eikä jää odottamaan
  // välilehtien sulkemista. Työhuoneessa se on haluttua.
  e.waitUntil(caches.open(KORI).then((k) => k.addAll(KUORI)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const nimi of await caches.keys()) {
      // Vain työhuoneen omat korit siivotaan. Pelin kori alkaa
      // 'matkakirja-' eikä kuulu tälle työntekijälle.
      if (nimi.startsWith('tyohuone-') && nimi !== KORI) await caches.delete(nimi);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const pyynto = e.request;
  if (pyynto.method !== 'GET') return;
  const osoite = new URL(pyynto.url);
  if (osoite.origin !== self.location.origin) return;

  e.respondWith((async () => {
    try {
      const vastaus = await fetch(pyynto);
      /*
       * Vain onnistuneet vastaukset talteen. Ilman tätä 404-sivu
       * jäisi koriin ja näyttäisi ikuisesti siltä, että tiedostoa ei
       * ole — vaikka se olisi jo lisätty.
       */
      if (vastaus.ok) {
        const kori = await caches.open(KORI);
        kori.put(pyynto, vastaus.clone());
      }
      return vastaus;
    } catch (virhe) {
      const talletettu = await caches.match(pyynto);
      if (talletettu) return talletettu;
      throw virhe;
    }
  })());
});

/* Sivu voi pyytää päivitystä heti, esim. Päivitä-napista. */
self.addEventListener('message', (e) => {
  if (e.data === 'paivita') self.skipWaiting();
});
