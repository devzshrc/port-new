import { useState, type ChangeEvent, type FormEvent } from "react";
import { limits, validateContact, type ContactErrors, type ContactField } from "../lib/contact";

type Status = "idle" | "sending" | "sent" | "error";
type Values = Record<ContactField, string> & { website: string };

const empty: Values = { name: "", email: "", message: "", website: "" };

export function ContactForm() {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const update = (field: keyof Values) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues(current => ({ ...current, [field]: event.target.value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(`Contact failed with ${response.status}`);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const sending = status === "sending";
  const sent = status === "sent";

  return <div className="contact-stage" data-state={status}>
    <form className="contact-form" onSubmit={submit} noValidate aria-hidden={sent} inert={sent}>
      <div className="field">
        <label htmlFor="contact-name">Name</label>
        <input id="contact-name" name="name" autoComplete="name" maxLength={limits.name} value={values.name} onChange={update("name")} aria-invalid={Boolean(errors.name)} aria-describedby="contact-name-error" />
        <p id="contact-name-error" className="field-error" data-visible={Boolean(errors.name)}>{errors.name ?? ""}</p>
      </div>
      <div className="field">
        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={limits.email} value={values.email} onChange={update("email")} aria-invalid={Boolean(errors.email)} aria-describedby="contact-email-error" />
        <p id="contact-email-error" className="field-error" data-visible={Boolean(errors.email)}>{errors.email ?? ""}</p>
      </div>
      <div className="field">
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" maxLength={limits.message} value={values.message} onChange={update("message")} aria-invalid={Boolean(errors.message)} aria-describedby="contact-message-error" />
        <p id="contact-message-error" className="field-error" data-visible={Boolean(errors.message)}>{errors.message ?? ""}</p>
      </div>
      {/* Honeypot: hidden from people and screen readers, a bot will fill it in. */}
      <input className="contact-hp" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={update("website")} aria-hidden="true" />
      <div className="contact-actions">
        <button type="submit" className="button-primary" disabled={sending}>{sending ? "Sending…" : "Send message"}</button>
      </div>
      <p className="field-error form-status" data-visible={status === "error"} role="status">Something went wrong. Your message is still here, so try again or email me directly.</p>
    </form>
    <div className="contact-sent" aria-hidden={!sent} inert={!sent}>
      <p>Thanks, {values.name.trim() || "friend"}. I&rsquo;ll reply soon.</p>
    </div>
  </div>;
}
