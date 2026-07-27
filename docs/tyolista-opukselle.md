# Työlista toteuttajalle (Opus)

Tämä on omistajan ja suunnittelusession sopima työlista. Tee työpaketit
järjestyksessä; jokainen paketti on oma commit/PR. Jokaisen paketin jälkeen:

```bash
npm test                        # kaiken pitää mennä läpi
node tools/build-standalone.mjs # yhden tiedoston versio kokoontuu
```

Nosta versiot molemmissa: `sw.js` (CACHE) ja `js/main.js` (APP_VERSION),
muoto `2026-07-XX.N`. Kuvakaappaustarkistus: käynnistä paikallinen palvelin
ja katso lauta oikeasti (Playwright on asennettu scratchpadiin, malli
aiemmista skripteistä; selain `/opt/pw-browsers/chromium-*/chrome-linux/chrome`).

Sävy- ja sisältösäännöt ovat tiedostoissa `docs/tarina.md` ja
`docs/periaatteet.md` — lue molemmat ennen tarinatekstien kirjoittamista.

---

## Paketti 1: pikakorjaukset (bugit ja tyyli)

1. **Tiesitkö että -laatikko näkyy aloitusnäkymässä vaikka on piilotettu.**
   `renderFact` asettaa `this.factCard.hidden = true`, mutta sisältö voi
   silti vilkkua/jäädä näkyviin (välimuistisekoitus tai CSS-display voittaa
   hidden-attribuutin). Korjaus: lisää `css/styles.css`-tiedostoon globaali
   sääntö `[hidden] { display: none !important; }` JA tyhjennä
   `factPlace`/`factText`-sisältö pickstart-haarassa (`js/ui.js`).

2. **Pyörivät punaiset renkaat ovat liian levottomat.**
   - `.target-ring`-luokassa on `animation: target-spin 6s linear infinite`
     (css/styles.css ~rivi 677). Lähtöpisteen valinnassa joka kaupungilla
     pyörii rengas → levoton. Anna pickstart-renkaille oma luokka
     (`drawTargets` js/ui.js:ssä lisää jo `picked`-luokan; lisää myös
     `pick`-luokka) ja tyyli: ei animaatiota, ohuempi viiva (2), kullan-
     ruskea sävy (`#b08a3c` tms.), täyttö pois. Siirtovaiheen renkaat
     (punaiset) saavat jäädä ennalleen — ne ovat kehotus toimia.
   - `.city-gate` (portin katkoviivakehä, ~rivi 585): kevennä
     opacity 0.72 → 0.4 ja stroke-width 2.2 → 1.6. Maailma-laudalla lähes
     joka kaupunki on portti, joten kehä on siellä melua.

3. **Tietovisan vastausruudut päivittyvät tökkien** (väärän vastauksen
   jälkeen koko lista välähtää). Syy: `renderQuiz` (ja `renderDuel`)
   tyhjentää `quizOptions` ja rakentaa napit uudelleen joka renderillä,
   jolloin `option-in`-animaatio (css ~rivi 931) toistuu. Korjaus: rakenna
   napit vain kun kysymys vaihtuu (vertaa `this.builtQuizFor !== quiz`),
   muuten päivitä olemassa olevien nappien `disabled`/`classList` paikallaan.
   Sama korjaus molempiin (quiz + duel). Varo: 50:50 piilotus ja
   correct/wrong-luokat pitää päivittää paikallaan.

4. **"AFRIKA" → "AFRIKKA"**: `js/packs/africa.js` rivi ~255
   (`mapLabel: 'AFRIKA'`). Otsikon leveys lasketaan nimen pituudesta
   automaattisesti, joten pelkkä tekstikorjaus riittää.

5. **Mantereen reunat jatkuvat ruudun yli.** Lähi-idän laudalla maa näyttää
   katkeavan mereen vasemmassa ja oikeassa reunassa, vaikka maa oikeasti
   jatkuu. Korjaus: venytä `mainlandPoints`-ääriviivaa kartan reunan yli
   (x < 0 ja x > 1000), samaan tapaan kuin Maailma-laudan
   `arcticPoints` käyttää arvoja -40 ja 1045 (js/packs/maailma.js).
   Vaalea filmivinjetti (`.map-pane::after`) hoitaa häivytyksen reunassa.
   Tee sama tarkistus muille laudoille: ainakin Aasian länsireuna (jatkuu
   Lähi-itään) ja Euroopan itäreuna kannattaa katsoa kuvakaappauksesta.
   Testit eivät estä ääriviivapisteitä kartan ulkopuolella.

