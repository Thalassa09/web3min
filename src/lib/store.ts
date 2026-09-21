import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getLesson, isUnlocked } from "@/lib/curriculum";
import { ACCESSORY_BY_ID, featuredOf, sanitizeWorn, type Worn } from "@/lib/accessories";
import { FREEZE_COST, HEART_REFILL_COST, OUTFIT_LABEL, SHOP_ITEMS } from "@/lib/shop";
import { QUESTS, questProgress } from "@/lib/quests";
import { getCase, getStory, isOpen, knownCaseIds, knownStoryIds } from "@/lib/stories";
import { sanitizeBio, sanitizeShout, sanitizeTwitter, sanitizeUsername, type Shout } from "@/lib/people";
import { daysBetween, todayKey, weekId, yesterdayKey } from "@/lib/time";
import { INITIAL_RAFFLES, RAFFLE_TICKET_PRICE } from "@/lib/raffles";

export type DailyGoal = 10 | 20 | 30 | 50;

export const MAX_HEARTS = 5;
export const HEART_MS = 20 * 60 * 1000;
export const GEM_CAP = 999_999;
export const STARTING_GEMS = 50;

export function formatGems(n: number) {
  return String(n);
}

function holdGems(current: number, delta = 0) {
  return Math.min(GEM_CAP, Math.max(0, current + delta));
}

export function msUntilHeart(heartsUpdatedAt: number, now = Date.now()) {
  const elapsed = now - heartsUpdatedAt;
  return Math.max(0, HEART_MS - (elapsed % HEART_MS));
}

export function formatHeartWait(ms: number) {
  const total = Math.max(1, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m <= 0) return `${s} detik`;
  return `${m} menit ${s.toString().padStart(2, "0")} detik`;
}

export type FriendMeta = { twitter: string; blurb: string };

export type ProgressState = {
  onboarded: boolean;
  username: string;
  twitter: string;
  friends: string[];
  friendMeta: Record<string, FriendMeta>;
  bio: string;
  shouts: Shout[];
  dailyGoal: DailyGoal;
  xp: number;
  gems: number;
  coinResetV1?: boolean;
  hearts: number;
  heartsUpdatedAt: number;
  streak: number;
  lastActiveDate: string;
  streakFreeze: number;
  xpToday: number;
  xpTodayDate: string;
  weeklyXp: number;
  weekKey: string;
  completed: string[];
  perfect: string[];
  outfits: string[];
  equipped: string | null;
  worn: Worn;
  sound: boolean;
  reduceMotion: boolean;
  introSeen: boolean;
  lessonsToday: number;
  perfectToday: number;
  storiesToday: number;
  claimedQuests: string[];
  completedStories: string[];
  completedCases: string[];
  guideSeen: boolean;
  coachSeen: boolean;
  raffleTickets: number;
  enteredRaffles: Record<string, { count: number; enteredAt: number }>;
};

export function needsCoach(s: Pick<ProgressState, "coachSeen" | "completed">) {
  return !s.coachSeen && s.completed.length === 0;
}

type Actions = {
  tick: () => void;
  completeOnboarding: (username: string, dailyGoal: DailyGoal) => void;
  completeIntro: () => void;
  completeGuide: () => void;
  setUsername: (username: string) => void;
  setTwitter: (handle: string) => boolean;
  addFriend: (username: string, twitter?: string) => boolean;
  removeFriend: (username: string) => void;
  setBio: (bio: string) => void;
  addShout: (text: string) => boolean;
  loseHeart: () => void;
  refillHearts: () => boolean;
  completeLesson: (
    id: string,
    info: { perfect: boolean },
  ) => { xp: number; gems: number; perfect: boolean; replay: boolean };
  claimChest: (id: string) => boolean;
  buyOutfit: (id: string) => boolean;
  equipOutfit: (id: string | null) => void;
  wearSlot: (id: string) => void;
  buyFreeze: () => boolean;
  claimQuest: (id: string) => boolean;
  completeStory: (id: string) => { xp: number; gems: number } | null;
  completeCase: (id: string) => { xp: number; gems: number } | null;
  enterRaffle: (raffleId: string, count: number) => boolean;
  buyRaffleTicketsWithGems: (ticketAmount: number) => boolean;
  addRaffleTicket: (count?: number) => void;
  reset: () => void;
  setSound: (on: boolean) => void;
  setReduceMotion: (on: boolean) => void;
};

