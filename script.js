    // Simple persistence key
    var KEY = 'code_to_escape_unlocked_v1';

    // Grab elements
    var gate = document.getElementById('gate');
    var unit = document.getElementById('unit');
    var unlockBtn = document.getElementById('unlockBtn');
    var resetBtn = document.getElementById('resetBtn');
    var p1 = document.getElementById('p1');
    var p2 = document.getElementById('p2');
    var p1Status = document.getElementById('p1Status');
    var p2Status = document.getElementById('p2Status');
    var openBtn = document.getElementById('openBtn');
    var finalStatus = document.getElementById('finalStatus');
    var topTabs = document.getElementById('topTabs');

    // ---- DUE DATE "VARIABLES" ----
    var dueDates = {
      A3date: 'December 05',
      A4date: 'December 12',
      B1date: 'January 20',
      B2date: 'January 26',
      B3date: 'February 01',
      C1date: 'February 03',
      C2date: 'March 22',
      C3date: 'March 22',
      C4date: 'March 27',
      finalDueDate: 'Sunday, March 29, 21:00'
    };

    function applyDueDates() {
      for (var key in dueDates) {
        if (!dueDates.hasOwnProperty(key)) continue;
        var value = dueDates[key];
        var nodes = document.querySelectorAll('[data-date="' + key + '"]');
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].textContent = value;
        }
      }
    }

    // Close the "Task Sheet" <details> when a link inside it is clicked
    var taskDetails = topTabs ? topTabs.querySelector('details') : null;
    if (taskDetails) {
      var taskLinks = taskDetails.querySelectorAll('a[href^="#/"]');
      for (var i = 0; i < taskLinks.length; i++) {
        taskLinks[i].addEventListener('click', function () {
          taskDetails.open = false;
        });
      }
    }


    function clean(str) {
      if (!str) return '';
      return str.replace(/^\s+|\s+$/g, '').toLowerCase();
    }

    function isUnlocked() {
      try {
        var v = JSON.parse(localStorage.getItem(KEY) || 'null');
        return v && v.v === 1;
      } catch (e) {
        return false;
      }
    }

    function setUnlocked(yes) {
      try {
        if (yes) {
          localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), v: 1 }));
        } else {
          localStorage.removeItem(KEY);
        }
      } catch (e) { }
      reflect();
    }

    function reflect() {
      var unlocked = isUnlocked();

      if (gate) {
        if (unlocked) gate.classList.add('hidden');
        else gate.classList.remove('hidden');
      }
      if (unit) {
        if (unlocked) unit.classList.remove('hidden');
        else unit.classList.add('hidden');
        unit.setAttribute('aria-hidden', unlocked ? 'false' : 'true');
      }
      if (unlockBtn) {
        unlockBtn.textContent = unlocked ? 'Unit is Unlocked' : 'Go to Unit';
        unlockBtn.disabled = !unlocked;
      }
      if (topTabs) {
        topTabs.style.display = unlocked ? 'flex' : 'none';
      }
    }

    function checkPuzzles() {
      var ok1 = clean(p1 && p1.value) === 'compassion';
      var ok2 = clean(p2 && p2.value) === 'gemini';

      if (p1Status) {
        p1Status.textContent = ok1 ? 'correct' : 'pending';
        p1Status.style.background = ok1 ? 'rgba(52,211,153,.15)' : '';
        p1Status.style.color = ok1 ? 'var(--ok)' : '';
      }
      if (p2Status) {
        p2Status.textContent = ok2 ? 'correct' : 'pending';
        p2Status.style.background = ok2 ? 'rgba(52,211,153,.15)' : '';
        p2Status.style.color = ok2 ? 'var(--ok)' : '';
      }
      if (openBtn) {
        openBtn.disabled = !(ok1 && ok2);
      }
      if (finalStatus) {
        finalStatus.textContent = (ok1 && ok2) ? 'ready' : 'locked';
      }
    }

    function route() {
      var hash = window.location.hash || '';
      var ids = ['homePage', 'pageA', 'pageB', 'pageC'];

      // hide all pages
      for (var i = 0; i < ids.length; i++) {
        var el = document.getElementById(ids[i]);
        if (el) el.classList.add('hidden');
      }

      // determine which page to show
      if (hash.indexOf('#/a') === 0) {
        document.body.classList.add('task-page');   // <-- ADD THIS
        document.getElementById('pageA').classList.remove('hidden');

      } else if (hash.indexOf('#/b') === 0) {
        document.body.classList.add('task-page');   // <-- ADD THIS
        document.getElementById('pageB').classList.remove('hidden');

      } else if (hash.indexOf('#/c') === 0) {
        document.body.classList.add('task-page');   // <-- ADD THIS
        document.getElementById('pageC').classList.remove('hidden');

      } else {
        document.body.classList.remove('task-page'); // <-- AND THIS
        document.getElementById('homePage').classList.remove('hidden');
      }
    }


    // Wire up events
    if (p1) {
      p1.addEventListener('input', checkPuzzles);
      p1.addEventListener('keyup', checkPuzzles);
    }
    if (p2) {
      p2.addEventListener('input', checkPuzzles);
      p2.addEventListener('keyup', checkPuzzles);
    }

    if (openBtn) {
      openBtn.addEventListener('click', function () {
        if (!openBtn.disabled) {
          setUnlocked(true);
          if (unit && unit.scrollIntoView) {
            unit.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    }

    if (unlockBtn) {
      unlockBtn.addEventListener('click', function () {
        if (isUnlocked()) {
          if (unit && unit.scrollIntoView) {
            unit.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          if (gate && gate.scrollIntoView) {
            gate.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (confirm('Reset access on this browser?')) {
          setUnlocked(false);
        }
      });
    }

    // NOTE: starter template download JS removed for now to avoid parsing issues.
    // We can re-add it later once this core flow is 100% solid.

    // Init
    // Init
    applyDueDates();
    reflect();
    checkPuzzles();
    route();
    window.addEventListener('hashchange', route);