/*
 * Vanhan ajan radiosoitin ruudun alalaitaan.
 *
 * Maailmanradio-tilassa kartan kaupungit ovat play-nappeja: painallus
 * käynnistää sen maan kanavan. Tämä tiedosto on se laite, jonka pelaaja
 * näkee alalaidassa — puinen 1930-luvun putkiradio, jossa on
 * kaiutinsäleikkö, naapurikaupunkien asteikko, kaksi metallikytkintä,
 * äänenvoimakkuuden nuppi, merkkilamppu ja aukko pistematriisinäytölle.
 *
 * TÄMÄ MODUULI EI SOITA ÄÄNTÄ. Se on pelkkä laite: se näyttää tilan ja
 * kertoo painalluksista takaisinkutsuilla. Syy on sama kuin
 * linssimoottorissa (docs/linssit-suunnitelma.md luku 2.6): äänet ovat
 * js/sound.js:n hallussa, ja kaksi paikkaa, jotka molemmat pysäyttävät
 * saman virran, päätyy ennen pitkää eri mieltä siitä kumpi soi.
 *
 * SAMASTA SYYSTÄ LAITE EI TUNNE KARTTAA. Asteikon naapurikaupungit
 * lasketaan täällä, mutta kaupunkilista koordinaatteineen tulee
 * kutsujalta (`kaupungit`) — soitin ei tiedä laudasta, kanavista eikä
 * pelaajan vuorosta mitään muuta kuin mitä sille on annettu.
 *
 * OMA TYYLITIEDOSTO. Soitin lataa css/radio.css itse (ks. lataaTyyli).
 * css/styles.css on toisen työvaiheen hallussa, eikä yhteen tiedostoon
 * kirjoita kaksi tekijää yhtä aikaa. Sivun ei siis tarvitse tietää
 * soittimesta mitään muuta kuin mihin sen juuri liitetään.
 *
 * Sallitut tuonnit ovat samat kuin linssimoduulilla: vain ../mapart.js.
 * js/ui.js:n tai js/game.js:n tuonti tekisi kiertoviittauksen. Tällä
 * hetkellä tiedosto ei tuo mitään.
 */

/*
 * Soittimen tilat. Neljä riittää, ja niiden on oltava neljä eikä
 * kolme: ilman omaa "virittaa"-tilaa suoran lähetyksen ensimmäiset
 * sekunnit näyttäisivät täsmälleen samalta kuin rikkinäinen asema.
 */
export const RADION_TILAT = Object.freeze(['sammuksissa', 'virittaa', 'soi', 'virhe']);

/*
 * Kauanko "VIRITTÄÄ..." saa kestää, ennen kuin soitin myöntää ettei
 * asemaa kuulu.
 *
 * Suora lähetys avautuu tyypillisesti 1–3 sekunnissa, mutta kaukainen
 * palvelin voi ottaa kymmenenkin. Kaksitoista sekuntia antaa hitaalle
 * asemalle mahdollisuuden ja katkaisee silti ikuisen odotuksen: rikki
 * mennyt lähetysosoite ei useinkaan anna virhettä lainkaan, vaan jää
 * auki hiljaisena — ja hiljaisuus on juuri se, mikä saa laitteen
 * näyttämään rikkinäiseltä (omistajan huomio).
 */
export const VIRITYKSEN_AIKAKATKAISU_MS = 12000;

/*
 * Näytön aukon kuvasuhde (leveys : korkeus) ja kaksi mittaa, joilla se
 * on toteutettu css/radio.css:ssä.
 *
 * SUHDE ON KUUSI EIKÄ VIISI, ja luku tulee suoraan siitä mitä näytössä
 * pitää lukea. js/linssit/pistenaytto.js piirtää merkin 5 × 7 pisteen
 * ruutuun, joten kuudentoista merkin ja kahden rivin ruudukko on
 * 958 × 158 yksikköä eli 6,06 : 1. Kuusitoista merkkiä on se raja, jolla
 * laitteen omat tekstit ("VALITSE KAUPUNKI", "HELSINKI · SUOMI",
 * "ASEMA EI VASTAA") mahtuvat kokonaan näkyviin. Kolmellatoista ne eivät
 * mahtuneet, ja silloin näyttö vieritti tekstiä TAUKOAMATTA — kartan
 * päällä ikuisesti liikkuva elementti on juuri se, mitä tämä tiedosto
 * muuten välttää (ks. css/radio.css: EI JATKUVIA ANIMAATIOITA).
 *
 * Kaksi kokoa riittää — puhelin ja muut — ja niillä on sama kuvasuhde,
 * joten sama piirto kelpaa molempiin. Aukko saa kutistua tästä vain
 * hyvin kapealla ruudulla, jolloin pistenäyttö keskittyy lasille itse
 * eikä veny (SVG:n oma preserveAspectRatio).
 */
export const NAYTON_SUHDE = 6;
export const NAYTON_MITAT = Object.freeze({
  leveä: { leveys: 408, korkeus: 68 },   // yli 700 px:n ruutu
  kapea: { leveys: 324, korkeus: 54 },   // enintään 700 px:n ruutu
});

/*
 * ASTEIKON LEVEYS PAIKKOINA.
 *
 * Omistajan toive 4.8.2026: "Pistematriisin alapuolella olevat kanavat
 * voisi korvata kuitenkin lähikaupunkien nimillä, joten radiossa voisi
 * siirtyä viereisille kanaville niitä klikkaamalla. Tällöin uusi kanava
 * aina olisi keskellä ja sen vasemmalla ja oikealla puolella olisi
 * ympäröivät kaupungit heti valittavissa."
 *
 * Aiemmin asteikolla olivat aikakauden pitkäaaltoasemat (LAHTI, MOTALA,
 * HILVERSUM...). Ne näyttivät oikeilta mutta eivät tehneet mitään, ja
 * juuri se on tässä laitteessa se ero, joka kannattaa maksaa: nimirivi,
 * jota voi painaa, on viritysasteikko — nimirivi, jota ei voi, on tarra.
 *
 * NELJÄ NAAPURIA PER PUOLI eli yhdeksän nimeä. Sama luku kuin ennenkin,
 * ja samasta syystä: asteikko on kotelossa noin 372 pikseliä leveä, ja
 * seitsemän pisteen kirjasimella siihen mahtuu yhdeksän kaupunginnimeä
 * ilman että ne koskettavat toisiaan. Kapeammalla ruudulla uloimmat
 * jäävät pois CSS:ssä (css/radio.css, data-sija) — laskenta on aina sama,
 * jotta viisari osuu keskimmäiseen riippumatta siitä, montako nimeä
 * näkyy.
 */
export const NAAPUREITA_PER_PUOLI = 4;

/** Näytön oletusrivit tiloittain. Ylärivi kertoo tilan, alarivi tarkennuksen. */
const TILAN_RIVIT = {
  sammuksissa: ['RADIO POIS', 'VALITSE KAUPUNKI'],
  virittaa: ['VIRITTÄÄ...', ''],
  soi: ['', ''],
  virhe: ['EI KUULU', ''],
};

/** Tyylilinkin tunniste, jotta linkki syntyy tasan kerran sivua kohti. */
const TYYLIN_TUNNUS = 'radiosoittimen-tyyli';

/*
 * Juokseva numero SVG-gradienttien tunnuksiin.
 *
 * Kytkimiä on kaksi ja lamppuja yksi, ja jokaisella on omat liukuvärinsä.
 * Jos tunnukset olisivat kiinteitä, toinen kytkin viittaisi ensimmäisen
 * gradienttiin — sama sivu, sama id — ja kromi katoaisi siitä, joka
 * sattuu jäämään jälkimmäiseksi. Sama koskee kahta soitinta peräkkäin
 * (laudan vaihto ehtii jättää vanhan hetkeksi DOM:iin).
 */
