import { createContext, useContext, useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { education, experience, identity, posts, resources, skills, work, type ContentBlock, type Post, type ResourceItem, type WorkItem } from "./content";
import type { GitHubActivity } from "./lib/github";
import type { RecentSolve } from "./lib/leetcode";
import { findCaseStudy, matchRoute, pageMetadata, postHref, published, resourceHref } from "./lib/site";
import { isTheme, nextTheme, type Theme } from "./lib/theme";
import { LocationMap } from "@/components/ui/expand-map";
import { FindATime } from "@/components/find-a-time";
import { DiscoverButton } from "@/components/block/discover-button";
import "./index.css";

const themeStorageKey = "portfolio-theme";

function systemTheme(): Theme {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

function applyTheme(theme: Theme, mode: "system" | "manual") {
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.themeMode = mode;
}

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const initial = document.documentElement.dataset.theme;
    return isTheme(initial) ? initial : systemTheme();
  });
  const [mode, setMode] = useState<"system" | "manual">(() => document.documentElement.dataset.themeMode === "manual" ? "manual" : "system");

  useEffect(() => {
    let media: MediaQueryList | undefined;
    try {
      media = window.matchMedia("(prefers-color-scheme: dark)");
    } catch {}
    const updateFromSystem = () => {
      if (document.documentElement.dataset.themeMode !== "system") return;
      const next = media?.matches ? "dark" : "light";
      applyTheme(next, "system");
      setTheme(next);
    };
    const updateFromStorage = (event: StorageEvent) => {
      if (event.key !== themeStorageKey && event.key !== null) return;
      const preference = isTheme(event.newValue) ? event.newValue : null;
      const nextMode = preference ? "manual" : "system";
      const next = preference ?? (media?.matches ? "dark" : "light");
      applyTheme(next, nextMode);
      setTheme(next);
      setMode(nextMode);
    };
    if (media?.addEventListener) media.addEventListener("change", updateFromSystem);
    else media?.addListener(updateFromSystem);
    window.addEventListener("storage", updateFromStorage);
    return () => {
      if (media?.removeEventListener) media.removeEventListener("change", updateFromSystem);
      else media?.removeListener(updateFromSystem);
      window.removeEventListener("storage", updateFromStorage);
    };
  }, []);

  const toggle = () => {
    const system = systemTheme();
    const next = nextTheme(theme, system);
    try {
      if (next.preference) window.localStorage.setItem(themeStorageKey, next.preference);
      else window.localStorage.removeItem(themeStorageKey);
    } catch {}
    const nextMode = next.preference ? "manual" : "system";
    applyTheme(next.theme, nextMode);
    setTheme(next.theme);
    setMode(nextMode);
  };
  const targetTheme = theme === "dark" ? "light" : "dark";
  const useSystem = mode === "manual" && targetTheme === systemTheme();
  const label = useSystem ? `Use system theme (${targetTheme})` : `Switch to ${targetTheme} mode`;
  const text = targetTheme === "dark" ? "Dark" : "Light";
  return { theme, label, text, toggle };
}

const ThemeContext = createContext<ReturnType<typeof useTheme> | null>(null);
const useThemeContext = () => useContext(ThemeContext)!;

const navigateEvent = "app:navigate";

export function navigate(href: string) {
  const url = new URL(href, window.location.origin);
  if (url.origin !== window.location.origin || (url.hash && url.pathname === window.location.pathname)) {
    if (url.origin === window.location.origin) window.location.hash = url.hash;
    else window.open(url.href, "_blank", "noreferrer");
    return;
  }
  if (url.hash) {
    window.location.href = url.href;
    return;
  }
  window.history.pushState({}, "", url);
  window.dispatchEvent(new Event(navigateEvent));
}

function withTransition(update: () => void) {
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduced) return update();
  document.startViewTransition(() => flushSync(update));
}

function useCopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(identity.email);
    } catch {
      window.location.href = `mailto:${identity.email}`;
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };
  return { copied, copy };
}

function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname);
  useEffect(() => {
    const onPopState = () => withTransition(() => setPathname(window.location.pathname));
    const onNavigate = () => withTransition(() => {
      setPathname(window.location.pathname);
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    window.addEventListener("popstate", onPopState);
    window.addEventListener(navigateEvent, onNavigate);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener(navigateEvent, onNavigate);
    };
  }, []);
  return pathname;
}

