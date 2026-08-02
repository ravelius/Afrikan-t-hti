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
 * --- tärkein oppi: kelpuutus tehdään pelin omalla viivalla ---
 *
 * Ensimmäinen versio tarkisti reitin SUORINA pätkinä välipisteestä
 * toiseen. Peli ei kuitenkaan piirrä suoria: `edgePolyline` pehmentää
 * välipisteet Catmull-Rom-käyräksi, ja käyrä kaartaa jyrkissä mutkissa
 * välipisteiden ULKOPUOLELLE. Siksi kuusi reittiä läpäisi työkalun
 * tarkistuksen mutta kulki pelissä maan yli, vaikka jokainen välipiste
 * oli vedessä.
 *
 * Nyt kelpuutus rakentaa saman viivan kuin peli. Se on ainoa tapa
 * tietää, mitä pelaaja näkee.
 */
import { edgePolyline } from '../js/rules.js';

/*
 * Ruudun koko laudan yksiköissä.
 *
 * 22 oli liian karkea: Englannin ja Hollannin välinen kanava umpeutui,
 * kun rannikon viereiset ruudut merkitään maaksi, eikä Lontoosta
 * Amsterdamiin löytynyt vesitietä lainkaan. 12 pitää kapeat salmet
 * auki. Ruutuja on nyt noin 130 000, mikä on yhä nopea.
 */
const RUUTU = 12;

/** Satamaan johtava pätkä saa kulkea maalla. Sama luku kuin pelin testissä. */
const SATAMA = 55;

/**
 * Rakentaa vesiruudukon. Ruutu on vettä, jos sen keskipiste ei ole
 * maalla. Rannikon viereiset ruudut merkitään myös maaksi, jotta reitti
 * ei hipaise rantaa — muuten se näyttäisi kulkevan rannalla.
 *
 * `alue` rajaa ruudukon osaan lautaa. Sitä tarvitaan tarkennuksessa:
 * koko laudan kattava tiheä ruudukko olisi miljoonia ruutuja, mutta
 * yhden salmen ympärille rajattu on pieni.
 */
/** Mistä kohdista ääriviiva leikkaa vaakarivin y. */
function leikkaukset(poly, y) {
  const xs = [];
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y)) xs.push(((xj - xi) * (y - yi)) / (yj - yi) + xi);
  }
  return xs;
}

/** Onko x ääriviivan sisällä? Pariton määrä leikkauksia oikealla = sisällä. */
function sisalla(xs, x) {
  let n = 0;
  for (const leikkaus of xs) if (x < leikkaus) n += 1;
  return (n & 1) === 1;
}

/*
 * Rivilasku on nopea mutta se on oma toteutus. Jos se eroaisi pelin
 * omasta säännöstä, reitit näyttäisivät työkalussa kelvollisilta ja
 * kulkisivat pelissä maalla — juuri se virhe, jota tässä korjataan.
 * Siksi otos tarkistetaan aina pelin omalla funktiolla.
 */
function tarkistaRasteri(maa, ruudukko, map, onMaalla) {
  const { sarakkeita, riveja, ruutu, x0, y0 } = ruudukko;
  const yhteensa = sarakkeita * riveja;
  const otos = Math.min(yhteensa, 400);
  const askel = Math.max(1, Math.floor(yhteensa / otos));
  for (let i = 0; i < yhteensa; i += askel) {
    const rx = i % sarakkeita;
    const ry = Math.floor(i / sarakkeita);
    const x = x0 + rx * ruutu + ruutu / 2;
    const y = y0 + ry * ruutu + ruutu / 2;
    if (!!maa[i] !== !!onMaalla([x, y], map)) {
      throw new Error(`rivilasku eroaa pelin säännöstä kohdassa ${x},${y}`);
    }
  }
}

