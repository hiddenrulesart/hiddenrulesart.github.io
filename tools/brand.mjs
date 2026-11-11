#!/usr/bin/env node
// Render logo / avatar options to assets/brand/ (1024x1024 PNG), plus a preview sheet showing
// each one cropped to a circle (as GitHub/YouTube display avatars) at large and tiny sizes.
// Usage: node tools/brand.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets/brand');
fs.mkdirSync(OUT, { recursive: true });
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const S = 1024;
const save = (name, dataUrl) => fs.writeFileSync(path.join(OUT, name), Buffer.from(dataUrl.split(',')[1], 'base64'));

// 1. The symbol: a white arm that splits into a rainbow fan ("tiny difference -> rainbow").
function symbol(S) {
  const c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d'), k = S / 1024;
  const bg = g.createRadialGradient(S * 0.5, S * 0.45, 0, S * 0.5, S * 0.5, S * 0.75);
  bg.addColorStop(0, '#17152b'); bg.addColorStop(1, '#05050a');
  g.fillStyle = bg; g.fillRect(0, 0, S, S);
  const P = [585 * k, 285 * k], E = [425 * k, 505 * k], L = 320 * k, N = 13;
  g.lineCap = 'round';
  g.translate(512 * k, 512 * k); g.scale(1.25, 1.25); g.translate(-546 * k, -539 * k);   // centre the mark, 25% larger
  g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1), a = (-14 + t * 118) * Math.PI / 180;          // fan angle from straight down
    const tip = [E[0] + L * Math.sin(a), E[1] + L * Math.cos(a)];
    const col = `hsl(${(200 + t * 330) % 360},100%,62%)`;
    g.strokeStyle = col; g.fillStyle = col;
    g.shadowColor = col; g.shadowBlur = 40 * k;
    g.lineWidth = 15 * k;
    g.beginPath(); g.moveTo(E[0], E[1]); g.lineTo(tip[0], tip[1]); g.stroke();
    g.beginPath(); g.arc(tip[0], tip[1], 17 * k, 0, 7); g.fill();
  }
  g.globalCompositeOperation = 'source-over'; g.shadowBlur = 30 * k; g.shadowColor = 'rgba(255,255,255,0.6)';
  g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineWidth = 22 * k;
  g.beginPath(); g.moveTo(P[0], P[1]); g.lineTo(E[0], E[1]); g.stroke();
  g.beginPath(); g.arc(P[0], P[1], 22 * k, 0, 7); g.fill();
  g.beginPath(); g.arc(E[0], E[1], 20 * k, 0, 7); g.fill();
  return c.toDataURL('image/png');
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 180000 });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 800 });
  await page.setContent('<!doctype html><body></body>');
  save('logo-1-symbol.png', await page.evaluate(`(${symbol})(${S})`));

  // 2-4: rendered from the real pieces in record mode
  await import(pathToFileURL(path.join(ROOT, 'pieces/double-pendulum/sim.js')).href);
  const sp = globalThis.DoublePendulumSim.createSim({ n: 200 }); sp.reset(120, 170, 1e-5);
  while (sp.divergence() < 0.015) sp.step(1 / 60, 8);
  const jobs = [
    ['logo-2-pendulums.png', 'double-pendulum', 'n=3000&a1=120&a2=170&spread=0.00001&trail=0.85&glow=0.22', Math.round((sp.time + 4.5) * 60)],
    ['logo-3-butterfly.png', 'lorenz', 'n=5000&spread=20&warm=12&trail=0.85&glow=0.11&rot=0&yaw=0.15&pitch=0.12&zoom=1.12', 150],
  ];
  for (const [name, piece, q, frames, size = S] of jobs) {
    const p = await browser.newPage();
    await p.goto(pathToFileURL(path.join(ROOT, 'pieces', piece, 'index.html')).href + `?record=1&w=${size}&h=${size}&${q}`);
    let url = await p.evaluate(n => { let u; for (let i = 0; i < n; i++) u = window.__recorder.frame(); return u; }, frames);
    if (size !== S) url = await p.evaluate(async (src, S) => {   // smooth upscale to full size
      const im = new Image(); im.src = src; await im.decode();
      const c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d');
      g.imageSmoothingQuality = 'high'; g.drawImage(im, 0, 0, S, S); return c.toDataURL('image/png');
    }, url, S);
    save(name, url);
    await p.close();
  }

  // preview sheet: circle crops at 256 / 40 / 20 px on GitHub's light and dark backgrounds
  const files = fs.readdirSync(OUT).filter(f => /^logo-\d.*\.png$/.test(f)).sort();
  const imgs = files.map(f => `data:image/png;base64,${fs.readFileSync(path.join(OUT, f)).toString('base64')}`);
  const cell = (src, i) => `<div class="c"><img class="big" src="${src}"><div class="row">
      <span class="light"><img style="width:40px" src="${src}"><img style="width:20px" src="${src}"></span>
      <span class="dark"><img style="width:40px" src="${src}"><img style="width:20px" src="${src}"></span></div>
      <div class="n">${i + 1}. ${files[i].replace(/^logo-\d-|\.png$/g, '')}</div></div>`;
  const sheet = await browser.newPage();
  await sheet.setViewport({ width: 1240, height: 420 });
  await sheet.setContent(`<!doctype html><style>
    body{margin:0;background:#0d1117;font:600 15px system-ui;color:#e6edf3;display:flex;gap:28px;padding:28px}
    .c{display:flex;flex-direction:column;align-items:center;gap:12px} img{border-radius:50%;display:block}
    .big{width:256px;height:256px} .row{display:flex;gap:10px} .row span{display:flex;gap:8px;align-items:center;padding:6px 10px;border-radius:8px}
    .light{background:#fff} .dark{background:#161b22;border:1px solid #30363d}</style>${imgs.map(cell).join('')}`);
  await sheet.screenshot({ path: path.join(OUT, 'preview.png') });
  console.log('Wrote', files.join(', '), '+ preview.png to assets/brand/');
} finally { await browser.close(); }
