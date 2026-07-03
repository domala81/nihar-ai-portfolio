// data/modelCard.ts — the "About" section, written as a model card.

export type ModelCardSection = {
  id: string;
  /** Mono section label, HF-model-card grammar */
  heading: string;
  /** One paragraph, or bullet lines */
  lines: string[];
};

export const modelCard = {
  /** Terminal-style filename shown in the card header */
  filename: "nihar.model_card.md",
  version: "v27",
  summary:
    "Human-scale system trained on data engineering, fine-tuned for AI systems. Ships pipelines by day, reads model papers by night.",
  sections: [
    {
      id: "architecture",
      heading: "Architecture",
      lines: [
        "Data Engineer → AI Systems Engineer. Distributed-systems backbone (Spark, Airflow, AWS) with a deep-learning head (PyTorch). Single attention head; long context window for hard problems.",
      ],
    },
    {
      id: "training-data",
      heading: "Training data",
      lines: [
        "Pre-trained at IIT Kharagpur (BTech, AI micro-specialization).",
        "Fine-tuned at The George Washington University (MS Data Science, GPA 3.97/4.0).",
        "Reinforced in production: 4.2B+ records/day on enterprise AWS at Capital One.",
      ],
    },
    {
      id: "benchmarks",
      heading: "Benchmarks",
      lines: [
        "IEEE INDICON 2023 — MV Chauhan Best Paper Award.",
        "GWU Datathon 2024 — 1st place.",
        "Global Leaders Award — $17,000 fellowship for academic excellence.",
      ],
    },
    {
      id: "intended-use",
      heading: "Intended use",
      lines: [
        "AI systems engineering, data platforms, cloud infrastructure. Performs best on ambiguous, unsolved problems with real production stakes.",
      ],
    },
    {
      id: "limitations",
      heading: "Known limitations",
      lines: [
        "Cannot stop refactoring pipelines that already work.",
        "Occasionally overfits to whatever paper was published last week.",
        "Will explain Medallion architecture without being asked.",
      ],
    },
  ] satisfies ModelCardSection[],
} as const;
