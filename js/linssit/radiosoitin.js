/*
 * Vanhan ajan radiosoitin ruudun alalaitaan.
 *
 * Maailmanradio-tilassa kartan kaupungit ovat play-nappeja: painallus
 * käynnistää sen maan kanavan. Tämä tiedosto on se laite, jonka pelaaja
 * näkee alalaidassa — puinen 1930-luvun putkiradio, jossa on
 * kaiutinsäleikkö, asemakaupunkien asteikko, kaksi nuppia ja aukko
 * pistematriisinäytölle.
 *
 * TÄMÄ MODUULI EI SOITA ÄÄNTÄ. Se on pelkkä laite: se näyttää tilan ja
 * kertoo painalluksista takaisinkutsuilla. Syy on sama kuin
 * linssimoottorissa (docs/linssit-suunnitelma.md luku 2.6): äänet ovat
 * js/sound.js:n hallussa, ja kaksi paikkaa, jotka molemmat pysäyttävät
 * saman virran, päätyy ennen pitkää eri mieltä siitä kumpi soi.
 *
 * OMA TYYLITIEDOSTO. Soitin lataa css/radio.css itse (ks. lataaTyyli).
 * css/styles.css on toisen työvaiheen hallussa, eikä yhteen tiedostoon
 * kirjoita kaksi tekijää yhtä aikaa. Sivun ei siis tarvitse tietää
 * soittimesta mitään muuta kuin mihin sen juuri liitetään.
 *
 * Sallitut tuonnit ovat samat kuin linssimoduulilla: vain ../mapart.js.
 * js/ui.js:n tai js/game.js:n tuonti tekisi kiertoviittauksen.
 */

import { hash01 } from '../mapart.js';

/*
 * Soittimen tilat. Neljä riittää, ja niiden on oltava neljä eikä
 * kolme: ilman omaa "virittaa"-tilaa suoran lähetyksen ensimmäiset
 * sekunnit näyttäisivät täsmälleen samalta kuin rikkinäinen asema.
 */
export const RADION_TILAT = Object.freeze(['sammuksissa', 'virittaa', 'soi', 'virhe']);

/*
 * Kauanko "VIRITTÄÄ..." saa kestää, ennen kuin soitin myöntää ettei
 * asemaa kuulu.
 *
 * Suora lähetys avautuu tyypillisesti 1–3 sekunnissa, mutta kaukainen
 * palvelin voi ottaa kymmenenkin. Kaksitoista sekuntia antaa hitaalle
 * asemalle mahdollisuuden ja katkaisee silti ikuisen odotuksen: rikki
 * mennyt lähetysosoite ei useinkaan anna virhettä lainkaan, vaan jää
 * auki hiljaisena — ja hiljaisuus on juuri se, mikä saa laitteen
 * näyttämään rikkinäiseltä (omistajan huomio).
 */
export const VIRITYKSEN_AIKAKATKAISU_MS = 12000;

/*
 * Näytön aukon kuvasuhde (leveys : korkeus) ja kaksi mittaa, joilla se
 * on toteutettu css/radio.css:ssä.
 *
 * Aukko on toisen tekijän pistematriisinäyttöä varten. Koko on kiinteä
 * eikä venyvä: pisterasteri näyttää siistiltä vain, kun pisteen koko
 * osuu kokonaisiin pikseleihin, ja portaattomasti venyvä aukko takaisi
 * sen, ettei osu koskaan. Kaksi kokoa riittää — puhelin ja muut — ja
 * niillä on sama kuvasuhde, joten sama piirto kelpaa molempiin.
 *
 * Kahdeksaakymmentä pistettä leveä ja kuusitoista korkea rasteri osuu
 * molempiin tasan (340/80 = 4,25 ja 270/80 = 3,375 pikseliä pisteelle).
 */
export const NAYTON_SUHDE = 5;
export const NAYTON_MITAT = Object.freeze({
  leveä: { leveys: 340, korkeus: 68 },   // yli 640 px:n ruutu
  kapea: { leveys: 270, korkeus: 54 },   // enintään 640 px:n ruutu
});

