# Nana Health

A personal, single-user training web app modeled on the Kalos Health app
Irena uses — same shape as her flashcard app: a no-build-step static PWA
in `docs/`, served by GitHub Pages, all state in `localStorage`.

**Status: v1, published 2026-11-09** — repo:
https://github.com/mengirena/nana-health · live app:
https://mengirena.github.io/nana-health/

## What it does

- **Today** — today's scheduled session (or a dashed Rest day card), any
  secondary workout, a streak counter, a meals-logged nutrition strip
  (count kept locally), and any plan notes for today.
- **Schedule** — a rolling schedule generated from the weekly pattern:
  the current week from its Sunday, plus 14 days forward, grouped by week
  ("Nov 8 – Nov 14") the way the Kalos app groups it. Past days show ✓
  (completed) or ✕ (missed main session) from the local log.
- **Workout detail** — tap any session: exercises grouped by block
  (Warm-up / Main / Accessories / Finishers) with sets × reps and a
  checkbox per set. "Complete workout" writes to the local log.
- **Progress** — body-composition cards (current value + delta since
  baseline, color-coded by whether the direction is good), pinned
  strength exercises, and sleep & steps cards with manual entry.
- **Coach** — v1 placeholder: coach name (Nicole) and coaching notes.

## The pattern (prescheduling)

`docs/data/program.json` holds the program: a `weeklyPattern` mapping
weekday → main session + secondary sessions, and full workout
definitions. The app expands it into dated days automatically — the next
two weeks are always prescheduled, no manual entry.

Phase 2 pattern (from Irena's Kalos screenshots, 2026-11-08):

| Day | Main | Secondary |
|---|---|---|
| Sun | rest | — |
| Mon | rest | — |
| Tue | Prime A | Static Stretches |
| Wed | rest | — |
| Thu | Prime B | Static Stretches |
| Fri | — | Full Body HIIT I B (optional) |
| Sat | Prime C | Static Stretches |

(Corrected 2026-11-09 by Irena: her training days are usually Tue /
Thu / Sat. The Sun Nov 8 Prime C in her Kalos screenshots was
Saturday's session dragged to Sunday — Kalos weeks can look shifted
because sessions drag between days.)

Prime C and Static Stretches are transcribed in full (16 exercises /
30 sets, and 10 exercises / 21 sets). Prime A, Prime B and HIIT B are
structured placeholders — see "Data still needed".

Equipment swaps: Irena has a flat bench only, so Prime C's Incline
Dumbbell Row is swapped to Prone Dumbbell Row (flat bench), same 3×10
(swapped 2026-11-08; the swap note lives on the exercise in the data).

## Plan curation (the "AI" layer, v1 = rules)

`docs/curate.js` is a separate, dependency-free module with two layers:
`generatePlan()` (pattern → dated plan) and `curatePlan()` (plan + log →
adjusted plan + plain-language notes). Rules:

- **(a)** A main session missed in the last 7 days is moved to the next
  day that has no main session and satisfies (b)/(c); the original slot
  becomes a rest day, and a "Plan notes" line explains the move. If no
  legal slot exists, the miss is reported rather than forced.
- **(b)** Never two main sessions on adjacent days.
- **(c)** At least one rest day between main sessions.
- **(d)** Every 4th week of the phase is flagged as a deload-suggestion
  week (flag only).

Because the Tue/Thu/Sat pattern is dense, most rest days border a main
session — a Tuesday miss can move to Monday and a Saturday miss to
Sunday, but a Thursday miss has no legal landing spot. The header comment in `curate.js` marks exactly
where a future LLM curation call will replace/augment these rules (same
input/output shape, with the rules kept as safety checks).

**Streak definition:** consecutive scheduled main sessions, counting
backwards from the most recent due one, that were completed. Today's
not-yet-done session doesn't break a streak; an earlier miss does.

## State

One `localStorage` key (`kalosTrainerStateV1`): completion log, per-set
checkboxes, daily meal counts, sleep/steps entries. Seed data loads from
`docs/data/program.json` via `fetch`; if that fails (e.g. `file://`), an
embedded fallback copy in `app.js` is used (injected from program.json —
regenerate it if the JSON changes by hand).

## Run locally

```sh
cd docs && python3 -m http.server 8765
# open http://localhost:8765
```

## Publishing (later, with Irena's approval)

Create a GitHub repo (e.g. `mengirena/kalos-trainer`), push this folder
with `docs/` at the repo root, enable GitHub Pages from `docs/` — the
same setup as the flashcard app. Bump the `?v=` query strings and the
`CACHE` name in `sw.js` on each release, like the flashcard app does.

## Data still needed

- **Prime A exercise list** (blocks, sets × reps) — placeholder in v1.
- **Prime B exercise list** — placeholder in v1.
- **Full Body HIIT I B exercise list** — name/secondary flag only in v1.
- Future DEXA scans: append to `progressSeed.scans` in
  `docs/data/program.json` (cards always compare latest vs baseline).
