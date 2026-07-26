# Maailman tähdet ★

Selaimessa pelattava seikkailupeli, jonka innoittajana on klassinen Afrikan tähti
-lautapeli. Maailman tähdet on itsenäinen, avoin harrastusprojekti, jolla ei ole
yhteyttä alkuperäisen pelin oikeudenhaltijoihin. Ei riippuvuuksia, ei käännösvaihetta — pelkkää HTML:ää, CSS:ää ja
JavaScriptiä. Pelin ideana on oppia ja opettaa maiden kulttuurista, arjesta ja
maantieteestä kiinnostavasti.

- **Yhdeksän pelilautaa:** koko maapallon kattava Maailma (Maailman tähti),
  kaikki kuusi asuttua mannerta — Afrikka, Eurooppa, Aasia, Oseania,
  Pohjois-Amerikka ja Etelä-Amerikka — sekä Lähi-itä (Idän tähti) ja
  ensimmäisenä kaupunkilautana Istanbul (Sulttaanin timantti). Maailma-laudalla valtameret
  ylitetään laivalla tai lentäen, ja Lontoosta, Kairosta ja Rio de Janeirosta
  laskeudutaan tarkemmille laudoille — sama portaikko jatkuu kaupunkitasolle
  asti. Istanbul on sekä Euroopan että Lähi-idän laudalla, joten mantereelta
  toiselle pääsee myös kävellen
- **Vaellustila:** yksin pelattaessa peli ei pääty — kerää löytöjä ja siirry
  porttikaupungeista laudalta toiselle, myös kaupunkitasolle. Kilpapelin
  voittaja voi jatkaa vaeltamista voittoruudusta
- **Porttikaupungit:** jokaisella laudalla on muutama kaupunki, josta lähtee
  pitkä lento toiselle laudalle — Tangerista Madridiin, Dakarista Brasiliaan,
  Dubaista Mumbaihin. Kartalla portin tunnistaa katkoviivakehästä, ja lennon
  jälkeen karttanäkymä vaihtuu suoraan perille. Kartta itsessään on staattinen:
  koko lauta näkyy aina kerralla, eikä sitä tarvitse raahata tai zoomata
- **Rosvon kaksintaistelu:** rosvolaatta ei vie rahoja suoraan, vaan rosvo
  esittää kiperän kysymyksen kahdeksalla vaihtoehdolla — suora oikea vastaus
  tuo 200 punnan saaliin, helpotus maksaa puolet rahoista, ja kolmella
  hevosenkengällä rosvon voi ohittaa
- **Maailmankartta:** vaelluksessa lentokentältä voi lentää (300 p) suoraan
  toisen laudan aloituskentälle
- 1–4 pelaajaa samalla koneella, kukin joko ihminen tai botti
- Aarteet avataan **vain tietovisalla**: arvottu monivalintakysymys (A–D) paikan
  maantiedosta, kulttuurista ja yleistiedosta; 40 punnan vihje ja 80 punnan 50:50
  auttavat pinteessä, ja tiimalasi antaa vastausaikaa 45 sekuntia
- SVG-kartta, jossa kymmeniä kaupunkeja, maareitit, laivareitit ja lentoyhteydet
- Euroopan laudalla 34 kaupunkia Lissabonista Moskovaan ja Kreetalta Tromssaan:
  Kanaalitunneli, Itämeren lautat, Välimeren saaret ja Mustanmeren satamat
- Etelä-Amerikan laudalla 37 kaupunkia Panamasta Kap Hornille: Andien
  ylängöt, Amazonin jokireitit, Atacaman autiomaa ja Patagonian vuonot —
  Galápagos, Falkland ja Robinson Crusoen saari vain laivalla
- Oseanian laudalla 32 kaupunkia Perthistä Fidžille: punainen keskusta,
  Suuri valliriutta, Uusi-Guinea, Uusi-Seelanti ja Tyynenmeren saaret —
  laudalla on enemmän laivamatkoja kuin millään muulla
- Aasian laudalla 37 kaupunkia Teheranista Tokioon ja Jakutskista Jakartaan:
  Silkkitie, Himalaja, Siperian taiga ja trooppinen saaristo — Japani, Sahalin,
  Taiwan, Sri Lanka, Sumatra, Java, Borneo ja Luzon vain laivalla
- Pohjois-Amerikan laudalla 37 kaupunkia Nomesta Panamaan: Kalliovuoret,
  preeria, Suuret järvet ja Väli-Amerikan kannas — Grönlanti, Newfoundland,
  Kuuba, Bermuda ja Havaiji omina saarinaan. Panama ja New York yhdistävät
  laudan Etelä-Amerikkaan ja Maailma-lautaan
- Laatat: tähti, hevosenkengät, ryöstäjät, jalokivet ja tyhjät — Lähi-idässä
  topaasin tilalla on turkoosi, joka on saanut nimensä Turkista
