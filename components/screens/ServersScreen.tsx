"use client";

import { useMemo, useState } from "react";
import Icon from "../Icon";
import AiRouteBanner from "../AiRouteBanner";
import { regions } from "@/lib/data";
import { colors } from "@/lib/theme";
import type { Server } from "@/lib/data";
import type { RankedServer } from "@/lib/utils";

function loadColor(load: number) {
  if (load > 55) return colors.red;
  if (load > 35) return colors.yellow;
  return colors.green;
}

type DisplayServer = Server & { quality?: RankedServer["quality"] };

export default function ServersScreen({
  servers,
  serversLoading,
  selectedId,
  favorites,
  onSelect,
  onToggleFav,
  bestServer,
  onUseRecommended,
  isPaid,
  onRequireUpgrade,
}: {
  servers: DisplayServer[];
  serversLoading: boolean;
  selectedId: string | null;
  favorites: Record<string, boolean>;
  onSelect: (id: string) => void;
  onToggleFav: (id: string) => void;
  bestServer: RankedServer | null;
  onUseRecommended: (id: string) => void;
  isPaid: boolean;
  onRequireUpgrade: () => void;
}) {
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [region, setRegion] = useState("all");

  const handleSelect = (sv: DisplayServer) => {
    if (!sv.live) return;
    if (sv.vip && !isPaid) {
      onRequireUpgrade();
      return;
    }
    onSelect(sv.id);
  };

  const handleUseRecommended = () => {
    if (!bestServer) return;
    if (bestServer.vip && !isPaid) {
      onRequireUpgrade();
      return;
    }
    onUseRecommended(bestServer.id);
  };

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    servers.forEach((sv) => {
      counts[sv.region] = (counts[sv.region] || 0) + 1;
    });
    return counts;
  }, [servers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return servers.filter((sv) => {
      if (region !== "all" && sv.region !== region) return false;
      if (favoritesOnly && !favorites[sv.id]) return false;
      if (!q) return true;
      return sv.city.toLowerCase().includes(q) || sv.country.toLowerCase().includes(q);
    });
  }, [servers, query, favoritesOnly, favorites, region]);

  return (
    <div className="px-5">
      <h1 className="f-extrabold text-[25px] text-white mb-1">Servers</h1>
      <p className="f-regular text-[13px] text-white/50 mb-[18px]">Choose the best gateway for you</p>

      <div className="flex items-center gap-2.5 mb-[18px]">
        <div className="flex-1 flex items-center gap-2.5 bg-white/6 rounded-xl py-2.5 px-3.5">
          <Icon name="magnifying-glass" size={13} color="rgba(255,255,255,0.4)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search country or city"
            className="flex-1 f-regular text-sm text-white placeholder:text-white/40 bg-transparent outline-none min-w-0"
          />
          {query.length > 0 && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              <Icon name="circle-xmark" size={14} color="rgba(255,255,255,0.4)" />
            </button>
          )}
        </div>
        <button
          onClick={() => setFavoritesOnly((v) => !v)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${favoritesOnly ? "bg-royal-orange" : "bg-white/6"}`}
        >
          <Icon name="star" variant={favoritesOnly ? "solid" : "regular"} size={14} color={favoritesOnly ? "#000" : "rgba(255,255,255,0.6)"} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 mb-3.5 -mx-5 px-5 [scrollbar-width:none]">
        {regions.map((r) => {
          const isActive = region === r.key;
          const count = r.key === "all" ? servers.length : regionCounts[r.key] || 0;
          return (
            <button
              key={r.key}
              onClick={() => setRegion(r.key)}
              className={`flex items-center gap-1.5 shrink-0 rounded-full py-2 px-3.5 ${isActive ? "bg-royal-orange" : "bg-white/6"}`}
            >
              <Icon name={r.icon} size={12} color={isActive ? "#000" : "rgba(255,255,255,0.7)"} />
              <span className={`f-semibold text-xs whitespace-nowrap ${isActive ? "text-black" : "text-white/70"}`}>
                {r.label} ({count})
              </span>
            </button>
          );
        })}
      </div>

      {bestServer && bestServer.id !== selectedId && !query && !favoritesOnly && region === "all" && (
        <AiRouteBanner server={bestServer} onUse={handleUseRecommended} />
      )}

      {serversLoading && filtered.length === 0 && <p className="f-regular text-[13px] text-white/50 text-center py-6">Loading real server status…</p>}

      {!serversLoading && filtered.length === 0 && (
        <p className="f-regular text-[13px] text-white/50 text-center py-6">
          {favoritesOnly ? "No favorite servers yet — tap the star on a server to save it." : "No servers match this filter."}
        </p>
      )}

      {filtered.map((sv) => {
        const isSelected = sv.id === selectedId;
        const isFav = !!favorites[sv.id];
        const isVipLocked = sv.live && sv.vip && !isPaid;
        const isDimmed = !sv.live || isVipLocked;
        return (
          <button
            key={sv.id}
            onClick={() => handleSelect(sv)}
            className="w-full flex items-center gap-3 py-[13px] px-3 rounded-2xl mb-2 border text-left"
            style={{
              backgroundColor: isSelected ? "rgba(0,15,154,0.25)" : "rgba(255,255,255,0.04)",
              borderColor: isSelected ? colors.blue : "transparent",
              opacity: isDimmed ? 0.6 : 1,
            }}
          >
            <span
              className="w-[9px] h-[9px] rounded-full shrink-0"
              style={{ backgroundColor: sv.live ? loadColor(sv.load ?? 0) : "rgba(255,255,255,0.45)" }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="f-semibold text-[15px] text-white">{sv.city}</span>
                {!sv.live ? (
                  <span className="bg-white/8 px-1.5 py-0.5 rounded-full">
                    <span className="f-bold text-[8px] text-white/60 tracking-wide">COMING SOON</span>
                  </span>
                ) : isVipLocked ? (
                  <span className="flex items-center gap-1 bg-royal-orange px-1.5 py-0.5 rounded-full">
                    <Icon name="crown" size={8} color="#000" />
                    <span className="f-bold text-[9px] text-black tracking-wide">VIP</span>
                  </span>
                ) : (
                  bestServer &&
                  sv.id === bestServer.id && (
                    <span className="bg-royal-orange px-1.5 py-0.5 rounded-full">
                      <span className="f-bold text-[9px] text-black tracking-wide">BEST</span>
                    </span>
                  )
                )}
              </div>
              <p className="f-regular text-xs text-white/50 mt-0.5">
                {sv.country} {sv.live ? `· Load ${sv.load}%` : ""}
              </p>
            </div>
            {!sv.live ? null : isVipLocked ? (
              <Icon name="lock" size={13} color="rgba(255,255,255,0.45)" className="mr-1" />
            ) : (
              <span className="f-regular text-[13px] text-white/60 mr-1">{sv.ping} ms</span>
            )}
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFav(sv.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onToggleFav(sv.id);
                }
              }}
            >
              <Icon name="star" variant={isFav ? "solid" : "regular"} size={15} color={isFav ? colors.orange : "rgba(255,255,255,0.35)"} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
