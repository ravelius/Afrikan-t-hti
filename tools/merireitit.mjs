/*
 * Merireittien polut veden kautta.
 *
 * Vanhoilla laudoilla merireitti oli useimmiten suora viiva kaupungista
 * kaupunkiin, ja se toimi, koska rannikko oli pelkistetty. Yhdistetyllä
 * kartalla rannikko on Natural Earthin tarkkaa aineistoa, ja samat suorat
 * viivat oikaisevat nyt maan yli: ensimmäisessä ajossa 50 merireittiä
 * 54:stä kulki maalla. Tukholmasta Helsinkiin ei pääse suoraan.
 *
 * Reitit lasketaan siksi uudelleen: A* vesiruudukon läpi, ja tulos
 * pelkistetään muutamaksi välipisteeksi.
 *
 * Ruudukko on karkea tarkoituksella. Tarkempi löytäisi kapeampia salmia,
 * mutta hidastuisi ja tuottaisi mutkittelevia reittejä; peliin riittää,
 * että laiva kiertää mantereen eikä kynnä sen läpi.
 */

/*
 * Ruudun koko laudan yksiköissä.
 *
 * 22 oli liian karkea: Englannin ja Hollannin välinen kanava umpeutui,
 * kun rannikon viereiset ruudut merkitään maaksi, eikä Lontoosta
 * Amsterdamiin löytynyt vesitietä lainkaan. 12 pitää kapeat salmet
 * auki. Ruutuja on nyt noin 130 000, mikä on yhä nopea.
 */
const RUUTU = 12;

/**
 * Rakentaa vesiruudukon. Ruutu on vettä, jos sen keskipiste ei ole
 * maalla. Rannikon viereiset ruudut merkitään myös maaksi, jotta reitti
 * ei hipaise rantaa — muuten se näyttäisi kulkevan rannalla.
 */
export function vesiruudukko(map, leveys, korkeus, onMaalla) {
  const sarakkeita = Math.ceil(leveys / RUUTU);
  const riveja = Math.ceil(korkeus / RUUTU);
  const maa = new Uint8Array(sarakkeita * riveja);
  for (let ry = 0; ry < riveja; ry++) {
    for (let rx = 0; rx < sarakkeita; rx++) {
      const x = rx * RUUTU + RUUTU / 2;
      const y = ry * RUUTU + RUUTU / 2;
      if (onMaalla([x, y], map)) maa[ry * sarakkeita + rx] = 1;
    }
  }
  // Levitä maa yhden ruudun verran: reitti pysyy irti rannasta.
  const levitetty = Uint8Array.from(maa);
  for (let ry = 0; ry < riveja; ry++) {
    for (let rx = 0; rx < sarakkeita; rx++) {
      if (!maa[ry * sarakkeita + rx]) continue;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = rx + dx;
          const ny = ry + dy;
          if (nx < 0 || ny < 0 || nx >= sarakkeita || ny >= riveja) continue;
          levitetty[ny * sarakkeita + nx] = 1;
        }
      }
    }
  }
  return { maa: levitetty, sarakkeita, riveja, ruutu: RUUTU };
}

/** Lähin vesiruutu annetusta kohdasta. Kaupunki on rannalla, siis maalla. */
function lahinVesi(ruudukko, x, y) {
  const rx0 = Math.round(x / ruudukko.ruutu);
  const ry0 = Math.round(y / ruudukko.ruutu);
  for (let sade = 0; sade < 14; sade++) {
    for (let dy = -sade; dy <= sade; dy++) {
      for (let dx = -sade; dx <= sade; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== sade) continue;
        const rx = rx0 + dx;
        const ry = ry0 + dy;
        if (rx < 0 || ry < 0 || rx >= ruudukko.sarakkeita || ry >= ruudukko.riveja) continue;
        if (!ruudukko.maa[ry * ruudukko.sarakkeita + rx]) return [rx, ry];
      }
    }
  }
  return null;
}

/**
 * A* vesiruudukossa. Palauttaa ruutupolun tai null, jos vettä ei ole.
 */
function etsiPolku(ruudukko, alku, loppu) {
  const { sarakkeita, riveja, maa } = ruudukko;
  const indeksi = ([x, y]) => y * sarakkeita + x;
  const arvio = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const avoin = [[arvio(alku, loppu), alku]];
  const mista = new Map();
  const paras = new Map([[indeksi(alku), 0]]);
  const kohde = indeksi(loppu);

  while (avoin.length) {
    // Pieni jono: lineaarinen haku riittää, kun ruudukko on karkea.
    let pieninI = 0;
    for (let i = 1; i < avoin.length; i++) if (avoin[i][0] < avoin[pieninI][0]) pieninI = i;
    const [, nyt] = avoin.splice(pieninI, 1)[0];
    const nytI = indeksi(nyt);
    if (nytI === kohde) {
      const polku = [nyt];
      let k = nytI;
      while (mista.has(k)) {
        const edellinen = mista.get(k);
        polku.unshift(edellinen);
        k = indeksi(edellinen);
      }
      return polku;
    }
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = nyt[0] + dx;
        const ny = nyt[1] + dy;
        if (nx < 0 || ny < 0 || nx >= sarakkeita || ny >= riveja) continue;
        const i = ny * sarakkeita + nx;
        if (maa[i]) continue;
        const hinta = (paras.get(nytI) ?? Infinity) + Math.hypot(dx, dy);
        if (hinta >= (paras.get(i) ?? Infinity)) continue;
        paras.set(i, hinta);
        mista.set(i, nyt);
        avoin.push([hinta + arvio([nx, ny], loppu), [nx, ny]]);
      }
    }
  }
  return null;
}

