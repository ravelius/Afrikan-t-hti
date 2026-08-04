# Maastonimien tekstit — kirjoitusohje

*Kirjoitettu 4.8.2026. Tämän ohjeen voi antaa agentille sellaisenaan:
se sisältää muodon, äänen, lähteet, hakukomennot ja tarkistuksen.*

Omistaja 4.8.2026:

> "Kirjoita vuorien ja jokien ja muiden infotekstit uudestaan. Ne
> taitavat olla nyt suoraan Wikipediasta ja ovat liian pitkiä. Niitä
> voisi myös vähän elävöittää käyttämällä lainauksia ja ripottelemalla
> kuvia tekstin sekaan. Täysi Wikipedia-teksti, joka on jo tehty, voisi
> olla vaikka sitten lopussa pienen linkin takana."

Kohteita on 213: **123 jokea, 38 järveä, 52 vuoristoa.** Kymmenen on jo
kirjoitettu malliksi tiedostoon `js/packs/maasto-tekstit-malli.js`.
Loput 203 kirjoitetaan tämän ohjeen mukaan.

**Lue malli ennen kuin kirjoitat rivinkään.** Ohje kertoo säännöt, malli
näyttää mihin ne johtavat. Jos nämä kaksi ovat ristiriidassa, malli
voittaa — ja kerro ristiriidasta.

---

## 0. Yhden kappaleen tiivistelmä

Kirjoitat jokaiselle kohteelle 2–3 lyhyttä kappaletta, yhden todellisen
aikalaislainauksen ja 1–2 Commons-kuvaa, jotka menevät tekstin väliin.
Lainaus on tämän työn ydin ja se on **tarkistettava lähdetekstistä**.
Keksitty lainaus on tämän työn ainoa peruuttamaton virhe.

---

## 1. Mistä on kyse

Maailmankartalla on nimettynä 123 jokea, 38 järveä ja 52 vuoristoa.
Nimen perässä on i-ikoni, joka avaa saman **Lue lisää** -ikkunan kuin
kaupungeilla (`js/ui.js`, `avaaMaastonimi` → `openWikiArticle`).
Ikkunassa näkyy heti nimipaketin `selitys`-kenttä, ja verkosta haettu
Wikipedian tiivistelmä tulee sen tilalle, kun se ehtii.

`selitys` on kirjoitettu Wikipedian pohjalta. Se on oikeaa tietoa mutta
väärää tekstiä: yksi 200–330 merkin möykky tietosanakirjan äänellä.
Esimerkiksi Jangtse:

> Jangtse on Aasian pisin ja maailman kolmanneksi pisin joki; Kiinassa
> siitä käytetään nimeä Changjiang, "pitkä joki". Se laskee Itä-Kiinan
> mereen Shanghain pohjoispuolella.

Kaikki tuossa on totta ja mikään ei jää mieleen. Vertaa mallitiedoston
Jangtseen: Isabella Bird nousee koskia kuudentoista vetäjän voimin,
lainaus kertoo mitä hän kuuli, kuva näyttää solan, ja viimeinen kappale
kertoo että koskia ei enää ole.

---

## 2. Mitä omistat ja mitä et

**Kirjoitat yhden tiedoston.** Nimi on `js/packs/maasto-tekstit-<osa>.js`,
missä `<osa>` on sinulle annettu (ks. luku 3).

**Et koske näihin:**

| tiedosto | miksi |
|---|---|
| `js/ui.js`, `css/styles.css`, `js/mapart.js` | toisen työvaiheen hallussa |
| `js/packs/maasto-nimet-vedet.js`, `-vuoret.js` | `selitys` jää varatekstiksi; nimipaketti on lähde, ei kohde |
| `js/packs/maailmankartta-nimet.js` | koneen kirjoittama, `tee-maastonimet.mjs` tuottaa |
| `package.json` | versionumeroa **ei nosteta** |

Uusi tiedostosi ei riko mitään, vaikka sitä ei olisi vielä kytketty
ikkunaan: `selitys` näkyy siihen asti kuten ennenkin. Kytkennän tekee
ui.js-vaihe.

**Yksi poikkeus: `sw.js`.** Jokaisen `js/packs`-tiedoston on oltava
palvelutyöntekijän SHELL-listalla, tai offline hajoaa —
`tests/sw.test.mjs` skannaa kansion ja punastuu heti. Lisää
tiedostonimesi listaan (`./js/packs/maasto-tekstit-<osa>.js`) samaan
kohtaan, jossa `maasto-tekstit-malli.js` jo on, äläkä muuta muuta
`sw.js`:ssä.

---

## 3. Työnjako

Kuusi osaa, yksi agentti kutakin. Rajat ovat indeksejä lähdetaulukoissa,
jotta kenenkään ei tarvitse arvata missä toisen työ alkaa.

