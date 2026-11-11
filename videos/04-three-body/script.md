# Episode 4: "Newton solved two planets. Nobody has solved three."

Season 1 (Chaos), episode 4: the season finale. Follows episode 3's cliffhanger ("chaos was actually
discovered in the sky. Newton solved two planets. Nobody has ever solved three.").
Target ~5 min (~750 words). Status: DRAFT v1, script only (no scenes or narration built yet).
Interactive piece: `pieces/three-body/`.

Alternative titles: "I programmed three planets. It's impossible." · "Why three planets break physics" ·
"The problem that broke Newton (and created chaos)".

---

### 1. Hook (0:00–0:12)
**VISUAL:** Three glowing bodies (Pythagorean preset) circling each other in a frantic tangle. Then one
gets flung off-screen and the camera lets it go. Text: "3 bodies. 1 law. No solution."
**VO:** Three objects, pulling on each other with gravity. That's all. And for more than three hundred years,
nobody has been able to write down what they'll do.

### 2. Two bodies (0:12–0:50)
**VISUAL:** "Your solar system" preset: one star, one planet tracing a clean ellipse, over and over. The
equation of gravity appears: F = G·m₁·m₂ / r². A title card: *Principia*, 1687.
**VO:** In 1687 Isaac Newton published the law of gravity, and with it he solved the motion of two bodies
completely. A planet around a star moves on an ellipse, the same ellipse, forever. Give me the starting
position and speed, and I can tell you exactly where the planet will be in a million years, with one
formula. So naturally, the next question was: what about three? The Sun, the Earth and the Moon.

### 3. Three bodies (0:50–1:40)
**VISUAL:** Code on screen: the force loop, each body pulled by every other. Then the simulation running
with three equal masses from a random start: loops, near-misses, a body thrown out and falling back.
**VO:** Here's the thing. Simulating it is easy. Every tiny step, each body gets pulled toward the other
two, and I nudge its speed and position. That's the entire program. The hard part is the formula. With
three bodies, every orbit changes every other orbit, all the time. Watch: a near miss, a slingshot, one gets
thrown out… and then pulled back in. There's no ellipse here. No pattern that repeats.

### 4. The prize (1:40–2:40)
**VISUAL:** An 1880s newspaper-style card: King Oscar II, a prize, a gold medal. Poincaré's portrait
(public domain). A printed journal issue gets stamped "RECALLED". Then a "tangle" diagram: two curves
crossing each other infinitely often.
**VO:** In 1885, King Oscar the Second of Sweden announced a prize for anyone who could solve it. The
winner was the French mathematician Henri Poincaré. He didn't solve it, but his paper was so brilliant
that he won anyway. Then, while the paper was being printed, an editor found a gap. Poincaré went back
to fix it, and discovered something nobody expected. Some orbits are so tangled that a tiny change in where
you start sends you somewhere completely different. He'd found chaos, seventy years before Lorenz. The
journal issue had to be withdrawn and reprinted, and Poincaré paid for it out of his own pocket, more than
the prize money he'd won.

### 5. The butterfly effect, in space (2:40–3:15)
**VISUAL:** "Butterfly effect" preset: the twin universe, a faint copy offset by a billionth. The two copies
overlap perfectly, then peel apart. Counter: "differ by 0.000000001 → 0.01 → 2.3".
**VO:** Here are two copies of the same three stars. In one of them, I moved a single star by one
billionth. For a while you can't tell them apart. Then the difference grows, and grows, and soon they're
two completely different universes. That's why there's no simple formula: the answer depends on digits you
can never measure.

### 6. Islands of order (3:15–4:15)
**VISUAL:** The figure-eight preset, slow and hypnotic. Then the Lagrange triangle spinning rigidly, until it
falls apart. Then "Butterfly I" and a montage grid of periodic orbits.
**VO:** But chaos isn't the whole story. There are special starting points where three bodies dance
forever. In 1772, Joseph-Louis Lagrange found one: three bodies on a spinning triangle. Watch closely,
though: with equal masses it's unstable, and the tiniest rounding error tears it apart. Here's a stranger
one: three equal stars chasing each other around a figure eight. It was found by computer in 1993, and
proven to exist in 2000. And in 2013, two physicists in Belgrade searched by computer and found thirteen
new families of these orbits, with names like the butterfly and the moth. People are still finding more.

### 7. The impossible formula (4:15–4:40)
**VISUAL:** An endless scroll of tiny equation terms filling the screen, getting smaller and smaller.
**VO:** And here's the twist. In 1912 a Finnish mathematician, Karl Sundman, actually did find a formula: an
infinite series that solves the three-body problem. It's just useless. To get a useful answer you'd need a
number of terms with millions of digits. So the solution exists. You just can't ever use it.

