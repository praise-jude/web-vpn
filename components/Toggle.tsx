"use client";

export default function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={value}
      className={`relative w-[46px] h-[26px] rounded-full shrink-0 transition-colors ${value ? "bg-royal-blue" : "bg-white/15"}`}
    >
      <span
        className="absolute top-0.5 w-[22px] h-[22px] rounded-full bg-white transition-[left]"
        style={{ left: value ? 22 : 2 }}
      />
    </button>
  );
}
