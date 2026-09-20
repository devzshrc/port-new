import { describe, expect, test } from "bun:test";
import { posts, resources, work } from "../content";
import { matchRoute, pageMetadata, published, resourceHref } from "./site";

describe("portfolio helpers", () => {
  test("matches the public routes and sample blog route", () => {
    expect(matchRoute("/")).toEqual({ kind: "home" });
    expect(matchRoute("/blog/")).toEqual({ kind: "blog" });
    expect(matchRoute("/blog/sample-blog")).toEqual({ kind: "post", slug: "sample-blog" });
    expect(matchRoute("/resources/")).toEqual({ kind: "resources" });
    expect(matchRoute("/resources/example")).toEqual({ kind: "resource", slug: "example" });
    expect(matchRoute("/missing")).toEqual({ kind: "not-found" });
  });

  test("hides draft work and keeps published work", () => {
    expect(published(work).every(entry => entry.status === "published")).toBe(true);
  });

  test("distinguishes internal and external resource destinations", () => {
    expect(resourceHref(resources[0]!)).toBe("/resources/portfolio");
    expect(resourceHref({ ...resources[0]!, externalUrl: "https://example.com" })).toBe("https://example.com");
  });

  test("derives metadata from the remaining routes", () => {
    expect(pageMetadata(matchRoute("/blog/sample-blog"), resources, posts).title).toContain("Sample blog");
    expect(pageMetadata(matchRoute("/resources/portfolio"), resources).title).toContain("Portfolio build notes");
    expect(pageMetadata(matchRoute("/unknown"), resources).title).toContain("Page not found");
  });
});
