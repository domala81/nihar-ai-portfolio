// data/personal.ts
export const personal = {
  name: "Nihar Domala",
  location: "Washington, DC",
  tagline: "AI Systems · Data Engineering · Cloud",
  /** Hero status pill text */
  statusPill: "Accepting Missions",
  /** Contact section prose + Hero location bar */
  statusFull: "Open to AI Systems Engineering roles",
  email: "ndomala81@gmail.com",
  resume: "/resume.pdf",
  socials: {
    github: {
      href: "https://github.com/domala81",
      /** Short display string used in the terminal channel listing */
      display: "/domala81",
    },
    linkedin: {
      href: "https://www.linkedin.com/in/nihar-domala/",
      display: "/in/nihar-domala",
    },
  },
} as const;