const initial: ProgressState = {
  onboarded: false,
  username: "",
  twitter: "",
  friends: [],
  friendMeta: {},
  bio: "",
  shouts: [],
  dailyGoal: 20,
  xp: 0,
  gems: STARTING_GEMS,
  coinResetV1: true,
  hearts: MAX_HEARTS,
  heartsUpdatedAt: Date.now(),
  streak: 0,
  lastActiveDate: "",
  streakFreeze: 0,
  xpToday: 0,
  xpTodayDate: todayKey(),
  weeklyXp: 0,
  weekKey: weekId(),
  completed: [],
  perfect: [],
  outfits: [],
  equipped: null,
  worn: {},
  sound: true,
  reduceMotion: false,
  introSeen: false,
  guideSeen: false,
  coachSeen: false,
  lessonsToday: 0,
  perfectToday: 0,
  storiesToday: 0,
  claimedQuests: [],
  completedStories: [],
  completedCases: [],
  raffleTickets: 3,
  enteredRaffles: {},
};

function clamp(n: unknown, min: number, max: number, fallback: number) {
  const x = typeof n === "number" && Number.isFinite(n) ? Math.trunc(n) : fallback;
  return Math.min(max, Math.max(min, x));
}

export function clampRuntime(v: number, min: number, max: number) {
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, Math.trunc(v)));
}

function knownIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  const unique = new Set<string>();
  for (const id of ids) {
    if (typeof id === "string" && getLesson(id)) unique.add(id);
  }
  return [...unique];
}

function sanitizeMeta(raw: unknown): Record<string, FriendMeta> {
  if (!raw || typeof raw !== "object") return {};
  const next: Record<string, FriendMeta> = {};
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    const id = sanitizeUsername(key);
    if (!id || !val || typeof val !== "object") continue;
    const row = val as { twitter?: unknown; blurb?: unknown };
    next[id] = {
      twitter: sanitizeTwitter(row.twitter),
      blurb: String(row.blurb ?? "")
        .replace(/[<>]/g, "")
        .slice(0, 80),
    };
  }
  return next;
}

function sanitizeFriends(raw: unknown, username: string): string[] {
  if (!Array.isArray(raw)) return [];
  const unique = new Set<string>();
  for (const id of raw) {
    const clean = sanitizeUsername(id);
    if (clean && clean !== username) unique.add(clean);
  }
  return [...unique].slice(0, 40);
}

function sanitizeShouts(raw: unknown): Shout[] {
  if (!Array.isArray(raw)) return [];
  const rows: Shout[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as { id?: unknown; text?: unknown; at?: unknown };
    const text = sanitizeShout(row.text);
    if (!text) continue;
    const id = typeof row.id === "string" ? row.id.slice(0, 24) : `s${rows.length}`;
    const at = typeof row.at === "number" && Number.isFinite(row.at) ? row.at : Date.now();
    rows.push({ id, text, at });
  }
  return rows.slice(0, 20);
}

function sanitizeEnteredRaffles(raw: unknown): Record<string, { count: number; enteredAt: number }> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const validIds = new Set(INITIAL_RAFFLES.map((r) => r.id));
  const out: Record<string, { count: number; enteredAt: number }> = {};
  for (const [id, val] of Object.entries(raw as Record<string, unknown>)) {
    if (!validIds.has(id) || !val || typeof val !== "object") continue;
    const v = val as { count?: unknown; enteredAt?: unknown };
    const count = clamp(v.count, 0, 9999, 0);
    if (count <= 0) continue;
    out[id] = {
      count,
      enteredAt: typeof v.enteredAt === "number" && Number.isFinite(v.enteredAt) ? v.enteredAt : Date.now(),
    };
  }
  return out;
}

