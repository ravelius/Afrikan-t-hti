/*
 * Sää lehden etusivulle (omistajan toive 5.8.2026).
 *
 * Kaksi tehtävää:
 *  1. haeSaaTanaan(lat, lon) — päivän ennuste Open-Meteosta.
 *     Avaimeton ja CORS-avoin palvelu; vastaus muistetaan tunnin,
 *     ettei jokainen kortin avaus hae uudestaan. Virhe palauttaa
 *     null — kutsuja näyttää silloin kuukausinormaalin, joka on
 *     staattista dataa ja toimii ilman verkkoa.
 *  2. piirraVuosiSaa(tiedot) — koko vuoden graafi pelin mustekynän
 *     tyylillä: sadepalkit ja keskilämpökäyrä samassa kuvassa,
 *     kuukaudet alareunassa. Palautetaan SVG-elementti, jonka
 *     kutsuja sijoittaa haluamaansa koteloon.
 */

const ENNUSTE_OSOITE = 'https://api.open-meteo.com/v1/forecast';
// Tunti on hyvä tasapaino: ennuste ei vanhene kesken pelisession,
// mutta illalla avattu lehti ei näytä aamun lukemia.
const VALIMUISTI_MS = 60 * 60 * 1000;

/** WMO-koodit suomeksi ja kuvakeryhmäksi (aurinko/pilvi/sade/lumi...). */
const SAAKOODIT = [
  [[0], 'selkeää', 'aurinko'],
  [[1], 'melkein selkeää', 'aurinko'],
  [[2], 'puolipilvistä', 'pilvi'],
  [[3], 'pilvistä', 'pilvi'],
  [[45, 48], 'sumua', 'sumu'],
  [[51, 53, 55, 56, 57], 'tihkusadetta', 'sade'],
  [[61, 63, 65, 66, 67], 'sadetta', 'sade'],
  [[71, 73, 75, 77], 'lumisadetta', 'lumi'],
  [[80, 81, 82], 'sadekuuroja', 'sade'],
  [[85, 86], 'lumikuuroja', 'lumi'],
  [[95, 96, 99], 'ukkosta', 'ukkonen'],
];

export function saaKuvaus(koodi) {
  const rivi = SAAKOODIT.find(([koodit]) => koodit.includes(koodi));
  return rivi ? { teksti: rivi[1], kuvake: rivi[2] } : { teksti: '', kuvake: 'pilvi' };
}

/** Pienet viivakuvakkeet (24×24, pelkkä ääriviiva) särivin alkuun. */
export const SAA_IKONIT = {
  aurinko: '<circle cx="12" cy="12" r="4.4"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8"/>',
  pilvi: '<path d="M7 17.5h9.6a3.4 3.4 0 0 0 .5-6.8 5 5 0 0 0-9.8-1.1A3.9 3.9 0 0 0 7 17.5Z"/>',
  sade: '<path d="M7 14.5h9.6a3.4 3.4 0 0 0 .5-6.8 5 5 0 0 0-9.8-1.1A3.9 3.9 0 0 0 7 14.5Z"/><path d="M8.5 17.2l-1 2.6M12.4 17.2l-1 2.6M16.3 17.2l-1 2.6"/>',
  lumi: '<path d="M7 14.5h9.6a3.4 3.4 0 0 0 .5-6.8 5 5 0 0 0-9.8-1.1A3.9 3.9 0 0 0 7 14.5Z"/><path d="M8.4 18.2h.01M12.2 19.6h.01M15.9 18.2h.01" stroke-linecap="round" stroke-width="2.2"/>',
  sumu: '<path d="M4.5 9.5h15M3.5 13h17M5.5 16.5h13"/>',
  ukkonen: '<path d="M7 13.5h9.6a3.4 3.4 0 0 0 .5-6.8 5 5 0 0 0-9.8-1.1A3.9 3.9 0 0 0 7 13.5Z"/><path d="M12.8 15.5 10.6 19h2.6l-1.8 3"/>',
};

const KUUKAUDET_SSA = [
  'tammikuussa', 'helmikuussa', 'maaliskuussa', 'huhtikuussa',
  'toukokuussa', 'kesäkuussa', 'heinäkuussa', 'elokuussa',
  'syyskuussa', 'lokakuussa', 'marraskuussa', 'joulukuussa',
];

export function kuukausiSsa(indeksi) {
  return KUUKAUDET_SSA[indeksi] ?? '';
}

/*
 * Muisti elää sivun ajan; localStorage säilyttäisi pidempään, mutta
 * tunnin ikkunassa siitä ei ole hyötyä ja tallennustila on pelin
 * tallennuksille.
 */
const valimuisti = new Map();

/**
 * Päivän ennuste: { lampotila, ylin, alin, sademaara, koodi } tai null.
 */
