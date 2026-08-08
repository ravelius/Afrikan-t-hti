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
      tehtava: 'Radio- ja tv-napit molempiin lehteihin. Valmiina: '
        + 'v353 menovinkit kaikille viidelle maalle, v350 lehtijako '
        + '(kaupunki- ja maalehti erikseen), Maiden tiedot -varuste, '
        + 'Lontoon nähtävyysjutut.',
      seuraavaksi: 'Loput Euroopan maalehdet.',
    },
    {
      tekija: 'Opus 2',
      rooli: 'kartat + introt',
      tila: 'tyossa',
      tehtava: 'Espanjan korkokartta ja Madridin kaupunkikartta. '
        + 'Valmiina: v351 Italia (korkokartta, Venetsian '
        + 'kohdekartta, intro).',
      seuraavaksi: 'Ruotsi/Tukholma; sen jälkeen '
        + 'tv-tallennekandidaattien haku.',
    },
    {
      tekija: 'Sonnet 1',
      rooli: 'QA + työhuone',
      tila: 'tyossa',
      tehtava: 'Työhuoneen kokonaisuudistus: 5 välilehteä (Tilanne, '
        + 'Testaa, Kehitys, Kaupungit, Studio). Valmiina: v352 '
        + 'Kehitys-välilehti kuuntelupaketteineen ja koko aineiston '
        + 'QA (nolla oikeaa virhettä).',
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

/**
 * Testattavaa juuri nyt: uusimmat ominaisuudet ja mistä ne löytää.
 * Fable päivittää tätä julkaisujen tahdissa — Testaa-välilehti
 * näyttää listan pelilinkkien vieressä. Uusin ensin.
 */
export const TESTATTAVAA = [
  {
    otsikko: 'Menovinkit kaikilla lehtimailla (v353)',
    ohje: 'Avaa minkä tahansa lehtimaan kaupunkilehti: viimeinen '
      + 'aihesivu on nyt Menovinkit myös Berliinissä, Pariisissa, '
      + 'Roomassa ja Kairossa — ei vain Lontoossa.',
  },
  {
    otsikko: 'Kehitys-välilehti työhuoneessa (v352)',
    ohje: 'Työhuone → Kehitys: kuuntele kertoja- ja hahmoääninäytteet '
      + '(valinta odottaa sinua), lue ison kaaren essee ja '
      + 'mannerkokeilut. Sateenvarjomies-ehdotus on Iso kaari '
      + '-osiossa.',
  },
  {
    otsikko: 'Italian kartat ja intro (v351)',
    ohje: 'Matkusta Italiaan: korkokartta, Venetsian kohdekartta ja '
      + 'uusi maaintro. Vertaa jälkeä Egyptin karttoihin.',
  },
  {
    otsikko: 'Lehtijako ja kohtaaminen lopussa (v350)',
    ohje: 'Avaa Lontoo: kaupunkilehti on nyt 5 sivua ja maalehti '
      + 'erikseen (Iso-Britannia-osio). "Tapaa jokietsijä" näkyy '
      + 'vasta viimeisellä sivulla. Katso myös nähtävyysjutut: '
      + 'kaupunkikartan numeroympyrät avaavat artikkelin.',
  },
  {
    otsikko: 'Maiden tiedot -varuste (v350)',
    ohje: 'Ansaitse varuste kokemuspisteillä — sen jälkeen minkä '
      + 'tahansa maan lehti aukeaa kartalta maan nimen i-napista, '
      + 'matkustamatta.',
  },
  {
    otsikko: 'Menovinkit (v350)',
    ohje: 'Lontoon kaupunkilehden viimeinen aihesivu: seitsemän '
      + 'kohdetta linkkeineen.',
  },
  {
    otsikko: 'Aarrevihjeet matkalla (v346)',
    ohje: 'Pysähdy nopalla kaupunkien väliin: isoisän taitettu sivu '
      + 'nousee tietoruutuun kuiskattuna — ilmansuunta, ei kaupunki. '
      + 'Kaupungissa vihje ei enää koskaan peitä merkintää.',
  },
  {
    otsikko: 'Koko Eurooppa dekkarina (v345)',
    ohje: 'Saavu mihin tahansa Euroopan kaupunkiin: lyhyt '
      + 'dekkarimerkintä ja luenta (23–30 s). Kuuntele ainakin '
      + 'Edinburgh (askeleet sumussa), Pariisi (messinkiavain) ja '
      + 'Pietari (sillat).',
  },
  {
    otsikko: 'Kairon lehti (v348)',
    ohje: 'Kairo: Egypti-osio, katukartta, Musiikki-sivu (Umm '
      + 'Kulthum) ja Rakennukset-sivu (miten pyramidi tehtiin).',
  },
  {
    otsikko: 'Valokuvaus-sivu (v341)',
    ohje: 'Berliinin maalehti: Ottomar Anschützin haikarat ja Päivän '
      + 'kuva maailmalta -palsta, joka vaihtuu keskiyöllä.',
  },
];
