# Build Log

A running, plain-language record of how this portfolio is being built: the prompts
given, the decisions made, and the flow from idea to shipped site. Read this to
understand *how we got here* without re-reading every file. Newest entry on top.

> **Maintenance:** This log must keep growing across sessions. See the
> "Build Log Protocol" in `CLAUDE.md` for when and how to append. One entry per
> meaningful step (a command run, a feature built, a decision made).

---

## The impeccable flow (command sequence)

The whole site is being designed and built with the **`/impeccable`** skill (a
frontend design system that turns a brief into production code through a sequence of
sub-commands). Tracking the order they're run in, so the workflow itself is
reproducible. `←` marks where we are.

| # | Command | Purpose | Status |
|---|---------|---------|--------|
| 1 | `/impeccable init` | Wrote `PRODUCT.md` (strategy) | ✅ done |
| 2 | `/impeccable document` | Wrote `DESIGN.md` + sidecar (visual system) | ✅ done |
| 3 | `/impeccable craft hero` | Scaffold Next.js + build Section 1 (hero + living-backdrop canvas) | ✅ done |
| 4 | `/impeccable craft neural-pipeline` | Build Section 2 — **horizontal** interactive pipeline (5 columns, living logo-token nodes, self-playing boot → live chip, glass detail cards) | ✅ done |
| 5 | `/impeccable shape` + build experience | Build Section 4 — "Signal Trace" experience timeline (cobalt spine, scroll-drawn trace + packet dot, lime `running` head) | ✅ done |
| 6 | `/impeccable shape` + polish experience | More-life pass on Section 4 — card hover-zoom, year pulled to an outside-left gutter, role-icon spine nodes, removed the autonomous spine pulse | ✅ done |
| 7 | `/impeccable craft` — experience pop + shine | Scroll-in "pop" on the timeline cards (scale 0.96→1 + rise), plus a faint diagonal cool-white hover shine across the card surface | ✅ done |
| 8 | `/impeccable craft` — projects (Section 3) | Orbital "Output layer": projects orbit a core, spotlight autoplay + proximity-open, fixed right detail panel; static scannable cards on mobile / reduced-motion. Polish: on-orbit fix, cobalt nodes, lime "me" core, panel hover pop+shine | ✅ done  ← |
| 9 | CLI contact (Section 5, planned) | Convergent output node + terminal contact form | ⬜ planned |

Update this table whenever an impeccable command is run or the plan changes.

---

## Ideas & direction from the user (idea thread)

A separate thread for ideas, preferences, and course-corrections the user gives as
we go — kept apart from my own design decisions so the user's *intent* is easy to
trace. Newest on top. Each entry: date + the idea + how it was applied.

- **2026-06-18** — (Experiment, `feature/lime-thread`) v3 harden overshot — the dot felt too
  snappy and the dwell-band made it **vanish far from the dots before arriving**. User wanted the
  v2 feel back: slow, smooth, simple, travels all the way to each dot, snaps only a little at the
  end. → v4 re-tune: removed the dwell-band (visible the whole travel), slowed the glide (ease
  0.2) + gentle fade (decay 0.1), and added an **end-snap** onto the nearest dot at idle so it
  always dissolves *on* a dot. Kept the experience trace-sync (gap 0). → Entry 022.
- **2026-06-18** — (Experiment, `feature/lime-thread`) **Keep & harden** the lime thread.
  Three fixes: **snappier dissolve** (frame-delta idle at 90ms + faster op decay, ignoring
  momentum/settle scroll events that lagged it to ~1s); **experience sync** — the lime dot now
  glues exactly to the cobalt trace tip (measured gap **0px**) by following an invisible
  scaleY-clone of the trace; **dwell-band emergence** — the dot stays dissolved while a
  section's dot is comfortably in view and only emerges during between-section travel, so
  projects no longer pops in (it appears as the core passes ~top-30%). → Entry 021.
- **2026-06-18** — (Experiment, on `feature/lime-thread`, not merged) Refined the
  "lime me threads the page" idea into the **anchored traveler (v2)**: the dot starts/ends at
  each section's real lime dot, **dissolves into** the current section's dot at rest (fixes
  the v1 duplicate/floating problem), rides the **spine** through experience, and leaves a
  faint comet trail; each dot blooms on dock. First set up a **git snapshot + branch** so the
  whole thing is one-command revertible (`git init`; `main` = the pre-experiment state). Added
  lime anchors to experience (consolidated the "running" chip into a spine "now" dot) + contact;
  a registry connects all four. → Entry 020.
- **2026-06-18** — Wanted **small prev/next arrows** on the projects detail panel to step
  left/right, almost invisible, popping lightly on hover. → Added near-invisible (`opacity-20`)
  chevron buttons flanking the spotlight dots; hover/focus pops them (full opacity + scale +
  cobalt ring). Desktop panel only (mobile already shows all cards). (Part of Entry 019.)
- **2026-06-18** — The lime "me" center was too small; wanted the **big lime node like the
  neural network's result node**. → Enlarged it to a ~64px lime token (Target bullseye + lime
  border/fill/glow + soft halo + pulse ring), matching the network's `isCore` result node.
  (Part of Entry 019.)
- **2026-06-18** — Refinements to the orbital projects: the detail panel should **pop +
  shine on hover** like the experience cards; the orbiting nodes **weren't tracking the
  orbit line** (fix); project nodes should glow **cobalt** (in sync with the network +
  experience nodes), **not lime**; and the **center** should be the **lime "me" dot** like
  the network's result node. → All four done. Root-caused the drift: nodes rotated about
  their own center, not the stage center; rewrote placement with trig + centering. → Entry 019.
- **2026-06-18** — Wanted the **Projects section (Section 3)** built from a pasted
  shadcn radial-orbital component: orbit continuously rotating, auto-popping each project
  for a few seconds then vanishing to the next, plus proximity-open (nearest node opens as
  the mouse approaches, holds while on the card). Asked for a brutal design judgment + a
  left/center/right call. → I flagged the verbatim paste as wrong for this codebase (not
  shadcn; Tailwind v3 vs the v4 CSS it ships; off-brand purple/teal/glass; full-screen
  black) and the auto-vanish behavior as recruiter-hostile + a moving click target. Chose
  the **refined model**: left orbit + fixed right detail panel, slow spin with a
  **spotlight** autoplay (no vanishing cards), proximity-open + hold, static scannable
  cards on mobile / reduced-motion. Content **reuses the pipeline's Outputs nodes** (single
  source); proj2/proj3 are drafted case studies to replace. → Entry 018.
- **2026-06-18** — Gave a reference image of a card with a **slight diagonal shine** in
  the background on hover; wanted that effect added. → Added a hover-only diagonal sheen
  (cool-white, brightest top-left, fading out, clipped to the card). Kept it within DESIGN
  doctrine: a subtle surface highlight, not a glow halo or glass blur. → Entry 017.
- **2026-06-18** — Wanted the experience cards livelier with a **slight pop** + subtle
  animation; gave options to pick from (`/impeccable craft`). User chose **scroll-in pop**
  (cards scale up + rise as they enter view, cascading down the timeline). I dropped the
  opacity-fade part of that option on purpose — gating visibility re-introduces the known
  Entry-013 blank-card bug — and kept scale + rise, which carries the pop while staying
  visible on SSR / no-JS. Hover unchanged. → Entry 016.
- **2026-06-18** — Wanted the same per-role icons in the **neural network** nodes. The
  canvas had one glyph per *kind* (all experience nodes = briefcase). → Added a per-node
  `ROLE_GLYPH` override in `NodeBadge.tsx` (id wins over kind), passed `id={node.id}` from
  `NodeToken` + `DetailCard`. Layer 4 now shows briefcase / backpack / graduation cap;
  everything else unchanged.
- **2026-06-17** — Wanted the spine node icons to match the network: **job → briefcase**,
  education kept (graduation cap), internship a distinct glyph if one exists else briefcase.
  → The network maps every experience node to `Briefcase` (`NodeBadge.tsx`), so job uses it;
  intern got `Backpack` (distinct, reads student-worker); MS stays `GraduationCap`. Drives
  both the spine token and the faint card watermark. (Part of Entry 015.)
- **2026-06-17** — Follow-up correction: **remove the uptime ticker** on the running
  role. Done — dropped `UptimeTicker` + `RUNNING_SINCE` and the now-unused
  `useEffect`/`useState` imports; the lime `running` tag stays. (Part of Entry 015.)
