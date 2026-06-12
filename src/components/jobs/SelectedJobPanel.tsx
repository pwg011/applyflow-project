import StatusBadge from "@/components/applyflow/StatusBadge";
import SurfacePanel from "@/components/applyflow/SurfacePanel";
import type { ApplyFlowJob } from "@/data/applyflow";

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 6h14v14H5zM8 3v5M16 3v5M5 10h14" />
    </svg>
  );
}

export default function SelectedJobPanel({ job }: { job: ApplyFlowJob }) {
  const detailRole = job.level ? `${job.role} \u2014 ${job.level}` : job.role;

  return (
    <SurfacePanel
      as="aside"
      className="overflow-hidden rounded-lg bg-white/55 shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
    >
      <div className="px-6 pb-5 pt-6">
        <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
          Selected Job
        </p>
        <div className="mt-4 flex items-start justify-between">
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-[2px] text-[19px] font-semibold ${job.logoClass}`}
          >
            {job.initials}
          </span>
          <button
            type="button"
            aria-label="More actions"
            className="text-[16px] font-bold tracking-[0.08em]"
          >
            &middot;&middot;&middot;
          </button>
        </div>
        <h2 className="mt-5 text-[20px] font-semibold tracking-[-0.035em] text-black">
          {job.company}
        </h2>
        <p className="mt-1 max-w-[220px] text-[16px] leading-[1.45] text-[#4b4b4d]">
          {detailRole}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[#eef0f3] px-2 py-1 text-[8px] font-semibold uppercase"
            >
              {tag}
            </span>
          ))}
          <StatusBadge
            status={job.detailStatus}
            tone={job.statusTone}
            variant="tag"
          />
        </div>
      </div>

      <div className="border-t border-[#e4e6e9] px-6 py-6">
        <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
          Next Step
        </p>
        <div className="mt-4 border border-[#c7c9cc] bg-[#eceef1] px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="h-5 w-5 text-black">
              <CalendarIcon />
            </span>
            <span className="text-[14px] font-semibold">
              {job.nextStep.title}
            </span>
          </div>
          <p className="mt-3 text-[11px] leading-none text-[#4b4b4d]">
            {job.nextStep.date} &bull; {job.nextStep.location}
          </p>
        </div>

        <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
          Application Log
        </p>
        <div className="mt-5 space-y-4">
          {job.applicationLog.map((item, index) => (
            <div
              key={`${item.title}-${item.date}`}
              className="relative border-l border-[#dfe1e4] pb-1 pl-4"
            >
              <span
                className={`absolute -left-[4px] top-1 h-2 w-2 rounded-full ${
                  index === 0 ? "bg-black" : "bg-[#85878a]"
                }`}
              />
              <p className="text-[14px] font-semibold">{item.title}</p>
              <p className="mt-1 text-[10px] text-[#4b4b4d]">{item.date}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 bg-[#e5e7e9]/65 px-6 py-6">
        <button
          type="button"
          className="h-[34px] flex-1 border border-[#adafb2] bg-transparent text-[11px] font-semibold"
        >
          Edit Details
        </button>
        <button
          type="button"
          className="h-[34px] flex-1 rounded-[2px] bg-black text-[11px] font-semibold text-white"
        >
          View Job
        </button>
      </div>
    </SurfacePanel>
  );
}