### 8. Website (4:40–5:00)
**VISUAL:** Website capture: tapping to drop planets, dragging to throw one (arrow + dotted predicted
path), pressing presets. URL on screen.
**VO:** You can play with it, link in the description. Tap to drop a planet, drag to throw one, and try
to build a solar system that doesn't fall apart. It's harder than it looks.

### 9. Season finale and cliffhanger (5:00–5:30)
**VISUAL:** Quick recap montage: rainbow pendulums, the Lorenz butterfly, the bifurcation zoom, the
three-body tangle. Then a cut to a black screen and the first frames of a Mandelbrot zoom.
**VO:** Pendulums, weather, rabbits, planets. Every time we looked closely at chaos, we found the same
thing: not noise, but structure that repeats inside itself, forever. In the next season we follow that
structure all the way down, into a shape built from one line of math that's infinitely detailed. You can zoom
into it for the rest of your life and never see the same thing twice.

---

## Facts to double-check before recording
- Newton, *Philosophiæ Naturalis Principia Mathematica* (1687): the two-body problem reduces to Kepler orbits (conic sections).
- Oscar II prize: announced 1885 in *Acta Mathematica*, deadline 1 June 1888, awarded to Poincaré on 21 January 1889 (the King's 60th birthday). The error was spotted while the memoir was being edited (Lars Edvard Phragmén's queries, 1889). The printed issue was recalled and destroyed; the corrected memoir appeared in *Acta Mathematica* 13 (1890). Poincaré paid for the reprint, about 3,585 crowns versus the 2,500-crown prize (source: June Barrow-Green, *Poincaré and the Three Body Problem*, 1997). Check the numbers before quoting them on screen; the VO only says "more than the prize money".
- "Seventy years before Lorenz": 1889/1890 → 1961/1963. OK.
- Lagrange (1772): equilateral-triangle solution (Euler found the collinear ones, 1767). For equal masses it's linearly unstable (Routh's criterion needs one dominant mass).
- Figure-eight: found numerically by Cristopher Moore (1993); existence proved by Alain Chenciner and Richard Montgomery, *Annals of Mathematics* (2000). Initial conditions in the piece are the commonly cited ones (Chenciner–Montgomery / Simó): x₁ = −x₂ = (0.97000436, −0.24308753), x₃ = 0, v₃ = (−0.93240737, −0.86473146), v₁ = v₂ = −v₃/2, period ≈ 6.3259. The sim returns to within 2e-5 after one period.
- Šuvakov & Dmitrašinović, "Three Classes of Newtonian Three-Body Planar Periodic Orbits", *Physical Review Letters* 110, 114301 (2013): 13 new families (Institute of Physics, Belgrade). "Butterfly I" initial conditions in the piece: positions (−1,0), (1,0), (0,0), velocities (p₁,p₂), (p₁,p₂), (−2p₁,−2p₂) with p₁ = 0.30689, p₂ = 0.12551, period ≈ 6.2356 (sim returns to within 1e-3).
- Sundman (1912, *Acta Mathematica* 36): convergent series for the three-body problem (non-zero angular momentum). Commonly quoted: about 10^8,000,000 terms needed for astronomical accuracy (Beloriszky, 1930). The VO says "a number of terms with millions of digits", which matches that.
- Pythagorean problem: Burrau (1913); masses 3, 4, 5 at rest at the corners of a 3-4-5 right triangle (each mass opposite the side of the same length). Szebehely & Peters (1967) integrated it numerically: the mass-3 body is ejected and 4 and 5 leave as a binary. The piece reproduces this (escape around t ≈ 60–70).
- Netflix/Liu Cixin: not mentioned in the VO; could go in the description ("yes, that three-body problem").

## Visual scenes to build (code), later
| Scene | Needs |
|---|---|
| 1, 3, 5, 6 | `pieces/three-body` record mode (`preset=pyth`, `twin`, `fig8`, `lagr`, `bfly`; `thick=2` for 4K) |
| 2 | Two-body ellipse (`preset=star` + one body) with the equation card |
| 4 | History cards: King Oscar, Poincaré, recalled journal, homoclinic tangle diagram |
| 7 | Scrolling series terms |
| 8 | Website capture (tools/capture-page.mjs): tap, drag-throw, presets |
| 9 | Recap montage from episodes 1–3 renders + Mandelbrot teaser (needs the Season 2 piece) |