- **2026-06-17** — Wanted **more life in the employment section**: boxes that zoom a
  little on hover, more modern/lively touches, a few details pulled to the **left
  outside** the box, and the **shooting-star** spine pulse gone — slight improvisations,
  not a remodel; think + ask first. → Ran `/impeccable shape`, asked 2 questions. User
  chose **year-only** gutter (left of the spine, desktop) and **role-icon tokens** for the
  spine nodes. Flagged + dropped a proposed cobalt left edge bar (it's the side-stripe
  pattern `DESIGN.md` bans). Shipped hover-zoom + node halo + year→cobalt-on-hover, removed
  the pulse. → Entry 015.
- **2026-06-17** — Idea (deferred, not built): turn the neural network into an opt-in
  **"Explore the layers"** camera tour — scroll/click flies the canvas camera layer to
  layer, dims the rest, surfaces detail panels. After review we scoped it to **two paths**
  (scannable default + opt-in explore) to avoid scroll-jacking the recruiter. Full spec
  written to `EXPLORE_LAYERS.md` for later implementation. Awaiting direction.
- **2026-06-17** — Wanted the timeline elevated with a few more design details + subtle
  animation, options-first, via `/impeccable craft`. Chose: **tech-logo chips**, **per-role
  glyph watermark**, **live uptime ticker** (running role), **autonomous spine pulse**, and
  **staggered bullet reveal** (declined cursor spotlight). All implemented. → Entry 014.
- **2026-06-17** — First timeline pass was too sparse + had a bug (year clipped by the
  node). Direction: put **each experience in its own box that pops subtly on hover**,
  add modern subtle animation + more detail, use `/impeccable craft`. Chose: **lift +
  cobalt-border** hover, **tech-stack chips**, and **2–3 bullets** per role (not a
  one-liner). Rebuilt as lifted cards on the spine; fixed the clip by moving the date
  into the card; nodes now light as the scroll-trace reaches them (floating dot dropped).
  → Entry 013.
- **2026-06-17** — Wanted the **experience section** shaped after the neural network:
  think creatively, render options, ask questions, assume nothing, keep it on-theme,
  include small animations. → Ran `/impeccable shape`; asked 3 questions. User chose:
  polished placeholders (not real content yet), the timeline **expands** the canvas
  Deployment layer (not a duplicate), and the **"Signal Trace"** concept (cobalt spine =
  the network's synapse continued, scroll-drawn, lime `running` on the current role).
  Built as `components/experience/ExperienceTimeline.tsx`. → Entry 012.
- **2026-06-17** — Wanted to cut token use: have `cavecrew-investigator` map the
  folder structure and write a **Folder Map** into `CLAUDE.md` so future sessions
  skim it instead of re-scanning the tree. → Added a `## Folder Map` section and
  fixed the stale "greenfield / no `package.json`" status (the Next.js app is in
  fact scaffolded and runs).
- **2026-06-17** — Caught a spec/code conflict: `CLAUDE.md` still described Section 2
  as "strictly **vertical**, no horizontal panning" with a 4-layer Input→Hidden→Output
  model. The shipped code (`NeuralPipeline.tsx`, `networkData.ts`) is **horizontal** —
  five columns left→right (Inputs → Transformation → Outputs → Deployment → Core
  Result). Decision: **keep the implementation**, update `CLAUDE.md` to match (page
  still scrolls top→bottom; only the Section 2 network is horizontal).
- **2026-06-09** — Three bugs after the boot shipped: (1) scrolling back to the hero left
  the network + `INFERENCE: LIVE` chip visible behind it (overlap); (2) the first "hover
  to inspect" hint fired at ~1s while the rest were ~3.5s; (3) the chip's green dot pinged
  too hard. → Added a scroll-driven **`netVis`** that hides the whole network + chip at the
  hero; **started the hint interval on boot-complete** (first ~3.5s, consistent); **softened
  the chip dot**. → Entry 011.
- **2026-06-09** — Two real failures: the loader contradicted the network (both were
  scroll-driven, so the net assembled while "INITIALIZING" still showed), and the "hover
  to inspect" hint only fired in a narrow scroll window (so a real visitor never saw it).
  → Reworked the boot into a **self-playing power-on** timeline: the loader fills on an
  **empty** canvas, then the network **ignites left→right** and the loader converges into
  the top live chip (the whole network is gated behind `bootReveal`, hidden until boot).
  Fixed the hint to fire on **booted + canvas-in-view** — guaranteed first ~1s after boot,
  then every ~3.5s, stopping on first hover. → Entry 010.
- **2026-06-09** — The tokens sat dead-still and the tiny "hover any node" hint got
  scrolled past (people missed the canvas). → Added **subtle life** (slow drift + a gentle
  lean toward the cursor) and a **two-part attention system**: a boot loader that
  **converges into a top "● INFERENCE: LIVE" chip**, plus a recurring **"hover to inspect"
  label + node pulse** on a random node every ~3.5s that **stops on the first hover**.
  Chosen over auto-opening the full card (too heavy). → Entry 009.
- **2026-06-08** — Node restyle: the 3D-sphere neurons read dated, the result node's
  rotating green boxes were "very weird," and hover felt rough. Referenced an orbital
  component (RadialOrbitalTimeline) but only for its **neuron style + click-pop
  animation**, NOT the orbital layout. → Nodes became **flat circular logo-tokens**
  (brand icon inside), **hover-to-open with a smooth scale-pop**, **active fills +
  related nodes pulse**, **data-flow pulses on trigger**; result node is now a clean
  **lime core**. Nodes moved canvas→DOM (framer) for buttery transitions; the synapse
  web + pulses stay on canvas. Entry 008.
- **2026-06-08** — Redesigned Section 2 from a reference mockup: **strictly horizontal**
  L→R, **5 labeled columns** (Inputs → Transformation → Outputs → Deployment → Core
  Result), **big breathing sphere nodes**, a **rich glassmorphic detail card** (logo,
  energy bar, connected chips), and a **boot-up assemble** scroll transition out of the
  hero. Decisions: boot-up L→R; real brand logos via simple-icons; Claude drafts
  content for correction. → Entry 007.
- **2026-06-08** — Phase 2 direction (Section 2, the interactive pipeline). Three
  decisions: (1) **one continuous canvas** spanning hero → pipeline (scroll-driven
  resolve), not a separate section; (2) the output layer is **3-4 project nodes**
  (restores IDEA.md §2), with the single convergence node saved for Section 5;
  (3) node content is **drafted by Claude from PRODUCT.md for the user to correct** —
  project names + every metric are placeholders awaiting real values. → Entry 006.
- **2026-06-07** — Wants the background physically interactive (repel/swiggle on mouse
  proximity); suggested anime.js but open to alternatives. → Chose repel + spring-back
  + click ripple, done with spring math in the existing ticker loop (no anime.js).
  Entry 005.
- **2026-06-07** — Hero craft direction: scope = **hero only** (full interactive
  network deferred to Section 2); framework = **Next.js**; type = **distinctive
  display + JetBrains Mono** (Claude chose Geist). Status line = user's own phrase
  **"Accepting Missions"**; tagline = the three-discipline version; CTA = scroll
  anchor to a `#contact` stub; résumé = placeholder PDF. → All applied in Entry 003.
- **2026-06-07** — Wants the build itself documented (this log) and the documentation
  to continue across sessions. → Created `BUILD_LOG.md` + a standing protocol in
  `CLAUDE.md`.
- **2026-06-07** — Wants the log to also track the impeccable command *flow* and the
  user's own ideas as they come up. → Added the flow table and this idea thread.
- **2026-06-07** — On the metallic gradient headings from `IDEA.md`: open question,
  user may veto the sheen exception later. *(awaiting direction)*

---

## How to read a step entry

Each entry answers four things in order:
1. **Prompt** — what was asked, in the user's words (paraphrased if long).
2. **Flow** — what was actually done, step by step, in plain language.
3. **Decisions** — choices made and *why* (especially anything non-obvious).
4. **Output** — files created or changed.

---

## Entry 022 — Lime thread: re-tune to the v2 feel (slow, smooth, lands on the dot)

**Prompt** — The v3 harden felt wrong: "snapping is too much," the dot "disappears before
arriving at the dot," "far from the main dots." Liked the previous version — "slow smooth simple
clean." Snap only a little at the end, smoothly.

**Flow** — One-file re-tune of `LimeThread.tsx`. Verified probes (gentle fade; experience sync
still gap 0) + a mid-scroll capture showing the dot gliding all the way to the orbit core, then
settling into it. `tsc` + `next build` clean. Branch only.

**Decisions** —
- **Removed the dwell-band** (the main villain): visibility back to `idle ? 0 : 0.82`, so the dot
  stays visible the whole way to each dot instead of vanishing mid-travel.
- **Slowed it down**: position ease `0.2` (was 0.3/0.45), op decay `0.1` (was 0.3), idle `150ms`
  (was 90) — slow, smooth fade, not a snap.
- **End-snap**: at idle the dot eases onto the **nearest dock's exact center**, so it always
  dissolves *on* a main dot, never far away. Experience (riding the tip) fades in place on the
  spine instead.
- **Kept** the experience trace-tip follow (gap 0) and the comet trail.

**Output** —
- `components/thread/LimeThread.tsx` only (`anchorStore.ts` + the experience tip marker unchanged).
- Verified: `tsc` clean; `next build` passes; gentle dissolve + 0px trace sync + visible travel to
  the dot confirmed. `main` untouched.

---

## Entry 021 — Lime thread harden: snappy dissolve, trace-sync, dwell-band

**Prompt** — Keep & harden: make the dissolve snappier; in experience the lime dot leads/lags
the cobalt "blue line" (sync it); in projects the dot appears instantly — dwell, then emerge
when the core dot is ~top-30% of the viewport (soft rule, "make it look clean").

**Flow** — Three targeted fixes to `LimeThread.tsx` (+ `anchorStore.ts`, `ExperienceTimeline.tsx`).
Verified numerically via opacity/position probes (dissolve op→0 by ~0.4s and stays; experience
dot vs trace tip **gap 0px** at three scroll positions; projects op=0 with the core centered)
and a mid-scroll capture (traveler + comet trail intact). `tsc` + `next build` clean. Branch only.

**Decisions** —
- **Snappy dissolve:** idle is detected by **frame-delta** (scrollY actually changing) at a 90ms
  threshold + op decay 0.3. A `scroll`-event listener was *worse* — momentum/settle events at the
  same Y kept refreshing "moving," delaying the dissolve.
- **Experience sync:** added an invisible **scaleY clone** of the trace (same `scrollYProgress`
  mapping) whose bottom edge is the live trace tip; registered it as a `track` anchor; the
  traveler **follows it directly** while on screen → glued to the blue line (gap 0). Replaced the
  static spine-bottom waypoint.
- **Dwell-band:** the dot is hidden while the nearest dock's viewport-center fraction is in
  `[0.30, 0.72]` (section comfortably in view) and only visible during between-section travel, so
  it no longer pops in at projects. Experience is exempt (rides the tip visibly). Idle always
  forces the dissolve.

**Output** —
- `components/thread/LimeThread.tsx` (loop rewrite), `anchorStore.ts` (`track` meta),
  `ExperienceTimeline.tsx` (trace-tip marker; spine-end waypoint removed).
- Verified: `tsc` clean; `next build` passes; probes confirm snappy dissolve + 0px trace sync +
  projects dwell. `main` untouched.

---

## Entry 020 — Lime "me" thread: anchored traveler (on feature/lime-thread)

**Prompt** — A series: build the page-spanning lime "me" node, then refine — start/end at the
green dots, reveal each section's items after the dot, make experience travel the spine (not
random), and have the dot dissolve into the section's dot at rest and re-appear on scroll.
"Judge first, ask, then implement." Plus: set up easy rollback before building.

