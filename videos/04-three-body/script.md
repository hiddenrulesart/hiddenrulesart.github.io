# Episode 4: "Newton solved two planets. Nobody has solved three."

Season 1 (Chaos), episode 4: the season finale. Follows episode 3's cliffhanger ("chaos was actually
discovered in the sky. Newton solved two planets. Nobody has ever solved three.").
Target ~5:30 (~780 words of VO). Status: DRAFT v2 (ready for narration review). No scenes or narration built yet.
Interactive piece: `pieces/three-body/`.

**Title:** "I programmed three planets. Nobody can predict them."
Alternatives: "Newton solved two planets. Nobody has solved three." · "The problem that broke Newton (and created chaos)".
**Thumbnail:** the Pythagorean tangle in white/gold on black, one body streaking off the edge. Text: "3 > 2".

---

### 1. Hook (0:00–0:15)
**VISUAL:** Pythagorean preset at full brightness: three glowing stars tangling, near-misses, a slingshot,
then one gets flung off-screen. The camera lets it go. Text: "3 stars. 1 law. No formula."
**VO:** Three stars, pulling on each other with gravity. That's the entire setup. And for more than three
hundred years, the greatest mathematicians alive have tried to write down what they'll do. Let me show
you why they couldn't.

### 2. Two bodies (0:15–0:55)
**VISUAL:** "Your solar system" preset: one star, one planet tracing a clean ellipse, lap after lap, the
trail drawing over itself perfectly. Equation card: F = G·m₁·m₂ / r². Title card: *Principia*, 1687.
**VO:** In 1687, Isaac Newton published his law of gravity, and with it he solved two bodies completely.
A planet around a star moves on an ellipse, the same ellipse, forever. Tell me where it starts and how fast
it's going, and one formula tells you exactly where it'll be in a million years. So the obvious next
question was: what about three? Like the Sun, the Earth and the Moon.

### 3. Programming it (0:55–1:35)
**VISUAL:** Code on screen, highlighted line by line: a loop where every body is pulled toward every other.
Then the Pythagorean start: masses 3, 4 and 5 at rest on the corners of a 3-4-5 triangle.
**VO:** Simulating it is easy. Every tiny step, each star gets pulled toward the other two, I nudge its
speed, then nudge its position. That's the whole program, about ten lines. Here's a classic test from
1913: three stars with masses three, four and five, sitting still on the corners of a three-four-five
triangle. Let go, and...

### 4. The bug (1:35–2:15)
**VISUAL:** Naive fixed-step version. Two stars swing in for their first close pass and are launched off
at absurd speed. An "energy" meter that should stay flat spikes off the chart: "×100". Then the same start
with the adaptive step: the stars swing past each other cleanly and the meter stays flat. Overlay: step size
shrinking near the close pass ("tiny steps here").
**VO:** ...my first version broke in under two seconds. Two stars came close, and got launched away
at impossible speeds. The total energy, which physics says can never change, jumped about a hundred times
over. My code had created energy out of nothing. The problem: when two stars pass very close, gravity changes
so fast that even a tiny step overshoots. The fix is to slow down time exactly when it matters: tiny steps
during close encounters, big steps when nothing's happening. Now energy holds to a few hundredths of a
percent. And watch what the stars really do.

### 5. Chaos (2:15–2:50)
**VISUAL:** Pythagorean continues, sped up: loops, near-misses, a body thrown out and pulled back.
Around t≈60–70, the mass-3 star is ejected and the other two leave together as a pair, spinning around
each other.
**VO:** No ellipse. No pattern that ever repeats. Every orbit changes every other orbit, all the time. A
near miss, a slingshot, one gets thrown out... and dragged back in. This goes on for a long time, until
finally the smallest star is thrown out for good, and the other two leave together as a pair. Nothing about
the starting picture tells you that's how it ends. You only find out by running it.

