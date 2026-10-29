export type ContactInput = { name: string; email: string; message: string; website: string };
export type ContactField = "name" | "email" | "message";
export type ContactErrors = Partial<Record<ContactField, string>>;

export const limits = { name: 100, email: 254, message: 2000, messageMin: 10 } as const;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Shared by the form (to show messages) and the Worker (to reject bad input). */
export function validateContact(input: Pick<ContactInput, ContactField>): ContactErrors {
  const errors: ContactErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name) errors.name = "Please add your name.";
  else if (name.length > limits.name) errors.name = `Keep it under ${limits.name} characters.`;

  if (!email) errors.email = "Please add your email.";
  else if (email.length > limits.email || !emailPattern.test(email)) errors.email = "That email doesn’t look right.";

  if (message.length < limits.messageMin) errors.message = `Tell me a little more (at least ${limits.messageMin} characters).`;
  else if (message.length > limits.message) errors.message = `Keep it under ${limits.message} characters.`;

  return errors;
}

export type ContactEnv = { RESEND_API_KEY?: string; CONTACT_TO?: string };

const text = (value: unknown) => (typeof value === "string" ? value : "");

/** POST /api/contact: validates, ignores bots (honeypot), and emails the owner through Resend. */
export async function handleContact(request: Request, env: ContactEnv) {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  let body: Partial<ContactInput>;
  try {
    body = (await request.json()) as Partial<ContactInput>;
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  // A filled honeypot means a bot: answer as if it worked, send nothing.
  if (text(body.website).trim() !== "") return Response.json({ ok: true });

  const input = { name: text(body.name).trim(), email: text(body.email).trim(), message: text(body.message).trim() };
  const errors = validateContact(input);
  if (Object.keys(errors).length) return Response.json({ error: "Invalid", errors }, { status: 400 });

  if (!env.RESEND_API_KEY || !env.CONTACT_TO) return Response.json({ error: "Contact is not configured" }, { status: 503 });

  const upstream = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: "Portfolio <contact@replies.devzshrc.in>",
      to: [env.CONTACT_TO],
      reply_to: input.email,
      subject: `Portfolio message from ${input.name}`,
      text: `${input.message}\n\n${input.name} <${input.email}>`,
    }),
  });
  if (!upstream.ok) return Response.json({ error: "Could not send" }, { status: 502 });

  return Response.json({ ok: true });
}
