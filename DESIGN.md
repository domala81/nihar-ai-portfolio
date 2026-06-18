<!-- SEED: real tokens below are taken from IDEA.md's committed theme. Component specs are provisional best-practice defaults; re-run /impeccable document once the components are built to capture the actual rendered values. -->
---
name: Nihar Domala — AI Systems Portfolio
description: A single-page portfolio rendered as a neural network at inference, scrolling strictly top-to-bottom into a "ready" contact node.
colors:
  bg: "#05070C"
  surface: "#0B0F17"
  ink: "#EDEFF2"
  ink-muted: "#9CA3AF"
  accent-live: "#CCFF00"
  infra: "#3B82F6"
  infra-deep: "#1E40AF"
  line: "rgba(255,255,255,0.08)"
  border: "rgba(255,255,255,0.12)"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.04em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "14px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    rounded: "{rounded.md}"
    padding: "12px 28px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.accent-live}"
    textColor: "{colors.bg}"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 28px"
    typography: "{typography.label}"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.sm}"
    padding: "4px 10px"
    typography: "{typography.label}"
  input-terminal:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
    typography: "{typography.label}"
---

# Design System: Nihar Domala — AI Systems Portfolio

## 1. Overview

**Creative North Star: "The Inference Engine"**

The page is not a portfolio *about* a neural network; it *is* one, mid-inference.
Data enters at the top (passions), flows down through engineering and ML-stack
layers, and converges at the bottom on a single output node whose status reads
"ready." Every visual decision serves that conceit: the surface is the dark chassis
of a machine that is quietly, autonomously thinking, and the reader is watching it
run. The aesthetic is a high-end technical instrument, precise and calm, with one
live signal that pulses.

Density is low by deliberate intent. Restraint is the entire argument: this is a
senior engineer's work, so negative space, a tight palette, and one signature
interaction (the canvas pipeline) carry the personality. The brightness budget is
spent on almost nothing, which is exactly why the few bright moments read as
meaningful. Everything structural is rendered in cool, infrastructural blue;
everything *alive* is rendered in a single electric lime that, by rule, is rare.

This system explicitly rejects three things, carried forward from PRODUCT.md: the
**corporate / stiff** look (no enterprise-blue safety, no stock imagery, no
personality-free polish), the **cluttered dev portfolio** (no skill-cloud walls, no
badge dumps, no busy-resume density), and the **generic SaaS landing** (no
gradient-blob heroes, no big-number hero-metric template, no identical
icon-heading-text card grids).

**Key Characteristics:**
- Near-black charcoal canvas (`#05070C`), drenched and absolute.
- Two-color logic: cobalt = infrastructure, lime = life. Nothing else competes.
- Monospace for anything machine-spoken (labels, metrics, code, the terminal form);
  Inter for anything human-spoken (headings, prose).
- One signature interaction (the autonomous canvas pipeline) instead of many small ones.
- Performance is visual integrity: a stutter breaks the illusion that the machine is real.

## 2. Colors

A drenched near-black surface governed by a strict two-accent logic: cool cobalt for
structure, electric lime for life. Cool, instrumental, and almost monochrome until
something becomes active.

### Primary
- **Electric Lime** (`#CCFF00`): The "live" signal, and the only warm-bright in the
  system. Reserved for the *active* state: a hovered/firing node, the single key
  impact metric per case study, the "ready" output node, and one primary CTA. It
  means "this is alive right now." Never used for reading-length text.

### Secondary
- **Synapse Cobalt** (`#3B82F6`): The infrastructure color. Synapses, connection
  paths, active node outlines, structural accents, links. Passes AA for body-sized
  text on the near-black background but should still be used mostly for lines,
  large elements, and UI rather than paragraphs.
- **Deep Cobalt** (`#1E40AF`): The dim/resting state of the network: idle synapses,
  glow bases, gradient floors for the canvas. Too dark for text; structural only.

### Neutral
- **Charcoal Void** (`#05070C`): The absolute background. The chassis everything sits on.
- **Lifted Surface** (`#0B0F17`): Barely-raised panels, cards, the terminal field,
  and chips. Distinguished from the void by tone, not by shadow.
- **Instrument White** (`#EDEFF2`): Primary text and headings. A cool near-white, not
  pure `#FFF`, so it reads as brushed metal rather than glare.
- **Muted Ink** (`#9CA3AF`): Secondary text, captions, resting labels. Tested to clear
  AA (≈6:1) on the void; do not push it dimmer "for elegance."
- **Hairline** (`rgba(255,255,255,0.08)`): Resting nodes and idle network lines on the
  canvas, and the faintest dividers. Decorative structure only, never text.
