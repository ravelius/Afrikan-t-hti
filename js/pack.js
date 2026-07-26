// Karttapakettien rekisteri. Jokainen paketti on yksi pelilauta: kartta,
// kaupungit, reitit, laatat, kysymykset ja teema. Uusi lauta lisätään
// tekemällä js/packs/-hakemistoon vastaava tiedosto ja listaamalla se tässä.

import { MAAILMA } from './packs/maailma.js';
import { AFRICA } from './packs/africa.js';
import { MIDDLE_EAST } from './packs/middleeast.js';
import { ISTANBUL } from './packs/istanbul.js';

export const PACKS = [MAAILMA, AFRICA, MIDDLE_EAST, ISTANBUL];

export function packById(id) {
  return PACKS.find((pack) => pack.id === id) ?? PACKS[0];
}

/** Paketin kaikki kysymykset yhtenä listana (testejä ja tarkistuksia varten). */
export function allQuestions(pack) {
  return Object.entries(pack.questions).flatMap(([key, list]) =>
    list.map((question) => ({ ...question, key })),
  );
}
