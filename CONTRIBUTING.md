# Osallistuminen

Kiitos kiinnostuksesta! Lue ensin [pelin periaatteet](docs/periaatteet.md) —
ne kertovat, millä perusteilla sisältö hyväksytään peliin. Tämä peli on rakennettu niin, että uusien lautojen ja
kysymysten lisääminen on mahdollisimman helppoa — myös ilman syvää
ohjelmointikokemusta. Kaikki muutokset tehdään pull requesteina, ja testit
tarkistavat automaattisesti, että lisäys on ehjä.

## Helpoin tapa: lisää kysymyksiä tai tietoja

Kysymykset ja "Tiesitkö että…" -tiedot ovat tavallisissa JavaScript-tiedostoissa:

- `js/packs/africa-questions.js` — Afrikan lauta
- `js/packs/europe-questions.js` — Euroopan lauta
- `js/packs/middleeast-questions.js` — Lähi-idän lauta
- `js/packs/istanbul-questions.js` — Istanbulin kaupunkilauta
- `js/packs/maailma-questions.js` — Maailma-lauta

Kysymyksen muoto:

```js
{
  q: 'Minkä maan pääkaupunki Tripoli on?',
  options: ['Libya', 'Tunisia', 'Algeria', 'Marokko'],  // aina 4 vaihtoehtoa
  correct: 0,                     // oikean vastauksen paikka listassa (0–3)
  fact: 'Tripoli on Libyan pääkaupunki ja suurin kaupunki.',  // selitys vastauksen jälkeen
  hint: 'Maan öljyvarat ovat Afrikan suurimmat.',  // ostettava vihje
  level: 2,  // vaikeustaso: 1 = helppo, 2 = perus (oletus), 3 = vaikea
  source: 'https://www.britannica.com/place/Tripoli-Libya',  // vapaaehtoinen lähde
}
```

Vaikeustasot: taso 1 on lapsellekin ratkaistavissa, taso 2 on tavallista
yleistietoa ja taso 3 vaatii erikoistietoa — siitä saa pelissä bonuksen.
Jos `level` puuttuu, kysymys on tasoa 2.

Jokaisella laudalla on lisäksi pieni **rosvon kaksintaistelupakka**
(`duels`-lista paketissa): erityisen kiperiä kysymyksiä, joissa on kahdeksan
vaihtoehtoa ja `fact`, mutta ei vihjettä — helpotukset hoitaa rosvo.

### Lähde

Periaate 2 sanoo, että jokainen pelin väittämä on tarkistettavissa. Siksi
kysymykseen, kaksintaisteluun ja Tiesitkö että -tietoon voi liittää `source`-
kentän. Se näkyy pelaajalle vastauksen jälkeen pienenä "Lähde:" -rivinä.

```js
source: 'https://www.britannica.com/place/Tripoli-Libya'   // verkko-osoite
source: 'Maailman valtiot ja liput, WSOY 2019, s. 88'      // kirja
source: ['https://data.worldbank.org/...', 'YK 2023']      // useampi
```

Verkko-osoitteesta näytetään pelkkä palvelimen nimi (`britannica.com`) ja siitä
tulee linkki; sanallinen viite näytetään sellaisenaan. Vain `http`- ja
`https`-osoitteet kelpaavat.

Tiesitkö että -tieto on joko pelkkä merkkijono tai teksti lähteineen — vanha
muoto kelpaa yhä sellaisenaan:

```js
kairo: [
  'Kairon halki virtaava Niili on koko Egyptin elämänlanka.',
  { text: 'Kairon asukasluku ylittää 20 miljoonaa.', source: 'YK 2023' },
],
```

**Lähde on toistaiseksi vapaaehtoinen**, koska suurin osa vanhasta sisällöstä on
kirjoitettu ennen kentän olemassaoloa. Uuteen sisältöön se kannattaa aina
merkitä. Nykytilanteen näkee komennolla:

```bash
node tools/source-report.mjs             # kattavuus laudoittain
node tools/source-report.mjs --missing   # lista lähteettömistä
```

