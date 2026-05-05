"use client";

type ImportPreviewModalData = {
  company: string;
  role: string;
  job_url: string;
  date_applied: string;
};

type ImportPreviewModalProps = {
  isOpen: boolean;
  data: ImportPreviewModalData;
  onChange: (updatedData: ImportPreviewModalData) => void;
  onCancel: () => void;
  onSave: () => void;
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

export default function ImportPreviewModal({
  isOpen,
  data,
  onChange,
  onCancel,
  onSave,
  isSaving,
}: ImportPreviewModalProps) {
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    onChange({
      ...data,
      [name]: value,
    });
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[56] bg-slate-950/40 transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-0 z-[57] flex items-center justify-center px-6 transition-all duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <div
          className={`w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ${
            isOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                  Review imported job
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Check the extracted details before continuing.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onCancel}
              aria-label="Close import preview"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              X
            </button>
          </div>

          <div className="grid gap-5 px-6 py-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="previewCompany"
                className="text-sm font-medium text-slate-700"
              >
                Company
              </label>
              <input
                id="previewCompany"
                name="company"
                type="text"
                value={data.company}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="previewRole"
                className="text-sm font-medium text-slate-700"
              >
                Job title
              </label>
              <input
                id="previewRole"
                name="role"
                type="text"
                value={data.role}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="previewJobUrl"
                className="text-sm font-medium text-slate-700"
              >
                Job link
              </label>
              <input
                id="previewJobUrl"
                name="job_url"
                type="text"
                value={data.job_url}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="previewDateApplied"
                className="text-sm font-medium text-slate-700"
              >
                Date applied
              </label>
              <input
                id="previewDateApplied"
                name="date_applied"
                type="date"
                value={displayDateToInputDate(data.date_applied)}
                onChange={(event) =>
                  onChange({
                    ...data,
                    date_applied: inputDateToDisplayDate(event.target.value),
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? "Saving..." : "Save Application"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
