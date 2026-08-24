import { colors } from "@/lib/theme";

function barColor(score: number) {
  if (score < 60) return colors.red;
  if (score < 80) return colors.yellow;
  return colors.green;
}

export default function Sparkline({
  samples,
  height = 70,
}: {
  samples: { t: number; score: number }[];
  height?: number;
}) {
  return (
    <div className="flex items-end gap-[3px]" style={{ height }}>
      {samples.map((s, i) => (
        <div
          key={i}
          className="flex-1 min-w-[2px] rounded-sm"
          style={{ height: Math.max(4, (s.score / 100) * height), backgroundColor: barColor(s.score) }}
        />
      ))}
    </div>
  );
}
