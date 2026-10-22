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

  return <>
    <HeatmapCalendar title="Contributions" data={activity.days.map(day => ({ date: day.date, value: day.level }))} axisLabels yearSelector />
    <p className="heatmap-total"><strong>{activity.total.toLocaleString("en-US")}</strong> contributions in the last year</p>
  </>;
}
