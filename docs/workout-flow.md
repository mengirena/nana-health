# Kalos workout flow — as walked through by Irena, 2026-11-09

Source: 9 screenshots from her Kalos app, taken Sun Nov 8, 2026 ~12:33 PM,
during the Prime | P2 | C (Full Body – Dumbbells Only) session.
This is the spec for the trainer app's Workout screen.

## The flow

1. **Today screen (home)**
   - "Today's workouts" — a big PRIMARY card for the day's main session
     ("Tap to begin"), plus any secondary workout below it
     (e.g. "Static Stretches: Cool-…" as a secondary).
   - Streak line ("5 week streak"), "0 of 2 this week" counter,
     "Personal best" link.
   - Nutrition section: "No meals logged" / "+ Log food".
   - Bottom tabs: Today · Nicole (coach) · Progress, plus a big + button.

2. **Workout overview (bottom sheet, before starting)**
   - Title + meta: "Phase 2 | 16 Exercises | 30 sets".
   - Short coach note from Nicole at the top (truncated, "More" to expand).
   - Full exercise list, each with thumbnail, name, and sets × reps.
   - Big "Start workout" button pinned at the bottom.

3. **In-workout — guided view (one exercise at a time)**
   - Fullscreen demo video for the current exercise.
   - Progress dots across the top + elapsed workout timer.
   - Bottom sheet for the current exercise: History button, and a set table
     with columns # / PREVIOUS / (LB when weighted) / REPS / DONE.
   - Reps and weight come pre-filled from the previous session;
     tap the checkmark to mark a set done.
   - Per-exercise actions: Comment · Swap · Add set.
   - Logging detail (second screenshot batch, 2026-11-09):
     - Tapping a value (e.g. REPS) opens the app's own big numeric keypad
       (digits, decimal point, backspace, keyboard-toggle icon); the field
       being edited is shown boxed and highlighted.
     - Marking a set done turns the **whole set row green** with a green
       checkmark, not just the ✓.
     - The view then auto-advances to the next exercise; the progress dots
       at the top track which exercise you're on (one dot per exercise).
     - An ⓘ icon beside the exercise name presumably opens instructions.
   - Exercise detail (third screenshot batch, 2026-11-09):
     - The ⓘ opens a "How to" page: exercise name, short bullet-point
       instructions, and the demo video embedded below them, with
       fullscreen-expand and playback-speed (1×) controls on the video.
     - Tapping the video itself goes truly fullscreen: only a slim bottom
       bar remains, showing the exercise name and a sets counter ("0/1"),
       plus the speed control.
     - The bottom sheet is scrollable — pulling it up reveals the next
       exercise's card underneath (e.g. Glute Bridge → Dumbbell Front
       Squat), so the "guided" and "list" views are one continuous scroll,
       not separate screens.

   - Rest timer (fifth screenshot batch, 2026-11-09):
     - Logging a set auto-starts a **Rest Timer** sheet: "Current
       Exercise: …", a big countdown (front squat showed ~1:45 —
       length may be per-exercise), −30s / +30s adjusters, a Skip
       button, and an X to dismiss. A small pill at the top right keeps
       the remaining rest time visible after dismissing the sheet.
     - When it reaches zero, a banner appears: "🔔 Time for your next
       set!" and you're back on the exercise sheet.
     - If the set just logged beats the exercise's personal best, the
       rest-timer sheet also shows a green banner: "🏆 New personal
       best!" (seen when she logged Bent-Over Row 30 × 10 on Nov 8,
       up from 20 lb the week before).
     - Rest length is per-exercise: ~1:45 for front squat, 1:30 for
       bent-over row.
     - Editing a set's weight updates the pre-fill of the sets below it
       (after she set set 1 to 30 lb, sets 2–3 showed 30 as well).
       Typing on the keypad replaces the pre-filled value from the
       first digit.
     - The History page includes the session currently in progress at
       the top, badged "IN PROGRESS", with the trophy already showing
       next to a set that set a new PB.
     - The REPS field shows the prescribed range (e.g. 8–10) until the
       set is logged; once logged it becomes the actual number (10),
       and the row turns green as described above.

