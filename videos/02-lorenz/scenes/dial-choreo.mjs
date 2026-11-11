// Scripted mouse for the "turn the dial" scene: drag ρ from 28 down to 14 (chaos dies, the cloud
// settles onto two calm points), back up to 40 (the butterfly returns), then rotate the view while
// the "play with it yourself" banner is up. Cue times come from build.mjs via SCENE_CUES.
export default async function ({ page, W, H, seconds }) {
  const cues = JSON.parse(process.env.SCENE_CUES || '{}');
  const downAt = cues.downAt ?? 4, upAt = cues.upAt ?? 13, siteAt = cues.siteAt ?? 18;
  const rho = await page.$eval('#rho', el => { el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, min: +el.min, max: +el.max }; });
  const thumb = v => ({ x: rho.x + 8 + (rho.w - 16) * (v - rho.min) / (rho.max - rho.min), y: rho.y + rho.h / 2 });
  const ease = x => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  const lerp = (a, b, k) => ({ x: a.x + (b.x - a.x) * ease(k), y: a.y + (b.y - a.y) * ease(k) });
  const stage = { x: W * 0.36, y: H * 0.5 };

  // keyframes: [time, position, buttonDown]
  const K = [
    [0.0, { x: W * 0.4, y: H * 0.85 }, false],
    [Math.max(0.5, downAt - 1.2), thumb(28), false],
    [downAt - 0.2, thumb(28), true],
    [downAt + 1.6, thumb(14), true],      // turn the heat down
    [downAt + 1.9, thumb(14), false],
    [downAt + 3.0, { x: thumb(14).x - W * 0.08, y: thumb(14).y + H * 0.12 }, false],
    [upAt - 0.9, thumb(14), false],
    [upAt - 0.6, thumb(14), true],
    // back up past 28 to 40: at 28 the calm points repel so weakly that the collapsed particles take ~15 s
    // to spread out again; at 40 the butterfly is back within ~5 s, in time for the narration
    [upAt + 0.9, thumb(40), true],
    [upAt + 1.2, thumb(40), false],
    [siteAt + 0.4, { x: stage.x + W * 0.08, y: stage.y }, false],
    [siteAt + 0.7, { x: stage.x + W * 0.08, y: stage.y }, true],
    [siteAt + 3.2, { x: stage.x - W * 0.1, y: stage.y + H * 0.05 }, true],   // drag to rotate
    [siteAt + 3.4, { x: stage.x - W * 0.1, y: stage.y + H * 0.05 }, false],
    [seconds, { x: stage.x - W * 0.06, y: stage.y + H * 0.25 }, false],
  ].sort((a, b) => a[0] - b[0]);
  return t => {
    let i = 0; while (i < K.length - 1 && K[i + 1][0] <= t) i++;
    const [t0, p0, d0] = K[i], next = K[i + 1];
    const p = next ? lerp(p0, next[1], (t - t0) / Math.max(1e-6, next[0] - t0)) : p0;
    const a = Math.min(1, Math.max(0, (t - siteAt) / 0.5)) * Math.min(1, Math.max(0, (seconds - t) / 0.5));
    return { ...p, down: d0, banner: { text: '▶  Play with it yourself:  hiddenrulesart.github.io/lorenz', alpha: a } };
  };
}
