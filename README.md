# xijordanwang.github.io

The online CV of Xi (Jordan) Wang, AI & Software Engineer, built as a retro RPG main menu.

**Live site:** https://xijordanwang.github.io

## What's inside

- **Title screen:** Press Start, then a New Game / Continue / Load Save menu, over a pixel-art key visual with falling feathers. It plays once per browser session. Links such as `#projects` skip it, and `#title` replays it.
- **Status:** profile, live MSc progress bar, highlight skills, and a LIMIT gauge with a coding animation.
- **Quests:** portfolio projects, with two in-browser demos:
  - a telemetry stream with rolling z-score anomaly detection;
  - an asset assistant showing a RAG and agent trace.
- **Quest log, Skills, Training, Message:** experience, skills, education and contact.

All demo data is fictional.

## Tech

Plain HTML, CSS and JavaScript (ES modules). There are no frameworks, build step or dependencies, apart from Google Fonts. It is hosted on GitHub Pages.

Accessibility:
- Full keyboard control, game style: ↑ ↓ to move the menu cursor, Enter to open, → to step into a list, ← or Esc to step back, 1–6 to jump to a screen.
- `prefers-reduced-motion` replaces the animations with still images.
- The layout fits a laptop screen without page scrolling, and stacks on phones.

## Project structure

```
index.html              markup for every screen
cv.pdf                  downloadable CV
css/
  base.css              design tokens, page base, window frame
  components.css        party card, menu, screens, projects, quest log, skills, contact
  layout.css            compact sizing for laptop windows
  theme.css             handheld RPG menu theme and one-screen fit rules
  status.css            Status screen motion and the limit-break overlay
  menu.css              main-menu skin: backdrop, glass windows, highlight bars, key hints
  title.css             title screen (key visual, menu)
js/
  intro-gate.js         runs before paint: decides whether to show the title screen
  main.js               entry point, wires up every feature
  core/
    env.js              shared helpers (reduced motion, DOM, flash)
    router.js           hash router for the menu screens
  data/                 content: work history, assistant Q&A, MSc dates
  features/             one module per feature (status, quests, demos, title screen...)
assets/img/             avatar, title hero, coding animations
```

## Run locally

ES modules don't load from `file://`, so serve the folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Editing content

- Work history: `js/data/quest-log.js`
- Assistant demo questions: `js/data/assistant-qa.js`
- MSc dates for the EXP bar: `js/data/profile.js`
- Profile text, projects and skills: `index.html`
- Contact form: set `FORM_ENDPOINT` in `js/features/contact-form.js` to a Formspree URL to receive messages.

© 2026 Xi (Jordan) Wang. Hosted on GitHub Pages.
