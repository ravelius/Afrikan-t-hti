/*
 * Maailmanradion viritysäänet: mitä kuuluu, kun soitin hakee kanavaa.
 *
 * Radiosoittimen 'virittaa'-tila kestää siitä, kun kaupunkia napautetaan,
 * siihen kunnes suora lähetys alkaa kuulua — enintään
 * VIRITYKSEN_AIKAKATKAISU_MS eli 12 sekuntia (js/linssit/radiosoitin.js).
 * Tauko oli hiljainen, ja hiljainen tauko näyttää rikkinäiseltä:
 * vastaanotin, joka ei suhise, on vastaanotin joka ei toimi.
 *
 * Nämä viisi ovat aitoja radiovastaanottimen äänityksiä, eivät
 * syntetisoitua kohinaa. Jokainen on eri äänitteestä ja eri äänittäjältä,
 * ja niiden luonne on tarkoituksella erilainen: leveä tungos, raskas
 * kohina, tyhjä kaista, naksuva datalähete ja keskiaalto-asteikon pää.
 * Sama ääni ei siis toistu joka kerta, ja kaupungista toiseen siirtyminen
 * kuulostaa siltä kuin vastaanotinta kelattaisiin oikeasti.
 *
 * Kaikki ovat public domainia (PD-merkintä, CC0 tai CC:n vanha
 * public domain -luovutus). Pätkiin on valittu vain kohinaa: sen alta
 * kuuluva ohjelma olisi jonkun teos, kohina ei ole kenenkään.
 *
 * Tuotettu komennolla
 *   node tools/hae-viritysaanet.mjs
 * Älä muokkaa listaa käsin: työkalu tarkistaa lisenssit arkistosta joka
 * ajolla ja leikkaa pätkät uudestaan samoista kohdista.
 *
 * SILMUKKA: jokainen pätkä on tehty silmukoituvaksi. Loppu on
 * ristihäivytetty tiedoston omaan alkuun, joten lopusta alkuun ei jää
 * saumaa eikä naksahdusta (peli on kärsinyt juuri siitä, ks.
 * js/muutokset.js v176 ja v215). Silmukka kannattaa soittaa Web Audiolla
 * (decodeAudioData + AudioBufferSourceNode, loop = true) niin kuin
 * js/sound.js tekee tehosteille: <audio loop> jättää mp3:n koodausviiveen
 * takia pienen tauon kierrosten väliin, ja se kuuluisi kohinassa.
 *
 * ARVONTA on tarkoitettu tehtäväksi näin:
 *
 *   1. Kun tila vaihtuu 'virittaa'-tilaan, arvo yksi tiedosto listasta.
 *   2. Älä arvo samaa kuin edellisellä kerralla. Muistettava on vain
 *      edellinen valinta, ei koko historiaa: viidellä äänellä pelkkä
 *      tasajakauma osuisi samaan noin joka viides kerta, ja juuri se
 *      toisto omistaja pyysi pois.
 *   3. Aloituskohtaa EI arvota. Se on hyvä keino pitkälle äänitteelle
 *      (js/media.js tuntee merkinnän '#alku=20&voima=1.5'), mutta nämä
 *      pätkät ovat 7–9 sekuntia eli lyhyempiä kuin viritys pisimmillään.
 *      Keskeltä aloittaminen katkaisisi silmukan sauman ja jättäisi
 *      pätkästä kuulumatta juuri sen verran kuin arvottiin. Vaihtelu
 *      tulee tiedoston valinnasta, ei aloituskohdasta.
 *   4. Äänet on normalisoitu samaan tasoon (RMS −20 dB), joten arvonta ei
 *      kuulu voimakkuuden hyppäyksenä. Älä säädä niitä erikseen.
 *
 * Yhteensä 284 kt. Tiedostot ovat sw.js:n SHELL-listassa, eli ne tulevat
 * offline-koriin — viritys toimii myös ilman verkkoa, vaikka itse lähetys
 * ei silloin kuulukaan.
 */

/**
 * kesto = sekuntia (tarkka; mp3:n koodausviive on korjattu Xing-otsakkeeseen).
 * lahde = arkiston kohdesivu, josta lisenssin voi tarkistaa.
 */
export const VIRITYSAANET = [
  {
    tiedosto: 'viritys-taajuustungos.mp3',
    kesto: 9,
    kuvaus: 'Ruuhkainen 13760 kHz: leveä kohina ja kaksi paikallaan seisovaa vihellystä',
    lahde: 'https://archive.org/details/Crowded13760khz',
    lisenssi: 'Public Domain Mark 1.0',
    tekija: 'samnewton94 (archive.org)',
  },
  {
    tiedosto: 'viritys-raskaskohina.mp3',
    kesto: 8,
    kuvaus: 'Raskas kohina 5130 kHz:llä, lähetys hukkuu kokonaan alle',
    lahde: 'https://archive.org/details/radio-angela-heavy-static-edition.-th.-2023-03-24-t-03-18-12-z-5130.0k-hz',
    lisenssi: 'CC0 1.0',
    tekija: 'J. Christie',
  },
  {
    tiedosto: 'viritys-tyhjakaista.mp3',
    kesto: 7,
    kuvaus: 'Tyhjä kohta 100 metrin kaistalla, tasainen hiljainen suhina',
    lahde: 'https://archive.org/details/tambov-tuning-to-three-ops.-one-pirate-station.-sun.-2025-12-21-t-10-28-16-z-3170.2k-hz',
    lisenssi: 'Public Domain Mark 1.0',
    tekija: 'Strelnikov (archive.org)',
  },
  {
    tiedosto: 'viritys-datasignaali.mp3',
    kesto: 9,
    kuvaus: 'Tunnistamaton asema 7575 kHz: kohinan seassa naksuva datalähete',
    lahde: 'https://archive.org/details/UnidShortwaveDataVoice7575Khz6208',
    lisenssi: 'CC Public Domain Dedication',
    tekija: 'canklecat (archive.org)',
  },
  {
    tiedosto: 'viritys-asteikonpaa.mp3',
    kesto: 8,
    kuvaus: 'Keskiaalto-asteikon 530–670 kHz haku, asemien väliin jäävä tumma suhina',
    lahde: 'https://archive.org/details/MediumWaveBandScansPaxtonIllinoisU.s.a.Jan.7th2010',
    lisenssi: 'CC Public Domain Dedication',
    tekija: 'Curtis Sadowski (The Audio Archivist)',
  },
];

/** Viritysäänen polku pelin juuresta. */
export function viritysPolku(aani) {
  return `assets/audio/${aani.tiedosto}`;
}

/**
 * Arpoo viritysäänen. `edellinen` on edellisen arvonnan palauttama alkio
 * (tai sen tiedostonimi); sama ei tule kahdesti peräkkäin.
 *
 * `arpa` on vaihdettavissa testejä varten — pelissä sitä ei anneta.
 */
export function arvoViritysaani(edellinen = null, arpa = Math.random) {
  const edellinenNimi = typeof edellinen === 'string' ? edellinen : edellinen?.tiedosto;
  const kori = VIRITYSAANET.filter((a) => a.tiedosto !== edellinenNimi);
  // Jos lista joskus kutistuu yhteen, kori tyhjenisi eikä arvonta palauttaisi
  // mitään. Silloin sama ääni on parempi kuin hiljaisuus.
  const lista = kori.length ? kori : VIRITYSAANET;
  return lista[Math.floor(arpa() * lista.length) % lista.length];
}
