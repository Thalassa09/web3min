import type { Unit } from "@/lib/curriculum";
import { PulauRantaiMap } from "@/components/pulau-rantai-map";

export function PathMap({ units, focusUnit }: { units: Unit[]; focusUnit?: string | null }) {
  return (
    <div className="flex flex-col overflow-x-clip pb-8">
      <PulauRantaiMap units={units} focusUnit={focusUnit} />
    </div>
  );
}
