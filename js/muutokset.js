/*
 * Päivitysloki: mitä kussakin versiossa muuttui.
 *
 * Omistajan toive: "Tee erittäin tiivis päivitysloki joka tulee
 * näkyviin klikkaamalla versionumeroa kartalla."
 *
 * ERITTÄIN TIIVIS on tässä muotovaatimus, ei tyyliohje. Yksi rivi per
 * versio, korkeintaan noin 60 merkkiä, ilman versiohistorian tavallista
 * jargonia. Lokia luetaan puhelimen ruudulla kartan päältä, ja jos
 * riviä joutuu vierittämään, se on liian pitkä. Testi vahtii pituuden.
 *
 * Uusin ensin. Uusi rivi lisätään aina versionoston yhteydessä.
 * Vanhat rivit eivät muutu — loki on historia, ei kuvaus nykytilasta.
 */
export const MUUTOKSET = [
  { v: 211, teksti: 'Nipistys zoomaa karttaa kahdella sormella' },
  { v: 211, teksti: 'Korjattu: kartta katkesi kesken kierroksen' },
  { v: 210, teksti: 'Pohjolan merkinnät uusiksi yhden idean malliin' },
  { v: 209, teksti: 'Maailmankartta korvasi vanhan maailman laudan' },
  { v: 209, teksti: 'Maat, rajat ja matkakirja maailmankartalle' },
  { v: 209, teksti: 'Kesken jäänyt peli siirtyy uudelle kartalle' },
  { v: 209, teksti: 'Työhuone laski puutteita liian ankarasti' },
  { v: 208, teksti: 'Helsingin merkintä uusiksi: kaupunki pala palalta' },
  { v: 207, teksti: 'Baltian merkinnät lyhyemmiksi ja selkeämmiksi' },
  { v: 206, teksti: 'Koko maailma yhtenä karttana: 248 kaupunkia' },
  { v: 206, teksti: 'Kartta kiertää ympäri eikä pääty reunaan' },
  { v: 206, teksti: 'Valtameriylitykset yhdistävät mantereet' },
  { v: 206, teksti: 'Kartta latautuu kolmekymmentä kertaa nopeammin' },
  { v: 205, teksti: 'Korjattu: nostojen kuvat puuttuivat iPhonelta' },
  { v: 204, teksti: 'Aiherivi pysyy näkyvissä arkin yläreunassa' },
  { v: 203, teksti: 'Kuvat omissa mittasuhteissaan, ei panoraamana' },
  { v: 203, teksti: 'Aiheen vaihto ei enää hyppää näkymässä' },
  { v: 203, teksti: 'Väljemmät marginaalit Tutki-arkilla' },
  { v: 203, teksti: 'Afrikan pääaarre: Suuren Zimbabwen kivilintu' },
  { v: 202, teksti: 'Arkin reuna piirtyy kuin rantaviiva kartalla' },
  { v: 202, teksti: 'Tutki-kortti täyttää ruudun muistiinpanoarkkina' },
  { v: 202, teksti: 'Aiheliuskat kuvakkeina yhdelle riville' },
  { v: 201, teksti: 'Tutki-ikkunaan kirjanmerkkiliuskat aiheittain' },
  { v: 201, teksti: 'Lontooseen 53 kulttuurinostoa yhdeksään aiheeseen' },
  { v: 200, teksti: 'Työhuone ei enää syö pelin offline-muistia' },
  { v: 200, teksti: 'Turha päivityskehotus pois työhuoneesta' },
  { v: 199, teksti: 'Kaupungin oma ääni soi vihdoin isolla laudalla' },
  { v: 198, teksti: 'Radionapissa aseman nimi ja live-merkki' },
  { v: 198, teksti: 'Vain aidosti vanhat kuvat ovat mustavalkoisia' },
  { v: 198, teksti: 'Kuvat aukeavat isompina työpöytäselaimella' },
  { v: 198, teksti: 'Sisältötarkastus: 15 virhettä pois teksteistä' },
  { v: 198, teksti: 'Pariisin ja Lontoon tekstit vastaavat kertojaa' },
  { v: 197, teksti: 'Laajennussuunnat työhuoneen suunnitelmaan' },
  { v: 196, teksti: 'Työhuoneen karttakehys ei jää soimaan taustalle' },
  { v: 196, teksti: 'Työhuone näyttää peilin ja repojen koot' },
  { v: 196, teksti: 'Äänistudio työhuoneen sisään, oma sivu pois' },
  { v: 195, teksti: 'Äänistudio samaan tyyliin työhuoneen kanssa' },
  { v: 194, teksti: 'Työhuone uusiksi: selkeämpi ja oma sovellus' },
  { v: 193, teksti: 'Tunnusluvut 21 Aasian maalle' },
  { v: 192, teksti: 'Kuvakortit 40 Aasian kaupunkiin' },
  { v: 191, teksti: 'Päivitysloki versionumeron takana' },
  { v: 190, teksti: 'Lipputunnistus uutena kysymysmuotona' },
  { v: 190, teksti: 'Europeana mukaan kuvahakuun' },
  { v: 189, teksti: 'Maiden rajat Aasiaan: 84 maata minikartalla' },
  { v: 188, teksti: 'Omat artikkelit kaikkiin 143 kaupunkiin' },
  { v: 187, teksti: 'Suora radio kaikkiin 87 maahan' },
  { v: 186, teksti: '193 uutta kuvaa päiväkirjan näkymistä' },
  { v: 186, teksti: 'Korjattu: Lue lisää kaatui 69 paikassa' },
  { v: 185, teksti: 'Saapumistekstit kaikkiin 143 kaupunkiin' },
  { v: 185, teksti: 'Kuuntele kieltä soittaa suoraa radiota' },
  { v: 185, teksti: 'Korjattu: Darfurin kuva ei ollut vanha' },
  { v: 184, teksti: 'Kuvakortti keskelle ruutua' },
  { v: 183, teksti: 'Kuvapino kestää useamman kuin kaksi kuvaa' },
  { v: 182, teksti: 'Kuvakortti isommaksi isolla ruudulla' },
  { v: 181, teksti: 'Työhuoneeseen oma välilehti laseille' },
  { v: 180, teksti: 'Noppa takaisin yhdistetylle kartalle' },
  { v: 178, teksti: 'Wiki, ääni ja maa 66 uudelle kaupungille' },
  { v: 176, teksti: 'Kertojan ääni ei enää naksahda lopussa' },
  { v: 174, teksti: 'Korsika kartalle' },
  { v: 172, teksti: 'Tutki-ikkuna mahtuu puhelimen ruudulle' },
  { v: 169, teksti: 'Tiet näkyvät taas iPadilla' },
  { v: 167, teksti: 'Vinjetointi pois kaikilta laitteilta' },
  { v: 166, teksti: 'Kartta ei välky uutta osaa ladatessa' },
  { v: 165, teksti: 'Kartta bittikarttana: sujuva vieritys' },
  { v: 160, teksti: 'Lähizoomaus kaupunkiin saavuttaessa' },
  { v: 159, teksti: 'Meri näkyy taas iPadilla' },
  { v: 155, teksti: 'Yhdistetty vanha maailma yhdeksi kartaksi' },
];
