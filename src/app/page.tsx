"use client";

import { useMemo, useState } from "react";
import ApplyShell from "@/components/applyflow/ApplyShell";
import ApplicationDetailsModal from "@/components/ApplicationDetailsModal";
import ApplicationForm from "@/components/ApplicationForm";
import DeleteApplicationModal from "@/components/DeleteApplicationModal";
import ImportPreviewModal, {
  type ImportPreviewModalData,
} from "@/components/ImportPreviewModal";
import PageHeader from "@/components/applyflow/PageHeader";
import JobRow from "@/components/jobs/JobRow";
import SelectedJobPanel from "@/components/jobs/SelectedJobPanel";
import StatCard from "@/components/jobs/StatCard";
import { jobs, stats } from "@/data/applyflow";

const demoImportedJob: ImportPreviewModalData = {
  company: "Lumina Aerospace",
  role: "Senior Design Lead",
  job_url: "https://linkedin.com/jobs/view/382910485",
  date_applied: "16/06/2026",
  source: "LinkedIn",
  location: "Remote / San Francisco",
  employmentType: "Full-time",
  compensation: "$180k - $240k",
  summary:
    "As Senior Design Lead, you will guide the visual evolution of aerospace interface systems, partner with engineering teams, mentor designers, and shape a design system that balances technical complexity with intuitive product quality. Requirements include 8+ years in UI/UX, strong systems thinking, and senior-level Figma experience.",
};

type JobsEmptyDemo = "default" | "noJobs" | "noSelection";