4. **In-workout — list view (same session, scrollable)**
   - All exercises as cards in one scroll; same set tables and actions.
   - Weighted exercises show PREVIOUS as "weight × reps" and a LB column.
   - Some exercises carry a short coaching cue under the name
     (e.g. shoulder press: "Keep this one light. Elbows slightly forward…").
   - Notes appear where needed ("Reps are per side", "Time is per side").

5. **Finish**
   - Timed stretches at the end have a built-in countdown timer (play
     button, e.g. 0:30 per side).
   - "+ Add exercise" at the end of the list.
   - "Swipe to finish workout" slider; "Discard workout" in red below it.

## Exercise History page (from the History button)

Walked through with Dumbbell Front Squat (fourth screenshot batch,
2026-11-09):

- **Estimated One-rep Max card**: current estimate big at the top
  (front squat: 47 lb, "+20" over the period), date range underneath
  (Sep 25 – Nov 1, 2026), and a line chart with one dot per session.
  Tapping a dot shows a tooltip with that day's estimate and the set it
  came from (e.g. Oct 8: 49 lb, from 35.5 × 12).
- **Personal Best line** under the chart, with a trophy icon:
  "Personal Best: 35.5 × 12 (Estimated 1RM: 49 lb) on Oct 4, 2026."
- **History list**: one card per past session, newest first — date plus
  the workout it belonged to (front squat appears in both Prime P1 B and
  Prime P2 C, so an exercise recurs across phases/sessions). Each card
  has a per-set table: SET / LB / REPS / 1RM (estimated per set).
  A trophy icon marks the personal-best set inside its session card.
  "Load More" at the bottom pages in older sessions.