- **Border** (`rgba(255,255,255,0.12)`): Razor-thin borders on the glassmorphic
  layer-hover boxes, cards, and inputs.

### Named Rules
**The One Live Signal Rule.** Lime means exactly one thing: active *right now*. If an
element is lime, it is being hovered, is currently firing, is the single headline
metric, or is the one moment asking to be clicked. Cobalt carries everything that is
merely structural. If a second static thing is also lime, one of them is wrong.

**The Tone-Not-Shadow Rule.** Depth on this dark surface comes from lifting tone
(`#05070C` → `#0B0F17`), not from drop shadows. Glows are the only exception, and
glows belong to the network, not to UI chrome.

## 3. Typography

**Display / Body Font:** Geist (with system-ui fallback)
**Label / Metric / Code Font:** JetBrains Mono (with Fira Code, ui-monospace fallback)

**Character:** Geist is a precise, engineered grotesque built for technical products:
confident, modern, low-ornament, with enough character to avoid the Inter-default
"AI-made" read. Paired with a monospace for everything the *machine* says. The
contrast axis is human-vs-machine voice, not two competing sans-serifs. Two families
total; the hierarchy comes from weight and scale, not font count.

### Hierarchy
- **Display** (700, `clamp(2.75rem, 7vw, 5.5rem)`, line-height 1, `-0.035em`): The
  hero name, set massive and tight, optionally overlapping. The single loudest
  element on the page; appears once.
- **Headline** (600, `clamp(1.75rem, 3.5vw, 2.5rem)`, 1.1): Section openers
  (case studies, experience, contact).
- **Title** (600, `1.25rem`, 1.25): Project titles, role titles, the terminal
  chip headings.
- **Body** (400, `1.0625rem`, 1.6, max 70ch): Problem/solution sentences, prose.
  Set in Instrument White; never in cobalt.
- **Label** (500 mono, `0.8125rem`, `+0.04em`): Metrics, tech badges, the terminal
  chips (`[Layer 02 // Hidden: Core Engineering Stack]`), the contact-form fields,
  and the inference-status line. Short strings only.

### Named Rules
**The Two-Voice Rule.** Geist is the human voice; JetBrains Mono is the machine
voice. A metric, a layer label, a file path, a status line, a form field: machine,
so mono. A heading, a sentence, a name: human, so Geist. Never blur the two.

**The Quiet-Glow Heading Rule.** Headings are solid Instrument White (`#EDEFF2`).
Gradient text is forbidden as decoration. The single permitted exception is the hero
name, which may carry a restrained vertical metallic sheen (Instrument White →
slightly dimmed silver, top-to-bottom) as a deliberate material, never a multi-hue
gradient, and only after confirming the lightest stop still clears AA. Everywhere
else: one solid color, emphasis through weight and size.

## 4. Elevation

Flat by doctrine. On a near-black surface, drop shadows are invisible or muddy, so
depth is conveyed by tonal lift (`#05070C` base → `#0B0F17` panels) and by razor-thin
`rgba(255,255,255,0.12)` borders. The only luminous depth in the system is the
network *glow*: soft radial halos painted on the canvas under active nodes and along
firing synapses. UI chrome (cards, buttons, the form) never glows; the machine does.

### Shadow Vocabulary
- **Node glow** (`box-shadow` / canvas radial: soft lime or cobalt halo,
  ~24–48px blur, low alpha): only on active canvas nodes and the output node. Lives
  in the canvas render, not in DOM chrome.

### Named Rules
**The Glow-Belongs-To-The-Machine Rule.** Glow is reserved for the network and the
final output node. If a button, card, or input glows, it is impersonating the
machine; remove it. Chrome stays flat; the network stays alive.

## 5. Components

Refined and restrained: minimal, soft 8px edges, generous padding, quiet
transitions. The terminal/monospace character lives in the *labels and the contact
form*, not in heavy chrome. Components recede so the canvas leads.

### Buttons
- **Shape:** Gently rounded (8px / `{rounded.md}`).
- **Primary:** Instrument White fill, charcoal text, mono label, `12px 28px` padding.
  Used for the case-study `[Live Architecture Demo]` and the contact submit.
- **Hover / Focus:** Background shifts to Electric Lime (the one-live-signal moment of
  the button), charcoal text retained for contrast; ~180ms ease-out. Visible
  `2px` lime focus ring offset from the element for keyboard users.
- **Ghost:** Lifted-surface fill, Instrument White text, hairline border. Used for the
  secondary `[Code · GitHub]` action. Hover lifts the border to cobalt.

### Chips (tech badges, layer labels)
- **Style:** Lifted-surface background, Muted Ink mono text, 4px radius, `4px 10px`
  padding, hairline border. Reads as a small terminal token.
