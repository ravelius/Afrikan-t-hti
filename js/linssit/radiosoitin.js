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
 * YKSI POIKKEUS SÄÄNTÖÖN "EI ÄÄNTÄ": VU-MITTARI KUUNTELEE.
 *
 * Omistajan toive 4.8.2026: "Radioon voisi lisätä vanhan ajan
 * VU-mittarin, missä lanka liikkuu äänen voimakkuuden mukaan." Neula ei
 * saa heilua satunnaisesti — arvottu liike näyttää siltä miltä se on,
 * eikä laite ole silloin elossa vaan vilkkuu. Siksi tämä tiedosto tuo
 * js/sound.js:n `sfx`:n ja liittää AnalyserNoden pelin äänisummaan.
 *
 * TUONTI ON VAIN LUKEVA, eikä se saa muuttua kirjoittavaksi. Sääntö
 * "soitin ei soita ääntä" on olemassa siksi, ettei kaksi paikkaa
 * pysäyttäisi samaa virtaa eri mieltä (ks. yllä); mittari ei aloita, ei
 * lopeta eikä säädä mitään — se lukee tason ja kääntää neulaa. Jos
 * tähän tiedostoon joskus tulee sfx.play() tai gain-arvon kirjoitus, se
 * on virhe eikä laajennus.
 *
 * Kiertoviittausta ei synny: js/sound.js ei tunne linssejä. js/ui.js:n
 * tai js/game.js:n tuonti sen sijaan tekisi kierron, ja ne ovat yhä
 * kiellettyjä. Muut sallitut ovat samat kuin linssimoduulilla
 * (../mapart.js).
 *
 * SUORAN LÄHETYKSEN TASOA EI VOI MITATA, ja se on selaimen sääntö eikä
 * tämän tiedoston valinta: js/linssit/radio.js soittaa lähetyksen
 * <audio>-elementistä ILMAN crossOriginia, koska moni asema ei lähetä
 * CORS-otsakkeita ja luvan pyytäminen veisi äänen kokonaan. Web Audio
 * antaa CORS-luvattomasta elementistä pelkkää hiljaisuutta, joten
 * mittari ei näe lähetystä lainkaan — se näkee viritysäänen, joka
 * kulkee pelin väylän kautta. Kutsuja voi antaa oman lähteensä
 * (asetaAanilahde), jos lähetys joskus reititetään Web Audion läpi
 * samalla varareitillä kuin kaupunkien äänimaisema
 * (js/ambience-stream.js liitaKompressori).
 *
 * MITATTU SEURAUS 4.8.2026: neula elää virittäessä (11 eri kulmaa
 * kahdessa sekunnissa, −43,7°…+9,8°) ja palaa lepoon sillä hetkellä,
 * kun asema alkaa kuulua. Katselmuksessa tämä on soittimen suurin
 * jäljellä oleva puute.
 *
 * KORJAUSTA EI TEHTY, JA SYY ON iOS EIKÄ TYÖNJAKO. Varareitti vaatii
 * crossOriginin ennen srciä, ja jos asema ei lähetä CORS-otsakkeita,
 * lataus epäonnistuu — silloin on luotava UUSI elementti ilman
 * crossOriginia (vanhaa ei voi käyttää, koska createMediaElementSource
 * on jo sitonut sen Web Audioon ja tuottaisi hiljaisuutta). Uusi
 * elementti aloittaa toistonsa virhekäsittelijästä eli ilman
 * käyttäjän elettä, ja juuri sen iOS:n Safari estää. Hinta olisi siis
 * mittarilukema CORSia tukevista asemista ja HILJAISUUS lopuista
 * iOS:llä — ja radio, joka ei soi, on huonompi kuin mittari, joka ei
 * liiku. Ratkaisu vaatii oikean laitteen kokeen, eikä sitä voi tehdä
 * selainajossa: CORSiton asema käyttäytyy työpöydän Chromessa
 * moitteettomasti.
 */

import { sfx } from '../sound.js';

/*
 * Soittimen tilat. Neljä riittää, ja niiden on oltava neljä eikä
 * kolme: ilman omaa "virittaa"-tilaa suoran lähetyksen ensimmäiset
 * sekunnit näyttäisivät täsmälleen samalta kuin rikkinäinen asema.
 */
export const RADION_TILAT = Object.freeze(['sammuksissa', 'virittaa', 'soi', 'virhe']);

/*
 * VIRITYKSEN VAIHEET — sopimus soittimen ja js/linssit/radio.js:n välillä.
 *
 * Viritys ei ole yksi tapahtuma vaan kolme, ja pelaaja näkee erot:
 * asteikko LIUKUU uuden aseman kohdalle (siirtyma), HAKEE sitä pienellä
 * edestakaisella liikkeellä niin kauan kuin lähetystä odotetaan (haku)
 * ja ASETTUU paikalleen kun asema on löytynyt (lukittuu).
 *
 * NIMET ASUVAT TÄÄLLÄ EIVÄTKÄ radio.js:SSÄ, vaikka ajoitus on siellä.
 * Vaihe on käsky kuorelle — "liu'u", "hae", "asetu" — ja käskyn sanaston
 * omistaa se, joka sen toteuttaa. radio.js tuo listan tästä ja vie sen
 * edelleen omalla nimellään, jotta ajoituksen testit näkevät saman
 * totuuden eikä kopiota. Kaksi erillistä listaa ehtisi eri mieltä
 * ensimmäisessä lisäyksessä.
 */
export const VIRITYKSEN_VAIHEET = Object.freeze(['siirtyma', 'haku', 'lukittuu']);

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

/*
 * ══════════════════════════════════════════════════════════════════════
 * VIRITYSNAUHAN LIUKU
 * ══════════════════════════════════════════════════════════════════════
 *
 * Omistaja 4.8.2026: "Kaupunkitekstit liikkuvat liian nopeasti
 * viritettäessä. --- Silloin voisi animoida pehmeämmän siirtymän
 * viritysnauhalle ja jatkaa sitten tarpeeksi hidasta edestakaista, hyvin
 * pientä liikettä mikäli lataus vaatii enemmän aikaa."
 *
 * Liu'un PITUUS lasketaan täällä, sen NOPEUS on css/radio.css:ssä. Jako
 * menee siitä, kumpi tietää asian: pikselimatka uuden aseman vanhalta
 * paikalta uudelle on asettelua, jonka vain mittaus kertoo, ja
 * kiihtyvyyskäyrä on tyyliä.
 *
 * MATKA MITATAAN, EI ARVATA. Kun pelaaja napauttaa asteikon naapuria,
 * uusi asema oli hetki sitten näkyvissä tietyssä kohdassa nauhaa, ja
 * juuri sen verran nauhan pitää liukua. Arvattu vakiomatka olisi
 * naapurilla liian pitkä ja toisen mantereen kaupungilla liian lyhyt —
 * ja silloin liuku ei kertoisi mitään siitä, kuinka kaukaa asema
 * haettiin.
 */

/*
 * Kartalta valitun kaupungin liukumatka osuutena asteikon leveydestä.
 *
 * Kartalta valittu kaupunki ei yleensä ole nauhalla lainkaan, joten
 * mitattavaa paikkaa ei ole. Puolikas asteikko on se matka, jolla uusi
 * nimi tulee juuri ja juuri reunan takaa: pidempi matka olisi
 * ensimmäisen puolen sekunnin ajan pelkkää tyhjää nauhaa, ja lyhyempi
 * ei erottuisi naapurin valinnasta.
 */
const LIUUN_VARAMATKA = 0.5;

/*
 * Lyhin liuku, joka ylipäätään näytetään.
 *
 * Sama asema uudelleen (virheen jälkeen tehty uusi yritys) ei siirrä
 * nauhaa lainkaan, ja täysin liikkumaton nauha kahden sekunnin ajan on
 * jäätynyt laite eikä virittyvä. Kymmenen pikselin nytkähdys on se, mitä
 * oikea laite tekee, kun viritysnuppia kokeillaan uudelleen samasta
 * kohtaa.
 */
const LIUUN_VAHIN = 10;

