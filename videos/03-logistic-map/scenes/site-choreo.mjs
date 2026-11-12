// Scripted mouse for the website capture: hover across the columns (the inset shows what the
// population does), scroll-zoom into the edge of chaos, then press "Dive into infinity".
export default async function ({ page, W, H, seconds }) {
  const dive = await page.$eval('#dive', el => { const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  const at = (r, x) => ({ x: (r - 2.5) / 1.5 * W, y: (1 - x) * H });   // the default view: r 2.5–4, x 0–1, full window
  const ease = x => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  const lerp = (a, b, k) => ({ x: a.x + (b.x - a.x) * ease(k), y: a.y + (b.y - a.y) * ease(k) });
  const Z = at(3.575, 0.5);   // where the scroll-zoom happens: the end of the period-doubling cascade

  // keyframes: [time, position, buttonDown]
  const K = [
    [0.0, { x: W * 0.3, y: H * 0.95 }, false],
    [1.0, at(2.9, 0.3), false],
    [4.6, at(3.45, 0.3), false],       // hover sweep: settles, then 2 values, then 4
    [6.0, at(3.7, 0.2), false],        // chaos
    [6.8, Z, false],
    [9.6, Z, false],                   // scroll-zoom in here
    [10.6, { x: dive.x, y: dive.y }, false],
    [10.8, { x: dive.x, y: dive.y }, true],
    [11.0, { x: dive.x, y: dive.y }, false],   // Dive into infinity
    [12.2, { x: W * 0.55, y: H * 0.86 }, false],
  ];
  return t => {
    let i = 0; while (i < K.length - 1 && K[i + 1][0] <= t) i++;
    const [t0, p0, d0] = K[i], next = K[i + 1];
    const p = next ? lerp(p0, next[1], (t - t0) / Math.max(1e-6, next[0] - t0)) : p0;
    const wheel = t > 7.2 && t < 9.2 ? -14 : 0;
    const a = Math.min(1, Math.max(0, (t - 0.4) / 0.5)) * Math.min(1, Math.max(0, (seconds - t) / 0.5));
    return { ...p, down: d0, wheel, banner: { text: '▶  Play with it yourself:  hiddenrulesart.github.io/rabbits', alpha: a } };
  };
}
