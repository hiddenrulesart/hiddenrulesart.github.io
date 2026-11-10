# Episode 1: "I programmed 1,000 pendulums. Then chaos happened."

Season 1 (Chaos), episode 1. Target length ~5 min (~750 words at ~150 wpm).
Status: DRAFT v1, awaiting review.

Each scene: **VISUAL** (what's on screen, all rendered from code) and **VO** (voiceover).

---

### 1. Hook (0:00–0:08)
**VISUAL:** 1,000 pendulums moving as one white line, then splitting into a rainbow. Text: "1,000 pendulums · 0.00001° apart".
**VO:** These are a thousand pendulums. They all started in almost exactly the same place, less than a millionth of a degree apart. Watch what happens.

### 2. The question (0:08–0:30)
**VISUAL:** The rainbow dissolves into full chaos. Fade to title card.
**VO:** Ten seconds later they have nothing in common. This is chaos, and it's the reason your weather app can't tell you if it'll rain two weeks from now. So I wanted to see it for myself. I programmed it from scratch, and it turned out stranger and more beautiful than I expected.
**TITLE CARD:** I programmed chaos.

### 3. A boring pendulum (0:30–1:00)
**VISUAL:** A single pendulum swinging gently at a small angle, with its path traced. The trace repeats.
**VO:** Let's start simple. One pendulum: a weight on a rod. Physics has understood this for 400 years. Give it a push and it swings back and forth, forever, on the same path. If I know where it is now, I can tell you where it'll be in a thousand years. Predictable. Boring.

### 4. Add one more arm (1:00–1:35)
**VISUAL:** A second arm attaches to the end. Lifted high and released, the tip traces a wild, never-repeating scribble.
**VO:** Now hang a second pendulum off the end of the first. That's it. One more rod. And the motion goes completely wild. The tip loops, flips, hesitates, and never repeats the same path twice. Same physics, same gravity, no randomness anywhere in the code. So where does this come from?

### 5. How to simulate it, and my first bug (1:35–2:30)
**VISUAL:** The equations of motion appear on screen. Then a split screen: "Euler method" vs "RK4". The Euler pendulum gains energy and spins faster and faster until it's whirling like a propeller; the RK4 one behaves. An energy graph: Euler shoots upward, RK4 stays flat.
**VO:** To simulate it, you need these equations. They look scary, but all they say is: given where the arms are and how fast they're moving, here's how they'll accelerate. The computer steps forward a tiny bit of time, again and again. My first version used the simplest way to do that, called Euler's method. And it was wrong. Watch the pendulum on the left. It's gaining energy out of nowhere, swinging higher and higher, until it's spinning like a propeller. That's impossible in real life. Each tiny step was adding a tiny error, and the errors piled up. So I switched to a smarter method called Runge–Kutta, which checks the slope four times per step. Now the energy stays constant to one part in a million, even after two minutes. Now we can trust what we see.

### 6. Two pendulums (2:30–3:10)
**VISUAL:** Two pendulums, one blue, one orange, 1° apart. They overlap, drift, then go completely different ways. A counter shows the gap between them.
**VO:** Here's the experiment. Two pendulums, one degree apart. For a few seconds you can barely tell them apart. Then they start to drift. And then they're doing completely different things. OK, one degree is a lot. What if I make the difference smaller? A thousand times smaller? A million times smaller?

### 7. One thousand pendulums (3:10–3:50)
**VISUAL:** The main piece. 1,000 pendulums, rainbow-colored by starting position, splitting apart. Full showcase with trails.
**VO:** So I did this. A thousand pendulums, each a tiny fraction of a degree apart from its neighbor. The whole group starts within a hundred-thousandth of a degree, so close that the tips are less than the width of a virus apart. For ten seconds they move as one. Then the rainbow appears: the colors are the tiny differences, finally becoming visible. And then it's chaos.

### 8. Why: exponential growth (3:50–4:30)
**VISUAL:** A graph of the gap between pendulums over time, log scale. It's a straight line going up: the gap doubles at a steady rate. Markers: "atom-sized", "hair-width", "completely different".
**VO:** Here's what's going on. Plot the gap between the pendulums over time, and it doubles, then doubles again, at a steady rate. That's exponential growth. Every tiny difference gets multiplied, again and again, until it's as big as the whole motion. Making the starting difference a thousand times smaller doesn't buy you a thousand times more time. It buys you a few seconds. That's chaos: not randomness, but extreme sensitivity to where you start.

### 9. Showcase (4:30–4:50)
**VISUAL:** Art montage: different starting angles, longer trails, 10,000 pendulums, vertical and horizontal compositions.
**VO:** (music only, or one line:) And honestly, it's also just beautiful.

### 10. Website + cliffhanger (4:50–5:15)
**VISUAL:** Screen capture of the website being played with: dragging, sliders. URL on screen. Then fade to a dark, slowly forming Lorenz attractor silhouette.
**VO:** You can play with this yourself. Link's in the description: drag the pendulums, change how close they start, and make your own. And this isn't just about pendulums. In 1961, a meteorologist named Edward Lorenz rounded one number in a weather simulation, and accidentally discovered that weather works exactly like this. What he saw next had a shape. That's the next video.

---

## Visual scenes to build (code)
| Scene | Needs |
|---|---|
| 1, 2, 7, 9 | Existing piece (record mode) |
| 3 | Single pendulum mode with path trace |
| 4 | Double pendulum, tip-trace mode |
| 5 | Equations card; Euler vs RK4 split screen; energy graph |
| 6 | Two-pendulum mode (2 colors) + gap counter |
| 8 | Animated log-scale divergence graph (real data from the sim) |
| 10 | Website screen recording (user records), Lorenz teaser |
| All | Title card, text overlays, music, assembly (ffmpeg) |
