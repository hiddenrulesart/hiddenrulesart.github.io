#!/usr/bin/env node
// Build episode 4: "Newton solved two bodies. Nobody has solved three." (three-body problem)
//   1. Narration: each line in voice.json -> ElevenLabs TTS (cached by text+voice+model).
//   2. Timing: every scene's length and internal cues are derived from the narration lengths.
//   3. Render: each scene via tools/record.mjs (or tools/capture-page.mjs for the website);
//      clips are cached by a hash of their source files + parameters, so edits only re-render what changed.
//   4. Assemble: crossfade all scenes, lay narration at the computed offsets, normalize loudness.
//
// Usage: node videos/04-three-body/build.mjs [--4k] [--placeholder] [--only a,b] [--voice <id>] [--model <id>] [--scenes N] [--name tag]
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


// ---- 2. scenes. voice: [[segmentId, gapBefore]]; tail: seconds after the last line; min: minimum length;
// fixed: exact length (a voice line may then run on into the following scenes, which have none of their own).
// page: scene in ./scenes; path: any page relative to the repo root.
const f = (x, d = 3) => (+x).toFixed(d);
const ens = (o) => Object.entries(o).flatMap(([k, v]) => ['--' + k, String(v)]);
const at = (c, id, k) => f(c.at(id) + c.d(id) * k, 2);   // a fraction k of the way through line id
const SCENES = [
  { key: 'hook', page: 'pyth', voice: [['hook', 0.6], ['hook2', 0.5]], tail: 1.4,
    // the first ejection (t ≈ 58) and the fall back (72)
    args: c => ens({ from: 54, life: 8, legend: 0, k0: f(c.dur, 2), s0: 54 + c.dur * 1.45 }) },
  { key: 'gravity', page: 'gravity', voice: [['grav1', 0.7], ['grav2', 0.6], ['ell1', 0.8], ['ell2', 0.5], ['three', 0.6]], tail: 4,
    args: c => ens({ credAt: at(c, 'grav1', 0.1), dblAt: at(c, 'grav1', 0.75), eqAt: f(c.at('grav2'), 2), e1: at(c, 'grav2', 0.1),
      e2: at(c, 'grav2', 0.32), e3: at(c, 'grav2', 0.5), e4: at(c, 'grav2', 0.7), ellAt: f(c.at('ell1'), 2), threeAt: at(c, 'three', 0.55) }) },
  { key: 'steps', page: 'steps', voice: [['sim1', 0.7], ['sim2', 0.5], ['pyth1', 0.8], ['pyth2', 0.6]], tail: 2.2,
    args: c => ens({ l1: at(c, 'sim1', 0.6), l2: f(c.at('sim2'), 2), l3: at(c, 'sim2', 0.4), l4: at(c, 'sim2', 0.7),
      setupAt: f(c.at('pyth1') - 0.2, 2), sideAt: at(c, 'pyth1', 0.55), goAt: at(c, 'pyth2', 0.45) }) },
  { key: 'energy', page: 'energy', voice: [['en1', 0.7], ['bug1', 0.8], ['bug2', 0.6], ['fix', 0.6]], tail: 3,
    // the fixed-step run (RATE 0.55/s) reaches its first close pass (t = 1.84) 3.3 s after it starts: on "shoots off the chart"
    args: c => ens({ bugAt: f(c.at('bug1') - 0.3, 2), naiveAt: f(c.at('bug1') + c.d('bug1') * 0.45 - 3.35, 2), fixAt: at(c, 'fix', 0.1) }) },
  { key: 'chaos', page: 'pyth', voice: [['chaos1', 0.6], ['chaos2', 0.4], ['chaos3', 0.5]], tail: 2.5,
    // thrown out (t ≈ 58) on chaos2, back by 72, out for good (86) early in chaos3
    args: c => ens({ from: 0, life: 6, k0: at(c, 'chaos2', 0.45), s0: 58, k1: f(c.end('chaos2') + 0.3, 2), s1: 72, k2: at(c, 'chaos3', 0.3), s2: 86, k3: f(c.dur, 2), s3: 86 + (c.dur - (c.at('chaos3') + c.d('chaos3') * 0.3)) * 1.6 }) },
  { key: 'prize', page: 'prize', voice: [['prize1', 0.8], ['prize2', 0.6], ['prize3', 0.6], ['prize4', 0.6]], tail: 1.5,
    args: c => ens({ c1: at(c, 'prize1', 0.35), c2: at(c, 'prize2', 0.1), c3: at(c, 'prize3', 0.2), c4: at(c, 'prize4', 0.4) }) },
  { key: 'twin', page: 'twin', voice: [['twin1', 0.7], ['twin2', 0.5], ['twin3', 0.6]], tail: 1.5,
    // gap ≈ 1e-9 until t ≈ 4, 1e-6 at t ≈ 7, 1e-3 at t ≈ 13.5, 0.6 at t ≈ 18
    args: c => ens({ k1: at(c, 'twin2', 0.38), s1: 4, k2: at(c, 'twin2', 0.52), s2: 7.5, k3: at(c, 'twin2', 0.66), s3: 13.5, k4: at(c, 'twin2', 0.9), s4: 18.5 }) },
  { key: 'order', page: 'order', voice: [['ord1', 0.8], ['ord2', 0.5], ['ord3', 0.7], ['ord4', 0.6]], tail: 2.5,
    args: c => ens({ brkAt: at(c, 'ord2', 0.75), figAt: f(c.at('ord3') - 0.3, 2), bflyAt: at(c, 'ord4', 0.3) }) },
  { key: 'sem', page: 'sem', voice: [['sem1', 0.8], ['sem2', 0.6]], tail: 2,
    args: c => ens({ insetAt: at(c, 'sem1', 0.6), tugAt: at(c, 'sem2', 0.2) }) },
  { key: 'sundman', page: 'sundman', voice: [['sund1', 0.8], ['sund2', 0.6]], tail: 2,
    args: c => ens({ seriesAt: at(c, 'sund1', 0.35), countAt: at(c, 'sund2', 0.2) }) },
  { key: 'site', capture: { page: 'pieces/three-body/', query: '?preset=star', choreo: 'scenes/site-choreo.mjs' },
    voice: [['site', 0.6]], tail: 2.5, min: 13 },
  // season recap: four clean clips under one line, then the Mandelbrot teaser
  { key: 'recap1', path: 'videos/01-double-pendulum/scenes/ensemble.html', voice: [['fin1', 0.6]], fixed: 4.4,
    args: () => ens({ preroll: 10.5, trail: 0.7, glow: 0.45, textOut: -1 }) },
  { key: 'recap2', path: 'pieces/lorenz/index.html', voice: [], fixed: 4.4,
    args: () => ens({ n: 5000, spread: 20, warm: 12, trail: 0.85, glow: 0.1, rot: 0.1, yaw: 2.4, pitch: 0.12, zoom: 1.15 }) },
  { key: 'recap3', path: 'pieces/logistic-map/index.html', voice: [], fixed: 4.4,
    args: () => ens({ dive: 1, diveRate: 0.45, detail: 450, r0: 2.5, r1: 4, x0: 0, x1: 1 }) },
  { key: 'recap4', page: 'pyth', voice: [], fixed: 4.4, args: () => ens({ from: 62, life: 6, legend: 0, k0: 4.4, s0: 74 }) },
  { key: 'next', path: 'pieces/mandelbrot/index.html', voice: [['fin2', 0.8]], tail: 5,
    args: c => ens({ dive: 1, rate: 1, cardAt: f(c.end('fin2') + 0.6, 2), card1: 'NEXT SEASON', card2: 'Infinity' }) },
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
  s.dur = s.fixed || Math.max(s.min || 0, t + s.tail);
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
  const file = path.join(OUT, 'episode04-narration.mp3');
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
  if (s.page) src.push(path.join(REL, 'scenes/sky.js'), 'pieces/three-body/sim.js', 'lib/scene.js');
  if (s.path && s.path.startsWith('videos/')) src.push('lib/scene.js');
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
const final = path.join(OUT, `episode04-${K4 ? '4k' : '1080p'}${arg('--name', '') ? '-' + arg('--name') : ''}${NS ? '-preview' : ''}.mp4`);
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
