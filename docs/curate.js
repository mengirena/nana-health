/*
 * curate.js — plan generation + curation for the Nana Health app.
 *
 * Two layers:
 *   1. generatePlan() expands the weekly pattern from data/program.json
 *      into dated day entries. This is the "prescheduling" step: the next
 *      two weeks of workouts exist on the calendar before the week starts.
 *   2. curatePlan() adjusts that generated plan against the completion log
 *      using the transparent rules below, and returns human-readable notes
 *      explaining every adjustment it made.
 *
 * ---------------------------------------------------------------------------
 * FUTURE AI HOOK
 * curatePlan(days, log, todayISO, program) is the seam where a real AI/LLM
 * curation call will replace (or sit on top of) the rule engine: it takes
 * the base plan + the log + context (sleep, steps, soreness, travel…) and
 * returns the same shape — { days, notes } — with a note per change.
 * The rule-based version below stays as the offline fallback and as the
 * safety net: whatever an AI proposes should still be checked against
 * rules (b) and (c) before it is shown as the plan.
 * ---------------------------------------------------------------------------
 *
 * RULES (v1, rule-based)
 *   (a) A main session missed in the last 7 days is moved to the next day
 *       (today or later) that has no main session and satisfies (b)/(c).
 *       The original slot becomes a rest day. A session is only moved if
 *       the same workout is not already scheduled before the target day
 *       (it "comes around again" in the rotation anyway).
 *       Note on density: with mains on Tue/Thu/Sat, most rest days
 *       border a main session, so many misses cannot be moved without
 *       breaking (b)/(c) — a missed Tuesday can land on Monday and a
 *       missed Saturday on Sunday, but a missed Thursday has no legal
 *       landing spot (Wednesday touches Tuesday, Friday touches
 *       Saturday). Unmovable misses are reported in the notes, never
 *       silently dropped and never forced in.
 *   (b) Never schedule two main sessions on adjacent days.
 *   (c) Keep at least one rest day between main sessions. (Same constraint
 *       as (b), phrased the way a coach would say it; both are enforced by
 *       canHostMain().)
 *   (d) Every 4th week of the phase is flagged as a deload-suggestion week.
 *       Flag only — the workouts themselves are not changed.
 *
 * Dates are plain local 'YYYY-MM-DD' strings everywhere; no Date objects
 * cross the API boundary, which keeps the logic testable in Node.
 */
