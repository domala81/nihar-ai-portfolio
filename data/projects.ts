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
    id: "resume-autopilot",
    title: "Resume Autopilot",
    date: "2026",
    problem:
      "Tailoring a resume for every application is slow, and naive LLM rewrites hallucinate content or wreck the layout.",
    description:
      "Agentic Claude Code pipeline: a zero-token keyword matcher scores JD↔resume gaps, Claude plans and edits only the content inside an immutable LaTeX template, and deterministic quality gates check metrics, tone and length before compiling the PDF.",
    metric: "keyword match 81% → 94% · one-page, ATS-safe by construction",
    tech: ["Claude Code", "Python", "LaTeX"],
    links: [
      { label: "Code", href: "https://github.com/domala81/resume-autopilot" },
    ],
  },
  {
    id: "cloudmart",
    title: "CloudMart",
    date: "2025",
    problem:
      "An e-commerce platform drowning in support tickets, with sales insight stranded across disconnected clouds.",
    description:
      "MultiCloud AI storefront: AWS (EKS, Bedrock, Terraform, CodePipeline), GCP (BigQuery, Looker Studio) and Azure sentiment, fronted by a Claude Bedrock assistant with RAG-based catalog retrieval.",
    metric: "support cost −90% · real-time sales analytics",
    tech: ["AWS", "Amazon Bedrock", "Terraform", "BigQuery"],
    links: [{ label: "Code", href: "https://github.com/domala81/cloudmart" }],
  },
  {
    id: "visionvoice",
    title: "VisionVoice",
    date: "2024",
    problem:
      "Visually impaired users had no fast way to know what was in an image.",
    description:
      "Image-captioning system pairing a CNN encoder with an RNN decoder (EfficientNet-B3), then speaking each caption aloud via text-to-speech.",
    metric: "images → spoken descriptions, end-to-end",
    tech: ["PyTorch", "Python", "EfficientNet"],
    links: [{ label: "Code", href: "https://github.com/domala81/VisionVoice" }],
  },
  {
    id: "cnn-pooling",
    title: "Bonferroni Mean Pooling in CNNs",
    date: "2023",
    problem:
      "Classical pooling layers throw away information that matters on real medical images.",
    description:
      "Novel Bonferroni mean-based aggregation in the pooling layer, implemented in PyTorch and benchmarked against classical pooling on state-of-the-art CNN architectures.",
    metric: "IEEE INDICON 2023 · MV Chauhan Best Paper",
    tech: ["PyTorch", "Python"],
    links: [
      { label: "Paper", href: "https://doi.org/10.1109/INDICON59947.2023.10440845" },
      { label: "Code", href: "https://github.com/domala81" },
    ],
  },
];
