# ApplyFlow

ApplyFlow is a job application tracker and AI-assisted job application assistant built with Next.js, Supabase, and OpenRouter.

## Current Features

- Authentication
- Application tracking
- Manual job creation
- Job import from pasted job text/link
- Raw job posting storage
- AI job analysis
- Persona management
- CV upload
- PDF and DOCX CV extraction
- Browser OCR fallback for scanned PDFs
- Rebuild persona from replaced CV

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- OpenRouter
- mammoth
- unpdf
- pdfjs-dist
- tesseract.js
- Vercel

## Environment Variables

Create a local environment file and configure:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENROUTER_API_KEY=
```

Do not expose `OPENROUTER_API_KEY` publicly.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Deployment Notes

- Deployed on Vercel.
- Environment variables must be added in Vercel.
- `OPENROUTER_API_KEY` must not be public.

## Notes

- Scanned PDF OCR runs in the browser.
- AI results are reviewable before saving in the persona flow.
- Job analysis currently saves analysis directly.
