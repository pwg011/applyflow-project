"use client";

import type { ChangeEvent, FormEvent } from "react";
import type { Persona } from "@/types/persona";

type PersonaBuildReviewFormData = {
  display_name: string;
  email: string;
  phone: string;
  professional_title: string;
  target_role: string;
  skills: string;
  experience_summary: string;
};

type PersonaBuildReviewModalProps = {
  persona: Persona | null;
  formData: PersonaBuildReviewFormData;
  isSaving: boolean;
  isAnalyzing: boolean;
  errorMessage: string;
  onClose: () => void;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onBuildWithAi: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

type FieldProps = {
  label: string;
  name: keyof PersonaBuildReviewFormData;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  multiline?: boolean;
};

function Field({
  label,
  name,
  value,
  onChange,
  multiline = false,
}: FieldProps) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={4}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />
      )}
    </label>
  );
}

export default function PersonaBuildReviewModal({
  persona,
  formData,
  isSaving,
  isAnalyzing,
  errorMessage,
  onClose,
  onChange,
  onBuildWithAi,
  onSubmit,
}: PersonaBuildReviewModalProps) {
  return (
    <div
      className={`fixed inset-0 z-[85] flex items-center justify-center bg-slate-950/40 px-6 backdrop-blur-sm transition-all duration-300 ${
        persona
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
      aria-hidden={!persona}
    >
      <div
        className={`flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ${
          persona ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {persona ? (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-sm text-slate-500">Draft persona</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                  Build Persona from CV
                </h2>
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

            <form
              onSubmit={onSubmit}
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <div className="space-y-6 overflow-y-auto px-6 py-5 pr-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    CV
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {persona.cv_file_name || "CV attached"}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    This CV is ready to be analyzed and used to build a
                    persona.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Display name"
                    name="display_name"
                    value={formData.display_name}
                    onChange={onChange}
                  />
                  <Field
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                  />
                  <Field
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={onChange}
                  />
                  <Field
                    label="Professional title"
                    name="professional_title"
                    value={formData.professional_title}
                    onChange={onChange}
                  />
                  <Field
                    label="Target role"
                    name="target_role"
                    value={formData.target_role}
                    onChange={onChange}
                  />
                </div>

                <Field
                  label="Skills"
                  name="skills"
                  value={formData.skills}
                  onChange={onChange}
                  multiline
                />
                <Field
                  label="Experience summary"
                  name="experience_summary"
                  value={formData.experience_summary}
                  onChange={onChange}
                  multiline
                />

                {/* TODO: Add browser OCR fallback for scanned PDFs. */}
                {errorMessage ? (
                  <p className="text-sm text-red-600">{errorMessage}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Cancel
                </button>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={onBuildWithAi}
                    disabled={isAnalyzing}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    {isAnalyzing ? "Analyzing CV..." : "Build with AI"}
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSaving ? "Saving..." : "Save Persona"}
                  </button>
                </div>
              </div>
            </form>
          </>
        ) : null}
      </div>
    </div>
  );
}
