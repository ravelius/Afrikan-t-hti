# Matkakirja ★

Selaimessa pelattava seikkailupeli, jonka innoittajana on klassinen Afrikan tähti
-lautapeli. Matkakirja on itsenäinen harrastusprojekti, jolla ei ole
yhteyttä alkuperäisen pelin oikeudenhaltijoihin. Ei riippuvuuksia, ei
käännösvaihetta — pelkkää HTML:ää, CSS:ää ja JavaScriptiä. Pelin ideana on
oppia ja opettaa maiden kulttuurista, arjesta ja maantieteestä kiinnostavasti.

## Tarina

Vintiltä löytyi isoisän matkalaukku: kartta vuodelta 1872, kukkarollinen
puntia ja kulunut matkakirja: *"Maailman ympäri kahdeksassakymmenessä
päivässä"*. Viimeinen sivu oli revitty kesken lauseen.

Nuori herra Fogg lähtee kirjoittamaan sen loppuun, mielellään nopeammin.
Mukana matkustaa isoisän päiväkirja vuodelta 1873: sen merkinnät ovat
vuoroin hämmentävän tarkkoja ja vuoroin toivottoman vanhentuneita, ja juuri
siitä jännitteestä pelin tarina syntyy. Piikki osuu aina Foggiin, klubiin
tai imperiumiin — ei koskaan maihin ja ihmisiin, joita matkalla kohdataan
([docs/tarina.md](docs/tarina.md), [docs/periaatteet.md](docs/periaatteet.md)).

Peli alkaa maailmankartalta: napauta kaupunkia, ja kone lentää Lontoosta
kohteeseen vanhan seikkailufilmin karttakohtauksena — punainen viiva piirtyy
koneen perässä isoisän karttalehdelle, jolla kulkevat kääntöpiirit ja himmeät
päiväkirjamerkinnät. Matka jatkuu, kun astut ulos koneesta.

## Peli pähkinänkuoressa

- **Yksinpeli ilman loppua:** vaellus alkaa maailmankartalta ja jatkuu
  porttikaupunkien kautta laudalta toiselle — mantereille, maihin ja
  kaupunkitasolle. Löytöjä voi kerätä niin kauan kuin huvittaa.
- **Kymmenen pelilautaa**, jokaisella oma pääaarre: Maailma (Magellanin
  kompassi), Afrikka (Afrikan tähti — vain täällä), Eurooppa
  (Meripihkahuoneen aarre), Aasia (Keisarin jadesinetti), Oseania
  (Eteläristin helmi), Pohjois-Amerikka (Montezuman aarre), Etelä-Amerikka
  (El Doradon aarre), Lähi-itä (Sheban kuningattaren aarre), Suomi (Lapin
  kulta) ja Istanbul (Sulttaanin timantti).
- **Afrikka on viimeistelty pisimmälle** ("Afrikka ensin"): elävät
  kahden äänen tekstit joka kaupungille, isoisän väittämät, tapahtumakortit,
  karttakysymykset, luonnoskirjan pulmat ja kartalle piirretyt maamerkit
  (Gizan pyramidit, Pöytävuori, Kilimandžaro, dhow). Muut laudat saavat
  saman käsittelyn lauta kerrallaan.
- **Aika on vastustaja, ei rangaistus:** vuoro on kuusi tuntia ja yläpalkissa
  kulkee päiväkirjan päivämäärä ("Päivä 14, ilta"). Isoisän aikataulu
  kommentoi matkaa samoilta päiviltä, ja 80 päivän ennätyksen alittamisesta
  saa kunniamerkinnän passiin — ajan loppuminen ei päätä peliä koskaan.
- **Pysähdykset vaihtelevat:** tavallisen monivalinnan rinnalla isoisän
  väittämät (totta vai tarua), karttakysymykset (mikä näistä on pohjoisin?
  mihin pääsee suoraan yhtä reittiä?) ja tapahtumakortit, joissa ei kysytä
  mitään vaan matkalla sattuu jotain pientä ja reilua.
