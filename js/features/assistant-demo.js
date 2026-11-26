import { $ } from '../core/env.js';
import { ASSISTANT_QA } from '../data/assistant-qa.js';

/** Asset assistant demo: pick a question, see the agent trace, answer and sources. */
export function initAssistantDemo() {
  const questions = $('#qs');
  const answer = $('#ans');

  function show(i) {
    [...questions.children].forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    const qa = ASSISTANT_QA[i];
    const trace = document.createElement('ul');
    trace.className = 'trace';
    trace.append(...qa.trace.map((s) => Object.assign(document.createElement('li'), { textContent: s })));
    const reply = Object.assign(document.createElement('p'), { className: 'ans', innerHTML: qa.answer }); // trusted, from data file
    const cites = Object.assign(document.createElement('div'), { className: 'cites', textContent: `src: ${qa.sources}` });
    answer.replaceChildren(trace, reply, cites);
  }

  ASSISTANT_QA.forEach((qa, i) => {
    const b = Object.assign(document.createElement('button'), { type: 'button', textContent: qa.question });
    b.addEventListener('click', () => show(i));
    questions.append(b);
  });
  show(0);
}
