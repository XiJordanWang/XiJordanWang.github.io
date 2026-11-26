import { $, $$, reduceMotion, flash, replayClass } from '../core/env.js';
import { mscProgress } from '../data/profile.js';

const LIMIT_TICK_MS = 100;
const LIMIT_STEP = 1.25; // % per tick, so the gauge fills in about 8 seconds
const OVERLAY_MS = 11200; // two loops of the coding animation
const IMG = 'assets/img/';

/**
 * Status screen behaviour:
 *  - windows unfold when a screen opens, the EXP bar counts up to MSc progress
 *  - the LIMIT gauge under the portrait charges; selecting the portrait plays the "limit break" overlay
 */
export function initStatus(router) {
  const party = $('.party');
  const expBar = $('#msc-bar');
  const expText = $('#msc-txt');
  const limitBtn = $('#limit-btn');
  const limitFill = $('#limit-fill');
  const overlay = $('#lb');
  const overlayImg = $('#lb-img');
  const pct = mscProgress();
  let limit = reduceMotion ? 100 : 0;
  let overlayTimer = 0;
  let expRaf = 0;
  let firstScreen = true;

  // static values first, so the page is right even before any animation runs
  setExp(pct);
  $$('.p-right dt').forEach((d, k) => d.style.setProperty('--k', k));

  function setExp(v) {
    expBar.style.width = `${v.toFixed(1)}%`;
    expText.textContent = `MSc ${Math.round(v)}%`;
  }

  function fillExp() {
    cancelAnimationFrame(expRaf);
    if (reduceMotion) return setExp(pct);
    const t0 = performance.now(), DELAY = 250, DURATION = 900;
    const step = (t) => {
      const k = Math.min(1, (t - t0 - DELAY) / DURATION);
      const eased = k < 0 ? 0 : 1 - (1 - k) ** 3;
      setExp(pct * eased);
      if (k < 1) expRaf = requestAnimationFrame(step);
    };
    expRaf = requestAnimationFrame(step);
  }

  function setLimit(v) {
    limit = Math.min(100, v);
    limitFill.style.width = `${limit}%`;
    limitBtn.classList.toggle('ready', limit >= 100);
    if (limit >= 100 && router.current === 'profile') router.setHelp('LIMIT ready: select the portrait to unleash it.');
  }

  function openOverlay() {
    if (!overlayImg.getAttribute('src')) {
      overlayImg.src = IMG + (reduceMotion ? 'coding-avatar-front-still.png' : 'coding-avatar-front.gif');
    }
    flash();
    overlay.hidden = false;
    overlay.tabIndex = -1;
    overlay.focus();
    clearTimeout(overlayTimer);
    if (!reduceMotion) overlayTimer = setTimeout(closeOverlay, OVERLAY_MS);
  }

  function closeOverlay() {
    if (overlay.hidden) return;
    overlay.hidden = true;
    clearTimeout(overlayTimer);
    setLimit(reduceMotion ? 100 : 0);
    router.setHelp(router.screenHelp('profile'));
    limitBtn.focus({ preventScroll: true });
  }

  function animateScreen(name) {
    const screen = document.getElementById(`s-${name}`);
    let delay = 0;
    if (name === 'profile') { replayClass(party, 'pop'); delay = 90; fillExp(); }
    $$(':scope > .win, :scope > div > .win', screen).forEach((w, i) => replayClass(w, 'pop', delay + i * 90));
    if (!reduceMotion) { screen.classList.remove('go'); void screen.offsetWidth; screen.classList.add('go'); }
    if (firstScreen) {
      $$('.side > .win').forEach((w, i) => replayClass(w, 'pop', 60 + i * 90));
      firstScreen = false;
    }
    if (name === 'profile' && limit >= 100) setLimit(limit); // restore the "ready" help text
  }

  setLimit(limit);
  setInterval(() => {
    if (router.current === 'profile' && overlay.hidden && limit < 100 && !document.hidden) setLimit(limit + LIMIT_STEP);
  }, LIMIT_TICK_MS);

  limitBtn.addEventListener('click', openOverlay);
  overlay.addEventListener('click', closeOverlay);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeOverlay(); });
  router.onChange(animateScreen);
}
