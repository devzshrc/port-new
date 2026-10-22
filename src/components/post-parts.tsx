import { useState } from "react";
import { identity } from "../content";

/** Share row: copy the link, or open X or LinkedIn with this page. */
export function ShareRow({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; the other share links still work.
    }
  };

  return <div className="share-row">
    <p className="share-label">Share this article</p>
    <div className="share-actions">
      <button type="button" className="pill" onClick={copy}>{copied ? "Copied" : "Copy link"}</button>
      <a className="pill" href={`https://x.com/intent/post?url=${url}&text=${text}`} target="_blank" rel="noreferrer">X ↗</a>
      <a className="pill" href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`} target="_blank" rel="noreferrer">LinkedIn ↗</a>
    </div>
  </div>;
}

/** Bordered author card at the foot of an article. */
export function AuthorCard() {
  return <aside className="author-card">
    <img src={identity.avatar} alt={identity.name} width="56" height="56" />
    <div>
      <p className="author-name">{identity.name}</p>
      <p className="author-role">{identity.role}</p>
      <p>{identity.biography[0]}</p>
    </div>
  </aside>;
}
