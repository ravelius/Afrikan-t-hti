# Muistiinpanoja Fablelle

Omistaja ja Opus kävivät pelin läpi 31.7.2026, kun Fablen kreditit olivat
lopussa. Tähän on kirjattu havainnot ja ideat, jotta ne eivät katoa ennen
kuin työ jatkuu Fablella.

**Tämä ei ole työlista.** Paketit päättää omistaja ja ne kirjataan
`docs/tyolista-opukselle.md`:hen. Nämä ovat raakoja havaintoja ja ideoita,
joista osa kelpaa paketiksi sellaisenaan ja osa vaatii vielä päätöksen.

Merkinnät:

- **[Omistaja]** = omistajan havainto tai idea, ei Opuksen tulkintaa.
- **[Opus]** = toteuttajan havainto koodista tai sisällöstä.

---

## 1. Luonnoskirjan pulmat ovat liian kryptisiä

**[Omistaja]** Pulmakortin kuvat ovat vaikeaselkoisia, ja itse kysymystä on
vaikea ymmärtää. Omistaja huomasi tämän pelatessa (Kumasin vaakapulma).

**[Opus]** Vika on toteutuksessa, ja tunnistan sen omakseni — piirsin nämä
paketissa 12. Kaksi erillistä ongelmaa, jotka kannattaa korjata yhdessä:

**Kuva ei kerro, mitä siinä katsotaan.** Vaakapulmassa on kolmio,
vinoneliö ja katkoviivalaatikko, joiden vieressä on pieniä numeroita.
Mikään ei kerro, että ne ovat punnuksia tai että vaa'an kuuluisi
tasapainottua. Kultahiekkapussi ja sen luku ovat eri riveillä, joten ei
ole selvää kummalle puolelle luku kuuluu. Sama vaiva on kuunvaiheissa:
pallot näkyvät, mutta tehtävä ei — pelaajan pitäisi itse oivaltaa, että
kyse on sarjasta, jota jatketaan.

