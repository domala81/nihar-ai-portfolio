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
