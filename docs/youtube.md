# YouTube: channel, playlists, and per-episode upload text

Channel: **Hidden Rules** · handle **@HiddenRulesArt**.
Site links below use `hiddenrulesart.github.io` (planned free GitHub organization). Until it exists,
swap in `sirdevelop.github.io/generativeArt`. Chapter times come from the build timing; re-check them
if an episode is re-rendered.

## Channel

**Description (about section):**
> Pendulums, weather, rabbits, planets, coastlines. Behind each is a short, simple rule, and that rule
> hides chaos, infinite detail, or patterns nobody expected. Every video builds one of these rules as a
> real simulation, and every simulation is on the website to play with: drag it, tweak it, save it.
>
> Play with everything: https://hiddenrulesart.github.io

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

**Thumbnail:** `videos/01-double-pendulum/thumbnail.jpg` (rainbow fan, "0.00001° APART")

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

Narration voice generated with ElevenLabs. Simulation, visuals and code: https://github.com/sirDevelop/generativeArt
```

**Tags:** chaos theory, double pendulum, butterfly effect, physics simulation, generative art, Runge-Kutta, numerical methods, sensitive dependence on initial conditions

---

## Episode 2: Lorenz attractor

**Thumbnail:** `videos/02-lorenz/thumbnail.jpg` (butterfly attractor, "ONE ROUNDING ERROR")

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

Narration voice generated with ElevenLabs. Simulation, visuals and code: https://github.com/sirDevelop/generativeArt
```

**Tags:** Lorenz attractor, butterfly effect, chaos theory, Edward Lorenz, weather forecasting, strange attractor, physics simulation, generative art

---

## Upload checklist
- Add each episode to **Season 1: Chaos** (and episode 1 to **Start Here**).
- End screen (last ~20 s): "next episode" video element + subscribe element.
- Pin a comment with the play-it-yourself link.
- Altered or synthetic content: the narration voice is synthetic but the content is not realistic footage of
  real people or events; the description already discloses the AI voice.
