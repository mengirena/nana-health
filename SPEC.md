# Kalos Trainer — Finalized App Spec

**Status: FINALIZED 2026-11-09.** Consolidates everything Irena walked
through: the 13 Kalos app screenshots of 2026-11-08 (schedule, progress,
journal, coach chat) and the full Prime P2 C workout-flow walkthrough of
2026-11-09 (9 screenshot batches: start flow, set logging, How-to pages,
History, rest timer, swap, pause/resume), plus the Thoracic Release
routine she added from Instagram. Companion detail file:
`docs/workout-flow.md` (the raw walkthrough notes this spec is built
from).

## 1. Purpose

A personal duplicate of the Kalos Health app for Irena's own use, so
that when her one-year Kalos membership ends she can keep training with
the same cadence, session structure, and logging behaviour on her own.
Built like her EngFlashcard app: a no-build-step static PWA in `docs/`,
hosted on GitHub Pages from her own GitHub repo, state on-device.

Non-goals: no accounts, no server, no social features, no real coach
messaging (the Coach tab is notes only), no copying of Kalos's own
video assets (demo videos are links/placeholders in our app).

## 2. Design language

- Dark theme matching Kalos: background #0b0b0f, cards #1c1c22, white
  text, green for completed/positive (✓, PB banners, deltas), red for
  missed/discard, blue links.
- Bottom tab bar: **Today · Schedule · Progress · Coach**.
- Mobile-first, iPhone-sized, installable PWA (manifest + service
  worker, versioned assets like the flashcard app).

## 3. Program model

- Programmes run in **phases** (Phase 1: Sep–Oct 2026; Phase 2: from
  ~2026-11-01). A phase has a weekly pattern and a set of workout
  templates; exercise history carries across phases.
