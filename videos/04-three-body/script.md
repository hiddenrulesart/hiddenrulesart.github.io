# Episode 4: "Newton solved two bodies. Nobody has solved three."

Season 1 (Chaos), episode 4: the season finale. Follows episode 3's cliffhanger.
Status: v3 (2026-11-13): third person, rewritten to explain every idea before using it (episode 3 feedback);
scenes built in scenes/; narration so far only as a macOS `say` placeholder (ElevenLabs credits ran out).
Interactive piece: `pieces/three-body/` (hiddenrulesart.github.io/planets).

The narration is in `voice.json` (the source of truth); `build.mjs` derives every scene's timing from it.

| Scene | Lines | Visual |
|---|---|---|
| hook | hook, hook2 | `scenes/pyth.html` from t = 54: the smallest star thrown out, back, and out for good |
| gravity | grav1–three | `scenes/gravity.html`: pull arrows, distance doubles (pull ÷ 4), F = G·m₁·m₂/r² labelled term by term, the same ellipse orbit after orbit, a third star breaks it |
| steps | sim1, sim2, pyth1, pyth2 | `scenes/steps.html`: pull from each star + total, velocity, visible steps; the four-line loop; the 3-4-5 triangle labelled (Burrau 1913), let go |
| energy | en1, bug1, bug2, fix | `scenes/energy.html`: energy of motion / stored in gravity / total; fixed step vs adaptive, each with a total-energy graph, % change and step size |
| chaos | chaos1–3 | `scenes/pyth.html` from t = 0, clock keyed to throw-out (58), return (72), final escape (86) |
| prize | prize1–4 | `scenes/prize.html`: timeline 1885 / 1889 / 1889 / 1890, Acta Mathematica 13 |
| twin | twin1–3 | `scenes/twin.html`: two copies 1e-9 apart, largest-gap counter |
| order | ord1–4 | `scenes/order.html`: Lagrange triangle breaking, figure-eight, Butterfly I |
| sem | sem1, sem2 | `scenes/sem.html`: Sun–Earth–Moon, inset following the Earth |
| sundman | sund1, sund2 | `scenes/sundman.html`: the series, then 10^8,000,000 terms |
| site | site | website capture (`scenes/site-choreo.mjs`): taps and throws; banner hiddenrulesart.github.io/planets |
| recap1–4 | fin1 | ep 1 pendulum burst, Lorenz cloud, logistic dive, Pythagorean (clean renders, no text) |
| next | fin2 | `pieces/mandelbrot` dive, card "NEXT SEASON · Infinity" |

## Narration

**hook:** Three stars, pulling on each other with gravity. That's the entire setup. Nothing random, and nothing else involved.

**hook2:** For more than three hundred years, mathematicians have tried to write down a formula for what three bodies like these will do. Nobody has ever found one that works. This is the three-body problem.

**grav1:** Start with the rule itself. In 1687, Isaac Newton published his law of gravity. Every two objects pull on each other. The pull is stronger when the objects are heavier, and weaker when they're farther apart. Twice as far away, and the pull drops to a quarter.

**grav2:** Written as math: the force between them equals a fixed number, G, times the two masses, divided by the distance between them, squared.

**ell1:** With just two bodies, Newton could solve this completely. A planet going around a star moves on an ellipse, a stretched circle, and it traces the same ellipse forever.

**ell2:** So there's a formula. Give it where the planet starts and how fast it's moving, and it says exactly where the planet will be at any moment, even a million years from now.

**three:** The obvious next question was three bodies, like the Sun, the Earth and the Moon. Add a third star of similar size, and the clean ellipse is gone.

**sim1:** Without a formula, the only option is to simulate. Cut time into tiny steps. At each step, add up the pull on every star from all the others.

**sim2:** Those pulls change each star's velocity, its speed and direction, by a little. Then each star moves a little, along its new velocity. Repeat that thousands of times, and the stars trace out their paths.

**pyth1:** Here's a classic test, first posed in 1913. Three stars, with masses three, four and five, sit perfectly still at the corners of a right triangle whose sides are three, four and five long. Each star sits opposite the side with its own number.

**pyth2:** Nothing is moving yet. Let go, and gravity starts pulling them together.

**en1:** But there's a catch, and a simple way to check for it: energy. Moving stars carry energy of motion. Stars that are far apart store energy in gravity, which turns into speed as they fall toward each other. The two kinds trade back and forth, but the total can never change.

**bug1:** The first version of this simulation used the same small time step everywhere. Watch the total energy. In under two seconds, two stars pass very close to each other, and the energy, which should stay perfectly flat, shoots off the chart, to more than ten times its size. The stars are launched away at impossible speeds. The simulation has created energy out of nothing.

**bug2:** The problem is the close pass. When two stars nearly touch, the pull between them changes enormously in a tiny fraction of a second, and a fixed step can't keep up. Each step throws the stars a little too far, and a little too fast.

