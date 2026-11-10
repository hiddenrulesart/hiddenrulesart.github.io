// Double pendulum ensemble simulation (no DOM — also runs in Node for testing).
// N pendulums start with almost identical angles and are integrated with RK4.
(function (root) {
  'use strict';

  const G = 9.81; // gravity (m/s^2); both arms 1 m long, both bobs 1 kg

  // Angular accelerations of the standard double pendulum (m1 = m2 = 1, l1 = l2 = 1).
  function accel(t1, t2, w1, w2, out) {
    const d = t1 - t2;
    const sd = Math.sin(d), cd = Math.cos(d);
    const den = 3 - Math.cos(2 * d); // 2*m1 + m2 - m2*cos(2d)
    out[0] = (-3 * G * Math.sin(t1) - G * Math.sin(t1 - 2 * t2)
              - 2 * sd * (w2 * w2 + w1 * w1 * cd)) / den;
    out[1] = (2 * sd * (2 * w1 * w1 + 2 * G * Math.cos(t1) + w2 * w2 * cd)) / den;
  }

  function createSim(opts) {
    const n = opts.n;
    const th1 = new Float64Array(n), th2 = new Float64Array(n);
    const om1 = new Float64Array(n), om2 = new Float64Array(n);
    const a = [0, 0];
    let time = 0;

    // a1, a2, spread are in degrees. spread = total range across all pendulums.
    function reset(a1, a2, spread) {
      const r = Math.PI / 180;
      for (let i = 0; i < n; i++) {
        const off = n > 1 ? (i / (n - 1) - 0.5) * spread : 0;
        th1[i] = (a1 + off) * r;
        th2[i] = (a2 + off) * r;
        om1[i] = 0; om2[i] = 0;
      }
      time = 0;
    }

    // Classic RK4 on one pendulum.
    function rk4(i, h) {
      const t1 = th1[i], t2 = th2[i], w1 = om1[i], w2 = om2[i];
      accel(t1, t2, w1, w2, a); const k1a = a[0], k1b = a[1];
      accel(t1 + 0.5 * h * w1, t2 + 0.5 * h * w2, w1 + 0.5 * h * k1a, w2 + 0.5 * h * k1b, a);
      const k2a = a[0], k2b = a[1];
      const w1b = w1 + 0.5 * h * k1a, w2b = w2 + 0.5 * h * k1b;
      accel(t1 + 0.5 * h * w1b, t2 + 0.5 * h * w2b, w1 + 0.5 * h * k2a, w2 + 0.5 * h * k2b, a);
      const k3a = a[0], k3b = a[1];
      const w1c = w1 + 0.5 * h * k2a, w2c = w2 + 0.5 * h * k2b;
      accel(t1 + h * w1c, t2 + h * w2c, w1 + h * k3a, w2 + h * k3b, a);
      const k4a = a[0], k4b = a[1];
      const w1d = w1 + h * k3a, w2d = w2 + h * k3b;
      th1[i] = t1 + (h / 6) * (w1 + 2 * w1b + 2 * w1c + w1d);
      th2[i] = t2 + (h / 6) * (w2 + 2 * w2b + 2 * w2c + w2d);
      om1[i] = w1 + (h / 6) * (k1a + 2 * k2a + 2 * k3a + k4a);
      om2[i] = w2 + (h / 6) * (k1b + 2 * k2b + 2 * k3b + k4b);
    }

    // Advance by dt seconds using `substeps` RK4 steps. Deterministic.
    function step(dt, substeps) {
      const h = dt / substeps;
      for (let s = 0; s < substeps; s++) for (let i = 0; i < n; i++) rk4(i, h);
      time += dt;
    }

    // How far apart the ensemble has drifted: spread of bob-2 positions (0 = identical).
    function divergence() {
      let mx = 0, my = 0;
      for (let i = 0; i < n; i++) {
        mx += Math.sin(th1[i]) + Math.sin(th2[i]);
        my += Math.cos(th1[i]) + Math.cos(th2[i]);
      }
      mx /= n; my /= n;
      let v = 0;
      for (let i = 0; i < n; i++) {
        const dx = Math.sin(th1[i]) + Math.sin(th2[i]) - mx;
        const dy = Math.cos(th1[i]) + Math.cos(th2[i]) - my;
        v += dx * dx + dy * dy;
      }
      return Math.sqrt(v / n);
    }

    return { n, th1, th2, om1, om2, reset, step, divergence, get time() { return time; } };
  }

  root.DoublePendulumSim = { createSim };
  if (typeof module !== 'undefined') module.exports = { createSim };
})(typeof window !== 'undefined' ? window : globalThis);
