#!/usr/bin/env node
// Render YouTube thumbnails (1280x720 JPEG) from the real pieces in record mode, with bold text.
// Usage: node tools/thumbnails.mjs   -> videos/<episode>/thumbnail.jpg (+ a phone-size preview sheet)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const W = 1280, H = 720;

await import(pathToFileURL(path.join(ROOT, 'pieces/double-pendulum/sim.js')).href);
const sp = globalThis.DoublePendulumSim.createSim({ n: 200 }); sp.reset(120, 170, 1e-5);
while (sp.divergence() < 0.015) sp.step(1 / 60, 8);

// art: [piece, query, frames, x-offset of the art (fraction of W), scale]; text: lines drawn on the right
// the 1,000-pendulum ensemble exactly as in the episode (150°/150°, 0.00001° spread)
const BURST = 'n=1000&a1=150&a2=150&spread=0.00001&trail=0.7&glow=0.35';
// No text on thumbnails: the art alone, centred and large (channel style, decided 2026-11-11)
const JOBS = [
  { out: 'videos/01-double-pendulum/thumbnail.jpg',          // the 1,000-pendulum burst from 3:30 of the episode
    art: [['double-pendulum', BURST.replace('glow=0.35', 'glow=0.5'), Math.round(21.6 * 60), 0, 'full']], text: [] },
  { out: 'videos/02-lorenz/thumbnail.jpg',                   // the butterfly attractor
    art: [['lorenz', 'n=5000&spread=20&warm=12&trail=0.85&glow=0.08&rot=0&yaw=2.4&pitch=0.12&zoom=1.2', 150, 0, 'full']], text: [] },
];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 180000 });
try {
  const done = [];
  for (const j of JOBS) {
    const p = await browser.newPage();
    const arts = [];
    for (const [piece, q, frames, dx, scale, thick] of j.art) {
      // 'full': render the piece at the thumbnail's own size (sharp, nothing cropped); otherwise a square to place
      const [rw, rh] = scale === 'full' ? [W, H] : [H, H];
      await p.goto(pathToFileURL(path.join(ROOT, 'pieces', piece, 'index.html')).href + `?record=1&w=${rw}&h=${rh}&${q}`);
      arts.push({ src: await p.evaluate(n => { let u; for (let i = 0; i < n; i++) u = window.__recorder.frame(); return u; }, frames), dx, scale, thick });
    }
    await p.setContent('<!doctype html><body></body>');
    const url = await p.evaluate(async ({ arts, W, H, text, top }) => {
      const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
      g.fillStyle = '#05050a'; g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = 'lighten';   // max, not sum: overlapping dark backgrounds stay dark
      for (const a of arts) {
        const im = new Image(); im.src = a.src; await im.decode(); const s = H * a.scale;
        let src = im;
        if (a.thick) {   // thin white arms: make the dark background transparent, then glow only the lines
          const t = document.createElement('canvas'); t.width = im.width; t.height = im.height; const tg = t.getContext('2d');
          tg.drawImage(im, 0, 0); const d = tg.getImageData(0, 0, t.width, t.height), px = d.data;
          for (let i = 0; i < px.length; i += 4) { const m = Math.max(px[i], px[i + 1], px[i + 2]); px[i + 3] = m < 14 ? 0 : m; }
          tg.putImageData(d, 0, 0); src = t;
          g.globalCompositeOperation = 'source-over';
          g.filter = 'drop-shadow(0 0 2px #fff) drop-shadow(0 0 9px rgba(200,190,255,0.95))';
        }
        if (a.scale === 'full') g.drawImage(src, 0, 0, W, H); else g.drawImage(src, W / 2 - s / 2 + a.dx * W, H / 2 - s / 2, s, s); g.filter = 'none'; g.globalCompositeOperation = 'lighten';
      }
      g.globalCompositeOperation = 'source-over';
      const font = size => `900 ${size}px "Helvetica Neue", Arial Black, system-ui, sans-serif`;
      if (text.length) {   // right-hand block: darken behind it so it always reads
        const gr = g.createLinearGradient(W * 0.4, 0, W, 0); gr.addColorStop(0, 'rgba(5,5,10,0)'); gr.addColorStop(0.45, 'rgba(5,5,10,0.75)');
        g.fillStyle = gr; g.fillRect(0, 0, W, H);
        const total = text.reduce((a, [, size]) => a + size * 0.95, 0); let y = H / 2 - total / 2;
        for (const [s, size, color] of text) {
          g.font = font(size); g.textAlign = 'right'; g.textBaseline = 'top'; g.shadowColor = 'rgba(0,0,0,0.9)'; g.shadowBlur = 24; g.fillStyle = color;
          g.fillText(s, W - 56, y); y += size * 0.95;
        }
      }
      if (top) {   // captions over the left and right halves, at the top
        top.forEach(([s, size, color], i) => {
          g.font = font(size); g.textAlign = 'center'; g.textBaseline = 'top'; g.shadowColor = 'rgba(0,0,0,0.95)'; g.shadowBlur = 24; g.fillStyle = color;
          g.fillText(s, i === 0 ? W * 0.25 : W * 0.74, 34);
        });
      }
      return c.toDataURL('image/jpeg', 0.92);
    }, { arts, W, H, text: j.text, top: j.top || null });
    fs.writeFileSync(path.join(ROOT, j.out), Buffer.from(url.split(',')[1], 'base64'));
    done.push(url); await p.close();
    console.log('wrote', j.out);
  }
  // preview: how they look in a phone feed (~360 px wide) and on desktop (~640 px)
  const sheet = await browser.newPage();
  await sheet.setViewport({ width: 1100, height: 640 });
  await sheet.setContent(`<!doctype html><body style="margin:0;background:#0f0f0f;display:flex;gap:24px;padding:24px;flex-wrap:wrap;align-items:flex-start">
    ${done.map(u => `<img src="${u}" style="width:640px;border-radius:12px"><img src="${u}" style="width:300px;border-radius:8px">`).join('')}</body>`);
  await sheet.screenshot({ path: path.join(ROOT, 'videos/thumbnails-preview.png'), fullPage: true });
} finally { await browser.close(); }
