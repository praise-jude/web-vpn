import Icon from "./Icon";
import { colors } from "@/lib/theme";

export default function SecurityCheck({ checks }: { checks: { label: string; pass: boolean }[] }) {
  const allPass = checks.every((c) => c.pass);

  return (
    <div className="bg-white/5 rounded-2xl overflow-hidden mb-[18px]">
      <div
        className="flex items-center gap-2.5 p-3.5"
        style={{ backgroundColor: allPass ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)" }}
      >
        <Icon
          name={allPass ? "circle-check" : "triangle-exclamation"}
          size={16}
          color={allPass ? colors.green : colors.red}
        />
        <p className="f-bold text-[13px]" style={{ color: allPass ? colors.green : colors.red }}>
          {allPass ? "All systems protected" : "Protection issue detected"}
        </p>
      </div>

      {checks.map((c, i) => (
        <div
          key={c.label}
          className={`flex items-center justify-between py-3 px-4 ${i < checks.length - 1 ? "border-b border-white/8" : ""}`}
        >
          <p className="f-medium text-[13.5px] text-white">{c.label}</p>
          <Icon name={c.pass ? "circle-check" : "circle-xmark"} size={16} color={c.pass ? colors.green : colors.red} />
        </div>
      ))}
    </div>
  );
}
