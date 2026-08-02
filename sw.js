// Palvelutyöntekijä: pelin tiedostot välimuistiin, jotta sovellus toimii myös offline.
const CACHE = 'matkakirja-2026-08-02.175';
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
  './js/media.js',
  './js/packs/vanhamaailma.js',
  './js/packs/maailma.js',
  './js/packs/maailma-questions.js',
  './js/packs/africa.js',
  './js/packs/africa-questions.js',
  './js/packs/africa-puzzles.js',
  './js/packs/africa-borders.js',
  './js/packs/africa-countries.js',
  './js/packs/omat-tiivistelmat.js',
  './js/packs/liput-paikalliset.js',
  './js/packs/lippu-tekijat.js',
  './js/packs/valokuvat-paikalliset.js',
  './js/packs/africa-valokuvat.js',
  './js/packs/africa-saapumiset.js',
  './js/packs/africa-kulttuuri.js',
  './js/packs/africa-artikkelit.js',
  './js/packs/africa-maatiedot.js',
  './js/packs/europe.js',
  './js/packs/europe-questions.js',
  './js/packs/europe-puzzles.js',
  './js/packs/europe-countries.js',
  './js/packs/europe-saapumiset.js',
  './js/packs/europe-kulttuuri.js',
  './js/packs/europe-valokuvat.js',
  './js/packs/europe-kielet.js',
  './js/packs/europe-maatiedot.js',
  './js/packs/europe-artikkelit.js',
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
  './assets/audio/efekti-zoom.mp3',
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
  './assets/audio/puhe-europe-saapuminen-ateena.mp3',
  './assets/audio/puhe-europe-saapuminen-dubrovnik.mp3',
  './assets/audio/puhe-europe-saapuminen-kreeta.mp3',
  './assets/audio/puhe-europe-saapuminen-lontoo.mp3',
  './assets/audio/puhe-europe-saapuminen-pariisi.mp3',
  './assets/audio/puhe-europe-saapuminen-rooma.mp3',
  './assets/audio/puhe-europe-saapuminen-sisilia.mp3',
  './assets/audio/puhe-europe-saapuminen-sofia.mp3',
  './assets/audio/puhe-europe-saapuminen-venetsia.mp3',
  './assets/audio/puhe-europe-vihje-pariisi.mp3',
  './assets/audio/puhe-europe-vihje-rooma.mp3',
  './assets/audio/puhe-europe-vihje-venetsia.mp3',
  // Liput (tools/fetch-flags.mjs) — pieniä ja tarvitaan heti saapumiskortilla.
  './assets/liput/algeria.png',
  './assets/liput/austria.png',
  './assets/liput/czech-republic.png',
  './assets/liput/denmark.png',
  './assets/liput/estonia.png',
  './assets/liput/finland.png',
  './assets/liput/hungary.png',
  './assets/liput/ireland.png',
  './assets/liput/latvia.png',
  './assets/liput/lithuania.png',
  './assets/liput/norway.png',
  './assets/liput/romania.png',
  './assets/liput/russia.png',
  './assets/liput/sweden.png',
  './assets/liput/switzerland.png',
  './assets/liput/ukraine.png',
  './assets/liput/netherlands.png',
  './assets/liput/angola.png',
  './assets/liput/basque-country.png',
  './assets/liput/berber-flag.png',
  './assets/liput/bosnia-and-herzegovina.png',
  './assets/liput/bulgaria.png',
  './assets/liput/cameroon.png',
  './assets/liput/catalonia.png',
  './assets/liput/chad.png',
  './assets/liput/croatia.png',
  './assets/liput/democratic-republic-of-the-congo.png',
  './assets/liput/egypt.png',
  './assets/liput/ethiopia.png',
  './assets/liput/france.png',
  './assets/liput/galicia.png',
  './assets/liput/germany.png',
  './assets/liput/ghana.png',
  './assets/liput/greece.png',
  './assets/liput/iceland.png',
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
  './assets/liput/occitania.png',
  './assets/liput/poland.png',
  './assets/liput/portugal.png',
  './assets/liput/sardinia-italy.png',
  './assets/liput/saudi-arabia.png',
  './assets/liput/senegal.png',
  './assets/liput/serbia.png',
  './assets/liput/sierra-leone.png',
  './assets/liput/somalia.png',
  './assets/liput/south-africa.png',
  './assets/liput/south-sudan.png',
  './assets/liput/spain.png',
  './assets/liput/sudan.png',
  './assets/liput/tanzania.png',
  './assets/liput/turkey.png',
  './assets/liput/flag-of-the-romani-people.png',
  './assets/liput/tunisia.png',
  './assets/liput/uganda.png',
  './assets/liput/united-kingdom.png',
  './assets/liput/upper-silesia.png',
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
 * Media (liput ja äänet) on kymmeniä megatavuja, ja `addAll` on
 * kaikki-tai-ei-mitään: yksikin katkennut lataus kaatoi koko
 * asennuksen, jolloin peli jäi ilman välimuistia. Siksi koodi ja
 * tekstit haetaan yhtenä eränä (ne ovat pieniä ja niiden on oltava
 * ehjä kokonaisuus) ja media yksitellen niin, että yksi virhe
 * ohitetaan.
 *
 * Valokuvia EI enää haeta asennuksessa (omistajan päätös). Niitä on
 * satoja ja kymmeniä megatavuja, ja määrä kasvaa jokaisen uuden
 * kaupungin myötä — asennus olisi kasvanut kohtuuttomaksi. Sen sijaan
 * kuva tallentuu välimuistiin sinä hetkenä kun pelaaja sen ensi kerran
 * näkee (ks. KUVACACHE alempana), joten kerran nähty kaupunki toimii
 * offline. Peli itse, äänet ja kartat haetaan yhä etukäteen.
 */
