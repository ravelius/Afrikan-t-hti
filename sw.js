// Palvelutyöntekijä: pelin tiedostot välimuistiin, jotta sovellus toimii myös offline.
const CACHE = 'matkakirja-2026-08-01.113';
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
  './js/packs/liput-paikalliset.js',
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
  './assets/audio/puhe-africa-vihje-addisabeba.mp3',
  './assets/audio/puhe-africa-vihje-ahaggar.mp3',
  './assets/audio/puhe-africa-vihje-alkufra.mp3',
  './assets/audio/puhe-africa-vihje-angola.mp3',
  './assets/audio/puhe-africa-vihje-bahrelghazal.mp3',
  './assets/audio/puhe-africa-vihje-dakar.mp3',
  './assets/audio/puhe-africa-vihje-darfur.mp3',
  './assets/audio/puhe-africa-vihje-gao.mp3',
  './assets/audio/puhe-africa-vihje-kamerun.mp3',
  './assets/audio/puhe-africa-vihje-kano.mp3',
  './assets/audio/puhe-africa-vihje-kappalmas.mp3',
  './assets/audio/puhe-africa-vihje-karthago.mp3',
  './assets/audio/puhe-africa-vihje-kilimandzaro.mp3',
  './assets/audio/puhe-africa-vihje-kimberley.mp3',
  './assets/audio/puhe-africa-vihje-kongo.mp3',
  './assets/audio/puhe-africa-vihje-kumasi.mp3',
  './assets/audio/puhe-africa-vihje-lagos.mp3',
  './assets/audio/puhe-africa-vihje-madagaskar.mp3',
  './assets/audio/puhe-africa-vihje-marrakech.mp3',
  './assets/audio/puhe-africa-vihje-mosambik.mp3',
  './assets/audio/puhe-africa-vihje-murzuk.mp3',
  './assets/audio/puhe-africa-vihje-nairobi.mp3',
  './assets/audio/puhe-africa-vihje-namib.mp3',
  './assets/audio/puhe-africa-vihje-orjarannikko.mp3',
  './assets/audio/puhe-africa-vihje-rashafun.mp3',
  './assets/audio/puhe-africa-vihje-sahara.mp3',
  './assets/audio/puhe-africa-vihje-sansibar.mp3',
  './assets/audio/puhe-africa-vihje-sierraleone.mp3',
  './assets/audio/puhe-africa-vihje-sthelena.mp3',
  './assets/audio/puhe-africa-vihje-suakin.mp3',
  './assets/audio/puhe-africa-vihje-tanganjika.mp3',
  './assets/audio/puhe-africa-vihje-timbuktu.mp3',
  './assets/audio/puhe-africa-vihje-tripoli.mp3',
  './assets/audio/puhe-africa-vihje-tshadjarvi.mp3',
  './assets/audio/puhe-africa-vihje-viktoria.mp3',
  './assets/audio/puhe-africa-vihje-viktorianputoukset.mp3',
  './assets/audio/puhe-europe-saapuminen-venetsia.mp3',
  './assets/audio/puhe-europe-vihje-venetsia.mp3',
  './assets/valokuvat/006-dune-45-in-sossusvlei-at-sunrise-photo-by-giles-laurent.jpg',
  './assets/valokuvat/adansonia-grandidieri04.jpg',
  './assets/valokuvat/antonio-vivaldi.jpg',
  './assets/valokuvat/bo-kaap-colourful-houses-30114819980.jpg',
  './assets/valokuvat/canal-giovanni-antonio-canaletto-return-of-the-bucentoro-to-.jpg',
  './assets/valokuvat/cattle-of-the-dinka-people-juba-south-sudan-20101230-05.jpg',
  './assets/valokuvat/cotton-tree-sierra-leone.jpg',
  './assets/valokuvat/elfnarmarrakech2014.jpg',
  './assets/valokuvat/ethiopian-coffee-ceremony.jpg',
  './assets/valokuvat/eyo-masquerades-lagos-state-nigeria.jpg',
  './assets/valokuvat/fishermen-on-the-shores-of-lake-victoria.jpg',
  './assets/valokuvat/fishing-on-lake-victoria-01.jpg',
  './assets/valokuvat/frankincense-2005-12-31.jpg',
  './assets/valokuvat/henri-matisse-1911-12-la-fenetre-a-tanger-paysage-vu-d-une-f.jpg',
  './assets/valokuvat/island-of-goree-senegal.jpg',
  './assets/valokuvat/kente-cloth.jpg',
  './assets/valokuvat/kofar-mata-dye-pit-kano.jpg',
  './assets/valokuvat/kufra-oasis.jpg',
  './assets/valokuvat/lady-of-carthage-mosaic-bardo.jpg',
  './assets/valokuvat/lake-victoria-as-visible-from-kisumu-city.jpg',
  './assets/valokuvat/lesescales2019manudibango-03-cropped.jpg',
  './assets/valokuvat/liberia-dan-maschera-xx-sec-01.jpg',
  './assets/valokuvat/libya-4924-pictograms-tadrart-acacus-luca-galuzzi-2007.jpg',
  './assets/valokuvat/libyan-malouf.jpg',
  './assets/valokuvat/longwood-house-le-12-janvier-2008.jpg',
  './assets/valokuvat/lunar-rainbow-at-victoria-falls-hp-l2778e2.jpg',
  './assets/valokuvat/masks-of-africa-of-chokwe-people-freigestellt.jpg',
  './assets/valokuvat/mount-kilimanjaro.jpg',
  './assets/valokuvat/mv-liemba.jpg',
  './assets/valokuvat/pescaria-rialto-venice.jpg',
  './assets/valokuvat/sanza-boa-zaire-musee-royal-de-l-afrique-centrale.jpg',
  './assets/valokuvat/still-life-with-stork-and-fishing-boats-along-shore-of-lake-.jpg',
  './assets/valokuvat/suakin-el-geyf-mosque.jpg',
  './assets/valokuvat/sudan-jebel-marra-deriba-lakes-edited.jpg',
  './assets/valokuvat/sunset-at-lake-victoria.jpg',
  './assets/valokuvat/sunset-on-lake-victoria-in-kisumu.jpg',
  './assets/valokuvat/timbuktu-manuscripts-astronomy-mathematics.jpg',
  './assets/valokuvat/tombeau-askia.jpg',
  './assets/valokuvat/tuareg-z-wielb-adem-widac-miecz-takouba-sahara-001165s.jpg',
  './assets/valokuvat/umm-kulthum4.jpg',
  './assets/valokuvat/uusi-addisabeba.jpg',
  './assets/valokuvat/uusi-ahaggar.jpg',
  './assets/valokuvat/uusi-alkufra.jpg',
  './assets/valokuvat/uusi-angola.jpg',
  './assets/valokuvat/uusi-bahrelghazal.jpg',
  './assets/valokuvat/uusi-dakar.jpg',
  './assets/valokuvat/uusi-darfur.jpg',
  './assets/valokuvat/uusi-gao.jpg',
  './assets/valokuvat/uusi-kairo.jpg',
  './assets/valokuvat/uusi-kamerun.jpg',
  './assets/valokuvat/uusi-kano.jpg',
  './assets/valokuvat/uusi-kapkaupunki.jpg',
  './assets/valokuvat/uusi-kappalmas.jpg',
  './assets/valokuvat/uusi-karthago.jpg',
  './assets/valokuvat/uusi-kilimandzaro.jpg',
  './assets/valokuvat/uusi-kimberley.jpg',
  './assets/valokuvat/uusi-kongo.jpg',
  './assets/valokuvat/uusi-kumasi.jpg',
  './assets/valokuvat/uusi-lagos.jpg',
  './assets/valokuvat/uusi-madagaskar.jpg',
  './assets/valokuvat/uusi-marrakech.jpg',
  './assets/valokuvat/uusi-mosambik.jpg',
  './assets/valokuvat/uusi-murzuk.jpg',
  './assets/valokuvat/uusi-nairobi.jpg',
  './assets/valokuvat/uusi-namib.jpg',
  './assets/valokuvat/uusi-orjarannikko.jpg',
  './assets/valokuvat/uusi-rashafun.jpg',
  './assets/valokuvat/uusi-sahara.jpg',
  './assets/valokuvat/uusi-sansibar.jpg',
  './assets/valokuvat/uusi-sierraleone.jpg',
  './assets/valokuvat/uusi-sthelena.jpg',
  './assets/valokuvat/uusi-suakin.jpg',
  './assets/valokuvat/uusi-tanganjika.jpg',
  './assets/valokuvat/uusi-tanger.jpg',
  './assets/valokuvat/uusi-timbuktu.jpg',
  './assets/valokuvat/uusi-tripoli.jpg',
  './assets/valokuvat/uusi-tshadjarvi.jpg',
  './assets/valokuvat/uusi-venetsia.jpg',
  './assets/valokuvat/uusi-viktoria.jpg',
  './assets/valokuvat/uusi-viktorianputoukset.jpg',
  './assets/valokuvat/vanha-addisabeba.jpg',
  './assets/valokuvat/vanha-ahaggar.jpg',
  './assets/valokuvat/vanha-alkufra.jpg',
  './assets/valokuvat/vanha-angola.jpg',
  './assets/valokuvat/vanha-bahrelghazal.jpg',
  './assets/valokuvat/vanha-dakar.jpg',
  './assets/valokuvat/vanha-darfur.jpg',
  './assets/valokuvat/vanha-gao.jpg',
  './assets/valokuvat/vanha-kairo.jpg',
  './assets/valokuvat/vanha-kamerun.jpg',
  './assets/valokuvat/vanha-kano.jpg',
  './assets/valokuvat/vanha-kapkaupunki.jpg',
  './assets/valokuvat/vanha-kappalmas.jpg',
  './assets/valokuvat/vanha-karthago.jpg',
  './assets/valokuvat/vanha-kilimandzaro.jpg',
  './assets/valokuvat/vanha-kimberley.jpg',
  './assets/valokuvat/vanha-kongo.jpg',
  './assets/valokuvat/vanha-kumasi.jpg',
  './assets/valokuvat/vanha-lagos.jpg',
  './assets/valokuvat/vanha-madagaskar.jpg',
  './assets/valokuvat/vanha-marrakech.jpg',
  './assets/valokuvat/vanha-mosambik.jpg',
  './assets/valokuvat/vanha-murzuk.jpg',
  './assets/valokuvat/vanha-nairobi.jpg',
  './assets/valokuvat/vanha-namib.jpg',
  './assets/valokuvat/vanha-orjarannikko.jpg',
  './assets/valokuvat/vanha-rashafun.jpg',
  './assets/valokuvat/vanha-sahara.jpg',
  './assets/valokuvat/vanha-sansibar.jpg',
  './assets/valokuvat/vanha-sierraleone.jpg',
  './assets/valokuvat/vanha-sthelena.jpg',
  './assets/valokuvat/vanha-suakin.jpg',
  './assets/valokuvat/vanha-tanganjika.png',
  './assets/valokuvat/vanha-tanger.jpg',
  './assets/valokuvat/vanha-timbuktu.png',
  './assets/valokuvat/vanha-tripoli.png',
  './assets/valokuvat/vanha-tshadjarvi.jpg',
  './assets/valokuvat/vanha-venetsia.jpg',
  './assets/valokuvat/vanha-viktoria.jpg',
  './assets/valokuvat/vanha-viktorianputoukset.jpg',
  './assets/valokuvat/zanzibar-taarab-kidumbak-ensemble.jpg',
  // Liput (tools/fetch-flags.mjs) — pieniä ja tarvitaan heti saapumiskortilla.
  './assets/liput/algeria.png',
  './assets/liput/angola.png',
  './assets/liput/berber-flag.png',
  './assets/liput/cameroon.png',
  './assets/liput/chad.png',
  './assets/liput/democratic-republic-of-the-congo.png',
  './assets/liput/egypt.png',
  './assets/liput/ethiopia.png',
  './assets/liput/france.png',
  './assets/liput/germany.png',
  './assets/liput/ghana.png',
  './assets/liput/italy.png',
  './assets/liput/kenya.png',
  './assets/liput/liberia.png',
  './assets/liput/libya.png',
  './assets/liput/madagascar.png',
  './assets/liput/mali.png',
  './assets/liput/morocco.png',
  './assets/liput/mozambique.png',
  './assets/liput/namibia.png',
  './assets/liput/nigeria.png',
  './assets/liput/portugal.png',
  './assets/liput/sardinia-italy.png',
  './assets/liput/saudi-arabia.png',
  './assets/liput/senegal.png',
  './assets/liput/sierra-leone.png',
  './assets/liput/somalia.png',
  './assets/liput/south-africa.png',
  './assets/liput/south-sudan.png',
  './assets/liput/spain.png',
  './assets/liput/sudan.png',
  './assets/liput/tanzania.png',
  './assets/liput/tunisia.png',
  './assets/liput/uganda.png',
  './assets/liput/united-kingdom.png',
  './assets/liput/zimbabwe.png',
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

