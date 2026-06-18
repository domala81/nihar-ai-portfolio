# Product

## Register

brand

## Users

Nihar Domala's portfolio, optimized recruiter-first but built to survive engineer
scrutiny.

- **Primary: technical recruiters and hiring managers.** Scanning quickly for
  impact metrics, stack fit, and "can this person do the AI Systems work." They
  need the answer in seconds: the case studies are written TL;DR-first (Problem →
  Solution → Impact → Stack) for exactly this reader.
- **Secondary: engineering leads and peers.** They will read the architecture
  depth and treat the canvas neural-pipeline itself as a work sample. The build
  quality (performant single-canvas rendering, real vector math, clean motion) is
  part of the argument, not decoration.

The job to be done: convince a hiring decision-maker, in one vertical scroll, that
a Data Engineer with a year of scalable-infrastructure experience is a credible AI
Systems Engineer, and make it effortless to start a conversation.

## Product Purpose

A single-page portfolio that frames a career as a deep-learning network: passions
(input) flow through engineering and ML-stack layers (hidden) into shipped projects
(output), converging on one "Inference Status: ready" contact node. The signature
is an autonomous, always-animating neural-pipeline rendered on a single HTML5
canvas, scrolling strictly vertically.

Success looks like: a recruiter lands, understands the positioning within the hero,
scrolls the pipeline, scans 3-4 case studies with hard metrics, and opens the
contact form, without ever feeling lost, bored, or impressed-but-confused.

## Brand Personality

Precise, confident, engineered. The voice of someone who builds infrastructure:
specific over grand, metrics over adjectives, calm over loud. Three words:
**engineered, confident, alive.** The interface should feel like a high-end
technical instrument that happens to be beautiful, evoking quiet competence and a
sense of systems quietly working. Personality comes from the concept and the
craft, not from jokey copy or decorative flourish.

## Anti-references

- **Corporate / stiff.** No safe enterprise-blue, stock photography, or
  low-personality "we value synergy" tone. This is a person, not a company.
- **Cluttered dev portfolio.** No skill-cloud walls, badge dumps, or busy-resume
  density. Restraint is the differentiator; every node and metric earns its place.
- **Generic SaaS landing.** No gradient-blob heroes, hero-metric template (big
  number / small label / supporting stats), or identical icon-heading-text card
  grids. The case studies must not collapse into the same SaaS card grid.

## Design Principles

1. **The medium is the message.** A portfolio for an AI Systems Engineer should
   itself be a well-engineered system. The canvas performance, the vector math, and
   the motion discipline are the proof, not the claim.
2. **Show, don't tell.** Lead with concrete metrics (10M+ rows/day, latency -40%),
   real stack names, and shipped work. No buzzwords, no "passionate about."
3. **Restraint as signal.** Negative space, a tight palette, and one signature
   interaction read as senior. Resist adding; the discipline is the personality.
4. **Recruiter-speed, engineer-depth.** Anyone gets the headline in seconds; anyone
   who digs finds real substance. Never trade scannability for depth or vice versa.
5. **Performance is a feature.** Smooth on a phone, never janky. A slow or
   stuttering animation actively undermines the entire pitch.

## Accessibility & Inclusion

- **Target: WCAG 2.1 AA.** All real text passes AA contrast against the near-black
  background. The bright accents (lime `#CCFF00`, cobalt `#3B82F6`) are reserved for
  glows, synapses, node highlights, and large/bold UI, not for small body text;
  cobalt-on-black body text in particular must be avoided.
- **Reduced motion is mandatory.** Honor `prefers-reduced-motion`: replace the
  autonomous forward/backprop animation with a calm, static (or barely-breathing)
  network so vestibular-sensitive users get the concept without the constant motion.
- **Keyboard + semantics.** The CLI/terminal contact form is fully keyboard
  navigable with visible focus states and proper labels. Canvas interactions have a
  non-canvas path to the same information where it carries meaning (skill/project
  details), so the content is not locked inside the canvas.
- **Mobile fallback (<768px)** degrades the canvas to a clean stacked static layout,
  which also serves low-power and assistive contexts.