/*
 * ══════════════════════════════════════════════════════════════════════
 * NAUHAN NYKÄISEVÄ LIIKE (tarttuu ja irtoaa)
 * ══════════════════════════════════════════════════════════════════════
 *
 * Omistaja: "Kanavalista liikkuu liian pehmeästi. Jos sitä oikeasti
 * kädellä vääntää, niin se menee välillä töksähtäen, tai ei ainakaan noin
 * pehmeästi."
 *
 * Havainto on mekaniikkaa. Viritysrulla ei liu'u vaan TARTTUU JA IRTOAA:
 * sormi painaa, kitka pitää, jännite kasvaa, ote pettää ja nauha hypähtää
 * eteenpäin. Sama ilmiö kirskuu jarrussa ja soi viulunkielessä. Tasainen
 * kiihdytyskäyrä on siis väärä malli — se on moottorin liikettä, ei käden.
 *
 * MITÄ MUUTETAAN JA MITÄ EI. Nauhan MATKA lasketaan yhä mittaamalla
 * (laskeLiuku) ja KESTO on yhä css/radio.css:n oma. Hakuvaiheen pieni
 * edestakainen liike ja virityksen vähimmäisaika (js/linssit/radio.js
 * VIRITYKSEN_AJAT) jäävät koskematta — ne ovat omistajan aiempia toiveita,
 * eikä uusi toive kumoa niitä. Vain se, MITEN matka jakautuu ajalle,
 * vaihtuu tasaisesta käyrästä nykäyksiksi.
 *
 * KEINO ON CSS:N linear()-PEHMENNIN. Animaatio on yhä sama kahden
 * avainkehyksen liuku (matka → nolla), mutta pehmennin on porrasmainen:
 * se seisoo tartunnan ajan paikallaan ja etenee sitten kerralla. Liike
 * pysyy siis yhtenä transform-animaationa — ei ajastinta, ei
 * kehyskohtaista javascriptiä, ei kartan uudelleenpiirtoa. Vanha
 * cubic-bezier jää css/radio.css:ään varalle: jos selain ei tunne
 * linear()-pehmennintä, liuku on entisensä eikä rikki.
 *
 * ARVONTA ON SIEMENNETTÄVISSÄ. Nykäisyt arvotaan joka virityksellä
 * uudelleen — sama ote kahdesti peräkkäin ei ole käden liikettä — mutta
 * arvontalähde tulee kutsujalta samaan tapaan kuin viritysäänessä
 * (js/linssit/viritin.js), joten testi ja demo saavat toistettavan
 * tuloksen antamalla oman lähteensä.
 */

/*
 * Nykäisyn rajat yhdessä paikassa, jäädytettynä. Sama sääntö kuin
 * viritysäänessä (js/linssit/viritin.js VIRITTIMEN_RAJAT): satunnaisuus on
 * ominaisuus, mutta rajaton satunnaisuus tuottaa ennen pitkää liikkeen,
 * joka näyttää vialta. Testi tarkistaa nämä rajat.
 */
export const NYKAISYN_RAJAT = Object.freeze({
  /*
   * Montako otetta yhteen liukuun. Kolme on liian vähän — silloin
   * jokainen nykäisy on niin pitkä, että se ehtii lukea liu'uksi — ja
   * seitsemän niin tiheä, ettei yksittäistä pysähdystä enää erota
   * tärinästä.
   */
  nykaisyja: Object.freeze([4, 6]),
  /*
   * Tartunnan osuus yhden otteen ajasta: kuinka kauan nauha seisoo ennen
   * kuin ote pettää. Alaraja pitää huolen, että pysähdys ehtii näkyä
   * (1,25 s:n liu'ussa viidesosa otteesta on runsaat 50 ms), yläraja
   * siitä, ettei liuku ole enemmän seisomista kuin liikettä.
   */
  tartunta: Object.freeze([0.2, 0.5]),
  /*
   * Otteen ajan vaihtelu kertoimena. Ilman vaihtelua nykäisyt tulisivat
   * tasavälein, ja tasavälinen nykiminen lukee koneeksi — juuri se
   * konemaisuus, jota omistaja ei pyytänyt.
   */
  vaihtelu: Object.freeze([0.75, 1.3]),
  /*
   * Etenemän vaihtelu: paljonko yksi ote saa poiketa siitä, mitä
   * hidastuva kaari sille laskee.
   */
  etenemanVaihtelu: Object.freeze([-0.05, 0.05]),
  /*
   * Ylitys osuutena koko matkasta: viimeinen ote menee kohteen yli ja
   * palaa. Omistajan sanoin loppu saa yhä olla pehmeä muttei liukas —
   * ylitys on juuri se ero. 2–5 % puolikkaasta asteikosta on 4–9 px eli
   * pari kirjaimen leveyttä: se näkyy korjausliikkeenä eikä virheenä.
   */
  ylitys: Object.freeze([0.02, 0.05]),
  /*
   * Paluu ylityksestä kohteeseen, osuutena koko ajasta. Tämä on liu'un
   * viimeinen ele, ja se on nopea: käsi huomaa menneensä yli ja korjaa.
   */
  paluu: Object.freeze([0.09, 0.16]),
  /*
   * Lukittumisen ylitys pikseleinä. Lukkovaiheessa matka on hakuliikkeen
   * mittainen (pari pikseliä), joten osuutena laskettu ylitys jäisi
   * alle puolen pikselin eli näkymättömiin — tässä ylitys on siksi
   * pikseleitä eikä prosentteja.
   */
  lukonYlitys: Object.freeze([0.8, 1.8]),
  /*
   * Hidastuvan kaaren jyrkkyys. Yksi olisi tasainen eteneminen; 2,2
   * antaa saman muodon kuin vanha cubic-bezier eli reipas alku ja
   * viimeisten millien etsintä.
   */
  kaari: 2.2,
});

/** Satunnaisluku väliltä [min, max]. */
function valilta(arvonta, [min, max]) {
  return min + arvonta() * (max - min);
}

/** Kokonaisluku väliltä [min, max], molemmat mukaan luettuina. */
function kokonaisValilta(arvonta, [min, max]) {
  return min + Math.floor(arvonta() * (max - min + 1));
}

/**
 * ARPOO YHDEN LIU'UN NYKÄISYT.
 *
 * MIKSI TÄMÄ ON OMA, PUHDAS FUNKTIONSA: se on tämän liikkeen ainoa osa,
 * jonka voi tarkistaa ilman selainta — animaation ajaa CSS. Sama työnjako
 * kuin viritysäänessä: arvonta erikseen, toteutus erikseen.
 *
 * Palauttaa pisteet aikajärjestyksessä. `aika` on osuus liu'un kestosta
 * (0–1) ja `etenema` osuus matkasta (0 = lähtö, 1 = perillä, yli yhden =
 * kohteen ohi). Peräkkäiset pisteet, joilla on sama etenemä, ovat
 * tartunta: nauha seisoo niiden välisen ajan.
 *
 * @param {() => number} [arvonta] satunnaislähde, oletuksena Math.random
 * @returns {{pisteet: Array<{aika: number, etenema: number}>, ylitys: number}}
 */
export function arvoNykaisyt(arvonta = Math.random) {
  const R = NYKAISYN_RAJAT;
  const otteita = kokonaisValilta(arvonta, R.nykaisyja);
  const ylitys = valilta(arvonta, R.ylitys);
  const paluu = valilta(arvonta, R.paluu);

  /*
   * Otteiden ajat: myöhemmät otteet ovat pidempiä. Kättä käännetään
   * ensin reippaasti ja etsitään sitten viimeisiä millejä, joten
   * loppupään otteet vievät enemmän aikaa ja vähemmän matkaa.
   */
  const painot = [];
  for (let i = 0; i < otteita; i++) {
    painot.push((1 + i * 0.55) * valilta(arvonta, R.vaihtelu));
  }
  const summa = painot.reduce((a, b) => a + b, 0);

  // Liikkeelle jäävä aika: paluu ylityksestä on tämän jälkeen.
  const liikeAika = 1 - paluu;
  const pisteet = [{ aika: 0, etenema: 0 }];
  let aika = 0;
  let edellinen = 0;

  for (let i = 0; i < otteita; i++) {
    const viimeinen = i === otteita - 1;
    const kesto = (painot[i] / summa) * liikeAika;
    // Hidastuva kaari: mihin asti tämän otteen jälkeen ollaan.
    const pohja = 1 - (1 - (i + 1) / otteita) ** R.kaari;
    const kohde = viimeinen
      ? 1 + ylitys
      : Math.min(0.985, Math.max(
        edellinen + 0.02, pohja + valilta(arvonta, R.etenemanVaihtelu),
      ));

    // Tartunta: nauha seisoo paikallaan otteen alkuosan.
    const seisonta = kesto * valilta(arvonta, R.tartunta);
    aika += seisonta;
    pisteet.push({ aika, etenema: edellinen });
    // Irtoaminen: koko otteen matka kerralla.
    aika += kesto - seisonta;
    pisteet.push({ aika, etenema: kohde });
    edellinen = kohde;
  }

  /*
   * Ylityksen huipulla pieni pysähdys ennen paluuta. Ilman sitä ylitys
   * olisi terävä kärki eikä korjausliike: käsi huomaa menneensä yli
   * vasta pysähdyttyään.
   */
  pisteet.push({ aika: liikeAika + paluu * 0.25, etenema: 1 + ylitys });
  pisteet.push({ aika: 1, etenema: 1 });
  return { pisteet, ylitys };
}

/**
 * Nykäisyt CSS:n linear()-pehmentimeksi.
 *
 * Muoto on `linear(0, 0.39 22%, 0.39 31%, …, 1)`: arvo on etenemä ja
 * prosentti sen ajankohta. Selain interpoloi pisteiden välit suoraan,
 * joten sama etenemä kahdesti peräkkäin ON pysähdys.
 */
export function nykaisyKaari(arvonta = Math.random) {
  const { pisteet } = arvoNykaisyt(arvonta);
  const osat = pisteet.map(({ aika, etenema }, i) => {
    const arvo = Math.round(etenema * 1000) / 1000;
    // Ensimmäinen ja viimeinen saavat oletusajankohtansa (0 % ja 100 %).
    if (i === 0 || i === pisteet.length - 1) return String(arvo);
    return `${arvo} ${Math.round(aika * 1000) / 10}%`;
  });
  return `linear(${osat.join(', ')})`;
}

