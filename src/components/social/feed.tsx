import { useState } from "react";
import { Heart } from "@/lib/kicon";
import { DuoButton } from "@/components/duo-button";
import { Face } from "@/components/social/face";
import { Mascot } from "@/components/mascot";
import { EmptyGuide } from "@/components/motif";
import { DIRECTORY, sanitizeShout, sparkCount, timeAgo, twitterUrl, type Buddy, type FeedPost } from "@/lib/people";
import { playTap } from "@/lib/audio";
import { cn } from "@/lib/utils";

type FeedProps = {
  username: string;
  bio: string;
  friends: string[];
  following: Buddy[];
  posts: FeedPost[];
  onFollow: (username: string, twitter?: string) => void;
  onPost: (text: string) => boolean;
};

export function Feed({ username, bio, friends, following, posts, onFollow, onPost }: FeedProps) {
  return (
    <section className="enter-up mt-3">
      <StoryStrip username={username} bio={bio} following={following} />
      <Composer onPost={onPost} />
      <PostList posts={posts} friends={friends} onFollow={onFollow} />
    </section>
  );
}

function StoryStrip({ username, bio, following }: { username: string; bio: string; following: Buddy[] }) {
  const extras = following.length === 0 ? DIRECTORY.slice(0, 6) : [];
  return (
    <div className="social-strip">
      <StoryChip name={username || "kamu"} now={bio || "Tulis status"} you />
      {following.map((row) => (
        <StoryChip key={row.username} name={row.username} now={row.now} />
      ))}
      {extras.map((row) => (
        <StoryChip key={row.username} name={row.username} now={row.now} muted />
      ))}
    </div>
  );
}

function StoryChip({ name, now, you, muted }: { name: string; now: string; you?: boolean; muted?: boolean }) {
  return (
    <div className="social-chip">
      <Face name={name} size={64} ring={you} you={you} />
      <p className={cn("social-chip-name", muted && "text-muted")}>{you ? "Kamu" : name}</p>
      <p className="social-chip-now">{now}</p>
    </div>
  );
}

function Composer({ onPost }: { onPost: (text: string) => boolean }) {
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  return (
    <form
      className="social-composer"
      onSubmit={(e) => {
        e.preventDefault();
        if (busy || draft.trim().length < 2) return;
        setBusy(true);
        setErr(null);
        const ok = onPost(draft);
        if (ok) {
          setDraft("");
          setNote("Posting berhasil dikirim.");
          window.setTimeout(() => setNote(null), 4000);
        } else {
          setErr("Tidak bisa dikirim. Singkat, tanpa tautan aneh.");
        }
        setBusy(false);
      }}
    >
      <Mascot mood={draft ? "think" : "wave"} size={56} lite />
      <div className="social-bubble">
        <textarea
          value={draft}
          onChange={(e) => setDraft(sanitizeShout(e.target.value))}
          placeholder="Bagikan progres atau hal yang kamu pelajari…"
          rows={2}
          maxLength={140}
          aria-label="Bagikan progres belajarmu"
          aria-invalid={Boolean(err)}
          aria-describedby={err ? "composer-err" : note ? "composer-ok" : undefined}
          className="social-input"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-sm font-medium tabular-nums text-muted">{draft.length}/140</span>
          <DuoButton size="sm" disabled={busy || draft.trim().length < 2}>
            {busy ? "Mengirim…" : "Bagikan progres"}
          </DuoButton>
        </div>
        {note ? (
          <p id="composer-ok" className="mt-2 text-sm font-medium text-primary" role="status" aria-live="polite">
            {note}
          </p>
        ) : null}
        {err ? (
          <p id="composer-err" className="mt-2 text-sm font-medium text-danger" role="alert">
            {err}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function PostList({
  posts,
  friends,
  onFollow,
}: {
  posts: FeedPost[];
  friends: string[];
  onFollow: (username: string, twitter?: string) => void;
}) {
  if (posts.length === 0) {
    return (
      <div className="social-empty">
        <EmptyGuide
          title="Belum ada bukti belajar di sini."
          body="Selesaikan satu pelajaran, lalu bagikan progresmu. Feed ini memakai data contoh, bukan komunitas live."
        />
      </div>
    );
  }
  return (
    <ul className="mt-4 flex flex-col gap-3">
      {posts.map((post, i) => (
        <PostCard
          key={post.id}
          post={post}
          following={post.you || friends.includes(post.username)}
          onFollow={onFollow}
          featured={i === 0}
        />
      ))}
    </ul>
  );
}

function PostCard({
  post,
  following,
  onFollow,
  featured,
}: {
  post: FeedPost;
  following: boolean;
  onFollow: (username: string, twitter?: string) => void;
  featured?: boolean;
}) {
  const [sparks, setSparks] = useState(sparkCount(post.id));
  const [lit, setLit] = useState(false);

  return (
    <li className={cn("social-note", featured && "social-note-hot")}>
      <div className="flex gap-3">
        <Face name={post.username} size={48} you={post.you} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="min-w-0 truncate font-extrabold">@{post.username}</p>
            <span className="shrink-0 text-xs font-bold text-muted">{timeAgo(post.at)}</span>
            {post.you || following ? null : (
              <button type="button" onClick={() => onFollow(post.username, post.twitter)} className="ml-auto shrink-0 text-sm font-bold text-primary">
                Ikuti di web3min
              </button>
            )}
          </div>
          <p className="mt-1 break-words text-base leading-6 text-fg">{post.text}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={cn("social-react", lit && "social-react-on")}
              aria-label="Suka"
              aria-pressed={lit}
              onClick={() => {
                playTap();
                setLit((on) => {
                  setSparks((n) => n + (on ? -1 : 1));
                  return !on;
                });
              }}
            >
              <Heart className="size-4" weight={lit ? "fill" : "bold"} />
              Suka {sparks}
            </button>
            {post.twitter ? (
              <a
                href={twitterUrl(post.twitter)}
                target="_blank"
                rel="noreferrer"
                className="social-react"
                aria-label={`Lihat profil X ${post.username}`}
              >
                Lihat profil X
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}