**Kysymysteksti on tarinaa, ei tehtävää.** Rivi on isoisän ääntä
("Kauppias punnitsee kultahiekkaa messinkipunnuksilla, joiden arvot hän
tuntee ulkoa"), mikä sopii sävyyn mutta ei kerro, mitä pelaajan pitää
tehdä. Hieroglyfipulma on selkein juuri siksi, että kolme esimerkkiriviä
opettavat järjestelmän ilman sanoja.

Korjausehdotuksia, joista omistaja valitsee:

- Piirrokseen selitteet: sana "punnukset" oikean vadin yläpuolelle,
  "kultahiekka" pussin viereen, ja luvut isommiksi ja punnusten sisään
  eikä alle.
- Kysymysrivin perään yksi lyhyt tehtävärivi eri tyylillä, esim.
  *"Mikä punnus tasapainottaa vaa'an?"* — isoisän ääni jää kortin
  otsikoksi, tehtävä sanotaan suoraan.
- Kuunvaiheissa vastausvaihtoehdot kuvina sanojen sijaan. Tämä oli jo
  paketin 13 ohjeessa (*"vaihtoehdot piirretään kuunvaiheina, ei
  sanoina"*), mutta jäi tekemättä: se vaatii SVG:n vastausnappeihin,
  eikä `syncOptions` tue sitä vielä. Nyt vastaukset ovat sanoja kuten
  "kasvava kupera kuu", mikä vaatii sanaston tuntemista itse ilmiön
  sijaan.
- Pulmakortti voisi kertoa, että väärästä vastauksesta ei rangaista.
  Nyt sen tietää vasta vastattuaan, joten kryptinen kuva tuntuu
  isommalta riskiltä kuin on.

**[Opus]** Sivuhuomio samasta kortista: 50:50 näkyy pulmissa. Se ei ole
bugi vaan päätös — `js/game.js` `actionFiftyFifty` sanoo suoraan, että
*"pulma ratkaistaan itse" oli liian ankara*. Jos linjaus on muuttunut,
muutos on yksi ehto sekä moottorissa että `js/ui.js`:n
`quizFifty.hidden`-rivillä.

---

## 2. Löydöt, jotka eivät ole rahaa — taikalasit

**[Omistaja]** Löydettäviä asioita voi olla muutakin kuin rahaan
vertautuvia. Tämä on kirjattu jo aiemmin alustavasti jonnekin.

**[Omistaja] Idea: taikalasit.** Laukusta löytyvä esine, jolla kartan
päällä näkee eri asioita. Laseja on erilaisia, ja kukin näyttää oman
kerroksensa:

- **Väestölasit** — väestöjakauma kartalla visuaalisesti.
- **Kielilasit** — puhutut kielet.
- Lisää keksitään myöhemmin.

**[Opus] Mitä tämän tueksi on jo olemassa.** Idea on halvempi kuin
miltä kuulostaa, koska data on suurelta osin repossa:

- `js/packs/africa-maatiedot.js` sisältää 27 Afrikan maalle väkiluvun,
  pinta-alan, demokratiaindeksin ja tulotason — sijalukuineen,
  selityksineen ja lähdelinkkeineen. Väestölasit saisivat lukunsa tästä
  suoraan.
- Kaikilla laudoilla on jo kaksi valinnaista kerrosmekanismia, joita
  taikalasit voisivat käyttää mallina: kartan maamerkit
  (`mapart.js` LANDMARKS) ja äänimaisemat.
- Löytöjen tallennus on olemassa: laukku ja passin leimat säilyvät
  pelikertojen yli omassa localStorage-avaimessaan.

**[Opus] Mikä puuttuu ja mikä maksaa.** Yksi tekninen este kannattaa
tietää etukäteen:

`js/packs/africa-borders.js` on **115 rajaviivaa, ei suljettuja
maapolygoneja**. Kartalla ne piirretään katkoviivoina
(`mapart.js` drawLand). Maiden värittäminen kartalla (choropleth)
vaatisi suljetut alueet, eli rajadata pitäisi rakentaa uusiksi tai
johtaa polygonit viivoista. Se on paketin kokoinen työ yksinään.

Halvemmat esitystavat, jotka toimivat nykyisellä datalla heti:

- **Pisteet kaupunkien kohdalla** — ympyrän koko kertoo väkiluvun.
  Kaupunkidata on jo kartalla, joten tämä on lähinnä piirtofunktio.
- **Kaupunkirenkaiden väri** — sama idea värillä kokojen sijaan.
- **Rajaviivojen paksuus tai väri** — toimii nykyisillä viivoilla,
  vaikkei täytä alueita.

Kielilasit vaativat uuden datan: `maatiedot`-tiedostoissa ei ole
kielitietoa. Se on sisältöpaketti, ei koodipaketti.

**[Opus] Miksi lasit ovat enemmän kuin tietoruutu.** Kolme perustetta,
jotka kannattaa pitää mielessä toteutusta suunniteltaessa:

- **Ne siirtävät oppimista kartalle.** Nyt kaikki tieto on korteissa ja
  dialogeissa; kartta kertoo vain missä paikat ovat. Lasit tekisivät
  kartasta itsestään tietolähteen.
- **Ne antavat syyn palata laudalle.** Kun tähti on löytynyt, laudalla
  ei ole enää mitään. Myöhemmin löytyvät lasit antaisivat aiheen katsoa
  vanha lauta uusiksi.
- **Yksi laseista on pelin oma teema.** Ks. isoisän lasit alla.

**[Opus] Lisää lasi-ideoita** (keskusteltu omistajan kanssa 31.7.2026;
omistaja piti näitä hyvinä, mutta valinta on yhä tekemättä):

- **Isoisän lasit** — kartta sellaisena kuin se oli 1873: vanhat nimet,
  siirtomaarajat, silloiset reitit. Tämä on koko pelin jännite (mikä
  muuttui, mikä pysyi) käännettynä karttakerrokseksi. Tähän asti se on
  elänyt vain teksteissä, joissa isoisä väittää ja nuori herra korjaa.
  Vahvin ehdokas ensimmäiseksi lasiksi.
- **Vesilasit** — joet, järvet ja se, missä vettä on ja missä ei.
  Afrikassa tämä selittää melkein kaiken muun: asutuksen, karavaanit ja
  Niilin vihreän viivan keskellä hiekkaa.
- **Yölasit** — kartta pimeänä ja valot päällä. Näyttää yhdellä
  silmäyksellä, missä on kaupunkeja ja missä ei.
- **Kauppalasit** — mitä mistäkin liikkui: suola etelään, kulta
  pohjoiseen. Sopii isoisän aikaan ja selittää, miksi kaupungit ovat
  siellä missä ovat.
- **Korkeuslasit** — vuoret ja tasangot. Selittää Addis Abeban kahden
  kilometrin korkeuden ja lumen päiväntasaajalla.

Näistä isoisän lasit, kauppalasit ja korkeuslasit tulevat toimeen
nykyisellä datalla tai pienellä sisältölisäyksellä. Vesilasit vaativat
jokidataa (kartalla on jo järviä) ja yölasit kaupunkien kokoluokat.

**[Opus] Kaksi kysymystä, jotka kannattaa päättää ennen toteutusta:**

1. Ovatko lasit löytö vai ostos? Jos ne löytyvät laatan alta, ne
   kilpailevat aarteiden kanssa; jos ne ostetaan, niillä on hinta ja
   ne muuttavat pelin taloutta.
2. Ovatko lasit pysyviä vai lautakohtaisia? Passin leimat säilyvät
   pelikertojen yli, laatat eivät — lasit voisivat olla kumpaa vain,
   ja se ratkaisee, mihin ne tallennetaan.

---

## 3. Ruudunpäivitys — korjattu Afrikalla, AVOIN muilla laudoilla

**[Opus]** Omistaja huomasi, että lento- ja noppa-animaatiot tökkivät.
Mittasin syyn Playwrightilla (PR #211): kartan päällä oli jatkuvia
elementtejä, jotka pakottivat suodatetun kartan piirtymään uudelleen joka
kehyksellä. Peli pyöri **15 fps:llä koko ajan**, myös kun mitään ei
tapahtunut.

Neljä korjausta tehty: rakeisuus laataksi ja liikkuvien kerrosten alle,
sykähdys vaikenee isojen animaatioiden ajaksi, nopan varjon sumennus
vakioksi, kohderenkaiden hehku pois. **Nopanheitto 15 fps → 60 fps.**

**AVOIN: korjaus ei päde kaikkiin lautoihin.** Mittasin nopanheiton
jokaisella laudalla neljästi, mittausjärjestys sekoitettuna. Tulokset ovat
täysin toistettavia — sama lauta antaa saman luvun joka kerta:

| Lauta | Nopanheitto |
|---|---|
| Afrikka, Oseania, Maailma, Istanbul, Lähi-itä | **60 fps** |
| Pohjois-Amerikka | 15 fps |
| Suomi, Etelä-Amerikka, Aasia, Eurooppa | 12 fps |

**Syy ei ole tiedossa.** Se EI ole:

- kartan monimutkaisuus — Oseania (12 ääriviivaa, 199 pistettä) on nopea,
  Etelä-Amerikka (6 ääriviivaa, 156 pistettä) hidas
- solmumäärä — kaikilla 366–667 solmua, ei korrelaatiota
- maiden rajat tai `countryShapes` — Afrikalla on molemmat ja se on nopea,
  Euroopalla `countryShapes` ja se on hidas
- kohina mittauksessa — luvut toistuvat neljästi identtisinä

En arvaa syytä. Seuraava askel olisi ottaa yksi hidas lauta (Suomi on
pienin, 2 ääriviivaa ja 50 pistettä) ja poistaa siitä kerroksia yksi
kerrallaan, kunnes fps hyppää — sama menetelmä, jolla `.grain` löytyi.

**Huom.** Omistajan mukaan vain Afrikka on sisällöltään ja toiminnoiltaan
valmis, ja Eurooppa on seuraavana työn alla. Hitaat laudat ovat siis
kaikki keskeneräisiä, joten korjaus ei ole kiireinen — mutta se kannattaa
tehdä ennen kuin Eurooppa viimeistellään, ettei sama vika jää sinne.

### 3b. Lentokohtaus on yhä hidas — AVOIN

**[Omistaja]** "Esim yksinkertainen lento animaatio tökkii. Kone ei mene
tasaisesti vaikka on yksinkertainen juttu."

**[Opus]** Mittasin lentokalvon Afrikalla (sama lauta, jolla noppa pyörii
60 fps:llä), viisi toistoa per rivi:

| Kokoonpano | fps |
|---|---|
| ennen: ei sumennusta, rakeisuus päällä | 15 |
| **nyt: sumennus + rakeisuus piilossa** | **15** |
| ei sumennusta, rakeisuus piilossa | 20 |
| sumennus + rakeisuus päällä | 12 |

Eli lento pyörii **15–20 fps:llä eikä sitä ole korjattu.** Sumennus
maksaa 5 fps, rakeisuuden piilotus tuo 3 takaisin; verkkoon meni siis
sumennus ilman että nopeus huononi entisestään.

**Mikä EI ole syy** (jokainen mitattu erikseen, ei vaikutusta):

- kone (`display:none` koneelle → yhä 12 fps)
- reittiviivan `stroke-dashoffset`-animaatio
- kartan piilottaminen kalvon alta kokonaan
- potkuriääni

Kone ja reittiviiva lentävät jo WAAPI-animaatioina eivätkä rAF-silmukalla,
ja reitti on esilaskettu taulukkoon — nekään eivät auttaneet. Jäljelle jää
sama selittämätön 12–20 fps:n katto kuin hitailla laudoilla (kohta 3
yllä). **Veikkaan että kyse on samasta viasta**, ja jos se löytyy, se
korjaa molemmat. Sen etsiminen on oma pakettinsa.

## 4. Tutki-ikkuna: rakenne yhteinen, sisältö lautakohtainen

**[Opus]** Omistaja kysyi, päivittyvätkö Tutki-ikkunan muutokset kaikkiin
lautoihin. Vastaus on kaksijakoinen:

**Rakenne on yhteinen.** Yksi `<dialog id="arrival-dialog">`
(`index.html`) ja yksi `openArrival` (`js/ui.js`). Asettelun, tyylin,
nappien ja logiikan muutokset näkyvät kaikilla laudoilla heti.

**Sisältö on lautakohtaista, ja siinä on vain kaksi lautaa.** `js/ui.js`
rivit 38–47:

```js
const SAAPUMISTEKSTIT = { africa, europe };
const KULTTUURIT      = { africa, europe };
const VALOKUVAT       = { africa, europe };
const MAATIEDOT       = { africa, europe };
```

Muut kahdeksan lautaa saavat tyhjän kortin: ei maatietoja, ei
kulttuurilohkoa, ei vanhaa ja uutta valokuvaa. Tiivistelmät
(`OMAT_TIIVISTELMAT`) ja artikkelit ovat vielä kapeampia — vain Afrikalle.

Käytännössä: ulkonäkömuutos riittää tehdä kerran, sisältölaajennus on
lauta kerrallaan (rivi noihin neljään tauluun plus oma datatiedosto).

## 5. Commonsin kuvat eivät ole luotettavia — korjattu 1.8.2026

**[Omistaja]** Kaksi havaintoa pelatessa: osa Tutki-ikkunan kuvista ei
lataudu, eikä kielinäytteiden perässä näy lippua.

**[Opus]** Kaksi eri syytä, molemmat korjattu versiossa 112.

**Liput jäivät pois, koska Commons rajoittaa pyyntösarjoja.** Liput
haettiin suoraan Commonsista (`Special:FilePath/...?width=40`).
Saapumiskortti näyttää niitä neljä kerralla, ja mittauksissa Commons
alkoi vastata **429 (liikaa pyyntöjä)** heti muutaman peräkkäisen
haun jälkeen. Latausvirhe poisti lipun kortilta kokonaan, joten
puuttuminen näytti sisältöpuutteelta vaikka oli verkkoasia.

Korjaus: kaikki 36 lippua ovat nyt repossa (`assets/liput/`, yhteensä
148 kt), haettu `tools/fetch-flags.mjs`:llä, ja niitä käytetään uuden
`lippuUrl`-funktion kautta samaan tapaan kuin valokuvia. Samalla
poistettiin `loading="lazy"` — se jätti liput dialogin sisällä
toisinaan lataamatta kokonaan.

**Yksi galleriakuva oli kuollut Commons-tiedosto.**
`Fishing boats on Lake Victoria.jpg` (käsin valittu Victoria-järven
galleria) palauttaa 404 — tiedosto on nimetty uudelleen tai poistettu.
Korvattu toimivalla (`Fishing on lake Victoria 01.jpg`).

**Yleisempi opetus.** Käsin valitut Commons-tiedostonimet vanhenevat
ilman varoitusta. Siksi karuselli pudottaa nyt latausvirheen saaneen
kuvan listalta ja näyttää seuraavan (`pudotaRikkiKuva` `js/ui.js`:ssä)
sen sijaan että jäisi rikkinäisen kuvan merkkiin.

**Kaikki kiinteät kuvat siirrettiin repoon.** Omistaja kysyi, voisiko
wikikuvat ladata talteen. Kyllä — ja se tehtiin: pelissä on 117
kiinteää kuvaviittausta, joista 80 oli jo repossa; loput 41 haettiin
(`tools/fetch-photos.mjs`, 13 Mt). Nyt `assets/valokuvat` on 38 Mt ja
kattaa kaikki kiinteät viittaukset. Yksikään niistä ei enää voi hajota
Commonsin muutoksista.

**Mikä jäi Commonsin varaan.** Tutki-ikkunan "Lue lisää" -galleria hakee
kuvalistan Wikipedian rajapinnasta ajossa: lista riippuu artikkelista ja
muuttuu kun Wikipedia muuttuu, joten sitä ei voi ladata etukäteen
kattavasti. Service worker tallettaa ne omaan koriinsa ensimmäisen
katselun jälkeen. Jos ne halutaan lukita, se on oma päätöksensä: peli
lakkaisi seuraamasta Wikipediaa.

**Service workerin asennus tehtiin kestäväksi.** `cache.addAll` on
kaikki-tai-ei-mitään, ja välimuistiin menee nyt yli 80 Mt (äänet 41 Mt,
kuvat 38 Mt). Yksikin katkennut lataus olisi kaatanut koko asennuksen.
Nyt koodi ja tekstit haetaan yhtenä eränä ja media yksitellen niin, että
yksi virhe ohitetaan.

## 6. Nopan varjo — kokeiltiin kynää, jäätiin tavalliseen

**[Omistaja]** "Saisiko nopalle voimakkaamman varjon kun se on laudan
päällä. Nyt näyttää kelluvalta." Sitten: "Saisiko nopan varjosta
lyijykynällä tehdyn näköisen kuin sarjakuvissa?" Ja lopulta: "Vaihda
nopan varjo normaaliksi, eli ei käsin piirretyksi."

**[Opus]** Kelluminen johtui geometriasta, ei väristä: varjoellipsi oli
tasan nopan kokoinen ja vain 5 px siirtynyt, joten kuutio peitti sen
kokonaan. Varjo on nyt leveämpi, matalampi ja `margin-top`illa nopan
alareunan alle, jolloin se kurkistaa esiin. **Tämä korjaus jäi voimaan —
se oli varsinainen vika**, ja pelkkä värin tummentaminen ei olisi
auttanut lainkaan.

Kynäviivoitus tehtiin ja poistettiin omistajan pyynnöstä (v.112 → v.115).
Jos joku palaa siihen: viivoja pitää olla vähän ja ne paksuja, koska
kuvio piirtyy vain 45–75 pikselin levyisenä — ensimmäinen versio 35
ohuella viivalla näytti harmaalta udulta, ei kynänjäljeltä. Toteutus ja
generaattori löytyvät PR:stä #212 (`tools/make-die-shadow.mjs`).

**Yksi asia jäi voimaan pysyvästi:** varjossa ei ole blur-suodinta
lainkaan. Pehmeys tulee liukuvärjäyksestä, ja suodin maksoi joka
kehyksellä — se oli osa nopanheiton 15 → 60 fps -korjausta.

## 7. Euroopan viisi kaupunkia valmiiksi — 1.8.2026

**[Omistaja]** "Pystyisitkö jatkamaan ne viisi kaupunkia Euroopassa
loppuun mitkä jäivät fablen sessiossa kesken? Älä kuitenkaan generoi
puhe ääniä."

**[Opus]** PR #199 lisäsi Eurooppaan kuusi uutta kaupunkia (Venetsia,
Marseille, Granada, Krakova, Sarajevo, Islanti) ja PR #210 vei niistä
vain Venetsian täydelle tasolle. Loput viisi ovat nyt samalla tasolla.

**Mitä jokainen kaupunki sai:** saapumisteksti + isoisän nosto, kolme
kulttuurinostoa kuvineen ja kulttuurivisa, vanha/uusi valokuvapari,
maan tunnusluvut, maan rajat ja minikartta, omat artikkelit
kaupungista ja maasta sekä `wiki`-kenttä.

**Puheluennat jätettiin generoimatta** omistajan ohjeen mukaan. Se
vaati pienen korjauksen: saapumiskortti näytti kaiutinnapin aina,
myös kun ääntä ei ollut. Nyt `SAAPUMISLUENNAT` (js/ui.js) kertoo,
mille kaupungeille luenta on olemassa — sama tapa kuin
`VIHJELUENNAT` ja `HAVAINTOLUENNAT`. **Kun luennat generoidaan, lisää
avaimet siihen settiin**, muuten nappi ei ilmesty.

**Kaksi työkalua syntyi matkalla:**

- `tools/europe-countries.mjs` — Natural Earthin 50m-polygonit Euroopan
  projektioon. Harvennus skaalautuu maan kokoon: kiinteä sietoraja söi
  Bosnian muodon läiskäksi (14 pistettä), nyt se on 51 pistettä.
  Samalla Italian rajat uusittiin, joten Sisilia ja Sardinia ovat
  vihdoin mukana.
- `tools/fetch-photos.mjs` — hakee kaikki kiinteät Commons-kuvat repoon
  (ks. kohta 5).

**Kaksi asiaa, jotka kannattaa tietää seuraavia kaupunkeja varten:**

1. **Islanti on samalla kaupunki ja maa.** Sen takia sama esittely
   näkyi kortilla kahdesti vierekkäin. `openArrival` jättää nyt
   maapalstan esittelyn pois, jos kaupungin ja maan artikkeliavain on
   sama. Sama koskisi St. Helenaa, jos Afrikkaan lisätään maatiedot.
2. **Islanti on kartalla väärässä paikassa tarkoituksella** (oikeasti
   lännempänä kuin lauta ulottuu). Siksi maan rajaa ei voi projisoida
   suoraan: `icelandPoints` ja `EUROPE_COUNTRY_SHAPES.ISL` ovat sama
   oikea ääriviiva sovitettuna siihen laatikkoon, jossa saari laudalla
   on. Jos saarta siirretään, molemmat pitää siirtää yhdessä.

**Avoinna:** Euroopassa on 34 kaupunkia, joista kuudella on nyt täysi
sisältö. Loput 28 odottavat. Yhden kaupungin työ on karkeasti: viisi
kuvaa (haku + lisenssitarkistus on hitain vaihe), maan tunnusluvut
kolmesta lähteestä, maan rajat työkalulla ja noin 3 000 merkkiä
kirjoitettua tekstiä.

## 8. Muutosloki (lyhyt)

Omistajan pyyntö 1.8.2026: kirjaa muutokset lyhyesti sitä mukaa kuin
niitä tulee. Yksi rivi per muutos, uusin ylimpänä.

Versiot 135–139 jäivät kirjaamatta tähän taulukkoon. Ne ovat kuitenkin
kuitattuina `docs/tyolista-opukselle.md`:n TILANNE-osiossa: peilikerros ja
media-repo, Euroopan 29 puuttuvaa kaupunkia ja 20 maata, kuvien
tekijämerkinnät, Astu mantereelle -napin korjaus ja ylävalikon siivous.

| v | Muutos |
|---|---|
| 162 | **Seitsemän liian hiljaista äänitettä hoidettu, ja taustataso pudotettu** (omistajan pyynnöt). Ratkaisu ei ollut sama kaikille: **kolme korvattiin**, koska niiden laji olisi jäänyt yhden ainoan vaihtoehdon varaan (vuoristo/ylänkö, satama, metsä) — uudet ovat aporeesta: Alppilaidun (Reit im Winkl, CC BY-SA, dynamiikka vain 2,1 dB eli erinomainen taustaksi), Kalasatama (Sassnitz, CC BY-SA) ja Linnut metsässä (Thuin, CC BY). **Neljä poistettiin**, koska niiden lajissa oli 5–6 muuta kelvollista (savanni, aavikko ×2, nopan tehoste). Uusi `tools/etsi-korvaajat.mjs` hakee aporeesta, tarkistaa lisenssin (ND pois, koska peilattu ääni leikataan) ja **mittaa ehdokkaan heti samalla mittarilla** — ilman sitä toistaisimme saman virheen ja huomaisimme vasta pelissä että uusikin on liian hiljainen. **Hakuansa:** pelkkä `savanna` osuu Illinois'n Savannaan ja `alpine` Tennesseen Alpine Driveen, koska aporeen otsikot ovat paikannimiä; savannihaku piti tehdä nimenomaisilla Afrikan seuduilla, ja silloinkin osumat olivat haastatteluja eivät luontoääntä — siksi poisto eikä korvaus. **Taustataso -30 → -33 LUFS** omistajan pyynnöstä; se on koko kerroksen ainoa säädin, ja yksi luku siirtää kaikki 120 äänitettä yhdessä suhteita muuttamatta. **Hajonta 49,8 → 3,8 dB.** Mittaus erotettiin `tools/mittaa-selaimessa.mjs`:ään, jotta tasaus ja haku käyttävät varmasti samaa mittaria. Se mittaa nyt myös **sisäisen dynamiikan** (1,6…18,7 dB otoksessa): se on eri asia kuin äänitteiden välinen tasaus ja vastaa omistajan kompressointikysymykseen — juuri iso sisäinen vaihtelu saa äänitteen hyppäämään kertojan päälle vaikka keskitaso on oikea. |
| 161 | **Taustaäänet tasattu mittaamalla, ja väistö kattaa vihdoin kaikki äänet** (omistajan kaksi havaintoa). **1) Väistö oli vajaa:** `vaimennaTausta()` vaimensi vain nauhoitetun taustan, kun pelin oma syntetisoitu äänimaisema (`js/sound.js` AMBIENCES) jäi soimaan täydellä voimalla näytteen ja kertojan päälle. Siitä omistaja kirjoitti: "Kuuntele kieltä kohdassa muut äänet voisi vaimentaa taustalta." Nyt `sfx.vaimennaAmbienssi()` väistää syntetisoidun maiseman samalla kertoimella, ja kerroin jää talteen — kesken näytteen vaihtuva maisema ei enää nouse täyteen voimaan. Tietovisan musiikki väistyy samoin. **2) Tasaus mitattiin, ei arvattu.** Kertoimet oli asetettu korvakuulolta yksi kerrallaan, eikä korva muista edellistä äänitettä. Mitattu hajonta oli **49,8 dB** eli noin 300-kertainen ero hiljaisimman ja kovimman välillä — se selittää havainnon täysin. Uusi `tools/mittaa-aanet.mjs` purkaa jokaisen äänitteen Chromiumissa `decodeAudioDatalla` (sama polku jolla peli soittaa, joten mittaus vastaa kuultua) ja laskee BS.1770:n tapaan K-painotetun tason: ylähyllykorotus 1500 Hz ja ylipäästö 38 Hz, sitten portitettu tehollisarvo 400 ms:n lohkoissa. **Pelkkä RMS ei kelpaa:** meri ja tuuli ovat bassovoittoisia ja saisivat liian ison lukeman, jolloin ne jäisivät pelissä liian hiljaisiksi — juuri se vika jota korjataan. Hajonta 49,8 → **17,8 dB**, 124 äänitettä, 183 kohtaa tiedostossa. **Ylärajan sanelee ketju, ei maku:** tausta soi tasolla `VOIMA(0.14) * voima` ja HTML-soittimen volume ei ylitä ykköstä, joten yli 7,1:n kerroin vain leikkautuisi ja kaksi eri kerrointa soisi samalla tasolla; katoksi 6. **Seitsemän äänitettä (-47…-63 LUFS) ei yllä tavoitteeseen ylärajallakaan** — ne on parempi vaihtaa kuin vahvistaa, koska niiden oma kohina nousisi kuuluviin ennen sisältöä. Lista on `tools/aanitasot.json`:ssa. **Ansat matkalla:** Playwrightin ffmpeg on riisuttu build ilman mp3-dekooderia (siksi selain); ämpärin CORS sallii vain pelin oman osoitteen, joten tavut haetaan Nodessa ja välitetään base64:nä; ja `page.evaluate` ei välitä argumenttia jos funktio annetaan merkkijonona. |
| — | **Vanha maailma yhdeksi kartaksi, vaihe 1** (omistajan päätös: vaihtoehto B). Peliin ei koskettu — tämä on työkalu `tools/vanha-maailma.mjs` ja todiste että yhdistäminen onnistuu. **Miksi uusi projektio:** laudat on litistetty pallolta eri tavoin (Eurooppa, Afrikka, Lähi-itä lieriöllä kukin omalla mittakaavallaan, Aasia Lambertin kartiolla 105°E), eikä kahta eri tavalla litistettyä karttaa voi asettaa vierekkäin — rannikot menisivät saumassa ristiin. **Miller valittiin,** koska alue ulottuu Kapkaupungista Tromssaan: kartio ei kata kumpaakin pallonpuoliskoa, plate carrée venyttäisi Skandinavian levälleen ja Mercator (aikakauden oma projektio!) paisuttaisi Lapin mahdottomaksi 78°:ssa. **Koordinaatteja ei tarvinnut arvata:** lautojen x/y kääntyy takaisin pakettien alkukommenttien kaavoilla, ja Aasialla on alkuperäinen lon/lat tallessa. **Rannikot piirretään Natural Earthista** (10m, public domain) — omistaja arvasi tarpeen oikein, Afrikassa oli 93 pistettä koko mantereelle kun Euroopassa on 1340; nyt 3743 pistettä 33 rannikolla, karsittuna 443 000:sta niin että niemet säilyvät. **Tulos:** 4000×2620 lauta, 143 kaupunkia, ja päällekkäisiä porttikaupunkeja löytyi kolme (Istanbul, Kairo, Teheran). Esikatselussa jokainen kaupunki osuu paikalleen ja mantereet liittyvät saumatta. Tekemättä: reitit, 143 nimen paikat, päällekkäisten sisällöt, pelilogiikka ja suorituskyky. |
| 160 | **Zoomipainikkeet kartalle** (omistajan toive: "universaalit zoomipainikkeet kaikille alustoille"). Ennen lähikuvaan pääsi vain automaattisesti, vain Euroopassa ja vain alle 700 px:n ruudulla; tietokoneella zoomia ei ollut lainkaan. Kiinteä `MANNER_ZOOM = 2.3` korvattiin portaikolla `[1, 1.5, MANNER_ZOOM, 3.4, 5]`. Ensimmäinen porras on kokonäkymä, ja `MANNER_ZOOM` on portaissa mukana, jotta automaattinen saapumiszoom osuu portaalle eivätkä painikkeet hyppää ensin väliin. **Tärkein yksityiskohta:** keskipiste luetaan käänteisluvulla **ennen** tason vaihtoa ja annetaan `zoomKohteeksi` — muuten kartta karkaisi laudan keskelle joka painalluksella. Mitattu: keskipiste pysyi 483,515–516:ssa kaikkien portaiden läpi. Kokonäkymästä lähennettäessä kohdistetaan pelaajan nappulaan. Painikkeet toimivat kaikkialla, koska `mannerZoomTarpeen()` rajaa vain automaattizoomia ja `fitViewBox` katsoo pelkkää `mannerZoom`-lippua; testi vartioi ettei painikefunktio ala kysyä automaattizoomin ehtoja. Napit kartan oikeassa reunassa pystyssä — alalaita on matkustusnappien käytössä ja ylälaidassa on kortti. Todennettu selaimessa 402×874 ja 1280×800. |
| 159 | **Meri katosi kartalta — syy löytyi ja on korjattu.** v158:n arvaus oli väärä; omistajan kuvakaappaus ratkaisi asian. Kuvassa oli tallella kaikki paitsi maa, rannikko, meren kaiut ja aallot — **täsmälleen ne kerrokset, joilla oli suodatin** (`#rough`, `#rough-soft`). Ruudukko, kaupungit, nimet ja koristeet näkyivät normaalisti. Suodatin tarvitsee oman piirtopuskurin, jonka koko seuraa kerroksen rajauslaatikkoa ja zoomia; mannerkerros on kartan suurin ja lähikuvassa sen puskuri on moninkertainen. iOS:n webapp-tila vapauttaa taustalle jääneen sovelluksen puskurit eikä ilmeisesti saa tuota kokoa enää varattua — kerros palaa tyhjänä. Omistaja arvasi itse oikein: "peli webapin puolella, veikkaan että liittyy siihen". **Korjaus:** heilunta piirretään pisteisiin (`kohina`, `kasinPiirretty`) eikä lasketa suodattimella, jolloin puskuria ei tarvita lainkaan. Kohinan solu 58 yksikköä ja amplitudi ±4 vastaavat vanhan suodattimen `baseFrequency 0.017` / `scale 8` -arvoja. Vertailukuva ennen/jälkeen: rannikko heiluu käytännössä samalla tavalla. v158:n `herataPiirto` poistettiin — se ei auttanut, koska ongelma ei ollut vanhentunut viite vaan puuttuva puskuri. **Ansa matkan varrella:** poistin ensin `#rough-soft`-määrittelyn, vaikka reittikerros viittasi siihen yhä — SVG:ssä puuttuvaan suodattimeen viittaava ryhmä **ei piirry lainkaan**, joten se olisi vienyt kaikki reitit kartalta. Määrittely jäi, ja uusi testi vartioi ettei viittaus voi jäädä orvoksi. Reittikerros pitää suodattimensa: se näkyi kuvassa oikein, ja ilman suodatinta suorista reittiviivoista tulisi viivoittimella vedettyjä. |
| — | **Peilaus käynnistyy nyt itsestään** (omistajan toive: "tee sinä peilaus aina automaattisesti"). Kolme käynnistintä: push mainiin kun muutos koskee `js/packs/**`, peilaustyökalua tai ajoa itseään; viikkoajo su 04:15 UTC (poimii tiedostot joiden lähde oli poikki edellisellä kerralla); ja yhä käsin, jolloin voi valita yhden lajin. Tiedoston vanha kommentti kielsi pushista ajamisen "koska ajo kestää kymmeniä minuutteja" — se pätee vain ensimmäiseen ajoon: mitattu kierros valmiilla ämpärillä **56 s**. **Automatisointi paljasti piilevän vian:** `inputs.lajit` on tyhjä muusta kuin käsiajosta, ja askeleen vertailu olisi silloin ohittanut kaikki lajit — ajo olisi mennyt läpi **vihreänä peilaamatta mitään**, mikä on pahempi kuin punainen, koska se näyttää siltä että aineisto on kunnossa. Korjattu kahdesti: oletus `${{ inputs.lajit \|\| 'kaikki' }}`, ja askel laskee ajetut lajit ja kaatuu jos luku on nolla. |
| — | **Peilausajo ei nähnyt R2-salaisuuksia, ja se selvisi vasta kokeilemalla.** Omistaja ilmoitti lisänneensä avaimet, joten ajoin `peilaa.yml`:n ensimmäistä kertaa pelirepossa: kaatui 16 sekunnissa virheeseen `Invalid endpoint: https://.r2.cloudflarestorage.com`. Lokissa `AWS_ACCESS_KEY_ID` ja muut olivat **tyhjiä** — GitHub näyttää olemassa olevan salaisuuden muodossa `***` (kuten viereinen `token: ***`), joten tyhjä tarkoittaa ettei sitä ole. Avaimet olivat media-repossa, jossa `r2-media.yml` oli ajettu onnistuneesti samana aamuna; **salaisuudet ovat repokohtaisia eivätkä seuraa mukana**, kun työnkulku siirretään toiseen repoon. Ajo tarkistaa nyt kaikki neljä nimeä heti alussa ja kertoo mikä puuttuu ja mistä se lisätään. **Opetus: siirretty työnkulku ei ole valmis ennen kuin se on ajettu kerran uudessa kodissaan** — pelkkä tiedoston kopiointi näyttää valmiilta molemmissa päissä. |
| — | **Manifestitesti ohittui hiljaa, nyt se ajetaan peilauksessa.** `tests/media.test.mjs` vertaa pelin polkusäännön koko manifestiin, mutta ohitti itsensä jos manifestia ei ollut koneella — eli aina paitsi sillä koneella, jolla media-repo sattui olemaan levyllä. Repon poiston jälkeen se ei olisi ajettu enää koskaan. Manifesti etsitään nyt ensisijaisesti kansiosta `media/` (johon peilausajo noutaa ämpärin sisällön), ja ajossa on askel joka ajaa testin heti noudon jälkeen. Todennettu oikealla manifestilla: 576 tiedostoa, 13/13 testiä läpi, **0 ohitettua**. Työkalujen oletuskansio `--ulos` osoittaa samaan `media/`-kansioon (ennen `../Matkakirja-media`), ja se on `.gitignoressa`. |
| — | **Yhdistämismerkit jäivät molempiin dokumentteihin** v158:n käsin selvitetyssä ristiriidassa (`<<<<<<< HEAD`, `=======`, `>>>>>>> origin/main`). Sisältöä ei kadonnut — vain merkkirivit jäivät tekstin sekaan. Poistettu kummastakin. |
| 158 | **Kartan herätys taustalta paluun jälkeen, ja uusi peli tyhjentää muistit.** Omistajan havainto: meri katoaa kartalta silloin tällöin, useimmiten kun välissä on käyty toisessa ohjelmassa tai peli on päivittynyt. Karttaa ei piirretä uudelleen kesken pelin, joten kyse ei ole piirrosta vaan siitä että **jo piirretty kerros lakkaa näkymästä**. Meren tuntu syntyy suodatetuista kerroksista (rannikon kaiut, aallot, maasto), ja iOS voi palauttaa juuri ne tyhjinä vapautettuaan taustalle jääneen sovelluksen piirtopuskurit. `visibilitychange`- ja `pageshow`-tapahtumissa suodatinviite irrotetaan ja liitetään takaisin, mikä mitätöi selaimen tallettaman tuloksen — pelkkä uudelleenpiirron pyytäminen ei riitä, koska selaimen mielestä mikään ei ole muuttunut. **En pysty todentamaan että tämä parantaa vian**, koska en saa sitä toistettua; todennettu vain että herätys ajetaan, ei kaada mitään eikä muuta kerrosten määrää (5 → 5). **Uusi peli tyhjentää nyt kaikki muistit** (omistajan toive): talletukset, välimuistit ja palvelutyöntekijän, ja hakee sivun uutena. Varmistus on pakollinen — passin leimat ja laukun tavarat ovat pelin ainoa pysyvä kertymä. Avaimet poistetaan etuliitteellä (`matkakirja`, `afrikan-tahti`) eikä `localStorage.clear()`:llä, joka veisi muidenkin sovellusten tiedot samasta selaimesta. Voittoikkunan Uusi peli aloittaa kuten ennen eikä tyhjennä mitään. |
| 157 | **Kiikaritehoste ilmestyi kesken pelin — korjattu.** Omistaja valitsi laivamatkan Ateenassa, kartta zoomasi uudelleen ja perään syttyi kiikari, joka kuuluu vain etusivulle. Syy: `asennaPanorointi`in kartta-napautuksen kuuntelija kutsui `zoomaaAloituskartta()`:a millä tahansa laudalla. Euroopassa `fitViewBox` palaa mannerzoomin haarasta eikä ehdi nollata `aloitusZoom`-lippua, joten `aloitus-zoom`-luokka jäi bodyyn ja kiikari syttyi ~4 s myöhemmin. Afrikassa vika ei näkynyt, koska siellä `fitViewBox` kulkee nollaavan haaran läpi — siksi tämä oli piilossa näin pitkään. Ehto on nyt `this.game.pack.id !== 'maailma'`. **Sivuvaikutus, joka korjautui samalla:** kuuntelija on kaappausvaiheessa ja pysäyttää tapahtuman, joten se söi mantereella kartan kohderenkaiden napautukset. **Testausopetus:** `?lauta=xxx` avaa katselutilan, jossa `zoomTarpeen()` ja `mannerZoomTarpeen()` palauttavat aina false — kaikki aiemmat Playwright-ajoni olivat siinä tilassa eivätkä olisi voineet paljastaa tätä. Toisto vaati `ui.katselu = false` ja `ui.reducedMotion = false`. |
| 156 | **Vaalea vinjetti pois mantereen lähikuvasta joka sivulta** (omistajan toive). Kokonäkymässä häivytys rajaa laudan kuin vanhan filmin ruudun, mutta lähikuvassa kartta jatkuu joka suuntaan panoroitavaksi — silloin vaalea reuna ei rajaa mitään, se vain haalistaa sitä osaa karttaa, jota ollaan katsomassa. `body.manner-zoom .map-pane::after` liitettiin samaan opacity: 0 -sääntöön kuin zoomausliuku ja kiikari, joten häivytys palaa itsestään kokonäkymään. Mitattu lähikuvassa: vasen reuna 203 → 180, oikea 202 → 178, keskusta muuttumaton (177). Ylä- ja alakaista muuttuvat vain vähän, koska niissä ovat päiväkirjakortin taustavalo ja nappien omat levyt — ne kuuluvatkin näkyä. |
| 155 | **Kehittäjätila versionumeron perään, matkakirjan ikkuna matalammaksi** (molemmat omistajan toiveita). Kehittäjätilasta kertoi oma merkki kartan yläreunassa; se oli liian iso ele pienelle asetukselle. Nyt nurkassa lukee `v155 : kehittäjä`, ja merkki sekä sen tyyli on poistettu. Nurkan teksti päivittyy `paivitaVersioKulma()`:lla käynnistyksessä ja kytkimen molemmissa haaroissa. **Matkakirjan ikkuna:** viisi riviä vei kartalta liian ison palan puhelimella, joten näkyviä rivejä on nyt kolme ja kortin katto 30 → 22 dvh. Kortti 126 → **86 px** kiinni; auki levitettynä 221 px ja koko merkintä näkyvissä kuten ennen. Rivikatto on em-mittana, joten se seuraa fonttikokoa. |
| 154 | **Oikea syy alalaidan haalistumaan löytyi: nappien alle piirretty pergamenttivalo.** Omistaja jouduttiin korjaamaan kahdesti ("korjaatkohan nyt väärää asiaa"), ja hän oli oikeassa. Etsin haalistumaa `.map-pane::after`-vinjetistä, mutta syy oli `body.manner-zoom .turn-card::before` — lähikuvassa korttien alle piirretään pehmeä valo, jotta teksti erottuu kartalta. Nappien kohdalla se haalisti kartan alalaidan, jossa on eniten katsottavaa. **Miksi en nähnyt sitä:** omat renderöintini eivät olleet lähikuvassa, joten valoa ei ollut piirretty lainkaan — omistaja pelaa aina lähikuvassa. Mittasin vasta kun pakotin `zoomaaMantereelle()`:n päälle. Nappien valo poistettu; alakaistat 187 → 175 ja 222 → 187, eli kartan oman sävyn (176–180) tasolle. Päiväkirjakortti pitää omansa: siinä on pitkä leipäteksti, joka ei olisi luettavaa pelkän tekstivarjon turvin. **Opetus:** kun omistaja sanoo ettei korjaus purrut, tarkista ensin että testiympäristö on samassa tilassa kuin hänen — ei sitä, onko korjaus teknisesti oikea. |
| 153 | **Vinjetti oikeasti pois, napit pienemmiksi, kehittäjätilan renkaat piiloon.** v152:n vinjettikorjaus näytti oikealta Chromiumissa mutta **ei purrut iPhonella** (omistaja: "vinjetti ei lähtenyt pois"): soikea vinjetti oli yritetty peittää `mask-image`illa. Nyt vinjetti rakennetaan **kolmesta reunaliu'usta** (ylä, vasen, oikea) yhden soikion sijaan — alalaitaan ei piirretä mitään eikä maskia tarvita, joten tulos on sama joka selaimessa. Mitattu kartan pinnasta: alakaista 176 → 169 (keskusta 171, eli alalaita on nyt keskustan tasolla), yläkaista 198 → 210 eli filmimäisyys säilyi. **Opetus:** älä korjaa piirtoa maskilla, jos saman voi tehdä itse piirrolla — maskituki vaihtelee selaimittain, eikä Chromium paljasta sitä. Matkustusnapit 77×44 → **58×40 px** (omistaja pienensi kahdesti). 40 px on alle Applen 44 pisteen suosituksen, mutta napit ovat erillään eikä vieressä ole muuta napautettavaa. Kehittäjätilassa **kohderenkaita ei enää piirretä** (omistajan toive): 41 rengasta kerralla peitti kartan. Napautusalue on näkymätön `.target-hit`, ja yläreunan merkki kertoo tilan olevan päällä. |
| 152 | **Vinjetti pois kartan alalaidasta ja päiväkirjan fontti takaisin** (molemmat omistajan toiveita). Vaalea vinjetti (`.map-pane::after`) haalisti alalaidan, jossa on eniten kaupunkeja ja nimiä ja jonka päällä kelluvat napit istuvat — siellä se näytti haalistumalta eikä filmiltä. Peite häivytetään nyt pois alaneljänneksessä `mask-image`illa, joten muut reunat säilyvät eikä rajaa näy. Mitattu kartan pinnasta ennen ja jälkeen: alakulmat 185 → 172 (vinjetti poissa), yläkulmat ja keskusta muuttumattomat. **Päiväkirjan teksti palautettiin v148:n koroituksesta takaisin** (0,78 rem puhelimella, 0,84 kapealla, 0,9 muualla): isolla fontilla kortti peitti kartasta liian ison kaistan. Merkintäkortti 155 → 126 px kiinni, ja koko merkinnän saa yhä auki napauttamalla. v148:n testi vaati fontilta vähintään 0,95 remiä — se korvattiin vinjettitestillä. |
| 151 | **Alalaidan napit alemmas ja kapeammiksi** (omistajan toive). Kehittäjätilan mittarivi ratkaisi myös v148:n arvoituksen: asennetussa sovelluksessa `window.innerHeight` on **812**, vaikka `screen.height` on **874**. Kotipalkin kaista jää siis kokonaan sovelluksen alueen ulkopuolelle, eikä siihen yllä mikään css. Kartta päättyy 805:een eli 7 pisteen päähän sovelluksen alarajasta — v148 teki jo kaiken minkä pystyi, ja loput 62 pistettä ovat iOS:n. **Sen sijaan `env(safe-area-inset-bottom)` osoittautui vääräksi mitaksi kelluville korteille:** se raportoi 34 px alueesta, joka ei ole näkymässä lainkaan, eli varaus laski saman tilan kahdesti ja söi napeilta 27 pistettä. Nyt `.rail`, `#versio-kulma` ja `.palaute-kulma` käyttävät kiinteää rakoa. Matkustustavan napit olivat puhelimella pelkkiä kuvakkeita mutta venyivät silti ruudun levyisiksi: nyt 77 px leveitä ja keskellä (`grid-auto-columns: minmax(0, 4.8rem)`), korkeus pysyy 44 pikselissä sormea varten. Rajaus koskee vain yhden rivin matkustusvalintaa, jotta tekstinapit (Astu mantereelle, Takaisin) säilyttävät tilansa. **Huom:** v147:n testi vaati `.rail`-säännöltä turva-aluetta — se oli oletus, jonka mittaus kumosi, ja testi on käännetty päinvastaiseksi. |
| 150 | **Koko peili omaan ämpäriin, media-repo tarpeettomaksi.** Omistajan päätös: "Siirrä kaikki että voi poistaa." Kuvat (320), liput (83) ja manifesti seurasivat ääniä Cloudflare R2:een, ja `PEILI_JUURI` osoittaa nyt samaan juureen kuin `AANI_JUURI`. Juuria on silti kaksi vakiota: kuvat ja äänet voi tarvittaessa erottaa taas eri palvelimille, ja katkaisija erottaa lajit polusta (`peilinLaji`) eikä juuresta. `sw.js`:n kuvavälimuisti tunnistaa ämpärin päätteestä `.r2.dev` eikä koko nimestä, jotta sama sääntö kestää oman verkkotunnuksen. **Peilausputki muutti pelirepoon:** `.github/workflows/peilaa.yml` noutaa ämpäristä nykyisen aineiston, ajaa `tools/peilaa-media.mjs` lajeittain ja vie tuloksen takaisin — peilattua aineistoa ei säilytetä missään repossa. Työkalu ajetaan laji kerrallaan, jotta tekstihaku jää pois; osittainen ajo säilyttää muiden lajien merkinnät manifestissa (todennettu paikallisesti: `--vain liput` latasi 83 lippua eikä koskenut 320 kuvan ja 173 äänen merkintöihin). **Vaatii omistajalta:** samat neljä R2-salaisuutta pelirepon Actions-asetuksiin — ilman niitä työnkulku ei voi ajaa. **Rajoite:** koko aineisto kulkee nyt `pub-….r2.dev`-osoitteen kautta, jonka Cloudflare sanoo olevan nopeusrajoitettu kehitysosoite; oma verkkotunnus on se kunnollinen ratkaisu, ja se muuttaisi vain `R2_JUURI`-vakion. |
| 149 | **Kehittäjätila** (omistajan toive). Hampurilaisvalikkoon kytkin salasanan (5545) taakse: kytkettynä minkä tahansa kaupungin laatan napautus vie sinne suoraan, jolloin sisältöä voi katsoa ilman pelaamista. Kartan yläreunassa merkki, ettei tila unohdu päälle. `game.actionKehittajaSiirto` ei ota rahaa, ei kuluta päivää, ei heitä noppaa eikä vaihda vuoroa, ja jättää voittotarkistuksen väliin — tähtikaupunkiin hyppääminen ei saa lopettaa peliä kesken tarkastelun. `visitCity` kutsutaan silti, koska juuri se tuottaa saapumisen havainnon päiväkirjaan. Pelin alussa ensimmäinen napautus menee tavallista tietä (`actionPickStart`), koska lähtöpaikan valinta avaa portin mantereelle. Salasana on koodissa selkokielisenä tarkoituksella: kevyt lukko vahingossa avaamista vastaan, ei tietoturvaa. **Ikkunassa on myös ruudun mitat** — asennetussa sovelluksessa kartan alle jää yhä selittämätön kaista (v148), eikä iOS:n turva-alueita voi mitata muualta kuin laitteelta; css kirjoittaa `env()`-arvot `:root`-muuttujiin `--turva-yla` ja `--turva-ala`, joista JavaScript ne lukee. Tila säilyy omassa localStorage-avaimessaan eikä kuulu pelin tallennukseen. |
| 148 | **Päiväkirjan teksti isommaksi ja kartta alas asti** (omistajan havainto iPhonelta, kuvakaappaus). Merkinnän teksti oli puhelimella 0,78 rem — pelin pisin luettava teksti kutistuneena kuvatekstiksi. Nyt 0,98 rem puhelimella ja kapealla ruudulla, 1 rem muualla; rivikorkeus 1,35 → 1,45. Viiden rivin ikkuna lasketaan em-mittana, joten kortti kasvaa mukana eikä tekstiä katoa. **Kartta ulottuu nyt ruudun alareunaan:** `body[data-mode] .stage` varasi alle `env(safe-area-inset-bottom)` verran tilaa, jotta kotipalkki lepäisi tummalla kehyksellä. Kuvakaappauksesta mitattuna kartta loppui 789 pt:n kohdalle 874 pt:n ruudulla — 85 pt hukkaan. Alakehys on nyt sama kapea rako kuin sivuilla ja kartta jatkuu kotipalkin alle; pergamentilla ei ole siellä mitään napautettavaa, ja kelluvat kortit pysyvät turva-alueen yläpuolella omilla säännöillään (`.rail`, `#versio-kulma`). **Huom:** en pystynyt selittämään koko 85 pistettä pelkällä turva-alueella (34 pt) — laskelmien mukaan siitä jäi ~50 pt selittämättä, enkä voi mitata iOS:n env()-arvoja täältä. Uusi sääntö poistaa `env()`-riippuvuuden kokonaan siitä kohdasta, joten alarako on nyt kiinteä `var(--gap)` riippumatta siitä mitä laite ilmoittaa. Jos rakoa jää silti, syy on `.app`:n ulkopuolella eikä tässä säännössä. |
| 147 | **Äänet omaan ämpäriin (Cloudflare R2).** Kuvat ja äänet olivat samassa GitHub Pages -sivustossa; pelkkä Euroopan äänipuoli vei 569 Mt ja Pagesin suositusraja on 1 Gt sivustoa kohti. Kuvat jäivät Pagesiin (`PEILI_JUURI`), äänet siirtyivät ämpäriin (`AANI_JUURI`). Polku lasketaan kummankin juuren perään samalla säännöllä, joten osoitteen vaihto oli ainoa muutos pelin puolella. Media-repon `.github/workflows/r2-aanet.yml` vie `aanet/`-kansion ämpäriin aina kun se muuttuu; avaimet ovat repon Actions-salaisuuksina eivätkä missään tiedostossa. **Kolme asiaa, joita ei kannata purkaa:** `AWS_REQUEST_CHECKSUM_CALCULATION=when_required` (R2 ei hyväksy aws-cli 2.23:n oletuksena lähettämiä tarkistussummaotsakkeita — ilman tätä jokainen lähetys epäonnistuu); `--delete` on pois (tyhjentynyt ämpäri rikkoisi pelin kaikilta kerralla); ja CORS-tarkistus tehdään GET-pyynnöllä, koska R2 vertaa metodia säännön `AllowedMethods`-listaan eikä palauta otsaketta HEADille lainkaan. **Tämä viimeinen johti minut harhaan:** tarkistin CORSin `curl -I`:llä, en saanut otsaketta ja päättelin ettei sääntöä ole — se oli koko ajan kunnossa. CORSia tarvitaan vain `js/sound.js` `loadRealSamples`iin, joka lukee tehosteiden tavut itse (fetch + decodeAudioData); `<audio>`-toisto ei sitä tarvitse. **Vielä tekemättä:** äänet ovat nyt kahdessa paikassa, ja tilansäästö syntyy vasta kun Pages julkaisee pelkät `kuvat/` ja `liput/`. |
| 146 | **Päiväkirja aukeaa napauttamalla.** Omistajan toive: skrollauksen sijaan merkintä laajenee napautettaessa ja pienenee takaisin karttaa napautettaessa. Merkintä oli kartan nurkalla viiden rivin ikkunassa, ja loput piti vierittää sormella pienen tekstin sisällä. Napautus kasvattaa kortin niin että koko teksti näkyy kerralla; kortti kasvaa siitä reunasta, johon se on kiinnitetty (ylänurkassa alaspäin, alanurkassa ylöspäin). **Katto on 74 % ruudun korkeudesta** — ilman sitä pitkä merkintä peittäisi koko kartan eikä pelaaja näkisi mihin napauttaa kutistaakseen sen; jos merkintä ei mahdu siihenkään, teksti vierii kuten ennen. Uusi merkintä alkaa aina pienestä ikkunasta (`uusiFactKey`), muuten avaus olisi jäänyt päälle ja seuraava kaupunki olisi peittänyt kartan itsestään. Kutistuessa teksti palaa alkuun, ettei näkyviin jää keskeltä alkavaa katkelmaa. Kortin omat napit hoitavat oman napautuksensa eivätkä avaa korttia. |
| 145 | **Musiikki soimaan napista.** Omistajan huomio: Tutki-sivun musiikkiosiossa oli linkki jollekin sivulle eikä musiikkia. `musiikkiVapaa` osoitti kansallisen yleisradion etusivulle (ERT, BBC, HRT) — sivulle päätyminen ei ole musiikin kuulemista. Kentät poistettu, tilalla `musiikkiNayte`: suora mp3, joka soi napista samalla soittimella kuin muutkin näytteet. Apple Music -linkki säilyy vieressä. Näytteitä 20 kortissa 33:sta; ilman jäävät ne, joille vapaasti lisensoitua äänitystä ei ole tai joiden ainoa osuma on ND-lisenssillä (ei muokkausta), joka ei sovi peiliin leikattavaksi — mm. ABBA, Röyksopp ja Šostakovitšin 7. sinfonia. Uusi `tools/hae-musiikkinaytteet.mjs` hakee ehdokkaat Commonsista ja archive.orgista. **Kaksi rajausta, joita ei saa poistaa:** vain mp3 (Safari ei soita oggia eikä flacia, ja peliä pelataan iPadilla), ja archive.orgista vain kohteet joilla on `licenseurl` — Great 78 Project osuu hakusanoihin parhaiten mutta sen kohteissa ei ole lisenssitietoa lainkaan. Commons-näytteitä ei peilata; peilaustyökalu poimii vain freesound- ja archive.org-osoitteet, ja Commons on muutenkin pysyvä lähde. Korjattu myös soittimen napinteksti: se palautui pysäytettäessä aina muotoon "Kuuntele näyte", vaikka nappi olisi ollut "Kuuntele kieltä". |
| 144 | **Kuuntele kieltä -nappi.** Saapumiskortin tervehdysrivin perässä on nappi, joka soittaa siitä kaupungista tehdyn äänityksen, jossa ihmiset puhuvat. Teksti kertoo mitä "hyvää päivää" on kyseisellä kielellä, näyte miltä se kuulostaa oikeassa kadunkulmassa. Näyte on tarkoituksella eri asia kuin taustaääni: tausta soi silmukassa minuutteja, ja selvä puhe alkaa toistuessaan kiinnittää huomion — pelaaja tunnistaa samat lauseet ja tausta muuttuu häiriöksi. Siksi taustaan haetaan edelleen puheetonta maisemaa ja kieli soi kerran painalluksesta. Hakutyökaluun tuli `--puhe`-tila, joka etsii toreja, kahviloita, asemia ja katusoittajia — paikkoja joissa on monta ihmistä äänessä eikä äänite ole kenenkään yksityinen keskustelu. 41 kaupungista 36 sai ehdokkaita; niistä valittiin käsin 31. Ilman nappia jäävät Alpit, Dubrovnik, Sarajevo, Odessa ja Lappi (ei ehdokkaita) sekä Edinburgh, Wien, Granada, Tromssa ja Islanti (ehdokkaina kutomakone, lintuja, kirkonkelloja, supermarketti). Nappia ei siis näy, ellei näytettä ole — parempi kuin nappi joka lupaa kieltä eikä anna sitä. **Rehellisyyden vuoksi:** valinta on tehty äänitysten omien kuvausten perusteella, ei kuuntelemalla; aporeen kuvaukset ovat poikkeuksellisen tarkkoja, mutta huono osuma on mahdollinen ja vaihtoehdot saa työkalulla uudestaan. ND-lisenssit jätettiin pois, koska peiliin menevät äänet leikataan kolmeen minuuttiin. Peilaustyökalusta korjattiin sama kirjainkokovika kuin mediatestistä aiemmin: oletushakemisto oli `matkakirja-media` pienellä, joten Linuxilla se loi repon viereen toisen tyhjän hakemiston ja peilasi joka kerta tyhjästä. |
| 143 | **Matkalaukku aukeaa kukkaropilleristä** (omistajan toive): erillinen passinappi pois ylävalikosta, ja punta–päivä-pilleri on nyt itse nappi, jonka päässä on laukun kuvake. **Kaupungin kuvat ja äänet ladataan valmiiksi saapuessa** (omistajan toive): karuselli latasi kuvat vasta nuolta painettaessa, kulttuurinostot vasta lohkon avautuessa ja ääninäyte vasta napista. Nyt saapuminen käynnistää haun taustalla kolmen ryhmissä, ettei saapumishetki tuki yhteyttä juuri kun kortti piirtyy. Kaikki menee selaimen omaan välimuistiin, joten näyttö käyttää samoja osoitteita eikä lataa mitään toiseen kertaan; epäonnistuminen ei näy pelaajalle. Työhuoneen tilastoihin versionumero. |
| 142 | **Euroopan rannikot piirretty oikeasta aineistosta** (omistajan huomio: "Sardinia ei edes näy"). Ääriviivat tulevat nyt Natural Earthin 10 m maapolygoneista: manner 620 pistettä ja 12 saarta, yhteensä 1340 pistettä käsin arvattujen tilalle. Yksinkertaistus on Visvalingam–Whyatt eikä Ramer–Douglas–Peucker, koska RDP jätti Norjan vuonoihin neulamaisia piikkejä — Visvalingam poistaa pienimmän kolmion kerrallaan ja säilyttää muodon paremmin samalla pistemäärällä. Suljetun renkaan yksinkertaistus kaatui aluksi yhteen pisteeseen: alku- ja loppupiste ovat samat, joten perusviiva on nollan mittainen ja kaikki etäisyydet nollia — rengas kierretään nyt ääripisteeseen ja käsitellään avoimena viivana. Kaupunkien paikkoja siirretty rannikon mukaan (Istanbul, Kreeta, Kööpenhamina) ja Barcelona–Rooma-merireitille annettu välipisteet, ettei se leikkaa Sardinian läpi. **Peilin katkaisija lähdekohtaiseksi:** yhteinen laskuri sammutti kuvapeilin kolmen ääniongelman jälkeen, vaikka kuvapalvelin olisi ollut kunnossa. |
| 141 | **Taustaäänten saumat pehmeiksi.** Silmukan sauma ristihäivytetään: selaimen oma `loop` katkaisi nauhan pään alkuun kuin veitsellä, ja kolmen minuutin äänitteessä sen kuulee kerran kolmessa minuutissa. Uusi kierros käynnistyy nyt omana soittimenaan 2,6 s ennen loppua. Väistö (kertojan tai tietovisan aikainen vaimennus) on kerroin eikä kertaluonteinen häivytys, joten sauman yli menevä kierros ei nouse täyteen voimaan kesken puheen. Määränpään äänimaisema alkaa jo ennen saapumista — kartalla viimeisellä askeleella, lennolla kalvon häivytyksen aikana — joten kertojan aloittaessa sekunnin viiveellä tausta on ehtinyt nousta. Kertojan loppuhäivytys 0,25 s → 1,5 s loivalla käyrällä; lyhyessä kertojatilassa ääni pysäytettiin lauserajalla ilman häivytystä lainkaan. **Työhuoneen etusivu** riisuttu pelkiksi tilastoiksi (omistajan toive) ja tilastoihin lisätty peilin luvut media-repon manifestista — ne eivät voi vanhentua dokumenttien mukana. |
| 140 | **Paketti 20: jokaiselle Euroopan kaupungille oma taustaääni.** 41 kaupunkia, 69 kenttä-äänitystä radio aporeesta. Ennen tätä 22 kaupunkia jakoi kolme "kaupunki"-ääntä, eli Praha kuulosti Lissabonilta. Kaupungin oma äänitys soi nyt maisematyypin arvontakorin edellä (`js/ambience-stream.js`), ja studioon tuli oma lohko kaupungeittain. **Hakutyökalusta korjattiin kaksi vikaa, joista kumpikin oli diagnosoitu väärin työlistassa:** (1) archive.orgin hakemisto pudottaa koordinaateista miinusmerkin — kohde, jonka longitude on −0,1119, löytyy väliltä 0,0–0,9 eikä miltään negatiiviselta väliltä; kysely tehdään nyt itseisarvoilla ja etumerkki tarkistetaan tuloksista. Ilman tätä koko eteläinen pallonpuolisko olisi jäänyt löytymättä Afrikan kierroksella. (2) Koordinaatit eivät puuttuneet otsikoiden takia vaan siksi, että Wikipedian `prop=coordinates` palauttaa oletuksena vain kymmenen sivun koordinaatit pyyntöä kohti — `colimit=max` korjaa, ja seuduille (Alpit, Kreeta, Lappi) haetaan koordinaatti Wikidatan P625:stä. Osumat 24/41 → 41/41. Uusi `tools/leikkaa-mp3.mjs` leikkaa peiliin menevät äänet kolmeen minuuttiin kehysrajalta ilman uudelleenkoodausta (ei ffmpeg-riippuvuutta); peili kevenee 346 → 280 Mt. Korjattu myös `wiki: 'Pietari'` → `'Pietari (kaupunki)'`: fi-wikin *Pietari* on täsmennyssivu, joten Lue lisää, kuvat ja peilaus jäivät kaupungilta tyhjiksi. Peilaustyökalusta korjattiin lisäksi eheystarkistus, joka luki odotetun koon uudelleenohjausketjun viimeisestä otsakkeesta: välipalvelimen hetkellinen virhevastaus antoi kooksi 170 tavua ja tuomitsi ehjän latauksen katkenneeksi. Ja mediatestin manifestipolusta puuttui kansionimi isolla alkukirjaimella, joten koko testi ohittui hiljaisesti Linuxilla. Peilin koko: **292 → 463 Mt**. Kolmen minuutin katko säästi noin 175 Mt (ilman sitä peili olisi ~638 Mt), mutta 69 uutta äänitettä kasvattivat sitä silti selvästi. |
| 134 | Kaikki neljä Afrikka-vertailun eroa kurottu umpeen. **Maamerkit:** viisi uutta piirrosta (`acropolis`, `colosseum`, `volcano`, `geyser`, `aurora`) `mapart.js`:ään ja Euroopan `decor.landmarks`-listaan — paikat haettu ohjelmallisesti niin, että testin reitti-, nimi- ja kaupunkirajat täyttyvät. **Pulmat:** uusi `europe-puzzles.js` (roomalaiset numerot Roomassa, pylväsjärjestelmät Ateenassa, suola-altaat Dubrovnikissa); `drawPuzzle` ui.js:ssä valitsee piirtäjän tunnisteen perusteella. **Ääninäytteet:** kolme kenttä-äänitystä radio aporeesta (Sofian gaida-katusoittajat, Ballaròn tori, Rooman suihkulähde) — Afrikassa on yksi. **Omat tiivistelmät:** `africa-tiivistelmat.js` → `omat-tiivistelmat.js` (tiedosto on aina ollut yhteinen kaikille laudoille) + Ateena, Rooma ja Sofia, joiden fi-artikkeli alittaa 200 merkin rajan. |
| 133 | **Korjaus vertailusta Afrikkaan:** Ateenan seudun kuudelta kaupungilta puuttui `wiki`-kenttä, jolloin saapumiskortti jäi ilman Wikipedia-kuvaa, kuvagalleriaa ja omaa nostoa (`js/ui.js` palaa `if (!city.wiki) return;`). Afrikan 39 kaupungista kaikilla kenttä on, Euroopan 41:stä oli vain 6:lla. Kenttä lisätty kuudelle, ja `ARTIKKELIT[city.wiki]` → `ARTIKKELIT[city.wiki ?? city.name]`, jottei sama katoa hiljaa uudestaan. **Euroopan 29 keskeneräiseltä kaupungilta kenttä puuttuu yhä.** |
| 132 | Ateenan seutu valmis: Ateena, Rooma, Kreeta, Sisilia, Dubrovnik ja Sofia saivat kolme kulttuurikorttia, tietovisakysymyksen, silloin–nyt-valokuvaparin ja oman artikkelin; lisäksi maa-artikkelit Kreikalle, Kroatialle ja Bulgarialle. 30 uutta kuvaa, kaikki lisenssit varmennettu Commonsin extmetadatasta. **Kuvista ei enää tehdä paikallisia kopioita** — Commons on se repon ulkopuolinen tallennuspaikka, ja palvelutyöntekijä tallentaa kerran nähdyn kuvan omaan pitkäikäiseen koriinsa. Kulttuurikorttiin lisätty `musiikkiVapaa`-kenttä: ilmainen kuuntelupaikka (kansalliset yleisradiot ERT, HRT, BNR) Apple Musicin rinnalle. |
| 131 | Ateenan seutu aloitettu (omistajan päätös: alue kerrallaan täyteen syvyyteen). **Kertojan luennat kahdeksalle Euroopan kaupungille**: Lontoo, Pariisi, Rooma ja Ateena palautettiin ElevenLabsin historiasta — Fable oli generoinut ne, mutta tiedostot eivät päätyneet repoon; Kreeta, Sisilia, Dubrovnik ja Sofia generoitiin nyt samalla äänellä (Viisas Kertoja `Sz0tRTEpybtDJ9ru2kgD`, malli `eleven_v3`, text-to-dialogue, stability 0.5, mp3_44100_128). Tekstit myös `europe-saapumiset.js`:ään sanatarkasti. Uudet maat: Kreikka, Kroatia ja Bulgaria (rajat, liput, tunnusluvut, kaupunki→maa). **Valokuvia ei enää haeta asennuksessa** vaan vasta kun pelaaja näkee ne (sw.js): asennus olisi kasvanut 150 megatavuun. Kaikille 41 Euroopan kaupungille maisematyyppi ja Euroopalle omat korit (kaupunki, satama, vuoristo, metsä, pohjoinen). |
| 130 | Zoomausääni kauttaaltaan matalammaksi (omistajan toive: kuulostaa vanhemmalta laitteelta). Toistonopeuden haarukka 0,86–1,16 → 0,76–1,02, keskiarvo 0,84 eli kolme puolisävelaskelta alempana. Syntetisoidun varaversion taajuudet laskettu samalla kertoimella. Astu mantereelle -nappi messinginväriseksi: se näytti samalta laatikolta kuin yläpuolen repliikki, vaikka on kalvon ainoa napautettava kohta (omistajan havainto). |
| 129 | Zoomausääni tasattu (omistajan havainto: "nousee ja laskee itsessään" — mitattu 340 ms:n jaksosta 21 %:n vaihtelu). Uusi kokoamistapa `tools`-kansion ulkopuolella tehdyssä skriptissä: lähteestä eristetty tasaisin 82 ms:n pätkä (alkaa 4,397 s), pituus pyöristetty kokonaisiin perusjaksoihin (294 Hz, 150 näytettä), silmukoitu vuorotellen eteen- ja taaksepäin tasatehoisella ristihäivytyksellä, ja lopuksi voimakkuus jaettu omalla pehmennetyllä verhokäyrällään. Tulos: 100 ms:n ikkunassa vaihtelu 11,6 % → 1,1 %. Voimakkuus 0,24 → 0,21. |
| 128 | Avausteksti työntyy alas täsmälleen kartan alareunan mukana: `tyonnaAvausteksti` (js/ui.js) mittaa siirtymän geometriasta ja antaa css:lle matkan, keston ja pehmennyksen muuttujina. Mitattu väli kartan alareunan ja tekstin välillä pysyy 34–35 px koko liu'un ajan. Tekstistä ei tarvitse kuvaa: siirto on pelkkä transform (kompositorin työtä), ja `will-change` antaa saman kerroshyödyn. Zoomausäänestä poistettu kameran naksahdukset: äänite kootaan nyt vain tasaisesta jaksosta 4,24–4,58 s, ja syntetisoidun version knock-kutsut poistettu. Voimakkuus 0,55 → 0,24, koska normalisointi nosti tasaisen jakson keskitason yli kaksinkertaiseksi. Zoomaus hitaammaksi: etusivu 2,8 → 3,6 s, mantereet 2,0 → 2,4 s, pehmennys `cubic-bezier(0.68, 0, 0.3, 1)` (30 %:n kohdalla vasta 11 % matkasta). Sumennus ja kromaattinen aberraatio ulottuvat syvemmälle (maski 56 → 42 %, kylmä kehä 74 → 60 %, lämmin 84 → 74 %); vihreän raja jätetty ennalleen omistajan hyväksymänä. |
| 127 | Etusivun lähikuvassa vaalea filmivinjetti ei enää palaa zoomauksen jälkeen: siellä reunan hoitaa yksin kiikari (omistajan päätös). Muilla kartoilla vinjetti ennallaan. Vaihto tapahtuu samalla 700 ms:n feidauksella kuin kiikarin esiintulo. Kirjattu myös taikalasi-idea (kohta 9). |
| 126 | Zoomausliu'un ajaksi kartan oma reunahäivytys (`.map-pane::after`) sammutetaan (`body.zoom-kaynnissa`): lähikuva on rajattu kaupunkien korkeuteen, joten liu'un alussa kartta ei täytä paneelia ja häivytys piirtyi paljaalle taustalle tummina kaarina (omistajan havainto). Samalla paneelin tausta on lähikuvassa pergamentin väriliuku eikä tummaa. Kiikari vetäytynyt reunemmas: ellipsi 72 %×64 % → 84 %×75 %, ja pysäkit siirretty sisemmäs (maski 56→82 %, vihreä 62/78/89 %), jolloin nurkat pysyvät entisen vahvuisina mutta reunojen keskikohdat vapautuvat. |
| 125 | Euroopan lähikuvaan pohjoiskaista (`YLAKAISTA = 0.26`), jotta Tromssa, Lappi ja Islanti saa panoroitua matkakirjan kortin alta. Zoomausääni vaihdettu aitoon: Commonsin "Pocket camera start and shut down" (public domain), josta linssin sisäänvedon tasainen surina toistettu ristihäivytyksellä 2,9 s:iin — `assets/audio/efekti-zoom.mp3` on nyt olemassa, syntetisoitu versio jää varalle. Etusivun zoomaus 2,0 → 2,8 s (`ALOITUS_ZOOM_MS`), pehmennys ease-in-out (`ZOOM_PEHMENNYS`). Kiikariefekti siirretty omaksi elementikseen `.kiikari` (index.html): nousee esiin vasta zoomauksen jälkeen feidaten, vihreä sävy vetäytynyt reunemmas (alku 52 % → 62 %), sumennus ennallaan, ja reunoille lisätty kromaattinen aberraatio kahtena kertovana värikehänä (lämmin uloimpana, kylmä sisempänä). Kartta ei enää maalaudu valituksi raahatessa. Zoomausäänen korkeus seuraa liu'un vauhtia: `js/sound.js vauhtiKayra` johtaa toistonopeuskäyrän (0,86–1,16) samasta bezier-pehmennyksestä, ja sekä äänite (`setValueCurveAtTime` playbackRatelle) että syntetisoitu varaversio käyttävät sitä. Kesto tulee kutsujalta, joten mantereen 2,0 s ja etusivun 2,8 s zoomaus soivat kumpikin oikean mittaisina. **Huom: jos `ZOOM_PEHMENNYS` muuttuu js/ui.js:ssä, sama arvo on muutettava js/sound.js:ään.** |
| 124 | Palaute ulkopuoliselle lomakkeelle: mailto ja omistajan sähköposti poistettu koko koodista, tilalla `PALAUTE_LOMAKE`-vakio (js/ui.js) + yhteydenottokenttä; tyhjänä varareittinä GitHub-linkki. Uusi huutomerkkinappi oikeassa alakulmassa lähettää palautteen siitä kohdasta peliä, jossa pelaaja on (lauta + kaupunki + vaihe + versio kulkevat mukana). Mantereen zoomaus odottaa nyt Astu mantereelle -napin (ei enää animoidu lentokalvon takana). Kaikki zoomaukset hitaammiksi (ZOOM_MS 1200 → 2000, kokonäkymä 1100 → 1400 ms). Maailmankartan lähikuvaan vanhan kiikarin vääristymä: vihertävä sumennus reunoille, pois raahauksen ajaksi ja feidaten takaisin. Zoomausääni tehty uusiksi (kanttiaalto + kaistanpäästö + hammaspyörävinkuna = kameran moottori; ennen liian möyrisevä). Avaustekstin lopetus varaa tilansa ennen kirjoitusta, joten teksti mahtuu taas kokonaan ruudulle. |
| 123 | Periaateikkuna: avautuu alusta (ei enää lopusta), "Kaksi ääntä" lyhennetty, loppuun © Sami Reivinen ja palautelohko (mailto-lomake). |
| 122 | Aloituskartan zoom 2,2× → 3,1× ja rajaus kaupunkien korkeudelle (navat pois). Zoomausääni kuuluvammaksi + tauko ja muiden äänten vaimennus ennen sitä. Etusivun tausta-ääni ei enää arvo (aina korin ensimmäinen). **TEKEMÄTTÄ: assets/audio/efekti-zoom.mp3 ElevenLabsilla** — paikka on varattu, tiedosto ottaa vuoron heti kun se ilmestyy. |
| 121 | Aloita seikkailu -nappi täsmälleen ruudun keskelle: alareunan linkki ja ääniviihje irrotettu virrasta. |
| 120 | Zoomausliuku 600 → 1200 ms, avausteksti työntyy alas samaa tahtia, ja zoomaus lähtee mistä tahansa napautetusta kohdasta (ei enää vaadi osumaa kaupunkiin). Zoomausääni pidennetty vastaavasti. |
| 119 | Euroopan karttaa jatkettu etelään (Pohjois-Afrikka y 1045 → 1160) ja lähikuvaan varattu alakaista, jotta Kreeta ja Ateena saa panoroitua nappien alta pois. |
| 118 | Aloitussivu: ääniviihje kaiutinikonilla napin yläpuolelle, alareunaan linkki periaateikkunaan (README-tiivistys + GitHub-linkki). |
| 117 | Mantereen zoomaus (VAIN Eurooppa): saapuessa kokonäkymä → automaattinen zoom nappulaan, panorointi kaikkiin suuntiin, vinjettihäivytys tekstien alle. Zoomausääni (digikameran moottori). Laajennus muille laudoille: lisää id ZOOMATTAVAT-settiin js/ui.js. |
| 116 | Aloituskartta puhelimella: 1. napautus zoomaa (ei valitse), vaakapanorointi, avaustekstin viimeinen rivi lihavoitu, kohderenkaat sykkivät ja vaikenevat raahauksen ajaksi. Sarajevo siirretty Bosnian sisään. |
| 115 | Nopan varjo takaisin tavalliseksi (kynäviivoitus pois). |
| 114 | Euroopan viisi kaupunkia Afrikan tasolle (ks. kohta 7). |
| 113 | Yläpalkki puhelimella pelkiksi kuvakkeiksi, nimi "M". |
| 112 | Liput ja loput Commons-kuvat repoon, kynävarjo, lentokalvon sumennus. |
| 111 | Ruudunpäivitys: nopanheitto 15 → 60 fps. |

