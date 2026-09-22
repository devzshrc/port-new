import type { Post, PublicationStatus, ResourceItem } from "../content";

export type RouteMatch =
  | { kind: "home" }
  | { kind: "blog" }
  | { kind: "post"; slug: string }
  | { kind: "resources" }
  | { kind: "resource"; slug: string }
  | { kind: "not-found" };

export function matchRoute(pathname: string): RouteMatch {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return { kind: "home" };
  if (path === "/blog") return { kind: "blog" };
  const post = path.match(/^\/blog\/([^/]+)$/);
  if (post) return { kind: "post", slug: decodeURIComponent(post[1]!) };
  if (path === "/resources") return { kind: "resources" };
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

export function pageMetadata(route: RouteMatch, allResources: ResourceItem[], allPosts: Post[] = []) {
  const suffix = "Devashish";
  if (route.kind === "home") return { title: `${suffix} | Software Engineer`, description: "Product engineering and selected work from Devashish." };
  if (route.kind === "blog") return { title: `Blog | ${suffix}`, description: "Notes on product engineering and building useful software." };
  if (route.kind === "post") {
    const post = published(allPosts).find(entry => entry.slug === route.slug);
    if (post) return { title: `${post.title} | ${suffix}`, description: post.excerpt };
  }
  if (route.kind === "resources") return { title: `Resources | ${suffix}`, description: "Useful resources and build notes from Devashish." };
  if (route.kind === "resource") {
    const resource = published(allResources).find(entry => entry.slug === route.slug);
    if (resource) return { title: `${resource.title} | ${suffix}`, description: resource.description };
  }
  return { title: `Page not found | ${suffix}`, description: "The requested page could not be found." };
}
