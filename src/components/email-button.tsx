import { useState } from "react";
import { TextMorph } from "torph/react";
import { identity } from "../content";

/** Shows a call to action that morphs into the email address on hover or focus. */
export function EmailButton() {
  const [revealed, setRevealed] = useState(false);
  const reveal = () => setRevealed(true);
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const hide = () => setRevealed(false);

  return <a className="button-primary email-button" href={`mailto:${identity.email}`} aria-label="Send me an email" onMouseEnter={reveal} onMouseLeave={hide} onFocus={reveal} onBlur={hide}>
    {reduceMotion ? (revealed ? identity.email : "Send me an email!") : <TextMorph as="span" duration={350} ease="cubic-bezier(0.19, 1, 0.22, 1)">{revealed ? identity.email : "Send me an email!"}</TextMorph>}
  </a>;
}
