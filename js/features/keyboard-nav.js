import { $, $$ } from '../core/env.js';

/**
 * Game-style keyboard control for the main menu.
 *
 *   ↑ / ↓        move the menu cursor (or move inside a list once you are in one)
 *   Enter/Space  open the screen under the cursor
 *   →            step into the open screen's list (Quests, Quest log)
 *   ← / Esc      step back out to the menu
 *   1–6          jump straight to a screen
 *
 * Lists that take part are marked with [data-keynav] in the HTML.
 * Keys are ignored while typing in a form field or while an overlay is open.
 */
export function initKeyboardNav(router) {
  const items = $$('.cmd button');
  const overlay = $('#lb');
  let cursor = 0;

  const indexOf = (screen) => Math.max(0, items.findIndex((b) => b.dataset.go === screen));

  function setCursor(i, { focus = false, announce = false } = {}) {
    cursor = (i + items.length) % items.length;
    items.forEach((b, k) => b.classList.toggle('cursor', k === cursor));
    if (focus) items[cursor].focus({ preventScroll: true });
    if (announce) {
      const target = items[cursor].dataset.go;
      router.setHelp(target === router.current ? router.screenHelp(target) : `${router.screenHelp(target)} (Enter to open)`);
    }
  }

  function openCursor() {
    const target = items[cursor].dataset.go;
    if (target === router.current) router.go(target);
    else location.hash = target;
  }

  /** The keynav list in the open screen, if any. */
  const currentList = () => $(`#s-${router.current} [data-keynav]`);

  function moveInList(list, step) {
    const buttons = $$('button', list);
    const at = buttons.indexOf(document.activeElement);
    const next = buttons[(at + step + buttons.length) % buttons.length];
    next.focus({ preventScroll: true });
    next.click();
    next.scrollIntoView({ block: 'nearest' });
  }

  function enterList() {
    const list = currentList();
    if (!list) return false;
    const buttons = $$('button', list);
    const start = buttons.find((b) => b.getAttribute('aria-current') === 'true') ?? buttons[0];
    start?.focus({ preventScroll: true });
    return Boolean(start);
  }

  const typing = (el) => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  const blocked = () => document.documentElement.classList.contains('intro') || (overlay && !overlay.hidden);

  addEventListener('keydown', (e) => {
    if (blocked() || typing(document.activeElement) || e.altKey || e.ctrlKey || e.metaKey) return;
    const inList = document.activeElement?.closest?.('[data-keynav]');
    const key = e.key;

    if (key === 'ArrowDown' || key === 'ArrowUp') {
      e.preventDefault();
      const step = key === 'ArrowDown' ? 1 : -1;
      if (inList) moveInList(inList, step);
      else setCursor(cursor + step, { focus: true, announce: true });
    } else if (key === 'ArrowRight') {
      if (!inList && enterList()) e.preventDefault();
    } else if (key === 'ArrowLeft' || key === 'Escape') {
      if (inList) { e.preventDefault(); setCursor(cursor, { focus: true }); }
    } else if ((key === 'Enter' || key === ' ') && !inList && !document.activeElement?.matches('button, a, summary')) {
      e.preventDefault();
      openCursor();
    } else if (/^[1-9]$/.test(key) && Number(key) <= items.length) {
      e.preventDefault();
      setCursor(Number(key) - 1, { focus: true });
      openCursor();
    }
  });

  items.forEach((b, k) => {
    b.addEventListener('mouseenter', () => setCursor(k));
    b.addEventListener('focus', () => setCursor(k));
  });

  // the cursor follows the open screen
  router.onChange((screen) => setCursor(indexOf(screen)));
}
