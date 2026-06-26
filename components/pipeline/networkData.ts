/**
 * Pipeline adapter — maps data/ content entries into PipeLayer/PipeNode shapes
 * for the canvas renderer and hover detail card. Never edit this file to change
 * content; edit the relevant data/ file instead.
 */

import { projects, experience, skills, passions } from "@/data";

export type NodeKind = "passion" | "skill" | "project" | "experience" | "result";

export type PipeNode = {
  id: string;
  label: string;
  kind: NodeKind;
  icon?: string;
  expertise?: string;
  date?: string;
  description?: string;
  bullets?: string[];
  energy?: number;
  metric?: string;
  problem?: string;
  org?: string;
  connections?: string[];
  links?: { label: string; href: string }[];
};

export type PipeLayer = {
  index: 0 | 1 | 2 | 3 | 4;
  moniker: string;
  short: string;
  kind: NodeKind;
  nodes: PipeNode[];
};

export const LAYERS: PipeLayer[] = [
  {
    index: 0,
    moniker: "LAYER 1: INPUTS (PASSIONS)",
    short: "Inputs · Passions",
    kind: "passion",
    nodes: passions.map((p) => ({
      id: p.id,
      label: p.label,
      kind: "passion" as NodeKind,
      description: p.description,
      connections: p.connections,
    })),
  },
  {
    index: 1,
    moniker: "LAYER 2: TRANSFORMATION (CORE SKILLS)",
    short: "Transformation · Core Skills",
    kind: "skill",
    nodes: skills.map((s) => ({
      id: s.id,
      label: s.label,
      kind: "skill" as NodeKind,
      icon: s.icon,
      expertise: s.expertise,
      date: s.date,
      description: s.description,
      energy: s.energy,
      connections: s.connections,
    })),
  },
  {
    index: 2,
    moniker: "LAYER 3: OUTPUTS (PROJECTS)",
    short: "Outputs · Projects",
    kind: "project",
    nodes: projects.map((p) => ({
      id: p.id,
      label: p.title,
      kind: "project" as NodeKind,
      date: p.date,
      problem: p.problem,
      description: p.description,
      metric: p.metric,
      connections: p.tech,
      links: p.links,
    })),
  },
  {
    index: 3,
    moniker: "LAYER 4: DEPLOYMENT (EXPERIENCE)",
    short: "Deployment · Experience",
    kind: "experience",
    nodes: experience.map((e) => ({
      id: e.id,
      label: e.role,
      kind: "experience" as NodeKind,
      org: e.org,
      date: e.period,
      description: e.description,
      bullets: e.bullets,
      connections: e.skills,
    })),
  },
  {
    index: 4,
    moniker: "INFERENCE STATUS: READY FOR THE NEXT MISSION",
    short: "Core Result",
    kind: "result",
    nodes: [
      {
        id: "result",
        label: "Ready for the next mission",
        kind: "result",
        description: "Open to AI Systems · Data · Cloud roles.",
      },
    ],
  },
];

/** Node counts per column, left→right. Drives canvas layout + reveal stagger. */
export const LAYER_COUNTS = LAYERS.map((l) => l.nodes.length);

/** Flat list with layer index attached — convenient for canvas geometry + lookups. */
export const ALL_NODES = LAYERS.flatMap((layer) =>
  layer.nodes.map((node) => ({ ...node, layer: layer.index })),
);

/** Find a node by exact label (used to resolve a "connected node" chip → highlight). */
export const nodeByLabel = (label: string) =>
  ALL_NODES.find((n) => n.label.toLowerCase() === label.toLowerCase());
