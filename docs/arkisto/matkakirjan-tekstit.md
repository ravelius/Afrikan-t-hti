> **ARKISTOITU 8.8.2026 — ei ohje.** Vanhentunut suunnitelma tai
> kertaraportti; säilytetty historian vuoksi. Voimassa olevat ohjeet:
> docs/roolitus.md ja CLAUDE.md.

# Matkakirjan merkinnät — tilanne ja avoimet kysymykset

*Kirjoitettu Fablelle 3.8.2026. Tämä ei ole ohje vaan tilannekuva:
mitä on, mikä on rikki, ja mitä pitää päättää ennen kuin kirjoitetaan
yhtään uutta riviä.*

Omistaja pysäytti uusien merkintöjen kirjoittamisen. Syy hänen
sanoillaan: *"Teksti on myös vähän liian pitkä ja vaikeaselkoinen.
Täytyy vielä miettiä näitä matkakirjan tekstejä."*

Kaikki muu sisältötyö jatkuu — vain nämä ovat tauolla.

---

## Mistä on kyse

Kun pelaaja saapuu kaupunkiin, kartan päälle avautuu paneeli
otsikolla **MATKAKIRJASTA**. Siinä on kaksi ääntä peräkkäin:

- **kuvaus** — nuori herra Fogg kertoo mitä näkee, minä-muodossa
- **nosto** — isoisän merkintä vuodelta 1873, lainausmerkeissä, ja
  usein Foggin lyhyt kommentti siihen

Tekstit ovat tiedostoissa `js/packs/*-saapumiset.js`, avaimena
kaupungin tunnus.

---

## Mittaukset

143 merkintää. Pituus merkkeinä:

| | kuvaus | nosto | yhteensä |
|---|---|---|---|
| äänitetyt (48) | 233 | 175 | **408** |
| äänittämättömät (95) | 332 | 180 | **512** |

Pisin on Odessa, 767 merkkiä.

**Tämä taulukko on tärkein asia koko dokumentissa.** Äänitetyt
tekstit ovat neljänneksen lyhyempiä kuin myöhemmin kirjoitetut. Ne
kirjoitettiin ääneen luettaviksi, ja korva ei kestä pitkää virkettä —
se pakotti tiiviyteen. Myöhemmät kirjoitettiin silmälle, eikä mikään
enää rajoittanut.

Omistaja huomasi eron ilman että kukaan mittasi sitä.

---

## LUKITUT 48 — älä koske näihin

Näille kaupungeille on **jo generoitu kertojan luenta**, ja äänite on
repossa (`assets/audio/puhe-<lauta>-saapuminen-<id>.mp3`). Ruudulla
lukevan tekstin on vastattava äänitettä **sanatarkasti**.

- Afrikka: 39 kaupunkia
- Eurooppa: 9 kaupunkia (Lontoo, Pariisi, Rooma, Ateena ja viisi muuta)

Lista on `js/ui.js`:n `SAAPUMISLUENNAT`-joukossa.

**Tämä ansa on jo lauennut kerran.** Elokuun 1. päivänä Pariisin ja
Lontoon tekstit palautettiin äänitteestä sanatarkasti ja lisättiin
tiedoston alkuun. Alempana tiedostossa oli kuitenkin vanha versio
samalla avaimella. JS ei valita kaksoisavaimesta — se pitää
jälkimmäisen. Palautus ei siis koskaan tullut voimaan, ja ruudulla luki
kuukauden eri asia kuin kertoja luki ääneen.

Nyt `tools/tarkista-kaksoisavaimet.mjs` vahtii sitä. Aja se aina, jos
kosket näihin tiedostoihin.

Jos lukittu teksti halutaan muuttaa, **äänite on generoitava uudelleen**
— ja se on omistajan päätös, ei meidän.

---

## VAPAAT 95 — nämä voi kirjoittaa uusiksi

Loput 95 ovat ilman äänitettä. Ne ovat myös keskimäärin pisimmät.
Tässä joukossa uudelleenkirjoitus ei riko mitään.

---

## Toinen vika samassa paneelissa: kuva katoaa

Omistaja: *"Täältä puuttuukin vielä matkakirjan kuvat kokonaan."*

Kuva ei puutu aineistosta. Tarkistin: kaikki 537 pakettien kuvaa ovat
peilissä, myös Tallinnan.

Vika on yhdessä rivissä (`js/ui.js:1005`):

```js
this.factTekstiRivi?.classList.toggle('vieritetty', el.scrollTop > 4);
```

Pikkukuva on 54 × 42 pikseliä paneelin oikeassa yläkulmassa, ja se
häivytetään heti kun tekstiä vierittää neljä pikseliä. Perustelu oli,
ettei teksti kulkisi kuvan alta.

