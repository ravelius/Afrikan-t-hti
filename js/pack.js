// Karttapakettien rekisteri. Jokainen paketti on yksi pelilauta: kartta,
// kaupungit, reitit, laatat, kysymykset ja teema. Uusi lauta lisätään
// tekemällä js/packs/-hakemistoon vastaava tiedosto ja listaamalla se tässä.

import { MAAILMA } from './packs/maailma.js';
import { AFRICA } from './packs/africa.js';
import { MIDDLE_EAST } from './packs/middleeast.js';
import { EUROPE } from './packs/europe.js';
import { ISTANBUL } from './packs/istanbul.js';
import { SOUTHAMERICA } from './packs/southamerica.js';

export const PACKS = [MAAILMA, AFRICA, EUROPE, SOUTHAMERICA, MIDDLE_EAST, ISTANBUL];

export function packById(id) {
  return PACKS.find((pack) => pack.id === id) ?? PACKS[0];
}

/** Paketin kaikki kysymykset yhtenä listana (testejä ja tarkistuksia varten). */
export function allQuestions(pack) {
  return Object.entries(pack.questions).flatMap(([key, list]) =>
    list.map((question) => ({ ...question, key })),
  );
}

// --- lähteet ---------------------------------------------------------------
//
// Periaate 2: jokainen pelin väittämä on tarkistettavissa. Kysymykseen,
// kaksintaisteluun ja Tiesitkö että -tietoon voi liittää lähteen, joka näkyy
// pelaajalle vastauksen jälkeen. Lähde on merkkijono — verkko-osoite tai
// sanallinen viite, esimerkiksi kirjan nimi ja sivu. Useampi lähde annetaan
// listana.

/** Lähteet aina listana; tyhjä lista jos lähdettä ei ole annettu. */
export function sourceList(source) {
  if (!source) return [];
  return (Array.isArray(source) ? source : [source]).filter((s) => typeof s === 'string' && s.trim());
}

/** Onko lähde verkko-osoite, joka voidaan näyttää linkkinä? */
export function isSourceUrl(source) {
  return /^https?:\/\/\S+$/.test(source.trim());
}

/**
 * Lyhyt näyttönimi lähteelle: verkko-osoitteesta pelkkä palvelimen nimi,
 * muuten teksti sellaisenaan.
 */
export function sourceLabel(source) {
  const text = source.trim();
  if (!isSourceUrl(text)) return text;
  try {
    return new URL(text).hostname.replace(/^www\./, '');
  } catch {
    return text;
  }
}

/**
 * Tiesitkö että -tieto voi olla pelkkä merkkijono tai { text, source }.
 * Näin vanha sisältö kelpaa sellaisenaan ja uuteen voi liittää lähteen.
 */
export function factText(fact) {
  return typeof fact === 'string' ? fact : fact?.text ?? '';
}

export function factSource(fact) {
  return typeof fact === 'string' ? [] : sourceList(fact?.source);
}
