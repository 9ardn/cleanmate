# Deployment

## Vercel (Recommended)

```bash
npm install -g vercel
vercel login
vercel
```

### Environment variables (set in Vercel dashboard)

| Name | Value | Where |
|------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase → Settings → API | Both build & runtime |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase → Settings → API | Both build & runtime |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase → Settings → API | Runtime only (NEVER expose) |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel URL (e.g., https://cleanmate.vercel.app) | Both |

### Post-deploy

After deploying, update Supabase:
1. **Authentication → URL Configuration**
   - Site URL: `https://cleanmate.vercel.app`
   - Additional redirect URLs: `https://cleanmate.vercel.app/**`
2. Verify email magic link goes to the right domain.

## Self-hosted (Docker)

A Dockerfile is not included — typical `npm run build && npm start` works on any
Node 20+ host. Remember to set the env vars.
