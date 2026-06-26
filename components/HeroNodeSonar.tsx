"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Target } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { registerAnchor } from "@/components/thread/anchorStore";

const CORE_PX = 64;
const PROXIMITY_PX = 200; // magnetic pull radius
const HOVER_PX = 72;      // visual hover threshold (slightly beyond core edge)
const MAX_PULL = 14;      // max magnetic displacement in px

export default function HeroNodeSonar() {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLButtonElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 180, damping: 18, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 180, damping: 18, mass: 0.6 });

  // Register core button as first lime-thread anchor so the dot starts here.
  useEffect(() => {
    const el = coreRef.current;
    if (el) return registerAnchor("hero", el);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      setHovered(dist < HOVER_PX);

      if (!reduce && dist < PROXIMITY_PX && dist > 0) {
        const strength = (1 - dist / PROXIMITY_PX) * MAX_PULL;
        rawX.set((dx / dist) * strength);
        rawY.set((dy / dist) * strength);
      } else {
        rawX.set(0);
        rawY.set(0);
      }
    };

    const handleMouseLeave = () => {
      setHovered(false);
      rawX.set(0);
      rawY.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [reduce, rawX, rawY]);

  return (
    // overflow-visible so outer ring + hover label display beyond container bounds.
    // x/y spring provides the magnetic pull toward cursor.
    <motion.div
      ref={containerRef}
      className="relative flex items-center justify-center overflow-visible"
      style={{ width: 160, height: 160, x, y }}
    >
      {/* Outer decorative ring */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-live/15 transition-opacity duration-300"
        style={{
          width: 92,
          height: 92,
          opacity: hovered ? 0.3 : 0.15,
        }}
      />

      {/* Soft glow halo */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-3 rounded-full bg-live/10 blur-md"
      />

      {/* Pulse ring — x/y as FM values so they compose with scale (CSS translate conflicts) */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute rounded-full border"
          style={{
            borderColor: "rgba(204,255,0,0.6)",
            width: CORE_PX,
            height: CORE_PX,
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
          }}
          initial={{ opacity: 0.55, scale: 1 }}
          animate={{ opacity: 0, scale: 1.55 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {/* Core node */}
      <motion.button
        ref={coreRef}
        aria-label="Identity node: Nihar Domala — accepting missions"
        className="relative z-10 flex cursor-default items-center justify-center rounded-full border-2 border-live/60 bg-live/10 text-live focus-visible:outline-2 focus-visible:outline-live focus-visible:outline-offset-4"
        style={{ width: CORE_PX, height: CORE_PX }}
        animate={{
          scale: !reduce && hovered ? 1.08 : 1,
          boxShadow: hovered
            ? "0 0 40px 8px rgba(204,255,0,0.28)"
            : "0 0 24px 2px rgba(204,255,0,0.3)",
        }}
        transition={
          hovered
            ? { type: "spring", stiffness: 320, damping: 26, mass: 0.7 }
            : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <Target className="h-6 w-6" strokeWidth={1.75} aria-hidden />
      </motion.button>

      {/* Hover label — below outermost ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center font-mono text-[11px] leading-relaxed"
        style={{ top: "calc(50% + 58px)" }}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-ink-muted">identity: nihar.domala</div>
        <div className="text-live">status: accepting_missions</div>
      </motion.div>
    </motion.div>
  );
}
