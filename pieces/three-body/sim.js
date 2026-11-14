// N-body Newtonian gravity (G = 1) with Plummer softening.
// Integrator: kick-drift-kick leapfrog (velocity Verlet) with an adaptive step that shrinks
// during close encounters, so near-collisions stay accurate without slowing down calm orbits.
(function (root) {
  'use strict';
  function createSim() {
    const s = {
      x: [], y: [], vx: [], vy: [], m: [], ax: [], ay: [],
      G: 1, eps: 0.01, eta: 0.002, time: 0, maxSub: 40000,   // eta 0.002: the Pythagorean problem ends as published (mass 3 ejected); 0.015 got it wrong
      get n() { return this.m.length; },
      add(x, y, vx, vy, m) {
        s.x.push(x); s.y.push(y); s.vx.push(vx); s.vy.push(vy); s.m.push(m); s.ax.push(0); s.ay.push(0);
        accel();
      },
      clear() { for (const k of ['x', 'y', 'vx', 'vy', 'm', 'ax', 'ay']) s[k].length = 0; s.time = 0; },
      // advance by T time units; returns the number of substeps used
      step(T) {
        let left = T, k = 0;
        if (s.n === 0) { s.time += T; return 0; }
        while (left > 1e-12 && k < s.maxSub) {
          const h = Math.min(left, hNext);
          const n = s.n;
          for (let i = 0; i < n; i++) { s.vx[i] += 0.5 * h * s.ax[i]; s.vy[i] += 0.5 * h * s.ay[i]; s.x[i] += h * s.vx[i]; s.y[i] += h * s.vy[i]; }
          accel();
          for (let i = 0; i < n; i++) { s.vx[i] += 0.5 * h * s.ax[i]; s.vy[i] += 0.5 * h * s.ay[i]; }
          left -= h; s.time += h; k++;
          if (s.onSub) s.onSub();
        }
        if (left > 1e-12) s.time += left;   // out of budget: drop the remainder rather than freeze the page
        return k;
      },
      energy() {
        let E = 0; const n = s.n, e2 = s.eps * s.eps;
        for (let i = 0; i < n; i++) {
          E += 0.5 * s.m[i] * (s.vx[i] ** 2 + s.vy[i] ** 2);
          for (let j = i + 1; j < n; j++) E -= s.G * s.m[i] * s.m[j] / Math.sqrt((s.x[i] - s.x[j]) ** 2 + (s.y[i] - s.y[j]) ** 2 + e2);
        }
        return E;
      },
      // move to the centre-of-mass frame (zero total momentum, COM at the origin)
      center() {
        let M = 0, X = 0, Y = 0, PX = 0, PY = 0;
        for (let i = 0; i < s.n; i++) { M += s.m[i]; X += s.m[i] * s.x[i]; Y += s.m[i] * s.y[i]; PX += s.m[i] * s.vx[i]; PY += s.m[i] * s.vy[i]; }
        if (!M) return;
        for (let i = 0; i < s.n; i++) { s.x[i] -= X / M; s.y[i] -= Y / M; s.vx[i] -= PX / M; s.vy[i] -= PY / M; }
        accel();
      },
      clone() {
        const c = createSim(); c.G = s.G; c.eps = s.eps; c.eta = s.eta; c.time = s.time;
        for (let i = 0; i < s.n; i++) c.add(s.x[i], s.y[i], s.vx[i], s.vy[i], s.m[i]);
        return c;
      },
      refresh() { accel(); },
    };
    let hNext = 0.01;
    function accel() {
      const n = s.n, e2 = s.eps * s.eps; let tmin = Infinity;
      for (let i = 0; i < n; i++) { s.ax[i] = 0; s.ay[i] = 0; }
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
        const dx = s.x[j] - s.x[i], dy = s.y[j] - s.y[i], r2 = dx * dx + dy * dy + e2;
        const r = Math.sqrt(r2), inv3 = s.G / (r2 * r);
        s.ax[i] += dx * inv3 * s.m[j]; s.ay[i] += dy * inv3 * s.m[j];
        s.ax[j] -= dx * inv3 * s.m[i]; s.ay[j] -= dy * inv3 * s.m[i];
        // free-fall timescale of this pair, and a crossing-time estimate from relative speed
        const mm = s.G * (s.m[i] + s.m[j]) || 1e-12;
        const tff = Math.sqrt(r2 * r / mm);
        const dv = Math.hypot(s.vx[j] - s.vx[i], s.vy[j] - s.vy[i]);
        tmin = Math.min(tmin, tff, dv > 0 ? r / dv : Infinity);
      }
      hNext = Math.max(1e-7, Math.min(0.01, s.eta * tmin));
    }
    return s;
  }
  root.ThreeBodySim = { createSim };
})(typeof window !== 'undefined' ? window : globalThis);
