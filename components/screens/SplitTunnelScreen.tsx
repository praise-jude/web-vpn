"use client";

import Icon from "../Icon";
import BackHeader from "../BackHeader";
import { splitTunnelApps } from "@/lib/data";
import { colors } from "@/lib/theme";

export default function SplitTunnelScreen({
  vpnApps,
  onToggleApp,
  onBack,
}: {
  vpnApps: Record<string, boolean>;
  onToggleApp: (id: string) => void;
  onBack: () => void;
}) {
  return (
    <div>
      <BackHeader title="Smart Split Tunnel" onBack={onBack} />
      <div className="px-5">
        <p className="f-regular text-[13px] text-white/50 mb-[18px] leading-[19px]">
          Choose which apps route through Royal-VPN and which connect directly.
        </p>

        <div className="bg-white/5 rounded-2xl overflow-hidden">
          {splitTunnelApps.map((app, i) => {
            const onVpn = vpnApps[app.id] !== false;
            return (
              <div
                key={app.id}
                className={`flex items-center gap-3 py-3.5 px-4 ${i < splitTunnelApps.length - 1 ? "border-b border-white/8" : ""}`}
              >
                <Icon name={app.icon} size={16} color={colors.orange} className="w-5 shrink-0" />
                <span className="flex-1 f-medium text-sm text-white">{app.name}</span>
                <button onClick={() => onToggleApp(app.id)} className="flex bg-white/8 rounded-full p-0.5 gap-0.5">
                  <span className={`f-semibold text-[10.5px] py-1.5 px-2.5 rounded-full ${onVpn ? "bg-royal-orange text-white" : "text-white/70"}`}>
                    VPN
                  </span>
                  <span className={`f-semibold text-[10.5px] py-1.5 px-2.5 rounded-full ${!onVpn ? "bg-royal-blue text-white" : "text-white/70"}`}>
                    Direct
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
