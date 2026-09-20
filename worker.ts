type SpotifyEnv = {
  ASSETS: { fetch(request: Request): Promise<Response> };
  SPOTIFY_CLIENT_ID?: string;
  SPOTIFY_CLIENT_SECRET?: string;
  SPOTIFY_REFRESH_TOKEN?: string;
  SPOTIFY_REDIRECT_URI?: string;
};

type SpotifyTokenResponse = {
  access_token: string;
  refresh_token?: string;
};

type SpotifyNowPlayingResponse = {
  is_playing?: boolean;
  progress_ms?: number;
  item?: {
    type?: string;
    name?: string;
    artists?: Array<{ name?: string }>;
    show?: { name?: string };
    album?: { images?: Array<{ url?: string }> };
    external_urls?: { spotify?: string };
  } | null;
};

const SPOTIFY_SCOPE = "user-read-currently-playing user-read-playback-state";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function cookie(request: Request, name: string) {
  const value = request.headers.get("cookie")?.split(";").map(part => part.trim()).find(part => part.startsWith(`${name}=`));
  return value ? decodeURIComponent(value.slice(name.length + 1)) : null;
}

function redirectUri(request: Request, env: SpotifyEnv) {
  return env.SPOTIFY_REDIRECT_URI ?? new URL("/api/spotify/callback", request.url).toString();
}

function spotifyConfig(env: SpotifyEnv) {
  return Boolean(env.SPOTIFY_CLIENT_ID && env.SPOTIFY_CLIENT_SECRET);
}

function oauthUnavailable() {
  return new Response("Spotify OAuth is not configured.", { status: 503 });
}

async function spotifyLogin(request: Request, env: SpotifyEnv) {
  if (!env.SPOTIFY_CLIENT_ID) return oauthUnavailable();
  const state = crypto.randomUUID();
  const authorize = new URL("https://accounts.spotify.com/authorize");
  authorize.searchParams.set("client_id", env.SPOTIFY_CLIENT_ID);
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("redirect_uri", redirectUri(request, env));
  authorize.searchParams.set("scope", SPOTIFY_SCOPE);
  authorize.searchParams.set("state", state);
  return new Response(null, {
    status: 302,
    headers: {
      location: authorize.toString(),
      "set-cookie": `spotify_oauth_state=${encodeURIComponent(state)}; HttpOnly; Secure; SameSite=Lax; Path=/api/spotify; Max-Age=600`,
    },
  });
}

function callbackPage(message: string, token?: string) {
  const safeMessage = message.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const safeToken = token?.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  return new Response(`<!doctype html><meta charset="utf-8"><title>Spotify setup</title><style>body{font:16px system-ui;max-width:680px;margin:12vh auto;padding:24px;color:#262626}textarea{width:100%;min-height:110px;margin-top:16px;padding:12px;font:13px ui-monospace;box-sizing:border-box}code{background:#f5f5f5;padding:2px 5px}</style><h1>${safeMessage}</h1>${safeToken ? `<p>Set it as the Cloudflare secret <code>SPOTIFY_REFRESH_TOKEN</code>, then you can close this page.</p><textarea readonly>${safeToken}</textarea>` : ""}`, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

async function spotifyCallback(request: Request, env: SpotifyEnv) {
  if (!spotifyConfig(env)) return callbackPage("Spotify OAuth is not configured yet.");
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  if (error) return callbackPage(`Spotify authorization was cancelled: ${error}.`);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state || state !== cookie(request, "spotify_oauth_state")) return callbackPage("This Spotify authorization link is invalid or expired.");

  const credentials = btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`);
  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { authorization: `Basic ${credentials}`, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri(request, env) }),
  });
  if (!tokenResponse.ok) return callbackPage("Spotify could not finish authorization. Please try again.");
  const tokens = await tokenResponse.json() as SpotifyTokenResponse;
  if (!tokens.refresh_token) return callbackPage("Spotify did not return a refresh token. Revoke this app and authorize again.");
  return callbackPage("Spotify authorization complete.", tokens.refresh_token);
}

async function spotifyAccessToken(env: SpotifyEnv) {
  if (!spotifyConfig(env) || !env.SPOTIFY_REFRESH_TOKEN) return null;
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { authorization: `Basic ${btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`)}`, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: env.SPOTIFY_REFRESH_TOKEN }),
  });
  if (!response.ok) return null;
  const tokens = await response.json() as SpotifyTokenResponse;
  return tokens.access_token;
}

async function spotifyNowPlaying(env: SpotifyEnv) {
  const accessToken = await spotifyAccessToken(env);
  if (!accessToken) return json(null);
  const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", { headers: { authorization: `Bearer ${accessToken}` } });
  if (response.status === 204 || !response.ok) return json(null);
  const playback = await response.json() as SpotifyNowPlayingResponse;
  const item = playback.item;
  if (!item?.name) return json(null);
  const artist = item.artists?.map(entry => entry.name).filter(Boolean).join(", ") || item.show?.name || "Spotify";
  return json({
    title: item.name,
    artist,
    href: item.external_urls?.spotify ?? "https://open.spotify.com/",
    artwork: item.album?.images?.[1]?.url ?? item.album?.images?.[0]?.url ?? null,
    isPlaying: playback.is_playing === true,
    progressMs: playback.progress_ms ?? 0,
  });
}

export default {
  async fetch(request: Request, env: SpotifyEnv): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/spotify/login") return spotifyLogin(request, env);
    if (url.pathname === "/api/spotify/callback") return spotifyCallback(request, env);
    if (url.pathname === "/api/spotify/now-playing") return spotifyNowPlaying(env);
    return env.ASSETS.fetch(request);
  },
};
