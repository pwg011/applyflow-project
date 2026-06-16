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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#f7f9fc]/80 px-4 py-5 backdrop-blur-md sm:px-6"
          onClick={() => setIsCreateOpen(false)}
        >
          <section
            className="relative flex max-h-[86vh] w-full max-w-[920px] flex-col overflow-hidden rounded-xl border border-white/70 bg-[#f7f9fc]/90 shadow-[0_30px_70px_rgba(15,23,42,0.14)] ring-1 ring-black/5 backdrop-blur-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-white/70 text-[24px] font-light leading-none text-[#4b4b4d] shadow-sm transition hover:bg-white hover:text-black"
              aria-label="Close profile dialog"
            >
              &times;
            </button>

            <div className="flex min-h-0 flex-1">
              <aside className="hidden w-[244px] shrink-0 flex-col justify-between border-r border-white/70 bg-white/35 px-6 py-6 text-center md:flex">
                <div className="w-full space-y-3">
                  <div className="relative mx-auto h-20 w-20">
                    <div className="absolute inset-0 rounded-full bg-black/5" />
                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-white/80 bg-[#eceef1] shadow-lg">
                      <span className="text-[30px] font-medium tracking-[-0.03em] text-black">
                        JD
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-[20px] font-medium leading-tight tracking-[-0.02em] text-black">
                      Identity Preview
                    </h2>
                    <p className="text-[10px] font-semibold uppercase leading-none tracking-[0.16em] text-[#4b4b4d]">
                      {activeProfileTitle ? activeProfileTitle : "Executive Level"}
                    </p>
                  </div>

                  <div className="w-full space-y-3 pt-4">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[12px] font-semibold text-[#4b4b4d]">
                        Profile Strength
                      </span>
                      <span className="text-[12px] font-semibold text-black">
                        35%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e0e3e6]">
                      <div className="h-full w-[35%] bg-[#191c1e]" />
                    </div>
                    <p className="text-[11px] italic leading-snug text-[#5d6064]">
                      Complete &quot;Executive Narrative&quot; to reach Silver tier
                      status.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-white/70 bg-white/45 p-4 text-left">
                  <span className="mb-3 flex h-7 w-7 items-center justify-center rounded-full border border-[#c7c9cc] text-[13px] font-semibold text-black">
                    OK
                  </span>
                  <p className="text-[13px] font-semibold text-black">
                    Smart Validation
                  </p>
                  <p className="mt-1 text-[11px] leading-tight text-[#5d6064]">
                    Identity verified via LinkedIn
                  </p>
                </div>
              </aside>

              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 pr-5 [scrollbar-color:#cfd4dc_transparent] [scrollbar-width:thin] sm:px-8 md:px-9">
                <div className="max-w-[620px] space-y-8 pr-5">
                  <div className="space-y-1 pr-10 md:hidden">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#4b4b4d]">
                      Identity Preview
                    </p>
                    <h2 className="text-[22px] font-medium tracking-[-0.02em] text-black">
                      {activeProfileTitle ? activeProfileTitle : "Create Profile"}
                    </h2>
                  </div>

                  <section className="space-y-5">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d5d7da] text-[14px] text-[#4b4b4d]"
                        aria-hidden="true"
                      >
                        1
                      </span>
                      <h3 className="text-[22px] font-medium leading-tight tracking-[-0.02em] text-black">
                        Personal Foundation
                      </h3>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="ml-1 block text-[13px] font-medium text-[#4b4b4d]">
                          Full Legal Name
                        </label>
                        <input
                          className="h-11 w-full rounded-lg border border-[#dfe1e4] bg-white/55 px-4 text-[15px] text-black shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] outline-none transition placeholder:text-[#9b9da1] focus:border-[#adafb2] focus:ring-2 focus:ring-black/5"
                          placeholder="Johnathan Doe"
                          type="text"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="ml-1 block text-[13px] font-medium text-[#4b4b4d]">
                          Current Title
                        </label>
                        <input
                          className="h-11 w-full rounded-lg border border-[#dfe1e4] bg-white/55 px-4 text-[15px] text-black shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] outline-none transition placeholder:text-[#9b9da1] focus:border-[#adafb2] focus:ring-2 focus:ring-black/5"
                          placeholder="Chief Strategy Officer"
                          type="text"
                        />
                      </div>
                    </div>
                  </section>

                  <section className="space-y-5">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d5d7da] text-[14px] text-[#4b4b4d]"
                        aria-hidden="true"
                      >
                        2
                      </span>
                      <h3 className="text-[22px] font-medium leading-tight tracking-[-0.02em] text-black">
                        Strategic Goal
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <select className="h-11 w-full appearance-none rounded-lg border border-[#dfe1e4] bg-white/55 px-4 text-[15px] text-black shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] outline-none transition focus:border-[#adafb2] focus:ring-2 focus:ring-black/5">
                          <option>Immediate Executive Transition</option>
                          <option>Strategic Board Advisory</option>
                          <option>Startup Scalability Guidance</option>
                        </select>
                        <span
                          className="pointer-events-none absolute right-4 top-2.5 text-[16px] text-[#4b4b4d]"
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

                  <section className="space-y-5">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d5d7da] text-[14px] text-[#4b4b4d]"
                        aria-hidden="true"
                      >
                        3
                      </span>
                      <h3 className="text-[22px] font-medium leading-tight tracking-[-0.02em] text-black">
                        Core Competencies
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {["Crisis Management", "M&A Strategy", "Public Relations"].map(
                        (competency) => (
                          <button
                            key={competency}
                            type="button"
                            className="rounded-full border border-white/10 bg-[#0f172a] px-4 py-2 text-[13px] font-medium text-white shadow-md transition hover:bg-black"
                          >
                            {competency}
                          </button>
                        ),
                      )}
                      <button
                        type="button"
                        className="rounded-full border border-dashed border-[#adafb2] px-4 py-2 text-[13px] font-medium text-black transition hover:bg-white/60"
                      >
                        + Add Competency
                      </button>
                    </div>
                  </section>

                  <section className="space-y-5 pb-2">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d5d7da] text-[14px] text-[#4b4b4d]"
                        aria-hidden="true"
                      >
                        4
                      </span>
                      <h3 className="text-[22px] font-medium leading-tight tracking-[-0.02em] text-black">
                        Executive Narrative
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <textarea
                        className="w-full resize-none rounded-lg border border-[#dfe1e4] bg-white/55 p-4 text-[15px] text-black shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] outline-none transition placeholder:text-[#9b9da1] focus:border-[#adafb2] focus:ring-2 focus:ring-black/5"
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

            <footer className="flex shrink-0 items-center justify-between border-t border-white/70 bg-white/55 px-6 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:px-8 md:px-9">
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
                  className="rounded-lg border border-[#dfe1e4] bg-white/80 px-6 py-2.5 text-[13px] font-medium text-black shadow-sm transition hover:bg-white active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="relative overflow-hidden rounded-lg bg-[#0f172a] px-8 py-2.5 text-[13px] font-medium text-white shadow-lg shadow-slate-300/60 transition hover:bg-black active:scale-95"
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
