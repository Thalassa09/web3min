import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { StoryPlayer } from "@/components/story-player";
import { getStory, isOpen } from "@/lib/stories";
import { useProgress } from "@/lib/store";

export const Route = createFileRoute("/kisah/$storyId")({ component: StoryPage });

function StoryPage() {
  const { storyId } = Route.useParams();
  const story = getStory(storyId);
  const onboarded = useProgress((s) => s.onboarded);
  const introSeen = useProgress((s) => s.introSeen);
  const completed = useProgress((s) => s.completed);
  const navigate = useNavigate();
  const open = story ? isOpen(story.unlockAfter, completed) : false;

  useEffect(() => {
    if (!onboarded) void navigate({ to: "/onboarding" });
    else if (!introSeen) void navigate({ to: "/intro" });
    else if (!story || !open) void navigate({ to: "/kisah" });
  }, [onboarded, introSeen, story, open, navigate]);

  if (!onboarded || !introSeen || !story || !open) return null;
  return <StoryPlayer key={story.id} story={story} />;
}
