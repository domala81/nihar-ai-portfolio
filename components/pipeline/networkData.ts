/**
 * Content model for the Horizontal Inference Pipeline (Section 2).
 *
 * Five columns flow left → right: Inputs (passions) → Transformation (core skills)
 * → Outputs (projects) → Deployment (experience) → the single Core Result node.
 * The same data drives the canvas spheres, the hover detail card, and the
 * accessible / mobile stacked list — one source of truth.
 *
 * ⚠️ DRAFT CONTENT — correct before shipping (this is a live job-search portfolio):
 *   - Skills/icons are chosen to showcase real brand logos; swap freely.
 *   - Every metric, energy %, date, org name, and ‹…› placeholder is provisional.
 *   - `icon` must be a slug present in iconData.ts (re-run scripts/gen-icons.mjs to add).
 */

export type NodeKind = "passion" | "skill" | "project" | "experience" | "result";

export type PipeNode = {
  id: string;
  label: string;
  kind: NodeKind;
  /** simple-icons slug (skills) — must exist in iconData.ts; else a glyph is used */
  icon?: string;
  /** skills: shown as the EXPERTISE pill (e.g. "CORE" | "HIGH" | "GROWING") */
  expertise?: string;
  /** "Since 2023" · "2024" · "2021 – 2023" */
  date?: string;
  /** one-line card body (canvas detail card) */
  description?: string;
  /** experience roles: 2–3 achievement bullets for the timeline cards */
  bullets?: string[];
  /** skills only (0–100) → the energy/competency bar */
  energy?: number;
  /** projects: impact metric (shown in lime in the card) */
  metric?: string;
  /** projects: the problem the work solved (case-study "problem" line) */
  problem?: string;
  /** experience: employer / school */
  org?: string;
  /** related labels → footer "connected nodes" chips */
  connections?: string[];
  /** projects: Code / Demo actions */
  links?: { label: string; href: string }[];
};

export type PipeLayer = {
  index: 0 | 1 | 2 | 3 | 4;
  /** column header above the group (mono uppercase) */
  moniker: string;
  /** short heading for the mobile / a11y list */
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
    nodes: [
      {
        id: "p-distributed",
        label: "Distributed systems",
        kind: "passion",
        description: "Designing for scale from day one.",
        connections: ["Apache Spark", "Apache Airflow"],
      },
      {
        id: "p-prod",
        label: "Models in production",
        kind: "passion",
        description: "Where ML earns its keep.",
        connections: ["PyTorch", "Real-time NLP Pipeline"],
      },
      {
        id: "p-reliability",
        label: "Data reliability",
        kind: "passion",
        description: "Pipelines you can trust at 3am.",
        connections: ["PostgreSQL", "Apache Airflow"],
      },
      {
        id: "p-latency",
        label: "Low-latency inference",
        kind: "passion",
        description: "Fast answers, every time.",
        connections: ["PyTorch", "Models in production"],
      },
    ],
  },
  {
    index: 1,
    moniker: "LAYER 2: TRANSFORMATION (CORE SKILLS)",
    short: "Transformation · Core Skills",
    kind: "skill",
    nodes: [
      {
        id: "python",
        label: "Python",
        kind: "skill",
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
        kind: "skill",
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
        kind: "skill",
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
        kind: "skill",
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
        kind: "skill",
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
        kind: "skill",
        icon: "pytorch",
        expertise: "GROWING",
        date: "Since 2023",
        description: "Training and fine-tuning models.",
        energy: 78,
        connections: ["Hugging Face", "Python"],
      },
    ],
  },
  {
    index: 2,
    moniker: "LAYER 3: OUTPUTS (PROJECTS)",
    short: "Outputs · Projects",
    kind: "project",
    nodes: [
      {
        id: "nlp",
        label: "Real-time NLP Pipeline",
        kind: "project",
        date: "2024",
        problem: "Support tickets piled up faster than anyone could route them by hand.",
        description:
          "Streaming text classification that tags and routes every message in production.",
        metric: "10M+ rows/day · latency −40%",
        connections: ["Apache Spark", "Kafka", "PyTorch"],
        links: [
          { label: "Code", href: "#" },
          { label: "Demo", href: "#" },
        ],
      },
      {
        // Drafted case study — replace name + numbers in ‹› with real values.
        id: "proj2",
        label: "Feature Store & Serving",
        kind: "project",
        date: "2024",
        problem:
          "Models trained on features that had already drifted from what production served.",
        description:
          "Point-in-time feature store with online and offline parity.",
        metric: "train/serve skew → 0 · p99 ‹<50ms›",
        connections: ["Feast", "Redis", "dbt"],
        links: [
          { label: "Code", href: "#" },
          { label: "Demo", href: "#" },
        ],
      },
      {
        // Drafted case study — replace name + numbers in ‹› with real values.
        id: "proj3",
        label: "Model Serving Gateway",
        kind: "project",
        date: "2023",
        problem:
          "Every model shipped its own bespoke API, with no shared auth or rollout control.",
        description:
          "One inference gateway: dynamic batching, canary rollout, token auth.",
        metric: "throughput ‹+3×› · cost/req ‹−45%›",
        connections: ["FastAPI", "Triton", "Kubernetes"],
        links: [
          { label: "Code", href: "#" },
          { label: "Demo", href: "#" },
        ],
      },
    ],
  },
  {
    index: 3,
    moniker: "LAYER 4: DEPLOYMENT (EXPERIENCE)",
    short: "Deployment · Experience",
    kind: "experience",
    nodes: [
      {
        id: "exp-de",
        label: "Data Engineer",
        kind: "experience",
        org: "‹company›",
        date: "2023 – present",
        description: "Building scalable data infrastructure.",
        bullets: [
          "Build and operate batch + streaming pipelines moving ‹N›M+ rows/day.",
          "Cut p95 pipeline latency ‹−40%› by reworking the Spark / Airflow DAGs.",
          "Own data reliability: ‹N›+ production DAGs, on-call, ‹SLA›% freshness.",
        ],
        connections: ["Apache Spark", "Apache Airflow", "AWS"],
      },
      {
        id: "exp-intern",
        label: "ML Engineer Intern",
        kind: "experience",
        org: "‹company›",
        date: "2022",
        description: "Shipped ML features end to end.",
        bullets: [
          "Shipped ‹feature› end to end: data prep, training, and serving.",
          "Added ‹eval / monitoring› that caught ‹issue› before release.",
        ],
        connections: ["PyTorch", "Python"],
      },
      {
        id: "exp-ms",
        label: "MS, Data Science",
        kind: "experience",
        org: "George Washington University",
        date: "2021 – 2023",
        description: "Master of Science.",
        bullets: [
          "Focus: ‹distributed systems / ML / NLP›.",
          "Capstone: ‹project› — ‹result / metric›.",
        ],
        connections: ["Python", "PyTorch"],
      },
    ],
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
