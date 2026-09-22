import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useProgress } from "@/lib/store";

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

    const { data: progress, error } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (error || !progress) return false;

    // Fetch profile bio & metadata if available
    const { data: profile } = await supabase
      .from("profiles")
      .select("bio, twitter")
      .eq("id", session.user.id)
      .maybeSingle();

    // Update client Zustand store from canonical server state
    useProgress.setState((s) => ({
      ...s,
      bio: typeof profile?.bio === "string" ? profile.bio : s.bio,
      twitter: typeof profile?.twitter === "string" ? profile.twitter : s.twitter,
      xp: progress.xp,
      gems: progress.gems,
      hearts: progress.hearts,
      heartsUpdatedAt: new Date(progress.hearts_updated_at).getTime(),
      streak: progress.streak,
      streakFreeze: progress.streak_freeze,
      lastActiveDate: progress.last_active_date,
      xpToday: progress.xp_today,
      xpTodayDate: progress.xp_today_date,
      weeklyXp: progress.weekly_xp,
      weekKey: progress.week_key,
      lessonsToday: progress.lessons_today,
      perfectToday: progress.perfect_today,
      storiesToday: progress.stories_today,
      raffleTickets: progress.raffle_tickets,
    }));
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