6. **Aloitusdialogi pois kokonaan.** Nimi- ja tasokysely poistetaan:
   uusi peli alkaa suoraan maailmankartalta (pickstart). `js/main.js`:
   `openSetup()` → luo pelin suoraan (`startGame()`), `index.html`:
   poista `#setup`-dialogi. Nimi on aina "Herra Fogg". Helpot kysymykset
   jätetään toistaiseksi kokonaan pois: pelaaja saa aina tason 'normal'.
   ÄLÄ poista level-kenttiä kysymyspankeista eikä moottorin tukea
   (pickQuestion, testit) — taso 1 -kysymykset kuuluvat normaalipakkaan
   ja helpotustila voidaan palauttaa myöhemmin.

7. **"Vuorossa:" pois yläpalkista.** Yksinpelissä turha. `renderTurnPill`
   (js/ui.js): näytä pillerissä sen sijaan raha ja sijainti:
   `● 300 p · Lontoo`. Pidä elementti — vain sisältö vaihtuu.

## Paketti 2: kartta koko ruutuun (paitsi aloituskartta)

Kun peli on käynnissä (phase != 'pickstart'), kartta täyttää koko näytön ja
paneelit kelluvat sen päällä:

- `body`-elementtiin `data-mode="play"` / `data-mode="start"` (js/ui.js
  render() asettaa phase-tiedon mukaan).
- `play`-tilassa `.stage` on yksi sarake, `.rail` muuttuu overlayksi:
  toimintonapit alas keskelle kelluvana pergamenttikorttina, tila/raha
  ylös oikealle pieneksi pilleriksi, päiväkirja/havainto vasempaan
  alakulmaan kelluvana korttina (läpikuultava pergamentti, esim.
  `rgba(46,33,20,0.88)` + border kuten `.event-toast`).
- Aloituskartassa (pickstart) nykyinen kahden palstan asettelu säilyy.
- Kapealla näytöllä (< 700 px) overlay-kortit pinoutuvat alas.
- `fitViewBox` toimii ennallaan — pane vain kasvaa.

## Paketti 3: valintojen minimointi (kaksivaiheinen matkavalinta)

Tavoite: näytöllä mahdollisimman vähän nappeja kerralla (js/ui.js
`renderActions`, action-vaihe):

- Vaihe A näyttää enintään kolme nappia:
  1. `🥾 Jalan` — kutsuu `actionTravel('land')` ja **heittää nopan heti
     perään** ilman erillistä painallusta (`doRoll()` ketjuun).
  2. `⛵✈ Laiva & lento…` — avaa vaiheen B, jossa vasta näkyvät kaikki:
     laiva, lennot, portit ja tietoportit. UI-tila `this.travelExpanded`,
     nollataan vuoron vaihtuessa. Mukaan `↩ Takaisin` -nappi.
  3. `❓ Vastaa kysymykseen` — vain aarrekaupungissa (stay) + vaikea
     kysymys -nappi kuten nyt.
- Jos vain maareitti on mahdollinen, noppa pyörähtää suoraan (autoTravel
  tekee tämän jo — varmista että myös nopanheitto käynnistyy ilman
  painallusta; lisää asetus/harkinta: heitto saa käynnistyä automaattisesti
  vain autoTravel-tilanteessa ja Jalan-napista).
- Moottoriin ei kosketa; tämä on puhtaasti renderActions-ryhmittelyä.
- Päivitä Säännöt-dialogin "Vuoron kulku" -teksti vastaavasti.

## Paketti 4: kaksi ääntä — kerronta korvaa "Tiesitkö että" -jutut

Tämä on ison tarinapäivityksen ydin. Lue ensin `docs/tarina.md`.

**Hahmokorjaus:** matkaaja on **nuori herra Fogg**, joka on samaan aikaan
täpinöissään maailmanympärysmatkastaan ja huvittunut **isoisänsä** vanhan
matkapäiväkirjan merkinnöistä, joita hän lukee matkalla. Vanha herra ei
siis matkusta — hänen päiväkirjansa matkustaa. Päivitä `docs/tarina.md`,
aloitusteksti ja nykyiset `texts.diary`-merkinnät tähän asetelmaan
(nykyiset diary-tekstit sopivat lähes sellaisenaan nuoren ääneen tai
isoisän sitaateiksi — jaa ne oikeille äänille).

