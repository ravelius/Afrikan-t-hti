/*
 * Rakennustyön tilannetaulu työhuoneen etusivulle (omistajan toive
 * 8.8.2026: "yhteenveto, joka päivittyy, siitä missä tämänhetkinen
 * rakennustyö on menossa").
 *
 * TÄTÄ TIEDOSTOA PÄIVITTÄÄ FABLE aina, kun sessioilta saapuu
 * raportti tai työjono muuttuu — muut sessiot eivät kirjoita tähän.
 * Työhuone näyttää taulun etusivun kärjessä. Tilat: 'tyossa',
 * 'valmis', 'odottaa' (selväkielinen selite riville).
 */

export const TILANNE = {
  paivitetty: '8.8.2026',
  tavoite: 'Eurooppa valmiiksi → omistajan oma testikierros → vasta '
    + 'sitten muut maanosat.',
  rivit: [
    {
      tekija: 'Fable',
      rooli: 'tarina + koordinaatio',
      tila: 'tyossa',
      tehtava: 'Koordinointi ja raporttien kokoaminen. Euroopan '
        + 'tarinatekstit valmiit: 41 dekkarimerkintää äänineen, '
        + 'aarrevihjeet ilmansuunnittain, Lontoon kohtaamisluennat.',
      seuraavaksi: 'Kohtaamisluennat lopuille hahmoille, kun '
        + 'omistaja on valinnut äänet työhuoneen näytteistä.',
    },
    {
      tekija: 'Opus 1',
      rooli: 'lehdet + rakenne',
      tila: 'tyossa',
      tehtava: 'Menovinkit-sivut viidelle maalle (Egypti, Italia, '
        + 'Espanja, Ruotsi, Saksa) — viisi agenttia rinnakkain, '
        + 'tarkistusskripti päällä. Valmiina: v350 lehtijako '
        + '(kaupunki- ja maalehti erikseen), Maiden tiedot -varuste, '
        + 'Lontoon nähtävyysjutut.',
      seuraavaksi: 'Radio- ja tv-napit molempiin lehtiin, sitten '
        + 'loput Euroopan maalehdet.',
    },
    {
      tekija: 'Opus 2',
      rooli: 'kartat + introt',
      tila: 'tyossa',
      tehtava: 'Italian korkokartta, Venetsian kaupunkikartta ja '
        + 'Italian intro (ensimmäinen maa kolmesta).',
      seuraavaksi: 'Espanja/Madrid, sitten Ruotsi/Tukholma; sen '
        + 'jälkeen tv-tallennekandidaattien haku.',
    },
    {
      tekija: 'Sonnet 1',
      rooli: 'QA + työhuone',
      tila: 'tyossa',
      tehtava: 'Työhuoneen Kehitys-välilehti: iso kaari, '
        + 'ääninäytteet ja Euroopan tekstit kuunneltavina. Valmiina: '
        + 'koko aineiston QA (331 ääntä, 1800 kuvaa, peili — nolla '
        + 'oikeaa virhettä).',
      seuraavaksi: 'Iso loppu-QA koko Euroopalle ennen omistajan '
        + 'testiä.',
    },
    {
      tekija: 'Sonnet 2',
      rooli: 'nähtävyysjutut',
      tila: 'tyossa',
      tehtava: 'Berliinin kuuden kohteen nähtävyysjutut '
        + 'en-Wikipedian pohjalta (pilotti — omistaja katsoo jäljen '
        + 'ennen jatkoa).',
      seuraavaksi: 'Kairo ja uudet kartat Opus 2:n tahdissa, jos '
        + 'pilotti kelpaa.',
    },
  ],
  odottaaPaatosta: [
    'Kertoja- ja hahmoäänten valinta (kuuntele Kehitys-välilehden '
      + 'näytteet)',
    'Sateenvarjomiehen henkilöllisyys (ehdotus Kehitys-välilehden '
      + 'Iso kaari -osiossa)',
  ],
};
