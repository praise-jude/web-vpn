"use client";

import Icon from "./Icon";

export default function BackHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3.5 px-5 mb-[18px]">
      <button
        onClick={onBack}
        aria-label="Back"
        className="w-[34px] h-[34px] rounded-full bg-white/6 flex items-center justify-center shrink-0"
      >
        <Icon name="chevron-left" size={15} color="#fff" />
      </button>
      <h1 className="f-extrabold text-xl text-white">{title}</h1>
    </div>
  );
}
