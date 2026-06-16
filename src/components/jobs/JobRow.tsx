import SurfacePanel from "@/components/applyflow/SurfacePanel";
import StatusBadge from "@/components/applyflow/StatusBadge";
import type { ApplyFlowJob } from "@/data/applyflow";

type JobRowProps = {
  job: ApplyFlowJob;
  selected: boolean;
  onSelect: () => void;
};

export default function JobRow({ job, selected, onSelect }: JobRowProps) {
  return (
    <SurfacePanel
      as="button"
      type="button"
      onClick={onSelect}
      className={`relative grid min-h-[84px] w-full grid-cols-[44px_minmax(130px,1fr)_minmax(120px,0.9fr)_75px_16px] items-center gap-4 overflow-hidden rounded-lg border px-4 text-left shadow-[0_12px_28px_rgba(0,0,0,0.025)] transition hover:border-[#d5d7da] hover:bg-white/75 hover:shadow-[0_16px_34px_rgba(0,0,0,0.04)] ${
        selected
          ? "border-[#c7c9cc] bg-white/80 before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:bg-[#4b4b4d]"
          : "border-[#e4e6e9] bg-white/55"
      }`}
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-[2px] text-[15px] font-semibold shadow-[0_8px_18px_rgba(0,0,0,0.08)] ${job.logoClass}`}
      >
        {job.initials}
      </span>
      <span className="min-w-0">
        <span className="block text-[16px] font-semibold tracking-[-0.025em] text-black">
          {job.company}
        </span>
        <span className="mt-1 block truncate text-[14px] text-[#4b4b4d]">
          {job.role}
        </span>
      </span>
      <span className="border-l border-[#e4e6e9] pl-4 text-left text-[11px] leading-4 text-[#4b4b4d]">
        {job.note}
      </span>
      <StatusBadge status={job.status} tone={job.statusTone} />
      <span
        className={`text-[22px] font-light leading-none transition ${
          selected ? "text-black" : "text-[#c5c6c8]"
        }`}
      >
        &rsaquo;
      </span>
    </SurfacePanel>
  );
}
