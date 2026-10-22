import { describe, expect, test } from "bun:test";
import { parseMarkdown } from "./markdown";

describe("parseMarkdown", () => {
  test("keeps headings, paragraphs and lists, and drops the page title", () => {
    const blocks = parseMarkdown("# Title\n\n## Section\n\nFirst line\nsecond line.\n\n- one\n- **two**\n");
    expect(blocks).toEqual([
      { type: "heading", text: "Section", level: 2 },
      { type: "paragraph", text: "First line second line." },
      { type: "list", items: ["one", "two"] },
    ]);
  });

  test("reads code fences with a label, and skips the text label", () => {
    const blocks = parseMarkdown("```typescript\nconst a = 1;\n```\n\n```text\nflow\n```");
    expect(blocks).toEqual([
      { type: "code", code: "const a = 1;", label: "typescript" },
      { type: "code", code: "flow", label: undefined },
    ]);
  });

  test("turns tables into rows and maths into plain text", () => {
    const blocks = parseMarkdown("| Token | Share |\n|---|---:|\n| Paris | 87% |\n\n\\[\ny = wx + b\n\\]");
    expect(blocks).toEqual([
      { type: "list", items: ["Token — Share", "Paris — 87%"] },
      { type: "paragraph", text: "y = wx + b" },
    ]);
  });
});
