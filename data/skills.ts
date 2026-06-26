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
