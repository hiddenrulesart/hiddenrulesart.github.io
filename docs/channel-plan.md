# Channel Plan — Generative Art

## Concept
A YouTube channel of "I programmed X" generative-art videos. Each video shows a
beautiful piece, explains the math/code behind it, and sends viewers to the
website where they can play with the piece themselves.

**Why it works**
- The art is the hook: thumbnails and Shorts are visually striking.
- The website builds an audience you own, not just YouTube subscribers.
- Clearly original human work → safe from YouTube's 2025 "inauthentic /
  mass-produced content" monetization rules that hit AI-slop channels.
- Proof the format works: Sebastian Lague (Coding Adventures), Acerola, The Coding Train.

## Production pipeline
1. **One codebase for site + video.** Each piece is a browser page (canvas / p5.js /
   three.js / WebGL shaders) with an interactive mode and a record mode.
2. **Render, don't screen-record.** Record mode advances the simulation exactly one
   frame per call; a headless-Chrome script grabs each frame and pipes it into
   ffmpeg → perfect 4K60 even if the sim can't run that fast live.
   See `tools/record.mjs`.
3. **Edit** in DaVinci Resolve (free). Voiceover: your own voice (best for trust +
   monetization); fallback ElevenLabs *speech-to-speech* (you read it, it converts),
   which avoids the robotic stress patterns of plain TTS.

## Video structure
| Time   | Content |
|--------|---------|
| 0–5s   | The single most beautiful moment, no intro |
| 5s–1m  | The concept ("Chaos: tiny changes → wildly different outcomes") |
| 1–5m   | Build it step by step: naive version, the math, the bug, the fix |
| 5m+    | Full showcase, then "play with it at <site>" |

**Shorts from every piece:** 30s of the visual + one line of text
(e.g. "1000 pendulums, 0.0000001° apart"). Vertical 2160×3840. Shorts are the
growth engine; they feed the long videos.

## Idea backlog
### Chaos theory series ("I programmed chaos theory")
- [x] **1000 double pendulums** — start almost identical, explode into chaos. `pieces/double-pendulum`
- [ ] **Lorenz attractor** — glowing particle trails; viewers rotate in 3D
- [ ] **Three-body problem** — viewers drop planets, watch them fling each other
- [ ] **Logistic map / bifurcation diagram** — infinite zoom into the fractal

### Later
- (add ideas here)

## Status log
- 2026-11-10: Plan written. Double pendulum piece built (interactive + record mode, tools/record.mjs). Defaults 150°/150°, spread 1e-5° → chaos at ~11s; 1e-7° → ~17s. Next: record a real video, then Lorenz attractor.
