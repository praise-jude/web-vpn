"use client";

import Icon from "./Icon";
import { tabsDef } from "@/lib/data";
import { colors } from "@/lib/theme";

export default function TabBar({ activeTab, onChange }: { activeTab: string; onChange: (key: string) => void }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[78px] pb-3 flex bg-[rgba(3,7,18,0.92)] border-t border-white/8 backdrop-blur-sm">
      {tabsDef.map((t) => {
        const active = activeTab === t.key;
        const color = active ? colors.orange : "rgba(255,255,255,0.45)";
        return (
          <button key={t.key} onClick={() => onChange(t.key)} className="flex-1 flex flex-col items-center justify-center gap-1">
            <Icon name={t.icon} size={19} color={color} />
            <span className="f-semibold text-[10.5px]" style={{ color }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
