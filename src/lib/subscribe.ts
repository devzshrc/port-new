export type SubscribeEnv = { RESEND_API_KEY?: string; RESEND_AUDIENCE_ID?: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** POST /api/subscribe: adds the address to the Resend audience. A filled honeypot is treated as a bot. */
export async function handleSubscribe(request: Request, env: SubscribeEnv) {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  let body: { email?: unknown; website?: unknown };
  try {
    body = (await request.json()) as { email?: unknown; website?: unknown };
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof body.website === "string" && body.website.trim() !== "") return Response.json({ ok: true });

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email || email.length > 254 || !emailPattern.test(email)) return Response.json({ error: "Invalid email" }, { status: 400 });

  if (!env.RESEND_API_KEY || !env.RESEND_AUDIENCE_ID) return Response.json({ error: "Subscriptions are not configured" }, { status: 503 });

  const upstream = await fetch(`https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`, {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ email, unsubscribed: false }),
  });
  if (!upstream.ok) return Response.json({ error: "Could not subscribe" }, { status: 502 });

  return Response.json({ ok: true });
}