## 9. Muuta kirjattavaa

*(Tähän lisätään sitä mukaa kuin omistaja huomaa asioita pelatessa.)*

### Eurooppa vs. Afrikka — mitattu ero (1.8.2026)

**[Opus]** Omistaja pyysi vertaamaan. Mitattu koodista:

| | Afrikka | Eurooppa |
|---|---|---|
| kaupunkeja | 39 | 41 |
| saapumismerkintä | 39/39 | 14/41 |
| kulttuurikortit | 39/39 | 12/41 |
| silloin–nyt-kuvat | 39/39 | 12/41 |
| kysymyksiä | 216 (5,0/kaupunki) | 210 (5,0/kaupunki) |
| maatietoja | 27 maata | 9 maata |
| **`wiki`-kenttä** | **39/39** | **12/41** |
| maamerkkejä kartalla | 19 | 3 |
| pulmia (luonnoskirja) | 13 | 0 |
| omia tiivistelmiä | 6 | 0 |
| ääninäytteitä kulttuurissa | 1 | 0 |
| ilmaisia musiikkilinkkejä | 0 | 4 |

Valmiiden kaupunkien **tekstimäärä on Euroopassa suurempi**: kuuden
Ateenan seudun kaupungin keskiarvo 2 770 merkkiä (saapuminen +
kulttuuri + valokuvat) vastaan Afrikan kuuden otoksen 2 008. Ero tulee
kulttuurikorteista (1 798 vs. 1 207): Euroopan nostoissa on pidemmät
selitteet.