- Weekly pattern (Phase 2) — corrected by Irena 2026-11-09 (her
  training days are usually Tue / Thu / Sat; the Sun Nov 8 Prime C in
  the screenshots was Saturday's session dragged to Sunday):
  - Tue — Prime A (main) + Static Stretches · Thu — Prime B (main) +
    Static Stretches · Sat — Prime C (main) + Static Stretches
  - Fri — Full Body HIIT I B (secondary, optional) · Sun / Mon / Wed —
    Rest
  - The A → B → C rotation aligns to Tue / Thu / Sat; because
    sessions drag between days (§4.2), any given week in Kalos can
    look shifted — the pattern is the anchor, drags are exceptions.
- Workout template anatomy (Prime sessions): Warm-up block (4 mobility
  exercises, 1 set each) → Main block (5 lifts, 3–4 sets) → Accessories
  (3 exercises, 2 sets) → Finishers (timed stretches, 30 s holds).
- Templates captured in full: Prime P2 C (16 exercises, 30 sets) and
  Static Stretches: Cool-Down (10 exercises, 21 sets) — see
  `docs/data/program.json`. Prime A and Prime B are AI-composed
  (§6, approved and loaded 2026-11-09) until Irena walks through
  Nicole's real lists and we diff them; HIIT B was AI-composed the
  same way at Irena's request (2026-11-09) and loaded too. Also
  noted: the Dumbbell Floor Press carries no weight in Kalos
  (Irena, 2026-11-09).
- Equipment reality: dumbbells + flat bench only. Standing swap:
  Incline Dumbbell Row → Prone Dumbbell Row (flat bench), same 3×10
  (decided 2026-11-08, note stored on the exercise).

## 4. Screens and flows

### 4.1 Today
- "Today's workouts": big PRIMARY card for the day's main session
  ("Tap to begin"), secondary sessions below it.
- Streak line (Kalos showed "5 week streak"), weekly counter
  ("0 of 2 this week" style), Personal Best link.
- Nutrition strip: meals-logged count + "Log food" (lightweight local
  count in v1; the real food log lives in the Food Intake Log /
  Google Sheet).
- If a workout is in progress: PRIMARY card shows an IN PROGRESS badge
  with "N of M sets completed", and a persistent bar pins above the
  tab bar (see 4.6).

### 4.2 Schedule
- Sessions grouped by week ("Nov 8 – Nov 14"), generated forward
  **14 days** from the weekly pattern by the curation layer (§6).
- Past days show ✓ (completed) / ✕ (missed) from the log — the ✕
  applies to secondary sessions too (Sun Nov 8's Static Stretches
  showed a red ✕); rest days shown dashed; today outlined. Plan Notes
  line appears whenever the curator adjusted something (§6).
- **Drag-and-drop rescheduling** (Kalos behaviour, walked through
  2026-11-09): every not-yet-completed session card carries a ≡ drag
  handle on its right side. Dragging a card onto another day moves
  that session there — she demonstrated dragging Sunday's missed
  Static Stretches onto Monday and back. A day emptied of sessions
  becomes a rest day; a day that receives a card loses its rest-day
  label; a missed session dragged to today or later is scheduled
  again. One main per day: dropping a main session onto a day that
  already has a different main swaps the two mains' days. Manual
  moves are stored as per-date overrides and applied on top of the
  curated plan (§6).

### 4.3 Workout overview (bottom sheet, before starting)
- Title + meta line: "Phase 2 | 16 Exercises | 30 sets".
- Coach note at the top (truncated, "More" to expand).
- Full exercise list: thumbnail, name, sets × reps.
- Pinned bottom button: "Start workout" (becomes "Resume workout"
  with a red discard beside it when a session is in progress, with a
  status line "In progress · 20 of 30 sets · 1:01:46").

### 4.4 In-workout — guided view and list view (one continuous scroll)
- Guided view: fullscreen demo video for the current exercise,
  progress dots across the top (one per exercise) + elapsed workout
  timer; the current exercise's card is a bottom sheet; pulling the
  sheet up scrolls into the next exercise's card — guided and list
  views are one scroll, not two screens.
- Set table per exercise: columns # / PREVIOUS / LB (weighted only) /
  REPS / DONE.
  - **Prefill rule (Irena's words, 2026-11-09): the numbers sitting in
    the LB and REPS boxes before you type anything are copied from
    the last time you did that exercise.** History is per exercise,
    not per workout.
  - REPS shows the prescribed range (e.g. 8–10) until the set is
    logged; then it becomes the actual reps done.
  - Tapping a value opens the app's own big numeric keypad (digits,
    decimal point, backspace); typing replaces the prefill from the
    first digit.
  - Editing a set's weight carries the new value down as the prefill
    for the sets below it.
  - Tapping ✓ turns the **whole set row green** and auto-advances to
    the next exercise.
  - **Unit is per exercise**: it follows however that exercise was
    last logged (the incline row was in KG while the rest of the day
    was in LB). Data model must store unit per exercise/entry.
  - Timed sets (stretches) show a play button starting the countdown
    (e.g. 0:30); notes like "Reps are per side" / "Time is per side"
    appear under the exercise name.
  - Some exercises carry a short coach cue under the name (shoulder
    press: "Keep this one light. Elbows slightly forward…").
  - Per-exercise actions: **Comment · Swap · Add set**, plus History
    and ⓘ (How to).
- "+ Add exercise" at the end of the list.
- Finish: "Swipe to finish workout" slider; "Discard workout" in red
  underneath.

### 4.5 How-to page (per exercise, via ⓘ)
- Exercise name, short bullet instructions, demo video embedded below
  with fullscreen-expand and playback-speed (1×) controls.
- Tapping the video goes truly fullscreen: slim bar with exercise name
  and a set counter ("0/1"). Some videos have a small
  picture-in-picture second-angle preview in the corner (tap to
  switch angle) — support an optional second video link per exercise.

### 4.6 Rest timer
- Logging a set auto-opens the Rest Timer sheet: "Current Exercise:
  …", big countdown, **−30s / +30s** adjusters, **Skip**, X to dismiss.
- Rest length is **per exercise** (front squat ~1:45, bent-over row
  1:30) — stored on the exercise.
- After dismissal, a small pill keeps the remaining rest visible.
- At zero: banner "🔔 Time for your next set!"
- If the logged set beats the exercise's personal best, the sheet also
  shows a green banner: "🏆 New personal best!"

### 4.7 Pause / resume
- Leaving mid-workout keeps the session alive: Today card gets the
  IN PROGRESS badge; a persistent bar above the tabs shows
  "Workout in progress · <elapsed>", pause ⏸ and discard 🗑 buttons,
  and a chevron to jump back in.
- Pause freezes the elapsed timer ("Paused · <elapsed>", ▶ resumes
  exactly where it left off, sets intact).
- Any swap made mid-session persists in the session's exercise list.

### 4.8 Swap / replace exercise
1. Tap **Swap** → "Alternative Exercises" sheet: coach-set alternatives
   first (may be empty: "Your coach hasn't set alternatives for this
   one"), then "Search all exercises".
2. "Replace <exercise>" screen: searchable library with thumbnails,
   live filtering by name as you type.
3. Picking a replacement keeps the **same slot and the same prescribed
   scheme** (e.g. 3 × 10) but pre-fills weight/reps from the
   replacement exercise's own last session.

### 4.9 Exercise History page (per exercise, via History button)
- **Estimated One-rep Max card**: current estimate big (front squat
  47 lb, "+20"), date range, line chart with one dot per session;
  tapping a dot shows a tooltip with the day's estimate and the set
  behind it (Oct 8: 49 lb, from 35.5 × 12).
- **Personal Best line** with trophy: weight × reps, its estimated
  1RM, and date.
- **History list**: one card per past session, newest first — date,
  parent workout (an exercise recurs across sessions/phases), per-set
  table SET / LB / REPS / est. 1RM; trophy icon on the PB set;
  "Load More" pages in older sessions.
- The in-progress session appears at the top, badged IN PROGRESS,
  updating live, trophy already showing on a PB set.
- Irena's own comments appear under the session they were written in
  (comments attach to exercise-within-session and resurface here).

### 4.10 Progress
- Body-composition cards (Kalos style): current value + delta —
  Body Fat %, Fat Mass, Visceral Fat, ALMI percentile, Lean Mass,
  Weight; plus BMD from DEXA scans. Seed data: her Sep 20 → Nov 6,
  2026 scans (full figures in `docs/data/program.json` and the Google
  Sheet "Food Intake & Kalos DEXA Tracking").
- Strength: pinned exercises with current weight and gain since start
  (Goblet Squat 35 lb +18; Romanian Deadlift 67 lb +33; Seated
  Shoulder Press 29 lb +4), fed by the per-exercise histories (§4.9).
- Sleep & steps cards (manual entry in v1; 7-day averages shown).

### 4.11 Coach
- Placeholder in v1: coach name (Nicole), her standing notes (e.g.
  bone density is judged on 3–6-month trends), session notes and
  per-exercise cues surface where they belong (§4.3, §4.4). No chat.

### 4.12 Food (added 2026-11-11, at Irena's request)
- Fifth tab (🍽️ Food). Read-only mirror of the Food Intake Log: one
  card per day with totals — calories, protein, calcium, fiber, fat,
  water, cholesterol — against the standing targets, plus the day's
  notes.
- Data lives in `docs/data/food-log.json`, synced from the Google
  Sheet "Food Intake & Kalos DEXA Tracking" (Daily Food Totals) each
  time a day closes; the Sheet remains the version of record.
- Cholesterol tracked from 2026-11-11 (Irena has high cholesterol).
  Reference: <300 mg/day general, <200 mg/day often advised with
  high cholesterol; no trainer-set target yet. Earlier days show
  "Cholesterol not tracked".
- Format update 2026-11-13 (Irena: follow the Kalos Health format):
  the tab is now a Kalos-style day view — a week strip (Sun–Sat,
  dots on logged days) over one selected day; meal entries newest
  first, each with photo thumbnail (or placeholder), name, time,
  kcal, and protein when known; the day totals vs targets sit in a
  "Day total" card below the entries. `food-log.json` days gained an
  `items` array (name, kcal, optional proteinG/time/photo); item
  kcal sums must equal the day total. Meal photos are 480px square
  thumbnails copied from Irena's chat uploads at sync time and
  embedded as base64 data URIs in `docs/data/food-photos.json`,
  keyed by the item's `photo` value — the GitHub snapshot push is
  text-only, so binary image files cannot be pushed directly.
  Days before 2026-11-10 mostly have no photos (placeholder tile).

## 5. Exercise library and custom additions

- Library entries: name, thumbnail/video links (optional 2nd angle),
  How-to bullets, default unit, rest seconds, coach alternatives.
- Custom addition (2026-11-09, from an Instagram reel by
  @matthew_stretching): **Thoracic Release** — a 5-minute thoracic &
  upper-back routine (secondary, unscheduled, sits in the library
  beside Static Stretches):
  1. Thoracic & shoulder release — kneeling alternating arm sweeps,
     10 per side
  2. Lat & pec minor stretch — child's-pose variation, hands clasped
     behind head, 10 reps
  3. Thoracic spine rotation — from the same position, elbow up,
     10 per side
  4. QL & adductor release — seated straddle alternating side bends,
     8 per side

## 6. Plan curation layer ("AI" layer)

- `docs/curate.js` is a separate module. `generatePlan()` turns the
  weekly pattern into a dated plan; `curatePlan()` adjusts it against
  the completion log. The Schedule always shows **today + the next
  14 days**, pre-scheduled.
- v1 rules (implemented):
  - A missed main session moves to the next rest day **only if** that
    creates no back-to-back main sessions; otherwise the miss is
    reported in Plan Notes, not forced.
  - Never two main sessions on adjacent days; at least one rest day
    between main sessions.
  - Every 4th week is flagged as a deload week.
- Manual moves (§4.2) sit above curation: a per-date session list
  saved by a drag overrides the curated result for that date, and
  curation never fights a user move.
- Known limitation (found in v1 testing): with mains fixed Tue/Thu/
  Sat, most rest days border a main session, so many missed sessions
  cannot legally move (a missed Tue can land on Mon and a missed Sat
  on Sun, but a missed Thu has no legal landing spot — Wed touches
  Tue, Fri touches Sat).
- AI-layer roadmap (the hook is marked in `curate.js`): rotation-shift
  rescheduling (shift the whole A/B/C sequence when a session is
  missed), weight-progression suggestions from History (e.g. all sets
  at the top of the rep range → suggest the next weight), and phase
  transitions. This is the part Irena asked to be AI-powered.
- **AI menu builder (Irena's direction, 2026-11-09)**: the AI should
  also compose the training menu itself, following the observed
  pattern — session anatomy (§3), the A/B/C rotation, an exercise
  pool drawn from her captured History, starting weights from her
  last logged performances, dumbbells + flat bench only, and her
  goals (fat loss + bone density → keep the heavy compound lifts
  loaded). Menus are proposed to Irena for approval, then loaded as
  templates. First proposal (AI-composed Prime A and Prime B +
  the Nov 10–22 schedule): `AI-MENU-PROPOSAL.md`, mirrored as a
  Google Doc in the "Kalos Trainer App" Drive folder. **Approved by
  Irena and loaded into the app 2026-11-09** (floor press carries no
  weight — Kalos lists none, her correction); the templates now
  await a diff against Nicole's real A / B lists when captured.

## 7. Data model (summary)

- `Program` → phases → weekly pattern + workout templates.
- `WorkoutTemplate` → blocks → exercises (name, sets, reps or time,
  per-side flags, coach cue, rest seconds).
- `Exercise` (library) → unit, rest seconds, how-to, video links,
  alternatives.
- `Session` (a dated instance) → exercise entries → `SetLog`
  (weight, unit, reps or seconds, done flag, timestamp).
- `Comment` → attached to exercise-within-session.
- `PersonalBest` / estimated 1RM → derived from SetLogs per exercise
  (Epley-style estimate, as Kalos presents it).
- Seed data: DEXA scans, strength pins, and the captured exercise
  histories (Front Squat, Shoulder Press, Romanian Deadlift,
  Bent-Over Row — full tables in `docs/workout-flow.md`), plus
  Irena's Nov 8 logged weights (Front Squat 30 lb, Shoulder Press
  20 lb, Hammer Curl 20 lb, Bent-Over Row PB 30 × 10).
- All runtime state in one localStorage key; seed in
  `docs/data/program.json` with an embedded fallback copy in app.js
  (regenerate the fallback whenever program.json changes — keep the
  two in sync).

## 8. Build status and gaps

- **v1 (built 2026-11-08, verified locally)**: Today, Schedule
  (14-day generation + curation v1 rules), Workout detail with set
  checkboxes and completion logging, Progress, Coach placeholder.
- **v1.2 (2026-11-09)**: set / rep / weight views in the workout
  screen — each exercise shows sets × reps plus its target weight
  (a structured `weightLb` in the data; the Dumbbell Floor Press has
  none), and every non-timed exercise gets the Kalos-style set table
  (# / LB / REPS / ✓) with LB prefilled from the target weight and
  typed values persisted per set. Still v2: prefill from the last
  session's actuals, the numeric keypad, and the rest timer.
- **v1.1 (2026-11-09)**: drag-and-drop schedule moves (§4.2)
  implemented and published ahead of the rest of v2 — ≡ handle drag
  between days, per-date overrides in state, main-for-main swap, and
  missed ✕ extended to secondary sessions.
- **Instruction videos (2026-11-09, at Irena's request)**: the guide
  view's media panel embeds a YouTube form tutorial per exercise
  (thumbnail facade → youtube-nocookie player on tap; also in the
  How-to sheet). 22 exercises covered — every lift plus the main
  mobility/stretch movements; every video ID was verified against
  YouTube's oEmbed endpoint before shipping. Known imperfect matches,
  flagged in the data: the Prone Row video demos the same
  chest-supported row on a slight incline (no verified flat-bench
  tutorial exists), and the Seated Pigeon video teaches the yoga
  variant rather than the floor figure-4. Kalos's own videos remain
  uncopied, per §1.
- **v2 guided workout (2026-11-09, built at Irena's direction)**:
  session card → overview with a pinned **Start workout** button →
  focus view that moves exercise to exercise: progress dots,
  elapsed timer, per-exercise instruction bullets (ⓘ How-to sheet;
  authored text cues — Kalos demo videos are not copied), the set
  table with editable LB/REPS, auto-advance when an exercise is
  completed, a 90-second rest timer (−30s / +30s / Skip, "Time for
  your next set!" at zero), pause/resume with a persistent
  in-progress bar above the tabs, and Finish/Discard. Still
  outstanding from the v2 list below: prefill from the last session's
  actual values, the big numeric keypad, PB detection + banner,
  per-exercise History pages, the swap flow, and swipe-to-finish.
- **v2 adds (from this finalized spec)**: guided in-workout view with
  continuous scroll, numeric keypad entry, prefill-from-last-time,
  weight carry-down, green-row logging with auto-advance, rest timer
  (per-exercise, ±30 s, skip, pill, banners), PB detection + banner,
  How-to pages, per-exercise History pages with 1RM chart, swap flow,
  pause/resume with persistent bar, per-exercise units, timed-set
  countdowns, comments, Thoracic Release in the library.
- **Still needed from Irena**: Prime A and Prime B exercise lists, the
  Friday HIIT B list, and two cut-off details from the P2 C list (the
  exercise at 10 lb / 8–10 reps, and the timed stretch just above
  Seated Pigeon).
- **Publishing**: DONE 2026-11-09 — repo
  https://github.com/mengirena/nana-health (public; name chosen by
  Irena: "Nana health"), v1 snapshot pushed to `main` with her
  approval (initial commit f1a893c). GitHub Pages enabled the same
  day (deploy from `main`, `/docs`) — live at
  https://mengirena.github.io/nana-health/