function sanitizeState(raw: (Partial<ProgressState> & { name?: string }) | undefined): ProgressState {
  if (!raw || typeof raw !== "object") return { ...initial, heartsUpdatedAt: Date.now() };
  const daily = raw.dailyGoal;
  const dailyGoal: DailyGoal = daily === 10 || daily === 20 || daily === 30 || daily === 50 ? daily : 20;
  const outfits = Array.isArray(raw.outfits)
    ? raw.outfits.filter((id): id is string => typeof id === "string" && id in OUTFIT_LABEL)
    : [];
  let worn = sanitizeWorn(raw.worn, outfits);
  if (!Object.keys(worn).length && typeof raw.equipped === "string" && outfits.includes(raw.equipped)) {
    const slot = ACCESSORY_BY_ID[raw.equipped]?.slot;
    if (slot) worn = { [slot]: raw.equipped };
  }
  const equipped = featuredOf(worn);
  const username = sanitizeUsername(raw.username || raw.name);
  const twitter = sanitizeTwitter(raw.twitter);
  const friendMeta = sanitizeMeta(raw.friendMeta);
  const friends = sanitizeFriends(raw.friends, username);
  const coinResetDone = Boolean((raw as { coinResetV1?: unknown })?.coinResetV1);
  const currentGems = coinResetDone && typeof raw.gems === "number" ? raw.gems : STARTING_GEMS;
  return {
    onboarded: Boolean(raw.onboarded),
    introSeen: Boolean(raw.introSeen),
    guideSeen: Boolean(raw.guideSeen),
    coachSeen: Boolean(raw.coachSeen),
    username,
    twitter,
    friends,
    friendMeta,
    bio: sanitizeBio(raw.bio),
    shouts: sanitizeShouts(raw.shouts),
    dailyGoal,
    xp: clamp(raw.xp, 0, 5_000_000, 0),
    gems: holdGems(currentGems),
    coinResetV1: true,
    hearts: clamp(raw.hearts, 0, MAX_HEARTS, MAX_HEARTS),
    heartsUpdatedAt: typeof raw.heartsUpdatedAt === "number" && raw.heartsUpdatedAt > 0 ? raw.heartsUpdatedAt : Date.now(),
    streak: clamp(raw.streak, 0, 10_000, 0),
    lastActiveDate: typeof raw.lastActiveDate === "string" ? raw.lastActiveDate.slice(0, 10) : "",
    streakFreeze: clamp(raw.streakFreeze, 0, 30, 0),
    xpToday: clamp(raw.xpToday, 0, 10_000, 0),
    xpTodayDate: typeof raw.xpTodayDate === "string" ? raw.xpTodayDate.slice(0, 10) : todayKey(),
    weeklyXp: clamp(raw.weeklyXp, 0, 1_000_000, 0),
    weekKey: typeof raw.weekKey === "string" ? raw.weekKey.slice(0, 16) : weekId(),
    completed: knownIds(raw.completed),
    perfect: knownIds(raw.perfect),
    outfits,
    equipped,
    worn,
    sound: raw.sound !== false,
    reduceMotion: Boolean(raw.reduceMotion),
    lessonsToday: clamp(raw.lessonsToday, 0, 50, 0),
    perfectToday: clamp(raw.perfectToday, 0, 50, 0),
    storiesToday: clamp(raw.storiesToday, 0, 50, 0),
    claimedQuests: Array.isArray(raw.claimedQuests)
      ? raw.claimedQuests
          .filter((id): id is string => typeof id === "string" && QUESTS.some((q) => q.id === id))
          .slice(0, 8)
      : [],
    completedStories: knownStoryIds(raw.completedStories),
    completedCases: knownCaseIds(raw.completedCases),
    raffleTickets: clamp(raw.raffleTickets, 0, 9999, 3),
    enteredRaffles: sanitizeEnteredRaffles(raw.enteredRaffles),
  };
}

function regenHearts(state: ProgressState): ProgressState {
  if (state.hearts >= MAX_HEARTS) return state;
  const gained = Math.floor((Date.now() - state.heartsUpdatedAt) / HEART_MS);
  if (gained <= 0) return state;
  const hearts = Math.min(MAX_HEARTS, state.hearts + gained);
  const heartsUpdatedAt =
    hearts >= MAX_HEARTS ? Date.now() : state.heartsUpdatedAt + gained * HEART_MS;
  return { ...state, hearts, heartsUpdatedAt };
}