function Link({ href, children, className, ariaLabel }: { href: string; children: ReactNode; className?: string; ariaLabel?: string }) {
  const external = /^(https?:|mailto:)/.test(href);
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (external || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (new URL(href, window.location.origin).hash) return;
    event.preventDefault();
    navigate(href);
  };
  return <a href={href} className={className} aria-label={ariaLabel} onClick={onClick} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{children}</a>;
}

function Metadata({ route }: { route: ReturnType<typeof matchRoute> }) {
  const metadata = pageMetadata(route, resources, posts, work);
  const workImage = route.kind === "work" ? findCaseStudy(work, route.slug)?.image : undefined;
  const resourceImage = route.kind === "resource" ? published(resources).find(resource => resource.slug === route.slug)?.cover : undefined;
  const postImage = route.kind === "post" ? published(posts).find(post => post.slug === route.slug)?.cover : undefined;
  const shareImage = workImage ?? resourceImage ?? postImage ?? "/og.png";
  useEffect(() => {
    document.title = metadata.title;
    const setMeta = (selector: string, attribute: "name" | "property", key: string, value: string) => {
      let node = document.head.querySelector<HTMLMetaElement>(selector);
      if (!node) {
        node = document.createElement("meta");
        node.setAttribute(attribute, key);
        document.head.appendChild(node);
      }
      node.content = value;
    };
    const canonicalUrl = new URL(window.location.pathname, window.location.origin).href;
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
    setMeta('meta[name="description"]', "name", "description", metadata.description);
    setMeta('meta[property="og:title"]', "property", "og:title", metadata.title);
    setMeta('meta[property="og:description"]', "property", "og:description", metadata.description);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", metadata.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", metadata.description);
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[property="og:image"]', "property", "og:image", new URL(shareImage, window.location.origin).href);
    let structuredData = document.head.querySelector<HTMLScriptElement>('script[data-site-json-ld]');
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.type = "application/ld+json";
      structuredData.dataset.siteJsonLd = "true";
      document.head.appendChild(structuredData);
    }
    structuredData.text = JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: identity.name, jobTitle: identity.role, address: { "@type": "PostalAddress", addressCountry: identity.location }, url: window.location.origin });
  }, [metadata.description, metadata.title, shareImage, route]);
  return null;
}

function Header({ narrow = false }: { narrow?: boolean }) {
  const { label, text, toggle } = useThemeContext();
  const openMenu = () => window.dispatchEvent(new Event(commandMenuEvent));
  return <header className={`site-header${narrow ? " site-header-home" : ""}`}><Link href="/" className="site-wordmark" ariaLabel={`${identity.name} home`}>d.</Link><nav aria-label="Primary navigation"><ul>{identity.navigation.map(item => <li key={item.label}><Link href={item.href}>{item.label}</Link></li>)}</ul></nav><button type="button" className="menu-trigger" aria-label="Open command menu" aria-keyshortcuts="Meta+K Control+K" onClick={openMenu}><kbd>⌘K</kbd></button><button type="button" className="theme-toggle" aria-label={label} onClick={toggle}>{text}</button></header>;
}

function SocialIcon({ network }: { network: "github" | "linkedin" | "x" }) {
  if (network === "github") return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>;
  if (network === "linkedin") return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>;
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>;
}

function ContactLinks() {
  const findSocial = (network: "cal" | "github" | "linkedin" | "x") => identity.socials.find(link => link.network === network)!.href;
  const { copied, copy } = useCopyEmail();
  return <div className="contact-section" id="contact"><DiscoverButton href={findSocial("cal")} label="Book a call" /><button type="button" className="copy-email" onClick={copy} aria-label={`Copy email address ${identity.email}`}>{copied ? "Copied" : "Copy email"}</button><span className="visually-hidden" aria-live="polite">{copied ? "Email address copied" : ""}</span><div className="contact-links"><Link href={findSocial("github")}><SocialIcon network="github" />GitHub ↗</Link><Link href={findSocial("linkedin")}><SocialIcon network="linkedin" />LinkedIn ↗</Link><Link href={findSocial("x")}><SocialIcon network="x" />X ↗</Link></div></div>;
}

