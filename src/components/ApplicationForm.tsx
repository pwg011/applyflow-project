"use client";

import type { ChangeEvent, FormEvent } from "react";

type ApplicationStatus = "Applied" | "Interview" | "Offer" | "Rejected";
type ImportSourceType = "link" | "text" | "link_and_text" | "manual";

type FormData = {
  companyName: string;
  jobTitle: string;
  jobLink: string;
  status: ApplicationStatus;
  dateApplied: string;
  notes: string;
  rawJobText: string;
  sourceType: ImportSourceType | "";
  importedAt: string;
};

type ApplicationFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  editingId: number | string | null;
  formData: FormData;
  onInputChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onClear: () => void;
  isSaving: boolean;
};

function displayDateToInputDate(displayDate: string) {
  const [day, month, year] = displayDate.split("/");

  if (!day || !month || !year) {
    return "";
  }

  return `${year}-${month}-${day}`;
}

function inputDateToDisplayDate(inputDate: string) {
  const [year, month, day] = inputDate.split("-");

  if (!year || !month || !day) {
    return "";
  }

  return `${day}/${month}/${year}`;
}

export default function ApplicationForm({
  isOpen,
  onClose,
  onSubmit,
  editingId,
  formData,
  onInputChange,
  onClear,
  isSaving,
}: ApplicationFormProps) {
  const isEditing = editingId !== null;

  return (
    <aside
      className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md transform flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      aria-hidden={!isOpen}
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <h3 className="text-lg font-semibold tracking-tight">
          {isEditing ? "Edit Application" : "New Application"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          X
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-1 flex-col overflow-y-auto"
      >
        <div className="flex-1 space-y-5 px-6 py-5">
          <div className="space-y-2">
            <label
              htmlFor="companyName"
              className="text-sm font-medium text-slate-700"
            >
              Company name
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={onInputChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="jobTitle"
              className="text-sm font-medium text-slate-700"
            >
              Job title
            </label>
            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              value={formData.jobTitle}
              onChange={onInputChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="jobLink"
              className="text-sm font-medium text-slate-700"
            >
              Job link
            </label>
            <input
              id="jobLink"
              name="jobLink"
              type="text"
              value={formData.jobLink}
              onChange={onInputChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="status"
                className="text-sm font-medium text-slate-700"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={onInputChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="dateApplied"
                className="text-sm font-medium text-slate-700"
              >
                Date applied
              </label>
              <input
                id="dateApplied"
                name="dateApplied"
                type="date"
                value={displayDateToInputDate(formData.dateApplied)}
                onChange={(event) =>
                  onInputChange({
                    ...event,
                    target: {
                      ...event.target,
                      name: event.target.name,
                      value: inputDateToDisplayDate(event.target.value),
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="notes"
              className="text-sm font-medium text-slate-700"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={onInputChange}
              rows={6}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClear}
              disabled={isSaving}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 sm:w-28"
            >
              Clear
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving
                ? isEditing
                  ? "Updating..."
                  : "Saving..."
                : isEditing
                  ? "Update application"
                  : "Save application"}
            </button>
          </div>
        </div>
      </form>
    </aside>
  );
}
