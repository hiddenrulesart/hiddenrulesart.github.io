#!/usr/bin/env node
// YouTube channel art, rendered from the real pieces (no text, like the thumbnails):
//   assets/brand/avatar.png   800x800 profile picture (shown as a circle)
//   assets/brand/banner.png   2560x1440 banner; the six pieces sit in the band every device shows
//   assets/brand/channel-art-preview.png  banner with device crops marked + avatar at real sizes
// Usage: node tools/channel-art.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets/brand');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BW = 2560, BH = 1440;
// YouTube's banner crops: everything shows on TV; desktop shows the middle 2560x423 band; phones the middle 1546x423
const SAFE = { w: 1546, h: 423 }, DESK = { w: 2560, h: 423 };

const BURST = 'n=1000&a1=150&a2=150&spread=0.00001&trail=0.7&glow=0.5';
const T = 520;   // tile render size (square)
// [name, page, query, frames]
const TILES = [
  ['three-body', 'three-body', 'preset=fig8&trail=9&thick=2.5&glow=0.9', 420],
  ['pendulums', 'double-pendulum', BURST, Math.round(21.6 * 60)],
  ['lorenz', 'lorenz', 'n=5000&spread=20&warm=12&trail=0.85&glow=0.09&rot=0&yaw=2.4&pitch=0.12&zoom=1.05', 150],
  ['logistic', 'logistic-map', 'r0=3.3&r1=3.98&x0=0.08&x1=1&detail=1200&contrast=0.9', 1],
  ['mandelbrot', 'mandelbrot', 'cx=-0.75&cy=0&s=1.4&pal=2&iter=600', 1],
  ['coastline', 'coastline', 'mode=0&D=1.25&seed=7&ui=0&depth=1&glow=1', 2],
];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 1200000,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const grab = async (page, query, frames, w, h) => {
  const p = await browser.newPage();
  p.on('pageerror', e => console.error(`  ${page}: ${e.message}`));
  await p.goto(pathToFileURL(path.join(ROOT, 'pieces', page, 'index.html')).href + `?record=1&w=${w}&h=${h}&${query}`);
  await p.waitForFunction('window.__recorder && window.__recorder.ready', { timeout: 30000 });
  const url = await p.evaluate(n => { let u; for (let i = 0; i < n; i++) u = window.__recorder.frame(); return u; }, frames);
  await p.close(); return url;
};
const save = (name, url) => fs.writeFileSync(path.join(OUT, name), Buffer.from(url.split(',')[1], 'base64'));

