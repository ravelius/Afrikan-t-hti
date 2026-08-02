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
- Paketti 14 (lentoanimaatio): ✅ (28.7.2026) — kone liitää reittiä
  pitkin ja repliikki kirjoittuu kartalle. 70 lentorepliikkiä Maailmalle
  ja Afrikalle, joista puolet hehkuttaa isoisän päiväkirjaa.
- Paketti 15 (lentorepliikkien tunnelataus): ✅ (28.7.2026) — kaikki 70
  riviä kirjoitettu uusiksi innostuksella. Neljä testiä vartioi paketin
  14 faktakorjauksia, jottei uudelleenkirjoitus palauta niitä.
- Paketti 16 (äänet): ✅ (28.7.2026) — generoitu kaiku ja kompressori,
  materiaalipohjaiset äänet (resonoiva noppa, soittorasiakello,
  FM-kolikko, sumutorvi), potkurihurina lennolle ja vireheitto
  väsymisen estoon.
- Paketti 17 (ambienssi): ✅ (28.7.2026) — kuusi äänimaisemaa (aavikko,
  meri, sademetsä, savanni, ylänkö, basaari) ja ambience-kenttä kaikille
  32 Afrikan kaupungille. Vaihto ristihäivytyksellä, merellä aina meri.
- Paketti 18 (Katso kuva -linkit): ✅ (28.7.2026) — 24 uutta wiki-kenttää
  Afrikan havaintoihin, yhteensä 30 linkkiä 29 kaupungilla. Jokainen
  otsikko tarkistettu rajapinnasta ja jokaisella on kuva.
- Paketti 11 ("Lue lisää"): ✅ (28.7.2026) — Wikipedian tiivistelmä
  tietoruudun ja saapumiskortin napista, kaikille 32 Afrikan kaupungille
  tarkistettu artikkeliotsikko.
- Paketti 10 (kysymysten vaihtelu): ✅ (28.7.2026) — isoisän väittämät,
  karttakysymykset ja tapahtumakortit vuorottelevat monivalinnan kanssa.
  Sisältö Afrikalle: 16 väittämää ja 12 tapahtumakorttia.

- Paketti 18 (Katso kuva -linkit): ✅
- Paketti 19 (matkamuistot aarrepalkinnoiksi): ✅
- Eurooppa valmiiksi, 29 kaupunkia ja 20 maata: ✅ (1.8.2026, v138)
- Peilikerros ja media-repo: ✅ (1.8.2026, v137) — media-repon PR #1
  odottaa yhdistämistä
- Kuvien tekijämerkinnät lisenssin vaatimalla tavalla: ✅ (1.8.2026)
- Astu mantereelle -napin korjaus, ylävalikko hampurilaiseksi,
  ambienssin aloituskohta ja etusivun taso: ✅ (1.8.2026, v139)
- Paketti 20 (kaupunkien omat ambienssiäänet): ✅ PR #237 (1.8.2026,
  v140) — Eurooppa valmis. Kaikilla 41 kaupungilla oma kenttä-äänitys,
  yhteensä 69 äänitettä radio aporeesta; peilaus media-repon PR #2.
  Työkalun molemmat viat korjattu (ks. alempaa: kumpikin oli
  diagnosoitu väärin). **Afrikka jätettiin myöhemmäksi omistajan
  päätöksellä 1.8.2026** — ei siis unohdus.

## Avoimet asiat

**Media-repon PR:t #1 ja #2 on yhdistetty** (1.8.2026), joten peili on
käytössä ja sisältää myös Euroopan kaupunkiäänitykset.

**Yhdistämisjärjestys, jos peiliin tulee lisää aineistoa:** media-repo
ensin, pelirepo vasta sen jälkeen. Peli hakee aineiston ensisijaisesti
peilistä, ja kolmen epäonnistuneen haun jälkeen peili ohitetaan koko
istunnoksi — myös kuvien osalta. Väärä järjestys ei riko peliä, mutta
tekee siitä hitaan siihen asti kun välilehti suljetaan.

**Peilin koko kannattaa katsoa ennen Afrikkaa.** Mitattu manifestista
1.8.2026 illalla (`du --exclude=.git` antaa saman luvun):

    ennen pakettia 20   kuvat 111 + liput 0,3 + äänet 181  =  292 Mt
    nyt             kuvat 110 + liput 0,3 + äänet 352  =  463 Mt
    ilman 3 min katkoa                                  ≈  638 Mt

Kolmen minuutin katko siis säästi noin 175 megatavua, mutta peili
**kasvoi silti 292 → 463 megatavuun** — 69 uutta äänitettä on iso erä.
(Aiemmin tähän oli kirjattu "peili pieneni 580 → 399 Mt". Se oli väärin:
580 oli mitattu .git-hakemisto mukaan lukien ja 399 oli suoranainen
mittausvirhe. Älä käytä niitä lukuja.)

Afrikan 39 kaupunkia toisivat samalla mitoituksella noin **320 Mt**
lisää, jolloin peili olisi ~780 Mt. GitHub Pagesin suositusraja on 1 Gt,
joten tila riittää mutta ei enää väljästi. Keinot, jos halutaan
pienemmäksi: yksi äänite kaupunkia kohti kahden sijaan (puolittaa),
lyhyempi katko kuin kolme minuuttia, tai äänitteiden uudelleenkoodaus
matalammalle bittinopeudelle (nykyiset ovat 128–320 kb/s, ja moni on
kaksikanavaista kohinaa jolle mono riittäisi).

Työhuoneen etusivun tilastot lukevat nämä luvut suoraan peilin
manifestista, joten ne eivät voi vanhentua tämän dokumentin mukana.

**Venäjänkielisten vähemmistöjen liput** (Ukraina, Viro, Latvia,
Liettua) jätettiin pois omistajan päätöksellä 1.8.2026. Muilla
vähemmistökielillä lippu on. Älä palauta niitä.

Aiemmat: ei avoimia asioita. Paketin 12 pulmien verkkotarkistus tehtiin
28.7.2026 (suunnittelusessio): xhosan naksutuskuvaukset (c dentaalinen,
x lateraalinen "hevosen hoputus", q "korkin poksahdus") ja Timbuktun
käsikirjoitusviite (Kashf al-Ghummah fi Nafa al-Ummah, al-Ghalawi 1733,
Mamma Haidara -kirjasto, Library of Congressin näyttely — opettaa
laskemaan vuodenaikojen alut tähtien liikkeistä) täsmäävät lähteisiin.
Ashantien 3 %:n tarkkuusväitettä ei ole julkaistussa tekstissä.

## Seuraavaksi: PAKETTI 20 AFRIKALLE

**Paketit 1–20 ovat valmiit Euroopan osalta.** Paketin 20 kohta 9
("tee sama Afrikalle") on jäljellä: työkalu ja pelin puoli ovat valmiit,
joten Afrikka on pelkkä ajo, karsinta ja peilaus — mutta lue ensin
peilin kokoa koskeva avoin asia yltä. Lue myös osio "Tilanne 1.8.2026",
jossa on kaikki mitä tarvitset kummankin repon jatkamiseen.

Äänistä: omistaja käy äänet läpi viritysivulla `/aanet.html` ja antaa
äänikohtaisen palautteen — älä tee uutta äänten yleisremonttia ennen
sitä palautetta. Paketti 20 on eri asia: se ei muuta olemassa olevia
ääniä vaan hakee kaupungeille omat.

## Tilanne 1.8.2026 — lue tämä ensin

Kaksi sessiota teki töitä rinnakkain: toinen pelirepossa, toinen
media-repossa. Tähän on koottu kummankin tilanne, jotta yksi sessio voi
jatkaa molempia.

### Pelirepo (ravelius/Matkakirja)

Main on ajan tasalla, versio **2026-08-01.139**. Kaikki alla oleva on
jo mainissa — älä tee uudestaan.

- **Eurooppa on valmis.** Kaikilla 41 kaupungilla on saapumismerkintä,
  kolme kulttuurinostoa kuvineen, monivalintakysymys, vanha ja uusi
  valokuva sekä oma artikkeli. Maatietoja 29.
- **Peilikerros** (`js/media.js`): kuvat ja äänet haetaan kolmessa
  portaassa — paikallinen kopio → peili → alkuperäinen lähde. Peilin
  polku lasketaan samalla säännöllä kuin `tools/peilaa-media.mjs`,
  ja `tests/media.test.mjs` vartioi ettei sääntö eriydy.
  `PEILI_JUURI` = `https://ravelius.github.io/Matkakirja-media/`.
- **Tekijämerkinnät**: kaikilla CC BY / CC BY-SA -kuvilla on tekijän
  nimi (`tools/lisaa-tekijat.mjs`). Lippujen tekijät ovat
  `js/packs/lippu-tekijat.js`:ssä ja näkyvät periaatelapussa.
- **Työhuone** (`tyohuone.html`) näyttää nyt myös Euroopan tekstit.
- Ambienssin aloituskohta arpoutuu; etusivun taso on puolitettu.