/**
 * Lukittumisen ylitys pikseleinä: mihin nauha käy ennen kuin asettuu.
 *
 * Etumerkki on vastakkainen kuin lähtökohdan, koska ylitys on kohteen
 * TOISELLA puolella: hakuvaiheesta vasemmalta tuleva nauha käy hitusen
 * oikealla ja palaa.
 */
export function lukonYlitys(lahto, arvonta = Math.random) {
  const koko = valilta(arvonta, NYKAISYN_RAJAT.lukonYlitys);
  const suunta = Number(lahto) > 0 ? -1 : 1;
  return Math.round(suunta * koko * 10) / 10;
}

/*
 * ══════════════════════════════════════════════════════════════════════
 * VU-MITTARI
 * ══════════════════════════════════════════════════════════════════════
 *
 * Mittari on laitteen ainoa osa, joka liikkuu ilman että pelaaja koskee
 * siihen, ja juuri se tekee kotelosta laitteen eikä kuvan. Kaikki tämän
 * osan luvut ovat täällä yhdessä, koska ne ovat toistensa kanssa
 * sopusoinnussa: asteikon kaari, neulan pituus ja kääntökulma on
 * mitoitettu samaan piirustukseen (MITTARIN_KUVA), eikä yhtä voi
 * muuttaa katsomatta muita.
 */

/*
 * Mittarin piirustus. Yksiköt ovat SVG:n omia; CSS venyttää koko
 * kuvan elementin kokoiseksi, joten kaikki osat pysyvät suhteessa
 * toisiinsa myös kapealla ruudulla.
 *
 * NAPA ON KORTIN SISÄLLÄ EIKÄ SEN ALLA. Oikeassa mittarissa akselin
 * kohta näkyy: siinä on pieni kupu ja sen alla vastapaino. Jos napa
 * piilotetaan kortin alareunan alle, neula näyttää nousevan kotelosta
 * eikä kääntyvän — ja silloin se on osoitin, ei mittari.
 */
const MITTARIN_KUVA = Object.freeze({
  leveys: 112,
  korkeus: 80,
  napaX: 56,
  napaY: 76,
  /*
   * Asteikkokaaren säde navasta. Neula ulottuu hitusen kaaren yli,
   * kuten oikeassa laitteessa: kaaren alle jäävä kärki jättää lukeman
   * arvailun varaan.
   *
   * SÄDE JA KULMA RATKAISTIIN YHDESSÄ, EI SILMÄMÄÄRÄISESTI. Kaaren on
   * levittävä yli kahden kolmasosan kortin leveydestä — kapea kaari
   * matalassa ikkunassa näyttää siltä, että mittari on liian iso
   * aukolleen — mutta sen korkeus on samalla rajattu, koska yläpuolelle
   * jää vielä mahduttava jaotus ja luvut. Puolikas leveys on R·sin θ ja
   * korkeus R(1 − cos θ), joten 40 ja 20 yksikköä antavat θ ≈ 48° ja
   * R ≈ 54. Ensimmäinen kokeilu (R 40, θ 32°) täytti kortista 38 %, ja
   * juuri se näytti väärältä.
   */
  kaari: 54,
  neula: 58,
  kulma: 48,
});

/*
 * ASTEIKON JAOT. Osuus on paikka kaarella (0 = vasen laita, 1 = oikea),
 * ja luvut ovat oikean VU-asteikon omat: jako ei ole tasavälinen vaan
 * tihenee oikealle, koska asteikko on desibeliasteikko.
 *
 * NOLLA ON KOHDASSA 0,76 eikä keskellä. Se on koko mittarin lukuohje:
 * vasemmalla on varaa, oikealla on punainen, ja nolla on se raja, jonka
 * yli äänen ei pitäisi jatkuvasti käydä. Keskelle asetettu nolla
 * näyttäisi siltä että laite on säädetty väärin.
 */
const MITTARIN_JAOT = Object.freeze([
  { osuus: 0, pitka: true, teksti: '-20' },
  { osuus: 0.28, pitka: true },
  { osuus: 0.38, pitka: false },
  { osuus: 0.46, pitka: true, teksti: '-5' },
  { osuus: 0.56, pitka: false },
  { osuus: 0.61, pitka: false },
  { osuus: 0.67, pitka: false },
  { osuus: 0.76, pitka: true, teksti: '0', punainen: true },
  { osuus: 0.85, pitka: false, punainen: true },
  { osuus: 0.93, pitka: false, punainen: true },
  { osuus: 1, pitka: true, teksti: '+3', punainen: true },
]);

/** Mistä kohtaa punainen alue alkaa. Sama kuin nollan paikka. */
const MITTARIN_PUNAINEN = 0.76;

/*
 * NEULAN LEPOPAIKKA, hitusen nollan yläpuolella.
 *
 * Oikea mittari ei lepää mekaanisessa nollassaan: jousi jättää neulan
 * juuri irti vasteesta, ja tuo pieni rako on se, mistä toimivan
 * laitteen erottaa jumittuneesta. Nollaan asti painettu neula näyttää
 * siltä että se on jäänyt kiinni vasteeseen.
 */
const MITTARIN_LEPO = 0.045;

/*
 * VAIMENNUS. Nousu nopea, lasku hidas — juuri niin kuin VU-mittarissa,
 * jonka koko olemassaolon syy on se, ettei se seuraa ääntä tarkasti.
 *
 * Aikavakiot ovat eksponentiaalisen suodattimen τ sekunteina. Täyteen
 * lukemaan (99 %) mennään 4,6 τ:ssa, joten 0,065 s on noin 300 ms —
 * standardin VU-mittarin nousuaika. Lasku on viisi kertaa hitaampi:
 * tarkasti seuraava neula näyttää digitaaliselta piikkimittarilta, ja
 * juuri se ero on se, minkä takia tähän valittiin VU eikä PPM.
 */
const MITTARIN_NOUSU_S = 0.065;
const MITTARIN_LASKU_S = 0.34;

/*
 * Vaisumman liikkeen aikavakiot (prefers-reduced-motion).
 *
 * Neulaa EI sammuteta kokonaan, toisin kuin asteikon heilunta
 * (css/radio.css radio-haku). Syy on se, mitä kumpikin liike kertoo:
 * heilunta on koristetta, jonka viesti tulee perille näytöstä ja
 * lampusta joka tapauksessa, mutta mittari on laitteen ainoa tieto
 * äänen voimakkuudesta — pysähtynyt neula ei ole rauhallinen vaan
 * rikki. Liike hidastetaan sen sijaan niin, että se on ajautumista
 * eikä värinää.
 */
const MITTARIN_VAISU_NOUSU_S = 0.5;
const MITTARIN_VAISU_LASKU_S = 1.1;

/*
 * ASTEIKON PÄÄT DESIBELEINÄ, MITATTU eikä arvattu.
 *
 * Viritysääni on mitoitettu pelin masteriketjussa RMS −32 dBFS:ään
 * (js/linssit/viritin.js ULOSTULON_TASO), ja mittari lukee juuri sitä
 * summaa. Mitattu selaimesta 4.8.2026 kahdella arvotulla nauhalla,
 * kuuden sekunnin viritys kummallakin:
 *
 *   tasainen kohina   RMS −34,6 … −31,3 dBFS
 *   tungoksinen kaista  RMS −36,7 … −25,5 dBFS (asemien vilahdukset)
 *
 * Näillä päillä (−48 … −20 dB) neula lepää kohinassa juuri nollan
 * alapuolella ja käy vilahduksissa punaisella — eli näyttää samalta
 * kuin aikakauden laitteessa, jossa 0 VU oli tavoite eikä katto.
 * Leveämpi asteikko (−52 … −18) mitattiin ensin, mutta se puristi
 * tasaisen kohinan viiden asteen heilahdukseksi: neula oli oikeassa
 * mutta näytti jumittuneelta.
 *
 * Jos viritysäänen tasoa muutetaan, MITTAA NÄMÄ UUDELLEEN. Väärin
 * asetettuna neula joko makaa vasteessa tai seisoo punaisella, ja
 * kumpikin näyttää rikkinäiseltä laitteelta.
 */
const MITTARIN_POHJA_DB = -48;
const MITTARIN_KATTO_DB = -20;

/*
 * Neulan päivitysväli millisekunteina.
 *
 * TÄMÄ ON POIKKEUS SÄÄNTÖÖN "EI JATKUVIA ANIMAATIOITA KARTAN PÄÄLLÄ"
 * (css/radio.css tiedoston alku), ja poikkeus on maksettava. Kolme
 * asiaa pitää hinnan kurissa:
 *
 *  1. Silmukka pyörii vain kun radio virittää tai soi. Sammuksissa,
 *     virhetilassa ja neulan levättyä silmukka pysähtyy kokonaan.
 *  2. Päivitys on transform yhdelle pikkuruiselle elementille — ei
 *     asettelua, ei uudelleenpiirtoa kartalle.
 *  3. Kolmekymmentä kertaa sekunnissa riittää: mittarin neula on
 *     vaimennettu, eikä sen liikkeessä ole mitään, mitä kuudenkymmenen
 *     kuvan tahti näyttäisi tarkemmin.
 */
