#!/usr/bin/env node
// Build episode 2: "A rounding error discovered chaos. So I programmed it." (Lorenz attractor)
//   1. Narration: each line in voice.json -> ElevenLabs TTS (cached by text+voice+model).
//   2. Timing: every scene's length and internal cues are derived from the narration lengths.
//   3. Render: each scene via tools/record.mjs (or tools/capture-page.mjs for the website);
//      clips are cached by a hash of their source files + parameters, so edits only re-render what changed.
//   4. Assemble: crossfade all scenes, lay narration at the computed offsets, normalize loudness.
//
// Usage: node videos/02-lorenz/build.mjs [--4k] [--placeholder] [--only a,b] [--voice <id>] [--model <id>] [--scenes N] [--name tag]
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
function splitTime(a1, a2, spread) {
  const s = createSim({ n: 200 }); s.reset(a1, a2, spread);
  while (s.divergence() < 0.015 && s.time < 60) s.step(1 / FPS, 8);
  return s.time;
}
const f = (x, d = 3) => (+x).toFixed(d);
// The Lorenz piece moves 1.5 time units per second. A cloud of spread 1e-5 starting on the attractor
// becomes visibly spread (size ~0.25) after about 8 s and fills the attractor (~4+) after ~10 s.
const LZ_RATE = 1.5, LZ_THREAD = 7.6, LZ_BURST = 9.6;
const warmFor = (wantAt, natural) => f(Math.max(0, natural - wantAt) * LZ_RATE, 3);

// ---- 2. scenes. voice: [[segmentId, gapBefore]]; tail: seconds after the last line; min: minimum length.
// page: scene in ./scenes; path: any page relative to the repo root (e.g. the Lorenz piece in record mode).
const ens = (o) => Object.entries(o).flatMap(([k, v]) => ['--' + k, String(v)]);
const LORENZ = 'pieces/lorenz/index.html';
const SCENES = [
  { key: 'hook', path: LORENZ, voice: [['hook', 0.5], ['hook2', 0.6]], tail: 0.6 + 2.8,
    args: c => ens({ n: 2000, spread: 1e-5, ghost: 0, rot: 0.1, yaw: 0.5, pitch: 0.2, dotGlow: 1,
      warm: warmFor(c.at('hook2') + 0.3, LZ_BURST), cap1: '2,000 particles', cap2: 'all starting within 0.00001 of each other',
      capOut: f(c.at('hook2') - 0.2, 2), eqIn: f(c.at('hook') + c.d('hook') * 0.63, 2), eqOut: f(c.at('hook2') + 0.3, 2), titleAt: f(c.end('hook2') + 0.6, 2), title: 'The Butterfly Effect' }) },
  { key: 'callback', path: 'videos/01-double-pendulum/scenes/ensemble.html', voice: [['callback', 0.6]], tail: 1,
    args: c => ens({ n: 1000, a1: 150, a2: 150, spread: 1e-5, preroll: f(splitTime(150, 150, 1e-5) - 1.5, 4), cap1: 'Episode 1',
      cap2: '1,000 pendulums', textOut: f(c.d('callback') * 0.45, 2), trail: 0.7 }) },
  { key: 'story', page: 'printout', voice: [['story1', 0.6], ['story2', 0.5], ['story3', 0.6]], tail: 2,
    args: c => ens({ typeAt: f(c.end('story1') - 1.4, 2), storedAt: f(c.at('story2') + 0.4, 2),
      plotAt: f(c.at('story3'), 2), plotEnd: f(c.end('story3') - 2.5, 2), gapAt: f(c.end('story3') - 3.5, 2) }) },
  { key: 'equations', page: 'equations', voice: [['eq1', 0.6], ['eq2', 0.5]], tail: 1.2,
    args: c => ens({ eqAt: f(c.at('eq1') + c.d('eq1') * 0.7, 2), xAt: f(c.at('eq2'), 2), yzAt: f(c.at('eq2') + c.d('eq2') * 0.18, 2),
      parAt: f(c.at('eq2') + c.d('eq2') * 0.42, 2) }) },
  { key: 'path', path: LORENZ, voice: [['eq3', 0.4], ['path1', 0.8], ['path2', 0.6]], tail: 3.5,
    args: c => ens({ n: 1, ghost: 0, rot: 0.14, yaw: 0.4, pitch: 0.18, speed: 0.8, cap1: 'A strange attractor',
      capIn: f(c.at('path2') + c.d('path2') * 0.55, 2), capOut: f(c.dur - 0.6, 2) }) },
  { key: 'cloud', path: LORENZ, voice: [['cloud1', 0.6], ['cloud2', 0.4], ['cloud3', 1.2]], tail: 2.5,
    args: c => ens({ n: 2000, spread: 1e-5, ghost: 1, rot: 0.08, yaw: 0.9, pitch: 0.25, dotGlow: 1,
      warm: warmFor(c.at('cloud2') + 0.5, LZ_THREAD), cap1: '2,000 particles', cap2: 'within 0.00001 of each other',
      capIn: 0.4, capOut: f(c.at('cloud2'), 2), sizeIn: 0.8, sizeOut: f(c.at('cloud3') - 0.3, 2),
      q1: '"Does the flap of a butterfly\'s wings in Brazil', q2: 'set off a tornado in Texas?"', q3: 'Edward Lorenz, 1972',
      qIn: f(c.at('cloud3') + 0.3, 2), qOut: f(c.dur - 0.4, 2) }) },
  { key: 'forecast', page: 'forecast', voice: [['forecast', 0.7]], tail: 1.6,
    args: c => ens({ d1At: f(c.at('forecast') + c.d('forecast') * 0.1, 2), d5At: f(c.at('forecast') + c.d('forecast') * 0.19, 2),
      d10At: f(c.at('forecast') + c.d('forecast') * 0.3, 2), wallAt: f(c.at('forecast') + c.d('forecast') * 0.72, 2) }) },
  { key: 'dial', capture: { page: 'pieces/lorenz/', query: '?n=2000&spread=20&glow=0.3', choreo: 'scenes/dial-choreo.mjs' },
    voice: [['dial1', 0.8], ['dial2', 1.2], ['site', 1.0]], tail: 1.5,
    cues: c => ({ downAt: c.at('dial1') + c.d('dial1') * 0.45, upAt: c.at('dial2'), siteAt: c.at('site') - 0.3 }) },
  { key: 'storm', path: LORENZ, voice: [], tail: 0, min: 7,
    args: () => ens({ n: 5000, spread: 20, warm: 12, trail: 0.85, glow: 0.11, rot: 0.2, yaw: 2.2, pitch: 0.35, zoom: 1.1 }) },
  { key: 'next', page: 'next', voice: [['next', 0.8]], tail: 4.5,
    args: c => ens({ splitAt: f(c.at('next') + c.d('next') * 0.35, 2), diagramAt: f(c.at('next') + c.d('next') * 0.6, 2), nextAt: f(c.end('next') + 0.6, 2) }) },
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
  if (s.cues) s.cueJson = JSON.stringify(Object.fromEntries(Object.entries(s.cues(c)).map(([k, v]) => [k, +f(v, 3)])));
  clock += s.dur - (i < SCENES.length - 1 ? XF : 0);
}
const total = clock;
console.log(`2/4 Timing: ${SCENES.length} scenes, total ${Math.floor(total / 60)}:${f(total % 60, 1).padStart(4, '0')}`);
for (const s of SCENES) console.log(`  ${s.key.padEnd(10)} ${f(s.start, 1).padStart(6)}s  +${f(s.dur, 1)}s`);

