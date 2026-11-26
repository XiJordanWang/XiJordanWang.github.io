import { $ } from '../core/env.js';

/**
 * Message screen form. Set FORM_ENDPOINT to a Formspree (or similar) URL to
 * deliver messages; until then the form explains how to get in touch instead.
 */
const FORM_ENDPOINT = '';

export function initContactForm() {
  const form = $('#msg-form');
  const note = $('#f-note');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { note.textContent = 'Please fill in your name, a valid email and a message.'; return; }
    if (!FORM_ENDPOINT) { note.textContent = 'The form is not connected yet. Please reach out on LinkedIn for now.'; return; }

    note.textContent = 'Sending…';
    try {
      const res = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      note.textContent = 'Message sent. Jordan will reply by email.';
    } catch {
      note.textContent = 'That did not send. Please try again, or use LinkedIn.';
    }
  });
}
