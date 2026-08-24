"use client";

import Icon from "./Icon";
import type { RankedServer } from "@/lib/utils";

export default function AiRouteBanner({ server, onUse }: { server: RankedServer; onUse: () => void }) {
  return (
    <div className="flex items-center gap-3 bg-[rgba(255,147,0,0.1)] border border-[rgba(255,147,0,0.3)] rounded-[14px] p-3 mb-3.5">
      <div className="w-[34px] h-[34px] rounded-full bg-royal-orange flex items-center justify-center shrink-0">
        <Icon name="wand-magic-sparkles" size={16} color="#000" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="f-bold text-[13.5px] text-white">Royal AI recommends {server.city}</p>
        <p className="f-regular text-[11.5px] text-white/60 mt-0.5">
          {server.quality.score}% connection quality · {server.quality.label}
        </p>
      </div>
      <button onClick={onUse} className="bg-royal-orange rounded-full py-[7px] px-3.5 shrink-0">
        <span className="f-bold text-xs text-black">Use</span>
      </button>
    </div>
  );
}
