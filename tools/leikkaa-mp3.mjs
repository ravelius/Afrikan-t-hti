// MP3:n leikkaus ilman uudelleenkoodausta.
//
// Omistajan linjaus 1.8.2026: taustaääneksi riittää kolme minuuttia.
// Radio aporeen kenttä-äänitykset ovat usein 10–30 minuuttia ja
// kymmeniä megatavuja, ja peli soittaa niistä silmukassa muutaman
// minuutin kerrallaan — loppuosa on pelkkää painolastia peilissä.
//
// MP3 on kehysjono: jokainen kehys alkaa tahdistustavuilla ja kertoo
// otsakkeessaan oman pituutensa, joten tiedoston voi katkaista
// kehysrajalta. Ääntä ei koodata uudelleen, joten laatu on bitilleen
// sama kuin alkuperäisessä eikä ffmpegin kaltaista riippuvuutta tarvita.

// Layer III:n bittinopeudet ja näytetaajuudet. Layer I ja II jätetään
// koskematta: aporeessa niitä ei ole, eikä arvaus kannata.
const NOPEUDET_MPEG1 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0];
const NOPEUDET_MPEG2 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0];
const TAAJUUDET = {
  3: [44100, 48000, 32000], // MPEG 1
  2: [22050, 24000, 16000], // MPEG 2
  0: [11025, 12000, 8000], // MPEG 2.5
};

/** ID3v2-tunnisteen pituus tavuina, 0 jos tunnistetta ei ole. */
function id3Pituus(puskuri) {
  if (puskuri.length < 10 || puskuri.toString('latin1', 0, 3) !== 'ID3') return 0;
  // Koko on tallennettu "syncsafe"-muodossa: seitsemän bittiä tavussa.
  const koko = ((puskuri[6] & 0x7f) << 21) | ((puskuri[7] & 0x7f) << 14)
    | ((puskuri[8] & 0x7f) << 7) | (puskuri[9] & 0x7f);
  const jalki = (puskuri[5] & 0x10) ? 10 : 0; // footer
  return 10 + koko + jalki;
}

/** Yhden kehyksen otsake, tai null jos kohdassa ei ole kelvollista kehystä. */
function kehys(puskuri, kohta) {
  if (kohta + 4 > puskuri.length) return null;
  const [a, b, c] = [puskuri[kohta], puskuri[kohta + 1], puskuri[kohta + 2]];
  if (a !== 0xff || (b & 0xe0) !== 0xe0) return null;
  const versio = (b >> 3) & 3;
  const kerros = (b >> 1) & 3;
  if (versio === 1 || kerros !== 1) return null; // varattu versio tai muu kuin Layer III
  const nopeudet = versio === 3 ? NOPEUDET_MPEG1 : NOPEUDET_MPEG2;
  const nopeus = nopeudet[(c >> 4) & 15] * 1000;
  const taajuus = TAAJUUDET[versio][(c >> 2) & 3];
  if (!nopeus || !taajuus) return null; // free-format tai varattu taajuus
  const naytteet = versio === 3 ? 1152 : 576;
  const tayte = (c >> 1) & 1;
  const pituus = Math.floor((naytteet / 8) * nopeus / taajuus) + tayte;
  if (pituus < 24) return null;
  return {
    pituus, kesto: naytteet / taajuus, versio, kanavatila: (puskuri[kohta + 3] >> 6) & 3,
  };
}

/**
 * Xing/Info-otsake kertoo tiedoston kehysmäärän ja koon. Jos sitä ei
 * korjata, selain laskee keston alkuperäisestä pituudesta ja hyppää
 * leikatussa tiedostossa lopun ohi — ambienssi jäisi hiljaiseksi.
 *
 * Otsake etsitään suoraan tiedoston alusta eikä kehyksen sivutiedon
 * takaa: koodaajien välissä on eroja, ja väärästä kohdasta katsottuna
 * otsake jäisi huomaamatta ja korjaamatta.
 */
function xingKohta(puskuri, alkuOffset) {
  const loppu = Math.min(puskuri.length - 8, alkuOffset + 4096);
  for (let i = alkuOffset; i < loppu; i += 1) {
    const tunnus = puskuri.toString('latin1', i, i + 4);
    if (tunnus === 'Xing' || tunnus === 'Info') return i;
  }
  return -1;
}

/**
 * Leikkaa mp3-puskurin enintään annetun mittaiseksi. Palauttaa uuden
 * puskurin ja toteutuneen keston, tai null jos tiedostoa ei osattu
 * jäsentää tai se on jo tarpeeksi lyhyt.
 */
export function leikkaaMp3(puskuri, maxSekuntia) {
  const alkuOffset = id3Pituus(puskuri);
  // Tahdistustavut osuvat sattumalta myös ID3-tunnisteen sisään, ja
  // väärästä kohdasta aloitettu ketju katkeaa heti ensimmäiseen
  // kehykseen. Siksi alkukohdaksi kelpaa vasta kohta, josta kolme
  // peräkkäistä kehystä jäsentyy.
  const ketju = (kohta) => {
    let p = kohta;
    for (let n = 0; n < 3; n += 1) {
      const k = kehys(puskuri, p);
      if (!k) return false;
      p += k.pituus;
      if (p > puskuri.length) return n >= 1; // tiedosto loppuu — lyhyt mutta kelpo
    }
    return true;
  };
  let ensimmainen = -1;
  for (let i = alkuOffset; i < Math.min(puskuri.length, alkuOffset + 65536); i += 1) {
    if (kehys(puskuri, i) && ketju(i)) { ensimmainen = i; break; }
  }
  if (ensimmainen < 0) return null;

  let kohta = ensimmainen;
  let kesto = 0;
  let kehyksia = 0;
  while (kohta < puskuri.length) {
    const k = kehys(puskuri, kohta);
    if (!k || kesto + k.kesto > maxSekuntia) break;
    kesto += k.kesto;
    kohta += k.pituus;
    kehyksia += 1;
  }
  if (kohta >= puskuri.length) return null; // koko tiedosto mahtuu — ei leikattavaa
  // Silmukka katkeaa vasta rajan kohdalla, joten selvästi lyhyemmäksi jäänyt
  // kesto tarkoittaa, ettei kehysjono jäsentynytkään loppuun asti. Silloin
  // tiedosto on parempi jättää koskematta kuin katkaista arvaamalla.
  if (kesto < maxSekuntia * 0.9) return null;

  // Tiedoston alku otetaan mukaan sellaisenaan: siinä ovat ID3-tunniste
  // ja mahdollinen Xing-kehys, joita soitin tarvitsee.
  const ulos = Buffer.from(puskuri.subarray(0, kohta));
  const xing = xingKohta(ulos, alkuOffset);
  if (xing >= 0 && xing + 16 <= ulos.length) {
    const liput = ulos.readUInt32BE(xing + 4);
    let p = xing + 8;
    if (liput & 1) { ulos.writeUInt32BE(kehyksia, p); p += 4; }
    if (liput & 2) ulos.writeUInt32BE(ulos.length - alkuOffset, p);
    // Hakutaulukko osoittaa alkuperäisen tiedoston kohtiin, jotka
    // leikkauksen jälkeen ovat tiedoston ulkopuolella. Lippu pois, jolloin
    // soitin arvioi haun tasaisesti uudesta pituudesta.
    ulos.writeUInt32BE(liput & ~4, xing + 4);
  }
  return { puskuri: ulos, kesto: Math.round(kesto) };
}
