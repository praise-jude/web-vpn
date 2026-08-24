import { colors } from "./theme";
import type { Server } from "./data";

export function formatDuration(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(s)}`;
}

export interface QualityScoreResult {
  score: number;
  label: string;
  color: string;
}

export function computeConnectionScore({
  ping,
  packetLoss,
  jitter,
  load,
  latencyPenalty = 0,
}: {
  ping: number;
  packetLoss: number;
  jitter: number;
  load: number;
  latencyPenalty?: number;
}): QualityScoreResult {
  const effectivePing = ping + latencyPenalty;
  const penalty = effectivePing * 0.3 + packetLoss * 18 + jitter * 1.5 + Math.max(0, load - 40) * 0.25;
  const score = Math.max(0, Math.min(100, Math.round(100 - penalty)));

  let label = "Excellent";
  let color: string = colors.green;
  if (score < 60) {
    label = "Poor";
    color = colors.red;
  } else if (score < 80) {
    label = "Fair";
    color = colors.yellow;
  } else if (score < 92) {
    label = "Good";
    color = colors.green;
  }

  return { score, label, color };
}

const MULTI_HOP_OVERHEAD_MS = 15;

export function computeMultiHopQuality(entry: Server, exit: Server) {
  return computeConnectionScore({
    ping: entry.ping + exit.ping,
    packetLoss: entry.packetLoss + exit.packetLoss,
    jitter: Math.max(entry.jitter, exit.jitter),
    load: Math.round((entry.load + exit.load) / 2),
    latencyPenalty: MULTI_HOP_OVERHEAD_MS,
  });
}

export function formatRelativeTime(ts: number) {
  const diff = Math.max(0, Date.now() - ts);
  const sec = Math.floor(diff / 1000);
  if (sec < 5) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  return `${hr}h ago`;
}

export function rankServers(list: Server[], latencyPenalty = 0) {
  return list
    .map((sv) => ({ ...sv, quality: computeConnectionScore({ ...sv, latencyPenalty }) }))
    .sort((a, b) => b.quality.score - a.quality.score);
}

export type RankedServer = Server & { quality: QualityScoreResult };
