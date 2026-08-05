/*
 * MAAILMANRADIO — linssi, joka ei piirrä kerrosta vaan vaihtaa kartan
 * TILAN.
 *
 * Omistajan toive 4.8.2026: "Maailmanradio pitää toimia niin, että kun
 * sen laittaa päälle, kytkeytyy uusi tila karttanäkymään, missä
 * kaupungit toimivat itsessään play-nappeina. Eli kaikki muu toiminto
 * häviää, kaupungin matkakirja saa päivittyä, mutta ilman luenta-ääntä."
 *
 * Tämä tiedosto on radiotilan LOGIIKKA ja sen ainoa muisti. Se ei ole
 * laite eikä näyttö: kotelon piirtää js/linssit/radiosoitin.js ja
 * pistekirjaimet js/linssit/pistenaytto.js. Kolmijako on tarkoituksellinen
 * — kumpikaan noista ei tiedä äänestä mitään, ja tämä ei tiedä
 * pikseleistä juuri mitään. Näin laitteen ulkonäköä voi korjata
 * koskematta ääneen ja päinvastoin.
 *
 * KAKSI ÄÄNTÄ, EI YKSI. Suoran lähetyksen lisäksi radiolla on
 * VIRITYSÄÄNI: kohina, joka soi napautuksesta siihen asti kunnes asema
 * kuuluu (omistajan toive 4.8.2026 — hiljainen tauko näyttää
 * rikkinäiseltä). Se tulee js/linssit/viritin.js:stä, ja siellä on myös
 * ainoa kohta, josta valitaan soiko aito äänite vai synteesi:
 * VIRITYKSEN_TAPA. Tämä tiedosto ei tiedä kummasta on kyse — se vain
 * käynnistää ja pysäyttää.
 *
 * VIRITYKSEN AJOITUS ON TÄÄLLÄ, LIIKE ON KUORESSA. Viritys kestää
 * vähimmäisajan vaikka asema avautuisi heti, ja se kuljetaan kolmena
 * vaiheena (VIRITYKSEN_VAHIMMAISAIKA_MS). Vaihe kerrotaan soittimelle
 * yhdellä valinnaisella kutsulla, ks. kerroVaihe — mikä asteikolla
 * liikkuu ja miten, on radiosoitin.js:n ja css/radio.css:n asia.
 *
 * RADIO ON POIKKEUS LINSSISOPIMUKSESSA (docs/linssit-suunnitelma.md
 * luku 2, kenttä `kerros: false`). Kaksi sopimuksen sääntöä rikkoutuisi,
 * jos ne otettaisiin kirjaimellisesti:
 *
 *  1. "Linssimoduuli ei koske ääniin" (luku 2.6). Radio ON ääni. Sääntö
 *     on kirjoitettu karttakerrosta varten, jottei kymmenen rinnakkain
 *     kirjoitettua piirtolinssiä ala jokainen soittaa omiaan. Radio ei
 *     piirrä kerrosta lainkaan, ja sen koko olemassaolon syy on yksi
 *     äänivirta kerrallaan.
 *  2. "Aineisto ladataan dynaamisesti" (luku 2.1). js/packs/radiot.js on
 *     jo js/ui.js:n staattinen tuonti (rivi 64), koska nykyinen
 *     radionappi kaupunkinäkymässä käyttää sitä. Dynaaminen tuonti ei
 *     siis säästäisi tavuakaan, mutta se tekisi paalle():sta
 *     asynkronisen — ja silloin kartan piirto ehtisi kysyä kanavia
 *     ennen kuin taulukko on olemassa. Staattinen tuonti pitää koko
 *     rajapinnan synkronisena, mikä on tässä ainoa turvallinen muoto.
 *
 * KYTKENNÄN js/ui.js:ään TEKEE PÄÄISTUNTO KÄSIN. Tämä moduuli ei tuo
 * js/ui.js:ää eikä js/game.js:ää (kiertoviittaus), ei koske
 * document.body-luokkiin (sen tekee linssimoottori: body saa luokat
 * `linssi-paalla` ja `linssi-radio`) eikä kirjoita localStorageen.
 * Rajapinta on tämän tiedoston vientilistassa ja kunkin funktion
 * kommentissa.
 */

import { el } from '../mapart.js';
import { radioMaalle } from '../packs/radiot.js';
import { teeRadiosoitin, VIRITYKSEN_VAIHEET } from './radiosoitin.js';
import { teePistenaytto, merkinRivit, FONTTI } from './pistenaytto.js';
import { teeViritysaani, esilataaViritysaanet, unohdaViritysaanet } from './viritin.js';
import { sfx } from '../sound.js';
import { stopPlaceStream } from '../ambience-stream.js';

/*
 * NÄYTÖN MITAT.
 *
 * KUUSITOISTA MERKKIÄ ON MITATTU RAJA, EI MAKUASIA. Soittimen omat
 * tekstit ovat pisimmillään täsmälleen kuusitoista merkkiä:
 * "VALITSE KAUPUNKI" (sammuksissa), "HELSINKI · SUOMI" (soi) ja
 * "ASEMA EI VASTAA" (aikakatkaisu). Pistenäyttö vierittää tekstiä, joka
 * ei mahdu — ja kolmellatoista merkillä EI MAHTUNUT MIKÄÄN NÄISTÄ,
 * jolloin laite vieritti kartan päällä taukoamatta. Jatkuva liike on
 * juuri se, minkä sekä soittimen kuori (css/radio.css) että
 * linssimoottori (js/linssit/kerros.js 492–500) kiertävät tarkoituksella:
 * yksikin liikkuva elementti pudottaa kartan 15 kuvaan sekunnissa.
 * Kuudellatoista merkillä vieritys jää sille, mille se on tarkoitettu —
 * ulkomaisille pitkille asemannimille.
 *
 * Ruudukko: merkkiluku × (5 + 1) − 1 saraketta ja rivimäärä × (7 + 1) − 1
 * riviä, SVG:n mitat (sarakkeita − 1) × 10 + 18 ja (rivejä − 1) × 10 + 18.
 * Kahdella rivillä ja kuudellatoista merkillä 958 × 158 eli 6,06 : 1,
 * mikä on aukon 6 : 1 (radiosoitin.js NAYTON_SUHDE) parin pikselin
 * tarkkuudella.
 *
 * Kaksi riviä eikä yksi, koska kanavassa on kaksi eri asiaa: asema ja
 * paikka. Yhdellä rivillä ne pitäisi ketjuttaa, ja silloin lyhytkin
 * asemannimi alkaisi vieriä.
 */
const NAYTON_MERKIT = 16;
const NAYTON_RIVIT = 2;

/*
 * NÄYTÖN VÄRIT.
 *
 * Lasi on soittimen aukossa (css/radio.css --radio-lcd), ei täällä.
 * Pistenäyttö piirtää siis pelkät pisteet ilman omaa taustaa ja kehystä
 * — muuten laitteessa olisi kaksi eri sävyistä ruutua sisäkkäin, eikä
 * kuoren tilanvaihdos (sammuksissa himmenee, virhe kellastuu) näkyisi
 * lainkaan. Musteeksi otetaan sama kuin kuoren varatekstillä
 * (--radio-lcd-muste) kirjaimellisena heksana, koska irrallinen SVG ei
 * näe var()-muuttujia.
 */
/*
 * Näytön hehkuväri. Meripihkanvärinen valopiste tummalla lasilla
 * (omistajan toive 4.8.2026: näytöstä visuaalisesti tyyliin sopivampi):
 * vihreä nestekidelasi oli 1980-lukua, mutta lämmin keltainen hehku on
 * juuri se, miltä putkiradion valaistu asteikkolasi näyttää pimeässä.
 * Lasi itse on css/radio.css:n --radio-lcd; tämä on pisteen väri.
 */
const NAYTON_MUSTE = '#f2c05e';

/*
 * Radion aloitusäänenvoimakkuus.
 *
 * Kaupungin taustaääni soi tasolla 0,14 (js/ambience-stream.js VOIMA),
 * koska se on taustaa. Radio on päinvastoin etuala: se on ainoa ääni,
 * jonka pelaaja on itse pyytänyt, ja lähetysten omat tasot vaihtelevat
 * asemasta toiseen rajusti. 0,8 jättää nupille varaa molempiin suuntiin.
 */
const OLETUSAANI = 0.8;

/*
 * Kartan muste ja pergamentti kirjaimellisina heksoina, ei var()-viittauksina.
 *
 * Sama ratkaisu ja sama syy kuin pistenäytössä: kaupunkinapit piirretään
 * SVG-attribuuteilla, koska css/styles.css on toisen työvaiheen hallussa
 * eikä tälle tilalle ole siellä luokkia — eikä var() toimi
 * SVG:n esitysattribuutissa. Arvot ovat css/styles.css 24–27.
 */
const MUSTE = '#46331f';
/*
 * Soiva kaupunki punaisella.
 *
 * Omistajan toive: "radiossa soiva kaupunki saisi näkyä punaisena
 * kartalla, niin näkee helpommin missä mennään." Pelkkä paksumpi
 * mustekehä ei erotu seepiakartalta kuin vieressä katsottuna, ja
 * radiotilassa katse hakee soivaa kanavaa koko maailman laajuudelta.
 *
 * Sama punainen kuin lentoreitillä (css/styles.css .lento-jalki):
 * kartalla on jo yksi punainen, ja toinen sävy näyttäisi vahingolta.
 */
const PUNAINEN = '#c2452f';
const PAPERI = '#efdcb4';

/*
 * Kaupunkinapin mitat laudan yksiköissä.
 *
 * Napautusalue on sama 34 kuin kartan omilla kohderenkailla (js/ui.js
 * drawTargets), jotta radiotilassa osuu yhtä helposti kuin muulloinkin.
 * Rengas on hieman kohderengasta pienempi, ettei se peitä kaupungin omaa
 * ympyrää.
 */
const NAPIN_OSUMA = 34;
const NAPIN_RENGAS = 21;

/*
 * RISTIHÄIVYTYS KANAVANVAIHDON MOLEMMISSA PÄISSÄ.
 *
 * Viritys ei saa alkaa eikä katketa napsahtaen. Sama vika on korjattu
 * tässä pelissä jo kahdesti — kertojan äänestä (v176) ja luennoista
 * (v215) — ja tässä se olisi vielä räikeämpi: kohina on jatkuvaa ääntä,
 * ja jatkuvan äänen katkaisu kuuluu aina.
 *
 * KAKSI VAIHTOA, SAMA MITTA JA SAMA KAARI (omistajan toive: "virityssuhina
 * saisi feidautua kanavanvaihdon alussa ja lopussa --- siinä pitäisi olla
 * ristifeidaus"):
 *
 *   ALKU    edellinen kanava väistyy kosinia samalla kun kohina nousee
 *           siniä (aloitaVirta → haivytaLahetysPois + viritin aloita).
 *           Ennen tätä vanha lähetys katkaistiin kesken sanan ja kohina
 *           ilmestyi tyhjästä — juuri se töksähdys, josta omistaja
 *           huomautti.
 *   LOPPU   kohina väistyy kosinia ja uusi lähetys nousee siniä
 *           (lukitseAsema → haivytaLahetysSisaan + viritin lopeta).
 *
 * PÄÄT OVAT ERI MITTAISET, JA SE ON TARKOITUS.
 *
 * Alkupää on 0,6 s, koska sen on mahduttava siirtymävaiheen sisään
 * (SIIRTYMAN_KESTO_MS 1,25 s): kohinan pitää olla täydessä voimassaan
 * kauan ennen kuin viritys alkaa, tai vaihdosta tulee pelkkää nousua.
 *
 * Loppupää on 0,9 s. Tässä luki ennen, että 0,6 s riittää molempiin ja
 * että pidempi jättäisi lähetyksen ensimmäisen lauseen kohinan alle.
 * Kumpikaan ei pitänyt paikkaansa. Omistaja kuuli kohinan mutta ei
 * vaihtoa lainkaan ("minusta siinä ei ole myöskään niitä feidauksia") ja
 * arveli itse syyn oikein: "voisiko olla, että se häivytys on vain liian
 * nopea?" Kuuden kymmenyksen ristihäivytys jatkuvasta kohinasta puheeseen
 * EI kuulu vaihtona vaan leikkauksena — silmä ja korva lukevat sen
 * katkoksi, koska molemmat äänet ovat koko ajan läsnä eikä hiljaisuutta
 * tule väliin. Eikä lähetyksen alkua menetetä: kanava soi jo vaimennettuna
 * koko vähimmäisajan (LUKITUKSEN_AIKAISINTAAN_MS), joten lukitushetkellä
 * ollaan joka tapauksessa keskellä lausetta.
 *
 * Taustaäänimaisemien 1,8–2,6 s (js/ambience-stream.js) olisi silti liian
 * pitkä: maisemat vaihtuvat huomaamatta, kanava napautuksesta.
 *
 * Vaihto on TASATEHOINEN. Kaksi riippumatonta ääntä summautuu
 * TEHOLTAAN, joten lineaarinen pari jättäisi keskelle 3 dB:n
 * notkahduksen — reiän juuri siihen kohtaan, jota vaihdolla piti peittää.
 * Sini ja kosini toteuttavat sin² + cos² = 1, eli yhteisteho pysyy
 * vakiona koko vaihdon ajan. Viritysääni ajaa oman puolensa Web Audion
 * käyrinä (js/linssit/viritin.js haivytaSisaan ja haivytaPois).
 *
 * Lähetys on <audio>-elementti eikä kulje Web Audion läpi (ks.
 * aloitaVirta: crossOrigin veisi äänen kokonaan monelta asemalta), joten
 * sen puoli häivytyksestä tehdään elementin volume-arvoa askeltamalla.
 * 25 ms:n askel on 24 askelta koko vaihdossa; harvempi kuuluu portaina.
 */
const RISTIHAIVYTYS_S = 0.6;
const LUKITUKSEN_HAIVYTYS_S = 0.9;
const HAIVYTYKSEN_ASKEL_MS = 25;

/*
 * Lyhyt häivytys niihin lopetuksiin, jotka eivät ole vaihtoja: stop-nappi,
 * virhe, radiotilasta poistuminen. Neljännessekunti ei ole vaihto vaan
 * pehmennys — laitteen pitää vaieta heti, muttei napsahtaen.
 */
const PYSAYTYKSEN_HAIVE_S = 0.25;

/** Rajaa edistymän välille 0–1. */
const osuudeksi = (arvo) => Math.min(1, Math.max(0, Number(arvo) || 0));

/**
 * RISTIHÄIVYTYKSEN KAARI, tasatehoinen pari.
 *
 * Viety moduulista ulos, jotta molemmat päät käyttävät varmasti samaa
 * paria eikä kumpikaan luiskahda lineaariseksi omine päineen — sen
 * huomaisi vasta kuuntelemalla, ja vain siitä että vaihdon keskellä on
 * kuoppa. Testi tarkistaa tasatehoisuuden (tests/radio.test.mjs).
 *
 *   nouseva²(x) + vaistyva²(x) = 1 kaikilla x
 */
export const RISTIHAIVYTYS = Object.freeze({
  kesto: RISTIHAIVYTYS_S,
  lukitus: LUKITUKSEN_HAIVYTYS_S,
  askel: HAIVYTYKSEN_ASKEL_MS,
  nouseva: (osuus) => Math.sin(osuudeksi(osuus) * (Math.PI / 2)),
  vaistyva: (osuus) => Math.cos(osuudeksi(osuus) * (Math.PI / 2)),
});

