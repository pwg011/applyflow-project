"use client";

import type { Application } from "@/types/application";

type ApplicationId = Application["id"];

type ApplicationCardProps = {
  application: Application;
  deletingId: ApplicationId | null;
  onOpenDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
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

export default function ApplicationCard({
  application,
  deletingId,
  onOpenDetails,
  onEdit,
  onDelete,
}: ApplicationCardProps) {
  void onEdit;
  void onDelete;

  return (
    <article
      className={`origin-left cursor-pointer rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-2xl ${
        application.id === deletingId
          ? "pointer-events-none scale-x-0 scale-95 opacity-0 duration-[1500ms] ease-in-out"
          : ""
      }`}
      onClick={onOpenDetails}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-lg font-semibold text-slate-900">
            {application.company}
          </p>
          <p className="text-sm text-slate-600">{application.role}</p>
        </div>

        <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {application.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <p>
          <span className="font-medium text-slate-900">Date applied:</span>{" "}
          {formatDate(application.date_applied)}
        </p>

        {application.job_url ? (
          <p className="truncate">
            <span className="font-medium text-slate-900">Job link:</span>{" "}
            <a
              href={getApplicationHref(application.job_url)}
              target="_blank"
              rel="noreferrer"
              className="text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
              onClick={(event) => event.stopPropagation()}
            >
              View posting
            </a>
          </p>
        ) : null}
      </div>

      {application.notes ? (
        <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {application.notes}
        </p>
      ) : null}
    </article>
  );
}
