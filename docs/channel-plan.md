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

## Curriculum: "The Hidden Rules of Nature"
Not random pieces: a connected series. People click for a **question they already
have**; the art is the reward.

**Every video:**
1. Opens on a question people already wonder about, over the most striking visual.
2. Answers it by building the piece on screen. The process (attempts, bugs, "aha")
   is the story, Sebastian Lague style.
3. Ends on a cliffhanger that sets up the next video (end screen → next episode).

Each season has its own arc, and each finale leads into the next season. The website
is "the lab": every piece from the series, playable.

### Season 1: Chaos ("Why can't we predict the future?")
- [x] **1. Double pendulum.** "Why can't we predict the future?" Tiny differences explode (butterfly effect). `pieces/double-pendulum`
  - Title: "I programmed 1,000 pendulums. Then chaos happened."
  - Hook: the white pendulum splitting into a rainbow.
  - Cliffhanger: "This is why we can't forecast weather past 10 days. And in 1961, one man found out by accident…"
- [x] **2. Lorenz attractor.** Piece: `pieces/lorenz`. Script: `videos/02-lorenz/script.md` (draft, no video yet). "Why weather forecasts fail after 10 days." Lorenz rounded one number in a weather sim in 1961 and discovered chaos. Reveal: chaos has a beautiful shape. Glowing particle trails, rotate in 3D.
- [x] **3. Logistic map / bifurcation.** Piece: `pieces/logistic-map`. Script: `videos/03-logistic-map/script.md` (draft, no video yet). "How order turns into chaos." Reveal: 4.669 (Feigenbaum constant) appears in every chaotic system. Infinite zoom.
- [x] **4. Three-body problem.** Piece: `pieces/three-body`. Script: `videos/04-three-body/script.md` (draft, no video yet). "Why can't we predict three planets?" Viewers drop planets and watch them fling each other.
  - Season finale: chaos isn't noise. It has infinite self-similar structure, which leads into fractals.

### Season 2: Infinity / Fractals
- [x] **5. Mandelbrot set** (infinite zoom). Piece: `pieces/mandelbrot`. Script: `videos/05-mandelbrot/script.md` (draft).
- [x] **6. Coastline paradox**: "How long is Britain's coast?" Piece: `pieces/coastline`. Script: `videos/06-coastline/script.md` (draft; Spain/Portugal figures to verify).
- [ ] Trees and ferns from simple rules (L-systems, Barnsley fern)

### Season 3: Emergence ("How does complexity come from simple rules?")
- [ ] Conway's Game of Life
- [ ] Flocking birds (boids)
- [ ] Slime mold networks (Physarum)
- [ ] Turing patterns / reaction-diffusion: "How the zebra got its stripes"

### Season 4: Waves
- [ ] Fourier epicycles drawing pictures
- [ ] Chladni / standing-wave patterns
- [ ] Wave interference

### Unsorted ideas
- (add ideas here)

## Status log
- 2026-11-10: Plan written. Double pendulum piece built (interactive + record mode, tools/record.mjs). Defaults 150°/150°, spread 1e-5° → chaos at ~11s; 1e-7° → ~17s. Next: record a real video, then Lorenz attractor.
- 2026-11-10: Repo made public; GitHub Pages live at https://sirdevelop.github.io/generativeArt/ (deploys from main /). Episode 1 full build pipeline done (videos/01-double-pendulum/build.mjs).
- 2026-11-10: Site UX pass: shared lib/ui.js + lib/ui.css (all pieces get PNG/JPG/WebP export, 6s MP4/WebM clip recording, native share sheet with fallback links, presets, Surprise me, fullscreen, first-visit hint, phone bottom-sheet + pinch zoom, story box). Gallery redesigned with thumbnails (assets/thumbs, also social preview og:image). Lorenz + logistic map pieces built; ep 2 + 3 scripts drafted. Ep 1 video not re-rendered since the pendulum page UI changed (its website-capture scene will show the new panel on next build).
- 2026-11-10: Three-body, Mandelbrot (WebGL perturbation deep zoom) and coastline-paradox pieces built + ep 4-6 scripts drafted; gallery now has Season 2. Next piece: Barnsley fern / L-systems.
- 2026-11-11: Short links per piece (root folders redirecting, query kept): /pendulum /lorenz /rabbits /planets /mandelbrot /coastline. Each video shows its own short link on screen + first line of description; saved images are signed with it. Voice A/B samples: `node tools/voice-samples.mjs` → videos/voice-samples/ (git-ignored).
