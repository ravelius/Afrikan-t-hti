# Kehitystyökalut — suunnitelma laajentumista varten

Kun peli laajenee uusille mantereille, sisällön määrä moninkertaistuu:
kaupunkeja, kysymyksiä, ääniä, kuvia ja reittejä tulee satoja lisää.
Käsityönä laatu ei pysy mukana — tarvitaan työkalut, joilla omistaja
näkee, kuuntelee ja tarkistaa sisällön nopeasti. Tämä dokumentti on
työkalujen suunnitelma tärkeysjärjestyksessä. Valmiit merkitään.

## 1. Äänistudio — TEHTY (29.7.2026)

`/aanet.html` uusittiin kokonaan:

- **Haku ja suodattimet**: vapaa tekstihaku, lohkot (kaupungit /
  musiikki / tehosteet) ja "vain valitsemattomat" -tila, jolla
  käydään läpi mitä on vielä valitsematta. Laskuri näyttää edistymisen.
- **Yksi soitinpalkki**: aikajana, kesto, voimakkuus, luuppi ja
  A/B-vaihto kahden viimeksi soitetun välillä — pitkien ambienssien
  vertailu onnistuu ilman että mikään soi päällekkäin.
- **Omat ehdokkaat**: mihin tahansa paikkaan voi liittää oman
  mp3-osoitteen (esim. Freesoundin esikuuntelulinkin) ilman
  koodimuutosta. Omat ehdokkaat säilyvät selaimessa ja ne voi poistaa.
- **Aloituskohta** sekunteina per klippi; tallentuu valintaan ja peli
  aloittaa striimin siitä.
- **Vienti ja tuonti**: valinnat saa tekstinä (Claudelle
  kovakoodattavaksi) ja JSON-muodossa, ja JSONin voi tuoda toiseen
  selaimeen — puhelimen ja koneen valinnat pysyvät samassa.
- **Kaikki laudat**: kaupunkipaikat rakentuvat kaikista paketeista —
  kun uuden mantereen kaupungeille merkitään äänimaisematyypit, ne
  ilmestyvät studioon itsestään.

## 2. Kartta-apuri (seuraavaksi — suurin hyöty laajennuksessa)

Uuden mantereen työläin vaihe on kaupunkien ja reittien sijoittelu.
Dev-sivu `/kartta.html`:

- Laudan valinta; klikkaus kartalla antaa koordinaatit valmiina
  liitettävänä rivinä (`{ id: '', name: '', x: 123, y: 456 }`).
- Pituus/leveysaste → laudan koordinaatit -muunnin (projektiokaava
  luetaan paketista, kuten Afrikassa).
- Näyttää livenä nimien törmäykset, liian lähekkäiset kaupungit
  (minCityDistance) ja rannikon ulkopuolelle jäävät pisteet.
- Rajojen ja korostuksen esikatselu päälle/pois.

## 3. Kehityspaneeli peliin (`?dev=1`)

Pelitilanteeseen pääsy ilman 20 vuoron pelaamista:

- Teleport mihin tahansa kaupunkiin, rahan asetus, laatan pakotus
  (tähti/rosvo/tyhjä), siemenluvun valinta.
- Avaa suoraan: pulma, valokuvakysymys, kaksintaistelu, tietoportti.
- Nopeuskerroin animaatioille ja kirjoituskoneelle.

Toteutus: main.js lukee `?dev=1` ja lisää pienen paneelin — ei näy
normaalipelissä eikä kasvata sw-välimuistia.

## 4. Sisältöselain ja -tarkistin

Kysymysmäärä kasvaa tuhansiin. Dev-sivu `/sisalto.html` + komento
`node tools/tarkista-sisalto.mjs`:

- Selain: kaikki kysymykset, väittämät, faktat ja pulmat lauta- ja
  kaupunkisuodattimella; omistaja voi oikolukea ilman koodin avaamista.
- Tarkistin (myös testeihin): oikeiden vastausten jakauma (ei aina
  A-vaihtoehto), tekstipituudet, duplikaatit, puuttuvat lähteet,
  vaikeustasojen kattavuus per kaupunki.

## 5. Balanssisimulaatio

`node tools/simuloi.mjs africa 500` — botti pelaa 500 peliä ja
raportoi: pelin kesto vuoroina, rahakäyrä, laattajakauma, kysymysten
toistuvuus, jumitilanteet. Ajetaan jokaiselle uudelle laudalle ennen
julkaisua — paljastaa liian kalliit reitit ja liian pienet
kysymyspankit ennen pelaajia.

## 6. Wikipedia-tarkistin

`node tools/tarkista-wikit.mjs` hakee kaikkien pakettien wiki-otsikot
ja kuvat kertaalleen ja listaa katkenneet tai uudelleenohjautuvat.
Estää sisältömädän: artikkeleita nimetään uudelleen ajan mittaan.

## 7. Äänivalintojen kovakoodausputki

`node tools/aanet-koodiin.mjs valinnat.json` kirjoittaa studion
JSON-viennin suoraan koodiin (STRIIMIOLETUKSET, REAL_SAMPLES,
aloituskohdat). Sulkee ympyrän: valinta studiossa → oletus kaikille.

## 8. Julkaisukomento

`node tools/julkaise.mjs` — nostaa version (sw.js + main.js), ajaa
testit, rakentaa standalonen ja kertoo mitä jäi käsin tehtäväksi.
Poistaa toistuvat käsivirheet (versio kahdessa paikassa).

## 9. Kuvakierros

`node tools/kuvakierros.mjs` — Playwright ottaa vakiokuvakaappaukset
(etusivu, lento, saapuminen, kysymys, pulma, galleria, studio) ennen
ja jälkeen muutosten. Ulkoasuregressiot näkyvät silmällä.

## 10. Uuden mantereen runko

`node tools/uusi-manner.mjs etelaamerikka` — luo pakettipohjan:
projektiokaava kommentteineen, tyhjät kysymyspankit oikeilla
kenttäpohjilla, decor-oletukset, sw/build-rivit ja tarkistuslista
(kaupungit → reitit → kysymykset → äänet → rajat → simulaatio).
Mannerlaajennus muuttuu täyttötehtäväksi.

## Suositeltu järjestys

1. ~~Äänistudio~~ (tehty)
2. Kartta-apuri — ennen ensimmäistäkään uutta mannerta
3. Kehityspaneeli — nopeuttaa kaikkea testausta heti
4. Sisältöselain ja -tarkistin — kun kysymyksiä aletaan kirjoittaa lisää
5. Simulaatio + wiki-tarkistin + kovakoodausputki — laajennuksen aikana
6. Julkaisukomento, kuvakierros, mannerrunko — mukavuus, tehdään välissä

Nämä voi teettää myös Opus-työlistan paketteina (docs/tyolista-opukselle.md).
