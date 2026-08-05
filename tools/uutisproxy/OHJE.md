# Uutisvälityksen käyttöönotto (omistajalle, n. 5 min)

> **Päivitys 4 (v305):** sallittuihin lisättiin Britannian
> uutislähde (BBC: `feeds.bbci.co.uk`, `www.bbc.co.uk`,
> `www.bbc.com`) Lontoon lehteä varten. Julkaise worker kerran
> uudelleen: **Edit code → liitä tuore `worker.js` → Deploy.**
> Sama julkaisu tuo kaikki aiemmatkin päivitykset.

> **Päivitys 3 (v297):** sallittuihin lisättiin Egyptin uutislähde
> (`https://www.youm7.com/`) Kairon lehteä varten. Julkaise worker
> kerran uudelleen: **Edit code → liitä tuore `worker.js` → Deploy.**
> Siihen asti Kairon lehti näkyy ilman uutisosiota — mikään ei mene
> rikki. (Sama julkaisu tuo myös v290:n youtube-etuliitteen, jos se
> jäi tekemättä.)

> **Päivitys 2 (v290):** workerin sallittuihin lisättiin tv-kanavan
> live-sivu (`https://www.youtube.com/@`), josta luetaan suoran
> lähetyksen tunniste — YouTuben kanavaupotus oli epävakaa iPadilla.
> Julkaise worker kerran uudelleen: **Edit code → liitä tuore
> `worker.js` → Deploy.** Siihen asti tv käyttää vanhaa upotusta,
> joka toimii selaimissa muttei välttämättä iPadilla.

> **Päivitys 5.8.2026 (v280):** worker hakee nyt myös uutisten
> artikkelisivut, jotta popupissa näkyy koko leipäteksti. Jos otit
> workerin käyttöön ennen tätä, julkaise se kerran uudelleen:
> **Edit code → poista vanha → liitä tuore `worker.js` → Deploy.**
> Ennen uudelleenjulkaisua popup näyttää vain syötteen lyhyen
> kuvauksen — mikään ei mene rikki.

Lehden maaosaston uutisotsikot tarvitsevat pienen välityspalvelimen,
koska uutissivustot eivät salli selaimen hakea RSS-syötteitään suoraan
toiselta sivustolta (CORS). Välitys on ilmainen Cloudflare Worker —
alla vaiheet. Siihen asti uutisosio pysyy pelissä piilossa, eikä
mikään mene rikki.

## Vaiheet

1. Mene osoitteeseen <https://dash.cloudflare.com> ja kirjaudu
   (ilmainen tili riittää; luo tili jos ei vielä ole).
2. Valitse vasemmalta **Workers & Pages** → **Create** →
   **Create Worker**.
3. Anna nimeksi esim. `matkakirja-uutiset` ja paina **Deploy**.
4. Paina **Edit code**, poista mallikoodi ja liitä tilalle koko
   tiedosto `tools/uutisproxy/worker.js` tästä repositoriosta.
   Paina **Deploy** uudelleen.
5. Kopioi workerin osoite (muotoa
   `https://matkakirja-uutiset.<tunnus>.workers.dev`).
6. Avaa `js/packs/uutislahteet.js` ja kirjoita osoite UUTISPROXY-
   vakioon:

   ```js
   export const UUTISPROXY = 'https://matkakirja-uutiset.<tunnus>.workers.dev';
   ```

7. Julkaise peli normaalisti (versionosto + PR). Uutisosio ilmestyy
   lehden maaosastoon niissä maissa, joilla on lähde
   `UUTISLAHTEET`-listassa (aluksi Italia/ANSA).

## Kun lisäät uuden maan uutislähteen

Lisää syötteen osoite KAHTEEN paikkaan:

1. `js/packs/uutislahteet.js` → `UUTISLAHTEET` (nimi, kieli, syote)
2. `tools/uutisproxy/worker.js` → `SALLITUT`-lista, ja julkaise
   worker uudelleen (Edit code → liitä → Deploy)

Sallittujen lista on turvatoimi: ilman sitä kuka tahansa voisi
käyttää workeria yleisenä välityspalvelimena.

## Kustannus ja rajat

Cloudflaren ilmainen taso sallii 100 000 pyyntöä päivässä, ja worker
pitää syötettä 10 minuutin välimuistissa — perhekäytössä rajat eivät
tule koskaan vastaan. Käännösnappi käyttää MyMemory-palvelua suoraan
selaimesta (ilmainen, n. 5 000 merkkiä päivässä per käyttäjä) — se ei
kulje workerin kautta.