export function vesiruudukko(map, leveys, korkeus, onMaalla, asetukset = {}) {
  const {
    ruutu = RUUTU,
    // Väljyys yksiköissä: kuinka kauas rannasta reitin pitää pysyä.
    // Oletus on yksi karkea ruutu, eli sama kuin ennen.
    valjyys = ruutu,
    alue = null,
  } = asetukset;
  const x0 = alue ? Math.max(0, alue.x0) : 0;
  const y0 = alue ? Math.max(0, alue.y0) : 0;
  const x1 = alue ? Math.min(leveys, alue.x1) : leveys;
  const y1 = alue ? Math.min(korkeus, alue.y1) : korkeus;
  const sarakkeita = Math.ceil((x1 - x0) / ruutu);
  const riveja = Math.ceil((y1 - y0) / ruutu);
  const maa = new Uint8Array(sarakkeita * riveja);
  /*
   * Rasteri lasketaan RIVEITTÄIN.
   *
   * Suoraviivainen tapa on kysyä jokaiselta ruudulta erikseen "oletko
   * maalla", mutta se käy jokaisen ääriviivan läpi joka ruudulla.
   * Yhdistetyllä kartalla se maksoi noin millisekunnin per ruutu, ja
   * tarkennuksessa ruutuja on satojatuhansia — tunteja.
   *
   * Saman vastauksen saa kerralla koko riville: lasketaan mistä kohdista
   * ääriviivat leikkaavat rivin, ja luetaan sitten jokaisen ruudun
   * puoli leikkauksista. Sääntö on täsmälleen sama pariton/parillinen
   * kuin pelin `pointInPolygon`illa, ja tulos tarkistetaan silti
   * otoksella pelin omaa funktiota vasten.
   */
  const rannat = map.outlines;
  const jarvet = map.lakes ?? [];
  for (let ry = 0; ry < riveja; ry++) {
    const y = y0 + ry * ruutu + ruutu / 2;
    const rantaRivit = rannat.map((poly) => leikkaukset(poly, y));
    const jarviRivit = jarvet.map((poly) => leikkaukset(poly, y));
    for (let rx = 0; rx < sarakkeita; rx++) {
      const x = x0 + rx * ruutu + ruutu / 2;
      if (!rantaRivit.some((xs) => sisalla(xs, x))) continue;
      if (jarviRivit.some((xs) => sisalla(xs, x))) continue;
      maa[ry * sarakkeita + rx] = 1;
    }
  }
  tarkistaRasteri(maa, { sarakkeita, riveja, ruutu, x0, y0 }, map, onMaalla);
  // Levitä maa niin monta ruutua, että väljyys täyttyy: reitti pysyy
  // irti rannasta. Tiheässä ruudukossa yksi ruutu ei riittäisi.
  const kerroksia = Math.max(1, Math.round(valjyys / ruutu));
  const levitetty = Uint8Array.from(maa);
  for (let ry = 0; ry < riveja; ry++) {
    for (let rx = 0; rx < sarakkeita; rx++) {
      if (!maa[ry * sarakkeita + rx]) continue;
      for (let dy = -kerroksia; dy <= kerroksia; dy++) {
        for (let dx = -kerroksia; dx <= kerroksia; dx++) {
          const nx = rx + dx;
          const ny = ry + dy;
          if (nx < 0 || ny < 0 || nx >= sarakkeita || ny >= riveja) continue;
          levitetty[ny * sarakkeita + nx] = 1;
        }
      }
    }
  }
  return { maa: levitetty, sarakkeita, riveja, ruutu, x0, y0 };
}

/** Ruudun keskipiste laudan koordinaateissa. */
const keskipiste = (ruudukko, rx, ry) => [
  Math.round(ruudukko.x0 + rx * ruudukko.ruutu + ruudukko.ruutu / 2),
  Math.round(ruudukko.y0 + ry * ruudukko.ruutu + ruudukko.ruutu / 2),
];

/** Lähin vesiruutu annetusta kohdasta. Kaupunki on rannalla, siis maalla. */
function lahinVesi(ruudukko, x, y) {
  const rx0 = Math.round((x - ruudukko.x0) / ruudukko.ruutu);
  const ry0 = Math.round((y - ruudukko.y0) / ruudukko.ruutu);
  // Etsintäsäde yksiköissä on sama riippumatta ruudun koosta: tiheässä
  // ruudukossa samaan matkaan tarvitaan enemmän ruutuja.
  const maxSade = Math.max(14, Math.ceil(170 / ruudukko.ruutu));
  for (let sade = 0; sade < maxSade; sade++) {
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

/*
 * Kekojono A*:n avoimelle listalle.
 *
 * Ensimmäinen versio etsi pienimmän arvon lineaarisesti. Karkealla
 * ruudukolla se ei haitannut, mutta tarkennuksessa ruutuja on
 * satojatuhansia, ja lineaarinen haku tekee hausta neliöllisen: yksi
 * reitti jäi pyörimään minuuteiksi. Keko on muutaman rivin asia ja
 * poistaa ongelman kokonaan.
 */
class Keko {
  constructor() { this.t = []; }
  get koko() { return this.t.length; }
  lisaa(arvo, tieto) {
    const t = this.t;
    t.push([arvo, tieto]);
    let i = t.length - 1;
    while (i > 0) {
      const v = (i - 1) >> 1;
      if (t[v][0] <= t[i][0]) break;
      [t[v], t[i]] = [t[i], t[v]];
      i = v;
    }
  }
  ota() {
    const t = this.t;
    const paalla = t[0];
    const viimeinen = t.pop();
    if (t.length) {
      t[0] = viimeinen;
      let i = 0;
      for (;;) {
        const a = 2 * i + 1;
        const b = a + 1;
        let pienin = i;
        if (a < t.length && t[a][0] < t[pienin][0]) pienin = a;
        if (b < t.length && t[b][0] < t[pienin][0]) pienin = b;
        if (pienin === i) break;
        [t[pienin], t[i]] = [t[i], t[pienin]];
        i = pienin;
      }
    }
    return paalla;
  }
}

/**
 * A* vesiruudukossa. Palauttaa ruutupolun tai null, jos vettä ei ole.
 */
function etsiPolku(ruudukko, alku, loppu) {
  const { sarakkeita, riveja, maa } = ruudukko;
  const indeksi = ([x, y]) => y * sarakkeita + x;
  const arvio = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const avoin = new Keko();
  avoin.lisaa(arvio(alku, loppu), alku);
  const mista = new Map();
  const paras = new Map([[indeksi(alku), 0]]);
  const kohde = indeksi(loppu);

  while (avoin.koko) {
    const [, nyt] = avoin.ota();
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
        avoin.lisaa(hinta + arvio([nx, ny], loppu), [nx, ny]);
      }
    }
  }
  return null;
}

