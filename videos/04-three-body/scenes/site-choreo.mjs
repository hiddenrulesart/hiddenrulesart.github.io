// Scripted mouse for the website capture of pieces/three-body ("Your solar system": one star in the middle).
// Taps drop planets on circular orbits; a drag throws one (the page shows its predicted path while aiming).
export default async function ({ W, H, seconds }) {
  // positions relative to the star at the centre of the canvas, in units of the window height
  const at = (dx, dy) => ({ x: W / 2 + dx * H, y: H / 2 + dy * H });
  const ease = x => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  const lerp = (a, b, k) => ({ x: a.x + (b.x - a.x) * ease(k), y: a.y + (b.y - a.y) * ease(k) });
  // keyframes: [time, position, buttonDown]
  const K = [
    [0.0, { x: W * 0.3, y: H * 0.95 }, false],
    [1.0, at(0.16, 0), false], [1.3, at(0.16, 0), true], [1.45, at(0.16, 0), false],           // tap: a planet
    [2.4, at(-0.28, 0.05), false], [2.7, at(-0.28, 0.05), true], [2.85, at(-0.28, 0.05), false], // tap: another, farther out
    [4.0, at(0.05, -0.36), false], [4.3, at(0.05, -0.36), true],                                // drag to throw one
    [5.8, at(0.2, -0.33), true], [6.4, at(0.2, -0.33), true], [6.5, at(0.2, -0.33), false],
    [8.0, at(-0.1, 0.3), false], [8.3, at(-0.1, 0.3), true],                                   // another throw, inward
    [9.6, at(-0.22, 0.2), true], [10.2, at(-0.22, 0.2), true], [10.3, at(-0.22, 0.2), false],
    [11.5, { x: W * 0.55, y: H * 0.86 }, false],
  ];
  return t => {
    let i = 0; while (i < K.length - 1 && K[i + 1][0] <= t) i++;
    const [t0, p0, d0] = K[i], next = K[i + 1];
    const p = next ? lerp(p0, next[1], (t - t0) / Math.max(1e-6, next[0] - t0)) : p0;
    const a = Math.min(1, Math.max(0, (t - 0.4) / 0.5)) * Math.min(1, Math.max(0, (seconds - t) / 0.5));
    return { ...p, down: d0, banner: { text: '▶  Play with it yourself:  hiddenrulesart.github.io/planets', alpha: a } };
  };
}
