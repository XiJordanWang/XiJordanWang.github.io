import { $$ } from '../core/env.js';
import { initTelemetryDemo } from './telemetry-demo.js';
import { initAssistantDemo } from './assistant-demo.js';

const TELEMETRY_QUEST = 0;

/** Quests (projects) screen: a list of projects, one detail card shown at a time. */
export function initQuests(router) {
  const buttons = $$('#qlist button');
  const cards = $$('.quests > article');
  let selected = TELEMETRY_QUEST;

  const telemetry = initTelemetryDemo({
    isVisible: () => router.current === 'projects' && selected === TELEMETRY_QUEST,
  });
  initAssistantDemo();

  function select(i) {
    selected = i;
    buttons.forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
    cards.forEach((c, k) => { c.hidden = k !== i; });
    if (i === TELEMETRY_QUEST) requestAnimationFrame(telemetry.draw);
  }

  buttons.forEach((b) => b.addEventListener('click', () => select(Number(b.dataset.q))));
  router.onChange((screen) => { if (screen === 'projects') requestAnimationFrame(telemetry.draw); });
  select(TELEMETRY_QUEST);
}
