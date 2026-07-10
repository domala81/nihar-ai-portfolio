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
   * Brand glyphs render for keys in CONNECTION_SLUG in ExperienceTimeline.tsx
   * ("Apache Spark", "PyTorch", "Python", "PostgreSQL", "Snowflake",
   * "Databricks", "Terraform", "TensorFlow", "scikit-learn", "Plotly");
   * "AWS"/cloud labels use a cloud glyph; anything else renders as a plain
   * text chip.
   */
  skills: string[];
};

export const experience: ExperienceEntry[] = [
  {
    id: "exp-capitalone",
    role: "Data Engineer",
    org: "Capital One (Contract) · McLean, USA",
    period: "Jun 2025 – present",
    description: "Enterprise AWS data platform on a Medallion architecture.",
    bullets: [
      "Built a PySpark / AWS Glue pipeline ingesting 4.2B+ daily records into Delta Lake, powering campaigns, ML models and analytics for 14 downstream consumers.",
      "Developed internal Lambda API tooling that automated pipeline config, testing and deployment — cutting engineering effort ~80%.",
      "Diagnosed and resolved 15+ high-severity pipeline incidents via root cause analysis, eliminating recurring SLA breaches.",
    ],
    skills: [
      "PySpark",
      "AWS Glue",
      "Delta Lake",
      "Databricks",
      "SQL",
      "Snowflake",
      "AWS Lambda",
      "Python",
    ],
  },
  {
    id: "exp-samsung",
    role: "Software Development Engineer Intern",
    org: "Samsung R&D Institute · Bangalore, India",
    period: "May 2022 – Jul 2022",
    description: "Data-driven site selection for store installations.",
    bullets: [
      "Trained a K-Means clustering model on 3,000+ location records to surface the top 30% high-data-consumption sites for new store installations.",
      "Benchmarked 4+ clustering algorithms and built real-time Plotly dashboards to guide site selection.",
    ],
    skills: ["Python", "Plotly"],
  },
  {
    id: "exp-iquanti",
    role: "Machine Learning Engineer Intern",
    org: "iQuanti Inc. · Bangalore, India",
    period: "May 2021 – Jul 2021",
    description: "NLP for marketing-funnel search intent.",
    bullets: [
      "Led a team of 3 building NLP preprocessing pipelines (TF-IDF, GloVe, BERT tokenization) over 47,684 imbalanced search queries across 5 intent classes.",
      "Benchmarked Naive Bayes, LSTM and BERT for 5-class intent classification, reaching 96.78% validation accuracy with TensorFlow and scikit-learn.",
    ],
    skills: ["Python", "TensorFlow", "scikit-learn"],
  },
  {
    id: "edu-gwu",
    role: "MS, Data Science",
    org: "The George Washington University · Washington, DC",
    period: "Aug 2023 – May 2025",
    description: "Master of Science · GPA 3.97/4.0.",
    bullets: [
      "Awarded the Global Leaders Award — a $17,000 tuition fellowship for academic excellence.",
      "Secured 1st place at the GWU Datathon 2024 for predictive modeling of hotel booking patterns.",
    ],
    skills: ["Python", "PyTorch"],
  },
  {
    id: "edu-iit",
    role: "BTech, Instrumentation Engineering",
    org: "Indian Institute of Technology, Kharagpur",
    period: "Jul 2019 – May 2023",
    description: "Bachelor of Technology · micro-specialization in AI & Applications.",
    bullets: [
      "Micro-specialization in Artificial Intelligence & Applications alongside the core instrumentation curriculum.",
    ],
    skills: ["Python"],
  },
];
