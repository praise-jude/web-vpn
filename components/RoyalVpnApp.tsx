"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TabBar from "./TabBar";
import HomeScreen from "./screens/HomeScreen";
import ServersScreen from "./screens/ServersScreen";
import SecurityScreen from "./screens/SecurityScreen";
import DevicesScreen from "./screens/DevicesScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SplitTunnelScreen from "./screens/SplitTunnelScreen";
import ThreatBlockerScreen from "./screens/ThreatBlockerScreen";
import MultiHopScreen from "./screens/MultiHopScreen";
import AppLockScreen from "./screens/AppLockScreen";
import SpeedTestScreen from "./screens/SpeedTestScreen";
import NetworkHistoryScreen from "./screens/NetworkHistoryScreen";
import TrustedNetworksScreen from "./screens/TrustedNetworksScreen";
import PlansScreen from "./screens/PlansScreen";
import NotificationsScreen, { type AppNotification } from "./screens/NotificationsScreen";
import TrustedServicesScreen, { type TrustedServiceAuditEntry } from "./screens/TrustedServicesScreen";
import TradingConnectionTestScreen from "./screens/TradingConnectionTestScreen";
import {
  servers as initialServers,
  devices as initialDevices,
  connectionModes,
  initialThreatCounts,
  threatDomainPool,
  initialTrustedNetworks,
  initialTrustedServices,
  subscriptionPlans,
} from "@/lib/data";
import type { ThreatCategory, IconName, TrustedService } from "@/lib/data";
import { colors } from "@/lib/theme";
import { formatDuration, computeConnectionScore, computeMultiHopQuality, rankServers } from "@/lib/utils";
import { useNetworkState } from "@/lib/useNetworkState";
import { isBiometricSupported, verifyBiometric, hasStoredCredential, registerBiometricCredential } from "@/lib/webauthn";

const THREAT_CATEGORY_WEIGHTS: [ThreatCategory["key"], number][] = [
  ["ads", 5],
  ["trackers", 3],
  ["malware", 1],
  ["phishing", 1],
];

function pickWeightedCategory(): ThreatCategory["key"] {
  const total = THREAT_CATEGORY_WEIGHTS.reduce((sum, [, w]) => sum + w, 0);
  let r = Math.random() * total;
  for (const [key, w] of THREAT_CATEGORY_WEIGHTS) {
    if (r < w) return key;
    r -= w;
  }
  return THREAT_CATEGORY_WEIGHTS[0][0];
}

let blockIdCounter = 0;
let eventIdCounter = 0;
let trustedNetworkIdCounter = 100;
let trustedAuditIdCounter = 0;

const STATIC_NOTIFICATIONS: AppNotification[] = [
  {
    id: "static-welcome",
    icon: "crown",
    color: colors.orange,
    title: "Welcome to Royal-VPN Pro",
    subtitle: "All server locations and unlimited data are unlocked.",
    time: Date.now() - 1000 * 60 * 60 * 20,
    read: true,
  },
  {
    id: "static-multihop",
    icon: "route",
    color: colors.blue,
    title: "New: Multi-Hop routing",
    subtitle: "Switch to Max Privacy mode to route through two servers.",
    time: Date.now() - 1000 * 60 * 60 * 5,
    read: true,
  },
];

const APP_LOCK_STORAGE_KEY = "royal-vpn:app-lock-enabled";
const TRUSTED_SERVICES_KEY = "royal-vpn:trusted-services";
const TRUSTED_RECONNECT_POLICY_KEY = "royal-vpn:trusted-reconnect-policy";
const TRUSTED_AUDIT_LOG_KEY = "royal-vpn:trusted-audit-log";

const EVENT_META: Record<string, { icon: IconName; color: string }> = {
  connect: { icon: "power-off", color: colors.green },
  disconnect: { icon: "power-off", color: colors.red },
  reconnect: { icon: "arrows-rotate", color: colors.yellow },
  "server-switch": { icon: "server", color: colors.blue },
  "wifi-detected": { icon: "wifi", color: colors.orange },
  "network-change": { icon: "signal", color: "rgba(255,255,255,0.6)" },
  "speed-test": { icon: "gauge-high", color: colors.orange },
};

const NETWORK_LABELS: Record<string, string> = {
  WIFI: "This Wi-Fi Network",
  CELLULAR: "Mobile Data",
};

