import Icon from "../Icon";
import BackHeader from "../BackHeader";
import { subscriptionPlans } from "@/lib/data";
import { colors } from "@/lib/theme";

export default function PlansScreen({
  currentPlanId,
  onSelectPlan,
  onBack,
}: {
  currentPlanId: string;
  onSelectPlan: (id: string) => void;
  onBack: () => void;
}) {
  return (
    <div>
      <BackHeader title="Manage Subscription" onBack={onBack} />
      <div className="px-5 pb-6">
        <p className="f-regular text-[13px] text-white/50 mb-[18px]">Choose the plan that fits how you use Royal-VPN.</p>

        {subscriptionPlans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const isUpgrade =
            subscriptionPlans.findIndex((p) => p.id === plan.id) > subscriptionPlans.findIndex((p) => p.id === currentPlanId);
          return (
            <div
              key={plan.id}
              className="rounded-[18px] p-[18px] mb-3.5"
              style={
                isCurrent
                  ? { background: `linear-gradient(135deg, ${colors.blue}, ${colors.orange})` }
                  : { backgroundColor: "rgba(255,255,255,0.05)" }
              }
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="f-extrabold text-lg text-white">{plan.name}</span>
                {isCurrent && (
                  <span className="bg-white/25 px-2 py-[3px] rounded-full">
                    <span className="f-bold text-[9px] text-white tracking-wide">CURRENT</span>
                  </span>
                )}
              </div>
              <p className="f-extrabold text-2xl text-white mb-3.5">
                {plan.price}
                <span className="f-regular text-[13px] text-white/60">{plan.period}</span>
              </p>
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2 mb-2">
                  <Icon name="check" size={12} color={isCurrent ? "#fff" : colors.green} />
                  <span className={`f-regular text-[13px] ${isCurrent ? "text-white" : "text-white/70"}`}>{f}</span>
                </div>
              ))}
              {!isCurrent && (
                <button onClick={() => onSelectPlan(plan.id)} className="mt-2 w-full bg-royal-orange rounded-full py-[11px]">
                  <span className="f-bold text-sm text-black">{isUpgrade ? "Upgrade" : "Switch to " + plan.name}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
