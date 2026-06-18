"use client";

import { motion } from "framer-motion";
import { Zap, Link2, Github, ExternalLink } from "lucide-react";
import NodeBadge, { hasBrand } from "./NodeBadge";
import type { PipeNode } from "./networkData";

/**
 * The glassmorphic floating detail card (the one sanctioned glass + soft shadow in
 * the system — the user asked for it explicitly). Content adapts to node kind:
 * skills get the full treatment (brand logo, EXPERTISE pill, date, description,
 * energy bar, connected chips); projects show an impact metric + Code/Demo; passions
 * and experience show a short description (+ org/dates); the result node is a status.
 *
 * Positioning is owned by the parent (an absolute wrapper); this is just the animated
 * card, so Framer's transform never fights a positioning transform. `onPointerEnter`
 * / `onPointerLeave` feed the parent's hover-intent so chips/links stay reachable.
 */

type Props = {
  node: PipeNode;
  onChipClick?: (label: string) => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
};

export default function DetailCard({ node, onChipClick, onPointerEnter, onPointerLeave }: Props) {
  const brand = hasBrand(node.icon);
  const isResult = node.kind === "result";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 8 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="pointer-events-auto relative w-[280px] rounded-xl border border-border-soft bg-surface/80 p-5 pt-7 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.78)] backdrop-blur-md"
    >
      {/* Circular badge, overlapping the top edge */}
      <div
        className={`absolute -top-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border ${
          brand ? "border-white/15 bg-white" : "border-border-soft bg-surface"
        }`}
      >
        <NodeBadge
          icon={node.icon}
          kind={node.kind}
          id={node.id}
          size={brand ? 22 : 20}
          glyphClassName={isResult ? "text-live" : "text-ink"}
        />
      </div>

      {/* Expertise pill + date */}
      {(node.expertise || node.date) && (
        <div className="mb-2 flex items-center justify-between gap-2">
          {node.expertise ? (
            <span className="rounded-sm border border-border-soft px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              Expertise: {node.expertise}
            </span>
          ) : (
            <span />
          )}
          {node.date && <span className="font-mono text-[11px] text-ink-muted">{node.date}</span>}
        </div>
      )}

      <h3 className="text-balance font-sans text-base font-semibold tracking-tightish text-ink">
        {node.label}
      </h3>
      {node.org && <p className="mt-0.5 font-mono text-[11px] text-ink-muted">{node.org}</p>}
      {node.description && (
        <p className="mt-2 text-pretty text-sm leading-relaxed text-ink-muted">{node.description}</p>
      )}
      {node.metric && <p className="mt-3 font-mono text-[13px] text-live">{node.metric}</p>}

      {/* Energy / competency bar (skills) */}
      {typeof node.energy === "number" && (
        <div className="mt-4 border-t border-hairline pt-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
              <Zap className="h-3 w-3 text-infra" aria-hidden /> Energy level
            </span>
            <span className="font-mono text-[11px] text-ink">{node.energy}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-hairline">
            <div className="h-full rounded-full bg-infra" style={{ width: `${node.energy}%` }} />
          </div>
        </div>
      )}

      {/* Connected nodes chips */}
      {node.connections && node.connections.length > 0 && (
        <div className="mt-4 border-t border-hairline pt-3">
          <p className="mb-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            <Link2 className="h-3 w-3" aria-hidden /> Connected nodes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {node.connections.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onChipClick?.(c)}
                className="group inline-flex items-center gap-1 rounded-sm border border-border-soft bg-surface px-2 py-1 font-mono text-[11px] text-ink-muted transition-colors hover:border-infra hover:text-ink"
              >
                {c}
                <span className="text-infra transition-transform group-hover:translate-x-0.5" aria-hidden>
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Project links */}
      {node.links && node.links.length > 0 && (
        <div className="mt-4 flex gap-2">
          {node.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-md border border-border-soft px-3 py-1.5 font-mono text-[11px] text-ink transition-colors hover:border-infra"
            >
              {l.label === "Code" ? (
                <Github className="h-3 w-3" aria-hidden />
              ) : (
                <ExternalLink className="h-3 w-3" aria-hidden />
              )}
              {l.label}
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}
