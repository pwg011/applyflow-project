"use client";

import ApplyShell from "@/components/applyflow/ApplyShell";
import SurfacePanel from "@/components/applyflow/SurfacePanel";

const skills = [
  "Product Strategy",
  "UX Research",
  "Design Systems",
  "Figma",
  "Fintech Workflows",
  "Stakeholder Facilitation",
];

const suggestions = [
  "Add outcome metrics to the portfolio workflow redesign.",
  "Move design system leadership into the first experience bullet.",
  "Mirror the target role language: systems thinking, research, and product strategy.",
];

const experience = [
  {
    role: "Senior Product Designer",
    company: "Northstar Labs",
    dates: "2022 - Present",
    bullets: [
      "Led redesign of onboarding and portfolio workflows for B2B fintech products.",
      "Built reusable design system patterns adopted across product and engineering teams.",
      "Partnered with PMs and engineers to turn ambiguous requirements into shipped UX improvements.",
    ],
  },
  {
    role: "Product Designer",
    company: "Brightworks",
    dates: "2019 - 2022",
    bullets: [
      "Ran discovery interviews, mapped user journeys, and prototyped SaaS workflow improvements.",
      "Supported dashboard launches with research synthesis, interaction design, and usability testing.",
    ],
  },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
      {children}
    </p>
  );
}

function SmallButton({ children }: { children: string }) {
  return (
    <button
      type="button"
      className="h-9 border border-white/75 bg-white/42 px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#222426] shadow-[0_8px_18px_rgba(15,23,42,0.06),0_1px_0_rgba(255,255,255,0.85)_inset] transition hover:bg-white/70"
    >
      {children}
    </button>
  );
}

function PrimaryAction({ children }: { children: string }) {
  return (
    <button
      type="button"
      className="h-10 rounded-[2px] bg-black px-6 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_10px_22px_rgba(0,0,0,0.16)] transition hover:bg-[#111111]"
    >
      {children}
    </button>
  );
}

function SupportPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <SurfacePanel className="rounded-lg border border-[#e0e2e5] bg-white/62 p-4 shadow-[0_18px_36px_rgba(0,0,0,0.035)]">
      <SectionLabel>{title}</SectionLabel>
      {children}
    </SurfacePanel>
  );
}