Tarkistustyökalut, aja nämä kun sisältö muuttuu:

    node tools/tarkista-wikit.mjs      # wiki-linkit, 0 kuollutta
    node tools/lisaa-tekijat.mjs       # kuvien tekijämerkinnät
    node tools/build-standalone.mjs    # yhden tiedoston versio
    npm test                           # 322 testiä

### Media-repo (ravelius/Matkakirja-media)

- **PR #1 on auki** haarasta
  `claude/kloonaa-matkakirja-peilaa-media-xzw23f`. Se sisältää peilatun
  aineiston. **Se pitää yhdistää mainiin** — GitHub Pages tarjoilee
  mainia, joten peili alkaa toimia vasta yhdistämisen jälkeen. Pages on
  jo päällä ja palauttaa `access-control-allow-origin: *`.
- Peilaus ajetaan pelirepossa: `node tools/peilaa-media.mjs`
  (oletushakemisto on repon vieressä oleva `Matkakirja-media`; muualle
  `--ulos <polku>`). Nimi on isolla alkukirjaimella syystä: 2.8. asti
  oletus oli pienellä, ja Linux teki siitä toisen tyhjän hakemiston,
  jolloin peilaus alkoi joka kerta nollasta.
- Työkalu ohittaa jo ladatut tiedostot, joten uusintajo on nopea.
  **Aja se aina, kun peliin tulee uusia kuvia tai ääniä.**
- Peiliin menevät mp3:t leikataan kolmeen minuuttiin latauksen
  yhteydessä. Ennen 1.8. peilatut ovat yhä täysmittaisia; ne saa
  lyhennettyä ilman uutta latausta komennolla
  `node tools/leikkaa-peilin-aanet.mjs --ulos <media-repo>`
  (`--kuiva` näyttää mitä tapahtuisi).

Peilaustyökalusta korjattiin 1.8. kolme vikaa. Älä palauta vanhaa
käytöstä:

- Heittomerkilliset tiedostonimet (`Château d'If`) katkesivat
  ensimmäiseen hipsuun. Nyt luetaan kumpikin lainausmerkkityyppi.
- Aikaraja oli 5 min, mikä katkaisi yli 25 megatavun äänitteet kesken.
  Katkennut tiedosto jäi levylle pysyvästi, koska olemassa oleva
  tiedosto ohitettiin kokoa tarkistamatta. Aikaraja on nyt 20 min ja
  koko tarkistetaan palvelimen ilmoittamaa vasten.
- Pelkkä HTTP 200 ei erota kuvaa virhesivusta. Nyt katsotaan tiedoston
  alkutunniste. **Kokoraja ei kelpaa mittapuuksi** — yksivärinen lippu
  pakkautuu 320 pikselin levyisenä muutamaan sataan tavuun.

Neljäs vika löytyi 1.8. illalla: odotettu koko luettiin uudelleen-
ohjausketjun **viimeisestä** content-length-otsakkeesta, jolloin
välipalvelimen hetkellinen virhevastaus antoi odotetuksi kooksi 170
tavua ja täysin ehjä lataus tuomittiin katkenneeksi. Nyt kelpuutetaan
vain onnistuneen (200) vastauksen ilmoittama koko.

Huom: Commons vastaa olemattomaan tiedostoon **404**, ei 200. Jos
näet vastakkaisen väitteen vanhassa raportissa, se on virheellinen.

### Lähdeaineisto

`tools/peilaa-media.mjs --vain tekstit` hakee 168 wikitekstiä
kansioon `lahteet/`. Ne ovat raaka-ainetta pelin omien tekstien
kirjoittamiseen, eivät julkaistavaa sisältöä — siksi ne ovat
media-repon .gitignoressa. Ne saa milloin tahansa uudestaan.


## Paketti 36: zoomipainikkeet kartalle — VALMIS v160 2.8.2026

**Omistajan toive:** "Siihen voisi tehdä universaalit zoomipainikkeet
kartalle kaikille alustoille."

**Mikä oli vialla.** Lähikuvaan pääsi vain automaattisesti, vain
Euroopassa ja vain alle 700 pikselin ruudulla. Tietokoneella karttaa ei
voinut lähentää lainkaan, eikä tasoa voinut säätää millään laitteella —
`MANNER_ZOOM` oli kiinteä vakio 2.3.

**Ratkaisu: portaikko vakion tilalle.**

    const ZOOMI_TASOT = [1, 1.5, MANNER_ZOOM, 3.4, 5];

Ensimmäinen porras on kokonäkymä: siihen loitonnettaessa lähikuvasta
poistutaan kokonaan. `MANNER_ZOOM` on portaissa mukana, jotta
automaattinen saapumiszoom osuu portaalle ja painikkeet jatkavat siitä
eivätkä hyppää ensin johonkin väliin. Portaat eivät ole tasavälein:
alapäässä ero on pieni, ettei yleiskuvan ja ensimmäisen lähikuvan
välillä hypätä liikaa, yläpäässä suurempi, koska lähellä pieni muutos ei
enää tunnu miltään.

**Tärkein yksityiskohta: keskipiste pysyy paikallaan.** Ilman sitä kartta
karkaisi käsistä joka painalluksella, koska `sovitaMannerZoom` keskittää
lähikuvan `zoomKohde`-pisteeseen. `nykyinenKeskipiste()` laskee
käänteisluvulla, mikä kartan piste on juuri nyt paneelin keskellä, ja se
luetaan **ennen** tason vaihtoa vanhalla mittakaavalla. Mitattu: keskipiste
pysyi 483,515–516:ssa kaikkien portaiden läpi molempiin suuntiin.

Kokonäkymästä lähennettäessä ei ole aiempaa keskipistettä, joten
kohdistetaan pelaajan nappulaan — siellä peli on menossa, ei laudan
geometrisessa keskipisteessä.

**Miksi painikkeet toimivat kaikkialla.** `mannerZoomTarpeen()` rajaa vain
AUTOMAATTISEN zoomauksen; `fitViewBox` katsoo pelkkää `this.mannerZoom`
-lippua. Painike asettaa lipun suoraan, joten lähikuva aukeaa millä
tahansa laudalla ja millä tahansa ruudulla. Testi vartioi, ettei
painikefunktio ala kysyä automaattizoomin ehtoja.

**Paikka.** Kartan oikea reuna pystyssä, keskikorkeudella. Alalaita on
matkustusnappien käytössä ja pidetty tarkoituksella väljänä (omistajan
aiemmat toiveet), ylälaidassa on matkakirjan kortti. Napit ovat
pergamentin väreissä kuten kartan muutkin merkinnät. Päässä oleva nappi
himmenee mutta ei katoa — katoava nappi saisi sormen etsimään sitä.

**Todennettu selaimessa** molemmilla ruutukoilla (402×874 ja 1280×800):
portaat ylös ja alas, paluu tarkalleen lähtökokoon, painikkeiden päät
oikein. Tietokoneella zoomia ei ollut ennen lainkaan.

**Katselutila korjautui samalla.** Ehto oli aluksi pelkkä
`phase === 'pickstart'`, mikä olisi piilottanut napit myös `?lauta=`
-katselutilassa. Nyt ehto on sama kuin `fitViewBox`illa
(`avausNakymassa()`), eli katselu näyttää laudan kuin pelissä.


## Paketti 35: meri katoaa kartalta — SYY LÖYTYI, KORJATTU v159 2.8.2026

**v158:n arvaus oli väärä.** Omistaja: "Meri katoaa heti kun käyn toisessa
apissa ja palaan takaisin" — eli vika toistuu joka kerta, ja v158:n herätys
ei auttanut lainkaan.

**Kuvakaappaus ratkaisi asian.** Kuvassa oli tallella ruudukko, reitit,
kaupungit, nimet, koristeet ja maan korostus. Puuttui maa, rannikko, meren
kaiut ja aallot — **täsmälleen ne kerrokset, joilla oli suodatin.**

| kerros | suodatin | kuvassa |
|---|---|---|
| `landmass` | `#rough` | poissa |
| `waves` | `#rough-soft` | poissa |
| `terrain` | `#rough-soft` | poissa |
| `routes` | `#rough-soft` | **näkyy** |
| ruudukko, kaupungit, koristeet | — | näkyy |

**Miksi reitit selvisivät.** Suodatin tarvitsee oman piirtopuskurin, jonka
koko seuraa kerroksen rajauslaatikkoa ja zoomia. Mannerkerros on kartan
suurin — Euroopan rannikko jatkuu laudan reunojen yli — ja lähikuvassa sen
puskuri on moninkertainen. Reittikerros mahtuu kaupunkien väliin. iOS
vapauttaa taustalle jääneen sovelluksen puskurit eikä saa suurinta enää
varattua, joten se kerros palaa tyhjänä.

**Omistaja arvasi itse oikein:** "peli webapin puolella, veikkaan että
liittyy jotenkin siihen". Juuri webapp-tila on se, jossa iOS vapauttaa
puskurit aggressiivisimmin.

**Korjaus: heilunta piirretään, ei lasketa.** `kohina(x, y, siemen)` antaa
pehmeän pseudokohinan paikan mukaan, ja `kasinPiirretty` siirtää pisteitä
sen verran ennen pehmennystä. Arvot vastaavat vanhaa suodatinta: solu 58
yksikköä ≈ `baseFrequency 0.017`, amplitudi ±4 = `scale 8`. Kohina
lasketaan kerran piirrossa, joten puskuria ei tarvita eikä ole mitään mitä
menettää.

