# Työlista toteuttajalle (Opus)

## Vakiokäynnistys

Jos saat tehtäväksi "jatka työlistaa" (tai vastaavaa), toimi näin ilman
lisäohjeita:

1. Lue tämä tiedosto kokonaan.
2. Katso TILANNE-osiosta, mikä paketti on seuraavaksi tekemättä omalla
   kaistallasi (jos kaistaa ei ole kerrottu, olet kaista A; jos kaistan A
   seuraava paketti on jo jonkun työn alla tai valmis, ota kaista B:n
   seuraava lauta).
3. Tee paketti, avaa PR, yhdistä se mainiin ja **kuittaa paketti
   TILANNE-osioon** samassa PR:ssä (✅ + PR-numero + päivämäärä; kaista B
   kuittaa lauta kerrallaan).
4. Aloita haara uusiksi tuoreen mainin päälle ja jatka seuraavaan, kunnes
   sessio on käytetty — kuittaa aina ennen lopettamista.
5. **ÄLÄ keksi uusia paketteja itse.** Jos listalla ei ole seuraavaa
   tekemätöntä pakettia, hae tuore main (`git fetch origin main`) ja lue
   tämä tiedosto uudestaan — omistaja ja suunnittelusessio lisäävät
   paketteja sitä mukaa kuin niistä on sovittu. Jos tuoreessakaan
   mainissa ei ole seuraavaa pakettia, kirjoita TILANTEEN loppuun
   havaintosi ja lopeta sessio siihen. Uudet paketit päättää omistaja.

## TILANNE

Kaikki alkuperäiset paketit ovat valmiit. Kuittaukset jäivät matkan
varrella tekemättä, joten ne on koottu tähän jälkikäteen PR-numeroiden
perusteella (27.–28.7.2026).

- Paketti 1 (pikakorjaukset): ✅ PR #16
- Paketti 2 (kartta koko ruutuun): ✅ PR #18
- Paketti 3 (kaksivaiheinen matkavalinta): ✅ PR #20
  - aloitusteksti (omistajan päättämä): ✅ PR #47
