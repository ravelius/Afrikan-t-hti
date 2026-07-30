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
    demokratia: {
      arvo: '0,13',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~MAR',
    },
    keskitulo: '4 000 $/v',
    tervehdykset: [
      { teksti: 'Salam alaikum', kieli: 'arabia', lippu: 'Flag of Saudi Arabia.svg' },
      { teksti: 'Azul', kieli: 'tamazight', lippu: 'Berber flag.svg' },
      { teksti: 'Bonjour', kieli: 'ranska', lippu: 'Flag of France.svg' },
      { teksti: 'Buenos días', kieli: 'espanja', lippu: 'Flag of Spain.svg' },
    ],
  },
  LBY: {
    vakiluku: '7 milj.',
    pintaAla: '1,8 milj. km²',
    demokratia: {
      arvo: '0,10',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~LBY',
    },
    keskitulo: '7 000 $/v',
    tervehdykset: [
      { teksti: 'Salam alaikum', kieli: 'arabia', lippu: 'Flag of Saudi Arabia.svg' },
      { teksti: 'Azul', kieli: 'tamazight', lippu: 'Berber flag.svg' },
      { teksti: 'Buongiorno', kieli: 'italia', lippu: 'Flag of Italy.svg' },
    ],
  },
};
