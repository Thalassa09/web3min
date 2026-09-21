export type WorldTrail = "dots" | "dash" | "long" | "vine" | "wave" | "brick";
export type WorldWeather =
  | "leaves"
  | "spark"
  | "dust"
  | "petals"
  | "mist"
  | "ember"
  | "ash"
  | "spray"
  | "confetti"
  | "pages"
  | "firefly"
  | "bubble"
  | "snow"
  | "cloud"
  | "parachute"
  | "banner"
  | "neon"
  | "star"
  | "pollen";
export type WorldMark = "stone" | "key" | "coin" | "frame" | "ripple" | "warn" | "ember" | "anchor" | "ticket" | "page" | "brick" | "bubble" | "snow" | "cloud" | "gift" | "crest" | "neon" | "star" | "leaf";

export type WorldProp = {
  src: string;
  side: "left" | "right";
  top: string;
  size: number;
  flip?: boolean;
};

export type World = {
  id: string;
  land: string;
  look: string;
  stamp: string;
  skin: string;
  tone: string;
  dash: WorldTrail;
  weather: WorldWeather;
  mark: WorldMark;
  art: string;
  props: WorldProp[];
};

const P = (name: string) => `/props/${name}.png`;

export const WORLDS: Record<string, World> = {
  u1: {
    id: "hutan",
    land: "Hutan",
    look: "Hutan permen. Jalan pelan, jangan nyasar.",
    stamp: P("mushroom"),
    skin: "world-hutan",
    tone: "Lumut · peach · mint",
    dash: "dots",
    weather: "leaves",
    mark: "stone",
    art: "/worlds/u1.jpg",
    props: [
      { src: P("mushroom"), side: "left", top: "22%", size: 52 },
      { src: P("flower"), side: "right", top: "48%", size: 44 },
      { src: P("mushroom"), side: "right", top: "78%", size: 40, flip: true },
    ],
  },
  u2: {
    id: "gua",
    land: "Gua kunci",
    look: "Gua kunci. Gelap. Kuncinya jangan sampe ilang.",
    stamp: P("key"),
    skin: "world-gua",
    tone: "Plum · emas · krem",
    dash: "dash",
    weather: "spark",
    mark: "key",
    art: "/worlds/u2.jpg",
    props: [
      { src: P("lantern"), side: "left", top: "18%", size: 48 },
      { src: P("key"), side: "right", top: "44%", size: 42 },
      { src: P("lantern"), side: "right", top: "76%", size: 46 },
    ],
  },
  u3: {
    id: "tambang",
    land: "Tambang koin",
    look: "Tambang koin. Berdebu, kilauannya bikin silau.",
    stamp: P("coins"),
    skin: "world-tambang",
    tone: "Ambar · emas · coklat",
    dash: "long",
    weather: "dust",
    mark: "coin",
    art: "/worlds/u3.jpg",
    props: [
      { src: P("coins"), side: "left", top: "24%", size: 46 },
      { src: P("lantern"), side: "right", top: "52%", size: 44 },
      { src: P("coins"), side: "right", top: "80%", size: 40 },
    ],
  },
  u4: {
    id: "galeri",
    land: "Taman NFT",
    look: "Taman NFT. Banyak bingkai. Jangan salah beli.",
    stamp: P("frame"),
    skin: "world-galeri",
    tone: "Ungu · lilac · krim",
    dash: "dots",
    weather: "petals",
    mark: "frame",
    art: "/worlds/u4.jpg",
    props: [
      { src: P("frame"), side: "left", top: "20%", size: 50 },
      { src: P("flower"), side: "right", top: "46%", size: 42 },
      { src: P("frame"), side: "right", top: "74%", size: 46, flip: true },
    ],
  },
  u5: {
    id: "pasar",
    land: "Pasar DeFi",
    look: "Pasar DeFi. Tawar dulu, bayar belakangan.",
    stamp: P("crate"),
    skin: "world-pasar",
    tone: "Teal · kayu · air",
    dash: "wave",
    weather: "mist",
    mark: "ripple",
    art: "/worlds/u5.jpg",
    props: [
      { src: P("crate"), side: "left", top: "22%", size: 50 },
      { src: P("lantern"), side: "right", top: "50%", size: 44 },
      { src: P("crate"), side: "right", top: "78%", size: 42, flip: true },
    ],
  },
  u6: {
    id: "malam",
    land: "Lorong waspada",
    look: "Lorong waspada. Banyak umpan, jalan pelan.",
    stamp: P("cone"),
    skin: "world-malam",
    tone: "Wine · oranye · senja",
    dash: "dash",
    weather: "firefly",
    mark: "warn",
    art: "/worlds/u6.jpg",
    props: [
      { src: P("cone"), side: "left", top: "24%", size: 44 },
      { src: P("lantern"), side: "right", top: "48%", size: 48 },
      { src: P("cone"), side: "right", top: "76%", size: 40 },
    ],
  },
  u7: {
    id: "kawah",
    land: "Kawah cuan",
    look: "Kawah cuan. Panas kiri, dingin kanan.",
    stamp: P("ice"),
    skin: "world-kawah",
    tone: "Lava · abu · es",
    dash: "long",
    weather: "ember",
    mark: "ember",
    art: "/worlds/u7.jpg",
    props: [
      { src: P("coins"), side: "left", top: "28%", size: 42 },
      { src: P("ice"), side: "right", top: "46%", size: 46 },
      { src: P("ice"), side: "right", top: "78%", size: 38 },
    ],
  },
  u8: {
    id: "pelabuhan",
    land: "Pelabuhan",
    look: "Pelabuhan. Peti datang, peti pergi.",
    stamp: P("crate"),
    skin: "world-pelabuhan",
    tone: "Laut · pasir · buih",
    dash: "wave",
    weather: "spray",
    mark: "anchor",
    art: "/worlds/u8.jpg",
    props: [
      { src: P("crate"), side: "left", top: "20%", size: 48 },
      { src: P("lily"), side: "right", top: "52%", size: 40 },
      { src: P("crate"), side: "right", top: "80%", size: 44, flip: true },
    ],
  },
  u9: {
    id: "karnaval",
    land: "Karnaval meme",
    look: "Karnaval meme. Ramai. Tiket jangan asal.",
    stamp: P("balloon"),
    skin: "world-karnaval",
    tone: "Magenta · emas · krim",
    dash: "dots",
    weather: "confetti",
    mark: "ticket",
    art: "/worlds/u9.jpg",
    props: [
      { src: P("balloon"), side: "left", top: "18%", size: 52 },
      { src: P("cone"), side: "right", top: "46%", size: 40 },
      { src: P("balloon"), side: "right", top: "74%", size: 46 },
    ],
  },
  u10: {
    id: "perpus",
    land: "Hutan baca",
    look: "Hutan baca. Pelan-pelan, jangan sampe nyasar.",
    stamp: P("book"),
    skin: "world-perpus",
    tone: "Coklat · parchment · emas",
    dash: "vine",
    weather: "pages",
    mark: "page",
    art: "/worlds/u10.jpg",
    props: [
      { src: P("book"), side: "left", top: "22%", size: 48 },
      { src: P("flower"), side: "right", top: "50%", size: 40 },
      { src: P("book"), side: "right", top: "78%", size: 44 },
    ],
  },
  u11: {
    id: "kota",
    land: "Kota",
    look: "Kota. Warung buka, kunang-kunang nyala.",
    stamp: P("crate"),
    skin: "world-kota",
    tone: "Terracotta · dusky · peach",
    dash: "brick",
    weather: "firefly",
    mark: "brick",
    art: "/worlds/u11.jpg",
    props: [
      { src: P("crate"), side: "left", top: "24%", size: 48 },
      { src: P("cone"), side: "right", top: "48%", size: 38 },
      { src: P("lantern"), side: "right", top: "76%", size: 44 },
    ],
  },
  u12: {
    id: "rawa",
    land: "Rawa APY",
    look: "Rawa APY. Licin. Jangan kejer angka.",
    stamp: P("lily"),
    skin: "world-rawa",
    tone: "Lumut · lime · lumpur",
    dash: "wave",
    weather: "bubble",
    mark: "bubble",
    art: "/worlds/u12.jpg",
    props: [
      { src: P("lily"), side: "left", top: "20%", size: 46 },
      { src: P("mushroom"), side: "right", top: "48%", size: 44 },
      { src: P("lily"), side: "right", top: "78%", size: 40, flip: true },
    ],
  },
  u13: {
    id: "salju",
    land: "Puncak dingin",
    look: "Puncak dingin. Napas pelan. Jangan freeze.",
    stamp: P("ice"),
    skin: "world-salju",
    tone: "Es · putih · biru",
    dash: "dots",
    weather: "snow",
    mark: "snow",
    art: "/worlds/u13.jpg",
    props: [
      { src: P("ice"), side: "left", top: "22%", size: 46 },
      { src: P("flower"), side: "right", top: "50%", size: 36 },
      { src: P("ice"), side: "right", top: "76%", size: 42 },
    ],
  },
  u14: {
    id: "jembatan",
    land: "Jembatan L2",
    look: "Jembatan L2. Awan bagus, loncatnya jangan salah.",
    stamp: P("star"),
    skin: "world-jembatan",
    tone: "Ungu · awan · emas",
    dash: "long",
    weather: "cloud",
    mark: "cloud",
    art: "/worlds/u14.jpg",
    props: [
      { src: P("star"), side: "left", top: "18%", size: 40 },
      { src: P("balloon"), side: "right", top: "46%", size: 48 },
      { src: P("star"), side: "right", top: "74%", size: 36 },
    ],
  },
  u15: {
    id: "langit",
    land: "Langit airdrop",
    look: "Langit airdrop. Banyak kado. Bukan semua buat kamu.",
    stamp: P("parachute"),
    skin: "world-langit",
    tone: "Langit · peach · emas",
    dash: "dots",
    weather: "parachute",
    mark: "gift",
    art: "/worlds/u15.jpg",
    props: [
      { src: P("parachute"), side: "left", top: "16%", size: 52 },
      { src: P("star"), side: "right", top: "44%", size: 38 },
      { src: P("parachute"), side: "right", top: "72%", size: 46 },
    ],
  },
  u16: {
    id: "benteng",
    land: "Benteng stable",
    look: "Benteng stable. Tembok tebal, jangan lengah.",
    stamp: P("shield"),
    skin: "world-benteng",
    tone: "Batu · slate · perak",
    dash: "brick",
    weather: "banner",
    mark: "crest",
    art: "/worlds/u16.jpg",
    props: [
      { src: P("shield"), side: "left", top: "22%", size: 50 },
      { src: P("coins"), side: "right", top: "50%", size: 40 },
      { src: P("shield"), side: "right", top: "78%", size: 44 },
    ],
  },
  u17: {
    id: "neon",
    land: "Galeri malam",
    look: "Galeri malam. Neon nyala. Jangan silau.",
    stamp: P("frame"),
    skin: "world-neon",
    tone: "Navy · magenta · glow",
    dash: "dash",
    weather: "neon",
    mark: "neon",
    art: "/worlds/u17.jpg",
    props: [
      { src: P("frame"), side: "left", top: "20%", size: 50 },
      { src: P("star"), side: "right", top: "48%", size: 36 },
      { src: P("frame"), side: "right", top: "76%", size: 46 },
    ],
  },
  u18: {
    id: "kastil",
    land: "Kastil",
    look: "Kastil. Tembok mawar, perisai siap.",
    stamp: P("shield"),
    skin: "world-kastil",
    tone: "Mawar · wine · krim",
    dash: "brick",
    weather: "banner",
    mark: "crest",
    art: "/worlds/u18.jpg",
    props: [
      { src: P("shield"), side: "left", top: "22%", size: 50 },
      { src: P("lantern"), side: "right", top: "50%", size: 44 },
      { src: P("shield"), side: "right", top: "78%", size: 42 },
    ],
  },
  u19: {
    id: "bintang",
    land: "Observatorium",
    look: "Observatorium. Bintang banyak, jangan nyasar.",
    stamp: P("star"),
    skin: "world-bintang",
    tone: "Midnight · emas · nebula",
    dash: "dots",
    weather: "star",
    mark: "star",
    art: "/worlds/u19.jpg",
    props: [
      { src: P("star"), side: "left", top: "16%", size: 40 },
      { src: P("ice"), side: "right", top: "46%", size: 42 },
      { src: P("star"), side: "right", top: "74%", size: 36 },
    ],
  },
  u20: {
    id: "taman",
    land: "Taman waras",
    look: "Taman waras. Pelan. Cukup. Pulang.",
    stamp: P("bonsai"),
    skin: "world-taman",
    tone: "Senja · sage · pasir",
    dash: "vine",
    weather: "pollen",
    mark: "leaf",
    art: "/worlds/u20.jpg",
    props: [
      { src: P("bonsai"), side: "left", top: "22%", size: 54 },
      { src: P("flower"), side: "right", top: "50%", size: 40 },
      { src: P("bonsai"), side: "right", top: "78%", size: 46, flip: true },
    ],
  },
};

export function worldOf(unitId: string): World {
  return WORLDS[unitId] ?? WORLDS.u1!;
}

export const ROUTE_KIND: Record<string, string> = {
  u1: "Rumput",
  u2: "Gelap",
  u3: "Baja",
  u4: "Seni",
  u5: "Air",
  u6: "Racun",
  u7: "Api",
  u8: "Air",
  u9: "Ramai",
  u10: "Daun",
  u11: "Kota",
  u12: "Racun",
  u13: "Es",
  u14: "Listrik",
  u15: "Langit",
  u16: "Baja",
  u17: "Malam",
  u18: "Mawar",
  u19: "Bintang",
  u20: "Damai",
};

export function kindOf(unitId: string): string {
  return ROUTE_KIND[unitId] ?? "Normal";
}

export const TRAIL_DASH: Record<WorldTrail, string> = {
  dots: "0 18",
  dash: "14 12",
  long: "28 10",
  vine: "6 8 18 8",
  wave: "4 10 16 10",
  brick: "18 6",
};
