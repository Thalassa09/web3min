import type { ReactNode } from "react";
import { SideNav } from "@/components/side-nav";
import { TopStatus } from "@/components/top-status";
import { BottomNav } from "@/components/bottom-nav";
import { GameOverlayHUD } from "@/components/game-overlay-hud";
import { CensoredUsernameModal } from "@/components/censored-username-modal";

export function AppShell({
  children,
  rail,
}: {
  children: ReactNode;
  rail?: ReactNode;
}) {
  return (
    <div className="desk-shell hex-wash">
      <SideNav />
      <div className="desk-stage">
        <TopStatus />
        <div className="w-full min-w-0 flex-1 relative">
          <div className="w-full min-w-0">{children}</div>
          {rail ? <GameOverlayHUD>{rail}</GameOverlayHUD> : null}
        </div>
        <BottomNav />
      </div>
      <CensoredUsernameModal />
    </div>
  );
}