type SubScreen =
  | null
  | "split-tunnel"
  | "threat-blocker"
  | "multi-hop"
  | "speed-test"
  | "network-history"
  | "trusted-networks"
  | "plans"
  | "notifications"
  | "trusted-services"
  | "trading-connection-test";

interface NetworkEvent {
  id: number;
  type: string;
  label: string;
  time: number;
  icon: IconName;
  color: string;
}

export default function RoyalVpnApp() {
  const [tab, setTab] = useState("home");
  const [connected, setConnected] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [seconds, setSeconds] = useState(2538);
  const [serverId, setServerId] = useState("lagos");
  const [entryServerId, setEntryServerId] = useState("frankfurt");
  const [killSwitch, setKillSwitch] = useState(true);
  const [autoConnect, setAutoConnect] = useState(true);
  const [twoFA, setTwoFA] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({ london: true });
  const [signedOutIds, setSignedOutIds] = useState<Record<number, boolean>>({});
  const [mode, setMode] = useState("balanced");
  const [vpnApps, setVpnApps] = useState<Record<string, boolean>>({});
  const [subScreen, setSubScreen] = useState<SubScreen>(null);
  const [threatBlockerOn, setThreatBlockerOn] = useState(true);
  const [threatCounts, setThreatCounts] = useState(initialThreatCounts);
  const [recentBlocks, setRecentBlocks] = useState<{ id: number; domain: string; category: ThreatCategory["key"]; time: number }[]>([]);
  const [appLockEnabled, setAppLockEnabled] = useState(false);
  const [appLockSupported, setAppLockSupported] = useState(false);
  const [unlocked, setUnlocked] = useState(true);
  const [lockError, setLockError] = useState("");
  const documentVisible = useRef(true);
  const [networkEvents, setNetworkEvents] = useState<NetworkEvent[]>([]);
  const [qualityHistory, setQualityHistory] = useState<{ t: number; score: number }[]>([]);
  const [autoReconnecting, setAutoReconnecting] = useState(false);
  const [protectBanner, setProtectBanner] = useState("");
  const [trustedNetworks, setTrustedNetworks] = useState(initialTrustedNetworks);
  const [trustedServices, setTrustedServices] = useState<TrustedService[]>(initialTrustedServices);
  const [allowTrustedDuringReconnect, setAllowTrustedDuringReconnect] = useState(false);
  const [trustedAuditLog, setTrustedAuditLog] = useState<TrustedServiceAuditEntry[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState("pro");
  const [readNotificationIds, setReadNotificationIds] = useState<Record<string, boolean>>({});
  const { type: networkType } = useNetworkState();
  const prevNetworkTypeRef = useRef<string | null>(null);
  const qualityRef = useRef<{ score: number } | null>(null);
  const connectedRef = useRef(connected);
  const autoConnectRef = useRef(autoConnect);
  const connectingRef = useRef(connecting);

  const logEvent = useCallback((type: string, label: string) => {
    eventIdCounter += 1;
    const meta = EVENT_META[type] || { icon: "circle-question" as IconName, color: "rgba(255,255,255,0.6)" };
    setNetworkEvents((list) =>
      [{ id: eventIdCounter, type, label, time: Date.now(), icon: meta.icon, color: meta.color }, ...list].slice(0, 40)
    );
  }, []);

  useEffect(() => {
    (async () => {
      const supported = await isBiometricSupported();
      setAppLockSupported(supported);

      const stored = localStorage.getItem(APP_LOCK_STORAGE_KEY);
      const enabled = stored === "true" && supported && hasStoredCredential();
      setAppLockEnabled(enabled);
      if (enabled) setUnlocked(false);
    })();
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      if (documentVisible.current && document.hidden && appLockEnabled) {
        setUnlocked(false);
      }
      documentVisible.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [appLockEnabled]);

  const handleToggleAppLock = useCallback(async () => {
    if (appLockEnabled) {
      setAppLockEnabled(false);
      localStorage.setItem(APP_LOCK_STORAGE_KEY, "false");
      return;
    }
    try {
      if (!hasStoredCredential()) await registerBiometricCredential();
      setAppLockEnabled(true);
      localStorage.setItem(APP_LOCK_STORAGE_KEY, "true");
    } catch {
      // user cancelled or platform authenticator unavailable — leave app lock off
    }
  }, [appLockEnabled]);

  const handleUnlock = useCallback(async () => {
    setLockError("");
    try {
      const success = await verifyBiometric();
      if (success) setUnlocked(true);
    } catch {
      setLockError("Authentication failed. Try again.");
    }
  }, []);

  useEffect(() => {
    try {
      const storedServices = localStorage.getItem(TRUSTED_SERVICES_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage once on mount, same pattern as the App Lock effect above
      if (storedServices) setTrustedServices(JSON.parse(storedServices));
      const storedPolicy = localStorage.getItem(TRUSTED_RECONNECT_POLICY_KEY);
      if (storedPolicy) setAllowTrustedDuringReconnect(storedPolicy === "true");
      const storedAudit = localStorage.getItem(TRUSTED_AUDIT_LOG_KEY);
      if (storedAudit) {
        const parsed: TrustedServiceAuditEntry[] = JSON.parse(storedAudit);
        setTrustedAuditLog(parsed);
        trustedAuditIdCounter = parsed.reduce((max, e) => Math.max(max, Number(e.id.split("-")[1]) || 0), 0);
      }
    } catch {
      // corrupt or unavailable storage — keep defaults
    }
  }, []);

  const logTrustedAudit = useCallback((label: string) => {
    trustedAuditIdCounter += 1;
    const entry: TrustedServiceAuditEntry = { id: `audit-${trustedAuditIdCounter}`, label, time: Date.now() };
    setTrustedAuditLog((list) => {
      const next = [entry, ...list].slice(0, 50);
      localStorage.setItem(TRUSTED_AUDIT_LOG_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const handleToggleTrustedService = useCallback(
    (id: string) => {
      const target = trustedServices.find((s) => s.id === id);
      if (!target) return;
      const next = trustedServices.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
      setTrustedServices(next);
      localStorage.setItem(TRUSTED_SERVICES_KEY, JSON.stringify(next));
      logTrustedAudit(`${target.name} ${!target.enabled ? "enabled" : "disabled"}`);
    },
    [trustedServices, logTrustedAudit]
  );

  const handleRemoveTrustedService = useCallback(
    (id: string) => {
      const target = trustedServices.find((s) => s.id === id);
      const next = trustedServices.filter((s) => s.id !== id);
      setTrustedServices(next);
      localStorage.setItem(TRUSTED_SERVICES_KEY, JSON.stringify(next));
      if (target) logTrustedAudit(`${target.name} removed from Trusted Trading`);
    },
    [trustedServices, logTrustedAudit]
  );

  const handleAddTrustedService = useCallback(
    (name: string, domain: string, includeSubdomains: boolean) => {
      const next = [...trustedServices, { id: `custom-${Date.now()}`, name, domain, includeSubdomains, enabled: true, builtIn: false }];
      setTrustedServices(next);
      localStorage.setItem(TRUSTED_SERVICES_KEY, JSON.stringify(next));
      logTrustedAudit(`${name} added to Trusted Trading`);
    },
    [trustedServices, logTrustedAudit]
  );

  const handleToggleReconnectPolicy = useCallback(() => {
    const next = !allowTrustedDuringReconnect;
    setAllowTrustedDuringReconnect(next);
    localStorage.setItem(TRUSTED_RECONNECT_POLICY_KEY, String(next));
    logTrustedAudit(`Allow trusted services during VPN reconnect ${next ? "enabled" : "disabled"}`);
  }, [allowTrustedDuringReconnect, logTrustedAudit]);

  useEffect(() => {
    const id = setInterval(() => {
      if (connected) setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [connected]);

  useEffect(() => {
    if (!connected || !threatBlockerOn) return;
    const id = setInterval(() => {
      const category = pickWeightedCategory();
      const pool = threatDomainPool[category];
      const domain = pool[Math.floor(Math.random() * pool.length)];
      blockIdCounter += 1;
      setThreatCounts((c) => ({ ...c, [category]: c[category] + 1 }));
      setRecentBlocks((list) => [{ id: blockIdCounter, domain, category, time: Date.now() }, ...list].slice(0, 20));
    }, 4000);
    return () => clearInterval(id);
  }, [connected, threatBlockerOn]);

  const threatsBlockedToday = useMemo(() => Object.values(threatCounts).reduce((sum, n) => sum + n, 0), [threatCounts]);

  const handleConnectPress = useCallback(() => {
    if (connecting) return;
    if (connected) {
      setConnected(false);
      setSeconds(0);
      logEvent("disconnect", "Manually disconnected");
    } else {
      setConnecting(true);
      setTimeout(() => {
        setConnecting(false);
        setConnected(true);
        logEvent("connect", "Connected");
      }, 1400);
    }
  }, [connected, connecting, logEvent]);

  const handleSelectServer = useCallback(
    (id: string) => {
      const target = initialServers.find((s) => s.id === id);
      setServerId(id);
      setEntryServerId((prevEntry) => {
        if (prevEntry !== id) return prevEntry;
        const fallback = initialServers.find((s) => s.id !== id);
        return fallback ? fallback.id : prevEntry;
      });
      if (target) logEvent("server-switch", `Switched exit server to ${target.city}`);
    },
    [logEvent]
  );

  const handleSelectEntryServer = useCallback((id: string) => {
    setEntryServerId(id);
    setServerId((prevExit) => {
      if (prevExit !== id) return prevExit;
      const fallback = initialServers.find((s) => s.id !== id);
      return fallback ? fallback.id : prevExit;
    });
  }, []);

  const server = useMemo(() => initialServers.find((s) => s.id === serverId) || initialServers[0], [serverId]);
  const entryServer = useMemo(() => initialServers.find((s) => s.id === entryServerId) || initialServers[1], [entryServerId]);

  const devices = useMemo(() => initialDevices.filter((d) => !signedOutIds[d.id]), [signedOutIds]);

  const activeMode = connectionModes.find((m) => m.key === mode) || connectionModes[1];

  const quality = useMemo(() => {
    if (mode === "privacy") return computeMultiHopQuality(entryServer, server);
    return computeConnectionScore({
      ping: server.ping,
      packetLoss: server.packetLoss,
      jitter: server.jitter,
      load: server.load,
      latencyPenalty: activeMode.latencyPenalty,
    });
  }, [server, entryServer, mode, activeMode]);

  const rankedServers = useMemo(() => rankServers(initialServers, activeMode.latencyPenalty), [activeMode]);
  const bestServer = rankedServers[0];

  const notifications = useMemo<AppNotification[]>(() => {
    const fromEvents: AppNotification[] = networkEvents.map((e) => ({
      id: `event-${e.id}`,
      icon: e.icon,
      color: e.color,
      title: e.label,
      subtitle: null,
      time: e.time,
      read: false,
    }));
    const fromBlocks: AppNotification[] = recentBlocks.slice(0, 10).map((b) => ({
      id: `block-${b.id}`,
      icon: "bug-slash",
      color: colors.red,
      title: `Blocked ${b.domain}`,
      subtitle: `${b.category.charAt(0).toUpperCase()}${b.category.slice(1)} threat`,
      time: b.time,
      read: false,
    }));
    const merged = [...fromEvents, ...fromBlocks, ...STATIC_NOTIFICATIONS].sort((a, b) => b.time - a.time);
    return merged.slice(0, 40).map((n) => ({ ...n, read: n.read || !!readNotificationIds[n.id] }));
  }, [networkEvents, recentBlocks, readNotificationIds]);

  const unreadNotifCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const subscriptionPlanLabel = useMemo(() => {
    const plan = subscriptionPlans.find((p) => p.id === currentPlanId);
    return plan ? `${plan.name.toUpperCase()} PLAN` : "PRO PLAN";
  }, [currentPlanId]);

  const handleAddTrustedNetwork = useCallback(() => {
    trustedNetworkIdCounter += 1;
    const label = NETWORK_LABELS[networkType] || "Current Network";
    setTrustedNetworks((list) => [...list, { id: trustedNetworkIdCounter, name: label }]);
  }, [networkType]);

  const handleRemoveTrustedNetwork = useCallback((id: number) => {
    setTrustedNetworks((list) => list.filter((n) => n.id !== id));
  }, []);

  const handleMarkNotifRead = useCallback((id: string) => {
    setReadNotificationIds((r) => ({ ...r, [id]: true }));
  }, []);

  const handleMarkAllNotifRead = useCallback(() => {
    setReadNotificationIds(() => {
      const all: Record<string, boolean> = {};
      notifications.forEach((n) => {
        all[n.id] = true;
      });
      return all;
    });
  }, [notifications]);

  useEffect(() => {
    qualityRef.current = quality;
  }, [quality]);
  useEffect(() => {
    connectedRef.current = connected;
  }, [connected]);
  useEffect(() => {
    autoConnectRef.current = autoConnect;
  }, [autoConnect]);
  useEffect(() => {
    connectingRef.current = connecting;
  }, [connecting]);

  useEffect(() => {
    const type = networkType;
    if (!type) return;
    const prev = prevNetworkTypeRef.current;
    if (prev !== null && prev !== type) {
      if (type === "WIFI") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- reacting to a network change signalled by the browser, not deriving render state
        logEvent("wifi-detected", "Joined a new Wi-Fi network — not verified as trusted");
        setProtectBanner("Unverified Wi-Fi detected");
        if (autoConnectRef.current && !connectedRef.current && !connectingRef.current) {
          setConnecting(true);
          setTimeout(() => {
            setConnecting(false);
            setConnected(true);
            logEvent("wifi-detected", "Auto-Connect engaged on unverified Wi-Fi");
          }, 1000);
        }
        setTimeout(() => setProtectBanner(""), 6000);
      } else if (type === "CELLULAR" && prev === "WIFI") {
        logEvent("network-change", "Switched from Wi-Fi to mobile data");
      }
    }
    prevNetworkTypeRef.current = type;
  }, [networkType, logEvent]);

  useEffect(() => {
    const id = setInterval(() => {
      if (connectedRef.current && qualityRef.current) {
        setQualityHistory((h) => [...h, { t: Date.now(), score: qualityRef.current!.score }].slice(-40));
      }
    }, 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (connectedRef.current && !connectingRef.current && !autoReconnecting && Math.random() < 0.06) {
        setAutoReconnecting(true);
        setTimeout(() => {
          setAutoReconnecting(false);
          logEvent(
            "reconnect",
            killSwitch
              ? "Auto-reconnected after a network blip — Kill Switch blocked traffic during the gap"
              : "Auto-reconnected after a brief network interruption"
          );
        }, 1700);
      }
    }, 5000);
    return () => clearInterval(id);
  }, [autoReconnecting, killSwitch, logEvent]);

  if (appLockEnabled && appLockSupported && !unlocked) {
    return <AppLockScreen onUnlock={handleUnlock} error={lockError} />;
  }

  return (
    <div className="relative h-full overflow-hidden">
      <div className="h-full overflow-y-auto pt-2 pb-[100px]">
        {subScreen === "split-tunnel" ? (
          <SplitTunnelScreen
            vpnApps={vpnApps}
            onToggleApp={(id) => setVpnApps((v) => ({ ...v, [id]: v[id] === false ? true : false }))}
            onBack={() => setSubScreen(null)}
          />
        ) : subScreen === "threat-blocker" ? (
          <ThreatBlockerScreen
            on={threatBlockerOn}
            counts={threatCounts}
            total={threatsBlockedToday}
            recentBlocks={recentBlocks}
            onToggle={() => setThreatBlockerOn((v) => !v)}
            onBack={() => setSubScreen(null)}
          />
        ) : subScreen === "multi-hop" ? (
          <MultiHopScreen
            entryId={entryServerId}
            exitId={serverId}
            onSelectEntry={handleSelectEntryServer}
            onSelectExit={handleSelectServer}
            onBack={() => setSubScreen(null)}
          />
        ) : subScreen === "speed-test" ? (
          <SpeedTestScreen
            key={server.id}
            server={server}
            onBack={() => setSubScreen(null)}
            onComplete={(results) => logEvent("speed-test", `Speed test: ${results.download} Mbps down / ${results.upload} Mbps up`)}
          />
        ) : subScreen === "network-history" ? (
          <NetworkHistoryScreen quality={quality} history={qualityHistory} events={networkEvents} onBack={() => setSubScreen(null)} />
        ) : subScreen === "trusted-networks" ? (
          <TrustedNetworksScreen
            networks={trustedNetworks}
            onAdd={handleAddTrustedNetwork}
            onRemove={handleRemoveTrustedNetwork}
            onBack={() => setSubScreen(null)}
          />
        ) : subScreen === "trusted-services" ? (
          <TrustedServicesScreen
            services={trustedServices}
            allowDuringReconnect={allowTrustedDuringReconnect}
            auditLog={trustedAuditLog}
            onBack={() => setSubScreen(null)}
            onToggleService={handleToggleTrustedService}
            onRemoveService={handleRemoveTrustedService}
            onAddService={handleAddTrustedService}
            onToggleReconnectPolicy={handleToggleReconnectPolicy}
            onOpenTest={() => setSubScreen("trading-connection-test")}
          />
        ) : subScreen === "trading-connection-test" ? (
          <TradingConnectionTestScreen
            services={trustedServices}
            vpnServerLabel={`${server.city}, ${server.country}`}
            protocolLabel={activeMode.protocolLabel}
            onBack={() => setSubScreen("trusted-services")}
          />
        ) : subScreen === "plans" ? (
          <PlansScreen
            currentPlanId={currentPlanId}
            onSelectPlan={(id) => {
              setCurrentPlanId(id);
              setSubScreen(null);
            }}
            onBack={() => setSubScreen(null)}
          />
        ) : subScreen === "notifications" ? (
          <NotificationsScreen
            notifications={notifications}
            onMarkRead={handleMarkNotifRead}
            onMarkAllRead={handleMarkAllNotifRead}
            onBack={() => setSubScreen(null)}
          />
        ) : (
          <>
            {tab === "home" && (
              <HomeScreen
                connected={connected}
                connecting={connecting}
                autoReconnecting={autoReconnecting}
                server={server}
                durationStr={formatDuration(seconds)}
                showStats={connected}
                killSwitch={killSwitch}
                autoConnect={autoConnect}
                mode={mode}
                onModeChange={setMode}
                protocolLabel={activeMode.protocolLabel}
                quality={quality}
                entryServer={mode === "privacy" ? entryServer : null}
                networkType={networkType}
                protectBanner={protectBanner}
                onConnectClick={handleConnectPress}
                onGoServers={() => setTab("servers")}
                onOpenMultiHop={() => setSubScreen("multi-hop")}
                onOpenHistory={() => setSubScreen("network-history")}
                onOpenSpeedTest={() => setSubScreen("speed-test")}
                onToggleKill={() => setKillSwitch((v) => !v)}
                onToggleAuto={() => setAutoConnect((v) => !v)}
              />
            )}
            {tab === "servers" && (
              <ServersScreen
                servers={rankedServers}
                selectedId={server.id}
                favorites={favorites}
                onSelect={handleSelectServer}
                onToggleFav={(id) => setFavorites((f) => ({ ...f, [id]: !f[id] }))}
                bestServer={bestServer}
                onUseRecommended={handleSelectServer}
              />
            )}
            {tab === "security" && (
              <SecurityScreen
                connected={connected}
                killSwitch={killSwitch}
                autoConnect={autoConnect}
                twoFA={twoFA}
                threatBlockerOn={threatBlockerOn}
                threatsBlockedToday={threatsBlockedToday}
                appLockEnabled={appLockEnabled}
                appLockSupported={appLockSupported}
                trustedNetworksCount={trustedNetworks.length}
                trustedServicesEnabledCount={trustedServices.filter((s) => s.enabled).length}
                onToggleKill={() => setKillSwitch((v) => !v)}
                onToggleAuto={() => setAutoConnect((v) => !v)}
                onToggle2FA={() => setTwoFA((v) => !v)}
                onToggleAppLock={handleToggleAppLock}
                onOpenSplitTunnel={() => setSubScreen("split-tunnel")}
                onOpenThreatBlocker={() => setSubScreen("threat-blocker")}
                onOpenTrustedNetworks={() => setSubScreen("trusted-networks")}
                onOpenTrustedServices={() => setSubScreen("trusted-services")}
              />
            )}
            {tab === "devices" && <DevicesScreen devices={devices} onSignOut={(id) => setSignedOutIds((s) => ({ ...s, [id]: true }))} />}
            {tab === "settings" && (
              <SettingsScreen
                planLabel={subscriptionPlanLabel}
                unreadNotifCount={unreadNotifCount}
                onOpenPlans={() => setSubScreen("plans")}
                onOpenNotifications={() => setSubScreen("notifications")}
              />
            )}
          </>
        )}
      </div>
      <TabBar
        activeTab={tab}
        onChange={(t) => {
          setSubScreen(null);
          setTab(t);
        }}
      />
    </div>
  );
}
