# Osallistuminen

Kiitos kiinnostuksesta! Tämä peli on rakennettu niin, että uusien lautojen ja
kysymysten lisääminen on mahdollisimman helppoa — myös ilman syvää
ohjelmointikokemusta. Kaikki muutokset tehdään pull requesteina, ja testit
tarkistavat automaattisesti, että lisäys on ehjä.

## Helpoin tapa: lisää kysymyksiä tai tietoja

Kysymykset ja "Tiesitkö että…" -tiedot ovat tavallisissa JavaScript-tiedostoissa:

- `js/packs/africa-questions.js` — Afrikan lauta
- `js/packs/middleeast-questions.js` — Lähi-idän lauta

Kysymyksen muoto:

```js
{
  q: 'Minkä maan pääkaupunki Tripoli on?',
  options: ['Libya', 'Tunisia', 'Algeria', 'Marokko'],  // aina 4 vaihtoehtoa
  correct: 0,                     // oikean vastauksen paikka listassa (0–3)
  fact: 'Tripoli on Libyan pääkaupunki ja suurin kaupunki.',  // selitys vastauksen jälkeen
  hint: 'Maan öljyvarat ovat Afrikan suurimmat.',  // ostettava vihje
}
```

Pelisäännöt kysymyksille (testit valvovat näitä):

- tasan neljä erilaista vaihtoehtoa
- `fact` ja `hint` ovat pakollisia
- vihje **ei saa sisältää** oikeaa vastausta sellaisenaan
- sama kysymysteksti ei saa esiintyä laudalla kahdesti
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
7. **Rekisteröi paketti** lisäämällä se `js/pack.js`-tiedoston `PACKS`-listaan
   sekä tiedostolistoihin `sw.js` ja `tools/build-standalone.mjs`.
8. **Aja testit:** `npm test`. Testit ajetaan automaattisesti jokaiselle
   paketille: laudan yhtenäisyys, laattamäärät, kysymyspankin eheys,
   laivareittien sijainti vedellä ja kokonainen bottien pelaama peli.

## Ennen pull requestia

```bash
npm test                        # kaikkien lautojen testit
node tools/build-standalone.mjs # yhden tiedoston versio kokoontuu virheittä
```

Kerro pull requestin kuvauksessa lyhyesti, mistä lähteistä tarkistit
kysymysten faktat.