- Paketti 4 (kaksi ääntä): ✅ PR #21
- Paketti 5 (sisältö, kaista B): Maailma ✅ Afrikka ✅ Eurooppa ✅ (#28, #29)
  Suomi ✅ (#30) Istanbul ✅ (#31) Aasia ✅ Oseania ✅ (#34)
  P-Amerikka ✅ (#35) E-Amerikka ✅ (#37) Lähi-itä ✅ (#41)
- Paketti 6 (pisteet ja passi): ✅ PR #24
- Paketti 7 (nimi → Matkakirja): ✅ PR #25

Pakettien jälkeen tehty omistajan toivelistan mukaan:

- Tanger maailmankartalle ja Afrikan ympäri purjehdittava reitti: ✅ #38
- Kevyempi käyttöliittymä (paneeli, äänet, ikonit, päiväkirja merelle): ✅ #39
- Aloitustarina ja saapumiskortti: ✅ #40
- Taustalaatikot pois kartan päältä: ✅ #44
- Maailmankartta kahtena pallonpuoliskona + suora hyppy mantereelle: ✅ #45
- Paketti 8 aloitettu: avausteksti, tyylipaletti, 11 kaupungin tekstit ja
  neljä kysymyskorvausta (suunnittelusessio itse): ✅
- Paketti 8 (Afrikka ensin): ✅ #55 — 21 kaupungin havainnot uusiksi,
  21 lastenvisakysymystä korvattu, saapumismerkinnät hiottu ja koko
  laudan yhtenäistämiskierros ajettu.
- Paketti 9 (aikamittari ja isoisän ennätys): ✅ — vuoro on 6 tuntia,
  yläpalkissa päiväkirjan päivämäärä, isoisän aikataulu Afrikalle ja
  80 päivän ennätys passin kunniamerkintänä.
- Yläpalkkiin pelkkä kukkaro, siirtorenkaat hillityiksi ja vaakalukko: ✅
- Paketti 12 (luonnoskirjan pulmat ja maamerkit): ✅ (28.7.2026) — viisi
  pulmaa Afrikalle, piirrokset SVG-koodina ja neljä maamerkkiä kartalle.
- Paketti 13 (pulmien variointi): ✅ (28.7.2026) — sama pulma on joka
  pelikerralla erilainen. Kolme generatiivista (hieroglyfit, punnukset,
  kuunvaiheet) ja kaksi käsin kirjoitettua varianttisarjaa.
- Paketti 11 ("Lue lisää"): ✅ (28.7.2026) — Wikipedian tiivistelmä
  tietoruudun ja saapumiskortin napista, kaikille 32 Afrikan kaupungille
  tarkistettu artikkeliotsikko.
- Paketti 10 (kysymysten vaihtelu): ✅ (28.7.2026) — isoisän väittämät,
  karttakysymykset ja tapahtumakortit vuorottelevat monivalinnan kanssa.
  Sisältö Afrikalle: 16 väittämää ja 12 tapahtumakorttia.

## Avoimet asiat (Fablelle)

- **Paketin 12 pulmien faktantarkistus jäi tekemättä.** Käynnistin
  tarkistusagentin, mutta se ei palannut, ja paketti ehti mainiin (#72).
  Tarkistin itse laskemalla, että kaikkien viiden pulman merkitty vastaus
  on oikea (hieroglyfien yhteenlasku, vaa'an tasapaino, leilisarjat,
  kuunvaiheiden järjestys) — nämä ovat nyt myös testeissä paketin 13
  jäljiltä. **Verkkotarkistamatta ovat yhä:** xhosan naksutusäänteiden
  artikulaatiokuvaukset (c/x/q ja se, alkaako isiXhosa lateraalisella
  naksauksella), ashantien punnusten 3 %:n tarkkuusväite, ja Timbuktun
  käsikirjoitusviite (Kashf al-Ghummah, 1733, Mamma Haidara -kirjasto).
  Väitteet ovat tiedostossa js/packs/africa-puzzles.js fact-kentissä.

## Seuraavaksi: PAKETTI 13 (pulmien variointi), sitten PAKETTI 14

**Paketit 1–12 ovat valmiit (28.7.2026).** Lisäksi korjattu: pulmien
laukaisin puuttui kaikista saapumispoluista (#74). Työjono: paketti 13
(pulmien variointi), sen jälkeen paketti 14 (lentoanimaatio) — molemmat
alempana.

Toteuttajan havainnot seuraavaa pakettia varten:

- **Afrikalla on nyt viisi sisältölajia, muilla laudoilla ei yhtään:**
  `questions.claims` (väittämät), `events` (tapahtumat), `puzzles`
  (pulmat), `texts.schedule` (isoisän aikataulu) ja kaupunkien
  `wiki`-kentät. Kaikki ovat valinnaisia ja moottori toimii ilman niitä,
  joten laajennus muille laudoille voi edetä lauta kerrallaan.
- **Karttojen maamerkit ovat toistaiseksi vain Afrikalla.** `mapart.js`:n
  LANDMARKS-kokoelma on lautariippumaton, joten uusi maamerkki on yksi
  piirtofunktio ja yksi rivi pakan decor-osiossa. Koristetesti vartioi
  sijoitusta automaattisesti kaikilla laudoilla.
- **`texts.schedule` vaatii yhä päätöksen** (kirjattu paketissa 10): onko
  isoisän 80 päivää lautakohtainen vertailuluku vai yksi matka, jonka eri
  laudat näyttävät eri paloina? Afrikan aikataulu on kokonainen kierros,
  joka päättyy kotiinpaluuseen, eikä `docs/tarina.md`:n mukaan
  päiväkirjoja ole kuin yksi.
- **`TURN_HOURS = 6` odottaa yhä pelitestiä.** Yhden vakion muutos
  (js/game.js).

Omistajan linjaus 27.7.2026: **työstetään pelkkää Afrikkaa, kunnes
peruspeli on kunnossa.** Muihin lautoihin ei kosketa ennen kuin Afrikka on
valmis. Paketit 8–11 ovat valmiit; seuraavaksi tehdään paketti 12
(alempana).

Myöhemmäksi sovitut (EI vielä työn alle):

- Tyynellämerellä ei ole laivareittejä: Los Angelesista pääsee vain maitse.
  Reitti kiertäisi päivämäärärajan yli, mikä vaatisi tuen reitille, joka
  jatkuu kartan reunan yli. Odottaa omistajan päätöstä.
- Yksittäiset maat mantereiden jälkeen (Suomen mallin mukaan).
- Maailma-lauta samaan kuntoon kuin Afrikka: keskeytetyn session
  mittauksen mukaan Maailman havainnot ovat keskimäärin 92 merkkiä
  (Afrikka: 239) ja tietosanakirjamaisia. Perusteltu työ — mutta
  odottaa omistajan päätöstä siitä, milloin Afrikka-ensin-linjasta
  siirrytään eteenpäin. Keskeytetyn session luonnos on haarassa
  `claude/tyolista-p10`.
- "Vastaus lukee kartalla" -siivous muille laudoille: kysymys, jonka
  oikea vastaus on saman laudan toisen kaupungin nimi, on ilmainen.
  Afrikka on siivottu ja testi vartioi sitä (rules.test.mjs,
  VASTAUS_EI_KARTALLA). Tunnetut tapaukset muilla laudoilla: europe
  general (Istanbul), middleeast/ankara (Istanbul), suomi general
  (Helsinki), oceania general (Uluru). Korjataan kunkin laudan
  sisältöpassissa ja lauta lisätään testin settiin.
- Kysymysten vaihtelu: paketti 10 ✅ ja "Lue lisää": paketti 11 ✅
  (kuvaukset alempana; jätetty dokumentiksi).

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

## Rinnakkaiset sessiot (työnjako)

Työn voi jakaa usealle sessiolle näin — ÄLÄ poikkea jaosta, koska
paketit 1–4 ja 6 muokkaavat samoja tiedostoja (ui.js, game.js, css):

- **Kaista A (koodi):** paketit 1 → 2 → 3 → 4 → 6 → 7 tässä
  järjestyksessä, yksi sessio kerrallaan.
- **Kaista B (sisältö):** paketti 5 rinnakkain kaistan A kanssa —
  muokkaa VAIN `js/packs/*-questions.js`-tiedostoja ja pakkojen
  duels/starHints/diaries-listoja, ei koskaan js/ui.js:ää, js/game.js:ää
  eikä css:ää. Jos sisältösessioita on kaksi, jaa laudat: B1 = Maailma,
  Afrikka, Eurooppa; B2 = Suomi, Istanbul, Aasia, Oseania, Amerikat,
  Lähi-itä. Huom: paketin 4 äänimerkinnät (voice-kenttä) saa lisätä
  sisältöön vasta kun kaista A on toteuttanut paketin 4 rungon.
- Jokainen sessio omalla haaralla, pienet PR:t, merge usein; mergen
  jälkeen haara uusiksi tuoreen mainin päälle
  (`git fetch origin main && git checkout -B <haara> origin/main`).
- `npm test` vihreänä ennen jokaista mergeä. Jos main on ehtinyt
  liikkua, rebase ja aja testit uudelleen ennen mergeä.

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

**Samassa paketissa: aloitusteksti (OMISTAJAN PÄÄTTÄMÄ TEKSTI).**
Pelin avaus on kokonaan minämuodossa, kuin seikkailukirjan alku — ei
selittelyä eikä ohjeita. Avauskortissa/tietoruudussa näytetään TÄSMÄLLEEN
tämä teksti (kirjoituskoneella naksuen, kolme kappaletta):

> Vintiltä löytyi isoisän matkalaukku: kartta vuodelta 1872,
> kukkarollinen puntia ja kulunut päiväkirja.
>
> Ensimmäinen sivu: "Maailman ympäri kahdeksassakymmenessä päivässä."
> Viimeinen lause päättyy kesken.
>
> Jonkun on kirjoitettava se loppuun — ja mielellään nopeammin.
>
> Ostin lipun samana iltana. Mistä aloittaisin?
>
> Napauta kaupunkia kartalla.

(Päivitetty 28.7.2026: loppuun "Mistä aloittaisin?" ja selkeä kehote
napauttaa — etusivulla ei ollut kutsua toimintaan.)

(Päivitetty 27.7.2026 omistajan pyynnöstä: ei mainintaa Afrikasta, koska
aloituspaikan saa valita vapaasti. Isoisän 80 päivän ennätys mainitaan —
se pohjustaa tulevan aikaraja-vastustajan, joka toteutetaan Afrikan
sisällön jälkeen.)

- Tilarivi pickstartissa ilman valintaa: pelkkä "Minne ensin?"
- Kaikki muut avauksen ohje- ja lokirivit ("Peli alkaa! Etsikää…",
  "Vaellus: peli ei pääty…", "lippu on jo maksettu" jne.) poistetaan —
  sääntöasiat kuuluvat Säännöt-dialogiin.
- Kaupungin valinnan jälkeiset tekstit saavat jäädä ennalleen.
- Tekstiä ei muokata eikä jatketa ilman omistajan lupaa.

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

**Omistajan toimenpide samassa yhteydessä:** repon nimen ja kuvauksen
vaihto tehdään GitHubin asetuksissa (Settings → General → Repository
name, esim. `matkakirja`, ja About-kuvaus) — Claude ei voi tehdä sitä.
Huomio: git-osoitteet ohjautuvat vanhalla nimellä automaattisesti, mutta
GitHub Pages -osoite vaihtuu (ravelius.github.io/matkakirja/) eikä vanha
ohjaa uuteen — kirjanmerkit ja kotivalikkoon asennetut versiot pitää
avata uudesta osoitteesta. Muistuta omistajaa tästä, kun paketti 7 on
valmis.

Kun nimi on päätetty, vaihto koskee: `index.html` (title, brand, meta),
`manifest.webmanifest`, `sw.js` (CACHE-etuliite), `js/main.js`,
`tools/build-standalone.mjs` (otsikot ja tiedostonimet), `README.md`,
`CONTRIBUTING.md`. Tallennusavain (`SAVE_KEY`) voi jäädä ennalleen, ettei
kesken olevat pelit katoa.

## Paketti 8: AFRIKKA ENSIN — peruspeli kuntoon (VALMIS)

Omistajan linjaus: peruspeli hiotaan valmiiksi pelkällä Afrikalla ennen
kuin mihinkään muuhun kosketaan. **Muokkaa vain Afrikan sisältöä**
(`js/packs/africa-questions.js`, `js/packs/africa.js` texts-osiot) — ei
muita lautoja, ei js/ui.js:ää eikä js/game.js:ää tässä paketissa.

Lue ensin `docs/tarina.md` kokonaan — erityisesti uusi osio
**"Vaihtelun paletti"**. Se on tämän paketin tärkein ohje.

Suunnittelusessio on jo tehnyt (älä tee uudestaan):

- Avausteksti päivitetty (paketti 3:n sitaatti yllä on voimassa oleva).
- Lapselliset kysymykset korvattu: Tripolin manner-kysymys ja yleispakan
  gepardi/gorilla/kirahvi.
- Nuoren herran havainnot kirjoitettu uusiksi 11 kaupungille:
  tanger, kairo, sahara, timbuktu, dakar, kongo, kapkaupunki, kimberley,
  sansibar, kilimandzaro, addisabeba. **Nämä ovat mallitekstit — lue ne
  ennen kuin kirjoitat omat.**

Opuksen työt tässä paketissa:

1. **Loput 21 kaupunkia:** kirjoita AFRICA_FACTS-tietojen nuoren herran
   havainnot (merkkijonoalkiot) uusiksi vaihtelun paletin mukaan:
   tripoli, murzuk, alkufra, ahaggar, gao, sierraleone, kappalmas,
   kumasi, orjarannikko, kano, kamerun, angola, namib, mosambik,
   madagaskar, viktoria, tanganjika, bahrelghazal, darfur, suakin,
   rashafun. Isoisän merkintöihin (voice: 'isoisa') ei kosketa, paitsi
   jos fakta on väärin. Tasapainosääntö (tarina.md): kaupungin kahdesta
   tekstistä toinen saa olla iso (saapumisen huuma, mittakaava, maisema)
   ja toinen pieni ja arkinen — EI pelkkiä pikkuhuomioita. Sama
   tehokeino ei toistu vierekkäisissä kaupungeissa. Faktat pysyvät
   tosina — tarkista jokainen väite.
2. **Kysymysten aikuistarkistus:** käy Afrikan kysymyspankki läpi ja
   korvaa loputkin lastenvisailta maistuvat kysymykset arvokkaammilla
   samantasoisilla (level-kenttä säilyy, minimit testeissä: joka
   kaupungilla ≥5 kysymystä, ≥1 helppo ja ≥1 vaikea; helppo saa olla
   helppo, kunhan se ei aliarvioi aikuista).
3. **Saapumismerkinnät ja aarrevihjeet:** lue `texts.diaries` ja
   `texts.starHints` (js/packs/africa.js) vaihtelun paletin silmin —
   kevyt hionta sallittu, sävysäännöt tarina.md:ssä.
4. Aja `npm test`, nosta versiot (sw.js + main.js), standalone-buildi,
   PR ja kuittaus TILANNE-osioon.

**Rinnakkaistus (käytä alagentteja, jotta paketti valmistuu nopeammin):**

- Jaa 21 kaupunkia noin kolmeen erään ja anna kukin erä omalle
  agentille rinnakkain. Anna jokaiselle agentille tarina.md:n
  "Vaihtelun paletti" -osio kokonaan sekä valmiit 11 mallikaupunkia
  luettavaksi ennen kirjoittamista.
- Faktantarkistus rinnakkain: jokaisen tekstierän väitteet tarkistaa
  ERI agentti kuin se, joka tekstit kirjoitti. Väärä väite → teksti
  korjataan tai vaihdetaan.
- Kysymysten aikuistarkistus (kohta 2) voi kulkea omana agenttinaan
  samaan aikaan kirjoituksen kanssa.
- **Kokoa tulokset itse.** Yhtenäistämiskierrosta ei saa ulkoistaa:
  vain koko laudan kerralla näkevä huomaa tehokeinojen toiston
  vierekkäisissä kaupungeissa ja iso/pieni-tasapainon vinouman.
  Muokkaa tiedostoa vain pääsessiossa — agentit palauttavat tekstit
  vastauksenaan, eivät kirjoita tiedostoon.
- Vain yksi sessio kerrallaan muokkaa africa-questions.js:ää. Jos
  sessioita on kaksi, toinen ottaa VAIN kohdan 3 (js/packs/africa.js:n
  diaries + starHints) — eri tiedosto, ei konflikteja.

Tekstien kirjoitussäännöt (tiivistelmä — koko ohje tarina.md:ssä):
minä-muoto, 1–3 virkettä, ensimmäinen virke konkreettinen; korkeintaan
kolmasosa teksteistä alkaa isoisällä, vähintään kolmasosassa isoisää ei
mainita; piikki osuu Foggiin/imperiumiin, ei koskaan kohdemaihin.

## Paketti 9: aikamittari ja isoisän ennätys (VALMIS)

Aika on pelin vastustaja — isoisän 80 päivän ennätys — mutta se ei saa
tehdä pelistä ahdistavaa. Omistajan päätökset:

- **Vuoro = 6 tuntia.** Vakio `TURN_HOURS = 6` (js/game.js) — vain yksi
  säätökohta, koska oikea arvo varmistuu pelitestissä. Neljä vuoroa on
  yksi matkapäivä, ja vuorokaudenaika kiertää: aamu, keskipäivä, ilta,
  yö.
- **Mittari on päiväkirjan päivämäärä, ei kello eikä palkki.**
  Yläpalkin pilleriin rahan ja sijainnin rinnalle esim. "Päivä 14,
  ilta". Kirjoituskonetyyli, osa tarinaa — ei hälytysväriä.
- **Isoisän haamu näkyy vertailuriveinä.** Muutaman päivän välein
  päiväkirjaan nousee rivi isoisän aikataulusta samalta matkapäivältä
  (esim. "Päivänä 20 isoisä nousi laivaan Suezissa"). Toteutus:
  pakkaan `texts.schedule` = lista { day, text } -merkintöjä; moottori
  nostaa rivin, kun päivä ohitetaan. Sisältö kirjoitetaan Afrikalle
  ensin, muille laudoille myöhemmin — tekstit tarina.md:n säännöillä.
- **Ennätys on tavoite, EI game over.** Ajan loppuminen ei päätä peliä
  koskaan. Jos laudan pääaarre löytyy 80 päivän sisällä, passiin tulee
  kunniamerkintä ("80 päivää rikottu") ja XP-bonus; hitaammin
  matkanneelle päiväkirja toteaa kuivasti, että isoisä olisi ollut jo
  kotona — mutta isoisä ei nähnyt kaikkea tätä.
- Tallennus toJSON/fromJSON (vuorolaskuri), testit ajan kirjanpidolle
  ja vertailurivien nousulle. Vanha tallenne ilman aikaa jatkuu
  päivästä 1.

## Paketti 10: kysymysten vaihtelu (Afrikka ensin) — VALMIS

Ongelma: jokaisessa pysähdyksessä on sama neljän vaihtoehdon tietovisa,
mikä puuduttaa yksinpelissä. Ratkaisu: kolme uutta muotoa, jotka
vuorottelevat monivalinnan kanssa. Sisältö kirjoitetaan VAIN Afrikalle
tässä paketissa; muut laudat saavat omansa myöhemmin.

1. **Isoisän väittämä (totta vai tarua).** Tietoruutuun nousee isoisän
   päiväkirjamerkintä, ja pelaaja arvioi: totta vai tarua. Kaksi nappia,
   ei neljää. Data: pakkaan `questions.claims` = lista
   { q, correct: boolean, fact, source? } — isoisän äänellä kirjoitettu
   väite, joka on joko yhä totta tai vanhentunut. Tämä on tarinan ydintä:
   sama jännite (mikä muuttui, mikä pysyi) muuttuu pelimekaniikaksi.
   Vähintään 12 väittämää Afrikalle, noin puolet totta. Faktat
   tarkistetaan kuten kysymyksissä.
2. **Karttakysymys.** "Näytä kartalta: missä on X?" — pelaaja napauttaa
   kaupunkia omalla laudallaan. Oikein/väärin ratkeaa napautuksesta;
   väärästä näytetään oikea paikka. Moottoriin uusi kysymystyyppi, UI:hin
   napautustila (kaupunkirenkaat korostuvat vastausvaihtoehtoina, esim.
   4 ehdokasta). Kysymykset voi johtaa laudan omasta datasta (kaupungit,
   aarrekaupungit), joten erillistä sisältöpankkia ei välttämättä tarvita.
3. **Tapahtumakortit.** Välillä kysymyksen sijaan tapahtuu jotain:
   hiekkamyrsky viivyttää (+1 vuoro paikallaan), paikallinen festivaali
   (pieni rahabonus + tarinateksti), kyyti tutulle karavaanille (ilmainen
   siirto naapurikaupunkiin). Data: pakkaan `events` = lista
   { text, effect }, effect pidetään pienenä ja aina reiluna — tapahtuma
   ei saa koskaan viedä aarretta tai isoa summaa. Vähintään 8 tapahtumaa
   Afrikalle, tekstit tarina.md:n säännöillä.

**Vuorottelu:** moottori arpoo muodon painotetusti, esim. 60 %
monivalinta, 15 % väittämä, 10 % karttakysymys, 15 % tapahtuma — painot
vakioina, jotta niitä voi säätää pelitestissä. Sama erikoismuoto ei
toistu kahta kertaa peräkkäin. Tietoportit ja vaikean kysymyksen bonus
pysyvät aina tavallisena monivalintana (niissä panos on suurempi).
**Laudat ilman sisältöä:** jos laudalla ei ole `claims`- tai
`events`-listaa (kaikki muut kuin Afrikka aluksi), sen muodon paino
jaetaan monivalinnalle — peli toimii jokaisella laudalla ilman uutta
sisältöä, ja karttakysymykset toimivat kaikkialla koska ne johdetaan
laudan omasta kaupunkidatasta.

Testit: claims/events-rakenteiden eheys (tyhjät tekstit, faktat,
lähdemuoto), vuorottelun jakaumatesti siemenellä, karttakysymyksen
oikea/väärä-logiikka. Tallennus toJSON/fromJSON, versionostot,
standalone.

## Paketti 11: "Lue lisää" — Wikipedia-tiivistelmät (Afrikka ensin) — VALMIS

Pelaaja voi pyytää lisätietoa nykyisestä sijainnistaan: pieni
**"Lue lisää"** -nappi tietoruudun kulmaan ja saapumiskorttiin (EI
kaupungin napautukseen — napautus tarkoittaa jo siirtymistä). Nappi avaa
pergamenttityylisen dialogin, jossa on Wikipedian tiivistelmä ja kuva.

Toteutus:

- **Rajapinta:** Wikipedian REST-summary, selaimesta suoraan ilman
  avainta: `https://fi.wikipedia.org/api/rest_v1/page/summary/<otsikko>`.
  Vastauksesta käytetään `extract` (teksti) ja `thumbnail.source` (kuva).
  Jos suomenkielistä artikkelia ei ole tai `extract` on alle ~200
  merkkiä, kokeillaan samaa en.wikipedia.orgista.
- **Data:** jokaiselle Afrikan kaupungille `wiki`-kenttä pakkadataan
  (js/packs/africa.js cities): artikkelin tarkka otsikko, esim.
  `wiki: 'Kap Palmas'`. **Tarkista jokainen otsikko oikeasti**
  (rajapintakutsulla tai selaimella) — väärä otsikko antaa väärän
  paikan tai täsmennyssivun. Jos kelvollista artikkelia ei ole
  kummallakaan kielellä, jätä kenttä pois — nappi ei näy sillä
  kaupungilla. Muiden lautojen wiki-kentät lisätään myöhemmin;
  UI ja moottorituki tehdään valmiiksi kaikille.
- **Dialogi:** otsikko, kuva (max korkeus rajattu, `loading="lazy"`),
  tiivistelmä kirjoituskonefontilla, ja AINA alareunassa lähdemaininta:
  "Lähde: Wikipedia (CC BY-SA)" + linkki artikkeliin uuteen välilehteen.
  Lisenssiehto: maininta ja linkki ovat pakollisia, myös kaupallisessa
  käytössä.
- **Offline ja virheet:** peli on PWA — jos haku epäonnistuu (ei
  yhteyttä, 404), dialogissa lukee kohteliaasti "Tietoja ei saatu
  haettua. Matka jatkuu." Peli ei saa koskaan jäädä jumiin tästä.
  Ei välimuistiteta sw.js:ssä (ulkoinen alkuperä) — selaimen oma
  välimuisti riittää. Standalone-versiossa nappi toimii samoin
  (vaatii verkon).
- **Testit:** wiki-kenttä on merkkijono jos se on olemassa;
  Afrikan kaupungeista vähintään 25:llä on wiki-kenttä. Rajapintaa ei
  kutsuta testeissä — fetch-logiikka eristetään omaan funktioonsa ja
  testataan virhepolut tekaistulla vastauksella.
- Versionostot, standalone-buildi, kuvakaappaus dialogista.

## Paketti 12: Isoisän luonnoskirjan pulmat ja kartan maamerkit (Afrikka) — VALMIS

Omistajan idea: muutama erikoistehtävä, jossa **kauniisti piirretty
yksinkertainen pulma** — Verne-ajan hengessä, kuin isoisän päiväkirjaan
piirtämä kaavio. Nämä elävöittävät peliä ja tuovat päättelyä tietovisan
rinnalle. Lue ensin docs/tarina.md.

**Muoto — "Isoisän luonnoskirjasta":**

- Uusi tehtävämuoto `puzzle`: kortissa piirros (inline-SVG kartan
  mustetyylillä), isoisän käsin kirjoittama rivi ja NELJÄ
  vastausvaihtoehtoa (moottorin monivalinta kelpaa sellaisenaan —
  vastaus napautetaan, ei kirjoiteta).
- Piirrokset tehdään koodina (SVG-polut, currentColor, ohut viiva,
  viivavarjostus) tiedostoon `js/packs/africa-puzzles.js`. EI ulkoisia
  kuvia eikä verkkohakuja — standalone ja offline toimivat.
- Laukaisu: pulma avautuu KERRAN pelissä, kun pelaaja saapuu pulman
  kaupunkiin ensimmäistä kertaa (myös aloituskaupunki Kairo — siksi ei
  sidota laattaan eikä tutkimiseen). Ratkaistut pidetään pelitilassa
  (tallennus toJSON/fromJSON).
- Palkinto: oikeasta +25 XP ja isoisän tyytyväinen rivi; väärästä ei
  rangaistusta, vaan oikea ratkaisu näytetään kauniisti. Pulma ei
  koskaan estä etenemistä.
- Ulkoasu: sama pergamenttikortti kuin tietovisassa, otsikko
  "Isoisän luonnoskirjasta". Piirros ensin, kysymysrivi alla.

**Afrikan viisi pulmaa (faktat tarkistetaan, lähteet talteen):**

1. **Kairo — hieroglyfiluvut.** Egyptiläiset numerot: sauva = 1,
   kantapääluu = 10, köysikiehkura = 100, lootus = 1000. Piirroksessa
   kolme lukua hieroglyfeinä arvoineen ja neljäs ilman arvoa — pelaaja
   päättelee järjestelmän. Vaihtoehdot numeroina.
2. **Kumasi — kultapunnukset.** Ashantien messinkipunnukset ja
   kaksivartinen vaaka: vasemmalla kultahiekkapussi ja punnus,
   oikealla punnuksia — mikä punnus tasapainottaa vaa'an? Piirroksessa
   punnusten arvot näkyvissä, yksinkertainen yhteenlasku.
3. **Kapkaupunki — naksutuskielet.** Xhosan naksutusmerkit: c = kielen
   kärki hampaista (kuin paheksuva "tsk"), x = kielen sivu poskesta,
   q = kitalaesta (kuin korkin poksahdus). Piirroksessa kolme suun
   profiilikuvaa nuolineen ja merkit — mikä merkki kuuluu kuvaan X?
4. **Timbuktu — käsikirjoituksen kuunvaiheet.** Käsikirjoitussivu,
   johon on piirretty kuunvaiheiden sarja (uusikuu → kasvava sirppi →
   puolikuu → ?) — jatka sarjaa. Timbuktun käsikirjoituksissa on
   oikeasti tähtitiedettä; fact-teksti kertoo sen.
5. **Sahara — karavaanin vesileilit.** Kaksi piirrettyä leiliä, 3 ja
   5 mittaa, ja isoisän kysymys: miten mittaan tasan 4? Vaihtoehdot
   ovat lyhyitä toimintosarjoja ("Täytä 5, kaada 3:een, …").
   Klassikko, joka sopii karavaanin arkeen.

**Kartan maamerkit (js/packs/africa.js decor + js/mapart.js):**

- Pienet viivapiirrokset vanhojen karttojen tapaan — samaa tyyliä kuin
  nykyinen purjelaiva: **pyramidit** Kairon lounaispuolelle (Giza),
  **Pöytävuoren profiili** Kapkaupungin viereen, **Kilimandžaron
  lumihuippu** vuoren kohdalle ja **dhow-purjevene** Sansibarin
  edustalle.
- Maamerkit myös vihjaavat pulmista: pyramidit ↔ Kairon pulma,
  Pöytävuori ↔ Kapkaupungin pulma. Ei tekstiä karttaan — pelkkä kuva.
- Sijoitus ei saa törmätä nimiin, reitteihin eikä kaupunkeihin —
  koristetestit (decor placement) vartioivat; aja `npm test` ja katso
  kuvakaappaus.

**Testit:** pulmadatan eheys (4 uniikkia vaihtoehtoa, correct-indeksi,
fact, kaupunki on laudalla), kerran-per-peli-logiikka ja tallennus,
maamerkkien sijoitus. Versionostot, standalone, kuvakaappaus pulmakortista
ja kartasta.

## Paketti 13: pulmien variointi (Afrikka) — VALMIS

Omistajan toive: sama pulma on joka pelikerralla vähän erilainen, vaikka
se nojaa graafisesti samaan systeemiin. Piirtofunktiot saavat jo datan
parametrina (`sketchData`), joten grafiikka taipuu tähän suoraan.

**Moottori:**

- Pulma saa valinnaisen `generate(rng)`-funktion (js/packs/
  africa-puzzles.js), joka palauttaa `{ sketch, q, options, correct }`
  — `openPuzzle` kutsuu sitä pelin omalla rng:llä, jos se on määritelty;
  muuten käytetään staattisia kenttiä kuten nyt. `fact`-selite pysyy
  aina samana (se on tarkistettu fakta).
- Determinismi: generointi tapahtuu VAIN avaushetkellä pelin rng:llä,
  ja avattu pulma tallentuu quiz-tilassa kuten nyt — tallennettu peli
  jatkuu täsmälleen samasta pulmasta.

**Generatiiviset pulmat (arvotaan joka peliin):**

1. **Hieroglyfit:** arvotaan kolme esimerkkilukua ja kysytty luku.
   Rajat: jokainen numero 0–3, jotta glyfirivit pysyvät lyhyinä ja
   piirrettävinä; kysytty luku ei saa olla sama kuin mikään esimerkki.
   Väärät vaihtoehdot: numeroiden permutaatiot ja ±10/±100-virheet —
   ei satunnaislukuja, vaan uskottavia lukuvirheitä.
2. **Kultapunnukset:** arvotaan punnussarja (esim. 1, 2, 5, 10 mithqalin
   yhdistelmiä) ja pussin paino niin, että täsmälleen yksi tarjolla
   oleva punnus tasapainottaa vaa'an. Piirros näyttää arvot.
3. **Kuunvaiheet:** arvotaan aloitusvaihe ja suunta (kasvava/vähenevä);
   kahdeksan vaihetta antaa kymmeniä sarjoja. Vaihtoehdot piirretään
   kuunvaiheina, ei sanoina — piirtofunktio osaa tämän jo.

**Käsin kirjoitetut variantit (arvotaan valmiista):**

4. **Naksutusmerkit:** kolme varianttia — kysytään vuoroin c, x tai q,
   ja suuprofiilien järjestys vaihtelee.
5. **Vesileilit:** 2–3 valmiiksi kirjoitettua tavoitetta (4, 2 ja 1
   mittaa) toimintosarjavaihtoehtoineen. Jokainen tarkistettu käsin —
   toimintosarjojen generointi koneella tuottaisi kömpelöä kieltä.

**Testit:** generointi on siemenellä deterministinen; sadalla siemenellä
jokainen generoitu pulma tuottaa 4 uniikkia vaihtoehtoa, correct-indeksi
osuu oikeaan ja hieroglyfiluvut pysyvät piirtorajoissa; kymmenellä
siemenellä syntyy vähintään kaksi erilaista tehtävää per pulma
(variointi todella varioi). Versionostot, standalone, kuvakaappaus.

## Paketti 14: Indiana Jones -lentoanimaatio (paketin 13 jälkeen)

Omistajan toive: kun lennetään, pieni lentokone liitää punaista
reittiviivaa pitkin kohteesta toiseen kuin vanhoissa seikkailufilmeissä,
ja matkan aikana nuori herra sanoo jotain innostunutta ja jännitystä
uhkuvaa kohteesta riippuen.

**Animaatio (js/ui.js + css, EI kosketa js/game.js:ään):**

- Lentokonesymboli kulkee reittiviivaa pitkin lähtökaupungista
  kohteeseen ja punainen viiva piirtyy koneen perässä
  (SVG: getPointAtLength + stroke-dashoffset, rAF; kesto ~2 s;
  kone kääntyy kulkusuuntaan).
- Koskee kolmea lentoa: kartan sisäiset lennot (`actionFly`),
  porttilennot toiselle laudalle (`actionGateway` — animaatio ehtii
  lähtölaudalla ennen laudan vaihtoa) ja **pelin aloitus** (pickstart:
  kone lentää Lontoosta valittuun kohteeseen maailmankartalla ennen
  mantereelle siirtymistä — tämä on se filmihetki, joka avaa pelin).
- Puhtaasti kosmeettinen UI-kerros: pelitila päivittyy kuten ennenkin,
  animaatio näytetään ennen näkymän vaihtoa. `prefers-reduced-motion`
  ohittaa animaation kokonaan. Äänenä nykyinen 'flight'-ääni.
- Animaation aikana kelluva rivi nuorelta herralta kirjoituskoneella.

**Lentorepliikit (tarina.md:n säännöillä, innostunut ääni):**

- Data: pakkaan `texts.flightLines = { cityId: [rivejä] }` +
  `texts.flightDefault = [yleisiä rivejä]` — arvotaan pelin rng:llä.
  1–2 virkettä, minä-muoto, saapumisen jännitys ja odotus. Esim.
  tyyliin: "Siivet kallistuvat ja alla aukeaa Sahara — meri ilman
  rantaa." tai "Kartanlukija sanoi kaksi sanaa: pidä kiinni."
- **Osa riveistä hehkuttaa isoisän päiväkirjaa** (omistajan toive):
  nuori herra selaa kirjaa lennolla ja innostuu siitä, mitä sinne on
  kirjattu — merkittyjä paikkoja, taitettuja sivuja, piirroksia ja
  vihjeitä. Nämä rivit saavat viitata pelin oikeisiin asioihin
  (isoisän merkitsemät kaupungit, luonnoskirjan kaaviot, päiväkirjan
  taitetut sivut) muttei paljastaa mitään täsmälleen. Esim. tyyliin:
  "Selasin kirjaa koko nousun ajan: tälle sivulle isoisä on piirtänyt
  vaa'an ja perään kolme huutomerkkiä." tai "Kirjanmerkkinä on
  taitettu sivu — sillä lukee vain: 'etelään, ja kysy kalastajilta'."
  Suhde noin puolet ja puolet: kohteen odotus / kirjan hehkutus.
- Kirjoitetaan Maailma-laudalle (kaikki lentokohteet) ja Afrikalle
  (porttikaupungit) — muut laudat saavat yleisrivit toistaiseksi.
  HUOM: tämä on ainoa kohta, jossa Maailma-laudan tekstejä saa
  muokata ennen sen omaa sisältöpassia — vain flightLines-lisäys.
- Testit: flightLines-rivien eheys (pituus > 20, uniikkius,
  kohdekaupunki on laudalla), arvonta siemenellä deterministinen.
  Animaatiosta kuvakaappaus.

## Muistilista jokaiseen pakettiin

- `npm test` vihreänä; uudet ominaisuudet saavat omat testinsä.
- Versionosto sw.js + main.js.
- `node tools/build-standalone.mjs` onnistuu (uudet tiedostot myös
  MODULES-listaan ja sw.js SHELL-listaan).
- Kuvakaappaus ennen/jälkeen, jos muutos näkyy ruudulla.
- Suomenkieliset commit-viestit; pienet PR:t, yksi paketti per PR.
