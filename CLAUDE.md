# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

Next.js (App Router) app is **scaffolded and runs**. `IDEA.md` is the source of
truth for the spec; read it before non-trivial work. Commands: `npm run dev` /
`npm run build` / `npm run lint`.

Project context lives in two committed files: `PRODUCT.md` (strategic: who/what/why)
and `DESIGN.md` (visual system: colors, type, components). Read both before any
design or build work.

## Folder Map

Skim this before exploring the tree — saves a re-scan each session.

```
data/                   ← EDIT HERE to update content (one file per domain)
  personal.ts           name, email, socials, tagline, location, resume — used by Hero, Contact, Footer
  projects.ts           ProjectEntry[] — add a project here; pipeline + orbital pick it up automatically
  experience.ts         ExperienceEntry[] — add a role here; pipeline + timeline pick it up automatically
  skills.ts             SkillEntry[] + PassionEntry[] — skills and passions for pipeline layer 1+2
  index.ts              barrel re-export (import { projects, personal, … } from "@/data")
app/
  page.tsx              homepage entry — composes all sections
  layout.tsx            root layout wrapper
  globals.css           Tailwind + global styles
components/
  Hero.tsx              typographic hero section (reads personal from @/data)
  pipeline/             Section 2 — neural pipeline (canvas synapses + DOM node tokens)
    NeuralPipeline.tsx  canvas synapse/packet loop + DOM node layout (signature feature)
    PipelineContent.tsx layout wrapper for the pipeline
    DetailCard.tsx      Framer Motion glass detail card (node hover)
    NodeBadge.tsx       node glyph (brand icon, or per-kind/per-id lucide glyph)
    NodeToken.tsx       DOM node token (the circular interactive node)
    networkData.ts      pipeline ADAPTER — maps data/ → PipeLayer[]; do not edit for content changes
    iconData.ts         icon mappings (simple-icons slugs → SVG paths)
  projects/
    OrbitalProjects.tsx Section 3 — radial project orbit + fixed detail panel + static fallback
  experience/
    ExperienceTimeline.tsx Section 4 — "Signal Trace" cobalt-spine timeline
  contact/
    ContactSection.tsx  Section 5 — convergent node + terminal contact channels (reads personal)
  footer/
    SiteFooter.tsx      inference colophon footer (reads personal)
  thread/
    LimeThread.tsx      page-spanning lime "me" dot traveler (scroll-driven, docks on anchors)
    ContactAnchor.tsx   registers the contact node as the thread's final dock target
    anchorStore.ts      shared registry: sections register anchors the thread docks onto
public/NiharDomala_Resume_DataEngineer.pdf  downloadable resume (real)
scripts/gen-icons.mjs   icon generation helper
```