### 6. The prize and the mistake (2:50–3:45)
**VISUAL:** An 1880s newspaper-style card: King Oscar II, a prize, a gold medal. Poincaré's portrait
(public domain). A printed journal issue gets stamped "RECALLED". Then a tangle diagram: two curves crossing
each other infinitely often.
**VO:** In 1885, King Oscar the Second of Sweden announced a prize for anyone who could crack it. The winner
was the French mathematician Henri Poincaré. He didn't solve it, but his paper was so brilliant that he won
anyway. Then, while it was being printed, an editor found a gap. Poincaré went back to fix it, and found
something nobody expected. Some orbits are so tangled that the slightest change in where you start sends
you somewhere completely different. He'd discovered chaos, seventy years before Lorenz. The journal had
to be recalled and reprinted, and Poincaré paid for it himself: more than the prize money he'd won.

### 7. The butterfly effect, in space (3:45–4:15)
**VISUAL:** "Butterfly effect" preset: a faint twin universe, offset by a billionth. They overlap perfectly,
then peel apart. Counter: "difference: 0.000000001 → 0.01 → 2.3".
**VO:** Here are two copies of the same three stars. In one, I moved a single star by one billionth. For a
while you can't tell them apart. Then the gap grows, and grows, until they're two completely different
universes. That's why there's no simple formula: the answer depends on digits nobody can ever measure.

### 8. Islands of order (4:15–4:55)
**VISUAL:** The figure-eight preset, slow and hypnotic. Then the Lagrange triangle spinning rigidly until it
falls apart. Then "Butterfly I" and a montage grid of periodic orbits.
**VO:** But chaos isn't the whole story. Some starting points dance forever. In 1772, Lagrange found three
bodies riding a spinning triangle. With equal masses it's fragile, and the tiniest rounding error tears it
apart. Here's a stranger one: three equal stars chasing each other around a figure eight, found by computer
in 1993 and proven in 2000. In 2013, two physicists in Belgrade found thirteen new families of these, with
names like "the butterfly" and "the moth". People are still finding more.

### 9. So how do we predict eclipses? (4:55–5:10)
**VISUAL:** Sun–Earth–Moon preset: the Moon looping neatly around the Earth as both circle the Sun.
**VO:** And if three bodies are chaotic, how do we predict eclipses centuries ahead? Because our Sun is so
much heavier than everything else that it's almost two separate two-body problems. Almost. Newton said the
Moon was the only problem that ever gave him a headache.

### 10. The useless formula (5:10–5:25)
**VISUAL:** An endless scroll of tiny equation terms filling the screen, getting smaller and smaller.
**VO:** Here's the strangest twist. In 1912, Karl Sundman actually found a formula: an infinite series that
solves three bodies. It's just useless. For a useful answer, you'd need a number of terms with
millions of digits. The solution exists. You can never use it.

### 11. Website (5:25–5:40)
**VISUAL:** Website capture: tapping to drop planets, dragging to throw one (arrow + dotted predicted path),
then the solar system falling apart. URL on screen: **hiddenrulesart.github.io/planets** (also first line of the description).
**VO:** You can play with it, link in the description. Tap to drop a planet, drag to throw one, and try to
build a solar system that doesn't fall apart. It's harder than it looks.

### 12. Season finale and cliffhanger (5:40–6:05)
**VISUAL:** Recap montage: rainbow pendulums, the Lorenz butterfly, the bifurcation zoom, the three-body
tangle. Cut to black, then the first frames of a Mandelbrot zoom.
**VO:** Pendulums, weather, rabbits, planets. Every time we looked closely at chaos, we found the same thing:
not noise, but structure hiding inside itself, again and again, forever. Next season, we follow that
structure all the way down, into a shape made from one line of math that you could zoom into for the rest
of your life and never see the same thing twice.

---

