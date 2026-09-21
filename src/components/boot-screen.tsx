import { Mascot } from "@/components/mascot";
import { cn } from "@/lib/utils";

export function BootScreen({
  title = "web3min",
  hint = "Menyiapkan rute…",
  className,
}: {
  title?: string;
  hint?: string;
  stamp?: string;
  className?: string;
}) {
  return (
    <div className={cn("boot-screen hex-wash", className)} role="status" aria-live="polite">
      <Mascot mood="wave" size={140} interactive={false} />
      <p className="boot-title">{title}</p>
      <p className="boot-hint">{hint}</p>
      <div className="boot-track" aria-hidden>
        <span />
      </div>
    </div>
  );
}
