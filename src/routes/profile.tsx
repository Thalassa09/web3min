import { useState, type ReactNode } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Fire, Heart, Trophy } from "@/lib/kicon";
import { AppShell } from "@/components/app-shell";
import { DuoButton } from "@/components/duo-button";
import { Mascot } from "@/components/mascot";
import { BlockStamp } from "@/components/motif";
import { sequentialNodes, UNITS, unitEarned } from "@/lib/curriculum";
import { OUTFIT_LABEL } from "@/lib/shop";
import { wornList } from "@/lib/accessories";
import { sanitizeBio, twitterUrl } from "@/lib/people";
import { MAX_HEARTS, formatGems, useProgress } from "@/lib/store";
import { kindOf, worldOf } from "@/lib/worlds";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const username = useProgress((s) => s.username);
  const twitter = useProgress((s) => s.twitter);
  const friends = useProgress((s) => s.friends);
  const setBio = useProgress((s) => s.setBio);
  const bio = useProgress((s) => s.bio);
  const xp = useProgress((s) => s.xp);
  const gems = useProgress((s) => s.gems);
  const streak = useProgress((s) => s.streak);
  const hearts = useProgress((s) => s.hearts);
  const completed = useProgress((s) => s.completed);
  const perfect = useProgress((s) => s.perfect);
  const completedStories = useProgress((s) => s.completedStories);
  const completedCases = useProgress((s) => s.completedCases);
  const equipped = useProgress((s) => s.equipped);
  const worn = useProgress((s) => s.worn);
  const dailyGoal = useProgress((s) => s.dailyGoal);
  const xpToday = useProgress((s) => s.xpToday);
  const [bioDraft, setBioDraft] = useState(bio);
  const [saved, setSaved] = useState(false);
  const lessonsDone = sequentialNodes().filter((n) => completed.includes(n.id)).length;
  const dirty = bioDraft !== bio;

  return (
    <AppShell>
      <main className="px-4 py-5 lg:grid lg:grid-cols-2 lg:gap-6 lg:px-6">
        <div className="lg:col-span-2 flex flex-col items-center text-center">
          <Mascot mood="idle" size={140} />
          <h1 className="mt-1 text-[28px] font-extrabold leading-[34px]">@{username || "pelajar"}</h1>
          <p className="text-base leading-6 text-muted">{bio || "Belajar Web3 bareng web3min"}</p>
          {twitter ? (
            <a
              href={twitterUrl(twitter)}
              target="_blank"
              rel="noreferrer"
              className="mt-1 text-sm font-bold text-primary-deep"
            >
              Lihat profil X
            </a>
          ) : null}
          {wornList(worn).length ? (
            <p className="mt-1 text-sm font-medium text-blob">Pakai {wornList(worn).map((a) => a.name).join(" · ")}</p>
          ) : equipped ? (
            <p className="mt-1 text-sm font-medium text-blob">Pakai {OUTFIT_LABEL[equipped] ?? equipped}</p>
          ) : null}
        </div>

        <ul className="mt-5 flex items-center justify-between gap-2 rounded-2xl bg-paper px-3 py-3 lg:mt-0">
          <Stat icon={<Trophy className="size-5 text-gold" weight="fill" />} label="XP" value={xp} />
          <Stat icon={<Fire className="size-5 text-streak" weight="fill" />} label="hari" value={streak} />
          <Stat icon={<BlockStamp size={20} />} label="bintang" value={formatGems(gems)} />
          <Stat icon={<Heart className="size-5 text-blob" weight="fill" />} label="nyawa" value={`${hearts}/${MAX_HEARTS}`} />
        </ul>

        <Link
          to="/leaderboard"
          className="mt-5 flex min-h-12 items-center justify-between rounded-2xl bg-paper px-4 py-3 lg:mt-0"
        >
          <span>
            <span className="block text-sm font-medium text-muted">Teman</span>
            <span className="font-bold">{friends.length} orang</span>
          </span>
          <span className="text-sm font-bold text-primary">{friends.length ? "Lihat teman" : "Temukan teman"}</span>
        </Link>

        <div className="mt-5 lg:col-span-2">
          <p className="text-sm font-bold">Bio</p>
          <label className="mt-3 block text-sm font-medium text-muted" htmlFor="bio">
            Status profil
          </label>
          <input
            id="bio"
            value={bioDraft}
            onChange={(e) => setBioDraft(sanitizeBio(e.target.value))}
            placeholder="Lagi di rute hutan"
            className="field mt-1"
            maxLength={80}
            aria-describedby="bio-hint"
          />
          <p id="bio-hint" className="mt-1 text-sm leading-5 text-muted">
            Maksimal 80 karakter. Kelihatan di Teman.
          </p>
          <DuoButton
            size="sm"
            className="mt-3"
            disabled={!dirty}
            onClick={() => {
              setBio(bioDraft);
              setSaved(true);
              window.setTimeout(() => setSaved(false), 4000);
            }}
          >
            Simpan perubahan
          </DuoButton>
          {saved ? (
            <p className="mt-2 text-sm font-medium text-primary" role="status" aria-live="polite">
              Perubahan tersimpan.
            </p>
          ) : null}
        </div>

        <div className="mt-5">
          <p className="text-sm font-bold">Lencana rute</p>
          <p className="mt-1 text-sm leading-5 text-muted">Selesaikan tantangan rute untuk mendapatkan lencana.</p>
          <ul className="mt-3 grid grid-cols-5 gap-2">
            {UNITS.map((unit) => {
              const world = worldOf(unit.id);
              const on = unitEarned(unit, completed);
              return (
                <li
                  key={unit.id}
                  className={on ? "badge-slot badge-slot-on" : "badge-slot badge-slot-off"}
                  title={on ? `${world.land} · ${kindOf(unit.id)}` : `Rute ${unit.index} masih terkunci`}
                >
                  <img src={world.stamp} alt="" className="size-8 pixelated object-contain" />
                  <span className="text-[13px] font-semibold tabular-nums">R{unit.index}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-5">
          <p className="text-sm font-bold">Progress</p>
          {lessonsDone === 0 ? (
            <p className="mt-2 text-base leading-6 text-muted">
              Belum ada bukti belajar di sini. Selesaikan satu pelajaran untuk memulai.
            </p>
          ) : (
            <>
              <p className="mt-2 text-base leading-6 text-muted">{lessonsDone} pelajaran selesai</p>
              <p className="text-base leading-6 text-muted">{perfect.length} pelajaran sempurna</p>
              <p className="text-base leading-6 text-muted">
                {completedStories.length + completedCases.length} kisah & bedah
              </p>
              <p className="text-base leading-6 text-muted">
                Hari ini {xpToday}/{dailyGoal} XP
              </p>
            </>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 lg:col-span-2">
          <Link to="/cara" className="min-h-12 font-bold text-primary">
            Cara main
          </Link>
          <Link to="/settings" className="min-h-12 font-bold text-primary">
            Pengaturan
          </Link>
          <Link to="/about" className="min-h-12 font-bold text-primary">
            Tentang web3min
          </Link>
        </div>
      </main>
    </AppShell>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: number | string }) {
  return (
    <li className="min-w-0 flex-1 text-center">
      <div className="flex items-center justify-center gap-1 text-muted">{icon}</div>
      <p className="mt-1 text-lg font-extrabold tabular-nums">{value}</p>
      <p className="text-[13px] font-medium text-muted">{label}</p>
    </li>
  );
}