**Tietoruutu uusiksi:** "Tiesitkö että…" -otsikko ja -konsepti poistuvat.
Tilalle sama kortti kahdella äänellä, jotka vuorottelevat:

- **"Isoisän päiväkirjasta"** — vanha ääni, 1870-luku. Saa loistaa
  asioissa jotka ovat YHÄ totta (joet, vuoret, monsuuni, keskiyön aurinko,
  basaarin tuoksut) ja olla vanhentunut nimissä, rajoissa ja tekniikassa.
- **"Nuoren herran havainto"** — nykyaika: faktat, lähteet ja kuiva
  huvittuneisuus isoisän merkinnöistä. Nykyiset placeFacts-tekstit ovat
  valmiiksi tätä ääntä.

**Tietomalli:** `placeFacts`-alkio saa vapaaehtoisen kentän
`voice: 'isoisa' | 'nuori'` (merkkijono-alkio = nuori, taaksepäin
yhteensopiva). UI (`renderFact`) näyttää otsikkorivillä äänen mukaan
"Isoisän päiväkirjasta, 1873" tai "Nuoren herran havainto" ja arpoo
tekstin kuten nykyisin. `factText`/`factSource`-apurit (js/pack.js) saavat
`factVoice(fact)`-apurin. Testit: jokaisella kaupungilla oltava jatkossa
vähintään yksi kummankin äänen teksti (nosta testiä vasta kun sisältö on
kirjoitettu — tee sisältö ensin lauta kerrallaan).

