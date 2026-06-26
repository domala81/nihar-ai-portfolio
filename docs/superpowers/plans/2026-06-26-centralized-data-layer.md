# Centralized Data Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract all hardcoded portfolio content into a `data/` layer so adding a project, skill, or role means editing one plain TypeScript file.

**Architecture:** New `data/` folder with domain files (`personal.ts`, `projects.ts`, `experience.ts`, `skills.ts`, `index.ts`). `networkData.ts` becomes an adapter — it imports from `data/` and builds `PipeLayer[]` with pipeline-specific types. Components that don't need the pipeline import directly from `data/`.

**Tech Stack:** TypeScript (plain objects, `as const`), Next.js path alias `@/data`

## Global Constraints

- Never modify `NeuralPipeline.tsx`, `iconData.ts`, or any canvas/animation logic.
- `networkData.ts` must keep exporting `LAYERS`, `LAYER_COUNTS`, `ALL_NODES`, `nodeByLabel` — these are consumed by NeuralPipeline, DetailCard, NodeToken.
- `npm run build` must pass with zero TypeScript errors after every task.
- No new dependencies.
- All existing visual output must be pixel-identical after the refactor.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `data/personal.ts` | Create | Identity: name, email, socials (with display text), resume, tagline, location, status |
| `data/projects.ts` | Create | `ProjectEntry[]` — one plain object per project |
| `data/experience.ts` | Create | `ExperienceEntry[]` — one plain object per role |
| `data/skills.ts` | Create | `SkillEntry[]` + `PassionEntry[]` |
| `data/index.ts` | Create | Barrel re-export of all four files |
| `components/pipeline/networkData.ts` | Refactor | Adapter: imports from `data/`, maps → `PipeLayer[]` |
| `components/Hero.tsx` | Update | Import `personal` from `@/data`, remove hardcoded strings |
| `components/contact/ContactSection.tsx` | Update | Import `personal` from `@/data`, derive `EMAIL` + `CHANNELS` |
| `components/footer/SiteFooter.tsx` | Update | Import `personal` from `@/data` for copyright name |
| `components/projects/OrbitalProjects.tsx` | Update | Import `projects` from `@/data`, adapt field names |
| `components/experience/ExperienceTimeline.tsx` | Update | Import `experience` from `@/data`, adapt field names |

---

## Task 1: Create `data/personal.ts` and barrel `data/index.ts`

**Files:**
- Create: `data/personal.ts`
- Create: `data/index.ts`

**Interfaces:**
- Produces: `personal` object consumed by Hero, ContactSection, SiteFooter

- [ ] **Step 1: Create `data/personal.ts`**

```ts
// data/personal.ts
export const personal = {
  name: "Nihar Domala",
  location: "Washington, DC",
  tagline: "AI Systems · Data Engineering · Cloud",
  /** Hero status pill text */
  statusPill: "Accepting Missions",
  /** Contact section prose + Hero location bar */
  statusFull: "Open to AI Systems Engineering roles",
  email: "ndomala81@gmail.com",
  resume: "/resume.pdf",
  socials: {
    github: {
      href: "https://github.com/domala81",
      /** Short display string used in the terminal channel listing */
      display: "/domala81",
    },
    linkedin: {
      href: "https://www.linkedin.com/in/nihar-domala/",
      display: "/in/nihar-domala",
    },
  },
} as const;
```

- [ ] **Step 2: Create `data/index.ts` barrel**

```ts
// data/index.ts
export { personal } from "./personal";
// projects, experience, skills added in Task 3
```

- [ ] **Step 3: Verify TypeScript is happy**

Run: `npm run build`
Expected: build passes (no files consuming data/ yet, so no regressions possible)

- [ ] **Step 4: Commit**

```bash
git add data/personal.ts data/index.ts
git commit -m "feat: add data/personal.ts — centralized identity config"
```

---

## Task 2: Wire `personal` into Hero, ContactSection, SiteFooter

**Files:**
- Modify: `components/Hero.tsx`
- Modify: `components/contact/ContactSection.tsx`
- Modify: `components/footer/SiteFooter.tsx`

**Interfaces:**
- Consumes: `personal` from `@/data` (Task 1)
- Produces: no API changes — same rendered output, different source

