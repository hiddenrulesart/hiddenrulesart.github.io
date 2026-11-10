// Drawing for the double pendulum ensemble. Shared by the interactive piece and video scenes.
(function (root) {
  'use strict';
  const BUCKETS = 96;
  const BG = '#05050a';
  // Rainbow by index, so neighbours start the same colour and visibly separate.
  const bucketColor = (b, alpha) => `hsla(${(b / BUCKETS) * 330 + 200},95%,62%,${alpha})`;

  // Fade the previous frame toward the background -> motion trails. trail: 0 (none) .. 0.95 (long)
  function fade(ctx, W, H, trail) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = `rgba(5,5,10,${1 - trail})`;
    ctx.fillRect(0, 0, W, H);
  }

  // o: { ox, oy, L (arm length px), lw (line width px), glow (opacity), pivot (bool) }
  function drawEnsemble(ctx, sim, o) {
    const { ox, oy, L, lw } = o;
    const n = sim.n, th1 = sim.th1, th2 = sim.th2;
    const alpha = n === 1 ? 1 : o.glow;
    const per = Math.ceil(n / BUCKETS);
    // Inner arms all share the pivot, so they pile up into a white disk once chaotic;
    // draw them dimmer and let the outer arms carry the picture.
    const INNER = n === 1 ? 1 : 0.3;

    // additive blending: overlapping pendulums glow white, then split into a rainbow
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let b = 0; b * per < n; b++) {
      const end = Math.min(n, (b + 1) * per);
      const col = Math.floor((b * per / n) * BUCKETS);
      ctx.beginPath();
      for (let i = b * per; i < end; i++) {
        ctx.moveTo(ox, oy); ctx.lineTo(ox + L * Math.sin(th1[i]), oy + L * Math.cos(th1[i]));
      }
      ctx.strokeStyle = bucketColor(col, alpha * INNER);
      ctx.stroke();
      ctx.beginPath();
      for (let i = b * per; i < end; i++) {
        const x1 = ox + L * Math.sin(th1[i]), y1 = oy + L * Math.cos(th1[i]);
        ctx.moveTo(x1, y1); ctx.lineTo(x1 + L * Math.sin(th2[i]), y1 + L * Math.cos(th2[i]));
      }
      ctx.strokeStyle = bucketColor(col, alpha);
      ctx.stroke();
    }

    if (o.pivot !== false) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(ox, oy, lw * 3, 0, Math.PI * 2); ctx.fill();
    }
  }

  root.PendulumRender = { BUCKETS, BG, bucketColor, fade, drawEnsemble };
})(window);
