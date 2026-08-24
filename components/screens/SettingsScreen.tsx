"use client";

import Icon from "../Icon";
import RmButton from "../RmButton";
import { colors } from "@/lib/theme";
import type { IconName } from "@/lib/data";

export default function SettingsScreen({
  planLabel,
  unreadNotifCount,
  onOpenPlans,
  onOpenNotifications,
}: {
  planLabel: string;
  unreadNotifCount: number;
  onOpenPlans: () => void;
  onOpenNotifications: () => void;
}) {
  const menuItems: { icon: IconName; label: string; onPress?: () => void; badge?: number; value?: string }[] = [
    { icon: "bell", label: "Notifications", onPress: onOpenNotifications, badge: unreadNotifCount },
    { icon: "globe", label: "Language", value: "English" },
    { icon: "headset", label: "Royal Support" },
    { icon: "lock", label: "Privacy Center" },
  ];

  return (
    <div className="px-5">
      <h1 className="f-extrabold text-[25px] text-white mb-[18px]">Settings</h1>

      <div className="flex items-center gap-3.5 bg-white/5 rounded-2xl p-4 mb-3.5">
        <div className="w-[50px] h-[50px] rounded-full bg-royal-orange flex items-center justify-center shrink-0">
          <span className="f-bold text-lg text-black">A</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="f-bold text-[15px] text-white">Ada Okafor</p>
          <p className="f-regular text-xs text-white/50 mt-0.5">ada.okafor@email.com</p>
        </div>
        <Icon name="chevron-right" size={14} color="rgba(255,255,255,0.3)" />
      </div>

      <div
        className="rounded-2xl p-[18px] mb-3.5"
        style={{ background: `linear-gradient(135deg, ${colors.blue}, ${colors.orange})` }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Icon name="crown" size={14} color="#fff" />
          <span className="f-bold text-[13px] text-white tracking-wide">{planLabel}</span>
        </div>
        <p className="f-regular text-xs text-white/85 mb-3.5">Renews Sep 18, 2026 · All locations · 5 devices</p>
        <RmButton variant="primary" size="sm" shape="pill" onClick={onOpenPlans}>
          Manage Subscription
        </RmButton>
      </div>

      <div className="bg-white/5 rounded-2xl overflow-hidden mb-4">
        {menuItems.map((item, i) => {
          const Row = item.onPress ? "button" : "div";
          return (
            <Row
              key={item.label}
              onClick={item.onPress}
              className={`w-full flex items-center gap-3 py-3.5 px-4 text-left ${i < menuItems.length - 1 ? "border-b border-white/8" : ""}`}
            >
              <Icon name={item.icon} size={16} color={colors.orange} className="w-5 shrink-0" />
              <span className="flex-1 f-medium text-sm text-white">{item.label}</span>
              {!!item.badge && (
                <span className="bg-royal-orange min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1.5 mr-2">
                  <span className="f-bold text-[10px] text-black">{item.badge}</span>
                </span>
              )}
              {item.value && <span className="f-regular text-[13px] text-white/45 mr-1">{item.value}</span>}
              <Icon name="chevron-right" size={13} color="rgba(255,255,255,0.3)" />
            </Row>
          );
        })}
      </div>

      <RmButton variant="secondary" size="md" shape="lg" className="w-full">
        Log Out
      </RmButton>

      <p className="text-center f-regular text-[11px] text-white/30 mt-4 pb-6">Royal-VPN v1.0.0</p>
    </div>
  );
}