- [ ] **Step 1: Update `Hero.tsx`**

Replace the `SOCIALS` const and hardcoded strings. The full file after changes:

```tsx
"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Github, Linkedin, FileText, ArrowDown } from "lucide-react";
import { personal } from "@/data";

const SOCIALS = [
  { label: "GitHub", href: personal.socials.github.href, Icon: Github },
  { label: "LinkedIn", href: personal.socials.linkedin.href, Icon: Linkedin },
];

export default function Hero() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: 0.05 },
    },
  };
  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="min-h-hero relative">
      {/* Top bar */}
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <a
          href="#top"
          className="relative inline-block font-mono text-sm tracking-tightish text-ink transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-infra after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 motion-reduce:after:hidden"
        >
          nihar<span className="text-ink-muted">.domala</span>
        </a>
        <nav className="flex items-center gap-1 sm:gap-2">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-2 rounded-md px-3 py-2 font-mono text-xs text-ink-muted transition-colors hover:text-ink"
            >
              <Icon className="h-4 w-4 transition-transform duration-200 ease-out group-hover:-translate-y-px" aria-hidden />
              <span className="relative hidden sm:inline after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-infra after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 motion-reduce:after:hidden">
                {label}
              </span>
            </a>
          ))}
          <a
            href={personal.resume}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-md border border-border-soft px-3 py-2 font-mono text-xs text-ink-muted transition-colors hover:border-infra hover:text-ink"
          >
            <FileText className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Résumé</span>
          </a>
        </nav>
      </header>

      {/* Hero content */}
      <motion.div
        id="top"
        variants={container}
        initial="hidden"
        animate="show"
        className="min-h-hero relative z-10 mx-auto flex max-w-6xl flex-col justify-center px-6 pb-28 pt-28 sm:px-10"
      >
        {/* Status pill */}
        <motion.div variants={item} className="mb-7">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-border-soft bg-surface/60 px-3.5 py-1.5 font-mono text-xs text-ink-muted backdrop-blur-sm">
            <StatusDot reduce={!!reduce} />
            {personal.statusPill}
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={item}
          className="text-balance font-sans font-semibold leading-[0.95] tracking-display text-ink"
          style={{ fontSize: "clamp(2.75rem, 9vw, 5.75rem)" }}
        >
          {personal.name}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={item}
          className="mt-6 max-w-measure text-pretty text-lg leading-relaxed text-ink sm:text-xl"
        >
          <span className="font-mono text-base text-infra sm:text-lg">
            {personal.tagline}.
          </span>{" "}
          Building the infrastructure that puts models into production.
        </motion.p>

        {/* Location */}
        <motion.div
          variants={item}
          className="mt-5 flex flex-col items-start gap-1.5 font-mono text-xs text-ink-muted sm:flex-row sm:items-center sm:gap-3"
        >
          <span>{personal.location}</span>
          <span className="hidden h-px w-8 bg-border-soft sm:block" aria-hidden />
          <span>Open to AI / Data / Cloud roles</span>
        </motion.div>

        {/* CTAs */}
        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-md border border-live bg-live/10 px-5 py-3 font-mono text-sm text-live transition-all duration-200 ease-out-quint hover:-translate-y-px hover:bg-live hover:text-bg motion-reduce:hover:translate-y-0"
          >
            Get in touch
            <span aria-hidden className="transition-transform duration-200 ease-out-quint group-hover:translate-x-0.5">
              →
            </span>
          </a>
          <a
            href={personal.resume}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-md border border-border-soft px-5 py-3 font-mono text-sm text-ink transition-all duration-200 ease-out-quint hover:-translate-y-px hover:border-ink/40 motion-reduce:hover:translate-y-0"
          >
            <FileText className="h-4 w-4" aria-hidden />
            Download résumé
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 1.1, duration: 0.6 }}
        className="absolute inset-x-0 bottom-6 z-10 mx-auto flex w-fit flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink-muted"
      >
        Scroll
        <motion.span
          animate={reduce ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.div>
    </div>
  );
}

function StatusDot({ reduce }: { reduce: boolean }) {
  return (
    <span className="relative inline-flex h-2 w-2">
      {!reduce && (
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-live"
          animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
    </span>
  );
}
```

