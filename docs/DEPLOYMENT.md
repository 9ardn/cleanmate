# Deployment

CleanMate is a Next.js 16 (App Router) app backed by Supabase. The recommended
host is Vercel — Next.js zero-config builds, edge caching, automatic preview
deploys per branch.

---

## 0. Prerequisites

- A Supabase project with the SQL bundle from `supabase/` already applied
  (`schema.sql` → `functions.sql` → `policies.sql`, optional `seed.sql`).
- A storage bucket named `verifications` with the storage policies from
  `supabase/policies.sql` (search for `STORAGE POLICIES` in that file).
- A Vercel account, GitHub repo connected to it.
- Node 20.9+ locally (matches `engines.node` in `package.json`).

---

## 1. Verify the build locally

Always run a clean build before pushing — Vercel will run the same command.

```bash
npm install
npm run type-check
npm run build
```

A green build emits ~22 routes and a `Proxy (Middleware)` line. Any TypeScript
or runtime error here will fail the Vercel deploy too.

---

## 2. Environment variables

CleanMate reads these at build and runtime. See `.env.local.example` for the
authoritative list.

| Name | Required | Where it's used | Notes |
|------|----------|-----------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | All Supabase clients (browser + SSR + middleware + auth callback) | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Same | Public, RLS-gated |
| `NEXT_PUBLIC_SITE_URL` | ✅ in prod | `components/modals/ShareModal.tsx` (invite links) | Set to your canonical domain (e.g. `https://cleanmate.vercel.app`). Locally falls back to `window.location.origin`. |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ | _Not referenced today._ Reserve only for future server-only admin paths (cron, batch). Never expose to client. | Server-only |

### Setting them in Vercel

Project Settings → **Environment Variables**. Add each name with the same value
across the **Production**, **Preview**, and **Development** environments unless
you have separate Supabase projects per environment.

For preview deploys to work with auth, see step 5.

---

## 3. Deploy

### Option A — GitHub-connected (recommended)

1. Push the branch to GitHub.
2. Vercel → **Add New Project** → import the repo.
3. Framework preset: **Next.js** (auto-detected).
4. Build command: `npm run build` (default).
5. Output directory: `.next` (default).
6. Install command: `npm install` (default).
7. Add the env vars from §2.
8. **Deploy.**

Subsequent pushes to `main` ship to production. Other branches auto-deploy as
previews on `*.vercel.app` URLs.

### Option B — CLI (one-off)

```bash
npm install -g vercel
vercel login
vercel --prod
```

The CLI walks through linking and pulling env vars from the dashboard.

---

## 4. `vercel.json`

Already committed at the repo root. What it sets:

- `regions: ["icn1"]` — Seoul region. Closer to the target users; reduces
  latency to Supabase if your project is also in Seoul (`ap-northeast-2`).
  Change/add regions if your audience differs.
- `headers` — repeats the `next.config.mjs` PWA headers so the service worker
  is served fresh and at root scope, and `manifest.json` gets the correct
  MIME type. Vercel respects both, but explicit is safer.

You generally don't need to touch this file unless you change regions or add
edge functions.

---

## 5. Supabase post-deploy configuration

After the first successful deploy, point Supabase at your real domain.

1. **Authentication → URL Configuration**
   - Site URL: `https://<your-domain>` (no trailing slash).
   - Additional Redirect URLs: `https://<your-domain>/**` and, if you want
     auth on preview deploys, `https://*-<your-vercel-team>.vercel.app/**`.
2. **Authentication → Email Templates** — verify the magic-link template
   uses `{{ .SiteURL }}` so links match your prod domain.
3. **Authentication → Providers → Anonymous Sign-Ins** — enable if you want
   the "게스트로 빠르게 시작" button on `/login` to work. Otherwise it
   returns a 422 (handled gracefully in the UI).
4. **Storage → `verifications` bucket** — confirm the bucket exists and that
   the storage policies from `supabase/policies.sql` are applied. Without
   them, image uploads fail with 403.

---

## 6. Post-deploy smoke checks

Run through these in the deployed URL before announcing:

- [ ] `/` redirects unauthenticated users to `/login` (307).
- [ ] `/manifest.json` returns 200 with `application/manifest+json`.
- [ ] `/icons/icon-192.png` and `/icons/icon-512.png` return 200.
- [ ] Service worker registers (DevTools → Application → Service workers).
      Note: SW only registers in production builds, never in `npm run dev`.
- [ ] Magic link login lands back on the prod domain (not localhost).
- [ ] Inserting a verification on one device shows up on another within ~1s
      (Realtime subscription in `AppDataProvider` working).

---

## 7. Self-hosted (Docker / VPS)

A Dockerfile is not included. The app runs on any Node 20+ host:

```bash
npm install
npm run build
npm start
```

Set the same env vars from §2 in the host's environment. Bind a reverse
proxy (Caddy/Nginx) for TLS and serve `public/` directly for icons/manifest.

---

## 8. Known caveats

- **`middleware` → `proxy` rename**: Next.js 16 emits a deprecation warning
  for the `middleware` filename. The build still succeeds. When upgrading,
  rename `middleware.ts` → `proxy.ts` per
  [Next.js docs](https://nextjs.org/docs/messages/middleware-to-proxy).
- **PWA icons are placeholders.** `public/icons/icon-{192,512}.png` were
  generated by a Node script (`zlib`-based PNG encoder). Replace with a real
  branded asset before launch.
- **Supabase Realtime** must be enabled on the `verifications` table for the
  inbox-badge live update to work. If realtime is off, the UI still works —
  it just falls back to refresh-on-action.
- **Anonymous sign-ins** are off by default in new Supabase projects. The
  `/login` page surfaces a Korean error message guiding the user to enable
  them; alternatively remove the "게스트로 빠르게 시작" button if not needed.
