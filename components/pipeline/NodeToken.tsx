"use client";

import { motion, type Variants } from "framer-motion";
import NodeBadge from "./NodeBadge";
import type { PipeNode } from "./networkData";

/**
 * A single neuron, rendered as a flat circular DOM token (not a canvas sphere) so the
 * brand logo renders crisply and every state change is a smooth, eased framer
 * transition. Four states: rest → active (pop: scale + fill + glow) → related
 * (gentle pulse) → dimmed. The result node uses the lime `isCore` palette.
 *
 * A real <button>: hover or keyboard focus opens the detail card, Escape closes.
 * The full text content also lives in the PipelineContent sr-only list.
 */

export type TokenState = "rest" | "active" | "related" | "dimmed";

const SPRING = { type: "spring", stiffness: 320, damping: 26, mass: 0.7 } as const;

const COBALT: Variants = {
  rest: {
    scale: 1,
    opacity: 1,
    backgroundColor: "rgba(11,15,23,0.92)",
    borderColor: "rgba(255,255,255,0.16)",
    boxShadow: "0 0 0 0 rgba(59,130,246,0)",
    color: "rgba(156,163,175,0.92)",
  },
  active: {
    scale: 1.32,
    opacity: 1,
    backgroundColor: "rgba(30,58,138,0.5)",
    borderColor: "rgba(59,130,246,0.95)",
    boxShadow: "0 0 26px 3px rgba(59,130,246,0.4)",
    color: "rgba(237,239,242,1)",
  },
  related: {
    scale: 1.08,
    opacity: 1,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderColor: "rgba(59,130,246,0.75)",
    boxShadow: "0 0 16px 0 rgba(59,130,246,0.22)",
    color: "rgba(237,239,242,0.95)",
  },
  dimmed: {
    scale: 0.97,
    opacity: 0.34,
    backgroundColor: "rgba(11,15,23,0.9)",
    borderColor: "rgba(255,255,255,0.08)",
    boxShadow: "0 0 0 0 rgba(59,130,246,0)",
    color: "rgba(156,163,175,0.5)",
  },
  demo: {
    scale: 1.13,
    opacity: 1,
    backgroundColor: "rgba(30,58,138,0.34)",
    borderColor: "rgba(59,130,246,0.7)",
    boxShadow: "0 0 18px 1px rgba(59,130,246,0.28)",
    color: "rgba(237,239,242,0.98)",
  },
};

const LIME: Variants = {
  rest: {
    scale: 1,
    opacity: 1,
    backgroundColor: "rgba(204,255,0,0.1)",
    borderColor: "rgba(204,255,0,0.55)",
    boxShadow: "0 0 18px 0 rgba(204,255,0,0.22)",
    color: "rgba(204,255,0,0.95)",
  },
  active: {
    scale: 1.2,
    opacity: 1,
    backgroundColor: "rgba(204,255,0,0.2)",
    borderColor: "rgba(204,255,0,1)",
    boxShadow: "0 0 32px 5px rgba(204,255,0,0.4)",
    color: "rgba(204,255,0,1)",
  },
  related: {
    scale: 1.06,
    opacity: 1,
    backgroundColor: "rgba(204,255,0,0.13)",
    borderColor: "rgba(204,255,0,0.7)",
    boxShadow: "0 0 20px 0 rgba(204,255,0,0.3)",
    color: "rgba(204,255,0,1)",
  },
  dimmed: {
    scale: 1,
    opacity: 0.5,
    backgroundColor: "rgba(204,255,0,0.06)",
    borderColor: "rgba(204,255,0,0.3)",
    boxShadow: "0 0 10px 0 rgba(204,255,0,0.12)",
    color: "rgba(204,255,0,0.6)",
  },
  demo: {
    scale: 1.1,
    opacity: 1,
    backgroundColor: "rgba(204,255,0,0.16)",
    borderColor: "rgba(204,255,0,0.85)",
    boxShadow: "0 0 22px 2px rgba(204,255,0,0.32)",
    color: "rgba(204,255,0,1)",
  },
};

export default function NodeToken({
  node,
  size,
  state,
  isCore = false,
  reduce = false,
  demo = false,
  onHoverStart,
  onHoverEnd,
  onClick,
}: {
  node: PipeNode;
  size: number;
  state: TokenState;
  isCore?: boolean;
  reduce?: boolean;
  /** ambient "look here" demo (gentle highlight + pulse), only when at rest */
  demo?: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick?: () => void;
}) {
  const showDemo = demo && state === "rest";
  return (
    <motion.button
      type="button"
      aria-label={`${node.label} — show details`}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onHoverEnd();
          e.currentTarget.blur();
        }
      }}
      initial={false}
      animate={showDemo ? "demo" : state}
      variants={isCore ? LIME : COBALT}
      transition={reduce ? { duration: 0 } : SPRING}
      style={{ width: size, height: size, borderWidth: 1.5 }}
      className="relative flex cursor-pointer items-center justify-center rounded-full border p-0"
    >
      <NodeBadge
        icon={node.icon}
        kind={node.kind}
        id={node.id}
        size={Math.round(size * (isCore ? 0.4 : 0.46))}
        mono
        glyphClassName=""
      />
      {/* Related / demo pulse ring */}
      {(state === "related" || showDemo) && !reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-[-2px] rounded-full border"
          style={{ borderColor: isCore ? "rgba(204,255,0,0.6)" : "rgba(59,130,246,0.6)" }}
          initial={{ opacity: 0.55, scale: 1 }}
          animate={{ opacity: 0, scale: 1.55 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
      )}
    </motion.button>
  );
}
