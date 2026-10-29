import { useEffect, useState } from "react";
import type { GitHubActivity } from "../lib/github";
import { HeatmapCalendar } from "./heatmap-calendar";

export function GitHubHeatmap() {
  const [activity, setActivity] = useState<GitHubActivity | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/github-activity", { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error("Activity unavailable");
        return response.json() as Promise<GitHubActivity>;
      })
      .then(setActivity)
      .catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, []);

  if (!activity) return <p className="heatmap-status" aria-live="polite">{failed ? "Activity temporarily unavailable" : "Loading activity…"}</p>;

  const activeDays = activity.days.filter(day => day.level > 0).length;
  let streak = 0;
  let longestStreak = 0;
  let previous = 0;
  for (const day of [...activity.days].sort((a, b) => a.date.localeCompare(b.date))) {
    const date = Date.parse(`${day.date}T00:00:00Z`);
    streak = day.level > 0 ? (date - previous === 86_400_000 ? streak + 1 : 1) : 0;
    longestStreak = Math.max(longestStreak, streak);
    previous = date;
  }

  return <div className="github-activity">
    <div className="github-activity-head"><p>Contribution activity <span>· Last year</span></p><a href={`https://github.com/${activity.username}`} target="_blank" rel="noreferrer">View GitHub <span aria-hidden="true">↗</span><span className="visually-hidden"> (opens in new tab)</span></a></div>
    <dl className="github-stats">
      <div><dt>Contributions</dt><dd>{activity.total.toLocaleString("en-US")}</dd></div>
      <div><dt>Active days</dt><dd>{activeDays.toLocaleString("en-US")}</dd></div>
      <div><dt>Longest streak</dt><dd>{longestStreak} <span>days</span></dd></div>
    </dl>
    <HeatmapCalendar data={activity.days.map(day => ({ date: day.date, value: day.level }))} />
  </div>;
}
