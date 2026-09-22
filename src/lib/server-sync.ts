import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useProgress } from "@/lib/store";
import { getLesson } from "@/lib/curriculum";
import { getStory, getCase } from "@/lib/stories";
import { todayKey } from "@/lib/time";
import { sanitizeUsername } from "@/lib/people";

const SERVER_QUEST_TO_CLIENT: Record<string, string> = {
  "lesson-1": "lesson",
  "xp-30": "xp",
  "story-1": "kisah",
  perfect: "perfect",
  lesson: "lesson",
  xp: "xp",
  kisah: "kisah",
};

// Client-side in-flight tracking & cooldown to prevent rapid spam clicks
const inFlightOps = new Set<string>();
const lastOpTimes = new Map<string, number>();

function canExecuteOp(key: string, cooldownMs = 800): boolean {
  if (inFlightOps.has(key)) return false;
  const lastTime = lastOpTimes.get(key) ?? 0;
  if (Date.now() - lastTime < cooldownMs) return false;
  return true;
}

function startOp(key: string) {
  inFlightOps.add(key);
  lastOpTimes.set(key, Date.now());
}

function endOp(key: string) {
  inFlightOps.delete(key);
}

export async function syncProgressFromServer(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;
    const uid = session.user.id;
    const today = todayKey();

    const [progressRes, profileRes, completionsRes, questsRes, raffleRes] = await Promise.all([
      supabase.from("progress").select("*").eq("user_id", uid).maybeSingle(),
      supabase.from("profiles").select("username, bio, twitter").eq("id", uid).maybeSingle(),
      supabase.from("completions").select("lesson_id, perfect").eq("user_id", uid),
      supabase.from("claimed_quests").select("quest_id, quest_date").eq("user_id", uid).eq("quest_date", today),
      supabase.from("raffle_entries").select("raffle_id, tickets, entered_at").eq("user_id", uid),
    ]);

    const progress = progressRes.data;
    const profile = profileRes.data;
    const completionRows = completionsRes.data ?? [];
    const questRows = questsRes.data ?? [];
    const raffleRows = raffleRes.data ?? [];

    const completed: string[] = [];
    const perfect: string[] = [];
    const completedStories: string[] = [];
    const completedCases: string[] = [];
    for (const row of completionRows) {
      const id = typeof row.lesson_id === "string" ? row.lesson_id : "";
      if (!id) continue;
      if (id.startsWith("story:")) {
        const sid = id.slice(6);
        if (getStory(sid)) completedStories.push(sid);
        continue;
      }
      if (id.startsWith("case:")) {
        const cid = id.slice(5);
        if (getCase(cid)) completedCases.push(cid);
        continue;
      }
      if (getLesson(id)) {
        completed.push(id);
        if (row.perfect) perfect.push(id);
      }
    }

    const claimedQuests = questRows
      .map((q) => SERVER_QUEST_TO_CLIENT[String(q.quest_id)])
      .filter((id): id is "lesson" | "xp" | "kisah" | "perfect" => Boolean(id));

    const enteredRaffles: Record<string, { count: number; enteredAt: number }> = {};
    for (const row of raffleRows) {
      const rid = String(row.raffle_id ?? "");
      const count = Number(row.tickets) || 0;
      if (!rid || count <= 0) continue;
      enteredRaffles[rid] = {
        count,
        enteredAt: row.entered_at ? new Date(row.entered_at).getTime() : Date.now(),
      };
    }

    const serverHasProgress =
      (typeof progress?.xp === "number" && progress.xp > 0) ||
      completed.length > 0 ||
      completedStories.length > 0 ||
      completedCases.length > 0;

    const serverUsername = sanitizeUsername(profile?.username ?? "");
    const dailyGoalRaw = progress?.daily_goal;
    const dailyGoal =
      dailyGoalRaw === 10 || dailyGoalRaw === 20 || dailyGoalRaw === 30 || dailyGoalRaw === 50
        ? dailyGoalRaw
        : undefined;

    useProgress.setState((s) => {
      // Monotonic UNION merge: NEVER delete completed lessons or drop below earned stats
      const mergedCompleted = Array.from(new Set([...s.completed, ...completed]));
      const mergedPerfect = Array.from(new Set([...s.perfect, ...perfect]));
      const mergedStories = Array.from(new Set([...s.completedStories, ...completedStories]));
      const mergedCases = Array.from(new Set([...s.completedCases, ...completedCases]));
      const mergedQuests = Array.from(new Set([...s.claimedQuests, ...claimedQuests]));
      const mergedRaffles = { ...s.enteredRaffles, ...enteredRaffles };

      return {
        ...s,
        onboarded: true,
        introSeen: true,
        guideSeen: true,
        coachSeen: true,
        username: serverUsername || s.username,
        bio: typeof profile?.bio === "string" && profile.bio ? profile.bio : s.bio,
        twitter: typeof profile?.twitter === "string" && profile.twitter ? profile.twitter : s.twitter,
        dailyGoal: dailyGoal ?? s.dailyGoal,
        completed: mergedCompleted,
        perfect: mergedPerfect,
        completedStories: mergedStories,
        completedCases: mergedCases,
        claimedQuests: mergedQuests,
        enteredRaffles: Object.keys(mergedRaffles).length ? mergedRaffles : s.enteredRaffles,
        xp: Math.max(s.xp, progress?.xp ?? 0),
        gems: Math.max(s.gems, progress?.gems ?? 0),
        hearts: typeof progress?.hearts === "number" ? progress.hearts : s.hearts,
        heartsUpdatedAt: progress?.hearts_updated_at
          ? new Date(progress.hearts_updated_at).getTime()
          : s.heartsUpdatedAt,
        streak: Math.max(s.streak, progress?.streak ?? 0),
        streakFreeze: Math.max(s.streakFreeze, progress?.streak_freeze ?? 0),
        lastActiveDate: progress?.last_active_date
          ? String(progress.last_active_date).slice(0, 10)
          : s.lastActiveDate,
        xpToday: typeof progress?.xp_today === "number" ? Math.max(s.xpToday, progress.xp_today) : s.xpToday,
        xpTodayDate: progress?.xp_today_date
          ? String(progress.xp_today_date).slice(0, 10)
          : s.xpTodayDate,
        weeklyXp: typeof progress?.weekly_xp === "number" ? Math.max(s.weeklyXp, progress.weekly_xp) : s.weeklyXp,
        weekKey: progress?.week_key ?? s.weekKey,
        lessonsToday: typeof progress?.lessons_today === "number" ? Math.max(s.lessonsToday, progress.lessons_today) : s.lessonsToday,
        perfectToday: typeof progress?.perfect_today === "number" ? Math.max(s.perfectToday, progress.perfect_today) : s.perfectToday,
        storiesToday: typeof progress?.stories_today === "number" ? Math.max(s.storiesToday, progress.stories_today) : s.storiesToday,
        raffleTickets:
          typeof progress?.raffle_tickets === "number"
            ? Math.max(s.raffleTickets ?? 0, progress.raffle_tickets)
            : s.raffleTickets,
      };
    });

    // Background convergence: upload any locally completed lessons that server doesn't have yet
    const localOnly = useProgress.getState().completed.filter((id) => !completed.includes(id));
    if (localOnly.length > 0) {
      for (const id of localOnly) {
        void rpcCompleteLesson(id, useProgress.getState().perfect.includes(id));
      }
    }

    return true;
  } catch (err) {
    console.warn("[server-sync] Failed to sync progress from server:", err);
    return false;
  }
}

