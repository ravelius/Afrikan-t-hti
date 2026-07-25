# Afrikan tähti ★

Selaimessa pelattava versio klassisesta Afrikan tähti -lautapelistä. Ei riippuvuuksia,
ei käännösvaihetta — pelkkää HTML:ää, CSS:ää ja JavaScriptiä.

- 2–4 pelaajaa samalla koneella, kukin joko ihminen tai botti
- SVG-kartta, jossa 32 kaupunkia, maareitit, laivareitit ja kolme lentoyhteyttä
- 30 laattaa: Afrikan tähti, hevosenkengät, ryöstäjät, jalokivet ja tyhjät
- Suomenkielinen käyttöliittymä ja tapahtumaloki

## Pelin käynnistys

Peli käyttää ES-moduuleja, joten se tarvitsee pienen web-palvelimen (pelkkä
`index.html`-tiedoston avaaminen selaimeen ei riitä):

```bash
npm start          # käynnistää python3 -m http.server 8000
# tai
npx http-server -p 8000
```

Avaa sitten <http://localhost:8000/>.

## Säännöt

**Tavoite.** Löydä Afrikan tähti ja palaa sen kanssa Tangeriin tai Kairoon. Kun tähti on
löytynyt, myös hevosenkengän haltija voi voittaa pääsemällä aloituskaupunkiin ensimmäisenä.

**Vuoro.** Yksi teko vuorossa:

| Teko | Selitys |
| --- | --- |
| Heitä noppa ja liiku | Silmäluku käytetään kokonaan |
| Osta laatta (100 p) | Vain omassa kaupungissa, jos siinä on kääntämätön laatta |
| Kokeile onnea | Nopalla 4–6 laatta kääntyy ilmaiseksi, muuten vuoro menee hukkaan |
| Lennä (300 p) | Lentokentältä toiselle: Tanger, Kairo, Kapkaupunki |

**Liikkuminen.** Reittiä voi vaihtaa kaupungissa, mutta kesken reitin ei saa kääntyä
takaisin. Matkan voi pysäyttää myös reitin varrelle. Laivareitille (sininen katkoviiva)
astuminen maksaa 100 puntaa, ja ilman rahaa laivaan ei pääse.

**Laatat (30 kpl).**

| Laatta | Määrä | Vaikutus |
| --- | --- | --- |
| ★ Afrikan tähti | 1 | Vie se kotiin ja voitat |
| Ω Hevosenkenkä | 2 | Voittaa, jos ehtii kotiin ennen tähteä |
| ☠ Ryöstäjä | 3 | Vie kaikki rahat |
| ◆ Rubiini | 4 | 1000 puntaa |
| ◆ Smaragdi | 5 | 600 puntaa |
| ◆ Topaasi | 6 | 300 puntaa |
| · Tyhjä | 9 | Ei mitään |

Jokainen aloittaa 300 punnalla. Jalokiven arvo lisätään heti pelaajan rahoihin.

**Kotisääntö.** Jos pelaaja on rahaton eikä pääse mihinkään tavoitteeseen ilman
laivalippua (esim. jumissa Sansibarissa), hän saa vuoronsa alussa 100 puntaa pankilta.
Tämä estää pelin lukkiutumisen; alkuperäisessä pelissä vastaavaa sääntöä ei ole.

Kartta ja reitit ovat oma tulkinta alkuperäisestä laudasta: kaupungit on sijoitettu
todellisten koordinaattiensa mukaan ja reittien pituudet on tasapainotettu peliä varten.

## Projektin rakenne

```
index.html          runko ja dialogit
css/styles.css      ulkoasu
js/board.js         kaupungit, reitit ja kartan piirtotiedot
js/tokens.js        laattatyypit ja pinon sekoitus
js/rules.js         puhdas sääntölogiikka (siirrot, etäisyydet) — testattavissa Nodella
js/game.js          pelitila, vuorot, laattojen kääntäminen, voittoehdot
js/ai.js            bottien päätöksenteko
js/ui.js            SVG-kartan piirto ja napit
js/main.js          käynnistys ja aloitusruutu
tests/              node --test -testit säännöille ja kokonaiselle pelille
```

## Testit

```bash
npm test
```

Testit kattavat laudan yhtenäisyyden, siirtojen laskennan (koko silmäluku, ei paluuta
kesken reitin, laivamaksut), laattojen vaikutukset, voittoehdot sekä kokonaisen
bottien pelaaman pelin päättymisen.
