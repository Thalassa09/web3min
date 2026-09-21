import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useProgress } from "@/lib/store";

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

    // Update client Zustand store from canonical server state
    useProgress.setState((s) => ({
      ...s,
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
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase.rpc("complete_lesson", {
      p_lesson_id: lessonId,
      p_perfect: perfect,
    });

    if (error || !data) return null;
    return {
      xp: data.xp,
      gems: data.gems,
      tickets: data.tickets,
      replay: data.replay,
    };
  } catch (err) {
    console.warn("[server-sync] RPC complete_lesson failed:", err);
    return null;
  }
}

export async function rpcClaimQuest(questId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { error } = await supabase.rpc("claim_quest", { p_quest_id: questId });
    return !error;
  } catch {
    return false;
  }
}

export async function rpcEnterRaffle(raffleId: string, tickets: number): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
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
  }
}