- **Isoisän luonnoskirjan pulmat:** viisi kauniisti piirrettyä
  päättelytehtävää Afrikassa — hieroglyfiluvut, Ashantien kultapunnukset,
  xhosan naksutusmerkit, käsikirjoituksen kuunvaiheet ja karavaanin
  vesileilit. Pulmat avautuvat kerran pelissä kaupunkiin saavuttaessa ja
  varioituvat pelikerrasta toiseen: sama grafiikka, eri tehtävä.
- **Isoisä on merkinnyt paikkoja karttaansa:** aarrekaupunkiin saapuessa
  kortti näyttää paikan valokuvan ja kysyy, tutkitko paikan. Aarteet
  avataan tiedolla, ei rahalla.
- **Lue lisää:** jokaisesta Afrikan kaupungista voi avata Wikipedian
  artikkelin kuvineen suoraan pelistä (lähdemaininta CC BY-SA;
  montaasipääkuvat vaihdetaan automaattisesti yhteen valokuvaan).
- **Kaksi ääntä:** kartan päiväkirjassa vuorottelevat isoisän merkinnät
  vuodelta 1873 ja nuoren herran nykyhavainnot — yli 1000 paikkatietoa,
  Afrikassa pieniä yllättäviä arkihuomioita isojen nähtävyyksien rinnalla.
  Harvakseltaan päiväkirjasta löytyy taitettu sivu, joka vihjaa pääaarteen
  suunnasta nimeämättä kaupunkia.
- **Yli 1500 kysymystä ja väittämää** kolmella vaikeustasolla: paikan omat
  kysymykset arvotaan aina ennen laudan yleispakkaa, joten kysymys liittyy
  maahan jossa seisot. Vaikeasta kysymyksestä 100 punnan bonus; 40 punnan
  vihje, 80 punnan 50:50 ja 45 sekunnin tiimalasi auttavat pinteessä.
- **Rosvon kaksintaistelu:** rosvolaatta ei vie rahoja suoraan, vaan rosvo
  esittää kiperän kysymyksen kahdeksalla vaihtoehdolla — oikea vastaus tuo
  200 punnan saaliin, ja kolmella hevosenkengällä rosvon voi ohittaa.
- **Kokemuspisteet ja vihreä passi:** uusi kaupunki 10, uusi lauta 50,
  vaikea kysymys 25, pulma 25 ja pääaarre 100 pistettä; tietoprosentti
  kertoo osumatarkkuuden. Passi saa leiman jokaisesta laudasta, ja leimat
  säilyvät pelikertojen yli.
- **Käsin piirretyn aarrekartan ulkoasu:** pergamentti, mustepiirretty
  rannikko, kompassiruusu, maamerkit ja filmivinjetti; tekstit naksuvat
  ruudulle kuin vanhalla matkakirjoituskoneella, ja kolmiulotteinen noppa
  heitetään kartan merelle. Kartta näkyy aina kokonaan — ei raahausta.
- **Syntetisoidut äänet** kaikille toiminnoille (Web Audio, ei
  äänitiedostoja): noppa, askeleet, laiva, lento, vastaukset, paljastus.
- **Asennettava sovellus (PWA):** toimii offline, jatkaa keskeytyneen pelin
  automaattisesti, ja **Päivitä**-painike hakee uusimman version peliä
  menettämättä. Mitoitettu iPadille ja iPhonelle.

## Julkaisu puhelimeen (GitHub Pages)

Peli on staattinen sivusto, joten sen voi julkaista sellaisenaan GitHub Pagesiin.
Silloin kotivalikkoon lisätty kuvake avaa pelin kokonaan ilman selaimen palkkeja.

