# Tutki-ikkunan aiheet — monistusresepti

## PÄÄTETTY 5.8.2026: maa kantaa aiheet, kaupunki kantaa kannen

Omistajan malli: nostot tehdään ensisijaisesti MAASTA, ja kaupungilla
on muutaman noston kansisivu itsestään. Pilotti: Venetsia + Italia
(v265). Näin yksi maapaketti palvelee maan kaikkia kaupunkeja — sama
matkaopas kulkee laukussa koko maan ajan, vain kansilehti vaihtuu.

- **Maan aiheet:** `js/packs/maa-kategoriat.js`, avain ISO-3-tunnus
  (sama kuin `map.cityCountry`). Monistusmitta 5–6 aihetta × 4–5
  nostoa; Lontoo (54 nostoa) on lippulaiva, ei mittatikku.
- **Kaupungin kansi:** `KULTTUURI_KATEGORIAT[cityId]`, yksi aihe
  (id `kaupunki`, nimi = kaupungin nimi) ja 3–5 paikallista nostoa:
  maamerkit, paikallinen elämä, visan aihe.
- **Yhdistäminen** (js/ui.js rakennaSivut): kaupungin aiheet ensin,
  sitten litteä "Elämää" jos omia ei ole, sitten maan aiheet. Sama
  aihe-id kaupungilla voittaa maan version.
- **Järjestys monistukseen:** maat sen mukaan, montako kaupunkia ne
  kattavat ja mihin lennetään ensin — Italia ✅, sitten Ranska, USA,
  Japani, Egypti, Brasilia, Australia.

Loput tämän tiedoston säännöt (kuvat, lisenssit, mitat, työkalu,
tarkistuslista) pätevät sellaisinaan molempiin tasoihin.

## PÄÄTETTY 5.8.2026: Tutki on paikallislehti (v270)

Omistajan visio: kansisivullinen kaupunki taittuu paikallislehdeksi.
Kaikki kolme mekanismia ovat datavetoisia — uusi maa tai kaupunki ei
vaadi koodimuutoksia:

- **Lehtitaitto (tarkennettu v277):** kun kaupungilla on aihe id:llä
  `kaupunki`, etusivu rakentuu esittelytekstin ja isojen kuvien
  varaan: masto (ylärivi, kaupungin nimi, päiväysrivi), sää, iso
  pääkuva, esittely, pienempien kuvien pari ja maa omana osastonaan —
  ilman Lue lisää -nappeja ja wikin kuvakarusellia (tekstien pitää
  riittää itsenään, kuvat ovat omia tarkistettuja valintoja
  kategorian `kansikuvat`-listasta). Kansiosion nostot saavat OMAN
  sivunsa heti etusivun jälkeen ja maan aiheet jatkuvat niiden
  perään. Ensimmäinen versio (v270) taittoi nostot etusivulle — sivu
  venyi liian pitkäksi ja maan ydintiedot hukkuivat; älä palaa
  siihen. Lehtimaan intro (esim. Italia europe-artikkelit.js:ssä)
  kirjoitetaan muita pidemmäksi, koska se kantaa maaosaston yksin.
  Muut kaupungit näyttävät etusivun entiseen tapaan
  (`.dialog.lehti`-luokka ohjaa kaiken).
- **Teosgalleria:** nosto voi kantaa `galleria: [{ otsikko, tiedosto,
  selite, lahde }]` -listan (pilotti: Venetsian Canaletto, 6 teosta).
  Noston kuva saa selailunuolet ja laskurin; selite- ja lähderivit
  vaihtuvat teoksen mukana. Suurennos avaa kohdalla olevan teoksen ja
  KOKO SARJAN selattavana täydellä ruudulla (v277) — sama koskee
  etusivun kansikuvia. Peilityökalu poimii galleria- ja kansikuvien
  `tiedosto:`-kentät automaattisesti.
- **Sää (v272):** lehtikaupunki saa mastoon päivän ennusteen ja
  napautuksesta koko vuoden graafin, kun sille on rivi
  `js/packs/saatiedot.js`:ssä (lat/lon + kuukausinormaalit; normaalien
  laskutapa kerrotaan tiedoston alussa). Ilman riviä lehti näkyy
  ilman säätä — mitään ei tarvitse koodata.
- **Kohtaaminen (v274):** "Etsi kätkö" -napin tilalla kohtaamis-
  kaupungissa on hahmon kutsu (esim. "Tapaa gondolieeri"), ja hahmo
  kehystää aarretehtävän tervehdyksineen ja repliikkeineen. Data:
  `js/packs/kohtaamiset.js` (hahmo, nappi, frame, tervehdys, loyto,
  tyhja, vaarin) — uusi kaupunki ei vaadi koodia.
- **Uutiset (v276, hiottu v280):** maaosastossa "Uutisissa tänään" —
  kolme tuoretta otsikkoa paikallisella kielellä pienellä kirjaimella
  maan kartan oikealla puolella (leveällä ruudulla), kun maalla on
  lähde `js/packs/uutislahteet.js`:ssä ja omistajan uutisvälitys on
  käytössä (tools/uutisproxy/OHJE.md; workerin sallitut ovat
  ETULIITTEITÄ, koska myös artikkelisivut haetaan sen kautta).
  Otsikoita ei lyhennetä eikä mukailla. Popup EI tummenna taustaa:
  otsikko, suomennos heti sen alla kevyellä kursiivilla (ilman
  etikettiä), KOKO artikkelin leipäteksti uutissivulta
  ([itemprop="articleBody"]; syötteen kuvaus on varateksti) ja
  "Käännä suomeksi" -nappi leipätekstille. Etusivulle ei lisätä
  käännöksiä eikä selitetekstejä.