const MEDIAA = (osoite) => /\/assets\/(liput|audio)\//.test(osoite);
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

// Kuvien ajonaikainen välimuisti: kerran nähty kuva latautuu jatkossa
// heti ja toimii offline. Oma kori, jota version vaihto ei tyhjennä —
// kuvat eivät vanhene version mukana, eikä pelaaja joudu lataamaan
// samoja kuvia uudelleen joka päivityksellä.
//
// Korissa on kahdenlaisia kuvia: Wikipedian ja Commonsin verkkokuvat
// sekä repon omat valokuvat (assets/valokuvat), joita ei enää haeta
// asennuksessa.
const KUVACACHE = 'matkakirja-wikikuvat-v1';

/** Repon oma valokuva, joka haetaan vasta kun se ensi kerran näytetään. */
const OMA_VALOKUVA = (osoite) => osoite.pathname.includes('/assets/valokuvat/');

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
    // Peili (Cloudflare R2 -ämpäri) on ensisijainen kuvalähde, Commons
    // ja upload.wikimedia.org varareittejä. Kaikki kolme kuuluvat samaan
    // koriin, jotta kerran nähty kuva toimii offline riippumatta siitä,
    // kummasta se sillä kertaa tuli.
    //
    // Ämpärin osoite tunnistetaan päätteestä eikä koko nimestä: sama
    // sääntö kestää sen, että ämpärin eteen laitetaan joskus oma
    // verkkotunnus. Ehto on silti tiukka, koska destination === 'image'
    // rajaa jo valmiiksi vain kuviin.
    //
    // Peilin äänet jäävät tarkoituksella pois: ne ovat satoja
    // megatavuja, ja selaimen oma välimuisti riittää niille.
    const kuvalahde = event.request.destination === 'image'
      && (osoite.hostname === 'upload.wikimedia.org'
        || (osoite.hostname === 'commons.wikimedia.org'
          && osoite.pathname.startsWith('/wiki/Special:FilePath/'))
        || (osoite.hostname.endsWith('.r2.dev')
          && /^\/(kuvat|liput)\//.test(osoite.pathname)));
    if (!kuvalahde) return;
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
  // Repon omat valokuvat: sama kori kuin wikikuvilla, jotta ne eivät
  // katoa versiopäivityksessä. Välimuisti ensin, verkko vasta jos kuvaa
  // ei ole vielä nähty.
  if (OMA_VALOKUVA(osoite)) {
    event.respondWith(
      caches.open(KUVACACHE).then(async (kuvat) => {
        const osuma = await kuvat.match(event.request.url);
        if (osuma) return osuma;
        const vastaus = await fetch(event.request).catch(() => null);
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
