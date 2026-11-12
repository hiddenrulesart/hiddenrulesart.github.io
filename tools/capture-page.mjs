#!/usr/bin/env node
// Capture a real interactive page (UI included) as frame-exact video, driven by a scripted mouse.
// Time is virtualized: performance.now / requestAnimationFrame only advance when we say so,
// so every frame is exactly 1/fps apart no matter how slow the screenshots are.
//
// Usage: node tools/capture-page.mjs <page path> <choreography.mjs> --seconds 20 --out file.mp4 [--w 1920 --h 1080 --scale 1 --fps 60]
//   choreography.mjs default-exports  async ({ page, W, H, fps, seconds }) => (t) => ({ x, y, down, wheel, banner })
//   i.e. a factory that returns, for each video time t, where the cursor is and whether the button is down.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const [pagePath, choreoPath, ...rest] = process.argv.slice(2);
const o = { w: 1920, h: 1080, scale: 1, fps: 60, seconds: 20, out: 'renders/capture.mp4' };
for (let i = 0; i < rest.length; i += 2) o[rest[i].replace(/^--/, '')] = isNaN(+rest[i + 1]) ? rest[i + 1] : +rest[i + 1];
const frames = Math.round(o.seconds * o.fps);

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const file = p.endsWith('/') ? path.join(p, 'index.html') : p;
  if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));

fs.mkdirSync(path.dirname(path.resolve(o.out)), { recursive: true });
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(o.fps), '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', o.out], { stdio: ['pipe', 'inherit', 'inherit'] });
const ffDone = new Promise((res, rej) => ff.on('close', c => (c ? rej(new Error('ffmpeg ' + c)) : res())));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: o.w, height: o.h, deviceScaleFactor: o.scale });
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.evaluateOnNewDocument(() => {
    // virtual clock
    let vt = 0, cbs = [];
    performance.now = () => vt;
    window.requestAnimationFrame = cb => (cbs.push(cb), cbs.length);
    window.__tick = dt => { vt += dt * 1000; const c = cbs; cbs = []; c.forEach(f => f(vt)); };
    // visible cursor + optional banner
    addEventListener('DOMContentLoaded', () => {
      const c = document.createElement('div');
      c.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M4 2l15 11-6.5 1.2L16 21l-3 1.4-3.4-6.6L4 20z" fill="#fff" stroke="#000" stroke-width="1.3" stroke-linejoin="round"/></svg>';
      c.style.cssText = 'position:fixed;left:0;top:0;z-index:99999;pointer-events:none;transform:translate(-4px,-2px);transition:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,.5))';
      document.body.appendChild(c);
      addEventListener('mousemove', e => { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; }, true);
      const b = document.createElement('div'); b.id = '__banner';
      b.style.cssText = 'position:fixed;left:50%;bottom:5%;transform:translateX(-50%);z-index:99998;pointer-events:none;opacity:0;' +
        'background:rgba(16,16,28,.88);border:1px solid rgba(255,255,255,.18);color:#fff;border-radius:14px;padding:14px 26px;' +
        'font:600 28px system-ui,-apple-system,sans-serif;white-space:nowrap;box-shadow:0 10px 40px rgba(0,0,0,.5)';
      document.body.appendChild(b);
    });
  });
  await page.goto(`http://127.0.0.1:${server.address().port}/${pagePath}`, { waitUntil: 'load' });
  await page.evaluate(() => window.__tick(1 / 60));

  const choreo = (await import(pathToFileURL(path.resolve(choreoPath)).href)).default;
  const at = await choreo({ page, W: o.w, H: o.h, fps: o.fps, seconds: o.seconds });
  let down = false;
  for (let f = 0; f < frames; f++) {
    const t = f / o.fps, s = at(t);
    await page.mouse.move(s.x, s.y);
    if (s.down && !down) await page.mouse.down(); else if (!s.down && down) await page.mouse.up();
    down = !!s.down;
    if (s.wheel) await page.mouse.wheel({ deltaY: s.wheel });   // scroll-zoom, in pixels per frame
    await page.evaluate((dt, banner) => {
      const b = document.getElementById('__banner');
      if (banner) { b.textContent = banner.text; b.style.opacity = banner.alpha; } else b.style.opacity = 0;
      window.__tick(dt);
    }, 1 / o.fps, s.banner || null);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await ffDone;
  console.log(`Done: ${o.out}`);
} finally { await browser.close(); server.close(); }
