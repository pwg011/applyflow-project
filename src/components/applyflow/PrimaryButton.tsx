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
      className={`flex h-11 w-44 max-w-full items-center justify-center gap-4 rounded-xl border border-white/10 bg-black text-[11px] font-semibold uppercase tracking-[0.04em] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.14)] transition hover:bg-[#111111] ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
