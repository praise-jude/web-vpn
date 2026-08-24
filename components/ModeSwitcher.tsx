"use client";

import Icon from "./Icon";
import { connectionModes } from "@/lib/data";

export default function ModeSwitcher({ mode, onChange }: { mode: string; onChange: (key: string) => void }) {
  const active = connectionModes.find((m) => m.key === mode) || connectionModes[1];

  return (
    <div className="mb-5">
      <div className="flex bg-white/6 rounded-xl p-1 gap-1">
        {connectionModes.map((m) => {
          const isActive = m.key === mode;
          return (
            <button
              key={m.key}
              onClick={() => onChange(m.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[9px] ${isActive ? "bg-royal-orange" : ""}`}
            >
              <Icon name={m.icon} size={12} color={isActive ? "#000" : "rgba(255,255,255,0.7)"} />
              <span className={`f-semibold text-[11.5px] ${isActive ? "text-black" : "text-white/70"}`}>{m.label}</span>
            </button>
          );
        })}
      </div>
      <p className="f-regular text-[11px] text-white/50 text-center mt-2">{active.tagline}</p>
    </div>
  );
}
