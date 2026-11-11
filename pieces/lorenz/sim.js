// Lorenz system ensemble (no DOM, also runs in Node).
//   dx/dt = σ(y − x),  dy/dt = x(ρ − z) − y,  dz/dt = xy − βz
// N particles start in a tiny cloud and are integrated with RK4.
(function (root) {
  'use strict';
  function createLorenz({ n }) {
    const x = new Float64Array(n), y = new Float64Array(n), z = new Float64Array(n);
    const p = { sigma: 10, rho: 28, beta: 8 / 3 };
    let time = 0;

    // Start every particle near (x0, y0, z0); `spread` is the total width of the cloud along x.
    function reset(spread, x0 = 1, y0 = 1, z0 = 1) {
      for (let i = 0; i < n; i++) {
        const off = n > 1 ? (i / (n - 1) - 0.5) * spread : 0;
        x[i] = x0 + off; y[i] = y0; z[i] = z0;
      }
      time = 0;
    }

    function step(dt, substeps = 1) {
      const h = dt / substeps, { sigma: s, rho: r, beta: b } = p;
      for (let k = 0; k < substeps; k++) for (let i = 0; i < n; i++) {
        const X = x[i], Y = y[i], Z = z[i];
        const a1 = s * (Y - X), b1 = X * (r - Z) - Y, c1 = X * Y - b * Z;
        let X2 = X + h / 2 * a1, Y2 = Y + h / 2 * b1, Z2 = Z + h / 2 * c1;
        const a2 = s * (Y2 - X2), b2 = X2 * (r - Z2) - Y2, c2 = X2 * Y2 - b * Z2;
        X2 = X + h / 2 * a2; Y2 = Y + h / 2 * b2; Z2 = Z + h / 2 * c2;
        const a3 = s * (Y2 - X2), b3 = X2 * (r - Z2) - Y2, c3 = X2 * Y2 - b * Z2;
        X2 = X + h * a3; Y2 = Y + h * b3; Z2 = Z + h * c3;
        const a4 = s * (Y2 - X2), b4 = X2 * (r - Z2) - Y2, c4 = X2 * Y2 - b * Z2;
        x[i] = X + h / 6 * (a1 + 2 * a2 + 2 * a3 + a4);
        y[i] = Y + h / 6 * (b1 + 2 * b2 + 2 * b3 + b4);
        z[i] = Z + h / 6 * (c1 + 2 * c2 + 2 * c3 + c4);
      }
      time += dt;
    }
    return { n, x, y, z, params: p, reset, step, get time() { return time; } };
  }
  root.LorenzSim = { createLorenz };
  if (typeof module !== 'undefined') module.exports = { createLorenz };
})(typeof window !== 'undefined' ? window : globalThis);
