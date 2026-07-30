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
      selitys: 'Marokossa järjestetään vaalit, mutta kuningas pitää lopullisen vallan: hallitus toimii hänen alaisuudessaan, ja arkaluontoisista aiheista kirjoittamista rajoitetaan.',
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
      selitys: 'Libyan pitkä sisällissota jakoi maan kilpaileviin hallintoihin, ja luvattuja vaaleja on lykätty vuodesta toiseen.',
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
      selitys: 'Egyptiä johtaa armeijan tukema hallinto: oppositio, media ja järjestöt ovat tiukassa valvonnassa, ja vaalien tulos on käytännössä ennalta selvä.',
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
      selitys: 'Senegalissa valta on vaihtunut vaaleilla ilman vallankaappauksia — Länsi-Afrikan pisimpiä perinteitä. Viime vuosien poliittiset jännitteet ovat hieman laskeneet lukua.',
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
      selitys: 'Malissa armeija kaappasi vallan kahdesti 2020–2021, ja paluuta vaaleihin on siirretty — siksi luku on pudonnut matalalle.',
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
      selitys: 'Nigerian vaalit ovat aidosti kilpailtuja ja media äänekäs, mutta rahan valta, vaalihäiriöt ja levottomuudet painavat lukua.',
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
      selitys: 'Ghana on Länsi-Afrikan vakaimpia demokratioita: valta on vaihtunut vaaleilla puolueelta toiselle monta kertaa, ja lehdistö on vapaa.',
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
      selitys: 'Etelä-Afrikalla on apartheidin jälkeen vahva perustuslaki, vapaat vaalit ja riippumattomat tuomioistuimet; korruptioskandaalit nakertavat lukua.',
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
      selitys: 'Tansaniassa sama puolue on hallinnut itsenäistymisestä asti, ja oppositio on ollut ahtaalla — otteet ovat viime vuosina hieman höllentyneet.',
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
      selitys: 'Etiopiassa vaaleja järjestetään, mutta sisällissota, poikkeustilat ja opposition ja median rajoitukset pitävät luvun matalana.',
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
      selitys: 'Kongon demokraattisessa tasavallassa vaalien tulokset ovat kiistanalaisia, idän levottomuudet jatkuvat ja instituutiot ovat hauraita.',
    },
    keskitulo: { arvo: '700 $/v', sija: '185./190' },
    tervehdykset: [
      { teksti: 'Mbote', kieli: 'lingala', lippu: 'Flag of the Democratic Republic of the Congo.svg', osuus: '40 %' },
      { teksti: 'Bonjour', kieli: 'ranska', lippu: 'Flag of France.svg', osuus: '50 %' },
      { teksti: 'Jambo', kieli: 'swahili', lippu: 'Flag of Tanzania.svg', osuus: '30 %' },
    ],
  },

  // --- Loput maat (omistajan pyyntö: koko lauta valmiiksi) -------------
  TUN: {
    vakiluku: '12 milj.',
    pintaAla: '160 000 km²',
    demokratia: {
      arvo: '0,30',
      sija: '85./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~TUN',
      selitys: 'Tunisia nousi arabikevään jälkeen alueen demokraattisimmaksi maaksi, mutta vuodesta 2021 presidentti on keskittänyt valtaa itselleen — luku on laskenut nopeasti.',
    },
    keskitulo: { arvo: '4 000 $/v', sija: '125./190' },
    tervehdykset: [
      { teksti: 'Salam alaikum', kieli: 'arabia', lippu: 'Flag of Saudi Arabia.svg', osuus: '98 %' },
      { teksti: 'Bonjour', kieli: 'ranska', lippu: 'Flag of France.svg', osuus: '50 %' },
    ],
  },
  DZA: {
    vakiluku: '46 milj.',
    pintaAla: '2,4 milj. km²',
    demokratia: {
      arvo: '0,13',
      sija: '130./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~DZA',
      selitys: 'Algeriassa armeijalla ja vallan sisäpiirillä on vahva ote: suuri protestiliike vaihtoi kasvot, mutta järjestelmä säilyi pitkälti ennallaan.',
    },
    keskitulo: { arvo: '4 500 $/v', sija: '120./190' },
    tervehdykset: [
      { teksti: 'Salam alaikum', kieli: 'arabia', lippu: 'Flag of Saudi Arabia.svg', osuus: '85 %' },
      { teksti: 'Azul', kieli: 'tamazight', lippu: 'Berber flag.svg', osuus: '25 %' },
      { teksti: 'Bonjour', kieli: 'ranska', lippu: 'Flag of France.svg', osuus: '30 %' },
    ],
  },
  TCD: {
    vakiluku: '18 milj.',
    pintaAla: '1,3 milj. km²',
    demokratia: {
      arvo: '0,10',
      sija: '145./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~TCD',
      selitys: 'Tšadissa valta siirtyi presidentiltä hänen pojalleen armeijan tuella — vaaleja järjestetään, mutta lopputulos ei ole aidosti auki.',
    },
    keskitulo: { arvo: '700 $/v', sija: '185./190' },
    tervehdykset: [
      { teksti: 'Salam alaikum', kieli: 'arabia', lippu: 'Flag of Saudi Arabia.svg', osuus: '50 %' },
      { teksti: 'Bonjour', kieli: 'ranska', lippu: 'Flag of France.svg', osuus: '25 %' },
      { teksti: 'Lapia', kieli: 'sara', lippu: 'Flag of Chad.svg', osuus: '25 %' },
    ],
  },
  KEN: {
    vakiluku: '55 milj.',
    pintaAla: '580 000 km²',
    demokratia: {
      arvo: '0,32',
      sija: '80./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~KEN',
      selitys: 'Kenian vaalit ovat kilpailtuja ja media äänekäs, mutta vaalikiistat, korruptio ja poliisin kovat otteet painavat lukua.',
    },
    keskitulo: { arvo: '2 100 $/v', sija: '150./190' },
    tervehdykset: [
      { teksti: 'Jambo', kieli: 'swahili', lippu: 'Flag of Kenya.svg', osuus: '85 %' },
      { teksti: 'Good day', kieli: 'englanti', lippu: 'Flag of the United Kingdom.svg', osuus: '20 %' },
      { teksti: 'Supa', kieli: 'maa (maasai)', lippu: 'Flag of Kenya.svg', osuus: '3 %' },
    ],
  },
  ZWE: {
    vakiluku: '16 milj.',
    pintaAla: '390 000 km²',
    demokratia: {
      arvo: '0,15',
      sija: '125./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~ZWE',
      selitys: 'Zimbabwessa sama puolue on hallinnut itsenäistymisestä 1980 asti, ja vaaleihin on liittynyt painostusta ja epäselvyyksiä.',
    },
    keskitulo: { arvo: '1 700 $/v', sija: '155./190' },
    tervehdykset: [
      { teksti: 'Mhoro', kieli: 'shona', lippu: 'Flag of Zimbabwe.svg', osuus: '75 %' },
      { teksti: 'Sawubona', kieli: 'ndebele', lippu: 'Flag of Zimbabwe.svg', osuus: '15 %' },
      { teksti: 'Good day', kieli: 'englanti', lippu: 'Flag of the United Kingdom.svg', osuus: '10 %' },
    ],
  },
  SDN: {
    vakiluku: '48 milj.',
    pintaAla: '1,9 milj. km²',
    demokratia: {
      arvo: '0,07',
      sija: '165./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~SDN',
      selitys: 'Sudanin demokratiasiirtymä katkesi sotilaskaappaukseen 2021, ja 2023 alkanut sisällissota on pysäyttänyt kaiken — siksi luku on pohjalukemissa.',
    },
    keskitulo: { arvo: '800 $/v', sija: '180./190' },
    tervehdykset: [
      { teksti: 'Salam alaikum', kieli: 'arabia', lippu: 'Flag of Saudi Arabia.svg', osuus: '75 %' },
      { teksti: 'Maskagni', kieli: 'fur', lippu: 'Flag of Sudan.svg', osuus: '5 %' },
    ],
  },
  SDS: {
    vakiluku: '12 milj.',
    pintaAla: '620 000 km²',
    demokratia: {
      arvo: '0,06',
      sija: '170./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~SSD',
      selitys: 'Etelä-Sudanissa ei ole itsenäistymisen jälkeen vielä pidetty vaaleja: sisällissota ja hauras rauha ovat siirtäneet niitä toistuvasti.',
    },
    keskitulo: { arvo: '500 $/v', sija: '189./190' },
    tervehdykset: [
      { teksti: 'Kudual', kieli: 'dinka', lippu: 'Flag of South Sudan.svg', osuus: '35 %' },
      { teksti: 'Malɛ', kieli: 'nuer', lippu: 'Flag of South Sudan.svg', osuus: '15 %' },
      { teksti: 'Good day', kieli: 'englanti', lippu: 'Flag of the United Kingdom.svg', osuus: '5 %' },
    ],
  },
  SOM: {
    vakiluku: '18 milj.',
    pintaAla: '640 000 km²',
    demokratia: {
      arvo: '0,08',
      sija: '155./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~SOM',
      selitys: 'Somalian valtio on yhä hauras: vaalit ovat epäsuoria (valitsijamiehet valitsevat parlamentin), eikä hallinto ulotu koko maahan.',
    },
    keskitulo: { arvo: '600 $/v', sija: '188./190' },
    tervehdykset: [
      { teksti: 'Iska warran', kieli: 'somali', lippu: 'Flag of Somalia.svg', osuus: '95 %' },
      { teksti: 'Salam alaikum', kieli: 'arabia', lippu: 'Flag of Saudi Arabia.svg', osuus: '10 %' },
    ],
  },
  CMR: {
    vakiluku: '29 milj.',
    pintaAla: '480 000 km²',
    demokratia: {
      arvo: '0,12',
      sija: '135./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~CMR',
      selitys: 'Kamerunia on johtanut sama presidentti vuodesta 1982. Vaaleja järjestetään, mutta tulos ei juuri yllätä, ja englanninkielisten alueiden kriisi jatkuu.',
    },
    keskitulo: { arvo: '1 700 $/v', sija: '155./190' },
    tervehdykset: [
      { teksti: 'Bonjour', kieli: 'ranska', lippu: 'Flag of France.svg', osuus: '60 %' },
      { teksti: 'Good day', kieli: 'englanti', lippu: 'Flag of the United Kingdom.svg', osuus: '20 %' },
      { teksti: 'Mbolo', kieli: 'ewondo', lippu: 'Flag of Cameroon.svg', osuus: '10 %' },
    ],
  },
  LBR: {
    vakiluku: '5,5 milj.',
    pintaAla: '110 000 km²',
    demokratia: {
      arvo: '0,38',
      sija: '70./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~LBR',
      selitys: 'Liberiassa valta on sotien jälkeen vaihtunut vaaleilla rauhanomaisesti — nuori mutta toimiva demokratia, jota köyhyys koettelee.',
    },
    keskitulo: { arvo: '700 $/v', sija: '185./190' },
    tervehdykset: [
      { teksti: 'How de body?', kieli: 'liberianenglanti', lippu: 'Flag of Liberia.svg', osuus: '80 %' },
      { teksti: 'Ya tuan', kieli: 'kpelle', lippu: 'Flag of Liberia.svg', osuus: '20 %' },
    ],
  },
  SLE: {
    vakiluku: '8,5 milj.',
    pintaAla: '72 000 km²',
    demokratia: {
      arvo: '0,35',
      sija: '75./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~SLE',
      selitys: 'Sierra Leonessa valta on sisällissodan jälkeen vaihtunut vaaleilla puolueelta toiselle rauhanomaisesti.',
    },
    keskitulo: { arvo: '600 $/v', sija: '188./190' },
    tervehdykset: [
      { teksti: 'Aw di bodi?', kieli: 'krio', lippu: 'Flag of Sierra Leone.svg', osuus: '90 %' },
      { teksti: 'Bisseh', kieli: 'mende', lippu: 'Flag of Sierra Leone.svg', osuus: '30 %' },
      { teksti: 'Tana mu', kieli: 'temne', lippu: 'Flag of Sierra Leone.svg', osuus: '30 %' },
    ],
  },
  MOZ: {
    vakiluku: '34 milj.',
    pintaAla: '800 000 km²',
    demokratia: {
      arvo: '0,25',
      sija: '100./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~MOZ',
      selitys: 'Mosambikissa sama puolue on hallinnut itsenäistymisestä 1975 asti, ja vaalituloksiin on liittynyt toistuvia epäselvyyksiä.',
    },
    keskitulo: { arvo: '600 $/v', sija: '188./190' },
    tervehdykset: [
      { teksti: 'Bom dia', kieli: 'portugali', lippu: 'Flag of Portugal.svg', osuus: '50 %' },
      { teksti: 'Salama', kieli: 'emakhuwa', lippu: 'Flag of Mozambique.svg', osuus: '25 %' },
      { teksti: 'Jambo', kieli: 'swahili', lippu: 'Flag of Tanzania.svg', osuus: '5 %' },
    ],
  },
  AGO: {
    vakiluku: '37 milj.',
    pintaAla: '1,2 milj. km²',
    demokratia: {
      arvo: '0,17',
      sija: '120./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~AGO',
      selitys: 'Angolassa sama puolue on hallinnut itsenäistymisestä 1975 asti, ja öljyvarallisuus on keskittynyt vallan lähipiirille.',
    },
    keskitulo: { arvo: '2 000 $/v', sija: '150./190' },
    tervehdykset: [
      { teksti: 'Bom dia', kieli: 'portugali', lippu: 'Flag of Portugal.svg', osuus: '70 %' },
      { teksti: 'Mbote', kieli: 'kikongo', lippu: 'Flag of Angola.svg', osuus: '15 %' },
      { teksti: 'Wa lala po?', kieli: 'umbundu', lippu: 'Flag of Angola.svg', osuus: '20 %' },
    ],
  },
  NAM: {
    vakiluku: '3 milj.',
    pintaAla: '820 000 km²',
    demokratia: {
      arvo: '0,55',
      sija: '42./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~NAM',
      selitys: 'Namibia on ollut itsenäistymisestään 1990 asti vakaa monipuoluedemokratia, jossa on vapaa lehdistö ja riippumattomat tuomioistuimet.',
    },
    keskitulo: { arvo: '5 000 $/v', sija: '110./190' },
    tervehdykset: [
      { teksti: 'Wa lalapo', kieli: 'oshiwambo', lippu: 'Flag of Namibia.svg', osuus: '50 %' },
      { teksti: 'Good day', kieli: 'englanti', lippu: 'Flag of the United Kingdom.svg', osuus: '10 %' },
      { teksti: 'Goeie dag', kieli: 'afrikaans', lippu: 'Flag of Namibia.svg', osuus: '10 %' },
    ],
  },
  MDG: {
    vakiluku: '31 milj.',
    pintaAla: '590 000 km²',
    demokratia: {
      arvo: '0,25',
      sija: '100./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~MDG',
      selitys: 'Madagaskarin vaalit ovat kilpailtuja, mutta toistuvat poliittiset kriisit ja hauraat instituutiot pitävät luvun keskitason alapuolella.',
    },
    keskitulo: { arvo: '500 $/v', sija: '189./190' },
    tervehdykset: [
      { teksti: 'Salama', kieli: 'malagassi', lippu: 'Flag of Madagascar.svg', osuus: '95 %' },
      { teksti: 'Bonjour', kieli: 'ranska', lippu: 'Flag of France.svg', osuus: '20 %' },
    ],
  },
  UGA: {
    vakiluku: '48 milj.',
    pintaAla: '240 000 km²',
    demokratia: {
      arvo: '0,20',
      sija: '110./179',
      linkki: 'https://ourworldindata.org/grapher/liberal-democracy-index?country=~UGA',
      selitys: 'Ugandaa on johtanut sama presidentti vuodesta 1986: vaaleja järjestetään, mutta oppositiota painostetaan ja perustuslakia on muutettu vallan jatkamiseksi.',
    },
    keskitulo: { arvo: '1 000 $/v', sija: '175./190' },
    tervehdykset: [
      { teksti: 'Oli otya?', kieli: 'luganda', lippu: 'Flag of Uganda.svg', osuus: '35 %' },
      { teksti: 'Good day', kieli: 'englanti', lippu: 'Flag of the United Kingdom.svg', osuus: '30 %' },
      { teksti: 'Jambo', kieli: 'swahili', lippu: 'Flag of Tanzania.svg', osuus: '35 %' },
    ],
  },
};