/**
 * Pelkistää ruutupolun välipisteiksi: pidetään vain ne kohdat, joissa
 * suunta muuttuu selvästi. Peliin ei haluta sataa välipistettä vaan
 * muutama, jotta viiva on sujuva ja tiedosto pysyy pienenä.
 *
 * Palauttaa null, jos edes pelkistämätön polku ei kelpaa. Silloin
 * kutsuja tietää, ettei ruudukko riittänyt — aiemmin tässä palautettiin
 * kelpaamaton polku vaieten.
 */
function pelkista(polku, ruudukko, kelpaa, maxPisteita = 8) {
  if (polku.length < 3) return [];
  const pisteet = polku.map(([rx, ry]) => keskipiste(ruudukko, rx, ry));
  if (!kelpaa(pisteet.slice(1, -1))) return null;
  /*
   * Pelkistys OIKAISEE — ja oikominen vie viivan takaisin maalle juuri
   * siellä missä reitti kiertää niemen. Ensimmäisessä versiossa tämä
   * pilasi suurimman osan lasketuista reiteistä: A* löysi kunnollisen
   * polun, ja Douglas-Peucker leikkasi sen mantereen läpi.
   *
   * Siksi jokainen pelkistys tarkistetaan, ja karkein hyväksytään vasta
   * kun se kulkee yhä vettä pitkin.
   */
  /*
   * Kaikki toleranssit kokeillaan, ei vain kasvavaa sarjaa ensimmäiseen
   * epäonnistumiseen. Karsinta ei ole yksitoikkoinen: pieni toleranssi
   * voi oikaista juuri niemen kohdalta ja iso jättää sen mutkan
   * ennalleen. Ensimmäinen versio pysähtyi ensimmäiseen hylkäykseen ja
   * palautti pelkistämättömän polun — Punaisellamerellä 237 välipistettä
   * siinä missä 8 riitti.
   */
  let paras = pisteet;
  let toleranssi = ruudukko.ruutu;
  for (let i = 0; i < 16; i++) {
    const ehdokas = karsiPolku(pisteet, toleranssi);
    if (ehdokas.length < paras.length && kelpaa(ehdokas.slice(1, -1))) paras = ehdokas;
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
 * Kulkeeko reitti vettä pitkin? Viiva rakennetaan täsmälleen niin kuin
 * peli sen rakentaa, koska juuri sitä pelaaja katsoo.
 */
export function kulkeeVedessa(a, b, valit, onMaalla, map) {
  const poly = edgePolyline({ id: `${a.id}|${b.id}`, a: a.id, b: b.id, type: 'sea', via: valit }, new Map([[a.id, a], [b.id, b]]));
  /*
   * Näytteet otetaan viivaa PITKIN, ei vain kulmapisteistä.
   *
   * Ensimmäinen versio katsoi pelkkiä kulmapisteitä, ja se hyväksyi
   * välipisteettömän suoran aina: silloin viivalla on vain kaksi
   * pistettä, molemmat satamassa, eikä yhtään näytettä jää tarkastettavaksi.
   * Työkalu ilmoitti kuusi reittiä korjatuiksi, vaikka se oli vain
   * poistanut niiden välipisteet ja vetänyt suoran mantereen yli.
   */
  /*
   * Yhden yksikön askel, vaikka se on hidas.
   *
   * Neljä yksikköä riitti melkein: Helsingin ja Tallinnan väli on 112
   * yksikköä, eli satamavyöhykkeiden (55 + 55) väliin jää vain 2,2
   * yksikköä tarkastettavaa. Neljän yksikön askel hyppäsi sen yli, ja
   * reitti näytti kelvolliselta vaikka se kulkee maalla juuri siinä.
   * Kapeimmat tarkastettavat kohdat ovat aina lyhyillä reiteillä.
   */
  const ASKEL = 1;
  for (let i = 1; i < poly.length; i++) {
    const [x0, y0] = poly[i - 1];
    const [x1, y1] = poly[i];
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / ASKEL));
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
}

/**
 * Välipisteet yhdelle merireitille. Palauttaa tyhjän listan, jos suora
 * viiva kulkee jo vettä pitkin — silloin välipisteitä ei tarvita.
 * Palauttaa null, jos vesitietä ei löytynyt.
 */
export function meripolku(ruudukko, a, b, onMaalla, map, syyt = null) {
  const kirjaa = (syy) => { if (syyt) syyt.push(syy); return null; };
  if (kulkeeVedessa(a, b, [], onMaalla, map)) return [];
  const alku = lahinVesi(ruudukko, a.x, a.y);
  const loppu = lahinVesi(ruudukko, b.x, b.y);
  if (!alku) return kirjaa(`${a.id}: ei vesiruutua lähellä`);
  if (!loppu) return kirjaa(`${b.id}: ei vesiruutua lähellä`);
  const polku = etsiPolku(ruudukko, alku, loppu);
  if (!polku) return kirjaa('ei vesitietä ruudukossa');
  const tulos = pelkista(polku, ruudukko, (valit) => kulkeeVedessa(a, b, valit, onMaalla, map));
  if (!tulos) return kirjaa('polku löytyi mutta pehmennetty viiva kulkee maalla');
  return tulos;
}

/*
 * Portaat tarkennukseen: ruudun koko ja väljyys yksiköissä.
 *
 * Karkea ruudukko ei näe alle 12 yksikön saarta eikä salmea: se osuu
 * ruutujen keskipisteiden väliin. Juuri siitä jäivät Riian ja Tukholman
 * väliin jäävä luoto ja Mosambikin kanaalin matalikot.
 *
 * Väljyys pienenee portaittain hitaammin kuin ruutu. Liian pieni
 * väljyys vie reitin kiinni rantaan, ja silloin pehmennetty käyrä
 * kaartaa maalle vaikka jokainen välipiste on vedessä.
 */
const PORTAAT = [
  { ruutu: 6, valjyys: 12 },
  { ruutu: 6, valjyys: 6 },
  { ruutu: 3, valjyys: 6 },
  { ruutu: 3, valjyys: 3 },
  // Punaisenmeren ja Mosambikin kanaalin kaltaiset kapeikot: rannikko on
  // niin lähellä molemmin puolin, ettei kolmen yksikön väljyyskään mahdu.
  { ruutu: 2, valjyys: 2 },
];

/**
 * Laskee reitin uudelleen paikallisesti tiheämmällä ruudukolla. Koko
 * laudan kattava tiheä ruudukko olisi miljoonia ruutuja; yhden salmen
 * ympärille rajattu on pieni ja nopea.
 */
export function tarkennaMeripolku(map, a, b, onMaalla, leveys, korkeus) {
  /*
   * Rajaus laajenee portaittain.
   *
   * Tiukka rajaus on nopea, mutta se estää pitkän kierron: Dubrovnikista
   * Roomaan ei pääse Adrianmeren yli vaan saappaan ympäri Sisilian
   * kautta, eikä se mahdu kaupunkien väliseen laatikkoon. Aloitetaan
   * tiukasta ja laajennetaan vasta jos vesitietä ei löydy.
   */
  const perusvara = Math.max(140, Math.hypot(b.x - a.x, b.y - a.y) * 0.55);
  const syyt = [];
  for (const kerroin of [1, 2.5, 6]) {
    const vara = perusvara * kerroin;
    const alue = {
      x0: Math.min(a.x, b.x) - vara,
      y0: Math.min(a.y, b.y) - vara,
      x1: Math.max(a.x, b.x) + vara,
      y1: Math.max(a.y, b.y) + vara,
    };
    for (const porras of PORTAAT) {
      const ruudukko = vesiruudukko(map, leveys, korkeus, onMaalla, { ...porras, alue });
      const polku = meripolku(ruudukko, a, b, onMaalla, map, syyt);
      if (polku) return { via: polku, porras, vara: Math.round(vara) };
    }
  }
  return { via: null, syy: syyt[syyt.length - 1] ?? 'tuntematon' };
}
