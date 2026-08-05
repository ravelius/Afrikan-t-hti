# Uutisvälityksen käyttöönotto (omistajalle, n. 5 min)

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
