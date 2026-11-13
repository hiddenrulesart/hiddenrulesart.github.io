# YouTube: channel, playlists, and per-episode upload text

Channel: **Hidden Rules** · handle **@HiddenRulesArt**.
Each description has exactly **one** link: the play-it-yourself page for that episode (the same link shown
on screen in the video). No source-code link: it splits clicks and shows the personal GitHub name; the
site footer already links to the code. If the site moves (e.g. a `hiddenrulesart` GitHub organization or
a custom domain), update these links and the on-screen banners together. Chapter times come from the build
timing; re-check them if an episode is re-rendered.

Thumbnails: art only, **no text**, rendered from the real pieces at 1280×720 (`node tools/thumbnails.mjs`).

## Channel

**Description (about section):**
> Pendulums, weather, rabbits, planets, coastlines. Behind each is a short, simple rule, and that rule
> hides chaos, infinite detail, or patterns nobody expected. Every video builds one of these rules as a
> real simulation, and every simulation is on the website to play with: drag it, tweak it, save it.
>
> Play with everything: https://hiddenrulesart.github.io/

**Playlists** (create one per season as it starts, plus Start Here and Shorts):

| Playlist | Description |
|---|---|
| **Start Here** | The best place to begin: one episode from each season. |
| **Season 1: Chaos** | Why can't anyone predict the future? Pendulums, weather, rabbits, and three planets. |
| **Season 2: Infinity** | Shapes with endless detail: the Mandelbrot set, coastlines that have no length, ferns grown from four rules. |
| **Season 3: Emergence** | How simple rules build complex things: life, flocks, slime mold networks, zebra stripes. |
| **Season 4: Waves** | Circles that draw pictures, sand that finds patterns, and waves that cancel out. |
| **Shorts** | 30 seconds of each piece. |

---

## Episode 1: double pendulum

**Thumbnail:** `videos/01-double-pendulum/thumbnail.jpg` (the 1,000-pendulum burst from 3:30, no text)

**Title:** 1,000 Pendulums, 0.00001° Apart. Then Chaos.
Alternatives: "Why Nobody Can Predict a Double Pendulum" · "1,000 Pendulums Start Together. Seconds Later, Chaos."

**Description:**
```
Play with the pendulums yourself: https://hiddenrulesart.github.io/pendulum

1,000 double pendulums start within a hundred-thousandth of a degree of each other. A few seconds later, they have nothing in common. There is no randomness anywhere in the simulation: this is chaos, the reason a weather forecast can't see two weeks ahead.

0:00 1,000 pendulums
0:32 One pendulum: perfectly predictable
0:56 Add a second arm
1:35 Simulating it, and the bug that broke it
2:38 Two pendulums, one degree apart
3:03 1,000 pendulums, a hundred-thousandth of a degree apart
3:36 Why: exponential growth
4:17 Just beautiful
4:37 Play with it yourself
4:51 Next: the weather

Season 1: Chaos · Episode 1
Next episode: a rounding error in 1961 that changed weather forecasting.

Narration voice generated with ElevenLabs.
```

**Tags:** chaos theory, double pendulum, butterfly effect, physics simulation, generative art, Runge-Kutta, numerical methods, sensitive dependence on initial conditions

---

## Episode 2: Lorenz attractor

**Thumbnail:** `videos/02-lorenz/thumbnail.jpg` (the butterfly attractor, no text)

**Title:** The Rounding Error That Broke Weather Forecasting
Alternatives: "A Rounding Error Discovered the Butterfly Effect" · "0.506 vs 0.506127: How Chaos Was Discovered"

