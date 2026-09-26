import { useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { StoryPlayer } from "@/components/story-player";
import { getStory } from "@/lib/stories";
import { useProgress } from "@/lib/store";
import { buildMeta } from "@/lib/seo";
import { Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/kisah/$storyId")({
  head: ({ params }) => {
    const story = getStory(params.storyId);
    const title = story ? `${story.title} — Kisah web3min` : "Kisah Nyata Web3 — web3min";
    const description = story?.blurb || "Simulasi kisah nyata dunia Web3 di web3min.";
    return buildMeta({
      title,
      description,
      path: `/kisah/${params.storyId}`,
    });
  },
  component: StoryPage,
});

function StoryPage() {
  const { storyId } = Route.useParams();
  const story = getStory(storyId);
  const onboarded = useProgress((s) => s.onboarded);
  const navigate = useNavigate();

  useEffect(() => {
    // If story doesn't exist, redirect to stories hub
    if (!story) void navigate({ to: "/kisah" });
  }, [story, navigate]);

  if (!story) return null;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {!onboarded && (
        <aside
          role="region"
          aria-label="Ajakan onboarding"
          className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 border-b-2 border-choco-900 px-4 py-2 text-xs font-bold text-choco-900 shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-amber-600 shrink-0" />
            <span>Mode Baca Cerita Web3</span>
          </div>
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-candy-800 hover:bg-candy-950 text-white font-pixel text-[11px] font-bold border border-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5 transition-all"
          >
            <span>Mulai Petualangan</span>
            <ArrowRight className="size-3" />
          </Link>
        </aside>
      )}
      <StoryPlayer key={story.id} story={story} />
    </div>
  );
}