(function (root) {
  'use strict';

  // ---------- date helpers (local time, ISO strings) ----------

  function parseISO(iso) {
    var p = String(iso).split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  function fmtISO(d) {
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function addDaysISO(iso, n) {
    var d = parseISO(iso);
    d.setDate(d.getDate() + n);
    return fmtISO(d);
  }

  function weekdayOf(iso) { return parseISO(iso).getDay(); } // 0 = Sunday

  function startOfWeekISO(iso) { return addDaysISO(iso, -weekdayOf(iso)); }

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var WDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function prettyDate(iso) {
    var d = parseISO(iso);
    return WDAYS[d.getDay()] + ' ' + MONTHS[d.getMonth()] + ' ' + d.getDate();
  }

  /** 1-based week number of `iso` within the phase that started on phaseStartISO. */
  function phaseWeekNumber(phaseStartISO, iso) {
    var a = parseISO(startOfWeekISO(phaseStartISO)).getTime();
    var b = parseISO(startOfWeekISO(iso)).getTime();
    return Math.round((b - a) / (7 * 24 * 60 * 60 * 1000)) + 1;
  }

  // ---------- layer 1: preschedule ----------

  /**
   * Expand the weekly pattern into `numDays` dated entries starting at
   * startISO. Day entry:
   *   { date, weekday, main: workoutId|null, secondary: [workoutId],
   *     movedFrom: null|ISO, deload: bool }
   */
  function generatePlan(program, startISO, numDays) {
    var days = [];
    for (var i = 0; i < numDays; i++) {
      var iso = addDaysISO(startISO, i);
      var wd = weekdayOf(iso);
      var slot = program.weeklyPattern[String(wd)] || { main: null, secondary: [] };
      days.push({
        date: iso,
        weekday: wd,
        main: slot.main || null,
        secondary: (slot.secondary || []).slice(),
        movedFrom: null,
        deload: false
      });
    }
    return days;
  }

  // ---------- layer 2: curation rules ----------

  function isDone(log, dateISO, workoutId) {
    return !!(log && log[dateISO] && log[dateISO][workoutId] && log[dateISO][workoutId].done);
  }

  /** Rules (b)+(c): day i may host a main session only if it has none and
   *  neither neighbour has one. */
  function canHostMain(days, i) {
    if (days[i].main) return false;
    if (i > 0 && days[i - 1].main) return false;
    if (i < days.length - 1 && days[i + 1].main) return false;
    return true;
  }

  function shortName(program, workoutId) {
    var w = program.workouts[workoutId];
    return (w && (w.shortName || w.name)) || workoutId;
  }

  /**
   * Adjust a generated plan against the completion log.
   * Returns { days, notes } where notes = [{ date, text }] — one entry per
   * adjustment, dated where the adjustment lands, ready to render.
   * The input array is not mutated; a curated copy is returned.
   */
  function curatePlan(daysIn, log, todayISO, program) {
    var days = daysIn.map(function (d) {
      return {
        date: d.date, weekday: d.weekday, main: d.main,
        secondary: d.secondary.slice(), movedFrom: d.movedFrom || null,
        deload: false
      };
    });
    var notes = [];
    var todayIdx = -1;
    var i, j;

    for (i = 0; i < days.length; i++) {
      if (days[i].date === todayISO) todayIdx = i;
      // Rule (d): deload flag for every 4th phase week.
      var wk = phaseWeekNumber(program.phaseStart, days[i].date);
      if (wk > 0 && wk % 4 === 0) {
        days[i].deload = true;
        if (days[i].weekday === 0) {
          notes.push({
            date: days[i].date,
            text: 'Deload week suggested (week ' + wk + ' of ' + program.phase +
                  ') — same workouts, consider lighter weights.'
          });
        }
      }
    }
    if (todayIdx < 0) return { days: days, notes: notes };

    // Rule (a): move recently missed main sessions forward.
    var windowStart = addDaysISO(todayISO, -7);
    for (i = 0; i < todayIdx; i++) {
      var d = days[i];
      if (!d.main || d.date < windowStart) continue;
      if (isDone(log, d.date, d.main)) continue;

      var missedId = d.main;
      // Vacate the missed slot BEFORE searching: the day after a miss is
      // only "adjacent to a main session" because of the missed session
      // itself (e.g. Thu missed -> Fri is a legal landing spot once Thu
      // is emptied). If no legal target exists the slot is restored below.
      d.main = null;
      var target = -1;
      for (j = todayIdx; j < days.length; j++) {
        if (!canHostMain(days, j)) continue;
        // Don't duplicate: if this workout is already scheduled as a main
        // session between today and the candidate day, it comes around
        // again on its own — leave the miss as a miss.
        var dup = false;
        for (var k = todayIdx; k < j; k++) {
          if (days[k].main === missedId) { dup = true; break; }
        }
        if (!dup) { target = j; break; }
      }

      if (target >= 0) {
        days[target].main = missedId;
        days[target].movedFrom = d.date;
        notes.push({
          date: days[target].date,
          text: shortName(program, missedId) + ' moved from ' + prettyDate(days[target].movedFrom) +
                ' — you missed it; now on ' + prettyDate(days[target].date) + '.'
        });
      } else {
        d.main = missedId; // restore — the miss stands, and is reported
      }
      if (target < 0) {
        notes.push({
          date: d.date,
          text: shortName(program, missedId) + ' missed on ' + prettyDate(d.date) +
                ' — no open slot to move it to in the next two weeks.'
        });
      }
    }

    return { days: days, notes: notes };
  }

  /**
   * Streak definition (kept simple and honest): the number of consecutive
   * scheduled main sessions, counting backwards from the most recent one
   * that is due, that were completed. "Due" means dated before today, or
   * dated today and already completed — today's unfinished session does
   * not break a streak, but any earlier missed session does.
   * Pass a long window of curated days (the app generates ~10 weeks).
   */
  function computeStreak(days, log, todayISO) {
    var due = [];
    for (var i = 0; i < days.length; i++) {
      var d = days[i];
      if (!d.main) continue;
      if (d.date < todayISO || (d.date === todayISO && isDone(log, d.date, d.main))) {
        due.push(d);
      }
    }
    var streak = 0;
    for (var j = due.length - 1; j >= 0; j--) {
      if (isDone(log, due[j].date, due[j].main)) streak++;
      else break;
    }
    return streak;
  }

  var api = {
    parseISO: parseISO, fmtISO: fmtISO, addDaysISO: addDaysISO,
    weekdayOf: weekdayOf, startOfWeekISO: startOfWeekISO,
    prettyDate: prettyDate, phaseWeekNumber: phaseWeekNumber,
    generatePlan: generatePlan, curatePlan: curatePlan,
    computeStreak: computeStreak, isDone: isDone
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.KalosCurate = api;
})(typeof window !== 'undefined' ? window : globalThis);