**fix:** The fix is to slow down time exactly when it matters: tiny steps during close passes, larger steps when nothing much is happening. Now the total energy holds steady, to within a few thousandths of a percent.

**chaos1:** And here is what the three stars really do. There's no ellipse, and no pattern that repeats. Every orbit keeps changing every other orbit.

**chaos2:** Near misses. Slingshots. The smallest star is thrown out, then dragged back in.

**chaos3:** Finally, after a long dance, the smallest star is flung away for good, and the other two head off the other way, circling each other as a pair. Nothing in the starting picture hints that this is how it ends. The only way to find out was to run it.

**prize1:** Mathematicians kept looking for a formula anyway. In 1885, King Oscar the Second of Sweden offered a prize for solving the motion of many bodies under gravity.

**prize2:** It went to the French mathematician Henri Poincaré. He hadn't solved the problem, but his paper was so deep that the judges gave him the prize anyway.

**prize3:** Then, while the paper was being printed, an editor found a mistake. Poincaré went back to fix it, and found something nobody expected: some orbits are so sensitive that the tiniest change in where they start sends them somewhere completely different.

**prize4:** He had found chaos, seventy years before Edward Lorenz and the weather. The printed copies were recalled and destroyed, and Poincaré paid for the new printing himself. It cost him more than the prize.

**twin1:** Here is that sensitivity in a simulation. Two copies of the same three stars. In the second copy, drawn in white outlines, one star starts out shifted by one billionth of a unit, while the stars themselves are a few units apart.

**twin2:** For a long time, the two copies can't be told apart. The counter shows the largest gap between them. One billionth. Then a millionth. A thousandth. And then they split into two completely different futures.

**twin3:** That's why no useful formula can exist. The answer depends on digits that nobody could ever measure.

**ord1:** But chaos isn't the whole story. A few special starting points repeat forever. In 1772, Joseph-Louis Lagrange found that three stars at the corners of an equilateral triangle can spin around together, keeping their shape.

**ord2:** With three equal stars, though, the triangle is fragile. The tiniest error, even the rounding inside a computer, grows until it tears the triangle apart.

**ord3:** Here's a stranger one: three equal stars chasing each other around a figure eight, all on the same path. It was found by computer in 1993, and proven to exist in 2000.

**ord4:** In 2013, two physicists in Belgrade found thirteen new families of repeating orbits, with names like the butterfly and the moth. Computer searches are still finding more.

**sem1:** So if three bodies are chaotic, how can eclipses be predicted centuries ahead? Because the Sun is so much heavier than the Earth and the Moon, and so far away, that the problem nearly splits into two simpler ones: the Earth around the Sun, and the Moon around the Earth.

**sem2:** Nearly, but not quite. The Sun keeps tugging on the Moon's orbit. Newton reportedly said the Moon was the only problem that ever gave him a headache.

**sund1:** And here is the strangest twist. In 1912, the Finnish mathematician Karl Sundman did find a formula for three bodies: an infinite sum, where each term adds a smaller correction, and adding up enough terms gives the answer as precisely as anyone wants.

**sund2:** The catch: for an answer accurate enough for astronomers, the sum needs about ten to the power of eight million terms. That's a number with eight million digits. The formula exists, but no computer could ever use it.

**site:** You can try it yourself. The link is in the description. Tap to drop a planet, drag to throw one, and try to build a solar system that doesn't fall apart. It's harder than it looks.

**fin1:** Pendulums, weather, rabbits, and now planets. Each time, a short, exact rule produced behavior that nobody can predict. And each time, the chaos wasn't just noise. It had structure, repeating inside itself.

**fin2:** Next season follows that structure all the way down, into a shape made from one line of math, which can be zoomed into forever without ever reaching the bottom.

## Facts to double-check before recording
- Newton, *Philosophiæ Naturalis Principia Mathematica* (1687): the two-body problem reduces to Kepler orbits (conic sections).
- **Bug scene (re-measured 2026-11-13):** Pythagorean start, fixed step dt = 0.01 (velocity then position), no softening: the energy error passes 50% at t = 1.84 and peaks at ~26× the starting energy (59× with dt = 0.001). On screen it settles at ~13× (1,344%) after the pass. VO: "more than ten times its size". Adaptive leapfrog with eta = 0.002: drift 4e-5 (0.004%) through the ejection. VO: "a few thousandths of a percent".
- **Step-size accuracy (2026-11-13):** with the piece's old eta = 0.015 the energy drifted 1.3% and the *wrong* body was ejected. eta = 0.002 and 0.0007 both give the published outcome (mass 3 thrown out ~t 60, back ~72, out for good after ~86; 4 and 5 leave as a pair 0.9 apart). The piece now defaults to 0.002.
- **Twin universes (measured):** "Butterfly effect" preset, 1e-9 offset: gap ~1e-6 by t ≈ 7, ~1e-3 by t ≈ 14, ~0.6 by t ≈ 18.
- **Lagrange triangle (measured):** three equal masses, side √3: the side length is off by 5% at t ≈ 63 (period 8.27), from rounding alone.
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

