#!/usr/bin/env node
// Build episode 3: "One line of algebra about rabbits hides infinity" (logistic map)
//   1. Narration: each line in voice.json -> ElevenLabs TTS (cached by text+voice+model).
//   2. Timing: every scene's length and internal cues are derived from the narration lengths.
//   3. Render: each scene via tools/record.mjs (or tools/capture-page.mjs for the website);
//      clips are cached by a hash of their source files + parameters, so edits only re-render what changed.
//   4. Assemble: crossfade all scenes, lay narration at the computed offsets, normalize loudness.
//
// Usage: node videos/03-logistic-map/build.mjs [--4k] [--placeholder] [--only a,b] [--voice <id>] [--model <id>] [--scenes N] [--name tag]
//   --scenes N     build only the first N scenes (a quick preview); --name adds a tag to the output file
//   --placeholder  macOS `say` instead of ElevenLabs (free, for timing tests)
// Needs ELEVENLABS_API_KEY in <repo>/.env (git-ignored) or the environment.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const OUT = path.join(HERE, 'out');
const REL = path.relative(ROOT, HERE);
fs.mkdirSync(path.join(OUT, 'audio'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'clips'), { recursive: true });

const args = process.argv.slice(2);
const arg = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const K4 = args.includes('--4k');
const [W, H] = K4 ? [3840, 2160] : [1920, 1080];
const FPS = 60, XF = 0.6;   // crossfade between scenes