/**
 * Pelkistää ruutupolun välipisteiksi: pidetään vain ne kohdat, joissa
 * suunta muuttuu selvästi. Peliin ei haluta sataa välipistettä vaan
 * muutama, jotta viiva on sujuva ja tiedosto pysyy pienenä.
 */
function pelkista(polku, ruutu, kelpaa, maxPisteita = 8) {
  if (polku.length < 3) return [];
  const pisteet = polku.map(([rx, ry]) => [
    Math.round(rx * ruutu + ruutu / 2),
    Math.round(ry * ruutu + ruutu / 2),
  ]);
  /*
   * Pelkistys OIKAISEE — ja oikominen vie viivan takaisin maalle juuri
   * siellä missä reitti kiertää niemen. Ensimmäisessä versiossa tämä
   * pilasi suurimman osan lasketuista reiteistä: A* löysi kunnollisen
   * polun, ja Douglas-Peucker leikkasi sen mantereen läpi.
   *
   * Siksi jokainen pelkistys tarkistetaan, ja karkein hyväksytään vasta
   * kun se kulkee yhä vettä pitkin.
   */
  let paras = pisteet;
  let toleranssi = ruutu;
  for (let i = 0; i < 14; i++) {
    const ehdokas = karsiPolku(pisteet, toleranssi);
    if (!kelpaa(ehdokas)) break;
    paras = ehdokas;
    if (paras.length <= maxPisteita + 2) break;
    toleranssi *= 1.5;
  }
  return paras.slice(1, -1); // päät ovat kaupungit
}

function karsiPolku(pisteet, toleranssi) {
  if (pisteet.length < 3) return pisteet;
  const etaisyys = ([px, py], [ax, ay], [bx, by]) => {
    const dx = bx - ax;
    const dy = by - ay;
    const pit2 = dx * dx + dy * dy;
    if (!pit2) return Math.hypot(px - ax, py - ay);
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / pit2));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  };
  const pida = new Array(pisteet.length).fill(false);
  pida[0] = true;
  pida[pisteet.length - 1] = true;
  const pino = [[0, pisteet.length - 1]];
  while (pino.length) {
    const [a, b] = pino.pop();
    let paras = -1;
    let parasEt = toleranssi;
    for (let i = a + 1; i < b; i++) {
      const d = etaisyys(pisteet[i], pisteet[a], pisteet[b]);
      if (d > parasEt) { parasEt = d; paras = i; }
    }
    if (paras > 0) { pida[paras] = true; pino.push([a, paras], [paras, b]); }
  }
  return pisteet.filter((_, i) => pida[i]);
}

/**
 * Välipisteet yhdelle merireitille. Palauttaa tyhjän listan, jos suora
 * viiva kulkee jo vettä pitkin — silloin välipisteitä ei tarvita.
 */
export function meripolku(ruudukko, a, b, onMaalla, map) {
  // Kulkeeko suora jo vettä pitkin?
  const askeleet = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 10);
  let suoraKay = true;
  for (let i = 1; i < askeleet; i++) {
    const t = i / askeleet;
    if (onMaalla([a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t], map)) { suoraKay = false; break; }
  }
  if (suoraKay) return [];

  const alku = lahinVesi(ruudukko, a.x, a.y);
  const loppu = lahinVesi(ruudukko, b.x, b.y);
  if (!alku || !loppu) return null;
  const polku = etsiPolku(ruudukko, alku, loppu);
  if (!polku) return null;
  // Kelpuutus: koko viiva kaupungista kaupunkiin, satamapätkiä lukuun
  // ottamatta, saa kulkea vain vettä pitkin. Sama sääntö kuin pelin
  // omassa testissä (HARBOUR = 55).
  const SATAMA = 55;
  const kelpaa = (valit) => {
    const kaikki = [[a.x, a.y], ...valit, [b.x, b.y]];
    for (let i = 1; i < kaikki.length; i++) {
      const [x0, y0] = kaikki[i - 1];
      const [x1, y1] = kaikki[i];
      const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 8);
      for (let k = 0; k <= n; k++) {
        const t = k / n;
        const x = x0 + (x1 - x0) * t;
        const y = y0 + (y1 - y0) * t;
        if (Math.hypot(x - a.x, y - a.y) < SATAMA) continue;
        if (Math.hypot(x - b.x, y - b.y) < SATAMA) continue;
        if (onMaalla([x, y], map)) return false;
      }
    }
    return true;
  };
  return pelkista(polku, ruudukko.ruutu, kelpaa);
}
