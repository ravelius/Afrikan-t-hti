// "Lue lisää": Wikipedian tiivistelmä nykyisestä sijainnista.
//
// Rajapinta on Wikipedian REST-summary, jota selain voi kutsua suoraan ilman
// avainta. Suomenkielinen artikkeli on ensisijainen; jos sitä ei ole, se on
// täsmennyssivu tai tiivistelmä jää lyhyeksi, kokeillaan englantia.
//
// Lisenssi: Wikipedian teksti on CC BY-SA, joten maininta ja linkki
// artikkeliin ovat pakollisia myös kaupallisessa käytössä. Ne kuuluvat
// dialogin alareunaan aina, myös silloin kun kuvaa ei ole.

export const WIKI_LANGS = ['fi', 'en'];
// Tätä lyhyempi tiivistelmä on käytännössä tynkä: kokeillaan toista kieltä.
export const MIN_EXTRACT = 200;

/** REST-summaryn osoite. Otsikko koodataan, koska siinä voi olla välilyöntejä. */
export function summaryUrl(lang, title) {
  return `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
}

/**
 * Poimii pelin tarvitsemat kentät REST-vastauksesta. Palauttaa null, jos
 * vastaus ei kelpaa: puuttuva sivu, täsmennyssivu tai tyhjä tiivistelmä.
 * Erotettu omaksi funktiokseen, jotta virhepolut voi testata ilman verkkoa.
 */
export function parseSummary(data, lang) {
  if (!data || typeof data !== 'object') return null;
  if (data.type === 'disambiguation') return null;
  const extract = typeof data.extract === 'string' ? data.extract.trim() : '';
  if (!extract) return null;
  return {
    lang,
    title: data.title ?? '',
    extract,
    image: data.thumbnail?.source ?? null,
    // Sivun ihmisluettava osoite lähdemainintaa varten.
    url: data.content_urls?.desktop?.page
      ?? `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(data.title ?? '')}`,
  };
}

/**
 * Hakee tiivistelmän: suomi ensin, sitten englanti. Lyhyt suomenkielinen
 * tiivistelmä hyväksytään vasta, jos englanniksikaan ei löydy parempaa —
 * lyhyt on silti parempi kuin ei mitään.
 *
 * Ei koskaan heitä: peli ei saa jäädä jumiin siihen, ettei verkkoa ole.
 * Palauttaa null, kun mitään käyttökelpoista ei löytynyt.
 */
export async function fetchSummary(title, { fetchImpl = globalThis.fetch, langs = WIKI_LANGS } = {}) {
  if (!title || typeof fetchImpl !== 'function') return null;
  let vara = null;
  for (const lang of langs) {
    let osuma = null;
    try {
      const res = await fetchImpl(summaryUrl(lang, title));
      if (res && res.ok) osuma = parseSummary(await res.json(), lang);
    } catch {
      /* ei yhteyttä tai kelvoton vastaus — kokeillaan seuraavaa kieltä */
    }
    if (!osuma) continue;
    if (osuma.extract.length >= MIN_EXTRACT) return osuma;
    // Tynkä talteen siltä varalta, ettei parempaa löydy.
    vara = vara ?? osuma;
  }
  return vara;
}

/**
 * Koko artikkelin osoite: MediaWiki extracts pelkkänä tekstinä. Pelkkä
 * teksti on tarkoituksella — HTML:ää ei upoteta peliin, ja kapea teksti ei
 * voi aiheuttaa sivuttaisvieritystä. Väliotsikot tulevat muodossa
 * "== Otsikko ==", ja käyttöliittymä muotoilee ne itse.
 */
export function articleUrl(lang, title) {
  const params = new URLSearchParams({
    action: 'query',
    prop: 'extracts',
    explaintext: '1',
    redirects: '1',
    format: 'json',
    origin: '*',
    titles: title,
  });
  return `https://${lang}.wikipedia.org/w/api.php?${params}`;
}

/** Poimii artikkelitekstin extracts-vastauksesta. Null, jos sivua ei ole. */
export function parseArticle(data) {
  const pages = data?.query?.pages;
  if (!pages || typeof pages !== 'object') return null;
  const page = Object.values(pages)[0];
  const text = typeof page?.extract === 'string' ? page.extract.trim() : '';
  return text || null;
}

/**
 * Hakee koko artikkelin siltä kieleltä, jolta tiivistelmä löytyi.
 * Ei koskaan heitä — null tarkoittaa, että tiivistelmä saa jäädä.
 */
export async function fetchArticle(title, lang, { fetchImpl = globalThis.fetch } = {}) {
  if (!title || !lang || typeof fetchImpl !== 'function') return null;
  try {
    const res = await fetchImpl(articleUrl(lang, title));
    if (res && res.ok) return parseArticle(await res.json());
  } catch {
    /* ei yhteyttä — tiivistelmä riittää */
  }
  return null;
}

/** Artikkelin kuvalistan osoite (REST media-list). */
export function mediaListUrl(lang, title) {
  return `https://${lang}.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title)}`;
}

/**
 * Kelvottomat kuvat: kaupunkiartikkelin pääkuva on usein monen kuvan
 * montaasi, joka pienessä kortissa näyttää köntältä. Myös liput, vaakunat,
 * kartat, logot ja svg-symbolit ohitetaan — yksi valokuva kertoo paikasta
 * enemmän kuin kuusi pientä.
 */
export const BAD_IMAGE = /montage|collage|kollaasi|mosaic|banner|coat|vaakuna|flag|lippu|locator|\bmap\b|kartta|logo|seal|icon|\.svg$/i;

/** Poimii kuvalistasta ensimmäisen kelvollisen valokuvan osoitteen. */
export function pickImage(items) {
  for (const item of items ?? []) {
    if (item?.type !== 'image') continue;
    if (BAD_IMAGE.test(item.title ?? '')) continue;
    const srcset = item.srcset;
    const src = srcset?.[srcset.length - 1]?.src ?? srcset?.[0]?.src;
    if (src) return src.startsWith('//') ? `https:${src}` : src;
  }
  return null;
}

/**
 * Paras kuva paikalle: tiivistelmän kuva sellaisenaan, jos se ei ole
 * montaasi; muuten artikkelin kuvalistasta ensimmäinen oikea valokuva.
 * Montaasi jää varakuvaksi, jos kuvalistaa ei saada haettua.
 */
export async function fetchImage(summary, { fetchImpl = globalThis.fetch } = {}) {
  if (!summary) return null;
  if (summary.image && !BAD_IMAGE.test(summary.image)) return summary.image;
  try {
    const res = await fetchImpl(mediaListUrl(summary.lang, summary.title));
    if (res && res.ok) {
      const img = pickImage((await res.json()).items);
      if (img) return img;
    }
  } catch {
    /* ei yhteyttä — montaasi on parempi kuin ei kuvaa */
  }
  return summary.image ?? null;
}
