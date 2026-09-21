const KEY = "web3min-next";

const ALLOW = [
  /^\/$/,
  /^\/kisah/,
  /^\/leaderboard/,
  /^\/shop/,
  /^\/profile/,
  /^\/settings/,
  /^\/about/,
  /^\/privacy/,
  /^\/lesson\//,
  /^\/bedah\//,
];

function safe(path: string) {
  try {
    const url = new URL(path, "https://web3min.local");
    if (!ALLOW.some((re) => re.test(url.pathname))) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

function withHash(hash: string) {
  if (!hash) return "";
  return hash.startsWith("#") ? hash : `#${hash}`;
}

export function rememberPath(path: string) {
  if (typeof sessionStorage === "undefined") return;
  if (path.startsWith("/onboarding") || path.startsWith("/intro")) return;
  const next = safe(path);
  if (next) sessionStorage.setItem(KEY, next);
}

export function consumePath(): string | null {
  if (typeof sessionStorage === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  sessionStorage.removeItem(KEY);
  return raw ? safe(raw) : null;
}

export function locationHref(loc: { pathname: string; searchStr?: string; hash?: string }) {
  const search = loc.searchStr || "";
  return `${loc.pathname}${search}${withHash(loc.hash || "")}`;
}

export function resumePath(push: (path: string) => void, fallback = "/") {
  push(consumePath() ?? fallback);
}
