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
  var FALLBACK_PROGRAM = {"note":"Seed data transcribed from Irena's Kalos app screenshots, 2026-11-08. Prime A / Prime B / HIIT exercise lists are placeholders until she provides them.","phase":"Phase 2","phaseStart":"2026-11-01","programName":"Phase 2 — Full Body (Dumbbells Only)","progressSeed":{"scans":[{"bmd":1.005,"bodyFatPct":34.0,"date":"2026-09-20","fatMassLb":39.4,"label":"Sep 20 — Baseline","leanMassLb":72.7,"visceralFatCm2":64.3,"weightLb":115.8},{"bmd":1.027,"bodyFatPct":32.5,"date":"2026-11-06","fatMassLb":38.0,"label":"Nov 6 — Latest","leanMassLb":75.1,"visceralFatCm2":59.2,"weightLb":116.9}],"sleepStepsSeed":{"asOf":"2026-11-06","sleepAvg7":"7h 14m","sleepLast":"6h 39m","stepsAvg7":7380,"stepsLast":10764},"strengthPins":[{"deltaLb":18,"name":"Dumbbell Goblet Squat","weightLb":35},{"deltaLb":33,"name":"Dumbbell Romanian Deadlift","weightLb":67},{"deltaLb":4,"name":"Seated Dumbbell Shoulder Press","weightLb":29}]},"version":1,"weeklyPattern":{"0":{"main":"prime-c","secondary":[]},"1":{"main":null,"secondary":[]},"2":{"main":"prime-a","secondary":["static-stretches"]},"3":{"main":null,"secondary":[]},"4":{"main":"prime-b","secondary":["static-stretches"]},"5":{"main":null,"secondary":["hiit-b"]},"6":{"main":null,"secondary":["static-stretches"]}},"workouts":{"hiit-b":{"blocks":[{"exercises":[{"name":"TBD — details coming","reps":"—","sets":1,"tbd":true}],"name":"Workout"}],"id":"hiit-b","name":"Full Body HIIT I B","phase":"Phase 2","placeholder":true,"placeholderNote":"Secondary workout. Exercise list not yet captured from the Kalos app.","shortName":"Full Body HIIT I B","type":"secondary"},"prime-a":{"blocks":[{"exercises":[{"name":"TBD — details coming","reps":"—","sets":1,"tbd":true},{"name":"TBD — details coming","reps":"—","sets":1,"tbd":true},{"name":"TBD — details coming","reps":"—","sets":1,"tbd":true},{"name":"TBD — details coming","reps":"—","sets":1,"tbd":true}],"name":"Warm-up"},{"exercises":[{"name":"TBD — details coming","reps":"—","sets":3,"tbd":true},{"name":"TBD — details coming","reps":"—","sets":3,"tbd":true},{"name":"TBD — details coming","reps":"—","sets":3,"tbd":true},{"name":"TBD — details coming","reps":"—","sets":3,"tbd":true},{"name":"TBD — details coming","reps":"—","sets":3,"tbd":true}],"name":"Main"},{"exercises":[{"name":"TBD — details coming","reps":"—","sets":2,"tbd":true},{"name":"TBD — details coming","reps":"—","sets":2,"tbd":true},{"name":"TBD — details coming","reps":"—","sets":2,"tbd":true}],"name":"Accessories"},{"exercises":[{"name":"TBD — details coming","reps":"0:30","sets":1,"tbd":true},{"name":"TBD — details coming","reps":"0:30","sets":1,"tbd":true},{"name":"TBD — details coming","reps":"0:30","sets":1,"tbd":true},{"name":"TBD — details coming","reps":"0:30","sets":1,"tbd":true}],"name":"Finishers"}],"id":"prime-a","name":"Prime I P2 I A (Full Body - Dumbbells Only)","phase":"Phase 2","placeholder":true,"placeholderNote":"Exercise list not yet captured from the Kalos app — structure mirrors Prime C until the real list is provided.","shortName":"Prime A","type":"main"},"prime-b":{"blocks":[{"exercises":[{"name":"TBD — details coming","reps":"—","sets":1,"tbd":true},{"name":"TBD — details coming","reps":"—","sets":1,"tbd":true},{"name":"TBD — details coming","reps":"—","sets":1,"tbd":true},{"name":"TBD — details coming","reps":"—","sets":1,"tbd":true}],"name":"Warm-up"},{"exercises":[{"name":"TBD — details coming","reps":"—","sets":3,"tbd":true},{"name":"TBD — details coming","reps":"—","sets":3,"tbd":true},{"name":"TBD — details coming","reps":"—","sets":3,"tbd":true},{"name":"TBD — details coming","reps":"—","sets":3,"tbd":true},{"name":"TBD — details coming","reps":"—","sets":3,"tbd":true}],"name":"Main"},{"exercises":[{"name":"TBD — details coming","reps":"—","sets":2,"tbd":true},{"name":"TBD — details coming","reps":"—","sets":2,"tbd":true},{"name":"TBD — details coming","reps":"—","sets":2,"tbd":true}],"name":"Accessories"},{"exercises":[{"name":"TBD — details coming","reps":"0:30","sets":1,"tbd":true},{"name":"TBD — details coming","reps":"0:30","sets":1,"tbd":true},{"name":"TBD — details coming","reps":"0:30","sets":1,"tbd":true},{"name":"TBD — details coming","reps":"0:30","sets":1,"tbd":true}],"name":"Finishers"}],"id":"prime-b","name":"Prime I P2 I B (Full Body - Dumbbells Only)","phase":"Phase 2","placeholder":true,"placeholderNote":"Exercise list not yet captured from the Kalos app — structure mirrors Prime C until the real list is provided.","shortName":"Prime B","type":"main"},"prime-c":{"blocks":[{"exercises":[{"name":"Cat Cow","reps":"10","sets":1},{"name":"Quadruped Thoracic Rotation","reps":"8","sets":1},{"name":"Foam Roller Hip Hinge","reps":"10","sets":1},{"name":"Bodyweight Glute Bridge","reps":"12","sets":1}],"name":"Warm-up"},{"exercises":[{"name":"Dumbbell Front Squat","reps":"8-10","sets":4},{"name":"Seated Dumbbell Shoulder Press","reps":"10","sets":3},{"name":"Dumbbell Romanian Deadlift","reps":"10","sets":3},{"name":"Prone Dumbbell Row (flat bench)","reps":"10","sets":3,"note":"Swapped 2026-11-08: Irena has a flat bench only. Lie face-down on the bench, feet on floor, row both dumbbells and squeeze shoulder blades. Same 3x10."},{"name":"Dumbbell Floor Press","reps":"12","sets":3}],"name":"Main"},{"exercises":[{"name":"Dumbbell Single-Arm Overhead","reps":"8-10","sets":2},{"name":"Dumbbell Hammer Curl","reps":"12","sets":2},{"name":"Plank Walkout","reps":"6","sets":2}],"name":"Accessories"},{"exercises":[{"name":"Child's Pose","reps":"0:30","sets":1},{"name":"Thread the Needle","reps":"0:30","sets":1},{"name":"Seated Floor Hamstring Stretch","reps":"0:30","sets":1},{"name":"Seated Pigeon Stretch","reps":"0:30","sets":1}],"name":"Finishers"}],"id":"prime-c","name":"Prime I P2 I C (Full Body - Dumbbells Only)","phase":"Phase 2","placeholder":false,"shortName":"Prime C","type":"main"},"static-stretches":{"blocks":[{"exercises":[{"name":"Shoulder CAR","reps":"0:30","sets":2},{"name":"Wall Chest Stretch","reps":"0:15","sets":4},{"name":"Dead Hang","reps":"0:30","sets":3},{"name":"Seated Single-Leg Hamstring Stretch","reps":"0:30","sets":2},{"name":"Hip Flexor Stretch","reps":"0:30","sets":2},{"name":"Butterfly Stretch","reps":"0:30","sets":1},{"name":"Standing Quad Stretch","reps":"0:30","sets":2},{"name":"Downward Dog to Cobra","reps":"3","sets":1},{"name":"Lying Knees to Chest Stretch","reps":"0:15","sets":2},{"name":"Wall Calf Stretch","reps":"0:30","sets":2}],"name":"Cool-down"}],"id":"static-stretches","name":"Static Stretches: Cool-Down Stretches","phase":"Phase 2","placeholder":false,"shortName":"Static Stretches","type":"secondary"}}};

  var PROGRAM = null;
  var state = null;
  var curatedDays = [];   // curated window: today-70d .. today+14d
  var planNotes = [];     // [{ date, text }] from curatePlan
  var lastTab = 'today';
  var openSession = null; // { date, workoutId }

  // ---------- state ----------

  function defaultState() {
    return { v: APP_VERSION, log: {}, sets: {}, meals: {}, sleepSteps: {} };
  }

  function loadState() {
    try {
      state = JSON.parse(localStorage.getItem(STATE_KEY) || 'null') || defaultState();
    } catch (e) { state = defaultState(); }
    if (!state.log) state = defaultState();
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
    curatedDays = out.days;
    planNotes = out.notes;
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
    if (isMain && dateISO < todayISO()) return '<span class="missed-x">✕</span>';
    return '';
  }

  function sessionCardHTML(day, wId, kind) {
    var w = workout(wId);
    if (!w) return '';
    var counts = workoutCounts(w);
    var pills = '';
    if (kind === 'secondary') pills += '<span class="pill optional">Secondary · optional</span> ';
    if (day.movedFrom && kind === 'main') {
      pills += '<span class="pill moved">Moved from ' + esc(C.prettyDate(day.movedFrom)) + '</span> ';
    }
    if (day.deload && kind === 'main') pills += '<span class="pill deload">Deload week</span> ';
    return '<div class="card session-card" data-open="' + esc(day.date) + '|' + esc(wId) + '">' +
      '<div class="row"><div>' +
      '<div class="wname">' + esc(w.name) + '</div>' +
      '<div class="wmeta">' + esc(w.phase || '') + ' · ' + counts.exercises + ' exercises · ' +
      counts.sets + ' sets</div>' + pills +
      '</div>' + statusMark(day.date, wId, kind === 'main') + '</div></div>';
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

  function showView(name) {
    ['today', 'schedule', 'progress', 'coach', 'workout'].forEach(function (v) {
      el('view-' + v).hidden = v !== name;
    });
    document.querySelectorAll('.tab').forEach(function (t) {
      t.classList.toggle('active', t.getAttribute('data-view') === name);
    });
    if (name !== 'workout') lastTab = name;
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
      if (day.main) cards += sessionCardHTML(day, day.main, 'main');
      (day.secondary || []).forEach(function (id) {
        cards += sessionCardHTML(day, id, 'secondary');
      });
      if (!cards) cards = restCardHTML();
      var outline = day.date === t ? ' today-outline' : '';
      // outline applies to the first card; wrap trick: add class via first card only
      cards = cards.replace('class="card session-card"', 'class="card session-card' + outline + '"')
                   .replace('class="rest-card"', 'class="rest-card' + outline + '"');
      html += '<div class="day-row"><div class="day-label">' + label + '</div>' +
              '<div class="grow">' + cards + notesHTML(day.date) + '</div></div>';
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
        var boxes = '';
        for (var s = 0; s < ex.sets; s++) {
          var on = state.sets[setKey(dateISO, wId, bi, ei, s)] ? ' on' : '';
          boxes += '<button class="set-box' + on + '" data-set="' +
                   bi + '|' + ei + '|' + s + '" aria-label="set ' + (s + 1) + '">✓</button>';
        }
        html += '<div class="ex-row"><div class="ex-info">' +
          '<div class="ex-name">' + esc(ex.name) + '</div>' +
          '<div class="ex-sets-label">' + ex.sets + ' × ' + esc(ex.reps) + '</div></div>' +
          '<div class="set-boxes">' + boxes + '</div></div>';
      });
    });
    el('workoutBlocks').innerHTML = html;
    renderCompleteBtn();
    showView('workout');
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
  }

  function bindEvents() {
    document.querySelectorAll('.tab').forEach(function (t) {
      t.addEventListener('click', function () {
        showView(t.getAttribute('data-view'));
      });
    });

    // Session cards (event delegation — cards are re-rendered often)
    document.addEventListener('click', function (e) {
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
        if (state.sets[key]) delete state.sets[key]; else state.sets[key] = true;
        saveState();
        box.classList.toggle('on');
      }
    });

    el('workoutBack').addEventListener('click', function () {
      renderAll();
      showView(lastTab);
    });
    el('completeBtn').addEventListener('click', function () {
      toggleComplete();
      renderAll();
    });

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
    });
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
