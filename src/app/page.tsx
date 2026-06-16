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
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 px-4 backdrop-blur-[6px]"
          onClick={() => setIsImportOpen(false)}
        >
          <div
            className="relative w-full max-w-[560px] overflow-hidden rounded-2xl border border-white/60 border-t-white/80 bg-white/75 px-8 py-10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.06),0_18px_36px_-18px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:px-12 sm:py-12"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsImportOpen(false)}
              className="absolute right-7 top-7 flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-[#7e8187] transition hover:bg-black/5 hover:text-black"
              aria-label="Close import dialog"
            >
              &times;
            </button>

            <div className="space-y-3 pr-10">
              <div>
                <h2 className="text-[32px] font-semibold leading-tight tracking-[-0.01em] text-black">
                  Import Job
                </h2>
                <p className="mt-3 text-[16px] leading-7 text-[#686266]">
                  Paste a link, job post or description to get started.
                </p>
              </div>
            </div>

            <div className="mt-10 overflow-hidden rounded-xl border border-slate-200/70 bg-[#f8fafc]/65 shadow-inner transition focus-within:border-slate-300 focus-within:bg-white/80">
              <input
                className="w-full border-0 border-b border-slate-200/70 bg-transparent px-6 py-4 text-[15px] text-[#191c1e] outline-none placeholder:text-[#94a3b8] focus:ring-0"
                placeholder="https://company.com/careers/engineer-role..."
              />
              <textarea
                className="min-h-[176px] w-full resize-none border-0 bg-transparent px-6 py-5 text-[15px] leading-6 text-[#191c1e] outline-none placeholder:text-[#94a3b8] focus:ring-0"
                placeholder="Or paste the full job description here"
              />
            </div>

            <div className="mt-7 flex items-start gap-3 px-1 text-[#556379]">
              <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-[#8da0bb] text-[12px] font-semibold leading-none">
                i
              </span>
              <p className="text-[14px] leading-6">
                Our AI will automatically extract the company name, job title,
                and key requirements for you.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#0f172a] px-5 text-[15px] font-medium tracking-wide text-white shadow-lg shadow-slate-200 transition hover:-translate-y-px hover:bg-black"
              >
                <span>Import</span>
                <span aria-hidden="true" className="text-lg leading-none">
                  &rarr;
                </span>
              </button>
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="h-12 w-full text-[12px] font-semibold uppercase tracking-[0.18em] text-[#8a9ab0] transition hover:text-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ApplyShell>
  );
}
