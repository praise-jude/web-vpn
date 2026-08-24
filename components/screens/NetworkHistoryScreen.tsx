import Icon from "../Icon";
import BackHeader from "../BackHeader";
import Sparkline from "../Sparkline";
import { formatRelativeTime } from "@/lib/utils";
import type { QualityScoreResult } from "@/lib/utils";
import type { IconName } from "@/lib/data";

interface NetworkEvent {
  id: number;
  type: string;
  label: string;
  time: number;
  icon: IconName;
  color: string;
}

export default function NetworkHistoryScreen({
  quality,
  history,
  events,
  onBack,
}: {
  quality: QualityScoreResult;
  history: { t: number; score: number }[];
  events: NetworkEvent[];
  onBack: () => void;
}) {
  return (
    <div>
      <BackHeader title="Network Activity" onBack={onBack} />
      <div className="px-5">
        <div className="bg-white/6 rounded-2xl p-4 mb-5">
          <p className="f-regular text-xs text-white/50 mb-1">Current quality</p>
          <p className="f-extrabold text-xl" style={{ color: quality.color }}>
            {quality.score}% · {quality.label}
          </p>
        </div>

        <h2 className="f-bold text-[11px] text-white/50 tracking-wide mb-2">LAST {history.length} SAMPLES</h2>
        <div className="bg-white/5 rounded-2xl p-4 mb-5">
          <Sparkline samples={history} />
        </div>

        <h2 className="f-bold text-[11px] text-white/50 tracking-wide mb-2">NETWORK EVENTS</h2>
        <div className="bg-white/5 rounded-2xl overflow-hidden mb-5">
          {events.length === 0 ? (
            <p className="f-regular text-[13px] text-white/50 p-4">No events yet</p>
          ) : (
            events.slice(0, 30).map((e, i, arr) => (
              <div key={e.id} className={`flex items-start gap-2.5 py-3 px-4 ${i < arr.length - 1 ? "border-b border-white/8" : ""}`}>
                <Icon name={e.icon} size={14} color={e.color} className="w-4 shrink-0 mt-0.5" />
                <p className="flex-1 f-medium text-[12.5px] text-white leading-[17px] line-clamp-2">{e.label}</p>
                <span className="f-regular text-[11px] text-white/45 mt-px shrink-0">{formatRelativeTime(e.time)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
