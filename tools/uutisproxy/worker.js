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
];

// Kymmenen minuutin välimuisti Cloudflaren reunalla: uutissivusto ei
// kuormitu, vaikka moni pelaaja avaisi lehden yhtä aikaa.
const VALIMUISTI_S = 600;

export default {
  async fetch(pyynto) {
    const url = new URL(pyynto.url).searchParams.get('url');
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
