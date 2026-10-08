import { useEffect, useId, useState } from "react";
import { availability } from "@/content";
import { bookableStarts, dateInZone, instantFor, minutesInZone, roundUp, upcomingDays } from "@/lib/availability";

const ZONE = availability.timeZone;
const STEP = 15;
const minutes = (time: string) => {
  const [hours = 0, mins = 0] = time.split(":").map(Number);
  return hours * 60 + mins;
};
const openWindows = availability.day.filter(block => block.open).map(block => ({ start: minutes(block.start), end: minutes(block.end) }));
const dayLabel = (date: string) => new Intl.DateTimeFormat("en-GB", { timeZone: ZONE, weekday: "short", day: "numeric", month: "short" }).format(instantFor(date, 720, ZONE));

export function FindATime() {
  const id = useId();
  const [now, setNow] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);
  const today = dateInZone(ZONE, now);
  const startsFor = (date: string) => bookableStarts(openWindows, availability.callMinutes, date === today ? roundUp(minutesInZone(ZONE, now) + 30, STEP) : -Infinity, STEP);
  const days = upcomingDays(now, ZONE, availability.workDays, 7).filter(day => startsFor(day).length).slice(0, 5);
  const date = days.includes(selectedDate) ? selectedDate : days[0];
  if (!date) return <div className="planner"><a href={availability.bookingUrl} target="_blank" rel="noreferrer">View availability ↗</a></div>;
  const starts = startsFor(date);
  const start = selectedTime !== null && starts.includes(selectedTime) ? selectedTime : starts[0]!;
  const visitorZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeLabel = (minute: number) => new Intl.DateTimeFormat(undefined, { timeZone: visitorZone, hour: "numeric", minute: "2-digit", ...(visitorZone !== ZONE ? { weekday: "short" as const } : {}) }).format(instantFor(date, minute, ZONE));

  return <div className="planner">
    <div className="planner-options">
      <label htmlFor={`${id}-day`}>Day<select id={`${id}-day`} value={date} onChange={event => { setSelectedDate(event.target.value); setSelectedTime(null); }}>{days.map(day => <option key={day} value={day}>{dayLabel(day)}</option>)}</select></label>
      <label htmlFor={`${id}-time`}>Your time<select id={`${id}-time`} value={start} onChange={event => setSelectedTime(Number(event.target.value))}>{starts.map(minute => <option key={minute} value={minute}>{timeLabel(minute)}</option>)}</select></label>
      <a className="contact-cta planner-book" href={`${availability.bookingUrl}?date=${date}&month=${date.slice(0, 7)}`} target="_blank" rel="noreferrer">Book call ↗</a>
    </div>
    <p className="planner-note">{availability.callMinutes} min · {visitorZone.replaceAll("_", " ")} · Confirm your slot on Cal.com</p>
  </div>;
}
