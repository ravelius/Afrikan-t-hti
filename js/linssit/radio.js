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
import { teeRadiosoitin } from './radiosoitin.js';
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
const NAYTON_MUSTE = '#1f2a16';

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
 * RISTIHÄIVYTYS VIRITYKSESTÄ SUORAAN LÄHETYKSEEN.
 *
 * Viritys ei saa katketa napsahtaen. Sama vika on korjattu tässä pelissä
 * jo kahdesti — kertojan äänestä (v176) ja luennoista (v215) — ja tässä
 * se olisi vielä räikeämpi: kohina on jatkuvaa ääntä, ja jatkuvan äänen
 * katkaisu kuuluu aina.
 *
 * Kuusi kymmenystä sekuntia on mitattu kompromissi. Lyhyempi (0,3 s) on
 * kuultavissa leikkauksena, pidempi (1 s) jättää lähetyksen ensimmäisen
 * lauseen kohinan alle — ja lähetyksen alku on juuri se, mitä pelaaja
 * odottaa.
 *
 * Vaihto on TASATEHOINEN: viritys laskee kosinia (js/linssit/viritin.js
 * haivytaPois) ja lähetys nousee siniä. Kaksi riippumatonta ääntä
 * summautuu teholtaan, joten lineaarinen pari jättäisi keskelle 3 dB:n
 * notkahduksen — reiän juuri siihen kohtaan, jota vaihdolla piti peittää.
 *
 * Lähetys on <audio>-elementti eikä kulje Web Audion läpi (ks.
 * aloitaVirta: crossOrigin veisi äänen kokonaan monelta asemalta), joten
 * sen puoli häivytyksestä tehdään elementin volume-arvoa askeltamalla.
 * 25 ms:n askel on 24 askelta koko vaihdossa; harvempi kuuluu portaina.
 */
const RISTIHAIVYTYS_S = 0.6;
const HAIVYTYKSEN_ASKEL_MS = 25;

/*
 * Kuinka usein tarkistetaan, sammuttiko pelaaja pelin äänet kesken
 * virityksen.
 *
 * js/sound.js ei kerro mykistyksestä kenellekään eikä sitä voi muuttaa
 * täältä (tiedosto on toisen työvaiheen hallussa), joten tieto on
 * kysyttävä. Vahti elää vain virityksen ajan eli enintään 12 sekuntia,
 * ja neljä kertaa sekunnissa on riittävän nopea: mykistys tuntuu
 * välittömältä, kun ääni katoaa neljännessekunnissa.
 */
const MYKISTYKSEN_VAHTI_MS = 250;

/*
 * Moduulin koko muisti neljässä muuttujassa.
 *
 * `tila` on olemassa vain radiotilan ajan: se sisältää laitteen, näytön
 * ja sen mitä kartasta tarvitaan. `soiva` on kerrallaan enintään yksi —
 * kaksi yhtä aikaa auki olevaa lähetysvirtaa on juuri se sekasotku, jota
 * omistaja ei halunnut, ja se olisi myös kaksi verkkoyhteyttä
 * puhelinliittymästä. `viritin` on niiden väliin jäävä kohina, ja sitäkin
 * on kerrallaan enintään yksi.
 */
let tila = null;
let soiva = null;
let viritin = null;
let mykistysVahti = 0;
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
 * ETUKÄTEEN TIEDETTÄVÄ ASIA. Kanava on 87 maalla ja kaupunkeja on 248,
 * joten sammuneita nappeja on enemmän kuin soivia. Jos ne näyttäisivät
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
 *
 * Äänikonteksti pyydetään vasta tässä, napautuksen sisällä. Selain
 * vaatii eleen, ja tämä on se ele.
 */