function HomeFooter() {
  return <footer className="home-footer"><p>© {new Date().getFullYear()} {identity.name}. {identity.footer}</p></footer>;
}

function InteriorFooter() {
  return <footer className="interior-footer"><div><nav aria-label="Footer navigation"><Link href="/">Home</Link><Link href="/#work">Work</Link><Link href="/#contact">Contact</Link></nav><p>© {new Date().getFullYear()} {identity.name}. {identity.footer}</p></div></footer>;
}

type TextListItem = { title: string; description: string; href: string; image?: string; imageAlt?: string; links?: { label: string; href: string }[] };

type LeetCodeStats = { username: string; total: number; easy: number; medium: number; hard: number; recent?: RecentSolve[] };

const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
function timeAgo(timestamp: number) {
  const days = Math.round((timestamp - Date.now()) / 86_400_000);
  if (days > -1) return "Today";
  if (days > -30) return relativeTime.format(days, "day");
  if (days > -365) return relativeTime.format(Math.round(days / 30), "month");
  return relativeTime.format(Math.round(days / 365), "year");
}

function LeetCodeSection() {
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/leetcode-stats", { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error("Stats unavailable");
        return response.json() as Promise<LeetCodeStats>;
      })
      .then(setStats)
      .catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, []);

  return <section className="section leetcode-section" aria-label="LeetCode statistics">
    <div className="leetcode-heading"><p className="section-label">LeetCode</p><Link href="https://leetcode.com/u/devzshrc/">@devzshrc ↗</Link></div>
    {stats ? <div className="leetcode-card">
      <div className="leetcode-summary">
        <div className="leetcode-total"><strong>{stats.total}</strong><span>problems solved</span></div>
        <div className="leetcode-breakdown">
          <div className="difficulty-bar" role="img" aria-label={`${stats.easy} easy, ${stats.medium} medium, ${stats.hard} hard`}>
            {(["easy", "medium", "hard"] as const).map(level => stats[level] > 0 && <span key={level} data-level={level} style={{ flexGrow: stats[level] }} />)}
          </div>
          <dl>{(["easy", "medium", "hard"] as const).map(level => <div key={level} data-level={level}><dt>{level[0]!.toUpperCase() + level.slice(1)}</dt><dd>{stats[level]}</dd></div>)}</dl>
        </div>
      </div>
      {stats.recent && stats.recent.length > 0 && <div className="leetcode-recent">
        <p>Recently solved</p>
        <ul>{stats.recent.map(item => <li key={item.slug}><Link href={`https://leetcode.com/problems/${item.slug}/`}>{item.title}</Link><time dateTime={new Date(item.solvedAt).toISOString()}>{timeAgo(item.solvedAt)}</time></li>)}</ul>
      </div>}
    </div> : <div className="leetcode-card leetcode-card-empty"><p className="leetcode-status" aria-live="polite">{failed ? "Stats temporarily unavailable" : "Loading stats…"}</p></div>}
  </section>;
}

function GitHubSection() {
  const [activity, setActivity] = useState<GitHubActivity | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/github-activity", { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error("Activity unavailable");
        return response.json() as Promise<GitHubActivity>;
      })
      .then(setActivity)
      .catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, []);
  const grid = useRef<HTMLDivElement>(null);
  useEffect(() => { if (grid.current) grid.current.scrollLeft = grid.current.scrollWidth; }, [activity]);
  const offset = activity?.days[0] ? new Date(`${activity.days[0].date}T00:00:00Z`).getUTCDay() : 0;

  return <section className="section github-section" aria-label="GitHub activity">
    <div className="leetcode-heading"><p className="section-label">GitHub</p><Link href="https://github.com/devzshrc">@devzshrc ↗</Link></div>
    {activity ? <>
      <div className="contribution-scroll" ref={grid}><div className="contribution-grid" role="img" aria-label={`${activity.total} contributions in the last year`}>
        {Array.from({ length: offset }, (_, index) => <span key={`pad-${index}`} className="contribution-pad" />)}
        {activity.days.map((day, index) => {
          const week = Math.floor((offset + index) / 7);
          return <span key={day.date} data-level={day.level} style={day.level > 0 ? { animationDelay: `${-(week * 90)}ms` } : undefined} />;
        })}
      </div></div>
      <p className="contribution-total"><strong>{activity.total.toLocaleString("en-US")}</strong> contributions in the last year</p>
    </> : <p className="leetcode-status" aria-live="polite">{failed ? "Activity temporarily unavailable" : "Loading activity…"}</p>}
  </section>;
}

