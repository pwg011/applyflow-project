"use client";

import * as pdfjs from "pdfjs-dist";
import type { PDFPageProxy } from "pdfjs-dist/types/src/pdf";
import { recognize } from "tesseract.js";

type OcrPdfOptions = {
  maxPages?: number;
  scale?: number;
  onProgress?: (message: string) => void;
};

const defaultOcrScale = 2.5;

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

function ensureBrowser() {
  if (typeof window === "undefined") {
    throw new Error("Browser OCR can only run in the browser.");
  }
}

function getPageLimit(pageCount: number, maxPages = 3) {
  return Math.min(pageCount, Math.max(1, Math.floor(maxPages)));
}

async function renderPdfPageToCanvas(
  page: PDFPageProxy,
  scale: number,
) {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not prepare browser canvas for PDF OCR.");
  }

  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  console.info("[browser-ocr] canvas prepared", {
    width: canvas.width,
    height: canvas.height,
    scale,
  });

  await page.render({
    canvas,
    canvasContext: context,
    viewport,
  }).promise;

  return canvas;
}

export async function ocrPdfBlobInBrowser(
  pdfBlob: Blob,
  options: OcrPdfOptions = {},
): Promise<string> {
  ensureBrowser();

  const { maxPages = 3, scale = defaultOcrScale, onProgress } = options;

  onProgress?.("Preparing scanned PDF...");

  const arrayBuffer = await pdfBlob.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  if (pdf.numPages <= 0) {
    throw new Error("The PDF does not contain any pages to scan.");
  }

  const pagesToProcess = getPageLimit(pdf.numPages, maxPages);
  console.info("[browser-ocr] PDF loaded", {
    pageCount: pdf.numPages,
    maxPages,
    pagesToProcess,
  });

  const pageTexts: string[] = [];

  for (let pageNumber = 1; pageNumber <= pagesToProcess; pageNumber += 1) {
    onProgress?.(`Reading page ${pageNumber} of ${pagesToProcess}...`);
    console.info("[browser-ocr] rendering page", {
      pageNumber,
      pagesToProcess,
    });

    const page = await pdf.getPage(pageNumber);
    const canvas = await renderPdfPageToCanvas(page, scale);

    onProgress?.(`Scanning page ${pageNumber} of ${pagesToProcess}...`);

    const result = await recognize(canvas, "eng");
    const pageText = result.data.text.trim();
    console.info("[browser-ocr] Tesseract page finished", {
      pageNumber,
      textLength: pageText.length,
    });
    pageTexts.push(pageText);
  }

  onProgress?.("Finished scanning PDF.");

  await pdf.destroy();

  const combinedText = pageTexts.filter(Boolean).join("\n\n").trim();
  console.info("[browser-ocr] combined OCR text", {
    textLength: combinedText.length,
  });

  return combinedText;
}