- [ ] **Step 2: Update `ContactSection.tsx`**

At the top of the file, replace the `EMAIL` const and `CHANNELS` array. Change these specific sections:

**Remove** (lines 18 and 57-65):
```ts
const EMAIL = "ndomala81@gmail.com";
// ...
const CHANNELS: Channel[] = [
  { label: "email", value: EMAIL, copy: true },
  { label: "github", value: "/domala81", href: "https://github.com/domala81" },
  {
    label: "linkedin",
    value: "/in/nihar-domala",
    href: "https://www.linkedin.com/in/nihar-domala/",
  },
];
```

**Add** after the imports:
```ts
import { personal } from "@/data";

const CHANNELS: Channel[] = [
  { label: "email", value: personal.email, copy: true },
  { label: "github", value: personal.socials.github.display, href: personal.socials.github.href },
  { label: "linkedin", value: personal.socials.linkedin.display, href: personal.socials.linkedin.href },
];
```

Also update the `copyEmail` function (replace `EMAIL` with `personal.email`):
```ts
const copyEmail = async () => {
  let ok = false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(personal.email);
      ok = true;
    }
  } catch {
    /* denied/insecure — fall through to the execCommand fallback */
  }
  if (!ok) {
    try {
      const ta = document.createElement("textarea");
      ta.value = personal.email;
      // ... rest unchanged
```

Also update the mailto link (line ~243):
```tsx
href={`mailto:${personal.email}`}
```

Also update the aria-label on the copy button:
```tsx
aria-label={`Copy email address ${personal.email}`}
```

- [ ] **Step 3: Update `SiteFooter.tsx`**

Add import and replace hardcoded name in the colophon. Change lines 1-4 to add import:
```tsx
"use client";

import { ArrowUp } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { personal } from "@/data";
```

Replace line 50:
```tsx
<span>© {new Date().getFullYear()} {personal.name}</span>
```

- [ ] **Step 4: Build check**

Run: `npm run build`
Expected: zero TypeScript errors, zero lint errors

- [ ] **Step 5: Commit**

```bash
git add components/Hero.tsx components/contact/ContactSection.tsx components/footer/SiteFooter.tsx
git commit -m "feat: wire personal config into Hero, ContactSection, SiteFooter"
```

---

## Task 3: Create `data/projects.ts`, `data/experience.ts`, `data/skills.ts`

**Files:**
- Create: `data/projects.ts`
- Create: `data/experience.ts`
- Create: `data/skills.ts`
- Modify: `data/index.ts`

**Interfaces:**
- Produces: `ProjectEntry[]`, `ExperienceEntry[]`, `SkillEntry[]`, `PassionEntry[]` consumed by adapter (Task 4) and components (Tasks 5–6)

- [ ] **Step 1: Create `data/projects.ts`**

Migrate the 3 existing projects from `networkData.ts` LAYERS[2] into plain objects:

```ts
// data/projects.ts

export type ProjectEntry = {
  id: string;
  title: string;
  date: string;
  /** One-line problem statement (case-study "problem" line in the detail panel) */
  problem: string;
  /** One-line pipeline / approach description */
  description: string;
  /** Impact metric shown in lime in the detail panel */
  metric: string;
  /** Tech tags — shown as chips; also used to highlight connected nodes in the pipeline */
  tech: string[];
  /** Action links rendered in the detail panel */
  links: { label: string; href: string }[];
};

export const projects: ProjectEntry[] = [
  {
    id: "nlp",
    title: "Real-time NLP Pipeline",
    date: "2024",
    problem: "Support tickets piled up faster than anyone could route them by hand.",
    description: "Streaming text classification that tags and routes every message in production.",
    metric: "10M+ rows/day · latency −40%",
    tech: ["Apache Spark", "Kafka", "PyTorch"],
    links: [
      { label: "Code", href: "#" },
      { label: "Demo", href: "#" },
    ],
  },
  {
    id: "proj2",
    title: "Feature Store & Serving",
    date: "2024",
    problem: "Models trained on features that had already drifted from what production served.",
    description: "Point-in-time feature store with online and offline parity.",
    metric: "train/serve skew → 0 · p99 ‹<50ms›",
    tech: ["Feast", "Redis", "dbt"],
    links: [
      { label: "Code", href: "#" },
      { label: "Demo", href: "#" },
    ],
  },
  {
    id: "proj3",
    title: "Model Serving Gateway",
    date: "2023",
    problem: "Every model shipped its own bespoke API, with no shared auth or rollout control.",
    description: "One inference gateway: dynamic batching, canary rollout, token auth.",
    metric: "throughput ‹+3×› · cost/req ‹−45%›",
    tech: ["FastAPI", "Triton", "Kubernetes"],
    links: [
      { label: "Code", href: "#" },
      { label: "Demo", href: "#" },
    ],
  },
];
```

