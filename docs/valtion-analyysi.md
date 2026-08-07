# Valtion analyysi — "Maa numeroina" -sivu ja Vertailulinssi

Omistajan tilaus 6.8.2026, pohjana ChatGPT:n kanssa hahmoteltu idea.
Tämä on sitova suunnitelma: erillinen toteutussessio tekee tämän
kokonaan, vaiheittain, talon julkaisukaavalla. Opuksen lehtijonoon
tämä EI kuulu — kun data on paikallaan, sivu syntyy jokaiselle
maalle itsestään ilman käsityötä.

## Idea yhdessä kappaleessa

Lehden maaosasto saa jatkokseen "Maa numeroina" -sivun: muutama
huolella valittu aikasarja (väestö, talous, elinikä, ympäristö)
piirrettynä pelin muste+kulta-tyylillä, jokaisen käyrän alla
sääntöpohjainen sanallinen tulkinta pelin äänellä, ja jokaisessa
käyrässä Suomi himmeänä vertailuviivana. Lisäksi uusi varuste,
Vertailulinssi, jolla pelaaja voi asettaa kaksi maata rinnakkain
samoille asteikoille. Tunne, jota tavoitellaan: "tämä maa vanhenee
nopeasti", "tämä maa kaupungistui yhdessä sukupolvessa" — ei
tilastotaulukko vaan oivallus.

## Mikä pelissä on jo valmiina (rakenna näiden päälle)

