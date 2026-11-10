/*
 * app.js — Nana Health (personal, single-user PWA).
 *
 * Architecture mirrors Irena's flashcard app: no build step, plain
 * scripts, all state in localStorage under one key, seed data fetched
 * from data/program.json (with an embedded fallback copy below for
 * file:// use, injected from program.json at build time — keep in sync).
 *
 * Plan logic (generation + curation rules) lives in curate.js.
 */
(function () {
  'use strict';

  var C = window.KalosCurate;
  var STATE_KEY = 'kalosTrainerStateV1';
  var APP_VERSION = 1;

  /* Embedded copy of data/program.json, used only if the fetch fails
     (e.g. opening index.html via file://). Injected — do not edit by hand. */
  var FALLBACK_PROGRAM = {"note":"Seed data transcribed from Irena's Kalos app screenshots, 2026-11-08/09. Prime C and Static Stretches are transcribed from Kalos; Prime A, Prime B and HIIT B are AI-composed (A/B approved by Irena 2026-11-09; HIIT B composed at her request the same day) pending diff against Nicole's real lists.","phase":"Phase 2","phaseStart":"2026-11-01","programName":"Phase 2 — Full Body (Dumbbells Only)","progressSeed":{"scans":[{"bmd":1.005,"bodyFatPct":34.0,"date":"2026-09-20","fatMassLb":39.4,"label":"Sep 20 — Baseline","leanMassLb":72.7,"visceralFatCm2":64.3,"weightLb":115.8},{"bmd":1.027,"bodyFatPct":32.5,"date":"2026-11-06","fatMassLb":38.0,"label":"Nov 6 — Latest","leanMassLb":75.1,"visceralFatCm2":59.2,"weightLb":116.9}],"sleepStepsSeed":{"asOf":"2026-11-06","sleepAvg7":"7h 14m","sleepLast":"6h 39m","stepsAvg7":7380,"stepsLast":10764},"strengthPins":[{"deltaLb":18,"name":"Dumbbell Goblet Squat","weightLb":35},{"deltaLb":33,"name":"Dumbbell Romanian Deadlift","weightLb":67},{"deltaLb":4,"name":"Seated Dumbbell Shoulder Press","weightLb":29}]},"version":1,"weeklyPattern":{"0":{"main":null,"secondary":[]},"1":{"main":null,"secondary":[]},"2":{"main":"prime-a","secondary":["static-stretches"]},"3":{"main":null,"secondary":[]},"4":{"main":"prime-b","secondary":["static-stretches"]},"5":{"main":null,"secondary":["hiit-b"]},"6":{"main":"prime-c","secondary":["static-stretches"]}},"workouts":{"hiit-b":{"blocks":[{"exercises":[{"instructions":["On all fours, wrists under shoulders, knees under hips.","Inhale: drop the belly, lift head and tailbone (cow).","Exhale: round the back toward the ceiling, tuck chin (cat).","Move slowly, one breath per position."],"name":"Cat Cow","reps":"10","sets":1,"video":{"channel":"Mind Body Spine","id":"BA9Uig_P-UA","title":"Cat Cow"}},{"instructions":["On all fours, one hand behind your head.","Rotate that elbow down toward the opposite knee, then open it up to the ceiling.","Follow the elbow with your eyes; hips stay still."],"name":"Quadruped Thoracic Rotation","reps":"8","sets":1,"video":{"channel":"Movement Redefined","id":"6YX5t4yCotY","title":"Quadruped Thoracic Rotations"}},{"instructions":["Lie on your back, knees bent, feet flat, arms by your sides.","Drive through your heels and lift hips until knees-hips-shoulders form a line.","Squeeze glutes at the top for a second, lower slowly."],"name":"Bodyweight Glute Bridge","reps":"12","sets":1,"video":{"channel":"Myprotein","id":"6LThpnVWas0","title":"Glute Bridge"}}],"name":"Warm-up"},{"exercises":[{"instructions":["Hold one dumbbell vertically at your chest, elbows tucked.","Feet shoulder-width, sit hips down between your heels.","Knees track over toes; chest stays tall.","Drive through the whole foot to stand."],"name":"Dumbbell Goblet Squat","note":"Light — 20 lb. Fast but controlled.","reps":"0:40","sets":3,"video":{"channel":"The White Coat Trainer","id":"RyzecxZlc2o","title":"Goblet Squat"},"weightLb":20},{"instructions":["Hold dumbbells in front of your thighs, feet hip-width.","Hinge: push hips back, soft knees, back flat, weights close to legs.","Lower until you feel a strong hamstring stretch (about mid-shin).","Drive hips forward to stand, squeeze glutes."],"name":"Dumbbell Romanian Deadlift","note":"Light — 30 lb. Hinge pace steady, not rushed.","reps":"0:40","sets":3,"video":{"channel":"J2FIT","id":"hQgFixeXdZo","title":"Dumbbell Romanian Deadlift — Technique for Beginners"},"weightLb":30},{"instructions":["Hinge to about 45°, back flat, dumbbells hanging below shoulders.","Row the dumbbells to your ribs, squeezing shoulder blades.","Lower slowly. No bouncing — if the lower back tires, use the bench prone row."],"name":"Bent-Over Row","note":"Light — 20 lb.","reps":"0:40","sets":3,"video":{"channel":"Fit Father Project","id":"Lpx5zlILItg","title":"Bent Over Dumbbell Row"},"weightLb":20},{"instructions":["Stand tall, dumbbells at shoulder height.","Brace your core and press overhead until arms are straight.","Lower slowly to shoulder height."],"name":"Dumbbell Shoulder Press","note":"Light — 10 lb, standing. (Her pool has this seated; standing suits the HIIT format.)","reps":"0:40","sets":3,"video":{"channel":"PureGym","id":"aI2hGzsAMXs","title":"How To Do A Dumbbell Shoulder Press"},"weightLb":10},{"instructions":["Stand tall, hinge and place hands on the floor.","Walk hands forward into a plank, body in one line.","Pause, then walk hands back and stand up."],"name":"Plank Walkout","reps":"6","sets":3,"video":{"channel":"Howcast","id":"VSp0z7Mp5IU","title":"How to Do an Inchworm"}}],"name":"Circuit — 3 rounds, 40s work / 20s rest"},{"exercises":[{"instructions":["Kneel, sit hips back to your heels, arms reaching forward.","Rest your forehead down and breathe into your back.","Relax a little deeper with each exhale."],"name":"Child's Pose","reps":"0:30","sets":1,"video":{"channel":"YogaRenew","id":"0aEbN7KChjs","title":"Child's Pose"}},{"instructions":["Lie on your back and hug both knees toward your chest.","Rock gently side to side to massage the lower back.","Breathe and relax."],"name":"Lying Knees to Chest Stretch","reps":"0:30","sets":1},{"instructions":["Hands on a wall, one foot back, heel pressed into the floor, leg straight.","Lean in until you feel the calf stretch.","Hold; switch sides next set."],"name":"Wall Calf Stretch","reps":"0:30","sets":1}],"name":"Cool-down"}],"id":"hiit-b","name":"Full Body HIIT I B","phase":"Phase 2","placeholder":false,"placeholderNote":"AI-composed 2026-11-09 at Irena's request (she did this session in Kalos on Nov 6 as a light secondary). Interval format built from her existing exercise pool at light weights; to be diffed against Nicole's real HIIT B when captured.","shortName":"HIIT B","type":"secondary"},"prime-a":{"blocks":[{"exercises":[{"instructions":["On all fours, wrists under shoulders, knees under hips.","Inhale: drop the belly, lift head and tailbone (cow).","Exhale: round the back toward the ceiling, tuck chin (cat).","Move slowly, one breath per position."],"name":"Cat Cow","reps":"10","sets":1,"video":{"channel":"Mind Body Spine","id":"BA9Uig_P-UA","title":"Cat Cow"}},{"instructions":["On all fours, one hand behind your head.","Rotate that elbow down toward the opposite knee, then open it up to the ceiling.","Follow the elbow with your eyes; hips stay still."],"name":"Quadruped Thoracic Rotation","reps":"8","sets":1,"video":{"channel":"Movement Redefined","id":"6YX5t4yCotY","title":"Quadruped Thoracic Rotations"}},{"instructions":["Stand tall holding the roller against your thighs.","Push hips back, sliding the roller down your thighs, soft knees.","Feel the hamstrings load, then drive hips forward to stand."],"name":"Foam Roller Hip Hinge","reps":"10","sets":1,"video":{"channel":"T-Nation","id":"W_O65GVbLQM","title":"Wall And Dowel Tests: Hip Hinge"}},{"instructions":["Lie on your back, knees bent, feet flat, arms by your sides.","Drive through your heels and lift hips until knees-hips-shoulders form a line.","Squeeze glutes at the top for a second, lower slowly."],"name":"Bodyweight Glute Bridge","reps":"12","sets":1,"video":{"channel":"Myprotein","id":"6LThpnVWas0","title":"Glute Bridge"}}],"name":"Warm-up"},{"exercises":[{"instructions":["Hold one dumbbell vertically at your chest, elbows tucked.","Feet shoulder-width, sit hips down between your heels.","Knees track over toes; chest stays tall.","Drive through the whole foot to stand."],"name":"Dumbbell Goblet Squat","note":"Start 35 lb (her current best on this lift).","reps":"8-10","sets":4,"video":{"channel":"The White Coat Trainer","id":"RyzecxZlc2o","title":"Goblet Squat"},"weightLb":35},{"instructions":["Coach cue (Nicole): keep this one light, elbows slightly forward.","Sit tall, dumbbells at shoulder height, palms forward.","Press overhead until arms are straight, ribs down.","Lower slowly to ear height."],"name":"Seated Dumbbell Shoulder Press","note":"Start 20 lb (Nov 8 weight; PB 22x10).","reps":"10","sets":3,"video":{"channel":"Built With Science","id":"DPXG3BJvl8A","title":"Seated Dumbbell Shoulder Press"},"weightLb":20},{"instructions":["Hold dumbbells in front of your thighs, feet hip-width.","Hinge: push hips back, soft knees, back flat, weights close to legs.","Lower until you feel a strong hamstring stretch (about mid-shin).","Drive hips forward to stand, squeeze glutes."],"name":"Dumbbell Romanian Deadlift","note":"Start 44 lb (lighter hinge day; B carries the heavy hinge).","reps":"10","sets":3,"video":{"channel":"J2FIT","id":"hQgFixeXdZo","title":"Dumbbell Romanian Deadlift — Technique for Beginners"},"weightLb":44},{"instructions":["Lie face-down on the flat bench, feet on the floor, a dumbbell in each hand hanging toward the floor.","Row both dumbbells up, squeezing shoulder blades together.","Pause at the top, lower slowly. Keep your neck neutral."],"name":"Prone Dumbbell Row (flat bench)","note":"Start 20 lb. Standing home swap for Incline Dumbbell Row: flat bench only.","reps":"10","sets":3,"video":{"channel":"Built With Science","id":"kNvy2_9Ji2w","title":"Dumbbell Chest Supported Row"},"videoNote":"Video demos the same chest-supported row on a slight incline — identical movement on your flat bench.","weightLb":20},{"instructions":["Lie on the floor, knees bent, a dumbbell in each hand at chest level, upper arms resting on the floor.","Press up until arms are straight.","Lower until upper arms touch the floor again — that's one rep."],"name":"Dumbbell Floor Press","note":"No weight — Kalos lists no weight for this exercise (Irena, 2026-11-09).","reps":"12","sets":3,"video":{"channel":"PureGym","id":"T0Y3OBF1bNI","title":"How To Do A Dumbbell Floor Press"}}],"name":"Main"},{"exercises":[{"instructions":["Stand tall, dumbbells at your sides, palms facing your body.","Curl up keeping palms facing each other ('hammer' grip).","Elbows stay pinned at your sides; lower slowly."],"name":"Dumbbell Hammer Curl","note":"Start 20 lb (Nov 8 weight).","reps":"12","sets":2,"video":{"channel":"PureGym","id":"B4RznoFvTl4","title":"How To Do Hammer Curls"},"weightLb":20},{"instructions":["Hold one dumbbell at shoulder height, other arm free for balance.","Press overhead until the arm is straight, bicep by your ear.","Lower slowly. Keep ribs down — no leaning back."],"name":"Dumbbell Single-Arm Overhead","note":"Start 10 lb (from the Prime C session).","reps":"8-10","sets":2,"video":{"channel":"Girls Gone Strong","id":"PWQ9xEVNwkQ","title":"Single Arm Overhead Dumbbell Press"},"weightLb":10},{"instructions":["Stand tall, hinge and place hands on the floor.","Walk hands forward into a plank, body in one line.","Pause, then walk hands back and stand up."],"name":"Plank Walkout","reps":"6","sets":2,"video":{"channel":"Howcast","id":"VSp0z7Mp5IU","title":"How to Do an Inchworm"}}],"name":"Accessories"},{"exercises":[{"instructions":["Kneel, sit hips back to your heels, arms reaching forward.","Rest your forehead down and breathe into your back.","Relax a little deeper with each exhale."],"name":"Child's Pose","reps":"0:30","sets":1,"video":{"channel":"YogaRenew","id":"0aEbN7KChjs","title":"Child's Pose"}},{"instructions":["On all fours, reach one arm under your body, rotating the torso and resting that shoulder down.","Hold, breathing into the upper back. (Switch sides next round if directed.)"],"name":"Thread the Needle","reps":"0:30","sets":1,"video":{"channel":"Peak Physio","id":"31O2ZPCk_CM","title":"Thread the Needle Stretch"}},{"instructions":["Sit with legs straight, toes up.","Hinge from the hips toward your toes, back long — don't round.","Hold where you feel a gentle hamstring stretch."],"name":"Seated Floor Hamstring Stretch","reps":"0:30","sets":1,"video":{"channel":"Mahalo","id":"L1v0VLWTSPo","title":"How to Do a Sitting Hamstring Stretch"}},{"instructions":["Sit with one ankle crossed over the opposite knee (figure-4).","Sit tall and lean gently forward until you feel the outer hip stretch.","Hold; switch sides next round if directed."],"name":"Seated Pigeon Stretch","reps":"0:30","sets":1,"video":{"channel":"Yoga","id":"4GhyX0pCKvY","title":"Seated Pigeon Pose"},"videoNote":"Video teaches the yoga seated-pigeon variant, a close cousin of the figure-4 version."}],"name":"Finishers"}],"id":"prime-a","name":"Prime I P2 I A (Full Body - Dumbbells Only)","phase":"Phase 2","placeholder":false,"placeholderNote":"AI-composed 2026-11-09, approved by Irena the same day. Built from the observed Kalos pattern (session anatomy of Prime C) and her logged exercise history; starting weights are in the exercise notes. To be diffed against Nicole's real Prime A when captured.","shortName":"Prime A","type":"main"},"prime-b":{"blocks":[{"exercises":[{"instructions":["On all fours, wrists under shoulders, knees under hips.","Inhale: drop the belly, lift head and tailbone (cow).","Exhale: round the back toward the ceiling, tuck chin (cat).","Move slowly, one breath per position."],"name":"Cat Cow","reps":"10","sets":1,"video":{"channel":"Mind Body Spine","id":"BA9Uig_P-UA","title":"Cat Cow"}},{"instructions":["On all fours, one hand behind your head.","Rotate that elbow down toward the opposite knee, then open it up to the ceiling.","Follow the elbow with your eyes; hips stay still."],"name":"Quadruped Thoracic Rotation","reps":"8","sets":1,"video":{"channel":"Movement Redefined","id":"6YX5t4yCotY","title":"Quadruped Thoracic Rotations"}},{"instructions":["Stand tall holding the roller against your thighs.","Push hips back, sliding the roller down your thighs, soft knees.","Feel the hamstrings load, then drive hips forward to stand."],"name":"Foam Roller Hip Hinge","reps":"10","sets":1,"video":{"channel":"T-Nation","id":"W_O65GVbLQM","title":"Wall And Dowel Tests: Hip Hinge"}},{"instructions":["Lie on your back, knees bent, feet flat, arms by your sides.","Drive through your heels and lift hips until knees-hips-shoulders form a line.","Squeeze glutes at the top for a second, lower slowly."],"name":"Bodyweight Glute Bridge","reps":"12","sets":1,"video":{"channel":"Myprotein","id":"6LThpnVWas0","title":"Glute Bridge"}}],"name":"Warm-up"},{"exercises":[{"instructions":["Hold dumbbells in front of your thighs, feet hip-width.","Hinge: push hips back, soft knees, back flat, weights close to legs.","Lower until you feel a strong hamstring stretch (about mid-shin).","Drive hips forward to stand, squeeze glutes."],"name":"Dumbbell Romanian Deadlift","note":"Start 50 lb (Nov 5 weight, all sets). B is her heavy hinge day.","reps":"10","sets":4,"video":{"channel":"J2FIT","id":"hQgFixeXdZo","title":"Dumbbell Romanian Deadlift — Technique for Beginners"},"weightLb":50},{"instructions":["Rest dumbbells on your shoulders, elbows high.","Sit hips down, knees tracking over toes, chest tall.","Drive through the whole foot to stand."],"name":"Dumbbell Front Squat","note":"Start 30 lb (Nov 8 weight).","reps":"10","sets":3,"video":{"channel":"Merrick Lincoln, DPT","id":"-86u3KDj1ck","title":"Dumbbell Front Squat Tutorial"},"weightLb":30},{"instructions":["Hinge to about 45°, back flat, dumbbells hanging below shoulders.","Row the dumbbells to your ribs, squeezing shoulder blades.","Lower slowly. No bouncing — if the lower back tires, use the bench prone row."],"name":"Bent-Over Row","note":"Start 30 lb (new PB, Nov 8). If the lower back is tired after deadlifts, swap to Prone Dumbbell Row on the bench.","reps":"10","sets":3,"video":{"channel":"Fit Father Project","id":"Lpx5zlILItg","title":"Bent Over Dumbbell Row"},"weightLb":30},{"instructions":["Lie on the floor, knees bent, a dumbbell in each hand at chest level, upper arms resting on the floor.","Press up until arms are straight.","Lower until upper arms touch the floor again — that's one rep."],"name":"Dumbbell Floor Press","note":"No weight — Kalos lists no weight for this exercise (Irena, 2026-11-09).","reps":"12","sets":3,"video":{"channel":"PureGym","id":"T0Y3OBF1bNI","title":"How To Do A Dumbbell Floor Press"}},{"instructions":["Hold one dumbbell vertically at your chest, elbows tucked.","Feet shoulder-width, sit hips down between your heels.","Knees track over toes; chest stays tall.","Drive through the whole foot to stand."],"name":"Dumbbell Goblet Squat","note":"Start 35 lb.","reps":"8-10","sets":3,"video":{"channel":"The White Coat Trainer","id":"RyzecxZlc2o","title":"Goblet Squat"},"weightLb":35}],"name":"Main"},{"exercises":[{"instructions":["Stand tall, dumbbells at your sides, palms facing your body.","Curl up keeping palms facing each other ('hammer' grip).","Elbows stay pinned at your sides; lower slowly."],"name":"Dumbbell Hammer Curl","note":"Start 20 lb (Nov 8 weight).","reps":"12","sets":2,"video":{"channel":"PureGym","id":"B4RznoFvTl4","title":"How To Do Hammer Curls"},"weightLb":20},{"instructions":["Hold one dumbbell at shoulder height, other arm free for balance.","Press overhead until the arm is straight, bicep by your ear.","Lower slowly. Keep ribs down — no leaning back."],"name":"Dumbbell Single-Arm Overhead","note":"Start 10 lb (from the Prime C session).","reps":"8-10","sets":2,"video":{"channel":"Girls Gone Strong","id":"PWQ9xEVNwkQ","title":"Single Arm Overhead Dumbbell Press"},"weightLb":10},{"instructions":["Stand tall, hinge and place hands on the floor.","Walk hands forward into a plank, body in one line.","Pause, then walk hands back and stand up."],"name":"Plank Walkout","reps":"6","sets":2,"video":{"channel":"Howcast","id":"VSp0z7Mp5IU","title":"How to Do an Inchworm"}}],"name":"Accessories"},{"exercises":[{"instructions":["Kneel, sit hips back to your heels, arms reaching forward.","Rest your forehead down and breathe into your back.","Relax a little deeper with each exhale."],"name":"Child's Pose","reps":"0:30","sets":1,"video":{"channel":"YogaRenew","id":"0aEbN7KChjs","title":"Child's Pose"}},{"instructions":["Sit with one ankle crossed over the opposite knee (figure-4).","Sit tall and lean gently forward until you feel the outer hip stretch.","Hold; switch sides next round if directed."],"name":"Seated Pigeon Stretch","reps":"0:30","sets":1,"video":{"channel":"Yoga","id":"4GhyX0pCKvY","title":"Seated Pigeon Pose"},"videoNote":"Video teaches the yoga seated-pigeon variant, a close cousin of the figure-4 version."},{"instructions":["Lie on your back and hug both knees toward your chest.","Rock gently side to side to massage the lower back.","Breathe and relax."],"name":"Lying Knees to Chest Stretch","reps":"0:30","sets":1},{"instructions":["Stand tall (use a wall for balance), bend one knee and hold the ankle behind you.","Knees together, pelvis tucked — feel the front of the thigh.","Hold; switch sides next set."],"name":"Standing Quad Stretch","reps":"0:30","sets":1,"video":{"channel":"","id":"zi5__zBRzYc","title":"Standing Quadricep Stretch"}}],"name":"Finishers"}],"id":"prime-b","name":"Prime I P2 I B (Full Body - Dumbbells Only)","phase":"Phase 2","placeholder":false,"placeholderNote":"AI-composed 2026-11-09, approved by Irena the same day. Heavy hinge + row emphasis, matching her B-day history. To be diffed against Nicole's real Prime B when captured.","shortName":"Prime B","type":"main"},"prime-c":{"blocks":[{"exercises":[{"instructions":["On all fours, wrists under shoulders, knees under hips.","Inhale: drop the belly, lift head and tailbone (cow).","Exhale: round the back toward the ceiling, tuck chin (cat).","Move slowly, one breath per position."],"name":"Cat Cow","reps":"10","sets":1,"video":{"channel":"Mind Body Spine","id":"BA9Uig_P-UA","title":"Cat Cow"}},{"instructions":["On all fours, one hand behind your head.","Rotate that elbow down toward the opposite knee, then open it up to the ceiling.","Follow the elbow with your eyes; hips stay still."],"name":"Quadruped Thoracic Rotation","reps":"8","sets":1,"video":{"channel":"Movement Redefined","id":"6YX5t4yCotY","title":"Quadruped Thoracic Rotations"}},{"instructions":["Stand tall holding the roller against your thighs.","Push hips back, sliding the roller down your thighs, soft knees.","Feel the hamstrings load, then drive hips forward to stand."],"name":"Foam Roller Hip Hinge","reps":"10","sets":1,"video":{"channel":"T-Nation","id":"W_O65GVbLQM","title":"Wall And Dowel Tests: Hip Hinge"}},{"instructions":["Lie on your back, knees bent, feet flat, arms by your sides.","Drive through your heels and lift hips until knees-hips-shoulders form a line.","Squeeze glutes at the top for a second, lower slowly."],"name":"Bodyweight Glute Bridge","reps":"12","sets":1,"video":{"channel":"Myprotein","id":"6LThpnVWas0","title":"Glute Bridge"}}],"name":"Warm-up"},{"exercises":[{"instructions":["Rest dumbbells on your shoulders, elbows high.","Sit hips down, knees tracking over toes, chest tall.","Drive through the whole foot to stand."],"name":"Dumbbell Front Squat","reps":"8-10","sets":4,"video":{"channel":"Merrick Lincoln, DPT","id":"-86u3KDj1ck","title":"Dumbbell Front Squat Tutorial"},"weightLb":30},{"instructions":["Coach cue (Nicole): keep this one light, elbows slightly forward.","Sit tall, dumbbells at shoulder height, palms forward.","Press overhead until arms are straight, ribs down.","Lower slowly to ear height."],"name":"Seated Dumbbell Shoulder Press","reps":"10","sets":3,"video":{"channel":"Built With Science","id":"DPXG3BJvl8A","title":"Seated Dumbbell Shoulder Press"},"weightLb":20},{"instructions":["Hold dumbbells in front of your thighs, feet hip-width.","Hinge: push hips back, soft knees, back flat, weights close to legs.","Lower until you feel a strong hamstring stretch (about mid-shin).","Drive hips forward to stand, squeeze glutes."],"name":"Dumbbell Romanian Deadlift","reps":"10","sets":3,"video":{"channel":"J2FIT","id":"hQgFixeXdZo","title":"Dumbbell Romanian Deadlift — Technique for Beginners"},"weightLb":50},{"instructions":["Lie face-down on the flat bench, feet on the floor, a dumbbell in each hand hanging toward the floor.","Row both dumbbells up, squeezing shoulder blades together.","Pause at the top, lower slowly. Keep your neck neutral."],"name":"Prone Dumbbell Row (flat bench)","note":"Swapped 2026-11-08: Irena has a flat bench only. Lie face-down on the bench, feet on floor, row both dumbbells and squeeze shoulder blades. Same 3x10.","reps":"10","sets":3,"video":{"channel":"Built With Science","id":"kNvy2_9Ji2w","title":"Dumbbell Chest Supported Row"},"videoNote":"Video demos the same chest-supported row on a slight incline — identical movement on your flat bench.","weightLb":20},{"instructions":["Lie on the floor, knees bent, a dumbbell in each hand at chest level, upper arms resting on the floor.","Press up until arms are straight.","Lower until upper arms touch the floor again — that's one rep."],"name":"Dumbbell Floor Press","reps":"12","sets":3,"video":{"channel":"PureGym","id":"T0Y3OBF1bNI","title":"How To Do A Dumbbell Floor Press"}}],"name":"Main"},{"exercises":[{"instructions":["Hold one dumbbell at shoulder height, other arm free for balance.","Press overhead until the arm is straight, bicep by your ear.","Lower slowly. Keep ribs down — no leaning back."],"name":"Dumbbell Single-Arm Overhead","reps":"8-10","sets":2,"video":{"channel":"Girls Gone Strong","id":"PWQ9xEVNwkQ","title":"Single Arm Overhead Dumbbell Press"},"weightLb":10},{"instructions":["Stand tall, dumbbells at your sides, palms facing your body.","Curl up keeping palms facing each other ('hammer' grip).","Elbows stay pinned at your sides; lower slowly."],"name":"Dumbbell Hammer Curl","reps":"12","sets":2,"video":{"channel":"PureGym","id":"B4RznoFvTl4","title":"How To Do Hammer Curls"},"weightLb":20},{"instructions":["Stand tall, hinge and place hands on the floor.","Walk hands forward into a plank, body in one line.","Pause, then walk hands back and stand up."],"name":"Plank Walkout","reps":"6","sets":2,"video":{"channel":"Howcast","id":"VSp0z7Mp5IU","title":"How to Do an Inchworm"}}],"name":"Accessories"},{"exercises":[{"instructions":["Kneel, sit hips back to your heels, arms reaching forward.","Rest your forehead down and breathe into your back.","Relax a little deeper with each exhale."],"name":"Child's Pose","reps":"0:30","sets":1,"video":{"channel":"YogaRenew","id":"0aEbN7KChjs","title":"Child's Pose"}},{"instructions":["On all fours, reach one arm under your body, rotating the torso and resting that shoulder down.","Hold, breathing into the upper back. (Switch sides next round if directed.)"],"name":"Thread the Needle","reps":"0:30","sets":1,"video":{"channel":"Peak Physio","id":"31O2ZPCk_CM","title":"Thread the Needle Stretch"}},{"instructions":["Sit with legs straight, toes up.","Hinge from the hips toward your toes, back long — don't round.","Hold where you feel a gentle hamstring stretch."],"name":"Seated Floor Hamstring Stretch","reps":"0:30","sets":1,"video":{"channel":"Mahalo","id":"L1v0VLWTSPo","title":"How to Do a Sitting Hamstring Stretch"}},{"instructions":["Sit with one ankle crossed over the opposite knee (figure-4).","Sit tall and lean gently forward until you feel the outer hip stretch.","Hold; switch sides next round if directed."],"name":"Seated Pigeon Stretch","reps":"0:30","sets":1,"video":{"channel":"Yoga","id":"4GhyX0pCKvY","title":"Seated Pigeon Pose"},"videoNote":"Video teaches the yoga seated-pigeon variant, a close cousin of the figure-4 version."}],"name":"Finishers"}],"id":"prime-c","name":"Prime I P2 I C (Full Body - Dumbbells Only)","phase":"Phase 2","placeholder":false,"shortName":"Prime C","type":"main"},"static-stretches":{"blocks":[{"exercises":[{"instructions":["Stand tall, one arm straight by your side.","Slowly make the biggest circle you can with that arm — forward, up, back, behind you.","Keep the rest of the body still; move through a comfortable range."],"name":"Shoulder CAR","reps":"0:30","sets":2},{"instructions":["Place your forearm on a wall, elbow at shoulder height.","Turn your body gently away until you feel the chest stretch.","Hold and breathe."],"name":"Wall Chest Stretch","reps":"0:15","sets":4},{"instructions":["Grip a bar overhead, arms straight, feet off the floor (or lightly touching for support).","Hang with shoulders engaged — not shrugging into your ears.","Breathe and let the spine decompress."],"name":"Dead Hang","reps":"0:30","sets":3,"video":{"channel":"OPEX Fitness","id":"0Bx_Ap7-EwU","title":"Dead Hang"}},{"instructions":["Sit with one leg straight, the other bent with foot against the inner thigh.","Hinge toward the straight leg, back long.","Hold; switch sides next set."],"name":"Seated Single-Leg Hamstring Stretch","reps":"0:30","sets":2},{"instructions":["Half-kneeling: one knee down, other foot forward.","Tuck the pelvis slightly and shift forward until you feel the front of the hip stretch.","Hold; switch sides next set."],"name":"Hip Flexor Stretch","reps":"0:30","sets":2,"video":{"channel":"","id":"bnVfloe6yTo","title":"Half Kneeling Hip Flexor Stretch"}},{"instructions":["Sit, soles of the feet together, knees out.","Hold your feet and sit tall; let the knees sink gently.","Lean forward slightly for a deeper inner-thigh stretch."],"name":"Butterfly Stretch","reps":"0:30","sets":1},{"instructions":["Stand tall (use a wall for balance), bend one knee and hold the ankle behind you.","Knees together, pelvis tucked — feel the front of the thigh.","Hold; switch sides next set."],"name":"Standing Quad Stretch","reps":"0:30","sets":2,"video":{"channel":"","id":"zi5__zBRzYc","title":"Standing Quadricep Stretch"}},{"instructions":["From all fours, lift hips up and back into downward dog, heels reaching down.","Shift forward and lower into cobra, chest open, elbows soft.","Flow slowly between the two."],"name":"Downward Dog to Cobra","reps":"3","sets":1},{"instructions":["Lie on your back and hug both knees toward your chest.","Rock gently side to side to massage the lower back.","Breathe and relax."],"name":"Lying Knees to Chest Stretch","reps":"0:15","sets":2},{"instructions":["Hands on a wall, one foot back, heel pressed into the floor, leg straight.","Lean in until you feel the calf stretch.","Hold; switch sides next set."],"name":"Wall Calf Stretch","reps":"0:30","sets":2}],"name":"Cool-down"}],"id":"static-stretches","name":"Static Stretches: Cool-Down Stretches","phase":"Phase 2","placeholder":false,"shortName":"Static Stretches","type":"secondary"},"thoracic-upper-back-release":{"blocks":[{"exercises":[{"instructions":["Kneel tall, one forearm down in front (puppy-pose style).","Sweep the free arm open toward the ceiling, rotating the chest.","10 reps, then switch sides."],"name":"Thoracic & Shoulder Release (kneeling arm sweeps)","reps":"10/side","sets":1},{"instructions":["Kneel back into child's pose with elbows down and hands clasped behind your head.","Let the chest sink and triceps/lats lengthen.","Small gentle movements, 10 reps."],"name":"Lat & Pec Minor Stretch (child's pose, hands clasped behind head)","reps":"10","sets":1},{"instructions":["Side-lying or kneeling, one hand behind your head.","Rotate the elbow up toward the ceiling, opening the chest.","10 reps, then switch sides."],"name":"Thoracic Spine Rotation (elbow to ceiling)","reps":"10/side","sets":1},{"instructions":["Sit in a wide straddle.","Side-bend over one leg, reaching the top arm over.","8 reps per side, slow and controlled."],"name":"QL & Adductor Release (seated straddle side bends)","reps":"8/side","sets":1}],"name":"Routine"}],"id":"thoracic-upper-back-release","name":"Thoracic & Upper Back Release (5-min, Matthew @matthew_stretching)","phase":"Added by Irena","placeholder":false,"shortName":"Thoracic Release","source":"Instagram reel by Matthew (@matthew_stretching), shared by Irena 2026-11-09: https://www.instagram.com/reel/DfUH9PvSAlv/ — 5-minute thoracic/upper-back decompression for desk workers with rounded shoulders; usable as warm-up activation or pre-sleep wind-down.","type":"secondary"}}};

  var PROGRAM = null;
  var state = null;
  var curatedDays = [];   // curated window: today-70d .. today+14d
  var planNotes = [];     // [{ date, text }] from curatePlan
  var lastTab = 'today';
  var openSession = null; // { date, workoutId }

  // ---------- state ----------

  function defaultState() {
    return { v: APP_VERSION, log: {}, sets: {}, meals: {}, sleepSteps: {}, moves: {} };
  }

  function loadState() {
    try {
      state = JSON.parse(localStorage.getItem(STATE_KEY) || 'null') || defaultState();
    } catch (e) { state = defaultState(); }
    if (!state.log) state = defaultState();
    if (!state.moves) state.moves = {};
    if (!('active' in state)) state.active = null;
  }

  function saveState() {
    try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function todayISO() { return C.fmtISO(new Date()); }

  function logEntry(dateISO, workoutId) {
    return (state.log[dateISO] || {})[workoutId] || null;
  }

  function isDone(dateISO, workoutId) {
    var e = logEntry(dateISO, workoutId);
    return !!(e && e.done);
  }

  // ---------- program + plan ----------

  function loadProgram() {
    return fetch('data/program.json')
      .then(function (r) { if (!r.ok) throw new Error('bad fetch'); return r.json(); })
      .catch(function () { return FALLBACK_PROGRAM; });
  }

  function buildPlan() {
    var t = todayISO();
    // Wide window: streak needs history; curation needs last week's misses
    // plus the next two weeks of prescheduled sessions.
    var start = C.addDaysISO(t, -70);
    var raw = C.generatePlan(PROGRAM, start, 85); // 70 back + today + 14 forward
    var out = C.curatePlan(raw, state.log, t, PROGRAM);
    applyUserMoves(out.days);
    curatedDays = out.days;
    planNotes = out.notes;
  }

  // ---------- user drag-and-drop moves (Kalos parity, added 2026-11-09) ----------
  // In Kalos, a workout card on the Schedule can be dragged by its handle
  // onto a different day. state.moves[iso] holds the full ordered session
  // list the user wants on that date, replacing the generated list for
  // that date only. Captured from the effective (curated) plan at drag
  // time, so curator shifts and user moves compose.

  function daySessionList(day) {
    var list = [];
    if (day.main) list.push(day.main);
    (day.secondary || []).forEach(function (id) { list.push(id); });
    return list;
  }

  function setDaySessions(day, list) {
    day.main = null;
    day.secondary = [];
    list.forEach(function (id) {
      var w = workout(id);
      if (w && w.type === 'main' && !day.main) day.main = id;
      else day.secondary.push(id);
    });
  }

  function applyUserMoves(days) {
    days.forEach(function (day) {
      var ov = state.moves[day.date];
      if (ov) setDaySessions(day, ov.slice());
    });
  }

  function moveSession(fromISO, wId, toISO) {
    if (fromISO === toISO) return false;
    var from = dayFor(fromISO), to = dayFor(toISO);
    if (!from || !to) return false;
    var fromList = state.moves[fromISO] ? state.moves[fromISO].slice() : daySessionList(from);
    var toList = state.moves[toISO] ? state.moves[toISO].slice() : daySessionList(to);
    var i = fromList.indexOf(wId);
    if (i < 0) return false;
    var w = workout(wId);
    fromList.splice(i, 1);
    if (w && w.type === 'main') {
      // A day holds at most one main session: dropping a main onto a day
      // that already has a different main swaps the two mains' days.
      var occupant = null;
      toList.forEach(function (id) {
        var x = workout(id);
        if (x && x.type === 'main') occupant = id;
      });
      if (occupant && occupant !== wId) {
        toList.splice(toList.indexOf(occupant), 1);
        fromList.unshift(occupant);
      }
      toList.unshift(wId);
    } else {
      toList.push(wId);
    }
    state.moves[fromISO] = fromList;
    state.moves[toISO] = toList;
    saveState();
    buildPlan();
    return true;
  }

  function dayFor(iso) {
    for (var i = 0; i < curatedDays.length; i++) {
      if (curatedDays[i].date === iso) return curatedDays[i];
    }
    return null;
  }

  function notesFor(iso) {
    return planNotes.filter(function (n) { return n.date === iso; });
  }

  function workout(id) { return PROGRAM.workouts[id]; }

  function workoutCounts(w) {
    var ex = 0, sets = 0;
    w.blocks.forEach(function (b) {
      b.exercises.forEach(function (e) { ex++; sets += e.sets; });
    });
    return { exercises: ex, sets: sets };
  }

  // ---------- small DOM helpers ----------

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function el(id) { return document.getElementById(id); }

  function statusMark(dateISO, wId, isMain) {
    if (isDone(dateISO, wId)) return '<span class="check">✓</span>';
    // Kalos marks missed secondaries with a red ✕ too (e.g. Sun Nov 8's
    // Static Stretches), not just missed mains.
    if (dateISO < todayISO()) return '<span class="missed-x">✕</span>';
    return '';
  }

  function sessionCardHTML(day, wId, kind, draggable) {
    var w = workout(wId);
    if (!w) return '';
    var counts = workoutCounts(w);
    var pills = '';
    if (kind === 'secondary') pills += '<span class="pill optional">Secondary · optional</span> ';
    if (day.movedFrom && kind === 'main') {
      pills += '<span class="pill moved">Moved from ' + esc(C.prettyDate(day.movedFrom)) + '</span> ';
    }
    if (day.deload && kind === 'main') pills += '<span class="pill deload">Deload week</span> ';
    var handle = '';
    if (draggable && !isDone(day.date, wId)) {
      handle = '<span class="drag-handle" data-drag="' + esc(day.date) + '|' + esc(wId) +
               '" title="Drag to another day">≡</span>';
    }
    return '<div class="card session-card" data-open="' + esc(day.date) + '|' + esc(wId) + '">' +
      '<div class="row"><div>' +
      '<div class="wname">' + esc(w.name) + '</div>' +
      '<div class="wmeta">' + esc(w.phase || '') + ' · ' + counts.exercises + ' exercises · ' +
      counts.sets + ' sets</div>' + pills +
      '</div><div class="card-marks">' + statusMark(day.date, wId, kind === 'main') + handle + '</div></div></div>';
  }

  function restCardHTML() {
    return '<div class="rest-card">🛏️&nbsp; Rest day</div>';
  }

  function notesHTML(iso) {
    return notesFor(iso).map(function (n) {
      return '<div class="note-card">📋 ' + esc(n.text) + '</div>';
    }).join('');
  }

  // ---------- views ----------

  var currentView = 'today';

  function showView(name) {
    currentView = name;
    ['today', 'schedule', 'progress', 'coach', 'workout', 'guide'].forEach(function (v) {
      el('view-' + v).hidden = v !== name;
    });
    document.querySelectorAll('.tab').forEach(function (t) {
      t.classList.toggle('active', t.getAttribute('data-view') === name);
    });
    if (name !== 'workout' && name !== 'guide') lastTab = name;
    window.scrollTo(0, 0);
  }

  function renderToday() {
    var t = todayISO();
    var day = dayFor(t);
    var mainHTML = '', secHTML = '';
    if (!day || (!day.main && !(day.secondary || []).length)) {
      mainHTML = restCardHTML();
    } else {
      if (day.main) mainHTML = sessionCardHTML(day, day.main, 'main');
      else mainHTML = restCardHTML();
      secHTML = (day.secondary || []).map(function (id) {
        return sessionCardHTML(day, id, 'secondary');
      }).join('');
    }
    el('todayMain').innerHTML = mainHTML;
    el('todaySecondary').innerHTML = secHTML;

    var streak = C.computeStreak(curatedDays, state.log, t);
    el('streakText').textContent = streak + (streak === 1 ? ' session' : ' sessions') + ' streak';

    var meals = state.meals[t] || 0;
    el('mealsText').textContent = meals + (meals === 1 ? ' meal logged' : ' meals logged');

    el('todayNotes').innerHTML = notesHTML(t);
  }

  function renderSchedule() {
    var t = todayISO();
    var from = C.startOfWeekISO(t);
    var to = C.addDaysISO(t, 14);
    var days = curatedDays.filter(function (d) { return d.date >= from && d.date <= to; });

    var html = '';
    var currentWeek = null;
    days.forEach(function (day) {
      var wkStart = C.startOfWeekISO(day.date);
      if (wkStart !== currentWeek) {
        currentWeek = wkStart;
        var wkEnd = C.addDaysISO(wkStart, 6);
        html += '<div class="week-title">' + esc(weekLabel(wkStart)) + ' – ' +
                esc(weekLabel(wkEnd)) + '</div>';
      }
      var d = C.parseISO(day.date);
      var label = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.weekday] +
                  '<span class="dnum">' + d.getDate() + '</span>';
      var cards = '';
      if (day.main) cards += sessionCardHTML(day, day.main, 'main', true);
      (day.secondary || []).forEach(function (id) {
        cards += sessionCardHTML(day, id, 'secondary', true);
      });
      if (!cards) cards = restCardHTML();
      var outline = day.date === t ? ' today-outline' : '';
      // outline applies to the first card; wrap trick: add class via first card only
      cards = cards.replace('class="card session-card"', 'class="card session-card' + outline + '"')
                   .replace('class="rest-card"', 'class="rest-card' + outline + '"');
      html += '<div class="day-row"><div class="day-label">' + label + '</div>' +
              '<div class="grow day-drop" data-date="' + esc(day.date) + '">' +
              cards + notesHTML(day.date) + '</div></div>';
    });
    el('scheduleList').innerHTML = html;
  }

  function weekLabel(iso) {
    var d = C.parseISO(iso);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[d.getMonth()] + ' ' + d.getDate();
  }

  // ---------- workout detail ----------

  function setKey(dateISO, wId, b, e, s) { return dateISO + '|' + wId + '|' + b + '-' + e + '-' + s; }

  // A set entry is { done, lb, reps }; v1 stored plain `true` for done,
  // which still reads as done with no values.
  function setEntry(key) {
    var v = state.sets[key];
    if (!v) return null;
    if (v === true) return { done: true, lb: '', reps: '' };
    return v;
  }

  function openWorkout(dateISO, wId) {
    openSession = { date: dateISO, workoutId: wId };
    var w = workout(wId);
    var counts = workoutCounts(w);
    el('workoutTitle').textContent = w.name;
    el('workoutMeta').textContent =
      (w.phase || '') + '  |  ' + counts.exercises + ' Exercises  |  ' + counts.sets + ' sets';
    el('workoutPlaceholderNote').innerHTML = w.placeholder
      ? '<div class="placeholder-note">⚠️ ' + esc(w.placeholderNote || 'Exercise details coming soon.') + '</div>'
      : '';

    var html = '';
    w.blocks.forEach(function (block, bi) {
      html += '<div class="block-title">' + esc(block.name) + '</div>';
      block.exercises.forEach(function (ex, ei) {
        html += exerciseHTML(dateISO, wId, bi, ei, ex);
      });
    });
    el('workoutBlocks').innerHTML = html;
    var sb = el('startBtn');
    if (sb) {
      var isActive = state.active && state.active.date === dateISO &&
                     state.active.workoutId === wId;
      sb.textContent = isActive ? 'Resume workout' : 'Start workout';
    }
    renderCompleteBtn();
    showView('workout');
  }

  // One exercise's header + set logging UI (shared by the overview list
  // and the guided focus view).
  function exerciseHTML(dateISO, wId, bi, ei, ex) {
    var meta = ex.sets + ' × ' + esc(ex.reps);
    if (ex.weightLb) meta += ' · ' + ex.weightLb + ' lb';
    var html = '<div class="ex-row"><div class="ex-info">' +
      '<div class="ex-name">' + esc(ex.name) + '</div>' +
      '<div class="ex-sets-label">' + meta + '</div></div>';
    if (String(ex.reps).indexOf(':') >= 0) {
      // Timed exercise (0:30 holds, 0:40 intervals): checkboxes only.
      var boxes = '';
      for (var s = 0; s < ex.sets; s++) {
        var e0 = setEntry(setKey(dateISO, wId, bi, ei, s));
        boxes += '<button class="set-box' + (e0 && e0.done ? ' on' : '') +
                 '" data-set="' + bi + '|' + ei + '|' + s +
                 '" aria-label="set ' + (s + 1) + '">✓</button>';
      }
      html += '<div class="set-boxes">' + boxes + '</div></div>';
    } else {
      // Set table (Kalos layout): # / LB / REPS / done. LB prefills from
      // the exercise's target weight, REPS from the prescribed number
      // (a range like 8-10 becomes the input placeholder).
      html += '</div><div class="set-table">' +
        '<div class="set-head"><span>#</span><span>LB</span><span>REPS</span><span></span></div>';
      var singleRep = /^\d+$/.test(String(ex.reps)) ? String(ex.reps) : '';
      for (var s2 = 0; s2 < ex.sets; s2++) {
        var key = setKey(dateISO, wId, bi, ei, s2);
        var ent = setEntry(key);
        var lb = ent && ent.lb !== '' ? ent.lb : (ex.weightLb ? String(ex.weightLb) : '');
        var rp = ent && ent.reps !== '' ? ent.reps : singleRep;
        html += '<div class="set-row' + (ent && ent.done ? ' done' : '') + '">' +
          '<span class="set-num">' + (s2 + 1) + '</span>' +
          '<input class="set-in" data-setval="' + bi + '|' + ei + '|' + s2 + '|lb" ' +
            'inputmode="decimal" value="' + esc(lb) + '" aria-label="weight in lb" />' +
          '<input class="set-in" data-setval="' + bi + '|' + ei + '|' + s2 + '|reps" ' +
            'inputmode="numeric" value="' + esc(rp) + '" placeholder="' + esc(ex.reps) + '" aria-label="reps" />' +
          '<button class="set-box' + (ent && ent.done ? ' on' : '') + '" data-set="' +
            bi + '|' + ei + '|' + s2 + '" aria-label="mark set done">✓</button></div>';
      }
      html += '</div>';
    }
    return html;
  }

  // YouTube embed facade: a thumbnail that swaps in the real player on
  // tap (youtube-nocookie). Videos are embedded, never copied.
  function videoFacadeHTML(ex) {
    if (!ex.video || !ex.video.id) return '';
    var cap = esc(ex.video.title) + (ex.video.channel ? ' · ' + esc(ex.video.channel) : '');
    return '<div class="video-facade" data-video="' + esc(ex.video.id) + '">' +
      '<img src="https://i.ytimg.com/vi/' + esc(ex.video.id) + '/hqdefault.jpg" alt="" loading="lazy" />' +
      '<span class="video-play">▶</span>' +
      '<span class="video-cap">' + cap + '</span></div>';
  }

  // ---------- guided workout ----------

  function flatExercises(w) {
    var list = [];
    w.blocks.forEach(function (block, bi) {
      block.exercises.forEach(function (ex, ei) {
        list.push({ bi: bi, ei: ei, ex: ex, block: block.name });
      });
    });
    return list;
  }

  function elapsedMs(a) {
    var ms = a.elapsedBefore || 0;
    if (a.running && a.startedAt) ms += Date.now() - a.startedAt;
    return ms;
  }

  function fmtClock(ms) {
    var s = Math.floor(ms / 1000);
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    return h > 0 ? h + ':' + pad(m) + ':' + pad(ss) : m + ':' + pad(ss);
  }

  function exerciseDone(dateISO, wId, item) {
    for (var s = 0; s < item.ex.sets; s++) {
      var e = setEntry(setKey(dateISO, wId, item.bi, item.ei, s));
      if (!e || !e.done) return false;
    }
    return true;
  }

  function startWorkout(dateISO, wId) {
    var a = state.active;
    if (!a || a.date !== dateISO || a.workoutId !== wId) {
      var list = flatExercises(workout(wId));
      var idx = 0;
      for (var i = 0; i < list.length; i++) {
        if (!exerciseDone(dateISO, wId, list[i])) { idx = i; break; }
        idx = i;
      }
      state.active = { date: dateISO, workoutId: wId, exIdx: idx,
                       startedAt: Date.now(), elapsedBefore: 0, running: true };
      saveState();
    }
    openSession = { date: dateISO, workoutId: wId };
    renderGuide();
    showView('guide');
  }

  function renderGuide() {
    var a = state.active;
    if (!a) return;
    var w = workout(a.workoutId);
    var list = flatExercises(w);
    if (a.exIdx >= list.length) a.exIdx = list.length - 1;
    if (a.exIdx < 0) a.exIdx = 0;
    var item = list[a.exIdx];
    el('guideWorkoutName').textContent = w.shortName || w.name;
    el('guideProgressText').textContent =
      'Exercise ' + (a.exIdx + 1) + ' of ' + list.length + ' · ' + item.block;
    el('guideTimer').textContent = fmtClock(elapsedMs(a));
    el('guidePause').textContent = a.running ? '⏸ Pause' : '▶ Resume';
    var dots = '';
    list.forEach(function (it, i) {
      var cls = 'dot' + (i === a.exIdx ? ' cur' : '') +
                (exerciseDone(a.date, a.workoutId, it) ? ' done' : '');
      dots += '<button class="' + cls + '" data-dot="' + i + '" aria-label="exercise ' + (i + 1) + '"></button>';
    });
    el('guideDots').innerHTML = dots;
    el('guideExName').textContent = item.ex.name;
    var meta = item.ex.sets + ' × ' + esc(item.ex.reps);
    if (item.ex.weightLb) meta += ' · ' + item.ex.weightLb + ' lb';
    el('guideExMeta').innerHTML = meta;
    el('guideExNote').textContent =
      [item.ex.note, item.ex.videoNote].filter(Boolean).join(' ');
    // Media panel: rebuild only when the focused exercise changes, so
    // a playing video isn't killed by a re-render (e.g. pausing).
    var mediaKey = a.date + '|' + a.workoutId + '|' + item.bi + '-' + item.ei;
    if (mediaKey !== renderGuide._mediaKey) {
      renderGuide._mediaKey = mediaKey;
      el('guideMedia').innerHTML = videoFacadeHTML(item.ex) ||
        '<div class="guide-media-ph"><div class="guide-media-ico">🏋️</div></div>';
    }
    el('guideSets').innerHTML = exerciseHTML(a.date, a.workoutId, item.bi, item.ei, item.ex);
    el('guidePrev').disabled = a.exIdx === 0;
    el('guideNext').disabled = a.exIdx >= list.length - 1;
  }

  function guideGoto(idx) {
    var a = state.active;
    if (!a) return;
    var list = flatExercises(workout(a.workoutId));
    a.exIdx = Math.max(0, Math.min(list.length - 1, idx));
    saveState();
    renderGuide();
  }

  // Rest timer (in-memory; Kalos default observed: ~90s between sets)
  var rest = { left: 0, total: 0, done: false };
  function startRest(seconds) {
    rest.left = seconds; rest.total = seconds; rest.done = false;
    el('restLabel').textContent = 'Rest';
    el('restPanel').hidden = false;
    paintRest();
  }
  function stopRest() {
    rest.left = 0; rest.done = false;
    el('restPanel').hidden = true;
  }
  function paintRest() {
    if (el('restPanel').hidden) return;
    if (rest.done) {
      el('restLabel').textContent = '🔔 Time for your next set!';
      el('restTime').textContent = '0:00';
    } else {
      el('restTime').textContent = fmtClock(rest.left * 1000);
    }
  }

  function finishWorkout() {
    var a = state.active;
    if (!a) return;
    if (!state.log[a.date]) state.log[a.date] = {};
    state.log[a.date][a.workoutId] = { done: true, completedAt: new Date().toISOString() };
    state.active = null;
    stopRest();
    saveState();
    buildPlan();
    renderAll();
    showView('today');
  }

  function discardWorkout() {
    var a = state.active;
    if (!a) return;
    if (!window.confirm('Discard this workout? The sets you logged for it will be cleared.')) return;
    var prefix = a.date + '|' + a.workoutId + '|';
    Object.keys(state.sets).forEach(function (k) {
      if (k.indexOf(prefix) === 0) delete state.sets[k];
    });
    state.active = null;
    stopRest();
    saveState();
    renderAll();
    showView(lastTab);
  }

  function renderResumeBar() {
    var bar = el('resumeBar');
    var a = state.active;
    if (!a || currentView === 'guide') { bar.hidden = true; return; }
    var w = workout(a.workoutId);
    el('resumeText').textContent = '🏋️ ' + (w ? (w.shortName || w.name) : 'Workout') +
      ' in progress · ' + fmtClock(elapsedMs(a));
    bar.hidden = false;
  }

  function tickClock() {
    var a = state.active;
    if (currentView === 'guide' && a) {
      el('guideTimer').textContent = fmtClock(elapsedMs(a));
      if (!el('restPanel').hidden && rest.left > 0 && a.running) {
        rest.left -= 1;
        if (rest.left <= 0) { rest.done = true; }
        paintRest();
      }
    }
    if (a && currentView !== 'guide') renderResumeBar();
  }

  // Clear everything logged for one session: set entries, the done
  // log, and any in-progress state. (Added 2026-11-09 after Irena
  // trial-tested Prime A and wanted it back to a clean slate.)
  function resetSession(dateISO, wId) {
    var prefix = dateISO + '|' + wId + '|';
    Object.keys(state.sets).forEach(function (k) {
      if (k.indexOf(prefix) === 0) delete state.sets[k];
    });
    if (state.log[dateISO]) delete state.log[dateISO][wId];
    if (state.active && state.active.date === dateISO &&
        state.active.workoutId === wId) {
      state.active = null;
      stopRest();
    }
    saveState();
    buildPlan();
  }

  function renderCompleteBtn() {
    var btn = el('completeBtn');
    var done = openSession && isDone(openSession.date, openSession.workoutId);
    btn.textContent = done ? '✓ Completed — tap to undo' : 'Complete workout';
    btn.classList.toggle('done', !!done);
  }

  function toggleComplete() {
    if (!openSession) return;
    var dateISO = openSession.date, wId = openSession.workoutId;
    if (!state.log[dateISO]) state.log[dateISO] = {};
    if (isDone(dateISO, wId)) {
      delete state.log[dateISO][wId];
    } else {
      state.log[dateISO][wId] = { done: true, completedAt: new Date().toISOString() };
    }
    saveState();
    buildPlan(); // a completion can change curation (e.g. un-miss a session)
    renderCompleteBtn();
  }

  // ---------- progress ----------

  function fmtDelta(v, decimals) {
    var s = (v > 0 ? '+' : '') + v.toFixed(decimals);
    return s;
  }

  function renderProgress() {
    var seed = PROGRAM.progressSeed;
    var base = seed.scans[0], latest = seed.scans[seed.scans.length - 1];
    // dir: 'down' = lower is better, 'up' = higher is better, 'flat' = neutral
    var cards = [
      { label: 'BODY FAT %', val: latest.bodyFatPct.toFixed(1) + '%', d: latest.bodyFatPct - base.bodyFatPct, dec: 1, dir: 'down' },
      { label: 'FAT MASS', val: latest.fatMassLb.toFixed(1) + ' lb', d: latest.fatMassLb - base.fatMassLb, dec: 1, dir: 'down' },
      { label: 'LEAN MASS', val: latest.leanMassLb.toFixed(1) + ' lb', d: latest.leanMassLb - base.leanMassLb, dec: 1, dir: 'up' },
      { label: 'VISCERAL FAT', val: latest.visceralFatCm2.toFixed(1) + ' cm²', d: latest.visceralFatCm2 - base.visceralFatCm2, dec: 1, dir: 'down' },
      { label: 'BONE DENSITY (BMD)', val: latest.bmd.toFixed(3) + ' g/cm²', d: latest.bmd - base.bmd, dec: 3, dir: 'up' },
      { label: 'WEIGHT (DEXA)', val: latest.weightLb.toFixed(1) + ' lb', d: latest.weightLb - base.weightLb, dec: 1, dir: 'flat' }
    ];
    el('bodyCompGrid').innerHTML = cards.map(function (c) {
      var cls = 'delta-flat';
      if (c.dir !== 'flat' && c.d !== 0) {
        var good = (c.dir === 'down' && c.d < 0) || (c.dir === 'up' && c.d > 0);
        cls = good ? 'delta-good' : 'delta-bad';
      }
      return '<div class="stat-card"><div class="stat-label">' + esc(c.label) + '</div>' +
        '<div class="stat-value">' + esc(c.val) + '</div>' +
        '<div class="stat-delta ' + cls + '">' + esc(fmtDelta(c.d, c.dec)) + '</div></div>';
    }).join('');
    el('scanMeta').textContent = base.label + ' → ' + latest.label + ' (DEXA)';

    el('strengthCard').innerHTML = seed.strengthPins.map(function (p) {
      return '<div class="strength-row"><span class="strength-name">' + esc(p.name) + '</span>' +
        '<span class="strength-val">' + p.weightLb + ' lb<span class="up">+' + p.deltaLb + '</span></span></div>';
    }).join('');

    renderSleepSteps();
  }

  function renderSleepSteps() {
    var t = todayISO();
    var seed = PROGRAM.progressSeed.sleepStepsSeed || {};
    var entry = state.sleepSteps[t] || null;
    var sleep = entry && entry.sleep ? entry.sleep : (seed.sleepLast || '—');
    var steps = entry && entry.steps ? entry.steps : (seed.stepsLast || null);
    var avgLine = entry
      ? 'logged today · 7-day avg at last check: ' + (seed.sleepAvg7 || '—') + ' sleep, ' +
        (seed.stepsAvg7 ? seed.stepsAvg7.toLocaleString() : '—') + ' steps'
      : 'last recorded ' + (seed.asOf || '') + ' · 7-day avg: ' + (seed.sleepAvg7 || '—') +
        ' sleep, ' + (seed.stepsAvg7 ? seed.stepsAvg7.toLocaleString() : '—') + ' steps';
    el('sleepStepsCard').innerHTML =
      '<div class="ss-row"><div><div class="muted small">😴 SLEEP</div>' +
      '<div class="big-num">' + esc(sleep) + '</div></div>' +
      '<button class="edit-link" id="editSleep">Edit</button></div>' +
      '<div class="ss-row"><div><div class="muted small">👣 STEPS</div>' +
      '<div class="big-num">' + (steps ? Number(steps).toLocaleString() : '—') + '</div></div>' +
      '<button class="edit-link" id="editSteps">Edit</button></div>' +
      '<div class="muted small">' + esc(avgLine) + '</div>';

    el('editSleep').addEventListener('click', function () {
      var v = prompt('Last night\'s sleep (e.g. 7h 14m):', entry && entry.sleep ? entry.sleep : '');
      if (v === null) return;
      if (!state.sleepSteps[t]) state.sleepSteps[t] = {};
      state.sleepSteps[t].sleep = v.trim();
      saveState(); renderSleepSteps();
    });
    el('editSteps').addEventListener('click', function () {
      var v = prompt('Today\'s steps:', entry && entry.steps ? String(entry.steps) : '');
      if (v === null) return;
      var n = parseInt(String(v).replace(/[^0-9]/g, ''), 10);
      if (isNaN(n)) return;
      if (!state.sleepSteps[t]) state.sleepSteps[t] = {};
      state.sleepSteps[t].steps = n;
      saveState(); renderSleepSteps();
    });
  }

  // ---------- events + init ----------

  function renderAll() {
    renderToday();
    renderSchedule();
    renderProgress();
    renderResumeBar();
  }

  function bindEvents() {
    var suppressClick = false;

    document.querySelectorAll('.tab').forEach(function (t) {
      t.addEventListener('click', function () {
        showView(t.getAttribute('data-view'));
      });
    });

    // Session cards (event delegation — cards are re-rendered often)
    document.addEventListener('click', function (e) {
      if (suppressClick) return;
      var vf = e.target.closest ? e.target.closest('[data-video]') : null;
      if (vf) {
        var vid = vf.getAttribute('data-video');
        vf.removeAttribute('data-video');
        vf.classList.add('playing');
        vf.innerHTML = '<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/' +
          encodeURIComponent(vid) + '?rel=0&playsinline=1&autoplay=1" ' +
          'allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen ' +
          'frameborder="0" title="Exercise instruction video"></iframe>';
        return;
      }
      var card = e.target.closest ? e.target.closest('[data-open]') : null;
      if (card) {
        var parts = card.getAttribute('data-open').split('|');
        openWorkout(parts[0], parts[1]);
        return;
      }
      var box = e.target.closest ? e.target.closest('[data-set]') : null;
      if (box && openSession) {
        var p = box.getAttribute('data-set').split('|');
        var key = setKey(openSession.date, openSession.workoutId, p[0], p[1], p[2]);
        var ent = setEntry(key) || { done: false, lb: '', reps: '' };
        ent.done = !ent.done;
        state.sets[key] = ent;
        saveState();
        box.classList.toggle('on', ent.done);
        var row = box.closest ? box.closest('.set-row') : null;
        if (row) row.classList.toggle('done', ent.done);
        // Guided mode: completing a set starts the rest timer; completing
        // the focused exercise advances focus to the next one.
        if (ent.done && currentView === 'guide' && state.active &&
            state.active.date === openSession.date &&
            state.active.workoutId === openSession.workoutId) {
          var list = flatExercises(workout(openSession.workoutId));
          var anyLeft = list.some(function (it) {
            return !exerciseDone(openSession.date, openSession.workoutId, it);
          });
          if (anyLeft) startRest(90);
          var cur = list[state.active.exIdx];
          if (cur && exerciseDone(openSession.date, openSession.workoutId, cur) &&
              state.active.exIdx < list.length - 1) {
            state.active.exIdx += 1;
            saveState();
            renderGuide();
          }
        }
      }
    });

    // Set-table inputs: typing a weight/reps value persists it (and is
    // what later prefills and history will read).
    document.addEventListener('change', function (e) {
      var inp = e.target.closest ? e.target.closest('[data-setval]') : null;
      if (!inp || !openSession) return;
      var p = inp.getAttribute('data-setval').split('|');
      var key = setKey(openSession.date, openSession.workoutId, p[0], p[1], p[2]);
      var ent = setEntry(key) || { done: false, lb: '', reps: '' };
      ent[p[3]] = inp.value.trim();
      state.sets[key] = ent;
      saveState();
    });

    // Drag-and-drop (Schedule): press the ≡ handle on a session card and
    // drag it onto another day. Pointer events, so touch and mouse both
    // work; the handle has touch-action:none so the list still scrolls
    // normally from anywhere else on the card.
    var drag = null;
    el('scheduleList').addEventListener('pointerdown', function (e) {
      var h = e.target.closest ? e.target.closest('[data-drag]') : null;
      if (!h) return;
      var card = h.closest ? h.closest('.session-card') : null;
      if (!card) return;
      var parts = h.getAttribute('data-drag').split('|');
      drag = { pointerId: e.pointerId, fromISO: parts[0], wId: parts[1],
               card: card, startX: e.clientX, startY: e.clientY,
               active: false, clone: null, dropDate: null };
      e.preventDefault();
    });
    document.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.pointerId) return;
      if (!drag.active) {
        if (Math.abs(e.clientX - drag.startX) + Math.abs(e.clientY - drag.startY) < 8) return;
        drag.active = true;
        var r = drag.card.getBoundingClientRect();
        var c = drag.card.cloneNode(true);
        c.classList.add('drag-clone');
        c.style.width = r.width + 'px';
        c.style.left = r.left + 'px';
        c.style.top = r.top + 'px';
        document.body.appendChild(c);
        drag.clone = c;
        drag.offX = drag.startX - r.left;
        drag.offY = drag.startY - r.top;
        drag.card.classList.add('drag-src');
      }
      drag.clone.style.left = (e.clientX - drag.offX) + 'px';
      drag.clone.style.top = (e.clientY - drag.offY) + 'px';
      var under = document.elementFromPoint(e.clientX, e.clientY);
      var drop = under && under.closest ? under.closest('.day-drop') : null;
      document.querySelectorAll('.day-drop.drop-hot').forEach(function (d) {
        if (d !== drop) d.classList.remove('drop-hot');
      });
      if (drop) drop.classList.add('drop-hot');
      drag.dropDate = drop ? drop.getAttribute('data-date') : null;
    });
    function endDrag(e) {
      if (!drag || (e && e.pointerId !== drag.pointerId)) return;
      var d = drag;
      drag = null;
      if (d.clone) d.clone.remove();
      d.card.classList.remove('drag-src');
      document.querySelectorAll('.day-drop.drop-hot').forEach(function (x) {
        x.classList.remove('drop-hot');
      });
      if (d.active) {
        suppressClick = true;
        setTimeout(function () { suppressClick = false; }, 80);
        if (d.dropDate && d.dropDate !== d.fromISO &&
            moveSession(d.fromISO, d.wId, d.dropDate)) {
          renderAll();
        }
      }
    }
    document.addEventListener('pointerup', endDrag);
    document.addEventListener('pointercancel', endDrag);

    el('workoutBack').addEventListener('click', function () {
      renderAll();
      showView(lastTab);
    });
    el('completeBtn').addEventListener('click', function () {
      toggleComplete();
      renderAll();
    });

    el('resetBtn').addEventListener('click', function () {
      if (!openSession) return;
      if (!window.confirm('Reset this session? All sets logged for it will be cleared.')) return;
      resetSession(openSession.date, openSession.workoutId);
      openWorkout(openSession.date, openSession.workoutId);
      renderAll();
    });

    // Guided workout controls
    el('startBtn').addEventListener('click', function () {
      if (openSession) startWorkout(openSession.date, openSession.workoutId);
    });
    el('guideBack').addEventListener('click', function () {
      var a = state.active;
      if (a) { openWorkout(a.date, a.workoutId); }
      else showView(lastTab);
      renderResumeBar();
    });
    el('guidePrev').addEventListener('click', function () {
      if (state.active) guideGoto(state.active.exIdx - 1);
    });
    el('guideNext').addEventListener('click', function () {
      if (state.active) guideGoto(state.active.exIdx + 1);
    });
    el('guideDots').addEventListener('click', function (e) {
      var d = e.target.closest ? e.target.closest('[data-dot]') : null;
      if (d) guideGoto(parseInt(d.getAttribute('data-dot'), 10));
    });
    el('guidePause').addEventListener('click', function () {
      var a = state.active;
      if (!a) return;
      if (a.running) {
        a.elapsedBefore = elapsedMs(a);
        a.startedAt = null;
        a.running = false;
      } else {
        a.startedAt = Date.now();
        a.running = true;
      }
      saveState();
      renderGuide();
    });
    el('guideFinish').addEventListener('click', finishWorkout);
    el('guideDiscard').addEventListener('click', discardWorkout);
    el('resumeBtn').addEventListener('click', function () {
      var a = state.active;
      if (a) startWorkout(a.date, a.workoutId);
    });
    el('resumeDiscard').addEventListener('click', discardWorkout);
    el('guideHowto').addEventListener('click', function () {
      var a = state.active;
      if (!a) return;
      var item = flatExercises(workout(a.workoutId))[a.exIdx];
      el('howtoTitle').textContent = item.ex.name;
      var bullets = item.ex.instructions && item.ex.instructions.length
        ? item.ex.instructions
        : (item.ex.note ? [item.ex.note] : ['No instructions captured for this exercise yet.']);
      el('howtoList').innerHTML = bullets.map(function (b) {
        return '<li>' + esc(b) + '</li>';
      }).join('');
      el('howtoVideo').innerHTML = videoFacadeHTML(item.ex);
      el('howtoSheet').hidden = false;
    });
    el('howtoClose').addEventListener('click', function () {
      el('howtoSheet').hidden = true;
    });
    el('howtoSheet').addEventListener('click', function (e) {
      if (e.target === el('howtoSheet')) el('howtoSheet').hidden = true;
    });
    el('restMinus').addEventListener('click', function () {
      rest.left = Math.max(0, rest.left - 30); rest.done = false; paintRest();
    });
    el('restPlus').addEventListener('click', function () {
      rest.left += 30; rest.done = false; paintRest();
    });
    el('restSkip').addEventListener('click', stopRest);

    el('mealPlus').addEventListener('click', function () {
      var t = todayISO();
      state.meals[t] = (state.meals[t] || 0) + 1;
      saveState(); renderToday();
    });
    el('mealMinus').addEventListener('click', function () {
      var t = todayISO();
      state.meals[t] = Math.max(0, (state.meals[t] || 0) - 1);
      saveState(); renderToday();
    });
  }

  function init() {
    loadState();
    loadProgram().then(function (program) {
      PROGRAM = program;
      if (!PROGRAM) {
        document.body.innerHTML = '<p style="padding:20px">Could not load program data.</p>';
        return;
      }
      buildPlan();
      bindEvents();
      renderAll();
      showView('today');
      setInterval(tickClock, 1000);
    });
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