Hyvä lähde on sellainen, josta väitteen voi oikeasti tarkistaa: tietosanakirja,
tilastolaitos, museo, yliopisto tai kirja sivunumeroineen. Älä merkitse lähdettä,
jota et ole itse lukenut.

Pelisäännöt kysymyksille (testit valvovat näitä):

- tasan neljä erilaista vaihtoehtoa
- `fact` ja `hint` ovat pakollisia
- vihje **ei saa sisältää** oikeaa vastausta sellaisenaan
- sama kysymysteksti ei saa esiintyä laudalla kahdesti
- jos `source` on annettu, se on merkkijono tai lista merkkijonoja, ja
  verkko-osoitteen pitää alkaa `http://` tai `https://`
- tärkeintä: **tarkista faktat!** Peli on opetuspeli, joten jokaisen väitteen
  pitää olla totta.

## Isompi urakka: kokonaan uusi lauta

Jokainen lauta on *karttapaketti* hakemistossa `js/packs/`. Moottoriin ei
tarvitse koskea — paketti kertoo kaiken: kartan ääriviivat, kaupungit, reitit,
laattamäärät, kysymykset ja teeman. Malliksi kannattaa avata
`js/packs/middleeast.js`, joka on kommentoitu tätä varten.

Vaiheet:

1. **Kopioi pohjaksi** `js/packs/middleeast.js` ja `js/packs/middleeast-questions.js`
   uusilla nimillä (esim. `southamerica.js`).
2. **Projisoi kartta.** Valitse alueen pituus- ja leveysastevälit ja laske
   koordinaatit 1000×1000-ruudukkoon samalla kaavalla kuin olemassa olevissa
   paketeissa (kaava on tiedoston alun kommentissa). Rannikko piirretään
   pistelistana, joka pehmennetään automaattisesti käyräksi.
3. **Sijoita kaupungit** todellisille paikoilleen (`start: true` kahdelle
   aloituskaupungille, `airport: true` lentokentille). Kaupunkien on oltava
   vähintään `minCityDistance`-yksikön päässä toisistaan.
4. **Vedä reitit.** `steps` on reitin pituus silmälukuina. Laivareitit saavat
   `type: 'sea'` ja tarvittaessa `via`-pisteet, joilla reitti kiertää rannikon —
   testit tarkistavat, että laivareitit kulkevat veden päällä.
5. **Mitoita laatat.** Laattojen yhteismäärän on oltava sama kuin
   aarrekaupunkien määrä (kaupungit miinus aloituskaupungit), ja tähtiä on aina
   tasan yksi.
6. **Kirjoita sisältö:** vähintään 2 kysymystä joka aarrekaupungille, vähintään
   10 yleiskysymystä ja vähintään 2 "Tiesitkö että…" -tietoa joka kaupungille.
7. **Linkitä lauta maailmaan.** Kaupungille voi antaa `links`-listan, joka
   yhdistää sen toisen laudan kaupunkiin (esim. Kairo on sekä Afrikan että
   Lähi-idän laudalla, ja Lähi-idän Istanbulista laskeudutaan Istanbulin
   kaupunkilaudalle). Vaellustilassa pelaaja voi siirtyä linkkiä pitkin.
   Kaupunkilauta tehdään täsmälleen samalla paketilla — "kaupungit" ovat
   silloin kaupunginosia ja laivareitit vaikkapa lauttoja (malli:
   `js/packs/istanbul.js`).
8. **Rekisteröi paketti** lisäämällä se `js/pack.js`-tiedoston `PACKS`-listaan
   sekä tiedostolistoihin `sw.js` ja `tools/build-standalone.mjs`.
9. **Aja testit:** `npm test`. Testit ajetaan automaattisesti jokaiselle
   paketille: laudan yhtenäisyys, laattamäärät, kysymyspankin eheys,
   laivareittien sijainti vedellä ja kokonainen bottien pelaama peli.

## Ennen pull requestia

```bash
npm test                        # kaikkien lautojen testit
node tools/build-standalone.mjs # yhden tiedoston versio kokoontuu virheittä
node tools/source-report.mjs    # lähteiden kattavuus
```

Kerro pull requestin kuvauksessa lyhyesti, mistä lähteistä tarkistit
kysymysten faktat.
