import {
  Sparkles,
  Cpu,
  Boxes,
  Briefcase,
  Backpack,
  GraduationCap,
  Target,
} from "lucide-react";
import { ICONS } from "./iconData";
import type { NodeKind } from "./networkData";

/**
 * The mark inside a detail-card badge: a real brand logo (simple-icons path data,
 * in its brand color) when the node has a known `icon` slug, otherwise a Lucide
 * glyph chosen by node kind.
 */

const GLYPH: Record<NodeKind, typeof Sparkles> = {
  passion: Sparkles,
  skill: Cpu,
  project: Boxes,
  experience: Briefcase,
  result: Target,
};

// Per-node glyph overrides (id wins over the kind default), so the experience
// nodes read distinctly — job, internship, schooling — matching the timeline.
const ROLE_GLYPH: Partial<Record<string, typeof Sparkles>> = {
  "exp-capitalone": Briefcase,
  "exp-samsung": Backpack,
  "exp-iquanti": Backpack,
  "edu-gwu": GraduationCap,
  "edu-iit": GraduationCap,
};

export function hasBrand(icon?: string) {
  return !!(icon && ICONS[icon]);
}

export default function NodeBadge({
  icon,
  kind,
  id,
  size = 22,
  mono = false,
  glyphClassName = "text-ink",
}: {
  icon?: string;
  kind: NodeKind;
  /** node id — picks a per-node glyph override before falling back to the kind glyph */
  id?: string;
  size?: number;
  /** render the brand mark in currentColor (clean monochrome tokens); off = brand color */
  mono?: boolean;
  glyphClassName?: string;
}) {
  const brand = icon ? ICONS[icon] : undefined;
  if (brand) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        role={mono ? undefined : "img"}
        aria-label={mono ? undefined : brand.title}
        aria-hidden={mono || undefined}
        fill={mono ? "currentColor" : `#${brand.hex}`}
      >
        <path d={brand.path} />
      </svg>
    );
  }
  const Glyph = (id && ROLE_GLYPH[id]) || GLYPH[kind];
  return <Glyph width={size} height={size} aria-hidden className={glyphClassName} />;
}
