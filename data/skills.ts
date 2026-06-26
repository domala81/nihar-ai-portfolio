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
    id: "p-programming",
    label: "Programming",
    description: "Clean code across the stack.",
    connections: ["Python", "Apache Spark"],
  },
  {
    id: "p-maths",
    label: "Maths & Stats",
    description: "The theory under every model.",
    connections: ["PyTorch", "Python"],
  },
  {
    id: "p-automation",
    label: "Automation",
    description: "Pipelines that run themselves.",
    connections: ["Apache Airflow", "Python"],
  },
  {
    id: "p-problem-solving",
    label: "Problem Solving",
    description: "Breaking hard things into steps.",
    connections: ["Python", "PyTorch"],
  },
];

export const skills: SkillEntry[] = [
  {
    id: "python",
    label: "Python",
    icon: "python",
    expertise: "CORE",
    date: "Since 2019",
    description: "Primary language across data, ML and tooling.",
    energy: 95,
    connections: ["Apache Spark", "PyTorch", "AWS"],
  },
  {
    id: "spark",
    label: "Apache Spark",
    icon: "apachespark",
    expertise: "CORE",
    date: "Since 2023",
    description: "Distributed processing of billions of records.",
    energy: 92,
    connections: ["Databricks", "AWS", "Python"],
  },
  {
    id: "aws",
    label: "AWS",
    icon: "", // no AWS brand mark in simple-icons (trademark) — falls back to kind glyph
    expertise: "CORE",
    date: "Since 2023",
    description: "Glue, Lambda, Step Functions, S3 and more.",
    energy: 90,
    connections: ["Apache Spark", "Terraform", "CloudMart"],
  },
  {
    id: "databricks",
    label: "Databricks",
    icon: "databricks",
    expertise: "HIGH",
    date: "Since 2023",
    description: "Delta Lake transforms and schema validation.",
    energy: 85,
    connections: ["Apache Spark", "Snowflake"],
  },
  {
    id: "airflow",
    label: "Apache Airflow",
    icon: "apacheairflow",
    expertise: "HIGH",
    date: "Since 2023",
    description: "Orchestrating production data pipelines.",
    energy: 82,
    connections: ["Python", "Apache Spark"],
  },
  {
    id: "pytorch",
    label: "PyTorch",
    icon: "pytorch",
    expertise: "HIGH",
    date: "Since 2021",
    description: "Training and fine-tuning deep models.",
    energy: 84,
    connections: ["Python", "VisionVoice"],
  },
  {
    id: "snowflake",
    label: "Snowflake",
    icon: "snowflake",
    expertise: "GROWING",
    date: "Since 2024",
    description: "Cloud warehouse for analytics at scale.",
    energy: 72,
    connections: ["Databricks", "Apache Spark"],
  },
];
