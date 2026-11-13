# Episode 3: "One line of algebra about rabbits hides infinity"

Season 1 (Chaos), episode 3. Follows episode 2's cliffhanger ("you need one line of algebra about
rabbits, and a number that shows up everywhere in nature").
Status: v2, third person. Narration generated (voice.json, ~4:11); scenes built in scenes/; awaiting narration review before the full render.
Interactive piece: `pieces/logistic-map/` (live on the site).

Alternative titles: "Zooming into chaos never ends" · "The number hiding inside chaos: 4.669" ·
"This equation is simpler than you think, and it's infinite".

---

The narration is in `voice.json` (the source of truth); `build.mjs` derives every scene's timing from it.

| Scene | Lines | Visual |
|---|---|---|
| hook | hook, hook2 | `pieces/logistic-map` dive from the whole diagram, equation card, title "One Line of Algebra" |
| rabbits | rab1–rab4 | `scenes/rabbits.html`: field of burrows + yearly bar chart, the two forces, the equation in words and symbols, May (1976) credit |
| dial | dial1–dial4 | `scenes/dial.html`: r dial and population over 64 years: 2.8 settles, 3.2 two values, 3.5 four, then 8, 16, 3.7 never repeats |
| picture | pic1–pic3 | `scenes/diagram.html`: diagram swept column by column with a live inset; calm windows marked; three glowing points at r = 3.835 |
| window | win1, win2 | the piece zooming into the period-3 window, then into the copy of the whole; Li and Yorke (1975) caption |
| feigenbaum | feig1–feig4 | `scenes/feigenbaum.html`: split points, gaps, ratios to 4.669; logistic and sine maps side by side; δ = 4.669201609…; Libchaber and Maurer (1980) |
| dive | dive1, dive2 | the piece's dive to 1.2 million times with a magnification readout and the 4.669 / 2.503 scale factors (iterations scale with depth so the picture stays dense) |
| site | site | website capture (`scenes/site-choreo.mjs`): hover, scroll-zoom, Dive into infinity; banner hiddenrulesart.github.io/rabbits |
| next | next | `scenes/next.html`: the Pythagorean three-body problem (masses 3, 4, 5), one body flung away; card "The Three-Body Problem" |

## Narration

**hook:** This picture comes from one line of algebra. Two multiplications, and one subtraction.

**hook2:** Zoom into it, and it keeps making copies of itself. Forever.

**rab1:** Here's the setup. Take a population of rabbits. Each year they breed, so next year there are more of them, multiplied by a growth rate, r.

**rab2:** But the more rabbits there are, the less food there is to go around, and the population gets pulled back down.

**rab3:** Written as math: next year's population equals r, times this year's, times one minus this year's. That's the whole model.

**rab4:** In 1976, the ecologist Robert May made it famous, with a warning: even this simple model can do very strange things.

**dial1:** Turn up the growth rate. At two point eight, the population wobbles a little, then settles down.

**dial2:** Past three, it stops settling. Boom year, bust year. Boom, bust, forever.

**dial3:** A little higher, and it cycles through four values. Then eight. Then sixteen.

**dial4:** And at about three point five seven, it never repeats at all. Same equation. No randomness. Chaos.

**pic1:** Now put every growth rate into one picture. Each column is one value of r. Run the rabbits for a thousand years, and mark where the population keeps landing.

**pic2:** One line splits into two. Two into four. The splits come faster and faster, and then it all explodes into chaos.

**pic3:** But inside the chaos there are gaps: calm windows where order comes back. In this one, the population cycles through exactly three values.

**win1:** Zoom into that window, and inside it is a tiny copy of the entire picture. Splitting, doubling, chaos, all over again.

**win2:** The paper that first used the word chaos in this sense had a famous title: Period Three Implies Chaos.

**feig1:** In 1975, a physicist named Mitchell Feigenbaum was studying these splits on a programmable pocket calculator. It was slow, so to save time, he started predicting where the next split would land.

**feig2:** He noticed that the gaps between the splits shrink by the same ratio every time. About four point six six nine.

**feig3:** Then he tried a completely different equation, built from a sine wave instead of rabbits. Same number. Four point six six nine.

**feig4:** It's now called Feigenbaum's constant, and it's universal. Experiments later found the same pattern in real fluids, heated from below.

**dive1:** And that number is the zoom factor of this fractal. Shrink the picture by four point six six nine one way, and two point five the other, and the same picture comes back.

**dive2:** This view is now magnified more than a million times, and the copies still haven't run out.

**site:** You can explore it yourself. The link is in the description. Hover over any column to see what the rabbits are doing, and zoom in as far as you like.

**next:** So far, chaos has turned up in pendulums, in weather, and in rabbits. But it was first discovered somewhere much bigger: in the sky. Newton solved the motion of two bodies. Nobody has ever solved three. That's the next video.

## Facts to double-check before recording
- Robert May, "Simple mathematical models with very complicated dynamics", *Nature* 261 (1976).
- Li & Yorke, "Period Three Implies Chaos", *American Mathematical Monthly* (1975): introduced "chaos" in this sense.
- Feigenbaum, Los Alamos, 1975, HP-65 calculator; published 1978. δ = 4.669201609…, α = 2.502907875…; same δ for the sine map.
- Split points: r₁ = 3, r₂ = 1 + √6 ≈ 3.449, r₃ ≈ 3.544, r₄ ≈ 3.564; accumulation r∞ ≈ 3.5699. Period-3 window opens at 1 + √8 ≈ 3.8284.
- Experiments: Libchaber & Maurer (1980), convection in liquid helium, showed period doubling consistent with Feigenbaum's prediction (measured δ was approximate; phrase it as "the same pattern").
- "Magnified more than a million times": the dive renders for real to 1.2 million times. A billion is not feasible: near the cascade the population passes the zoomed window only once every 2^n years.
- Population "for a thousand years" = 1000+ iterations in the piece (warm-up 900 + 600 plotted by default); keep the VO loose.

