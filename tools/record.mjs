#!/usr/bin/env node
// Render a piece frame-by-frame in headless Chrome and pipe the frames into ffmpeg.
// Every frame advances the simulation by exactly 1/fps seconds, so the video is
// perfectly smooth regardless of how slow rendering is.
//
// Usage:
//   node tools/record.mjs <piece | path/to/scene.html> [--w 3840] [--h 2160] [--fps 60] [--seconds 30]
//        [--out renders/<piece>.mp4] [--jpeg] [any other --key value is passed to the piece]
// Examples:
//   node tools/record.mjs double-pendulum --seconds 40
//   node tools/record.mjs double-pendulum --w 2160 --h 3840 --overlay 1 --spread 1e-7   # Short
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// ---- args
const argv = process.argv.slice(2);
const piece = argv[0];
if (!piece || piece.startsWith('--')) {
  console.error('Usage: node tools/record.mjs <piece> [--w 3840 --h 2160 --fps 60 --seconds 30 --out file.mp4 --jpeg]');
  process.exit(1);
}
const opts = { w: 3840, h: 2160, fps: 60, seconds: 30 };
const pass = {};
for (let i = 1; i < argv.length; i++) {
  const k = argv[i].replace(/^--/, '');
  const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : '1';
  if (k in opts) opts[k] = +v; else pass[k] = v;
}
const jpeg = 'jpeg' in pass; delete pass.jpeg;
const out = pass.out || path.join('renders', `${path.basename(piece, '.html')}-${opts.w}x${opts.h}-${Date.now()}.mp4`); delete pass.out;
fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
const totalFrames = Math.round(opts.seconds * opts.fps);

// ---- tiny static server for the repo
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const file = p.endsWith('/') ? path.join(p, 'index.html') : p;
  if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const query = new URLSearchParams({ ...pass, record: 1, w: opts.w, h: opts.h, fps: opts.fps });
// <piece> is a name under pieces/ or a path to any page with a window.__recorder (e.g. a video scene)
const pagePath = piece.includes('/') ? piece.replace(/^\.?\//, '') : `pieces/${piece}/`;
const url = `http://127.0.0.1:${port}/${pagePath}?${query}`;
console.log(`Rendering ${totalFrames} frames (${opts.seconds}s @ ${opts.fps}fps, ${opts.w}x${opts.h})\n  ${url}\n  -> ${out}`);

// ---- ffmpeg: frames in on stdin, high-quality H.264 out (YouTube re-encodes anyway)
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(opts.fps), '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out],
  { stdio: ['pipe', 'inherit', 'inherit'] });
const ffDone = new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg exited ' + c)))));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true,
  args: ['--hide-scrollbars', '--force-device-scale-factor=1'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: Math.min(opts.w, 1920), height: Math.min(opts.h, 1920) });
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction('window.__recorder && window.__recorder.ready', { timeout: 15000 });

  const t0 = Date.now();
  const type = jpeg ? 'image/jpeg' : 'image/png';
  for (let f = 0; f < totalFrames; f++) {
    const dataUrl = await page.evaluate((t) => window.__recorder.frame(t, 0.95), type);
    const buf = Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 30 === 0 || f === totalFrames - 1) {
      const el = (Date.now() - t0) / 1000, eta = el / (f + 1) * (totalFrames - f - 1);
      if (process.stdout.isTTY) process.stdout.write(`\r  frame ${f + 1}/${totalFrames}  ${(100 * (f + 1) / totalFrames).toFixed(1)}%  eta ${eta.toFixed(0)}s   `);
    }
  }
  ff.stdin.end();
  await ffDone;
  console.log(`\nDone: ${out}`);
} finally {
  await browser.close();
  server.close();
}
