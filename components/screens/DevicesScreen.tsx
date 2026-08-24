import Icon from "../Icon";
import { colors } from "@/lib/theme";
import type { Device } from "@/lib/data";

export default function DevicesScreen({ devices, onSignOut }: { devices: Device[]; onSignOut: (id: number) => void }) {
  return (
    <div className="px-5">
      <h1 className="f-extrabold text-[25px] text-white mb-1">My Devices</h1>
      <p className="f-regular text-[13px] text-white/50 mb-[18px]">Manage where you&apos;re signed in</p>

      {devices.map((d) => (
        <div key={d.id} className="flex items-center gap-3 bg-white/5 rounded-2xl p-3.5 mb-2.5">
          <Icon name="mobile-screen-button" size={17} color={colors.blue} className="w-[22px] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="f-semibold text-sm text-white">{d.name}</p>
            <p className="f-regular text-xs text-white/50 mt-0.5">
              {d.platform} · {d.lastActive}
            </p>
          </div>
          {d.current ? (
            <span className="bg-[rgba(34,197,94,0.15)] px-2 py-1 rounded-full shrink-0">
              <span className="f-bold text-[9px] text-royal-green tracking-wide">THIS DEVICE</span>
            </span>
          ) : (
            <button onClick={() => onSignOut(d.id)} className="shrink-0">
              <span className="f-semibold text-xs text-royal-red py-1.5 px-2">Sign Out</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
