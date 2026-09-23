import type { Unit } from "@/lib/curriculum";
import { PulauRantaiMap } from "@/components/pulau-rantai-map";

export function PathMap({ units, focusUnit }: { units: Unit[]; focusUnit?: string | null }) {
  return (
    <div className="w-full">
      <PulauRantaiMap units={units} focusUnit={focusUnit} />
    </div>
  );
}
