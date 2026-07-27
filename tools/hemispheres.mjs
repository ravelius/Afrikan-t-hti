// Maailmankartan muunnos kahden pallonpuoliskon kartaksi.
//
// Vanha Maailma-lauta oli tasavälinen lieriöprojektio (2:1), joka on
// pystyruudulla auttamatta liian leveä. Klassiset 1600-luvun maailmankartat
// (Blaeu, Visscher) piirsivät maailman kahtena ympyränä vierekkäin ja
// täyttivät ylä- ja alareunan napa-alueiden pikkuympyröillä. Lopputulos on
// noin 1,4:1 eli selvästi lähempänä ruudun muotoa.
//
// Projektio on stereografinen atsimutaali päiväntasaajan asennossa — sama
// jota vanhat kartantekijät käyttivät, koska se säilyttää kulmat ja piirtää
// leveys- ja pituuspiirit ympyränkaarina.
//
//   k = 2R / (1 + cos(lat) cos(lon - lon0))
//   x = k cos(lat) sin(lon - lon0)
//   y = k sin(lat)
//
// Reunalla (lon - lon0 = ±90°, lat = 0) k = 2R, joten ympyrän säde on 2R.

const RAD = Math.PI / 180;

// Vanhan laudan koordinaatiston purku takaisin asteiksi.
//   x = (lon + 180) / 0.36
//   y = 305 + (80 - lat) * 1000 / 360
export const toLonLat = ([x, y]) => [x * 0.36 - 180, 80 - (y - 305) * 0.36];

/** Stereografinen pallonpuolisko: keskimeridiaani lon0, säde r. */
export function hemisphere({ lon0, cx, cy, r }) {
  const R = r / 2;
  return (lon, lat) => {
    // Pituusero kääritään välille -180..180, jotta päivämääräraja ei riko sitä.
    let d = lon - lon0;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    const c = Math.cos(lat * RAD) * Math.cos(d * RAD);
    const k = (2 * R) / (1 + c);
    return [
      cx + k * Math.cos(lat * RAD) * Math.sin(d * RAD),
      cy - k * Math.sin(lat * RAD),
    ];
  };
}

/** Kuuluuko piste tälle pallonpuoliskolle? Raja on lon0 ± 90°. */
export function inHemisphere(lon, lon0, marginDeg = 0) {
  let d = lon - lon0;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return Math.abs(d) <= 90 + marginDeg;
}

/** Napa-alueen pikkuympyrä: atsimutaali napa-asennossa (yksinkertainen). */
export function polar({ north, cx, cy, r, latEdge }) {
  // Säde kasvaa lineaarisesti navalta reunaleveyspiirille.
  return (lon, lat) => {
    const span = north ? 90 - latEdge : latEdge + 90;
    const dist = north ? (90 - lat) / span : (lat + 90) / span;
    const a = (lon + 180) * RAD;
    return [cx + r * dist * Math.sin(a), cy - r * dist * Math.cos(a) * (north ? 1 : -1)];
  };
}