let tunnusLaskuri = 0;

/**
 * Liittää css/radio.css sivuun, jos sitä ei vielä ole.
 *
 * Osoite johdetaan pelin OMASTA tyylilinkistä (css/styles.css) eikä
 * kirjoiteta suhteellisena merkkijonona. Kaksi syytä:
 *
 * 1. Peli ajetaan myös GitHub Pagesin alihakemistosta, jossa pelkkä
 *    'css/radio.css' osoittaisi juureen ja jäisi lataamatta.
 * 2. Sama tehtävä hoituisi import.meta.url:lla, mutta se on
 *    KIELLETTY tässä tiedostossa: tools/build-standalone.mjs niputtaa
 *    tämän moduulin tavalliseen <script>-lohkoon, ja import.meta
 *    tavallisessa skriptissä on jäsennysvirhe — koko yhden tiedoston
 *    versio jäisi käynnistymättä, ei vain radio.
 *
 * Jos tyylilinkkiä ei löydy, tyyli jätetään lataamatta. Se on juuri
 * yhden tiedoston versio, jossa tyylit on jo upotettu sivuun eikä
 * erillisiä css-tiedostoja ole olemassakaan.
 */
function lataaTyyli() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(TYYLIN_TUNNUS)) return;
  const peruslinkki = document.querySelector('link[rel="stylesheet"][href*="styles.css"]');
  if (!peruslinkki) return;
  const linkki = document.createElement('link');
  linkki.id = TYYLIN_TUNNUS;
  linkki.rel = 'stylesheet';
  linkki.href = new URL('radio.css', peruslinkki.href).href;
  document.head.appendChild(linkki);
}

/** Pieni apuri: elementti luokalla ja tekstillä. */
function osa(tagi, luokka, teksti = '') {
  const solmu = document.createElement(tagi);
  if (luokka) solmu.className = luokka;
  if (teksti) solmu.textContent = teksti;
  return solmu;
}

/*
 * KROMI ON PYSTYSUORA LIUKUVÄRI, JOSSA ON USEITA VAALEITA JA TUMMIA
 * RAITOJA. Se on koko kromin salaisuus: kiillotettu metalli ei ole
 * harmaa vaan peili, ja peili näyttää sen mitä ympärillä on — vaalean
 * taivaan ylhäällä, tumman maan alhaalla ja niiden rajan terävänä
 * juovana siinä välissä. Yksi vaalea-tummasta-vaaleaan-liuku näyttää
 * muovilta; neljä terävää vuorottelua näyttää kromilta.
 *
 * EI SUODATTIMIA. iOS:n Safari piirtää SVG-suodattimen omalle
 * pinnalleen ja pudottaa koko kartan piirtonopeuden, joten kaikki
 * syvyys tehdään liukuväreillä ja päällekkäisillä vedoilla.
 *
 * Kaksi liukuväriä eri suuntiin, koska raidat kulkevat kappaleen
 * PITUUDEN suunnassa: mutteri on leveä ja matala (raidat vaakaan, liuku
 * pystyyn), vipu on kapea ja pitkä (raidat pystyyn, liuku vaakaan).
 */
const KROMIN_RAIDAT = [
  [0, '#f7fafc'], [0.11, '#c3ccd3'], [0.22, '#59626a'], [0.34, '#eef3f6'],
  [0.46, '#ffffff'], [0.57, '#939da5'], [0.7, '#454e55'], [0.82, '#d5dde2'],
  [1, '#6e777e'],
];

/*
 * VIVUN OMA KROMI, JA SYY ON MITTA.
 *
 * Yhdeksän raitaa on oikea resepti leveälle kappaleelle: mutteri on
 * ruudulla parikymmentä pikseliä, ja yhdeksän raitaa jakautuu siihen
 * kahden pikselin nauhoiksi, jotka näkyvät. VIPU ON NELJÄ PIKSELIÄ
 * LEVEÄ. Yhdeksän raitaa neljälle pikselille on puoli pikseliä raita
 * kohti, ja selain laskee niistä keskiarvon — lopputulos oli tasainen
 * vaaleanharmaa tikku. Juuri sitä katselmuksessa kysyttiin: näyttääkö
 * kromi kromilta vai harmaalta suorakaiteelta. Näytti suorakaiteelta.
 *
 * Viisi raitaa neljälle pikselille on vajaa pikseli kukin, ja se on
 * pienin mitta, jossa lieriön poikkileikkaus vielä luetaan: tumma reuna,
 * valkoinen kiiltojuova, keskiharmaa, tumma varjopuoli ja kapea vaalea
 * takaisinheijastus vastakkaisella reunalla. Samat viisi sävyä ovat
 * yhdeksän raidan sarjassa; tässä ne vain eivät mahdu useampaan kertaan.
 */
const VARREN_RAIDAT = [
  [0, '#4c545a'], [0.22, '#ffffff'], [0.5, '#9aa3aa'],
  [0.72, '#3f474d'], [1, '#bcc5cb'],
];

/**
 * Liukuväri annetulla tunnuksella ja suunnalla ('pysty' | 'vaaka').
 *
 * `raidat` on oletuksena leveän kappaleen yhdeksän raitaa; kapea kappale
 * antaa oman sarjansa (ks. VARREN_RAIDAT).
 */
function kromiLiuku(tunnus, suunta, raidat = KROMIN_RAIDAT) {
  const pysty = suunta === 'pysty';
  const nauhat = raidat
    .map(([kohta, vari]) => `<stop offset="${kohta}" stop-color="${vari}"/>`)
    .join('');
  return `<linearGradient id="${tunnus}" x1="0" y1="0" `
    + `x2="${pysty ? 0 : 1}" y2="${pysty ? 1 : 0}">${nauhat}</linearGradient>`;
}

/**
 * KLASSINEN METALLIKYTKIN SVG:NÄ.
 *
 * Omistaja lähetti kuvan ja sanoi: "vanhanaikaisia kromattuja, joissa on
 * pyöreä mutteri pohjalla. Siis oikein perinteinen sen ajan
 * metallikytkin, jossa on semmoinen vipu."
 *
 * Kytkin on piirretty EDESTÄ, kuten se paneelissa näkyy: kotelon puuhun
 * upotettu reikä, sen päällä kromattu pyöreä prikka, prikan päällä
 * kuusiomutteri, mutterin sisällä kierteinen kaulus ja keskeltä ulos
 * tuleva kromattu vipu, jonka kärki on pyöristetty. Sivulta piirrettynä
 * alas käännetty vipu osuisi mutteriin; edestä se kääntyy puhtaasti ylös
 * tai alas, ja juuri niin sen omistaja pyysi kääntyvän.
 *
 * KAKSI MUUTOSTA KATSELMUKSESSA 4.8.2026, molemmat samasta syystä:
 * omistaja pyysi METALLIKYTKINTÄ, ja laitteen suurin yksittäinen pinta
 * oli musta.
 *
 *  1. Musta bakeliittilevy pois. Se oli pyöristetty neliö, ja ruudulla
 *     parinkymmenen pikselin pyöristetty musta neliö näyttää
 *     sovelluskuvakkeelta, ei kytkimeltä. Tilalle tuli se, mitä
 *     aikakauden paneelissa oikeasti on: reikä puussa ja sen varjo.
 *     Nyt kytkimestä on metallia kaikki, mitä siitä näkyy.
 *  2. Pyöreä prikka mutterin alle. Omistajan sanat olivat "pyöreä
 *     mutteri pohjalla"; pelkkä kuusikulmio ei ole pyöreä. Prikan
 *     kromiraidat kulkevat vaakaan ja mutterin pystyyn, jolloin kaksi
 *     kiillotettua kappaletta erottuu toisistaan eikä niistä tule yhtä
 *     möykkyä.
 *
 * Vipu kääntyy attribuutilla eikä siirtymällä, koska oikea kytkin
 * NAPSAHTAA: jousi vie vivun asentoon eikä siinä ole välitilaa. Pehmeä
 * liuku olisi tässä väärä ääni, ja se olisi myös jatkuvaa liikettä
 * kartan päällä (css/radio.css).
 */
