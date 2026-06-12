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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-5"
          onClick={() => setIsCreateOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-lg border border-white/80 bg-[#f7f9fc] p-8 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">
                  {activeProfileTitle ? "Profile" : "Create Profile"}
                </h2>
                <p className="mt-2 text-sm text-[#5d6064]">
                  {activeProfileTitle
                    ? activeProfileTitle
                    : "Start a reusable professional profile."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-2xl"
                aria-label="Close profile dialog"
              >
                &times;
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="mt-8 w-full rounded bg-black px-5 py-3 font-semibold text-white"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </ApplyShell>
  );
}
