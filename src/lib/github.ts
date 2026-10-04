export type ContributionDay = { date: string; level: number };
export type GitHubActivity = { username: string; total: number; days: ContributionDay[] };

const username = "devzshrc";

export function parseContributions(html: string): Omit<GitHubActivity, "username"> | null {
  const days: ContributionDay[] = [];
  for (const [cell] of html.matchAll(/<td[^>]*ContributionCalendar-day[^>]*>/g)) {
    const date = cell.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
    const level = cell.match(/data-level="(\d)"/)?.[1];
    if (date && level) days.push({ date, level: Number(level) });
  }
  const total = html.match(/([\d,]+)\s+contributions?\s+in the last year/)?.[1];
  if (!days.length || !total) return null;
  days.sort((a, b) => a.date.localeCompare(b.date));
  return { total: Number(total.replaceAll(",", "")), days };
}

export async function githubActivity(request: Request) {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
  try {
    const upstream = await fetch(`https://github.com/users/${username}/contributions`, {
      headers: { "x-requested-with": "XMLHttpRequest", "user-agent": "devzshrc.in" },
    });
    if (!upstream.ok) return Response.json({ error: "Activity unavailable" }, { status: 502 });
    const parsed = parseContributions(await upstream.text());
    if (!parsed) return Response.json({ error: "Activity unavailable" }, { status: 502 });
    return Response.json({ username, ...parsed }, { headers: { "cache-control": "public, max-age=3600" } });
  } catch {
    return Response.json({ error: "Activity unavailable" }, { status: 502 });
  }
}