function aloitaViritys() {
  if (viritin) return;
  const ctx = sfx.ensureContext();
  // ensureContext palauttaa null, jos pelin äänet ovat pois päältä.
  // Silloin viritystäkään ei tule — se on pelin ääni, ei radion.
  if (!ctx) return;
  try {
    const uusi = teeViritysaani(ctx, { voimakkuus: aanenvoimakkuus });
    if (!uusi.aloita()) return;
    viritin = uusi;
  } catch (syy) {
    // Viritysääni on koriste. Jos se ei jostain syystä käynnisty, radio
    // toimii ilman sitä täsmälleen kuten ennen.
    console.warn('Viritysäänen käynnistys epäonnistui.', syy);
    viritin = null;
    return;
  }
  mykistysVahti = setInterval(() => {
    if (sfx.enabled === false) lopetaViritys(0.15);
  }, MYKISTYKSEN_VAHTI_MS);
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
  if (mykistysVahti) {
    clearInterval(mykistysVahti);
    mykistysVahti = 0;
  }
  const vanha = viritin;
  viritin = null;
  if (!vanha) return;
  try {
    vanha.lopeta(haive);
  } catch (syy) {
    console.warn('Viritysäänen pysäytys epäonnistui.', syy);
  }
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
  const kello = () => (typeof performance === 'object' && performance
    ? performance.now() : Date.now());
  const alku = kello();
  const askel = () => {
    if (soiva !== virta) {
      clearInterval(virta.haivytys);
      virta.haivytys = 0;
      return;
    }
    const osuus = Math.min(1, (kello() - alku) / (RISTIHAIVYTYS_S * 1000));
    try {
      // Sini vastaa virityksen kosinia: cos² + sin² = 1 eli yhteisteho
      // pysyy vakiona koko vaihdon ajan.
      virta.audio.volume = aanenvoimakkuus * Math.sin(osuus * (Math.PI / 2));
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

/**
 * Sulkee soivan virran ja vapauttaa yhteyden.
 *
 * `pause()` EI RIITÄ suoralle lähetykselle. Pysäytetty <audio> pitää
 * yhteyden auki ja jatkaa puskurointia: selain lataa taustalla lähetystä,
 * jota kukaan ei kuuntele. Siksi lähde irrotetaan ja `load()` kutsutaan
 * — se katkaisee kesken olevan haun. Sama kaksivaiheinen sulkeminen on
 * kaupungin äänimaisemassa (js/ambience-stream.js paasta), mutta ilman
 * `load()`-kutsua, koska äänite on äärellinen tiedosto eikä loputon virta.
 *
 * Pysäyttää myös viritysäänen — paitsi kun kutsuja on juuri
 * käynnistämässä uutta kanavaa (`viritysJatkuu`), jolloin kohina jatkuu
 * yhtäjaksoisena kaupungista toiseen.
 */
function lopetaAani({ viritysJatkuu = false } = {}) {
  if (!viritysJatkuu) lopetaViritys(0.25);
  const vanha = soiva;
  soiva = null;
  if (!vanha) return;
  if (vanha.haivytys) {
    clearInterval(vanha.haivytys);
    vanha.haivytys = 0;
  }
  const { audio } = vanha;
  try {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
  } catch (syy) {
    console.warn('Radiovirran sulkeminen epäonnistui.', syy);
  }
}

/**
 * Käynnistää kanavan virran.
 *
 * LÄHETYS TULEE SISÄÄN RISTIHÄIVYTYKSELLÄ VIRITYSÄÄNESTÄ, ks.
 * RISTIHAIVYTYS_S. Aiemmin tässä luki, että mekaaninen radio napsahtaa ja
 * että napsahdus on oikea ääni — se piti paikkansa niin kauan kuin
 * napsahdusta edelsi hiljaisuus. Nyt sitä edeltää kohina, ja kohinan
 * katkeaminen kesken sanaa ei ole minkään laitteen ääni.
 *
 * Elementti aloittaa VAIMENNETTUNA (volume 0) ja nousee vasta kun
 * lähetys oikeasti kuuluu. Ilman sitä puskurin ensimmäiset kymmenykset
 * pauhaisivat täydellä voimalla kohinan päälle.
 *
 * Kaikki kuuntelijat tarkistavat ensin, että virta on yhä sama. Ilman
 * sitä hitaasti avautuvan aseman virhe sammuttaisi jo seuraavaksi
 * valitun kaupungin kanavan — sama vanhentuneen vuoron ongelma kuin
 * linssimoottorissa (js/linssit/kerros.js, kenttä `vuoro`).
 */
function aloitaVirta(cityId, kanava) {
  // Viritys jatkuu vanhan kanavan yli: pelaaja on vaihtamassa asemaa,
  // ei sammuttamassa radiota.
  lopetaAani({ viritysJatkuu: true });

  /*
   * Peiliä ei käytetä. js/media.js aaniOsoite palauttaisi lähetysosoitteen
   * sellaisenaan (peilissä on vain Freesound ja archive.org), ja suoraa
   * lähetystä ei voi peilata: sitä ei ole tiedostona missään. Sama koskee
   * crossOriginia — moni asema ei lähetä CORS-otsakkeita, ja sen
   * pyytäminen veisi äänen kokonaan.
   */
  const audio = new Audio();
  audio.preload = 'none';
  audio.volume = 0;
  audio.src = kanava.url;

  const oma = { cityId, kanava, audio, haivytys: 0, alkanut: false };
  soiva = oma;

  const yhaSama = () => soiva === oma;

  /*
   * LÄHETYS ALKOI KUULUA. Tästä alkaa ristihäivytys: viritys laskee ja
   * lähetys nousee saman 0,6 sekunnin aikana.
   *
   * Kaksi tapahtumaa samaan asiaan, koska kumpikin yksinään pettää.
   * `playing` on oikea tapahtuma, mutta osa suoratoistoista ei lähetä
   * sitä lainkaan — silloin lähetys jäisi ikuisesti vaimennetuksi, mikä
   * on pahempi vika kuin se, jonka korjaamiseksi vaimennus on. Siksi
   * rinnalla on `timeupdate`, joka syntyy vasta kun toisto oikeasti
   * etenee. Ensimmäinen voittaa, loput ovat maksuttomia.
   */
  const lahetysAlkoi = () => {
    if (!yhaSama() || oma.alkanut) return;
    oma.alkanut = true;
    tila?.soitin.asetaTila('soi');
    haivytaLahetysSisaan(oma);
    lopetaViritys(RISTIHAIVYTYS_S);
    kerroMuutos();
  };
  audio.addEventListener('playing', lahetysAlkoi);
  audio.addEventListener('timeupdate', lahetysAlkoi);
  /*
   * Suoralla lähetyksellä `ended` tarkoittaa katkennutta yhteyttä, ei
   * loppunutta kappaletta: virrassa ei ole loppua. Se on siis virhe
   * siinä missä `error`kin.
   */
  const petti = (syy) => {
    if (!yhaSama()) return;
    lopetaAani();
    tila?.soitin.asetaTila('virhe', syy);
    kerroMuutos();
  };
  audio.addEventListener('error', () => petti('Asema ei vastaa'));
  audio.addEventListener('ended', () => petti('Lähetys katkesi'));

  tila.soitin.naytaKanava(kanava);
  // Tilanvaihdos ensin, ääni perässä: soittimen 'virittaa' käynnistää myös
  // aikakatkaisun (radiosoitin.js VIRITYKSEN_AIKAKATKAISU_MS), joka on se
  // vahti, jonka varassa viritysääni ei jää soimaan ikuisesti kuolleelle
  // asemalle — aikakatkaisu kutsuu onAikakatkaisu → lopetaAani → viritys
  // vaikenee.
  tila.soitin.asetaTila('virittaa');
  aloitaViritys();

  audio.play().catch((syy) => {
    /*
     * Selain voi estää toiston, jos napautusta ei tunnistettu eleeksi.
     * Se on eri vika kuin kuollut asema, ja pelaajan on erotettava ne:
     * estetyn toiston korjaa uusi napautus, kuolleen aseman ei mikään.
     */
    petti(syy?.name === 'NotAllowedError' ? 'Ääni estetty' : 'Asema ei vastaa');
  });
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
  if (soiva && !soiva.haivytys) soiva.audio.volume = aanenvoimakkuus;
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
  /*
   * Soittimen asteikon aineisto: vain ne kaupungit, joilla on kanava.
   * Suodatus tehdään täällä eikä laitteessa, koska kanavan olemassaolo
   * on tämän moduulin tietoa (radioMaalle) — soitin ei tunne maita
   * eikä lähetysosoitteita, ja juuri se kolmijako pitää laitteen
   * vaihdettavana (ks. tiedoston alku).
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
    if (!kanavalliset.has(kaupunki.id)) continue;
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
  };

  (juuri ?? document.body)?.appendChild(soitin.juuri);

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

      el('circle', {
        cx: x,
        cy: kaupunki.y,
        r: NAPIN_RENGAS,
        fill: 'none',
        stroke: MUSTE,
        'stroke-width': soiTama ? 3 : 1.6,
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
          stroke: MUSTE,
          'stroke-width': 1.2,
          opacity: 0.4,
        }, nappi);
      }

      if (onKanava) {
        // Kolmio on optisesti keskitetty: sen massa on vasemmalla, joten
        // kärki saa mennä keskilinjan yli.
        const k = 7.5;
        el('path', {
          d: `M ${x - k * 0.55} ${kaupunki.y - k} L ${x + k} ${kaupunki.y} `
            + `L ${x - k * 0.55} ${kaupunki.y + k} Z`,
          fill: MUSTE,
          opacity: soiTama ? 0.95 : 0.72,
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
