#!/usr/bin/env node
// Build episode 1: "I programmed 1,000 pendulums. Then chaos happened."
//   1. Narration: each line in voice.json -> ElevenLabs TTS (cached by text+voice+model).
//   2. Timing: every scene's length and internal cues are derived from the narration lengths.
//   3. Render: each scene via tools/record.mjs (or tools/capture-page.mjs for the website);
//      clips are cached by a hash of their source files + parameters, so edits only re-render what changed.
//   4. Assemble: crossfade all scenes, lay narration at the computed offsets, normalize loudness.
//
// Usage: node videos/01-double-pendulum/build.mjs [--4k] [--placeholder] [--only a,b] [--voice <id>] [--model <id>] [--scenes N] [--name tag]
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


// ---- helpers for scene cues
await import(path.join(ROOT, 'pieces/double-pendulum/sim.js'));
const { createSim } = globalThis.DoublePendulumSim;
// sim time at which an ensemble visibly starts to fan out (spread depends only on the extremes, so n=200 suffices)
function splitTime(a1, a2, spread) {
  const s = createSim({ n: 200 }); s.reset(a1, a2, spread);
  while (s.divergence() < 0.015 && s.time < 60) s.step(1 / FPS, 8);
  return s.time;
}
const f = (x, d = 3) => (+x).toFixed(d);

// ---- 2. scenes. voice: [[segmentId, gapBefore]]; tail: seconds after the last line; min: minimum length.
// args(c) gets c.at(id) (line start within the scene), c.end(id), c.d(id), c.dur.
const ens = (o) => Object.entries(o).flatMap(([k, v]) => ['--' + k, String(v)]);
const SCENES = [
  { key: 'hook', page: 'ensemble', voice: [['hook', 0.4], ['question', 0.35]], tail: 0.3 + 2.6,
    args: c => {
      const preroll = Math.max(0, splitTime(150, 150, 1e-5) - (c.end('hook') + 0.4));
      return ens({ preroll: f(preroll, 4), cap1: '1,000 pendulums', cap2: 'all starting within 0.00001° of each other',
        textOut: f(c.at('question') + 0.5, 2), titleAt: f(c.end('question') + 0.3) });
    } },
  { key: 'simple', page: 'simple', voice: [['simple', 0.7]], tail: 1.2,
    args: c => ens({ futureAt: f(c.at('simple') + c.d('simple') * 0.62, 2) }) },
  { key: 'double', page: 'double', voice: [['double', 0.7], ['wild', 0.6]], tail: 3,
    args: c => ens({ liftAt: f(c.at('wild') - 1.1, 2) }) },
  { key: 'euler', page: 'euler', voice: [['equations', 0.7], ['euler', 0.5], ['rk4', 0.5]], tail: 2.5,
    args: c => ens({ splitAt: f(c.at('euler') - 0.4, 2), rk4At: f(c.at('rk4'), 2) }) },
  { key: 'two', page: 'two', voice: [['two', 0.9], ['smaller', 0.5]], tail: 1.2,
    args: c => ens({ smaller1At: f(c.at('smaller') + c.d('smaller') * 0.6, 2), smaller2At: f(c.at('smaller') + c.d('smaller') * 0.8, 2) }) },
  { key: 'thousand', page: 'ensemble', voice: [['thousand', 0.8], ['rainbow', 0.4]], tail: 4,
    args: c => {
      // release so the split lands ~1.5 s into "For ten seconds, they move as one."
      const hold = Math.max(1, c.at('rainbow') + 1.5 - splitTime(150, 150, 1e-5));
      return ens({ hold: f(hold, 3), clock: 1, cap1: '1,000 pendulums', cap2: 'within 0.00001°', textOut: f(c.dur - 1, 2), trail: 0.7 });
    } },
  { key: 'growth', page: 'growth', voice: [['growth', 0.7], ['sensitive', 0.5]], tail: 2,
    args: c => ens({ drawEnd: f(c.at('growth') + c.d('growth') * 0.9, 2), secondAt: f(c.at('sensitive') + 0.3, 2) }) },
  // montage: three looks, each starting just after its split (already in rainbow)
  ...[
    { n: 3000, a1: 120, a2: 170, glow: 0.2, trail: 0.85 },
    { n: 10000, a1: 179, a2: 179, glow: 0.08, trail: 0.75 },
    { n: 1000, a1: 90, a2: 180, glow: 0.35, trail: 0.9 },
  ].map((v, i) => ({ key: `montage${i + 1}`, page: 'ensemble', voice: i === 0 ? [['beautiful', 1.0]] : [], tail: 0, min: 7,
    args: () => ens({ ...v, spread: 1e-5, preroll: f(splitTime(v.a1, v.a2, 1e-5) + 0.6, 4) }) })),
  { key: 'site', capture: { page: 'pieces/double-pendulum/', choreo: 'scenes/site-choreo.mjs' }, voice: [['site', 1.2]], tail: 1, min: 14.5 },
  { key: 'lorenz', page: 'lorenz', voice: [['lorenz', 1.4]], tail: 8,
    args: c => ens({ nextAt: f(c.end('lorenz') + 0.8, 2) }) },
];

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
  clock += s.dur - (i < SCENES.length - 1 ? XF : 0);
}
const total = clock;
console.log(`2/4 Timing: ${SCENES.length} scenes, total ${Math.floor(total / 60)}:${f(total % 60, 1).padStart(4, '0')}`);
for (const s of SCENES) console.log(`  ${s.key.padEnd(10)} ${f(s.start, 1).padStart(6)}s  +${f(s.dur, 1)}s`);

