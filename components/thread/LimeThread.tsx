"use client";

import { useScroll, useTransform, motion, useReducedMotion } from "framer-motion";

/**
 * PROTOTYPE — the lime "me" node threading the whole page.
 *
 * One lime node (position: fixed) whose viewport position is driven by page scroll
 * progress, weaving to roughly land on each section's anchor as you scroll: the
 * network's result node (right), the projects orbit center (left), the experience
 * head, the contact node. Stops are approximate for now — when hardened they'd be
 * locked to the live anchor positions (getBoundingClientRect) instead of fixed
 * vw/vh. Hidden under prefers-reduced-motion and below lg.
 */

// scroll-progress stops ≈ each section framed (measured: pipeline ~0.19, projects
// ~0.59, experience ~0.83, contact ~1.0; network result sits a bit below pipeline center).
const P = [0, 0.15, 0.3, 0.588, 0.834, 0.97, 1];

export default function LimeThread() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // weave horizontally toward each anchor
  const left = useTransform(scrollYProgress, P, [
    "78vw",
    "78vw",
    "78vw",
    "24vw",
    "28vw",
    "38vw",
    "38vw",
  ]);
  // and vertically (network/projects centered; experience head sits higher)
  const top = useTransform(scrollYProgress, P, [
    "50vh",
    "50vh",
    "50vh",
    "50vh",
    "38vh",
    "52vh",
    "52vh",
  ]);
  // fade in as we leave the hero
  const opacity = useTransform(scrollYProgress, P, [0, 0, 1, 1, 1, 1, 1]);

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      style={{ left, top, opacity }}
      className="pointer-events-none fixed z-30 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        <span className="absolute -inset-3 rounded-full bg-live/25 blur-lg" />
        <span className="absolute inset-0 animate-ping rounded-full bg-live/30" />
        <span className="relative h-4 w-4 rounded-full bg-live shadow-[0_0_18px_5px_rgba(204,255,0,0.55)]" />
      </span>
    </motion.div>
  );
}
