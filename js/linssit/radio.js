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
import { teePistenaytto } from './pistenaytto.js';
import { sfx } from '../sound.js';
import { stopPlaceStream } from '../ambience-stream.js';

/*
 * NÄYTÖN MITAT.
 *
 * Soittimen aukko on kuvasuhteeltaan 5 : 1 (radiosoitin.js NAYTON_SUHDE).
 * Pistenäytön ruudukko on merkkiluku × (5 + 1) − 1 saraketta ja
 * rivimäärä × (7 + 1) − 1 riviä, ja SVG:n mitat ovat (sarakkeita − 1) ×
 * 10 + 18 sekä (rivejä − 1) × 10 + 18. Kahdella tekstirivillä korkeus on
 * siis kiinteä 158, ja kolmentoista merkin leveys 778 — suhde 4,92, eli
 * niin lähellä viittä kuin kokonaisilla merkeillä pääsee. Neljätoista
 * merkkiä antaisi 5,30 ja jättäisi aukon ylä- ja alalaitaan raidan.
 *
 * Kaksi riviä eikä yksi, koska kanavassa on kaksi eri asiaa: asema ja
 * paikka. Yhdellä rivillä ne pitäisi ketjuttaa, ja silloin lyhytkin
 * asemannimi alkaisi vieriä.
 */
const NAYTON_MERKIT = 13;
const NAYTON_RIVIT = 2;

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
 * Moduulin koko muisti kahdessa muuttujassa.
 *
 * `tila` on olemassa vain radiotilan ajan: se sisältää laitteen, näytön
 * ja sen mitä kartasta tarvitaan. `soiva` on kerrallaan enintään yksi —
 * kaksi yhtä aikaa auki olevaa lähetysvirtaa on juuri se sekasotku, jota
 * omistaja ei halunnut, ja se olisi myös kaksi verkkoyhteyttä
 * puhelinliittymästä.
 */
let tila = null;
let soiva = null;
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
 */
export function kanavaKaupungille(cityId) {
  const { iso, maa, kaupunki } = paikkatiedot(cityId);
  const kanava = radioMaalle(iso);
  if (!kanava) return null;
  return {
    iso,
    maa,
    kaupunki,
    url: kanava.url,
    asema: kanava.asema,
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
 * Sulkee soivan virran ja vapauttaa yhteyden.
 *
 * `pause()` EI RIITÄ suoralle lähetykselle. Pysäytetty <audio> pitää
 * yhteyden auki ja jatkaa puskurointia: selain lataa taustalla lähetystä,
 * jota kukaan ei kuuntele. Siksi lähde irrotetaan ja `load()` kutsutaan
 * — se katkaisee kesken olevan haun. Sama kaksivaiheinen sulkeminen on
 * kaupungin äänimaisemassa (js/ambience-stream.js paasta), mutta ilman
 * `load()`-kutsua, koska äänite on äärellinen tiedosto eikä loputon virta.
 */
function lopetaAani() {
  const vanha = soiva;
  soiva = null;
  if (!vanha) return;
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
 * Ei omaa häivytystä. js/ambience-stream.js:n `haivyta` ei ole vietynä,
 * eikä sen rinnalle kirjoiteta toista — ja tähän se ei sovi muutenkaan:
 * laite on mekaaninen radio, ja mekaaninen radio napsahtaa. Napsahdus on
 * tässä oikea ääni, ei puute.
 *
 * Kaikki kuuntelijat tarkistavat ensin, että virta on yhä sama. Ilman
 * sitä hitaasti avautuvan aseman virhe sammuttaisi jo seuraavaksi
 * valitun kaupungin kanavan — sama vanhentuneen vuoron ongelma kuin
 * linssimoottorissa (js/linssit/kerros.js, kenttä `vuoro`).
 */
function aloitaVirta(cityId, kanava) {
  lopetaAani();

  /*
   * Peiliä ei käytetä. js/media.js aaniOsoite palauttaisi lähetysosoitteen
   * sellaisenaan (peilissä on vain Freesound ja archive.org), ja suoraa
   * lähetystä ei voi peilata: sitä ei ole tiedostona missään. Sama koskee
   * crossOriginia — moni asema ei lähetä CORS-otsakkeita, ja sen
   * pyytäminen veisi äänen kokonaan.
   */
  const audio = new Audio();
  audio.preload = 'none';
  audio.volume = aanenvoimakkuus;
  audio.src = kanava.url;

  const oma = { cityId, kanava, audio };
  soiva = oma;

  const yhaSama = () => soiva === oma;

  audio.addEventListener('playing', () => {
    if (!yhaSama()) return;
    tila?.soitin.asetaTila('soi');
    kerroMuutos();
  });
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
  tila.soitin.asetaTila('virittaa');

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

/** Äänenvoimakkuus 0–1. Muistetaan istunnon ajan myös kanavan vaihdon yli. */
export function asetaAani(arvo) {
  aanenvoimakkuus = Math.min(1, Math.max(0, Number(arvo) || 0));
  if (soiva) soiva.audio.volume = aanenvoimakkuus;
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
 * @param {number}   [asetukset.aani]     aloitusäänenvoimakkuus 0–1
 * @returns {object} tilannekuva
 */
export function paalle({
  map = null,
  kaupungit = [],
  juuri = null,
  onMuutos = null,
  aani: alkuAani = null,
} = {}) {
  // Uudelleenkytkentä (laudan vaihto, kartan uudelleenpiirto) purkaa
  // ensin vanhan: kaksi soitinta sivulla olisi kaksi stop-nappia, joista
  // vain toinen toimisi.
  if (tila) pois();

  if (alkuAani !== null) aanenvoimakkuus = Math.min(1, Math.max(0, Number(alkuAani) || 0));

  const nimet = new Map();
  for (const kaupunki of kaupungit) {
    if (kaupunki?.id) nimet.set(kaupunki.id, kaupunki.name ?? null);
  }

  const naytto = teePistenaytto({ merkkeja: NAYTON_MERKIT, rivit: NAYTON_RIVIT });
  const soitin = teeRadiosoitin({
    aani: aanenvoimakkuus,
    onStop: () => pysayta(),
    onAani: (arvo) => {
      aanenvoimakkuus = arvo;
      if (soiva) soiva.audio.volume = arvo;
    },
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
    kanavalliset: kanavakaupungit(map, kaupungit),
  };

  (juuri ?? document.body)?.appendChild(soitin.juuri);

  // Kaupungin ääni väistyy kokonaan, ei väisty vaimentamalla: radiotilassa
  // radio on ainoa ääni.
  stopPlaceStream();
  sfx.setAmbience(null);

  kerroMuutos();
  return tilanne();
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
