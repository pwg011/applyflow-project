import type { JobStatus, StatusTone } from "@/data/applyflow";

const toneClasses: Record<StatusTone, string> = {
  blue: "border-[#d7e7ff] bg-[#eef5ff] text-[#2864e8]",
  slate: "border-[#dfe6ef] bg-[#f2f5f9] text-[#687991]",
  amber: "border-[#f7e7b7] bg-[#fff9e9] text-[#b4540b]",
  gray: "border-[#d0d3d7] bg-[#dfe2e6] text-[#4b4e52]",
};

type StatusBadgeProps = {
  status: JobStatus | string;
  tone: StatusTone;
  variant?: "row" | "tag";
  className?: string;
};

export default function StatusBadge({
  status,
  tone,
  variant = "row",
  className = "",
}: StatusBadgeProps) {
  const sizeClasses =
    variant === "row"
      ? "min-w-[66px] rounded-full border px-2.5 py-1.5 text-[9px] tracking-[0.02em]"
      : "px-2 py-1 text-[8px]";

  return (
    <span
      className={`inline-flex justify-center font-semibold uppercase ${sizeClasses} ${toneClasses[tone]} ${className}`}
    >
      {status}
    </span>
  );
}
