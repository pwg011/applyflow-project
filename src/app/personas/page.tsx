"use client";

import { useMemo, useState } from "react";
import ApplyShell from "@/components/applyflow/ApplyShell";
import PageHeader from "@/components/applyflow/PageHeader";
import PersonaBuildReviewModal from "@/components/PersonaBuildReviewModal";
import PersonaDetailsModal from "@/components/PersonaDetailsModal";
import NewTemplateCard from "@/components/profiles/NewTemplateCard";
import ProfileCard from "@/components/profiles/ProfileCard";
import { profiles, type ApplyFlowProfile } from "@/data/applyflow";

const profileTemplates = [
  {
    title: "Product Designer",
    subtitle: "Portfolio-forward profile for product and UX roles",
    initials: "PD",
    details: ["Case studies", "Design systems", "Research"],
    prompts: "9 guided portfolio and impact prompts",
  },
  {
    title: "Frontend Lead",
    subtitle: "Technical leadership profile for UI engineering roles",
    initials: "FL",
    details: ["React", "Architecture", "Mentorship"],
    prompts: "10 engineering scope and leadership prompts",
  },
  {
    title: "Growth Lead",
    subtitle: "Metrics-driven profile for lifecycle and growth teams",
    initials: "GL",
    details: ["Experimentation", "Funnels", "Retention"],
    prompts: "8 growth strategy and outcomes prompts",
  },
  {
    title: "Executive Profile",
    subtitle: "Senior narrative for director, VP, and C-suite paths",
    initials: "EP",
    details: ["Strategy", "Operations", "Transformation"],
    prompts: "12 executive narrative and impact prompts",
  },
];

