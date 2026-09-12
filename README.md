# AI Boilerplate Copy Generator

Generates on-brand product descriptions and social media posts for small businesses using the Google Gemini API — driven by a brand voice template you provide, not generic AI filler.

## How it works

- `public/` — the frontend (plain HTML/CSS/JS, no build step)
- `api/generate.js` — a Vercel serverless function that calls the Gemini API server-side, so your API key is never exposed to visitors

## Setup

### 1. Get a free Gemini API key

1. Go to [aistudio.google.com](https://aistudio.google.com) and sign in with a Google account (no credit card required).
2. Click **Get API key** in the left sidebar, then **Create API key**.
3. Choose "Create key in new project" (fastest, zero config).
4. Copy the generated key.

Google AI Studio's free tier is generous enough for a portfolio demo — check current limits at [ai.google.dev/gemini-api/docs/rate-limits](https://ai.google.dev/gemini-api/docs/rate-limits).

### 2. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. In the project's **Settings → Environment Variables**, add:
   - Key: `GEMINI_API_KEY`
   - Value: your API key from step 1
4. Deploy. Vercel automatically detects `api/generate.js` as a serverless function — no extra config needed.

### 3. Run locally (optional)

```bash
npm install -g vercel
vercel dev
```

Create a `.env` file (copy `.env.example`) with your real key before running.

## Notes

- The model used is `gemini-flash-latest`, an alias that always points to Google's current fast Gemini model — no need to update the code when Google releases a new version.
- Never put your API key in frontend code (`public/`) — it must only live in the serverless function's environment variables, or anyone visiting the site could steal and use it.
- This is a demo/portfolio project. For real production use with paying customers, you'd want to add rate limiting, user accounts, and usage caps so one visitor can't run up your usage.
