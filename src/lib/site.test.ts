import { describe, expect, test } from "bun:test";
import { posts, resources, work } from "../content";
import { matchRoute, pageMetadata, published, resourceHref } from "./site";

describe("portfolio helpers", () => {
  test("matches route patterns", () => {
    expect(matchRoute("/")).toEqual({ kind: "home" });
    expect(matchRoute("/blog/")).toEqual({ kind: "blog" });
    expect(matchRoute("/blog/sample-blog")).toEqual({ kind: "post", slug: "sample-blog" });
    expect(matchRoute("/resources/")).toEqual({ kind: "resources" });
    expect(matchRoute("/resources/example")).toEqual({ kind: "resource", slug: "example" });
    expect(matchRoute("/missing")).toEqual({ kind: "not-found" });
  });

  test("only shows finished work and hides placeholder content", () => {
    expect(published(work).map(entry => entry.title)).toEqual(["Schema — AI form builder"]);
    expect(published(posts)).toEqual([]);
    expect(published(resources)).toEqual([]);
  });

  test("distinguishes internal and external resource destinations", () => {
    expect(resourceHref(resources[0]!)).toBe("/resources/portfolio");
    expect(resourceHref({ ...resources[0]!, externalUrl: "https://example.com" })).toBe("https://example.com");
  });

  test("derives metadata from the remaining routes", () => {
    expect(pageMetadata(matchRoute("/blog/sample-blog"), resources, posts).title).toContain("Page not found");
    expect(pageMetadata(matchRoute("/resources/portfolio"), resources).title).toContain("Page not found");
    expect(pageMetadata(matchRoute("/unknown"), resources).title).toContain("Page not found");
  });
});
