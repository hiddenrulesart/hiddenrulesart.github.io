#!/usr/bin/env node
// Build episode 1 (currently: the first minute).
//   1. Narration: each line in voice.json -> ElevenLabs TTS (cached by text+voice+model).
//   2. Timing: every scene's length is derived from the narration lengths.
//   3. Render: each scene via tools/record.mjs (frame-exact).
//   4. Assemble: crossfade scenes, lay narration at the computed offsets -> out/episode01.mp4
//
// Usage: node videos/01-double-pendulum/build.mjs [--4k] [--voice <voice_id>] [--model <model_id>]
// Needs ELEVENLABS_API_KEY in <repo>/.env (git-ignored) or the environment.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const OUT = path.join(HERE, 'out');
fs.mkdirSync(path.join(OUT, 'audio'), { recursive: true });

const args = process.argv.slice(2);
const arg = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const [W, H] = args.includes('--4k') ? [3840, 2160] : [1920, 1080];
const FPS = 60;

// ---- config / secrets
const envFile = path.join(ROOT, '.env');
if (fs.existsSync(envFile)) for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
}
const KEY = process.env.ELEVENLABS_API_KEY;
const VOICE = arg('--voice', process.env.ELEVENLABS_VOICE_ID || 'nPczCjzI2devNBz1zQrb'); // "Brian": deep, calm narrator
const MODEL = arg('--model', process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2');
const SETTINGS = { stability: 0.45, similarity_boost: 0.8, style: 0.15, use_speaker_boost: true };

const { segments } = JSON.parse(fs.readFileSync(path.join(HERE, 'voice.json'), 'utf8'));

// ---- 1. narration
async function tts(seg, prev, next) {
  if (args.includes('--placeholder')) { // macOS built-in voice, for testing timing without API cost
    const file = path.join(OUT, 'audio', `${seg.id}-say-${crypto.createHash('sha1').update(seg.text).digest('hex').slice(0, 10)}.m4a`);
    if (!fs.existsSync(file)) {
      const aiff = file.replace(/\.m4a$/, '.aiff');
      execFileSync('say', ['-r', '165', '-o', aiff, seg.text]);
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', aiff, '-ar', '44100', '-c:a', 'aac', file]); fs.rmSync(aiff);
    }
    return file;
  }
  const hash = crypto.createHash('sha1').update(JSON.stringify([seg.text, VOICE, MODEL, SETTINGS])).digest('hex').slice(0, 10);
  const file = path.join(OUT, 'audio', `${seg.id}-${hash}.mp3`);
  if (fs.existsSync(file)) return file;
  if (!KEY) throw new Error('ELEVENLABS_API_KEY missing: put it in ' + envFile);
  console.log(`  TTS: ${seg.id}`);
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
    // previous/next text keeps intonation continuous across separately generated lines
    body: JSON.stringify({ text: seg.text, model_id: MODEL, voice_settings: SETTINGS,
      previous_text: prev?.text, next_text: next?.text }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}
const dur = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();

console.log('1/4 Narration');
const audio = {};
for (let i = 0; i < segments.length; i++) {
  const file = await tts(segments[i], segments[i - 1], segments[i + 1]);
  audio[segments[i].id] = { file, d: dur(file) };
  console.log(`  ${segments[i].id.padEnd(9)} ${audio[segments[i].id].d.toFixed(2)}s`);
}

// ---- 2. timing
const XF = 0.6;                       // crossfade between scenes
const A = audio;
const hookAt = 0.4, questionAt = hookAt + A.hook.d + 0.35;
const titleAt = questionAt + A.question.d + 0.3, TITLE = 2.6;
const sceneA = titleAt + TITLE;       // hook + question + title card
const simpleVoiceIn = 0.7;
const sceneB = simpleVoiceIn + A.simple.d + 1.2;
const simpleAt = sceneA - XF + simpleVoiceIn;
const total = sceneA + sceneB - XF;

// Start the sim late enough that the rainbow split becomes visible right after the hook line.
await import(path.join(ROOT, 'pieces/double-pendulum/sim.js')); // registers globalThis.DoublePendulumSim
const { createSim } = globalThis.DoublePendulumSim;
const probe = createSim({ n: 1000 }); probe.reset(150, 150, 1e-5);
let visible = 0;
while (probe.divergence() < 0.015 && probe.time < 60) { probe.step(1 / FPS, 8); visible = probe.time; }
const splitAt = hookAt + A.hook.d + 0.4;        // video time we want the split to show
const preroll = Math.max(0, visible - splitAt);
console.log(`2/4 Timing: total ${total.toFixed(1)}s, title at ${titleAt.toFixed(1)}s, sim preroll ${preroll.toFixed(2)}s`);

// ---- 3. render scenes
console.log(`3/4 Render (${W}x${H})`);
const rec = (scene, secs, extra, out) => {
  const r = spawnSync('node', [path.join(ROOT, 'tools/record.mjs'), `videos/01-double-pendulum/scenes/${scene}.html`,
    '--w', W, '--h', H, '--fps', FPS, '--seconds', secs.toFixed(3), '--out', out, ...extra].map(String),
    { cwd: ROOT, stdio: ['ignore', 'inherit', 'inherit'] });
  if (r.status !== 0) throw new Error(`render ${scene} failed`);
};
const vA = path.join(OUT, `A-hook-${W}.mp4`), vB = path.join(OUT, `B-simple-${W}.mp4`);
rec('hook', sceneA, ['--preroll', preroll.toFixed(4), '--textOut', (questionAt + 0.5).toFixed(2), '--titleAt', titleAt.toFixed(3), '--duration', sceneA.toFixed(3)], vA);
rec('simple', sceneB, ['--futureAt', (simpleVoiceIn + A.simple.d * 0.62).toFixed(2), '--duration', sceneB.toFixed(3)], vB);

// ---- 4. assemble
console.log('4/4 Assemble');
const final = path.join(OUT, `episode01-${W === 3840 ? '4k' : '1080p'}.mp4`);
const ms = s => Math.round(s * 1000);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error',
  '-i', vA, '-i', vB, '-i', A.hook.file, '-i', A.question.file, '-i', A.simple.file,
  '-filter_complex',
  `[0:v][1:v]xfade=transition=fade:duration=${XF}:offset=${(sceneA - XF).toFixed(3)},format=yuv420p[v];` +
  `[2:a]adelay=${ms(hookAt)}:all=1[a0];[3:a]adelay=${ms(questionAt)}:all=1[a1];[4:a]adelay=${ms(simpleAt)}:all=1[a2];` +
  `[a0][a1][a2]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=44100,apad,atrim=0:${total.toFixed(3)}[a]`,
  '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-c:a', 'aac', '-b:a', '192k',
  '-movflags', '+faststart', '-t', total.toFixed(3), final], { stdio: 'inherit' });
console.log(`Done: ${final} (${total.toFixed(1)}s)`);