**Erot, jotka kannattaa kuroa umpeen:**

1. **Maamerkit kartalla.** Afrikassa 19, Euroopassa 3. Nämä ovat
   `kind:`-merkintöjä `europe.js`:n `decor`-osiossa (piirtofunktiot
   `mapart.js` LANDMARKS). Halpa lisätä ja näkyy heti.
2. **Pulmat.** `africa-puzzles.js` on 13 kuvapulmaa; Euroopalla ei ole
   tiedostoa lainkaan. Huom: pulmat ovat myös kohdan 1 avoin ongelma
   (liian kryptisiä), joten ne kannattaa korjata ennen kopiointia.
3. **Ääninäytteet kulttuurikorteissa.** `aani`-kenttä soittaa oikean
   kenttä-äänityksen kortissa. Afrikassa käytössä yhdellä
   (Marrakechin kahvila, aporee/archive.org). Euroopassa ei yhtään —
   tähän sopisi Europeana tai archive.org.
4. **Omat tiivistelmät.** `africa-tiivistelmat.js` on nimestään
   huolimatta **globaali** (ui.js tuo sen sellaisenaan). Sitä tarvitaan,
   kun fi-Wikipedian tiivistelmä on alle 200 merkkiä — silloin peli
   näyttää englantia. Ateena (101 merkkiä), Rooma (135) ja Sofia (105)
   ovat rajan alla, mutta ne pelastuvat omalla artikkelilla; ilman sitä
   olisivat näyttäneet englantia.

