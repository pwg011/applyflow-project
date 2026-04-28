import OpenAI from "openai";
import { NextResponse } from "next/server";
import { normalizeJobSkills } from "@/utils/skillNormalizer";

type AnalyzeJobRequestBody = {
  raw_job_text?: unknown;
  existing_analysis?: unknown;
};

type JobAnalysisResponse = {
  job_location: string | null;
  job_deadline: string | null;
  job_requirements: string | null;
  job_responsibilities: string | null;
  job_skills: string | null;
  job_benefits: string | null;
  application_instructions: string | null;
};

type ExistingAnalysisInput = Partial<JobAnalysisResponse>;

const openRouterApiKey = process.env.OPENROUTER_API_KEY;

const openai = openRouterApiKey
  ? new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: openRouterApiKey,
      defaultHeaders: {
        "X-Title": "ApplyFlow",
      },
    })
  : null;

const emptyAnalysis: JobAnalysisResponse = {
  job_location: null,
  job_deadline: null,
  job_requirements: null,
  job_responsibilities: null,
  job_skills: null,
  job_benefits: null,
  application_instructions: null,
};

const analysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    job_location: { type: ["string", "null"] },
    job_deadline: { type: ["string", "null"] },
    job_requirements: { type: ["string", "null"] },
    job_responsibilities: { type: ["string", "null"] },
    job_skills: {
      type: ["string", "null"],
      description:
        "A single clean string formatted exactly as 'Explicit: item 1, item 2 | Inferred: item 1, item 2 | Suggested: item 1, item 2'. Explicit contains directly stated skills, tools, abilities, or competencies from the job post. Inferred contains useful skills reasonably implied by duties, responsibilities, industry, seniority, or context. Suggested contains practical role-relevant skills that would improve candidate fit. Remove duplicates across categories. Keep Explicit to up to 15 useful items, Inferred to up to 10 useful items, Suggested to up to 10 useful items. Do not make the skills list shorter unless existing items are noisy, duplicated, or wrong. If existing skills are thin, expand them. Use 'None' for an empty category. Exclude benefits, company descriptions, responsibilities, application instructions, job board text, ads, WhatsApp group text, and unrelated content.",
    },
    job_benefits: { type: ["string", "null"] },
    application_instructions: { type: ["string", "null"] },
  },
  required: [
    "job_location",
    "job_deadline",
    "job_requirements",
    "job_responsibilities",
    "job_skills",
    "job_benefits",
    "application_instructions",
  ],
} as const;

function normalizeNullableString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue ? normalizedValue : null;
}

function normalizeAnalysis(payload: unknown): JobAnalysisResponse {
  if (!payload || typeof payload !== "object") {
    return emptyAnalysis;
  }

  const candidate = payload as Record<string, unknown>;

  return {
    job_location: normalizeNullableString(candidate.job_location),
    job_deadline: normalizeNullableString(candidate.job_deadline),
    job_requirements: normalizeNullableString(candidate.job_requirements),
    job_responsibilities: normalizeNullableString(
      candidate.job_responsibilities,
    ),
    job_skills: normalizeJobSkills(normalizeNullableString(candidate.job_skills)),
    job_benefits: normalizeNullableString(candidate.job_benefits),
    application_instructions: normalizeNullableString(
      candidate.application_instructions,
    ),
  };
}

function normalizeExistingAnalysis(payload: unknown): ExistingAnalysisInput | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;

  return {
    job_location: normalizeNullableString(candidate.job_location),
    job_deadline: normalizeNullableString(candidate.job_deadline),
    job_requirements: normalizeNullableString(candidate.job_requirements),
    job_responsibilities: normalizeNullableString(
      candidate.job_responsibilities,
    ),
    job_skills: normalizeNullableString(candidate.job_skills),
    job_benefits: normalizeNullableString(candidate.job_benefits),
    application_instructions: normalizeNullableString(
      candidate.application_instructions,
    ),
  };
}