const MITTARIN_VALI_MS = 33;
const MITTARIN_VAISU_VALI_MS = 160;

/*
 * HILJAISEN LAITTEEN VALVONTA.
 *
 * Radio voi olla 'soi'-tilassa ilman että mittari näkee mitään: suoran
 * lähetyksen taso ei ole mitattavissa (ks. tiedoston alku), asema voi
 * olla hiljaa, ja pelaaja on voinut mykistää pelin. Silloin neula
 * makaa levossa, mutta silmukka jäisi pyörimään koko lähetyksen ajan —
 * minuutteja kartan päällä, mikä on juuri se, mitä css/radio.css
 * kieltää.
 *
 * Kahden sekunnin hiljaisuuden jälkeen tahti putoaa neljään katsaukseen
 * sekunnissa. Se ei enää ole animaatio vaan valvonta, ja kun ääni
 * palaa, neula on liikkeellä neljännessekunnissa — nopeammin kuin
 * korva ehtii ihmetellä.
 */
const MITTARIN_HILJAISUUS_MS = 2000;
const MITTARIN_ODOTUS_MS = 250;

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
 *
 * PATINOITU 4.8.2026 (omistaja: "yleisilme radiossa saisi olla
 * kuluneempi"). Vanha kromi oli peilikirkas: puhtaasta valkoisesta
 * (#ffffff) lähes mustaan. Yhdeksänkymmenen vuoden kromissa on ohut
 * himmentymä, joka syö heijastuksen ääripäät — vaalein sävy ei ole enää
 * valkoinen vaan kellertävä harmaa, ja tummin on harmaa eikä musta.
 *
 * SÄVYN SIIRTO ON PIENI JA KYLMÄSTÄ LÄMPIMÄÄN, noin kolme yksikköä
 * vihreää yli sinisen. Enemmän olisi keltaista messinkiä, ei
 * himmentynyttä kromia. VUOROTTELUJEN MÄÄRÄ EI MUUTTUNUT: juuri se on
 * se, mikä erottaa kromin harmaasta muovista (ks. yllä), ja himmeäkin
 * peili on peili.
 */
const KROMIN_RAIDAT = [
  [0, '#e9ece9'], [0.11, '#bbc2c1'], [0.22, '#5b625f'], [0.34, '#e0e4dd'],
  [0.46, '#f4f6f0'], [0.57, '#8f9591'], [0.7, '#4a504c'], [0.82, '#c9cfc7'],
  [1, '#6b706b'],
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
  [0, '#4b514d'], [0.22, '#f2f4ee'], [0.5, '#959b96'],
  [0.72, '#434944'], [1, '#b6bcb4'],
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
  const kulmat = `${tunniste}-kulmat`;
  const mutteri = `${tunniste}-mutteri`;
  const kiilto = `${tunniste}-kiilto`;
  return `<svg class="radio-kytkin-kuva" viewBox="0 0 40 66" width="30" height="49.5"
      aria-hidden="true" focusable="false">
    <defs>
      ${kromiLiuku(kromiP, 'pysty')}
      ${kromiLiuku(kromiV, 'vaaka')}
      ${kromiLiuku(varsi, 'vaaka', VARREN_RAIDAT)}
      <!-- Kulmien kiilto: valkoinen ydin, joka sammuu reunalle. Sama
           kuvio kuudessa kärjessä, ks. mutterin patina alempana. -->
      <radialGradient id="${kulmat}" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.6"/>
        <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.22"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
      <!-- Kiilto rajataan mutteriin: kärkien yli vuotava valo osuisi
           puuhun, ja siellä se lukisi tahrana eikä metallina. -->
      <clipPath id="${mutteri}">
        <path d="M8 33 L14 22.4 L26 22.4 L32 33 L26 43.6 L14 43.6 Z"/>
      </clipPath>
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
      <!--
        VIVUN KÄRKI ON KIILLOTTUNUT. Kytkintä käännetään kärjestä, ja
        sormenpää kiillottaa juuri sen kohdan — sama sääntö kuin
        mutterin kärjissä, mutta vastakkaiseen suuntaan: mutteria
        naarmuttaa avain ja himmentää, vipua kiillottaa sormi ja
        kirkastaa. Liuku on vivun omassa suunnassa (pituudella), joten
        se kääntyy vivun mukana eikä jää ylös silloin, kun kytkin on
        alhaalla.
      -->
      <linearGradient id="${kiilto}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.42"/>
        <stop offset="0.3" stop-color="#ffffff" stop-opacity="0.14"/>
        <stop offset="0.72" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
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

    <!--
      MUTTERIN PATINA JA KULMIEN KIILTO (omistajan toive 4.8.2026:
      "kuusiomutterin kulmat ovat kirkkaammat kuin sivut").

      Näin kulunut mutteri oikeasti on. Avain tarttuu lappeisiin ja
      naarmuttaa ne mataksi; kärkiin se ei ylety, ja niissä kromi on
      yhä kirkas. Kaksi vetoa: ensin himmeä harso koko mutterin yli,
      sitten kuusi pistettä kärkiin. Pelkkä harso teki mutterista
      lyijynharmaan, ja pelkät pisteet näyttivät valopilkuilta.
    -->
    <g clip-path="url(#${mutteri})">
      <path d="M8 33 L14 22.4 L26 22.4 L32 33 L26 43.6 L14 43.6 Z"
        fill="#8b8a72" opacity="0.16"/>
      <g fill="url(#${kulmat})">
        <circle cx="9.4" cy="33" r="3.6"/>
        <circle cx="14.6" cy="23.4" r="3.2"/>
        <circle cx="25.4" cy="23.4" r="3.2"/>
        <circle cx="30.6" cy="33" r="3.6"/>
        <circle cx="25.4" cy="42.6" r="3.2"/>
        <circle cx="14.6" cy="42.6" r="3.2"/>
      </g>
    </g>

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
      <!-- Sormen kiillottama kärki, ks. gradientti ${kiilto}. Sama
           muoto kuin varsi, jotta kiilto ei vuoda reunan yli. -->
      <path d="M16.2 32.4 L17.4 10.2 Q20 6 22.6 10.2 L23.8 32.4 Z"
        fill="url(#${kiilto})"/>
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

/** Piste mittarin navasta: kulma asteina (0 = suoraan ylös) ja säde. */
function mittarinPiste(kulma, sade) {
  const kaari = (kulma * Math.PI) / 180;
  return [
    MITTARIN_KUVA.napaX + Math.sin(kaari) * sade,
    MITTARIN_KUVA.napaY - Math.cos(kaari) * sade,
  ];
}

/** Osuus kaarella (0–1) asteina. */
function mittarinKulma(osuus) {
  return (osuus * 2 - 1) * MITTARIN_KUVA.kulma;
}

/**
 * VU-MITTARIN ASTEIKKO SVG:NÄ: kermanvärinen kortti, musta kaari,
 * punainen alue oikeassa laidassa ja jaotus lukuineen.
 *
 * Kortti itse on CSS:ssä (css/radio.css .radio-mittari), koska juuri
 * siihen kuuluu kuluneisuus — kellastuminen ja lasin naarmut ovat
 * pinnan asioita, ja ne tehdään liukuväreinä muun kotelon tapaan. Täällä
 * on vain painojälki: se, mikä korttiin on aikanaan painettu.
 *
 * NEULA EI OLE TÄSSÄ SVG:SSÄ. Se on oma elementtinsä, jota käännetään
 * pelkällä transformilla — silloin liike on selaimelle kompositointia
 * eikä uudelleenpiirtoa, ja kartta kotelon takana pysyy koskematta.
 * SVG-attribuutin muuttaminen kolmekymmentä kertaa sekunnissa olisi
 * saman kuvan piirtämistä uudelleen joka kerta.
 */
function mittarinSvg(tunniste) {
  const { leveys, korkeus, napaX, napaY, kaari, kulma } = MITTARIN_KUVA;
  const napanKupu = `${tunniste}-napa`;
  const [ax, ay] = mittarinPiste(-kulma, kaari);
  const [bx, by] = mittarinPiste(kulma, kaari);
  // Punaisen alueen kaari kulkee mustan kaaren yläpuolella omana
  // nauhanaan: aikakauden kortissa punainen on painettu asteikon
  // päälle eikä sen tilalle, ja jaotus jatkuu sen alla.
  const [px, py] = mittarinPiste(mittarinKulma(MITTARIN_PUNAINEN), kaari + 4.6);
  const [qx, qy] = mittarinPiste(kulma, kaari + 4.6);

  const jaot = MITTARIN_JAOT.map((jako) => {
    const aste = mittarinKulma(jako.osuus);
    const [x1, y1] = mittarinPiste(aste, kaari);
    const [x2, y2] = mittarinPiste(aste, kaari + (jako.pitka ? 3 : 1.7));
    const vari = jako.punainen ? '#8d2b1d' : '#241a10';
    const viiva = `<path d="M${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)}"`
      + ` stroke="${vari}" stroke-width="${jako.pitka ? 1.1 : 0.75}" stroke-linecap="round"/>`;
    if (!jako.teksti) return viiva;
    /*
     * Luvun paikka on kaaren keskilinjalla, mutta SVG lataa tekstin
     * PERUSVIIVALLE. dominant-baseline hoitaisi eron yhdellä
     * attribuutilla, mutta se on iOS:n Safarissa uudehko — vanhemmalla
     * versiolla luvut valuisivat pari pikseliä alas jaotuksen päälle.
     * Puolikas versaalikorkeus (0,35 × kirjasinkoko) on sama korjaus
     * ilman selainriippuvuutta.
     */
    const [tx, ty] = mittarinPiste(aste, kaari + 9.5);
    return `${viiva}<text x="${tx.toFixed(2)}" y="${(ty + 1.75).toFixed(2)}" fill="${vari}"`
      + ` font-size="5" text-anchor="middle">${jako.teksti}</text>`;
  }).join('');

  return `<svg class="radio-mittari-asteikko" viewBox="0 0 ${leveys} ${korkeus}"
      preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="${napanKupu}" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stop-color="#e6e9e6"/>
        <stop offset="0.5" stop-color="#8d9490"/>
        <stop offset="1" stop-color="#2d3230"/>
      </radialGradient>
    </defs>
    <!-- Asteikkokaari. Yksi veto, ei jaotusta: kaari on se viiva, jota
         vasten neulan kärki luetaan. -->
    <path d="M${ax.toFixed(2)} ${ay.toFixed(2)} A ${kaari} ${kaari} 0 0 1 ${bx.toFixed(2)} ${by.toFixed(2)}"
      fill="none" stroke="#241a10" stroke-width="0.9" stroke-linecap="round"/>
    <!-- Punainen alue nollasta ylöspäin. -->
    <path d="M${px.toFixed(2)} ${py.toFixed(2)} A ${(kaari + 3.4).toFixed(2)} ${(kaari + 3.4).toFixed(2)} 0 0 1 ${qx.toFixed(2)} ${qy.toFixed(2)}"
      fill="none" stroke="#8d2b1d" stroke-width="1.7" stroke-linecap="butt" opacity="0.82"/>
    ${jaot}
    <!-- Kilpi kortin alalaidassa. "VU" on se kaksi kirjainta, joista
         mittarin tunnistaa ennen kuin asteikkoa ehtii lukea. -->
    <text x="${(napaX - 26).toFixed(2)}" y="${(napaY - 0.5).toFixed(2)}" fill="#3a2a18"
      font-size="6" text-anchor="middle" font-weight="700" letter-spacing="0.8">VU</text>
    <!-- Akselin kupu ja sen varjo kortilla. Vastapaino jää kuvun alle,
         kuten oikeassa liikkeessä. -->
    <ellipse cx="${napaX}" cy="${(napaY + 1.6).toFixed(2)}" rx="6.4" ry="2.6"
      fill="#2a1d10" opacity="0.16"/>
    <circle cx="${napaX}" cy="${napaY}" r="4.2" fill="url(#${napanKupu})"
      stroke="rgba(0,0,0,0.45)" stroke-width="0.5"/>
  </svg>`;
}

/**
 * VU-MITTARI: ikkuna kotelossa, asteikkokortti, neula ja lasi.
 *
 * Kolme kerrosta samassa järjestyksessä kuin oikeassa laitteessa —
 * kortti pohjalla, neula sen päällä ja lasi kaiken yllä. Lasi on oma
 * elementtinsä eikä kortin varjo, koska sillä on omat naarmunsa ja
 * heijastuksensa: ne kuuluvat lasiin eivätkä painojälkeen, ja neulan on
 * kuljettava niiden ALLA.
 */
function teeMittari(tunniste) {
  const kehys = osa('div', 'radio-mittari');
  kehys.setAttribute('aria-hidden', 'true');
  kehys.innerHTML = mittarinSvg(tunniste);
  const neula = osa('span', 'radio-mittari-neula');
  kehys.appendChild(neula);
  kehys.appendChild(osa('span', 'radio-mittari-lasi'));
  return { kehys, neula };
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
 *   arvonta                — satunnaislähde nauhan nykäisyille (oletus
 *                            Math.random). Vain testejä ja demoja varten:
 *                            siemennetty lähde antaa saman liikkeen
 *                            joka kerta, ks. arvoNykaisyt.
 *
 * Palauttaa:
 *   juuri                  — elementti, jonka kutsuja liittää haluamaansa
 *                            paikkaan (soitin asemoi itsensä alalaitaan).
 *   naytaKanava(tiedot)    — { asema, maa, kaupunki, cityId, naytto } tai null.
 *                            `naytto` on valinnainen lyhennetty nimi
 *                            pistenäytölle, ks. rivit(). `cityId` keskittää
 *                            asteikon soivaan kaupunkiin.
 *   asetaTila(tila, viesti)
 *   asetaVirityksenVaihe(vaihe) — 'siirtyma' | 'haku' | 'lukittuu' | null.
 *                            Kertoo nauhalle, MITEN uudelle asemalle
 *                            siirrytään. Ks. VIRITYKSEN_VAIHEET.
 *   asetaNaytto(elementti) — pistematriisinäyttö aukkoon.
 *   asetaAani(arvo)
 *   asetaAanilahde(lahde) — VU-mittarin äänilähde. Oletuksena laite
 *                           kuuntelee pelin omaa äänisummaa; tällä
 *                           kutsuja voi antaa oman virtansa.
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
  arvonta = Math.random,
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

  /*
   * ÄÄNENVOIMAKKUUDEN NUPPI POISTETTU (omistajan päätös 4.8.2026:
   * "jätä äänenvoimakkuuden säätönappi pois, se on turha").
   *
   * Se oli turha kahdesta syystä. Pelissä on jo oma äänisäätönsä
   * (js/sound.js), johon radio tottelee, ja laitteen oma nuppi
   * tarjosi toisen totuuden samasta asiasta. Toiseksi se vei tilaa
   * juuri siitä laidasta, jossa kytkimet ja merkkivalo tarvitsevat
   * ilmaa.
   *
   * asetaAani() ja onAani jäävät rajapintaan: kutsuja säätää
   * voimakkuutta yhä, mutta laitteessa ei ole sille kahvaa. Sama
   * arvo ohjaa yhä soittoa.
   */

  /*
   * --- VU-mittari vasempaan laitaan ------------------------------------
   *
   * Paikka on se, joka nupilta jäi. Aikakauden pöytäradiossa mittari oli
   * juuri tässä: vasemmalla oma ikkunansa, keskellä asteikko ja oikealla
   * käyttökytkimet. Mittari on myös se osa, jota katsotaan kuunnellessa
   * eikä säätäessä, joten se saa olla kauimpana sormista.
   */
  const mittari = teeMittari(tunniste);
  kotelo.appendChild(mittari.kehys);

  // --- kaiutinsäleikkö -------------------------------------------------
  // Kangas ja sen päälle listat tehdään kokonaan CSS-kuvioina: kuvatiedosto
  // olisi yksi lisälataus siitä, mikä on kaksi toistuvaa gradienttia.
  const kaiutin = osa('div', 'radio-kaiutin');
  kaiutin.setAttribute('aria-hidden', 'true');
  // Kilpi on soittimen valmistajan nimi, ja se on pelin oma nimi.
  kaiutin.appendChild(osa('span', 'radio-kilpi', 'UNOHDETTU AARRE'));
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
  // Virityksen vaihe ja nauhan liukumatka pikseleinä, ks. laskeLiuku ja
  // asetaVirityksenVaihe. Molemmat ovat merkityksellisiä vain
  // 'virittaa'-tilassa.
  let virityksenVaihe = null;
  let liuunMatka = 0;

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
    // Tunnus talteen myös DOM:iin: liu'un matka mitataan nimien
    // paikoista ennen ja jälkeen uudelleenpiirron (ks. laskeLiuku).
    nappi.dataset.id = String(kaupunki.id);
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

  /**
   * Nimien keskikohdat asteikolla juuri nyt: id → x pikseleinä.
   *
   * Mitataan ENNEN uudelleenpiirtoa, koska juuri siitä liu'un matka
   * syntyy: uusi keskus oli hetki sitten jossain, ja nauhan on
   * liu'uttava tuosta kohdasta viisarin alle.
   */
  function nimienPaikat() {
    const paikat = new Map();
    for (const nappi of nimet.querySelectorAll('.radio-kaupunki')) {
      paikat.set(nappi.dataset.id, nappi.offsetLeft + nappi.offsetWidth / 2);
    }
    return paikat;
  }

  /**
   * Liu'un matka pikseleinä: mistä nauha lähtee, kun se päätyy nollaan.
   *
   * Etumerkki on nauhan suunta eikä aseman: idässä oleva asema on
   * viisarin oikealla puolella, joten nauha ALKAA oikealta (+) ja
   * liukuu vasemmalle nollaan. Sama luku syntyy molemmista säännöistä,
   * joten mitatun ja arvatun matkan välillä ei ole suuntaeroa.
   */
  function laskeLiuku(vanhatPaikat, vanhaKeskus, uusiKeskus) {
    if (!uusiKeskus) return 0;
    /*
     * Uusi paikka luetaan samasta taulukosta kuin vanha eikä
     * valitsimella. CSS.escape olisi lyhyempi, mutta kaupungin tunnus
     * tulee laudan aineistosta — merkkijonosta, jota tämä tiedosto ei
     * ole kirjoittanut — eikä valitsimen jäsennysvirhe saa kaataa koko
     * asteikon piirtoa yhden liu'un takia.
     */
    const uusiX = nimienPaikat().get(uusiKeskus) ?? null;
    // 1. Uusi asema näkyi nauhalla: matka on mitattavissa suoraan.
    const vanhaX = vanhatPaikat.get(uusiKeskus);
    if (Number.isFinite(vanhaX) && Number.isFinite(uusiX)) {
      const matka = vanhaX - uusiX;
      if (Math.abs(matka) >= LIUUN_VAHIN) return matka;
      // Sama tai lähes sama paikka: nytkähdys, ks. LIUUN_VAHIN.
      return matka < 0 ? -LIUUN_VAHIN : LIUUN_VAHIN;
    }
    // 2. Kartalta valittu kaupunki: suunta laudalta, matka vakio.
    const varamatka = Math.max(LIUUN_VAHIN, asteikko.offsetWidth * LIUUN_VARAMATKA);
    const vanha = asteikonKaupungit.get(vanhaKeskus);
    const uusi = asteikonKaupungit.get(uusiKeskus);
    if (!vanha || !uusi) return varamatka;
    // dx > 0 = uusi asema on idässä eli viisarin oikealla puolella.
    return ero(vanha, uusi, kierto).dx < 0 ? -varamatka : varamatka;
  }

  /** Piirtää asteikon uudelleen nykyiselle keskukselle. */
  function paivitaAsteikko() {
    const vanhatPaikat = nimienPaikat();
    const vanhaKeskus = keskusId;
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
    /*
     * Liu'un matka talteen, käytettäköön tai ei. Se on laskettava
     * TÄSSÄ, koska vanhat paikat ovat olemassa vain tämän kutsun ajan;
     * 'siirtyma'-vaihe saapuu vasta seuraavalla rivillä radio.js:ssä,
     * jolloin vanha asettelu on jo poissa. Ilman kanavanvaihtoa
     * tehdyssä piirrossa (laudan vaihto, sijainnin päivitys) luku jää
     * käyttämättä eikä nauha liiku.
     */
    liuunMatka = laskeLiuku(vanhatPaikat, vanhaKeskus, keskusId);
  }

  /**
   * VIRITYKSEN VAIHE KUORELLE. Kutsuu js/linssit/radio.js, ks.
   * VIRITYKSEN_VAIHEET.
   *
   * Kaikki liike on css/radio.css:ssä; täällä kerrotaan vain, mikä
   * vaihe on menossa (juuren data-vaihe) ja mistä kohtaa nauha lähtee
   * tai mihin se jää (kaksi mukautettua ominaisuutta). Sama työnjako
   * kuin muuallakin laitteessa: JS tietää tilan, CSS tietää miltä se
   * näyttää.
   *
   * null lopettaa sarjan. Sen tekee asetaTila() itse aina kun laite
   * poistuu 'virittaa'-tilasta — kuori ei jää heilumaan siksi, että
   * kutsuja unohti kertoa lopusta.
   */
  function asetaVirityksenVaihe(vaihe) {
    const uusi = VIRITYKSEN_VAIHEET.includes(vaihe) ? vaihe : null;
    if (!uusi) {
      virityksenVaihe = null;
      delete juuri.dataset.vaihe;
      return null;
    }

    if (uusi === 'siirtyma') {
      // Nauha lähtee sieltä, missä uusi asema äsken oli (laskeLiuku), ja
      // päätyy nollaan eli viisarin alle.
      juuri.style.setProperty('--radio-liuku', `${Math.round(liuunMatka)}px`);
      /*
       * Nykäisyt arvotaan JOKA LIUULLE UUDELLEEN: sama ote kahdesti
       * peräkkäin ei ole käden liikettä vaan silmukka. Pehmennin on
       * mukautetussa ominaisuudessa, jotta liu'un kesto ja avainkehykset
       * pysyvät css/radio.css:n omina, ks. NYKAISYN_RAJAT.
       */
      juuri.style.setProperty('--radio-liuku-kaari', nykaisyKaari(arvonta));
    } else if (uusi === 'lukittuu') {
      /*
       * Asettuminen alkaa siitä, mihin haku sattui jäämään. Ilman
       * mittausta nauha napsahtaisi ensin nollaan ja vasta sitten
       * "asettuisi" — eli tekisi juuri sen nykäisyn, jonka poistamiseksi
       * koko vaihe on olemassa.
       */
      const lahto = nauhanSiirto();
      juuri.style.setProperty('--radio-lukko', `${lahto}px`);
      // Viimeinen kohdistus käy hitusen yli ja palaa, ks. lukonYlitys.
      juuri.style.setProperty('--radio-lukko-yli', `${lukonYlitys(lahto, arvonta)}px`);
    }

    /*
     * SAMA VAIHE UUDELLEEN ON KÄYNNISTETTÄVÄ KÄSIN. Kesken virityksen
     * valittu uusi kaupunki aloittaa sarjan alusta ('siirtyma' →
     * 'siirtyma'), eikä selain käynnistä animaatiota uudelleen, jos
     * valitsin ja animaation nimi pysyvät samoina — nauha jäisi
     * liukumaan vanhaa matkaansa loppuun uudella nimistöllä. Poisto,
     * pakotettu asettelunluku ja palautus on ainoa tapa, joka toimii
     * kaikissa selaimissa. Hinta on yksi asettelu kanavanvaihtoa kohti,
     * ja sellainen tehdään tässä samassa silmänräpäyksessä jo muutenkin
     * (siirraViisari mittaa nimien paikat).
     */
    if (virityksenVaihe === uusi) {
      nimet.style.animation = 'none';
      void nimet.offsetWidth;
      nimet.style.animation = '';
    }
    virityksenVaihe = uusi;
    juuri.dataset.vaihe = uusi;
    return uusi;
  }

  /**
   * Nauhan nykyinen vaakasiirto pikseleinä.
   *
   * Matriisi luetaan merkkijonosta eikä DOMMatrixilla: kysely tehdään
   * kerran virityksessä, ja käsin poimittu neljäs luku toimii myös
   * niissä selaimissa, joissa DOMMatrixia ei ole. Tunnistamaton muoto
   * on nolla — silloin asettuminen alkaa keskeltä, mikä on väärin mutta
   * vain hiuksenhienosti.
   */
  function nauhanSiirto() {
    const muunnos = getComputedStyle(nimet).transform;
    if (!muunnos || muunnos === 'none') return 0;
    const luvut = muunnos.slice(muunnos.indexOf('(') + 1, -1).split(',').map(Number);
    // matrix(a, b, c, d, tx, ty) ja matrix3d(...): tx on kuudes tai 13.
    const tx = luvut.length === 6 ? luvut[4] : luvut[12];
    return Number.isFinite(tx) ? Math.round(tx * 10) / 10 : 0;
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
    /*
     * Vaihesarja päättyy tilan mukana. Kutsuja kertoo alun ja keskikohdan
     * (radio.js kerroVaihe) mutta ei loppua — lopun tietää tila, ja se on
     * oikea paikka: keskeytynyt viritys, virhe ja aikakatkaisu päättyvät
     * kaikki tänne, eikä yhdenkään varassa saa olla, että joku muistaa
     * sammuttaa nauhan liikkeen erikseen.
     */
    if (uusi !== 'virittaa') asetaVirityksenVaihe(null);
    // Mittari seuraa samaa tilaa: neula elää vain kun laite tekee
    // ääntä, ja palaa muulloin lepoon omaa vauhtiaan.
    paivitaMittari();

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
    // Nuppia ei enää ole; arvo elää vain kutsujan ja soiton välillä.
    if (kerro) {
      try {
        onAani?.(uusi);
      } catch (syy) {
        console.warn('Radiosoittimen äänenvoimakkuuden välitys epäonnistui.', syy);
      }
    }
    return uusi;
  }

  // --- VU-mittarin koneisto ---------------------------------------------
  /*
   * Mittarin kolme osaa: LÄHDE (mistä taso luetaan), VAIMENNUS (miten
   * neula seuraa sitä) ja SILMUKKA (milloin sitä ylipäänsä lasketaan).
   *
   * Lähde on vaihdettavissa, koska laite ei tiedä eikä saa tietää, mikä
   * kulloinkin soi. Oletuksena se kuuntelee pelin omaa äänisummaa —
   * siellä kulkee viritysääni — mutta kutsuja voi antaa oman lähteensä,
   * ks. asetaAanilahde.
   */
  let mittarinLukija = null;     // kutsujan antama lähde funktioksi käärittynä
  let lahteenSolmut = [];        // kutsujan lähteelle luodut solmut, purettavaksi
  let analysoija = null;         // oma analysaattori pelin äänisummassa
  let analyysinPuskuri = null;
  let mittarinPaate = null;      // vaimennettu pääte, ks. varmistaAnalysoija
  let neulanLukema = MITTARIN_LEPO;
  let neulanKulma = null;        // viimeksi kirjoitettu kulma
  let mittarinVuoro = 0;         // requestAnimationFrame-tunnus
  let mittarinAjastin = 0;       // setTimeout-tunnus hiljaisessa valvonnassa
  let mittariKay = false;
  let mittarinKello = 0;
  let hiljaisuus = 0;            // kauanko neula on maannut levossa, ms

  /*
   * Vaisumman liikkeen kysely tehdään kerran. matchMedia palauttaa
   * elävän olion, jonka `matches` seuraa asetusta itsestään — uutta
   * kyselyä ei siis tarvita joka kehyksellä.
   */
  const vaisuKysely = typeof matchMedia === 'function'
    ? matchMedia('(prefers-reduced-motion: reduce)')
    : null;

  /** Asteikon rajoihin, ja pohjaksi aina neulan lepopaikka. */
  function rajaaLukema(arvo) {
    if (!Number.isFinite(arvo)) return MITTARIN_LEPO;
    return Math.min(1, Math.max(MITTARIN_LEPO, arvo));
  }

  /** Puskuri analysaattorin näytteille: liukuluvut, jos selain osaa. */
  function analyysiPuskurille(solmu) {
    return typeof solmu.getFloatTimeDomainData === 'function'
      ? new Float32Array(solmu.fftSize)
      : new Uint8Array(solmu.fftSize);
  }

  /**
   * Hetkellinen voimakkuus analysaattorista asteikon osuutena.
   *
   * RMS eikä huippu: VU-mittari on keskiarvomittari, ja huippuarvo
   * hyppisi jokaisesta naksahduksesta. Desibeleiksi siksi, että korva
   * kuulee logaritmisesti — lineaarisella asteikolla neula makaisi
   * vasemmassa laidassa ja hypähtäisi vain kovimmista kohdista.
   *
   * TAVUPUSKURI ON VARAREITTI eikä yhtä hyvä: kahdeksan bittiä antaa
   * pienimmäksi askeleeksi noin −42 dB, ja viritysäänen taso on
   * −32 dBFS eli vain kourallinen askeleita sen yli. Liukuluvuilla
   * mitattuna neulan liike on sileä, tavuilla se portaikkoa.
   */
  function analysoijanTaso(solmu, puskuri) {
    let summa = 0;
    if (puskuri instanceof Float32Array) {
      solmu.getFloatTimeDomainData(puskuri);
      for (let i = 0; i < puskuri.length; i += 1) summa += puskuri[i] * puskuri[i];
    } else {
      solmu.getByteTimeDomainData(puskuri);
      for (let i = 0; i < puskuri.length; i += 1) {
        const nayte = (puskuri[i] - 128) / 128;
        summa += nayte * nayte;
      }
    }
    const rms = Math.sqrt(summa / puskuri.length);
    const db = 20 * Math.log10(Math.max(rms, 1e-6));
    return (db - MITTARIN_POHJA_DB) / (MITTARIN_KATTO_DB - MITTARIN_POHJA_DB);
  }

  /**
   * Liittää oman analysaattorin pelin äänisummaan, jos konteksti on jo
   * olemassa.
   *
   * MYÖHÄSSÄ EIKÄ HETI, ja se on tahallista: selain luo äänikontekstin
   * vasta pelaajan eleestä (js/sound.js ensureContext), ja soitin
   * rakennetaan ennen ensimmäistä napautusta. Siksi kytkentää yritetään
   * uudelleen joka kerta kun laite alkaa virittää tai soida — ensimmäinen
   * yritys osuu tyhjään, toinen onnistuu.
   *
   * VAIMENNETTU PÄÄTE KAIUTTIMEEN ON TARPEEN. Analysaattori on tässä
   * pelkkä haaraliitos, eikä umpikujaan päättyvä haara ole matkalla
   * mihinkään — selaimen ei ole pakko laskea sitä lainkaan. Nollan
   * vahvistus vie haaran perille lisäämättä ääneen mitään, ja se on
   * halvempi kuin arvaus siitä, mitä kukin selain sattuu tekemään.
   */
  function varmistaAnalysoija() {
    if (analysoija || mittarinLukija) return analysoija;
    const ctx = sfx?.ctx ?? null;
    const summa = sfx?.master ?? null;
    if (!ctx || !summa || typeof ctx.createAnalyser !== 'function') return null;
    try {
      const solmu = ctx.createAnalyser();
      // 1024 näytettä on 48 kHz:llä noin 21 ms eli lyhyempi kuin
      // mittarin nousuaika: ikkuna ei siis hidasta neulaa, vaan
      // vaimennus tekee sen kokonaan ja hallitusti.
      solmu.fftSize = 1024;
      const paate = ctx.createGain();
      paate.gain.value = 0;
      summa.connect(solmu);
      solmu.connect(paate).connect(ctx.destination);
      analysoija = solmu;
      mittarinPaate = paate;
      analyysinPuskuri = analyysiPuskurille(solmu);
    } catch (syy) {
      // Mittari on laitteen sielu mutta ei sen ehto: rikki mennyt
      // kytkentä jättää neulan lepoon, ja radio soi kuten ennenkin.
      console.warn('VU-mittarin kytkentä ääneen epäonnistui.', syy);
      analysoija = null;
      mittarinPaate = null;
    }
    return analysoija;
  }

  /** Irrottaa oman analysaattorin. Turvallinen kutsua kahdesti. */
  function irrotaAnalysoija() {
    for (const solmu of [analysoija, mittarinPaate]) {
      try { solmu?.disconnect(); } catch { /* jo irrotettu */ }
    }
    analysoija = null;
    mittarinPaate = null;
    analyysinPuskuri = null;
  }

  /**
   * Irrottaa kutsujan lähteelle luodut solmut.
   *
   * Nämä ovat eri kasa kuin oma analysaattori, koska ne elävät eri
   * ajan: kutsuja voi vaihtaa lähdettä kesken kaiken, ja vanha ketju
   * jäisi muuten kiinni pelaajan äänikontekstiin. Sama sääntö kuin
   * virittimen solmuilla (js/linssit/viritin.js pura).
   */
  function irrotaLahde() {
    for (const solmu of lahteenSolmut) {
      try { solmu.disconnect(); } catch { /* jo irrotettu */ }
    }
    lahteenSolmut = [];
  }

  /** Nykyinen taso 0–1, tai null jos mitattavaa ei ole. */
  function mittarinTaso() {
    if (mittarinLukija) {
      try {
        return rajaaLukema(mittarinLukija());
      } catch (syy) {
        // Rikki mennyt lähde ei jää yrittämään uudelleen kolmekymmentä
        // kertaa sekunnissa: se hylätään, ja seuraava askel kytkee
        // mittarin takaisin pelin omaan äänisummaan.
        console.warn('VU-mittarin äänilähde epäonnistui.', syy);
        mittarinLukija = null;
        irrotaLahde();
      }
    }
    if (analysoija && analyysinPuskuri) {
      return rajaaLukema(analysoijanTaso(analysoija, analyysinPuskuri));
    }
    return null;
  }

  /** Kääntää neulan. Kirjoittaa vain kun kulma oikeasti muuttui. */
  function piirraNeula() {
    const kulma = Math.round(mittarinKulma(rajaaLukema(neulanLukema)) * 10) / 10;
    if (kulma === neulanKulma) return;
    neulanKulma = kulma;
    mittari.neula.style.transform = `rotate(${kulma}deg)`;
  }

  /**
   * Yksi askel neulan liikkeessä.
   *
   * Vaimennus on kaksi riviä eksponentiaalista suodatusta, ja koko
   * mittarin luonne on niiden aikavakioissa: nousuun mennään nopeasti,
   * laskuun hitaasti. Askelpituus luetaan kellosta eikä oleteta, jotta
   * hidastunut kehysvauhti ei muuta vaimennusta — silloin neula
   * käyttäytyisi eri tavalla raskaalla kartalla kuin kevyellä.
   */
  function mittarinAskel(nyt) {
    if (!mittariKay) return;
    const vaisu = vaisuKysely?.matches === true;
    const vali = vaisu ? MITTARIN_VAISU_VALI_MS : MITTARIN_VALI_MS;
    if (!mittarinKello) mittarinKello = nyt;
    const kulunut = nyt - mittarinKello;
    if (kulunut >= vali) {
      mittarinKello = nyt;
      const soi = nykyinenTila === 'soi' || nykyinenTila === 'virittaa';
      /*
       * KYTKENTÄÄ YRITETÄÄN JOKA ASKELEELLA, EI VAIN TILANVAIHDOSSA.
       *
       * Mitattu vika 4.8.2026: neula ei liikkunut lainkaan. Syy oli
       * järjestys — js/linssit/radio.js vaihtaa tilan 'virittaa'
       * ENNEN kuin käynnistää viritysäänen, ja äänikonteksti syntyy
       * vasta siinä. Tilanvaihdoksen hetkellä sfx.ctx oli siis yhä
       * null, kytkentä jäi tekemättä eikä toista tilaisuutta tullut.
       * Yritys on kaksi kenttälukua, kun se onnistuu jo kerran.
       */
      if (soi && !mittarinLukija && !analysoija) varmistaAnalysoija();
      const mitattu = soi ? mittarinTaso() : null;
      const kohde = mitattu ?? MITTARIN_LEPO;
      const nousu = vaisu ? MITTARIN_VAISU_NOUSU_S : MITTARIN_NOUSU_S;
      const lasku = vaisu ? MITTARIN_VAISU_LASKU_S : MITTARIN_LASKU_S;
      // Sekunteina, ja katolla: taustalle jäänyt välilehti palaa
      // pitkän tauon jälkeen, eikä neula saa hypätä sen takia.
      const dt = Math.min(0.25, kulunut / 1000);
      const aikavakio = kohde > neulanLukema ? nousu : lasku;
      neulanLukema += (kohde - neulanLukema) * (1 - Math.exp(-dt / aikavakio));
      piirraNeula();

      // Levossa = kohde on lepopaikassa JA neula on ehtinyt sinne.
      const lepaa = kohde <= MITTARIN_LEPO + 0.004
        && Math.abs(neulanLukema - MITTARIN_LEPO) < 0.004;
      hiljaisuus = lepaa ? hiljaisuus + kulunut : 0;

      /*
       * Levännyt neula sammuttaa silmukan KOKONAAN, kun radio on
       * hiljaa. Tämä on se kohta, joka pitää poikkeuksen "ei jatkuvia
       * animaatioita" siedettävänä: sammuksissa olevan laitteen päällä
       * ei laske mitään.
       *
       * SOIVA RADIO EI SAMMUTA SILMUKKAA vaan hidastaa sen (ks.
       * ajastaSeuraava). Ero on siinä, palaako ääni: sammutetun
       * radion neula herää vasta tilanvaihdoksesta, joka kutsuu
       * paivitaMittari(), mutta soivan radion ääni voi palata milloin
       * tahansa ilman että mikään ilmoittaa siitä.
       */
      if (!soi && lepaa) {
        neulanLukema = MITTARIN_LEPO;
        piirraNeula();
        pysaytaMittari();
        return;
      }
    }
    ajastaSeuraava();
  }

  /**
   * Seuraava askel: kehysvauhtia liikkeessä, valvontavauhtia levossa.
   *
   * Kaksi ajastinta eikä yksi, koska ne tekevät eri työtä.
   * requestAnimationFrame on oikea silloin kun neula liikkuu — se
   * osuu ruudun päivitykseen ja pysähtyy taustavälilehdessä
   * itsestään. Hiljaisen lähetyksen aikana se olisi kuitenkin
   * kuusikymmentä turhaa herätystä sekunnissa minuuttien ajan, ja
   * silloin setTimeout neljä kertaa sekunnissa on rehellisempi:
   * mitään ei animoida, vain kuunnellaan palaako ääni.
   */
  function ajastaSeuraava() {
    if (!mittariKay) return;
    const kehyksella = hiljaisuus < MITTARIN_HILJAISUUS_MS
      && typeof requestAnimationFrame === 'function';
    if (kehyksella) {
      mittarinVuoro = requestAnimationFrame(mittarinAskel);
      return;
    }
    mittarinAjastin = setTimeout(() => {
      mittarinAjastin = 0;
      mittarinAskel(typeof performance === 'object' && performance
        ? performance.now() : Date.now());
    }, hiljaisuus >= MITTARIN_HILJAISUUS_MS ? MITTARIN_ODOTUS_MS : MITTARIN_VALI_MS);
  }

  /** Käynnistää neulan silmukan, jos se ei jo pyöri. */
  function kaynnistaMittari() {
    if (mittariKay) return;
    mittariKay = true;
    mittarinKello = 0;
    // Uusi käynnistys on aina liikettä: hiljaisuuslaskuri nollataan,
    // jotta ensimmäinen askel osuu heti eikä neljännessekunnin päähän.
    hiljaisuus = 0;
    ajastaSeuraava();
  }

  /** Pysäyttää silmukan. Neula jää siihen mihin se ehti. */
  function pysaytaMittari() {
    mittariKay = false;
    if (mittarinVuoro && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(mittarinVuoro);
    }
    if (mittarinAjastin) clearTimeout(mittarinAjastin);
    mittarinVuoro = 0;
    mittarinAjastin = 0;
  }

  /**
   * Tilanvaihdos mittarille. Silmukka käynnistetään myös sammuessa,
   * koska neulan on PALATTAVA lepoon liukuen — napsahtava paluu on
   * juuri se digitaalinen ele, jota vaimennuksella vältetään.
   */
  function paivitaMittari() {
    if (nykyinenTila === 'soi' || nykyinenTila === 'virittaa') varmistaAnalysoija();
    // Tilanvaihdos on herätys: hidastunut valvonta palaa täyteen
    // vauhtiin, ettei neula lähde liikkeelle neljännessekunnin myöhässä.
    hiljaisuus = 0;
    kaynnistaMittari();
  }

  /**
   * MITTARIN ÄÄNILÄHDE. Kelpaavat:
   *
   *   null          takaisin oletukseen eli pelin omaan äänisummaan
   *   funktio       () => number, hetkellinen voimakkuus 0–1
   *   AnalyserNode  luetaan suoraan
   *   AudioNode     soitin liittää siihen oman analysaattorinsa
   *
   * TÄMÄ ON SE PAIKKA, JOSTA SUORAN LÄHETYKSEN SAA MITTARIIN. Lähetys
   * soi <audio>-elementistä eikä kulje Web Audion läpi, joten laite ei
   * näe sen tasoa (ks. tiedoston alku). Jos js/linssit/radio.js joskus
   * reitittää virran kontekstin läpi — samalla varareitillä kuin
   * kaupungin äänimaisema, js/ambience-stream.js liitaKompressori — se
   * antaa ketjun vahvistinsolmun tänne, eikä muuta tarvita.
   *
   * Tunnistus on siitä, MITÄ OLIO OSAA, eikä sen luokan nimestä: sama
   * solmu voi tulla toisesta ikkunasta, jossa luokka on eri olio.
   */
  function asetaAanilahde(lahde) {
    mittarinLukija = null;
    irrotaLahde();
    if (typeof lahde === 'function') {
      mittarinLukija = () => rajaaLukema(Number(lahde()));
    } else if (lahde && typeof lahde.getByteTimeDomainData === 'function') {
      const puskuri = analyysiPuskurille(lahde);
      mittarinLukija = () => analysoijanTaso(lahde, puskuri);
    } else if (lahde && typeof lahde.connect === 'function'
      && typeof lahde.context?.createAnalyser === 'function') {
      try {
        const solmu = lahde.context.createAnalyser();
        solmu.fftSize = 1024;
        lahde.connect(solmu);
        // Sama vaimennettu pääte kuin oletuslähteellä, ja samasta
        // syystä: umpikujaan päättyvää haaraa ei ole pakko laskea.
        const paate = lahde.context.createGain();
        paate.gain.value = 0;
        solmu.connect(paate).connect(lahde.context.destination);
        lahteenSolmut = [solmu, paate];
        const puskuri = analyysiPuskurille(solmu);
        mittarinLukija = () => analysoijanTaso(solmu, puskuri);
      } catch (syy) {
        console.warn('VU-mittarin äänilähteen kytkentä epäonnistui.', syy);
      }
    }
    // Oma analysaattori pois tieltä, kun kutsuja antoi paremman tiedon.
    if (mittarinLukija) irrotaAnalysoija();
    paivitaMittari();
    return Boolean(mittarinLukija);
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
    pysaytaMittari();
    // Analysaattori irti äänikontekstista: kytketty solmu jää elämään,
    // koska ketju pitää siitä kiinni — sama sääntö kuin virittimen
    // solmuilla (js/linssit/viritin.js lopeta).
    irrotaAnalysoija();
    irrotaLahde();
    mittarinLukija = null;
    vahtija?.disconnect();
    juuri.remove();
  }

  // Aloitusasento: nuppi paikalleen ilman takaisinkutsua (kutsuja ei ole
  // pyytänyt äänen muutosta, se vain kertoi lähtöarvon), kytkimet alas ja
  // laite pois päältä mutta virta päällä.
  asetaAani(aaniArvo, false);
  virtaKytkin.asetaAsento(true);
  // Neula lepopaikkaansa heti: ilman tätä se osoittaisi suoraan ylös
  // (transform 0) siihen asti, kunnes ensimmäinen ääni liikuttaa sitä.
  piirraNeula();
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
    asetaVirityksenVaihe,
    asetaNaytto,
    asetaAani,
    asetaAanilahde,
    asetaKaupungit,
    asetaSijainti,
    poista,
    get tila() { return nykyinenTila; },
    get aani() { return aaniArvo; },
    get keskus() { return keskusId; },
    // Neulan lukema 0–1. Vain mittausta ja testejä varten; peli ei lue.
    get mittari() { return neulanLukema; },
  };
}
