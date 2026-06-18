"use client";

import StatusBadge from "@/components/applyflow/StatusBadge";
import type { ApplyFlowProfile } from "@/data/applyflow";

type PersonaBuildReviewModalProps = {
  profile: ApplyFlowProfile | null;
  onClose: () => void;
  onBack: () => void;
  onSave: () => void;
};

const reviewContent = {
  design: {
    suggestedTitle: "Senior Product Designer",
    summary:
      "CV signals strong product design ownership across fintech and SaaS workflows, with evidence of research-led delivery and design system contribution.",
    strengths: ["Product strategy", "UX research", "Design systems"],
    highlights: [
      "Led cross-functional product discovery for complex dashboard workflows.",
      "Built reusable interface patterns that improved delivery consistency.",
      "Partnered with engineering and product teams on measurable UX outcomes.",
    ],
    missing: ["Portfolio metrics", "Leadership scope", "Accessibility details"],
    improvements: [
      "Add quantified impact for each flagship case study.",
      "Clarify team size, decision ownership, and shipped outcomes.",
    ],
  },
  code: {
    suggestedTitle: "Frontend Lead",
    summary:
      "CV reads as a senior frontend profile with strong React delivery, architecture awareness, and practical mentoring signals.",
    strengths: ["React architecture", "TypeScript", "Technical leadership"],
    highlights: [
      "Owned reusable UI architecture across production product surfaces.",
      "Improved component reliability and delivery speed through shared patterns.",
      "Supported engineers through reviews, pairing, and technical direction.",
    ],
    missing: ["Performance metrics", "System ownership", "Release impact"],
    improvements: [
      "Show before-and-after engineering outcomes for architecture work.",
      "Name the scope of systems, users, or teams influenced.",
    ],
  },
  growth: {
    suggestedTitle: "Growth Lead",
    summary:
      "CV suggests a metrics-oriented growth profile with experience across acquisition, retention, and experiment-driven product iteration.",
    strengths: ["Experimentation", "Lifecycle strategy", "Retention analysis"],
    highlights: [
      "Mapped funnel issues into practical growth experiments.",
      "Translated user behavior data into lifecycle improvements.",
      "Balanced acquisition motion with activation and retention signals.",
    ],
    missing: ["Experiment volume", "Revenue impact", "Channel mix"],
    improvements: [
      "Add concrete lift percentages for key experiments.",
      "Separate acquisition, activation, and retention achievements.",
    ],
  },
};

export default function PersonaBuildReviewModal({
  profile,
  onClose,
  onBack,
  onSave,
}: PersonaBuildReviewModalProps) {
  const content = profile ? reviewContent[profile.icon] : null;

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/12 px-4 py-5 backdrop-blur-[12px] transition-opacity duration-300 sm:px-6 ${
        profile
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
      aria-hidden={!profile}
    >
      <section
        className={`relative flex max-h-[90vh] w-full max-w-[920px] flex-col overflow-hidden rounded-[8px] border border-white/65 bg-gradient-to-br from-white/78 via-white/62 to-slate-100/48 shadow-[0_34px_80px_rgba(15,23,42,0.22),0_1px_0_rgba(255,255,255,0.85)_inset] ring-1 ring-slate-900/5 backdrop-blur-[64px] backdrop-saturate-150 transition-transform duration-300 ${
          profile ? "translate-y-0 scale-100" : "translate-y-3 scale-95"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {profile && content ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-[4px] border border-white/70 bg-white/55 text-[23px] font-light leading-none text-[#4b4b4d] shadow-[0_10px_22px_rgba(15,23,42,0.10),0_1px_0_rgba(255,255,255,0.9)_inset] backdrop-blur-2xl transition hover:bg-white/75 hover:text-black"
              aria-label="Close profile review"
            >
              &times;
            </button>

            <header className="border-t border-white/90 bg-white/24 px-6 pb-5 pt-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] sm:px-8">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#4b4b4d]">
                CV / Profile Review
              </p>
              <div className="mt-4 flex flex-col gap-4 pr-12 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-[30px] font-semibold leading-tight tracking-[-0.04em] text-black">
                    {profile.title}
                  </h2>
                  <p className="mt-2 max-w-[600px] text-[15px] leading-6 text-[#4b4b4d]">
                    Review the generated profile direction before saving.
                  </p>
                </div>
                <StatusBadge
                  status={profile.status}
                  tone={profile.statusTone}
                  variant="tag"
                />
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 [scrollbar-color:#c7c9cc_transparent] [scrollbar-width:thin] sm:px-8">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                <section className="rounded-[5px] border border-white/70 bg-white/42 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                    Analyzed CV Summary
                  </p>
                  <p className="mt-3 text-[15px] leading-6 text-[#273142]">
                    {content.summary}
                  </p>
                </section>

                <section className="rounded-[5px] border border-white/70 bg-white/42 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                    Suggested Title
                  </p>
                  <p className="mt-3 text-[22px] font-semibold leading-tight tracking-[-0.035em] text-black">
                    {content.suggestedTitle}
                  </p>
                </section>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <section className="rounded-[5px] border border-white/70 bg-white/42 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                    Strengths
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {content.strengths.map((strength) => (
                      <span
                        key={strength}
                        className="rounded-[3px] border border-white/70 bg-white/50 px-3 py-1.5 text-[11px] font-semibold text-[#3d4655] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="rounded-[5px] border border-white/70 bg-white/42 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                    Missing Sections
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {content.missing.map((item) => (
                      <span
                        key={item}
                        className="rounded-[3px] border border-[#d7dbe0] bg-white/36 px-3 py-1.5 text-[11px] font-semibold text-[#596273] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <section className="rounded-[5px] border border-white/70 bg-white/42 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                    Experience Highlights
                  </p>
                  <div className="relative mt-5 space-y-4 pl-7">
                    <div className="absolute bottom-2 left-[4px] top-2 w-px bg-[#d7dbe0]" />
                    {content.highlights.map((highlight, index) => (
                      <div key={highlight} className="relative">
                        <span
                          className={`absolute -left-[28px] top-1.5 flex h-3 w-3 rounded-full border-2 border-white shadow-sm ${
                            index === 0 ? "bg-black" : "bg-[#c7c9cc]"
                          }`}
                        />
                        <p className="text-[14px] leading-5 text-[#273142]">
                          {highlight}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[5px] border border-white/70 bg-white/42 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                    Profile Improvements
                  </p>
                  <div className="mt-4 space-y-3">
                    {content.improvements.map((improvement) => (
                      <div
                        key={improvement}
                        className="border border-white/70 bg-white/44 px-4 py-3 text-[14px] leading-5 text-[#273142] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
                      >
                        {improvement}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <footer className="grid shrink-0 grid-cols-2 gap-4 border-t border-white/65 bg-white/58 px-6 py-4 shadow-[0_-16px_32px_rgba(15,23,42,0.07),0_1px_0_rgba(255,255,255,0.85)_inset] backdrop-blur-2xl sm:flex sm:justify-end sm:px-8">
              <button
                type="button"
                onClick={onBack}
                className="h-11 border border-white/75 bg-white/45 px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#222426] shadow-[0_8px_18px_rgba(15,23,42,0.07),0_1px_0_rgba(255,255,255,0.9)_inset] transition hover:bg-white/70 sm:min-w-[132px]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={onSave}
                className="h-11 rounded-[2px] bg-black px-8 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition hover:bg-[#111111] sm:min-w-[172px]"
              >
                Save Profile
              </button>
            </footer>
          </>
        ) : null}
      </section>
    </div>
  );
}
