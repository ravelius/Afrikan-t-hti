/*
 * Uutisvälitys — pieni Cloudflare Worker, joka hakee RSS-syötteen ja
 * palauttaa sen CORS-otsakkeilla, jotta pelin selainkoodi saa lukea
 * sen. Ilman tätä selain estää haut (uutissivustot eivät salli
 * suoraa hakua toisilta sivustoilta).
 *
 * Käyttöönotto: ks. OHJE.md tässä kansiossa.
 *
 * Turva: worker hakee VAIN sallittujen listalla olevia osoitteita —
 * muuten kuka tahansa voisi käyttää sitä yleisenä välityspalvelimena.
 * Kun js/packs/uutislahteet.js saa uuden syötteen, lisää sen osoite
 * myös tähän listaan ja julkaise worker uudelleen.
 */
/*
 * Sallitut ETULIITTEINÄ (5.8.2026): syötteen lisäksi haetaan myös
 * uutisten artikkelisivut, jotta popupissa näkyy koko leipäteksti —
 * artikkelien osoitteet vaihtuvat, joten tarkka lista ei riitä.
 * Etuliite rajaa haut silti vain uutissivustoon.
 */
const SALLITUT = [
  'https://www.ansa.it/',
  // Britannian uutislähde (Lontoon lehti, 6.8.2026): syöte ja
  // artikkelisivut ovat eri isäntänimillä.
  'https://feeds.bbci.co.uk/',
  'https://www.bbc.co.uk/',
  'https://www.bbc.com/',
  // Egyptin uutislähde (Kairon lehti, 5.8.2026).
  'https://www.youm7.com/',
  // Espanjan uutislähde (Madridin lehti, 6.8.2026): syöte ja
  // artikkelisivut ovat samalla isäntänimellä.
  'https://www.20minutos.es/',
  // Ruotsin uutislähde (Tukholman lehti, 7.8.2026): syöte ja
  // artikkelisivut ovat samalla isäntänimellä.
  'https://www.svt.se/',
  // Saksan uutislähde (Berliinin lehti, 7.8.2026): tagesschaun syöte
  // ja artikkelisivut ovat samalla isäntänimellä.
  'https://www.tagesschau.de/',
  // Tv-kanavan live-sivu: siitä luetaan kulloisenkin suoran
  // lähetyksen tunniste, koska YouTuben kanavaupotus on epävakaa
  // etenkin iPadilla (5.8.2026).
  'https://www.youtube.com/@',
];

/*
 * OHJAUKSEN SELVITYS (8.8.2026) — eri asia kuin yllä oleva välitys.
 *
 * Espanjan tv-tallenne haetaan osoitteesta
 * `ztnr.rtve.es/ztnr/<id>.mp4`, joka ohjaa oikean mediapalvelimen
 * tiedostoon. Ohjaus osoittaa `http://`-osoitteeseen, vaikka pyyntö
 * tehdään https:llä — ja peli tarjoillaan https:llä, joten selaimelle
 * se on sekasisältöä. Chrome ja Firefox nostaisivat pyynnön itse
 * https:ään, mutta iOS:n Safari on epävarmin, eikä sitä voi todentaa
 * kehitysympäristöstä.
 *
 * Tämä reitti poistaa koko kysymyksen: worker kysyy ohjauksen
 * palvelimen puolella ja palauttaa lopullisen osoitteen https:nä.
 * Selain saa valmiiksi turvallisen osoitteen eikä sekasisältöä synny.
 *
 * VIDEOTA EI VÄLITETÄ TÄMÄN KAUTTA, vain osoite. Tavut kulkevat
 * suoraan RTVE:n palvelimelta selaimeen, joten worker ei joudu
 * pullonkaulaksi.
 *
 * Ohjausta seurataan VAIN yksi askel. Ketjun toinen askel lisää
 * osoitteeseen aikarajallisen download-tokenin, ja jos se haettaisiin
 * tässä, token ehtisi vanhentua ennen kuin pelaaja painaa play.
 * Selain hakee sen itse tuoreena.
 */
const OHJAUS_SALLITUT = [
  // Espanjan uutistallenteet (Madridin lehti, 8.8.2026).
  'https://ztnr.rtve.es/ztnr/',
];

// Kymmenen minuutin välimuisti Cloudflaren reunalla: uutissivusto ei
// kuormitu, vaikka moni pelaaja avaisi lehden yhtä aikaa.
const VALIMUISTI_S = 600;

export default {
  async fetch(pyynto) {
    const kysely = new URL(pyynto.url).searchParams;

    // Ohjauksen selvitys omalla parametrillaan: palauttaa osoitteen
    // JSONina, ei sisältöä.
    const ohjaus = kysely.get('ohjaus');
    if (ohjaus) {
      if (!OHJAUS_SALLITUT.some((alku) => ohjaus.startsWith(alku))) {
        return new Response('Osoite ei ole sallittujen listalla', { status: 403 });
      }
      const alkuvastaus = await fetch(ohjaus, {
        method: 'HEAD',
        redirect: 'manual',
        headers: { 'user-agent': 'matkakirja-uutisvalitys/1.0' },
      });
      const kohde = alkuvastaus.headers.get('location');
      if (!kohde) return new Response('Ohjausta ei saatu', { status: 502 });
      return new Response(JSON.stringify({ url: kohde.replace(/^http:\/\//, 'https://') }), {
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'access-control-allow-origin': '*',
          // Lyhyt välimuisti: tallenne vaihtuu päivittäin, ja osoite
          // saa vanhentua nopeasti — toisin kuin syötteet, tämä on
          // yhden napinpainalluksen tieto.
          'cache-control': 'public, max-age=60',
        },
      });
    }

    const url = kysely.get('url');
    if (!SALLITUT.some((alku) => url?.startsWith(alku))) {
      return new Response('Osoite ei ole sallittujen listalla', { status: 403 });
    }
    const vastaus = await fetch(url, {
      headers: { 'user-agent': 'matkakirja-uutisvalitys/1.0' },
      cf: { cacheTtl: VALIMUISTI_S, cacheEverything: true },
    });
    return new Response(vastaus.body, {
      status: vastaus.status,
      headers: {
        'content-type': vastaus.headers.get('content-type') ?? 'application/xml; charset=utf-8',
        'access-control-allow-origin': '*',
        'cache-control': `public, max-age=${VALIMUISTI_S}`,
      },
    });
  },
};
