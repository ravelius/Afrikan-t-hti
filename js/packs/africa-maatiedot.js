// Maiden tunnusluvut Tutki-kortin maapalstalle (pilotti: Marokko ja
// Libya — omistajan päätös, laajennetaan jos malli toimii).
//
//  - Luvut isoin pyöristyksin, samaan vähäeleiseen tapaan kuin
//    karttaselitteessä (vain numerot ja symboli).
//  - Demokratiaindeksi on V-Demin liberaalin demokratian indeksi
//    (0–1); klikkaus avaa maan kuvaajan Our World in Datassa, joka
//    jakaa V-Demin aineiston maittain pysyvin osoittein.
//  - Keskitulona bruttokansantulo asukasta kohden vuodessa (Maailman-
//    pankin Atlas-menetelmä), pyöristettynä reilusti.
//  - Tervehdykset: "hyvää päivää" maan merkittävillä kielillä.
//    Lippu kertoo, mitä kieltä tervehdys edustaa (esim. ranska →
//    Ranskan lippu, arabia → Saudi-Arabian lippu vakiintuneen tavan
//    mukaan, tamazight → amazigh-lippu). Liput haetaan Commonsista.
export const AFRICA_MAATIEDOT = {
  MAR: {
    vakiluku: '38 milj.',
    pintaAla: '450 000 km²',
    // `sija` on sijoitus maailmassa (V-Dem vertailee 179 maata,
    // tulovertailussa noin 190 maata) — arviot pyöristetty reilusti.
    demokratia: {
      arvo: '0,13',
      sija: '130./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~MAR',
    },
    keskitulo: { arvo: '4 000 $/v', sija: '125./190' },
    // `osuus` on karkea arvio kielen puhujista maassa (moni puhuu
    // useampaa, joten summa ylittää sata).
    tervehdykset: [
      { teksti: 'Salam alaikum', kieli: 'arabia', lippu: 'Flag of Saudi Arabia.svg', osuus: '90 %' },
      { teksti: 'Azul', kieli: 'tamazight', lippu: 'Berber flag.svg', osuus: '25 %' },
      { teksti: 'Bonjour', kieli: 'ranska', lippu: 'Flag of France.svg', osuus: '35 %' },
      { teksti: 'Buenos días', kieli: 'espanja', lippu: 'Flag of Spain.svg', osuus: '5 %' },
    ],
  },
  LBY: {
    vakiluku: '7 milj.',
    pintaAla: '1,8 milj. km²',
    demokratia: {
      arvo: '0,10',
      sija: '145./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~LBY',
    },
    keskitulo: { arvo: '7 000 $/v', sija: '95./190' },
    tervehdykset: [
      { teksti: 'Salam alaikum', kieli: 'arabia', lippu: 'Flag of Saudi Arabia.svg', osuus: '95 %' },
      { teksti: 'Azul', kieli: 'tamazight', lippu: 'Berber flag.svg', osuus: '5 %' },
      { teksti: 'Buongiorno', kieli: 'italia', lippu: 'Flag of Italy.svg', osuus: '1 %' },
    ],
  },
};
