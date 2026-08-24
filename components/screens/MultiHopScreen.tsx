"use client";

import Icon from "../Icon";
import BackHeader from "../BackHeader";
import HopChain from "../HopChain";
import { connectionModes } from "@/lib/data";
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
  selectedId: string | null;
  excludeId: string | null;
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
  servers,
  entryId,
  exitId,
  onSelectEntry,
  onSelectExit,
  onBack,
}: {
  servers: Server[];
  entryId: string | null;
  exitId: string | null;
  onSelectEntry: (id: string) => void;
  onSelectExit: (id: string) => void;
  onBack: () => void;
}) {
  const tradeoff = connectionModes.find((m) => m.key === "privacy")!.tradeoff;

  if (servers.length < 2) {
    return (
      <div>
        <BackHeader title="Multi-Hop Route" onBack={onBack} />
        <div className="px-5">
          <div className="flex flex-col items-center gap-3 py-[60px]">
            <Icon name="route" size={28} color="rgba(255,255,255,0.45)" />
            <p className="f-bold text-base text-white">Multi-Hop is coming soon</p>
            <p className="f-regular text-[13px] text-white/50 text-center leading-[19px] px-3">
              Routing through two servers needs at least two live locations. Only {servers.length} is live right now — more real
              servers are on the way.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const entry = servers.find((s) => s.id === entryId) || servers[0];
  const exit = servers.find((s) => s.id === exitId && s.id !== entry.id) || servers.find((s) => s.id !== entry.id)!;
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

        <div className="flex gap-2.5 mb-3.5">
          <div className="flex-1 bg-white/5 rounded-2xl p-3.5 flex flex-col items-center">
            <span className="f-regular text-[10px] text-white/50 tracking-wide mb-1">COMBINED PING</span>
            <span className="f-bold text-sm text-white">{(entry.ping ?? 0) + (exit.ping ?? 0)} ms</span>
          </div>
          <div className="flex-1 bg-white/5 rounded-2xl p-3.5 flex flex-col items-center">
            <span className="f-regular text-[10px] text-white/50 tracking-wide mb-1">QUALITY</span>
            <span className="f-bold text-sm" style={{ color: quality.color }}>
              {quality.score}% · {quality.label}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white/6 rounded-[10px] py-2.5 mb-[22px]">
          <div className="flex-1 flex flex-col items-center">
            <span className="f-regular text-[8.5px] text-white/45 tracking-wide mb-0.5">PRIVACY</span>
            <span className="f-bold text-[10.5px] text-white">{tradeoff.privacy}</span>
          </div>
          <div className="w-px h-5 bg-white/8" />
          <div className="flex-1 flex flex-col items-center">
            <span className="f-regular text-[8.5px] text-white/45 tracking-wide mb-0.5">SPEED</span>
            <span className="f-bold text-[10.5px] text-white">{tradeoff.speed}</span>
          </div>
          <div className="w-px h-5 bg-white/8" />
          <div className="flex-1 flex flex-col items-center">
            <span className="f-regular text-[8.5px] text-white/45 tracking-wide mb-0.5">LATENCY</span>
            <span className="f-bold text-[10.5px] text-white">{tradeoff.latency}</span>
          </div>
        </div>

        <ServerPicker title="ENTRY SERVER" servers={servers} selectedId={entryId} excludeId={exitId} onSelect={onSelectEntry} />
        <ServerPicker title="EXIT SERVER" servers={servers} selectedId={exitId} excludeId={entryId} onSelect={onSelectExit} />
      </div>
    </div>
  );
}
