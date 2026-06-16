"use client";

import type { ApplyFlowJob } from "@/data/applyflow";

type DeleteApplicationModalProps = {
  isOpen: boolean;
  job: ApplyFlowJob;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirmDelete: () => void;
};

export default function DeleteApplicationModal({
  isOpen,
  job,
  isDeleting,
  onCancel,
  onConfirmDelete,
}: DeleteApplicationModalProps) {
  const role = job.level ? `${job.role} - ${job.level}` : job.role;

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-slate-950/12 backdrop-blur-[10px] transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-0 z-[61] flex items-center justify-center px-5 py-5 transition-all duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <section
          className={`w-full max-w-[430px] overflow-hidden rounded-lg border border-white/65 border-b-slate-300/70 bg-gradient-to-br from-white/78 via-white/62 to-slate-100/48 shadow-[0_34px_90px_rgba(15,23,42,0.22),0_12px_30px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-slate-900/5 backdrop-blur-[64px] backdrop-saturate-150 transition-all duration-300 ${
            isOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <header className="flex items-start justify-between border-t border-white/90 bg-white/22 px-6 pb-5 pt-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#7f2d2d]">
                Destructive Action
              </p>
              <h2 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.035em] text-black">
                Delete application?
              </h2>
              <p className="mt-2 max-w-[320px] text-[14px] leading-6 text-[#4b4b4d]">
                This will remove the application from your pipeline. You can
                cancel if you want to keep it.
              </p>
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/70 bg-white/45 text-2xl leading-none text-[#4b4b4d] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition hover:bg-white/70 hover:text-black"
              aria-label="Close delete confirmation"
            >
              &times;
            </button>
          </header>

          <div className="border-t border-white/50 bg-white/12 px-6 py-5">
            <div className="rounded-[5px] border border-white/70 bg-white/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[2px] text-[18px] font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.08)] ${job.logoClass}`}
                >
                  {job.initials}
                </span>
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#4b4b4d]">
                    Selected application
                  </p>
                  <p className="mt-1 truncate text-[17px] font-semibold tracking-[-0.03em] text-black">
                    {job.company}
                  </p>
                  <p className="mt-1 truncate text-[13px] text-[#596273]">
                    {role}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[13px] leading-5 text-[#596273]">
              Cancel to keep this application. Choose Delete only when you are
              sure you want to remove this record.
            </p>
          </div>

          <footer className="grid grid-cols-2 gap-4 border-t border-white/60 bg-white/36 px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-2xl">
            <button
              type="button"
              onClick={onCancel}
              className="h-11 border border-white/70 bg-white/30 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#191c1e] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition hover:bg-white/55"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirmDelete}
              disabled={isDeleting}
              className="h-11 rounded-[2px] bg-[#1b1b1b] text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_18px_rgba(0,0,0,0.14)] transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isDeleting ? "Deleting" : "Delete"}
            </button>
          </footer>
        </section>
      </div>
    </>
  );
}
