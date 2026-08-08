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
      tehtava: 'Loput Euroopan maalehdet. Valmiina: v357 radio- ja '
        + 'tv-napit molemmissa lehdissä (viimeiset livet pois), v353 '
        + 'menovinkit kaikille viidelle maalle, v350 lehtijako.',
      seuraavaksi: 'Uudet maalehdet valmiiksi kartta-aikataulun '
        + 'tahdissa.',
    },
    {
      tekija: 'Opus 2',
      rooli: 'kartat + introt',
      tila: 'tyossa',
      tehtava: 'Tv-tallennekandidaattien haku. Valmiina: v351 '
        + 'Italia, v354 Espanja/Madrid, v355 Ruotsi/Tukholma '
        + '(korkokartat, kohdekartat, introt).',
      seuraavaksi: 'Tallennekandidaatit omistajan valittavaksi.',
    },
    {
      tekija: 'Sonnet 1',
      rooli: 'QA + työhuone',
      tila: 'tyossa',
      tehtava: 'Iso loppu-QA koko Euroopalle ennen omistajan '
        + 'testiä. Valmiina: v356 työhuoneen kokonaisuudistus (5 '
        + 'välilehteä, Testaa-välilehti pelilinkkeineen), v352 '
        + 'Kehitys-välilehti.',
      seuraavaksi: 'QA-raportti Fablelle; löydöt korjauslistaksi.',
    },
    {
      tekija: 'Sonnet 2',
      rooli: 'nähtävyysjutut',
      tila: 'odottaa',
      tehtava: 'Berliinin kuuden kohteen nähtävyysjutut valmiit '
        + '(v358): omat jutut, 24 kuvaa tarkistettuina, lainauksia. '
        + 'Odottaa omistajan katselmusta ennen jatkoa.',
      seuraavaksi: 'Kairo ja uudet karttakaupungit, jos pilotti '
        + 'kelpaa.',
    },
  ],
  odottaaPaatosta: [
    'Berliinin nähtävyyspilotin katselmus (Sonnet 2 odottaa lupaa '
      + 'jatkaa muihin kaupunkeihin)',
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
    otsikko: 'Berliinin nähtävyysjutut — PILOTTI (v358)',
    ohje: 'Avaa Berliinin kaupunkikartta ja napauta numeroympyröitä: '
      + 'kuusi kohdetta sai omat jutut kuvineen ja lainauksineen '
      + '(mm. Reaganin muurinpuhe). Tämä on Sonnetin pilotti — '
      + 'katso jälki ja päätä, jatketaanko muihin kaupunkeihin.',
  },
  {
    otsikko: 'Radio ja tv molemmissa lehdissä (v357)',
    ohje: 'Avaa mikä tahansa kaupunki- ja maalehti: radio- ja '
      + 'videonapit näkyvät nyt kummassakin, ja viimeiset '
      + 'live-lähetykset on korvattu tallenteilla tai poistettu.',
  },
  {
    otsikko: 'Työhuone uusiksi (v356)',
    ohje: 'Työhuoneessa on nyt viisi välilehteä: Tilanne (tämä '
      + 'taulu + muutosloki), Testaa (tämä lista + pelilinkit '
      + 'suoraan lautoihin), Kehitys, Kaupungit ja Studio.',
  },
  {
    otsikko: 'Espanjan ja Ruotsin kartat (v354–v355)',
    ohje: 'Matkusta Madridiin ja Tukholmaan: korkokartat, '
      + 'kohdekartat ja maaintrot samaan tapaan kuin Italiassa.',
  },
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
];
