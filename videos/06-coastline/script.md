# Episode 6: "How long is the coast of Britain?"

Season 2 (Infinity / Fractals), episode 2. Follows episode 5 (the Mandelbrot set), whose cliffhanger
should point here: "Mandelbrot didn't start with pictures. He started with a question about a map."
Target ~5 min (~750 words). Status: DRAFT v1, script only (no scenes or narration built yet).
Interactive piece: `pieces/coastline/`.

Alternative titles: "The coastline paradox: the longer you look, the longer it gets" ·
"I tried to measure a coastline. The answer was infinity." · "Why nobody knows how long Britain's coast is".

---

### 1. Hook (0:00–0:12)
**VISUAL:** A glowing island. A pair of dividers walks around it in big steps; the counter reads
"~2,900 km". Snap: smaller ruler, more steps, "~4,300 km". Snap: "~7,000 km". Same island.
**VO:** How long is this coastline? Two thousand nine hundred kilometres. Or four thousand. Or seven.
All three answers are correct, and the closer you look, the longer it gets.

### 2. The paradox in one picture (0:12–0:50)
**VISUAL:** A coastline zooms in: every bay has smaller bays, every headland has smaller headlands.
The ruler shrinks with each zoom and the length counter keeps climbing.
**VO:** Here's the problem. You measure a coast by walking a ruler along it. A long ruler cuts across
the bays. A shorter ruler follows them in, so it measures more. But zoom in, and each bay has smaller
bays, and those have rocks, and the rocks have pebbles. Every time you shrink the ruler, there's more
coast to follow. A circle doesn't do this: shrink the ruler and its length settles to two pi r. A coastline
never settles.

### 3. Richardson and the borders (0:50–1:45)
**VISUAL:** Old-style map of the Iberian peninsula; two labels on the Spain–Portugal border:
"Spain: 987 km" / "Portugal: 1,214 km". Then a sketch of a log–log graph with a straight line.
**VO:** The first person to take this seriously was Lewis Fry Richardson, an English scientist who
wanted to know if the length of the border between two countries affected how likely they were to go to war.
He looked the lengths up and found they didn't agree. Spain said its border with Portugal was
987 kilometres. Portugal said 1,214. Nobody had made a mistake: they'd just used different rulers.
So Richardson measured with ruler after ruler, and plotted length against ruler size on logarithmic
scales. Every coast and border made a straight line. He wrote it down, and it sat almost unnoticed until
it was published in 1961, after his death.

### 4. Building it (1:45–2:50)
**VISUAL:** Code-on-screen style build of the piece: start with a 12-sided polygon; replace every edge
with two edges whose midpoint is pushed sideways by a random amount; repeat. The island crinkles into
shape level by level. Then the divider algorithm: a circle of radius R around the current point, the
next step lands where the circle first crosses the coast.
**VO:** To test this I needed a coastline I could zoom into forever, so I made one. Start with a rough
polygon. Take every edge, push its midpoint sideways a random amount, and you get two edges. Do it again,
and again. Every edge remembers its own random numbers, so when you zoom in, the new detail is always
the same: this coast really exists at every scale. Then I built Richardson's ruler: a pair of dividers
that steps along the coast, always landing exactly one ruler-length away.

### 5. The straight line (2:50–3:40)
**VISUAL:** The "Sweep" animation: twelve rulers from 150 km to 3 km, each walk drawn in gold. The
Richardson plot fills in point by point; a purple best-fit line snaps through them.
**VO:** Now the sweep. Big ruler: short coast. Smaller ruler: longer. Smaller still: longer still. On
log scales the points line up, just like Richardson's. And the slope of that line tells you how wiggly the
coast is. Smooth coast: flat line. Wild coast: steep line.

