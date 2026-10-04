import { expect, test } from "bun:test";
import { parseContributions } from "./github";

test("parses GitHub's contribution calendar markup", () => {
  const html = `<h2>\n  1,234\n  contributions\n    in the last year\n</h2>
    <td data-date="2026-01-02" id="a" data-level="3" class="ContributionCalendar-day"></td>
    <td data-date="2026-01-01" id="b" data-level="0" class="ContributionCalendar-day"></td>`;
  expect(parseContributions(html)).toEqual({ total: 1234, days: [{ date: "2026-01-01", level: 0 }, { date: "2026-01-02", level: 3 }] });
  expect(parseContributions("<p>nothing</p>")).toBeNull();
});