export default function ResumeBuilderPage() {
  return (
    <ApplyShell
      activeNav="resume"
      topBarSearchPlaceholder="Search resume assets..."
      userInitials="PA"
    >
      <div className="min-h-[calc(100vh-63px)] px-5 pb-0 pt-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <section className="mx-auto w-full max-w-[1780px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-[22px] font-semibold tracking-[-0.035em] text-black">
                Resume Builder
              </h1>
              <p className="mt-1 max-w-[620px] text-[16px] leading-6 text-[#4b4b4d]">
                Generate a tailored resume from a CV, profile, and target job.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <SmallButton>Save Draft</SmallButton>
              <PrimaryAction>Export Resume</PrimaryAction>
            </div>
          </div>

          <div className="mt-5 grid items-start gap-5 lg:grid-cols-[290px_minmax(540px,1fr)_300px] xl:grid-cols-[310px_minmax(620px,1fr)_320px]">
            <div className="space-y-4">
              <SupportPanel title="Source CV">
                <div className="mt-3 flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-[#d7d9dc] bg-[#e9ecef] text-[15px] font-semibold text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_8px_16px_rgba(0,0,0,0.04)]">
                    CV
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-[16px] font-semibold tracking-[-0.025em] text-black">
                      Priya-Ahmed-CV.pdf
                    </h2>
                    <p className="mt-1 text-[13px] leading-5 text-[#596273]">
                      3 pages extracted. Ready for tailoring.
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <SmallButton>Replace</SmallButton>
                  <SmallButton>Select CV</SmallButton>
                </div>
              </SupportPanel>

              <SupportPanel title="Target Job">
                <h2 className="mt-3 text-[18px] font-semibold tracking-[-0.03em] text-black">
                  Senior Product Designer
                </h2>
                <p className="mt-1 text-[13px] text-[#4b4b4d]">
                  Northstar Labs - Remote - Full-time
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Fintech", "Design Systems", "Research", "Senior IC"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-[3px] border border-white/70 bg-white/50 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#3d4655] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
              </SupportPanel>

              <SupportPanel title="Document Settings">
                <div className="mt-3 space-y-2 text-[13px] text-[#273142]">
                  <div className="flex items-center justify-between border border-white/70 bg-white/42 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
                    <span>Template</span>
                    <span className="font-semibold text-black">Clean A4</span>
                  </div>
                  <div className="flex items-center justify-between border border-white/70 bg-white/42 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
                    <span>Length</span>
                    <span className="font-semibold text-black">1 page</span>
                  </div>
                </div>
              </SupportPanel>
            </div>

            <div className="flex flex-col items-center rounded-lg border border-[#d8dbe0] bg-[#e7eaee]/70 px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_24px_54px_rgba(15,23,42,0.08)]">
              <div className="mb-4 flex h-8 items-center gap-2 border border-[#d4d7dc] bg-white/48 px-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4b4b4d] shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
                <button
                  type="button"
                  disabled
                  aria-label="Previous page"
                  className="flex h-5 w-5 cursor-not-allowed items-center justify-center text-[#9aa1aa]"
                >
                  <span aria-hidden="true">‹</span>
                </button>
                <span className="border-x border-[#d4d7dc] px-3">
                  Page 1 of 1
                </span>
                <button
                  type="button"
                  disabled
                  aria-label="Next page"
                  className="flex h-5 w-5 cursor-not-allowed items-center justify-center text-[#9aa1aa]"
                >
                  <span aria-hidden="true">›</span>
                </button>
              </div>
              <article className="aspect-[210/297] w-full max-w-[690px] bg-white px-12 py-11 text-[#17191c] shadow-[0_28px_70px_rgba(15,23,42,0.20)] ring-1 ring-[#d9dce0]">
                <header className="border-b border-[#d8dbe0] pb-5">
                  <h2 className="text-[34px] font-semibold leading-none tracking-[-0.04em] text-black">
                    Priya Ahmed
                  </h2>
                  <p className="mt-2 text-[16px] font-medium text-[#33373d]">
                    Senior Product Designer
                  </p>
                  <p className="mt-3 text-[11px] leading-5 text-[#596273]">
                    priya.ahmed@example.com | +44 7700 900123 | London, UK |
                    linkedin.com/in/priya-ahmed | priya.design
                  </p>
                </header>

                <section className="mt-6">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-black">
                    Summary
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-6 text-[#2d333b]">
                    Senior product designer with strong fintech dashboard
                    experience, research-led delivery, and design system
                    ownership across complex SaaS workflows. Trusted partner to
                    product and engineering teams, translating ambiguous product
                    needs into structured, measurable interface improvements.
                  </p>
                </section>

                <section className="mt-5">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-black">
                    Skills
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[12px] leading-5 text-[#2d333b]">
                    {skills.map((skill, index) => (
                      <span key={skill}>
                        {skill}
                        {index < skills.length - 1 ? " /" : ""}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="mt-5">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-black">
                    Experience
                  </h3>
                  <div className="mt-3 space-y-4">
                    {experience.map((item) => (
                      <div key={`${item.company}-${item.role}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[13px] font-semibold text-black">
                              {item.role}
                            </p>
                            <p className="mt-0.5 text-[12px] font-medium text-[#4b4b4d]">
                              {item.company}
                            </p>
                          </div>
                          <p className="shrink-0 text-[11px] font-medium text-[#596273]">
                            {item.dates}
                          </p>
                        </div>
                        <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[12px] leading-5 text-[#2d333b]">
                          {item.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mt-5">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-black">
                    Education
                  </h3>
                  <div className="mt-2 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[13px] font-semibold text-black">
                        BA Interaction Design
                      </p>
                      <p className="mt-0.5 text-[12px] text-[#4b4b4d]">
                        University of the Arts London
                      </p>
                    </div>
                    <p className="shrink-0 text-[11px] font-medium text-[#596273]">
                      2015 - 2018
                    </p>
                  </div>
                </section>
              </article>
            </div>

            <div className="space-y-4">
              <SupportPanel title="AI Suggestions">
                <div className="mt-3 space-y-2.5">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion}
                      className="border border-white/70 bg-white/42 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]"
                    >
                      <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-black">
                        {`0${index + 1}`}
                      </p>
                      <p className="mt-1 text-[12px] leading-5 text-[#596273]">
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </SupportPanel>

              <SupportPanel title="Analysis">
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    ["94%", "Fit"],
                    ["12", "Keywords"],
                    ["3", "Gaps"],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="border border-white/70 bg-white/42 px-2 py-2.5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]"
                    >
                      <p className="text-[18px] font-semibold leading-none text-black">
                        {value}
                      </p>
                      <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#4b4b4d]">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[12px] leading-5 text-[#596273]">
                  Strong match. Tighten seniority signals before export.
                </p>
              </SupportPanel>

              <SupportPanel title="Export">
                <h2 className="mt-3 text-[18px] font-semibold tracking-[-0.03em] text-black">
                  Ready to download
                </h2>
                <p className="mt-1 text-[12px] leading-5 text-[#596273]">
                  Static demo export controls for the screenshot flow.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <SmallButton>PDF</SmallButton>
                  <SmallButton>DOCX</SmallButton>
                </div>
                <div className="mt-2">
                  <PrimaryAction>Download</PrimaryAction>
                </div>
              </SupportPanel>
            </div>
          </div>
        </section>

        <footer className="mx-auto mt-10 flex w-full max-w-[1780px] flex-col gap-6 border-t border-[#e4e6e9] py-6 text-[11px] text-[#4b4b4d] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 ApplyFlow. All rights reserved.</p>
          <div className="flex gap-7">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </footer>
      </div>
    </ApplyShell>
  );
}
