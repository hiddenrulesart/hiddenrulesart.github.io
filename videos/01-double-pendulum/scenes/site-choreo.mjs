// Scripted mouse for the website capture (scene 10a): lift the pendulums, shrink the
// starting difference, crank up the count. Returns cursor state for each video time t.
export default async function ({ page, W, H, seconds }) {
  const box = async sel => page.$eval(sel, el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, min: +el.min, max: +el.max }; });
  const spread = await box('#spread'), count = await box('#n');
  const thumb = (b, v) => ({ x: b.x + 8 + (b.w - 16) * (v - b.min) / (b.max - b.min), y: b.y + b.h / 2 });

  const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.3;
  const onArc = deg => ({ x: cx + R * Math.sin(deg * Math.PI / 180), y: cy + R * Math.cos(deg * Math.PI / 180) });
  const ease = x => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  const lerp = (a, b, k) => ({ x: a.x + (b.x - a.x) * ease(k), y: a.y + (b.y - a.y) * ease(k) });

  // keyframes: [time, position, buttonDown]
  const K = [
    [0.0, { x: W * 0.6, y: H * 0.88 }, false],
    [1.2, onArc(95), false],
    [1.5, onArc(95), true],           // grab
    [3.0, onArc(172), true],          // lift almost upright
    [3.3, onArc(172), false],         // let go
    [8.0, { x: W * 0.55, y: H * 0.7 }, false],
    [8.8, thumb(spread, -5), false],
    [9.0, thumb(spread, -5), true],
    [10.0, thumb(spread, -10), true], // make the starting difference 100,000x smaller
    [10.2, thumb(spread, -10), false],
    [11.0, thumb(count, 3), false],
    [11.2, thumb(count, 3), true],
    [11.8, thumb(count, 4), true],    // 3,000 pendulums
    [12.0, thumb(count, 4), false],
    [13.5, { x: W * 0.45, y: H * 0.78 }, false],
  ];
  return t => {
    let i = 0; while (i < K.length - 1 && K[i + 1][0] <= t) i++;
    const [t0, p0, d0] = K[i], next = K[i + 1];
    const p = next ? lerp(p0, next[1], (t - t0) / (next[0] - t0)) : p0;
    const a = Math.min(1, Math.max(0, (t - 0.4) / 0.5)) * Math.min(1, Math.max(0, (seconds - t) / 0.5));
    return { ...p, down: d0, banner: { text: '▶  Play with it yourself:  hiddenrulesart.github.io/pendulum', alpha: a } };
  };
}
