import Icon from "../Icon";
import BackHeader from "../BackHeader";
import { colors } from "@/lib/theme";
import type { TrustedNetwork } from "@/lib/data";

export default function TrustedNetworksScreen({
  networks,
  onAdd,
  onRemove,
  onBack,
}: {
  networks: TrustedNetwork[];
  onAdd: () => void;
  onRemove: (id: number) => void;
  onBack: () => void;
}) {
  return (
    <div>
      <BackHeader title="Trusted Networks" onBack={onBack} />
      <div className="px-5">
        <p className="f-regular text-[13px] text-white/50 leading-[19px] mb-[18px]">
          Royal-VPN won&apos;t nag you to connect while you&apos;re on a network you trust.
        </p>

        {networks.length === 0 ? (
          <p className="f-regular text-[13px] text-white/50 mb-[18px]">No trusted networks yet.</p>
        ) : (
          <div className="bg-white/5 rounded-2xl overflow-hidden mb-[18px]">
            {networks.map((n, i) => (
              <div key={n.id} className={`flex items-center gap-3 py-3.5 px-4 ${i < networks.length - 1 ? "border-b border-white/8" : ""}`}>
                <Icon name="wifi" size={16} color={colors.orange} className="w-5 shrink-0" />
                <span className="flex-1 f-semibold text-sm text-white">{n.name}</span>
                <button onClick={() => onRemove(n.id)} aria-label={`Remove ${n.name}`}>
                  <Icon name="trash" size={14} color={colors.red} />
                </button>
              </div>
            ))}
          </div>
        )}

        <button onClick={onAdd} className="w-full flex items-center justify-center gap-2 bg-royal-orange rounded-full py-3 mb-6">
          <Icon name="plus" size={13} color="#000" />
          <span className="f-bold text-sm text-black">Add Current Network</span>
        </button>
      </div>
    </div>
  );
}
