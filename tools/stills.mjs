#!/usr/bin/env node
// Save still frames of a scene or piece at given video times, for checking a scene before rendering it.
// Usage: node tools/stills.mjs <page path> "<query>" <t1,t2,...> <outPrefix> [--w 960 --h 540 --fps 30]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const [page, query, times, prefix, ...rest] = process.argv.slice(2);
const o = { w: 960, h: 540, fps: 30 };
for (let i = 0; i < rest.length; i += 2) o[rest[i].replace(/^--/, '')] = +rest[i + 1];
const T = times.split(',').map(Number);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 600000,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
try {
  const p = await browser.newPage();
  p.on('pageerror', e => console.error('page error:', e.message));
  p.on('console', m => m.type() === 'error' && console.error('console:', m.text()));
  await p.goto(pathToFileURL(path.join(ROOT, page)).href + `?record=1&w=${o.w}&h=${o.h}&fps=${o.fps}&${query}`);
  await p.waitForFunction('window.__recorder && window.__recorder.ready', { timeout: 60000 });
  let f = 0;
  for (const t of T) {
    const n = Math.round(t * o.fps) + 1 - f;
    const url = await p.evaluate(n => { let u; for (let i = 0; i < n; i++) u = window.__recorder.frame(); return u; }, Math.max(1, n));
    f += Math.max(1, n);
    const out = `${prefix}-${String(t).padStart(5, '0')}.png`;
    fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64')); console.log(out);
  }
} finally { await browser.close(); }
