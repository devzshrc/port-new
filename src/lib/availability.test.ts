import { describe, expect, test } from "bun:test";
import { bookableStarts, instantFor, nearest, overlapSegments, upcomingDays, within, zoneOffsetMinutes } from "./availability";

const IST = "Asia/Kolkata";

describe("availability", () => {
  test("converts IST wall time to an instant", () => {
    expect(instantFor("2026-10-06", 15 * 60 + 30, IST).toISOString()).toBe("2026-10-06T10:00:00.000Z");
    expect(zoneOffsetMinutes(IST, new Date("2026-10-06T10:00:00Z"))).toBe(330);
  });

  test("handles DST on the visitor side", () => {
    expect(zoneOffsetMinutes("America/New_York", new Date("2026-07-01T12:00:00Z"))).toBe(-240);
    expect(zoneOffsetMinutes("America/New_York", new Date("2026-12-01T12:00:00Z"))).toBe(-300);
  });

  test("lists upcoming working days only", () => {
    // Saturday 3 Oct 2026, 12:00 IST
    const days = upcomingDays(new Date("2026-10-03T06:30:00Z"), IST, [1, 2, 3, 4, 5], 3);
    expect(days).toEqual(["2026-10-05", "2026-10-06", "2026-10-07"]);
  });

  test("maps a London 9 to 6 onto the IST axis", () => {
    // BST (UTC+1) is 4h30 behind IST: 09:00 London = 13:30 IST
    expect(overlapSegments("2026-10-06", { start: 480, end: 1440 }, IST, "Europe/London", { start: 540, end: 1080 }))
      .toEqual([{ start: 810, end: 1350 }]);
  });

  test("clips a New York day that runs past midnight IST", () => {
    // EDT 09:00 = 18:30 IST, axis ends at 24:00
    expect(overlapSegments("2026-10-06", { start: 480, end: 1440 }, IST, "America/New_York", { start: 540, end: 1080 }))
      .toEqual([{ start: 1110, end: 1440 }]);
  });

  test("lists bookable starts across open windows", () => {
    const open = [{ start: 780, end: 840 }, { start: 1140, end: 1290 }];
    expect(bookableStarts(open, 30)).toEqual([780, 795, 810, 1140, 1155, 1170, 1185, 1200, 1215, 1230, 1245, 1260]);
    expect(bookableStarts(open, 30, 1200)).toEqual([1200, 1215, 1230, 1245, 1260]);
    expect(bookableStarts(open, 30, 1300)).toEqual([]);
  });

  test("snaps to the nearest bookable start", () => {
    expect(nearest([780, 795, 810, 1140], 900)).toBe(810);
    expect(nearest([780, 795, 810, 1140], 1100)).toBe(1140);
    expect(nearest([], 900)).toBeNull();
    expect(within(810, 30, [{ start: 810, end: 1350 }])).toBe(true);
    expect(within(800, 30, [{ start: 810, end: 1350 }])).toBe(false);
  });
});
