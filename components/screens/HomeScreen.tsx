"use client";

import Icon from "../Icon";
import ModeSwitcher from "../ModeSwitcher";
import QualityScore from "../QualityScore";
import { colors } from "@/lib/theme";
import type { IconName } from "@/lib/data";
import type { QualityScoreResult } from "@/lib/utils";

type NetworkType = "WIFI" | "CELLULAR" | "NONE" | "UNKNOWN";

const NETWORK_META: Record<NetworkType, { icon: IconName; label: string }> = {
  WIFI: { icon: "wifi", label: "Wi-Fi" },
  CELLULAR: { icon: "signal", label: "Mobile Data" },
  NONE: { icon: "ban", label: "Offline" },
  UNKNOWN: { icon: "circle-question", label: "Connected" },
};

export default function HomeScreen({
  connected,
  connecting,
  autoReconnecting,
  server,
  durationStr,
  showStats,
  killSwitch,
  autoConnect,
  mode,
  onModeChange,
  disabledModeKeys,
  protocolLabel,
  quality,
  entryServer,
  networkType,
  protectBanner,
  onConnectClick,
  onGoServers,
  onOpenMultiHop,
  onOpenHistory,
  onOpenSpeedTest,
  onToggleKill,
  onToggleAuto,
}: {
  connected: boolean;
  connecting: boolean;
  autoReconnecting: boolean;
  server: { city: string; country: string; ping: number | null };
  durationStr: string;
  showStats: boolean;
  killSwitch: boolean;
  autoConnect: boolean;
  mode: string;
  onModeChange: (key: string) => void;
  disabledModeKeys: string[];
  protocolLabel: string;
  quality: QualityScoreResult;
  entryServer: { city: string; ping: number | null } | null;
  networkType: NetworkType;
  protectBanner: string;
  onConnectClick: () => void;
  onGoServers: () => void;
  onOpenMultiHop: () => void;
  onOpenHistory: () => void;
  onOpenSpeedTest: () => void;
  onToggleKill: () => void;
  onToggleAuto: () => void;
}) {
  const isMultiHop = mode === "privacy" && !!entryServer;
  const connectBtnBg = connecting ? "#4B5563" : connected ? colors.blue : colors.orange;
  const connectLabel = connecting ? "Connecting…" : connected ? "PROTECTED" : "CONNECT";
  const statusLine = autoReconnecting
    ? "Network changed — reconnecting…"
    : connecting
    ? "Securing your connection…"
    : connected
    ? "Your connection is protected"
    : "You are not protected";
  const statusDotColor = autoReconnecting ? colors.yellow : connected ? colors.green : connecting ? colors.yellow : colors.red;
  const netMeta = NETWORK_META[networkType] || NETWORK_META.UNKNOWN;

  return (
    <div className="px-5">
      <div className="royal-home-header flex items-center justify-between mb-5">
        <div className="royal-home-brand flex items-center gap-2.5">
          <Icon name="shield-halved" size={20} color={colors.orange} />
          <h1 className="f-extrabold text-[19px] tracking-wide text-white">ROYAL-VPN</h1>
        </div>
        <div className="flex items-center gap-1.5 bg-white/6 rounded-full py-1.5 px-2.5">
          <Icon name={netMeta.icon} size={11} color="rgba(255,255,255,0.6)" />
          <span className="f-medium text-[11px] text-white/60">{netMeta.label}</span>
        </div>
      </div>

      {protectBanner ? (
        <div className="flex items-center gap-2.5 bg-[rgba(255,147,0,0.12)] border border-[rgba(255,147,0,0.3)] rounded-xl p-3 mb-3.5">
          <Icon name="shield-halved" size={14} color={colors.orange} />
          <p className="flex-1 f-medium text-xs text-white">{protectBanner}</p>
        </div>
      ) : null}

      <div className="flex flex-col items-center my-2 mb-[30px]">
        <button
          onClick={onConnectClick}
          className="w-[196px] h-[196px] rounded-full flex flex-col items-center justify-center gap-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.55)] transition-colors"
          style={{ backgroundColor: connectBtnBg }}
        >
          <Icon name="power-off" size={38} color="#fff" />
          <span className="f-bold text-sm text-white tracking-widest mt-2.5">{connectLabel}</span>
        </button>
        <div className="flex items-center gap-2 mt-[18px]">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusDotColor }} />
          <span className="f-regular text-[13px] text-white/70">{statusLine}</span>
        </div>
      </div>

      {isMultiHop && entryServer ? (
        <button onClick={onOpenMultiHop} className="w-full flex items-center gap-3 bg-white/6 rounded-2xl p-4 mb-3.5 text-left">
          <Icon name="route" size={19} color={colors.orange} className="w-[22px] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="f-semibold text-[15px] text-white">
              {entryServer.city} → {server.city}
            </p>
            <p className="f-regular text-xs text-white/50 mt-0.5">Multi-hop route · Tap to configure</p>
          </div>
          <Icon name="chevron-right" size={13} color="rgba(255,255,255,0.35)" />
        </button>
      ) : (
        <button onClick={onGoServers} className="w-full flex items-center gap-3 bg-white/6 rounded-2xl p-4 mb-3.5 text-left">
          <Icon name="globe" size={19} color={colors.orange} className="w-[22px] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="f-semibold text-[15px] text-white">
              {server.city}, {server.country}
            </p>
            <p className="f-regular text-xs text-white/50 mt-0.5">Tap to change server</p>
          </div>
          <Icon name="chevron-right" size={13} color="rgba(255,255,255,0.35)" />
        </button>
      )}

      {showStats && (
        <button onClick={onOpenHistory} className="w-full text-left">
          <QualityScore score={quality.score} label={quality.label} color={quality.color} />
        </button>
      )}

      {showStats && (
        <div className="flex gap-2.5 mb-3.5">
          <div className="flex-1 bg-white/6 rounded-2xl py-3.5 px-1.5 flex flex-col items-center justify-center">
            <span className="f-regular text-[10px] text-white/50 tracking-wide mb-1">DURATION</span>
            <span className="f-bold text-sm text-white">{durationStr}</span>
          </div>
          <div className="flex-1 bg-white/6 rounded-2xl py-3.5 px-1.5 flex flex-col items-center justify-center">
            <span className="f-regular text-[10px] text-white/50 tracking-wide mb-1">PING</span>
            <span className="f-bold text-sm text-white">
              {isMultiHop && entryServer ? (entryServer.ping ?? 0) + (server.ping ?? 0) : (server.ping ?? "—")} ms
            </span>
          </div>
          <div className="flex-1 bg-white/6 rounded-2xl py-3.5 px-1.5 flex flex-col items-center justify-center">
            <span className="f-regular text-[10px] text-white/50 tracking-wide mb-1">PROTOCOL</span>
            <span className="f-bold text-[10.5px] text-white text-center">{protocolLabel}</span>
          </div>
        </div>
      )}

      <ModeSwitcher mode={mode} onChange={onModeChange} disabledKeys={disabledModeKeys} />

      <button onClick={onOpenSpeedTest} className="w-full flex items-center gap-2.5 bg-white/6 rounded-xl py-3 px-3.5 mb-3.5 text-left">
        <Icon name="gauge-high" size={14} color={colors.orange} />
        <span className="flex-1 f-semibold text-[13px] text-white">Run Speed Test</span>
        <Icon name="chevron-right" size={12} color="rgba(255,255,255,0.3)" />
      </button>

      <div className="flex gap-2.5 pb-6">
        <button onClick={onToggleKill} className="flex-1 flex items-center gap-2 bg-white/6 rounded-xl py-2.5 px-3">
          <Icon name="power-off" size={12} color={colors.orange} />
          <span className="f-semibold text-xs text-white">Kill Switch{killSwitch ? " · On" : ""}</span>
        </button>
        <button onClick={onToggleAuto} className="flex-1 flex items-center gap-2 bg-white/6 rounded-xl py-2.5 px-3">
          <Icon name="wifi" size={12} color={colors.orange} />
          <span className="f-semibold text-xs text-white">Auto-Connect{autoConnect ? " · On" : ""}</span>
        </button>
      </div>
    </div>
  );
}
