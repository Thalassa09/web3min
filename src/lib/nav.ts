import {
  BookOpenText,
  Compass,
  Handshake,
  Storefront,
  UserCircle,
  type Icon,
} from "@/lib/kicon";

export type NavItem = {
  to: "/" | "/kisah" | "/leaderboard" | "/shop" | "/profile";
  label: string;
  icon: Icon;
};

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Belajar", icon: Compass },
  { to: "/kisah", label: "Kisah", icon: BookOpenText },
  { to: "/leaderboard", label: "Teman", icon: Handshake },
  { to: "/shop", label: "Toko", icon: Storefront },
  { to: "/profile", label: "Profil", icon: UserCircle },
];

export function navActive(pathname: string, to: NavItem["to"]): boolean {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}