- [ ] **Step 2: Create `data/experience.ts`**

Migrate the 3 entries from `networkData.ts` LAYERS[3]:

```ts
// data/experience.ts

export type ExperienceEntry = {
  id: string;
  /** Job title or degree name — displayed as the timeline card heading */
  role: string;
  org: string;
  /** Date range, e.g. "2023 – present" or "2021 – 2023" */
  period: string;
  /** One-line card subtitle */
  description: string;
  /** 2–3 achievement bullets shown in the expanded card */
  bullets: string[];
  /**
   * Related skill labels — used to render brand-logo tech chips.
   * Must match keys in CONNECTION_SLUG in ExperienceTimeline.tsx.
   * Valid values: "Apache Spark", "Apache Airflow", "PyTorch", "Python", "PostgreSQL", "Snowflake"
   */
  skills: string[];
};

export const experience: ExperienceEntry[] = [
  {
    id: "exp-de",
    role: "Data Engineer",
    org: "‹company›",
    period: "2023 – present",
    description: "Building scalable data infrastructure.",
    bullets: [
      "Build and operate batch + streaming pipelines moving ‹N›M+ rows/day.",
      "Cut p95 pipeline latency ‹−40%› by reworking the Spark / Airflow DAGs.",
      "Own data reliability: ‹N›+ production DAGs, on-call, ‹SLA›% freshness.",
    ],
    skills: ["Apache Spark", "Apache Airflow", "AWS"],
  },
  {
    id: "exp-intern",
    role: "ML Engineer Intern",
    org: "‹company›",
    period: "2022",
    description: "Shipped ML features end to end.",
    bullets: [
      "Shipped ‹feature› end to end: data prep, training, and serving.",
      "Added ‹eval / monitoring› that caught ‹issue› before release.",
    ],
    skills: ["PyTorch", "Python"],
  },
  {
    id: "exp-ms",
    role: "MS, Data Science",
    org: "George Washington University",
    period: "2021 – 2023",
    description: "Master of Science.",
    bullets: [
      "Focus: ‹distributed systems / ML / NLP›.",
      "Capstone: ‹project› — ‹result / metric›.",
    ],
    skills: ["Python", "PyTorch"],
  },
];
```

- [ ] **Step 3: Create `data/skills.ts`**

Migrate passions (LAYERS[0]) and skills (LAYERS[1]):

