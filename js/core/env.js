/** Shared environment helpers. */

/** True when the visitor asked the OS for less motion. Read once at start-up. */
export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Reads a CSS custom property from :root, e.g. cssVar('--hp'). */
export const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** A full-screen white flash used for transitions. Does nothing under reduced motion. */
export function flash() {
  if (reduceMotion) return;
  const el = document.createElement('div');
  el.className = 'flash';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 500);
}

/** Restarts a CSS animation class on an element, with an optional delay in ms. */
export function replayClass(el, cls, delay = 0) {
  if (reduceMotion || !el) return;
  el.classList.remove(cls);
  void el.offsetWidth; // force a reflow so the animation starts again
  el.style.animationDelay = `${delay}ms`;
  el.classList.add(cls);
}
