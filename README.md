# Afrikan tähti ★

Selaimessa pelattava versio klassisesta Afrikan tähti -lautapelistä. Ei riippuvuuksia,
ei käännösvaihetta — pelkkää HTML:ää, CSS:ää ja JavaScriptiä.

- 2–4 pelaajaa samalla koneella, kukin joko ihminen tai botti
- Aarteet avataan **vain tietovisalla**: arvottu monivalintakysymys (A–D) paikan
  maantiedosta, kulttuurista ja yleistiedosta; 50 punnan 50:50-vihje auttaa pinteessä
- SVG-kartta, jossa 32 kaupunkia, maareitit, laivareitit ja kolme lentoyhteyttä
- 30 laattaa: Afrikan tähti, hevosenkengät, ryöstäjät, jalokivet ja tyhjät
- Yli 100 kysymystä: jokaisella kaupungilla omat kysymyksensä + yleinen varapakka
- Suomenkielinen käyttöliittymä, tapahtumaloki ja nopan heittoanimaatio
- Käsin piirretyn aarrekartan ulkoasu: pergamentti, mustepiirretty rannikko,
  kompassiruusu, aallot ja punaiset ✗-merkit kääntämättömille laatoille
- Koko ruudun sovelluskehys: kaikki oleellinen näkyy kerralla, vain tapahtumaloki vierii
- Asennettava sovellus (PWA): toimii offline ja jatkaa keskeytynyttä peliä
- Mitoitettu erityisesti iPadille (sekä vaaka- että pystytaso)

## Pelin käynnistys

Peli käyttää ES-moduuleja, joten se tarvitsee pienen web-palvelimen (pelkkä
`index.html`-tiedoston avaaminen selaimeen ei riitä):

```bash
npm start          # käynnistää python3 -m http.server 8000
# tai
npx http-server -p 8000
```

Avaa sitten <http://localhost:8000/>.

**Asennus sovellukseksi.** Kun peli on avattu selaimessa (https tai localhost), sen voi
lisätä kotivalikkoon: iPadilla ja iPhonella *Jaa → Lisää kotivalikkoon*, Chromessa
osoitepalkin asennuskuvake. Tällöin peli avautuu ilman selaimen palkkeja ja toimii myös
lentokonetilassa. Kesken jäänyt peli tallentuu selaimen muistiin ja jatkuu automaattisesti
seuraavalla avauskerralla; *Uusi peli* aloittaa alusta.

## Säännöt

**Tavoite.** Löydä Afrikan tähti ja palaa sen kanssa Tangeriin tai Kairoon. Kun tähti on
löytynyt, myös hevosenkengän haltija voi voittaa pääsemällä aloituskaupunkiin ensimmäisenä.

**Vuoro.** Yksi teko vuorossa:

| Teko | Selitys |
| --- | --- |
| Avaa laatta kysymyksellä | Ainoa tapa avata aarre: oikea vastaus kääntää laatan |
| Heitä noppa ja liiku | Noppa kertoo askelten enimmäismäärän |
| Lennä (300 p) | Lentokentältä toiselle: Tanger, Kairo, Kapkaupunki |

**Tietovisa.** Kaupungissa, jossa on avaamaton aarre, saat arvotun kysymyksen ja neljä
vaihtoehtoa (A–D). Kysymykset liittyvät kaupungin maantietoon, kulttuuriin ja historiaan,
ja pakassa on mukana myös yleisiä Afrikka-kysymyksiä. Oikea vastaus avaa aarteen, väärästä
vastauksesta vuoro päättyy — seuraavalla vuorolla samassa kaupungissa saa uuden kysymyksen.
Sama kysymys ei toistu ennen kuin pakka on käyty läpi.

**Rahan käyttö.** Rahalla ei voi ostaa aarteita, vaan sitä tarvitaan matkustamiseen ja
vihjeisiin: 50 puntaa poistaa kysymyksestä kaksi väärää vaihtoehtoa (50:50), 100 puntaa
maksaa laivamatkan ja 300 puntaa lennon.

**Liikkuminen.** Silmäluku on askelten *enimmäismäärä* — tasalukua ei tarvita, vaan
kaupunkiin saa pysähtyä jo matkan varrella. Jos silmäluku loppuu kesken reittiä,
pysähdyt reitin varrelle. Reittiä voi vaihtaa kaupungissa, mutta kesken reitin ei saa
kääntyä takaisin. Laivareitille (sininen katkoviiva) astuminen maksaa 100 puntaa, ja
ilman rahaa laivaan ei pääse.

**Aarteet (30 kpl).** Kartalla näkyvät vain jo avatut aarteet omina kuvakkeinaan.

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
js/board.js         kaupungit, reitit ja rannikkoviivan pisteet
js/tokens.js        laattatyypit ja pinon sekoitus
js/questions.js     tietovisakysymykset kaupungeittain
js/rules.js         puhdas sääntölogiikka (siirrot, etäisyydet) — testattavissa Nodella
js/game.js          pelitila, vuorot, laattojen kääntäminen, voittoehdot
js/ai.js            bottien päätöksenteko
js/mapart.js        aarrekartan grafiikka (pergamentti, rannikko, kompassi, aallot)
js/ui.js            kartan ja paneelin piirto, tietovisa, bottien ohjaus
js/main.js          käynnistys, aloitusruutu ja pelin tallennus
sw.js               palvelutyöntekijä (offline-tuki)
manifest.webmanifest  sovelluksen tiedot kotivalikkoa varten
assets/             sovelluskuvakkeet
tools/              yhden tiedoston koonti ja kuvakkeiden generointi
tests/              node --test -testit säännöille ja kokonaiselle pelille
```

## Testit

```bash
npm test
```

Testit kattavat laudan yhtenäisyyden, siirtojen laskennan (kaupunkiin ilman tasalukua,
ei paluuta kesken reitin, laivamaksut), laattojen vaikutukset, tietovisan kulun ja
kysymyspankin eheyden, voittoehdot, tallennuksen palautuksen sekä kokonaisen bottien
pelaaman pelin päättymisen.

## Yhden tiedoston versio

```bash
node tools/build-standalone.mjs
```

Kokoaa kaiken tiedostoon `dist/afrikan-tahti.html`, jonka voi avata selaimessa
suoraan ilman palvelinta.

## Kuvakkeet

Sovelluskuvakkeet on generoitu pelin omasta rannikkoviivasta:

```bash
node tools/make-icons.mjs                                   # päivittää assets/icon.svg
node tools/make-icons.mjs --png <polku/playwright/index.mjs>  # myös PNG:t
```

Valmiit tiedostot ovat repossa, joten skriptiä tarvitaan vain kuvakkeen muuttuessa.
