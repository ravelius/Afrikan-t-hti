/*
 * Kieli kuuluviin: kaupungissa nauhoitettu näyte, jossa ihmiset puhuvat.
 *
 * Tämä on tarkoituksella eri asia kuin kaupungin taustaääni
 * (js/aani-ehdokkaat.js KAUPUNKI_EHDOKKAAT). Taustaääni soi silmukassa
 * minuutteja, ja selvä puhe alkaa toistuessaan kiinnittää huomion:
 * pelaaja tunnistaa samat lauseet ja tausta muuttuu häiriöksi. Siksi
 * taustaan haetaan puheetonta maisemaa, ja kieli soi omasta napistaan
 * kerran painalluksesta — silloin selvä puhe on vahvuus.
 *
 * Nappi on saapumiskortissa tervehdysrivin perässä: teksti kertoo mitä
 * "hyvää päivää" on kyseisellä kielellä, näyte kertoo miltä se
 * kuulostaa oikeassa kadunkulmassa.
 *
 * Äänitteet ovat radio aporeesta ja haettu koordinaattien perusteella
 * (tools/hae-kaupunkiaanet.mjs --puhe), joten ne ovat varmasti siitä
 * kaupungista. Parhaita ovat tori, kahvila ja katusoittaja: ihmisiä on
 * monta, puhe on luontevaa eikä äänite ole kenenkään yksityinen
 * keskustelu.
 *
 * Muoto: { url, nimi, kesto } — nimi kertoo paikan, tekijän ja
 * lisenssin, ja se näkyy sellaisenaan lähdemainintana.
 */
export const EUROPE_KIELET = {};