### Euroopan kaupungit: mikä on tehty ja mikä kesken

**[Opus 1.8.2026]** Omistajan päätös: alue kerrallaan täyteen
syvyyteen. Ensimmäinen alue on Ateenan seutu (Ateena, Kreeta, Sisilia,
Rooma, Dubrovnik, Sofia).

Valmiina 41 kaupungista: Venetsia, Marseille, Granada, Krakova,
Sarajevo, Islanti. Version 131 jälkeen Ateenan seudun kuudella on
saapumismerkintä, luenta, maa ja tunnusluvut — mutta **ei vielä
kulttuurikortteja eikä silloin–nyt-valokuvia**. Ne ovat seuraava työ.

**Luentojen tekninen resepti** (jotta uudet kuulostavat samalta):
ääni `Sz0tRTEpybtDJ9ru2kgD` "Viisas Kertoja", malli `eleven_v3`,
päätepiste `/v1/text-to-dialogue`, `stability: 0.5`, ulostulo
`mp3_44100_128`. Teksti kirjoitetaan äänitageilla: nuoren herran osuus
`[amazed]`/`[excited]`/`[warmly]`, isoisän sitaatti `[softly]`, ja
lopetus `[warmly]`. Aarrevihjeet luetaan `[whispers]`-tagilla.