- Yli 720 kysymystä kolmella vaikeustasolla: jokaisella kaupungilla omat
  kysymyksensä + laudan yleinen varapakka. Pelaajakohtainen tasovalinta
  (esim. lapsille helpot) ja vaikeasta kysymyksestä 100 punnan bonus
- Suomenkielinen käyttöliittymä ja "Tiesitkö että…" -tietoruutu, joka kertoo
  vuorossa olevan pelaajan sijainnista — yli 660 tietoa, vähintään kaksi
  jokaisesta kaupungista
- Käsin piirretyn aarrekartan ulkoasu: pergamentti, mustepiirretty rannikko,
  kompassiruusu, aallot ja maaston merkit — myös kysymyslaatikot ovat samaa
  pergamenttia käsin piirrettyine katkoviivoineen
- Animoitu rytmi: nappula hyppii reittiä piste kerrallaan ja tapahtumat jäävät
  hetkeksi näkyviin
- Kolmiulotteinen noppa heitetään nappulan vierestä kartan vasemman alakulman
  merelle: lento lasketaan oikealla painovoimalla, noppa kimpoaa pienenevin
  pompuin, pyörintä hidastuu ja varjo kasvaa ja haalistuu korkeuden mukaan.
  Lepopaikka on avomerellä, joten noppa ei jää nappuloiden päälle.
- Kartan yksityiskohdissa pieniä, aina samanlaisina toistuvia vaihteluita:
  reittipisteet mutkittelevat ja vaihtelevat koossa ja tummuudessa, kaupungit
  ovat aavistuksen soikeita ja nimet hitusen vinossa
- Syntetisoidut äänet kaikille toiminnoille (Web Audio, ei äänitiedostoja):
  noppa, askeleet, laiva, lento, oikea ja väärä vastaus, aarteen paljastus,
  ryöstäjä ja voitto — yläpalkin 🔊-painike vaimentaa
- Oikean vastauksen jälkeen ruudulle tulee ensin "Oikein!", tauko ja sitten
  aarteen paljastus: iso käsin piirretty laatta kääntyy 3D:nä ympäri ja näyttää
  löydön. Laatta, sen kehät, viivoitus ja taustan sädeviivat on piirretty samalla
  mustekynätyylillä kuin kartta
- Koko ruudun sovelluskehys: kaikki oleellinen näkyy kerralla, vain tapahtumaloki vierii
- **Päivitä**-painike hakee uusimman version: se tyhjentää palvelutyöntekijän
  välimuistin ja lataa pelin uudelleen kesken olevaa peliä menettämättä
- Asennettava sovellus (PWA): toimii offline ja jatkaa keskeytynyttä peliä
- Mitoitettu iPadille ja iPhonelle: sama asettelu skaalautuu, eikä mikään vaadi
  vierittämistä

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

**Tavoite.** Löydä laudan tähtiaarre — Afrikassa Afrikan tähti, Lähi-idässä Idän tähti —
ja palaa sen kanssa johonkin aloituskaupungeista (Afrikassa Tanger tai Kairo, Lähi-idässä
Istanbul tai Kairo). Kun tähti on löytynyt, myös hevosenkengän haltija voi voittaa
pääsemällä aloituskaupunkiin ensimmäisenä.

**Vuoron kulku.**

1. **Valitse matkustustapa**

| Tapa | Selitys |
| --- | --- |
| 🥾 Maitse | Ilmainen, kulkee vain maareittejä |
| ⛵ Laivalla (100 p) | Kulkee vain meriteitä; maksu peritään satamasta lähdettäessä |
| ✈ Lennä (300 p) | Suoraan toiselle lentokenttäkaupungille |
| ❓ Jää paikalleen | Aarrekaupungissa: kokeile kysymystä liikkumatta |

   Jos tarjolla on vain yksi tapa — esimerkiksi sisämaan kaupungissa tai kesken
   reittiä — se valitaan automaattisesti ja vuoro alkaa suoraan nopanheitosta.

2. **Heitä noppa** — noppa pyörii kartalla ja jää siihen lepäämään. Silmäluku on
   askelten enimmäismäärä.
3. **Valitse kohde** kartalta.
4. **Kokeile tietovisaa**, jos päädyit kaupunkiin jossa on avaamaton aarre.
   Vastauksen jälkeen vuoro vaihtuu.

**Tietovisa.** Aarrekaupungissa saat arvotun kysymyksen ja neljä vaihtoehtoa (A–D). Kysymykset liittyvät kaupungin maantietoon, kulttuuriin ja historiaan,
ja pakassa on mukana myös yleisiä Afrikka-kysymyksiä. Oikea vastaus avaa aarteen, väärästä
vastauksesta vuoro päättyy — seuraavalla vuorolla samassa kaupungissa saa uuden kysymyksen.
Sama kysymys ei toistu ennen kuin pakka on käyty läpi.

**Lentoreitit** näkyvät kartalla haalean punaisina pistekatkoviivoina.

