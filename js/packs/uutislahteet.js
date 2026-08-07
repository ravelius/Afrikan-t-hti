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
  // BBC:n syöte ja artikkelisivut aukeavat workerin läpi ongelmitta
  // (testattu 6.8.2026: <article> jäsentyy, og:image löytyy).
  GBR: {
    nimi: 'BBC News',
    kieli: 'en',
    syote: 'https://feeds.bbci.co.uk/news/rss.xml',
  },
  // Youm7 (اليوم السابع) on Egyptin luetuimpia uutissivustoja.
  // Al-Ahramin syötteet ovat botti-eston takana (testattu 5.8.2026),
  // Youm7:n RSS ja artikkelisivut aukeavat workerin läpi ongelmitta.
  EGY: {
    nimi: 'Youm7',
    kieli: 'ar',
    syote: 'https://www.youm7.com/rss/SectionRss?SectionID=65',
  },
  ITA: {
    nimi: 'ANSA',
    kieli: 'it',
    syote: 'https://www.ansa.it/sito/ansait_rss.xml',
  },
  /*
   * 20minutos on Espanjan luetuimpia uutissivustoja ja ilmainen.
   *
   * El País kokeiltiin ensin (omistajan ehdotus): SYÖTE aukeaa, mutta
   * ARTIKKELISIVUT palauttavat 403 botti-estosta (testattu 6.8.2026),
   * jolloin popupiin jäisi vain syötteen parin lauseen kuvaus. RTVE:n
   * syötteen linkit osoittavat vanhentuneisiin osoitteisiin, jotka
   * sekin palauttaa 403:na. 20minutoksen syöte (190 juttua) ja
   * artikkelisivut aukeavat molemmat: <article> jäsentyy, leipäteksti
   * poimiutuu ja og:image löytyy.
   */
  ESP: {
    nimi: '20minutos',
    kieli: 'es',
    syote: 'https://www.20minutos.es/rss/',
  },
  /*
   * SVT on Ruotsin yleisradio ja maan luetuimpia uutissivustoja.
   * Testattu 7.8.2026 (UA matkakirja-uutisvalitys/1.0): syöte antaa
   * sata juttua ja artikkelisivulta jäsentyy <article> sekä
   * og:image, eli popup saa koko leipätekstin.
   *
   * Sveriges Radion Ekot kokeiltiin ensin (omistajan ehdotus), mutta
   * api.sr.se palauttaa ATOM-syötteen (<entry>), ja peli lukee RSS:n
   * <item>-alkioita — syötteestä ei siis irtoaisi yhtään otsikkoa
   * ilman koodimuutosta. Aftonbladetin RSS ja artikkelisivut
   * läpäisivät molemmat testit; yleisradio valittiin samalla
   * perusteella kuin Britanniassa BBC.
   *
   * HUOM: osoite www.svt.se/nyheter/rss.xml ohjaa osoitteeseen
   * www.svt.se/rss.xml. Tässä on ohjauksen päätepiste, koska worker
   * ei seuraa uudelleenohjauksia.
   */
  SWE: {
    nimi: 'SVT Nyheter',
    kieli: 'sv',
    syote: 'https://www.svt.se/rss.xml',
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
  // Sky News lähettää YouTubeen ympäri vuorokauden ilman
  // aluerajausta (live-tunniste ja kanavatunnus varmistettu
  // live-sivulta 6.8.2026).
  GBR: {
    nimi: 'Sky News',
    livesivu: 'https://www.youtube.com/@SkyNews/live',
    upotus: 'https://www.youtube.com/embed/live_stream'
      + '?channel=UCoMdktPbSTixAyNGwb-UYkQ&autoplay=1',
  },
  // Al Qahera News on Egyptin uutiskanava, joka lähettää YouTubeen
  // ympäri vuorokauden ilman aluerajausta (kanavatunnus varmistettu
  // live-sivun canonical-linkistä 5.8.2026).
  EGY: {
    nimi: 'Al Qahera News',
    livesivu: 'https://www.youtube.com/@AlQaheraNews/live',
    upotus: 'https://www.youtube.com/embed/live_stream'
      + '?channel=UCi97xPhaYMe9HAzLCh8CC9g&autoplay=1',
  },
  ITA: {
    nimi: 'euronews italiano',
    // Live-sivulta luetaan kulloisenkin lähetyksen tunniste workerin
    // kautta (luotettava myös iPadilla); upotus on varareitti, jos
    // workeria ei ole päivitetty tai haku epäonnistuu.
    livesivu: 'https://www.youtube.com/@euronewsit/live',
    upotus: 'https://www.youtube.com/embed/live_stream'
      + '?channel=UC1mX9vuLOYf8fhaXS_KcDRg&autoplay=1',
  },
  // RTVE Noticias on Espanjan yleisradion uutiskanava, joka lähettää
  // YouTubeen ympäri vuorokauden. Kanavatunnus varmistettu YouTuben
  // omasta kanavasyötteestä (feeds/videos.xml palauttaa nimen
  // "RTVE Noticias" tälle tunnukselle, 6.8.2026).
  ESP: {
    nimi: 'RTVE Noticias',
    livesivu: 'https://www.youtube.com/@RTVENoticias/live',
    upotus: 'https://www.youtube.com/embed/live_stream'
      + '?channel=UC7QZIf0dta-XPXsp9Hv4dTw&autoplay=1',
  },
};
