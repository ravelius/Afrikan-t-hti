/*
 * Säätiedot lehtikaupungeille (omistajan toive 5.8.2026): lehden
 * etusivulla näkyy päivän sääennuste, ja sitä napauttamalla aukeaa
 * koko vuoden keskilämpö ja sademäärä graafina.
 *
 * Rakenne per kaupunki (avain = kaupunki-id, sama kuin
 * KULTTUURI_KATEGORIAT):
 *
 *   lat, lon  — ennustehaku (Open-Meteo, avaimeton ja CORS-avoin)
 *   keskilampo[12] — kuukauden keskilämpö °C, tammikuusta joulukuuhun
 *   sade[12]  — kuukauden sademäärä mm
 *
 * Normaalit ovat staattista dataa TARKOITUKSELLA: vuosigraafi ja
 * ennusteen varateksti toimivat myös ilman verkkoa (lentokoneessa).
 * Ne on laskettu Open-Meteon arkistosta (ERA5) jaksolta 1991–2020 —
 * sama jakso kuin virallisissa ilmastonormaaleissa. Lähderivi
 * graafissa: "Open-Meteo (ERA5), 1991–2020".
 *
 * Uusi lehtikaupunki tarvitsee vain oman rivinsä tähän — koodia ei
 * tarvitse muuttaa. Ilman riviä lehti näkyy ilman säätä.
 */
export const SAATIEDOT = {
  kairo: {
    lat: 30.05,
    lon: 31.23,
    keskilampo: [13.6, 14.7, 17.5, 21.3, 25.2, 27.9, 29.0, 29.1, 27.4, 24.2, 19.5, 15.2],
    sade: [4, 4, 4, 1, 0, 0, 0, 0, 0, 1, 2, 2],
  },
  venetsia: {
    lat: 45.44,
    lon: 12.32,
    keskilampo: [4.3, 5.3, 8.8, 12.8, 17.5, 21.5, 23.9, 24.0, 19.5, 14.9, 9.8, 5.2],
    sade: [60, 62, 69, 82, 93, 77, 60, 82, 120, 118, 125, 79],
  },
};