function hasExistingAnalysis(analysis: ExistingAnalysisInput | null) {
  if (!analysis) {
    return false;
  }

  return Object.values(analysis).some((value) => value !== null);
}

export async function POST(request: Request) {
  try {
    if (!openai) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is not configured." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as AnalyzeJobRequestBody;
    const rawJobText =
      typeof body.raw_job_text === "string" ? body.raw_job_text.trim() : "";
    const existingAnalysis = normalizeExistingAnalysis(body.existing_analysis);
    const isImprovementMode = hasExistingAnalysis(existingAnalysis);

    if (!rawJobText) {
      return NextResponse.json(
        { error: "raw_job_text is required." },
        { status: 400 },
      );
    }

    const systemPrompt = isImprovementMode
      ? [
          "You are a job analysis enhancement system.",
          "Return JSON ONLY.",
          "Treat existing_analysis as a draft, not final.",
          "Audit the draft against the raw job description.",
          "Preserve useful and correct content.",
          "Add missing relevant details clearly supported by the job post or strongly justified by the role context.",
          "Expand weak or thin sections.",
          "Improve specificity where the draft is vague.",
          "Do not simply return the existing analysis unchanged when any section is thin, vague, generic, or incomplete.",
          "Do not reduce useful content.",
          "Do not shrink good results.",
          "Never remove useful or correct information unless it is clearly noisy, duplicated, or wrong.",
          "If existing_analysis is weak, thin, generic, or incomplete, the enhanced output must be meaningfully improved.",
          "Avoid noise, ads, benefits in skills, WhatsApp group text, and unrelated posting text.",
          "For job_skills:",
          "- Always format it exactly as: 'Explicit: item 1, item 2 | Inferred: item 1, item 2 | Suggested: item 1, item 2'.",
          "- Explicit = directly stated in the job post.",
          "- Inferred = implied from responsibilities, context, industry, or seniority.",
          "- Suggested = useful additional skills that improve candidate fit for this specific role.",
          "- Strictly maintain category boundaries.",
          "- Explicit skills must ONLY include skills directly stated in the job description.",
          "- Do NOT place inferred skills, soft skills, or suggested skills inside Explicit.",
          "- Inferred skills should include skills logically implied by responsibilities or context. This is where soft skills like problem-solving, collaboration, and adaptability belong when justified.",
          "- Suggested skills should include useful additional skills that are not explicitly stated but would improve the candidate.",
          "- Do NOT move items from Inferred or Suggested into Explicit.",
          "- Do NOT mix categories.",
          "- If expanding, expand within the correct category only.",
          "- Preserve strong existing skills.",
          "- Add missing explicit skills from the job text.",
          "- Add useful inferred skills.",
          "- Add relevant suggested skills.",
          "- Expand weak lists and prefer richer useful output.",
          "- Apply minimum quality targets when the job description provides enough context.",
          "- Explicit should include all directly stated skills from the job description.",
          "- Inferred should aim for 6 to 10 relevant useful items.",
          "- Suggested should aim for 6 to 10 relevant useful items.",
          "- If Inferred has fewer than 6 useful items, expand it using the responsibilities, role level, and job context.",
          "- If Suggested has fewer than 5 useful items, expand it with practical, role-appropriate skills.",
          "- Do not downgrade strong results into generic ones.",
          "- Do not return identical job_skills unless the existing result is already comprehensive and correctly categorized.",
          "- Prefer specific skills over generic ones.",
          "- Remove duplicates across categories.",
          "- Do not include benefits, company description, job board text, ads, WhatsApp groups, responsibilities copied verbatim, or application instructions inside job_skills.",
          "- Skill limits: Explicit up to 15 useful items, Inferred up to 10 useful items, Suggested up to 10 useful items.",
          "- If a category truly has no data, use None for that category.",
          "For all fields, keep the output clean, useful, and accurate.",
          "If data is not found, return null.",
        ].join(" ")
      : [
          "You are a job analysis system.",
          "Extract structured information from the job description.",
          "Return JSON ONLY.",
          "For job_skills:",
          "- Always format it exactly as: 'Explicit: item 1, item 2 | Inferred: item 1, item 2 | Suggested: item 1, item 2'.",
          "- Explicit means skills, tools, abilities, or competencies directly written in the job post.",
          "- Inferred means skills reasonably implied by responsibilities, tasks, industry, seniority, or work context.",
          "- Suggested means practical additional skills that would improve a candidate's fit for THIS specific role.",
          "- Strictly maintain category boundaries.",
          "- Explicit must ONLY contain skills directly stated in the job post.",
          "- Do NOT place inferred skills, soft skills, or suggested skills under Explicit.",
          "- Inferred is the correct place for logically implied skills and soft skills such as problem-solving, collaboration, or adaptability when supported by the context.",
          "- Suggested should contain useful additional skills not explicitly stated in the posting.",
          "- Do NOT move items from Inferred or Suggested into Explicit.",
          "- Before generating skills, infer the role level from the description: internship/trainee/entry-level, junior, mid-level, senior, lead/manager, or executive.",
          "- Suggested skills must match the inferred level. Do not suggest senior-level skills for entry-level roles. Do not suggest beginner-level skills for senior roles.",
          "- For Suggested skills, only include a skill if it is clearly relevant to this specific job description.",
          "- Do not include generic or overused skills unless the job context strongly supports them.",
          "- Avoid default repetition such as Git or SQL unless justified by the role, industry, or responsibilities.",
          "- Do not blindly reuse examples.",
          "- Do not mix categories.",
          "- Do not place inferred or suggested skills under Explicit.",
          "- If expanding, expand within the correct category only.",
          "- Remove duplicates across all categories.",
          "- Skill limits: Explicit up to 15 useful items, Inferred up to 10 useful items, Suggested up to 10 useful items.",
          "- If a category has no data, use None for that category.",
          "- Do not include benefits, company description, job board text, WhatsApp groups, ads, application instructions, or unrelated noisy content inside job_skills.",
          "- Suggested skills must be realistic for the role level and industry.",
          "- Avoid random generic skills unless they are clearly relevant.",
          "- Keep job_skills clean, structured, context-aware, role-appropriate, readable, and not repetitive.",
          "For all fields, keep the output concise and clean.",
          "If data is not found, return null.",
        ].join(" ");

    const completionRequest = {
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            `Mode: ${isImprovementMode ? "Improve existing analysis" : "First-time analysis"}`,
            "Raw job text:",
            rawJobText,
            isImprovementMode
              ? `Existing analysis:\n${JSON.stringify(existingAnalysis, null, 2)}`
              : "Existing analysis: none",
          ].join("\n\n"),
        },
      ],
      temperature: isImprovementMode ? 0.2 : 0,
      top_p: isImprovementMode ? 0.9 : 1,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "job_analysis",
          strict: true,
          schema: analysisSchema,
        },
      },
      stream: false,
      provider: {
        require_parameters: true,
      },
    } as Parameters<typeof openai.chat.completions.create>[0];

    const response = (await openai.chat.completions.create(
      completionRequest,
    )) as OpenAI.Chat.ChatCompletion;

    const responseText = response.choices[0]?.message?.content ?? "";
    const parsedAnalysis = responseText
      ? (JSON.parse(responseText) as unknown)
      : null;

    return NextResponse.json(normalizeAnalysis(parsedAnalysis));
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const status = error.status ?? 500;
      const message =
        status === 401
          ? "OpenRouter rejected the API key."
          : status === 429
            ? "OpenRouter rate limit or quota reached. Please try again later."
            : status === 404
              ? "The selected OpenRouter model is unavailable right now."
              : status === 400 || status === 422
                ? error.message ||
                  "OpenRouter could not process this analysis request."
                : error.message || "OpenRouter failed to analyze job text.";

      return NextResponse.json({ error: message }, { status });
    }

    const message =
      error instanceof Error ? error.message : "Failed to analyze job text.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
