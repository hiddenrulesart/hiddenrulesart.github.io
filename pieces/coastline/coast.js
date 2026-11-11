// Fractal coastlines: a seeded island (random midpoint displacement) or the Koch snowflake.
// Every segment carries a hash, so subdividing it always gives the same children: zooming in
// adds detail that is consistent with what you saw before, and the measuring curve is the same
// coastline you see on screen.
(function (root) {
  'use strict';
  const mix = h => { h = Math.imul(h ^ (h >>> 16), 0x7feb352d); h = Math.imul(h ^ (h >>> 15), 0x846ca68b); return (h ^ (h >>> 16)) >>> 0; };
  const child = (h, k) => mix(h ^ Math.imul(k + 1, 0x9e3779b9));
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  // Island model: each segment's midpoint moves sideways by L·H·a, a uniform in [0.7, 1.3], random side.
  // Children have length L·sqrt(1/4 + (H a)^2), so the curve is random self-similar with dimension D
  // solving 2·E[(1/4 + (H a)^2)^(D/2)] = 1. Invert that for H given the D the user asks for.
  const AS = Array.from({ length: 64 }, (_, i) => 0.7 + 0.6 * (i + 0.5) / 64);
  const moment = (H, D) => 2 * AS.reduce((s, a) => s + Math.pow(0.25 + (H * a) ** 2, D / 2), 0) / AS.length;
  function solveH(D) {
    if (D <= 1) return 0;
    let lo = 0, hi = 1;
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (moment(m, D) < 1) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }

  function create({ mode = 0, D = 1.25, seed = 1 } = {}) {
    const koch = mode === 1;
    const H = koch ? 0 : solveH(D);
    const trueD = koch ? Math.log(4) / Math.log(3) : D;
    // base polygon (clockwise on screen, y down) + per-segment hashes
    const base = [];
    if (koch) {
      const R = 0.62;
      for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 3; base.push([R * Math.cos(a), R * Math.sin(a) + 0.08]); }
    } else {
      const r = rng(seed * 7919 + 13), N = 12, ph = [r() * 6.28, r() * 6.28, r() * 6.28], am = [0.18, 0.1, 0.06].map(x => x * (0.5 + r()));
      for (let i = 0; i < N; i++) {
        const a = (i + (r() - 0.5) * 0.5) / N * 2 * Math.PI - Math.PI / 2;
        const rad = 0.62 * (1 + am[0] * Math.sin(a * 2 + ph[0]) + am[1] * Math.sin(a * 3 + ph[1]) + am[2] * Math.sin(a * 5 + ph[2]));
        base.push([rad * Math.cos(a) * 0.82, rad * Math.sin(a) * 1.08]);   // a bit taller than wide
      }
    }
    const hs = base.map((_, i) => mix(seed * 1000003 + i * 97 + (koch ? 5 : 0)));
    // how far a segment's descendants can stray from it, as a multiple of its length (for culling)
    const rmax = Math.sqrt(0.25 + (H * 1.3) ** 2);
    const reach = koch ? 0.3 : (H * 1.3 * 0.5) / Math.max(0.05, 1 - rmax) + 0.02;

    // Subdivide segment (ax,ay)-(bx,by). `keep(ax,ay,bx,by,L)` returns 0 = emit end point, 1 = split.
    // Emits the end point of every leaf into out (the start point is emitted by the caller).
    function sub(ax, ay, bx, by, h, depth, keep, out) {
      const dx = bx - ax, dy = by - ay;
      if (depth > 90 || !keep(ax, ay, bx, by, Math.hypot(dx, dy))) { out.push(bx, by); return; }
      if (koch) {
        const p1x = ax + dx / 3, p1y = ay + dy / 3, p3x = ax + 2 * dx / 3, p3y = ay + 2 * dy / 3;
        const k = Math.sqrt(3) / 6, p2x = (ax + bx) / 2 + dy * k, p2y = (ay + by) / 2 - dx * k;   // bump outward
        sub(ax, ay, p1x, p1y, 0, depth + 1, keep, out); sub(p1x, p1y, p2x, p2y, 0, depth + 1, keep, out);
        sub(p2x, p2y, p3x, p3y, 0, depth + 1, keep, out); sub(p3x, p3y, bx, by, 0, depth + 1, keep, out);
      } else {
        const a = (0.7 + 0.6 * ((h >>> 8) / 16777216)) * H * ((h & 1) ? 1 : -1);
        const mx = (ax + bx) / 2 - dy * a, my = (ay + by) / 2 + dx * a;
        sub(ax, ay, mx, my, child(h, 0), depth + 1, keep, out);
        sub(mx, my, bx, by, child(h, 1), depth + 1, keep, out);
      }
    }
    function polyline(keep) {
      const out = [base[0][0], base[0][1]];
      for (let i = 0; i < base.length; i++) { const a = base[i], b = base[(i + 1) % base.length]; sub(a[0], a[1], b[0], b[1], hs[i], 0, keep, out); }
      out.length -= 2;   // last point == first point
      return Float64Array.from(out);
    }
    // the whole coast down to segments shorter than eps (world units): used for measuring
    const fine = eps => polyline((ax, ay, bx, by, L) => L > eps);
    // the coast as seen through a view: detail down to ~minPx pixels, only where it's on screen
    function visible(view, W, H_, minPx, margin) {
      const { ox, oy, s } = view, x0 = ox - (W / 2 + margin) / s, x1 = ox + (W / 2 + margin) / s, y0 = oy - (H_ / 2 + margin) / s, y1 = oy + (H_ / 2 + margin) / s;
      const lim = minPx / s;
      return polyline((ax, ay, bx, by, L) => {
        if (L < lim) return 0;
        const r = L * reach;
        return !(Math.max(ax, bx) + r < x0 || Math.min(ax, bx) - r > x1 || Math.max(ay, by) + r < y0 || Math.min(ay, by) - r > y1);
      });
    }
    // a point on the coast, found by following one seeded path down the subdivision tree: a target to dive into
    function divePoint(pathSeed) {
      const r = rng(pathSeed);
      const i = Math.floor(r() * base.length);
      let [ax, ay] = base[i], [bx, by] = base[(i + 1) % base.length], h = hs[i];
      for (let d = 0; d < 80 && Math.hypot(bx - ax, by - ay) > 1e-11; d++) {
        const pts = [ax, ay];
        sub(ax, ay, bx, by, h, 0, (_a, _b, _c, _d, _L) => _a === ax && _b === ay && _c === bx && _d === by, pts);   // split once
        const k = Math.floor(r() * (pts.length / 2 - 1));
        if (!koch) h = child(h, k);
        ax = pts[2 * k]; ay = pts[2 * k + 1]; bx = pts[2 * k + 2]; by = pts[2 * k + 3];
      }
      return [(ax + bx) / 2, (ay + by) / 2];
    }
    let bb = [Infinity, Infinity, -Infinity, -Infinity];
    { const p = fine(0.05); for (let i = 0; i < p.length; i += 2) { bb[0] = Math.min(bb[0], p[i]); bb[1] = Math.min(bb[1], p[i + 1]); bb[2] = Math.max(bb[2], p[i]); bb[3] = Math.max(bb[3], p[i + 1]); } }
    return { mode, D, seed, H, trueD, base, fine, visible, divePoint, bbox: bb };
  }

  // Richardson's divider walk: from the start, step a ruler of length R along the coast, each step landing
  // on the first point of the coast exactly R away. Returns the step points and measured length
  // (whole steps × R + the last partial step back to the start).
  function walk(P, R) {
    const n = P.length / 2, R2 = R * R, pts = [P[0], P[1]];
    let cx = P[0], cy = P[1], j = 0, t0 = 0, steps = 0;
    for (;;) {
      let found = false;
      for (; j < n; j++) {
        const ax = P[2 * j], ay = P[2 * j + 1], k = (j + 1) % n, bx = P[2 * k], by = P[2 * k + 1];
        if ((bx - cx) ** 2 + (by - cy) ** 2 >= R2) {
          const dx = bx - ax, dy = by - ay, fx = ax - cx, fy = ay - cy;
          const A = dx * dx + dy * dy, B = 2 * (fx * dx + fy * dy), C = fx * fx + fy * fy - R2;
          const t = (-B + Math.sqrt(Math.max(0, B * B - 4 * A * C))) / (2 * A);
          if (t >= t0 - 1e-12) { cx = ax + t * dx; cy = ay + t * dy; t0 = t; pts.push(cx, cy); steps++; found = true; break; }
        }
        t0 = 0;
      }
      if (!found) break;
    }
    const rem = Math.hypot(cx - P[0], cy - P[1]);
    pts.push(P[0], P[1]);
    return { pts: Float64Array.from(pts), steps, rem, length: steps * R + rem };
  }

  // least-squares slope of log(length) vs log(ruler): D = 1 - slope
  function fit(points) {
    if (points.length < 2) return null;
    let sx = 0, sy = 0, sxx = 0, sxy = 0; const n = points.length;
    for (const p of points) { const x = Math.log10(p.r), y = Math.log10(p.L); sx += x; sy += y; sxx += x * x; sxy += x * y; }
    const den = n * sxx - sx * sx; if (Math.abs(den) < 1e-12) return null;
    const slope = (n * sxy - sx * sy) / den;
    return { slope, icpt: (sy - slope * sx) / n, D: 1 - slope };
  }

  root.CoastGen = { create, walk, fit, solveH };
})(typeof window !== 'undefined' ? window : globalThis);
