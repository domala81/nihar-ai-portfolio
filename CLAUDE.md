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
app/
  page.tsx              homepage entry — composes all sections
  layout.tsx            root layout wrapper
  globals.css           Tailwind + global styles
components/
  Hero.tsx              typographic hero section
  pipeline/
    NeuralPipeline.tsx  canvas animation + interaction core (signature feature)
    PipelineContent.tsx layout wrapper for the pipeline
    DetailCard.tsx      Framer Motion tooltip overlays
    NodeBadge.tsx       node label renderer
    NodeToken.tsx       node display element
    networkData.ts      graph structure + node definitions
    iconData.ts         icon mappings
public/resume.pdf       downloadable resume
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
- **Framer Motion** — DOM overlays only
- **Lucide React** (or raw SVG) for icons

Once scaffolded as a standard Next.js app, expect `npm run dev` / `build` / `lint`.

## Architecture & Hard Constraints

These are the non-obvious rules from the spec that shape every decision. Violating
them defeats the purpose of the design:

1. **Canvas is the renderer for the network; DOM is for overlays only.**
   - Every node and synapse is painted onto a *single* `<canvas>` via 2D drawing
     calls (`ctx.arc`, `ctx.lineTo`). Do **not** render nodes/synapses as individual
     HTML or SVG elements — DOM bloat will kill performance.
   - Framer Motion is used *exclusively* for DOM structural overlays: hero text
     fades, glassmorphic layer bounding boxes, floating tooltip cards, and the final
     CLI contact modal.

2. **Network state lives in plain JS arrays of objects.** Nodes and in-flight data
   packets are lightweight objects tracking vector math (`x`, `y`, target positions,
   radius, alpha, interpolation state). No per-element React components for these.

3. **The animation is autonomous.** Even with zero user interaction, data packets
   continuously fire down synapses top→bottom (forward pass) and flash back upward
   (backprop), driven by `gsap.ticker` / `requestAnimationFrame`.

4. **Pause the loop when off-screen.** The canvas animation must stop automatically
   when the user has scrolled past the canvas zone, to save CPU/GPU.

5. **Mobile fallback (< 768px width).** Disable the complex canvas hover math and
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
3. **Case Studies** — 3–4 project cards in a recruiter-scannable TL;DR format
   (Problem / Solution / Impact metrics / tech badges / Code + Demo buttons).
4. **Experience Timeline** — vertical chronological line.
5. **Convergent Output Node + Contact** — network converges into one glowing node;
   clicking it reveals a CLI/terminal-styled contact form.

## Theme

- Background: `#05070C` (near-black charcoal)
- Accent 1 (active elements, tooltips): lime green `#CCFF00`
- Accent 2 (infrastructure, synapses): cobalt blue `#1E40AF` / `#3B82F6`
- Muted lines/nodes: `rgba(255, 255, 255, 0.08)`
- Headings: bold premium sans (Inter / SF Pro Display), silver→white metallic gradient
- Labels / metrics / code UI: monospace (JetBrains Mono / Fira Code)