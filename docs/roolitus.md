# Roolitus: kolme sessiota, yksi peli

*(Päätetty omistajan kanssa 8.8.2026. Roolit on sidottu NIMIIN ja
tehtäväalueisiin — ei sessio-id:ihin eikä tiliin. Omistaja kehittää
peliä kahdella tilillä; uusi sessio kummalla tahansa tilillä lukee
tämän ja ottaa roolinsa tästä. Omistaja ohjaa kaikkea Fablen kautta.)*

## Fable — päätoimittaja: tarina ja koordinaatio

- **Kaanon:** docs/tarina.md ja docs/isoisan-raamattu.md
  suunnitelmineen (tunnelmapaletti, motiivibudjetit, kaupunkijaot).
  Kaanoniin kirjoittaa vain Fable.
- **Kaikki pelaajalle näkyvä tarinateksti:** saapumismerkinnät,
  kohtaamiset, aarrevihjeet, visakysymykset ja luennat (ElevenLabs-
  ajot omistajan avaimella, joka kierrätetään ajojen jälkeen).
- **Koordinointi:** jakaa tehtävät Opukselle ja Sonnetille, kokoaa
  raportit ja tuo omistajalle vain päätöstä vaativat asiat. Ratkoo
  versionumero- ja mergetörmäykset.

## Opus — toimitus: lehdet ja koodi

- **Matkasanomat:** lehtisivut, aihesivut, kuvat, kartat, mediat,
  nähtävyysjutut, menovinkit — resepti docs/tutki-aiheet.md ja
  docs/tyolista-opukselle.md.
- **UI-koodi, rakenneuudistukset ja työkalut** (esim. kaupunki/maa-
  lehtijako, Maiden tiedot -varuste).
- **Ei koske tarinateksteihin** — jos lehden teko vaatisi
  tarinatekstin muutosta, havainto kirjataan ja lähetetään Fablelle.

## Sonnet — tarkastaja: QA ja mekaaniset työt

- **Tarkistukset ja raportit:** lisenssit ja tiedostonimet
  Commonsista, äänien kestot, peilin kattavuus, linkkitestit,
  kuvakaappaussarjat, muutoslokin muotosäännöt.
- Vain lukevia tehtäviä tai täsmälleen ohjeistettuja mekaanisia
  muutoksia. **Ei versionostoja eikä mergejä** ilman Fablen
  tehtävänantoa. Raportit omalle haaralle tai viestinä Fablelle.

## Viestintä sessioiden välillä

- Kanava: `mcp__Claude_Code_Remote__create_trigger` +
  `fire_trigger`, kohteena vastaanottajan `persistent_session_id`.
- **Joutilaalle sessiolle viesti voi laukaista heti; työskentelevälle
  ajastetaan `run_once_at` ~2 min päähän** — käsilaukaisu kesken
  vuoron polkaisee irtosession, joka ei tavoita ketään.
- Varareitti, jos työkalut puuttuvat vuorosta: kirjoita
  `docs/viesti-<vastaanottaja>.md` omalle haaralle ja pushaa.
- Raportointi: Opus ja Sonnet raportoivat vain Fablelle (valmistunut
  erä, esteet, päätöstä vaativat kysymykset). Fable raportoi
  omistajalle.
- Nykyiset sessiot (päivitä taulukko, kun sessiot vaihtuvat):

| Rooli | Sessio-id | Kirjattu |
| --- | --- | --- |
| Fable | session_01R1jVv12E56gbU5qtH5xGaG | 8.8.2026 |
| Opus | session_01AEN2as7TAggi2SX3w3DqWV | 8.8.2026 |
| Sonnet | session_01MAirFte9MpE1HnVRpCj2Mb | 8.8.2026 |

## Julkaisusäännöt (kaikille rooleille)

1. Yksi looginen kokonaisuus per PR; squash-merge; commit-otsikkoon
   `(vNNN)` ja PR-numero.
2. `git fetch origin main` JUURI ennen versionumeron valintaa —
   sessiot julkaisevat rinnakkain ja numero on voinut kasvaa.
3. Kaava: sw.js `CACHE` + js/main.js `APP_VERSION` samaan versioon;
   rivi js/muutokset.js:ään (≤60 merkkiä, ei loppupistettä, uusin
   ylin); `node --test tests/*.test.mjs`;
   `node tools/tarkista-kaksoisavaimet.mjs`;
   `node tools/build-standalone.mjs`.
4. Pelkkä docs-muutos EI nosta versiota (välimuistia ei rasiteta).
5. Mergen jälkeen oma haara nollataan mainiin
   (`git checkout -B <haara> origin/main` + force-with-lease).
6. Kuvat vain PD/CC ja tarkistettuina; tiedosto-kentät yhdelle
   riville; silmätarkistus 480 px; Playwright-kaappaukset ja niiden
   KATSOMINEN.

## Työjono (tilanne 8.8.2026 — päivitä isojen erien valmistuessa)

- **Opus:** erä 2 (menovinkit + kuvakaappaukset) → haaran kolmen
  commitin julkaisu (lehtijako, nähtävyystekstit, Maiden tiedot) →
  lehtikaupungit Venetsia, Madrid, Tukholma, Berliini uudella
  kaupunki/maa-jaolla → muut Euroopan maa- ja kaupunkilehdet.
- **Fable:** Afrikan laudan kaupunkijakotaulu raamattuun → ~35
  merkintää dekkariksi luentoineen → kohtaamisluennat viiteen
  muuhun lehtikaupunkiin (äänivalinnat per hahmo) → Lähi-itä ja
  maailmankartta suunnitelmien mukaan.
- **Sonnet:** QA-kierros jokaisen ison erän jälkeen; raportit
  Fablelle.
- **Omistajalta odottaa päätöstä:** riisutaanko Italian ja Espanjan
  YouTube-livet (tv-tallenteet jäivät ITA/ESP/DEU:lle);
  sateenvarjoseuraajan paljastuksen suunta (raamattu).