// --audio-only: just the narration, laid out with the final timing, for review before rendering anything
if (args.includes('--audio-only')) {
  const file = path.join(OUT, 'episode02-narration.mp3');
  let fc = placed.map(([, at], k) => `[${k}:a]adelay=${Math.round(at * 1000)}:all=1[a${k}];`).join('');
  fc += placed.map((_, k) => `[a${k}]`).join('') + `amix=inputs=${placed.length}:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=44100,apad,atrim=0:${f(total)}[a]`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...placed.flatMap(p => ['-i', p[0]]), '-filter_complex', fc, '-map', '[a]', '-c:a', 'libmp3lame', '-b:a', '192k', file]);
  console.log(`Narration preview: ${file}`);
  process.exit(0);
}

// ---- 3. render (cached)
const only = arg('--only', '')?.split(',').filter(Boolean);
const deps = ['lib/scene.js', 'lib/ui.js', 'lib/ui.css', 'pieces/lorenz/sim.js', 'tools/record.mjs', 'tools/capture-page.mjs'];
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
console.log(`3/4 Render (${W}x${H})`);
for (const s of SCENES) {
  const page = s.path || path.join(REL, 'scenes', s.page + '.html');
  const src = s.capture ? [s.capture.page + 'index.html', path.join(REL, s.capture.choreo)] : [page];
  if (s.path?.includes('double-pendulum')) src.push('pieces/double-pendulum/sim.js', 'pieces/double-pendulum/render.js');
  const key = sha(JSON.stringify([src.map(read), deps.map(read), s.extra, s.cueJson, f(s.dur), W, H, FPS]));
  s.file = path.join(OUT, 'clips', `${s.key}-${W}-${key}.mp4`);
  if (fs.existsSync(s.file) && !(only && only.includes(s.key))) { console.log(`  ${s.key}: cached`); continue; }
  console.log(`  ${s.key}: rendering ${f(s.dur, 1)}s`);
  const cmd = s.capture
    ? [path.join(ROOT, 'tools/capture-page.mjs'), s.capture.page + (s.capture.query || ''), path.join(HERE, s.capture.choreo),
       '--w', 1920, '--h', 1080, '--scale', W / 1920, '--fps', FPS, '--seconds', f(s.dur), '--out', s.file]
    : [path.join(ROOT, 'tools/record.mjs'), page,
       '--w', W, '--h', H, '--fps', FPS, '--seconds', f(s.dur), '--duration', f(s.dur), '--out', s.file, ...s.extra];
  const r = spawnSync('node', cmd.map(String), { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'], env: { ...process.env, SCENE_CUES: s.cueJson || '{}' } });
  if (r.status !== 0 || !fs.existsSync(s.file)) throw new Error(`render ${s.key} failed`);
}

// ---- 4. assemble
console.log('4/4 Assemble');
const final = path.join(OUT, `episode02-${K4 ? '4k' : '1080p'}${arg('--name', '') ? '-' + arg('--name') : ''}${NS ? '-preview' : ''}.mp4`);
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