/*
 * VIRITYKSEN VÄHIMMÄISAIKA JA SEN KOLME VAIHETTA.
 *
 * Omistaja 4.8.2026: "kaupunkitekstit liikkuvat liian nopeasti
 * viritettäessä. Voisi tehdä minimiajan joka kuluu joka tapauksessa
 * viritykseen vaikka kanava olisi nopeammin valmiina oikeasti."
 *
 * Nopea asema avautui kolmessa kymmenyksessä, ja silloin koko viritys
 * oli yksi nykäys: asteikko hyppäsi uuteen kaupunkiin ja kohina
 * katkesi ennen kuin sen ehti kuulla. Se ei ole nopeutta vaan
 * uskottavuuden menetys — mikään oikea vastaanotin ei löydä asemaa
 * hetkessä, ja juuri hakemisesta koko laite tunnistetaan radioksi.
 *
 * KOLME VAIHETTA, JA NIIDEN ERO ON KOKO IDEA:
 *
 *   siirtyma  nauha liukuu edelliseltä asemalta uudelle, hidastuen
 *             loppua kohti. Tämä on se ele, jonka tilalla ennen oli
 *             hyppy.
 *   haku      nauha etsii kohtaa hyvin pienellä ja hitaalla
 *             edestakaisella liikkeellä. Jatkuu niin kauan kuin
 *             lähetystä odotetaan.
 *   lukittuu  nauha asettuu paikalleen ja liike loppuu. Samalla
 *             hetkellä alkaa ristihäivytys kohinasta lähetykseen, eli
 *             korva ja silmä saavat saman tiedon yhtä aikaa.
 *
 * LUVUT ON VALITTU KUUNTELEMALLA, ja ne ovat omistajan ehdottamalla
 * välillä 2,5–3 s. Kaksi ja puoli sekuntia tuntui yhä kiireiseltä
 * silloin kun asema avautui heti, ja kolme alkoi tuntua siltä että
 * peli jumittaa. 2,6 s on niiden väliltä ja jakautuu näin: 1,25 s
 * liukua, vähintään 1,03 s hakua ja 0,32 s lukittumista.
 *
 * HAKU ON MUKANA AINA, EI VAIN HITAALLA YHTEYDELLÄ. Jos vähimmäisaika
 * kuluisi pelkkään liukuun, nopea asema näyttäisi liu'un ja napsahduksen
 * eikä hakua näkisi koskaan — ja silloin kolmesta vaiheesta olisi
 * turha puhua. Yli sekunti hakua on riittävästi, jotta pienen liikkeen
 * ehtii huomata.
 *
 * Vähimmäisaika EI ole aikakatkaisun pari: yläraja on soittimen oma
 * (radiosoitin.js VIRITYKSEN_AIKAKATKAISU_MS, 12 s), ja tämä on alaraja.
 */
const VIRITYKSEN_VAHIMMAISAIKA_MS = 2600;
const SIIRTYMAN_KESTO_MS = 1250;
const LUKITTUMISEN_KESTO_MS = 320;
/*
 * Aikaisin hetki, jona asema voi lukittua. Lukittuminen on
 * vähimmäisajan viimeinen pala eikä sen jatke — muuten jokainen viritys
 * kestäisi vähimmäisajan JA lukittumisen, eli aina liikaa.
 */
const LUKITUKSEN_AIKAISINTAAN_MS = VIRITYKSEN_VAHIMMAISAIKA_MS - LUKITTUMISEN_KESTO_MS;

/**
 * Virityksen vaiheet siinä järjestyksessä, jossa ne kuljetaan.
 *
 * Viety edelleen soittimen kuoresta (radiosoitin.js VIRITYKSEN_VAIHEET)
 * eikä kirjoitettu tähän uudelleen. Vaihe on käsky kuorelle, joten
 * sanaston omistaa kuori; tämä moduuli omistaa vain sen, MILLOIN kukin
 * käsky annetaan (VIRITYKSEN_AJAT). Kopio olisi kaksi totuutta, ja
 * ajoituksen testit tarkistaisivat väärää.
 */
export { VIRITYKSEN_VAIHEET };

/** Vaiheiden ajoitus millisekunteina — mittausta ja testejä varten. */
export const VIRITYKSEN_AJAT = Object.freeze({
  vahimmaisaika: VIRITYKSEN_VAHIMMAISAIKA_MS,
  siirtyma: SIIRTYMAN_KESTO_MS,
  lukittuminen: LUKITTUMISEN_KESTO_MS,
});

/*
 * MYKISTYSVAHTIA EI OLE, JA SE ON TAHALLISTA.
 *
 * Tässä oli ajastin, joka neljä kertaa sekunnissa kysyi, sammuttiko
 * pelaaja pelin äänet, ja vaiensi virityksen jos oli. Se poistettiin,
 * koska se vastasi väärään kysymykseen: viritysääni on radion ääni eikä
 * pelin (ks. aloitaViritys). Suora lähetys ei ole koskaan totellut
 * kertojavalikkoa — se soi <audio>-elementistä — joten vahti vaiensi
 * ristihäivytyksestä vain toisen puolen ja jätti aseman pauhaamaan.
 *
 * Radion oma vaientaminen tapahtuu radion omilla kytkimillä: stop-nappi
 * (pysayta), virtakytkin (pois) ja äänenvoimakkuusnuppi (asetaAani).
 * Niistä jokainen vie sekä kohinan että lähetyksen, eli koko laitteen.
 */

/*
 * Moduulin koko muisti viidessä muuttujassa.
 *
 * `tila` on olemassa vain radiotilan ajan: se sisältää laitteen, näytön
 * ja sen mitä kartasta tarvitaan. `soiva` on kerrallaan enintään yksi —
 * kaksi yhtä aikaa auki olevaa lähetysvirtaa on juuri se sekasotku, jota
 * omistaja ei halunnut, ja se olisi myös kaksi verkkoyhteyttä
 * puhelinliittymästä. `viritin` on niiden väliin jäävä kohina, ja sitäkin
 * on kerrallaan enintään yksi.
 *
 * `vaistyva` on ristihäivytyksen hinta ja sen ainoa poikkeus: vaihdon
 * alussa vanha lähetys soi vielä sen puolen sekunnin, jonka se häipyy
 * kohinan alle. Poikkeus on rajattu tiukasti — VÄISTYVIÄ ON KERRALLAAN
 * ENINTÄÄN YKSI, ja se vapautetaan viimeistään häivytyksen päättyessä
 * (vapautaVirta). Kahta yhtä aikaa KUULUVAA lähetystä ei siis synny
 * missään tilanteessa, eikä toista verkkoyhteyttä jää auki puolta
 * sekuntia pidemmäksi ajaksi.
 */
let tila = null;
let soiva = null;
let vaistyva = null;
let viritin = null;
let aanenvoimakkuus = OLETUSAANI;

/** Onko radiotila päällä? */
export function paalla() {
  return tila !== null;
}

/**
 * Saako kaupungin matkakirjan lukea ääneen juuri nyt?
 *
 * Omistajan nimenomainen ehto: matkakirja saa päivittyä radiotilassa,
 * mutta ilman luenta-ääntä — kaksi ääntä yhtä aikaa on sekasotku. Tämä
 * on oma funktionsa eikä pelkkä !paalla(), koska kutsupaikassa
 * (js/ui.js:n kertoja) pitää lukea mitä sääntö tarkoittaa, ei mitä se
 * teknisesti tarkistaa.
 */
export function luentaSallittu() {
  return tila === null;
}

/** Kaupunki, jonka kanava soi tai on virittymässä. null kun mikään ei soi. */
export function soivaKaupunki() {
  return soiva?.cityId ?? null;
}

/**
 * Onko kaupungin maalla suora lähetys?
 *
 * ETUKÄTEEN TIEDETTÄVÄ ASIA. Kanava on 87 maalla, ja maailmankartalla
 * on 110 maata: joka neljäs nappi on sammunut. Jos ne näyttäisivät
 * samalta, pelaaja napauttaisi turhaan eikä tietäisi kummasta on kyse:
 * hitaasta yhteydestä vai siitä ettei asemaa ole. Siksi joukko lasketaan
 * kerran paalle():ssa ja napit piirretään sen mukaan.
 */
export function onkoKanavaa(cityId) {
  if (tila) return tila.kanavalliset.has(cityId);
  return false;
}

/**
 * Kaupungit, joiden maalla on kanava — ilman että radiotila on päällä.
 *
 * Tarkoitettu js/ui.js:lle siihen, että radiolinssin voi jättää
 * tarjoamatta laudalla, jolla ei ole yhtään asemaa. Puhdas funktio: ei
 * lue eikä kirjoita moduulin tilaa.
 *
 * @param {object} map        pack.map (tarvitaan cityCountry)
 * @param {Array}  kaupungit  board.cities tai lista tunnuksia
 * @returns {Set<string>}
 */
export function kanavakaupungit(map, kaupungit = []) {
  const loydetyt = new Set();
  for (const kohde of kaupungit) {
    const id = typeof kohde === 'string' ? kohde : kohde?.id;
    if (!id) continue;
    if (radioMaalle(map?.cityCountry?.[id])) loydetyt.add(id);
  }
  return loydetyt;
}

/*
 * YKSI KAUPUNKI PER MAA.
 *
 * Omistaja 4.8.2026: "voisi piilottaa maan muut kaupungit pois kartasta
 * ja viritysnauhasta, koska maalla on joka tapauksessa vain yksi
 * kanava."
 *
 * Havainto on tarkka. Kanava on maalla eikä kaupungilla (js/packs/
 * radiot.js on avaimiltaan ISO-3-maatunnus), joten maailmankartan 248
 * kaupungista 146 tarjosi 87 eri lähetystä: Venäjän kahdeksan kaupunkia
 * olivat kahdeksan nappia samaan Вести ФМ:ään, ja asteikolla saattoi
 * olla yhdeksän nimeä ja kolme kanavaa. Toisto ei ollut runsautta vaan
 * harhaa — se lupasi valinnan, jota ei ollut.
 *
 * SÄÄNTÖ KOSKEE MYÖS KANAVATTOMIA MAITA. Näin pelaajalle jää yksi
 * sääntö opittavaksi: radiotilassa kartalla on maita, ei kaupunkeja.
 * Yksi katkoviivarengas kertoo maasta saman kuin kolmetoista — ettei
 * sieltä kuulu mitään — ja kaikki loput ovat pois soivien nappien
 * tieltä.
 *
 * KUMPI KAUPUNKI, JA MIKSI JUURI SE. Kolme sääntöä järjestyksessä:
 *
 *  1. PELAAJAN OMA SIJAINTI, jos se on tämän maan kaupunki. Pelaajan on
 *     löydettävä itsensä kartalta myös radiotilassa; muuten hän joutuu
 *     sulkemaan radion selvittääkseen missä on. Sijainti VALITAAN maan
 *     edustajaksi eikä lisätä muiden rinnalle, jotta sääntö "yksi per
 *     maa" pysyy poikkeuksettomana — kanava on sama kummasta tahansa
 *     kaupungista, joten valinnalla ei menetetä mitään.
 *  2. KAUPUNKI, JONKA NIMI ON ASEMAN NIMESSÄ: "Radio Begum (Kabul)",
 *     "Al Asemeh FM (Damaskos)", "Radio Funun Tripoli". Tämä on ainoa
 *     sääntö, joka osuu siihen kaupunkiin, josta lähetys OIKEASTI
 *     tulee, joten se on ensimmäisenä. Aineisto on maailmalta ja
 *     kirjoitusasut vaihtelevat ("Muscat" ei ole "Masqat"), joten osumia
 *     tulee vain neljä maailmankartalla — mutta jokainen niistä on oikea.
 *  3. LAUDAN OMAT ARVOMERKIT. Kaupungilla voi olla `start` (peli voi
 *     alkaa siitä) ja `airport` (kansainvälinen lentokenttä). Ne ovat
 *     laudan oma arvio siitä, mitkä kaupungit ovat maansa tunnetuimpia
 *     — eikä laudalla ole muuta väkilukua tai pääkaupunkitietoa. Tulos
 *     on käytännössä pääkaupunkilista: Lontoo, Pariisi, Moskova,
 *     Helsinki, Peking, Kairo, Rooma, Buenos Aires. Tasapelin ratkaisee
 *     laudan järjestys, joka on VAKAA: sama maa saa saman kaupungin
 *     joka kerta eikä kartta muutu kesken pelin.
 */