function ExperienceList() {
  return <div className="experience-list">{experience.map(entry => {
    const meta = [entry.location, entry.employmentType].filter(Boolean).join(" · ");
    const companyName = entry.companyHref
      ? <Link href={entry.companyHref} className="experience-company-link">{entry.company} <span aria-hidden="true">↗</span></Link>
      : <>{entry.company}</>;
    const row = <><img src={entry.icon} alt={`${entry.company} logo`} width="40" height="40" /><span className="experience-text"><span className="experience-name">{companyName}</span><span className="experience-role">{entry.role}</span>{meta && <span className="experience-meta">{meta}</span>}</span><time>{entry.period}</time></>;
    const hasDetail = Boolean(entry.summary || entry.highlights?.length || entry.stack?.length);
    if (!hasDetail) return <article key={entry.company}>{row}</article>;
    return <ExperienceItem key={entry.company} row={row} summary={entry.summary} highlights={entry.highlights ?? []} stack={entry.stack} id={`experience-${entry.company.toLowerCase().replace(/\W+/g, "-")}`} />;
  })}</div>;
}

function ExperienceItem({ row, summary, highlights, stack, id }: { row: ReactNode; summary?: string; highlights: string[]; stack?: string[]; id: string }) {
  const [open, setOpen] = useState(false);
  return <div className="experience-item" data-open={open}>
    <button type="button" className="experience-toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}>{row}<span className="chevron" aria-hidden="true" /></button>
    <div className="experience-collapse" id={id} role="region" inert={!open}><div><div className="experience-detail">{summary && <p>{summary}</p>}{highlights.length > 0 && <ul>{highlights.map(item => <li key={item}>{item}</li>)}</ul>}{stack && stack.length > 0 && <ul className="stack-list" aria-label="Technologies used">{stack.map(item => <li key={item}>{item}</li>)}</ul>}</div></div></div>
  </div>;
}

function EducationList() {
  return <div className="education-list">{education.map(entry => <article key={entry.institution} className="education-item"><img src={entry.logo} alt={`${entry.institution} logo`} width="40" height="40" /><span className="experience-text"><span className="experience-name">{entry.institution}</span><span className="experience-role">{entry.degree}</span><span className="experience-meta">{entry.period}</span></span></article>)}</div>;
}

function SkillsList() {
  return <dl className="skills-grid">{skills.map(group => <div key={group.category}><dt>{group.category}</dt><dd>{group.items.join(" · ")}</dd></div>)}</dl>;
}

function TextList({ items, className = "" }: { items: TextListItem[]; className?: string }) {
  return <div className={`text-list ${className}`}>{items.map(item => <article key={item.title}>{item.image && <Link href={item.href} className="work-preview"><img src={item.image} alt={item.imageAlt ?? ""} width="840" height="470" loading="lazy" /></Link>}<h3><Link href={item.href}>{item.title} <span aria-hidden="true">→</span></Link></h3><p>{item.description}</p>{item.links && <div className="work-links">{item.links.map(link => <Link href={link.href} key={link.label}>{link.label} ↗</Link>)}</div>}</article>)}</div>;
}

function ProjectList({ items }: { items: WorkItem[] }) {
  return <div className="project-list">{items.map(item => {
    const [name, subtitle] = item.title.split(" — ");
    return <article className="project-card" key={item.href}>
      {item.image && <Link href={item.href} className="project-image" ariaLabel={`Read about ${name}`}><img src={item.image} alt={item.imageAlt ?? item.title} width="840" height="470" loading="lazy" /></Link>}
      <div className="project-content">
        <div className="project-heading"><div><h3><Link href={item.href}>{name}</Link></h3>{subtitle && <p className="project-subtitle">{subtitle}</p>}</div>{item.caseStudy && <time>{item.caseStudy.year}</time>}</div>
        <p className="project-description">{item.description}</p>
        {item.caseStudy && <ul className="project-stack" aria-label={`${name} technologies`}>{item.caseStudy.stack.slice(0, 4).map(tech => <li key={tech}>{tech}</li>)}</ul>}
        <div className="project-actions"><Link href={item.href} className="project-case-link">View project <span aria-hidden="true">→</span></Link><div>{item.links?.map(link => <Link href={link.href} key={link.label}>{link.label} <span aria-hidden="true">↗</span></Link>)}</div></div>
      </div>
    </article>;
  })}</div>;
}

