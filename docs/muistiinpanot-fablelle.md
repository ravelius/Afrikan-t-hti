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

## 3. Muuta kirjattavaa

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
