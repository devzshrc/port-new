import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { homeTitle, identity, posts, profileLinks, resources, work, type ContentBlock, type Post, type ResourceItem } from "./content";
import { findCaseStudy, matchRoute, pageMetadata, postHref, published, readingMinutes, resourceHref } from "./lib/site";
import { neighbours, publishedPosts, relatedPosts, seriesPart, slugify } from "./lib/posts";
import { BlogIndex, CodeBlock, PostNav, PostToc, ReadingProgress, RelatedPosts, SubscribeForm } from "./components/post-tools";
import { MermaidDiagram } from "./components/mermaid-diagram";
import { AuthorCard, ShareRow } from "./components/post-parts";
import "./index.css";
import "./components/reference-home.css";
import { ReferenceHome } from "./components/reference-home";

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
  const resourceImage = route.kind === "resource" ? published(resources).find(resource => resource.slug === route.slug)?.cover : undefined;
  const postImage = route.kind === "post" ? published(posts).find(post => post.slug === route.slug)?.cover : undefined;
  const shareImage = resourceImage ?? postImage ?? "/og.png";
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
    structuredData.text = JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: identity.name, jobTitle: identity.role, address: { "@type": "PostalAddress", addressCountry: identity.location }, url: window.location.origin, sameAs: profileLinks() });

    const post = route.kind === "post" ? posts.find(entry => entry.slug === route.slug) : undefined;
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = post?.status === "draft" ? "noindex, nofollow" : "index, follow";

    let article = document.head.querySelector<HTMLScriptElement>("script[data-article-json-ld]");
    if (post && post.status === "published") {
      if (!article) {
        article = document.createElement("script");
        article.type = "application/ld+json";
        article.dataset.articleJsonLd = "true";
        document.head.appendChild(article);
      }
      article.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: new Date(post.date).toISOString(),
        dateModified: new Date(post.updated ?? post.date).toISOString(),
        author: { "@type": "Person", name: identity.name },
        image: new URL(post.cover, window.location.origin).href,
        url: `${window.location.origin}/blog/${post.slug}`,
      });
    } else {
      article?.remove();
    }
  }, [metadata.description, metadata.title, shareImage, route]);
  return null;
}

function Header() {
  return <header className="site-header"><Link href="/" className="site-wordmark" ariaLabel={`${identity.name} home`}>{identity.name}</Link><nav aria-label="Primary navigation"><ul>{identity.navigation.map(item => <li key={item.label}><Link href={item.href}>{item.label}</Link></li>)}</ul></nav></header>;
}

function InteriorFooter() {
  return <footer className="interior-footer"><div><nav aria-label="Footer navigation"><Link href="/">Home</Link><Link href="/#work">Work</Link><Link href="/#contact">Contact</Link></nav><p>© {new Date().getFullYear()} {identity.name}. {identity.footer}</p></div></footer>;
}

function HomePage({ route }: { route: ReturnType<typeof matchRoute> }) {
  return <><Metadata route={route} /><ReferenceHome /></>;
}

function ArchiveCard({ resource }: { resource: ResourceItem }) {
  const href = resourceHref(resource);
  return <article className="archive-card"><Link href={href} className="archive-cover"><img src={resource.cover} alt={resource.coverAlt} width="840" height="500" loading="lazy" /></Link><div><h2><Link href={href}>{resource.title} <span aria-hidden="true">→</span></Link></h2><p>{resource.description}</p></div></article>;
}

function ResourcesPage({ route }: { route: ReturnType<typeof matchRoute> }) {
  if (!published(resources).length) return <NotFoundPage route={{ kind: "not-found" }} />;
  return <><Metadata route={route} /><Header /><main id="content" className="archive-page"><header className="archive-heading"><h1>Resources</h1><p>Build notes, guides and useful collections.</p></header><div className="archive-grid">{published(resources).map(resource => <ArchiveCard key={resource.slug} resource={resource} />)}</div></main><InteriorFooter /></>;
}

function BlogPage({ route }: { route: ReturnType<typeof matchRoute> }) {
  const entries = published(posts);
  if (!entries.length) return <NotFoundPage route={{ kind: "not-found" }} />;
  return <><Metadata route={route} /><main id="content" className="folio writing">
    <Link className="back-link" href="/">← Home</Link>
    <header className="project-intro">
      <h1>Writing</h1>
      <p>Notes on product engineering and building useful software.</p>
    </header>
    <BlogIndex entries={entries} />
    <SubscribeForm />
    <p className="folio-footer">© {new Date().getFullYear()} {identity.name}. {identity.footer}</p>
  </main></>;
}

