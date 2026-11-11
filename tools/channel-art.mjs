#!/usr/bin/env node
// YouTube channel art: Mandelbrot set only, no text, rendered at full resolution from pieces/mandelbrot.
//   assets/brand/banner.png        2560x1440: a mini Mandelbrot on the set's antenna, its needle running the full width
//   assets/brand/avatar.png        800x800: the full set, Electric palette (matches the banner)
//   assets/brand/avatar-alt.png    800x800: the mini Mandelbrot
//   assets/brand/channel-art-preview.png  how each device crops the banner + the avatar at real sizes
// Usage: node tools/channel-art.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets/brand');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BW = 2560, BH = 1440, BAND = 423;   // YouTube: desktop shows the middle 2560x423, phones the middle 1546x423
// s = half the view height. The banner's visible band is only 423 of 1440 px tall, so scale s up to frame that band.
const band = s => s * BH / BAND;
const JOBS = [
  ['banner.png', BW, BH, `cx=-1.7652&cy=0&s=${band(0.024)}&pal=2&iter=4000`],
  ['avatar.png', 800, 800, 'cx=-0.77&cy=0&s=1.32&pal=2&iter=1500'],
  ['avatar-alt.png', 800, 800, 'cx=-1.75487&cy=0&s=0.035&pal=2&iter=3000'],
];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 1200000,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const urls = {};
  for (const [name, w, h, q] of JOBS) {
    const p = await browser.newPage();
    p.on('pageerror', e => console.error(`  ${name}: ${e.message}`));
    await p.goto(pathToFileURL(path.join(ROOT, 'pieces/mandelbrot/index.html')).href + `?record=1&w=${w}&h=${h}&${q}`);
    await p.waitForFunction('window.__recorder && window.__recorder.ready', { timeout: 60000 });
    urls[name] = await p.evaluate(() => window.__recorder.frame('image/png'));
    fs.writeFileSync(path.join(OUT, name), Buffer.from(urls[name].split(',')[1], 'base64'));
    await p.close(); console.log('wrote assets/brand/' + name);
  }
  // preview sheet
  const crop = (src, w, h, dw) => `<div style="width:${dw}px;height:${dw * h / w}px;overflow:hidden;border-radius:8px;position:relative">
     <img src="${src}" style="position:absolute;width:${dw * BW / w}px;left:${-dw * (BW - w) / 2 / w}px;top:${-dw * (BH - h) / 2 / w}px"></div>`;
  const av = (src, s) => `<img src="${src}" style="width:${s}px;height:${s}px;border-radius:50%">`;
  const row = b => `<div style="display:flex;gap:16px;align-items:flex-start">${crop(urls[b], 2560, BAND, 760)}${crop(urls[b], 1546, BAND, 420)}<img src="${urls[b]}" style="width:240px;border-radius:6px"></div>`;
  const sheet = await browser.newPage();
  await sheet.setViewport({ width: 1480, height: 700 });
  await sheet.setContent(`<!doctype html><body style="margin:0;background:#0f0f0f;color:#aaa;font:600 14px system-ui;padding:20px;display:flex;flex-direction:column;gap:10px">
    <div>banner.png: desktop · phone · TV</div>${row('banner.png')}
    <div>avatar.png &nbsp;·&nbsp; avatar-alt.png (real sizes: 160 / 48 / 24 px)</div>
    <div style="display:flex;gap:16px;align-items:center">${av(urls['avatar.png'], 160)}${av(urls['avatar.png'], 48)}${av(urls['avatar.png'], 24)}
      &nbsp;&nbsp;&nbsp; ${av(urls['avatar-alt.png'], 160)}${av(urls['avatar-alt.png'], 48)}${av(urls['avatar-alt.png'], 24)}</div></body>`);
  await new Promise(r => setTimeout(r, 500));
  await sheet.screenshot({ path: path.join(OUT, 'channel-art-preview.png'), fullPage: true });
  console.log('wrote assets/brand/channel-art-preview.png');
} finally { await browser.close(); }