- **Maaosaston tunnusluvut** (js/packs/*-maatiedot.js): pinta-ala,
  väkiluku, demokratiaindeksi (V-Dem) sijoituksineen ja
  palkkeineen. "Maa numeroina" on tämän luonteva jatko, ei
  korvaaja.
- **Vuosisään SVG-graafi** (js/saa.js): käsin piirretty käyrä
  muste+kulta-tyylillä, kuukausinormaalit. Sama piirtotapa ja
  typografia kelpaavat aikasarjoille lähes sellaisenaan — älä
  keksi uutta grafiikkakieltä.
- **Staattisten pakettien generointiputki**: tools/-skriptit
  hakevat datan kerran ja kirjoittavat repoon (esim.
  tools/hae-ilmasto.mjs, tools/hae-maaluvut.mjs). Pelin aikana ei
  tehdä API-kutsuja tilastopalveluihin.
- **tools/hae-maaluvut.mjs** hakee jo Maailmanpankista tuoreimmat
  poikkileikkausluvut lämpökarttalinssille
  (js/packs/linssi-maaluvut.js). Uusi työkalu saa kopioida sen
  hakulogiikan (maakohtainen tuorein havainto, vuosi mukaan) —
  mutta se on ERI tiedosto, koska tämä tarvitsee koko aikasarjat.
- **Varusteet-järjestelmä**: lämpökarttalinssi on jo varuste, joka
  muuttaa maailmankartan esitystä. Vertailulinssi on saman perheen
  jäsen.

## Mittarit (karsittu ~18 ehdokkaasta seitsemään)

Ensimmäiseen vaiheeseen vain mittarit, jotka lapsi voi ymmärtää
käyrän muodosta ja joissa muoto kertoo tarinan:

1. **Väestöpyramidi** (5 v ikäluokat, miehet/naiset) — ainoa uusi
   piirtokomponentti.
2. **Väkiluku 1950 → nyt → 2050-ennuste** (ennusteosa
   katkoviivalla tai himmeämmällä musteella).
3. **BKT/asukas, pitkä käyrä** (ostovoimakorjattu).
4. **Elinajanodote.**
5. **Kaupungistumisaste** (% väestöstä kaupungeissa).
6. **CO₂/asukas.**
7. **Demokratiaindeksi** — on jo pelissä (V-Dem), näytetään tässä
   yhteydessä uudelleen, ei haeta uudestaan.

POIS ensivaiheesta (perusteluineen, ettei niitä lisätä vahingossa):
inflaatio ja työttömyys (hetkilukuja, käyrä ei kerro lapselle
mitään), valtionvelka (vaatii kontekstin jota sivu ei ehdi antaa),
Gini ja korruptio (tulkinta liian monimutkainen tähän muotoon).
Niitä voi harkita myöhemmin Vertailulinssin lisämittareiksi.

## Sanalliset tulkinnat

Jokaisen käyrän alla yksi lause pelin kertojan äänellä,
sääntöpohjaisesti valittu (ei generoitu ajossa): esim. pyramidista
"Joka kolmas egyptiläinen on alle 15-vuotias — maa on nuori" tai
"Japanissa isovanhempia on pian enemmän kuin lapsia". Säännöt
kirjoitetaan koodiin (kynnysarvot + lausepohjat), jotta sama
logiikka toimii kaikille ~200 maalle ilman käsityötä. Lauseiden
sävy: utelias ja lämmin, ei arvottava — "maa vanhenee" on
havainto, ei ongelma.

## Suomi-vertailuviiva

Jokaisessa käyrässä (paitsi pyramidissa) Suomi piirretään aina
himmeänä ohuena viivana taustalle, ilman varustetta. Tämä on
suunnitelman pedagoginen ydin: absoluuttinen luku ei kerro lapselle
mitään, mutta "meihin verrattuna" kertoo heti. Pyramidiin Suomen
saa halutessaan pienenä varjokuvana nurkkaan — kokeillaan
pilotissa, jätetään pois jos ahdas.

## Vertailulinssi (varuste)

Uusi varuste avaa vapaan vertailun: pelaaja valitsee toisen maan,
ja sivu piirtää molemmat samoille asteikoille (Suomi-viiva säilyy
kolmantena). Ilman varustetta vertailu on aina Suomi; varuste tuo
valinnan vapauden. Löytyminen ja hinta päätetään varusteiden
yleisen mallin mukana (docs/tyolista-opukselle.md, aarteet ja
varusteet) — tämä suunnitelma ei lukitse sitä.

## Datalähteet ja lisenssit

- **Maailmanpankin API** (avoin, avaimeton, CC BY 4.0): BKT/asukas
  (NY.GDP.PCAP.PP.KD), elinajanodote (SP.DYN.LE00.IN),
  kaupungistumisaste (SP.URB.TOTL.IN.ZS), CO₂/asukas
  (EN.ATM.CO2E.PC tai seuraaja) — kaikki yhdestä rajapinnasta
  aikasarjoina. Hakutapa kuten tools/hae-maaluvut.mjs:ssä.
- **UN World Population Prospects** (CC BY 3.0 IGO):
  väestöpyramidit, väkiluvun historia 1950– ja ennuste 2050.
  Koneluettava CSV-jakelu; ellei suora lataus onnistu ilman
  kirjautumista, OWID:n peilaamat WPP-sarjat käyvät (lähderiviin
  silti UN WPP).
- **V-Dem**: jo pelissä (maatiedot-paketit) — ei uutta hakua.
- **Our World in Data**: tarkistuslähde, jolla pistokokein
  varmistetaan että omat luvut ovat samaa suuruusluokkaa.

Lähderivi sivulle samaan tapaan kuin kuvissa: esim. "Maailmanpankki
ja UN WPP, haettu 8/2026" — hakupäivä tulee datatiedostosta, ei
käsin kirjoitettuna.

## Datan muoto ja koko

- ~200 maata × 7 mittaria × ~70 vuotta ≈ 1–2 Mt minimoituna.
- Kirjoitetaan tiedostoon **assets/data/maakayrat.json** (EI
  js/packs/-moduuliksi): ladataan laiskasti vasta kun pelaaja avaa
  ensimmäisen "Maa numeroina" -sivun, ja service worker
  välimuistittaa sen kuten muutkin assetit.
- Nimi on maakayrat, EI maaluvut — js/packs/linssi-maaluvut.js ja
  tools/hae-maaluvut.mjs ovat eri asia (poikkileikkaus linssille)
  ja jäävät ennalleen.
- Standalone-versioon (tools/build-standalone.mjs) tätä EI upoteta
  — se on jo ~6,5 Mt. Standalonessa sivu näyttää kohteliaan
  "tarvitsee verkkoyhteyden ensimmäisellä avauksella" -rivin, jos
  dataa ei ole välimuistissa.
- Uusi työkalu **tools/hae-maakayrat.mjs**: hakee kaiken yllä
  mainitun, kirjoittaa hakupäivän ja lähteet tiedoston alkuun,
  tukee --kuiva-lippua kuten hae-maaluvut.mjs. Aukot jätetään
  aukoiksi (käyrä katkeaa) — ei interpolointia.

## Sijainti pelissä

- **Lehtikaupungit**: "Maa numeroina" on lehden maaosaston jatko —
  oma arkkisivunsa lehden sivunumeroinnissa, sama painopaperi,
  palstataitto ja alanavigointipilleri kuin muilla arkeilla.
- **Muut maat** (ei lehteä): sama sisältö maalohkon jatkona
  nykyisten tunnuslukujen perään, kevyemmässä kehyksessä.
- **"Silloin ja nyt" -kytkös** (oma lisä): väkilukukäyrään
  merkitään pieni jälki isoisän matkan aikakauteen — "isoisän
  käydessä täällä asukkaita oli X miljoonaa, nyt Y" — sitoo
  numerot pelin tarinaan.

## Toteutusjärjestys (yksi PR per vaihe)

1. **Datatyökalu + pilottidata**: tools/hae-maakayrat.mjs ja
   assets/data/maakayrat.json vain lehtimaille (ITA, EGY, GBR,
   ESP + FIN vertailuviivaa varten). Testit datan muodolle.
2. **"Maa numeroina" -sivu pilottiin**: käyrät (saa.js-tyyli),
   pyramidi, tulkintalauseet, Suomi-viiva, lähderivi. Playwright
   390/834/1024 px.
3. **Kaikki ~200 maata**: aja työkalu täydellä listalla, tarkista
   koko ja aukkojen käsittely, kytke ei-lehtimaiden maalohkoon.
4. **Vertailulinssi**: varuste + kahden maan rinnakkaisnäkymä.
5. **Monistusohjemerkintä**: docs/tutki-aiheet.md:hen rivi, että
   uusi lehtimaa EI vaadi tämän sivun eteen mitään — sivu syntyy
   maakayrat.json:sta itsestään.

## Riskit ja niiden lievitys

- **Data vanhenee**: hakupäivä kirjataan dataan ja näytetään
  lähderivillä; työkalun voi ajaa uudelleen milloin vain ja
  julkaista datapäivityksen ilman koodimuutoksia.
- **Väestöpyramidi on ainoa uusi piirtokomponentti** — tehdään
  pilotissa ensin, jotta muoto ehtii hioutua ennen 200 maata.
- **CO₂-indikaattorin tunnus on Maailmanpankissa vaihtunut**
  aiemmin — työkalun pitää tarkistaa että sarja palauttaa dataa,
  ja kaatua äänekkäästi jos ei (ei hiljaista tyhjää käyrää).


## VAIHE 6 (v321): vertailu muutti kartalle

Omistajan päätös 7.8.2026: *"vertailulinssi vois toimia hieman eri
tavalla kuin nyt. eli ei upoteta näkymää tutki osioon vaan linssi
toimisi suoraan karttanäkymässä mutta muuttaisi sen niin että
kaupungit poistuisivat ja maiden rajat näkyisivät selvemmin. pelaaja
voisi valita nyt maksimissaan kolme maata ja lisäksi olisi valmiina
vaihtoehtona suomi."*

### Mitä tehtiin

- **Vertailutila kartalla** (`js/ui.js` `tahdistaVertailu`): linssi ei
  piirrä kerrosta vaan ottaa karttanäkymän tilaksi radiotilan mallin
  mukaan. Kaupungit, laatat, nappulat ja kohteet piilotetaan bodyn
  luokalla `vertailu-tila`; maiden muodot piirretään omaan kerrokseen
  (`piirraVertailuMaat`) tummemmalla rajaviivalla ja nimillä.
  Reittiviivat jäävät: ne ovat osa staattista karttataidetta, joka
  rasteroidaan bittikartaksi, eikä css saa siihen otetta.
- **Valinta kartalta**: napautus valitsee maan, uudelleen napautus
  poistaa. Enintään neljä valintaa — kolme maata ja Suomi, joka
  asetetaan valmiiksi jos laudalla on Suomen muoto. Valitut punaisella.
- **Alapalkki** korvaa Tutki- ja nopanheittonapit: värilappu maittain
  (napautus poistaa) ja oikeassa reunassa Vertaa-nappi, joka aukeaa
  kahdesta maasta alkaen.
- **Vertailunäkymä** (`js/maakayrat.js` `piirraVertailu`): ylhäällä
  maiden napit (kytke käyrä päälle/pois) ja "Muuta valintoja" takaisin
  kartalle, sitten maakortit — pienoiskartta ja tunnusluvut samassa
  muodossa kuin Tutki-ikkunan maaosaston alussa — ja niiden alle
  käyrät samoilla asteikoilla. Arkki on ruudun kokoinen, ja vasta
  1400 pikselistä ylöspäin kartta jää sumeana laidoille.
- **Neljä väriä** (`VERTAILUVARIT`): kulta, punaruskea, sammalvihreä ja
  merimuste. Sama väri kartalla, alapalkissa ja käyrässä. Lista on
  toisintona `js/ui.js`:ssä, koska palkki tarvitsee värit ennen kuin
  laiskasti tuotu `maakayrat.js` on ladattu — testi vahtii, etteivät
  listat eriydy.

### Mikä poistui

Maa numeroina -sivun vertailuvalitsin. Sivu on taas yhden maan sivu,
jolla Suomi kulkee himmeänä vertailuviivana — kuten ennen linssiä.

### Mitä jäi tekemättä

Väestöpyramidi ja sanalliset tulkinnat eivät ole vertailunäkymässä: ne
kertovat yhdestä maasta kerrallaan, eikä neljää pyramidia voi lukea
rinnakkain samasta kehyksestä. Ne ovat yhä yhden maan sivulla.
