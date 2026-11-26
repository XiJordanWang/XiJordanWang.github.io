import { $, cssVar } from '../core/env.js';

const POINTS = 110; // samples visible on the chart
const WINDOW = 30; // rolling window for the z-score
const THRESHOLD = 3; // z-score that counts as an anomaly
const TICK_MS = 260;

/**
 * Simulated coolant-temperature stream with rolling z-score anomaly detection.
 * Returns draw(), which the caller runs when the chart becomes visible.
 */
export function initTelemetryDemo({ isVisible }) {
  const canvas = $('#tele');
  const ctx = canvas.getContext('2d');
  const out = { now: $('#t-now'), z: $('#t-z'), count: $('#t-n'), events: $('#t-ev') };
  const data = [];
  const flags = [];
  let base = 88, t = 0, spike = 0, alerts = 0;

  function nextSample() {
    t++;
    base += (88 - base) * 0.05 + (Math.random() - 0.5) * 0.9;
    if (!spike && Math.random() < 0.025) spike = 4 + Math.floor(Math.random() * 4);
    let v = base + Math.sin(t / 9) * 1.2;
    if (spike) { v += 7 + Math.random() * 5; spike--; }
    return v;
  }

  function zScore(i) {
    const w = data.slice(Math.max(0, i - WINDOW), i);
    if (w.length < 10) return 0;
    const mean = w.reduce((a, b) => a + b, 0) / w.length;
    const sd = Math.sqrt(w.reduce((a, b) => a + (b - mean) ** 2, 0) / w.length) || 1;
    return (data[i] - mean) / sd;
  }

  function step() {
    data.push(nextSample());
    if (data.length > POINTS) { data.shift(); flags.shift(); }
    const i = data.length - 1;
    const z = zScore(i);
    const hit = z > THRESHOLD;
    flags.push(hit);
    if (hit) {
      alerts++;
      out.events.textContent = `! ALERT coolant ${data[i].toFixed(1)}°C  z=${z.toFixed(1)}`;
    }
    out.now.textContent = data[i].toFixed(1);
    out.z.textContent = z.toFixed(2);
    out.count.textContent = alerts;
  }

  function draw() {
    const dpr = devicePixelRatio || 1, w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w) return;
    if (canvas.width !== w * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const y = (v) => h - 10 - ((Math.min(104, Math.max(80, v)) - 80) / 24) * (h - 20);

    ctx.strokeStyle = 'rgba(185,196,242,.25)';
    ctx.fillStyle = '#B9C4F2';
    ctx.font = '11px Share Tech Mono, monospace';
    for (const g of [85, 95]) {
      ctx.beginPath(); ctx.moveTo(0, y(g)); ctx.lineTo(w, y(g)); ctx.stroke();
      ctx.fillText(`${g}°`, 2, y(g) - 3);
    }

    const dx = w / (POINTS - 1);
    ctx.strokeStyle = cssVar('--hp');
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((v, k) => (k ? ctx.lineTo(k * dx, y(v)) : ctx.moveTo(0, y(v))));
    ctx.stroke();

    ctx.fillStyle = cssVar('--alert');
    data.forEach((v, k) => { if (flags[k]) ctx.fillRect(k * dx - 3, y(v) - 3, 6, 6); });
  }

  for (let k = 0; k < POINTS; k++) step();
  setInterval(() => { step(); if (isVisible()) draw(); }, TICK_MS);
  addEventListener('resize', draw);
  return { draw };
}
