/*
 * Suora radiolähetys maittain: "Kuuntele kieltä" -napin ensisijainen
 * ääni.
 *
 * Miksi radio eikä äänite: aporeen äänimaisemat on tallennettu
 * maisemaksi, ei puheeksi, ja torinäytteessä kuuluu enimmäkseen
 * askelia ja liikennettä (omistajan havainto). Suorassa puheradiossa
 * puhutaan koko ajan, eikä lähetys ole koskaan kahdesti samanlainen.
 *
 * Järjestys on omistajan antama: maan virallinen ykkösradio ensin,
 * sen puuttuessa mikä tahansa saman maan asema, ja vasta viimeisenä
 * vanha kolmen minuutin tallenne (js/packs/europe-kielet.js). Tallenne
 * jää varareitiksi: lähetysosoitteet lakkaavat toimimasta ilman
 * varoitusta, ja silloin nappi soittaa äänitteen sen sijaan että
 * vaikenisi.
 *
 * Kaikki osoitteet ovat https-muotoisia ja tarkistettu hakemalla —
 * salaamatonta virtaa selain ei soita lainkaan. Lista on tuotettu
 * komennoilla
 *   node tools/hae-radiot.mjs
 *   node tools/kirjoita-radiot.mjs
 * Radio Browserin aineistosta. Älä muokkaa käsin: aja haku uudelleen.
 *
 * 71 maata, joista 46 maan yleisradion kanava.
 *
 * Avaimena ISO-3-maatunnus, sama jota map.cityCountry käyttää.
 */
