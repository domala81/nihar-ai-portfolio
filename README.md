# nihar.dev

Personal portfolio for [Nihar Domala](https://www.linkedin.com/in/nihar-domala/) — Data Engineer transitioning into AI Systems Engineering.

The signature feature is an interactive neural-network visualization: passions flow as inputs through an engineering stack into shipped projects, all rendered on a single HTML5 Canvas with DOM nodes riding above it for smooth interaction.

---

## Stack

- **Next.js 14** (App Router)
- **TypeScript + Tailwind CSS**
- **GSAP** — canvas animation loop + ScrollTrigger
- **Framer Motion** — DOM overlays, cards, orbit, timeline

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

Content lives in `data/` — edit there to update anything on the page. Components read from it; nothing is hardcoded in UI files.

```
data/           ← edit here (projects, experience, skills, personal info)
components/     ← pipeline, projects orbit, timeline, contact, footer
app/            ← Next.js entry (page.tsx, layout.tsx, globals.css)
```

See `CLAUDE.md` for the full folder map and architecture constraints.

## Contact

[ndomala81@gmail.com](mailto:ndomala81@gmail.com) · [github.com/domala81](https://github.com/domala81)
