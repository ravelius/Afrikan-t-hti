// Maiden tunnusluvut Tutki-kortin maapalstalle. Pilotit Marokko ja
// Libya; laajennettu kymmenen kaupungin maihin omistajan hyväksyttyä
// mallin (30.7.).
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
  EGY: {
    vakiluku: '115 milj.',
    pintaAla: '1 milj. km²',
    demokratia: {
      arvo: '0,07',
      sija: '160./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~EGY',
    },
    keskitulo: { arvo: '4 000 $/v', sija: '125./190' },
    tervehdykset: [
      { teksti: 'Salam alaikum', kieli: 'arabia', lippu: 'Flag of Saudi Arabia.svg', osuus: '99 %' },
      { teksti: 'Good day', kieli: 'englanti', lippu: 'Flag of the United Kingdom.svg', osuus: '10 %' },
    ],
  },
  SEN: {
    vakiluku: '18 milj.',
    pintaAla: '200 000 km²',
    demokratia: {
      arvo: '0,42',
      sija: '60./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~SEN',
    },
    keskitulo: { arvo: '1 600 $/v', sija: '155./190' },
    tervehdykset: [
      { teksti: 'Na nga def', kieli: 'wolof', lippu: 'Flag of Senegal.svg', osuus: '80 %' },
      { teksti: 'Bonjour', kieli: 'ranska', lippu: 'Flag of France.svg', osuus: '25 %' },
      { teksti: 'Jam waali', kieli: 'pulaar', lippu: 'Flag of Senegal.svg', osuus: '20 %' },
    ],
  },
  MLI: {
    vakiluku: '23 milj.',
    pintaAla: '1,2 milj. km²',
    demokratia: {
      arvo: '0,13',
      sija: '130./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~MLI',
    },
    keskitulo: { arvo: '900 $/v', sija: '175./190' },
    tervehdykset: [
      { teksti: 'I ni ce', kieli: 'bambara', lippu: 'Flag of Mali.svg', osuus: '80 %' },
      { teksti: 'Bonjour', kieli: 'ranska', lippu: 'Flag of France.svg', osuus: '20 %' },
      { teksti: 'Fofo', kieli: 'songhai', lippu: 'Flag of Mali.svg', osuus: '5 %' },
    ],
  },
  NGA: {
    vakiluku: '230 milj.',
    pintaAla: '900 000 km²',
    demokratia: {
      arvo: '0,26',
      sija: '95./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~NGA',
    },
    keskitulo: { arvo: '2 000 $/v', sija: '150./190' },
    tervehdykset: [
      { teksti: 'Good day', kieli: 'englanti', lippu: 'Flag of the United Kingdom.svg', osuus: '60 %' },
      { teksti: 'Sannu', kieli: 'hausa', lippu: 'Flag of Nigeria.svg', osuus: '30 %' },
      { teksti: 'Ẹ káàsán', kieli: 'joruba', lippu: 'Flag of Nigeria.svg', osuus: '20 %' },
      { teksti: 'Ndeewo', kieli: 'igbo', lippu: 'Flag of Nigeria.svg', osuus: '15 %' },
    ],
  },
  GHA: {
    vakiluku: '34 milj.',
    pintaAla: '240 000 km²',
    demokratia: {
      arvo: '0,61',
      sija: '35./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~GHA',
    },
    keskitulo: { arvo: '2 300 $/v', sija: '145./190' },
    tervehdykset: [
      { teksti: 'Maakye', kieli: 'akan (twi)', lippu: 'Flag of Ghana.svg', osuus: '45 %' },
      { teksti: 'Good day', kieli: 'englanti', lippu: 'Flag of the United Kingdom.svg', osuus: '65 %' },
      { teksti: 'Sannu', kieli: 'hausa', lippu: 'Flag of Nigeria.svg', osuus: '5 %' },
    ],
  },
  ZAF: {
    vakiluku: '63 milj.',
    pintaAla: '1,2 milj. km²',
    demokratia: {
      arvo: '0,54',
      sija: '45./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~ZAF',
    },
    keskitulo: { arvo: '6 500 $/v', sija: '100./190' },
    tervehdykset: [
      { teksti: 'Sawubona', kieli: 'zulu', lippu: 'Flag of South Africa.svg', osuus: '25 %' },
      { teksti: 'Molo', kieli: 'xhosa', lippu: 'Flag of South Africa.svg', osuus: '16 %' },
      { teksti: 'Goeie dag', kieli: 'afrikaans', lippu: 'Flag of South Africa.svg', osuus: '13 %' },
      { teksti: 'Good day', kieli: 'englanti', lippu: 'Flag of the United Kingdom.svg', osuus: '10 %' },
    ],
  },
  TZA: {
    vakiluku: '68 milj.',
    pintaAla: '950 000 km²',
    demokratia: {
      arvo: '0,26',
      sija: '95./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~TZA',
    },
    keskitulo: { arvo: '1 200 $/v', sija: '165./190' },
    tervehdykset: [
      { teksti: 'Jambo', kieli: 'swahili', lippu: 'Flag of Tanzania.svg', osuus: '90 %' },
      { teksti: 'Good day', kieli: 'englanti', lippu: 'Flag of the United Kingdom.svg', osuus: '10 %' },
    ],
  },
  ETH: {
    vakiluku: '130 milj.',
    pintaAla: '1,1 milj. km²',
    demokratia: {
      arvo: '0,20',
      sija: '110./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~ETH',
    },
    keskitulo: { arvo: '1 100 $/v', sija: '170./190' },
    tervehdykset: [
      { teksti: 'Tena yistilign', kieli: 'amhara', lippu: 'Flag of Ethiopia.svg', osuus: '30 %' },
      { teksti: 'Akkam', kieli: 'oromo', lippu: 'Flag of Ethiopia.svg', osuus: '35 %' },
      { teksti: 'Selam', kieli: 'tigrinja', lippu: 'Flag of Ethiopia.svg', osuus: '6 %' },
    ],
  },
  COD: {
    vakiluku: '105 milj.',
    pintaAla: '2,3 milj. km²',
    demokratia: {
      arvo: '0,15',
      sija: '125./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~COD',
    },
    keskitulo: { arvo: '700 $/v', sija: '185./190' },
    tervehdykset: [
      { teksti: 'Mbote', kieli: 'lingala', lippu: 'Flag of the Democratic Republic of the Congo.svg', osuus: '40 %' },
      { teksti: 'Bonjour', kieli: 'ranska', lippu: 'Flag of France.svg', osuus: '50 %' },
      { teksti: 'Jambo', kieli: 'swahili', lippu: 'Flag of Tanzania.svg', osuus: '30 %' },
    ],
  },
};
