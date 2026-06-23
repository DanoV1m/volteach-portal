# TODOs

## Vercel Development Environment Variables

Add these two secrets to Vercel **Development** environment, then re-pull:

```bash
vercel env add GEMINI_API_KEY development
vercel env add VITE_SPOTIFY_CLIENT_ID development
vercel env pull .env.local --yes
```

Without these, `/api/gemini` and Spotify OAuth will silently fail in local dev.
