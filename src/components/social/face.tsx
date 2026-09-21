import { Mascot } from "@/components/mascot";
import { lookOf } from "@/lib/people";
import { cn } from "@/lib/utils";

export function Face({
  name,
  size,
  ring,
  you,
}: {
  name: string;
  size: number;
  ring?: boolean;
  you?: boolean;
}) {
  const look = lookOf(name);
  return (
    <span
      className={cn("social-ring", look.skin, ring && "social-ring-on")}
      style={{ width: size, height: size }}
    >
      {you ? (
        <span className="social-face social-face-you">
          <Mascot mood="idle" size={Math.round(size * 0.92)} lite />
        </span>
      ) : (
        <span className="social-face">
          <img src={look.stamp} alt="" className="pixelated size-[70%] object-contain" />
        </span>
      )}
    </span>
  );
}
