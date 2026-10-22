import { identity, type ContentBlock, type Post, type PublicationStatus, type ResourceItem, type WorkItem } from "../content";

export type RouteMatch =
  | { kind: "home" }
  | { kind: "blog" }
  | { kind: "post"; slug: string }
  | { kind: "work"; slug: string }
  | { kind: "resources" }
  | { kind: "resource"; slug: string }
  | { kind: "now" }
  | { kind: "not-found" };

export function matchRoute(pathname: string): RouteMatch {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return { kind: "home" };
  if (path === "/blog") return { kind: "blog" };
  const post = path.match(/^\/blog\/([^/]+)$/);
  if (post) return { kind: "post", slug: decodeURIComponent(post[1]!) };
  const work = path.match(/^\/work\/([^/]+)$/);
  if (work) return { kind: "work", slug: decodeURIComponent(work[1]!) };
  if (path === "/resources") return { kind: "resources" };
  if (path === "/now") return { kind: "now" };
  const resource = path.match(/^\/resources\/([^/]+)$/);
  if (resource) return { kind: "resource", slug: decodeURIComponent(resource[1]!) };
  return { kind: "not-found" };
}

export function published<T extends { status: PublicationStatus }>(entries: T[]) {
  return entries.filter(entry => entry.status === "published");
}

export function resourceHref(resource: ResourceItem) {
  return resource.externalUrl ?? `/resources/${resource.slug}`;
}

export function postHref(post: Post) {
  return `/blog/${post.slug}`;
}

export function findCaseStudy(allWork: WorkItem[], slug: string) {
  return published(allWork).find(entry => entry.caseStudy?.slug === slug);
}

export function pageMetadata(route: RouteMatch, allResources: ResourceItem[], allPosts: Post[] = [], allWork: WorkItem[] = []) {
  const suffix = "Devashish";
  if (route.kind === "home") return { title: `${suffix} | Software Engineer`, description: "Product engineering and selected work from Devashish." };
  if (route.kind === "blog") return { title: `Blog | ${suffix}`, description: "Notes on product engineering and building useful software." };
  if (route.kind === "post") {
    const post = allPosts.find(entry => entry.slug === route.slug);
    if (post) return { title: `${post.title} | ${suffix}`, description: post.excerpt };
  }
  if (route.kind === "work") {
    const entry = findCaseStudy(allWork, route.slug);
    if (entry) return { title: `${entry.title} | ${suffix}`, description: entry.description };
  }
  if (route.kind === "now") return { title: `Now | ${suffix}`, description: identity.now.text };
  if (route.kind === "resources") return { title: `Resources | ${suffix}`, description: "Useful resources and build notes from Devashish." };
  if (route.kind === "resource") {
    const resource = published(allResources).find(entry => entry.slug === route.slug);
    if (resource) return { title: `${resource.title} | ${suffix}`, description: resource.description };
  }
  return { title: `Page not found | ${suffix}`, description: "The requested page could not be found." };
}

function blockText(block: ContentBlock): string {
  if (block.type === "list") return block.items.join(" ");
  if (block.type === "figure") return block.caption;
  if (block.type === "callout") return `${block.title} ${block.text}`;
  if ("text" in block) return block.text;
  return "";
}

/** Whole minutes to read the body at 200 words a minute, never less than one. */
export function readingMinutes(body: ContentBlock[]) {
  const words = body.reduce((count, block) => count + blockText(block).split(/\s+/).filter(Boolean).length, 0);
  return Math.max(1, Math.ceil(words / 200));
}