| osa | tiedosto | lähde | kohteita |
|---|---|---|---|
| joet-a | `maasto-tekstit-joet-a.js` | `VESISTONIMET.joet.slice(0, 41)` | 36 |
| joet-b | `maasto-tekstit-joet-b.js` | `VESISTONIMET.joet.slice(41, 82)` | 41 |
| joet-c | `maasto-tekstit-joet-c.js` | `VESISTONIMET.joet.slice(82)` | 41 |
| jarvet | `maasto-tekstit-jarvet.js` | `VESISTONIMET.jarvet` | 36 |
| vuoret-a | `maasto-tekstit-vuoret-a.js` | `VUORISTONIMET.slice(0, 26)` | 24 |
| vuoret-b | `maasto-tekstit-vuoret-b.js` | `VUORISTONIMET.slice(26)` | 25 |

Erotus 41 → 36 ja 26 → 24 tulee siitä, että malli on jo kirjoittanut osan.
Tulosta oma listasi tällä:

```bash
cd /home/user/Matkakirja && OSA=joet-b NODE_USE_ENV_PROXY=1 node --input-type=module -e "
const { VESISTONIMET } = await import('./js/packs/maasto-nimet-vedet.js');
const { VUORISTONIMET } = await import('./js/packs/maasto-nimet-vuoret.js');
const { MAASTO_TEKSTIT_MALLI: M } = await import('./js/packs/maasto-tekstit-malli.js');
const osat = {
  'joet-a': VESISTONIMET.joet.slice(0, 41),
  'joet-b': VESISTONIMET.joet.slice(41, 82),
  'joet-c': VESISTONIMET.joet.slice(82),
  jarvet: VESISTONIMET.jarvet,
  'vuoret-a': VUORISTONIMET.slice(0, 26),
  'vuoret-b': VUORISTONIMET.slice(26),
};
const tehty = new Set(['joet','jarvet','vuoret'].flatMap((l) => Object.keys(M[l] ?? {})));
for (const k of osat[process.env.OSA]) {
  if (tehty.has(k.avain)) continue;
  console.log([k.avain, k.nimi, k.wiki].join(' | '));
}"
```

Vaihda `OSA=` omaksesi. Tulosteen
ensimmäinen sarake on avain, jonka **kopioit sellaisenaan** — älä
normalisoi äläkä käännä sitä.

---

## 4. Tiedoston muoto

```js
export const MAASTO_TEKSTIT_JOET_B = {
  joet: {
    Tigris: {
      kappaleet: [
        { teksti: '…' },
        { lainaus: '…', kuka: '…', teos: '…', vuosi: 1863,
          suomennos: 'oma', linkki: 'https://…' },
        { tiedosto: 'Nimi Commonsissa.jpg', selite: '…', lahde: '…' },
        { teksti: '…' },
      ],
    },
    // …
  },
};
```

Ylin taso on **laji** (`joet`, `jarvet`, `vuoret`), toinen taso on
kohteen **avain**. Jos osasi sisältää vain jokia, kirjoita vain `joet`.

### Miksi kaksitasoinen

Avain `ural` on sekä joki että vuoristo. Yksitasoinen taulu menettäisi
toisen hiljaa — juuri se virhe on tässä projektissa jo kerran maksanut
kuukauden (ks. `docs/matkakirjan-tekstit.md`, kaksoisavaimet).
Kaksitasoisuus on halpa vakuutus.

### Kappaleen kolme muotoa

**`{ teksti }`** — leipäteksti. Ei otsikkoa, ei luetteloa, ei
lihavointia; pelkkää proosaa.

**`{ lainaus, kuka, teos, vuosi, suomennos, linkki }`**

| kenttä | pakko | selitys |
|---|---|---|
| `lainaus` | kyllä | suomennettu lainaus ilman lainausmerkkejä (ikkuna lisää ne) |
| `kuka` | kyllä | kirjoittaja sellaisena kuin hänet tunnetaan |
| `teos` | kyllä | teoksen nimi alkukielellä; kääntäjä perään jos lainaus on käännöksen käännös |
| `vuosi` | kyllä | luku (`1863`) tai merkkijono, jos ajoitus on likimääräinen (`'n. 430 eaa.'`) |
| `suomennos` | kyllä | `'oma'`, tai `'oma, <kielen> käännöksestä'` jos välissä on kääntäjä |
| `linkki` | kyllä | osoite siihen laitokseen, josta luit lainauksen |

**`{ tiedosto, selite, lahde }`**

| kenttä | pakko | selitys |
|---|---|---|
| `tiedosto` | kyllä | Commons-tiedostonimi ilman `File:`-etuliitettä, täsmälleen oikein |
| `selite` | kyllä | 1–3 lausetta siitä, mitä kuvassa on ja miksi se on tässä |
| `lahde` | kyllä | `'Wikimedia Commons (PD)'` tai `'Wikimedia Commons (CC BY-SA 4.0), Tekijän Nimi'` |

