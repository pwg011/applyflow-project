"use client";

import type { Persona } from "@/types/persona";

type PersonaDetailsModalProps = {
  persona: Persona | null;
  onClose: () => void;
  onEdit: (persona: Persona) => void;
  onDelete: (persona: Persona) => void;
  onUploadCv: (persona: Persona, file: File) => void | Promise<void>;
  isUploadingCv: boolean;
};

type DetailRowProps = {
  label: string;
  value?: string | null;
  multiline?: boolean;
};

function DetailRow({ label, value, multiline = false }: DetailRowProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <div
        className={`rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700 ${
          multiline ? "whitespace-pre-wrap leading-6" : ""
        }`}
      >
        {value?.trim() ? value : "Not provided"}
      </div>
    </div>
  );
}

export default function PersonaDetailsModal({
  persona,
  onClose,
  onEdit,
  onDelete,
  onUploadCv,
  isUploadingCv,
}: PersonaDetailsModalProps) {
  return (
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 px-6 backdrop-blur-sm transition-all duration-300 ${
        persona
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
      aria-hidden={!persona}
    >
      <div
        className={`flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ${
          persona ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {persona ? (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-sm text-slate-500">Persona details</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                  {persona.display_name}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {persona.target_role || "Target role not provided"}
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

            <div className="space-y-6 overflow-y-auto px-6 py-5 pr-4">
              <div className="grid gap-5 sm:grid-cols-2">
                <DetailRow label="Display Name" value={persona.display_name} />
                <DetailRow label="Email" value={persona.email} />
                <DetailRow label="Phone" value={persona.phone} />
                <DetailRow
                  label="Professional Title"
                  value={persona.professional_title}
                />
                <DetailRow label="Target Role" value={persona.target_role} />
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    CV
                  </p>
                  <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700">
                    <p>
                      {persona.cv_file_path
                        ? persona.cv_file_name || "CV attached"
                        : "No CV uploaded yet"}
                    </p>
                    <label className="mt-4 inline-flex cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
                      <input
                        type="file"
                        accept="application/pdf"
                        className="sr-only"
                        disabled={isUploadingCv}
                        onChange={(event) => {
                          const file = event.target.files?.[0];

                          if (!file) {
                            return;
                          }

                          void onUploadCv(persona, file);
                          event.target.value = "";
                        }}
                      />
                      {isUploadingCv
                        ? persona.cv_file_path
                          ? "Replacing..."
                          : "Uploading..."
                        : persona.cv_file_path
                          ? "Replace CV"
                          : "Upload CV"}
                    </label>
                  </div>
                </div>
              </div>

              <DetailRow label="Skills" value={persona.skills} multiline />
              <DetailRow
                label="Experience Summary"
                value={persona.experience_summary}
                multiline
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => onDelete(persona)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Delete Persona
              </button>

              <button
                type="button"
                onClick={() => onEdit(persona)}
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Edit Persona
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
