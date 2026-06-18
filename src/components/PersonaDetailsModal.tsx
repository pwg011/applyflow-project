"use client";

import StatusBadge from "@/components/applyflow/StatusBadge";
import type { ApplyFlowProfile } from "@/data/applyflow";

type PersonaDetailsModalProps = {
  profile: ApplyFlowProfile | null;
  onClose: () => void;
  onEdit: (profile: ApplyFlowProfile) => void;
  onReview: (profile: ApplyFlowProfile) => void;
};

const profileStrengths = {
  design: ["Product strategy", "Design systems", "User research"],
  code: ["Frontend architecture", "React systems", "Team mentorship"],
  growth: ["Experimentation", "Lifecycle strategy", "Retention analysis"],
};

function profileNotes(profile: ApplyFlowProfile) {
  return [
    `${profile.footerNote} profile asset.`,
    `${profile.completion}% completion across reusable profile sections.`,
    profile.status === "Draft"
      ? "Review pending fields before using this profile."
      : "Ready for tailored application workflows.",
  ];
}

export default function PersonaDetailsModal({
  profile,
  onClose,
  onEdit,
  onReview,
}: PersonaDetailsModalProps) {
  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/12 px-4 py-5 backdrop-blur-[12px] transition-opacity duration-300 sm:px-6 ${
        profile
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
      aria-hidden={!profile}
    >
      <section
        className={`relative flex max-h-[88vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[8px] border border-white/65 bg-gradient-to-br from-white/78 via-white/62 to-slate-100/48 shadow-[0_34px_80px_rgba(15,23,42,0.22),0_1px_0_rgba(255,255,255,0.85)_inset] ring-1 ring-slate-900/5 backdrop-blur-[64px] backdrop-saturate-150 transition-transform duration-300 ${
          profile ? "translate-y-0 scale-100" : "translate-y-3 scale-95"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {profile ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-[4px] border border-white/70 bg-white/55 text-[23px] font-light leading-none text-[#4b4b4d] shadow-[0_10px_22px_rgba(15,23,42,0.10),0_1px_0_rgba(255,255,255,0.9)_inset] backdrop-blur-2xl transition hover:bg-white/75 hover:text-black"
              aria-label="Close profile details"
            >
              &times;
            </button>

            <header className="border-t border-white/90 bg-white/24 px-6 pb-5 pt-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] sm:px-8">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#4b4b4d]">
                Profile Details
              </p>
              <div className="mt-4 flex items-start gap-4 pr-12">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[4px] border border-white/70 bg-white/58 text-[18px] font-semibold text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_22px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                  {profile.title
                    .split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div className="min-w-0">
                  <h2 className="text-[30px] font-semibold leading-tight tracking-[-0.04em] text-black">
                    {profile.title}
                  </h2>
                  <p className="mt-2 text-[15px] leading-6 text-[#4b4b4d]">
                    {profile.description}
                  </p>
                </div>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 [scrollbar-color:#c7c9cc_transparent] [scrollbar-width:thin] sm:px-8">
              <div className="grid gap-4 sm:grid-cols-3">
                <section className="rounded-[5px] border border-white/70 bg-white/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                    Status
                  </p>
                  <div className="mt-3">
                    <StatusBadge
                      status={profile.status}
                      tone={profile.statusTone}
                      variant="tag"
                    />
                  </div>
                </section>

                <section className="rounded-[5px] border border-white/70 bg-white/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                    Completion
                  </p>
                  <p className="mt-3 text-[24px] font-semibold tracking-[-0.04em] text-black">
                    {profile.completion}%
                  </p>
                </section>

                <section className="rounded-[5px] border border-white/70 bg-white/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                    CV Status
                  </p>
                  {profile.footerNote.toLowerCase().includes("upload") ? (
                    <div className="mt-3 border border-dashed border-[#cfd2d6] bg-white/34 px-3 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.68)]">
                      <p className="text-[13px] font-semibold text-black">
                        No CV uploaded
                      </p>
                      <p className="mt-1 text-[11px] leading-4 text-[#596273]">
                        Add a CV later to unlock review notes.
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 text-[13px] font-semibold text-[#273142]">
                      {profile.footerNote}
                    </p>
                  )}
                </section>
              </div>

              <section className="mt-4 rounded-[5px] border border-white/70 bg-white/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                    Profile Strength
                  </p>
                  <span className="text-[13px] font-semibold text-[#191c1e]">
                    {profile.completion}%
                  </span>
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-[2px] bg-white/70 shadow-[inset_0_1px_2px_rgba(15,23,42,0.10)]">
                  <div
                    className="h-full bg-black"
                    style={{ width: `${profile.completion}%` }}
                  />
                </div>
                <p className="mt-3 text-[14px] leading-6 text-[#273142]">
                  {profile.description}
                </p>
              </section>

              <section className="mt-4 rounded-[5px] border border-white/70 bg-white/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                  Core Strengths
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {profileStrengths[profile.icon].map((strength) => (
                    <span
                      key={strength}
                      className="rounded-[3px] border border-white/70 bg-white/50 px-3 py-1.5 text-[11px] font-semibold text-[#3d4655] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </section>

              <section className="mt-4 rounded-[5px] border border-white/70 bg-white/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                  Recent Notes
                </p>
                <div className="relative mt-5 space-y-4 pl-7">
                  <div className="absolute bottom-2 left-[4px] top-2 w-px bg-[#d7dbe0]" />
                  {profileNotes(profile).map((note, index) => (
                    <div key={note} className="relative">
                      <span
                        className={`absolute -left-[28px] top-1.5 flex h-3 w-3 rounded-full border-2 border-white shadow-sm ${
                          index === 0 ? "bg-black" : "bg-[#c7c9cc]"
                        }`}
                      />
                      <p className="text-[14px] leading-5 text-[#273142]">
                        {note}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <footer className="grid shrink-0 grid-cols-2 gap-4 border-t border-white/65 bg-white/58 px-6 py-4 shadow-[0_-16px_32px_rgba(15,23,42,0.07),0_1px_0_rgba(255,255,255,0.85)_inset] backdrop-blur-2xl sm:flex sm:justify-end sm:px-8">
              <button
                type="button"
                onClick={onClose}
                className="h-11 border border-white/75 bg-white/45 px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#222426] shadow-[0_8px_18px_rgba(15,23,42,0.07),0_1px_0_rgba(255,255,255,0.9)_inset] transition hover:bg-white/70 sm:min-w-[132px]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => onReview(profile)}
                className="h-11 border border-white/75 bg-white/45 px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#222426] shadow-[0_8px_18px_rgba(15,23,42,0.07),0_1px_0_rgba(255,255,255,0.9)_inset] transition hover:bg-white/70 sm:min-w-[132px]"
              >
                Review CV
              </button>
              <button
                type="button"
                onClick={() => onEdit(profile)}
                className="h-11 rounded-[2px] bg-black px-8 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition hover:bg-[#111111] sm:min-w-[172px]"
              >
                Edit Profile
              </button>
            </footer>
          </>
        ) : null}
      </section>
    </div>
  );
}
