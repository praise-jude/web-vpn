import Icon from "./Icon";
import type { IconName } from "@/lib/data";

function Node({ icon, label, sublabel, highlight }: { icon: IconName; label: string; sublabel?: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center w-[62px]">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 ${highlight ? "bg-royal-orange" : "bg-white/8"}`}
      >
        <Icon name={icon} size={14} color={highlight ? "#000" : "#fff"} />
      </div>
      <p className="f-semibold text-[11px] text-white text-center truncate w-full">{label}</p>
      {sublabel ? <p className="f-regular text-[9.5px] text-white/50 mt-px">{sublabel}</p> : null}
    </div>
  );
}

export default function HopChain({
  entry,
  exit,
}: {
  entry: { city: string; ping: number | null };
  exit: { city: string; ping: number | null };
}) {
  return (
    <div className="flex items-start justify-between px-1">
      <Node icon="user" label="You" />
      <Icon name="chevron-right" size={11} color="rgba(255,255,255,0.45)" className="mt-3.5" />
      <Node icon="door-open" label={entry.city} sublabel={`${entry.ping ?? "—"} ms`} highlight />
      <Icon name="chevron-right" size={11} color="rgba(255,255,255,0.45)" className="mt-3.5" />
      <Node icon="door-closed" label={exit.city} sublabel={`${exit.ping ?? "—"} ms`} highlight />
      <Icon name="chevron-right" size={11} color="rgba(255,255,255,0.45)" className="mt-3.5" />
      <Node icon="globe" label="Internet" />
    </div>
  );
}
