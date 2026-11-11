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
const JOBS = [
  { out: 'videos/01-double-pendulum/thumbnail.jpg',
    art: ['double-pendulum', 'n=3000&a1=120&a2=170&spread=0.00001&trail=0.8&glow=0.18', Math.round((sp.time + 4.5) * 60), -0.12, 1.45],
    text: [['0.00001°', 168, '#ffffff'], ['APART', 120, '#ffcf4a']] },
  { out: 'videos/02-lorenz/thumbnail.jpg',
    art: ['lorenz', 'n=5000&spread=20&warm=12&trail=0.85&glow=0.08&rot=0&yaw=2.4&pitch=0.12&zoom=1.15', 150, -0.2, 1.05],
    text: [['ONE', 128, '#ffffff'], ['ROUNDING', 128, '#ffffff'], ['ERROR', 128, '#ff5d73']] },
];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 180000 });
try {
  const done = [];
  for (const j of JOBS) {
    const [piece, q, frames, dx, scale] = j.art;
    const p = await browser.newPage();
    await p.goto(pathToFileURL(path.join(ROOT, 'pieces', piece, 'index.html')).href + `?record=1&w=${H}&h=${H}&${q}`);
    const art = await p.evaluate(n => { let u; for (let i = 0; i < n; i++) u = window.__recorder.frame(); return u; }, frames);
    await p.setContent('<!doctype html><body></body>');
    const url = await p.evaluate(async ({ art, W, H, dx, scale, text }) => {
      const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
      g.fillStyle = '#05050a'; g.fillRect(0, 0, W, H);
      const im = new Image(); im.src = art; await im.decode();
      const s = H * scale; g.drawImage(im, W / 2 - s / 2 + dx * W, H / 2 - s / 2, s, s);
      // darken the right side so the text always reads
      const gr = g.createLinearGradient(W * 0.4, 0, W, 0); gr.addColorStop(0, 'rgba(5,5,10,0)'); gr.addColorStop(0.45, 'rgba(5,5,10,0.75)');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      const total = text.reduce((a, [, size]) => a + size * 0.95, 0);
      let y = H / 2 - total / 2;
      for (const [s, size, color] of text) {
        g.font = `900 ${size}px "Helvetica Neue", Arial Black, system-ui, sans-serif`; g.textAlign = 'right'; g.textBaseline = 'top';
        g.shadowColor = 'rgba(0,0,0,0.9)'; g.shadowBlur = 24; g.fillStyle = color;
        g.fillText(s, W - 56, y); y += size * 0.95;
      }
      return c.toDataURL('image/jpeg', 0.92);
    }, { art, W, H, dx, scale, text: j.text });
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