**Kenttä on `tiedosto`, ei `kuva`.** Tämä on koko muodon
tärkein yksityiskohta. `tools/peilaa-media.mjs` lukee kaikki
`js/packs`-tiedostot ja poimii kuvat kuviolla `tiedosto: '...'`.
Toisenniminen kenttä ei päädy mediapeiliin, ja peli hakisi kuvan
Commonsilta joka avauksella — lentokoneessa se jäisi hakematta.
Sama koskee heittomerkkejä: `'Château d\'If.jpg'` toimii, koska
poimin osaa purkaa suojauksen, mutta pitkät merkkijonot kannattaa
kirjoittaa hipsuilla `'…'` eikä lainausmerkeillä.

### Mitä EI ole kentissä

- **`avain`** — se on olion avain. Kaksi paikkaa samalle tiedolle
  eriytyy aina.
- **`wiki`** — se on jo kohteella nimipaketissa. Ikkuna hakee Wikipedian
  otsikon sieltä.
- **`selitys`** — sitä ei siirretä eikä kopioida. Se jää paikalleen
  varatekstiksi.

### Järjestys ja määrä

Taulukossa on **4–6 palasta**:

- **2–3** `teksti`
- **1** `lainaus` (2 vain jos toinen on jonkun toisen vastaus ensimmäiseen)
- **1–2** `tiedosto`

Ensimmäinen palanen on aina `teksti` — ikkunassa on oltava lause ennen
kuin siinä on kuva. Muuten järjestys on vapaa, ja sen kuuluu vaihdella:
malliston kymmenessä kohteessa on neljä eri järjestystä. Kuva keskellä
on omistajan toive ("ripottelemalla kuvia tekstin sekaan"); kuva
viimeisenä on hyvä silloin, kun se on tekstin loppuhuipentuma.

### Pituudet

Mitattu mallistosta, ei arvattu:

| | mitta | mallin toteuma |
|---|---|---|
| `teksti`-kappaleet yhteensä | **enintään 700** merkkiä | 379–664 |
| yksittäinen `teksti` | enintään 300 | 236–295 |
| `lainaus` | enintään 280 | 90–267 |
| `selite` | enintään 220 | 113–218 |

Lainaus ei laske 700 merkkiin. Alaraja on olemassa myös: alle 350
merkkiä leipätekstiä tarkoittaa yleensä, ettei kohteesta ole löytynyt
tarinaa — palaa lähteille.

---

## 5. Pelin ääni

Lue kaksi tiedostoa ja kuuntele: `js/packs/europe-saapumiset.js` ja
`js/packs/africa-kulttuuri.js`.

**Kohdeyleisö on aikuinen.** Tämä on kirjattu erikseen, koska koko
projekti on kerran mennyt väärään suuntaan päinvastaisesta oletuksesta
(`docs/matkakirjan-tekstit.md`, luku "KOHDEYLEISÖ: AIKUISET"). Täsmällinen
nimi on arvo sinänsä. Vieras sana saa opettaa jotain. Eettinen
epämukavuus on koko pointti.

| ei näin | vaan näin |
|---|---|
| huutomerkki | piste |
| "vau", "uskomatonta", "mahtava" | mitattava asia, joka on itsessään uskomaton |
| "on maailman kolmanneksi pisin joki" | asia, joka seuraa siitä |
| lukujen luettelo | yksi luku, joka kantaa lauseen |
| "on tärkeä kauppareitti" | mitä sitä pitkin kulki ja kenelle |
| "monet tutkijat" | nimi ja vuosi |
| kolme asiaa yhdessä virkkeessä | kolme virkettä |

Kappaleiden työnjako, joka mallissa toistuu ja kannattaa toistaa:

1. **ensimmäinen** vie lukijan paikalle ja nimeää ihmisen — se, joka
   lainauksen kirjoitti, tai se, jota lainaus koskee
2. **lainaus** on hänen omat sanansa
3. **viimeinen** kertoo, mitä siitä seurasi tai mikä on nyt toisin

Aikakausi: peli sijoittuu 1870-luvulle, ja lainaukset ovat siltä ajalta.
Nykyaikaan saa viitata (pato, tie, väkiluku), mutta silloin se on
tietoinen leikkaus — "koskia ei enää ole" — eikä huomaamaton
anakronismi.

Kunnioitus (`docs/periaatteet.md`, pilari 3) koskee myös lainauksia.
1800-luvun matkakertomus on usein ulkopuolisen ihmettelyä ja joskus
suoraa halveksuntaa. **Älä lainaa sitä kohtaa.** Sama kirja sisältää
lähes aina myös kohdan, jossa kirjoittaja katsoo maisemaa tai myöntää
oman pienuutensa — lainaa se. Ja kun paikalla on oma vanha teksti
(veda, runo, kronikka, matkakertomus paikallisen kirjoittamana), se on
parempi kuin vierailijan: mallin Ganges lainaa Rigvedaa, ei brittiä.

---

## 6. Lainaukset

**Tämä luku on työn ydin. Lue se kokonaan.**

### 6.1 Kielto, joka ei jousta

> **Keksitty lainaus on kielletty. Muunneltu lainaus on keksitty
> lainaus. Muistista kirjoitettu lainaus on keksitty lainaus.**

