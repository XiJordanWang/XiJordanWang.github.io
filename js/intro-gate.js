/**
 * Runs before first paint (classic, blocking script in <head>).
 * Decides whether the title screen covers the page, so the main menu never
 * flashes before the intro. The decision is exposed for js/main.js.
 *
 * Shown when the address is #title, or on a first visit this browser session
 * that does not deep-link to a section (#projects and so on).
 */
(function () {
  var SECTIONS = ['#profile', '#projects', '#experience', '#skills', '#education', '#contact'];
  function shouldShowIntro() {
    var hash = location.hash;
    if (hash === '#title') return true;
    if (SECTIONS.indexOf(hash) > -1) return false;
    try { return !sessionStorage.getItem('xjw-intro'); } catch (e) { return true; }
  }
  window.xjwIntro = shouldShowIntro;
  if (shouldShowIntro()) document.documentElement.classList.add('intro');
})();
