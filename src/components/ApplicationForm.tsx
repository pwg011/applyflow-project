"use client";

import type { ApplyFlowJob } from "@/data/applyflow";

type ApplicationFormProps = {
  isOpen: boolean;
  job: ApplyFlowJob;
  onClose: () => void;
};

export default function ApplicationForm({
  isOpen,
  job,
  onClose,
}: ApplicationFormProps) {
  const notes =
    job.applicationLog.length > 0
      ? `${job.note} Latest activity: ${job.applicationLog[0].title}.`
      : job.note;

  return (
    <>
      <div
        className={`fixed inset-0 z-[58] bg-slate-950/8 backdrop-blur-[5px] transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed right-0 top-0 z-[59] flex h-full w-full max-w-[460px] flex-col border-l border-slate-300/45 bg-gradient-to-br from-white/80 via-white/64 to-slate-100/50 shadow-[-24px_0_68px_rgba(15,23,42,0.16),inset_1px_0_0_rgba(255,255,255,0.82)] ring-1 ring-white/70 backdrop-blur-[56px] backdrop-saturate-150 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <header className="flex shrink-0 items-start justify-between border-t border-white/90 border-b border-slate-200/55 bg-white/26 px-7 pb-5 pt-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#4b4b4d]">
              Application
            </p>
            <h2 className="mt-2 text-[27px] font-semibold leading-tight tracking-[-0.035em] text-black">
              Edit Application
            </h2>
            <p className="mt-2 max-w-[320px] text-[14px] leading-6 text-[#4b4b4d]">
              Review the selected job details before updating this application.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/70 bg-white/45 text-2xl leading-none text-[#4b4b4d] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition hover:bg-white/70 hover:text-black"
            aria-label="Close edit application"
          >
            &times;
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-7 py-5 [scrollbar-color:#d5d8de_transparent] [scrollbar-width:thin]">
          <section className="rounded-[5px] border border-white/70 bg-white/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
            <div className="flex items-center gap-4">
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[2px] text-[18px] font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.08)] ${job.logoClass}`}
              >
                {job.initials}
              </span>
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#4b4b4d]">
                  Selected job
                </p>
                <p className="mt-1 truncate text-[18px] font-semibold tracking-[-0.03em] text-black">
                  {job.company}
                </p>
              </div>
            </div>
          </section>

          <form className="mt-4 space-y-4">
            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                Company
              </span>
              <input
                defaultValue={job.company}
                className="mt-2 h-11 w-full rounded-[4px] border border-white/70 bg-white/62 px-4 text-[14px] text-[#191c1e] shadow-[inset_0_1px_3px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.72)] outline-none backdrop-blur-xl transition focus:border-white focus:bg-white/78 focus:ring-2 focus:ring-black/5"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                Role
              </span>
              <input
                defaultValue={job.role}
                className="mt-2 h-11 w-full rounded-[4px] border border-white/70 bg-white/62 px-4 text-[14px] text-[#191c1e] shadow-[inset_0_1px_3px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.72)] outline-none backdrop-blur-xl transition focus:border-white focus:bg-white/78 focus:ring-2 focus:ring-black/5"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                Status
              </span>
              <select
                defaultValue={job.status}
                className="mt-2 h-11 w-full rounded-[4px] border border-white/70 bg-white/62 px-4 text-[14px] text-[#191c1e] shadow-[inset_0_1px_3px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.72)] outline-none backdrop-blur-xl transition focus:border-white focus:bg-white/78 focus:ring-2 focus:ring-black/5"
              >
                <option>Interview</option>
                <option>Applied</option>
                <option>Draft</option>
                <option>Saved</option>
                <option>Active</option>
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                  Next step title
                </span>
                <input
                  defaultValue={job.nextStep.title}
                  className="mt-2 h-11 w-full rounded-[4px] border border-white/70 bg-white/62 px-4 text-[14px] text-[#191c1e] shadow-[inset_0_1px_3px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.72)] outline-none backdrop-blur-xl transition focus:border-white focus:bg-white/78 focus:ring-2 focus:ring-black/5"
                />
              </label>

              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                  Next step date
                </span>
                <input
                  defaultValue={job.nextStep.date}
                  className="mt-2 h-11 w-full rounded-[4px] border border-white/70 bg-white/62 px-4 text-[14px] text-[#191c1e] shadow-[inset_0_1px_3px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.72)] outline-none backdrop-blur-xl transition focus:border-white focus:bg-white/78 focus:ring-2 focus:ring-black/5"
                />
              </label>

              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                  Location
                </span>
                <input
                  defaultValue={job.nextStep.location}
                  className="mt-2 h-11 w-full rounded-[4px] border border-white/70 bg-white/62 px-4 text-[14px] text-[#191c1e] shadow-[inset_0_1px_3px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.72)] outline-none backdrop-blur-xl transition focus:border-white focus:bg-white/78 focus:ring-2 focus:ring-black/5"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                Notes
              </span>
              <textarea
                defaultValue={notes}
                rows={5}
                className="mt-2 w-full resize-none rounded-[4px] border border-white/70 bg-white/62 px-4 py-3 text-[14px] leading-6 text-[#191c1e] shadow-[inset_0_1px_3px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.72)] outline-none backdrop-blur-xl transition focus:border-white focus:bg-white/78 focus:ring-2 focus:ring-black/5"
              />
            </label>
          </form>
        </div>

        <footer className="grid shrink-0 grid-cols-2 gap-4 border-t border-slate-200/55 bg-white/40 px-7 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-2xl">
          <button
            type="button"
            onClick={onClose}
            className="h-11 border border-white/70 bg-white/30 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#191c1e] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition hover:bg-white/55"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-[2px] bg-black text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition hover:bg-[#111827]"
          >
            Save
          </button>
        </footer>
      </aside>
    </>
  );
}
