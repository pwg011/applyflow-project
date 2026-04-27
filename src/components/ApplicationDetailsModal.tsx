"use client";

import { useState } from "react";
import type { Application } from "@/types/application";

type ApplicationStatus = "Applied" | "Interview" | "Offer" | "Rejected";
type ApplicationId = Application["id"];

type ApplicationDetailsModalProps = {
  selectedApplication: Application | null;
  onClose: () => void;
  onStatusChange: (
    applicationId: ApplicationId,
    status: ApplicationStatus,
  ) => void | Promise<void>;
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
};

function formatDate(dateApplied?: string | null) {
  if (!dateApplied) {
    return "Not provided";
  }

  return new Date(dateApplied).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getApplicationHref(jobLink?: string | null) {
  if (!jobLink) {
    return "";
  }

  if (jobLink.startsWith("http://") || jobLink.startsWith("https://")) {
    return jobLink;
  }

  return `https://${jobLink}`;
}

function JobPostingSection({
  rawJobText,
}: {
  rawJobText?: string | null;
}) {
  const [isJobPostingOpen, setIsJobPostingOpen] = useState(false);
  const hasRawJobText = (rawJobText ?? "").trim() !== "";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Job Posting
        </p>

        {hasRawJobText ? (
          <button
            type="button"
            onClick={() => setIsJobPostingOpen((current) => !current)}
            className="text-sm font-medium text-slate-700 transition hover:text-slate-900"
          >
            {isJobPostingOpen ? "Hide Job Posting" : "View Job Posting"}
          </button>
        ) : null}
      </div>

      {hasRawJobText ? (
        isJobPostingOpen ? (
          <div className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
            {rawJobText}
          </div>
        ) : null
      ) : (
        <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
          No job posting text saved for this application.
        </p>
      )}
    </div>
  );
}

export default function ApplicationDetailsModal({
  selectedApplication,
  onClose,
  onStatusChange,
  onEdit,
  onDelete,
}: ApplicationDetailsModalProps) {
  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 px-6 backdrop-blur-sm transition-all duration-300 ${
        selectedApplication
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
      aria-hidden={!selectedApplication}
    >
      <div
        className={`w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ${
          selectedApplication
            ? "translate-y-0 scale-100"
            : "translate-y-4 scale-95"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {selectedApplication ? (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-sm text-slate-500">Application details</p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                  {selectedApplication.company}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedApplication.role}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                X
              </button>
            </div>

            <div className="space-y-6 px-6 py-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Status
                  </p>
                  <select
                    value={selectedApplication.status}
                    onChange={(event) =>
                      onStatusChange(
                        selectedApplication.id,
                        event.target.value as ApplicationStatus,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  >
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Date applied
                  </p>
                  <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {formatDate(selectedApplication.date_applied)}
                  </p>
                </div>
              </div>

              {selectedApplication.job_url ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Job link
                  </p>
                  <a
                    href={getApplicationHref(selectedApplication.job_url)}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
                  >
                    {selectedApplication.job_url}
                  </a>
                </div>
              ) : null}

              {selectedApplication.notes ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Notes
                  </p>
                  <p className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
                    {selectedApplication.notes}
                  </p>
                </div>
              ) : null}

              <JobPostingSection
                key={selectedApplication.id}
                rawJobText={selectedApplication.raw_job_text}
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => onDelete(selectedApplication)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Delete Application
              </button>

              <button
                type="button"
                onClick={() => onEdit(selectedApplication)}
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Edit Application
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
