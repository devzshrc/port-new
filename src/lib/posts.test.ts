import { describe, expect, test } from "bun:test";
import type { Post } from "../content";
import { allTags, filterPosts, neighbours, relatedPosts, seriesPart, slugify, tocEntries } from "./posts";

const make = (slug: string, extra: Partial<Post> = {}): Post => ({
  slug, title: slug, excerpt: `about ${slug}`, date: "October 1, 2026", cover: "", coverAlt: "", status: "published", body: [], ...extra,
});
const list = [
  make("newest", { tags: ["llm"], series: "Guide" }),
  make("middle", { tags: ["css", "llm"] }),
  make("oldest", { tags: ["llm"], series: "Guide" }),
];

describe("posts", () => {
  test("slugifies headings", () => {
    expect(slugify("3.1 What Is a Model?")).toBe("3-1-what-is-a-model");
  });

  test("table of contents uses level-2 headings only", () => {
    const body = [
      { type: "heading" as const, text: "Big part", level: 2 as const },
      { type: "heading" as const, text: "Small part", level: 3 as const },
    ];
    expect(tocEntries(body)).toEqual([{ id: "big-part", text: "Big part" }]);
  });

  test("neighbours: newer is before, older is after", () => {
    expect(neighbours(list[1]!, list)).toEqual({ newer: list[0], older: list[2] });
    expect(neighbours(list[0]!, list).newer).toBeUndefined();
  });

  test("series part counts from the first post written", () => {
    expect(seriesPart(list[2]!, list)).toEqual({ part: 1, total: 2 });
    expect(seriesPart(list[0]!, list)).toEqual({ part: 2, total: 2 });
    expect(seriesPart(list[1]!, list)).toBeNull();
  });

  test("related posts share tags, most shared first, excluding the post itself", () => {
    expect(relatedPosts(list[1]!, list).map(post => post.slug)).toEqual(["newest", "oldest"]);
  });

  test("filters by tag and by search text", () => {
    expect(filterPosts(list, "", "css").map(post => post.slug)).toEqual(["middle"]);
    expect(filterPosts(list, "ABOUT NEWEST", null).map(post => post.slug)).toEqual(["newest"]);
    expect(allTags(list)).toEqual(["css", "llm"]);
  });
});