Seuraus: **kuva näkyy vain niin kauan kuin et ole lukenut mitään.**
Ja koska merkintä on 400–800 merkkiä, vierittämään joutuu heti.

Kuva ja teksti kilpailevat samasta tilasta, koska ne ovat samassa
laatikossa päällekkäin. Se on korjattava ennen kuin tekstin pituudesta
kannattaa päättää mitään — pituus riippuu siitä, paljonko tilaa
tekstille jää.

---

## Avoimet kysymykset

Nämä pitää päättää ennen kirjoittamista, ei sen jälkeen.

**1. Mikä on merkinnän tehtävä?**
Nyt se yrittää olla kolme asiaa yhtä aikaa: tunnelmakuvaus,
tietopaketti ja isoisän ääni. Kolmesta yksi olisi luettavampi.

**2. Näytetäänkö isoisä heti?**
Nosto on keskimäärin 178 merkkiä eli reilu kolmannes koko
paneelista. Jos se avautuisi vasta pyydettäessä, näkyvä teksti
lyhenisi kolmanneksella ilman että mitään katoaa.

**3. Mikä on tavoitepituus?**
Äänitetyt 408 merkkiä toimivat. Se on mitattu tosiasia eikä arvaus,
ja se on hyvä lähtökohta ylärajalle.

**4. Kuuluuko kuva tekstin ylle vai viereen?**
Ylle mahtuu leveämpi kuva eikä sitä tarvitse häivyttää. Viereen jää
kapea palsta, jota puhelimella on vaikea lukea.

**5. Mitä tehdään lukituille 48:lle?**
Joko ne jäävät sellaisiksi kuin ovat (ja kokoelmassa on kahta eri
mittaa), tai äänitteet generoidaan uudelleen. Jälkimmäinen on
omistajan päätös, koska hän on linjannut ettei puheääniä generoida
tällä hetkellä lainkaan.

---

## Mitä EI kannata tehdä

**Älä aloita kirjoittamalla.** 143 tekstiä väärään muottiin on
kalliimpi virhe kuin yksikään tässä dokumentissa mainittu vika.

**Älä mittaa keskiarvoa tiedostosta.** Tässä projektissa se on
tuottanut vääriä hälytyksiä kolme kertaa. Jos haluat tietää onko
teksti liian pitkä, katso sitä puhelimen kokoisella ruudulla.

**Älä luota siihen, että näkyvä oire kertoo vian koon.** Päivityspalkki
näytti käyttöliittymävialta ja oli arkkitehtuurivika. Kuvan puuttuminen
näytti aineistopuutteelta ja oli yhden rivin ehto.

---

## KOHDEYLEISÖ: AIKUISET

*Lisätty 3.8.2026 omistajan tarkennuksen jälkeen.*

Omistaja: *"tämä nykyinen versio on aikuisille. lapsille voidaan tehdä
kevennetty versio sitten myöhemmin."*

Tämä on tärkeämpi kuin se näyttää, koska olin olettanut päinvastoin ja
ohjannut apureita sen mukaan.

**Mitä se tarkoittaa käytännössä:**

| asia | lapsille | aikuisille |
|---|---|---|
| täsmällinen nimi | selitettävä | **arvo sinänsä** |
| vieras sana | vältettävä | opettaa jotain |
| eettinen epämukavuus | pehmennettävä | **koko pointti** |
| tietotiheys | kevennettävä | kestää |

**Mikä EI muutu.** "Liian pitkä ja vaikeaselkoinen" tarkoittaa yhä
liian pitkää ja vaikeaselkoista. Aikuinenkaan ei lue 600 merkkiä
tiheää kirjoituskonefonttia puhelimen ruudulla mielellään.
*Vaikeaselkoinen* on eri asia kuin *vaativa*: vaativa teksti palkitsee
lukijan, vaikeaselkoinen vain väsyttää.

**Konkreettinen esimerkki siitä, mikä kääntyi väärinpäin.** Aarteiden
arvioinnissa yksi tuomari katsoi kymmenvuotiaan silmin ja moitti
nimeä "Kali Gandakin shaligram-ammoniitti" museon luettelokortiksi.
Ehdotus tilalle oli "Kivi, jonka sisällä on kiertynyt kaari".

Aikuiselle jälkimmäinen on huonompi. Se kiertää nimen, jonka esine
oikeasti kantaa, eikä opeta mitään. Aloitin kolmannen kierroksen
ohjeella, joka kielsi sanat "joita kymmenvuotias ei ymmärrä ilman
selitystä" — ja pysäytin sen tämän tarkennuksen jälkeen.
