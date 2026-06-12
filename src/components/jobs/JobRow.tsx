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
      className={`relative grid min-h-[81px] w-full grid-cols-[40px_minmax(130px,1fr)_minmax(120px,0.9fr)_75px_15px] items-center gap-4 overflow-hidden rounded-lg px-4 text-left transition hover:bg-white/75 ${
        selected
          ? "before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-[#999a9c]"
          : ""
      }`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-[2px] text-[15px] font-semibold ${job.logoClass}`}
      >
        {job.initials}
      </span>
      <span>
        <span className="block text-[16px] font-semibold tracking-[-0.025em] text-black">
          {job.company}
        </span>
        <span className="mt-0.5 block text-[15px] text-[#4b4b4d]">
          {job.role}
        </span>
      </span>
      <span className="text-center text-[11px] text-[#4b4b4d]">
        {job.note}
      </span>
      <StatusBadge status={job.status} tone={job.statusTone} />
      <span className="text-[22px] font-light leading-none text-[#c5c6c8]">
        &rsaquo;
      </span>
    </SurfacePanel>
  );
}