/*
 * Media (valokuvat ja äänet) on kymmeniä megatavuja, ja `addAll` on
 * kaikki-tai-ei-mitään: yksikin katkennut lataus kaatoi koko
 * asennuksen, jolloin peli jäi ilman välimuistia. Siksi koodi ja
 * tekstit haetaan yhtenä eränä (ne ovat pieniä ja niiden on oltava
 * ehjä kokonaisuus) ja media yksitellen niin, että yksi virhe
 * ohitetaan — puuttuva kuva haetaan sitten verkosta.
 */
const MEDIAA = (osoite) => /\/assets\/(valokuvat|liput|audio)\//.test(osoite);
const YDIN = SHELL.filter((o) => !MEDIAA(o));
const MEDIA = SHELL.filter(MEDIAA);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // cache: 'reload' ohittaa selaimen HTTP-välimuistin: ilman sitä
      // iOS saattoi täyttää uuden välimuistiversion vanhoilla
      // tiedostoilla, jolloin versionumero päivittyi mutta osa
      // sisällöstä (esim. matkakirjan tekstit) jäi vanhaksi.
      .then(async (cache) => {
        await cache.addAll(YDIN.map((osoite) => new Request(osoite, { cache: 'reload' })));
        await Promise.all(MEDIA.map((osoite) => cache
          .add(new Request(osoite, { cache: 'reload' }))
          .catch(() => {})));
      })
      .then(() => self.skipWaiting()),
  );
});