**Huom Fablelle:** generoidut tiedostot pitää muistaa siirtää repoon.
Neljä valmista luentaa (Lontoo, Pariisi, Rooma, Ateena) löytyi vain
ElevenLabsin historiasta — ne oli generoitu 31.7. mutta ne eivät olleet
missään tiedostossa. Historia (`GET /v1/history`) säilyttää sekä tekstin
että äänen, joten mitään ei menetetty, mutta se oli tuuria.

### Ilmaiset musiikkilähteet — ALOITETTU v.132

**[Omistaja]** Kaupunkien ääninäytteet saisivat tulla Apple Musicin
lisäksi myös ilmaisista lähteistä. Valtioiden omat yleisradiot ovat
todennäköisesti hyvä lähde.

**[Opus]** Toteutettu kenttänä `musiikkiVapaa` (+ `musiikkiVapaaNimi`
ja `musiikkiVapaaLyhyt`) kulttuurinostossa. Linkki näkyy Apple Musicin
vieressä omalla napillaan, ja kenttä on vapaaehtoinen — nostot ilman
sitä näyttävät vain Apple Musicin. Käytössä Ateenan seudulla:

| maa | lähde | osoite |
|---|---|---|
| Kreikka | ERT | `https://webradio.ert.gr/` |
| Kroatia | HRT | `https://radio.hrt.hr/` |
| Bulgaria | BNR | `https://bnr.bg/en/live` |

