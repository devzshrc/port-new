import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { experience, identity, posts, resources, work, type ContentBlock, type Post, type ResourceItem, type SocialLink } from "./content";
import { matchRoute, pageMetadata, postHref, published, resourceHref } from "./lib/site";
import "./index.css";

function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname);
  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  return pathname;
}

function Link({ href, children, className, ariaLabel }: { href: string; children: ReactNode; className?: string; ariaLabel?: string }) {
  const external = /^(https?:|mailto:)/.test(href);
  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (external || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(href, window.location.origin);
    if (url.hash) return;
    event.preventDefault();
    window.history.pushState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  return <a href={href} className={className} aria-label={ariaLabel} onClick={navigate} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{children}</a>;
}

function Metadata({ route }: { route: ReturnType<typeof matchRoute> }) {
  const metadata = pageMetadata(route, resources, posts);
  const resourceImage = route.kind === "resource" ? published(resources).find(resource => resource.slug === route.slug)?.cover : undefined;
  const postImage = route.kind === "post" ? published(posts).find(post => post.slug === route.slug)?.cover : undefined;
  const shareImage = resourceImage ?? postImage;
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
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", shareImage ? "summary_large_image" : "summary");
    if (shareImage) setMeta('meta[property="og:image"]', "property", "og:image", new URL(shareImage, window.location.origin).href);
    else document.head.querySelector('meta[property="og:image"]')?.remove();
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

function Header() {
  return <header className="site-header"><Link href="/" className="site-wordmark" ariaLabel={`${identity.name} home`}>d.</Link><nav aria-label="Primary navigation"><ul>{identity.navigation.map(item => <li key={item.label}><Link href={item.href}>{item.label}</Link></li>)}</ul></nav></header>;
}

function ContactLinks() {
  const copy: Record<SocialLink["network"], string> = {
    cal: "book a call at",
    x: "dm me at",
    github: "see my code at",
    instagram: "i occasionally post on",
    linkedin: "happy to announce that I'm also on",
  };
  const handles: Record<SocialLink["network"], string> = { cal: "cal", x: "x", github: "GitHub", instagram: "instagram", linkedin: "linkedin" };
  const order: SocialLink["network"][] = ["cal", "x", "github", "instagram", "linkedin"];
  return <div className="contact-section"><p className="section-label">humans are social creatures</p><div className="contact-links">{order.map(network => { const link = identity.socials.find(entry => entry.network === network); return link ? <p key={network}>{copy[network]} <Link href={link.href}>@{handles[network]}</Link></p> : null; })}</div></div>;
}

function HomeFooter() {
  return <footer className="home-footer"><p>© {new Date().getFullYear()} {identity.name}. {identity.footer}</p></footer>;
}

function InteriorFooter() {
  return <footer className="interior-footer"><div><nav aria-label="Footer navigation"><Link href="/blog">Blog</Link><Link href="/resources">Resources</Link><Link href="/">Home</Link></nav><p>© {new Date().getFullYear()} {identity.name}. {identity.footer}</p></div></footer>;
}

type TextListItem = { title: string; description: string; href: string; links?: { label: string; href: string }[] };

function TextList({ items }: { items: TextListItem[] }) {
  return <div className="text-list">{items.map(item => <article key={item.title}><h3><Link href={item.href}>{item.title} <span aria-hidden="true">→</span></Link></h3><p>{item.description}</p>{item.links && <div className="work-links">{item.links.map(link => <Link href={link.href} key={link.label}>{link.label} ↗</Link>)}</div>}</article>)}</div>;
}

function HomePage({ route }: { route: ReturnType<typeof matchRoute> }) {
  const visibleWork = published(work).sort((a, b) => a.order - b.order);
  const visiblePosts = published(posts);
  return <><Metadata route={route} /><Header /><main id="content" className="home-content">
    <section className="about section"><img className="avatar" src={identity.avatar} alt={`${identity.name}, ${identity.role}`} width="100" height="100" /><h1>I'm {identity.name}, a software engineer and product builder.</h1>{identity.biography.slice(0, 1).map(paragraph => <p key={paragraph}>{paragraph}</p>)}<ContactLinks /></section>
    <section className="section experience-section"><p className="section-label">Experience</p><div className="experience-list">{experience.map(entry => <article key={entry.company}><img src={entry.icon} alt={`${entry.company} logo`} width="36" height="36" /><div><h2>{entry.company}</h2><p>{entry.role}</p></div><time>{entry.period}</time></article>)}</div></section>
    <section className="section" id="work"><p className="section-label">Creating</p><TextList items={visibleWork} /></section>
    <section className="section"><p className="section-label">Blog</p><TextList items={visiblePosts.map(post => ({ title: post.title, description: post.excerpt, href: postHref(post) }))} /></section>
    <section className="section belief-section"><p className="section-label">firmly believe in -</p><blockquote className="about-quote">{identity.biography[1]}</blockquote></section>
    <HomeFooter />
  </main></>;
}

function ArchiveCard({ resource }: { resource: ResourceItem }) {
  const href = resourceHref(resource);
  return <article className="archive-card"><Link href={href} className="archive-cover"><img src={resource.cover} alt={resource.coverAlt} width="840" height="500" loading="lazy" /></Link><div><h2><Link href={href}>{resource.title} <span aria-hidden="true">→</span></Link></h2><p>{resource.description}</p></div></article>;
}

function ResourcesPage({ route }: { route: ReturnType<typeof matchRoute> }) {
  return <><Metadata route={route} /><Header /><main id="content" className="archive-page"><header className="archive-heading"><h1>Resources</h1><p>Build notes, guides and useful collections.</p></header><div className="archive-grid">{published(resources).map(resource => <ArchiveCard key={resource.slug} resource={resource} />)}</div></main><InteriorFooter /></>;
}

function BlogCard({ post }: { post: Post }) {
  const href = postHref(post);
  return <article className="archive-card"><Link href={href} className="archive-cover"><img src={post.cover} alt={post.coverAlt} width="840" height="500" loading="lazy" /></Link><div><h2><Link href={href}>{post.title} <span aria-hidden="true">→</span></Link></h2><p>{post.excerpt}</p><small>{post.date}</small></div></article>;
}

function BlogPage({ route }: { route: ReturnType<typeof matchRoute> }) {
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

function NotFoundPage({ route }: { route: ReturnType<typeof matchRoute> }) {
  return <><Metadata route={route} /><Header /><main id="content" className="not-found"><p>404</p><h1>That page isn't here.</h1><span>The link may be old, or the page may have moved.</span><Link href="/">Return home →</Link></main><InteriorFooter /></>;
}

export function App() {
  const pathname = usePathname();
  const route = useMemo(() => matchRoute(pathname), [pathname]);
  if (route.kind === "home") return <HomePage route={route} />;
  if (route.kind === "blog") return <BlogPage route={route} />;
  if (route.kind === "post") return <BlogPostPage slug={route.slug} route={route} />;
  if (route.kind === "resources") return <ResourcesPage route={route} />;
  if (route.kind === "resource") return <ResourcePage slug={route.slug} route={route} />;
  return <NotFoundPage route={route} />;
}

export default App;