function HomePage({ route }: { route: ReturnType<typeof matchRoute> }) {
  const visibleWork = published(work).sort((a, b) => a.order - b.order);
  const visiblePosts = published(posts);
  return <><Metadata route={route} /><Header narrow /><main id="content" className="home-content">
    <section className="about section"><img className="banner" src={identity.banner} alt={identity.bannerAlt} width="1200" height={675} /><span className="avatar-frame"><img className="avatar" src={identity.avatar} alt={`${identity.name}, ${identity.role}`} width="100" height="100" /></span><h1>I'm {identity.name}.<br />I build products from interface to API.</h1>{identity.biography.slice(0, 1).map(paragraph => <p key={paragraph}>{paragraph}</p>)}<ContactLinks /></section>
    <section className="section" id="work"><p className="section-label">Proof of work</p><ProjectList items={visibleWork} /></section>
    <section className="section experience-section"><p className="section-label">Experience</p><ExperienceList /><p className="section-label education-label">Education</p><EducationList /></section>
    <section className="section"><p className="section-label">Skills</p><SkillsList /></section>
    <section className="section"><p className="section-label">Based in</p><LocationMap location="Lucknow, Uttar Pradesh" coordinates="26.8467° N, 80.9462° E" /></section>
    <section className="section" aria-label="Find a time to talk"><div className="leetcode-heading"><p className="section-label">Find a time</p></div><FindATime /></section>
    <LeetCodeSection />
    <GitHubSection />
    <section className="section resume-section"><div><p className="section-label">Resume</p><p>A concise overview of my experience and work.</p></div><DiscoverButton href="https://drive.google.com/file/d/1UNLChy2Si6ciUFf_FRjimbbAB5RyQc5e/view?usp=sharing" label="View resume" /></section>
    {visiblePosts.length > 0 && <section className="section"><div className="leetcode-heading"><p className="section-label">Writing</p><Link href="/blog">View all ↗</Link></div><TextList items={visiblePosts.map(post => ({ title: post.title, description: post.excerpt, href: postHref(post) }))} /></section>}
    <HomeFooter />
  </main></>;
}

function ArchiveCard({ resource }: { resource: ResourceItem }) {
  const href = resourceHref(resource);
  return <article className="archive-card"><Link href={href} className="archive-cover"><img src={resource.cover} alt={resource.coverAlt} width="840" height="500" loading="lazy" /></Link><div><h2><Link href={href}>{resource.title} <span aria-hidden="true">→</span></Link></h2><p>{resource.description}</p></div></article>;
}

function ResourcesPage({ route }: { route: ReturnType<typeof matchRoute> }) {
  if (!published(resources).length) return <NotFoundPage route={{ kind: "not-found" }} />;
  return <><Metadata route={route} /><Header /><main id="content" className="archive-page"><header className="archive-heading"><h1>Resources</h1><p>Build notes, guides and useful collections.</p></header><div className="archive-grid">{published(resources).map(resource => <ArchiveCard key={resource.slug} resource={resource} />)}</div></main><InteriorFooter /></>;
}

function BlogCard({ post }: { post: Post }) {
  const href = postHref(post);
  return <article className="archive-card"><Link href={href} className="archive-cover"><img src={post.cover} alt={post.coverAlt} width="840" height="500" loading="lazy" /></Link><div><h2><Link href={href}>{post.title} <span aria-hidden="true">→</span></Link></h2><p>{post.excerpt}</p><small>{post.date}</small></div></article>;
}

function BlogPage({ route }: { route: ReturnType<typeof matchRoute> }) {
  if (!published(posts).length) return <NotFoundPage route={{ kind: "not-found" }} />;
  return <><Metadata route={route} /><Header /><main id="content" className="archive-page"><header className="archive-heading"><h1>Blog</h1><p>Notes on product engineering and building useful software.</p></header><div className="archive-grid">{published(posts).map(post => <BlogCard key={post.slug} post={post} />)}</div></main><InteriorFooter /></>;
}

