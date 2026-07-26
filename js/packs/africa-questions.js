// Afrikka-laudan tietovisakysymykset. Jokaisella laattakaupungilla on omat kysymyksensä, jotka
// liittyvät paikan maantietoon, kulttuuriin tai historiaan. `general` toimii
// varapakkana, jos kaupungin omat kysymykset on jo käytetty.
//
// Muoto: { q: kysymys, options: [4 vaihtoehtoa], correct: oikean indeksi, fact: selitys }
// Vaihtoehdot sekoitetaan vasta kysyttäessä, joten oikea vastaus voi olla tässä missä vain.

export const AFRICA_QUESTIONS = {
  tripoli: [
    {
      q: 'Minkä maan pääkaupunki Tripoli on?',
      options: ['Libya', 'Tunisia', 'Algeria', 'Marokko'],
      correct: 0,
      fact: 'Tripoli on Libyan pääkaupunki ja suurin kaupunki.',
      hint: 'Maan öljyvarat ovat Afrikan suurimmat.',
    },
    {
      q: 'Minkä meren rannalla Tripoli sijaitsee?',
      options: ['Punainenmeri', 'Välimeri', 'Mustameri', 'Arabianmeri'],
      correct: 1,
      fact: 'Tripoli on Välimeren etelärannikon satamakaupunki.',
      hint: 'Sama meri huuhtoo Italian ja Kreikan rantoja.',
    },
    {
      q: 'Mikä on Libyan virallinen kieli?',
      options: ['ranska', 'italia', 'arabia', 'swahili'],
      correct: 2,
      fact: 'Libyan virallinen kieli on arabia, vaikka italian siirtomaakausi näkyy yhä kaupungeissa.',
      hint: 'Samaa kieltä puhutaan myös Kairossa.',
    },
  ],

  murzuk: [
    {
      q: 'Murzuk sijaitsee keskellä maailman suurinta kuumaa aavikkoa. Mikä se on?',
      options: ['Kalahari', 'Namib', 'Gobi', 'Sahara'],
      correct: 3,
      fact: 'Sahara on pinta-alaltaan noin 9 miljoonaa neliökilometriä.',
      hint: 'Se ulottuu Atlantilta Punaisellemerelle.',
    },
    {
      q: 'Murzukin ympäristö tunnetaan Fezzanina. Missä maassa se on?',
      options: ['Libya', 'Niger', 'Tšad', 'Egypti'],
      correct: 0,
      fact: 'Fezzan on Libyan lounainen aavikkoalue.',
      hint: 'Sama maa kuin Tripoli.',
    },
    {
      q: 'Mikä eläin oli Saharan karavaanien tärkein kulkuväline?',
      options: ['hevonen', 'dromedaari', 'aasi', 'norsu'],
      correct: 1,
      fact: 'Yksikyttyräinen dromedaari tunnetaan aavikon laivana.',
      hint: 'Sillä on vain yksi kyttyrä.',
    },
  ],

  alkufra: [
    {
      q: 'Al Kufra on keidas keskellä aavikkoa. Mistä keitaan vesi tulee?',
      options: ['vuoristojoesta', 'sadevedestä', 'pohjavedestä', 'merestä'],
      correct: 2,
      fact: 'Keitaat syntyvät siellä, missä pohjavesi nousee lähelle maanpintaa.',
      hint: 'Vesi on hiekan alla, ei sen päällä.',
    },
    {
      q: 'Al Kufra sijaitsee Libyan kaakkoisosassa. Mikä maa on Libyasta etelässä?',
      options: ['Tšad', 'Mali', 'Kenia', 'Somalia'],
      correct: 0,
      fact: 'Libyan eteläiset naapurit ovat Tšad ja Niger.',
      hint: 'Maan suuri järvi on kutistunut murto-osaan entisestä.',
    },
    {
      q: 'Mitä kasvia on perinteisesti viljelty aavikkokeitailla?',
      options: ['riisiä', 'taatelipalmua', 'teetä', 'kaakaota'],
      correct: 1,
      fact: 'Taatelipalmu kestää kuivuutta ja antaa varjoa muille viljelykasveille.',
      hint: 'Sen hedelmiä syödään usein kuivattuina.',
    },
  ],

  sahara: [
    {
      q: 'Mikä on Saharan eteläpuolella kulkeva puolikuiva vyöhyke?',
      options: ['Sahel', 'Savanni', 'Steppi', 'Tundra'],
      correct: 0,
      fact: 'Sahel on aavikon ja savannin välinen vyöhyke Atlantilta Punaisellemerelle.',
      hint: 'Nimi tarkoittaa arabiaksi rantaa tai reunaa.',
    },
    {
      q: 'Mikä seuraavista EI rajoitu Saharaan?',
      options: ['Algeria', 'Niger', 'Sudan', 'Sambia'],
      correct: 3,
      fact: 'Sambia sijaitsee eteläisessä Afrikassa kaukana Saharasta.',
      hint: 'Etsi maa, joka on selvästi päiväntasaajan eteläpuolella.',
    },
    {
      q: 'Miksi aavikolla on usein kylmää yöllä?',
      options: [
        'aurinko sammuu aikaisin',
        'kuiva ilma ei pidätä lämpöä',
        'hiekka jäähdyttää ilmaa',
        'aavikko on korkealla',
      ],
      correct: 1,
      fact: 'Kuivassa ilmassa on vähän vesihöyryä, joten lämpö karkaa nopeasti avaruuteen.',
      hint: 'Kyse on ilman kosteudesta.',
    },
  ],

  ahaggar: [
    {
      q: 'Ahaggarin eli Hoggarin vuoristo sijaitsee missä maassa?',
      options: ['Marokko', 'Algeria', 'Egypti', 'Sudan'],
      correct: 1,
      fact: 'Ahaggar on eteläisen Algerian vulkaaninen ylänkö.',
      hint: 'Sama maa on pinta-alaltaan Afrikan suurin.',
    },
    {
      q: 'Mikä paimentolaiskansa asuu perinteisesti Ahaggarin alueella?',
      options: ['tuaregit', 'zulut', 'masait', 'berberien sijaan somalit'],
      correct: 0,
      fact: 'Tuaregit ovat berberitaustainen Saharan paimentolaiskansa.',
      hint: 'Heitä kutsutaan sinisiksi miehiksi.',
    },
    {
      q: 'Tuaregien miehet käyttävät perinteisesti kasvohuntua. Mikä väri on tunnusomainen?',
      options: ['valkoinen', 'punainen', 'indigonsininen', 'vihreä'],
      correct: 2,
      fact: 'Indigolla värjätty huntu antoi tuaregeille lisänimen "siniset miehet".',
      hint: 'Sama väri kuin farkkukankaassa.',
    },
  ],

  timbuktu: [
    {
      q: 'Missä maassa Timbuktu sijaitsee?',
      options: ['Mali', 'Niger', 'Senegal', 'Nigeria'],
      correct: 0,
      fact: 'Timbuktu on Malin pohjoisosassa Niger-joen mutkassa.',
      hint: 'Maan halki virtaa Niger-joki.',
    },
    {
      q: 'Minkä joen läheisyydessä Timbuktu sijaitsee?',
      options: ['Niili', 'Kongo', 'Niger', 'Sambesi'],
      correct: 2,
      fact: 'Niger-joki teki Timbuktusta karavaani- ja jokikaupan solmukohdan.',
      hint: 'Joki antaa nimensä kahdelle valtiolle.',
    },
    {
      q: 'Mistä Timbuktu tuli keskiajalla kuuluisaksi?',
      options: [
        'timanttikaivoksista',
        'käsikirjoituksista ja oppineisuudesta',
        'satamastaan',
        'linnoituksestaan',
      ],
      correct: 1,
      fact: 'Timbuktun kirjastoissa säilytettiin kymmeniätuhansia käsikirjoituksia.',
      hint: 'Kaupungissa säilytettiin tuhansia vanhoja kirjoja.',
    },
  ],

  gao: [
    {
      q: 'Gao oli aikoinaan mahtavan Songhai-valtakunnan pääkaupunki. Missä maassa se on nykyään?',
      options: ['Mali', 'Ghana', 'Tšad', 'Kamerun'],
      correct: 0,
      fact: 'Songhai-valtakunta hallitsi Länsi-Afrikkaa 1400–1500-luvuilla.',
      hint: 'Sama maa kuin Timbuktu.',
    },
    {
      q: 'Minkä joen varrella Gao sijaitsee?',
      options: ['Senegal', 'Volta', 'Niger', 'Benue'],
      correct: 2,
      fact: 'Niger on Länsi-Afrikan pisin joki, noin 4 200 kilometriä.',
      hint: 'Sama joki kuin Timbuktussa.',
    },
    {
      q: 'Mitä Saharan halki kuljetettiin pohjoiseen keskiajan kauppareiteillä?',
      options: ['kultaa', 'kivihiiltä', 'kahvia', 'puuvillaa'],
      correct: 0,
      fact: 'Kultaa vietiin pohjoiseen ja suolaa tuotiin etelään.',
      hint: 'Se punnittiin tarkasti ja kiilsi keltaisena.',
    },
  ],

  kano: [
    {
      q: 'Kano on suurkaupunki missä maassa?',
      options: ['Niger', 'Nigeria', 'Kamerun', 'Benin'],
      correct: 1,
      fact: 'Kano on Pohjois-Nigerian tärkein kauppakaupunki.',
      hint: 'Maassa asuu yli 200 miljoonaa ihmistä.',
    },
    {
      q: 'Mikä on Afrikan väkirikkain maa?',
      options: ['Etiopia', 'Egypti', 'Nigeria', 'Kongon demokraattinen tasavalta'],
      correct: 2,
      fact: 'Nigeriassa asuu yli 200 miljoonaa ihmistä.',
      hint: 'Maan suurin kaupunki on Lagos.',
    },
    {
      q: 'Kano tunnetaan vuosisatoja vanhoista värjäämökuopistaan. Mitä niissä värjätään?',
      options: ['kankaita', 'nahkaa', 'savea', 'puuta'],
      correct: 0,
      fact: 'Kofar Matan värjäämöt ovat toimineet 1400-luvulta asti indigolla.',
      hint: 'Indigo tarttuu parhaiten kudottuun materiaaliin.',
    },
  ],

  dakar: [
    {
      q: 'Minkä maan pääkaupunki Dakar on?',
      options: ['Gambia', 'Guinea', 'Senegal', 'Mauritania'],
      correct: 2,
      fact: 'Dakar sijaitsee Cap-Vertin niemellä, Afrikan mantereen läntisimmässä kärjessä.',
      hint: 'Maa ympäröi Gambiaa lähes kokonaan.',
    },
    {
      q: 'Mikä saari Dakarin edustalla muistuttaa orjakaupan historiasta?',
      options: ['Gorée', 'Sansibar', 'Mauritius', 'Sokotra'],
      correct: 0,
      fact: 'Gorée on Unescon maailmanperintökohde.',
      hint: 'Saaren nimi alkaa G-kirjaimella.',
    },
    {
      q: 'Mikä kuuluisa moottoriurheilukilpailu päättyi vuosikymmeniä Dakariin?',
      options: ['Le Mans', 'Dakar-ralli', 'Monte Carlon ralli', 'Safari-ralli'],
      correct: 1,
      fact: 'Pariisi–Dakar ajettiin Euroopasta Saharan halki vuoteen 2007 asti.',
      hint: 'Kilpailu on nimetty juuri tämän kaupungin mukaan.',
    },
  ],

  sierraleone: [
    {
      q: 'Mikä on Sierra Leonen pääkaupunki?',
      options: ['Monrovia', 'Conakry', 'Freetown', 'Banjul'],
      correct: 2,
      fact: 'Freetown perustettiin vapautettujen orjien asuinpaikaksi 1700-luvun lopulla.',
      hint: 'Nimi tarkoittaa vapauden kaupunkia.',
    },
    {
      q: 'Mitä nimi Sierra Leone tarkoittaa portugaliksi?',
      options: ['Leijonavuoret', 'Kultaranta', 'Pitkä joki', 'Vihreä niemi'],
      correct: 0,
      fact: 'Portugalilainen merenkulkija nimesi rannikon vuoret 1400-luvulla.',
      hint: 'Nimessä yhdistyvät eläin ja maastonmuoto.',
    },
    {
      q: 'Mistä luonnonvarasta Sierra Leone tunnetaan?',
      options: ['öljystä', 'timanteista', 'kivihiilestä', 'uraanista'],
      correct: 1,
      fact: 'Timanttikauppa rahoitti maan sisällissotaa 1990-luvulla.',
      hint: 'Niistä käytettiin nimitystä veritimantit.',
    },
  ],

  kappalmas: [
    {
      q: 'Kap Palmas on niemi minkä maan rannikolla?',
      options: ['Liberia', 'Ghana', 'Senegal', 'Kamerun'],
      correct: 0,
      fact: 'Kap Palmas on Liberian kaakkoisin kärki.',
      hint: 'Maa perustettiin vapautettujen orjien siirtokunnaksi.',
    },
    {
      q: 'Mikä on Liberian pääkaupunki?',
      options: ['Abidjan', 'Accra', 'Monrovia', 'Freetown'],
      correct: 2,
      fact: 'Monrovia nimettiin Yhdysvaltain presidentin James Monroen mukaan.',
      hint: 'Nimi juontuu erään Yhdysvaltain presidentin sukunimestä.',
    },
    {
      q: 'Liberia perustettiin 1800-luvulla vapautettujen orjien siirtokunnaksi. Mistä maasta he tulivat?',
      options: ['Britannia', 'Yhdysvallat', 'Brasilia', 'Ranska'],
      correct: 1,
      fact: 'Liberia julistautui itsenäiseksi vuonna 1847.',
      hint: 'Presidentti Monroe antoi nimen pääkaupungille.',
    },
  ],

  kumasi: [
    {
      q: 'Kumasi on minkä kansan historiallinen pääkaupunki?',
      options: ['ashantien', 'zulujen', 'masaiden', 'joruboiden'],
      correct: 0,
      fact: 'Ashanti-kuningaskunta hallitsi aluetta 1600-luvulta lähtien.',
      hint: 'Kansan kultainen istuin on kuuluisa.',
    },
    {
      q: 'Missä maassa Kumasi sijaitsee?',
      options: ['Norsunluurannikko', 'Ghana', 'Togo', 'Benin'],
      correct: 1,
      fact: 'Kumasi on Ghanan toiseksi suurin kaupunki.',
      hint: 'Maa itsenäistyi ensimmäisenä Saharan eteläpuolella vuonna 1957.',
    },
    {
      q: 'Millä nimellä Ghana tunnettiin siirtomaa-aikana?',
      options: ['Kultarannikko', 'Norsunluurannikko', 'Orjarannikko', 'Pippurirannikko'],
      correct: 0,
      fact: 'Ghana itsenäistyi ensimmäisenä Saharan eteläpuolisena siirtomaana 1957.',
      hint: 'Nimi kertoo, mitä rannikolta vietiin.',
    },
  ],

  orjarannikko: [
    {
      q: 'Orjarannikko oli historiallinen nimitys osalle Guineanlahden rannikkoa. Minkä mukaan se nimettiin?',
      options: ['kultakaupan', 'orjakaupan', 'mausteiden', 'norsunluun'],
      correct: 1,
      fact: 'Rannikolta kuljetettiin satojen vuosien ajan ihmisiä Atlantin yli.',
      hint: 'Nimi kertoo suoraan, mitä rannikolta vietiin.',
    },
    {
      q: 'Mitkä nykyiset maat sijaitsevat entisellä Orjarannikolla?',
      options: [
        'Togo, Benin ja Nigeria',
        'Kenia ja Tansania',
        'Angola ja Namibia',
        'Marokko ja Algeria',
      ],
      correct: 0,
      fact: 'Alue ulottui nykyisen Ghanan itärajalta Nigerin suistoon.',
      hint: 'Alue ulottuu Ghanan itärajalta Nigerin suistoon.',
    },
    {
      q: 'Mikä lahti reunustaa Länsi-Afrikan etelärannikkoa?',
      options: ['Adeninlahti', 'Guineanlahti', 'Biskajanlahti', 'Persianlahti'],
      correct: 1,
      fact: 'Guineanlahti on Atlantin valtameren osa.',
      hint: 'Lahti on nimetty alueen mukaan, joka alkaa G-kirjaimella.',
    },
  ],

  kamerun: [
    {
      q: 'Kamerunin korkein huippu on tulivuori. Mikä sen nimi on?',
      options: ['Kilimandžaro', 'Kamerunvuori', 'Kenia-vuori', 'Toubkal'],
      correct: 1,
      fact: 'Kamerunvuori kohoaa noin 4 100 metriin ja purkautuu yhä ajoittain.',
      hint: 'Vuori on nimetty maan mukaan.',
    },
    {
      q: 'Mitkä ovat Kamerunin kaksi virallista kieltä?',
      options: [
        'ranska ja englanti',
        'portugali ja espanja',
        'arabia ja ranska',
        'englanti ja swahili',
      ],
      correct: 0,
      fact: 'Maa jaettiin ensimmäisen maailmansodan jälkeen Ranskan ja Britannian kesken.',
      hint: 'Maa jaettiin ensimmäisen maailmansodan jälkeen kahden siirtomaavallan kesken.',
    },
    {
      q: 'Mikä on Kamerunin pääkaupunki?',
      options: ['Douala', 'Yaoundé', 'Libreville', 'Bangui'],
      correct: 1,
      fact: 'Douala on suurin kaupunki, mutta pääkaupunki on Yaoundé.',
      hint: 'Maan suurin kaupunki ei ole pääkaupunki.',
    },
  ],

  kongo: [
    {
      q: 'Mihin valtamereen Kongojoki laskee?',
      options: ['Intian valtamereen', 'Atlanttiin', 'Välimereen', 'Punaiseenmereen'],
      correct: 1,
      fact: 'Kongojoen suisto on Afrikan länsirannikolla.',
      hint: 'Sama valtameri huuhtoo Afrikan länsirannikkoa.',
    },
    {
      q: 'Kongojoki on virtaamaltaan maailman toiseksi suurin. Mikä on suurin?',
      options: ['Niili', 'Mississippi', 'Amazon', 'Jangtse'],
      correct: 2,
      fact: 'Amazonin virtaama on moninkertainen Kongojokeen verrattuna.',
      hint: 'Se virtaa Etelä-Amerikassa.',
    },
    {
      q: 'Mikä on Kongon demokraattisen tasavallan pääkaupunki?',
      options: ['Brazzaville', 'Kinshasa', 'Luanda', 'Kigali'],
      correct: 1,
      fact: 'Kinshasa ja Brazzaville ovat vastakkain joen eri puolilla.',
      hint: 'Kaupunki on joen vastarannalla Brazzavillea vastapäätä.',
    },
  ],

  angola: [
    {
      q: 'Mikä on Angolan pääkaupunki?',
      options: ['Luanda', 'Maputo', 'Windhoek', 'Lusaka'],
      correct: 0,
      fact: 'Luanda on Atlantin rannikon satamakaupunki ja maan suurin kaupunki.',
      hint: 'Nimi alkaa L-kirjaimella.',
    },
    {
      q: 'Minkä maan siirtomaa Angola oli?',
      options: ['Belgia', 'Ranska', 'Portugali', 'Britannia'],
      correct: 2,
      fact: 'Angola itsenäistyi Portugalista vuonna 1975.',
      hint: 'Sama valta hallitsi myös Mosambikia.',
    },
    {
      q: 'Mikä on Angolan tärkein vientituote?',
      options: ['kahvi', 'öljy', 'puuvilla', 'kaakao'],
      correct: 1,
      fact: 'Angola on yksi Afrikan suurimmista öljyntuottajista.',
      hint: 'Sitä pumpataan myös meren pohjasta.',
    },
  ],

  namib: [
    {
      q: 'Mikä kylmä merivirta pitää Namibin rannikon sumuisena ja sateettomana?',
      options: ['Golfvirta', 'Benguelan virta', 'Humboldtin virta', 'Kuroshio'],
      correct: 1,
      fact: 'Kylmä merivesi tiivistää ilman kosteuden sumuksi jo merellä.',
      hint: 'Virta on nimetty Angolan rannikkoalueen mukaan.',
    },
    {
      q: 'Millä nimellä Namibin hylkyjen täyttämä rannikko tunnetaan?',
      options: ['Luurankorannikko', 'Kultarannikko', 'Myrskyranta', 'Valkoinen ranta'],
      correct: 0,
      fact: 'Sumu ja karikot ovat upottaneet rannikolle lukemattomia laivoja.',
      hint: 'Nimi kertoo, mitä rannalta löytyi haaksirikkojen jäljiltä.',
    },
    {
      q: 'Mikä on Namibian pääkaupunki?',
      options: ['Gaborone', 'Windhoek', 'Harare', 'Pretoria'],
      correct: 1,
      fact: 'Windhoek sijaitsee maan keskiosan ylängöllä.',
      hint: 'Nimessä on saksalainen kaiku.',
    },
  ],

  kapkaupunki: [
    {
      q: 'Mikä litteähuippuinen vuori kohoaa Kapkaupungin yllä?',
      options: ['Pöytävuori', 'Kilimandžaro', 'Draakonivuoret', 'Kenia-vuori'],
      correct: 0,
      fact: 'Pöytävuoren tasainen huippu peittyy usein "pöytäliinapilveen".',
      hint: 'Huippu on tasainen kuin huonekalu.',
    },
    {
      q: 'Kuka istui vuosia vankina Robben Islandilla Kapkaupungin edustalla?',
      options: ['Kwame Nkrumah', 'Nelson Mandela', 'Jomo Kenyatta', 'Haile Selassie'],
      correct: 1,
      fact: 'Mandela vapautui 1990 ja valittiin presidentiksi 1994.',
      hint: 'Hänestä tuli myöhemmin maan presidentti.',
    },
    {
      q: 'Etelä-Afrikalla on kolme pääkaupunkia. Mikä niistä on Kapkaupunki?',
      options: ['hallinnollinen', 'oikeudellinen', 'lainsäädännöllinen', 'taloudellinen'],
      correct: 2,
      fact: 'Parlamentti kokoontuu Kapkaupungissa, hallitus istuu Pretoriassa.',
      hint: 'Kaupungissa kokoontuu parlamentti.',
    },
  ],

  kimberley: [
    {
      q: 'Mistä Kimberleyn 1870-luvun ryntäys johtui?',
      options: ['kullasta', 'timanteista', 'öljystä', 'kuparista'],
      correct: 1,
      fact: 'Löydöt tekivät Kimberleystä maailman timanttikaupan keskuksen.',
      hint: 'Löydöistä kasvoi De Beers -yhtiö.',
    },
    {
      q: 'Millä nimellä Kimberleyn valtava käsin kaivettu kuoppa tunnetaan?',
      options: ['Iso reikä', 'Paholaisen kattila', 'Timanttikaivo', 'Suuri halkeama'],
      correct: 0,
      fact: 'Big Hole on yli 200 metriä syvä ja kaivettiin lapioilla.',
      hint: 'Nimi on hyvin suoraviivainen kuvaus.',
    },
    {
      q: 'Mistä kivilajista timantteja louhitaan?',
      options: ['graniitista', 'kalkkikivestä', 'kimberliitistä', 'liuskeesta'],
      correct: 2,
      fact: 'Kimberliitti sai nimensä juuri Kimberleyn mukaan.',
      hint: 'Kivilaji on nimetty juuri tämän kaupungin mukaan.',
    },
  ],

  mosambik: [
    {
      q: 'Mikä on Mosambikin pääkaupunki?',
      options: ['Harare', 'Maputo', 'Lilongwe', 'Dar es Salaam'],
      correct: 1,
      fact: 'Maputo sijaitsee maan eteläkärjessä Intian valtameren rannalla.',
      hint: 'Kaupunki tunnettiin ennen nimellä Lourenço Marques.',
    },
    {
      q: 'Mikä salmi erottaa Mosambikin Madagaskarista?',
      options: ['Mosambikin salmi', 'Bab el-Mandeb', 'Gibraltarinsalmi', 'Malakan salmi'],
      correct: 0,
      fact: 'Salmi on kapeimmillaankin noin 400 kilometriä leveä.',
      hint: 'Salmi on nimetty mantereen puoleisen maan mukaan.',
    },
    {
      q: 'Minkä maan siirtomaa Mosambik oli?',
      options: ['Britannia', 'Saksa', 'Portugali', 'Italia'],
      correct: 2,
      fact: 'Portugalin kieli on yhä Mosambikin virallinen kieli.',
      hint: 'Sama valta kuin Angolassa.',
    },
  ],

  madagaskar: [
    {
      q: 'Mikä kädellisryhmä elää luonnonvaraisena vain Madagaskarilla?',
      options: ['lemurit', 'gorillat', 'paviaanit', 'simpanssit'],
      correct: 0,
      fact: 'Saaren eristyneisyys on synnyttänyt satoja ainutlaatuisia lajeja.',
      hint: 'Tunnetuimmalla lajilla on rengastettu häntä.',
    },
    {
      q: 'Mikä on Madagaskarin pääkaupunki?',
      options: ['Antananarivo', 'Port Louis', 'Moroni', 'Victoria'],
      correct: 0,
      fact: 'Antananarivo sijaitsee saaren keskiylängöllä.',
      hint: 'Nimi on pitkä ja alkaa A-kirjaimella.',
    },
    {
      q: 'Madagaskar on maailman neljänneksi suurin saari. Mikä on suurin?',
      options: ['Borneo', 'Uusi-Guinea', 'Grönlanti', 'Islanti'],
      correct: 2,
      fact: 'Järjestys on Grönlanti, Uusi-Guinea, Borneo ja Madagaskar.',
      hint: 'Saari kuuluu Tanskaan.',
    },
  ],

  sansibar: [
    {
      q: 'Mistä maustesaaresta tunnettu Sansibar on erityisen kuuluisa?',
      options: ['neilikasta', 'sahramista', 'vaniljasta', 'kanelista'],
      correct: 0,
      fact: 'Sansibar oli pitkään maailman suurimpia neilikan tuottajia.',
      hint: 'Maustetta on käytetty myös hammassäryn hoitoon.',
    },
    {
      q: 'Mihin maahan Sansibar kuuluu nykyään?',
      options: ['Kenia', 'Tansania', 'Mosambik', 'Komorit'],
      correct: 1,
      fact: 'Sansibar yhdistyi Tanganjikan kanssa Tansaniaksi vuonna 1964.',
      hint: 'Maan nimi syntyi kahden alueen yhdistyessä.',
    },
    {
      q: 'Mikä on Sansibarin vanhankaupungin nimi?',
      options: ['Stone Town', 'Old Harbour', 'Casbah', 'Medina'],
      correct: 0,
      fact: 'Stone Town eli Kivikaupunki on Unescon maailmanperintökohde.',
      hint: 'Nimi viittaa rakennusmateriaaliin.',
    },
  ],

  kilimandzaro: [
    {
      q: 'Kuinka korkea Kilimandžaro on?',
      options: ['4 810 m', '5 895 m', '6 962 m', '8 849 m'],
      correct: 1,
      fact: 'Kilimandžaro on Afrikan korkein vuori ja maailman korkein yksittäinen vuori.',
      hint: 'Korkeus jää juuri alle kuuden kilometrin.',
    },
    {
      q: 'Missä maassa Kilimandžaro sijaitsee?',
      options: ['Kenia', 'Uganda', 'Tansania', 'Ruanda'],
      correct: 2,
      fact: 'Vuori on Tansanian puolella lähellä Kenian rajaa.',
      hint: 'Sama maa kuin Sansibar.',
    },
    {
      q: 'Millainen vuori Kilimandžaro on?',
      options: ['tulivuori', 'poimuvuori', 'hiekkadyyni', 'meteoriittikraatteri'],
      correct: 0,
      fact: 'Kilimandžaro on kolmesta kartiosta koostuva kerrostulivuori.',
      hint: 'Se syntyi purkauksista, ei laattojen puristuksesta.',
    },
  ],

  viktoria: [
    {
      q: 'Viktoriajärvi on Afrikan suurin järvi. Kuinka monen valtion rantoja se koskettaa?',
      options: ['kahden', 'kolmen', 'viiden', 'yhden'],
      correct: 1,
      fact: 'Järven rannat jakautuvat Tansanian, Ugandan ja Kenian kesken.',
      hint: 'Yksi rantavaltioista on Uganda.',
    },
    {
      q: 'Mikä maailman pisimmistä joista saa alkunsa Viktoriajärvestä?',
      options: ['Kongo', 'Niili', 'Sambesi', 'Niger'],
      correct: 1,
      fact: 'Valkoinen Niili lähtee järvestä Ugandan Jinjan kohdalla.',
      hint: 'Joki virtaa pohjoiseen Välimereen.',
    },
    {
      q: 'Kenen mukaan Viktoriajärvi nimettiin?',
      options: [
        'Britannian kuningattaren',
        'löytäjän vaimon',
        'paikallisen kuninkaan',
        'laivan',
      ],
      correct: 0,
      fact: 'John Hanning Speke nimesi järven 1858 kuningatar Viktorian mukaan.',
      hint: 'Nimeäjä oli brittiläinen tutkimusmatkailija.',
    },
  ],

  tanganjika: [
    {
      q: 'Tanganjikajärvi on maailman toiseksi syvin järvi. Mikä on syvin?',
      options: ['Baikal', 'Superior', 'Titicaca', 'Malawi'],
      correct: 0,
      fact: 'Tanganjika on yli 1 400 metriä syvä, Baikal noin 1 640 metriä.',
      hint: 'Syvin järvi on Siperiassa.',
    },
    {
      q: 'Millaisessa muodostumassa Tanganjikajärvi sijaitsee?',
      options: [
        'meteoriittikraatterissa',
        'Itä-Afrikan hautavajoamassa',
        'jäätikön uurtamassa laaksossa',
        'sammuneessa tulivuoressa',
      ],
      correct: 1,
      fact: 'Hautavajoama syntyy mannerlaattojen erkanemisesta.',
      hint: 'Sama muodostuma jatkuu Punaisellemerelle asti.',
    },
    {
      q: 'Kenet Henry Morton Stanley tapasi Tanganjikan rannalla Ujijissa?',
      options: ['David Livingstonen', 'Mungo Parkin', 'Richard Burtonin', 'Cecil Rhodesin'],
      correct: 0,
      fact: 'Tapaamiseen liitetään lause "Doctor Livingstone, I presume?".',
      hint: 'Kuuluisa lause alkaa sanalla "Doctor".',
    },
  ],

  bahrelghazal: [
    {
      q: 'Missä maassa Bahr el Ghazalin alue sijaitsee?',
      options: ['Etelä-Sudan', 'Egypti', 'Etiopia', 'Kenia'],
      correct: 0,
      fact: 'Bahr el Ghazal on Etelä-Sudanin luoteinen jokialue.',
      hint: 'Maa itsenäistyi vuonna 2011.',
    },
    {
      q: 'Mitä arabian sana "bahr" tarkoittaa?',
      options: ['vuorta', 'jokea tai merta', 'aavikkoa', 'kaupunkia'],
      correct: 1,
      fact: 'Nimi tarkoittaa suunnilleen "gasellien jokea".',
      hint: 'Sana esiintyy monien vesistöjen nimissä.',
    },
    {
      q: 'Alueen laaja Sudd-kosteikko syntyy minkä joen tulvista?',
      options: ['Kongon', 'Niilin', 'Nigerin', 'Sambesin'],
      correct: 1,
      fact: 'Sudd on yksi maailman suurimmista makean veden kosteikoista.',
      hint: 'Sama joki jatkaa matkaansa Egyptiin.',
    },
  ],

  darfur: [
    {
      q: 'Darfur on alue missä maassa?',
      options: ['Tšad', 'Sudan', 'Egypti', 'Libya'],
      correct: 1,
      fact: 'Darfur on Sudanin läntinen alue Tšadin rajalla.',
      hint: 'Maan pääkaupunki on Khartum.',
    },
    {
      q: 'Mitä nimi Darfur tarkoittaa?',
      options: ['furien maa', 'kultainen laakso', 'suuri aavikko', 'idän portti'],
      correct: 0,
      fact: 'Arabian "dar" tarkoittaa kotia tai maata, fur on alueen kansa.',
      hint: '"Dar" tarkoittaa kotia tai maata.',
    },
    {
      q: 'Mikä on Sudanin pääkaupunki?',
      options: ['Asmara', 'Djibouti', 'Khartum', 'Juba'],
      correct: 2,
      fact: 'Khartum sijaitsee Sinisen ja Valkoisen Niilin yhtymäkohdassa.',
      hint: 'Kaupunki on kahden Niilin yhtymäkohdassa.',
    },
  ],

  suakin: [
    {
      q: 'Minkä meren rannalla vanha satamakaupunki Suakin sijaitsee?',
      options: ['Punainenmeri', 'Välimeri', 'Arabianmeri', 'Intian valtameri'],
      correct: 0,
      fact: 'Suakin oli vuosisatoja Sudanin tärkein Punaisenmeren satama.',
      hint: 'Meri on nimetty värin mukaan.',
    },
    {
      q: 'Mistä materiaalista Suakinin vanhat rakennukset tehtiin?',
      options: ['korallikivestä', 'marmorista', 'tiilestä', 'puusta'],
      correct: 0,
      fact: 'Riutalta louhittu korallikivi antoi taloille vaalean sävyn.',
      hint: 'Materiaali louhittiin riutalta.',
    },
    {
      q: 'Mikä kanava yhdistää Punaisenmeren Välimereen?',
      options: ['Panaman kanava', 'Suezin kanava', 'Kielin kanava', 'Korintin kanava'],
      correct: 1,
      fact: 'Suezin kanava avattiin liikenteelle vuonna 1869.',
      hint: 'Kanava avattiin liikenteelle vuonna 1869.',
    },
  ],

  addisabeba: [
    {
      q: 'Minkä maan pääkaupunki Addis Abeba on?',
      options: ['Eritrea', 'Etiopia', 'Somalia', 'Djibouti'],
      correct: 1,
      fact: 'Addis Abeba sijaitsee yli 2 300 metrin korkeudella.',
      hint: 'Maalla on oma aakkosto ja oma kalenteri.',
    },
    {
      q: 'Minkä järjestön päämaja on Addis Abebassa?',
      options: ['Afrikan unioni', 'OPEC', 'Nato', 'Punainen Risti'],
      correct: 0,
      fact: 'Kaupunkia kutsutaan siksi usein Afrikan poliittiseksi pääkaupungiksi.',
      hint: 'Järjestössä on 55 jäsenvaltiota.',
    },
    {
      q: 'Minkä juoman alkuperämaana Etiopiaa pidetään?',
      options: ['teen', 'kahvin', 'kaakaon', 'rommin'],
      correct: 1,
      fact: 'Kahvipensas on kotoisin Etiopian Kaffan ylängöiltä.',
      hint: 'Sen pavut paahdetaan ennen käyttöä.',
    },
  ],

  rashafun: [
    {
      q: 'Ras Hafun on Afrikan mantereen itäisin niemi. Missä maassa se on?',
      options: ['Somalia', 'Kenia', 'Eritrea', 'Djibouti'],
      correct: 0,
      fact: 'Niemi työntyy Intian valtamereen Afrikan sarven kärjessä.',
      hint: 'Maa muodostaa Afrikan sarven kärjen.',
    },
    {
      q: 'Mikä on Somalian pääkaupunki?',
      options: ['Hargeisa', 'Mogadishu', 'Djibouti', 'Addis Abeba'],
      correct: 1,
      fact: 'Mogadishu on ollut vuosisatoja Intian valtameren kauppasatama.',
      hint: 'Nimi alkaa M-kirjaimella.',
    },
    {
      q: 'Mitkä maat muodostavat Afrikan sarven?',
      options: [
        'Somalia, Etiopia, Eritrea ja Djibouti',
        'Kenia, Uganda ja Tansania',
        'Sudan, Tšad ja Niger',
        'Angola, Sambia ja Malawi',
      ],
      correct: 0,
      fact: 'Alue sai nimensä sarvimaisesta muodostaan kartalla.',
      hint: 'Yksi maista on Etiopia.',
    },
  ],

  // Varapakka: käytetään jos kaupungin omat kysymykset on jo kysytty.
  general: [
    {
      q: 'Mikä on Afrikan pisin joki?',
      options: ['Kongo', 'Niili', 'Niger', 'Sambesi'],
      correct: 1,
      fact: 'Niili virtaa noin 6 650 kilometriä Välimereen.',
      hint: 'Joki laskee Välimereen.',
    },
    {
      q: 'Kuinka monta itsenäistä valtiota Afrikassa on?',
      options: ['38', '46', '54', '61'],
      correct: 2,
      fact: 'YK:n jäsenvaltioita Afrikassa on 54.',
      hint: 'Luku on yli 50 mutta alle 60.',
    },
    {
      q: 'Mikä on Afrikan suurin maa pinta-alaltaan?',
      options: ['Algeria', 'Sudan', 'Kongon demokraattinen tasavalta', 'Libya'],
      correct: 0,
      fact: 'Algeriasta suurin osa on Saharaa.',
      hint: 'Suurin osa maasta on aavikkoa.',
    },
    {
      q: 'Mikä salmi erottaa Afrikan Euroopasta?',
      options: ['Bosporinsalmi', 'Gibraltarinsalmi', 'Öresund', 'Doverinsalmi'],
      correct: 1,
      fact: 'Gibraltarinsalmi on kapeimmillaan noin 14 kilometriä leveä.',
      hint: 'Salmen eteläpuolella on Marokko.',
    },
    {
      q: 'Mikä on maailman nopein maaeläin?',
      options: ['gepardi', 'leijona', 'antilooppi', 'strutsi'],
      correct: 0,
      fact: 'Gepardi kiihtyy hetkellisesti yli 100 kilometriin tunnissa.',
      hint: 'Sillä on pilkullinen turkki ja kyynelviiru silmien alla.',
    },
    {
      q: 'Mikä on maailman suurin kädellinen?',
      options: ['orangutan', 'gorilla', 'simpanssi', 'paviaani'],
      correct: 1,
      fact: 'Urosgorilla voi painaa yli 200 kiloa.',
      hint: 'Se elää vuoristosademetsissä.',
    },
    {
      q: 'Mikä valtameri sijaitsee Afrikasta itään?',
      options: ['Atlantti', 'Tyynimeri', 'Intian valtameri', 'Pohjoinen jäämeri'],
      correct: 2,
      fact: 'Lännessä Afrikkaa reunustaa Atlantti.',
      hint: 'Sama valtameri huuhtoo myös Intian rantoja.',
    },
    {
      q: 'Missä sijaitsevat Kheopsin pyramidi ja Sfinksi?',
      options: ['Gizassa', 'Luxorissa', 'Karthagossa', 'Meroessa'],
      correct: 0,
      fact: 'Giza on Kairon kupeessa Niilin länsirannalla.',
      hint: 'Paikka on aivan Kairon kupeessa.',
    },
    {
      q: 'Mikä on Afrikan suurin saari?',
      options: ['Sansibar', 'Sokotra', 'Madagaskar', 'Mauritius'],
      correct: 2,
      fact: 'Madagaskar on yli 580 000 neliökilometriä.',
      hint: 'Saarella elää lemureita.',
    },
    {
      q: 'Mikä Afrikan maa säilytti itsenäisyytensä siirtomaakaudella lyhyttä miehitystä lukuun ottamatta?',
      options: ['Ghana', 'Etiopia', 'Kenia', 'Senegal'],
      correct: 1,
      fact: 'Italia miehitti Etiopiaa vain vuosina 1936–1941.',
      hint: 'Maan pääkaupunki on Addis Abeba.',
    },
    {
      q: 'Mistä kielestä sana "safari" on peräisin?',
      options: ['swahilista', 'zulusta', 'arabiasta suoraan', 'afrikaansista'],
      correct: 0,
      fact: 'Swahilin safari tarkoittaa matkaa; sana juontuu arabian sanasta safar.',
      hint: 'Kieltä puhutaan Tansaniassa ja Keniassa.',
    },
    {
      q: 'Mikä on maailman suurin kuuma aavikko?',
      options: ['Gobi', 'Kalahari', 'Sahara', 'Atacama'],
      correct: 2,
      fact: 'Sahara on lähes Yhdysvaltain kokoinen.',
      hint: 'Se ulottuu Atlantilta Punaisellemerelle.',
    },
    {
      q: 'Mikä vesiputous Sambesi-joella tunnetaan nimellä "Jyrisevä savu"?',
      options: ['Victorian putoukset', 'Niagara', 'Angelin putous', 'Tugelan putous'],
      correct: 0,
      fact: 'Paikallinen nimi Mosi-oa-Tunya tarkoittaa jyrisevää savua.',
      hint: 'Putoukset ovat Sambian ja Zimbabwen rajalla.',
    },
    {
      q: 'Mikä on Afrikan yleisimmin puhuttuja kieliä Itä-Afrikassa?',
      options: ['swahili', 'zulu', 'joruba', 'amhara'],
      correct: 0,
      fact: 'Swahili on Tansanian ja Kenian yhteinen valtakieli.',
      hint: 'Sana safari on peräisin tästä kielestä.',
    },
    {
      q: 'Millä eläimellä on maailman pisin kaula?',
      options: ['strutsilla', 'kirahvilla', 'flamingolla', 'kamelilla'],
      correct: 1,
      fact: 'Kirahvin kaulassa on silti vain seitsemän nikamaa, kuten ihmisellä.',
      hint: 'Se syö mieluiten puiden latvoista.',
    },
  ],
};