function rollDay(state: ProgressState): ProgressState {
  const today = todayKey();
  const week = weekId();
  const next = { ...state };
  if (next.xpTodayDate !== today) {
    next.xpToday = 0;
    next.xpTodayDate = today;
    next.lessonsToday = 0;
    next.perfectToday = 0;
    next.storiesToday = 0;
    next.claimedQuests = [];

    // Check multi-day inactivity and consume freeze or reset streak
    if (next.lastActiveDate && next.lastActiveDate !== today && next.lastActiveDate !== yesterdayKey()) {
      const elapsed = daysBetween(next.lastActiveDate, today);
      if (elapsed > 1) {
        const missedDays = elapsed - 1;
        if (next.streakFreeze >= missedDays) {
          next.streakFreeze -= missedDays;
          next.lastActiveDate = yesterdayKey();
        } else {
          next.streak = 0;
          next.streakFreeze = 0;
        }
      }
    }
  }
  if (next.weekKey !== week) {
    next.weeklyXp = 0;
    next.weekKey = week;
  }
  return next;
}

function touchStreak(state: ProgressState): ProgressState {
  const today = todayKey();
  if (state.lastActiveDate === today) return state;
  if (!state.lastActiveDate) {
    return { ...state, streak: 1, lastActiveDate: today };
  }
  const gap = daysBetween(state.lastActiveDate, today);
  if (gap === 1) {
    return { ...state, streak: state.streak + 1, lastActiveDate: today };
  }
  if (gap > 1) {
    const needed = gap - 1;
    if (state.streakFreeze >= needed) {
      return {
        ...state,
        streakFreeze: state.streakFreeze - needed,
        streak: state.streak + 1,
        lastActiveDate: today,
      };
    } else {
      return {
        ...state,
        streak: 1,
        streakFreeze: 0,
        lastActiveDate: today,
      };
    }
  }
  return state;
}