```ts
// data/skills.ts

export type PassionEntry = {
  id: string;
  label: string;
  description: string;
  /** Labels of connected nodes — used for hover highlight in the pipeline */
  connections: string[];
};

export type SkillEntry = {
  id: string;
  label: string;
  /** simple-icons slug — must exist in iconData.ts */
  icon: string;
  /** Expertise pill: "CORE" | "HIGH" | "GROWING" */
  expertise: string;
  /** Display date, e.g. "Since 2020" */
  date: string;
  description: string;
  /** 0–100 competency bar */
  energy: number;
  connections: string[];
};

export const passions: PassionEntry[] = [
  {
    id: "p-distributed",
    label: "Distributed systems",
    description: "Designing for scale from day one.",
    connections: ["Apache Spark", "Apache Airflow"],
  },
  {
    id: "p-prod",
    label: "Models in production",
    description: "Where ML earns its keep.",
    connections: ["PyTorch", "Real-time NLP Pipeline"],
  },
  {
    id: "p-reliability",
    label: "Data reliability",
    description: "Pipelines you can trust at 3am.",
    connections: ["PostgreSQL", "Apache Airflow"],
  },
  {
    id: "p-latency",
    label: "Low-latency inference",
    description: "Fast answers, every time.",
    connections: ["PyTorch", "Models in production"],
  },
];

export const skills: SkillEntry[] = [
  {
    id: "python",
    label: "Python",
    icon: "python",
    expertise: "CORE",
    date: "Since 2020",
    description: "Primary language across data and ML work.",
    energy: 95,
    connections: ["Apache Spark", "PyTorch", "PostgreSQL"],
  },
  {
    id: "spark",
    label: "Apache Spark",
    icon: "apachespark",
    expertise: "HIGH",
    date: "Since 2023",
    description: "Large-scale distributed data processing engine.",
    energy: 90,
    connections: ["Kafka", "AWS", "PyTorch"],
  },
  {
    id: "airflow",
    label: "Apache Airflow",
    icon: "apacheairflow",
    expertise: "HIGH",
    date: "Since 2023",
    description: "Orchestrating production data pipelines.",
    energy: 85,
    connections: ["Python", "Apache Spark"],
  },
  {
    id: "postgres",
    label: "PostgreSQL",
    icon: "postgresql",
    expertise: "HIGH",
    date: "Since 2021",
    description: "Modeling and querying the warehouse.",
    energy: 88,
    connections: ["Python", "Snowflake"],
  },
  {
    id: "snowflake",
    label: "Snowflake",
    icon: "snowflake",
    expertise: "GROWING",
    date: "Since 2024",
    description: "Cloud warehouse for analytics at scale.",
    energy: 72,
    connections: ["PostgreSQL", "Apache Spark"],
  },
  {
    id: "pytorch",
    label: "PyTorch",
    icon: "pytorch",
    expertise: "GROWING",
    date: "Since 2023",
    description: "Training and fine-tuning models.",
    energy: 78,
    connections: ["Hugging Face", "Python"],
  },
];
```

- [ ] **Step 4: Update `data/index.ts` barrel**

```ts
// data/index.ts
export { personal } from "./personal";
export { projects } from "./projects";
export type { ProjectEntry } from "./projects";
export { experience } from "./experience";
export type { ExperienceEntry } from "./experience";
export { skills, passions } from "./skills";
export type { SkillEntry, PassionEntry } from "./skills";
```

- [ ] **Step 5: Build check**

Run: `npm run build`
Expected: passes — nothing consumes the new files yet

- [ ] **Step 6: Commit**

```bash
git add data/projects.ts data/experience.ts data/skills.ts data/index.ts
git commit -m "feat: add data/projects, experience, skills — migrated content from networkData"
```

---

## Task 4: Refactor `networkData.ts` into adapter

**Files:**
- Modify: `components/pipeline/networkData.ts`

**Interfaces:**
- Consumes: `projects`, `experience`, `skills`, `passions` from `@/data`
- Produces: `LAYERS`, `LAYER_COUNTS`, `ALL_NODES`, `nodeByLabel` — same signatures as before

- [ ] **Step 1: Rewrite `networkData.ts`**

The public API (exported names + types) must not change. Replace the file content:

```ts
/**
 * Pipeline adapter — maps data/ content entries into PipeLayer/PipeNode shapes
 * for the canvas renderer and hover detail card. Never edit this file to change
 * content; edit the relevant data/ file instead.
 */

import { projects, experience, skills, passions } from "@/data";

export type NodeKind = "passion" | "skill" | "project" | "experience" | "result";

export type PipeNode = {
  id: string;
  label: string;
  kind: NodeKind;
  icon?: string;
  expertise?: string;
  date?: string;
  description?: string;
  bullets?: string[];
  energy?: number;
  metric?: string;
  problem?: string;
  org?: string;
  connections?: string[];
  links?: { label: string; href: string }[];
};

export type PipeLayer = {
  index: 0 | 1 | 2 | 3 | 4;
  moniker: string;
  short: string;
  kind: NodeKind;
  nodes: PipeNode[];
};

export const LAYERS: PipeLayer[] = [
  {
    index: 0,
    moniker: "LAYER 1: INPUTS (PASSIONS)",
    short: "Inputs · Passions",
    kind: "passion",
    nodes: passions.map((p) => ({
      id: p.id,
      label: p.label,
      kind: "passion" as NodeKind,
      description: p.description,
      connections: p.connections,
    })),
  },
  {
    index: 1,
    moniker: "LAYER 2: TRANSFORMATION (CORE SKILLS)",
    short: "Transformation · Core Skills",
    kind: "skill",
    nodes: skills.map((s) => ({
      id: s.id,
      label: s.label,
      kind: "skill" as NodeKind,
      icon: s.icon,
      expertise: s.expertise,
      date: s.date,
      description: s.description,
      energy: s.energy,
      connections: s.connections,
    })),
  },
  {
    index: 2,
    moniker: "LAYER 3: OUTPUTS (PROJECTS)",
    short: "Outputs · Projects",
    kind: "project",
    nodes: projects.map((p) => ({
      id: p.id,
      label: p.title,
      kind: "project" as NodeKind,
      date: p.date,
      problem: p.problem,
      description: p.description,
      metric: p.metric,
      connections: p.tech,
      links: p.links,
    })),
  },
  {
    index: 3,
    moniker: "LAYER 4: DEPLOYMENT (EXPERIENCE)",
    short: "Deployment · Experience",
    kind: "experience",
    nodes: experience.map((e) => ({
      id: e.id,
      label: e.role,
      kind: "experience" as NodeKind,
      org: e.org,
      date: e.period,
      description: e.description,
      bullets: e.bullets,
      connections: e.skills,
    })),
  },
  {
    index: 4,
    moniker: "INFERENCE STATUS: READY FOR THE NEXT MISSION",
    short: "Core Result",
    kind: "result",
    nodes: [
      {
        id: "result",
        label: "Ready for the next mission",
        kind: "result",
        description: "Open to AI Systems · Data · Cloud roles.",
      },
    ],
  },
];

/** Node counts per column, left→right. Drives canvas layout + reveal stagger. */
export const LAYER_COUNTS = LAYERS.map((l) => l.nodes.length);

/** Flat list with layer index attached — convenient for canvas geometry + lookups. */
export const ALL_NODES = LAYERS.flatMap((layer) =>
  layer.nodes.map((node) => ({ ...node, layer: layer.index })),
);

/** Find a node by exact label (used to resolve a "connected node" chip → highlight). */
export const nodeByLabel = (label: string) =>
  ALL_NODES.find((n) => n.label.toLowerCase() === label.toLowerCase());
```

- [ ] **Step 2: Build check**

Run: `npm run build`
Expected: zero errors. All existing consumers of `LAYERS`, `ALL_NODES`, `nodeByLabel` still work because the exported types and values are identical.

- [ ] **Step 3: Commit**

```bash
git add components/pipeline/networkData.ts
git commit -m "refactor: networkData.ts → adapter over data/ layer"
```

---

## Task 5: Update `OrbitalProjects.tsx` to consume `data/projects`

**Files:**
- Modify: `components/projects/OrbitalProjects.tsx`

**Interfaces:**
- Consumes: `projects` (`ProjectEntry[]`) from `@/data`
- Removes dependency on `LAYERS` from `networkData`

- [ ] **Step 1: Update the import and PROJECTS constant**

Find and replace these lines near the top of `OrbitalProjects.tsx`:

**Remove:**
```ts
import { LAYERS, type PipeNode } from "../pipeline/networkData";
// ...
const PROJECTS = LAYERS[2].nodes;
```

**Add:**
```ts
import { projects, type ProjectEntry } from "@/data";
```

