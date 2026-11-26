import { $, $$ } from './env.js';

/**
 * Hash router for the menu screens (#profile, #projects, ...).
 * Each screen is a <section class="screen" id="s-{name}" data-help="...">.
 * Special routes (such as #title) run a handler instead of switching screens.
 */
export function createRouter({ fallback = 'profile' } = {}) {
  const help = $('#help');
  const menuButtons = $$('.cmd button');
  const listeners = new Set();
  const special = new Map();
  let current = null;

  const screenHelp = (name) => document.getElementById(`s-${name}`)?.dataset.help ?? '';
  const setHelp = (text) => { help.textContent = text; };

  function go(name) {
    if (!document.getElementById(`s-${name}`)) name = fallback;
    $$('.screen').forEach((s) => { s.hidden = s.id !== `s-${name}`; });
    document.body.dataset.screen = name;
    menuButtons.forEach((b) => b.setAttribute('aria-current', String(b.dataset.go === name)));
    setHelp(screenHelp(name));
    current = name;
    listeners.forEach((fn) => fn(name));
  }

  function fromHash() {
    const name = location.hash.slice(1);
    if (special.has(name)) special.get(name)();
    else go(name || fallback);
  }

  menuButtons.forEach((b) => b.addEventListener('click', () => {
    if (location.hash === `#${b.dataset.go}`) go(b.dataset.go);
    else location.hash = b.dataset.go; // the hashchange listener calls go()
  }));
  addEventListener('hashchange', fromHash);

  return {
    go,
    setHelp,
    screenHelp,
    get current() { return current; },
    /** Subscribe to screen changes. Returns an unsubscribe function. */
    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    /** Run a handler for #name instead of switching screens. */
    route(name, handler) { special.set(name, handler); },
    /** Show the screen for the current address. Call once everything is wired up. */
    start() {
      const name = location.hash.slice(1);
      go(!name || special.has(name) ? fallback : name);
    },
  };
}
