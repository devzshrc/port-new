import { useState } from "react";
import { TextMorph } from "torph/react";
import { identity } from "../content";

export function EmailButton() {
  const [revealed, setRevealed] = useState(false);
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const label = revealed ? identity.email : "Email";

  return <a className="button-primary email-button" href={`mailto:${identity.email}`} aria-label={`Email ${identity.email}`} onMouseEnter={() => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) setRevealed(true);
  }} onMouseLeave={() => setRevealed(false)} onFocus={() => setRevealed(true)} onBlur={() => setRevealed(false)}>
    {reduceMotion ? label : <TextMorph as="span" duration={200} ease="cubic-bezier(0.23, 1, 0.32, 1)">{label}</TextMorph>}
  </a>;
}
