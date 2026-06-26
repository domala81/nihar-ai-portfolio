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