function kytkimenSvg(tunniste) {
  const kromiP = `${tunniste}-kromi-p`;
  const kromiV = `${tunniste}-kromi-v`;
  const varsi = `${tunniste}-varsi`;
  const reika = `${tunniste}-reika`;
  const kupu = `${tunniste}-kupu`;
  return `<svg class="radio-kytkin-kuva" viewBox="0 0 40 66" width="30" height="49.5"
      aria-hidden="true" focusable="false">
    <defs>
      ${kromiLiuku(kromiP, 'pysty')}
      ${kromiLiuku(kromiV, 'vaaka')}
      ${kromiLiuku(varsi, 'vaaka', VARREN_RAIDAT)}
      <!-- Reiän varjo puussa. Liukuväri eikä sumennettu varjo: iOS
           piirtää sumennuksen omalle pinnalleen (ks. css/radio.css). -->
      <radialGradient id="${reika}" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0.62" stop-color="#000000" stop-opacity="0.5"/>
        <stop offset="0.84" stop-color="#000000" stop-opacity="0.3"/>
        <stop offset="1" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="${kupu}" cx="0.36" cy="0.3" r="0.78">
        <stop offset="0" stop-color="#ffffff"/>
        <stop offset="0.45" stop-color="#aab3ba"/>
        <stop offset="1" stop-color="#3d454b"/>
      </radialGradient>
    </defs>

    <!-- Reikä puussa ja sen varjo. Kytkin on läpi paneelin, ei sen
         päällä liimattu, ja varjo on ainoa asia, joka kertoo sen. -->
    <circle cx="20" cy="33" r="17" fill="url(#${reika})"/>

    <!-- Kromattu pyöreä prikka mutterin alla: "pyöreä mutteri pohjalla".
         Raidat vaakaan, jotta prikka erottuu pystyraitaisesta
         mutterista. -->
    <circle cx="20" cy="33" r="13.4" fill="url(#${kromiV})"
      stroke="rgba(0,0,0,0.55)" stroke-width="0.7"/>
    <circle cx="20" cy="33" r="12.4" fill="none"
      stroke="rgba(255,255,255,0.34)" stroke-width="0.7"/>

    <!-- Kromattu kuusiomutteri prikan päällä. Kuusikulmion kärjet ovat
         sivuilla ja lappeet ylhäällä ja alhaalla, kuten avaimelle
         tarkoitetussa mutterissa. -->
    <path d="M8 33 L14 22.4 L26 22.4 L32 33 L26 43.6 L14 43.6 Z"
      fill="url(#${kromiP})" stroke="rgba(0,0,0,0.6)" stroke-width="0.7"/>
    <!-- Viisto reuna: mutterin särmät ovat viistetyt, ja viiste näkyy
         kapeana vaaleana kaistana lapetta pitkin. -->
    <path d="M10.2 33 L15.2 24.2 L24.8 24.2 L29.8 33 L24.8 41.8 L15.2 41.8 Z"
      fill="none" stroke="rgba(255,255,255,0.42)" stroke-width="0.8"/>

    <!-- Kierteinen kaulus mutterin sisällä: kolme kierrettä varjoina.
         Kauluksen ja mutterin väliin jää rako, ja rako on tumma juova
         eikä musta rengas — kun kaikki ympärillä oli mustaa levyä,
         paksukin rengas hukkui, mutta kromilla se olisi silmiinpistävä
         donitsi. Kahdeksan kymmenystä yksikköä riittää raoksi. -->
    <circle cx="20" cy="33" r="8" fill="#20262b"/>
    <circle cx="20" cy="33" r="7.2" fill="url(#${kromiP})"/>
    <path d="M13.6 30.3 H26.4 M13 33 H27 M13.6 35.7 H26.4"
      stroke="rgba(0,0,0,0.34)" stroke-width="0.8" fill="none"/>

    <!-- Vipu. Kiertokeskiö on kauluksen keskellä (20, 33): ylhäällä
         kärki nousee mutterin yläpuolelle, alhaalla se laskeutuu sen
         alle, eikä kumpikaan asento jää arvailun varaan.
         KAPENEE KÄRKEÄ KOHTI, kuten oikea vipu: tasapaksu tikku on se,
         mikä saa kytkimen näyttämään piirretyltä eikä sorvatulta. -->
    <g class="radio-vipu" transform="rotate(0 20 33)">
      <path d="M16.2 32.4 L17.4 10.2 Q20 6 22.6 10.2 L23.8 32.4 Z"
        fill="url(#${varsi})" stroke="rgba(0,0,0,0.5)" stroke-width="0.6"
        stroke-linejoin="round"/>
      <circle cx="20" cy="33" r="5.4" fill="url(#${kupu})"
        stroke="rgba(0,0,0,0.4)" stroke-width="0.6"/>
    </g>
  </svg>`;
}

/**
 * Merkkilamppu: kromattu rengas, kupera punainen lasi ja hehku.
 *
 * Omistaja: "Punainen nappi saisi olla myös isompi, sellainen, jossa on
 * lasikupu päällä ja joka loistaa valoa hieman ympäristöön."
 *
 * Hehku on radiaalinen liukuväri kotelon päällä lasin ympärillä, ei
 * suodatin eikä box-shadow'n sumennus: iOS piirtää sumennetun varjon
 * omalle pinnalleen, ja kartan päällä se maksaa kuvataajuutta. Lasin
 * kuperuus on sama temppu kuin joen uomassa kartalla — vaalea kohokohta
 * ylävasemmalle, tumma reuna alaoikealle — ja ne ovat CSS:ssä
 * (css/radio.css), koska tila vaihtaa niitä.
 */
function teeLamppu() {
  const lamppu = osa('span', 'radio-lamppu');
  lamppu.setAttribute('aria-hidden', 'true');
  lamppu.append(
    osa('span', 'radio-lamppu-hehku'),
    osa('span', 'radio-lamppu-kehys'),
    osa('span', 'radio-lamppu-lasi'),
  );
  return lamppu;
}

/**
 * Etäisyys kaupungista toiseen laudan yksiköissä.
 *
 * KARTTA KIERTÄÄ YMPÄRI, ja se on tämän funktion koko olemassaolon syy.
 * Maailmankartalla Tokio on laudan oikeassa laidassa ja Anchorage
 * vasemmassa, mutta Tyynellämerellä ne ovat naapureita. Ilman kierron
 * huomioimista Tokion asteikko täyttyisi Kiinan kaupungeista molemmin
 * puolin, ja lännen suunta olisi laudan reunassa umpikuja.
 *
 * Palauttaa myös etumerkillisen dx:n, koska asteikolla on puolet:
 * negatiivinen dx on lännessä eli vasemmalla, positiivinen idässä.
 */
function ero(a, b, laudanLeveys) {
  let dx = b.x - a.x;
  if (laudanLeveys > 0) {
    dx = ((dx % laudanLeveys) + laudanLeveys) % laudanLeveys;
    if (dx > laudanLeveys / 2) dx -= laudanLeveys;
  }
  const dy = b.y - a.y;
  return { dx, matka: Math.hypot(dx, dy) };
}

