"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Application } from "@/types/application";
import type { Persona } from "@/types/persona";

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

type PersonaFeedback = {
  message: string;
  tone: "success" | "error";
};

type AnalysisFeedback = {
  message: string;
  tone: "success" | "error";
};

type AnalysisField = {
  label: string;
  value?: string | null;
};

type JobAnalysisPayload = {
  job_location: string | null;
  job_deadline: string | null;
  job_requirements: string | null;
  job_responsibilities: string | null;
  job_skills: string | null;
  job_benefits: string | null;
  application_instructions: string | null;
};

type JobAnalysisOverrides = Partial<
  Pick<
    Application,
    | "job_location"
    | "job_deadline"
    | "job_requirements"
    | "job_responsibilities"
    | "job_skills"
    | "job_benefits"
    | "application_instructions"
    | "analysis_status"
    | "analyzed_at"
  >
>;

type PersistedAnalysisFields = Pick<
  Application,
  | "job_location"
  | "job_deadline"
  | "job_requirements"
  | "job_responsibilities"
  | "job_skills"
  | "job_benefits"
  | "application_instructions"
  | "analysis_status"
  | "analyzed_at"
>;

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

function hasContent(value?: string | null) {
  return (value ?? "").trim() !== "";
}

function isJobAnalysisPayload(value: unknown): value is JobAnalysisPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    ("job_location" in candidate) &&
    ("job_deadline" in candidate) &&
    ("job_requirements" in candidate) &&
    ("job_responsibilities" in candidate) &&
    ("job_skills" in candidate) &&
    ("job_benefits" in candidate) &&
    ("application_instructions" in candidate)
  );
}

function mapAnalysisRow(
  row: Partial<PersistedAnalysisFields> | null | undefined,
): JobAnalysisOverrides {
  return {
    job_location: row?.job_location ?? null,
    job_deadline: row?.job_deadline ?? null,
    job_requirements: row?.job_requirements ?? null,
    job_responsibilities: row?.job_responsibilities ?? null,
    job_skills: row?.job_skills ?? null,
    job_benefits: row?.job_benefits ?? null,
    application_instructions: row?.application_instructions ?? null,
    analysis_status: row?.analysis_status ?? null,
    analyzed_at: row?.analyzed_at ?? null,
  };
}

function getExistingAnalysis(application: Application): JobAnalysisPayload {
  return {
    job_location: application.job_location ?? null,
    job_deadline: application.job_deadline ?? null,
    job_requirements: application.job_requirements ?? null,
    job_responsibilities: application.job_responsibilities ?? null,
    job_skills: application.job_skills ?? null,
    job_benefits: application.job_benefits ?? null,
    application_instructions: application.application_instructions ?? null,
  };
}

function hasSavedAnalysis(application: Application) {
  return Object.values(getExistingAnalysis(application)).some(
    (value) => hasContent(value),
  );
}

function AnalysisSection({
  application,
  isAnalyzing,
  analysisFeedback,
  onAnalyze,
}: {
  application: Application;
  isAnalyzing: boolean;
  analysisFeedback: AnalysisFeedback | null;
  onAnalyze: () => void | Promise<void>;
}) {
  const analysisFields: AnalysisField[] = [
    { label: "Location", value: application.job_location },
    { label: "Deadline", value: application.job_deadline },
    { label: "Requirements", value: application.job_requirements },
    {
      label: "Responsibilities",
      value: application.job_responsibilities,
    },
    { label: "Skills", value: application.job_skills },
    { label: "Benefits", value: application.job_benefits },
    {
      label: "Application Instructions",
      value: application.application_instructions,
    },
  ];

  const populatedFields = analysisFields.filter((field) => hasContent(field.value));
  const hasRawJobText = hasContent(application.raw_job_text);
  const hasAnalysis = hasSavedAnalysis(application);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Analysis
        </p>

        {hasRawJobText ? (
          <button
            type="button"
            onClick={() => void onAnalyze()}
            disabled={isAnalyzing}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isAnalyzing
              ? hasAnalysis
                ? "Improving..."
                : "Analyzing..."
              : hasAnalysis
                ? "Improve Analysis"
                : "Analyze Job"}
          </button>
        ) : null}
      </div>

      {populatedFields.length > 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <div className="space-y-4">
            {populatedFields.map((field) => (
              <div
                key={field.label}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {field.label}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
          No analysis available yet. AI insights will appear here.
        </div>
      )}

      {hasAnalysis ? (
        <p className="text-sm text-slate-500">
          Analysis saved. You can improve it if more useful details are needed.
        </p>
      ) : null}

      {analysisFeedback ? (
        <p
          className={`text-sm ${
            analysisFeedback.tone === "success"
              ? "text-slate-600"
              : "text-red-600"
          }`}
        >
          {analysisFeedback.message}
        </p>
      ) : null}
    </div>
  );
}

