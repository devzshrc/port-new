import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { ContentBlock, Post } from "../content";
import { allTags, filterPosts, tocEntries } from "../lib/posts";

/* Shiki is built from its core, with one language and two themes, and each language loads the first time a block uses it. */
type Highlighter = Awaited<ReturnType<typeof createHighlight>>;
async function createHighlight() {
  const [core, engine, light, dark] = await Promise.all([
    import("shiki/core"),
    import("shiki/engine/javascript"),
    import("shiki/themes/github-light"),
    import("shiki/themes/github-dark"),
  ]);
  return core.createHighlighterCore({ themes: [light.default as never, dark.default as never], langs: [], engine: engine.createJavaScriptRegexEngine() });
}
const languageLoaders: Record<string, () => Promise<{ default: unknown }>> = {
  typescript: () => import("shiki/langs/typescript"),
  javascript: () => import("shiki/langs/javascript"),
  tsx: () => import("shiki/langs/tsx"),
  jsx: () => import("shiki/langs/jsx"),
  css: () => import("shiki/langs/css"),
  bash: () => import("shiki/langs/bash"),
  json: () => import("shiki/langs/json"),
  html: () => import("shiki/langs/html"),
};
let highlighter: Promise<Highlighter> | null = null;

async function highlight(code: string, lang: string) {
  highlighter ??= createHighlight();
  const instance = await highlighter;
  if (lang !== "plaintext" && !instance.getLoadedLanguages().includes(lang as never)) {
    const loader = languageLoaders[lang];
    if (!loader) return null;
    await instance.loadLanguage((await loader()).default as never);
  }
  return instance.codeToHtml(code, { lang, themes: { light: "github-light", dark: "github-dark" }, defaultColor: false });
}

const languages = new Set(["typescript", "javascript", "tsx", "jsx", "css", "bash", "json", "html", "plaintext"]);

/** A code block with a Copy button. Shiki is loaded on demand; until then, and if it fails, the code shows plainly. */
export function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState<string | null>(null);
  const requested = (label ?? "").toLowerCase().split(/\s+/)[0] ?? "";
  const lang = languages.has(requested) ? requested : "plaintext";

  useEffect(() => {
    let cancelled = false;
    highlight(code, lang)
      .then(result => { if (!cancelled) setHtml(result); })
      .catch(() => { /* keep the plain code */ });
    return () => { cancelled = true; };
  }, [code, lang]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked: the code is still selectable.
    }
  };

  return <figure className="code-block">
    {label && <figcaption>{label}</figcaption>}
    <button type="button" className="code-copy" onClick={copy} aria-label="Copy code">{copied ? "Copied" : "Copy"}</button>
    {html ? <div className="code-html" dangerouslySetInnerHTML={{ __html: html }} /> : <pre><code>{code}</code></pre>}
  </figure>;
}

/** A thin bar at the top that fills as the reader scrolls. It follows scroll position directly, so it has no transition. */
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${ratio})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <div ref={bar} className="reading-progress" aria-hidden="true" />;
}

/** Email signup. Posts to /api/subscribe; a filled honeypot is treated as a bot. */
export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      setStatus(response.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") return <p className="subscribe-done" role="status">Thanks. You are on the list.</p>;

  return <form className="subscribe" onSubmit={submit} noValidate>
    <p className="subscribe-title">Get new writing by email</p>
    <div className="subscribe-row">
      <label className="visually-hidden" htmlFor="subscribe-email">Email address</label>
      <input id="subscribe-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} />
      <input className="contact-hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={event => setWebsite(event.target.value)} />
      <button type="submit" className="button-primary" disabled={status === "sending"}>{status === "sending" ? "Subscribing…" : "Subscribe"}</button>
    </div>
    {status === "error" && <p className="subscribe-error" role="status">That did not go through. Check the address and try again.</p>}
  </form>;
}

/** Contents for long posts. The current section is tracked and shown in colour only. */
export function PostToc({ body }: { body: ContentBlock[] }) {
  const entries = useMemo(() => tocEntries(body), [body]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const nodes = entries.map(entry => document.getElementById(entry.id)).filter((node): node is HTMLElement => node !== null);
    const observer = new IntersectionObserver(items => {
      const visible = items.find(item => item.isIntersecting);
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "0px 0px -70% 0px" });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length < 3) return null;

  return <nav className="post-toc" aria-label="On this page">
    <p className="post-toc-title">On this page</p>
    <ol className="post-toc-list" tabIndex={0} aria-label="Article sections">
      {entries.map(entry => <li key={entry.id}>
        <a href={`#${entry.id}`} data-active={active === entry.id} aria-current={active === entry.id ? "location" : undefined}>{entry.text}</a>
      </li>)}
    </ol>
  </nav>;
}

/** Search and tag filter for the writing index. The list fades only when the tag changes. */
export function BlogIndex({ entries }: { entries: Post[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const tags = useMemo(() => allTags(entries), [entries]);
  const results = useMemo(() => filterPosts(entries, query, tag), [entries, query, tag]);

  return <>
    <div className="blog-controls">
      <label className="visually-hidden" htmlFor="blog-search">Search writing</label>
      <input id="blog-search" type="search" placeholder="Search writing" value={query} onChange={event => setQuery(event.target.value)} />
      {tags.length > 0 && <div className="tag-filter" role="group" aria-label="Filter by tag">
        <button type="button" className="pill" aria-pressed={tag === null} onClick={() => setTag(null)}>All</button>
        {tags.map(item => <button key={item} type="button" className="pill" aria-pressed={tag === item} onClick={() => setTag(tag === item ? null : item)}>{item}</button>)}
      </div>}
    </div>
    {results.length > 0
      ? <ul key={tag ?? "all"} className="row-list post-list results">
          {results.map(post => <li key={post.slug}>
            <div className="row-main">
              <a className="row-title" href={`/blog/${post.slug}`}>{post.title}</a>
              <p>{post.excerpt}</p>
            </div>
            <time>{post.date}</time>
          </li>)}
        </ul>
      : <p className="empty-results">No posts match.</p>}
  </>;
}

/** Links to the posts written just before and after this one. */
export function PostNav({ newer, older }: { newer?: Post; older?: Post }) {
  if (!newer && !older) return null;
  return <nav className="post-nav" aria-label="More writing">
    {older ? <a href={`/blog/${older.slug}`}><span>Older</span>{older.title}</a> : <span />}
    {newer ? <a className="post-nav-next" href={`/blog/${newer.slug}`}><span>Newer</span>{newer.title}</a> : <span />}
  </nav>;
}

export function RelatedPosts({ items }: { items: Post[] }) {
  if (!items.length) return null;
  return <section className="related">
    <h2 className="section-title">More like this</h2>
    <ul className="row-list post-list">
      {items.map(post => <li key={post.slug}>
        <div className="row-main">
          <a className="row-title" href={`/blog/${post.slug}`}>{post.title}</a>
          <p>{post.excerpt}</p>
        </div>
        <time>{post.date}</time>
      </li>)}
    </ul>
  </section>;
}
