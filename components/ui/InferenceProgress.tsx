"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Page scroll progress as an "inference progress" hairline pinned to the top:
 * a cobalt fill with a small lime tip riding its leading edge. Decorative
 * (aria-hidden), pointer-events-none, and a plain static fill under reduced
 * motion. A 2px fixed overlay — registers no anchors, so the lime thread's
 * dock math is untouched.
 */

export default function InferenceProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const eased = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const progress = reduce ? scrollYProgress : eased;
  const tipLeft = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px]">
      <motion.div
        className="h-full origin-left bg-infra/60"
        style={{ scaleX: progress }}
      />
      <motion.span
        className="absolute top-1/2 h-[3px] w-4 -translate-y-1/2 rounded-full bg-live/90 shadow-[0_0_8px_1px_rgba(204,255,0,0.55)]"
        style={{ left: tipLeft, x: "-100%" }}
      />
    </div>
  );
}
