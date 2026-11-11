# Episode 5: "I zoomed into the Mandelbrot set a trillion times"

Season 2 (Infinity / Fractals), episode 1. Follows episode 4's season-finale cliffhanger ("chaos isn't
noise. It has infinite self-similar structure").
Target ~5 min (~750 words). Status: DRAFT v1, script only (no scenes or narration built yet).
Interactive piece: `pieces/mandelbrot/`.

Alternative titles: "The most complicated shape in maths comes from z² + c" · "I programmed infinity" ·
"Why this shape never runs out of detail".

---

### 1. Hook (0:00–0:12)
**VISUAL:** The "Dive into infinity" animation. A non-stop zoom through Seahorse Valley: spirals inside
spirals, then a tiny black copy of the whole set appears in the middle. Counter in the corner:
"zoom: 1,000,000,000,000×".
**VO:** This shape has more detail than you could ever see. I'm zoomed in trillions of times, and it still
hasn't run out. The whole thing comes from three symbols: z squared plus c.

### 2. Callback (0:12–0:35)
**VISUAL:** Quick montage of season 1: rainbow pendulums, the Lorenz butterfly, the bifurcation diagram
zooming into copies of itself. Title card: **Season 2: Infinity**.
**VO:** Last season we saw chaos everywhere, in pendulums, weather, rabbits and planets. And every time we
zoomed in, we found the same thing: copies of the picture hiding inside itself. So this season is about
that. Shapes with infinite detail. And it starts with the most famous one.

### 3. The rule (0:35–1:35)
**VISUAL:** A number line, then the complex plane drawn as a grid. A dot labelled *c*. Starting at 0, the
point hops: square, add c, square, add c. For c = −1 the hops bounce 0, −1, 0, −1 forever (dot turns
black). For c = 1 they go 0, 1, 2, 5, 26… and fly off screen (dot turns orange).
**VO:** Here's the rule. Pick a number, c. Start at zero. Square it and add c. Then do it again, and again.
Two things can happen. Either the numbers stay small forever, or they run away to infinity. Try c equals
minus one: zero, minus one, zero, minus one. Stuck forever. Stays small. Try c equals one: zero, one, two,
five, twenty-six. Gone. Now do this for every point on a flat map of numbers, called the complex plane.
Colour a point black if it stays small, and colour it by how fast it escapes if it doesn't.

### 4. The reveal (1:35–2:10)
**VISUAL:** The set fills in pixel by pixel, rough at first and then sharp. The full set appears with
3D lighting.
**VO:** And this is what you get. The Mandelbrot set. A big heart shape, a circle stuck to its side,
smaller circles stuck to those, and a fuzzy edge covered in spirals and hairs.

### 5. The history (2:10–2:55)
**VISUAL:** A rough 1978-style printout made of characters. Then a 1980 IBM-era plot with faint specks
around it. The specks magnify into tiny copies of the set. Then the filaments connecting them light up.
**VO:** The first rough picture was printed in 1978 by two mathematicians, Robert Brooks and Peter Matelski.
Two years later Benoit Mandelbrot, working at IBM, had computers draw it in much more detail. Around the
edge there were little specks, and when he zoomed in, they were tiny copies of the whole set. Are they
floating free? In 1982 Adrien Douady and John Hubbard proved they aren't. The whole set is connected.
Every tiny copy is joined to the rest by filaments far too thin to see.

### 6. Julia sets (2:55–3:35)
**VISUAL:** Split screen. The cursor moves across the Mandelbrot set while the Julia inset changes live.
Inside the set, the Julia set is one connected piece. Step outside the edge and it shatters into dust.
**VO:** Every point in this picture has a twin. Keep c fixed, and instead start at every other point.
You get a Julia set, named after Gaston Julia, who studied them around 1918 with no computer at all.
Here's the magic: if c is inside the Mandelbrot set, its Julia set is one piece. If c is outside, it
shatters into dust. So the Mandelbrot set is a map of every possible Julia set.

### 7. Hidden connections (3:35–4:20)
**VISUAL:** The bifurcation diagram from episode 3 slides in, rotated and lined up under the set's
horizontal axis. Each bulb lines up with a split. The Feigenbaum point is marked on both. Then a zoom into
the neck at c = −0.75 with an iteration counter: 3, 31, 314, 3141… → **π**.
**VO:** Remember the rabbits from episode three? Line their picture up with the middle of this set and the
splits match the bulbs exactly. Each bulb is a period doubling, shrinking by Feigenbaum's 4.669, all the way
to the same point where chaos begins. It's the same equation in disguise. And here's a strange one. In 1991
a student named Dave Boll counted how many steps points near this neck take to escape. As he got closer, the
counts spelled out pi.

