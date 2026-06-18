You are an expert Frontend Engineer and Creative Developer specializing in high-performance UI/UX, HTML5 Canvas math animations, GSAP, and Framer Motion. Your task is to build a highly responsive, single-page portfolio website for a Data Engineer transitioning into an AI Systems Engineer.

The website uses a **Vertical Data Pipeline Layout** modeled after a deep learning neural network. The entire application scrolls _strictly vertically_ (no horizontal panning). It combines heavy typographic hero styling with a highly performant 2D canvas animation that simulates autonomous neural network processes.

---

## 1. Core Architecture & Tech Stack

- **Framework:** Next.js (App Router), React, TypeScript.
- **Styling:** Tailwind CSS.
- **Core Animation Engine:** Vanilla HTML5 Canvas API (`2d` context) orchestrated by **GSAP (GreenSock)** via `gsap.ticker`.
- **UI/Layout Transitions:** **Framer Motion** (for text entry, overlay boxes, and tooltips).
- **Icons:** Lucide React (or simple raw SVGs).

---

## 2. Visual Theme, Aesthetic, & Typography

- **Theme:** Minimalist, high-end technical engineering dashboard. Dark, premium, and clean.
- **Colors:**
  - Primary Background: Deep, absolute dark charcoal/black (`#05070C`).
  - Accent Color 1 (Active Elements & Tooltips): Minimal Lime Green (`#CCFF00`).
  - Accent Color 2 (Infrastructure & Synapses): Deep Cobalt Blue (`#1E40AF` or `#3B82F6`).
  - Muted Lines/Nodes: Semi-transparent charcoal/gray (`rgba(255, 255, 255, 0.08)`).
- **Typography:**
  - Headings: Large, bold, premium sans-serif (e.g., Inter, SF Pro Display) utilizing silver-to-white metallic gradients.
  - Labels, Metrics, & Code UI: Monospace (e.g., JetBrains Mono, Fira Code).

---

## 3. Layout & Section Architecture (Strictly Vertical Flow)

### Section 1: Typographic Hero Layer (Above the Fold)

- **Layout:** Inspired by premium minimal developer portfolios. Centered or heavily left-aligned massive, bold typography.
  - Main Header: `Sonny Lazuardi` style massive overlapping type displaying the name or core focus.
  - Sub-header / Tagline: "Data Engineer → AI Systems. Building the infrastructure that scales intelligent models."
- **Visual Background:** The canvas network begins in the lower half of this section, subtly pulsing and peaking out at the bottom of the viewport, inviting the user to scroll.

### Section 2: The Interactive Neural Pipeline Canvas

As the user scrolls past the text header, the typography fades out gracefully via GSAP ScrollTrigger, and the interactive HTML5 canvas fills the screen.

#### A. Autonomous Animation Loop (Forward & Backward Propagation):

- The canvas displays a vertically oriented neural network with distinct layers: Input (Passions), Hidden 1 & 2 (Core Engineering/ML Stack), Output (Projects/Real-world experience).
- Even without user interaction, data packets must continuously fire down the connecting synapses (lines) from the top layer to the bottom layer (Forward Pass) and flash subtly back upward (Backward Pass/Backprop) using `requestAnimationFrame` or `gsap.ticker`.

#### B. Hover Micro-Interactions:

- **Layer-Level Hover:** When the mouse pointer hovers over any part of a specific layer column, a beautiful, ultra-faint glassmorphic bounding box (`backdrop-blur-sm`, razor-thin border) fades in around that layer cluster. It features a top-corner terminal chip label: e.g., `[Layer 02 // Hidden Layer: Core Engineering Stack]`.
- **Node-Level Hover:** Hovering over a specific node isolates it. It dims irrelevant connecting lines and brightly highlights its active connection paths in Cobalt Blue/Lime Green.
- **Tooltip Pop-up Cloud:** A Framer Motion micro-card pops up exactly over the hovered node:
  - _If a Skill Node:_ Shows the technology name (e.g., `Apache Spark`) + micro-metric (e.g., `Used in 4 production pipelines`).
  - _If a Project Node:_ Shows the project title (e.g., `Real-time NLP Pipeline`) + impact metric (e.g., `Processed 10M+ rows daily // Latency -40%`).

### Section 3: Detailed Case Studies (The Project Content)

- The pipeline outputs transform into a clean, minimalist 3-4 project grid or stack.
- Each project uses a standardized "TL;DR" layout built for fast-scanning recruiters:
  1. The Problem (1 sentence)
  2. The Solution (1 sentence)
  3. Impact Metrics (Bold, clear, highlighted in Lime Green)
  4. Tech Stack Badges
  5. Action Buttons: `[Code Github]` and `[Live Architecture Demo]`.

### Section 4: Professional Experience Timeline

- Clean vertical line tracking chronological experience:
  - Current Role: Data Engineer (1 year experience highlighting scalable data infrastructure).
  - Prior Experience: Machine Learning Engineer Internship.
  - Education: Master of Science (MS) in Data Science from George Washington University.

### Section 5: The Convergent Output Node & Contact UI

- The entire vertical network converges at the absolute bottom into a single, high-geometry, glowing geometric node.
- **Label:** `Inference Status: Ready to solve your problems next.`
- **Interaction:** Clicking this node triggers a smooth transition that unveils a dark-themed, CLI-inspired/Terminal Contact Form for direct recruiter communication.

---

## 4. Technical Performance & Optimization Rules

1.  **Zero DOM Bloat for Animations:** Do NOT render network nodes or synapses as individual HTML/SVG elements. Everything inside the neural network structure must be painted directly onto a single `<canvas>` element using 2D vector drawing arrays (`ctx.arc`, `ctx.lineTo`).
2.  **State Arrays:** Manage nodes and running data packets as pure, lightweight JavaScript arrays of objects tracking vector math coordinates (`x`, `y`), baseline target positions, radii, alphas, and current interpolation states.
3.  **UI Segregation:** Use Framer Motion exclusively for DOM structural overlays (Text entry fades, the glassmorphic bounding boxes, floating HTML tooltip boxes, and the final CLI modal).
4.  **Mobile Fallback:** If the screen width is $< 768\text{px}$, safely disable complex canvas hover calculations. Scale the network down to a clean, vertically stacked static node layout or 2D vector graphic representation to guarantee high-performance scrolling across mobile devices.
5.  **Clean Up Loops:** Ensure canvas animation loops pause automatically if the user scrolls completely past the canvas zone to save hardware resources.

Please provide the modular code structure, beginning with the Next.js main landing page layout, global Tailwind color theme overrides, and the standalone canvas engine component containing the core data loop.