1. Tee reposta julkinen (ilmaisella tilillä Pages toimii vain julkisista repoista).
2. *Settings → Pages → Source: **GitHub Actions***.
3. Työnkulku `.github/workflows/pages.yml` ajaa testit, kokoaa yhden tiedoston
   version ja julkaisee sivuston osoitteeseen `https://<käyttäjä>.github.io/Afrikan-t-hti/`.
4. Avaa osoite puhelimessa ja valitse *Lisää Koti-valikkoon*.

Vaihtoehtoisesti *Settings → Pages → Source: Deploy from a branch* julkaisee valitun
haaran juuren ilman työnkulkua.

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

**Tavoite.** Löydä laudan pääaarre — Afrikassa Afrikan tähti — ja vie se
johonkin laudan aloituskaupungeista. Vaelluksessa peli ei pääty: tähti on
2000 punnan arvoinen löytö, ja matka jatkuu porttikaupunkien kautta uusille
laudoille. Isoisän 80 päivän ennätyksen alittaminen tuo kunniamerkinnän.

**Vuoron kulku.**

1. **Valitse matkustustapa.** Näkyvillä on kerrallaan vain muutama nappi:

| Tapa | Selitys |
| --- | --- |
| 🥾 Jalan | Ilmainen; lähtee heti ja heittää nopan samalla painalluksella |
| ⛵✈ Laiva & lento… | Avaa loput: laiva (100 p), lennot (300 p), portit ja tietoportit |
| 🔍 Tutki paikka | Isoisän merkitsemässä kaupungissa: kokeile liikkumatta |

   Jos vaihtoehtoja on vain yksi — esimerkiksi sisämaassa tai kesken reitin —
   noppa pyörähtää itsestään.

2. **Heitä noppa** — noppa jää lepäämään kartan merelle. Silmäluku on
   askelten enimmäismäärä: tasalukua ei tarvita, ja kaupunkiin saa pysähtyä
   jo matkan varrella. Kesken reitin ei saa kääntyä takaisin.
3. **Valitse kohde** kartalta napauttamalla.
4. **Tutki paikka**, jos saavuit isoisän merkitsemään kaupunkiin — pysähdys
   voi olla tietovisa, isoisän väittämä, karttakysymys tai tapahtumakortti.
   Sen jälkeen vuoro vaihtuu ja kello siirtyy kuusi tuntia.

**Portit.** Porttikaupungin tunnistaa katkoviivakehästä: sieltä pääsee
lennolla (300 p) toiselle laudalle. Maakohtaiset kartat (esim. Suomi) eivät
aukea rahalla vaan tiedolla — mantereen pääkaupungissa vastataan vaikeaan
kysymykseen, ja oikea vastaus avaa portin ilmaiseksi.

**Aarteet.** Jokaisessa isoisän merkitsemässä kaupungissa on yksi laatta.
Oikea vastaus kääntää laatan; väärästä vuoro päättyy ja samassa kaupungissa
saa uuden kysymyksen seuraavalla vuorolla. Laattoina ovat pääaarre,
hevosenkengät, ryöstäjät, jalokivet (arvo 300–1000 puntaa suoraan kukkaroon)
ja tyhjät — tyhjän kohdalla isoisän merkintä oli vanhentunut. Jalokivet
vaihtuvat laudan mukaan: Lähi-idässä turkoosi, Euroopassa meripihka,
Suomessa spektroliitti.

**Rahan käyttö.** Rahalla ei osteta aarteita vaan matkoja ja apuja: laiva
100 p, lento 300 p, vihje 40 p ja 50:50 80 p. Jokainen aloittaa 300 punnalla.
Rahaton ja jumiin jäänyt matkaaja saa pankilta 100 puntaa (kotisääntö, jota
alkuperäisessä pelissä ei ole).

Kartat ja reitit ovat oma tulkintamme: kaupungit on sijoitettu todellisten
koordinaattiensa mukaan ja reittien pituudet on tasapainotettu peliä varten.

## Projektin rakenne

