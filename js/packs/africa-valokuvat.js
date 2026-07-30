// Vanhat valokuvat muistikirjan tueksi: yksi aikakauden mustavalkokuva
// per kaupunki sieltä, mistä sellainen löytyi vapaalla lisenssillä.
// Kuvat haetaan Wikimedia Commonsista (Special:FilePath skaalaa suoraan),
// lisenssi on varmistettu tiedostokohtaisesti (PD / CC0 / CC BY-SA) ja
// lähde näytetään postikortin kuvatekstissä. Ilman verkkoa pikkukuva jää
// siististi pois. Kaupungit, joille kelvollista vanhaa kuvaa ei vielä
// löytynyt, puuttuvat listalta — niitä täydennetään kun hyvä löytyy.
export const AFRICA_VALOKUVAT = {
  tanger: { tiedosto: 'Tangier Grand Mosque 1900s.jpg', vuosi: '1900-luvun alku', lahde: 'Wikimedia Commons (PD)' },
  kairo: { tiedosto: 'Kairo, marchands ambulants LCCN2017657437.jpg', vuosi: '1890-luku', lahde: 'Photoglob / Library of Congress (PD)' },
  tripoli: { tiedosto: 'Arabs in Tripoli WDL2444.png', vuosi: '1910-luku', lahde: 'World Digital Library (PD)' },
  murzuk: { tiedosto: 'Osmanisches Fort von Mursuk.jpg', vuosi: null, lahde: 'Wikimedia Commons (PD)' },
  alkufra: { tiedosto: 'Kufra (aeroview).jpg', vuosi: 'noin 1930', lahde: 'Wikimedia Commons (PD)' },
  gao: { tiedosto: 'ETH-BIB-Grabmal von Askia, Gao-Tschadseeflug 1930-31-LBS MH02-08-0548.tif', vuosi: '1930–31', lahde: 'Walter Mittelholzer / ETH-Bibliothek (PD)' },
  dakar: { tiedosto: 'Dakar mosque circa 1900.jpg', vuosi: 'noin 1900', lahde: 'Edmond Fortier (PD)' },
  sierraleone: { tiedosto: 'Cotton Tree Railway Station 3.30 p.m. Bungalow Train, Freetown.jpg', vuosi: '1910-luku', lahde: 'Lisk-Carew Brothers (PD)' },
  kappalmas: { tiedosto: 'HEARD(1898) 50 Church of Harper, Cape Palmas.jpg', vuosi: '1898', lahde: 'W. H. Heard (PD)' },
  kumasi: { tiedosto: 'Kumasi 28-03-1900 sx.jpg', vuosi: '1900', lahde: 'Wikimedia Commons (PD)' },
  orjarannikko: { tiedosto: 'São João Baptista de Ajudá 1920s.jpg', vuosi: '1920-luku', lahde: 'Wikimedia Commons (PD)' },
  kano: { tiedosto: 'View-Kano city-1911.jpg', vuosi: '1911', lahde: 'E. D. Morel (PD)' },
  kongo: { tiedosto: 'Livingstone steamer, Congo, ca. 1902-1915 (IMP-CSCNWW33-OS10-73).jpg', vuosi: '1902–1915', lahde: 'Wikimedia Commons (PD)' },
  angola: { tiedosto: "Saint-Paul de Luanda, port de (l')Angola dans le Portugal africain (vue générale) - btv1b6932475d.jpg", vuosi: '1914', lahde: 'Agence Rol / BnF (PD)' },
  kapkaupunki: { tiedosto: 'Cape Town tram, Adderley Street - ca. 1900.jpg', vuosi: 'noin 1900', lahde: 'Wikimedia Commons (PD)' },
  kimberley: { tiedosto: 'Twee gezichten op de mijn Die Groot Gat te Kimberley Diamond fields-Kimberley mine (titel op object) Diamond fields-Tramway, Kimberley mine (titel op object), RP-F-2001-7-425-25.jpg', vuosi: 'noin 1870', lahde: 'Rijksmuseum (CC0)' },
  madagaskar: { tiedosto: "Tananarive-Temple d'Andohalo.jpg", vuosi: 'noin 1900', lahde: 'Wikimedia Commons (PD)' },
  sansibar: { tiedosto: 'Panorama van de haven van Zanzibar Panorama of Zanzibar (titel op object) Zanzibar (titel op object), RP-F-F00999-DD.jpg', vuosi: 'noin 1900', lahde: 'Rijksmuseum (CC0)' },
  kilimandzaro: { tiedosto: 'Bundesarchiv Bild 105-DOA0437, Deutsch-Ostafrika, Kilimandscharo, Gummiplantage.jpg', vuosi: '1906–1918', lahde: 'W. Dobbertin / Bundesarchiv (CC BY-SA 3.0 de)' },
  tanganjika: { tiedosto: 'Memorial tablet marking the spot where Livingstone and Stanley met at Ujiji in 1871 ATLIB 305982.png', vuosi: '1903', lahde: 'A. P. Godber (PD)' },
  addisabeba: { tiedosto: 'British delegation Addis Abeba.jpg', vuosi: '1930', lahde: 'Wikimedia Commons (PD)' },
  rashafun: { tiedosto: 'Garesadihafun.jpg', vuosi: '1900-luvun alku', lahde: 'Wikimedia Commons (PD)' },
};

/** Commonsin suora kuvaosoite haluttuun leveyteen skaalattuna. */
export function valokuvaUrl(tiedosto, leveys) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(tiedosto)}?width=${leveys}`;
}
