import OpenAI from "openai";
import { NextResponse } from "next/server";

type AnalyzeJobRequestBody = {
  raw_job_text?: unknown;
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
        "A single concise string formatted exactly as 'Explicit: item 1, item 2 | Inferred: item 1, item 2 | Suggested: item 1, item 2'. Explicit contains only directly stated skills. Inferred contains only reasonably implied skills. Suggested contains only role-appropriate additional skills for this specific job and level. Remove duplicates across categories. Keep Explicit to max 8 items, Inferred to max 6, Suggested to max 6. Use 'None' for an empty category. Exclude benefits, company descriptions, responsibilities, application instructions, job board text, ads, and unrelated content.",
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
    job_skills: normalizeNullableString(candidate.job_skills),
    job_benefits: normalizeNullableString(candidate.job_benefits),
    application_instructions: normalizeNullableString(
      candidate.application_instructions,
    ),
  };
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

    if (!rawJobText) {
      return NextResponse.json(
        { error: "raw_job_text is required." },
        { status: 400 },
      );
    }

    const completionRequest = {
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content: [
            "You are a job analysis system.",
            "Extract structured information from the job description.",
            "Return JSON ONLY.",
            "For job_skills:",
            "- Always format it exactly as: 'Explicit: item 1, item 2 | Inferred: item 1, item 2 | Suggested: item 1, item 2'.",
            "- Explicit means skills, tools, abilities, or competencies directly written in the job post.",
            "- Inferred means skills reasonably implied by responsibilities, tasks, industry, or work context.",
            "- Suggested means practical additional skills that would improve a candidate's fit for THIS specific role.",
            "- Before generating skills, infer the role level from the description: internship/trainee/entry-level, junior, mid-level, senior, lead/manager, or executive.",
            "- Suggested skills must match the inferred level. Do not suggest senior-level skills for entry-level roles. Do not suggest beginner-level skills for senior roles.",
            "- For Suggested skills, only include a skill if it is clearly relevant to this specific job description.",
            "- Do not include generic or overused skills unless the job context strongly supports them.",
            "- Avoid default repetition such as Git or SQL unless justified by the role, industry, or responsibilities.",
            "- Do not blindly reuse examples.",
            "- Do not mix categories.",
            "- Do not place inferred or suggested skills under Explicit.",
            "- Remove duplicates across all categories.",
            "- Keep it concise: Explicit max 8 items, Inferred max 6 items, Suggested max 6 items.",
            "- If a category has no data, use None for that category.",
            "- Do not include benefits, company description, responsibilities, application instructions, job board text, WhatsApp groups, ads, or unrelated noisy content.",
            "- Keep job_skills clean, structured, context-aware, role-appropriate, and not repetitive.",
            "For all fields, keep the output concise and clean.",
            "If data is not found, return null.",
          ].join(" "),
        },
        {
          role: "user",
          content: rawJobText,
        },
      ],
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
