"use client";

import Icon from "./Icon";
import { connectionModes } from "@/lib/data";

export default function ModeSwitcher({
  mode,
  onChange,
  disabledKeys = [],
}: {
  mode: string;
  onChange: (key: string) => void;
  disabledKeys?: string[];
}) {
  const active = connectionModes.find((m) => m.key === mode) || connectionModes[1];
  const isActiveDisabled = disabledKeys.includes(active.key);

  return (
    <div className="mb-5">
      <div className="flex bg-white/6 rounded-xl p-1 gap-1">
        {connectionModes.map((m) => {
          const isActive = m.key === mode;
          const isDisabled = disabledKeys.includes(m.key);
          return (
            <button
              key={m.key}
              onClick={() => !isDisabled && onChange(m.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[9px] ${isActive ? "bg-royal-orange" : ""} ${isDisabled ? "opacity-50" : ""}`}
            >
              <Icon name={m.icon} size={12} color={isActive ? "#000" : isDisabled ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.7)"} />
              <span className={`f-semibold text-[11.5px] ${isActive ? "text-black" : isDisabled ? "text-white/45" : "text-white/70"}`}>
                {m.label}
              </span>
              {isDisabled && <span className="f-bold text-[7px] text-white/45 tracking-wide ml-0.5">SOON</span>}
            </button>
          );
        })}
      </div>
      <p className="f-regular text-[11px] text-white/50 text-center mt-2">
        {isActiveDisabled ? "Requires 2+ live server locations — coming soon" : active.tagline}
      </p>

      <div className="flex items-center justify-between bg-white/6 rounded-[10px] py-2 mt-2.5">
        <div className="flex-1 flex flex-col items-center">
          <span className="f-regular text-[8.5px] text-white/45 tracking-wide mb-0.5">PRIVACY</span>
          <span className="f-bold text-[10.5px] text-white">{active.tradeoff.privacy}</span>
        </div>
        <div className="w-px h-5 bg-white/8" />
        <div className="flex-1 flex flex-col items-center">
          <span className="f-regular text-[8.5px] text-white/45 tracking-wide mb-0.5">SPEED</span>
          <span className="f-bold text-[10.5px] text-white">{active.tradeoff.speed}</span>
        </div>
        <div className="w-px h-5 bg-white/8" />
        <div className="flex-1 flex flex-col items-center">
          <span className="f-regular text-[8.5px] text-white/45 tracking-wide mb-0.5">LATENCY</span>
          <span className="f-bold text-[10.5px] text-white">{active.tradeoff.latency}</span>
        </div>
      </div>
    </div>
  );
}
