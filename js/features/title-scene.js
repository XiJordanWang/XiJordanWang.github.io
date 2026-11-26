import { reduceMotion } from '../core/env.js';

/**
 * Falling feathers over the title screen's key visual, drawn on two canvases:
 * one behind the shading (small, distant) and one in front (large, close).
 * A seeded random generator keeps the layout the same on every visit.
 */
const MAX_FEATHERS = 40;

export function createTitleScene({ back, front }) {
  let W = 0, H = 0, feathers = [], running = false;
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  function newFeather(isFront) {
    return {
      x: rnd() * W, y: -rnd() * H, front: isFront,
      length: isFront ? 34 + rnd() * 36 : 10 + rnd() * 18,
      vy: (isFront ? 55 : 24) + rnd() * 30, sway: 20 + rnd() * 40, phase: rnd() * 6.28,
      rot: rnd() * 6.28, spin: (rnd() - 0.5) * 1.6, flip: rnd() * 6.28, dark: rnd() < 0.7,
    };
  }

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    for (const c of [back, front]) {
      c.width = W * dpr; c.height = H * dpr;
      c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    seed = 11;
    feathers = Array.from({ length: Math.round(Math.min(MAX_FEATHERS, W / 34)) }, (_, i) => newFeather(i % 5 === 0));
    feathers.forEach((f) => { f.y = rnd() * H; });
  }

  function drawFeather(g, f) {
    const L = f.length, w = L * 0.17;
    g.save();
    g.translate(f.x, f.y);
    g.rotate(f.rot);
    g.scale(1, Math.max(0.15, Math.abs(Math.cos(f.flip))));
    g.globalAlpha = f.front ? 0.9 : 0.8;
    g.fillStyle = f.dark ? '#10141f' : '#F2F6FF';
    g.beginPath();
    g.moveTo(-L / 2, 0);
    g.quadraticCurveTo(-L * 0.1, -w * 1.3, L / 2, -w * 0.15);
    g.quadraticCurveTo(-L * 0.05, w * 0.9, -L / 2, 0);
    g.fill();
    g.strokeStyle = f.dark ? '#2f3650' : '#c8d4ea';
    g.lineWidth = Math.max(0.6, L / 40);
    g.beginPath(); g.moveTo(-L * 0.6, 0); g.lineTo(L / 2, -w * 0.15); g.stroke();
    g.restore();
  }

  function frame(dt) {
    const gb = back.getContext('2d'), gf = front.getContext('2d');
    gb.clearRect(0, 0, W, H);
    gf.clearRect(0, 0, W, H);
    for (const f of feathers) {
      if (!reduceMotion) {
        f.y += f.vy * dt; f.phase += dt * 1.3; f.x += Math.sin(f.phase) * f.sway * dt + 14 * dt;
        f.rot += f.spin * dt; f.flip += dt * 2.2;
        if (f.y > H + 40 || f.x > W + 60) { Object.assign(f, newFeather(f.front)); f.y = -40; }
      }
      drawFeather(f.front ? gf : gb, f);
    }
  }

  addEventListener('resize', () => { if (running) { resize(); frame(0); } });

  return {
    start() {
      running = true;
      resize();
      if (reduceMotion) return frame(0);
      let last = performance.now();
      const loop = (t) => {
        if (!running) return;
        frame(Math.min(0.05, (t - last) / 1000));
        last = t;
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    },
    stop() { running = false; },
  };
}