try {
  const tiles = [];
  for (const [name, page, q, frames] of TILES) { const t0 = Date.now(); console.log('  tile', name, '...'); tiles.push(await grab(page, q, frames, T, T)); console.log('    done in', ((Date.now() - t0) / 1000).toFixed(1), 's'); }
  const avatarBurst = await grab('double-pendulum', BURST, Math.round(21.6 * 60), 800, 800);

  const page = await browser.newPage();
  await page.setContent('<!doctype html><body></body>');
  const out = await page.evaluate(async ({ tiles, avatarBurst, BW, BH, SAFE, DESK, T }) => {
    const load = async src => { const im = new Image(); im.src = src; await im.decode(); return im; };
    // banner: tiles in one row across the desktop band; the middle four inside the phone-safe band
    const b = document.createElement('canvas'); b.width = BW; b.height = BH; const g = b.getContext('2d');
    g.fillStyle = '#05050a'; g.fillRect(0, 0, BW, BH);
    const size = SAFE.h * 0.96, n = tiles.length, gap = (SAFE.w - 4 * size) / 3;
    const step = size + gap, x0 = BW / 2 - (n - 1) / 2 * step;
    g.globalCompositeOperation = 'lighten';
    for (let i = 0; i < n; i++) {
      const im = await load(tiles[i]);
      // soft round mask so square tiles melt into the black
      const t = document.createElement('canvas'); t.width = t.height = T; const tg = t.getContext('2d');
      tg.drawImage(im, 0, 0);
      tg.globalCompositeOperation = 'destination-in';
      const m = tg.createRadialGradient(T / 2, T / 2, T * 0.3, T / 2, T / 2, T * 0.5);
      m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(1, 'rgba(0,0,0,0)');
      tg.fillStyle = m; tg.fillRect(0, 0, T, T);
      g.drawImage(t, x0 + i * step - size / 2, BH / 2 - size / 2, size, size);
    }
    g.globalCompositeOperation = 'source-over';
    const banner = b.toDataURL('image/png');

    // avatar: the 1,000-pendulum burst, centred, on the dark background
    const a = document.createElement('canvas'); a.width = a.height = 800; const ag = a.getContext('2d');
    ag.fillStyle = '#05050a'; ag.fillRect(0, 0, 800, 800);
    ag.drawImage(await load(avatarBurst), -40, -40, 880, 880);
    const avatar = a.toDataURL('image/png');
    return { banner, avatar };
  }, { tiles, avatarBurst, BW, BH, SAFE, DESK, T });
  save('banner.png', out.banner); save('avatar-burst.png', out.avatar);
  // profile picture: the symbol (white arm splitting into a rainbow) still reads at 24 px, where the burst blurs
  const sym = await browser.newPage(); await sym.setContent('<!doctype html><body></body>');
  save('avatar.png', await sym.evaluate(async src => { const im = new Image(); im.src = src; await im.decode();
    const c = document.createElement('canvas'); c.width = c.height = 800; const g = c.getContext('2d');
    g.imageSmoothingQuality = 'high'; g.drawImage(im, 0, 0, 800, 800); return c.toDataURL('image/png'); },
    'data:image/png;base64,' + fs.readFileSync(path.join(OUT, 'logo-1-symbol.png')).toString('base64')));
  console.log('wrote assets/brand/banner.png, avatar.png (symbol), avatar-burst.png');

  // preview: banner as TV / desktop / phone show it, plus the avatar as circles at real sizes
  const symbol = 'data:image/png;base64,' + fs.readFileSync(path.join(OUT, 'logo-1-symbol.png')).toString('base64');
  const crop = (w, h, dw) => `<div style="width:${dw}px;height:${dw * h / w}px;overflow:hidden;border-radius:8px;position:relative">
     <img src="${out.banner}" style="position:absolute;width:${dw * BW / w}px;left:${-dw * (BW - w) / 2 / w}px;top:${-dw * (BH - h) / 2 / w}px"></div>`;
  const av = (src, s) => `<img src="${src}" style="width:${s}px;height:${s}px;border-radius:50%">`;
  const sheet = await browser.newPage();
  await sheet.setViewport({ width: 1300, height: 900 });
  await sheet.setContent(`<!doctype html><body style="margin:0;background:#0f0f0f;color:#aaa;font:600 14px system-ui;padding:20px;display:flex;flex-direction:column;gap:12px">
    <div>Desktop</div>${crop(DESK.w, DESK.h, 1240)}
    <div>Phone</div>${crop(SAFE.w, SAFE.h, 620)}
    <div>TV (full image)</div><img src="${out.banner}" style="width:420px;border-radius:8px">
    <div>Profile picture: A = pendulum burst (alternative), B = symbol (avatar.png)</div>
    <div style="display:flex;gap:18px;align-items:center">A ${av(out.avatar, 160)}${av(out.avatar, 48)}${av(out.avatar, 24)}
      &nbsp;&nbsp; B ${av(symbol, 160)}${av(symbol, 48)}${av(symbol, 24)}</div></body>`);
  await sheet.screenshot({ path: path.join(OUT, 'channel-art-preview.png'), fullPage: true });
  console.log('wrote assets/brand/channel-art-preview.png');
} finally { await browser.close(); }