/**
 * "Tiesitkö että…" -tiedot paikoista. Peli näyttää yhden pelaajan nykyisestä
 * sijainnista, joten jokaisella kaupungilla on useampi vaihtoehto.
 */
export const AFRICA_FACTS = {
  tanger: [
    'Tanger on ollut satamakaupunki jo foinikialaisten ajoista. Gibraltarin salmi erottaa sen Espanjasta vain noin 14 kilometrin levyisenä.',
    'Tangeria hallittiin vuosina 1923–1956 kansainvälisenä vyöhykkeenä, jota useat maat valvoivat yhdessä.',
  ],
  kairo: [
    'Kairo on Afrikan väkirikkaimpia kaupunkeja. Sen laidalla Gizassa seisovat yli 4 500 vuotta vanhat pyramidit.',
    'Kaupungin halki virtaa Niili, yksi maailman pisimmistä joista.',
  ],
  tripoli: [
    'Tripolin nimi tulee kreikan sanoista, jotka tarkoittavat kolmea kaupunkia.',
    'Tripoli on Libyan pääkaupunki ja sen tärkein satama Välimeren rannalla.',
  ],
  murzuk: [
    'Murzuk oli aikoinaan tärkeä pysähdyspaikka Saharan halki kulkeneilla karavaanireiteillä.',
    'Murzukin hiekkameri on yksi Saharan laajimmista dyynialueista.',
  ],
  alkufra: [
    'Al Kufra on keidasryhmä keskellä Saharaa. Sen pelloille pumpataan vettä syvältä maanalaisesta pohjavesivarastosta.',
    'Kufran kastellut pellot näkyvät satelliittikuvissa vihreinä ympyröinä keskellä autiomaata.',
  ],
  sahara: [
    'Sahara on maailman laajin kuuma autiomaa — melkein Yhdysvaltojen kokoinen.',
    'Sahara oli muutama tuhat vuotta sitten vehreä savanni. Kalliomaalaukset kertovat yhä siellä laiduntaneesta karjasta.',
  ],
  ahaggar: [
    'Ahaggar on vuoristo keskellä Saharaa. Sen huiput kohoavat lähes 3 000 metriin ja yöt ovat siellä kylmiä.',
    'Ahaggarin vuoret ovat tuaregien vanhaa kotiseutua.',
  ],
  timbuktu: [
    'Timbuktu oli keskiajalla oppineisuuden keskus, jonka kirjastoissa säilytettiin kymmeniätuhansia käsikirjoituksia.',
    'Kaupunki rikastui suolan ja kullan vaihdannasta Saharan karavaanireittien varrella.',
  ],
  gao: [
    'Gao oli Songhain valtakunnan pääkaupunki. Se oli 1400–1500-luvuilla yksi Afrikan mahtavimmista valtioista.',
    'Kaupunki sijaitsee Nigerjoen rannalla, aavikon ja savannin rajalla.',
  ],
  dakar: [
    'Dakar sijaitsee Cap-Vertin niemimaalla, Afrikan mantereen läntisimmässä kärjessä.',
    'Dakarin edustalla on Goréen saari, josta lähti orjalaivoja. Saari on nykyään maailmanperintökohde.',
  ],
  sierraleone: [
    'Sierra Leone tarkoittaa portugaliksi leijonavuoria. Nimen antoivat merenkulkijat rannikon vuorille.',
    'Maan pääkaupunki Freetown perustettiin vapautettujen orjien asuinpaikaksi.',
  ],
  kappalmas: [
    'Kap Palmas on niemi Liberian eteläkärjessä. Portugalilaiset merenkulkijat nimesivät sen rannan palmujen mukaan.',
    'Kap Palmasin kohdalla Afrikan rannikko kääntyy jyrkästi lännestä itään.',
  ],
  kumasi: [
    'Kumasi on ashantien kuningaskunnan vanha pääkaupunki, ja ashantien kuninkaan hovi toimii siellä yhä.',
    'Kumasin tori on yksi Länsi-Afrikan suurimmista.',
  ],
  orjarannikko: [
    'Orjarannikko oli eurooppalaisten kauppiaiden nimitys Guineanlahden rannikolle, jolta vietiin ihmisiä orjuuteen Amerikkaan.',
    'Naapurirannikot saivat nimensä kauppatavaran mukaan: Kultarannikko, Norsunluurannikko ja Pippurirannikko.',
  ],
  kano: [
    'Kano on yli tuhat vuotta vanha kauppakaupunki, jota ympäröivät savesta rakennetut muurit.',
    'Kano oli Saharan karavaanireittien eteläinen pääte, jossa vaihdettiin suolaa, kangasta ja nahkaa.',
  ],
  kamerun: [
    'Kamerunvuori on Länsi-Afrikan korkein huippu ja yhä toimiva tulivuori.',
    'Maan nimi tulee portugalin katkarapua tarkoittavasta sanasta: merenkulkijat löysivät niitä jokisuulta.',
  ],
  kongo: [
    'Kongojoki on virtaamaltaan maailman toiseksi suurin joki heti Amazonin jälkeen.',
    'Kongon altaassa kasvaa maailman toiseksi laajin sademetsä.',
  ],
  angola: [
    'Angolan rannikkoa viilentää kylmä Benguelan merivirta, joka tekee rannasta poikkeuksellisen kuivan.',
    'Angola on yksi Afrikan suurimmista öljyn ja timanttien tuottajista.',
  ],
  namib: [
    'Namib on maailman vanhimpia autiomaita: se on ollut kuiva yli 50 miljoonaa vuotta.',
    'Namibin dyynit ovat maailman korkeimpia — osa niistä kohoaa yli 300 metriin.',
  ],
  kapkaupunki: [
    'Kapkaupungin yllä kohoaa Taffelivuori, jonka tasainen laki peittyy usein pilveen.',
    'Kaupungin eteläpuolinen Hyväntoivonniemi oli tärkeä välietappi Euroopan ja Intian välisellä purjehdusreitillä.',
  ],
  kimberley: [
    'Kimberleyn timanttilöytö 1870-luvulla sai aikaan valtavan kaivosryntäyksen.',
    'Kaupungin Big Hole on käsin kaivettu kuoppa ja yksi maailman suurimmista.',
  ],
  mosambik: [
    'Mosambikin rannikko on lähes 2 500 kilometriä pitkä, ja saaren suuntaan avautuu Mosambikin kanaali.',
    'Mosambik oli portugalilaisten siirtomaa satojen vuosien ajan, ja portugali on yhä maan virallinen kieli.',
  ],
  madagaskar: [
    'Madagaskar erosi muusta mantereesta kymmeniä miljoonia vuosia sitten. Siksi valtaosa sen eläimistä ja kasveista ei elä missään muualla.',
    'Saaren ensimmäiset asukkaat purjehtivat sinne Kaakkois-Aasiasta, ja malagassin kieli on yhä sukua Indonesian kielille.',
  ],
  sansibar: [
    'Sansibar tunnettiin mausteistaan, erityisesti neilikasta.',
    'Sansibarin ja Britannian välinen sota vuonna 1896 kesti alle tunnin ja on historian lyhin sota.',
  ],
  kilimandzaro: [
    'Kilimandžaro on Afrikan korkein vuori, 5 895 metriä. Sen huipulla on jäätiköitä aivan päiväntasaajan tuntumassa.',
    'Kilimandžaro on tulivuori, joka kohoaa yksinään savannin keskeltä.',
  ],
  viktoria: [
    'Viktorianjärvi on Afrikan suurin järvi ja maailman toiseksi suurin makean veden järvi.',
    'Järvestä saa alkunsa Valkoinen Niili.',
  ],
  tanganjika: [
    'Tanganjikajärvi on maailman toiseksi syvin järvi: sen pohja on yli 1 400 metrin syvyydessä.',
    'Järvessä elää satoja kalalajeja, joita ei tavata missään muualla.',
  ],
  bahrelghazal: [
    'Bahr el Ghazal on Niilin sivujoki, ja sen nimi tarkoittaa arabiaksi gasellien jokea.',
    'Alueella leviää Sudd, yksi maailman laajimmista suoalueista.',
  ],
  darfur: [
    'Darfur tarkoittaa furien maata: fur on alueen suurimpia kansoja.',
    'Alueen keskellä kohoaa Marran vuoristo, jonka rinteillä sataa selvästi enemmän kuin ympäröivässä puoliaavikossa.',
  ],
  suakin: [
    'Suakin oli vuosisatoja Sudanin tärkein satama. Sen vanhat talot rakennettiin koralliharkoista.',
    'Suakinista lähdettiin pyhiinvaellusmatkalle Punaisenmeren yli Mekkaan.',
  ],
  addisabeba: [
    'Addis Abeba on yksi maailman korkeimmalla sijaitsevista pääkaupungeista, noin 2 400 metrissä.',
    'Nimi tarkoittaa amharaksi uutta kukkaa.',
  ],
  rashafun: [
    'Ras Hafun on Afrikan mantereen itäisin niemi.',
    'Niemi oli antiikin aikana kauppapaikka, jonne purjehdittiin monsuunituulten avulla.',
  ],
};
