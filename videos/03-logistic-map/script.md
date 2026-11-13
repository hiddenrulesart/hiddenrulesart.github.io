# Episode 3: "One line of algebra about rabbits hides infinity"

Season 1 (Chaos), episode 3. Follows episode 2's cliffhanger ("you need one line of algebra about
rabbits, and a number that shows up everywhere in nature").
Status: v3 (2026-11-13), rewritten after review: x and r defined before the equation, each term labelled in words,
"never repeats" spelled out, the diagram read column by column, Feigenbaum's constant explained through the actual gaps
and why the splits pile up at 3.5699. No title card. Runs ~6:55.
Interactive piece: `pieces/logistic-map/` (live on the site).

Alternative titles: "Zooming into chaos never ends" · "The number hiding inside chaos: 4.669" ·
"This equation is simpler than you think, and it's infinite".

---

The narration is in `voice.json` (the source of truth); `build.mjs` derives every scene's timing from it.

| Scene | Lines | Visual |
|---|---|---|
| hook | hook, hook2 | `pieces/logistic-map` dive from the whole diagram, equation card x_next = r · x · (1 − x) |
| rabbits | rab1–rab5 | `scenes/rabbits.html`: field of burrows with x readout (fills to 0.5 as x is defined), yearly bar chart, × r and × (1 − x) with meanings, the equation term by term with each term labelled in words, May (1976) credit |
| dial | dial1–dial5 | `scenes/dial.html`: r dial and population over 64 years: 2.8 settles, 3.2 two values, 3.5 four, then 8, 16, 3.7 never repeats |
| picture | pic1, pic1b, pic2, pic3 | `scenes/diagram.html`: diagram swept column by column with a live inset; cursor stops at 2.8 / 3.2 / 3.5 / 3.7 lighting up one, two, four values and the chaotic band; second sweep; calm windows marked; three glowing points at r = 3.835 |
| window | win1, win2 | the piece zooming into the period-3 window, then into the copy of the whole; Li and Yorke (1975) caption |
| feigenbaum | feig1–feig7 | `scenes/feigenbaum.html`: split points named as spoken, gap table, "4.75 / 4.66 / 4.67 times smaller → 4.669", the gaps summing to 3.5699 where chaos begins; logistic and sine maps side by side with their one-hump rules; δ = 4.669201609…; Libchaber and Maurer (1980) |
| dive | dive1, dive2 | the piece's dive to 1.2 million times with a magnification readout and the 4.669 / 2.503 scale factors (iterations scale with depth so the picture stays dense) |
| site | site | website capture (`scenes/site-choreo.mjs`): hover, scroll-zoom, Dive into infinity; banner hiddenrulesart.github.io/rabbits |
| next | next | `scenes/next.html`: the Pythagorean three-body problem (masses 3, 4, 5), one body flung away; card "The Three-Body Problem" |

## Narration

**hook:** This picture comes from one line of algebra about rabbits. Two multiplications, and one subtraction.

**hook2:** Zoom into it, and it keeps making copies of itself. Forever.

**rab1:** Here's the setup. Picture a field that can feed only so many rabbits. Call this year's population x, measured as a share of that maximum. So x equals zero point five means the field is half full.

**rab2:** Each year, the rabbits breed. On their own, next year's population would be this year's, multiplied by a number called r: the growth rate. An r of two means the rabbits would double every year.

**rab3:** But food is limited. One minus x is the share of the field that's still free. When the field is nearly full, that share is close to zero, and the population gets pulled back down.

**rab4:** Put the two together. Next year's population equals the growth rate, times this year's population, times the share of the field that's still free. That's the whole model.

**rab5:** In 1976, the ecologist Robert May made it famous, with a warning: even this simple model can do very strange things.

**dial1:** Now turn up the growth rate, and follow the population year by year. Each dot is one year. At r equals two point eight, the population wobbles a little, then settles on one value, and stays there.

**dial2:** Past three, it can't settle any more. One year the population is high, the next year it's low, then high again. It bounces between two values, forever.

**dial3:** A little higher, and the pattern takes four years to repeat. Then eight years. Then sixteen.

**dial4:** And past about three point five seven, the population never repeats at all. Every year it lands somewhere new, and no pattern ever comes back.

**dial5:** Nothing random is going on. Each year follows exactly from the one before, by the same rule. And still, the population can't be predicted far ahead. That is chaos.

**pic1:** Now put every growth rate into one picture. Along the bottom is the growth rate, r. For each value of r, run the rabbits for a thousand years, let them settle in, and then mark every population they keep landing on.

**pic1b:** Where the population settles on one value, there's a single dot. Where it bounces between two, two dots. Four values, four dots. And where it's chaotic, the dots smear into a band, because every year lands somewhere different.

**pic2:** So reading from left to right tells the same story as the dial. One line splits into two. Two into four. The splits come faster and faster, and then it all dissolves into chaos.

**pic3:** But inside the chaos there are gaps: calm windows where order comes back. In this one, the population cycles through exactly three values.

**win1:** Zoom into that window, and inside it is a tiny copy of the entire picture. Splitting, doubling, chaos, all over again.

**win2:** The paper that first used the word chaos in this sense had a famous title: Period Three Implies Chaos.

**feig1:** In 1975, a physicist named Mitchell Feigenbaum was studying these splits on a programmable pocket calculator. It was slow, so to save time, he started predicting where the next split would land.

**feig2:** Here are the splits. The first is at r equals three. The next, at three point four four nine. Then three point five four four, and three point five six four. They crowd closer and closer together.

**feig3:** Now measure the gaps between them. The first gap is about zero point four five. The second, about zero point zero nine five. The third, about zero point zero two.

**feig4:** Each gap is smaller than the one before by almost exactly the same factor. About four point six six nine. And the further along the splits go, the closer that factor gets to one fixed number.

**feig5:** Because every gap is four point six six nine times shorter than the last, the gaps add up to a finite distance. Infinitely many splits squeeze in before three point five seven. That's where chaos begins.

**feig6:** Then he tried a completely different equation, built from a sine wave instead of rabbits. The splits landed in different places. But the gaps shrank by the same factor. Four point six six nine.

**feig7:** It turns out that almost any rule shaped like a single smooth hump, rising and then falling, gives exactly this number. It's now called Feigenbaum's constant. Experiments later found the same pattern in real fluids, heated from below.

**dive1:** And that number is also the zoom factor of this fractal. Zoom toward the point where the splits pile up, by four point six six nine sideways and two point five up and down, and the same picture comes back.

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

