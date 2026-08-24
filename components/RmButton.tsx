"use client";

const SIZES = {
  sm: "py-2 px-[18px] text-sm min-h-9",
  md: "py-2.5 px-6 text-base min-h-11",
  lg: "py-3 px-7 text-lg min-h-12",
};

const VARIANTS = {
  primary: "bg-royal-orange text-white active:bg-royal-blue",
  secondary: "bg-royal-blue text-white active:bg-royal-blue",
};

export default function RmButton({
  children,
  shape = "pill",
  size = "md",
  variant = "primary",
  onClick,
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  shape?: "pill" | "lg";
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const radius = shape === "lg" ? "rounded-lg" : "rounded-full";

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`f-bold flex items-center justify-center shadow-[0_10px_15px_rgba(0,0,0,0.1)] transition-colors ${radius} ${SIZES[size]} ${VARIANTS[variant]} ${disabled ? "opacity-50" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
