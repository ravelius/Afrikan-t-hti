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

| v | Muutos |
|---|---|
| 117 | Mantereen zoomaus (VAIN Eurooppa): saapuessa kokonäkymä → automaattinen zoom nappulaan, panorointi kaikkiin suuntiin, vinjettihäivytys tekstien alle. Zoomausääni (digikameran moottori). Laajennus muille laudoille: lisää id ZOOMATTAVAT-settiin js/ui.js. |
| 116 | Aloituskartta puhelimella: 1. napautus zoomaa (ei valitse), vaakapanorointi, avaustekstin viimeinen rivi lihavoitu, kohderenkaat sykkivät ja vaikenevat raahauksen ajaksi. Sarajevo siirretty Bosnian sisään. |
| 115 | Nopan varjo takaisin tavalliseksi (kynäviivoitus pois). |
| 114 | Euroopan viisi kaupunkia Afrikan tasolle (ks. kohta 7). |
| 113 | Yläpalkki puhelimella pelkiksi kuvakkeiksi, nimi "M". |
| 112 | Liput ja loput Commons-kuvat repoon, kynävarjo, lentokalvon sumennus. |
| 111 | Ruudunpäivitys: nopanheitto 15 → 60 fps. |

## 9. Muuta kirjattavaa

*(Tähän lisätään sitä mukaa kuin omistaja huomaa asioita pelatessa.)*

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
