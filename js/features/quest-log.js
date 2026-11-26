import { $ } from '../core/env.js';
import { QUEST_LOG } from '../data/quest-log.js';

const el = (tag, props = {}, ...children) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
};

/** Quest log screen: a list of jobs on the left, the selected job's details on the right. */
export function initQuestLog() {
  const list = $('#log-list');
  const detail = $('#log-detail');
  const buttons = [];

  function select(i) {
    buttons.forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
    const job = QUEST_LOG[i];
    detail.replaceChildren(
      el('h3', { textContent: job.title }),
      el('div', { className: 'where', textContent: `${job.org} · ${job.where}` }),
      el('ul', {}, ...job.points.map((p) => el('li', { textContent: p }))),
    );
  }

  QUEST_LOG.forEach((job, i) => {
    const button = el('button', { type: 'button' }, el('b', { textContent: job.title }), el('span', { textContent: job.org }));
    button.addEventListener('click', () => select(i));
    buttons.push(button);
    list.append(el('li', {}, button));
  });
  select(0);
}
