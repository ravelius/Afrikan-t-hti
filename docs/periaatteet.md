# Pelin periaatteet

Tämä on projektin "perustuslaki": lyhyt ja pysyvä arvopohja, jonka varassa
arvioidaan, sopiiko lisätty sisältö — kysymys, tieto, kaupunki tai kokonainen
lauta — peliin. Yksityiskohtaiset tekemisen ohjeet ovat tiedostossa
[CONTRIBUTING.md](../CONTRIBUTING.md); ne saavat elää ja tarkentua, mutta
näitä viittä pilaria muutetaan vain yhteisellä päätöksellä.

## Miksi tämä peli on olemassa

Edistämme aikuisten ja lasten tietoa eri maiden elinoloista, kulttuurista,
maantieteestä, geopolitiikasta ja poliittisesta tilanteesta — ja ylipäätään
ymmärrystä siitä, että maailma on suurempi kuin oma ympäristö. Väline on
koukuttava ja mielenkiintoinen peli, jonka kanssa pidetään hauskaa; oppiminen
syntyy sivutuotteena.

## Viisi pilaria

### 1. Peli edellä

Tämä on seikkailupeli, jonka sivutuotteena opitaan — ei oppikirja, johon on
liimattu noppa. Sisältö, joka ei ole hauskaa pelata, ei kuulu peliin, vaikka
se olisi kuinka opettavaista. Laudan pitää olla tasapainoinen ja jännittävä,
ja kysymyksen pitää olla kiinnostava myös silloin, kun vastaa väärin.

### 2. Totuus ja lähteet

Jokainen pelin väittämä on tarkistettavissa. Epävarmaa ei väitetä, ja
kiistanalaista ei esitetä varmana. Kysymykseen tai tietoon voi liittää
lähteen, ja pull requestissa kerrotaan, mistä faktat on tarkistettu.
Erimielisyydet ratkaistaan lähteillä, ei äänekkyydellä.

### 3. Kunnioitus ja tasapuolisuus

Jokainen maa ja kaupunki kuvataan asukkaidensa silmin, ei ulkopuolisen
kummasteluna:

- ei stereotypioita, pilkkaa eikä säälittelyä
- ei pelkkiä turistikliseitä — myös arkea, ruokaa, kieltä ja elinkeinoja
- kulttuurit ja uskonnot esitetään niiden omilla ehdoilla
- geopolitiikka ja politiikka **kuvataan, ei tuomita**: kerrotaan mitä on ja
  miksi, ei kenen pitäisi voittaa. Kiistanalaiset alueet ja jaetut kaupungit
  kuvataan toteavasti molempien osapuolten olemassaolo tunnustaen.

### 4. Ikäsopivuus

Sisältö sopii lapsille. Vaikeita aiheita — sotaa, köyhyyttä, sortoa — ei
kaunistella eikä kauhistella: ne käsitellään ikätasoisesti, tarvittaessa vain
vaikeammilla kysymystasoilla. Yhtään sisältöä ei lisätä pelottelemaan eikä
järkyttämään.

### 5. Avoimuus

Sisältö on vapaasti lisensoitua, jotta kenenkään panos ei voi kadota
suljetuksi. Päätökset tehdään julkisesti pull request -keskusteluissa.
Automaattiset testit ovat osa perustuslakia: ne valvovat koneellisesti
mitattavan osan (laudan eheys, kysymysten muoto), jotta ihmisten arviointi
voi keskittyä siihen, missä ihmistä tarvitaan — pilareihin 1–4.

## Uuden laudan hyväksyminen

Lauta hyväksytään, kun molemmat puolet ovat kunnossa:

**Koneellisesti valvottava osa** (`npm test` on vihreä):

- reittiverkko on yhtenäinen ja jokaiseen kaupunkiin pääsee
- laivareitit kulkevat veden päällä ja kaupungit ovat maalla
- laattoja on täsmälleen yksi jokaiseen aarrekaupunkiin, tähtiä tasan yksi
- jokaisella aarrekaupungilla on kysymyksiä ja jokaisella kaupungilla
  Tiesitkö että -tietoja; vihjeet eivät paljasta vastausta
- botit pystyvät pelaamaan laudalla kokonaisen pelin loppuun

**Ihmisen arvioima osa** (pilarit 1–4):

- pelaako lauta hyvin: onko reiteissä valinnanvaraa, ovatko etäisyydet
  tasapainossa, onko meri- ja lentoreiteillä merkitystä?
- ovatko faktat tarkistettuja ja lähteet kerrottu?
- kuvataanko alue kunnioittavasti ja monipuolisesti — myös arkea?
- ovatko kiistanalaiset asiat toteavasti ja tasapuolisesti esitettyjä?
- sopiiko sisältö lapsille ja onko vaikeustasoja käytetty oikein?

Sama lista pienemmässä koossa koskee yksittäistä kysymystä tai kaupunkia.
