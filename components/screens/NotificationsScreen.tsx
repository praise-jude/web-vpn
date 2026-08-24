import Icon from "../Icon";
import BackHeader from "../BackHeader";
import { formatRelativeTime } from "@/lib/utils";
import type { IconName } from "@/lib/data";

export interface AppNotification {
  id: string;
  icon: IconName;
  color: string;
  title: string;
  subtitle: string | null;
  time: number;
  read: boolean;
}

export default function NotificationsScreen({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onBack,
}: {
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onBack: () => void;
}) {
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div>
      <BackHeader title="Notifications" onBack={onBack} />
      <div className="px-5 pb-6">
        {hasUnread && (
          <button onClick={onMarkAllRead} className="block ml-auto mb-3">
            <span className="f-semibold text-xs text-royal-orange">Mark all as read</span>
          </button>
        )}

        {notifications.length === 0 ? (
          <p className="f-regular text-[13px] text-white/50 text-center py-6">You&apos;re all caught up.</p>
        ) : (
          <div className="bg-white/5 rounded-2xl overflow-hidden mb-5">
            {notifications.map((n, i) => (
              <button
                key={n.id}
                onClick={() => onMarkRead(n.id)}
                className={`w-full flex items-start gap-2.5 py-3.5 px-4 text-left ${i < notifications.length - 1 ? "border-b border-white/8" : ""}`}
              >
                {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-royal-orange mt-1.5 shrink-0" />}
                <Icon name={n.icon} size={15} color={n.color} className="w-[18px] shrink-0 mt-px" />
                <div className="flex-1 min-w-0">
                  <p className={`f-medium text-[13.5px] ${n.read ? "text-white/70" : "f-semibold text-white"}`}>{n.title}</p>
                  {n.subtitle ? <p className="f-regular text-xs text-white/50 mt-0.5">{n.subtitle}</p> : null}
                </div>
                <span className="f-regular text-[11px] text-white/45 mt-px shrink-0">{formatRelativeTime(n.time)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