Sama käsittely sai rannikot, järvet, maiden rajat ja pallonpuoliskokartan
asteverkon. Kehäympyrät piirretään `wobblyCircle`illa, jotta 1600-luvun
kartasta ei tulisi harpilla vedettyä.

**Todennettu vertailukuvalla** (Chromium, 402×874, `reducedMotion:
no-preference`): rannikko heiluu käytännössä samalla tavalla kuin ennen.
Kartalla on nyt yksi suodatettu kerros neljän sijaan, eikä yhtään orpoa
viittausta.

**Ansa, johon jäätiin kiinni.** Poistin ensin myös `#rough-soft`
-määrittelyn, vaikka reittikerros `js/ui.js`:ssä viittasi siihen yhä.
SVG:ssä **puuttuvaan suodattimeen viittaava ryhmä ei piirry lainkaan** —
se olisi vienyt kaikki reitit kartalta. Määrittely jäi paikalleen, ja uusi
testi tarkistaa, että jokaiselle viittaukselle löytyy määrittely.

**Jos meri vielä katoaa,** seuraava askel on poistaa suodatin myös
reiteiltä. Silloin reittiviivat pitää pilkkoa ja heiluttaa samalla
kohinalla — päätepisteet paikallaan, jottei viiva irtoa kaupungista.


## Paketti 34: peilaus käynnistyy itsestään — VALMIS 2.8.2026

**Omistajan toive:** "Tee sinä peilaus aina automaattisesti."

Ei versionostoa: peliin ei tullut muutosta, vain ajoon.

**Kolme käynnistintä.**

1. **Push mainiin**, kun muutos koskee `js/packs/**`, `tools/peilaa-media.mjs`,
   `tools/leikkaa-mp3.mjs` tai ajoa itseään. Juuri silloin peiliin on voinut
   tulla uutta; tyyli-, dokumentti- ja pelilogiikkamuutokset eivät käynnistä
   mitään. Ajo itse on listalla tarkoituksella — niin sen muutokset tulevat
   kokeilluiksi heti eivätkä jää piiloon seuraavaan kertaan.
2. **Viikoittain** (su 04:15 UTC). Jos jokin lähde oli poikki peilaushetkellä,
   tiedosto jäi puuttumaan hiljaa; viikkoajo poimii sen kun lähde palaa.
   Vartin yli tasatunnin, koska tasatunnit ovat GitHubilla ruuhkaisimmat.
3. **Käsin**, jolloin voi yhä valita yhden lajin.

**Vanha varoitus kumottiin mittaamalla.** Tiedoston kommentti kielsi
pushista ajamisen, koska "ajo kestää kymmeniä minuutteja". Se pätee vain
ensimmäiseen ajoon. Kun ämpärissä on jo kaikki, ajo vertaa tilanteen ja
lopettaa: mitattu koko kierros **56 s**, josta noudon osuus 37 s. Pitkä ajo
tulee vain kun uutta aineistoa on oikeasti paljon — ja silloin sitä pitääkin
odottaa. Rinnakkaisuus ei ole vaara: `concurrency`-ryhmä pitää ajot jonossa
eikä vienti käytä `--deleteä`.

**Automatisointi paljasti piilevän vian.** Lajivalinta on olemassa vain
käsin käynnistettäessä. Pushista ja ajastuksesta `inputs.lajit` on tyhjä
merkkijono, ja askeleen vertailu

    if [ "$LAJIT" != "kaikki" ] && [ "$LAJIT" != "$laji" ]; then continue; fi

olisi silloin ohittanut **kaikki** lajit. Ajo olisi mennyt läpi vihreänä
peilaamatta mitään — pahin mahdollinen lopputulos, koska se näyttää siltä
että aineisto on kunnossa. Kaksi korjausta:

- oletus annetaan ajossa: `LAJIT: ${{ inputs.lajit || 'kaikki' }}`
- askel laskee montako lajia se ajoi ja **kaatuu jos luku on nolla**, jottei
  sama virhe voi enää mennä läpi hiljaa

Testattu neljä tapausta paikallisesti: `kaikki` → kolme lajia, `liput` →
yksi, `aanet` → yksi, tyhjä → virhe.


## Paketti 33: peilausajo kuntoon ennen media-repon poistoa — VALMIS 2.8.2026

Ei versionostoa: peliin ei tullut yhtään toiminnallista muutosta.
`dist/` rakennettiin silti uudelleen, koska `js/media.js`:n
alkukommentti muuttui.

**Salaisuudet eivät seuranneet työnkulun mukana.** Omistaja ilmoitti
lisänneensä R2-avaimet, joten ajoin `peilaa.yml`:n ensimmäistä kertaa
pelirepossa (`lajit: liput`, pienin mahdollinen todiste). Kaatui 16
sekunnissa:

    aws: [ERROR]: Invalid endpoint: https://.r2.cloudflarestorage.com

Osoitteen keskeltä puuttuu tilitunnus, eli `secrets.R2_ACCOUNT_ID` oli
tyhjä. Lokissa myös `AWS_ACCESS_KEY_ID` ja `AWS_SECRET_ACCESS_KEY`
olivat tyhjiä, kun samassa lohkossa `token: ***` — **GitHub peittää
olemassa olevan salaisuuden tähdillä, joten tyhjä tarkoittaa ettei sitä
ole olemassa**. Avaimet olivat media-repossa, jonka `r2-media.yml` oli
ajettu onnistuneesti samana aamuna (08:35). Salaisuudet ovat
repokohtaisia eivätkä siirry työnkulun mukana.

**Opetus, joka kannattaa muistaa.** Siirretty työnkulku ei ole valmis
ennen kuin se on ajettu kerran uudessa kodissaan. Tiedosto näyttää
oikealta molemmissa päissä, ja `total_count: 0` ajoja on helppo lukea
"ei ole vielä tarvinnut ajaa" eikä "ei ole koskaan toiminut".

**Ajo kertoo nyt itse mikä puuttuu.** Ensimmäinen askel tarkistaa
kaikki neljä nimeä, tulostaa vain onko ne asetettu (ei arvoja) ja
neuvoo mistä ne lisätään. Aiempi virhe vaati aws-clin osoitesyntaksin
tuntemista.

**Manifestitesti ajetaan vihdoin oikeasti.** `tests/media.test.mjs`
vertaa `js/media.js`:n polkusäännön koko peilin manifestiin, mutta
ohitti itsensä hiljaa jos manifestia ei ollut koneella — eli aina,
paitsi jos media-repo sattui olemaan levyllä vieressä. Repon poiston
jälkeen se ei olisi ajettu enää koskaan, ja eriytynyt nimeäminen olisi
paljastunut vasta pelaajalle puuttuvana kuvana.

- Manifesti etsitään ensisijaisesti kansiosta `media/`, johon
  peilausajo noutaa ämpärin sisällön. Vanhat sijainnit jäivät perään.
- Ajossa on askel, joka ajaa testin heti noudon jälkeen — ennen kuin
  mitään kirjoitetaan ämpäriin.
- Todennettu oikealla manifestilla (576 tiedostoa): 13/13 läpi,
  **0 ohitettua**. Koko sarja 333/333.

**Peilikansio siirtyi repon sisään.** `--ulos` oletti ennen
`../Matkakirja-media`; nyt `media/`, sama kansio jota ajo käyttää.
Repossa ei ollut lainkaan `.gitignore`-tiedostoa, joten se luotiin:
`media/` ja `lahteet/` (kummassakin satoja megatavuja tai satoja
wikiartikkeleita). `dist/` jätettiin tarkoituksella pois — yhden
tiedoston versio kuuluu repoon.

**Yhdistämismerkit siivottiin.** v158:n käsin selvitetystä
ristiriidasta jäi kumpaankin dokumenttiin `<<<<<<< HEAD`, `=======` ja
`>>>>>>> origin/main` tekstin sekaan. Sisältöä ei kadonnut.

**Ämpärin kunto tarkistettiin samalla.** Manifesti on 2.8.2026 ja
sisältää 320 kuvaa, 83 lippua, 173 ääntä ja 276 tekstiä. Yhdeksän
näytettä (alku, keskeltä, loppu kustakin lajista) vastasi
206-koodilla ja CORS-otsakkeella. **Aineisto on siis ämpärissä
tallessa riippumatta siitä, mitä media-repolle tehdään.**


## Paketti 32: kartan herätys ja muistien tyhjennys — VALMIS 2.8.2026

**Omistajan havainto:** "Välillä myös meri häviää kartalta" ja
"veikkaan että bugi tulee välimuistista, koska se tulee yleensä jos
avaan toisen ohjelman välissä tai Matkakirja päivittyy uuteen
versioon".

