"use client";

import Icon from "../Icon";
import Toggle from "../Toggle";
import SecurityCheck from "../SecurityCheck";
import { colors } from "@/lib/theme";
import type { IconName } from "@/lib/data";

function Row({ icon, title, subtitle, right }: { icon: IconName; title: string; subtitle: string; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between bg-white/5 rounded-2xl py-3.5 px-4 mb-2.5">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Icon name={icon} size={16} color={colors.orange} className="w-5 shrink-0" />
        <div className="min-w-0">
          <p className="f-semibold text-sm text-white">{title}</p>
          <p className="f-regular text-[11px] text-white/45 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {right}
    </div>
  );
}

export default function SecurityScreen({
  connected,
  killSwitch,
  autoConnect,
  twoFA,
  threatBlockerOn,
  threatsBlockedToday,
  appLockEnabled,
  appLockSupported,
  onToggleKill,
  onToggleAuto,
  onToggle2FA,
  onToggleAppLock,
  trustedNetworksCount,
  trustedServicesEnabledCount,
  onOpenSplitTunnel,
  onOpenThreatBlocker,
  onOpenTrustedNetworks,
  onOpenTrustedServices,
}: {
  connected: boolean;
  killSwitch: boolean;
  autoConnect: boolean;
  twoFA: boolean;
  threatBlockerOn: boolean;
  threatsBlockedToday: number;
  appLockEnabled: boolean;
  appLockSupported: boolean;
  onToggleKill: () => void;
  onToggleAuto: () => void;
  onToggle2FA: () => void;
  onToggleAppLock: () => void;
  trustedNetworksCount: number;
  trustedServicesEnabledCount: number;
  onOpenSplitTunnel: () => void;
  onOpenThreatBlocker: () => void;
  onOpenTrustedNetworks: () => void;
  onOpenTrustedServices: () => void;
}) {
  const checks = [
    { label: "IP protected", pass: connected },
    { label: "DNS protected", pass: connected },
    { label: "IPv6 protected", pass: connected },
    { label: "WebRTC protected", pass: connected },
    { label: "Kill switch active", pass: killSwitch },
    { label: "VPN encryption active", pass: connected },
    { label: "Secure DNS active", pass: connected },
  ];

  return (
    <div className="px-5">
      <h1 className="f-extrabold text-[25px] text-white mb-1">Security Center</h1>
      <p className="f-regular text-[13px] text-white/50 mb-[18px]">Your protection status at a glance</p>

      <SecurityCheck checks={checks} />

      <button onClick={onOpenThreatBlocker} className="w-full flex items-center justify-between bg-white/5 rounded-2xl py-3.5 px-4 mb-2.5 text-left">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Icon name="bug-slash" size={16} color={colors.orange} className="w-5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="f-semibold text-sm text-white">Threat Blocker</p>
            <p className="f-regular text-[11px] text-white/45 mt-0.5">
              {threatBlockerOn ? `${threatsBlockedToday.toLocaleString()} blocked today` : "Off"}
            </p>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full mr-2.5" style={{ backgroundColor: threatBlockerOn ? colors.green : "rgba(255,255,255,0.45)" }} />
        <Icon name="chevron-right" size={13} color="rgba(255,255,255,0.3)" />
      </button>

      <Row icon="power-off" title="Kill Switch" subtitle="Block traffic if VPN drops" right={<Toggle value={killSwitch} onToggle={onToggleKill} />} />
      <Row icon="wifi" title="Auto-Connect" subtitle="On public & untrusted Wi-Fi" right={<Toggle value={autoConnect} onToggle={onToggleAuto} />} />
      <Row icon="lock" title="Two-Factor Authentication" subtitle="Extra layer on account login" right={<Toggle value={twoFA} onToggle={onToggle2FA} />} />
      <Row
        icon="fingerprint"
        title="App Lock"
        subtitle={appLockSupported ? "Require Face ID / fingerprint to open" : "Not available on this device"}
        right={appLockSupported ? <Toggle value={appLockEnabled} onToggle={onToggleAppLock} /> : null}
      />

      <button onClick={onOpenSplitTunnel} className="w-full flex items-center justify-between bg-white/5 rounded-2xl py-3.5 px-4 mb-2.5 text-left">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Icon name="shuffle" size={16} color={colors.orange} className="w-5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="f-semibold text-sm text-white">Smart Split Tunnel</p>
            <p className="f-regular text-[11px] text-white/45 mt-0.5">Choose which apps use the VPN</p>
          </div>
        </div>
        <Icon name="chevron-right" size={13} color="rgba(255,255,255,0.3)" />
      </button>

      <button onClick={onOpenTrustedNetworks} className="w-full flex items-center justify-between bg-white/5 rounded-2xl py-3.5 px-4 mb-2.5 text-left">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Icon name="route" size={16} color={colors.orange} className="w-5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="f-semibold text-sm text-white">Trusted Networks</p>
            <p className="f-regular text-[11px] text-white/45 mt-0.5">
              {trustedNetworksCount} network{trustedNetworksCount === 1 ? "" : "s"} configured
            </p>
          </div>
        </div>
        <Icon name="chevron-right" size={13} color="rgba(255,255,255,0.3)" />
      </button>

      <button onClick={onOpenTrustedServices} className="w-full flex items-center justify-between bg-white/5 rounded-2xl py-3.5 px-4 text-left">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Icon name="chart-line" size={16} color={colors.orange} className="w-5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="f-semibold text-sm text-white">Trusted Trading</p>
            <p className="f-regular text-[11px] text-white/45 mt-0.5">
              {trustedServicesEnabledCount} service{trustedServicesEnabledCount === 1 ? "" : "s"} allowed
            </p>
          </div>
        </div>
        <Icon name="chevron-right" size={13} color="rgba(255,255,255,0.3)" />
      </button>
    </div>
  );
}
