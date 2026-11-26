/**
 * Entry point. Wires up each feature, then shows the screen for the current address.
 * Order matters: features subscribe to the router before router.start() runs.
 */
import { $ } from './core/env.js';
import { createRouter } from './core/router.js';
import { initStarfield } from './features/starfield.js';
import { initStatus } from './features/status.js';
import { initQuests } from './features/quests.js';
import { initQuestLog } from './features/quest-log.js';
import { initContactForm } from './features/contact-form.js';
import { initTitleScreen } from './features/title-screen.js';
import { initKeyboardNav } from './features/keyboard-nav.js';

initStarfield($('#stars'));

const router = createRouter({ fallback: 'profile' });
initStatus(router);
initQuests(router);
initQuestLog();
initContactForm();
initTitleScreen(router);
initKeyboardNav(router);

router.start();
