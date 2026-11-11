#!/usr/bin/env node
// Render one script passage in several ElevenLabs voices/models for an A/B listen.
// Usage: node tools/voice-samples.mjs   -> videos/voice-samples/*.mp3 (git-ignored)
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const l of fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split('\n')) { const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/); if (m) process.env[m[1]] ??= m[2].replace(/^['"]|['"]$/g, ''); }
const OUT = path.join(ROOT, 'videos/voice-samples'); fs.mkdirSync(OUT, { recursive: true });
const TEXT = `In 1885, King Oscar the Second of Sweden announced a prize for anyone who could crack it. The winner was Henri Poincaré. He didn't solve it, but his paper was so brilliant that he won anyway. Then, while it was being printed, an editor found a gap. And when Poincaré went back to fix it... he discovered chaos.`;
const V2 = { stability: 0.45, similarity_boost: 0.8, style: 0.15, use_speaker_boost: true };
const JOBS = [
  ['01-brian-current', 'nPczCjzI2devNBz1zQrb', 'eleven_multilingual_v2', V2],
  ['02-brian-v3', 'nPczCjzI2devNBz1zQrb', 'eleven_v3', { stability: 0.5 }],
  ['03-george-british-storyteller', 'JBFqnCBsd6RMkjVDRZzb', 'eleven_multilingual_v2', V2],
  ['04-daniel-british-presenter', 'onwK4e9ZLuTAKqWW03F9', 'eleven_multilingual_v2', V2],
  ['05-will-friendly-young', 'bIHbv24MWmeRgasZH58o', 'eleven_multilingual_v2', V2],
  ['06-eric-smooth', 'cjVigY5qzO86Huf0OWal', 'eleven_multilingual_v2', V2],
  ['07-chris-casual', 'iP95p4xoKVk53GoZ742B', 'eleven_multilingual_v2', V2],
  ['08-alice-british-educator', 'Xb7hH8MSUJpSbSDYk0k2', 'eleven_multilingual_v2', V2],
  ['09-matilda-warm', 'XrExE9yKIg1WjnnlVkGX', 'eleven_multilingual_v2', V2],
  ['10-george-v3', 'JBFqnCBsd6RMkjVDRZzb', 'eleven_v3', { stability: 0.5 }],
  // voice library picks (educational / documentary narrators, deliberately not the most-used ones)
  ['11-quentin-narrator-educator', 'Aa6nEBJJMKJwJkCx8VU2', 'eleven_multilingual_v2', V2],
  ['12-max-documentary', 'Gfpl8Yo74Is0W6cPUWWT', 'eleven_multilingual_v2', V2],
  ['13-todd-youtube-explainer', 'g14YnDYCsy3k7XLlcKlO', 'eleven_multilingual_v2', V2],
  ['14-luis-inquisitive-young', 'WGINef1wh4Hi6O62bfO8', 'eleven_multilingual_v2', V2],
  ['15-adam-engineering-professor', 'QIhD5ivPGEoYZQDocuHI', 'eleven_multilingual_v2', V2],
  ['16-russ-deep-smooth', 'HKFOb9iktHA85uKXydRT', 'eleven_multilingual_v2', V2],
  ['17-alistair-british-factual', 'l30f87tf05uxyknGdDw6', 'eleven_multilingual_v2', V2],
  ['18-julian-young-british', '9IzcwKmvwJcw58h3KnlH', 'eleven_multilingual_v2', V2],
  ['19-frederick-british-wonder', 'j9jfwdrw7BRfcR43Qohk', 'eleven_multilingual_v2', V2],
  ['20-christopher-british-gentle', 'G17SuINrv2H9FC6nvetn', 'eleven_multilingual_v2', V2],
  ['21-hope-female-clear', 'WZlYpi1yf6zJhNWXih74', 'eleven_multilingual_v2', V2],
  ['22-eryn-female-measured', 'RaFzMbMIfqBcIurH6XF9', 'eleven_multilingual_v2', V2],
  ['23-stephanie-female-calm', 'oAoF4NpW2Aqxplg9HdYB', 'eleven_multilingual_v2', V2],
  ['24-shelley-female-british', '4CrZuIW9am7gYAxgo2Af', 'eleven_multilingual_v2', V2],
];
for (const [name, voice, model, s] of JOBS) {
  const f = path.join(OUT, name + '.mp3'); if (fs.existsSync(f)) continue;
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, { method: 'POST',
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: TEXT, model_id: model, voice_settings: s }) });
  if (!r.ok) { console.log(name, 'FAILED', r.status, (await r.text()).slice(0, 160)); continue; }
  fs.writeFileSync(f, Buffer.from(await r.arrayBuffer())); console.log('wrote', name);
}
