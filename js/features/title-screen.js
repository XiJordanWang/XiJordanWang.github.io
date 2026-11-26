import { $, $$, reduceMotion, flash } from '../core/env.js';
import { createTitleScene } from './title-scene.js';

const SEEN_KEY = 'xjw-intro';
const Stage = { WAITING: 0, PRESSED: 1, MENU: 2, LEAVING: 3 };

/**
 * Game-style title screen: "Press Start", then a New Game / Continue / Load Save menu.
 * Opens on a first visit (see js/intro-gate.js), on #title, or from the Title Screen button.
 */
export function initTitleScreen(router) {
  const root = document.documentElement;
  const screen = $('#title');
  const game = $('.game');
  const start = $('#t-start');
  const menu = $('#t-menu');
  const hint = $('#t-hint');
  const items = $$('button', menu);
  const scene = createTitleScene({ back: $('#t-back'), front: $('#t-front') });
  let stage = Stage.WAITING;
  let selected = 0;

  // split the name into letters so they can drop in one by one
  const name = $('.t-name', screen);
  name.replaceChildren(...[...name.textContent].map((ch, i) => {
    const span = document.createElement('span');
    span.setAttribute('aria-hidden', 'true');
    span.style.setProperty('--i', i);
    span.textContent = ch === ' ' ? ' ' : ch;
    return span;
  }));

  function open() {
    stage = Stage.WAITING;
    screen.classList.remove('out');
    start.hidden = false;
    start.classList.remove('hit');
    menu.hidden = true;
    items.forEach((b) => b.classList.remove('chosen'));
    hint.textContent = 'Press Enter or tap · Esc to skip';
    root.classList.add('intro');
    game.inert = true;
    scene.start();
    start.focus({ preventScroll: true });
  }

  function highlight(i) {
    selected = (i + items.length) % items.length;
    items.forEach((b, k) => b.setAttribute('aria-current', String(k === selected)));
    items[selected].focus({ preventScroll: true });
    hint.textContent = `${items[selected].dataset.note} · ↑ ↓ Enter`;
  }

  function pressStart() {
    if (stage !== Stage.WAITING) return;
    stage = Stage.PRESSED;
    start.classList.add('hit');
    setTimeout(() => {
      start.hidden = true;
      menu.hidden = false;
      highlight(0);
      stage = Stage.MENU;
    }, reduceMotion ? 0 : 650);
  }

  function choose(action) {
    if (stage === Stage.LEAVING) return;
    stage = Stage.LEAVING;
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* storage blocked: the intro shows again next time */ }
    if (action === 'pdf') window.open('cv.pdf', '_blank', 'noopener');
    items[selected]?.classList.add('chosen');
    setTimeout(() => {
      flash();
      screen.classList.add('out');
      root.classList.remove('intro');
      game.inert = false;
      if (action === 'projects') location.hash = 'projects';
      else router.go('profile');
      setTimeout(() => scene.stop(), reduceMotion ? 0 : 750);
    }, reduceMotion ? 0 : 380);
  }

  start.addEventListener('click', (e) => { e.stopPropagation(); pressStart(); });
  screen.addEventListener('click', () => { if (stage === Stage.WAITING) pressStart(); });
  items.forEach((b, k) => {
    b.addEventListener('mouseenter', () => { if (stage === Stage.MENU) highlight(k); });
    b.addEventListener('click', (e) => { e.stopPropagation(); highlight(k); choose(b.dataset.t); });
  });

  addEventListener('keydown', (e) => {
    if (stage === Stage.LEAVING || !root.classList.contains('intro')) return;
    const key = e.key;
    if (key === 'Escape') { e.preventDefault(); choose('profile'); return; }
    if (stage === Stage.WAITING && (key === 'Enter' || key === ' ')) { e.preventDefault(); pressStart(); return; }
    if (stage !== Stage.MENU) return;
    if (key === 'ArrowDown') { e.preventDefault(); highlight(selected + 1); }
    else if (key === 'ArrowUp') { e.preventDefault(); highlight(selected - 1); }
    else if (key === 'Enter' || key === ' ') { e.preventDefault(); choose(items[selected].dataset.t); }
  });

  $('#to-title').addEventListener('click', open);
  router.route('title', open);

  const shouldOpen = root.classList.contains('intro') || (typeof window.xjwIntro === 'function' && window.xjwIntro());
  if (shouldOpen) open();
  else stage = Stage.LEAVING; // inactive until opened
}
