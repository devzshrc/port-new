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

This is a client-rendered React SPA deployed as static assets through Cloudflare Workers. The Wrangler configuration points at `dist/`, enables SPA fallback, and routes `devzshrc.in/*` to the Worker so direct loads of `/blog`, `/blog/:slug`, and `/resources/:slug` resolve through the client router.

```bash
bun install
bun run deploy:dry-run
bun run deploy
```

Authenticate Wrangler once with `bunx wrangler login`. For local Cloudflare behavior, use `bun run preview:cloudflare` and open the URL Wrangler prints. The production build copies `public/_headers` and `public/robots.txt` into `dist/` automatically.
