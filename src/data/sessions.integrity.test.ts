import { describe, it, expect } from "vitest";
import { parse } from "date-fns";
import {
  ALL_SESSIONS,
  AVAILABLE_MONTHS,
  SESSION_PLANS,
  SESSION_TYPES,
  type SessionType,
} from "./sessions";

/**
 * Data-integrity guard. This test runs as a `prebuild` step, so a broken
 * calendar can never be deployed. Its whole job is to make sure a month —
 * or a month's sessions — can never silently disappear again.
 *
 * BASELINE_MONTHS is a floor, not a ceiling: it may only ever GROW.
 * When you add a new month, append it to AVAILABLE_MONTHS *and* to this list.
 * If a rebuild or a bad edit drops one of these months, the build fails.
 */
const BASELINE_MONTHS = [
  "February 2026",
  "March 2026",
  "April 2026",
  "May 2026",
  "June 2026",
  "July 2026",
  "August 2026",
  "September 2026",
] as const;

/**
 * Sessions that are intentionally on the calendar without a plan yet.
 * Anything NOT on this list must have a plan — otherwise the build fails,
 * so a session can never quietly become un-openable.
 */
const PENDING_PLANS = new Set<string>([
  "Ganesh Chaturthi Special", // plan not ready yet
  "Push it Pull It", // May session — never had a plan in either source copy
  "Rip & Stick", // May session — never had a plan in either source copy
]);

// Minimum sessions a month must have — catches an array that got emptied.
const MIN_SESSIONS_PER_MONTH = 10;

describe("calendar data integrity", () => {
  it("keeps every baseline month (months may be added, never dropped)", () => {
    for (const month of BASELINE_MONTHS) {
      expect(
        AVAILABLE_MONTHS,
        `"${month}" disappeared from AVAILABLE_MONTHS — a month must never be removed`
      ).toContain(month);
    }
    expect(AVAILABLE_MONTHS.length).toBeGreaterThanOrEqual(BASELINE_MONTHS.length);
  });

  it("has no duplicate months", () => {
    expect(new Set(AVAILABLE_MONTHS).size).toBe(AVAILABLE_MONTHS.length);
  });

  it("keeps AVAILABLE_MONTHS and ALL_SESSIONS in lock-step", () => {
    for (const month of AVAILABLE_MONTHS) {
      expect(ALL_SESSIONS[month], `"${month}" is listed but has no sessions array`).toBeDefined();
    }
    for (const month of Object.keys(ALL_SESSIONS)) {
      expect(AVAILABLE_MONTHS, `"${month}" has sessions but is missing from AVAILABLE_MONTHS`).toContain(month);
    }
  });

  it("gives every month a non-trivial number of sessions", () => {
    for (const month of AVAILABLE_MONTHS) {
      const sessions = ALL_SESSIONS[month] ?? [];
      expect(
        sessions.length,
        `"${month}" only has ${sessions.length} sessions — did an array get emptied?`
      ).toBeGreaterThanOrEqual(MIN_SESSIONS_PER_MONTH);
    }
  });

  it("lists months in chronological order", () => {
    const times = AVAILABLE_MONTHS.map((m) => parse(m, "MMMM yyyy", new Date()).getTime());
    const sorted = [...times].sort((a, b) => a - b);
    expect(times).toEqual(sorted);
  });

  it("gives every session a unique id and a valid type", () => {
    const seen = new Set<string>();
    for (const [month, sessions] of Object.entries(ALL_SESSIONS)) {
      for (const s of sessions) {
        expect(seen.has(s.id), `duplicate session id "${s.id}" (in ${month})`).toBe(false);
        seen.add(s.id);
        expect(
          Object.keys(SESSION_TYPES),
          `session "${s.name}" has unknown type "${s.type}"`
        ).toContain(s.type as SessionType);
      }
    }
  });

  it("makes every session openable — a plan, or explicitly pending", () => {
    const offenders: string[] = [];
    for (const sessions of Object.values(ALL_SESSIONS)) {
      for (const s of sessions) {
        if (!SESSION_PLANS[s.name] && !PENDING_PLANS.has(s.name)) {
          offenders.push(s.name);
        }
      }
    }
    expect(
      [...new Set(offenders)],
      "these sessions have no plan and are not on the PENDING_PLANS allowlist"
    ).toEqual([]);
  });
});
