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
  /** Dim lead-in shown before the keyword in the column label, e.g. "Layer 1 · Inputs" */
  prefix: string;
  /** Bright accent word(s) — the focal part of the column label, e.g. "Passions" */
  keyword: string;
  short: string;
  kind: NodeKind;
  nodes: PipeNode[];
};

export const LAYERS: PipeLayer[] = [
  {
    index: 0,
    moniker: "LAYER 1: INPUTS (PASSIONS)",
    prefix: "Layer 1 · Inputs",
    keyword: "Passions",
    short: "What drives me",
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
    prefix: "Layer 2 · Transformation",
    keyword: "Core Skills",
    short: "What I'm good at",
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
    prefix: "Layer 3 · Outputs",
    keyword: "Projects",
    short: "What I've shipped",
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
    prefix: "Layer 4 · Deployment",
    keyword: "Experience",
    short: "Where I've worked",
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
    prefix: "Inference Status",
    keyword: "Ready for the next mission",
    short: "Where this is going",
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

/** Chip labels that should resolve to a node with a different display label. */
const ALIAS: Record<string, string> = {
  pyspark: "apache spark",
  "aws glue": "aws",
  "aws lambda": "aws",
};

const norm = (label: string) => {
  const l = label.trim().toLowerCase();
  return ALIAS[l] ?? l;
};

/** Find a node by label (alias-aware — resolves a "connected node" chip → highlight). */
export const nodeByLabel = (label: string) =>
  ALL_NODES.find((n) => n.label.toLowerCase() === norm(label));

/**
 * The synapse graph — REAL relationships only, not all-to-all.
 * Edges come from the data/ `connections`/`tech`/`skills` label lists (either
 * endpoint may list the other), restricted to adjacent columns, plus:
 *  - skill→experience "skip" synapses for roles whose stack isn't told through a
 *    project (Capital One's data stack, the two internships);
 *  - explicit structural links: which chapter each project belongs to, and the
 *    convergence of every deployment (and the job-hunt project) onto the result.
 */
const SKILL_SKIP_OK = new Set(["exp-capitalone", "exp-samsung", "exp-iquanti"]);

const EXTRA_LINKS: [string, string][] = [
  ["cloudmart", "exp-capitalone"],
  ["visionvoice", "edu-gwu"],
  ["cnn-pooling", "edu-iit"],
  ["resume-autopilot", "result"],
  ["exp-capitalone", "result"],
  ["exp-samsung", "result"],
  ["exp-iquanti", "result"],
  ["edu-gwu", "result"],
  ["edu-iit", "result"],
];

function buildSynapses(): [number, number][] {
  const idx = new Map(ALL_NODES.map((n, i) => [n.id, i]));
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  // [a, b] with a in the lower column — packets with dir 1 flow left→right.
  const push = (a: number, b: number) => {
    const key = `${a}-${b}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push([a, b]);
  };

  for (let i = 0; i < ALL_NODES.length; i++) {
    for (let j = i + 1; j < ALL_NODES.length; j++) {
      const A = ALL_NODES[i];
      const B = ALL_NODES[j];
      if (A.layer === B.layer) continue;
      const [L, R] = A.layer < B.layer ? [A, B] : [B, A];
      const lists = (x: typeof L, y: typeof R) =>
        (x.connections ?? []).some((c) => norm(c) === norm(y.label));
      if (!lists(L, R) && !lists(R, L)) continue;
      const gap = R.layer - L.layer;
      const skipOk =
        gap === 2 && L.kind === "skill" && R.kind === "experience" && SKILL_SKIP_OK.has(R.id);
      if (gap !== 1 && !skipOk) continue;
      push(idx.get(L.id)!, idx.get(R.id)!);
    }
  }

  for (const [a, b] of EXTRA_LINKS) {
    const ia = idx.get(a);
    const ib = idx.get(b);
    if (ia === undefined || ib === undefined) continue;
    if (ALL_NODES[ia].layer <= ALL_NODES[ib].layer) push(ia, ib);
    else push(ib, ia);
  }

  return edges;
}

export const SYNAPSES: [number, number][] = buildSynapses();

/** id → ids it shares a synapse with (drives the hover "related" token state). */
export const NEIGHBORS: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {};
  for (const [a, b] of SYNAPSES) {
    (map[ALL_NODES[a].id] ??= []).push(ALL_NODES[b].id);
    (map[ALL_NODES[b].id] ??= []).push(ALL_NODES[a].id);
  }
  return map;
})();
