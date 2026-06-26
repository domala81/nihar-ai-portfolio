# Centralized Data Layer Design

**Date:** 2026-06-26  
**Status:** Approved

## Context

Portfolio content (projects, skills, experience, personal identity) is scattered across component files. Adding a new project means editing `networkData.ts` with pipeline-specific types (`NodeKind`, `layerIdx`, `PipeNode` shape) — error-prone and unintuitive. Personal details (name, email, socials) are duplicated across `Hero.tsx`, `ContactSection.tsx`, and `SiteFooter.tsx`.

Goal: one obvious place per content type. Adding a project = add one plain object to `data/projects.ts`. Everything else updates automatically.

## Architecture

New `data/` folder at repo root. Plain TypeScript — no framework dependency, zero runtime cost, compiled away at build time (compatible with Vercel/Netlify free tier).

```
data/
  personal.ts     ← identity (name, email, socials, tagline, location, resume)
  projects.ts     ← ProjectEntry[]
  experience.ts   ← ExperienceEntry[]
  skills.ts       ← SkillEntry[] + PassionEntry[]
  index.ts        ← barrel re-export
```

`networkData.ts` becomes an **adapter**: imports from `data/`, maps plain entries → `PipeLayer[]` with pipeline-specific fields (`kind`, `layerIdx`). Animation/layout properties (`x`, `y`, `radius`, `energy`) remain computed at runtime in `NeuralPipeline.tsx` — untouched.

## Data Shapes

```ts
// data/personal.ts
export const personal = {
  name: 'Nihar Domala',
  location: 'Washington, DC',
  tagline: 'AI Systems · Data Engineering · Cloud',
  status: 'Open to AI Systems Engineering roles',
  email: 'ndomala81@gmail.com',
  resume: '/resume.pdf',
  socials: { github: 'https://...', linkedin: 'https://...' },
} as const;

// data/projects.ts
export type ProjectEntry = {
  id: string;
  title: string;
  description: string;
  metric: string;
  tech: string[];
  links: { github?: string; demo?: string };
};
export const projects: ProjectEntry[] = [];

// data/experience.ts
export type ExperienceEntry = {
  id: string;
  role: string;
  org: string;
  period: string;
  bullets: string[];
  skills: string[];  // keys matching iconData
};
export const experience: ExperienceEntry[] = [];

// data/skills.ts
export type SkillEntry = { id: string; label: string; level: number; icon: string; };
export type PassionEntry = { id: string; label: string; };
export const skills: SkillEntry[] = [];
export const passions: PassionEntry[] = [];
```

## Component Changes

| Component | Was | Now |
|---|---|---|
| `Hero.tsx` | hardcoded name, tagline, location, socials, resume | `import { personal } from '@/data'` |
| `ContactSection.tsx` | `EMAIL` const + `CHANNELS` array | `import { personal } from '@/data'` |
| `SiteFooter.tsx` | hardcoded name, year | `import { personal } from '@/data'` |
| `OrbitalProjects.tsx` | `LAYERS[2].nodes` from networkData | `import { projects } from '@/data'` |
| `ExperienceTimeline.tsx` | `LAYERS[3].nodes` from networkData | `import { experience } from '@/data'` |
| `networkData.ts` | hardcodes all 5 layers | adapter: maps data/ → PipeLayer[] |

### networkData.ts adapter pattern

```ts
import { projects, experience, skills, passions } from '@/data';

const projectsLayer: PipeLayer = {
  label: 'Outputs',
  nodes: projects.map((p) => ({
    id: p.id,
    kind: 'project' as NodeKind,
    layerIdx: 2,
    label: p.title,
    detail: p.description,
    metric: p.metric,
  })),
};
// same pattern for experience (layerIdx 3), skills (layerIdx 1), passions (layerIdx 0)
```

## Files Modified

- **New:** `data/personal.ts`, `data/projects.ts`, `data/experience.ts`, `data/skills.ts`, `data/index.ts`
- **Refactored:** `components/pipeline/networkData.ts` (adapter pattern)
- **Updated imports:** `Hero.tsx`, `ContactSection.tsx`, `SiteFooter.tsx`, `OrbitalProjects.tsx`, `ExperienceTimeline.tsx`
- **Unchanged:** `NeuralPipeline.tsx`, `iconData.ts`, all animation/canvas logic

## Adding Content After This

- **New project:** add `ProjectEntry` to `data/projects.ts` + one-line icon mapping in `OrbitalProjects.tsx`
- **New skill:** add `SkillEntry` to `data/skills.ts`
- **New role:** add `ExperienceEntry` to `data/experience.ts`
- **Update personal info:** edit `data/personal.ts` — reflects in Hero, Contact, Footer instantly

## Verification

1. `npm run build` — TypeScript catches shape mismatches at compile time
2. `npm run dev` — visually verify each section: Hero, pipeline columns, orbital, timeline, contact
3. Smoke test: add dummy project to `data/projects.ts`, confirm it appears in pipeline column 3 and orbital without other changes, then remove it
