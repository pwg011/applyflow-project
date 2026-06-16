"use client";

import { useMemo, useState } from "react";
import ApplyShell from "@/components/applyflow/ApplyShell";
import PageHeader from "@/components/applyflow/PageHeader";
import NewTemplateCard from "@/components/profiles/NewTemplateCard";
import ProfileCard from "@/components/profiles/ProfileCard";
import { profiles } from "@/data/applyflow";

export default function ProfilesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeProfileTitle, setActiveProfileTitle] = useState<string | null>(
    null,
  );

  const filteredProfiles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return profiles;
    }

    return profiles.filter(
      (profile) =>
        profile.title.toLowerCase().includes(query) ||
        profile.description.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  function openCreateProfile() {
    setActiveProfileTitle(null);
    setIsCreateOpen(true);
  }

  function openProfile(profileTitle: string) {
    setActiveProfileTitle(profileTitle);
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
      <div className="min-h-[calc(100vh-63px)] px-5 pb-0 pt-7 sm:px-10 xl:px-12">
        <section className="mx-auto max-w-[928px]">
          <PageHeader
            title="Profiles"
            subtitle="Manage reusable professional profiles"
            actionLabel="Create Profile"
            actionIcon={
              <span className="text-[19px] font-light leading-none">+</span>
            }
            onActionClick={openCreateProfile}
          />

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onView={() => openProfile(profile.title)}
                onEdit={() => openProfile(profile.title)}
              />
            ))}

            <NewTemplateCard onClick={openCreateProfile} />
          </div>
        </section>

        <footer className="mx-auto mt-20 flex max-w-[928px] flex-col gap-6 border-t border-[#e4e6e9] py-8 text-[11px] text-[#4b4b4d] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 ApplyFlow. All rights reserved.</p>
          <div className="flex gap-7">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </footer>
      </div>

      {isCreateOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/12 px-4 py-5 backdrop-blur-[12px] sm:px-6"
          onClick={() => setIsCreateOpen(false)}
        >
          <section
            className="relative flex max-h-[86vh] w-full max-w-[860px] flex-col overflow-hidden rounded-lg border border-white/65 bg-gradient-to-br from-white/78 via-white/62 to-slate-100/48 shadow-[0_34px_80px_rgba(15,23,42,0.22),0_1px_0_rgba(255,255,255,0.85)_inset] ring-1 ring-slate-900/5 backdrop-blur-[64px] backdrop-saturate-150"
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
              <aside className="hidden w-[226px] shrink-0 flex-col justify-between border-r border-white/60 bg-gradient-to-b from-white/58 via-white/40 to-white/28 px-5 py-5 text-left shadow-[1px_0_0_rgba(15,23,42,0.05)] backdrop-blur-2xl md:flex">
                <div className="w-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[4px] border border-white/70 bg-white/55 text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_22px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                    <span className="text-[20px] font-medium tracking-[-0.03em] text-black">
                      JD
                    </span>
                  </div>

                  <div className="mt-4">
                    <h2 className="text-[19px] font-medium leading-tight tracking-[-0.025em] text-[#191c1e]">
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

                <div className="rounded-[4px] border border-white/65 bg-white/45 p-4 shadow-[0_16px_30px_rgba(15,23,42,0.08),0_1px_0_rgba(255,255,255,0.8)_inset] backdrop-blur-xl">
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

              <div className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-br from-white/50 via-white/36 to-slate-100/24 px-6 py-5 pr-5 backdrop-blur-xl [scrollbar-color:#c7c9cc_transparent] [scrollbar-width:thin] sm:px-7 md:px-8">
                <div className="max-w-[574px] space-y-6 pr-5">
                  <div className="space-y-1 pr-10 md:hidden">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#4b4b4d]">
                      Identity Preview
                    </p>
                    <h2 className="text-[22px] font-medium tracking-[-0.02em] text-black">
                      {activeProfileTitle ? activeProfileTitle : "Create Profile"}
                    </h2>
                  </div>

                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-white/70 bg-white/58 text-[12px] font-semibold text-[#4b4b4d] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_8px_16px_rgba(15,23,42,0.05)] backdrop-blur-xl"
                        aria-hidden="true"
                      >
                        1
                      </span>
                      <h3 className="text-[20px] font-medium leading-tight tracking-[-0.025em] text-[#191c1e]">
                        Personal Foundation
                      </h3>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="block text-[12px] font-medium text-[#4b4b4d]">
                          Full Legal Name
                        </label>
                        <input
                          className="h-10 w-full rounded-[4px] border border-white/70 bg-white/68 px-3.5 text-[14px] text-black shadow-[inset_0_1px_2px_rgba(15,23,42,0.06),0_1px_0_rgba(255,255,255,0.8)] outline-none backdrop-blur-xl transition placeholder:text-[#8e939a] focus:border-white focus:bg-white/78 focus:ring-2 focus:ring-black/5"
                          placeholder="Johnathan Doe"
                          type="text"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[12px] font-medium text-[#4b4b4d]">
                          Current Title
                        </label>
                        <input
                          className="h-10 w-full rounded-[4px] border border-white/70 bg-white/68 px-3.5 text-[14px] text-black shadow-[inset_0_1px_2px_rgba(15,23,42,0.06),0_1px_0_rgba(255,255,255,0.8)] outline-none backdrop-blur-xl transition placeholder:text-[#8e939a] focus:border-white focus:bg-white/78 focus:ring-2 focus:ring-black/5"
                          placeholder="Chief Strategy Officer"
                          type="text"
                        />
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-white/70 bg-white/58 text-[12px] font-semibold text-[#4b4b4d] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_8px_16px_rgba(15,23,42,0.05)] backdrop-blur-xl"
                        aria-hidden="true"
                      >
                        2
                      </span>
                      <h3 className="text-[20px] font-medium leading-tight tracking-[-0.025em] text-[#191c1e]">
                        Strategic Goal
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <select className="h-10 w-full appearance-none rounded-[4px] border border-white/70 bg-white/68 px-3.5 text-[14px] text-black shadow-[inset_0_1px_2px_rgba(15,23,42,0.06),0_1px_0_rgba(255,255,255,0.8)] outline-none backdrop-blur-xl transition focus:border-white focus:bg-white/78 focus:ring-2 focus:ring-black/5">
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

                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-white/70 bg-white/58 text-[12px] font-semibold text-[#4b4b4d] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_8px_16px_rgba(15,23,42,0.05)] backdrop-blur-xl"
                        aria-hidden="true"
                      >
                        3
                      </span>
                      <h3 className="text-[20px] font-medium leading-tight tracking-[-0.025em] text-[#191c1e]">
                        Core Competencies
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {["Crisis Management", "M&A Strategy", "Public Relations"].map(
                        (competency) => (
                          <button
                            key={competency}
                            type="button"
                            className="rounded-[4px] border border-black bg-black px-3.5 py-2 text-[12px] font-semibold text-white shadow-[0_8px_18px_rgba(0,0,0,0.14)] transition hover:bg-[#111111]"
                          >
                            {competency}
                          </button>
                        ),
                      )}
                      <button
                        type="button"
                        className="rounded-[4px] border border-dashed border-white/75 bg-white/45 px-3.5 py-2 text-[12px] font-semibold text-black shadow-[0_1px_0_rgba(255,255,255,0.85)_inset] backdrop-blur-xl transition hover:bg-white/65"
                      >
                        + Add Competency
                      </button>
                    </div>
                  </section>

                  <section className="space-y-4 pb-2">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-white/70 bg-white/58 text-[12px] font-semibold text-[#4b4b4d] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_8px_16px_rgba(15,23,42,0.05)] backdrop-blur-xl"
                        aria-hidden="true"
                      >
                        4
                      </span>
                      <h3 className="text-[20px] font-medium leading-tight tracking-[-0.025em] text-[#191c1e]">
                        Executive Narrative
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <textarea
                        className="w-full resize-none rounded-[4px] border border-white/70 bg-white/68 p-3.5 text-[14px] text-black shadow-[inset_0_1px_2px_rgba(15,23,42,0.06),0_1px_0_rgba(255,255,255,0.8)] outline-none backdrop-blur-xl transition placeholder:text-[#8e939a] focus:border-white focus:bg-white/78 focus:ring-2 focus:ring-black/5"
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

            <footer className="flex shrink-0 items-center justify-between border-t border-white/65 bg-white/58 px-6 py-3 shadow-[0_-16px_32px_rgba(15,23,42,0.07),0_1px_0_rgba(255,255,255,0.85)_inset] backdrop-blur-2xl sm:px-7 md:px-8">
              <div className="hidden items-center gap-2 text-[#4b4b4d] sm:flex">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                  Secure
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                  End-to-End Encrypted
                </span>
              </div>

              <div className="ml-auto flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="h-[38px] rounded-[4px] border border-white/75 bg-white/50 px-6 text-[13px] font-semibold text-[#222426] shadow-[0_8px_18px_rgba(15,23,42,0.07),0_1px_0_rgba(255,255,255,0.9)_inset] backdrop-blur-xl transition hover:bg-white/72 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="relative h-[38px] overflow-hidden rounded-[4px] bg-black px-8 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition hover:bg-[#111111] active:scale-95"
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
