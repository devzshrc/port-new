const query = `query userProfile($username: String!) {
  matchedUser(username: $username) {
    username
    submitStats { acSubmissionNum { difficulty count } }
  }
  recentAcSubmissionList(username: $username, limit: 15) { title titleSlug timestamp }
}`;

export type RecentSolve = { title: string; slug: string; solvedAt: number };

export async function leetcodeStats(request: Request) {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
  try {
    const upstream = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "content-type": "application/json", referer: "https://leetcode.com" },
      body: JSON.stringify({ query, variables: { username: "devzshrc" } }),
    });
    if (!upstream.ok) return Response.json({ error: "Stats unavailable" }, { status: 502 });
    const payload = await upstream.json() as {
      data?: {
        matchedUser?: { submitStats?: { acSubmissionNum?: { difficulty: string; count: number }[] } } | null;
        recentAcSubmissionList?: { title: string; titleSlug: string; timestamp: string }[] | null;
      };
    };
    const counts = payload.data?.matchedUser?.submitStats?.acSubmissionNum;
    const count = (difficulty: string) => counts?.find(item => item.difficulty === difficulty)?.count;
    const total = count("All");
    const easy = count("Easy");
    const medium = count("Medium");
    const hard = count("Hard");
    if ([total, easy, medium, hard].some(value => value === undefined)) {
      return Response.json({ error: "Stats unavailable" }, { status: 502 });
    }
    const recent: RecentSolve[] = [];
    for (const item of payload.data?.recentAcSubmissionList ?? []) {
      if (recent.length === 3) break;
      if (!recent.some(entry => entry.slug === item.titleSlug)) recent.push({ title: item.title, slug: item.titleSlug, solvedAt: Number(item.timestamp) * 1000 });
    }
    return Response.json({ username: "devzshrc", total, easy, medium, hard, recent }, {
      headers: { "cache-control": "public, max-age=900" },
    });
  } catch {
    return Response.json({ error: "Stats unavailable" }, { status: 502 });
  }
}
