"use client";

export type ImportPreviewModalData = {
  company: string;
  role: string;
  job_url: string;
  date_applied: string;
  source: string;
  location: string;
  employmentType: string;
  compensation: string;
  summary: string;
};

type ImportPreviewModalProps = {
  isOpen: boolean;
  data: ImportPreviewModalData;
  onChange: (updatedData: ImportPreviewModalData) => void;
  onBack: () => void;
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

function formatJobUrl(jobUrl: string) {
  return jobUrl.replace(/^https?:\/\//, "").replace(/^www\./, "");
}

export default function ImportPreviewModal({
  isOpen,
  data,
  onChange,
  onBack,
  onCancel,
  onSave,
  isSaving,
}: ImportPreviewModalProps) {
  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    onChange({
      ...data,
      [name]: value,
    });
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[56] bg-slate-950/12 backdrop-blur-[12px] transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-0 z-[57] flex items-center justify-center px-5 py-5 transition-all duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <section
          className={`flex max-h-[88vh] w-full max-w-[760px] flex-col overflow-hidden rounded-lg border border-white/65 border-b-slate-300/70 bg-gradient-to-br from-white/78 via-white/60 to-slate-100/46 shadow-[0_34px_90px_rgba(15,23,42,0.24),0_12px_30px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-slate-900/5 backdrop-blur-[72px] backdrop-saturate-150 transition-all duration-300 ${
            isOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <header className="flex items-start justify-between border-t border-white/90 bg-white/22 px-7 pb-4 pt-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-white/70 bg-white/50 text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_10px_22px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 7h16" />
                    <path d="M7 4h10" />
                    <path d="M6 7v13h12V7" />
                    <path d="m9 13 2 2 4-5" />
                  </svg>
                </span>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#4b4b4d]">
                    Extraction Review
                  </p>
                  <h2 className="mt-1.5 text-[26px] font-semibold leading-tight tracking-[-0.035em] text-black">
                    Review imported job
                  </h2>
                </div>
              </div>
              <p className="mt-2 max-w-[440px] text-[14px] leading-6 text-[#4b4b4d]">
                Check the extracted details before saving this application.
              </p>
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/70 bg-white/45 text-2xl leading-none text-[#4b4b4d] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition hover:bg-white/70 hover:text-black"
              aria-label="Close import preview"
            >
              &times;
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto border-t border-white/50 bg-white/12 px-7 pb-6 pt-4 [scrollbar-color:#d5d8de_transparent] [scrollbar-width:thin]">
            <section className="rounded-[5px] border border-white/70 bg-white/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4b4b4d]">
                    Imported role
                  </p>
                  <input
                    name="role"
                    type="text"
                    value={data.role}
                    onChange={handleInputChange}
                    className="mt-2 w-full border-0 bg-transparent p-0 text-[25px] font-semibold leading-tight tracking-[-0.035em] text-black outline-none placeholder:text-[#8f98a6] focus:ring-0"
                  />
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <input
                      name="company"
                      type="text"
                      value={data.company}
                      onChange={handleInputChange}
                      className="min-w-[180px] border-0 bg-transparent p-0 text-[15px] font-medium text-[#3f4652] outline-none placeholder:text-[#8f98a6] focus:ring-0"
                    />
                    <span className="h-1 w-1 bg-[#a4a8ae]" />
                    <input
                      name="source"
                      type="text"
                      value={data.source}
                      onChange={handleInputChange}
                      className="w-[92px] border-0 bg-transparent p-0 text-[13px] font-semibold text-[#596273] outline-none placeholder:text-[#8f98a6] focus:ring-0"
                    />
                  </div>
                </div>

                <div className="shrink-0 border border-white/70 bg-white/52 px-3 py-2 text-right shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                  <p className="text-[18px] font-semibold leading-none text-black">
                    94%
                  </p>
                  <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#4a4d50]">
                    Match
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  label: "Job link",
                  content: (
                    <input
                      name="job_url"
                      type="text"
                      value={formatJobUrl(data.job_url)}
                      onChange={handleInputChange}
                      className="w-full border-0 bg-transparent p-0 text-[12px] font-medium text-[#273142] outline-none focus:ring-0"
                    />
                  ),
                },
                {
                  label: "Date",
                  content: (
                    <input
                      name="date_applied"
                      type="date"
                      value={displayDateToInputDate(data.date_applied)}
                      onChange={(event) =>
                        onChange({
                          ...data,
                          date_applied: inputDateToDisplayDate(
                            event.target.value,
                          ),
                        })
                      }
                      className="w-full border-0 bg-transparent p-0 text-[13px] font-medium text-[#273142] outline-none focus:ring-0"
                    />
                  ),
                },
                {
                  label: "Location",
                  value: data.location,
                },
                {
                  label: "Salary range",
                  value: data.compensation,
                },
                {
                  label: "Employment",
                  value: data.employmentType,
                },
                {
                  label: "Status",
                  value: "Application draft",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="min-h-[62px] rounded-[4px] border border-white/62 bg-white/34 px-3.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)] backdrop-blur-xl"
                >
                  <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#69717f]">
                    {item.label}
                  </p>
                  <div className="mt-1.5 text-[13px] font-medium leading-5 text-[#273142]">
                    {"content" in item ? item.content : item.value}
                  </div>
                </div>
              ))}
            </section>

            <section className="mt-3 rounded-[5px] border border-white/65 bg-white/40 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] backdrop-blur-2xl">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                  Extracted Summary
                </p>
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#69717f]">
                  Editable
                </span>
              </div>
              {data.summary.trim() ? (
                <textarea
                  name="summary"
                  value={data.summary}
                  onChange={handleInputChange}
                  className="min-h-[112px] w-full resize-none border-0 bg-transparent p-0 text-[14px] leading-6 text-[#273142] outline-none placeholder:text-[#8f98a6] focus:ring-0"
                />
              ) : (
                <div className="flex min-h-[112px] flex-col justify-center border border-dashed border-[#cfd2d6] bg-white/30 px-4 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.68)]">
                  <p className="text-[14px] font-semibold text-black">
                    No job analysis yet
                  </p>
                  <p className="mx-auto mt-2 max-w-[420px] text-[13px] leading-5 text-[#596273]">
                    Add a job description to generate a summary, requirements,
                    and match notes.
                  </p>
                </div>
              )}
            </section>

            <section className="mt-3 pb-1">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#4b4b4d]">
                Requirements
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "8+ years UI/UX",
                  "Design systems",
                  "Figma",
                  "Mentorship",
                  "Cross-functional teams",
                ].map((requirement) => (
                  <span
                    key={requirement}
                    className="rounded-[3px] border border-white/70 bg-white/46 px-3 py-1.5 text-[11px] font-semibold text-[#3d4655] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl"
                  >
                    {requirement}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <footer className="flex shrink-0 flex-col gap-3 border-t border-white/60 bg-white/36 px-7 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onBack}
              className="h-11 border border-white/70 bg-white/30 px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#191c1e] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition hover:bg-white/55"
            >
              Back
            </button>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onCancel}
                className="h-11 border border-white/70 bg-white/30 px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#191c1e] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition hover:bg-white/55"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="h-11 rounded-[2px] bg-black px-8 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? "Saving" : "Save Application"}
              </button>
            </div>
          </footer>
        </section>
      </div>
    </>
  );
}