Then, anywhere `PROJECTS` was declared as a const, remove that line. Do a find-replace of `PROJECTS` → `projects` throughout the file (it's used in the render loop).

- [ ] **Step 2: Update field references**

`OrbitalProjects.tsx` references `PipeNode` fields that have been renamed in `ProjectEntry`. Apply these renames throughout the file:

| Old (`PipeNode`) | New (`ProjectEntry`) |
|---|---|
| `node.label` | `project.title` |
| `node.connections` | `project.tech` |

All other fields (`id`, `description`, `metric`, `problem`, `links`, `date`) are identical between `PipeNode` and `ProjectEntry`, so no rename needed.

Also update any TypeScript type annotations from `PipeNode` to `ProjectEntry`.

- [ ] **Step 3: Build check**

Run: `npm run build`
Expected: zero errors

- [ ] **Step 4: Commit**

```bash
git add components/projects/OrbitalProjects.tsx
git commit -m "refactor: OrbitalProjects reads from data/projects directly"
```

---

## Task 6: Update `ExperienceTimeline.tsx` to consume `data/experience`

**Files:**
- Modify: `components/experience/ExperienceTimeline.tsx`

**Interfaces:**
- Consumes: `experience` (`ExperienceEntry[]`) from `@/data`
- Removes dependency on `LAYERS` from `networkData`

- [ ] **Step 1: Update the import and ENTRIES constant**

Find and replace near the top of `ExperienceTimeline.tsx`:

**Remove:**
```ts
import { LAYERS } from "../pipeline/networkData";
// ...
const ENTRIES = LAYERS[3].nodes;
```

**Add:**
```ts
import { experience, type ExperienceEntry } from "@/data";
```

Remove the `const ENTRIES = LAYERS[3].nodes;` line. Replace `ENTRIES` → `experience` throughout the file.

- [ ] **Step 2: Update field references**

| Old (`PipeNode`) | New (`ExperienceEntry`) |
|---|---|
| `entry.label` | `entry.role` |
| `entry.date` | `entry.period` |
| `entry.connections` | `entry.skills` |

All other fields (`id`, `org`, `description`, `bullets`) are identical — no rename needed.

Also update `CONNECTION_SLUG` lookups: they now read from `entry.skills` (same string values, just renamed field).

Update any TypeScript type annotations from `PipeNode` to `ExperienceEntry`.

- [ ] **Step 3: Build check**

Run: `npm run build`
Expected: zero errors

- [ ] **Step 4: Commit**

```bash
git add components/experience/ExperienceTimeline.tsx
git commit -m "refactor: ExperienceTimeline reads from data/experience directly"
```

---

## Task 7: Final verification + smoke test

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: zero TypeScript errors, zero lint errors, build completes

- [ ] **Step 2: Dev server visual check**

Run: `npm run dev`

Visit `http://localhost:3000` and verify each section:

1. **Hero** — name "Nihar Domala", tagline correct, GitHub/LinkedIn links work, résumé link works
2. **Pipeline (Section 2)** — all 5 columns render: 4 passion nodes, 6 skill nodes, 3 project nodes, 3 experience nodes, 1 result node. Canvas animation runs.
3. **Projects (Section 3)** — 3 project nodes in orbit, detail panel shows title/metric/problem/tech chips/links
4. **Experience (Section 4)** — 3 timeline entries with role, org, period, bullets, skill chips
5. **Contact (Section 5)** — email copies to clipboard, GitHub/LinkedIn links open correctly
6. **Footer** — "© [year] Nihar Domala" correct

- [ ] **Step 3: Smoke test — add a dummy project**

Add this to `data/projects.ts` as the 4th entry:

```ts
{
  id: "test-proj",
  title: "Test Project",
  date: "2026",
  problem: "Smoke test.",
  description: "Temporary entry to verify auto-propagation.",
  metric: "∞ confidence",
  tech: ["Python"],
  links: [],
},
```

Run `npm run dev`. Verify:
- Pipeline column 3 shows 4 project nodes (not 3)
- Orbital section shows 4 projects
- No build errors

Then **remove the dummy entry** and confirm it disappears from both.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "chore: verify centralized data layer — smoke test passed"
```

---

## Adding New Content After This (Reference)

**New project:**
1. Add `ProjectEntry` object to `data/projects.ts`
2. Add one line to `PROJECT_GLYPH` in `OrbitalProjects.tsx`: `yourId: SomeLucideIcon`
3. Done — pipeline, orbital, detail panel all update

**New skill:**
1. Add `SkillEntry` to `data/skills.ts`
2. Ensure the `icon` slug exists in `iconData.ts` (run `scripts/gen-icons.mjs` if needed)
3. Done

**New experience role:**
1. Add `ExperienceEntry` to `data/experience.ts`
2. Add one line to `ROLE_GLYPH` in `ExperienceTimeline.tsx`: `yourId: SomeLucideIcon`
3. Done

**Update personal info:**
1. Edit `data/personal.ts`
2. Done — reflects in Hero, Contact, Footer instantly