function JobPostingSection({ rawJobText }: { rawJobText?: string | null }) {
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
          <div className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 sm:max-h-72">
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
  const [analysisOverridesByApplicationId, setAnalysisOverridesByApplicationId] =
    useState<Record<string, JobAnalysisOverrides>>({});
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isPersonasLoading, setIsPersonasLoading] = useState(false);
  const [isSavingPersona, setIsSavingPersona] = useState(false);
  const [personaSelectionByApplicationId, setPersonaSelectionByApplicationId] =
    useState<Record<string, string>>({});
  const [personaFeedback, setPersonaFeedback] =
    useState<PersonaFeedback | null>(null);
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false);
  const [analysisFeedback, setAnalysisFeedback] =
    useState<AnalysisFeedback | null>(null);

  const activeApplication = useMemo(() => {
    if (!selectedApplication) {
      return null;
    }

    return {
      ...selectedApplication,
      ...(analysisOverridesByApplicationId[selectedApplication.id] ?? {}),
    };
  }, [analysisOverridesByApplicationId, selectedApplication]);

  const currentPersonaId = activeApplication
    ? (personaSelectionByApplicationId[activeApplication.id] ??
      activeApplication.persona_id ??
      "")
    : "";

  useEffect(() => {
    if (!activeApplication) {
      return;
    }

    let isActive = true;

    async function loadPersonas() {
      setIsPersonasLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        if (isActive) {
          setPersonas([]);
          setIsPersonasLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("personas")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!isActive) {
        return;
      }

      if (error) {
        setPersonas([]);
        setPersonaFeedback({
          message: error.message || "Could not load personas.",
          tone: "error",
        });
        setIsPersonasLoading(false);
        return;
      }

      setPersonas((data ?? []) as Persona[]);
      setIsPersonasLoading(false);
    }

    void loadPersonas();

    return () => {
      isActive = false;
    };
  }, [activeApplication]);

  useEffect(() => {
    if (!personaFeedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPersonaFeedback(null);
    }, 2500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [personaFeedback]);

  useEffect(() => {
    if (!selectedApplication) {
      return;
    }

    let isActive = true;
    const applicationId = selectedApplication.id;

    async function loadPersistedAnalysis() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        return;
      }

      const { data, error } = await supabase
        .from("applications")
        .select(
          [
            "job_location",
            "job_deadline",
            "job_requirements",
            "job_responsibilities",
            "job_skills",
            "job_benefits",
            "application_instructions",
            "analysis_status",
            "analyzed_at",
          ].join(","),
        )
        .eq("id", applicationId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!isActive || error || !data) {
        return;
      }

      setAnalysisOverridesByApplicationId((current) => ({
        ...current,
        [applicationId]: {
          ...(current[applicationId] ?? {}),
          ...mapAnalysisRow(data as Partial<PersistedAnalysisFields>),
        },
      }));
    }

    void loadPersistedAnalysis();

    return () => {
      isActive = false;
    };
  }, [selectedApplication]);

  async function handleAnalyzeJob() {
    if (!activeApplication || !hasContent(activeApplication.raw_job_text)) {
      return;
    }

    const shouldImproveExistingAnalysis = hasSavedAnalysis(activeApplication);

    if (shouldImproveExistingAnalysis) {
      const shouldContinue = window.confirm(
        "This will improve the saved analysis using the original job post and existing analysis. Continue?",
      );

      if (!shouldContinue) {
        return;
      }
    }

    setIsAnalyzingJob(true);
    setAnalysisFeedback(null);

    try {
      const response = await fetch("/api/analyze-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          shouldImproveExistingAnalysis
            ? {
                raw_job_text: activeApplication.raw_job_text,
                existing_analysis: getExistingAnalysis(activeApplication),
              }
            : {
                raw_job_text: activeApplication.raw_job_text,
              },
        ),
      });

      const responseBody = (await response.json()) as unknown;

      if (!response.ok) {
        throw new Error(
          typeof responseBody === "object" &&
            responseBody !== null &&
            "error" in responseBody &&
            typeof responseBody.error === "string"
            ? responseBody.error
            : "Could not analyze this job posting.",
        );
      }

      if (!isJobAnalysisPayload(responseBody)) {
        throw new Error("The analysis response was incomplete.");
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        throw new Error("You must be logged in to analyze a job.");
      }

      const analyzedAt = new Date().toISOString();
      const updates = {
        job_location: responseBody.job_location,
        job_deadline: responseBody.job_deadline,
        job_requirements: responseBody.job_requirements,
        job_responsibilities: responseBody.job_responsibilities,
        job_skills: responseBody.job_skills,
        job_benefits: responseBody.job_benefits,
        application_instructions: responseBody.application_instructions,
        analysis_status: "analyzed",
        analyzed_at: analyzedAt,
      };

      const { data, error } = await supabase
        .from("applications")
        .update(updates)
        .select(
          [
            "job_location",
            "job_deadline",
            "job_requirements",
            "job_responsibilities",
            "job_skills",
            "job_benefits",
            "application_instructions",
            "analysis_status",
            "analyzed_at",
          ].join(","),
        )
        .eq("id", activeApplication.id)
        .eq("user_id", session.user.id);

      if (error) {
        throw new Error(error.message || "Could not save analysis.");
      }

      const savedAnalysis = Array.isArray(data) ? data[0] : data;

      if (!savedAnalysis) {
        throw new Error("Could not save analysis.");
      }

      setAnalysisOverridesByApplicationId((current) => ({
        ...current,
        [activeApplication.id]: {
          ...(current[activeApplication.id] ?? {}),
          ...mapAnalysisRow(savedAnalysis as Partial<PersistedAnalysisFields>),
        },
      }));
      setAnalysisFeedback({
        message: shouldImproveExistingAnalysis
          ? "Analysis improved successfully."
          : "Analysis saved successfully.",
        tone: "success",
      });
    } catch (error) {
      setAnalysisFeedback({
        message:
          error instanceof Error
            ? error.message
            : "Could not analyze this job posting.",
        tone: "error",
      });
    } finally {
      setIsAnalyzingJob(false);
    }
  }

  async function handlePersonaChange(personaId: string) {
    if (!activeApplication) {
      return;
    }

    setIsSavingPersona(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      setPersonaFeedback({
        message: "You must be logged in to link a persona.",
        tone: "error",
      });
      setIsSavingPersona(false);
      return;
    }

    const nextPersonaId = personaId || null;
    const { error } = await supabase
      .from("applications")
      .update({ persona_id: nextPersonaId })
      .eq("id", activeApplication.id)
      .eq("user_id", session.user.id);

    if (error) {
      setPersonaFeedback({
        message: error.message || "Could not update persona.",
        tone: "error",
      });
      setIsSavingPersona(false);
      return;
    }

    setPersonaSelectionByApplicationId((current) => ({
      ...current,
      [activeApplication.id]: personaId,
    }));
    setPersonaFeedback({
      message: personaId ? "Persona linked successfully." : "Persona cleared.",
      tone: "success",
    });
    setIsSavingPersona(false);
  }

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
        className={`flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ${
          selectedApplication
            ? "translate-y-0 scale-100"
            : "translate-y-4 scale-95"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {activeApplication ? (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-sm text-slate-500">Application details</p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                  {activeApplication.company}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {activeApplication.role}
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
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Status
                  </p>
                  <select
                    value={activeApplication.status}
                    onChange={(event) =>
                      onStatusChange(
                        activeApplication.id,
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
                    {formatDate(activeApplication.date_applied)}
                  </p>
                </div>
              </div>

              {activeApplication.job_url ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Job link
                  </p>
                  <a
                    href={getApplicationHref(activeApplication.job_url)}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
                  >
                    {activeApplication.job_url}
                  </a>
                </div>
              ) : null}

              {activeApplication.notes ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Notes
                  </p>
                  <p className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
                    {activeApplication.notes}
                  </p>
                </div>
              ) : null}

              <JobPostingSection
                key={activeApplication.id}
                rawJobText={activeApplication.raw_job_text}
              />

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Persona
                </p>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="applicationPersona"
                      className="text-sm font-medium text-slate-700"
                    >
                      Linked persona
                    </label>
                    <select
                      id="applicationPersona"
                      value={currentPersonaId}
                      onChange={(event) =>
                        void handlePersonaChange(event.target.value)
                      }
                      disabled={isPersonasLoading || isSavingPersona}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <option value="">No persona selected</option>
                      {personas.map((persona) => (
                        <option key={persona.id} value={persona.id}>
                          {persona.display_name}
                          {persona.professional_title
                            ? ` - ${persona.professional_title}`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-3 min-h-5 text-sm">
                    {isPersonasLoading ? (
                      <p className="text-slate-500">Loading personas...</p>
                    ) : personaFeedback ? (
                      <p
                        className={
                          personaFeedback.tone === "success"
                            ? "text-slate-700"
                            : "text-red-600"
                        }
                      >
                        {personaFeedback.message}
                      </p>
                    ) : (
                      <p className="text-slate-500">
                        Choose a persona to tailor future AI workflows for this
                        application.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <AnalysisSection
                application={activeApplication}
                isAnalyzing={isAnalyzingJob}
                analysisFeedback={analysisFeedback}
                onAnalyze={handleAnalyzeJob}
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => onDelete(activeApplication)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Delete Application
              </button>

              <button
                type="button"
                onClick={() => onEdit(activeApplication)}
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