```
index.html          runko ja dialogit
css/styles.css      ulkoasu
js/pack.js          karttapakettien rekisteri (laudat)
js/packs/           yksi paketti per lauta: kartta, kaupungit, reitit,
                    laatat, kysymykset, tekstit ja teema — Afrikalla myös
                    väittämät, tapahtumat, pulmat (africa-puzzles.js),
                    isoisän aikataulu ja wiki-otsikot
js/tokens.js        laattatyypit ja pinon sekoitus
js/rules.js         puhdas sääntölogiikka (siirrot, etäisyydet) — testattavissa Nodella
js/game.js          pelitila, vuorot, aika, laatat, pulmat ja voittoehdot
js/wiki.js          Lue lisää: Wikipedian tiivistelmä, artikkeli ja kuvavalinta
js/mapart.js        aarrekartan grafiikka (pergamentti, rannikko, maamerkit)
js/sound.js         syntetisoidut ääniefektit
js/ui.js            kartan ja korttien piirto, tietovisa, lentokohtaus
js/main.js          käynnistys ja pelin tallennus
js/ai.js            kysymysvalinnan apurit (testien käytössä; botit poistettu pelistä)
sw.js               palvelutyöntekijä (offline-tuki)
manifest.webmanifest  sovelluksen tiedot kotivalikkoa varten
assets/             sovelluskuvakkeet
tools/              yhden tiedoston koonti ja kuvakkeiden generointi
tests/              node --test -testit säännöille ja kokonaiselle pelille
docs/               tarina, periaatteet ja työlista
```

## Periaatteet

Projektin arvopohja — miksi peli on olemassa ja millä perusteilla sisältö
hyväksytään — on kirjattu tiedostoon [docs/periaatteet.md](docs/periaatteet.md).
Tarinan säännöt ja kirjoitusohjeet ovat tiedostossa [docs/tarina.md](docs/tarina.md).

## Uuden laudan lisääminen

Peli on rakennettu niin, että uusi manner tai alue on oma *karttapakettinsa* —
moottoriin ei tarvitse koskea. Ohjeet ovat tiedostossa
[CONTRIBUTING.md](CONTRIBUTING.md).

## Testit

```bash
npm test
```

Testit kattavat laudan yhtenäisyyden, siirtojen laskennan, laattojen
vaikutukset, tietovisan ja sen erikoismuotojen kulun, pulmien generoinnin,
kysymyspankkien eheyden (mm. ettei oikea vastaus lue saman laudan kartalla),
ajan kirjanpidon, tallennuksen palautuksen ja voittoehdot.

## Yhden tiedoston versio

```bash
node tools/build-standalone.mjs
```

Kokoaa kaiken tiedostoon `dist/matkakirja.html`, jonka voi avata selaimessa
suoraan ilman palvelinta (Lue lisää -toiminto tarvitsee silti verkon).

## Kuvakkeet

Sovelluskuvakkeet on generoitu pelin omasta rannikkoviivasta:

```bash
node tools/make-icons.mjs                                   # päivittää assets/icon.svg
node tools/make-icons.mjs --png <polku/playwright/index.mjs>  # myös PNG:t
```

Valmiit tiedostot ovat repossa, joten skriptiä tarvitaan vain kuvakkeen muuttuessa.

## Lisenssi

Copyright © 2026 Sami Reivinen. Kaikki oikeudet pidätetään — ks.
[LICENSE](LICENSE).

Peliä saa pelata ja lähdekoodia lukea vapaasti. Julkaisuun, levitykseen
tai omaan tuotteeseen tarvitaan lupa.

Pelin näyttämät valokuvat, äänet ja tiedot eivät ole tekijän omaisuutta:
ne tulevat Wikimedia Commonsista, Freesoundista, radio aporeesta,
Wikipediasta, Maailmanpankilta ja V-Demiltä omilla avoimilla
lisensseillään. Jokaisen lähde, tekijä ja lisenssi on merkitty pelin
sisältötiedostoihin.
