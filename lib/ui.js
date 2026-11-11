// Shared UI for interactive pieces: panel toggling, sliders, toasts, first-visit hint,
// image export (PNG/JPG/WebP), video clip recording, sharing, fullscreen.
(function (root) {
  'use strict';
  const SITE = 'sirdevelop.github.io/generativeArt';
  // short links (folders at the site root that redirect to the piece): shown on saved images
  const SHORT = { 'double-pendulum': 'pendulum', lorenz: 'lorenz', 'logistic-map': 'rabbits', 'three-body': 'planets', mandelbrot: 'mandelbrot', coastline: 'coastline' };
  const piece = (location.pathname.match(/pieces\/([^/]+)/) || [])[1];
  const LINK = SHORT[piece] ? `${SITE}/${SHORT[piece]}` : SITE;
  const $ = id => document.getElementById(id);
  const store = {   // localStorage can throw (private mode, blocked storage)
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  };

  let toastEl, toastTimer;
  function toast(msg, ms = 1800) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.style.opacity = 1;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => (toastEl.style.opacity = 0), ms);
  }

  // One-time coach mark, dismissed on first pointer down.
  function hint(key, text) {
    if (store.get('hint:' + key)) return;
    const el = document.createElement('div'); el.className = 'coach'; el.textContent = text;
    document.body.appendChild(el);
    const done = () => { el.style.opacity = 0; setTimeout(() => el.remove(), 600); store.set('hint:' + key, '1'); removeEventListener('pointerdown', done); };
    addEventListener('pointerdown', done);
    setTimeout(done, 7000);
  }

  // Panel + floating "Controls" button. Closed by default on phones.
  function panel(panelEl) {
    const fab = document.createElement('button'); fab.className = 'fab'; fab.textContent = 'Controls';
    document.body.appendChild(fab);
    const set = hidden => { panelEl.classList.toggle('hidden', hidden); fab.classList.toggle('visible', hidden); };
    const toggle = () => set(!panelEl.classList.contains('hidden'));
    fab.onclick = toggle;
    if (matchMedia('(max-width: 640px)').matches) set(true);
    return { toggle, set };
  }

  // <label>Name <output/></label><input type=range>; returns { el, set(value) }.
  function slider(parent, o) {
    const label = document.createElement('label'); label.textContent = o.label + ' ';
    const out = document.createElement('output'); label.appendChild(out);
    const input = document.createElement('input'); input.type = 'range';
    if (o.id) input.id = o.id;
    Object.assign(input, { min: o.min, max: o.max, step: o.step ?? 'any' });
    const toUi = o.toUi || (v => v), fromUi = o.fromUi || (v => v), fmt = o.format || (v => String(v));
    const set = v => { input.value = toUi(v); out.textContent = fmt(v); };
    input.addEventListener('input', () => { const v = fromUi(+input.value); out.textContent = fmt(v); o.onInput(v); });
    parent.append(label, input); set(o.value);
    return { el: input, set };
  }

  function stamp(canvas, signature = true) {
    const out = document.createElement('canvas'); out.width = canvas.width; out.height = canvas.height;
    const o = out.getContext('2d');
    o.fillStyle = '#05050a'; o.fillRect(0, 0, out.width, out.height);   // opaque, for JPG
    o.drawImage(canvas, 0, 0);
    if (signature) {
      const S = Math.min(out.width, out.height);
      o.font = `500 ${Math.round(S * 0.016)}px system-ui, -apple-system, sans-serif`;
      o.fillStyle = 'rgba(255,255,255,0.4)'; o.textAlign = 'right'; o.textBaseline = 'bottom';
      o.fillText(LINK, out.width - S * 0.025, out.height - S * 0.025);
    }
    return out;
  }
  const FORMATS = { png: ['image/png', undefined], jpg: ['image/jpeg', 0.92], webp: ['image/webp', 0.95] };
  const toBlob = (canvas, fmt) => new Promise(res => stamp(canvas).toBlob(res, ...FORMATS[fmt]));

  function download(blob, filename) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  async function saveImage(canvas, name, fmt = 'png') {
    const blob = await toBlob(canvas, fmt);
    if (!blob || (fmt !== 'png' && blob.type === 'image/png')) {   // browser lacks this encoder (e.g. old Safari + WebP)
      toast(`${fmt.toUpperCase()} isn't supported in this browser. Saved PNG instead.`);
      return download(await toBlob(canvas, 'png'), `${name}-${Date.now()}.png`);
    }
    download(blob, `${name}-${Date.now()}.${fmt}`);
    toast(`Saved ${canvas.width}×${canvas.height} ${fmt.toUpperCase()}`);
  }

  // Record a short clip straight from the canvas. MP4 where supported (Safari, recent Chrome), else WebM.
  let recording = false;
  function recordClip(canvas, name, seconds = 6) {
    if (recording) return;
    if (!canvas.captureStream || !root.MediaRecorder) return toast('Video recording is not supported in this browser');
    const types = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'];
    const mimeType = types.find(t => MediaRecorder.isTypeSupported(t));
    const rec = new MediaRecorder(canvas.captureStream(60), { mimeType, videoBitsPerSecond: 16e6 });
    const chunks = []; rec.ondataavailable = e => e.data.size && chunks.push(e.data);
    let dot = document.querySelector('.recdot');
    if (!dot) { dot = document.createElement('div'); dot.className = 'recdot'; document.body.appendChild(dot); }
    let left = seconds; dot.textContent = `REC ${left}s`; dot.classList.add('on');
    const tick = setInterval(() => { left--; dot.textContent = `REC ${Math.max(0, left)}s`; }, 1000);
    rec.onstop = () => {
      clearInterval(tick); dot.classList.remove('on'); recording = false;
      const ext = mimeType.startsWith('video/mp4') ? 'mp4' : 'webm';
      download(new Blob(chunks, { type: mimeType }), `${name}-${Date.now()}.${ext}`);
      toast(`Saved ${seconds}s ${ext.toUpperCase()} clip`);
    };
    recording = true; rec.start(250); setTimeout(() => rec.stop(), seconds * 1000);
  }

  // Native share sheet with the image when available (phones, Safari, Chrome on macOS/Windows),
  // otherwise a small menu of share links.
  async function share(canvas, name, title, anchorEl) {
    const url = location.href, text = `${title}: made with ${SITE}`;
    try {
      const blob = await toBlob(canvas, 'png');
      const file = new File([blob], `${name}.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title, text, url }); return; }
      if (navigator.share && matchMedia('(pointer: coarse)').matches) { await navigator.share({ title, text, url }); return; }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    const u = encodeURIComponent(url), tx = encodeURIComponent(text);
    menu(anchorEl, [
      ['Copy link', async () => { try { await navigator.clipboard.writeText(url); toast('Link copied'); } catch { toast('Copy the address bar to share'); } }],
      ['Share on X', () => open(`https://x.com/intent/post?text=${tx}&url=${u}`)],
      ['Share on Reddit', () => open(`https://www.reddit.com/submit?url=${u}&title=${encodeURIComponent(title)}`)],
      ['Share on Facebook', () => open(`https://www.facebook.com/sharer/sharer.php?u=${u}`)],
      ['Share on WhatsApp', () => open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`)],
      ['Email', () => (location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n' + url)}`)],
    ]);
  }
  const open = href => window.open(href, '_blank', 'noopener');

  function menu(anchor, items) {
    document.querySelectorAll('.menu').forEach(m => m.remove());
    const m = document.createElement('div'); m.className = 'menu';
    for (const [label, fn] of items) { const b = document.createElement('button'); b.textContent = label; b.onclick = () => { m.remove(); fn(); }; m.appendChild(b); }
    document.body.appendChild(m);
    const r = anchor.getBoundingClientRect(), mr = m.getBoundingClientRect();
    m.style.left = Math.max(8, Math.min(innerWidth - mr.width - 8, r.left)) + 'px';
    m.style.top = (r.bottom + mr.height + 8 < innerHeight ? r.bottom + 6 : r.top - mr.height - 6) + 'px';
    setTimeout(() => addEventListener('pointerdown', function close(e) { if (!m.contains(e.target)) { m.remove(); removeEventListener('pointerdown', close); } }), 0);
  }

  function fullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else (document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen)?.call(document.documentElement);
  }

  // Standard "Save & share" section: format picker, Save, Record clip, Share, Fullscreen.
  function exportSection(parent, { canvas, name, title }) {
    const sec = document.createElement('div'); sec.className = 'section';
    sec.innerHTML = `<div class="section-title">Save &amp; share</div>
      <div class="row"><select aria-label="Image format"><option value="png">PNG</option><option value="jpg">JPG</option><option value="webp">WebP</option></select>
      <button class="primary" data-a="save">Save image</button></div>
      <div class="row"><button data-a="clip" class="rec">● Record 6s clip</button><button data-a="share">Share…</button></div>
      <div class="row"><button data-a="fs">Fullscreen</button></div>`;
    parent.appendChild(sec);
    const sel = sec.querySelector('select');
    sel.value = store.get('fmt') || 'png';
    sel.onchange = () => store.set('fmt', sel.value);
    const act = a => sec.querySelector(`[data-a=${a}]`);
    act('save').onclick = () => saveImage(canvas, name, sel.value);
    act('clip').onclick = () => recordClip(canvas, name);
    act('share').onclick = () => share(canvas, name, title, act('share'));
    act('fs').onclick = fullscreen;
    if (!(document.fullscreenEnabled || document.webkitFullscreenEnabled)) act('fs').parentElement.remove();
    return { save: () => saveImage(canvas, name, sel.value), clip: () => recordClip(canvas, name) };
  }

  root.UI = { toast, hint, panel, slider, saveImage, recordClip, share, fullscreen, exportSection, store, SITE, LINK };
})(window);