**Tiesitkö että…** Ohjauspaneelissa näkyy tietoa siitä paikasta, jossa vuorossa oleva
pelaaja on. Reitin varrella näytetään lähempänä olevan kaupungin tieto, ja tieto
vaihtuu kierroksittain.

**Rahan käyttö.** Rahalla ei voi ostaa aarteita, vaan sitä tarvitaan matkustamiseen ja
vihjeisiin: 40 puntaa ostaa sanallisen vihjeen, 80 puntaa poistaa kysymyksestä kaksi
väärää vaihtoehtoa (50:50), 100 puntaa maksaa laivamatkan ja 300 puntaa lennon.

**Aikaraja.** Vastausaikaa on 45 sekuntia. Kysymyksen vieressä valuu piirretty tiimalasi,
jonka hiekka putoaa yläkuvusta alakupuun; viimeiset kymmenen sekuntia näkyvät punaisena.
Jos hiekka loppuu, vastaus lasketaan vääräksi ja vuoro päättyy.

**Liikkuminen.** Silmäluku on askelten *enimmäismäärä* — tasalukua ei tarvita, vaan
kaupunkiin saa pysähtyä jo matkan varrella. Jos silmäluku loppuu kesken reittiä,
pysähdyt reitin varrelle. Reittiä voi vaihtaa kaupungissa, mutta kesken reitin ei saa
kääntyä takaisin. Laivareitille (sininen katkoviiva) astuminen maksaa 100 puntaa, ja
ilman rahaa laivaan ei pääse.

**Aarteet.** Jokaisessa aarrekaupungissa on yksi laatta, ja kartalla näkyvät vain jo
avatut aarteet omina kuvakkeinaan. Laattojen määrät vaihtelevat laudoittain (suluissa
Afrikka / Lähi-itä):

| Laatta | Määrä | Vaikutus |
| --- | --- | --- |
| ★ Tähti | 1 / 1 | Vie se kotiin ja voitat |
| Ω Hevosenkenkä | 2 / 2 | Voittaa, jos ehtii kotiin ennen tähteä |
| ☠ Ryöstäjä | 3 / 3 | Vie kaikki rahat |
| ◆ Rubiini | 4 / 3 | 1000 puntaa |
| ◆ Smaragdi | 5 / 4 | 600 puntaa |
| ◆ Topaasi / Turkoosi | 6 / 6 | 300 puntaa |
| · Tyhjä | 9 / 8 | Ei mitään |

Jokainen aloittaa 300 punnalla. Jalokiven arvo lisätään heti pelaajan rahoihin.

**Kotisääntö.** Jos pelaaja on rahaton eikä pääse mihinkään tavoitteeseen ilman
laivalippua (esim. jumissa Sansibarissa), hän saa vuoronsa alussa 100 puntaa pankilta.
Tämä estää pelin lukkiutumisen; alkuperäisessä pelissä vastaavaa sääntöä ei ole.

Kartat ja reitit ovat oma tulkintamme: kaupungit on sijoitettu todellisten
koordinaattiensa mukaan ja reittien pituudet on tasapainotettu peliä varten.

## Projektin rakenne

```
index.html          runko ja dialogit
css/styles.css      ulkoasu
js/pack.js          karttapakettien rekisteri (laudat)
js/packs/           yksi paketti per lauta: kartta, kaupungit, reitit,
                    laatat, kysymykset ja teema (africa.js, middleeast.js)
js/tokens.js        laattatyypit ja pinon sekoitus
js/rules.js         puhdas sääntölogiikka (siirrot, etäisyydet) — testattavissa Nodella
js/game.js          pelitila, vuorot, laattojen kääntäminen, voittoehdot
js/ai.js            bottien päätöksenteko
js/mapart.js        aarrekartan grafiikka (pergamentti, rannikko, kompassi, aallot)
js/sound.js         syntetisoidut ääniefektit ja äänien päälle/pois-asetus
js/ui.js            kartan ja paneelin piirto, tietovisa, bottien ohjaus
js/main.js          käynnistys, aloitusruutu ja pelin tallennus
sw.js               palvelutyöntekijä (offline-tuki)
manifest.webmanifest  sovelluksen tiedot kotivalikkoa varten
assets/             sovelluskuvakkeet
tools/              yhden tiedoston koonti ja kuvakkeiden generointi
tests/              node --test -testit säännöille ja kokonaiselle pelille
```

## Periaatteet

Projektin arvopohja — miksi peli on olemassa ja millä perusteilla sisältö
hyväksytään — on kirjattu tiedostoon [docs/periaatteet.md](docs/periaatteet.md).

## Uuden laudan lisääminen

Peli on rakennettu niin, että uusi manner tai alue on oma *karttapakettinsa* —
moottoriin ei tarvitse koskea. Ohjeet ovat tiedostossa
[CONTRIBUTING.md](CONTRIBUTING.md).

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
