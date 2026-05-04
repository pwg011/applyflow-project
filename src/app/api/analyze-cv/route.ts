import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import {
  extractCvTextFromFile,
  normalizeExtractedText,
} from "@/utils/cvTextExtractor";

export const runtime = "nodejs";

type AnalyzeCvRequestBody = {
  persona_id?: unknown;
  cv_file_path?: unknown;
  cv_text?: unknown;
};

type CvAnalysisResponse = {
  display_name: string;
  email: string;
  phone: string;
  professional_title: string;
  target_role: string;
  skills: string;
  experience_summary: string;
};

const openRouterApiKey = process.env.OPENROUTER_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const personaCvBucketName = "persona-cvs";
const cvAnalysisModel = "openai/gpt-4o-mini";

const openai = openRouterApiKey
  ? new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: openRouterApiKey,
      defaultHeaders: {
        "X-Title": "ApplyFlow",
      },
    })
  : null;

const cvAnalysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    display_name: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
    professional_title: { type: "string" },
    target_role: { type: "string" },
    skills: {
      type: "string",
      description:
        "Comma-separated skills only. Keep concise, professional, and job-market appropriate.",
    },
    experience_summary: {
      type: "string",
      description:
        "Short, clear, useful summary of the candidate's strongest experience.",
    },
  },
  required: [
    "display_name",
    "email",
    "phone",
    "professional_title",
    "target_role",
    "skills",
    "experience_summary",
  ],
} as const;

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function normalizeDisplayName(value: unknown) {
  return normalizeString(value).replace(/^[^A-Za-z]+/, "").trim();
}

function keepConciseRole(value: unknown) {
  return normalizeString(value).split(" ").slice(0, 8).join(" ");
}

function getFileExtension(value: string) {
  return value.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? "unknown";
}

function hasMeaningfulContent(value: string) {
  return /[A-Za-z0-9]/.test(value.trim());
}

function isMeaningfulCvAnalysis(result: CvAnalysisResponse) {
  const meaningfulFields = [
    result.display_name,
    result.professional_title,
    result.target_role,
    result.skills,
    result.experience_summary,
  ].filter(hasMeaningfulContent);

  return meaningfulFields.length >= 2;
}

