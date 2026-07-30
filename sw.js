// Palvelutyöntekijä: pelin tiedostot välimuistiin, jotta sovellus toimii myös offline.
const CACHE = 'matkakirja-2026-07-30.95';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/main.js',
  './js/ui.js',
  './js/game.js',
  './js/ai.js',
  './js/rules.js',
  './js/pack.js',
  './js/passport.js',
  './js/wiki.js',
  './js/packs/maailma.js',
  './js/packs/maailma-questions.js',
  './js/packs/africa.js',
  './js/packs/africa-questions.js',
  './js/packs/africa-puzzles.js',
  './js/packs/africa-borders.js',
  './js/packs/africa-countries.js',
  './js/packs/africa-tiivistelmat.js',
  './js/packs/africa-valokuvat.js',
  './js/packs/africa-saapumiset.js',
  './js/packs/africa-kulttuuri.js',
  './js/packs/africa-artikkelit.js',
  './js/packs/africa-maatiedot.js',
  './js/packs/europe.js',
  './js/packs/europe-questions.js',
  './js/packs/middleeast.js',
  './js/packs/middleeast-questions.js',
  './js/packs/asia.js',
  './js/packs/asia-questions.js',
  './js/packs/oceania.js',
  './js/packs/oceania-questions.js',
  './js/packs/northamerica.js',
  './js/packs/northamerica-questions.js',
  './js/packs/southamerica.js',
  './js/packs/southamerica-questions.js',
  './js/packs/istanbul.js',
  './js/packs/suomi.js',
  './js/packs/suomi-questions.js',
  './js/packs/istanbul-questions.js',
  './js/tokens.js',
  './js/mapart.js',
  './js/aani-ehdokkaat.js',
  './js/sound.js',
  './js/ambience-stream.js',
  './js/die.js',
  './assets/icon.svg',
  './assets/audio/intro-puhe.mp3',
  './assets/audio/puhe-lento-alku.mp3',
  './assets/audio/efekti-klik.mp3',
  './assets/audio/efekti-paperi.mp3',
  './assets/audio/efekti-kolikot.mp3',
  './assets/audio/efekti-oikein.mp3',
  './assets/audio/efekti-vaarin.mp3',
  './assets/audio/efekti-pyyhkaisy.mp3',
  './assets/audio/efekti-askel.mp3',
  './assets/audio/efekti-saapuminen.mp3',
  './assets/audio/efekti-laiva.mp3',
  './assets/audio/efekti-lento.mp3',
  './assets/audio/efekti-vihje.mp3',
  './assets/audio/efekti-tikitys.mp3',
  './assets/audio/efekti-aikaloppui.mp3',
  './assets/audio/efekti-kaanto.mp3',
  './assets/audio/efekti-naksu.mp3',
  './assets/audio/efekti-tahti.mp3',
  './assets/audio/efekti-jalokivi.mp3',
  './assets/audio/efekti-kenka.mp3',
  './assets/audio/efekti-rosvo.mp3',
  './assets/audio/efekti-tyhja.mp3',
  './assets/audio/efekti-jumissa.mp3',
  './assets/audio/efekti-vuoro.mp3',
  './assets/audio/efekti-voitto.mp3',
  './assets/audio/musiikki-visa-afrikka-1.mp3',
  './assets/audio/musiikki-visa-afrikka-2.mp3',
  './assets/audio/musiikki-visa-afrikka-3.mp3',
  './assets/audio/puhe-africa-saapuminen-tanger.mp3',
  './assets/audio/puhe-africa-saapuminen-kairo.mp3',
  './assets/audio/puhe-africa-saapuminen-marrakech.mp3',
  './assets/audio/puhe-africa-saapuminen-lagos.mp3',
  './assets/audio/puhe-africa-saapuminen-karthago.mp3',
  './assets/audio/puhe-africa-saapuminen-tshadjarvi.mp3',
  './assets/audio/puhe-africa-saapuminen-viktorianputoukset.mp3',
  './assets/audio/puhe-africa-saapuminen-nairobi.mp3',
  './assets/audio/puhe-africa-saapuminen-sthelena.mp3',
  './assets/audio/puhe-africa-saapuminen-tripoli.mp3',
  './assets/audio/puhe-africa-saapuminen-murzuk.mp3',
  './assets/audio/puhe-africa-saapuminen-alkufra.mp3',
  './assets/audio/puhe-africa-saapuminen-sahara.mp3',
  './assets/audio/puhe-africa-saapuminen-ahaggar.mp3',
  './assets/audio/puhe-africa-saapuminen-timbuktu.mp3',
  './assets/audio/puhe-africa-saapuminen-gao.mp3',
  './assets/audio/puhe-africa-saapuminen-dakar.mp3',
  './assets/audio/puhe-africa-saapuminen-sierraleone.mp3',
  './assets/audio/puhe-africa-saapuminen-kappalmas.mp3',
  './assets/audio/puhe-africa-saapuminen-kumasi.mp3',
  './assets/audio/puhe-africa-saapuminen-orjarannikko.mp3',
  './assets/audio/puhe-africa-saapuminen-kano.mp3',
  './assets/audio/puhe-africa-saapuminen-kamerun.mp3',
  './assets/audio/puhe-africa-saapuminen-kongo.mp3',
  './assets/audio/puhe-africa-saapuminen-angola.mp3',
  './assets/audio/puhe-africa-saapuminen-namib.mp3',
  './assets/audio/puhe-africa-saapuminen-kapkaupunki.mp3',
  './assets/audio/puhe-africa-saapuminen-kimberley.mp3',
  './assets/audio/puhe-africa-saapuminen-mosambik.mp3',
  './assets/audio/puhe-africa-saapuminen-madagaskar.mp3',
  './assets/audio/puhe-africa-saapuminen-sansibar.mp3',
  './assets/audio/puhe-africa-saapuminen-kilimandzaro.mp3',
  './assets/audio/puhe-africa-saapuminen-viktoria.mp3',
  './assets/audio/puhe-africa-saapuminen-tanganjika.mp3',
  './assets/audio/puhe-africa-saapuminen-bahrelghazal.mp3',
  './assets/audio/puhe-africa-saapuminen-darfur.mp3',
  './assets/audio/puhe-africa-saapuminen-suakin.mp3',
  './assets/audio/puhe-africa-saapuminen-addisabeba.mp3',
  './assets/audio/puhe-africa-saapuminen-rashafun.mp3',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // cache: 'reload' ohittaa selaimen HTTP-välimuistin: ilman sitä
      // iOS saattoi täyttää uuden välimuistiversion vanhoilla
      // tiedostoilla, jolloin versionumero päivittyi mutta osa
      // sisällöstä (esim. matkakirjan tekstit) jäi vanhaksi.
      .then((cache) => cache.addAll(SHELL.map((osoite) => new Request(osoite, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Välimuisti ensin, päivitys taustalla: peli aukeaa heti ja toimii offline,
// mutta uusi versio latautuu taustalla ja on käytössä seuraavalla avauksella.
// Yläpalkin Päivitä-nappi tyhjentää välimuistin, jolloin uusin versio tulee heti.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // Vain oma alkuperä. Ulkoiset kutsut (Wikipedian tiivistelmät) menevät
  // suoraan verkkoon: niitä ei välimuistiteta, ja ennen kaikkea alla oleva
  // index.html-varapolku palauttaisi niille HTML-sivun JSONin sijaan.
  if (new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then((hit) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => hit ?? caches.match('./index.html'));
      return hit ?? network;
    }),
  );
});