Jos peli esittää sepitettyä sitaattia todellisena, se opettaa valhetta
nimenomaan siinä kohdassa, jossa se lupaa opettaa totuutta — ja koko
idea kaatuu. Yhtään lainausta ei siis kirjoiteta ilman, että sen
alkuteksti on ollut ruudulla.

Käytännön sääntö: **et saa kirjoittaa `lainaus`-kenttää, ellet ole
samalla istunnolla nähnyt sitä lähdetekstissä.** Ei "tämä on kuuluisa
sitaatti", ei "tämän tyylistä hän sanoi". Haku ensin, kirjoitus sitten.

Jos lähdettä ei löydy, kohde saa kolme tekstikappaletta ja kuvan, ei
lainausta. **Lainaukseton kohde on täysin hyväksyttävä lopputulos.**
Väärä lainaus ei ole.

Merkitse epävarmuus näkyviin: jos et ole varma, onko teksti se laitos
jonka `vuosi` sanoo, kirjoita rivikommentti. Rivikommentti on halpa;
väärä vuosiluku ei ole.

### 6.2 Mistä lainauksia haetaan

Kolme lähdettä, tässä järjestyksessä.

#### Project Gutenberg — ensisijainen

Koko teoksen teksti yhtenä tiedostona, joten haku toimii ja rivin voi
kopioida sanatarkasti.

Kirjoittajia, joilta löytyy käyttökelpoista aineistoa (nämä on
tarkistettu olemassa oleviksi 4.8.2026):

| teos | id | mitä katetaan |
|---|---|---|
| Speke, *Journal of the Discovery of the Source of the Nile* (1863) | 3284 | Niili, Victoriajärvi, Itä-Afrikka |
| Burton, *The Lake Regions of Central Africa* (1860) | 66812, 66813 | Tanganjika, Itä-Afrikka |
| Livingstone, *Missionary Travels and Researches in South Africa* (1857) | 1039 | Zambesi, Kalahari, Etelä-Afrikka |
| Stanley, *Through the Dark Continent* (1878) | 75926 | Kongo, Suuret järvet |
| Mungo Park, *Travels in the Interior of Africa* (1799) | 5266, 5305 | Niger, Länsi-Afrikka |
| Bates, *The Naturalist on the River Amazons* (1863) | 2440 | Amazon, Rio Negro, Madeira |
| Wallace, *The Malay Archipelago* (1869) | 2530, 2539 | Indonesia, Uusi-Guinea |
| Humboldt, *Personal Narrative … Equinoctial Regions* | 6322, 7014, 7254 | Orinoco, Andit, Venezuela |
| Darwin, *The Voyage of the Beagle* (1845) | 944 | Andit, Patagonia, Tulimaa |
| Whymper, *Scrambles Amongst the Alps* (1871) | 41234 | Alpit |
| Hooker, *Himalayan Journals* (1854) | 6476, 6477, 6478 | Himalaja, Sikkim, Bengal |
| Isabella Bird, *The Yangtze Valley and Beyond* (1899) | 77853 | Jangtse, Sichuan |
| Isabella Bird, *Unbeaten Tracks in Japan* (1878) | 2184 | Japanin vuoret ja joet |
| Vámbéry, *Travels in Central Asia* (1864) | 41751 | Kaspia, Oxus, Turkestan |
| D. M. Wallace, *Russia* (1905) | 1349 | Volga, Don, Ural, arot |
| Tšehov, *Letters … to His Family and Friends* | 6408 | Siperia, Baikal, Amur |
| Herodotos, *Histories* (Macaulay) | 2707, 2456 | Niili, Kaspia, Tonava, muinainen maailma |
| Twain, *Following the Equator* (1897) | 2895 | Intia, Australia, Etelä-Afrikka |

Haku ja lataus:

```bash
# 1) etsi teos
NODE_USE_ENV_PROXY=1 node -e "
fetch('https://gutendex.com/books?search=' + encodeURIComponent(process.argv[1]))
  .then(r => r.json())
  .then(d => d.results.slice(0, 6).forEach((b) =>
    console.log(b.id, '|', b.title.slice(0, 70), '|', b.authors.map(a => a.name).join(', '))));
" "Hooker Himalayan Journals"

# 2) lataa kokonaisuudessaan (ID edellisestä)
NODE_USE_ENV_PROXY=1 node -e "
const id = process.argv[1];
fetch(\`https://www.gutenberg.org/cache/epub/\${id}/pg\${id}.txt\`)
  .then(r => r.text())
  .then(t => require('node:fs').writeFileSync(\`/tmp/gb-\${id}.txt\`, t));
" 6476

# 3) etsi kohta ja lue ympäristö
grep -n "Kinchinjunga" /tmp/gb-6476.txt | head -20
sed -n '6030,6060p' /tmp/gb-6476.txt
```

Lataa raapustuskansioon, älä repoon.