/*
 * Asteikon kaupungit.
 *
 * Nämä ovat oikeita nimiä 1930-luvun eurooppalaisen radion asteikolta:
 * ne olivat aikansa suurten asemien sijaintipaikkoja, ja juuri
 * kaupunkien nimien painaminen taajuusasteikkoon teki laitteesta sen
 * näköisen kuin se oli. Nimet eivät ole kiinni pelin kaupungeissa
 * eivätkä ne osoita nykyistä asemaa — asteikko on koristeltu tausta,
 * jonka päällä viisari liikkuu.
 *
 * Nimiä on yhdeksän eikä viittätoista, koska asteikko on kotelossa 372
 * pikseliä leveä: seitsemän pisteen kirjasimella siihen mahtuu noin 70
 * merkkiä, ja ylimääräiset nimet leikkautuisivat reunasta puoliksi.
 * Kapealla ruudulla joka toinen jää pois (css/radio.css).
 */
const ASTEIKON_KAUPUNGIT = [
  'LAHTI', 'MOTALA', 'HILVERSUM', 'DROITWICH', 'LUXEMBOURG',
  'BEROMÜNSTER', 'WIEN', 'BUDAPEST', 'MOSKVA',
];

/** Näytön oletusrivit tiloittain. Ylärivi kertoo tilan, alarivi tarkennuksen. */
const TILAN_RIVIT = {
  sammuksissa: ['RADIO POIS', 'VALITSE KAUPUNKI'],
  virittaa: ['VIRITTÄÄ...', ''],
  soi: ['', ''],
  virhe: ['EI KUULU', ''],
};

/** Tyylilinkin tunniste, jotta linkki syntyy tasan kerran sivua kohti. */
const TYYLIN_TUNNUS = 'radiosoittimen-tyyli';

/**
 * Liittää css/radio.css sivuun, jos sitä ei vielä ole.
 *
 * Osoite lasketaan moduulin omasta sijainnista eikä kirjoiteta
 * suhteellisena merkkijonona: peli ajetaan myös GitHub Pagesin
 * alihakemistosta, jossa 'css/radio.css' osoittaisi väärään paikkaan
 * riippuen siitä, mikä sivu on auki.
 */
function lataaTyyli() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(TYYLIN_TUNNUS)) return;
  let osoite = 'css/radio.css';
  try {
    osoite = new URL('../../css/radio.css', import.meta.url).href;
  } catch {
    // import.meta.url ei ole käytettävissä (esim. koottu yksi tiedosto).
    // Suhteellinen osoite on silloin paras arvaus; tyylin puuttuminen ei
    // riko soitinta, se näyttää vain karulta.
  }
  const linkki = document.createElement('link');
  linkki.id = TYYLIN_TUNNUS;
  linkki.rel = 'stylesheet';
  linkki.href = osoite;
  document.head.appendChild(linkki);
}

/** Pieni apuri: elementti luokalla ja tekstillä. */
function osa(tagi, luokka, teksti = '') {
  const solmu = document.createElement(tagi);
  if (luokka) solmu.className = luokka;
  if (teksti) solmu.textContent = teksti;
  return solmu;
}

/**
 * Viisarin paikka asteikolla, 4–96 % kotelon leveydestä.
 *
 * Paikka lasketaan aseman nimestä eikä arvota: sama asema löytyy aina
 * samasta kohdasta asteikkoa. Se on koko yksityiskohdan pointti — arvottu
 * viisari näyttäisi siltä, että laite unohtaa mihin se on viritetty.
 * Reunoihin jätetään vara, jottei viisari mene kotelon listan alle.
 */
function viisarinPaikka(avain) {
  if (!avain) return 50;
  return 4 + hash01(String(avain)) * 92;
}

/**
 * Rakentaa radiosoittimen ja palauttaa sen ohjaimen.
 *
 * Valinnat:
 *   onStop()            — iso nuppi painettu; kutsuja pysäyttää äänen.
 *   onAani(arvo)        — äänenvoimakkuus 0–1 muuttui.
 *   onAikakatkaisu()    — viritys kesti liian kauan; kutsuja sulkee virran.
 *   viritysAika         — aikakatkaisu millisekunteina (oletus 12 s).
 *   aani                — aloitusäänenvoimakkuus 0–1 (oletus 0,8).
 *
 * Palauttaa:
 *   juuri               — elementti, jonka kutsuja liittää haluamaansa
 *                         paikkaan (soitin asemoi itsensä alalaitaan).
 *   naytaKanava(tiedot) — { asema, maa, kaupunki } tai null.
 *   asetaTila(tila, viesti)
 *   asetaNaytto(elementti) — pistematriisinäyttö aukkoon.
 *   asetaAani(arvo)
 *   poista()
 */
