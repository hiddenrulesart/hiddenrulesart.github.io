// Shared by the episode 3 scenes: render a bifurcation diagram (same palette and density shading as
// pieces/logistic-map) into a canvas. map(r, x) defaults to the logistic map r·x·(1−x).
(function (root) {
  'use strict';
  const PAL = new Uint8Array(256 * 3);
  const stops = [[0, 5, 5, 10], [0.25, 70, 30, 150], [0.5, 200, 50, 160], [0.75, 255, 140, 60], [1, 255, 240, 200]];
  for (let i = 0; i < 256; i++) {
    const t = i / 255; let k = 0; while (t > stops[k + 1][0]) k++;
    const [t0, ...a] = stops[k], [t1, ...b] = stops[k + 1], u = (t - t0) / (t1 - t0);
    for (let c = 0; c < 3; c++) PAL[i * 3 + c] = a[c] + (b[c] - a[c]) * u;
  }
  const logistic = (r, x) => r * x * (1 - x);
  // returns a canvas of size w x h; transparent where nothing lands (so it can sit on any background)
  function render(w, h, { r0, r1, x0 = 0, x1 = 1, iters = 2000, warm = 1500, samples = 3, map = logistic, contrast = 0.55, start = 0.3 } = {}) {
    w = Math.round(w); h = Math.round(h);
    const hist = new Float32Array(w * h);
    let seed = 777; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    for (let col = 0; col < w; col++) for (let s = 0; s < samples; s++) {
      const r = r0 + (col + rnd()) / w * (r1 - r0);
      let x = start + 0.4 * rnd();
      for (let i = 0; i < warm; i++) x = map(r, x);
      for (let i = 0; i < iters; i++) {
        x = map(r, x);
        if (x >= x0 && x < x1) hist[((x1 - x) / (x1 - x0) * h | 0) * w + col]++;
      }
    }
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'), im = g.createImageData(w, h), d = im.data;
    for (let col = 0; col < w; col++) {
      let m = 0; for (let row = 0; row < h; row++) m = Math.max(m, hist[row * w + col]);
      for (let row = 0; row < h; row++) {
        const v = hist[row * w + col], p = (row * w + col) * 4;
        if (!v) continue;
        const k = 3 * Math.min(255, (40 + 215 * Math.pow(v / m, contrast)) | 0);
        d[p] = PAL[k]; d[p + 1] = PAL[k + 1]; d[p + 2] = PAL[k + 2]; d[p + 3] = 255;
      }
    }
    g.putImageData(im, 0, 0);
    return c;
  }
  // the long-run values the population visits at growth rate r (period p, or 0 = never repeats)
  function cycle(r, map = logistic) {
    let x = 0.3; for (let i = 0; i < 60000; i++) x = map(r, x);
    const s = []; for (let i = 0; i < 70; i++) { x = map(r, x); s.push(x); }
    for (let p = 1; p <= 32; p++) { let ok = true; for (let i = 0; i + p < s.length && ok; i++) ok = Math.abs(s[i] - s[i + p]) < 1e-6; if (ok) return { p, vals: s.slice(0, p) }; }
    return { p: 0, vals: [] };
  }
  root.Bif = { render, cycle, logistic, PAL };
})(window);
