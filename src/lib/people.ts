export type Buddy = {
  username: string;
  twitter: string;
  blurb: string;
  now: string;
  stamp: string;
  skin: string;
  posts: { text: string; mins: number }[];
};

export type Shout = { id: string; text: string; at: number };

export type FeedPost = {
  id: string;
  username: string;
  twitter: string;
  text: string;
  at: number;
  you?: boolean;
};

const LOOKS = [
  { stamp: "/props/lily.png", skin: "world-rawa" },
  { stamp: "/props/key.png", skin: "world-gua" },
  { stamp: "/props/balloon.png", skin: "world-karnaval" },
  { stamp: "/props/parachute.png", skin: "world-pelabuhan" },
  { stamp: "/props/star.png", skin: "world-bintang" },
  { stamp: "/props/shield.png", skin: "world-benteng" },
  { stamp: "/props/frame.png", skin: "world-galeri" },
  { stamp: "/props/crate.png", skin: "world-tambang" },
  { stamp: "/props/book.png", skin: "world-perpus" },
  { stamp: "/props/coins.png", skin: "world-pasar" },
] as const;

export const DIRECTORY: Buddy[] = [
  {
    username: "sari_defi",
    twitter: "saridefi",
    blurb: "Pool dan lending. Leverage dijauhin.",
    now: "Rute Kolam",
    stamp: "/props/lily.png",
    skin: "world-rawa",
    posts: [
      { text: "IL itu bukan rugi di rekening. Tapi tetep ngerasa. Baca pelan.", mins: 40 },
      { text: "Jangan tanya APR doang. Tanya lock-up-nya.", mins: 280 },
    ],
  },
  {
    username: "dimas_onchain",
    twitter: "dimasonchain",
    blurb: "Baca explorer sebelum beli.",
    now: "Cek explorer",
    stamp: "/props/key.png",
    skin: "world-gua",
    posts: [{ text: "Kontrak baru, holder 12, likuiditas dikunci 3 hari. Skip.", mins: 25 }],
  },
  {
    username: "nisa_eth",
    twitter: "nisaeth",
    blurb: "Komunitas, bukan chart.",
    now: "Kisah airdrop",
    stamp: "/props/balloon.png",
    skin: "world-karnaval",
    posts: [{ text: "Yang gajian dari Discord juga web3. Bukan cuma yang hold.", mins: 90 }],
  },
  {
    username: "justin_eth",
    twitter: "justineth",
    blurb: "Gas mahal? Pindah L2.",
    now: "Gas L1 gila",
    stamp: "/props/parachute.png",
    skin: "world-pelabuhan",
    posts: [{ text: "Bridge bukan tombol ajaib. Cek official-nya.", mins: 55 }],
  },
  {
    username: "putri_airdrop",
    twitter: "putridrop",
    blurb: "Modal gas. Sabar.",
    now: "Nunggu TGE",
    stamp: "/props/star.png",
    skin: "world-bintang",
    posts: [{ text: "Modal gas. Yang 18k itu bukan mimpi doang. Tapi juga bukan jaminan.", mins: 15 }],
  },
  {
    username: "farhan_sec",
    twitter: "farhansec",
    blurb: "Link aneh? Jangan klik.",
    now: "Revoke",
    stamp: "/props/shield.png",
    skin: "world-benteng",
    posts: [{ text: "DM admin support = bukan admin. Seed jangan dikirim. Pernah.", mins: 8 }],
  },
  {
    username: "dewi_nft",
    twitter: "dewicollect",
    blurb: "PFP boleh, utang jangan.",
    now: "Liat floor",
    stamp: "/props/frame.png",
    skin: "world-galeri",
    posts: [{ text: "Floor turun bukan sinyal beli. Kadang sinyal kabur.", mins: 200 }],
  },
  {
    username: "budi_node",
    twitter: "budinode",
    blurb: "Yang bikin, bukan yang nonton.",
    now: "Bounty",
    stamp: "/props/crate.png",
    skin: "world-tambang",
    posts: [{ text: "Bounty 800. PR kecil. Lebih waras dari nge-long 50x.", mins: 120 }],
  },
  {
    username: "intan_dao",
    twitter: "intandao",
    blurb: "Vote plus kas. Bukan geng.",
    now: "Vote kas",
    stamp: "/props/book.png",
    skin: "world-perpus",
    posts: [{ text: "DAO yang kasnya 3 orang pegang? Itu grup WA berlogo.", mins: 340 }],
  },
  {
    username: "agus_wallet",
    twitter: "aguswallet",
    blurb: "Seed di kertas. Bukan chat.",
    now: "Seed offline",
    stamp: "/props/coins.png",
    skin: "world-pasar",
    posts: [{ text: "Screenshot seed = seed udah bocor. Kertas. Laci.", mins: 18 }],
  },
];

export function sanitizeUsername(n: unknown) {
  return String(n ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 20);
}

export function sanitizeTwitter(n: unknown) {
  return String(n ?? "")
    .trim()
    .replace(/^@/, "")
    .replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//i, "")
    .replace(/\/.*$/, "")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .slice(0, 15);
}

export function sanitizeBio(n: unknown) {
  return String(n ?? "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

export function sanitizeShout(n: unknown) {
  return String(n ?? "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
}

export function twitterUrl(handle: string) {
  return `https://x.com/${handle}`;
}

export function lookOf(username: string) {
  const listed = DIRECTORY.find((row) => row.username === username);
  if (listed) return { stamp: listed.stamp, skin: listed.skin };
  let h = 0;
  for (let i = 0; i < username.length; i++) h = (h + username.charCodeAt(i) * (i + 3)) % LOOKS.length;
  return LOOKS[h] ?? LOOKS[0]!;
}

export function lookupBuddy(username: string, extras: Record<string, { twitter?: string; blurb?: string }> = {}): Buddy {
  const id = sanitizeUsername(username);
  const listed = DIRECTORY.find((row) => row.username === id);
  const extra = extras[id];
  const look = lookOf(id);
  return {
    username: id,
    twitter: extra?.twitter || listed?.twitter || "",
    blurb: extra?.blurb || listed?.blurb || "Teman di web3min.",
    now: listed?.now || "Keliling rute",
    stamp: look.stamp,
    skin: look.skin,
    posts: listed?.posts ?? [],
  };
}

export function timeAgo(at: number) {
  const mins = Math.max(1, Math.round((Date.now() - at) / 60000));
  if (mins < 60) return `${mins} mnt`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} jam`;
  return `${Math.round(hours / 24)} hr`;
}

export function sparkCount(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return 3 + ((h >>> 0) % 18);
}

export function buildFeed(opts: {
  username: string;
  twitter: string;
  friends: string[];
  shouts: Shout[];
  extras?: Record<string, { twitter?: string; blurb?: string }>;
}): FeedPost[] {
  const now = Date.now();
  const rows: FeedPost[] = opts.shouts.map((s) => ({
    id: s.id,
    username: opts.username,
    twitter: opts.twitter,
    text: s.text,
    at: s.at,
    you: true,
  }));
  const circle = opts.friends.length ? opts.friends : DIRECTORY.slice(0, 4).map((d) => d.username);
  for (const id of circle) {
    const buddy = lookupBuddy(id, opts.extras);
    buddy.posts.forEach((p, i) => {
      rows.push({
        id: `${buddy.username}-${i}`,
        username: buddy.username,
        twitter: buddy.twitter,
        text: p.text,
        at: now - p.mins * 60_000,
      });
    });
  }
  rows.sort((a, b) => b.at - a.at);
  return rows.slice(0, 24);
}