**Description:**
```
Fly around the attractor yourself: https://hiddenrulesart.github.io/lorenz

In 1961, the meteorologist Edward Lorenz re-ran a weather simulation from a printout that had rounded 0.506127 to 0.506. The forecast came out completely different. Two years later he reduced rising warm air to three equations, and found a shape that never repeats: the Lorenz attractor, the original butterfly effect.

0:00 2,000 particles
0:16 Pendulums were just the start
0:33 1961: the rounding error
1:19 Three equations
1:41 One particle draws a shape
2:15 The butterfly effect
2:56 Why forecasts stop at about ten days
3:19 Turning chaos off, and back on
4:05 Next: one line of algebra

Sources
- E. N. Lorenz, "Deterministic Nonperiodic Flow", Journal of the Atmospheric Sciences 20 (1963)
- E. N. Lorenz, "Predictability: Does the Flap of a Butterfly's Wings in Brazil Set Off a Tornado in Texas?", AAAS meeting (1972)
- J. Gleick, "Chaos: Making a New Science" (1987)

Season 1: Chaos · Episode 2
Previous: 1,000 pendulums (episode 1). Next: one line of algebra about rabbits.

Narration voice generated with ElevenLabs.
```

**Tags:** Lorenz attractor, butterfly effect, chaos theory, Edward Lorenz, weather forecasting, strange attractor, physics simulation, generative art

---

## Episode 3: logistic map

**Thumbnail:** `videos/03-logistic-map/thumbnail.jpg` (the bifurcation diagram from r = 2.85 to 4, glowing, no text)

**Title:** One Line of Algebra About Rabbits Hides Infinity
Alternatives: "The Number Hiding Inside Chaos: 4.669" · "Why Rabbit Populations Go Chaotic"

**Description:**
```
Explore it yourself: https://hiddenrulesart.github.io/rabbits

A field can feed only so many rabbits. Each year they breed, multiplying by a growth rate r, and the fuller the field gets, the harder food pulls them back down. As one line of algebra: next year's population = r × this year's population × (1 − this year's population).

Turn up the growth rate and the population settles, then bounces between 2 values, then 4, 8, 16, and finally never repeats at all: chaos, with nothing random in it. Put every growth rate into one picture and you get a fractal that contains copies of itself, forever. The splits along the way crowd together at a rate set by a universal number, Feigenbaum's constant, 4.669, the same for almost any rule shaped like a single hump.

0:00 One line of algebra
0:16 The rabbit model
1:04 The equation, term by term
1:28 Turning up the growth rate
2:06 Chaos: the population never repeats
2:36 Every growth rate in one picture
3:26 Calm windows inside the chaos
3:58 Feigenbaum's pocket calculator
4:32 Each gap 4.669 times smaller
5:01 Why chaos begins at 3.57
5:18 A different equation, the same number
5:50 Zooming a million times
6:16 Explore it yourself
6:32 Next: the three-body problem

Sources
- R. M. May, "Simple mathematical models with very complicated dynamics", Nature 261 (1976)
- T.-Y. Li and J. A. Yorke, "Period Three Implies Chaos", American Mathematical Monthly 82 (1975)
- M. J. Feigenbaum, "Quantitative universality for a class of nonlinear transformations", Journal of Statistical Physics 19 (1978)
- A. Libchaber and J. Maurer, "Une expérience de Rayleigh-Bénard de géométrie réduite", Journal de Physique Colloques 41 (1980)

Season 1: Chaos · Episode 3
Previous: the butterfly effect (episode 2). Next: the three-body problem.

Narration voice generated with ElevenLabs.
```

**Tags:** logistic map, bifurcation diagram, Feigenbaum constant, chaos theory, period doubling, fractal, Robert May, population dynamics, generative art

**Card / end screen:** card at ~6:32 (on "So far, chaos has turned up…") linking the Season 1 playlist until episode 4 is out.

---

## Upload checklist
- Add each episode to **Season 1: Chaos** (and episode 1 to **Start Here**).
- **End screen** (last 20 s): Video element on the **left** + Subscribe element on the **right**, small, never over the
  art in the centre. Video element = "Best for viewer" until the next episode is out, then switch it to that episode.
- **Cards:** one only, near the end (episode 1: ~4:51, on "In 1961, a meteorologist…"), linking the next episode
  (or the season playlist until it exists). No mid-video cards. (External website cards need the Partner Program.)
- Publish consecutive episodes within about a week, and update the previous episode's end screen + card the same day.
- Pin a comment with the play-it-yourself link.
- Altered or synthetic content: the narration voice is synthetic but the content is not realistic footage of
  real people or events; the description already discloses the AI voice.
