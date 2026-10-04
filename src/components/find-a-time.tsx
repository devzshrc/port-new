import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { availability } from "@/content";
import { bookableStarts, dateInZone, instantFor, minutesInZone, nearest, overlapSegments, roundUp, upcomingDays, within, zoneOffsetMinutes, type Window } from "@/lib/availability";

const ZONE = availability.timeZone;
const AXIS: Window = { start: 8 * 60, end: 24 * 60 };
const SPAN = AXIS.end - AXIS.start;
const STEP = 15;
const CALL = availability.callMinutes;
const VISITOR_DAY: Window = { start: 9 * 60, end: 18 * 60 };
const TICKS = [10, 12, 14, 16, 18, 20, 22];

const toMinutes = (time: string) => {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return hours * 60 + minutes;
};
const clock = (minutes: number) => `${String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
const percent = (minutes: number) => `${((minutes - AXIS.start) / SPAN) * 100}%`;

const BLOCKS = availability.day.map(block => ({ ...block, open: Boolean(block.open), start: toMinutes(block.start), end: toMinutes(block.end) }));
const OPEN: Window[] = BLOCKS.filter(block => block.open);
const activityAt = (minute: number) => BLOCKS.find(block => minute >= block.start && minute < block.end);

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);
  return now;
}

const format = (at: Date, timeZone: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(undefined, { timeZone, ...options }).format(at);
const localTime = (at: Date, timeZone: string) => format(at, timeZone, { hour: "numeric", minute: "2-digit" });
const dayName = (date: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { timeZone: ZONE, ...options }).format(instantFor(date, 12 * 60, ZONE));

export function FindATime() {
  const now = useNow();
  const reduceMotion = useReducedMotion();
  const visitorZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const sameZone = zoneOffsetMinutes(visitorZone, now) === zoneOffsetMinutes(ZONE, now);
  const today = dateInZone(ZONE, now);
  const nowMinutes = minutesInZone(ZONE, now);

  const startsFor = (date: string) => bookableStarts(OPEN, CALL, date === today ? roundUp(nowMinutes + 30, STEP) : -Infinity, STEP);
  const visitorFor = (date: string) => overlapSegments(date, AXIS, ZONE, visitorZone, VISITOR_DAY, STEP);
  const suggestedFor = (date: string) => {
    const starts = startsFor(date);
    return starts.find(start => within(start, CALL, visitorFor(date))) ?? starts[0]!;
  };

  const days = useMemo(
    () => upcomingDays(now, ZONE, availability.workDays, 7).filter(date => startsFor(date).length > 0).slice(0, 5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [today, visitorZone],
  );
  const [date, setDate] = useState(days[0]!);
  const [start, setStart] = useState(() => suggestedFor(days[0]!));
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const tracks = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);

  const starts = startsFor(date);
  const visitor = visitorFor(date);
  const valid = starts.includes(start);
  const activity = activityAt(start);
  const startsAt = instantFor(date, start, ZONE);
  const theirTime = localTime(startsAt, visitorZone);
  const theirDay = format(startsAt, visitorZone, { weekday: "short" });
  const insideTheirDay = within(start, CALL, visitor);

  const pick = (day: string) => {
    setDate(day);
    setStart(suggestedFor(day));
  };

  const fromPointer = (event: PointerEvent) => {
    const rect = tracks.current!.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const minute = Math.round((AXIS.start + ratio * SPAN - CALL / 2) / STEP) * STEP;
    return Math.min(AXIS.end - CALL, Math.max(AXIS.start, minute));
  };
  const settle = (minute: number) => setStart(starts.includes(minute) ? minute : nearest(starts, minute) ?? minute);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    handle.current?.focus({ preventScroll: true });
    setDragging(true);
    setHover(null);
    setStart(fromPointer(event));
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging) setStart(fromPointer(event));
    else if (event.pointerType === "mouse") setHover(fromPointer(event));
  };
  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    settle(start);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const next =
      event.key === "ArrowRight" || event.key === "ArrowUp" ? starts.find(minute => minute > start)
      : event.key === "ArrowLeft" || event.key === "ArrowDown" ? starts.findLast(minute => minute < start)
      : event.key === "Home" ? starts[0]
      : event.key === "End" ? starts.at(-1)
      : undefined;
    if (next === undefined) return;
    event.preventDefault();
    setStart(next);
  };

  const spring = reduceMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 520, damping: 42, mass: 0.6 };
  const fade = reduceMotion ? { duration: 0 } : { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] as const };
  const detail = !valid
    ? `${activity?.title ?? "Nothing scheduled"} · not open for calls`
    : sameZone
      ? activity?.title ?? "Open"
      : `${theirTime} ${theirDay !== dayName(date, { weekday: "short" }) ? `${theirDay} ` : ""}your time${insideTheirDay ? "" : ", outside 9 to 6"}`;

  return (
    <div className="planner" data-dragging={dragging || undefined}>
      <LayoutGroup id="planner-days">
        <div className="planner-days" role="group" aria-label="Day">
          {days.map(day => (
            <button key={day} type="button" className="planner-day" aria-pressed={day === date} onClick={() => pick(day)}>
              {day === date && <motion.span layoutId="planner-day" className="planner-day-bg" transition={spring} />}
              <span className="planner-day-label">{day === today ? "Today" : dayName(day, { weekday: "short", day: "numeric" })}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      <div className="planner-grid">
        <div className="planner-who">
          <span>{availability.city}</span>
          <time>{clock(nowMinutes)}</time>
        </div>
        <div className="planner-who">
          <span>You</span>
          <time>{sameZone ? "Same time" : localTime(now, visitorZone)}</time>
        </div>

        <div
          ref={tracks}
          className="planner-tracks"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={() => setHover(null)}
        >
          <div className="planner-track">
            {BLOCKS.map(block => (
              <span key={block.start} className="planner-block" data-open={block.open || undefined} style={{ left: percent(block.start), width: `${((block.end - block.start) / SPAN) * 100}%` }}>{block.title}</span>
            ))}
          </div>
          <div className="planner-track">
            {visitor.map(segment => (
              <motion.span key={segment.start} className="planner-block" data-you initial={false} animate={{ left: percent(segment.start), width: `${((segment.end - segment.start) / SPAN) * 100}%` }} transition={spring}>Your 9 to 6</motion.span>
            ))}
          </div>

          {date === today && <span className="planner-past" style={{ width: percent(Math.max(AXIS.start, nowMinutes)) }} aria-hidden="true" />}

          <AnimatePresence>
            {hover !== null && !dragging && (
              <motion.span
                className="planner-hover"
                style={{ left: percent(hover + CALL / 2) }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fade}
                aria-hidden="true"
              >
                <span className="planner-hover-label" data-edge={hover < AXIS.start + 90 ? "start" : hover > AXIS.end - 120 ? "end" : undefined}>
                  {clock(hover + CALL / 2 - ((hover + CALL / 2) % STEP))} · {activityAt(hover + CALL / 2)?.title ?? "Free"}
                </span>
              </motion.span>
            )}
          </AnimatePresence>

          <motion.div
            ref={handle}
            className="planner-handle"
            data-valid={valid || undefined}
            role="slider"
            tabIndex={0}
            aria-label="Call time"
            aria-valuemin={starts[0]}
            aria-valuemax={starts.at(-1)}
            aria-valuenow={start}
            aria-valuetext={`${clock(start)} IST${sameZone ? "" : `, ${theirTime} your time`}${valid ? "" : ", not available"}`}
            onKeyDown={onKeyDown}
            initial={false}
            animate={{ left: percent(start), scale: dragging ? 1.04 : 1 }}
            transition={spring}
            style={{ width: `${(CALL / SPAN) * 100}%` }}
          >
            <span className="planner-handle-label">{clock(start)}</span>
          </motion.div>
        </div>

        <div className="planner-axis" aria-hidden="true">
          {TICKS.map(hour => <span key={hour} style={{ left: percent(hour * 60) }}>{clock(hour * 60)}</span>)}
        </div>
      </div>

      <div className="planner-footer">
        <div className="planner-summary" aria-live="polite">
          <p className="planner-when">
            {dayName(date, { weekday: "short", day: "numeric", month: "short" })} · {clock(start)}–{clock(start + CALL)} <span>IST</span>
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={detail}
              className="planner-detail"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={fade}
            >
              {detail}
            </motion.p>
          </AnimatePresence>
        </div>
        <a
          className="contact-cta planner-book"
          href={`${availability.bookingUrl}?date=${date}&month=${date.slice(0, 7)}`}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!valid || undefined}
          tabIndex={valid ? undefined : -1}
        >
          Book call <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
