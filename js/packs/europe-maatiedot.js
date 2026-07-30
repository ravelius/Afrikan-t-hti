// Euroopan maiden tunnusluvut (sama rakenne kuin AFRICA_MAATIEDOT).
// Rakentuu maa kerrallaan — pilotti: Italia. Luvut tarkistettu kahdesta
// riippumattomasta lähteestä (Maailmanpankki + OWID/V-Dem, 31.7.2026).
export const EUROPE_MAATIEDOT = {
  ITA: {
    vakiluku: '59 milj.',
    vakilukuSija: '25./195',
    pintaAla: '302 000 km²',
    pintaAlaSija: '71./195',
    demokratia: {
      arvo: '0,64',
      sija: '37./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~ITA',
      selitys: 'Italia on vakiintunut demokratia, mutta sen luku on '
        + 'laskenut viime vuosina selvästi: V-Demin mittareissa '
        + 'erityisesti sananvapauden ja median tila on heikentynyt, '
        + 'kun televisio ja lehdistö keskittyvät harvoihin käsiin.',
    },
    keskitulo: { arvo: '42 100 $/v', sija: '26./190' },
    // `osuus` on karkea arvio kielen puhujista maassa.
    tervehdykset: [
      { teksti: 'Buongiorno', kieli: 'italia', lippu: 'Flag of Italy.svg', osuus: '95 %' },
      { teksti: 'Bona die', kieli: 'sardi', lippu: 'Flag of Sardinia, Italy.svg', osuus: '2 %' },
      { teksti: 'Guten Tag', kieli: 'saksa (Etelä-Tiroli)', lippu: 'Flag of Germany.svg', osuus: '0,5 %' },
    ],
  },
};
