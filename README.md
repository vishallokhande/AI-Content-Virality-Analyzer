# ViralScore AI — Content Virality Analyzer

An AI-powered web app that scores the viral potential of social media content (videos, images, captions) across platforms like TikTok, Instagram, YouTube, Twitter/X, and LinkedIn.

Built with **Next.js 16**, **React 19**, **TypeScript**, **TailwindCSS 4**, and **Supabase**.

---

## Live Demo

> Run locally — see setup below.

---

## What It Does

1. **Upload content** — video, image, or paste a caption
2. **Select your platform** — TikTok, Instagram, YouTube, Twitter/X, LinkedIn
3. **Get a Virality Score (0–100)** — backed by 50+ engagement signals
4. **Receive actionable breakdown** — hook analysis, caption rewrites, trending hashtags, audio recommendations, competitor comparison
5. **Track history** — dashboard with trend chart across past analyses

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| UI | React 19 + TailwindCSS 4 + shadcn/ui |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Notifications | Sonner |
| Auth / DB | Supabase (SSR) |
| Storage | localStorage (analysis history) |

---

## Project Structure

```
├── app/
│   ├── page.tsx                  # Landing page
│   ├── analyze/page.tsx          # Upload + platform selection form
│   ├── results/[id]/page.tsx     # Virality score report
│   ├── dashboard/page.tsx        # Analysis history + trend chart
│   ├── upgrade/page.tsx          # Pricing / Pro upgrade
│   ├── auth/                     # Login / Signup pages
│   ├── profile/page.tsx          # User profile
│   └── api/analyze/route.ts      # Core scoring engine (API route)
├── components/
│   ├── navigation.tsx            # Sticky nav with auth state
│   ├── footer.tsx
│   └── ui/                       # shadcn/ui components
├── contexts/
│   ├── auth-context.tsx          # Supabase auth state
│   └── subscription-context.tsx  # Free / Pro tier state
├── lib/
│   └── supabase/                 # Browser + server Supabase clients
└── app/globals.css               # TailwindCSS v4 theme + custom utilities
```

---

## Quick Start

### Prerequisites

- Node.js v20+
- npm (pnpm optional)

### Setup

```bash
# 1. Clone
git clone https://github.com/vishallokhande/AI-Content-Virality-Analyzer.git
cd AI-Content-Virality-Analyzer

# 2. Install (offline-safe — uses npm cache)
npm install --prefer-offline

# 3. Configure environment
# Create .env.local with your Supabase keys:
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-key>

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How the Scoring Engine Works

No external AI API is used. The engine (`app/api/analyze/route.ts`) uses a **deterministic seeded RNG** based on:

- Content hash (filename + size)
- Platform selected
- Caption text length and keywords

This produces stable, reproducible scores for the same input while generating varied results across different content. Scores are computed across dimensions:

| Dimension | What It Measures |
|---|---|
| Hook Strength | First-frame / first-line impact |
| Caption Quality | CTR signals, emotional triggers |
| Thumbnail Appeal | Visual contrast, text overlay |
| Audio Match | Trending sound alignment |
| Hashtag Strategy | Reach vs. niche balance |
| Competitor Gap | Positioning vs. top creators |

---

## Key Learnings

### 1. Next.js 16 App Router
- Every page is a Server Component by default — client interactivity requires `"use client"`
- API routes live in `app/api/[route]/route.ts` and export named HTTP handlers (`GET`, `POST`)
- `useRouter`, `usePathname`, `useSearchParams` only work inside Client Components

### 2. TailwindCSS v4
- No `tailwind.config.js` needed — configuration lives in CSS via `@theme` block
- Custom design tokens (colors, radii, fonts) defined with CSS variables inside `@theme inline {}`
- `@custom-variant` replaces the old `darkMode` config — dark styles use `.dark` class variant
- IDE linters may flag `@theme`, `@apply`, `@custom-variant` as unknown — suppress with `"css.lint.unknownAtRules": "ignore"` in `.vscode/settings.json`

### 3. React 19 Hydration
- Browser extensions (e.g. Grammarly) inject attributes onto `<body>` before React hydrates — causing SSR/client mismatch warnings
- Fix: add `suppressHydrationWarning` to `<body>` in `layout.tsx`
- Root cause: the mismatch is external, not a code bug

### 4. Offline npm Install
- `npm install` needs network to resolve peer dependencies even when packages are cached
- Workaround: use `"overrides"` in `package.json` to pin transitive deps to cached versions
- Then `npm install --prefer-offline` installs entirely from the local cache

### 5. TypeScript Strict Typing
- Union literal types (`"rising" | "peak" | "declining"`) reject string values not in the union at compile time
- Always match data literals exactly to the declared type — no implicit `"stable"` if the type doesn't include it

### 6. Supabase SSR Auth
- `@supabase/ssr` provides `createBrowserClient` for client components and `createServerClient` for server components / middleware
- Auth state is managed via React Context (`AuthProvider`) so all components can read `user` and `isLoading`
- Subscription tier (Free/Pro) is a separate context reading from a `subscriptions` table

### 7. localStorage for Persistence (No Backend Required)
- Analysis history is stored as JSON in `localStorage` under a single key (`vs_history`)
- Limited to 20 entries (FIFO eviction) to prevent unbounded storage growth
- Dashboard reads and renders the history client-side with no API call needed

---

## Scripts

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

---

## Notes

- **No real payments** — upgrade flow is simulated
- **No real AI** — scoring uses deterministic seeded RNG; swap `app/api/analyze/route.ts` with an OpenAI/Gemini call to make it real
- **Supabase optional** — auth/subscription features require Supabase; the analyze/results/dashboard flow works without it