## Facts to double-check before recording
- Newton, *Philosophiæ Naturalis Principia Mathematica* (1687): the two-body problem reduces to Kepler orbits (conic sections).
- **Bug scene (measured in this repo, 2026-11-10):** Pythagorean start, naive fixed step, no softening. Energy error passes 50% at the first close encounter (t ≈ 1.9) for both dt = 0.01 and dt = 0.001, peaking at ~60–130× the starting energy, with two bodies leaving at 12–21 units/s. The piece's adaptive leapfrog keeps the drift ~4e-4 through the ejection. VO says "about a hundred times" and "a few hundredths of a percent"; both are OK. (Script used: Euler and symplectic Euler, `dt` fixed, T = 70.)
- Pythagorean problem: Burrau (1913); masses 3, 4, 5 at rest at the corners of a 3-4-5 right triangle (each mass opposite the side of the same length). Szebehely & Peters (1967) integrated it numerically: the mass-3 body is ejected and 4 and 5 leave as a binary. The piece reproduces this (escape around t ≈ 60–70). "The smallest star is thrown out" is correct (mass 3).
- Oscar II prize: announced 1885 in *Acta Mathematica*, deadline 1 June 1888, awarded to Poincaré on 21 January 1889 (the King's 60th birthday). The error was spotted while the memoir was being edited (Lars Edvard Phragmén's queries, 1889). The printed issue was recalled and destroyed; the corrected memoir appeared in *Acta Mathematica* 13 (1890). Poincaré paid for the reprint, about 3,585 crowns versus the 2,500-crown prize (June Barrow-Green, *Poincaré and the Three Body Problem*, 1997). Check the numbers before putting them on screen; the VO only says "more than the prize money".
- "Seventy years before Lorenz": 1889/1890 → 1961/1963. OK.
- Lagrange (1772): equilateral-triangle solution (Euler found the collinear ones, 1767). For equal masses it's linearly unstable (Routh's criterion needs one dominant mass).
- Figure-eight: found numerically by Cristopher Moore (1993); existence proved by Alain Chenciner and Richard Montgomery, *Annals of Mathematics* (2000). Initial conditions: x₁ = −x₂ = (0.97000436, −0.24308753), x₃ = 0, v₃ = (−0.93240737, −0.86473146), v₁ = v₂ = −v₃/2, period ≈ 6.3259.
- Šuvakov & Dmitrašinović, "Three Classes of Newtonian Three-Body Planar Periodic Orbits", *Physical Review Letters* 110, 114301 (2013): 13 new families (Institute of Physics, Belgrade); names include butterfly, moth, dragonfly, yarn, yin-yang.
- **Newton's headache:** the usual source is John Machin's report that Newton said "his head never ached but with his studies on the Moon" (quoted in Brewster's and Westfall's biographies). It's secondhand; the VO says "Newton said...". Soften to "Newton reportedly said..." if unsure.
- **Eclipses:** lunar theory works because the Sun–Earth–Moon system is hierarchical (the Moon is close to Earth, the Sun is far and dominant), so it's a strongly perturbed two-body problem solved by series and, today, numerical ephemerides (JPL DE). The VO keeps this simplified.
- Sundman (1912, *Acta Mathematica* 36): convergent series for the three-body problem (non-zero angular momentum). Commonly quoted: about 10^8,000,000 terms needed for astronomical accuracy (Beloriszky, 1930). "A number of terms with millions of digits" matches.
- Netflix/Liu Cixin: not in the VO; put it in the description ("yes, that three-body problem").

## Visual scenes to build (code), later
| Scene | Needs |
|---|---|
| 1, 3, 5, 7, 8, 9 | `pieces/three-body` record mode (presets `pyth`, `twin`, `fig8`, `lagr`, `bfly`, `sem`; `thick=2` for 4K) |
| 2 | Two-body ellipse (`preset=star` + one body) with the equation card |
| 4 | Side-by-side naive vs adaptive Pythagorean with an energy meter (new scene: fixed-step integrator + meter overlay) |
| 6 | History cards: King Oscar, Poincaré, recalled journal, homoclinic tangle diagram |
| 10 | Scrolling series terms |
| 11 | Website capture (tools/capture-page.mjs): tap, drag-throw, presets |
| 12 | Recap montage from episode 1–3 renders + Mandelbrot teaser (`pieces/mandelbrot` with `dive=1`) |