**Flow** — Set up a **git snapshot + feature branch** (the project wasn't a repo yet) so the
work is one-command revertible. Judged the refinements (the dissolve mechanic fixes the v1
duplicate/floating lime; the network nodes are DOM — `tokenRefs` — so anchoring is feasible).
Asked 3 questions → bloom-sync, all-four-sections, dot+trail. Built the registry + rewrote the
traveler. Verified each section at rest (single lime dot, dissolve works) and mid-scroll
(traveler + comet trail). `tsc` + `next build` clean. All on `feature/lime-thread`.

**Decisions** —
- **Anchor registry** (`components/thread/anchorStore.ts`): each section registers its lime
  element; the traveler reads live `getBoundingClientRect` → layout-proof (no hardcoded vw/vh
  like the v1 prototype, which floated off-anchor).
- **Traveler** (`LimeThread.tsx`): rAF loop, routes the dot along the polyline of live anchor
  centers by scroll; comet **follow-chain trail** with `mix-blend-mode: screen` (clean over
  text); **dissolve** on scroll-idle (~160ms) into the nearest dock + a one-shot **bloom**;
  re-emerges on scroll. Caught a framer-vs-inline-transform bug on the bloom (positioned
  wrapper + inner scaling span).
- **Experience**: added a lime **"now"** dot at the spine head, **consolidating** the old
  lime "running" chip into it (one lime, not two) + an invisible spine-bottom waypoint so the
  dot **rides the wire** down. Role nodes stay cobalt.
- **Contact**: a placeholder lime node (previews the planned Section 5 convergent node).
- **Fallbacks**: `prefers-reduced-motion` + `< lg` → no traveler; the four static lime dots
  remain (the recurring-anchor motif).

**Output** —
- New: `components/thread/anchorStore.ts`, `LimeThread.tsx` (rewrite), `ContactAnchor.tsx`.
- Registrations: `NeuralPipeline.tsx` (result node), `OrbitalProjects.tsx` (orbit core),
  `ExperienceTimeline.tsx` (spine "now" + waypoint, running chip removed), `app/page.tsx`
  (contact node).
- Verified: `tsc` clean; `next build` passes; screenshots confirm at-rest single dots +
  mid-scroll traveler/trail. `main` untouched — awaiting the user's keep/revert call.

---

## Entry 019 — Projects orbit: on-line fix, cobalt nodes, lime "me" core, panel hover

**Prompt** — `craft keep the same effect of the detail card when hovered to pop a little
and little glow ... exactly like in experience detail cards. All other orbit rotating is
not following the exact orbit line, correct that and make the project nodes glow blue ...
not green. centre node should be the green dot representing me like the last node in the
neural network.`

**Flow** — Loaded craft. Four targeted fixes to `OrbitalProjects.tsx`; verified in-browser
(two rotation frames for drift, forced panel-hover for pop + shine); `tsc` + `next build` clean.

**Decisions** —
- **Panel hover pop + shine:** split the panel into a **stable wrapper** (border / surface /
  padding / rounded / overflow-hidden) carrying the experience-card hover treatment
  (`hover:-translate-y-0.5 hover:scale-[1.015] hover:border-infra/45 hover:bg-[#0d121c]`) +
  the same diagonal cool-white shine span. The `AnimatePresence` crossfade child only animates
  opacity/y → no transform fight with the CSS hover.
- **Orbit drift root cause:** each node's position element rotated about its *own*
  (button-sized) center instead of the stage center, so nodes wobbled off the ring. Rewrote
  placement: position by trig (`left/top = 50% ± R·cos/sin`) + `translate(-50%,-50%)`
  centering (rotation-origin-independent), with one counter-spin to stay upright. Ring rotation
  about the stage center now keeps every node exactly on radius `R` = the drawn ring.
- **Color sync:** active node lime → **cobalt** (glow `bg-infra/25`, `border-infra text-infra`),
  matching the pipeline + experience spine nodes. Resting stays cobalt.
- **Center = lime "me" node:** the cobalt `Boxes` hub became a small **lime core** (dot + soft
  glow + ping), echoing the network's result/output node. Color logic now: cobalt = the
  project nodes + structure; lime = the center "me" node + the one impact metric per card.

**Output** —
- `components/projects/OrbitalProjects.tsx` — panel hover wrapper + shine; node placement
  rewrite; cobalt active node; lime center.
- Verified: `tsc --noEmit` clean; `next build` passes; two rotation frames show nodes riding
  the ring with no drift (active cobalt, center lime); forced panel hover shows the pop +
  shine; mobile static cards unchanged.

---

## Entry 018 — Projects section (Section 3): orbital "Output layer"

**Prompt** — `craft [pasted shadcn radial-orbital-timeline component + deps] ... here is
the prompt i want to create the projects section as`, then: continuous rotate + auto-pop
each project for a few seconds then disappear to the next; proximity-open + hold; "judge
this brutally honest" + tell me left / center / right.

**Flow** — Loaded craft. Recon found the project is Tailwind v3 + TS + Next but **not
shadcn** (no `components/ui`, no `lib/utils`/`cn`; `class-variance-authority` /
`@radix-ui/react-slot` / `clsx` / `tailwind-merge` not installed), and the pasted
`globals.css` is Tailwind **v4** syntax. Gave a brutally-honest critique (auto-vanish
cards are recruiter-hostile and yank the metric mid-read; aiming at a moving node; a card
glued to an orbiting node overflows the viewport; motion overload + reduced-motion must
fully disable it; redundant with the pipeline's node-graph). User picked the refined model
+ reuse-pipeline-projects + left layout. Built, verified desktop + autoplay cadence +
mobile, production build passes.

**Decisions** —
- **Did not paste the component.** Verbatim it would break the v3 build (v4 CSS), pull a
  second token system that fights the charcoal/cobalt/lime theme, and ship off-brand
  purple/teal/glass + full-screen black. Rebuilt the orbital concept in the project's system.
- **Refined interaction:** left orbit + **fixed right detail panel** (decouples node
  position from card position → no jumping/overflow). Slow CSS spin on the ring with
  **counter-spun** nodes so labels stay upright; spin pauses on proximity. A **spotlight**
  autoplay (4.2s) advances which project the panel shows — no card appears-and-vanishes.
  Pointer within 96px of a node hands it the spotlight and holds (incl. while the pointer is
  on the panel); leaving resumes autoplay. Keyboard: nodes are `<button>`s — focus opens +
  pauses, with a visible focus ring.
- **No blank-ship:** the panel always shows a project; `AnimatePresence initial={false}` so
  SSR/first paint isn't empty.
- **Single source of truth:** reads `LAYERS[2]` (pipeline Outputs). Added a `problem` field
  to `PipeNode`; fleshed the two `‹Project›` placeholders into drafted case studies (ids
  `proj2`/`proj3` kept so nothing else breaks; unverifiable numbers left in `‹›` to replace).
- **On-brand:** charcoal + cobalt structure + lime active node (glow on the node = the
  machine, allowed); panel chrome stays flat; lime kept rare (active node + impact metric).
- **Fallbacks:** below `lg` and under `prefers-reduced-motion` → a static, fully-readable
  stack of scannable case-study cards (Problem / Approach / Impact / stack / Code + Demo) —
  the recruiter-scannable path the spec calls for.

**Output** —
- `components/projects/OrbitalProjects.tsx` (new); wired into `app/page.tsx` Section 3 slot.
- `components/pipeline/networkData.ts` — `problem` field + fleshed `proj2`/`proj3` (shared
  with the pipeline, so its Outputs nodes now show the real names too).
- Verified: `tsc --noEmit` clean; `next build` passes (196 kB first load, static prerender);
  desktop orbit + panel render correctly and the spotlight cycles NLP → Feature Store →
  Model Serving (~4.2s); mobile shows the static cards. Reduced-motion → static (code path).

---

## Entry 017 — Experience cards: diagonal hover shine

**Prompt** — `craft [image] here is the image of a card when hovered active, slight
diagonal shine to the card in the background, can you add that effect as well.`

**Flow** — Loaded `craft`. The supplied image was the confirmed visual direction, so the
shape gate was skipped. Added a hover-only diagonal sheen to the experience cards; verified
by forcing the hover state in-browser (real `:hover` is flaky in the headless build).

**Decisions** —
- **Hover diagonal sheen:** an `inset-0` gradient span inside the inner card —
  `linear-gradient(125deg, rgba(226,235,255,0.07) 0%, rgba(226,235,255,0.025) 26%,
  transparent 52%)`, brightest top-left, `opacity-0 → group-hover:opacity-100`, clipped by
  the card's `overflow-hidden`, at `z-0` behind the watermark + content.
- **Within DESIGN doctrine:** a subtle surface highlight (the instrument catching light),
  not a drop-shadow glow on chrome and not a backdrop-blur glass card; alpha capped ~0.07 so
  it reads "slight," matching the reference image.
- Reduced motion: `motion-reduce:transition-none` (the sheen still appears on hover, just
  without the fade).

**Output** —
- `components/experience/ExperienceTimeline.tsx` — sheen span added as the first child of
  the inner card.
- Verified: `tsc --noEmit` clean; forced-hover screenshot shows the diagonal light wash on
  the active card while the resting cards stay flat.

---

## Entry 016 — Experience cards: scroll-in pop

**Prompt** — `craft make a slight pop up of the experience cards ... to make the design
more lively in the experience section, just slight animation for the detail card, give me
some options let me choose and then implement.`

**Flow** — Loaded `craft` (no native image-gen in this harness, so the mock step is
skipped; the brief is the contract). Presented three motion options — hover spring-pop,
scroll-in pop, both — with ASCII previews. User chose **scroll-in pop**. Implemented in
the single file, verified desktop + mobile with a real scroll, `tsc` clean.

**Decisions** —
- **Scroll-in pop = scale + rise, no opacity fade.** The chosen option's preview listed a
  fade, but `opacity:0` + `whileInView` is exactly the blank-card failure this project
  already fixed (Entry 013) and that impeccable/`DESIGN.md` forbid. Dropped the fade,
  flagged it to the user; `scale 0.96 → 1` + a ~14px rise carries the pop while every card
  stays visible on SSR / no-JS / headless.
- **Split entry vs hover onto two elements.** Framer animating the card's `scale` writes an
  inline `transform` that would override the CSS `group-hover:scale/-translate` on the same
  node. So the entry pop now lives on a new outer wrapper `motion.div`; the inner card keeps
  its hover classes verbatim. No transform conflict, hover unchanged (still group-hover, so
  hovering anywhere on the row lifts the card).
- **Stagger for free.** Per-card `whileInView` observers (`once: true`) fire as each card
  scrolls in, cascading down the timeline without an explicit stagger container.
- Reduced motion: wrapper `initial={false}` → renders at rest, no animation; inner hover
  transforms already neutralized via `motion-reduce:` classes.

**Output** —
- `components/experience/ExperienceTimeline.tsx` — card wrapped in an entry-pop
  `motion.div`; inner card unchanged.
- No data/config changes; no new deps (framer-motion already used).
- Verified: `tsc --noEmit` clean; desktop + mobile screenshots show cards fully visible at
  rest (caught the MS card mid-pop, content still readable — proves the animation fires
  without gating visibility).

---

## Entry 015 — Experience: more-life polish (hover zoom, year gutter, role-icon nodes)

**Prompt** — `shape i want some more life in the employment section ... timeline boxes
can zoom in a little bit when hovered ... more customizations ... modern and a bit lively.
Keep few details on the outside of the box on the left side ... think and ask me before
implementing. Slight modifications, not total remodelling. Also remove the shooting star
every few seconds.`

**Flow** — Loaded `shape`; re-read `PRODUCT.md` / `DESIGN.md` + the existing component.
Asked 2 questions (left-gutter content, spine-node treatment). User chose **year-only**
gutter and **role-icon tokens**. Wrote the brief to the plan file, got approval, then
implemented in the single file. Verified in-browser at 1280px + 390px, and force-activated
the `group-hover` declarations to confirm the hover wiring (the headless build can't hold a
real CSS `:hover`).

**Decisions** —
- **Year-only outside-left gutter:** the `<li>` grid goes 2-col → 3-col on `sm`
  (`[gutter | rail | card]`). Gutter is `hidden sm:block`; on mobile the date drops back
  into the card meta via an `sm:hidden` span, so no duplication. Year turns cobalt on
  `group-hover`, tying the gutter to its card.
- **Spine nodes → role-icon tokens:** the plain 12px dot became a ~26/30px circular token
  with the role glyph inside (`Database` / `BrainCircuit` / `GraduationCap`), echoing the
  canvas NodeToken idiom. `RAIL` offset shifts right on `sm` (`left-[84px]`) to clear the
  gutter; the scroll-trace "light up" and connector are retained.
- **Dropped the proposed cobalt edge bar:** a >1px colored left-inner accent is the
  **side-stripe family `DESIGN.md` bans outright**. Flagged it to the user up front and
  carried the liveliness with hover-zoom + a node halo instead.
- **Hover zoom:** `group-hover:scale-[1.015]` alongside the existing `-translate-y-0.5`,
  transform-only (no layout shift). Both neutralized under `motion-reduce`.
- **Node halo:** a separate blurred cobalt span behind the token (kept off framer's inline
  `boxShadow`), `opacity-0 group-hover:opacity-100`, so the node blooms when its card is
  hovered.
- **Removed the autonomous spine pulse** ("shooting star"); the resting spine + scroll-drawn
  trace stay.
- **Bug caught pre-ship:** an initial `motion-reduce:transform-none` on the node wrapper
  would have wiped its `-translate-x-1/2` centering (un-centering the node under reduced
  motion). Swapped for `motion-reduce:group-hover:scale-100` — keeps the node centered, just
  drops the hover scale.

**Output** —
- `components/experience/ExperienceTimeline.tsx` — year gutter, role-icon `Node`, hover-zoom
  + halo, responsive meta date, pulse removed; doc comment updated.
- No data/config changes (`networkData.ts` untouched).
- Verified: `tsc --noEmit` clean; clean Next compile (no errors); desktop shows the year
  gutter + distinct role icons + (forced) hover-zoom/halo/year→cobalt; mobile hides the
  gutter and shows the date back in the card. Reduced-motion verified by code (this browse
  build can't emulate the media query).

---

## Entry 014 — Experience cards: detail + motion enhancements

**Prompt** — `craft ... design it better with few more design enhancements and subtle
animations, ask me the options ... then implement based on my selection.`

**Flow** — Loaded `craft`; presented two option menus. User picked tech-logo chips,
per-role glyph watermark, live uptime ticker, autonomous spine pulse, staggered bullet
reveal (declined cursor spotlight). Implemented all five, verified in-browser at 1440px
and 390px.

**Decisions** —
- **Tech-logo chips:** render each chip's brand glyph from the existing `ICONS` map
  (`iconData.ts`) via a local label→slug map. AWS was **removed from simple-icons**
  (branding policy), so it falls back to a lucide `Cloud` glyph; all chips stay consistent.
- **Role watermark:** large faint lucide icon per card (`Database` / `BrainCircuit` /
  `GraduationCap`), `overflow-hidden` + `z-0` behind content at ~0.05 opacity → ~0.09 on
  hover. Differentiates the three cards (anti "identical grid").
- **Uptime ticker:** running role only; `setInterval` clock from a placeholder
  `RUNNING_SINCE`, mounted client-side (`now` starts null) to avoid hydration mismatch;
  reduced-motion shows static `uptime Xy`, no clock. Clock segment is cobalt (lime stays
  the single live signal).
- **Spine pulse:** a gradient segment sweeps the spine on a loop (`repeat: Infinity`),
  echoing the canvas packets; not rendered under reduced motion.
- **Bullet stagger:** `motion.ul` container variants, transform-only (y, no opacity gate)
  so bullets stay visible if the observer never fires.
- **Process miss caught:** first verification screenshots showed nothing new — a stale dev
  server from a prior run still held port 3000, so the start guard skipped launching the
  new one and the browser hit old code. Killed all `next dev` / port 3000, restarted clean;
  everything then rendered.

**Output** —
- `components/experience/ExperienceTimeline.tsx` — chips+logos, watermark, uptime, spine
  pulse, bullet stagger.
- `components/pipeline/iconData.ts` regenerated (no net change — AWS isn't in simple-icons).
- Verified: `tsc --noEmit` clean; `next build` passes (192 kB first load); desktop + mobile
  screenshots confirm all five enhancements.

---

## Entry 013 — Experience: card redesign + headless-blank fix

**Prompt** — `it is not implemented good, refine it properly. Also each experience
should be in each box which highlights or pops up subtly when hovered. Add ... modern
simple subtle animations and little more design details, ask me ... then proceed, use
impeccable craft.` (with a screenshot showing the year clipped by the node.)

**Flow** — Loaded `craft`. Asked 3 option questions; user chose lift+cobalt-border
hover, tech-stack chips, and 2–3 bullets per role. Added an optional `bullets?: string[]`
to `PipeNode` and placeholder bullets to the three experience nodes (single source of
truth preserved). Rebuilt the section as lifted cards on the spine. Verified in-browser
with the gstack browse tool at 1440px and 390px.

**Decisions** —
- **Headless-blank bug, caught in my own QA:** the first card reveal gated visibility on
  `whileInView` with `initial opacity:0`; the element screenshot rendered the cards blank
  (exactly the failure impeccable warns about). Fix: cards are always visible — the reveal
  is a slide-up only (no opacity gate); nodes rest at a visible cobalt and only brighten +
  glow when the trace reaches them.
- Year-clip fix: dropped the cramped year rail; the date lives in the card meta
  (`org · date`). The left rail now carries only the spine + nodes.
- Card: lifted surface, hairline border, 14px radius; hover = ~2px lift + border→cobalt +
  tonal lift; node scales, connector + bullet dots + chip borders brighten via `group-hover`.
- Content: role + meta + 2–3 bullets (cobalt dot markers) + tech chips from `connections`.
  Reduced-motion and <768px both keep full, readable content (no hover dependence).

**Output** —
- `components/experience/ExperienceTimeline.tsx` — rewritten as the card timeline.
- `components/pipeline/networkData.ts` — added optional `bullets` + placeholder bullets
  on the three experience nodes (canvas unaffected).
- Verified: `tsc --noEmit` clean; `next build` passes; desktop + mobile screenshots good.

---

## Entry 012 — Section 4: experience timeline ("Signal Trace")

**Prompt** — `/impeccable shape the experience section after the neural network. think
creatively ... render some options and ask me ... do not assume anything. keep the
designs modern relevant to the overall theme and my experience. try to include small
animations wherever possible.`

**Flow** — Ran `/impeccable shape` (brand register). Read PRODUCT/DESIGN + existing
code; found experience already lived only inside the canvas as Layer 4 (Deployment),
and `public/resume.pdf` was a placeholder stub, so there was no real content to assume.
No native image-gen in this harness → presented 3 concepts as ASCII previews (Signal
Trace / Deployment Log / Commit Graph) plus content + canvas-relationship questions.
User picked: polished placeholders, **expand** the canvas layer (not duplicate),
**Signal Trace**. Wrote the brief to the plan file, got approval, built it.

**Decisions** —
- Single source of truth: the section reads straight off `LAYERS[3].nodes` in
  `networkData.ts`, so the canvas and the timeline can't drift. No data file edit.
- Scroll-linked motion via framer-motion `useScroll`/`useTransform` (not GSAP
  ScrollTrigger) — keeps the DOM layer in the framer-motion idiom already used by Hero;
  GSAP stays the canvas's tool. The trace "draws" itself + a cobalt packet dot rides it.
- One-Live-Signal rule honored: node rings are all cobalt; the **current** role (index 0)
  carries the only steady lime element, a breathing `running` tag. Each node fires a
  single lime pulse on scroll-in (transient = allowed), then rests cobalt.
- Reduced-motion: spine drawn full, dot/pulses/breathing off, content identical and
  fully readable (motion props omitted, not gated behind a hidden initial). <768px:
  spine pins left, single column, no hover math (canvas-fallback parity).
- Token fix vs the plan: lime token is `live`, not `accent-live`.

**Output** —
- NEW `components/experience/ExperienceTimeline.tsx`.
- `app/page.tsx` — `<ExperienceTimeline />` inserted after `<NeuralPipeline />`, before
  the contact stub (Section 3 case studies will slot above it later).
- Verified: `tsc --noEmit` clean, `next build` compiles + all static pages generate.

---

## Entry 011 — Boot bugfixes: hero-return cleanup, hint cadence, soft chip dot

**Date:** 2026-06-09

**Prompt:** Three bugs after the self-playing boot: (1) scrolling back to the hero left the
network + `INFERENCE: LIVE` chip visible (the chip is `z-30` above the hero `z-20`, and the
hero gradient is transparent at the bottom, so the revealed net showed through); (2) the
first "hover to inspect" fired at ~1s while the rest were ~3.5s; (3) the chip's lime dot
pinged too hard.

**Flow (all in `NeuralPipeline.tsx`):**
1. **`netVis`** — a scroll-driven factor (`clamp((p−0.16)/0.07, 0, 1)`, set in `onUpdate`)
   folded into the network's visibility: token `--rev` × netVis, canvas line/packet alpha ×
   netVis, moniker opacity × netVis, and the **chip opacity = netVis** after boot. At the
   hero the whole network + chip is gone; only the clean hero shows. The active hint clears
   when leaving the zone, and `fireDemo` is also gated on `netVis > 0.6`.
2. **Hint cadence** — removed the "guaranteed first at boot+1s"; the demo interval now
   **starts on boot-complete**, so the first hint fires ~3.5s after boot and every ~3.5s
   after (consistent), stopping on the first hover.
3. **Chip dot** — softened the ping (scale `[1,1.7]`, opacity `[0.32,0]`, 2.4s; was
   2.4 / 0.55 / 1.8s).

**Verified:** `tsc` clean; production build clean. In-browser at 1440: in the section
`--rev` = 1 and the chip opacity = 1; **scrolling back to the hero → `--rev` = 0, chip
opacity = 0, clean hero** (no network/chip); the first hint measured at **~6s** (≈3.5s after
boot), not 1s.

**Output:** `components/pipeline/NeuralPipeline.tsx` (netVis gating; demo interval on
boot-complete; softened chip dot; removed the mount-time demo interval + the 1s first show).

---

## Entry 010 — Self-playing power-on boot + reliable hover hint

**Date:** 2026-06-09

**Prompt:** A screenshot showed the loader "INITIALIZING INFERENCE ENGINE" *while the
network was already visible* (assembling) — incoherent — and the "hover to inspect" hint
was effectively invisible ("not implemented at all"). Make the loading transition better
(options → chose **self-playing power-on boot**) and actually fix the hint. Ran
`/impeccable craft`.

**Root causes:**
- The loader and the network reveal were driven by the **same scroll progress**, so the
  net assembled on the left while "INITIALIZING" showed on the right.
- The hint was gated on a **narrow scroll window** (`progress > 0.72`) and even kept firing
  off-screen after you passed it — so in the real scroll flow you never saw it. Present in
  code, broken in practice.

**Flow:**
1. **Boot rework:** the whole network is gated behind a **`bootReveal` (0→1)**. Scrolling
   clears the hero (scroll-linked), then a GSAP boot timeline plays **once** (timed,
   self-playing): the loader fills on an **EMPTY canvas** (~1.1s) → the network **ignites**
   (an energy wave sweeps left→right, columns reveal staggered) → the loader shrinks/rises/
   fades and **converges into the top `● INFERENCE: LIVE` chip** → `bootedRef = true`. The
   `--rev` vars + moniker opacity + canvas alpha now derive from `bootReveal` in the render
   loop (not scroll); interactions gate on `bootedRef`.
2. **Hint fix:** gated on **`booted && canvas-in-view`** (IntersectionObserver), not scroll
   — a **guaranteed first hint ~1s after boot**, then a random node every ~3.5s while on
   screen, **stopping on the first hover**. Added `layoutRef`, `inViewRef`, and a stable
   `fireDemo` via ref.

**Decisions / fixes worth remembering:**
- The boot is **timed** (triggered when scroll clears the hero, `progress > 0.26`), plays
  once; a resize after boot keeps it live (`showBootedInstant`), no replay.
- The boot timeline is **standalone** (not inside the ScrollTrigger `gsap.context`), so
  reverting/recreating ScrollTrigger on resize doesn't revert the chip/loader.
- Drift/magnetism only run after boot (`bootedRef`), not scaled by reveal.

**Verified:** `tsc` clean; production build clean (186 kB); prod console clean (only benign
next/font preload warnings). In-browser at 1440 / 375: the loader fills on an **empty
canvas** (`--rev-*` = 0, no nodes/lines) → the network **ignites left→right** → the top
`INFERENCE: LIVE` chip; the **"HOVER TO INSPECT" hint appears ~1s after boot and recurs
~3.5s, stopping on the first hover**; drift / magnetism / hover / card still work; mobile
shows the list, no horizontal overflow.

**Output:** `components/pipeline/NeuralPipeline.tsx` (boot timeline + ignite wave +
`bootReveal`-gated reveal, `bootedRef`-gated interactions, in-view+booted demo with a
guaranteed first show + stop-on-hover, removed the scroll-scrubbed reveal).
`NodeToken.tsx` unchanged.

---

## Entry 009 — Living neurons + canvas attention (drift, magnetism, loader→chip, demo)

**Date:** 2026-06-09

**Prompt:** The neurons sat dead-still, and the tiny "hover any node" hint wasn't grabbing
attention — people scrolled past, missing the canvas. Wanted (a) subtle node life and
(b) a way to make visitors stop and engage. Ran `/impeccable craft`.

**Flow:**
1. Two question rounds. Locked: **node motion = drift + magnetism**; **attention = boot
   loader → top status chip + a recurring "hover to inspect" label + node pulse** every
   ~3.5s that stops on first hover (chosen over auto-opening the full card — too heavy/
   glitchy).
2. **Node life:** each node gets a live offset = slow lissajous **drift** (~4px, per-node
   phase/frequency) + cursor **magnetism** (nodes within ~150px lean toward the pointer,
   capped ~7px, eased). The **canvas line endpoints and the DOM token transforms both read
   the one live array each frame**, so they stay glued; the hovered/demoed node pins home
   so its card/label stays put. Added a window `pointermove` tracker.
3. **Attention 2a:** a centered **"INITIALIZING INFERENCE ENGINE"** loader (progress bar
   tied to scroll) that, once the hero clears, **shrinks + rises + fades and converges into
   a small persistent `● INFERENCE: LIVE` chip** at the top. Scroll-progress-driven via
   `gsap.set` in the existing `onUpdate`. Replaced the weak hint.
4. **Attention 2b:** a 3.5s interval picks a random non-core node → a gentle **demo**
   highlight (NodeToken's new `demo` state: soft cobalt + pulse ring) + a **"hover to
   inspect"** label for ~2s; the whole demo **stops the instant the user hovers their first
   node** (`hasInteracted`).

**Decisions / fixes worth remembering:**
- **DOM↔canvas sync stays cheap:** tokens write their `transform` imperatively (not via
  React style), so React re-renders never fight it; home positions are fixed and the live
  offset is applied per frame to both the token and its synapse lines.
- **Loader collided with the hero name** at first (both ~44%); moved to 52% + retimed to
  appear after the hero fades, so there's no overlap.
- **Magnetism is "attract"** (lean toward the cursor), capped 7px — reads as the network
  noticing you, not clumping.
- The loader/chip/labels are decorative (aria-hidden); a11y unchanged (sr-only desktop /
  visible mobile list).

**Verified:** `tsc` clean; production build clean (186 kB First Load JS); prod console clean.
In-browser at 1440 / 375: tokens **drift** (~2px sampled) and **lean toward the cursor**
(Python's offset y went −23 → −28 when the pointer neared); the **loader converges into the
top `INFERENCE: LIVE` chip**; a random node **pulses with a "HOVER TO INSPECT" label** every
~3.5s and the **demo stops after the first hover**; hover still pops the card smoothly;
mobile shows the stacked list, no horizontal overflow.

**Output:** `components/pipeline/NodeToken.tsx` (+`demo` state),
`components/pipeline/NeuralPipeline.tsx` (live offsets + pointer tracking, loader→chip,
ambient demo, removed the old hint).

---

## Entry 008 — Neuron tokens + smooth interactions (DOM / canvas hybrid)

**Date:** 2026-06-08

**Prompt:** The user found the 3D-sphere nodes dated, the result node's rotating green
boxes "very weird," and the hover "a little bit rough." They referenced an orbital
component (RadialOrbitalTimeline) but clarified: take **only** the neuron style + the
click-pop animation, **not** the orbital layout — keep the horizontal network. Asked to
use the `ui-ux-pro-max` skill for design understanding.

**Flow:**
1. Clarified over two question rounds. Locked: flat **logo-token** nodes (icon inside),
   **hover-to-open with a scale-pop**, **active fills + related pulse**, **data-flow
   pulses on trigger**, and **smooth easing** throughout.
2. `ui-ux-pro-max`'s auto style-rec was cyberpunk-neon-glow — **ignored** (user wants
   clean, not glowy); took its **motion guidance** (150–300ms, ease-out, no snapping,
   interruptible), which diagnosed the rough hover: the old **per-frame canvas
   state-swap**.
3. **Architecture:** nodes moved **canvas → DOM** (`NodeToken`, framer-motion) so the
   brand icons are crisp and every state change is a smooth eased spring. The synapse
   web + idle packets + on-hover data-flow pulses stay on the **canvas** behind the
   tokens; both read **one shared layout** (React state + ref) so lines and tokens align.
   Node positions are fixed (no float) → trivial DOM↔canvas sync.
4. `NodeBadge` gained a `mono` prop (monochrome logos in the tokens; the card keeps
   full brand color). `NodeToken`: flat circular token with eased
   rest / active(pop) / related(pulse) / dimmed states + a lime `isCore` palette.
5. Hover (token `onHoverStart`) → `activeId` → pop + `DetailCard` + adjacent-column nodes
   pulse + the canvas isolation eases in + data-flow pulses fire from the active node.
   Hover-intent keeps the card reachable; a chip-click jumps to a connected node.
6. Boot-up assemble preserved: per-column reveal now drives token opacity via CSS vars
   (`--rev-N` on the stage) **and** canvas line alpha, from the one ScrollTrigger progress.

**Decisions / fixes worth remembering:**
- **The rough hover was the per-frame canvas swap;** DOM/framer fixes it structurally.
- **Result node** is a clean lime "core" (concentric target + soft glow), no boxes.
- Tokens are decorative (aria-hidden); a11y stays the **sr-only `PipelineContent`** list
  on desktop / the **visible list** on mobile + reduced-motion.
- Logos render **monochrome** in the network (cohesive, clean) and **full brand color**
  in the card (the pop of detail).
- ui-ux-pro-max is a **search CLI** (`scripts/search.py --design-system / --domain`); its
  recommendations are a starting point, not gospel — its neon rec conflicted with the
  brief, so only its motion rules were used.

**Verified:** `tsc` clean; production build clean (184 kB First Load JS); prod console
clean under scroll + hover. In-browser at 1440 / 375: boot-up assembles tokens left→right,
real logos render (Python, Spark, Airflow, PostgreSQL, Snowflake, PyTorch), hover pops
smoothly + opens the card + pulses related nodes + fires data-flow pulses + eases the
isolation, hover-out reverses, the result is a clean lime core, mobile shows the stacked
list, no horizontal overflow.

**Output:** `components/pipeline/NodeToken.tsx` (new); `NeuralPipeline.tsx` (reworked to a
DOM-token + canvas-web hybrid), `NodeBadge.tsx` (+`mono`); reused `DetailCard`,
`PipelineContent`, `networkData`.

---

## Entry 007 — Section 2 redesign: horizontal pipeline, sphere nodes, detail cards

**Date:** 2026-06-08

**Prompt:** With a reference mockup, the user redirected Section 2 to a **strictly
horizontal** left→right network of **big 3D sphere nodes** in **5 labeled columns**,
with a **rich glassmorphic detail card** on hover and a **boot-up scroll transition**
out of the hero. "First understand, plan, then build" (used `/impeccable craft`).

**Flow:**
1. Re-planned. The user picked: boot-up assemble L→R; real brand logos via
   `simple-icons`; Claude drafts content. Confirmed assumptions (one viewport, cobalt
   hover / lime result node, immediate-neighbor isolation, mobile stays stacked).
2. **Logos without the bloat:** `scripts/gen-icons.mjs` extracts only the 6 brand marks
   we use into a committed `iconData.ts`; `simple-icons` is a **devDependency** so the
   3,400-icon package never ships to the client (+8 kB First Load total). AWS + dbt
   aren't in simple-icons anymore (Amazon / dbt Labs had them removed), so the draft
   skill column uses logo'd skills (Python, Spark, Airflow, PostgreSQL, Snowflake,
   PyTorch); AWS/dbt live as text chips.
3. Rewrote `networkData.ts` → 5 layers with rich per-node fields (icon, expertise,
   date, description, energy, connections, links).
4. New components: `NodeBadge` (brand logo or Lucide glyph) and `DetailCard` (the
   kind-adaptive glass card: logo badge, EXPERTISE pill, energy bar, connected chips,
   Code/Demo; `backdrop-blur` + soft shadow + spring).
5. Rewrote `NeuralPipeline.tsx`: 5-column horizontal layout, DOM monikers, big breathing
   sphere rendering (radial gradient + specular highlight), L→R packets + backprop,
   boot-up assemble (staggered per-column reveal from one ScrollTrigger progress),
   immediate-neighbor hover isolation (cobalt orb), the geometric lime result node, and
   the detail card with hover + click-to-pin + chip-navigation (hover-intent keeps it
   reachable).
6. `PipelineContent` → 5 layers, richer text (mobile + sr-only).

**Decisions / fixes worth remembering:**
- **Boot-up transition:** the hero rests clean (no peek now); scrolling ignites the
  columns left→right while the hero lifts/dims — one ScrollTrigger progress drives it.
- **Lime discipline held:** the single Layer-5 result node is the one persistent lime
  (a slow rotating geometric glow); hover is cobalt; the project impact metric in the
  card is lime.
- **DESIGN.md override (user-requested):** the detail card is glass + soft shadow; flat
  doctrine still holds everywhere else.
- **Framer + positioning:** the card wrapper owns position, `DetailCard` (motion) owns
  the spring — never both on one element.
- **Moniker collision:** the long `LAYER 4` + `INFERENCE STATUS` labels overlapped at
  1024–1280; fixed by narrowing moniker width + font so they never collide.
- **Mobile canvas:** the squished 5-column static frame looked cluttered behind the
  hero, so the canvas stays empty on mobile (the stacked list carries it); reduced-
  motion desktop still gets the calm static frame.
- **Content is DRAFT:** project names, metrics, energy %s, dates, and ‹company› names
  are placeholders for the user to correct.

**Verified:** `tsc` clean; production build clean (185 kB First Load JS); prod console
clean under assemble + hover + pin + scroll-back. In-browser at 1440 / 1280 / 375:
hero rests clean → boot-up assembles 5 columns L→R → spheres breathe, packets flow,
the lime result node glows → hover a skill = cobalt orb + isolated paths + glass card
with the real Apache Spark logo, energy bar, and chips → result hover = status card.
Mobile shows the stacked 5-section list; no horizontal overflow.

**Output:** `components/pipeline/networkData.ts`, `NeuralPipeline.tsx`,
`PipelineContent.tsx` (rewritten); `components/pipeline/DetailCard.tsx`,
`NodeBadge.tsx`, `iconData.ts`, `scripts/gen-icons.mjs` (new); `package.json`
(+`simple-icons` devDep).

---

## Entry 006 — Section 2: the interactive neural pipeline (one continuous canvas)

**Date:** 2026-06-08

**Prompt:** "Hero's done; research and describe the Phase 2 plan, then build it with
the impeccable skill." Confirmed the plan, then ran `/impeccable craft neural-pipeline`.

**Flow:**
1. Researched the brief (IDEA.md §2, PRODUCT/DESIGN, the shipped hero + its canvas)
   and wrote a plan. The user picked: one continuous canvas, 3-4 project output
   nodes, and "draft the content, I'll correct it."
2. Added a typed content model `components/pipeline/networkData.ts` (4 layers → nodes
   with `label` / `metric` / `kind`). Drafted from PRODUCT.md; metrics + project
   names are placeholders for the user to fix.
3. Rebuilt the canvas as `components/pipeline/NeuralPipeline.tsx`: one **sticky**
   canvas spanning hero → pipeline. GSAP ScrollTrigger reports a 0→1 progress that
   morphs every node from its peek layout to a full-viewport layout (lerp), fades
   the hero text out, and fades a "hover to inspect" hint in. Reused the old engine's
   ticker loop, spring physics, packets, and offscreen-pause.
4. Layer-hover → a glassmorphic bounding box (the one sanctioned glass) with the
   terminal chip; node-hover → isolate the node (dim others, brighten its paths,
   light it lime) + a Framer Motion tooltip carrying the skill/project content.
5. `components/pipeline/PipelineContent.tsx`: one component, two roles — an sr-only
   text alternative on desktop (content never locked in the canvas) and the visible
   stacked Section 2 on mobile / reduced-motion / coarse pointer.
6. Retired `components/NetworkCanvas.tsx` (folded into NeuralPipeline); `Hero.tsx` is
   now a pure overlay; `page.tsx` mounts the pipeline.

**Decisions / fixes worth remembering:**
- **One continuous canvas, not two:** the hero's peeking network *is* the top of the
  pipeline; scrolling resolves it. Most literal to IDEA.md "the canvas fills the screen."
- **Lime stays rare:** resting project (output) nodes are white with a thin cobalt
  ring; lime is reserved for the hovered node + a project's impact metric on hover
  (plus the subtle backprop packets). No always-on lime in the resolved network.
- **Framer + Tailwind transform clash:** the tooltip's `-translate-x-1/2
  -translate-y-full` was clobbered by Framer Motion's own transform, so it drifted
  off the node. Fix: an outer div owns positioning, the inner motion.div owns the
  entrance.
- **Dropped the focus-drives-canvas idea:** the a11y list sits after the tall scene,
  so focusing it scrolls away from the canvas. Kept the simpler sr-only text
  alternative (content access) instead.
- **setState-in-render warning:** ScrollTrigger's initial `onUpdate` called
  `clearHover()` (setState) before any hover existed. Guarded it to clear only when
  something is actually hovered; the production console is clean.
- **Content is DRAFT:** project names + most metrics in `networkData.ts` are
  placeholders — the user corrects them before this ships.

**Verified:** `tsc --noEmit` clean; production build clean; prod console clean (no
errors/warnings). In-browser at 1440 / 768 / 375: hero peek → continuous resolve →
layer + node hover (tooltips correct, e.g. "Airflow / pipeline orchestration", project
metric in lime) → unpin into contact. Mobile shows the stacked list; no horizontal
overflow. Reduced-motion uses the same static path as mobile (runtime emulation was
blocked by the browser tool's CDP allowlist).

**Output:** `components/pipeline/networkData.ts`,
`components/pipeline/NeuralPipeline.tsx`, `components/pipeline/PipelineContent.tsx`
(new); `components/Hero.tsx`, `app/page.tsx` (changed); `components/NetworkCanvas.tsx`
(removed).

---

## Entry 005 — Interactive background: repel + spring-back + click ripple

**Date:** 2026-06-07

**Prompt:** "Make the background more interactive: repel / move / swiggle nodes when
the mouse comes near. Suggest ideas, then plan. (anime.js optional.)"

**Decisions:**
- Chose **repel + spring-back** with a **click ripple** ("forward-pass pulse").
- **No anime.js:** per-frame canvas physics is lighter as plain spring math in the
  existing `gsap.ticker` loop; anime.js is for DOM/SVG timelines.

**Flow:** Added `baseX/baseY/vx/vy` to each node; each frame applies cursor repel,
ripple kicks, then a damped spring back to base (STIFFNESS 0.06 / DAMPING 0.82 /
REPEL 0.9). Synapses + packets ripple for free (they read live node positions). Added
a `pointerdown` ripple gated to the network band. Same fine-pointer + non-reduced
guards as before; cleanup removes all listeners.

**Verified:** dev recompiles clean, no console errors on pointermove/pointerdown,
nodes visibly perturb near the cursor in-browser.

**Output:** `components/NetworkCanvas.tsx`.

---

## Entry 004 — Hero hover effects & micro-interactions

**Date:** 2026-06-07

**Prompt:** "Ideas for mouse hover effects / micro-interactions on the first page;
implement and stop (low on tokens)."

**Flow / decisions:**
- **Cursor-reactive network** (`NetworkCanvas.tsx`): pointer tracked on fine pointers
  only (skipped on touch + reduced motion). Nearby nodes brighten and grow, thin
  cobalt filaments reach toward the cursor, and a soft cobalt halo follows it. Gated
  to the network band via `fade(pointer.y)` so it never reacts over the name. Listener
  cleaned up on unmount.
- **Animated underline** on the wordmark and social links (cobalt, wipes in from left;
  hidden under `motion-reduce`).
- **Tactile 1px lift** on both CTAs + icon nudge on social links.
- Respected the "no glow on UI chrome" rule (lift/underline are transform/scale, not glow).

**Verified:** dev recompiles clean, no console errors before/after pointer events,
cursor reactivity confirmed in-browser.

**Output:** `components/NetworkCanvas.tsx`, `components/Hero.tsx`.

---

## Entry 003 — Build the hero (Section 1)

**Date:** 2026-06-07

**Prompt:** "Craft the hero section. Name + tagline + recruiter details, the neural
network interactive, modern and cool without clutter, with a designer's eye for where
the user's focus goes. Ask, don't assume."

**Flow:**
1. Ran the craft flow: shaped a compact brief, then asked the genuine unknowns
   (scope, framework, recruiter content, type direction) instead of guessing.
2. Scaffolded a Next.js 14 + TypeScript + Tailwind app manually (the dir had docs,
   so `create-next-app` wasn't clean). Wired the Inference Engine palette as Tailwind
   tokens and CSS vars, and loaded Geist + JetBrains Mono via `next/font`.
3. Built `components/NetworkCanvas.tsx`: the autonomous network on a single canvas
   (plain arrays, gsap.ticker loop, packets firing top→bottom + occasional backprop,
   converging on one lime output node), with offscreen pause, reduced-motion static
   frame, and a lighter static layout under 768px.
4. Built `components/Hero.tsx`: Framer Motion DOM overlay (name, tagline, status
   pill, recruiter links, CTAs, scroll cue) with a staggered entrance and a
   deliberate focus path.
5. Added a `#contact` stub so the CTA resolves, and a placeholder `/resume.pdf`.
6. Verified in-browser at 1440 / 768 / 375: no console errors, no overflow,
   production build clean.

**Decisions / fixes worth remembering:**
- **One convergence node:** changed the output layer from 3 lime nodes to a single
  centered one. Keeps lime rare (the One-Live-Signal rule) and matches the spec's
  "network converges into one glowing node."
- **`min-h-svh` gotcha:** this Tailwind build's `minHeight` scale lacks the dynamic
  viewport units, so `min-h-svh` silently resolved to 0 and the page wouldn't scroll.
  Fixed with custom `.min-h-hero` / `.min-h-contact` classes in `globals.css`
  (vh fallback + svh override).
- **Never `npm run build` while `npm run dev` is running:** they share `.next` and
  the concurrent build clobbered the dev server's CSS (page rendered unstyled).
  Fixed by killing dev, clearing `.next`, restarting.
- **Gradient-heading ban upheld:** name is solid Instrument White, no gradient text.

**Output:** `app/layout.tsx`, `app/page.tsx`, `app/globals.css`,
`components/Hero.tsx`, `components/NetworkCanvas.tsx`, `tailwind.config.ts`,
`public/resume.pdf`, plus scaffold configs; `DESIGN.md` + sidecar font sync.

---

## Entry 002 — Seed the visual design system (DESIGN.md)

**Date:** 2026-06-07

**Prompt:** "Run `/impeccable document` to seed DESIGN.md."

**Flow:**
1. Detected this is a pre-code project, but `IDEA.md` already had concrete visual
   tokens (exact hex colors, font names), so I wrote a *full* DESIGN.md instead of a
   thin placeholder, marking component specs as provisional until built.
2. Asked 3 qualitative questions (the only things that can't be pulled from the spec):
   the creative metaphor, the accent-color rule, and the component feel.
3. Wrote `DESIGN.md` (the human-readable spec) and `.impeccable/design.json` (the
   machine-readable sidecar that powers `/impeccable live` previews).

**Decisions:**
- **Creative North Star = "The Inference Engine":** the page *is* a neural network
  thinking, not a site describing one.
- **Two-color logic:** cobalt blue = infrastructure/structure, lime green = "alive
  right now" (active state only, kept rare). This is the main rule keeping the design
  from looking cluttered.
- **Two-voice typography:** Inter for human text (headings, prose), JetBrains Mono
  for machine text (metrics, labels, terminal form). Only 2 font families.
- **Gradient-heading conflict:** `IDEA.md` asked for silver→white gradient headings,
  but gradient text is a known "AI slop" tell and often fails contrast. Resolved to
  solid near-white headings, with a narrow exception: a subtle metallic sheen on the
  hero name only. (User can veto this later.)
- **Accessibility-safe palette:** added two tokens the spec lacked — a readable muted
  gray for secondary text and a separate border token — so cobalt is never used for
  body text (it fails contrast at small sizes).

**Output:** `DESIGN.md`, `.impeccable/design.json`

---

## Entry 001 — Set up project context (PRODUCT.md)

**Date:** 2026-06-07

**Prompt:** "Run `/impeccable init`."

**Flow:**
1. Read the full spec (`IDEA.md`) and confirmed there's no code yet.
2. Classified the project as a **brand** surface (a portfolio where the design *is*
   the product, vs. a "product" app UI).
3. Asked a short interview round for the things the spec didn't pin down: the real
   name, the primary audience, anti-references, and accessibility commitment.
4. Wrote `PRODUCT.md` (the strategic "who/what/why" document).

**Decisions:**
- **Name:** Nihar Domala.
- **Audience:** both recruiters and engineers, recruiter-first (scannable up top,
  depth underneath).
- **Anti-references** (what to avoid looking like): corporate/stiff, cluttered dev
  portfolio, generic SaaS landing.
- **Accessibility:** committed to WCAG AA contrast + a `prefers-reduced-motion`
  fallback (the autonomous animation must have a calm static version).
- **Five guiding principles** locked in, the headline one being "the medium is the
  message": a portfolio for an AI Systems Engineer should itself be a
  well-engineered system.

**Output:** `PRODUCT.md`

---

## Entry 000 — The brief

**Date:** before 2026-06-07

**Prompt:** The original idea, captured in `IDEA.md`.

**Summary:** A single-page, strictly-vertical portfolio for a Data Engineer moving
into AI Systems Engineering. Signature feature: an autonomous, always-animating
neural-network visualization on a single HTML5 canvas, laid out as a top-to-bottom
"data pipeline." Stack: Next.js + React + TypeScript, Tailwind, GSAP (canvas loop +
scroll), Framer Motion (DOM overlays only). Five sections: typographic hero →
interactive neural canvas → case studies → experience timeline → convergent contact
node. Full details in `IDEA.md`.

**Output:** `IDEA.md`