**Tämä ratkaisu kumottiin 2.8.2026.** Omistajan huomio: "Tutki
sivuilla on musiikki osiossa linkki aina jollekin sivulle. Sen tilalla
saisi olla linkki ääninäytteeseen suoraan, eli musiikki pitäisi lähteä
soimaan suoraan kun sitä painaa." Yleisradion etusivu ei ole musiikkia
— se on paikka, josta musiikkia ehkä löytää. `musiikkiVapaa`-kentät
poistettiin ja tilalle tuli `musiikkiNayte`: suora mp3, joka soi
napista samalla soittimella kuin muutkin näytteet. Lähteet ovat
Wikimedia Commons ja archive.org (`tools/hae-musiikkinaytteet.mjs`).

Kaksi rajausta lähteissä. Vain **mp3** kelpaa, koska Safari ei soita
oggia eikä flacia — ja peliä pelataan iPadilla, joten ogg-näyte olisi
juuri siellä hiljainen. Ja archive.orgista vain kohteet, joilla on
`licenseurl`: Great 78 Project (`collection:georgeblood`) osuu
hakusanoihin ylivoimaisesti parhaiten, mutta sen kohteissa ei ole
lisenssitietoa lainkaan, joten ne jätettiin kokonaan pois.

### Kuvien tallennuspaikka — ratkaistu