// ---- config / secrets
const envFile = path.join(ROOT, '.env');
if (fs.existsSync(envFile)) for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
}
const KEY = process.env.ELEVENLABS_API_KEY;
const VOICE = arg('--voice', process.env.ELEVENLABS_VOICE_ID || 'Aa6nEBJJMKJwJkCx8VU2'); // "Quentin": deep, calm narrator/educator (was Brian nPczCjzI2devNBz1zQrb)
const MODEL = arg('--model', process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2');
const SETTINGS = { stability: 0.45, similarity_boost: 0.8, style: 0.15, use_speaker_boost: true };
const sha = s => crypto.createHash('sha1').update(s).digest('hex').slice(0, 10);

const { segments } = JSON.parse(fs.readFileSync(path.join(HERE, 'voice.json'), 'utf8'));

// ---- 1. narration
async function tts(seg, prev, next) {
  if (args.includes('--placeholder')) {
    const file = path.join(OUT, 'audio', `${seg.id}-say-${sha(seg.text)}.m4a`);
    if (!fs.existsSync(file)) {
      const aiff = file.replace(/\.m4a$/, '.aiff');
      execFileSync('say', ['-r', '165', '-o', aiff, seg.text]);
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', aiff, '-ar', '44100', '-c:a', 'aac', file]); fs.rmSync(aiff);
    }
    return file;
  }
  const file = path.join(OUT, 'audio', `${seg.id}-${sha(JSON.stringify([seg.text, VOICE, MODEL, SETTINGS]))}.mp3`);
  if (fs.existsSync(file)) return file;
  if (!KEY) throw new Error('ELEVENLABS_API_KEY missing: put it in ' + envFile);
  console.log(`  TTS: ${seg.id}`);
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
    // previous/next text keeps intonation continuous across separately generated lines
    body: JSON.stringify({ text: seg.text, model_id: MODEL, voice_settings: SETTINGS, previous_text: prev?.text, next_text: next?.text }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}
const probeDur = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();


// ---- 2. scenes. voice: [[segmentId, gapBefore]]; tail: seconds after the last line; min: minimum length.
// page: scene in ./scenes; path: any page relative to the repo root (e.g. the logistic-map piece in record mode).
const f = (x, d = 3) => (+x).toFixed(d);
const ens = (o) => Object.entries(o).flatMap(([k, v]) => ['--' + k, String(v)]);
const LOGI = 'pieces/logistic-map/index.html';
const SCENES = [
  { key: 'hook', path: LOGI, voice: [['hook', 0.6], ['hook2', 0.5]], tail: 1.6,
    args: c => ens({ dive: 1, diveRate: 0.32, detail: 500, r0: 2.5, r1: 4, x0: 0, x1: 1,
      eqIn: f(c.at('hook') + c.d('hook') * 0.35, 2), eqOut: f(c.end('hook2') + 0.6, 2) }) },
  { key: 'rabbits', page: 'rabbits', voice: [['rab1', 0.6], ['rab2', 0.6], ['rab3', 0.6], ['rab4', 0.7], ['rab5', 0.7]], tail: 1,
    // halfAt: "x equals zero point five"; e1..e4: each term of the equation as it is spoken
    args: c => ens({ xAt: f(c.at('rab1') + c.d('rab1') * 0.45, 2), halfAt: f(c.at('rab1') + c.d('rab1') * 0.72, 2),
      growAt: f(c.at('rab2') + c.d('rab2') * 0.15, 2), rAt: f(c.at('rab2') + c.d('rab2') * 0.5, 2),
      foodAt: f(c.at('rab3') + c.d('rab3') * 0.15, 2),
      eqAt: f(c.at('rab4'), 2), e1: f(c.at('rab4') + c.d('rab4') * 0.12, 2), e2: f(c.at('rab4') + c.d('rab4') * 0.3, 2),
      e3: f(c.at('rab4') + c.d('rab4') * 0.47, 2), e4: f(c.at('rab4') + c.d('rab4') * 0.68, 2),
      mayAt: f(c.at('rab5') + c.d('rab5') * 0.2, 2) }) },
  { key: 'dial', page: 'dial', voice: [['dial1', 0.6], ['dial2', 0.6], ['dial3', 0.6], ['dial4', 0.6], ['dial5', 0.7]], tail: 1.4,
    // r at each spoken value: 2.8 (settles), 3.2 (2), 3.5 (4), 3.555 (8), 3.5665 (16), 3.7 (chaos)
    args: c => ens({ k1: f(c.at('dial1') + c.d('dial1') * 0.55, 2), k2: f(c.at('dial2') + 0.3, 2),
      k4: f(c.at('dial3') + c.d('dial3') * 0.35, 2), k8: f(c.at('dial3') + c.d('dial3') * 0.68, 2),
      k16: f(c.at('dial3') + c.d('dial3') * 0.88, 2), kc: f(c.at('dial4') + c.d('dial4') * 0.3, 2) }) },
  { key: 'picture', page: 'diagram', voice: [['pic1', 0.7], ['pic1b', 0.5], ['pic2', 0.6], ['pic3', 0.6]], tail: 0.8,
    // the diagram builds during pic1; the cursor stops at one, two, four values and chaos during pic1b;
    // it sweeps left to right again during pic2
    args: c => ens({ sweepAt: f(c.at('pic1') + c.d('pic1') * 0.42, 2), sweepEnd: f(c.end('pic1') + 0.2, 2),
      s1: f(c.at('pic1b') + c.d('pic1b') * 0.12, 2), s2: f(c.at('pic1b') + c.d('pic1b') * 0.33, 2),
      s4: f(c.at('pic1b') + c.d('pic1b') * 0.47, 2), sc: f(c.at('pic1b') + c.d('pic1b') * 0.68, 2),
      againAt: f(c.at('pic2') + c.d('pic2') * 0.25, 2), againEnd: f(c.end('pic2'), 2),
      gapsAt: f(c.at('pic3') + c.d('pic3') * 0.15, 2), threeAt: f(c.at('pic3') + c.d('pic3') * 0.6, 2) }) },
  { key: 'window', path: LOGI, voice: [['win1', 0.5], ['win2', 0.7]], tail: 2.4,
    // zoom from the whole picture into the period-3 window, then into the copy of the whole inside it
    args: c => ens({ detail: 700, r0: 2.5, r1: 4, x0: 0, x1: 1, zoom: 1, zr0: 3.8414, zr1: 3.8573, zx0: 0.44, zx1: 0.56,
      zmr0: 3.8205, zmr1: 3.8655, zmx0: 0, zmx1: 1, zoomAt: 0.3, zoomMid: f(c.at('win1') + c.d('win1') * 0.25, 2), zoomEnd: f(c.at('win1') + c.d('win1') * 0.68, 2),
      cap1: 'Period Three Implies Chaos', cap2: 'T.-Y. Li and J. A. Yorke, 1975', capIn: f(c.at('win2') + c.d('win2') * 0.55, 2), capOut: f(c.dur - 0.5, 2) }) },
  { key: 'feigenbaum', page: 'feigenbaum',
    voice: [['feig1', 0.6], ['feig2', 0.6], ['feig3', 0.6], ['feig4', 0.6], ['feig5', 0.7], ['feig6', 0.8], ['feig7', 0.6]], tail: 1.4,
    // split lines appear as each value is spoken (sp1..sp4); gap rows likewise (g1..g3)
    args: c => ens({ splitsAt: f(c.at('feig1') + c.d('feig1') * 0.55, 2),
      sp1: f(c.at('feig2') + c.d('feig2') * 0.2, 2), sp2: f(c.at('feig2') + c.d('feig2') * 0.38, 2),
      sp3: f(c.at('feig2') + c.d('feig2') * 0.58, 2), sp4: f(c.at('feig2') + c.d('feig2') * 0.75, 2),
      g1: f(c.at('feig3') + c.d('feig3') * 0.35, 2), g2: f(c.at('feig3') + c.d('feig3') * 0.62, 2), g3: f(c.at('feig3') + c.d('feig3') * 0.86, 2),
      ratioAt: f(c.at('feig4') + c.d('feig4') * 0.2, 2), limitAt: f(c.at('feig4') + c.d('feig4') * 0.7, 2),
      sumAt: f(c.at('feig5') + c.d('feig5') * 0.2, 2), accumAt: f(c.at('feig5') + c.d('feig5') * 0.62, 2),
      sineAt: f(c.at('feig6'), 2), sameAt: f(c.at('feig6') + c.d('feig6') * 0.72, 2),
      humpAt: f(c.at('feig7') + c.d('feig7') * 0.05, 2), univAt: f(c.at('feig7') + c.d('feig7') * 0.5, 2) }) },
  { key: 'dive', path: LOGI, voice: [['dive1', 0.6], ['dive2', 0.6]], tail: 3,
    // the dive must pass 10^6 magnification while dive2 plays: rate chosen from the scene length
    args: c => ens({ dive: 1, detail: 500, r0: 2.95, r1: 3.6, x0: 0.25, x1: 0.95, diveRate: f(diveRate(c.end('dive2') - 1.5), 3),
      readout: 1, scaleIn: f(c.at('dive1') + c.d('dive1') * 0.45, 2), scaleOut: f(c.end('dive1') + 0.3, 2) }) },
  { key: 'site', capture: { page: 'pieces/logistic-map/', query: '', choreo: 'scenes/site-choreo.mjs' },
    voice: [['site', 0.6]], tail: 4.5, min: 15 },
  { key: 'next', page: 'next', voice: [['next', 0.7]], tail: 4.5,
    args: c => ens({ flingAt: f(c.at('next') + c.d('next') * 0.55, 2), nextAt: f(c.end('next') + 0.6, 2) }) },
];
// doublings per second so the dive (starting at the 'Period doubling' view, 2.3x) reaches 1.2e6x at time T
function diveRate(T) { return Math.log(1.2e6 / 2.3) / Math.log(4.669201609) / T; }

const NS = +arg('--scenes', 0);
if (NS) SCENES.splice(NS);
const needed = new Set(SCENES.flatMap(sc => sc.voice.map(v => v[0])));

console.log('1/4 Narration');
const audio = {};
for (let i = 0; i < segments.length; i++) {
  if (!needed.has(segments[i].id)) continue;
  const file = await tts(segments[i], segments[i - 1], segments[i + 1]);
  audio[segments[i].id] = { file, d: probeDur(file) };
}

// timing
let clock = 0;
const placed = [];   // [file, absoluteStart]
for (const [i, s] of SCENES.entries()) {
  const at = {}; let t = 0;
  for (const [id, gap] of s.voice) { t += gap; at[id] = t; t += audio[id].d; }
  s.dur = Math.max(s.min || 0, t + s.tail);
  s.start = clock;
  for (const [id] of s.voice) placed.push([audio[id].file, clock + at[id]]);
  const c = { at: id => at[id], end: id => at[id] + audio[id].d, d: id => audio[id].d, dur: s.dur };
  s.extra = s.args ? s.args(c) : [];
  if (s.cues) s.cueJson = JSON.stringify(Object.fromEntries(Object.entries(s.cues(c)).map(([k, v]) => [k, +f(v, 3)])));
  clock += s.dur - (i < SCENES.length - 1 ? XF : 0);
}
const total = clock;
console.log(`2/4 Timing: ${SCENES.length} scenes, total ${Math.floor(total / 60)}:${f(total % 60, 1).padStart(4, '0')}`);
for (const s of SCENES) console.log(`  ${s.key.padEnd(10)} ${f(s.start, 1).padStart(6)}s  +${f(s.dur, 1)}s`);

// --args: print each scene's page and query (for checking stills with tools/stills.mjs)
if (args.includes('--args')) {
  const q = a => { const o = []; for (let i = 0; i < a.length; i += 2) o.push(a[i].slice(2) + '=' + encodeURIComponent(a[i + 1])); return o.join('&'); };
  console.log(JSON.stringify(SCENES.filter(s => !s.capture).map(s => [s.key, s.path || path.join(REL, 'scenes', s.page + '.html'),
    q([...s.extra, '--duration', f(s.dur)]), +f(s.dur, 2)])));
  process.exit(0);
}
// --audio-only: just the narration, laid out with the final timing, for review before rendering anything
if (args.includes('--audio-only')) {
  const file = path.join(OUT, 'episode03-narration.mp3');
  let fc = placed.map(([, at], k) => `[${k}:a]adelay=${Math.round(at * 1000)}:all=1[a${k}];`).join('');
  fc += placed.map((_, k) => `[a${k}]`).join('') + `amix=inputs=${placed.length}:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=44100,apad,atrim=0:${f(total)}[a]`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...placed.flatMap(p => ['-i', p[0]]), '-filter_complex', fc, '-map', '[a]', '-c:a', 'libmp3lame', '-b:a', '192k', file]);
  console.log(`Narration preview: ${file}`);
  process.exit(0);
}