Docs/spec: `IDEA.md` (spec), `PRODUCT.md` (strategy), `DESIGN.md` (visual),
`BUILD_LOG.md` (build history).
Config: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`,
`next.config.mjs`, `next-env.d.ts`.
Tooling (not app code): `.claude/` (skills), `.impeccable/`, `.gstack/`.

## Build Log Protocol

`BUILD_LOG.md` is a running, plain-language record of how this site is being built
(prompts → flow → decisions → output). It must keep growing across sessions, even
when the session switches. **This is a standing instruction, not a one-time task.**

The log has three parts, all of which must be kept current:
1. **The impeccable flow table** — the sequence of `/impeccable` commands, in order,
   with status. The site is being built through this skill's sub-commands; the table
   is what makes the workflow reproducible.
2. **The idea thread** — ideas, preferences, and course-corrections *the user* gives
   as we go, kept separate from Claude's own decisions so the user's intent is
   traceable.
3. **The step entries** — the detailed Prompt/Flow/Decisions/Output history.

When to update:
- After running an `/impeccable` command (init, document, shape, craft, etc.):
  add a step entry **and** update the flow table.
- After building or meaningfully changing a feature/section: add a step entry.
- Whenever the user shares a new idea, preference, or correction (even mid-task):
  add a line to the idea thread immediately, noting how it was applied (or that it's
  awaiting direction).
- After any non-obvious decision the user should be able to reconstruct later.

How to append:
- **Flow table:** update the relevant row's status / `←` marker, or add a new row.
- **Idea thread:** add a dated bullet at the top (newest first).
- **Step entries:** add a new entry at the **top** of the entry list (newest first)
  with the next sequential number (`Entry 003`, `004`, ...), following the four-part
  shape: **Prompt**, **Flow**, **Decisions**, **Output**.
- Keep it simple and skimmable; explain *why*, not just *what*. Plain language over
  jargon. Use the absolute date (today is provided in session context).
- Do not rewrite past entries; the log is append-only history.

## What This Is

A single-page **portfolio website** for a Data Engineer transitioning into an AI
Systems Engineer. The signature feature is an interactive, autonomously-animating
neural-network visualization rendered on HTML5 Canvas: a **horizontal** "inference
pipeline" whose five columns flow **left → right**, sitting inside an otherwise
vertically-scrolled single page (the page scrolls top→bottom; only this Section 2
network is laid out horizontally).

## Planned Stack

- **Next.js (App Router) + React + TypeScript**
- **Tailwind CSS** for styling (custom dark theme — see colors below)
- **GSAP (GreenSock)** — drives the canvas animation loop via `gsap.ticker`, and
  scroll-linked transitions via ScrollTrigger
- **Framer Motion** — DOM overlays + the network node tokens, the project orbit, the
  experience timeline, and card hover/scroll reveals
- **Lucide React** (or raw SVG) for icons; **simple-icons** for brand glyphs

Once scaffolded as a standard Next.js app, expect `npm run dev` / `build` / `lint`.

## Architecture & Hard Constraints

These are the non-obvious rules from the spec that shape every decision. Violating
them defeats the purpose of the design:

1. **Content lives in `data/`; `networkData.ts` is a pipeline adapter, not a data store.**
   To add a project, skill, or role — edit the relevant `data/` file only. `networkData.ts`
   maps those plain objects into `PipeLayer[]` for the canvas; do not hardcode content there.

2. **Canvas renders the synapse web; nodes are DOM tokens.** (Shipped architecture —
   evolved from the original canvas-only plan; `NeuralPipeline.tsx` is the source of
   truth.)
   - The **synapse web, in-flight packets, and glows** are painted on a *single*
     `<canvas>` via 2D calls (`ctx.arc`, `ctx.lineTo`). Do **not** move those to DOM/SVG.
   - The **nodes** are DOM tokens (`NodeToken`, Framer Motion) positioned over the canvas
     from the JS layout — a small, capped count, so no DOM bloat. This is what gives the
     buttery hover/scale pop.
   - Framer Motion also drives the other DOM overlays: hero fades, the glass detail card +
     layer chips, the project orbit, the experience timeline, the contact node.

3. **Network/packet state lives in plain JS arrays of objects.** The layout and in-flight
   packets track vector math (`x`, `y`, target positions, radius, alpha, interpolation
   state). The node *tokens* read their position from that JS layout; the heavy per-frame
   work (synapses, packets, glows) stays off the DOM.

4. **The animation is autonomous.** Even with zero user interaction, data packets
   continuously fire down synapses top→bottom (forward pass) and flash back upward
   (backprop), driven by `gsap.ticker` / `requestAnimationFrame`.

5. **Pause the loop when off-screen.** The canvas animation must stop automatically
   when the user has scrolled past the canvas zone, to save CPU/GPU.

6. **Mobile fallback (< 768px width).** Disable the complex canvas hover math and
   degrade to a clean vertically-stacked static node layout, so scrolling stays
   smooth on phones.

## Page Sections (page scrolls top → bottom; Section 2's network is horizontal)

1. **Typographic Hero** — massive overlapping name type; canvas network peeks in from
   the lower half inviting scroll.
2. **Interactive Neural Pipeline Canvas** — **horizontal** network, five columns
   flowing left → right: Inputs (Passions) → Transformation (Core Skills) → Outputs
   (Projects) → Deployment (Experience) → Core Result ("ready for the next mission").
   A self-playing boot ignites the columns left→right, then converges into a top
   `● INFERENCE: LIVE` chip. Node-hover isolates the node, dims other lines, and pops
   a Framer Motion detail card (skill + metric, or project title + impact metric).
3. **Projects ("Output layer")** — the shipped projects as a **radial orbit** around a
   lime "me" core (slow spin, spotlight autoplay, proximity-open) with a fixed right
   detail panel (Problem / Approach / Impact metric / tech badges / Code + Demo). Project
   nodes are cobalt; only the core is lime. Degrades to a static stack of
   recruiter-scannable case-study cards on mobile / reduced-motion.
4. **Experience Timeline ("Signal Trace")** — vertical cobalt spine continuing the
   network's synapse; role-icon nodes light cobalt as a scroll-drawn trace reaches them;
   lifted cards (hover pop + diagonal shine, per-role glyph watermark), year in an
   outside-left gutter, one lime "live" marker on the current role.
5. **Convergent Output Node + Contact** — network converges into one glowing node;
   clicking it reveals a CLI/terminal-styled contact form. (Still a stub in `app/page.tsx`.)

## Theme

- Background: `#05070C` (near-black charcoal)
- Accent 1 (active elements, tooltips): lime green `#CCFF00`
- Accent 2 (infrastructure, synapses): cobalt blue `#1E40AF` / `#3B82F6`
- Muted lines/nodes: `rgba(255, 255, 255, 0.08)`
- Headings: bold premium sans (Inter / SF Pro Display), silver→white metallic gradient
- Labels / metrics / code UI: monospace (JetBrains Mono / Fira Code)