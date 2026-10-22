import type { ContentBlock } from "../content";

/** Plain text for the blog: markdown markers are removed, the words are kept. */
function inline(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, "$1$2")
    .replace(/\\times/g, "×")
    .trim();
}

const listItem = /^(\s*)([-*]|\d+\.)\s+(.*)$/;
const separatorRow = /^\|?\s*:?-{2,}/;

/**
 * Turns a small markdown subset into post blocks: headings, paragraphs, lists,
 * quotes, code fences, dividers, tables (as lists of rows) and \[ \] maths (as text).
 * The single `#` title is skipped because the post page shows the title itself.
 */
export function parseMarkdown(source: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  let paragraph: string[] = [];
  let quote: string[] = [];
  let items: string[] = [];
  let ordered = false;

  const flush = () => {
    if (paragraph.length) blocks.push({ type: "paragraph", text: inline(paragraph.join(" ")) });
    if (quote.length) blocks.push({ type: "quote", text: inline(quote.join(" ")) });
    if (items.length) blocks.push({ type: "list", items: items.map(inline) });
    paragraph = [];
    quote = [];
    items = [];
    ordered = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flush();
      const label = trimmed.slice(3).trim();
      const code: string[] = [];
      for (i++; i < lines.length && !(lines[i] ?? "").trim().startsWith("```"); i++) code.push(lines[i] ?? "");
      blocks.push({ type: "code", code: code.join("\n"), label: label && label !== "text" ? label : undefined });
      continue;
    }

    if (trimmed === "\\[") {
      flush();
      const maths: string[] = [];
      for (i++; i < lines.length && (lines[i] ?? "").trim() !== "\\]"; i++) maths.push((lines[i] ?? "").trim());
      blocks.push({ type: "paragraph", text: inline(maths.join(" ")) });
      continue;
    }

    if (trimmed === "") {
      flush();
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      flush();
      blocks.push({ type: "divider" });
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flush();
      if (heading[1]?.length !== 1) blocks.push({ type: "heading", text: inline(heading[2] ?? ""), level: heading[1]?.length === 2 ? 2 : 3 });
      continue;
    }

    if (trimmed.startsWith("|")) {
      flush();
      for (; i < lines.length && (lines[i] ?? "").trim().startsWith("|"); i++) {
        const row = (lines[i] ?? "").trim();
        if (separatorRow.test(row.replace(/^\|/, ""))) continue;
        const cells = row.replace(/^\||\|$/g, "").split("|").map(cell => cell.trim()).filter(Boolean);
        if (cells.length) items.push(cells.join(" — "));
      }
      i--;
      blocks.push({ type: "list", items: items.map(inline) });
      items = [];
      continue;
    }

    const bullet = line.match(listItem);
    if (bullet) {
      if (paragraph.length || quote.length) flush();
      const isOrdered = /\d/.test(bullet[2] ?? "");
      if (items.length && ordered !== isOrdered) flush();
      ordered = isOrdered;
      items.push(bullet[3] ?? "");
      continue;
    }

    if (items.length && /^\s+\S/.test(line)) {
      items[items.length - 1] += ` ${trimmed}`;
      continue;
    }

    if (trimmed.startsWith(">")) {
      if (paragraph.length || items.length) flush();
      quote.push(trimmed.replace(/^>\s?/, ""));
      continue;
    }

    if (items.length) flush();
    paragraph.push(trimmed);
  }

  flush();
  return blocks;
}
