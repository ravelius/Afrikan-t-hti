/*
 * Luo nopan lepovarjon: lyijykynällä vedetyn näköinen vinoviivoitus,
 * kuten sarjakuvassa. Tuloste liitetään css/styles.css-tiedostoon
 * .die-shadow::after -säännön taustakuvaksi (data-URI, jotta myös
 * yhden tiedoston standalone-versio toimii).
 *
 * Aja:  node tools/make-die-shadow.mjs
 *
 * Siemen on kiinteä, joten sama komento tuottaa aina saman kuvion.
 * Varjo on staattinen — sitä ei animoida, se vain piirtyy esiin kun
 * noppa on pysähtynyt (die.js lisää .levossa-luokan).
 */
let s = 20260801;
const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
const v = (a, b) => a + r() * (b - a);

const W = 132, H = 64;
const cx = W / 2, cy = H / 2;
const rx = W / 2 - 4, ry = H / 2 - 4;

// Viivoitussuunta ellipsin normalisoidussa avaruudessa (ympyrä),
// jotta viivat katkeavat siististi ellipsin reunaan.
const kulma = (-32 * Math.PI) / 180;
let ux = Math.cos(kulma) / rx, uy = Math.sin(kulma) / ry;
const pit = Math.hypot(ux, uy); ux /= pit; uy /= pit;
const nx = -uy, ny = ux;

const P = (px, py) => [cx + px * rx, cy + py * ry];
const polut = [];
const veda = (t, paksuus, peitto, lyh) => {
  const puoli = Math.sqrt(Math.max(0, 1 - t * t));
  if (puoli < 0.05) return;
  const a = puoli * lyh.a, b = puoli * lyh.b;
  const [x1, y1] = P(nx * t + ux * -a + v(-0.02, 0.02), ny * t + uy * -a + v(-0.04, 0.04));
  const [x2, y2] = P(nx * t + ux * b + v(-0.02, 0.02), ny * t + uy * b + v(-0.04, 0.04));
  // Käsi ei vedä suoraan: pieni kaari keskelle.
  const kx = (x1 + x2) / 2 + v(-2, 2);
  const ky = (y1 + y2) / 2 + v(-1.6, 1.6);
  polut.push(`<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}Q${kx.toFixed(1)} ${ky.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke-width="${paksuus.toFixed(2)}" opacity="${peitto.toFixed(2)}"/>`);
};

/*
 * Viivoja on tarkoituksella vähän ja ne ovat paksuja: kuvio piirtyy
 * noin 45–75 pikselin levyisenä, joten ohuet viivat hukkuisivat
 * harmaaksi utuksi eivätkä näyttäisi kynänjäljeltä.
 *
 * Tummuus painottuu keskelle: siinä on nopan kosketuskohta, ja reunoja
 * kohti jälki kevenee kuten kynällä varjostaessa. Nopan kuutio peittää
 * kuvion yläosan, joten näkyviin jää alareunan kaari.
 */
for (let t = -0.94; t <= 0.94; t += 0.13) {
  const keskella = 1 - Math.abs(t - 0.08);
  const peitto = 0.34 + keskella * 0.54 + v(-0.07, 0.07);
  veda(t + v(-0.02, 0.02), v(2.2, 4.2), Math.min(0.92, peitto),
    { a: v(0.7, 1.0), b: v(0.7, 1.0) });
}
// Pari lyhyttä tihennysvetoa keskelle, kuten sarjakuvassa tummennetaan.
for (let i = 0; i < 3; i++) {
  const t = v(-0.4, 0.3);
  veda(t, v(2.4, 4.0), v(0.4, 0.7), { a: v(0.35, 0.65), b: v(0.35, 0.65) });
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">`
  + `<g fill="none" stroke="#2c1e0e" stroke-linecap="round">${polut.join('')}</g></svg>`;

console.log('viivoja:', polut.length, 'merkkejä:', svg.length);
const uri = `url("data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22')}")`;
console.log('uri-pituus:', uri.length);
