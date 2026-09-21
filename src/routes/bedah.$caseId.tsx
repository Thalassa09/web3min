import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CaseClinic } from "@/components/case-clinic";
import { getCase, isOpen } from "@/lib/stories";
import { useProgress } from "@/lib/store";

export const Route = createFileRoute("/bedah/$caseId")({ component: CasePage });

function CasePage() {
  const { caseId } = Route.useParams();
  const study = getCase(caseId);
  const onboarded = useProgress((s) => s.onboarded);
  const introSeen = useProgress((s) => s.introSeen);
  const completed = useProgress((s) => s.completed);
  const navigate = useNavigate();
  const open = study ? isOpen(study.unlockAfter, completed) : false;

  useEffect(() => {
    if (!onboarded) void navigate({ to: "/onboarding" });
    else if (!introSeen) void navigate({ to: "/intro" });
    else if (!study || !open) void navigate({ to: "/kisah" });
  }, [onboarded, introSeen, study, open, navigate]);

  if (!onboarded || !introSeen || !study || !open) return null;
  return <CaseClinic key={study.id} study={study} />;
}
