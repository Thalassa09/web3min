import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CaseClinic } from "@/components/case-clinic";
import { getCase, isOpen } from "@/lib/stories";
import { useProgress, useHydrated } from "@/lib/store";

export const Route = createFileRoute("/bedah/$caseId")({ component: CasePage });

function CasePage() {
  const { caseId } = Route.useParams();
  const study = getCase(caseId);
  const onboarded = useProgress((s) => s.onboarded);
  const introSeen = useProgress((s) => s.introSeen);
  const completed = useProgress((s) => s.completed);
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const open = study ? isOpen(study.unlockAfter, completed) : false;

  useEffect(() => {
    // Tunggu localStorage selesai dibaca dulu — efek anak berjalan sebelum efek
    // induk (HydrationGate), jadi tanpa ini deep link /bedah/<id> terlempar ke
    // /onboarding walau user sudah daftar.
    if (!hydrated) return;
    // Baca nilai TERKINI: field dari render ini bisa tertinggal satu render saat
    // rehydrate selesai (lihat catatan di lesson.$lessonId.tsx).
    const live = useProgress.getState();
    if (!live.onboarded) void navigate({ to: "/onboarding" });
    else if (!live.introSeen) void navigate({ to: "/intro" });
    else if (!study || !open) void navigate({ to: "/kisah" });
  }, [hydrated, onboarded, introSeen, study, open, navigate]);

  if (!hydrated || !onboarded || !introSeen || !study || !open) return null;
  return <CaseClinic key={study.id} study={study} />;
}