**Gutenbergin otsikko ei aina ole teoksen otsikko.** Ebook 3284 on
otsikoitu "The Discovery of the Source of the Nile", mutta Speken
teoksen nimi on *Journal of the Discovery of the Source of the Nile*.
`teos`-kenttään tulee teoksen oikea nimi ja `linkki`-kenttään se
laitos, jonka luit.

**Tarkista laitoksen vuosi tiedoston alusta.** `sed -n '1,30p'`.
Esimerkki: D. M. Wallacen *Russia* ilmestyi ensin 1877, mutta
Gutenbergin teksti on 1905 uudistettu laitos ja siinä on eri sanamuotoja.
`vuosi` on sen laitoksen vuosi, jonka luit.

#### Wikisource — runot, hymnit, lyhyet tekstit

Sopii silloin, kun lainaus ei ole matkakertomuksesta vaan pyhästä
tekstistä, runosta tai asiakirjasta.

```bash
# haku
NODE_USE_ENV_PROXY=1 node -e "
fetch('https://en.wikisource.org/w/api.php?format=json&action=query&list=search&srlimit=8&srsearch='
  + encodeURIComponent(process.argv[1]))
  .then(r => r.json()).then(d => d.query.search.forEach((s) => console.log(s.title)));
" "Ganga Yamuna Sutudri Parusni Sarasvati"

# sivun teksti (Special:Export antaa lähdemuodon, myös <pre>-runot)
NODE_USE_ENV_PROXY=1 node -e "
fetch('https://en.wikisource.org/wiki/Special:Export/' + encodeURIComponent(process.argv[1]))
  .then(r => r.text())
  .then(t => console.log((t.match(/<text[^>]*>([\s\S]*?)<\/text>/) ?? ['', t])[1].slice(0, 4000)));
" "The Hymns of the Rigveda/Book 10/Hymn 75"
```

Wikisourcen käännöksen on oltava public domainia. Griffithin Rigveda
(1896), Macaulayn Herodotos (1890) ja Jowettin Platon ovat; 1900-luvun
käännökset eivät välttämättä ole. Käännöksen tekijä ja vuosi tulevat
`teos`-kenttään.

#### Internet Archive — se mitä Gutenbergissa ei ole

Nordenskiöldin *Vega*, Przewalskin Mongolia-kirjat, kansalliskirjastojen
skannaukset. OCR on epätarkempaa: **tarkista jokainen kirjain**, ja jos
kohta on ilmiselvästi rikki (`iiiountain`), etsi toinen laitos samasta
teoksesta äläkä korjaa itse.

```bash
# haku
NODE_USE_ENV_PROXY=1 node -e "
const q = process.argv[1];
fetch('https://archive.org/advancedsearch.php?q=' + encodeURIComponent(q + ' AND mediatype:texts')
  + '&fl[]=identifier&fl[]=title&fl[]=creator&fl[]=year&rows=10&output=json')
  .then(r => r.json())
  .then(d => d.response.docs.forEach((o) =>
    console.log(o.year ?? '?', '|', o.identifier, '|', (o.title ?? '').slice(0, 60))));
" "voyage of the vega nordenskiold"

# koko teksti
NODE_USE_ENV_PROXY=1 node -e "
const id = process.argv[1];
fetch(\`https://archive.org/download/\${id}/\${id}_djvu.txt\`)
  .then(r => r.text())
  .then(t => require('node:fs').writeFileSync(\`/tmp/ia-\${id}.txt\`, t));
" voyageofvegaroun00nord
```

Tekijänoikeus: käytä vain ennen vuotta 1929 julkaistuja teoksia tai
niitä, joiden lisenssi on erikseen merkitty vapaaksi. Archiven
lainauskirjasto (`lending`) ei ole vapaa aineisto, vaikka teksti
näkyisi.

### 6.3 Miten lainaus valitaan

- **Kolme lausetta on maksimi**, yksi usein paras.
- Lainaus, joka **sanoo saman kuin viereinen leipäteksti**, on turha.
  Se saa sanoa jotain, mitä sinä et voi sanoa: mitä kirjoittaja kuuli,
  pelkäsi, luuli tai erehtyi luulemaan.
- **Erehdys on hyvä lainaus.** Herodotoksen oikeassaolo Kaspiasta on
  kiinnostavampi kuin mikään kuvaus, koska seuraavat kaksituhatta vuotta
  olivat väärässä.
- Vältä kuuluisinta mahdollista sitaattia, jos se on kulunut. Sama
  kirja sisältää yleensä paremman sivulla 200.
- **Poistoja saa tehdä, lisäyksiä ei.** Merkitse poisto ajatusviivalla
  tai kolmella pisteellä. Älä siirrä sanoja äläkä yhdistä kahta
  erillistä kohtaa yhdeksi lainaukseksi.

### 6.4 Suomennos

Suomennos on omasi, ja se merkitään: `suomennos: 'oma'`. Jos lähde on
jo käännös (Tšehov venäjästä englantiin, Herodotos kreikasta
englantiin), merkitse ketju: `suomennos: 'oma, Constance Garnettin
englanninnoksesta'`, ja mainitse kääntäjä `teos`-kentässä.

