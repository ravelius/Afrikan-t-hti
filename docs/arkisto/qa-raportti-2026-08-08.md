> **ARKISTOITU 8.8.2026 — ei ohje.** Vanhentunut suunnitelma tai
> kertaraportti; säilytetty historian vuoksi. Voimassa olevat ohjeet:
> docs/roolitus.md ja CLAUDE.md.

# QA-raportti — 2026-08-08

Laadunvarmistuskierros koko media-aineistolle ja muutoslokille. Pelkkää lukemista ja
ulkoisia tarkistuksia — pelitiedostoihin ei koskettu.

## Yhteenveto

| Osio | Tarkistettu | Tulos |
| --- | --- | --- |
| Äänet (`assets/audio/puhe-*.mp3`) | 331 tiedostoa, Chromium `decodeAudioData` | **Kaikki kunnossa.** Kestot 7,92–45,36 s (ka 30,3 s). 0 dekoodausvirhettä. |
| Kuvat (`tiedosto:` Commonsissa) | 1801 uniikkia viittausta | **1800/1800 aitoa löytyy.** 1 poiminnan väärä positiivi (ei oikea kuva, ks. alla). |
| Kuvien peili (R2) | 1800 aitoa tiedostoa | **1800/1800 kattaa.** |
| Liput (`lippu:` Commonsissa) | 112 uniikkia viittausta | **111/111 aitoa löytyy.** 1 poiminnan väärä positiivi. |
| Lippujen peili (R2) | 111 aitoa tiedostoa | **111/111 kattaa.** |
| Muutosloki (`js/muutokset.js`) | 387 riviä | **Ei poikkeamia** (max 55/60 merkkiä, 0 loppupistettä). |

Ei yhtään oikeaa puuttuvaa tiedostoa Commonsista eikä peilistä. Kaksi poiminnan väärää
positiivia löytyi (kohdat 2 ja 4) — ne kannattaa korjata poimintakuviosta, eivät
peliaineistosta.

## Poikkeamat

### 1. Äänet — ei poikkeamia

331/331 `puhe-*.mp3`-tiedostoa dekoodautui Chromiumin `AudioContext.decodeAudioData`illa
virheettä. Yksikään ei ollut alle 5 s tai yli 60 s.

### 2. Kuvat — kaksi Commons-uudelleenohjausta + yksi väärä positiivi

Kaksi kuvaa löytyy Commonsista vain uudelleenohjauksen kautta (kuva on olemassa, nimi
vain vaihtunut). Ei toiminnallista ongelmaa, mainitaan tiedoksi:

- `Giuseppe Garibaldi (1866).jpg` → `Garibaldi (1866).jpg` (`js/packs/maa-kategoriat.js:1837`)
- `Polarlicht 2.jpg` → `Aurora borealis over Eielson Air Force Base, Alaska.jpg` (`js/packs/paivan-kuvat.js:134`)

**Väärä positiivi:** `js/packs/maasto-tekstit-malli.js:39` on kommentti, joka sisältää
kirjaimellisen esimerkin `` tiedosto: '...' ``. Sekä tämä tarkistus että tuotannon
`tools/peilaa-media.mjs` käyttävät samaa regexiä (`tiedosto: '...'`) ilman
kommenttitietoisuutta, joten kumpikin poimii sanan "..." kuvatiedostoksi ja hakee sitä
Commonsista turhaan (404). Ei vaikuta peliin — mikään paketti ei oikeasti käytä nimeä
"...". Aiheuttaa vain yhden turhan 404-rivin joka peilausajossa.

### 3. Kuvien peili — täysi kattavuus, huomio mittausmenetelmästä

1800/1800 aidosta kuvasta löytyy R2-peilistä (`kuvat/`-kansio). Ensimmäinen ajo antoi
virheellisesti 256 "puuttuvaa" kuvaa, koska 12 rinnakkaista HEAD-pyyntöä laukaisi R2:n
`pub-*.r2.dev`-osoitteen purskerajoituksen (429) — sama ilmiö on jo dokumentoitu
`js/media.js`:n kommenteissa omistajan 6.8.2026 havainnon yhteydessä. Uusinta kolmella
rinnakkaisella pyynnöllä ja 429-uusintayrityksillä antoi luotettavan tuloksen: ei yhtään
oikeaa puuttuvaa kuvaa.

