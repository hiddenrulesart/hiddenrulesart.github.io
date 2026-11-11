# Episode 2: "A rounding error discovered chaos. So I programmed it."

Season 1 (Chaos), episode 2. Follows the cliffhanger at the end of episode 1
("In 1961, one man found out by accident… what he saw next had a shape").
Target ~5 min (~750 words). Status: DRAFT v1, script only (no scenes or narration built yet).
Interactive piece: `pieces/lorenz/` (live on the site).

Alternative titles: "The butterfly effect, simulated" · "This shape broke weather forecasting" ·
"I programmed the butterfly effect".

---

### 1. Hook (0:00–0:10)
**VISUAL:** 2,000 particles in one tight dot, moving together. Then they smear apart and wrap around a glowing
3D butterfly shape. Text: "2,000 particles · 0.00001 apart".
**VO:** Two thousand particles. They start so close together they look like one dot. They follow three
simple equations, with no randomness at all. And they still end up everywhere.

### 2. Callback + question (0:10–0:35)
**VISUAL:** A quick cut back to episode 1's pendulums splitting into a rainbow. Then a vintage-style computer
printout with columns of numbers.
**VO:** Last time, a thousand pendulums showed us that tiny differences explode. But pendulums are toys.
This time it's the thing that actually ruined weather forecasting, and it was discovered by accident,
because of a rounding error.

### 3. The story: 1961 (0:35–1:30)
**VISUAL:** Two weather-like line graphs drawn by a "printer". They're identical at first, then they peel
apart. A big on-screen highlight: **0.506127** vs **0.506**.
**VO:** In 1961, a meteorologist at MIT named Edward Lorenz had a tiny weather simulation running on a
room-sized computer. One day he wanted to re-run part of it, so he typed in a number from an old
printout: 0.506. But the computer had stored 0.506127. The printout had just rounded it. He went to get
coffee. When he came back, the new run started out matching the old one, then drifted, and within a couple of
months of simulated weather it looked like a completely different planet. A difference of one part in
ten thousand had swallowed the whole forecast.

### 4. Three equations (1:30–2:10)
**VISUAL:** The three equations appear one at a time, each with a little cartoon: warm air rising in a loop
(x = how fast it rolls, y and z = temperature differences). Then the numbers σ = 10, ρ = 28, β = 8/3.
**VO:** Two years later, he boiled a model of warm air rising, like air over a hot road, down to just three
equations. x is how fast the air rolls. y and z are about temperature. Three numbers set the physics. That's
the whole system. I typed these into my computer, and here's one particle following the rules.

### 5. One path draws a shape (2:10–2:50)
**VISUAL:** A single glowing point traces its path. It loops around the left wing, flips to the right
wing, back again, unpredictably. Slowly a butterfly-shaped structure builds up, and the camera rotates
around it in 3D.
**VO:** It loops around one side, then for no obvious reason it flips to the other. It never repeats the same
loop twice. And yet it never leaves this shape. It can wander forever, but only here. Mathematicians call
this a strange attractor. Notice what it looks like.

### 6. The butterfly effect (2:50–3:30)
**VISUAL:** Back to the 2,000-particle cloud: one dot, then stretched into a thread, then folded, then
spread over both wings. A counter shows the cloud's size growing.
**VO:** Now the experiment. Two thousand particles, all starting within a hundred-thousandth of each other.
For a while they move as one. Then the cloud stretches into a thread, the thread gets folded, and soon the
particles are spread over the entire attractor. Knowing where you started, even almost perfectly, tells you
nothing about where you'll be. In 1972 Lorenz gave a talk with a now-famous title: "Does the flap of a
butterfly's wings in Brazil set off a tornado in Texas?"

### 7. Why forecasts stop at two weeks (3:30–4:00)
**VISUAL:** A 14-day weather app strip. Days 1–5 are crisp; days 10–14 blur and fade into the particle cloud.
**VO:** That's why your weather app is great for tomorrow, decent for five days, and basically guessing after
ten. It's not because meteorologists are bad, or computers are slow. Even a perfect model with
near-perfect data hits this wall. The atmosphere is a Lorenz system.

### 8. Turn the dial (4:00–4:35)
**VISUAL:** The ρ slider is turned down live: below about 24.7 the particles spiral into two calm points;
turned back up, chaos returns. Then ρ = 99.96: the path becomes a neat repeating knot.
**VO:** Here's the part that surprised me. Turn down ρ, think of it as how hard you're heating the air, and
below about twenty-four point seven the chaos just dies. Everything settles into two calm points. Turn it
back up, and the butterfly comes back. And at some special values, chaos gives way to perfect, repeating
knots. Chaos isn't everywhere. It switches on.

### 9. Showcase + website (4:35–5:00)
**VISUAL:** Montage: 5,000-particle storm cloud, single-path wing close-ups, slow rotation. Then a website
capture: dragging to rotate, presets, URL on screen: **sirdevelop.github.io/generativeArt/lorenz** (also first line of the description).
**VO:** You can fly around the attractor yourself, link in the description. Turn the dials and find your own
butterfly.

### 10. Cliffhanger (5:00–5:20)
**VISUAL:** A simple line graph of rabbit numbers going up and down, then splitting into two, four, eight
branches, then the bifurcation diagram fading in.
**VO:** But how does chaos switch on? It turns out you don't need three equations. You need one line of
algebra about rabbits. And inside it is a number that shows up everywhere in nature. That's the next video.

---

## Facts to double-check before recording
- Lorenz's 1961 machine was a Royal McBee LGP-30; he restarted from a printout with 3 decimals (0.506) vs 0.506127 stored. (Gleick, *Chaos*, 1987; Lorenz, *The Essence of Chaos*, 1993.)
- 1963 paper: "Deterministic Nonperiodic Flow", *Journal of the Atmospheric Sciences*. The 3 equations came from a simplified convection model (after Saltzman); σ = 10, ρ = 28, β = 8/3.
- 1972 AAAS talk title: "Predictability: Does the Flap of a Butterfly's Wings in Brazil Set Off a Tornado in Texas?"
- Chaos threshold ρ ≈ 24.74 (for σ = 10, β = 8/3); ρ = 99.96 gives a periodic "knot" orbit (verify visually in the piece).
- Optional bonus fact: whether the Lorenz attractor is truly chaotic was only proven in 2002 (Warwick Tucker, computer-assisted proof; one of Smale's problems).

## Visual scenes to build (code), later
| Scene | Needs |
|---|---|
| 1, 6, 9 | `pieces/lorenz` record mode (cloud, presets) |
| 2 | Clip from episode 1; printout animation |
| 3 | Two "weather" traces diverging (could be two Lorenz x(t) traces 0.000127 apart: true to the story) |
| 4 | Equation cards + rising-air cartoon |
| 5 | Single path drawing, rotating camera |
| 7 | 14-day forecast strip blurring into particles |
| 8 | Slider being turned (website capture or scene with ρ animated) |
| 10 | Teaser for logistic map |
