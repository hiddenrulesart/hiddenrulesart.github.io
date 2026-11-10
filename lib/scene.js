// Minimal framework for video scenes: a fixed-size canvas driven by video time.
// Open a scene page normally to preview it in real time (loops); tools/record.mjs
// drives it frame-by-frame via window.__recorder.
//
//   Scene.run(({ ctx, W, H, S, num, fps }) => ({ duration, frame(t, dt) { ... } }))
(function (root) {
  'use strict';
  const q = new URLSearchParams(location.search);
  const num = (k, d) => (q.has(k) && !isNaN(+q.get(k)) ? +q.get(k) : d);
  const str = (k, d) => (q.has(k) ? q.get(k) : d);

  const clamp01 = x => Math.max(0, Math.min(1, x));
  const smooth = x => { x = clamp01(x); return x * x * (3 - 2 * x); };
  // 0 before `start`, ramps to 1 over `fadeIn`, holds, ramps back to 0 ending at `end`.
  function window01(t, start, end, fadeIn = 0.5, fadeOut = 0.5) {
    if (t < start || t > end) return 0;
    return smooth((t - start) / fadeIn) * smooth((end - t) / fadeOut);
  }

  function text(ctx, s, x, y, o = {}) {
    if ((o.alpha ?? 1) <= 0) return;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = o.alpha ?? 1;
    ctx.fillStyle = o.color || '#ffffff';
    ctx.font = `${o.weight || 600} ${Math.round(o.size)}px ${o.font || 'system-ui, -apple-system, "Helvetica Neue", sans-serif'}`;
    ctx.textAlign = o.align || 'center';
    ctx.textBaseline = o.baseline || 'middle';
    if (o.tracking) ctx.letterSpacing = `${o.tracking}px`;
    if (o.shadow) { ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = o.size * 0.5; }
    ctx.fillText(s, x, y);
    ctx.restore();
  }

  function run(setup) {
    const record = num('record', 0);
    const W = num('w', 1920), H = num('h', 1080), fps = num('fps', 60);
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    document.body.style.cssText = 'margin:0;background:#05050a;height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden';
    canvas.style.cssText = record ? '' : 'max-width:100vw;max-height:100vh';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.fillStyle = '#05050a'; ctx.fillRect(0, 0, W, H);

    const scene = setup({ ctx, W, H, S: Math.min(W, H), num, str, fps });
    let f = 0;
    const step = () => { scene.frame(f / fps, 1 / fps); f++; };

    if (record) {
      window.__recorder = { ready: true, width: W, height: H, fps,
        frame(type = 'image/png', quality) { step(); return canvas.toDataURL(type, quality); } };
      return;
    }
    // preview: real time, restart at the end (reload keeps state deterministic)
    const dur = scene.duration || 30;
    let acc = 0, last = performance.now();
    (function loop(now) {
      acc += Math.min(0.1, (now - last) / 1000); last = now;
      while (acc >= 1 / fps) { step(); acc -= 1 / fps; }
      if (f / fps > dur) location.reload(); else requestAnimationFrame(loop);
    })(last);
  }

  root.Scene = { run, text, window01, smooth, clamp01, num, str };
})(window);
