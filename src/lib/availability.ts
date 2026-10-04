export type Window = { start: number; end: number };

const parts = (timeZone: string, at: Date) => {
  const values = new Intl.DateTimeFormat("en-US", {
    timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  }).formatToParts(at);
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(values.find(part => part.type === type)?.value ?? 0);
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour"), minute: get("minute") };
};

/** Minutes the zone is ahead of UTC at a given instant (IST is 330). */
export function zoneOffsetMinutes(timeZone: string, at: Date) {
  const p = parts(timeZone, at);
  return Math.round((Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - Math.floor(at.getTime() / 60000) * 60000) / 60000);
}

/** Calendar date (YYYY-MM-DD) of an instant in a zone. */
export function dateInZone(timeZone: string, at: Date) {
  const p = parts(timeZone, at);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

export function minutesInZone(timeZone: string, at: Date) {
  const p = parts(timeZone, at);
  return p.hour * 60 + p.minute;
}

/** The instant that is `minutes` past midnight on `date` in `timeZone`. */
export function instantFor(date: string, minutes: number, timeZone: string) {
  const [year = 0, month = 1, day = 1] = date.split("-").map(Number);
  const guess = Date.UTC(year, month - 1, day) + minutes * 60000;
  return new Date(guess - zoneOffsetMinutes(timeZone, new Date(guess)) * 60000);
}

/** Weekday (0 = Sunday) of a YYYY-MM-DD date. */
export function weekday(date: string) {
  const [year = 0, month = 1, day = 1] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/** The next `count` working days in `timeZone`, starting today. */
export function upcomingDays(now: Date, timeZone: string, workDays: number[], count: number) {
  const days: string[] = [];
  for (let offset = 0; days.length < count && offset < 21; offset++) {
    const date = dateInZone(timeZone, new Date(now.getTime() + offset * 86_400_000));
    if (!days.includes(date) && workDays.includes(weekday(date))) days.push(date);
  }
  return days;
}

/**
 * Stretches of the `from`-zone axis on `date` during which the clock in `to`
 * reads inside `window`. Used to draw the visitor's working hours on the IST axis.
 */
export function overlapSegments(date: string, axis: Window, fromZone: string, toZone: string, window: Window, step = 15): Window[] {
  const segments: Window[] = [];
  for (let minute = axis.start; minute < axis.end; minute += step) {
    const local = minutesInZone(toZone, instantFor(date, minute, fromZone));
    if (local < window.start || local >= window.end) continue;
    const last = segments.at(-1);
    if (last && last.end === minute) last.end = minute + step;
    else segments.push({ start: minute, end: minute + step });
  }
  return segments;
}

/** Every call start (on a `step` grid) that fits inside one of `windows` and is not before `earliest`. */
export function bookableStarts(windows: Window[], duration: number, earliest = -Infinity, step = 15) {
  const starts = new Set<number>();
  for (const window of windows) {
    for (let start = Math.ceil(window.start / step) * step; start + duration <= window.end; start += step) {
      if (start >= earliest) starts.add(start);
    }
  }
  return [...starts].sort((a, b) => a - b);
}

export function nearest(values: number[], target: number) {
  return values.reduce<number | null>((best, value) => (best === null || Math.abs(value - target) < Math.abs(best - target) ? value : best), null);
}

export const within = (start: number, duration: number, windows: Window[]) =>
  windows.some(window => start >= window.start && start + duration <= window.end);

export const roundUp = (minutes: number, step: number) => Math.ceil(minutes / step) * step;
