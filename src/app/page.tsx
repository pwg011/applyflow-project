"use client";

import { useMemo, useState } from "react";
import ApplyShell from "@/components/applyflow/ApplyShell";
import PageHeader from "@/components/applyflow/PageHeader";
import JobRow from "@/components/jobs/JobRow";
import SelectedJobPanel from "@/components/jobs/SelectedJobPanel";
import StatCard from "@/components/jobs/StatCard";
import { jobs, stats } from "@/data/applyflow";

export default function Home() {
  const [selectedJobId, setSelectedJobId] = useState("northstar-labs");
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportOpen, setIsImportOpen] = useState(false);

  const selectedJob =
    jobs.find((job) => job.id === selectedJobId) ?? jobs[0];
  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return jobs;
    }

    return jobs.filter(
      (job) =>
        job.company.toLowerCase().includes(query) ||
        job.role.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  return (
    <ApplyShell
      activeNav="jobs"
      topBarSearchPlaceholder="Search jobs..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      userInitials="PA"
    >
      <div className="min-h-[calc(100vh-63px)] px-5 pb-0 pt-7 sm:px-10 xl:px-12">
        <section className="mx-auto max-w-[928px]">
          <PageHeader
            title="Jobs"
            subtitle="Track, prepare, and manage applications"
            actionLabel="Import Job"
            actionIcon={
              <span className="text-[19px] font-light leading-none">+</span>
            }
            onActionClick={() => setIsImportOpen(true)}
          />

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>

          <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_293px]">
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <JobRow
                  key={job.id}
                  job={job}
                  selected={job.id === selectedJob.id}
                  onSelect={() => setSelectedJobId(job.id)}
                />
              ))}
            </div>

            <SelectedJobPanel job={selectedJob} />
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

      {isImportOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-5"
          onClick={() => setIsImportOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-lg border border-white/80 bg-[#f7f9fc] p-8 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Import Job</h2>
                <p className="mt-2 text-sm text-[#5d6064]">
                  Paste a job link or description.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="text-2xl"
                aria-label="Close import dialog"
              >
                &times;
              </button>
            </div>
            <input
              className="mt-8 w-full rounded border border-[#c7c9cc] bg-white px-4 py-3 outline-none"
              placeholder="Job link"
            />
            <textarea
              className="mt-4 min-h-40 w-full resize-none rounded border border-[#c7c9cc] bg-white px-4 py-3 outline-none"
              placeholder="Job description"
            />
            <button
              type="button"
              onClick={() => setIsImportOpen(false)}
              className="mt-6 w-full rounded bg-black px-5 py-3 font-semibold text-white"
            >
              Import
            </button>
          </div>
        </div>
      ) : null}
    </ApplyShell>
  );
}