function normalizeCvAnalysis(payload: unknown): CvAnalysisResponse {
  if (!payload || typeof payload !== "object") {
    return {
      display_name: "",
      email: "",
      phone: "",
      professional_title: "",
      target_role: "",
      skills: "",
      experience_summary: "",
    };
  }

  const candidate = payload as Record<string, unknown>;

  return {
    display_name: normalizeDisplayName(candidate.display_name),
    email: normalizeString(candidate.email),
    phone: normalizeString(candidate.phone),
    professional_title: keepConciseRole(candidate.professional_title),
    target_role: keepConciseRole(candidate.target_role),
    skills: normalizeString(candidate.skills),
    experience_summary: normalizeString(candidate.experience_summary),
  };
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID().slice(0, 8);
  const logPrefix = `[analyze-cv:${requestId}]`;
  const totalStartedAt = Date.now();
  let stageStartedAt = totalStartedAt;
  let currentStage = "start";

  function mark(stage: string, metadata?: Record<string, unknown>) {
    const now = Date.now();
    console.info(`${logPrefix} ${stage} ${now - stageStartedAt}ms`, metadata ?? {});
    stageStartedAt = now;
    currentStage = stage;
  }

  function logFailure(error: unknown) {
    console.error(`${logPrefix} failed stage=${currentStage}`, {
      errorMessage: error instanceof Error ? error.message : String(error),
    });
  }

  function logTotal(status: number) {
    console.info(`${logPrefix} total ${Date.now() - totalStartedAt}ms`, {
      status,
    });
  }

  function jsonResponse(
    body: Parameters<typeof NextResponse.json>[0],
    init?: Parameters<typeof NextResponse.json>[1],
    metadata?: Record<string, unknown>,
  ) {
    const status = init?.status ?? 200;
    mark("response-ready", { status, ...metadata });
    logTotal(status);
    return NextResponse.json(body, init);
  }

  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      logFailure(new Error("Supabase client environment variables are not configured."));
      return jsonResponse(
        { error: "Supabase client environment variables are not configured." },
        { status: 500 },
      );
    }

    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      mark("auth", { authenticated: false });
      return jsonResponse(
        { error: "You must be authenticated to analyze a CV." },
        { status: 401 },
      );
    }

    const body = (await request.json()) as AnalyzeCvRequestBody;
    const personaId =
      typeof body.persona_id === "string" ? body.persona_id.trim() : "";
    const cvFilePath =
      typeof body.cv_file_path === "string" ? body.cv_file_path.trim() : "";
    const providedCvText =
      typeof body.cv_text === "string" ? normalizeExtractedText(body.cv_text) : "";

    mark("parse-body", {
      hasPersonaId: Boolean(personaId),
      hasCvFilePath: Boolean(cvFilePath),
      fileExtension: cvFilePath ? getFileExtension(cvFilePath) : "none",
      cvTextProvided: Boolean(providedCvText),
      providedTextLength: providedCvText.length,
      storageBucket: personaCvBucketName,
    });

    if (!personaId || (!cvFilePath && !providedCvText)) {
      return jsonResponse(
        { error: "persona_id and either cv_file_path or cv_text are required." },
        { status: 400 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    mark("auth", { authenticated: Boolean(user), hasError: Boolean(userError) });

    if (userError || !user) {
      return jsonResponse(
        { error: "Could not verify the authenticated user." },
        { status: 401 },
      );
    }

    const { data: persona, error: personaError } = await supabase
      .from("personas")
      .select("id, user_id, cv_file_path, cv_file_name")
      .eq("id", personaId)
      .eq("user_id", user.id)
      .maybeSingle();

    mark("persona-check", {
      found: Boolean(persona),
      hasError: Boolean(personaError),
      hasSavedCvPath: Boolean(persona?.cv_file_path),
    });

    if (personaError || !persona) {
      return jsonResponse(
        { error: "Could not find that persona for the current user." },
        { status: 404 },
      );
    }

    let extractedText = providedCvText;

    if (!extractedText) {
      if (!persona.cv_file_path) {
        mark("text-ready", { hasText: false, source: "none" });
        return jsonResponse(
          { error: "No CV is attached to this persona." },
          { status: 400 },
        );
      }

      if (persona.cv_file_path !== cvFilePath) {
        mark("text-ready", { hasText: false, source: "path-mismatch" });
        return jsonResponse(
          { error: "The requested CV file does not match the saved persona CV." },
          { status: 400 },
        );
      }

      const { data: cvBlob, error: downloadError } = await supabase.storage
        .from(personaCvBucketName)
        .download(cvFilePath);

      mark("storage-download", {
        hasBlob: Boolean(cvBlob),
        hasError: Boolean(downloadError),
        blobSize: cvBlob?.size ?? 0,
        blobType: cvBlob?.type || "unknown",
        fileExtension: getFileExtension(cvFilePath),
      });

      if (downloadError || !cvBlob) {
        return jsonResponse(
          { error: "Could not download the CV file." },
          { status: 500 },
        );
      }

      const cvBuffer = Buffer.from(await cvBlob.arrayBuffer());

      mark("buffer-conversion", {
        bufferLength: cvBuffer.length,
        blobType: cvBlob.type || "unknown",
      });

      if (cvBuffer.length === 0) {
        mark("text-ready", { hasText: false, source: "empty-buffer" });
        return jsonResponse(
          { error: "The CV file appears to be empty." },
          { status: 500 },
        );
      }

      const extractionResult = await extractCvTextFromFile({
        buffer: cvBuffer,
        fileName: persona.cv_file_name || cvFilePath,
        filePath: persona.cv_file_path || cvFilePath,
        contentType: cvBlob.type || "",
      });

      mark("extraction", {
        status: extractionResult.status,
        method: "source" in extractionResult ? extractionResult.source : "unknown",
        textLength: "textLength" in extractionResult ? extractionResult.textLength : 0,
        signalCount: "signalCount" in extractionResult ? extractionResult.signalCount : 0,
        needsClientOcr: extractionResult.status === "needs_client_ocr",
      });

      if (extractionResult.status === "needs_client_ocr") {
        mark("text-ready", {
          hasText: false,
          needsClientOcr: true,
          textLength: extractionResult.textLength,
          signalCount: extractionResult.signalCount,
        });

        return jsonResponse({
          needsClientOcr: true,
          reason: extractionResult.reason,
        });
      }

      if (extractionResult.status !== "success") {
        mark("text-ready", {
          hasText: false,
          status: extractionResult.status,
        });

        return jsonResponse(
          { error: extractionResult.error },
          { status: 400 },
        );
      }

      extractedText = extractionResult.text;
    }

    mark("text-ready", {
      hasText: Boolean(extractedText),
      textLength: extractedText.length,
      source: providedCvText ? "provided-text" : "extracted-file",
    });

    if (!openai) {
      return jsonResponse(
        { error: "OPENROUTER_API_KEY is not configured." },
        { status: 500 },
      );
    }

    console.info(`${logPrefix} OpenRouter called`, { model: cvAnalysisModel });

    const completionRequest = {
      model: cvAnalysisModel,
      messages: [
        {
          role: "system",
          content: [
            "You extract structured persona fields from CV text with grounded, context-aware reasoning.",
            "Return valid JSON only. No markdown. No explanation.",
            "This is an extraction and review system, not a final resume writer.",
            "The goal is to extract the candidate's CV information into editable persona fields, not to over-curate or narrow the person's profile.",
            "The review pane exists so the user can edit later, so extract generously and preserve the range of skills and experience shown in the CV.",
            "Do not invent information, but intelligently infer fields when the CV supports the inference.",
            "Do not only copy explicitly labelled fields; reason from the CV's work history, summary, headline, title, skills emphasis, and repeated role language.",
            "If a field is missing or not clearly supported by the CV, return an empty string.",
            "Do not force the CV into only one career direction.",
            "Do not remove skills simply because they come from different work areas.",
            "If the CV includes engineering, customer support, project coordination, tools, writing, admin, or other skills, include them if they are clearly present.",
            "Structure the CV content cleanly while leaving the user in control.",
            "Clean OCR artifacts, repeated whitespace, stray symbols, and obvious extraction noise.",
            "display_name: return the candidate's full name only, cleaned of OCR symbols and noise.",
            "email: return the clearest email found.",
            "phone: return the clearest phone number found.",
            "professional_title: return clean professional role titles. The field may contain more than one title if the CV clearly supports multiple professional identities. Use only titles supported by the CV's headline, summary, current or recent experience, work history, or repeated skill pattern. Separate multiple titles with this exact separator: ' | '. Each title should be clean, role-like, and concise. Do not use descriptive phrases, personality descriptions, marketing language, or summary-style wording. Do not include words that merely describe focus, experience level, personality, or value proposition. Do not invent role titles outside the CV. Do not add too many titles. Include only the strongest clearly supported titles. If one title is clearly dominant, return only that title.",
            "target_role: use the stated or clearly implied target role from the CV. If the CV is tailored toward a role, use that role. If no target role is clear, return an empty string. Do not make target_role conflict with professional_title. If uncertain, prefer leaving target_role empty.",
            "skills: extract all clearly listed skills from the CV as a comma-separated string. Include technical skills, tools, software, role skills, and clearly listed soft skills. Deduplicate only exact or near-exact duplicates. Do not aggressively reduce the list or cap it too tightly. A long skills list is acceptable because the user can edit it in the review pane.",
            "experience_summary: write in professional CV summary style. Do not include the candidate's name. Do not use first-person or third-person pronouns. Start directly with the candidate's professional identity, background, strengths, or experience. Summarize only what is supported by the CV. Preserve the candidate's range of experience where relevant. Do not exaggerate. Do not turn it into a cover letter. Write 2 to 4 clear sentences.",
          ].join(" "),
        },
        {
          role: "user",
          content: [
            "Extract the following persona fields from this CV:",
            "display_name, email, phone, professional_title, target_role, skills, experience_summary.",
            "CV text:",
            extractedText,
          ].join("\n\n"),
        },
      ],
      temperature: 0,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "cv_persona_analysis",
          strict: true,
          schema: cvAnalysisSchema,
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
    mark("openrouter", {
      model: cvAnalysisModel,
      hasChoices: Array.isArray(response.choices),
      choiceCount: response.choices?.length ?? 0,
    });

    const firstChoice = Array.isArray(response.choices)
      ? response.choices[0]
      : undefined;
    const responseText = firstChoice?.message?.content ?? "";

    if (!responseText) {
      mark("parse-ai-response", { status: "empty-content" });
      return jsonResponse(
        { error: "OpenRouter returned an empty CV analysis response." },
        { status: 500 },
      );
    }

    let parsedAnalysis: unknown;

    try {
      parsedAnalysis = JSON.parse(responseText) as unknown;
    } catch {
      mark("parse-ai-response", { status: "invalid-json" });
      return jsonResponse(
        { error: "OpenRouter returned invalid JSON for CV analysis." },
        { status: 500 },
      );
    }

    const normalizedAnalysis = normalizeCvAnalysis(parsedAnalysis);
    const parsedKeys =
      parsedAnalysis && typeof parsedAnalysis === "object"
        ? Object.keys(parsedAnalysis as Record<string, unknown>)
        : [];

    if (!isMeaningfulCvAnalysis(normalizedAnalysis)) {
      console.error(`${logPrefix} unusable CV analysis`, {
        parsedKeys,
      });
      mark("parse-ai-response", {
        status: "unusable-output",
        parsedKeys,
      });
      return jsonResponse(
        { error: "AI returned an unusable CV analysis. Please try again." },
        { status: 502 },
      );
    }

    mark("parse-ai-response", {
      status: "ok",
      parsedKeys,
    });

    return jsonResponse(normalizedAnalysis);
  } catch (error) {
    logFailure(error);

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
                ? error.message || "OpenRouter could not analyze this CV."
                : error.message || "OpenRouter failed to analyze the CV.";

      return jsonResponse({ error: message }, { status });
    }

    return jsonResponse(
      {
        error:
          error instanceof Error ? error.message : "Failed to analyze the CV.",
      },
      { status: 500 },
    );
  }
}
