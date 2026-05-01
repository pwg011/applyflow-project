import mammoth from "mammoth";
import { extractText, getDocumentProxy } from "unpdf";

const weakPdfReason = "PDF text extraction was weak. Client OCR required.";
const cvSignalPatterns = [
  /\bexperience\b/i,
  /\beducation\b/i,
  /\bskills?\b/i,
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /(?:\+?\d[\d\s().-]{7,}\d)/,
  /\bwork\b/i,
  /\bprojects?\b/i,
  /\bsummary\b/i,
  /\bcertifications?\b/i,
  /\bemployment\b/i,
  /\buniversity\b/i,
  /\bdegrees?\b/i,
];

type ExtractCvTextSuccess = {
  status: "success";
  text: string;
  source: "pdf" | "docx";
  textLength: number;
  signalCount: number;
};

type ExtractCvTextNeedsClientOcr = {
  status: "needs_client_ocr";
  needsClientOcr: true;
  reason: typeof weakPdfReason;
  textLength: number;
  signalCount: number;
};

type ExtractCvTextFailure = {
  status: "unsupported_file_type" | "no_text_found" | "extraction_failed";
  error: string;
};

export type ExtractCvTextResult =
  | ExtractCvTextSuccess
  | ExtractCvTextNeedsClientOcr
  | ExtractCvTextFailure;

export function normalizeExtractedText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function countCvSignals(value: string) {
  return cvSignalPatterns.reduce(
    (count, pattern) => count + (pattern.test(value) ? 1 : 0),
    0,
  );
}

function getTextQuality(value: string) {
  const normalized = normalizeExtractedText(value);
  const signalCount = countCvSignals(normalized);

  return {
    normalized,
    signalCount,
    isStrong: normalized.length >= 700 && signalCount >= 2,
  };
}

function getFileExtension(fileName: string) {
  const extensionMatch = fileName.toLowerCase().match(/\.([a-z0-9]+)$/);

  return extensionMatch?.[1] ?? "";
}

function isPdfFile(fileName: string, contentType: string) {
  return contentType === "application/pdf" || getFileExtension(fileName) === "pdf";
}

function isDocxFile(fileName: string, contentType: string) {
  return (
    contentType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    getFileExtension(fileName) === "docx"
  );
}

export async function extractCvTextFromPdf(pdfBuffer: Buffer) {
  try {
    const pdf = await getDocumentProxy(new Uint8Array(pdfBuffer));
    const { text, totalPages } = await extractText(pdf, { mergePages: true });
    const quality = getTextQuality(text);

    console.info("[analyze-cv] PDF pages:", totalPages);
    console.info("[analyze-cv] unpdf text length:", quality.normalized.length);
    console.info("[analyze-cv] CV signal count:", quality.signalCount);

    if (!quality.isStrong) {
      return {
        status: "needs_client_ocr",
        needsClientOcr: true,
        reason: weakPdfReason,
        textLength: quality.normalized.length,
        signalCount: quality.signalCount,
      } satisfies ExtractCvTextNeedsClientOcr;
    }

    return {
      status: "success",
      text: quality.normalized,
      source: "pdf",
      textLength: quality.normalized.length,
      signalCount: quality.signalCount,
    } satisfies ExtractCvTextSuccess;
  } catch (error) {
    console.error("[analyze-cv] PDF text extraction failed:", error);

    return {
      status: "needs_client_ocr",
      needsClientOcr: true,
      reason: weakPdfReason,
      textLength: 0,
      signalCount: 0,
    } satisfies ExtractCvTextNeedsClientOcr;
  }
}

export async function extractCvTextFromDocx(docxBuffer: Buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer: docxBuffer });
    const quality = getTextQuality(result.value);

    console.info("[analyze-cv] mammoth text length:", quality.normalized.length);
    console.info("[analyze-cv] CV signal count:", quality.signalCount);

    if (!quality.normalized) {
      return {
        status: "no_text_found",
        error: "No readable text was found in this DOCX file.",
      } satisfies ExtractCvTextFailure;
    }

    return {
      status: "success",
      text: quality.normalized,
      source: "docx",
      textLength: quality.normalized.length,
      signalCount: quality.signalCount,
    } satisfies ExtractCvTextSuccess;
  } catch (error) {
    console.error("[analyze-cv] DOCX text extraction failed:", error);

    return {
      status: "extraction_failed",
      error: "Could not read text from this DOCX file.",
    } satisfies ExtractCvTextFailure;
  }
}

export async function extractCvTextFromFile({
  buffer,
  fileName,
  contentType,
}: {
  buffer: Buffer;
  fileName: string;
  contentType: string;
}) {
  if (isPdfFile(fileName, contentType)) {
    return extractCvTextFromPdf(buffer);
  }

  if (isDocxFile(fileName, contentType)) {
    return extractCvTextFromDocx(buffer);
  }

  return {
    status: "unsupported_file_type",
    error: "Only PDF and DOCX CV files can be analyzed.",
  } satisfies ExtractCvTextFailure;
}