function EmptyStatePanel({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-[#cfd2d6] bg-white/35 px-6 py-10 text-center shadow-[0_12px_26px_rgba(0,0,0,0.025),inset_0_1px_0_rgba(255,255,255,0.68)]">
      <span className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-[#d7d9dc] bg-[#eef0f3]/80 text-[20px] font-semibold text-[#2b2d30] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_16px_rgba(0,0,0,0.04)]">
        +
      </span>
      <h3 className="mt-4 text-[18px] font-semibold tracking-[-0.025em] text-black">
        {title}
      </h3>
      <p className="mt-2 max-w-[360px] text-[14px] leading-6 text-[#4b4b4d]">
        {description}
      </p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 h-10 rounded-[2px] bg-black px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition hover:bg-[#111827]"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default function Home() {
  const [selectedJobId, setSelectedJobId] = useState("northstar-labs");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobsEmptyDemo, setJobsEmptyDemo] =
    useState<JobsEmptyDemo>("default");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isImportPreviewOpen, setIsImportPreviewOpen] = useState(false);
  const [isEditApplicationOpen, setIsEditApplicationOpen] = useState(false);
  const [isDeleteApplicationOpen, setIsDeleteApplicationOpen] = useState(false);
  const [isApplicationDetailsOpen, setIsApplicationDetailsOpen] =
    useState(false);
  const [importPreviewData, setImportPreviewData] =
    useState<ImportPreviewModalData>(demoImportedJob);

  const selectedJob =
    jobsEmptyDemo === "noSelection" || jobsEmptyDemo === "noJobs"
      ? null
      : (jobs.find((job) => job.id === selectedJobId) ?? jobs[0]);
  const filteredJobs = useMemo(() => {
    if (jobsEmptyDemo === "noJobs") {
      return [];
    }

    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return jobs;
    }

    return jobs.filter(
      (job) =>
        job.company.toLowerCase().includes(query) ||
        job.role.toLowerCase().includes(query),
    );
  }, [jobsEmptyDemo, searchQuery]);

  function handleImportJob() {
    setImportPreviewData(demoImportedJob);
    setIsImportOpen(false);
    setIsImportPreviewOpen(true);
  }

  function handleBackToImport() {
    setIsImportPreviewOpen(false);
    setIsImportOpen(true);
  }

  function handleSaveImportedJob() {
    setIsImportPreviewOpen(false);
  }

  function openNoAnalysisPreview() {
    setImportPreviewData({
      ...demoImportedJob,
      summary: "",
    });
    setIsImportPreviewOpen(true);
  }

  return (
    <ApplyShell
      activeNav="jobs"
      topBarSearchPlaceholder="Search jobs..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      userInitials="PA"
    >
      <div className="min-h-[calc(100vh-63px)] px-5 pb-0 pt-8 sm:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <section className="mx-auto w-full max-w-[3200px]">
          <PageHeader
            title="Jobs"
            subtitle="Track, prepare, and manage applications"
            actionLabel="Import Job"
            actionIcon={
              <span className="text-[19px] font-light leading-none">+</span>
            }
            onActionClick={() => setIsImportOpen(true)}
          />

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              ["default", "Default"],
              ["noJobs", "No Jobs"],
              ["noSelection", "No Selection"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setJobsEmptyDemo(value as JobsEmptyDemo)}
                className={`h-9 border px-4 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
                  jobsEmptyDemo === value
                    ? "border-black bg-black text-white"
                    : "border-white/70 bg-white/40 text-[#222426] hover:bg-white/65"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={openNoAnalysisPreview}
              className="h-9 border border-white/70 bg-white/40 px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#222426] transition hover:bg-white/65"
            >
              No Analysis
            </button>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>

          <div className="mt-8 grid items-start gap-5 lg:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,22rem)] 2xl:grid-cols-[minmax(0,1fr)_minmax(340px,26rem)] 2xl:gap-7">
            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobRow
                    key={job.id}
                    job={job}
                    selected={job.id === selectedJob?.id}
                    onSelect={() => {
                      setJobsEmptyDemo("default");
                      setSelectedJobId(job.id);
                    }}
                  />
                ))
              ) : (
                <EmptyStatePanel
                  title="No jobs yet"
                  description="Import a job to start tracking applications, notes, and next steps in one place."
                  actionLabel="Import Job"
                  onAction={() => setIsImportOpen(true)}
                />
              )}
            </div>

            {selectedJob ? (
              <SelectedJobPanel
                job={selectedJob}
                onEditDetails={() => setIsEditApplicationOpen(true)}
                onDeleteApplication={() => setIsDeleteApplicationOpen(true)}
                onViewJob={() => setIsApplicationDetailsOpen(true)}
              />
            ) : (
              <EmptyStatePanel
                title="No selected jobs"
                description="Choose a job from the list to preview the application log, notes, and next step details."
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

      {isImportOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/10 px-5 backdrop-blur-[12px]"
          onClick={() => setIsImportOpen(false)}
        >
          <div
            className="relative w-full max-w-[560px] overflow-hidden rounded-lg border border-white/65 border-b-slate-300/70 bg-gradient-to-br from-white/75 via-white/55 to-slate-100/45 shadow-[0_34px_90px_rgba(15,23,42,0.24),0_12px_30px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-slate-900/5 backdrop-blur-[72px] backdrop-saturate-150"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-t border-white/90 bg-white/20 px-7 pb-6 pt-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#4b4b4d]">
                  New Application
                </p>
                <h2 className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.035em] text-black">
                  Import Job
                </h2>
                <p className="mt-2 max-w-[390px] text-[15px] leading-6 text-[#4b4b4d]">
                  Paste a link, job post or description to get started.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/70 bg-white/45 text-2xl leading-none text-[#4b4b4d] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition hover:bg-white/70 hover:text-black"
                aria-label="Close import dialog"
              >
                &times;
              </button>
            </div>

            <div className="border-t border-white/50 bg-white/10 px-7 py-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                    Job Link
                  </span>
                  <input
                    className="mt-2 h-12 w-full border border-white/65 bg-white/45 px-4 text-[14px] text-[#191c1e] shadow-[inset_0_1px_3px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.65)] outline-none transition placeholder:text-[#8f98a6] focus:border-slate-300 focus:bg-white/75"
                    placeholder="https://company.com/careers/engineer-role..."
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                    Job Description
                  </span>
                  <textarea
                    className="mt-2 min-h-[168px] w-full resize-none border border-white/65 bg-white/45 px-4 py-3 text-[14px] leading-6 text-[#191c1e] shadow-[inset_0_1px_3px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.65)] outline-none transition placeholder:text-[#8f98a6] focus:border-slate-300 focus:bg-white/75"
                    placeholder="Or paste the full job description here"
                  />
                </label>
              </div>

              <div className="mt-5 border border-white/60 bg-white/35 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_20px_rgba(15,23,42,0.04)]">
                <p className="text-[13px] leading-5 text-[#556379]">
                  Our AI will automatically extract the company name, job title,
                  and key requirements for you.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/60 bg-white/30 px-7 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-2xl">
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="h-11 border border-white/70 bg-white/30 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#191c1e] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition hover:bg-white/55"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportJob}
                className="h-11 rounded-[2px] bg-black text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition hover:bg-[#111827]"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ImportPreviewModal
        isOpen={isImportPreviewOpen}
        data={importPreviewData}
        onChange={setImportPreviewData}
        onBack={handleBackToImport}
        onCancel={() => setIsImportPreviewOpen(false)}
        onSave={handleSaveImportedJob}
        isSaving={false}
      />

      {selectedJob ? (
        <ApplicationForm
          isOpen={isEditApplicationOpen}
          job={selectedJob}
          onClose={() => setIsEditApplicationOpen(false)}
        />
      ) : null}

      {selectedJob ? (
        <ApplicationDetailsModal
          isOpen={isApplicationDetailsOpen}
          job={selectedJob}
          onClose={() => setIsApplicationDetailsOpen(false)}
        />
      ) : null}

      {selectedJob ? (
        <DeleteApplicationModal
          isOpen={isDeleteApplicationOpen}
          job={selectedJob}
          isDeleting={false}
          onCancel={() => setIsDeleteApplicationOpen(false)}
          onConfirmDelete={() => setIsDeleteApplicationOpen(false)}
        />
      ) : null}
    </ApplyShell>
  );
}