export function teeRadiosoitin({
  onStop = null,
  onAani = null,
  onAikakatkaisu = null,
  viritysAika = VIRITYKSEN_AIKAKATKAISU_MS,
  aani = 0.8,
} = {}) {
  lataaTyyli();

  const juuri = osa('div', 'radiosoitin');
  juuri.dataset.tila = 'sammuksissa';
  // Soitin on laite eikä ilmoitus: ruudunlukija saa kertoa sen sisällön
  // pyydettäessä, mutta tilamuutokset luetaan vain tilarivistä (alla).
  juuri.setAttribute('role', 'group');
  juuri.setAttribute('aria-label', 'Maailmanradio');

  const kotelo = osa('div', 'radio-kotelo');
  juuri.appendChild(kotelo);

  // --- kaiutinsäleikkö -------------------------------------------------
  // Kangas ja sen päälle listat tehdään kokonaan CSS-kuvioina: kuvatiedosto
  // olisi yksi lisälataus siitä, mikä on kaksi toistuvaa gradienttia.
  const kaiutin = osa('div', 'radio-kaiutin');
  kaiutin.setAttribute('aria-hidden', 'true');
  kaiutin.appendChild(osa('span', 'radio-kilpi', 'MATKAKIRJA'));
  kotelo.appendChild(kaiutin);

  // --- keskiö: näyttö, asteikko ja kanavan tiedot ----------------------
  const keskio = osa('div', 'radio-keskio');
  kotelo.appendChild(keskio);

  const naytonKehys = osa('div', 'radio-naytto-kehys');
  const naytto = osa('div', 'radio-naytto');
  /*
   * Aukko on toisen tekijän. Nämä kaksi tietoa ovat sen rajapinta:
   * data-tila kertoo mitä laite tekee ja data-rivit mitä siinä lukee.
   * Lisäksi jokaisesta muutoksesta lähtee tapahtuma 'radio-naytto',
   * jotta näytön ei tarvitse tarkkailla attribuutteja.
   */
  naytto.dataset.tila = 'sammuksissa';
  const naytonVara = osa('div', 'radio-naytto-vara');
  const varaYla = osa('span', 'radio-naytto-rivi radio-naytto-yla');
  const varaAla = osa('span', 'radio-naytto-rivi radio-naytto-ala');
  naytonVara.append(varaYla, varaAla);
  naytto.appendChild(naytonVara);
  naytonKehys.appendChild(naytto);

  // Merkkivalo on tieto eikä koriste: se palaa vain kun ääntä todella
  // tulee, joten pelaaja erottaa soivan laitteen viritettävästä.
  const lamppu = osa('span', 'radio-lamppu');
  lamppu.setAttribute('aria-hidden', 'true');
  naytonKehys.appendChild(lamppu);
  keskio.appendChild(naytonKehys);

  // --- asteikko --------------------------------------------------------
  const asteikko = osa('div', 'radio-asteikko');
  asteikko.setAttribute('aria-hidden', 'true');
  const nimet = osa('div', 'radio-kaupungit');
  for (const nimi of ASTEIKON_KAUPUNGIT) nimet.appendChild(osa('span', 'radio-kaupunki', nimi));
  asteikko.appendChild(nimet);
  const viisari = osa('div', 'radio-viisari');
  viisari.style.left = '50%';
  asteikko.appendChild(viisari);
  keskio.appendChild(asteikko);

  // --- kanavan tiedot selkokielellä ------------------------------------
  /*
   * Sama tieto on näytössä, mutta näyttö on pistematriisi: siihen mahtuu
   * lyhyt versio isoin kirjaimin. Aseman koko nimi ja maa luetaan tästä
   * rivistä, ja ruudunlukija saa muutokset tästä (aria-live) — näyttöä se
   * ei osaa lukea.
   */
  const tiedot = osa('p', 'radio-kanava');
  tiedot.setAttribute('aria-live', 'polite');
  const asemaNimi = osa('span', 'radio-asema');
  const maaNimi = osa('span', 'radio-maa');
  tiedot.append(asemaNimi, maaNimi);
  keskio.appendChild(tiedot);

  // --- nupit -----------------------------------------------------------
  const nupit = osa('div', 'radio-nupit');
  kotelo.appendChild(nupit);

  const stopKehys = osa('div', 'radio-nuppi-kehys');
  const stop = document.createElement('button');
  stop.type = 'button';
  stop.className = 'radio-nuppi radio-stop';
  stop.setAttribute('aria-label', 'Pysäytä radio');
  stop.appendChild(osa('span', 'radio-nuppi-uurre'));
  stop.appendChild(osa('span', 'radio-nuppi-osoitin'));
  stopKehys.append(stop, osa('span', 'radio-nuppi-teksti', 'STOP'));
  nupit.appendChild(stopKehys);

  const aaniKehys = osa('div', 'radio-nuppi-kehys radio-nuppi-kehys-pieni');
  const aaniNuppi = osa('div', 'radio-nuppi radio-aani');
  aaniNuppi.tabIndex = 0;
  aaniNuppi.setAttribute('role', 'slider');
  aaniNuppi.setAttribute('aria-label', 'Äänenvoimakkuus');
  aaniNuppi.setAttribute('aria-valuemin', '0');
  aaniNuppi.setAttribute('aria-valuemax', '100');
  aaniNuppi.appendChild(osa('span', 'radio-nuppi-uurre'));
  const aaninOsoitin = osa('span', 'radio-nuppi-osoitin');
  aaniNuppi.appendChild(aaninOsoitin);
  aaniKehys.append(aaniNuppi, osa('span', 'radio-nuppi-teksti', 'ÄÄNI'));
  nupit.appendChild(aaniKehys);

  // --- tila ------------------------------------------------------------
  let nykyinenTila = 'sammuksissa';
  let nykyinenKanava = null;
  let vahti = 0;
  let aaniArvo = Math.min(1, Math.max(0, Number(aani) || 0));
  // Asetetun näytön oma kirjoitusfunktio, jos sellainen annettiin.
  let naytonKirjoitin = null;

  /** Katkaisee viritysvahdin. Kutsutaan jokaisessa tilanvaihdossa. */
  function nollaaVahti() {
    if (!vahti) return;
    clearTimeout(vahti);
    vahti = 0;
  }

  /** Kertoo näytölle mitä siinä lukee — sekä attribuutteina että tapahtumana. */
  function paivitaNaytto(tila, rivit) {
    const [yla, ala] = rivit;
    naytto.dataset.tila = tila;
    naytto.dataset.rivit = JSON.stringify([yla, ala]);
    varaYla.textContent = yla;
    varaAla.textContent = ala;
    try {
      naytonKirjoitin?.([yla, ala]);
    } catch (syy) {
      // Rikkinäinen näyttö ei saa kaataa soitinta: laite jää näyttämään
      // vanhaa tekstiä, mutta stop-nappi toimii yhä.
      console.warn('Radion näytön kirjoitus epäonnistui.', syy);
    }
    naytto.dispatchEvent(new CustomEvent('radio-naytto', {
      bubbles: false,
      detail: { tila, rivit: [yla, ala] },
    }));
  }

  /** Näytön rivit nykytilalle ja -kanavalle. */
  function rivit(tila) {
    const pohja = TILAN_RIVIT[tila] ?? TILAN_RIVIT.sammuksissa;
    const asema = (nykyinenKanava?.asema ?? '').toUpperCase();
    const paikka = [nykyinenKanava?.kaupunki, nykyinenKanava?.maa]
      .filter(Boolean).join(' · ').toUpperCase();
    if (tila === 'soi') return [asema || 'SUORA LÄHETYS', paikka];
    if (tila === 'virittaa') return [pohja[0], asema];
    if (tila === 'virhe') return [pohja[0], asema || pohja[1]];
    return pohja;
  }

  /**
   * Vaihtaa tilan. viesti korvaa näytön alarivin, kun kutsujalla on
   * tarkempi syy kerrottavana ("VERKKO POIKKI", "ASEMA EI VASTAA").
   */
  function asetaTila(tila, viesti = '') {
    const uusi = RADION_TILAT.includes(tila) ? tila : 'sammuksissa';
    nollaaVahti();
    nykyinenTila = uusi;
    juuri.dataset.tila = uusi;
    // Stop-nappi ei ole painettavissa, kun mitään ei ole pysäytettävänä:
    // toimimaton nappi saa laitteen näyttämään rikkinäiseltä.
    stop.disabled = uusi === 'sammuksissa';

    const nayta = rivit(uusi);
    if (viesti) nayta[1] = String(viesti).toUpperCase();
    paivitaNaytto(uusi, nayta);

    /*
     * Ruudunlukijalle tila sanoin. Sama teksti näkyy myös silmällä, jos
     * kanavaa ei vielä tiedetä — muuten aseman nimi on tärkeämpi.
     */
    if (uusi === 'virittaa') maaNimi.textContent = 'Virittää…';
    else if (uusi === 'virhe') maaNimi.textContent = viesti ? String(viesti) : 'Asemaa ei kuulu';
    else if (uusi === 'sammuksissa') maaNimi.textContent = 'Valitse kaupunki kartalta';
    else maaNimi.textContent = [nykyinenKanava?.kaupunki, nykyinenKanava?.maa]
      .filter(Boolean).join(' · ');

    if (uusi === 'virittaa' && viritysAika > 0) {
      vahti = setTimeout(() => {
        vahti = 0;
        // Rehellinen loppu ikuiselle odotukselle: laite kertoo ettei
        // asema vastaa, ja kutsuja saa sulkea virran omalta puoleltaan.
        asetaTila('virhe', 'Asema ei vastaa');
        try {
          onAikakatkaisu?.();
        } catch (syy) {
          console.warn('Radiosoittimen aikakatkaisun käsittely epäonnistui.', syy);
        }
      }, viritysAika);
    }
    return uusi;
  }

  /**
   * Näyttää kanavan tiedot. null tyhjentää.
   *
   * Tilaa tämä ei vaihda: kutsuja tietää, onko ääni jo käynnissä vai
   * vasta viritettävänä, eikä soittimen pidä arvata sitä.
   */
  function naytaKanava(kanava) {
    nykyinenKanava = kanava && typeof kanava === 'object' ? kanava : null;
    asemaNimi.textContent = nykyinenKanava?.asema ?? '';
    // Viisari asettuu aseman mukaan; ilman asemaa se jää keskelle.
    viisari.style.left = `${viisarinPaikka(nykyinenKanava?.asema ?? nykyinenKanava?.maa)}%`;
    // Sama tila uudelleen kirjoittaa näytön ja tekstirivin tuoreilla tiedoilla.
    const nayta = rivit(nykyinenTila);
    paivitaNaytto(nykyinenTila, nayta);
    if (nykyinenTila === 'soi' || nykyinenTila === 'virittaa') {
      maaNimi.textContent = nykyinenTila === 'virittaa'
        ? 'Virittää…'
        : [nykyinenKanava?.kaupunki, nykyinenKanava?.maa].filter(Boolean).join(' · ');
    }
    return nykyinenKanava;
  }

  /**
   * Panee pistematriisinäytön aukkoon.
   *
   * Ottaa vastaan kaksi muotoa:
   *   asetaNaytto(elementti)
   *   asetaNaytto({ juuri, naytaTeksti })   — esim. teePistenaytto()
   *
   * Jälkimmäisessä soitin kutsuu naytaTeksti(rivit) itse jokaisessa
   * muutoksessa. Näin kytkentä on yksi rivi eikä kolme, eikä kumpikaan
   * moduuli tunne toista: tunnistus on muodosta, ei tuonnista.
   *
   * null palauttaa soittimen oman varatekstin — aukko ei saa jäädä
   * tyhjäksi, koska musta kolo näyttää rikkinäiseltä.
   */
  function asetaNaytto(elementti) {
    const solmu = elementti?.juuri ?? elementti;
    naytonKirjoitin = typeof elementti?.naytaTeksti === 'function'
      ? (rivit) => elementti.naytaTeksti(rivit)
      : null;
    naytto.replaceChildren();
    if (solmu) {
      naytto.appendChild(solmu);
      naytto.dataset.oma = 'true';
    } else {
      naytto.appendChild(naytonVara);
      delete naytto.dataset.oma;
    }
    // Uusi näyttö saa heti nykyisen sisällön; muuten se olisi tyhjä
    // siihen asti, kunnes tila sattuu seuraavan kerran vaihtumaan.
    paivitaNaytto(nykyinenTila, rivit(nykyinenTila));
    return naytto;
  }

  /** Äänenvoimakkuus 0–1: nupin asento, aria-arvo ja takaisinkutsu. */
  function asetaAani(arvo, kerro = true) {
    const uusi = Math.min(1, Math.max(0, Number(arvo) || 0));
    aaniArvo = uusi;
    // Nuppi kääntyy ±135°, kuten oikea potentiometri: täysi ympyrä
    // antaisi ymmärtää, että nuppia voi pyörittää loputtomiin.
    aaninOsoitin.style.transform = `rotate(${-135 + uusi * 270}deg)`;
    aaniNuppi.setAttribute('aria-valuenow', String(Math.round(uusi * 100)));
    aaniNuppi.setAttribute('aria-valuetext', `${Math.round(uusi * 100)} prosenttia`);
    if (kerro) {
      try {
        onAani?.(uusi);
      } catch (syy) {
        console.warn('Radiosoittimen äänenvoimakkuuden välitys epäonnistui.', syy);
      }
    }
    return uusi;
  }

  // --- nuppien käyttö ---------------------------------------------------
  stop.addEventListener('click', () => {
    /*
     * Laite sammuu heti eikä vasta kun kutsuja ehtii. Painalluksen ja
     * ruudun välissä ei saa olla viivettä: hiljenevä ääni ilman
     * näkyvää muutosta saa pelaajan painamaan uudelleen.
     */
    asetaTila('sammuksissa');
    try {
      onStop?.();
    } catch (syy) {
      console.warn('Radiosoittimen pysäytys epäonnistui.', syy);
    }
  });

  /*
   * Ääninuppia väännetään pystysuunnassa, ei ympyrää seuraten.
   *
   * Ympyrää seuraava veto on oikeaoppinen mutta hankala sormella: nupin
   * halkaisija on parikymmentä pikseliä, ja kaari sen ympäri karkaa
   * herkästi. Pystyveto toimii, vaikka sormi peittäisi koko nupin.
   * 120 pikseliä = koko asteikko, jolloin pienikin liike on hallittava.
   */
  const VEDON_MATKA = 120;
  let vedonAlku = null;
  aaniNuppi.addEventListener('pointerdown', (tapahtuma) => {
    vedonAlku = { y: tapahtuma.clientY, arvo: aaniArvo };
    aaniNuppi.setPointerCapture?.(tapahtuma.pointerId);
    tapahtuma.preventDefault();
  });
  aaniNuppi.addEventListener('pointermove', (tapahtuma) => {
    if (!vedonAlku) return;
    asetaAani(vedonAlku.arvo + (vedonAlku.y - tapahtuma.clientY) / VEDON_MATKA);
  });
  const lopetaVeto = () => { vedonAlku = null; };
  aaniNuppi.addEventListener('pointerup', lopetaVeto);
  aaniNuppi.addEventListener('pointercancel', lopetaVeto);
  aaniNuppi.addEventListener('keydown', (tapahtuma) => {
    const askel = { ArrowUp: 0.05, ArrowRight: 0.05, ArrowDown: -0.05, ArrowLeft: -0.05 };
    if (tapahtuma.key in askel) {
      asetaAani(aaniArvo + askel[tapahtuma.key]);
      tapahtuma.preventDefault();
    } else if (tapahtuma.key === 'Home') {
      asetaAani(0);
      tapahtuma.preventDefault();
    } else if (tapahtuma.key === 'End') {
      asetaAani(1);
      tapahtuma.preventDefault();
    }
  });

  /** Sammuttaa vahdin ja irrottaa soittimen sivulta. */
  function poista() {
    nollaaVahti();
    juuri.remove();
  }

  // Aloitusasento: nuppi paikalleen ilman takaisinkutsua (kutsuja ei ole
  // pyytänyt äänen muutosta, se vain kertoi lähtöarvon), ja laite pois
  // päältä.
  asetaAani(aaniArvo, false);
  naytaKanava(null);
  asetaTila('sammuksissa');

  return {
    juuri,
    naytonAukko: naytto,
    naytaKanava,
    asetaTila,
    asetaNaytto,
    asetaAani,
    poista,
    get tila() { return nykyinenTila; },
    get aani() { return aaniArvo; },
  };
}