**Päättely.** Karttaa ei piirretä uudelleen kesken pelin — `drawBoard`
ajetaan vain laudan vaihtuessa. Kyse ei siis voi olla piirrosta vaan
siitä, että jo piirretty kerros lakkaa näkymästä. Meren tuntu syntyy
suodatetuista kerroksista (rannikon kaiut, aallot, maasto), ja iOS voi
palauttaa juuri ne tyhjinä vapautettuaan taustalle jääneen sovelluksen
piirtopuskurit.

**Korjausyritys.** `visibilitychange` ja `pageshow` herättävät kartan:
suodatinviite irrotetaan ja liitetään takaisin, mikä mitätöi selaimen
tallettaman tuloksen. Pelkkä uudelleenpiirron pyytäminen ei riitä,
koska selaimen mielestä mikään ei ole muuttunut.

**Tätä ei ole voitu todentaa.** Vikaa ei saa toistettua täältä, joten
tiedossa on vain että herätys ajetaan oikeaan aikaan, ei kaada mitään
eikä muuta kerrosten määrää. Jos meri katoaa vielä, seuraava askel on
luopua suodattimista kartan isoimmissa kerroksissa — ne ovat kalliita
muutenkin.

**Uusi peli tyhjentää kaikki muistit** (omistajan toive): talletukset,
välimuistit ja palvelutyöntekijän, ja hakee sivun uutena.

- **Varmistus on pakollinen.** Passin leimat ja laukun tavarat ovat
  pelin ainoa pysyvä kertymä, eikä niitä saa takaisin.
- **Avaimet poistetaan etuliitteellä** (`matkakirja`, `afrikan-tahti`)
  eikä `localStorage.clear()`:llä, joka veisi muidenkin sovellusten
  tiedot samasta selaimesta.
- **Voittoikkunan Uusi peli aloittaa kuten ennen** eikä tyhjennä
  mitään: siinä kohtaa pelaaja on juuri ansainnut kertymänsä.


## Paketti 31: kiikari ilmestyi kesken pelin — KORJATTU 2.8.2026

**Omistajan havainto:** "Valitsin laivamatkan Ateenassa ja peli zoomasi
uudelleen jonka jälkeen tuli kiikaritehoste."

**Syy.** `asennaPanorointi`in kartta-napautuksen kuuntelija kutsui
`zoomaaAloituskartta()`:a millä tahansa laudalla. Se lisää bodyyn
`aloitus-zoom`-luokan, ja luokan perään syttyy kiikari — joka on
tarkoitettu vain etusivulle.

Euroopassa `fitViewBox` palaa mannerzoomin haarasta eikä ehdi nollata
`aloitusZoom`-lippua, joten luokka jäi päälle ja kiikari syttyi noin
neljä sekuntia myöhemmin. **Afrikassa vika ei näkynyt**, koska siellä
`fitViewBox` kulkee nollaavan haaran läpi ja lippu putoaa heti — siksi
tämä oli piilossa näin pitkään.

Ehto on nyt `this.game.pack.id !== 'maailma'`: napautuszoomaus kuuluu
vain maailmankartalle, jolla ei ole omaa lähikuvaa.

**Sivuvaikutus, joka korjautui samalla.** Kuuntelija on
kaappausvaiheessa ja pysäyttää tapahtuman, joten se söi mantereella
kartan kohderenkaiden napautukset.

**Testausopetus, joka kannattaa muistaa.** `?lauta=xxx` avaa
katselutilan, jossa `zoomTarpeen()` ja `mannerZoomTarpeen()` palauttavat
aina false. Kaikki aiemmat Playwright-ajoni olivat siinä tilassa
eivätkä olisi voineet paljastaa tätä. Toisto vaati `ui.katselu = false`
ja `ui.reducedMotion = false` — headless-selain ilmoittaa myös
liikkeenvähennyksen päälle, mikä sammuttaa saman polun.

Toistettu ennen korjausta: napautus → `aloitus-zoom` heti, `kiikari-paalla`
4 sekunnin kohdalla, kiikari `visible`. Korjauksen jälkeen kumpikaan ei
syty kahdeksassa sekunnissa.


## Paketti 30: vinjetti pois lähikuvasta — VALMIS 2.8.2026

**Omistajan toive:** "Zoomatussa mannernäkymässä vaalean vinjetin voi
jättää joka sivulta pois."

Kokonäkymässä häivytys rajaa laudan kuin vanhan filmin ruudun. Mantereen
lähikuvassa kartta jatkuu joka suuntaan panoroitavaksi, joten vaalea
reuna ei rajaa mitään — se vain haalistaa sitä osaa karttaa, jota
ollaan katsomassa.

`body.manner-zoom .map-pane::after` liitettiin samaan `opacity: 0`
-sääntöön kuin zoomausliuku ja kiikari, joten häivytys palaa itsestään
kokonäkymään eikä sitä tarvitse erikseen sytyttää.

Mitattu lähikuvassa: vasen reuna 203 → 180, oikea 202 → 178, keskusta
muuttumaton (177). Ylä- ja alakaista muuttuvat vain vähän, koska
niissä ovat päiväkirjakortin taustavalo ja nappien omat levyt — ne
kuuluvatkin näkyä.


## Paketti 29: kehittäjätila nurkkaan, matkakirja matalammaksi — VALMIS 2.8.2026

**Omistajan toiveet:** "Kirjoita kehittäjätila ennemmin versionumeron
perään. Pelkkä `: kehittäjä`" ja "Madalla Matkakirja-ikkunaa".

**Kehittäjätila nurkkaan.** Tilasta kertoi oma merkki kartan
yläreunassa. Se oli liian iso ele pienelle asetukselle: nurkan
versionumero on jo se paikka, josta pelin tila luetaan. Nyt siinä
lukee `v155 : kehittäjä`, ja merkki tyyleineen on poistettu.

Nurkan teksti päivittyy `paivitaVersioKulma()`:lla käynnistyksessä ja
kytkimen molemmissa haaroissa. **Jotain merkkiä tarvitaan silti** —
ilman sitä tila unohtuisi päälle, ja peli tuntuisi rikkinäiseltä kun
laattojen napautus vie minne tahansa. Testi vartioi, ettei merkintä
katoa kokonaan.

**Matkakirjan ikkuna matalammaksi.** Viisi riviä vei kartalta liian
ison palan puhelimella. Näkyviä rivejä on nyt kolme ja kortin katto
30 → 22 dvh. Kortti 126 → 86 pikseliä kiinni; auki levitettynä 221
pikseliä ja koko merkintä näkyvissä kuten ennen.

Rivikatto on em-mittana (`calc(3 * 1.35em)`), joten se seuraa
fonttikokoa eikä hajoa, jos fontti joskus muuttuu.


## Paketti 28: alalaidan haalistuma — oikea syy löytyi — VALMIS 2.8.2026

**Omistaja jouduttiin korjaamaan kahdesti:** "Korjaatkohan nyt väärää
asiaa. Tarkoitan tuota kuvassa näkyvää alalaitaa nappien takana."

Etsin haalistumaa kartan vinjetistä (`.map-pane::after`) ja korjasin
sen — mutta syy oli toisaalla:

    body.manner-zoom .turn-card::before

Lähikuvassa korttien alle piirretään pehmeä pergamenttivalo, jotta
teksti erottuu kartalta. Nappien kohdalla se haalisti kartan
alalaidan, jossa on eniten katsottavaa. Valo on nyt poistettu
nappien alta. Napeilla on oma pergamenttilevynsä ja
"Valitse matkustustapa" -rivillä sama vaalea tekstivarjo kuin kartan
omissa nimissä, joten kumpikin pysyy luettavana.

**Päiväkirjakortti pitää omansa.** Siinä on pitkä leipäteksti, joka ei
olisi luettavaa pelkän varjon turvin.

Mitattu lähikuvassa: alakaistat 187 → 175 ja 222 → 187, eli kartan
oman sävyn (176–180) tasolle.

**Miksi en nähnyt sitä itse.** Omat renderöintini eivät olleet
lähikuvassa, joten valoa ei ollut piirretty lainkaan — omistaja
pelaa aina lähikuvassa, koska mantereelle saapuminen zoomaa kartan.
Näin vian vasta pakotettuani `zoomaaMantereelle()`:n päälle.

**Opetus:** kun omistaja sanoo ettei korjaus purrut, tarkista ensin
että testiympäristö on samassa tilassa kuin hänen — älä sitä, onko
korjaus teknisesti oikea. Paketin 27 vinjettikorjaus oli oikea mutta
väärään asiaan.


## Paketti 27: vinjetti pois alalaidasta, fontti takaisin — VALMIS 2.8.2026

**Omistajan toiveet:** "Poista vinjetti alareunasta" ja "Pienennä
matkakirjan fontti takaisin".

**Vinjetti.** Kartan päällä on vaalea vinjetti (`.map-pane::after`),
joka haalistaa reunat kuin vanhassa filmiruudussa. Alalaidassa se ei
näyttänyt filmiltä vaan haalistumalta: siellä on eniten kaupunkeja ja
nimiä, ja kelluvat napit istuvat juuri sen päällä.

