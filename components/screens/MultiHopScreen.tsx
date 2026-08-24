"use client";

import BackHeader from "../BackHeader";
import HopChain from "../HopChain";
import { servers } from "@/lib/data";
import { computeMultiHopQuality } from "@/lib/utils";
import type { Server } from "@/lib/data";

function ServerPicker({
  title,
  servers: list,
  selectedId,
  excludeId,
  onSelect,
}: {
  title: string;
  servers: Server[];
  selectedId: string;
  excludeId: string;
  onSelect: (id: string) => void;
}) {
  const filtered = list.filter((sv) => sv.id !== excludeId);
  return (
    <div className="mb-5">
      <h2 className="f-bold text-xs text-white/60 tracking-wide mb-2">{title}</h2>
      <div className="bg-white/5 rounded-2xl overflow-hidden">
        {filtered.map((sv, i) => {
          const isSelected = sv.id === selectedId;
          return (
            <button
              key={sv.id}
              onClick={() => onSelect(sv.id)}
              className={`w-full flex items-center py-[13px] px-4 text-left ${i < filtered.length - 1 ? "border-b border-white/8" : ""} ${
                isSelected ? "bg-[rgba(0,15,154,0.25)]" : ""
              }`}
            >
              <div className="flex-1">
                <p className="f-semibold text-sm text-white">{sv.city}</p>
                <p className="f-regular text-xs text-white/50 mt-0.5">
                  {sv.country} · {sv.ping} ms
                </p>
              </div>
              {isSelected && <span className="w-[9px] h-[9px] rounded-full bg-royal-orange" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function MultiHopScreen({
  entryId,
  exitId,
  onSelectEntry,
  onSelectExit,
  onBack,
}: {
  entryId: string;
  exitId: string;
  onSelectEntry: (id: string) => void;
  onSelectExit: (id: string) => void;
  onBack: () => void;
}) {
  const entry = servers.find((s) => s.id === entryId) || servers[0];
  const exit = servers.find((s) => s.id === exitId) || servers[1];
  const quality = computeMultiHopQuality(entry, exit);

  return (
    <div>
      <BackHeader title="Multi-Hop Route" onBack={onBack} />
      <div className="px-5">
        <p className="f-regular text-[13px] text-white/50 leading-[19px] mb-[18px]">
          Route your traffic through two servers so no single point knows both who you are and what you visit.
        </p>

        <div className="bg-white/6 rounded-2xl p-4 mb-3.5">
          <HopChain entry={entry} exit={exit} />
        </div>

        <div className="flex gap-2.5 mb-[22px]">
          <div className="flex-1 bg-white/5 rounded-2xl p-3.5 flex flex-col items-center">
            <span className="f-regular text-[10px] text-white/50 tracking-wide mb-1">COMBINED PING</span>
            <span className="f-bold text-sm text-white">{entry.ping + exit.ping} ms</span>
          </div>
          <div className="flex-1 bg-white/5 rounded-2xl p-3.5 flex flex-col items-center">
            <span className="f-regular text-[10px] text-white/50 tracking-wide mb-1">QUALITY</span>
            <span className="f-bold text-sm" style={{ color: quality.color }}>
              {quality.score}% · {quality.label}
            </span>
          </div>
        </div>

        <ServerPicker title="ENTRY SERVER" servers={servers} selectedId={entryId} excludeId={exitId} onSelect={onSelectEntry} />
        <ServerPicker title="EXIT SERVER" servers={servers} selectedId={exitId} excludeId={entryId} onSelect={onSelectExit} />
      </div>
    </div>
  );
}
