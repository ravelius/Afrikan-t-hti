/*
 * Uutislähteet maittain (omistajan toive 5.8.2026): lehden
 * maaosastossa näkyy muutama ajankohtainen uutisotsikko paikallisella
 * kielellä. Otsikoita EI lyhennetä eikä mukailla — ne ovat aitoa
 * paikallista mediaa sellaisenaan.
 *
 * Selain ei voi hakea RSS-syötteitä suoraan (CORS), joten haku kulkee
 * pienen Cloudflare Worker -välityksen kautta. Workerin lähdekoodi ja
 * käyttöönotto-ohje: tools/uutisproxy/. Kun omistaja on ottanut
 * workerin käyttöön, sen osoite kirjoitetaan UUTISPROXY-vakioon —
 * siihen asti uutisosio pysyy piilossa eikä peli yritä hakuja.
 *
 * Rakenne per maa (avain = ISO-3, sama kuin map.cityCountry):
 *   nimi  — lähteen nimi lähderiville
 *   kieli — syötteen kieli (MyMemory-käännöksen lähdekieli)
 *   syote — RSS-syötteen osoite (lisää myös workerin sallittujen
 *           listaan, tools/uutisproxy/worker.js)
 */
// Omistajan worker, otettu käyttöön 5.8.2026 (ks. tools/uutisproxy/).
// HUOM: https://-alku on pakollinen — ilman sitä selain tulkitsisi
// osoitteen suhteelliseksi poluksi pelin omalle sivustolle.
export const UUTISPROXY = 'https://matkakirja-uutiset.samireivinen.workers.dev';

export const UUTISLAHTEET = {
  ITA: {
    nimi: 'ANSA',
    kieli: 'it',
    syote: 'https://www.ansa.it/sito/ansait_rss.xml',
  },
};

/*
 * Maan tv-kanava (omistajan toive 5.8.2026): maaosaston mediarivillä
 * on radion vieressä nappi, josta aukeaa maan uutiskanavan suora
 * lähetys popup-ikkunaan. Upotus on YouTuben kanavaupotus
 * (live_stream?channel=...): se seuraa aina kanavan kulloistakin
 * suoraa lähetystä, joten yksittäisen lähetyksen tunniste ei vanhene.
 * Ei tarvitse workeria eikä avaimia.
 *
 * Italiassa yleisradio Rai ei lähetä YouTubeen. Sky TG24 kokeiltiin
 * ensin, mutta sen striimi ei näkynyt Suomesta (YouTuben aluerajaus
 * on kanavan oma valinta) — euronews italiano lähettää italiaksi
 * maailmanlaajuisesti ilman aluerajauksia (todettu 5.8.2026).
 */
export const TV_KANAVAT = {
  ITA: {
    nimi: 'euronews italiano',
    // Live-sivulta luetaan kulloisenkin lähetyksen tunniste workerin
    // kautta (luotettava myös iPadilla); upotus on varareitti, jos
    // workeria ei ole päivitetty tai haku epäonnistuu.
    livesivu: 'https://www.youtube.com/@euronewsit/live',
    upotus: 'https://www.youtube.com/embed/live_stream'
      + '?channel=UC1mX9vuLOYf8fhaXS_KcDRg&autoplay=1',
  },
};
