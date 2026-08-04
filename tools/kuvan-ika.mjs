/*
 * Vanhaksi merkityn kuvan iän lukeminen Commonsin tekstikentistä.
 *
 * Eriytetty omaksi moduulikseen, koska kaksi työkalua tarvitsee saman
 * tarkistuksen: tools/kirjoita-kuvakortit.mjs luo kortit tyhjästä ja
 * tools/lisaa-kuvapinoon.mjs täydentää olemassa olevia. Sama sääntö
 * kahtena kopiona ehtisi erkaantua ennen kuin kukaan huomaisi — ja
 * juuri tämä sääntö on jo kerran korjattu jälkikäteen.
 */

/*
 * Vanhaksi merkitty kuva saa olla 1960 tai vanhempi. Raja on väljä
 * tarkoituksella: 1950-luvun kuva on yhä uskottavasti "vanha
 * valokuva", mutta sitä uudempi ei ole.
 */
export const VANHA_RAJA = 1960;

/*
 * Vuosiluku merkkijonosta.
 *
 * Ensimmäinen versio otti suurimman neljän numeron jakson. Se on oikea
 * oletus silloin kun tekstissä on vain päiväyksiä, mutta Commonsin
 * kentissä on muutakin: arkiston tunnusnumero (N-1979-003-0525),
 * digitointivuosi (item:825974 : 2008) ja kirjaston luettelokoodi.
 * Suurin luku osui niihin, ja neljä aitoa 1900-luvun alun valokuvaa
 * hylättiin "liian uusina" — Yellowknifen 1930-luvun kuva luettiin
 * vuodeksi 1979, koska se on arkiston tunnus.
 *
 * Nyt luetaan kolmessa portaassa, luotettavimmasta alkaen:
 *
 *  1. Tunnisteet pois. Neljän numeron jakso pidemmän numero- tai
 *     kirjainjonon sisällä ei ole vuosiluku.
 *  2. Vuosikymmen ("1930s", "1930-luku") ja vihjeellinen vuosi
 *     ("circa 1903", "[Circa 1930]", "published 1903") ovat
 *     nimenomaan kuvan ikä. Näistä otetaan PIENIN.
 *  3. Muuten suurin, kuten ennen. Se on tahallisen ankara: vanhaksi
 *     merkitty kuva, jonka iästä ei ole vihjettä, on hylättävä
 *     ennemmin kuin päästettävä läpi.
 */
const ilmanTunnisteita = (teksti) => String(teksti)
  // N-1979-003-0525, 2001-07-01-0525 ja vastaavat moniosaiset tunnukset
  .replace(/\b[A-Za-z]*\d{2,}(?:[-_/]\d+){2,}\b/g, ' ')
  // LCCN2001701072, kirjainalkuinen pitkä koodi
  .replace(/\b[A-Za-z]{2,}\d{6,}\b/g, ' ')
  // item:825974 — viisi numeroa tai enemmän ei ole vuosiluku
  .replace(/\b\d{5,}\b/g, ' ');

const VUOSI = /\b(1[5-9]\d\d|20\d\d)\b/g;
const VIHJE = /(circa|ca|c|about|around|between|published|created|taken|dated|photographed|photograph|noin|vuonna|from)\.?\s*[[(]?\s*$/i;

export const vuosiluku = (teksti) => {
  const puhdas = ilmanTunnisteita(teksti);
  const varmat = [...puhdas.matchAll(/\b(1[5-9]\d0|20[0-2]0)\s*(?:s\b|-luku|-tal)/gi)]
    .map((m) => Number(m[1]));
  const kaikki = [];
  for (const m of puhdas.matchAll(VUOSI)) {
    kaikki.push(Number(m[1]));
    if (VIHJE.test(puhdas.slice(Math.max(0, m.index - 28), m.index))) varmat.push(Number(m[1]));
  }
  if (varmat.length) return Math.min(...varmat);
  return kaikki.length ? Math.max(...kaikki) : null;
};

/*
 * Kuvan vanhin uskottava vuosi kolmesta lähteestä.
 *
 * Commonsin päiväys on usein skannauspäivä, ja silloin oikea vuosi on
 * kuvauksessa ("around 1900"). Tiedostonimi on kolmas ja usein paras:
 * lataajat nimeävät tiedoston kuvan AIHEEN mukaan ("João Pessoa,
 * Paraíba circa 1903.jpg"). Pelkkä päiväys hylkäisi aidot vanhat
 * kuvat; pelkkä kuvaus päästäisi läpi väärät.
 *
 * Palauttaa null, jos yksikään kenttä ei kerro vuotta. Kutsuja
 * päättää, kelpaako tuntematon ikä.
 */
export function kuvanVuosi({ paivays = '', kuvaus = '', tiedosto = '' }) {
  const ehdokkaat = [
    vuosiluku(paivays),
    vuosiluku(kuvaus),
    vuosiluku(String(tiedosto).replace(/\.[^.]+$/, '')),
  ].filter((v) => v !== null);
  return ehdokkaat.length ? Math.min(...ehdokkaat) : null;
}
