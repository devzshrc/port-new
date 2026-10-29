import { useMemo } from "react";

export type HeatmapDatum = { date: string; value: number };
type Props = { data: HeatmapDatum[] };

const dayMs = 86_400_000;
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekdays = ["", "Mon", "", "Wed", "", "Fri", ""];

export function HeatmapCalendar({ data }: Props) {
  const cells = useMemo(() => {
    if (!data.length) return [];
    const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
    const start = Date.parse(`${sorted[0]!.date}T00:00:00Z`);
    const offset = new Date(start).getUTCDay();
    return sorted.map(day => {
      const date = new Date(`${day.date}T00:00:00Z`);
      const index = Math.round((date.getTime() - start) / dayMs) + offset;
      return { ...day, col: Math.floor(index / 7), row: date.getUTCDay(), month: date.getUTCMonth() };
    });
  }, [data]);
  const weeks = cells.length ? cells[cells.length - 1]!.col + 1 : 0;
  const monthStarts = cells.filter((cell, index) => index === 0 || cell.date.endsWith("-01"));

  return <figure className="heatmap-calendar">
    <div className="heatmap-scroll" tabIndex={0} aria-label="Contribution calendar, scroll horizontally to see all dates">
      <div className="heatmap-grid" role="img" aria-label="GitHub contribution activity over the last year. Darker green indicates more contributions." style={{ gridTemplateColumns: `32px repeat(${weeks}, 9px)` }}>
        {monthStarts.map(cell => <span key={cell.date} className="heatmap-month" style={{ gridColumn: cell.col + 2, gridRow: 1 }}>{months[cell.month]}</span>)}
        {weekdays.map((label, row) => label && <span key={label} className="heatmap-weekday" style={{ gridColumn: 1, gridRow: row + 2 }}>{label}</span>)}
        {cells.map(cell => <span key={cell.date} className="heatmap-cell" data-level={cell.value} title={`${cell.date}: ${cell.value === 0 ? "No contributions" : `Activity level ${cell.value} of 4`}`} style={{ gridColumn: cell.col + 2, gridRow: cell.row + 2 }} />)}
      </div>
    </div>
    <figcaption className="heatmap-legend"><span>Less</span>{[0, 1, 2, 3, 4].map(step => <i key={step} data-level={step} aria-hidden="true" />)}<span>More</span></figcaption>
  </figure>;
}