// ---- 3. render (cached)
const only = arg('--only', '')?.split(',').filter(Boolean);
const deps = ['lib/scene.js', 'pieces/double-pendulum/sim.js', 'pieces/double-pendulum/render.js', 'pieces/double-pendulum/index.html', 'tools/record.mjs', 'tools/capture-page.mjs'];
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
console.log(`3/4 Render (${W}x${H})`);
for (const s of SCENES) {
  const src = s.capture ? [s.capture.page + 'index.html', path.join(REL, s.capture.choreo)] : [path.join(REL, 'scenes', s.page + '.html')];
  const key = sha(JSON.stringify([src.map(read), deps.map(read), s.extra, f(s.dur), W, H, FPS]));
  s.file = path.join(OUT, 'clips', `${s.key}-${W}-${key}.mp4`);
  if (fs.existsSync(s.file) && !(only && only.includes(s.key))) { console.log(`  ${s.key}: cached`); continue; }
  console.log(`  ${s.key}: rendering ${f(s.dur, 1)}s`);
  // render to a temp file and rename only when complete, so a crashed render is never mistaken for a cached clip
  const tmp = s.file.replace(/\.mp4$/, '.partial.mp4');
  const cmd = s.capture
    ? [path.join(ROOT, 'tools/capture-page.mjs'), s.capture.page, path.join(HERE, s.capture.choreo),
       '--w', 1920, '--h', 1080, '--scale', W / 1920, '--fps', FPS, '--seconds', f(s.dur), '--out', tmp]
    : [path.join(ROOT, 'tools/record.mjs'), `${REL}/scenes/${s.page}.html`,
       '--w', W, '--h', H, '--fps', FPS, '--seconds', f(s.dur), '--duration', f(s.dur), '--out', tmp, ...s.extra];
  // headless Chrome occasionally crashes partway through a long scene; retry the scene up to 3 times
  let r;
  for (let attempt = 1; attempt <= 3; attempt++) {
    r = spawnSync('node', cmd.map(String), { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'] });
    if (r.status === 0 && fs.existsSync(tmp)) break;
    fs.rmSync(tmp, { force: true });
    if (attempt < 3) console.log(`  ${s.key}: render crashed, retrying (${attempt + 1}/3)`);
  }
  if (r.status !== 0 || !fs.existsSync(tmp)) { fs.rmSync(tmp, { force: true }); throw new Error(`render ${s.key} failed`); }
  fs.renameSync(tmp, s.file);
}

// ---- 4. assemble
console.log('4/4 Assemble');
const final = path.join(OUT, `episode01-${K4 ? '4k' : '1080p'}${arg('--name', '') ? '-' + arg('--name') : ''}${NS ? '-preview' : ''}.mp4`);
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
