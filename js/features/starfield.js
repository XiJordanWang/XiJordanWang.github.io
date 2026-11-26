import { reduceMotion } from '../core/env.js';

/** Twinkling starfield painted on the fixed background canvas. */
export function initStarfield(canvas) {
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    const dpr = devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.round((innerWidth * innerHeight) / 5000) }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.3 + 0.2,
      phase: Math.random() * 6,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = '#CFE0FF';
    for (const s of stars) {
      ctx.globalAlpha = 0.35 + 0.45 * Math.abs(Math.sin(s.phase + t / 1400));
      ctx.fillRect(s.x, s.y, s.r, s.r);
    }
  }

  resize();
  draw(0);
  addEventListener('resize', () => { resize(); draw(0); });
  if (!reduceMotion) {
    const loop = (t) => { draw(t); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
}
