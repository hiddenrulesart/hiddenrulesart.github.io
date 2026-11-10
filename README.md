# Generative Art

Interactive generative-art pieces that double as the source for YouTube videos.
Each piece runs in the browser (play with it) and has a record mode that renders
perfect frame-by-frame video.

Channel plan and idea backlog: [docs/channel-plan.md](docs/channel-plan.md)

## Pieces
| Piece | Interactive | Notes |
|---|---|---|
| Double pendulum chaos | `pieces/double-pendulum/index.html` | 1000 pendulums starting 0.00001° apart |

Open any `index.html` directly in a browser. No build step.

## Recording video
Requires Node, ffmpeg, and Google Chrome (`npm install` once).

```bash
# 4K landscape, 40 seconds
node tools/record.mjs double-pendulum --seconds 40

# Vertical Short (2160x3840) with on-screen text, tinier starting difference
node tools/record.mjs double-pendulum --w 2160 --h 3840 --overlay 1 --spread 1e-7 --seconds 30

# Any piece parameter can be passed: --n 3000 --a1 120 --a2 160 --trail 0.8 --glow 0.25
```

Output goes to `renders/` (git-ignored). Tip: set up a scene interactively, click
"Copy link", and pass the same values from the URL to the recorder.
Set `CHROME_PATH` if Chrome is not in `/Applications`.
