import { useEffect, useState } from "react";
import { identity } from "../content";
import { scheduleAt } from "../lib/availability";

const { timeZone } = identity.availability;
const openingFormat = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short", hour: "numeric", minute: "2-digit" });

/** A quiet status line: whether the owner is inside working hours, and when they're back if not. */
export function AvailabilityStatus() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const status = scheduleAt(now, identity.availability);
  const label = status.open
    ? "Available now"
    : status.next
      ? `Back ${openingFormat.format(status.next)} IST`
      : "Currently unavailable";

  return <p className="availability" data-open={status.open}>
    <span className="availability-dot" aria-hidden="true" />
    {label}
  </p>;
}
