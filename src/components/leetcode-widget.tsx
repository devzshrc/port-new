import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { RecentSolve } from "../lib/leetcode";

type LeetCodeStats = { username: string; total: number; easy: number; medium: number; hard: number; recent?: RecentSolve[] };

const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
function timeAgo(timestamp: number) {
  const days = Math.round((timestamp - Date.now()) / 86_400_000);
  if (days > -1) return "Today";
  if (days > -30) return relativeTime.format(days, "day");
  if (days > -365) return relativeTime.format(Math.round(days / 30), "month");
  return relativeTime.format(Math.round(days / 365), "year");
}

export function LeetCodeWidget() {
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/leetcode-stats", { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error("Stats unavailable");
        return response.json() as Promise<LeetCodeStats>;
      })
      .then(setStats)
      .catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, []);

  if (!stats) return <p className="lc-status" aria-live="polite">{failed ? "Stats temporarily unavailable" : "Loading stats…"}</p>;

  const levels = [
    { key: "easy", label: "Easy", value: stats.easy },
    { key: "medium", label: "Medium", value: stats.medium },
    { key: "hard", label: "Hard", value: stats.hard },
  ] as const;

  return <article className="lc-card">
    <header className="lc-head">
      <span className="lc-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="#FFA116"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg></span>
      <div>
        <p className="lc-name">LeetCode</p>
        <p className="lc-user">@{stats.username}</p>
      </div>
      <a className="lc-open" href={`https://leetcode.com/u/${stats.username}/`} target="_blank" rel="noreferrer" aria-label="Open LeetCode profile"><ArrowUpRight size={18} /></a>
    </header>

    <div className="lc-summary">
      <div className="lc-total">
        <strong>{stats.total}</strong>
        <span>Problems solved</span>
      </div>
      <dl className="lc-levels">
        {levels.map(level => <div key={level.key}><dt>{level.label}</dt><dd>{level.value}</dd></div>)}
      </dl>
    </div>

    <div className="lc-bar" role="img" aria-label={`${stats.easy} easy, ${stats.medium} medium, ${stats.hard} hard`}>
      {levels.map(level => level.value > 0 && <span key={level.key} data-level={level.key} style={{ flexGrow: level.value }} />)}
    </div>

    {stats.recent && stats.recent.length > 0 && <ul className="lc-recent">
      {stats.recent.map(item => <li key={item.slug}>
        <a href={`https://leetcode.com/problems/${item.slug}/`} target="_blank" rel="noreferrer">{item.title}</a>
        <time dateTime={new Date(item.solvedAt).toISOString()}>{timeAgo(item.solvedAt)}</time>
      </li>)}
    </ul>}
  </article>;
}