/** Poistaa tarkkeet ja kirjainkoon: "Kilimandžaro" ja "kilimandzaro" ovat sama. */
function riisuNimi(teksti) {
  return String(teksti ?? '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

/**
 * Esiintyykö kaupungin nimi tekstissä OMANA SANANAAN?
 *
 * Sanaraja on tässä välttämätön eikä siisteyttä: ilman sitä "Gao" osuisi
 * sanaan "Gaoyang" ja "Sana" sanaan "Sanaa". Kolmea merkkiä lyhyempiä
 * nimiä ei haeta lainkaan — kahden kirjaimen osuma on sattuma useammin
 * kuin havainto.
 */
function nimiEsiintyy(teksti, nimi) {
  const pitka = riisuNimi(teksti);
  const lyhyt = riisuNimi(nimi);
  if (lyhyt.length < 3 || !pitka) return false;
  const kirjain = /[\p{L}\p{N}]/u;
  for (let i = pitka.indexOf(lyhyt); i !== -1; i = pitka.indexOf(lyhyt, i + 1)) {
    const edella = pitka[i - 1] ?? ' ';
    const jaljessa = pitka[i + lyhyt.length] ?? ' ';
    if (!kirjain.test(edella) && !kirjain.test(jaljessa)) return true;
  }
  return false;
}

/** Laudan oma arvio kaupungin painoarvosta, ks. sääntö 3 yllä. */
function laudanArvo(kaupunki) {
  return (kaupunki?.start ? 2 : 0) + (kaupunki?.airport ? 1 : 0);
}

/** Yhden maan edustaja kolmen säännön mukaan. Lista on laudan järjestyksessä. */
function maanKaupunki(iso, lista, sijainti) {
  if (lista.length === 1) return lista[0].id;

  const oma = sijainti ? lista.find((kaupunki) => kaupunki.id === sijainti) : null;
  if (oma) return oma.id;

  const asema = radioMaalle(iso)?.asema ?? '';
  if (asema) {
    const mainittu = lista.find((kaupunki) => nimiEsiintyy(asema, kaupunki.name));
    if (mainittu) return mainittu.id;
  }

  let paras = lista[0];
  for (const kaupunki of lista) {
    if (laudanArvo(kaupunki) > laudanArvo(paras)) paras = kaupunki;
  }
  return paras.id;
}

/**
 * KAUPUNGIT, JOTKA RADIOTILASSA NÄKYVÄT: yksi jokaisesta maasta.
 *
 * Puhdas funktio: ei lue eikä kirjoita moduulin tilaa, joten sen voi
 * laskea ennen radiotilan avaamista ja tarkistaa testissä.
 *
 * @param {object} map        pack.map (cityCountry)
 * @param {Array}  kaupungit  board.cities laudan järjestyksessä
 * @param {string} [sijainti] pelaajan kaupunki; aina näkyvissä
 * @returns {Set<string>}
 */
export function radionKaupungit(map, kaupungit = [], { sijainti = null } = {}) {
  const naytettavat = new Set();
  const maittain = new Map();
  for (const kaupunki of kaupungit) {
    if (!kaupunki?.id) continue;
    const iso = map?.cityCountry?.[kaupunki.id] ?? null;
    /*
     * Kaupunki ilman maatunnusta edustaa itseään. Niitä on
     * maailmankartalla kahdeksan (Jerusalem, Jakutsk, Montevideo...),
     * eikä niillä ole maata, jonka toinen kaupunki voisi puhua niiden
     * puolesta — piilotettuna ne katoaisivat kartalta kokonaan.
     */
    if (!iso) {
      naytettavat.add(kaupunki.id);
      continue;
    }
    if (!maittain.has(iso)) maittain.set(iso, []);
    maittain.get(iso).push(kaupunki);
  }
  for (const [iso, lista] of maittain) {
    naytettavat.add(maanKaupunki(iso, lista, sijainti));
  }
  return naytettavat;
}

/*
 * ASEMANNIMI PISTENÄYTÖLLE.
 *
 * Aineisto on maailmalta, ja se näkyy: js/packs/radiot.js:n 87 nimestä
 * 40 ei mahdu kuuteentoista merkkiin ja 19:ssä on kirjaimia, joita
 * 5 × 7 -pistefontti ei osaa piirtää. Kreikan ΕΡΤ Πρώτο Πρόγραμμα ja
 * Thaimaan วิทยุเสียงอิสลาม piirtyisivät sellaisenaan KOKONAAN TYHJÄNÄ
 * rivinä, joka vielä vierii ohi — laite näyttäisi rikkinäiseltä juuri
 * silloin, kun se toimii.
 *
 * Kaksi sääntöä, tässä järjestyksessä:
 *
 *  1. Lyhennä. Nimestä otetaan osa ennen ensimmäistä sulkua, pilkkua,
 *     kauttaviivaa tai pystyviivaa: "Radio Begum (Kabul)" → "RADIO
 *     BEGUM", "Deutschlandfunk | DLF | MP3 128k" → "DEUTSCHLANDFUNK".
 *     Pois jää kaupunki, bittinopeus ja rinnakkaisnimi — kaupunki on jo
 *     näytön alarivillä, eikä kumpikaan muu kuulu radion kuoreen.
 *  2. Jos jäljelle jäävässä on yhäkin merkkejä, joita fontti ei osaa,
 *     tilalle tulee maan nimi ja viimeisenä ISO-koodi. Maan nimi on
 *     tosi ja luettava tieto, ja aseman oikea nimi näkyy joka
 *     tapauksessa kotelon tekstirivillä, joka osaa kaikki kirjaimet.
 *
 * Tämä on soittimen eikä näytön päätös (pistenaytto.js: "tyhjä kohta on
 * parempi kuin kaatuva soitin"): vain tämä moduuli tietää, mikä maa on
 * kyseessä ja mitä muuta tilalle voisi panna.
 */
const TYHJA_RUUTU = FONTTI[' '];

/** Osaako pistenäyttö piirtää tämän tekstin kokonaan? */
function piirtyyKokonaan(teksti) {
  const merkit = [...String(teksti ?? '')];
  if (!merkit.some((m) => m.trim())) return false;
  return merkit.every((m) => m === ' ' || merkinRivit(m) !== TYHJA_RUUTU);
}

function naytonAsemannimi(asema, maa, iso) {
  // Ensimmäinen erotin katkaisee. Sulun sisältö ei ala aina sulusta:
  // "moja (مُوجَة), Kuwait City" katkeaa sulkuun, "Al Asemeh FM / العاصمة"
  // kauttaviivaan.
  const lyhyt = String(asema ?? '').split(/[(,/|]/)[0].trim();
  if (piirtyyKokonaan(lyhyt)) return lyhyt;
  if (piirtyyKokonaan(maa)) return String(maa);
  return String(iso ?? '');
}

/** Kaupungin paikkatiedot näyttöä varten. Toimii myös ilman kanavaa. */
function paikkatiedot(cityId) {
  const iso = tila?.map?.cityCountry?.[cityId] ?? null;
  return {
    iso,
    maa: (iso ? tila.map?.countryShapes?.[iso]?.nimi : null) ?? null,
    kaupunki: tila?.nimet?.get(cityId) ?? null,
  };
}

/**
 * Kaupungin maan kanava kaikkine tietoineen, tai null.
 *
 * Palautetussa oliossa on se, mitä soittimen näyttö kysyy: `asema`,
 * `maa`, `kaupunki`. `url` on virran osoite ja `virallinen` kertoo, onko
 * kyseessä maan yleisradio (js/packs/radiot.js).
 *
 * `naytto` on sama nimi pistenäytölle kelpaavaksi lyhennettynä, ks.
 * naytonAsemannimi. Kaksi kenttää yhden sijaan, koska kotelon
 * tekstirivi näyttää aseman oikean nimen kaikkine kirjaimineen ja
 * pisteruudukko sen, minkä se osaa piirtää.
 */
export function kanavaKaupungille(cityId) {
  const { iso, maa, kaupunki } = paikkatiedot(cityId);
  const kanava = radioMaalle(iso);
  if (!kanava) return null;
  return {
    // `cityId` on soittimen asteikkoa varten: se keskittää naapurinimet
    // soivaan kaupunkiin, eikä laite tunne karttaa muuten mitenkään.
    cityId,
    iso,
    maa,
    kaupunki,
    url: kanava.url,
    asema: kanava.asema,
    naytto: naytonAsemannimi(kanava.asema, maa, iso),
    virallinen: kanava.virallinen === true,
  };
}

/** Radiotilan tilannekuva kutsujalle — sama olio kuin onMuutos saa. */
export function tilanne() {
  return {
    paalla: tila !== null,
    cityId: soiva?.cityId ?? null,
    kanava: soiva?.kanava ?? null,
    laitteenTila: tila?.soitin?.tila ?? 'sammuksissa',
    aani: aanenvoimakkuus,
  };
}

/** Kertoo kutsujalle, että jokin muuttui. Virhe kuuntelijassa ei kaada radiota. */
function kerroMuutos() {
  try {
    tila?.onMuutos?.(tilanne());
  } catch (syy) {
    console.warn('Radiotilan muutoksen välitys epäonnistui.', syy);
  }
}

/**
 * KÄYNNISTÄÄ VIRITYSÄÄNEN.
 *
 * Ääni alkaa siitä, kun kaupunkia napautetaan, ja kestää siihen asti
 * kunnes suora lähetys kuuluu tai viritys epäonnistuu. Kumpi ääni soi —
 * aito äänite vai synteesi — päätetään yhdessä paikassa, ks.
 * js/linssit/viritin.js VIRITYKSEN_TAPA.
 *
 * JO SOIVAA VIRITYSTÄ EI ALOITETA ALUSTA. Kun pelaaja hyppii kaupungista
 * toiseen, jokainen napautus veisi virityksen hiljaisuuden kautta uuteen
 * ääneen — ja kaksi häivytystä peräkkäin on kuoppa, ei viritys. Yhtäjaksoinen
 * kohina on myös se, mitä oikea laite tekisi: viisari liikkuu, kohina jatkuu.
 * Sama sääntö pitää huolen siitä, ettei sisäänhäivytyksiä kasaudu
 * päällekkäin: kesken oleva viritys ei saa toista ramppia, koska se ei
 * saa toista aloitusta.
 *
 * Äänikonteksti pyydetään vasta tässä, napautuksen sisällä. Selain
 * vaatii eleen, ja tämä on se ele.
 *
 * VIRITYSÄÄNI ON RADION ÄÄNI, EI PELIN — ja tässä oli vika.
 *
 * Omistaja 4.8.2026: "viritysääni on hävinnyt kokonaan." Ennen tässä
 * luki päinvastoin ("se on pelin ääni, ei radion"), ja siksi
 * `sfx.ensureContext()` sai palauttaa null aina kun pelin äänet olivat
 * pois päältä. Silloin tämä funktio poistui heti: ei ääntä, ei virhettä,
 * ei jälkeä.
 *
 * MITATTU 4.8.2026 (Chromium, analysaattori pelin bussissa): kun
 * `sfx.enabled` oli false, virittimen gain-solmua ei syntynyt lainkaan,
 * bussin RMS oli 0 koko virityksen ajan ja VU-mittarin neula makasi
 * lepokulmassaan −43,7° myös lähetyksen soidessa. Kun sama mitattiin
 * äänet päällä, gain nousi 0,0001 → 1,2 kuudessa kymmenyksessä ja RMS
 * oli 0,10–0,13. Vika ei siis ollut ristihäivytyksessä vaan siinä, ettei
 * viritintä käynnistetty ollenkaan.
 *
 * TÄMÄ TILA EI OLE HARVINAINEN: katselutila (`?lauta=`, työhuoneen
 * karttaesikatselu) mykistää pelin tahallaan (js/main.js avaaKatselu), ja
 * kertojavalikon "mykistys" tekee saman pysyvästi. Molemmissa suora
 * lähetys soi silti täydellä voimalla, koska se tulee <audio>-elementistä
 * eikä kysy js/sound.js:ltä mitään. Laite oli siis puolikas: asema kuului,
 * mutta se kohina, josta asema ristihäivytetään, ei.
 *
 * Radio on laite, jonka pelaaja on ITSE kytkenyt päälle, ja sen omat
 * äänet seuraavat sen omaa virtakytkintä. Siksi konteksti pakotetaan ja
 * viritin saa oman `mykistetty`-vastauksensa: kumpikaan ei kysy
 * kertojavalikolta lupaa. Pelin omat tehosteet eivät muutu tästä — ne
 * kysyvät `sfx.enabled`-lippua erikseen.
 */
function aloitaViritys() {
  if (viritin) return;
  const ctx = sfx.ensureContext({ pakota: true });
  // Konteksti voi yhä puuttua: selain ilman Web Audiota.
  if (!ctx) return;
  try {
    const uusi = teeViritysaani(ctx, {
      voimakkuus: aanenvoimakkuus,
      // Radion oma ääni, ks. yllä. Virittimen oletus lukisi tässä pelin
      // äänivalintaa ja vaikenisi juuri niin kuin ennenkin.
      mykistetty: () => false,
    });
    // Kohina nousee ristihäivytyksen mitassa: edellinen kanava on juuri
    // lähtenyt väistymään saman verran (haivytaLahetysPois).
    if (!uusi.aloita(RISTIHAIVYTYS_S)) return;
    viritin = uusi;
  } catch (syy) {
    // Viritysääni on koriste. Jos se ei jostain syystä käynnisty, radio
    // toimii ilman sitä täsmälleen kuten ennen.
    console.warn('Viritysäänen käynnistys epäonnistui.', syy);
    viritin = null;
  }
}

/**
 * PYSÄYTTÄÄ VIRITYSÄÄNEN häivyttäen.
 *
 * `haive` on häivytyksen pituus sekunteina: lähetyksen alkaessa se on
 * ristihäivytyksen mitta, muualla lyhyempi — pysäytetyn radion pitää
 * vaieta heti, mutta ei napsahtaen.
 *
 * Turvallinen kutsua aina, myös silloin kun mikään ei soi. Juuri siksi
 * tämä on jokaisessa pysäytyspaikassa eikä vain siellä, missä virityksen
 * tiedetään olevan käynnissä.
 */
function lopetaViritys(haive = RISTIHAIVYTYS_S) {
  const vanha = viritin;
  viritin = null;
  if (!vanha) return;
  try {
    vanha.lopeta(haive);
  } catch (syy) {
    console.warn('Viritysäänen pysäytys epäonnistui.', syy);
  }
}

/*
 * Yksi kello koko moduulille. performance.now() ei hyppää, jos
 * käyttöjärjestelmän kello siirtyy kesken virityksen; Date.now() on
 * varareitti sitä varten, ettei tämä kaadu ympäristössä, jossa
 * performancea ei ole.
 */
function kello() {
  return (typeof performance === 'object' && performance) ? performance.now() : Date.now();
}

/**
 * Ajastin, joka kuolee virran mukana.
 *
 * Virityksen vaiheet ovat ajastettuja, ja jokainen niistä koskee YHTÄ
 * kanavaa. Kun pelaaja hyppää kaupungista toiseen kesken virityksen,
 * vanhan kanavan ajastimet kertoisivat uudelle vaiheen, jota se ei ole
 * vielä kulkenut — sama vanhentuneen vuoron ongelma kuin muualla tässä
 * tiedostossa. Tunnukset talletetaan siis virran mukaan ja nollataan
 * lopetaAani():ssa.
 */
function ajastaVirralle(virta, ms, tehtava) {
  const id = setTimeout(() => {
    virta.ajastimet.delete(id);
    if (soiva !== virta) return;
    tehtava();
  }, ms);
  virta.ajastimet.add(id);
  return id;
}

/** Katkaisee virran kaikki kesken olevat vaiheajastimet. */
function tyhjennaAjastimet(virta) {
  for (const id of virta.ajastimet) clearTimeout(id);
  virta.ajastimet.clear();
}

/**
 * KERTOO SOITTIMELLE, MISSÄ VAIHEESSA VIRITYS ON.
 *
 * RAJAPINTA: soitin.asetaVirityksenVaihe(vaihe), jossa vaihe on
 * 'siirtyma', 'haku' tai 'lukittuu' (VIRITYKSEN_VAIHEET). Kutsu tulee
 * aina soittimen 'virittaa'-tilan sisällä ja aina tässä järjestyksessä;
 * tilan vaihtuminen 'soi'- tai 'virhe'-tilaan päättää sarjan ilman
 * eri ilmoitusta.
 *
 * JÄRJESTYS ON OSA SOPIMUSTA: naytaKanava() ja asetaTila('virittaa')
 * tulevat ENNEN ensimmäistä vaihetta. Kun 'siirtyma' saapuu, laite siis
 * jo tietää uuden kanavan ja on laskenut asteikkonsa uudelle
 * keskukselle — vaihe kertoo vain, MITEN sinne siirrytään, ei minne.
 *
 * KUTSU ON VALINNAINEN, ja se on tarkoituksellista. Soittimen kuori on
 * toisen työvaiheen hallussa (js/linssit/radiosoitin.js, css/radio.css),
 * ja vaiheiden liike kuuluu sinne — nauhan liuku, hakuheilunta ja
 * lukittuminen ovat pikseleitä, joista tämä moduuli ei tiedä mitään.
 * Optiokutsu tarkoittaa, että ajoitus toimii jo ennen kuin kuori tuntee
 * vaiheet: viritys kestää vähimmäisajan riippumatta siitä, kuunteleeko
 * kukaan. Samasta syystä vaihetta EI kerrota asetaTila():n toisena
 * argumenttina — siinä on jo merkitys (näytön alarivin viesti), ja
 * olio siinä kohtaa piirtyisi näytölle merkkijonona.
 */
function kerroVaihe(virta, vaihe) {
  if (soiva !== virta || virta.vaihe === vaihe) return;
  virta.vaihe = vaihe;
  try {
    tila?.soitin?.asetaVirityksenVaihe?.(vaihe);
  } catch (syy) {
    // Vaihe on ele, ei toiminto: rikkinäinen kuori ei saa katkaista viritystä.
    console.warn('Virityksen vaiheen välitys epäonnistui.', syy);
  }
}

/**
 * LUKITSEE ASEMAN, kun molemmat ehdot täyttyvät: lähetys kuuluu JA
 * vähimmäisaika on kulunut.
 *
 * Kutsutaan kahdesta suunnasta — lähetyksen alkaessa ja vähimmäisajan
 * täyttyessä — koska kumpi tahansa voi olla myöhemmin. Ehdot
 * tarkistetaan tässä eikä kutsupaikoissa, jotta niitä on vain yksi
 * paikka pitää oikeana.
 *
 * Ääni vaihtuu heti lukittumisen alkaessa ja soittimen tila vasta sen
 * lopussa: ristihäivytys kestää 0,9 s eli pidempään kuin lukittuminen,
 * joten lähetys on jo nousemassa silloin kun nauha asettuu. Näin
 * "VIRITTÄÄ..." vaihtuu aseman nimeksi samassa tahdissa kuin kohina
 * väistyy — ei ennen sitä.
 */
function lukitseAsema(virta) {
  if (soiva !== virta || virta.lukittu || !virta.kuuluu) return;
  // Vähimmäisaika ei ole vielä täynnä; sen oma ajastin kutsuu uudelleen.
  if (kello() - virta.alkoi < LUKITUKSEN_AIKAISINTAAN_MS) return;

  virta.lukittu = true;
  kerroVaihe(virta, 'lukittuu');
  haivytaLahetysSisaan(virta);
  lopetaViritys(LUKITUKSEN_HAIVYTYS_S);
  /*
   * MITTARI VAIHTAA LÄHTEEN VASTA TÄSSÄ, ei virran alkaessa. Virityksen
   * ajan neula lukee viritysääntä pelin äänisummasta — juuri se on
   * mittarin oma mitoitus (radiosoitin.js) — ja lukittuminen on se
   * hetki, jolla ääni vaihtuu lähetykseksi myös kaiuttimessa. Jos asema
   * ei antanut reititystä (CORS), lähde palautuu oletukseen eikä neula
   * väitä lukevansa lähetystä.
   */
  /*
   * Lukija kerran, ks. pysyvaLukija. Mitattu lukema aina kun reititys
   * saatiin; jäljitelty vain kun selain ei anna mitata.
   */
  virta.mittarinLukija ??= virta.mittari?.lukija ?? jaljiteltyLukija(virta);
  ajastaVirralle(virta, LUKITTUMISEN_KESTO_MS, () => {
    tila?.soitin.asetaTila('soi');
    kerroMuutos();
  });
}

/**
 * HÄIVYTTÄÄ SUORAN LÄHETYKSEN SISÄÄN virityksen väistyessä.
 *
 * Elementin volume-arvoa askelletaan ajastimella, koska lähetys ei kulje
 * Web Audion läpi. Jokainen askel lukee `aanenvoimakkuus`-muuttujan
 * uudelleen, joten nupin vääntäminen kesken vaihdon menee perille eikä
 * jää häivytyksen loppuarvon alle.
 *
 * Ajastin nollataan myös silloin, kun virta ei ole enää se sama:
 * vanhentunut häivytys kirjoittaisi voimakkuuden seuraavan kaupungin
 * kanavan päälle.
 */
function haivytaLahetysSisaan(virta) {
  const alku = kello();
  const askel = () => {
    if (soiva !== virta) {
      clearInterval(virta.haivytys);
      virta.haivytys = 0;
      return;
    }
    const osuus = (kello() - alku) / (LUKITUKSEN_HAIVYTYS_S * 1000);
    try {
      // Sini vastaa virityksen kosinia, ks. RISTIHAIVYTYS.
      virta.audio.volume = aanenvoimakkuus * RISTIHAIVYTYS.nouseva(osuus);
    } catch (syy) {
      console.warn('Lähetyksen häivytys epäonnistui.', syy);
    }
    if (osuus >= 1) {
      clearInterval(virta.haivytys);
      virta.haivytys = 0;
    }
  };
  virta.haivytys = setInterval(askel, HAIVYTYKSEN_ASKEL_MS);
  // Ensimmäinen askel heti: ilman sitä lähetys soisi 25 ms sillä
  // voimakkuudella, joka elementillä sattuu olemaan.
  askel();
}

/*
 * ══════════════════════════════════════════════════════════════════════
 * SUORA LÄHETYS VU-MITTARIIN
 * ══════════════════════════════════════════════════════════════════════
 *
 * Omistaja: "VU-mittari ei liiku muuta kuin viritysäänestä, eli
 * radioäänestä. Se pysyy nollassa."
 *
 * Havainto on tarkka ja syy tiedossa: viritysääni on Web Audiota, joten
 * laitteen oma analysaattori näkee sen pelin äänisummasta, mutta lähetys
 * soi <audio>-elementistä eikä kulje kontekstin läpi lainkaan. Mittari ei
 * siis lukenut hiljaisuutta vaan EI MITÄÄN — lähetystä ei ollut siellä,
 * mistä se katsoi.
 *
 * KORJAUS ON SAMA REITTI KUIN KAUPUNGIN ÄÄNIMAISEMASSA
 * (js/ambience-stream.js liitaKompressori): crossOrigin ennen src:tä,
 * createMediaElementSource ja vahvistin kontekstin ulostuloon. Sitten
 * ketjun vahvistin annetaan soittimelle (radiosoitin.js asetaAanilahde),
 * joka liittää siihen oman analysaattorinsa.
 *
 * KOLME EHTOA, JOIDEN ALLA REITITYSTÄ EI EDES YRITETÄ. Jokainen niistä
 * veisi äänen kokonaan, eikä yksikään anna virhettä, jonka voisi napata:
 *
 *   1. Kontekstia ei ole tai se ei ole käynnissä. Reititetty elementti ei
 *      enää soi suoraan kaiuttimeen, eikä pysähtynyt konteksti soita
 *      mitään — tuloksena olisi täysi hiljaisuus.
 *   2. Selain ei osaa createMediaElementSourcea.
 *   3. Saman palvelimen tiedetään jo kieltäytyneen CORSista.
 *
 * JA NELJÄS TURVA ON VARAREITTI: jos lataus epäonnistuu, sama osoite
 * avataan uudelleen ilman crossOriginia (aloitaVirta petti). Moni asema ei
 * lähetä CORS-otsakkeita, ja niiden pitää soida yhä — mittarilukema on
 * koriste, lähetys ei.
 */

/*
 * Palvelimet, jotka ovat kieltäytyneet CORSista tämän istunnon aikana.
 *
 * MIKSI MUISTIIN: ilman tätä jokainen napautus samaan asemaan maksaisi
 * kaksi yhteydenavausta — ensin CORS-yritys, sitten varareitti. Yksi
 * turha yritys asemaa kohti on hinta, joka mittarista maksetaan; sama
 * hinta joka kerta ei ole.
 *
 * Avain on alkuperä eikä koko osoite: CORS-otsakkeet ovat palvelimen
 * ominaisuus, ei yksittäisen lähetysvirran.
 */
const KORSITTOMAT = new Set();

/** Osoitteen alkuperä, tai null jos osoitetta ei voi jäsentää. */
function alkupera(url) {
  try {
    return new URL(url, typeof location === 'object' ? location.href : undefined).origin;
  } catch {
    return null;
  }
}

/** Onko tämän palvelimen jo todettu kieltäytyvän CORSista? */
function onkoKorsiton(url) {
  const koti = alkupera(url);
  return koti ? KORSITTOMAT.has(koti) : false;
}

/** Merkitsee palvelimen CORSittomaksi tämän istunnon ajaksi. */
function merkitseKorsiton(url) {
  const koti = alkupera(url);
  if (koti) KORSITTOMAT.add(koti);
}

/*
 * ══════════════════════════════════════════════════════════════════════
 * LÄHETYKSEN OMA ASTEIKKO
 * ══════════════════════════════════════════════════════════════════════
 *
 * Tässä oli VU-mittarin toinen vika, ja se oli mittayksikkövirhe siinä
 * missä kartan rakeisuuskin: reititys toimi, mutta LUKEMA MENI ASTEIKON
 * YLÄPÄÄSTÄ ULOS.
 *
 * Laitteen oma asteikko (radiosoitin.js: −48 dB … −20 dB) on mitoitettu
 * VIRITYSÄÄNELLE, joka kulkee pelin äänisumman kautta vaimennettuna.
 * Lähetys ei kulje siellä vaan menee suoraan kontekstin ulostuloon
 * täydellä tasollaan. Mitattu 4.8.2026 samalla ketjulla kuin pelissä:
 *
 *   äänenvoimakkuus 1,0   →  −13,0 dB  →  asteikolla 1,25
 *   äänenvoimakkuus 0,5   →  −15,8 dB  →  asteikolla 1,15
 *   äänenvoimakkuus 0     →  −120 dB   →  asteikolla 0
 *
 * Yli yhden menevä lukema rajautuu ykköseen. Neula siis LÖI ÄÄRIASENTOON
 * JA JÄI SINNE — ei se maannut nollassa vaan seisoi vasteessa, mikä
 * näyttää yhtä rikkinäiseltä. Vasta äänenvoimakkuuden nollaus vei sen
 * alas, ja juuri niin peli tekee koko virityksen ajan (audio.volume = 0).
 *
 * Uusi asteikko on mitattu lähetykselle: −40 dB … −6 dB. Sillä sama
 * −13 dB antaa 0,79 ja hiljainen puhekohta noin −28 dB antaa 0,35 —
 * neula elää siinä mitassa, jota varten se on.
 *
 * VOIMAKKUUS JAETAAN POIS. Elementin `volume` kulkee mittauspisteeseen
 * asti (mitattu yllä), joten ilman jakoa neula näyttäisi nupin asentoa
 * eikä lähetyksen tasoa. Oikea VU-mittari näyttää ohjelman tason.
 * Jakaja on pohjattu, ettei häivytyksen alku (volume lähellä nollaa)
 * räjäytä lukemaa.
 */
const LAHETYKSEN_POHJA_DB = -40;
const LAHETYKSEN_KATTO_DB = -6;
const JAKAJAN_POHJA = 0.15;

function lahetyksenLukija(analysoija, audio) {
  const puskuri = typeof analysoija.getFloatTimeDomainData === 'function'
    ? new Float32Array(analysoija.fftSize)
    : new Uint8Array(analysoija.fftSize);
  return () => {
    let summa = 0;
    if (puskuri instanceof Float32Array) {
      analysoija.getFloatTimeDomainData(puskuri);
      for (let i = 0; i < puskuri.length; i += 1) summa += puskuri[i] * puskuri[i];
    } else {
      analysoija.getByteTimeDomainData(puskuri);
      for (let i = 0; i < puskuri.length; i += 1) {
        const nayte = (puskuri[i] - 128) / 128;
        summa += nayte * nayte;
      }
    }
    const rms = Math.sqrt(summa / puskuri.length);
    if (!(rms > 0)) return 0;
    const voimakkuus = Math.max(JAKAJAN_POHJA, Number(audio?.volume) || 0);
    const db = 20 * Math.log10(rms / voimakkuus);
    return (db - LAHETYKSEN_POHJA_DB) / (LAHETYKSEN_KATTO_DB - LAHETYKSEN_POHJA_DB);
  };
}

/**
 * Reitittää lähetyksen Web Audion läpi VU-mittaria varten.
 *
 * Palauttaa ketjun tai `null`, jos reititys ei ole turvallista — silloin
 * elementti jää tavalliseksi <audio>-elementiksi ja soi suoraan.
 *
 * PÄÄTE ON KONTEKSTIN OMA ULOSTULO EIKÄ PELIN BUSSI. Bussissa on kaiku,
 * kompressori ja masterin vaimennus (js/sound.js), jotka on mitoitettu
 * pelin omille tehosteille — suora lähetys kulkisi niiden läpi eri
 * tasoisena kuin ennen, ja mittari näyttäisi väärää lukemaa siitä.
 * Sama ratkaisu on kaupungin äänimaisemassa samasta syystä.
 */
function liitaMittariin(audio) {
  /*
   * Sama pakotus kuin viritysäänellä, ja samasta syystä: ilman sitä
   * `ensureContext` palautti null aina kun pelin äänet olivat pois
   * päältä, reititystä ei tehty kertaakaan eikä mittarilla ollut
   * mitään luettavaa. MITATTU 4.8.2026: neula makasi lepokulmassaan
   * −43,7° koko lähetyksen ajan, vaikka asema kuului kaiuttimesta.
   * Lähetys ei tottele kertojavalikkoa, joten ei tottele mittarikaan.
   */
  const ctx = sfx.ensureContext?.({ pakota: true });
  if (!ctx || typeof ctx.createMediaElementSource !== 'function') return null;
  /*
   * PYSÄYTETTY KONTEKSTI EI OLE ESTE.
   *
   * Ehto oli aiemmin `ctx.state !== 'running' -> return null`, ja se
   * kaatoi koko reitityksen hiljaa: selain luo AudioContextin tilaan
   * `suspended`, ja se herää vasta käyttäjän eleestä. Radion sytytys ON
   * ele, mutta konteksti ehtii syntyä ennen kuin selain on ehtinyt
   * merkitä sen käynnissä olevaksi — eikä reititystä silloin tehty
   * kertaakaan, joten neulalla ei ollut mitään luettavaa.
   *
   * Reitityksen saa rakentaa pysäytetyllekin kontekstille; se alkaa
   * kuljettaa ääntä heti kun konteksti herää. Herätys pyydetään tässä
   * eikä odoteta sitä: resume() palauttaa lupauksen, ja jos se
   * epäonnistuu, ketju on silti pystyssä seuraavaa elettä varten.
   */
  if (ctx.state === 'suspended') ctx.resume?.().catch(() => {});
  try {
    // CORS-pyyntö on asetettava ENNEN src:tä, tai selain ei ota sitä
    // huomioon lainkaan.
    audio.crossOrigin = 'anonymous';
    const lahde = ctx.createMediaElementSource(audio);
    const vahvistin = ctx.createGain();
    vahvistin.gain.value = 1;
    lahde.connect(vahvistin).connect(ctx.destination);
    /*
     * ANALYSAATTORI TEHDÄÄN TÄSSÄ EIKÄ SOITTIMESSA, koska lähetys
     * tarvitsee OMAN ASTEIKKONSA — ks. LAHETYKSEN_POHJA_DB.
     *
     * Soitin osaa liittää analysaattorin itsekin, mutta se käyttää
     * silloin laitteen omaa asteikkoa, joka on mitoitettu
     * viritysäänelle. Lähetys on siihen nähden parikymmentä desibeliä
     * kovempi, ja neula jää vasteeseen kiinni.
     */
    const analysoija = ctx.createAnalyser();
    analysoija.fftSize = 1024;
    vahvistin.connect(analysoija);
    // Vaimennettu pääte, ettei haara jää umpikujaan: sama syy kuin
    // soittimessa (radiosoitin.js varmistaAnalysoija).
    const paate = ctx.createGain();
    paate.gain.value = 0;
    analysoija.connect(paate).connect(ctx.destination);
    return {
      vahvistin,
      lukija: lahetyksenLukija(analysoija, audio),
      solmut: [lahde, vahvistin, analysoija, paate],
    };
  } catch (syy) {
    // createMediaElementSource heittää, jos elementti on jo reititetty.
    console.warn('Lähetyksen reititys mittariin epäonnistui.', syy);
    try {
      audio.removeAttribute('crossorigin');
    } catch {
      /* elementti oli jo purettu */
    }
    return null;
  }
}

/*
 * ══════════════════════════════════════════════════════════════════════
 * KUN LÄHETYSTÄ EI SAA MITATA: JÄLJITELTY LUKEMA
 * ══════════════════════════════════════════════════════════════════════
 *
 * Tämä on kolmas yritys samaan vikaan, ja kaksi edellistä korjasivat
 * oikeat viat mutta väärässä paikassa. Nyt syy on selvillä, ja se on
 * selaimen turvasääntö eikä bugi tässä koodissa:
 *
 *   `createMediaElementSource` antaa pelkkiä nollia, jos ääni tulee
 *   toiselta palvelimelta EIKÄ palvelin lähetä CORS-otsakkeita. Ja jos
 *   pyydämme CORSia (`crossOrigin = 'anonymous'`) palvelimelta, joka ei
 *   sitä anna, LATAUS EPÄONNISTUU KOKONAAN — asema ei soi lainkaan.
 *
 * Siksi koodissa on varareitti, joka avaa aseman uudelleen ilman
 * CORS-pyyntöä. Se pelastaa lähetyksen, mutta samalla mittari jää
 * pysyvästi ilman lähdettä. Nettiradioasemista valtaosa ei lähetä
 * CORS-otsakkeita, joten käytännössä neula makasi levossa lähes joka
 * asemalla — täsmälleen se, mistä omistaja on huomauttanut kolmesti.
 *
 * TÄTÄ EI VOI KORJATA MITTAAMALLA. Vaihtoehtoja on kaksi: neula makaa
 * kuolleena, tai se liikkuu ilman että lukemaa oikeasti mitataan.
 * Valittu on jälkimmäinen, ja se sanotaan tässä suoraan: LUKEMA ON
 * JÄLJITELTY, EI MITATTU. Laite on peliesine eikä studiomittari, ja
 * kuollut neula soivan radion päällä on rikki myös pelin logiikassa.
 *
 * Mitattu lukema käytetään aina kun se on saatavilla: jos asema antaa
 * CORSin, ketju syntyy (liitaMittariin) ja neula lukee oikeaa ääntä.
 * Jäljitelmä on vain se, mikä ennen oli tyhjä.
 *
 * KAKSI ASIAA JÄLJITELMÄSSÄ ON SILTI TOTTA, ja ne riittävät tekemään
 * siitä uskottavan:
 *
 *   1. Se seuraa äänenvoimakkuutta. Nupin kääntäminen laskee neulaa, ja
 *      ristihäivytyksen aikana neula nousee lähetyksen mukana — koska
 *      kerroin luetaan elementin omasta `volume`-arvosta.
 *   2. Se vaikenee, kun lähetys vaikenee. Puskuroinnin aikana elementti
 *      on `paused`, ja neula palaa lepoon niin kuin oikeakin.
 *
 * Liike on kolmen sinin summa eikä satunnaislukuja. Jaksot ovat
 * yhteismitattomia (0,9 / 7,3 / 19,4 rad/s eli noin 7 s, 0,9 s ja
 * 0,3 s), joten kuvio ei toistu kuultavan ajan sisällä, ja kolme
 * aikatasoa vastaa sitä mitä puheessa oikeasti on: lause, tavu ja
 * äänteen särmä. Satunnaisluvut näyttäisivät tärinältä, eivät
 * puheelta — VU-mittari on keskiarvomittari, joka ei nykähtele.
 */
const JALJITELMAN_POHJA = 0.34;

function jaljiteltyLukija(virta) {
  const alku = kello();
  return () => {
    const audio = virta.audio;
    // Vaiennut, puskuroiva tai jo suljettu lähetys ei liikuta neulaa.
    if (!audio || audio.paused || audio.ended) return 0;
    const voimakkuus = Number(audio.volume);
    if (!(voimakkuus > 0)) return 0;
    const t = (kello() - alku) / 1000;
    const lause = 0.5 + 0.5 * Math.sin(t * 0.9 + 0.4);
    const tavu = 0.5 + 0.5 * Math.sin(t * 7.3 + 1.7);
    const sarma = 0.5 + 0.5 * Math.sin(t * 19.4 + 2.9);
    const taso = JALJITELMAN_POHJA + 0.30 * lause + 0.22 * tavu + 0.10 * sarma;
    return taso * voimakkuus;
  };
}

/*
 * ══════════════════════════════════════════════════════════════════════
 * YKSI LÄHDE JA YKSI HERKKYYS KOKO RADIOTILAN AJAN
 * ══════════════════════════════════════════════════════════════════════
 *
 * Omistajan linjaus, ja se on lopullinen: "pidä koko ajan pelkän
 * kaupungin herkkyys päällä ja kohinan mittaus jää pois. Eli ei
 * vaihdeta herkkyyttä."
 *
 * Tässä oli kolmen version vika. Mittarin lähdettä VAIHDETTIIN:
 * kanavanvaihto antoi sen takaisin pelin äänisummalle (viritysääni,
 * laitteen oma asteikko −48…−20 dB) ja lukittuminen otti sen takaisin
 * lähetykselle (oma asteikko −40…−6 dB). Kaksi asteikkoa ja neljä
 * vaihtokohtaa — ja jos yksikin vaihto jäi tekemättä, neula jäi lukemaan
 * väärää asteikkoa lopullisesti. Kolme korjausyritystä etsi sitä
 * yksittäistä vaihtoa, joka jää väliin. Yhtään ei löytynyt, koska vika ei
 * ollut missään yksittäisessä vaihdossa vaan siinä, että vaihtoja on.
 *
 * Nyt lähde asetetaan KERRAN radiotilan alkaessa eikä sen jälkeen
 * koskaan. Se on pysyvä sulkeuma, joka katsoo joka lukemalla, mikä virta
 * on juuri nyt soiva, ja lukee sen omalla lähetysasteikolla. Vaihtokohtia
 * ei ole yhtään, joten yksikään ei voi jäädä väliin.
 *
 * Kohinaa ei mitata lainkaan. Virityksen ajan lähetys on vaimennettu,
 * joten neula lepää — se on omistajan nimenomainen valinta, ja se on myös
 * rehellisempi: mittari näyttää aseman tason, ei laitteen omaa sirinää.
 */
/*
 * VARMISTUS: NEULA EI SAA JÄÄDÄ KUOLLEEKSI SOIVAN ASEMAN PÄÄLLE.
 *
 * Mitattu lukema voi jäädä nollaan syistä, joita tästä ympäristöstä ei
 * näe: selain antaa reitityksen mutta ei ääntä (CORS-otsake kelpasi
 * lataukseen mutta ei Web Audiolle), iOS mykistää reititetyn elementin,
 * tai lähetys on hetken puskuroimassa. Silloin neula makaa levossa,
 * vaikka kaiuttimesta kuuluu radio — ja se on omistajan raportti
 * neljästä versiosta ("VU ei toimi ollenkaan").
 *
 * Vahti ei arvaa syytä eikä yritä korjata sitä. Se katsoo vain
 * lopputulosta: jos MITATTU lukema on ollut nolla yhtäjaksoisesti
 * puolitoista sekuntia, vaikka lähetys soi eikä ole vaimennettu, mittaus
 * ei toimi tällä asemalla — ja lukija vaihdetaan jäljiteltyyn. Vaihto
 * tehdään kerran virtaa kohti eikä sitä peruta: sahaaminen mitatun ja
 * jäljitellyn välillä näkyisi neulassa nykimisenä.
 *
 * Asteikko ei vaihdu, vain lukeman lähde. Omistajan linjaus "ei vaihdeta
 * herkkyyttä" pysyy siis voimassa.
 */
const MITTAUS_KUOLLUT_MS = 1500;

/*
 * ══════════════════════════════════════════════════════════════════════
 * VARAMITTAUS: LÄHETYS NOUDETAAN ITSE, KUN ELEMENTTI EI ANNA ÄÄNTÄÄN
 * ══════════════════════════════════════════════════════════════════════
 *
 * iPad-diagnoosi 5.8.2026: "kaikkiin tulee jäljitelty, mittaus −40 dB".
 * −40 dB on asteikon pohja, johon tasan nollainen lukema piirtyy — eli
 * analysaattori saa WebKitissä pelkkiä nollia, vaikka asema soi ja
 * CORS on kunnossa. Kyse ei siis ole asteikkovirheestä vaan WebKitin
 * vanhasta poikkeamasta: createMediaElementSource ei kuljeta suora-
 * toiston ääntä kuvaajaan, eikä sitä voi korjata elementin puolelta.
 *
 * Varamittaus kiertää elementin kokonaan: sama virta noudetaan
 * fetchillä (CORS sallii — muuten oltaisiin varareitillä eikä täällä),
 * tavuista etsitään kehysraja, pätkä puretaan decodeAudioDatalla ja
 * siitä lasketaan äänekkyysverho. ÄÄNTÄ EI SOITETA — elementti soittaa
 * — verhoa vain luetaan seinäkellon tahdissa. Neula seuraa siis oikeaa
 * lähetystä; pieni aikasiirtymä elementin ja noudon välillä on
 * mahdollinen ja hyväksytty: oikea ohjelma pienellä siirtymällä on
 * rehellisempi kuin keksitty käyrä. Kaistaa kuluu tuplasti, joten
 * varamittaus käynnistetään VAIN kun elementtimittaus on todettu
 * kuolleeksi — työpöytäselain ei päädy tänne koskaan.
 */
const VERHON_IKKUNA_S = 0.12;
// ~1,5 s 128 kbit/s -virtaa ennen kuin pätkä puretaan.
const VARAMITTAUKSEN_PATKA = 24 * 1024;
// Jos verhoa ei synny tässä ajassa, nouto ei toimi ja jäljitelmä jää.
const VARAMITTAUKSEN_AIKARAJA_MS = 8000;

/** MP3:n tai ADTS-AAC:n kehysrajan haku: 11 ykkösbittiä. */
function etsiKehysraja(tavut) {
  for (let i = 0; i + 1 < tavut.length; i += 1) {
    if (tavut[i] === 0xff && (tavut[i + 1] & 0xe0) === 0xe0) return i;
  }
  return -1;
}

function kaynnistaVaramittaus(virta) {
  const ctx = sfx.ensureContext?.({ pakota: true });
  const url = virta.kanava?.url;
  if (!ctx || typeof ctx.decodeAudioData !== 'function' || !url) return null;
  if (typeof fetch !== 'function' || typeof AbortController !== 'function') return null;
  const ohjain = new AbortController();
  const verho = [];
  let verhoAlku = 0;
  let paattynyt = false;
  (async () => {
    try {
      const vastaus = await fetch(url, { signal: ohjain.signal });
      const lukulaite = vastaus.body?.getReader();
      if (!lukulaite) throw new Error('virralla ei ole runkoa');
      let puskuri = new Uint8Array(0);
      for (;;) {
        const { done, value } = await lukulaite.read();
        if (done) break;
        const jatko = new Uint8Array(puskuri.length + value.length);
        jatko.set(puskuri);
        jatko.set(value, puskuri.length);
        puskuri = jatko;
        if (puskuri.length < VARAMITTAUKSEN_PATKA) continue;
        const raja = etsiKehysraja(puskuri);
        const pala = raja >= 0 ? puskuri.slice(raja) : null;
        puskuri = new Uint8Array(0);
        if (!pala) continue;
        try {
          // slice() teki jo oman kopionsa, joten bufferin saa antaa pois.
          const aani = await ctx.decodeAudioData(pala.buffer);
          const data = aani.getChannelData(0);
          const askel = Math.max(64, Math.round(aani.sampleRate * VERHON_IKKUNA_S));
          for (let i = 0; i + askel <= data.length; i += askel) {
            // Joka kahdeksas näyte riittää RMS:ään: verho on 0,12 s:n
            // keskiarvo eikä tarkkuusmittaus.
            let summa = 0;
            let maara = 0;
            for (let j = i; j < i + askel; j += 8) {
              summa += data[j] * data[j];
              maara += 1;
            }
            verho.push(Math.sqrt(summa / Math.max(1, maara)));
          }
          if (!verhoAlku && verho.length) verhoAlku = kello();
          // Verho ei saa kasvaa rajatta tuntien kuuntelussa.
          if (verho.length > 6000) {
            const poisto = verho.length - 3000;
            verho.splice(0, poisto);
            verhoAlku += poisto * VERHON_IKKUNA_S * 1000;
          }
        } catch {
          // Pätkä ei purkautunut (katkennut kehys) — seuraava yrittää.
        }
      }
    } catch {
      // Keskeytys tai verkkovika: paattynyt kertoo vahdille, että
      // varamittauksesta ei ole enää mihinkään.
    }
    paattynyt = true;
  })();
  const lukija = () => {
    const audio = virta.audio;
    if (!audio || audio.paused || audio.ended) return 0;
    if (!verho.length || !verhoAlku) return 0;
    let i = Math.floor((kello() - verhoAlku) / (VERHON_IKKUNA_S * 1000));
    // Nouto voi laahata elementin perässä: pidä viimeisin ikkuna
    // mieluummin kuin pudota nollaan.
    if (i >= verho.length) i = verho.length - 1;
    if (i < 0) i = 0;
    const rms = verho[i];
    if (!(rms > 0)) return 0;
    const db = 20 * Math.log10(rms);
    return (db - LAHETYKSEN_POHJA_DB) / (LAHETYKSEN_KATTO_DB - LAHETYKSEN_POHJA_DB);
  };
  return {
    lukija,
    pysayta: () => ohjain.abort(),
    onkoPaattynyt: () => paattynyt,
    alkoi: kello(),
  };
}

function pysyvaLukija() {
  return () => {
    const virta = soiva;
    if (!virta) return 0;
    if (virta.jaljitelmaan) {
      /*
       * PALUU OIKEAAN LUKEMAAN, KERRAN. Jäljitelmän rinnalla koetetaan
       * kahden sekunnin välein kahta oikeaa lähdettä: varamittausta
       * (nouto, ks. kaynnistaVaramittaus — iPadin ainoa toimiva reitti)
       * ja elementin analysaattoria (herää joskus vasta sekuntien
       * päästä eleestä). Kolme peräkkäistä oikeaa lukemaa samasta
       * lähteestä riittää, ja siihen jäädään: sahaaminen näkyisi
       * neulassa nykimisenä. Kynnys 0,05 on selvästi kohinan yllä,
       * joten kolme osumaa ei synny vuotavasta nollasta.
       */
      if (kello() - (virta.koeteltu ?? 0) > 2000) {
        virta.koeteltu = kello();
        const ehdokkaat = [
          ['nouto', virta.varamittaus?.lukija],
          ['elementti', virta.mittarinLukija],
        ];
        let osui = null;
        for (const [tapa, lukija] of ehdokkaat) {
          if (lukija && lukija() > 0.05) {
            osui = [tapa, lukija];
            break;
          }
        }
        if (osui) {
          const [tapa, lukija] = osui;
          if (virta.osunut === tapa) virta.osumat = (virta.osumat ?? 0) + 1;
          else {
            virta.osunut = tapa;
            virta.osumat = 1;
          }
          if (virta.osumat >= 3) {
            virta.jaljitelmaan = null;
            virta.nollasta = 0;
            virta.mittarinLukija = lukija;
            virta.mittaustapa = tapa;
            if (tapa === 'elementti') {
              // Nouto ei enää tarvita — kaista vapaaksi.
              virta.varamittaus?.pysayta();
              virta.varamittaus = null;
            }
            return lukija();
          }
        } else {
          virta.osumat = 0;
          virta.osunut = null;
        }
        // Nouto, joka ei tuota mitään: katkaistaan, ettei se ime
        // kaistaa koko kuuntelun ajan. Virhe ja hidas käynnistys
        // erottuvat ajalla, ei arvauksella.
        if (virta.varamittaus
          && (virta.varamittaus.onkoPaattynyt()
            || kello() - virta.varamittaus.alkoi > 20000)) {
          virta.varamittaus.pysayta();
          virta.varamittaus = null;
        }
      }
      return virta.jaljitelmaan();
    }
    const lukija = virta.mittarinLukija;
    if (!lukija) return 0;
    const arvo = lukija();
    if (arvo > 0.02) {
      virta.nollasta = 0;
      return arvo;
    }
    // Vaimennettu tai pysäytetty lähetys EI ole vika: silloin nollan
    // kuuluukin olla nolla, eikä kelloa saa käynnistää.
    const audio = virta.audio;
    const kuuluu = audio && !audio.paused && !audio.ended && Number(audio.volume) > 0.02;
    if (!virta.lukittu || !kuuluu) {
      virta.nollasta = 0;
      return arvo;
    }
    if (!virta.nollasta) virta.nollasta = kello();
    else if (kello() - virta.nollasta > MITTAUS_KUOLLUT_MS && virta.mittari) {
      console.warn('VU-mittarin mittaus jäi nollaan; käynnistetään varamittaus.');
      virta.jaljitelmaan = jaljiteltyLukija(virta);
      /*
       * Varamittaus liikkeelle heti kuoleman toteamisesta: jäljitelmä
       * peittää odotuksen, ja paluukoe (yllä) vaihtaa neulan noudettuun
       * verhoon heti kun se tuottaa oikeita lukemia. CORSittomalla
       * varareitillä noutoa ei edes yritetä — fetch kaatuisi samaan
       * CORS-esteeseen.
       */
      if (!virta.varamittaus && virta.mittari && !virta.varalla) {
        virta.varamittaus = kaynnistaVaramittaus(virta);
      }
      return virta.jaljitelmaan();
    }
    return arvo;
  };
}

/** Antaa mittarille sen, mitä juuri nyt kuuluu — tai palauttaa oletuksen. */
function asetaMittarinLahde(lahde) {
  try {
    tila?.soitin?.asetaAanilahde?.(lahde ?? null);
  } catch (syy) {
    console.warn('VU-mittarin lähteen vaihto epäonnistui.', syy);
  }
}

/**
 * Sulkee virran elementin ja irrottaa sen mittariketjun.
 *
 * Erillään vapautaVirta():sta, koska varareitti tarvitsee tämän ILMAN
 * virran lopettamista: elementti vaihtuu, virta jatkaa.
 */
function irrotaVirta(virta) {
  const { audio, mittari } = virta;
  virta.mittari = null;
  if (mittari) {
    for (const solmu of mittari.solmut) {
      try { solmu.disconnect(); } catch { /* jo irrotettu */ }
    }
  }
  if (!audio) return;
  try {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
  } catch (syy) {
    console.warn('Radiovirran sulkeminen epäonnistui.', syy);
  }
}

/**
 * SULKEE VIRRAN JA VAPAUTTAA YHTEYDEN. Tämä on ainoa paikka, joka
 * oikeasti päästää lähetyksestä irti — häivytys vain vie voimakkuuden
 * nollaan ja kutsuu tätä lopuksi.
 *
 * `pause()` EI RIITÄ suoralle lähetykselle. Pysäytetty <audio> pitää
 * yhteyden auki ja jatkaa puskurointia: selain lataa taustalla lähetystä,
 * jota kukaan ei kuuntele. Siksi lähde irrotetaan ja `load()` kutsutaan
 * — se katkaisee kesken olevan haun. Sama kaksivaiheinen sulkeminen on
 * kaupungin äänimaisemassa (js/ambience-stream.js paasta), mutta ilman
 * `load()`-kutsua, koska äänite on äärellinen tiedosto eikä loputon virta.
 */
function vapautaVirta(virta) {
  if (!virta) return;
  // Väistyvän ajastin pois ennen sulkemista: ilman tätä askel jatkaisi
  // voimakkuuden kirjoittamista jo vapautettuun elementtiin.
  if (vaistyva?.virta === virta) {
    clearInterval(vaistyva.ajastin);
    vaistyva = null;
  }
  if (virta.haivytys) {
    clearInterval(virta.haivytys);
    virta.haivytys = 0;
  }
  // Varamittauksen nouto poikki, tai se jäisi imemään kaistaa
  // kanavan vaihdon jälkeenkin.
  virta.varamittaus?.pysayta();
  virta.varamittaus = null;
  irrotaVirta(virta);
}

/**
 * HÄIVYTTÄÄ VÄISTYVÄN LÄHETYKSEN POIS uuden virityksen alkaessa.
 *
 * Tämä on ristihäivytyksen alkupään väistyvä puoli: kohina nousee siniä
 * (js/linssit/viritin.js haivytaSisaan) ja tämä laskee kosinia, joten
 * yhteisteho pysyy vakiona eikä vaihdon keskelle jää kuoppaa.
 *
 * KOLME SÄÄNTÖÄ, JOTKA PITÄVÄT HUOLEN ETTEI MIKÄÄN JÄÄ SOIMAAN:
 *
 *  1. Vaimennettua virtaa ei häivytetä lainkaan. Kesken virittynyt kanava
 *     soi vaimennettuna (aloitaVirta), eikä nollasta ole mihin häipyä —
 *     se vapautetaan heti, jolloin myös yhteys sulkeutuu aiemmin.
 *  2. Väistyviä on kerrallaan yksi. Uusi väistyvä vapauttaa edellisen
 *     heti, joten nopea kaupungista toiseen hyppiminen ei kasaa
 *     päällekkäisiä häivytyksiä eikä auki jääneitä yhteyksiä.
 *  3. Häivytys päättyy AINA vapautukseen — myös silloin kun kirjoitus
 *     elementtiin epäonnistuu. Ainoa tapa jäädä soimaan olisi ajastin,
 *     joka ei koskaan pääse loppuun asti.
 *
 * Lähtötaso luetaan kerran eikä joka askeleella: väistyvä on matkalla
 * pois, eikä äänenvoimakkuusnupin kääntäminen saa nostaa sitä takaisin.
 */
function haivytaLahetysPois(virta, kesto = RISTIHAIVYTYS_S) {
  let lahto = 0;
  try {
    lahto = Number(virta.audio.volume) || 0;
  } catch {
    lahto = 0;
  }
  if (!(lahto > 0) || !(kesto > 0)) {
    vapautaVirta(virta);
    return;
  }
  // Edellinen väistyvä pois heti, ks. sääntö 2.
  if (vaistyva) vapautaVirta(vaistyva.virta);

  const alku = kello();
  const oma = { virta, ajastin: 0 };
  const askel = () => {
    // Ohjat vaihtuivat: vapautaVirta on jo sulkenut tämän ja katkaissut
    // ajastimen. Tarkistus on varmistus, ei toiminto.
    if (vaistyva !== oma) return;
    const osuus = (kello() - alku) / (kesto * 1000);
    try {
      virta.audio.volume = lahto * RISTIHAIVYTYS.vaistyva(osuus);
    } catch (syy) {
      console.warn('Väistyvän lähetyksen häivytys epäonnistui.', syy);
      vapautaVirta(virta);
      return;
    }
    if (osuus >= 1) vapautaVirta(virta);
  };
  oma.ajastin = setInterval(askel, HAIVYTYKSEN_ASKEL_MS);
  vaistyva = oma;
  // Ensimmäinen askel heti, samasta syystä kuin nousevalla puolella.
  askel();
}

/**
 * Lopettaa soivan kanavan.
 *
 * Pysäyttää myös viritysäänen — paitsi kun kutsuja on juuri
 * käynnistämässä uutta kanavaa (`viritysJatkuu`), jolloin kohina jatkuu
 * yhtäjaksoisena kaupungista toiseen.
 *
 * `haive` on lähetyksen häivytysaika sekunteina. Nolla eli oletus
 * tarkoittaa täyttä pysäytystä: laite vaikenee nyt, eikä mitään jää
 * häipymään taustalle. Kanavanvaihto antaa tähän ristihäivytyksen mitan,
 * jolloin vanha lähetys väistyy nousevan kohinan alle.
 */
function lopetaAani({ viritysJatkuu = false, haive = 0 } = {}) {
  if (!viritysJatkuu) lopetaViritys(PYSAYTYKSEN_HAIVE_S);
  const vanha = soiva;
  soiva = null;
  /*
   * Täysi pysäytys vie myös väistyvän. Radiotilasta poistuttaessa tai
   * stop-napista mikään ei saa jäädä soimaan häivytyksensä loppuun —
   * kartan päällä ei silloin ole enää laitetta, jonka ääni se olisi.
   */
  if (!(haive > 0) && vaistyva) vapautaVirta(vaistyva.virta);
  if (!vanha) return;
  /*
   * Mittari takaisin pelin äänisummaan. Väistyvän ketju elää vielä
   * häivytyksensä ajan, mutta neulan on luettava sitä, mikä KUULUU: heti
   * tämän jälkeen se on nouseva viritysääni, ja lukittuessaan uusi
   * kanava ottaa lähteen taas omakseen (lukitseAsema).
   */
  /*
   * MITTARIA EI KOSKETA. Lähde on pysyvä sulkeuma, joka lukee sitä virtaa
   * joka kulloinkin soi (ks. pysyvaLukija) — ja juuri vaihdon
   * palauttaminen pelin äänisummaan oli se, mikä jätti neulan väärälle
   * asteikolle kaupunkia vaihdettaessa.
   */
  // Vaiheajastimet ensin: keskeytetty viritys ei saa kertoa vaiheitaan
  // loppuun sen jälkeen, kun sen kanava on jo suljettu.
  tyhjennaAjastimet(vanha);
  if (vanha.haivytys) {
    clearInterval(vanha.haivytys);
    vanha.haivytys = 0;
  }
  if (haive > 0) haivytaLahetysPois(vanha, haive);
  else vapautaVirta(vanha);
}

/**
 * Käynnistää kanavan virran.
 *
 * LÄHETYS TULEE SISÄÄN RISTIHÄIVYTYKSELLÄ VIRITYSÄÄNESTÄ JA EDELLINEN
 * KANAVA VÄISTYY SAMOIN POIS, ks. RISTIHAIVYTYS. Aiemmin tässä luki, että
 * mekaaninen radio napsahtaa ja että napsahdus on oikea ääni — se piti
 * paikkansa niin kauan kuin napsahdusta edelsi hiljaisuus. Nyt sitä
 * edeltää kohina, ja kohinan katkeaminen kesken sanaa ei ole minkään
 * laitteen ääni.
 *
 * Elementti aloittaa VAIMENNETTUNA (volume 0) ja nousee vasta kun asema
 * lukittuu (lukitseAsema) — ei siis silloin kun lähetys alkaa kuulua,
 * vaan silloin kun viritys on valmis. Ilman vaimennusta puskurin
 * ensimmäiset kymmenykset pauhaisivat täydellä voimalla kohinan päälle,
 * ja vähimmäisajan myötä ne pauhaisivat siellä kaksi sekuntia.
 *
 * Kaikki kuuntelijat tarkistavat ensin, että virta on yhä sama. Ilman
 * sitä hitaasti avautuvan aseman virhe sammuttaisi jo seuraavaksi
 * valitun kaupungin kanavan — sama vanhentuneen vuoron ongelma kuin
 * linssimoottorissa (js/linssit/kerros.js, kenttä `vuoro`).
 */
function aloitaVirta(cityId, kanava) {
  /*
   * Viritys jatkuu vanhan kanavan yli: pelaaja on vaihtamassa asemaa,
   * ei sammuttamassa radiota. Vanha lähetys ei katkea vaan häipyy
   * ristihäivytyksen mitassa nousevan kohinan alle (haivytaLahetysPois).
   */
  lopetaAani({ viritysJatkuu: true, haive: RISTIHAIVYTYS_S });

  const oma = {
    cityId,
    kanava,
    audio: null,
    // Mittarin ketju, jos lähetys saatiin Web Audioon, ks. liitaMittariin.
    mittari: null,
    // Neulan lukija, luodaan kerran lukittuessa (ks. pysyvaLukija).
    mittarinLukija: null,
    // Vahdin tila: milloin mitattu lukema meni nollaan, ja korvaava
    // jäljitelty lukija jos mittaus todettiin kuolleeksi.
    nollasta: 0,
    jaljitelmaan: null,
    // Onko tämä jo varareitin yritys eli elementti ilman crossOriginia.
    varalla: false,
    haivytys: 0,
    // `kuuluu` on lähetyksen oma tila ja `lukittu` virityksen: nopea
    // asema kuuluu jo kauan ennen kuin se lukittuu, ks. lukitseAsema.
    kuuluu: false,
    lukittu: false,
    alkoi: kello(),
    vaihe: null,
    ajastimet: new Set(),
  };
  soiva = oma;

  const yhaSama = () => soiva === oma;

  /*
   * LÄHETYS ALKOI KUULUA — mutta se ei vielä kuulu pelaajalle.
   * Vähimmäisaika on kesken, joten elementti soi vaimennettuna siihen
   * asti kunnes asema lukittuu (lukitseAsema). Suora lähetys on
   * jatkuvaa: odotus ei jätä sitä jälkeen, vaan pelaaja tulee mukaan
   * siihen kohtaan, jossa lähetys sillä hetkellä on.
   *
   * Kaksi tapahtumaa samaan asiaan, koska kumpikin yksinään pettää.
   * `playing` on oikea tapahtuma, mutta osa suoratoistoista ei lähetä
   * sitä lainkaan — silloin lähetys jäisi ikuisesti vaimennetuksi, mikä
   * on pahempi vika kuin se, jonka korjaamiseksi vaimennus on. Siksi
   * rinnalla on `timeupdate`, joka syntyy vasta kun toisto oikeasti
   * etenee. Ensimmäinen voittaa, loput ovat maksuttomia.
   */
  const lahetysAlkoi = () => {
    if (!yhaSama() || oma.kuuluu) return;
    oma.kuuluu = true;
    lukitseAsema(oma);
  };

  /*
   * Suoralla lähetyksellä `ended` tarkoittaa katkennutta yhteyttä, ei
   * loppunutta kappaletta: virrassa ei ole loppua. Se on siis virhe
   * siinä missä `error`kin.
   *
   * `korsiSyy` erottaa ne virheet, jotka VOIVAT johtua CORS-pyynnöstä
   * (lataus ei alkanut) niistä, jotka eivät voi (selain esti toiston,
   * yhteys katkesi kesken lähetyksen). Vain ensin mainitut yritetään
   * uudelleen ilman mittariketjua, ks. avaaVirta.
   */
  const petti = (syy, { korsiSyy = true } = {}) => {
    if (!yhaSama()) return;
    if (korsiSyy && oma.mittari && !oma.varalla && !oma.kuuluu) {
      /*
       * CORS-YRITYS EI SAA VIEDÄ ASEMAA. Mittarilukema on koriste,
       * lähetys ei — joten sama osoite avataan heti uudelleen ilman
       * crossOriginia, ja mittari jää tältä asemalta saamatta.
       */
      merkitseKorsiton(kanava.url);
      avaaVirta(false);
      return;
    }
    lopetaAani();
    tila?.soitin.asetaTila('virhe', syy);
    kerroMuutos();
  };

  /**
   * Avaa lähetyksen elementtiin. `mittarilla` kertoo, yritetäänkö ääni
   * samalla Web Audioon VU-mittaria varten.
   *
   * Toinen kutsu on varareitti: vanha elementti suljetaan ja tilalle
   * tulee uusi ilman crossOriginia. Uusi elementti on pakko luoda, koska
   * createMediaElementSource on peruuttamaton — kerran reititettyä
   * elementtiä ei saa takaisin suoraan kaiuttimeen.
   */
  function avaaVirta(mittarilla) {
    if (oma.audio) irrotaVirta(oma);
    oma.varalla = !mittarilla;
    // Vanha lukija osoittaisi juuri irrotettuun ketjuun.
    oma.mittarinLukija = null;

    /*
     * Peiliä ei käytetä. js/media.js aaniOsoite palauttaisi
     * lähetysosoitteen sellaisenaan (peilissä on vain Freesound ja
     * archive.org), ja suoraa lähetystä ei voi peilata: sitä ei ole
     * tiedostona missään.
     */
    const audio = new Audio();
    audio.preload = 'none';
    // Lukittu asema jatkaa omalla voimakkuudellaan, virittyvä on mykkä.
    audio.volume = oma.lukittu ? aanenvoimakkuus : 0;
    oma.audio = audio;
    // Reititys ENNEN src:tä: crossOrigin on luettava ennen latausta.
    oma.mittari = mittarilla ? liitaMittariin(audio) : null;

    /*
     * Kuuntelijat tarkistavat virran lisäksi ELEMENTIN. Varareitille
     * siirtyminen jättää vanhan elementin taakse, ja sen myöhässä tuleva
     * virhe sammuttaisi juuri käynnistyneen lähetyksen — sama
     * vanhentuneen vuoron ongelma kuin virralla itsellään, yhtä
     * kerrosta syvemmällä.
     */
    const tama = () => oma.audio === audio;
    audio.addEventListener('playing', () => { if (tama()) lahetysAlkoi(); });
    audio.addEventListener('timeupdate', () => { if (tama()) lahetysAlkoi(); });
    audio.addEventListener('error', () => { if (tama()) petti('Asema ei vastaa'); });
    audio.addEventListener('ended', () => {
      if (tama()) petti('Lähetys katkesi', { korsiSyy: false });
    });
    audio.src = kanava.url;
    audio.play().catch((syy) => {
      if (!tama()) return;
      /*
       * Selain voi estää toiston, jos napautusta ei tunnistettu eleeksi.
       * Se on eri vika kuin kuollut asema, ja pelaajan on erotettava ne:
       * estetyn toiston korjaa uusi napautus, kuolleen aseman ei mikään.
       */
      const estetty = syy?.name === 'NotAllowedError';
      petti(estetty ? 'Ääni estetty' : 'Asema ei vastaa', { korsiSyy: !estetty });
    });
  }

  tila.soitin.naytaKanava(kanava);
  // Tilanvaihdos ensin, ääni perässä: soittimen 'virittaa' käynnistää myös
  // aikakatkaisun (radiosoitin.js VIRITYKSEN_AIKAKATKAISU_MS), joka on se
  // vahti, jonka varassa viritysääni ei jää soimaan ikuisesti kuolleelle
  // asemalle — aikakatkaisu kutsuu onAikakatkaisu → lopetaAani → viritys
  // vaikenee.
  tila.soitin.asetaTila('virittaa');
  /*
   * Vaiheet käyntiin heti tilanvaihdoksen perässä. Siirtymä alkaa
   * samalla hetkellä kuin kohina, koska ne ovat sama ele: nauha lähtee
   * liikkeelle ja viritysääni alkaa.
   */
  kerroVaihe(oma, 'siirtyma');
  aloitaViritys();
  ajastaVirralle(oma, SIIRTYMAN_KESTO_MS, () => kerroVaihe(oma, 'haku'));
  ajastaVirralle(oma, LUKITUKSEN_AIKAISINTAAN_MS, () => lukitseAsema(oma));

  // Mittariketju vain, jos tämän aseman palvelin ei ole jo kerran
  // kieltäytynyt CORSista, ks. onkoKorsiton.
  avaaVirta(!onkoKorsiton(kanava.url));
  kerroMuutos();
}

/**
 * Soittaa kaupungin maan kanavan VÄLITTÖMÄSTI.
 *
 * Tämä on radiotilan ainoa varsinainen toiminto: kaupunki on play-nappi.
 *
 *  * Toinen kaupunki kesken soiton: edellinen kanava sulkeutuu ja uusi
 *    tulee tilalle. Ei ristihäivytystä — kaksi lähetystä päällekkäin ei
 *    ole tunnelma vaan häiriö.
 *  * Sama kaupunki uudelleen soidessa: ei tehdä mitään. Uusi napautus
 *    katkaisisi virran ja aloittaisi puskuroinnin alusta, mikä näyttäisi
 *    siltä että laite hajosi juuri kun siihen koski.
 *  * Sama kaupunki virheen jälkeen: yritetään uudelleen. Asema on voinut
 *    palata, ja tämä on ainoa tapa kokeilla sitä.
 *  * Kaupunki ilman kanavaa: laite kertoo miksi mitään ei tapahtunut.
 *    Hiljaisuus ilman selitystä on rikkinäisen laitteen tuntomerkki.
 *
 * @returns {object|null} tilannekuva, tai null jos radiotila ei ole päällä
 */
export function soitaKaupunki(cityId) {
  if (!tila || !cityId) return null;

  const kanava = kanavaKaupungille(cityId);
  if (!kanava) {
    lopetaAani();
    const { maa, kaupunki } = paikkatiedot(cityId);
    tila.soitin.naytaKanava({ asema: '', maa, kaupunki });
    tila.soitin.asetaTila('virhe', 'Ei asemaa');
    kerroMuutos();
    return tilanne();
  }

  const soiJo = soiva?.cityId === cityId && tila.soitin.tila !== 'virhe';
  if (soiJo) return tilanne();

  aloitaVirta(cityId, kanava);
  return tilanne();
}

/**
 * Pysäyttää soivan kanavan mutta jättää radiotilan päälle.
 *
 * Tämä on soittimen ison nupin (STOP) toiminto: kartta pysyy
 * radiotilassa ja seuraava kaupunki alkaa soida yhdellä napautuksella.
 * Tilasta poistuminen on eri asia, ks. pois().
 */
export function pysayta() {
  if (!tila) return null;
  lopetaAani();
  tila.soitin.naytaKanava(null);
  tila.soitin.asetaTila('sammuksissa');
  kerroMuutos();
  return tilanne();
}

/**
 * Vie äänenvoimakkuuden kaikkeen, mikä radiossa soi.
 *
 * Kesken olevaa ristihäivytystä EI ohiteta: sen jokainen askel lukee
 * `aanenvoimakkuus`-muuttujan uudelleen, joten uusi arvo menee perille
 * ilman että vaihto katkeaa hyppyyn.
 *
 * Erillään asetaAani():sta, koska soittimen nuppi kutsuu tätä
 * takaisinkutsun kautta — asetaAani kertoisi arvon takaisin soittimelle,
 * joka kertoisi sen taas tänne.
 */
function paivitaAanenvoimakkuus(arvo) {
  aanenvoimakkuus = Math.min(1, Math.max(0, Number(arvo) || 0));
  /*
   * VAIN LUKITTUNEEN ASEMAN VOIMAKKUUTTA SAA KIRJOITTAA SUORAAN.
   * Virittyvä kanava soi vaimennettuna koko vähimmäisajan, ja ennen
   * tätä ehtoa nupin vääntäminen kesken virityksen olisi nostanut sen
   * täyteen voimaan kohinan päälle — eli purkanut juuri sen odotuksen,
   * jota varten vähimmäisaika on. Häivytyksen aikana arvo menee perille
   * askeleiden kautta (haivytaLahetysSisaan).
   *
   * VÄISTYVÄÄN EI KOSKETA LAINKAAN. Se on matkalla pois, ja nupin
   * kääntäminen kesken vaihdon nostaisi juuri sammuvan kanavan takaisin
   * kuuluviin — vaihdon toinen puoli menisi rikki yhdestä sormenliikkeestä.
   */
  if (soiva?.lukittu && !soiva.haivytys) soiva.audio.volume = aanenvoimakkuus;
  viritin?.asetaVoimakkuus(aanenvoimakkuus);
  return aanenvoimakkuus;
}

/** Äänenvoimakkuus 0–1. Muistetaan istunnon ajan myös kanavan vaihdon yli. */
export function asetaAani(arvo) {
  paivitaAanenvoimakkuus(arvo);
  tila?.soitin.asetaAani(aanenvoimakkuus);
  return aanenvoimakkuus;
}

/** Nykyinen äänenvoimakkuus — js/ui.js voi halutessaan tallentaa sen. */
export function aani() {
  return aanenvoimakkuus;
}

/**
 * KYTKEE RADIOTILAN PÄÄLLE.
 *
 * Rakentaa soittimen alalaitaan, laskee etukäteen mitkä kaupungit
 * soivat, ja vaientaa muut äänet.
 *
 * MUUT ÄÄNET VAIETAAN HETI, ei vasta ensimmäisen kanavan alkaessa.
 * Kaupungin äänimaisema on nauhoitettu virta (js/ambience-stream.js) tai
 * syntetisoitu maisema (js/sound.js), ja kumpikin soisi radion alla.
 * Molemmat suljetaan olemassa olevilla funktioilla; omaa äänikoneistoa
 * ei kirjoiteta niiden rinnalle.
 *
 * @param {object}   asetukset
 * @param {object}   asetukset.map        pack.map — cityCountry ja countryShapes
 * @param {Array}    asetukset.kaupungit  board.cities — nimet ja sijainnit
 * @param {Element}  asetukset.juuri      mihin soitin liitetään (esim. document.body)
 * @param {Function} [asetukset.onMuutos] kutsutaan kun soiva kanava vaihtuu
 * @param {Function} [asetukset.onSulje]  soittimen virtakytkin käännettiin
 *                                        off-asentoon. Kutsuja sammuttaa
 *                                        linssin; ilman tätä tila puretaan
 *                                        tästä (pois()), jolloin kartta
 *                                        palaa normaaliksi mutta
 *                                        linssivalikko jää auki.
 * @param {string}   [asetukset.sijainti] pelaajan kaupungin tunnus; soittimen
 *                                        asteikko keskittyy siihen ennen kuin
 *                                        mitään on soitettu
 * @param {number}   [asetukset.aani]     aloitusäänenvoimakkuus 0–1
 * @returns {object} tilannekuva
 */
export function paalle({
  map = null,
  kaupungit = [],
  juuri = null,
  onMuutos = null,
  onSulje = null,
  sijainti = null,
  aani: alkuAani = null,
} = {}) {
  // Uudelleenkytkentä (laudan vaihto, kartan uudelleenpiirto) purkaa
  // ensin vanhan: kaksi soitinta sivulla olisi kaksi stop-nappia, joista
  // vain toinen toimisi.
  if (tila) pois();

  /*
   * Number.isFinite eikä `!== null`. Kutsuja lukee arvon omasta
   * muististaan, ja tyhjä muisti on yhtä hyvin undefined kuin null —
   * `Number(undefined) || 0` olisi nolla, eli radio avautuisi mykkänä
   * juuri niille pelaajille, jotka eivät ole koskaan koskeneet nuppiin.
   */
  if (Number.isFinite(alkuAani)) aanenvoimakkuus = Math.min(1, Math.max(0, alkuAani));

  const nimet = new Map();
  for (const kaupunki of kaupungit) {
    if (kaupunki?.id) nimet.set(kaupunki.id, kaupunki.name ?? null);
  }

  const kanavalliset = kanavakaupungit(map, kaupungit);
  // Yksi kaupunki per maa, ks. radionKaupungit. Sama joukko ohjaa sekä
  // kartan nappeja että asteikkoa: kartalla ja nauhalla on oltava samat
  // kaupungit, tai nauhalta valittua ei löydy kartalta.
  const naytettavat = radionKaupungit(map, kaupungit, { sijainti });
  /*
   * Soittimen asteikon aineisto: vain ne kaupungit, joilla on kanava ja
   * jotka radiotilassa ylipäänsä näkyvät. Suodatus tehdään täällä eikä
   * laitteessa, koska kanavan olemassaolo on tämän moduulin tietoa
   * (radioMaalle) — soitin ei tunne maita eikä lähetysosoitteita, ja
   * juuri se kolmijako pitää laitteen vaihdettavana (ks. tiedoston alku).
   *
   * `kaikkiPaikat` sen sijaan on koko lauta. Se on vain koordinaattilista
   * sitä varten, että soitin löytää pelaajan sijaintia lähimmän
   * kanavakaupungin (radiosoitin.js laskeKeskus), eikä siihen tarvita
   * eikä saa tehdä samaa karsintaa: kadonnut sijainti veisi asteikon
   * keskuksen laudan painopisteeseen.
   *
   * `laudanLeveys` kerrotaan vain kiertävältä laudalta. Maailmankartalla
   * Tokion naapuri voi olla laudan toisessa laidassa, ja ilman tätä
   * asteikko loppuisi reunaan kesken.
   */
  const asteikonKaupungit = [];
  const kaikkiPaikat = [];
  for (const kaupunki of kaupungit) {
    if (!kaupunki?.id) continue;
    kaikkiPaikat.push({ id: kaupunki.id, x: kaupunki.x, y: kaupunki.y });
    if (!kanavalliset.has(kaupunki.id) || !naytettavat.has(kaupunki.id)) continue;
    asteikonKaupungit.push({
      id: kaupunki.id,
      nimi: kaupunki.name ?? kaupunki.id,
      x: kaupunki.x,
      y: kaupunki.y,
    });
  }

  const naytto = teePistenaytto({
    merkkeja: NAYTON_MERKIT,
    rivit: NAYTON_RIVIT,
    // Lasi on kuoressa, ks. NAYTON_MUSTE yllä.
    tausta: null,
    kehys: null,
    palava: NAYTON_MUSTE,
    sammunut: NAYTON_MUSTE,
  });
  const soitin = teeRadiosoitin({
    aani: aanenvoimakkuus,
    kaupungit: asteikonKaupungit,
    kaikkiKaupungit: kaikkiPaikat,
    laudanLeveys: map?.kiertava === true ? (map?.width ?? 0) : 0,
    sijainti,
    onStop: () => pysayta(),
    // Asteikon nimi ja soittokytkimen ylösvääntö ovat sama toiminto kuin
    // kaupungin napautus kartalla: yksi napautus, kanava vaihtuu heti.
    onValitseKaupunki: (id) => soitaKaupunki(id),
    /*
     * Virtakytkin off-asennossa. Laite on jo piilottanut itsensä; tämän
     * tehtävä on sulkea äänet ja kartan radiotila. Kutsujan oma
     * takaisinkutsu saa etusijan, koska vain se osaa sammuttaa myös
     * linssin — ilman sitä puretaan ainakin tämä tila, jottei
     * näkymättömän soittimen alla jää soimaan kanavaa.
     */
    onSulje: () => {
      if (onSulje) onSulje();
      else pois();
    },
    onAani: (arvo) => paivitaAanenvoimakkuus(arvo),
    /*
     * Aikakatkaisu tulee laitteelta: se on jo vaihtanut näyttönsä
     * virhetilaan, ja tämän tehtävä on sulkea virta. Rikki mennyt
     * lähetysosoite ei useinkaan anna virhettä lainkaan vaan jää auki
     * hiljaisena, ja juuri se yhteys pitää katkaista.
     */
    onAikakatkaisu: () => {
      lopetaAani();
      kerroMuutos();
    },
  });

  /*
   * Näyttö kuuntelee laitetta eikä toisin päin. Soitin kertoo jokaisesta
   * rivimuutoksesta tapahtumalla 'radio-naytto', joten pistenäyttö saa
   * tekstinsä yhdestä paikasta riippumatta siitä, kuka tilan vaihtoi:
   * kaupungin napautus, stop-nappi vai aikakatkaisu.
   */
  soitin.naytonAukko.addEventListener('radio-naytto', (tapahtuma) => {
    naytto.naytaTeksti(tapahtuma.detail?.rivit ?? ['', '']);
  });
  // asetaNaytto kirjoittaa nykyisen sisällön heti, joten kuuntelija on
  // liitettävä ennen sitä — muuten näyttö olisi tyhjä siihen asti,
  // kunnes ensimmäinen tila sattuu vaihtumaan.
  soitin.asetaNaytto(naytto.juuri);

  tila = {
    map,
    nimet,
    soitin,
    naytto,
    onMuutos,
    kanavalliset,
    naytettavat,
  };

  (juuri ?? document.body)?.appendChild(soitin.juuri);

  /*
   * MITTARIN LÄHDE ASETETAAN TÄSSÄ, KERRAN, EIKÄ SEN JÄLKEEN KOSKAAN.
   * Ks. pysyvaLukija: yksi asteikko koko radiotilan ajan, ei kohinan
   * mittausta, ei vaihtokohtia jotka voivat jäädä väliin.
   */
  asetaMittarinLahde(pysyvaLukija());

  /*
   * VU-DIAGNOOSI SORMELLA. Omistajan raportti 5.8.2026: "kaikki asemat
   * näyttää feikki-VU:ta" iPadilla — eikä iPadia voi tutkia etänä.
   * Pitkä painallus mittariin näyttää näytöllä neljä sekuntia, MITTAAKO
   * neula oikeasti vai jäljitteleekö ja miksi, sekä mitatun polun
   * raakalukeman desibeleinä: asteikkovirhe (lukema elää mutta jää
   * asteikon alle) erottuu näin hiljaisuudesta (lukemaa ei tule
   * lainkaan). Tämä on laite pelaajan kädessä, joten diagnoosi puhuu
   * pistenäytön kieltä eikä konsolin.
   */
  const mittariAlue = soitin.juuri.querySelector('.radio-mittari');
  if (mittariAlue) {
    let painallus = 0;
    const naytaDiagnoosi = () => {
      const virta = soiva;
      let asema = 'VU: EI VIRTAA';
      let kaupunki = '';
      let maa = '';
      if (virta) {
        const arvo = virta.mittarinLukija ? virta.mittarinLukija() : null;
        const db = arvo === null ? null
          : Math.round(arvo * (LAHETYKSEN_KATTO_DB - LAHETYKSEN_POHJA_DB) + LAHETYKSEN_POHJA_DB);
        maa = virta.varalla ? 'EI CORSIA' : (virta.mittari ? 'CORS OK' : 'EI KETJUA');
        if (virta.jaljitelmaan) {
          asema = virta.varamittaus ? 'VU: JALJ + NOUTO' : 'VU: JALJITELTY';
          kaupunki = db === null ? 'EI LUKEMAA' : `MITTAUS ${db} DB`;
        } else if (virta.mittarinLukija) {
          const tapa = virta.mittaustapa === 'nouto' ? 'NOUDETTU' : 'MITATTU';
          asema = `VU: ${tapa} ${db} DB`;
          kaupunki = `VOL ${Math.round((Number(virta.audio?.volume) || 0) * 100)}`;
        } else {
          asema = 'VU: EI LAHDETTA';
        }
      }
      tila?.soitin.naytaKanava({ asema, kaupunki, maa });
      const id = setTimeout(() => {
        if (tila) tila.soitin.naytaKanava(soiva?.kanava ?? null);
      }, 4000);
      soiva?.ajastimet?.add(id);
    };
    mittariAlue.addEventListener('pointerdown', () => {
      clearTimeout(painallus);
      painallus = setTimeout(naytaDiagnoosi, 600);
    });
    for (const tapahtuma of ['pointerup', 'pointercancel', 'pointerleave']) {
      mittariAlue.addEventListener(tapahtuma, () => clearTimeout(painallus));
    }
  }

  // Kaupungin ääni väistyy kokonaan, ei väisty vaimentamalla: radiotilassa
  // radio on ainoa ääni.
  stopPlaceStream();
  sfx.setAmbience(null);

  /*
   * Viritysäänet valmiiksi selaimen välimuistiin heti tilan avautuessa.
   * Ne ovat pieniä (284 kt yhteensä) ja tavallisesti jo offline-korissa,
   * mutta ensimmäisellä käynnillä lataus osuisi juuri siihen hetkeen,
   * jona pelaaja napauttaa kaupunkia — eli siihen taukoon, jonka
   * poistamisesta koko viritysäänessä on kyse. Synteesitavalla tämä ei
   * tee mitään.
   */
  esilataaViritysaanet(sfx.ctx);

  kerroMuutos();
  return tilanne();
}

/*
 * SIVUN SULKEMINEN JA TAUSTALLE SIIRTYMINEN.
 *
 * `pagehide` kattaa molemmat: sivulta poistumisen ja bfcacheen jäämisen.
 * Jälkimmäisessä JavaScript jäädytetään mutta äänet voivat jäädä
 * soimaan, ja palaava pelaaja löytäisi radion, joka on tilansa mukaan
 * virittämässä asemaa jota ei enää haeta. pysayta() jättää radiotilan
 * päälle mutta sammuttaa sekä lähetyksen että virityksen, joten paluu
 * osuu ehjään laitteeseen: "RADIO POIS · VALITSE KAUPUNKI".
 *
 * Kuuntelija liitetään kerran moduulin latautuessa eikä radiotilan
 * avautuessa, koska irrottamiselle ei ole paikkaa, jonka varmasti
 * ajetaan — ja tila === null tekee siitä muulloin tyhjän kutsun.
 */
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('pagehide', () => {
    if (tila) pysayta();
  });
}

/**
 * SAMMUTTAA RADIOTILAN.
 *
 * Kesken soiton sulkeminen sulkee myös äänen — tämä on omistajan
 * odottama käytös, eikä siitä ole toista tulkintaa: tilasta poistunut
 * radio, joka jää soimaan taustalle, on pelaajan kannalta rikki.
 *
 * Kaupungin omaa äänimaisemaa EI palauteta täältä. Se on js/ui.js:n
 * tieto (mikä kaupunki, mikä maisematyyppi), ja kutsuja palauttaa sen
 * omalla tahdistuksellaan heti tämän jälkeen — ks. rajapinnan kuvaus
 * tiedoston alussa.
 */
export function pois() {
  if (!tila) return tilanne();
  lopetaAani();
  // Puretut viritysäänet pois muistista: ne ovat noin 8 Mt eikä niitä
  // tarvita ennen kuin radiotila avataan uudelleen. Tiedostot jäävät
  // selaimen välimuistiin, joten paluu ei maksa uutta latausta.
  unohdaViritysaanet(sfx.ctx);
  // Laite takaisin omaan oletuslähteeseensä: radiotilan ulkopuolella
  // mittarilla ei ole lähetystä luettavanaan.
  asetaMittarinLahde(null);
  const vanha = tila;
  tila = null;
  try {
    vanha.naytto.pysayta();
    vanha.soitin.poista();
  } catch (syy) {
    console.warn('Radiosoittimen purku epäonnistui.', syy);
  }
  try {
    vanha.onMuutos?.(tilanne());
  } catch (syy) {
    console.warn('Radiotilan muutoksen välitys epäonnistui.', syy);
  }
  return tilanne();
}

/**
 * PIIRTÄÄ KAUPUNGIT PLAY-NAPEIKSI annettuun SVG-ryhmään.
 *
 * Napit piirretään täällä eikä js/ui.js:ssä kahdesta syystä. Ensinnäkin
 * sammuneen ja soivan kaupungin ero on radion tietoa, ei kartan.
 * Toiseksi css/styles.css on toisen työvaiheen hallussa: tälle tilalle ei
 * ole siellä luokkia, joten jokainen väri ja viivanleveys annetaan
 * SVG-attribuuttina — sama sääntö kuin linssikerroksella
 * (docs/linssit-suunnitelma.md luku 2.2).
 *
 * Kolme ulkoasua, jotta yhdellä silmäyksellä näkee mitä voi painaa:
 *
 *   soiva kaupunki   paksu rengas, täysi kolmio, ulkokehä
 *   asema olemassa   ohut rengas, kolmio
 *   ei asemaa        katkoviivarengas, ei kolmiota, himmeä
 *
 * JOKAISESTA MAASTA PIIRRETÄÄN VAIN YKSI KAUPUNKI (ks. radionKaupungit).
 * Karsinta on tässä eikä kutsujassa, koska joukko on radiotilan tietoa
 * ja koska kartan ja asteikon on näytettävä samat kaupungit.
 *
 * Napit eivät ole näppäimistöfokusoitavia. 248 kaupunkia kiertokopioineen
 * olisi lähes viisisataa sarkainpysähdystä, eikä kartan muillakaan
 * kohteilla ole niitä (js/ui.js drawTargets). Jokaisella napilla on
 * <title>, joten ruudunlukija kertoo aseman osoittaessa.
 *
 * @param {Element}  ryhma          SVG-ryhmä (esim. ui:n targetLayer)
 * @param {Array}    kaupungit      board.cities
 * @param {Function} [kiertoKohdat] x → x-koordinaatit; kiertävällä laudalla
 *                                  kaksi, muuten yksi (js/ui.js kiertoKohdat)
 * @returns {number} piirrettyjen nappien määrä
 */
export function piirraKaupunkinapit(ryhma, kaupungit = [], { kiertoKohdat = null } = {}) {
  if (!ryhma || !tila) return 0;
  const kohdat = kiertoKohdat ?? ((x) => [x]);
  let piirretty = 0;

  for (const kaupunki of kaupungit) {
    if (!kaupunki?.id) continue;
    if (!tila.naytettavat.has(kaupunki.id)) continue;
    const onKanava = tila.kanavalliset.has(kaupunki.id);
    const soiTama = soiva?.cityId === kaupunki.id;

    for (const x of kohdat(kaupunki.x)) {
      const nappi = el('g', {}, ryhma);
      nappi.setAttribute('role', 'button');
      const kanava = onKanava ? kanavaKaupungille(kaupunki.id) : null;
      el('title', {}, nappi).textContent = kanava
        ? `${kaupunki.name ?? ''} — ${kanava.asema}`
        : `${kaupunki.name ?? ''} — ei asemaa`;

      /*
       * Näkymätön osuma-ala ennen renkaita. pointer-events="all" ottaa
       * napautuksen vastaan täyttöväristä riippumatta, joten alaa ei
       * tarvitse värittää eikä se peitä karttaa.
       */
      el('circle', {
        cx: x,
        cy: kaupunki.y,
        r: NAPIN_OSUMA,
        fill: PAPERI,
        'fill-opacity': 0,
        'pointer-events': 'all',
      }, nappi);

      if (soiTama) {
        /*
         * Punainen hehku ALLE renkaiden: leveä, hyvin läpikuultava
         * ympyrä, joka värjää paperin kaupungin ympäriltä. Se löytyy
         * silmällä kauempaakin kuin viiva, eikä peitä kartan piirtoa.
         */
        el('circle', {
          cx: x,
          cy: kaupunki.y,
          r: NAPIN_RENGAS + 13,
          fill: PUNAINEN,
          opacity: 0.16,
          'pointer-events': 'none',
        }, nappi);
      }

      el('circle', {
        cx: x,
        cy: kaupunki.y,
        r: NAPIN_RENGAS,
        fill: 'none',
        stroke: soiTama ? PUNAINEN : MUSTE,
        'stroke-width': soiTama ? 3.2 : 1.6,
        opacity: onKanava ? 0.85 : 0.34,
        ...(onKanava ? {} : { 'stroke-dasharray': '3 5' }),
      }, nappi);

      if (soiTama) {
        // Ulkokehä kertoo soivan kaupungin myös loitonnetusta kartasta,
        // jossa kolmio on jo liian pieni erottuakseen.
        el('circle', {
          cx: x,
          cy: kaupunki.y,
          r: NAPIN_RENGAS + 7,
          fill: 'none',
          stroke: PUNAINEN,
          'stroke-width': 1.6,
          opacity: 0.62,
        }, nappi);
      }

      if (onKanava) {
        // Kolmio on optisesti keskitetty: sen massa on vasemmalla, joten
        // kärki saa mennä keskilinjan yli.
        const k = 7.5;
        el('path', {
          d: `M ${x - k * 0.55} ${kaupunki.y - k} L ${x + k} ${kaupunki.y} `
            + `L ${x - k * 0.55} ${kaupunki.y + k} Z`,
          fill: soiTama ? PUNAINEN : MUSTE,
          opacity: soiTama ? 1 : 0.72,
        }, nappi);
      }

      nappi.addEventListener('click', (tapahtuma) => {
        // Kartan oma napautuskuuntelija kutistaisi päiväkirjan saman
        // painalluksen aikana; nappi on nappi eikä kartan napautus.
        tapahtuma.stopPropagation();
        soitaKaupunki(kaupunki.id);
      });
      piirretty += 1;
    }
  }
  return piirretty;
}

/*
 * LINSSISOPIMUKSEN OSUUS.
 *
 * `kerros: false` — radio ei piirrä karttakerrosta, joten `piirra`
 * puuttuu tarkoituksella (js/linssit/kerros.js tarkistaa juuri tämän
 * ehdon). Moottori ei myöskään kutsu `lataa`:a kerroksettomalle
 * linssille; aineisto on siksi staattisessa tuonnissa, ks. tiedoston
 * alku.
 *
 * `laudat` — radio tarvitsee kaupunki→maa-kytkennän (map.cityCountry).
 * Se on kolmella laudalla: maailmankartta, europe ja africa. Muilla
 * laudoilla jokainen kaupunki olisi sammunut nappi, mikä on huonompi
 * kuin linssin puuttuminen kokonaan.
 */
export const LINSSI = {
  tunnus: 'radio',
  jarjestys: 60,
  kerros: false,

  nimi: 'Maailmanradio',
  lyhyt: 'Kaupungit ovat play-nappeja: kuulet mitä siellä lähetetään juuri nyt.',
  // Putkiradio: kotelo, viritysasteikko, säädin ja antenni.
  ikoni: '<rect x="2.6" y="9" width="18.8" height="11.4" rx="2"/>'
    + '<path d="M7.5 4.3 15.6 9"/>'
    + '<circle cx="16.6" cy="14.7" r="2.6"/>'
    + '<path d="M5.8 12.6h5.4M5.8 16.4h5.4"/>',
  valokuva: false,

  laudat: ['maailmankartta', 'europe', 'africa'],

  lahde: {
    aineisto: 'Radio Browser: yhteisön ylläpitämä hakemisto suorista radiolähetyksistä',
    lisenssi: 'CC0 1.0',
    osoite: 'https://www.radio-browser.info/',
    haettu: '2026-08-03',
  },

  /*
   * Moottori kutsuu tätä, kun pelaaja vaihtaa toiseen linssiin tai
   * sammuttaa linssit. Silloin radiotilasta poistutaan kokonaan — myös
   * kesken soiton, ks. pois().
   */
  vapauta() {
    pois();
  },
};