**[Omistaja]** "Mietitään niille repon ulkopuolinen tallennuspaikka
mistä lazy load ladataan."

**[Opus]** Uutta palvelua ei tarvita: **Wikimedia Commons on jo se
paikka**, ja koodi on valmiiksi kytketty. `valokuvaUrl` (ja `lippuUrl`)
palauttaa Commons-osoitteen aina kun tiedostoa ei ole
`VALOKUVAT_PAIKALLISET`-taulukossa, ja `sw.js` tallentaa
`commons.wikimedia.org/wiki/Special:FilePath/` -vastaukset omaan
pitkäikäiseen koriinsa. Lazy load tulee `<img loading="lazy">`:stä.

Käytännössä siis: **uusille kaupungeille ei ladata kuvia repoon
lainkaan** — riittää että `tiedosto`-kenttään kirjoitetaan Commonsin
tiedostonimi. Commons on ilmainen, pysyvä, ei rajoita liikennettä
kohtuukäytössä eikä kasvata repoa. Vanhat paikalliset kopiot voi jättää
paikalleen; ne toimivat edelleen.

### Kaksi reunaefektiä — kumpi kuuluu minne

- **Vaalea filmivinjetti** (`.map-pane::after`) on kartan alkuperäinen
  ilme ja jää kaikille laudoille. Se sammuu vain kahdessa tilanteessa:
  zoomausliu'un ajaksi (`body.zoom-kaynnissa`, muuten se piirtyisi
  kasvavan kartan ulkopuolelle) ja etusivun lähikuvassa
  (`body.kiikari-paalla`), jossa kiikari hoitaa reunan.
- **Kiikari** (`.kiikari`, index.html + css `body.aloitus-zoom`) on
  toistaiseksi vain etusivun maailmankartalla. Se on tarkoituksella
  pieni näyte efektistä.

**[Omistaja]** Kiikari on varattu myöhemmin **taikalaseille**
(kohta 2): kun pelaaja löytää lasit, joilla kartasta näkee muutakin
kuin tavallinen silmä, sama efekti kytketään päälle niiden ajaksi.
Etusivu on tarkoituksella pieni näyte siitä, miltä lasit tuntuvat.

**[Opus]** Tekniikka on jo paikallaan: efekti on yksi elementti ja
kaksi tilaluokkaa. Lasien kytkeminen on käytännössä oman luokan
lisääminen `body.aloitus-zoom`in rinnalle css:ssä ja sen kytkeminen
esineen käytöstä — ei uutta piirtokoodia.

---

## Vanhoja avoimia asioita

Nämä olivat aiemmin työlistan **Avoimet asiat** -osiossa. Osa on
sittemmin hoidettu; jäljelle jää kaksi:

- **`texts.schedule` muille laudoille vaatii päätöksen.** Afrikan
  isoisän aikataulu on kokonainen 80 päivän kierros, joka päättyy
  kotiinpaluuseen. Toinen kierros toiselle laudalle antaisi kaksi eri
  versiota samasta matkasta, ja `docs/tarina.md`:n mukaan päiväkirjoja
  on yksi, vuodelta 1873. Kysymys: onko 80 päivää lautakohtainen
  vertailuluku vai yksi matka, jonka eri laudat näyttävät eri paloina?
- **`TURN_HOURS = 6` odottaa pelitestiä.** Yhden vakion muutos
  `js/game.js`:ssä; oikea arvo selviää vain pelaamalla.