- **State:** Static by default. The terminal layer-label chip (e.g.
  `[Layer 02 // Hidden Layer: Core Engineering Stack]`) sits in the top corner of the
  glassmorphic layer-hover box and uses cobalt text to signal structure.

### Cards / Containers (case studies)
- **Corner Style:** 14px (`{rounded.lg}`) for case-study panels, 8px for smaller blocks.
- **Background:** Lifted Surface (`#0B0F17`) on the void.
- **Shadow Strategy:** None. Tonal lift + a hairline border defines the edge.
- **Border:** `rgba(255,255,255,0.12)`, 1px, all sides. Never a single colored side-stripe.
- **Internal Padding:** `24px`–`32px`. The single key impact metric per card is the
  one lime element; everything else (problem, solution, stack) stays neutral.
- **Anti-pattern:** Case-study panels must NOT collapse into an identical
  icon-heading-text grid. Vary the layout; let the headline metric break the grid.

### Inputs / Fields (the CLI contact form)
- **Style:** Lifted-surface field, 4px radius, hairline border, mono text. Prefixed
  with a prompt glyph (e.g. `>`), terminal-styled.
- **Focus:** Border shifts to cobalt and a thin cobalt underglow appears; placeholder
  text uses Muted Ink (clears AA, not a faint gray). Cursor styled to feel like a CLI.
- **Error / Disabled:** Error message in mono, lime is NOT used for errors (lime means
  alive, not wrong); use a dim red-orange reserved solely for errors. Disabled fields
  drop to `rgba(255,255,255,0.04)` with Muted Ink text.

### Navigation
- Minimal. A thin top marker or scroll-progress indicator at most; the layout is a
  single vertical scroll, so heavy nav is unnecessary. If present: mono labels,
  Muted Ink default, Instrument White on active section.

### Signature Component — The Neural Pipeline Canvas
A single `<canvas>` rendering the entire network: nodes and synapses are plain JS
objects with vector math, never DOM elements. Resting state is Hairline lines and
dim Deep-Cobalt synapses; data packets fire downward (forward pass) in Synapse
Cobalt and flash back upward (backprop) subtly. Node-hover isolates the node, dims
other lines, brightens its paths, and lights it lime (the live signal). DOM overlays
(glassmorphic layer box, Framer Motion tooltip, terminal chip) ride *above* the
canvas; they are the only sanctioned glass in the system. Below 768px the canvas
degrades to a static stacked node layout; `prefers-reduced-motion` replaces the
autonomous firing with a calm static (or barely-breathing) network.

## 6. Do's and Don'ts

### Do:
- **Do** keep the background absolute charcoal (`#05070C`) and build depth with tonal
  lift to `#0B0F17` plus hairline borders, never drop shadows.
- **Do** reserve Electric Lime (`#CCFF00`) for the active/live signal only: hovered or
  firing nodes, the one headline metric per case study, the "ready" output node, one
  primary CTA. Keep it rare.
- **Do** use cobalt (`#3B82F6` / `#1E40AF`) for everything structural: synapses,
  outlines, links, resting network.
- **Do** set machine-spoken strings (metrics, labels, file paths, the contact form) in
  JetBrains Mono, and human-spoken text (headings, prose) in Geist.
- **Do** keep body text in Instrument White (`#EDEFF2`) and verify every text color
  clears WCAG AA (4.5:1) on the void; placeholders use Muted Ink, not faint gray.
- **Do** confine glow to the canvas network and the output node.
- **Do** provide the `prefers-reduced-motion` static-network fallback and the <768px
  stacked-layout fallback; both are mandatory, not optional.

### Don't:
- **Don't** use gradient text (`background-clip: text` + gradient) anywhere except the
  one permitted restrained metallic sheen on the hero name; no multi-hue gradient text.
- **Don't** ship the **generic SaaS landing**: no gradient-blob hero, no big-number
  hero-metric template (large figure / small label / supporting stats), no identical
  icon-heading-text card grid.
- **Don't** ship the **cluttered dev portfolio**: no skill-cloud walls, no badge dumps,
  no busy-resume density.
- **Don't** ship the **corporate / stiff** look: no safe enterprise-blue chrome, no
  stock photography, no personality-free polish.
- **Don't** use cobalt for reading-length body text, and never use Deep Cobalt
  (`#1E40AF`) for any text.
- **Don't** put a colored `border-left`/`border-right` stripe on cards or callouts;
  use full hairline borders.
- **Don't** glow UI chrome (buttons, cards, inputs). Glow belongs to the machine.
- **Don't** render network nodes or synapses as DOM/SVG elements; everything inside
  the network is painted on the single canvas.
- **Don't** use lime for error states; errors get a dedicated dim red-orange.