### 4. Liput — täysi kattavuus + toinen väärä positiivi

111/111 aidosta lipusta löytyy sekä Commonsista että peilistä (`liput/`-kansio,
PNG-muodossa SVG-alkuperäisille). Kuusi lippua löytyy Commonsista uudelleenohjauksen
kautta (esim. `Flag of Afghanistan.svg` → `Flag of the Taliban.svg`), ei ongelma.

**Väärä positiivi:** `js/packs/northamerica-valokuvat.js:1081` on kuvatekstissä sana
"sukeltajalippu: " rivin lopussa, jota seuraa merkkijonojatko seuraavalla rivillä
(`+ '...'`). Sama `lippu: '...'`-poimintakuvio tulkitsee tämän lippukentäksi ja poimii
merkkijonon `"\n          + "` tiedostonimeksi. Commons-API palauttaa tälle nimelle
`invalid` (ei `missing`) virheellisten merkkien vuoksi — löytyi luotettavasti vasta
peilin HEAD-tarkistuksesta (404). Ei vaikuta peliin eikä oikeisiin lippuihin.

Molemmat väärät positiivit (kohdat 2 ja 4) johtuvat samasta syystä: `tools/peilaa-media.mjs`:n
`poimi()`-regex etsii kuviota `<kenttä>: '...'` koko tiedoston raakatekstistä, myös
kommenttien ja proosatekstien sisältä. Ehdotus jatkokehitykseen: rajaa poiminta
oikeisiin objektikenttiin (esim. yksinkertainen parsinta tai vaadi kentän edeltä
`tiedosto:`/`lippu:` rivin alusta) tai muuta esimerkkikommentti muotoon, joka ei
täsmää kuvioon.

### 5. Muutosloki — ei poikkeamia

387 riviä (versiot 155–349, uusin ensin, ei katkoja järjestyksessä). Pisin
`teksti`-kentän arvo on 55 merkkiä (raja 60), eikä yksikään rivi pääty pisteeseen.
Vahvistettu sekä manuaalisesti kenttäkohtaisesti että ajamalla
`tests/rules.test.mjs`:n kolme muutoslokitestiä ja koko `tests/media.test.mjs`:n
17 testiä (16 vihreää, 1 ohitettu odotetusti — paikallista peilimanifestia ei ole
koneella).

## Menetelmät

- **Äänet:** Chromium (`/opt/pw-browsers/chromium`) Playwright-core-ajurilla,
  `AudioContext.decodeAudioData` jokaiselle `puhe-*.mp3`:lle sivun kontekstissa.
- **Kuvat/liput poiminta:** sama `poimi()`/`pura()`-logiikka kuin
  `tools/peilaa-media.mjs`:ssä (RegExp `` <kenttä>: '((?:[^'\\]|\\.)*)' `` yli kaikkien
  `js/packs/*.js`-tiedostojen), jotta luokittelu täsmää tuotantoon.
- **Commons:** `action=query&titles=File:...&prop=imageinfo&redirects=1`, 20 nimeä per
  erä, Wikimedia Commons -rajapinta, User-Agent `matkakirja/1.0`.
- **Peili:** `js/media.js`:n omat `peiliKuvaPolku`/`PEILI_JUURI`-funktiot polkujen
  laskentaan (sama nimeämissääntö kuin pelissä ja peilaustyökalussa), HEAD-pyynnöt
  R2-ämpäriin 3 rinnakkaisella pyynnöllä ja 429-uusinnalla.
- **Muutosloki:** `tests/rules.test.mjs` + `tests/media.test.mjs` ajettuna
  (`node --test`) sekä suora kenttätason pituuslaskenta.