### 8. How the zoom works (4:20–4:45)
**VISUAL:** The zoom slows, then the picture turns blocky and smeared (naive 64-bit floats running out of
digits). Then the fixed render: one bright "reference" point is computed exactly and every other pixel is
drawn as a small difference from it.
**VO:** Making this zoom was the hard part. Normal computer numbers carry about sixteen digits, and at this
depth the pixels differ in the fourteenth. So I calculate one point very carefully, and the graphics card
only works out how every other pixel differs from it. That's called perturbation, and it's how you
get to trillions.

### 9. Website (4:45–5:00)
**VISUAL:** Website capture: dragging, scroll and pinch zoom, the Julia inset following the cursor,
"Surprise me", palettes, "Dive into infinity". URL on screen: **hiddenrulesart.github.io/mandelbrot** (also first line of the description).
**VO:** It's on my website, link below. Find your own spiral, check out its Julia set, and save it as a
wallpaper. There are places in there no one has ever looked at.

### 10. Cliffhanger (5:00–5:15)
**VISUAL:** A satellite-style outline of Britain's coastline. A ruler of 200 km steps around it, then
100 km, then 50 km. Each time the total gets longer.
**VO:** The Mandelbrot set's edge is so wrinkly that, in a precise sense, it's almost two-dimensional. But you
don't need maths to find shapes like that. You just need a map. So: how long is the coastline of Britain?
It's a surprisingly hard question. That's next time.

---

## Facts to double-check before recording
- Brooks & Matelski: "The dynamics of 2-generator subgroups of PSL(2,C)", computed/printed c. 1978,
  published 1981 (*Riemann Surfaces and Related Topics*, Annals of Math. Studies 97). Check the "printout
  made of characters" description against the actual figure before showing a recreation.
- Mandelbrot, IBM Thomas J. Watson Research Center; paper "Fractal aspects of the iteration of z → λz(1−z)
  for complex λ and z", *Annals of the NY Academy of Sciences* 357 (1980). The popular story that he first
  thought the specks were dirt or printer errors is often repeated. Confirm it before using it (VO avoids it).
- Douady & Hubbard, 1982 (*C. R. Acad. Sci. Paris*): the Mandelbrot set is connected. They also named it
  after Mandelbrot.
- Julia sets: Gaston Julia, memoir of 1918; Pierre Fatou worked on the same questions at the same time. The theorem
  is that the Julia set of z² + c is connected if c ∈ M, and a Cantor set ("dust") if c ∉ M.
- Boundary dimension: Mitsuhiro Shishikura (1991 preprint, *Annals of Math.* 1998) proved its Hausdorff
  dimension is 2. VO says "in a precise sense, almost two-dimensional". Don't say "it *is* 2D".
- π: Dave Boll, 1991. For c = −0.75 + εi the escape count × ε → π. A similar result holds at the cusp
  c = 0.25 + ε, where count × √ε → π. Proof later published by Klebanoff (2001), "π in the Mandelbrot set".
- Logistic link: x → r·x(1−x) is conjugate to z → z² + c with c = r/2 − r²/4. Then r = 3 gives c = −0.75
  (the cardioid/period-2 neck), r = 1 + √6 gives c = −1.25, r∞ = 3.5699… gives c = −1.40115…
  (the Feigenbaum point), and r = 1 + √8 gives c = −1.75 (the period-3 mini-Mandelbrot).
- Ratio of bulb sizes along the real axis tends to δ = 4.669… (same δ as episode 3).
- Perturbation for deep Mandelbrot zooms was popularised by K. I. Martin (SuperFractalThing, 2013). The piece uses one
  64-bit reference orbit plus 32-bit per-pixel differences with "rebasing". Max zoom ≈ 10¹³ (limited by the
  64-bit centre coordinate).
- Depth: the site limit is s = 2e-13 vs home 1.35, about 7×10¹² zoom. The VO says "trillions"; keep it that way.

## Visual scenes to build (code), later
| Scene | Needs |
|---|---|
| 1, 4, 8 | `pieces/mandelbrot` record mode: `?record=1&dive=1&rate=1&cx=-0.7436438870371587&cy=0.1318259042053120&s=0.3` (rate = zoom doublings per second; reaches max depth after ~40 s at rate 1) |
| 3 | Complex-plane grid + hopping orbit for c = −1 and c = 1 |
| 5 | Mock 1978 character printout → 1980 plot → speck zoom (record mode presets) |
| 6 | Website capture of the Julia inset (tools/capture-page.mjs), or a dedicated Julia scene |
| 7 | Bifurcation diagram (from `pieces/logistic-map` record mode) aligned to the real axis; π counter |
| 8 | Same frame rendered naively in 32-bit (blocky) vs perturbation (sharp) |
| 9 | Website capture |
| 10 | Coastline ruler animation (needs the episode 6 piece) |