/**
 * Rakentaa radiosoittimen ja palauttaa sen ohjaimen.
 *
 * Valinnat:
 *   onStop()               — soittokytkin käännettiin alas; kutsuja pysäyttää äänen.
 *   onSulje()              — virtakytkin käännettiin off-asentoon. Kutsuja
 *                            sulkee koko radiotilan. Jos tätä ei anneta,
 *                            laite vain katoaa näkyvistä eikä muuta tapahdu
 *                            — soitin ei tunne radiotilaa eikä saa arvata
 *                            sitä (ks. tiedoston alku: ei js/ui.js:ää).
 *   onAani(arvo)           — äänenvoimakkuus 0–1 muuttui.
 *   onValitseKaupunki(id)  — asteikolta valittiin kaupunki tai soittokytkin
 *                            käännettiin ylös. Kutsuja soittaa kanavan.
 *   onAikakatkaisu()       — viritys kesti liian kauan; kutsuja sulkee virran.
 *   kaupungit              — asteikon aineisto: [{ id, nimi, x, y }] niistä
 *                            kaupungeista, JOILLA ON KANAVA. Soitin ei
 *                            tarkista kanavia; kutsuja suodattaa listan.
 *   kaikkiKaupungit        — [{ id, x, y }] kaikista laudan kaupungeista.
 *                            Valinnainen; tarvitaan vain siihen, että
 *                            pelaajan sijainti kanavattomassa kaupungissa
 *                            löytää lähimmän kanavakaupungin.
 *   laudanLeveys           — laudan leveys yksiköissä, jos lauta kiertää
 *                            ympäri. 0 = ei kiertoa.
 *   sijainti               — pelaajan kaupungin tunnus. Asteikko keskittyy
 *                            tähän, kun mitään ei soi.
 *   viritysAika            — aikakatkaisu millisekunteina (oletus 12 s).
 *   aani                   — aloitusäänenvoimakkuus 0–1 (oletus 0,8).
 *
 * Palauttaa:
 *   juuri                  — elementti, jonka kutsuja liittää haluamaansa
 *                            paikkaan (soitin asemoi itsensä alalaitaan).
 *   naytaKanava(tiedot)    — { asema, maa, kaupunki, cityId, naytto } tai null.
 *                            `naytto` on valinnainen lyhennetty nimi
 *                            pistenäytölle, ks. rivit(). `cityId` keskittää
 *                            asteikon soivaan kaupunkiin.
 *   asetaTila(tila, viesti)
 *   asetaNaytto(elementti) — pistematriisinäyttö aukkoon.
 *   asetaAani(arvo)
 *   asetaKaupungit(lista, { laudanLeveys, sijainti })
 *   asetaSijainti(cityId)
 *   poista()
 */