function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return <div className="entry-content">{blocks.map((block, index) => { const key = `${block.type}-${index}`;
    if (block.type === "paragraph") return <p key={key}>{block.text}</p>;
    if (block.type === "heading") return <h2 key={key}>{block.text}</h2>;
    if (block.type === "image") return <img key={key} src={block.src} alt={block.alt} loading="lazy" />;
    if (block.type === "figure") return <figure key={key}><img src={block.src} alt={block.alt} loading="lazy" /><figcaption>{block.caption}</figcaption></figure>;
    if (block.type === "quote") return <blockquote key={key}>{block.text}</blockquote>;
    if (block.type === "list") return <ul key={key}>{block.items.map(item => <li key={item}>{item}</li>)}</ul>;
    if (block.type === "code") return <figure className="code-block" key={key}>{block.label && <figcaption>{block.label}</figcaption>}<pre><code>{block.code}</code></pre></figure>;
    if (block.type === "divider") return <hr key={key} />;
    return <aside className="callout" key={key}><h3>{block.title}</h3><p>{block.text}</p>{block.href && <Link href={block.href}>{block.label ?? "Learn more"} →</Link>}</aside>;
  })}</div>;
}

function ResourcePage({ slug, route }: { slug: string; route: ReturnType<typeof matchRoute> }) {
  const resource = published(resources).find(entry => entry.slug === slug);
  if (!resource || resource.externalUrl || !resource.body) return <NotFoundPage route={{ kind: "not-found" }} />;
  return <><Metadata route={route} /><Header /><main id="content" className="resource-detail"><article><header className="entry-header"><p className="eyebrow">Resource</p><h1>{resource.title}</h1><p>{resource.description}</p></header><img className="resource-hero" src={resource.cover} alt={resource.coverAlt} width="840" height="500" /><ContentBlocks blocks={resource.body} />{resource.actionLabel && <Link className="primary-button" href="/">{resource.actionLabel} →</Link>}</article></main><InteriorFooter /></>;
}

function BlogPostPage({ slug, route }: { slug: string; route: ReturnType<typeof matchRoute> }) {
  const post = published(posts).find(entry => entry.slug === slug);
  if (!post) return <NotFoundPage route={{ kind: "not-found" }} />;
  return <><Metadata route={route} /><Header /><main id="content" className="resource-detail blog-detail"><article><header className="entry-header"><p className="eyebrow">Blog</p><h1>{post.title}</h1><p>{post.excerpt}</p><p className="entry-date">{post.date}</p></header><img className="resource-hero" src={post.cover} alt={post.coverAlt} width="840" height="500" /><ContentBlocks blocks={post.body} /><Link className="back-link" href="/blog">← Back to blog</Link></article></main><InteriorFooter /></>;
}

function WorkPage({ slug, route }: { slug: string; route: ReturnType<typeof matchRoute> }) {
  const entry = findCaseStudy(work, slug);
  if (!entry?.caseStudy) return <NotFoundPage route={{ kind: "not-found" }} />;
  const { caseStudy } = entry;
  const [primary, ...secondary] = entry.links ?? [];
  return <><Metadata route={route} /><Header /><main id="content" className="resource-detail"><article><header className="entry-header"><p className="eyebrow">Case study</p><h1>{entry.title}</h1><p>{entry.description}</p></header>
    <dl className="case-meta"><div><dt>Role</dt><dd>{caseStudy.role}</dd></div><div><dt>Year</dt><dd>{caseStudy.year}</dd></div><div><dt>Stack</dt><dd>{caseStudy.stack.join(", ")}</dd></div></dl>
    {entry.image && <img className="resource-hero" src={entry.image} alt={entry.imageAlt ?? ""} width="840" height="470" />}
    <ContentBlocks blocks={caseStudy.body} />
    {primary && <div className="case-actions"><Link className="primary-button" href={primary.href}>Visit {primary.label.toLowerCase()} site ↗</Link>{secondary.map(link => <Link key={link.label} href={link.href}>{link.label} ↗</Link>)}</div>}
    <Link className="back-link" href="/">← Back home</Link>
  </article></main><InteriorFooter /></>;
}

function NotFoundPage({ route }: { route: ReturnType<typeof matchRoute> }) {
  return <><Metadata route={route} /><Header /><main id="content" className="not-found"><p>404</p><h1>That page isn't here.</h1><span>The link may be old, or the page may have moved.</span><Link href="/">Return home →</Link></main><InteriorFooter /></>;
}

