export default function QualityScore({ score, label, color }: { score: number; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3.5 bg-white/6 rounded-2xl p-3.5 mb-3.5">
      <div className="w-[52px] h-[52px] flex items-center justify-center shrink-0">
        <div
          className="w-[52px] h-[52px] rounded-full border-[3px] flex items-center justify-center"
          style={{ borderColor: color }}
        >
          <span className="f-bold text-sm" style={{ color }}>
            {score}
          </span>
        </div>
      </div>
      <div className="flex-1">
        <p className="f-semibold text-sm text-white">Connection Quality</p>
        <p className="f-regular text-xs mt-0.5" style={{ color }}>
          {label}
        </p>
      </div>
    </div>
  );
}