**Ensimmäinen yritys epäonnistui, ja se kannattaa muistaa.** Soikea
vinjetti jätettiin paikalleen ja peitettiin alhaalta `mask-image`illa.
Chromiumissa tulos oli oikea ja mittasin sen — mutta iPhonella
alalaita jäi silti vaaleaksi. Vinjetti rakennetaan nyt **kolmesta
reunaliu'usta** (ylä, vasen, oikea): alalaitaan ei piirretä mitään
eikä maskia tarvita, joten tulos on sama joka selaimessa. Kulmat
saavat kahden liu'un summan ja pysyvät tummimpina kuten ennen.

Opetus: älä korjaa piirtoa maskilla, jos saman voi tehdä itse
piirrolla. Maskituki vaihtelee selaimittain, eikä Chromium paljasta
sitä.

Mitattu kartan pinnasta: alakaista 176 → 169, kun keskusta on 171 —
alalaita on siis nyt keskustan tasolla. Yläkaista 198 → 210, eli
filmimäisyys säilyi.

**Fontti takaisin.** Paketissa 23 päiväkirjan teksti suurennettiin
(0,78 → 0,98 rem puhelimella). Omistaja palautti sen: isolla fontilla
kortti peitti kartasta liian ison kaistan. Koot ovat taas 0,78 rem
puhelimella, 0,84 kapealla ruudulla ja 0,9 muualla. Merkintäkortti
155 → 126 pikseliä kiinni, ja koko merkinnän saa yhä auki
napauttamalla — se on nyt se tapa lukea pitkä teksti, ei iso fontti.

**Älä siis suurenna sitä uudestaan** ilman että omistaja pyytää.
Paketin 23 testi vaati fontilta vähintään 0,95 remiä; se on korvattu
vinjettitestillä.


## Paketti 26: alalaidan kaistan arvoitus ja napit — VALMIS 2.8.2026

**Omistajan toive:** "Siellä napit alemmas ja pienennä niitä ainakin
vaakasuunnassa."

**Ensin arvoitus ratkesi.** Kehittäjätilan mittarivi asennetusta
sovelluksesta:

    ruutu   402 × 812     ← tämän selain saa käyttöönsä
    näyttö  402 × 874     ← tämän kokoinen puhelimen ruutu on
    turva   ylä 62px  ala 34px
    app     0 → 812
    stage   119 → 812
    kartta  126 → 805

Selaimen näkymä on **812 pistettä 874:n ruudulla**. Alimmat 62 pistettä
eivät kuulu sovellukselle lainkaan, eikä niihin yllä mikään css. Kartta
päättyy 805:een eli 7 pisteen päähän sovelluksen alarajasta — paketti 23
teki jo kaiken minkä pystyi. **Älä siis yritä venyttää karttaa
alemmas.** Ainoa tapa saada lisää tilaa olisi saada iOS antamaan koko
874, ja se on asennuksen eikä koodin asia.

**Sivutuote: `env(safe-area-inset-bottom)` on väärä mitta kelluville
korteille.** Se raportoi 34 pikseliä alueesta, joka ei ole näkymässä
lainkaan, joten varaus laski saman tilan kahdesti ja söi napeilta 27
pistettä. `.rail`, `#versio-kulma` ja `.palaute-kulma` käyttävät nyt
kiinteää rakoa. Jos jollain laitteella kotipalkki ylettyy näkymän
päälle, se on ohut läpikuultava viiva ja napit jäävät sen yläpuolelle.

**Napit kapeammiksi.** Matkustustavan napit ovat puhelimella pelkkiä
kuvakkeita, mutta venyivät silti ruudun levyisiksi. Omistaja pienensi
niitä kahdesti: nyt **58 × 40 pikseliä** ja keskellä. Korkeus on alle
Applen 44 pisteen suosituksen, mutta napit ovat erillään toisistaan
eikä vieressä ole muuta napautettavaa, joten ohi osuminen ei tee
vahinkoa.
Rajaus koskee vain yhden rivin matkustusvalintaa
(`[data-rivi='yksi']`) — tekstinapit kuten "Astu mantereelle"
tarvitsevat tilansa.

**Yksi testi käännettiin päinvastaiseksi.** Paketin 23 testi vaati
`.rail`-säännöltä turva-aluetta. Se oli oletus, jonka mittaus kumosi.


## Paketti 25: kehittäjätila — VALMIS 2.8.2026

**Omistajan toive:** "Tee hampurilaiseen kehittäjä toggle, salasana
5545, minkä avulla voi siirtyä mihin tahansa kaupunkiin pelkästään
painamalla kaupungin laattaa."

Valikosta aukeaa salasanaikkuna. Kytkettynä jokainen kaupunki on
napautettava, ja napautus vie sinne suoraan. Kartan yläreunassa on
merkki "Kehittäjätila", ettei tila unohdu päälle — muuten peli
tuntuisi rikkinäiseltä.

**Oikotie ei kuluta peliä.** `game.actionKehittajaSiirto` ei ota rahaa,
ei kuluta päivää, ei heitä noppaa eikä vaihda vuoroa, ja se jättää
voittotarkistuksen väliin — tähtikaupunkiin hyppääminen ei saa lopettaa
peliä kesken tarkastelun. `visitCity` kutsutaan silti, koska juuri se
tuottaa saapumisen havainnon päiväkirjaan; ilman sitä kortti näyttäisi
edellisen kaupungin tekstiä.

**Pelin alussa ensimmäinen napautus menee tavallista tietä**
(`actionPickStart`), koska lähtöpaikan valinta avaa portin mantereelle.
Vasta sen jälkeen hypätään.

**Salasana on koodissa selkokielisenä tarkoituksella.** Se on kevyt
lukko eikä tietoturvaa: tehtävä on estää tilan avautuminen vahingossa
lapsen kädessä, ei suojata mitään salaista.

**Kohderenkaita ei piirretä.** Ensimmäisessä versiossa jokainen
kaupunki sai violetin renkaan. 41 rengasta kerralla peitti kartan,
joten omistaja otti ne pois: napautusalue on näkymätön ja yläreunan
merkki kertoo tilan olevan päällä.

**Ikkunassa on myös ruudun mitat.** Ne ovat siellä syystä: asennetussa
sovelluksessa kartan alle jäi selittämätön kaista (ratkaistu, ks. paketti 26),
eikä iOS:n turva-alueita voi mitata muualta kuin laitteelta itseltään.
CSS kirjoittaa `env()`-arvot `:root`-muuttujiin `--turva-yla` ja
`--turva-ala`, joista JavaScript ne lukee.

Tila säilyy selaimessa omassa avaimessaan (`matkakirja-kehittaja`) eikä
kuulu pelin tallennukseen: se on laitteen asetus, ei pelitilanteen osa.


## Paketti 24: koko peili omaan ämpäriin (R2) — VALMIS 2.8.2026

**Miksi:** kuvat ja äänet olivat GitHub Pagesissa, jonka suositusraja on
1 Gt sivustoa kohti. Pelkkä Euroopan äänipuoli vei 569 Mt. Omistaja
valitsi Cloudflare R2:n, ja päätti sitten siirtää kaiken, jotta
media-repo voidaan poistaa kokonaan.

**Miten se toimii nyt.** Ämpäri on varasto, ei kopio: peli hakee sieltä
kuvat, liput ja äänet (`js/media.js` `PEILI_JUURI` ja `AANI_JUURI`
osoittavat samaan juureen). Alkuperäinen lähde — Commons, archive.org,
Freesound — jää yhä varareitiksi.

`.github/workflows/peilaa.yml` tässä repossa hoitaa peilauksen:
noutaa ämpäristä nykyisen aineiston, ajaa `tools/peilaa-media.mjs`
lajeittain ja vie tuloksen takaisin. Peilattua aineistoa ei säilytetä
missään repossa. Ajo tehdään käsin Actions-välilehdeltä, koska se
kestää kymmeniä minuutteja: jokaisen tiedoston eheys tarkistetaan
lähdettä vasten.

Avaimet ovat tämän repon Actions-salaisuuksina (`R2_ACCOUNT_ID`,
`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`). Ne eivät ole
missään tiedostossa.

**Kolme asiaa, joita ei kannata purkaa:**

- `AWS_REQUEST_CHECKSUM_CALCULATION=when_required`. R2 ei hyväksy AWS:n
  uudempia tarkistussummaotsakkeita, jotka aws-cli 2.23:sta alkaen
  lähtevät oletuksena mukaan. Ilman tätä jokainen lähetys epäonnistuu.
- `--delete` on pois. Vanha tiedosto ämpärissä ei haittaa ketään, mutta
  vahingossa tyhjentynyt ämpäri rikkoisi pelin kaikilta kerralla.
- CORS-tarkistus tehdään **GET**-pyynnöllä. R2 vertaa pyynnön metodia
  säännön `AllowedMethods`-listaan, ja koska siinä on vain GET,
  HEAD-pyyntöön ei tule otsaketta lainkaan. Ensimmäisellä kerralla
  tarkistin CORSin `curl -I`:llä ja päättelin siitä virheellisesti,
  ettei sääntöä ole — se oli koko ajan kunnossa.