- Käännä ajatus, älä sanajärjestystä. Suomi kestää lyhyemmän virkkeen
  kuin viktoriaaninen englanti.
- **Mitat jäävät kirjoittajan yksiköihin.** Darwinin "700 miles" on
  suomennoksessa "seitsemänsataa mailia". Kilometreiksi muuntaminen on
  lainauksen muuttamista.
- Erisnimet nykyiseen suomalaiseen asuun, jos sellainen on vakiintunut
  (Victoria N'yanza → Victoria-nyanza; Kinchinjunga → Kanchenjunga),
  paitsi jos vanha muoto on itse pointti.
- Kirjoita alkukielinen sanamuoto rivikommenttiin aina, kun
  käännösvalinta on tulkinnanvarainen. Mallissa Speken kohdalla on
  esimerkki.

---

## 7. Kuvat

Sama tarkistus kuin kuvakorteilla: **Wikimedia Commons, yli 1200 px
leveä, vapaa lisenssi, ei ND.** Yksi tai kaksi per kohde, ei enempää.

### 7.1 Miksi 1200

Suurennos avataan koko ruudulle ja tabletin näyttö on kaksinkertainen.
Peli pyytää Commonsilta 1200 pikselin pienennöksen, mutta jos
**alkuperäinen** on pienempi, pienennöstä ei ole olemassa isompana ja
kuva näkyy pehmeänä. Tätä ei voi päätellä osoitteesta — se on kysyttävä.
(Sama päättely kuin `tools/tarkista-kuvakoot.mjs`.)

### 7.2 Lisenssit

| kelpaa | ei kelpaa |
|---|---|
| Public domain, PD-old, PD-USGov (NASA) | CC BY-ND, CC BY-NC-ND (mikä tahansa **ND**) |
| CC0 | CC BY-NC, CC BY-NC-SA (mikä tahansa **NC**) |
| CC BY (kaikki versiot) | "Fair use", "with permission" |
| CC BY-SA (kaikki versiot) | lisenssitieto puuttuu |
| OGL, "No restrictions" | |

Jos kentässä lukee jotain muuta kuin nämä, kuva jää pois. Älä tulkitse.

### 7.3 Haku

**Älä koskaan keksi tiedostonimeä.** Commonsin nimet ovat pitkiä ja
epäsäännöllisiä, ja arvattu nimi tuottaa 404:n, jota kukaan ei huomaa
ennen kuin pelaaja avaa ikkunan.

Kirjoita nämä kaksi skriptiä raapustuskansioon (**älä repoon** —
`tools/` ei kuulu tähän työhön):

```js
// etsi.mjs — node etsi.mjs "hakusanat"
const haku = process.argv.slice(2).join(' ');
const r = await fetch('https://commons.wikimedia.org/w/api.php?action=query&generator=search'
  + `&gsrnamespace=6&gsrsearch=${encodeURIComponent(haku)}&gsrlimit=25`
  + '&prop=imageinfo&iiprop=size|extmetadata&format=json',
  { headers: { 'user-agent': 'Matkakirja/1.0 (opetuspeli)' } });
const d = await r.json();
const puhdas = (v) => (v?.value ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
for (const s of Object.values(d?.query?.pages ?? {})) {
  const i = s.imageinfo?.[0];
  if (!i || i.width < 1200) continue;
  const e = i.extmetadata ?? {};
  console.log(`${i.width}x${i.height} | ${puhdas(e.LicenseShortName)} | ${puhdas(e.DateTimeOriginal).slice(0, 20)} | ${puhdas(e.Artist).slice(0, 45)}`);
  console.log('   ', s.title.replace(/^File:/, ''));
}
```

```js
// tarkista.mjs — node tarkista.mjs "Nimi.jpg" "Toinen.jpg"
const otsikot = process.argv.slice(2).map((n) => `File:${n}`).join('|');
const r = await fetch('https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo'
  + '&iiprop=size|extmetadata&format=json&titles=' + encodeURIComponent(otsikot),
  { headers: { 'user-agent': 'Matkakirja/1.0 (opetuspeli)' } });
const d = await r.json();
const puhdas = (v) => (v?.value ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
for (const s of Object.values(d?.query?.pages ?? {})) {
  const i = s.imageinfo?.[0];
  if (!i) { console.log('PUUTTUU:', s.title); continue; }
  const e = i.extmetadata ?? {};
  console.log(`${i.width}x${i.height} | ${puhdas(e.LicenseShortName)} | ${puhdas(e.Artist).slice(0, 45)}`);
  console.log('   ', s.title);
}
```

Ajo: `NODE_USE_ENV_PROXY=1 node etsi.mjs "Qutang Gorge Yangtze"`.

Hakuvinkkejä, jotka toimivat:

- **Kaksi tai kolme sanaa.** Pitkä lauseenomainen haku ei tuota mitään
  ("Meeting of Waters Rio Negro Solimoes" → 0 osumaa, "Encontro das
  Aguas Manaus" → 8).
- **Paikallinen nimi tuottaa paikallisia kuvia** — Encontro das Águas,
  Qutang Gorge, 瞿塘峽.
- **Aikakauden kuva löytyy tekijän nimellä**: "Edward Lear
  Kangchenjunga", "Repin Barge Haulers Volga", "Gustave Doré Matterhorn".
- **Satelliittikuva on lähes aina PD** (NASA, NOAA, ESA-poikkeuksin) ja
  hyvin suuri: "Caspian Sea satellite", "Nile delta satellite".
- Jos haku antaa vain `.pdf`- ja `.djvu`-osumia, olet löytänyt kirjoja
  etkä kuvia; lisää hakuun konkreettinen paikannimi.

Aja `tarkista.mjs` **jokaiselle valitsemallesi nimelle** ennen kuin
kirjoitat sen tiedostoon. Kopioi nimi tulosteesta, älä hakutuloksesta
käsin.

### 7.4 Selite

Selite ei toista kuvatekstiä vaan kertoo, mitä katsotaan. Malleja:

> Ripon Falls, jonka Speke nimesi Lontoon maantieteellisen seuran
> puheenjohtajan mukaan. Kuva on vuodelta 1913. Putouksia ei enää ole:
> Owen Fallsin pato nosti veden niiden ylle vuonna 1954.

> Pohjoinen kolmannes on lautasen matala, paikoin alle viisi metriä, ja
> Volgan suisto työntyy siihen ylhäältä. Etelässä syvyys ylittää tuhat
> metriä.

Molemmissa on jotain, mitä kuvasta ei näe. Se on selitteen tehtävä.

### 7.5 Peilaus

Uudet kuvat on peilattava, tai ne eivät toimi offline. Peilaus ei ole
sinun ajettavasi, mutta **mainitse valmiissa työssä, montako uutta
`tiedosto`-nimeä lisäsit**, jotta koostava vaihe osaa ajaa:

```bash
node tools/peilaa-media.mjs --vain kuvat
```

---

## 8. Mitä EI kirjoiteta

**Ei mittalukujen luetteloa.** Pituus, korkeus, huippu ja tärkeys ovat
jo nimipaketin kentissä ja osa niistä on ruudulla. "Volga on 3 685
kilometriä pitkä" on tekstissä hukkaan heitetty virke.

**Ei listasijoitusta ilman tarinaa.** "Maailman kolmanneksi pisin joki"
ei ole tieto vaan järjestysluku. Poikkeus: sijoitus, johon liittyy
riita tai historia — Amazonin ja Niilin pituuskiista on tarina, koska
mittaustapa ratkaisee voittajan.

**Ei Wikipedian tiivistelmän toistoa.** Ikkuna hakee sen itse verkosta
ja näyttää sen samalla ruudulla. Jos tekstisi sanoo saman, pelaaja lukee
saman kahdesti.

**Ei etymologiaa yksinään.** "Nimi tarkoittaa suurta jokea" on tieto
vasta, kun se muuttaa jotain.

**Ei "on tärkeä" -väitteitä.** Tärkeä kenelle ja mihin? Kirjoita se
sen sijaan.

**Ei tulevaisuutta eikä arviointia.** "Ilmastonmuutos uhkaa jäätikköä"
on väite ilman lähdettä siinä muodossa. Mitattu havainto ("jäätikkö on
vetäytynyt X kilometriä vuodesta Y") on kunnossa.

**Ei kahta samaa rakennetta peräkkäin.** Jos kolme peräkkäistä kohdetta
alkaa "Vuonna 18xx eurooppalainen tutkimusmatkailija saapui…", lukija
huomaa muotin. Vaihda näkökulmaa: paikallinen nimi, geologia, kaupunki
rannalla, kalastus, raja, pato.

**Ei anteeksipyytelyä eikä metatekstiä.** Ei "kiinnostavaa kyllä", ei
"on syytä huomata", ei "monet pitävät".

---

## 9. Valmistarkistus

Ennen kuin ilmoitat työn valmiiksi, käy jokainen kohta läpi.

**Muoto**

- [ ] Tiedosto avautuu importissa ilman virhettä
- [ ] Ylin taso on laji, toinen taso avain
- [ ] Jokainen avain on kopioitu nimipaketista sellaisenaan
- [ ] Jokaisessa kohteessa 4–6 palasta, ensimmäinen `teksti`
- [ ] Kuvakentän nimi on `tiedosto` (ei `kuva`)
- [ ] Ei `avain`-, `wiki`- eikä `selitys`-kenttää
- [ ] Tiedostonimi lisätty `sw.js`:n SHELL-listalle

**Pituus**

- [ ] `teksti` yhteensä ≤ 700, yksittäinen ≤ 300
- [ ] `lainaus` ≤ 280, `selite` ≤ 220

**Lainaukset**

- [ ] Jokainen lainaus on nähty lähdetekstissä tässä istunnossa
- [ ] `linkki` avautuu ja johtaa siihen laitokseen, jota luit
- [ ] `vuosi` on lukemasi laitoksen vuosi (tarkistettu tiedoston alusta)
- [ ] `suomennos` merkitty, käännösketju mainittu jos sellainen on
- [ ] Mitat ovat lainauksessa kirjoittajan omissa yksiköissä
- [ ] Yksikään lainaus ei ole ulkopuolisen halveksuntaa paikallisista

**Kuvat**

- [ ] Jokainen `tiedosto` on ajettu `tarkista.mjs`:n läpi ja löytyy
- [ ] Leveys > 1200 px
- [ ] Lisenssi on luvun 7.2 vasemmasta sarakkeesta
- [ ] `lahde` kertoo lisenssin ja tekijän (paitsi PD)

**Ääni**

- [ ] Ei yhtään huutomerkkiä
- [ ] Ei mittalukuluetteloa eikä irrallista listasijoitusta
- [ ] Peräkkäiset kohteet eivät ala samalla rakenteella
- [ ] Luettu ääneen: virke, joka ei kanna ääneen, ei kanna ruudullakaan

Mittaus koneella:

```bash
cd /home/user/Matkakirja && NODE_USE_ENV_PROXY=1 node --input-type=module -e "
const m = await import('./js/packs/maasto-tekstit-joet-b.js');   // oma tiedostosi
const T = Object.values(m)[0];
let virheita = 0;
for (const [laji, kohteet] of Object.entries(T)) {
  for (const [avain, k] of Object.entries(kohteet)) {
    const p = k.kappaleet ?? [];
    const t = p.filter((x) => x.teksti);
    const l = p.filter((x) => x.lainaus);
    const ku = p.filter((x) => x.tiedosto);
    const yht = t.reduce((s, x) => s + x.teksti.length, 0);
    const muoto = p.map((x) => (x.teksti ? 't' : x.lainaus ? 'L' : 'K')).join('');
    const moite = [];
    if (p.length < 4 || p.length > 6) moite.push('palasia ' + p.length);
    if (!p[0]?.teksti) moite.push('alkaa väärin');
    if (yht > 700) moite.push('teksti ' + yht);
    if (t.some((x) => x.teksti.length > 300)) moite.push('pitkä kappale');
    if (l.some((x) => x.lainaus.length > 280)) moite.push('pitkä lainaus');
    if (ku.some((x) => (x.selite ?? '').length > 220)) moite.push('pitkä selite');
    if (ku.length < 1 || ku.length > 2) moite.push('kuvia ' + ku.length);
    if (p.some((x) => x.kuva)) moite.push('kenttä kuva!');
    if (p.some((x) => x.lainaus && !(x.teos && x.kuka && x.vuosi && x.linkki))) moite.push('lainaus vajaa');
    if (JSON.stringify(k).includes('!')) moite.push('huutomerkki');
    if (moite.length) virheita++;
    console.log([laji + '/' + avain, muoto, yht, moite.join('; ') || 'ok'].join(' | '));
  }
}
console.log(virheita ? virheita + ' huomautusta' : 'puhdas');
"
```

Lopuksi `npm test` (ei saa punastua sinun takiasi) ja
`node tools/tarkista-kaksoisavaimet.mjs`.

---

## 10. Kolme ansaa, jotka ovat jo lauenneet tässä projektissa

**Kaksoisavain.** JS ei valita samasta avaimesta kahdesti — se pitää
jälkimmäisen. Pariisin saapumisteksti oli kuukauden eri kuin mitä
kertoja luki ääneen, koska palautettu versio oli tiedoston alussa ja
vanha alempana. Aja `tools/tarkista-kaksoisavaimet.mjs`.

**Kenttänimi, jota kukaan ei lue.** Kaupunkiartikkeleissa oli kaksi
nimeä samalle asialle (`artikkeli` ja `teksti`), ja renderöinti luki
vain toista: 69 paikassa "Lue lisää" oli tyhjä. Siksi tässä ohjeessa
sanotaan `tiedosto` neljä kertaa.

**Tarkistus, joka ei kata kaikkea.** `tarkista-kuvakoot.mjs` kävi läpi
vain pääkuvat, ei `lisat`-taulukkoa, ja Marseillen kuva oli rikki
kuukausia vihreiden testien läpi. Siksi luvun 9 mittaus käy läpi
**jokaisen** palasen, ei ensimmäistä.

---

## 11. Kun olet valmis

Ilmoita nämä, älä muuta:

1. tiedostosi polku ja montako kohdetta siinä on
2. montako kohdetta jäi ilman lainausta ja miksi
3. montako uutta `tiedosto`-nimeä lisäsit (peilausta varten)
4. luvun 9 mittauksen tuloste
5. kohteet, joiden kanssa jouduit tinkimään — ja mistä

**Älä** kirjoita erillistä raporttitiedostoa, älä nosta versionumeroa,
äläkä koske toisten tiedostoihin, vaikka huomaisit niissä vian. Kirjoita
vika kohtaan 5.
