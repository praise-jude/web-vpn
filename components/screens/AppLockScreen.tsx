import Icon from "../Icon";
import { colors } from "@/lib/theme";

export default function AppLockScreen({ onUnlock, error }: { onUnlock: () => void; error: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-8">
      <div className="w-[88px] h-[88px] rounded-full bg-white/8 flex items-center justify-center mb-6">
        <Icon name="shield-halved" size={36} color={colors.orange} />
      </div>
      <h1 className="f-extrabold text-xl text-white mb-1.5">Royal-VPN Locked</h1>
      <p className="f-regular text-[13px] text-white/60 mb-7">Authenticate to continue</p>
      {error ? <p className="f-regular text-xs text-royal-red mb-4 text-center">{error}</p> : null}
      <button onClick={onUnlock} className="flex items-center gap-2.5 bg-royal-orange rounded-full py-3 px-7">
        <Icon name="fingerprint" size={16} color="#000" />
        <span className="f-bold text-[15px] text-black">Unlock</span>
      </button>
    </div>
  );
}