### 6. Mandelbrot's answer (3:40–4:25)
**VISUAL:** Title card: *Science*, 1967: "How Long Is the Coast of Britain? Statistical Self-Similarity
and Fractional Dimension". Then three presets side by side with their numbers: South Africa ≈ 1.02,
Britain's west coast ≈ 1.25, Norway ≈ 1.52. The Koch snowflake builds itself; "D = log 4 / log 3 ≈ 1.26".
**VO:** In 1967 Benoit Mandelbrot found Richardson's graphs and asked the question in the title of his
paper: how long is the coast of Britain? His answer: the question is wrong. Length isn't the right
measurement. The right one is the slope: a *dimension*. A straight line is one-dimensional, a filled
square is two, and a coastline sits in between. Smooth South Africa is barely more than one. Britain's
west coast is about one point two five. Norway, with its fjords, is around one point five. Sixty years
earlier Helge von Koch had drawn the perfect example: a snowflake with an infinitely long edge around a
finite area. Its dimension is one point two six. Measure it in my piece and you get one point two six.

### 7. Wiggles forever (4:25–4:45)
**VISUAL:** The "Dive into the coast" animation (`dive=1&ui=0`): an unbroken zoom from 1,000 km to
millimetres, the scale bar ticking down, the coast just as crinkled at every step.
**VO:** That's what a fractal is: something that keeps its detail no matter how far you zoom. A real
coast stops being a fractal somewhere around grains of sand. Mine never stops.

### 8. Website (4:45–5:00)
**VISUAL:** Website capture: presets, the ruler slider, Sweep, the plot updating, pinch-zoom on a phone. URL on screen.
**VO:** Measure it yourself, link in the description. Pick a ruler, make your own island, and see if
you can get the dimension right.

### 9. Cliffhanger (5:00–5:15)
**VISUAL:** A fern grows from nothing, one dot at a time, until a perfect leaf appears.
**VO:** Coastlines are made by chance. But some fractals in nature grow from rules so simple they fit on
one line. This fern is made from four tiny equations, and a dice roll. That's next.

---

## Facts to double-check before recording
- Lewis Fry Richardson (1881–1953): his study of border/coast lengths vs measuring unit appeared
  posthumously in *General Systems Yearbook* 6 (1961), "The problem of contiguity: an appendix to
  Statistics of Deadly Quarrels". Motivation: whether border length relates to the likelihood of war.
- Spain–Portugal border: 987 km (Spanish figure) vs 1,214 km (Portuguese figure), as quoted by Richardson
  and by Mandelbrot. Verify the attribution of which country gave which number against the 1961 paper.
- Mandelbrot, "How Long Is the Coast of Britain? Statistical Self-Similarity and Fractional Dimension",
  *Science* 156 (1967), 636–638. Note: the word "fractal" came later (1975); in 1967 he said "fractional dimension".
- Dimensions from Richardson's data as given by Mandelbrot: west coast of Britain D ≈ 1.25,
  land frontier of Germany ≈ 1.15, Australian coast ≈ 1.13, South African coast ≈ 1.02
  (the smoothest). Norway ≈ 1.52 is from later work (Feder, *Fractals*, 1988), not Richardson; phrase as "around 1.5".
- Helge von Koch, 1904 paper introducing the curve (snowflake is three copies). D = log 4 / log 3 = 1.2619…
- The piece's island model: random midpoint displacement with the displacement amplitude solved so the
  curve's similarity dimension equals the slider's D. The divider estimate from 12 rulers (150 km → 3 km)
  lands within ~0.04 of the true value; Koch measures 1.264.
- "Two pi r" claim for the circle: polygon perimeters converge to 2πr as the ruler shrinks. True.

## Visual scenes to build (code), later
| Scene | Needs |
|---|---|
| 1, 5 | `pieces/coastline` record mode (`auto=sweep`, default) |
| 2, 7 | record mode with `dive=1&ui=0` |
| 3 | Map card + border numbers, hand-drawn style log–log sketch |
| 4 | Step-by-step midpoint-displacement build (levels 0→8), divider circle diagram |
| 6 | Paper title card; presets side by side; Koch snowflake construction (`mode=1`) |
| 8 | Website capture (tools/capture-page.mjs) |
| 9 | Barnsley fern teaser (needs the episode 7 piece) |