- **Minitehtävä:** aihe voi kantaa `tehtava: { kysymys, vaihtoehdot,
  oikea, fakta }` (pilotti: Italian Ruoka). Se piirtyy sivun loppuun
  kuponkimaisena tehtäväpalstana, ja vastaus LÖYTYY SAMAN SIVUN
  TEKSTISTÄ — se on lukemisen palkinto, ei tietovisa. Palkkio 10
  puntaa, kerran per lehti (game.actionMinitehtava, avain
  pakka:kaupunki:aihe). Vähintään yksi tehtävä lehteä kohti; sivu saa
  vaihdella maasta toiseen kuin ristikko lehden eri sivuilla.

*Kirjattu v220:ssä, kun Lontoon pilotti (9 aihetta, 54 nostoa) hiottiin
monistettavaksi. Tämä on resepti seuraaville kaupungeille — Lontoo on
mallikappale, jota vasten uutta kaupunkia verrataan.*

## Rakenne

Kaupungin aiheet asuvat `js/packs/kulttuuri-kategoriat.js`:ssä avaimella
`KULTTUURI_KATEGORIAT[cityId]` (paljas kaupunki-id, ei laudan tunnusta —
toimii siksi kaikilla laudoilla automaattisesti). Kategoria:

```js
{
  id: 'historia',          // pieni kirjain, ei ääkkösiä eikä välejä
  nimi: 'Historia',        // näkyy avatun aiheen otsikkona ja aria-labelina
  johdanto: '…',           // 1–2 virkettä: mitä täältä löytyy (154–232 mrk)
  ikoni: '<path …/>',      // VALINNAINEN: oma viivakuvake (24×24, pelkkä ääriviiva)
  nostot: [ { otsikko, teksti, tiedosto, selite, lahde, wiki?,
              musiikki?, musiikkiNimi?, musiikkiNayte?, musiikkiNayteNimi?,
              aani?, aaniLahde? } ],
}
```

Kuvake katsotaan järjestyksessä: `kategoria.ikoni` → `AIHE_IKONIT[id]`
(ui.js: vakioaiheet historia, kuvataide, kirjallisuus, musiikki, ruoka,
luonto, tiede, nykytaide, huumori) → yleiskuvake (kirjanmerkki). Uusi
kaupunki ei siis koskaan vaadi koodimuutosta — mutta **käytä vakioaiheita
aina kun voit**, jotta kuvakkeet pysyvät tuttuina kaupungista toiseen.

## Mitat, jotka pitävät

- **Aiheita enintään 9** — yhdeksän kuvaketta mahtuu yhdelle riville
  kapeimmallakin puhelimella (360 px). Kymmenes rikkoo rivin.
- **Nostoja 4–7 per aihe**, tekstit 440–660 merkkiä. Johdanto kursiivilla
  aiheen ylle.
- **Yksi kuva esiintyy kaupungissa vain kerran.** Sama tarina ei saa
  toistua kahdessa aiheessa (Lontoosta siivottiin kaksi tällaista paria).

## Kuvat

- Commons-tiedosto, leveys ≥ 1200 px, lisenssi PD/CC0/CC BY/CC BY-SA,
  ja kuvan SISÄLTÖ tarkistettu silmin selitettä vasten.
- Lähdemerkintä aina muodossa `Tekijä, Wikimedia Commons (LISENSSI)` —
  lisenssiin `(PD)`, ei `(public domain)`. Lisenssi käskee nimetä tekijän.
- Kuvat päätyvät R2-peiliin itsestään: push mainiin käynnistää
  `.github/workflows/peilaa.yml`:n, joka peilaa uudet viittaukset.

## Kulttuurivisa ja litteä taulu

Kulttuurivisa (`kysymys`) asuu yhä litteässä taulussa
(esim. `EUROPE_KULTTUURI[cityId].kysymys`) ja piirtyy saapumiskortille.
Kun kaupunki saa kategoriat, sen litteät `nostot` eivät enää näy —
siirrä niiden ainutlaatuinen sisältö (etenkin musiikkilinkit ja
ääninäytteet) kategorioihin ja jätä litteään tauluun vain `kysymys`.
Varmista, että visan opettava nosto on kategorioissa näkyvillä.

## Työkalu

```
node tools/kirjoita-kategoriat.mjs <sisaan.json> js/packs/kulttuuri-kategoriat.js KULTTUURI_KATEGORIAT <kaupunki>
```

Kirjoitus on yhdistävä: muut kaupungit säilyvät, oma korvautuu.
Työkalu hylkää nostot, joiden kuva on alle 1200 px tai joiden
lähdemerkinnästä puuttuu tekijä — hylkäykset listataan ajon lopuksi.

## Tarkistuslista ennen julkaisua

1. `node tools/tarkista-kaksoisavaimet.mjs` ja koko testistö.
2. Avaa kaupunki selaimessa: aiherivi yhdellä rivillä (myös 360 px),
   jokainen aihe aukeaa, kuvat latautuvat, Lue lisää -napit toimivat.
3. Kuvien tekijämerkinnät näkyvät jokaisessa nostossa.
4. Kulttuurivisa aukeaa saapumiskortilta ja sen aihe löytyy aiheista.
