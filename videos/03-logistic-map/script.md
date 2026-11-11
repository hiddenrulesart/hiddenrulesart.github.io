# Episode 3: "One line of algebra about rabbits hides infinity"

Season 1 (Chaos), episode 3. Follows episode 2's cliffhanger ("you need one line of algebra about
rabbits, and a number that shows up everywhere in nature").
Target ~5 min (~750 words). Status: DRAFT v1, script only (no scenes or narration built yet).
Interactive piece: `pieces/logistic-map/` (live on the site).

Alternative titles: "I zoomed into chaos. It never ends." · "The number hiding inside chaos: 4.669" ·
"This equation is simpler than you think, and it's infinite".

---

### 1. Hook (0:00–0:12)
**VISUAL:** An endless zoom into the bifurcation diagram (the "Dive into infinity" animation). Each time
the branches split, an identical smaller copy appears. Text: "x → r·x·(1−x)".
**VO:** This picture comes from one line of algebra, a multiplication and a subtraction. I can zoom
into it forever, and it never stops making copies of itself.

### 2. Rabbits (0:12–0:50)
**VISUAL:** Cartoon bunny dots on a meadow. A bar chart of the population year by year. The equation
assembles itself: "next year = r × this year × (1 − this year)".
**VO:** Here's the setup. Take a population of rabbits. Each year, they breed, so more rabbits next
year, multiplied by a growth rate r. But the more rabbits there are, the less food there is, so the
population gets pulled back down. Write that as math and you get this: next year's population equals r,
times this year's, times one minus this year's. That's it. The ecologist Robert May made this famous in
1976 with a warning: even this simple model can do very strange things.

### 3. Turning up r (0:50–1:50)
**VISUAL:** Left: the population over time as a line graph. Right: a dial for r. As r rises: the line
settles flat (r = 2.8) → bounces between 2 values (r = 3.2) → 4 values (r = 3.5) → never repeats (r = 3.7).
**VO:** Let's turn up the growth rate. At 2.8, the population wobbles a bit and settles down. Boring, healthy
rabbits. Past 3, something odd happens: it stops settling. Boom year, bust year, boom, bust, forever.
Turn it up a little more and it cycles through four values. Then eight. Then sixteen. And somewhere around
3.57, it never repeats at all. Same equation, no randomness. Chaos.

### 4. The picture (1:50–2:40)
**VISUAL:** The bifurcation diagram builds column by column from left to right. Each column is one value of
r, and the bright dots are where the population ends up. A cursor sweeps across, and the inset graph
(population over time) updates live.
**VO:** So I made a picture of all of it at once. Every column is one growth rate. I run the rabbits for a
thousand years and plot where the population keeps landing. One line splits into two, two into four,
the splits come faster and faster, and then it explodes into chaos. And look: inside the chaos there are
gaps, calm windows where order comes back. In this one, the population cycles through exactly three values.

### 5. Period three (2:40–3:05)
**VISUAL:** Zoom into the period-3 window. Inside it, three tiny copies of the whole diagram appear,
splitting and exploding just like the big one.
**VO:** Zoom into that window and inside it is a tiny copy of the entire picture. Splitting, doubling,
chaos, all over again. In fact, the paper that first used the word "chaos" this way had a famous title:
"Period three implies chaos."

### 6. The calculator (3:05–4:00)
**VISUAL:** A 1970s programmable calculator. On screen, the split points marked on the diagram: 3, 3.449,
3.544, 3.564… The gaps between them shrink, and the ratios appear: 4.75, 4.66, 4.668… → **4.669201…**
**VO:** In 1975 a physicist named Mitchell Feigenbaum was studying these splits with a programmable pocket
calculator. It was slow, so he started predicting where the next split would land, to save time. He noticed
the gaps between splits shrink by the same ratio every time: about four point six six nine. Then he tried a
completely different equation, using a sine wave instead of rabbits. Same number. Four point six six nine.
It's now called Feigenbaum's constant, and it's universal: experiments later found the same pattern
in real fluids heated from below.

### 7. Dive into infinity (4:00–4:35)
**VISUAL:** The full dive animation toward the end of the cascade, using the real scaling: every
zoom step shrinks the picture by 4.669 sideways and 2.503 vertically, and the picture repeats exactly.
**VO:** And that number is the zoom factor of this fractal. Shrink the picture by four point six six nine
one way and two point five the other, and you get the same picture back. Forever. We're now zoomed in
more than a billion times, and the rabbits still haven't run out of copies.

### 8. Website (4:35–4:55)
**VISUAL:** Website capture: drag-box zoom, hover inset, "Dive into infinity" button. URL on screen.
**VO:** You can explore it yourself, link in the description. Hover over any column to see what the
rabbits are doing, and drag a box to zoom in as far as you like.

### 9. Cliffhanger (4:55–5:15)
**VISUAL:** Three glowing planets orbiting each other in a tangled dance, then one gets flung away.
**VO:** So far, chaos has been in pendulums, in weather, and in rabbits. But it was actually discovered
somewhere much bigger: in the sky. Newton solved two planets. Nobody has ever solved three. That's the
next video.

---

## Facts to double-check before recording
- Robert May, "Simple mathematical models with very complicated dynamics", *Nature* 261 (1976).
- Li & Yorke, "Period Three Implies Chaos", *American Mathematical Monthly* (1975): introduced "chaos" in this sense.
- Feigenbaum, Los Alamos, 1975, HP-65 calculator; published 1978. δ = 4.669201609…, α = 2.502907875…; same δ for the sine map.
- Split points: r₁ = 3, r₂ = 1 + √6 ≈ 3.449, r₃ ≈ 3.544, r₄ ≈ 3.564; accumulation r∞ ≈ 3.5699. Period-3 window opens at 1 + √8 ≈ 3.8284.
- Experiments: Libchaber & Maurer (1980), convection in liquid helium, showed period doubling consistent with Feigenbaum's prediction (measured δ was approximate; phrase it as "the same pattern").
- Population "for a thousand years" = 1000+ iterations in the piece (warm-up 900 + 600 plotted by default); keep the VO loose.

## Visual scenes to build (code), later
| Scene | Needs |
|---|---|
| 1, 7 | `pieces/logistic-map` record mode with `dive=1` |
| 2 | Rabbit-dot cartoon + bar chart, equation card |
| 3 | Population line graph for 4 values of r, with dial |
| 4, 5 | Diagram built column by column; zoom into period-3 window |
| 6 | Split points + ratio table animation |
| 8 | Website capture (tools/capture-page.mjs) |
| 9 | Three-body teaser (needs the episode 4 piece) |