- Her own comments show under the session they were written in
  (Sep 25, on front squat: "Not sure where I should keep my hands in
  this exercise") — comments attach to the exercise within a session
  and resurface in History.

Prefill rule, stated by Irena 2026-11-09: the placeholder values in the
LB / REPS fields before she enters anything are copied from the record
of the last time she did that exercise. Every exercise carries its own
History page (chart + PB + per-session set tables).

Front Squat history captured as seed data (all lb × reps):
- Sep 25 (P1 B): 16×12, 16×12, 20×10
- Oct 4 (P1 B): 17.5×12, 26.5×12, 35.5×12 🏆 (PB, est. 1RM 49)
- Oct 8 (P1 B): 26.5×12, 35.5×12, 35.5×12
- Oct 15 (P1 B): 20×12, 20×15, 30×12
- Oct 26 (P2 C): 22×10, 22×10, 26.5×10, 35.5×10
- Nov 1 (P2 C): 30×10 × 4 sets

Seated Dumbbell Shoulder Press history captured as seed data
(est. 1RM now 29 lb, +4 since Sep 23; all lb × reps):
- Oct 6 (P1 A): 8×10, 17.5×12 (list continues below the fold)
- Oct 11 (P1 C): 17.5×12, 17.5×12, 17.5×15
- Oct 13 (P1 A): 10×12, 10×12
- Oct 17 (P1 C): 10×12 × 3 sets
- Oct 26 (P2 C): 17.5×10, 17.5×10, 22×10 🏆 (PB, est. 1RM 29)
- Nov 1 (P2 C): 20×10 × 3 sets
Note: shoulder press appears in both the A and C sessions — exercise
histories span sessions, same as front squat (B and C).

Dumbbell Romanian Deadlift history captured as seed data
(est. 1RM now 67 lb, +33 since Sep 25; all lb × reps):
- Oct 4 (P1 B): 17.5×15, 26.5×12, 44×12
- Oct 8 (P1 B): 26.5×12, 35.5×12, 44×14
- Oct 11 (P1 C): 35.5×12, 39.5×12, 44×12
- (one session, header cut off): 30×15, 30×15, 40×15
- Oct 22 (P2 B): 26.5×12, 31×12, 44×10
- Oct 26 (P2 C): 31×10, 35.5×10, 44×10
- Oct 29 (P2 B): 44×10 × 3 sets
- Nov 1 (P2 C): 40×10, 50×10 🏆 (PB, est. 1RM 67), 50×10
- Nov 5 (P2 B): 50×10 × 3 sets
Appears in both B and C sessions. Also spotted in the RDL fullscreen
video: a small picture-in-picture preview of a second camera angle in
the corner (tap to switch angles, presumably).

## Swap / replace flow (sixth screenshot batch, 2026-11-09)

Demonstrated on Incline Dumbbell Row:

1. Tap **Swap** → an "Alternative Exercises" sheet opens. Nicole had not
   set coach alternatives for this exercise ("Your coach hasn't set
   alternatives for this one"), so it offers "Search all exercises".
2. "Replace <exercise>" screen: a scrollable exercise library with
   thumbnails (initially a default/recent list) and a search field;
   typing filters live by name ("be" → Bench Press, Bent-Over…;
   "bent" → all the bent-over variants, dumbbell/barbell/band).
3. Picking a replacement swaps it into the same slot in the workout,
   keeping the prescribed scheme (3 × 10) but pre-filling weight/reps
   from the replacement exercise's own last session.
   Example: Bent-Over Dumbbell Row came in with previous 20×10, 20×10,
   20×12 → pre-filled 20 lb × 10.
   (For her actual home sessions she swaps incline row → prone dumbbell
   row on her flat bench, decided Nov 8; this walkthrough demo picked
   Bent-Over Dumbbell Row.)
4. Unit note: the Incline Dumbbell Row card shows its weight column in
   **KG** (previous 8×10, 10×10, 12×10) while the other exercises show
   LB — the unit appears to follow how that exercise was last logged,
   so the data model needs a per-exercise (or per-entry) unit.

Bent-Over Dumbbell Row history captured as seed data
(est. 1RM now 40 lb, +9 since Oct 11; all lb × reps):
- Oct 11 (P1 C): 17.5×12, 22×12, 22×12
- Oct 17 (P1 C): 10×12, 20×12, 20×12
- Nov 1 (P2 C): 20×10, 20×10, 20×12
- Nov 8 (P2 C, swapped in for Incline Row): set 1 = 30×10 🏆 new PB

## Prime P2 C — exercise list and what she logged on Nov 8

Warm-up (1 set each):
- Cat Cow 1×10
- Quadruped Thoracic Rotation 1×8 (reps per side)
- Foam Roller Hip Hinge 1×10
- Bodyweight Glute Bridge 1×12

Main / accessories (weights as logged that day):
- Dumbbell Front Squat 4×8–10 @ 30 lb
- Seated Dumbbell Shoulder Press 3×10 @ 20 lb
- Dumbbell Romanian Deadlift 3×10 (weight not visible in shots)
- Incline Dumbbell Row 3×10 — at home she swaps this to a prone dumbbell
  row on her flat bench (decided Nov 8)
- Dumbbell Floor Press 3×12 (partially visible)
- One further exercise @ 10 lb, 8–10 reps (name cut off in the shots)
- Dumbbell Hammer Curl 2×12 @ 20 lb
- Plank Walkout 2×6

Stretch finishers (timed):
- Child's Pose (timed)
- Seated Pigeon Stretch 0:30 per side
- (one more timed stretch above it, 0:30, name cut off)

## Pause / resume (final walkthrough batch, 2026-11-09)

- Leaving a workout mid-session keeps it alive. The Today screen's
  primary card gets an "IN PROGRESS" badge and "20 of 30 sets
  completed", and a persistent bar sits above the tab bar:
  "Workout in progress · 1:01:47" with pause (⏸) and discard (🗑)
  buttons, plus a chevron to jump back in.
- Pausing freezes the elapsed timer; the bar switches to "Paused ·
  1:01:49" with a ▶ resume button (and the same discard button).
- The workout overview sheet in this state shows a status line —
  "In progress · 20 of 30 sets · 1:01:46" — and its bottom button
  becomes "Resume workout" next to a red discard button.
- The swap persists in the session's exercise list (the overview shows
  Bent-Over Dumbbell Row in the row slot, 3 × 10).

With this batch, the Prime C start-to-finish flow is fully walked
through: Today → overview → start → per-set logging (keypad, green
rows, prefill from last time) → rest timer (+ PB banner) → History →
Swap → pause/resume → swipe to finish / discard.

## Still to come from Irena
- Prime A and Prime B exercise lists, and the Friday HIIT session.
- The names/weights hidden in the cut-off parts of the P2 C list above.
