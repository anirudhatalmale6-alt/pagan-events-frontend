/* ==========================================================================
   Pagan Events — progressive enhancement only.
   Every page works with this file removed or with JavaScript switched off.
   No libraries, no build step.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Mobile navigation.
     The markup ships open-by-default so a no-JS visitor still sees every
     link; this script is what collapses it and adds the toggle behaviour.
     ------------------------------------------------------------------ */
  function initNav() {
    var nav = document.querySelector('[data-nav]');
    if (!nav) return;

    var toggle = nav.querySelector('[data-nav-toggle]');
    if (!toggle) return;

    toggle.hidden = false;
    nav.setAttribute('data-open', 'false');
    toggle.setAttribute('aria-expanded', 'false');

    function setOpen(open) {
      nav.setAttribute('data-open', open ? 'true' : 'false');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Escape closes it and returns focus to the button.
    nav.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    // Following a link on a phone should not leave the panel hanging open.
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    // Crossing into the desktop layout: drop the collapsed state entirely.
    if (window.matchMedia) {
      var wide = window.matchMedia('(min-width: 820px)');
      var sync = function (mq) { if (mq.matches) setOpen(false); };
      if (wide.addEventListener) wide.addEventListener('change', sync);
      else if (wide.addListener) wide.addListener(sync);
    }
  }

  /* ------------------------------------------------------------------
     Character counter for length-limited textareas.
     Reads the real maxlength attribute, so the browser is still the one
     enforcing the limit — this only tells the visitor where they are.
     ------------------------------------------------------------------ */
  function initCounters() {
    var fields = document.querySelectorAll('[data-counter]');

    Array.prototype.forEach.call(fields, function (field) {
      var max = parseInt(field.getAttribute('maxlength'), 10);
      if (!max) return;

      var out = document.getElementById(field.getAttribute('data-counter'));
      if (!out) return;

      var update = function () {
        var used = field.value.length;
        var left = max - used;
        out.textContent = left + ' characters remaining';
        out.setAttribute('data-state', left <= 0 ? 'over' : (left < max * 0.1 ? 'warn' : 'ok'));
      };

      update();
      field.addEventListener('input', update);
    });
  }

  /* ------------------------------------------------------------------
     Back button.
     Falls back to a normal link when there is no history to go back to
     (someone arriving straight from a search engine, for instance).
     ------------------------------------------------------------------ */
  function initBack() {
    var back = document.querySelector('[data-back]');
    if (!back) return;

    if (window.history.length > 1) {
      back.addEventListener('click', function (e) {
        e.preventDefault();
        window.history.back();
      });
    }
    // No history: the href in the markup already points at the home page,
    // so doing nothing here is the correct behaviour.
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    initNav();
    initCounters();
    initBack();
  });
}());