export async function rpcCompleteLesson(
  lessonId: string,
  perfect: boolean,
): Promise<{ xp: number; gems: number; tickets: number; replay: boolean } | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const opKey = `lesson:${lessonId}`;
  if (!canExecuteOp(opKey, 1000)) return null;
  startOp(opKey);
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase.rpc("complete_lesson", {
      p_lesson_id: lessonId,
      p_perfect: perfect,
    });

    if (error || !data) {
      if (error?.message?.includes("Rate limit") || error?.message?.includes("Terlalu banyak")) {
        console.warn("[server-sync] Rate limited:", error.message);
      }
      return null;
    }
    return {
      xp: data.xp,
      gems: data.gems,
      tickets: data.tickets,
      replay: data.replay,
    };
  } catch (err) {
    console.warn("[server-sync] RPC complete_lesson failed:", err);
    return null;
  } finally {
    endOp(opKey);
  }
}

export async function rpcCompleteStory(
  storyId: string,
): Promise<{ xp: number; gems: number; replay: boolean } | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const opKey = `story:${storyId}`;
  if (!canExecuteOp(opKey, 1000)) return null;
  startOp(opKey);
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase.rpc("complete_story", {
      p_story_id: storyId,
    });

    if (error || !data) {
      if (error?.message?.includes("Rate limit") || error?.message?.includes("Terlalu banyak")) {
        console.warn("[server-sync] Rate limited:", error.message);
      }
      return null;
    }
    return {
      xp: data.xp,
      gems: data.gems,
      replay: data.replay,
    };
  } catch (err) {
    console.warn("[server-sync] RPC complete_story failed:", err);
    return null;
  } finally {
    endOp(opKey);
  }
}

export async function rpcClaimQuest(questId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  const opKey = `quest:${questId}`;
  if (!canExecuteOp(opKey, 1000)) return false;
  startOp(opKey);
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { error } = await supabase.rpc("claim_quest", { p_quest_id: questId });
    return !error;
  } catch {
    return false;
  } finally {
    endOp(opKey);
  }
}

export async function rpcBuyFreeze(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  const opKey = "shop:freeze";
  if (!canExecuteOp(opKey, 1000)) return false;
  startOp(opKey);
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { error } = await supabase.rpc("buy_freeze");
    return !error;
  } catch {
    return false;
  } finally {
    endOp(opKey);
  }
}

export async function rpcRefillHearts(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  const opKey = "shop:refill";
  if (!canExecuteOp(opKey, 1000)) return false;
  startOp(opKey);
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { error } = await supabase.rpc("refill_hearts");
    return !error;
  } catch {
    return false;
  } finally {
    endOp(opKey);
  }
}

export async function rpcBuyTickets(count: number): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  const opKey = `shop:tickets:${count}`;
  if (!canExecuteOp(opKey, 1000)) return false;
  startOp(opKey);
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { error } = await supabase.rpc("buy_tickets", { p_count: count });
    return !error;
  } catch {
    return false;
  } finally {
    endOp(opKey);
  }
}

export async function rpcEnterRaffle(raffleId: string, tickets: number): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  const opKey = `raffle:${raffleId}`;
  if (!canExecuteOp(opKey, 1000)) return false;
  startOp(opKey);
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { error } = await supabase.rpc("enter_raffle", {
      p_raffle_id: raffleId,
      p_tickets: tickets,
    });
    return !error;
  } catch {
    return false;
  } finally {
    endOp(opKey);
  }
}

export async function saveBioToServer(bio: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  const opKey = "profile:bio";
  if (!canExecuteOp(opKey, 2000)) return false;
  startOp(opKey);
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { error } = await supabase
      .from("profiles")
      .update({ bio })
      .eq("id", session.user.id);

    return !error;
  } catch (err) {
    console.warn("[server-sync] Failed to save bio to server:", err);
    return false;
  } finally {
    endOp(opKey);
  }
}
