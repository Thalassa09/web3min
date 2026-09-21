import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Broadcast, MagnifyingGlass, UsersThree } from "@/lib/kicon";
import { AppShell } from "@/components/app-shell";
import { Face } from "@/components/social/face";
import { Feed } from "@/components/social/feed";
import { PersonRow } from "@/components/social/person-row";
import { DIRECTORY, buildFeed, lookupBuddy } from "@/lib/people";
import { playBuy, playDeny, playTap } from "@/lib/audio";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leaderboard")({ component: FriendsPage });

type Tab = "feed" | "teman" | "cari";

const TABS: { id: Tab; label: string; icon: typeof Broadcast }[] = [
  { id: "feed", label: "Feed", icon: Broadcast },
  { id: "teman", label: "Lingkaran", icon: UsersThree },
  { id: "cari", label: "Cari", icon: MagnifyingGlass },
];

function FriendsPage() {
  const username = useProgress((s) => s.username);
  const twitter = useProgress((s) => s.twitter);
  const bio = useProgress((s) => s.bio);
  const friends = useProgress((s) => s.friends);
  const friendMeta = useProgress((s) => s.friendMeta);
  const shouts = useProgress((s) => s.shouts);
  const addFriend = useProgress((s) => s.addFriend);
  const removeFriend = useProgress((s) => s.removeFriend);
  const addShout = useProgress((s) => s.addShout);
  const [tab, setTab] = useState<Tab>("feed");
  const [q, setQ] = useState("");

  const following = friends.map((id) => lookupBuddy(id, friendMeta));
  const posts = useMemo(
    () => buildFeed({ username, twitter, friends, shouts, extras: friendMeta }),
    [username, twitter, friends, shouts, friendMeta],
  );
  const found = DIRECTORY.filter((row) => {
    if (row.username === username) return false;
    if (!q) return true;
    const s = q.toLowerCase();
    return row.username.includes(s) || row.blurb.toLowerCase().includes(s) || row.twitter.includes(s);
  });

  function follow(id: string, handle?: string) {
    if (friends.includes(id)) {
      removeFriend(id);
      playTap();
      return;
    }
    if (addFriend(id, handle)) playBuy();
    else playDeny();
  }

  function post(text: string) {
    const ok = addShout(text);
    if (ok) playBuy();
    else playDeny();
    return ok;
  }

  return (
    <AppShell>
      <main className="social-page">
        <header className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-label text-primary">Lingkaran rute</p>
            <h1 className="text-2xl font-extrabold">Teman</h1>
            <p className="text-sm text-muted">
              {friends.length ? `${friends.length} orang diikuti` : "Hubungkan akun X agar teman dapat menemukanmu."}
            </p>
            <p className="mt-1 text-xs font-medium text-muted">Contoh komunitas — data ini contoh, bukan pengguna nyata.</p>
          </div>
          <Link to="/profile" className="shrink-0" aria-label="Profil">
            <Face name={username || "kamu"} size={52} ring you />
          </Link>
        </header>

        <nav className="social-tabs" aria-label="Menu teman">
          {TABS.map((item) => {
            const Icon = item.icon;
            const on = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn("social-tab", on && "social-tab-on")}
              >
                <Icon className="size-4" weight={on ? "fill" : "bold"} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {tab === "feed" ? (
          <Feed
            username={username}
            bio={bio}
            friends={friends}
            following={following}
            posts={posts}
            onFollow={follow}
            onPost={post}
          />
        ) : null}

        {tab === "teman" ? (
          <ul className="enter-up mt-4 flex flex-col gap-2">
            {following.length === 0 ? (
              <li className="social-empty">
                <p className="font-bold">Belum ada teman di rute ini.</p>
                <p className="mt-1 text-sm leading-5 text-muted">
                  Ikuti teman atau akun edukasi untuk melihat progres belajar mereka di sini.
                </p>
                <button type="button" className="mt-3 min-h-11 font-bold text-primary" onClick={() => setTab("cari")}>
                  Temukan teman
                </button>
              </li>
            ) : (
              following.map((row) => (
                <PersonRow
                  key={row.username}
                  name={row.username}
                  blurb={row.blurb}
                  now={row.now}
                  twitter={row.twitter}
                  following
                  onFollow={() => follow(row.username)}
                />
              ))
            )}
          </ul>
        ) : null}

        {tab === "cari" ? (
          <div className="enter-up mt-4">
            <label className="social-search">
              <MagnifyingGlass className="size-5 text-muted" weight="bold" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value.slice(0, 24))}
                placeholder="Cari teman"
                aria-label="Cari username atau topik"
                className="social-search-input"
                autoCapitalize="off"
                autoCorrect="off"
              />
            </label>
            <p className="mt-2 text-xs font-medium text-muted">Akun di bawah contoh untuk demo.</p>
            <ul className="mt-3 flex flex-col gap-2">
              {found.map((row) => (
                <PersonRow
                  key={row.username}
                  name={row.username}
                  blurb={row.blurb}
                  now={row.now}
                  twitter={row.twitter}
                  following={friends.includes(row.username)}
                  onFollow={() => follow(row.username, row.twitter)}
                />
              ))}
            </ul>
          </div>
        ) : null}
      </main>
    </AppShell>
  );
}
