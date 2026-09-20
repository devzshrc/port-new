# Devashish Portfolio

A light, editorial portfolio built with Bun, React, TypeScript, and Tailwind CSS.

## Development

```bash
bun install
bun run dev
```

The site is served at `http://localhost:3000`.

## Content

Edit `src/content.ts` to update the identity, work, one sample blog post, and resources. Only records marked `published` are rendered; draft records remain private editing placeholders.

Public routes are `/`, `/blog`, `/blog/:slug`, `/resources`, and `/resources/:slug`.

## Verification

```bash
bun x tsc --noEmit
bun test
bun run build
```

## Cloudflare Workers deployment

This is a client-rendered React SPA deployed as static assets through Cloudflare Workers. The Wrangler configuration points at `dist/`, enables SPA fallback, and routes both `devzshrc.in/*` and `www.devzshrc.in/*` to the Worker so direct loads of `/blog`, `/blog/:slug`, and `/resources/:slug` resolve through the client router.

```bash
bun install
bun run deploy:dry-run
bun run deploy
```

Authenticate Wrangler once with `bunx wrangler login`. For local Cloudflare behavior, use `bun run preview:cloudflare` and open the URL Wrangler prints. The production build copies `public/_headers` and `public/robots.txt` into `dist/` automatically.

## Spotify now listening

The homepage includes a small now-listening row when the configured Spotify account is actively playing. The Worker refreshes the account token and polls Spotify from `/api/spotify/now-playing`; no Spotify credentials are sent to the browser.

1. Add `https://devzshrc.in/api/spotify/callback` (and `http://localhost:3000/api/spotify/callback` for local testing) to the Spotify Developer Dashboard.
2. Set the client secret in Wrangler without committing it:

```bash
wrangler secret put SPOTIFY_CLIENT_SECRET
```

3. Open `/api/spotify/login` once, approve the `user-read-currently-playing` and `user-read-playback-state` scopes, then save the refresh token shown by the callback:

```bash
wrangler secret put SPOTIFY_REFRESH_TOKEN
```

The public client ID and canonical callback URL live in `wrangler.jsonc`; secrets stay in Cloudflare's encrypted Worker secret store.
