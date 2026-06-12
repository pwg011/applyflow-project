import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
};

export default function PrimaryButton({
  icon,
  children,
  className = "",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className={`flex h-11 w-44 max-w-full items-center justify-center gap-4 rounded-xl border border-white/30 bg-[#4a4a4a] text-[11px] font-semibold uppercase tracking-[0.04em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.24)] ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