**CORSia tarvitaan kahteen kohtaan.** `js/sound.js` `loadRealSamples`
hakee tehosteet `fetch`illä ja purkaa ne `decodeAudioData`lla, ja
`sw.js` noutaa kuvat omaan pitkäikäiseen koriinsa `mode: 'cors'`
-pyynnöllä. Tavallinen `<audio>`- ja `<img>`-lataus ei sitä tarvitse,
joten muualta avattuna peli toimii silti — nuo kaksi kohtaa putoavat
alkuperäiseen lähteeseen.

**Peilaustyökalun oletushakemisto** osoittaa yhä repon viereiseen
`Matkakirja-media`-kansioon. Se on tarkoituksella: paikallinen ajo on
kätevä, ja työnkulku vie kansion sisällön ämpäriin. Kansion ei tarvitse
olla git-repo.

**Tiedossa oleva rajoite: `pub-….r2.dev` on kehitysosoite.**
Cloudflaren dokumentaatio sanoo sen olevan nopeusrajoitettu ja
tarkoitettu kehityskäyttöön; välimuisti, palomuurisäännöt ja
pääsynhallinta ovat käytettävissä vasta oman verkkotunnuksen takana.
Nyt koko peliaineisto kulkee sen kautta, joten jos kuvat tai äänet
alkavat takkuilla, syy on todennäköisesti tässä. Korjaus on oma
verkkotunnus ämpärin eteen — silloin muuttuu vain `R2_JUURI`.


## Paketti 23: päiväkirja aukeaa napauttamalla — VALMIS 2.8.2026

**Omistajan toive:** "Skrollauksen sijaan Matkakirja voisi laajentua
alaspäin klikatessa ja pienenisi takaisin karttaa klikattaessa."

Päiväkirjamerkintä oli kartan nurkalla viiden rivin ikkunassa, ja loput
piti vierittää sormella pienen tekstin sisällä. Nyt merkinnän napautus
kasvattaa kortin niin, että koko teksti näkyy kerralla, ja kartan
napautus palauttaa sen pieneksi.

**Kolme yksityiskohtaa, joita ei kannata purkaa:**

- **Katto 74 % ruudun korkeudesta.** Ilman sitä pitkä merkintä peittäisi
  koko kartan, eikä pelaaja näkisi mihin napauttaa kutistaakseen sen.
  Jos merkintä ei mahdu siihenkään, teksti vierii kuten ennen — vieritys
  ei siis kadonnut, se vain ei ole enää ainoa keino.
- **Uusi merkintä alkaa aina pienestä ikkunasta** (`uusiFactKey`).
  Muuten yhden merkinnän avaaminen olisi jäänyt päälle ja seuraava
  kaupunki olisi peittänyt kartan itsestään.
- **Kutistuessa teksti palaa alkuun.** Jos auki levitettyä merkintää oli
  vieritetty, kutistuminen jättäisi muuten näkyviin keskeltä alkavan
  katkelman.

Kortti kasvaa siitä reunasta, johon se on kiinnitetty: ylänurkassa
alaspäin, alanurkassa ylöspäin. Nurkan valitsee `placeFactCard`
merenpinnan mukaan, ja se suosii jo valmiiksi ylänurkkia.

Kortin omat napit (kuuntele, valokuva, kuva) hoitavat oman
napautuksensa eivätkä avaa korttia.


## Paketti 22: musiikki soimaan napista — VALMIS 2.8.2026

**Omistajan huomio:** "Tutki sivuilla on musiikki osiossa linkki aina
jollekin sivulle. Sen tilalla saisi olla linkki ääninäytteeseen
suoraan, eli musiikki pitäisi lähteä soimaan suoraan kun sitä painaa.
Tämä siis eri kuin apple music."

Vanha `musiikkiVapaa`-kenttä osoitti kansallisen yleisradion etusivulle
(ERT, BBC, HRT). Sivulle päätyminen ei ole musiikin kuulemista. Kentät
on poistettu, ja tilalla on `musiikkiNayte`: suora mp3, joka soi
napista samalla soittimella kuin muutkin näytteet. Apple Music -linkki
säilyy sen vieressä ennallaan.

**Näytteitä 20 kortissa.** Kreeta, Lontoo, Edinburgh, Dublin,
Lissabon, Madrid, Barcelona, Amsterdam, Wien, Praha, Varsova, Kiova,
Odessa, Moskova, Pietari, Tallinna, Vilna, Istanbul, Helsinki ja Oslo.

**Ilman nappia jäävät** Ateena, Dubrovnik, Sofia, Pariisi, Berliini,
Alpit, Budapest, Bukarest, Riika, Tukholma, Kööpenhamina, Lappi ja
Tromssa. Syy on melkein aina sama: vapaasti lisensoitua äänitystä ei
ole, tai ainoa osuma on ND-lisenssillä (ei muokkausta), joka ei sovi
peiliin leikattavaksi. Tukholman ABBAlle, Tromssan Röyksoppille ja
Pietarin Šostakovitšin 7. sinfonialle ei tällaista löydy lainkaan —
Pietari sai näytteeksi saman säveltäjän 5. sinfonian, ja napin selite
kertoo sen.

**Kaksi rajausta lähteissä, älä poista niitä:**

- Vain **mp3**. Commonsin äänitiedostot ovat useimmiten ogg tai flac,
  joita Safari ei soita — ja peliä pelataan iPadilla, joten ogg-näyte
  olisi juuri siellä hiljainen.
- archive.orgista vain kohteet, joilla on `licenseurl`. Great 78
  Project (`collection:georgeblood`) osuu hakusanoihin ylivoimaisesti
  parhaiten ja sisältää juuri näitä levytyksiä, mutta sen kohteissa ei
  ole lisenssitietoa lainkaan. Peli kopioi äänet omaan peiliinsä,
  joten tuntematon lisenssi ei kelpaa.

Commonsista tulevia näytteitä ei peilata (peilaustyökalu poimii vain
freesound- ja archive.org-osoitteet). Se on tarkoituksellista: Commons
on pysyvä lähde, ja näin peili ei kasva turhaan.

**Rehellisyyden vuoksi:** valinta on tehty äänitysten kuvausten ja
tekijätietojen perusteella, ei kuuntelemalla. Ehdokaslistat saa
uudestaan komennolla `node tools/hae-musiikkinaytteet.mjs`.


## Paketti 21: Kuuntele kieltä -nappi — VALMIS 2.8.2026

**Omistajan toive:** "Puheääntä voisi tosiaan lisätä oman napin taakse
tutki sivuille."

Saapumiskortilla on jo rivi "hyvää päivää" maan kielillä. Nyt rivin
perässä on nappi, joka soittaa siitä kaupungista tehdyn äänityksen,
jossa ihmiset puhuvat: teksti kertoo mitä sanotaan, näyte miltä se
kuulostaa oikeassa kadunkulmassa.

**Miksi oma nappi eikä taustaääni.** Taustaääni soi silmukassa
minuutteja. Selvä puhe alkaa toistuessaan kiinnittää huomion — pelaaja
tunnistaa samat lauseet ja tausta muuttuu häiriöksi. Siksi taustaan
haetaan edelleen puheetonta maisemaa, ja kieli soi kerran
painalluksesta.

**Miten näytteet haettiin.** Sama työkalu kuin paketissa 20, uudella
`--puhe`-kytkimellä: se etsii koordinaattien perusteella toreja,
kahviloita ja katusoittajia ja hylkää muut. 41 kaupungista 36 sai
ehdokkaita, ja niistä valittiin käsin 31.

**Näyte on aina tori, kahvila, asema tai katu** — paikka jossa ihmisiä
on monta eikä äänite ole kenenkään yksityinen keskustelu.

**Ilman näytettä jäivät** Alpit, Dubrovnik, Sarajevo, Odessa ja Lappi
(ei yhtään ehdokasta) sekä Edinburgh, Wien, Granada, Tromssa ja
Islanti (ehdokkaat olivat kutomakone, lintuja, kirkonkelloja tai
supermarketti — ei puhetta). Näissä nappia ei näy lainkaan, mikä on
parempi kuin nappi joka lupaa kieltä eikä anna sitä. Nämä kymmenen
kannattaa hakea uudestaan, jos aporeehen tulee lisää äänityksiä.

