// Shared by the episode 4 scenes: build a system with pieces/three-body/sim.js, record trails at every
// integrator substep (so fast close passes stay smooth curves), and draw trails + glowing stars through a
// camera { x, y, s } (world point at the screen centre, pixels per unit). Colours follow the masses of the
// Pythagorean problem: 3 gold, 4 violet, 5 cyan.
(function (root) {
  'use strict';
  const COL = ['#ffcf6a', '#b59cff', '#7fd8ff', '#ff9a7a', '#8affc1'];
  const PYTH = [[1, 3, 0, 0, 3], [-2, -1, 0, 0, 4], [1, -1, 0, 0, 5]];

  function system(list, { eps = 0, eta, center = true } = {}) {
    const s = ThreeBodySim.createSim(); s.eps = eps; if (eta) s.eta = eta; s.maxSub = 1e6;
    for (const b of list) s.add(...b);
    if (center && list.length > 1) s.center();
    return s;
  }
  // trails: per body a flat [x, y, t, ...] list in world coordinates, kept for `life` time units
  function trails(sim, life = 6) {
    const tr = { life, pts: [], on: true };
    const last = [];
    sim.onSub = () => {
      if (!tr.on) return;
      for (let i = 0; i < sim.n; i++) {
        const t = tr.pts[i] || (tr.pts[i] = []), L = last[i] || (last[i] = [NaN, NaN, -1]);
        if (!((sim.x[i] - L[0]) ** 2 + (sim.y[i] - L[1]) ** 2 < 1e-6 && sim.time - L[2] < 0.02)) {
          t.push(sim.x[i], sim.y[i], sim.time); L[0] = sim.x[i]; L[1] = sim.y[i]; L[2] = sim.time;
        }
      }
    };
    tr.prune = () => {
      const cut = sim.time - tr.life;
      for (const t of tr.pts) { if (!t) continue; let k = 0; while (k < t.length && t[k + 2] < cut) k += 3; if (k > 3) t.splice(0, k - 3); }
    };
    tr.clear = () => { tr.pts = []; last.length = 0; };
    return tr;
  }
  const scr = (cam, W, H) => ({ X: x => W / 2 + (x - cam.x) * cam.s, Y: y => H / 2 - (y - cam.y) * cam.s });

  function drawTrails(ctx, sim, tr, cam, W, H, S, { alpha = 1, color = null, width = 1 } = {}) {
    const { X, Y } = scr(cam, W, H), lw = S * 0.0032 * width, now = sim.time;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < sim.n; i++) {
      const t = tr.pts[i]; if (!t || t.length < 6) continue;
      const m = t.length / 3, CH = 16, c = color || COL[i % COL.length];
      for (let pass = 0; pass < 2; pass++) {
        ctx.lineWidth = pass ? lw : lw * 4.5;
        for (let a = 0; a < m - 1; a += CH) {
          const e = Math.min(m - 1, a + CH), age = (now - t[3 * a + 2]) / tr.life;
          const fade = Math.max(0, 1 - age) ** 1.4;
          if (fade < 0.01) continue;
          ctx.globalAlpha = alpha * fade * (pass ? 0.9 : 0.1); ctx.strokeStyle = c;
          ctx.beginPath(); ctx.moveTo(X(t[3 * a]), Y(t[3 * a + 1]));
          for (let j = a + 1; j <= e; j++) ctx.lineTo(X(t[3 * j]), Y(t[3 * j + 1]));
          if (e === m - 1) ctx.lineTo(X(sim.x[i]), Y(sim.y[i]));
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }
  function radius(m, S) { return S * 0.0075 * Math.sqrt(Math.max(0.05, m)); }
  function drawBodies(ctx, sim, cam, W, H, S, { alpha = 1, outline = false, rad = null } = {}) {
    const { X, Y } = scr(cam, W, H);
    ctx.save();
    for (let i = 0; i < sim.n; i++) {
      const x = X(sim.x[i]), y = Y(sim.y[i]), r = rad ? rad(i, sim.m[i]) : radius(sim.m[i], S), c = COL[i % COL.length];
      ctx.globalAlpha = alpha;
      if (outline) { ctx.strokeStyle = 'rgba(235,235,245,0.85)'; ctx.lineWidth = S * 0.0025; ctx.beginPath(); ctx.arc(x, y, r * 1.25, 0, 7); ctx.stroke(); continue; }
      ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4.5);
      g.addColorStop(0, c); g.addColorStop(0.25, c + 'aa'); g.addColorStop(1, c + '00');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 4.5, 0, 7); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, r * 0.8, 0, 7); ctx.fill();
    }
    ctx.restore();
  }
  // camera that frames the given bodies (default all), eased toward its target each frame
  function follow(cam, sim, W, H, dt, { idx = null, margin = 1.25, minR = 1, rate = 1.2, ox = 0 } = {}) {
    const I = idx || [...Array(sim.n).keys()];
    let M = 0, cx = 0, cy = 0; for (const i of I) { M += sim.m[i]; cx += sim.m[i] * sim.x[i]; cy += sim.m[i] * sim.y[i]; }
    cx /= M; cy /= M;
    let R = minR; for (const i of I) R = Math.max(R, Math.abs(sim.x[i] - cx) * H / W, Math.abs(sim.y[i] - cy));
    const ts = 0.5 * H / (R * margin);
    if (!cam.s) { cam.x = cx - ox / ts; cam.y = cy; cam.s = ts; return cam; }
    const a = 1 - Math.exp(-dt * rate);
    cam.s = Math.exp(Math.log(cam.s) + (Math.log(ts) - Math.log(cam.s)) * a);
    cam.x += (cx - ox / cam.s - cam.x) * a; cam.y += (cy - cam.y) * a;
    return cam;
  }
  // an arrow from (x, y) along (dx, dy) in screen pixels
  function arrow(ctx, x, y, dx, dy, color, w, alpha = 1) {
    const L = Math.hypot(dx, dy); if (L < 2) return;
    const ux = dx / L, uy = dy / L, h = Math.min(L * 0.45, w * 4.5);
    ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx - ux * h * 0.8, y + dy - uy * h * 0.8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + dx, y + dy); ctx.lineTo(x + dx - ux * h - uy * h * 0.5, y + dy - uy * h + ux * h * 0.5);
    ctx.lineTo(x + dx - ux * h + uy * h * 0.5, y + dy - uy * h - ux * h * 0.5); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  // run the simulation clock from a piecewise-linear table [[videoTime, simTime], ...]
  function clock(keys) {
    return t => {
      if (t <= keys[0][0]) return keys[0][1];
      for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) {
        const [a, A] = keys[i - 1], [b, B] = keys[i]; return A + (B - A) * (t - a) / (b - a);
      }
      const n = keys.length, [a, A] = keys[n - 2], [b, B] = keys[n - 1];
      return B + (B - A) / (b - a) * (t - b);
    };
  }
  root.Sky = { COL, PYTH, system, trails, drawTrails, drawBodies, follow, arrow, clock, radius };
})(window);