// Wikipedian ja Commonsin kuvien ajonaikainen välimuisti: kerran nähty
// kuva latautuu jatkossa heti ja toimii offline. Oma kori, jota version
// vaihto ei tyhjennä — kuvat eivät vanhene version mukana.
const KUVACACHE = 'matkakirja-wikikuvat-v1';

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE && k !== KUVACACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Välimuisti ensin, päivitys taustalla: peli aukeaa heti ja toimii offline,
// mutta uusi versio latautuu taustalla ja on käytössä seuraavalla avauksella.
// Yläpalkin Päivitä-nappi tyhjentää välimuistin, jolloin uusin versio tulee heti.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const osoite = new URL(event.request.url);
  // Ulkoisista kutsuista välimuistitetaan vain wikikuvat (kuva kerran
  // nähtynä latautuu heti ja toimii offline). Muut ulkoiset kutsut
  // (esim. Wikipedian tiivistelmä-JSON) menevät suoraan verkkoon.
  if (osoite.origin !== self.location.origin) {
    const wikikuva = event.request.destination === 'image'
      && (osoite.hostname === 'upload.wikimedia.org'
        || (osoite.hostname === 'commons.wikimedia.org'
          && osoite.pathname.startsWith('/wiki/Special:FilePath/')));
    if (!wikikuva) return;
    event.respondWith(
      caches.open(KUVACACHE).then(async (kuvat) => {
        const osuma = await kuvat.match(event.request.url);
        if (osuma) return osuma;
        // CORS-nouto: upload.wikimedia.org sallii sen, ja vastaus on
        // silloin tavallinen (ei opaakki), joten se ei paisuta kiintiötä.
        const vastaus = await fetch(event.request.url, { mode: 'cors' }).catch(() => null);
        if (vastaus && vastaus.ok) kuvat.put(event.request.url, vastaus.clone());
        return vastaus ?? Response.error();
      }),
    );
    return;
  }
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
