import type { ContentBlock, Post } from "../content";

export function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "section";
}

/** Level-2 headings only, so the table of contents stays short. */
export function tocEntries(body: ContentBlock[]) {
  return body.flatMap(block => (block.type === "heading" && block.level === 2 ? [{ id: slugify(block.text), text: block.text }] : []));
}

export function publishedPosts(all: Post[]) {
  return all.filter(post => post.status === "published");
}

/** Posts are listed newest first, so "newer" is the entry before this one and "older" the one after. */
export function neighbours(post: Post, list: Post[]) {
  const index = list.findIndex(entry => entry.slug === post.slug);
  return {
    newer: index > 0 ? list[index - 1] : undefined,
    older: index >= 0 && index < list.length - 1 ? list[index + 1] : undefined,
  };
}

/** Position within a series, counted from the first post written. */
export function seriesPart(post: Post, list: Post[]) {
  if (!post.series) return null;
  const members = list.filter(entry => entry.series === post.series).reverse();
  const index = members.findIndex(entry => entry.slug === post.slug);
  return index < 0 ? null : { part: index + 1, total: members.length };
}

/** Other posts that share at least one tag, most shared first. */
export function relatedPosts(post: Post, list: Post[], limit = 2) {
  const tags = new Set(post.tags ?? []);
  return list
    .filter(entry => entry.slug !== post.slug)
    .map(entry => ({ entry, shared: (entry.tags ?? []).filter(tag => tags.has(tag)).length }))
    .filter(item => item.shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map(item => item.entry);
}

export function allTags(list: Post[]) {
  return [...new Set(list.flatMap(post => post.tags ?? []))].sort();
}

/** Filters by tag (exact) and by a search over title, excerpt and tags (case-insensitive). */
export function filterPosts(list: Post[], query: string, tag: string | null) {
  const needle = query.trim().toLowerCase();
  return list.filter(post => {
    if (tag && !(post.tags ?? []).includes(tag)) return false;
    if (!needle) return true;
    return `${post.title} ${post.excerpt} ${(post.tags ?? []).join(" ")}`.toLowerCase().includes(needle);
  });
}
