"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
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

type PersonaCvAnalysisResponse = PersonaBuildReviewFormData;

type NeedsClientOcrResponse = {
  needsClientOcr: true;
  reason: string;
};

const personaCvBucketName = "persona-cvs";
const unclearCvMessage =
  "This CV could not be read clearly. Please upload a clearer PDF or DOCX file.";

function isPdfPersonaCv(persona: Persona) {
  return Boolean(
    persona.cv_file_path?.toLowerCase().endsWith(".pdf") ||
      persona.cv_file_name?.toLowerCase().endsWith(".pdf"),
  );
}

function isPersonaCvAnalysisResponse(
  value: unknown,
): value is PersonaCvAnalysisResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.display_name === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.phone === "string" &&
    typeof candidate.professional_title === "string" &&
    typeof candidate.target_role === "string" &&
    typeof candidate.skills === "string" &&
    typeof candidate.experience_summary === "string"
  );
}

function isNeedsClientOcrResponse(value: unknown): value is NeedsClientOcrResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    candidate.needsClientOcr === true && typeof candidate.reason === "string"
  );
}

function getApiErrorMessage(value: unknown, fallback: string) {
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const candidate = value as Record<string, unknown>;

  return typeof candidate.error === "string" ? candidate.error : fallback;
}

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
  const [localIsAnalyzing, setLocalIsAnalyzing] = useState(false);
  const [localMessage, setLocalMessage] = useState("");
  const [localError, setLocalError] = useState("");
  const isBusy = isAnalyzing || localIsAnalyzing;

  function applyAnalysisFields(result: PersonaCvAnalysisResponse) {
    (Object.entries(result) as Array<
      [keyof PersonaBuildReviewFormData, string]
    >).forEach(([name, value]) => {
      onChange({
        target: {
          name,
          value,
        },
      } as ChangeEvent<HTMLInputElement>);
    });
  }

  async function analyzeCv(
    personaId: string,
    token: string,
    payload: { cv_file_path?: string; cv_text?: string },
  ) {
    const response = await fetch("/api/analyze-cv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        persona_id: personaId,
        ...payload,
      }),
    });
    const responseBody = (await response.json()) as unknown;

    if (!response.ok) {
      throw new Error(getApiErrorMessage(responseBody, "Could not analyze this CV."));
    }

    return responseBody;
  }

  async function handleBuildWithAiClick() {
    setLocalError("");
    setLocalMessage("");

    if (!persona || !isPdfPersonaCv(persona)) {
      onBuildWithAi();
      return;
    }

    if (!persona.cv_file_path) {
      setLocalError("No CV is attached to this draft persona.");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setLocalError("You must be logged in to analyze this CV.");
      return;
    }

    setLocalIsAnalyzing(true);

    try {
      console.info("[browser-ocr] build-with-ai clicked", {
        isPdf: true,
        hasCvFilePath: Boolean(persona.cv_file_path),
      });

      const firstResponse = await analyzeCv(persona.id, session.access_token, {
        cv_file_path: persona.cv_file_path,
      });

      if (isPersonaCvAnalysisResponse(firstResponse)) {
        applyAnalysisFields(firstResponse);
        setLocalMessage("CV analysis completed. Review the fields before saving.");
        return;
      }

      if (!isNeedsClientOcrResponse(firstResponse)) {
        throw new Error("The CV analysis response was incomplete.");
      }

      console.info("[browser-ocr] needsClientOcr received", {
        hasCvFilePath: Boolean(persona.cv_file_path),
        hasReason: Boolean(firstResponse.reason),
      });

      setLocalMessage("Scanning PDF in browser...");

      const { data: blob, error: downloadError } = await supabase.storage
        .from(personaCvBucketName)
        .download(persona.cv_file_path);

      console.info("[browser-ocr] storage download completed", {
        success: Boolean(blob && !downloadError),
        hasError: Boolean(downloadError),
        blobSize: blob?.size ?? 0,
        blobType: blob?.type || "unknown",
      });

      if (downloadError || !blob) {
        throw new Error(downloadError?.message || "Could not download the CV file.");
      }

      const { ocrPdfBlobInBrowser } = await import("@/utils/clientPdfOcr");
      console.info("[browser-ocr] OCR starting", {
        blobSize: blob.size,
        blobType: blob.type || "unknown",
        maxPages: 3,
        scale: 2.5,
      });
      const ocrText = (
        await ocrPdfBlobInBrowser(blob, {
          maxPages: 3,
          scale: 2.5,
          onProgress: setLocalMessage,
        })
      ).trim();

      console.info("[browser-ocr] OCR completed", {
        textLength: ocrText.length,
      });

      if (ocrText.length < 120) {
        throw new Error(unclearCvMessage);
      }

      setLocalMessage("Building persona with scanned text...");
      console.info("[browser-ocr] retrying analyze-cv with OCR text", {
        textLength: ocrText.length,
      });

      const retryResponse = await analyzeCv(persona.id, session.access_token, {
        cv_text: ocrText,
      });

      if (!isPersonaCvAnalysisResponse(retryResponse)) {
        throw new Error("The CV analysis response was incomplete.");
      }

      applyAnalysisFields(retryResponse);
      setLocalMessage("CV analysis completed. Review the fields before saving.");
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "Could not analyze this CV.",
      );
      setLocalMessage("");
    } finally {
      setLocalIsAnalyzing(false);
    }
  }

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

                {localMessage ? (
                  <p className="text-sm text-slate-600">{localMessage}</p>
                ) : null}

                {localError || errorMessage ? (
                  <p className="text-sm text-red-600">
                    {localError || errorMessage}
                  </p>
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
                    onClick={() => void handleBuildWithAiClick()}
                    disabled={isBusy}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    {isBusy ? "Analyzing CV..." : "Build with AI"}
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
