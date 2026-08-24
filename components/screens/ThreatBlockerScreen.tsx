import Icon from "../Icon";
import BackHeader from "../BackHeader";
import Toggle from "../Toggle";
import { threatCategories } from "@/lib/data";
import { formatRelativeTime } from "@/lib/utils";
import type { ThreatCategory } from "@/lib/data";

export default function ThreatBlockerScreen({
  on,
  counts,
  total,
  recentBlocks,
  onToggle,
  onBack,
}: {
  on: boolean;
  counts: Record<ThreatCategory["key"], number>;
  total: number;
  recentBlocks: { id: number; domain: string; category: ThreatCategory["key"]; time: number }[];
  onToggle: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <BackHeader title="Threat Blocker" onBack={onBack} />
      <div className="px-5">
        <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3.5 mb-4">
          <div className="flex-1">
            <p className="f-semibold text-sm text-white">Block ads, trackers &amp; malware</p>
            <p className="f-regular text-[11px] text-white/45 mt-0.5">Filters requests before they leave your device</p>
          </div>
          <Toggle value={on} onToggle={onToggle} />
        </div>

        <div className="bg-white/6 rounded-2xl py-[22px] flex flex-col items-center mb-4">
          <span className="f-extrabold text-4xl text-royal-orange">{total.toLocaleString()}</span>
          <span className="f-regular text-xs text-white/60 mt-1">Threats blocked today</span>
        </div>

        <div className="flex flex-wrap gap-2.5 mb-5">
          {threatCategories.map((cat) => (
            <div key={cat.key} className="w-[calc(50%-5px)] bg-white/5 rounded-2xl p-3.5">
              <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center mb-2.5" style={{ backgroundColor: `${cat.color}26` }}>
                <Icon name={cat.icon} size={14} color={cat.color} />
              </div>
              <p className="f-bold text-lg text-white">{counts[cat.key].toLocaleString()}</p>
              <p className="f-regular text-xs text-white/60 mt-0.5">{cat.label}</p>
            </div>
          ))}
        </div>

        <h2 className="f-bold text-[15px] text-white mb-2.5">Recently Blocked</h2>
        <div className="bg-white/5 rounded-2xl overflow-hidden mb-5">
          {recentBlocks.length === 0 ? (
            <p className="f-regular text-[13px] text-white/50 p-4">No activity yet</p>
          ) : (
            recentBlocks.slice(0, 12).map((b, i, arr) => {
              const cat = threatCategories.find((c) => c.key === b.category)!;
              return (
                <div key={b.id} className={`flex items-center gap-2.5 py-3 px-4 ${i < arr.length - 1 ? "border-b border-white/8" : ""}`}>
                  <Icon name={cat.icon} size={13} color={cat.color} className="w-4 shrink-0" />
                  <span className="flex-1 f-medium text-[12.5px] text-white truncate">{b.domain}</span>
                  <span className="f-regular text-[11px] text-white/45 shrink-0">{formatRelativeTime(b.time)}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
