import { useMemo, useState } from "react";

export type HeatmapDatum = { date: string; value: number };
type Props = { title: string; data: HeatmapDatum[]; axisLabels?: boolean; yearSelector?: boolean; onYearChange?: (year: number) => void };

const dayMs = 86_400_000;
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekdays = ["", "Mon", "", "Wed", "", "Fri", ""];
const levels = [0, 1, 2, 3, 4];

export function HeatmapCalendar({ title, data, axisLabels = false, yearSelector = false, onYearChange }: Props) {
  const years = useMemo(() => [...new Set(data.map(datum => Number(datum.date.slice(0, 4))))].sort((a, b) => b - a), [data]);
  const [selected, setSelected] = useState<number | null>(null);
  const year = selected !== null && years.includes(selected) ? selected : years[0] ?? new Date().getUTCFullYear();

  const values = useMemo(() => new Map(data.map(datum => [datum.date, datum.value])), [data]);
  const max = useMemo(() => Math.max(0, ...data.map(datum => datum.value)), [data]);
  const level = (value: number) => (value <= 0 || max <= 0 ? 0 : Math.min(4, Math.ceil((value / max) * 4)));

  const cells = useMemo(() => {
    const start = Date.UTC(year, 0, 1);
    const end = Date.UTC(year, 11, 31);
    const offset = new Date(start).getUTCDay();
    const result: { date: string; col: number; row: number; month: number }[] = [];
    for (let time = start; time <= end; time += dayMs) {
      const day = new Date(time);
      const index = Math.round((time - start) / dayMs) + offset;
      result.push({ date: day.toISOString().slice(0, 10), col: Math.floor(index / 7), row: day.getUTCDay(), month: day.getUTCMonth() });
    }
    return result;
  }, [year]);

  const weeks = cells.length ? cells[cells.length - 1]!.col + 1 : 0;
  const monthStarts = cells.filter(cell => cell.date.endsWith("-01"));

  const choose = (next: number) => {
    setSelected(next);
    onYearChange?.(next);
  };

  return <figure className="heatmap-calendar">
    <div className="heatmap-head">
      <p className="heatmap-title">{title}</p>
      {yearSelector && years.length > 1 && <div className="heatmap-years" role="group" aria-label="Year">
        {years.map(option => <button key={option} type="button" aria-pressed={option === year} onClick={() => choose(option)}>{option}</button>)}
      </div>}
    </div>
    <div className="heatmap-scroll">
      <div key={year} className="heatmap-grid" role="img" aria-label={`${title} for ${year}`} style={{ gridTemplateColumns: `32px repeat(${weeks}, 8px)` }}>
        {axisLabels && monthStarts.map(cell => <span key={cell.date} className="heatmap-month" style={{ gridColumn: cell.col + 2, gridRow: 1 }}>{months[cell.month]}</span>)}
        {axisLabels && weekdays.map((label, row) => label && <span key={label} className="heatmap-weekday" style={{ gridColumn: 1, gridRow: row + 2 }}>{label}</span>)}
        {cells.map(cell => <span key={cell.date} className="heatmap-cell" data-level={level(values.get(cell.date) ?? 0)} title={cell.date} style={{ gridColumn: cell.col + 2, gridRow: cell.row + 2 }} />)}
      </div>
    </div>
    <figcaption className="heatmap-legend">
      <span>Less</span>
      {levels.map(step => <i key={step} data-level={step} />)}
      <span>More</span>
    </figcaption>
  </figure>;
}