**Yksi rajoite rehellisyyden vuoksi:** valinta on tehty äänitysten
omien kuvausten perusteella, ei kuuntelemalla. Kuvaukset ovat
aporeessa poikkeuksellisen tarkkoja ("cafe, old ladies, venetian
dialect, murmur, words"), mutta jos jokin näyte osoittautuu
kuunneltuna huonoksi, tilalle on valmiit vaihtoehdot: haun koko tulos
on tallessa ja saman kaupungin muut ehdokkaat saa työkalulla uudestaan.

**Lisenssit:** 24 näytettä on public domain, loput CC BY-, BY-SA-,
BY-NC- tai BY-NC-SA-lisensoituja. ND-lisenssit (ei muokkausta) jätettiin
kokonaan pois, koska peiliin menevät äänet leikataan kolmeen
minuuttiin. Tekijä ja lisenssi näkyvät napin selitteessä.


## Paketti 20: kaupunkien omat ambienssiäänet

**Omistajan toive:** "Olisi tärkeää löytää jokaiseen kaupunkiin
aidosti siinä kaupungissa nauhoitettu ambienssi ääni."

### Miksi

Taustaäänet tulevat nyt maisematyypin arvontakorista, ja Euroopassa
**22 kaupunkia jakaa kolme "kaupunki"-ääntä**. Praha ja Lissabon
kuulostavat siis samalta. Afrikassa yleisimmillä tyypeillä on 6–8
ehdokasta, Euroopassa kolme.

    kaupunki   22 kaupunkia ·  3 ehdokasta
    satama      9 kaupunkia ·  3 ehdokasta
    pohjoinen   3 kaupunkia ·  3 ehdokasta

### Mitä on jo tehty

`tools/hae-kaupunkiaanet.mjs` on kirjoitettu ja ajettu kerran. Se hakee
radio aporeen äänitteet **koordinaattien** perusteella (aporee-kohteilla
on latitude/longitude archive.orgin metadatassa), ei nimen perusteella
arvaten. Kaupungin koordinaatit haetaan Wikipediasta.

Ensimmäinen ajo löysi ehdokkaat **24 kaupungille 41:stä**.

### Työkalun kaksi vikaa — KORJATTU 1.8.2026

Molemmat oli tässä listassa diagnosoitu väärin. Oikeat syyt löytyivät
kokeilemalla, ja ne on kirjattu koodiin kommentteina. Älä palauta
vanhoja selityksiä.

1. **Ei ollut Lucenen kieltooperaattori vaan hakemisto, joka ei tunne
   etumerkkiä.** Suojaamaton miinusmerkki kaataa kyselyn, se on totta,
   mutta lainausmerkeissäkään negatiivinen väli ei löydä mitään:
   archive.org tallentaa koordinaatit merkkijonoina ja jäsennin pudottaa
   miinusmerkin pois. Brixtonin äänite (longitude −0,1119) löytyy
   väliltä `["0.0" TO "0.9"]`. Kysely tehdään nyt itseisarvoilla ja
   etumerkki tarkistetaan vasta tuloksista. Sama koski latitudea, joten
   **koko eteläinen pallonpuolisko olisi jäänyt löytymättä Afrikassa.**
   Lisäksi vertailu on aakkosellinen, ei numeerinen (`["9.8" TO "10.2"]`
   jää tyhjäksi), joten väli pilkotaan kokonaisosan numeromäärän mukaan.
2. **Ei ollut otsikoissa vaan rajapinnan oletusrajassa.** Wikipedian
   `prop=coordinates` palauttaa oletuksena vain **kymmenen** sivun
   koordinaatit pyyntöä kohti, vaikka `titles` ottaa viisikymmentä —
   loput näyttivät koordinaatittomilta. `colimit=max` korjaa sen.
   Seuduilla ja saarilla (Alpit, Kreeta, Lappi, Sisilia, Islanti) ei ole
   artikkelissa koordinaattia lainkaan; ne haetaan Wikidatan
   P625-ominaisuudesta sivun wikibase_item-tunnuksella.

Tulos: ehdokkaita löytyi **41/41 kaupungille** (ennen 24/41).

### Loppu tehty samalla — Eurooppa on valmis

3. ✅ Haku ajettu uudestaan; etäisyys keskustasta on tuloksessa mukana ja
   tarkistettu.
4. ✅ Karsittu käsin 328 osumasta 69:ään. Suodatinta myös terävöitetty:
   se hylkää nyt sisätilat ja asemahallit, kertaluonteiset tapahtumat
   (joulutorit, mielenosoitukset, karnevaalit) ja koneet. Ensimmäisellä
   ajolla Budapestin kuusi parasta olivat kaksi joulutoria ja neljä
   metroasemaa. Samanniminen äänite kelpaa enää kerran.
5. ✅ Jokaisen osoitteen toimivuus tarkistettu (yksi vastasi 500 ja
   jätettiin pois) ja lisenssi luettu kohteen omasta metadatasta.
6. ✅ `js/aani-ehdokkaat.js`: `KAUPUNKI_EHDOKKAAT` ja kori-rajapinta
   (`kaupunkiKori`, `valitseKaupunkiKori`). Studioon oma lohko
   "Kaupunkien omat äänitykset" maanosan alle; valinnat kulkevat myös
   Kopioi- ja Tuo-napeissa.
7. ✅ `js/ambience-stream.js`: kaupungin oma äänitys ensin, tyyppikori
   varalle. Vanha "kaupunkikohtaisia valintoja ei ole" -päätös kumottu.
8. ✅ Peilattu. Peiliin menevät äänet leikataan kolmeen minuuttiin
   (omistajan linjaus): `tools/leikkaa-mp3.mjs` katkaisee kehysrajalta
   koodaamatta uudelleen, joten ffmpegiä ei tarvita eikä laatu muutu.
   Manifestiin jää `leikattu`-merkintä, jotta uusintajo ei luule
   lyhennettyä tiedostoa katkenneeksi.
9. **TEKEMÄTTÄ: sama Afrikalle.** Omistajan päätös 1.8.2026: tehdään
   myöhemmin. Työkalu ja pelin puoli ovat valmiit, joten jäljellä on
   ajo (`--maanosa africa`), karsinta ja peilaus.

   Afrikan tilanne on lievempi kuin Euroopan oli, mutta ei kunnossa —
   sen 39 kaupunkia jakavat tyyppikorit näin:

       meri       10 kaupunkia · 6 ääntä
       savanni     9 kaupunkia · 6 ääntä
       aavikko     7 kaupunkia · 5 ääntä
       sademetsa   6 kaupunkia · 5 ääntä
       basaari     5 kaupunkia · 2 ääntä
       ylanko      2 kaupunkia · 1 ääni

   Pahimmat kohdat ovat ylänkö ja basaari. Jos aikaa on vähän, ne
   kannattaa tehdä ensin.

### Reunaehdot

- Aloituskohdan arvonta on jo tehty — älä koske siihen.
- Etusivun ääni on tarkoituksella vakio ja puolet hiljaisempi.
- Äänet ovat isoja: peilaus kestää, ja aikaraja on 20 min tiedostoa
  kohti syystä.
- Kolmen minuutin katko ja ambienssin 45 sekunnin loppuvara kuuluvat
  yhteen: aloituskohta arvotaan väliltä 0–135 s. Jos katkoa lyhennetään,
  tarkista `LOPPUVARA_S` (js/ambience-stream.js).


## Paketti 18: Katso kuva -linkit Afrikan havaintoihin — VALMIS

Omistajan toive: kun havainto kuvailee ilmiötä ("tulivuori jolla kaksi
kraatterijärveä", "kallioihin hakatut kirahvit"), pienestä linkistä
pitäisi aueta kuva siitä. Mekanismi on valmis (#99): placeFacts-faktalle
voi antaa `wiki`-kentän (Wikipedia-artikkelin otsikko), jolloin
tietokorttiin ilmestyy "Katso kuva" -linkki. Se avaa artikkelin kuvan,
tiivistelmän ja kuvagallerian. Esimerkit: africa-questions.js:n faktat
Leptis Magna, Tadrart Acacus, Assekrem, Sudd, Kenkänokka, Deriba Caldera.

Tehtävä: käy KAIKKI `AFRICA_FACTS`-faktat läpi ja lisää `wiki`-kenttä
niihin, joissa on selvästi kuvautuva kohde tai ilmiö. Säännöt:

- Vain kun faktassa on konkreettinen katsottava asia (rakennus,
  luonnonmuodostuma, eläin, esine). Yleistunnelmalle ei linkkiä —
  tavoite on ehkä 1 linkki per kaupunki, ei joka faktalle.
- Otsikko suomeksi jos artikkeli on olemassa fi-Wikipediassa (esim.
  'Kenkänokka'), muuten englanniksi ('Deriba Caldera'). Haku kokeilee
  fi → en. Väärä otsikko ei kaada mitään (dialogi sanoo ettei tietoja
  saatu), mutta älä arvaa: jos et ole varma artikkelin nimestä, jätä
  linkki pois.
- Merkkijonofakta muuttuu olioksi: `{ text: '...', wiki: 'Otsikko' }`.
  `voice`- ja `source`-kentät säilytetään jos ovat.
- Testit ajetaan (`node --test tests/rules.test.mjs`) — placeFacts-testi
  tarkistaa wiki-kenttien muodon. Versionostot ja standalone kuten aina.

## Paketti 19: matkamuistot aarrepalkinnoiksi (Afrikka)

Omistajan toive: palkinto voisi välillä olla muutakin kuin jalokivi —
matkamuisto: voodoo-esine, taideteos, upea matto, sormus, pergamentti…
Osa muutetaan heti rahaksi, osa jää muistoesineiksi laukkuun. Sormusta
tai pergamenttia "voisi ehkä käyttää myöhemmin jossain hyväksi" — sitä
EI toteuteta vielä, mutta esineille varataan `id`, jotta myöhempi käyttö
on mahdollista.

- **Uusi laattaluokka `muisto`** (js/tokens.js): Afrikka-teemaiset
  esineet, esim. tuaregin hopeasormus, vodun-veistos (Orjarannikko),
  kelim-matto, ebenpuinen naamio, pergamenttikäärö Timbuktusta,
  strutsinsulka. Jokaisella: `id`, `name`, lyhyt `kuvaus` (mistä esine
  kertoo — opetuksellinen rivi), `arvo` (puntina; 0 = pelkkä muisto).
- **Jakauma:** korvaa laattajakaumasta (counts) osa jalokivistä ja
  tyhjistä muistoilla — esim. 3–4 muistolaattaa per lauta. Tyhjien määrä
  saa laskea: "isoisän vanhentunut merkintä" on pettymys, muisto ei.
- **Paljastus:** arvollinen muisto myydään heti ("Löysit: kelim-matto —
  kauppias maksaa siitä 150 puntaa"), arvoton jää matkasaaliiseen
  ("Löysit: tuaregin hopeasormus — se jää laukkuusi"). Muistot näkyvät
  passin matkasaaliissa omina esineinään.
- **Kuvitus:** drawTokenIcon-tyylinen piirros jokaiselle esineelle
  (tokens.js:n käsin piirretty tyyli, ei emojia) + paljastuskiekon kuva.
- **Tallennus:** vanha tallennus toimii ennallaan (uusia tyyppejä vain
  lisätään; puuttuvat kentät oletuksiin).
- **Testit:** laattajakauman summa ennallaan, jokaiselle muistolle on
  piirros ja kuvaus, arvot kohtuullisia (0–300 p). Versionostot ja
  standalone kuten aina.

## Paketti 17: ambienssi — taustaäänimaisema kohteen mukaan — VALMIS

Omistajan toive: hiljainen taustaääni, jossa tuulen suhinaa ja välillä
muita luonnon tai kaupungin ääniä, ja tyyppi vaihtuu kohteen mukaan.
Toteutus Web Audiolla ilman tiedostoja (js/sound.js).

- **Tyypit (muutama, kierrätetään):** `aavikko` (matala tuulen suhina,
  hiekan rahinaa puuskissa), `meri` (aaltojen kohina paisuen ja
  laantuen, harva lokinhuuto), `sademetsa` (sirinä, satunnaiset
  vesipisarat, kaukainen linnun vihellys), `savanni` (heinäsirkat,
  kuiva tuuli), `ylanko` (ohut viima), `basaari` (VAIKEIN — ei
  yritetä puhetta: vaimeita kulkusia, kavionkopsetta ja etäistä
  rytmiä harvakseltaan). Kaikki HYVIN hiljaisia (gain ~0.03–0.05):
  ambienssin kuuluu huomata vasta kun se lakkaa.
- **Rakenne:** jatkuva pohja (suodatettu kohina hitailla LFO:illa) +
  satunnaisia tapahtumia pitkin, epäsäännöllisin välein (8–30 s) —
  Math.random käy, äänet eivät ole pelitilaa.
- **Data:** Afrikan kaupungeille `ambience`-kenttä (africa.js cities);
  muut laudat myöhemmin, ilman kenttää ambienssia ei soiteta.
  Vaihto ristihäivytyksellä (~2 s) kaupungin vaihtuessa; merellä
  liikuttaessa aina `meri`.
- **Reunaehdot:** käynnistys vasta käyttäjän eleestä (iOS), ei saa
  kuulua dialogien tai kirjoituskoneen yli, sfx.enabled sammuttaa,
  akku: yksi yhteinen kohinapuskuri ja vähän solmuja. Savutesti:
  jokainen tyyppi käynnistyy ja sammuu ilman virhettä.

## Paketti 15: lentorepliikkien tunnelataus (pieni paketti) — VALMIS

Omistajan palaute: lentorepliikeistä puuttui innostunut hehkutus —
moni rivi on toteava fakta ilman tunnetta. Käy `texts.flightLines` ja
`texts.flightDefault` läpi (maailma + africa) ja lataa jokaiseen riviin
aitoa innostusta tai jännitystä: nuori herra on ensimmäistä kertaa
elämässään matkalla, ja jokainen lento on hänelle tapaus. Fakta saa
jäädä, mutta se ei riitä yksin — rivin pitää hehkua. Keinoja: huudahdus,
kiihtynyt rytmi, aistihavainto ikkunasta, isoisän kirjan sivun ääneen
ihmettely. Tarina.md:n säännöt pätevät (1–2 virkettä, minä-muoto, ei
kohdemaiden pilkkaa). Testit ja versionostot kuten aina.

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
> kukkarollinen puntia ja kulunut matkakirja:
> "Maailman ympäri kahdeksassakymmenessä päivässä".
>
> Viimeinen sivu oli revitty kesken lauseen: "…voinut uskoa, siellä olikin…"
>
> Hetkinen… Mitä hän oli löytänyt?
>
> Juoksin kentälle kirja kädessäni ja mietin enää yhtä asiaa:
>
> mistä aloitan?

(Päivitetty 30.7.2026 omistajan uuteen muotoiluun: päiväkirjasta tuli
matkakirja — sama esine kuin sovelluksen nimi — ja loppu tiivistyi
juoksuksi kentälle. "Mistä aloitan?" johtaa suoraan laudan valintaan.)

(Päivitetty 29.7.2026 omistajan kanssa yhdessä: revitty sivu näyttää
katkoksen konkreettisesti, eikä pääaarretta nimetä — se on "jotain
suurempaa", joka jää pelin selvitettäväksi. Irti revitty sivu on
mahdollinen tuleva juonikoukku. "Napauta kaupunkia kartalla" -rivi
poistettu.)

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

## Paketti 14: Indiana Jones -lentoanimaatio (paketin 13 jälkeen) — VALMIS

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

## Paketti 16: äänet oleellisesti paremmiksi (js/sound.js) — VALMIS

Omistajan kysymys "voiko ääniä parantaa oleellisesti?" — voi. Pysytään
Web Audiossa ilman äänitiedostoja (offline ja standalone säilyvät
kevyinä, ja synteesi istuu käsintehtyyn estetiikkaan). Kolme tasoa:

1. **Tila (suurin yksittäinen parannus).** Generoitu kaiku:
   ConvolverNode, jonka impulssivaste on eksponentiaalisesti laskeva
   kohinapulssi (~1.2 s). Kaikki äänet ajetaan sen läpi (dry/wet-suhde
   ~0.25). Masteriin DynamicsCompressorNode pehmeillä asetuksilla.
2. **Materiaalit.** Äänet rakennetaan kuulostamaan esineiltä:
   - noppa: kohinapurske 2–3 resonoivan bandpass-suodattimen läpi
     (~180/290/430 Hz) = puinen kopsahdus pergamentilla; pomput
     hiljenevät ja kiristyvät.
   - tähti/jalokivet: epäharmoniset kellopartiaalit (soittorasia) —
     esim. perustaajuus + 2.76x + 5.4x omilla vaimenemisillaan.
   - kolikko: FM-synteesi (modulaattori ~3.5x kantoaalto, nopea
     vaimennus) = metallinen kilahdus.
   - passin leima: matala siniläiskä (~80 Hz) + kohinaklikki.
   - lento: potkurihurina koko kalvokohtauksen ajaksi — saha-aalto
     alipäästön läpi, LFO moduloi voimakkuutta ~14 Hz, nousee ja
     laskee kohtauksen mukana (kesto FLY_OVERLAY_MS).
   - laiva: kaksi hieman eri vireistä kanttiaaltoa alipäästön läpi =
     sumutorvi; oikea/väärä vastaus: lyhyt puhdas terssi / vaimea
     matala "hmph" ilman piippausta.
3. **Väsymisen esto.** Jokaiseen soittoon ±3 % satunnainen vire- ja
   voimakkuusheitto (Math.random käy — äänet eivät ole pelitilaa).
   Usein toistuvat äänet (askel, klikki, kirjoituskone) pidetään
   erityisen hiljaisina ja lyhyinä.

Reunaehdot: ei uusia tiedostoja eikä riippuvuuksia; sfx-rajapinta
(play-nimet) säilyy, jotta ui.js ei muutu paitsi lennon
aloitus/lopetus (esim. sfx.startFlight()/stopFlight() tai kesto
parametrina); äänet luodaan laiskasti käyttäjän eleestä kuten nyt
(iOS vaatii); kokonaisvoimakkuus ei saa nousta nykyisestä.
Kuuntele oikeasti: aja peli Playwrightilla ja tallenna ääninäyte tai
vähintään tarkista konsolista, ettei soitto heitä virheitä millään
äänellä. Versionostot ja testit kuten aina (sound.js:lle savutesti:
jokainen SOUNDS-nimi soi ilman poikkeusta OfflineAudioContextissa).

## Muistilista jokaiseen pakettiin

- `npm test` vihreänä; uudet ominaisuudet saavat omat testinsä.
- Versionosto sw.js + main.js.
- `node tools/build-standalone.mjs` onnistuu (uudet tiedostot myös
  MODULES-listaan ja sw.js SHELL-listaan).
- Kuvakaappaus ennen/jälkeen, jos muutos näkyy ruudulla.
- Suomenkieliset commit-viestit; pienet PR:t, yksi paketti per PR.
