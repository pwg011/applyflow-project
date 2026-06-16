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

type SelectedJobPanelProps = {
  job: ApplyFlowJob;
  onEditDetails?: () => void;
};

export default function SelectedJobPanel({
  job,
  onEditDetails,
}: SelectedJobPanelProps) {
  const detailRole = job.level ? `${job.role} \u2014 ${job.level}` : job.role;

  return (
    <SurfacePanel
      as="aside"
      className="overflow-hidden rounded-lg border border-[#e0e2e5] bg-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
    >
      <div className="px-6 pb-5 pt-6">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
            Selected Job
          </p>
          <button
            type="button"
            aria-label="More actions"
            className="flex h-8 w-8 items-center justify-center border border-[#d5d7da] bg-white/40 text-[15px] font-bold tracking-[0.08em] text-[#4b4b4d] transition hover:bg-white hover:text-black"
          >
            &middot;&middot;&middot;
          </button>
        </div>

        <div className="mt-5 flex items-start gap-4">
          <span
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[2px] text-[20px] font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.08)] ${job.logoClass}`}
          >
            {job.initials}
          </span>
          <div className="min-w-0">
            <h2 className="text-[21px] font-semibold leading-tight tracking-[-0.035em] text-black">
              {job.company}
            </h2>
            <p className="mt-1 text-[15px] leading-[1.45] text-[#4b4b4d]">
              {detailRole}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <StatusBadge
            status={job.detailStatus}
            tone={job.statusTone}
            variant="tag"
          />
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="border border-[#e0e2e5] bg-[#eef0f3] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-[#4b4b4d]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-6 border-t border-[#e4e6e9] px-6 py-6">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
            Next Step
          </p>
          <div className="mt-3 border border-[#c7c9cc] bg-[#eceef1]/85 px-4 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#d5d7da] bg-white/50 text-black">
                <span className="h-4 w-4">
                  <CalendarIcon />
                </span>
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold leading-tight text-black">
                  {job.nextStep.title}
                </p>
                <p className="mt-1 text-[11px] leading-tight text-[#4b4b4d]">
                  {job.nextStep.date} &bull; {job.nextStep.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
            Application Log
          </p>
          <div className="relative mt-5 space-y-5 pl-6">
            <div className="absolute bottom-2 left-[3px] top-2 w-px bg-[#dfe1e4]" />
            {job.applicationLog.map((item, index) => (
              <div key={`${item.title}-${item.date}`} className="relative">
                <span
                  className={`absolute -left-[26px] top-1.5 flex h-2.5 w-2.5 rounded-full ${
                    index === 0 ? "bg-black" : "bg-[#c7c9cc]"
                  }`}
                />
                <p
                  className={`text-[14px] leading-tight ${
                    index === 0
                      ? "font-semibold text-black"
                      : "font-medium text-[#191c1e]"
                  }`}
                >
                  {item.title}
                </p>
                <p className="mt-1 text-[10px] leading-tight text-[#75859d]">
                  {item.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-[#e4e6e9] bg-[#e5e7e9]/65 px-6 py-6">
        <button
          type="button"
          onClick={onEditDetails}
          className="h-[34px] border border-[#adafb2] bg-transparent text-[11px] font-semibold text-[#191c1e] transition hover:bg-white/40"
        >
          Edit Details
        </button>
        <button
          type="button"
          className="h-[34px] rounded-[2px] bg-black text-[11px] font-semibold text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition hover:bg-[#111827]"
        >
          View Job
        </button>
      </div>
    </SurfacePanel>
  );
}
