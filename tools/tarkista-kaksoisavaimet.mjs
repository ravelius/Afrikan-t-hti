/*
 * Etsii kaksoisavaimet pakettitiedostoista.
 *
 *   node tools/tarkista-kaksoisavaimet.mjs
 *
 * Miksi tämä on oma työkalunsa:
 *
 * JS ei valita kaksoisavaimesta vaan pitää jälkimmäisen hiljaa.
 * Aiempi lohko jää tiedostoon näyttämään voimassa olevalta, ja sitä
 * voi muokata pitkään ilman että mikään muuttuu pelissä. Juuri niin
 * kävi europe-saapumiset.js:n Pariisille: kaksi eri kuvausta, joista
 * pelaaja näki vain jälkimmäisen.
 *
 * Kaksi hylättyä yritystä ennen tätä, ja molemmat samasta syystä:
 *
 *  1. Sisennykseen nojaava versio löysi nolla ongelmaa tiedostosta,
 *     jossa niitä oli kaksi. Sama rivi osui sekä "taulu alkaa"- että
 *     "avain"-sääntöön, ja se kumpi tarkistettiin ensin ratkaisi.
 *  2. Aaltosulkupolkuun nojaava versio tulosti tuhansia vääriä
 *     hälytyksiä: taulukon kaikki alkiot saivat saman polun, joten
 *     jokainen kysymys näytti edellisen kaksoiskappaleelta.
 *
 * Molemmat yrittivät rakentaa nimen sille, MISSÄ avain on. Sitä ei
 * tarvita. Kaksoisavain on aina saman sulkuparin sisäinen asia, joten
 * riittää pitää yhtä joukkoa jokaista auki olevaa sulkua kohti.
 * Ei polkuja, ei sisennystä, ei järjestysriippuvuutta.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const HAKEMISTO = 'js/packs';

/**
 * Palauttaa [{ avain, rivi, ensimmainen }] — kaikki avaimet, jotka on
 * määritelty kahdesti samassa oliossa.
 */
export function kaksoisavaimet(koodi) {
  const ulos = [];
  // Yksi joukko per auki oleva sulku. Hakasulku työntää pinoon oman
  // kerroksensa, jotta taulukon sisällä avatut oliot eivät sekoitu.
  const pino = [new Map()];
  let rivi = 1;
  let i = 0;
  while (i < koodi.length) {
    const m = koodi[i];

    if (m === '\n') { rivi++; i++; continue; }

    // rivikommentti
    if (m === '/' && koodi[i + 1] === '/') {
      while (i < koodi.length && koodi[i] !== '\n') i++;
      continue;
    }
    // lohkokommentti
    if (m === '/' && koodi[i + 1] === '*') {
      i += 2;
      while (i < koodi.length && !(koodi[i] === '*' && koodi[i + 1] === '/')) {
        if (koodi[i] === '\n') rivi++;
        i++;
      }
      i += 2;
      continue;
    }
    // merkkijono — sisältö ohitetaan kokonaan, myös sulut ja kaksoispisteet
    if (m === "'" || m === '"' || m === '`') {
      const paate = m;
      i++;
      while (i < koodi.length && koodi[i] !== paate) {
        if (koodi[i] === '\\') i++;
        else if (koodi[i] === '\n') rivi++;
        i++;
      }
      i++;
      continue;
    }

    if (m === '{' || m === '[') { pino.push(new Map()); i++; continue; }
    if (m === '}' || m === ']') { if (pino.length > 1) pino.pop(); i++; continue; }

    /*
     * avain: — tunniste tai lainattu nimi, jota seuraa kaksoispiste.
     *
     * Kaksoispistettä ei saa sekoittaa kolmoisoperaattoriin
     * (ehto ? a : b), joten nimen on alettava erottimen jälkeen.
     */
    const edellinen = koodi[i - 1] ?? '\n';
    if (/[\s{[,]/.test(edellinen)) {
      const avain = koodi.slice(i, i + 200).match(/^(?:([A-Za-z_$][\w$]*)|'([^']*)'|"([^"]*)")\s*:/);
      if (avain) {
        const nimi = avain[1] ?? avain[2] ?? avain[3];
        const taso = pino.at(-1);
        if (taso.has(nimi)) ulos.push({ avain: nimi, rivi, ensimmainen: taso.get(nimi) });
        else taso.set(nimi, rivi);
        i += avain[0].length;
        continue;
      }
    }
    i++;
  }
  return ulos;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  let loydot = 0;
  for (const tiedosto of readdirSync(HAKEMISTO).filter((t) => t.endsWith('.js')).sort()) {
    for (const { avain, rivi, ensimmainen } of kaksoisavaimet(readFileSync(join(HAKEMISTO, tiedosto), 'utf8'))) {
      console.log(`${tiedosto}:${rivi}  ${avain}  — jo rivillä ${ensimmainen}`);
      loydot++;
    }
  }
  console.log(loydot ? `\n${loydot} kaksoisavainta` : '\nei kaksoisavaimia');
  process.exit(loydot ? 1 : 0);
}
