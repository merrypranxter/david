# Machine-Native Prompt Synthesizer (David)

Vite + React front end with a Gemini-backed API.

## How the API is served

The UI calls `POST /api/synthesize` and `POST /api/simulate-target`. The same logic
lives in one place (`lib/david.ts`) and is exposed by two different runtimes:

| Environment            | Runtime                                   |
| ---------------------- | ----------------------------------------- |
| AI Studio / local dev  | Express server in `server.ts` (`npm run dev`) |
| Netlify                | Functions in `netlify/functions/`, routed by `netlify.toml` |

Netlify does not run `server.ts`; it only publishes the static Vite build plus
serverless functions. Without `netlify.toml` and the functions, `/api/*` falls
through to the SPA fallback and returns HTML, so the Synthesize button appears to
do nothing.

## Required configuration

Set `GEMINI_API_KEY` in the environment:

- Local: copy `.env.example` to `.env` and fill it in.
- Netlify: Site configuration → Environment variables → `GEMINI_API_KEY`, then redeploy.

`GET /api/health` reports `apiKeyConfigured` so you can verify the deploy quickly.

## Scripts

- `npm run dev` – Express + Vite middleware on port 3000
- `npm run build` – Vite build (`dist/`) + bundled Express server (`dist/server.cjs`)
- `npm run lint` – TypeScript typecheck
