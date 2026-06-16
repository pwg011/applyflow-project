"use client";

import StatusBadge from "@/components/applyflow/StatusBadge";
import type { ApplyFlowJob } from "@/data/applyflow";

type ApplicationDetailsModalProps = {
  isOpen: boolean;
  job: ApplyFlowJob;
  onClose: () => void;
};

function formatJobLink(company: string) {
  return `${company.toLowerCase().replaceAll(" ", "")}.com/careers`;
}

export default function ApplicationDetailsModal({
  isOpen,
  job,
  onClose,
}: ApplicationDetailsModalProps) {
  const role = job.level ? `${job.role} - ${job.level}` : job.role;
  const jobLink = formatJobLink(job.company);

  return (
    <>
      <div
        className={`fixed inset-0 z-[62] bg-slate-950/8 backdrop-blur-[6px] transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed right-0 top-0 z-[63] flex h-full w-full max-w-[540px] flex-col border-l border-slate-300/45 bg-gradient-to-br from-white/80 via-white/64 to-slate-100/50 shadow-[-24px_0_68px_rgba(15,23,42,0.16),inset_1px_0_0_rgba(255,255,255,0.82)] ring-1 ring-white/70 backdrop-blur-[56px] backdrop-saturate-150 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <header className="flex shrink-0 items-start justify-between border-t border-white/90 border-b border-slate-200/55 bg-white/26 px-7 pb-6 pt-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#4b4b4d]">
              Application Details
            </p>
            <div className="mt-4 flex items-start gap-4">
              <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[2px] text-[20px] font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.08)] ${job.logoClass}`}
              >
                {job.initials}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-[28px] font-semibold leading-tight tracking-[-0.04em] text-black">
                  {job.company}
                </h2>
                <p className="mt-1 text-[15px] leading-6 text-[#4b4b4d]">
                  {role}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/70 bg-white/45 text-2xl leading-none text-[#4b4b4d] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition hover:bg-white/70 hover:text-black"
            aria-label="Close application details"
          >
            &times;
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-7 py-6 [scrollbar-color:#d5d8de_transparent] [scrollbar-width:thin]">
          <section className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[5px] border border-white/70 bg-white/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                Status
              </p>
              <div className="mt-3">
                <StatusBadge
                  status={job.detailStatus}
                  tone={job.statusTone}
                  variant="tag"
                />
              </div>
            </div>

            <div className="rounded-[5px] border border-white/70 bg-white/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                Source
              </p>
              <p className="mt-3 text-[13px] font-semibold text-[#273142]">
                {job.source}
              </p>
            </div>
          </section>

          <section className="mt-4 rounded-[5px] border border-white/70 bg-white/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[3px] border border-white/70 bg-white/46 px-3 py-1.5 text-[11px] font-semibold text-[#3d4655] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl"
                >
                  {tag}
                </span>
              ))}
              {job.level ? (
                <span className="rounded-[3px] border border-white/70 bg-white/46 px-3 py-1.5 text-[11px] font-semibold text-[#3d4655] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
                  {job.level}
                </span>
              ) : null}
            </div>
          </section>

          <section className="mt-4 rounded-[5px] border border-white/70 bg-white/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
              Next Step
            </p>
            <div className="mt-3 border border-white/70 bg-white/44 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
              <p className="text-[15px] font-semibold text-black">
                {job.nextStep.title}
              </p>
              <p className="mt-1 text-[12px] leading-5 text-[#596273]">
                {job.nextStep.date} - {job.nextStep.location}
              </p>
            </div>
          </section>

          <section className="mt-4 rounded-[5px] border border-white/70 bg-white/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
              Notes
            </p>
            <p className="mt-3 text-[14px] leading-6 text-[#273142]">
              {job.note}
            </p>
            <div className="mt-4 border-t border-white/60 pt-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                Job Link
              </p>
              <p className="mt-2 truncate text-[13px] font-medium text-[#273142]">
                {jobLink}
              </p>
            </div>
          </section>

          <section className="mt-4 pb-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
              Application Log
            </p>
            <div className="relative mt-5 space-y-5 pl-7">
              <div className="absolute bottom-2 left-[4px] top-2 w-px bg-[#d7dbe0]" />
              {job.applicationLog.map((item, index) => (
                <div key={`${item.title}-${item.date}`} className="relative">
                  <span
                    className={`absolute -left-[28px] top-1.5 flex h-3 w-3 rounded-full border-2 border-white shadow-sm ${
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
          </section>
        </div>

        <footer className="grid shrink-0 grid-cols-2 gap-4 border-t border-slate-200/55 bg-white/40 px-7 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-2xl">
          <button
            type="button"
            onClick={onClose}
            className="h-11 border border-white/70 bg-white/30 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#191c1e] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition hover:bg-white/55"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-[2px] bg-black text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition hover:bg-[#111827]"
          >
            Done
          </button>
        </footer>
      </aside>
    </>
  );
}