// ---- 3. render (cached)
const only = arg('--only', '')?.split(',').filter(Boolean);
const deps = ['lib/scene.js', 'tools/record.mjs', 'tools/capture-page.mjs'];
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
console.log(`3/4 Render (${W}x${H})`);
for (const s of SCENES) {
  const page = s.path || path.join(REL, 'scenes', s.page + '.html');
  const src = s.capture ? [s.capture.page + 'index.html', path.join(REL, s.capture.choreo), 'lib/ui.js', 'lib/ui.css'] : [page];
  if (s.page) src.push(path.join(REL, 'scenes/bif.js'));
  if (s.page === 'next') src.push('pieces/three-body/sim.js');
  const key = sha(JSON.stringify([src.map(read), deps.map(read), s.extra, s.cueJson, f(s.dur), W, H, FPS]));
  s.file = path.join(OUT, 'clips', `${s.key}-${W}-${key}.mp4`);
  if (fs.existsSync(s.file) && !(only && only.includes(s.key))) { console.log(`  ${s.key}: cached`); continue; }
  console.log(`  ${s.key}: rendering ${f(s.dur, 1)}s`);
  // render to a temp file and rename only when complete, so a crashed render is never mistaken for a cached clip
  const tmp = s.file.replace(/\.mp4$/, '.partial.mp4');
  const cmd = s.capture
    ? [path.join(ROOT, 'tools/capture-page.mjs'), s.capture.page + (s.capture.query || ''), path.join(HERE, s.capture.choreo),
       '--w', 1920, '--h', 1080, '--scale', W / 1920, '--fps', FPS, '--seconds', f(s.dur), '--out', tmp]
    : [path.join(ROOT, 'tools/record.mjs'), page,
       '--w', W, '--h', H, '--fps', FPS, '--seconds', f(s.dur), '--duration', f(s.dur), '--out', tmp, ...s.extra];
  // headless Chrome occasionally crashes partway through a long scene; retry the scene up to 3 times
  let r;
  for (let attempt = 1; attempt <= 3; attempt++) {
    r = spawnSync('node', cmd.map(String), { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'], env: { ...process.env, SCENE_CUES: s.cueJson || '{}' } });
    if (r.status === 0 && fs.existsSync(tmp)) break;
    fs.rmSync(tmp, { force: true });
    if (attempt < 3) console.log(`  ${s.key}: render crashed, retrying (${attempt + 1}/3)`);
  }
  if (r.status !== 0 || !fs.existsSync(tmp)) { fs.rmSync(tmp, { force: true }); throw new Error(`render ${s.key} failed`); }
  fs.renameSync(tmp, s.file);
}

// ---- 4. assemble
console.log('4/4 Assemble');
const final = path.join(OUT, `episode03-${K4 ? '4k' : '1080p'}${arg('--name', '') ? '-' + arg('--name') : ''}${NS ? '-preview' : ''}.mp4`);
const inputs = [...SCENES.map(s => s.file), ...placed.map(p => p[0])];
let fc = '', prev = '[0:v]';
for (let i = 1; i < SCENES.length; i++) {
  const lbl = i === SCENES.length - 1 ? '[vx]' : `[v${i}]`;
  fc += `${prev}[${i}:v]xfade=transition=fade:duration=${XF}:offset=${f(SCENES[i].start)}${lbl};`;
  prev = lbl;
}
fc += `[vx]fade=t=out:st=${f(total - 1.2)}:d=1.2,format=yuv420p[v];`;
placed.forEach(([, at], k) => { fc += `[${SCENES.length + k}:a]adelay=${Math.round(at * 1000)}:all=1[a${k}];`; });
fc += placed.map((_, k) => `[a${k}]`).join('') + `amix=inputs=${placed.length}:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=44100,apad,atrim=0:${f(total)}[a]`;
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs.flatMap(x => ['-i', x]), '-filter_complex', fc,
  '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'slow', '-crf', K4 ? '18' : '16', '-c:a', 'aac', '-b:a', '192k',
  '-movflags', '+faststart', '-t', f(total), final], { stdio: 'inherit' });
console.log(`Done: ${final} (${Math.floor(total / 60)}:${f(total % 60, 1).padStart(4, '0')})`);
