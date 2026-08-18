# Pagan Events — front-end prototype

Redesign prototype for [pagan-events.org.uk](https://www.pagan-events.org.uk).
Hand-written HTML, CSS and a small amount of JavaScript. No framework, no build
step, no WordPress. Intended to be dropped into the existing PHP templates.

## Files

| File | What it is |
|---|---|
| `index.html` | Home page, with the genuine next-ten-days listing (one event this week) |
| `home-busy-example.html` | The same page with a busier list, to show how the grid fills out |
| `home-empty-example.html` | The same page with nothing on, to show the empty state |
| `contact.html` | Contact page, rebuilt |
| `contact-sent.html` | The confirmation page shown after a message is sent |
| `assets/css/pagan.css` | The whole stylesheet — design tokens at the top |
| `assets/js/pagan.js` | Mobile menu, character counter, Back button. Progressive enhancement only |
| `TEMPLATE-NOTES.txt` | **Read this** — where the PHP goes, and what changed on the contact page and why |

## Viewing it

No server needed. Open `index.html` in a browser, or:

```
python3 -m http.server 8000
```

## Notes

- Responsive from 320px upwards. Checked for horizontal overflow at 320, 390,
  768, 1024, 1280 and 1920px — none at any width.
- The contact form acknowledges instantly: the button becomes "Sending your
  message…" on press, a repeated press is ignored, and the server then
  redirects to `contact-sent.html`. Verified end to end against a real POST.
- Works with JavaScript switched off: all navigation links stay visible on a
  phone and the contact form still submits.
- Follows the visitor's light/dark system setting. Easily removed — see
  `TEMPLATE-NOTES.txt` section 8.
- The decorative face is the site's existing Achafexp, restricted to large
  headings where it is legible.