export const RADIOT = {
  AFG: { url: 'https://listen.radioking.com/radio/291025/stream/337294', asema: 'chalabi' },
  AUT: { url: 'https://orf-live.ors-shoutcast.at/oe1-q2a', asema: 'Ö1 | ORF | HQ', virallinen: true },
  BGR: { url: 'https://play.global.audio/testb.aac?dist=RADIOPLAY', asema: 'BNR Horizont', virallinen: true },
  BIH: { url: 'https://srv.mediastriming.com/8330/stream', asema: 'Srce Krajine' },
  CHE: { url: 'https://stream.srg-ssr.ch/m/la-1ere/mp3_128', asema: 'RTS La Première', virallinen: true },
  CHN: { url: 'https://lhttp.qtfm.cn/live/15318317/64k.mp3', asema: 'CNR-1 中国之声', virallinen: true },
  COD: { url: 'https://topcongofm2.ice.infomaniak.ch/topcongofm2-64.mp3', asema: 'Top Congo FM' },
  CYP: { url: 'https://r1.cloudskep.com/radio3/supersportfm/icecast.audio', asema: 'Super Sport FM 104.0' },
  CZE: { url: 'https://rozhlas.stream/radiozurnal_sport_high.aac', asema: 'ČRO Radiožurnál Sport', virallinen: true },
  DEU: { url: 'https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3?aggregator=web', asema: 'Deutschlandfunk | DLF | MP3 128k', virallinen: true },
  DNK: { url: 'https://live-icy.gss.dr.dk/A/A03H.mp3', asema: 'DR P1', virallinen: true },
  DZA: { url: 'https://radiochaine1.ice.infomaniak.ch/chaine1.mp3', asema: 'Algérie Chaine 1', virallinen: true },
  EGY: { url: 'https://qurango.net/radio/mahmoud_khalil_alhussary_warsh', asema: 'إذاعة محمود خليل الحصري' },
  ESP: { url: 'https://d131.rndfnk.com/star/crtve/rne5/main/mp3/128/stream.mp3?aggregator=tunein&cid=01GEP4MW5CAHPYP1EXHVKWFJ8W&sid=2OeE42hivuba6dTGvjnMGjKByQe&token=cdczXcnimVx4AY4iamqYbTMdu3cK7oBxmS2UQN9cWc0&tvf=pdPcDBxuVxdkMTMxLnJuZGZuay5jb20', asema: 'Radio Nacional de España - Radio 5 Todo noticias', virallinen: true },
  EST: { url: 'https://icecast.err.ee/vikerraadio.mp3', asema: 'Vikerraadio', virallinen: true },
  ETH: { url: 'https://stream-25.zeno.fm/2xguamap7yzuv', asema: 'EBC Radio 104.7 Addis Abeba', virallinen: true },
  FIN: { url: 'https://icecast.live.yle.fi/radio/YleRadio1Hifi/icecast.audio', asema: 'Yle Radio 1 Hifi', virallinen: true },
  FRA: { url: 'https://icecast.radiofrance.fr/franceinter-hifi.aac', asema: 'France Inter', virallinen: true },
  GBR: { url: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service_east_asia', asema: 'BBC World Service', virallinen: true },
  GHA: { url: 'https://node-27.zeno.fm/ey34mac27vzuv?rj-ttl=5&rj-tok=AAABdyidjk4ACEJncwCTuO-dTg', asema: 'Info Radio Ghana', virallinen: true },
  GRC: { url: 'https://radiostreaming.ert.gr/ert-proto', asema: 'ΕΡΤ Πρώτο Πρόγραμμα', virallinen: true },
  HKG: { url: 'https://stm1.rthk.hk/radio1', asema: 'RTHK Radio 1', virallinen: true },
  HRV: { url: 'https://27863.live.streamtheworld.com/PROGRAM1AAC_SC', asema: 'HRT HR 1 - Prvi program', virallinen: true },
  HUN: { url: 'https://icast.connectmedia.hu/4736/mr1.mp3', asema: 'Kossuth', virallinen: true },
  IDN: { url: 'https://stream-node0.rri.co.id/streaming/14/9014/kbrn.mp3', asema: 'RRI Pro 3 KBRN', virallinen: true },
  IND: { url: 'https://audio-edge-fvq45.ams.d.radiomast.io/3ccc1156-fcf8-4ba7-9a0c-28e3a465e1ae?listening-from-radio-garden=1607152226837', asema: 'aakashvani', virallinen: true },
  IRL: { url: 'https://icecast.rte.ie/radio1', asema: 'RTÉ Radio 1', virallinen: true },
  IRN: { url: 'https://radio.iraninternational.app/iintl_c', asema: 'Radio Iran International', virallinen: true },
  IRQ: { url: 'https://audio-edge-3mayu.fra.h.radiomast.io/04b1ce4c-24f2-4172-b756-065832ef78bf', asema: 'Kurdistan 24' },
  ISL: { url: 'https://stream.utvarpsaga.is/Hljodver', asema: 'Útvarp Saga' },
  ITA: { url: 'https://icestreaming.rai.it/1.mp3', asema: 'Rai Radio 1', virallinen: true },
  JOR: { url: 'https://dc1.serverse.com/proxy/kjxwtpdt/stream', asema: 'Hayat FM' },
  KAZ: { url: 'https://radio-streams.kaztrk.kz/qazradio/qazradio/icecast.audio', asema: 'Qazaq radiosy', virallinen: true },
  KEN: { url: 'https://stream.zeno.fm/ud2u96xst5quv', asema: 'KBC', virallinen: true },
  KWT: { url: 'https://montecarlodoualiya128k.ice.infomaniak.ch/mc-doualiya.mp3', asema: 'الكويت - البرنامج الثاني' },
  LBY: { url: 'https://stream.zeno.fm/z9wfrdpmgg0uv', asema: 'راديو فنون طرابلس - Radio Arts Tripoli' },
  LKA: { url: 'https://stream-32.zeno.fm/xekhrn4zetzuv?zs=KXT1gTNYSemcxyslV6-vdA', asema: 'SLBC Tamil National Service', virallinen: true },
  MAR: { url: 'https://stream.zeno.fm/une3a02mb', asema: 'MA:-Hit Radio Maroc', virallinen: true },
  MDG: { url: 'https://direct.radiomadagasikara.com/listen/rnm/radio.mp3', asema: 'RNM', virallinen: true },
  MLI: { url: 'https://stream-157.zeno.fm/yerp85sughwtv?zs=bzqHawb1Rha3gGg97iW8xg', asema: 'Radio Malijet', virallinen: true },
  MMR: { url: 'https://edge.mixlr.com/channel/nmtev', asema: 'MandalayFM' },
  MNG: { url: 'https://c2.radioboss.fm/stream/394', asema: 'Family Radio FM' },
  NAM: { url: 'https://edge.iono.fm/xice/88_high.mp3', asema: 'Kosmos 94.1' },
  NGA: { url: 'https://mega-public-relay.deathsmack-a51.workers.dev/', asema: 'ZamRock Radio Nigeria Relay', virallinen: true },
  NLD: { url: 'https://icecast.omroep.nl/radio1-bb-mp3', asema: 'NPO Radio 1', virallinen: true },
  NOR: { url: 'https://lyd.nrk.no/icecast/aac/high/s0w7hwn47m/p1_dk4', asema: 'NRK P1 Nordland', virallinen: true },
  NPL: { url: 'https://stream1.radionepal.gov.np/live/', asema: 'Radio Nepal', virallinen: true },
  OMN: { url: 'https://listen-halafm.sharp-stream.com/halafmlow.mp3', asema: 'Hala FM' },
  PHL: { url: 'https://azura.dzrh.com.ph/listen/dzrh_manila/radio.mp3', asema: 'DZRH', virallinen: true },
  POL: { url: 'https://radiostream.pl/tuba10-1.mp3#TOK_FM', asema: 'TOK FM' },
  PRT: { url: 'https://radiocast.rtp.pt/rdpint80a.mp3', asema: 'RDP Internacional - Main', virallinen: true },
  QAT: { url: 'https://l3.itworkscdn.net/alarabyradiolive/alarabyradio_audio/icecast.audio', asema: 'Al araby' },
  RUS: { url: 'https://icecast-vgtrk.cdnvideo.ru/vestifm_mp3_64kbps', asema: 'Вести ФМ', virallinen: true },
  SAU: { url: 'https://stream-154.zeno.fm/pdeizhgrtrstv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJwZGVpemhncnRyc3R2IiwiaG9zdCI6InN0cmVhbS0xNTQuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6Im9vbng2V1J3UXJ5Q0k5TVV0N01heEEiLCJpYXQiOjE3MjgyMjQ1MTYsImV4cCI6MTcyODIyNDU3Nn0.gpUIWkDBFNNFjqCg2R-xQN4LXT4z8_Ivs7d2UkeFE_8', asema: 'SBA Riyadh Radio 91.5 FM', virallinen: true },
  SDN: { url: 'https://stream.dabangasudan.org/', asema: 'Dabanga Radio' },
  SEN: { url: 'https://stream.zeno.fm/kxud8vhqt1duv', asema: 'RTS Matam 89.1', virallinen: true },
  SGP: { url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/CAPITAL958FM_PREM.aac', asema: 'CAPITAL 958', virallinen: true },
  SOM: { url: 'https://av.voanews.com/clips/VSO/2021/04/29/20210429-033000-VSO065-program_48k.mp3', asema: 'Idaacadda Subaxnimo VOA' },
  SWE: { url: 'https://live1.sr.se/p1-aac-32', asema: 'Sveriges Radio P1', virallinen: true },
  SYR: { url: 'https://radio.farah.fm/', asema: 'Farah FM' },
  TCD: { url: 'https://strhls.streamakaci.tv/str_tchad_radio/str_tchad_radio/icecast.audio?fbclid=IwAR32Ir_eHaV-HSrh46OVT_VeTZt5KoNggoq8qzeSiAeZTJNBKKUtsSNUtcY', asema: 'Radio Tchad', virallinen: true },
  THA: { url: 'https://radio12.plathong.net/7234/;stream.mp3', asema: 'วิทยุเสียงอิสลาม', virallinen: true },
  TUN: { url: 'https://radio.mosaiquefm.net/mosalive', asema: 'mosaiquefm' },
  TUR: { url: 'https://trt.radyotvonline.net/trt1', asema: 'TRT Radyo 1', virallinen: true },
  TWN: { url: 'https://n03.rcs.revma.com/78fm9wyy2tzuv', asema: '中廣新聞網', virallinen: true },
  UGA: { url: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service_west_africa', asema: '107.3 BBC Radio Uganda', virallinen: true },
  UKR: { url: 'https://online-radio.nv.ua/radionv.mp3', asema: 'Радіо НВ 96.0' },
  VNM: { url: 'https://rfienvietnamien64k.ice.infomaniak.ch/rfienvietnamien-64.mp3', asema: 'RFI Tiếng Việt' },
  YEM: { url: 'https://node-23.zeno.fm/b67qheuk54zuv', asema: 'صوت المقاومة' },
  ZAF: { url: 'https://edge.iono.fm/xice/82_medium.aac', asema: 'Kaya FM' },
  ZWE: { url: 'https://edge.iono.fm/xice/159_medium.aac', asema: 'Star FM 89.7' },
};

/** Maan suora lähetys, tai null. */
export function radioMaalle(maa) {
  return (maa && RADIOT[maa]) || null;
}