**Isoisän aarrevihjeet:** isoisän päiväkirja vihjaa laudan pääaarteesta.
Toteutus: pakkaan `texts.starHints` — olio, jossa avaimena kaupunki-id ja
arvona isoisän tyylinen vihjelause, joka viittaa SUUNTAAN tai ALUEESEEN
muttei nimeä kaupunkia (esim. Afrikka: jos tähti on Timbuktussa →
"Aavikon eteläreunalla kerrottiin kaupungista, jonka kirjastot hävettivät
Oxfordia. En ehtinyt käydä. Käy sinä."). Pelimoottori: kun lauta luodaan
(`enterWorld`), `world.starCity` tiedetään — vihje nostetaan tietoruudun
kiertoon harvakseltaan (esim. joka 4. vuoro, otsikolla "Päiväkirjan
taitettu sivu"). Vihje saa kaventaa aluetta, ei paljastaa kaupunkia.
Kirjoita vihje jokaiselle laudan mahdolliselle tähtikaupungille
(= kaikki aarrekaupungit). Testi: starHints kattaa kaikki aarrekaupungit.

**Saapumismerkinnät moninkertaisiksi:** `texts.diary` (yksi merkintä) →
`texts.diaries` = LISTA saapumismerkintöjä (vähintään 4/lauta), joista
arvotaan yksi laudalle saavuttaessa (`setDiary` js/game.js — käytä pelin
`rng`:tä, jotta tallennus toistuu oikein). Muoto: isoisän sitaatti +
nuoren reaktio samassa merkinnässä toimii hyvin. Pidä vanha `diary`-kenttä
fallbackina tai muunna kaikki kerralla ja päivitä testi (nyt testi vaatii
`texts.diary`-merkkijonon — muuta vaatimaan `diaries`-listan).

**Sävyohje kaikkeen** (tarina.md:ssä, tiivistettynä): kuiva ironia aina
kun mahdollista; nostalgia ja sen osittainen romahtaminen; piikki osuu
isoisään, imperiumiin tai nuoreen herraan itseensä — ei koskaan
kohdemaihin; osa asioista muuttuu, osa pysyy — ja isoisä saa olla oikeassa
pysyvissä asioissa; faktat oikein vitsin sisälläkin, lähteet säilytetään.

## Paketti 5: sisällön moninkertaistus (EI uusia maita vielä)

Hiotaan nykyiset 10 lautaa ennen uusia. Määrätavoitteet:

- **Kysymykset:** jokaiselle aarrekaupungille vähintään **5 omaa
  kysymystä** (nyt minimi 2), joista ≥1 helppo (level 1) ja ≥1 vaikea
  (level 3). Kysymysten pitää liittyä NIMENOMAAN siihen paikkaan — ei
  yleistietoa paikan nimellä. General-pakka pysyy varapakkana (≥15/lauta).
  Nosta testien minimit (tests/rules.test.mjs: "kysymyspankki on ehjä")
  vasta kun laudan sisältö on kirjoitettu — etene lauta kerrallaan
  järjestyksessä: Maailma, Afrikka, Eurooppa, Suomi, Istanbul, sitten muut.
- **Äänitekstit:** joka kaupungille ≥1 isoisän merkintä + nykyiset
  havainnot nuoren äänellä (tarkista sävy, kevyt muokkaus riittää).
- **Saapumismerkinnät:** ≥4 per lauta (paketti 4:n muoto).
- Laatuvahdit ovat testeissä: 4 uniikkia vaihtoehtoa, fact+hint pakolliset,
  vihje ei saa sisältää vastausta, ei kaksoiskysymyksiä, lähdemuoto.
  ÄLÄ kierrä testejä — ne ovat julkaisuportti.

## Paketti 6: kokemuspisteet, tietoprosentti ja passin leimat

- **Kokemuspisteet (KP):** pelaajalle `xp`-kenttä. Ansainta:
  +10 uusi kaupunki (ensimmäinen käynti per kaupunki per maailma; pidä
  `visited`-settiä world-tilassa), +50 uusi lauta, +25 oikea vastaus
  vaikeaan kysymykseen, +100 laudan pääaarre. Näkyy pelaajapaneelissa.
  Tallennus toJSON/fromJSON (Set → lista).
- **Tietoprosentti:** laskurit `quizAsked`/`quizCorrect` (myös
  kaksintaistelut). Paneeliin esim. "Tieto 78 %". Tallennus mukaan.
- **Passin leimat (meta, oma localStorage-avain, EI pelitallenteessa):**
  vihreä passi saa leiman jokaisesta laudasta, jolla on käynyt — yli
  pelikertojen. Pieni passinäkymä (nappi yläpalkkiin, dialogi jossa
  leimat ruudukossa; leima = laudan nimi + päivämäärä + pergamenttityyli).
  Tämä on keräilyn ydin ja sopii tarinaan (vihreä passi!).
- Testit: XP-kirjanpito ja prosentin laskenta.

## Paketti 7: pelin nimi on MATKAKIRJA

Omistaja on päättänyt: pelin uusi nimi on **Matkakirja**. Vaihda nimi
kaikkialle: `index.html` (title, .brand-otsikko, meta description ja
apple-mobile-web-app-title), `manifest.webmanifest` (name, short_name),
`sw.js` (CACHE-etuliite esim. 'matkakirja-2026-XX-XX.N'), `README.md`
(otsikko ja kuvaus), `CONTRIBUTING.md`, `tools/build-standalone.mjs`
(otsikot ja tulostiedostojen nimet, esim. dist/matkakirja.html).
`SAVE_KEY` (js/main.js) pidetään ennallaan, ettei kesken olevat pelit
katoa. Hahmo pysyy herra Foggina pelin sisällä.

Tausta: nimeen ei haluttu sanaa "tähti" eikä hahmon nimeä — oma nimi on
tavaramerkkinä vahvin. Vernen Fogg-hahmo on vapaata kulttuuriperintöä
(ennakkotapaus Inklen kaupallinen 80 Days). Ennen kansainvälistä
kaupallistamista tehdään tavaramerkkihaku peliluokissa (EUIPO, 9/41).

Kun nimi on päätetty, vaihto koskee: `index.html` (title, brand, meta),
`manifest.webmanifest`, `sw.js` (CACHE-etuliite), `js/main.js`,
`tools/build-standalone.mjs` (otsikot ja tiedostonimet), `README.md`,
`CONTRIBUTING.md`. Tallennusavain (`SAVE_KEY`) voi jäädä ennalleen, ettei
kesken olevat pelit katoa.

## Muistilista jokaiseen pakettiin

- `npm test` vihreänä; uudet ominaisuudet saavat omat testinsä.
- Versionosto sw.js + main.js.
- `node tools/build-standalone.mjs` onnistuu (uudet tiedostot myös
  MODULES-listaan ja sw.js SHELL-listaan).
- Kuvakaappaus ennen/jälkeen, jos muutos näkyy ruudulla.
- Suomenkieliset commit-viestit; pienet PR:t, yksi paketti per PR.
