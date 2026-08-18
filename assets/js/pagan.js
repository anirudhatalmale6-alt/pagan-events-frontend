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

  /* ------------------------------------------------------------------
     Immediate acknowledgement when a form is sent.

     The instant the visitor presses Send, the button changes to
     "Sending your message…" with a spinner, and a second press is ignored.
     That happens straight away, before the server has been anywhere near it,
     so there is never a moment where the visitor is left wondering whether
     the click registered. The server then redirects to the confirmation
     page, which is the acknowledgement that the message really did arrive.

     NOTE — the button is deliberately NOT disabled:

       - Disabling it in the submit handler can drop the button's own
         name/value from the POST in some browsers, and the PHP side is
         looking for submitForm. A flag guards double submission instead.
       - If the visitor uses the browser Back button afterwards, some
         browsers restore the page from cache exactly as it was left. A
         disabled button would still be disabled, stranding them. The
         pageshow handler below resets the button for exactly that case.

     With JavaScript off, none of this runs and the form submits normally.
     ------------------------------------------------------------------ */
  function initSubmitOnce() {
    var forms = document.querySelectorAll('[data-submit-once]');

    Array.prototype.forEach.call(forms, function (form) {
      var button = form.querySelector('button[type="submit"]');
      if (!button) return;

      var label   = button.querySelector('.btn__label') || button;
      var status  = form.querySelector('[data-submit-status]');
      var resting = label.textContent;
      var sending = button.getAttribute('data-sending') || 'Sending…';
      var busy    = false;

      form.addEventListener('submit', function (e) {
        // Second and subsequent presses: stop them dead.
        if (busy) {
          e.preventDefault();
          return;
        }

        // Let the browser's own required/type checks fail first — if the
        // form is not valid it is not going anywhere, so it must not look
        // as though it has been sent.
        if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
          return;
        }

        busy = true;
        button.setAttribute('aria-busy', 'true');
        button.classList.add('is-sending');
        label.textContent = sending;
        if (status) status.textContent = sending;
      });

      // Restoring from the back/forward cache hands back the page exactly as
      // it was left — mid-send. Put it back to rest.
      window.addEventListener('pageshow', function (e) {
        if (!e.persisted && !busy) return;
        busy = false;
        button.removeAttribute('aria-busy');
        button.classList.remove('is-sending');
        label.textContent = resting;
        if (status) status.textContent = '';
      });
    });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    initNav();
    initCounters();
    initBack();
    initSubmitOnce();
  });
}());