export const useProgress = create<ProgressState & Actions>()(
  persist(
    (set, get) => ({
      ...initial,
      tick: () => {
        set((s) => {
          const next = regenHearts(rollDay(s));
          const gems = holdGems(next.gems);
          return gems === next.gems ? next : { ...next, gems };
        });
      },
      completeOnboarding: (username, dailyGoal) => {
        const clean = sanitizeUsername(username) || "pelajar";
        const goal: DailyGoal =
          dailyGoal === 10 || dailyGoal === 20 || dailyGoal === 30 || dailyGoal === 50 ? dailyGoal : 20;
        set({
          onboarded: true,
          introSeen: true,
          username: clean,
          dailyGoal: goal,
          gems: STARTING_GEMS,
          hearts: MAX_HEARTS,
        });
      },
      completeIntro: () => {
        if (get().introSeen) return;
        set({ introSeen: true });
      },
      completeGuide: () => {
        const s = get();
        if (s.coachSeen && s.guideSeen) return;
        set({ guideSeen: true, coachSeen: true });
      },
      setUsername: (username) => {
        const clean = sanitizeUsername(username);
        if (clean.length < 3) return;
        set({ username: clean, friends: get().friends.filter((id) => id !== clean) });
      },
      setTwitter: (handle) => {
        set({ twitter: sanitizeTwitter(handle) });
        return true;
      },
      addFriend: (username, twitter) => {
        const s = get();
        const id = sanitizeUsername(username);
        if (!id || id.length < 3 || id === s.username) return false;
        if (s.friends.includes(id) || s.friends.length >= 40) return false;
        const tw = sanitizeTwitter(twitter);
        const friendMeta = tw
          ? { ...s.friendMeta, [id]: { twitter: tw, blurb: s.friendMeta[id]?.blurb ?? "" } }
          : s.friendMeta;
        set({ friends: [...s.friends, id], friendMeta });
        return true;
      },
      removeFriend: (username) => {
        const id = sanitizeUsername(username);
        set((s) => ({ friends: s.friends.filter((row) => row !== id) }));
      },
      setBio: (bio) => set({ bio: sanitizeBio(bio) }),
      addShout: (text) => {
        const clean = sanitizeShout(text);
        if (clean.length < 2) return false;
        const shout: Shout = { id: `s${Date.now().toString(36)}`, text: clean, at: Date.now() };
        set((s) => ({ shouts: [shout, ...s.shouts].slice(0, 20) }));
        return true;
      },
      loseHeart: () => {
        set((s) => {
          if (s.hearts <= 0) return s;
          const hearts = s.hearts - 1;
          return {
            ...s,
            hearts,
            heartsUpdatedAt: s.hearts === MAX_HEARTS ? Date.now() : s.heartsUpdatedAt,
          };
        });
      },
      refillHearts: () => {
        const s = get();
        if (s.gems < HEART_REFILL_COST) return false;
        set({ gems: holdGems(s.gems, -HEART_REFILL_COST), hearts: MAX_HEARTS, heartsUpdatedAt: Date.now() });
        return true;
      },
      completeLesson: (id, info) => {
        const s0 = get();
        const lesson = getLesson(id);
        if (!lesson || lesson.kind === "chest") {
          return { xp: 0, gems: 0, perfect: false, replay: false };
        }
        const already = s0.completed.includes(id);
        if (!already && !isUnlocked(id, s0.completed)) {
          return { xp: 0, gems: 0, perfect: false, replay: false };
        }
        const xpGain = already ? Math.min(2, lesson.xp) : lesson.xp + (info.perfect ? 8 : 0);
        const dailyXpGain = already ? 0 : xpGain;
        const gemGain = already ? 0 : lesson.gems + (info.perfect ? 2 : 0);
        const ticketGain = already ? 0 : 1 + (info.perfect ? 1 : 0);
        set((s) => {
          let next = touchStreak(rollDay(regenHearts(s)));
          return {
            ...next,
            xp: clampRuntime(next.xp + xpGain, 0, 5_000_000),
            gems: holdGems(next.gems, gemGain),
            raffleTickets: (next.raffleTickets ?? 0) + ticketGain,
            xpToday: clampRuntime(next.xpToday + dailyXpGain, 0, 10_000),
            weeklyXp: clampRuntime(next.weeklyXp + dailyXpGain, 0, 1_000_000),
            completed: already ? next.completed : [...next.completed, id],
            perfect:
              info.perfect && !next.perfect.includes(id) ? [...next.perfect, id] : next.perfect,
            lessonsToday: already ? next.lessonsToday : next.lessonsToday + 1,
            perfectToday:
              info.perfect && !already ? next.perfectToday + 1 : next.perfectToday,
            guideSeen: true,
            coachSeen: true,
          };
        });
        return { xp: xpGain, gems: gemGain, perfect: info.perfect, replay: already };
      },
      claimChest: (id) => {
        const s = get();
        const lesson = getLesson(id);
        if (!lesson || lesson.kind !== "chest") return false;
        if (s.completed.includes(id)) return false;
        if (!isUnlocked(id, s.completed)) return false;
        set({
          completed: [...s.completed, id],
          gems: holdGems(s.gems, lesson.gems),
        });
        return true;
      },
      buyOutfit: (id) => {
        const s = get();
        const item = SHOP_ITEMS.find((row) => row.id === id && row.kind === "outfit");
        if (!item) return false;
        const slot = ACCESSORY_BY_ID[id]?.slot;
        if (!slot) return false;
        if (s.outfits.includes(id)) {
          const worn = { ...s.worn, [slot]: id };
          set({ worn, equipped: featuredOf(worn) });
          return true;
        }
        if (s.gems < item.cost) return false;
        const worn = { ...s.worn, [slot]: id };
        set({
          gems: holdGems(s.gems, -item.cost),
          outfits: [...s.outfits, id],
          worn,
          equipped: featuredOf(worn),
        });
        return true;
      },
      equipOutfit: (id) => {
        if (id === null) {
          set({ worn: {}, equipped: null });
          return;
        }
        if (!get().outfits.includes(id)) return;
        const slot = ACCESSORY_BY_ID[id]?.slot;
        if (!slot) return;
        const worn = { ...get().worn };
        if (worn[slot] === id) delete worn[slot];
        else worn[slot] = id;
        set({ worn, equipped: featuredOf(worn) });
      },
      wearSlot: (id) => {
        get().equipOutfit(id);
      },
      buyFreeze: () => {
        const s = get();
        if (s.gems < FREEZE_COST) return false;
        set({ gems: holdGems(s.gems, -FREEZE_COST), streakFreeze: Math.min(30, s.streakFreeze + 1) });
        return true;
      },
      claimQuest: (id) => {
        const s = rollDay(get());
        if (s.claimedQuests.includes(id)) return false;
        const def = QUESTS.find((q) => q.id === id);
        if (!def) return false;
        const prog = questProgress(def.id, s);
        if (!prog.done) return false;
        set({
          ...s,
          claimedQuests: [...s.claimedQuests, id],
          gems: holdGems(s.gems, def.gems),
        });
        return true;
      },
      completeStory: (id) => {
        const story = getStory(id);
        if (!story) return null;
        let awarded: { xp: number; gems: number } | null = null;
        set((s) => {
          if (!isOpen(story.unlockAfter, s.completed)) return s;
          const already = s.completedStories.includes(id);
          const next = touchStreak(rollDay(regenHearts(s)));
          const xpGain = already ? 0 : story.xp;
          const gemGain = already ? 0 : story.gems;
          awarded = { xp: xpGain, gems: gemGain };
          return {
            ...next,
            xp: clampRuntime(next.xp + xpGain, 0, 5_000_000),
            gems: holdGems(next.gems, gemGain),
            xpToday: clampRuntime(next.xpToday + xpGain, 0, 10_000),
            weeklyXp: clampRuntime(next.weeklyXp + xpGain, 0, 1_000_000),
            storiesToday: already ? next.storiesToday : next.storiesToday + 1,
            completedStories: already ? next.completedStories : [...next.completedStories, id],
          };
        });
        return awarded;
      },
      completeCase: (id) => {
        const study = getCase(id);
        if (!study) return null;
        let awarded: { xp: number; gems: number } | null = null;
        set((s) => {
          if (!isOpen(study.unlockAfter, s.completed)) return s;
          const already = s.completedCases.includes(id);
          const next = touchStreak(rollDay(regenHearts(s)));
          const xpGain = already ? 0 : study.xp;
          const gemGain = already ? 0 : study.gems;
          awarded = { xp: xpGain, gems: gemGain };
          return {
            ...next,
            xp: clampRuntime(next.xp + xpGain, 0, 5_000_000),
            gems: holdGems(next.gems, gemGain),
            xpToday: clampRuntime(next.xpToday + xpGain, 0, 10_000),
            weeklyXp: clampRuntime(next.weeklyXp + xpGain, 0, 1_000_000),
            storiesToday: already ? next.storiesToday : next.storiesToday + 1,
            completedCases: already ? next.completedCases : [...next.completedCases, id],
          };
        });
        return awarded;
      },
      enterRaffle: (raffleId, count) => {
        const s = get();
        const raffle = INITIAL_RAFFLES.find((r) => r.id === raffleId);
        if (!raffle) return false;
        if (raffle.status !== "live" || raffle.endsAt <= Date.now()) return false;
        const qty = Math.trunc(count);
        if (!Number.isFinite(qty) || qty <= 0 || (s.raffleTickets ?? 0) < qty) return false;
        const currentCount = s.enteredRaffles?.[raffleId]?.count ?? 0;
        set({
          raffleTickets: (s.raffleTickets ?? 0) - qty,
          enteredRaffles: {
            ...s.enteredRaffles,
            [raffleId]: { count: currentCount + qty, enteredAt: Date.now() },
          },
        });
        return true;
      },
      buyRaffleTicketsWithGems: (ticketAmount) => {
        const s = get();
        const qty = Math.trunc(ticketAmount);
        if (!Number.isFinite(qty) || qty <= 0) return false;
        const cost = qty * RAFFLE_TICKET_PRICE;
        if (s.gems < cost) return false;
        const newTickets = Math.min(9999, (s.raffleTickets ?? 0) + qty);
        set({
          gems: holdGems(s.gems, -cost),
          raffleTickets: newTickets,
        });
        return true;
      },
      addRaffleTicket: (count = 1) => {
        const qty = Math.trunc(count);
        if (!Number.isFinite(qty) || qty <= 0) return;
        set((s) => ({ raffleTickets: Math.min(9999, (s.raffleTickets ?? 0) + qty) }));
      },
      reset: () => set({ ...initial, heartsUpdatedAt: Date.now() }),
      setSound: (on) => set({ sound: Boolean(on) }),
      setReduceMotion: (on) => set({ reduceMotion: Boolean(on) }),
    }),
    {
      name: "web3min-v2",
      skipHydration: true,
      merge: (persisted, current) => ({
        ...current,
        ...sanitizeState(persisted as Partial<ProgressState>),
      }),
    },
  ),
);
