# Feature Spec — "Explore the Layers" (Network Camera Tour)

> Status: **proposed / not built.** This is a design+implementation spec to pick up
> later. It deepens the existing signature interaction (the neural pipeline canvas)
> instead of adding a second showpiece. Read `IDEA.md`, `DESIGN.md`, and the existing
> `components/pipeline/*` before building.

---

## 1. The core principle (why this shape, not the other one)

We considered making the whole page a scroll-driven camera tour of the network. We
rejected that: it scroll-jacks every visitor, fights the recruiter's "answer in
seconds" need (PRODUCT.md), and forces three separate page modes (full / reduced /
mobile) — high effort, high regression, wrong trade for a job-search portfolio.

**This feature is the disciplined version: two paths, one signature.**

- **Path 1 — Scan (default, unchanged).** The page stays a normal, scannable vertical
  document: hero → autonomously-animating network → case studies → experience timeline
  → contact. A recruiter in a hurry scrolls straight through and never has to engage
  with anything special. Nothing is gated behind an animation.
- **Path 2 — Explore (opt-in reward).** A visitor who is curious enters an "Explore the
  layers" mode *inside the network section only*. The camera flies through the network
  layer by layer: zoom into a layer, dim the rest, surface a detail panel explaining
  that layer's nodes, then move to the next. Self-contained, escapable, never traps the
  reader.

The wow is a **reward for engagement, not a tax on every visit.** That is the whole
point of the design. If implementation ever starts to violate this (e.g. the tour
becomes mandatory, or default scroll gets hijacked), stop and re-read this section.

---

## 2. What the user sees (the experience, end to end)

### 2.1 Default state (Path 1)
The network section behaves as it does today: the canvas boots, resolves, the
`● INFERENCE: LIVE` chip sits at the top, packets fire autonomously down the synapses,
and hover-to-inspect isolates a node. Somewhere in/near the section there is a single,
quiet invitation:

> `[ ⤢ Explore the layers ]`  — a ghost button (mono label, hairline border, cobalt on
> hover), placed under the network or as a pinned control in a corner of the canvas
> zone. It is the *only* new affordance in the default view. It must read as optional.

### 2.2 Entering Explore mode (Path 2)
On click (or keyboard activate):
1. The autonomous packet loop **pauses** (or drops to a slow idle) — the tour owns the
   canvas now; competing motion would muddy it and cost frames.
2. A lightweight **tour chrome** fades in over the canvas:
   - A vertical (desktop) **layer rail** on one side: 5 stops, each a short mono label
     (`01 Inputs`, `02 Core Stack`, `03 Projects`, `04 Experience`, `05 Result`). The
     active stop is lit cobalt; visited stops are dim-cobalt; unvisited are hairline.
   - **Prev / Next** controls (`←` / `→` or `↑` / `↓`) and a persistent **Exit** (`✕` /
     "Esc to exit").
   - A thin **progress indicator** (which stop of 5).
3. The camera animates from the full-network framing to the **first stop** (see §3 for
   order). This first move is the "we're going in" moment: a smooth dolly-in.

### 2.3 At a stop (the per-layer beat)
For each stop the choreography is the same (details in §4):
- The camera is **framed on one layer** (that layer's nodes fill the comfortable center
  of the canvas with padding).
- **Other layers dim** to a low alpha; the **active layer brightens**; synapses
  entering/leaving the active layer stay partially lit to keep the "it's still one
  network" read.
- A **detail panel** (DOM, glassmorphic per DESIGN.md) slides/fades in, listing that
  layer's nodes with their metric/description. This is the "detailed box of
  explanation" from the idea. Panel content is real DOM text (a11y/SEO), not painted on
  canvas.
- The active layer's nodes may show their per-node label chips (reuse `NodeBadge`).

