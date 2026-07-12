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
  /** Card A — "How I got here": the personal arc, childhood → now. */
  bio: [
    "It all started with math puzzles. Long before code, I was the kid who couldn't put a logic problem down. I didn't care about the grade; I just loved the exact moment a messy problem suddenly \"clicked.\" Everything I've done since has been about chasing that feeling on a bigger scale.",
    "Things got serious during my AI studies at IIT Kharagpur. Watching a model pick up on a pattern I hadn't explicitly taught it completely hooked me. I soon realized you can't build smart systems without clean data, so I dove into data engineering to learn how to tame the chaos first.",
    "By day, I handle the heavy lifting - moving billions of records through rock-solid data pipelines. The rest of the time, I build with AI. Whether it's agents, local models, or RAG systems, I focus on the moment a project stops being just a cool demo and starts solving real-world problems.",
    "Where I'm headed: I want to own AI systems end-to-end, taking them all the way from raw, messy data to finished models delivering real value in production.",
    "P.S. Unlike a lot of engineers, I actually enjoy small talk - let's chat!",
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
