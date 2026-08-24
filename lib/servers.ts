import { serverRegionMap, type Server } from "./data";

const API_BASE = "https://royal-vpn-api-production.up.railway.app";

interface RawServer {
  id: string;
  city: string;
  country: string;
  flag: string;
  vip: boolean;
  live: boolean;
  status: string;
  pingMs: number | null;
  loadPct: number | null;
}

export async function fetchServers(): Promise<Server[]> {
  const res = await fetch(`${API_BASE}/servers`);
  if (!res.ok) throw new Error("Failed to load servers.");
  const data = await res.json();
  const raw: RawServer[] = data.servers || [];
  return raw.map((sv) => ({
    id: sv.id,
    city: sv.city,
    country: sv.country,
    flag: sv.flag,
    vip: sv.vip,
    live: sv.live,
    status: sv.status,
    region: serverRegionMap[sv.id] || "other",
    ping: sv.pingMs,
    load: sv.loadPct,
    packetLoss: 0,
    jitter: 0,
  }));
}