const commandMenuEvent = "app:command-menu";

type Command = { group: string; label: string; hint?: string; run: () => void };

function CommandMenu() {
  const theme = useThemeContext();
  const { copy } = useCopyEmail();
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => navigate(href);
    const social = (network: string) => identity.socials.find(link => link.network === network)!.href;
    return [
      { group: "Pages", label: "Home", run: go("/") },
      { group: "Pages", label: "Proof of work", run: go("/#work") },
      ...(published(posts).length ? [{ group: "Pages", label: "Blog", run: go("/blog") }] : []),
      ...(published(resources).length ? [{ group: "Pages", label: "Resources", run: go("/resources") }] : []),
      ...published(work).filter(entry => entry.caseStudy).map(entry => ({ group: "Work", label: entry.title, hint: "Case study", run: go(`/work/${entry.caseStudy!.slug}`) })),
      ...published(posts).map(post => ({ group: "Writing", label: post.title, run: go(postHref(post)) })),
      { group: "Actions", label: "Copy email address", hint: identity.email, run: copy },
      { group: "Actions", label: theme.label, run: theme.toggle },
      { group: "Actions", label: "Book a call", hint: "↗", run: go(social("cal")) },
      { group: "Links", label: "GitHub", hint: "↗", run: go(social("github")) },
      { group: "Links", label: "LinkedIn", hint: "↗", run: go(social("linkedin")) },
      { group: "Links", label: "X", hint: "↗", run: go(social("x")) },
    ];
  }, [copy, theme.label, theme.toggle]);

  const results = commands.filter(command => `${command.group} ${command.label}`.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    const open = () => {
      setQuery("");
      setActive(0);
      if (!dialog.current?.open) dialog.current?.showModal();
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(commandMenuEvent, open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(commandMenuEvent, open);
    };
  }, []);

  const run = (command: Command | undefined) => {
    if (!command) return;
    dialog.current?.close();
    command.run();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") { event.preventDefault(); setActive(index => Math.min(index + 1, results.length - 1)); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActive(index => Math.max(index - 1, 0)); }
    if (event.key === "Enter") { event.preventDefault(); run(results[active]); }
  };

  let lastGroup = "";
  return <dialog ref={dialog} className="command-menu" aria-label="Command menu" onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
    <div className="command-panel">
      <input autoFocus value={query} onChange={event => { setQuery(event.target.value); setActive(0); }} onKeyDown={onKeyDown} placeholder="Search or jump to…" aria-label="Search commands" role="combobox" aria-expanded="true" aria-controls="command-results" aria-activedescendant={results[active] ? `command-${active}` : undefined} />
      <ul id="command-results" role="listbox">
        {results.map((command, index) => {
          const heading = command.group !== lastGroup ? command.group : null;
          lastGroup = command.group;
          return <li key={`${command.group}-${command.label}`} role="presentation">
            {heading && <p className="command-group" aria-hidden="true">{heading}</p>}
            <div id={`command-${index}`} role="option" aria-selected={index === active} className="command-item" onMouseMove={() => setActive(index)} onClick={() => run(command)}><span>{command.label}</span>{command.hint && <span className="command-hint">{command.hint}</span>}</div>
          </li>;
        })}
        {!results.length && <li className="command-empty" role="presentation">No results</li>}
      </ul>
    </div>
  </dialog>;
}

function Page({ route }: { route: ReturnType<typeof matchRoute> }) {
  if (route.kind === "home") return <HomePage route={route} />;
  if (route.kind === "blog") return <BlogPage route={route} />;
  if (route.kind === "post") return <BlogPostPage slug={route.slug} route={route} />;
  if (route.kind === "work") return <WorkPage slug={route.slug} route={route} />;
  if (route.kind === "resources") return <ResourcesPage route={route} />;
  if (route.kind === "resource") return <ResourcePage slug={route.slug} route={route} />;
  return <NotFoundPage route={route} />;
}

export function App() {
  const pathname = usePathname();
  const route = useMemo(() => matchRoute(pathname), [pathname]);
  const theme = useTheme();
  return <ThemeContext.Provider value={theme}><Page route={route} /><CommandMenu /></ThemeContext.Provider>;
}

export default App;