### 2.4 Moving to the next stop
On Next (button, key, or scroll-within-section if Mode B is enabled):
- The current detail panel **closes** (fade/slide out, ~250 ms).
- The camera **zooms out a touch** (≈10–15% smaller) for a breath, then **pans** to the
  next layer and **zooms back in** to frame it (the "zoom out a bit, then into the next
  nodes" beat from the idea). One continuous dolly, ~700–900 ms.
- The new layer brightens, others dim, the new panel comes in.

### 2.5 Exiting
On Exit / Esc / scrolling past the section:
- Tour chrome fades out, all layers return to neutral brightness, the camera eases back
  to the full-network framing, and the autonomous packet loop **resumes**.
- The page is exactly where it was; the visitor continues scrolling to case studies.

---

## 3. The tour structure (stops, order, content)

The network has five layers (`networkData.ts` → `LAYERS`):

| Stop | Index | Layer (moniker) | Detail panel content |
|---|---|---|---|
| 01 | 0 | Inputs / Passions | The 4 passion nodes + one-line each (what drives the work). |
| 02 | 1 | Transformation / Core Skills | The 6 skills, each with expertise pill + "since" + energy bar. |
| 03 | 2 | Outputs / Projects | The project cards: problem→impact metric, tech, Code/Demo links. |
| 04 | 3 | Deployment / Experience | The roles + education (mirrors the timeline cards we built). |
| 05 | 4 | Core Result | The single "ready for the next mission" node + a CTA to contact. |

**Order decision (open — pick one before building):**
- **A. Forward (recommended): 01 → 05**, left→right, the natural reading of a forward
  pass. "Passions feed skills, skills ship projects, projects became experience, all
  converge on: ready." Matches the network's own data-flow direction and the page's
  narrative.
- **B. As described in the idea: start at Experience (04), move left to Projects (03)…**
  i.e. outcome-first, trace backward. Valid and a little more cinematic ("here's what I
  did, here's how I got there"), but it reads against the network's flow arrows and can
  feel like going the wrong way. If chosen, reverse the synapse-packet direction during
  the tour so motion doesn't contradict the camera.

Recommendation: **A (forward)**. Keep the stop order in a single config array so it can
be flipped without touching choreography.

---

## 4. Animation choreography (every beat, with numbers)

All easing references the project token: **`ease-out-quint` =
`cubic-bezier(0.22, 1, 0.36, 1)`** (already in `tailwind.config.ts`). No bounce, no
elastic (DESIGN.md). Times below are starting points to tune in-browser.

### 4.1 The camera model
A camera is `{ x, y, scale }` applied to the canvas 2D context each frame:

```
ctx.setTransform(scale, 0, 0, scale, -x*scale + W/2, -y*scale + H/2)
```

- `(x, y)` = the world point centered on screen; `scale` = zoom. `W,H` = canvas size.
- To **frame a layer**: compute the bounding box of that layer's node positions
  (min/max of `node.x`, `node.y` — these are produced by the existing layout in
  `NeuralPipeline`; expose them). Then:
  - `targetScale = min(W / (bboxW + pad), H / (bboxH + pad))`, clamped to a sane
    `[minScale, maxScale]` (e.g. 0.8–2.6) so a 1-node layer (Result) doesn't zoom to
    absurd magnification.
  - `target.x, target.y` = bbox center. Add a slight offset if the detail panel occupies
    one side (e.g. shift the framed layer left so a right-side panel doesn't cover it).
- The camera **interpolates** from current to target. Two ways to drive it:
  - **Tween (Mode A, buttons):** GSAP tween on the camera object (`gsap.to(cam, {x,y,
    scale, duration, ease})`), redraw on update. GSAP is already a dependency.
  - **Scrub (Mode B, scroll):** map section scroll progress → an interpolated position
    along the ordered stop list; lerp camera between stop N and N+1 by the fractional
    progress. (See §6.)

### 4.2 Enter transition (default → stop 01)
1. `t0`: button pressed. Pause autonomous packets (ramp their alpha to idle over
   ~200 ms so it doesn't snap).
2. `t0`: tour chrome fades in (opacity 0→1, 250 ms).
3. `t0+100ms`: camera tween from full-network framing to stop-01 framing
   (~900 ms, `ease-out-quint`). Simultaneously, the dim/brighten of layers animates
   (active layer alpha →1, others →~0.12) over the same window.
4. `t0+700ms` (overlap, before camera fully settles): detail panel for stop 01 enters
   (fade + 12 px slide, 320 ms), its list items stagger in (~60 ms each).

### 4.3 Stop → stop transition (the dolly)
Given current stop A, next stop B:
1. **Close (0–250 ms):** panel A fades + slides out (16 px). Active-layer A eases back
   toward neutral brightness.
2. **Dolly (150–950 ms, overlapping close):** camera scale dips to `min(scaleA,scaleB) *
   0.88` mid-flight (the "zoom out a bit"), pans `x,y` toward B, then settles to
   `scaleB`. One tween with a slightly back-loaded ease so the zoom-out→in feels like a
   single breath, not two moves. ~700–800 ms total.
3. **Open (700–1050 ms):** layer B brightens, others stay dim, panel B enters (fade +
   slide), list items stagger.

Total per step ≈ **0.8–1.0 s**. Keep it brisk; a slow cinematic is the failure mode.

### 4.4 Dim / brighten model
- Active layer: node alpha 1, node ring cobalt, the focused-on-hover node may go lime
  (the one live signal stays lime-only).
- Inactive layers: node + synapse alpha → ~0.10–0.14 (still faintly visible so the whole
  network is legible as context, not erased).
- **Connective synapses** between the active layer and its neighbors: keep at ~0.4 alpha
  so the viewer sees how this layer wires into the rest. This is the detail that makes it
  feel like "a network being inspected," not "slides."
- Animate alpha changes over ~300 ms; never hard-cut (except reduced-motion, §5).

### 4.5 Exit transition
- Panel out (250 ms), chrome out (250 ms), camera eases to full-network framing
  (~800 ms), all layers return to neutral alpha, packets ramp back up. Reverse of enter.

### 4.6 Micro-details that sell it
- A faint **vignette / radial dim** at the canvas edges while in tour mode focuses the
  eye on the framed layer.
- The active layer's nodes can do a subtle **one-shot pulse** when they arrive in frame
  (reuse the timeline node's "lights as trace reaches" pulse).
- The layer rail's active label can get a tiny **typing/scramble** flourish on change
  (machine voice) — optional, keep ≤300 ms.
- Keep the `● INFERENCE: LIVE` chip visible but recolor its label to the active layer
  name during the tour (e.g. `● INSPECTING: EXPERIENCE`).

---

## 5. Reduced motion & accessibility (mandatory, not optional)

### 5.1 `prefers-reduced-motion: reduce`
- No camera tween, no dolly: **instant cuts** between framings (set camera directly).
- Panels **crossfade** (no slide), no item stagger.
- No autonomous packets (already the project's reduced-motion behavior).
- Everything else (dim/brighten) can switch instantly.
- The tour is still usable; it just doesn't move smoothly.

### 5.2 Keyboard & focus
- The "Explore" button is a real `<button>`; tour chrome controls are buttons.
- In-tour: **arrow keys** move stops, **Esc** exits, **Tab** moves focus into the active
  detail panel (which is real, focusable DOM). Focus must be visibly ringed (the global
  `:focus-visible` lime ring already exists).
- On exit, return focus to the "Explore" button (focus restoration).

### 5.3 Content is never locked in canvas
- Every layer's detail content lives in **DOM panels** (and the existing `sr-only`
  `PipelineContent` a11y tree). Screen readers and crawlers get the full content with or
  without the tour. The canvas camera is pure presentation.
- The detail panels should be readable as a plain stacked list if the tour never runs.

---

## 6. Two driving modes (build A first, B is a stretch)

### Mode A — Discrete, control-driven (MVP, recommended)
- Camera flies between stops on **button / tab / arrow-key** activation.
- **No scroll involvement at all** → zero scroll-jack risk, simplest state, easiest to
  test. This is the version that respects the "two paths" principle most cleanly.
- State: `exploreActive: boolean`, `stop: number`, `transitioning: boolean`.

### Mode B — Scroll-within-section (optional enhancement)
- While in Explore mode, **pin the network section** and map its scroll progress to the
  stop sequence (GSAP ScrollTrigger `pin: true, scrub: true`), so scrolling scrubs the
  camera through the layers.
- Hard rules if you build this: the pin is **contained to this one section**, there is a
  **prominent progress bar**, **Esc / Exit always works**, and the pinned scroll budget
  is **short** (≈ one viewport per stop, not more). The moment it feels like the page
  "won't scroll," it has failed.
- Mode B should be **opt-in even within Explore** (e.g. enter via "Explore" = Mode A;
  Mode B only if you explicitly decide the section earns a pinned scrub). Do not ship B
  as the only way in.

---

## 7. Mobile (< 768px)

The canvas is a static stacked fallback below 768px (hard constraint). The camera tour
does **not** run on mobile. Two acceptable options:

1. **Reuse the existing stacked layout** — the "Explore" button is simply hidden; mobile
   users get the normal scannable sections (including the timeline cards). Simplest.
2. **Tap-through accordion** — an "Explore the layers" control that expands each layer's
   detail panel in a stacked accordion (no canvas camera, just expand/collapse with a
   short height/opacity transition). Gives mobile a taste of the concept without the 3D
   camera. More work; optional.

Recommend **Option 1 for MVP**, Option 2 later if desired. Do not attempt the canvas
camera on phones.

---

## 8. Performance

- **One owner of the canvas at a time.** During the tour, pause the autonomous
  forward/backprop packet loop; the camera tween owns redraws. Resume on exit.
- **Redraw only on change:** redraw on camera update (during a tween) and on hover; when
  the camera is settled and idle, stop issuing draws (or drop to a low idle).
- **Pause when the section is offscreen** (already a project constraint) — the tour and
  any rAF must stop when scrolled away.
- Camera transform via `setTransform` is cheap; the cost is redrawing all nodes/synapses
  per frame during a tween. With the current node count that's fine; if the network grows,
  consider drawing dimmed layers to an offscreen cached canvas and compositing.
- Watch the worst moment: dolly + dim animation + panel DOM transition firing together.
  Test on a mid-tier laptop, not just the dev machine. A stutter here undermines the
  whole pitch (PRODUCT.md).

---

## 9. Technical implementation sketch

**Reuse, don't rebuild:**
- `components/pipeline/networkData.ts` → `LAYERS` for stop content + ordering.
- `components/pipeline/NeuralPipeline.tsx` → already owns the canvas, node layout
  (`node.x/y`), the autonomous loop, hover isolation, and scroll/boot state. The camera
  + tour state live here (or in a new `useLayerCamera` hook it consumes).
- `components/pipeline/DetailCard.tsx` / `NodeBadge.tsx` → the detail-panel content and
  node label chips.
- `framer-motion` for the DOM tour chrome + panel transitions; `gsap` for the camera
  tween (and ScrollTrigger if Mode B).

**New pieces:**
- A camera object `{ x, y, scale }` + a `frameLayer(index)` that computes target from the
  layer's node bbox.
- A small **state machine**: `idle → entering → at-stop(i) → transitioning → … → exiting
  → idle`. Guard against rapid input (interrupt/retarget the active tween rather than
  queueing).
- **Tour chrome** component: layer rail, prev/next, exit, progress, recolored status chip.
- **Detail panel** component (or extend `DetailCard`): screen-anchored (not node-tracked
  — see catch §10), glassmorphic, lists the active layer's nodes.

**Camera math reference:**
```
function frameLayer(nodes, W, H, pad = 80, panelOffsetX = 0) {
  const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const bw = (maxX - minX) || 1, bh = (maxY - minY) || 1;
  const scale = clamp(Math.min(W / (bw + pad), H / (bh + pad)), 0.8, 2.6);
  return { x: (minX + maxX) / 2 + panelOffsetX, y: (minY + maxY) / 2, scale };
}
```

---

## 10. Edge cases & catches (the stuff that ships broken)

1. **DOM panels vs a moving camera.** Anchor detail panels to a **fixed screen position**
   (e.g. a right-side or bottom column), *not* to individual node screen-coordinates.
   Node-tracking panels must recompute position every frame against the zooming camera —
   that's the #1 jank source. Screen-anchored panels are robust; the camera frames the
   layer, the panel sits in a stable slot. Spec'd this way on purpose.
2. **Resize / browser zoom mid-tour.** Recompute `W,H` and re-`frameLayer` the current
   stop on resize; snap (don't tween) to avoid a lurch.
3. **Interrupting tweens.** Rapid Next/Prev or tab-jumping must **kill the active tween
   and retarget**, not stack tweens (or the camera fights itself).
4. **Entering mid-boot.** Gate the "Explore" button until the boot timeline completes and
   the network has resolved (`bootReveal` / booted state already exists).
5. **Scroll position on enter/exit.** On enter, optionally scroll the section to a known
   anchor so the canvas is fully in view before the tour starts; on exit, leave scroll
   untouched.
6. **The 1-node Result layer.** Don't let `frameLayer` zoom a single node to max scale;
   the clamp handles it, but frame it with extra padding + the converge/contact CTA so
   the last stop feels like an arrival, not a bug.
7. **Mode B only:** never let the pinned scrub trap the user; always-visible Exit, short
   budget, prominent progress. If in doubt, ship Mode A only.
8. **Don't let the tour become mandatory.** If a future change auto-opens the tour or
   gates content behind it, it has violated §1. The default page must stay scannable.

---

## 11. Phased build plan

- **Phase 0 — Plumbing.** Expose per-layer node bboxes from `NeuralPipeline` layout; add
  the camera object + `frameLayer`; render the camera transform (no UI yet) and verify a
  hardcoded `frameLayer(3)` zooms to Experience cleanly.
- **Phase 1 — Mode A MVP.** "Explore" button, tour chrome (rail + prev/next + exit),
  dim/brighten, one screen-anchored detail panel, the enter/step/exit choreography.
  Reduced-motion = instant cuts. Mobile = button hidden. Ship this.
- **Phase 2 — Polish.** Vignette, arrival pulse, status-chip relabel, list staggers,
  keyboard nav + focus restoration, in-browser timing tune on a mid-tier machine.
- **Phase 3 (optional) — Mode B.** Pinned scroll-scrub *inside the section* with hard
  guardrails (§6). Only if it clearly earns it.
- **Phase 4 (optional) — Mobile accordion.** The tap-through layer accordion.

---

## 12. Decisions to lock before building

1. **Tour order:** forward 01→05 (recommended) or outcome-first 04→…?
2. **Entry affordance:** a button under the network, or a corner control pinned on the
   canvas, or both?
3. **Detail panel placement:** right-side column, bottom sheet, or centered card? (Drives
   the `panelOffsetX` camera shift.)
4. **Mode B in scope, or Mode A only for v1?** (Recommend A only.)
5. **Mobile:** hide Explore (MVP) or build the accordion?
6. **Does the tour replace hover-to-inspect, or coexist?** (Recommend coexist: hover in
   default state, guided panels in tour state.)

---

## 13. One-paragraph honest framing (carry this into the build)

This feature is worth building **only as the opt-in second path.** Its value is letting a
curious recruiter or engineer go deeper into the one signature interaction you already
have, on their terms, while the fast scanner is never slowed down. The risks are all in
overreach: making it mandatory, scroll-jacking the page, slow cinematic pacing, or a
janky canvas↔DOM handoff. Keep it short, keep it escapable, keep the default page
scannable, and test the dolly on a mid-tier machine. Done with that discipline it is a
genuine "how was this made?" moment. Done without it, it's the thing that makes people
close the tab.