function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return <div className="entry-content">{blocks.map((block, index) => { const key = `${block.type}-${index}`;
    if (block.type === "paragraph") return <p key={key}>{block.text}</p>;
    if (block.type === "heading") {
      const id = slugify(block.text);
      const anchor = <a className="heading-anchor" href={`#${id}`} aria-label={`Link to ${block.text}`}>#</a>;
      return block.level === 3
        ? <h3 key={key} id={id}>{block.text} {anchor}</h3>
        : <h2 key={key} id={id}>{block.text} {anchor}</h2>;
    }
    if (block.type === "image") return <img key={key} src={block.src} alt={block.alt} loading="lazy" />;
    if (block.type === "figure") return <figure key={key}><img src={block.src} alt={block.alt} loading="lazy" /><figcaption>{block.caption}</figcaption></figure>;
    if (block.type === "quote") return <blockquote key={key}>{block.text}</blockquote>;
    if (block.type === "list") return <ul key={key}>{block.items.map(item => <li key={item}>{item}</li>)}</ul>;
    if (block.type === "code") return block.label === "mermaid" ? <MermaidDiagram key={key} chart={block.code} /> : <CodeBlock key={key} code={block.code} label={block.label} />;
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
  const preview = new URLSearchParams(window.location.search).has("preview");
  const post = posts.find(entry => entry.slug === slug && (entry.status === "published" || preview));
  if (!post) return <NotFoundPage route={{ kind: "not-found" }} />;
  const list = publishedPosts(posts);
  const { newer, older } = neighbours(post, list);
  const series = seriesPart(post, list);
  const project = post.project ? work.find(entry => entry.caseStudy?.slug === post.project) : undefined;
  return <><Metadata route={route} /><main id="content" className="folio post">
    <Link className="back-link" href="/blog">← All writing</Link>
    {post.status === "draft" && <p className="draft-banner">Draft preview. This post is not published.</p>}
    <header className="post-header">
      <p className="post-meta">
        {series && <>Part {series.part} of {series.total} · </>}
        {post.date}{post.updated && ` · Updated ${post.updated}`} · {readingMinutes(post.body)} min read
      </p>
      <h1>{post.title}</h1>
      <p className="post-summary">{post.excerpt}</p>
      {project && <p className="post-project">About <a href={`/work/${project.caseStudy?.slug}`}>{project.title}</a></p>}
      {post.tags && post.tags.length > 0 && <div className="post-tags">{post.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
    </header>
    <img className="post-hero" src={post.cover} alt={post.coverAlt} width="840" height="500" />
    {post.body.length > 8 && <ReadingProgress />}
    <PostToc body={post.body} />
    <div className="project-body post-body"><ContentBlocks blocks={post.body} /></div>
    <ShareRow title={post.title} />
    <AuthorCard />
    <PostNav newer={newer} older={older} />
    <RelatedPosts items={relatedPosts(post, list)} />
    <p className="folio-footer">© {new Date().getFullYear()} {identity.name}. {identity.footer}</p>
  </main></>;
}

function WorkPage({ slug, route }: { slug: string; route: ReturnType<typeof matchRoute> }) {
  const entry = findCaseStudy(work, slug);
  if (!entry?.caseStudy) return <NotFoundPage route={{ kind: "not-found" }} />;
  const { caseStudy } = entry;
  return <><Metadata route={route} /><main id="content" className="folio project">
    <Link className="back-link" href="/#work">← All projects</Link>
    <header className="project-intro">
      <h1>{entry.title}</h1>
      <p>{entry.description}</p>
      <p className="project-meta">{caseStudy.role} · {caseStudy.year}</p>
      <p className="project-stack">{caseStudy.stack.join(" · ")}</p>
    </header>
    {entry.links && <div className="intro-actions">{entry.links.map((link, index) => <a key={link.label} className={index === 0 ? "button-primary" : "pill"} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div>}
    <div className="project-body"><ContentBlocks blocks={caseStudy.body} /></div>
    {published(posts).some(post => post.project === caseStudy.slug) && <section className="related">
      <h2 className="section-title">Writing about this project</h2>
      <ul className="row-list post-list">
        {published(posts).filter(post => post.project === caseStudy.slug).map(post => <li key={post.slug}>
          <div className="row-main"><a className="row-title" href={postHref(post)}>{post.title}</a><p>{post.excerpt}</p></div>
          <time>{post.date}</time>
        </li>)}
      </ul>
    </section>}
    <p className="folio-footer">© {new Date().getFullYear()} {identity.name}. {identity.footer}</p>
  </main></>;
}

function NowPage({ route }: { route: ReturnType<typeof matchRoute> }) {
  return <><Metadata route={route} /><main id="content" className="folio writing">
    <Link className="back-link" href="/">← Home</Link>
    <header className="project-intro">
      <h1>Now</h1>
      <p>{identity.now.text}</p>
      <p className="project-meta">Updated {identity.now.updated}</p>
    </header>
    <p className="folio-footer">© {new Date().getFullYear()} {identity.name}. {identity.footer}</p>
  </main></>;
}

function NotFoundPage({ route }: { route: ReturnType<typeof matchRoute> }) {
  return <><Metadata route={route} /><Header /><main id="content" className="not-found"><p>404</p><h1>That page isn't here.</h1><span>The link may be old, or the page may have moved.</span><Link href="/">Return home →</Link></main><InteriorFooter /></>;
}

function Page({ route }: { route: ReturnType<typeof matchRoute> }) {
  if (route.kind === "home") return <HomePage route={route} />;
  if (route.kind === "blog") return <BlogPage route={route} />;
  if (route.kind === "post") return <BlogPostPage slug={route.slug} route={route} />;
  if (route.kind === "work") return <WorkPage slug={route.slug} route={route} />;
  if (route.kind === "resources") return <ResourcesPage route={route} />;
  if (route.kind === "now") return <NowPage route={route} />;
  if (route.kind === "resource") return <ResourcePage slug={route.slug} route={route} />;
  return <NotFoundPage route={route} />;
}

export function App() {
  const pathname = usePathname();
  const route = useMemo(() => matchRoute(pathname), [pathname]);
  return <Page route={route} />;
}

export default App;