export function teeRadiosoitin({
  onStop = null,
  onSulje = null,
  onAani = null,
  onValitseKaupunki = null,
  onAikakatkaisu = null,
  kaupungit = [],
  kaikkiKaupungit: kaikkiAlussa = null,
  laudanLeveys = 0,
  sijainti = null,
  viritysAika = VIRITYKSEN_AIKAKATKAISU_MS,
  aani = 0.8,
} = {}) {
  lataaTyyli();
  const tunniste = `radio-${(tunnusLaskuri += 1)}`;

  const juuri = osa('div', 'radiosoitin');
  juuri.dataset.tila = 'sammuksissa';
  juuri.dataset.virta = 'on';
  // Soitin on laite eikä ilmoitus: ruudunlukija saa kertoa sen sisällön
  // pyydettäessä, mutta tilamuutokset luetaan vain tilarivistä (alla).
  juuri.setAttribute('role', 'group');
  juuri.setAttribute('aria-label', 'Maailmanradio');

  const kotelo = osa('div', 'radio-kotelo');
  juuri.appendChild(kotelo);

  // --- äänenvoimakkuus: pieni nuppi vasempaan laitaan ------------------
  /*
   * Nuppi siirtyi vasemmalle, kun oikean laidan kaksi isoa nuppia
   * korvattiin kytkimillä (omistajan toive 4.8.2026). Paikka ei ole
   * mielivaltainen: aikakauden pöytäradiossa äänenvoimakkuus oli
   * nimenomaan vasemmanpuoleisin säädin, ja kytkimet ovat nyt siellä
   * missä ne käytössä ovat kätevimmin — oikeassa laidassa.
   */
  const aaniKehys = osa('div', 'radio-aani-kehys');
  const aaniNuppi = osa('div', 'radio-nuppi radio-aani');
  aaniNuppi.tabIndex = 0;
  aaniNuppi.setAttribute('role', 'slider');
  aaniNuppi.setAttribute('aria-label', 'Äänenvoimakkuus');
  aaniNuppi.setAttribute('aria-valuemin', '0');
  aaniNuppi.setAttribute('aria-valuemax', '100');
  aaniNuppi.appendChild(osa('span', 'radio-nuppi-uurre'));
  const aaninOsoitin = osa('span', 'radio-nuppi-osoitin');
  aaniNuppi.appendChild(aaninOsoitin);
  aaniKehys.append(aaniNuppi, osa('span', 'radio-nuppi-teksti', 'ÄÄNI'));
  kotelo.appendChild(aaniKehys);

  // --- kaiutinsäleikkö -------------------------------------------------
  // Kangas ja sen päälle listat tehdään kokonaan CSS-kuvioina: kuvatiedosto
  // olisi yksi lisälataus siitä, mikä on kaksi toistuvaa gradienttia.
  const kaiutin = osa('div', 'radio-kaiutin');
  kaiutin.setAttribute('aria-hidden', 'true');
  kaiutin.appendChild(osa('span', 'radio-kilpi', 'MATKAKIRJA'));
  kotelo.appendChild(kaiutin);

  // --- keskiö: näyttö, asteikko ja kanavan tiedot ----------------------
  const keskio = osa('div', 'radio-keskio');
  kotelo.appendChild(keskio);

  const naytonKehys = osa('div', 'radio-naytto-kehys');
  const naytto = osa('div', 'radio-naytto');
  /*
   * Aukko on toisen tekijän. Nämä kaksi tietoa ovat sen rajapinta:
   * data-tila kertoo mitä laite tekee ja data-rivit mitä siinä lukee.
   * Lisäksi jokaisesta muutoksesta lähtee tapahtuma 'radio-naytto',
   * jotta näytön ei tarvitse tarkkailla attribuutteja.
   */
  naytto.dataset.tila = 'sammuksissa';
  const naytonVara = osa('div', 'radio-naytto-vara');
  const varaYla = osa('span', 'radio-naytto-rivi radio-naytto-yla');
  const varaAla = osa('span', 'radio-naytto-rivi radio-naytto-ala');
  naytonVara.append(varaYla, varaAla);
  naytto.appendChild(naytonVara);
  naytonKehys.appendChild(naytto);

  // Merkkivalo on tieto eikä koriste: se palaa vain kun ääntä todella
  // tulee, joten pelaaja erottaa soivan laitteen viritettävästä.
  const lamppu = teeLamppu();
  naytonKehys.appendChild(lamppu);
  keskio.appendChild(naytonKehys);

  // --- asteikko: soiva kaupunki keskellä, naapurit molemmin puolin -----
  const asteikko = osa('div', 'radio-asteikko');
  asteikko.setAttribute('role', 'group');
  asteikko.setAttribute('aria-label', 'Viritysasteikko: naapurikaupunkien kanavat');
  const nimet = osa('div', 'radio-kaupungit');
  asteikko.appendChild(nimet);
  const viisari = osa('div', 'radio-viisari');
  viisari.setAttribute('aria-hidden', 'true');
  viisari.style.left = '50%';
  asteikko.appendChild(viisari);
  keskio.appendChild(asteikko);

  // --- kanavan tiedot ruudunlukijalle ----------------------------------
  /*
   * Omistaja 4.8.2026: "ota alareunan selventävä teksti pois." Rivi
   * kertoi saman kuin näyttö ja asteikko, eli oli toistoa — mutta
   * NÄYTTÖÄ RUUDUNLUKIJA EI OSAA LUKEA. Se on pisteistä piirretty SVG,
   * ja asteikko on nappirivi. Siksi rivi on yhä olemassa mutta
   * visuaalisesti piilotettu (css/radio.css .radio-kanava): silmä ei näe
   * sitä, aria-live kertoo sen.
   */
  const tiedot = osa('p', 'radio-kanava');
  tiedot.setAttribute('aria-live', 'polite');
  const asemaNimi = osa('span', 'radio-asema');
  const erotin = osa('span', 'radio-erotin');
  const maaNimi = osa('span', 'radio-maa');
  tiedot.append(asemaNimi, erotin, maaNimi);
  keskio.appendChild(tiedot);

  /*
   * Erotin kahden span-elementin väliin.
   *
   * Ilman sitä ruudunlukija latoo tekstit kiinni toisiinsa: rivi kuului
   * "France InterVirittää" (mitattu ruudulta 4.8.2026), koska
   * elementtien välissä ei ole välilyöntiä eikä rivinvaihtoa — ja rivi
   * on visuaalisesti piilotettu, joten virhe ei näy silmällä lainkaan.
   * Erotin syntyy vain kun molemmilla puolilla on tekstiä; muuten
   * pelkän aseman perään jäisi lukeva viiva.
   */
  function tahdistaErotin() {
    erotin.textContent = asemaNimi.textContent && maaNimi.textContent ? ' — ' : '';
  }

  // --- kytkimet --------------------------------------------------------
  /*
   * Omistaja: "kaksi oikeanpuoleisempaa säädintä voisi korvata kahdella
   * kytkimellä. Ensimmäisessä ylhäällä olisi play ja alhaalla stop, ja
   * toisessa on on ja off. Eli sitten kun kytkimen kääntää off-asentoon,
   * niin radio häviää näkyvistä."
   *
   * Kilvet ovat kytkimen ylä- ja alapuolella, kuten aikakauden
   * paneelissa, ja voimassa oleva asento on kirkas ja toinen himmeä.
   * Se on tässä tärkeämpi lukuohje kuin vivun kulma: pieni kromipala
   * kartan päällä on parin millin kokoinen, ja teksti kertoo asennon
   * silläkin koolla.
   */
  const kytkimet = osa('div', 'radio-kytkimet');
  kotelo.appendChild(kytkimet);

  /** Yksi kytkin kilpineen. Palauttaa napin ja sen asennon asettajan. */
  function teeKytkin(luokka, ylaTeksti, alaTeksti, otsikko) {
    const kehys = osa('div', 'radio-kytkin-kehys');
    kehys.appendChild(osa('span', 'radio-kytkin-kilpi radio-kytkin-yla', ylaTeksti));
    const nappi = document.createElement('button');
    nappi.type = 'button';
    nappi.className = `radio-kytkin ${luokka}`;
    nappi.setAttribute('aria-label', otsikko);
    nappi.title = otsikko;
    nappi.innerHTML = kytkimenSvg(`${tunniste}-${luokka}`);
    kehys.appendChild(nappi);
    kehys.appendChild(osa('span', 'radio-kytkin-kilpi radio-kytkin-ala', alaTeksti));
    kytkimet.appendChild(kehys);

    const vipu = nappi.querySelector('.radio-vipu');
    /** Kääntää vivun: true = ylös, false = alas. Napsahtaa, ei liu'u. */
    const asetaAsento = (ylos) => {
      const asento = ylos ? 'ylos' : 'alas';
      nappi.dataset.asento = asento;
      // Sama tieto kehykselle, jotta kilven sytytys on tavallinen
      // jälkeläisvalitsin eikä vaadi :has():ia (css/radio.css).
      kehys.dataset.asento = asento;
      nappi.setAttribute('aria-pressed', String(Boolean(ylos)));
      vipu?.setAttribute('transform', `rotate(${ylos ? 0 : 180} 20 33)`);
    };
    return { nappi, asetaAsento };
  }

  const soittoKytkin = teeKytkin('radio-kytkin-soitto', 'PLAY', 'STOP', 'Soita tai pysäytä');
  const virtaKytkin = teeKytkin('radio-kytkin-virta', 'ON', 'OFF', 'Radion virta');

  // --- tila ------------------------------------------------------------
  let nykyinenTila = 'sammuksissa';
  let nykyinenKanava = null;
  let vahti = 0;
  let aaniArvo = Math.min(1, Math.max(0, Number(aani) || 0));
  // Asetetun näytön oma kirjoitusfunktio, jos sellainen annettiin.
  let naytonKirjoitin = null;
  // Asteikon aineisto: id → { id, nimi, x, y }. Vain kanavalliset kaupungit.
  let asteikonKaupungit = new Map();
  /*
   * Kaikki kaupungit — myös kanavattomat — pelkkinä koordinaatteina.
   *
   * Tarvitaan vain siihen, että pelaajan oma sijainti osaa löytää
   * lähimmän KANAVALLISEN kaupungin silloin, kun pelaaja seisoo
   * kaupungissa, jolla ei ole asemaa. Kutsuja saa jättää listan
   * antamatta; silloin keskus haetaan kanavakaupunkien painopisteestä.
   */
  let kaikkiKaupungit = new Map();
  let kierto = Math.max(0, Number(laudanLeveys) || 0);
  let pelaajanPaikka = sijainti ?? null;
  // Asteikon keskimmäinen kaupunki. Se on soittokytkimen oletusvalinta:
  // ylös käännetty kytkin soittaa sen, mihin viisari osoittaa.
  let keskusId = null;
  /*
   * Viimeksi viritetty kaupunki. Pysäytetty radio EI SIIRRÄ VIISARIA:
   * oikeassa laitteessa asteikko jää siihen, mihin se on viritetty, ja
   * virran kytkeminen takaisin jatkaa samalta asemalta. Ilman tätä stop
   * heittäisi asteikon takaisin pelaajan kotikaupunkiin, ja juuri
   * kuunneltu naapuri katoaisi näkyvistä.
   */
  let viimeisinKeskus = null;

  /** Katkaisee viritysvahdin. Kutsutaan jokaisessa tilanvaihdossa. */
  function nollaaVahti() {
    if (!vahti) return;
    clearTimeout(vahti);
    vahti = 0;
  }

  /** Kertoo näytölle mitä siinä lukee — sekä attribuutteina että tapahtumana. */
  function paivitaNaytto(tila, rivit) {
    const [yla, ala] = rivit;
    naytto.dataset.tila = tila;
    naytto.dataset.rivit = JSON.stringify([yla, ala]);
    varaYla.textContent = yla;
    varaAla.textContent = ala;
    try {
      naytonKirjoitin?.([yla, ala]);
    } catch (syy) {
      // Rikkinäinen näyttö ei saa kaataa soitinta: laite jää näyttämään
      // vanhaa tekstiä, mutta kytkimet toimivat yhä.
      console.warn('Radion näytön kirjoitus epäonnistui.', syy);
    }
    naytto.dispatchEvent(new CustomEvent('radio-naytto', {
      bubbles: false,
      detail: { tila, rivit: [yla, ala] },
    }));
  }

  /** Näytön rivit nykytilalle ja -kanavalle. */
  function rivit(tila) {
    const pohja = TILAN_RIVIT[tila] ?? TILAN_RIVIT.sammuksissa;
    /*
     * `naytto` on kutsujan lyhentämä, pistenäytölle kelpaava versio
     * aseman nimestä; `asema` on nimi sellaisenaan. Ne eroavat, koska
     * ne menevät eri paikkoihin: kotelon tekstirivi osaa kreikkalaiset
     * ja kyrilliset kirjaimet, 5 × 7 -pisteruudukko ei. Kumpi tahansa
     * kelpaa yksinään — kutsuja saa jättää `nayton` antamatta.
     */
    const asema = (nykyinenKanava?.naytto ?? nykyinenKanava?.asema ?? '').toUpperCase();
    const paikka = [nykyinenKanava?.kaupunki, nykyinenKanava?.maa]
      .filter(Boolean).join(' · ').toUpperCase();
    if (tila === 'soi') return [asema || 'SUORA LÄHETYS', paikka];
    if (tila === 'virittaa') return [pohja[0], asema];
    if (tila === 'virhe') return [pohja[0], asema || pohja[1]];
    return pohja;
  }

  /*
   * ASTEIKON NAAPURIT.
   *
   * Keskus on soiva kaupunki. Jos mitään ei soi, keskukseksi otetaan
   * pelaajan sijainti — ja jos sitäkään ei tiedetä, kanavakaupunkien
   * keskikohtaa lähinnä oleva kaupunki. Tyhjä asteikko olisi tässä pahin
   * vaihtoehto: laite näyttäisi rikkinäiseltä juuri sillä hetkellä, kun
   * pelaaja avaa sen ensimmäisen kerran eikä ole vielä valinnut mitään.
   *
   * Puolet ratkaisee etumerkillinen dx: lännessä olevat vasemmalle,
   * idässä olevat oikealle. Näin asteikko vastaa karttaa — vasemmalle
   * painamalla siirrytään länteen — ja kiertävällä laudalla suunta on
   * lyhintä matkaa pitkin (ks. ero()).
   *
   * Jos toisella puolella ei ole tarpeeksi kaupunkeja (Uusi-Seelanti,
   * Islanti), vajaa puoli täytetään lähimmillä jäljelle jääneillä. Puoli
   * jää silloin väärälle ilmansuunnalle, mutta täysi asteikko ja
   * napautettavat naapurit ovat tärkeämpiä kuin täydellinen kompassi.
   */
  function laskeKeskus() {
    if (nykyinenKanava?.cityId && asteikonKaupungit.has(nykyinenKanava.cityId)) {
      return nykyinenKanava.cityId;
    }
    if (viimeisinKeskus && asteikonKaupungit.has(viimeisinKeskus)) return viimeisinKeskus;
    if (pelaajanPaikka && asteikonKaupungit.has(pelaajanPaikka)) return pelaajanPaikka;
    if (asteikonKaupungit.size === 0) return null;

    // Pelaajan sijainti voi olla kaupunki ilman kanavaa; silloin
    // keskukseksi kelpaa sitä lähin kanavakaupunki. Ilman sijaintiakin
    // jokin keskus on parempi kuin ei mitään, joten viimeinen vara on
    // aineiston oma painopiste.
    const kaikki = [...asteikonKaupungit.values()];
    const kohde = (pelaajanPaikka && kaikkiKaupungit.get(pelaajanPaikka)) ?? {
      x: kaikki.reduce((s, k) => s + k.x, 0) / kaikki.length,
      y: kaikki.reduce((s, k) => s + k.y, 0) / kaikki.length,
    };
    let paras = null;
    let parasMatka = Infinity;
    for (const kaupunki of kaikki) {
      const { matka } = ero(kohde, kaupunki, kierto);
      if (matka < parasMatka) { parasMatka = matka; paras = kaupunki; }
    }
    return paras?.id ?? null;
  }

  /** Naapurit puolittain: { vasen: [...], keski, oikea: [...] }. */
  function naapurit(keskus) {
    const tyhja = { vasen: [], keski: null, oikea: [] };
    const kohde = asteikonKaupungit.get(keskus);
    if (!kohde) return tyhja;

    const muut = [];
    for (const kaupunki of asteikonKaupungit.values()) {
      if (kaupunki.id === keskus) continue;
      muut.push({ kaupunki, ...ero(kohde, kaupunki, kierto) });
    }
    muut.sort((a, b) => a.matka - b.matka);

    const vasen = [];
    const oikea = [];
    const yli = [];
    for (const kohta of muut) {
      if (vasen.length >= NAAPUREITA_PER_PUOLI && oikea.length >= NAAPUREITA_PER_PUOLI) break;
      const puoli = kohta.dx < 0 ? vasen : oikea;
      if (puoli.length < NAAPUREITA_PER_PUOLI) puoli.push(kohta.kaupunki);
      else yli.push(kohta.kaupunki);
    }
    // Vajaa puoli täydennetään lähimmistä ylijääneistä, ks. yllä.
    while (vasen.length < NAAPUREITA_PER_PUOLI && yli.length) vasen.push(yli.shift());
    while (oikea.length < NAAPUREITA_PER_PUOLI && yli.length) oikea.push(yli.shift());

    // Vasemmalla lähin on keskustaa vasten eli listan loppuun.
    vasen.reverse();
    return { vasen, keski: kohde, oikea };
  }

  /** Yksi asteikon nimi: nappi, joka vaihtaa kanavan välittömästi. */
  function asteikonNappi(kaupunki, puoli, sija) {
    const nappi = document.createElement('button');
    nappi.type = 'button';
    nappi.className = 'radio-kaupunki';
    nappi.dataset.puoli = puoli;
    nappi.dataset.sija = String(sija);
    nappi.textContent = String(kaupunki.nimi ?? kaupunki.id).toUpperCase();
    nappi.setAttribute('aria-label', `Viritä kanava: ${kaupunki.nimi ?? kaupunki.id}`);
    if (puoli === 'keski') nappi.setAttribute('aria-current', 'true');
    nappi.addEventListener('click', () => valitseKaupunki(kaupunki.id));
    return nappi;
  }

  /**
   * Siirtää viisarin keskimmäisen nimen kohdalle.
   *
   * Paikka MITATAAN eikä lasketa prosenttina. Nimet ovat eri levyisiä
   * ("OSLO" ja "SANKT PETERBURG"), joten tasavälinen jako osuisi
   * keskimmäisen nimen viereen eikä sen päälle — ja viisari, joka on
   * nimen vieressä, näyttää siltä että laite on viritetty väärin.
   * Mittaus tehdään kerran nimien vaihtuessa ja kotelon leveyden
   * muuttuessa, ei kehyksittäin.
   */
  function siirraViisari() {
    const keski = nimet.querySelector('.radio-kaupunki[data-puoli="keski"]');
    const leveys = asteikko.offsetWidth;
    if (!keski || !leveys) { viisari.style.left = '50%'; return; }
    const kohta = keski.offsetLeft + keski.offsetWidth / 2;
    viisari.style.left = `${Math.min(99, Math.max(1, (kohta / leveys) * 100))}%`;
  }

  /** Piirtää asteikon uudelleen nykyiselle keskukselle. */
  function paivitaAsteikko() {
    keskusId = laskeKeskus();
    if (keskusId) viimeisinKeskus = keskusId;
    const { vasen, keski, oikea } = naapurit(keskusId);
    nimet.replaceChildren();
    vasen.forEach((kaupunki, i) => {
      nimet.appendChild(asteikonNappi(kaupunki, 'vasen', vasen.length - i));
    });
    if (keski) nimet.appendChild(asteikonNappi(keski, 'keski', 0));
    oikea.forEach((kaupunki, i) => {
      nimet.appendChild(asteikonNappi(kaupunki, 'oikea', i + 1));
    });
    // Viisari piiloon, jos asteikolla ei ole yhtään nimeä: yksinäinen
    // punainen viiva tyhjällä pergamentilla näyttää vialta.
    viisari.hidden = !keski;
    siirraViisari();
  }

  /** Asteikolta valittu kaupunki: kutsuja soittaa, laite ei. */
  function valitseKaupunki(cityId) {
    if (!cityId) return;
    try {
      onValitseKaupunki?.(cityId);
    } catch (syy) {
      console.warn('Radiosoittimen kanavavalinnan välitys epäonnistui.', syy);
    }
  }

  /**
   * Vaihtaa tilan. viesti korvaa näytön alarivin, kun kutsujalla on
   * tarkempi syy kerrottavana ("VERKKO POIKKI", "ASEMA EI VASTAA").
   */
  function asetaTila(tila, viesti = '') {
    const uusi = RADION_TILAT.includes(tila) ? tila : 'sammuksissa';
    nollaaVahti();
    nykyinenTila = uusi;
    juuri.dataset.tila = uusi;
    /*
     * Soittokytkin seuraa tilaa eikä omaa muistiaan. Ääni voi loppua
     * ilman että kytkintä koskettiin (asema kaatui, aikakatkaisu), ja
     * ylhäällä oleva vipu vaikenevan radion päällä on rikkinäinen laite.
     */
    soittoKytkin.asetaAsento(uusi === 'soi' || uusi === 'virittaa');

    const nayta = rivit(uusi);
    if (viesti) nayta[1] = String(viesti).toUpperCase();
    paivitaNaytto(uusi, nayta);

    /*
     * Ruudunlukijalle tila sanoin. Rivi on visuaalisesti piilotettu,
     * joten tämä on ainoa paikka, josta ruudunlukija saa tilan.
     */
    if (uusi === 'virittaa') maaNimi.textContent = 'Virittää…';
    else if (uusi === 'virhe') maaNimi.textContent = viesti ? String(viesti) : 'Asemaa ei kuulu';
    else if (uusi === 'sammuksissa') maaNimi.textContent = 'Valitse kaupunki kartalta';
    else maaNimi.textContent = [nykyinenKanava?.kaupunki, nykyinenKanava?.maa]
      .filter(Boolean).join(' · ');
    tahdistaErotin();

    if (uusi === 'virittaa' && viritysAika > 0) {
      vahti = setTimeout(() => {
        vahti = 0;
        // Rehellinen loppu ikuiselle odotukselle: laite kertoo ettei
        // asema vastaa, ja kutsuja saa sulkea virran omalta puoleltaan.
        asetaTila('virhe', 'Asema ei vastaa');
        try {
          onAikakatkaisu?.();
        } catch (syy) {
          console.warn('Radiosoittimen aikakatkaisun käsittely epäonnistui.', syy);
        }
      }, viritysAika);
    }
    return uusi;
  }

  /**
   * Näyttää kanavan tiedot. null tyhjentää.
   *
   * Tilaa tämä ei vaihda: kutsuja tietää, onko ääni jo käynnissä vai
   * vasta viritettävänä, eikä soittimen pidä arvata sitä.
   */
  function naytaKanava(kanava) {
    nykyinenKanava = kanava && typeof kanava === 'object' ? kanava : null;
    asemaNimi.textContent = nykyinenKanava?.asema ?? '';
    // Asteikko keskittyy soivaan kaupunkiin: uusi kanava on aina
    // keskellä ja sen naapurit heti valittavissa (omistajan toive).
    paivitaAsteikko();
    // Sama tila uudelleen kirjoittaa näytön ja tekstirivin tuoreilla tiedoilla.
    const nayta = rivit(nykyinenTila);
    paivitaNaytto(nykyinenTila, nayta);
    if (nykyinenTila === 'soi' || nykyinenTila === 'virittaa') {
      maaNimi.textContent = nykyinenTila === 'virittaa'
        ? 'Virittää…'
        : [nykyinenKanava?.kaupunki, nykyinenKanava?.maa].filter(Boolean).join(' · ');
    }
    tahdistaErotin();
    return nykyinenKanava;
  }

  /** Asteikon aineisto. Kutsuja antaa vain kanavalliset kaupungit. */
  function asetaKaupungit(lista = [], asetukset = {}) {
    asteikonKaupungit = new Map();
    for (const kaupunki of lista) {
      if (!kaupunki?.id || !Number.isFinite(kaupunki.x) || !Number.isFinite(kaupunki.y)) continue;
      asteikonKaupungit.set(kaupunki.id, {
        id: kaupunki.id,
        nimi: kaupunki.nimi ?? kaupunki.name ?? kaupunki.id,
        x: kaupunki.x,
        y: kaupunki.y,
      });
    }
    if (Array.isArray(asetukset.kaikki)) {
      kaikkiKaupungit = new Map();
      for (const kaupunki of asetukset.kaikki) {
        if (!kaupunki?.id || !Number.isFinite(kaupunki.x) || !Number.isFinite(kaupunki.y)) continue;
        kaikkiKaupungit.set(kaupunki.id, { id: kaupunki.id, x: kaupunki.x, y: kaupunki.y });
      }
    } else {
      kaikkiKaupungit = asteikonKaupungit;
    }
    if (Number.isFinite(asetukset.laudanLeveys)) {
      kierto = Math.max(0, asetukset.laudanLeveys);
    }
    if ('sijainti' in asetukset) pelaajanPaikka = asetukset.sijainti ?? null;
    paivitaAsteikko();
    return asteikonKaupungit.size;
  }

  /** Pelaajan sijainti: asteikon keskus silloin kun mitään ei soi. */
  function asetaSijainti(cityId) {
    pelaajanPaikka = cityId ?? null;
    if (!nykyinenKanava) paivitaAsteikko();
    return pelaajanPaikka;
  }

  /**
   * Panee pistematriisinäytön aukkoon.
   *
   * Ottaa vastaan kaksi muotoa:
   *   asetaNaytto(elementti)
   *   asetaNaytto({ juuri, naytaTeksti })   — esim. teePistenaytto()
   *
   * Jälkimmäisessä soitin kutsuu naytaTeksti(rivit) itse jokaisessa
   * muutoksessa. Näin kytkentä on yksi rivi eikä kolme, eikä kumpikaan
   * moduuli tunne toista: tunnistus on muodosta, ei tuonnista.
   *
   * ANNETUN NÄYTÖN ON OLTAVA TAUSTATON. Aukko on jo lasi: sillä on
   * nestekidesävy, hieno rasteri ja syvennyksen varjo, ja tilat
   * (sammuksissa, virhe) muuttavat sitä. Jos näyttö tuo oman
   * taustalaattansa, se peittää lasin ja laitteessa on kaksi eri
   * sävyistä ruutua sisäkkäin. Kutsuja antaa siis pistenäytölle
   * `tausta: null, kehys: null` — ks. js/linssit/radio.js.
   *
   * null palauttaa soittimen oman varatekstin — aukko ei saa jäädä
   * tyhjäksi, koska musta kolo näyttää rikkinäiseltä.
   */
  function asetaNaytto(elementti) {
    const solmu = elementti?.juuri ?? elementti;
    naytonKirjoitin = typeof elementti?.naytaTeksti === 'function'
      ? (rivit) => elementti.naytaTeksti(rivit)
      : null;
    naytto.replaceChildren();
    if (solmu) {
      naytto.appendChild(solmu);
      naytto.dataset.oma = 'true';
    } else {
      naytto.appendChild(naytonVara);
      delete naytto.dataset.oma;
    }
    // Uusi näyttö saa heti nykyisen sisällön; muuten se olisi tyhjä
    // siihen asti, kunnes tila sattuu seuraavan kerran vaihtumaan.
    paivitaNaytto(nykyinenTila, rivit(nykyinenTila));
    return naytto;
  }

  /** Äänenvoimakkuus 0–1: nupin asento, aria-arvo ja takaisinkutsu. */
  function asetaAani(arvo, kerro = true) {
    const uusi = Math.min(1, Math.max(0, Number(arvo) || 0));
    aaniArvo = uusi;
    // Nuppi kääntyy ±135°, kuten oikea potentiometri: täysi ympyrä
    // antaisi ymmärtää, että nuppia voi pyörittää loputtomiin.
    aaninOsoitin.style.transform = `rotate(${-135 + uusi * 270}deg)`;
    aaniNuppi.setAttribute('aria-valuenow', String(Math.round(uusi * 100)));
    aaniNuppi.setAttribute('aria-valuetext', `${Math.round(uusi * 100)} prosenttia`);
    if (kerro) {
      try {
        onAani?.(uusi);
      } catch (syy) {
        console.warn('Radiosoittimen äänenvoimakkuuden välitys epäonnistui.', syy);
      }
    }
    return uusi;
  }

  // --- kytkinten käyttö -------------------------------------------------
  /*
   * SOITTOKYTKIN. Alas = stop, ylös = play.
   *
   * Alas kääntäminen pysäyttää heti eikä vasta kun kutsuja ehtii:
   * painalluksen ja ruudun välissä ei saa olla viivettä, sillä hiljenevä
   * ääni ilman näkyvää muutosta saa pelaajan painamaan uudelleen.
   *
   * Ylös kääntäminen soittaa sen, mihin viisari osoittaa — soivan
   * kanavan uudelleen tai asteikon keskimmäisen kaupungin. Juuri tämä
   * tekee asteikosta viritysasteikon eikä nimirivin: kytkin ja asteikko
   * ovat sama laite.
   */
  soittoKytkin.nappi.addEventListener('click', () => {
    const soiNyt = nykyinenTila === 'soi' || nykyinenTila === 'virittaa';
    if (soiNyt) {
      asetaTila('sammuksissa');
      try {
        onStop?.();
      } catch (syy) {
        console.warn('Radiosoittimen pysäytys epäonnistui.', syy);
      }
      return;
    }
    const kohde = nykyinenKanava?.cityId ?? keskusId;
    if (!kohde) {
      // Ei mitään soitettavaa: vipu jää alas ja laite kertoo miksi.
      // Hiljaisuus ilman selitystä on rikkinäisen laitteen tuntomerkki.
      soittoKytkin.asetaAsento(false);
      paivitaNaytto('sammuksissa', ['RADIO POIS', 'VALITSE KAUPUNKI']);
      return;
    }
    valitseKaupunki(kohde);
  });

  /*
   * VIRTAKYTKIN. Alas = off, ja silloin radio häviää näkyvistä.
   *
   * Laite katoaa heti ja ääni loppuu heti; radiotilan sulkeminen on
   * kutsujan asia (onSulje). Jos kutsuja ei anna takaisinkutsua, laite
   * jää piiloon ja ääni pois — se on kaikki, mitä soitin voi tehdä
   * tietämättä mitään kartasta tai linssivalikosta.
   */
  virtaKytkin.nappi.addEventListener('click', () => {
    if (juuri.dataset.virta === 'off') return;
    virtaKytkin.asetaAsento(false);
    juuri.dataset.virta = 'off';
    asetaTila('sammuksissa');
    try {
      onStop?.();
    } catch (syy) {
      console.warn('Radiosoittimen pysäytys epäonnistui.', syy);
    }
    // Viimeisenä, koska tämä voi purkaa koko soittimen.
    try {
      onSulje?.();
    } catch (syy) {
      console.warn('Radiotilan sulkeminen epäonnistui.', syy);
    }
  });

  /*
   * Ääninuppia väännetään pystysuunnassa, ei ympyrää seuraten.
   *
   * Ympyrää seuraava veto on oikeaoppinen mutta hankala sormella: nupin
   * halkaisija on parikymmentä pikseliä, ja kaari sen ympäri karkaa
   * herkästi. Pystyveto toimii, vaikka sormi peittäisi koko nupin.
   * 120 pikseliä = koko asteikko, jolloin pienikin liike on hallittava.
   */
  const VEDON_MATKA = 120;
  let vedonAlku = null;
  aaniNuppi.addEventListener('pointerdown', (tapahtuma) => {
    vedonAlku = { y: tapahtuma.clientY, arvo: aaniArvo };
    aaniNuppi.setPointerCapture?.(tapahtuma.pointerId);
    tapahtuma.preventDefault();
  });
  aaniNuppi.addEventListener('pointermove', (tapahtuma) => {
    if (!vedonAlku) return;
    asetaAani(vedonAlku.arvo + (vedonAlku.y - tapahtuma.clientY) / VEDON_MATKA);
  });
  const lopetaVeto = () => { vedonAlku = null; };
  aaniNuppi.addEventListener('pointerup', lopetaVeto);
  aaniNuppi.addEventListener('pointercancel', lopetaVeto);
  aaniNuppi.addEventListener('keydown', (tapahtuma) => {
    const askel = { ArrowUp: 0.05, ArrowRight: 0.05, ArrowDown: -0.05, ArrowLeft: -0.05 };
    if (tapahtuma.key in askel) {
      asetaAani(aaniArvo + askel[tapahtuma.key]);
      tapahtuma.preventDefault();
    } else if (tapahtuma.key === 'Home') {
      asetaAani(0);
      tapahtuma.preventDefault();
    } else if (tapahtuma.key === 'End') {
      asetaAani(1);
      tapahtuma.preventDefault();
    }
  });

  /*
   * Kotelon leveys muuttuu ilman että kanava vaihtuu: ruudun kierto,
   * ikkunan koon muutos, ja ennen kaikkea se hetki, jona CSS piilottaa
   * uloimmat nimet kapealla ruudulla. Silloin keskimmäinen nimi siirtyy
   * ja viisarin on siirryttävä sen mukana. ResizeObserver ei ole
   * jatkuva animaatio: se herää vain kun mitta oikeasti muuttuu.
   */
  const vahtija = typeof ResizeObserver === 'function'
    ? new ResizeObserver(() => siirraViisari())
    : null;
  vahtija?.observe(asteikko);

  /** Sammuttaa vahdin ja irrottaa soittimen sivulta. */
  function poista() {
    nollaaVahti();
    vahtija?.disconnect();
    juuri.remove();
  }

  // Aloitusasento: nuppi paikalleen ilman takaisinkutsua (kutsuja ei ole
  // pyytänyt äänen muutosta, se vain kertoi lähtöarvon), kytkimet alas ja
  // laite pois päältä mutta virta päällä.
  asetaAani(aaniArvo, false);
  virtaKytkin.asetaAsento(true);
  asetaKaupungit(kaupungit, {
    laudanLeveys: kierto,
    sijainti: pelaajanPaikka,
    ...(Array.isArray(kaikkiAlussa) ? { kaikki: kaikkiAlussa } : {}),
  });
  naytaKanava(null);
  asetaTila('sammuksissa');

  return {
    juuri,
    naytonAukko: naytto,
    naytaKanava,
    asetaTila,
    asetaNaytto,
    asetaAani,
    asetaKaupungit,
    asetaSijainti,
    poista,
    get tila() { return nykyinenTila; },
    get aani() { return aaniArvo; },
    get keskus() { return keskusId; },
  };
}
