"use client";

import Icon from "./Icon";
import { tabsDef } from "@/lib/data";
import { colors } from "@/lib/theme";

export default function Sidebar({
  activeTab,
  onChange,
  userEmail,
  planLabel,
  connected,
}: {
  activeTab: string;
  onChange: (key: string) => void;
  userEmail: string;
  planLabel: string;
  connected: boolean;
}) {
  return (
    <div className="royal-sidebar w-[240px] shrink-0 flex-col justify-between bg-white/4 border-r border-white/8 py-6 px-4">
      <div>
        <div className="flex items-center gap-2.5 px-2 mb-7">
          <Icon name="shield-halved" size={22} color={colors.orange} />
          <span className="f-extrabold text-base text-white tracking-wide">ROYAL-VPN</span>
        </div>

        <nav className="flex flex-col gap-1">
          {tabsDef.map((t) => {
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => onChange(t.key)}
                className={`flex items-center gap-3 py-[11px] px-3 rounded-xl text-left ${active ? "bg-royal-orange" : ""}`}
              >
                <Icon name={t.icon} size={16} color={active ? "#000" : "rgba(255,255,255,0.7)"} className="w-[18px] shrink-0" />
                <span className={`f-semibold text-sm ${active ? "text-black" : "text-white/70"}`}>{t.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2.5 px-2 pt-4 border-t border-white/8">
        <span className="w-[9px] h-[9px] rounded-full shrink-0" style={{ backgroundColor: connected ? colors.green : colors.red }} />
        <div className="flex-1 min-w-0">
          <p className="f-semibold text-xs text-white truncate">{userEmail}</p>
          <p className="f-regular text-[11px] text-white/50 mt-px">{planLabel}</p>
        </div>
      </div>
    </div>
  );
}