export async function haeSaaTanaan(lat, lon) {
  const avain = `${lat},${lon}`;
  const vanha = valimuisti.get(avain);
  if (vanha && Date.now() - vanha.aika < VALIMUISTI_MS) return vanha.saa;
  try {
    const osoite = `${ENNUSTE_OSOITE}?latitude=${lat}&longitude=${lon}`
      + '&current=temperature_2m,weather_code'
      + '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum'
      + '&timezone=auto&forecast_days=1';
    const vastaus = await fetch(osoite, { signal: AbortSignal.timeout(8000) });
    if (!vastaus.ok) return null;
    const data = await vastaus.json();
    const saa = {
      lampotila: Math.round(data.current?.temperature_2m ?? NaN),
      koodi: data.current?.weather_code ?? null,
      ylin: Math.round(data.daily?.temperature_2m_max?.[0] ?? NaN),
      alin: Math.round(data.daily?.temperature_2m_min?.[0] ?? NaN),
      sademaara: data.daily?.precipitation_sum?.[0] ?? null,
    };
    if (!Number.isFinite(saa.lampotila)) return null;
    valimuisti.set(avain, { aika: Date.now(), saa });
    return saa;
  } catch {
    return null;
  }
}

/**
 * Koko vuoden graafi: sadepalkit (muste, himmeä) ja keskilämpökäyrä
 * (kulta) päällekkäin. Asteikot molemmin puolin, kuukausien
 * alkukirjaimet alhaalla. Mitoitus on kiinteä viewBox — SVG skaalautuu
 * koteloonsa, ja tekstikoot on valittu sen mukaan.
 */
export function piirraVuosiSaa({ keskilampo, sade }) {
  const NS = 'http://www.w3.org/2000/svg';
  const L = 300; const K = 170;
  const vasen = 30; const oikea = 268; const yla = 14; const ala = 140;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${L} ${K}`);
  svg.setAttribute('class', 'vuosisaa');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Keskilämpötila ja sademäärä kuukausittain');
  const el = (nimi, attrs, teksti = null) => {
    const e = document.createElementNS(NS, nimi);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (teksti != null) e.textContent = teksti;
    svg.appendChild(e);
    return e;
  };

  // Asteikot: lämpö pyöristetään viiden, sade viidenkymmenen tarkkuuteen.
  const lampoYla = Math.max(10, Math.ceil(Math.max(...keskilampo) / 5) * 5);
  const lampoAla = Math.min(0, Math.floor(Math.min(...keskilampo) / 5) * 5);
  const sadeYla = Math.max(50, Math.ceil(Math.max(...sade) / 50) * 50);
  const lampoY = (aste) => ala - ((aste - lampoAla) / (lampoYla - lampoAla)) * (ala - yla);
  const sadeY = (mm) => ala - (mm / sadeYla) * (ala - yla);
  const askel = (oikea - vasen) / 12;

  // Sadepalkit ensin, jotta käyrä piirtyy niiden päälle.
  sade.forEach((mm, i) => {
    el('rect', {
      class: 'saa-palkki',
      x: (vasen + i * askel + askel * 0.18).toFixed(1),
      y: sadeY(mm).toFixed(1),
      width: (askel * 0.64).toFixed(1),
      height: (ala - sadeY(mm)).toFixed(1),
    });
  });

  // Apuviivat ja lämpöasteikko vasemmalle.
  for (let aste = lampoAla; aste <= lampoYla; aste += 10) {
    el('line', {
      class: 'saa-apuviiva', x1: vasen, y1: lampoY(aste), x2: oikea, y2: lampoY(aste),
    });
    el('text', { class: 'saa-akseli', x: vasen - 4, y: lampoY(aste) + 3, 'text-anchor': 'end' }, `${aste}°`);
  }
  // Sadeasteikko oikealle: nolla on jo lämpöasteikossa, joten vain
  // puoliväli ja yläraja.
  for (const mm of [sadeYla / 2, sadeYla]) {
    el('text', { class: 'saa-akseli', x: oikea + 4, y: sadeY(mm) + 3 }, `${mm}`);
  }
  el('text', { class: 'saa-akseli', x: oikea + 4, y: ala + 3 }, 'mm');

  // Keskilämpökäyrä pisteineen.
  const pisteet = keskilampo.map((aste, i) => `${(vasen + i * askel + askel / 2).toFixed(1)},${lampoY(aste).toFixed(1)}`);
  el('polyline', { class: 'saa-viiva', points: pisteet.join(' ') });
  keskilampo.forEach((aste, i) => {
    el('circle', {
      class: 'saa-piste',
      cx: (vasen + i * askel + askel / 2).toFixed(1),
      cy: lampoY(aste).toFixed(1),
      r: 2.1,
    });
  });

  // Kuukausien alkukirjaimet.
  'THMHTKHESLMJ'.split('').forEach((kirjain, i) => {
    el('text', {
      class: 'saa-akseli',
      x: (vasen + i * askel + askel / 2).toFixed(1),
      y: ala + 12,
      'text-anchor': 'middle',
    }, kirjain);
  });
  el('line', { class: 'saa-pohjaviiva', x1: vasen, y1: ala, x2: oikea, y2: ala });
  return svg;
}