function ProfilesEmptyState({
  onCreate,
  onTemplate,
}: {
  onCreate: () => void;
  onTemplate: () => void;
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-[#cfd2d6] bg-white/35 px-6 py-10 text-center shadow-[0_12px_26px_rgba(0,0,0,0.025),inset_0_1px_0_rgba(255,255,255,0.68)] xl:col-span-4">
      <span className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-[#d7d9dc] bg-[#eef0f3]/80 text-[24px] font-light text-[#2b2d30] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_16px_rgba(0,0,0,0.04)]">
        +
      </span>
      <h3 className="mt-4 text-[18px] font-semibold tracking-[-0.025em] text-black">
        No profiles yet
      </h3>
      <p className="mt-2 max-w-[400px] text-[14px] leading-6 text-[#4b4b4d]">
        Create a reusable professional profile or start from a structured
        template baseline.
      </p>
      <div className="mt-5 grid w-full max-w-[360px] grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onTemplate}
          className="h-10 border border-white/75 bg-white/45 px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#222426] shadow-[0_8px_18px_rgba(15,23,42,0.07),0_1px_0_rgba(255,255,255,0.9)_inset] transition hover:bg-white/70"
        >
          New Template
        </button>
        <button
          type="button"
          onClick={onCreate}
          className="h-10 rounded-[2px] bg-black px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition hover:bg-[#111111]"
        >
          Create Profile
        </button>
      </div>
    </div>
  );
}

export default function ProfilesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmptyProfiles, setShowEmptyProfiles] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [selectedTemplateTitle, setSelectedTemplateTitle] = useState(
    profileTemplates[0].title,
  );
  const [selectedDetailsProfile, setSelectedDetailsProfile] =
    useState<ApplyFlowProfile | null>(null);
  const [selectedReviewProfile, setSelectedReviewProfile] =
    useState<ApplyFlowProfile | null>(null);
  const [activeProfileTitle, setActiveProfileTitle] = useState<string | null>(
    null,
  );

  const filteredProfiles = useMemo(() => {
    if (showEmptyProfiles) {
      return [];
    }

    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return profiles;
    }

    return profiles.filter(
      (profile) =>
        profile.title.toLowerCase().includes(query) ||
        profile.description.toLowerCase().includes(query),
    );
  }, [searchQuery, showEmptyProfiles]);

  function openCreateProfile() {
    setActiveProfileTitle(null);
    setIsCreateOpen(true);
  }

  function openProfile(profileTitle: string) {
    setActiveProfileTitle(profileTitle);
    setIsCreateOpen(true);
  }

  function openProfileDetails(profile: ApplyFlowProfile) {
    setSelectedDetailsProfile(profile);
  }

  function editProfile(profile: ApplyFlowProfile) {
    setSelectedDetailsProfile(null);
    setSelectedReviewProfile(null);
    openProfile(profile.title);
  }

  function openBuildReview(profile: ApplyFlowProfile) {
    setSelectedDetailsProfile(null);
    setSelectedReviewProfile(profile);
  }

  function backToDetailsFromReview() {
    setSelectedDetailsProfile(selectedReviewProfile);
    setSelectedReviewProfile(null);
  }

  function openTemplateSelection() {
    setSelectedTemplateTitle(profileTemplates[0].title);
    setIsTemplateOpen(true);
  }

  function useTemplate() {
    setActiveProfileTitle(selectedTemplateTitle);
    setIsTemplateOpen(false);
    setIsCreateOpen(true);
  }

  return (
    <ApplyShell
      activeNav="profiles"
      topBarSearchPlaceholder="Search profiles..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      userInitials="PA"
    >
      <div className="min-h-[calc(100vh-63px)] px-5 pb-0 pt-8 sm:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <section className="mx-auto w-full max-w-[3200px]">
          <PageHeader
            title="Profiles"
            subtitle="Manage reusable professional profiles"
            actionLabel="Create Profile"
            actionIcon={
              <span className="text-[19px] font-light leading-none">+</span>
            }
            onActionClick={openCreateProfile}
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowEmptyProfiles(false)}
              className={`h-9 border px-4 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
                !showEmptyProfiles
                  ? "border-black bg-black text-white"
                  : "border-white/70 bg-white/40 text-[#222426] hover:bg-white/65"
              }`}
            >
              Default
            </button>
            <button
              type="button"
              onClick={() => setShowEmptyProfiles(true)}
              className={`h-9 border px-4 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
                showEmptyProfiles
                  ? "border-black bg-black text-white"
                  : "border-white/70 bg-white/40 text-[#222426] hover:bg-white/65"
              }`}
            >
              No Profiles
            </button>
          </div>

          <div className="mt-8 grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-4">
            {filteredProfiles.length > 0 ? (
              <>
                {filteredProfiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    onView={() => openProfileDetails(profile)}
                    onEdit={() => editProfile(profile)}
                  />
                ))}

                <NewTemplateCard onClick={openTemplateSelection} />
              </>
            ) : (
              <ProfilesEmptyState
                onCreate={openCreateProfile}
                onTemplate={openTemplateSelection}
              />
            )}
          </div>
        </section>

        <footer className="mx-auto mt-20 flex w-full max-w-[3200px] flex-col gap-6 border-t border-[#e4e6e9] py-8 text-[11px] text-[#4b4b4d] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 ApplyFlow. All rights reserved.</p>
          <div className="flex gap-7">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </footer>
      </div>

      <PersonaDetailsModal
        profile={selectedDetailsProfile}
        onClose={() => setSelectedDetailsProfile(null)}
        onEdit={editProfile}
        onReview={openBuildReview}
      />

      <PersonaBuildReviewModal
        profile={selectedReviewProfile}
        onClose={() => setSelectedReviewProfile(null)}
        onBack={backToDetailsFromReview}
        onSave={() => setSelectedReviewProfile(null)}
      />

      {isTemplateOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/12 px-4 py-5 backdrop-blur-[12px] sm:px-6"
          onClick={() => setIsTemplateOpen(false)}
        >
          <section
            className="relative w-full max-w-[760px] overflow-hidden rounded-[8px] border border-white/65 bg-gradient-to-br from-white/78 via-white/62 to-slate-100/48 shadow-[0_34px_80px_rgba(15,23,42,0.22),0_1px_0_rgba(255,255,255,0.85)_inset] ring-1 ring-slate-900/5 backdrop-blur-[64px] backdrop-saturate-150"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsTemplateOpen(false)}
              className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-[4px] border border-white/70 bg-white/55 text-[23px] font-light leading-none text-[#4b4b4d] shadow-[0_10px_22px_rgba(15,23,42,0.10),0_1px_0_rgba(255,255,255,0.9)_inset] backdrop-blur-2xl transition hover:bg-white/75 hover:text-black"
              aria-label="Close template selection"
            >
              &times;
            </button>

            <div className="border-t border-white/90 bg-white/24 px-6 pb-5 pt-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] sm:px-8">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#4b4b4d]">
                Profile Template
              </p>
              <h2 className="mt-3 max-w-[520px] text-[30px] font-semibold leading-tight tracking-[-0.035em] text-black">
                Start from an industry baseline
              </h2>
              <p className="mt-2 max-w-[520px] text-[15px] leading-6 text-[#4b4b4d]">
                Pick a focused starting point for a reusable professional
                profile.
              </p>
            </div>

            <div className="max-h-[58vh] overflow-y-auto px-6 py-5 [scrollbar-color:#c7c9cc_transparent] [scrollbar-width:thin] sm:px-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {profileTemplates.map((template) => {
                  const isSelected = template.title === selectedTemplateTitle;

                  return (
                    <button
                      key={template.title}
                      type="button"
                      onClick={() => setSelectedTemplateTitle(template.title)}
                      className={`group min-h-[214px] rounded-[6px] border p-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl transition ${
                        isSelected
                          ? "border-black/45 bg-white/68 ring-2 ring-black/8"
                          : "border-white/70 bg-white/42 hover:border-white hover:bg-white/58"
                      }`}
                      aria-pressed={isSelected}
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] text-[15px] font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.08)] ${
                            isSelected
                              ? "bg-black text-white"
                              : "border border-white/75 bg-white/60 text-black"
                          }`}
                        >
                          {template.initials}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[19px] font-semibold tracking-[-0.03em] text-black">
                            {template.title}
                          </span>
                          <span className="mt-1 block text-[13px] leading-5 text-[#596273]">
                            {template.subtitle}
                          </span>
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {template.details.map((detail) => (
                          <span
                            key={detail}
                            className="rounded-[3px] border border-white/70 bg-white/50 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#3d4655] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
                          >
                            {detail}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 border-t border-white/65 pt-4">
                        <p className="text-[12px] leading-5 text-[#4b4b4d]">
                          {template.prompts}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <footer className="grid grid-cols-2 gap-4 border-t border-white/65 bg-white/58 px-6 py-4 shadow-[0_-16px_32px_rgba(15,23,42,0.07),0_1px_0_rgba(255,255,255,0.85)_inset] backdrop-blur-2xl sm:flex sm:items-center sm:justify-between sm:px-8">
              <button
                type="button"
                onClick={() => setIsTemplateOpen(false)}
                className="h-11 border border-white/75 bg-white/45 px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#222426] shadow-[0_8px_18px_rgba(15,23,42,0.07),0_1px_0_rgba(255,255,255,0.9)_inset] transition hover:bg-white/70 sm:min-w-[132px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={useTemplate}
                className="h-11 rounded-[2px] bg-black px-8 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition hover:bg-[#111111] sm:min-w-[172px]"
              >
                Use Template
              </button>
            </footer>
          </section>
        </div>
      ) : null}

      {isCreateOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/12 px-4 py-5 backdrop-blur-[12px] sm:px-6"
          onClick={() => setIsCreateOpen(false)}
        >
          <section
            className="relative flex max-h-[84vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[8px] border border-white/80 border-b-slate-300/75 bg-gradient-to-br from-white/86 via-white/68 to-slate-100/56 shadow-[0_38px_90px_rgba(15,23,42,0.26),0_14px_34px_rgba(15,23,42,0.10),0_1px_0_rgba(255,255,255,0.9)_inset] ring-1 ring-slate-900/10 backdrop-blur-[72px] backdrop-saturate-150"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-[4px] border border-white/70 bg-white/55 text-[23px] font-light leading-none text-[#4b4b4d] shadow-[0_10px_22px_rgba(15,23,42,0.10),0_1px_0_rgba(255,255,255,0.9)_inset] backdrop-blur-2xl transition hover:bg-white/75 hover:text-black"
              aria-label="Close profile dialog"
            >
              &times;
            </button>

            <div className="flex min-h-0 flex-1">
              <aside className="hidden w-[210px] shrink-0 flex-col justify-between border-r border-white/70 bg-white/36 px-4 py-4 text-left shadow-[1px_0_0_rgba(15,23,42,0.06)] backdrop-blur-2xl md:flex">
                <div className="rounded-[6px] border border-white/75 bg-white/54 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.08),0_1px_0_rgba(255,255,255,0.86)_inset]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-[#d7d9dc] bg-[#e9ecef] text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_8px_16px_rgba(0,0,0,0.04)]">
                    <span className="text-[18px] font-medium tracking-[-0.03em] text-black">
                      JD
                    </span>
                  </div>

                  <div className="mt-4">
                    <h2 className="text-[17px] font-semibold leading-tight tracking-[-0.025em] text-[#191c1e]">
                      Identity Preview
                    </h2>
                    <p className="mt-2 inline-flex rounded-[2px] border border-white/70 bg-white/55 px-2.5 py-1 text-[8px] font-semibold uppercase leading-none tracking-[0.12em] text-[#4a4d50] shadow-[0_1px_0_rgba(255,255,255,0.85)_inset]">
                      {activeProfileTitle ? activeProfileTitle : "Executive Level"}
                    </p>
                  </div>

                  <div className="mt-6 w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#4b4b4d]">
                        Profile Strength
                      </span>
                      <span className="text-[13px] font-semibold text-[#191c1e]">
                        35%
                      </span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-[2px] bg-white/60 shadow-[inset_0_1px_2px_rgba(15,23,42,0.10)]">
                      <div className="h-full w-[35%] bg-black" />
                    </div>
                    <p className="mt-3 text-[11px] leading-snug text-[#5d6064]">
                      Complete &quot;Executive Narrative&quot; to reach Silver tier
                      status.
                    </p>
                  </div>
                </div>

                <div className="rounded-[5px] border border-white/70 bg-white/46 p-3 shadow-[0_12px_24px_rgba(15,23,42,0.06),0_1px_0_rgba(255,255,255,0.8)_inset] backdrop-blur-xl">
                  <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-[4px] border border-white/70 bg-white/55 text-[12px] font-semibold text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                    OK
                  </span>
                  <p className="text-[13px] font-semibold text-[#191c1e]">
                    Smart Validation
                  </p>
                  <p className="mt-1 text-[11px] leading-tight text-[#5d6064]">
                    Identity verified via LinkedIn
                  </p>
                </div>
              </aside>

              <div className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-br from-white/48 via-white/34 to-slate-100/22 px-5 py-4 backdrop-blur-xl [scrollbar-color:#c7c9cc_transparent] [scrollbar-width:thin] sm:px-6">
                <div className="max-w-[500px] space-y-5">
                  <div className="space-y-1 pr-10 md:hidden">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#4b4b4d]">
                      Identity Preview
                    </p>
                    <h2 className="text-[22px] font-medium tracking-[-0.02em] text-black">
                      {activeProfileTitle ? activeProfileTitle : "Create Profile"}
                    </h2>
                  </div>

                  <section className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-[4px] border border-white/70 bg-white/58 text-[11px] font-semibold text-[#4b4b4d] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_8px_16px_rgba(15,23,42,0.05)] backdrop-blur-xl"
                        aria-hidden="true"
                      >
                        1
                      </span>
                      <h3 className="text-[17px] font-semibold leading-tight tracking-[-0.025em] text-[#191c1e]">
                        Personal Foundation
                      </h3>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="block text-[12px] font-medium text-[#4b4b4d]">
                          Full Legal Name
                        </label>
                        <input
                          className="h-10 w-full rounded-[4px] border border-[#d8dbe0] bg-white/72 px-3.5 text-[14px] text-black shadow-[inset_0_1px_3px_rgba(15,23,42,0.08),0_1px_0_rgba(255,255,255,0.8)] outline-none backdrop-blur-xl transition placeholder:text-[#8e939a] focus:border-white focus:bg-white/84 focus:ring-2 focus:ring-black/5"
                          placeholder="Johnathan Doe"
                          type="text"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[12px] font-medium text-[#4b4b4d]">
                          Current Title
                        </label>
                        <input
                          className="h-10 w-full rounded-[4px] border border-[#d8dbe0] bg-white/72 px-3.5 text-[14px] text-black shadow-[inset_0_1px_3px_rgba(15,23,42,0.08),0_1px_0_rgba(255,255,255,0.8)] outline-none backdrop-blur-xl transition placeholder:text-[#8e939a] focus:border-white focus:bg-white/84 focus:ring-2 focus:ring-black/5"
                          placeholder="Chief Strategy Officer"
                          type="text"
                        />
                      </div>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-[4px] border border-white/70 bg-white/58 text-[11px] font-semibold text-[#4b4b4d] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_8px_16px_rgba(15,23,42,0.05)] backdrop-blur-xl"
                        aria-hidden="true"
                      >
                        2
                      </span>
                      <h3 className="text-[17px] font-semibold leading-tight tracking-[-0.025em] text-[#191c1e]">
                        Strategic Goal
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <select className="h-10 w-full appearance-none rounded-[4px] border border-[#d8dbe0] bg-white/72 px-3.5 text-[14px] text-black shadow-[inset_0_1px_3px_rgba(15,23,42,0.08),0_1px_0_rgba(255,255,255,0.8)] outline-none backdrop-blur-xl transition focus:border-white focus:bg-white/84 focus:ring-2 focus:ring-black/5">
                          <option>Immediate Executive Transition</option>
                          <option>Strategic Board Advisory</option>
                          <option>Startup Scalability Guidance</option>
                        </select>
                        <span
                          className="pointer-events-none absolute right-3.5 top-2 text-[16px] text-[#4b4b4d]"
                          aria-hidden="true"
                        >
                          v
                        </span>
                      </div>
                      <p className="text-[12px] leading-5 text-[#76777b]">
                        This helps us tailor your opportunities to your specific
                        career trajectory.
                      </p>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-[4px] border border-white/70 bg-white/58 text-[11px] font-semibold text-[#4b4b4d] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_8px_16px_rgba(15,23,42,0.05)] backdrop-blur-xl"
                        aria-hidden="true"
                      >
                        3
                      </span>
                      <h3 className="text-[17px] font-semibold leading-tight tracking-[-0.025em] text-[#191c1e]">
                        Core Competencies
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {["Crisis Management", "M&A Strategy", "Public Relations"].map(
                        (competency) => (
                          <button
                            key={competency}
                            type="button"
                            className="rounded-[3px] border border-[#d8dbe0] bg-white/58 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#273142] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition hover:bg-white/72"
                          >
                            {competency}
                          </button>
                        ),
                      )}
                      <button
                        type="button"
                        className="rounded-[3px] border border-dashed border-[#cfd2d6] bg-white/38 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-black shadow-[0_1px_0_rgba(255,255,255,0.85)_inset] backdrop-blur-xl transition hover:bg-white/65"
                      >
                        + Add Competency
                      </button>
                    </div>
                  </section>

                  <section className="space-y-3 pb-1">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-[4px] border border-white/70 bg-white/58 text-[11px] font-semibold text-[#4b4b4d] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_8px_16px_rgba(15,23,42,0.05)] backdrop-blur-xl"
                        aria-hidden="true"
                      >
                        4
                      </span>
                      <h3 className="text-[17px] font-semibold leading-tight tracking-[-0.025em] text-[#191c1e]">
                        Executive Narrative
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <textarea
                        className="w-full resize-none rounded-[4px] border border-[#d8dbe0] bg-white/72 p-3.5 text-[14px] text-black shadow-[inset_0_1px_3px_rgba(15,23,42,0.08),0_1px_0_rgba(255,255,255,0.8)] outline-none backdrop-blur-xl transition placeholder:text-[#8e939a] focus:border-white focus:bg-white/84 focus:ring-2 focus:ring-black/5"
                        placeholder="Define your unique leadership philosophy and core value proposition..."
                        rows={4}
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="text-[13px] font-medium text-[#4b4b4d] transition hover:text-black hover:underline"
                        >
                          AI Refine Narrative
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>

            <footer className="flex shrink-0 items-center justify-end border-t border-white/70 bg-white/62 px-5 py-3 shadow-[0_-16px_32px_rgba(15,23,42,0.07),0_1px_0_rgba(255,255,255,0.85)_inset] backdrop-blur-2xl sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="h-[38px] border border-white/75 bg-white/50 px-6 text-[12px] font-semibold text-[#222426] shadow-[0_8px_18px_rgba(15,23,42,0.07),0_1px_0_rgba(255,255,255,0.9)_inset] backdrop-blur-xl transition hover:bg-white/72 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="relative h-[38px] overflow-hidden rounded-[2px] bg-black px-8 text-[12px] font-semibold text-white shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition hover:bg-[#111111] active:scale-95"
                >
                  <span className="absolute inset-x-0 top-0 h-px bg-white/20" />
                  <span className="relative z-10">Create Profile</span>
                </button>
              </div>
            </footer>
          </section>
        </div>
      ) : null}
    </ApplyShell>
  );
}
