// data/about.ts — the "Operator File" section (about me, dossier-style).

export type HobbyEntry = {
  id: string;
  label: string;
  /** the one-liner typed into the caption slot (user's own words) */
  tagline: string;
};

export type VitalEntry = {
  id: string;
  label: string;
  /** self-reported %; may exceed 100 for effect (ring fill caps at full) */
  value: number;
  /** the one lime ring — at most one per the One Live Signal Rule */
  live?: boolean;
};

export const about = {
  photo: {
    src: "/operator.jpg",
    alt: "Portrait of Nihar Domala",
    ready: true,
  },
  /** Card A — runtime environment: the personal arc, childhood → now. */
  bio: [
    "It started with maths. Kid me chased logic puzzles for fun; the slow untangling of a hard problem was the game long before code showed up.",
    "An AI micro-specialization at IIT Kharagpur turned that pull into a direction, and data science became the obvious road: maths, computing, and messy real-world problems in one job.",
    "Now I live on the bridge between heavy data engineering and applied AI. By day I move billions of records through pipelines nobody should ever have to think about; the rest of the time I chase ideas that ship, especially where AI quietly makes someone's day easier.",
    "And unlike a lot of engineers, I actually enjoy small talk. The contact node below is not decorative.",
  ],
  /**
   * Operator vitals beside the bio — self-reported personality metrics
   * rendered as fitness-style rings that sweep from zero on scroll-in.
   */
  vitals: [
    { id: "caffeine", label: "caffeine", value: 40 },
    { id: "fitness", label: "fitness", value: 65 },
    { id: "sleep", label: "sleep", value: 75 },
    { id: "curiosity", label: "curiosity", value: 200, live: true },
  ] satisfies VitalEntry[],
  /** The compact hobbies strip (taglines in the operator's own words) */
  hobbies: [
    {
      id: "trekking",
      label: "Trekking",
      tagline: "Nothing debugs the brain like a mountain trail.",
    },
    {
      id: "badminton",
      label: "Badminton",
      tagline: "My reflexes are better on the court than in code review.",
    },
    {
      id: "pingpong",
      label: "Ping pong",
      tagline: "The fastest feedback loop I know.",
    },
    {
      id: "gym",
      label: "Gym",
      tagline: "Consistency is a lifestyle, not just a CI/CD principle.",
    },
  ] satisfies HobbyEntry[],
  /** The sandbox ticker */
  exploring: [
    "Claude Code & agentic workflows",
    "MCP servers & tool-building",
    "local LLMs (Ollama)",
    "RAG experiments",
  ],
} as const;
